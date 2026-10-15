/** Was auf die 45 Jahre zählt (§ 51 Abs. 3a SGB VI). */
import type { MiniSpec } from '../mini-types';
import { P } from '../engine/params';
import { T, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Zählen Ihre Jahre für die 45?', 'Do your years count towards the 45?'),
  cta: T(l, 'Rentenbeginn mit diesem Ergebnis rechnen', 'Use the result in the full calculator'),
  inputs: [
    { id: 'b', label: T(l, 'Jahre mit Pflichtbeiträgen aus Arbeit', 'Years of compulsory contributions from work'), def: 40, max: 55, decimals: 1 },
    { id: 'k', label: T(l, 'Jahre Kindererziehung bis 10 und Pflege', 'Years raising children under 10 and caring'), def: 3, max: 30, decimals: 1 },
    { id: 'a', label: T(l, 'Jahre Arbeitslosengeld, davon', 'Years of unemployment benefit'), def: 2, max: 20, decimals: 1 },
    { id: 'z', label: T(l, 'in den letzten 2 Jahren vor Rentenbeginn', 'in the last 2 years before retirement'), def: 1, max: 2, decimals: 1 },
  ],
  run: (v) => {
    const alg = Math.max(0, v.a - Math.min(v.z, 2, v.a));
    const sum = v.b + v.k + alg;
    const ziel = P.altersgrenzen.besonders_wartezeit_jahre;
    return {
      head: [T(l, 'Anrechenbar für die 45 Jahre', 'Counted towards 45 years'), T(l, `${num(sum, l, 1)} Jahre`, `${num(sum, l, 1)} years`)],
      rows: [
        [T(l, 'Arbeitslosengeld, das zählt', 'Unemployment benefit that counts'), num(alg, l, 1)],
        [T(l, 'Nicht gezählt (letzte 2 Jahre)', 'Not counted (last 2 years)'), num(v.a - alg, l, 1)],
        [T(l, 'Ergebnis', 'Result'), sum >= ziel ? T(l, 'erfüllt', 'met') : T(l, `${num(ziel - sum, l, 1)} Jahre fehlen`, `${num(ziel - sum, l, 1)} years short`)],
      ],
      note: T(l, 'Bürgergeld, Schule und Studium zählen nicht; Arbeitslosengeld in den letzten 2 Jahren zählt nur nach Insolvenz oder Geschäftsaufgabe.', 'Citizen’s benefit, school and university do not count; unemployment benefit in the last 2 years only counts after insolvency or closure of the employer.'),
    };
  },
});
