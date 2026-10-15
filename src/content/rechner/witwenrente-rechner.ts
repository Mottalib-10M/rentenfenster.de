import { defineGuide } from '../../lib/guide-types';
import { witwenrente, freibetrag, grossAlter, type WitweEingabe } from '../../lib/engine/hinterbliebene';
import { P, DE, EN } from '../../lib/fmt';

/** Witwenrente berechnen: Rente des Verstorbenen 1.500 € (ohne Abschlag), verschiedene eigene Einkommen, Rentenwert ab 1.7.2026. */
const RW = P.rentenwert.ab_2026_07;
const W = P.witwe;
const basis: WitweEingabe = { renteVerstorbener: 1500, gross: true, altesRecht: false, einkommen: [{ typ: 'rente_ab_2011', brutto: 1200 }], kinder: 0, rw: RW };
const w = (o: Partial<WitweEingabe> = {}) => witwenrente({ ...basis, ...o });
const std = w();
const klein = w({ gross: false });
const alt = w({ altesRecht: true });
const lohn = w({ einkommen: [{ typ: 'arbeitsentgelt', brutto: 2500 }] });
const lohnKind = w({ einkommen: [{ typ: 'arbeitsentgelt', brutto: 2500 }], kinder: 1 });
const hoch = w({ renteVerstorbener: 2000, einkommen: [{ typ: 'rente_ab_2011', brutto: 1600 }] });
const frei = freibetrag(RW);
const freiAlt = freibetrag(P.rentenwert.bis_2026_06);
const freiKind = freibetrag(RW, 1);
/** Bruttoeinkommen, bis zu dem nichts angerechnet wird (Freibetrag geteilt durch den Anteil nach der Pauschalkürzung). */
const schwelleRente = frei / (1 - W.abzug.rente_ab_2011);
const schwelleLohn = frei / (1 - W.abzug.arbeitsentgelt);
const ga = grossAlter(2026);

