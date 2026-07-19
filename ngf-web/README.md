# Site Groupe NGF — refonte HTML/CSS/JS

Site vitrine du **Groupe NGF** (Ngom & Frères SARL) et de ses filiales.
100 % statique : HTML, CSS, JavaScript. **Aucun WordPress, aucune base de données.**

## Lancer en local

Depuis ce dossier :

```bash
python3 -m http.server 8080
```

Puis ouvrir <http://localhost:8080>.

> Utiliser un serveur local (et pas un double-clic sur le fichier) pour que les chemins
> `/assets/...` et la navigation entre pages fonctionnent correctement.

## Organisation

- `index.html` — page d'accueil du Groupe
- `assets/css/` — `base.css` (design system) + `components.css` + styles par page
- `assets/js/main.js` — interactions (menu mobile, animations)
- `assets/img/` — médias classés par usage (`brand`, `leadership`, `media`, `partners`, `products`, `realisations`, `filiales`)
- `filiales/` — sites des filiales (à venir)

## Feuille de route

Voir [ROADMAP.md](ROADMAP.md) pour l'avancement et les prochaines étapes.

## Convention

- Fichiers en minuscules, sans espaces ni accents.
- CSS et JS externes (jamais de gros blocs inline).
- Composants communs (en-tête, pied de page) identiques sur toutes les pages pour la cohérence.
