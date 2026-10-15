import { defineGuide } from '../../lib/guide-types';
import { netto, besteuerungsanteil, steuerfreieGrenze, type NettoEingabe } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Rente versteuern: Jahressteuer bei 1.500 bis 3.000 € (Beginn 2026), dann 2.000 € mit Nebeneinkünften, Ehe, Kirche, älterem Startjahr. */
const S = P.steuer;
const basis: NettoEingabe = { brutto: 2000, zusatz: P.kv.zusatz_durchschnitt_2026, kinderlos: false, startjahr: 2026, weitere: 0, verheiratet: false, partner: 0, kirche: 0 };
const st = (o: Partial<NettoEingabe> = {}) => netto({ ...basis, ...o });
const stufen = [1500, 2000, 2500, 3000].map((b) => ({ b, r: st({ brutto: b }) }));
const r20 = st();
const miete = st({ weitere: 6000 });
const ehe0 = st({ verheiratet: true });
const ehe18 = st({ verheiratet: true, partner: 18000 });
const kirche = st({ kirche: S.kirchensteuer.andere });
const start30 = st({ startjahr: 2030 });
const fb = st({ freibetrag: 5000 });
const r30 = stufen[3].r;
const grenze = steuerfreieGrenze(2026);
const a26 = besteuerungsanteil(2026);
const a30 = besteuerungsanteil(2030);
const freiJahr = r20.jahresrente * (1 - a26);

