import { defineGuide } from '../../lib/guide-types';
import { beginn, regelalter, fmtMonat, fmtAlter, zuschlag } from '../../lib/engine/alter';
import { netto, epAusBrutto, besteuerungsanteil } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Später in Rente: Zuschlag 0,5 % je Monat nach der Regelaltersgrenze (§ 77 SGB VI), Aufholzeit gegenüber dem pünktlichen Beginn,
 * Entgeltpunkte aus Weiterarbeit (§ 66 Abs. 3a) und Aktivrente (§ 3 EStG). Beispiel: 1.500 € Rente, Geburtstag 15. Juni.
 */
const RW = P.rentenwert.ab_2026_07;
const ZM = P.zugangsfaktor.zuschlag_monat;
const AKTIV = P.steuer.aktivrente_jahr;
const auf = (m: number) => {
  const z = zuschlag(m);
  const plus = 1500 * z;
  const ausgelassen = 1500 * m;
  return { m, z, plus, ausgelassen, jahre: ausgelassen / plus / 12 };
};
const a12 = auf(12);
const a24 = auf(24);
const a36 = auf(36);
/** Weiterarbeit mit 40.000 € Jahresbrutto: ein Jahr Entgeltpunkte (Durchschnittsentgelt 2026). */
const ep40 = epAusBrutto(40000);
const plusEp = ep40 * RW;
/** Regelaltersrente und Beginn nach 12 Monaten Aufschub je Jahrgang (Geburtstag 15. Juni). */
const jahrgaenge = [1959, 1960, 1961, 1962, 1963, 1964, 1970].map((j) => {
  const g = { jahr: j, monat: 6, tag: 15 };
  const b = beginn(g, regelalter(j));
  return { j, alter: regelalter(j), b, spaet: b + 12 };
});
const j64 = jahrgaenge.find((x) => x.j === 1964)!;
/** Aktivrente: 1.500 € Rente ab 2027 und 24.000 € Lohn, Steuer mit und ohne Steuerfreiheit des Lohns (vereinfacht, ohne Werbungskosten). */
const basis = { brutto: 1500, zusatz: P.kv.zusatz_durchschnitt_2026, kinderlos: false, startjahr: 2027, verheiratet: false, partner: 0, kirche: 0 };
const ohneAktiv = netto({ ...basis, weitere: AKTIV });
const mitAktiv = netto({ ...basis, weitere: 0 });
const ersparnis = ohneAktiv.steuerJahr - mitAktiv.steuerJahr;

