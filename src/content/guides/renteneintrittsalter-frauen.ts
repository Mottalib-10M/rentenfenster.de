import { defineGuide } from '../../lib/guide-types';
import { optionen, regelalter, besondersAlter, schwbAlter, fmtAlter, fmtMonat } from '../../lib/engine/alter';
import { epAusBrutto } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Renteneintrittsalter für Frauen: gleiche Altersgrenzen wie für Männer (Altersrente für Frauen nur vor 1952 Geborene),
 * dazu Kindererziehungszeiten (§§ 56, 249, 70 SGB VI). Beispiele: Geburtstag 15. Juni, Kinder 1990 und 1994, Rentenwert ab 1.7.2026.
 */
const RW = P.rentenwert.ab_2026_07;
const K = P.kindererziehung;
const epVor = K.vor_1992_monate * K.ep_monat;
const epAb = K.ab_1992_monate * K.ep_monat;
const rVor = epVor * RW;
const rAb = epAb * RW;
const zwei = rVor + rAb;
const zeile = (j: number) => {
  const o = optionen({ jahr: j, monat: 6, tag: 15 }, { wz35: true, wz45: false, schwb: false }).find((x) => x.art === 'langjaehrig')!;
  return { j, regel: regelalter(j), bes: besondersAlter(j), sb: schwbAlter(j), o };
};
const reihe = [1958, 1960, 1962, 1963, 1964, 1970].map(zeile);
const z64 = zeile(1964);
/** Teilzeit nach der Familienphase: ein Jahr mit 20.000 € statt 40.000 € Bruttolohn. */
const epTeil = epAusBrutto(20000);
const epVoll = epAusBrutto(40000);
/** Beispiel: Frau, geboren 15. Juni 1966, ab 63 nach 35 Jahren. */
const o66 = optionen({ jahr: 1966, monat: 6, tag: 15 }, { wz35: true, wz45: true, schwb: false });
const lj66 = o66.find((x) => x.art === 'langjaehrig')!;
const bl66 = o66.find((x) => x.art === 'besonders')!;
const witweFrei = P.witwe.freibetrag_faktor * RW;

