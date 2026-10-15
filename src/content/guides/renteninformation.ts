import { defineGuide } from '../../lib/guide-types';
import { nettoStandard, besteuerungsanteil, epAusBrutto } from '../../lib/engine/geld';
import { abschlag, regelalter } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/** Renteninformation lesen: bisher erreichte Rente, Hochrechnung, Entgeltpunkte; Umrechnung auf den Rentenwert ab Juli 2026. */
const RW = P.rentenwert.ab_2026_07;
const RWalt = P.rentenwert.bis_2026_06;
const f = RW / RWalt;
// Beispielschreiben aus dem ersten Halbjahr 2026, Versicherte geboren 1976 (Regelaltersgrenze 67, Rentenbeginn 2043).
const bisher = 1100, hoch = 1650;
const epBisher = bisher / RWalt, epHoch = hoch / RWalt;
const bisherNeu = epBisher * RW, hochNeu = epHoch * RW;
const startJahr = 1976 + regelalter(1976).j;
const anteilStart = besteuerungsanteil(startJahr);
const nHoch = nettoStandard(hochNeu, startJahr);
const nBisher = nettoStandard(bisherNeu, startJahr);
const ab48 = abschlag(48);
const hoch63 = hochNeu * (1 - ab48);
const KI = P.kindererziehung;
const kiEP = KI.ep_monat * KI.ab_1992_monate;
const jahrDurchschnitt = epAusBrutto(P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig);
const restJahre = startJahr - 2026;
const zuwachs = epHoch - epBisher;
const proJahr = zuwachs / restJahre;

