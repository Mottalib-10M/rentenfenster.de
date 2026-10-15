import { defineGuide } from '../../lib/guide-types';
import { epAusBrutto, epMax, monatsrente, hochrechnung, ausgleich } from '../../lib/engine/geld';
import { abschlag } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/** Entgeltpunkte: Jahreslohn durch Durchschnittsentgelt (§ 70 SGB VI), Rentenformel (§ 64). Beispiele aus dem Motor. */
const RW = P.rentenwert.ab_2026_07;
const RWalt = P.rentenwert.bis_2026_06;
const RG = P.rechengroessen;
const DS = RG.durchschnittsentgelt_2026_vorlaeufig;
const DS24 = RG.durchschnittsentgelt_2024;
const BBGJ = RG.bbg_rv_monat * 12;
const AN = RG.beitragssatz_rv / 2;
const KI = P.kindererziehung;
const max = epMax();
const zeilen = [24000, 36000, DS, 75000, 120000].map((l) => ({ l, ep: epAusBrutto(l) }));
const ep30 = epAusBrutto(30000);
const ep45 = epAusBrutto(45000);
const ep45v24 = 45000 / DS24;
const kiEP = KI.ep_monat * KI.ab_1992_monate;
const kiEPalt = KI.ep_monat * KI.vor_1992_monate;
const hr = hochrechnung(22, 45000, 14, RW);
const preis = ausgleich(1, 0, RW).proEP;
const zf48 = 1 - abschlag(48);
const ziel1500 = 1500 / RW;
const ziel1500frueh = 1500 / (RW * zf48);
const ep40 = monatsrente(40, RW);
const ep40frueh = monatsrente(40, RW, zf48);
const ep40witwe = monatsrente(40, RW, 1, P.witwe.gross_faktor);
const ep40em = monatsrente(40, RW, 1, P.em.rentenartfaktor_teil);
const teilzeit = epAusBrutto(18000);

