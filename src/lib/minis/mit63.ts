/** Rente mit 63: wann 63 erreicht ist und welcher Abschlag bei 35 Jahren gilt. */
import type { MiniSpec } from '../mini-types';
import { optionen, fmtMonat, fmtAlter } from '../engine/alter';
import { T, pct, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Rente mit 63 für Ihren Jahrgang', 'Retiring at 63 for your birth year'),
  cta: T(l, 'Alle Rentenarten im Rentenfenster', 'All pension types in the full calculator'),
  inputs: [{ id: 'j', label: T(l, 'Geburtsjahr', 'Year of birth'), def: 1964, max: 2000, plain: true }],
  run: (v) => {
    const g = { jahr: Math.min(Math.max(Math.round(v.j) || 1964, 1955), 2000), monat: 6, tag: 15 };
    const o = optionen(g, { wz35: true, wz45: false, schwb: false }).find((x) => x.art === 'langjaehrig')!;
    return {
      head: [T(l, 'Abschlag mit 63 (35 Jahre)', 'Reduction at 63 (35 years)'), pct(o.abschlag, l)],
      rows: [
        [T(l, 'Beginn mit 63 (Juni geboren)', 'Start at 63 (born in June)'), fmtMonat(o.frueh, l)],
        [T(l, 'Monate bis zur Regelaltersgrenze', 'Months to standard age'), num(o.monate, l)],
        [T(l, 'Regelaltersgrenze', 'Standard age'), fmtAlter(o.vollAlter, l)],
      ],
      note: T(l, 'Ohne Abschlag geht es mit 63 nur für Jahrgänge vor 1953 mit 45 Jahren.', 'Retiring at 63 with no reduction was only possible for people born before 1953 with 45 years.'),
    };
  },
});
