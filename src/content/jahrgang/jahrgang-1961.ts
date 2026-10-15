import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, fmtAlter, regelalter, besondersAlter, schwbAlter, idx, abschlag, type Option } from '../../lib/engine/alter';
import { besteuerungsanteil } from '../../lib/engine/geld';
import { DE, EN, P } from '../../lib/fmt';

/** Jahrgang 1961: Regelaltersgrenze 66 + 6, Sonderfall Geburtstag am 1. Januar (§ 187 Abs. 2 BGB). Beispiel: 1. Januar 1961. */
const J = 1961;
const lage = { wz35: true, wz45: true, schwb: true };
const g1 = { jahr: J, monat: 1, tag: 1 };
const g2 = { jahr: J, monat: 1, tag: 2 };
const f1 = fenster(g1, lage);
const f2 = fenster(g2, lage);
const ref = fenster(g1, { wz35: true, wz45: true, schwb: false }, true);
const pick = (f: typeof f1, art: Option['art']) => f.opts.find((o) => o.art === art)!;
const rg = f1.regel, lj = pick(f1, 'langjaehrig'), bes = pick(f1, 'besonders'), sb = pick(f1, 'schwb');
const AM = P.zugangsfaktor.abschlag_monat;
const B = 1800;
/** Beginn mit 35 Jahren am 1. Januar 2027: Monate vor dem Regelbeginn. */
const s27 = idx(2027, 1);
const m27 = rg.voll - s27;
const r27 = B * (1 - abschlag(m27));
const maxM = (j: number) => regelalter(j).j * 12 + regelalter(j).m - 63 * 12;
const st = (i: number) => Math.floor(i / 12);
const bA = (i: number) => besteuerungsanteil(st(i));
/** Steuerpflichtiger Jahresteil bei 1.800 € Monatsrente je nach Startjahr. */
const teil = (i: number) => B * 12 * bA(i);
const dat = (a: { j: number; m: number }) => (a.m === 0 ? `${a.j} Jahren` : `${a.j} Jahren und ${a.m} ${a.m === 1 ? 'Monat' : 'Monaten'}`);
const ARTDE = { regel: 'Regelaltersrente', langjaehrig: 'Nach 35 Jahren, frühestens', besonders: 'Nach 45 Jahren', schwb: 'Schwerbehinderung, frühestens' } as const;
const ARTEN = { regel: 'Standard pension', langjaehrig: 'After 35 years, earliest', besonders: 'After 45 years', schwb: 'Severe disability, earliest' } as const;

