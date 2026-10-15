/** Startseite (Säule): Rentenalter und Rentenbeginn je Jahrgang, in beiden Sprachen. Rechtswerte über P, Beispiele aus dem Motor. */
import type { FAQ, Helpers } from '../lib/guide-types';
import { fenster, regelalter, besondersAlter, fmtAlter, fmtMonat, breakEven, beginn } from '../lib/engine/alter';
import { nettoStandard, besteuerungsanteil, steuerfreieGrenze, ausgleich } from '../lib/engine/geld';
import { freibetrag } from '../lib/engine/hinterbliebene';
import { P } from '../lib/fmt';

interface HomeText { title: string; description: string; h1: string; intro: string; resume: (h: Helpers) => string; faqs: (h: Helpers) => FAQ[]; body: (h: Helpers) => string }

const RW = P.rentenwert.ab_2026_07;
const g64 = { jahr: 1964, monat: 6, tag: 15 };
const f64 = fenster(g64, { wz35: true, wz45: false, schwb: false });
const f64b = fenster(g64, { wz35: true, wz45: true, schwb: false });
const f64r = fenster(g64, { wz35: true, wz45: true, schwb: false }, true);
const g01 = { jahr: 1964, monat: 6, tag: 1 };
const erster = beginn(g01, regelalter(1964));
const be24 = breakEven(24, 1600, RW);
const n1600 = nettoStandard(1600);
const grenze26 = steuerfreieGrenze(2026);
const aus = ausgleich(45, 0.072, RW);
const beispiele = [1960, 1962, 1964, 1966].map((j) => {
  const g = { jahr: j, monat: 6, tag: 15 };
  const a = fenster(g, { wz35: true, wz45: false, schwb: false });
  return { j, regel: a.regel, frueh: a.fruehest, b45: besondersAlter(j) };
});

