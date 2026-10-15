/** Renteninformation lesen: aus dem Betrag der Regelaltersrente die Entgeltpunkte zurückrechnen. */
import type { MiniSpec } from '../mini-types';
import { P } from '../engine/params';
import { nettoStandard } from '../engine/geld';
import { T, eur, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Ihre Renteninformation in Zahlen', 'Your pension statement in numbers'),
  cta: T(l, 'Mit diesen Punkten weiterrechnen', 'Carry on with these points'),
  inputs: [
    { id: 'a', label: T(l, 'Bisher erreichte Rente (Zeile 1)', 'Pension earned so far (line 1)'), def: 1100, unit: '€', max: 5000 },
    { id: 'w', label: T(l, 'Rentenwert auf dem Schreiben', 'Pension value on the letter'), def: 40.79, unit: '€', decimals: 2, max: 60 },
  ],
  run: (v) => {
    const ep = v.w > 0 ? v.a / v.w : 0; const neu = ep * P.rentenwert.ab_2026_07;
    return {
      head: [T(l, 'Entgeltpunkte bisher', 'Pension points so far'), num(ep, l, 2)],
      rows: [
        [T(l, 'Wert ab Juli 2026', 'Value from July 2026'), eur(neu, l, 2)],
        [T(l, 'Netto davon (Standardfall)', 'Net of that (standard case)'), eur(nettoStandard(neu).netto, l)],
      ],
      note: T(l, 'Ein Schreiben vom ersten Halbjahr 2026 rechnet noch mit 40,79 €.', 'A letter from the first half of 2026 still uses €40.79.'),
    };
  },
});