export default defineGuide({
  id: 'spaeter-in-rente',
  group: 'beginn',
  order: 80,
  mini: 'zuschlag',
  miniHref: 'rentenbeginn-rechner',
  related: ['hinzuverdienst', 'renteneintrittsalter-tabelle', 'teilrente', 'rente-beantragen', 'besteuerung-rente', 'rentenreform'],
  sources: ['sgb6_77', 'sgb6_35', 'sgb6_235', 'sgb6_66', 'estg_3', 'estg_22', 'bmasKommission'],
  de: {
    slug: 'spaeter-in-rente-zuschlag',
    nav: 'Später in Rente',
    card: 'Jeder Monat nach der Regelaltersgrenze bringt 0,5 % mehr Rente, dazu die Aktivrente.',
    title: `Länger arbeiten, Rente mit Zuschlag 2026: ${DE.pct(ZM, 1)} je Monat`,
    description: `Länger arbeiten mit Rentenzuschlag 2026: ${DE.pct(ZM, 1)} mehr Rente je Monat nach der Regelaltersgrenze, Aktivrente bis ${DE.eur(AKTIV)} steuerfrei. Wann sich das rechnet.`,
    h1: 'Länger arbeiten: Zuschlag auf die Rente und Aktivrente',
    intro: 'Wer die Altersrente nach der Regelaltersgrenze noch nicht bezieht, bekommt sie später dauerhaft höher. Ob das aufgeht, hängt vor allem an der Laufzeit.',
    resume: `Wer die Regelaltersrente erst nach Erreichen der Regelaltersgrenze beginnen lässt, erhält für jeden Monat des Aufschubs ${DE.pct(ZM, 1)} Zuschlag, lebenslang (§ 77 SGB VI). Zwölf Monate ergeben ${DE.pct(a12.z, 1)}, 24 Monate ${DE.pct(a24.z, 1)}, 36 Monate ${DE.pct(a36.z, 1)}. Bei 1.500 € Rente bringt ein Jahr Aufschub ${DE.eur(a12.plus)} mehr im Monat; dafür fallen zwölf Zahlungen weg, zusammen ${DE.eur(a12.ausgelassen)}. Aufgeholt ist das erst nach rund ${DE.num(a12.jahre, 1)} Jahren Rentenbezug. Wer in der Zeit arbeitet und Beiträge zahlt, erwirbt zusätzlich Entgeltpunkte: Ein Jahr mit 40.000 € Bruttolohn bringt ${DE.num(ep40, 2)} Punkte, also ${DE.eur(plusEp, 2)} Monatsrente mehr. Seit der Aktivrente ist Arbeitslohn nach der Regelaltersgrenze bis ${DE.eur(AKTIV)} im Jahr steuerfrei, für Beschäftigte (§ 3 EStG). Die Regelaltersgrenze liegt ab Jahrgang 1964 bei 67 Jahren: Bei einem Geburtstag am 15. Juni 1964 beginnt die Regelaltersrente am ${fmtMonat(j64.b, 'de')}, nach einem Jahr Aufschub am ${fmtMonat(j64.spaet, 'de')}.`,
    faqs: [
      { q: 'Wie viel mehr Rente bekomme ich, wenn ich ein Jahr länger arbeite?', a: `Zwei Dinge kommen zusammen. Lassen Sie die Rente ein Jahr nach der Regelaltersgrenze beginnen, steigt sie um ${DE.pct(a12.z, 1)}, bei 1.500 € also um ${DE.eur(a12.plus)} im Monat. Zahlen Sie in dem Jahr Beiträge aus 40.000 € Lohn, kommen nach dem Motor rund ${DE.eur(plusEp, 2)} aus neuen Entgeltpunkten dazu. Beides gilt lebenslang.` },
      { q: 'Ab wann lohnt sich der Rentenaufschub?', a: `Rein rechnerisch, wenn die Rente lange genug läuft. Bei einem Jahr Aufschub verzichten Sie auf zwölf Monatsrenten und bekommen danach ${DE.pct(a12.z, 1)} mehr. Das gleicht sich nach etwa ${DE.num(a12.jahre, 1)} Jahren Rentenbezug aus, also mit knapp 85, wenn die Rente mit 68 beginnt. Bei zwei oder drei Jahren Aufschub bleibt diese Dauer gleich, weil Zuschlag und Verzicht im gleichen Verhältnis wachsen.` },
      { q: 'Muss ich der Rentenversicherung den Aufschub mitteilen?', a: 'Nein. Die Rente wird nur auf Antrag gezahlt. Wer nach der Regelaltersgrenze keinen Antrag stellt, schiebt sie automatisch auf, und jeder volle Monat ohne Rentenbezug erhöht später den Zugangsfaktor. Wichtig ist nur, den Antrag dann rechtzeitig für den gewünschten Startmonat zu stellen, sonst beginnt die Rente erst mit dem Antragsmonat.' },
      { q: 'Was bringt die Aktivrente, wenn ich nach 67 weiterarbeite?', a: `Arbeitslohn aus einer Beschäftigung nach der Regelaltersgrenze ist bis ${DE.eur(AKTIV)} im Jahr einkommensteuerfrei, ab dem Monat nach Erreichen der Grenze. Für jeden Monat, in dem die Voraussetzungen nicht vorliegen, sinkt der Betrag um ein Zwölftel. Selbstständige Einkünfte sind nicht erfasst. Bei 1.500 € Rente ab 2027 und ${DE.eur(AKTIV)} Lohn spart das nach dem Motor rund ${DE.eur(ersparnis)} Steuer im Jahr.` },
      { q: 'Ist es besser, die Rente zu beziehen und trotzdem weiterzuarbeiten?', a: `Das sind zwei verschiedene Wege. Wer ab der Regelaltersgrenze Rente bezieht und arbeitet, hat sofort beide Einkommen; Hinzuverdienstgrenzen gibt es nicht. Neue Beiträge erhöhen die Rente jeweils zum 1. Juli des Folgejahres. Wer aufschiebt, verzichtet auf die Zahlungen und bekommt dafür ${DE.pct(ZM, 1)} je Monat.` },
      { q: 'Wird der Zuschlag für späteren Rentenbeginn mit der Reform geändert?', a: 'Die Alterssicherungskommission hat 2026 empfohlen, Abschläge und Zuschläge regelmäßig zu überprüfen. Eine neue Höhe hat sie nicht festgelegt, und ein Gesetzentwurf ist nicht veröffentlicht. Bis zu einer Änderung gilt der Zuschlag nach § 77 SGB VI unverändert, und für jede Rente gilt das Recht bei ihrem Beginn.' },
    ],
    body: (h) => `
<h2>Wie der Zuschlag entsteht</h2>
<p>Der Zugangsfaktor ist die Zahl, mit der die Entgeltpunkte beim Rentenbeginn multipliziert werden. Bei einem Beginn genau zur Regelaltersgrenze ist er 1,0. Jeder Kalendermonat nach der Regelaltersgrenze, in dem trotz Anspruch keine Rente bezogen wird, erhöht ihn um ${h.num(h.P.zugangsfaktor.zuschlag_monat, 3)} (${h.src('sgb6_77', '§ 77 SGB VI')}). Der Zuschlag gilt dann für die gesamte Laufzeit dieser Rente. Er ist das Gegenstück zum Abschlag von ${h.pct(h.P.zugangsfaktor.abschlag_monat, 1)} je Monat beim frühen Beginn, aber höher pro Monat: Wer ein Jahr später geht, gewinnt mehr Prozent, als er bei einem Jahr früher verlieren würde.</p>
<p>Eine Erklärung gegenüber der Rentenversicherung braucht der Aufschub nicht. Die Rente wird nur auf Antrag gezahlt, also schiebt auf, wer keinen Antrag stellt. Wichtig ist der spätere Antrag: Er muss innerhalb der Frist für den gewünschten Startmonat eingehen, sonst beginnt die Rente erst im Monat des Antrags. Wie die Frist läuft, steht unter ${h.a('rente-beantragen', 'Rente beantragen')}.</p>
<h2>Rente mit 67 und später: die Termine je Jahrgang</h2>
<p>Die Regelaltersgrenze ist schrittweise gestiegen und erreicht mit dem Jahrgang 1964 die 67 (${h.src('sgb6_35', '§ 35')}, ${h.src('sgb6_235', '§ 235 SGB VI')}). Die Tabelle zeigt für einen Geburtstag am 15. Juni, wann die Regelaltersrente beginnt und wann sie nach einem Jahr Aufschub mit ${h.pct(a12.z, 1)} Zuschlag beginnen würde:</p>
${h.table(['Jahrgang', 'Regelaltersgrenze', 'Regelaltersrente ab', 'Nach 12 Monaten Aufschub'], jahrgaenge.map((x) => [x.j >= 1960 && x.j <= 1966 ? h.a(`jahrgang-${x.j}`, String(x.j)) : String(x.j), fmtAlter(x.alter, 'de'), fmtMonat(x.b, 'de'), fmtMonat(x.spaet, 'de')]), 'Geburtstag 15. Juni', ['l', 'l', 'l', 'l'])}
<p>Für alle Jahrgänge ab 1964 bleibt es bei 67, solange das Gesetz nicht geändert wird; die Zeile 1970 steht stellvertretend für alle Späteren. Wer 1964 geboren ist, kann die Regelaltersrente ab dem ${fmtMonat(j64.b, 'de')} beziehen; mit einem Jahr Aufschub beginnt sie am ${fmtMonat(j64.spaet, 'de')}. Die frühen Wege vor der Regelaltersgrenze erklärt ${h.a('renteneintrittsalter-tabelle', 'die Tabelle zum Renteneintrittsalter')}.</p>
<h2>Was ein, zwei oder drei Jahre Aufschub bringen</h2>
${h.table(['Aufschub', 'Zuschlag', 'Aus 1.500 € werden', 'Ausgelassene Zahlungen', 'Aufgeholt nach'], [a12, a24, a36].map((a) => [`${a.m} Monate`, h.pct(a.z, 1), h.eur(1500 + a.plus), h.eur(a.ausgelassen), `${h.num(a.jahre, 1)} Jahren`]), 'Rente zur Regelaltersgrenze 1.500 €, ohne Rentenanpassungen und ohne neue Entgeltpunkte', ['l', 'r', 'r', 'r', 'r'])}
<p>Die letzte Spalte ist die eigentliche Antwort auf die Frage „lohnt sich das?“. Sie bleibt gleich, egal wie lange aufgeschoben wird, weil der Verzicht und der Zuschlag im selben Verhältnis wachsen. Rund ${h.num(a12.jahre, 1)} Jahre muss die erhöhte Rente laufen, bis der Aufschub aufgeholt ist. Wer mit 68 beginnt, ist dann Mitte 80. Die Rechnung lässt Rentenanpassungen weg, die beide Varianten gleichermaßen erhöhen, und sie lässt die Entgeltpunkte aus Arbeit weg, die den Aufschub attraktiver machen.</p>
<h2>Weiterarbeit bringt neue Entgeltpunkte</h2>
<p>Wer nach der Regelaltersgrenze arbeitet und dabei Rentenbeiträge zahlt, sammelt weiter Entgeltpunkte. Ein Jahresbrutto von 40.000 € ergibt mit dem vorläufigen Durchschnittsentgelt 2026 von ${h.eur(h.P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig)} ${h.num(ep40, 2)} Punkte, beim aktuellen Rentenwert von ${h.eur(h.P.rentenwert.ab_2026_07, 2)} also ${h.eur(plusEp, 2)} Monatsrente. Das gilt auch, wenn die Rente bereits läuft: Beiträge nach dem Rentenbeginn werden jeweils zum 1. Juli des Folgejahres als Zuschlag an Entgeltpunkten in die laufende Rente eingerechnet (${h.src('sgb6_66', '§ 66 SGB VI')}). Ein Jahr Arbeit ändert die Monatsrente damit weniger als ein Jahr Aufschub, kostet aber keine einzige Rentenzahlung, wenn die Rente parallel bezogen wird.</p>
<p>Seit 2023 gibt es für Altersrenten keine Hinzuverdienstgrenze mehr. Rente und Lohn lassen sich also uneingeschränkt kombinieren, ab der Regelaltersgrenze ebenso wie vorher. Wie das bei vorgezogenen Renten aussieht, steht unter ${h.a('hinzuverdienst', 'Hinzuverdienst zur Rente')}.</p>
<!--mini:aktivrente-->
<h2>Aktivrente: Lohn bis ${h.eur(h.P.steuer.aktivrente_jahr)} steuerfrei</h2>
<p>Mit der Aktivrente ist Arbeitslohn aus einer Beschäftigung nach Erreichen der Regelaltersgrenze bis ${h.eur(h.P.steuer.aktivrente_jahr)} im Jahr von der Einkommensteuer befreit (${h.src('estg_3', '§ 3 EStG')}). Die Steuerfreiheit beginnt mit dem Monat nach Erreichen der Grenze; für jeden Monat, in dem die Voraussetzungen nicht vorliegen, sinkt der Höchstbetrag um ein Zwölftel. Sie gilt nur für Arbeitnehmer, nicht für Gewinne aus selbstständiger Arbeit.</p>
<p>Ein vereinfachtes Beispiel aus dem Motor, ohne Werbungskosten und Sozialabgaben auf den Lohn: 1.500 € Rente ab 2027 und ${h.eur(h.P.steuer.aktivrente_jahr)} Lohn im Jahr. Ohne Aktivrente fielen rund ${h.eur(ohneAktiv.steuerJahr)} Einkommensteuer und Soli an, mit Aktivrente ${h.eur(mitAktiv.steuerJahr)}. Der Unterschied von rund ${h.eur(ersparnis)} im Jahr bleibt netto mehr übrig.</p>
<h2>Später beginnen, höherer Steueranteil</h2>
<p>Ein Nebeneffekt des Aufschubs betrifft die Steuer. Der steuerpflichtige Teil der Rente richtet sich nach dem Jahr des Rentenbeginns (${h.src('estg_22', '§ 22 EStG')}): ${h.pct(besteuerungsanteil(2027), 1)} bei Beginn 2027, ${h.pct(besteuerungsanteil(2028), 1)} bei 2028, ${h.pct(besteuerungsanteil(2029), 1)} bei 2029. Jedes Jahr Aufschub erhöht ihn um einen halben Prozentpunkt, für die gesamte Laufzeit. Gegen den Zuschlag ist das wenig, aber es gehört in eine ehrliche Rechnung. Mehr dazu unter ${h.a('besteuerung-rente', 'Besteuerung der Rente')}.</p>
<h2>Teilweise aufschieben</h2>
<p>Zwischen „alles sofort“ und „alles später“ liegt die Teilrente: Ab der Regelaltersgrenze lässt sich auch nur ein Teil der Rente beziehen, mindestens 10 Prozent der Vollrente. Wie sich Teilrente, Lohn und spätere Vollrente zueinander verhalten, zeigt ${h.a('teilrente', 'Teilrente')}. Für eine verbindliche Berechnung Ihres Falls sind die Auskunfts- und Beratungsstellen der Deutschen Rentenversicherung zuständig; diese Seite ist unabhängig und berät nicht im Einzelfall.</p>
<h2>Was die Kommission vorschlägt</h2>
<p>Die Alterssicherungskommission empfiehlt in ihrem Bericht vom 23. Juni 2026, die Regelaltersgrenze ab 2031 an die Lebenserwartung zu koppeln, im Verhältnis 2:1, sodass sie bis 2041 von 67 auf etwa 67,5 Jahre steigen würde. Außerdem sollen Abschläge und Zuschläge regelmäßig überprüft werden (${h.src('bmasKommission', 'Bundesministerium für Arbeit und Soziales')}). Das sind Vorschläge, kein geltendes Recht; einen veröffentlichten Gesetzentwurf gibt es nicht. Den Stand fasst ${h.a('rentenreform', 'Rentenreform')} zusammen.</p>`,
  },
  en: {
    slug: 'retiring-later-increase',
    nav: 'Retiring later',
    card: 'Each month after the standard age adds 0.5% to your German pension, plus the tax-free Aktivrente.',
    title: `Working longer, pension increase 2026: ${EN.pct(ZM, 1)} per month`,
    description: `Working longer in Germany 2026: ${EN.pct(ZM, 1)} more pension for each month after the standard age, plus up to ${EN.eur(AKTIV)} tax-free pay (Aktivrente). When deferring pays.`,
    h1: 'Working past the standard age: pension increase and Aktivrente',
    intro: 'If you do not draw your German pension once you reach the standard age, it is paid at a permanently higher rate later. Whether that pays depends mainly on how long it runs.',
    resume: `If you let your German standard pension (Regelaltersrente) start only after you reach the standard retirement age (Regelaltersgrenze), you receive an increase (Zuschlag) of ${EN.pct(ZM, 1)} for each month of deferral, for life (section 77 SGB VI). Twelve months give ${EN.pct(a12.z, 1)}, 24 months ${EN.pct(a24.z, 1)}, 36 months ${EN.pct(a36.z, 1)}. On a €1,500 pension, one year of deferral adds ${EN.eur(a12.plus)} a month, but twelve payments are skipped, ${EN.eur(a12.ausgelassen)} in total. That is only recovered after about ${EN.num(a12.jahre, 1)} years of drawing the pension. If you work and pay contributions in the meantime, you also earn pension points: a year on €40,000 gross brings ${EN.num(ep40, 2)} points, or ${EN.eur(plusEp, 2)} more a month. Under the Aktivrente, wages from employment after the standard age are free of income tax up to ${EN.eur(AKTIV)} a year for employees (section 3 EStG). From the 1964 cohort the standard age is 67: born on 15 June 1964, you can draw the standard pension from ${fmtMonat(j64.b, 'en')}, or from ${fmtMonat(j64.spaet, 'en')} after one year of deferral.`,
    faqs: [
      { q: 'How much more German pension do I get for working one extra year?', a: `Two things add up. If you start the pension one year after the standard age, it rises by ${EN.pct(a12.z, 1)}, so €1,500 becomes ${EN.eur(1500 + a12.plus)}. If you pay contributions on €40,000 of pay in that year, the engine adds about ${EN.eur(plusEp, 2)} a month from new pension points. Both apply for life.` },
      { q: 'How long does it take for deferring my pension to pay off?', a: `Purely in numbers, it pays if the pension runs long enough. One year of deferral means giving up twelve payments and then receiving ${EN.pct(a12.z, 1)} more. That evens out after about ${EN.num(a12.jahre, 1)} years of drawing the pension, so at almost 85 if you start at 68. Two or three years of deferral leave this period unchanged, because the increase and the payments forgone grow in step.` },
      { q: 'Do I have to tell the German pension insurance that I am deferring?', a: 'No. The pension is paid only on application. If you do not apply after reaching the standard age, you defer automatically, and each full month without drawing the pension raises your access factor (Zugangsfaktor) later on. What matters is applying in time for the month you then want to start, otherwise the pension begins only in the month of application.' },
      { q: 'How does the tax-free Aktivrente work for people working past 67?', a: `Wages from employment after the standard age are free of income tax up to ${EN.eur(AKTIV)} a year, from the month after you reach it. For each month in which the conditions are not met, the amount falls by one twelfth. Self-employed income is not covered. With a €1,500 pension from 2027 and ${EN.eur(AKTIV)} of pay, the engine shows a saving of about ${EN.eur(ersparnis)} in tax a year.` },
      { q: 'Should I draw the pension and keep working instead of deferring?', a: `These are two different routes. If you draw the pension from the standard age and keep working, you have both incomes at once; there is no earnings cap. New contributions raise the pension each 1 July of the following year. If you defer, you forgo the payments and receive ${EN.pct(ZM, 1)} per month instead.` },
      { q: 'Can I defer my German pension if I have moved to another EU country?', a: 'The increase depends on when your German pension starts, not on where you live, and living in another EU or EEA country or Switzerland does not reduce your German pension. Each country pays its own share under the EU rules, and each has its own retirement ages. Whether deferring the other country’s pension also earns an increase is a question for that country’s institution.' },
    ],
    body: (h) => `
<h2>How the increase arises</h2>
<p>The access factor (Zugangsfaktor) is the number your pension points are multiplied by when your pension starts. Starting exactly at the standard age, it is 1.0. Each calendar month after the standard age in which you are entitled but draw no pension raises it by ${h.num(h.P.zugangsfaktor.zuschlag_monat, 3)} (${h.src('sgb6_77', 'section 77 SGB VI')}). The increase then applies for as long as that pension runs. It mirrors the ${h.pct(h.P.zugangsfaktor.abschlag_monat, 1)} monthly reduction for an early start, but is larger per month: a year later gains more percentage points than a year earlier would cost.</p>
<p>Deferral needs no notice to the pension insurance. The pension is paid only on application, so not applying is deferring. What matters is the later application: it must arrive within the deadline for the month you want, or the pension starts only in the month of application. The deadline is explained on ${h.a('rente-beantragen', 'applying for your pension')}.</p>
<h2>Retiring at 67 and later: dates by birth year</h2>
<p>The standard age has risen step by step and reaches 67 with the 1964 cohort (${h.src('sgb6_35', 'section 35')}, ${h.src('sgb6_235', 'section 235 SGB VI')}). For a birthday on 15 June, the table shows when the standard pension starts and when it would start after one year of deferral, with a ${h.pct(a12.z, 1)} increase:</p>
${h.table(['Born', 'Standard age', 'Standard pension from', 'After 12 months’ deferral'], jahrgaenge.map((x) => [x.j >= 1960 && x.j <= 1966 ? h.a(`jahrgang-${x.j}`, String(x.j)) : String(x.j), fmtAlter(x.alter, 'en'), fmtMonat(x.b, 'en'), fmtMonat(x.spaet, 'en')]), 'Birthday 15 June', ['l', 'l', 'l', 'l'])}
<p>For every cohort from 1964 it stays at 67 unless the law changes; the 1970 row stands for all later years. Born in 1964, you can draw the standard pension from ${fmtMonat(j64.b, 'en')}; deferred by a year it starts on ${fmtMonat(j64.spaet, 'en')}. The early routes before the standard age are in the ${h.a('renteneintrittsalter-tabelle', 'retirement age table')}.</p>
<h2>What one, two or three years of deferral bring</h2>
${h.table(['Deferral', 'Increase', '€1,500 becomes', 'Payments skipped', 'Recovered after'], [a12, a24, a36].map((a) => [`${a.m} months`, h.pct(a.z, 1), h.eur(1500 + a.plus), h.eur(a.ausgelassen), `${h.num(a.jahre, 1)} years`]), 'Pension at standard age €1,500, without pension increases or new pension points', ['l', 'r', 'r', 'r', 'r'])}
<p>The last column is the real answer to “is it worth it?”. It does not move however long you defer, because the payments forgone and the increase grow in the same proportion. The higher pension has to run for about ${h.num(a12.jahre, 1)} years before deferral is recovered; start at 68 and you are then in your mid-eighties. The sum leaves out annual pension adjustments, which raise both options alike, and the pension points from work, which make deferral more attractive.</p>
<h2>Working on brings new pension points</h2>
<p>If you work past the standard age and pay pension contributions, you keep collecting pension points (Entgeltpunkte). Gross pay of €40,000 a year gives ${h.num(ep40, 2)} points against the provisional 2026 average earnings of ${h.eur(h.P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig)}, which at the current pension value of ${h.eur(h.P.rentenwert.ab_2026_07, 2)} is ${h.eur(plusEp, 2)} a month. This also works while the pension is running: contributions paid after the pension starts are added to it each 1 July of the following year (${h.src('sgb6_66', 'section 66 SGB VI')}). A year of work changes the monthly pension less than a year of deferral, but costs no payment at all if you draw the pension alongside.</p>
<p>Since 2023 there has been no earnings limit for old-age pensions. Pension and pay can be combined without restriction, from the standard age and before it. How that works for early pensions is on ${h.a('hinzuverdienst', 'working while drawing a pension')}.</p>
<!--mini:aktivrente-->
<h2>Aktivrente: pay up to ${h.eur(h.P.steuer.aktivrente_jahr)} tax-free</h2>
<p>Under the Aktivrente, wages from employment after reaching the standard age are exempt from income tax up to ${h.eur(h.P.steuer.aktivrente_jahr)} a year (${h.src('estg_3', 'section 3 EStG')}). The exemption starts in the month after you reach the age; for each month in which the conditions are not met, the ceiling falls by one twelfth. It covers employees only, not profits from self-employment.</p>
<p>A simplified example from the engine, without work expenses or social contributions on the pay: a €1,500 pension from 2027 and ${h.eur(h.P.steuer.aktivrente_jahr)} of pay a year. Without the Aktivrente, income tax and solidarity surcharge would come to about ${h.eur(ohneAktiv.steuerJahr)}; with it, ${h.eur(mitAktiv.steuerJahr)}. The difference of about ${h.eur(ersparnis)} a year stays in your pocket.</p>
<h2>A later start means a higher taxable share</h2>
<p>Deferral has a side effect on tax. The taxable share of a German pension depends on the year it starts (${h.src('estg_22', 'section 22 EStG')}): ${h.pct(besteuerungsanteil(2027), 1)} for a 2027 start, ${h.pct(besteuerungsanteil(2028), 1)} for 2028, ${h.pct(besteuerungsanteil(2029), 1)} for 2029. Each year of deferral adds half a percentage point, for the whole time the pension runs. Set against the increase it is small, but an honest sum includes it. More on ${h.a('besteuerung-rente', 'taxation of German pensions')}.</p>
<h2>Deferring part of the pension</h2>
<p>Between “all now” and “all later” sits the partial pension (Teilrente): from the standard age you can draw just part of the pension, at least 10% of the full amount. How partial pension, pay and the later full pension interact is shown on ${h.a('teilrente', 'partial pension')}. For a binding calculation of your own case, the information and advice centres of the Deutsche Rentenversicherung are the right contact; this site is independent and gives no individual advice.</p>
<h2>What the commission proposes</h2>
<p>In its report of 23 June 2026 the pension commission (Alterssicherungskommission) recommends linking the standard age to life expectancy from 2031, in a 2:1 ratio, so that it would rise from 67 to about 67.5 by 2041. It also wants reductions and increases reviewed regularly (${h.src('bmasKommission', 'Federal Ministry of Labour and Social Affairs')}). These are proposals, not law in force, and no draft bill has been published. The current state is on ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
