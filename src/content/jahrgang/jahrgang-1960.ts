import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, fmtAlter, regelalter, besondersAlter, idx, abschlag, zuschlag } from '../../lib/engine/alter';
import { besteuerungsanteil } from '../../lib/engine/geld';
import { DE, EN, P } from '../../lib/fmt';

/** Jahrgang 1960: letzte Etappe bis zur Regelaltersgrenze 66 + 4 (§ 235 SGB VI). Beispiel: Geburtstag 20. September. */
const J = 1960;
const g = { jahr: J, monat: 9, tag: 20 };
const alle = fenster(g, { wz35: true, wz45: true, schwb: true });
const ref = fenster(g, { wz35: true, wz45: true, schwb: false }, true);
const rg = alle.regel;
const lj = alle.opts.find((o) => o.art === 'langjaehrig')!;
const bes = alle.opts.find((o) => o.art === 'besonders')!;
const sb = alle.opts.find((o) => o.art === 'schwb')!;
const AM = P.zugangsfaktor.abschlag_monat;
const ZM = P.zugangsfaktor.zuschlag_monat;
const B = 1500;
/** Mögliche Startmonate ab November 2026 bis zum Regelbeginn. */
const starts = [idx(2026, 11), idx(2026, 12), idx(2027, 1)].filter((s) => s < rg.voll);
const kosten = (s: number) => ({ m: rg.voll - s, a: abschlag(rg.voll - s), r: B * (1 - abschlag(rg.voll - s)) });
const k1 = kosten(starts[0]);
const spaeter = 6;
const mitZuschlag = B * (1 + zuschlag(spaeter));
const nach = regelalter(J + 1);
const maxM = (j: number) => regelalter(j).j * 12 + regelalter(j).m - 63 * 12;
const st = (i: number) => Math.floor(i / 12);
/** Alter im Dativ („mit 64 Jahren und 4 Monaten“). */
const dat = (a: { j: number; m: number }) => (a.m === 0 ? `${a.j} Jahren` : `${a.j} Jahren und ${a.m} ${a.m === 1 ? 'Monat' : 'Monaten'}`);
const bA = (i: number) => besteuerungsanteil(st(i));

