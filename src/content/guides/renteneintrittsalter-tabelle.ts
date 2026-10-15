import { defineGuide } from '../../lib/guide-types';
import { regelalter, besondersAlter, schwbAlter, langjaehrigAlter, beginn, fmtMonat, fmtAlter, zuschlag } from '../../lib/engine/alter';
import { besteuerungsanteil } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Renteneintrittsalter: Regelaltersgrenze je Jahrgang 1947 bis 1964, die vier Altersrenten im Vergleich, Startmonat und Steueranteil. Alles aus dem Motor. */
const A = P.altersgrenzen;
const R = P.reform;
const WZ5 = P.erstattung.allgemeine_wartezeit_jahre;
const AKTIV = P.steuer.aktivrente_jahr;
const ZU = P.zugangsfaktor.zuschlag_monat;
const geb = (j: number) => ({ jahr: j, monat: 6, tag: 15 });
const jahre = Array.from({ length: 18 }, (_, i) => 1947 + i);
const regel = jahre.map((j) => {
  const r = regelalter(j);
  const anh = (r.j - A.regel_tabelle_basis) * 12 + r.m;
  const start = beginn(geb(j), r);
  return { j, r, anh, start, anteil: besteuerungsanteil(Math.floor(start / 12)) };
});
const r47 = regel[0];
const r58 = regel.find((x) => x.j === 1958)!;
const r60 = regel.find((x) => x.j === 1960)!;
const r63 = regel.find((x) => x.j === 1963)!;
const r64 = regel[regel.length - 1];
/** Die vier Altersrenten je Jahrgang 1958 bis 1964. */
const vier = [1958, 1959, 1960, 1961, 1962, 1963, 1964].map((j) => ({ j, r: regelalter(j), l: langjaehrigAlter(j), b: besondersAlter(j), s: schwbAlter(j) }));
/** Geburtstag am 1. gegen am 2. Januar 1964. */
const erster = beginn({ jahr: 1964, monat: 1, tag: 1 }, regelalter(1964));
const zweiter = beginn({ jahr: 1964, monat: 1, tag: 2 }, regelalter(1964));
const zu12 = zuschlag(12);

