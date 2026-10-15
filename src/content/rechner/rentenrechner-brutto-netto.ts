import { defineGuide } from '../../lib/guide-types';
import { netto, nettoStandard, steuerfreieGrenze } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Rentenrechner brutto netto: Beispiele 1.200 €, 1.800 € und 2.400 € bei Beginn 2026, Standardfall, dazu kinderlos und verheiratet. */
const b12 = nettoStandard(1200);
const b18 = nettoStandard(1800);
const b24 = nettoStandard(2400);
const kl18 = netto({ brutto: 1800, zusatz: P.kv.zusatz_durchschnitt_2026, kinderlos: true, startjahr: 2026, weitere: 0, verheiratet: false, partner: 0, kirche: 0 });
const vh24 = netto({ brutto: 2400, zusatz: P.kv.zusatz_durchschnitt_2026, kinderlos: false, startjahr: 2026, weitere: 0, verheiratet: true, partner: 0, kirche: 0 });
const alt24 = nettoStandard(2400, 2015);
const grenze = steuerfreieGrenze(2026);
const KV = P.kv, PV = P.pv, ST = P.steuer;
const kvHalb = KV.allgemein * KV.rentner_anteil, zHalb = KV.zusatz_durchschnitt_2026 * KV.rentner_anteil;
const anteil26 = ST.besteuerungsanteil['2026'] / 100;
const satz = (kinderlos: boolean) => kvHalb + zHalb + PV.satz + (kinderlos ? PV.kinderlos_zuschlag : 0);

