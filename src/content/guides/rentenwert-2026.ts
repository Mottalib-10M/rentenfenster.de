import { defineGuide } from '../../lib/guide-types';
import { nettoStandard, besteuerungsanteil, ausgleich } from '../../lib/engine/geld';
import { freibetrag } from '../../lib/engine/hinterbliebene';
import { P, DE, EN } from '../../lib/fmt';

/** Rentenanpassung 1. Juli 2026: Rentenwert alt und neu, Beispiele, Abzüge auf das Plus, Folgewirkungen. Kein Verlauf vor 2025. */
const RW = P.rentenwert.ab_2026_07;
const RWalt = P.rentenwert.bis_2026_06;
const ANP = P.rentenwert.anpassung_2026;
const f = RW / RWalt;
const reihe = [900, 1200, 1500, 2000, 2500].map((r) => ({ r, neu: r * f, plus: r * (f - 1) }));
const p1000 = 1000 * (f - 1);
const p1500 = 1500 * (f - 1);
const std = nettoStandard(1500);
const abzugSatz = std.kvSatz + std.pvSatz;
const plusNetto1500 = p1500 * (1 - abzugSatz);
const frAlt = freibetrag(RWalt), frNeu = freibetrag(RW);
const frAlt1 = freibetrag(RWalt, 1), frNeu1 = freibetrag(RW, 1);
const KI = P.kindererziehung;
const kiEP = KI.ep_monat * KI.ab_1992_monate;
const preis = ausgleich(1, 0, RW).proEP;
const amortAlt = preis / (RWalt * 12), amortNeu = preis / (RW * 12);
const anteil20 = besteuerungsanteil(2020);
const R = P.reform;

