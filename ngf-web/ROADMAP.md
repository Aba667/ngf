# Feuille de route — Refonte du site Groupe NGF

> Objectif : reconstruire **intégralement** le site en **HTML / CSS / JS pur** (zéro WordPress),
> propre, organisé et **très professionnel**, pour le Groupe NGF et ses filiales.

Dernière mise à jour : 13 juillet 2026 (3) — *Moteurs Hidea = **catégorie « Moteurs Hidea » dans
la boutique** (5 produits tarifés, 1ʳᵉ catégorie ; seuls produits avec prix). Nouveau bouton
**« Commander »** → modale de choix **WhatsApp ou e-mail** (`commander.js` partagé) + note « service
client recontacte pour le paiement » (aucun paiement en ligne). La page `moteurs-hidea.html` détaillée
reste (fiche technique liée depuis chaque produit). Carte Équipements « Moteurs » : photo du moteur.
**Piriou Ngom** : nouvelle **section Actualités** (`filiales/piriou-ngom/actualites.html`) — article
baptême du **patrouilleur CAYOR** (22 oct. 2024, Président Faye), repris en carte sur les Actualités NGF.
**DEES** : section **Actualités** (`filiales/dees/actualites.html` + 2 articles) — **Centre de simulation
naval clé en main** (Marine nationale, Simrad Kongsberg) et **Mines & Industries** (Loulo Gold, SOMILO,
Vivo Energy Mako, SAR ; partenaire RESIMAC) ; réfs miniers ajoutés à Réalisations DEES ; carte simulateur
sur les Actualités NGF. Sources PDF archivées. Les 5 sous-sites ont désormais leurs pages ; DEES = 7 pages.
**Visionneuse photo (lightbox)** ajoutée dans `main.js` + `components.css` : toute photo de contenu est
cliquable (agrandissement plein écran, navigation ‹/›, Échap) sur tout le site, y compris les images
générées de la boutique ; logos, icônes et images de liens exclus.
Nouveaux contenus (14 juil.) : **DEES = 8 pages** avec l'article phare **Étanchéité & rénovation des dômes
de la Grande Mosquée de Touba** (`actualite-touba.html`, mis en vedette + carte sur les Actualités NGF) ;
**réception Hidea** (photo + vidéo 3,1 Mo) sur `moteurs-hidea.html` ; **huiles Siroil** = nouvelle
catégorie « Lubrifiants » dans la boutique (sur devis). Sources archivées dans `_sources-originales/`.
**Coutellerie (ex-Victorinox)** : abandon du domaine `victorinox-ngf-groupe.com` (demande Victorinox) →
site rapatrié en sous-domaine **`coutellerie.ngf-groupe.com`** (source `ngf-web/filiales/coutellerie/`, site autonome
copié tel quel par `build.py`) ; tous les liens du groupe pointent désormais dessus. **6 sous-domaines** au total.*

13 juillet 2026 (2) : page **Moteurs hors-bord Hidea** (`moteurs-hidea.html`), 5 modèles tarifés avec
fiches techniques (PDF Hidea). Section **Équipements** nettoyée : CTA **[Découvrir la boutique] +
[Nous consulter]** en bas. Correctif : Dr Fatou Diouf = **alors Ministre des Pêches et de l'Économie maritime**.*

13 juillet 2026 (1) : nouvelle **section Actualités** (`actualites/`) : index + articles datés.
1ᵉʳ article = **inauguration des nouveaux locaux** (22 mai 2025). Reportages **Hidea** (distribution
nationale + vidéo témoignages 8,5 Mo) et **HAFA** ajoutés aux Réalisations et repris en Actualités.
Médias rangés par dossier (`assets/img/actualites/<événement>/`) ; originaux archivés dans
`_sources-originales/<événement>/`.*

