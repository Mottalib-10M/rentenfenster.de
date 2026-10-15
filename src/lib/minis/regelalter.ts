/** Regelaltersgrenze und erster Rentenmonat (§ 235, § 35, § 99 SGB VI; § 187 BGB). */
import type { MiniSpec } from '../mini-types';
import { regelalter, beginn, fmtMonat, fmtAlter } from '../engine/alter';
import { besteuerungsanteil } from '../engine/geld';
import { T, pct, monatOpt, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Ihr Renteneintrittsalter', 'Your retirement age'),
  cta: T(l, 'Frühere Wege und Abschläge rechnen', 'Earlier options and reductions'),
  inputs: [
    { id: 'j', label: T(l, 'Geburtsjahr', 'Year of birth'), def: 1962, max: 2000, plain: true },
    { id: 'm', label: T(l, 'Geburtsmonat', 'Month of birth'), def: 3, options: monatOpt(l) },
  ],
  run: (v) => {
    const j = Math.min(Math.max(Math.round(v.j) || 1962, 1955), 2000);
    const g = { jahr: j, monat: v.m || 1, tag: 15 };
    const a = regelalter(j); const b = beginn(g, a);
    const start = Math.floor(b / 12);
    return {
      head: [T(l, 'Regelaltersrente ab', 'Standard pension from'), fmtMonat(b, l)],
      rows: [
        [T(l, 'Regelaltersgrenze', 'Standard retirement age'), fmtAlter(a, l)],
        [T(l, 'Geburtstag am 1. des Monats', 'Born on the 1st'), fmtMonat(beginn({ ...g, tag: 1 }, a), l)],
        [T(l, 'Besteuerungsanteil im Startjahr', 'Taxable share in the start year'), pct(besteuerungsanteil(start), l)],
      ],
    };
  },
});