export default defineGuide({
  id: 'renteninformation',
  group: 'hoehe',
  order: 130,
  mini: 'renteninfo',
  miniHref: 'rentenrechner',
  related: ['entgeltpunkte', 'rentenwert-2026', 'rentenrechner', 'rentenluecke', 'rentenrechner-brutto-netto', 'abschlag-rechner', 'ausgleichszahlung'],
  sources: ['sgb6_64', 'sgb6_70', 'drvWerte', 'sgb6_77', 'sgb6_187a', 'estg_22', 'sgb6_56', 'vo883'],
  de: {
    slug: 'renteninformation-lesen',
    nav: 'Renteninformation lesen',
    card: 'Bisher erreichte Rente, Hochrechnung, Entgeltpunkte: was die Zahlen im Schreiben bedeuten und was fehlt.',
    title: 'Renteninformation verstehen 2026: die Zahlen richtig lesen',
    description: `Renteninformation verstehen 2026: bisher erreichte Rente, Hochrechnung und Entgeltpunkte lesen, vom alten Rentenwert ${DE.eur(RWalt, 2)} umrechnen und netto schätzen.`,
    h1: 'Renteninformation verstehen: was die Beträge wirklich sagen',
    intro: 'Das Schreiben der Rentenversicherung nennt mehrere Rentenbeträge, alle brutto, alle zur Regelaltersgrenze. So lesen Sie heraus, was Ihnen zusteht, und rechnen es auf heute um.',
    resume: `Die Renteninformation nennt vor allem drei Zahlen: die Regelaltersrente, die Sie mit den bisher gespeicherten Zeiten schon erreicht haben, eine hochgerechnete Regelaltersrente für den Fall, dass Sie bis zur Regelaltersgrenze weiter Beiträge zahlen, und die Summe Ihrer Entgeltpunkte. Alle Beträge sind Bruttowerte ohne Abschlag, berechnet mit dem Rentenwert am Tag des Schreibens. Ein Schreiben aus dem ersten Halbjahr 2026 rechnet mit ${DE.eur(RWalt, 2)} je Punkt; seit dem 1. Juli gelten ${DE.eur(RW, 2)}. Teilen Sie die bisher erreichte Rente durch den Rentenwert des Schreibens, erhalten Sie Ihre Punkte: Aus 1.100 € werden so ${DE.num(epBisher, 2)} Punkte, heute ${DE.eur(bisherNeu, 2)} wert. Von einer Bruttorente gehen später Kranken- und Pflegebeitrag ab, dazu gegebenenfalls Steuer auf den Besteuerungsanteil des Startjahres. Wer früher als zur Regelaltersgrenze gehen will, verliert ${DE.pct(P.zugangsfaktor.abschlag_monat, 1)} je Monat, ab Jahrgang 1964 mit 63 also ${DE.pct(ab48, 1)}.`,
    faqs: [
      { q: 'Ist die Rente in der Renteninformation brutto oder netto?', a: `Brutto. Kranken- und Pflegebeitrag sowie eine mögliche Einkommensteuer sind nicht abgezogen. Für eine hochgerechnete Rente von ${DE.eur(hochNeu, 2)} bleiben im Standardfall bei Rentenbeginn ${startJahr} nach heutigen Sätzen und dem Tarif 2026 rund ${DE.eur(nHoch.netto)} im Monat. Wie viel es bei Ihnen ist, hängt von Krankenkasse, Kindern, weiteren Einkünften und Familienstand ab.` },
      { q: 'Welche Zahl in der Renteninformation zählt wirklich?', a: 'Sicher ist nur die bisher erreichte Rente: Sie beruht auf Zeiten, die schon auf Ihrem Konto stehen, und bleibt erhalten, auch wenn Sie ab morgen nichts mehr einzahlen. Die hochgerechnete Rente setzt voraus, dass Sie bis zur Regelaltersgrenze weiter ähnlich verdienen. Für Planungen ist es sinnvoll, mit beiden Werten zu rechnen und den Abstand als offenes Risiko zu sehen.' },
      { q: 'Wie rechne ich die Renteninformation auf den neuen Rentenwert um?', a: `Teilen Sie den Rentenbetrag durch den Rentenwert, der im Schreiben genannt ist, und multiplizieren Sie mit ${DE.eur(RW, 2)}. Bei einem Schreiben mit ${DE.eur(RWalt, 2)} entspricht das einem Faktor von ${DE.num(f, 4)}. Aus 1.650 € hochgerechneter Rente werden so ${DE.eur(hochNeu, 2)}. Künftige Erhöhungen sind darin nicht enthalten, weil ihre Höhe nicht feststeht.` },
      { q: 'Gilt die Rente aus der Renteninformation auch, wenn ich mit 63 gehe?', a: `Nein. Alle Beträge im Schreiben gelten für den Beginn zur Regelaltersgrenze. Wer früher geht, bekommt ${DE.pct(P.zugangsfaktor.abschlag_monat, 1)} weniger je Monat Vorlauf, und es fehlen die Beiträge der letzten Jahre. Ab Jahrgang 1964 kostet der Beginn mit 63 ${DE.pct(ab48, 1)}: Aus ${DE.eur(hochNeu, 2)} würden rechnerisch ${DE.eur(hoch63, 2)}, ohne die fehlenden Beitragsjahre.` },
      { q: 'Warum liegt die hochgerechnete Rente so weit über der bisher erreichten?', a: `Weil sie alle Beitragsjahre bis zur Regelaltersgrenze schon einrechnet. Im Beispiel dieser Seite stecken in der Differenz ${DE.num(zuwachs, 2)} Entgeltpunkte, die erst noch verdient werden müssen, rund ${DE.num(proJahr, 2)} im Jahr. Arbeitslosigkeit, Teilzeit, eine Selbstständigkeit ohne Rentenversicherung oder ein Umzug ins Ausland lassen diese Punkte kleiner ausfallen als angenommen.` },
      { q: 'Was tun, wenn in der Renteninformation Zeiten fehlen?', a: 'Die Beträge beruhen nur auf Zeiten, die der Rentenversicherung gemeldet sind. Fehlen etwa Kindererziehung, eine Ausbildung oder eine Beschäftigung, lohnt es sich, den Versicherungsverlauf anzufordern und die Lücken mit Nachweisen klären zu lassen. Dabei helfen die Auskunfts- und Beratungsstellen der Deutschen Rentenversicherung kostenlos. Je früher das geschieht, desto leichter sind Unterlagen noch zu finden.' },
    ],
    body: (h) => `
<h2>Drei Zahlen, drei verschiedene Aussagen</h2>
<p>Die Renteninformation wirkt wie eine Prognose, enthält aber Zahlen von sehr unterschiedlicher Sicherheit. Die erste ist die Rente, die Sie mit den heute gespeicherten Zeiten bereits erreicht haben. Sie ist ein Anspruch, kein Versprechen auf Wachstum: Selbst wenn Sie nie wieder einzahlen, steht Ihnen diese Regelaltersrente zu, sofern die Wartezeit von fünf Jahren erfüllt ist. Die zweite ist die hochgerechnete Rente, die künftige Beiträge bis zur Regelaltersgrenze unterstellt. Die dritte, Ihre Entgeltpunkte, ist die eigentliche Grundlage, denn aus ihr ergeben sich alle Beträge (${h.src('sgb6_64', '§ 64 SGB VI')}).</p>
${h.table(['Angabe im Schreiben', 'Woraus sie entsteht', 'Wie verlässlich'], [
      ['Bisher erreichte Regelaltersrente', 'Entgeltpunkte heute × Rentenwert des Schreibens', 'Bereits erworben'],
      ['Hochgerechnete Regelaltersrente', 'Dazu angenommene künftige Beiträge bis zur Regelaltersgrenze', 'Hängt an Ihrem weiteren Erwerbsleben'],
      ['Entgeltpunkte', 'Summe aller Jahre: Lohn durch Durchschnittsentgelt, dazu gutgeschriebene Zeiten', 'Stand des Kontos'],
      ['Rentenwert', 'Wert eines Punktes am Tag des Schreibens', 'Ändert sich jeden 1. Juli'],
    ], 'Die zentralen Angaben und wie man sie einordnet', ['l', 'l', 'l'])}
<h2>Rückwärts rechnen: vom Betrag zu den Punkten</h2>
<p>Ein Beispiel aus dem ersten Halbjahr 2026, geschrieben an eine 1976 geborene Versicherte: bisher erreicht 1.100 €, hochgerechnet 1.650 €, Rentenwert ${h.eur(RWalt, 2)}. Geteilt ergibt das ${h.num(epBisher, 2)} Punkte heute und ${h.num(epHoch, 2)} Punkte zur Regelaltersgrenze. Mit dem Rentenwert ab Juli 2026 entsprechen die beiden Beträge ${h.eur(bisherNeu, 2)} und ${h.eur(hochNeu, 2)}. Der Mini-Rechner oben macht diese Umrechnung mit Ihren eigenen Zahlen.</p>
<p>Aufschlussreich ist der Abstand: Die Hochrechnung unterstellt ${h.num(zuwachs, 2)} weitere Punkte in ${h.num(restJahre)} Jahren, rund ${h.num(proJahr, 2)} Punkte im Jahr. Zum Vergleich: Wer genau das Durchschnittsentgelt verdient, sammelt ${h.num(jahrDurchschnitt, 2)} Punkt im Jahr (${h.src('sgb6_70', '§ 70 SGB VI')}). Liegt die Annahme deutlich über dem, was Sie heute verdienen, ist die Hochrechnung zu optimistisch, liegt sie darunter, dürfen Sie mit mehr rechnen. Wie ein Lohn in Punkte umgerechnet wird, erklärt ${h.a('entgeltpunkte', 'Entgeltpunkte berechnen')}.</p>
<h2>Was im Schreiben nicht steht</h2>
<p>Die Renteninformation zeigt Bruttorenten. Kranken- und Pflegebeitrag gehen davon ab, und vom Besteuerungsanteil des Startjahres hängt ab, wie viel steuerpflichtig ist (${h.src('estg_22', '§ 22 EStG')}). Für die Versicherte aus dem Beispiel beginnt die Regelaltersrente ${startJahr}; dann sind ${h.pct(anteilStart, 1)} der Rente steuerpflichtig.</p>
${h.table(['Betrag laut Schreiben, umgerechnet', 'Brutto', 'Kranken- und Pflegebeitrag', 'Steuer im Monatsschnitt', 'Netto'], [
      ['Bisher erreicht', h.eur(bisherNeu, 2), h.eur(nBisher.sozial, 2), h.eur(nBisher.steuerMonat, 2), h.eur(nBisher.netto)],
      ['Hochgerechnet', h.eur(hochNeu, 2), h.eur(nHoch.sozial, 2), h.eur(nHoch.steuerMonat, 2), h.eur(nHoch.netto)],
    ], `Rentenbeginn ${startJahr}, alleinstehend, mit Kindern, heutige Beitragssätze und Steuertarif 2026`, ['l', 'r', 'r', 'r', 'r'])}
<p>Ebenfalls nicht enthalten sind künftige Rentenerhöhungen und die Inflation; beide werden bewusst ausgeklammert, weil sie niemand kennt. Den Netto-Betrag mit Ihren Angaben rechnet der ${h.a('rentenrechner-brutto-netto', 'Rentenrechner brutto netto')}, den Abstand zu Ihrem Bedarf der ${h.a('rentenluecke', 'Rentenlücken-Rechner')}.</p>
<h2>Die Zahlen gelten nur für den Beginn mit der Regelaltersgrenze</h2>
<p>Jede Rente im Schreiben unterstellt, dass Sie mit der Regelaltersgrenze in Rente gehen. Ein früherer Beginn kostet ${h.pct(P.zugangsfaktor.abschlag_monat, 1)} je Monat (${h.src('sgb6_77', '§ 77 SGB VI')}), ab Jahrgang 1964 mit 63 also ${h.pct(ab48, 1)}. Aus der hochgerechneten Rente von ${h.eur(hochNeu, 2)} würden so ${h.eur(hoch63, 2)}, und das ist noch zu hoch, weil die Beiträge der letzten vier Jahre fehlen, mit denen die Hochrechnung rechnet. Den Abschlag für Ihren Wunschtermin zeigt der ${h.a('abschlag-rechner', 'Abschlagsrechner')}. Wer ihn ausgleichen will, kann ab 50 eine Auskunft über den nötigen Betrag verlangen (${h.src('sgb6_187a', '§ 187a SGB VI')}); mehr unter ${h.a('ausgleichszahlung', 'Ausgleichszahlung')}.</p>
<h2>Den Versicherungsverlauf prüfen</h2>
<p>Die Beträge sind nur so vollständig wie Ihr Konto. Typische Lücken: Kindererziehungszeiten, die nie beantragt wurden, Ausbildungsjahre, kurze Beschäftigungen, Zeiten im Ausland. Kindererziehung allein macht für ein ab 1992 geborenes Kind ${h.num(kiEP, 2)} Punkte aus, ${h.eur(kiEP * RW, 2)} Monatsrente (${h.src('sgb6_56', '§ 56 SGB VI')}). Fehlt so etwas, lohnt es sich, den Versicherungsverlauf anzufordern und die Zeiten mit Nachweisen nachzutragen. Die Auskunfts- und Beratungsstellen der Deutschen Rentenversicherung helfen dabei; diese Seite ersetzt keine Beratung im Einzelfall.</p>
<h2>Auslandszeiten: in der Wartezeit ja, im Betrag nein</h2>
<p>Wer in einem anderen EU-Staat, im EWR oder in der Schweiz gearbeitet hat, sieht diese Jahre nicht in den deutschen Beträgen. Sie zählen nach ${h.src('vo883', 'Verordnung 883/2004')} für die Wartezeiten mit, die Rente dafür zahlt aber der andere Staat. Die Renteninformation zeigt also nur den deutschen Teil Ihrer späteren Gesamtrente. Mehr unter ${h.a('rente-ausland', 'Rente im Ausland')}.</p>
<h2>Mit den Zahlen weiterrechnen</h2>
<p>Ihre Entgeltpunkte aus dem Schreiben sind der beste Startwert für jede eigene Rechnung. Der ${h.a('rentenrechner', 'Rentenrechner')} nimmt sie als Ausgangspunkt und rechnet mit Ihrem heutigen Lohn bis zum Rentenbeginn weiter, in heutigen Werten. So lässt sich auch prüfen, was eine Gehaltsänderung, eine Teilzeitphase oder ein früherer Ausstieg an der Hochrechnung verändert. Wie der Rentenwert seit Juli 2026 aussieht, steht unter ${h.a('rentenwert-2026', 'Rentenerhöhung 2026')}.</p>`,
  },
  en: {
    slug: 'reading-your-pension-statement',
    nav: 'Reading your pension statement',
    card: 'Earned pension, projection, points: what the figures in your German statement mean and what they leave out.',
    title: 'Reading Your Pension Statement 2026: Renteninformation Guide',
    description: `Reading your pension statement in 2026: the Renteninformation’s earned pension, projection and points, converted to the ${EN.eur(RW, 2)} value and to net. For expats.`,
    h1: 'Reading your German pension statement: what the figures really say',
    intro: 'The letter from the German pension insurer lists several pension amounts, all gross, all at the standard retirement age. Here is what each means, how to update it to today and what it leaves out.',
    resume: `The German pension statement (Renteninformation) gives three key figures: the standard old-age pension you have already earned from the periods on record, a projected standard pension assuming you keep contributing until the standard retirement age, and your total pension points (Entgeltpunkte). All amounts are gross, without any early-retirement reduction, and use the pension value (Rentenwert) on the date of the letter. A statement from the first half of 2026 uses ${EN.eur(RWalt, 2)} per point; since 1 July the value is ${EN.eur(RW, 2)}. Divide the earned pension by the letter’s pension value and you have your points: €1,100 becomes ${EN.num(epBisher, 2)} points, worth ${EN.eur(bisherNeu, 2)} today. Health and long-term care contributions later come off a gross pension, plus income tax on the taxable share for the year you start. Retiring before the standard age costs ${EN.pct(P.zugangsfaktor.abschlag_monat, 1)} per month, ${EN.pct(ab48, 1)} at 63 for anyone born from 1964. Work done in other EU countries is not in the German figures at all.`,
    faqs: [
      { q: 'Are the amounts on a German pension statement before or after deductions?', a: `Before. Health and care contributions and any income tax have not been taken off. For a projected pension of ${EN.eur(hochNeu, 2)} starting in ${startJahr}, about ${EN.eur(nHoch.netto)} a month remains in the standard case at today’s rates and the 2026 tax schedule. Your own figure depends on your health fund, children, other income and marital status.` },
      { q: 'Which figure on the Renteninformation can I actually rely on?', a: 'Only the pension already earned is secure: it rests on periods already on your account and stays yours even if you stop contributing tomorrow, provided you meet the five-year qualifying period. The projection assumes you keep earning much as you do now until the standard age. For planning, work with both figures and treat the gap between them as an open risk.' },
      { q: 'How do I update an older statement to the July 2026 pension value?', a: `Divide the pension amount by the pension value stated in the letter, then multiply by ${EN.eur(RW, 2)}. For a letter using ${EN.eur(RWalt, 2)} that is a factor of ${EN.num(f, 4)}, so a €1,650 projection becomes ${EN.eur(hochNeu, 2)}. Future increases are not included, because nobody knows how large they will be.` },
      { q: 'Does my statement show the pension I earned in other EU countries?', a: 'No. It covers German periods only. Under Regulation 883/2004, insurance periods in other EU and EEA states and Switzerland count towards the German qualifying periods, but each country pays its own pension for its own periods. Your total retirement income will be the German amount plus whatever the other countries pay, each shown in their own statements.' },
      { q: 'What if periods are missing from my German pension record?', a: 'The amounts only reflect periods reported to the pension insurer. If child-raising, training or a job is missing, request your insurance record (Versicherungsverlauf) and have the gaps clarified with evidence. The advice centres of the German pension insurer help free of charge. Act early, while documents are still easy to find.' },
    ],
    body: (h) => `
<h2>Three figures, three different messages</h2>
<p>The statement reads like a forecast, but its figures carry very different levels of certainty. The first is the pension already earned from the periods recorded today. It is an entitlement, not a growth promise: even if you never contribute again, this standard old-age pension (Regelaltersrente) is yours once the five-year qualifying period is met. The second is the projected pension, which assumes further contributions until the standard retirement age. The third, your pension points, is the real basis, since every amount follows from it (${h.src('sgb6_64', 'section 64 SGB VI')}).</p>
${h.table(['German term on the letter', 'In English', 'How far to rely on it'], [
      ['Regelaltersrente, bisher erreicht', 'Standard pension earned so far: points today × the letter’s pension value', 'Already earned'],
      ['Regelaltersrente, hochgerechnet', 'Projected standard pension: adds assumed future contributions', 'Depends on your future career'],
      ['Entgeltpunkte', 'Pension points: each year’s pay over average earnings, plus credited periods', 'State of your account'],
      ['Aktueller Rentenwert', 'Pension value: what one point pays per month on the letter’s date', 'Changes every 1 July'],
      ['Versicherungsverlauf', 'Insurance record: the list of all periods on file', 'Check it for gaps'],
    ], 'Key terms and how to weigh them', ['l', 'l', 'l'])}
<h2>Working backwards: from amounts to points</h2>
<p>Take a statement from the first half of 2026 sent to someone born in 1976: €1,100 earned so far, €1,650 projected, pension value ${h.eur(RWalt, 2)}. Dividing gives ${h.num(epBisher, 2)} points today and ${h.num(epHoch, 2)} at the standard age. At the value from July 2026, the two amounts are worth ${h.eur(bisherNeu, 2)} and ${h.eur(hochNeu, 2)}. The mini calculator above does this with your own figures.</p>
<p>The gap is revealing. The projection assumes ${h.num(zuwachs, 2)} more points over ${h.num(restJahre)} years, about ${h.num(proJahr, 2)} a year. Someone on exactly average earnings collects ${h.num(jahrDurchschnitt, 2)} point a year (${h.src('sgb6_70', 'section 70 SGB VI')}). If the assumption sits well above what you earn now, the projection is too optimistic; if it sits below, you can expect more. How pay converts into points is on ${h.a('entgeltpunkte', 'pension points explained')}.</p>
<h2>What the statement leaves out</h2>
<p>The statement shows gross pensions. Health and long-term care contributions come off, and the taxable share depends on the year your pension starts (${h.src('estg_22', 'section 22 EStG')}). For the person in the example, the standard pension starts in ${startJahr}, when ${h.pct(anteilStart, 1)} of it will be taxable.</p>
${h.table(['Amount on the letter, updated', 'Gross', 'Health and care', 'Tax, monthly average', 'Net'], [
      ['Earned so far', h.eur(bisherNeu, 2), h.eur(nBisher.sozial, 2), h.eur(nBisher.steuerMonat, 2), h.eur(nBisher.netto)],
      ['Projected', h.eur(hochNeu, 2), h.eur(nHoch.sozial, 2), h.eur(nHoch.steuerMonat, 2), h.eur(nHoch.netto)],
    ], `Pension from ${startJahr}, single, with children, today’s contribution rates and 2026 tax schedule, living in Germany`, ['l', 'r', 'r', 'r', 'r'])}
<p>Future pension increases and inflation are not included either; both are left out on purpose, since nobody knows them. The ${h.a('rentenrechner-brutto-netto', 'net pension calculator')} works out net with your own details, and the ${h.a('rentenluecke', 'pension gap calculator')} compares the result with what you will need.</p>
<h2>All figures assume you retire at the standard age</h2>
<p>Every amount on the statement assumes your pension starts at the standard retirement age. Starting earlier costs ${h.pct(P.zugangsfaktor.abschlag_monat, 1)} per month (${h.src('sgb6_77', 'section 77 SGB VI')}), so ${h.pct(ab48, 1)} at 63 for anyone born from 1964. The ${h.eur(hochNeu, 2)} projection would shrink to ${h.eur(hoch63, 2)}, and that is still too high, because the last four years of contributions built into the projection would be missing. The ${h.a('abschlag-rechner', 'reduction calculator')} shows the cost for your chosen date. To offset it, you can ask for a written estimate of the amount needed from age 50 (${h.src('sgb6_187a', 'section 187a SGB VI')}); see ${h.a('ausgleichszahlung', 'buying out pension reductions')}.</p>
<h2>Check your insurance record</h2>
<p>The amounts are only as complete as your account. Typical gaps: child-raising periods never claimed, training years, short jobs, time abroad. Child-raising alone is worth ${h.num(kiEP, 2)} points for a child born from 1992, ${h.eur(kiEP * RW, 2)} of monthly pension (${h.src('sgb6_56', 'section 56 SGB VI')}). If something is missing, request the record and have the periods added with evidence. The German pension insurer’s advice centres (Auskunfts- und Beratungsstellen) help with this; this page cannot advise on individual cases.</p>
<h2>For expats: one statement among several</h2>
<p>If you have worked in another EU state, the EEA or Switzerland, those years are not in the German amounts. Under ${h.src('vo883', 'Regulation 883/2004')} they count towards German qualifying periods, but the other country pays the pension for them. Your German statement therefore shows only the German slice of your retirement income; your other countries send their own. If you left Germany after a few years, the statement may also show an earned pension small enough that the question of a refund arises; that is covered on ${h.a('rente-ausland', 'German pension abroad')}.</p>
<p>Your points from the letter are the best starting value for any calculation of your own. The ${h.a('rentenrechner', 'German pension calculator')} takes them and adds your current pay year by year until retirement, in today’s values, so you can see what a pay change, a part-time spell or an earlier exit does to the projection. The current pension value is explained under ${h.a('rentenwert-2026', 'pension increase 2026')}.</p>`,
  },
});
