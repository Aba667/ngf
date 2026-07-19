#!/usr/bin/env python3
"""Enrichit les 5 sections restantes (poulies, flotteurs, filets, manchons, chaines).

Cle de mapping = (page, cote, 1re ref) : la seule 1re ref ne suffit plus, 4PASKT1-1
ouvre quatre blocs differents (p75D, p76D, p77D, p99G).
Garde-fous SWL identiques : ratio obligatoire + une valeur par reference.
"""

import json, re, pathlib

BLOCS = json.loads((pathlib.Path(__file__).parent / "naberan-blocs2.json").read_text(encoding="utf-8"))
JS = pathlib.Path("/Users/ababacar/Documents/site ngf/ngf-web/assets/js/products.js")

# fiche NGF -> (page, cote, 1re ref Naberan)
MAP = {
    # --- Poulies & réas : le catalogue classe par USAGE, mes fiches par construction.
    #     On ne mappe que les recouvrements certains.
    "POU-INOX":   (79, "G", "4PAKT1-1ESS"),
    "POU-SNATCH": (90, "D", "4PAKSW1-NG"),
    "REA-RECH":   (99, "G", "4PASKT1-1"),
    "GOUP-AXES":  (91, "G", "4PAPKSW1-N"),
    # --- Chaînes & connecteurs
    "CHN-JAUNE":   (64, "G", "HLL-9-8"),
    "CHN-MAILLON": (67, "D", "TL07"),
    # --- Manchons & terminaisons
    "MCH-ALU":     (122, "G", "4CQTSU10"),
    "MCH-CUIVRE":  (122, "D", "4CQTK03"),
    "TERM-EMBOUT": (123, "D", "4TMNE10"),
    # --- Flotteurs & bouées
    "FLOT-VALVE":  (101, "G", "F-0"),
    "FLOT-CHALUT": (104, "G", "N-280/6"),
    "FLOT-PROF":   (105, "G", "N-80/6"),
}

NB = re.compile(r'^\d{1,4}(?:[,.]\d{1,3})?$')


def num(s):
    s = s.strip()
    return float(s.replace(",", ".")) if NB.match(s) else None


def norm(s):
    return re.sub(r'\s+', " ", s.replace('"', "″").replace("”", "″")).strip()


def plage(vals, num_only=False):
    vals = [v.strip() for v in vals if v and v.strip()]
    if not vals:
        return None
    nums = [num(v) for v in vals]
    if all(n is not None for n in nums):
        lo, hi = min(nums), max(nums)
        f = lambda x: (f"{x:g}").replace(".", ",")
        return f(lo) if lo == hi else f"{f(lo)} à {f(hi)}"
    if num_only:
        return None
    a, b = norm(vals[0]), norm(vals[-1])
    return a if a == b else f"{a} à {b}"


def trouve(page, cote, ref):
    for b in BLOCS:
        if b["page"] == page and b["cote"] == cote and b["refs"] and b["refs"][0] == ref:
            return b
    return None


def phrase(b):
    n = len(b["refs"])
    bouts, rejets = [], []
    if b["taille"]:
        if len(b["taille"]) == n:
            t = plage(b["taille"])
            if t:
                bouts.append(f"Tailles {t}")
        else:
            rejets.append(f"taille {len(b['taille'])}/{n}")
    if b["swl"]:
        if len(b["swl"]) != n:
            rejets.append(f"swl {len(b['swl'])}/{n}")
        elif not b["ratio"]:
            rejets.append("swl sans ratio")
        else:
            sw = [num(v) for v in b["swl"]]
            if any(x is None for x in sw):
                rejets.append("swl non numerique")
            elif max(sw) > 150:
                rejets.append(f"swl invraisemblable ({max(sw)})")
            else:
                bouts.append(f"SWL {plage(b['swl'], num_only=True)} t (coefficient {b['ratio']})")
    if n > 1:
        bouts.append(f"{n} références, de {b['refs'][0]} à {b['refs'][-1]}")
    return (". ".join(bouts) + "." if bouts else None), rejets


def main():
    js = JS.read_text(encoding="utf-8")
    faits = 0
    for ref, (p, c, nab) in MAP.items():
        b = trouve(p, c, nab)
        if not b:
            print(f"  {ref:<14} bloc introuvable (p{p}{c} {nab})"); continue
        ph, rejets = phrase(b)
        if not ph:
            print(f"  {ref:<14} rien d'exploitable"); continue
        pat = re.compile(r'(\{ ref: "' + re.escape(ref) + r'".*?desc: ")([^"]*)(" \})', re.S)
        m = pat.search(js)
        if not m:
            print(f"  {ref:<14} fiche introuvable"); continue
        if "SWL" in m.group(2) or "références, de" in m.group(2):
            print(f"  {ref:<14} deja enrichie, ignoree"); continue
        js = pat.sub(lambda mm: mm.group(1) + mm.group(2).rstrip() + " " + ph + mm.group(3), js, count=1)
        faits += 1
        tag = "SWL" if "SWL" in ph else "   "
        print(f"  {ref:<14} {tag} {ph[:84]}")
        if rejets:
            print(f"                 ↳ rejeté : {', '.join(rejets)}")
    JS.write_text(js, encoding="utf-8")
    print(f"\n{faits} fiches enrichies")


if __name__ == "__main__":
    main()
