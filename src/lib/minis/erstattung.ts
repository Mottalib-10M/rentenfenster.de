/** Beitragserstattung nach Wegzug (§ 210 SGB VI): Arbeitnehmeranteil, wenn die 5 Jahre nicht erreicht sind. */
import type { MiniSpec } from '../mini-types';
import { P } from '../engine/params';
import { epAusBrutto } from '../engine/geld';
import { T, eur, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Rente oder Erstattung nach dem Wegzug', 'Pension or refund after leaving Germany'),
  cta: T(l, 'Rente aus Ihren Punkten rechnen', 'Calculate a pension from your points'),
  inputs: [
    { id: 'j', label: T(l, 'Jahre in Deutschland versichert', 'Years insured in Germany'), def: 4, max: 45, decimals: 1 },
    { id: 'l', label: T(l, 'Durchschnittlicher Bruttolohn', 'Average gross pay'), def: 60000, unit: '€', max: 500000 },
  ],
  run: (v) => {
    const RG = P.rechengroessen;
    const beitrag = Math.min(v.l, RG.bbg_rv_monat * 12) * RG.beitragssatz_rv / 2 * v.j;
    const rente = epAusBrutto(v.l) * v.j * P.rentenwert.ab_2026_07;
    const unter5 = v.j < P.erstattung.allgemeine_wartezeit_jahre;
    return {
      head: [unter5 ? T(l, 'Mögliche Erstattung', 'Possible refund') : T(l, 'Spätere Monatsrente', 'Later monthly pension'), unter5 ? eur(beitrag, l) : eur(rente, l, 2)],
      rows: [
        [T(l, 'Ihr Beitragsanteil (heutige Werte)', 'Your share of contributions (today’s values)'), eur(beitrag, l)],
        [T(l, 'Rente aus diesen Jahren', 'Pension from these years'), eur(rente, l, 2)],
        [T(l, 'Allgemeine Wartezeit', 'Minimum qualifying period'), unter5 ? T(l, `nicht erfüllt (${num(v.j, l, 1)} von 5 Jahren)`, `not met (${num(v.j, l, 1)} of 5 years)`) : T(l, 'erfüllt', 'met')],
      ],
      note: T(l, 'Erstattung nur nach 24 Monaten ohne Versicherungspflicht und ohne Recht auf freiwillige Versicherung; EU-Zeiten zählen oft mit.', 'A refund needs 24 months without compulsory cover and no right to voluntary insurance; EU periods often count towards the 5 years.'),
    };
  },
});