export default defineGuide({
  id: 'jahrgang-1961',
  group: 'jahrgang',
  order: 202,
  tool: 'fenster',
  toolPreset: { jahr: J },
  miniHref: 'rentenbeginn-rechner',
  related: ['jahrgang-1960', 'jahrgang-1962', 'rente-nach-45-jahren', 'schwerbehinderte', 'rente-beantragen', 'rentenreform'],
  sources: ['sgb6_235', 'sgb6_236b', 'sgb6_236a', 'bgb_187', 'sgb6_99', 'sgb6_77', 'estg_22', 'drvReform'],
  de: {
    slug: 'rente-jahrgang-1961',
    nav: 'Jahrgang 1961',
    card: 'Regelaltersgrenze 66 Jahre und 6 Monate; wer am 1. Januar geboren ist, beginnt jeden Termin einen Monat früher.',
    title: 'Rente mit 63 Jahrgang 1961: Termine, Abschlag, Steuer 2026',
    description: 'Rente mit 63 Jahrgang 1961: 12,6 % Abschlag ab 63, nach 45 Jahren mit 64 und 6 Monaten, regulär mit 66 und 6 Monaten. Sonderfall 1. Januar und Steuer 2026.',
    h1: 'Rente für den Jahrgang 1961',
    intro: 'Der Jahrgang 1961 wird 2026 65 Jahre alt: Die Rente nach 45 Jahren läuft schon, die Regelaltersrente folgt 2027.',
    resume: `Für 1961 Geborene beträgt die Regelaltersgrenze ${fmtAlter(regelalter(J), 'de')} (§ 235 SGB VI), die Grenze nach 45 Versicherungsjahren ${fmtAlter(besondersAlter(J), 'de')} (§ 236b) und bei Schwerbehinderung ebenfalls ${fmtAlter(schwbAlter(J).voll, 'de')}, frühestens ${fmtAlter(schwbAlter(J).frueh, 'de')} (§ 236a). Wer nach 35 Jahren mit 63 begonnen hat, trägt ${maxM(J)} Monate mal ${DE.pct(AM, 1)}, also ${DE.pct(lj.abschlag, 1)} Abschlag. Ein Geburtstag am 1. Januar verschiebt alles um einen Monat nach vorn, weil das Alter schon am 31. Dezember vollendet ist (§ 187 Abs. 2 BGB): Am 1. Januar 1961 Geborene erhalten die Regelaltersrente ab dem ${fmtMonat(rg.voll, 'de')}, am 2. Januar Geborene ab dem ${fmtMonat(f2.regel.voll, 'de')}. Die Rente nach 45 Jahren ist für den ersten Fall seit dem ${fmtMonat(bes.voll, 'de')} möglich, mit einem Besteuerungsanteil von ${DE.pct(bA(bes.voll), 1)}. Wer dagegen mit 35 Jahren noch bis zum ${fmtMonat(s27, 'de')} wartet, zahlt ${DE.pct(abschlag(m27), 1)} Abschlag und versteuert ${DE.pct(bA(s27), 1)}. Der Reformvorschlag von 2026 ist kein Gesetz.`,
    faqs: [
      { q: 'Ich bin am 1. Januar 1961 geboren: Gehöre ich rentenrechtlich noch zum Jahrgang 1960?', a: `Nein. Maßgeblich bleibt das Geburtsjahr 1961 mit seinen Altersgrenzen. Nur der Monat verschiebt sich: Weil Ihr Alter am 31. Dezember vollendet ist, beginnt jede Rente einen Monat früher als bei einem Geburtstag am 2. Januar. Die Regelaltersrente startet so am ${fmtMonat(rg.voll, 'de')} statt am ${fmtMonat(f2.regel.voll, 'de')}. Am Abschlag ändert das nichts, weil sich Beginn und Grenze gemeinsam verschieben.` },
      { q: 'Wie hoch ist der Abschlag für den Jahrgang 1961 bei einem Beginn Anfang 2027?', a: `Zwischen dem ${fmtMonat(s27, 'de')} und dem Regelbeginn am ${fmtMonat(rg.voll, 'de')} liegen bei einem Geburtstag am 1. Januar ${m27} Monate. Das ergibt ${DE.pct(abschlag(m27), 1)} Abschlag. Von ${DE.eur(B)} blieben ${DE.eur(r27)} im Monat, dauerhaft. Wer 45 Jahre hat, braucht diese Rechnung nicht: Für ihn ist die abschlagsfreie Rente bereits erreicht.` },
      { q: 'Schwerbehindert oder 45 Jahre: Welche Rente ist für 1961 Geborene früher abschlagsfrei?', a: `Keine von beiden. Für den Jahrgang 1961 liegen beide Grenzen bei ${dat(besondersAlter(J))}. Der Unterschied liegt vorher: Mit anerkannter Schwerbehinderung und 35 Jahren war ein Beginn schon ab ${dat(schwbAlter(J).frueh)} möglich, dann mit höchstens ${DE.pct(sb.abschlag, 1)} Abschlag. Die Rente nach 45 Jahren gibt es dagegen nie vor der Grenze.` },
      { q: 'Bis wann muss ich als Jahrgang 1961 den Antrag für die Regelaltersrente stellen?', a: `Damit die Rente im Monat nach dem Erreichen der Altersgrenze beginnt, muss der Antrag spätestens innerhalb von ${P.antrag.frist_monate} Kalendermonaten danach eingehen (§ 99 SGB VI); später beginnt sie erst mit dem Antragsmonat. Stellen lässt er sich frühestens ein Jahr vorher. Bei einem Regelbeginn im ${fmtMonat(rg.voll, 'de').slice(3)} ist ein Antrag also schon ab Mitte 2026 möglich.` },
      { q: 'Was bedeutet der Reformvorschlag für Menschen, die 1961 geboren sind?', a: `Die Kommission empfiehlt, die Rente nach 45 Jahren abzuschaffen und den frühesten Beginn auf 64 zu setzen. Das ist ein Vorschlag, kein Gesetz. Für den Jahrgang 1961 liegen der 64. Geburtstag und der Beginn der 45-Jahre-Rente bereits in der Vergangenheit; für jede Rente gilt das Recht zum Zeitpunkt ihres Beginns. Der Regelbeginn ${st(rg.voll)} liegt vor ${P.reform.regel_kopplung_ab}.` },
    ],
    body: (h) => `
<h2>Der 1. Januar als Sonderfall</h2>
<p>Ein Lebensjahr ist nach ${h.src('bgb_187', '§ 187 Abs. 2 BGB')} mit Ablauf des Tages vor dem Geburtstag vollendet, und die Rente beginnt mit dem folgenden Kalendermonat (${h.src('sgb6_99', '§ 99 SGB VI')}). Wer am 1. Januar 1961 geboren ist, vollendet sein Alter also am 31. Dezember und bekommt jeden Termin einen Monat früher als jemand, der einen Tag später Geburtstag hat. Gleich bleiben die Abstände und damit der Abschlag:</p>
${h.table(['Rentenart', 'Geboren 1. Januar 1961', 'Geboren 2. Januar 1961', 'Abschlag'], (['regel', 'besonders', 'schwb', 'langjaehrig'] as const).map((a) => {
  const o1 = pick(f1, a), o2 = pick(f2, a);
  return [ARTDE[a], fmtMonat(o1.frueh, 'de'), fmtMonat(o2.frueh, 'de'), h.pct(o1.abschlag, 1)];
}), 'Erster möglicher Monat je Rentenart, Jahrgang 1961', ['l', 'l', 'l', 'r'])}
<p>Das gilt für jeden Monatsersten, nicht nur für Neujahr. Beim 1. Januar fällt es nur besonders auf, weil der Termin dadurch scheinbar ins Vorjahr rückt; der Jahrgang bleibt trotzdem 1961.</p>
<h2>2026: das Jahr zwischen zwei Grenzen</h2>
<p>Alle 1961 Geborenen werden 2026 65. Damit liegt das ganze Jahr zwischen der 45-Jahre-Grenze von ${dat(besondersAlter(J))} (${h.src('sgb6_236b', '§ 236b SGB VI')}) und der Regelaltersgrenze von ${dat(regelalter(J))} (${h.src('sgb6_235', '§ 235')}). Wer noch arbeitet, steht je nach Versicherungsverlauf vor einer dieser Lagen:</p>
<ul>
<li><strong>45 Jahre erfüllt:</strong> Die abschlagsfreie Rente ist erreicht, im Beispiel seit dem ${fmtMonat(bes.voll, 'de')}. Jeder weitere Arbeitsmonat bringt nur noch die Entgeltpunkte aus dem Lohn, keinen Abschlagsvorteil mehr.</li>
<li><strong>35, aber keine 45 Jahre:</strong> Ein Beginn am ${fmtMonat(s27, 'de')} kostet ${m27} Monate mal ${h.pct(AM, 1)}, also ${h.pct(abschlag(m27), 1)}; aus ${h.eur(B)} würden ${h.eur(r27)}.</li>
<li><strong>Anerkannte Schwerbehinderung:</strong> abschlagsfrei im selben Monat wie nach 45 Jahren (${h.src('sgb6_236a', '§ 236a')}), also ebenfalls schon erreicht.</li>
<li><strong>Weniger als 35 Jahre:</strong> Es bleibt die Regelaltersrente ab dem ${fmtMonat(rg.voll, 'de')}.</li>
</ul>
<p>Ob die 45 Jahre wirklich erfüllt sind, zeigt erst der geklärte Versicherungsverlauf. Das Rentenfenster oben rechnet jede dieser Lagen mit Ihrem Geburtstag nach; den ${h.a('rentenbeginn-rechner', 'Rentenbeginn-Rechner')} gibt es auch einzeln.</p>
<h2>Der Jahrgang zwischen seinen Nachbarn</h2>
${h.table(['', 'Jahrgang 1960', 'Jahrgang 1961', 'Jahrgang 1962'], [
  ['Regelaltersgrenze', fmtAlter(regelalter(J - 1), 'de'), fmtAlter(regelalter(J), 'de'), fmtAlter(regelalter(J + 1), 'de')],
  ['45 Jahre / Schwerbehinderung', fmtAlter(besondersAlter(J - 1), 'de'), fmtAlter(besondersAlter(J), 'de'), fmtAlter(besondersAlter(J + 1), 'de')],
  ['Monate zwischen 63 und Regelgrenze', maxM(J - 1), maxM(J), maxM(J + 1)],
  ['Abschlag bei Beginn mit 63', h.pct(abschlag(maxM(J - 1)), 1), h.pct(abschlag(maxM(J)), 1), h.pct(abschlag(maxM(J + 1)), 1)],
], 'Altersgrenzen nach §§ 235, 236a, 236b SGB VI', ['l', 'r', 'r', 'r'])}
<p>Jeder Schritt in der Übergangstabelle verschiebt die Grenzen um zwei Monate und erhöht den möglichen Höchstabschlag um ${h.pct(abschlag(2), 1)}. Die Seiten zu ${h.a('jahrgang-1960', '1960')} und ${h.a('jahrgang-1962', '1962')} zeigen, was das für die Nachbarn heißt.</p>
<h2>Was das Startjahr steuerlich ausmacht</h2>
<p>Steuerpflichtig ist ein Anteil, der sich nach dem Jahr des Rentenbeginns richtet (${h.src('estg_22', '§ 22 EStG')}). Für eine Rente von ${h.eur(B)} im Monat ergibt das im ersten vollen Jahr folgende steuerpflichtige Beträge vor Abzügen:</p>
${h.table(['Start', 'Besteuerungsanteil', 'Steuerpflichtig im Jahr'], [
  [`${fmtMonat(bes.voll, 'de')} (45 Jahre)`, h.pct(bA(bes.voll), 1), h.eur(teil(bes.voll))],
  [`${fmtMonat(s27, 'de')} (35 Jahre)`, h.pct(bA(s27), 1), h.eur(teil(s27))],
  [`${fmtMonat(rg.voll, 'de')} (regulär)`, h.pct(bA(rg.voll), 1), h.eur(teil(rg.voll))],
], 'Beispiel 1.800 € Monatsrente, ohne Abschlag gerechnet', ['l', 'r', 'r'])}
<p>Zwischen ${st(bes.voll)} und ${st(rg.voll)} wächst der Anteil um ${h.num((bA(rg.voll) - bA(bes.voll)) * 100, 1)} Prozentpunkte. Ob daraus Steuer entsteht, hängt von weiteren Einkünften ab; das Verfahren erklärt ${h.a('besteuerung-rente', 'Besteuerung der Rente')}.</p>
<h2>Reform: Was für 1961 tatsächlich noch offen ist</h2>
<p>Rechnet man den Kommissionsvorschlag ohne Übergang, wäre der früheste Beginn nach 35 Jahren der ${fmtMonat(ref.fruehest.frueh, 'de')}, ein Monat, der für diesen Jahrgang bereits vorbei ist. Die ${h.src('drvReform', 'Deutsche Rentenversicherung')} stellt klar, dass für jede Rente das Recht bei ihrem Beginn gilt; wer 2025 nach 45 Jahren begonnen hat, bezieht seine Rente nach dem damals geltenden Recht. Für die anderen bleibt der Regelbeginn ${st(rg.voll)} der feste Punkt. Den Stand der Diskussion beschreibt ${h.a('rentenreform', 'Rentenreform')}.</p>`,
  },
  en: {
    slug: 'born-in-1961-pension',
    nav: 'Born in 1961',
    card: 'Standard age 66 years 6 months; born on 1 January, every date moves one month earlier.',
    title: 'Retire at 63, Born 1961: German Pension Dates, Tax 2026',
    description: 'Retiring at 63 if born in 1961: 12.6% reduction at 63, unreduced at 64 and 6 months after 45 years, standard at 66 and 6 months. The 1 January rule, tax 2026.',
    h1: 'German pension for people born in 1961',
    intro: 'The 1961 cohort turns 65 in 2026: the 45-year pension is already open, the standard pension follows in 2027.',
    resume: `If you were born in 1961, your standard retirement age (Regelaltersgrenze) is ${fmtAlter(regelalter(J), 'en')} (section 235 SGB VI). After 45 insured years the unreduced limit is ${fmtAlter(besondersAlter(J), 'en')} (section 236b), and with a recognised severe disability it is the same, with the earliest start at ${fmtAlter(schwbAlter(J).frueh, 'en')} (section 236a). Starting at 63 after 35 years costs ${maxM(J)} months times ${EN.pct(AM, 1)}, a ${EN.pct(lj.abschlag, 1)} reduction (Abschlag). A birthday on 1 January moves everything one month earlier, because German law treats the age as reached on 31 December (section 187(2) Civil Code): born on 1 January 1961, you get the standard pension from ${fmtMonat(rg.voll, 'en')}; born on 2 January, from ${fmtMonat(f2.regel.voll, 'en')}. In the first case the 45-year pension has been available since ${fmtMonat(bes.voll, 'en')}, with a taxable share of ${EN.pct(bA(bes.voll), 1)}. Waiting with 35 years until ${fmtMonat(s27, 'en')} means a ${EN.pct(abschlag(m27), 1)} reduction and a taxable share of ${EN.pct(bA(s27), 1)}. The 2026 reform proposal is not law.`,
    faqs: [
      { q: 'My passport says 1 January 1961. Does the pension start a month early for me?', a: `Yes. German law counts the age as completed at the end of the day before the birthday, so with a 1 January birthday every pension type starts one month earlier than for someone born on 2 January: the standard pension on ${fmtMonat(rg.voll, 'en')} instead of ${fmtMonat(f2.regel.voll, 'en')}. Your cohort stays 1961, and the reduction is unchanged because the start and the limit move together.` },
      { q: 'Born in 1961, what reduction applies if I start in January 2027?', a: `With a 1 January birthday there are ${m27} months between ${fmtMonat(s27, 'en')} and the standard start on ${fmtMonat(rg.voll, 'en')}. That gives a ${EN.pct(abschlag(m27), 1)} reduction, so ${EN.eur(B)} becomes ${EN.eur(r27)} a month, permanently. If you already have 45 years, the question does not arise: your unreduced pension date has passed.` },
      { q: 'For the 1961 cohort, is the disability pension unreduced earlier than the 45-year pension?', a: `No. For people born in 1961 both limits are ${fmtAlter(besondersAlter(J), 'en')}. The difference lies before that: with a recognised severe disability and 35 years you could start from ${fmtAlter(schwbAlter(J).frueh, 'en')}, then with at most ${EN.pct(sb.abschlag, 1)} off. The 45-year pension never starts before its limit, not even with a reduction.` },
      { q: 'I spent years working in another EU country. Can that still get me to 45 years if I was born in 1961?', a: 'Periods from EU and EEA countries and Switzerland are added to German periods for the qualifying periods, as long as they would also count under German rules. If that takes you to 45 years, the unreduced date for 1961 has already arrived. Germany then pays only for German periods; the other country pays its own share under its own rules.' },
      { q: 'How soon should someone born in 1961 apply for the standard pension?', a: `You can apply up to one year ahead. For the pension to start in the month after you reach the age, the application must arrive within ${P.antrag.frist_monate} calendar months after that point (section 99 SGB VI); otherwise it starts only in the month you apply. With a standard start in ${fmtMonat(rg.voll, 'en').slice(2)}, applying from mid 2026 is already possible.` },
    ],
    body: (h) => `
<h2>1 January as a special case</h2>
<p>Under ${h.src('bgb_187', 'section 187(2) of the Civil Code')} a year of life is completed at the end of the day before the birthday, and the pension starts in the following calendar month (${h.src('sgb6_99', 'section 99 SGB VI')}). Born on 1 January 1961, you complete your age on 31 December and get every date one month earlier than someone born a day later. The gaps, and therefore the reduction, stay the same:</p>
${h.table(['Pension type', 'Born 1 January 1961', 'Born 2 January 1961', 'Reduction'], (['regel', 'besonders', 'schwb', 'langjaehrig'] as const).map((a) => {
  const o1 = pick(f1, a), o2 = pick(f2, a);
  return [ARTEN[a], fmtMonat(o1.frueh, 'en'), fmtMonat(o2.frueh, 'en'), h.pct(o1.abschlag, 1)];
}), 'First possible month per pension type, born in 1961', ['l', 'l', 'l', 'r'])}
<p>This applies to anyone born on the first of a month. It is most visible on 1 January because the date seems to jump into the previous year; the cohort is still 1961.</p>
<h2>2026: a year between two limits</h2>
<p>Everyone born in 1961 turns 65 in 2026, so the whole year sits between the 45-year limit of ${fmtAlter(besondersAlter(J), 'en')} (${h.src('sgb6_236b', 'section 236b SGB VI')}) and the standard age of ${fmtAlter(regelalter(J), 'en')} (${h.src('sgb6_235', 'section 235')}). If you are still working, you are in one of these positions:</p>
<ul>
<li><strong>45 years reached:</strong> the unreduced pension is open, in the example since ${fmtMonat(bes.voll, 'en')}. Further months of work add only the pension points from your pay, no saving on the reduction.</li>
<li><strong>35 but not 45 years:</strong> starting on ${fmtMonat(s27, 'en')} costs ${m27} months times ${h.pct(AM, 1)}, so ${h.pct(abschlag(m27), 1)}; ${h.eur(B)} becomes ${h.eur(r27)}.</li>
<li><strong>Recognised severe disability:</strong> unreduced in the same month as after 45 years (${h.src('sgb6_236a', 'section 236a')}), so also already reached.</li>
<li><strong>Fewer than 35 years:</strong> only the standard pension from ${fmtMonat(rg.voll, 'en')}.</li>
</ul>
<p>Whether you really have 45 years only shows once your insurance record is clarified, and for expats that includes foreign periods. The calculator above runs each position with your birthday; the ${h.a('rentenbeginn-rechner', 'start date calculator')} is also available on its own.</p>
<h2>The cohort between its neighbours</h2>
${h.table(['', 'Born 1960', 'Born 1961', 'Born 1962'], [
  ['Standard age', fmtAlter(regelalter(J - 1), 'en'), fmtAlter(regelalter(J), 'en'), fmtAlter(regelalter(J + 1), 'en')],
  ['45 years / severe disability', fmtAlter(besondersAlter(J - 1), 'en'), fmtAlter(besondersAlter(J), 'en'), fmtAlter(besondersAlter(J + 1), 'en')],
  ['Months between 63 and standard age', maxM(J - 1), maxM(J), maxM(J + 1)],
  ['Reduction when starting at 63', h.pct(abschlag(maxM(J - 1)), 1), h.pct(abschlag(maxM(J)), 1), h.pct(abschlag(maxM(J + 1)), 1)],
], 'Age limits under sections 235, 236a, 236b SGB VI', ['l', 'r', 'r', 'r'])}
<p>Each step in the transition table moves the limits by two months and adds ${h.pct(abschlag(2), 1)} to the possible maximum reduction. See the pages for ${h.a('jahrgang-1960', '1960')} and ${h.a('jahrgang-1962', '1962')}.</p>
<h2>What the start year means for tax</h2>
<p>The taxable share depends on the year the pension begins (${h.src('estg_22', 'section 22 Income Tax Act')}). For a pension of ${h.eur(B)} a month, the taxable amount in the first full year before deductions is:</p>
${h.table(['Start', 'Taxable share', 'Taxable per year'], [
  [`${fmtMonat(bes.voll, 'en')} (45 years)`, h.pct(bA(bes.voll), 1), h.eur(teil(bes.voll))],
  [`${fmtMonat(s27, 'en')} (35 years)`, h.pct(bA(s27), 1), h.eur(teil(s27))],
  [`${fmtMonat(rg.voll, 'en')} (standard)`, h.pct(bA(rg.voll), 1), h.eur(teil(rg.voll))],
], 'Example: €1,800 monthly pension, before any reduction', ['l', 'r', 'r'])}
<p>Between ${st(bes.voll)} and ${st(rg.voll)} the share rises by ${h.num((bA(rg.voll) - bA(bes.voll)) * 100, 1)} percentage points. Whether tax is actually due depends on your other income; see ${h.a('besteuerung-rente', 'pension taxation')}.</p>
<h2>Reform: what is still open for 1961</h2>
<p>Running the commission proposal with no transition, the earliest start after 35 years would be ${fmtMonat(ref.fruehest.frueh, 'en')}, a month that has already passed for this cohort. The ${h.src('drvReform', 'German Pension Insurance')} points out that each pension follows the law in force when it begins; a 45-year pension that started in 2025 runs under the law of that time. For everyone else the standard start in ${st(rg.voll)} remains the fixed point. Progress is tracked under ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
