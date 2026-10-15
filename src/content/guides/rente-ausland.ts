import { defineGuide } from '../../lib/guide-types';
import { epAusBrutto } from '../../lib/engine/geld';
import { regelalter } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/** Deutsche Rente im Ausland: EU-Koordinierung (VO 883/2004), Beitragserstattung (§ 210 SGB VI). Rechnung wie im Mini-Rechner „erstattung“. */
const RW = P.rentenwert.ab_2026_07;
const RG = P.rechengroessen;
const E = P.erstattung;
const WZ = E.allgemeine_wartezeit_jahre;
const anteil = (lohn: number, jahre: number) => Math.min(lohn, RG.bbg_rv_monat * 12) * RG.beitragssatz_rv / 2 * jahre;
const rente = (lohn: number, jahre: number) => epAusBrutto(lohn) * jahre * RW;
const L = 60000;
const reihe = [2, 3, 4, 6, 10].map((j) => ({ j, erst: anteil(L, j), rente: rente(L, j), offen: j < WZ }));
const e4 = anteil(L, 4), r4 = rente(L, 4);
const jahreGleich = e4 / (r4 * 12);
const r3 = rente(L, 3);
const r8 = rente(45000, 8);
const rg64 = regelalter(1964).j;

export default defineGuide({
  id: 'rente-ausland',
  group: 'hoehe',
  order: 145,
  mini: 'erstattung',
  miniHref: 'rentenrechner',
  related: ['entgeltpunkte', 'renteninformation', 'rentenwert-2026', 'rente-beantragen', 'renteneintrittsalter-tabelle', 'rentenrechner'],
  sources: ['vo883', 'sgb6_210', 'sgb6_50', 'sgb6_35', 'sgb6_70', 'sgb6_99', 'drvWerte'],
  de: {
    slug: 'rente-im-ausland',
    nav: 'Rente im Ausland',
    card: 'Deutsche Rente im EU-Ausland ohne Kürzung, Zeiten werden zusammengerechnet; Erstattung nur unter fünf Jahren.',
    title: 'Deutsche Rente im Ausland 2026: EU-Regeln und Erstattung',
    description: `Deutsche Rente im Ausland 2026: in EU, EWR, Schweiz ohne Kürzung gezahlt, Zeiten zusammengerechnet. Beitragserstattung nach § 210 SGB VI, wenn ${WZ} Jahre fehlen.`,
    h1: 'Deutsche Rente im Ausland: Zahlung, Zusammenrechnung, Erstattung',
    intro: 'Ob Sie im Ruhestand nach Spanien ziehen oder nach einigen Jahren Arbeit Deutschland wieder verlassen: Für Ihre deutschen Beiträge gibt es klare Regeln, innerhalb Europas besonders klare.',
    resume: `Eine deutsche Rente wird auch ins Ausland gezahlt. Innerhalb der EU, des EWR und der Schweiz regelt das die Verordnung (EG) Nr. 883/2004: Versicherungszeiten aus allen Mitgliedstaaten werden für die Wartezeiten zusammengerechnet, jeder Staat zahlt die Rente für seine eigenen Zeiten, und eine Kürzung, weil Sie in einem anderen Mitgliedstaat wohnen, ist ausgeschlossen. Wer etwa drei Jahre in Deutschland und drei in Frankreich gearbeitet hat, erfüllt so die allgemeine Wartezeit von ${WZ} Jahren (§ 50 SGB VI) und bekommt aus Deutschland eine kleine Rente für drei Jahre. Außerhalb dieses Raums hängt alles vom Staat und einem möglichen Sozialversicherungsabkommen ab. Wer die ${WZ} Jahre nicht erreicht, nicht mehr versicherungspflichtig ist und sich nicht freiwillig versichern darf, kann nach ${E.wartemonate} Monaten die Erstattung seiner Beiträge beantragen (§ 210 SGB VI). Erstattet wird nur der eigene Anteil, also die Hälfte der gezahlten Beiträge; danach besteht aus diesen Zeiten kein Rentenanspruch mehr. Bei 60.000 € Lohn wären das für vier Jahre rund ${DE.eur(e4)}.`,
    faqs: [
      { q: 'Wird die deutsche Rente gekürzt, wenn ich nach Spanien ziehe?', a: 'Nein. Innerhalb der EU, des EWR und der Schweiz verbietet die Verordnung 883/2004 jede Kürzung wegen des Wohnorts. Sie erhalten dieselbe Bruttorente wie in Deutschland, inklusive aller Rentenanpassungen. Was sich ändern kann, sind Kranken- und Pflegeversicherung und die Besteuerung; dazu sollten Sie sich vor dem Umzug bei den zuständigen Stellen erkundigen.' },
      { q: 'Kann ich mir meine Rentenbeiträge auszahlen lassen, wenn ich Deutschland verlasse?', a: `Nur unter engen Bedingungen: Die allgemeine Wartezeit von ${WZ} Jahren ist nicht erfüllt, Sie sind nicht mehr versicherungspflichtig, dürfen sich auch nicht freiwillig versichern, und seit dem Ende der Versicherungspflicht sind ${E.wartemonate} Monate vergangen (§ 210 SGB VI). Erstattet wird nur Ihr Arbeitnehmeranteil, nicht der Beitrag des Arbeitgebers. Danach sind die deutschen Zeiten endgültig erloschen.` },
      { q: 'Zählen meine Jahre in Polen für die deutsche Rente mit?', a: `Für die Wartezeiten ja, für den Betrag nein. Nach der Verordnung 883/2004 werden Versicherungszeiten aus Polen und allen anderen EU-, EWR-Staaten und der Schweiz zusammengerechnet, um zu prüfen, ob Sie etwa die ${WZ} Jahre für die Regelaltersrente erreichen. Die deutsche Rente selbst berechnet sich nur aus Ihren deutschen Entgeltpunkten, die polnische Rente zahlt Polen.` },
      { q: 'Was gilt für eine deutsche Rente in der Türkei oder den USA?', a: 'Außerhalb der EU, des EWR und der Schweiz gibt es keine einheitliche Regel. Ob Zeiten zusammengerechnet werden und wie die Rente gezahlt wird, hängt vom Staat und davon ab, ob Deutschland mit ihm ein Sozialversicherungsabkommen geschlossen hat. Diese Seite trifft dazu keine Aussage für einzelne Länder; verbindlich Auskunft gibt die Deutsche Rentenversicherung im Einzelfall.' },
      { q: 'Bleiben meine Rentenpunkte erhalten, wenn ich auswandere?', a: 'Ja. Bereits erworbene Entgeltpunkte bleiben auf Ihrem deutschen Konto, egal wie lange Sie im Ausland leben. Sie werden zur Rente, sobald Sie die deutsche Altersgrenze erreichen und die Wartezeit erfüllt ist, notfalls mit Zeiten aus EU- und EWR-Staaten oder der Schweiz. Durch den Wegzug entgehen Ihnen nur weitere deutsche Punkte; die vorhandenen werden nicht gekürzt.' },
      { q: 'Lohnt sich die Beitragserstattung oder eine spätere kleine Rente?', a: `Das hängt von Ihrer Lebenserwartung und von der Frage ab, ob Sie die ${WZ} Jahre über andere Staaten doch noch erreichen. Bei vier Jahren mit 60.000 € stehen rund ${DE.eur(e4)} Erstattung einer Rente von ${DE.eur(r4, 2)} im Monat gegenüber, gerechnet in heutigen Werten. Die Erstattung entspricht etwa ${DE.num(jahreGleich, 1)} Jahren dieser Rente, ohne Zinsen und Steuern.` },
    ],
    body: (h) => `
<h2>Im Ruhestand ins EU-Ausland</h2>
<p>Für den Umzug innerhalb Europas gilt die ${h.src('vo883', 'Verordnung (EG) Nr. 883/2004')}. Sie hat drei Folgen, die für deutsche Rentner zählen. Erstens wird die Rente in jeden Mitgliedstaat, in den EWR und in die Schweiz gezahlt, ohne Abzug wegen des Wohnorts. Zweitens steigt sie dort mit jeder Anpassung genauso wie in Deutschland; die aktuelle Erhöhung erklärt ${h.a('rentenwert-2026', 'Rentenerhöhung 2026')}. Drittens gelten für Beginn und Altersgrenzen dieselben Regeln wie im Inland: Regelaltersgrenze ${rg64} ab Jahrgang 1964 (${h.src('sgb6_35', '§ 35 SGB VI')}), Beginn im Monat nach Erreichen der Altersgrenze, wenn der Antrag innerhalb von drei Kalendermonaten gestellt wird (${h.src('sgb6_99', '§ 99 SGB VI')}). Welche Altersgrenze für Sie gilt, zeigt die ${h.a('renteneintrittsalter-tabelle', 'Tabelle zum Renteneintrittsalter')}, den Antrag erläutert ${h.a('rente-beantragen', 'Rente beantragen')}.</p>
<h2>Zusammenrechnung: wenn die deutschen Jahre allein nicht reichen</h2>
<p>Eine deutsche Regelaltersrente setzt ${WZ} Jahre Versicherungszeit voraus (${h.src('sgb6_50', '§ 50 SGB VI')}). Wer weniger hat, bekäme ohne Koordinierung nichts. Innerhalb der EU werden aber alle Versicherungszeiten für diese Wartezeit zusammengerechnet. Drei Jahre in Deutschland und drei in Österreich ergeben sechs Jahre, die Wartezeit ist erfüllt. Gezahlt wird dann aus Deutschland eine Rente nur für die drei deutschen Jahre, aus Österreich eine für die österreichischen. Bei 60.000 € Jahreslohn bringen drei deutsche Jahre ${h.eur(r3, 2)} Monatsrente zum heutigen Rentenwert.</p>
<p>Dasselbe gilt für die längeren Wartezeiten, etwa die 35 Jahre für die Altersrente ab 63 mit Abschlag. Auslandszeiten können also einen früheren deutschen Rentenbeginn öffnen, der Betrag beruht trotzdem nur auf den deutschen Entgeltpunkten. Wer acht Jahre mit 45.000 € in Deutschland gearbeitet hat, erhält daraus ${h.eur(r8, 2)} im Monat, gleich ob die übrigen Berufsjahre in Italien, Irland oder den Niederlanden lagen.</p>
<h2>Die Beitragserstattung nach § 210 SGB VI</h2>
<p>Wer Deutschland nach kurzer Zeit verlässt, fragt oft, ob er seine Beiträge zurückbekommt. Das Gesetz erlaubt es, aber nur, wenn alle Bedingungen zugleich vorliegen (${h.src('sgb6_210', '§ 210 SGB VI')}):</p>
<ul>
<li>Sie sind in Deutschland nicht mehr versicherungspflichtig und haben auch kein Recht, sich freiwillig zu versichern.</li>
<li>Die allgemeine Wartezeit von ${WZ} Jahren ist nicht erfüllt; Zeiten aus anderen EU-Staaten können sie erfüllen und eine Erstattung damit ausschließen.</li>
<li>Seit dem Ende der Versicherungspflicht sind ${E.wartemonate} Kalendermonate vergangen.</li>
</ul>
<p>Erstattet wird der Arbeitnehmeranteil, also die Hälfte der gezahlten Beiträge. Mit der Erstattung erlischt das Versicherungsverhältnis für die erstatteten Zeiten; aus ihnen kann später keine Rente mehr entstehen, auch nicht über eine Zusammenrechnung.</p>
${h.table(['Jahre in Deutschland', 'Eigener Beitragsanteil', 'Monatsrente aus diesen Jahren', `${WZ} Jahre allein mit deutschen Zeiten`], reihe.map(({ j, erst, rente, offen }) => [h.num(j), h.eur(erst), h.eur(rente, 2), offen ? 'nicht erfüllt' : 'erfüllt']), `Bruttolohn 60.000 € im Jahr, Beitragssatz ${h.pct(RG.beitragssatz_rv, 1)}, heutige Werte`, ['r', 'r', 'r', 'l'])}
<p>Die Tabelle rechnet mit den Werten von 2026. Tatsächlich erstattet werden die Beiträge, die Sie in den jeweiligen Jahren gezahlt haben; die Rente rechnet mit dem Rentenwert ab Juli 2026 (${h.src('drvWerte', 'Werte der Rentenversicherung')}) und die Entgeltpunkte mit dem Durchschnittsentgelt 2026 (${h.src('sgb6_70', '§ 70 SGB VI')}). Den Vergleich mit Ihren eigenen Zahlen macht der Mini-Rechner oben.</p>
<h2>Erstattung oder Rente: eine Abwägung</h2>
<p>Die Erstattung bringt sofort Geld, aber nur die Hälfte der gezahlten Beiträge. Die Rente bringt kleine Beträge, dafür lebenslang und mit jeder Anpassung steigend. Bei vier Jahren mit 60.000 € entspricht die Erstattung von ${h.eur(e4)} rund ${h.num(jahreGleich, 1)} Jahren der späteren Rente von ${h.eur(r4, 2)}. Wer davon ausgeht, später noch einmal in Deutschland oder einem anderen EU-Staat zu arbeiten, sollte bedenken: Erstattete Zeiten fehlen dann bei der Zusammenrechnung. Die Entscheidung ist endgültig.</p>
<h2>Außerhalb der EU: keine allgemeine Regel</h2>
<p>Für Staaten außerhalb der EU, des EWR und der Schweiz lässt sich keine allgemeine Aussage treffen. Ob Zeiten zusammengerechnet werden und wie eine Rente gezahlt wird, hängt vom jeweiligen Staat und von einem Sozialversicherungsabkommen ab. Diese Seite nennt dazu bewusst keine Länderregeln. Verbindliche Auskunft geben die Auskunfts- und Beratungsstellen der Deutschen Rentenversicherung; das gilt auch für die Frage, ob in Ihrem Fall eine Erstattung möglich ist.</p>
<h2>Vor dem Wegzug: Unterlagen sichern</h2>
<p>Ihre Entgeltpunkte bleiben auf dem deutschen Konto, auch wenn Sie Jahrzehnte im Ausland leben. Damit sie später vollständig zählen, lohnt es sich, vor dem Wegzug den Versicherungsverlauf zu prüfen und fehlende Zeiten zu klären. Wie Sie die Angaben im Schreiben der Rentenversicherung lesen, erklärt ${h.a('renteninformation', 'Renteninformation lesen')}; wie aus Lohn Punkte werden, ${h.a('entgeltpunkte', 'Entgeltpunkte berechnen')}.</p>`,
  },
  en: {
    slug: 'german-pension-abroad',
    nav: 'German pension abroad',
    card: 'Paid in full across the EU, periods added up between countries; a refund only below five years.',
    title: 'Pension Abroad 2026: German Pension in the EU and Refunds',
    description: `German pension abroad in 2026: paid in full across the EU, EEA and Switzerland, periods added up. Refund of contributions (§ 210) if you have under ${WZ} years.`,
    h1: 'Your German pension abroad: leaving, retiring and refunds',
    intro: 'Whether you leave Germany after a few years in a job here or retire to the coast, your German contributions follow clear rules, especially within Europe. This page sets them out for international workers.',
    resume: `A German statutory pension is paid abroad too. Within the EU, the EEA and Switzerland, Regulation (EC) No 883/2004 governs it: insurance periods in all member states are added together to check qualifying periods (Wartezeiten), each country pays the pension for its own periods, and no reduction may be made because you live in another member state. Someone with three years in Germany and three in France therefore meets the ${WZ}-year minimum for the German standard pension (section 50 SGB VI) and receives a small German pension for three years. Outside that area everything depends on the country and any social security agreement. If you have fewer than ${WZ} years, are no longer compulsorily insured in Germany and have no right to voluntary insurance, you can apply for a refund of contributions (Beitragserstattung) after ${E.wartemonate} months (section 210 SGB VI). Only your own share is refunded, half of the contributions paid, and the refunded periods can never produce a pension afterwards. On €60,000 a year, four years would mean a refund of about ${EN.eur(e4)}. The refund is final, so weigh it against a lifelong pension.`,
    faqs: [
      { q: 'Can I get my German pension contributions back when I leave Germany?', a: `Only under strict conditions: you have not completed ${WZ} years, you are no longer compulsorily insured, you have no right to insure voluntarily, and ${E.wartemonate} months have passed since compulsory insurance ended (section 210 SGB VI). Only your employee share is refunded, never your employer’s. After the refund the German periods are gone for good, including for any later combination with EU periods.` },
      { q: 'Will my German pension be reduced if I retire to Portugal?', a: 'No. Within the EU, the EEA and Switzerland, Regulation 883/2004 rules out any cut because of where you live. You receive the same gross pension as in Germany, including every annual increase. What can change is your health insurance and how the pension is taxed; check both with the responsible bodies before you move.' },
      { q: 'I worked three years in Germany and four in Spain. Do I get a German pension?', a: `Yes, once you reach the German standard retirement age. The Spanish years count towards the ${WZ}-year German qualifying period under Regulation 883/2004, so the minimum is met. Germany then pays a pension for its three years only; at €60,000 a year that would be about ${EN.eur(r3, 2)} a month at today’s pension value. Spain pays separately for the Spanish years.` },
      { q: 'What happens to a German pension if I move to the US, Canada or India?', a: 'Outside the EU, the EEA and Switzerland there is no single rule. Whether periods are added together and how a pension is paid depends on the country and on whether Germany has a social security agreement with it. This page deliberately gives no country rules; the German pension insurer gives binding answers for your case, including on whether a refund is open to you.' },
      { q: 'Is a contribution refund better than a small German pension later?', a: `It depends on life expectancy and on whether you might still reach ${WZ} years through other countries. Four years on €60,000 mean a refund of about ${EN.eur(e4)} against a pension of ${EN.eur(r4, 2)} a month in today’s values. The refund equals roughly ${EN.num(jahreGleich, 1)} years of that pension, before interest and tax, and it can never be reversed.` },
      { q: 'Do I need to stay insured in Germany to keep my pension points?', a: 'No. Points already earned stay on your German account however long you live abroad. They become a pension once you reach the German retirement age and meet the qualifying period, if necessary with EU, EEA or Swiss periods added. What you lose by leaving is only the chance to earn further German points; the existing ones are not reduced.' },
    ],
    body: (h) => `
<h2>Three typical cases for international workers</h2>
<p>Most questions about German pensions abroad fall into one of three situations. The figures below use €60,000 a year, today’s pension value and the 2026 contribution rate.</p>
${h.table(['Situation', 'What usually happens', 'Example figure'], [
      ['Left after 3 years, moved to another EU state', `German periods count towards the ${WZ} years together with the other state’s; small German pension later`, `${h.eur(r3, 2)} a month`],
      ['Left after 4 years, now outside the EU', `Refund of own share may be possible after ${E.wartemonate} months if no voluntary insurance right; otherwise a pension depends on the country`, `${h.eur(e4)} refund or ${h.eur(r4, 2)} a month`],
      ['Worked 8 years on €45,000, retiring abroad', 'Qualifying period met with German years alone; pension paid abroad', `${h.eur(r8, 2)} a month`],
    ], 'Illustrations only; individual cases depend on the facts and on any agreement', ['l', 'l', 'r'])}
<h2>Retiring within the EU, the EEA or Switzerland</h2>
<p>Moves within Europe are governed by ${h.src('vo883', 'Regulation (EC) No 883/2004')}. For German pensioners it has three consequences. First, the pension is paid to any member state, the EEA and Switzerland, with no deduction for living there. Second, it rises there with every increase, exactly as in Germany; the current one is on ${h.a('rentenwert-2026', 'pension increase 2026')}. Third, the same rules on start dates and ages apply as at home: a standard retirement age of ${rg64} for anyone born from 1964 (${h.src('sgb6_35', 'section 35 SGB VI')}), and a start in the month after you reach the age if you apply within three calendar months (${h.src('sgb6_99', 'section 99 SGB VI')}). Your own age limit is in the ${h.a('renteneintrittsalter-tabelle', 'retirement age table')}; the application is covered on ${h.a('rente-beantragen', 'applying for your pension')}.</p>
<h2>Aggregation: when the German years alone are not enough</h2>
<p>A German standard old-age pension requires ${WZ} years of insurance (${h.src('sgb6_50', 'section 50 SGB VI')}). Without coordination, anyone with fewer would get nothing. Within the EU, however, all insurance periods are added together for this test. Three years in Germany and three in Austria make six, so the minimum is met. Germany then pays a pension for the three German years only, Austria for the Austrian ones. It is a common surprise for expats: the German pension may be small, but it exists, and it lasts for life.</p>
<p>The same aggregation applies to the longer qualifying periods, such as the 35 years needed to retire at 63 with a reduction. Periods abroad can open an earlier German retirement date, yet the German amount is still based only on German points (Entgeltpunkte). How those are calculated is on ${h.a('entgeltpunkte', 'pension points explained')}.</p>
<h2>The refund of contributions under section 210 SGB VI</h2>
<p>If you leave Germany after a short stay, you may wonder whether you can have your contributions back. The law allows it, but only when every condition is met at once (${h.src('sgb6_210', 'section 210 SGB VI')}):</p>
<ul>
<li>You are no longer compulsorily insured in Germany and have no right to insure voluntarily.</li>
<li>You have not completed the ${WZ}-year qualifying period; periods in other EU states can complete it and so rule out a refund.</li>
<li>${E.wartemonate} calendar months have passed since your compulsory insurance ended.</li>
</ul>
<p>The refund covers your employee share, half of the contributions paid; your employer’s half is not refunded. Once paid, the insurance relationship for those periods ends; they can never produce a pension, not even through aggregation with another country.</p>
${h.table(['Years in Germany', 'Your contribution share', 'Monthly pension from these years', `${WZ} years with German periods alone`], reihe.map(({ j, erst, rente, offen }) => [h.num(j), h.eur(erst), h.eur(rente, 2), offen ? 'not met' : 'met']), `Gross pay €60,000 a year, contribution rate ${h.pct(RG.beitragssatz_rv, 1)}, today’s values`, ['r', 'r', 'r', 'l'])}
<p>The table uses 2026 values. The actual refund is the contributions you paid in each year; the pension uses the value from July 2026 (${h.src('drvWerte', 'German Pension Insurance key values')}) and the points use 2026 average earnings (${h.src('sgb6_70', 'section 70 SGB VI')}). The mini calculator above runs the comparison with your own figures.</p>
<h2>Refund or pension: weighing it up</h2>
<p>A refund pays at once, but only half of what was paid in. A pension pays small amounts, for life and rising with each increase. With four years on €60,000, a refund of ${h.eur(e4)} equals about ${h.num(jahreGleich, 1)} years of the later pension of ${h.eur(r4, 2)}. Ask yourself three questions before applying: Might you work in Germany or another EU state again? Do you already have periods elsewhere in Europe that would complete the ${WZ} years? How long do people in your family tend to live? A yes to the first two usually argues against a refund, which cannot be undone.</p>
<h2>Outside the EU: no general rule</h2>
<p>For countries outside the EU, the EEA and Switzerland no general statement is possible. Whether periods are added together and how a pension is paid depends on the country and on any social security agreement with Germany. This page deliberately gives no country rules. Binding information comes from the German pension insurer’s advice centres (Auskunfts- und Beratungsstellen), which also confirm whether a refund is open to you.</p>
<h2>Before you leave: secure your record</h2>
<p>Your points stay on your German account even if you live abroad for decades. To make sure they all count later, check your insurance record (Versicherungsverlauf) before leaving and have any gaps clarified while employers and documents are easy to reach. How to read the German pension statement is explained on ${h.a('renteninformation', 'reading your pension statement')}; the ${h.a('rentenrechner', 'German pension calculator')} projects what your points will pay.</p>`,
  },
});
