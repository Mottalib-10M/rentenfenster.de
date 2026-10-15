import { defineGuide } from '../../lib/guide-types';
import { optionen, beginn, fmtMonat, abschlagBei, type Art } from '../../lib/engine/alter';
import { ausgleich } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Arbeitslos vor der Rente: wer heute 58 ist (Jahrgänge 1967 und 1968, Geburtstag 15. Juni), welche Rentenarten wann offenstehen,
 * und die Lücke zwischen Arbeitslosengeld und Rente. Die Dauer des Arbeitslosengeldes ist eine reine Annahme (12 oder 24 Monate).
 */
const RW = P.rentenwert.ab_2026_07;
const AB = P.zugangsfaktor.abschlag_monat;
const g68 = { jahr: 1968, monat: 6, tag: 15 };
const g67 = { jahr: 1967, monat: 6, tag: 15 };
const alle = { wz35: true, wz45: true, schwb: true };
const o68 = optionen(g68, alle);
const o67 = optionen(g67, alle);
const art = (o: ReturnType<typeof optionen>, a: Art) => o.find((x) => x.art === a)!;
const lj68 = art(o68, 'langjaehrig');
const bl68 = art(o68, 'besonders');
const sb68 = art(o68, 'schwb');
const rg68 = art(o68, 'regel');

/** Jobverlust mit 58 (Jahrgang 1968): Arbeitslosengeld ab dem Monat nach dem 58. Geburtstag, Dauer als Annahme. */
const start58 = beginn(g68, { j: 58, m: 0 });
const nur35 = optionen(g68, { wz35: true, wz45: false, schwb: false });
const fall = (monate: number) => {
  const ende = start58 + monate;
  return { monate, ende, luecke: Math.max(0, lj68.frueh - ende) };
};
const f12 = fall(12);
const f24 = fall(24);

/** Jobverlust mit 61 (Jahrgang 1965, wie im Mini-Rechner): Anschluss an 24 Monate Arbeitslosengeld. */
const g65 = { jahr: 1965, monat: 6, tag: 15 };
const o65 = optionen(g65, { wz35: true, wz45: false, schwb: false });
const start61 = beginn(g65, { j: 61, m: 0 });
const ende61 = start61 + 24;
const lj65 = art(o65, 'langjaehrig');
const anschluss65 = abschlagBei(o65, Math.max(ende61, lj65.frueh))!;
const bl65 = art(optionen(g65, { wz35: true, wz45: true, schwb: false }), 'besonders');

/** Kosten des Abschlags bei 1.500 € und Rückkauf nach § 187a. */
const minus = 1500 * lj68.abschlag;
const aus = ausgleich(1500 / RW, lj68.abschlag, RW);
/** Monat ohne „1.“: „Juni 2027“ / „June 2027“. */
const mon = (i: number, l: 'de' | 'en') => fmtMonat(i, l).replace(/^1\.? /, '');
const zeitAb = (o: ReturnType<typeof optionen>, i: number) => abschlagBei(o, i)!;
const mit64 = zeitAb(nur35, beginn(g68, { j: 64, m: 0 }));

const zeilen = (o: ReturnType<typeof optionen>, l: 'de' | 'en') => {
  const name: Record<Art, [string, string]> = {
    regel: ['Regelaltersrente', 'Standard pension'],
    langjaehrig: ['Nach 35 Jahren', 'After 35 years'],
    besonders: ['Nach 45 Jahren', 'After 45 years'],
    schwb: ['Schwerbehinderung, 35 Jahre', 'Severe disability, 35 years'],
  };
  return o.map((x) => [name[x.art][l === 'de' ? 0 : 1], fmtMonat(x.frueh, l), fmtMonat(x.voll, l), (l === 'de' ? DE : EN).pct(x.abschlag, 1)]);
};