Précédent (11 juil.) : boutique sortie sur `shop.ngf-groupe.com` ; catalogue technique
(3 012 réf.) intégré à la boutique (~90 produits, marque fournisseur masquée — au Sénégal c'est NGF).

---

## 1. Vision & architecture multi-sites

Le Groupe NGF = la maison mère (équipements marins & industriels) + ses filiales.
Chaque entité a son propre sous-site, sur le **même domaine** avec un **préfixe différent**
(sous-domaine cPanel). La coutellerie Victorinox est un **site autonome** (design propre)
servi sur son sous-domaine `coutellerie.ngf-groupe.com`.

| Entité | Rôle | Adresse | Nature |
|---|---|---|---|
| **Groupe NGF** | Accueil, devis, références | `ngf-groupe.com` | domaine principal |
| **Boutique** | Boutique en ligne (produits + gammes techniques) | `shop.ngf-groupe.com` | sous-domaine |
| **Piriou Ngom Sénégal** | Construction & réparation navales | `piriou.ngf-groupe.com` | sous-domaine |
| **DEES** | Génie industriel (civil & mécanique) | `dees.ngf-groupe.com` | sous-domaine |
| **NGF Transit** | Transit & formalités douanières | `transit.ngf-groupe.com` | sous-domaine |
| **Coutellerie (Victorinox)** | Distribution officielle | `coutellerie.ngf-groupe.com` | sous-domaine (site autonome) |

> **NGF Transport a fermé (juillet 2026)** : filiale retirée du site (page, liens,
> mentions) et du dictionnaire `FILIALES` de `build.py`. Ne pas la réintroduire
> sans confirmation de l'équipe NGF.

**Décision (juillet 2026)** : les filiales sont des **sous-domaines** de `ngf-groupe.com`
— gratuits, créés en un clic dans cPanel, couverts par AutoSSL. Aucun domaine à acheter.
**Coutellerie Victorinox** (14 juil.) : Victorinox ayant demandé d'abandonner l'ancien
domaine `victorinox-ngf-groupe.com`, le site est rapatrié en sous-domaine
`coutellerie.ngf-groupe.com`. Source `ngf-web/filiales/coutellerie/` (site autonome, design propre) ;
`build.py` le copie tel quel. Le Groupe s'y lie en externe (nouvel onglet, label « Victorinox »).

Pour repasser à des domaines distincts (`dees-ngf-groupe.com`, …), il suffit de modifier
le dictionnaire `FILIALES` en haut de `build.py` : tous les liens croisés, canonicals et
sitemaps se réécrivent automatiquement.

### Assemblage par domaine — `build.py`

Le dossier de travail `ngf-web/` reste un site unique à chemins relatifs (pratique en local :
tout s'ouvre en double-cliquant). Pour la production :

```bash
python3 build.py
```

produit `dist/<adresse>/` pour chacun des 6 sites, en réécrivant automatiquement les liens
croisés (`../../index.html` → `https://ngf-groupe.com/`, `../dees/…` → `https://dees.ngf-groupe.com/…`,
`boutique/index.html` → `https://shop.ngf-groupe.com/`)
et en générant `sitemap.xml` + `robots.txt`.
Chaque dossier `dist/<adresse>/` se téléverse tel quel dans le document root correspondant.
`dist/` est régénéré à chaque exécution — ne jamais y faire de modifications à la main.

**La boutique est un site à part** (`shop.ngf-groupe.com`), au même titre que les filiales.
Dans le dépôt de travail, elle reste dans `boutique/` (liens relatifs, browsable en local) ;
`build.py` l'assemble dans `dist/shop.ngf-groupe.com/` (boutique servie à `/boutique/`,
`index.html` racine = redirection vers `/boutique/`). Le domaine principal n'héberge plus la
boutique : ses liens « Boutique » pointent vers le shop (nouvel onglet).

**Le catalogue technique est intégré à la boutique comme des produits.** Les 3 012 références
(gréement, câblerie, accastillage, flotteurs, aquaculture…) sont éclatées en **produits
individuels** (par type : manille droite/lyre/inox, poulie simple/double, émerillon à billes…),
ajoutés à `products.js` comme cartes produit normales, rangés dans les grandes catégories
(Accastillage, Câbles, Cordage & Fil, Filets, Aquaculture, Flotteurs & bouées, Anodes).
**Boutique = 187 produits** (178 avec photo, 9 « Photo à venir » : Aquaculture et
Crochets & anneaux de senne ; carte sans photo = tuile navy « Photo à venir »).
73 fiches partagent la **photo de famille** de leur catégorie (`famille-*.jpg`, tirées des
ouvertures de section du catalogue Naberan) : à remplacer par des photos par produit au fur
et à mesure. **40 fiches portent les specs constructeur** (dont 18 avec SWL) extraites du catalogue Naberan
(série de références, tailles, SWL avec son coefficient). ⚠️ La **SWL est une donnée de
sécurité** : elle n'est publiée que si la colonne du catalogue contenait exactement une
valeur par référence (sinon deux colonnes voisines se déversent l'une dans l'autre) et si
le coefficient 5:1 / 6:1 a été détecté. Les tableaux n'ont pas tous les mêmes colonnes
(les manilles inox n'ont pas de colonne taille et sont en 6:1). Script :
`_sources-originales/naberan-catalogue/` + LISEZ-MOI. Non enrichis volontairement :
les **Filets** (blocs en double, colonne taille = codes de maille) et les poulies
simple/double/émerillon/manille (le catalogue classe par usage, pas par construction).
**Aucune marque fournisseur n'est affichée** (au Sénégal c'est NGF), ce qui vaut
aussi pour les noms de fichiers.

**Familles de produits** (`boutique.js`) : les modèles d'une même catégorie qui partagent
la même photo sont réunis sous UNE carte « N modèles / Choisir un modèle » au lieu de N
vignettes identiques. Un clic ouvre une modale listant les modèles avec leurs specs (c'est
là que les tailles/SWL départagent). Critère = la photo : dès qu'un modèle reçoit sa propre
photo il quitte la famille automatiquement. Familles tarifées (moteurs) : la carte montre la
fourchette de prix, la modale garde prix + Commander + fiche technique par modèle. La
recherche désactive le regroupement (on cherche un modèle précis). Flags « Nouveau » retirés.

**Reconstruction depuis ngf-shop.com** (ancien shop WooCommerce du Groupe, accès admin perdu) :
l'API Store publique (`/wp-json/wc/store/v1/products`) a livré les 199 produits réels (photos
800×800 propres, sans filigrane, ce sont les vraies photos du stock NGF). **Fusion, pas
remplacement** : le catalogue Naberan (accastillage + specs SWL) était PLUS riche que le shop
sur l'accastillage, on l'a donc gardé et on a ajouté les gammes que le site n'avait pas :
**Pièces moteur Hidea** (62 pièces dédupliquées, libellés traduits EN→FR), **Protection &
vêtements de travail** (EPI), **Chambre froide**, **Sécurité & survie** (gilets, extincteur,
largueur), **Filtres**, **Électronique de bord**. Descriptions écrites (celles du shop étaient
vides ou = le nom). Catalogue : 187 → **292 produits**. Le shop n'avait AUCUN moteur complet
(que des pièces) : les 5 moteurs tarifés viennent toujours du catalogue, pas du shop.

