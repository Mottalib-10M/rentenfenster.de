/** 45 Beitragsjahre: abschlagsfreies Alter je Jahrgang (§ 236b, § 38 SGB VI). */
import type { MiniSpec } from '../mini-types';
import { besondersAlter, regelalter, beginn, fmtMonat, fmtAlter } from '../engine/alter';
import { T, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Abschlagsfrei nach 45 Jahren', 'No reduction after 45 years'),
  cta: T(l, 'Genauen Monat im Rentenfenster rechnen', 'Find the exact month in the full calculator'),
  inputs: [{ id: 'j', label: T(l, 'Geburtsjahr', 'Year of birth'), def: 1963, max: 2000 }],
  run: (v) => {
    const j = Math.min(Math.max(Math.round(v.j) || 1963, 1955), 2000);
    const a = besondersAlter(j), r = regelalter(j);
    const g = { jahr: j, monat: 6, tag: 15 };
    const vorsprung = beginn(g, r) - beginn(g, a);
    return {
      head: [T(l, 'Ohne Abschlag mit', 'No reduction at'), fmtAlter(a, l)],
      rows: [
        [T(l, 'Beginn (Juni geboren)', 'Start (born in June)'), fmtMonat(beginn(g, a), l)],
        [T(l, 'Regelaltersgrenze', 'Standard age'), fmtAlter(r, l)],
        [T(l, 'Monate früher als regulär', 'Months before standard age'), num(vorsprung, l)],
      ],
      note: T(l, 'Geltendes Recht. Die Kommission schlägt vor, diese Rente abzuschaffen; beschlossen ist das nicht.', 'Current law. The commission proposes to abolish this pension; nothing has been enacted.'),
    };
  },
});
