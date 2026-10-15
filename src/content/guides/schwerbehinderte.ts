import { defineGuide } from '../../lib/guide-types';
import { schwbAlter, regelalter, besondersAlter, optionen, beginn, abschlagBei, abschlag, fmtMonat, fmtAlter } from '../../lib/engine/alter';
import { ausgleich } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Altersrente für schwerbehinderte Menschen: Altersgrenzen je Jahrgang, Abschlag beim Beginn mit 63, Vergleich der Wege. Alles aus dem Motor. */
const A = P.altersgrenzen;
const WZ = A.schwb_wartezeit_jahre;
const AB = P.zugangsfaktor.abschlag_monat;
const RW = P.rentenwert.ab_2026_07;
const RENTE = 1300;
const EP = 35;
const geb = (j: number) => ({ jahr: j, monat: 6, tag: 15 });
const lage = { wz35: true, wz45: false, schwb: true };
const reihe = [1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964].map((j) => {
  const s = schwbAlter(j);
  const opts = optionen(geb(j), lage);
  const sb = opts.find((o) => o.art === 'schwb')!;
  const mit63 = abschlagBei(opts, beginn(geb(j), { j: 63, m: 0 }));
  return { j, s, sb, mit63 };
});
const z51 = reihe[0];
const z52 = reihe[1];
const z60 = reihe.find((x) => x.j === 1960)!;
const z64 = reihe[reihe.length - 1];
const maxMonate = z64.sb.monate;
const maxAb = abschlag(maxMonate);
const ab63 = z64.mit63!.abschlag;
/** Jahrgang 1964 ohne Schwerbehinderung: Rente nach 35 Jahren mit 63. */
const ohne = abschlagBei(optionen(geb(1964), { wz35: true, wz45: false, schwb: false }), beginn(geb(1964), { j: 63, m: 0 }))!;
const aus62 = ausgleich(EP, maxAb, RW);

