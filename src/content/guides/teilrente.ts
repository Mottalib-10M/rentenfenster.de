import { defineGuide } from '../../lib/guide-types';
import { abschlag, optionen, fmtMonat } from '../../lib/engine/alter';
import { epAusBrutto, besteuerungsanteil } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/** Teilrente (§ 42 SGB VI): Jahrgang 1964, Vollrente ohne Abschlag 1.600 €, drei Wege ab 63. Alles aus dem Motor. */
const RW = P.rentenwert.ab_2026_07;
const VOLL = 1600;
const g = { jahr: 1964, monat: 6, tag: 15 };
const lj = optionen(g, { wz35: true, wz45: false, schwb: false }).find((o) => o.art === 'langjaehrig')!;
const sb = optionen(g, { wz35: true, wz45: false, schwb: true }).find((o) => o.art === 'schwb')!;
const a63 = abschlag(lj.monate);           // 48 Monate
const a65 = abschlag(24);                  // Rest ab 65
const MIN = 0.1;
// Weg A: volle Rente ab 63
const vollFrueh = VOLL * (1 - a63);
// Weg B: halbe Teilrente ab 63, Rest ab 67 ohne Abschlag
const halbFrueh = VOLL * 0.5 * (1 - a63);
const wegB = halbFrueh + VOLL * 0.5;
// Weg C: halbe Teilrente ab 63, Rest ab 65
const wegC = halbFrueh + VOLL * 0.5 * (1 - a65);
// Zehn-Prozent-Teilrente ab 63, Rest ab 67
const zehnFrueh = VOLL * MIN * (1 - a63);
const wegD = zehnFrueh + VOLL * (1 - MIN);
const vorsprungA = vollFrueh * 48, vorsprungB = halbFrueh * 48;
const aufholB = (vorsprungA - vorsprungB) / (wegB - vollFrueh);
const epTZ = epAusBrutto(25000);
const plusTZ = epTZ * 4 * RW;
const anteil27 = besteuerungsanteil(2027);

