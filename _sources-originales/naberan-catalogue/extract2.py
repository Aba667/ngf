#!/usr/bin/env python3
"""Extracteur v2 du catalogue Naberan : couvre toutes les sections.

v1 ratait 5 sections pour 3 raisons distinctes :
  - les refs ne commencent pas toutes par "4" (chaines : HLL-9-8, flotteurs : N-280/6,
    filets : 3NY42) -> on ne devine plus la ref par regex, on prend ce qui se trouve
    dans la COLONNE sous l'en-tete REF ;
  - l'en-tete s'ecrit "REF" ou "REF." (manchons) ;
  - les poulies s'etalent sur p74-99, v1 ne regardait que p74-80.

Garde-fous SWL inchanges : ratio obligatoire + une valeur par ref (verifie en aval).
"""

import fitz, re, json, pathlib

PDF = "/Users/ababacar/Documents/site ngf/_sources-originales/naberan-catalogue/naberan_catalogo_productos_2018.pdf"
OUT = pathlib.Path(__file__).parent / "naberan-blocs2.json"
MILIEU = 610
EST_REF_ENTETE = re.compile(r'^REF\.?$', re.I)
# une reference : au moins un chiffre, pas d'espace, pas de la ponctuation seule
EST_CODE = re.compile(r'^(?=.*\d)[A-Za-z0-9][A-Za-z0-9/.\-Ø]{1,20}$')


def lignes(pg):
    out = []
    for b in pg.get_text("dict")["blocks"]:
        if b["type"] != 0:
            continue
        for l in b["lines"]:
            t = "".join(s["text"] for s in l["spans"]).strip()
            if t:
                out.append({"t": t, "x": round(l["bbox"][0], 1), "y": round(l["bbox"][1], 1),
                            "sz": round(max(s["size"] for s in l["spans"]), 1)})
    return out


def est_titre(it):
    t = it["t"]
    return (" · " in t and 6 < it["sz"] < 12
            and not t.startswith(("NABERAN", "www")) and "|" not in t and "Nøble" not in t)


def classe(mots):
    m = " ".join(mots).upper()
    if EST_REF_ENTETE.match(mots[0].strip()) or re.search(r'\bREF\.?\b', m):
        return "ref", None
    if any(w in m for w in ("TAMAÑO", "SIZE", "MESURE", "MESURES")):
        return "taille", None
    if "TON" in m or re.search(r'\bSWL\b', m):
        r = re.search(r'(\d)\s*[:.]\s*0?(\d)', m)
        return "swl", (f"{r.group(1)}:{r.group(2)}" if r else None)
    if "PESO" in m or "WEIGHT" in m or "POID" in m:
        return "poids", None
    if "SACO" in m or "SACK" in m or "SACS" in m:
        return "sacs", None
    if "MM" in m:
        return "cote", None
    return None, None


def colonnes(col, y_haut, y_bas):
    piles = {}
    for j in col:
        if not (y_haut <= j["y"] < y_bas):
            continue
        k = round(j["x"] / 6)
        piles.setdefault(k, {"x": j["x"], "mots": []})["mots"].append(j["t"])
    out = []
    for p in piles.values():
        cle, ratio = classe(p["mots"])
        if cle:
            out.append({"x": p["x"], "cle": cle, "ratio": ratio})
    out.sort(key=lambda c: c["x"])
    return out


def extraire():
    doc = fitz.open(PDF)
    blocs = []
    for ip, pg in enumerate(doc):
        items = lignes(pg)
        for cote, (x0, x1) in (("G", (0, MILIEU)), ("D", (MILIEU, 9999))):
            col = sorted([i for i in items if x0 <= i["x"] < x1], key=lambda i: (i["y"], i["x"]))
            # reperer les en-tetes REF de cette demi-page
            entetes = [i for i in col if EST_REF_ENTETE.match(i["t"])]
            if not entetes:
                continue
            titres = [i for i in col if est_titre(i)]
            for n, e in enumerate(entetes):
                y_fin = entetes[n + 1]["y"] - 30 if n + 1 < len(entetes) else 9999
                cols = colonnes(col, e["y"] - 26, e["y"] + 26)
                c_ref = [c for c in cols if c["cle"] == "ref"]
                if not c_ref:
                    continue
                xr = c_ref[0]["x"]
                # titre = dernier titre au-dessus de cet en-tete
                au_dessus = [t for t in titres if t["y"] < e["y"]]
                titre = " / ".join(t["t"] for t in au_dessus[-2:]) if au_dessus else "(sans titre)"
                b = {"page": ip + 1, "cote": cote, "titre": titre, "refs": [],
                     "taille": [], "swl": [], "ratio": None,
                     "colonnes": [c["cle"] for c in cols]}
                r = [c["ratio"] for c in cols if c["cle"] == "swl" and c["ratio"]]
                b["ratio"] = r[0] if r else None
                for it in col:
                    if not (e["y"] + 8 < it["y"] < y_fin):
                        continue
                    if abs(it["x"] - xr) > 8 or not EST_CODE.match(it["t"]):
                        continue
                    b["refs"].append(it["t"])
                    for j in col:
                        if abs(j["y"] - it["y"]) > 3 or j is it:
                            continue
                        proche = min(cols, key=lambda c: abs(c["x"] - j["x"]))
                        if abs(proche["x"] - j["x"]) > 22:
                            continue
                        if proche["cle"] == "taille":
                            b["taille"].append(j["t"])
                        elif proche["cle"] == "swl":
                            b["swl"].append(j["t"])
                if b["refs"]:
                    blocs.append(b)
    OUT.write_text(json.dumps(blocs, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(blocs)} blocs -> {OUT.name}")
    return blocs


if __name__ == "__main__":
    bs = extraire()
    import collections
    par_sect = collections.Counter()
    for b in bs:
        par_sect[b["page"] // 10 * 10] += 1
    print("\nblocs par tranche de pages :", dict(sorted(par_sect.items())))