export default defineGuide({
  id: 'schwerbehinderte',
  group: 'beginn',
  order: 40,
  mini: 'schwb',
  miniHref: 'rentenbeginn-rechner',
  related: ['rente-mit-63', 'langjaehrig-versicherte', 'rente-nach-45-jahren', 'erwerbsminderungsrente', 'ausgleichszahlung', 'renteneintrittsalter-tabelle'],
  sources: ['sgb6_37', 'sgb6_236a', 'sgb6_77', 'sgb6_51', 'sgb6_187a', 'sgb6_42', 'vo883', 'bmasKommission'],
  de: {
    slug: 'altersrente-schwerbehinderte',
    nav: 'Rente für Schwerbehinderte',
    card: 'Mit GdB 50 zwei Jahre früher ohne Abschlag und bis zu fünf Jahre früher mit Abschlag.',
    title: 'Altersrente für Schwerbehinderte 2026: Alter und Abschlag',
    description: 'Altersrente für Schwerbehinderte 2026: ab Jahrgang 1964 ohne Abschlag mit 65, frühestens mit 62. Tabelle je Jahrgang, Abzug mit 63, Vergleich mit 45 Jahren.',
    h1: 'Altersrente für schwerbehinderte Menschen: wann ohne Abzug?',
    intro: 'Ein anerkannter Grad der Behinderung von 50 verschiebt alle Grenzen nach vorn. Der Rechner nennt beide Altersgrenzen für Ihren Jahrgang.',
    resume: `Die Altersrente für schwerbehinderte Menschen (§ 37 SGB VI, für ältere Jahrgänge § 236a) verlangt zwei Dinge: einen Grad der Behinderung von mindestens 50 bei Rentenbeginn und ${WZ} Versicherungsjahre. Ab dem Jahrgang 1964 zahlt sie mit ${fmtAlter(z64.s.voll, 'de')} ohne Abschlag und ist frühestens mit ${fmtAlter(z64.s.frueh, 'de')} möglich. Dazwischen liegen ${DE.num(maxMonate)} Monate, der Abschlag beträgt also höchstens ${DE.pct(maxAb, 1)}. Die gesuchte „Rente mit 63 ohne Abzug bei Schwerbehinderung“ gab es zuletzt für den Jahrgang 1951; seit dem Jahrgang 1952 steigen beide Grenzen schrittweise, für 1960 Geborene auf ${fmtAlter(z60.s.voll, 'de')} und ${fmtAlter(z60.s.frueh, 'de')}. Wer 1964 oder später geboren ist und mit 63 beginnt, trägt ${DE.pct(ab63, 1)} Abschlag, halb so viel wie die ${DE.pct(ohne.abschlag, 1)} auf dem Weg nach 35 Jahren ohne Schwerbehinderung. Bei ${DE.eur(RENTE)} Rente sind das ${DE.eur(RENTE * ab63)} statt ${DE.eur(RENTE * ohne.abschlag)} weniger im Monat.`,
    faqs: [
      { q: 'Gibt es die Rente mit 63 ohne Abzug bei Schwerbehinderung noch?', a: `Nein, nicht für heutige Rentenneulinge. Abschlagsfrei mit genau 63 konnten schwerbehinderte Menschen bis zum Jahrgang 1951 gehen. Für den Jahrgang 1952 lag die Grenze schon bei ${fmtAlter(z52.s.voll, 'de')}, und sie steigt weiter bis auf ${fmtAlter(z64.s.voll, 'de')} ab Jahrgang 1964. Mit 63 ist die Rente heute möglich, aber mit Abzug, ab 1964 mit ${DE.pct(ab63, 1)}.` },
      { q: 'Mit wie viel Jahren kann ich mit GdB 50 frühestens in Rente gehen?', a: `Ab Jahrgang 1964 mit ${fmtAlter(z64.s.frueh, 'de')}, dann mit ${DE.pct(maxAb, 1)} Abschlag. Für ältere Jahrgänge liegt das früheste Alter niedriger, für den Jahrgang 1960 etwa bei ${fmtAlter(z60.s.frueh, 'de')}. Voraussetzung sind ${WZ} Versicherungsjahre und ein Grad der Behinderung von mindestens 50, der bei Rentenbeginn festgestellt sein muss. Ein Grad von 30 oder 40 reicht für diese Rente nicht.` },
      { q: 'Muss der Grad der Behinderung schon bei Rentenantrag feststehen?', a: 'Er muss bei Beginn der Rente vorliegen. Wer die Anerkennung erst beantragt, sollte das Verfahren deshalb rechtzeitig vor dem gewünschten Rentenbeginn anstoßen. Ohne anerkannten GdB von 50 bleiben nur die übrigen Altersrenten, mit 35 Jahren also die Rente für langjährig Versicherte und ihr höherer Abschlag. Den Beginn kann man notfalls etwas verschieben, um die Anerkennung abzuwarten.' },
      { q: 'Ist die Rente für Schwerbehinderte besser als die Rente nach 45 Jahren?', a: `Für Jahrgänge ab 1964 sind beide ab ${fmtAlter(z64.s.voll, 'de')} abschlagsfrei. Die Schwerbehindertenrente verlangt aber nur ${WZ} statt 45 Jahre und erlaubt einen Beginn bis zu ${DE.num(maxMonate)} Monate vorher, gegen Abschlag. Wer beides erfüllt, hat also mehr Spielraum. Für ältere Jahrgänge ist die Grenze nach 45 Jahren identisch, für 1960 Geborene etwa ${fmtAlter(besondersAlter(1960), 'de')}.` },
      { q: 'Kann ich den Abschlag der Schwerbehindertenrente ausgleichen?', a: `Ja, mit einer Ausgleichszahlung bis zur Regelaltersgrenze. Bei ${DE.num(EP)} Entgeltpunkten und dem vollen Abschlag von ${DE.pct(maxAb, 1)} kostet das 2026 rund ${DE.eur(aus62.betrag)} und gleicht ${DE.eur(aus62.renteMinus, 2)} Monatsrente aus. Teilzahlungen sind möglich. Voraussetzung ist eine Auskunft der Rentenversicherung über den Betrag, die man ab 50 erhalten kann.` },
    ],
    body: (h) => `
<h2>Beide Altersgrenzen nach Jahrgang</h2>
<p>Die Rente hat zwei Grenzen: das Alter, ab dem sie ohne Abschlag zahlt, und das Alter, ab dem sie frühestens möglich ist. Beide sind seit dem Jahrgang 1952 nach ${h.src('sgb6_236a', '§ 236a SGB VI')} schrittweise gestiegen; ab 1964 gilt ${h.src('sgb6_37', '§ 37 SGB VI')}. Die letzte Spalte zeigt, was ein Rentenbeginn mit genau 63 kostet.</p>
${h.table(['Jahrgang', 'Ohne Abschlag mit', 'Frühestens mit', 'Abschlag beim frühesten Beginn', 'Abschlag mit 63'], reihe.map((x) => [x.j >= 1960 ? h.a(`jahrgang-${x.j}`, x.j === 1964 ? 'ab 1964' : String(x.j)) : String(x.j), fmtAlter(x.s.voll, 'de'), fmtAlter(x.s.frueh, 'de'), h.pct(x.sb.abschlag, 1), x.mit63 ? h.pct(x.mit63.abschlag, 1) : '–']), `Grad der Behinderung mindestens 50, ${WZ} Jahre, Geburtstag 15. Juni`, ['l', 'l', 'l', 'r', 'r'])}
<p>Zwei Dinge fallen auf. Der höchste Abschlag bleibt in jedem Jahrgang gleich, ${h.pct(maxAb, 1)}, weil frühestes und abschlagsfreies Alter immer gemeinsam steigen und ${h.num(maxMonate)} Monate auseinanderliegen. Und der Preis eines Rentenbeginns mit 63 wächst mit jedem Jahrgang: Für 1951 Geborene war 63 noch abschlagsfrei, ab Jahrgang 1964 sind es ${h.num(z64.mit63!.monate)} Monate zu je ${h.pct(AB, 1)}.</p>
<h2>Der Vorteil in Euro</h2>
<p>Für jemanden mit Jahrgang 1964 und ${h.eur(RENTE)} Rente ohne Abschlag stellt sich der Beginn mit 63 so dar: als schwerbehinderter Mensch ${h.eur(RENTE * (1 - ab63))} im Monat, ohne Schwerbehinderung über die ${h.a('langjaehrig-versicherte', 'Rente nach 35 Jahren')} nur ${h.eur(RENTE * (1 - ohne.abschlag))}. Der Unterschied von ${h.eur(RENTE * (ohne.abschlag - ab63))} im Monat bleibt lebenslang, über zwanzig Rentenjahre ${h.eur(RENTE * (ohne.abschlag - ab63) * 240)}. Er überträgt sich nach ${h.src('sgb6_77', '§ 77 Abs. 3 SGB VI')} auch auf eine spätere Witwen- oder Witwerrente aus dieser Rente.</p>
<h2>Die Voraussetzungen im Einzelnen</h2>
<p>Erstens der Grad der Behinderung: mindestens 50, festgestellt zum Rentenbeginn. Ein geringerer Grad genügt nicht, auch wenn er knapp darunter liegt. Zweitens ${WZ} Jahre Wartezeit, für die alle rentenrechtlichen Zeiten zählen (${h.src('sgb6_51', '§ 51 Abs. 3 SGB VI')}), anders als bei den 45 Jahren also auch Zeiten mit Bürgergeld, Schule oder Studium, soweit sie rentenrechtliche Zeiten sind. Versicherungszeiten aus anderen EU-Staaten, dem EWR und der Schweiz werden nach ${h.src('vo883', 'der Verordnung (EG) Nr. 883/2004')} mitgezählt. Drittens ein Antrag, der innerhalb von drei Kalendermonaten nach dem gewünschten Beginn eingeht.</p>
<p>Wer den Grad der Behinderung noch nicht hat, sollte das Feststellungsverfahren vor der Rentenplanung abschließen. Ohne Anerkennung bleibt bei ${WZ} Jahren nur die Rente für langjährig Versicherte ab 63, mit dem höheren Abschlag aus der Tabelle oben.</p>
<h2>Schwerbehindertenrente, 45 Jahre oder Erwerbsminderung</h2>
<p>Ab Jahrgang 1964 sind die abschlagsfreien Grenzen der Schwerbehindertenrente und der ${h.a('rente-nach-45-jahren', 'Rente nach 45 Jahren')} identisch: ${fmtAlter(z64.s.voll, 'de')}. Wer beides erfüllt, gewinnt durch die Schwerbehinderung also nicht beim abschlagsfreien Termin, sondern beim Spielraum davor: bis zu ${h.num(maxMonate)} Monate früher, gegen ${h.pct(AB, 1)} je Monat. Die Rente nach 45 Jahren lässt keinen früheren Beginn zu.</p>
<p>Wer gesundheitlich weniger als sechs Stunden täglich arbeiten kann, sollte auch die ${h.a('erwerbsminderungsrente', 'Erwerbsminderungsrente')} prüfen. Sie verlangt andere Voraussetzungen, nämlich unter anderem drei Jahre Pflichtbeiträge in den letzten fünf Jahren, und auch ihr Abschlag ist auf ${h.pct(maxAb, 1)} begrenzt. Sie ist keine Altersrente, sondern hängt an der Arbeitsfähigkeit; welche Rente im Einzelfall günstiger ist, klären die Auskunfts- und Beratungsstellen der Rentenversicherung.</p>
<h2>Abschlag ausgleichen, Teilrente, Weiterarbeit</h2>
<p>Auch der Abschlag dieser Rente lässt sich nach ${h.src('sgb6_187a', '§ 187a SGB VI')} bis zur Regelaltersgrenze durch Sonderzahlungen ausgleichen. Mit ${h.num(EP)} Entgeltpunkten und Beginn zum frühesten Termin kostet der volle Ausgleich 2026 rund ${h.eur(aus62.betrag)}, für ${h.eur(aus62.renteMinus, 2)} Rente im Monat; Teilbeträge sind erlaubt (${h.a('ausgleichszahlung', 'Ausgleichszahlung berechnen')}). Statt der vollen Rente kann man eine Teilrente ab 10 Prozent beziehen (${h.src('sgb6_42', '§ 42 SGB VI')}), und eine Hinzuverdienstgrenze gibt es seit 2023 nicht mehr. Wer etwa mit verringerter Stundenzahl weiterarbeitet, sammelt weiter Entgeltpunkte, die jeweils zum 1. Juli des Folgejahres die Rente erhöhen.</p>
<h2>Und die Reform?</h2>
<p>Die Alterssicherungskommission hat am 23. Juni 2026 ${h.P.reform.empfehlungen} Empfehlungen vorgelegt (${h.src('bmasKommission', 'Bundesarbeitsministerium')}). Darunter ist eine neue „Schutzrente“ für Menschen, die einen lange ausgeübten Beruf gesundheitlich nicht mehr ausüben können: zwei Jahre vor der Regelaltersgrenze ohne Abschlag, bis zu drei Jahre früher mit Abschlag, bei ${WZ} Versicherungsjahren. Das ist ein Vorschlag, kein Gesetz, und wie er sich zur bestehenden Rente für schwerbehinderte Menschen verhalten würde, lässt sich erst an einem Gesetzentwurf ablesen. Den Stand beschreibt ${h.a('rentenreform', 'Rentenreform')}; alle geltenden Grenzen stehen in der ${h.a('renteneintrittsalter-tabelle', 'Renteneintrittsalter-Tabelle')}.</p>`,
  },
  en: {
    slug: 'pension-severe-disability',
    nav: 'Pension with a severe disability',
    card: 'With a disability degree of 50: two years earlier without a reduction, up to five years earlier with one.',
    title: 'Pension with a severe disability 2026: age and reduction',
    description: 'Pension with a severe disability in Germany, 2026: unreduced at 65 from the 1964 cohort, earliest at 62. Table by birth year, the cut at 63 and how it compares.',
    h1: 'German pension for severely disabled people: when is it unreduced?',
    intro: 'A recognised degree of disability of 50 moves every limit forward. The calculator gives both ages for your birth year.',
    resume: `The old-age pension for severely disabled people (Altersrente für schwerbehinderte Menschen, section 37 of Book VI of the Social Code, section 236a for older cohorts) has two conditions: a degree of disability (Grad der Behinderung, GdB) of at least 50 when the pension starts, and ${WZ} insured years. From the 1964 cohort it is unreduced at ${fmtAlter(z64.s.voll, 'en')} and available at the earliest at ${fmtAlter(z64.s.frueh, 'en')}. There are ${EN.num(maxMonate)} months between the two, so the reduction is never more than ${EN.pct(maxAb, 1)}. An unreduced start at exactly 63 was last possible for the 1951 cohort; since 1952 both limits have risen step by step, to ${fmtAlter(z60.s.voll, 'en')} and ${fmtAlter(z60.s.frueh, 'en')} for people born in 1960. If you were born in 1964 or later and start at 63, the reduction is ${EN.pct(ab63, 1)}, half the ${EN.pct(ohne.abschlag, 1)} you would face on the 35-year route without the disability status. On a ${EN.eur(RENTE)} pension that is ${EN.eur(RENTE * ab63)} instead of ${EN.eur(RENTE * ohne.abschlag)} less each month.`,
    faqs: [
      { q: 'Can I retire at 63 without a reduction in Germany if I have a severe disability?', a: `Not if you are retiring now. Severely disabled people could stop at exactly 63 without a reduction up to the 1951 cohort. For 1952 the limit was already ${fmtAlter(z52.s.voll, 'en')}, and it keeps rising to ${fmtAlter(z64.s.voll, 'en')} from the 1964 cohort. Starting at 63 is still possible, but with a reduction, which from 1964 is ${EN.pct(ab63, 1)}.` },
      { q: 'What is the earliest age I can retire with a disability degree of 50?', a: `From the 1964 cohort, ${fmtAlter(z64.s.frueh, 'en')}, with a ${EN.pct(maxAb, 1)} reduction. Older cohorts have a lower earliest age, for instance ${fmtAlter(z60.s.frueh, 'en')} for those born in 1960. You need ${WZ} insured years and a degree of disability of at least 50 that is established when the pension begins. A degree of 30 or 40 is not enough for this pension.` },
      { q: 'Does my disability status have to be recognised before I apply for the pension?', a: 'It has to exist when the pension starts. If you are still waiting for recognition, start that procedure well before the date you have in mind. Without a recognised degree of 50 only the other old-age pensions remain, which with 35 years means the pension for long-term insured persons and its larger reduction. If need be, push the start back a little to wait for the decision.' },
      { q: 'Is the disability pension route better than the 45-year pension?', a: `For people born from 1964 both are unreduced from ${fmtAlter(z64.s.voll, 'en')}. The disability route needs only ${WZ} years instead of 45, though, and allows a start up to ${EN.num(maxMonate)} months earlier with a reduction. If you meet both, you have more room. For older cohorts the 45-year limit is the same, for example ${fmtAlter(besondersAlter(1960), 'en')} for 1960.` },
      { q: 'Do years worked abroad count towards the 35 years for this pension?', a: `Insurance periods from other EU and EEA countries and Switzerland are added to German ones to reach the ${WZ} years under Regulation 883/2004. They help you qualify, but the German pension is paid on your German periods only, and each country pays its own share. Outside Europe it depends on whether Germany has an agreement with that country, so ask the pension insurance.` },
    ],
    body: (h) => `
<h2>Both age limits by birth year</h2>
<p>This pension has two limits: the age from which it is unreduced and the earliest age at which it can start. Both have risen step by step since the 1952 cohort under ${h.src('sgb6_236a', 'section 236a SGB VI')}; from 1964 ${h.src('sgb6_37', 'section 37 SGB VI')} applies. The last column shows what a start at exactly 63 costs.</p>
${h.table(['Born', 'Unreduced at', 'Earliest at', 'Reduction at earliest start', 'Reduction at 63'], reihe.map((x) => [x.j >= 1960 ? h.a(`jahrgang-${x.j}`, x.j === 1964 ? '1964 and later' : String(x.j)) : String(x.j), fmtAlter(x.s.voll, 'en'), fmtAlter(x.s.frueh, 'en'), h.pct(x.sb.abschlag, 1), x.mit63 ? h.pct(x.mit63.abschlag, 1) : '–']), `Degree of disability at least 50, ${WZ} years, birthday 15 June`, ['l', 'l', 'l', 'r', 'r'])}
<p>Two things stand out. The maximum reduction is the same for every cohort, ${h.pct(maxAb, 1)}, because the earliest and the unreduced age rise together and stay ${h.num(maxMonate)} months apart. And the price of starting at 63 grows with each cohort: for people born in 1951, 63 was still unreduced; from 1964 it means ${h.num(z64.mit63!.monate)} months at ${h.pct(AB, 1)} each.</p>
<h2>What the status is worth in euros</h2>
<p>Take someone born in 1964 with an unreduced pension of ${h.eur(RENTE)} who starts at 63. With the disability status they receive ${h.eur(RENTE * (1 - ab63))} a month; without it, through the ${h.a('langjaehrig-versicherte', '35-year pension')}, only ${h.eur(RENTE * (1 - ohne.abschlag))}. The gap of ${h.eur(RENTE * (ohne.abschlag - ab63))} a month lasts for life, ${h.eur(RENTE * (ohne.abschlag - ab63) * 240)} over twenty years. Under ${h.src('sgb6_77', 'section 77(3) SGB VI')} it also carries over to any widow’s or widower’s pension derived from it. All amounts are gross; health and care contributions are deducted from the German pension as from any other.</p>
<h2>The conditions in detail</h2>
<p>First, the degree of disability: at least 50, established by the time the pension starts. Anything below 50 does not qualify, however close. Second, ${WZ} years of qualifying periods, for which every pension period counts (${h.src('sgb6_51', 'section 51(3) SGB VI')}), so unlike the 45-year test this includes periods on citizen’s benefit, at school or university insofar as they are pension periods. Third, an application that reaches the pension insurance within three calendar months of the start you want.</p>
<p>If you do not yet have a recognised degree of disability, settle that before you fix your retirement date; without it, 35 years only open the pension for long-term insured persons from 63, with the larger reduction from the table above.</p>
<h2>Disability route, 45 years or reduced earning capacity</h2>
<p>From the 1964 cohort the unreduced age of this pension and of the ${h.a('rente-nach-45-jahren', 'pension after 45 years')} are the same: ${fmtAlter(z64.s.voll, 'en')}. If you meet both, the disability status does not bring the unreduced date forward; it gives you room before it, up to ${h.num(maxMonate)} months earlier at ${h.pct(AB, 1)} per month. The 45-year pension allows no earlier start at all.</p>
<p>If your health limits you to fewer than six hours of work a day, also look at the ${h.a('erwerbsminderungsrente', 'disability pension for reduced earning capacity')} (Erwerbsminderungsrente). It has different conditions, including three years of compulsory contributions in the last five, and its reduction is also capped at ${h.pct(maxAb, 1)}. It is not an old-age pension but depends on your capacity to work; which pension suits your case is something the advice centres of the pension insurance (Auskunfts- und Beratungsstellen) can check.</p>
<h2>Buying out the reduction, partial pension, working on</h2>
<p>The reduction on this pension can also be offset with special payments up to the standard age under ${h.src('sgb6_187a', 'section 187a SGB VI')}. With ${h.num(EP)} pension points and a start at the earliest date, a full buy-out costs about ${h.eur(aus62.betrag)} in 2026 for ${h.eur(aus62.renteMinus, 2)} of monthly pension; instalments are allowed (${h.a('ausgleichszahlung', 'buy-out calculator')}). Instead of the full pension you can draw a partial pension from 10% (${h.src('sgb6_42', 'section 42 SGB VI')}), and there has been no earnings cap since 2023. If you keep working reduced hours, you keep earning pension points, which raise the pension each 1 July of the following year.</p>
<h2>What about the reform?</h2>
<p>The pension commission presented ${h.P.reform.empfehlungen} recommendations on 23 June 2026 (${h.src('bmasKommission', 'Federal Ministry of Labour')}). One is a new “protection pension” (Schutzrente) for people who can no longer do a job they have done for a long time for health reasons: two years before the standard age without a reduction, up to three years earlier with one, after ${WZ} insured years. It is a proposal, not law, and how it would sit next to the existing pension for severely disabled people can only be read from a draft bill. The state of play is under ${h.a('rentenreform', 'pension reform')}; every current limit is in the ${h.a('renteneintrittsalter-tabelle', 'retirement age table')}.</p>`,
  },
});
