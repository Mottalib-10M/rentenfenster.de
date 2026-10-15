import { defineGuide } from '../../lib/guide-types';
import { hochrechnung, nettoStandard, epAusBrutto, epMax, monatsrente } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Rentenrechner brutto (§§ 64, 70 SGB VI): fünf Erwerbsverläufe hochgerechnet in heutigen Werten,
 * Wert eines Arbeitsjahres beim Durchschnittsentgelt und an der Beitragsbemessungsgrenze, Kindererziehung.
 */
const RW = P.rentenwert.ab_2026_07;
const RG = P.rechengroessen;
const BBG_JAHR = RG.bbg_rv_monat * 12;
const faelle = [
  { ep: 15, lohn: 30000, jahre: 25 },
  { ep: 20, lohn: 36000, jahre: 20 },
  { ep: 28, lohn: 48000, jahre: 12 },
  { ep: 35, lohn: 60000, jahre: 8 },
  { ep: 40, lohn: BBG_JAHR, jahre: 5 },
].map((f) => { const h = hochrechnung(f.ep, f.lohn, f.jahre, RW); return { ...f, h, n: nettoStandard(h.rente) }; });
const mittel = faelle[2];
const jahrDurchschnitt = monatsrente(epAusBrutto(RG.durchschnittsentgelt_2026_vorlaeufig), RW);
const jahrMax = monatsrente(epMax(), RW);
const kind = P.kindererziehung;
const kindEP = kind.ab_1992_monate * kind.ep_monat;
const kindRente = monatsrente(kindEP, RW);
const am = P.zugangsfaktor.abschlag_monat;
const ab24 = mittel.h.rente * (1 - 24 * am);

