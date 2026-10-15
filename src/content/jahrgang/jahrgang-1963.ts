import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, fmtAlter, alterBei, regelalter, besondersAlter, schwbAlter, abschlag, abschlagBei } from '../../lib/engine/alter';
import { besteuerungsanteil } from '../../lib/engine/geld';
import { DE, EN, P } from '../../lib/fmt';

/** Jahrgang 1963: letzter Übergangsjahrgang, wird im November 2026 63. Beispiel: Geburtstag 25. November. */
const J = 1963;
const g = { jahr: J, monat: 11, tag: 25 };
const f = fenster(g, { wz35: true, wz45: true, schwb: true });
const nur35 = fenster(g, { wz35: true, wz45: false, schwb: false });
const nurSb = fenster(g, { wz35: true, wz45: false, schwb: true });
const ref = fenster(g, { wz35: true, wz45: true, schwb: false }, true);
const rg = f.regel;
const lj = f.opts.find((o) => o.art === 'langjaehrig')!;
const bes = f.opts.find((o) => o.art === 'besonders')!;
const sb = f.opts.find((o) => o.art === 'schwb')!;
const B = 1650;
/** Abschlag-Leiter: Beginn mit 63, 64, 65, 66 und zur Regelaltersgrenze (nur 35 Jahre). */
const leiter = [lj.frueh, lj.frueh + 12, lj.frueh + 24, lj.frueh + 36, rg.voll].map((s) => ({ s, a: abschlagBei(nur35.opts, s)!.abschlag }));
/** Gleicher Beginn mit 63, aber mit Schwerbehinderung. */
const sbBei63 = abschlagBei(nurSb.opts, lj.frueh)!;
const refBeiBes = abschlagBei(ref.opts, bes.voll)!;
const st = (i: number) => Math.floor(i / 12);
const bA = (i: number) => besteuerungsanteil(st(i));
const maxM = (j: number) => regelalter(j).j * 12 + regelalter(j).m - 63 * 12;
const dat = (a: { j: number; m: number }) => (a.m === 0 ? `${a.j} Jahren` : `${a.j} Jahren und ${a.m} ${a.m === 1 ? 'Monat' : 'Monaten'}`);

