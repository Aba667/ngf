#!/usr/bin/env python3
"""
GROUPE NGF — Assemblage des sites déployables.

Le dépôt de travail (ngf-web/) est un site unique avec des chemins relatifs :
pratique en local. En production, chaque entité a SON adresse :

    ngf-groupe.com              → maison du groupe (accueil, devis, références)
    shop.ngf-groupe.com         → Boutique en ligne             ┐
    piriou.ngf-groupe.com       → Piriou Ngom Sénégal           │ sous-domaines cPanel
    dees.ngf-groupe.com         → DEES                          │ (gratuits)
    transit.ngf-groupe.com      → NGF Transit                   │
    coutellerie.ngf-groupe.com → Coutellerie (produits Victorinox) ┘

    La boutique est un site à part, shop.ngf-groupe.com. Le catalogue technique
    (gréement, câblerie, accastillage, flotteurs, aquaculture…) y est intégré comme
    des produits de la boutique — pas de marque fournisseur affichée (au Sénégal
    c'est NGF). Le domaine principal n'héberge plus la boutique : il pointe vers
    shop (nouvel onglet).

    NGF Transport a fermé (retiré du site en juillet 2026) : plus de filiale,
    plus de sous-domaine. Ne pas la réintroduire sans confirmation.

Ce script produit dist/<domaine>/ prêt à téléverser tel quel dans le
document root du domaine (cPanel o2switch) :

  1. réécrit les liens croisés en URL absolues
     (../../index.html → https://ngf-groupe.com/, ../dees/… → https://dees.ngf-groupe.com/…) ;
  2. injecte le SEO technique dans chaque page :
     <link rel="canonical">, og:url, og:image, og:title/description, twitter:card ;
  3. génère sitemap.xml et robots.txt par domaine.

Usage :  python3 build.py
"""

import re
import shutil
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
DIST = ROOT / "dist"

MAIN_DOMAIN = "ngf-groupe.com"

# La boutique (produits + catalogue Naberan) est un site à part, sur son sous-domaine.
SHOP_DOMAIN = f"shop.{MAIN_DOMAIN}"

# Chaque filiale est un SOUS-DOMAINE de ngf-groupe.com (gratuit, créé dans cPanel).
FILIALES = {
    "piriou-ngom": f"piriou.{MAIN_DOMAIN}",
    "dees": f"dees.{MAIN_DOMAIN}",
    "transit": f"transit.{MAIN_DOMAIN}",
}

# Destinataire du formulaire de contact de chaque filiale (généré : contact.php).
# Le From reste contact@ngf-groupe.com (domaine d'envoi, pour SPF/DKIM).
FILIALE_EMAILS = {
    "piriou-ngom": "depcom@ngomfreres.com",
    "dees": "depcom@ngomfreres.com",
    "transit": "ngftransit@orange.sn",
}
FILIALE_NOMS = {
    "piriou-ngom": "Piriou Ngom Sénégal",
    "dees": "DEES",
    "transit": "NGF Transit",
}

# Coutellerie (produits Victorinox) : site autonome rapatrié en sous-domaine
# (Victorinox nous a demandé d'abandonner l'ancien domaine victorinox-ngf-groupe.com).
COUTELLERIE_DOMAIN = f"coutellerie.{MAIN_DOMAIN}"

# Image de partage (WhatsApp, réseaux) par domaine — chemin relatif au site.
OG_IMAGES = {
    MAIN_DOMAIN: "assets/img/media/chalut-mer.jpg",
    SHOP_DOMAIN: "assets/img/media/chalut-mer.jpg",
    FILIALES["piriou-ngom"]: "assets/img/realisations/coque-navire.jpg",
    FILIALES["dees"]: "assets/img/realisations/dees-revetement-cuve.jpg",
    FILIALES["transit"]: "assets/img/realisations/camion-quai.jpg",
}


def url(domain: str, page: str = "") -> str:
    page = "" if page in ("", "index.html") else page
    return f"https://{domain}/{page}"


# ---------------------------------------------------------------------------
# Réécriture des liens croisés
# ---------------------------------------------------------------------------

