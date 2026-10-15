/** Arbeitslos vor der Rente: Lücke zwischen dem Ende des Arbeitslosengeldes und dem frühesten Rentenbeginn. */
import type { MiniSpec } from '../mini-types';
import { optionen, beginn, fmtMonat, abschlagBei } from '../engine/alter';
import { T, num, pct, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Arbeitslosengeld bis zur Rente?', 'Unemployment benefit until the pension?'),
  cta: T(l, 'Alle Rentenarten vergleichen', 'Compare all pension types'),
  inputs: [
    { id: 'j', label: T(l, 'Geburtsjahr', 'Year of birth'), def: 1965, max: 2000, plain: true },
    { id: 'a', label: T(l, 'Alter bei Arbeitslosigkeit', 'Age at job loss'), def: 61, max: 67, decimals: 1 },
    { id: 'd', label: T(l, 'Monate Arbeitslosengeld', 'Months of unemployment benefit'), def: 24, max: 24 },
  ],
  run: (v) => {
    const g = { jahr: Math.min(Math.max(Math.round(v.j) || 1965, 1955), 2000), monat: 6, tag: 15 };
    const start = beginn(g, { j: Math.floor(v.a), m: Math.round((v.a % 1) * 12) });
    const ende = start + Math.round(v.d);
    const opts = optionen(g, { wz35: true, wz45: false, schwb: false });
    const frueh = opts.find((o) => o.art === 'langjaehrig')!.frueh;
    const ab = abschlagBei(opts, Math.max(ende, frueh))!;
    return {
      head: [T(l, 'Lücke ohne Einkommen', 'Gap without income'), T(l, `${num(Math.max(0, frueh - ende), l)} Monate`, `${num(Math.max(0, frueh - ende), l)} months`)],
      rows: [
        [T(l, 'Arbeitslosengeld endet', 'Benefit ends'), fmtMonat(ende, l)],
        [T(l, 'Frühester Rentenbeginn (35 Jahre)', 'Earliest pension (35 years)'), fmtMonat(frueh, l)],
        [T(l, 'Abschlag bei Anschluss an das Arbeitslosengeld', 'Reduction if the pension follows the benefit'), pct(ab.abschlag, l)],
      ],
      note: T(l, 'Arbeitslosengeld in den letzten zwei Jahren vor Beginn zählt nicht auf die 45 Jahre.', 'Unemployment benefit in the last two years before the start does not count towards the 45 years.'),
    };
  },
});
