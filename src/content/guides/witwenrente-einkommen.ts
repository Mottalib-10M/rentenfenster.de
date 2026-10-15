import { defineGuide } from '../../lib/guide-types';
import { witwenrente, freibetrag, nettoEinkommen, EINKOMMEN_TYPEN, type EinkommenTyp } from '../../lib/engine/hinterbliebene';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Einkommensanrechnung auf die Witwenrente (§ 97 SGB VI, §§ 18a, 18b SGB IV): Freibetrag, Pauschalabzüge je Einkommensart,
 * kürzungsfreies Bruttoeinkommen, Beispiele mit einer Rente des Verstorbenen von 1.600 € (Annahme), große Witwenrente neues Recht.
 */
const W = P.witwe;
const RW = P.rentenwert.ab_2026_07;
const RW_ALT = P.rentenwert.bis_2026_06;
const fb = freibetrag(RW);
const fbAlt = freibetrag(RW_ALT);
const fbKind = W.kind_faktor * RW;
const fbReihe = [0, 1, 2, 3].map((k) => ({ k, f: freibetrag(RW, k) }));
/** Bruttoeinkommen, bis zu dem nichts angerechnet wird. */
const frei = (t: EinkommenTyp) => fb / (1 - W.abzug[t]);
/** Kürzung der Witwenrente je 100 € mehr Bruttoeinkommen über der Grenze. */
const je100 = (t: EinkommenTyp) => 100 * (1 - W.abzug[t]) * W.anrechnung;
const VERST = 1600;
const fall = (typ: EinkommenTyp, brutto: number, kinder = 0, gross = true) =>
  witwenrente({ renteVerstorbener: VERST, gross, altesRecht: false, einkommen: [{ typ, brutto }], kinder, rw: RW });
const fRente = fall('rente_ab_2011', 1400);
const fLohn = fall('arbeitsentgelt', 2500);
const fLohnKind = fall('arbeitsentgelt', 2500, 1);
const fPension = fall('pension_ab_2011', 2000);
const fKlein = fall('arbeitsentgelt', 2500, 0, false);
const fall0 = fall('arbeitsentgelt', 0);
/** Lohn, ab dem die große Witwenrente von 880 € vollständig ruht. */
const lohnVoll = (fall0.brutto / W.anrechnung + fb) / (1 - W.abzug.arbeitsentgelt);
const lohnFrei = frei('arbeitsentgelt');
const renteFrei = frei('rente_ab_2011');
const juliPlus = fb - fbAlt;

const NAMEN: Record<EinkommenTyp, { de: string; en: string }> = {
  arbeitsentgelt: { de: 'Arbeitslohn', en: 'Wages' },
  beamtenbezuege: { de: 'Beamtenbezüge (aktiv)', en: 'Civil servant’s salary' },
  arbeitseinkommen: { de: 'Gewinn aus selbstständiger Arbeit', en: 'Self-employed profit' },
  rente_ab_2011: { de: 'Eigene gesetzliche Rente, Beginn nach 2010', en: 'Own statutory pension, started after 2010' },
  rente_vor_2011: { de: 'Eigene gesetzliche Rente, Beginn vor 2011', en: 'Own statutory pension, started before 2011' },
  pension_ab_2011: { de: 'Beamtenpension, Beginn nach 2010', en: 'Civil service pension, started after 2010' },
  betriebsrente_ab_2011: { de: 'Betriebsrente (nachgelagert besteuert), Beginn nach 2010', en: 'Company pension taxed on payout, started after 2010' },
  private_rente: { de: 'Private Rente', en: 'Private pension' },
  vermoegen: { de: 'Vermögenserträge', en: 'Investment income' },
};

