#!/usr/bin/env python3
"""Injecte les specs Naberan dans les descriptions produit.

La SWL est une donnee de SECURITE. Deux garde-fous, apres deux bugs reels :
  1. le bloc est identifie par sa PREMIERE REFERENCE (stable), pas par un index
     dans une liste (l'indice bougeait selon le filtrage -> mauvais bloc, SWL fausse) ;
  2. une colonne n'est exploitable que si elle contient EXACTEMENT une valeur par
     reference. Sinon c'est que deux colonnes voisines se sont deversees dedans
     (ex. p7G : 26 valeurs pour 13 refs ; p24G : la colonne "SACS DE" lue comme SWL,
     d'ou un "SWL 100 t" sur un maillon de 4 mm).
Tout ce qui ne passe pas ces deux tests n'est pas publie.
"""

import json, re, pathlib

BLOCS = json.loads((pathlib.Path(__file__).parent / "naberan-blocs.json").read_text(encoding="utf-8"))
JS = pathlib.Path("/Users/ababacar/Documents/site ngf/ngf-web/assets/js/products.js")

# ref produit NGF -> premiere reference Naberan du bloc correspondant
MAP = {
    "MAN-NOIR-D": "4GRF06DS",  "MAN-TC": "4GRF08HS",
    "MAN-BLEU-D": "4GRFK10DB", "MAN-BLEU-V": "4GRFK13HB",
    "MAN-LYRE-GAL": "4GRF05HGE", "MAN-PITON": "4GRF05DGE",
    "MAN-GOUP": "4GRF10DGC",   "MAN-SECU": "4GRF06HGPS",
    "MAN-D-INOX": "4GRF04DSS", "MAN-LYRE-INOX": "4GRF04HSS",
    "EME-FORGE": "4GIA16FO",   "EME-INOX": "4GIA06SS",
    "EME-MANILLE": "4GIA12SSS", "EME-BILLES": "4GISKLI-10-8",
    "EME-GRAISSAGE": "4GIA401",
    "ANNEAU-INOX": "4ANC0630SSR", "ANNEAU-ACIER": "4ANC1270STP",
    "ANNEAU-G80": "4ANO68",    "ANNEAU-NYLON": "4ANPT16-60",
    "MAR-GALVA": "4ESDQB03GAO", "MAR-INOX": "4ESDQB06SSOL",
    "MAR-POIRE": "4MODC08SSB", "MARG-DE": "4MODC06SS",
    "COS-GALVA": "4GUGK210004", "COS-RONDE": "4GUG31748",
    "COS-INOX": "4GUG110002",  "COS-BLEU": "4GUG212",
    "RID-LANTERNE": "4TEG220005",
}

NB = re.compile(r'^\d{1,3}(?:[,.]\d{1,3})?$')


def num(s):
    s = s.strip()
    return float(s.replace(",", ".")) if NB.match(s) else None


def pouces(s):
    """Normalise les guillemets pouce en double prime : ne casse pas la chaine JS."""
    return re.sub(r'\s+', " ", s.replace('"', "″").replace("”", "″")).strip()


def plage(vals, unite_num=False):
    vals = [v.strip() for v in vals if v and v.strip()]
    if not vals:
        return None
    nums = [num(v) for v in vals]
    if all(n is not None for n in nums):
        lo, hi = min(nums), max(nums)
        f = lambda x: (f"{x:g}").replace(".", ",")
        return f(lo) if lo == hi else f"{f(lo)} à {f(hi)}"
    if unite_num:
        return None
    a, b = pouces(vals[0]), pouces(vals[-1])
    return a if a == b else f"{a} à {b}"


def bloc_par_ref(r):
    for b in BLOCS:
        if b["refs"] and b["refs"][0] == r:
            return b
    return None


def phrase(b):
    n = len(b["refs"])
    bouts, rejets = [], []

    # taille : une valeur par ref, sinon deversement de colonne
    if b["taille"]:
        if len(b["taille"]) == n:
            t = plage(b["taille"])
            if t:
                bouts.append(f"Tailles {t}")
        else:
            rejets.append(f"taille {len(b['taille'])}/{n}")

    # SWL : une valeur par ref + ratio detecte + plausible
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
                rejets.append(f"swl invraisemblable (max {max(sw)})")
            else:
                bouts.append(f"SWL {plage(b['swl'], unite_num=True)} t (coefficient {b['ratio']})")

    if n > 1:
        bouts.append(f"{n} références, de {b['refs'][0]} à {b['refs'][-1]}")
    return (". ".join(bouts) + "." if bouts else None), rejets


def main():
    js = JS.read_text(encoding="utf-8")
    faits, notes = 0, []
    for ref, nab in MAP.items():
        b = bloc_par_ref(nab)
        if not b:
            notes.append((ref, "bloc introuvable")); continue
        ph, rejets = phrase(b)
        if not ph:
            notes.append((ref, "rien d'exploitable")); continue
        pat = re.compile(r'(\{ ref: "' + re.escape(ref) + r'".*?desc: ")([^"]*)(" \})', re.S)
        m = pat.search(js)
        if not m:
            notes.append((ref, "fiche introuvable")); continue
        js = pat.sub(lambda mm: mm.group(1) + mm.group(2).rstrip() + " " + ph + mm.group(3), js, count=1)
        faits += 1
        swl = "SWL" if "SWL" in ph else "   "
        print(f"  {ref:<15} {swl} {ph[:88]}")
        if rejets:
            print(f"                  ↳ rejete : {', '.join(rejets)}")
    JS.write_text(js, encoding="utf-8")
    print(f"\n{faits} fiches enrichies")
    for r, w in notes:
        print(f"  note : {r} ({w})")


if __name__ == "__main__":
    main()