export default defineGuide({
  id: 'rentenwert-2026',
  group: 'hoehe',
  order: 125,
  mini: 'rentenwertPlus',
  miniHref: 'rentenrechner-brutto-netto',
  related: ['entgeltpunkte', 'renteninformation', 'rentenrechner-brutto-netto', 'witwenrente-einkommen', 'besteuerung-rente', 'rentenreform'],
  sources: ['drvWerte', 'bmasAnpassung', 'sgb6_64', 'sgb6_66', 'sgb6_97', 'estg_22', 'vo883', 'bmasKommission'],
  de: {
    slug: 'rentenwert-rentenerhoehung',
    nav: 'Rentenerhöhung 2026',
    card: `Seit 1. Juli 2026 ist ein Rentenpunkt ${DE.eur(RW, 2)} wert: ${DE.pct(ANP, 2)} mehr. Was davon netto ankommt.`,
    title: `Rentenerhöhung 2026: ${DE.pct(ANP, 2)} mehr, Rentenwert ${DE.eur(RW, 2)}`,
    description: `Rentenerhöhung 2026: Seit 1. Juli steigt der aktuelle Rentenwert von ${DE.eur(RWalt, 2)} auf ${DE.eur(RW, 2)}. Was das für Ihre Rente netto, die Steuer und die Witwenrente heißt.`,
    h1: 'Rentenerhöhung zum 1. Juli 2026: der neue Rentenwert',
    intro: `Jeder Rentenpunkt zahlt seit Juli ${DE.eur(RW - RWalt, 2)} mehr im Monat. Was das für Ihren Betrag bedeutet und was nach Beiträgen und Steuer übrig bleibt, rechnet diese Seite.`,
    resume: `Zum 1. Juli 2026 sind die gesetzlichen Renten in Deutschland um ${DE.pct(ANP, 2)} gestiegen. Der aktuelle Rentenwert, also der Monatsbetrag für einen Entgeltpunkt, liegt seitdem bei ${DE.eur(RW, 2)}; bis Juni waren es ${DE.eur(RWalt, 2)} (vom Bundeskabinett am 29. April 2026 beschlossen). Weil jede Rente aus Entgeltpunkten mal Rentenwert berechnet wird (§ 64 SGB VI), steigt jede laufende Altersrente, Erwerbsminderungsrente und Witwenrente im selben Verhältnis, ohne Antrag. Aus 1.000 € werden ${DE.eur(1000 + p1000, 2)}, aus 1.500 € werden ${DE.eur(1500 + p1500, 2)}. Vom Plus gehen Kranken- und Pflegebeitrag ab, im Standardfall ${DE.pct(abzugSatz, 2)}. Für alle, die schon vor 2025 in Rente waren, ist die Erhöhung in voller Höhe steuerpflichtig, weil ihr steuerfreier Rentenanteil als fester Eurobetrag eingefroren ist. Auch Freibeträge, die am Rentenwert hängen, wachsen mit: Der Freibetrag bei der Witwenrente stieg von ${DE.eur(frAlt, 2)} auf ${DE.eur(frNeu, 2)}.`,
    faqs: [
      { q: 'Um wie viel Euro steigt meine Rente im Juli 2026?', a: `Um ${DE.pct(ANP, 2)} des bisherigen Bruttobetrags. Bei 900 € sind das ${DE.eur(900 * (f - 1), 2)}, bei 1.500 € ${DE.eur(p1500, 2)}, bei 2.000 € ${DE.eur(2000 * (f - 1), 2)} im Monat. Rechnen Sie mit Ihrem Betrag aus dem letzten Rentenbescheid oder der Kontoauszugszeile vor Juli. Netto kommt etwas weniger an, weil auf das Plus Kranken- und Pflegebeitrag fällig werden.` },
      { q: 'Ist die Rentenerhöhung 2026 voll steuerpflichtig?', a: `Für alle, deren Rente vor 2025 begonnen hat, ja. Der steuerfreie Teil wurde im Jahr nach dem Rentenbeginn als Eurobetrag festgeschrieben (§ 22 EStG), jede spätere Anpassung kommt vollständig zum steuerpflichtigen Teil hinzu. Bei 1.500 € Rente sind das ${DE.eur(p1500 * 12, 2)} mehr steuerpflichtige Einkünfte im Jahr. Ob tatsächlich Steuer anfällt, hängt am gesamten Einkommen und am Grundfreibetrag.` },
      { q: `Warum rechnet meine Renteninformation noch mit ${DE.eur(RWalt, 2)}?`, a: `Weil sie vor dem 1. Juli 2026 erstellt wurde. Bis Juni galt ein Rentenwert von ${DE.eur(RWalt, 2)}, und alle Beträge darin beruhen auf diesem Wert. Teilen Sie die angegebene Rente durch ${DE.eur(RWalt, 2)}, erhalten Sie Ihre Entgeltpunkte; mal ${DE.eur(RW, 2)} ergibt den Wert nach der Erhöhung. Der Mini-Rechner der Seite zur Renteninformation macht genau das.` },
      { q: 'Wächst durch die Rentenerhöhung der Freibetrag bei der Witwenrente?', a: `Ja, denn er beträgt das ${DE.num(P.witwe.freibetrag_faktor, 1)}-Fache des Rentenwerts (§ 97 SGB VI). Seit Juli 2026 sind das ${DE.eur(frNeu, 2)} statt ${DE.eur(frAlt, 2)} Nettoeinkommen im Monat, mit einem waisenrentenberechtigten Kind ${DE.eur(frNeu1, 2)}. Wer eigenes Einkommen knapp über dem alten Freibetrag hat, bekommt dadurch mehr Witwenrente ausgezahlt, zusätzlich zur Erhöhung der Witwenrente selbst.` },
      { q: 'Wann steigt die Rente das nächste Mal?', a: 'Der Rentenwert wird jeweils zum 1. Juli neu festgesetzt; der heutige Wert gilt bis Ende Juni 2027. Wie hoch die nächste Anpassung ausfällt, steht noch nicht fest. Die Alterssicherungskommission hat 2026 Vorschläge zur künftigen Anpassungsformel gemacht, beschlossen ist davon nichts. Belastbare Zahlen gibt es erst, wenn die Bundesregierung den neuen Wert festlegt.' },
      { q: 'Bekomme ich die Rentenerhöhung auch, wenn ich in Spanien lebe?', a: 'Ja. Die Rente wird aus denselben Entgeltpunkten mit demselben Rentenwert berechnet, egal wo Sie wohnen. Innerhalb der EU, des EWR und in der Schweiz verbietet die Verordnung 883/2004 Kürzungen wegen des Wohnorts. Für Rentner in anderen Staaten hängt die Zahlung vom Land und einem möglichen Abkommen ab; hier hilft die Deutsche Rentenversicherung im Einzelfall.' },
    ],
    body: (h) => `
<h2>Was am 1. Juli 2026 geändert wurde</h2>
<p>Geändert hat sich eine einzige Zahl: der aktuelle Rentenwert, von ${h.eur(RWalt, 2)} auf ${h.eur(RW, 2)} (${h.src('drvWerte', 'Werte der Rentenversicherung')}; ${h.src('bmasAnpassung', 'Kabinettsbeschluss vom 29. April 2026')}). Er gibt an, wie viel Monatsrente ein Entgeltpunkt bringt. Da die Rentenformel jede Rente als Produkt aus Punkten, Zugangsfaktor, Rentenartfaktor und Rentenwert bildet (${h.src('sgb6_64', '§ 64 SGB VI')}), wirkt die neue Zahl auf alle laufenden Renten gleich: ${h.pct(ANP, 2)} mehr, ein Abschlag oder ein Witwenfaktor bleibt im Verhältnis erhalten. Einen Antrag braucht es nicht. Wie die Punkte selbst entstehen, erklärt ${h.a('entgeltpunkte', 'Entgeltpunkte berechnen')}.</p>
${h.table(['Rente bis Juni 2026', 'Rente ab Juli 2026', 'Mehr im Monat', 'Mehr bis Juni 2027'], reihe.map(({ r, neu, plus }) => [h.eur(r, 2), h.eur(neu, 2), h.eur(plus, 2), h.eur(plus * 12, 2)]), 'Bruttobeträge, Anpassung um den Faktor neuer durch alter Rentenwert', ['r', 'r', 'r', 'r'])}
<p>Die Tabelle rechnet mit dem genauen Verhältnis der beiden Rentenwerte, ${h.num(f, 4)}. Wer einen Abschlag hat, bekommt dieselbe prozentuale Erhöhung auf den gekürzten Betrag; der Abschlag selbst wird durch die Anpassung weder größer noch kleiner.</p>
<h2>Was vom Plus netto ankommt</h2>
<p>Die Erhöhung ist Rente wie jede andere, also werden darauf dieselben Beiträge fällig. Bei durchschnittlichem Zusatzbeitrag und mit Kindern tragen Sie ${h.pct(std.kvSatz, 2)} Krankenversicherung und ${h.pct(std.pvSatz, 1)} Pflegeversicherung, zusammen ${h.pct(abzugSatz, 2)}. Von ${h.eur(p1500, 2)} Plus bei 1.500 € bleiben vor Steuer ${h.eur(plusNetto1500, 2)}. Kinderlose zahlen in der Pflege ${h.pct(P.pv.kinderlos_zuschlag, 1)} mehr. Den genauen Nettobetrag Ihrer Rente nach der Erhöhung rechnet der ${h.a('rentenrechner-brutto-netto', 'Rentenrechner brutto netto')}.</p>
<h2>Die Steuer frisst bei Bestandsrenten mit</h2>
<p>Wer 2020 in Rente ging, versteuert nominal ${h.pct(anteil20, 0)} seiner Rente. Tatsächlich ist es mehr, denn der steuerfreie Teil wurde im Folgejahr als fester Eurobetrag eingefroren (${h.src('estg_22', '§ 22 EStG')}). Jede Anpassung seither, auch die von Juli 2026, erhöht nur den steuerpflichtigen Teil. Bei 1.500 € Rente wächst dieser um ${h.eur(p1500 * 12, 2)} im Jahr. Das allein löst keine Steuer aus; zusammen mit einer Betriebsrente oder Mieteinnahmen kann es aber die Grenze überschreiten, ab der Einkommensteuer fällig wird. Die Rentenversicherung behält keine Steuer ein, sie wird mit der Erklärung festgesetzt. Die Prozentsätze je Startjahr stehen unter ${h.a('besteuerung-rente', 'Besteuerung der Rente')}.</p>
<h2>Was der neue Rentenwert sonst noch verschiebt</h2>
<p>Bei der Witwen- und Witwerrente hängt der Freibetrag für eigenes Einkommen am Rentenwert: das ${h.num(P.witwe.freibetrag_faktor, 1)}-Fache, dazu das ${h.num(P.witwe.kind_faktor, 1)}-Fache je Kind mit Anspruch auf Waisenrente (${h.src('sgb6_97', '§ 97 SGB VI')}).</p>
${h.table(['Freibetrag Witwenrente', 'Bis Juni 2026', 'Ab Juli 2026'], [
      ['Ohne Kind', h.eur(frAlt, 2), h.eur(frNeu, 2)],
      ['Mit einem waisenrentenberechtigten Kind', h.eur(frAlt1, 2), h.eur(frNeu1, 2)],
    ], 'Nettoeinkommen im Monat, das nicht angerechnet wird', ['l', 'r', 'r'])}
<p>Wer eigenes Einkommen hat, profitiert doppelt: Die Witwenrente steigt um ${h.pct(ANP, 2)}, und vom Einkommen wird weniger angerechnet. Den Effekt für Ihre Zahlen zeigt ${h.a('witwenrente-einkommen', 'Einkommensanrechnung bei der Witwenrente')}.</p>
<p>Auch Kindererziehungszeiten sind Entgeltpunkte. Drei Jahre für ein ab 1992 geborenes Kind, ${h.num(kiEP, 2)} Punkte, zahlen jetzt ${h.eur(kiEP * RW, 2)} statt ${h.eur(kiEP * RWalt, 2)} im Monat. Wer einen Abschlag durch eine Sonderzahlung ausgleichen will, zahlt 2026 für einen Punkt ${h.eur(preis, 2)}; dieser Preis hängt am Durchschnittsentgelt, nicht am Rentenwert. Mit dem höheren Rentenwert ist ein gekaufter Punkt rechnerisch nach ${h.num(amortNeu, 1)} statt ${h.num(amortAlt, 1)} Rentenjahren wieder eingespielt, ohne Steuer und Beiträge gerechnet.</p>
<h2>Juli: auch der Monat für neue Punkte</h2>
<p>Wer neben der Altersrente beschäftigt ist und Beiträge zahlt, bekommt die daraus entstandenen Entgeltpunkte nicht sofort, sondern jeweils zum 1. Juli des Folgejahres auf die Rente aufgeschlagen (${h.src('sgb6_66', '§ 66 Abs. 3a SGB VI')}). Im Juli treffen damit zwei Erhöhungen zusammen: die allgemeine Anpassung und der persönliche Zuschlag aus dem Vorjahr. Wie das beim Weiterarbeiten aussieht, steht unter ${h.a('hinzuverdienst', 'Hinzuverdienst zur Rente')}.</p>
<h2>Renteninformation und Bescheide mit dem alten Wert</h2>
<p>Schreiben der Rentenversicherung aus dem ersten Halbjahr 2026 rechnen noch mit ${h.eur(RWalt, 2)}. Die Beträge darin sind deshalb nicht falsch, sondern auf altem Stand: Rechnen Sie sie mit dem Faktor ${h.num(f, 4)} hoch, oder teilen Sie durch den alten Wert, um Ihre Punkte zu erhalten. Wie das Schreiben aufgebaut ist, zeigt ${h.a('renteninformation', 'Renteninformation lesen')}.</p>
<h2>Was die Reformdebatte für künftige Erhöhungen bedeutet</h2>
<p>Die Alterssicherungskommission hat in ihrem Bericht vom 23. Juni 2026 vorgeschlagen, die Haltelinie beim Rentenniveau von ${h.pct(R.haltelinie, 0)} bis ${R.haltelinie_bis} zu halten und danach den Nachhaltigkeitsfaktor wieder wirken zu lassen (${h.src('bmasKommission', 'BMAS, 33 Empfehlungen')}). Das wäre ein Vorschlag für Anpassungen nach ${R.haltelinie_bis}, kein geltendes Recht; ein Gesetzentwurf liegt nicht vor. Für die Anpassung im Juli 2027 lässt sich daraus keine Zahl ableiten. Den Stand der Diskussion fasst ${h.a('rentenreform', 'Rentenreform')} zusammen.</p>`,
  },
  en: {
    slug: 'german-pension-value',
    nav: 'Pension increase 2026',
    card: `Since 1 July 2026 one German pension point pays ${EN.eur(RW, 2)}: ${EN.pct(ANP, 2)} more. What reaches you net.`,
    title: `Pension Increase 2026: Rentenwert Up ${EN.pct(ANP, 2)} to ${EN.eur(RW, 2)}`,
    description: `Pension increase 2026: from 1 July Germany’s current pension value rose from ${EN.eur(RWalt, 2)} to ${EN.eur(RW, 2)}. What it means net, for tax, abroad and for widows and widowers.`,
    h1: 'The July 2026 pension increase: Germany’s new pension value',
    intro: `Each pension point has paid ${EN.eur(RW - RWalt, 2)} more a month since July. See what that means for your amount, and what is left after contributions and tax, including if you live abroad.`,
    resume: `On 1 July 2026 German statutory pensions rose by ${EN.pct(ANP, 2)}. The current pension value (aktueller Rentenwert), the monthly amount paid per pension point, has been ${EN.eur(RW, 2)} since then; until June it was ${EN.eur(RWalt, 2)}, as approved by the federal cabinet on 29 April 2026. Because every pension is calculated as points times pension value (section 64 SGB VI), every pension in payment, whether old-age, disability or survivor’s, rises in the same proportion without any application. €1,000 becomes ${EN.eur(1000 + p1000, 2)}; €1,500 becomes ${EN.eur(1500 + p1500, 2)}. Health and long-term care contributions come off the increase, ${EN.pct(abzugSatz, 2)} in the standard case. For anyone who retired before 2025 the full increase is taxable, because their tax-free share was frozen as a fixed euro amount. Allowances tied to the pension value grow too: the income allowance on a widow’s pension went from ${EN.eur(frAlt, 2)} to ${EN.eur(frNeu, 2)}. Pensioners living elsewhere in the EU receive the same increase.`,
    faqs: [
      { q: 'How much more will my German pension pay from July 2026?', a: `${EN.pct(ANP, 2)} of your previous gross amount. On €900 that is ${EN.eur(900 * (f - 1), 2)}, on €1,500 ${EN.eur(p1500, 2)}, on €2,000 ${EN.eur(2000 * (f - 1), 2)} a month. Use the gross figure from your last pension notice or a payment from before July. The net gain is slightly smaller, since health and care contributions are charged on the extra amount as well.` },
      { q: 'Do I pay German tax on the whole pension increase?', a: `If your pension started before 2025, yes. The tax-free part was fixed in euros in the year after your pension began (section 22 EStG), and every later increase is added in full to the taxable part. On a €1,500 pension that means ${EN.eur(p1500 * 12, 2)} more taxable income a year. Whether tax is actually due depends on your total income and the basic allowance.` },
      { q: 'Does the increase reach my pension if I live in Portugal or Ireland?', a: 'Yes. Your pension is calculated from the same points and the same pension value wherever you live. Within the EU, the EEA and Switzerland, Regulation 883/2004 rules out any reduction because you live in another member state. If you live elsewhere, whether and how the pension is paid depends on the country and any agreement; ask the German pension insurer about your case.' },
      { q: `My pension statement still shows ${EN.eur(RWalt, 2)} per point. Is it wrong?`, a: `No, it is just dated. Statements issued before 1 July 2026 use the old value of ${EN.eur(RWalt, 2)}. Divide the pension shown by ${EN.eur(RWalt, 2)} to get your points, then multiply by ${EN.eur(RW, 2)} for the current value. The mini calculator on our page about reading the statement does exactly that conversion for you.` },
      { q: 'Does the widow’s pension allowance rise with the pension value?', a: `Yes, it is ${EN.num(P.witwe.freibetrag_faktor, 1)} times the pension value (section 97 SGB VI). Since July 2026 that is ${EN.eur(frNeu, 2)} of net monthly income instead of ${EN.eur(frAlt, 2)}, or ${EN.eur(frNeu1, 2)} with one child entitled to an orphan’s pension. A survivor with earnings just above the old allowance therefore keeps more of the widow’s pension, on top of the increase in the pension itself.` },
      { q: 'When is the next German pension increase?', a: 'The pension value is reset every 1 July; the current one applies until the end of June 2027. The size of the next increase is not yet known. The pension commission made proposals in 2026 about how future increases should be calculated, but none has been enacted. Reliable figures only exist once the federal government sets the new value.' },
    ],
    body: (h) => `
<h2>What changed on 1 July 2026</h2>
<p>One number changed: the current pension value, from ${h.eur(RWalt, 2)} to ${h.eur(RW, 2)} (${h.src('drvWerte', 'German Pension Insurance key values')}; ${h.src('bmasAnpassung', 'cabinet decision of 29 April 2026')}). It states how much monthly pension one point (Entgeltpunkt) pays. Since the formula builds every pension from points, access factor, pension type factor and pension value (${h.src('sgb6_64', 'section 64 SGB VI')}), the new figure lifts all pensions in payment equally: ${h.pct(ANP, 2)} more, with any reduction or survivor factor kept in proportion. No application is needed. How points are earned in the first place is explained under ${h.a('entgeltpunkte', 'pension points explained')}.</p>
${h.table(['Pension until June 2026', 'Pension from July 2026', 'More a month', 'More until June 2027'], reihe.map(({ r, neu, plus }) => [h.eur(r, 2), h.eur(neu, 2), h.eur(plus, 2), h.eur(plus * 12, 2)]), 'Gross amounts, scaled by new over old pension value', ['r', 'r', 'r', 'r'])}
<p>The table applies the exact ratio between the two values, ${h.num(f, 4)}. If your pension carries an early-retirement reduction, the same percentage is added to the reduced amount; the reduction itself neither grows nor shrinks.</p>
<h2>What reaches you net</h2>
<p>The increase is pension like any other, so the same contributions apply. With the average extra rate (Zusatzbeitrag) and children, you pay ${h.pct(std.kvSatz, 2)} for health insurance and ${h.pct(std.pvSatz, 1)} for long-term care, ${h.pct(abzugSatz, 2)} together. Of the ${h.eur(p1500, 2)} extra on €1,500, ${h.eur(plusNetto1500, 2)} remains before tax. Without children, care costs ${h.pct(P.pv.kinderlos_zuschlag, 1)} more. The ${h.a('rentenrechner-brutto-netto', 'net pension calculator')} works out your exact net amount after the increase.</p>
<h2>Tax takes a share of older pensions’ increases</h2>
<p>If you retired in 2020, nominally ${h.pct(anteil20, 0)} of your pension is taxable. In practice it is more, because the tax-free part was frozen as a fixed euro amount the following year (${h.src('estg_22', 'section 22 EStG')}). Every increase since then, July 2026 included, adds only to the taxable part. On €1,500 that part grows by ${h.eur(p1500 * 12, 2)} a year. On its own that need not trigger tax, but combined with an occupational pension or rental income it can push you over the threshold. The pension insurer does not withhold income tax; it is assessed through your return. The rates by start year are on ${h.a('besteuerung-rente', 'taxation of German pensions')}.</p>
<h2>What else the new value moves</h2>
<p>On a widow’s or widower’s pension, the allowance for the survivor’s own income is tied to the pension value: ${h.num(P.witwe.freibetrag_faktor, 1)} times the value, plus ${h.num(P.witwe.kind_faktor, 1)} times for each child entitled to an orphan’s pension (${h.src('sgb6_97', 'section 97 SGB VI')}).</p>
${h.table(['Widow’s pension allowance', 'Until June 2026', 'From July 2026'], [
      ['No child', h.eur(frAlt, 2), h.eur(frNeu, 2)],
      ['One child entitled to an orphan’s pension', h.eur(frAlt1, 2), h.eur(frNeu1, 2)],
    ], 'Net monthly income not offset against the pension', ['l', 'r', 'r'])}
<p>A survivor with income of their own gains twice: the widow’s pension rises by ${h.pct(ANP, 2)}, and less income is offset. ${h.a('witwenrente-einkommen', 'Widow’s pension income test')} shows the effect with your figures.</p>
<p>Child-raising credits are points too. Three years for a child born from 1992, ${h.num(kiEP, 2)} points, now pay ${h.eur(kiEP * RW, 2)} a month instead of ${h.eur(kiEP * RWalt, 2)}. If you plan to offset an early-retirement reduction with a special payment, one point costs ${h.eur(preis, 2)} in 2026; that price follows average earnings, not the pension value. With the higher value, a bought point pays for itself after ${h.num(amortNeu, 1)} years of pension instead of ${h.num(amortAlt, 1)}, before tax and contributions.</p>
<h2>July is also when new points arrive</h2>
<p>If you work in employment alongside an old-age pension and contributions are paid, the points from that work are added to your pension each 1 July of the following year (${h.src('sgb6_66', 'section 66(3a) SGB VI')}). So two increases land in July: the general adjustment and your personal top-up from the previous year. See ${h.a('hinzuverdienst', 'working while drawing a pension')}.</p>
<h2>Statements and notices with the old value</h2>
<p>Letters from the pension insurer dated in the first half of 2026 still use ${h.eur(RWalt, 2)}. Their figures are not wrong, just out of date: scale them up by ${h.num(f, 4)}, or divide by the old value to get your points. The layout of the letter is explained in ${h.a('renteninformation', 'reading your pension statement')}.</p>
<h2>Within the EU, the same pension wherever you live</h2>
<p>Under ${h.src('vo883', 'Regulation 883/2004')}, a German pension may not be reduced because you live in another EU or EEA state or in Switzerland. The July increase therefore reaches a retiree in Lisbon exactly as it reaches one in Leipzig. Outside that area, payment rules depend on the country and on any social security agreement; ${h.a('rente-ausland', 'German pension abroad')} covers what can be said in general.</p>
<h2>What the reform debate means for future increases</h2>
<p>In its report of 23 June 2026 the pension commission proposed keeping the ${h.pct(R.haltelinie, 0)} floor on the benefit level until ${R.haltelinie_bis} and then letting the sustainability factor (Nachhaltigkeitsfaktor) work again (${h.src('bmasKommission', 'Federal Labour Ministry, 33 recommendations')}). That is a proposal for increases after ${R.haltelinie_bis}, not law in force, and no draft bill exists. It yields no figure for July 2027. The state of play is on ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
