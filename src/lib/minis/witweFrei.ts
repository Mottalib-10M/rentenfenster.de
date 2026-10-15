/** Einkommensanrechnung auf die Witwenrente (§ 97 SGB VI, § 18b SGB IV). */
import type { MiniSpec } from '../mini-types';
import { witwenrente } from '../engine/hinterbliebene';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Wie viel Ihr Einkommen von der Witwenrente abzieht', 'How much your income takes off the widow’s pension'),
  cta: T(l, 'Witwenrente mit allen Angaben', 'Widow’s pension with all inputs'),
  inputs: [
    { id: 'w', label: T(l, 'Witwenrente vor Anrechnung', 'Widow’s pension before the test'), def: 800, unit: '€', max: 3000 },
    { id: 'e', label: T(l, 'Eigene Rente brutto (seit 2011)', 'Own gross pension (since 2011)'), def: 1400, unit: '€', max: 6000 },
  ],
  run: (v) => {
    const r = witwenrente({ renteVerstorbener: v.w / 0.55, gross: true, altesRecht: false, einkommen: [{ typ: 'rente_ab_2011', brutto: v.e }], kinder: 0, rw: P.rentenwert.ab_2026_07 });
    return {
      head: [T(l, 'Witwenrente nach Anrechnung', 'Widow’s pension after the test'), eur(r.zahlbetrag, l)],
      rows: [
        [T(l, 'Ihr Einkommen nach Pauschalabzug', 'Your income after the flat deduction'), eur(r.netto, l)],
        [T(l, 'Freibetrag', 'Allowance'), eur(r.frei, l, 2)],
        [T(l, 'Abzug (40 % des Überschusses)', 'Deduction (40% of the excess)'), eur(r.anrechnung, l)],
      ],
    };
  },
});
