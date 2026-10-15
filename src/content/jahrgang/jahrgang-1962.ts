import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, fmtAlter, regelalter, besondersAlter, monatsName, abschlag, abschlagBei } from '../../lib/engine/alter';
import { besteuerungsanteil } from '../../lib/engine/geld';
import { DE, EN, P } from '../../lib/fmt';

/** Jahrgang 1962: Rente nach 45 Jahren mit 64 + 8, Beginn je nach Geburtsmonat 2026 oder 2027. Beispiel: Geburtstag 8. Juli. */
const J = 1962;
const g = { jahr: J, monat: 7, tag: 8 };
const lage = { wz35: true, wz45: true, schwb: true };
const f = fenster(g, lage);
const ref = fenster(g, { wz35: true, wz45: true, schwb: false }, true);
const rg = f.regel;
const lj = f.opts.find((o) => o.art === 'langjaehrig')!;
const bes = f.opts.find((o) => o.art === 'besonders')!;
const sb = f.opts.find((o) => o.art === 'schwb')!;
const refLj = ref.opts.find((o) => o.art === 'langjaehrig')!;
/** Im Vorschlagsszenario: Abschlag bei Beginn im Monat der heutigen 45-Jahre-Rente. */
const beiBes = abschlagBei(ref.opts, bes.voll)!;
const B = 1500;
const st = (i: number) => Math.floor(i / 12);
const bA = (i: number) => besteuerungsanteil(st(i));
/** Erster Monat der Rente nach 45 Jahren je Geburtsmonat (Geburtstag am 15.). */
const proMonat = Array.from({ length: 12 }, (_, k) => {
  const x = fenster({ jahr: J, monat: k + 1, tag: 15 }, lage);
  const b = x.opts.find((o) => o.art === 'besonders')!;
  return { m: k + 1, bes: b.voll, regel: x.regel.voll };
});
const in2026 = proMonat.filter((r) => st(r.bes) === 2026);
const letzter26 = in2026[in2026.length - 1].m;
const antrag = bes.voll - 12;
const maxM = (j: number) => regelalter(j).j * 12 + regelalter(j).m - 63 * 12;
const dat = (a: { j: number; m: number }) => (a.m === 0 ? `${a.j} Jahren` : `${a.j} Jahren und ${a.m} ${a.m === 1 ? 'Monat' : 'Monaten'}`);

