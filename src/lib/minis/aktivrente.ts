/** Arbeiten nach der Regelaltersgrenze: steuerfrei bis 24 000 € im Jahr (§ 3 Nr. 21 EStG). */
import type { MiniSpec } from '../mini-types';
import { P } from '../engine/params';
import { est } from '../engine/geld';
import { T, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Lohn neben der Altersrente: was steuerfrei bleibt', 'Pay alongside your pension: what stays tax-free'),
  cta: T(l, 'Nettorente rechnen', 'Calculate the net pension'),
  inputs: [
    { id: 'lohn', label: T(l, 'Bruttolohn im Monat', 'Gross pay a month'), def: 2500, unit: '€', max: 20000 },
    { id: 'reg', label: T(l, 'Regelaltersgrenze erreicht?', 'Standard age reached?'), def: 1, options: [{ value: '1', label: T(l, 'Ja', 'Yes') }, { value: '0', label: T(l, 'Nein, Frührente', 'No, early pension') }] },
  ],
  run: (v) => {
    const frei = v.reg === 1 ? Math.min(v.lohn * 12, P.steuer.aktivrente_jahr) : 0;
    const pflichtig = Math.max(0, v.lohn * 12 - frei);
    return {
      head: [T(l, 'Steuerfrei im Jahr', 'Tax-free a year'), eur(frei, l)],
      rows: [
        [T(l, 'Steuerpflichtiger Lohn im Jahr', 'Taxable pay a year'), eur(pflichtig, l)],
        [T(l, 'Hinzuverdienstgrenze Altersrente', 'Earnings cap on old-age pensions'), T(l, 'keine seit 2023', 'none since 2023')],
        [T(l, 'Steuer allein auf den Lohnrest', 'Tax on the remaining pay alone'), eur(est(Math.max(0, pflichtig - 1230)), l)],
      ],
      note: T(l, 'Die Steuerbefreiung gilt ab dem Monat nach der Regelaltersgrenze und nur für Arbeitnehmer, nicht für Selbstständige.', 'The exemption starts the month after the standard age and applies to employees only, not to the self-employed.'),
    };
  },
});
