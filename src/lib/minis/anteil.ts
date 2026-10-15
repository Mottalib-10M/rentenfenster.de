/** Besteuerungsanteil und Rentenfreibetrag nach Startjahr (§ 22 EStG). */
import type { MiniSpec } from '../mini-types';
import { besteuerungsanteil } from '../engine/geld';
import { T, eur, pct, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Wie viel Ihrer Rente steuerpflichtig ist', 'How much of your pension is taxable'),
  cta: T(l, 'Steuer auf die Rente rechnen', 'Calculate the tax on your pension'),
  inputs: [
    { id: 's', label: T(l, 'Jahr des Rentenbeginns', 'Year the pension starts'), def: 2027, max: 2058, plain: true },
    { id: 'r', label: T(l, 'Rente brutto im Monat', 'Gross pension a month'), def: 1800, unit: '€', max: 6000 },
  ],
  run: (v) => {
    const a = besteuerungsanteil(Math.round(v.s) || 2026);
    const j = v.r * 12;
    return {
      head: [T(l, 'Besteuerungsanteil', 'Taxable share'), pct(a, l)],
      rows: [
        [T(l, 'Steuerpflichtig im Jahr', 'Taxable a year'), eur(j * a, l)],
        [T(l, 'Rentenfreibetrag (fest)', 'Fixed tax-free amount'), eur(j * (1 - a), l)],
        [T(l, 'Spätere Rentenerhöhungen', 'Later pension increases'), T(l, 'voll steuerpflichtig', 'fully taxable')],
      ],
      note: T(l, 'Der Freibetrag wird im Jahr nach dem Rentenbeginn in Euro festgeschrieben.', 'The tax-free amount is fixed in euros in the year after the pension starts.'),
    };
  },
});
