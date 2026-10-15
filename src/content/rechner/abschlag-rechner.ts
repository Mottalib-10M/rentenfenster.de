import { defineGuide } from '../../lib/guide-types';
import { optionen, beginn, breakEven, alterBei, besondersAlter, schwbAlter, fmtMonat, fmtAlter, type Geburt } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Abschlagsrechner: dieselbe Person (geboren 15. Juni 1965, 1.800 € ohne Abschlag) mit Beginn ab 63, 64, 65 und 66,
 * einmal ohne weitere Entgeltpunkte und einmal mit einem Punkt je Jahr Weiterarbeit. Dazu der Weg über die Schwerbehinderung.
 */
const RW = P.rentenwert.ab_2026_07;
const R = 1800;
const g: Geburt = { jahr: 1965, monat: 6, tag: 15 };
const lj = optionen(g, { wz35: true, wz45: false, schwb: false }).find((o) => o.art === 'langjaehrig')!;
const sb = optionen(g, { wz35: true, wz45: false, schwb: true }).find((o) => o.art === 'schwb')!;
const fall = (voll: number, start: number) => {
  const monate = voll - start;
  const ohne = breakEven(monate, R, RW);
  const mit = breakEven(monate, R, RW, monate / 12);
  const alter = (b: typeof ohne) => alterBei(g, voll + Math.ceil(b.monate)).j;
  return { start, monate, ohne, mit, aOhne: alter(ohne), aMit: alter(mit) };
};
const reihe = [63, 64, 65, 66].map((a) => ({ a, ...fall(lj.voll, beginn(g, { j: a, m: 0 })) }));
const r63 = reihe[0], r65 = reihe[2];
const s62 = fall(sb.voll, sb.frueh);
const b45 = besondersAlter(g.jahr);
const sbA = schwbAlter(g.jahr);
const am = P.zugangsfaktor.abschlag_monat;
/** Alter nach „mit“ / „at“: volle Jahre als Zahl, sonst Jahre und Monate. */
const alt = (a: { j: number; m: number }, l: 'de' | 'en') => (a.m ? fmtAlter(a, l) : String(a.j));