**Formulaires de contact par filiale** (19 juil.) : chaque filiale (piriou-ngom, dees, transit)
a désormais un vrai formulaire sur sa page contact (form-card réutilisé de devis.html) + un
`contact.php` généré par build.py depuis `filiales/contact.php.tpl`, avec le destinataire de la
filiale injecté (transit → ngftransit@orange.sn ; dees/piriou → depcom@ngomfreres.com ; From =
contact@ngf-groupe.com, à créer dans cPanel comme devis@). Honeypot + validation + bandeaux flash
(?envoye/?erreur). **E-mail Transit** corrigé partout (21 occurrences) : ngftransit@orange.sn.
**Lot accastillage/filets** (photos web) : 15 fiches sorties de la photo de famille (émerillons,
maillons, chaînes, anneau levage, mousqueton) + fiche Raccords de feuillard. Familles restantes : 59.
Filigranes écartés (PngTree, AGROk/Alibaba, iStock) dans _sources-originales/accastillage-filets-web/.

**Lot EPI** (19 juil.) : 5 fiches EPI curées ajoutées (chaussure basse/montante, tabliers PVC
rouge/blanc, coton) depuis un lot de 36 photos web ; le reste écarté (redondant, ou tes propres
photos shop déjà en place, à ne pas dégrader). **Recherche boutique améliorée** : par MOTS et
insensible aux accents (« gilet sauvetage » trouve « Gilet de Sauvetage » ; « emerillon » trouve
« Émerillon »). **Coutellerie** : tirets longs nettoyés dans script.js (noms produits JS) + skip-link
a11y ajouté. **Tests pré-démo** : 26 pages auditées (0 lien mort, 0 image cassée, 0 erreur console,
SEO complet, mobile+desktop OK, a11y skip-link partout) + 22 tests fonctionnels (boutique, familles,
panier, WhatsApp, recherche, formulaires filiales, navigation inter-sites) : tout vert. Catalogue = 298 produits.
Les anciennes pages tableaux `naberan/` ne sont plus publiées ; seule la donnée
`naberan/_pipeline/catalogue.json` est conservée comme source.

