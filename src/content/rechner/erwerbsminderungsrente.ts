import { defineGuide } from '../../lib/guide-types';
import { emRente, hinzuGrenze, zurechnungEnde, type EmEingabe } from '../../lib/engine/hinterbliebene';
import { nettoStandard, besteuerungsanteil } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Erwerbsminderungsrente berechnen: sechs Fälle mit Rentenbeginn 2026, vereinfachte Bewertung des Motors (Durchschnitt seit dem 17. Geburtstag). */
const RW = P.rentenwert.ab_2026_07;
const ZF = P.zugangsfaktor;
const em = (alter: number, ep: number, voll = true) => {
  const e: EmEingabe = { ep, alter, voll, jahr: 2026, rw: RW };
  const r = emRente(e);
  return { alter, ep, voll, r, n: nettoStandard(r.rente) };
};
const std = em(52, 22);
const teil = em(52, 22, false);
const faelle = [em(40, 12), em(45, 25, false), std, teil, em(58, 35), em(63, 40)];
const spaet = faelle[5];
const ende = zurechnungEnde(2026);
const endeJ = Math.floor(ende);
const endeM = Math.round((ende - endeJ) * 12);
const maxAbschlag = ZF.em_max_monate * ZF.abschlag_monat;
const gVoll = hinzuGrenze(true);
const gTeil = hinzuGrenze(false);