export default defineGuide({
  id: 'jahrgang-1962',
  group: 'jahrgang',
  order: 203,
  tool: 'fenster',
  toolPreset: { jahr: J },
  miniHref: 'rentenbeginn-rechner',
  related: ['jahrgang-1961', 'jahrgang-1963', 'rente-nach-45-jahren', 'wartezeit-45-jahre', 'arbeitslos-vor-der-rente', 'rente-beantragen', 'rentenreform'],
  sources: ['sgb6_236b', 'sgb6_235', 'sgb6_51', 'sgb6_77', 'estg_22', 'drvReform', 'bregReform', 'bmasKommission'],
  de: {
    slug: 'rente-jahrgang-1962',
    nav: 'Jahrgang 1962',
    card: 'Nach 45 Jahren mit 64 und 8 Monaten: je nach Geburtsmonat Beginn 2026 oder 2027.',
    title: 'Rente mit 63 Jahrgang 1962: 45 Jahre, Abschlag, Reform 2026',
    description: 'Rente mit 63 Jahrgang 1962: 13,2 % Abschlag ab 63, nach 45 Jahren mit 64 und 8 Monaten, Beginn 2026 oder 2027 je nach Monat. Antrag und Reformvorschlag 2026.',
    h1: 'Rente für den Jahrgang 1962',
    intro: 'Beim Jahrgang 1962 entscheidet der Geburtsmonat, ob die abschlagsfreie Rente nach 45 Jahren noch 2026 oder erst 2027 beginnt.',
    resume: `Für 1962 Geborene liegt die Grenze der Rente nach 45 Versicherungsjahren bei ${dat(besondersAlter(J))} (§ 236b SGB VI), die Regelaltersgrenze bei ${dat(regelalter(J))} (§ 235). Mit 63 und 35 Jahren ist der Beginn möglich, kostet aber ${maxM(J)} Monate mal ${DE.pct(P.zugangsfaktor.abschlag_monat, 1)}, also ${DE.pct(lj.abschlag, 1)} Abschlag. Die 45-Jahre-Rente fällt bei diesem Jahrgang über den Jahreswechsel: Wer bis ${monatsName(letzter26, 'de')} geboren ist, kann sie noch 2026 beginnen, alle anderen 2027. Im Beispiel mit Geburtstag am 8. Juli 1962 ist der erste abschlagsfreie Monat der ${fmtMonat(bes.voll, 'de')}, der Antrag ist seit dem ${fmtMonat(antrag, 'de')} möglich, der Besteuerungsanteil beträgt ${DE.pct(bA(bes.voll), 1)}. Regulär beginnt die Rente am ${fmtMonat(rg.voll, 'de')}. Würde der Kommissionsvorschlag vom 23. Juni 2026 ohne Übergang gelten, entfiele die 45-Jahre-Rente: Ein Beginn im ${fmtMonat(bes.voll, 'de').slice(3)} kostete dann ${DE.pct(beiBes.abschlag, 1)} Abschlag. Das ist ein Szenario, kein Gesetz; ein Entwurf ist nicht veröffentlicht.`,
    faqs: [
      { q: 'Kann ich als Jahrgang 1962 die Rente nach 45 Jahren noch 2026 beginnen?', a: `Nur wenn Sie früh im Jahr geboren sind. Die Grenze liegt bei ${dat(besondersAlter(J))}; bei einem Geburtstag bis ${monatsName(letzter26, 'de')} wird sie 2026 erreicht, bei späteren Geburtstagen erst 2027. Wer am Ersten eines Monats geboren ist, rückt einen Monat nach vorn. Vor der Grenze gibt es diese Rente nicht, auch nicht mit Abschlag.` },
      { q: 'Ab wann darf ich als Jahrgang 1962 den Rentenantrag stellen?', a: `Frühestens ein Jahr vor dem gewünschten Beginn, darauf weist die Deutsche Rentenversicherung hin. Für eine 45-Jahre-Rente ab dem ${fmtMonat(bes.voll, 'de')} ist der Antrag also seit dem ${fmtMonat(antrag, 'de')} möglich. Er sichert kein altes Recht, weil für jede Rente das Recht bei ihrem Beginn gilt. Sinnvoll ist er trotzdem früh, damit offene Zeiten noch geklärt werden können.` },
      { q: 'Zählt mein Arbeitslosengeld kurz vor der Rente für die 45 Jahre?', a: 'Zeiten mit Arbeitslosengeld zählen grundsätzlich, in den letzten zwei Jahren vor dem Rentenbeginn aber nur, wenn die Arbeitslosigkeit auf einer Insolvenz oder vollständigen Geschäftsaufgabe des Arbeitgebers beruht (§ 51 Abs. 3a SGB VI). Bürgergeld zählt nie. Wer 1962 geboren ist und jetzt arbeitslos wird, sollte das vor der Planung prüfen lassen.' },
      { q: 'Was kostet mich der Reformvorschlag, wenn ich 1962 geboren bin?', a: `Im Szenario ohne Übergang fiele die Rente nach 45 Jahren weg. Ein Beginn im ${fmtMonat(bes.voll, 'de').slice(3)} hätte dann ${beiBes.monate} Monate Abstand zur Regelaltersgrenze und kostete ${DE.pct(beiBes.abschlag, 1)}; aus ${DE.eur(B)} würden ${DE.eur(B * (1 - beiBes.abschlag))}. Die Kommission empfiehlt ausdrücklich Vertrauensschutz. Wen er erfasst, steht erst im Gesetz, und das gibt es noch nicht.` },
      { q: 'Wie viel Prozent Steuer gilt beim Jahrgang 1962 für die Rente ab 2027?', a: `Der Besteuerungsanteil richtet sich nach dem Startjahr: ${DE.pct(besteuerungsanteil(2026), 1)} für einen Beginn 2026, ${DE.pct(besteuerungsanteil(2027), 1)} für 2027 und ${DE.pct(bA(rg.voll), 1)} für den Regelbeginn ${st(rg.voll)}. Ob tatsächlich Einkommensteuer anfällt, hängt von der Höhe der Rente und den weiteren Einkünften ab. Der Rest bleibt als fester Eurobetrag steuerfrei, festgelegt im Jahr nach dem Beginn.` },
    ],
    body: (h) => `
<h2>Ein Jahrgang, zwei Startjahre</h2>
<p>Die 45-Jahre-Grenze steigt für 1962 Geborene auf ${fmtAlter(besondersAlter(J), 'de')} (${h.src('sgb6_236b', '§ 236b SGB VI')}). Weil die acht Monate über den Jahreswechsel reichen, beginnt die abschlagsfreie Rente je nach Geburtsmonat in zwei verschiedenen Kalenderjahren, mit unterschiedlichem Steueranteil. Gerechnet mit einem Geburtstag jeweils am 15.:</p>
${h.table(['Geboren im', 'Nach 45 Jahren ab', 'Steueranteil', 'Regulär ab'], proMonat.map((r) => [monatsName(r.m, 'de'), fmtMonat(r.bes, 'de'), h.pct(bA(r.bes), 1), fmtMonat(r.regel, 'de')]), 'Jahrgang 1962, Geburtstag am 15. des Monats', ['l', 'l', 'r', 'l'])}
<p>Wer am 1. eines Monats geboren ist, liegt jeweils einen Monat früher. Für die Rente mit 63 nach 35 Jahren spielt die Zweiteilung keine Rolle: Der 63. Geburtstag lag für alle 1962 Geborenen im Jahr 2025.</p>
<h2>Beispiel 8. Juli 1962: die Termine im Überblick</h2>
<ul>
<li><strong>${fmtMonat(sb.frueh, 'de')}:</strong> frühester Beginn bei anerkannter Schwerbehinderung, mit ${h.pct(sb.abschlag, 1)} Abschlag.</li>
<li><strong>${fmtMonat(lj.frueh, 'de')}:</strong> frühester Beginn nach 35 Jahren, mit ${h.pct(lj.abschlag, 1)} Abschlag (${h.src('sgb6_77', '§ 77 SGB VI')}).</li>
<li><strong>${fmtMonat(antrag, 'de')}:</strong> ab hier lässt sich die 45-Jahre-Rente beantragen, ein Jahr vor dem Beginn.</li>
<li><strong>${fmtMonat(bes.voll, 'de')}:</strong> abschlagsfrei nach 45 Jahren oder mit Schwerbehinderung.</li>
<li><strong>${fmtMonat(rg.voll, 'de')}:</strong> Regelaltersrente mit ${dat(regelalter(J))} (${h.src('sgb6_235', '§ 235')}).</li>
</ul>
<p>Zwischen der 45-Jahre-Rente und der Regelaltersrente liegen ${rg.voll - bes.voll} Monate. Wer die 45 Jahre knapp verfehlt, kann sie oft noch erreichen, wenn er weiterarbeitet; welche Zeiten zählen, steht in ${h.src('sgb6_51', '§ 51 Abs. 3a SGB VI')} und ausführlich unter ${h.a('wartezeit-45-jahre', 'Wartezeit von 45 Jahren')}. Vorsicht bei Arbeitslosigkeit kurz vor dem Ziel: ${h.a('arbeitslos-vor-der-rente', 'Arbeitslos vor der Rente')} erklärt die Zwei-Jahres-Regel.</p>
<h2>Geltendes Recht und Vorschlag nebeneinander</h2>
<p>Der Jahrgang 1962 ist der erste der Übergangsjahrgänge, bei dem die abschlagsfreie Rente nach 45 Jahren teilweise erst 2027 beginnt, also nach dem Zeitpunkt, bis zu dem die Koalition ein Gesetz anstrebt (${h.src('bregReform', 'Bundesregierung')}). Die ${h.src('bmasKommission', 'Kommission')} empfiehlt, diese Rentenart abzuschaffen und den frühesten Beginn nach 35 Jahren auf 64 zu setzen. Ohne Übergangsregel gerechnet, ergäbe das für das Beispiel:</p>
${h.table(['', 'Geltendes Recht', 'Vorschlag ohne Übergang'], [
  ['Frühester Beginn nach 35 Jahren', `${fmtMonat(lj.frueh, 'de')}, ${h.pct(lj.abschlag, 1)}`, `${fmtMonat(refLj.frueh, 'de')}, ${h.pct(refLj.abschlag, 1)}`],
  ['Abschlagsfrei mit 45 Jahren', fmtMonat(bes.voll, 'de'), fmtMonat(ref.abschlagsfrei.voll, 'de')],
  [`Abschlag bei Beginn ${fmtMonat(bes.voll, 'de')}`, h.pct(0, 1), h.pct(beiBes.abschlag, 1)],
  [`Rente aus ${h.eur(B)} bei diesem Beginn`, h.eur(B), h.eur(B * (1 - beiBes.abschlag))],
], 'Geburtstag 8. Juli 1962; das Szenario ist kein geltendes Recht', ['l', 'l', 'l'])}
<p>Die Kommission verlangt ausdrücklich Vertrauensschutz; welche Geburtsjahrgänge er umfasst, kann erst ein Gesetz festlegen. Die ${h.src('drvReform', 'Deutsche Rentenversicherung')} betont, dass bis dahin das geltende Recht maßgeblich ist. Aktuelles unter ${h.a('rentenreform', 'Rentenreform')}.</p>
<h2>Der Abstand zu 1961 und 1963</h2>
<p>Gegenüber ${h.a('jahrgang-1961', '1961')} kommen zwei Monate hinzu, gegenüber ${h.a('jahrgang-1963', '1963')} fehlen noch zwei: Dort liegen die Grenzen bei ${dat(besondersAlter(J + 1))} und ${dat(regelalter(J + 1))}, und der höchste Abschlag mit 63 erreicht ${h.pct(abschlag(maxM(J + 1)), 1)}. Das Rentenfenster oben rechnet jeden Geburtstag dieses Jahrgangs auf den Monat genau.</p>`,
  },
  en: {
    slug: 'born-in-1962-pension',
    nav: 'Born in 1962',
    card: 'Unreduced at 64 and 8 months after 45 years: start in 2026 or 2027 depending on the birth month.',
    title: 'Retire at 63, Born 1962: 45 Years, Reduction, Reform 2026',
    description: 'Retiring at 63 if born in 1962: 13.2% reduction at 63, unreduced at 64 and 8 months after 45 years, start in 2026 or 2027 by month. Applying and reform 2026.',
    h1: 'German pension for people born in 1962',
    intro: 'For the 1962 cohort, the birth month decides whether the unreduced 45-year pension starts in 2026 or only in 2027.',
    resume: `If you were born in 1962, the limit for the pension after 45 insured years (besonders langjährig Versicherte) is ${fmtAlter(besondersAlter(J), 'en')} (section 236b SGB VI) and the standard retirement age is ${fmtAlter(regelalter(J), 'en')} (section 235). Starting at 63 with 35 years is possible but costs ${maxM(J)} months times ${EN.pct(P.zugangsfaktor.abschlag_monat, 1)}, a ${EN.pct(lj.abschlag, 1)} reduction (Abschlag). For this cohort the 45-year pension straddles the turn of the year: born up to ${monatsName(letzter26, 'en')}, you can start it in 2026, otherwise in 2027. With a birthday on 8 July 1962 the first unreduced month is ${fmtMonat(bes.voll, 'en')}, the application has been possible since ${fmtMonat(antrag, 'en')}, and the taxable share is ${EN.pct(bA(bes.voll), 1)}. The standard pension starts on ${fmtMonat(rg.voll, 'en')}. If the commission proposal of 23 June 2026 applied with no transition, the 45-year pension would disappear and starting in ${fmtMonat(bes.voll, 'en').slice(2)} would cost ${EN.pct(beiBes.abschlag, 1)}. That is a scenario, not law; no draft bill has been published.`,
    faqs: [
      { q: 'Born in 1962, can I still start the 45-year pension in 2026?', a: `Only if you were born early in the year. The limit is ${fmtAlter(besondersAlter(J), 'en')}; with a birthday up to ${monatsName(letzter26, 'en')} you reach it in 2026, later birthdays only in 2027. If you were born on the first of a month, move one month earlier. This pension never starts before its limit, not even with a reduction.` },
      { q: 'When can someone born in 1962 file the pension application?', a: `At the earliest one year before the start you want, as the German Pension Insurance points out. For a 45-year pension from ${fmtMonat(bes.voll, 'en')}, applying has been possible since ${fmtMonat(antrag, 'en')}. Applying early does not lock in today’s law, because each pension follows the law in force when it starts. It still helps to apply early so that gaps can be cleared.` },
      { q: 'Do my years abroad in the EU help me reach 45 years before the 1962 deadline?', a: 'They can. For the qualifying periods, insurance periods from EU and EEA countries and Switzerland are added to German ones if they would also count under German rules. Ask for them to be included when your record is clarified, ideally well before the application. The German pension is then paid only for the German periods; the other country pays its own share.' },
      { q: 'How much would the reform proposal cost me if I was born in 1962?', a: `In the scenario with no transition the 45-year pension would go. Starting in ${fmtMonat(bes.voll, 'en').slice(2)} would then leave ${beiBes.monate} months to the standard age and cost ${EN.pct(beiBes.abschlag, 1)}; ${EN.eur(B)} would become ${EN.eur(B * (1 - beiBes.abschlag))}. The commission explicitly recommends protecting legitimate expectations. Who that covers will be set by a law, and none exists yet.` },
      { q: 'Does unemployment benefit just before retirement count towards the 45 years?', a: 'Periods with unemployment benefit (Arbeitslosengeld) generally count, but in the last two years before the pension starts only if the unemployment was caused by the employer’s insolvency or complete closure (section 51(3a) SGB VI). Citizen’s income (Bürgergeld) never counts. If you were born in 1962 and lose your job now, check this before you plan.' },
    ],
    body: (h) => `
<h2>One cohort, two start years</h2>
<p>For people born in 1962 the 45-year limit rises to ${fmtAlter(besondersAlter(J), 'en')} (${h.src('sgb6_236b', 'section 236b SGB VI')}). Because the eight extra months cross the turn of the year, the unreduced pension starts in two different calendar years depending on the birth month, each with its own taxable share. Assuming a birthday on the 15th:</p>
${h.table(['Born in', '45 years from', 'Taxable share', 'Standard from'], proMonat.map((r) => [monatsName(r.m, 'en'), fmtMonat(r.bes, 'en'), h.pct(bA(r.bes), 1), fmtMonat(r.regel, 'en')]), 'Born in 1962, birthday on the 15th', ['l', 'l', 'r', 'l'])}
<p>If you were born on the 1st, each date is one month earlier. For retiring at 63 after 35 years the split does not matter: everyone born in 1962 turned 63 in 2025.</p>
<h2>Example 8 July 1962: the dates at a glance</h2>
<ul>
<li><strong>${fmtMonat(sb.frueh, 'en')}:</strong> earliest start with a recognised severe disability, ${h.pct(sb.abschlag, 1)} off.</li>
<li><strong>${fmtMonat(lj.frueh, 'en')}:</strong> earliest start after 35 years, ${h.pct(lj.abschlag, 1)} off (${h.src('sgb6_77', 'section 77 SGB VI')}).</li>
<li><strong>${fmtMonat(antrag, 'en')}:</strong> from here the 45-year pension can be applied for, one year ahead.</li>
<li><strong>${fmtMonat(bes.voll, 'en')}:</strong> unreduced after 45 years or with a severe disability.</li>
<li><strong>${fmtMonat(rg.voll, 'en')}:</strong> standard pension at ${fmtAlter(regelalter(J), 'en')} (${h.src('sgb6_235', 'section 235')}).</li>
</ul>
<p>There are ${rg.voll - bes.voll} months between the 45-year pension and the standard pension. If you are just short of 45 years, working on may close the gap; ${h.src('sgb6_51', 'section 51(3a) SGB VI')} lists what counts, explained under ${h.a('wartezeit-45-jahre', 'the 45-year qualifying period')}. Unemployment just before the goal is tricky: see ${h.a('arbeitslos-vor-der-rente', 'unemployed before retirement')}.</p>
<h2>Current law and the proposal side by side</h2>
<p>1962 is the first transition cohort for which the unreduced 45-year pension partly starts in 2027, after the point by which the coalition aims to pass a law (${h.src('bregReform', 'Federal Government')}). The ${h.src('bmasKommission', 'commission')} recommends abolishing this pension type and setting the earliest start after 35 years at 64. Calculated with no transition, the example would look like this:</p>
${h.table(['', 'Current law', 'Proposal, no transition'], [
  ['Earliest start after 35 years', `${fmtMonat(lj.frueh, 'en')}, ${h.pct(lj.abschlag, 1)}`, `${fmtMonat(refLj.frueh, 'en')}, ${h.pct(refLj.abschlag, 1)}`],
  ['Unreduced with 45 years', fmtMonat(bes.voll, 'en'), fmtMonat(ref.abschlagsfrei.voll, 'en')],
  [`Reduction if starting ${fmtMonat(bes.voll, 'en')}`, h.pct(0, 1), h.pct(beiBes.abschlag, 1)],
  [`Pension from ${h.eur(B)} at that start`, h.eur(B), h.eur(B * (1 - beiBes.abschlag))],
], 'Born 8 July 1962; the scenario is not law', ['l', 'l', 'l'])}
<p>The commission explicitly calls for protecting legitimate expectations; which birth years that covers can only be set by law. The ${h.src('drvReform', 'German Pension Insurance')} stresses that current law applies until then. Updates under ${h.a('rentenreform', 'pension reform')}.</p>
<h2>The gap to 1961 and 1963</h2>
<p>Compared with ${h.a('jahrgang-1961', '1961')} two months are added; compared with ${h.a('jahrgang-1963', '1963')} two are still missing: there the limits are ${fmtAlter(besondersAlter(J + 1), 'en')} and ${fmtAlter(regelalter(J + 1), 'en')}, and the maximum reduction at 63 reaches ${h.pct(abschlag(maxM(J + 1)), 1)}. The calculator above works out any birthday in this cohort to the month.</p>`,
  },
});