export default defineGuide({
  id: 'jahrgang-1963',
  group: 'jahrgang',
  order: 204,
  tool: 'fenster',
  toolPreset: { jahr: J },
  miniHref: 'abschlag-rechner',
  related: ['jahrgang-1962', 'jahrgang-1964', 'rente-mit-63', 'schwerbehinderte', 'langjaehrig-versicherte', 'abschlag-rechner', 'rentenreform'],
  sources: ['sgb6_235', 'sgb6_236', 'sgb6_236a', 'sgb6_236b', 'sgb6_77', 'estg_22', 'bmasKommission', 'vo883'],
  de: {
    slug: 'rente-jahrgang-1963',
    nav: 'Jahrgang 1963',
    card: 'Letzter Übergangsjahrgang: 63 im Jahr 2026, höchstens 13,8 % Abschlag, regulär mit 66 und 10 Monaten.',
    title: 'Rente mit 63 Jahrgang 1963: 13,8 % Abschlag und Termine 2026',
    description: 'Rente mit 63 Jahrgang 1963: Start ab 63 seit 2026 mit bis zu 13,8 % Abschlag, nach 45 Jahren mit 64 und 10 Monaten, regulär mit 66 und 10 Monaten. Reform 2026.',
    h1: 'Rente für den Jahrgang 1963',
    intro: 'Der Jahrgang 1963 wird 2026 63 und ist der letzte, für den noch die Übergangstabellen des SGB VI gelten.',
    resume: `Wer 1963 geboren ist, wird im Lauf des Jahres 2026 63 Jahre alt und kann damit nach 35 Versicherungsjahren die Rente für langjährig Versicherte beginnen (§ 236 SGB VI). Weil die Regelaltersgrenze für diesen Jahrgang bei ${dat(regelalter(J))} liegt (§ 235), kostet der früheste Start ${maxM(J)} Monate mal ${DE.pct(P.zugangsfaktor.abschlag_monat, 1)}, also ${DE.pct(lj.abschlag, 1)} Abschlag, den höchsten aller Übergangsjahrgänge. Bei einem Geburtstag am 25. November 1963 ist das der ${fmtMonat(lj.frueh, 'de')}; aus ${DE.eur(B)} würden ${DE.eur(B * (1 - lj.abschlag))}. Ohne Abschlag geht es nach 45 Jahren oder mit Schwerbehinderung ab dem ${fmtMonat(bes.voll, 'de')}, mit ${dat(besondersAlter(J))}, regulär ab dem ${fmtMonat(rg.voll, 'de')}. Wer schwerbehindert ist, zahlt bei einem Beginn mit 63 nur ${DE.pct(sbBei63.abschlag, 1)}. Der Besteuerungsanteil liegt je nach Startjahr zwischen ${DE.pct(bA(lj.frueh), 1)} und ${DE.pct(bA(rg.voll), 1)}. Nach dem Kommissionsvorschlag von 2026 läge der früheste Beginn ohne Übergang erst im ${fmtMonat(ref.fruehest.frueh, 'de').slice(3)}; das ist kein Gesetz.`,
    faqs: [
      { q: 'Ich werde im November 2026 63: Wann kann meine Rente als Jahrgang 1963 frühestens beginnen?', a: `Am Ersten des Monats nach dem 63. Geburtstag, bei einem Geburtstag am 25. November also am ${fmtMonat(lj.frueh, 'de')}. Wer am 1. November geboren ist, kann schon ab dem 1. November beginnen. Voraussetzung sind 35 Jahre an rentenrechtlichen Zeiten. Der Abschlag beträgt dann ${DE.pct(lj.abschlag, 1)}, weil ${maxM(J)} Monate bis zur Regelaltersgrenze fehlen.` },
      { q: 'Warum ist der Abschlag mit 63 beim Jahrgang 1963 höher als beim Jahrgang 1962?', a: `Weil die Regelaltersgrenze um zwei Monate gestiegen ist, von ${dat(regelalter(J - 1))} auf ${fmtAlter(regelalter(J), 'de')}. Damit liegen zwischen 63 und der Grenze ${maxM(J)} statt ${maxM(J - 1)} Monate, und jeder Monat kostet ${DE.pct(P.zugangsfaktor.abschlag_monat, 1)}. Der Höchstabschlag steigt so von ${DE.pct(abschlag(maxM(J - 1)), 1)} auf ${DE.pct(lj.abschlag, 1)}; für 1964 Geborene sind es ${DE.pct(abschlag(maxM(J + 1)), 1)}.` },
      { q: 'Hilft eine Schwerbehinderung beim Jahrgang 1963 auch, wenn ich mit 63 gehe?', a: `Ja, deutlich. Mit anerkanntem Grad der Behinderung von mindestens 50 und 35 Jahren richtet sich der Abschlag nach der Grenze von ${dat(schwbAlter(J).voll)}, nicht nach der Regelaltersgrenze. Ein Beginn am ${fmtMonat(lj.frueh, 'de')} kostet dann ${DE.pct(sbBei63.abschlag, 1)} statt ${DE.pct(lj.abschlag, 1)}. Beginnen lässt sich diese Rente sogar schon ab ${dat(schwbAlter(J).frueh)}, dann mit ${DE.pct(sb.abschlag, 1)}.` },
      { q: 'Lohnt es sich für Jahrgang 1963, ein Jahr länger zu arbeiten?', a: `Rechnerisch spart jedes Jahr ${DE.pct(abschlag(12), 1)} Abschlag. Ein Beginn mit 64 statt 63 senkt ihn von ${DE.pct(leiter[0].a, 1)} auf ${DE.pct(leiter[1].a, 1)}; bei ${DE.eur(B)} sind das ${DE.eur(B * (leiter[0].a - leiter[1].a))} mehr im Monat, lebenslang. Dazu kommen die Entgeltpunkte aus dem zusätzlichen Arbeitsjahr. Dafür entgehen zwölf Monatsrenten; der Abschlagsrechner stellt beides gegenüber.` },
      { q: 'Wie wirkt der Reformvorschlag auf den Jahrgang 1963?', a: `Im Szenario ohne Übergang wäre der früheste Beginn erst mit 64, im Beispiel am ${fmtMonat(ref.fruehest.frueh, 'de')} mit ${DE.pct(ref.fruehest.abschlag, 1)} Abschlag, und die Rente nach 45 Jahren entfiele: Ein Start am ${fmtMonat(bes.voll, 'de')} kostete dann ${DE.pct(refBeiBes.abschlag, 1)}. Die Kommission empfiehlt Vertrauensschutz, ein Gesetz gibt es nicht. Bis dahin gilt das heutige Recht.` },
    ],
    body: (h) => `
<h2>63 im Jahr 2026: was sich jetzt öffnet</h2>
<p>Alle 1963 Geborenen erreichen 2026 das Mindestalter für die Rente nach 35 Jahren (${h.src('sgb6_236', '§ 236 SGB VI')}). Wer im Januar Geburtstag hat, kann schon seit Februar beginnen; im Beispiel mit dem 25. November öffnet sich das Fenster am ${fmtMonat(lj.frueh, 'de')}, am Monatsersten nach dem Geburtstag. Für diesen Jahrgang ist der Abschlag beim frühesten Beginn so hoch wie nie zuvor in der Übergangszeit, weil die ${h.src('sgb6_235', 'Regelaltersgrenze')} schon bei ${dat(regelalter(J))} liegt.</p>
<h2>Die Abschlagsleiter nach Startalter</h2>
<p>Wie viel jedes zusätzliche Arbeitsjahr wert ist, zeigt die Leiter für jemanden mit 35, aber ohne 45 Jahre und ohne Schwerbehinderung (${h.src('sgb6_77', '§ 77 SGB VI')}), für eine Rente von ${h.eur(B)} zur Regelaltersgrenze:</p>
${h.table(['Beginn', 'Alter', 'Abschlag', 'Monatsrente', 'Steueranteil'], leiter.map((r) => [fmtMonat(r.s, 'de'), fmtAlter(alterBei(g, r.s), 'de'), h.pct(r.a, 1), h.eur(B * (1 - r.a)), h.pct(bA(r.s), 1)]), 'Geburtstag 25. November 1963, nur 35 Jahre erfüllt', ['l', 'l', 'r', 'r', 'r'])}
<p>Zwischen der ersten und der letzten Zeile liegen ${leiter[0].a > 0 ? h.eur(B * leiter[0].a) : h.eur(0)} im Monat. Die Entgeltpunkte aus den zusätzlichen Arbeitsjahren sind darin nicht enthalten; sie erhöhen die Rente zusätzlich. Mit dem ${h.a('abschlag-rechner', 'Abschlagsrechner')} lässt sich der Punkt berechnen, ab dem sich das Warten auszahlt.</p>
<h2>Schwerbehinderung: weniger als die Hälfte des Abschlags mit 63</h2>
<p>Für schwerbehinderte Menschen gelten eigene Grenzen (${h.src('sgb6_236a', '§ 236a SGB VI')}): frühestens ${fmtAlter(schwbAlter(J).frueh, 'de')}, ohne Abschlag ${fmtAlter(schwbAlter(J).voll, 'de')}. Der Abschlag wird deshalb an der Grenze von ${dat(schwbAlter(J).voll)} gemessen. Beim gleichen Beginn am ${fmtMonat(lj.frueh, 'de')} ergeben sich ${h.pct(sbBei63.abschlag, 1)} statt ${h.pct(lj.abschlag, 1)}. Seit dem ${fmtMonat(sb.frueh, 'de')} wäre diese Rente im Beispiel bereits möglich, mit dem Höchstabschlag von ${h.pct(sb.abschlag, 1)}. Voraussetzung ist ein Grad der Behinderung von mindestens 50 zu Rentenbeginn; Einzelheiten unter ${h.a('schwerbehinderte', 'Rente für Schwerbehinderte')}.</p>
<h2>Die 45 Jahre: ${fmtMonat(bes.voll, 'de').slice(3)} im Beispiel</h2>
<p>Nach 45 Jahren beginnt die abschlagsfreie Rente mit ${dat(besondersAlter(J))} (${h.src('sgb6_236b', '§ 236b')}), im Beispiel am ${fmtMonat(bes.voll, 'de')} mit einem Besteuerungsanteil von ${h.pct(bA(bes.voll), 1)} (${h.src('estg_22', '§ 22 EStG')}). Wer die 45 Jahre erreichen kann, hat zwischen dem 63. Geburtstag und diesem Termin ${bes.voll - lj.frueh} Monate Zeit, um die fehlenden Zeiten zu füllen.</p>
<h2>Der letzte Jahrgang der Übergangstabelle</h2>
<p>Nach 1963 endet die schrittweise Anhebung. Der ${h.a('jahrgang-1964', 'Jahrgang 1964')} rechnet mit glatten Grenzen: ${fmtAlter(regelalter(J + 1), 'de')} regulär, ${fmtAlter(besondersAlter(J + 1), 'de')} nach 45 Jahren, frühestens ${fmtAlter(schwbAlter(J + 1).frueh, 'de')} bei Schwerbehinderung. Für 1963 Geborene fehlen zu jeder dieser Grenzen nur zwei Monate. Der ${h.a('jahrgang-1962', 'Jahrgang 1962')} liegt umgekehrt zwei Monate früher.</p>
<h2>Was der Vorschlag der Kommission ändern würde</h2>
<p>Die ${h.src('bmasKommission', 'Alterssicherungskommission')} empfiehlt, die Rente nach 45 Jahren abzuschaffen und den frühesten Beginn nach 35 Jahren von 63 auf 64 zu verschieben. Ohne Übergangsregel gerechnet, rückte der früheste Start im Beispiel vom ${fmtMonat(lj.frueh, 'de')} auf den ${fmtMonat(ref.fruehest.frueh, 'de')}, mit ${h.pct(ref.fruehest.abschlag, 1)} statt ${h.pct(lj.abschlag, 1)} Abschlag, und abschlagsfrei ginge es erst am ${fmtMonat(ref.abschlagsfrei.voll, 'de')}. Das ist ein Vorschlag mit ausdrücklichem Vertrauensschutz, kein Gesetz. Den aktuellen Stand fasst ${h.a('rentenreform', 'Rentenreform')} zusammen.</p>`,
  },
  en: {
    slug: 'born-in-1963-pension',
    nav: 'Born in 1963',
    card: 'Last transition cohort: turns 63 in 2026, up to 13.8% off, standard age 66 years 10 months.',
    title: 'Retire at 63, Born 1963: 13.8% Reduction, German Dates 2026',
    description: 'Retiring at 63 if born in 1963: from 63 in 2026 with up to 13.8% off, unreduced at 64 and 10 months after 45 years, standard 66 and 10 months. Reform 2026.',
    h1: 'German pension for people born in 1963',
    intro: 'The 1963 cohort turns 63 in 2026 and is the last one still covered by the transition tables of the German pension code.',
    resume: `If you were born in 1963, you turn 63 during 2026, which opens the pension for long-term insured persons (langjährig Versicherte) after 35 insured years (section 236 SGB VI). Because the standard retirement age for this cohort is ${fmtAlter(regelalter(J), 'en')} (section 235), the earliest start costs ${maxM(J)} months times ${EN.pct(P.zugangsfaktor.abschlag_monat, 1)}, a ${EN.pct(lj.abschlag, 1)} reduction (Abschlag), the highest of all transition cohorts. With a birthday on 25 November 1963 that start is ${fmtMonat(lj.frueh, 'en')}, and ${EN.eur(B)} would become ${EN.eur(B * (1 - lj.abschlag))}. With no reduction you can go after 45 years or with a severe disability from ${fmtMonat(bes.voll, 'en')}, at ${fmtAlter(besondersAlter(J), 'en')}, or at the standard age from ${fmtMonat(rg.voll, 'en')}. With a recognised severe disability, starting at 63 costs only ${EN.pct(sbBei63.abschlag, 1)}. The taxable share ranges from ${EN.pct(bA(lj.frueh), 1)} to ${EN.pct(bA(rg.voll), 1)} depending on the start year. Under the 2026 commission proposal, with no transition, the earliest start would move to ${fmtMonat(ref.fruehest.frueh, 'en').slice(2)}; that is not law.`,
    faqs: [
      { q: 'I turn 63 in November 2026. When can my pension start at the earliest?', a: `On the first of the month after your 63rd birthday, so on ${fmtMonat(lj.frueh, 'en')} for a birthday on 25 November. Born on 1 November, you could start on 1 November. You need 35 years of creditable periods. The reduction is then ${EN.pct(lj.abschlag, 1)}, because ${maxM(J)} months remain until the standard age for people born in 1963.` },
      { q: 'Why is the reduction at 63 higher for 1963 than for 1962?', a: `Because the standard age rose by two months, from ${fmtAlter(regelalter(J - 1), 'en')} to ${fmtAlter(regelalter(J), 'en')}. That leaves ${maxM(J)} instead of ${maxM(J - 1)} months between 63 and the limit, each costing ${EN.pct(P.zugangsfaktor.abschlag_monat, 1)}. The maximum reduction rises from ${EN.pct(abschlag(maxM(J - 1)), 1)} to ${EN.pct(lj.abschlag, 1)}; for people born in 1964 it is ${EN.pct(abschlag(maxM(J + 1)), 1)}.` },
      { q: 'Born in 1963 with a severe disability: how much smaller is the reduction at 63?', a: `Much smaller. With a recognised degree of disability of at least 50 and 35 years, the reduction is measured against the limit of ${fmtAlter(schwbAlter(J).voll, 'en')}, not the standard age. Starting on ${fmtMonat(lj.frueh, 'en')} then costs ${EN.pct(sbBei63.abschlag, 1)} instead of ${EN.pct(lj.abschlag, 1)}. This pension can even start from ${fmtAlter(schwbAlter(J).frueh, 'en')}, with ${EN.pct(sb.abschlag, 1)} off.` },
      { q: 'I moved to Germany in my thirties and was born in 1963. Can I still retire at 63?', a: 'Only with 35 years of creditable periods. Insurance periods from EU and EEA countries and Switzerland are added to German ones for this purpose, so a career split across Europe can still qualify. Without 35 years the standard pension remains, which needs five years of periods. Rules for periods outside the EU depend on the country; the German Pension Insurance can check your case.' },
      { q: 'How would the reform proposal affect people born in 1963?', a: `In the scenario with no transition the earliest start would be at 64, in the example on ${fmtMonat(ref.fruehest.frueh, 'en')} with ${EN.pct(ref.fruehest.abschlag, 1)} off, and the 45-year pension would go: starting on ${fmtMonat(bes.voll, 'en')} would then cost ${EN.pct(refBeiBes.abschlag, 1)}. The commission recommends protecting legitimate expectations, and no law exists. Until one does, current law applies.` },
    ],
    body: (h) => `
<h2>Turning 63 in 2026: what opens now</h2>
<p>Everyone born in 1963 reaches the minimum age for the 35-year pension in 2026 (${h.src('sgb6_236', 'section 236 SGB VI')}). With a January birthday you could start from February; in the example with 25 November the window opens on ${fmtMonat(lj.frueh, 'en')}, the first of the month after the birthday. For this cohort the reduction at the earliest start is higher than for any earlier transition cohort, because the ${h.src('sgb6_235', 'standard age')} is already ${fmtAlter(regelalter(J), 'en')}.</p>
<h2>The reduction ladder by starting age</h2>
<p>What each extra year of work is worth shows in this ladder for someone with 35 but not 45 years and no disability (${h.src('sgb6_77', 'section 77 SGB VI')}), for a pension of ${h.eur(B)} at the standard age:</p>
${h.table(['Start', 'Age', 'Reduction', 'Monthly pension', 'Taxable share'], leiter.map((r) => [fmtMonat(r.s, 'en'), fmtAlter(alterBei(g, r.s), 'en'), h.pct(r.a, 1), h.eur(B * (1 - r.a)), h.pct(bA(r.s), 1)]), 'Born 25 November 1963, 35 years only', ['l', 'l', 'r', 'r', 'r'])}
<p>The first and last rows are ${h.eur(B * leiter[0].a)} a month apart. Pension points from the extra years of work are not included and would raise the pension further. The ${h.a('abschlag-rechner', 'reduction calculator')} finds the point from which waiting pays off.</p>
<h2>A severe disability more than halves the reduction at 63</h2>
<p>Severely disabled people have their own limits (${h.src('sgb6_236a', 'section 236a SGB VI')}): from ${fmtAlter(schwbAlter(J).frueh, 'en')} at the earliest, unreduced at ${fmtAlter(schwbAlter(J).voll, 'en')}. The reduction is measured against that second limit, so the same start on ${fmtMonat(lj.frueh, 'en')} costs ${h.pct(sbBei63.abschlag, 1)} instead of ${h.pct(lj.abschlag, 1)}. In the example this pension has been possible since ${fmtMonat(sb.frueh, 'en')}, with the maximum ${h.pct(sb.abschlag, 1)}. You need a degree of disability of at least 50 when the pension starts; details under ${h.a('schwerbehinderte', 'pension for severely disabled people')}.</p>
<h2>45 years: ${fmtMonat(bes.voll, 'en').slice(2)} in the example</h2>
<p>After 45 years the unreduced pension starts at ${fmtAlter(besondersAlter(J), 'en')} (${h.src('sgb6_236b', 'section 236b')}), in the example on ${fmtMonat(bes.voll, 'en')} with a taxable share of ${h.pct(bA(bes.voll), 1)} (${h.src('estg_22', 'section 22 Income Tax Act')}). If 45 years are within reach, you have ${bes.voll - lj.frueh} months between your 63rd birthday and that date to fill the gap. Periods from other EU countries can count here too under the ${h.src('vo883', 'EU coordination regulation')}.</p>
<h2>The last cohort in the transition table</h2>
<p>After 1963 the step-by-step increase ends. The ${h.a('jahrgang-1964', '1964 cohort')} works with round limits: ${fmtAlter(regelalter(J + 1), 'en')} standard, ${fmtAlter(besondersAlter(J + 1), 'en')} after 45 years, from ${fmtAlter(schwbAlter(J + 1).frueh, 'en')} with a disability. People born in 1963 are only two months short of each of those. The ${h.a('jahrgang-1962', '1962 cohort')}, in turn, is two months earlier.</p>
<h2>What the commission proposal would change</h2>
<p>The ${h.src('bmasKommission', 'pension commission')} recommends abolishing the 45-year pension and moving the earliest start after 35 years from 63 to 64. Calculated with no transition, the earliest start in the example would move from ${fmtMonat(lj.frueh, 'en')} to ${fmtMonat(ref.fruehest.frueh, 'en')}, with ${h.pct(ref.fruehest.abschlag, 1)} instead of ${h.pct(lj.abschlag, 1)} off, and an unreduced pension would only come on ${fmtMonat(ref.abschlagsfrei.voll, 'en')}. It is a proposal that explicitly calls for protecting legitimate expectations, not law. The current state is summarised under ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