**Important** : l'activité équipements maritimes est présentée comme **NGF Maritime,
la première filiale du Groupe** (la filiale historique, 1989). Elle n'a pas de site séparé :
c'est la section « Équipements » du site principal, prolongée par la boutique `shop.ngf-groupe.com`.

---

## 2. Structure technique du projet

```
site ngf/
├── ngf-web/                    → LE SITE (21 Mo)
│   ├── index.html              → Accueil GROUPE ✅
│   ├── ROADMAP.md · README.md · CONTENU-SOURCE.md
│   ├── boutique/index.html     → Boutique en ligne (→ shop.ngf-groupe.com via build.py)
│   │                             123 produits (34 photographiés + catalogue éclaté, photos à venir)
│   ├── naberan/                → ⚠️ DÉPRÉCIÉ : pages tableaux plus publiées. Conservé pour
│   │   │                         _pipeline/catalogue.json (source des 19 familles-produits).
│   │   └── _pipeline/          → extraction PDF + catalogue.json (archive de données)
│   ├── assets/
│   │   ├── css/
│   │   │   ├── base.css        → design system (tokens, typo, boutons) ✅
│   │   │   ├── components.css  → topbar, header, footer, CTA, mosaïque ✅
│   │   │   ├── home.css        → sections de la home ✅
│   │   │   ├── filiale.css     → gabarit des sous-sites ✅
│   │   │   ├── boutique.css    → catalogue, filtres, panier ✅
│   │   │   └── naberan.css     → tableaux techniques, recherche ✅
│   │   ├── js/
│   │   │   ├── main.js         → header compact, burger, reveal, compteurs ✅
│   │   │   ├── products.js     → catalogue (source unique de vérité) ✅
│   │   │   ├── boutique.js     → filtres, recherche, tri, panier, WhatsApp ✅
│   │   │   └── naberan.js      → recherche en direct sur les tableaux ✅
│   │   └── img/                → 380 fichiers, triés par usage
│   │       ├── brand/ leadership/ media/ partners/ products/ realisations/ filiales/
│   └── filiales/               → 3 sous-sites, 16 pages ✅
│       ├── piriou-ngom/  (index, services, realisations, contact, actualites)
│       ├── dees/         (index, services, realisations, contact, actualites + 3 articles)
│       └── transit/      (index, services, contact)
│           (Victorinox → site externe, pas de pages ici)
└── _sources-originales/        → archive : planches montages + logos bruts
                                  + anciennes pages HTML + photos sources par lot
                                  (pompes-forani, bacs-poisson, dees-marine-2025).
                                  ⚠️ pompes-forani/filigrane-tyboat-ne-pas-publier/
                                  = photos filigranées d'un concurrent, à ne pas
                                  publier ni recadrer (voir le LISEZ-MOI du dossier).
```

