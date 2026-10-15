/** Kindererziehungszeiten (§§ 56, 249, 70 Abs. 2 SGB VI). */
import type { MiniSpec } from '../mini-types';
import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Rente aus Kindererziehung', 'Pension from raising children'),
  cta: T(l, 'Ganze Rente hochrechnen', 'Project your whole pension'),
  inputs: [
    { id: 'a', label: T(l, 'Kinder geboren vor 1992', 'Children born before 1992'), def: 1, max: 10 },
    { id: 'b', label: T(l, 'Kinder geboren ab 1992', 'Children born from 1992'), def: 1, max: 10 },
  ],
  run: (v) => {
    const K = P.kindererziehung;
    const ep = (v.a * K.vor_1992_monate + v.b * K.ab_1992_monate) * K.ep_monat;
    const rw = P.rentenwert.ab_2026_07;
    return {
      head: [T(l, 'Rente im Monat', 'Pension a month'), eur(ep * rw, l, 2)],
      rows: [
        [T(l, 'Entgeltpunkte', 'Pension points'), num(ep, l, 2)],
        [T(l, 'Je Kind vor 1992', 'Per child before 1992'), eur(K.vor_1992_monate * K.ep_monat * rw, l, 2)],
        [T(l, 'Je Kind ab 1992', 'Per child from 1992'), eur(K.ab_1992_monate * K.ep_monat * rw, l, 2)],
      ],
      note: T(l, 'Die Zeiten gehören einem Elternteil, meist der Mutter, wenn nichts anderes erklärt wurde.', 'The periods go to one parent, usually the mother unless the parents declared otherwise.'),
    };
  },
});