export default defineGuide({
  id: 'renteneintrittsalter-frauen',
  group: 'beginn',
  order: 90,
  mini: 'kindererziehung',
  miniHref: 'rentenrechner',
  related: ['renteneintrittsalter-tabelle', 'rente-nach-45-jahren', 'wartezeit-45-jahre', 'entgeltpunkte', 'grosse-witwenrente', 'witwenrente-einkommen', 'teilrente'],
  sources: ['sgb6_35', 'sgb6_235', 'sgb6_56', 'sgb6_249', 'sgb6_70', 'sgb6_51', 'sgb6_38', 'sgb6_97'],
  de: {
    slug: 'renteneintrittsalter-frauen',
    nav: 'Renteneintrittsalter Frauen',
    card: 'Frauen gehen heute zur selben Zeit in Rente wie Männer. Was Kinder dabei ändern.',
    title: 'Renteneintrittsalter Frauen 2026: Tabelle und Mütterrente',
    description: 'Renteneintrittsalter Frauen 2026: dieselben Grenzen wie für Männer, ab Jahrgang 1964 also 67. Was Kindererziehungszeiten bringen, auch für die 45 Jahre.',
    h1: 'Renteneintrittsalter für Frauen: gleiche Grenzen, eigene Wege',
    intro: 'Eine eigene Altersgrenze für Frauen gibt es nicht mehr. Unterschiede entstehen über die Versicherungsjahre, vor allem über die Zeiten für Kinder.',
    resume: `Für Frauen gelten heute dieselben Altersgrenzen wie für Männer. Die frühere Altersrente für Frauen gibt es nur noch für vor 1952 Geborene; alle späteren Jahrgänge haben die gleiche Regelaltersgrenze, die ab Jahrgang 1964 bei 67 liegt (§ 35 SGB VI), und dieselben vorgezogenen Renten: nach 35 Jahren ab 63 mit Abschlag, nach 45 Jahren ohne Abschlag ab 65 und mit Schwerbehinderung ab 62. Unterschiede entstehen über die Versicherungsjahre. Kindererziehung zählt in der Rente doppelt: als Beitragszeit für den Betrag, 36 Monate für ein ab 1992 geborenes Kind, 30 Monate für ein früher geborenes, mit je ${DE.num(K.ep_monat, 4)} Entgeltpunkten im Monat, und als Berücksichtigungszeit bis zum zehnten Geburtstag für die 45 Jahre. Beim Rentenwert von ${DE.eur(RW, 2)} ergibt ein Kind ab 1992 ${DE.eur(rAb, 2)} Monatsrente, ein Kind vor 1992 ${DE.eur(rVor, 2)}. Wer am 15. Juni 1966 geboren ist, kann mit 35 Jahren ab dem ${fmtMonat(lj66.frueh, 'de')} gehen, mit 45 Jahren ohne Abschlag ab dem ${fmtMonat(bl66.voll, 'de')}.`,
    faqs: [
      { q: 'Wann können Frauen heute in Rente gehen?', a: `Zu denselben Zeitpunkten wie Männer. Die Regelaltersgrenze liegt ab Jahrgang 1964 bei 67, für 1963 Geborene bei ${fmtAlter(regelalter(1963), 'de')}. Mit 35 Versicherungsjahren ist der Beginn ab 63 möglich, ab Jahrgang 1964 mit ${DE.pct(z64.o.abschlag, 1)} Abschlag. Nach 45 Jahren geht es ab 65 ohne Abschlag, mit Schwerbehinderung ab 62 mit Abschlag oder ab 65 ohne.` },
      { q: 'Gibt es die Rente für Frauen ab 60 noch?', a: 'Nur für Frauen, die vor 1952 geboren sind. Für alle späteren Jahrgänge ist diese Rentenart entfallen, und es gelten die allgemeinen Altersrenten. Wer heute eine frühere Rente sucht, muss die Voraussetzungen einer der vorgezogenen Renten erfüllen: 35 Jahre, 45 Jahre oder eine anerkannte Schwerbehinderung. Welche Termine sich daraus ergeben, zeigt das Rentenfenster.' },
      { q: 'Wie viel Rente bringt ein Kind?', a: `Für ein ab 1992 geborenes Kind werden 36 Monate Kindererziehung angerechnet, für ein früher geborenes 30, jeweils mit ${DE.num(K.ep_monat, 4)} Entgeltpunkten pro Monat. Beim Rentenwert ab Juli 2026 sind das ${DE.eur(rAb, 2)} beziehungsweise ${DE.eur(rVor, 2)} Monatsrente je Kind. Zwei Kinder, geboren 1990 und 1994, ergeben zusammen ${DE.eur(zwei, 2)} im Monat.` },
      { q: 'Was ist die Mütterrente?', a: `Mütterrente ist der umgangssprachliche Name für die Kindererziehungszeiten in der Rente, vor allem für Kinder, die vor 1992 geboren sind. Rechtlich sind es Beitragszeiten nach § 56 und § 249 SGB VI, die ohne eigene Zahlung Entgeltpunkte bringen. Sie werden einem Elternteil gutgeschrieben. Für ein vor 1992 geborenes Kind sind es ${K.vor_1992_monate} Monate, für ein späteres ${K.ab_1992_monate} Monate, beim heutigen Rentenwert ${DE.eur(rVor, 2)} beziehungsweise ${DE.eur(rAb, 2)} Monatsrente.` },
      { q: 'Zählen Kindererziehungszeiten für die Rente nach 45 Jahren?', a: 'Ja. Für die 45 Jahre zählen neben Pflichtbeiträgen die Berücksichtigungszeiten wegen Kindererziehung, und zwar bis zum zehnten Geburtstag des Kindes, auch ohne Arbeit in dieser Zeit. Auch Pflege zählt. Nicht mit eingerechnet werden Monate aus einem Versorgungsausgleich nach der Scheidung oder aus einem Rentensplitting; sie erhöhen die Rente, helfen aber nicht bei den 45 Jahren.' },
      { q: 'Schmälert meine eigene Rente später die Witwenrente?', a: `Ja, ab einem Freibetrag. Eigenes Einkommen, auch die eigene Altersrente, wird auf die Witwenrente angerechnet, soweit es den Freibetrag übersteigt; er beträgt ab Juli 2026 ${DE.eur(witweFrei, 2)} netto im Monat, plus einen Betrag je waisenrentenberechtigtem Kind. Vom Überschuss werden 40 Prozent abgezogen. Die eigene Rente geht dabei mit einem Pauschalabzug als Nettobetrag ein.` },
    ],
    body: (h) => `
<h2>Eine Altersgrenze für alle</h2>
<p>Lange gab es eine eigene Altersrente für Frauen, die einen früheren Rentenbeginn erlaubte. Sie steht heute nur noch Frauen offen, die vor 1952 geboren sind, und spielt für neue Renten keine Rolle mehr. Für alle späteren Jahrgänge gelten dieselben Altersgrenzen wie für Männer: die Regelaltersgrenze nach ${h.src('sgb6_35', '§ 35')} und ${h.src('sgb6_235', '§ 235 SGB VI')}, die Rente nach 35 und nach 45 Jahren und die Rente für schwerbehinderte Menschen. Wer also nach dem Renteneintrittsalter für Frauen sucht, findet die allgemeine Tabelle:</p>
${h.table(['Jahrgang', 'Regelaltersgrenze', 'Nach 35 Jahren ab 63, Abschlag', 'Nach 45 Jahren ohne Abschlag', 'Schwerbehindert ohne Abschlag'], reihe.map((z) => [z.j >= 1960 && z.j <= 1966 ? h.a(`jahrgang-${z.j}`, String(z.j)) : String(z.j), fmtAlter(z.regel, 'de'), h.pct(z.o.abschlag, 1), fmtAlter(z.bes, 'de'), fmtAlter(z.sb.voll, 'de')]), 'Gilt für Frauen und Männer; Abschlag für einen Geburtstag am 15. Juni', ['l', 'l', 'r', 'l', 'l'])}
<p>Ab dem Jahrgang 1964 ändern sich die Werte nicht mehr; die Zeile 1970 steht für alle späteren Jahrgänge. Alle Altersgrenzen und den genauen ersten Rentenmonat für jedes Geburtsdatum zeigt ${h.a('renteneintrittsalter-tabelle', 'die Tabelle zum Renteneintrittsalter')}.</p>
<h2>Wo Frauen trotzdem anders dastehen</h2>
<p>Gleich sind die Altersgrenzen, nicht die Versicherungsverläufe. Viele Frauen haben Jahre der Kindererziehung, der Pflege von Angehörigen oder der Teilzeit im Verlauf. Das wirkt an zwei Stellen: bei der Frage, ob eine vorgezogene Rente überhaupt offensteht, und bei der Höhe der Rente. Für die 35 Jahre zählen alle rentenrechtlichen Zeiten, also auch Kindererziehung, Pflege und Zeiten der Arbeitslosigkeit; diese Hürde nehmen die meisten. Für die 45 Jahre zählen nur bestimmte Zeiten (${h.src('sgb6_51', '§ 51 Abs. 3a SGB VI')}), und hier entscheidet oft die Familienphase, ob es reicht.</p>
<h2>Kindererziehungszeiten: was ein Kind bringt</h2>
<p>Für jedes Kind werden einem Elternteil Kindererziehungszeiten gutgeschrieben, als wären Beiträge gezahlt worden (${h.src('sgb6_56', '§ 56')}, ${h.src('sgb6_249', '§ 249 SGB VI')}). Für ein ab 1992 geborenes Kind sind es ${h.P.kindererziehung.ab_1992_monate} Monate, für ein früher geborenes ${h.P.kindererziehung.vor_1992_monate} Monate. Jeder Monat bringt ${h.num(h.P.kindererziehung.ep_monat, 4)} Entgeltpunkte (${h.src('sgb6_70', '§ 70 SGB VI')}), so viel wie ein Monat mit Durchschnittsverdienst. Diese Zeiten sind das, was umgangssprachlich Mütterrente heißt.</p>
${h.table(['Kind geboren', 'Monate', 'Entgeltpunkte', 'Monatsrente ab Juli 2026'], [['vor 1992', h.P.kindererziehung.vor_1992_monate, h.num(epVor, 2), h.eur(rVor, 2)], ['ab 1992', h.P.kindererziehung.ab_1992_monate, h.num(epAb, 2), h.eur(rAb, 2)], ['zwei Kinder, 1990 und 1994', h.P.kindererziehung.vor_1992_monate + h.P.kindererziehung.ab_1992_monate, h.num(epVor + epAb, 2), h.eur(zwei, 2)]], `Rentenwert ${h.eur(h.P.rentenwert.ab_2026_07, 2)}, vor Abzug von Kranken- und Pflegebeitrag`, ['l', 'r', 'r', 'r'])}
<p>Der Rechner oben rechnet dasselbe für beliebig viele Kinder. Er zeigt den Bruttobetrag; davon gehen wie bei jeder Rente der Kranken- und Pflegebeitrag ab. Die Grundlagen der Punkte erklärt ${h.a('entgeltpunkte', 'Entgeltpunkte')}.</p>
<h2>Kinder und die 45 Jahre</h2>
<p>Für die abschlagsfreie Rente nach 45 Jahren zählt die Berücksichtigungszeit wegen Kindererziehung bis zum zehnten Geburtstag des Kindes, auch wenn in dieser Zeit nicht gearbeitet wurde. Eine Mutter, die nach der Geburt des ersten Kindes zehn Jahre zu Hause geblieben ist, verliert dadurch also keine Jahre für die 45. Auch Pflegezeiten zählen mit.</p>
<p>Zwei Dinge zählen nicht. Monate aus einem Versorgungsausgleich nach der Scheidung oder aus einem Rentensplitting erhöhen die Rente, gehören aber nicht zu den 45 Jahren. Freiwillige Beiträge zählen nur, wenn mindestens 18 Jahre Pflichtbeiträge vorliegen. Wer genau prüfen will, ob es reicht, findet die Liste unter ${h.a('wartezeit-45-jahre', 'was für die 45 Jahre zählt')}.</p>
<p>Ein Beispiel aus dem Motor: Eine Frau, geboren am 15. Juni 1966, kann mit 35 Jahren ab dem ${fmtMonat(lj66.frueh, 'de')} in Rente gehen, mit ${h.pct(lj66.abschlag, 1)} Abschlag. Hat sie 45 Jahre beisammen, geht es ab dem ${fmtMonat(bl66.voll, 'de')} ohne Abschlag, ${lj66.monate - (lj66.voll - bl66.voll)} Monate nach dem frühesten Termin und ${lj66.voll - bl66.voll} Monate vor der Regelaltersgrenze (${h.src('sgb6_38', '§ 38 SGB VI')}).</p>
<!--mini:jahre45-->
<h2>Teilzeit nach der Familienphase</h2>
<p>Der größere Unterschied zur Rente der Männer entsteht meist nicht in den Jahren der Kindererziehung, sondern danach. Wer nach der Familienphase in Teilzeit zurückkehrt, sammelt weniger Punkte. Ein Jahr mit 20.000 € Bruttolohn bringt mit dem vorläufigen Durchschnittsentgelt 2026 ${h.num(epTeil, 2)} Entgeltpunkte, ein Jahr mit 40.000 € ${h.num(epVoll, 2)}. Über zehn Jahre sind das ${h.num((epVoll - epTeil) * 10, 2)} Punkte Unterschied, beim heutigen Rentenwert ${h.eur((epVoll - epTeil) * 10 * h.P.rentenwert.ab_2026_07, 2)} Monatsrente. Wie viel insgesamt zu erwarten ist, rechnet der ${h.a('rentenrechner', 'Rentenrechner')} hoch.</p>
<h2>Eigene Rente und Witwenrente</h2>
<p>Viele Frauen beziehen später neben der eigenen Rente eine Witwenrente. Die eigene Rente wird darauf angerechnet, soweit sie als Nettoeinkommen den Freibetrag übersteigt (${h.src('sgb6_97', '§ 97 SGB VI')}). Er beträgt das ${h.num(h.P.witwe.freibetrag_faktor, 1)}-Fache des Rentenwerts, ab Juli 2026 also ${h.eur(witweFrei, 2)} im Monat; 40 Prozent des Überschusses werden abgezogen. Eine höhere eigene Rente durch Kindererziehung oder längere Arbeit kann die Witwenrente damit teilweise verringern, bleibt aber unter dem Strich immer ein Plus. Die Rechnung im Einzelnen: ${h.a('witwenrente-einkommen', 'Einkommensanrechnung bei der Witwenrente')}; die Unterschiede zwischen großer und kleiner Witwenrente: ${h.a('grosse-witwenrente', 'große und kleine Witwenrente')}.</p>
<h2>Was die Reform an den Altersgrenzen ändern würde</h2>
<p>Die Alterssicherungskommission hat 2026 vorgeschlagen, die Rente nach 45 Jahren abzuschaffen und die Rente nach 35 Jahren erst ab 64 zu öffnen. Gesetz ist davon nichts, ein Entwurf ist nicht veröffentlicht. Für eine verbindliche Auskunft über Ihre Zeiten sind die Auskunfts- und Beratungsstellen der Deutschen Rentenversicherung zuständig; diese Seite ist unabhängig. Den Stand der Reform finden Sie unter ${h.a('rentenreform', 'Rentenreform')}.</p>`,
  },
  en: {
    slug: 'retirement-age-women',
    nav: 'Retirement age for women',
    card: 'Women in Germany now retire at the same ages as men. What children change.',
    title: 'Retirement age for women 2026: German table, child credits',
    description: 'Retirement age for women in Germany 2026: same limits as for men, so 67 from the 1964 cohort. What child-raising credits add and how they help reach 45 years.',
    h1: 'Retirement age for women in Germany: same limits, different paths',
    intro: 'Germany no longer has a separate retirement age for women. Differences come from insured years, above all from periods credited for children.',
    resume: `Women in Germany now face the same pension ages as men. The former old-age pension for women (Altersrente für Frauen) remains only for those born before 1952; every later cohort has the same standard retirement age (Regelaltersgrenze), 67 from the 1964 cohort (section 35 SGB VI), and the same early pensions: after 35 years from 63 with a reduction, after 45 years unreduced from 65, and with a severe disability from 62. Differences come through insured years. Child-raising counts twice: as contribution periods for the amount, 36 months for a child born from 1992 and 30 months for an earlier child, each month worth ${EN.num(K.ep_monat, 4)} pension points, and as credited periods (Berücksichtigungszeiten) up to the child’s tenth birthday for the 45 years. At the pension value of ${EN.eur(RW, 2)}, a child born from 1992 adds ${EN.eur(rAb, 2)} a month, a child born before 1992 ${EN.eur(rVor, 2)}. Born on 15 June 1966, you can retire with 35 years from ${fmtMonat(lj66.frueh, 'en')}, and with 45 years unreduced from ${fmtMonat(bl66.voll, 'en')}.`,
    faqs: [
      { q: 'At what age can women retire in Germany today?', a: `At the same ages as men. The standard age is 67 from the 1964 cohort and ${fmtAlter(regelalter(1963), 'en')} for people born in 1963. With 35 insured years you can start from 63, with a ${EN.pct(z64.o.abschlag, 1)} reduction from the 1964 cohort. After 45 years it is 65 with no reduction; with a severe disability from 62 with a reduction or 65 without.` },
      { q: 'Is there still a women’s pension from age 60 in Germany?', a: 'Only for women born before 1952. For every later cohort that pension type has gone, and the general old-age pensions apply. If you want to retire earlier today, you must meet the conditions of one of the early pensions: 35 years, 45 years or a recognised severe disability. The retirement date calculator shows which dates follow from that for your birth year.' },
      { q: 'How much German pension does one child add?', a: `For a child born from 1992, 36 months of child-raising are credited; for an earlier child, 30 months, each month worth ${EN.num(K.ep_monat, 4)} pension points. At the pension value from July 2026 that is ${EN.eur(rAb, 2)} or ${EN.eur(rVor, 2)} a month per child. Two children born in 1990 and 1994 together add ${EN.eur(zwei, 2)} a month before deductions.` },
      { q: 'What is the “Mütterrente” in Germany?', a: `Mütterrente (literally “mothers’ pension”) is the everyday name for child-raising periods in the German pension, especially for children born before 1992. Legally they are contribution periods under sections 56 and 249 SGB VI that earn pension points without any payment. They are credited to one parent: ${K.vor_1992_monate} months for a child born before 1992 and ${K.ab_1992_monate} months for a later child, worth ${EN.eur(rVor, 2)} or ${EN.eur(rAb, 2)} a month at today’s pension value.` },
      { q: 'Do child-raising years count towards the 45 years for an unreduced pension?', a: 'Yes. Besides compulsory contributions, the 45 years include the credited periods for raising a child, up to the child’s tenth birthday, even if you did not work during that time. Caring for a relative counts too. What does not count are months from pension rights split on divorce (Versorgungsausgleich) or pension splitting between spouses; they raise the pension but do not help with the 45 years.' },
      { q: 'Do years worked in another EU country help a woman reach 35 years in Germany?', a: 'Yes. Insurance periods in other EU and EEA countries and Switzerland are added to German periods when checking the 35 or 45 years, under Regulation 883/2004. The German pension itself is then paid only on the German periods, including child-raising periods credited in Germany. Each country pays its own share, and living elsewhere in the EU does not reduce the German amount.' },
    ],
    body: (h) => `
<h2>One set of age limits for everyone</h2>
<p>For a long time Germany had a separate old-age pension for women that allowed an earlier start. Today it is open only to women born before 1952 and plays no part in new pensions. Every later cohort follows the same limits as men: the standard age under ${h.src('sgb6_35', 'section 35')} and ${h.src('sgb6_235', 'section 235 SGB VI')}, the pensions after 35 and after 45 years, and the pension for severely disabled persons. So if you are looking for the retirement age for women, this is the general table:</p>
${h.table(['Born', 'Standard age', 'After 35 years from 63, reduction', 'After 45 years, unreduced', 'Severe disability, unreduced'], reihe.map((z) => [z.j >= 1960 && z.j <= 1966 ? h.a(`jahrgang-${z.j}`, String(z.j)) : String(z.j), fmtAlter(z.regel, 'en'), h.pct(z.o.abschlag, 1), fmtAlter(z.bes, 'en'), fmtAlter(z.sb.voll, 'en')]), 'Same for women and men; reduction for a birthday on 15 June', ['l', 'l', 'r', 'l', 'l'])}
<p>From the 1964 cohort the values no longer change; the 1970 row stands for all later years. Every age limit and the exact first pension month for any date of birth are in the ${h.a('renteneintrittsalter-tabelle', 'retirement age table')}.</p>
<h2>Where women still end up in a different place</h2>
<p>The age limits are the same; insurance records are not. Many women have years of child-raising, caring for relatives or part-time work on their record. That matters in two ways: whether an early pension is open at all, and how large the pension is. For the 35 years every pension-relevant period counts, including child-raising, caring and unemployment, and most people clear that bar. For the 45 years only certain periods count (${h.src('sgb6_51', 'section 51(3a) SGB VI')}), and the family years often decide whether it is enough.</p>
<h2>Child-raising periods: what a child adds</h2>
<p>For each child, one parent is credited with child-raising periods (Kindererziehungszeiten) as if contributions had been paid (${h.src('sgb6_56', 'section 56')}, ${h.src('sgb6_249', 'section 249 SGB VI')}). For a child born from 1992 that is ${h.P.kindererziehung.ab_1992_monate} months, for an earlier child ${h.P.kindererziehung.vor_1992_monate}. Each month earns ${h.num(h.P.kindererziehung.ep_monat, 4)} pension points (${h.src('sgb6_70', 'section 70 SGB VI')}), the same as a month on average pay. These periods are what Germans informally call the Mütterrente.</p>
${h.table(['Child born', 'Months', 'Pension points', 'Monthly pension from July 2026'], [['before 1992', h.P.kindererziehung.vor_1992_monate, h.num(epVor, 2), h.eur(rVor, 2)], ['from 1992', h.P.kindererziehung.ab_1992_monate, h.num(epAb, 2), h.eur(rAb, 2)], ['two children, 1990 and 1994', h.P.kindererziehung.vor_1992_monate + h.P.kindererziehung.ab_1992_monate, h.num(epVor + epAb, 2), h.eur(zwei, 2)]], `Pension value ${h.eur(h.P.rentenwert.ab_2026_07, 2)}, before health and care contributions`, ['l', 'r', 'r', 'r'])}
<p>The calculator above does the same sum for any number of children. It shows the gross figure; health and long-term care contributions come off it as with any pension. How pension points work is explained on ${h.a('entgeltpunkte', 'pension points')}.</p>
<h2>Children and the 45 years</h2>
<p>For the unreduced pension after 45 years, the credited period for raising a child up to its tenth birthday counts, even if you did not work during that time. A mother who stayed at home for ten years after her first child therefore loses no years towards the 45. Caring periods count as well.</p>
<p>Two things do not count. Months from pension rights split on divorce or from pension splitting raise the pension but are not part of the 45 years. Voluntary contributions count only if there are at least 18 years of compulsory contributions. To check whether you get there, see ${h.a('wartezeit-45-jahre', 'what counts towards 45 years')}.</p>
<p>An example from the engine: a woman born on 15 June 1966 can retire with 35 years from ${fmtMonat(lj66.frueh, 'en')}, with a ${h.pct(lj66.abschlag, 1)} reduction. With 45 years she can go unreduced from ${fmtMonat(bl66.voll, 'en')}, ${lj66.monate - (lj66.voll - bl66.voll)} months after the earliest date and ${lj66.voll - bl66.voll} months before the standard age (${h.src('sgb6_38', 'section 38 SGB VI')}).</p>
<!--mini:jahre45-->
<h2>Part-time work after the family years</h2>
<p>The larger gap compared with men’s pensions usually opens not during child-raising but afterwards. Returning part-time means fewer points. A year on €20,000 gross earns ${h.num(epTeil, 2)} pension points against the provisional 2026 average earnings, a year on €40,000 ${h.num(epVoll, 2)}. Over ten years that is ${h.num((epVoll - epTeil) * 10, 2)} points, or ${h.eur((epVoll - epTeil) * 10 * h.P.rentenwert.ab_2026_07, 2)} a month at today’s pension value. The ${h.a('rentenrechner', 'German pension calculator')} projects your total.</p>
<h2>Your own pension and a widow’s pension</h2>
<p>Many women later draw a widow’s pension alongside their own. Your own pension is set against it insofar as, as net income, it exceeds the allowance (${h.src('sgb6_97', 'section 97 SGB VI')}). The allowance is ${h.num(h.P.witwe.freibetrag_faktor, 1)} times the pension value, ${h.eur(witweFrei, 2)} a month from July 2026, and 40% of the excess is deducted. A higher own pension from child-raising or longer work can therefore reduce the widow’s pension in part, but on balance it always leaves you better off. The details: ${h.a('witwenrente-einkommen', 'widow’s pension income test')}; large versus small widow’s pension: ${h.a('grosse-witwenrente', 'large and small widow’s pension')}.</p>
<h2>What the reform would change about the age limits</h2>
<p>In 2026 the pension commission (Alterssicherungskommission) proposed abolishing the 45-year pension and opening the 35-year pension only from 64. None of it is law, and no draft has been published. For a binding statement on your periods, contact the information and advice centres of the Deutsche Rentenversicherung; this site is independent. The state of the reform is on ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
