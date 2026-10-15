import { defineGuide } from '../../lib/guide-types';
import { luecke, nettoStandard } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Rentenlücke: fünf Haushalte, Nettorente aus dem Motor (Beginn 2026, alleinstehend, mit Kindern), Kapital bei 0 und 2 % Zins. */
const fall = (nettoLohn: number, anteil: number, rente: number, jahre: number, zins: number) => {
  const nr = nettoStandard(rente);
  const wunsch = (nettoLohn * anteil) / 100;
  return { nettoLohn, anteil, rente, jahre, zins, nr, wunsch, l: luecke(wunsch, nr.netto, jahre, zins / 100) };
};
const basis = fall(2600, 80, 1700, 22, 2);
const ohneZins = fall(2600, 80, 1700, 22, 0);
const faelle = [basis, fall(2000, 85, 1300, 20, 2), fall(3200, 75, 1900, 25, 2), fall(4000, 70, 2400, 22, 3)];
const kurz = fall(2600, 80, 1700, 18, 2);
const rwPlus = P.rentenwert.anpassung_2026;

export default defineGuide({
  id: 'rentenluecke',
  group: 'hoehe',
  order: 60,
  tool: 'luecke',
  related: ['rentenrechner', 'rentenrechner-brutto-netto', 'renteninformation', 'entgeltpunkte', 'rentenwert-2026', 'hinzuverdienst'],
  sources: ['sgb6_64', 'drvWerte', 'sgb5_249a', 'sgb11_59', 'estg_22', 'estg_32a'],
  de: {
    slug: 'rentenluecke-rechner',
    nav: 'Rentenlücke',
    card: 'Wie viel Netto im Alter fehlt und welches Kapital die Lücke über die Ruhestandsjahre schließt.',
    title: 'Rentenlücke berechnen 2026: Bedarf, Nettorente, Kapital',
    description: 'Rentenlücke berechnen 2026: Wunsch-Netto aus dem heutigen Lohn, Nettorente nach Kranken-, Pflegebeitrag und Steuer, Kapitalbedarf mit Zins. Mit Beispielen.',
    h1: 'Rentenlücke berechnen: was im Alter monatlich fehlt',
    intro: 'Heutigen Nettolohn, den gewünschten Anteil davon und die erwartete Bruttorente eingeben: Der Rechner zeigt die monatliche Lücke und das Kapital, das sie schließt.',
    resume: `Die Rentenlücke ist der Abstand zwischen dem Netto, das Sie im Ruhestand brauchen, und der Nettorente, die tatsächlich ankommt. Der Rechner bildet beides getrennt: Den Bedarf setzen Sie als Anteil des heutigen Nettolohns an, die Rente geben Sie brutto ein, und er zieht davon Kranken- und Pflegebeitrag sowie die geschätzte Einkommensteuer nach dem Tarif 2026 ab, für einen Rentenbeginn 2026 als alleinstehende Person mit Kindern. Wer heute ${DE.eur(basis.nettoLohn)} netto verdient und ${DE.num(basis.anteil)} Prozent davon braucht, plant mit ${DE.eur(basis.wunsch)}. Eine Bruttorente von ${DE.eur(basis.rente)} ergibt ${DE.eur(basis.nr.netto)} netto, es fehlen also ${DE.eur(basis.l.monat)} im Monat oder ${DE.eur(basis.l.jahr)} im Jahr. Über ${DE.num(basis.jahre)} Ruhestandsjahre deckt das ein Kapital von ${DE.eur(basis.l.kapital)}, wenn der Rest mit ${DE.num(basis.zins)} Prozent verzinst wird; ohne Zins wären es ${DE.eur(ohneZins.l.kapital)}. Alle Beträge sind heutige Euro.`,
    faqs: [
      { q: 'Warum rechnet der Rentenlücken-Rechner mit der Nettorente statt mit dem Bruttobetrag aus der Renteninformation?', a: `Weil vom Bruttobetrag noch Kranken- und Pflegebeitrag und gegebenenfalls Einkommensteuer abgehen. Bei ${DE.eur(basis.rente)} brutto bleiben im Standardfall ${DE.eur(basis.nr.netto)}, also ${DE.eur(basis.rente - basis.nr.netto)} weniger. Wer die Bruttorente direkt vom Wunsch-Netto abzieht, unterschätzt die Lücke um genau diesen Betrag, Monat für Monat und über den ganzen Ruhestand.` },
      { q: 'Welcher Anteil des heutigen Nettolohns ist als Bedarf im Alter realistisch?', a: 'Eine gesetzliche Größe dafür gibt es nicht. Der Rechner startet mit 80 Prozent, weil im Ruhestand Fahrtkosten und Sparraten oft wegfallen. Wer zur Miete wohnt, Angehörige unterstützt oder viel reisen möchte, sollte eher 90 bis 100 Prozent ansetzen; wer schuldenfrei im eigenen Haus lebt, kommt mit weniger aus. Am verlässlichsten ist eine Liste Ihrer heutigen festen Ausgaben.' },
      { q: 'Was bewirkt der Zins beim Kapitalbedarf?', a: `Das Kapital wird während des Ruhestands nach und nach verbraucht; der noch nicht entnommene Teil kann weiter Zinsen bringen. Bei ${DE.eur(basis.l.monat)} Lücke über ${DE.num(basis.jahre)} Jahre senken ${DE.num(basis.zins)} Prozent Zins den Bedarf von ${DE.eur(ohneZins.l.kapital)} auf ${DE.eur(basis.l.kapital)}. Der Rechner zieht auf die Entnahmen keine Steuer ab und rechnet ohne Inflation.` },
      { q: 'Wird die Rentenlücke durch künftige Rentenerhöhungen kleiner?', a: `Die Renten steigen jedes Jahr zum 1. Juli, 2026 um ${DE.pct(rwPlus, 2)}. Im gleichen Zeitraum steigen aber meist auch Preise und Löhne. Der Rechner hält deshalb alles in heutigen Euro: Rente, Bedarf und Kapital. Eine Erhöhung, die nur die Teuerung ausgleicht, ändert an der so berechneten Lücke nichts.` },
    ],
    body: (h) => `
<h2>Was der Rechner aus Ihren fünf Angaben macht</h2>
<p>Zuerst der Bedarf: Nettolohn mal gewünschter Anteil. Dann die Rente: Ihre erwartete Bruttorente, gekürzt um den halben allgemeinen Krankenkassenbeitrag und den halben durchschnittlichen Zusatzbeitrag (${h.src('sgb5_249a', '§ 249a SGB V')}), um den Pflegebeitrag von ${h.pct(h.P.pv.satz, 1)}, den Rentner allein tragen (${h.src('sgb11_59', '§ 59 SGB XI')}), und um die Einkommensteuer auf den Besteuerungsanteil eines Rentenbeginns 2026 (${h.src('estg_22', '§ 22 EStG')}, Tarif nach ${h.src('estg_32a', '§ 32a')}). Die Differenz ist die monatliche Lücke. Zuletzt das Kapital: der Barwert dieser Lücke über die eingegebenen Ruhestandsjahre, wobei das Restkapital mit dem gewählten Zins weiterläuft.</p>
<h2>Beispiele aus dem Rechner</h2>
${h.table(['Nettolohn heute', 'Bedarf', 'Rente brutto', 'Rente netto', 'Lücke im Monat', 'Jahre, Zins', 'Kapital'], faelle.map((f) => [h.eur(f.nettoLohn), h.eur(f.wunsch), h.eur(f.rente), h.eur(f.nr.netto), h.eur(f.l.monat), `${h.num(f.jahre)} / ${h.pct(f.zins / 100, 0)}`, h.eur(f.l.kapital)]), 'Rentenbeginn 2026, alleinstehend, mit Kindern, durchschnittlicher Zusatzbeitrag; heutige Euro', ['r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Ruhestandsdauer wiegt schwer: Im ersten Beispiel sinkt der Kapitalbedarf bei ${h.num(kurz.jahre)} statt ${h.num(basis.jahre)} Jahren auf ${h.eur(kurz.l.kapital)}. Wer die Dauer zu knapp ansetzt, plant für ein langes Leben zu wenig ein.</p>
<h2>Woher die Bruttorente kommt</h2>
<p>Die Rente selbst rechnet dieses Werkzeug nicht aus; Sie geben sie ein. Die beste Quelle ist die Hochrechnung in Ihrer Renteninformation, die ${h.a('renteninformation', 'Seite zur Renteninformation')} erklärt, welche Zeile gemeint ist. Ohne Renteninformation schätzt der ${h.a('rentenrechner', 'Rentenrechner')} den Bruttobetrag aus Ihren ${h.a('entgeltpunkte', 'Entgeltpunkten')}: Punkte mal Rentenwert, der seit Juli 2026 bei ${h.eur(h.P.rentenwert.ab_2026_07, 2)} liegt (${h.src('drvWerte', 'Deutsche Rentenversicherung')}, Formel nach ${h.src('sgb6_64', '§ 64 SGB VI')}). Gehen Sie früher in Rente, setzen Sie den Betrag nach Abschlag ein, denn der Abschlag gilt lebenslang und vergrößert die Lücke dauerhaft.</p>
<h2>Grenzen der Rechnung</h2>
<p>Der Rechner kennt nur eine gesetzliche Rente und unterstellt, dass Sie allein veranlagt werden. Betriebsrente, Mieteinnahmen oder eine Rente aus einem anderen Land ziehen Sie am einfachsten vorher vom Bedarf ab. Ehepaare rechnen die Steuer gemeinsam; den genauen Abzug zeigt der ${h.a('rentenrechner-brutto-netto', 'Rechner brutto netto')}. Inflation, Steuer auf Kapitalerträge und Kosten einer Geldanlage bleiben außen vor. Wer nach der Regelaltersgrenze weiterarbeitet, verkleinert die Lücke durch Lohn und neue Punkte; was dabei gilt, steht unter ${h.a('hinzuverdienst', 'Hinzuverdienst')}. Eine persönliche Beratung ersetzt das Ergebnis nicht; kostenlos beraten die Auskunfts- und Beratungsstellen der Rentenversicherung.</p>`,
  },
  en: {
    slug: 'pension-gap-calculator',
    nav: 'Pension gap',
    card: 'How much net income you will be short in retirement and the capital that closes the gap.',
    title: 'Pension Gap Germany 2026: Monthly Shortfall and Capital',
    description: 'Pension gap in Germany for 2026: target net income from today’s pay, net state pension after health, care and tax, and the capital to close it, with examples.',
    h1: 'Pension gap calculator for people working in Germany',
    intro: 'Enter your current net pay, the share of it you want in retirement and your expected gross German pension: the calculator shows the monthly gap and the capital that covers it.',
    resume: `Your pension gap (Rentenlücke) is the difference between the net income you will need in retirement and the net German statutory pension that actually reaches your account. The calculator works out both sides separately. Your need is a share of today’s net pay; your pension goes in gross, and the tool deducts health and long-term care contributions plus estimated income tax under the 2026 schedule, assuming the pension starts in 2026 and you are single with children. Earning ${EN.eur(basis.nettoLohn)} net today and needing ${EN.num(basis.anteil)}% of it means a target of ${EN.eur(basis.wunsch)}. A gross pension of ${EN.eur(basis.rente)} leaves ${EN.eur(basis.nr.netto)} net, so ${EN.eur(basis.l.monat)} is missing every month, ${EN.eur(basis.l.jahr)} a year. Over ${EN.num(basis.jahre)} years of retirement a pot of ${EN.eur(basis.l.kapital)} closes that gap if the remainder earns ${EN.num(basis.zins)}% interest; with no interest you would need ${EN.eur(ohneZins.l.kapital)}. All amounts are in today’s euros.`,
    faqs: [
      { q: 'Why does the gap calculator use my net pension rather than the gross figure on my statement?', a: `Because health and care contributions, and possibly income tax, still come off the gross figure. In the standard case ${EN.eur(basis.rente)} gross leaves ${EN.eur(basis.nr.netto)}, which is ${EN.eur(basis.rente - basis.nr.netto)} less. Subtracting the gross pension straight from your target understates the gap by that amount every single month of retirement.` },
      { q: 'I will also get a pension from another EU country. How do I include it?', a: 'Under the EU coordination rules each country where you worked pays its own share, and Germany pays only for your German periods. The calculator takes one German gross pension. Subtract the expected net amount of your other pension from your target first, then enter the German figure. The tax effect of a foreign pension in Germany is not modelled here.' },
      { q: 'What share of my current net pay should I plan for?', a: 'There is no official figure. The calculator starts at 80%, since commuting costs and savings often stop in retirement. If you rent, support relatives or plan to travel home often, 90 to 100% is safer; if you own your home outright you may need less. A list of your fixed monthly costs today is the most reliable starting point.' },
      { q: 'Will annual pension increases shrink the gap?', a: `German pensions rise every 1 July, by ${EN.pct(rwPlus, 2)} in 2026. Prices and wages usually rise over the same period, though. The calculator therefore keeps everything in today’s euros: pension, need and capital. An increase that only matches inflation leaves the gap calculated this way unchanged.` },
    ],
    body: (h) => `
<h2>What the calculator does with your five inputs</h2>
<p>First your need: net pay times the share you choose. Then the pension: your expected gross German pension minus half the general health rate and half the average extra rate (${h.src('sgb5_249a', 'section 249a SGB V')}), minus long-term care at ${h.pct(h.P.pv.satz, 1)}, which pensioners pay alone (${h.src('sgb11_59', 'section 59 SGB XI')}), and minus income tax on the taxable share for a pension starting in 2026 (${h.src('estg_22', 'section 22 Income Tax Act')}, schedule under ${h.src('estg_32a', 'section 32a')}). The difference is the monthly gap. Last, the capital: the present value of that gap over your years in retirement, with the unspent balance earning the interest rate you enter.</p>
<h2>Worked examples</h2>
${h.table(['Net pay today', 'Need', 'Gross pension', 'Net pension', 'Monthly gap', 'Years, interest', 'Capital'], faelle.map((f) => [h.eur(f.nettoLohn), h.eur(f.wunsch), h.eur(f.rente), h.eur(f.nr.netto), h.eur(f.l.monat), `${h.num(f.jahre)} / ${h.pct(f.zins / 100, 0)}`, h.eur(f.l.kapital)]), 'Pension starting 2026, single, with children, average extra health rate; today’s euros', ['r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The length of retirement matters a lot: in the first example, ${h.num(kurz.jahre)} years instead of ${h.num(basis.jahre)} cuts the capital needed to ${h.eur(kurz.l.kapital)}. Planning for too short a retirement leaves you short if you live long.</p>
<h2>Where the gross pension figure comes from</h2>
<p>This tool does not calculate the pension itself; you supply it. The best source is the projection in your annual statement (Renteninformation), and the ${h.a('renteninformation', 'guide to the pension statement')} shows which line to use. Without one, the ${h.a('rentenrechner', 'German pension calculator')} estimates the gross amount from your ${h.a('entgeltpunkte', 'pension points')}: points times the pension value, ${h.eur(h.P.rentenwert.ab_2026_07, 2)} since July 2026 (${h.src('drvWerte', 'German Pension Insurance')}, formula in ${h.src('sgb6_64', 'section 64 SGB VI')}). If you plan to retire early, enter the reduced amount, as the reduction lasts for life and widens the gap permanently.</p>
<h2>Limits of the calculation</h2>
<p>The calculator handles one statutory pension and assumes you are taxed as a single person. Company pensions, rent or a pension from another country are easiest to deduct from your need beforehand. Married couples are taxed jointly; the ${h.a('rentenrechner-brutto-netto', 'gross to net calculator')} shows the exact deduction. Inflation, tax on investment income and fund charges are left out. Working on past the standard retirement age narrows the gap through wages and new points; see ${h.a('hinzuverdienst', 'working while drawing a pension')}. The result is not personal advice; the pension insurer’s information and advice centres (Auskunfts- und Beratungsstellen) offer that free of charge.</p>`,
  },
});
