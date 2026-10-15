import { defineGuide } from '../../lib/guide-types';
import { fenster, fmtMonat, fmtAlter, monatsName, vonIdx, type Geburt, type Lage, type Option, type Art } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Rentenbeginn Schritt für Schritt: Tag der Vollendung, erster Rentenmonat, Antragsfenster (§ 99 SGB VI, § 187 BGB)
 * und Vergleich der Rentenarten für drei Beispielprofile. Alle Termine aus dem Motor.
 */
type L = 'de' | 'en';
const RENTE = 1500;
const profile: Array<{ k: string; g: Geburt; lage: Lage; jahre: number }> = [
  { k: 'A', g: { jahr: 1966, monat: 3, tag: 1 }, lage: { wz35: true, wz45: false, schwb: false }, jahre: 38 },
  { k: 'B', g: { jahr: 1963, monat: 9, tag: 20 }, lage: { wz35: true, wz45: true, schwb: false }, jahre: 45 },
  { k: 'C', g: { jahr: 1965, monat: 11, tag: 10 }, lage: { wz35: true, wz45: false, schwb: true }, jahre: 36 },
];
const F = profile.map((p) => ({ ...p, f: fenster(p.g, p.lage), r: fenster(p.g, p.lage, true) }));
const [A, B, C] = F;
/** Tag, an dem das Alter vollendet ist: der Tag vor dem Geburtstag (§ 187 Abs. 2 BGB). */
const vollendet = (g: Geburt, o: Option, l: L) => {
  const d = new Date(Date.UTC(g.jahr + o.vollAlter.j, g.monat - 1 + o.vollAlter.m, g.tag - 1));
  const m = monatsName(d.getUTCMonth() + 1, l);
  return l === 'de' ? `${d.getUTCDate()}. ${m} ${d.getUTCFullYear()}` : `${d.getUTCDate()} ${m} ${d.getUTCFullYear()}`;
};
/** Antrag: frühestens etwa ein Jahr vorher, spätestens bis Ende des dritten Kalendermonats nach Erfüllung der Voraussetzungen. */
const antragAb = (start: number, l: L) => fmtMonat(start - 12, l);
const antragBis = (start: number, l: L) => { const d = vonIdx(start - 1 + P.antrag.frist_monate); return `${monatsName(d.monat, l)} ${d.jahr}`; };
const geb = (g: Geburt, l: L) => (l === 'de' ? `${g.tag}. ${monatsName(g.monat, l)} ${g.jahr}` : `${g.tag} ${monatsName(g.monat, l)} ${g.jahr}`);
/** Gleicher Profil-A-Jahrgang, aber am 2. statt am 1. geboren: ein Monat später. */
const A2 = fenster({ ...A.g, tag: 2 }, A.lage);
const NAME: Record<Art, { de: string; en: string }> = {
  regel: { de: 'Regelaltersrente', en: 'Standard pension' },
  langjaehrig: { de: 'Langjährig Versicherte', en: 'Long-term insured' },
  besonders: { de: 'Besonders langjährig', en: 'Especially long-term' },
  schwb: { de: 'Schwerbehinderte', en: 'Severely disabled' },
};
const ohneAb = (x: (typeof F)[number]) => x.f.abschlagsfrei;
const bRefLj = B.r.opts.find((o) => o.art === 'langjaehrig')!;
const cS = C.f.opts.find((o) => o.art === 'schwb')!;

