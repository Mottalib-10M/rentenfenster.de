import { defineGuide } from '../../lib/guide-types';
import { optionen, fmtMonat, abschlag, breakEven } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/** Rente mit 63: Abschlag je Jahrgang (Geburtstag 15. Juni), Kosten über 20 Jahre, Aufholzeit. Alles aus dem Motor. */
const RW = P.rentenwert.ab_2026_07;
const zeile = (j: number) => {
  const o = optionen({ jahr: j, monat: 6, tag: 15 }, { wz35: true, wz45: false, schwb: false }).find((x) => x.art === 'langjaehrig')!;
  return { j, o };
};
const reihe = [1958, 1959, 1960, 1961, 1962, 1963, 1964].map(zeile);
const z64 = zeile(1964).o;
const be48 = breakEven(48, 1500, RW);
const verlust = 1500 * abschlag(48);

export default defineGuide({
  id: 'rente-mit-63',
  group: 'beginn',
  order: 10,
  mini: 'mit63',
  miniHref: 'rentenbeginn-rechner',
  related: ['rente-nach-45-jahren', 'langjaehrig-versicherte', 'abschlag-rechner', 'fruehrente', 'rentenreform', 'jahrgang-1964'],
  sources: ['sgb6_36', 'sgb6_236', 'sgb6_236b', 'sgb6_77', 'sgb6_51', 'sgb6_42', 'bregReform'],
  de: {
    slug: 'rente-mit-63',
    nav: 'Rente mit 63',
    card: 'Wer heute mit 63 gehen kann und was es kostet: bis zu 14,4 % Abschlag.',
    title: 'Rente mit 63 (2026): wer kann, mit wie viel Abschlag?',
    description: 'Rente mit 63 im Jahr 2026: ab Jahrgang 1964 nur mit 14,4 % Abschlag nach 35 Jahren, ohne Abschlag gar nicht mehr. Tabelle je Jahrgang und was die Reform plant.',
    h1: 'Rente mit 63: was davon 2026 noch übrig ist',
    intro: 'Der Name hält sich, die Regel nicht: Mit 63 ohne Abschlag konnten zuletzt die vor 1953 Geborenen gehen. Was heute mit 63 geht, zeigt der Rechner für Ihren Jahrgang.',
    resume: `„Rente mit 63“ bezeichnet zwei verschiedene Renten. Die eine ist die Altersrente für besonders langjährig Versicherte nach 45 Jahren, die 2014 tatsächlich mit 63 und ohne Abschlag begann; ihre Altersgrenze steigt seit dem Jahrgang 1953 um zwei Monate pro Jahrgang und liegt ab Jahrgang 1964 bei 65 (§ 236b, § 38 SGB VI). Mit 63 ohne Abschlag geht heute also niemand mehr, der jetzt in Rente kommt. Die andere ist die Altersrente für langjährig Versicherte nach 35 Jahren: Sie ist für jeden Jahrgang ab 63 möglich, aber mit 0,3 Prozent Abschlag für jeden Monat vor der Regelaltersgrenze (§ 36, § 77). Für den Jahrgang 1964 sind das 48 Monate und ${DE.pct(z64.abschlag, 1)}, für den Jahrgang 1960 noch 40 Monate und 12 Prozent. Der Abschlag gilt lebenslang. Bei 1.500 € Rente fehlen ab 63 jeden Monat ${DE.eur(verlust)}. Die Alterssicherungskommission hat 2026 vorgeschlagen, auch diesen Weg erst ab 64 zu öffnen; Gesetz ist das nicht.`,
    faqs: [
      { q: 'Gibt es die Rente mit 63 ohne Abschlag noch?', a: 'Nicht für Menschen, die heute in Rente gehen. Ohne Abschlag mit genau 63 konnten nur vor 1953 Geborene mit 45 Versicherungsjahren gehen. Für den Jahrgang 1960 liegt die Grenze bei 64 Jahren und 4 Monaten, ab Jahrgang 1964 bei 65. Wer mit 63 gehen will, braucht 35 Jahre und nimmt den Abschlag bis zur Regelaltersgrenze in Kauf.' },
      { q: 'Wie hoch ist der Abschlag mit 63 für meinen Jahrgang?', a: `Er hängt am Abstand zwischen 63 und Ihrer Regelaltersgrenze: 0,3 Prozent je Monat. Jahrgang 1958: 36 Monate, 10,8 Prozent. Jahrgang 1960: 40 Monate, 12 Prozent. Jahrgang 1962: 44 Monate, 13,2 Prozent. Ab Jahrgang 1964: 48 Monate, ${DE.pct(z64.abschlag, 1)}. Einen größeren Abschlag gibt es für die Rente nach 35 Jahren nicht.` },
      { q: 'Kann ich mit 63 gehen und den Abschlag später ausgleichen?', a: 'Ja, mit Sonderzahlungen bis zur Regelaltersgrenze (§ 187a SGB VI). Voraussetzung ist eine Auskunft der Rentenversicherung über den Ausgleichsbetrag, die es ab 50 gibt, und Ihre Erklärung darin, vorzeitig in Rente gehen zu wollen. Teilzahlungen sind erlaubt, eine Erstattung gibt es nicht. Weiterarbeit beseitigt den Abschlag dagegen nicht, sie bringt nur neue Entgeltpunkte.' },
      { q: 'Darf ich mit der Rente ab 63 weiterarbeiten?', a: 'Ja, unbegrenzt. Die Hinzuverdienstgrenze für vorgezogene Altersrenten ist seit 2023 abgeschafft. Wer weiterarbeitet und Beiträge zahlt, erwirbt neue Entgeltpunkte, die jeweils zum 1. Juli des Folgejahres die Rente erhöhen. Den Abschlag auf die bereits laufende Rente beseitigt das nicht, nur die neuen Punkte kommen dazu.' },
      { q: 'Wird die Rente mit 63 jetzt abgeschafft?', a: 'Die Alterssicherungskommission hat am 23. Juni 2026 empfohlen, die Rente nach 45 Jahren ohne Abschlag abzuschaffen und die Rente nach 35 Jahren erst ab 64 zu erlauben. Beschlossen ist das nicht, ein Gesetzentwurf ist nicht veröffentlicht. Für jede Rente gilt das Recht bei ihrem Beginn; wer vor einer Gesetzesänderung in Rente geht, ist davon nicht betroffen.' },
      { q: 'Lohnt sich der Beginn mit 63 trotz Abschlag?', a: `Rechnerisch nur, wenn die Rente nicht sehr lange läuft. Bei 1.500 € und 48 Monaten Vorsprung bekommt man ${DE.eur(be48.vorsprung)} mehr ausgezahlt, aber jeden Monat ${DE.eur(be48.diff)} weniger. Die Rente mit 67 holt das nach rund ${DE.num(be48.monate / 12)} Jahren auf, also mit Mitte 80. Gesundheit, Arbeit und Partnerrente zählen bei der Entscheidung mehr als diese Rechnung.` },
    ],
    body: (h) => `
<h2>Zwei Renten unter einem Namen</h2>
<p>Als der Bundestag 2014 die Altersrente für besonders langjährig Versicherte auf 63 senkte, entstand das Schlagwort „Rente mit 63“. Gemeint war: nach 45 Beitragsjahren ohne Abschlag mit 63 (${h.src('sgb6_236b', '§ 236b SGB VI')}). Dieselbe Vorschrift hob die Grenze aber gleich wieder an, um zwei Monate je Jahrgang ab 1953. Heute gilt die Grenze von 63 für niemanden mehr, der noch nicht in Rente ist. Wer 45 Jahre hat, findet seinen Termin unter ${h.a('rente-nach-45-jahren', 'Rente nach 45 Jahren')}.</p>
<p>Was tatsächlich mit 63 geht, ist die Altersrente für langjährig Versicherte (${h.src('sgb6_36', '§ 36')}, für ältere Jahrgänge ${h.src('sgb6_236', '§ 236 SGB VI')}). Sie verlangt 35 Jahre mit rentenrechtlichen Zeiten und ist frühestens ab dem Monat nach dem 63. Geburtstag möglich. Ohne Abschlag zahlt sie erst ab der Regelaltersgrenze; jeder Monat davor kostet 0,3 Prozent nach ${h.src('sgb6_77', '§ 77 SGB VI')}.</p>
<h2>Abschlag mit 63 nach Jahrgang</h2>
${h.table(['Jahrgang', 'Rente mit 63 ab', 'Monate bis zur Regelaltersgrenze', 'Abschlag', 'Aus 1.500 € werden'], reihe.map(({ j, o }) => [j >= 1960 ? h.a(`jahrgang-${j}`, String(j)) : String(j), fmtMonat(o.frueh, 'de'), h.num(o.monate), h.pct(o.abschlag, 1), h.eur(1500 * (1 - o.abschlag))]), 'Geburtstag am 15. Juni, 35 Versicherungsjahre', ['l', 'l', 'r', 'r', 'r'])}
<p>Ab dem Jahrgang 1964 ändert sich die Zeile nicht mehr: 48 Monate, ${h.pct(z64.abschlag, 1)}. Wer am Ersten eines Monats geboren ist, beginnt einen Monat früher; der Abschlag bleibt gleich, weil auch die Regelaltersgrenze einen Monat früher erreicht ist.</p>
<h2>Was auf die 35 Jahre zählt</h2>
<p>Für die Rente mit 63 zählen alle rentenrechtlichen Zeiten: Beschäftigung, Kindererziehung, Pflege, Arbeitslosigkeit mit und ohne Leistungsbezug, Krankheit, Schule und Studium ab 17 als Anrechnungszeit, Wehr- und Zivildienst. Das ist weit großzügiger als bei den 45 Jahren, wo nur bestimmte Zeiten zählen (${h.src('sgb6_51', '§ 51 Abs. 3a')}). Wer 40 Jahre gearbeitet hat und zwei Jahre arbeitslos war, kann die 45 verfehlen und trotzdem mit 63 gehen, eben mit Abschlag. Den Unterschied zeigt ${h.a('wartezeit-45-jahre', 'was für die 45 Jahre zählt')}.</p>
<h2>Was der Abschlag über die Jahre kostet</h2>
<p>Ein Abschlag von ${h.pct(z64.abschlag, 1)} klingt abstrakt. Bei 1.500 € Rente sind es ${h.eur(verlust)} im Monat, über zwanzig Rentenjahre ${h.eur(verlust * 240)}. Dem stehen 48 Monate zusätzlicher Rente gegenüber, zusammen ${h.eur(be48.vorsprung)}. Gleichen sich beide aus, ist man rund ${h.num(be48.monate / 12)} Jahre in Rente. Diese Rechnung unterschätzt die Kosten noch, denn in den vier Jahren entstehen keine Entgeltpunkte mehr. Mit eigenen Zahlen rechnet der ${h.a('abschlag-rechner', 'Abschlagsrechner')}, ganz durchgerechnet mit Ihrem Geburtsdatum das ${h.a('rentenbeginn-rechner', 'Rentenfenster')}.</p>
<!--mini:fruehVerlust-->
<h2>Teilrente statt voller Frührente</h2>
<p>Zwischen „mit 63 ganz aufhören“ und „bis 67 durcharbeiten“ liegt die Teilrente: Ab 63 lässt sich auch nur ein Teil der Rente beziehen, mindestens 10 Prozent der Vollrente (${h.src('sgb6_42', '§ 42 SGB VI')}). Der bezogene Teil trägt den Abschlag des frühen Beginns, der nicht bezogene Teil wird später mit dem dann kleineren Abschlag gezahlt. Wer etwa die Arbeitszeit halbiert und die halbe Rente nimmt, begrenzt den dauerhaften Verlust und erwirbt mit dem Teilzeitlohn weiter Entgeltpunkte. Wie sich das rechnet, zeigt ${h.a('teilrente', 'Teilrente')}.</p>
<h2>Schwerbehinderte: der kleinere Abschlag</h2>
<p>Mit einem anerkannten Grad der Behinderung von 50 gibt es einen günstigeren Weg. Die Altersrente für schwerbehinderte Menschen ist ab Jahrgang 1964 mit 62 möglich und mit 65 abschlagsfrei; mit 63 kostet sie deshalb nur 24 Monate, also 7,2 Prozent statt ${h.pct(z64.abschlag, 1)}. Wer die Anerkennung hat oder beantragen könnte, sollte das vor dem Rentenantrag klären. Einzelheiten unter ${h.a('schwerbehinderte', 'Rente für Schwerbehinderte')}.</p>
<h2>Die Reform: von 63 auf 64</h2>
<p>Die Alterssicherungskommission empfiehlt in ihrem Bericht vom 23. Juni 2026, die Altersgrenze für die Rente nach 35 Jahren auf 64 anzuheben und danach mit der Regelaltersgrenze mitwandern zu lassen, sodass das Fenster immer drei Jahre breit bleibt (${h.src('bregReform', 'Bundesregierung')}). Der Abschlag je Monat bliebe bei 0,3 Prozent; ab Jahrgang 1964 wären es dann höchstens 10,8 Prozent statt 14,4. Ab wann und für welche Jahrgänge das gelten soll, steht in keinem veröffentlichten Entwurf. Bis dahin bleibt es bei 63. Der Stand: ${h.a('rentenreform', 'Rentenreform')}.</p>`,
  },
  en: {
    slug: 'retiring-at-63',
    nav: 'Retiring at 63',
    card: 'Who can still retire at 63 in Germany and what it costs: up to 14.4% off.',
    title: 'Retire at 63 Germany 2026: Who Can, and at What Reduction?',
    description: 'Retiring at 63 in Germany in 2026: from the 1964 cohort only with a 14.4% reduction after 35 years, never unreduced. Table by birth year and the reform plan.',
    h1: 'Retiring at 63 in Germany: what is left of it in 2026',
    intro: 'The name has stuck, the rule has not: only people born before 1953 could stop at 63 with no reduction. The calculator shows what 63 means for your birth year today.',
    resume: `“Rente mit 63” (retiring at 63) refers to two different German pensions. One is the pension for especially long-term insured persons after 45 years, which really did start at 63 with no reduction in 2014; its age limit has risen by two months per birth year since the 1953 cohort and is 65 from the 1964 cohort (sections 236b and 38 SGB VI). So nobody retiring now can stop at 63 without a reduction. The other is the pension for long-term insured persons after 35 years: open to every cohort from 63, but reduced by 0.3% for each month before the standard retirement age (sections 36 and 77). For people born in 1964 that is 48 months and ${EN.pct(z64.abschlag, 1)}; for 1960 it is 40 months and 12%. The reduction is for life. On a €1,500 pension you lose ${EN.eur(verlust)} every month. The pension commission proposed in 2026 opening this route only from 64; that is not law.`,
    faqs: [
      { q: 'Can I still retire at 63 in Germany with no reduction?', a: 'Not if you are retiring now. Only people born before 1953 with 45 insured years could stop at exactly 63 without a reduction. For the 1960 cohort the limit is 64 years and 4 months, and from 1964 it is 65. If you want to go at 63 you need 35 years and accept the reduction up to the standard age.' },
      { q: 'What reduction applies at 63 for my birth year?', a: `It depends on the gap between 63 and your standard retirement age, at 0.3% per month. Born 1958: 36 months, 10.8%. Born 1960: 40 months, 12%. Born 1962: 44 months, 13.2%. From 1964: 48 months, ${EN.pct(z64.abschlag, 1)}. The 35-year pension never carries a larger reduction than that.` },
      { q: 'Do years worked abroad count towards the 35 years for retiring at 63?', a: 'Periods in other EU and EEA countries and Switzerland are added to German periods to decide whether you reach 35 years, under the EU coordination rules. Some countries outside Europe have social security agreements with Germany that do the same. The German pension is then paid only on your German periods, so the amount may be small even if the date is open to you.' },
      { q: 'Can I keep working after starting the pension at 63?', a: 'Yes, without limit. The earnings cap on early old-age pensions was abolished in 2023. If you keep working and paying contributions, you earn new pension points, which raise your pension each 1 July of the following year. That does not remove the reduction on the pension already running; only the new points are added.' },
      { q: 'Is Germany abolishing retirement at 63?', a: 'On 23 June 2026 the pension commission recommended abolishing the unreduced pension after 45 years and allowing the 35-year pension only from 64. Nothing has been enacted and no draft bill has been published. Each pension follows the law in force when it starts, so if you retire before any change, it does not apply to you.' },
      { q: 'Does starting at 63 pay off despite the reduction?', a: `Only if the pension does not run for very long. With €1,500 and a 48-month head start you receive ${EN.eur(be48.vorsprung)} more, but ${EN.eur(be48.diff)} less every month. The pension from 67 catches up after about ${EN.num(be48.monate / 12)} years, in your mid-eighties. Health, work and a spouse’s pension matter more to the decision than this sum.` },
    ],
    body: (h) => `
<h2>Two pensions behind one phrase</h2>
<p>When parliament lowered the age for the pension for especially long-term insured persons to 63 in 2014, the phrase “Rente mit 63” was born: after 45 years of contributions, no reduction at 63 (${h.src('sgb6_236b', 'section 236b SGB VI')}). The same section raised the age again straight away, by two months per birth year from 1953. Today 63 applies to nobody who has not yet retired. If you have 45 years, your date is under ${h.a('rente-nach-45-jahren', 'pension after 45 years')}.</p>
<p>What actually works at 63 is the pension for long-term insured persons (${h.src('sgb6_36', 'section 36')}, for older cohorts ${h.src('sgb6_236', 'section 236 SGB VI')}). It needs 35 years of pension periods and can start from the month after your 63rd birthday. It is only unreduced from the standard retirement age; each month before costs 0.3% under ${h.src('sgb6_77', 'section 77 SGB VI')}.</p>
<h2>Reduction at 63 by birth year</h2>
${h.table(['Born', 'Pension at 63 from', 'Months to standard age', 'Reduction', '€1,500 becomes'], reihe.map(({ j, o }) => [j >= 1960 ? h.a(`jahrgang-${j}`, String(j)) : String(j), fmtMonat(o.frueh, 'en'), h.num(o.monate), h.pct(o.abschlag, 1), h.eur(1500 * (1 - o.abschlag))]), 'Birthday 15 June, 35 insured years', ['l', 'l', 'r', 'r', 'r'])}
<p>From the 1964 cohort the row no longer changes: 48 months, ${h.pct(z64.abschlag, 1)}. Born on the 1st of a month, you start one month earlier; the reduction stays the same because the standard age is also reached a month earlier.</p>
<h2>What counts towards the 35 years</h2>
<p>For retiring at 63 every pension period counts: employment, child-raising, caring, unemployment with or without benefit, sickness, school and university from 17 as credited periods, military or civilian service. That is far more generous than the 45 years, where only certain periods count (${h.src('sgb6_51', 'section 51(3a)')}). Someone with 40 years of work and two years of unemployment can miss 45 and still retire at 63, with a reduction. For expats, insurance years in other EU countries can be added to reach 35, but they do not add to the German amount. See ${h.a('wartezeit-45-jahre', 'what counts towards 45 years')}.</p>
<h2>What the reduction costs over the years</h2>
<p>A ${h.pct(z64.abschlag, 1)} reduction sounds abstract. On €1,500 it is ${h.eur(verlust)} a month, ${h.eur(verlust * 240)} over twenty years of retirement. Against that stand 48 extra monthly payments, ${h.eur(be48.vorsprung)} in total. The two even out after about ${h.num(be48.monate / 12)} years in retirement. That still understates the cost, because the four years add no pension points. The ${h.a('abschlag-rechner', 'reduction calculator')} uses your own figures, the ${h.a('rentenbeginn-rechner', 'retirement date calculator')} your date of birth.</p>
<!--mini:fruehVerlust-->
<h2>Severe disability: the smaller reduction</h2>
<p>With a recognised degree of disability of 50 there is a cheaper route. The pension for severely disabled persons is possible from 62 for the 1964 cohort and unreduced at 65, so at 63 it costs only 24 months, 7.2% instead of ${h.pct(z64.abschlag, 1)}. If you hold the status or could apply for it, settle that before applying for the pension. Details under ${h.a('schwerbehinderte', 'pension with a severe disability')}.</p>
<h2>The reform: from 63 to 64</h2>
<p>In its report of 23 June 2026 the pension commission recommends raising the age for the 35-year pension to 64 and then moving it with the standard age, so that the window always stays three years wide (${h.src('bregReform', 'Federal Government')}). The reduction per month would stay at 0.3%; from the 1964 cohort the maximum would be 10.8% instead of 14.4%. When this would start, and for which cohorts, is in no published draft. Until then 63 stays. Current state: ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
