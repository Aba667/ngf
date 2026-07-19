#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère les pages HTML du catalogue Naberan à partir de catalogue.json."""
import html
import json
import os
import re

SITE = "/Users/ababacar/Documents/site ngf/ngf-web"
OUT = os.path.join(SITE, "naberan")
CATALOGUE = json.load(open("catalogue.json", encoding="utf-8"))

A = ".."  # assets depuis naberan/<slug>.html

# Photos réutilisées depuis la boutique : là où une catégorie Naberan correspond
# à un produit déjà photographié de la boutique, on reprend sa vraie photo pour
# ne pas la perdre et illustrer le catalogue. (fichiers : assets/img/products/)
CATEGORY_IMG = {
    "poulies-reas-goupilles": "poulie-marine.jpg",
    "manilles": "manille-galvanisee.jpg",
    "cosses-coeur-ridoirs": "cosse-coeur.jpg",
    "cordes": "cordage-pe-bleu.jpg",
    "fil-ficelle": "bobine-fil-pe-vert.jpg",
    "filets": "filet-jaune.jpg",
    "cable-d-acier": "cable-acier-galvanise.jpg",
    "anodes": "anodes-lest.jpg",
    "flotteurs-bouees": "flotteur.jpg",
    "crochets-anneaux-de-senne": "crochet-levage.jpg",
}


def esc(s):
    return html.escape(str(s), quote=True)


def slugify_sub(s, i):
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return f"t{i}-{s}" if s else f"t{i}"


# --------------------------------------------------------------------------- gabarit commun
def head(title, desc):
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="theme-color" content="#071e3e">
<link rel="icon" type="image/svg+xml" href="{A}/assets/img/brand/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{A}/assets/css/base.css">
<link rel="stylesheet" href="{A}/assets/css/components.css">
<link rel="stylesheet" href="{A}/assets/css/naberan.css">
</head>
<body>

<a class="skip-link" href="#contenu">Aller au contenu</a>

<div class="topbar">
  <div class="container topbar__inner">
    <span class="topbar__loc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg> Môle 10 — Port de Dakar</span>
    <div class="topbar__right">
      <a href="tel:+221338424020"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z"/></svg> +221 33 842 40 20</a>
      <a href="mailto:depcom@ngomfreres.com"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg> depcom@ngomfreres.com</a>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="container site-header__inner">
    <a href="{A}/index.html" class="brand" aria-label="Groupe NGF — Accueil">
      <img class="brand__logo" src="{A}/assets/img/brand/logo-ngf.png" alt="Groupe NGF — Ngom &amp; Frères, Équipements Marines &amp; Industries">
    </a>
    <nav class="nav" id="nav" aria-label="Navigation principale">
      <a class="nav__link" href="{A}/index.html#equipements">Équipements</a>
      <a class="nav__link" href="{A}/boutique/index.html">Boutique</a>
      <a class="nav__link is-active" href="index.html">Catalogue Naberan</a>
      <a class="nav__link" href="{A}/index.html#filiales">Filiales</a>
      <a class="btn btn--azure" href="{A}/devis.html">Demander un devis</a>
    </nav>
    <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav">
      <b></b><b></b><b></b>
    </button>
  </div>
</header>

<main id="contenu">
'''


def footer():
    return f'''
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="footer-brand__chip"><img src="{A}/assets/img/brand/logo-ngf.png" alt="Groupe NGF"></span>
        <p>Depuis 1989, le Groupe NGF accompagne les professionnels du maritime, de l'industrie et de la logistique au Sénégal et en Afrique de l'Ouest.</p>
        <span class="mono">Ngom &amp; Frères SARL — Équipements Marines &amp; Industries</span>
      </div>
      <div class="footer-col">
        <h4>Le Groupe</h4>
        <nav aria-label="Liens Groupe">
          <a href="{A}/index.html#groupe">Qui sommes-nous</a>
          <a href="{A}/index.html#equipements">Équipements</a>
          <a href="{A}/boutique/index.html">Boutique en ligne</a>
          <a href="{A}/realisations.html">Références &amp; études de cas</a>
          <a href="{A}/devis.html">Demander un devis</a>
        </nav>
      </div>
      <div class="footer-col">
        <h4>Catalogue Naberan</h4>
        <nav aria-label="Catégories Naberan">
          <a href="index.html">Toutes les catégories</a>
          {"".join(f'<a href="{m["slug"]}.html">{esc(m["label"])}</a>' for m in CATALOGUE[:4])}
        </nav>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul class="footer-contact">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg><span>Môle 10<br>Port de Dakar, Sénégal</span></li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z"/></svg><span><a href="tel:+221338424020">+221 33 842 40 20</a><br><a href="tel:+221785892986">+221 78 589 29 86</a></span></li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg><span><a href="mailto:depcom@ngomfreres.com">depcom@ngomfreres.com</a></span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Groupe NGF — Tous droits réservés</span>
      <span>Dakar · Sénégal</span>
    </div>
  </div>