export default defineGuide({
  id: 'erwerbsminderungsrente',
  group: 'familie',
  order: 210,
  tool: 'em',
  related: ['em-hinzuverdienst', 'witwenrente-rechner', 'rentenrechner-brutto-netto', 'entgeltpunkte', 'schwerbehinderte', 'renteninformation'],
  sources: ['sgb6_43', 'sgb6_253a', 'sgb6_77', 'sgb6_67', 'sgb6_64', 'sgb6_96a', 'estg_22', 'vo883'],
  de: {
    slug: 'erwerbsminderungsrente-berechnen',
    nav: 'Erwerbsminderungsrente',
    card: 'Volle oder teilweise Erwerbsminderungsrente aus Ihren Entgeltpunkten, mit Zurechnungszeit, Abschlag und Netto.',
    title: 'Erwerbsminderungsrente berechnen 2026: brutto und netto',
    description: `Erwerbsminderungsrente berechnen 2026: Entgeltpunkte plus Zurechnungszeit bis ${DE.num(endeJ)} Jahre und ${DE.num(endeM)} Monate, Abschlag bis ${DE.pct(maxAbschlag, 1)}, Netto nach Kranken- und Pflegebeitrag.`,
    h1: 'Erwerbsminderungsrente berechnen: brutto, netto, Abschlag',
    intro: 'Bisherige Entgeltpunkte, Alter bei Eintritt der Erwerbsminderung und die Art der Rente eingeben: Der Rechner schätzt die Rente brutto und netto für einen Beginn 2026.',
    resume: `Die Erwerbsminderungsrente wird so berechnet, als hätten Sie bis zu einem festen Alter weitergearbeitet. Diese Zurechnungszeit reicht bei einem Rentenbeginn 2026 bis ${DE.num(endeJ)} Jahre und ${DE.num(endeM)} Monate; für die fehlenden Jahre schreibt die Rentenversicherung Ihren bisherigen Durchschnitt an Entgeltpunkten fort. Auf das Ergebnis kommt ein Abschlag von ${DE.pct(ZF.abschlag_monat, 1)} je Monat vor dem 65. Geburtstag, höchstens ${DE.pct(maxAbschlag, 1)}; wer vor 62 erwerbsgemindert wird, trägt also immer den vollen Abschlag. Die volle Rente bei weniger als drei Stunden Arbeitsfähigkeit am Tag hat den Rentenartfaktor ${DE.num(P.em.rentenartfaktor_voll, 1)}, die teilweise bei drei bis unter sechs Stunden ${DE.num(P.em.rentenartfaktor_teil, 1)}. Beispiel aus dem Rechner: Wer mit 52 Jahren und ${DE.num(std.ep)} Entgeltpunkten voll erwerbsgemindert wird, erhält ${DE.num(std.r.epZ, 2)} Punkte aus der Zurechnungszeit dazu und kommt auf ${DE.eur(std.r.rente)} brutto, rund ${DE.eur(std.n.netto)} netto. Die teilweise Rente wäre ${DE.eur(teil.r.rente)}. Das Ergebnis ist eine vereinfachte Schätzung.`,
    faqs: [
      { q: 'Warum hat fast jede Erwerbsminderungsrente den höchsten Abschlag?', a: `Der Abschlag zählt die Monate zwischen Rentenbeginn und dem 65. Geburtstag, aber höchstens ${DE.num(ZF.em_max_monate)}. Wer vor dem 62. Geburtstag erwerbsgemindert wird, liegt immer darüber und bekommt ${DE.pct(maxAbschlag, 1)}. Erst ab 62 sinkt er: Mit 63 Jahren und ${DE.num(spaet.ep)} Punkten rechnet der Rechner mit ${DE.pct(1 - spaet.r.zf, 1)} und ${DE.eur(spaet.r.rente)} brutto.` },
      { q: 'Was bringt die Zurechnungszeit bei einer Erwerbsminderung mit 40?', a: `Sehr viel, weil sie die meisten Jahre auffüllt. Mit 12 Entgeltpunkten in den 23 Jahren seit dem 17. Geburtstag rechnet der Rechner ${DE.num(faelle[0].r.monateZ)} Monate bis ${DE.num(endeJ)} Jahre und ${DE.num(endeM)} Monate hinzu, also ${DE.num(faelle[0].r.epZ, 2)} weitere Punkte. Daraus werden ${DE.eur(faelle[0].r.rente)} brutto statt rund ${DE.eur(12 * (1 - maxAbschlag) * RW)} ohne Zurechnungszeit.` },
      { q: 'Was bleibt von der Erwerbsminderungsrente netto übrig?', a: `Wie bei jeder gesetzlichen Rente gehen Kranken- und Pflegebeitrag ab, und der steuerpflichtige Anteil richtet sich nach dem Jahr des Rentenbeginns, ${DE.pct(besteuerungsanteil(2026))} für 2026. Von ${DE.eur(std.r.rente)} brutto bleiben alleinstehend rund ${DE.eur(std.n.netto)}; ob Steuer anfällt, hängt von weiteren Einkünften ab. Den genauen Weg zeigt der Rechner brutto netto.` },
      { q: 'Warum zeigt der Rentenbescheid eine andere Erwerbsminderungsrente als der Rechner?', a: 'Der Rechner nimmt den Durchschnitt Ihrer Punkte je Monat seit dem 17. Geburtstag. Die Rentenversicherung bewertet stattdessen jede Lücke, Schul-, Studien- und Ausbildungszeit einzeln (Gesamtleistungsbewertung) und prüft, ob die Voraussetzungen überhaupt erfüllt sind. Wer lange Lücken oder sehr unterschiedliche Verdienste hatte, kann deutlich abweichen. Maßgeblich ist allein der Bescheid.' },
    ],
    body: (h) => `
<h2>Die Bausteine der Schätzung</h2>
<p>Die Rente folgt der allgemeinen Formel aus Entgeltpunkten, Zugangsfaktor, Rentenartfaktor und Rentenwert (${h.src('sgb6_64', '§ 64 SGB VI')}), hier mit ${h.eur(h.P.rentenwert.ab_2026_07, 2)} seit Juli 2026. Zu Ihren bisherigen Punkten kommt die Zurechnungszeit nach ${h.src('sgb6_253a', '§ 253a')}: Der Rechner teilt Ihre Punkte durch die Monate seit dem 17. Geburtstag und schreibt diesen Durchschnitt bis zum Ende der Zurechnungszeit fort. Den Abschlag nach ${h.src('sgb6_77', '§ 77')} zählt er ab dem 65. Geburtstag rückwärts, höchstens ${h.num(h.P.zugangsfaktor.em_max_monate)} Monate. Der Rentenartfaktor nach ${h.src('sgb6_67', '§ 67')} halbiert die teilweise Rente. Das Netto rechnet er wie für eine Altersrente mit Beginn 2026: alleinstehend, mit Kindern, durchschnittlicher Zusatzbeitrag.</p>
${h.table(['Alter bei Eintritt', 'Punkte bisher', 'Art', 'Punkte Zurechnungszeit', 'Abschlag', 'Brutto', 'Netto'], faelle.map((f) => [h.num(f.alter), h.num(f.ep), f.voll ? 'voll' : 'teilweise', h.num(f.r.epZ, 2), h.pct(1 - f.r.zf, 1), h.eur(f.r.rente), h.eur(f.n.netto)]), 'Rentenbeginn 2026, Rentenwert ab 1. Juli 2026, vereinfachte Bewertung', ['r', 'r', 'l', 'r', 'r', 'r', 'r'])}
<p>Wer früh erwerbsgemindert wird, hat weniger eigene Punkte, bekommt aber mehr aus der Zurechnungszeit, weil sie die fehlenden Jahre mit dem bisherigen Durchschnitt füllt. In dieser vereinfachten Rechnung geben deshalb Ihre durchschnittlichen Punkte je Jahr den Ausschlag, also Ihr Verdienst im Verhältnis zum Durchschnittsentgelt (${h.a('entgeltpunkte', 'Entgeltpunkte')}).</p>
<h2>Was der Rechner nicht prüft</h2>
<p>Ob ein Anspruch besteht, entscheidet allein die Rentenversicherung. Voll erwerbsgemindert ist, wer auf dem allgemeinen Arbeitsmarkt weniger als drei Stunden täglich arbeiten kann, teilweise, wer drei bis unter sechs Stunden schafft (${h.src('sgb6_43', '§ 43')}). Dazu kommen fünf Jahre Wartezeit und drei Jahre Pflichtbeiträge in den letzten fünf Jahren vor dem Eintritt. Beides setzt der Rechner voraus. Seinen Hinweis zum Hinzuverdienst zeigt er für die teilweise Rente nur als Mindestgrenze von ${h.eur(gTeil)} im Jahr; die Grenze für die volle Rente liegt bei ${h.eur(gVoll)} (${h.src('sgb6_96a', '§ 96a')}). Was bei höherem Verdienst passiert, erklärt ${h.a('em-hinzuverdienst', 'Hinzuverdienst bei Erwerbsminderung')}.</p>
<h2>Später Wechsel in die Altersrente</h2>
<p>Für die Steuer zählt bei einer Altersrente, die unmittelbar auf eine Erwerbsminderungsrente folgt, eine Sonderregel nach ${h.src('estg_22', '§ 22 EStG')}: Der frühere Beginn kann den Besteuerungsanteil der Folgerente mitbestimmen. Wer schwerbehindert ist, sollte außerdem prüfen, ob eine ${h.a('schwerbehinderte', 'Altersrente für schwerbehinderte Menschen')} in Reichweite liegt. Die eigenen Entgeltpunkte stehen in der ${h.a('renteninformation', 'Renteninformation')}. Für die Antragstellung helfen die Auskunfts- und Beratungsstellen der Rentenversicherung kostenlos.</p>`,
  },
  en: {
    slug: 'disability-pension-calculator',
    nav: 'Disability pension',
    card: 'Full or partial German disability pension from your pension points, with the added period, reduction and net amount.',
    title: 'Disability Pension Germany 2026: Gross and Net Estimate',
    description: `Disability pension in Germany 2026: your pension points plus the added period to age ${EN.num(endeJ)} and ${EN.num(endeM)} months, a reduction of up to ${EN.pct(maxAbschlag, 1)}, net after health and care.`,
    h1: 'German disability pension: gross, net and reduction',
    intro: 'Enter your pension points so far, your age when you became unable to work and the type of pension: the calculator estimates the gross and net amount for a 2026 start.',
    resume: `A German disability pension (Erwerbsminderungsrente) is calculated as if you had kept working until a fixed age. For a pension starting in 2026 this added period (Zurechnungszeit) runs to ${EN.num(endeJ)} years and ${EN.num(endeM)} months, and the pension insurer extends your average pension points so far over the missing years. A reduction of ${EN.pct(ZF.abschlag_monat, 1)} applies for each month before your 65th birthday, capped at ${EN.pct(maxAbschlag, 1)}, so anyone who becomes unable to work before 62 always takes the full cut. The full pension, for people who can work less than three hours a day, has a pension type factor of ${EN.num(P.em.rentenartfaktor_voll, 1)}; the partial one, for three to under six hours, ${EN.num(P.em.rentenartfaktor_teil, 1)}. An example from the calculator: becoming fully disabled at 52 with ${EN.num(std.ep)} pension points adds ${EN.num(std.r.epZ, 2)} points from the added period and gives ${EN.eur(std.r.rente)} gross, about ${EN.eur(std.n.netto)} net. The partial pension would be ${EN.eur(teil.r.rente)}. The result is a simplified estimate.`,
    faqs: [
      { q: 'Why is the reduction on a German disability pension almost always the maximum?', a: `The reduction counts the months between the start of the pension and your 65th birthday, but no more than ${EN.num(ZF.em_max_monate)}. Anyone who becomes unable to work before 62 is beyond that and gets ${EN.pct(maxAbschlag, 1)}. Only from 62 does it fall: at 63 with ${EN.num(spaet.ep)} points the calculator applies ${EN.pct(1 - spaet.r.zf, 1)} and ${EN.eur(spaet.r.rente)} gross.` },
      { q: 'How much does the added period add if I become unable to work at 40?', a: `A lot, as it fills most of the missing years. With 12 pension points over the 23 years since your 17th birthday, the calculator adds ${EN.num(faelle[0].r.monateZ)} months up to ${EN.num(endeJ)} years and ${EN.num(endeM)} months, which is ${EN.num(faelle[0].r.epZ, 2)} extra points. The result is ${EN.eur(faelle[0].r.rente)} gross, instead of about ${EN.eur(12 * (1 - maxAbschlag) * RW)} without the added period.` },
      { q: 'Do contributions paid in another EU country count for a German disability pension?', a: 'For the qualifying periods, yes: under the EU coordination regulation, insurance periods in EU and EEA countries and Switzerland are added to German ones, so they can help you meet the five-year waiting period. Each country then pays its own share of the pension. This calculator only uses your German pension points; foreign periods do not raise its result.' },
      { q: 'Why might my pension decision show a different amount from this estimate?', a: 'The calculator divides your points by the months since your 17th birthday. The pension insurer instead values each gap and every school, study and training period individually (Gesamtleistungsbewertung) and also checks whether you qualify at all. Long gaps or very uneven earnings can shift the result noticeably. Only the official decision counts.' },
    ],
    body: (h) => `
<h2>The building blocks of the estimate</h2>
<p>The pension follows the general formula of pension points, access factor, pension type factor and pension value (${h.src('sgb6_64', 'section 64 SGB VI')}), here ${h.eur(h.P.rentenwert.ab_2026_07, 2)} since July 2026. The added period under ${h.src('sgb6_253a', 'section 253a')} is put on top of your existing points: the calculator divides your points by the months since your 17th birthday and extends that average to the end of the added period. It counts the reduction under ${h.src('sgb6_77', 'section 77')} back from your 65th birthday, for at most ${h.num(h.P.zugangsfaktor.em_max_monate)} months. The pension type factor under ${h.src('sgb6_67', 'section 67')} halves the partial pension. Net pay is worked out as for a retirement pension starting in 2026: single, with children, average extra health rate.</p>
${h.table(['Age at onset', 'Points so far', 'Type', 'Added-period points', 'Reduction', 'Gross', 'Net'], faelle.map((f) => [h.num(f.alter), h.num(f.ep), f.voll ? 'full' : 'partial', h.num(f.r.epZ, 2), h.pct(1 - f.r.zf, 1), h.eur(f.r.rente), h.eur(f.n.netto)]), 'Pension starting 2026, pension value from 1 July 2026, simplified assessment', ['r', 'r', 'l', 'r', 'r', 'r', 'r'])}
<p>People who become unable to work early have fewer points of their own but gain more from the added period, because it fills the missing years with their average so far. In this simplified calculation, what decides the amount is therefore your average points per year, in other words your earnings relative to the national average (${h.a('entgeltpunkte', 'pension points')}).</p>
<h2>What the calculator does not check</h2>
<p>Whether you qualify is decided by the pension insurer alone. Full reduced earning capacity means you can work less than three hours a day in the general labour market; partial means three to under six hours (${h.src('sgb6_43', 'section 43')}). You also need five years of insurance and three years of compulsory contributions in the five years before onset. The calculator assumes both. For a partial pension its earnings line shows only the minimum limit of ${h.eur(gTeil)} a year; for a full pension the limit is ${h.eur(gVoll)} (${h.src('sgb6_96a', 'section 96a')}). What happens if you earn more is explained under ${h.a('em-hinzuverdienst', 'earnings on a disability pension')}. Periods in other EU countries can count towards the qualifying conditions under ${h.src('vo883', 'Regulation 883/2004')}, but each country pays only for its own periods.</p>
<h2>Moving on to a retirement pension</h2>
<p>For tax, a special rule in ${h.src('estg_22', 'section 22 Income Tax Act')} applies when a retirement pension directly follows a disability pension: the earlier start can shape the taxable share of the later pension. If you have a recognised severe disability, check whether a ${h.a('schwerbehinderte', 'pension for severely disabled people')} is within reach. Your own points appear in the annual ${h.a('renteninformation', 'pension statement')}. The pension insurer’s information and advice centres (Auskunfts- und Beratungsstellen) help with the claim free of charge.</p>`,
  },
});
