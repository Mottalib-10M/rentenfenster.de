import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, besondersAlter } from '../../lib/engine/alter';
import { besteuerungsanteil } from '../../lib/engine/geld';
import { DE, EN } from '../../lib/fmt';

/** Jahrgang 1964: erster Jahrgang mit den endgültigen Altersgrenzen (§§ 35 bis 38 SGB VI). Beispiele: Geburtstag 15. März. */
const J = 1964;
const g = { jahr: J, monat: 3, tag: 15 };
const a35 = fenster(g, { wz35: true, wz45: false, schwb: false });
const a45 = fenster(g, { wz35: true, wz45: true, schwb: false });
const sb = fenster(g, { wz35: true, wz45: false, schwb: true });
const ref = fenster(g, { wz35: true, wz45: true, schwb: false }, true);
const lj = a35.opts.find((o) => o.art === 'langjaehrig')!;
const s = sb.opts.find((o) => o.art === 'schwb')!;
const st = (i: number) => Math.floor(i / 12);

export default defineGuide({
  id: 'jahrgang-1964',
  group: 'jahrgang',
  order: 205,
  tool: 'fenster',
  toolPreset: { jahr: J },
  related: ['jahrgang-1963', 'jahrgang-1965', 'rente-mit-63', 'rente-nach-45-jahren', 'rentenreform', 'abschlag-rechner'],
  sources: ['sgb6_35', 'sgb6_36', 'sgb6_37', 'sgb6_38', 'sgb6_77', 'estg_22', 'drvReform', 'vo883'],
  de: {
    slug: 'rente-jahrgang-1964',
    nav: 'Jahrgang 1964',
    card: 'Erster Jahrgang mit 67: ab 63 mit 14,4 % Abschlag, nach 45 Jahren mit 65.',
    title: 'Rente Jahrgang 1964: mit 63, 65 oder 67 in Rente (2026)',
    description: 'Rente Jahrgang 1964: Regelaltersgrenze 67, nach 45 Jahren mit 65 ohne Abschlag, mit 63 nur mit 14,4 % Abschlag. Startmonat, Steueranteil und Reform 2026.',
    h1: 'Rente für den Jahrgang 1964',
    intro: 'Der Jahrgang 1964 ist der erste, für den die Rente mit 67 voll gilt, und der erste, den der Reformvorschlag von 2026 direkt treffen könnte.',
    resume: `Wer 1964 geboren ist, erreicht die Regelaltersgrenze mit genau 67 Jahren, als erster Jahrgang ohne Übergangsregel (§ 35 SGB VI). Ohne Abschlag geht es früher nur auf zwei Wegen: nach 45 Versicherungsjahren mit 65 (§ 38) oder mit anerkannter Schwerbehinderung ebenfalls mit 65 (§ 37). Mit 35 Versicherungsjahren ist der Beginn ab 63 möglich, kostet dann aber 48 Monate mal 0,3 Prozent, also ${DE.pct(lj.abschlag, 1)} Abschlag, lebenslang. Wer am 15. März 1964 geboren ist, kann so frühestens ab dem ${fmtMonat(lj.frueh, 'de')} gehen, ohne Abschlag nach 45 Jahren ab dem ${fmtMonat(a45.abschlagsfrei.voll, 'de')}, regulär ab dem ${fmtMonat(a35.regel.voll, 'de')}. Weil der Jahrgang 2027 63 wird, ist er der erste, für den der Vorschlag der Alterssicherungskommission praktisch werden könnte: Ohne Übergangsregel läge der früheste Beginn dann im ${fmtMonat(ref.fruehest.frueh, 'de')}. Das ist kein Gesetz.`,
    faqs: [
      { q: 'Kann ich mit Jahrgang 1964 schon mit 63 ohne Abschlag gehen?', a: `Nein. Ohne Abschlag geht es für 1964 Geborene frühestens mit 65, und nur mit 45 Versicherungsjahren oder einer anerkannten Schwerbehinderung. Mit 63 bleibt nur die Rente für langjährig Versicherte nach 35 Jahren, mit ${DE.pct(lj.abschlag, 1)} Abschlag. Die abschlagsfreie Rente mit 63 gab es zuletzt für Jahrgänge vor 1953.` },
      { q: 'Wie viel Prozent meiner Rente sind beim Jahrgang 1964 steuerpflichtig?', a: `Das hängt vom Jahr des Rentenbeginns ab, nicht vom Geburtsjahr (§ 22 EStG). Wer mit 63 im Jahr ${st(lj.frueh)} beginnt, versteuert ${DE.pct(besteuerungsanteil(st(lj.frueh)), 1)}; mit 65 im Jahr ${st(a45.abschlagsfrei.voll)} sind es ${DE.pct(besteuerungsanteil(st(a45.abschlagsfrei.voll)), 1)}, mit 67 im Jahr ${st(a35.regel.voll)} ${DE.pct(besteuerungsanteil(st(a35.regel.voll)), 1)}. Der Rest bleibt als fester Eurobetrag steuerfrei.` },
      { q: 'Trifft die Abschaffung der Rente nach 45 Jahren den Jahrgang 1964?', a: 'Das ist offen. Die Kommission empfiehlt die Abschaffung möglichst früh und unter Vertrauensschutz; welche Jahrgänge geschützt bleiben, legt erst ein Gesetz fest, und ein Entwurf ist nicht veröffentlicht. Für 1964 Geborene beginnt die Rente nach 45 Jahren 2029. Wer jetzt plant, rechnet am besten beide Fälle durch, so wie das Rentenfenster oben.' },
      { q: 'Lohnt sich ein Antrag schon jetzt, um das alte Recht zu sichern?', a: 'Nein. Für jede Rente gilt das Recht, das bei ihrem Beginn in Kraft ist, und die Rente kann höchstens ein Jahr vor dem Beginn beantragt werden, darauf weist die Deutsche Rentenversicherung ausdrücklich hin. Ein früher Antrag sichert also nichts. Sinnvoll ist dagegen, jetzt die Kontenklärung abzuschließen, damit die 45 Jahre belegt sind.' },
    ],
    body: (h) => `
<h2>Die vier Termine des Jahrgangs 1964</h2>
<p>Für 1964 Geborene gibt es keine Tabelle mehr nachzuschlagen. Die Altersgrenzen stehen in den Grundvorschriften des SGB VI und sind glatte Jahre: 67 für die Regelaltersrente (${h.src('sgb6_35', '§ 35')}), 65 nach 45 Jahren (${h.src('sgb6_38', '§ 38')}), 65 bei Schwerbehinderung mit frühestem Beginn 62 (${h.src('sgb6_37', '§ 37')}), 63 als frühester Beginn nach 35 Jahren (${h.src('sgb6_36', '§ 36')}). Im Beispiel mit Geburtstag am 15. März:</p>
${h.table(['Rentenart', 'Frühestens', 'Abschlag dort', 'Ohne Abschlag ab'], [
  ['Regelaltersrente', fmtMonat(a35.regel.voll, 'de'), '0 %', fmtMonat(a35.regel.voll, 'de')],
  ['35 Jahre (langjährig)', fmtMonat(lj.frueh, 'de'), h.pct(lj.abschlag, 1), fmtMonat(lj.voll, 'de')],
  ['45 Jahre (besonders langjährig)', fmtMonat(a45.abschlagsfrei.voll, 'de'), '0 %', fmtMonat(a45.abschlagsfrei.voll, 'de')],
  ['Schwerbehinderung, GdB 50', fmtMonat(s.frueh, 'de'), h.pct(s.abschlag, 1), fmtMonat(s.voll, 'de')],
], 'Geburtstag 15. März 1964', ['l', 'l', 'r', 'l'])}
<p>Wer am 1. März geboren ist, rechnet jeden Termin einen Monat früher, weil das Alter am letzten Februartag vollendet ist. Wer zwischen dem 2. und dem 31. geboren ist, beginnt immer am Ersten des Folgemonats.</p>
<h2>Was den Jahrgang von 1963 unterscheidet</h2>
<p>Für 1963 Geborene liegt die Regelaltersgrenze noch bei 66 Jahren und 10 Monaten, die 45-Jahre-Grenze bei 64 Jahren und 10 Monaten (${h.a('jahrgang-1963', 'Jahrgang 1963')}). Der Jahrgang 1964 verliert gegenüber dem Vorjahr also zwei weitere Monate und erreicht mit ${besondersAlter(J).j} Jahren die Endstufe der 45-Jahre-Rente. Für die Rente mit 63 steigt der höchste Abschlag von 13,8 auf ${h.pct(lj.abschlag, 1)}, weil vier volle Jahre zwischen 63 und 67 liegen. Ab hier ändert sich nach geltendem Recht für alle späteren Jahrgänge nichts mehr; die Seite zum ${h.a('jahrgang-1965', 'Jahrgang 1965')} zeigt, wo dennoch Unterschiede entstehen.</p>
<h2>Der Reformvorschlag und der Jahrgang 1964</h2>
<p>Der Jahrgang wird 2027 63 Jahre alt. Damit liegt er genau in der Zeit, für die der Koalitionsausschuss ein Gesetz angekündigt hat. Rechnet man den Vorschlag ohne jeden Übergang durch, gäbe es keine Rente nach 45 Jahren mehr, und auch mit 45 Jahren wäre der früheste Beginn mit 64 möglich, dann mit 10,8 Prozent Abschlag; abschlagsfrei ginge es erst mit 67. Die Kommission empfiehlt aber ausdrücklich Vertrauensschutz, und die ${h.src('drvReform', 'Deutsche Rentenversicherung')} betont, dass bis zu einem Gesetz das heutige Recht gilt. Für Ihre Planung heißt das: die geltenden Termine nehmen, das Szenario daneben im Blick behalten und den Stand unter ${h.a('rentenreform', 'Rentenreform')} verfolgen.</p>`,
  },
  en: {
    slug: 'born-in-1964-pension',
    nav: 'Born in 1964',
    card: 'First cohort at 67: from 63 with 14.4% off, after 45 years at 65.',
    title: 'Pension Born 1964 Germany: Retire at 63, 65 or 67 (2026)',
    description: 'German pension if born in 1964: standard age 67, unreduced at 65 after 45 years, from 63 only with a 14.4% reduction. Start month, tax share, reform 2026.',
    h1: 'German pension for people born in 1964',
    intro: 'The 1964 cohort is the first for whom retirement at 67 fully applies, and the first the 2026 reform proposal could hit directly.',
    resume: `If you were born in 1964, you reach the German standard retirement age at exactly 67, the first cohort with no transition rule (section 35 SGB VI). There are only two ways to go earlier without a reduction: after 45 insured years at 65 (section 38), or with a recognised severe disability, also at 65 (section 37). With 35 insured years you can start from 63, but that costs 48 months times 0.3%, a ${EN.pct(lj.abschlag, 1)} reduction for life. Someone born on 15 March 1964 can therefore start on ${fmtMonat(lj.frueh, 'en')} at the earliest, with no reduction after 45 years from ${fmtMonat(a45.abschlagsfrei.voll, 'en')}, and at the standard age from ${fmtMonat(a35.regel.voll, 'en')}. Because the cohort turns 63 in 2027, it is the first for which the pension commission proposal could become real: with no transition the earliest start would move to ${fmtMonat(ref.fruehest.frueh, 'en')}. That is not law.`,
    faqs: [
      { q: 'Born in 1964, can I retire at 63 without a reduction?', a: `No. Without a reduction the earliest is 65, and only with 45 insured years or a recognised severe disability. At 63 only the pension for long-term insured persons after 35 years is open, with a ${EN.pct(lj.abschlag, 1)} reduction. An unreduced pension at 63 last existed for people born before 1953.` },
      { q: 'How much of my pension will be taxable if I was born in 1964?', a: `It depends on the year the pension starts, not the year you were born (section 22 Income Tax Act). Starting at 63 in ${st(lj.frueh)} means ${EN.pct(besteuerungsanteil(st(lj.frueh)), 1)} is taxable; at 65 in ${st(a45.abschlagsfrei.voll)} it is ${EN.pct(besteuerungsanteil(st(a45.abschlagsfrei.voll)), 1)}, at 67 in ${st(a35.regel.voll)} ${EN.pct(besteuerungsanteil(st(a35.regel.voll)), 1)}. The rest stays tax-free as a fixed euro amount.` },
      { q: 'Will the end of the 45-year pension affect people born in 1964?', a: 'That is open. The commission recommends abolishing it as early as possible while protecting legitimate expectations; which cohorts stay protected will only be set by a law, and no draft has been published. For people born in 1964 the 45-year pension starts in 2029. If you are planning now, work out both cases, as the calculator above does.' },
      { q: 'I worked in Germany and in another EU country. Can I still reach 45 years?', a: 'For the qualifying period, EU and EEA periods and Swiss periods are added to German ones under the EU coordination rules, so foreign years can help you reach 35 or 45. Only periods that would also count under German rules are added. The German pension itself is then paid only for the German periods; the other country pays its own share.' },
    ],
    body: (h) => `
<h2>The four dates for the 1964 cohort</h2>
<p>If you were born in 1964 there is no transition table to look up. The age limits are in the core rules of SGB VI and are whole years: 67 for the standard pension (${h.src('sgb6_35', 'section 35')}), 65 after 45 years (${h.src('sgb6_38', 'section 38')}), 65 with a severe disability and 62 at the earliest (${h.src('sgb6_37', 'section 37')}), 63 as the earliest start after 35 years (${h.src('sgb6_36', 'section 36')}). For a birthday on 15 March:</p>
${h.table(['Pension type', 'Earliest', 'Reduction then', 'Unreduced from'], [
  ['Standard pension', fmtMonat(a35.regel.voll, 'en'), '0%', fmtMonat(a35.regel.voll, 'en')],
  ['35 years (long-term insured)', fmtMonat(lj.frueh, 'en'), h.pct(lj.abschlag, 1), fmtMonat(lj.voll, 'en')],
  ['45 years (especially long-term)', fmtMonat(a45.abschlagsfrei.voll, 'en'), '0%', fmtMonat(a45.abschlagsfrei.voll, 'en')],
  ['Severe disability, degree 50', fmtMonat(s.frueh, 'en'), h.pct(s.abschlag, 1), fmtMonat(s.voll, 'en')],
], 'Birthday 15 March 1964', ['l', 'l', 'r', 'l'])}
<p>Born on 1 March? Move every date one month earlier, because German law treats the age as reached on the last day of February. Born between the 2nd and the 31st, the pension always starts on the first of the following month.</p>
<h2>How 1964 differs from 1963</h2>
<p>For people born in 1963 the standard age is still 66 years and 10 months, and the 45-year limit 64 years and 10 months (${h.a('jahrgang-1963', 'born in 1963')}). The 1964 cohort loses two more months and reaches the final step of the 45-year pension at ${besondersAlter(J).j}. For retiring at 63 the maximum reduction rises from 13.8% to ${h.pct(lj.abschlag, 1)}, because four full years lie between 63 and 67. Under current law nothing changes after this for later cohorts; the page for ${h.a('jahrgang-1965', 'people born in 1965')} shows where differences still arise.</p>
<h2>The reform proposal and the 1964 cohort</h2>
<p>This cohort turns 63 in 2027, right in the period for which the coalition has announced a law. Running the proposal with no transition at all, there would be no 45-year pension, the earliest start even with 45 years would be 64 with a 10.8% reduction, and an unreduced pension would come only at 67. The commission does recommend protecting legitimate expectations, and the ${h.src('drvReform', 'German Pension Insurance')} stresses that current law applies until a new law is passed. For your planning: use the current dates, keep the scenario in view, and follow progress under ${h.a('rentenreform', 'pension reform')}. If you are an expat thinking of leaving Germany around retirement, the timing also affects which country taxes the pension, which is beyond this calculator.</p>`,
  },
});
