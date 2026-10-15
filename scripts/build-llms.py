#!/usr/bin/env python3
"""Erzeugt public/llms.txt aus dem Build (RECETTE §21). Aufruf: npm run build && python3 scripts/build-llms.py && npm run build"""
import glob, html, os, re
SITE = re.search(r'SITE_URL = "([^"]+)"', open('src/data/site-config.ts').read()).group(1)
rows = {'de': [], 'en': []}
for f in sorted(glob.glob('dist/*/**/index.html', recursive=True)):
    d = open(f, encoding='utf-8').read()
    if 'noindex' in d[:3000] or '/embed/' in f: continue
    path = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace(os.sep, '/') + '/'
    lang = path.split('/')[1]
    if lang not in rows: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', d, re.S).group(1))
    m = re.search(r'name="description" content="(.*?)"', d, re.S)
    rows[lang].append((path, t, html.unescape(m.group(1)) if m else ''))
out = ['# Rentenfenster', '',
       '> Unabhängige Seite von Radif Partners auf Deutsch und Englisch zur gesetzlichen Rente in Deutschland 2026: Rentenbeginn auf den Monat für jeden Jahrgang und jede Altersrente (§§ 35 bis 38, 235 bis 236b SGB VI), Abschlag nach § 77, Bruttorente aus Entgeltpunkten mit dem Rentenwert 42,52 € ab 1. Juli 2026, Nettorente mit Kranken- und Pflegebeitrag und Einkommensteuer nach Besteuerungsanteil und Tarif 2026, Witwenrente mit Einkommensanrechnung, Erwerbsminderungsrente. Der Vorschlag der Alterssicherungskommission vom 23. Juni 2026 wird als Szenario gezeigt, nie als geltendes Recht.', '',
       'Alle Berechnungen laufen im Browser; keine Datenerhebung, keine Telefonnummer, keine Vermittlung. Ergebnisse sind Schätzungen; verbindlich ist der Rentenbescheid. Die Seite gehört nicht zur Deutschen Rentenversicherung.', '']
for lang, titel in (('de', '## Seiten auf Deutsch'), ('en', '## Pages in English')):
    out.append(titel); out.append('')
    for p, t, d in rows[lang]: out.append(f'- [{t}]({SITE}{p}): {d}')
    out.append('')
open('public/llms.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('llms.txt:', sum(len(v) for v in rows.values()), 'Seiten')
