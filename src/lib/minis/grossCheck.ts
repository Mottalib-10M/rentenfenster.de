/** Große oder kleine Witwenrente (§ 46, § 242a SGB VI). */
import type { MiniSpec } from '../mini-types';
import { grossAlter } from '../engine/hinterbliebene';
import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Große oder kleine Witwenrente?', 'Large or small widow’s pension?'),
  cta: T(l, 'Witwenrente berechnen', 'Calculate the widow’s pension'),
  inputs: [
    { id: 'a', label: T(l, 'Ihr Alter beim Tod des Partners', 'Your age when your partner died'), def: 45, max: 99, decimals: 1 },
    { id: 't', label: T(l, 'Todesjahr', 'Year of death'), def: 2026, max: 2040, plain: true },
    { id: 'k', label: T(l, 'Kind unter 18 im Haushalt', 'Child under 18 at home'), def: 0, options: [{ value: '0', label: T(l, 'Nein', 'No') }, { value: '1', label: T(l, 'Ja', 'Yes') }] },
    { id: 'r', label: T(l, 'Rente des Partners', 'Partner’s pension'), def: 1600, unit: '€', max: 5000 },
  ],
  run: (v) => {
    const g = grossAlter(Math.round(v.t) || 2026); const grenze = g.j + g.m / 12;
    const gross = v.k === 1 || v.a >= grenze;
    const f = gross ? P.witwe.gross_faktor : P.witwe.klein_faktor;
    return {
      head: [T(l, 'Anspruch', 'Entitlement'), gross ? T(l, 'große Witwenrente', 'large pension') : T(l, 'kleine Witwenrente', 'small pension')],
      rows: [
        [T(l, 'Altersgrenze im Todesjahr', 'Age limit in that year'), T(l, `${g.j} J. ${g.m} M.`, `${g.j} y ${g.m} m`)],
        [T(l, 'Anteil der Rente', 'Share of the pension'), `${num(f * 100, l)} %`],
        [T(l, 'Witwenrente vor Anrechnung', 'Before the income test'), eur(v.r * f, l)],
      ],
      note: gross ? undefined : T(l, `Die kleine Witwenrente endet nach ${P.witwe.klein_monate} Monaten, sofern nicht altes Recht gilt.`, `The small pension stops after ${P.witwe.klein_monate} months unless the old rules apply.`),
    };
  },
});