export default defineGuide({
  id: 'renteneintrittsalter-tabelle',
  group: 'beginn',
  order: 5,
  mini: 'regelalter',
  miniHref: 'rentenbeginn-rechner',
  related: ['rente-nach-45-jahren', 'langjaehrig-versicherte', 'schwerbehinderte', 'spaeter-in-rente', 'renteneintrittsalter-frauen', 'rentenreform', 'besteuerung-rente'],
  sources: ['sgb6_35', 'sgb6_235', 'sgb6_36', 'sgb6_37', 'sgb6_38', 'sgb6_50', 'sgb6_99', 'bgb_187', 'estg_22', 'estg_3', 'bmasKommission', 'vo883'],
  de: {
    slug: 'renteneintrittsalter-tabelle',
    nav: 'Renteneintrittsalter',
    card: 'Regelaltersgrenze für jeden Jahrgang ab 1947 und die früheren Altersrenten daneben.',
    title: 'Renteneintrittsalter 2026: Tabelle aller Jahrgänge',
    description: 'Renteneintrittsalter 2026 als Tabelle: Regelaltersgrenze je Jahrgang von 1947 bis 1964, Startmonat, früheste Altersrenten nach 35 und 45 Jahren, Reform.',
    h1: 'Renteneintrittsalter: die Tabelle für jeden Jahrgang',
    intro: 'Für vor 1947 Geborene lag die Grenze bei 65, ab Jahrgang 1964 liegt sie bei 67. Der Rechner nennt Ihren ersten Rentenmonat.',
    resume: `Das reguläre Renteneintrittsalter heißt im Gesetz Regelaltersgrenze. Für alle vor 1947 Geborenen lag es bei ${A.regel_tabelle_basis} Jahren. Seit dem Jahrgang 1947 steigt es nach § 235 SGB VI stufenweise: bis zum Jahrgang 1958 um einen Monat je Geburtsjahr, dann um zwei Monate. Der Jahrgang 1958 erreichte es mit ${fmtAlter(r58.r, 'de')}, der Jahrgang 1960 mit ${fmtAlter(r60.r, 'de')}, der Jahrgang 1963 mit ${fmtAlter(r63.r, 'de')}. Ab dem Jahrgang 1964 gilt dauerhaft ${fmtAlter(r64.r, 'de')} (§ 35). Daneben gibt es drei frühere Altersrenten: nach 35 Jahren ab 63 mit Abschlag, nach 45 Jahren ohne Abschlag zwei Jahre vor der Regelaltersgrenze und für schwerbehinderte Menschen. Die Rente beginnt jeweils im Monat nach Erreichen des Alters. Die Alterssicherungskommission schlägt vor, die Regelaltersgrenze ab ${R.regel_kopplung_ab} an die Lebenserwartung zu koppeln, bis 2041 auf etwa ${DE.num(R.regel_ziel_2041, 1)} Jahre; beschlossen ist das nicht.`,
    faqs: [
      { q: 'Wie hoch ist das Renteneintrittsalter für den Jahrgang 1963?', a: `${fmtAlter(r63.r, 'de')}. Wer am 15. Juni 1963 geboren ist, bekommt die Regelaltersrente ab ${fmtMonat(r63.start, 'de')}. Es ist der letzte Jahrgang mit einer Übergangsgrenze; ab 1964 gilt 67. Früher geht es mit 35 Versicherungsjahren ab 63 gegen Abschlag oder mit 45 Jahren ohne Abschlag, für den Jahrgang 1963 mit ${fmtAlter(besondersAlter(1963), 'de')}.` },
      { q: 'Welche Altersrenten gibt es in der gesetzlichen Rentenversicherung?', a: 'Für heute Rentennahe vier: die Regelaltersrente nach 5 Versicherungsjahren, die Rente für langjährig Versicherte nach 35 Jahren, die Rente für besonders langjährig Versicherte nach 45 Jahren und die Rente für schwerbehinderte Menschen. Die Altersrente für Frauen und die wegen Arbeitslosigkeit gab es nur für Jahrgänge vor 1952. Welche Rente am frühesten ohne Abschlag möglich ist, hängt an den Versicherungsjahren.' },
      { q: 'Beginnt die Rente am Geburtstag oder im Monat danach?', a: `Im Monat danach. Das Alter ist am Tag vor dem Geburtstag vollendet, die Rente zahlt ab dem folgenden Monatsersten. Deshalb gehen am 1. eines Monats Geborene einen Monat früher: Wer am 1. Januar 1964 geboren ist, erhält die Regelaltersrente ab ${fmtMonat(erster, 'de')}, wer am 2. Januar geboren ist, ab ${fmtMonat(zweiter, 'de')}.` },
      { q: 'Wie viele Versicherungsjahre brauche ich für die Regelaltersrente?', a: `${WZ5} Jahre, die allgemeine Wartezeit nach § 50 SGB VI. Zeiten aus anderen EU-Staaten, dem EWR und der Schweiz werden dabei mitgezählt. Für die Altersrente nach 35 oder 45 Jahren gelten strengere Anforderungen, für die Regelaltersrente nicht. Wer die ${WZ5} Jahre nicht erreicht, bekommt keine Rente; bei Wegzug ins Ausland kommt dann unter Umständen eine Erstattung der Beiträge in Frage.` },
      { q: 'Was passiert, wenn ich über die Regelaltersgrenze hinaus arbeite?', a: `Jeder Monat, den Sie die Rente später beginnen, erhöht sie um ${DE.pct(ZU, 1)}, ein Jahr also um ${DE.pct(zu12, 1)}, dauerhaft. Wer stattdessen die Rente nimmt und als Arbeitnehmer weiterarbeitet, kann bis zu ${DE.eur(AKTIV)} Arbeitslohn im Jahr steuerfrei verdienen, die sogenannte Aktivrente. Beides gilt erst ab der Regelaltersgrenze.` },
      { q: 'Steigt das Renteneintrittsalter über 67?', a: `Nach geltendem Recht nicht. Die Alterssicherungskommission hat 2026 vorgeschlagen, die Regelaltersgrenze ab ${R.regel_kopplung_ab} an die Lebenserwartung zu koppeln, im Verhältnis zwei zu eins zwischen Arbeits- und Rentenzeit, bis 2041 auf etwa ${DE.num(R.regel_ziel_2041, 1)} Jahre. Ein Gesetzentwurf ist nicht veröffentlicht. Welche Jahrgänge betroffen wären, legt erst ein Gesetz fest.` },
    ],
    body: (h) => `
<h2>Regelaltersgrenze je Jahrgang</h2>
<p>Die Tabelle nennt für jeden Jahrgang von 1947 bis 1964 die Regelaltersgrenze nach ${h.src('sgb6_235', '§ 235 SGB VI')} und ${h.src('sgb6_35', '§ 35 SGB VI')}, die Anhebung gegenüber ${A.regel_tabelle_basis} Jahren, den ersten Rentenmonat bei einem Geburtstag am 15. Juni und den Anteil der Rente, der im Startjahr der Steuer unterliegt.</p>
${h.table(['Jahrgang', 'Regelaltersgrenze', 'Anhebung in Monaten', 'Regelaltersrente ab', 'Besteuerungsanteil'], regel.map((x) => [x.j === 1964 ? h.a('jahrgang-1964', 'ab 1964') : x.j >= 1960 ? h.a(`jahrgang-${x.j}`, String(x.j)) : String(x.j), fmtAlter(x.r, 'de'), h.num(x.anh), fmtMonat(x.start, 'de'), h.pct(x.anteil, 1)]), 'Geburtstag am 15. Juni; vor 1947 Geborene: 65 Jahre', ['l', 'l', 'r', 'l', 'r'])}
<p>Die Anhebung verläuft in zwei Stufen. Von ${r47.j} bis 1958 kommt je Jahrgang ein Monat hinzu, sodass der Jahrgang 1958 bei ${fmtAlter(r58.r, 'de')} ankommt. Danach sind es zwei Monate je Jahrgang, bis mit 1964 die Endstufe von ${fmtAlter(r64.r, 'de')} erreicht ist. Wer 1960 geboren ist, geht damit ${h.num(r60.anh)} Monate später als ein 1946 Geborener. Für die Jahrgänge bis 1959 ist die Regelaltersrente bereits erreicht; bei einem Geburtstag im Juni 1960 beginnt sie ${fmtMonat(r60.start, 'de')}.</p>
<h2>Die vier Altersrenten nebeneinander</h2>
<p>Die Regelaltersgrenze ist nur der späteste der üblichen Termine. Wer genug Versicherungsjahre hat, kann früher gehen. Die zweite Tabelle stellt für die Jahrgänge ab 1958 alle vier Altersrenten nebeneinander:</p>
${h.table(['Jahrgang', 'Regelaltersrente', 'Nach 35 Jahren, frühestens', 'Nach 45 Jahren', 'Schwerbehindert, ohne Abschlag / frühestens'], vier.map((x) => [x.j === 1964 ? 'ab 1964' : String(x.j), fmtAlter(x.r, 'de'), fmtAlter(x.l.frueh, 'de'), fmtAlter(x.b, 'de'), `${fmtAlter(x.s.voll, 'de')} / ${fmtAlter(x.s.frueh, 'de')}`]), 'Altersgrenzen nach §§ 35 bis 38 und 235 bis 236b SGB VI', ['l', 'l', 'l', 'l', 'l'])}
<p>Jede Spalte hat ihre eigenen Voraussetzungen. Die Regelaltersrente braucht nur ${WZ5} Jahre (${h.src('sgb6_50', '§ 50 SGB VI')}). Die ${h.a('langjaehrig-versicherte', 'Rente nach 35 Jahren')} ist ab 63 möglich, kostet aber bis zur Regelaltersgrenze Abschlag (${h.src('sgb6_36', '§ 36')}). Die ${h.a('rente-nach-45-jahren', 'Rente nach 45 Jahren')} zahlt ohne Abschlag, aber nie vor ihrer Grenze (${h.src('sgb6_38', '§ 38')}). Die ${h.a('schwerbehinderte', 'Rente für schwerbehinderte Menschen')} verlangt einen Grad der Behinderung von mindestens 50 bei Rentenbeginn und 35 Jahre (${h.src('sgb6_37', '§ 37')}). Die Altersrenten für Frauen und wegen Arbeitslosigkeit stehen nicht in der Tabelle, weil sie nur vor 1952 Geborenen offenstanden; mehr dazu unter ${h.a('renteneintrittsalter-frauen', 'Renteneintrittsalter für Frauen')}.</p>
<h2>Vom Rentenalter zum ersten Zahlmonat</h2>
<p>Ein Alter ist nach ${h.src('bgb_187', '§ 187 Abs. 2 BGB')} mit Ablauf des Vortags des Geburtstags vollendet. Die Rente beginnt mit dem folgenden Kalendermonat (${h.src('sgb6_99', '§ 99 SGB VI')}). Für die meisten heißt das: Geburtstag im Juni, Rente ab Juli. Eine Ausnahme bilden Menschen, deren Geburtstag auf den Ersten fällt. Sie vollenden ihr Alter am letzten Tag des Vormonats und starten einen Monat eher. Am 1. Januar 1964 Geborene erhalten die Regelaltersrente ab ${fmtMonat(erster, 'de')}, am 2. Januar Geborene erst ab ${fmtMonat(zweiter, 'de')}.</p>
<p>Diese Regel setzt einen rechtzeitigen Antrag voraus: Er muss spätestens im dritten Kalendermonat nach Erreichen der Altersgrenze eingehen, sonst beginnt die Rente mit dem Antragsmonat. Wie man das vorbereitet, steht unter ${h.a('rente-beantragen', 'Rente beantragen')}.</p>
<h2>Das Startjahr bestimmt den Steueranteil</h2>
<p>Die letzte Spalte der ersten Tabelle zeigt einen Nebeneffekt des Rentenalters. Welcher Teil der Rente steuerpflichtig ist, richtet sich nach dem Jahr des Rentenbeginns (${h.src('estg_22', '§ 22 EStG')}), und mit jedem Jahrgang rückt dieses Jahr weiter nach hinten. Der Jahrgang 1958 begann mit ${h.pct(r58.anteil, 1)}, wer ab 1964 geboren ist und mit 67 startet, versteuert ${h.pct(r64.anteil, 1)}. Der steuerfreie Rest wird im Jahr nach dem Beginn als Eurobetrag festgeschrieben. Die vollständige Tabelle steht unter ${h.a('besteuerung-rente', 'Besteuerung der Rente')}.</p>
<h2>Länger arbeiten als bis zur Grenze</h2>
<p>Die Regelaltersgrenze ist kein Pflichttermin. Wer die Rente aufschiebt, erhält für jeden Monat ${h.pct(ZU, 1)} Zuschlag, für ein Jahr ${h.pct(zu12, 1)}, lebenslang; Einzelheiten unter ${h.a('spaeter-in-rente', 'Später in Rente')}. Wer die Rente nimmt und als Arbeitnehmer weiterarbeitet, kann bis zu ${h.eur(AKTIV)} Arbeitslohn im Jahr steuerfrei verdienen (${h.src('estg_3', '§ 3 EStG')}), ab dem Monat nach Erreichen der Grenze. Die Grenze ist also auch der Tag, ab dem sich Arbeit steuerlich anders rechnet.</p>
<h2>Der Vorschlag: Rentenalter nach Lebenserwartung</h2>
<p>Die Alterssicherungskommission empfiehlt in ihrem Bericht vom 23. Juni 2026, die Regelaltersgrenze ab ${R.regel_kopplung_ab} an die Lebenserwartung zu binden: Von jedem gewonnenen Lebensjahr sollen zwei Drittel auf die Arbeit und ein Drittel auf die Rente entfallen, was bis 2041 etwa ${h.num(R.regel_ziel_2041, 1)} Jahre ergäbe (${h.src('bmasKommission', 'Bundesarbeitsministerium')}). Zugleich soll die Rente nach 35 Jahren erst ab 64 möglich sein und die Rente nach 45 Jahren entfallen. All das ist ein Vorschlag, kein Gesetz. Die Tabellen oben geben das geltende Recht wieder; den Stand der Reform beschreibt ${h.a('rentenreform', 'Rentenreform')}.</p>`,
  },
  en: {
    slug: 'retirement-age-table',
    nav: 'Retirement age',
    card: 'The standard retirement age for every cohort from 1947, with the earlier pensions beside it.',
    title: 'Retirement age in Germany 2026: table by year of birth',
    description: 'Retirement age in Germany 2026: the standard age for each birth year from 1947 to 1964, first pension month, earlier pensions after 35 and 45 years, reform.',
    h1: 'German retirement age: the table for every birth year',
    intro: 'People born before 1947 retired at 65; from the 1964 cohort the age is 67. The calculator gives your first pension month.',
    resume: `Germany’s statutory retirement age is called the standard retirement age (Regelaltersgrenze). For everyone born before 1947 it was ${A.regel_tabelle_basis}. From the 1947 cohort it has been rising in steps under section 235 of Book VI of the Social Code (SGB VI): by one month per birth year up to 1958, then by two months. People born in 1958 reached it at ${fmtAlter(r58.r, 'en')}, those born in 1960 at ${fmtAlter(r60.r, 'en')}, those born in 1963 at ${fmtAlter(r63.r, 'en')}. From the 1964 cohort it is permanently ${fmtAlter(r64.r, 'en')} (section 35). Three earlier old-age pensions sit beside it: after 35 years from 63 with a reduction, after 45 years without a reduction two years before the standard age, and for people with a severe disability. Each pension starts in the month after the age is reached. The pension commission has proposed linking the standard age to life expectancy from ${R.regel_kopplung_ab}, to about ${EN.num(R.regel_ziel_2041, 1)} by 2041; nothing has been decided.`,
    faqs: [
      { q: 'What is the German retirement age for someone born in 1963?', a: `${fmtAlter(r63.r, 'en')}. Born on 15 June 1963, you receive the standard pension from ${fmtMonat(r63.start, 'en')}. It is the last cohort with a transitional age; from 1964 the age is 67. Earlier routes exist with 35 insured years from 63 with a reduction, or with 45 years without one, which for the 1963 cohort means ${fmtAlter(besondersAlter(1963), 'en')}.` },
      { q: 'How many years must I have paid in to get a German state pension at all?', a: `${WZ5} years, the general qualifying period under section 50 SGB VI. If you have worked in other EU or EEA countries or Switzerland, those periods are added to reach the ${WZ5} years. Each country then pays a pension for its own periods only, so a short German career produces a small German pension.` },
      { q: 'Does my pension start on my birthday or the month after?', a: `The month after. You complete an age at the end of the day before your birthday, and the pension starts on the first of the next month. That is why people born on the 1st start a month earlier: born on 1 January 1964, you get the standard pension from ${fmtMonat(erster, 'en')}; born on 2 January, from ${fmtMonat(zweiter, 'en')}.` },
      { q: 'Which old-age pensions does the German system offer?', a: 'For people nearing retirement today there are four: the standard old-age pension after 5 insured years, the pension for long-term insured persons after 35 years, the pension for especially long-term insured persons after 45 years and the pension for severely disabled people. The old-age pensions for women and after unemployment were only open to those born before 1952.' },
      { q: 'What happens if I work beyond the standard retirement age in Germany?', a: `Each month you defer the pension raises it by ${EN.pct(ZU, 1)}, so a year adds ${EN.pct(zu12, 1)} for life. If you draw the pension and keep working as an employee, up to ${EN.eur(AKTIV)} of wages a year are tax-free under the so-called active pension (Aktivrente). Both only apply once you have reached the standard age.` },
      { q: 'Will the German retirement age go above 67?', a: `Not under current law. In 2026 the pension commission proposed linking the standard age to life expectancy from ${R.regel_kopplung_ab}, splitting each extra year of life two to one between work and retirement, which would mean about ${EN.num(R.regel_ziel_2041, 1)} by 2041. No draft bill has been published, and only a law would say which birth years are affected.` },
    ],
    body: (h) => `
<h2>Standard retirement age by birth year</h2>
<p>For each cohort from 1947 to 1964 the table shows the standard age under ${h.src('sgb6_235', 'section 235 SGB VI')} and ${h.src('sgb6_35', 'section 35 SGB VI')}, the increase over ${A.regel_tabelle_basis}, the first pension month for a birthday on 15 June, and the share of the pension that is taxable when it starts in that year.</p>
${h.table(['Born', 'Standard age', 'Increase in months', 'Standard pension from', 'Taxable share'], regel.map((x) => [x.j === 1964 ? h.a('jahrgang-1964', '1964 and later') : x.j >= 1960 ? h.a(`jahrgang-${x.j}`, String(x.j)) : String(x.j), fmtAlter(x.r, 'en'), h.num(x.anh), fmtMonat(x.start, 'en'), h.pct(x.anteil, 1)]), 'Birthday 15 June; born before 1947: 65', ['l', 'l', 'r', 'l', 'r'])}
<p>The rise came in two phases. From ${r47.j} to 1958 each cohort added one month, taking the 1958 cohort to ${fmtAlter(r58.r, 'en')}. After that each cohort added two months until the final level of ${fmtAlter(r64.r, 'en')} was reached with 1964. Someone born in 1960 therefore retires ${h.num(r60.anh)} months later than someone born in 1946. Cohorts up to 1959 have already reached their standard pension; with a June 1960 birthday it begins in ${fmtMonat(r60.start, 'en')}.</p>
<h2>All four old-age pensions side by side</h2>
<p>The standard age is the latest of the usual dates. With enough insured years you can leave earlier. The second table lines up the four old-age pensions (Altersrenten) for the cohorts from 1958:</p>
${h.table(['Born', 'Standard pension', 'After 35 years, earliest', 'After 45 years', 'Severe disability, unreduced / earliest'], vier.map((x) => [x.j === 1964 ? '1964 and later' : String(x.j), fmtAlter(x.r, 'en'), fmtAlter(x.l.frueh, 'en'), fmtAlter(x.b, 'en'), `${fmtAlter(x.s.voll, 'en')} / ${fmtAlter(x.s.frueh, 'en')}`]), 'Age limits under sections 35 to 38 and 235 to 236b SGB VI', ['l', 'l', 'l', 'l', 'l'])}
<p>Each column has its own conditions. The standard pension needs only ${WZ5} years (${h.src('sgb6_50', 'section 50 SGB VI')}). The ${h.a('langjaehrig-versicherte', '35-year pension')} can start at 63 but carries a reduction up to the standard age (${h.src('sgb6_36', 'section 36')}). The ${h.a('rente-nach-45-jahren', '45-year pension')} pays in full but never before its own limit (${h.src('sgb6_38', 'section 38')}). The ${h.a('schwerbehinderte', 'pension with a severe disability')} requires a recognised degree of disability of at least 50 when it starts, plus 35 years (${h.src('sgb6_37', 'section 37')}). For expats, insurance years from other EU countries are added to reach these thresholds under ${h.src('vo883', 'Regulation 883/2004')}, but they do not raise the German amount.</p>
<h2>From retirement age to first payment month</h2>
<p>Under ${h.src('bgb_187', 'section 187(2) of the Civil Code')} you complete an age at the end of the day before your birthday, and the pension starts with the following calendar month (${h.src('sgb6_99', 'section 99 SGB VI')}). For most people: birthday in June, pension from July. People born on the 1st are the exception. They complete their age on the last day of the previous month and start one month sooner. Born on 1 January 1964, you get the standard pension from ${fmtMonat(erster, 'en')}; born on 2 January, only from ${fmtMonat(zweiter, 'en')}.</p>
<p>That timing assumes you apply in time: the application must reach the pension insurance by the end of the third calendar month after you reach the age, otherwise the pension starts in the month you apply. Preparation is covered under ${h.a('rente-beantragen', 'applying for your pension')}.</p>
<h2>The start year sets the taxable share</h2>
<p>The last column of the first table shows a side effect of the retirement age. The taxable part of a German pension depends on the year it starts (${h.src('estg_22', 'section 22 Income Tax Act')}), and with each cohort that year moves later. The 1958 cohort started at ${h.pct(r58.anteil, 1)}; someone born from 1964 who starts at 67 is taxed on ${h.pct(r64.anteil, 1)}. The tax-free remainder is fixed as a euro amount in the year after the start. The full German table is under ${h.a('besteuerung-rente', 'taxation of German pensions')}.</p>
<h2>Working past the standard age</h2>
<p>The standard age is not a compulsory exit. Deferring the pension adds ${h.pct(ZU, 1)} for each month, ${h.pct(zu12, 1)} for a full year, for life; see ${h.a('spaeter-in-rente', 'retiring later')}. If you draw the pension and keep working as an employee, up to ${h.eur(AKTIV)} of wages a year are tax-free (${h.src('estg_3', 'section 3 Income Tax Act')}), from the month after you reach the standard age. So the date also changes how work is taxed.</p>
<h2>The proposal: retirement age tied to life expectancy</h2>
<p>In its report of 23 June 2026 the pension commission recommends linking the standard age to life expectancy from ${R.regel_kopplung_ab}: two thirds of each year of life gained would go to work and one third to retirement, which would give about ${h.num(R.regel_ziel_2041, 1)} years by 2041 (${h.src('bmasKommission', 'Federal Ministry of Labour')}). It also proposes moving the 35-year pension to 64 and abolishing the 45-year pension. All of this is a proposal, not law. The tables above show current law; the state of play is under ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