export default defineGuide({
  id: 'abschlag-rechner',
  group: 'beginn',
  order: 30,
  tool: 'abschlag',
  related: ['ausgleichszahlung', 'rente-mit-63', 'rente-nach-45-jahren', 'schwerbehinderte', 'spaeter-in-rente', 'witwenrente-rechner'],
  sources: ['sgb6_77', 'sgb6_36', 'sgb6_37', 'sgb6_38', 'sgb6_236a', 'sgb6_187a', 'vo883', 'bmasKommission'],
  de: {
    slug: 'abschlaege-rente-rechner',
    nav: 'Abschlag berechnen',
    card: 'Abschlag in Prozent und Euro, Verlust über 20 Jahre und ab wann sich Warten rechnet.',
    title: 'Abschläge Rente 2026: Kosten je Monat, abschlagsfreie Wege',
    description: `Abschläge Rente 2026 berechnen: ${DE.pct(am, 1)} je Monat vor dem Termin, lebenslang, auch in der Witwenrente. Mit Aufholzeit, Verlust in Euro und Wegen ohne Abschlag.`,
    h1: 'Abschläge bei der Rente berechnen',
    intro: 'Geburtsjahr, Wunschalter und die Rente ohne Abschlag eingeben: Der Rechner zeigt den Abschlag, den Verlust in Euro und das Alter, ab dem sich das Warten gerechnet hätte.',
    resume: `Wer eine Altersrente vor ihrem abschlagsfreien Termin beginnt, verliert ${DE.pct(am, 1)} für jeden Monat, den er früher geht (§ 77 SGB VI). Der Abschlag gilt für die gesamte Laufzeit, endet also nicht mit der Regelaltersgrenze, und er geht in eine spätere Witwen- oder Witwerrente aus dieser Rente über. Ein Beispiel aus dem Rechner: Eine Versicherte, geboren im Juni 1965, mit ${DE.eur(R)} Rente ohne Abschlag, kann nach 35 Jahren ab 63 gehen. Das sind ${r63.monate} Monate vor dem Termin, ${DE.pct(r63.monate * am, 1)} Abschlag und ${DE.eur(r63.ohne.gekuerzt)} statt ${DE.eur(R)} im Monat. Rein rechnerisch holt die spätere, ungekürzte Rente den Vorsprung der früheren Zahlungen erst mit ${r63.aOhne} Jahren ein; würde sie in den vier Jahren weiterarbeiten und einen Entgeltpunkt pro Jahr sammeln, schon mit ${r63.aMit}. Ganz ohne Abschlag geht es nur mit der Regelaltersgrenze, nach 45 Jahren oder mit einer Schwerbehinderung.`,
    faqs: [
      { q: 'Fällt der Abschlag weg, sobald ich die Regelaltersgrenze erreiche?', a: `Nein. Der verminderte Zugangsfaktor bleibt für die ganze Rentenlaufzeit bestehen (§ 77 SGB VI) und wird auch auf eine Hinterbliebenenrente übertragen, die aus dieser Rente entsteht. Rentenerhöhungen ändern den Prozentsatz nicht, weil er an den Entgeltpunkten hängt. Wer den Verlust vermeiden will, kann ihn vor Rentenbeginn mit einer Ausgleichszahlung ganz oder teilweise abkaufen.` },
      { q: 'Welche Altersrente bekomme ich ganz ohne Abschlag?', a: `Die Regelaltersrente, für Jahrgang ${g.jahr} mit 67. Nach 45 Versicherungsjahren die Rente für besonders langjährig Versicherte mit ${alt(b45, 'de')}, aber nicht früher. Mit einem anerkannten Grad der Behinderung von mindestens 50 und 35 Jahren die Rente für schwerbehinderte Menschen mit ${alt(sbA.voll, 'de')}. Jede vorzeitige Altersrente sonst kostet ${DE.pct(am, 1)} je Monat.` },
      { q: 'Warum kann ich im Abschlagsrechner die 45-Jahre-Rente nicht auswählen?', a: 'Weil sie keinen Abschlag kennt: Sie beginnt frühestens mit ihrer Altersgrenze und dann ungekürzt. Wer 45 Jahre hat und trotzdem früher gehen möchte, nimmt die Rente für langjährig Versicherte und rechnet den Abschlag bis zur Regelaltersgrenze, nicht bis zur Grenze nach 45 Jahren. Den Vergleich aller Rentenarten für Ihren Geburtstag zeigt das Rentenfenster.' },
      { q: 'Wie ermittelt der Rechner das Alter, ab dem sich Warten lohnt?', a: `Er addiert alle früheren, gekürzten Zahlungen und teilt diese Summe durch den monatlichen Unterschied zur späteren Rente. Bei ${r65.monate} Monaten früher und ${DE.eur(R)} sind das ${DE.eur(r65.ohne.vorsprung)} Vorsprung und ${DE.eur(r65.ohne.diff)} Unterschied im Monat. Steuern, Rentenanpassungen und Zinsen bleiben außen vor; das Ergebnis ist eine Schwelle, keine Empfehlung.` },
    ],
    body: (h) => `
<h2>Was der Rechner ausgibt</h2>
<p>Sie geben Geburtsjahr und Geburtsmonat ein, das gewünschte Beginnalter in Jahren und Monaten, die Rentenart (35 Jahre oder Schwerbehinderung) und die Rente ohne Abschlag aus Ihrer Renteninformation. Der Rechner setzt den Beginn auf den passenden Monatsersten, begrenzt ihn auf den frühestmöglichen Monat und zählt die Monate bis zum abschlagsfreien Termin. Ausgegeben werden der Abschlag in Prozent, die gekürzte Rente, das Minus im Monat und über 20 Jahre sowie das Alter, ab dem die spätere Rente den Vorsprung eingeholt hätte. Der Satz von ${h.pct(am)} je Monat steht in ${h.src('sgb6_77', '§ 77 Abs. 2 SGB VI')}; die Rentenarten in ${h.src('sgb6_36', '§ 36')} und ${h.src('sgb6_37', '§ 37 SGB VI')}.</p>
<h2>Ein Fall, vier Startalter</h2>
<p>Gerechnet für eine Versicherte, geboren am 15. Juni 1965, mit ${h.eur(R)} Rente ohne Abschlag, die nach 35 Jahren ab 63 gehen darf. Abschlagsfrei wäre der ${fmtMonat(lj.voll, 'de')}. Die letzte Spalte unterstellt, dass sie bis dahin weiterarbeitet und jedes Jahr einen Entgeltpunkt hinzugewinnt, also etwa das Durchschnittsentgelt verdient; ein Punkt ist seit Juli 2026 ${h.eur(RW, 2)} Monatsrente wert.</p>
${h.table(['Beginn mit', 'Erster Monat', 'Monate früher', 'Abschlag', 'Rente', 'Warten lohnt ab', 'mit Punkten ab'], reihe.map((r) => [`${r.a}`, fmtMonat(r.start, 'de'), r.monate, h.pct(r.monate * am), h.eur(r.ohne.gekuerzt), `${r.aOhne} Jahren`, `${r.aMit} Jahren`]), `Beispiel ${h.eur(R)}, Rentenart 35 Jahre, in heutigen Euro`, ['l', 'l', 'r', 'r', 'r', 'r', 'r'])}
<p>Zwei Dinge fallen auf. Je kürzer die Vorziehzeit, desto später lohnt sich das Warten, weil der Vorsprung der früheren Zahlungen klein bleibt. Und sobald im Wartezeitraum neue Punkte entstehen, verschiebt sich die Schwelle um Jahre nach vorn: Mit 63 statt 67 liegt sie ohne Weiterarbeit bei ${r63.aOhne}, mit Weiterarbeit bei ${r63.aMit} Jahren. Mit anerkannter Schwerbehinderung könnte dieselbe Versicherte schon ab ${fmtMonat(sb.frueh, 'de')} gehen; dort ist der Abschlag auf ${h.pct(s62.monate * am)} gedeckelt und die gekürzte Rente beträgt ${h.eur(s62.ohne.gekuerzt)} (${h.src('sgb6_236a', '§ 236a SGB VI')}).</p>
<h2>Die drei Wege ohne Abschlag</h2>
<p>Ohne Kürzung beginnt jede Regelaltersrente. Nach 45 Jahren gibt es die ${h.a('rente-nach-45-jahren', 'Rente für besonders langjährig Versicherte')} ungekürzt, für Jahrgang 1965 mit ${alt(b45, 'de')} (${h.src('sgb6_38', '§ 38 SGB VI')}). Mit einem Grad der Behinderung ab 50 kommt die ${h.a('schwerbehinderte', 'Rente für schwerbehinderte Menschen')} hinzu, ungekürzt mit ${alt(sbA.voll, 'de')}. Wer keinen dieser Wege hat, kann den Abschlag nur bezahlen: mit der ${h.a('ausgleichszahlung', 'Ausgleichszahlung')} nach ${h.src('sgb6_187a', '§ 187a SGB VI')}. Umgekehrt bringt jeder Monat nach der Regelaltersgrenze ${h.pct(P.zugangsfaktor.zuschlag_monat)} Zuschlag, siehe ${h.a('spaeter-in-rente', 'später in Rente')}.</p>
<h2>Grenzen</h2>
<p>Der Rechner setzt den Geburtstag auf den 15. des Monats; wer am Ersten geboren ist, beginnt einen Monat früher. Er rechnet in heutigen Euro, ohne Rentenanpassungen, Steuern und Kranken- und Pflegebeiträge, und er wägt nicht ab, was die Kürzung für eine spätere ${h.a('witwenrente-rechner', 'Witwenrente')} bedeutet. Abschläge bei Erwerbsminderungsrenten folgen eigenen Regeln. Die Alterssicherungskommission empfiehlt, Abschläge und Zuschläge regelmäßig zu überprüfen (${h.src('bmasKommission', 'BMAS')}); das ist ein Vorschlag, der heutige Satz gilt unverändert.</p>`,
  },
  en: {
    slug: 'early-retirement-reduction-calculator',
    nav: 'Early retirement reduction',
    card: 'Your reduction in percent and euros, the loss over 20 years and when waiting pays off.',
    title: 'Early retirement reduction 2026: what each month early costs',
    description: `Early retirement reduction on a German pension in 2026: ${EN.pct(am, 1)} per month early, for life, survivors included. Break-even age, euro loss and unreduced routes.`,
    h1: 'Early retirement reduction calculator',
    intro: 'Enter your birth year, the age you want to stop and your unreduced pension: the tool shows the reduction, the loss in euros and the age at which waiting would have paid off.',
    resume: `If you start a German old-age pension before its unreduced date, it is cut by ${EN.pct(am, 1)} for every month you go early (section 77 SGB VI). This reduction (Abschlag) applies for as long as the pension is paid, so it does not stop at the standard retirement age, and it carries over into any widow’s or widower’s pension derived from it. An example from the calculator: a woman born in June 1965 with an unreduced pension of ${EN.eur(R)} can leave at 63 after 35 insured years. That is ${r63.monate} months early, a ${EN.pct(r63.monate * am, 1)} reduction and ${EN.eur(r63.ohne.gekuerzt)} instead of ${EN.eur(R)} a month. On paper the later, full pension only catches up with the head start of the earlier payments at age ${r63.aOhne}; if she kept working for those four years and earned one pension point a year, at ${r63.aMit}. The only ways to retire with no reduction are the standard age, 45 insured years or a severe disability.`,
    faqs: [
      { q: 'Does the reduction stop once I reach the standard retirement age?', a: 'No. The lower access factor (Zugangsfaktor) stays for the whole time the pension is paid (section 77 SGB VI) and passes to any survivor’s pension that follows from it. Pension increases do not change the percentage, because it is applied to your pension points. To avoid the loss you can buy it out, fully or in part, with a special payment before the pension starts.' },
      { q: 'Which German pensions have no reduction at all?', a: `The standard pension, at 67 for people born in ${g.jahr}. After 45 insured years, the pension for especially long-term insured people at ${alt(b45, 'en')}, but not earlier. With a recognised disability rating of at least 50 and 35 years, the pension for severely disabled people at ${alt(sbA.voll, 'en')}. Any other early old-age pension costs ${EN.pct(am, 1)} a month.` },
      { q: 'Is my reduced pension cut again if I retire to another EU country?', a: 'No. Under EU Regulation 883/2004 a German pension is not reduced because you live in another EU or EEA country or Switzerland; you receive the same amount as in Germany, reduction included. This calculator does not cover health insurance or tax after a move. For countries outside the EU, ask the German pension insurer before you decide.' },
      { q: 'How is the break-even age worked out?', a: `The tool adds up all the earlier, reduced payments and divides the total by the monthly gap to the later pension. With ${r65.monate} months early and ${EN.eur(R)}, that is a ${EN.eur(r65.ohne.vorsprung)} head start and a gap of ${EN.eur(r65.ohne.diff)} a month. Tax, future increases and interest are left out; the result is a threshold, not a recommendation.` },
    ],
    body: (h) => `
<h2>What the calculator shows</h2>
<p>You enter your birth year and month, the age you want to start in years and months, the pension type (35 years or severe disability) and the unreduced pension from your annual statement (Renteninformation). The tool sets the start to the right first of the month, moves it to the earliest possible month if needed and counts the months to the unreduced date. It returns the reduction in percent, the reduced pension, the loss per month and over 20 years, and the age at which the later pension would have caught up. The rate of ${h.pct(am)} a month is in ${h.src('sgb6_77', 'section 77(2) SGB VI')}; the pension types are in ${h.src('sgb6_36', 'section 36')} and ${h.src('sgb6_37', 'section 37 SGB VI')}.</p>
<h2>One case, four starting ages</h2>
<p>Worked out for a woman born on 15 June 1965 with an unreduced pension of ${h.eur(R)}, allowed to leave at 63 after 35 years. Her unreduced date is ${fmtMonat(lj.voll, 'en')}. The last column assumes she keeps working until then and gains one pension point (Entgeltpunkt) a year, roughly what average pay earns; since July 2026 one point is worth ${h.eur(RW, 2)} of monthly pension.</p>
${h.table(['Start at', 'First month', 'Months early', 'Reduction', 'Pension', 'Waiting pays from', 'with points from'], reihe.map((r) => [`${r.a}`, fmtMonat(r.start, 'en'), r.monate, h.pct(r.monate * am), h.eur(r.ohne.gekuerzt), `age ${r.aOhne}`, `age ${r.aMit}`]), `Example ${h.eur(R)}, 35-year pension, in today’s euros`, ['l', 'l', 'r', 'r', 'r', 'r', 'r'])}
<p>Two patterns stand out. The shorter the early period, the later waiting pays off, because the head start stays small. And once new points are earned while waiting, the threshold moves forward by years: starting at 63 instead of 67, it is age ${r63.aOhne} without further work and ${r63.aMit} with it. With a recognised severe disability the same woman could leave from ${fmtMonat(sb.frueh, 'en')}; the reduction there is capped at ${h.pct(s62.monate * am)} and her pension would be ${h.eur(s62.ohne.gekuerzt)} (${h.src('sgb6_236a', 'section 236a SGB VI')}).</p>
<h2>Three routes with no reduction</h2>
<p>Every standard pension starts uncut. After 45 years the ${h.a('rente-nach-45-jahren', 'pension for especially long-term insured people')} is paid in full, for people born in 1965 at ${alt(b45, 'en')} (${h.src('sgb6_38', 'section 38 SGB VI')}). With a disability rating of 50 or more there is the ${h.a('schwerbehinderte', 'pension for severely disabled people')}, unreduced at ${alt(sbA.voll, 'en')}. Without either, the only option is to pay for it through a ${h.a('ausgleichszahlung', 'buy-out payment')} under ${h.src('sgb6_187a', 'section 187a SGB VI')}. In the other direction, each month after the standard age adds ${h.pct(P.zugangsfaktor.zuschlag_monat)}; see ${h.a('spaeter-in-rente', 'retiring later')}. Moving abroad within the EU does not change any of this (${h.src('vo883', 'Regulation 883/2004')}).</p>
<h2>Limits</h2>
<p>The tool assumes a birthday on the 15th; if you were born on the 1st, your start is a month earlier. It works in today’s euros, without pension increases, tax or health and care contributions, and it does not weigh what the cut means for a later ${h.a('witwenrente-rechner', 'survivor’s pension')}. Disability pensions follow their own reduction rules. The pension commission recommends reviewing reductions and supplements regularly (${h.src('bmasKommission', 'BMAS')}); that is a proposal, and the current rate still applies.</p>`,
  },
});
