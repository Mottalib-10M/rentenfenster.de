import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, fmtAlter, regelalter, besondersAlter, schwbAlter, abschlagBei, type Fenster } from '../../lib/engine/alter';
import { besteuerungsanteil } from '../../lib/engine/geld';
import { DE, EN, P } from '../../lib/fmt';

/** Jahrgang 1965: Recht wie 1964, alle Termine ein Jahr später. Beispiel: Geburtstag 20. Mai. */
const J = 1965;
const lage = { wz35: true, wz45: true, schwb: true };
const g = { jahr: J, monat: 5, tag: 20 };
const f = fenster(g, lage);
const ref = fenster(g, { wz35: true, wz45: true, schwb: false }, true);
/** Gleicher Geburtstag ein Jahr früher, um nur den Kalendereffekt zu zeigen. */
const f64 = fenster({ jahr: J - 1, monat: 5, tag: 20 }, lage);
const o = (x: Fenster, art: 'regel' | 'langjaehrig' | 'besonders' | 'schwb') => x.opts.find((y) => y.art === art)!;
const rg = f.regel, lj = o(f, 'langjaehrig'), bes = o(f, 'besonders'), sb = o(f, 'schwb');
const refLj = o(ref, 'langjaehrig');
const refBeiBes = abschlagBei(ref.opts, bes.voll)!;
const B = 1500;
const st = (i: number) => Math.floor(i / 12);
const bA = (i: number) => besteuerungsanteil(st(i));
const KOPPLUNG = P.reform.regel_kopplung_ab;

