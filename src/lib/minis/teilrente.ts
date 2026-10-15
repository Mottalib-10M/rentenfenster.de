/** Teilrente (§ 42 SGB VI): mindestens 10 % der Vollrente, Rest wächst mit dem Zugangsfaktor weiter. */
import type { MiniSpec } from '../mini-types';
import { T, eur, pct, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Teilrente und Lohn zusammen', 'Partial pension plus pay'),
  cta: T(l, 'Abschlag für Ihren Beginn', 'Reduction for your start date'),
  inputs: [
    { id: 'r', label: T(l, 'Vollrente nach Abschlag', 'Full pension after reduction'), def: 1400, unit: '€', max: 5000 },
    { id: 'q', label: T(l, 'Teilrente in Prozent', 'Partial pension, percent'), def: 50, unit: '%', max: 100 },
    { id: 'lohn', label: T(l, 'Netto aus Teilzeit', 'Net pay from part-time work'), def: 1200, unit: '€', max: 10000 },
  ],
  run: (v) => {
    const q = Math.min(Math.max(v.q, 10), 100) / 100;
    const teil = v.r * q;
    return {
      head: [T(l, 'Teilrente brutto', 'Partial pension, gross'), eur(teil, l)],
      rows: [
        [T(l, 'Gewählter Anteil', 'Share chosen'), pct(q, l, 0)],
        [T(l, 'Mit Teilzeitlohn zusammen', 'Together with part-time pay'), eur(teil + v.lohn, l)],
        [T(l, 'Nicht bezogener Teil', 'Part not drawn'), eur(v.r - teil, l)],
      ],
      note: T(l, 'Der nicht bezogene Teil wird später mit dem dann geltenden Abschlag gezahlt, der kleiner ist.', 'The part not drawn is paid later with the smaller reduction that applies then.'),
    };
  },
});