# Tout lien vers un (sous-)domaine ngf-groupe.com qui n'a pas déjà un target
# explicite s'ouvre dans un nouvel onglet (convention inter-sites du Groupe).
# coutellerie.ngf-groupe.com est un sous-domaine : il est donc bien pris en
# compte (les liens qui l'ont déjà en target="_blank" ne sont pas re-modifiés).
_NEWTAB_RE = re.compile(
    r'<a\b(?![^>]*\btarget=)([^>]*\bhref="https://[a-z0-9.]*ngf-groupe\.com[^"]*"[^>]*)>')


def force_new_tab(html: str) -> str:
    return _NEWTAB_RE.sub(r'<a target="_blank" rel="noopener"\1>', html)


def rewrite_coutellerie(html: str) -> str:
    """Liens vers la coutellerie (`…/coutellerie/…`, relatifs dans le dépôt pour
    rester navigables en local) → sous-domaine absolu, comme les filiales."""
    return re.sub(
        r'href="(?:\.\./)*(?:filiales/)?coutellerie/([\w.-]+\.html)"',
        lambda m: f'href="{url(COUTELLERIE_DOMAIN, "" if m.group(1) == "index.html" else m.group(1))}"',
        html)


def rewrite_main(html: str) -> str:
    """Domaine principal : filiales, boutique et catalogue Naberan en absolu."""
    slugs = "|".join(FILIALES)
    html = re.sub(rf'href="(?:\.\./)?filiales/({slugs})/([\w.-]+\.html)"',
                  lambda m: f'href="{url(FILIALES[m.group(1)], m.group(2))}"', html)
    # La boutique est désormais un site à part.
    html = re.sub(r'href="(?:\.\./)?boutique/index\.html"',
                  f'href="{url(SHOP_DOMAIN)}"', html)
    html = rewrite_coutellerie(html)
    return force_new_tab(html)


def rewrite_actualites(html: str) -> str:
    """Pages Actualités (actualites/…) : hébergées sur le domaine principal.

    Les liens vers le groupe (../index.html, ../realisations.html…) et les
    assets (../assets/…) restent relatifs — actualites/ est un vrai sous-dossier
    de ngf-groupe.com. Seules les sorties vers la boutique et les filiales,
    devenues des (sous-)domaines distincts, passent en absolu."""
    html = html.replace('href="../boutique/index.html"', f'href="{url(SHOP_DOMAIN)}"')
    slugs = "|".join(FILIALES)
    html = re.sub(rf'href="\.\./filiales/({slugs})/([\w.-]+\.html)"',
                  lambda m: f'href="{url(FILIALES[m.group(1)], m.group(2))}"', html)
    html = rewrite_coutellerie(html)
    return force_new_tab(html)


def rewrite_shop(html: str) -> str:
    """Pages de la boutique (boutique/…) et du catalogue Naberan (naberan/…).

    Les deux dossiers restent à une profondeur (« ../ ») dans le shop : les
    assets et les liens boutique↔naberan restent donc relatifs. Seuls les liens
    qui sortent vers le groupe ou les filiales deviennent absolus."""
    html = re.sub(r'href="\.\./((?:index|devis|realisations|moteurs-hidea)\.html)(#[\w-]*)?"',
                  lambda m: f'href="{url(MAIN_DOMAIN, m.group(1))}{m.group(2) or ""}"',
                  html)
    # Actualités vivent sur le domaine principal, pas sur le shop.
    html = re.sub(r'href="\.\./actualites/index\.html"',
                  f'href="{url(MAIN_DOMAIN, "actualites/")}"', html)
    html = re.sub(r'href="\.\./actualites/([\w.-]+\.html)"',
                  lambda m: f'href="{url(MAIN_DOMAIN, "actualites/" + m.group(1))}"', html)
    slugs = "|".join(FILIALES)
    html = re.sub(rf'href="\.\./filiales/({slugs})/([\w.-]+\.html)"',
                  lambda m: f'href="{url(FILIALES[m.group(1)], m.group(2))}"', html)
    html = rewrite_coutellerie(html)
    return force_new_tab(html)


def rewrite_filiale(html: str, slug: str) -> str:
    """Pages d'une filiale : assets locaux, groupe/boutique et sœurs en absolu."""
    html = html.replace('"../../assets/', '"assets/')
    html = html.replace('href="../../boutique/index.html"',
                        f'href="{url(SHOP_DOMAIN)}"')
    html = re.sub(r'href="\.\./\.\./((?:index|devis|realisations)\.html)(#[\w-]*)?"',
                  lambda m: f'href="{url(MAIN_DOMAIN, m.group(1))}{m.group(2) or ""}"',
                  html)

    def sub_sister(match):
        other, page = match.group(1), match.group(2)
        return f'href="{url(FILIALES[other], page)}"'

    others = "|".join(s for s in FILIALES if s != slug)
    if others:
        html = re.sub(rf'href="\.\./({others})/([\w.-]+\.html)"', sub_sister, html)
    html = rewrite_coutellerie(html)
    return force_new_tab(html)


