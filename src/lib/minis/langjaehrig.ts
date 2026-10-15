/** Langjährig Versicherte: Abschlag je nach Startalter (§ 236, § 36, § 77 SGB VI). */
import type { MiniSpec } from '../mini-types';
import { optionen, beginn, abschlagBei, fmtMonat } from '../engine/alter';
import { T, pct, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Altersrente nach 35 Jahren: Ihr Abschlag', 'Pension after 35 years: your reduction'),
  cta: T(l, 'Abschlag genau rechnen', 'Work out the reduction precisely'),
  inputs: [
    { id: 'j', label: T(l, 'Geburtsjahr', 'Year of birth'), def: 1965, max: 2000 },
    { id: 'a', label: T(l, 'Gewünschtes Alter', 'Age you want to start'), def: 64, max: 67, unit: T(l, 'J.', 'yrs') },
    { id: 'r', label: T(l, 'Rente ohne Abschlag', 'Unreduced pension'), def: 1500, unit: '€', max: 5000 },
  ],
  run: (v) => {
    const g = { jahr: Math.min(Math.max(Math.round(v.j) || 1965, 1955), 2000), monat: 6, tag: 15 };
    const opts = optionen(g, { wz35: true, wz45: false, schwb: false });
    const lj = opts.find((o) => o.art === 'langjaehrig')!;
    const start = Math.min(Math.max(beginn(g, { j: Math.round(v.a) || 63, m: 0 }), lj.frueh), lj.voll);
    const a = abschlagBei(opts, start)!;
    return {
      head: [T(l, 'Abschlag', 'Reduction'), pct(a.abschlag, l)],
      rows: [
        [T(l, 'Beginn', 'Start'), fmtMonat(start, l)],
        [T(l, 'Rente danach', 'Pension after it'), eur(v.r * (1 - a.abschlag), l)],
        [T(l, 'Jeden Monat weniger', 'Less every month'), eur(v.r * a.abschlag, l)],
      ],
    };
  },
});
