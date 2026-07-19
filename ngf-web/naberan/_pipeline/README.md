# Pipeline du catalogue Naberan

Régénère les 20 pages de `naberan/` à partir du PDF fournisseur
(`naberan_catalogo_productos_2018.pdf` — 143 pages, envoyé par Ababacar en juillet 2026).

Ces scripts ne font pas partie du site livré : ils servent uniquement à reconstruire
le catalogue si Naberan publie une nouvelle édition du PDF. Nécessite `pip install pymupdf`.

## Utilisation

```bash
# 1. Copier le PDF fournisseur à côté des scripts (ou adapter la variable PDF)
cp /chemin/vers/naberan_catalogo_productos_2018.pdf .

# 2. Extraction brute (texte positionné -> tables.json)
python3 extract.py

# 3. Nettoyage (français, dédoublonnage -> catalogue.json)
python3 clean.py

# 4. Génération des pages HTML dans ngf-web/naberan/
python3 build_pages.py

# 5. Depuis ngf-web/ : régénérer dist/ pour les 4 sites déployables
cd .. && cd .. && python3 build.py
```

## Ce que fait chaque étape

- **`extract.py`** — lit le PDF page par page avec PyMuPDF, regroupe les mots par bloc
  de mise en page (position x/y), et repère les tableaux via leurs colonnes « REF »,
  « REF. », « CODIGO » ou « Ø » (variantes rencontrées selon les sections du catalogue).
  Rattache chaque tableau à sa catégorie (via l'en-tête trilingue FR·EN·ES) et à la
  catégorie majeure du sommaire (via le pied de page répété sur chaque page).
- **`clean.py`** — extrait le terme français de chaque en-tête trilingue, nettoie les
  libellés de colonnes, fusionne les références coupées en deux mots (ex. `JF`+`312`),
  fusionne les fractions de pouce coupées (`1`+`1/8"`), déduplique les lignes identiques.
  Contient `LABEL_FIX` et `RAW_PAIR_FIX` pour les corrections manuelles ponctuelles.
- **`build_pages.py`** — génère `naberan/index.html` + une page par catégorie majeure,
  avec le gabarit du site (topbar, header, footer) et la recherche en direct.

## Limites connues

- Les tableaux de cordage identifiés par diamètre seul (sans code SKU, ex. certaines
  gammes NABEFLEX) sont capturés avec le diamètre comme pseudo-référence.
- Quelques tableaux « combinaisons » (assemblages pré-montés, texte libre plutôt que
  cotes numériques) affichent leurs valeurs sous des en-têtes de colonnes approximatifs :
  la donnée est complète, seul l'alignement visuel est imparfait.
- Aucune photo produit : le catalogue actuel est volontairement sans images
  (à ajouter quand l'équipe NGF les fournira).
