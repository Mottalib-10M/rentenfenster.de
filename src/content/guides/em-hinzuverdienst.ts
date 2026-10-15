import { defineGuide } from '../../lib/guide-types';
import { hinzuGrenze, emKuerzung, emRente, zurechnungEnde } from '../../lib/engine/hinterbliebene';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Hinzuverdienst bei Erwerbsminderungsrente 2026 (§ 96a SGB VI): Grenzen voll und teilweise, Kürzung um 40 % eines Zwölftels
 * des Überschreitungsbetrags. Beispiele: volle EM-Rente 1.200 €, teilweise 650 € mit 1,2 EP im besten Jahr (Annahmen).
 */
const E = P.em;
const BZ = P.rechengroessen.bezugsgroesse_monat;
const RW = P.rentenwert.ab_2026_07;
const gVoll = hinzuGrenze(true);
const gTeilMin = hinzuGrenze(false, 0);
const epSchwelle = gTeilMin / (E.hinzu_teil_faktor * BZ);
const teilReihe = [0.8, 1, 1.2, 1.5, 2].map((ep) => ({ ep, g: hinzuGrenze(false, ep) }));
const g12 = hinzuGrenze(false, 1.2);
const RV = 1200;
const verdienste = [18000, 20000, 24000, 30000, 40000];
const reihe = verdienste.map((v) => ({ v, k: emKuerzung(RV, v, gVoll) }));
const k24 = emKuerzung(RV, 24000, gVoll);
const nullAb = gVoll + (RV * 12) / E.hinzu_anrechnung;
const je1000 = (1000 / 12) * E.hinzu_anrechnung;
const RT = 650;
const kTeil = emKuerzung(RT, 50000, g12);
const bsp = emRente({ ep: 25, alter: 50, voll: true, jahr: 2026, rw: RW });
const bspTeil = emRente({ ep: 25, alter: 50, voll: false, jahr: 2026, rw: RW });
const z26 = zurechnungEnde(2026);
const zJ = Math.floor(z26), zM = Math.round((z26 - zJ) * 12);
const bruch = (x: number) => `${Math.round(x * 8)}/8`;
const maxAb = P.zugangsfaktor.em_max_monate * P.zugangsfaktor.abschlag_monat;