**Identité visuelle** : navy `#0A2C5B` / azur `#16A7E0` (logo officiel), typo Archivo + Inter
+ IBM Plex Mono (labels techniques), sections numérotées, grandes photos, style corporate industriel.

### ⚠️ Règle de liens

Toujours écrire les liens **vers le fichier**, jamais vers le dossier :

```html
<a href="filiales/dees/index.html">   <!-- ✅ marche partout -->
<a href="filiales/dees/">             <!-- ❌ ne s'ouvre pas en local (file://) -->
```

Un lien vers un dossier n'est résolu en `index.html` que par un **serveur web**. En ouvrant
le site depuis le disque (double-clic), le navigateur affiche une liste de fichiers ou une erreur.

**Logos** : NGF (officiel), Piriou Ngom, Victorinox, DEES, **NGF Transit** — tous réels.

---

## 3. Phases de production

### ✅ Phase 0 — Fondations (FAIT)
- [x] Diagnostic de l'ancien site (WordPress + HTML monolithique 336 Ko)
- [x] Structure de projet propre, médias triés et renommés
- [x] Extraction des vrais logos (NGF, DEES) et nettoyage des photos (recadrages)

### ✅ Phase 1 — Design system + Home groupe (FAIT)
- [x] Design system complet (4 CSS + JS)
- [x] Home : hero, chiffres clés animés, Le Groupe, Équipements (maison mère),
      Mot du Président (portrait soigné sur carte + plaque), index des 5 filiales,
      mosaïque réalisations (avec tuile vidéo), partenaires, contact, footer
- [x] Vérification : 590 liens locaux OK, structure HTML équilibrée

### ✅ Phase 2 — Sous-sites filiales (FAIT — v1 complète)
- [x] Gabarit filiale commun (hero, points forts, à-propos, services, réalisations, contact)
- [x] 3 sous-sites × 4 pages, contenus rédigés par métier, vrais logos intégrés

### ✅ Phase 3 — Boutique, partenaires, vraies photos & nettoyage (FAIT)
- [x] **Boutique en ligne** : 34 produits, 9 catégories, recherche, tri, filtres,
      panier persistant (`localStorage`), commande WhatsApp pré-remplie
- [x] Lien « Voir notre boutique » depuis la home (bande dédiée) + nav + footer
- [x] **Partenaires : 8 → 14 marques** (ajout Simrad, JRC, MaxSea, BASF, Resimac, Piriou)
- [x] Section **« Sept valeurs »** (bande sombre) + histoire de la fondation (1989)
- [x] **Vraies photos par filiale** : camions NGF (Transit), chantiers DEES
      recadrés depuis les planches, coque sur slip / hélice / soudeur (Piriou)
- [x] Ajout du **Centre de simulation naval** et de la flotte NGF à la mosaïque de la home
- [x] **Logo NGF Transit** retrouvé et intégré (détouré)
- [x] Contenu éditorial sauvegardé dans `CONTENU-SOURCE.md` (clients, procédés, références)
- [x] **Nettoyage : 854 Mo → 60 Mo** (WordPress, zips, sauvegardes, doublons supprimés)