export default defineGuide({
  id: 'rentenrechner-brutto-netto',
  group: 'netto',
  order: 100,
  tool: 'netto',
  related: ['rente-steuer-rechner', 'krankenversicherung-rentner', 'besteuerung-rente', 'steuerfreie-rente', 'rentenrechner', 'rentenluecke'],
  sources: ['sgb5_5', 'sgb5_241', 'sgb5_247', 'sgb5_249a', 'sgb11_55', 'sgb11_59', 'estg_22', 'estg_32a', 'estg_10', 'estg_49'],
  de: {
    slug: 'rentenrechner-brutto-netto',
    nav: 'Rente brutto netto',
    card: 'Was von der Bruttorente bleibt: Kranken- und Pflegebeitrag, Steuer nach dem Startjahr.',
    title: 'Rentenrechner brutto netto 2026: was von der Rente bleibt',
    description: `Rentenrechner brutto netto 2026: Krankenkasse ${DE.pct(kvHalb, 1)} + halber Zusatzbeitrag, Pflege ${DE.pct(PV.satz, 1)} oder ${DE.pct(PV.satz + PV.kinderlos_zuschlag, 1)}, Steuer nach Besteuerungsanteil des Startjahres. Kostenlos.`,
    h1: 'Rentenrechner brutto netto 2026',
    intro: 'Bruttorente und Jahr des Rentenbeginns eingeben: Der Rechner zieht Kranken- und Pflegebeitrag ab und schätzt die Einkommensteuer nach dem Tarif 2026.',
    resume: `Von der gesetzlichen Rente gehen zwei Abzüge sofort ab und einer später. Sofort behält die Rentenversicherung den Krankenkassenbeitrag ein: die Hälfte des allgemeinen Satzes von ${DE.pct(KV.allgemein, 1)} und die Hälfte des Zusatzbeitrags Ihrer Kasse, im Schnitt 2026 also ${DE.pct(kvHalb, 1)} plus ${DE.pct(zHalb, 2)}; die andere Hälfte zahlt die Rentenversicherung. Ebenfalls sofort geht der Pflegebeitrag ab, den Rentner allein tragen: ${DE.pct(PV.satz, 1)}, ohne Kinder ${DE.pct(PV.satz + PV.kinderlos_zuschlag, 1)}. Die Einkommensteuer zieht niemand ab; sie wird mit der Steuererklärung fällig, wenn der steuerpflichtige Teil der Rente zusammen mit anderen Einkünften über dem Grundfreibetrag von ${DE.eur(P.steuer.grundfreibetrag)} liegt. Steuerpflichtig sind bei einem Rentenbeginn 2026 genau ${DE.pct(anteil26)}. Beispiele aus dem Rechner, alleinstehend mit Kindern: 1.200 € brutto ergeben ${DE.eur(b12.netto)}, 1.800 € ergeben ${DE.eur(b18.netto)}, 2.400 € ergeben ${DE.eur(b24.netto)} im Monat.`,
    faqs: [
      { q: 'Wie viel Prozent zieht die Rentenversicherung von der Rente ab?', a: `Bei durchschnittlichem Zusatzbeitrag ${DE.pct(kvHalb + zHalb, 2)} für die Krankenversicherung und ${DE.pct(PV.satz, 1)} für die Pflege, zusammen ${DE.pct(satz(false), 2)}; ohne Kinder ${DE.pct(satz(true), 2)}. Von 1.800 € sind das ${DE.eur(b18.sozial, 2)}, kinderlos ${DE.eur(kl18.sozial, 2)}. Ihre Kasse kann einen höheren oder niedrigeren Zusatzbeitrag verlangen; eine Änderung wirkt bei Rentnern ab dem zweiten Folgemonat.` },
      { q: 'Muss ich als Rentner eine Steuererklärung abgeben?', a: `Ja, sobald das zu versteuernde Einkommen über dem Grundfreibetrag liegt; bei nur gesetzlicher Rente und Beginn 2026 ist das im Standardfall ab etwa ${DE.eur(grenze)} Bruttorente im Monat so. Die Rentenversicherung meldet die Rente elektronisch an das Finanzamt, die Steuer wird also auch ohne Erklärung bemerkt. Ehepaare rechnen gemeinsam, mit doppeltem Grundfreibetrag.` },
      { q: 'Warum zahlen ältere Rentner mehr Steuer auf dieselbe Rente?', a: `Weil der steuerfreie Teil im Jahr nach dem Rentenbeginn als fester Eurobetrag eingefroren wird und jede spätere Erhöhung voll steuerpflichtig ist. Wer 2015 in Rente ging, versteuert nominal ${DE.pct(P.steuer.besteuerungsanteil['2015'] / 100)}; der Rechner setzt dann ${DE.eur(alt24.steuerMonat, 2)} im Monat bei 2.400 € an, in Wahrheit ist es mehr. Tragen Sie den Rentenfreibetrag aus Ihrem Steuerbescheid ein, dann rechnet er genau.` },
    ],
    body: (h) => `
<h2>Was der Rechner abzieht</h2>
<p>Die Krankenversicherung der Rentner ist eine Pflichtversicherung für alle, die in der zweiten Hälfte ihres Erwerbslebens zu mindestens neun Zehnteln gesetzlich versichert waren (${h.src('sgb5_5', '§ 5 Abs. 1 Nr. 11 SGB V')}). Ihr Beitrag aus der Rente folgt dem allgemeinen Satz von ${h.pct(h.P.kv.allgemein, 1)} (${h.src('sgb5_241', '§ 241 SGB V')}) plus dem Zusatzbeitrag Ihrer Kasse (${h.src('sgb5_247', '§ 247')}); Sie und die Rentenversicherung tragen ihn je zur Hälfte (${h.src('sgb5_249a', '§ 249a')}). Den Pflegebeitrag tragen Rentner dagegen allein (${h.src('sgb11_59', '§ 59 SGB XI')}), mit ${h.num(h.P.pv.kinderlos_zuschlag * 100, 1)} Punkten Zuschlag ohne Kinder (${h.src('sgb11_55', '§ 55')}).</p>
${h.table(['Rente brutto', 'Kranken- und Pflegebeitrag', 'Steuer im Monatsschnitt', 'Netto'], [b12, b18, b24].map((r, i) => [h.eur([1200, 1800, 2400][i]), h.eur(r.sozial, 2), h.eur(r.steuerMonat, 2), h.eur(r.netto)]), 'Rentenbeginn 2026, alleinstehend, mit Kindern, Zusatzbeitrag ' + h.pct(h.P.kv.zusatz_durchschnitt_2026, 1), ['r', 'r', 'r', 'r'])}
<h2>Wie die Steuer geschätzt wird</h2>
<p>Steuerpflichtig ist der Besteuerungsanteil des Jahres, in dem die Rente beginnt (${h.src('estg_22', '§ 22 EStG')}): ${h.pct(anteil26)} für 2026, ein halber Punkt mehr für jedes spätere Jahr. Davon gehen ${h.eur(h.P.steuer.wk_pauschbetrag_rente)} Werbungskosten, ${h.eur(h.P.steuer.sa_pauschbetrag)} Sonderausgaben und die gezahlten Kranken- und Pflegebeiträge ab (${h.src('estg_10', '§ 10 EStG')}); auf den Rest wendet der Rechner den Tarif 2026 an (${h.src('estg_32a', '§ 32a')}). Bei Ehepaaren mit einer einzigen Rente von 2.400 € halbiert das Splitting die Last: ${h.eur(vh24.steuerMonat, 2)} statt ${h.eur(b24.steuerMonat, 2)} im Monat. Betriebsrenten, Mieten oder Lohn tragen Sie als weitere Einkünfte ein, nach deren eigenen Freibeträgen.</p>
<h2>Was der Rechner nicht abbildet</h2>
<p>Privat Krankenversicherte zahlen ihren Beitrag selbst und bekommen von der Rentenversicherung einen Zuschuss; die Option „Weitere Angaben“ rechnet sie ohne Abzug, den Zuschuss aber nicht ein. Die Ermäßigung des Pflegebeitrags für Eltern mit mehreren Kindern unter 25 Jahren fehlt ebenfalls, weil sie bei Rentnern selten ist. Die Steuer ist eine Jahresschätzung, gleichmäßig auf zwölf Monate verteilt; tatsächlich zahlen Sie sie mit dem Steuerbescheid oder über Vorauszahlungen.</p>`,
  },
  en: {
    slug: 'net-pension-calculator',
    nav: 'Gross to net pension',
    card: 'What is left of a German pension after health, care and income tax.',
    title: 'Net Pension Germany 2026: Gross to Net Pension Calculator',
    description: `German pension gross to net in 2026: health insurance ${EN.pct(kvHalb, 1)} plus half the extra rate, care ${EN.pct(PV.satz, 1)} or ${EN.pct(PV.satz + PV.kinderlos_zuschlag, 1)}, income tax with the taxable share of the start year.`,
    h1: 'German pension: gross to net calculator 2026',
    intro: 'Enter your gross pension and the year it started: the calculator deducts health and long-term care contributions and estimates income tax under the 2026 schedule.',
    resume: `Two deductions come off a German statutory pension straight away and one later. Straight away the pension insurer withholds health insurance: half of the general ${EN.pct(KV.allgemein, 1)} rate and half of your health fund’s extra rate (Zusatzbeitrag), on average ${EN.pct(kvHalb, 1)} plus ${EN.pct(zHalb, 2)} in 2026; the pension insurer pays the other half. Long-term care insurance (Pflegeversicherung) also comes off at once, and pensioners pay it alone: ${EN.pct(PV.satz, 1)}, or ${EN.pct(PV.satz + PV.kinderlos_zuschlag, 1)} without children. Nobody withholds income tax; it is due through your tax return once the taxable part of the pension plus other income exceeds the ${EN.eur(P.steuer.grundfreibetrag)} basic allowance. For pensions starting in 2026 exactly ${EN.pct(anteil26)} is taxable. Examples from the calculator, single with children: €1,200 gross leaves ${EN.eur(b12.netto)}, €1,800 leaves ${EN.eur(b18.netto)}, €2,400 leaves ${EN.eur(b24.netto)} a month.`,
    faqs: [
      { q: 'What percentage comes off a German pension at source?', a: `With the average extra rate, ${EN.pct(kvHalb + zHalb, 2)} for health insurance and ${EN.pct(PV.satz, 1)} for care, ${EN.pct(satz(false), 2)} in total; ${EN.pct(satz(true), 2)} without children. On €1,800 that is ${EN.eur(b18.sozial, 2)}, or ${EN.eur(kl18.sozial, 2)} without children. Your fund may charge a higher or lower extra rate; for pensioners a change applies from the second month after it.` },
      { q: 'If I retire abroad, is German tax still due on the pension?', a: 'Often yes. A German statutory pension paid to someone living abroad falls under limited German tax liability (section 49 Income Tax Act), and whether the other country also taxes it depends on the double taxation agreement. This calculator assumes you live in Germany and pay German health insurance. Check with the tax office responsible for pensioners abroad before you move.' },
      { q: 'Why do people who retired earlier pay more tax on the same pension?', a: `Because the tax-free part is frozen as a fixed euro amount in the year after the pension starts, and every later increase is fully taxable. Someone who retired in 2015 nominally pays tax on ${EN.pct(P.steuer.besteuerungsanteil['2015'] / 100)}; the calculator then shows ${EN.eur(alt24.steuerMonat, 2)} a month on €2,400, but the real figure is higher. Enter the fixed tax-free amount from your tax assessment for a precise result.` },
    ],
    body: (h) => `
<h2>What the calculator deducts</h2>
<p>Pensioners’ health insurance (Krankenversicherung der Rentner, KVdR) is compulsory for anyone who spent at least nine tenths of the second half of their working life in statutory health insurance (${h.src('sgb5_5', 'section 5(1) no. 11 SGB V')}). The contribution on the pension follows the general rate of ${h.pct(h.P.kv.allgemein, 1)} (${h.src('sgb5_241', 'section 241 SGB V')}) plus your fund’s extra rate (${h.src('sgb5_247', 'section 247')}), split equally between you and the pension insurer (${h.src('sgb5_249a', 'section 249a')}). Pensioners pay long-term care insurance alone (${h.src('sgb11_59', 'section 59 SGB XI')}), with ${h.num(h.P.pv.kinderlos_zuschlag * 100, 1)} points more if they have no children (${h.src('sgb11_55', 'section 55')}).</p>
${h.table(['Gross pension', 'Health and care', 'Tax, monthly average', 'Net'], [b12, b18, b24].map((r, i) => [h.eur([1200, 1800, 2400][i]), h.eur(r.sozial, 2), h.eur(r.steuerMonat, 2), h.eur(r.netto)]), 'Pension starting 2026, single, with children, extra rate ' + h.pct(h.P.kv.zusatz_durchschnitt_2026, 1), ['r', 'r', 'r', 'r'])}
<h2>How the tax is estimated</h2>
<p>The taxable part is the share for the year your pension starts (${h.src('estg_22', 'section 22 Income Tax Act')}): ${h.pct(anteil26)} for 2026, half a point more for each later year. From that the calculator deducts ${h.eur(h.P.steuer.wk_pauschbetrag_rente)} expenses, ${h.eur(h.P.steuer.sa_pauschbetrag)} special expenses and the health and care contributions you paid (${h.src('estg_10', 'section 10')}), then applies the 2026 schedule (${h.src('estg_32a', 'section 32a')}). For a married couple living on a single €2,400 pension, joint assessment halves the burden: ${h.eur(vh24.steuerMonat, 2)} instead of ${h.eur(b24.steuerMonat, 2)} a month. Enter company pensions, rent or wages as other income, after their own allowances.</p>
<h2>What the calculator leaves out</h2>
<p>Privately insured pensioners pay their own premium and get a subsidy from the pension insurer; under “More options” the calculator can drop the deduction, but it does not add the subsidy. The care contribution reduction for parents with several children under 25 is also left out, as it rarely applies to pensioners. If you receive a pension from your home country as well, German tax may take it into account for the rate even where it is exempt; that is beyond this tool.</p>`,
  },
});
