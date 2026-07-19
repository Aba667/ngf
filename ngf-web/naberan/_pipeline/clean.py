#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Nettoie tables.json (extraction brute) -> catalogue.json (structuré, en français)."""
import json
import re
import unicodedata

RAW = json.load(open('tables.json', encoding='utf-8'))

UNIT_RE = re.compile(
    r'\b(mm|Kg(?:/100m?)?|kg(?:f|/100m?)?|Ton|kgf|Kg/100|cm|N/MM2|m3?|lb(?:/100ft)?)\b',
    re.I,
)
REF_LIKE = re.compile(r'^[0-9A-ZÀ-Ü][0-9A-ZÀ-Ü/.\-]{2,16}$')
FRACTION = re.compile(r'^\d+/\d+["”″]?$')
DECIMAL = re.compile(r'^\d+[.,]\d+$')
INT_TOK = re.compile(r'^\d+$')


def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r"[^a-zA-Z0-9]+", '-', s).strip('-').lower()
    return s


def french_term(text):
    """'EMERILLONS · SWIVELS · GIRATORIOS' -> 'Émerillons'. Gère les catégories
    combinées 'A · B · C / D · E · F' -> 'A & D'."""
    parts = [p.strip() for p in text.split('/')]
    frs = []
    for p in parts:
        seg = p.split('·')[0].strip()
        if seg and seg not in frs:
            frs.append(seg)
    joined = ' & '.join(frs) if frs else text.strip()
    return titlecase_fr(joined)


TITLECASE_SMALL = {
    'de', 'du', 'des', 'et', 'la', 'le', 'les', 'en', 'à', 'au', 'aux',
    'pour', 'avec', 'sur', 'sans', 'ou', 'w_bolts', "d'acier", "d'acier.",
}


def titlecase_fr(s):
    words = s.lower().split(' ')
    out = []
    for i, w in enumerate(words):
        core = w
        if core in TITLECASE_SMALL and i != 0:
            out.append(core)
        else:
            out.append(core[:1].upper() + core[1:] if core else core)
    res = ' '.join(out)
    # sigles / codes connus à remettre en majuscules
    for acro in ['Bmm', 'Bmn', 'Boss', 'Bo', 'Gm', 'Gf', 'Ss', 'Sw', 'F', 'D', 'G', 'K']:
        res = re.sub(rf'\b{acro}\b', acro.upper(), res)
    return res


# Corrections manuelles : accents perdus en capitales dans le PDF source,
# coquilles du catalogue d'origine, pluriels/typographie.
LABEL_FIX = {
    'Emerillons': 'Émerillons',
    'Crochets & Anneaux': 'Crochets & Anneaux de senne',
    'Margouillet Pompier & Maillon Rapide': 'Margouillets & Maillons rapides',
    'Divers BMN': 'Accessoires BMM',
    'Cosse Coeur & Vis de Calage': 'Cosses coeur & Ridoirs',
    'Chaine & Connecteurs': 'Chaîne & Connecteurs',
    'Poulie & Reas & Goupiles': 'Poulies, Réas & Goupilles',
    'Flotteur & Bouées': 'Flotteurs & Bouées',
    "Cable D’aceir": "Câble d'acier",
    'Caoutchouc & Rockhoppers': 'Caoutchouc & Rockhoppers',
    'Aleze': 'Filets',
    'Fil': 'Fil & ficelle',
    'Divers': 'Divers accastillage',
}


def apply_label_fix(s):
    return LABEL_FIX.get(s, s)


def clean_column_group(lines):
    """lines: liste (1-3 éléments) FR/EN/ES pour une colonne d'en-tête, ou
    déjà une chaîne pour la 1ère colonne fusionnée au bloc REF."""
    if isinstance(lines, str):
        lines = [lines]
    if not lines:
        return None
    label = lines[0].strip()
    unit = ''
    for l in lines:
        m = UNIT_RE.search(l)
        if m and m.group(1).lower() not in label.lower():
            unit = m.group(1)
            break
    label = re.sub(r'\s*=.*$', '', label).strip()  # 'TAMAÑO = Ø mm' -> 'TAMAÑO' déjà en fr donc pas concerné
    label = label.rstrip('.')
    return {'label': titlecase_fr(label), 'unit': unit}


