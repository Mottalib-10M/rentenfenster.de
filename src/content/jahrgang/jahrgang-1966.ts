import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, fmtAlter, regelalter, besondersAlter, schwbAlter, abschlagBei } from '../../lib/engine/alter';
import { besteuerungsanteil, ausgleich } from '../../lib/engine/geld';
import { rentenwert } from '../../lib/engine/params';
import { DE, EN, P } from '../../lib/fmt';

/** Jahrgang 1966: Recht wie 1964, 63 erst 2029, längster Vorlauf. Beispiel: Geburtstag 3. Oktober. */
const J = 1966;
const lage = { wz35: true, wz45: true, schwb: true };
const g = { jahr: J, monat: 10, tag: 3 };
const f = fenster(g, lage);
const ref = fenster(g, { wz35: true, wz45: true, schwb: false }, true);
const f64 = fenster({ jahr: 1964, monat: 10, tag: 3 }, lage);
const rg = f.regel;
const lj = f.opts.find((o) => o.art === 'langjaehrig')!;
const bes = f.opts.find((o) => o.art === 'besonders')!;
const sb = f.opts.find((o) => o.art === 'schwb')!;
const refLj = ref.opts.find((o) => o.art === 'langjaehrig')!;
const refBeiBes = abschlagBei(ref.opts, bes.voll)!;
/** Annahme: 40 Entgeltpunkte zur Regelaltersgrenze. */
const EP = 40;
const RW = rentenwert(2026, 7);
const aus = [
  { de: 'Beginn mit 63, geltendes Recht', en: 'Start at 63, current law', a: lj.abschlag },
  { de: 'Beginn mit 64, Vorschlag ohne Übergang', en: 'Start at 64, proposal without transition', a: refLj.abschlag },
  { de: 'Beginn mit 65 ohne 45-Jahre-Rente, Vorschlag', en: 'Start at 65 without 45-year pension, proposal', a: refBeiBes.abschlag },
].map((r) => ({ ...r, x: ausgleich(EP, r.a, RW) }));
const st = (i: number) => Math.floor(i / 12);
const bA = (i: number) => besteuerungsanteil(st(i));
const KOPPLUNG = P.reform.regel_kopplung_ab;