# ---------------------------------------------------------------------------
# SEO : canonical, Open Graph, sitemap, robots
# ---------------------------------------------------------------------------

def inject_seo(html: str, domain: str, page_path: str) -> str:
    """Complète le <head> : canonical, og:url/image et titres de partage."""
    # …/index.html → …/  (URL canonique en dossier, alignée sur le sitemap)
    canon = page_path[: -len("index.html")] if page_path.endswith("index.html") else page_path
    page_url = url(domain, canon)
    og_image = f"https://{domain}/{OG_IMAGES[domain]}"

    lines = [f'<link rel="canonical" href="{page_url}">',
             f'<meta property="og:url" content="{page_url}">']

    if 'property="og:title"' not in html:
        m = re.search(r"<title>(.*?)</title>", html, flags=re.S)
        if m:
            lines.append(f'<meta property="og:title" content="{m.group(1).strip()}">')
    if 'property="og:description"' not in html:
        m = re.search(r'<meta name="description" content="([^"]*)"', html)
        if m:
            lines.append(f'<meta property="og:description" content="{m.group(1)}">')
    if 'property="og:type"' not in html:
        lines.append('<meta property="og:type" content="website">')
    lines.append(f'<meta property="og:image" content="{og_image}">')
    lines.append('<meta name="twitter:card" content="summary_large_image">')

    block = "\n".join(lines) + "\n"
    return html.replace("</head>", block + "</head>", 1)


def write_sitemap(site: Path, domain: str, pages: list[str]) -> None:
    today = date.today().isoformat()
    urls = []
    for page in sorted(pages):
        loc = url(domain) if page == "index.html" else url(domain, page)
        if page.endswith("/index.html"):                    # boutique/index.html → /boutique/
            loc = url(domain, page[: -len("index.html")])
        urls.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod></url>")
    (site / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n</urlset>\n",
        encoding="utf-8")


def write_robots(site: Path, domain: str) -> None:
    (site / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\n\nSitemap: https://{domain}/sitemap.xml\n",
        encoding="utf-8")


def write_shop_root(site: Path) -> None:
    """Racine du shop → la boutique (/boutique/). La boutique et Naberan restent
    dans leurs dossiers pour préserver leurs chemins relatifs (assets, JS)."""
    site.mkdir(parents=True, exist_ok=True)
    boutique = url(SHOP_DOMAIN, "boutique/")
    (site / "index.html").write_text(
        '<!DOCTYPE html>\n'
        '<html lang="fr">\n<head>\n<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        f'<meta http-equiv="refresh" content="0; url=boutique/">\n'
        f'<link rel="canonical" href="{boutique}">\n'
        '<title>Boutique · Groupe NGF</title>\n'
        '<meta name="robots" content="noindex, follow">\n</head>\n'
        f'<body><p>Redirection vers la <a href="boutique/">boutique du Groupe NGF</a>…</p>\n'
        '<script>location.replace("boutique/");</script>\n</body>\n</html>\n',
        encoding="utf-8")


# ---------------------------------------------------------------------------
# Assemblage
# ---------------------------------------------------------------------------

def copy_assets(dest: Path) -> None:
    shutil.copytree(ROOT / "assets", dest / "assets",
                    ignore=shutil.ignore_patterns(".DS_Store"))


def emit_page(dest: Path, html: str, domain: str, page_path: str) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(inject_seo(html, domain, page_path), encoding="utf-8")


def size_of(path: Path) -> str:
    total = sum(f.stat().st_size for f in path.rglob("*") if f.is_file())
    return f"{total / 1e6:.1f} Mo"


