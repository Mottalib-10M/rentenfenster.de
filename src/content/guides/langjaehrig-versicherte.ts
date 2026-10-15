import { defineGuide } from '../../lib/guide-types';
import { optionen, beginn, abschlagBei, fmtMonat, fmtAlter, regelalter, langjaehrigAlter } from '../../lib/engine/alter';
import { ausgleich, besteuerungsanteil } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Altersrente für langjährig Versicherte (35 Jahre): Abschlag je Startalter, Ausgleichszahlung, Steueranteil, Reformvorschlag. Alles aus dem Motor. */
const A = P.altersgrenzen;
const WZ = A.langjaehrig_wartezeit_jahre;
const AB = P.zugangsfaktor.abschlag_monat;
const RW = P.rentenwert.ab_2026_07;
const RENTE = 1400;
const EP = 40;
const g = { jahr: 1966, monat: 9, tag: 15 };
const opts = optionen(g, { wz35: true, wz45: false, schwb: false });
const lj = opts.find((o) => o.art === 'langjaehrig')!;
/** Start mit 63, 64, 65, 66 und zur Regelaltersgrenze (Jahrgang 1966, Geburtstag 15. September). */
const stufen = [63, 64, 65, 66, 67].map((a) => {
  const start = beginn(g, { j: a, m: 0 });
  const x = abschlagBei(opts, start)!;
  return { a, start, monate: x.monate, ab: x.abschlag, jahr: Math.floor(start / 12) };
});
const s63 = stufen[0], s64 = stufen[1], s65 = stufen[2], s67 = stufen[4];
const aus64 = ausgleich(EP, s64.ab, RW);
const aus63 = ausgleich(EP, s63.ab, RW);
/** Ältere Jahrgänge: Abschlag beim frühesten Beginn. */
const alt = [1961, 1962, 1963].map((j) => {
  const o = optionen({ jahr: j, monat: 9, tag: 15 }, { wz35: true, wz45: false, schwb: false }).find((x) => x.art === 'langjaehrig')!;
  return { j, r: regelalter(j), o };
});
const alt1_64 = (alt[1].r.j - 64) * 12 + alt[1].r.m;
const reformFrueh = langjaehrigAlter(1966, true).frueh;