export default defineGuide({
  id: 'witwenrente-einkommen',
  group: 'familie',
  order: 210,
  mini: 'witweFrei',
  miniHref: 'witwenrente-rechner',
  related: ['witwenrente-rechner', 'grosse-witwenrente', 'em-hinzuverdienst', 'rente-ausland', 'rentenwert-2026', 'besteuerung-rente'],
  sources: ['sgb6_97', 'sgb4_18a', 'sgb4_18b', 'sgb6_46', 'sgb6_67', 'sgb6_77', 'sgb6_99', 'vo883'],
  de: {
    slug: 'witwenrente-einkommensanrechnung',
    nav: 'Witwenrente und Einkommen',
    card: `Freibetrag ${DE.eur(fb, 2)} netto, 40 % des Überschusses werden abgezogen: so wirkt eigenes Einkommen.`,
    title: 'Witwenrente Einkommensanrechnung 2026: Freibetrag, Abzug',
    description: `Witwenrente Einkommensanrechnung 2026: Freibetrag ${DE.eur(fb, 2)} netto, ${DE.pct(W.anrechnung, 0)} des Überschusses werden abgezogen. Pauschalabzüge je Einkommensart und Beispiele.`,
    h1: 'Witwenrente und eigenes Einkommen: die Anrechnung 2026',
    intro: 'Eigener Lohn oder eine eigene Rente kürzen die Witwenrente erst oberhalb eines Freibetrags und dann nur zu einem Teil. Wie viel, hängt an der Art des Einkommens.',
    resume: `Auf die Witwenrente wird eigenes Einkommen angerechnet, aber nur teilweise (§ 97 SGB VI). Zuerst wird das Bruttoeinkommen pauschal in ein Nettoeinkommen umgerechnet: Vom Arbeitslohn gehen ${DE.pct(W.abzug.arbeitsentgelt, 0)} ab, von einer eigenen gesetzlichen Rente mit Beginn nach 2010 ${DE.pct(W.abzug.rente_ab_2011, 0)} (§ 18b SGB IV). Von diesem Nettobetrag bleibt ein Freibetrag unberührt, der das ${DE.num(W.freibetrag_faktor, 1)}-fache des aktuellen Rentenwerts beträgt: seit Juli 2026 ${DE.eur(fb, 2)} im Monat, vorher ${DE.eur(fbAlt, 2)}. Für jedes Kind mit Anspruch auf Waisenrente kommen ${DE.eur(fbKind, 2)} hinzu. Vom Rest werden ${DE.pct(W.anrechnung, 0)} von der Witwenrente abgezogen. Ein Arbeitslohn bis ${DE.eur(lohnFrei, 2)} brutto oder eine eigene Rente bis ${DE.eur(renteFrei, 2)} kürzt also nichts. Beispiel: Die große Witwenrente aus 1.600 € beträgt ${DE.eur(fall0.brutto)}; mit 1.400 € eigener Rente bleiben ${DE.eur(fRente.zahlbetrag, 2)}, mit 2.500 € Lohn ${DE.eur(fLohn.zahlbetrag, 2)}. In den ersten drei Monaten nach dem Tod wird nichts angerechnet.`,
    faqs: [
      { q: 'Wie hoch ist der Freibetrag bei der Witwenrente 2026?', a: `Seit dem 1. Juli 2026 ${DE.eur(fb, 2)} Nettoeinkommen im Monat, das ${DE.num(W.freibetrag_faktor, 1)}-fache des Rentenwerts von ${DE.eur(RW, 2)}. Bis Ende Juni waren es ${DE.eur(fbAlt, 2)}. Für jedes Kind, das Anspruch auf Waisenrente hat, steigt der Freibetrag um ${DE.eur(fbKind, 2)}. Er gilt für das pauschal gekürzte Einkommen, nicht für das Brutto.` },
      { q: 'Wie viel darf ich neben der Witwenrente verdienen, ohne dass gekürzt wird?', a: `Als Arbeitnehmer bis ${DE.eur(lohnFrei, 2)} brutto im Monat, weil vom Lohn pauschal ${DE.pct(W.abzug.arbeitsentgelt, 0)} abgezogen werden und der Rest dann genau dem Freibetrag entspricht. Mit einem Kind, das Waisenrente bekommt, liegt die Grenze höher. Jeder Euro darüber kürzt die Witwenrente nur zum Teil: 100 € mehr Lohn kosten ${DE.eur(je100('arbeitsentgelt'), 2)} Witwenrente.` },
      { q: 'Wird meine eigene Altersrente auf die Witwenrente angerechnet?', a: `Ja, als Einkommen, nach einem Pauschalabzug von ${DE.pct(W.abzug.rente_ab_2011, 0)} bei Rentenbeginn nach 2010 und ${DE.pct(W.abzug.rente_vor_2011, 0)} bei Beginn vor 2011. Eine eigene Rente von 1.400 € zählt mit ${DE.eur(fRente.netto)}; über dem Freibetrag liegen ${DE.eur(fRente.ueber, 2)}, davon werden ${DE.eur(fRente.anrechnung, 2)} abgezogen. Die große Witwenrente von ${DE.eur(fall0.brutto)} sinkt auf ${DE.eur(fRente.zahlbetrag, 2)}.` },
      { q: 'Welche Einkünfte zählen bei der Witwenrente nicht?', a: 'Leistungen aus einem Riester-Vertrag nach § 10a EStG bleiben außen vor (§ 18a SGB IV). Außerdem wird in den ersten drei Monaten nach dem Tod, dem Sterbevierteljahr, gar kein Einkommen angerechnet; in dieser Zeit gibt es die volle Rente des Verstorbenen. Alle anderen Arten, vom Lohn bis zu Vermögenserträgen, zählen mit ihrem jeweiligen Pauschalabzug.' },
      { q: 'Kann die Witwenrente durch eigenes Einkommen ganz wegfallen?', a: `Ja, wenn ${DE.pct(W.anrechnung, 0)} des Überschusses so hoch sind wie die Witwenrente selbst. Bei einer großen Witwenrente von ${DE.eur(fall0.brutto)} ohne Kinder ist das ab einem Arbeitslohn von etwa ${DE.eur(lohnVoll)} brutto im Monat der Fall. Ab dieser Höhe wird nichts mehr ausgezahlt. Wie sich ein späterer Rückgang des Einkommens, etwa mit dem eigenen Ruhestand, auswirkt, klären die Auskunfts- und Beratungsstellen der Rentenversicherung.` },
      { q: 'Wirkt sich die Rentenerhöhung auf die Anrechnung aus?', a: `Ja, in zwei Richtungen. Der Freibetrag ist an den Rentenwert gekoppelt und stieg zum 1. Juli 2026 um ${DE.eur(juliPlus, 2)}; das allein senkt den Abzug um bis zu ${DE.eur(juliPlus * W.anrechnung, 2)}. Steigt zugleich Ihre eigene Rente, wächst das angerechnete Einkommen. Beides zusammen entscheidet, ob am Ende mehr oder weniger Witwenrente bleibt.` },
      { q: 'Wird die Witwenrente im EU-Ausland gekürzt?', a: 'Nicht wegen des Wohnorts. Nach der Verordnung (EG) Nr. 883/2004 darf eine deutsche Rente nicht gekürzt werden, weil Sie in einem anderen Mitgliedstaat der EU, des EWR oder in der Schweiz leben. Wie Einkommen aus dem Ausland in die Anrechnung eingeht, klären Sie am besten mit der Rentenversicherung; die Pauschalen auf dieser Seite sind die deutschen.' },
    ],
    body: (h) => `
<h2>Drei Schritte von Ihrem Einkommen zum Abzug</h2>
<p>Die Anrechnung folgt einem festen Schema aus ${h.src('sgb6_97', '§ 97 SGB VI')}. Erstens wird jedes Einkommen pauschal netto gerechnet; welche Abzüge gelten, regelt ${h.src('sgb4_18b', '§ 18b SGB IV')}. Zweitens wird vom Nettoeinkommen der Freibetrag abgezogen. Drittens werden ${h.pct(h.P.witwe.anrechnung, 0)} des Rests von der Witwenrente einbehalten. Welche Einkünfte überhaupt zählen, steht in ${h.src('sgb4_18a', '§ 18a SGB IV')}; Riester-Leistungen gehören nicht dazu.</p>
<p>Das Schema gilt für die große wie für die kleine Witwenrente. Bei der kleinen Witwenrente von ${h.eur(fKlein.brutto)} (Rente des Verstorbenen 1.600 €) und 2.500 € Lohn bleiben zum Beispiel ${h.eur(fKlein.zahlbetrag, 2)}, weil der Abzug von ${h.eur(fKlein.anrechnung, 2)} derselbe ist wie bei der großen. Welche der beiden Ihnen zusteht, klärt ${h.a('grosse-witwenrente', 'große oder kleine Witwenrente')}.</p>
<h2>Pauschalabzüge nach Einkommensart</h2>
${h.table(['Einkommen', 'Pauschalabzug', 'Kürzungsfrei bis brutto', 'Je 100 € darüber'], EINKOMMEN_TYPEN.map((t) => [NAMEN[t].de, h.pct(h.P.witwe.abzug[t], 1), h.eur(frei(t), 2), '−' + h.eur(je100(t), 2)]), `Freibetrag ${h.eur(fb, 2)}, ohne waisenrentenberechtigte Kinder, ab Juli 2026`, ['l', 'r', 'r', 'r'])}
<p>Die Spanne ist groß. Wer arbeitet, behält wegen des hohen Pauschalabzugs von ${h.pct(h.P.witwe.abzug.arbeitsentgelt, 0)} deutlich mehr Spielraum als jemand, der eine private Rente bezieht: Dort werden nur ${h.pct(h.P.witwe.abzug.private_rente, 1)} abgezogen, und schon ${h.eur(frei('private_rente'), 2)} genügen, um den Freibetrag auszuschöpfen. Bei mehreren Einkommen werden die Nettobeträge addiert; der Freibetrag gilt nur einmal.</p>
<h2>Freibetrag und Waisenrente</h2>
<p>Lebt ein Kind im Haushalt, das selbst Waisenrente bekommt, erhöht sich der Freibetrag um das ${h.num(h.P.witwe.kind_faktor, 1)}-fache des Rentenwerts.</p>
${h.table(['Kinder mit Waisenrente', 'Freibetrag netto im Monat', 'Lohn kürzungsfrei bis brutto'], fbReihe.map((r) => [h.num(r.k), h.eur(r.f, 2), h.eur(r.f / (1 - h.P.witwe.abzug.arbeitsentgelt), 2)]), 'Rentenwert ab 1. Juli 2026', ['r', 'r', 'r'])}
<p>Mit einem solchen Kind und 2.500 € Lohn sinkt der Abzug von ${h.eur(fLohn.anrechnung, 2)} auf ${h.eur(fLohnKind.anrechnung, 2)}; von der großen Witwenrente bleiben ${h.eur(fLohnKind.zahlbetrag, 2)} statt ${h.eur(fLohn.zahlbetrag, 2)}. Endet der Anspruch des Kindes auf Waisenrente, fällt der Zuschlag zum Freibetrag weg.</p>
<h2>Vier Fälle durchgerechnet</h2>
${h.table(['Fall', 'Brutto', 'Netto nach Pauschale', 'Abzug', 'Witwenrente'], [
  ['Eigene Rente seit 2011', h.eur(1400), h.eur(fRente.netto), h.eur(fRente.anrechnung, 2), h.eur(fRente.zahlbetrag, 2)],
  ['Arbeitslohn', h.eur(2500), h.eur(fLohn.netto), h.eur(fLohn.anrechnung, 2), h.eur(fLohn.zahlbetrag, 2)],
  ['Arbeitslohn, ein Kind mit Waisenrente', h.eur(2500), h.eur(fLohnKind.netto), h.eur(fLohnKind.anrechnung, 2), h.eur(fLohnKind.zahlbetrag, 2)],
  ['Beamtenpension seit 2011', h.eur(2000), h.eur(fPension.netto), h.eur(fPension.anrechnung, 2), h.eur(fPension.zahlbetrag, 2)],
], `Große Witwenrente aus einer Rente von 1.600 €, also ${h.eur(fall0.brutto)} vor Anrechnung`, ['l', 'r', 'r', 'r', 'r'])}
<p>Selbst bei 2.500 € Lohn bleibt der größte Teil der Witwenrente erhalten. Mit eigenen Zahlen, mehreren Kindern und der Wahl zwischen neuem und altem Recht rechnet der ${h.a('witwenrente-rechner', 'Witwenrentenrechner')}.</p>
<h2>Die ersten drei Monate und der Rentenbeginn</h2>
<p>Für die ersten drei Monate nach dem Tod zahlt die Rentenversicherung die volle Rente des Verstorbenen, ohne Anrechnung von Einkommen (${h.src('sgb6_67', '§ 67 SGB VI')}); bei 1.600 € also dreimal ${h.eur(fall0.sterbevierteljahr)}. Erst danach greifen der Rentenartfaktor und der Freibetrag. Hatte der Verstorbene seine Rente mit Abschlag begonnen, bleibt dieser Abschlag auch in der Witwenrente erhalten (${h.src('sgb6_77', '§ 77 Abs. 3 SGB VI')}). Die Witwenrente beginnt mit dem Monat, in dem die Voraussetzungen erfüllt sind, rückwirkend aber höchstens zwölf Monate vor dem Antrag (${h.src('sgb6_99', '§ 99 SGB VI')}).</p>
<h2>Wenn die Anrechnung alles nimmt</h2>
<p>Die Witwenrente ruht ganz, wenn ${h.pct(h.P.witwe.anrechnung, 0)} des Überschusses ihre Höhe erreichen. Bei ${h.eur(fall0.brutto)} großer Witwenrente ohne Kinder liegt diese Schwelle bei einem Arbeitslohn von etwa ${h.eur(lohnVoll)} brutto. Vorsicht beim Wechsel vom Lohn in die eigene Rente: Weil eine eigene Rente nur um ${h.pct(h.P.witwe.abzug.rente_ab_2011, 0)} gekürzt wird, zählt sie stärker als Lohn mit gleichem Brutto. Wer 1.800 € verdient, liegt knapp unter der Grenze für Lohn; eine eigene Rente von 1.800 € dagegen kostet ${h.eur(fall('rente_ab_2011', 1800).anrechnung, 2)} Witwenrente im Monat. Wer selbst erwerbsgemindert ist, findet die Grenzen für die eigene Rente unter ${h.a('em-hinzuverdienst', 'Hinzuverdienst bei Erwerbsminderungsrente')}.</p>`,
  },
  en: {
    slug: 'widows-pension-income-test',
    nav: 'Widow’s pension and income',
    card: `An allowance of ${EN.eur(fb, 2)} net, then 40% of the excess is deducted: how your own income counts.`,
    title: 'Widow’s pension income test 2026: allowance and deduction',
    description: `Widow’s pension income test 2026 in Germany: allowance of ${EN.eur(fb, 2)} net, ${EN.pct(W.anrechnung, 0)} of the excess is deducted. Flat deductions by type of income, with examples.`,
    h1: 'German widow’s pension and your own income in 2026',
    intro: 'Your own wages or pension only reduce a German widow’s pension above an allowance, and then only in part. How much depends on the kind of income.',
    resume: `Your own income is counted against a German widow’s pension (Witwenrente), but only in part (section 97 SGB VI). First the gross income is turned into a flat-rate net figure: wages lose ${EN.pct(W.abzug.arbeitsentgelt, 0)}, an own statutory pension starting after 2010 loses ${EN.pct(W.abzug.rente_ab_2011, 0)} (section 18b SGB IV). From that net figure an allowance (Freibetrag) of ${EN.num(W.freibetrag_faktor, 1)} times the current pension value is left untouched: ${EN.eur(fb, 2)} a month since July 2026, ${EN.eur(fbAlt, 2)} before. Each child entitled to an orphan’s pension adds ${EN.eur(fbKind, 2)}. Of whatever remains, ${EN.pct(W.anrechnung, 0)} is deducted from the widow’s pension. So wages up to ${EN.eur(lohnFrei, 2)} gross or an own pension up to ${EN.eur(renteFrei, 2)} reduce nothing. Example: the large widow’s pension from a €1,600 pension is ${EN.eur(fall0.brutto)}; with €1,400 of own pension ${EN.eur(fRente.zahlbetrag, 2)} is left, with €2,500 of wages ${EN.eur(fLohn.zahlbetrag, 2)}. Nothing is counted in the first three months after the death.`,
    faqs: [
      { q: 'What is the allowance for the German widow’s pension in 2026?', a: `Since 1 July 2026, ${EN.eur(fb, 2)} of net income a month, ${EN.num(W.freibetrag_faktor, 1)} times the pension value of ${EN.eur(RW, 2)}. Until the end of June it was ${EN.eur(fbAlt, 2)}. Each child entitled to an orphan’s pension adds ${EN.eur(fbKind, 2)}. The allowance applies to the income after the flat-rate deduction, not to the gross amount.` },
      { q: 'How much can I earn alongside a widow’s pension without a cut?', a: `As an employee, up to ${EN.eur(lohnFrei, 2)} gross a month: wages are reduced by a flat ${EN.pct(W.abzug.arbeitsentgelt, 0)}, and what remains then equals the allowance. With a child receiving an orphan’s pension the limit is higher. Every euro above it reduces the widow’s pension only in part: €100 more in wages costs ${EN.eur(je100('arbeitsentgelt'), 2)} of widow’s pension.` },
      { q: 'Does my own old-age pension count against the widow’s pension?', a: `Yes, as income, after a flat deduction of ${EN.pct(W.abzug.rente_ab_2011, 0)} if it started after 2010 and ${EN.pct(W.abzug.rente_vor_2011, 0)} if it started before 2011. An own pension of €1,400 counts as ${EN.eur(fRente.netto)}; ${EN.eur(fRente.ueber, 2)} is above the allowance and ${EN.eur(fRente.anrechnung, 2)} is deducted. The large widow’s pension of ${EN.eur(fall0.brutto)} falls to ${EN.eur(fRente.zahlbetrag, 2)}.` },
      { q: 'Which income is ignored in the widow’s pension test?', a: 'Payments from a Riester contract under section 10a of the Income Tax Act are left out (section 18a SGB IV). In addition, no income at all is counted in the first three months after the death, the so-called Sterbevierteljahr; during that time the full pension of the deceased is paid. Everything else, from wages to investment income, counts with its own flat deduction.' },
      { q: 'Can a widow’s pension stop completely because of my income?', a: `Yes, when ${EN.pct(W.anrechnung, 0)} of the excess is as high as the widow’s pension itself. For a large widow’s pension of ${EN.eur(fall0.brutto)} without children that happens from wages of about ${EN.eur(lohnVoll)} gross a month. From that point nothing is paid out. How a later fall in income, for instance when you retire yourself, affects the award is something the pension insurer’s advice centres can explain.` },
      { q: 'Does the annual pension increase change the income test?', a: `Yes, in two directions. The allowance is linked to the pension value and rose by ${EN.eur(juliPlus, 2)} on 1 July 2026, which alone cuts the deduction by up to ${EN.eur(juliPlus * W.anrechnung, 2)}. If your own pension rises at the same time, more income is counted. The two together decide whether more or less widow’s pension is left.` },
      { q: 'Is a German widow’s pension cut if I live in another EU country?', a: 'Not because of where you live. Under Regulation (EC) No 883/2004 a German pension may not be reduced because you live in another EU or EEA state or in Switzerland. How income earned abroad enters the income test is best clarified with the German pension insurer; the flat rates on this page are the German ones.' },
    ],
    body: (h) => `
<h2>Three steps from your income to the deduction</h2>
<p>The test follows a fixed pattern set out in ${h.src('sgb6_97', 'section 97 SGB VI')}. First, each kind of income is turned into a flat-rate net figure under ${h.src('sgb4_18b', 'section 18b SGB IV')}. Second, the allowance is subtracted from that net figure. Third, ${h.pct(h.P.witwe.anrechnung, 0)} of what is left is withheld from the widow’s pension. Which income counts at all is listed in ${h.src('sgb4_18a', 'section 18a SGB IV')}; Riester payments are not among it.</p>
<p>The pattern applies to the large and the small widow’s pension alike. With the small pension of ${h.eur(fKlein.brutto)} (deceased’s pension €1,600) and €2,500 of wages, ${h.eur(fKlein.zahlbetrag, 2)} is left, because the deduction of ${h.eur(fKlein.anrechnung, 2)} is the same as for the large one. Which of the two applies to you is explained under ${h.a('grosse-witwenrente', 'large or small widow’s pension')}.</p>
<h2>Flat deductions by type of income</h2>
${h.table(['Income', 'Flat deduction', 'No cut up to, gross', 'Per €100 above'], EINKOMMEN_TYPEN.map((t) => [NAMEN[t].en, h.pct(h.P.witwe.abzug[t], 1), h.eur(frei(t), 2), '−' + h.eur(je100(t), 2)]), `Allowance ${h.eur(fb, 2)}, no children with an orphan’s pension, from July 2026`, ['l', 'r', 'r', 'r'])}
<p>The range is wide. Because wages lose a flat ${h.pct(h.P.witwe.abzug.arbeitsentgelt, 0)}, someone in work keeps far more room than someone with a private pension, which loses only ${h.pct(h.P.witwe.abzug.private_rente, 1)}: ${h.eur(frei('private_rente'), 2)} of private pension already uses up the allowance. With several kinds of income the net amounts are added together, and the allowance applies only once.</p>
<h2>Allowance and orphan’s pension</h2>
<p>If a child entitled to an orphan’s pension lives with you, the allowance rises by ${h.num(h.P.witwe.kind_faktor, 1)} times the pension value.</p>
${h.table(['Children with orphan’s pension', 'Net allowance a month', 'Wages with no cut, gross'], fbReihe.map((r) => [h.num(r.k), h.eur(r.f, 2), h.eur(r.f / (1 - h.P.witwe.abzug.arbeitsentgelt), 2)]), 'Pension value from 1 July 2026', ['r', 'r', 'r'])}
<p>With one such child and €2,500 of wages the deduction drops from ${h.eur(fLohn.anrechnung, 2)} to ${h.eur(fLohnKind.anrechnung, 2)}, so ${h.eur(fLohnKind.zahlbetrag, 2)} of the large widow’s pension is left instead of ${h.eur(fLohn.zahlbetrag, 2)}. When the child’s entitlement ends, the extra allowance goes too.</p>
<h2>Four cases worked through</h2>
${h.table(['Case', 'Gross', 'Net after flat rate', 'Deduction', 'Widow’s pension'], [
  ['Own pension since 2011', h.eur(1400), h.eur(fRente.netto), h.eur(fRente.anrechnung, 2), h.eur(fRente.zahlbetrag, 2)],
  ['Wages', h.eur(2500), h.eur(fLohn.netto), h.eur(fLohn.anrechnung, 2), h.eur(fLohn.zahlbetrag, 2)],
  ['Wages, one child with orphan’s pension', h.eur(2500), h.eur(fLohnKind.netto), h.eur(fLohnKind.anrechnung, 2), h.eur(fLohnKind.zahlbetrag, 2)],
  ['Civil service pension since 2011', h.eur(2000), h.eur(fPension.netto), h.eur(fPension.anrechnung, 2), h.eur(fPension.zahlbetrag, 2)],
], `Large widow’s pension from a €1,600 pension, ${h.eur(fall0.brutto)} before the test`, ['l', 'r', 'r', 'r', 'r'])}
<p>Even with €2,500 of wages most of the widow’s pension survives. The ${h.a('witwenrente-rechner', 'widow’s pension calculator')} takes your own figures, several children and the choice between the new and the old rules.</p>
<h2>The first three months and the start date</h2>
<p>For the first three months after the death the full pension of the deceased is paid, with no income test (${h.src('sgb6_67', 'section 67 SGB VI')}); on €1,600 that is three payments of ${h.eur(fall0.sterbevierteljahr)}. Only then do the reduced rate and the allowance apply. If the deceased had started the pension early with a reduction, the reduction carries over into the widow’s pension (${h.src('sgb6_77', 'section 77(3) SGB VI')}). The widow’s pension starts in the month the conditions are met, but no more than twelve months before the application (${h.src('sgb6_99', 'section 99 SGB VI')}), so a late claim from abroad can lose money.</p>
<h2>When the test takes everything</h2>
<p>The widow’s pension stops being paid when ${h.pct(h.P.witwe.anrechnung, 0)} of the excess reaches its full amount. For a large widow’s pension of ${h.eur(fall0.brutto)} without children, that happens at wages of about ${h.eur(lohnVoll)} gross. Watch the switch from wages to your own pension: an own pension loses only ${h.pct(h.P.witwe.abzug.rente_ab_2011, 0)} under the flat rate, so it counts for more than wages of the same gross amount. Earning €1,800 keeps you just under the limit for wages, but an own pension of €1,800 costs ${h.eur(fall('rente_ab_2011', 1800).anrechnung, 2)} of widow’s pension a month. Under ${h.src('vo883', 'Regulation (EC) No 883/2004')} the pension itself is not reduced because you live in another EU state. If you are on a disability pension yourself, see ${h.a('em-hinzuverdienst', 'earnings with a disability pension')}.</p>`,
  },
});