def main() -> int:
    if DIST.exists():
        shutil.rmtree(DIST)

    # --- Domaine principal (accueil, devis, références) ----------------------
    main_dir = DIST / MAIN_DOMAIN
    main_pages = []
    for page in sorted(ROOT.glob("*.html")):
        rel = page.name
        emit_page(main_dir / rel,
                  rewrite_main(page.read_text(encoding="utf-8")),
                  MAIN_DOMAIN, rel)
        main_pages.append(rel)
    for php in sorted(ROOT.glob("*.php")):
        shutil.copy2(php, main_dir / php.name)
    # Actualités : dossier actualites/ servi sur le domaine principal
    for page in sorted((ROOT / "actualites").glob("*.html")):
        rel = f"actualites/{page.name}"
        emit_page(main_dir / rel,
                  rewrite_actualites(page.read_text(encoding="utf-8")),
                  MAIN_DOMAIN, rel)
        main_pages.append(rel)
    copy_assets(main_dir)
    write_sitemap(main_dir, MAIN_DOMAIN, main_pages)
    write_robots(main_dir, MAIN_DOMAIN)

    # --- Boutique : shop.ngf-groupe.com --------------------------------------
    # boutique/ garde son dossier → ses liens internes et ses chemins d'assets
    # (dont le JS ../assets/…) restent valides ; l'index racine redirige dessus.
    shop_dir = DIST / SHOP_DOMAIN
    shop_pages = []
    for page in sorted((ROOT / "boutique").glob("*.html")):
        rel = f"boutique/{page.name}"
        emit_page(shop_dir / rel,
                  rewrite_shop(page.read_text(encoding="utf-8")),
                  SHOP_DOMAIN, rel)
        shop_pages.append(rel)
    for php in sorted((ROOT / "boutique").glob("*.php")):
        dest = shop_dir / "boutique" / php.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(php, dest)
    copy_assets(shop_dir)
    write_shop_root(shop_dir)
    write_sitemap(shop_dir, SHOP_DOMAIN, shop_pages)
    write_robots(shop_dir, SHOP_DOMAIN)

    # --- Filiales ------------------------------------------------------------
    for slug, domain in FILIALES.items():
        site = DIST / domain
        pages = []
        for page in sorted((ROOT / "filiales" / slug).glob("*.html")):
            emit_page(site / page.name,
                      rewrite_filiale(page.read_text(encoding="utf-8"), slug),
                      domain, page.name)
            pages.append(page.name)
        # contact.php : destinataire de la filiale injecté dans le template
        tpl = (ROOT / "filiales" / "contact.php.tpl").read_text(encoding="utf-8")
        (site / "contact.php").write_text(
            tpl.replace("__DESTINATAIRE__", FILIALE_EMAILS[slug])
               .replace("__FILIALE__", FILIALE_NOMS[slug]),
            encoding="utf-8")
        copy_assets(site)
        write_sitemap(site, domain, pages)
        write_robots(site, domain)

    # --- Coutellerie (ex-Victorinox) : site autonome, copié tel quel ----------
    # (design + assets propres, liens internes relatifs, self-refs déjà en
    #  coutellerie.ngf-groupe.com) → aucune réécriture, on copie le dossier.
    cout_src = ROOT / "filiales" / "coutellerie"
    if cout_src.exists():
        cout_dir = DIST / COUTELLERIE_DOMAIN
        shutil.copytree(cout_src, cout_dir,
                        ignore=shutil.ignore_patterns(".DS_Store"))
        cout_pages = [p.name for p in sorted(cout_src.glob("*.html"))]
        write_sitemap(cout_dir, COUTELLERIE_DOMAIN, cout_pages)
        write_robots(cout_dir, COUTELLERIE_DOMAIN)

    # --- Contrôle : plus aucun chemin relatif sortant --------------------------
    leaks = []
    for f in DIST.rglob("*.html"):
        text = f.read_text(encoding="utf-8")
        for m in re.findall(r'(?:href|src|action)="(\.\./[^"]*|filiales/[^"]*)"', text):
            if f.parent.name in ("boutique", "naberan", "actualites") and m.startswith("../"):
                target = (f.parent / m.split("#")[0]).resolve()
                if target.exists():
                    continue          # ../assets/…, ../index.html, etc. restent internes
            leaks.append((f.relative_to(DIST), m))
    if leaks:
        print("⚠️  Liens non réécrits :")
        for path, link in leaks:
            print(f"   {path} -> {link}")
        return 1

    print("Sites assemblés dans dist/ :")
    for site in sorted(DIST.iterdir()):
        pages = len(list(site.glob("**/*.html")))
        print(f"  https://{site.name:<28} {pages} page(s)  {size_of(site)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
