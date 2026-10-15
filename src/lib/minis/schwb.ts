/** Schwerbehinderte: frühestes und abschlagsfreies Alter (§ 236a, § 37 SGB VI). */
import type { MiniSpec } from '../mini-types';
import { schwbAlter, regelalter, fmtAlter } from '../engine/alter';
import { T, pct, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Altersrente für schwerbehinderte Menschen', 'Pension for severely disabled people'),
  cta: T(l, 'Mit Geburtsmonat im Rentenfenster rechnen', 'Calculate with your birth month'),
  inputs: [
    { id: 'j', label: T(l, 'Geburtsjahr', 'Year of birth'), def: 1966, max: 2000, plain: true },
    { id: 'r', label: T(l, 'Rente ohne Abschlag', 'Unreduced pension'), def: 1400, unit: '€', max: 5000 },
  ],
  run: (v) => {
    const j = Math.min(Math.max(Math.round(v.j) || 1966, 1955), 2000);
    const s = schwbAlter(j);
    const monate = (s.voll.j - s.frueh.j) * 12 + (s.voll.m - s.frueh.m);
    const ab = monate * 0.003;
    return {
      head: [T(l, 'Ohne Abschlag mit', 'No reduction at'), fmtAlter(s.voll, l)],
      rows: [
        [T(l, 'Frühestens mit', 'Earliest at'), `${fmtAlter(s.frueh, l)} (−${pct(ab, l)})`],
        [T(l, 'Rente beim frühesten Beginn', 'Pension at earliest start'), eur(v.r * (1 - ab), l)],
        [T(l, 'Zum Vergleich: Regelaltersgrenze', 'Compare: standard age'), fmtAlter(regelalter(j), l)],
      ],
      note: T(l, 'Voraussetzung: GdB 50 bei Rentenbeginn und 35 Versicherungsjahre.', 'Requires a disability degree of 50 at the start and 35 insured years.'),
    };
  },
});
