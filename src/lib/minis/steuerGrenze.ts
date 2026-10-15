/** Ab welcher Rente Einkommensteuer anfällt (Standardfall). */
import type { MiniSpec } from '../mini-types';
import { steuerfreieGrenze, nettoStandard } from '../engine/geld';
import { T, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Ab wann Rentner Steuern zahlen', 'When pensioners start paying tax'),
  cta: T(l, 'Steuer mit allen Angaben', 'Tax with all inputs'),
  inputs: [
    { id: 's', label: T(l, 'Jahr des Rentenbeginns', 'Year the pension starts'), def: 2026, max: 2058, plain: true },
    { id: 'r', label: T(l, 'Ihre Rente brutto', 'Your gross pension'), def: 1700, unit: '€', max: 6000 },
  ],
  run: (v) => {
    const s = Math.min(Math.max(Math.round(v.s) || 2026, 2005), 2058);
    const n = nettoStandard(v.r, s);
    return {
      head: [T(l, 'Steuerfrei bis etwa', 'Tax-free up to about'), eur(steuerfreieGrenze(s), l)],
      rows: [
        [T(l, 'Ihre Steuer im Jahr', 'Your tax a year'), eur(n.steuerJahr, l)],
        [T(l, 'Zu versteuerndes Einkommen', 'Taxable income'), eur(n.zve, l)],
      ],
      note: T(l, 'Alleinstehend, nur gesetzliche Rente, Kranken- und Pflegebeiträge abgezogen.', 'Single, statutory pension only, health and care contributions deducted.'),
    };
  },
});