export default defineGuide({
  id: 'witwenrente-rechner',
  group: 'familie',
  order: 200,
  tool: 'witwe',
  related: ['witwenrente-einkommen', 'grosse-witwenrente', 'rente-steuer-rechner', 'rentenwert-2026', 'erwerbsminderungsrente', 'rentenrechner'],
  sources: ['sgb6_46', 'sgb6_67', 'sgb6_97', 'sgb6_242a', 'sgb6_255', 'sgb6_77', 'sgb4_18b', 'drvWerte'],
  de: {
    slug: 'witwenrente-berechnen',
    nav: 'Witwenrente berechnen',
    card: 'Große oder kleine Witwenrente, Sterbevierteljahr und Kürzung durch eigenes Einkommen, mit dem Freibetrag ab Juli 2026.',
    title: 'Witwenrente berechnen 2026: Höhe nach Einkommensanrechnung',
    description: `Witwenrente berechnen 2026: große oder kleine Witwenrente, drei volle Monate Sterbevierteljahr, Freibetrag ${DE.num(W.freibetrag_faktor, 1)} Rentenwerte, Anrechnung von ${DE.pct(W.anrechnung)} des Einkommens.`,
    h1: 'Witwenrente berechnen: was nach der Anrechnung bleibt',
    intro: 'Rente des verstorbenen Partners, Art der Witwenrente und Ihr eigenes Einkommen eingeben: Der Rechner zeigt den Zahlbetrag ab dem vierten Monat.',
    resume: `Die Witwenrente aus der gesetzlichen Rentenversicherung wird in drei Schritten berechnet. In den ersten drei Monaten nach dem Tod, dem Sterbevierteljahr, wird die volle Rente des Verstorbenen gezahlt, ohne Blick auf Ihr Einkommen. Danach beträgt die große Witwenrente ${DE.pct(W.gross_faktor)} dieser Rente, nach altem Recht ${DE.pct(W.gross_faktor_alt)}, die kleine ${DE.pct(W.klein_faktor)} für höchstens ${DE.num(W.klein_monate)} Monate. Zuletzt wird eigenes Einkommen angerechnet: Es wird pauschal gekürzt, ein Freibetrag von ${DE.eur(frei, 2)} im Monat bleibt frei (seit 1. Juli 2026, vorher ${DE.eur(freiAlt, 2)}), und ${DE.pct(W.anrechnung)} des Rests mindern die Witwenrente. Beispiel aus dem Rechner: Bei 1.500 € Rente des Verstorbenen und 1.200 € eigener Rente bleibt die große Witwenrente ungekürzt bei ${DE.eur(std.zahlbetrag)}. Verdient die Witwe dagegen 2.500 € brutto im Job, werden ${DE.eur(lohn.anrechnung, 2)} angerechnet, und es bleiben ${DE.eur(lohn.zahlbetrag, 2)}. Alle Beträge sind brutto, vor Kranken- und Pflegebeitrag.`,
    faqs: [
      { q: 'Wie viel Witwenrente bleibt von 1.500 € Rente des verstorbenen Partners?', a: `Drei Monate lang die vollen 1.500 €. Danach als große Witwenrente ${DE.eur(std.brutto)}, nach altem Recht ${DE.eur(alt.brutto)}, als kleine ${DE.eur(klein.brutto)}. Ob davon etwas abgeht, hängt an Ihrem Einkommen: Eine eigene Rente von 1.200 € liegt nach der Pauschalkürzung unter dem Freibetrag, Arbeitslohn von 2.500 € dagegen nicht.` },
      { q: 'Bis zu welchem eigenen Einkommen wird die Witwenrente nicht gekürzt?', a: `Maßgeblich ist das pauschal gekürzte Netto, nicht der Bruttobetrag. Bei einer eigenen Rente mit Beginn ab 2011 bleibt bis etwa ${DE.eur(schwelleRente)} brutto im Monat alles frei, bei Arbeitslohn bis etwa ${DE.eur(schwelleLohn)}. Je Kind mit Anspruch auf Waisenrente steigt der Freibetrag um ${DE.num(W.kind_faktor, 1)} Rentenwerte, mit einem Kind auf ${DE.eur(freiKind, 2)}.` },
      { q: 'Was wird im Sterbevierteljahr gezahlt?', a: 'In den ersten drei Monaten nach dem Tod erhalten Sie die Rente des Verstorbenen in voller Höhe, ohne Einkommensanrechnung. Die Zahlung soll die Umstellung abfedern. Erst ab dem vierten Monat gilt der Rentenartfaktor der großen oder kleinen Witwenrente und wird Ihr eigenes Einkommen geprüft. Der Rechner zeigt beide Phasen getrennt.' },
      { q: 'Wird die Witwenrente gekürzt, wenn mein Partner mit Abschlag in Rente gegangen war?', a: 'Ja. Der Zugangsfaktor einer vorgezogenen Rente bleibt für die daraus folgende Witwenrente erhalten. Geben Sie in diesem Fall den tatsächlich gezahlten Bruttobetrag mit Abschlag ein. Starb der Partner vor dem Rentenbeginn und vor Vollendung des 65. Lebensjahres, kann auch dann ein Abschlag über den Zugangsfaktor anfallen; diesen Fall rechnet das Werkzeug nicht.' },
      { q: 'Wann gilt für die Witwenrente noch das alte Recht?', a: `Wenn die Ehe vor dem 1. Januar 2002 geschlossen wurde und mindestens ein Partner vor dem 2. Januar 1962 geboren ist. Dann beträgt die große Witwenrente ${DE.pct(W.gross_faktor_alt)} statt ${DE.pct(W.gross_faktor)}, und die kleine Witwenrente ist nicht auf ${DE.num(W.klein_monate)} Monate begrenzt. Bei 1.500 € Rente macht das ${DE.eur(alt.brutto - std.brutto)} im Monat aus.` },
    ],
    body: (h) => `
<h2>Was der Rechner prüft und was Sie selbst klären</h2>
<p>Der Rechner unterstellt, dass ein Anspruch besteht. Das setzt nach ${h.src('sgb6_46', '§ 46 SGB VI')} unter anderem voraus, dass die Ehe in der Regel mindestens ein Jahr bestand und Sie nicht wieder geheiratet haben; auch eine neue eingetragene Lebenspartnerschaft beendet den Anspruch. Die große Witwenrente bekommt, wer ein Kind unter 18 erzieht, selbst erwerbsgemindert ist oder die Altersgrenze erreicht hat. Diese liegt bei einem Todesfall im Jahr 2026 bei ${h.num(ga.j)} Jahren und ${h.num(ga.m)} Monaten und steigt bis 2029 auf 47 (${h.src('sgb6_242a', '§ 242a')}). Wer sicher sein will, welche Art zusteht, findet die Bedingungen unter ${h.a('grosse-witwenrente', 'große und kleine Witwenrente')}.</p>
<h2>Die Rechnung Schritt für Schritt</h2>
<p>Ausgangspunkt ist die Rente des Verstorbenen, brutto und ohne Abschlag, wie sie im Rentenbescheid oder in der Renteninformation steht. Der Rentenartfaktor macht daraus die Witwenrente (${h.src('sgb6_67', '§ 67')}, altes Recht nach ${h.src('sgb6_255', '§ 255')}). Ihr eigenes Einkommen wird um eine Pauschale gekürzt, die von der Einkommensart abhängt (${h.src('sgb4_18b', '§ 18b SGB IV')}): Arbeitslohn um ${h.pct(h.P.witwe.abzug.arbeitsentgelt, 0)}, eine eigene gesetzliche Rente mit Beginn ab 2011 um ${h.pct(h.P.witwe.abzug.rente_ab_2011, 0)}, eine Betriebsrente mit Beginn ab 2011 um ${h.pct(h.P.witwe.abzug.betriebsrente_ab_2011, 0)}. Vom Ergebnis zieht der Rechner den Freibetrag ab, das ${h.num(h.P.witwe.freibetrag_faktor, 1)}-fache des aktuellen Rentenwerts von ${h.eur(h.P.rentenwert.ab_2026_07, 2)} (${h.src('drvWerte', 'Rentenwert')}), und rechnet ${h.pct(h.P.witwe.anrechnung, 0)} des Überschusses an (${h.src('sgb6_97', '§ 97')}).</p>
${h.table(['Fall', 'Witwenrente vor Anrechnung', 'Anrechnung', 'Zahlbetrag brutto'], [
  ['Große, eigene Rente 1.200 €', h.eur(std.brutto, 2), h.eur(std.anrechnung, 2), h.eur(std.zahlbetrag, 2)],
  ['Große, altes Recht, eigene Rente 1.200 €', h.eur(alt.brutto, 2), h.eur(alt.anrechnung, 2), h.eur(alt.zahlbetrag, 2)],
  ['Kleine, eigene Rente 1.200 €', h.eur(klein.brutto, 2), h.eur(klein.anrechnung, 2), h.eur(klein.zahlbetrag, 2)],
  ['Große, Arbeitslohn 2.500 €', h.eur(lohn.brutto, 2), h.eur(lohn.anrechnung, 2), h.eur(lohn.zahlbetrag, 2)],
  ['Große, Arbeitslohn 2.500 €, ein Kind', h.eur(lohnKind.brutto, 2), h.eur(lohnKind.anrechnung, 2), h.eur(lohnKind.zahlbetrag, 2)],
  ['Große, 2.000 € des Verstorbenen, eigene Rente 1.600 €', h.eur(hoch.brutto, 2), h.eur(hoch.anrechnung, 2), h.eur(hoch.zahlbetrag, 2)],
], 'Rente des Verstorbenen 1.500 €, wenn nicht anders angegeben; Rentenwert ab 1. Juli 2026', ['l', 'r', 'r', 'r'])}
<p>Das Kind im fünften Beispiel zählt nur, wenn es selbst Anspruch auf Waisenrente hat. Es hebt den Freibetrag auf ${h.eur(freiKind, 2)} und senkt die Anrechnung von ${h.eur(lohn.anrechnung, 2)} auf ${h.eur(lohnKind.anrechnung, 2)}.</p>
<h2>Grenzen des Rechners</h2>
<p>Er nimmt nur eine Einkommensart auf einmal; wer Lohn und eine Betriebsrente hat, rechnet beide Pauschalkürzungen getrennt und addiert. Hatte der Verstorbene eine vorgezogene Rente mit Abschlag, bleibt dieser Zugangsfaktor für die Witwenrente bestehen (${h.src('sgb6_77', '§ 77 SGB VI')}); tragen Sie dann den gezahlten Betrag ein. Starb er vor dem Rentenbeginn und vor 65, kann ebenfalls ein Abschlag anfallen, den das Werkzeug nicht berechnet. Der Freibetrag wird jedes Jahr zum 1. Juli mit dem Rentenwert neu festgesetzt. Kranken- und Pflegebeitrag sowie Steuer sind nicht abgezogen; die Steuer auf die Witwenrente schätzt der ${h.a('rente-steuer-rechner', 'Steuerrechner für Renten')}. Wie Vermögen, Pensionen oder Selbstständigeneinkommen angerechnet werden, erklärt die Seite zur ${h.a('witwenrente-einkommen', 'Einkommensanrechnung')}. Den Antrag und die genaue Prüfung übernehmen die Auskunfts- und Beratungsstellen der Rentenversicherung.</p>`,
  },
  en: {
    slug: 'widows-pension-calculator',
    nav: 'Widow’s pension',
    card: 'Large or small widow’s pension in Germany, the first three months and the income test with the allowance from July 2026.',
    title: 'Widow’s Pension Germany 2026: Amount After the Income Test',
    description: `Widow’s pension in Germany 2026: large or small pension, three full months after death, an allowance of ${EN.num(W.freibetrag_faktor, 1)} pension values, ${EN.pct(W.anrechnung)} of income above it deducted.`,
    h1: 'German widow’s pension calculator',
    intro: 'Enter your late partner’s pension, the type of widow’s pension and your own income: the calculator shows the amount paid from the fourth month.',
    resume: `A German widow’s pension (Witwenrente) is worked out in three steps. For the first three months after the death (Sterbevierteljahr) you receive the deceased’s full pension, whatever you earn. After that the large widow’s pension is ${EN.pct(W.gross_faktor)} of that pension, ${EN.pct(W.gross_faktor_alt)} under the old rules, and the small one ${EN.pct(W.klein_faktor)} for at most ${EN.num(W.klein_monate)} months. Finally your own income is taken into account: it is reduced by a flat rate, an allowance of ${EN.eur(frei, 2)} a month stays untouched (since 1 July 2026, previously ${EN.eur(freiAlt, 2)}), and ${EN.pct(W.anrechnung)} of the rest is deducted from the widow’s pension. An example from the calculator: with a €1,500 pension of the deceased and €1,200 of your own pension, the large widow’s pension stays whole at ${EN.eur(std.zahlbetrag)}. If the widow instead earns €2,500 gross in a job, ${EN.eur(lohn.anrechnung, 2)} is deducted, leaving ${EN.eur(lohn.zahlbetrag, 2)}. All figures are gross, before health and care contributions.`,
    faqs: [
      { q: 'How much widow’s pension is paid on a €1,500 German pension?', a: `The full €1,500 for three months. After that ${EN.eur(std.brutto)} as a large widow’s pension, ${EN.eur(alt.brutto)} under the old rules, or ${EN.eur(klein.brutto)} as a small one. Whether anything is deducted depends on your income: an own pension of €1,200 stays below the allowance after the flat-rate reduction, wages of €2,500 do not.` },
      { q: 'How much can I earn before my German widow’s pension is reduced?', a: `What counts is income after a flat-rate reduction, not the gross figure. With your own German pension starting from 2011, about ${EN.eur(schwelleRente)} gross a month stays free; with wages, about ${EN.eur(schwelleLohn)}. Each child entitled to an orphan’s pension raises the allowance by ${EN.num(W.kind_faktor, 1)} pension values, to ${EN.eur(freiKind, 2)} with one child.` },
      { q: 'Does my late spouse’s early retirement reduction carry over to my widow’s pension?', a: 'Yes. The access factor (Zugangsfaktor) of an early pension stays in place for the widow’s pension that follows from it, so enter the gross amount actually paid, after the reduction. If your spouse died before drawing a pension and before turning 65, a reduction through the access factor can also apply; the calculator does not compute that case.' },
      { q: 'Am I covered by the old widow’s pension rules?', a: `Only if you married before 1 January 2002 and at least one of you was born before 2 January 1962. The large widow’s pension is then ${EN.pct(W.gross_faktor_alt)} instead of ${EN.pct(W.gross_faktor)}, and the small one has no ${EN.num(W.klein_monate)}-month limit. On a €1,500 pension the difference is ${EN.eur(alt.brutto - std.brutto)} a month before any income test.` },
    ],
    body: (h) => `
<h2>What the calculator checks and what you need to confirm</h2>
<p>The calculator assumes there is an entitlement. Under ${h.src('sgb6_46', 'section 46 SGB VI')} that requires, among other things, a marriage that, as a rule, lasted at least one year, and no remarriage; entering a new registered partnership also ends the entitlement. You get the large widow’s pension if you are raising a child under 18, have reduced earning capacity yourself, or have reached the age limit, which for a death in 2026 is ${h.num(ga.j)} years and ${h.num(ga.m)} months and rises to 47 by 2029 (${h.src('sgb6_242a', 'section 242a')}). The conditions are set out on the page on ${h.a('grosse-witwenrente', 'large and small widow’s pensions')}.</p>
<h2>The calculation step by step</h2>
<p>The starting point is the deceased’s pension, gross and without a reduction, as shown on the pension decision or the annual statement. The pension type factor turns it into the widow’s pension (${h.src('sgb6_67', 'section 67')}, old rules under ${h.src('sgb6_255', 'section 255')}). Your own income is cut by a flat rate that depends on its type (${h.src('sgb4_18b', 'section 18b SGB IV')}): wages by ${h.pct(h.P.witwe.abzug.arbeitsentgelt, 0)}, your own German pension starting from 2011 by ${h.pct(h.P.witwe.abzug.rente_ab_2011, 0)}, a company pension starting from 2011 by ${h.pct(h.P.witwe.abzug.betriebsrente_ab_2011, 0)}. The calculator then deducts the allowance, ${h.num(h.P.witwe.freibetrag_faktor, 1)} times the current pension value of ${h.eur(h.P.rentenwert.ab_2026_07, 2)} (${h.src('drvWerte', 'pension value')}), and counts ${h.pct(h.P.witwe.anrechnung, 0)} of any excess against the pension (${h.src('sgb6_97', 'section 97')}).</p>
${h.table(['Case', 'Before income test', 'Deduction', 'Paid, gross'], [
  ['Large, own pension €1,200', h.eur(std.brutto, 2), h.eur(std.anrechnung, 2), h.eur(std.zahlbetrag, 2)],
  ['Large, old rules, own pension €1,200', h.eur(alt.brutto, 2), h.eur(alt.anrechnung, 2), h.eur(alt.zahlbetrag, 2)],
  ['Small, own pension €1,200', h.eur(klein.brutto, 2), h.eur(klein.anrechnung, 2), h.eur(klein.zahlbetrag, 2)],
  ['Large, wages €2,500', h.eur(lohn.brutto, 2), h.eur(lohn.anrechnung, 2), h.eur(lohn.zahlbetrag, 2)],
  ['Large, wages €2,500, one child', h.eur(lohnKind.brutto, 2), h.eur(lohnKind.anrechnung, 2), h.eur(lohnKind.zahlbetrag, 2)],
  ['Large, deceased €2,000, own pension €1,600', h.eur(hoch.brutto, 2), h.eur(hoch.anrechnung, 2), h.eur(hoch.zahlbetrag, 2)],
], 'Deceased’s pension €1,500 unless stated; pension value from 1 July 2026', ['l', 'r', 'r', 'r'])}
<p>The child in the fifth case only counts if it is itself entitled to an orphan’s pension. It lifts the allowance to ${h.eur(freiKind, 2)} and cuts the deduction from ${h.eur(lohn.anrechnung, 2)} to ${h.eur(lohnKind.anrechnung, 2)}.</p>
<h2>Limits of the calculator</h2>
<p>It takes one type of income at a time; if you have wages and a company pension, apply both flat-rate cuts separately and add them. If the deceased drew an early pension with a reduction, that access factor stays for the widow’s pension (${h.src('sgb6_77', 'section 77 SGB VI')}), so enter the amount actually paid. If death came before the pension started and before 65, a reduction can also apply, which the tool does not compute. The allowance is reset every 1 July with the pension value. Health and care contributions and tax are not deducted; the ${h.a('rente-steuer-rechner', 'pension tax calculator')} estimates the tax. How civil service pensions, self-employed income or assets count is covered in the ${h.a('witwenrente-einkommen', 'income test guide')}. Income from abroad is not part of this tool; the pension insurer’s information and advice centres (Auskunfts- und Beratungsstellen) handle the claim and the exact check.</p>`,
  },
});