</footer>

<script src="{A}/assets/js/main.js"></script>
</body>
</html>
'''


def page_hero(crumb_label, h1, lead):
    return f'''
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <a href="{A}/index.html">Accueil</a><span class="sep">/</span>
        <a href="index.html">Catalogue Naberan</a>{'<span class="sep">/</span><span class="cur">' + esc(crumb_label) + '</span>' if crumb_label else ''}
      </nav>
      <h1>{h1}</h1>
      <p class="lead">{lead}</p>
    </div>
  </section>
'''


# --------------------------------------------------------------------------- page d'index
def build_index():
    total = sum(m["count"] for m in CATALOGUE)
    cards = []
    for i, m in enumerate(CATALOGUE, 1):
        img = CATEGORY_IMG.get(m['slug'])
        thumb = (f'\n          <span class="nab-card__thumb">'
                 f'<img src="{A}/assets/img/products/{img}" alt="" loading="lazy"></span>'
                 if img else '')
        cards.append(f'''
        <a class="nab-card{' nab-card--photo' if img else ''}" href="{m['slug']}.html">{thumb}
          <div class="nab-card__top">
            <span class="nab-card__num">{i:02d}</span>
            <span class="nab-card__count">{m['count']}</span>
          </div>
          <h3>{esc(m['label'])}</h3>
          <span class="nab-card__sub">{len(m['subs'])} gamme{'s' if len(m['subs'])>1 else ''} de produits</span>
          <span class="arrow-link">Voir le détail
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
          </span>
        </a>''')

    body = f'''
  <section class="section--navy" style="padding-block:clamp(64px,8vw,100px) 48px;">
    <div class="container nab-intro">
      <div class="nab-intro__text">
        <span class="kicker kicker--light">Partenaire du Groupe NGF</span>
        <h1 style="color:#fff;margin-top:16px;">Catalogue technique Naberan</h1>
        <p>
          Naberan (Pays basque, France &amp; Espagne) équipe les flottes de pêche du monde entier en
          accastillage, cordages, chaînes, flotteurs et matériel d'aquaculture. Le Groupe NGF est son
          partenaire de distribution au Sénégal — voici l'intégralité de la gamme, avec les références
          exactes du fabricant.
        </p>
        <div class="nab-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span>Catalogue de référence — photos indicatives pour les principales familles. Pour toute demande, indiquez la référence exacte du fabricant.</span>
        </div>
      </div>
      <div class="nab-intro__stats">
        <div><div class="n">{f"{total:,}".replace(",", " ")}</div><div class="t">Références</div></div>
        <div><div class="n">{len(CATALOGUE)}</div><div class="t">Catégories</div></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="sec-head">
        <div class="sec-head__main" data-reveal>
          <span class="kicker">Parcourir la gamme</span>
          <h2>19 familles de produits</h2>
          <p class="lead">Cliquez sur une catégorie pour voir toutes les références, tailles et caractéristiques techniques.</p>
        </div>
      </div>
      <div class="nab-grid">{''.join(cards)}
      </div>

      <div class="cta-band" style="margin-top:64px;" data-reveal>
        <div class="cta-band__text">
          <span class="kicker kicker--light">Commande</span>
          <h2 style="margin-top:16px;">Vous connaissez la référence ?</h2>
          <p>Communiquez-nous la référence Naberan et la quantité souhaitée — nous vous répondons avec le prix et le délai.</p>
        </div>
        <div class="cta-band__actions">
          <a class="btn btn--azure" href="{A}/devis.html">Demander un devis</a>
          <a class="btn btn--outline-light" href="https://wa.me/221785892986" target="_blank" rel="noopener">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9.2 8.4 8.6 8.6 0 0 1-3.4-.8L3 21l1.9-5.2a8.4 8.4 0 1 1 16.1-4.3z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
