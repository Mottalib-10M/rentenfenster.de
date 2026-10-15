import { defineGuide } from '../../lib/guide-types';
import { epAusBrutto } from '../../lib/engine/geld';
import { zuschlag } from '../../lib/engine/alter';
import { nettoEinkommen, freibetrag } from '../../lib/engine/hinterbliebene';
import { P, DE, EN } from '../../lib/fmt';

/** Hinzuverdienst neben der Altersrente: keine Grenze seit 2023; Aktivrente (§ 3 Nr. 21 EStG) bis 24.000 € im Jahr nach der Regelaltersgrenze. */
const RW = P.rentenwert.ab_2026_07;
const AKT = P.steuer.aktivrente_jahr;
const frei = (monatslohn: number, monate = 12) => Math.min(monatslohn * monate, AKT * monate / 12);
const faelle = [1000, 1500, 2000, 2500, 3500].map((m) => ({ m, jahr: m * 12, frei: frei(m), rest: Math.max(0, m * 12 - frei(m)) }));
const ersteJahr = frei(2500, 8);
const epJob = epAusBrutto(30000);
const epTeil = epAusBrutto(18000);
const zs12 = zuschlag(12);
const zs24 = zuschlag(24);
const fbW = freibetrag(RW);
const wLohn = nettoEinkommen('arbeitsentgelt', 2500);
const wAnr = Math.max(0, wLohn - fbW) * P.witwe.anrechnung;