def looks_like_data_row(lines):
    """Détecte les cas où un bloc de données a été mal classé comme en-tête
    (tables à beaucoup de colonnes de cotes) : présence de décimales/refs."""
    if isinstance(lines, str):
        return bool(REF_LIKE.match(lines)) and any(c.isdigit() for c in lines)
    joined = ' '.join(lines)
    toks = joined.split()
    if len(toks) > 4:
        numericish = sum(1 for t in toks if DECIMAL.match(t) or INT_TOK.match(t))
        if numericish >= 3:
            return True
    if lines and REF_LIKE.match(lines[0]) and any(c.isdigit() for c in lines[0]) and len(lines[0]) > 5:
        return True
    return False


def merge_ref_and_values(words):
    """Fusionne les tokens de référence coupés ('JF','312'->'JF 312') et les
    fractions de pouce coupées ('1','1/8"'->'1 1/8\"'). Retourne (ref, reste)."""
    toks = list(words)
    if not toks:
        return '', []
    ref = toks[0]
    i = 1
    # préfixe alpha pur (ex. 'JF') suivi d'un nombre -> fait partie de la réf
    if re.match(r'^[A-Z]{1,4}$', ref) and i < len(toks) and re.match(r'^\d', toks[i]):
        ref = ref + ' ' + toks[i]
        i += 1
    rest = toks[i:]
    # fusion des fractions coupées type '1' + '1/8"' dans le reste
    merged = []
    j = 0
    while j < len(rest):
        if (INT_TOK.match(rest[j]) and j + 1 < len(rest)
                and FRACTION.match(rest[j + 1])):
            merged.append(rest[j] + ' ' + rest[j + 1])
            j += 2
        else:
            merged.append(rest[j])
            j += 1
    return ref, merged


# 'P·CHAÎNE' est en réalité l'en-tête de la colonne « pas de chaîne » d'un
# tableau d'émerillons — il ressemble à un titre trilingue et se fait donc
# rattacher à tort comme catégorie par is_trilingual_header().
RAW_PAIR_FIX = {
    ('P·CHAÎNE', 'CHAIN SIZE / P·CADENA mm'):
        ('EMERILLONS · SWIVELS · GIRATORIOS', 'POUR CHAÎNE'),
}


def build():
    majors = {}
    for t in RAW:
        raw_cat, raw_sub = RAW_PAIR_FIX.get((t['category'], t['subtype']), (t['category'], t['subtype']))

        maj_fr = apply_label_fix(french_term(t['major']))
        maj = majors.setdefault(maj_fr, {'label': maj_fr, 'slug': slugify(maj_fr), 'subs': {}})

        cat_fr = apply_label_fix(french_term(raw_cat))
        sub_fr = french_term(raw_sub) if raw_sub else ''
        key = (cat_fr, sub_fr)
        sub = maj['subs'].setdefault(key, {
            'category': cat_fr, 'subtype': sub_fr, 'columns': None, 'rows': [],
            'pages': set(),
        })
        sub['pages'].add(t['page'])

        cols = [clean_column_group(c) for c in t['columns'] if not looks_like_data_row(c)]
        cols = [c for c in cols if c]
        if sub['columns'] is None or len(cols) > len(sub['columns']):
            sub['columns'] = cols

        for row in t['rows']:
            ref, rest = merge_ref_and_values(row)
            sub['rows'].append({'ref': ref, 'values': rest})

    # finalisation : tri, dédoublonnage, sets -> listes
    out = []
    for maj in majors.values():
        subs = []
        total = 0
        for (cat, sub_label), sdata in maj['subs'].items():
            seen_refs = set()
            rows = []
            for r in sdata['rows']:
                k = (r['ref'], tuple(r['values']))
                if k in seen_refs:
                    continue
                seen_refs.add(k)
                rows.append(r)
            if not rows:
                continue
            total += len(rows)
            subs.append({
                'category': cat, 'subtype': sub_label,
                'columns': sdata['columns'] or [],
                'rows': rows,
                'pages': sorted(sdata['pages']),
            })
        subs.sort(key=lambda s: (s['category'], s['subtype']))
        maj['subs'] = subs
        maj['count'] = total
        out.append(maj)

    out.sort(key=lambda m: -m['count'])
    json.dump(out, open('catalogue.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"{len(out)} catégories majeures, {sum(m['count'] for m in out)} références nettoyées")
    for m in out:
        print(f"  {m['count']:>4}  {m['slug']:<28} {m['label']}  ({len(m['subs'])} sous-tableaux)")


if __name__ == '__main__':
    build()
