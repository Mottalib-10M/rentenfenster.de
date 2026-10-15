/** Entgeltpunkte aus einem Jahreslohn (§ 70 SGB VI) und ihr Wert in Rente. */
import type { MiniSpec } from '../mini-types';
import { epAusBrutto } from '../engine/geld';
import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Ihr Lohn in Rentenpunkten', 'Your pay in pension points'),
  cta: T(l, 'Ganze Rente hochrechnen', 'Project your whole pension'),
  inputs: [{ id: 'l', label: T(l, 'Bruttolohn 2026', 'Gross pay 2026'), def: 45000, unit: '€', max: 1000000 }],
  run: (v) => {
    const e = epAusBrutto(v.l); const rw = P.rentenwert.ab_2026_07;
    return {
      head: [T(l, 'Entgeltpunkte für 2026', 'Pension points for 2026'), num(e, l, 4)],
      rows: [
        [T(l, 'Monatsrente aus diesem Jahr', 'Monthly pension from this year'), eur(e * rw, l, 2)],
        [T(l, 'Über 20 Jahre Ruhestand', 'Over 20 years of retirement'), eur(e * rw * 240, l)],
        [T(l, 'Arbeitnehmerbeitrag im Jahr', 'Employee contribution a year'), eur(Math.min(v.l, P.rechengroessen.bbg_rv_monat * 12) * P.rechengroessen.beitragssatz_rv / 2, l)],
      ],
    };
  },
});
