#!/usr/bin/env python3
"""Extraction structurée du catalogue Naberan par position (blocs MuPDF)."""
import fitz
import json
import re
import sys
from collections import defaultdict

PDF = '/Users/ababacar/Downloads/naberan_catalogo_productos_2018.pdf'

TRILINGUAL_RE = re.compile(r'^[A-ZÀ-Ü0-9\'".\-/ ]{4,}·.*·.*$')

def get_blocks(page):
    """Regroupe les mots par (block, line) -> texte, et calcule la bbox par bloc."""
    words = page.get_text('words')
    blocks = defaultdict(list)
    for x0, y0, x1, y1, word, block, line, wn in words:
        blocks[block].append((x0, y0, x1, y1, word, line))
    result = []
    for b, ws in blocks.items():
        ws.sort(key=lambda w: (w[5], w[0]))  # par ligne puis x
        lines = defaultdict(list)
        for x0, y0, x1, y1, word, line in ws:
            lines[line].append((x0, word))
        line_texts = []
        for ln in sorted(lines):
            toks = sorted(lines[ln], key=lambda t: t[0])
            line_texts.append(' '.join(t[1] for t in toks))
        x0s = [w[0] for w in ws]; y0s = [w[1] for w in ws]
        x1s = [w[2] for w in ws]; y1s = [w[3] for w in ws]
        result.append({
            'id': b, 'x0': min(x0s), 'y0': min(y0s), 'x1': max(x1s), 'y1': max(y1s),
            'lines': line_texts,
            'words': [w[4] for w in ws],
        })
    result.sort(key=lambda r: (r['x0'] < 595, r['y0']))  # gauche puis droite, top->bottom implicite via tri final
    return result


def is_contact_block(blk):
    txt = ' '.join(blk['lines'])
    return ('NABERAN SAREAK' in txt or 'NABERAN FRANCE' in txt or
            txt.strip().startswith('www.naberan.com'))


RUNNING_FOOTER_RE = re.compile(r'^(.*?)\s*\|\s*(\d+)\s*$')

def footer_lines(blk):
    """Lignes du bloc qui correspondent au pied de page répété
    ('XXX · YYY · ZZZ | 194'). Un bloc peut fusionner les 2 moitiés de page
    (colonne gauche + droite) sur des `lines` MuPDF distinctes : on traite
    donc ligne par ligne, jamais le texte du bloc joint en un seul bloc.  """
    return [l for l in blk['lines'] if re.search(r'·.*\|\s*\d+\s*$', l)]


def is_running_footer(blk):
    return len(footer_lines(blk)) == len(blk['lines']) and bool(blk['lines'])


def running_footer_categories(blk):
    """Catégorie(s) majeure(s) du sommaire portées par ce bloc pied-de-page."""
    out = []
    for l in footer_lines(blk):
        m = RUNNING_FOOTER_RE.match(l)
        if m:
            out.append(m.group(1).strip())
    return out


def is_trilingual_header(line):
    return '·' in line and line.upper() == line and len(line) > 6


def is_ref_word(w):
    # "REF"/"REF." dans la plupart des sections ; "CODIGO" dans Câble d'acier ;
    # "Ø" pour les cordages vendus au diamètre (pas de code SKU dans la source)
    return w.rstrip('.') in ('REF', 'CODIGO', 'CÓDIGO', 'Ø')