export default defineGuide({
  id: 'teilrente',
  group: 'hoehe',
  order: 140,
  mini: 'teilrente',
  miniHref: 'abschlag-rechner',
  related: ['rente-mit-63', 'hinzuverdienst', 'langjaehrig-versicherte', 'abschlag-rechner', 'schwerbehinderte', 'rentenreform', 'fruehrente'],
  sources: ['sgb6_42', 'sgb6_36', 'sgb6_37', 'sgb6_77', 'sgb6_66', 'drvWerte', 'estg_22', 'bmasKommission'],
  de: {
    slug: 'teilrente',
    nav: 'Teilrente',
    card: 'Ab 63 nur einen Teil der Rente nehmen: Der Abschlag trifft nur diesen Teil, der Rest kommt später.',
    title: 'Teilrente mit 63 (2026): Abschlag nur auf den bezogenen Teil',
    description: `Teilrente mit 63 im Jahr 2026: mindestens ${DE.pct(MIN, 0)} der Vollrente, Abschlag nur auf den bezogenen Teil, Rest später mit weniger Abzug. Rechenbeispiel Flexirente.`,
    h1: 'Teilrente mit 63: weniger Rente nehmen, weniger Abschlag zahlen',
    intro: 'Statt mit 63 die ganze Rente mit vollem Abschlag zu nehmen, lässt sich ein Teil beziehen und der Rest aufheben. Was das bringt, zeigt ein durchgerechnetes Beispiel.',
    resume: `Die Teilrente ist eine Altersrente, von der Sie nur einen Teil beziehen, mindestens ${DE.pct(MIN, 0)} der Vollrente (§ 42 SGB VI). Möglich ist sie bei jeder Altersrente, also auch ab 63 bei der Rente für langjährig Versicherte nach 35 Jahren. Der Vorteil liegt im Abschlag: Er trifft nur den Teil, den Sie früh beziehen. Der Rest wird später gezahlt, mit dem dann geltenden, kleineren Abschlag oder ganz ohne, wenn Sie bis zur Regelaltersgrenze warten. Ein Beispiel für den Jahrgang 1964 mit 1.600 € Vollrente ohne Abschlag: Die ganze Rente ab 63 bringt lebenslang ${DE.eur(vollFrueh, 2)}. Wer ab 63 nur die Hälfte nimmt, erhält ${DE.eur(halbFrueh, 2)} und ab 67 zusammen ${DE.eur(wegB, 2)}. Weil es seit 2023 keine Hinzuverdienstgrenze für Altersrenten mehr gibt, ist die Teilrente kein Schutz vor Kürzungen mehr, sondern ein Werkzeug, um Teilzeit und Rente zu kombinieren, oft „Flexirente“ genannt. Die Wahl ist vor allem eine Frage der Lebenserwartung.`,
    faqs: [
      { q: 'Kann ich mit 63 eine Teilrente nehmen und weiter Teilzeit arbeiten?', a: `Ja, wenn Sie die 35 Jahre für die Altersrente für langjährig Versicherte erfüllen. Den Anteil wählen Sie selbst, mindestens ${DE.pct(MIN, 0)} der Vollrente. Der Lohn kürzt die Teilrente nicht, weil es für Altersrenten seit 2023 keine Hinzuverdienstgrenze mehr gibt. Zahlen Sie aus der Teilzeit Beiträge, entstehen neue Entgeltpunkte, die jeweils zum 1. Juli des Folgejahres hinzukommen.` },
      { q: 'Wie hoch ist der Abschlag bei einer Teilrente?', a: `Auf den bezogenen Teil derselbe wie bei einer vollen Rente zum gleichen Zeitpunkt: ${DE.pct(P.zugangsfaktor.abschlag_monat, 1)} je Monat vor der Regelaltersgrenze, ab Jahrgang 1964 mit 63 also ${DE.pct(a63, 1)}. Der nicht bezogene Teil bekommt seinen eigenen Abschlag erst, wenn Sie ihn später abrufen. Nehmen Sie ihn mit 65, sind es ${DE.pct(a65, 1)}, mit der Regelaltersgrenze gar keiner.` },
      { q: 'Ist Flexirente dasselbe wie Teilrente?', a: 'Flexirente ist kein Rechtsbegriff, sondern ein Sammelname für den gleitenden Übergang in die Rente. Im Kern geht es um die Teilrente nach § 42 SGB VI und die Möglichkeit, daneben unbegrenzt zu arbeiten. Wer heute von Flexirente spricht, meint meist genau diese Kombination: einen frei gewählten Teil der Altersrente plus Teilzeitlohn, der Rest der Rente folgt später.' },
      { q: 'Wann lohnt sich die halbe Rente ab 63 gegenüber der vollen?', a: `Wenn die Rente lange läuft. Im Beispiel dieser Seite bringt die volle Rente bis 67 zusammen ${DE.eur(vorsprungA - vorsprungB)} mehr. Danach liegt die Teilrenten-Variante jeden Monat ${DE.eur(wegB - vollFrueh, 2)} vorn. Der Vorsprung ist nach rund ${DE.num(aufholB / 12)} Jahren aufgeholt, also mit Anfang 90. Der eigentliche Vorteil ist deshalb oft weniger die Summe als die Kombination mit Teilzeitlohn.` },
      { q: 'Zählen Arbeitsjahre im EU-Ausland für die Teilrente ab 63 mit?', a: 'Für die 35 Jahre ja. Nach der Verordnung 883/2004 werden Versicherungszeiten aus anderen EU- und EWR-Staaten und der Schweiz mit den deutschen Zeiten zusammengerechnet, wenn es um Wartezeiten geht. Die Höhe der Teilrente ergibt sich aber nur aus Ihren deutschen Entgeltpunkten. Wer lange im Ausland gearbeitet hat, kann also früh anspruchsberechtigt sein und trotzdem nur eine kleine deutsche Teilrente beziehen.' },
      { q: 'Gibt es die Teilrente auch nach 45 Beitragsjahren?', a: `Ja, jede Altersrente lässt sich als Teilrente beziehen, auch die Rente für besonders langjährig Versicherte. Ab Jahrgang 1964 beginnt sie mit 65 Jahren ohne Abschlag, ein Teilbezug spart dann keinen Abschlag mehr. Er kann trotzdem sinnvoll sein, wenn Sie Ihre Arbeitszeit schrittweise verringern und die Steuerlast in den Jahren mit Lohn klein halten wollen. Den Rest der Rente rufen Sie ab, wenn die Arbeit endet.` },
    ],
    body: (h) => `
<h2>Was eine Teilrente ist</h2>
<p>Jede Altersrente lässt sich ganz oder teilweise beziehen (${h.src('sgb6_42', '§ 42 SGB VI')}). Die Teilrente ist also keine eigene Rentenart, sondern eine Bezugsform: Sie haben Anspruch auf eine Altersrente, etwa ab 63 nach 35 Jahren (${h.src('sgb6_36', '§ 36')}) oder als schwerbehinderter Mensch (${h.src('sgb6_37', '§ 37')}), und rufen davon nur einen Teil ab, mindestens ${h.pct(MIN, 0)}. Wer seine Altersgrenzen noch nicht kennt, findet sie im ${h.a('rentenbeginn-rechner', 'Rentenfenster')}.</p>
<p>Entscheidend ist, wie der Abschlag verteilt wird. Der früh bezogene Teil trägt den Abschlag dieses frühen Beginns, ${h.pct(P.zugangsfaktor.abschlag_monat, 1)} je Monat vor der Regelaltersgrenze (${h.src('sgb6_77', '§ 77 SGB VI')}). Der nicht bezogene Teil bleibt unberührt und wird erst bewertet, wenn Sie ihn abrufen. Der Abschlag sinkt also mit jedem Monat, den Sie mit dem Rest warten.</p>
<h2>Drei Wege ab 63 im Vergleich</h2>
<p>Das Beispiel: geboren am 15. Juni 1964, 35 Versicherungsjahre, Vollrente ohne Abschlag 1.600 € brutto. Frühestmöglicher Beginn ist der ${fmtMonat(lj.frueh, 'de')}, abschlagsfrei ab dem ${fmtMonat(lj.voll, 'de')}, dazwischen liegen ${h.num(lj.monate)} Monate.</p>
${h.table(['Weg', 'Rente von 63 bis 65', 'von 65 bis 67', 'ab 67 lebenslang'], [
      ['Volle Rente ab 63', h.eur(vollFrueh, 2), h.eur(vollFrueh, 2), h.eur(vollFrueh, 2)],
      ['Halbe Teilrente ab 63, Rest ab 67', h.eur(halbFrueh, 2), h.eur(halbFrueh, 2), h.eur(wegB, 2)],
      ['Halbe Teilrente ab 63, Rest ab 65', h.eur(halbFrueh, 2), h.eur(wegC, 2), h.eur(wegC, 2)],
      [`Teilrente ${h.pct(MIN, 0)} ab 63, Rest ab 67`, h.eur(zehnFrueh, 2), h.eur(zehnFrueh, 2), h.eur(wegD, 2)],
    ], 'Jahrgang 1964, Vollrente 1.600 € ohne Abschlag, ohne neue Entgeltpunkte und ohne Rentenanpassungen', ['l', 'r', 'r', 'r'])}
<p>Die volle Rente ab 63 trägt dauerhaft ${h.pct(a63, 1)} Abschlag. Bei der halben Teilrente trägt ihn nur die eine Hälfte; die andere Hälfte kommt mit 67 ohne Abzug oder mit 65 mit ${h.pct(a65, 1)}. Die Variante mit ${h.pct(MIN, 0)} kommt dem Weiterarbeiten bis 67 am nächsten und behält fast die ganze Rente abschlagsfrei, liefert aber bis dahin nur ein kleines Zubrot.</p>
<h2>Was der Vorsprung kostet</h2>
<p>Bis 67 zahlt die volle Rente ${h.eur(vorsprungA)} aus, die halbe Teilrente ${h.eur(vorsprungB)}. Ab 67 liegt die Teilrenten-Variante dagegen ${h.eur(wegB - vollFrueh, 2)} im Monat vorn. Der Unterschied ist erst nach rund ${h.num(aufholB / 12)} Jahren aufgeholt. Rein rechnerisch gewinnt also meist die volle Frührente, solange niemand sehr alt wird. Die Teilrente spielt ihre Stärke anders aus: Sie erlaubt, die Arbeitszeit zu verringern, ohne den vollen Abschlag auf die ganze Rente in Kauf zu nehmen, und sie hält die Steuerlast in den Jahren mit Lohn niedriger.</p>
<h2>Teilzeitlohn erhöht die spätere Rente</h2>
<p>Wer neben der Teilrente beschäftigt ist und Beiträge zahlt, sammelt weiter Entgeltpunkte. Sie werden jeweils zum 1. Juli des Folgejahres der Rente zugeschlagen (${h.src('sgb6_66', '§ 66 Abs. 3a SGB VI')}). Mit 25.000 € Teilzeitlohn im Jahr sind das ${h.num(epTZ, 4)} Punkte je Jahr, nach vier Jahren ${h.eur(plusTZ, 2)} mehr Monatsrente zum heutigen Rentenwert. Eine Hinzuverdienstgrenze gibt es für Altersrenten nicht mehr (${h.src('drvWerte', 'Werte der Rentenversicherung')}); auch eine volle Rente plus Lohn wäre also erlaubt. Was neben der Rente erlaubt und steuerlich begünstigt ist, steht unter ${h.a('hinzuverdienst', 'Hinzuverdienst zur Rente')}.</p>
<h2>Mit Schwerbehinderung: früher und günstiger</h2>
<p>Wer einen Grad der Behinderung von mindestens 50 hat, kann die Altersrente für schwerbehinderte Menschen ab Jahrgang 1964 schon ab 62 beziehen und mit 65 ohne Abschlag. Im Beispiel liegt der früheste Beginn beim ${fmtMonat(sb.frueh, 'de')}, der Abschlag bei höchstens ${h.pct(sb.abschlag, 1)}. Auch diese Rente lässt sich als Teilrente nehmen, mit entsprechend kleinerem Abzug. Einzelheiten unter ${h.a('schwerbehinderte', 'Altersrente für Schwerbehinderte')}.</p>
<h2>Steuer und Abgaben auf die Teilrente</h2>
<p>Auch von einer Teilrente gehen Kranken- und Pflegebeitrag ab, und sie ist mit dem Besteuerungsanteil ihres Startjahres steuerpflichtig (${h.src('estg_22', '§ 22 EStG')}); für einen Beginn 2027 sind das ${h.pct(anteil27, 1)}. Weil die Teilrente kleiner ist als die volle Rente, bleibt in den Jahren mit Lohn mehr vom Grundfreibetrag frei. Den genauen Betrag rechnet der ${h.a('rentenrechner-brutto-netto', 'Rentenrechner brutto netto')}.</p>
<h2>Was die Reformvorschläge ändern könnten</h2>
<p>Die Alterssicherungskommission hat im Juni 2026 empfohlen, die Altersrente nach 35 Jahren erst ab 64 zu öffnen und die Altersteilzeit ab 58 statt ab 55 zu erlauben, ohne Blockmodell (${h.src('bmasKommission', 'BMAS, 33 Empfehlungen')}). Das sind Vorschläge, kein geltendes Recht; ein Gesetzentwurf ist nicht veröffentlicht. Sollten sie Gesetz werden, verschöbe sich auch der früheste Beginn einer Teilrente nach 35 Jahren. Der Stand der Debatte: ${h.a('rentenreform', 'Rentenreform')}. Den Abschlag für jeden denkbaren Startmonat zeigt der ${h.a('abschlag-rechner', 'Abschlagsrechner')}.</p>`,
  },
  en: {
    slug: 'partial-pension',
    nav: 'Partial pension',
    card: 'Draw only part of your German pension from 63: the reduction hits that part only, the rest comes later.',
    title: 'Partial Pension 2026: Draw Part of a German Pension From 63',
    description: `Partial pension 2026: draw at least ${EN.pct(MIN, 0)} of your German old-age pension from 63, the reduction only on that part, the rest later. Flexirente worked example.`,
    h1: 'Partial pension in Germany: draw less, lose less to the reduction',
    intro: 'Instead of taking the whole pension at 63 with the full reduction, you can draw part of it and keep the rest for later. A worked example shows what that achieves for someone winding down in Germany.',
    resume: `A partial pension (Teilrente) is an old-age pension of which you draw only part, at least ${EN.pct(MIN, 0)} of the full amount (section 42 SGB VI). It works with any old-age pension, including the pension for long-term insured persons from 63 after 35 years. Its advantage lies in the early-retirement reduction (Abschlag): it applies only to the part you draw early. The rest is paid later with the smaller reduction then due, or none if you wait until the standard retirement age. Example for someone born in 1964 with a full unreduced pension of €1,600: taking the whole pension at 63 pays ${EN.eur(vollFrueh, 2)} for life. Drawing half from 63 pays ${EN.eur(halbFrueh, 2)}, and ${EN.eur(wegB, 2)} from 67 once the other half is added. Since old-age pensions have had no earnings cap since 2023, the partial pension no longer protects against cuts; it is a tool for combining part-time work with a pension, often called “Flexirente”. Periods worked in other EU countries can help you reach the 35 years, but the German amount covers German periods only.`,
    faqs: [
      { q: 'Can I take a partial German pension at 63 and keep working part-time?', a: `Yes, if you meet the 35 years for the pension for long-term insured persons. You choose the share yourself, at least ${EN.pct(MIN, 0)} of the full pension. Your pay does not reduce it, since old-age pensions have had no earnings cap since 2023. If contributions are paid on your part-time pay, new points are added each 1 July of the following year.` },
      { q: 'What reduction applies to a partial pension?', a: `On the part you draw, the same as on a full pension starting then: ${EN.pct(P.zugangsfaktor.abschlag_monat, 1)} per month before the standard age, ${EN.pct(a63, 1)} at 63 for anyone born from 1964. The undrawn part is assessed only when you claim it. Take it at 65 and it carries ${EN.pct(a65, 1)}; wait until the standard age and it carries none.` },
      { q: 'What does Flexirente mean in Germany?', a: 'It is not a legal term but a popular label for a gradual move into retirement. At its core are the partial pension under section 42 SGB VI and the freedom to earn without limit alongside it. When people talk about a Flexirente today, they usually mean exactly that mix: a freely chosen share of the old-age pension plus part-time pay, with the rest of the pension later.' },
      { q: 'Do years worked in other EU countries count towards a partial pension at 63?', a: 'They can count towards the 35 years. Under Regulation 883/2004, insurance periods in other EU and EEA states and Switzerland are added to German periods to check qualifying periods. The partial pension itself is then calculated only from your German points, so the amount you draw at 63 reflects your German career, not your whole working life.' },
      { q: 'Is half a pension at 63 better than the full pension?', a: `Only if the pension runs for a long time. In the example on this page the full pension pays ${EN.eur(vorsprungA - vorsprungB)} more by 67. From then on, the partial route is ${EN.eur(wegB - vollFrueh, 2)} ahead each month and catches up after about ${EN.num(aufholB / 12)} years, around age 90. The real gain is often not the total but the combination with part-time pay.` },
    ],
    body: (h) => `
<h2>What a partial pension is</h2>
<p>Every German old-age pension can be drawn in full or in part (${h.src('sgb6_42', 'section 42 SGB VI')}). The partial pension is not a separate pension type but a way of drawing one: you are entitled to an old-age pension, say from 63 after 35 years (${h.src('sgb6_36', 'section 36')}) or as a severely disabled person (${h.src('sgb6_37', 'section 37')}), and claim only part of it, at least ${h.pct(MIN, 0)}. If you do not yet know your age limits, the ${h.a('rentenbeginn-rechner', 'retirement date calculator')} shows them.</p>
<p>What matters is how the reduction is split. The part drawn early carries the reduction for that early start, ${h.pct(P.zugangsfaktor.abschlag_monat, 1)} per month before the standard retirement age (${h.src('sgb6_77', 'section 77 SGB VI')}). The undrawn part is untouched and assessed only when you claim it, so its reduction shrinks with every month you wait.</p>
<h2>Three routes from 63 compared</h2>
<p>The example: born 15 June 1964, 35 insured years, full unreduced pension of €1,600 gross. The earliest start is ${fmtMonat(lj.frueh, 'en')}, unreduced from ${fmtMonat(lj.voll, 'en')}, ${h.num(lj.monate)} months apart.</p>
${h.table(['Route', 'Pension 63 to 65', '65 to 67', 'From 67, for life'], [
      ['Full pension from 63', h.eur(vollFrueh, 2), h.eur(vollFrueh, 2), h.eur(vollFrueh, 2)],
      ['Half from 63, rest from 67', h.eur(halbFrueh, 2), h.eur(halbFrueh, 2), h.eur(wegB, 2)],
      ['Half from 63, rest from 65', h.eur(halbFrueh, 2), h.eur(wegC, 2), h.eur(wegC, 2)],
      [`${h.pct(MIN, 0)} from 63, rest from 67`, h.eur(zehnFrueh, 2), h.eur(zehnFrueh, 2), h.eur(wegD, 2)],
    ], 'Born 1964, full pension €1,600 unreduced, no new points and no pension increases', ['l', 'r', 'r', 'r'])}
<p>The full pension from 63 carries ${h.pct(a63, 1)} for life. With half a pension, only that half carries it; the other half arrives at 67 with no reduction or at 65 with ${h.pct(a65, 1)}. The ${h.pct(MIN, 0)} route comes closest to working on until 67 and keeps almost all of the pension unreduced, but pays only a small extra until then.</p>
<h2>What the head start costs</h2>
<p>By 67 the full pension pays out ${h.eur(vorsprungA)}, the half pension ${h.eur(vorsprungB)}. From 67, however, the partial route is ${h.eur(wegB - vollFrueh, 2)} a month ahead, and it takes about ${h.num(aufholB / 12)} years to close the gap. On the numbers alone, the full early pension usually wins unless you live very long. The partial pension’s strength lies elsewhere: you can cut your hours without accepting the full reduction on the whole pension, and your tax bill stays lower in the years you still earn.</p>
<h2>Part-time pay raises the later pension</h2>
<p>If you work in employment alongside a partial pension and contributions are paid, you keep collecting pension points (Entgeltpunkte). They are added each 1 July of the following year (${h.src('sgb6_66', 'section 66(3a) SGB VI')}). On €25,000 of part-time pay that is ${h.num(epTZ, 4)} points a year, and after four years ${h.eur(plusTZ, 2)} more monthly pension at today’s value. Old-age pensions have no earnings cap any more (${h.src('drvWerte', 'German Pension Insurance key values')}), so a full pension plus pay would also be allowed. What is allowed alongside a pension, and what is tax-favoured, is on ${h.a('hinzuverdienst', 'working while drawing a pension')}.</p>
<h2>For expats winding down in Germany</h2>
<p>A partial pension depends on qualifying for a German old-age pension first. For the route from 63 you need 35 years, and insurance periods in other EU and EEA states or Switzerland can be added to reach them. The amount, however, comes only from your German points: someone with 20 German years and 15 years in France may qualify at 63 yet draw a modest German partial pension. Whether your other country offers a comparable phased option depends on its own rules.</p>
<h2>With a severe disability: earlier and cheaper</h2>
<p>With a recognised degree of disability of at least 50, the pension for severely disabled persons is open from 62 for anyone born from 1964 and unreduced at 65. In the example the earliest start is ${fmtMonat(sb.frueh, 'en')}, with a reduction of at most ${h.pct(sb.abschlag, 1)}. It too can be taken as a partial pension, with a correspondingly smaller cut. Details under ${h.a('schwerbehinderte', 'pension with a severe disability')}.</p>
<h2>Tax and contributions on a partial pension</h2>
<p>Health and long-term care contributions come off a partial pension like any other, and it is taxable at the share for its start year (${h.src('estg_22', 'section 22 EStG')}): ${h.pct(anteil27, 1)} for a start in 2027. Because it is smaller than the full pension, more of the basic tax allowance stays free in the years you still earn. The ${h.a('rentenrechner-brutto-netto', 'net pension calculator')} gives the exact figure.</p>
<h2>What the reform proposals could change</h2>
<p>In June 2026 the pension commission recommended opening the 35-year pension only from 64 and allowing partial retirement schemes for employees (Altersteilzeit) from 58 instead of 55, without the block model (${h.src('bmasKommission', 'Federal Labour Ministry, 33 recommendations')}). These are proposals, not law; no draft bill has been published. If enacted, the earliest start for a partial pension after 35 years would move too. The state of play is on ${h.a('rentenreform', 'pension reform')}; the ${h.a('abschlag-rechner', 'reduction calculator')} shows the reduction for any start month.</p>`,
  },
});