export default defineGuide({
  id: 'rentenbeginn-rechner',
  group: 'beginn',
  order: 20,
  tool: 'fenster',
  related: ['rente-beantragen', 'renteneintrittsalter-tabelle', 'abschlag-rechner', 'rente-nach-45-jahren', 'schwerbehinderte', 'rentenreform'],
  sources: ['sgb6_99', 'bgb_187', 'sgb6_35', 'sgb6_235', 'sgb6_236', 'sgb6_236a', 'sgb6_236b', 'sgb6_77', 'drvReform', 'vo883'],
  de: {
    slug: 'rentenbeginn-rechner',
    nav: 'Rentenbeginn berechnen',
    card: 'Erster Rentenmonat, Antragsfrist und jede Rentenart im Vergleich, auf den Tag genau.',
    title: 'Renteneintritt berechnen 2026: Startmonat und Antragsfrist',
    description: 'Renteneintritt berechnen 2026: Tag der Vollendung, erster Rentenmonat, Antrag frühestens ein Jahr vorher und spätestens nach drei Monaten, für jede Rentenart.',
    h1: 'Renteneintritt berechnen: der Kalender bis zur ersten Zahlung',
    intro: 'Geburtsdatum, Versicherungsjahre und eine Schwerbehinderung eingeben: Der Rechner nennt für jede offene Altersrente den ersten Monat und den Abschlag dort.',
    resume: `Den Renteneintritt legen vier Termine fest, die der Rechner nacheinander bestimmt. Erstens das Alter, das die gewählte Rentenart verlangt. Zweitens der Tag, an dem dieses Alter vollendet ist: rechtlich der Tag vor dem Geburtstag (§ 187 Abs. 2 BGB). Drittens der erste Rentenmonat, der Monat nach diesem Tag (§ 99 SGB VI). Viertens das Antragsfenster: Die Deutsche Rentenversicherung nimmt den Antrag etwa ein Jahr vorher an, und wer ihn erst nach dem dritten Kalendermonat stellt, bekommt die Rente erst ab dem Antragsmonat. Für eine am ${geb(A.g, 'de')} geborene Versicherte mit ${A.jahre} Jahren heißt das: Regelaltersrente ab dem ${fmtMonat(A.f.regel.voll, 'de')}, Antrag bis spätestens Ende ${antragBis(A.f.regel.voll, 'de')}; ab 63 ginge es ab dem ${fmtMonat(A.f.fruehest.frueh, 'de')} mit ${DE.pct(A.f.fruehest.abschlag, 1)} Abschlag. Wäre sie einen Tag später geboren, begänne jede Rente einen Monat später.`,
    faqs: [
      { q: 'Was bedeutet der Kasten zum Kommissionsvorschlag im Rentenfenster?', a: `Er rechnet Ihre Angaben ein zweites Mal, als wären zwei Empfehlungen der Alterssicherungskommission vom 23. Juni 2026 ohne Übergang Gesetz: keine Rente nach 45 Jahren mehr und die Rente für langjährig Versicherte erst ab 64. Für Profil B rückte der erste Monat ohne Abschlag damit vom ${fmtMonat(B.f.abschlagsfrei.voll, 'de')} auf den ${fmtMonat(B.r.abschlagsfrei.voll, 'de')}. Ein Gesetzentwurf liegt nicht vor; es gilt das heutige Recht.` },
      { q: 'Muss meine Schwerbehinderung schon beim Rentenantrag anerkannt sein?', a: `Entscheidend ist der Rentenbeginn: Zu diesem Zeitpunkt muss ein Grad der Behinderung von mindestens 50 vorliegen, dazu kommen 35 Versicherungsjahre. Für Profil C, geboren im November 1965, öffnet das die Rente ab ${fmtMonat(cS.frueh, 'de')} mit ${DE.pct(cS.abschlag, 1)} Abschlag und ab ${fmtMonat(cS.voll, 'de')} ohne Abschlag. Liegt der Grad bei Beginn nicht mehr vor, kommt diese Rentenart nicht in Betracht.` },
      { q: 'Welche Versicherungsjahre trage ich im Rentenfenster ein?', a: 'Die Zahl der Jahre mit rentenrechtlichen Zeiten aus Ihrer Renteninformation oder dem Versicherungsverlauf. Ab 35 Jahren öffnet der Rechner die Rente ab 63, ab 45 Jahren die abschlagsfreie Rente für besonders langjährig Versicherte. Für die 45 Jahre zählen aber nicht alle Zeiten, etwa keine Studienzeiten; prüfen Sie diese Zahl gesondert, wenn sie knapp ist.' },
      { q: 'Kann ich den Rentenbeginn auf einen späteren Monat legen?', a: `Ja. Im Antrag lässt sich ein späterer Beginn wählen; der Rechner zeigt nur den frühesten Monat je Rentenart. Jeder Monat nach der Regelaltersgrenze bringt ${DE.pct(P.zugangsfaktor.zuschlag_monat, 1)} Zuschlag, jeder Monat vor dem abschlagsfreien Termin kostet ${DE.pct(P.zugangsfaktor.abschlag_monat, 1)}. Zwischen frühestem und abschlagsfreiem Beginn ist jeder Monat wählbar, der Abschlag sinkt dann schrittweise.` },
    ],
    body: (h) => `
<h2>Was der Rechner ausgibt</h2>
<p>Aus Geburtsjahr, Monat und Tag, den Versicherungsjahren und der Angabe zur Schwerbehinderung bestimmt das Rentenfenster jede Altersrente, die Ihnen offensteht: den ersten möglichen Monat, den Abschlag in diesem Monat und den ersten Monat ohne Abschlag. Tragen Sie die Regelaltersrente aus Ihrer Renteninformation ein, rechnet er zusätzlich den gekürzten Betrag beim frühesten Beginn. Die Altersgrenzen stammen aus dem SGB VI in der zuletzt am 24. Juli 2026 geänderten Fassung, der Abschlag aus ${h.src('sgb6_77', '§ 77 SGB VI')}. Die Rentenarten selbst beschreibt die ${h.a('renteneintrittsalter-tabelle', 'Tabelle der Altersgrenzen')}.</p>
<h2>Der Kalender in vier Schritten</h2>
<p><strong>Schritt 1, das maßgebliche Alter.</strong> Es hängt vom Jahrgang und der Rentenart ab. Profil A: Regelaltersgrenze, ${fmtAlter(A.f.regel.vollAlter, 'de')} (${h.src('sgb6_35', '§ 35 SGB VI')}). Profil B: Grenze nach 45 Jahren, ${fmtAlter(ohneAb(B).vollAlter, 'de')} (${h.src('sgb6_236b', '§ 236b')}). Profil C: abschlagsfreie Schwerbehindertenrente, ${fmtAlter(ohneAb(C).vollAlter, 'de')}.</p>
<p><strong>Schritt 2, der Tag der Vollendung.</strong> Das Lebensalter ist mit Ablauf des Tages vor dem Geburtstag erreicht (${h.src('bgb_187', '§ 187 Abs. 2 BGB')}). Bei einem Geburtstag am Monatsersten fällt dieser Tag in den Vormonat: Profil A, geboren am ${geb(A.g, 'de')}, vollendet ${fmtAlter(A.f.regel.vollAlter, 'de')} am ${vollendet(A.g, A.f.regel, 'de')}.</p>
<p><strong>Schritt 3, der erste Rentenmonat.</strong> Die Rente beginnt mit dem Monat, der auf die Vollendung folgt (${h.src('sgb6_99', '§ 99 SGB VI')}). Für A ist das der ${fmtMonat(A.f.regel.voll, 'de')}; mit Geburtstag am 2. März wäre es der ${fmtMonat(A2.regel.voll, 'de')}.</p>
<p><strong>Schritt 4, das Antragsfenster.</strong> Frühestens etwa ein Jahr vor dem Beginn nimmt die Rentenversicherung den Antrag an (${h.src('drvReform', 'DRV')}). Spätestens muss er bis zum Ende des dritten Kalendermonats nach dem Monat eingehen, in dem die Voraussetzungen erfüllt sind; sonst zahlt die Kasse erst ab dem Antragsmonat. Ablauf und Unterlagen stehen unter ${h.a('rente-beantragen', 'Rente beantragen')}.</p>
${h.table(['Profil', 'Ohne Abschlag mit', 'Alter vollendet am', 'Erster Rentenmonat', 'Antrag ab etwa', 'Antrag spätestens bis Ende'], F.map((x) => [`${x.k}: ${geb(x.g, 'de')}`, fmtAlter(ohneAb(x).vollAlter, 'de'), vollendet(x.g, ohneAb(x), 'de'), fmtMonat(ohneAb(x).voll, 'de'), antragAb(ohneAb(x).voll, 'de'), antragBis(ohneAb(x).voll, 'de')]), 'Erster Monat ohne Abschlag je Profil, nach geltendem Recht', ['l', 'l', 'l', 'l', 'l', 'l'])}
<h2>Drei Profile, alle Rentenarten</h2>
<p>A hat ${A.jahre} Versicherungsjahre, B hat ${B.jahre}, C hat ${C.jahre} und einen Grad der Behinderung von 50. Jede Zeile ist eine Rentenart, die das Profil wählen könnte, mit dem frühesten Monat und dem Betrag, der von angenommenen ${h.eur(RENTE)} Regelaltersrente bliebe.</p>
${h.table(['Profil', 'Rentenart', 'Frühestens ab', 'Abschlag', `Rente aus ${h.eur(RENTE)}`], F.flatMap((x) => x.f.opts.map((o) => [x.k, NAME[o.art].de, fmtMonat(o.frueh, 'de'), h.pct(o.abschlag), h.eur(RENTE * (1 - o.abschlag))])), 'Gerechnet mit dem Rentenfenster, ohne spätere Rentenanpassungen', ['l', 'l', 'l', 'r', 'r'])}
<p>B hat die Wahl: ab 63 mit hohem Abschlag oder ab ${fmtMonat(ohneAb(B).voll, 'de')} ohne Abschlag. C gewinnt durch die Schwerbehinderung ein Jahr gegenüber der Rente nach 35 Jahren, der Abschlag ist dort auf ${h.pct(C.f.opts.find((o) => o.art === 'schwb')!.abschlag)} begrenzt (${h.src('sgb6_236a', '§ 236a SGB VI')}). Würde der Vorschlag der Alterssicherungskommission ohne Übergang Gesetz, fiele für B die Rente nach 45 Jahren weg; ohne Abschlag ginge es erst ab ${fmtMonat(B.r.abschlagsfrei.voll, 'de')}, ab 64 mit ${h.pct(bRefLj.abschlag)}. Ein Gesetzentwurf liegt nicht vor, mehr unter ${h.a('rentenreform', 'Rentenreform')}.</p>
<h2>Grenzen</h2>
<p>Der Rechner prüft nicht, ob Ihre Jahre wirklich zählen; er übernimmt Ihre Zahl. Die Schwerbehinderung muss bei Rentenbeginn anerkannt sein. Die Altersrenten für Frauen und wegen Arbeitslosigkeit gibt es nur für vor 1952 Geborene und fehlen deshalb. Teilrenten, Erwerbsminderungsrenten und Rentenanteile aus anderen Staaten rechnet er nicht. Ihren verbindlichen Termin nennen die Auskunfts- und Beratungsstellen der Rentenversicherung.</p>`,
  },
  en: {
    slug: 'retirement-date-calculator',
    nav: 'Retirement date',
    card: 'Your first pension month, the claim deadline and every pension type compared.',
    title: 'Retirement date 2026: first pension month and claim window',
    description: 'Retirement date 2026 for a German pension: the day your age is reached, the first payment month, and when to claim, from a year before to three months after.',
    h1: 'Retirement date: from your birthday to the first pension payment',
    intro: 'Enter your date of birth, insured years and any severe disability: the calculator gives the first month and the reduction for every German old-age pension open to you.',
    resume: `Four dates decide when a German state pension (gesetzliche Rente) starts, and the calculator works them out in turn. First, the age your pension type requires. Second, the day you legally reach that age, which is the day before your birthday (section 187(2) of the Civil Code, BGB). Third, the first pension month, the month after that day (section 99 SGB VI). Fourth, the claim window: the pension insurer accepts an application about a year ahead, and if you apply later than the third calendar month after you qualify, payment only starts in the month you apply. For a woman born on ${geb(A.g, 'en')} with ${A.jahre} insured years, that means the standard pension from ${fmtMonat(A.f.regel.voll, 'en')}, claim by the end of ${antragBis(A.f.regel.voll, 'en')} at the latest; from 63 she could start on ${fmtMonat(A.f.fruehest.frueh, 'en')} with a ${EN.pct(A.f.fruehest.abschlag, 1)} reduction. Born one day later, every start date would move back a month.`,
    faqs: [
      { q: 'What does the commission proposal box in the calculator show?', a: `It runs your inputs a second time as if two recommendations of the pension commission of 23 June 2026 became law with no transition: no more 45-year pension, and the long-term insured pension only from 64. For profile B the first unreduced month would move from ${fmtMonat(B.f.abschlagsfrei.voll, 'en')} to ${fmtMonat(B.r.abschlagsfrei.voll, 'en')}. No draft bill has been published; current law applies.` },
      { q: 'Must my severe disability be recognised before I claim the pension?', a: `What counts is the start of the pension: at that point you need a recognised disability rating (Grad der Behinderung) of at least 50 and 35 insured years. For profile C, born in November 1965, that opens the pension from ${fmtMonat(cS.frueh, 'en')} with a ${EN.pct(cS.abschlag, 1)} reduction, and from ${fmtMonat(cS.voll, 'en')} without one. If the rating no longer applies at the start, this pension type is not available.` },
      { q: 'Do my years in another EU country count in this calculator?', a: 'For the 35 and 45-year qualifying periods, periods of insurance in other EU and EEA countries and Switzerland are added together under Regulation 883/2004, so you may enter the total. The amount is a different matter: Germany pays only for German periods, and each other country pays its own share. Whether a given period counts for 45 years is decided by the German insurer.' },
      { q: 'Can I choose a later start month than the one shown?', a: `Yes. On the claim form you can pick a later start; the calculator only shows the earliest month for each type. Every month after the standard age adds ${EN.pct(P.zugangsfaktor.zuschlag_monat, 1)}, and every month before the unreduced date costs ${EN.pct(P.zugangsfaktor.abschlag_monat, 1)}. Any month between the earliest and the unreduced start can be chosen, with a smaller reduction.` },
    ],
    body: (h) => `
<h2>What the calculator shows</h2>
<p>From your year, month and day of birth, your insured years and whether you have a recognised severe disability, the tool lists each old-age pension open to you: the earliest month, the reduction (Abschlag) in that month and the first month without one. If you enter the standard pension from your annual statement (Renteninformation), it also shows the reduced amount at the earliest start. Age limits follow Social Code Book VI (SGB VI) as amended on 24 July 2026, the reduction follows ${h.src('sgb6_77', 'section 77 SGB VI')}. The pension types themselves are set out in the ${h.a('renteneintrittsalter-tabelle', 'table of retirement ages')}.</p>
<h2>The calendar in four steps</h2>
<p><strong>Step 1, the age that applies.</strong> It depends on your birth year and pension type: for profile A the standard age of ${fmtAlter(A.f.regel.vollAlter, 'en')} (${h.src('sgb6_35', 'section 35 SGB VI')}), for profile B the 45-year limit of ${fmtAlter(ohneAb(B).vollAlter, 'en')} (${h.src('sgb6_236b', 'section 236b')}), for profile C the unreduced disability pension at ${fmtAlter(ohneAb(C).vollAlter, 'en')}.</p>
<p><strong>Step 2, the day the age is reached.</strong> German law counts an age as completed at the end of the day before the birthday (${h.src('bgb_187', 'section 187(2) BGB')}). Born on the first of a month, that day falls in the previous month: profile A, born on ${geb(A.g, 'en')}, reaches ${fmtAlter(A.f.regel.vollAlter, 'en')} on ${vollendet(A.g, A.f.regel, 'en')}.</p>
<p><strong>Step 3, the first pension month.</strong> Payment starts in the month after that day (${h.src('sgb6_99', 'section 99 SGB VI')}). For A that is ${fmtMonat(A.f.regel.voll, 'en')}; with a birthday on 2 March it would be ${fmtMonat(A2.regel.voll, 'en')}.</p>
<p><strong>Step 4, the claim window.</strong> The insurer accepts a claim from about a year before (${h.src('drvReform', 'DRV')}). It must arrive by the end of the third calendar month after the month you qualify; otherwise payment begins only in the month of the claim. How to apply is covered under ${h.a('rente-beantragen', 'applying for your pension')}.</p>
${h.table(['Profile', 'No reduction at', 'Age reached on', 'First month', 'Claim from about', 'Claim by end of'], F.map((x) => [`${x.k}: ${geb(x.g, 'en')}`, fmtAlter(ohneAb(x).vollAlter, 'en'), vollendet(x.g, ohneAb(x), 'en'), fmtMonat(ohneAb(x).voll, 'en'), antragAb(ohneAb(x).voll, 'en'), antragBis(ohneAb(x).voll, 'en')]), 'First unreduced month for each profile, current law', ['l', 'l', 'l', 'l', 'l', 'l'])}
<h2>Three profiles, every pension type</h2>
<p>A has ${A.jahre} insured years, B has ${B.jahre}, C has ${C.jahre} and a disability rating (GdB) of 50. Each row is a pension the profile could choose, with its earliest month and what would remain of an assumed ${h.eur(RENTE)} standard pension.</p>
${h.table(['Profile', 'Pension type', 'Earliest', 'Reduction', `Pension from ${h.eur(RENTE)}`], F.flatMap((x) => x.f.opts.map((o) => [x.k, NAME[o.art].en, fmtMonat(o.frueh, 'en'), h.pct(o.abschlag), h.eur(RENTE * (1 - o.abschlag))])), 'Worked out with the calculator, before future pension increases', ['l', 'l', 'l', 'r', 'r'])}
<p>B has a choice: from 63 with a large reduction, or from ${fmtMonat(ohneAb(B).voll, 'en')} without one. C gains a year over the 35-year pension thanks to the disability, with the reduction capped at ${h.pct(C.f.opts.find((o) => o.art === 'schwb')!.abschlag)} (${h.src('sgb6_236a', 'section 236a SGB VI')}). If the pension commission’s proposal became law with no transition, B would lose the 45-year pension: no reduction only from ${fmtMonat(B.r.abschlagsfrei.voll, 'en')}, or from 64 with ${h.pct(bRefLj.abschlag)}. No draft bill has been published; see ${h.a('rentenreform', 'pension reform')}.</p>
<h2>Limits</h2>
<p>The tool does not check whether your years count; it takes the number you enter. A severe disability must be recognised when the pension starts. The women’s pension and the unemployment pension only exist for people born before 1952 and are left out. Partial pensions, disability pensions and the pension paid by another country are not calculated. Your binding date comes from the German pension insurer’s advice centres (Auskunfts- und Beratungsstellen).</p>`,
  },
});
