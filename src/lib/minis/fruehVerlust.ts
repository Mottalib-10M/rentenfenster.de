/** Frührente: was der Abschlag über die Jahre kostet und wann sich Warten rechnet. */
import type { MiniSpec } from '../mini-types';
import { breakEven, abschlag } from '../engine/alter';
import { P } from '../engine/params';
import { T, pct, eur, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Frührente: Kosten des Abschlags', 'Early pension: what the reduction costs'),
  cta: T(l, 'Mit Geburtsdatum rechnen', 'Calculate with your date of birth'),
  inputs: [
    { id: 'm', label: T(l, 'Monate früher', 'Months early'), def: 24, max: 48 },
    { id: 'r', label: T(l, 'Rente ohne Abschlag', 'Unreduced pension'), def: 1600, unit: '€', max: 5000 },
  ],
  run: (v) => {
    const m = Math.min(Math.max(Math.round(v.m), 0), 48);
    const b = breakEven(m, v.r, P.rentenwert.ab_2026_07);
    return {
      head: [T(l, 'Abschlag', 'Reduction'), pct(abschlag(m), l)],
      rows: [
        [T(l, 'Weniger im Monat', 'Less a month'), eur(v.r - b.gekuerzt, l)],
        [T(l, 'Weniger in 20 Jahren', 'Less over 20 years'), eur((v.r - b.gekuerzt) * 240, l)],
        [T(l, 'Spätere Rente holt auf nach', 'Later start catches up after'), Number.isFinite(b.monate) ? T(l, `${num(b.monate / 12, l, 1)} Jahren`, `${num(b.monate / 12, l, 1)} years`) : '–'],
      ],
    };
  },
});