export default defineGuide({
  id: 'jahrgang-1966',
  group: 'jahrgang',
  order: 207,
  tool: 'fenster',
  toolPreset: { jahr: J },
  miniHref: 'ausgleichszahlung',
  related: ['jahrgang-1965', 'jahrgang-1964', 'ausgleichszahlung', 'renteninformation', 'rente-ausland', 'rentenreform'],
  sources: ['sgb6_35', 'sgb6_36', 'sgb6_38', 'sgb6_187a', 'sgb6_210', 'estg_22', 'bmasKommission', 'drvReform'],
  de: {
    slug: 'rente-jahrgang-1966',
    nav: 'Jahrgang 1966',
    card: '63 erst 2029, Regelaltersrente 2033: der längste Vorlauf und die größte Nähe zum Reformvorschlag.',
    title: 'Rente mit 63 Jahrgang 1966: Abschlag, Ausgleich, Reform 2026',
    description: 'Rente mit 63 Jahrgang 1966: frühestens 2029 mit 14,4 % Abschlag, nach 45 Jahren 2031, regulär 2033. Was der Vorschlag 2026 ändert und was Ausgleich kostet.',
    h1: 'Rente für den Jahrgang 1966',
    intro: 'Wer 1966 geboren ist, wird 2026 60 und hat bis zur Rente mit 63 noch drei Jahre Zeit, so viel wie kein anderer Jahrgang auf dieser Website.',
    resume: `Für den Jahrgang 1966 gelten dieselben Altersgrenzen wie seit 1964: Regelaltersrente mit ${regelalter(J).j} (§ 35 SGB VI), nach 45 Jahren ohne Abschlag mit ${besondersAlter(J).j} (§ 38), nach 35 Jahren frühestens mit 63 und dann ${DE.pct(lj.abschlag, 1)} Abschlag (§ 36). Bei einem Geburtstag am 3. Oktober 1966 heißt das: frühestens am ${fmtMonat(lj.frueh, 'de')}, abschlagsfrei nach 45 Jahren am ${fmtMonat(bes.voll, 'de')}, regulär am ${fmtMonat(rg.voll, 'de')}. Der Besteuerungsanteil steigt dabei von ${DE.pct(bA(lj.frueh), 1)} auf ${DE.pct(bA(rg.voll), 1)}. Weil der erste mögliche Rentenbeginn erst ${st(lj.frueh)} liegt, trifft der Kommissionsvorschlag vom 23. Juni 2026 diesen Jahrgang stärker als ältere: Ohne Übergang ginge es frühestens am ${fmtMonat(refLj.frueh, 'de')} mit ${DE.pct(refLj.abschlag, 1)} Abschlag, und ohne 45-Jahre-Rente kostete ein Beginn mit ${besondersAlter(J).j} ${DE.pct(refBeiBes.abschlag, 1)}. Das ist kein Gesetz. Wer den Abschlag ausgleichen will, kann das mit Sonderzahlungen bis zur Regelaltersgrenze; bei ${EP} Entgeltpunkten kostet der volle Ausgleich für 63 zu Werten von 2026 ${DE.eur(aus[0].x.betrag)}.`,
    faqs: [
      { q: 'Ich bin Jahrgang 1966: Wann kann ich frühestens Rentner werden?', a: `Nach geltendem Recht mit 63, wenn Sie 35 Versicherungsjahre haben, also im Jahr ${st(lj.frueh)}; im Beispiel mit Geburtstag am 3. Oktober am ${fmtMonat(lj.frueh, 'de')} mit ${DE.pct(lj.abschlag, 1)} Abschlag. Mit anerkannter Schwerbehinderung ist ein Beginn schon ab ${schwbAlter(J).frueh.j} möglich, im Beispiel am ${fmtMonat(sb.frueh, 'de')} mit ${DE.pct(sb.abschlag, 1)}. Ohne Abschlag geht es frühestens mit ${besondersAlter(J).j}.` },
      { q: 'Kann ich als Jahrgang 1966 den Abschlag mit Sonderzahlungen ausgleichen?', a: `Ja. Bis zur Regelaltersgrenze lassen sich Beiträge nachzahlen, die den Abschlag ganz oder teilweise ausgleichen (§ 187a SGB VI). Voraussetzung ist eine Rentenauskunft, die ab 50 möglich ist, verbunden mit der Erklärung, früher gehen zu wollen. Teilzahlungen sind erlaubt. Geht man am Ende doch später in Rente, wird nichts erstattet. Den Betrag zeigt der Rechner zur Ausgleichszahlung.` },
      { q: 'Wie stark wäre der Jahrgang 1966 vom Reformvorschlag betroffen?', a: `Rechnet man ohne Übergang, verschöbe sich der früheste Beginn um ein Jahr auf den ${fmtMonat(refLj.frueh, 'de')}, und die abschlagsfreie Rente nach 45 Jahren entfiele: Ein Beginn am ${fmtMonat(bes.voll, 'de')} kostete ${DE.pct(refBeiBes.abschlag, 1)}. Dazu läge der Regelbeginn ${st(rg.voll)} nach ${KOPPLUNG}, dem vorgeschlagenen Start der Kopplung an die Lebenserwartung. Alles das ist Vorschlag, kein Gesetz.` },
      { q: 'Welcher Steueranteil gilt für Menschen, die 1966 geboren sind?', a: `Er richtet sich nach dem Startjahr (§ 22 EStG): im Beispiel ${DE.pct(bA(lj.frueh), 1)} bei Beginn ${st(lj.frueh)} mit 63, ${DE.pct(bA(bes.voll), 1)} bei Beginn ${st(bes.voll)} nach 45 Jahren, ${DE.pct(bA(rg.voll), 1)} beim Regelbeginn ${st(rg.voll)}. Das sind jeweils ${DE.num((bA(lj.frueh) - bA(o64lj())) * 100, 1)} Prozentpunkte mehr als für jemanden mit demselben Geburtstag im Jahr 1964.` },
      { q: 'Was kann ich mit 60 schon für meine Rente vorbereiten?', a: 'Vor allem den Versicherungsverlauf klären: Lücken in der Renteninformation lassen sich jetzt noch mit Nachweisen schließen, später wird es mühsamer. Ob 35 oder 45 Jahre erreichbar sind, entscheidet über den frühesten Beginn. Wer einen Ausgleich des Abschlags erwägt, kann die dafür nötige Auskunft anfordern. Beratung bieten die Auskunfts- und Beratungsstellen der Deutschen Rentenversicherung.' },
    ],
    body: (h) => `
<h2>Der Jahrgang mit dem längsten Vorlauf</h2>
<p>1966 Geborene feiern 2026 ihren 60. Geburtstag. Bis zur Rente nach 35 Jahren (${h.src('sgb6_36', '§ 36 SGB VI')}) bleiben drei Jahre, bis zur 45-Jahre-Rente (${h.src('sgb6_38', '§ 38')}) fünf, bis zur Regelaltersgrenze (${h.src('sgb6_35', '§ 35')}) sieben. Die Grenzen selbst sind dieselben wie für 1964 und 1965; neu ist, dass alle Termine nach ${st(lj.frueh) - 1} liegen. Im Beispiel mit Geburtstag am 3. Oktober:</p>
<ul>
<li>${fmtMonat(sb.frueh, 'de')}: frühester Beginn bei Schwerbehinderung, ${h.pct(sb.abschlag, 1)} Abschlag;</li>
<li>${fmtMonat(lj.frueh, 'de')}: frühester Beginn nach 35 Jahren, ${h.pct(lj.abschlag, 1)} Abschlag;</li>
<li>${fmtMonat(bes.voll, 'de')}: ohne Abschlag nach 45 Jahren oder mit Schwerbehinderung;</li>
<li>${fmtMonat(rg.voll, 'de')}: Regelaltersrente.</li>
</ul>
<h2>Was der Abschlag in Sonderzahlungen kostet</h2>
<p>Wer früher gehen will, kann den Abschlag vorab mit Beiträgen ausgleichen (${h.src('sgb6_187a', '§ 187a SGB VI')}). Der Preis eines Entgeltpunkts beträgt 2026 ${h.eur(aus[0].x.proEP, 2)}, geteilt durch den Zugangsfaktor. Angenommen, bis zur Regelaltersgrenze kämen ${EP} Entgeltpunkte zusammen, also eine Rente von ${h.eur(EP * RW)} beim aktuellen Rentenwert; der Ausgleich kostete zu Werten von 2026:</p>
${h.table(['Fall', 'Abschlag', 'Rentenminus im Monat', 'Voller Ausgleich'], aus.map((r) => [r.de, h.pct(r.a, 1), h.eur(r.x.renteMinus, 2), h.eur(r.x.betrag)]), `Annahme ${EP} Entgeltpunkte, Geburtstag 3. Oktober 1966; Zeilen 2 und 3 sind kein geltendes Recht`, ['l', 'r', 'r', 'r'])}
<p>Teilzahlungen sind möglich, eine Erstattung gibt es nicht, auch wenn man am Ende doch später geht. Der Betrag hängt an den Rechengrößen des Zahlungsjahres und ändert sich deshalb bis ${st(lj.frueh)}. Der ${h.a('ausgleichszahlung', 'Rechner zur Ausgleichszahlung')} rechnet mit Ihren Entgeltpunkten aus der ${h.a('renteninformation', 'Renteninformation')}.</p>
<h2>Steuer: ein Prozentpunkt mehr als 1964</h2>
<p>Der Besteuerungsanteil steigt mit jedem Startjahr um einen halben Punkt (${h.src('estg_22', '§ 22 EStG')}). Für 1966 Geborene liegt jeder Rentenbeginn zwei Jahre nach dem entsprechenden Termin des Jahrgangs 1964: ${h.pct(bA(lj.frueh), 1)} statt ${h.pct(bA(o64lj()), 1)} mit 63, ${h.pct(bA(bes.voll), 1)} statt ${h.pct(bA(f64.opts.find((o) => o.art === 'besonders')!.voll), 1)} nach 45 Jahren, ${h.pct(bA(rg.voll), 1)} statt ${h.pct(bA(f64.regel.voll), 1)} zur Regelaltersgrenze.</p>
<h2>Der Reformvorschlag trifft diesen Jahrgang voll</h2>
<p>Die ${h.src('bmasKommission', 'Alterssicherungskommission')} empfiehlt, die Rente nach 45 Jahren abzuschaffen, den frühesten Beginn nach 35 Jahren auf 64 anzuheben und die Regelaltersgrenze ab ${KOPPLUNG} an die Lebenserwartung zu koppeln, bis 2041 etwa auf ${h.num(h.P.reform.regel_ziel_2041, 1)} Jahre. Für 1966 Geborene liegt jeder Rentenbeginn nach dem Ende 2026, bis zu dem ein Gesetz angestrebt wird. Ohne Übergang gerechnet: frühester Beginn am ${fmtMonat(refLj.frueh, 'de')} statt am ${fmtMonat(lj.frueh, 'de')}, und der Beginn am ${fmtMonat(bes.voll, 'de')} kostete ${h.pct(refBeiBes.abschlag, 1)} statt nichts. Welche Regelaltersgrenze sich aus der Kopplung für diesen Jahrgang ergäbe, legt der Vorschlag nicht fest; der Rechner oben rechnet weiter mit einer Regelaltersgrenze von ${regelalter(J).j} Jahren. Die ${h.src('drvReform', 'Deutsche Rentenversicherung')} erinnert daran, dass bis zu einem Gesetz nur das geltende Recht zählt. Stand: ${h.a('rentenreform', 'Rentenreform')}.</p>
<h2>Im Vergleich zu 1965</h2>
<p>Der ${h.a('jahrgang-1965', 'Jahrgang 1965')} erreicht jede Grenze ein Kalenderjahr früher und versteuert dadurch einen halben Prozentpunkt weniger. An den Altersgrenzen selbst ändert sich zwischen den beiden Jahrgängen nach geltendem Recht nichts.</p>`,
  },
  en: {
    slug: 'born-in-1966-pension',
    nav: 'Born in 1966',
    card: '63 only in 2029, standard pension in 2033: the longest lead time and the most exposure to the reform proposal.',
    title: 'Retire at 63, Born 1966: Reduction, Buy-Back, Reform 2026',
    description: 'Retiring at 63 if born in 1966: from 2029 with 14.4% off, after 45 years in 2031, standard 2033. What the 2026 proposal would change and what buying back costs.',
    h1: 'German pension for people born in 1966',
    intro: 'If you were born in 1966 you turn 60 in 2026 and still have three years until retiring at 63, more lead time than any other cohort covered here.',
    resume: `The 1966 cohort has the same age limits as everyone born since 1964: standard pension at ${fmtAlter(regelalter(J), 'en')} (section 35 SGB VI), unreduced after 45 years at ${besondersAlter(J).j} (section 38), and from 63 after 35 years with a ${EN.pct(lj.abschlag, 1)} reduction (Abschlag, section 36). With a birthday on 3 October 1966 that means: earliest on ${fmtMonat(lj.frueh, 'en')}, unreduced after 45 years on ${fmtMonat(bes.voll, 'en')}, standard on ${fmtMonat(rg.voll, 'en')}. The taxable share rises from ${EN.pct(bA(lj.frueh), 1)} to ${EN.pct(bA(rg.voll), 1)} across these dates. Because the first possible start is not until ${st(lj.frueh)}, the commission proposal of 23 June 2026 would hit this cohort harder than older ones: with no transition the earliest start would be ${fmtMonat(refLj.frueh, 'en')} with ${EN.pct(refLj.abschlag, 1)} off, and without the 45-year pension starting at ${besondersAlter(J).j} would cost ${EN.pct(refBeiBes.abschlag, 1)}. That is not law. You can offset the reduction with extra payments (Ausgleichszahlung) up to the standard age; with ${EP} pension points, fully offsetting a start at 63 costs ${EN.eur(aus[0].x.betrag)} at 2026 values.`,
    faqs: [
      { q: 'Born in 1966, what is the earliest I can draw a German pension?', a: `Under current law at 63 if you have 35 insured years, so in ${st(lj.frueh)}; with a 3 October birthday on ${fmtMonat(lj.frueh, 'en')}, with a ${EN.pct(lj.abschlag, 1)} reduction. With a recognised severe disability you can start from ${schwbAlter(J).frueh.j}, in the example on ${fmtMonat(sb.frueh, 'en')} with ${EN.pct(sb.abschlag, 1)} off. Without any reduction the earliest is ${besondersAlter(J).j}.` },
      { q: 'Can I buy back the early retirement reduction if I was born in 1966?', a: `Yes. Up to the standard age you can pay extra contributions that offset the reduction in full or in part (section 187a SGB VI). You first need a pension forecast, available from age 50, together with a statement that you intend to retire early. Part payments are allowed. If you end up retiring later, nothing is refunded. The offset calculator shows the amount for your points.` },
      { q: 'How hard would the reform proposal hit people born in 1966?', a: `Calculated with no transition, the earliest start would move a year later to ${fmtMonat(refLj.frueh, 'en')}, and the unreduced 45-year pension would go: starting on ${fmtMonat(bes.voll, 'en')} would cost ${EN.pct(refBeiBes.abschlag, 1)}. On top of that, the standard start in ${st(rg.voll)} comes after ${KOPPLUNG}, the proposed start of the life-expectancy link. All of this is a proposal, not law.` },
      { q: 'If I leave Germany before 2029, can I get my contributions refunded?', a: 'Only in narrow cases. A refund requires that you are no longer compulsorily insured and have no right to voluntary insurance, that the five-year qualifying period is not met, and that 24 months have passed. It covers only the employee half of the contributions, and your insurance record ends with it. With five years or more you keep a pension claim instead, paid abroad within the EU without a cut.' },
      { q: 'What can I prepare for my pension at 60?', a: 'Above all, clarify your insurance record: gaps in the annual statement can still be closed with evidence now, which gets harder later. Whether you reach 35 or 45 years decides your earliest start, and periods in other EU countries, the EEA or Switzerland count towards those totals. If you are considering an offset payment, you can request the forecast it needs. The German Pension Insurance advice centres can help.' },
    ],
    body: (h) => `
<h2>The cohort with the longest lead time</h2>
<p>People born in 1966 turn 60 in 2026. That leaves three years until the 35-year pension (${h.src('sgb6_36', 'section 36 SGB VI')}), five until the 45-year pension (${h.src('sgb6_38', 'section 38')}) and seven until the standard age (${h.src('sgb6_35', 'section 35')}). The limits are the same as for 1964 and 1965; what is new is that every date falls after ${st(lj.frueh) - 1}. With a birthday on 3 October:</p>
<ul>
<li>${fmtMonat(sb.frueh, 'en')}: earliest start with a severe disability, ${h.pct(sb.abschlag, 1)} off;</li>
<li>${fmtMonat(lj.frueh, 'en')}: earliest start after 35 years, ${h.pct(lj.abschlag, 1)} off;</li>
<li>${fmtMonat(bes.voll, 'en')}: no reduction after 45 years or with a severe disability;</li>
<li>${fmtMonat(rg.voll, 'en')}: standard pension.</li>
</ul>
<h2>What offsetting the reduction costs</h2>
<p>If you want to leave early, you can offset the reduction in advance with contributions (${h.src('sgb6_187a', 'section 187a SGB VI')}). In 2026 one pension point (Entgeltpunkt) costs ${h.eur(aus[0].x.proEP, 2)}, divided by the access factor. Assuming ${EP} points by the standard age, a pension of ${h.eur(EP * RW)} at the current pension value, a full offset would cost at 2026 values:</p>
${h.table(['Case', 'Reduction', 'Monthly loss', 'Full offset'], aus.map((r) => [r.en, h.pct(r.a, 1), h.eur(r.x.renteMinus, 2), h.eur(r.x.betrag)]), `Assumption ${EP} pension points, born 3 October 1966; rows 2 and 3 are not law`, ['l', 'r', 'r', 'r'])}
<p>Part payments are possible, and there is no refund, even if you end up retiring later. The price follows the figures of the year you pay, so it will change before ${st(lj.frueh)}. The ${h.a('ausgleichszahlung', 'offset payment calculator')} works with the points on your ${h.a('renteninformation', 'annual pension statement')}.</p>
<h2>Tax: one point more than 1964</h2>
<p>The taxable share rises by half a point with each start year (${h.src('estg_22', 'section 22 Income Tax Act')}). For people born in 1966 every start comes two years after the matching date for 1964: ${h.pct(bA(lj.frueh), 1)} instead of ${h.pct(bA(o64lj()), 1)} at 63, ${h.pct(bA(bes.voll), 1)} instead of ${h.pct(bA(f64.opts.find((o) => o.art === 'besonders')!.voll), 1)} after 45 years, ${h.pct(bA(rg.voll), 1)} instead of ${h.pct(bA(f64.regel.voll), 1)} at the standard age. If you plan to spend retirement in another country, which state taxes the pension is a separate question this calculator does not cover; see ${h.a('rente-ausland', 'pension abroad')}.</p>
<h2>The reform proposal hits this cohort fully</h2>
<p>The ${h.src('bmasKommission', 'pension commission')} recommends abolishing the 45-year pension, raising the earliest start after 35 years to 64 and linking the standard age to life expectancy from ${KOPPLUNG}, reaching about ${h.num(h.P.reform.regel_ziel_2041, 1)} by 2041. For people born in 1966 every start lies after the end of 2026, the target date for a law. With no transition: earliest start on ${fmtMonat(refLj.frueh, 'en')} instead of ${fmtMonat(lj.frueh, 'en')}, and starting on ${fmtMonat(bes.voll, 'en')} would cost ${h.pct(refBeiBes.abschlag, 1)} instead of nothing. The proposal does not set the standard age that the link would produce for this cohort; the calculator above still uses ${fmtAlter(regelalter(J), 'en')}. The ${h.src('drvReform', 'German Pension Insurance')} stresses that only current law counts until a law is passed. Status: ${h.a('rentenreform', 'pension reform')}.</p>
<h2>Compared with 1965</h2>
<p>The ${h.a('jahrgang-1965', '1965 cohort')} reaches each limit one calendar year earlier and is taxed on half a percentage point less. Under current law the age limits themselves are identical for both. Leaving Germany early? The ${h.src('sgb6_210', 'refund rules')} apply only if the five-year qualifying period is not met.</p>`,
  },
});

/** Früheste Rente des Vergleichsgeburtstags 1964 (3. Oktober). */
function o64lj() {
  return f64.opts.find((o) => o.art === 'langjaehrig')!.frueh;
}