export default defineGuide({
  id: 'em-hinzuverdienst',
  group: 'familie',
  order: 230,
  mini: 'emHinzu',
  miniHref: 'erwerbsminderungsrente',
  related: ['erwerbsminderungsrente', 'hinzuverdienst', 'witwenrente-einkommen', 'teilrente', 'rente-ausland', 'besteuerung-rente'],
  sources: ['sgb6_96a', 'sgb6_43', 'sgb6_253a', 'sgb6_67', 'sgb6_77', 'drvRechengroessen', 'drvWerte', 'vo883'],
  de: {
    slug: 'erwerbsminderungsrente-hinzuverdienst',
    nav: 'Hinzuverdienst bei EM-Rente',
    card: `Bis ${DE.eur(gVoll, 2)} im Jahr neben der vollen EM-Rente, bei teilweiser Erwerbsminderung mindestens ${DE.eur(gTeilMin, 2)}.`,
    title: 'Erwerbsminderungsrente Hinzuverdienst 2026: die Grenzen',
    description: `Erwerbsminderungsrente Hinzuverdienst 2026: volle EM ${DE.eur(gVoll, 2)} im Jahr, teilweise mindestens ${DE.eur(gTeilMin, 2)}. Darüber kürzen ${DE.pct(E.hinzu_anrechnung, 0)} eines Zwölftels die Rente.`,
    h1: 'Hinzuverdienst bei Erwerbsminderungsrente 2026',
    intro: 'Neben einer Erwerbsminderungsrente ist Arbeit erlaubt, aber nur bis zu einer Jahresgrenze ohne Folgen für die Rente. Darüber wird ein Teil des Mehrverdienstes angerechnet.',
    resume: `Wer eine Rente wegen Erwerbsminderung bezieht, darf dazuverdienen, doch anders als bei Altersrenten gilt eine Grenze (§ 96a SGB VI). Bei voller Erwerbsminderung liegt sie 2026 bei ${DE.eur(gVoll, 2)} im Jahr: ${bruch(E.hinzu_voll_anteil)} von ${E.hinzu_monate} monatlichen Bezugsgrößen zu ${DE.eur(BZ)}. Bei teilweiser Erwerbsminderung ist sie individuell, nämlich ${DE.num(E.hinzu_teil_faktor, 2)} × Bezugsgröße × die Entgeltpunkte des besten Jahres der letzten 15 Jahre, mindestens aber ${DE.eur(gTeilMin, 2)}. Wer die Grenze überschreitet, verliert die Rente nicht sofort: Von dem Betrag über der Grenze wird ein Zwölftel gebildet und davon ${DE.pct(E.hinzu_anrechnung, 0)} von der monatlichen Rente abgezogen. Je 1.000 € Überschreitung im Jahr sind das ${DE.eur(je1000, 2)} im Monat. Beispiel: Eine volle EM-Rente von 1.200 € und 24.000 € Jahresverdienst ergeben einen Abzug von ${DE.eur(k24.abzug, 2)}, es bleiben ${DE.eur(k24.zahlbetrag, 2)}. Ganz entfällt diese Rente erst ab etwa ${DE.eur(nullAb)} Verdienst im Jahr. Unabhängig vom Geld bleibt die Stundengrenze, die die Erwerbsminderung selbst bestimmt.`,
    faqs: [
      { q: 'Wie viel darf ich 2026 zur vollen Erwerbsminderungsrente hinzuverdienen?', a: `${DE.eur(gVoll, 2)} im Jahr ohne Abzug. Das sind ${bruch(E.hinzu_voll_anteil)} von ${E.hinzu_monate} Monatsbezugsgrößen zu je ${DE.eur(BZ)}, umgerechnet im Schnitt ${DE.eur(gVoll / 12, 2)} im Monat. Die Grenze gilt für das Kalenderjahr: Einzelne Monate mit mehr Verdienst sind unschädlich, solange die Jahressumme darunter bleibt. Mit der Bezugsgröße wird die Grenze jedes Jahr neu festgesetzt.` },
      { q: 'Wie hoch ist die Hinzuverdienstgrenze bei teilweiser Erwerbsminderung?', a: `Sie wird individuell berechnet: ${DE.num(E.hinzu_teil_faktor, 2)} × ${DE.eur(BZ)} × die Entgeltpunkte Ihres besten Jahres in den letzten 15 Jahren vor Eintritt der Erwerbsminderung. Mindestens gilt ${DE.eur(gTeilMin, 2)} im Jahr. Wer im besten Jahr 1,2 Entgeltpunkte erreicht hat, darf ${DE.eur(g12, 2)} verdienen. Unter ${DE.num(epSchwelle, 2)} Punkten greift der Mindestbetrag.` },
      { q: 'Was passiert, wenn ich die Hinzuverdienstgrenze überschreite?', a: `Die Rente wird gekürzt, nicht gestrichen. Der Betrag über der Grenze wird durch zwölf geteilt, und ${DE.pct(E.hinzu_anrechnung, 0)} davon gehen monatlich von der Rente ab. Bei voller EM-Rente von 1.200 € und 24.000 € Verdienst liegen ${DE.eur(k24.ueber, 2)} über der Grenze; der Abzug beträgt ${DE.eur(k24.abzug, 2)} im Monat, ausgezahlt werden ${DE.eur(k24.zahlbetrag, 2)}.` },
      { q: 'Ab welchem Verdienst entfällt die volle EM-Rente vollständig?', a: `Wenn ${DE.pct(E.hinzu_anrechnung, 0)} eines Zwölftels der Überschreitung so hoch sind wie die Rente. Bei 1.200 € Rente ist das ab einem Jahresverdienst von etwa ${DE.eur(nullAb)} der Fall. Bei einer kleineren Rente kommt dieser Punkt früher. So weit wird es in der Praxis selten kommen, weil ein solcher Verdienst kaum mit weniger als drei Stunden Arbeit am Tag erreichbar ist.` },
      { q: 'Darf ich mit voller Erwerbsminderungsrente mehr als drei Stunden täglich arbeiten?', a: 'Volle Erwerbsminderung bedeutet, dass Sie auf dem allgemeinen Arbeitsmarkt weniger als drei Stunden täglich arbeiten können (§ 43 SGB VI). Die Hinzuverdienstgrenze prüft nur das Geld. Wer regelmäßig mehr arbeitet, als die ärztliche Feststellung zulässt, kann deshalb die Grundlage der Rente selbst in Frage stellen, auch wenn der Verdienst unter der Grenze bleibt. Klären Sie das vor Beginn der Tätigkeit.' },
      { q: 'Gilt die Hinzuverdienstgrenze auch für die Altersrente danach?', a: `Nein. Für Altersrenten gibt es seit 2023 keine Hinzuverdienstgrenze mehr, auch nicht für vorgezogene. Sobald Sie statt der Erwerbsminderungsrente eine Altersrente beziehen, dürfen Sie unbegrenzt verdienen. Nach der Regelaltersgrenze kann Arbeitslohn sogar bis ${DE.eur(P.steuer.aktivrente_jahr)} im Jahr steuerfrei sein. Die Grenze auf dieser Seite betrifft also nur die Jahre mit EM-Rente.` },
    ],
    body: (h) => `
<h2>Zwei Grenzen, zwei Formeln</h2>
<p>Für Erwerbsminderungsrenten gilt eine Jahresgrenze, die an die Bezugsgröße gekoppelt ist (${h.src('sgb6_96a', '§ 96a SGB VI')}). Die Bezugsgröße beträgt 2026 ${h.eur(h.P.rechengroessen.bezugsgroesse_monat)} im Monat (${h.src('drvRechengroessen', 'Rechengrößen 2026')}). Daraus ergeben sich zwei sehr unterschiedliche Werte:</p>
${h.table(['Rente', 'Formel', 'Grenze 2026 im Jahr', 'Im Monatsschnitt'], [
  ['Volle Erwerbsminderung', `${bruch(h.P.em.hinzu_voll_anteil)} × ${h.P.em.hinzu_monate} × ${h.eur(h.P.rechengroessen.bezugsgroesse_monat)}`, h.eur(gVoll, 2), h.eur(gVoll / 12, 2)],
  ['Teilweise Erwerbsminderung, Mindestwert', `${bruch(h.P.em.hinzu_teil_min_anteil)} × ${h.P.em.hinzu_monate} × ${h.eur(h.P.rechengroessen.bezugsgroesse_monat)}`, h.eur(gTeilMin, 2), h.eur(gTeilMin / 12, 2)],
  ['Teilweise Erwerbsminderung, 1,2 EP im besten Jahr', `${h.num(h.P.em.hinzu_teil_faktor, 2)} × ${h.eur(h.P.rechengroessen.bezugsgroesse_monat)} × 1,2`, h.eur(g12, 2), h.eur(g12 / 12, 2)],
], 'Hinzuverdienstgrenzen nach § 96a Abs. 1c SGB VI', ['l', 'l', 'r', 'r'])}
<p>Die Grenze ist eine Jahresgrenze: Ein Weihnachtsgeld oder ein Monat mit Überstunden schadet nicht, wenn die Summe des Kalenderjahres unter dem Wert bleibt.</p>
<h2>Was über der Grenze abgezogen wird</h2>
<p>Überschreitet der Jahresverdienst die Grenze, wird der übersteigende Betrag durch zwölf geteilt; ${h.pct(h.P.em.hinzu_anrechnung, 0)} dieses Zwölftels gehen von der Monatsrente ab. Bei einer vollen EM-Rente von 1.200 €:</p>
${h.table(['Verdienst im Jahr', 'Über der Grenze', 'Abzug im Monat', 'Rente danach'], reihe.map(({ v, k }) => [h.eur(v), h.eur(k.ueber, 2), h.eur(k.abzug, 2), h.eur(k.zahlbetrag, 2)]), `Volle Erwerbsminderung, Grenze ${h.eur(gVoll, 2)}`, ['r', 'r', 'r', 'r'])}
<p>Jeder zusätzliche Euro über der Grenze kostet also ${h.num(h.P.em.hinzu_anrechnung * 100)} Cent Rente, gerechnet aufs Jahr. Netto bleibt vom Mehrverdienst deshalb immer etwas übrig, nur weniger als beim Lohn allein. Die Rente fällt erst ab etwa ${h.eur(nullAb)} Jahresverdienst auf null. Mit Ihren eigenen Zahlen rechnet der Mini-Rechner oben.</p>
<h2>Teilweise Erwerbsminderung: die eigene Grenze</h2>
<p>Bei teilweiser Erwerbsminderung ist der Spielraum größer, weil die Rente mit dem Rentenartfaktor ${h.num(h.P.em.rentenartfaktor_teil, 1)} nur halb so hoch ist wie die volle (${h.src('sgb6_67', '§ 67 SGB VI')}) und Arbeit zwischen drei und unter sechs Stunden täglich vorausgesetzt wird. Die Grenze hängt an Ihrem besten Verdienstjahr der letzten 15 Jahre:</p>
${h.table(['Entgeltpunkte im besten Jahr', 'Hinzuverdienstgrenze im Jahr'], teilReihe.map((r) => [h.num(r.ep, 1), h.eur(r.g, 2)]), `Mindestens ${h.eur(gTeilMin, 2)}, gilt bis ${h.num(epSchwelle, 2)} Entgeltpunkten`, ['r', 'r'])}
<p>Ein Entgeltpunkt entspricht einem Jahresverdienst in Höhe des Durchschnittsentgelts. Wer also in seinem besten Jahr deutlich über dem Durchschnitt verdient hat, darf auch mit der Teilrente mehr hinzuverdienen. Beispiel: eine teilweise EM-Rente von 650 € mit 1,2 Punkten im besten Jahr und 50.000 € Jahresverdienst. ${h.eur(kTeil.ueber, 2)} liegen über der Grenze, der Abzug beträgt ${h.eur(kTeil.abzug, 2)}, es bleiben ${h.eur(kTeil.zahlbetrag, 2)} Rente.</p>
<h2>Stunden und Euro: zwei getrennte Prüfungen</h2>
<p>Die Hinzuverdienstgrenze sagt nur, wie viel Geld ohne Abzug erlaubt ist. Ob Sie überhaupt erwerbsgemindert sind, entscheidet die Zahl der Stunden, die Sie auf dem allgemeinen Arbeitsmarkt täglich arbeiten können: unter drei bei voller, drei bis unter sechs bei teilweiser Erwerbsminderung (${h.src('sgb6_43', '§ 43 SGB VI')}). Eine Tätigkeit von wenigen Stunden in der Woche widerspricht der Feststellung nicht; eine Teilzeitstelle mit 25 Wochenstunden, also fünf Stunden an fünf Tagen, passt dagegen nicht zur Feststellung „unter drei Stunden täglich“, selbst wenn der Lohn unter ${h.eur(gVoll, 2)} bleibt.</p>
<h2>Wie die EM-Rente selbst entsteht</h2>
<p>Voraussetzung sind fünf Jahre Wartezeit und drei Jahre Pflichtbeiträge in den letzten fünf Jahren vor der Erwerbsminderung. Die Rente wird so berechnet, als hätten Sie bis zum Ende der Zurechnungszeit weitergearbeitet; bei einem Beginn 2026 ist das ${zJ} Jahre und ${zM} Monate (${h.src('sgb6_253a', '§ 253a SGB VI')}). Der Abschlag folgt eigenen Regeln: Bezugspunkt ist das Alter ${h.P.zugangsfaktor.em_referenzalter}, höchstens werden ${h.pct(maxAb, 1)} abgezogen (${h.src('sgb6_77', '§ 77 SGB VI')}). Eine vereinfachte Rechnung mit 25 Entgeltpunkten bei Eintritt mit 50 ergibt rund ${h.eur(bsp.rente)} volle und ${h.eur(bspTeil.rente)} teilweise EM-Rente; der Rechner nimmt dabei den Durchschnitt der Punkte seit dem 17. Lebensjahr, die Rentenversicherung bewertet genauer. Eigene Zahlen rechnet der ${h.a('erwerbsminderungsrente', 'Erwerbsminderungsrentenrechner')}.</p>
<h2>Nach dem Wechsel in die Altersrente</h2>
<p>Für Altersrenten gibt es keine Hinzuverdienstgrenze mehr (${h.src('drvWerte', 'Werte der Rentenversicherung')}). Was mit einer Altersrente beim Weiterarbeiten gilt, auch die Aktivrente nach der Regelaltersgrenze, erklärt ${h.a('hinzuverdienst', 'Hinzuverdienst neben der Rente')}. Bezieht ein Hinterbliebener mit eigener EM-Rente zusätzlich eine Witwenrente, wird die EM-Rente dort als Einkommen angerechnet; dazu ${h.a('witwenrente-einkommen', 'Witwenrente und eigenes Einkommen')}.</p>`,
  },
  en: {
    slug: 'disability-pension-earnings',
    nav: 'Earnings with a disability pension',
    card: `Up to ${EN.eur(gVoll, 2)} a year alongside a full disability pension, at least ${EN.eur(gTeilMin, 2)} with a partial one.`,
    title: 'Disability pension earnings limit 2026: what you can earn',
    description: `Disability pension earnings limit 2026 in Germany: ${EN.eur(gVoll, 2)} a year with a full pension, at least ${EN.eur(gTeilMin, 2)} with a partial one, then ${EN.pct(E.hinzu_anrechnung, 0)} of the excess.`,
    h1: 'Earnings alongside a German disability pension in 2026',
    intro: 'You may work while drawing a German disability pension, but only up to an annual limit without any effect on the pension. Above it, part of the extra pay is counted.',
    resume: `If you draw a German pension for reduced earning capacity (Erwerbsminderungsrente), you may earn alongside it, but unlike old-age pensions there is a limit (section 96a SGB VI). For full reduced earning capacity the limit in 2026 is ${EN.eur(gVoll, 2)} a year: ${bruch(E.hinzu_voll_anteil)} of ${E.hinzu_monate} times the monthly reference value (Bezugsgröße) of ${EN.eur(BZ)}. For partial reduced earning capacity it is individual: ${EN.num(E.hinzu_teil_faktor, 2)} × reference value × the pension points of your best year in the last 15, but at least ${EN.eur(gTeilMin, 2)}. Exceeding the limit does not cost you the pension at once: the amount above the limit is divided by twelve and ${EN.pct(E.hinzu_anrechnung, 0)} of that is deducted from the monthly pension. Every €1,000 above the limit a year costs ${EN.eur(je1000, 2)} a month. Example: a full disability pension of €1,200 and €24,000 of annual earnings give a deduction of ${EN.eur(k24.abzug, 2)}, leaving ${EN.eur(k24.zahlbetrag, 2)}. The pension only stops entirely from about ${EN.eur(nullAb)} a year. Separately from the money, the hours limit that defines the disability itself still applies.`,
    faqs: [
      { q: 'How much can I earn alongside a full German disability pension in 2026?', a: `${EN.eur(gVoll, 2)} a year with no deduction. That is ${bruch(E.hinzu_voll_anteil)} of ${E.hinzu_monate} monthly reference values of ${EN.eur(BZ)}, on average ${EN.eur(gVoll / 12, 2)} a month. The limit applies to the calendar year, so single months with higher pay do no harm as long as the annual total stays below it. It is reset every year together with the reference value.` },
      { q: 'What is the earnings limit with a partial disability pension?', a: `It is calculated individually: ${EN.num(E.hinzu_teil_faktor, 2)} × ${EN.eur(BZ)} × the pension points of your best year in the 15 years before the reduced capacity began, with a minimum of ${EN.eur(gTeilMin, 2)} a year. With 1.2 points in your best year you may earn ${EN.eur(g12, 2)}. Below ${EN.num(epSchwelle, 2)} points the minimum applies.` },
      { q: 'What happens if I go over the disability pension earnings limit?', a: `The pension is reduced, not withdrawn. The amount above the limit is divided by twelve, and ${EN.pct(E.hinzu_anrechnung, 0)} of that comes off the pension each month. With a full pension of €1,200 and €24,000 of earnings, ${EN.eur(k24.ueber, 2)} is above the limit; the deduction is ${EN.eur(k24.abzug, 2)} a month and ${EN.eur(k24.zahlbetrag, 2)} is paid.` },
      { q: 'At what income does a full disability pension stop completely?', a: `When ${EN.pct(E.hinzu_anrechnung, 0)} of one twelfth of the excess equals the pension. For a €1,200 pension that happens at annual earnings of about ${EN.eur(nullAb)}. With a smaller pension the point comes sooner. In practice it is rare, because earnings like that are hard to reach in under three hours of work a day.` },
      { q: 'Can I work more than three hours a day on a full disability pension?', a: 'Full reduced earning capacity means you can work less than three hours a day on the general labour market (section 43 SGB VI). The earnings limit only checks the money. If you regularly work more than the medical finding allows, the basis of the pension itself can be called into question, even with earnings below the limit. Clarify this before you take on the job.' },
      { q: 'Does the earnings limit still apply once I switch to an old-age pension?', a: `No. Old-age pensions have had no earnings limit since 2023, early ones included. Once you draw an old-age pension instead of the disability pension, you may earn without limit. After the standard retirement age, wages can even be tax-free up to ${EN.eur(P.steuer.aktivrente_jahr)} a year. The limit on this page only covers the years on a disability pension.` },
    ],
    body: (h) => `
<h2>Two limits, two formulas</h2>
<p>Disability pensions have an annual limit linked to the reference value (${h.src('sgb6_96a', 'section 96a SGB VI')}). In 2026 the reference value is ${h.eur(h.P.rechengroessen.bezugsgroesse_monat)} a month (${h.src('drvRechengroessen', 'social insurance figures 2026')}). That gives two very different amounts:</p>
${h.table(['Pension', 'Formula', 'Limit 2026 a year', 'Monthly average'], [
  ['Full reduced earning capacity', `${bruch(h.P.em.hinzu_voll_anteil)} × ${h.P.em.hinzu_monate} × ${h.eur(h.P.rechengroessen.bezugsgroesse_monat)}`, h.eur(gVoll, 2), h.eur(gVoll / 12, 2)],
  ['Partial, minimum', `${bruch(h.P.em.hinzu_teil_min_anteil)} × ${h.P.em.hinzu_monate} × ${h.eur(h.P.rechengroessen.bezugsgroesse_monat)}`, h.eur(gTeilMin, 2), h.eur(gTeilMin / 12, 2)],
  ['Partial, 1.2 points in best year', `${h.num(h.P.em.hinzu_teil_faktor, 2)} × ${h.eur(h.P.rechengroessen.bezugsgroesse_monat)} × 1.2`, h.eur(g12, 2), h.eur(g12 / 12, 2)],
], 'Earnings limits under section 96a(1c) SGB VI', ['l', 'l', 'r', 'r'])}
<p>The limit is annual: a Christmas bonus or a month of overtime does no harm if the calendar-year total stays below it.</p>
<h2>What is deducted above the limit</h2>
<p>If annual earnings exceed the limit, the excess is divided by twelve and ${h.pct(h.P.em.hinzu_anrechnung, 0)} of that twelfth comes off the monthly pension. For a full disability pension of €1,200:</p>
${h.table(['Earnings a year', 'Above the limit', 'Deduction a month', 'Pension after'], reihe.map(({ v, k }) => [h.eur(v), h.eur(k.ueber, 2), h.eur(k.abzug, 2), h.eur(k.zahlbetrag, 2)]), `Full reduced earning capacity, limit ${h.eur(gVoll, 2)}`, ['r', 'r', 'r', 'r'])}
<p>So each extra euro above the limit costs ${h.num(h.P.em.hinzu_anrechnung * 100)} cents of pension over the year. Extra work always leaves you better off, just by less than the wage alone. The pension only reaches zero at about ${h.eur(nullAb)} a year. The mini calculator above uses your own figures.</p>
<h2>Partial reduced earning capacity: your own limit</h2>
<p>With partial reduced earning capacity there is more room, because the pension is only half the full one, with a pension type factor of ${h.num(h.P.em.rentenartfaktor_teil, 1)} (${h.src('sgb6_67', 'section 67 SGB VI')}), and work of three to under six hours a day is expected. The limit depends on your best earning year in the last 15:</p>
${h.table(['Pension points in best year', 'Earnings limit a year'], teilReihe.map((r) => [h.num(r.ep, 1), h.eur(r.g, 2)]), `At least ${h.eur(gTeilMin, 2)}, which applies up to ${h.num(epSchwelle, 2)} points`, ['r', 'r'])}
<p>One pension point equals a year’s pay at the national average. If your best year was well above average, you may earn more alongside the partial pension. Example: a partial disability pension of €650, 1.2 points in the best year and €50,000 of annual pay. ${h.eur(kTeil.ueber, 2)} is above the limit, the deduction is ${h.eur(kTeil.abzug, 2)} and ${h.eur(kTeil.zahlbetrag, 2)} of pension remains.</p>
<h2>Hours and euros: two separate tests</h2>
<p>The earnings limit only says how much money is allowed without a deduction. Whether you have reduced earning capacity at all depends on how many hours a day you can work on the general labour market: under three for full, three to under six for partial (${h.src('sgb6_43', 'section 43 SGB VI')}). A job of a few hours a week does not contradict the finding; a part-time post of 25 hours a week, five hours on five days, does not fit a finding of “under three hours a day”, even if the pay stays below ${h.eur(gVoll, 2)}.</p>
<h2>How the disability pension itself is built</h2>
<p>You need five years of qualifying periods and three years of compulsory contributions in the five years before the reduced capacity began; insurance periods in other EU and EEA countries and Switzerland count towards the qualifying period (${h.src('vo883', 'Regulation (EC) No 883/2004')}). The pension is calculated as if you had kept working until the end of the added period (Zurechnungszeit); for a start in 2026 that is ${zJ} years and ${zM} months (${h.src('sgb6_253a', 'section 253a SGB VI')}). The reduction has its own rules: the reference age is ${h.P.zugangsfaktor.em_referenzalter}, and at most ${h.pct(maxAb, 1)} is deducted (${h.src('sgb6_77', 'section 77 SGB VI')}). A simplified example with 25 points at onset at age 50 gives about ${h.eur(bsp.rente)} full and ${h.eur(bspTeil.rente)} partial disability pension; the tool uses your average points since age 17, while the pension insurer assesses in more detail. The ${h.a('erwerbsminderungsrente', 'disability pension calculator')} takes your figures.</p>
<h2>After switching to an old-age pension</h2>
<p>Old-age pensions have no earnings limit (${h.src('drvWerte', 'pension insurance figures')}). What applies to working on an old-age pension, including the Aktivrente after the standard retirement age, is explained under ${h.a('hinzuverdienst', 'working alongside the pension')}. If a surviving spouse with their own disability pension also draws a widow’s pension, the disability pension counts as income there; see ${h.a('witwenrente-einkommen', 'widow’s pension and your own income')}.</p>`,
  },
});