export default defineGuide({
  id: 'jahrgang-1965',
  group: 'jahrgang',
  order: 206,
  tool: 'fenster',
  toolPreset: { jahr: J },
  miniHref: 'rentenbeginn-rechner',
  related: ['jahrgang-1964', 'jahrgang-1966', 'rente-mit-63', 'renteneintrittsalter-tabelle', 'besteuerung-rente', 'rentenreform'],
  sources: ['sgb6_35', 'sgb6_36', 'sgb6_37', 'sgb6_38', 'estg_22', 'bmasKommission', 'bregReform', 'drvReform'],
  de: {
    slug: 'rente-jahrgang-1965',
    nav: 'Jahrgang 1965',
    card: 'Gleiche Grenzen wie 1964, aber 63 erst 2028: höherer Steueranteil und mehr Nähe zum Reformvorschlag.',
    title: 'Rente mit 63 Jahrgang 1965: Kalender bis 2032, Reform 2026',
    description: 'Rente mit 63 Jahrgang 1965: ab 2028 mit 14,4 % Abschlag, nach 45 Jahren mit 65 im Jahr 2030, regulär 2032. Steueranteil je Startjahr und Reformvorschlag 2026.',
    h1: 'Rente für den Jahrgang 1965',
    intro: 'Für 1965 Geborene gelten dieselben Altersgrenzen wie für 1964; anders ist der Kalender, und mit ihm Steuer und Reformrisiko.',
    resume: `Rechtlich unterscheidet sich der Jahrgang 1965 nicht vom Jahrgang 1964: Regelaltersgrenze ${fmtAlter(regelalter(J), 'de')} (§ 35 SGB VI), abschlagsfrei nach 45 Jahren mit ${besondersAlter(J).j} (§ 38), bei Schwerbehinderung ebenfalls mit ${schwbAlter(J).voll.j} und frühestens mit ${schwbAlter(J).frueh.j} (§ 37), nach 35 Jahren frühestens mit 63 und dann ${DE.pct(lj.abschlag, 1)} Abschlag (§ 36). Was sich ändert, ist das Kalenderjahr. Wer am 20. Mai 1965 geboren ist, kann frühestens am ${fmtMonat(lj.frueh, 'de')} gehen, nach 45 Jahren ohne Abschlag am ${fmtMonat(bes.voll, 'de')}, regulär am ${fmtMonat(rg.voll, 'de')}. Weil der Besteuerungsanteil mit jedem Startjahr um einen halben Punkt steigt, versteuert dieser Jahrgang bei gleichem Alter mehr als 1964 Geborene: ${DE.pct(bA(lj.frueh), 1)} bei Beginn mit 63, ${DE.pct(bA(rg.voll), 1)} mit 67. Zugleich liegt jeder Termin weiter hinter dem Zeitpunkt, bis zu dem die Koalition ein Gesetz zum Kommissionsvorschlag anstrebt. Ohne Übergang gerechnet, begänne die früheste Rente erst am ${fmtMonat(ref.fruehest.frueh, 'de')}. Das ist ein Vorschlag, kein Gesetz.`,
    faqs: [
      { q: 'Wann kann ich mit Jahrgang 1965 frühestens in Rente gehen?', a: `Mit 35 Versicherungsjahren ab 63, also 2028, dann aber mit ${DE.pct(lj.abschlag, 1)} Abschlag. Bei anerkannter Schwerbehinderung schon ab ${schwbAlter(J).frueh.j}, im Beispiel mit Geburtstag am 20. Mai ab dem ${fmtMonat(sb.frueh, 'de')}, mit ${DE.pct(sb.abschlag, 1)}. Ohne Abschlag geht es frühestens mit ${besondersAlter(J).j}, nach 45 Jahren oder mit Schwerbehinderung, also 2030.` },
      { q: 'Ist für den Jahrgang 1965 irgendetwas anders als für den Jahrgang 1964?', a: `Nicht bei den Altersgrenzen: Beide Jahrgänge gehören zu den ersten mit den endgültigen Regeln der §§ 35 bis 38 SGB VI. Anders sind die Kalenderjahre und damit der Besteuerungsanteil, der für jeden Start ein Jahr später um ${DE.num((besteuerungsanteil(2029) - besteuerungsanteil(2028)) * 100, 1)} Prozentpunkte höher liegt. Und je später ein Jahrgang 63 wird, desto eher fällt sein Beginn in die Zeit nach einer möglichen Reform.` },
      { q: 'Wie viel Prozent der Rente sind beim Jahrgang 1965 steuerpflichtig?', a: `Es zählt das Jahr des Beginns (§ 22 EStG). Im Beispiel mit Geburtstag am 20. Mai sind es ${DE.pct(bA(lj.frueh), 1)} bei Beginn ${st(lj.frueh)} mit 63, ${DE.pct(bA(bes.voll), 1)} bei Beginn ${st(bes.voll)} nach 45 Jahren und ${DE.pct(bA(rg.voll), 1)} beim Regelbeginn ${st(rg.voll)}. Der übrige Teil bleibt als fester Eurobetrag steuerfrei, auch wenn die Rente später steigt.` },
      { q: 'Kann die Rente mit 63 für Menschen mit Jahrgang 1965 noch wegfallen?', a: `Die Kommission empfiehlt, den frühesten Beginn nach 35 Jahren von 63 auf 64 anzuheben. Ohne Übergang wäre das im Beispiel der ${fmtMonat(refLj.frueh, 'de')} mit ${DE.pct(refLj.abschlag, 1)} Abschlag. Ob und ab welchem Jahrgang das gilt, entscheidet erst ein Gesetz; ein Entwurf ist nicht veröffentlicht. Bis dahin bleibt der früheste Beginn mit 63 geltendes Recht.` },
      { q: 'Gilt für den Jahrgang 1965 schon die Kopplung an die Lebenserwartung?', a: `Nein, sie ist nur vorgeschlagen. Die Kommission empfiehlt, die Regelaltersgrenze ab ${KOPPLUNG} im Verhältnis 2:1 an die Lebenserwartung zu binden, bis 2041 etwa von 67 auf ${DE.num(P.reform.regel_ziel_2041, 1)}. Der Regelbeginn des Jahrgangs liegt ${st(rg.voll)}, also nach ${KOPPLUNG}. Welche Grenze sich daraus für 1965 ergäbe, legt der Vorschlag nicht fest, und der Rechner oben bildet die Kopplung nicht ab.` },
    ],
    body: (h) => `
<h2>Dasselbe Recht, ein anderer Kalender</h2>
<p>Seit dem Jahrgang 1964 gelten die Altersgrenzen der Grundvorschriften ohne Übergangsstufe: ${h.src('sgb6_35', '§ 35')} für die Regelaltersrente, ${h.src('sgb6_36', '§ 36')} nach 35 Jahren, ${h.src('sgb6_37', '§ 37')} bei Schwerbehinderung, ${h.src('sgb6_38', '§ 38')} nach 45 Jahren. Für 1965 Geborene ändert sich daran nach geltendem Recht nichts. Die Seite zum ${h.a('jahrgang-1964', 'Jahrgang 1964')} beschreibt diese Grenzen; hier geht es darum, wann sie für den Folgejahrgang greifen und was daraus folgt.</p>
<h2>Der Kalender 2026 bis 2032</h2>
<p>Mit Geburtstag am 20. Mai 1965 verteilen sich die Entscheidungen so auf die Jahre; die letzte Spalte nennt den Besteuerungsanteil, der für einen Rentenbeginn in diesem Jahr gälte (${h.src('estg_22', '§ 22 EStG')}):</p>
${h.table(['Jahr', 'Alter', 'Was in diesem Jahr möglich wird', 'Steueranteil'], [
  ['2026', 2026 - J, 'noch keine Altersrente; Versicherungsverlauf klären', h.pct(besteuerungsanteil(2026), 1)],
  [String(st(sb.frueh)), st(sb.frueh) - J, `Schwerbehinderung: ab ${fmtMonat(sb.frueh, 'de')}, ${h.pct(sb.abschlag, 1)} Abschlag`, h.pct(bA(sb.frueh), 1)],
  [String(st(lj.frueh)), st(lj.frueh) - J, `35 Jahre: ab ${fmtMonat(lj.frueh, 'de')}, ${h.pct(lj.abschlag, 1)} Abschlag`, h.pct(bA(lj.frueh), 1)],
  [String(st(lj.frueh) + 1), st(lj.frueh) + 1 - J, `35 Jahre: ${h.pct(abschlagBei(f.opts.filter((x) => x.art !== 'besonders' && x.art !== 'schwb'), lj.frueh + 12)!.abschlag, 1)} Abschlag bei Beginn im ${fmtMonat(lj.frueh + 12, 'de').slice(3)}`, h.pct(bA(lj.frueh + 12), 1)],
  [String(st(bes.voll)), st(bes.voll) - J, `45 Jahre oder Schwerbehinderung: ab ${fmtMonat(bes.voll, 'de')} ohne Abschlag`, h.pct(bA(bes.voll), 1)],
  [String(KOPPLUNG), KOPPLUNG - J, 'nach dem Vorschlag Beginn der Kopplung der Regelaltersgrenze (kein Gesetz)', h.pct(besteuerungsanteil(KOPPLUNG), 1)],
  [String(st(rg.voll)), st(rg.voll) - J, `Regelaltersrente ab ${fmtMonat(rg.voll, 'de')}`, h.pct(bA(rg.voll), 1)],
], 'Jahrgang 1965, Geburtstag 20. Mai; Alter am Jahresende', ['l', 'r', 'l', 'r'])}
<p>Wer am 1. eines Monats geboren ist, beginnt jeweils einen Monat früher; bei einem Geburtstag am 1. Januar kann ein Termin dadurch ins Vorjahr rücken. Das Rentenfenster oben rechnet Ihren genauen Tag.</p>
<h2>Gleiches Alter, höherer Steueranteil</h2>
<p>Vergleicht man denselben Geburtstag ein Jahr früher, sieht man den reinen Kalendereffekt. Wer am 20. Mai 1964 geboren ist, versteuert bei Beginn mit 63 ${h.pct(bA(o(f64, 'langjaehrig').frueh), 1)}, wer am 20. Mai 1965 geboren ist, ${h.pct(bA(lj.frueh), 1)}. Bei der Rente nach 45 Jahren sind es ${h.pct(bA(o(f64, 'besonders').voll), 1)} gegenüber ${h.pct(bA(bes.voll), 1)}, bei der Regelaltersrente ${h.pct(bA(f64.regel.voll), 1)} gegenüber ${h.pct(bA(rg.voll), 1)}. Der Unterschied ist je Jahr klein, wirkt aber über die ganze Bezugsdauer, weil der steuerfreie Teil im Jahr nach dem Beginn als Eurobetrag festgeschrieben wird. Mehr dazu unter ${h.a('besteuerung-rente', 'Besteuerung der Rente')}.</p>
<h2>Näher am Reformvorschlag als 1964</h2>
<p>Die ${h.src('bmasKommission', 'Alterssicherungskommission')} hat am 23. Juni 2026 unter anderem empfohlen, die Rente nach 45 Jahren abzuschaffen und den frühesten Beginn nach 35 Jahren auf 64 anzuheben; der Koalitionsausschuss strebt ein Gesetz bis ${h.P.reform.gesetz_ziel} an (${h.src('bregReform', 'Bundesregierung')}). Für 1965 Geborene liegt jeder Rentenbeginn mindestens ein Jahr hinter dem entsprechenden Termin des Jahrgangs 1964. Rechnet man den Vorschlag ohne Übergang durch, ergibt sich im Beispiel:</p>
<ul>
<li>frühester Beginn nach 35 Jahren am ${fmtMonat(refLj.frueh, 'de')} statt am ${fmtMonat(lj.frueh, 'de')}, mit ${h.pct(refLj.abschlag, 1)} statt ${h.pct(lj.abschlag, 1)} Abschlag;</li>
<li>keine abschlagsfreie Rente nach 45 Jahren mehr: Ein Beginn am ${fmtMonat(bes.voll, 'de')} kostete ${h.pct(refBeiBes.abschlag, 1)}, aus ${h.eur(B)} würden ${h.eur(B * (1 - refBeiBes.abschlag))}.</li>
</ul>
<p>Die Kommission verlangt Vertrauensschutz; wen er erfasst, regelt erst ein Gesetz. Die ${h.src('drvReform', 'Deutsche Rentenversicherung')} weist darauf hin, dass für jede Rente das Recht zum Zeitpunkt ihres Beginns gilt und ein Antrag höchstens ein Jahr vorher möglich ist. Planen lässt sich deshalb nur mit beiden Varianten; den Stand verfolgt ${h.a('rentenreform', 'Rentenreform')}.</p>
<h2>Zwischen 1964 und 1966</h2>
<p>Nach geltendem Recht trennt die drei Jahrgänge nur das Kalenderjahr. Der ${h.a('jahrgang-1966', 'Jahrgang 1966')} wird 63 erst ${st(lj.frueh) + 1}, die Regelaltersrente beginnt ${st(rg.voll) + 1}; die ${h.a('renteneintrittsalter-tabelle', 'Tabelle aller Jahrgänge')} zeigt die Grenzen im Überblick.</p>`,
  },
  en: {
    slug: 'born-in-1965-pension',
    nav: 'Born in 1965',
    card: 'Same limits as 1964, but 63 only in 2028: a higher taxable share and more exposure to the reform proposal.',
    title: 'Retire at 63, Born 1965: Pension Calendar 2026 to 2032',
    description: 'Retiring at 63 if born in 1965: from 2028 with 14.4% off, unreduced at 65 in 2030 after 45 years, standard pension 2032. Tax share by start year, reform 2026.',
    h1: 'German pension for people born in 1965',
    intro: 'People born in 1965 have the same age limits as the 1964 cohort; what differs is the calendar, and with it tax and reform risk.',
    resume: `In legal terms the 1965 cohort is no different from 1964: standard retirement age (Regelaltersgrenze) ${fmtAlter(regelalter(J), 'en')} (section 35 SGB VI), unreduced after 45 years at ${besondersAlter(J).j} (section 38), with a severe disability also at ${schwbAlter(J).voll.j} and from ${schwbAlter(J).frueh.j} at the earliest (section 37), after 35 years from 63 with a ${EN.pct(lj.abschlag, 1)} reduction (section 36). What changes is the calendar year. Born on 20 May 1965, you can start on ${fmtMonat(lj.frueh, 'en')} at the earliest, unreduced after 45 years on ${fmtMonat(bes.voll, 'en')}, and at the standard age on ${fmtMonat(rg.voll, 'en')}. Because the taxable share rises by half a point with each start year, this cohort pays tax on more than people born in 1964 at the same age: ${EN.pct(bA(lj.frueh), 1)} when starting at 63, ${EN.pct(bA(rg.voll), 1)} at 67. Each date also lies further beyond the point by which the coalition aims to legislate on the commission proposal. With no transition, the earliest pension would start on ${fmtMonat(ref.fruehest.frueh, 'en')}. That is a proposal, not law.`,
    faqs: [
      { q: 'Born in 1965, when is the earliest I can retire in Germany?', a: `With 35 insured years from 63, so in 2028, but with a ${EN.pct(lj.abschlag, 1)} reduction. With a recognised severe disability from ${schwbAlter(J).frueh.j}, in the example with a 20 May birthday from ${fmtMonat(sb.frueh, 'en')}, with ${EN.pct(sb.abschlag, 1)} off. Without a reduction the earliest is ${besondersAlter(J).j}, after 45 years or with a severe disability, so in 2030.` },
      { q: 'Is anything different for people born in 1965 compared with 1964?', a: `Not the age limits: both cohorts are among the first under the final rules of sections 35 to 38 SGB VI. The calendar years differ, and so does the taxable share, which is ${EN.num((besteuerungsanteil(2029) - besteuerungsanteil(2028)) * 100, 1)} percentage points higher for each start one year later. And the later a cohort turns 63, the more likely its start falls after a possible reform.` },
      { q: 'What share of my pension will be taxed if I was born in 1965?', a: `The start year decides (section 22 Income Tax Act). With a 20 May birthday it is ${EN.pct(bA(lj.frueh), 1)} for a ${st(lj.frueh)} start at 63, ${EN.pct(bA(bes.voll), 1)} for a ${st(bes.voll)} start after 45 years and ${EN.pct(bA(rg.voll), 1)} for the standard start in ${st(rg.voll)}. The rest stays tax-free as a fixed euro amount, even if the pension rises later.` },
      { q: 'Could retiring at 63 disappear for the 1965 cohort?', a: `The commission recommends raising the earliest start after 35 years from 63 to 64. With no transition that would be ${fmtMonat(refLj.frueh, 'en')} in the example, with ${EN.pct(refLj.abschlag, 1)} off. Whether and from which cohort this applies will only be set by a law; no draft has been published. Until then, 63 remains the earliest start under current law.` },
      { q: 'Does the life-expectancy link already apply to people born in 1965?', a: `No, it is only proposed. The commission recommends linking the standard age to life expectancy from ${KOPPLUNG} at a ratio of 2:1, from 67 to about ${EN.num(P.reform.regel_ziel_2041, 1)} by 2041. This cohort reaches the standard age in ${st(rg.voll)}, after ${KOPPLUNG}. The proposal does not say what limit would result for 1965, and the calculator above does not model the link.` },
    ],
    body: (h) => `
<h2>Same law, different calendar</h2>
<p>Since the 1964 cohort the age limits of the core rules apply without a transition step: ${h.src('sgb6_35', 'section 35')} for the standard pension, ${h.src('sgb6_36', 'section 36')} after 35 years, ${h.src('sgb6_37', 'section 37')} with a severe disability, ${h.src('sgb6_38', 'section 38')} after 45 years. Under current law nothing changes for people born in 1965. The ${h.a('jahrgang-1964', '1964 page')} describes those limits; this page is about when they apply to the next cohort and what follows from that.</p>
<h2>The calendar from 2026 to 2032</h2>
<p>With a birthday on 20 May 1965 the decisions fall into these years; the last column shows the taxable share that would apply to a pension starting in that year (${h.src('estg_22', 'section 22 Income Tax Act')}):</p>
${h.table(['Year', 'Age', 'What becomes possible', 'Taxable share'], [
  ['2026', 2026 - J, 'no old-age pension yet; clarify your insurance record', h.pct(besteuerungsanteil(2026), 1)],
  [String(st(sb.frueh)), st(sb.frueh) - J, `Severe disability: from ${fmtMonat(sb.frueh, 'en')}, ${h.pct(sb.abschlag, 1)} off`, h.pct(bA(sb.frueh), 1)],
  [String(st(lj.frueh)), st(lj.frueh) - J, `35 years: from ${fmtMonat(lj.frueh, 'en')}, ${h.pct(lj.abschlag, 1)} off`, h.pct(bA(lj.frueh), 1)],
  [String(st(lj.frueh) + 1), st(lj.frueh) + 1 - J, `35 years: ${h.pct(abschlagBei(f.opts.filter((x) => x.art !== 'besonders' && x.art !== 'schwb'), lj.frueh + 12)!.abschlag, 1)} off if starting in ${fmtMonat(lj.frueh + 12, 'en').slice(2)}`, h.pct(bA(lj.frueh + 12), 1)],
  [String(st(bes.voll)), st(bes.voll) - J, `45 years or severe disability: from ${fmtMonat(bes.voll, 'en')}, no reduction`, h.pct(bA(bes.voll), 1)],
  [String(KOPPLUNG), KOPPLUNG - J, 'proposal only: life-expectancy link would begin', h.pct(besteuerungsanteil(KOPPLUNG), 1)],
  [String(st(rg.voll)), st(rg.voll) - J, `Standard pension from ${fmtMonat(rg.voll, 'en')}`, h.pct(bA(rg.voll), 1)],
], 'Born 20 May 1965; age at year end', ['l', 'r', 'l', 'r'])}
<p>Born on the 1st of a month, each date is one month earlier; with a 1 January birthday a date can move into the previous year. The calculator above works with your exact day.</p>
<h2>Same age, higher taxable share</h2>
<p>Comparing the same birthday one year earlier isolates the calendar effect. Born on 20 May 1964, you would be taxed on ${h.pct(bA(o(f64, 'langjaehrig').frueh), 1)} when starting at 63; born on 20 May 1965, on ${h.pct(bA(lj.frueh), 1)}. For the 45-year pension it is ${h.pct(bA(o(f64, 'besonders').voll), 1)} against ${h.pct(bA(bes.voll), 1)}, for the standard pension ${h.pct(bA(f64.regel.voll), 1)} against ${h.pct(bA(rg.voll), 1)}. Small per year, but it lasts for the whole time you draw the pension, because the tax-free part is frozen in euros in the year after the start. If you plan to retire outside Germany, which country taxes the pension is a separate matter; see ${h.a('besteuerung-rente', 'pension taxation')}.</p>
<h2>Closer to the reform proposal than 1964</h2>
<p>On 23 June 2026 the ${h.src('bmasKommission', 'pension commission')} recommended, among other things, abolishing the 45-year pension and raising the earliest start after 35 years to 64; the coalition aims for a law by the end of 2026 (${h.src('bregReform', 'Federal Government')}). For people born in 1965, every start lies at least a year after the matching date for 1964. Running the proposal with no transition gives this for the example:</p>
<ul>
<li>earliest start after 35 years on ${fmtMonat(refLj.frueh, 'en')} instead of ${fmtMonat(lj.frueh, 'en')}, with ${h.pct(refLj.abschlag, 1)} instead of ${h.pct(lj.abschlag, 1)} off;</li>
<li>no unreduced 45-year pension: starting on ${fmtMonat(bes.voll, 'en')} would cost ${h.pct(refBeiBes.abschlag, 1)}, so ${h.eur(B)} would become ${h.eur(B * (1 - refBeiBes.abschlag))}.</li>
</ul>
<p>The commission calls for protecting legitimate expectations; who that covers will be set by law. The ${h.src('drvReform', 'German Pension Insurance')} notes that each pension follows the law in force when it starts and that you can apply at most one year ahead. You can only plan with both versions; follow progress under ${h.a('rentenreform', 'pension reform')}.</p>
<h2>Between 1964 and 1966</h2>
<p>Under current law only the calendar year separates the three cohorts. The ${h.a('jahrgang-1966', '1966 cohort')} turns 63 only in ${st(lj.frueh) + 1} and reaches the standard pension in ${st(rg.voll) + 1}; the ${h.a('renteneintrittsalter-tabelle', 'table of all cohorts')} gives the overview.</p>`,
  },
});