'''
    html_out = (
        head("Catalogue technique Naberan — Groupe NGF | Accastillage, cordages, chaînes, aquaculture",
             "Le catalogue complet Naberan distribué par le Groupe NGF au Sénégal : émerillons, manilles, chaînes, cordages, flotteurs, aquaculture — toutes les références du fabricant.")
        + body + footer()
    )
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_out)


# --------------------------------------------------------------------------- tableau produit
def render_table(sub, idx):
    cols = list(sub["columns"])
    rows = sub["rows"]
    max_vals = max((len(r["values"]) for r in rows), default=0)
    while len(cols) < max_vals:
        cols.append({"label": f"Car. {len(cols) + 1}", "unit": ""})

    # colonnes de queue entièrement vides (artefact d'alignement) : on les retire
    while cols and all(len(r["values"]) <= len(cols) - 1 or not r["values"][len(cols) - 1].strip() for r in rows):
        cols.pop()

    def th_cell(c):
        unit_html = f'<small>{esc(c["unit"])}</small>' if c["unit"] else ""
        return f'<th>{esc(c["label"])}{unit_html}</th>'

    th = "".join(th_cell(c) for c in cols)

    rows_html = []
    for r in sub["rows"]:
        vals = r["values"] + [""] * (len(cols) - len(r["values"]))
        tds = "".join(f"<td>{esc(v)}</td>" for v in vals)
        rows_html.append(f'<tr><td class="ref">{esc(r["ref"])}</td>{tds}</tr>')

    anchor = slugify_sub(sub["category"] + " " + sub["subtype"], idx)
    title = esc(sub["category"])
    sub_label = esc(sub["subtype"]) if sub["subtype"] else ""

    return anchor, f'''
      <div class="nab-sub" id="{anchor}">
        <div class="nab-sub__head">
          <h2>{title}</h2>
          {f'<span class="mono">{sub_label}</span>' if sub_label else ''}
        </div>
        <div class="nab-table-wrap">
          <table class="nab-table">
            <thead><tr><th>Référence</th>{th}</tr></thead>
            <tbody>{''.join(rows_html)}</tbody>
          </table>
        </div>
      </div>'''


def build_category(m):
    toc_items = []
    tables_html = []
    for i, sub in enumerate(m["subs"], 1):
        anchor, tbl = render_table(sub, i)
        label = sub["category"] + (f" — {sub['subtype']}" if sub["subtype"] else "")
        toc_items.append(f'<a href="#{anchor}">{esc(label)}</a>')
        tables_html.append(tbl)

    has_img = m["slug"] in CATEGORY_IMG
    lead = (f"{m['count']} références réparties en {len(m['subs'])} gammes. "
            + ("Photo indicative ci-dessous — indiquez la référence exacte pour votre demande."
               if has_img else
               "Photos à venir — utilisez la référence exacte pour votre demande."))

    hero_photo = (f'''
  <div class="container">
    <figure class="nab-cat-photo">
      <img src="{A}/assets/img/products/{CATEGORY_IMG[m['slug']]}" alt="{esc(m['label'])} — article distribué par le Groupe NGF" loading="lazy">
    </figure>
  </div>''' if has_img else "")

    body = (
        page_hero(m["label"], esc(m["label"]), lead)
        + hero_photo
        + f'''
  <section class="section">
    <div class="container">
      <div class="nab-toc" data-reveal>{''.join(toc_items)}</div>

      <div class="nab-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="nab-search-input" placeholder="Rechercher une référence, une taille…" autocomplete="off">
        <span class="nab-search__count" id="nab-search-count"></span>
      </div>

      <p class="nab-empty">Aucune référence ne correspond à votre recherche dans cette catégorie.</p>

      {''.join(tables_html)}
    </div>
  </section>
'''
    )
    html_out = (
        head(f"{m['label']} — Catalogue Naberan | Groupe NGF",
             f"{m['label']} : {m['count']} références Naberan distribuées par le Groupe NGF au Sénégal, avec tailles et caractéristiques techniques.")
        + body + footer()
    )
    html_out = html_out.replace("</body>", f'<script src="{A}/assets/js/naberan.js"></script>\n<div class="nab-back" role="button" tabindex="0" aria-label="Retour en haut"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg></div>\n</body>')
    with open(os.path.join(OUT, f"{m['slug']}.html"), "w", encoding="utf-8") as f:
        f.write(html_out)


def main():
    os.makedirs(OUT, exist_ok=True)
    build_index()
    for m in CATALOGUE:
        build_category(m)
    print(f"{len(CATALOGUE) + 1} pages écrites dans {OUT}")


if __name__ == "__main__":
    main()