### 🔵 Phase 4 — Revue & enrichissement (EN COURS)
- [x] **Home retravaillée — direction sobre et corporate** (retour d'Ababacar : rien ne doit
      bouger tout seul) : aucun défilé ni zoom automatique, grille de logos fixe, ornements
      supprimés (pointillés, médaillon, chips). Conservé : section « Nos locaux » (2 nouvelles
      photos du siège — d'autres à venir), tuiles réalisations cliquables vers les filiales,
      bloc contact à 3 cartes, valeurs en grille filet 1 px, numérotation homogène des
      sections 01-06, scroll-spy, schema.org
- [x] **Gabarit filiales poli** : numérotation automatique des cartes prestations,
      micro-interactions au survol uniquement (jamais autonomes), hiérarchie du hero renforcée
- [x] **`build.py`** : assemblage des 5 sites déployables par domaine, liens croisés réécrits
- [x] **SEO technique généré par `build.py`** : canonical, og:url/og:image/twitter:card
      par page, `sitemap.xml` et `robots.txt` par domaine
- [x] **Formulaire de devis** : `devis.html` + `devis.php` (mail() o2switch, honeypot),
      relié depuis la home, la boutique et les pages contact des filiales
- [x] **Boutique sans prix** (décision Ababacar) : produits, références, descriptions ;
      le panier devient une **liste de demande de devis** envoyée par e-mail à l'adresse
      du site (`devis-produits.php`), WhatsApp en canal secondaire
- [x] **Liens de catégories boutique** branchés (`#pompes`, `#securite`, …)
- [x] **Images optimisées** : PNG photographiques → JPEG, recompression (10 → 6,3 Mo)
- [x] **`realisations.html`** — études de cas : DP World (charge d'essai Bureau Veritas,
      photo d'époque recadrée), SAR, rechargement céramique, simulateur Marine
- [x] **« NGF Maritime »** : l'ex-« maison mère » est présentée comme la première filiale
- [x] **Favicon par site** : trident (groupe), ancre (Piriou), engrenage (DEES), conteneur
      (Transit) — même famille visuelle navy/azur
- [x] **Navigation inter-sites en nouvel onglet** : tout lien qui traverse un domaine
      (groupe ↔ filiales, filiale ↔ filiale) porte `target="_blank"` — 110 liens traités
- [x] **Section « Nos locaux » aérée** : photos espacées, légendes posées sous l'image
      (filet fin), zoom doux au survol uniquement
- [ ] **Revue par Ababacar** : textes, photos, exactitude des services par filiale
- [ ] Pages Réalisations détaillées à partir de `CONTENU-SOURCE.md` :
      DP World (charge de test, Bureau Veritas), SAR (RESICHEM 501), rechargement
      céramique (RESIMETAL 102 / 3M Thortex), simulateur Marine
      → recadrer les photos depuis `_sources-originales/planches/`
- [x] ~~Prix de la boutique~~ — décision : **aucun prix public**, tout passe par le devis
- [ ] Numéro WhatsApp de la boutique à confirmer (actuellement `+221 78 589 29 86`)
- [ ] Photos haute définition PAYSAGE par filiale (certains heros sont des photos portrait)
- [ ] Optimisation des images (compression WebP + tailles multiples) — `media/` pèse 14 Mo
- [ ] Pages **Actualités** et **Demander un devis** (présentes sur l'ancien site)
- [ ] FR/EN éventuel (à décider)

### ✅ Phase 5 — Catalogue technique Naberan (FAIT)
- [x] **Extraction complète du PDF fournisseur** (`naberan_catalogo_productos_2018.pdf`,
      143 pages) par position (blocs MuPDF), toutes catégories : émerillons, manilles,
      chaînes, cordages, poulies, flotteurs, aquaculture, câble acier, etc.
- [x] **3 012 références** nettoyées et regroupées en **19 catégories** / ~150 gammes,
      libellés traduits/normalisés en français (le PDF est déjà trilingue FR·EN·ES)
- [x] **20 pages générées** (`naberan/index.html` + 19 pages catégorie) : tableaux de
      caractéristiques triables, recherche en direct par référence, aucune photo pour
      l'instant (à ajouter quand l'équipe NGF les fournira)
- [x] Intégré au site : logo Naberan cliquable (section Partenaires), carte « Chaluts,
      filets & câblerie » de la home, footer
- [x] **Catalogue technique fusionné dans la boutique** (juillet 2026, décision Ababacar) :
      le catalogue est **éclaté en produits individuels** dans `products.js` (par type de
      produit), rangés dans **22 catégories navigables** — l'accastillage n'est plus un fourre-tout
      mais est découpé en familles : Manilles, Poulies & réas, Émerillons, Maillons & margouillets,
      Cosses & ridoirs, Crochets & anneaux de senne, Anneaux, Chaînes & connecteurs, Manchons &
      terminaisons, Levage & manutention ; + Cordages, Fils & ficelles, Filets, Câbles, Aquaculture,
      Flotteurs & bouées, Anodes (et Pompes, Bacs, Palettes, Cerclage, Sécurité). Cartes produit
      normales, avec panier/devis. **Boutique = 187 produits** (max ~23 par catégorie), 178
      photographiés, ~90 en « Photo à venir » (tuile navy avec icône appareil photo ; photos
      ajoutées au fur et à mesure par NGF). **Zéro mention « Naberan »** côté produits (le logo
      reste au mur des partenaires, à la demande d'Ababacar).
      Les pages tableaux `naberan/` ne sont plus publiées (build.py ne construit que `boutique/`).
- [x] **Scroll fluidifié** : `backdrop-filter: blur()` retiré de l'en-tête collant, de la barre
      d'outils boutique et des badges de tuiles (reflou par frame = cause du scroll lent),
      remplacé par un fond quasi-opaque.
- [ ] Photos produits à ajouter quand disponibles
- [ ] Prix à confirmer si besoin (actuellement : devis uniquement, comme la boutique)

### ⬜ Phase 6 — Mise en ligne o2switch
- [ ] **Sauvegarde complète JetBackup** avant toute manipulation serveur
- [ ] Vider `public_html` sur le serveur (le WordPress encore en ligne)
- [ ] **Créer l'adresse `devis@ngf-groupe.com`** dans cPanel (E-mail → Comptes) : expéditeur
      technique des formulaires — sinon les e-mails partent en indésirables.
      Ajouter un redirecteur vers `depcom@ngomfreres.com` pour voir les rebonds.
- [ ] **Vérifier SPF + DKIM** : cPanel → E-mail → Délivrabilité des e-mails → « Réparer »
- [ ] **Créer les 4 sous-domaines** (cPanel → Domaines → Sous-domaines) : `shop`, `piriou`,
      `dees`, `transit` — un document root distinct par sous-domaine (⚠️ ne pas
      partager celui du domaine principal). `shop` héberge la boutique + le catalogue Naberan
      (avec `boutique/devis-produits.php` — mêmes prérequis mail que `devis.php`).
- [ ] `python3 build.py` puis téléverser chaque `dist/<adresse>/` dans son document root
- [ ] SSL : cPanel → Sécurité → SSL/TLS Status → **Run AutoSSL** (couvre le domaine et
      tous ses sous-domaines d'un coup) + redirection HTTPS
- [ ] `.htaccess` propre (plus de règles WordPress)
- [ ] **Changer le mot de passe cPanel** (identifiants ayant circulé sur WhatsApp)

## 4. En attente de l'équipe NGF
- [ ] SVG/PNG HD de tous les logos si disponibles
- [ ] Coordonnées propres à chaque filiale (tél/email dédiés — actuellement : standard du groupe partout)
- [ ] Validation des **prix** et du **numéro WhatsApp** de la boutique
- [ ] Validation du mot du Président (texte proposé à partir de la philosophie officielle)
- [ ] Autorisation de citer les clients (DP World, SAR) sur les pages Réalisations
- [ ] Horaires d'ouverture (non affichés pour l'instant, volontairement)
