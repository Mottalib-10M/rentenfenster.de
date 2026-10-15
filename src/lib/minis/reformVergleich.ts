/** Geltendes Recht und Kommissionsvorschlag nebeneinander (kein Gesetz). */
import type { MiniSpec } from '../mini-types';
import { fenster, fmtMonat } from '../engine/alter';
import { T, pct, janein, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Was der Vorschlag für Ihren Jahrgang ändern würde', 'What the proposal would change for your birth year'),
  cta: T(l, 'Mit Geburtsdatum genau rechnen', 'Calculate precisely with your date of birth'),
  inputs: [
    { id: 'j', label: T(l, 'Geburtsjahr', 'Year of birth'), def: 1968, max: 2000, plain: true },
    { id: 'b', label: T(l, '45 Jahre erreicht?', '45 years reached?'), def: 1, options: janein(l) },
  ],
  run: (v) => {
    const g = { jahr: Math.min(Math.max(Math.round(v.j) || 1968, 1955), 2000), monat: 6, tag: 15 };
    const lage = { wz35: true, wz45: v.b === 1, schwb: false };
    const a = fenster(g, lage), b = fenster(g, lage, true);
    return {
      head: [T(l, 'Abschlagsfrei heute ab', 'Unreduced today from'), fmtMonat(a.abschlagsfrei.voll, l)],
      rows: [
        [T(l, 'Nach Vorschlag abschlagsfrei ab', 'Under the proposal unreduced from'), fmtMonat(b.abschlagsfrei.voll, l)],
        [T(l, 'Frühestens heute', 'Earliest today'), `${fmtMonat(a.fruehest.frueh, l)} (−${pct(a.fruehest.abschlag, l)})`],
        [T(l, 'Frühestens nach Vorschlag', 'Earliest under the proposal'), `${fmtMonat(b.fruehest.frueh, l)} (−${pct(b.fruehest.abschlag, l)})`],
      ],
      note: T(l, 'Szenario ohne Übergangsregeln. Kein Gesetz, kein veröffentlichter Entwurf.', 'Scenario without transitional rules. Not law, no published draft.'),
    };
  },
});