export default defineGuide({
  id: 'entgeltpunkte',
  group: 'hoehe',
  order: 120,
  mini: 'ep',
  miniHref: 'rentenrechner',
  related: ['rentenrechner', 'renteninformation', 'rentenwert-2026', 'ausgleichszahlung', 'renteneintrittsalter-frauen', 'hinzuverdienst', 'rente-ausland'],
  sources: ['sgb6_70', 'sgb6_64', 'sgb6_63', 'sgb6_67', 'drvRechengroessen', 'drvWerte', 'sgb6_56', 'sgb6_249', 'sgb6_187', 'sgb6_66'],
  de: {
    slug: 'entgeltpunkte-berechnen',
    nav: 'Entgeltpunkte',
    card: `Wie aus dem Jahreslohn Rentenpunkte werden und was ein Punkt seit Juli 2026 wert ist: ${DE.eur(RW, 2)}.`,
    title: 'Entgeltpunkte berechnen 2026: was ein Rentenpunkt wert ist',
    description: `Entgeltpunkte berechnen 2026: Bruttolohn geteilt durch ${DE.eur(DS)} Durchschnittsentgelt, ein Punkt bringt ${DE.eur(RW, 2)} Rente im Monat. Formel, Tabelle und Beispiele.`,
    h1: 'Entgeltpunkte berechnen: vom Jahreslohn zur Monatsrente',
    intro: 'Jedes Beitragsjahr hinterlässt auf dem Rentenkonto eine Zahl mit vier Nachkommastellen. Wie sie entsteht und was sie später auszahlt, zeigt diese Seite mit Ihrem eigenen Lohn.',
    resume: `Entgeltpunkte, umgangssprachlich Rentenpunkte, sind die Rechengröße der gesetzlichen Rente. Für jedes Kalenderjahr teilt die Rentenversicherung den beitragspflichtigen Bruttolohn durch das Durchschnittsentgelt aller Versicherten; wer genau den Durchschnitt verdient, erhält einen Punkt (§ 70 SGB VI). Für 2026 gilt vorläufig ein Durchschnittsentgelt von ${DE.eur(DS)}. Lohn oberhalb der Beitragsbemessungsgrenze von ${DE.eur(BBGJ)} im Jahr zählt nicht, deshalb bringt ein Jahr höchstens ${DE.num(max, 4)} Punkte. Ein Punkt ist seit dem 1. Juli 2026 ${DE.eur(RW, 2)} Monatsrente wert, bis Juni waren es ${DE.eur(RWalt, 2)}. Wer 45.000 € verdient, sammelt 2026 ${DE.num(ep45, 4)} Punkte und damit ${DE.eur(ep45 * RW, 2)} Rente im Monat allein aus diesem Jahr. Die Monatsrente ergibt sich aus der Summe aller Punkte mal Zugangsfaktor, Rentenartfaktor und aktuellem Rentenwert (§ 64). Ein ab 1992 geborenes Kind bringt über ${KI.ab_1992_monate} Monate Kindererziehungszeit zusammen ${DE.num(kiEP, 2)} Punkte, ohne dass dafür Lohn fließt.`,
    faqs: [
      { q: 'Wie viele Rentenpunkte bekomme ich für 2.500 € brutto im Monat?', a: `Zwölf Monate mal 2.500 € ergeben 30.000 € im Jahr. Geteilt durch das vorläufige Durchschnittsentgelt 2026 von ${DE.eur(DS)} sind das ${DE.num(ep30, 4)} Entgeltpunkte. Mit dem Rentenwert ab Juli 2026 entspricht das ${DE.eur(ep30 * RW, 2)} Monatsrente brutto für dieses eine Jahr. Ihr eigener Beitragsanteil darauf beträgt ${DE.eur(30000 * AN)}.` },
      { q: 'Wie viel Rente bringt ein Entgeltpunkt im Jahr 2026?', a: `Bis Juni 2026 waren es ${DE.eur(RWalt, 2)}, seit dem 1. Juli ${DE.eur(RW, 2)} Monatsrente brutto, also rund ${DE.eur(RW * 12)} im Jahr. Davon gehen noch Kranken- und Pflegebeitrag ab, gegebenenfalls Steuer. Dieser Wert gilt für eine Regelaltersrente ohne Abschlag; bei vorzeitigem Beginn mindert der Zugangsfaktor, bei einer Witwenrente der Rentenartfaktor den Betrag.` },
      { q: 'Wie viele Entgeltpunkte braucht man für 1.500 € Rente?', a: `Ohne Abschlag ${DE.num(ziel1500, 1)} Punkte, denn 1.500 € geteilt durch ${DE.eur(RW, 2)} ergeben diesen Wert. Wer mit 63 und ${DE.pct(abschlag(48), 1)} Abschlag beginnt, braucht für denselben Bruttobetrag ${DE.num(ziel1500frueh, 1)} Punkte. Zum Vergleich: Ein Jahr mit Durchschnittslohn bringt genau einen Punkt, 35 solcher Jahre reichen also nicht ganz für 1.500 € brutto.` },
      { q: 'Kann man fehlende Entgeltpunkte nachkaufen?', a: `Zum Ausgleich eines Abschlags ja: Bis zur Regelaltersgrenze lassen sich Sonderzahlungen leisten, nachdem die Rentenversicherung den Betrag in einer Auskunft genannt hat (§ 187a SGB VI). Ein Punkt kostet 2026 ${DE.eur(preis, 2)}, das ist der volle Beitragssatz auf ein Durchschnittsentgelt; bei vorzeitigem Beginn wird er noch durch den Zugangsfaktor geteilt. Teilzahlungen sind möglich, eine Erstattung nicht.` },
      { q: 'Sind Rentenpunkte und Entgeltpunkte dasselbe?', a: 'Ja. Das Gesetz spricht von Entgeltpunkten, im Alltag und auf vielen Rechnerseiten heißen sie Rentenpunkte. Gemeint ist immer dieselbe Zahl auf Ihrem Versicherungskonto. Auch die Renteninformation weist die bisher gesammelten Punkte aus. Mit dem Rentenwert multipliziert ergeben sie die Bruttorente, die bis heute erarbeitet ist.' },
      { q: 'Bringen Arbeitsjahre in Frankreich oder Polen deutsche Entgeltpunkte?', a: 'Nein. Entgeltpunkte entstehen nur aus Beiträgen zur deutschen Rentenversicherung. Zeiten in einem anderen EU- oder EWR-Staat und in der Schweiz zählen nach der Verordnung 883/2004 für die Wartezeiten mit, etwa für die fünf Jahre der Regelaltersrente. Die Rente für diese Zeiten zahlt aber der jeweilige Staat nach seinen eigenen Regeln.' },
    ],
    body: (h) => `
<h2>Die Rechnung hinter einem Punkt</h2>
<p>Die Rentenversicherung bewertet jedes Kalenderjahr einzeln. Ihr beitragspflichtiger Bruttolohn wird durch das Durchschnittsentgelt desselben Jahres geteilt (${h.src('sgb6_70', '§ 70 SGB VI')}). Für 2026 liegt dieser Wert vorläufig bei ${h.eur(DS)} (${h.src('drvRechengroessen', 'Sozialversicherungsrechengrößen 2026')}). Ein Jahr mit genau diesem Lohn ergibt 1,0000 Punkte, ein halber Durchschnittslohn 0,5000. Begrenzt wird das Ganze durch die Beitragsbemessungsgrenze von ${h.eur(RG.bbg_rv_monat)} im Monat: Wer mehr verdient, zahlt auf den Rest keine Rentenbeiträge und bekommt dafür auch keine Punkte.</p>
${h.table(['Bruttolohn im Jahr', 'Entgeltpunkte 2026', 'Monatsrente aus diesem Jahr', 'Ihr Beitragsanteil'], zeilen.map(({ l, ep }) => [h.eur(l), h.num(ep, 4), h.eur(ep * RW, 2), h.eur(Math.min(l, BBGJ) * AN)]), `Durchschnittsentgelt 2026 vorläufig, Rentenwert ab Juli 2026, Arbeitnehmeranteil ${h.pct(AN, 1)}`, ['r', 'r', 'r', 'r'])}
<p>Die letzte Zeile zeigt die Kappung: 120.000 € bringen nicht mehr Punkte als ${h.eur(BBGJ)}, nämlich ${h.num(max, 4)}. Den Beitrag teilen sich Beschäftigte und Arbeitgeber, der Satz von ${h.pct(RG.beitragssatz_rv, 1)} wird je zur Hälfte getragen.</p>
<h2>Warum derselbe Lohn nicht immer gleich viel zählt</h2>
<p>Das Durchschnittsentgelt steigt mit den Löhnen. Für 2024 steht es endgültig bei ${h.eur(DS24)}; 45.000 € brachten damals ${h.num(ep45v24, 4)} Punkte, 2026 sind es mit demselben Lohn nur ${h.num(ep45, 4)}. Wer über Jahre kein höheres Gehalt bekommt, rutscht also relativ ab und sammelt Jahr für Jahr etwas weniger. Umgekehrt steigt der Wert jedes bereits gesammelten Punktes mit dem Rentenwert, der zum 1. Juli angepasst wird; die aktuelle Erhöhung erläutert ${h.a('rentenwert-2026', 'Rentenwert 2026')}.</p>
<p>Für das laufende Jahr arbeitet die Rentenversicherung mit dem vorläufigen Wert. Der Mini-Rechner oben und der ${h.a('rentenrechner', 'Rentenrechner')} tun dasselbe; beide rechnen in heutigen Werten, ohne künftige Lohn- oder Rentensteigerung.</p>
<h2>Von den Punkten zur Monatsrente</h2>
<p>Die Rentenformel multipliziert vier Größen (${h.src('sgb6_64', '§ 64 SGB VI')}): die Summe Ihrer Entgeltpunkte, den Zugangsfaktor, den Rentenartfaktor und den aktuellen Rentenwert. Der Zugangsfaktor ist 1,0 bei Beginn mit der Regelaltersgrenze und sinkt um ${h.pct(P.zugangsfaktor.abschlag_monat, 1)} je Monat früher. Der Rentenartfaktor hängt von der Rentenart ab (${h.src('sgb6_67', '§ 67')}). Wie stark das ausmacht, zeigt ein Konto mit 40 Punkten:</p>
${h.table(['Rente aus 40 Entgeltpunkten', 'Zugangsfaktor', 'Rentenartfaktor', 'Monatsrente brutto'], [
      ['Regelaltersrente', h.num(1, 3), h.num(1, 2), h.eur(ep40, 2)],
      ['Altersrente mit 63, Jahrgang 1964', h.num(zf48, 3), h.num(1, 2), h.eur(ep40frueh, 2)],
      ['Große Witwenrente aus diesem Konto', h.num(1, 3), h.num(P.witwe.gross_faktor, 2), h.eur(ep40witwe, 2)],
      ['Teilweise Erwerbsminderungsrente', h.num(1, 3), h.num(P.em.rentenartfaktor_teil, 2), h.eur(ep40em, 2)],
    ], 'Rentenwert ab 1. Juli 2026, ohne Zurechnungszeit', ['l', 'r', 'r', 'r'])}
<p>Die Witwenrente ist hier vereinfacht: Hinterbliebene erhalten die Punkte des Verstorbenen, auf die dann noch eigenes Einkommen angerechnet werden kann. Bei der Erwerbsminderungsrente kommen Punkte für die Zurechnungszeit dazu; das rechnet der ${h.a('erwerbsminderungsrente', 'Erwerbsminderungsrechner')}.</p>
<h2>Punkte ohne Lohn: Kindererziehung</h2>
<p>Für die ersten Lebensjahre eines Kindes schreibt die Rentenversicherung einem Elternteil Punkte gut, als hätte er durchschnittlich verdient: ${h.num(KI.ep_monat, 4)} Punkte je Monat (${h.src('sgb6_56', '§ 56 SGB VI')}). Für Kinder ab 1992 gibt es ${KI.ab_1992_monate} Monate, zusammen ${h.num(kiEP, 2)} Punkte oder ${h.eur(kiEP * RW, 2)} Monatsrente. Für früher geborene Kinder sind es ${KI.vor_1992_monate} Monate (${h.src('sgb6_249', '§ 249')}), also ${h.num(kiEPalt, 2)} Punkte und ${h.eur(kiEPalt * RW, 2)}. Wer in diesen Jahren zusätzlich arbeitet, bekommt die Punkte aus dem Lohn obendrauf, bis zur Beitragsbemessungsgrenze. Was das für den Rentenbeginn von Müttern bedeutet, steht unter ${h.a('renteneintrittsalter-frauen', 'Renteneintrittsalter Frauen')}.</p>
<h2>Teilzeit und Lücken in Punkten gedacht</h2>
<p>Eine Teilzeitstelle mit 18.000 € im Jahr bringt ${h.num(teilzeit, 4)} Punkte, also ${h.eur(teilzeit * RW, 2)} Monatsrente je Jahr. Zehn solcher Jahre ergeben ${h.eur(teilzeit * RW * 10, 2)}, zehn Jahre mit Durchschnittslohn dagegen ${h.eur(RW * 10, 2)}. Der Unterschied wirkt ein Leben lang, deshalb lohnt der Blick auf das eigene Konto früh. Ihre bisherigen Punkte stehen in der Renteninformation; wie man sie dort findet, erklärt ${h.a('renteninformation', 'Renteninformation lesen')}.</p>
<h2>Hochrechnen: wo die Reise hingeht</h2>
<p>Wer heute 22 Punkte hat und noch 14 Jahre mit 45.000 € arbeitet, kommt in heutigen Werten auf ${h.num(hr.ep, 2)} Punkte und ${h.eur(hr.rente, 2)} Monatsrente brutto. Das ist eine Rechnung ohne Lohnsteigerung und ohne Rentenanpassung; beide heben sich über die Jahre teilweise auf, weil höhere Löhne auch das Durchschnittsentgelt anheben. Der ${h.a('rentenrechner', 'Rentenrechner')} rechnet diese Hochrechnung mit Ihren Zahlen, der ${h.a('rentenluecke', 'Rentenlücken-Rechner')} stellt sie Ihrem Bedarf gegenüber.</p>
<h2>Punkte zukaufen und nach Rentenbeginn weitersammeln</h2>
<p>Einen Punkt zu kaufen kostet 2026 ${h.eur(preis, 2)}: der volle Beitragssatz auf ein Durchschnittsentgelt (${h.src('sgb6_187', '§ 187 SGB VI')}). Das geht vor allem als Ausgleichszahlung für einen geplanten Abschlag, die ${h.a('ausgleichszahlung', 'Ausgleichszahlung')} rechnet die Summe. Und wer neben der Altersrente weiter beschäftigt ist und Beiträge zahlt, erwirbt weitere Punkte; sie erhöhen die Rente jeweils zum 1. Juli des Folgejahres (${h.src('sgb6_66', '§ 66 Abs. 3a SGB VI')}). Mehr dazu unter ${h.a('hinzuverdienst', 'Hinzuverdienst zur Rente')}.</p>
<p>Für Beschäftigte, die nur einige Jahre in Deutschland arbeiten: Die Punkte bleiben auf dem Konto, auch nach dem Wegzug. Ob sie später als Rente oder als Beitragserstattung zurückkommen, hängt an der Wartezeit von fünf Jahren; das erklärt ${h.a('rente-ausland', 'Rente im Ausland')}.</p>`,
  },
  en: {
    slug: 'pension-points-explained',
    nav: 'Pension points',
    card: `How a year’s pay turns into German pension points, and what one point pays since July 2026: ${EN.eur(RW, 2)}.`,
    title: 'Pension Points 2026: How Entgeltpunkte Turn Pay Into Pension',
    description: `Pension points 2026: gross pay divided by average earnings of ${EN.eur(DS)}; one point pays ${EN.eur(RW, 2)} a month. Formula, worked table and examples for expat workers.`,
    h1: 'Pension points explained: from your salary to a German pension',
    intro: 'Every year you pay into the German system leaves a figure with four decimals on your pension account. Here is how it is worked out and what it will pay, with your own salary.',
    resume: `German statutory pensions are counted in pension points (Entgeltpunkte). For each calendar year the pension insurer divides your gross pay subject to contributions by the average earnings of all insured people (Durchschnittsentgelt); earn exactly the average and you get one point (section 70 SGB VI). For 2026 the provisional average is ${EN.eur(DS)}. Pay above the contribution ceiling (Beitragsbemessungsgrenze) of ${EN.eur(BBGJ)} a year does not count, so one year yields at most ${EN.num(max, 4)} points. Since 1 July 2026 one point is worth ${EN.eur(RW, 2)} of monthly pension; until June it was ${EN.eur(RWalt, 2)}. On a salary of €45,000 you collect ${EN.num(ep45, 4)} points in 2026, or ${EN.eur(ep45 * RW, 2)} a month from that one year. The pension is the sum of your points multiplied by the access factor, the pension type factor and the current pension value (section 64). Points stay on your German account if you move away; whether you later get a pension or a refund depends on the five-year qualifying period.`,
    faqs: [
      { q: 'How many German pension points does a €60,000 salary earn?', a: `Divide €60,000 by the provisional 2026 average of ${EN.eur(DS)} and you get ${EN.num(epAusBrutto(60000), 4)} points. At the pension value from July 2026 that adds ${EN.eur(epAusBrutto(60000) * RW, 2)} of gross monthly pension for that single year. Your employee share of contributions on it is ${EN.eur(60000 * AN)}, with your employer paying the same again.` },
      { q: 'What is one Entgeltpunkt worth in euros?', a: `${EN.eur(RW, 2)} of gross monthly pension from 1 July 2026, ${EN.eur(RWalt, 2)} before that, so roughly ${EN.eur(RW * 12)} a year per point. Health and long-term care contributions still come off, and possibly income tax. That figure applies to an unreduced old-age pension; an early start lowers it through the access factor, a survivor’s pension through the pension type factor.` },
      { q: 'Do years worked in another EU country earn German pension points?', a: 'No. Points arise only from contributions to the German scheme. Under Regulation 883/2004, periods in other EU and EEA states and Switzerland are added to German periods to check qualifying periods such as the five years for the standard pension. Each country then pays its own pension for its own periods, under its own formula.' },
      { q: 'Is there a cap on how many points I can earn in a year?', a: `Yes. Pay is counted only up to the contribution ceiling of ${EN.eur(RG.bbg_rv_monat)} a month, ${EN.eur(BBGJ)} a year in 2026. That limits one year to ${EN.num(max, 4)} points, worth ${EN.eur(max * RW, 2)} of monthly pension. A senior engineer on €150,000 earns exactly the same number of points as a colleague on the ceiling.` },
      { q: 'Can I buy extra pension points before I retire?', a: `To offset a planned early-retirement reduction, yes: special payments are possible up to the standard retirement age once the pension insurer has stated the amount in a written estimate (section 187a SGB VI). One point costs ${EN.eur(preis, 2)} in 2026, the full contribution rate on average earnings, and more if the pension starts early. Part payments are allowed; refunds are not.` },
      { q: 'How many points do I need for a €1,500 German pension?', a: `Without a reduction, ${EN.num(ziel1500, 1)} points: €1,500 divided by ${EN.eur(RW, 2)}. Starting at 63 with a ${EN.pct(abschlag(48), 1)} reduction you would need ${EN.num(ziel1500frueh, 1)} points for the same gross amount. One year at average pay earns one point, so even 35 such years fall a little short.` },
    ],
    body: (h) => `
<h2>The sum behind one point</h2>
<p>The German pension insurer values each calendar year on its own. Your gross pay subject to contributions is divided by the average earnings for the same year (${h.src('sgb6_70', 'section 70 SGB VI')}). For 2026 the provisional figure is ${h.eur(DS)} (${h.src('drvRechengroessen', 'social insurance reference values 2026')}). A year at exactly that pay gives 1.0000 points, half of it 0.5000. The contribution ceiling of ${h.eur(RG.bbg_rv_monat)} a month caps everything: above it you pay no pension contributions and earn no points.</p>
${h.table(['Gross pay a year', 'Points for 2026', 'Monthly pension from that year', 'Your contribution share'], zeilen.map(({ l, ep }) => [h.eur(l), h.num(ep, 4), h.eur(ep * RW, 2), h.eur(Math.min(l, BBGJ) * AN)]), `Provisional 2026 average, pension value from July 2026, employee share ${h.pct(AN, 1)}`, ['r', 'r', 'r', 'r'])}
<p>The last row shows the cap: €120,000 earns no more than ${h.eur(BBGJ)}, namely ${h.num(max, 4)} points. The ${h.pct(RG.beitragssatz_rv, 1)} contribution rate is split equally between you and your employer, which is why the right-hand column shows only half.</p>
<h2>Why the same salary counts for less over time</h2>
<p>Average earnings rise with wages. The final figure for 2024 is ${h.eur(DS24)}; €45,000 earned ${h.num(ep45v24, 4)} points that year, but in 2026 the same salary earns only ${h.num(ep45, 4)}. If your pay stays flat for years, you slip relative to the average and collect slightly fewer points each year. On the other side, every point you already hold gains value whenever the pension value rises on 1 July; the latest increase is covered on ${h.a('rentenwert-2026', 'pension value 2026')}.</p>
<p>For the current year the insurer works with the provisional value. The mini calculator above and the ${h.a('rentenrechner', 'German pension calculator')} do the same, in today’s values, with no future pay rises or pension increases.</p>
<h2>From points to a monthly pension</h2>
<p>The pension formula multiplies four figures (${h.src('sgb6_64', 'section 64 SGB VI')}): your total points, the access factor (Zugangsfaktor), the pension type factor (Rentenartfaktor) and the current pension value (aktueller Rentenwert). The access factor is 1.0 if you start at the standard retirement age and falls by ${h.pct(P.zugangsfaktor.abschlag_monat, 1)} for each month earlier. The pension type factor depends on the kind of pension (${h.src('sgb6_67', 'section 67')}). Take an account holding 40 points:</p>
${h.table(['Pension from 40 points', 'Access factor', 'Type factor', 'Gross monthly pension'], [
      ['Standard old-age pension', h.num(1, 3), h.num(1, 2), h.eur(ep40, 2)],
      ['Old-age pension at 63, born 1964', h.num(zf48, 3), h.num(1, 2), h.eur(ep40frueh, 2)],
      ['Large widow’s pension from this account', h.num(1, 3), h.num(P.witwe.gross_faktor, 2), h.eur(ep40witwe, 2)],
      ['Partial disability pension', h.num(1, 3), h.num(P.em.rentenartfaktor_teil, 2), h.eur(ep40em, 2)],
    ], 'Pension value from 1 July 2026, no added period', ['l', 'r', 'r', 'r'])}
<p>The survivor row is simplified: a widow or widower receives a share of the deceased’s points, and their own income may then be partly offset. A disability pension also adds points for the added period up to a set age; the ${h.a('erwerbsminderungsrente', 'disability pension calculator')} handles that.</p>
<h2>Points without pay: raising children</h2>
<p>For a child’s first years, one parent is credited as if they had earned the average: ${h.num(KI.ep_monat, 4)} points per month (${h.src('sgb6_56', 'section 56 SGB VI')}). Children born from 1992 bring ${KI.ab_1992_monate} months, ${h.num(kiEP, 2)} points or ${h.eur(kiEP * RW, 2)} of monthly pension. For earlier children it is ${KI.vor_1992_monate} months (${h.src('sgb6_249', 'section 249')}), ${h.num(kiEPalt, 2)} points and ${h.eur(kiEPalt * RW, 2)}. If you also work in those years, points from your pay are added on top, up to the ceiling. What this means for mothers’ retirement dates is on ${h.a('renteneintrittsalter-frauen', 'retirement age for women')}.</p>
<h2>Part-time work and gaps, counted in points</h2>
<p>A part-time job at €18,000 a year earns ${h.num(teilzeit, 4)} points, ${h.eur(teilzeit * RW, 2)} of monthly pension per year. Ten such years add ${h.eur(teilzeit * RW * 10, 2)}, ten years at average pay ${h.eur(RW * 10, 2)}. The difference lasts for life. Your points so far appear on your annual statement; ${h.a('renteninformation', 'reading your pension statement')} shows where.</p>
<h2>Projecting forward</h2>
<p>Someone holding 22 points who works another 14 years on €45,000 reaches ${h.num(hr.ep, 2)} points and ${h.eur(hr.rente, 2)} of gross monthly pension in today’s values. That projection ignores pay rises and pension increases; the two partly cancel out, since higher wages also lift average earnings. The ${h.a('rentenrechner', 'pension calculator')} runs it with your figures, and the ${h.a('rentenluecke', 'pension gap calculator')} sets it against what you will need.</p>
<h2>Buying points, and earning more after you retire</h2>
<p>One point costs ${h.eur(preis, 2)} to buy in 2026: the full contribution rate applied to average earnings (${h.src('sgb6_187', 'section 187 SGB VI')}). In practice this is done as a payment to offset a planned reduction; see ${h.a('ausgleichszahlung', 'buying out pension reductions')}. And if you keep working in employment while drawing an old-age pension and contributions are paid, you earn further points; they are added each 1 July of the following year (${h.src('sgb6_66', 'section 66(3a) SGB VI')}). More under ${h.a('hinzuverdienst', 'working while drawing a pension')}.</p>
<h2>If you leave Germany</h2>
<p>Your points stay on your German account after you move. With five qualifying years, counting EU, EEA and Swiss periods, they turn into a German pension paid to you abroad; with fewer, a refund of your contribution share can be possible in certain cases. The details, and the mini calculator comparing both, are on ${h.a('rente-ausland', 'German pension abroad')}.</p>`,
  },
});