export const HOME: Record<'de' | 'en', HomeText> = {
  de: {
    title: 'Rentenalter 2026: Rentenbeginn und Abschlag je Jahrgang',
    description: 'Rentenalter 2026 für jeden Jahrgang auf den Monat: Rente mit 63, nach 45 Jahren, Schwerbehinderung, Abschlag, Nettorente und der Reformvorschlag. Kostenlos.',
    h1: 'Rentenalter 2026: wann Ihre Rente beginnt',
    intro: 'Geburtsdatum und Versicherungsjahre eingeben: Das Rentenfenster zeigt jede Altersrente mit Startmonat und Abschlag, nach geltendem Recht und neben dem Vorschlag der Kommission.',
    resume: (h) => `Die Regelaltersgrenze liegt für alle ab 1964 Geborenen bei 67 Jahren (${'§'} 35 SGB VI); für die Jahrgänge 1958 bis 1963 steigt sie in Stufen von 66 auf 66 Jahre und 10 Monate (§ 235). Früher geht es auf drei Wegen. Nach 35 Versicherungsjahren ab 63, mit 0,3 Prozent Abschlag für jeden Monat vor der Regelaltersgrenze: für den Jahrgang 1964 sind das ${h.num(f64.fruehest.monate)} Monate und ${h.pct(f64.fruehest.abschlag)}, lebenslang. Nach 45 Jahren ohne Abschlag, ab Jahrgang 1964 mit 65. Mit anerkannter Schwerbehinderung ohne Abschlag mit 65, frühestens mit 62 und höchstens 10,8 Prozent Abschlag. Die Rente beginnt im Monat nach dem Geburtstag, wer am Ersten geboren ist, einen Monat früher. Ein Monat Rente ist 2026 pro Entgeltpunkt ${h.eur(RW, 2)} wert. Die Alterssicherungskommission hat am 23. Juni 2026 vorgeschlagen, die Rente nach 45 Jahren abzuschaffen und die Frührente erst ab 64 zu erlauben; das ist kein Gesetz, und ein Entwurf liegt nicht vor.`,
    faqs: (h) => [
      { q: 'Wann kann ich mit Jahrgang 1964 in Rente gehen?', a: `Ohne Abschlag mit 67, also ab dem Monat nach dem 67. Geburtstag. Mit 45 Versicherungsjahren ohne Abschlag schon mit 65. Mit 35 Jahren frühestens mit 63, dann mit ${h.pct(f64.fruehest.abschlag)} Abschlag für ${h.num(f64.fruehest.monate)} Monate. Wer im Juni 1964 am 15. geboren ist, kann so ab dem ${fmtMonat(f64.fruehest.frueh, 'de')} gehen; am 1. Juni Geborene einen Monat früher.` },
      { q: 'Warum beginnt meine Rente einen Monat früher, wenn ich am Ersten geboren bin?', a: `Nach § 187 Abs. 2 BGB zählt der Geburtstag beim Lebensalter mit, das Alter ist also am Vortag vollendet. Wer am 1. Juni 1964 geboren ist, wird am 31. Mai 2031 rechtlich 67; die Rente beginnt am ${fmtMonat(erster, 'de')}, nicht im Juli. Für alle anderen Tage im Monat beginnt sie am Ersten des Folgemonats (§ 99 SGB VI).` },
      { q: 'Wie hoch ist der Abschlag, wenn ich zwei Jahre früher gehe?', a: `24 Monate mal 0,3 Prozent, also 7,2 Prozent, für die gesamte Rentenzeit, auch für eine spätere Witwenrente aus dieser Rente. Einige Ratgeberseiten nennen dafür 14,4 Prozent; das ist der Abschlag für vier Jahre. Aus 1.600 € werden ${h.eur(be24.gekuerzt)}. Gemessen an den zwei zusätzlichen Rentenjahren holt die spätere Rente den Vorsprung erst nach etwa ${h.num(be24.monate / 12)} Jahren ein.` },
      { q: 'Zählt die Arbeitslosigkeit für die 45 Jahre?', a: 'Zeiten mit Arbeitslosengeld zählen, Bürgergeld und das frühere Arbeitslosengeld II nicht. Ausnahme: Arbeitslosengeld in den letzten zwei Jahren vor Rentenbeginn zählt nur, wenn es durch Insolvenz oder vollständige Geschäftsaufgabe des Arbeitgebers ausgelöst wurde (§ 51 Abs. 3a SGB VI). Schul- und Studienzeiten zählen ebenfalls nicht, Kindererziehung bis zum zehnten Geburtstag und Pflegezeiten schon.' },
      { q: 'Kann ich neben der vorgezogenen Rente unbegrenzt hinzuverdienen?', a: `Ja. Seit dem 1. Januar 2023 gibt es für Altersrenten keine Hinzuverdienstgrenze mehr, auch nicht vor der Regelaltersgrenze. Der Lohn kostet dann zwar Steuern und Beiträge, erhöht aber die Rente über neue Entgeltpunkte. Nach der Regelaltersgrenze sind bis zu ${h.eur(P.steuer.aktivrente_jahr)} Arbeitslohn im Jahr steuerfrei (§ 3 Nr. 21 EStG). Für Erwerbsminderungsrenten gelten weiter Grenzen.` },
      { q: 'Wie viel bleibt von 1.600 € Rente netto?', a: `Bei Rentenbeginn 2026, alleinstehend, mit Kindern und dem durchschnittlichen Zusatzbeitrag von ${h.num(P.kv.zusatz_durchschnitt_2026 * 100, 1)} Prozent: ${h.eur(n1600.kv, 2)} Krankenversicherung, ${h.eur(n1600.pv, 2)} Pflegeversicherung und ${h.eur(n1600.steuerMonat, 2)} Steuer im Monatsschnitt, es bleiben ${h.eur(n1600.netto)}. Einkommensteuer fällt im Standardfall erst ab etwa ${h.eur(grenze26)} Bruttorente an.` },
      { q: 'Gilt die Abschaffung der Rente nach 45 Jahren schon?', a: 'Nein. Die Alterssicherungskommission hat das am 23. Juni 2026 empfohlen, der Koalitionsausschuss will die Empfehlungen umsetzen und strebt ein Gesetz bis Ende 2026 an. Einen veröffentlichten Gesetzentwurf gibt es bis heute nicht, und welche Jahrgänge Vertrauensschutz bekämen, ist offen. Bis ein Gesetz verkündet ist, gilt das Recht, das dieser Rechner anwendet.' },
    ],
    body: (h) => `
<h2>Wie der Rentenbeginn berechnet wird</h2>
<p>Drei Dinge legen den ersten Rentenmonat fest: das Geburtsjahr, der Geburtstag und die Rentenart. Das Geburtsjahr bestimmt die Regelaltersgrenze. Sie ist für alle ab 1964 Geborenen 67 Jahre (${h.src('sgb6_35', '§ 35 SGB VI')}). Wer zwischen 1958 und 1963 geboren ist, fällt in die Übergangstabelle des ${h.src('sgb6_235', '§ 235 SGB VI')}: 66 Jahre für 1958, dann zwei Monate mehr je Jahrgang, bis 66 Jahre und 10 Monate für 1963. Wer 1947 bis 1957 geboren ist, hat die Grenze bereits erreicht.</p>
<p>Der Geburtstag bestimmt den Monat. Die Rente beginnt nicht am Geburtstag, sondern am Ersten des Folgemonats, wenn die Voraussetzungen zu Beginn dieses Monats erfüllt sind (${h.src('sgb6_99', '§ 99 SGB VI')}). Weil das Lebensalter nach ${h.src('bgb_187', '§ 187 Abs. 2 BGB')} am Tag vor dem Geburtstag vollendet ist, rückt für alle, die am Ersten eines Monats geboren sind, der Rentenbeginn um einen Monat vor. Das klingt nach einer Fußnote, kostet aber bei einer Rente von 1.600 € genau 1.600 €, wenn man es übersieht und einen Monat zu spät plant.</p>
<p>Die Rentenart bestimmt, wie weit man vor die Regelaltersgrenze gehen kann und zu welchem Preis. Das Rentenfenster oben rechnet jede Rentenart einzeln und zeigt den frühesten Monat, den Abschlag dort und den ersten Monat ohne Abschlag. Für den Jahrgang ${h.a('jahrgang-1964', '1964')} mit 40 Versicherungsjahren ist der früheste Beginn der ${fmtMonat(f64.fruehest.frueh, 'de')} mit ${h.pct(f64.fruehest.abschlag)} Abschlag; mit 45 Jahren ist der ${fmtMonat(f64b.abschlagsfrei.voll, 'de')} der erste Monat ohne Abschlag.</p>

<h2>Warum Geburtsmonat und Rentenart alles ändern</h2>
<p>Die meisten Tabellen im Netz nennen ein Alter pro Jahrgang und hören dort auf. Für die Planung reicht das nicht. Zwischen einem Geburtstag am 1. und am 2. eines Monats liegt ein ganzer Rentenmonat. Zwischen der Rente nach 35 und nach 45 Jahren liegen beim Jahrgang 1964 zwei Jahre und 7,2 Prozentpunkte Abschlag. Und die Jahrgänge 1958 bis 1963 haben in jeder Rentenart eigene Grenzen, die nicht parallel laufen: Beim Jahrgang 1962 liegt die Regelaltersgrenze bei 66 Jahren und 8 Monaten, die Grenze nach 45 Jahren bei 64 Jahren und 8 Monaten, die frühe Schwerbehindertenrente bei 61 Jahren und 8 Monaten (${h.src('sgb6_236a', '§ 236a')}, ${h.src('sgb6_236b', '§ 236b SGB VI')}).</p>
<p>Deshalb rechnet diese Seite jede Kombination aus Jahrgang, Monat, Tag und Rentenart einzeln, mit den Tabellen aus dem Gesetz, und legt daneben ein zweites Szenario: das Recht, wie es aussähe, wenn der Vorschlag der Alterssicherungskommission ohne Übergang Gesetz würde. Kein anderer Rechner, den wir gefunden haben, zeigt beides für den eigenen Geburtstag. Die Zeitleiste über diesem Text zeigt dasselbe für die Jahrgänge 1958 bis 1970 auf einen Blick.</p>

<h2>Die vier Altersrenten</h2>
<h3>Regelaltersrente</h3>
<p>Sie braucht nur fünf Jahre Versicherung, die allgemeine Wartezeit (${h.src('sgb6_50', '§ 50 SGB VI')}). Sie beginnt nie mit Abschlag. Wer danach weiterarbeitet und die Rente aufschiebt, bekommt für jeden Monat 0,5 Prozent Zuschlag; mehr dazu unter ${h.a('spaeter-in-rente', 'später in Rente')}.</p>
<h3>Altersrente für langjährig Versicherte</h3>
<p>Nach 35 Jahren mit rentenrechtlichen Zeiten ist sie ab 63 möglich, für jeden Jahrgang (${h.src('sgb6_236', '§ 236')} und ${h.src('sgb6_36', '§ 36 SGB VI')}). Ohne Abschlag gibt es sie erst mit der Regelaltersgrenze, also in der Praxis nur mit Abschlag. Auf die 35 Jahre zählen fast alle Zeiten, auch Schule ab 17, Studium, Arbeitslosigkeit und Krankheit. Das ist die Rente, die umgangssprachlich oft als ${h.a('rente-mit-63', 'Rente mit 63')} bezeichnet wird.</p>
<h3>Altersrente für besonders langjährig Versicherte</h3>
<p>Nach 45 Jahren gibt es sie ohne Abschlag, ab Jahrgang 1964 mit 65 (${h.src('sgb6_38', '§ 38 SGB VI')}). Früher als diese Grenze geht sie nicht; wer trotzdem mit 63 gehen will, nimmt die Rente für langjährig Versicherte und den vollen Abschlag bis zur Regelaltersgrenze. Was auf die 45 Jahre zählt, ist enger als bei den 35 Jahren: Pflichtbeiträge, Kindererziehung bis zum zehnten Geburtstag, Pflege, Arbeitslosengeld außer in den letzten zwei Jahren (${h.src('sgb6_51', '§ 51 Abs. 3a')}). Die Einzelheiten stehen unter ${h.a('wartezeit-45-jahre', 'was für die 45 Jahre zählt')}.</p>
<h3>Altersrente für schwerbehinderte Menschen</h3>
<p>Mit einem Grad der Behinderung von mindestens 50 bei Rentenbeginn und 35 Versicherungsjahren ist sie ab Jahrgang 1964 mit 65 ohne Abschlag möglich, mit 62 frühestens, dann mit 10,8 Prozent Abschlag (${h.src('sgb6_37', '§ 37 SGB VI')}). Der Abschlag ist hier gedeckelt, weil zwischen frühestem und abschlagsfreiem Beginn nur 36 Monate liegen. Siehe ${h.a('schwerbehinderte', 'Rente für Schwerbehinderte')}.</p>
<!--mini:fruehVerlust-->
<h2>Abschläge richtig rechnen</h2>
<p>Der Abschlag folgt aus dem Zugangsfaktor: 1,0 minus 0,003 für jeden Monat, den die Rente vor dem abschlagsfreien Termin beginnt (${h.src('sgb6_77', '§ 77 SGB VI')}). Zwei Jahre sind 7,2 Prozent, drei Jahre 10,8 Prozent, vier Jahre 14,4 Prozent. Der Abschlag gilt lebenslang und bleibt auch in einer späteren Witwen- oder Witwerrente aus dieser Rente erhalten. Er wird nicht auf den Rentenwert gerechnet, sondern auf die Entgeltpunkte; Rentenerhöhungen ändern den Prozentsatz deshalb nicht.</p>
<p>Ob sich der frühe Beginn lohnt, ist eine Frage der Lebenszeit. Wer zwei Jahre früher geht, bekommt 24 zusätzliche Monatszahlungen, aber jede um 7,2 Prozent kleiner. Bei 1.600 € Rente sind das ${h.eur(be24.vorsprung)} Vorsprung und ${h.eur(be24.diff)} weniger pro Monat; den Vorsprung holt die spätere Rente nach rund ${h.num(be24.monate / 12)} Jahren ein. Dazu kommt, dass in den zwei Jahren keine weiteren Entgeltpunkte entstehen. Der ${h.a('abschlag-rechner', 'Abschlagsrechner')} rechnet das mit Ihren Zahlen, auch mit den Punkten, die Sie bis zum späteren Beginn noch sammeln würden.</p>
<p>Wer früher gehen will, kann den Abschlag ab 50 mit Sonderzahlungen ganz oder teilweise ausgleichen (${h.src('sgb6_187a', '§ 187a SGB VI')}). Bei 45 Entgeltpunkten und 7,2 Prozent kostet das 2026 rund ${h.eur(aus.betrag)}; Teilzahlungen sind erlaubt, eine Erstattung gibt es nicht. Rechenweg unter ${h.a('ausgleichszahlung', 'Ausgleichszahlung')}.</p>

<h2>Die Werte für 2026</h2>
${h.table(['Wert', 'Betrag', 'Quelle'], [
  ['Aktueller Rentenwert ab 1. Juli 2026', h.eur(RW, 2), 'DRV, BMAS'],
  ['Rentenwert bis 30. Juni 2026', h.eur(P.rentenwert.bis_2026_06, 2), 'DRV'],
  ['Vorläufiges Durchschnittsentgelt 2026', h.eur(P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig), 'SV-Rechengrößen 2026'],
  ['Beitragsbemessungsgrenze Rente (Monat)', h.eur(P.rechengroessen.bbg_rv_monat), 'DRV'],
  ['Abschlag je Monat vor dem Termin', '0,3 %', '§ 77 SGB VI'],
  ['Zuschlag je Monat nach der Regelaltersgrenze', '0,5 %', '§ 77 SGB VI'],
  ['Besteuerungsanteil bei Rentenbeginn 2026', h.pct(besteuerungsanteil(2026)), '§ 22 EStG'],
  ['Grundfreibetrag 2026', h.eur(P.steuer.grundfreibetrag), '§ 32a EStG'],
  ['Kranken- und Pflegebeitrag der Rentner', `${h.pct(P.kv.allgemein / 2, 1)} + ${h.pct(P.kv.zusatz_durchschnitt_2026 / 2, 2)} + ${h.pct(P.pv.satz, 1)}`, 'SGB V, SGB XI'],
  ['Freibetrag bei der Witwenrente', h.eur(freibetrag(RW), 2), '§ 97 SGB VI'],
], 'Rechtswerte, gelesen am 15. Oktober 2026', ['l', 'r', 'l'])}

<h2>Beispiele aus dem Rechner</h2>
<p>Alle vier Zeilen rechnen mit einem Geburtstag am 15. Juni und 40 Versicherungsjahren. Die frühe Rente ist die für langjährig Versicherte ab 63.</p>
${h.table(['Jahrgang', 'Regelaltersgrenze', 'Regulär ab', 'Ab 63 mit Abschlag', 'Nach 45 Jahren'], beispiele.map((b) => [h.a(`jahrgang-${b.j}`, String(b.j)), fmtAlter(b.regel.vollAlter, 'de'), fmtMonat(b.regel.voll, 'de'), `${fmtMonat(b.frueh.frueh, 'de')}, −${h.pct(b.frueh.abschlag)}`, fmtAlter(b.b45, 'de')]), undefined, ['l', 'l', 'l', 'l', 'l'])}
<p>Was die Rente dann in Euro bedeutet, hängt an den Entgeltpunkten. Ein Jahr mit Durchschnittsverdienst bringt einen Punkt, der ab Juli 2026 ${h.eur(RW, 2)} Monatsrente wert ist. Den Bruttobetrag rechnet der ${h.a('rentenrechner', 'Rentenrechner')} aus Ihrer Renteninformation hoch, den Nettobetrag der ${h.a('rentenrechner-brutto-netto', 'Rentenrechner brutto netto')}.</p>

<h2>Was die Kommission vorschlägt, und was davon gilt</h2>
<p>Die Alterssicherungskommission der Bundesregierung hat am 23. Juni 2026 ihren Bericht mit ${h.num(P.reform.empfehlungen)} Empfehlungen übergeben (${h.src('bmasKommission', 'BMAS')}). Für den Rentenbeginn wichtig sind drei: Die Rente nach 45 Jahren ohne Abschlag soll abgeschafft werden, die Rente für langjährig Versicherte soll erst ab 64 statt 63 möglich sein, und die Regelaltersgrenze soll ab 2031 der Lebenserwartung folgen, nach heutiger Vorausschätzung bis 2041 um etwa ein halbes Jahr (${h.src('bregReform', 'Bundesregierung')}). Der Koalitionsausschuss hat am 2. Juli 2026 erklärt, alle Empfehlungen umsetzen zu wollen.</p>
<p>Geltendes Recht ist davon nichts. Die Deutsche Rentenversicherung weist darauf hin, dass für jede Rente das Recht gilt, das bei ihrem Beginn in Kraft ist, und dass man sich das heutige Recht nicht durch einen frühen Antrag sichern kann (${h.src('drvReform', 'DRV, Stand August 2026')}). Für Ihren Jahrgang zeigt das Rentenfenster, was sich ohne jede Übergangsregel ändern würde: Beim Jahrgang 1964 mit 45 Jahren läge der erste Monat ohne Abschlag dann beim ${fmtMonat(f64r.abschlagsfrei.voll, 'de')} statt beim ${fmtMonat(f64b.abschlagsfrei.voll, 'de')}. Wie groß der Vertrauensschutz ausfällt, entscheidet erst das Gesetz. Den Stand verfolgen wir unter ${h.a('rentenreform', 'Rentenreform')}.</p>

<h2>Fünf Dinge, die sich vor dem Antrag lohnen</h2>
<ol>
<li>Kontenklärung beantragen, wenn die Renteninformation Lücken zeigt: Schulzeiten, Kindererziehung und Wehrdienst werden oft erst so erfasst.</li>
<li>Den Geburtstag prüfen. Wer am Ersten geboren ist, plant einen Monat früher.</li>
<li>Arbeitslosigkeit kurz vor der Rente vermeiden, wenn die 45 Jahre knapp sind: Arbeitslosengeld der letzten zwei Jahre zählt nicht mit.</li>
<li>Den Antrag rechtzeitig stellen. Wer später als drei Kalendermonate nach Erfüllung der Voraussetzungen beantragt, bekommt die Rente erst ab dem Antragsmonat (${h.src('sgb6_99', '§ 99')}). Mehr unter ${h.a('rente-beantragen', 'Rente beantragen')}.</li>
<li>Den Nettobetrag rechnen, nicht nur den Bruttobetrag: Kranken- und Pflegebeiträge sind sofort fällig, die Steuer über die Steuererklärung.</li>
</ol>`,
  },
  en: {
    title: 'Pension Age Germany 2026: Start Date and Reduction by Year',
    description: 'German pension age 2026 for every birth year, to the month: retiring at 63, after 45 years, with a disability, the reduction, net pension and the reform plan.',
    h1: 'German pension age 2026: when your pension starts',
    intro: 'Enter your date of birth and insured years: the calculator shows every German old-age pension with its first month and reduction, under current law and next to the commission proposal.',
    resume: (h) => `In Germany the standard retirement age (Regelaltersgrenze) is 67 for everyone born in 1964 or later (section 35 of Book VI of the Social Code, SGB VI); for people born from 1958 to 1963 it rises in steps from 66 to 66 years and 10 months (section 235). There are three earlier routes. After 35 insured years from 63, with a reduction (Abschlag) of 0.3% for each month before the standard age: for the 1964 cohort that is ${h.num(f64.fruehest.monate)} months and ${h.pct(f64.fruehest.abschlag)}, for life. After 45 years with no reduction, at 65 from the 1964 cohort. With a recognised severe disability with no reduction at 65, from 62 at the earliest with a reduction capped at 10.8%. The pension starts in the month after your birthday, or one month earlier if you were born on the 1st. In 2026 each pension point (Entgeltpunkt) is worth ${h.eur(RW, 2)} a month. On 23 June 2026 the pension commission proposed abolishing the 45-year pension and allowing early retirement only from 64; that is not law, and no draft bill exists.`,
    faqs: (h) => [
      { q: 'I was born in 1964. When can I retire in Germany?', a: `With no reduction at 67, from the month after your 67th birthday. With 45 insured years, with no reduction at 65. With 35 years, from 63 at the earliest, then with a ${h.pct(f64.fruehest.abschlag)} reduction for ${h.num(f64.fruehest.monate)} months. Someone born on 15 June 1964 can therefore start on ${fmtMonat(f64.fruehest.frueh, 'en')}; people born on 1 June one month earlier.` },
      { q: 'Do years worked in another EU country count towards the 35 or 45 years?', a: 'For the qualifying periods, yes: under the EU coordination rules, insurance periods in other EU and EEA countries and Switzerland are added together to decide whether you meet 5, 35 or 45 years. They do not raise the German pension amount, which is still paid only for German contributions; each country pays its own share. Ask the Deutsche Rentenversicherung to record foreign periods before you apply.' },
      { q: 'How much does retiring two years early cost?', a: `24 months times 0.3%, so 7.2%, for the whole time you draw the pension, and also in a later survivor’s pension based on it. Some German sites quote 14.4% for two years; that figure belongs to four years. A pension of €1,600 becomes ${h.eur(be24.gekuerzt)}. The later start only catches up with the two extra years of payments after roughly ${h.num(be24.monate / 12)} years.` },
      { q: 'Can I keep working after drawing an early pension?', a: `Yes. Since 1 January 2023 there is no earnings cap on old-age pensions, even before the standard age. Your pay is taxed and pays contributions, but it adds pension points. After the standard age, up to ${h.eur(P.steuer.aktivrente_jahr)} of employment income a year is tax-free (section 3 no. 21 Income Tax Act). Disability pensions still have earnings limits.` },
      { q: 'How much of a €1,600 pension is left after deductions?', a: `For a pension starting in 2026, single, with children and the average health fund extra rate of ${h.num(P.kv.zusatz_durchschnitt_2026 * 100, 1)}%: ${h.eur(n1600.kv, 2)} health insurance, ${h.eur(n1600.pv, 2)} long-term care insurance and on average ${h.eur(n1600.steuerMonat, 2)} income tax a month, leaving ${h.eur(n1600.netto)}. In this standard case income tax only starts at a gross pension of about ${h.eur(grenze26)}.` },
      { q: 'Has the 45-year pension already been abolished?', a: 'No. The pension commission recommended it on 23 June 2026, and the coalition committee said on 2 July 2026 it wants to implement the recommendations, aiming for a law by the end of 2026. No draft bill has been published, and which birth years would keep the current rules is open. Until a law is published, the rules this calculator applies stay in force.' },
      { q: 'Is my German pension paid if I move back home?', a: 'Within the EU, the EEA and Switzerland, the EU coordination regulation stops a pension being cut because you live in another member state, so it is paid there in full. Outside that area the rules depend on the country and any social security agreement, so ask the Deutsche Rentenversicherung before you move. If you leave with fewer than 5 years of insurance and cannot reach them through EU periods, a refund of your own contributions may be possible after 24 months.' },
    ],
    body: (h) => `
<h2>How the start date is worked out</h2>
<p>Three things fix your first pension month: your year of birth, your birthday and the type of pension. The year sets the standard retirement age, which is 67 for everyone born in 1964 or later (${h.src('sgb6_35', 'section 35 SGB VI')}). People born from 1958 to 1963 fall under the transition table in ${h.src('sgb6_235', 'section 235 SGB VI')}: 66 for 1958, then two months more per year, up to 66 years and 10 months for 1963.</p>
<p>The birthday sets the month. A German pension does not start on your birthday but on the first day of the following month, provided the conditions are met at the start of that month (${h.src('sgb6_99', 'section 99 SGB VI')}). Because German law counts the day of birth when working out age (${h.src('bgb_187', 'section 187(2) of the Civil Code')}), you reach an age on the day before your birthday. If you were born on the 1st of a month, that day falls in the previous month and your pension starts one month earlier. On a €1,600 pension, missing this costs exactly €1,600.</p>
<p>The type of pension decides how far ahead of the standard age you can go and at what price. The calculator above works out each type separately and shows the earliest month, the reduction at that point and the first month without a reduction. For someone born in ${h.a('jahrgang-1964', '1964')} with 40 insured years, the earliest start is ${fmtMonat(f64.fruehest.frueh, 'en')} with a ${h.pct(f64.fruehest.abschlag)} reduction; with 45 years, ${fmtMonat(f64b.abschlagsfrei.voll, 'en')} is the first month with none.</p>

<h2>Why your birth month and pension type matter so much</h2>
<p>Most tables online give one age per birth year and stop there. That is not enough to plan a move, a notice period or a lease. Between being born on the 1st and on the 2nd of a month lies a whole pension month. Between the 35-year and the 45-year pension lie two years and 7.2 percentage points of reduction for the 1964 cohort. And the 1958 to 1963 cohorts have separate limits for each pension type that do not move in parallel: for 1962 the standard age is 66 years and 8 months, the 45-year limit 64 years and 8 months, and the early disability pension 61 years and 8 months (${h.src('sgb6_236a', 'section 236a')}, ${h.src('sgb6_236b', 'section 236b SGB VI')}).</p>
<p>That is why this site calculates every combination of year, month, day and pension type with the statutory tables, and sets a second scenario next to it: the rules as they would look if the commission proposal became law with no transition. For anyone who has worked in Germany as an expat, the same logic applies; only the number of years you can show changes. The timeline above this text shows the 1958 to 1970 cohorts at a glance.</p>

<h2>The four old-age pensions</h2>
<h3>Standard pension (Regelaltersrente)</h3>
<p>It needs only five years of insurance, the general qualifying period (${h.src('sgb6_50', 'section 50 SGB VI')}), and periods from other EU countries count towards those five years. It never comes with a reduction. If you keep working and defer it, each month adds 0.5%; see ${h.a('spaeter-in-rente', 'retiring later')}.</p>
<h3>Pension for long-term insured persons</h3>
<p>After 35 years of pension periods it is possible from 63, for every cohort (${h.src('sgb6_236', 'section 236')} and ${h.src('sgb6_36', 'section 36 SGB VI')}). Without a reduction it is only available at the standard age, so in practice it is the reduced early pension that Germans call ${h.a('rente-mit-63', 'Rente mit 63')}. Almost all periods count towards the 35 years, including school from 17, university, unemployment and sickness.</p>
<h3>Pension for especially long-term insured persons</h3>
<p>After 45 years it is paid with no reduction, at 65 from the 1964 cohort (${h.src('sgb6_38', 'section 38 SGB VI')}). It cannot start earlier; if you want to go at 63 anyway, you take the 35-year pension with the full reduction to the standard age. Fewer periods count towards 45 years: compulsory contributions, child-raising until the child turns 10, caring, and unemployment benefit except in the last two years (${h.src('sgb6_51', 'section 51(3a)')}). Details under ${h.a('wartezeit-45-jahre', 'what counts towards 45 years')}.</p>
<h3>Pension for severely disabled persons</h3>
<p>With a recognised degree of disability of at least 50 when the pension starts and 35 insured years, it is unreduced at 65 from the 1964 cohort and possible from 62 with a 10.8% reduction (${h.src('sgb6_37', 'section 37 SGB VI')}). The cap follows from the 36 months between the two dates. See ${h.a('schwerbehinderte', 'pension with a severe disability')}.</p>
<!--mini:fruehVerlust-->
<h2>Getting the reduction right</h2>
<p>The reduction comes from the access factor (Zugangsfaktor): 1.0 minus 0.003 for every month the pension starts before the unreduced date (${h.src('sgb6_77', 'section 77 SGB VI')}). Two years are 7.2%, three years 10.8%, four years 14.4%. It applies for life and carries over into a widow’s or widower’s pension based on it. It reduces your pension points, not the pension value, so annual increases do not change the percentage.</p>
<p>Whether the early start pays is a question of how long you live. Going two years early brings 24 extra monthly payments, each 7.2% smaller. On €1,600 that is a head start of ${h.eur(be24.vorsprung)} and ${h.eur(be24.diff)} less every month; the later start catches up after about ${h.num(be24.monate / 12)} years. On top of that, the two years add no pension points. The ${h.a('abschlag-rechner', 'reduction calculator')} works this out with your figures.</p>
<p>From age 50 you can buy out the reduction in whole or in part with extra contributions (${h.src('sgb6_187a', 'section 187a SGB VI')}). With 45 pension points and 7.2% that costs about ${h.eur(aus.betrag)} in 2026. Part payments are allowed, refunds are not. Method under ${h.a('ausgleichszahlung', 'buying out reductions')}.</p>

<h2>The 2026 values</h2>
${h.table(['Value', 'Amount', 'Source'], [
  ['Pension value from 1 July 2026', h.eur(RW, 2), 'DRV, BMAS'],
  ['Pension value until 30 June 2026', h.eur(P.rentenwert.bis_2026_06, 2), 'DRV'],
  ['Provisional average pay 2026', h.eur(P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig), '2026 reference values'],
  ['Pension contribution ceiling (month)', h.eur(P.rechengroessen.bbg_rv_monat), 'DRV'],
  ['Reduction per month before the date', '0.3%', 'section 77 SGB VI'],
  ['Increase per month after the standard age', '0.5%', 'section 77 SGB VI'],
  ['Taxable share for pensions starting 2026', h.pct(besteuerungsanteil(2026)), 'section 22 EStG'],
  ['Basic tax allowance 2026', h.eur(P.steuer.grundfreibetrag), 'section 32a EStG'],
  ['Health and care contributions of pensioners', `${h.pct(P.kv.allgemein / 2, 1)} + ${h.pct(P.kv.zusatz_durchschnitt_2026 / 2, 2)} + ${h.pct(P.pv.satz, 1)}`, 'SGB V, SGB XI'],
  ['Allowance in the widow’s pension income test', h.eur(freibetrag(RW), 2), 'section 97 SGB VI'],
], 'Legal values, read on 15 October 2026', ['l', 'r', 'l'])}

<h2>Examples from the calculator</h2>
<p>All four rows assume a birthday on 15 June and 40 insured years. The early pension is the 35-year pension from 63.</p>
${h.table(['Born', 'Standard age', 'Standard start', 'From 63, reduced', 'After 45 years'], beispiele.map((b) => [h.a(`jahrgang-${b.j}`, String(b.j)), fmtAlter(b.regel.vollAlter, 'en'), fmtMonat(b.regel.voll, 'en'), `${fmtMonat(b.frueh.frueh, 'en')}, −${h.pct(b.frueh.abschlag)}`, fmtAlter(b.b45, 'en')]), undefined, ['l', 'l', 'l', 'l', 'l'])}
<p>What that means in euros depends on your pension points. A year at average pay earns one point, worth ${h.eur(RW, 2)} a month from July 2026. The ${h.a('rentenrechner', 'pension calculator')} projects the gross amount from your annual statement (Renteninformation), the ${h.a('rentenrechner-brutto-netto', 'net pension calculator')} the amount that reaches your account.</p>

<h2>What the commission proposes, and what applies</h2>
<p>The federal pension commission (Alterssicherungskommission) handed in its report with ${h.num(P.reform.empfehlungen)} recommendations on 23 June 2026 (${h.src('bmasKommission', 'Labour Ministry')}). Three concern the start date: abolish the unreduced pension after 45 years, allow the 35-year pension only from 64 instead of 63, and link the standard age to life expectancy from 2031, by about half a year up to 2041 on current projections (${h.src('bregReform', 'Federal Government')}). The coalition committee said on 2 July 2026 that it wants to implement them all.</p>
<p>None of it is law. The Deutsche Rentenversicherung points out that each pension follows the rules in force when it starts, and that you cannot lock in today’s rules by applying early (${h.src('drvReform', 'DRV, as of August 2026')}). For your birth year the calculator shows what would change with no transition at all: born in 1964 with 45 years, the first unreduced month would move from ${fmtMonat(f64b.abschlagsfrei.voll, 'en')} to ${fmtMonat(f64r.abschlagsfrei.voll, 'en')}. How much protection older cohorts get will only be settled in the law. We follow it under ${h.a('rentenreform', 'pension reform')}.</p>

<h2>Five things worth doing before you apply</h2>
<ol>
<li>Ask for an account clarification (Kontenklärung) if your statement shows gaps; school years, child-raising and periods abroad are often only recorded that way.</li>
<li>Check your birthday. Born on the 1st, plan one month earlier.</li>
<li>If you are close to 45 years, avoid unemployment just before retirement: benefit in the last two years does not count.</li>
<li>Apply in time. If you apply more than three calendar months after you qualify, the pension only starts in the month you apply (${h.src('sgb6_99', 'section 99')}). See ${h.a('rente-beantragen', 'applying for your pension')}.</li>
<li>Work out the net figure, not just the gross: health and care contributions come off at once, income tax through your tax return.</li>
</ol>`,
  },
};
