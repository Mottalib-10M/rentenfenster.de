/** Kranken- und Pflegeversicherung der Rentner (§§ 241, 247, 249a SGB V; §§ 55, 59 SGB XI). */
import type { MiniSpec } from '../mini-types';
import { netto } from '../engine/geld';
import { T, eur, pct, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Was Kranken- und Pflegekasse von der Rente nehmen', 'What health and care insurance take from the pension'),
  cta: T(l, 'Ganze Nettorente rechnen', 'Calculate the full net pension'),
  inputs: [
    { id: 'r', label: T(l, 'Rente brutto', 'Gross pension'), def: 1600, unit: '€', max: 6000 },
    { id: 'z', label: T(l, 'Zusatzbeitrag Ihrer Kasse', 'Your fund’s extra rate'), def: 2.9, unit: '%', decimals: 2, max: 6 },
    { id: 'k', label: T(l, 'Kinder', 'Children'), def: 1, options: [{ value: '1', label: T(l, 'mindestens eines', 'at least one') }, { value: '0', label: T(l, 'keine', 'none') }] },
  ],
  run: (v) => {
    const n = netto({ brutto: v.r, zusatz: v.z / 100, kinderlos: v.k === 0, startjahr: 2026, weitere: 0, verheiratet: false, partner: 0, kirche: 0 });
    return {
      head: [T(l, 'Abzug im Monat', 'Deduction a month'), eur(n.sozial, l, 2)],
      rows: [
        [T(l, `Krankenversicherung (${pct(n.kvSatz, l, 2)})`, `Health insurance (${pct(n.kvSatz, l, 2)})`), eur(n.kv, l, 2)],
        [T(l, `Pflegeversicherung (${pct(n.pvSatz, l)})`, `Care insurance (${pct(n.pvSatz, l)})`), eur(n.pv, l, 2)],
        [T(l, 'Bleibt vor Steuer', 'Left before tax'), eur(n.nettoVorSteuer, l, 2)],
      ],
    };
  },
});