export default defineGuide({
  id: 'rente-steuer-rechner',
  group: 'netto',
  order: 110,
  tool: 'steuer',
  related: ['rentenrechner-brutto-netto', 'besteuerung-rente', 'steuerfreie-rente', 'krankenversicherung-rentner', 'hinzuverdienst', 'witwenrente-rechner'],
  sources: ['estg_22', 'estg_32a', 'estg_9a', 'estg_10c', 'estg_10', 'solzg_3', 'solzg_4'],
  de: {
    slug: 'rente-steuer-rechner',
    nav: 'Steuer auf die Rente',
    card: 'Einkommensteuer im Jahr auf die gesetzliche Rente, mit Nebeneinkünften, Ehepartner und Kirchensteuer.',
    title: 'Rente Steuer 2026: Jahressteuer mit Ehe und Nebeneinkünften',
    description: 'Rente versteuern 2026: Einkommensteuer im Jahr auf die gesetzliche Rente, mit Miete oder Betriebsrente, Splitting, Kirchensteuer und Rentenfreibetrag.',
    h1: 'Steuer auf die Rente 2026: die Jahresrechnung',
    intro: 'Bruttorente, Startjahr und Ihre übrigen Einkünfte eingeben: Der Rechner ermittelt das zu versteuernde Einkommen und die Einkommensteuer für ein ganzes Jahr.',
    resume: `Auf die gesetzliche Rente fällt Einkommensteuer an, aber niemand behält sie ein: Die Rentenversicherung zahlt brutto minus Sozialbeiträge aus, die Steuer setzt das Finanzamt nach der Erklärung für das ganze Jahr fest. Steuerpflichtig ist der Besteuerungsanteil des Startjahres, für einen Beginn 2026 ${DE.pct(a26)} der Jahresrente. Davon gehen ${DE.eur(S.wk_pauschbetrag_rente)} Werbungskosten, ${DE.eur(S.sa_pauschbetrag)} Sonderausgaben (Ehepaare das Doppelte) und die selbst getragenen Kranken- und Pflegebeiträge ab. Liegt der Rest über dem Grundfreibetrag von ${DE.eur(S.grundfreibetrag)}, beginnt die Steuer. Im Rechner kostet eine Rente von 2.000 € im Monat eine alleinstehende Person ${DE.eur(r20.steuerJahr)} im Jahr, bei 3.000 € sind es ${DE.eur(r30.steuerJahr)}. Kommen 6.000 € Mieteinkünfte im Jahr hinzu, steigt die Steuer auf 2.000 € Rente auf ${DE.eur(miete.steuerJahr)}. Ein Ehepaar, das nur von dieser einen Rente lebt, zahlt mit Splitting ${DE.eur(ehe0.steuerJahr)}.`,
    faqs: [
      { q: 'Wie viel Einkommensteuer zahle ich im Jahr auf 2.000 € gesetzliche Rente?', a: `Bei Rentenbeginn 2026, alleinstehend und ohne weitere Einkünfte rechnet der Rechner mit einem zu versteuernden Einkommen von ${DE.eur(r20.zve)} und ${DE.eur(r20.est)} Einkommensteuer im Jahr, rund ${DE.eur(r20.steuerMonat)} im Monat. Mit ${DE.pct(S.kirchensteuer.andere)} Kirchensteuer kommen ${DE.eur(kirche.kist)} hinzu. Solidaritätszuschlag fällt bei dieser Höhe nicht an.` },
      { q: 'Wie verändern Mieteinnahmen oder eine Betriebsrente die Steuer auf meine gesetzliche Rente?', a: `Sie werden mit der Rente zusammengerechnet und erhöhen den Steuersatz für alles. Die Rente von 2.000 € allein kostet ${DE.eur(r20.steuerJahr)} im Jahr; mit 6.000 € steuerpflichtigen Mieteinkünften sind es ${DE.eur(miete.steuerJahr)}, also ${DE.eur(miete.steuerJahr - r20.steuerJahr)} mehr. Tragen Sie solche Einkünfte nach ihren eigenen Abzügen ein, etwa Miete nach Werbungskosten.` },
      { q: 'Wie wirkt das Ehegattensplitting auf die Steuer eines Rentnerpaares?', a: `Bei gemeinsamer Veranlagung werden beide Einkommen addiert und nach dem Splittingtarif besteuert. Lebt das Paar nur von 2.000 € Rente, verteilt das Splitting das Einkommen rechnerisch auf zwei Grundfreibeträge: Steuer ${DE.eur(ehe0.steuerJahr)} statt ${DE.eur(r20.steuerJahr)}. Hat der Partner zusätzlich ${DE.eur(18000)} eigene steuerpflichtige Einkünfte, zahlt das Paar zusammen ${DE.eur(ehe18.steuerJahr)}. Den Partnerbetrag tragen Sie unter „Weitere Angaben“ ein.` },
      { q: 'Wo steht mein persönlicher Rentenfreibetrag?', a: `Im Einkommensteuerbescheid für das erste volle Jahr nach dem Rentenbeginn; ab dann bleibt er als Eurobetrag gleich. Tragen Sie ihn in den Rechner ein, ersetzt er den Prozentsatz. Mit einem Freibetrag von 5.000 € kostet eine Rente von 2.000 € ${DE.eur(fb.steuerJahr)} im Jahr. Ohne diese Angabe rechnet das Werkzeug mit dem Prozentsatz des Startjahres.` },
      { q: 'Müssen Rentner Solidaritätszuschlag zahlen?', a: `Nur bei hoher Einkommensteuer. Der Zuschlag von ${DE.pct(S.soli_satz, 1)} wird erst fällig, wenn die Einkommensteuer ${DE.eur(S.soli_freigrenze_einzel)} im Jahr übersteigt, bei Zusammenveranlagung ${DE.eur(S.soli_freigrenze_zusammen)}; knapp darüber gilt eine Milderungszone. Mit einer gesetzlichen Rente allein wird diese Grenze praktisch nicht erreicht, auch nicht bei Ehepaaren mit zwei Renten.` },
    ],
    body: (h) => `
<h2>Die Steuer auf ein ganzes Rentenjahr</h2>
<p>Der Rechner arbeitet wie der Steuerbescheid: Er nimmt zwölf Monatsrenten, setzt den steuerpflichtigen Teil nach ${h.src('estg_22', '§ 22 EStG')} an, zieht den Werbungskosten-Pauschbetrag (${h.src('estg_9a', '§ 9a')}), den Sonderausgaben-Pauschbetrag (${h.src('estg_10c', '§ 10c')}) und die Kranken- und Pflegebeiträge (${h.src('estg_10', '§ 10')}) ab und wendet auf das Ergebnis den Tarif 2026 an (${h.src('estg_32a', '§ 32a')}). Für Ehepaare nimmt er den Splittingtarif. Am Ende stehen Einkommensteuer, Solidaritätszuschlag (${h.src('solzg_3', '§ 3')} und ${h.src('solzg_4', '§ 4 SolZG')}) und Kirchensteuer als Jahresbeträge.</p>
${h.table(['Rente brutto im Monat', 'Zu versteuern im Jahr', 'Einkommensteuer im Jahr', 'im Monat'], stufen.map(({ b, r }) => [h.eur(b), h.eur(r.zve), h.eur(r.est), h.eur(r.steuerMonat, 2)]), 'Rentenbeginn 2026, alleinstehend, mit Kindern, keine weiteren Einkünfte', ['r', 'r', 'r', 'r'])}
<p>Im Standardfall bleibt eine Rente mit Beginn 2026 bis etwa ${h.eur(grenze)} brutto im Monat steuerfrei; die Herleitung dieser Grenze steht unter ${h.a('steuerfreie-rente', 'Wie viel Rente ist steuerfrei')}.</p>
<h2>Eine Rente, fünf Lebenslagen</h2>
${h.table(['Fall bei 2.000 € Rente', 'Zu versteuern', 'Steuer im Jahr'], [
  ['Alleinstehend, nur Rente', h.eur(r20.zve), h.eur(r20.steuerJahr)],
  ['plus 6.000 € Miete im Jahr', h.eur(miete.zve), h.eur(miete.steuerJahr)],
  [`mit ${h.pct(h.P.steuer.kirchensteuer.andere, 0)} Kirchensteuer`, h.eur(kirche.zve), h.eur(kirche.steuerJahr)],
  ['verheiratet, Partner ohne Einkünfte', h.eur(ehe0.zve), h.eur(ehe0.steuerJahr)],
  ['verheiratet, Partner 18.000 € Einkünfte', h.eur(ehe18.zve), h.eur(ehe18.steuerJahr)],
  ['Rentenbeginn erst 2030', h.eur(start30.zve), h.eur(start30.steuerJahr)],
], 'Steuer einschließlich Soli und Kirchensteuer, Kranken- und Pflegebeitrag abgezogen', ['l', 'r', 'r'])}
<p>Wer erst 2030 in Rente geht, versteuert ${h.pct(a30, 0)} statt ${h.pct(a26, 0)}; der halbe Punkt je Jahrgang wirkt klein, verschiebt aber über die ganze Rentenzeit Geld zum Finanzamt. Die Tabelle aller Prozentsätze bis 2058 zeigt die ${h.a('besteuerung-rente', 'Seite zur Besteuerung der Rente')}.</p>
<h2>Der eingefrorene Freibetrag</h2>
<p>Bei Rentenbeginn 2026 bleiben ${h.pct(1 - a26, 0)} der Rente steuerfrei, bei 2.000 € im Monat also rund ${h.eur(freiJahr)} im Jahr. Dieser Betrag wird im Jahr nach dem Beginn als fester Eurobetrag festgeschrieben. Jede spätere Rentenerhöhung ist danach voll steuerpflichtig, der steuerpflichtige Anteil wächst also Jahr für Jahr über die anfänglichen ${h.pct(a26, 0)} hinaus. Für Renten, die schon länger laufen, liefert der Rechner deshalb nur mit dem Freibetrag aus dem eigenen Bescheid ein genaues Ergebnis. Folgt eine Rente auf eine frühere, etwa eine Witwenrente auf die eigene Rente des Verstorbenen oder eine Altersrente auf eine Erwerbsminderungsrente, gilt eine Sonderregel für das maßgebliche Startjahr.</p>
<h2>Was nicht abgebildet ist</h2>
<p>Abgezogen wird keine Steuer an der Quelle, und der Rechner erstellt keine Steuererklärung. Außer den genannten Pauschbeträgen und Sozialbeiträgen berücksichtigt er keine Abzüge, die Sie in der Erklärung selbst geltend machen. Weitere Einkünfte erwartet er bereits nach ihren eigenen Freibeträgen und Werbungskosten. Den Monatsbetrag nach allen Abzügen liefert der ${h.a('rentenrechner-brutto-netto', 'Rentenrechner brutto netto')}; wie Kranken- und Pflegebeitrag entstehen, erklärt ${h.a('krankenversicherung-rentner', 'Krankenversicherung der Rentner')}. Für den Einzelfall ist eine Steuerberatung der richtige Weg.</p>`,
  },
  en: {
    slug: 'pension-tax-calculator',
    nav: 'Tax on your pension',
    card: 'Annual German income tax on a state pension, with other income, a spouse and church tax.',
    title: 'Pension Tax Germany 2026: Annual Income Tax on Your Pension',
    description: 'Pension tax in Germany 2026: annual income tax on a state pension, with rental or company pension income, joint assessment, church tax and the frozen allowance.',
    h1: 'Income tax on a German pension: the annual bill',
    intro: 'Enter your gross pension, the year it started and any other income: the calculator works out taxable income and German income tax for a full year.',
    resume: `A German statutory pension is subject to income tax, but nothing is withheld at source: the pension insurer pays the gross amount minus social contributions, and the tax office assesses tax for the whole year once you file a return. The taxable part is the share for the year your pension started, ${EN.pct(a26)} of the annual pension for a 2026 start. From that come ${EN.eur(S.wk_pauschbetrag_rente)} for expenses, ${EN.eur(S.sa_pauschbetrag)} for special expenses (double for couples) and the health and care contributions you paid yourself. Tax starts once the rest exceeds the ${EN.eur(S.grundfreibetrag)} basic allowance (Grundfreibetrag). In the calculator, a single person with a €2,000 monthly pension pays ${EN.eur(r20.steuerJahr)} a year; at €3,000 it is ${EN.eur(r30.steuerJahr)}. Add €6,000 of rental income a year and tax on the €2,000 pension rises to ${EN.eur(miete.steuerJahr)}. A married couple living on that one pension pays ${EN.eur(ehe0.steuerJahr)} under joint assessment.`,
    faqs: [
      { q: 'How much income tax is due each year on a €2,000 German state pension?', a: `For a pension starting in 2026, single and with no other income, the calculator finds taxable income of ${EN.eur(r20.zve)} and ${EN.eur(r20.est)} income tax a year, about ${EN.eur(r20.steuerMonat)} a month. With ${EN.pct(S.kirchensteuer.andere)} church tax, add ${EN.eur(kirche.kist)}. No solidarity surcharge is due at this level. Church tax applies only if you are registered as a member of a church that levies it in Germany.` },
      { q: 'Does my spouse’s salary raise the tax on my German pension?', a: `Under joint assessment both incomes are added and taxed on the splitting schedule. If the couple lives only on a €2,000 pension, tax is ${EN.eur(ehe0.steuerJahr)} instead of ${EN.eur(r20.steuerJahr)} for a single person. If your spouse also has ${EN.eur(18000)} of taxable income, the couple pays ${EN.eur(ehe18.steuerJahr)} together. Enter the spouse’s income under “More options”.` },
      { q: 'Where do I find my fixed tax-free pension amount?', a: `In your income tax assessment for the first full year after the pension started; from then on it stays the same euro amount. Enter it and the calculator uses it instead of the percentage. With a fixed amount of €5,000, a €2,000 pension costs ${EN.eur(fb.steuerJahr)} a year. Without it, the tool applies the percentage for the start year.` },
      { q: 'Do pensioners in Germany pay the solidarity surcharge?', a: `Only on high tax bills. The ${EN.pct(S.soli_satz, 1)} surcharge applies once income tax exceeds ${EN.eur(S.soli_freigrenze_einzel)} a year, or ${EN.eur(S.soli_freigrenze_zusammen)} for couples filing jointly, with a phase-in zone just above. A statutory pension on its own practically never reaches that threshold, even for a couple drawing two pensions.` },
    ],
    body: (h) => `
<h2>Tax on a full year of pension</h2>
<p>The calculator follows the logic of a German tax assessment. It takes twelve monthly payments, applies the taxable share under ${h.src('estg_22', 'section 22 Income Tax Act')}, deducts the flat expenses allowance (${h.src('estg_9a', 'section 9a')}), the flat special expenses allowance (${h.src('estg_10c', 'section 10c')}) and your health and care contributions (${h.src('estg_10', 'section 10')}), then applies the 2026 schedule (${h.src('estg_32a', 'section 32a')}). Married couples get the splitting schedule. The output is annual income tax, solidarity surcharge (${h.src('solzg_3', 'section 3')} and ${h.src('solzg_4', 'section 4 Solidarity Surcharge Act')}) and church tax.</p>
${h.table(['Gross pension a month', 'Taxable income a year', 'Income tax a year', 'per month'], stufen.map(({ b, r }) => [h.eur(b), h.eur(r.zve), h.eur(r.est), h.eur(r.steuerMonat, 2)]), 'Pension starting 2026, single, with children, no other income', ['r', 'r', 'r', 'r'])}
<p>In the standard case a pension starting in 2026 stays tax-free up to about ${h.eur(grenze)} gross a month; the ${h.a('steuerfreie-rente', 'tax-free pension limit')} page explains how that figure comes about.</p>
<h2>One pension, five situations</h2>
${h.table(['Case on a €2,000 pension', 'Taxable income', 'Tax a year'], [
  ['Single, pension only', h.eur(r20.zve), h.eur(r20.steuerJahr)],
  ['plus €6,000 rent a year', h.eur(miete.zve), h.eur(miete.steuerJahr)],
  [`with ${h.pct(h.P.steuer.kirchensteuer.andere, 0)} church tax`, h.eur(kirche.zve), h.eur(kirche.steuerJahr)],
  ['married, spouse without income', h.eur(ehe0.zve), h.eur(ehe0.steuerJahr)],
  ['married, spouse with €18,000 income', h.eur(ehe18.zve), h.eur(ehe18.steuerJahr)],
  ['pension starting only in 2030', h.eur(start30.zve), h.eur(start30.steuerJahr)],
], 'Tax including solidarity surcharge and church tax, after health and care contributions', ['l', 'r', 'r'])}
<p>A pension starting in 2030 is ${h.pct(a30, 0)} taxable rather than ${h.pct(a26, 0)}. Half a point per year looks small, yet over a whole retirement it moves real money to the tax office. All percentages up to 2058 are on the page on ${h.a('besteuerung-rente', 'taxation of German pensions')}.</p>
<h2>The frozen allowance</h2>
<p>With a 2026 start, ${h.pct(1 - a26, 0)} of the pension stays tax-free, about ${h.eur(freiJahr)} a year on €2,000 a month. That amount is fixed in euros in the year after the pension starts. Every later increase is then fully taxable, so the taxable part grows year by year beyond the initial ${h.pct(a26, 0)}. For pensions already in payment for some years, the calculator is only precise if you enter the fixed amount from your own assessment. Where one pension follows another, such as a widow’s pension after the deceased’s own pension, or a retirement pension after a disability pension, a special rule decides which start year counts.</p>
<h2>What is left out</h2>
<p>Nothing is withheld at source, and the calculator does not prepare a tax return. Beyond the flat allowances and social contributions named above, it takes no deductions you would claim yourself in a return. Other income is expected after its own allowances and expenses. If you also draw a pension from your home country while living in Germany, its tax treatment in Germany is beyond this tool; ask the tax office before you rely on a figure. The ${h.a('rentenrechner-brutto-netto', 'gross to net calculator')} shows the monthly amount after every deduction, and ${h.a('krankenversicherung-rentner', 'health insurance for pensioners')} explains the contributions. For your own case, ask a tax adviser.</p>`,
  },
});