def main():
    doc = fitz.open(PDF)
    all_pages = []
    for pno in range(doc.page_count):
        page = doc[pno]
        blocks = get_blocks(page)
        footers = []
        for b in blocks:
            if is_running_footer(b):
                footers.extend(running_footer_categories(b))
        major = max(set(footers), key=footers.count) if footers else None
        blocks = [b for b in blocks if not is_contact_block(b) and not is_running_footer(b)]
        all_pages.append({'page': pno + 1, 'blocks': blocks, 'major': major})

    # comble les pages sans pied de page exploitable (dos de couverture de
    # section, photo pleine page) avec la catégorie majeure la plus proche
    last = None
    for pg in all_pages:
        if pg['major']:
            last = pg['major']
        else:
            pg['major'] = last
    for i in range(len(all_pages) - 1, -1, -1):
        if all_pages[i]['major']:
            last = all_pages[i]['major']
        elif last:
            all_pages[i]['major'] = last

    tables = []
    for pg in all_pages:
        blocks = pg['blocks']
        # Le mot "REF" démarre toujours le bloc, mais ce bloc peut fusionner
        # avec l'étiquette de la colonne suivante ('REF', 'Ø', 'mm') selon
        # la mise en page du tableau (flotteurs, etc.) — on ne peut donc
        # pas exiger un bloc réduit au seul mot "REF".
        ref_blocks = [b for b in blocks if b['words'] and is_ref_word(b['words'][0])]
        for rb in ref_blocks:
            rx, ry = rb['x0'], rb['y0']
            col_left = rx < 595

            # bloc catégorie/sous-type: dernier bloc précédent (y0 < ry), le plus proche en y.
            # PAS de restriction de colonne ici : sur certaines double-pages, l'en-tête de
            # catégorie n'existe qu'une fois pour tout le spread (MuPDF le rattache à une
            # seule colonne alors qu'il s'affiche visuellement des deux côtés).
            cat_candidates = [
                b for b in blocks
                if b['y0'] < ry
                and b['lines'] and is_trilingual_header(b['lines'][0])
            ]
            cat_block = max(cat_candidates, key=lambda b: b['y0']) if cat_candidates else None
            category = cat_block['lines'][0] if cat_block else (pg['major'] or '?')
            # sous-type = lignes additionnelles du bloc catégorie, hors doublons de la ligne 0
            # (certains en-têtes répètent la même ligne pour les 2 colonnes, sans sous-type réel)
            subtype = ''
            if cat_block and len(cat_block['lines']) > 1:
                extra = [l for l in cat_block['lines'][1:] if l != cat_block['lines'][0]]
                subtype = ' / '.join(dict.fromkeys(extra))  # dédoublonne en gardant l'ordre

            # blocs d'en-tête de colonnes: même rangée horizontale que REF (y proche), à droite
            header_blocks = [
                b for b in blocks
                if abs(b['y0'] - ry) < 25 and b['x0'] > rx and b is not rb
                and (b['x0'] < 595) == col_left
            ]
            header_blocks.sort(key=lambda b: b['x0'])
            # on garde les lignes séparées (FR/EN/ES) pour permettre au générateur
            # de site de choisir proprement le libellé français + l'unité
            col_labels = [b['lines'] for b in header_blocks]
            if len(rb['words']) > 1:
                # 1ère colonne dont l'étiquette est fusionnée dans le bloc REF
                col_labels.insert(0, [' '.join(rb['words'][1:])])

            # limite basse: prochain bloc REF (même colonne) ou nouvel en-tête trilingue, le plus proche au-dessus
            next_boundaries = [
                b['y0'] for b in blocks
                if b['y0'] > ry + 10 and (b['x0'] < 595) == col_left
                and ((b['words'] and is_ref_word(b['words'][0])) or (b['lines'] and is_trilingual_header(b['lines'][0]) and b['x0'] < rx + 5))
            ]
            y_limit = min(next_boundaries) if next_boundaries else 10_000

            # lignes de données: même colonne x (proche de rx), sous REF, avant la limite
            row_blocks = [
                b for b in blocks
                if abs(b['x0'] - rx) < 8 and ry < b['y0'] < y_limit
            ]
            row_blocks.sort(key=lambda b: b['y0'])
            rows = [b['words'] for b in row_blocks]

            if rows:
                tables.append({
                    'page': pg['page'], 'major': pg['major'] or category,
                    'category': category, 'subtype': subtype,
                    'columns': col_labels, 'rows': rows,
                })

    with open('tables.json', 'w', encoding='utf-8') as f:
        json.dump(tables, f, ensure_ascii=False, indent=1)
    print(f'{len(tables)} tables extraites, {sum(len(t["rows"]) for t in tables)} lignes de produits')

if __name__ == '__main__':
    main()
