import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, fmtAlter, breakEven, abschlag, beginn, abschlagBei } from '../../lib/engine/alter';
import { nettoStandard } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Frührente: alle Wege vor der Regelaltersgrenze (Jahrgang 1965, Geburtstag 15. Oktober), Kosten des Abschlags mit und ohne fehlende Entgeltpunkte, Netto. Alles aus dem Motor. */
const AB = P.zugangsfaktor.abschlag_monat;
const RW = P.rentenwert.ab_2026_07;
const R = P.reform;
const FRIST = P.antrag.frist_monate;
const RENTE = 2000;
const g = { jahr: 1965, monat: 10, tag: 15 };
const f = fenster(g, { wz35: true, wz45: true, schwb: true });
const o = (art: string) => f.opts.find((x) => x.art === art)!;
const regel = o('regel'), lj = o('langjaehrig'), bes = o('besonders'), sb = o('schwb');
const jahr = (i: number) => Math.floor(i / 12);
/** Kosten je Zahl der Monate. */
const kosten = [12, 24, 36, 48].map((m) => ({ m, ab: abschlag(m), b: breakEven(m, RENTE, RW) }));
const k24 = kosten[1];
/** Zwei Jahre früher, und zwei Entgeltpunkte, die nicht mehr entstehen (Durchschnittsverdienst). */
const k24ep = breakEven(24, RENTE, RW, 2);
/** Netto: mit 65 über die Rente nach 35 Jahren gegen mit 67 ohne Abschlag. */
const start65 = beginn(g, { j: 65, m: 0 });
const ab65 = abschlagBei(f.opts.filter((x) => x.art !== 'besonders' && x.art !== 'schwb'), start65)!;
const netFrueh = nettoStandard(RENTE * (1 - ab65.abschlag), jahr(start65));
const netRegel = nettoStandard(RENTE, jahr(regel.voll));