export default defineGuide({
  id: 'langjaehrig-versicherte',
  group: 'beginn',
  order: 30,
  mini: 'langjaehrig',
  miniHref: 'abschlag-rechner',
  related: ['rente-mit-63', 'abschlag-rechner', 'ausgleichszahlung', 'teilrente', 'rente-nach-45-jahren', 'rentenreform', 'renteneintrittsalter-tabelle'],
  sources: ['sgb6_36', 'sgb6_236', 'sgb6_51', 'sgb6_77', 'sgb6_187a', 'sgb6_42', 'estg_22', 'drvReform', 'bmasKommission'],
  de: {
    slug: 'altersrente-langjaehrig-versicherte',
    nav: 'Rente nach 35 Jahren',
    card: `Ab 63 nach 35 Jahren, mit ${DE.pct(AB, 1)} Abschlag je Monat vor der Regelaltersgrenze.`,
    title: 'Altersrente für langjährig Versicherte 2026: ab 63',
    description: 'Altersrente für langjährig Versicherte 2026: nach 35 Jahren ab 63, Abschlag je Startalter, Ausgleichszahlung, Steueranteil und der Reformvorschlag ab 64.',
    h1: 'Altersrente für langjährig Versicherte: früher gehen nach 35 Jahren',
    intro: 'Die Rente nach 35 Jahren ist der einzige Weg ab 63, der allen Jahrgängen offensteht. Der Rechner zeigt den Abschlag für das gewünschte Startalter.',
    resume: `Die Altersrente für langjährig Versicherte (§ 36 SGB VI, für ältere Jahrgänge § 236) können alle nehmen, die ${WZ} Jahre mit rentenrechtlichen Zeiten haben. Sie beginnt frühestens im Monat nach dem 63. Geburtstag, ohne Abschlag aber erst mit der Regelaltersgrenze. Jeder Monat dazwischen kostet nach § 77 SGB VI ${DE.pct(AB, 1)}, lebenslang. Ab dem Jahrgang 1964 liegen zwischen 63 und 67 genau ${DE.num(s63.monate)} Monate, der Abschlag beträgt dann ${DE.pct(s63.ab, 1)}; wer mit 64 beginnt, verliert ${DE.pct(s64.ab, 1)}, mit 65 ${DE.pct(s65.ab, 1)}. Bei ${DE.eur(RENTE)} Rente ohne Abschlag bleiben mit 64 noch ${DE.eur(RENTE * (1 - s64.ab))}. Der Abschlag lässt sich durch eine Ausgleichszahlung bis zur Regelaltersgrenze ganz oder teilweise abkaufen. Für die ${WZ} Jahre zählen alle rentenrechtlichen Zeiten, auch solche, die bei den 45 Jahren nicht mitgerechnet werden. Die Alterssicherungskommission schlägt vor, den frühesten Beginn auf 64 anzuheben; das ist kein geltendes Recht.`,
    faqs: [
      { q: 'Wie hoch ist der Abschlag bei der Altersrente für langjährig Versicherte mit 64?', a: `Für Jahrgänge ab 1964 sind es ${DE.num(s64.monate)} Monate bis zur Regelaltersgrenze, also ${DE.pct(s64.ab, 1)}. Aus ${DE.eur(RENTE)} werden ${DE.eur(RENTE * (1 - s64.ab))}, auf Dauer. Für ältere Jahrgänge ist der Abstand kleiner, weil ihre Regelaltersgrenze unter 67 liegt; beim Jahrgang 1962 mit ${fmtAlter(alt[1].r, 'de')} sind es von 64 aus ${DE.num(alt1_64)} Monate. Den genauen Wert für Ihren Geburtsmonat liefert der Rechner oben.` },
      { q: 'Welche Zeiten zählen für die 35 Jahre?', a: `Alle rentenrechtlichen Zeiten nach § 51 Abs. 3 SGB VI. Das ist weiter gefasst als bei der Rente nach 45 Jahren, wo etwa Bürgergeld, Schule und Studium nicht mitzählen und Arbeitslosengeld kurz vor der Rente oft herausfällt. Welche Zeiten auf Ihrem Konto stehen, zeigt der Versicherungsverlauf; fehlende Zeiten sollten Sie vor dem Antrag über eine Kontenklärung nachtragen lassen.` },
      { q: 'Kann ich die Altersrente für langjährig Versicherte nur zum Teil nehmen?', a: `Ja. Jede Altersrente lässt sich als Teilrente beziehen, mindestens zu 10 Prozent der Vollrente (§ 42 SGB VI). Der bezogene Teil trägt den Abschlag des frühen Beginns. Der Rest bleibt stehen und wird später mit dem dann geringeren Abschlag gezahlt, zur Regelaltersgrenze ganz ohne. Daneben ist Arbeit ohne Verdienstgrenze erlaubt.` },
      { q: 'Lohnt sich die Ausgleichszahlung für die Rente nach 35 Jahren?', a: `Sie ist teuer. Wer ${DE.num(EP)} Entgeltpunkte erwartet und mit 64 beginnt, müsste 2026 rund ${DE.eur(aus64.betrag)} zahlen, um ${DE.eur(aus64.renteMinus, 2)} Abschlag im Monat auszugleichen; das Geld käme erst nach etwa ${DE.num(aus64.jahreBisAmortisiert)} Rentenjahren zurück. Sie darf in Teilbeträgen fließen, eine Erstattung gibt es nicht. Voraussetzung ist eine Auskunft der Rentenversicherung, die es ab 50 gibt.` },
      { q: 'Wird die Rente nach 35 Jahren durch die Reform erst ab 64 möglich?', a: `Das hat die Alterssicherungskommission am 23. Juni 2026 vorgeschlagen: frühester Beginn mit 64, danach im Gleichschritt mit der Regelaltersgrenze, sodass immer ein Fenster von drei Jahren bleibt. Beschlossen ist das nicht, einen veröffentlichten Gesetzentwurf gibt es nicht. Bis dahin gilt 63, und zwar nach dem Recht, das beim Rentenbeginn in Kraft ist.` },
      { q: 'Gilt der Abschlag auch für die Witwenrente nach meinem Tod?', a: `Ja. Eine Witwen- oder Witwerrente, die aus einer vorzeitig begonnenen Altersrente folgt, übernimmt deren Zugangsfaktor (§ 77 Abs. 3 SGB VI). Wer mit 63 und ${DE.pct(s63.ab, 1)} Abschlag geht, kürzt also auch die spätere Hinterbliebenenrente um diesen Anteil. Das ist ein Grund, die Entscheidung mit dem Partner zu treffen.` },
    ],
    body: (h) => `
<h2>Abschlag nach Startalter</h2>
<p>Bei dieser Rente entscheidet nicht der Jahrgang allein, sondern vor allem der Monat, in dem man beginnt. Die Tabelle rechnet das für eine Person, die am 15. September 1966 geboren ist und damit die endgültige Regelaltersgrenze von ${fmtAlter(regelalter(1966), 'de')} hat (${h.src('sgb6_36', '§ 36 SGB VI')}, Abschlag nach ${h.src('sgb6_77', '§ 77 SGB VI')}):</p>
${h.table(['Beginn mit', 'Erster Rentenmonat', 'Monate vor der Regelaltersgrenze', 'Abschlag', `Aus ${h.eur(RENTE)} werden`, 'Besteuerungsanteil'], stufen.map((x) => [`${x.a} Jahren`, fmtMonat(x.start, 'de'), h.num(x.monate), h.pct(x.ab, 1), h.eur(RENTE * (1 - x.ab)), h.pct(besteuerungsanteil(x.jahr), 1)]), `Geburtstag 15. September 1966, ${WZ} Jahre erfüllt`, ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Jedes Jahr Aufschub verringert den Abschlag um ${h.num(AB * 1200, 1)} Prozentpunkte. Der Zwischenschritt ist frei wählbar: Wer mit 64 Jahren und 6 Monaten geht, hat 30 Monate Abschlag, nicht 36. Die letzte Spalte zeigt einen kleinen Gegeneffekt, den viele übersehen: Ein früheres Startjahr bedeutet einen niedrigeren steuerpflichtigen Anteil (${h.src('estg_22', '§ 22 EStG')}), mit 63 ${h.pct(besteuerungsanteil(s63.jahr), 1)} statt ${h.pct(besteuerungsanteil(s67.jahr), 1)} mit 67. Den Abschlag gleicht das nicht aus, aber es dämpft ihn ein wenig.</p>
<h2>Ältere Jahrgänge: die wandernde Grenze</h2>
<p>Für vor 1964 Geborene liegt die abschlagsfreie Grenze dieser Rente unter 67, sie folgt nach ${h.src('sgb6_236', '§ 236 SGB VI')} derselben Staffel wie die Regelaltersgrenze. Der früheste Beginn bleibt bei 63. Damit ist der maximale Abschlag kleiner:</p>
${h.table(['Jahrgang', 'Ohne Abschlag mit', 'Frühester Beginn', 'Abschlag dann'], alt.map((x) => [h.a(`jahrgang-${x.j}`, String(x.j)), fmtAlter(x.r, 'de'), fmtMonat(x.o.frueh, 'de'), h.pct(x.o.abschlag, 1)]), 'Geburtstag 15. September', ['l', 'l', 'l', 'r'])}
<p>Für die Jahrgänge 1961 und 1962 ist der Weg ab 63 damit bereits offen; bei einem Geburtstag im September 1961 war ${fmtMonat(alt[0].o.frueh, 'de')} der früheste Termin. Wie die Grenzen aller Jahrgänge aussehen, zeigt die ${h.a('renteneintrittsalter-tabelle', 'Renteneintrittsalter-Tabelle')}.</p>
<h2>Die 35 Jahre: großzügiger als die 45</h2>
<p>Für die Wartezeit von ${WZ} Jahren zählen nach ${h.src('sgb6_51', '§ 51 Abs. 3 SGB VI')} alle rentenrechtlichen Zeiten. Damit ist diese Rente der Auffangweg für alle, deren Lebenslauf die strengen Bedingungen der 45 Jahre nicht erfüllt, etwa wegen Bürgergeldbezug, eines Studiums oder Arbeitslosengeld in den beiden letzten Jahren vor der Rente. Was bei 45 Jahren wegfällt, erklärt ${h.a('wartezeit-45-jahre', 'Wartezeit 45 Jahre')}. Versicherungszeiten aus anderen EU-Staaten werden für die ${WZ} Jahre mitgezählt, erhöhen aber nicht den deutschen Rentenbetrag.</p>
<h2>Den Abschlag abkaufen</h2>
<p>Nach ${h.src('sgb6_187a', '§ 187a SGB VI')} kann man den Abschlag bis zur Regelaltersgrenze mit Sonderbeiträgen ausgleichen. Der Preis eines Entgeltpunkts liegt 2026 bei ${h.eur(aus64.proEP, 2)}, geteilt durch den Zugangsfaktor. Beispiel mit ${h.num(EP)} Entgeltpunkten: Für den Beginn mit 64 fehlen ${h.num(aus64.epMinus, 2)} Punkte, ihr Ausgleich kostet ${h.eur(aus64.betrag)}. Beim Beginn mit 63 wären es ${h.eur(aus63.betrag)}. Teilzahlungen sind erlaubt, zurückgezahlt wird nichts. Mit eigenen Werten rechnet die ${h.a('ausgleichszahlung', 'Ausgleichszahlung')}.</p>
<h2>Teilrente und Weiterarbeit</h2>
<p>Die Rente nach 35 Jahren muss nicht voll bezogen werden. Ab 10 Prozent der Vollrente ist jede Teilrente möglich (${h.src('sgb6_42', '§ 42 SGB VI')}), und eine Grenze für den Hinzuverdienst gibt es seit 2023 nicht mehr. Wer etwa mit 63 auf 60 Prozent der Arbeitszeit geht und 40 Prozent der Rente nimmt, verbindet beides: Der Abschlag trifft nur den bezogenen Teil, und der Lohn bringt weiter Entgeltpunkte. Rechenbeispiele unter ${h.a('teilrente', 'Teilrente')}.</p>
<h2>Was die Kommission vorschlägt</h2>
<p>Im Bericht der Alterssicherungskommission vom 23. Juni 2026 steht die Empfehlung, den frühesten Beginn dieser Rente von 63 auf ${reformFrueh.j} anzuheben und danach an die Regelaltersgrenze zu koppeln, sodass das Fenster drei Jahre breit bleibt (${h.src('bmasKommission', 'Bundesarbeitsministerium')}). Für Jahrgänge ab 1964 wäre der höchste Abschlag dann ${h.pct(s64.ab, 1)} statt ${h.pct(s63.ab, 1)}. Ein Gesetzentwurf ist nicht veröffentlicht. Die Rentenversicherung weist darauf hin, dass das Recht beim Rentenbeginn gilt und ein früher Antrag nichts sichert (${h.src('drvReform', 'Deutsche Rentenversicherung')}). Den Stand fasst ${h.a('rentenreform', 'Rentenreform')} zusammen.</p>`,
  },
  en: {
    slug: 'pension-after-35-years',
    nav: 'Pension after 35 years',
    card: `From 63 after 35 years, with ${EN.pct(AB, 1)} off for each month before the standard age.`,
    title: 'Pension after 35 years in Germany 2026: retire from 63',
    description: 'Pension after 35 years in Germany, 2026: retire from 63, the reduction by start age, buying it out, the German taxable share and the proposed move to age 64.',
    h1: 'Pension for long-term insured persons: leaving early after 35 years',
    intro: 'The 35-year pension is the one route from 63 open to every birth year. The calculator shows the reduction for the age you have in mind.',
    resume: `The pension for long-term insured persons (Altersrente für langjährig Versicherte, section 36 of Book VI of the Social Code, section 236 for older cohorts) is open to anyone with ${WZ} years of pension periods. It can start at the earliest in the month after your 63rd birthday, but it is only unreduced from the standard retirement age. Each month in between costs ${EN.pct(AB, 1)} under section 77, for life. From the 1964 cohort there are exactly ${EN.num(s63.monate)} months between 63 and 67, so the reduction is ${EN.pct(s63.ab, 1)}; starting at 64 costs ${EN.pct(s64.ab, 1)}, at 65 ${EN.pct(s65.ab, 1)}. On an unreduced pension of ${EN.eur(RENTE)}, starting at 64 leaves ${EN.eur(RENTE * (1 - s64.ab))}. You can buy out the reduction in full or in part with a special payment up to the standard age. Every pension period counts towards the ${WZ} years, including periods excluded from the 45-year test. The pension commission has proposed raising the earliest age to 64; that is not law.`,
    faqs: [
      { q: 'What reduction applies if I take the 35-year pension at 64?', a: `For people born from 1964 it is ${EN.num(s64.monate)} months before the standard age, so ${EN.pct(s64.ab, 1)}. ${EN.eur(RENTE)} becomes ${EN.eur(RENTE * (1 - s64.ab))}, permanently. Older cohorts have a shorter gap because their standard age is below 67; born in 1962, with a standard age of ${fmtAlter(alt[1].r, 'en')}, starting at 64 means ${EN.num(alt1_64)} months. The calculator above gives the figure for your birth month.` },
      { q: 'Which periods count towards the 35 years in Germany?', a: `All pension periods under section 51(3) SGB VI. That is broader than the 45-year test, which leaves out citizen’s benefit, school and university, and often unemployment benefit just before retirement. If you worked in other EU countries, EEA states or Switzerland, those periods are added to reach 35 years, but the German pension is paid on German periods only.` },
      { q: 'Can I draw only part of the 35-year pension?', a: `Yes. Any old-age pension can be taken as a partial pension (Teilrente) of at least 10% of the full amount (section 42 SGB VI). The part you draw carries the reduction for the early start. The rest waits and is paid later with the smaller reduction that applies then, or none at the standard age. Working alongside has no earnings cap.` },
      { q: 'Is buying out the reduction on the 35-year pension worth it?', a: `It is expensive. With ${EN.num(EP)} pension points and a start at 64, you would pay about ${EN.eur(aus64.betrag)} in 2026 to offset ${EN.eur(aus64.renteMinus, 2)} a month; it takes roughly ${EN.num(aus64.jahreBisAmortisiert)} years of pension to get the money back. It can be paid in instalments, and nothing is refunded. You first need a statement from the pension insurance, available from age 50.` },
      { q: 'Will the reform move the 35-year pension to 64?', a: 'The pension commission proposed exactly that on 23 June 2026: earliest start at 64, then moving in step with the standard age so the window always stays three years wide. Nothing has been enacted and no draft bill has been published. Until then 63 applies, and your pension follows the law in force when it starts.' },
      { q: 'Does the early-retirement cut also reduce my spouse’s survivor pension?', a: `Yes. A widow’s or widower’s pension that follows from an old-age pension taken early keeps its access factor (Zugangsfaktor, section 77(3) SGB VI). If you start at 63 with a ${EN.pct(s63.ab, 1)} reduction, the later survivor pension is reduced by the same share. That is one reason to make the decision together with your partner.` },
    ],
    body: (h) => `
<h2>Reduction by starting age</h2>
<p>For this pension the month you start matters more than your birth year. The table works it through for someone born on 15 September 1966, who has the final standard age of ${fmtAlter(regelalter(1966), 'en')} (${h.src('sgb6_36', 'section 36 SGB VI')}, reduction under ${h.src('sgb6_77', 'section 77 SGB VI')}):</p>
${h.table(['Start at', 'First pension month', 'Months before standard age', 'Reduction', `${h.eur(RENTE)} becomes`, 'Taxable share'], stufen.map((x) => [`${x.a}`, fmtMonat(x.start, 'en'), h.num(x.monate), h.pct(x.ab, 1), h.eur(RENTE * (1 - x.ab)), h.pct(besteuerungsanteil(x.jahr), 1)]), `Born 15 September 1966, ${WZ} years completed`, ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Each year of delay cuts the reduction by ${h.num(AB * 1200, 1)} percentage points. Any month in between works too: start at 64 and 6 months and the reduction covers 30 months, not 36. The last column shows a small counter-effect that is easy to miss. An earlier start year means a lower taxable share (${h.src('estg_22', 'section 22 Income Tax Act')}): ${h.pct(besteuerungsanteil(s63.jahr), 1)} at 63 against ${h.pct(besteuerungsanteil(s67.jahr), 1)} at 67. It does not make up for the reduction, but it softens it slightly.</p>
<h2>Older cohorts: a moving limit</h2>
<p>For people born before 1964 the unreduced limit of this pension is below 67 and follows the same scale as the standard age under ${h.src('sgb6_236', 'section 236 SGB VI')}. The earliest start stays at 63, so the maximum reduction is smaller:</p>
${h.table(['Born', 'Unreduced at', 'Earliest start', 'Reduction then'], alt.map((x) => [h.a(`jahrgang-${x.j}`, String(x.j)), fmtAlter(x.r, 'en'), fmtMonat(x.o.frueh, 'en'), h.pct(x.o.abschlag, 1)]), 'Birthday 15 September', ['l', 'l', 'l', 'r'])}
<p>For the 1961 and 1962 cohorts the route from 63 is therefore already open; with a September 1961 birthday the earliest date was ${fmtMonat(alt[0].o.frueh, 'en')}. Every limit for every cohort is in the ${h.a('renteneintrittsalter-tabelle', 'retirement age table')}.</p>
<h2>The 35 years: looser than the 45</h2>
<p>For the ${WZ}-year qualifying period every pension period counts (${h.src('sgb6_51', 'section 51(3) SGB VI')}). That makes this pension the fallback for anyone whose career does not meet the strict 45-year rules, for instance because of citizen’s benefit (Bürgergeld), a university degree or unemployment benefit in the two years before retiring. What drops out of the 45 is explained under ${h.a('wartezeit-45-jahre', 'what counts towards 45 years')}. For a mobile career, the key point is that EU periods can open the door to this pension without adding to its German amount.</p>
<h2>Buying out the reduction</h2>
<p>Under ${h.src('sgb6_187a', 'section 187a SGB VI')} you can offset the reduction with extra contributions up to the standard age. One pension point costs ${h.eur(aus64.proEP, 2)} in 2026, divided by the access factor. Example with ${h.num(EP)} points: starting at 64 removes ${h.num(aus64.epMinus, 2)} points, and buying them back costs ${h.eur(aus64.betrag)}. For a start at 63 it would be ${h.eur(aus63.betrag)}. Instalments are allowed and nothing is refunded. Use your own figures in the ${h.a('ausgleichszahlung', 'buy-out calculator')}.</p>
<h2>Partial pension and working on</h2>
<p>You do not have to take the 35-year pension in full. Any partial pension from 10% of the full amount is possible (${h.src('sgb6_42', 'section 42 SGB VI')}), and since 2023 there is no earnings cap. Cut your hours to 60% at 63 and draw 40% of the pension, and you get both: the reduction hits only the part you draw, and your wages keep earning pension points. Worked examples are under ${h.a('teilrente', 'partial pension')}.</p>
<h2>What the commission proposes</h2>
<p>The pension commission’s report of 23 June 2026 recommends raising the earliest start of this pension from 63 to ${reformFrueh.j} and then linking it to the standard age, so the window stays three years wide (${h.src('bmasKommission', 'Federal Ministry of Labour')}). For people born from 1964 the maximum reduction would then be ${h.pct(s64.ab, 1)} instead of ${h.pct(s63.ab, 1)}. No draft bill has been published. The pension insurance points out that the law at the start of your pension applies and that an early application secures nothing (${h.src('drvReform', 'German pension insurance')}). The current position is summed up under ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