export default defineGuide({
  id: 'arbeitslos-vor-der-rente',
  group: 'beginn',
  order: 60,
  mini: 'arbeitslos',
  miniHref: 'rentenbeginn-rechner',
  related: ['wartezeit-45-jahre', 'rente-nach-45-jahren', 'langjaehrig-versicherte', 'abschlag-rechner', 'ausgleichszahlung', 'schwerbehinderte', 'rente-beantragen'],
  sources: ['sgb6_51', 'sgb6_36', 'sgb6_38', 'sgb6_77', 'sgb6_99', 'sgb6_187a', 'drvReform'],
  de: {
    slug: 'arbeitslos-vor-der-rente',
    nav: 'Arbeitslos vor der Rente',
    card: 'Mit 58 oder 61 den Job verloren: wann die Rente anschließt und was die 45 Jahre kosten.',
    title: 'Arbeitslos vor der Rente 2026: Lücke, Abschlag, 45 Jahre',
    description: 'Arbeitslos vor der Rente 2026: Arbeitslosengeld der letzten zwei Jahre zählt nicht auf die 45 Jahre. Wann die Rente mit 58 oder 61 anschließt und was es kostet.',
    h1: 'Arbeitslos vor der Rente: wann es mit 58 oder 61 weitergeht',
    intro: 'Wer kurz vor dem Ruhestand arbeitslos wird, muss zwei Termine zusammenbringen: das Ende des Arbeitslosengeldes und den frühesten Rentenbeginn.',
    resume: `Wer mit 58 arbeitslos wird, kann frühestens mit 63 in Rente gehen, und zwar mit der Altersrente für langjährig Versicherte nach 35 Jahren. Für den Jahrgang 1968 heißt das: Beginn ab dem ${fmtMonat(lj68.frueh, 'de')} mit ${DE.pct(lj68.abschlag, 1)} Abschlag, also ${DE.pct(AB, 1)} für jeden der ${lj68.monate} Monate vor der Regelaltersgrenze (§ 77 SGB VI). Die abschlagsfreie Rente nach 45 Jahren beginnt für diesen Jahrgang ab dem ${fmtMonat(bl68.voll, 'de')}, mit 65. Gerade hier stört die Arbeitslosigkeit: Arbeitslosengeld zählt zwar auf die 45 Jahre, aber nicht in den letzten zwei Jahren vor dem Rentenbeginn, außer der Arbeitgeber ist insolvent oder hat den Betrieb ganz aufgegeben (§ 51 Abs. 3a SGB VI). Bürgergeld zählt dafür nie. Auf die 35 Jahre zählt die Arbeitslosigkeit dagegen mit. Eine eigene Altersrente wegen Arbeitslosigkeit gibt es nur noch für vor 1952 Geborene. Bei 1.500 € Rente kostet der Beginn mit 63 für den Jahrgang 1968 jeden Monat ${DE.eur(minus)}.`,
    faqs: [
      { q: 'Ich bin 58 Jahre, wann kann ich in Rente gehen?', a: `Wer 2026 58 ist, also 1967 oder 1968 geboren, geht regulär mit 67. Mit 35 Versicherungsjahren ist der Beginn ab 63 möglich, mit ${DE.pct(lj68.abschlag, 1)} Abschlag. Mit 45 Jahren geht es ab 65 ohne Abschlag, mit anerkannter Schwerbehinderung ab 62 mit ${DE.pct(sb68.abschlag, 1)} Abschlag. Einen Weg vor 62 gibt es bei der Altersrente nicht; nur eine Erwerbsminderungsrente setzt früher an.` },
      { q: 'Zählt Arbeitslosengeld auf die 45 Beitragsjahre?', a: 'Ja, mit einer wichtigen Ausnahme. Zeiten mit Arbeitslosengeld zählen grundsätzlich mit, nicht aber in den letzten zwei Jahren vor dem Rentenbeginn. Diese Sperre entfällt nur, wenn die Arbeitslosigkeit auf eine Insolvenz oder die vollständige Geschäftsaufgabe des Arbeitgebers zurückgeht. Bürgergeld, früher Arbeitslosengeld II, zählt dagegen nie auf die 45 Jahre, egal wann es bezogen wurde.' },
      { q: 'Gibt es noch die Altersrente wegen Arbeitslosigkeit?', a: 'Nur für Menschen, die vor 1952 geboren sind. Wer heute vor der Rente arbeitslos wird, kann diese Rentenart nicht mehr nutzen. Es bleiben die Rente nach 35 Jahren ab 63 mit Abschlag, die Rente nach 45 Jahren ohne Abschlag, die Rente für schwerbehinderte Menschen und die Regelaltersrente. Welche davon für Sie zuerst offensteht, zeigt der Rechner auf dieser Seite.' },
      { q: 'Muss ich nach dem Arbeitslosengeld sofort Rente mit Abschlag nehmen?', a: `Diese Seite beschreibt nur das Rentenrecht: Die Rente beginnt erst, wenn Sie sie beantragen, und jeder Monat später senkt den Abschlag um ${DE.pct(AB, 1)}. Ob und wann eine andere Stelle Sie auf einen vorzeitigen Rentenantrag verweisen darf, regelt nicht das Rentenrecht; dazu fragen Sie die zuständige Behörde. Die Folgen des früheren Beginns rechnet der Abschlagsrechner aus.` },
      { q: 'Welche Lücke entsteht, wenn ich mit 58 arbeitslos werde?', a: `Das hängt von der Dauer Ihres Arbeitslosengeldes ab, die im Bescheid steht. Rechnen wir für den Jahrgang 1968 nur zur Veranschaulichung mit 24 Monaten ab Juli 2026: Das Geld läuft bis Ende ${mon(f24.ende - 1, 'de')}, die Rente nach 35 Jahren ist ab dem ${fmtMonat(lj68.frueh, 'de')} möglich. Dazwischen liegen ${f24.luecke} Monate ohne Arbeitslosengeld und ohne Altersrente.` },
      { q: 'Kann ich den Abschlag mit meiner Abfindung ausgleichen?', a: `Ja, Geld aus einer Abfindung lässt sich als Ausgleichszahlung einsetzen (§ 187a SGB VI). Ab 50 gibt es dazu eine Auskunft, wenn Sie erklären, vorzeitig gehen zu wollen. Bei 1.500 € Rente und dem Abschlag mit 63 für den Jahrgang 1968 kostet der volle Rückkauf rund ${DE.eur(aus.betrag)}. Teilzahlungen sind möglich, eine Erstattung gibt es nicht, auch wenn Sie später doch weiterarbeiten.` },
    ],
    body: (h) => `
<h2>Zwei Kalender, die nicht zueinander passen</h2>
<p>Das Arbeitslosengeld läuft eine feste Zahl von Monaten, die im Bescheid der Arbeitsagentur steht. Die Rente beginnt frühestens an einem Datum, das von Ihrem Geburtstag und Ihren Versicherungsjahren abhängt. Wer kurz vor der Rente arbeitslos wird, sollte deshalb beide Daten nebeneinanderlegen, bevor irgendetwas unterschrieben wird: den letzten Monat mit Arbeitslosengeld und den ersten Monat, in dem eine Altersrente möglich ist. Liegt das erste nach dem zweiten, ist die Frage nur noch, welcher Abschlag in Kauf genommen wird. Liegt es davor, entsteht eine Lücke ohne Einkommen aus beiden Kassen.</p>
<p>Diese Seite rechnet die Rentenseite durch. Die Dauer des Arbeitslosengeldes nach Alter steht hier bewusst nicht; sie gehört zum Recht der Arbeitsförderung und sollte direkt bei der Agentur für Arbeit erfragt werden. In den Beispielen ist sie eine Annahme, keine Auskunft.</p>
<h2>Mit 58: welche Rente wann offensteht</h2>
<p>Wer im Jahr 2026 seinen 58. Geburtstag feiert, gehört zum Jahrgang 1968 (oder, wenn der Geburtstag schon 2025 war, zu 1967). Beide Jahrgänge haben die endgültigen Altersgrenzen: Regelaltersrente mit 67, nach 35 Jahren ab 63, nach 45 Jahren ab 65, mit Schwerbehinderung ab 62. Für einen Geburtstag am 15. Juni ergibt der Motor dieser Seite:</p>
${h.table(['Rentenart', 'Frühestens ab', 'Ohne Abschlag ab', 'Abschlag beim frühesten Beginn'], zeilen(o68, 'de'), 'Jahrgang 1968, Geburtstag 15. Juni', ['l', 'l', 'l', 'r'])}
${h.table(['Rentenart', 'Frühestens ab', 'Ohne Abschlag ab', 'Abschlag beim frühesten Beginn'], zeilen(o67, 'de'), 'Jahrgang 1967, Geburtstag 15. Juni', ['l', 'l', 'l', 'r'])}
<p>Die Zeile „Nach 35 Jahren“ ist für die meisten Arbeitslosen die entscheidende, weil sie die geringsten Voraussetzungen hat: 35 Jahre mit rentenrechtlichen Zeiten, zu denen auch Arbeitslosigkeit mit und ohne Leistungsbezug gehört (${h.src('sgb6_36', '§ 36 SGB VI')}). Wer am Ersten eines Monats geboren ist, kann jede dieser Renten einen Monat früher beginnen. Eine Rente vor 62 gibt es für diese Jahrgänge nur bei Erwerbsminderung, die eigene Voraussetzungen hat; dazu ${h.a('erwerbsminderungsrente', 'Erwerbsminderungsrente')}.</p>
<h2>Die Zwei-Jahres-Regel bei den 45 Jahren</h2>
<p>Auf die 45 Jahre für die abschlagsfreie Rente zählen Pflichtbeiträge, Kindererziehung bis zum zehnten Geburtstag, Pflege sowie Zeiten mit Arbeitslosengeld, Krankengeld und Übergangsgeld (${h.src('sgb6_51', '§ 51 Abs. 3a SGB VI')}). Beim Arbeitslosengeld gibt es aber eine Sperre: In den letzten zwei Jahren vor dem Rentenbeginn zählt es nicht. Ausnahme ist allein die Insolvenz oder die vollständige Geschäftsaufgabe des Arbeitgebers.</p>
<p>Für Ihre Planung heißt das: Wer bei Eintritt der Arbeitslosigkeit schon 45 Jahre beisammenhat, verliert sie nicht, denn die alten Zeiten bleiben. Wer sie erst mit dem Arbeitslosengeld vollmachen wollte, muss genau rechnen. Ein Beispiel: 44 Jahre bis zur Kündigung, danach zwei Jahre Arbeitslosengeld direkt vor dem Rentenbeginn. Ohne Insolvenz bleiben es 44 Jahre, die Rente nach 45 Jahren ist nicht erreichbar. Auch freiwillige Beiträge helfen in diesen zwei Jahren nicht, wenn gleichzeitig Arbeitslosigkeit vorliegt; vorher zählen sie, wenn mindestens 18 Jahre Pflichtbeiträge vorhanden sind. Bürgergeld zählt nie. Wie die Zeiten zusammenkommen, erklärt ${h.a('wartezeit-45-jahre', 'was für die 45 Jahre zählt')}.</p>
<h2>Beispiel: arbeitslos mit 58, Jahrgang 1968</h2>
<p>Angenommen, das Arbeitsverhältnis endet kurz nach dem 58. Geburtstag und das Arbeitslosengeld beginnt im ${mon(start58, 'de')}. Wie lange es läuft, steht im Bescheid; wir rechnen nur zur Veranschaulichung zwei Annahmen durch:</p>
${h.table(['Annahme Arbeitslosengeld', 'Endet mit Ablauf von', 'Frühester Rentenbeginn (35 Jahre)', 'Monate dazwischen'], [f12, f24].map((f) => [`${f.monate} Monate`, mon(f.ende - 1, 'de'), fmtMonat(lj68.frueh, 'de'), h.num(f.luecke)]), 'Geburtstag 15. Juni 1968, 35 Versicherungsjahre', ['l', 'l', 'l', 'r'])}
<p>In beiden Fällen bleiben mehrere Jahre, in denen weder Arbeitslosengeld noch Altersrente fließt. Mit 58 ist der Abstand zur Rente schlicht zu groß, als dass das Arbeitslosengeld allein ihn überbrückt. Wer schwerbehindert ist, verkürzt die Lücke um zwölf Monate, weil die Rente dann ab 62 möglich ist; der Abschlag beträgt dabei ${h.pct(sb68.abschlag, 1)} statt ${h.pct(lj68.abschlag, 1)}. Einzelheiten unter ${h.a('schwerbehinderte', 'Altersrente für Schwerbehinderte')}.</p>
<h2>Beispiel: arbeitslos mit 61, Jahrgang 1965</h2>
<p>Näher an der Rente sieht es anders aus. Ein 1965 Geborener verliert die Stelle mit 61; das Arbeitslosengeld beginnt im ${mon(start61, 'de')}. Unterstellt, es wird 24 Monate gezahlt, endet es mit Ablauf von ${mon(ende61 - 1, 'de')}. Genau dann ist auch die Rente nach 35 Jahren möglich, ab dem ${fmtMonat(lj65.frueh, 'de')}. Der nahtlose Anschluss kostet allerdings ${h.pct(anschluss65.abschlag, 1)} Abschlag, lebenslang, weil die Regelaltersgrenze erst ${anschluss65.monate} Monate später erreicht ist.</p>
<p>Hätte diese Person schon 45 Jahre, wäre die Rente ohne Abschlag ab dem ${fmtMonat(bl65.voll, 'de')} möglich. Das Arbeitslosengeld läge dann nicht in den letzten zwei Jahren vor diesem Beginn und würde auf die 45 Jahre angerechnet. Dafür lägen zwischen seinem Ende und der abschlagsfreien Rente zwei Jahre, die anders überbrückt werden müssten. Ob sich das lohnt, ist eine Rechnung zwischen zwei Jahren ohne Einkommen und einem Abschlag, der ein Leben lang bleibt.</p>
<!--mini:fruehVerlust-->
<h2>Was ein früher Beginn dauerhaft kostet</h2>
<p>Bei einer Rente von 1.500 € vor Abschlag bedeutet der Beginn mit 63 für den Jahrgang 1968 jeden Monat ${h.eur(minus)} weniger, für die gesamte Laufzeit und auch für eine spätere Hinterbliebenenrente aus dieser Rente (${h.src('sgb6_77', '§ 77 SGB VI')}). Jeder Monat, den die Rente später beginnt, verringert den Abschlag um ${h.pct(h.P.zugangsfaktor.abschlag_monat, 1)}. Wer zum Beispiel mit 64 statt mit 63 beginnt, trägt noch ${h.pct(mit64.abschlag, 1)}. Zusätzlich fehlen in den Jahren der Arbeitslosigkeit Beiträge aus Arbeit, die Entgeltpunkte für die Rente gebracht hätten.</p>
<p>Wer eine Abfindung erhält, kann einen Teil davon nutzen, um den Abschlag zurückzukaufen. Die Ausgleichszahlung nach ${h.src('sgb6_187a', '§ 187a SGB VI')} ist bis zur Regelaltersgrenze möglich, auch in Raten. Für 1.500 € Rente und ${h.pct(lj68.abschlag, 1)} Abschlag ergibt der Motor rund ${h.eur(aus.betrag)} für den vollen Ausgleich, bei einem Preis von ${h.eur(aus.proEP, 2)} je Entgeltpunkt im Jahr 2026. Rechnen Sie Ihren Betrag mit der ${h.a('ausgleichszahlung', 'Ausgleichszahlung')} durch; vorher braucht es eine Auskunft der Rentenversicherung.</p>
<h2>Was Sie jetzt tun können</h2>
<p>Erstens: den Versicherungsverlauf anfordern und prüfen, ob 35 und vielleicht 45 Jahre belegt sind, bevor ein Aufhebungsvertrag oder eine Kündigung wirksam wird. Zweitens: den frühesten Rentenmonat für Ihr Geburtsdatum mit dem ${h.a('rentenbeginn-rechner', 'Rentenfenster')} ermitteln und mit dem Ende des Arbeitslosengeldes vergleichen. Drittens: den Antrag rechtzeitig stellen. Wer ihn innerhalb von drei Kalendermonaten nach Erreichen der Altersgrenze stellt, bekommt die Rente ab dem Folgemonat; wer später kommt, erst ab dem Antragsmonat (${h.src('sgb6_99', '§ 99 SGB VI')}). Die Schritte stehen unter ${h.a('rente-beantragen', 'Rente beantragen')}.</p>
<p>Wer im Ausland gearbeitet hat, etwa in einem anderen EU-Staat, kann diese Zeiten für die 35 Jahre mitzählen lassen; die Rente selbst zahlt Deutschland nur für die deutschen Zeiten. Für eine persönliche Prüfung sind die Auskunfts- und Beratungsstellen der Deutschen Rentenversicherung zuständig; diese Seite ersetzt keine Beratung.</p>
<h2>Der Reformvorschlag und die Arbeitslosigkeit</h2>
<p>Die Alterssicherungskommission hat 2026 vorgeschlagen, die Rente nach 45 Jahren abzuschaffen und die Rente nach 35 Jahren erst ab 64 zu öffnen. Für Arbeitslose kurz vor der Rente würde das die Lücke verlängern. Beschlossen ist nichts, ein Gesetzentwurf ist nicht veröffentlicht, und eine Rente lässt sich höchstens ein Jahr im Voraus beantragen, sodass sich das heutige Recht nicht vorab sichern lässt (${h.src('drvReform', 'Deutsche Rentenversicherung')}). Den Stand fasst ${h.a('rentenreform', 'Rentenreform')} zusammen.</p>`,
  },
  en: {
    slug: 'unemployed-before-retirement',
    nav: 'Unemployed before retirement',
    card: 'Lost your job at 58 or 61 in Germany: when the pension can follow and what 45 years means.',
    title: 'Unemployed before retirement 2026: gap, reduction, 45 years',
    description: 'Unemployed before retirement in Germany 2026: benefit in the last two years does not count towards 45 years. When the pension follows at 58 or 61, and the cost.',
    h1: 'Unemployed before retirement in Germany: what happens at 58 or 61',
    intro: 'If you lose your job shortly before retiring in Germany, two dates must be lined up: the end of unemployment benefit and the earliest possible pension.',
    resume: `If you become unemployed at 58 in Germany, the earliest old-age pension open to you is at 63, through the pension for long-term insured persons (Altersrente für langjährig Versicherte) after 35 years. For someone born in 1968 that means a start from ${fmtMonat(lj68.frueh, 'en')} with a ${EN.pct(lj68.abschlag, 1)} reduction (Abschlag), ${EN.pct(AB, 1)} for each of the ${lj68.monate} months before the standard retirement age (section 77 SGB VI). The unreduced pension after 45 years starts for this cohort from ${fmtMonat(bl68.voll, 'en')}, at 65. This is where unemployment gets in the way: unemployment benefit (Arbeitslosengeld) counts towards the 45 years, but not in the last two years before the pension starts, unless the employer became insolvent or closed down completely (section 51(3a) SGB VI). Citizen's income (Bürgergeld) never counts. For the 35 years, unemployment does count. A separate pension for the unemployed exists only for people born before 1952. On a €1,500 pension, starting at 63 costs the 1968 cohort ${EN.eur(minus)} a month.`,
    faqs: [
      { q: 'I am 58 and working in Germany: when can I retire?', a: `If you turn 58 in 2026 you were born in 1967 or 1968, and your standard age is 67. With 35 insured years you can start from 63 with a ${EN.pct(lj68.abschlag, 1)} reduction. With 45 years you can go at 65 unreduced, and with a recognised severe disability from 62 at ${EN.pct(sb68.abschlag, 1)} off. No old-age pension starts before 62; only a reduced earning capacity pension can come earlier.` },
      { q: 'Does German unemployment benefit count towards the 45 years?', a: 'Yes, with one important exception. Periods on unemployment benefit (Arbeitslosengeld) count in principle, but not in the last two years before your pension starts. That exclusion falls away only if the job ended because the employer became insolvent or shut down entirely. Citizen’s income (Bürgergeld), the former Arbeitslosengeld II, never counts towards the 45 years, whenever you received it.' },
      { q: 'Is there still a German pension for people who are unemployed?', a: 'Only for people born before 1952. If you become unemployed before retirement today, that pension type is closed to you. What remains is the 35-year pension from 63 with a reduction, the unreduced 45-year pension, the pension for severely disabled persons and the standard old-age pension. The calculator on this page shows which of them opens first for your birth year.' },
      { q: 'What gap opens up if I lose my job at 58?', a: `It depends on how long your unemployment benefit lasts, which your notice from the employment agency states. Purely as an illustration, take 24 months from July 2026 for the 1968 cohort: the benefit runs until the end of ${mon(f24.ende - 1, 'en')}, while the 35-year pension is possible from ${fmtMonat(lj68.frueh, 'en')}. That leaves ${f24.luecke} months without benefit and without an old-age pension.` },
      { q: 'Can I use my severance pay to buy out the pension reduction?', a: `Yes. Money from a severance payment (Abfindung) can be used for a voluntary buy-out payment under section 187a SGB VI. From age 50 you can request a statement of the amount once you declare that you intend to retire early. For a €1,500 pension and the reduction at 63 for the 1968 cohort, a full buy-out costs about ${EN.eur(aus.betrag)}. Instalments are allowed; nothing is refunded.` },
      { q: 'Do jobs in other EU countries help me reach 35 years before retiring early?', a: 'Yes. Insurance periods from other EU and EEA countries and Switzerland are added to your German periods when checking whether you have 35 years, under Regulation 883/2004. Each country then pays only for its own periods, so the German pension reflects German contributions. Unemployment benefit drawn in another country is a separate question for that country’s institutions.' },
    ],
    body: (h) => `
<h2>Two calendars that rarely match</h2>
<p>German unemployment benefit (Arbeitslosengeld) runs for a fixed number of months shown on your notice from the employment agency (Agentur für Arbeit). Your pension can start no earlier than a date set by your birthday and your insured years. If you lose your job close to retirement, put both dates side by side before signing anything: the last month of benefit and the first month an old-age pension is possible. If the first falls after the second, the only question left is which reduction you accept. If it falls before, there is a stretch with no income from either system.</p>
<p>This page works through the pension side. How long benefit lasts at a given age is deliberately not stated here: it belongs to employment promotion law, and you should ask the employment agency directly. In the examples below it is an assumption, not information.</p>
<h2>At 58: which pension opens when</h2>
<p>If you turn 58 during 2026 you belong to the 1968 cohort (or 1967 if your birthday fell in 2025). Both have the final age limits: standard pension at 67, after 35 years from 63, after 45 years from 65, with a severe disability from 62. For a birthday on 15 June the engine behind this site gives:</p>
${h.table(['Pension type', 'Earliest from', 'Unreduced from', 'Reduction at earliest start'], zeilen(o68, 'en'), 'Born 15 June 1968', ['l', 'l', 'l', 'r'])}
${h.table(['Pension type', 'Earliest from', 'Unreduced from', 'Reduction at earliest start'], zeilen(o67, 'en'), 'Born 15 June 1967', ['l', 'l', 'l', 'r'])}
<p>For most people out of work the “after 35 years” row is the one that matters, because its conditions are the lightest: 35 years of pension-relevant periods, which include unemployment with or without benefit (${h.src('sgb6_36', 'section 36 SGB VI')}). Born on the 1st of a month, you can start any of these a month earlier. Before 62, these cohorts can only receive a pension for reduced earning capacity, which has its own conditions; see ${h.a('erwerbsminderungsrente', 'disability pension')}.</p>
<h2>The two-year rule for the 45 years</h2>
<p>The 45 years for the unreduced pension are made up of compulsory contributions, child-raising up to the child’s tenth birthday, caring, and periods on unemployment benefit, sickness benefit and transitional benefit (${h.src('sgb6_51', 'section 51(3a) SGB VI')}). Unemployment benefit has a block, though: it does not count in the last two years before the pension starts. The only exceptions are the employer’s insolvency or complete closure of the business.</p>
<p>In practice: if you already have 45 years when unemployment begins, you keep them, because past periods stay on your record. If you were counting on benefit to complete them, check carefully. Example: 44 years up to dismissal, then two years of benefit right before the pension. Without insolvency it stays at 44 and the 45-year pension is out of reach. Voluntary contributions do not help in those two years either if you are unemployed at the same time; earlier on they count if you have at least 18 years of compulsory contributions. Bürgergeld never counts. For the full list, see ${h.a('wartezeit-45-jahre', 'what counts towards 45 years')}.</p>
<h2>Example: out of work at 58, born 1968</h2>
<p>Suppose your job ends soon after your 58th birthday and benefit starts in ${mon(start58, 'en')}. How long it runs is on your notice; purely for illustration, here are two assumptions:</p>
${h.table(['Assumed benefit period', 'Ends with', 'Earliest pension (35 years)', 'Months in between'], [f12, f24].map((f) => [`${f.monate} months`, mon(f.ende - 1, 'en'), fmtMonat(lj68.frueh, 'en'), h.num(f.luecke)]), 'Born 15 June 1968, 35 insured years', ['l', 'l', 'l', 'r'])}
<p>Either way, several years remain with neither benefit nor pension. At 58 the distance to retirement is simply too long for unemployment benefit to cover alone. A recognised severe disability shortens the gap by twelve months, since the pension then opens at 62, with a ${h.pct(sb68.abschlag, 1)} reduction instead of ${h.pct(lj68.abschlag, 1)}. Details under ${h.a('schwerbehinderte', 'pension with a severe disability')}.</p>
<h2>Example: out of work at 61, born 1965</h2>
<p>Closer to retirement, the picture changes. Someone born in 1965 loses their job at 61, and benefit starts in ${mon(start61, 'en')}. Assuming it is paid for 24 months, it ends with ${mon(ende61 - 1, 'en')}, which is exactly when the 35-year pension becomes possible, from ${fmtMonat(lj65.frueh, 'en')}. That seamless switch costs a ${h.pct(anschluss65.abschlag, 1)} reduction for life, because the standard age is still ${anschluss65.monate} months away.</p>
<p>If the same person already had 45 years, the unreduced pension would be possible from ${fmtMonat(bl65.voll, 'en')}. The benefit would then fall outside the last two years before that start and would count towards the 45 years. In return, there would be two years between the end of benefit and the unreduced pension to bridge some other way. Whether that pays is a trade between two years without income and a reduction that lasts for life.</p>
<!--mini:fruehVerlust-->
<h2>What an early start costs for good</h2>
<p>On a pension of €1,500 before reduction, starting at 63 means ${h.eur(minus)} less every month for the 1968 cohort, for as long as the pension runs, and also on any survivor’s pension later derived from it (${h.src('sgb6_77', 'section 77 SGB VI')}). Each month you start later cuts the reduction by ${h.pct(h.P.zugangsfaktor.abschlag_monat, 1)}; starting at 64 instead of 63 leaves ${h.pct(mit64.abschlag, 1)}. On top of that, the unemployed years bring no contributions from work and so no new pension points.</p>
<p>If you receive a severance payment, part of it can buy back the reduction. The voluntary payment under ${h.src('sgb6_187a', 'section 187a SGB VI')} is possible up to the standard age, also in instalments. For €1,500 and a ${h.pct(lj68.abschlag, 1)} reduction the engine gives about ${h.eur(aus.betrag)} for a full buy-out, at ${h.eur(aus.proEP, 2)} per pension point in 2026. Work out your own figure on ${h.a('ausgleichszahlung', 'buying out pension reductions')}; you first need a statement from the pension insurance.</p>
<h2>Steps to take now</h2>
<p>First, request your insurance record and check whether 35, and perhaps 45, years are covered before a termination agreement or dismissal takes effect. Second, find the earliest pension month for your date of birth with the ${h.a('rentenbeginn-rechner', 'retirement date calculator')} and compare it with the end of benefit. Third, apply on time: if you apply within three calendar months after reaching the age, the pension runs from the following month; apply later and it starts only in the month of application (${h.src('sgb6_99', 'section 99 SGB VI')}). See ${h.a('rente-beantragen', 'applying for your pension')}.</p>
<p>If you worked elsewhere in the EU before coming to Germany, those periods help you reach 35 years, while Germany pays only for its own periods. For an individual check, the information and advice centres of the Deutsche Rentenversicherung are the right contact; this site is independent and gives no personal advice.</p>
<h2>The reform proposal and unemployment</h2>
<p>In 2026 the pension commission (Alterssicherungskommission) proposed abolishing the 45-year pension and opening the 35-year pension only from 64. For people out of work shortly before retirement, that would lengthen the gap. Nothing has been decided, no draft bill has been published, and a pension can be claimed at most one year ahead, so today’s rules cannot be locked in early (${h.src('drvReform', 'Deutsche Rentenversicherung')}). The current state is on ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