export default defineGuide({
  id: 'fruehrente',
  group: 'beginn',
  order: 15,
  mini: 'fruehVerlust',
  miniHref: 'abschlag-rechner',
  related: ['rente-mit-63', 'langjaehrig-versicherte', 'rente-nach-45-jahren', 'schwerbehinderte', 'rente-beantragen', 'ausgleichszahlung', 'teilrente', 'erwerbsminderungsrente'],
  sources: ['sgb6_36', 'sgb6_37', 'sgb6_38', 'sgb6_77', 'sgb6_99', 'sgb6_187a', 'sgb6_43', 'sgb5_249a', 'estg_22', 'drvReform', 'bmasKommission'],
  de: {
    slug: 'fruehrente',
    nav: 'Frührente',
    card: 'Alle Wege vor der Regelaltersgrenze, was sie kosten und wie man sie beantragt.',
    title: 'Frührente 2026: alle Wege, Abschlag, Netto und Antrag',
    description: 'Frührente 2026: welche Wege vor der Regelaltersgrenze offen sind, was jeder Monat früher brutto und netto kostet, wann Warten lohnt und wie der Antrag läuft.',
    h1: 'Frührente: früher in Rente gehen und was es kostet',
    intro: 'Frührente ist kein Begriff aus dem Gesetz, sondern eine Sammelbezeichnung für vier Wege vor der Regelaltersgrenze. Der Rechner zeigt, was der Abschlag über die Jahre kostet.',
    resume: `Als Frührente bezeichnet man jede Altersrente, die vor der Regelaltersgrenze beginnt. Das Gesetz kennt dafür drei Wege: die Rente für langjährig Versicherte nach 35 Jahren ab 63, die Rente nach 45 Jahren ohne Abschlag zwei Jahre vor der Regelaltersgrenze und die Rente für schwerbehinderte Menschen, ab Jahrgang 1964 frühestens mit 62. Hinzu kommt die Erwerbsminderungsrente, die nicht vom Alter, sondern von der Gesundheit abhängt. Wer früher geht, verliert nach § 77 SGB VI ${DE.pct(AB, 1)} je Monat, lebenslang: zwei Jahre kosten ${DE.pct(k24.ab, 1)}, bei ${DE.eur(RENTE)} Rente also ${DE.eur(RENTE - k24.b.gekuerzt)} im Monat. Hinzu kommen die Entgeltpunkte, die in der gewonnenen Zeit nicht mehr entstehen. Netto fällt der Unterschied etwas kleiner aus, weil ein früheres Startjahr einen geringeren steuerpflichtigen Anteil bedeutet. Beantragen lässt sich die Frührente frühestens ein Jahr vor dem Beginn.`,
    faqs: [
      { q: 'Was kostet die Frührente pro Monat, den ich früher gehe?', a: `${DE.pct(AB, 1)} der Rente, und zwar für die gesamte Bezugsdauer. Ein Jahr früher sind ${DE.pct(abschlag(12), 1)}, zwei Jahre ${DE.pct(k24.ab, 1)}, vier Jahre ${DE.pct(abschlag(48), 1)}. Gerechnet wird bis zu dem Alter, ab dem die gewählte Rentenart abschlagsfrei ist, bei der Rente nach 35 Jahren also bis zur Regelaltersgrenze. Mit einer Ausgleichszahlung lässt sich der Abschlag abkaufen.` },
      { q: 'Wann lohnt es sich, mit der Rente zu warten statt früher zu gehen?', a: `Rechnerisch dann, wenn man lange Rente bezieht. Bei ${DE.eur(RENTE)} und zwei Jahren Vorsprung holt die spätere Rente den Vorsprung nach etwa ${DE.num(k24.b.monate / 12, 1)} Jahren auf. Zählt man zwei Entgeltpunkte hinzu, die bei Weiterarbeit mit Durchschnittsverdienst entstehen, sind es nur noch ${DE.num(k24ep.monate / 12, 1)} Jahre. Gesundheit, Partnerrente und Arbeitsbelastung wiegen oft schwerer.` },
      { q: 'Wie beantrage ich die Frührente richtig?', a: `Frühestens ein Jahr und am besten drei bis vier Monate vor dem gewünschten Beginn; Hilfe beim Ausfüllen geben die Auskunfts- und Beratungsstellen der Rentenversicherung. Vorher sollte der Versicherungsverlauf geklärt sein, damit fehlende Jahre nicht erst im Bescheid auffallen. Geht der Antrag später als ${FRIST} Kalendermonate nach Erreichen des Alters ein, beginnt die Rente erst mit dem Antragsmonat.` },
      { q: 'Kann ich in Frührente gehen und weiter Geld verdienen?', a: 'Ja. Für vorgezogene Altersrenten gibt es seit 2023 keine Hinzuverdienstgrenze mehr. Lohn neben der Rente bringt als Beschäftigter weitere Entgeltpunkte, die jeweils zum 1. Juli des Folgejahres die Rente erhöhen. Den Abschlag beseitigt das nicht. Anders ist es bei der Erwerbsminderungsrente: Dort gelten weiter Verdienstgrenzen.' },
      { q: 'Ist die Erwerbsminderungsrente auch eine Frührente?', a: `Im Sprachgebrauch oft, rechtlich nicht. Sie hängt davon ab, wie viele Stunden täglich man noch arbeiten kann: unter drei für die volle, drei bis unter sechs für die halbe Rente (§ 43 SGB VI). Nötig sind fünf Jahre Versicherung und drei Jahre Pflichtbeiträge in den letzten fünf. Ihr Abschlag ist auf ${DE.pct(abschlag(P.zugangsfaktor.em_max_monate), 1)} begrenzt.` },
      { q: 'Wird die Frührente durch die Rentenreform schwieriger?', a: `Nach den Vorschlägen der Alterssicherungskommission vom Juni 2026 ja: Die Rente nach 35 Jahren soll erst ab ${R.langjaehrig_neu_frueheste} möglich sein, die Rente nach 45 Jahren ohne Abschlag soll entfallen, die Altersteilzeit erst ab ${R.altersteilzeit_neu} statt ${R.altersteilzeit_alt} beginnen. Das sind Empfehlungen; ein Gesetzentwurf ist nicht veröffentlicht. Bis zu einer Änderung gilt das heutige Recht.` },
    ],
    body: (h) => `
<h2>Die Wege in die Frührente</h2>
<p>Welche Wege offenstehen, hängt von Versicherungsjahren und Gesundheit ab, die Termine vom Geburtsdatum. Die Tabelle zeigt alle Altersrenten für eine Person, die am 15. Oktober 1965 geboren ist und deren Regelaltersgrenze bei ${fmtAlter(regel.vollAlter, 'de')} liegt:</p>
${h.table(['Rentenart', 'Voraussetzung', 'Frühester Beginn', 'Abschlag dann', 'Ohne Abschlag ab'], [
  [h.a('langjaehrig-versicherte', 'Langjährig Versicherte'), '35 Jahre', fmtMonat(lj.frueh, 'de'), h.pct(lj.abschlag, 1), fmtMonat(lj.voll, 'de')],
  [h.a('schwerbehinderte', 'Schwerbehinderte Menschen'), '35 Jahre, GdB 50', fmtMonat(sb.frueh, 'de'), h.pct(sb.abschlag, 1), fmtMonat(sb.voll, 'de')],
  [h.a('rente-nach-45-jahren', 'Besonders langjährig Versicherte'), '45 Jahre', fmtMonat(bes.frueh, 'de'), h.pct(bes.abschlag, 1), fmtMonat(bes.voll, 'de')],
  ['Regelaltersrente', '5 Jahre', fmtMonat(regel.frueh, 'de'), 'keiner', fmtMonat(regel.voll, 'de')],
], 'Geburtstag 15. Oktober 1965', ['l', 'l', 'l', 'r', 'l'])}
<p>Gesetzlich geregelt sind diese Renten in ${h.src('sgb6_36', '§ 36')}, ${h.src('sgb6_37', '§ 37')} und ${h.src('sgb6_38', '§ 38 SGB VI')}. Wer mehrere Voraussetzungen erfüllt, kann zwischen den Wegen wählen; maßgeblich ist der Abschlag der Rentenart, die zum gewünschten Termin am günstigsten ist. Mit 45 Jahren und ohne Schwerbehinderung ist der günstigste frühe Termin ${fmtMonat(bes.frueh, 'de')}; jeder Monat davor läuft über die Rente nach 35 Jahren und bemisst den Abschlag bis zur Regelaltersgrenze.</p>
<h2>Was jeder Monat früher kostet</h2>
<p>Der Abschlag beträgt nach ${h.src('sgb6_77', '§ 77 SGB VI')} ${h.pct(AB, 1)} je Monat und gilt, solange die Rente läuft. Für eine Rente von ${h.eur(RENTE)} ohne Abschlag sieht das so aus:</p>
${h.table(['Früher um', 'Abschlag', 'Weniger im Monat', 'Weniger in 20 Jahren', 'Vorsprung bis zum regulären Beginn', 'Spätere Rente holt auf nach'], kosten.map((x) => [`${h.num(x.m)} Monate`, h.pct(x.ab, 1), h.eur(RENTE - x.b.gekuerzt), h.eur((RENTE - x.b.gekuerzt) * 240), h.eur(x.b.vorsprung), `${h.num(x.b.monate / 12, 1)} Jahren`]), `Rente ohne Abschlag ${h.eur(RENTE)}, ohne weitere Entgeltpunkte`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die letzte Spalte unterschätzt den wahren Preis, denn wer früher aufhört, sammelt keine Entgeltpunkte mehr. Ein Durchschnittsverdiener erwirbt einen Punkt im Jahr, das sind seit Juli 2026 ${h.eur(RW, 2)} Monatsrente. Rechnet man für zwei Jahre früher zwei fehlende Punkte ein, fehlen im Monat nicht ${h.eur(k24.b.diff)}, sondern ${h.eur(k24ep.diff, 2)}, und der Aufholpunkt rückt von ${h.num(k24.b.monate / 12, 1)} auf ${h.num(k24ep.monate / 12, 1)} Jahre nach vorn. Gezählt ab dem regulären Beginn mit ${regel.vollAlter.j}: Wer mit 65 aufhört und die Rente über das Alter von ${h.num(regel.vollAlter.j + k24ep.monate / 12)} hinaus bezieht, hätte mit Warten mehr bekommen.</p>
<h2>Brutto ist nicht netto</h2>
<p>Der Abschlag wirkt netto etwas schwächer. Zum einen bemessen sich Kranken- und Pflegebeitrag an der kleineren Bruttorente (${h.src('sgb5_249a', '§ 249a SGB V')}). Zum anderen ist bei einem früheren Startjahr ein geringerer Teil der Rente steuerpflichtig (${h.src('estg_22', '§ 22 EStG')}). Im Beispiel mit Geburtstag im Oktober 1965, alleinstehend, gesetzlich versichert, ohne weitere Einkünfte, rechnet der Motor so: Beginn mit 65 über die Rente nach 35 Jahren mit ${h.pct(ab65.abschlag, 1)} Abschlag ergibt ${h.eur(netFrueh.netto, 2)} netto, Beginn mit 67 ohne Abschlag ${h.eur(netRegel.netto, 2)}. Brutto liegen ${h.eur(RENTE * ab65.abschlag)} dazwischen, netto ${h.eur(netRegel.netto - netFrueh.netto, 2)}. Eigene Fälle rechnet der ${h.a('rentenrechner-brutto-netto', 'Rentenrechner brutto netto')}.</p>
<h2>Frührente beantragen</h2>
<p>Die Rente kommt nicht von selbst. Der Antrag lässt sich frühestens ein Jahr vor dem gewünschten Beginn stellen (${h.src('drvReform', 'Deutsche Rentenversicherung')}). Die Rente beginnt im Monat nach Erreichen des Alters, wenn er bis zum Ende des ${FRIST}. Kalendermonats danach eingeht; sonst ab dem Antragsmonat (${h.src('sgb6_99', '§ 99 SGB VI')}). Wer einen Abschlag ausgleichen möchte, braucht vorher eine Auskunft über den Ausgleichsbetrag, die ab 50 erteilt wird, mit der Erklärung, vorzeitig in Rente gehen zu wollen (${h.src('sgb6_187a', '§ 187a SGB VI')}). Die Schritte im Einzelnen, von der Kontenklärung bis zum Bescheid, beschreibt ${h.a('rente-beantragen', 'Rente beantragen')}.</p>
<h2>Weichere Übergänge</h2>
<p>Zwischen „ganz aufhören“ und „voll weiterarbeiten“ gibt es zwei Werkzeuge. Die ${h.a('teilrente', 'Teilrente')} erlaubt, nur einen Teil der Rente früh zu beziehen und den Abschlag auf diesen Teil zu begrenzen. Die ${h.a('ausgleichszahlung', 'Ausgleichszahlung')} kauft den Abschlag ganz oder teilweise ab, auch in Teilbeträgen. Wer gesundheitlich nicht mehr kann, prüft zuerst die ${h.a('erwerbsminderungsrente', 'Erwerbsminderungsrente')} nach ${h.src('sgb6_43', '§ 43 SGB VI')}, deren Abschlag höchstens ${h.pct(abschlag(P.zugangsfaktor.em_max_monate), 1)} beträgt.</p>
<h2>Was die Reform an der Frührente ändern würde</h2>
<p>Die Alterssicherungskommission empfiehlt in ihrem Bericht vom 23. Juni 2026 mehrere Änderungen, die frühes Aufhören betreffen (${h.src('bmasKommission', 'Bundesarbeitsministerium')}): Die Rente nach 35 Jahren soll erst ab ${R.langjaehrig_neu_frueheste} beginnen, die abschlagsfreie Rente nach 45 Jahren soll entfallen, Abschläge und Zuschläge sollen regelmäßig überprüft werden, und Altersteilzeit soll erst ab ${R.altersteilzeit_neu} statt ab ${R.altersteilzeit_alt} möglich sein, ohne Blockmodell. Neu wäre eine „Schutzrente“ für Menschen, die ihren langjährigen Beruf gesundheitlich nicht mehr ausüben können. Alles das sind Vorschläge ohne Gesetzentwurf; den Stand verfolgt ${h.a('rentenreform', 'Rentenreform')}.</p>`,
  },
  en: {
    slug: 'early-retirement-germany',
    nav: 'Early retirement',
    card: 'Every route before the standard age, what each costs and how to apply.',
    title: 'Early retirement in Germany 2026: routes, cost, applying',
    description: 'Early retirement in Germany in 2026: the routes before the standard age, what each month early costs gross and net, when waiting pays and how to apply.',
    h1: 'Early retirement in Germany: leaving sooner and what it costs',
    intro: 'Early retirement (Frührente) is not a legal term but a label for several routes before the standard age. The calculator shows what the reduction costs over the years.',
    resume: `Early retirement (Frührente) means any German old-age pension that starts before the standard retirement age (Regelaltersgrenze). The law offers three routes: the pension for long-term insured persons after 35 years from 63, the pension after 45 years with no reduction two years before the standard age, and the pension for severely disabled people, from 62 at the earliest for the 1964 cohort onwards. The disability pension for reduced earning capacity (Erwerbsminderungsrente) is a separate route that depends on health rather than age. Leaving early costs ${EN.pct(AB, 1)} per month under section 77 of Book VI of the Social Code, for life: two years cost ${EN.pct(k24.ab, 1)}, which on a ${EN.eur(RENTE)} pension is ${EN.eur(RENTE - k24.b.gekuerzt)} a month. On top come the pension points you no longer earn in the time you gain. Net of contributions and tax the gap is somewhat smaller, because an earlier start year means a lower taxable share. You can apply at the earliest one year before the start.`,
    faqs: [
      { q: 'How much does each month of early retirement cost in Germany?', a: `${EN.pct(AB, 1)} of the pension, for as long as it is paid. One year early is ${EN.pct(abschlag(12), 1)}, two years ${EN.pct(k24.ab, 1)}, four years ${EN.pct(abschlag(48), 1)}. The months are counted up to the age at which your pension type becomes unreduced, which for the 35-year pension is the standard age. A voluntary buy-out payment can offset the cut.` },
      { q: 'At what point does waiting longer for the pension pay off?', a: `If you draw the pension for a long time. With ${EN.eur(RENTE)} and a two-year head start, the later pension catches up after about ${EN.num(k24.b.monate / 12, 1)} years. Add two pension points that an average earner would gain by working on, and it takes only ${EN.num(k24ep.monate / 12, 1)} years. Health, a partner’s pension and the strain of work often weigh more.` },
      { q: 'How do I apply for early retirement in Germany?', a: `At the earliest one year ahead, ideally three to four months before the start; the advice centres of the pension insurance (Auskunfts- und Beratungsstellen) help with the forms. Have your insurance record checked first, so missing years do not surface only in the decision. If the application arrives more than ${FRIST} calendar months after you reach the age, the pension only starts in the month you apply.` },
      { q: 'Can I take early retirement and keep earning?', a: 'Yes. Since 2023 there is no earnings cap on early old-age pensions. If you work as an employee alongside the pension, you earn further pension points, which raise it each 1 July of the following year. That does not remove the reduction. The disability pension is different: earnings limits still apply there.' },
      { q: 'If I move abroad, can I still take early retirement from Germany?', a: 'Yes. The German pension can be paid to another EU country without any cut for living there, under Regulation 883/2004, and EU, EEA and Swiss periods are added to reach 35 or 45 years. Each country pays only its own share. Outside the EU the rules depend on the country and any agreement with Germany, so ask the pension insurance before you move.' },
      { q: 'Will the 2026 reform make early retirement harder?', a: `Under the pension commission’s June 2026 proposals, yes: the 35-year pension would start at ${R.langjaehrig_neu_frueheste} at the earliest, the unreduced 45-year pension would go, and partial retirement schemes (Altersteilzeit) would start at ${R.altersteilzeit_neu} instead of ${R.altersteilzeit_alt}. These are recommendations; no draft bill has been published. Current law applies until something changes.` },
    ],
    body: (h) => `
<h2>The routes into early retirement</h2>
<p>Which routes are open depends on your insured years and your health; the dates depend on your date of birth. The table shows every old-age pension for someone born on 15 October 1965, whose standard age is ${fmtAlter(regel.vollAlter, 'en')}:</p>
${h.table(['Pension type', 'Condition', 'Earliest start', 'Reduction then', 'Unreduced from'], [
  [h.a('langjaehrig-versicherte', 'Long-term insured'), '35 years', fmtMonat(lj.frueh, 'en'), h.pct(lj.abschlag, 1), fmtMonat(lj.voll, 'en')],
  [h.a('schwerbehinderte', 'Severely disabled'), '35 years, disability degree 50', fmtMonat(sb.frueh, 'en'), h.pct(sb.abschlag, 1), fmtMonat(sb.voll, 'en')],
  [h.a('rente-nach-45-jahren', 'Especially long-term insured'), '45 years', fmtMonat(bes.frueh, 'en'), h.pct(bes.abschlag, 1), fmtMonat(bes.voll, 'en')],
  ['Standard pension', '5 years', fmtMonat(regel.frueh, 'en'), 'none', fmtMonat(regel.voll, 'en')],
], 'Born 15 October 1965', ['l', 'l', 'l', 'r', 'l'])}
<p>The legal basis is ${h.src('sgb6_36', 'section 36')}, ${h.src('sgb6_37', 'section 37')} and ${h.src('sgb6_38', 'section 38 SGB VI')}. If you meet several conditions you can choose; what counts is the reduction of whichever type is cheapest on the date you want. With 45 years and no disability status the cheapest early date is ${fmtMonat(bes.frueh, 'en')}; every month before that runs through the 35-year pension, with the reduction measured to the standard age. Insurance years in other EU countries, the EEA and Switzerland count towards the 35 and 45 years.</p>
<h2>What each month early costs</h2>
<p>The reduction (Abschlag) is ${h.pct(AB, 1)} per month under ${h.src('sgb6_77', 'section 77 SGB VI')} and lasts as long as the pension. For an unreduced pension of ${h.eur(RENTE)}:</p>
${h.table(['Earlier by', 'Reduction', 'Less a month', 'Less over 20 years', 'Head start until regular date', 'Later start catches up after'], kosten.map((x) => [`${h.num(x.m)} months`, h.pct(x.ab, 1), h.eur(RENTE - x.b.gekuerzt), h.eur((RENTE - x.b.gekuerzt) * 240), h.eur(x.b.vorsprung), `${h.num(x.b.monate / 12, 1)} years`]), `Unreduced pension ${h.eur(RENTE)}, no further pension points`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The last column understates the real price, because stopping early also stops your pension points (Entgeltpunkte). An average earner gains one point a year, worth ${h.eur(RW, 2)} of monthly pension since July 2026. Count two missing points for leaving two years early and the monthly gap is not ${h.eur(k24.b.diff)} but ${h.eur(k24ep.diff, 2)}, and the catch-up point moves from ${h.num(k24.b.monate / 12, 1)} to ${h.num(k24ep.monate / 12, 1)} years. Counted from the regular start at ${regel.vollAlter.j}: if you stop at 65 and draw the pension beyond the age of ${h.num(regel.vollAlter.j + k24ep.monate / 12)}, waiting would have paid more.</p>
<h2>Gross is not net</h2>
<p>The reduction bites a little less after deductions. Health and long-term care contributions are charged on the smaller gross pension (${h.src('sgb5_249a', 'section 249a SGB V')}), and an earlier start year means a lower taxable share (${h.src('estg_22', 'section 22 Income Tax Act')}). For the October 1965 example, single, in the statutory health insurance and with no other income, the engine gives: starting at 65 through the 35-year pension with a ${h.pct(ab65.abschlag, 1)} reduction leaves ${h.eur(netFrueh.netto, 2)} net; starting at 67 unreduced leaves ${h.eur(netRegel.netto, 2)}. The gross gap is ${h.eur(RENTE * ab65.abschlag)}, the net gap ${h.eur(netRegel.netto - netFrueh.netto, 2)}. Try your own case in the ${h.a('rentenrechner-brutto-netto', 'net pension calculator')}.</p>
<h2>Applying for early retirement</h2>
<p>The pension does not start by itself. You can apply at the earliest one year before the start you want (${h.src('drvReform', 'German pension insurance')}). It begins the month after you reach the age if the application arrives by the end of the third calendar month after that; otherwise from the month you apply (${h.src('sgb6_99', 'section 99 SGB VI')}). If you plan to buy out the reduction, you first need a statement of the amount, issued from age 50, together with a declaration that you intend to retire early (${h.src('sgb6_187a', 'section 187a SGB VI')}). The steps from checking your record to the decision are under ${h.a('rente-beantragen', 'applying for your pension')}.</p>
<h2>Softer transitions</h2>
<p>Between stopping completely and working full time there are two tools. A ${h.a('teilrente', 'partial pension')} lets you draw only part of the pension early and limits the reduction to that part. A ${h.a('ausgleichszahlung', 'buy-out payment')} removes the reduction in whole or in part, also in instalments. If your health no longer allows work, look first at the ${h.a('erwerbsminderungsrente', 'disability pension')} under ${h.src('sgb6_43', 'section 43 SGB VI')}, whose reduction is capped at ${h.pct(abschlag(P.zugangsfaktor.em_max_monate), 1)}.</p>
<h2>What the reform would change</h2>
<p>The pension commission’s report of 23 June 2026 recommends several changes that affect leaving early (${h.src('bmasKommission', 'Federal Ministry of Labour')}): the 35-year pension would start at ${R.langjaehrig_neu_frueheste}, the unreduced 45-year pension would be abolished, reductions and increases would be reviewed regularly, and partial retirement would start at ${R.altersteilzeit_neu} instead of ${R.altersteilzeit_alt}, without the block model. A new “protection pension” (Schutzrente) would cover people who can no longer do their long-held job for health reasons. All of these are proposals without a draft bill; follow the state of play under ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