export default defineGuide({
  id: 'hinzuverdienst',
  group: 'hoehe',
  order: 135,
  mini: 'aktivrente',
  miniHref: 'rentenrechner-brutto-netto',
  related: ['teilrente', 'em-hinzuverdienst', 'witwenrente-einkommen', 'spaeter-in-rente', 'rente-mit-63', 'rentenwert-2026', 'rente-steuer-rechner'],
  sources: ['estg_3', 'drvWerte', 'sgb6_66', 'sgb6_77', 'sgb6_42', 'sgb6_96a', 'sgb6_97', 'sgb4_18b'],
  de: {
    slug: 'hinzuverdienst-rente',
    nav: 'Hinzuverdienst zur Rente',
    card: `Neben der Altersrente unbegrenzt verdienen, nach der Regelaltersgrenze bis ${DE.eur(AKT)} im Jahr steuerfrei.`,
    title: `Hinzuverdienst Rente 2026: ohne Grenze, Aktivrente ${DE.eur(AKT)}`,
    description: `Hinzuverdienst Rente 2026: keine Grenze bei Altersrenten, nach der Regelaltersgrenze ${DE.eur(AKT)} Lohn im Jahr steuerfrei (Aktivrente). Ausnahmen: EM, Witwenrente.`,
    h1: 'Hinzuverdienst zur Rente: was 2026 erlaubt ist und was es bringt',
    intro: 'Seit 2023 darf jeder Bezieher einer Altersrente unbegrenzt dazuverdienen. Nach der Regelaltersgrenze bleibt zusätzlich ein Teil des Lohns steuerfrei. Was das in Zahlen heißt.',
    resume: `Wer eine Altersrente bezieht, darf seit 2023 unbegrenzt hinzuverdienen, auch bei einer vorgezogenen Rente mit 63; die frühere Hinzuverdienstgrenze ist abgeschafft. Neu ist die sogenannte Aktivrente: Lohn aus einer Beschäftigung nach Erreichen der Regelaltersgrenze bleibt bis ${DE.eur(AKT)} im Jahr steuerfrei (§ 3 Nr. 21 EStG). Die Befreiung beginnt mit dem Monat nach der Regelaltersgrenze und gilt nur für Arbeitnehmer, nicht für Selbstständige; für jeden Monat ohne die Voraussetzungen sinkt der Betrag um ein Zwölftel. Bei 2.000 € Monatslohn ist damit das ganze Gehalt steuerfrei, bei 2.500 € bleiben ${DE.eur(faelle[3].rest)} im Jahr steuerpflichtig. Vor der Regelaltersgrenze gibt es diese Befreiung nicht. Wer neben der Rente Beiträge zahlt, erwirbt neue Entgeltpunkte, die jeweils zum 1. Juli des Folgejahres die Rente erhöhen: 30.000 € Jahreslohn bringen ${DE.eur(epJob * RW, 2)} Monatsrente dazu. Anders bei Erwerbsminderungs- und Witwenrenten: Dort wird Einkommen weiterhin angerechnet.`,
    faqs: [
      { q: 'Wie viel darf ich 2026 neben der Altersrente verdienen?', a: 'So viel Sie wollen. Für alle Altersrenten, auch für die vorgezogene Rente nach 35 Jahren oder die Rente für Schwerbehinderte, gibt es seit 2023 keine Hinzuverdienstgrenze mehr. Lohn kürzt die Altersrente also nicht. Eine Grenze gibt es nur noch bei Renten wegen Erwerbsminderung, und bei Witwenrenten wird eigenes Einkommen über einem Freibetrag angerechnet.' },
      { q: 'Was ist die Aktivrente und wer bekommt sie?', a: `Keine eigene Rente, sondern eine Steuerbefreiung: Arbeitslohn bis ${DE.eur(AKT)} im Jahr bleibt steuerfrei, wenn Sie die Regelaltersgrenze erreicht haben und als Arbeitnehmer beschäftigt sind (§ 3 Nr. 21 EStG). Selbstständige und Freiberufler sind ausgenommen. Ob Sie daneben schon Rente beziehen oder sie aufschieben, spielt für die Befreiung keine Rolle.` },
      { q: 'Gilt die Aktivrente schon im Jahr, in dem ich 67 werde?', a: `Ab dem Monat nach Erreichen der Regelaltersgrenze, und für dieses erste Jahr nur anteilig: Für jeden Monat davor sinkt der Höchstbetrag um ein Zwölftel. Wer die Grenze im April erreicht, hat ab Mai acht steuerfreie Monate und damit höchstens ${DE.eur(AKT * 8 / 12)}. Bei 2.500 € Lohn sind das ${DE.eur(ersteJahr)}; der übrige Lohn des Jahres ist normal steuerpflichtig.` },
      { q: 'Steigt meine Rente, wenn ich als Rentner weiterarbeite?', a: `Ja, sofern Rentenbeiträge auf den Lohn gezahlt werden. Die neuen Entgeltpunkte werden jeweils zum 1. Juli des Folgejahres der Rente zugeschlagen (§ 66 Abs. 3a SGB VI). Ein Jahr mit 18.000 € bringt ${DE.num(epTeil, 4)} Punkte, also ${DE.eur(epTeil * RW, 2)} mehr Monatsrente; mit 30.000 € sind es ${DE.eur(epJob * RW, 2)}. Einen Abschlag auf die schon laufende Rente beseitigt das nicht.` },
      { q: 'Lohnt es sich, die Rente aufzuschieben statt neben ihr zu arbeiten?', a: `Das hängt an Lebenserwartung und Steuer. Für jeden Monat, den Sie die Rente nach der Regelaltersgrenze nicht beziehen, steigt sie um ${DE.pct(P.zugangsfaktor.zuschlag_monat, 1)}: nach einem Jahr ${DE.pct(zs12, 1)}, nach zwei ${DE.pct(zs24, 1)}, lebenslang. Dafür fehlen die Monatsrenten dieser Zeit. Die Aktivrente gilt in beiden Fällen, denn sie hängt nur am Alter und an der Beschäftigung.` },
      { q: 'Wird mein Lohn auf die Witwenrente angerechnet?', a: `Ja. Bei Witwen- und Witwerrenten zählt eigenes Einkommen über einem Freibetrag von ${DE.eur(fbW, 2)} netto im Monat (seit Juli 2026); vom Lohn werden pauschal ${DE.pct(P.witwe.abzug.arbeitsentgelt, 0)} abgezogen, vom Rest über dem Freibetrag ${DE.pct(P.witwe.anrechnung, 0)} angerechnet. Aus 2.500 € brutto werden so ${DE.eur(wLohn, 2)} Nettoeinkommen und ${DE.eur(wAnr, 2)} weniger Witwenrente.` },
    ],
    body: (h) => `
<h2>Altersrente und Lohn: keine Grenze mehr</h2>
<p>Für Altersrenten gibt es seit 2023 keine Hinzuverdienstgrenze mehr (${h.src('drvWerte', 'Werte der Rentenversicherung')}). Seither gilt: Wer eine Altersrente bezieht, egal ob mit 63 nach 35 Jahren, nach 45 Jahren, als Schwerbehinderter oder zur Regelaltersgrenze, darf beliebig viel verdienen, ohne dass die Rente sinkt. Das hat den Rentenbeginn neu sortiert. Eine Rente mit Abschlag plus Vollzeitlohn ist rechtlich möglich; der Abschlag bleibt aber lebenslang, auch wenn Sie bis 67 voll weiterarbeiten. Was der frühe Beginn kostet, zeigt ${h.a('rente-mit-63', 'Rente mit 63')}.</p>
<h2>Aktivrente: steuerfreier Lohn nach der Regelaltersgrenze</h2>
<p>Einen zusätzlichen Anreiz gibt es für Beschäftigte, die über die Regelaltersgrenze hinaus arbeiten. Ihr Arbeitslohn bleibt bis ${h.eur(AKT)} im Jahr steuerfrei (${h.src('estg_3', '§ 3 Nr. 21 EStG')}). Vier Bedingungen sind wichtig:</p>
<ul>
<li>Die Befreiung beginnt erst mit dem Monat nach Erreichen der Regelaltersgrenze, nicht schon bei einer Frührente.</li>
<li>Sie gilt nur für Lohn aus einer Beschäftigung; Gewinne aus selbstständiger Arbeit sind nicht erfasst.</li>
<li>Für jeden Kalendermonat, in dem die Voraussetzungen nicht vorliegen, sinkt der Jahresbetrag um ein Zwölftel.</li>
<li>Ob Sie gleichzeitig Rente beziehen, ist für die Steuerbefreiung gleichgültig.</li>
</ul>
${h.table(['Bruttolohn im Monat', 'Lohn im Jahr', 'Steuerfrei (Aktivrente)', 'Steuerpflichtiger Rest'], faelle.map(({ m, jahr, frei, rest }) => [h.eur(m), h.eur(jahr), h.eur(frei), h.eur(rest)]), 'Ganzes Kalenderjahr nach der Regelaltersgrenze, Arbeitnehmer', ['r', 'r', 'r', 'r'])}
<p>Die Rente selbst bleibt steuerpflichtig wie bisher, mit dem Besteuerungsanteil Ihres Startjahres. Der steuerpflichtige Lohnrest kommt zum steuerpflichtigen Teil der Rente hinzu und wird zusammen besteuert; das kann den Steuersatz auf die Rente spürbar erhöhen. Den Effekt für Ihre Zahlen rechnet der ${h.a('rente-steuer-rechner', 'Rentensteuer-Rechner')}.</p>
<h2>Das erste Jahr wird anteilig gerechnet</h2>
<p>Ein Beispiel: Ein Arbeitnehmer erreicht die Regelaltersgrenze im April und verdient weiter 2.500 € im Monat. Ab Mai sind acht Monate begünstigt, der Höchstbetrag sinkt auf ${h.eur(AKT * 8 / 12)}. Sein Lohn von Mai bis Dezember beträgt ${h.eur(2500 * 8)}, steuerfrei bleiben ${h.eur(ersteJahr)}. Der Lohn von Januar bis April ist voll steuerpflichtig. Im Folgejahr gilt dann der volle Betrag von ${h.eur(AKT)}.</p>
<h2>Neue Entgeltpunkte aus dem Lohn</h2>
<p>Zahlen Sie neben der Rente Beiträge zur Rentenversicherung, erwerben Sie weitere Entgeltpunkte. Sie werden nicht sofort, sondern jeweils zum 1. Juli des Folgejahres der laufenden Rente zugeschlagen (${h.src('sgb6_66', '§ 66 Abs. 3a SGB VI')}). Ein Jahr Teilzeit mit 18.000 € bringt ${h.num(epTeil, 4)} Punkte und ${h.eur(epTeil * RW, 2)} mehr Monatsrente, ein Jahr mit 30.000 € ${h.num(epJob, 4)} Punkte und ${h.eur(epJob * RW, 2)}. Das sind keine großen Beträge, aber sie sind lebenslang und steigen mit jeder Rentenanpassung mit. Wie die Rechnung funktioniert, erklärt ${h.a('entgeltpunkte', 'Entgeltpunkte berechnen')}; die nächste Anpassung erläutert ${h.a('rentenwert-2026', 'Rentenerhöhung 2026')}.</p>
<h2>Arbeiten ohne Rente: der Zuschlag</h2>
<p>Die Alternative zum Rente-plus-Lohn ist der Aufschub. Wer nach der Regelaltersgrenze weiterarbeitet und die Rente noch nicht beantragt, bekommt für jeden Monat ${h.pct(P.zugangsfaktor.zuschlag_monat, 1)} Zuschlag (${h.src('sgb6_77', '§ 77 SGB VI')}). Nach zwölf Monaten sind es ${h.pct(zs12, 1)}, nach 24 Monaten ${h.pct(zs24, 1)}; aus 1.500 € werden ${h.eur(1500 * (1 + zs12), 2)} beziehungsweise ${h.eur(1500 * (1 + zs24), 2)}. Die steuerfreie Aktivrente steht Ihnen in beiden Varianten zu. Welche Variante sich rechnet, ist eine Frage der Lebenserwartung und Ihrer Steuerlast; Details unter ${h.a('spaeter-in-rente', 'Später in Rente')}.</p>
<h2>Teilrente: Rente und Arbeit dosieren</h2>
<p>Zwischen „ganz Rente“ und „gar keine Rente“ liegt die Teilrente: Sie können einen Teil Ihrer Altersrente beziehen, mindestens 10 Prozent der Vollrente (${h.src('sgb6_42', '§ 42 SGB VI')}), und den Rest später nehmen. Seit es keine Hinzuverdienstgrenze mehr gibt, ist sie kein Mittel mehr gegen Kürzungen, wohl aber eines, um Steuerlast und Abschlag zu steuern. Mehr unter ${h.a('teilrente', 'Teilrente')}.</p>
<h2>Wo Einkommen weiterhin angerechnet wird</h2>
<p>Zwei Rentenarten kennen weiterhin Grenzen. Bei der Erwerbsminderungsrente gilt eine eigene Hinzuverdienstgrenze; wer sie überschreitet, bekommt die Rente gekürzt (${h.src('sgb6_96a', '§ 96a SGB VI')}). Die Beträge und die Kürzungsregel erläutert ${h.a('em-hinzuverdienst', 'Erwerbsminderungsrente und Hinzuverdienst')}. Bei der Witwen- und Witwerrente wird eigenes Einkommen über einem Freibetrag zu ${h.pct(P.witwe.anrechnung, 0)} angerechnet (${h.src('sgb6_97', '§ 97 SGB VI')}); vom Lohn wird vorher pauschal ${h.pct(P.witwe.abzug.arbeitsentgelt, 0)} abgezogen (${h.src('sgb4_18b', '§ 18b SGB IV')}).</p>
${h.table(['Witwe mit eigenem Lohn', 'Betrag im Monat'], [
      ['Bruttolohn', h.eur(2500)],
      [`Nettoeinkommen nach pauschalem Abzug von ${h.pct(P.witwe.abzug.arbeitsentgelt, 0)}`, h.eur(wLohn, 2)],
      ['Freibetrag ohne Kind, ab Juli 2026', h.eur(fbW, 2)],
      [`Davon angerechnet (${h.pct(P.witwe.anrechnung, 0)} des Überschusses)`, h.eur(wAnr, 2)],
    ], 'Eigene Altersrente der Witwe ist hier nicht enthalten', ['l', 'r'])}
<p>Wer neben der Witwenrente auch eine eigene Altersrente bezieht, muss beide Einkommen zusammenzählen. Den ganzen Fall rechnet ${h.a('witwenrente-einkommen', 'Einkommensanrechnung bei der Witwenrente')}.</p>`,
  },
  en: {
    slug: 'working-while-drawing-a-pension',
    nav: 'Working while drawing a pension',
    card: `No earnings cap on German old-age pensions, and up to ${EN.eur(AKT)} of pay tax-free after the standard age.`,
    title: `Working While Drawing a Pension 2026: ${EN.eur(AKT)} Tax-Free`,
    description: `Working while drawing a pension in 2026: no earnings cap on German old-age pensions, ${EN.eur(AKT)} of pay tax-free after the standard age (Aktivrente). Limits left.`,
    h1: 'Working while drawing a German pension: the 2026 rules in figures',
    intro: 'Since 2023 anyone on a German old-age pension can earn without limit. Part of the pay earned after the standard retirement age is also tax-free. What that means for expats who keep working.',
    resume: `If you draw a German old-age pension you can earn as much as you like alongside it: the earnings cap (Hinzuverdienstgrenze) was abolished in 2023, including for early pensions from 63. On top comes the so-called active pension (Aktivrente), which is a tax exemption rather than a pension: pay from employment after reaching the standard retirement age is tax-free up to ${EN.eur(AKT)} a year (section 3 no. 21 Income Tax Act). It starts the month after you reach that age, covers employees only, not the self-employed, and is cut by one twelfth for each month in which the conditions are not met. On €2,000 a month your whole salary is tax-free; on €2,500, ${EN.eur(faelle[3].rest)} a year remains taxable. Before the standard age there is no such exemption. If contributions are paid on your pay, you earn new pension points, added each 1 July of the following year: €30,000 of annual pay adds ${EN.eur(epJob * RW, 2)} to your monthly pension. Disability and survivors’ pensions are different: income is still offset against them.`,
    faqs: [
      { q: 'Is there an earnings limit on a German old-age pension in 2026?', a: 'No. Since 2023 there has been no earnings cap on any old-age pension, including the early pension after 35 years and the pension for severely disabled people. Your pay does not reduce the pension at all. Limits remain only for reduced earning capacity (disability) pensions, and a survivor’s own income above an allowance is partly offset against a widow’s or widower’s pension.' },
      { q: 'Does the Aktivrente apply to self-employed expats?', a: `No. The exemption of up to ${EN.eur(AKT)} a year covers only pay from employment (section 3 no. 21 EStG). Freelancers, consultants and business owners pay tax on their profits as before, even after the standard retirement age. If you combine a part-time job with freelance work, only the salaried part can be tax-free.` },
      { q: 'How is the Aktivrente calculated in the year I reach the standard age?', a: `Pro rata. The exemption starts the month after you reach the standard age, and the annual maximum drops by one twelfth for every month before that. Reach the age in April and you have eight eligible months from May, so at most ${EN.eur(AKT * 8 / 12)}. On €2,500 a month, ${EN.eur(ersteJahr)} is tax-free that year; January to April pay is taxed normally.` },
      { q: 'Will working on after retirement increase my German pension?', a: `Yes, if pension contributions are paid on your pay. The new points are added to your pension each 1 July of the following year (section 66(3a) SGB VI). A year on €18,000 earns ${EN.num(epTeil, 4)} points, ${EN.eur(epTeil * RW, 2)} more a month; €30,000 earns ${EN.eur(epJob * RW, 2)}. It does not remove any early-retirement reduction on the pension already running.` },
      { q: 'Should I defer my pension instead of drawing it while I work?', a: `It depends on life expectancy and tax. Each month you defer the pension past the standard age adds ${EN.pct(P.zugangsfaktor.zuschlag_monat, 1)}: ${EN.pct(zs12, 1)} after a year, ${EN.pct(zs24, 1)} after two, for life. In exchange you forgo the payments in the meantime. The Aktivrente applies either way, since it depends only on age and employment, not on whether a pension is drawn.` },
      { q: 'Is my salary offset against a German widow’s pension?', a: `Yes. Own income above an allowance of ${EN.eur(fbW, 2)} net a month (from July 2026) counts; pay is first reduced by a flat ${EN.pct(P.witwe.abzug.arbeitsentgelt, 0)}, then ${EN.pct(P.witwe.anrechnung, 0)} of the excess is offset. €2,500 gross thus becomes ${EN.eur(wLohn, 2)} of net income and ${EN.eur(wAnr, 2)} less widow’s pension each month.` },
    ],
    body: (h) => `
<h2>Old-age pension plus pay: no ceiling any more</h2>
<p>Since 2023 there has been no earnings cap on old-age pensions (${h.src('drvWerte', 'German Pension Insurance key values')}). Since then, anyone drawing an old-age pension, whether at 63 after 35 years, after 45 years, with a severe disability or at the standard age, can earn any amount without the pension shrinking. That changed the logic of early retirement. A reduced pension plus a full salary is legally possible, but the reduction lasts for life even if you keep working full time until 67. What starting early costs is on ${h.a('rente-mit-63', 'retiring at 63')}.</p>
<h2>Aktivrente: tax-free pay after the standard age</h2>
<p>There is an extra incentive for employees who work past the standard retirement age. Their pay is tax-free up to ${h.eur(AKT)} a year (${h.src('estg_3', 'section 3 no. 21 EStG')}). Four conditions matter:</p>
<ul>
<li>The exemption starts only the month after you reach the standard age, never during an early pension.</li>
<li>It covers pay from employment only; self-employed profits are excluded.</li>
<li>For each calendar month in which the conditions are not met, the annual amount falls by one twelfth.</li>
<li>Whether you draw your pension at the same time makes no difference to the exemption.</li>
</ul>
${h.table(['Gross pay a month', 'Pay a year', 'Tax-free (Aktivrente)', 'Taxable remainder'], faelle.map(({ m, jahr, frei, rest }) => [h.eur(m), h.eur(jahr), h.eur(frei), h.eur(rest)]), 'Full calendar year after the standard age, employee', ['r', 'r', 'r', 'r'])}
<p>The pension itself stays taxable as before, at the taxable share of your start year. Any taxable pay above the exemption is added to the taxable part of the pension and taxed together, which can noticeably raise the rate on the pension. The ${h.a('rente-steuer-rechner', 'pension tax calculator')} shows the effect for your figures.</p>
<h2>The first year is pro rata</h2>
<p>Example: an employee reaches the standard age in April and keeps earning €2,500 a month. From May, eight months qualify and the ceiling falls to ${h.eur(AKT * 8 / 12)}. Pay from May to December is ${h.eur(2500 * 8)}, of which ${h.eur(ersteJahr)} is tax-free. January to April is fully taxable. From the following year the full ${h.eur(AKT)} applies.</p>
<h2>For expats: what this does and does not cover</h2>
<p>The Aktivrente is part of German income tax law. It helps if your employment income is taxed in Germany; it says nothing about how another country taxes your pay. The standard age that triggers it is the German one, 67 for anyone born from 1964, regardless of the pension age in your home country.</p>
<h2>New points from your pay</h2>
<p>If pension contributions are paid on your pay while you draw a pension, you earn further pension points (Entgeltpunkte). They are added to the pension in payment each 1 July of the following year (${h.src('sgb6_66', 'section 66(3a) SGB VI')}). A part-time year on €18,000 brings ${h.num(epTeil, 4)} points and ${h.eur(epTeil * RW, 2)} more monthly pension; a year on €30,000 brings ${h.num(epJob, 4)} points and ${h.eur(epJob * RW, 2)}. Not much, but for life and rising with each pension increase. The mechanics are on ${h.a('entgeltpunkte', 'pension points explained')}.</p>
<h2>Working without drawing: the deferral increase</h2>
<p>The alternative to pension plus pay is deferral. Work past the standard age without claiming your pension and it rises by ${h.pct(P.zugangsfaktor.zuschlag_monat, 1)} per month (${h.src('sgb6_77', 'section 77 SGB VI')}). After twelve months that is ${h.pct(zs12, 1)}, after 24 months ${h.pct(zs24, 1)}; €1,500 becomes ${h.eur(1500 * (1 + zs12), 2)} or ${h.eur(1500 * (1 + zs24), 2)}. The tax-free Aktivrente applies in both cases. Which route pays off depends on life expectancy and your tax bill; see ${h.a('spaeter-in-rente', 'retiring later')}.</p>
<h2>Partial pension: dosing pension and work</h2>
<p>Between full pension and none sits the partial pension (Teilrente): draw part of your old-age pension, at least 10% of the full amount (${h.src('sgb6_42', 'section 42 SGB VI')}), and the rest later. With no earnings cap left it no longer avoids cuts, but it can still steer your tax bill and the reduction. More under ${h.a('teilrente', 'partial pension')}.</p>
<h2>Where income is still offset</h2>
<p>Two pension types still have limits. Reduced earning capacity pensions (Erwerbsminderungsrente) have their own earnings limit, and going over it cuts the pension (${h.src('sgb6_96a', 'section 96a SGB VI')}); the amounts are on ${h.a('em-hinzuverdienst', 'disability pension and earnings')}. On a widow’s or widower’s pension, own income above an allowance is offset at ${h.pct(P.witwe.anrechnung, 0)} (${h.src('sgb6_97', 'section 97 SGB VI')}), after a flat ${h.pct(P.witwe.abzug.arbeitsentgelt, 0)} deduction from pay (${h.src('sgb4_18b', 'section 18b SGB IV')}).</p>
${h.table(['Widow with her own pay', 'Monthly amount'], [
      ['Gross pay', h.eur(2500)],
      [`Net income after flat ${h.pct(P.witwe.abzug.arbeitsentgelt, 0)} deduction`, h.eur(wLohn, 2)],
      ['Allowance without children, from July 2026', h.eur(fbW, 2)],
      [`Offset (${h.pct(P.witwe.anrechnung, 0)} of the excess)`, h.eur(wAnr, 2)],
    ], 'Her own old-age pension is not included here', ['l', 'r'])}
<p>A survivor who also draws an old-age pension of their own must add both incomes together. ${h.a('witwenrente-einkommen', 'Widow’s pension income test')} works through the full case.</p>`,
  },
});
