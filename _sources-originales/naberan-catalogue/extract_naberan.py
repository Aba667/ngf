#!/usr/bin/env python3
"""Extrait les blocs produit du catalogue Naberan.

Piege : les tableaux n'ont pas tous les memes colonnes.
  p44 (galva)  : REF | MESURE(pouces) | SWL 5:1 Ton | A B C D mm | POIDS | SACS
  p48 (inox)   : REF | SWL 6:1 Ton    | A B C D mm  | POIDS            <- pas de MESURE !
Lire la position des colonnes en supposant un ordre fixe donne des SWL fausses.
On reconstruit donc, pour chaque abscisse, la PILE d'en-tetes (les libelles sont
empiles sur plusieurs lignes au-dessus de la 1re ligne de donnees) et on classe :
  pile contient TAMAÑO/SIZE/MESURE -> taille
  pile contient "Ton"              -> swl  (avec son ratio, 5:1 ou 6:1)
  pile contient "mm"               -> cote
  pile contient PESO/WEIGHT        -> poids
"""

import fitz, re, json, pathlib

PDF = "/Users/ababacar/Documents/site ngf/_sources-originales/naberan-catalogue/naberan_catalogo_productos_2018.pdf"
OUT = pathlib.Path(__file__).parent / "naberan-blocs.json"

REF = re.compile(r'^4[A-Z][A-Z0-9/.\-]{2,16}$')
MILIEU = 610


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


def colonnes_du_tableau(col, y_ref, y_data):
    """Pile d'en-tetes par abscisse, entre le haut de l'entete et la 1re ligne de donnees."""
    zone = [j for j in col if y_ref - 26 <= j["y"] < y_data - 3]
    piles = {}
    for j in zone:
        cle = round(j["x"] / 6)          # tolerance d'alignement
        piles.setdefault(cle, {"x": j["x"], "mots": []})["mots"].append(j["t"].strip())
    out = []
    for p in piles.values():
        m = " ".join(p["mots"]).upper()
        if "REF" in m:                      k = "ref"
        elif any(w in m for w in ("TAMAÑO", "SIZE", "MESURE")): k = "taille"
        elif "TON" in m:                    k = "swl"
        elif "MM" in m:                     k = "cote"
        elif "PESO" in m or "WEIGHT" in m:  k = "poids"
        elif "SACO" in m or "SACK" in m:    k = "sacs"
        else:                               k = None
        if k:
            ratio = None
            r = re.search(r'(\d)\s*[:.]\s*0?(\d)', m)
            if k == "swl" and r:
                ratio = f"{r.group(1)}:{r.group(2)}"
            out.append({"x": p["x"], "cle": k, "ratio": ratio})
    out.sort(key=lambda c: c["x"])
    return out


def extraire():
    doc = fitz.open(PDF)
    blocs = []
    for ip, pg in enumerate(doc):
        items = lignes(pg)
        if not any(REF.match(i["t"]) for i in items):
            continue
        for cote_p, (x0, x1) in (("G", (0, MILIEU)), ("D", (MILIEU, 9999))):
            col = sorted([i for i in items if x0 <= i["x"] < x1], key=lambda i: (i["y"], i["x"]))
            courant, cols = None, None
            for i, it in enumerate(col):
                t = it["t"]
                if est_titre(it):
                    if courant and not courant["refs"]:
                        courant["titre"] += " / " + t
                        continue
                    courant = {"page": ip + 1, "cote": cote_p, "titre": t, "refs": [],
                               "taille": [], "swl": [], "ratio": None, "colonnes": []}
                    blocs.append(courant)
                    cols = None
                elif t == "REF" and courant is not None:
                    suite = [j for j in col[i:] if REF.match(j["t"])]
                    if suite:
                        cols = colonnes_du_tableau(col, it["y"], suite[0]["y"])
                        courant["colonnes"] = [c["cle"] for c in cols]
                        r = [c["ratio"] for c in cols if c["cle"] == "swl" and c["ratio"]]
                        courant["ratio"] = r[0] if r else None
                elif courant is not None and REF.match(t) and cols:
                    courant["refs"].append(t)
                    ligne = [j for j in col if abs(j["y"] - it["y"]) < 3]
                    for j in ligne:
                        if j["t"] == t:
                            continue
                        proche = min(cols, key=lambda c: abs(c["x"] - j["x"]))
                        if abs(proche["x"] - j["x"]) > 22:
                            continue
                        if proche["cle"] in ("taille", "swl"):
                            courant[proche["cle"]].append(j["t"])
    blocs = [b for b in blocs if b["refs"]]
    OUT.write_text(json.dumps(blocs, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(blocs)} blocs -> {OUT.name}")
    return blocs


if __name__ == "__main__":
    bs = extraire()
    print("\n--- controle sur les deux tableaux pieges ---")
    for b in bs:
        if b["page"] in (44, 48) and b["cote"] == "G":
            print(f"\n  p{b['page']}{b['cote']}  {b['titre'][:56]}")
            print(f"     colonnes : {b['colonnes']}   ratio SWL : {b['ratio']}")
            print(f"     refs   : {b['refs'][0]} … {b['refs'][-1]}  ({len(b['refs'])})")
            print(f"     taille : {b['taille'][:1]} … {b['taille'][-1:]}")
            print(f"     swl    : {b['swl'][:1]} … {b['swl'][-1:]}")
