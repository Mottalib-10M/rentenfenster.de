/** Antragsfrist (§ 99 SGB VI): Antrag bis zum Ende des dritten Monats nach Erfüllung der Voraussetzungen. */
import type { MiniSpec } from '../mini-types';
import { regelalter, beginn, fmtMonat, vonIdx, monatsName } from '../engine/alter';
import { P } from '../engine/params';
import { T, monatOpt, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Rente rechtzeitig beantragen', 'Applying in time'),
  cta: T(l, 'Frühere Rentenarten prüfen', 'Check earlier pension types'),
  inputs: [
    { id: 'j', label: T(l, 'Geburtsjahr', 'Year of birth'), def: 1960, max: 2000 },
    { id: 'm', label: T(l, 'Geburtsmonat', 'Month of birth'), def: 9, options: monatOpt(l) },
  ],
  run: (v) => {
    const g = { jahr: Math.min(Math.max(Math.round(v.j) || 1960, 1955), 2000), monat: v.m || 1, tag: 15 };
    const b = beginn(g, regelalter(g.jahr));
    const spaet = vonIdx(b - 1 + P.antrag.frist_monate);
    const frueh = b - 12;
    return {
      head: [T(l, 'Regelaltersrente ab', 'Standard pension from'), fmtMonat(b, l)],
      rows: [
        [T(l, 'Antrag frühestens sinnvoll', 'Sensible earliest application'), fmtMonat(frueh, l)],
        [T(l, 'Spätestens beantragen bis', 'Apply by the end of'), `${monatsName(spaet.monat, l)} ${spaet.jahr}`],
        [T(l, 'Bei späterem Antrag', 'If you apply later'), T(l, 'Rente erst ab Antragsmonat', 'paid only from the month of application')],
      ],
    };
  },
});
