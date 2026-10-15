/** Rentenanpassung 1. Juli 2026: 4,24 %, Rentenwert 42,52 €. */
import type { MiniSpec } from '../mini-types';
import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Ihre Rente nach der Erhöhung im Juli 2026', 'Your pension after the July 2026 increase'),
  cta: T(l, 'Netto nach der Erhöhung', 'Net after the increase'),
  inputs: [{ id: 'r', label: T(l, 'Rente brutto bis Juni 2026', 'Gross pension until June 2026'), def: 1500, unit: '€', max: 5000 }],
  run: (v) => {
    const f = P.rentenwert.ab_2026_07 / P.rentenwert.bis_2026_06;
    return {
      head: [T(l, 'Ab Juli 2026', 'From July 2026'), eur(v.r * f, l, 2)],
      rows: [
        [T(l, 'Mehr im Monat', 'More a month'), eur(v.r * (f - 1), l, 2)],
        [T(l, 'Entgeltpunkte dahinter', 'Pension points behind it'), num(v.r / P.rentenwert.bis_2026_06, l, 2)],
        [T(l, 'Mehr bis Juni 2027', 'More until June 2027'), eur(v.r * (f - 1) * 12, l)],
      ],
    };
  },
});
