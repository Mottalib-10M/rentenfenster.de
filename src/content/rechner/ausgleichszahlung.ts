import { defineGuide } from '../../lib/guide-types';
import { ausgleich } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Ausgleichszahlung (§ 187a, § 187 Abs. 3 SGB VI): Preis je Entgeltpunkt 2026, Raster für 30, 40 und 50 Punkte
 * bei 12 bis 48 Monaten Vorziehzeit, Rückflusszeit. Alle Beträge aus `ausgleich()`.
 */
const RW = P.rentenwert.ab_2026_07;
const RG = P.rechengroessen;
const am = P.zugangsfaktor.abschlag_monat;
const MON = [12, 24, 36, 48];
const EPS = [30, 40, 50];
const grid = EPS.map((ep) => ({ ep, a: MON.map((m) => ausgleich(ep, m * am, RW)) }));
const bsp = ausgleich(40, 24 * am, RW);
const halb = ausgleich(40, 12 * am, RW);
const lang = ausgleich(40, 48 * am, RW);
/** Rückflusszeit ohne Abschlag: ein Punkt kostet so viele Jahresrenten aus einem Punkt. */
const jahreProPunkt = bsp.proEP / (RW * 12);

export default defineGuide({
  id: 'ausgleichszahlung',
  group: 'beginn',
  order: 40,
  tool: 'ausgleich',
  related: ['abschlag-rechner', 'rente-mit-63', 'renteninformation', 'entgeltpunkte', 'rentenrechner', 'rente-ausland'],
  sources: ['sgb6_187a', 'sgb6_187', 'sgb6_77', 'drvRechengroessen', 'drvWerte', 'vo883'],
  de: {
    slug: 'ausgleichszahlung-abschlaege',
    nav: 'Ausgleichszahlung',
    card: 'Was es kostet, den Abschlag einer früheren Rente vorab abzukaufen, und wann es sich rechnet.',
    title: 'Ausgleichszahlung Rente 2026: Preis, Rechenweg, Rückfluss',
    description: `Ausgleichszahlung Rente 2026: Ein Punkt kostet ${DE.eur(bsp.proEP, 2)}, geteilt durch den Zugangsfaktor. Beträge für 30 bis 50 Punkte und Rückfluss nach rund 20 Jahren.`,
    h1: 'Ausgleichszahlung für Rentenabschläge berechnen',
    intro: 'Entgeltpunkte bei Rentenbeginn und die Zahl der Monate vor dem abschlagsfreien Termin eingeben: Der Rechner nennt den Betrag, der den Abschlag vollständig ausgleicht.',
    resume: `Mit einer Ausgleichszahlung kaufen Versicherte vor Rentenbeginn die Entgeltpunkte nach, die ein vorzeitiger Beginn kosten würde (§ 187a SGB VI). Der Preis eines Punktes ist 2026 der Beitragssatz von ${DE.pct(RG.beitragssatz_rv, 1)} mal dem vorläufigen Durchschnittsentgelt von ${DE.eur(RG.durchschnittsentgelt_2026_vorlaeufig)}, also ${DE.eur(bsp.proEP, 2)}. Weil auch die nachgekauften Punkte dem Abschlag unterliegen, wird der Betrag durch den Zugangsfaktor geteilt. Beispiel aus dem Rechner: Bei 40 Entgeltpunkten und zwei Jahren früher fehlen ${DE.num(bsp.epMinus, 2)} Punkte oder ${DE.eur(bsp.renteMinus, 2)} Monatsrente; der volle Ausgleich kostet ${DE.eur(bsp.betrag)}. Die Summe fließt über die höhere Rente nach rund ${DE.num(bsp.jahreBisAmortisiert, 1)} Jahren zurück. Voraussetzung ist eine Auskunft der Rentenversicherung, die ab 50 möglich ist und die Absicht festhält, früher in Rente zu gehen. Gezahlt werden kann bis zur Regelaltersgrenze, auch in Teilbeträgen; eine Erstattung gibt es nicht.`,
    faqs: [
      { q: 'Ab welchem Alter kann ich Abschläge mit einer Sonderzahlung ausgleichen?', a: `Den Anfang macht eine Auskunft der Rentenversicherung über die Höhe des Ausgleichs. Ein berechtigtes Interesse daran wird ab ${P.ausgleich.ab_alter_auskunft} Jahren angenommen; im Antrag erklären Sie, eine Altersrente vorzeitig beziehen zu wollen. Zahlungen sind danach bis zum Erreichen der Regelaltersgrenze möglich (§ 187a SGB VI), einmalig oder verteilt auf mehrere Jahre.` },
      { q: 'Darf ich die Ausgleichszahlung in Teilbeträgen leisten?', a: `Ja, Teilzahlungen sind ausdrücklich zugelassen. Jeder Teilbetrag gleicht den Abschlag anteilig aus: Wer bei 40 Punkten und zwei Jahren früher nur ${DE.eur(halb.betrag)} statt ${DE.eur(bsp.betrag)} zahlt, gleicht etwa ein Jahr Vorziehzeit aus, also die Hälfte des Abschlags. Bereits gezahlte Beträge erstattet die Rentenversicherung nicht zurück.` },
      { q: 'Nach wie vielen Jahren rechnet sich eine Ausgleichszahlung?', a: `Bei den Werten von 2026 nach etwa 20 Jahren Rentenbezug, fast unabhängig von der Punktzahl. Der Grund: Ein Punkt kostet ${DE.eur(bsp.proEP, 2)} und bringt ${DE.eur(RW * 12, 2)} Rente im Jahr, das sind ${DE.num(jahreProPunkt, 1)} Jahre. Die Teilung durch den Zugangsfaktor verlängert das bei 48 Monaten auf ${DE.num(lang.jahreBisAmortisiert, 1)} Jahre. Steuern und Rentenerhöhungen sind nicht eingerechnet.` },
      { q: 'Warum kostet der Ausgleich mehr als die fehlenden Punkte allein?', a: `Weil die nachgekauften Punkte bei Rentenbeginn ebenfalls um den Abschlag gekürzt würden. Damit am Ende genau die fehlenden Punkte ankommen, teilt das Gesetz die Zahl durch den Zugangsfaktor (§ 187a Abs. 3). Bei ${DE.pct(24 * am, 1)} Abschlag sind das ${DE.num(bsp.zf, 3)}, der Betrag steigt dadurch um ${DE.pct(1 / bsp.zf - 1, 1)}.` },
    ],
    body: (h) => `
<h2>Was der Rechner ausgibt</h2>
<p>Sie geben zwei Zahlen ein: die Entgeltpunkte, die Sie bei Rentenbeginn voraussichtlich haben, und die Monate, die Sie vor dem abschlagsfreien Termin gehen wollen. Der Rechner bestimmt daraus den Abschlag (${h.pct(am)} je Monat nach ${h.src('sgb6_77', '§ 77 SGB VI')}), die Punkte und den Monatsbetrag, die dadurch fehlen, den Preis für den vollständigen Ausgleich und die Zahl der Jahre, nach der die höhere Rente den Betrag wieder eingebracht hat. Den Preis eines Punktes legt ${h.src('sgb6_187', '§ 187 Abs. 3 SGB VI')} fest: Beitragssatz mal Durchschnittsentgelt. Für 2026 gelten ${h.pct(RG.beitragssatz_rv)} und vorläufig ${h.eur(RG.durchschnittsentgelt_2026_vorlaeufig)} (${h.src('drvRechengroessen', 'Rechengrößen 2026')}), zusammen ${h.eur(bsp.proEP, 2)}.</p>
<h2>Beträge für den vollen Ausgleich</h2>
${h.table(['Entgeltpunkte', ...MON.map((m) => `${m} Monate (${h.pct(m * am)})`)], grid.map((r) => [h.num(r.ep), ...r.a.map((a) => h.eur(a.betrag))]), `Werte 2026, Rentenwert ${h.eur(RW, 2)}`, ['l', 'r', 'r', 'r', 'r'])}
<p>Das Raster zeigt, wie stark die Vorziehzeit wirkt. Bei 40 Punkten kostet ein Jahr früher ${h.eur(halb.betrag)}, vier Jahre früher ${h.eur(lang.betrag)}: mehr als das Vierfache, weil der Zugangsfaktor mit jedem Monat sinkt und der Divisor kleiner wird. Die Punktzahl wirkt dagegen linear, ein Viertel mehr Punkte kostet ein Viertel mehr.</p>
<h2>Der Rechenweg an einem Beispiel</h2>
<p>Eine Versicherte erwartet 40 Entgeltpunkte und will 24 Monate früher gehen. Der Abschlag beträgt ${h.pct(24 * am)}, der Zugangsfaktor ${h.num(bsp.zf, 3)}. Ihr fehlen ${h.num(bsp.epMinus, 2)} Punkte, das sind ${h.eur(bsp.renteMinus, 2)} Rente im Monat. Damit nach der Kürzung genau diese Punkte ankommen, muss sie ${h.num(bsp.epMinus, 2)} ÷ ${h.num(bsp.zf, 3)} = ${h.num(bsp.epMinus / bsp.zf, 4)} Punkte kaufen (${h.src('sgb6_187a', '§ 187a Abs. 3 SGB VI')}), zu ${h.eur(bsp.proEP, 2)} je Punkt: ${h.eur(bsp.betrag)}. Ihre Rente beginnt dann zwei Jahre früher und so hoch, als wäre sie ohne Abschlag gestartet. Ob der Abschlag überhaupt anfällt und wie hoch er für Ihren Geburtstag ist, rechnet der ${h.a('abschlag-rechner', 'Abschlagsrechner')}.</p>
<h2>Voraussetzungen und Fristen</h2>
<p>Am Anfang steht eine besondere Auskunft der Rentenversicherung. Sie setzt ein berechtigtes Interesse voraus, das ab ${P.ausgleich.ab_alter_auskunft} Jahren vermutet wird, und die Erklärung, eine Altersrente vorzeitig in Anspruch nehmen zu wollen. Gezahlt werden kann bis zur Regelaltersgrenze, auf einmal oder in Teilbeträgen; eine Erstattung bereits gezahlter Beträge sieht das Gesetz nicht vor. Wie viele Punkte Sie heute haben, steht in der ${h.a('renteninformation', 'Renteninformation')}; den Stand bei Rentenbeginn schätzt der ${h.a('rentenrechner', 'Rentenrechner')}.</p>
<h2>Grenzen</h2>
<p>Der Rechner nutzt nur die Rechengrößen von 2026, die jedes Jahr neu festgesetzt werden; für eine Zahlung in einem anderen Jahr kann der Betrag abweichen. Er unterstellt, dass die eingegebenen Punkte bei Rentenbeginn erreicht sind, und rechnet ohne Steuern, Rentenanpassungen und Zinsen. Den verbindlichen Betrag nennt allein die Auskunft der Rentenversicherung; für Fragen zum eigenen Fall sind deren Auskunfts- und Beratungsstellen zuständig.</p>`,
  },
  en: {
    slug: 'buying-out-pension-reductions',
    nav: 'Buying out reductions',
    card: 'What it costs to buy out the reduction on an early German pension, and when it pays back.',
    title: 'Buying out pension reductions 2026: price and payback time',
    description: `Buying out pension reductions in Germany, 2026: one point costs ${EN.eur(bsp.proEP, 2)}, divided by the access factor. Amounts for 30 to 50 points and the payback time.`,
    h1: 'Buying out a German early retirement reduction',
    intro: 'Enter your pension points at the start and the months you plan to go early: the calculator gives the amount that fully offsets the reduction.',
    resume: `A buy-out payment (Ausgleichszahlung) lets you buy, before your German pension starts, the pension points that an early start would cost you (section 187a SGB VI). In 2026 one point costs the ${EN.pct(RG.beitragssatz_rv, 1)} contribution rate times the provisional average pay of ${EN.eur(RG.durchschnittsentgelt_2026_vorlaeufig)}, which is ${EN.eur(bsp.proEP, 2)}. Because the points you buy are reduced as well, the amount is divided by the access factor (Zugangsfaktor). An example from the calculator: with 40 pension points and a start two years early, ${EN.num(bsp.epMinus, 2)} points or ${EN.eur(bsp.renteMinus, 2)} of monthly pension are lost, and a full buy-out costs ${EN.eur(bsp.betrag)}. The higher pension pays this back after about ${EN.num(bsp.jahreBisAmortisiert, 1)} years. You first need a statement from the pension insurer, available from age 50, recording that you intend to retire early. You can pay until the standard retirement age, in instalments if you like; nothing is refunded.`,
    faqs: [
      { q: 'At what age can I start buying out a German pension reduction?', a: `The first step is a statement from the pension insurer on the buy-out amount. A legitimate interest in it is assumed from age ${P.ausgleich.ab_alter_auskunft}, and you declare that you intend to draw an old-age pension early. Payments are then possible until you reach the standard retirement age (section 187a SGB VI), in one sum or spread over several years.` },
      { q: 'Can I pay the buy-out in instalments?', a: `Yes, part payments are expressly allowed, and each one offsets the reduction in proportion. With 40 points and a start two years early, paying ${EN.eur(halb.betrag)} instead of ${EN.eur(bsp.betrag)} offsets roughly one year, so half the reduction. Amounts already paid are not refunded by the pension insurer, so plan the total before you start.` },
      { q: 'How long does a buy-out take to pay for itself?', a: `With 2026 values, about 20 years of pension, almost regardless of the number of points. One point costs ${EN.eur(bsp.proEP, 2)} and pays ${EN.eur(RW * 12, 2)} of pension a year, which is ${EN.num(jahreProPunkt, 1)} years. Dividing by the access factor stretches that to ${EN.num(lang.jahreBisAmortisiert, 1)} years for 48 months early. Tax and pension increases are left out.` },
      { q: 'Does a buy-out make sense if I will retire outside Germany?', a: 'Within the EU, the EEA and Switzerland the German pension is paid in full to your new country of residence under Regulation 883/2004, so the higher pension you bought follows you. What matters is whether you expect to draw it for around 20 years. For countries outside the EU the rules depend on the country; ask the German pension insurer first.' },
    ],
    body: (h) => `
<h2>What the calculator shows</h2>
<p>You enter two numbers: the pension points (Entgeltpunkte) you expect to have when your pension starts, and the months you want to go before your unreduced date. From these the tool works out the reduction (${h.pct(am)} a month under ${h.src('sgb6_77', 'section 77 SGB VI')}), the points and monthly amount lost, the price of a full buy-out and the years it takes the higher pension to earn that sum back. The price of a point is set by ${h.src('sgb6_187', 'section 187(3) SGB VI')}: contribution rate times average pay. For 2026 that is ${h.pct(RG.beitragssatz_rv)} and a provisional ${h.eur(RG.durchschnittsentgelt_2026_vorlaeufig)} (${h.src('drvRechengroessen', '2026 reference values')}), together ${h.eur(bsp.proEP, 2)}.</p>
<h2>Amounts for a full buy-out</h2>
${h.table(['Pension points', ...MON.map((m) => `${m} months (${h.pct(m * am)})`)], grid.map((r) => [h.num(r.ep), ...r.a.map((a) => h.eur(a.betrag))]), `2026 values, pension value ${h.eur(RW, 2)}`, ['l', 'r', 'r', 'r', 'r'])}
<p>The grid shows how much the early period matters. With 40 points, one year early costs ${h.eur(halb.betrag)} and four years ${h.eur(lang.betrag)}: more than four times as much, because the access factor falls each month and the divisor shrinks. The number of points, by contrast, works in a straight line: a quarter more points cost a quarter more.</p>
<h2>The calculation step by step</h2>
<p>Take someone expecting 40 pension points who wants to go 24 months early. The reduction is ${h.pct(24 * am)} and the access factor ${h.num(bsp.zf, 3)}. She loses ${h.num(bsp.epMinus, 2)} points, worth ${h.eur(bsp.renteMinus, 2)} a month. For exactly those points to arrive after the cut, she has to buy ${h.num(bsp.epMinus, 2)} ÷ ${h.num(bsp.zf, 3)} = ${h.num(bsp.epMinus / bsp.zf, 4)} points (${h.src('sgb6_187a', 'section 187a(3) SGB VI')}) at ${h.eur(bsp.proEP, 2)} each: ${h.eur(bsp.betrag)}. Her pension then starts two years early at the level it would have had without a reduction. Whether a reduction applies to you, and how large it is for your birthday, is shown by the ${h.a('abschlag-rechner', 'early retirement reduction calculator')}.</p>
<h2>Conditions and timing</h2>
<p>It starts with a specific statement from the pension insurer. You need a legitimate interest, presumed from age ${P.ausgleich.ab_alter_auskunft}, and must declare that you intend to draw an old-age pension early. Payment is possible until the standard retirement age, at once or in parts; the law makes no provision for refunds. Your current points are on your ${h.a('renteninformation', 'annual pension statement')}; the ${h.a('rentenrechner', 'pension calculator')} projects them to your start date. If you have also worked in another EU country, the buy-out concerns only the German pension, as each country pays its own share; see ${h.a('rente-ausland', 'pensions and moving abroad')}.</p>
<h2>Limits</h2>
<p>The tool uses only the 2026 reference values, which are set anew each year, so a payment in another year may come to a different amount. It assumes you reach the points you enter, and it ignores tax, pension increases and interest. Only the insurer’s statement gives a binding amount; for your own case, its advice centres (Auskunfts- und Beratungsstellen) are the place to ask.</p>`,
  },
});
