/** Später in Rente: 0,5 % Zuschlag je Monat nach der Regelaltersgrenze (§ 77 Abs. 2 Nr. 2b SGB VI). */
import type { MiniSpec } from '../mini-types';
import { zuschlag } from '../engine/alter';
import { T, pct, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Länger arbeiten: Zuschlag auf die Rente', 'Working longer: pension increase'),
  cta: T(l, 'Regelaltersgrenze für Ihren Jahrgang', 'Standard age for your birth year'),
  inputs: [
    { id: 'm', label: T(l, 'Monate nach der Regelaltersgrenze', 'Months after standard age'), def: 12, max: 120 },
    { id: 'r', label: T(l, 'Rente zur Regelaltersgrenze', 'Pension at standard age'), def: 1500, unit: '€', max: 5000 },
  ],
  run: (v) => {
    const z = zuschlag(Math.round(v.m));
    return {
      head: [T(l, 'Zuschlag', 'Increase'), pct(z, l)],
      rows: [
        [T(l, 'Rente mit Zuschlag', 'Pension with increase'), eur(v.r * (1 + z), l)],
        [T(l, 'Mehr pro Monat', 'More per month'), eur(v.r * z, l)],
        [T(l, 'Ausgelassene Zahlungen', 'Payments skipped'), eur(v.r * Math.round(v.m), l)],
      ],
      note: T(l, 'Beiträge aus der Arbeit in dieser Zeit bringen zusätzlich Entgeltpunkte.', 'Contributions paid while working add further pension points.'),
    };
  },
});
