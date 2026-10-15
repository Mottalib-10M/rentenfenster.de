import { defineGuide } from '../../lib/guide-types';
import { witwenrente, grossAlter } from '../../lib/engine/hinterbliebene';
import { abschlag } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Große oder kleine Witwenrente (§§ 46, 242a, 255, 67 SGB VI): Altersgrenze je Todesjahr, Rentenartfaktoren,
 * Beispiel mit einer Rente des Verstorbenen von 1.600 € (Annahme), Abschlag von 36 Monaten als zweites Beispiel.
 */
const W = P.witwe;
const RW = P.rentenwert.ab_2026_07;
const V = 1600;
const ohne = (gross: boolean, altesRecht = false, rente = V) =>
  witwenrente({ renteVerstorbener: rente, gross, altesRecht, einkommen: [], kinder: 0, rw: RW });
const gross = ohne(true), klein = ohne(false), alt = ohne(true, true);
const kleinAlt = ohne(false, true);
const g26 = grossAlter(2026), g27 = grossAlter(2027), g28 = grossAlter(2028), g29 = grossAlter(2029), g24 = grossAlter(2024);
const grenzen = [2024, 2025, 2026, 2027, 2028, 2029].map((t) => ({ t, g: grossAlter(t) }));
const AB_MON = 36;
const ab = abschlag(AB_MON);
const mitAbschlag = V * (1 - ab);
const grossAb = ohne(true, false, mitAbschlag);
const fA = (a: { j: number; m: number }, l: 'de' | 'en') => (a.m === 0 ? (l === 'de' ? `${a.j} Jahre` : `${a.j}`) : l === 'de' ? `${a.j} Jahre und ${a.m} Monate` : `${a.j} years and ${a.m} months`);
const pc = (x: number, l: 'de' | 'en') => (l === 'de' ? DE : EN).pct(x, 0);