export default defineGuide({
  id: 'rentenrechner',
  group: 'hoehe',
  order: 50,
  tool: 'brutto',
  related: ['entgeltpunkte', 'renteninformation', 'rentenwert-2026', 'rentenrechner-brutto-netto', 'rentenluecke', 'rente-ausland'],
  sources: ['sgb6_64', 'sgb6_70', 'sgb6_67', 'drvWerte', 'drvRechengroessen', 'bmasAnpassung', 'sgb6_56', 'sgb6_210', 'vo883'],
  de: {
    slug: 'rentenrechner',
    nav: 'Rentenrechner',
    card: 'Bruttorente aus Ihren Entgeltpunkten und dem Lohn bis zum Rentenbeginn, in heutigen Euro.',
    title: 'Rentenrechner 2026: Rentenhöhe aus Entgeltpunkten berechnen',
    description: `Rentenrechner 2026: Entgeltpunkte aus der Renteninformation plus Punkte aus dem Lohn bis zur Rente, mal Rentenwert ${DE.eur(RW, 2)}. Brutto, Netto und Abschlag.`,
    h1: 'Rentenrechner: Ihre gesetzliche Rente hochrechnen',
    intro: 'Bisherige Entgeltpunkte, Jahresbrutto und Jahre bis zur Rente eingeben: Der Rechner rechnet die Bruttorente in heutigen Werten hoch und zeigt, was netto bleibt.',
    resume: `Die gesetzliche Rente berechnet sich aus vier Faktoren: Entgeltpunkte mal Zugangsfaktor mal Rentenartfaktor mal aktuellem Rentenwert (§ 64 SGB VI). Einen Entgeltpunkt bringt ein Jahr, in dem Sie genau das Durchschnittsentgelt verdienen, 2026 vorläufig ${DE.eur(RG.durchschnittsentgelt_2026_vorlaeufig)}; höchstens zählt der Lohn bis zur Beitragsbemessungsgrenze von ${DE.eur(RG.bbg_rv_monat)} im Monat, das sind ${DE.num(epMax(), 2)} Punkte im Jahr. Jeder Punkt ist seit dem 1. Juli 2026 ${DE.eur(RW, 2)} Monatsrente wert. Der Rechner nimmt die Punkte aus Ihrer Renteninformation und legt für jedes weitere Jahr die Punkte aus Ihrem heutigen Lohn dazu. Beispiel: 28 Punkte heute, ${DE.eur(mittel.lohn)} Jahresbrutto und 12 weitere Jahre ergeben ${DE.num(mittel.h.ep, 2)} Punkte und ${DE.eur(mittel.h.rente)} Bruttorente im Monat, alleinstehend bei Beginn 2026 rund ${DE.eur(mittel.n.netto)} netto. Gerechnet wird in heutigen Werten, ohne künftige Lohn- und Rentensteigerungen.`,
    faqs: [
      { q: 'Kann ich im Rentenrechner einen Abschlag für den früheren Beginn eintragen?', a: `Ja, im Feld „Abschlag“ in Prozent, höchstens ${DE.pct(48 * am, 1)}. Der Rechner kürzt dann die Bruttorente und rechnet das Netto aus dem gekürzten Betrag. Beim Beispiel mit ${DE.num(mittel.h.ep, 2)} Punkten werden aus ${DE.eur(mittel.h.rente)} bei ${DE.pct(24 * am, 1)} Abschlag ${DE.eur(ab24)}. Wie viele Monate vor dem Termin Sie gehen und welcher Satz daraus folgt, ermittelt der Abschlagsrechner.` },
      { q: 'Welche Zahl aus der Renteninformation gehört in den Rentenrechner?', a: 'Die Summe Ihrer bisher erworbenen Entgeltpunkte, wie sie die Renteninformation auf der ersten Seite und der Versicherungsverlauf ausweisen. Tragen Sie nicht einen Eurobetrag ein, sondern die Punkte: Der Rechner rechnet die künftigen Jahre aus Ihrem heutigen Lohn selbst hinzu. Fehlen im Verlauf Zeiten, etwa Ausbildung oder Kindererziehung, lohnt vorher eine Kontenklärung bei der Rentenversicherung.' },
      { q: 'Warum rechnet der Rentenrechner ohne künftige Lohnerhöhungen?', a: 'Weil Löhne und Rentenwert langfristig ungefähr im Gleichschritt steigen: Wer mehr verdient, bekommt nicht mehr Punkte, solange der Durchschnitt mitsteigt, und der Wert des Punktes wächst mit den Löhnen. In heutigen Euro bleibt das Ergebnis deshalb aussagekräftig. Es ist eine Schätzung; künftige Gesetzesänderungen oder Lücken im Erwerbsleben verändern es.' },
      { q: 'Wie nah liegt das Ergebnis am späteren Rentenbescheid?', a: 'So nah, wie Ihre Annahmen zutreffen. Der Rechner unterstellt bis zum Beginn denselben Lohn, nutzt das vorläufige Durchschnittsentgelt 2026 für alle künftigen Jahre und rechnet in heutigen Euro. Lohnsprünge, Teilzeit, Arbeitslosigkeit oder fehlende Zeiten im Versicherungsverlauf verschieben das Ergebnis. Verbindlich ist allein der Rentenbescheid; eine persönliche Prüfung bieten die Auskunfts- und Beratungsstellen der Rentenversicherung.' },
    ],
    body: (h) => `
<h2>Was der Rechner ausgibt</h2>
<p>Aus vier Angaben rechnet er Ihre Altersrente brutto: den bisherigen Entgeltpunkten, dem Jahresbrutto, den Jahren bis zum Rentenbeginn und einem möglichen Abschlag. Der Lohn wird durch das vorläufige Durchschnittsentgelt 2026 von ${h.eur(RG.durchschnittsentgelt_2026_vorlaeufig)} geteilt (${h.src('sgb6_70', '§ 70 SGB VI')}), höchstens bis zur Beitragsbemessungsgrenze von ${h.eur(BBG_JAHR)} im Jahr (${h.src('drvRechengroessen', 'Rechengrößen 2026')}). Die Summe der Punkte wird mit dem aktuellen Rentenwert multipliziert (${h.src('sgb6_64', '§ 64 SGB VI')}). Ausgegeben werden die Monatsrente, die Punkte pro Arbeitsjahr, der Wert eines Arbeitsjahres in Euro und eine Nettoschätzung nach Kranken- und Pflegebeitrag und Steuer.</p>
<h2>Die Werte, mit denen er rechnet</h2>
<p>Der Rentenwert beträgt seit dem 1. Juli 2026 ${h.eur(RW, 2)}, vorher ${h.eur(P.rentenwert.bis_2026_06, 2)}; die Anpassung lag bei ${h.pct(P.rentenwert.anpassung_2026, 2)} (${h.src('bmasAnpassung', 'BMAS')}, ${h.src('drvWerte', 'DRV')}). Das Durchschnittsentgelt für 2026 ist ein vorläufiger Wert; das letzte endgültige, für 2024, beträgt ${h.eur(RG.durchschnittsentgelt_2024)}. Der Rentenartfaktor ist für Altersrenten 1,0 (${h.src('sgb6_67', '§ 67 SGB VI')}); für Hinterbliebenen- und Erwerbsminderungsrenten gelten andere Faktoren, die dieser Rechner nicht anwendet. Wie der Rentenwert angepasst wird, erklärt die Seite ${h.a('rentenwert-2026', 'Rentenwert 2026')}.</p>
<h2>Fünf Erwerbsverläufe</h2>
${h.table(['Punkte heute', 'Jahresbrutto', 'Jahre bis Rente', 'Punkte pro Jahr', 'Punkte gesamt', 'Brutto', 'Netto'], faelle.map((f) => [h.num(f.ep), h.eur(f.lohn), f.jahre, h.num(f.h.epJahr, 4), h.num(f.h.ep, 2), h.eur(f.h.rente), h.eur(f.n.netto)]), 'Ohne Abschlag, Netto alleinstehend mit Kindern bei Beginn 2026, in heutigen Werten', ['r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Die letzte Zeile verdient genau an der Beitragsbemessungsgrenze; jeder Euro darüber würde nichts ändern. Ein Arbeitsjahr mit Durchschnittsverdienst ist ${h.eur(jahrDurchschnitt, 2)} Monatsrente wert, ein Jahr an der Grenze ${h.eur(jahrMax, 2)}. Kindererziehung kommt als Gutschrift hinzu, wenn sie noch nicht in Ihren Punkten steckt: ${kind.ab_1992_monate} Monate für ein ab 1992 geborenes Kind mit je ${h.num(kind.ep_monat, 4)} Punkten, zusammen ${h.num(kindEP, 2)} Punkte oder ${h.eur(kindRente, 2)} Monatsrente (${h.src('sgb6_56', '§ 56 SGB VI')}). Wie die Punkte entstehen, beschreibt ${h.a('entgeltpunkte', 'Entgeltpunkte')}.</p>
<h2>Grenzen</h2>
<p>Der Rechner unterstellt bis zum Rentenbeginn einen gleichbleibenden Lohn ohne Lücken. Teilzeit oder Jahre ohne versicherten Lohn, etwa in einer Selbstständigkeit ohne Versicherungspflicht, senken das Ergebnis. Ein Abschlag lässt sich bis ${h.pct(48 * P.zugangsfaktor.abschlag_monat)} eintragen; welcher für Sie gilt, zeigt der ${h.a('abschlag-rechner', 'Abschlagsrechner')}. Das Netto ist der Standardfall, Ihren eigenen rechnet der ${h.a('rentenrechner-brutto-netto', 'Rentenrechner brutto netto')}; die Differenz zu Ihrem Bedarf die ${h.a('rentenluecke', 'Rentenlücke')}. Verbindlich ist nur der Rentenbescheid.</p>`,
  },
  en: {
    slug: 'german-pension-calculator',
    nav: 'Pension calculator',
    card: 'Your gross German state pension from your pension points and pay until retirement, in today’s euros.',
    title: 'Pension calculator 2026: your German state pension in euros',
    description: `Pension calculator 2026: points from your German pension statement plus points from your pay until retirement, times the ${EN.eur(RW, 2)} pension value. Gross and net.`,
    h1: 'German state pension calculator',
    intro: 'Enter your pension points so far, your gross annual pay and the years until retirement: the calculator projects your gross pension in today’s money and shows what is left net.',
    resume: `A German state pension (gesetzliche Rente) is the product of four factors: pension points (Entgeltpunkte) times the access factor times the pension type factor times the current pension value (section 64 SGB VI). One point is earned for a year at exactly average pay, provisionally ${EN.eur(RG.durchschnittsentgelt_2026_vorlaeufig)} in 2026; pay counts only up to the contribution ceiling of ${EN.eur(RG.bbg_rv_monat)} a month, which caps you at ${EN.num(epMax(), 2)} points a year. Since 1 July 2026 each point is worth ${EN.eur(RW, 2)} of monthly pension. The calculator takes the points on your annual statement and adds the points your current pay earns for each further year. Example: 28 points today, ${EN.eur(mittel.lohn)} gross a year and 12 more years give ${EN.num(mittel.h.ep, 2)} points and a gross pension of ${EN.eur(mittel.h.rente)} a month, about ${EN.eur(mittel.n.netto)} net for a single person starting in 2026. Everything is in today’s values, without future pay or pension increases.`,
    faqs: [
      { q: 'Can I enter a reduction for retiring early in this calculator?', a: `Yes, in the “Reduction” field as a percentage, up to ${EN.pct(48 * am, 1)}. The tool then cuts the gross pension and works out the net figure from the reduced amount. In the example with ${EN.num(mittel.h.ep, 2)} points, ${EN.eur(mittel.h.rente)} becomes ${EN.eur(ab24)} with a ${EN.pct(24 * am, 1)} reduction. How many months early you go and which rate follows is shown by the reduction calculator.` },
      { q: 'Which figure from my German pension statement do I enter?', a: 'The total pension points earned so far, as shown on the first page of your annual statement (Renteninformation) and in your insurance record (Versicherungsverlauf). Enter points, not a euro amount: the calculator adds the future years from your current pay itself. If periods are missing from the record, such as training or childcare, ask the insurer to review your account (Kontenklärung) first.' },
      { q: 'I only worked a few years in Germany. Do I get a German pension?', a: 'You need five years of insurance for a German old-age pension. Periods in other EU and EEA countries and Switzerland count towards those five years, and Germany then pays the part earned here. If you do not reach five years and can no longer pay in, you can ask for your own share of contributions back once 24 months have passed since leaving the scheme; your insurance then ends.' },
      { q: 'How close is this estimate to my final pension decision?', a: 'As close as your assumptions turn out to be. The tool assumes the same pay until you retire, uses the provisional 2026 average pay for every future year and works in today’s euros. Pay rises, part-time work, unemployment or gaps in your insurance record change the result. Only the pension decision letter (Rentenbescheid) is binding; the insurer’s advice centres can check your own case.' },
    ],
    body: (h) => `
<h2>What the calculator shows</h2>
<p>It works out your gross old-age pension from four inputs: your points so far, your gross annual pay, the years until you retire and any reduction. Your pay is divided by the provisional 2026 average pay of ${h.eur(RG.durchschnittsentgelt_2026_vorlaeufig)} (${h.src('sgb6_70', 'section 70 SGB VI')}), capped at the contribution ceiling of ${h.eur(BBG_JAHR)} a year (${h.src('drvRechengroessen', '2026 reference values')}). The total is multiplied by the current pension value (${h.src('sgb6_64', 'section 64 SGB VI')}). You get the monthly pension, the points per working year, what one working year is worth in euros, and a net estimate after health and care contributions and tax.</p>
<h2>The values it uses</h2>
<p>The pension value (aktueller Rentenwert) has been ${h.eur(RW, 2)} since 1 July 2026, up from ${h.eur(P.rentenwert.bis_2026_06, 2)}, an increase of ${h.pct(P.rentenwert.anpassung_2026, 2)} (${h.src('bmasAnpassung', 'BMAS')}, ${h.src('drvWerte', 'DRV')}). The 2026 average pay is a provisional figure; the last final one, for 2024, is ${h.eur(RG.durchschnittsentgelt_2024)}. The pension type factor is 1.0 for old-age pensions (${h.src('sgb6_67', 'section 67 SGB VI')}); survivors’ and disability pensions use other factors that this tool does not apply. More on the pension value under ${h.a('rentenwert-2026', 'pension value 2026')}.</p>
<h2>Five working lives</h2>
${h.table(['Points today', 'Gross pay', 'Years left', 'Points a year', 'Total points', 'Gross', 'Net'], faelle.map((f) => [h.num(f.ep), h.eur(f.lohn), f.jahre, h.num(f.h.epJahr, 4), h.num(f.h.ep, 2), h.eur(f.h.rente), h.eur(f.n.netto)]), 'No reduction; net for a single person with children starting in 2026; today’s values', ['r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The last row earns exactly the contribution ceiling; any euro above it changes nothing. A working year at average pay is worth ${h.eur(jahrDurchschnitt, 2)} of monthly pension, a year at the ceiling ${h.eur(jahrMax, 2)}. Childcare credits are added if they are not yet in your points: ${kind.ab_1992_monate} months for a child born from 1992 at ${h.num(kind.ep_monat, 4)} points each, together ${h.num(kindEP, 2)} points or ${h.eur(kindRente, 2)} a month (${h.src('sgb6_56', 'section 56 SGB VI')}).</p>
<h2>If you have worked in more than one country</h2>
<p>Only years insured in Germany produce German pension points. Under ${h.src('vo883', 'Regulation 883/2004')}, periods in other EU and EEA countries and Switzerland are added together to meet the qualifying periods, and each country pays the share earned there, so this tool shows the German part only. If you leave Germany before five insured years and can neither be compulsorily nor voluntarily insured, the employee half of contributions can be refunded after 24 months (${h.src('sgb6_210', 'section 210 SGB VI')}); see ${h.a('rente-ausland', 'pensions and moving abroad')}.</p>
<h2>Limits</h2>
<p>The tool assumes the same pay every year with no gaps; part-time work or years without insured pay, such as uninsured self-employment, lower the result. You can enter a reduction of up to ${h.pct(48 * P.zugangsfaktor.abschlag_monat)}; the ${h.a('abschlag-rechner', 'reduction calculator')} shows which applies to you. The net figure is the standard case; the ${h.a('rentenrechner-brutto-netto', 'gross to net calculator')} works out yours and the ${h.a('rentenluecke', 'pension gap calculator')} compares it with what you need. Only the pension decision letter is binding.</p>`,
  },
});