export default defineGuide({
  id: 'jahrgang-1960',
  group: 'jahrgang',
  order: 201,
  tool: 'fenster',
  toolPreset: { jahr: J },
  miniHref: 'abschlag-rechner',
  related: ['jahrgang-1961', 'rente-mit-63', 'spaeter-in-rente', 'besteuerung-rente', 'hinzuverdienst', 'abschlag-rechner'],
  sources: ['sgb6_235', 'sgb6_236', 'sgb6_236a', 'sgb6_236b', 'sgb6_77', 'estg_22', 'estg_3', 'bmasKommission'],
  de: {
    slug: 'rente-jahrgang-1960',
    nav: 'Jahrgang 1960',
    card: 'Regelaltersgrenze 66 Jahre und 4 Monate: Die letzten Monate vor dem Regelbeginn kosten wenig Abschlag.',
    title: 'Rente mit 63 Jahrgang 1960: Endspurt zur Regelrente 2026',
    description: 'Rente mit 63 Jahrgang 1960: Regelalter 66 Jahre und 4 Monate, 45 Jahre seit 2025 abschlagsfrei, Kosten jedes Monats vor dem Regelbeginn und Steueranteil 2026.',
    h1: 'Rente für den Jahrgang 1960',
    intro: 'Für 1960 Geborene ist 2026 das Jahr der letzten Entscheidung: jetzt mit kleinem Abschlag gehen, zum Regeltermin oder bewusst später.',
    resume: `Wer 1960 geboren ist, steht 2026 kurz vor dem Ziel. Die Regelaltersgrenze beträgt für diesen Jahrgang ${fmtAlter(regelalter(J), 'de')} (§ 235 SGB VI); bei einem Geburtstag am 20. September 1960 beginnt die Regelaltersrente am ${fmtMonat(rg.voll, 'de')}. Die früheren Wege sind schon offen: Nach 35 Versicherungsjahren war der Start ab ${fmtMonat(lj.frueh, 'de')} möglich, damals mit ${DE.pct(lj.abschlag, 1)} Abschlag für ${lj.monate} Monate; nach 45 Jahren gibt es die Rente ohne Abschlag seit dem ${fmtMonat(bes.voll, 'de')}, mit ${dat(besondersAlter(J))}. Wer heute noch arbeitet und 35 Jahre hat, zahlt für jeden Monat vor dem Regelbeginn ${DE.pct(AM, 1)} Abschlag: Ein Start am ${fmtMonat(starts[0], 'de')} kostet ${DE.pct(k1.a, 1)}, aus ${DE.eur(B)} würden ${DE.eur(k1.r, 2)}. Bei Beginn 2026 sind ${DE.pct(besteuerungsanteil(2026), 1)} der Rente steuerpflichtig, bei Beginn 2027 ${DE.pct(besteuerungsanteil(2027), 1)}. Alle Termine des Jahrgangs liegen vor ${P.reform.regel_kopplung_ab}, dem Jahr, ab dem die Kommission die Altersgrenze an die Lebenserwartung koppeln möchte; ein Gesetz dazu gibt es nicht.`,
    faqs: [
      { q: 'Ich bin Jahrgang 1960 und arbeite noch: Lohnt sich der Wechsel in die Rente vor dem Regeltermin?', a: `Die Rechnung ist kurz geworden. Jeder Monat vor dem Regelbeginn kostet ${DE.pct(AM, 1)} der Rente, lebenslang. Wer im September geboren ist und am ${fmtMonat(starts[0], 'de')} beginnt, verliert ${DE.pct(k1.a, 1)}; bei ${DE.eur(B)} sind das ${DE.eur(B - k1.r, 2)} im Monat. Dafür fließen ${k1.m} Monatsrenten früher. Ob das passt, hängt vor allem davon ab, wie lange die Rente voraussichtlich läuft.` },
      { q: 'Seit wann können 1960 Geborene nach 45 Jahren ohne Abschlag in Rente gehen?', a: `Mit ${dat(besondersAlter(J))}, also je nach Geburtsmonat ab 2024 oder 2025. Im Beispiel mit Geburtstag am 20. September war der erste mögliche Monat der ${fmtMonat(bes.voll, 'de')}. Früher geht diese Rentenart nicht, auch nicht mit Abschlag. Welche Zeiten für die 45 Jahre zählen, erklärt die Seite zur Wartezeit von 45 Jahren.` },
      { q: 'Was bringt es, als Jahrgang 1960 über die Regelaltersgrenze hinaus zu arbeiten?', a: `Für jeden Monat, um den Sie die Rente nach der Regelaltersgrenze aufschieben, steigt sie um ${DE.pct(ZM, 1)}. Sechs Monate Aufschub machen aus ${DE.eur(B)} also ${DE.eur(mitZuschlag)}. Zusätzlich bleibt Arbeitslohn aus einer Beschäftigung nach der Regelaltersgrenze bis ${DE.eur(P.steuer.aktivrente_jahr)} im Jahr steuerfrei (Aktivrente, § 3 EStG). Beides lässt sich kombinieren.` },
      { q: 'Wie hoch ist der Steueranteil, wenn meine Rente als Jahrgang 1960 im Februar 2027 beginnt?', a: `Maßgeblich ist das Jahr des Beginns. Für 2027 gilt ein Besteuerungsanteil von ${DE.pct(besteuerungsanteil(2027), 1)}, für einen Beginn noch 2026 wären es ${DE.pct(besteuerungsanteil(2026), 1)}. Der Unterschied ist klein. Wichtiger ist, dass der steuerfreie Teil im Jahr nach dem Rentenbeginn als Eurobetrag festgeschrieben wird und spätere Rentenerhöhungen voll steuerpflichtig sind.` },
      { q: 'Gilt mein Abschlag als Jahrgang 1960 auch für die spätere Witwenrente?', a: `Ja. Der Zugangsfaktor, der den Abschlag abbildet, bleibt erhalten und wird auf eine Hinterbliebenenrente aus dieser Rente übertragen (§ 77 Abs. 3 SGB VI). Wer mit ${DE.pct(k1.a, 1)} Abschlag beginnt, gibt diesen Anteil also auch an den überlebenden Ehepartner weiter. Bei wenigen Monaten Vorlauf bleibt der Effekt klein, er sollte aber in die Entscheidung einfließen.` },
    ],
    body: (h) => `
<h2>Wo der Jahrgang 1960 im Herbst 2026 steht</h2>
<p>Für diesen Jahrgang sind drei der vier Termine bereits erreicht. Die Altersgrenzen stammen aus den Übergangstabellen des SGB VI (${h.src('sgb6_235', '§ 235')}, ${h.src('sgb6_236', '§ 236')}, ${h.src('sgb6_236a', '§ 236a')}, ${h.src('sgb6_236b', '§ 236b')}) und wurden für 1960 jeweils um ${regelalter(J).m} Monate gegenüber der Grundstufe angehoben. Mit Geburtstag am 20. September 1960:</p>
${h.table(['Rentenart', 'Alter', 'Erster Monat', 'Stand Oktober 2026'], [
  ['Schwerbehinderung, frühestens', fmtAlter(sb.fruehAlter, 'de'), fmtMonat(sb.frueh, 'de'), `erreicht; Abschlag dort ${h.pct(sb.abschlag, 1)}`],
  ['35 Jahre, frühestens', fmtAlter(lj.fruehAlter, 'de'), fmtMonat(lj.frueh, 'de'), 'erreicht; Abschlag sinkt seither'],
  ['45 Jahre / Schwerbehinderung ohne Abschlag', fmtAlter(bes.vollAlter, 'de'), fmtMonat(bes.voll, 'de'), 'erreicht, ohne Abschlag'],
  ['Regelaltersrente', fmtAlter(rg.vollAlter, 'de'), fmtMonat(rg.voll, 'de'), 'noch nicht erreicht'],
], 'Jahrgang 1960, Geburtstag 20. September', ['l', 'l', 'l', 'l'])}
<p>Bemerkenswert ist die Spalte „Alter“: Wer schwerbehindert ist, erreicht die abschlagsfreie Grenze im selben Monat wie jemand mit 45 Jahren. Wer Ende Oktober 2026 noch beschäftigt ist, hat entweder weniger als 35 Jahre, wartet bewusst auf den Regeltermin oder hat die Wahl bisher nicht getroffen.</p>
<h2>Was jeder Monat vor dem Regelbeginn noch kostet</h2>
<p>Der Abschlag folgt § 77 SGB VI (${h.src('sgb6_77', 'Zugangsfaktor')}): ${h.pct(AM, 1)} je Monat zwischen Beginn und Regelaltersgrenze. Je näher der Regeltermin rückt, desto kleiner wird er. Für eine Rente, die zum Regelbeginn ${h.eur(B)} betragen würde:</p>
${h.table(['Beginn', 'Monate vorher', 'Abschlag', 'Monatsrente'], [
  ...starts.map((s) => { const k = kosten(s); return [fmtMonat(s, 'de'), k.m, h.pct(k.a, 1), h.eur(k.r, 2)]; }),
  [fmtMonat(rg.voll, 'de'), 0, h.pct(0, 1), h.eur(B, 2)],
], 'Beispiel 1.500 € zum Regelbeginn, Geburtstag 20. September 1960', ['l', 'r', 'r', 'r'])}
<p>Der Abschlag gilt auf Dauer, auch nach Erreichen der Regelaltersgrenze. Mit dem ${h.a('abschlag-rechner', 'Abschlagsrechner')} lässt sich die Rechnung mit Ihrem Betrag aus der Renteninformation wiederholen; das Rentenfenster oben zeigt den Vergleich je Rentenart.</p>
<h2>Der umgekehrte Weg: über den Februar 2027 hinaus</h2>
<p>Wer nach der Regelaltersgrenze weiterarbeitet und die Rente noch nicht abruft, erhält ${h.pct(ZM, 1)} Zuschlag je Monat. ${spaeter} Monate Aufschub ergeben aus ${h.eur(B)} rund ${h.eur(mitZuschlag)}. Daneben gilt die Aktivrente: Lohn aus einer Beschäftigung nach der Regelaltersgrenze bleibt bis ${h.eur(h.P.steuer.aktivrente_jahr)} im Jahr steuerfrei (${h.src('estg_3', '§ 3 EStG')}), ab dem Folgemonat und nur für Arbeitnehmer. Mehr dazu unter ${h.a('spaeter-in-rente', 'später in Rente')} und ${h.a('hinzuverdienst', 'Hinzuverdienst')}.</p>
<h2>Steuer: 2026 oder 2027 als Startjahr</h2>
<p>Der Besteuerungsanteil hängt nach ${h.src('estg_22', '§ 22 EStG')} am Jahr des Rentenbeginns. Für den Jahrgang 1960 fallen alle möglichen Starts in die Jahre ${st(sb.frueh)} bis ${st(rg.voll)}. Wer schon ${st(bes.voll)} nach 45 Jahren begonnen hat, versteuert ${h.pct(bA(bes.voll), 1)}; ein Beginn 2026 bringt ${h.pct(besteuerungsanteil(2026), 1)}, der Regelbeginn ${st(rg.voll)} ${h.pct(bA(rg.voll), 1)}. Die Spanne innerhalb des Jahrgangs beträgt also nur wenige halbe Prozentpunkte. Die Details stehen unter ${h.a('besteuerung-rente', 'Besteuerung der Rente')}.</p>
<h2>Ein Jahrgang weiter: 1961</h2>
<p>Wer 1961 geboren ist, erreicht jede Grenze zwei Monate später: Regelaltersrente mit ${dat(nach)}, die Rente nach 45 Jahren mit ${dat(besondersAlter(J + 1))}. Der höchste Abschlag bei Beginn mit 63 steigt dadurch von ${maxM(J)} auf ${maxM(J + 1)} Monate, also von ${h.pct(abschlag(maxM(J)), 1)} auf ${h.pct(abschlag(maxM(J + 1)), 1)} (${h.a('jahrgang-1961', 'Jahrgang 1961')}).</p>
<h2>Und der Reformvorschlag?</h2>
<p>Die ${h.src('bmasKommission', 'Alterssicherungskommission')} hat am 23. Juni 2026 empfohlen, die Rente nach 45 Jahren abzuschaffen, den frühesten Beginn nach 35 Jahren auf 64 anzuheben und die Regelaltersgrenze ab ${h.P.reform.regel_kopplung_ab} an die Lebenserwartung zu koppeln. Das ist ein Vorschlag, kein Gesetz. Für 1960 Geborene liegen der 64. Geburtstag und der Beginn der 45-Jahre-Rente bereits in der Vergangenheit, und der Regelbeginn ${st(rg.voll)} liegt vor ${h.P.reform.regel_kopplung_ab}. Das Szenario im Rechner oben zeigt für diesen Jahrgang deshalb überwiegend Termine, die schon verstrichen sind. Was sich darüber hinaus ergibt, verfolgt die Seite ${h.a('rentenreform', 'Rentenreform')}.</p>`,
  },
  en: {
    slug: 'born-in-1960-pension',
    nav: 'Born in 1960',
    card: 'Standard age 66 years 4 months: the last months before it cost only a small reduction.',
    title: 'Retire at 63, Born 1960: Final Stretch to Pension 2026',
    description: 'Retiring at 63 if born in 1960: standard age 66 years 4 months, 45-year pension open since 2025, cost of each month before the standard start, tax share 2026.',
    h1: 'German pension for people born in 1960',
    intro: 'If you were born in 1960, 2026 is the year of the last choice: leave now with a small reduction, wait for the standard date, or work on.',
    resume: `If you were born in 1960, 2026 brings you close to the finish line of the German statutory pension. The standard retirement age (Regelaltersgrenze) for this cohort is ${fmtAlter(regelalter(J), 'en')} (section 235 SGB VI); with a birthday on 20 September 1960 the standard pension starts on ${fmtMonat(rg.voll, 'en')}. The earlier routes are already open: after 35 insured years you could start from ${fmtMonat(lj.frueh, 'en')}, at that point with a ${EN.pct(lj.abschlag, 1)} reduction (Abschlag) for ${lj.monate} months; after 45 years an unreduced pension has been available since ${fmtMonat(bes.voll, 'en')}, at ${fmtAlter(besondersAlter(J), 'en')}. If you are still working with 35 years, each month before the standard date costs ${EN.pct(AM, 1)}: starting on ${fmtMonat(starts[0], 'en')} means ${EN.pct(k1.a, 1)} off, so ${EN.eur(B)} becomes ${EN.eur(k1.r, 2)}. For a 2026 start ${EN.pct(besteuerungsanteil(2026), 1)} of the pension is taxable, for 2027 ${EN.pct(besteuerungsanteil(2027), 1)}. All dates of this cohort fall before ${P.reform.regel_kopplung_ab}, the year from which the commission wants to link the age to life expectancy; no law exists on that.`,
    faqs: [
      { q: 'Born in 1960 and still employed: is it worth switching to the pension before the standard date?', a: `The calculation has become simple. Each month before the standard start costs ${EN.pct(AM, 1)} of the pension for life. With a September birthday and a start on ${fmtMonat(starts[0], 'en')}, the reduction is ${EN.pct(k1.a, 1)}; on ${EN.eur(B)} that is ${EN.eur(B - k1.r, 2)} a month. In return you receive ${k1.m} monthly payments earlier. Whether that suits you depends mostly on how long the pension is likely to run.` },
      { q: 'Since when can people born in 1960 take the unreduced 45-year pension?', a: `From ${fmtAlter(besondersAlter(J), 'en')}, so from 2024 or 2025 depending on the birth month. With a birthday on 20 September the first possible month was ${fmtMonat(bes.voll, 'en')}. This pension type cannot start earlier, not even with a reduction. Which periods count towards the 45 years is covered on the page about the 45-year qualifying period.` },
      { q: 'What do I gain by working past the standard age if I was born in 1960?', a: `For each month you defer the pension after the standard age it rises by ${EN.pct(ZM, 1)}, so six months turn ${EN.eur(B)} into ${EN.eur(mitZuschlag)}. On top of that, employment income earned after the standard age is tax-free up to ${EN.eur(P.steuer.aktivrente_jahr)} a year (Aktivrente, section 3 Income Tax Act). Both effects can be combined, but the tax relief applies to employees only.` },
      { q: 'If I leave Germany after retiring, does my 1960 pension date change?', a: 'No. The dates follow German law and your date of birth, wherever you live. Within the EU, the EEA and Switzerland, the pension is paid without a cut for living in another member state, and periods from those countries count towards the 35 or 45 years. Outside the EU it depends on the country and any agreement; ask the German Pension Insurance before moving.' },
      { q: 'Does my reduction carry over to a widow’s pension later?', a: `Yes. The access factor (Zugangsfaktor) that reflects the reduction stays in place and is passed on to a survivor’s pension derived from your pension (section 77(3) SGB VI). If you start with ${EN.pct(k1.a, 1)} off, your surviving spouse inherits that cut too. With only a few months to go the effect is small, but it belongs in the decision.` },
    ],
    body: (h) => `
<h2>Where the 1960 cohort stands in autumn 2026</h2>
<p>Three of the four dates have already arrived for this cohort. The ages come from the transition tables of the German pension code (${h.src('sgb6_235', 'section 235')}, ${h.src('sgb6_236', 'section 236')}, ${h.src('sgb6_236a', 'section 236a')}, ${h.src('sgb6_236b', 'section 236b')}), each raised by ${regelalter(J).m} months for 1960. With a birthday on 20 September 1960:</p>
${h.table(['Pension type', 'Age', 'First month', 'Status October 2026'], [
  ['Severe disability, earliest', fmtAlter(sb.fruehAlter, 'en'), fmtMonat(sb.frueh, 'en'), `reached; ${h.pct(sb.abschlag, 1)} off at that point`],
  ['35 years, earliest', fmtAlter(lj.fruehAlter, 'en'), fmtMonat(lj.frueh, 'en'), 'reached; reduction shrinking since'],
  ['45 years / disability unreduced', fmtAlter(bes.vollAlter, 'en'), fmtMonat(bes.voll, 'en'), 'reached, no reduction'],
  ['Standard pension', fmtAlter(rg.vollAlter, 'en'), fmtMonat(rg.voll, 'en'), 'not yet reached'],
], 'Born 20 September 1960', ['l', 'l', 'l', 'l'])}
<p>Note the age column: with a recognised severe disability you reach the unreduced limit in the same month as someone with 45 years. If you are still employed at the end of October 2026, you either have fewer than 35 years, are deliberately waiting for the standard date, or simply have not chosen yet.</p>
<h2>What each month before the standard start still costs</h2>
<p>The reduction follows ${h.src('sgb6_77', 'section 77 SGB VI')}: ${h.pct(AM, 1)} for every month between your start and the standard age, so it shrinks as the date approaches. For a pension of ${h.eur(B)} at the standard age:</p>
${h.table(['Start', 'Months early', 'Reduction', 'Monthly pension'], [
  ...starts.map((s) => { const k = kosten(s); return [fmtMonat(s, 'en'), k.m, h.pct(k.a, 1), h.eur(k.r, 2)]; }),
  [fmtMonat(rg.voll, 'en'), 0, h.pct(0, 1), h.eur(B, 2)],
], 'Example: €1,500 at the standard age, born 20 September 1960', ['l', 'r', 'r', 'r'])}
<p>The cut is permanent and remains after you pass the standard age. The ${h.a('abschlag-rechner', 'reduction calculator')} repeats this with the figure from your annual statement; the calculator above compares every pension type.</p>
<h2>The other direction: working past February 2027</h2>
<p>If you keep working after the standard age and do not draw the pension yet, it grows by ${h.pct(ZM, 1)} per month. ${spaeter} months of deferral lift ${h.eur(B)} to about ${h.eur(mitZuschlag)}. There is also the Aktivrente: wages from employment after the standard age stay tax-free up to ${h.eur(h.P.steuer.aktivrente_jahr)} a year (${h.src('estg_3', 'section 3 Income Tax Act')}), from the following month and for employees only. See ${h.a('spaeter-in-rente', 'retiring later')} and ${h.a('hinzuverdienst', 'earning alongside a pension')}.</p>
<h2>Tax: 2026 or 2027 as the start year</h2>
<p>Under ${h.src('estg_22', 'section 22 Income Tax Act')} the taxable share depends on the year the pension begins. For people born in 1960 every possible start falls between ${st(sb.frueh)} and ${st(rg.voll)}. Those who began in ${st(bes.voll)} after 45 years are taxed on ${h.pct(bA(bes.voll), 1)}; a 2026 start means ${h.pct(besteuerungsanteil(2026), 1)}, the standard start in ${st(rg.voll)} ${h.pct(bA(rg.voll), 1)}. If you plan to retire to another country, which state may tax the pension is a separate question this calculator does not answer; see ${h.a('besteuerung-rente', 'pension taxation')}.</p>
<h2>One cohort later: 1961</h2>
<p>People born in 1961 reach every limit two months later: the standard pension at ${fmtAlter(nach, 'en')}, the 45-year pension at ${fmtAlter(besondersAlter(J + 1), 'en')}. The maximum reduction at 63 therefore rises from ${maxM(J)} to ${maxM(J + 1)} months, from ${h.pct(abschlag(maxM(J)), 1)} to ${h.pct(abschlag(maxM(J + 1)), 1)} (${h.a('jahrgang-1961', 'born in 1961')}).</p>
<h2>And the reform proposal?</h2>
<p>On 23 June 2026 the ${h.src('bmasKommission', 'pension commission')} recommended abolishing the 45-year pension, raising the earliest start after 35 years to 64 and linking the standard age to life expectancy from ${h.P.reform.regel_kopplung_ab}. It is a proposal, not law. For the 1960 cohort the 64th birthday and the start of the 45-year pension are already in the past, and the standard start in ${st(rg.voll)} comes before ${h.P.reform.regel_kopplung_ab}. The scenario in the calculator above therefore shows mostly dates that have passed. Further developments are tracked under ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