export default defineGuide({
  id: 'grosse-witwenrente',
  group: 'familie',
  order: 200,
  mini: 'grossCheck',
  miniHref: 'witwenrente-rechner',
  related: ['witwenrente-rechner', 'witwenrente-einkommen', 'rente-beantragen', 'rente-ausland', 'erwerbsminderungsrente', 'besteuerung-rente'],
  sources: ['sgb6_46', 'sgb6_242a', 'sgb6_255', 'sgb6_67', 'sgb6_77', 'sgb6_50', 'sgb6_99', 'vo883'],
  de: {
    slug: 'grosse-kleine-witwenrente',
    nav: 'Große und kleine Witwenrente',
    card: `Große Witwenrente ab ${fA(g26, 'de')} (Todesjahr 2026) oder mit Kind unter 18, sonst die kleine für ${W.klein_monate} Monate.`,
    title: 'Große Witwenrente 2026: Altersgrenze und kleine Witwenrente',
    description: `Große Witwenrente 2026: ${pc(W.gross_faktor, 'de')} der Rente ab ${g26.j} Jahren und ${g26.m} Monaten oder mit Kind unter 18, sonst kleine mit ${pc(W.klein_faktor, 'de')} für ${W.klein_monate} Monate. Altersgrenze je Todesjahr.`,
    h1: 'Große und kleine Witwenrente: wer welche bekommt (2026)',
    intro: 'Ob nach dem Tod des Ehepartners mehr als die Hälfte seiner Rente bleibt oder nur ein Viertel für zwei Jahre, entscheiden Ihr Alter, Ihre Kinder und das Todesjahr.',
    resume: `Die Witwenrente gibt es in zwei Formen (§ 46 SGB VI). Die große Witwenrente beträgt ${pc(W.gross_faktor, 'de')} der Rente des Verstorbenen und wird ohne zeitliche Grenze gezahlt; sie steht zu, wer ein Kind unter 18 Jahren erzieht, selbst erwerbsgemindert ist oder beim Tod eine Altersgrenze erreicht hat. Diese Grenze steigt mit dem Todesjahr: ${fA(g24, 'de')} bei einem Tod im Jahr 2024, ${fA(g26, 'de')} im Jahr 2026, ${fA(g28, 'de')} im Jahr 2028 und ${fA(g29, 'de')} ab 2029 (§ 242a). Wer keine dieser Bedingungen erfüllt, bekommt die kleine Witwenrente: ${pc(W.klein_faktor, 'de')} der Rente, höchstens ${W.klein_monate} Monate lang. Aus einer Rente von 1.600 € werden so ${DE.eur(gross.brutto)} große oder ${DE.eur(klein.brutto)} kleine Witwenrente. Nach altem Recht, also bei Heirat vor 2002 und einem Partner, der vor dem 2. Januar 1962 geboren ist, sind es ${pc(W.gross_faktor_alt, 'de')} oder ${DE.eur(alt.brutto)}, und die kleine Rente ist nicht befristet. In den ersten drei Monaten nach dem Tod wird die volle Rente gezahlt. Eigenes Einkommen wird oberhalb eines Freibetrags angerechnet.`,
    faqs: [
      { q: 'Ab welchem Alter gibt es 2026 die große Witwenrente?', a: `Stirbt der Ehepartner im Jahr 2026, gilt eine Altersgrenze von ${fA(g26, 'de')}. Bei einem Tod im Jahr 2027 sind es ${fA(g27, 'de')}, 2028 ${fA(g28, 'de')} und ab 2029 dauerhaft ${fA(g29, 'de')}. Maßgeblich ist das Jahr des Todes, nicht das Jahr des Antrags. Wer jünger ist, bekommt die große Witwenrente nur mit einem Kind unter 18 oder bei eigener Erwerbsminderung.` },
      { q: 'Wie lange wird die kleine Witwenrente gezahlt?', a: `Höchstens ${W.klein_monate} Monate. Unbefristet ist sie nur, wenn der Partner vor 2002 gestorben ist oder wenn altes Recht gilt, also bei einer Ehe, die vor 2002 geschlossen wurde, und einem Partner, der vor dem 2. Januar 1962 geboren ist. Aus einer Rente von 1.600 € ergibt die kleine Witwenrente ${DE.eur(klein.brutto)} im Monat, vor der Anrechnung eigenen Einkommens.` },
      { q: 'Wer bekommt die Witwenrente noch nach altem Recht?', a: `Wer vor 2002 geheiratet hat, wenn mindestens einer der beiden Partner vor dem 2. Januar 1962 geboren ist (§ 255 SGB VI). Die große Witwenrente beträgt dann ${pc(W.gross_faktor_alt, 'de')} statt ${pc(W.gross_faktor, 'de')} der Rente des Verstorbenen, aus 1.600 € also ${DE.eur(alt.brutto)} statt ${DE.eur(gross.brutto)}. Auch die kleine Witwenrente läuft dann ohne die Grenze von ${W.klein_monate} Monaten.` },
      { q: 'Gibt es die große Witwenrente mit einem Kind unter 18 unabhängig vom Alter?', a: `Ja. Wer ein Kind unter 18 Jahren erzieht, erhält die große Witwenrente auch mit 30 oder 40 Jahren. Wird das Kind 18 und haben Sie dann weder die Altersgrenze erreicht noch eine Erwerbsminderung, kommt es auf die übrigen Voraussetzungen an; die Altersgrenze für einen Tod im Jahr 2026 liegt bei ${fA(g26, 'de')}. Den aktuellen Stand prüft der Mini-Rechner oben.` },
      { q: 'Was passiert mit der Witwenrente bei einer neuen Heirat?', a: `Mit einer neuen Ehe endet der Anspruch auf die Witwenrente. Dasselbe gilt, wenn Sie eine eingetragene Lebenspartnerschaft begründen. Wer wieder heiraten möchte, sollte vorher wissen, was wegfällt: Eine große Witwenrente aus 1.600 € sind ${DE.eur(gross.brutto)} im Monat vor Anrechnung, ${DE.eur(gross.brutto * 12)} im Jahr. Für den Einzelfall beraten die Auskunfts- und Beratungsstellen der Rentenversicherung.` },
      { q: 'Wird der Abschlag des Verstorbenen auf die Witwenrente übertragen?', a: `Ja. Hat der Partner seine Rente mit Abschlag begonnen, übernimmt die Witwenrente denselben Zugangsfaktor (§ 77 Abs. 3 SGB VI). Bei ${AB_MON} Monaten vor der Altersgrenze fehlen ${DE.pct(ab, 1)}: Aus 1.600 € wurden ${DE.eur(mitAbschlag, 2)}, und die große Witwenrente beträgt ${DE.eur(grossAb.brutto, 2)} statt ${DE.eur(gross.brutto)}. Der Abschlag gilt also für zwei Leben.` },
      { q: 'Welche Voraussetzungen muss der verstorbene Partner erfüllt haben?', a: 'Er muss die allgemeine Wartezeit von fünf Jahren erfüllt haben (§ 50 SGB VI). Die Ehe muss in der Regel mindestens ein Jahr bestanden haben. Versicherungszeiten in anderen Staaten der EU, des EWR und der Schweiz werden für die fünf Jahre mitgezählt; gezahlt wird aus Deutschland aber nur der Teil, der auf deutschen Zeiten beruht.' },
    ],
    body: (h) => `
<h2>Drei Wege zur großen Witwenrente</h2>
<p>Die große Witwenrente nach ${h.src('sgb6_46', '§ 46 Abs. 2 SGB VI')} steht zu, wer mindestens eine von drei Bedingungen erfüllt: ein Kind unter 18 Jahren erziehen, selbst erwerbsgemindert sein oder beim Tod des Partners eine bestimmte Altersgrenze erreicht haben. Fehlt alles drei, bleibt die kleine Witwenrente nach § 46 Abs. 1. Für Witwer gelten dieselben Regeln. Der Unterschied ist erheblich: ${h.pct(h.P.witwe.gross_faktor, 0)} gegen ${h.pct(h.P.witwe.klein_faktor, 0)} der Rente des Verstorbenen, und die eine wird bis zum Lebensende gezahlt, die andere ${h.P.witwe.klein_monate} Monate.</p>
<h2>Altersgrenze nach Todesjahr</h2>
${h.table(['Todesjahr', 'Altersgrenze für die große Witwenrente'], grenzen.map((r) => [r.t === 2029 ? 'ab 2029' : String(r.t), fA(r.g, 'de')]), 'Übergangsregel nach § 242a SGB VI', ['l', 'l'])}
<p>Die Grenze steigt bis 2028 um zwei Monate je Todesjahr und bleibt ab 2029 bei ${fA(g29, 'de')} (${h.src('sgb6_242a', '§ 242a SGB VI')}). Entscheidend ist der Tag des Todes, nicht Ihr Geburtsjahrgang. Eine Witwe, die im Oktober 2026 ihren Mann verliert und 46 Jahre und 8 Monate alt ist, liegt über der Grenze von ${fA(g26, 'de')} und erhält die große Witwenrente. Wäre derselbe Todesfall erst 2028 eingetreten, hätte sie die Grenze von ${fA(g28, 'de')} verfehlt.</p>
<h2>Was beide Renten aus 1.600 € ergeben</h2>
${h.table(['Phase oder Variante', 'Anteil', 'Im Monat', 'Dauer'], [
  ['Sterbevierteljahr', h.pct(1, 0), h.eur(gross.sterbevierteljahr), `${h.P.witwe.sterbevierteljahr_monate} Monate`],
  ['Große Witwenrente', h.pct(h.P.witwe.gross_faktor, 0), h.eur(gross.brutto), 'unbefristet'],
  ['Kleine Witwenrente', h.pct(h.P.witwe.klein_faktor, 0), h.eur(klein.brutto), `längstens ${h.P.witwe.klein_monate} Monate`],
  ['Große Witwenrente, altes Recht', h.pct(h.P.witwe.gross_faktor_alt, 0), h.eur(alt.brutto), 'unbefristet'],
  ['Kleine Witwenrente, altes Recht', h.pct(h.P.witwe.klein_faktor, 0), h.eur(kleinAlt.brutto), 'unbefristet'],
], 'Rente des Verstorbenen 1.600 € ohne Abschlag, vor Anrechnung von Einkommen', ['l', 'r', 'r', 'l'])}
<p>Die Anteile sind die Rentenartfaktoren aus ${h.src('sgb6_67', '§ 67 SGB VI')}. In den ersten drei Monaten nach dem Tod, dem Sterbevierteljahr, zahlt die Rentenversicherung die volle Rente des Verstorbenen und rechnet kein Einkommen an. Danach gilt der niedrigere Anteil, und eigenes Einkommen wird oberhalb des Freibetrags zu einem Teil abgezogen. Wie viel, zeigt ${h.a('witwenrente-einkommen', 'Witwenrente und eigenes Einkommen')}.</p>
<h2>Altes Recht: ${h.pct(h.P.witwe.gross_faktor_alt, 0)} und keine Befristung</h2>
<p>Für Ehen, die vor 2002 geschlossen wurden, gilt das alte Recht weiter, wenn einer der beiden vor dem 2. Januar 1962 geboren ist (${h.src('sgb6_255', '§ 255 SGB VI')}). Beides muss zusammenkommen. Ein Paar, das 1995 geheiratet hat und dessen älterer Partner 1960 geboren ist, fällt darunter; ein Paar, das 1995 geheiratet hat, beide 1965 geboren, nicht. Unter altem Recht beträgt die große Witwenrente ${h.pct(h.P.witwe.gross_faktor_alt, 0)}, und die kleine Witwenrente endet nicht nach ${h.P.witwe.klein_monate} Monaten. Ist der Partner schon vor 2002 gestorben, gilt die Befristung ebenfalls nicht.</p>
<h2>Der Abschlag des Verstorbenen lebt weiter</h2>
<p>Ging der Partner vorzeitig in Rente, trägt die Witwenrente seinen Abschlag mit (${h.src('sgb6_77', '§ 77 Abs. 3 SGB VI')}). Hatte er ${AB_MON} Monate vor seiner Altersgrenze begonnen, fehlen ${h.pct(ab, 1)}: Aus 1.600 € wurden ${h.eur(mitAbschlag, 2)}, die große Witwenrente sinkt von ${h.eur(gross.brutto)} auf ${h.eur(grossAb.brutto, 2)}. Wer als Paar über einen frühen Rentenbeginn nachdenkt, sollte diese zweite Wirkung mitrechnen.</p>
<h2>Voraussetzungen beim Verstorbenen und Antrag</h2>
<p>Der verstorbene Partner muss die allgemeine Wartezeit von fünf Jahren erfüllt haben (${h.src('sgb6_50', '§ 50 SGB VI')}); Zeiten in anderen EU-Staaten, dem EWR und der Schweiz zählen dafür mit (${h.src('vo883', 'Verordnung 883/2004')}). Die Ehe muss in der Regel mindestens ein Jahr bestanden haben. Die Witwenrente beginnt mit dem Monat, in dem die Voraussetzungen erfüllt sind, wird aber höchstens zwölf Monate rückwirkend vor dem Antrag gezahlt (${h.src('sgb6_99', '§ 99 SGB VI')}). Wer den Antrag aufschiebt, verliert ab dem 13. Monat Geld. Wie der Antrag abläuft, steht unter ${h.a('rente-beantragen', 'Rente beantragen')}; die Höhe mit allen Angaben rechnet der ${h.a('witwenrente-rechner', 'Witwenrentenrechner')}.</p>`,
  },
  en: {
    slug: 'large-and-small-widows-pension',
    nav: 'Large and small widow’s pension',
    card: `Large widow’s pension from ${fA(g26, 'en')} (death in 2026) or with a child under 18, otherwise the small one for ${W.klein_monate} months.`,
    title: 'Large widow’s pension 2026: age limit and small pension',
    description: `Large widow’s pension in Germany 2026: ${pc(W.gross_faktor, 'en')} of the pension from age ${g26.j} and ${g26.m} months or with a child under 18, otherwise ${pc(W.klein_faktor, 'en')} for ${W.klein_monate} months. Age limit by year.`,
    h1: 'Large and small widow’s pension in Germany (2026)',
    intro: 'Whether more than half of your late spouse’s pension remains, or a quarter for two years, depends on your age, your children and the year of death.',
    resume: `The German widow’s pension (Witwenrente) comes in two forms (section 46 SGB VI). The large widow’s pension (große Witwenrente) is ${pc(W.gross_faktor, 'en')} of the deceased’s pension and has no time limit; it goes to anyone raising a child under 18, who is themselves unable to work (erwerbsgemindert), or who has reached an age limit when the spouse dies. That limit rises with the year of death: ${fA(g24, 'en')} for a death in 2024, ${fA(g26, 'en')} in 2026, ${fA(g28, 'en')} in 2028 and ${fA(g29, 'en')} from 2029 (section 242a). If none of these applies, you receive the small widow’s pension (kleine Witwenrente): ${pc(W.klein_faktor, 'en')} of the pension, for at most ${W.klein_monate} months. A €1,600 pension thus gives ${EN.eur(gross.brutto)} as a large or ${EN.eur(klein.brutto)} as a small widow’s pension. Under the old rules, for a marriage before 2002 where one partner was born before 2 January 1962, the large pension is ${pc(W.gross_faktor_alt, 'en')}, or ${EN.eur(alt.brutto)}, and the small one has no time limit. The full pension is paid for the first three months after the death.`,
    faqs: [
      { q: 'From what age is the large German widow’s pension paid in 2026?', a: `If your spouse dies in 2026, the age limit is ${fA(g26, 'en')}. For a death in 2027 it is ${fA(g27, 'en')}, in 2028 ${fA(g28, 'en')}, and from 2029 permanently ${fA(g29, 'en')}. What counts is the year of death, not the year you apply. Below the limit you only get the large pension if you are raising a child under 18 or are unable to work yourself.` },
      { q: 'How long is the small widow’s pension paid?', a: `For at most ${W.klein_monate} months. It has no time limit only if your spouse died before 2002 or if the old rules apply, meaning a marriage before 2002 and a partner born before 2 January 1962. From a €1,600 pension the small widow’s pension is ${EN.eur(klein.brutto)} a month, before any income test.` },
      { q: 'Who still gets the widow’s pension under the old rules?', a: `Couples who married before 2002 where at least one partner was born before 2 January 1962 (section 255 SGB VI). The large widow’s pension is then ${pc(W.gross_faktor_alt, 'en')} instead of ${pc(W.gross_faktor, 'en')} of the deceased’s pension, so ${EN.eur(alt.brutto)} instead of ${EN.eur(gross.brutto)} from €1,600. The small widow’s pension also runs without the ${W.klein_monate}-month limit.` },
      { q: 'Do I get the large widow’s pension at any age with a child under 18?', a: `Yes. If you are raising a child under 18, you receive the large widow’s pension even at 30 or 40. When the child turns 18 and you have neither reached the age limit nor become unable to work, the other conditions decide; for a death in 2026 the age limit is ${fA(g26, 'en')}. The mini calculator above checks your case.` },
      { q: 'What happens to a German widow’s pension if I remarry?', a: `A new marriage ends the widow’s pension, and so does entering a registered partnership. Before remarrying it is worth knowing what is at stake: a large widow’s pension from a €1,600 pension is ${EN.eur(gross.brutto)} a month before any income test, ${EN.eur(gross.brutto * 12)} a year. The pension insurer’s information and advice centres can look at your individual case.` },
      { q: 'Does my late spouse’s early-retirement reduction carry over?', a: `Yes. If your spouse started the pension with a reduction, the widow’s pension keeps the same access factor (section 77(3) SGB VI). With ${AB_MON} months early, ${EN.pct(ab, 1)} is missing: €1,600 became ${EN.eur(mitAbschlag, 2)}, and the large widow’s pension is ${EN.eur(grossAb.brutto, 2)} instead of ${EN.eur(gross.brutto)}. The reduction is paid for over two lifetimes.` },
      { q: 'Do my late spouse’s insurance years in other EU countries count?', a: 'For the qualifying period, yes. The deceased must have completed the general qualifying period of five years (section 50 SGB VI), and insurance periods in other EU and EEA countries and Switzerland are added together for that. Germany then pays only the part based on German periods; each other country pays its own share.' },
    ],
    body: (h) => `
<h2>Three routes to the large widow’s pension</h2>
<p>Under ${h.src('sgb6_46', 'section 46(2) SGB VI')} the large widow’s pension goes to anyone who meets at least one of three conditions: raising a child under 18, being unable to work themselves, or having reached a certain age when the spouse died. If none applies, the small widow’s pension under section 46(1) remains. The same rules apply to widowers. The gap is wide: ${h.pct(h.P.witwe.gross_faktor, 0)} against ${h.pct(h.P.witwe.klein_faktor, 0)} of the deceased’s pension, one paid for life, the other for ${h.P.witwe.klein_monate} months.</p>
<h2>Age limit by year of death</h2>
${h.table(['Year of death', 'Age limit for the large widow’s pension'], grenzen.map((r) => [r.t === 2029 ? 'from 2029' : String(r.t), fA(r.g, 'en')]), 'Transitional rule under section 242a SGB VI', ['l', 'l'])}
<p>The limit rises by two months per year of death until 2028 and stays at ${fA(g29, 'en')} from 2029 (${h.src('sgb6_242a', 'section 242a SGB VI')}). What matters is the date of death, not your own year of birth. A widow who loses her husband in October 2026 at 46 years and 8 months is above the ${fA(g26, 'en')} limit and receives the large pension. Had the same death occurred in 2028, she would have missed the limit of ${fA(g28, 'en')}.</p>
<h2>What each pension gives from €1,600</h2>
${h.table(['Phase or variant', 'Share', 'A month', 'Duration'], [
  ['First three months', h.pct(1, 0), h.eur(gross.sterbevierteljahr), `${h.P.witwe.sterbevierteljahr_monate} months`],
  ['Large widow’s pension', h.pct(h.P.witwe.gross_faktor, 0), h.eur(gross.brutto), 'for life'],
  ['Small widow’s pension', h.pct(h.P.witwe.klein_faktor, 0), h.eur(klein.brutto), `up to ${h.P.witwe.klein_monate} months`],
  ['Large, old rules', h.pct(h.P.witwe.gross_faktor_alt, 0), h.eur(alt.brutto), 'for life'],
  ['Small, old rules', h.pct(h.P.witwe.klein_faktor, 0), h.eur(kleinAlt.brutto), 'for life'],
], 'Deceased’s pension €1,600 without reduction, before any income test', ['l', 'r', 'r', 'l'])}
<p>The shares are the pension type factors in ${h.src('sgb6_67', 'section 67 SGB VI')}. For the first three months after the death (Sterbevierteljahr), the full pension of the deceased is paid and no income is counted. After that the lower share applies, and your own income above an allowance is partly deducted; see ${h.a('witwenrente-einkommen', 'widow’s pension and your own income')}.</p>
<h2>Old rules: ${h.pct(h.P.witwe.gross_faktor_alt, 0)} and no time limit</h2>
<p>For marriages concluded before 2002, the old rules still apply if one partner was born before 2 January 1962 (${h.src('sgb6_255', 'section 255 SGB VI')}). Both conditions must be met. A couple who married in 1995 where the older partner was born in 1960 qualifies; a couple who married in 1995, both born in 1965, does not. Under the old rules the large pension is ${h.pct(h.P.witwe.gross_faktor_alt, 0)} and the small pension does not stop after ${h.P.witwe.klein_monate} months. If the spouse died before 2002, there is no time limit either.</p>
<h2>The deceased’s reduction lives on</h2>
<p>If your spouse retired early, the widow’s pension carries the same reduction (${h.src('sgb6_77', 'section 77(3) SGB VI')}). With a start ${AB_MON} months before the age limit, ${h.pct(ab, 1)} is missing: €1,600 became ${h.eur(mitAbschlag, 2)}, and the large widow’s pension falls from ${h.eur(gross.brutto)} to ${h.eur(grossAb.brutto, 2)}. Couples weighing an early start should count this second effect.</p>
<h2>Conditions on the deceased’s side and the claim</h2>
<p>Your late spouse must have completed the general qualifying period of five years (${h.src('sgb6_50', 'section 50 SGB VI')}). For international couples this is often the open question: periods in other EU and EEA countries and Switzerland count towards those five years (${h.src('vo883', 'Regulation (EC) No 883/2004')}), but Germany pays only on the German periods. The marriage must normally have lasted at least a year. The widow’s pension starts in the month the conditions are met, but is paid back no more than twelve months before the application (${h.src('sgb6_99', 'section 99 SGB VI')}), so a claim delayed by paperwork from abroad costs money from the 13th month. The procedure is under ${h.a('rente-beantragen', 'applying for the pension')}; the ${h.a('witwenrente-rechner', 'widow’s pension calculator')} works out the amount with all inputs.</p>`,
  },
});
