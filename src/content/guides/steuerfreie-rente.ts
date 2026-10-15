import { defineGuide } from '../../lib/guide-types';
import { steuerfreieGrenze, nettoStandard, netto, besteuerungsanteil, type NettoEingabe } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Ab welcher Bruttorente Einkommensteuer anfällt: steuerfreieGrenze() je Startjahr 2020 bis 2035 (Tarif 2026),
 * Varianten verheiratet und kinderlos per Bisektion über netto(), Beispiele 1.300 € bis 2.500 € (Annahmen).
 */
const S = P.steuer;
const basis: Omit<NettoEingabe, 'brutto'> = { zusatz: P.kv.zusatz_durchschnitt_2026, kinderlos: false, startjahr: 2026, weitere: 0, verheiratet: false, partner: 0, kirche: 0 };
/** Gleiche Suche wie steuerfreieGrenze(), aber mit abweichenden Angaben. */
const grenzeMit = (o: Partial<NettoEingabe>) => {
  let lo = 0, hi = 6000;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (netto({ ...basis, ...o, brutto: m }).est > 0) hi = m; else lo = m; }
  return Math.floor(lo);
};
const g26 = steuerfreieGrenze(2026);
const g30 = steuerfreieGrenze(2030);
const g35 = steuerfreieGrenze(2035);
const g20 = steuerfreieGrenze(2020);
const gVerh = grenzeMit({ verheiratet: true });
const gKl = grenzeMit({ kinderlos: true });
/** Varianten des Standardfalls (Zusatzbeiträge 2,0 % und 3,5 % sind Annahmen). */
const varianten = [
  { de: 'Standardfall', en: 'Standard case', g: steuerfreieGrenze(2026) },
  { de: 'ohne Kinder', en: 'no children', g: gKl },
  { de: 'Zusatzbeitrag 2,0 %', en: 'extra rate 2.0%', g: grenzeMit({ zusatz: 0.02 }) },
  { de: 'Zusatzbeitrag 3,5 %', en: 'extra rate 3.5%', g: grenzeMit({ zusatz: 0.035 }) },
  { de: 'verheiratet, eine Rente', en: 'married, one pension', g: gVerh },
  { de: 'mit 2.000 € weiteren Einkünften im Jahr', en: 'with €2,000 other income a year', g: grenzeMit({ weitere: 2000 }) },
];
const amRand = nettoStandard(g26, 2026);
const reihe = Array.from({ length: 16 }, (_, i) => 2020 + i).map((j) => ({ j, a: besteuerungsanteil(j), g: steuerfreieGrenze(j) }));
const beispiele = [1500, 1700, 1800, 2000, 2500].map((r) => ({ r, n: nettoStandard(r) }));
const b18 = beispiele[2].n;
const solo1300 = nettoStandard(1300);
const mit3000 = netto({ ...basis, brutto: 1300, weitere: 3000 });
const kirche = netto({ ...basis, brutto: 1700, kirche: S.kirchensteuer.andere });
const vorJuli = 1420;
const nachJuli = vorJuli * (1 + P.rentenwert.anpassung_2026);
const nJuli = nettoStandard(nachJuli);

export default defineGuide({
  id: 'steuerfreie-rente',
  group: 'netto',
  order: 120,
  mini: 'steuerGrenze',
  miniHref: 'rente-steuer-rechner',
  related: ['besteuerung-rente', 'rente-steuer-rechner', 'rentenrechner-brutto-netto', 'hinzuverdienst', 'krankenversicherung-rentner', 'rentenwert-2026'],
  sources: ['estg_32a', 'estg_22', 'estg_9a', 'estg_10c', 'estg_10', 'solzg_3', 'estg_3', 'sgb11_55'],
  de: {
    slug: 'rente-steuerfrei-bis',
    nav: 'Rente steuerfrei bis',
    card: `Bei Rentenbeginn 2026 bleibt eine Bruttorente bis etwa ${DE.eur(g26)} im Monat ohne Einkommensteuer.`,
    title: 'Steuerfreie Rente 2026: Grenze je Jahr des Rentenbeginns',
    description: `Steuerfreie Rente 2026: Mit Rentenbeginn 2026 bleibt eine Bruttorente bis etwa ${DE.eur(g26)} im Monat ohne Einkommensteuer. Grenzen für Startjahre 2020 bis 2035.`,
    h1: 'Wie viel Rente ist steuerfrei? Die Grenze 2026',
    intro: 'Die Grenze hängt vor allem am Jahr Ihres Rentenbeginns und daran, ob Sie allein oder gemeinsam mit dem Ehepartner veranlagt werden.',
    resume: `Wer 2026 in Rente geht, alleinstehend ist, Kinder hat und außer der gesetzlichen Rente keine Einkünfte hat, zahlt bis zu einer Bruttorente von etwa ${DE.eur(g26)} im Monat keine Einkommensteuer. So viel ergibt die Rechnung mit dem Tarif 2026: Steuerpflichtig sind ${DE.pct(besteuerungsanteil(2026))} der Jahresrente; davon gehen ${DE.eur(S.wk_pauschbetrag_rente)} Werbungskosten, ${DE.eur(S.sa_pauschbetrag)} Sonderausgaben sowie die Kranken- und Pflegebeiträge ab, und der Rest bleibt unter dem Grundfreibetrag von ${DE.eur(S.grundfreibetrag)}. Je später die Rente beginnt, desto niedriger liegt die Grenze, weil der steuerpflichtige Anteil wächst: bei Beginn 2030 etwa ${DE.eur(g30)}, bei Beginn 2035 etwa ${DE.eur(g35)}. Verheiratete mit nur einer Rente bleiben dank Splitting bis etwa ${DE.eur(gVerh)} steuerfrei. Über der Grenze beginnt die Steuer langsam: ${DE.eur(beispiele[0].n.steuerJahr)} im Jahr bei 1.500 €, ${DE.eur(b18.steuerJahr)} bei 1.800 €. Betriebsrenten, Mieten oder Zinsen kommen hinzu und senken die Grenze.`,
    faqs: [
      { q: 'Wie viel Rente ist steuerfrei, wenn ich 2026 in Rente gehe?', a: `Im Standardfall bis etwa ${DE.eur(g26)} brutto im Monat. Dieser Wert gilt für Alleinstehende mit Kindern, durchschnittlichem Zusatzbeitrag der Krankenkasse und ohne weitere Einkünfte. Ohne Kinder liegt er bei etwa ${DE.eur(gKl)}, weil der höhere Pflegebeitrag als Sonderausgabe abgezogen wird. Mit einer Betriebsrente, Mieteinnahmen oder Kapitalerträgen sinkt die Grenze entsprechend.` },
      { q: 'Bis zu welcher Rente zahlen Ehepaare keine Einkommensteuer?', a: `Bei gemeinsamer Veranlagung verdoppelt das Splitting den Grundfreibetrag. Lebt das Paar von einer einzigen gesetzlichen Rente mit Beginn 2026, bleibt sie bis etwa ${DE.eur(gVerh)} brutto im Monat steuerfrei. Beziehen beide eine Rente, zählen beide steuerpflichtigen Teile zusammen; die Grenze gilt dann für die Summe, nicht für jede Rente einzeln.` },
      { q: 'Wie viel Einkommensteuer fällt bei 1.800 € Rente an?', a: `Bei Rentenbeginn 2026, alleinstehend und ohne weitere Einkünfte, sind es ${DE.eur(b18.steuerJahr)} im Jahr, also rund ${DE.eur(b18.steuerJahr / 12)} im Monat. Das zu versteuernde Einkommen liegt bei ${DE.eur(b18.zve)}, knapp ${DE.eur(b18.zve - S.grundfreibetrag)} über dem Grundfreibetrag. Die Steuer wird nicht von der Rente abgezogen, sondern mit dem Steuerbescheid fällig.` },
      { q: 'Zählen Betriebsrente und Mieteinnahmen bei der Steuergrenze mit?', a: `Ja. Alle steuerpflichtigen Einkünfte werden addiert, nach ihren eigenen Freibeträgen und Werbungskosten. Eine gesetzliche Rente von 1.300 € mit Beginn 2026 bleibt allein steuerfrei (${DE.eur(solo1300.steuerJahr)}). Kommen 3.000 € weitere steuerpflichtige Einkünfte im Jahr hinzu, steigt das zu versteuernde Einkommen auf ${DE.eur(mit3000.zve)}, und es fallen ${DE.eur(mit3000.steuerJahr)} Steuer an.` },
      { q: 'Ist Arbeitslohn nach Erreichen der Regelaltersgrenze steuerfrei?', a: `Bis zu ${DE.eur(S.aktivrente_jahr)} im Jahr kann er es sein (Aktivrente, § 3 Nr. 21 EStG). Die Befreiung gilt ab dem Monat nach Erreichen der Regelaltersgrenze, nur für Arbeitnehmer, nicht für Selbstständige, und verringert sich für jeden Monat ohne die Voraussetzungen um ein Zwölftel. Die Rente selbst bleibt mit ihrem Anteil steuerpflichtig; nur der Lohn ist begünstigt.` },
      { q: 'Zahlen Rentner Solidaritätszuschlag und Kirchensteuer?', a: `Den Solidaritätszuschlag kaum: Er greift erst, wenn die Einkommensteuer ${DE.eur(S.soli_freigrenze_einzel)} im Jahr übersteigt, bei Ehepaaren ${DE.eur(S.soli_freigrenze_zusammen)}. Kirchensteuer zahlen Mitglieder, sobald Einkommensteuer anfällt: ${DE.pct(S.kirchensteuer.by_bw, 0)} in Bayern und Baden-Württemberg, sonst ${DE.pct(S.kirchensteuer.andere, 0)}. Bei 1.700 € Rente mit Beginn 2026 sind das ${DE.eur(kirche.kist, 2)} im Jahr.` },
    ],
    body: (h) => `
<h2>Der Standardfall hinter der Grenze</h2>
<p>Eine Zahl wie „${h.eur(g26)} steuerfrei“ gilt nur unter Annahmen. Der Mini-Rechner oben und diese Seite rechnen mit dem Standardfall: alleinstehend, mindestens ein Kind, gesetzlich krankenversichert mit dem durchschnittlichen Zusatzbeitrag von ${h.pct(h.P.kv.zusatz_durchschnitt_2026, 1)}, keine Kirchensteuer, keine weiteren Einkünfte, Tarif 2026. So sieht die Rechnung genau an der Grenze aus:</p>
${h.table(['Schritt', 'Betrag im Jahr'], [
  ['Bruttorente (12 Monate)', h.eur(amRand.jahresrente)],
  [`Steuerpflichtiger Anteil (${h.pct(amRand.anteil, 0)})`, h.eur(amRand.steuerpflichtig)],
  ['minus Werbungskosten-Pauschbetrag', h.eur(h.P.steuer.wk_pauschbetrag_rente)],
  ['minus Sonderausgaben-Pauschbetrag', h.eur(h.P.steuer.sa_pauschbetrag)],
  ['minus Kranken- und Pflegebeiträge', h.eur(amRand.sozial * 12)],
  ['Zu versteuerndes Einkommen', h.eur(amRand.zve)],
  ['Einkommensteuer', h.eur(amRand.est)],
], `Rente von ${h.eur(g26)} im Monat, Beginn 2026`, ['l', 'r'])}
<p>Die Grundlagen: Besteuerungsanteil nach ${h.src('estg_22', '§ 22 EStG')}, Pauschbeträge nach ${h.src('estg_9a', '§ 9a')} und ${h.src('estg_10c', '§ 10c')}, Vorsorgeaufwendungen nach ${h.src('estg_10', '§ 10')}, Tarif nach ${h.src('estg_32a', '§ 32a EStG')}. Die Kranken- und Pflegebeiträge machen den größten Abzug aus; deshalb verschiebt der Pflegezuschlag für Kinderlose (${h.src('sgb11_55', '§ 55 SGB XI')}) die Grenze nach oben, auf etwa ${h.eur(gKl)}.</p>
<h2>Grenze nach Jahr des Rentenbeginns</h2>
${h.table(['Rentenbeginn', 'Steuerpflichtiger Anteil', 'Steuerfrei bis brutto im Monat', 'Im Jahr'], reihe.map((r) => [String(r.j), h.pct(r.a, 1), h.eur(r.g), h.eur(r.g * 12)]), 'Standardfall, Tarif und Beiträge 2026, Rente seit Beginn unverändert', ['l', 'r', 'r', 'r'])}
<p>Zwischen den Startjahren 2020 und 2035 sinkt die Grenze von ${h.eur(g20)} auf ${h.eur(g35)}. Für frühere Startjahre ist die Tabelle zu großzügig, wenn die Rente seither gestiegen ist: Der steuerfreie Teil wurde im Jahr nach dem Beginn in Euro eingefroren, jede Erhöhung danach ist voll steuerpflichtig. Wie das wirkt, zeigt ${h.a('besteuerung-rente', 'Besteuerung der Rente')}. Für künftige Startjahre gilt die Tabelle nur mit den Werten von 2026; Grundfreibetrag und Beitragssätze werden bis dahin andere sein.</p>
<h2>Was über der Grenze passiert</h2>
<p>Wer die Grenze überschreitet, zahlt nicht sofort viel. Besteuert wird nur, was über dem Grundfreibetrag liegt, und der Tarif beginnt in der ersten Zone mit niedrigen Sätzen.</p>
${h.table(['Rente brutto', 'Zu versteuern', 'Steuer im Jahr', 'Im Monat'], beispiele.map(({ r, n }) => [h.eur(r), h.eur(n.zve), h.eur(n.steuerJahr), h.eur(n.steuerJahr / 12, 2)]), 'Rentenbeginn 2026, Standardfall', ['r', 'r', 'r', 'r'])}
<p>Knapp über der Grenze zu liegen, ist deshalb kein Grund zur Sorge, aber ein Grund, die Steuererklärung nicht zu vergessen. Die Rentenversicherung behält keine Lohnsteuer ein; ohne Erklärung bleibt die Steuer offen, nicht erlassen. Mit eigenen Angaben, auch für Paare und mit weiteren Einkünften, rechnet der ${h.a('rente-steuer-rechner', 'Steuerrechner für Rentner')}.</p>
<h2>Rentenanpassung: über Nacht über die Grenze</h2>
<p>Die Grenze steht fest, die Rente nicht. Zum 1. Juli 2026 stieg der aktuelle Rentenwert um ${h.pct(h.P.rentenwert.anpassung_2026, 2)}. Eine Rente von ${h.eur(vorJuli)} wurde so zu ${h.eur(nachJuli, 2)}. Ein ganzes Jahr mit diesem Betrag ergibt bei Rentenbeginn 2026 eine Steuer von ${h.eur(nJuli.steuerJahr)}, obwohl der Betrag vor der Anpassung unter der Grenze lag. So geraten Rentner ohne eigenes Zutun in die Steuerpflicht, und jede weitere Anpassung vergrößert den Abstand. Den Stand des Rentenwerts erklärt ${h.a('rentenwert-2026', 'Rentenerhöhung 2026')}.</p>
<h2>Was die Grenze nach oben oder unten schiebt</h2>
${h.table(['Fall', 'Steuerfrei bis brutto im Monat', 'Abstand zum Standardfall'], varianten.map((v) => [v.de, h.eur(v.g), h.eur(v.g - g26)]), 'Rentenbeginn 2026, alle anderen Angaben wie im Standardfall', ['l', 'r', 'r'])}
<p>Die Tabelle zeigt, wie empfindlich die Grenze ist. Kleine Unterschiede bei der Krankenkasse verschieben sie nur um wenige Euro, weil höhere Beiträge zwar mehr Abzug bringen, aber nur zu einem Teil wirken. Die großen Hebel sind die Ehe und andere Einkünfte: Schon 2.000 € Mieteinnahmen oder Betriebsrente im Jahr drücken die Grenze deutlich nach unten, die gemeinsame Veranlagung mit einem Partner ohne Einkommen hebt sie fast auf das Doppelte.</p>
<p>Nach oben: die gemeinsame Veranlagung mit einem Ehepartner ohne eigenes Einkommen (bis etwa ${h.eur(gVerh)}), ein höherer Zusatzbeitrag der Krankenkasse oder der Pflegezuschlag ohne Kinder, weil höhere Beiträge mehr Abzug bedeuten. Nach unten: jedes weitere steuerpflichtige Einkommen, ein späteres Startjahr und, bei älteren Renten, die Erhöhungen seit dem Beginn. Wer nach der Regelaltersgrenze als Arbeitnehmer weiterarbeitet, kann den Lohn bis ${h.eur(h.P.steuer.aktivrente_jahr)} im Jahr steuerfrei verdienen (${h.src('estg_3', '§ 3 Nr. 21 EStG')}); die Bedingungen stehen unter ${h.a('hinzuverdienst', 'Hinzuverdienst und Aktivrente')}. Eine persönliche Steuerberatung ersetzt diese Rechnung nicht.</p>`,
  },
  en: {
    slug: 'tax-free-pension-limit',
    nav: 'Tax-free pension limit',
    card: `A German pension starting in 2026 stays free of income tax up to about ${EN.eur(g26)} gross a month.`,
    title: 'Tax-free pension limit 2026: when German pensioners pay tax',
    description: `Tax-free pension limit 2026: a German pension starting in 2026 is free of income tax up to about ${EN.eur(g26)} gross a month. Limits for start years 2020 to 2035.`,
    h1: 'How much of a German pension is tax-free in 2026?',
    intro: 'The limit depends mainly on the year your pension starts and on whether you are assessed alone or jointly with a spouse.',
    resume: `If you start a German statutory pension in 2026, are single, have children and have no other income, you pay no income tax (Einkommensteuer) up to a gross pension of about ${EN.eur(g26)} a month. That is what the 2026 tax schedule gives: ${EN.pct(besteuerungsanteil(2026))} of the annual pension is taxable; the tax office deducts ${EN.eur(S.wk_pauschbetrag_rente)} for expenses, ${EN.eur(S.sa_pauschbetrag)} for special expenses and your health and care contributions, and what remains stays below the basic allowance (Grundfreibetrag) of ${EN.eur(S.grundfreibetrag)}. The later the pension starts, the lower the limit, because the taxable share grows: about ${EN.eur(g30)} for a 2030 start and about ${EN.eur(g35)} for 2035. A married couple living on one pension stays tax-free up to about ${EN.eur(gVerh)} thanks to joint assessment. Above the limit, tax starts gently: ${EN.eur(beispiele[0].n.steuerJahr)} a year on €1,500 and ${EN.eur(b18.steuerJahr)} on €1,800. Company pensions, rent or interest are added and lower the limit.`,
    faqs: [
      { q: 'How much of my German pension is tax-free if I retire in 2026?', a: `In the standard case, up to about ${EN.eur(g26)} gross a month. That figure assumes you are single with children, pay the average extra health rate and have no other income. Without children it is about ${EN.eur(gKl)}, because the higher care contribution is deductible. A company pension, rental income or investment income lowers the limit accordingly.` },
      { q: 'Up to what pension does a married couple in Germany pay no income tax?', a: `Joint assessment (splitting) doubles the basic allowance. A couple living on a single statutory pension starting in 2026 stays tax-free up to about ${EN.eur(gVerh)} gross a month. If both draw pensions, both taxable parts are added together and the limit applies to the total, not to each pension separately.` },
      { q: 'How much income tax is due on a German pension of €1,800?', a: `For a pension starting in 2026, single, with no other income, ${EN.eur(b18.steuerJahr)} a year, about ${EN.eur(b18.steuerJahr / 12)} a month. Taxable income is ${EN.eur(b18.zve)}, about ${EN.eur(b18.zve - S.grundfreibetrag)} above the basic allowance. The tax is not deducted from the pension; it falls due with the tax assessment.` },
      { q: 'Do rental income and a company pension count towards the limit?', a: `Yes. All taxable income is added together, each after its own allowances and expenses. A statutory pension of €1,300 starting in 2026 stays tax-free on its own (${EN.eur(solo1300.steuerJahr)}). Add €3,000 of other taxable income a year and taxable income rises to ${EN.eur(mit3000.zve)}, with ${EN.eur(mit3000.steuerJahr)} of tax.` },
      { q: 'Are wages tax-free once I pass the standard retirement age?', a: `Up to ${EN.eur(S.aktivrente_jahr)} a year they can be, under the Aktivrente rule (section 3 no. 21 Income Tax Act). It applies from the month after you reach the standard retirement age, to employees only, not the self-employed, and is cut by one twelfth for each month in which the conditions are not met. The pension itself stays taxable at its share.` },
      { q: 'Do German pensioners pay solidarity surcharge and church tax?', a: `The surcharge hardly ever: it only applies once income tax exceeds ${EN.eur(S.soli_freigrenze_einzel)} a year, or ${EN.eur(S.soli_freigrenze_zusammen)} for a married couple. Church members pay church tax as soon as there is income tax: ${EN.pct(S.kirchensteuer.by_bw, 0)} in Bavaria and Baden-Württemberg, ${EN.pct(S.kirchensteuer.andere, 0)} elsewhere. On €1,700 starting in 2026 that is ${EN.eur(kirche.kist, 2)} a year.` },
    ],
    body: (h) => `
<h2>The standard case behind the figure</h2>
<p>A figure such as “${h.eur(g26)} tax-free” only holds under assumptions. The mini calculator above and this page use the standard case: single, at least one child, statutory health insurance at the average extra rate of ${h.pct(h.P.kv.zusatz_durchschnitt_2026, 1)}, no church tax, no other income, 2026 schedule. This is the calculation exactly at the limit:</p>
${h.table(['Step', 'Amount a year'], [
  ['Gross pension (12 months)', h.eur(amRand.jahresrente)],
  [`Taxable share (${h.pct(amRand.anteil, 0)})`, h.eur(amRand.steuerpflichtig)],
  ['minus flat expense allowance', h.eur(h.P.steuer.wk_pauschbetrag_rente)],
  ['minus flat special-expense allowance', h.eur(h.P.steuer.sa_pauschbetrag)],
  ['minus health and care contributions', h.eur(amRand.sozial * 12)],
  ['Taxable income', h.eur(amRand.zve)],
  ['Income tax', h.eur(amRand.est)],
], `Pension of ${h.eur(g26)} a month starting 2026`, ['l', 'r'])}
<p>The legal basis: taxable share under ${h.src('estg_22', 'section 22 Income Tax Act')}, flat allowances under ${h.src('estg_9a', 'section 9a')} and ${h.src('estg_10c', 'section 10c')}, insurance contributions under ${h.src('estg_10', 'section 10')}, schedule under ${h.src('estg_32a', 'section 32a')}. Health and care contributions are the biggest deduction, which is why the care surcharge for people without children (${h.src('sgb11_55', 'section 55 SGB XI')}) pushes the limit up to about ${h.eur(gKl)}.</p>
<h2>Limit by year the pension starts</h2>
${h.table(['Start year', 'Taxable share', 'Tax-free up to, gross a month', 'A year'], reihe.map((r) => [String(r.j), h.pct(r.a, 1), h.eur(r.g), h.eur(r.g * 12)]), 'Standard case, 2026 schedule and contributions, pension unchanged since it started', ['l', 'r', 'r', 'r'])}
<p>Between start years 2020 and 2035 the limit falls from ${h.eur(g20)} to ${h.eur(g35)}. For earlier start years the table is too generous if the pension has gone up since: the tax-free part was frozen in euros in the year after the start, and every increase after that is fully taxed. The effect is shown on ${h.a('besteuerung-rente', 'taxation of German pensions')}. For future start years the table only uses 2026 values; the basic allowance and contribution rates will have moved by then.</p>
<h2>What happens above the limit</h2>
<p>Crossing the limit does not mean a large bill. Only income above the basic allowance is taxed, and the schedule starts with low rates in its first band.</p>
${h.table(['Gross pension', 'Taxable income', 'Tax a year', 'A month'], beispiele.map(({ r, n }) => [h.eur(r), h.eur(n.zve), h.eur(n.steuerJahr), h.eur(n.steuerJahr / 12, 2)]), 'Pension starting 2026, standard case', ['r', 'r', 'r', 'r'])}
<p>The German pension insurer does not withhold income tax, unlike an employer running payroll. If you are above the limit, the tax is assessed through your return and is not waived just because nobody asked for it. The ${h.a('rente-steuer-rechner', 'pension tax calculator')} handles couples and other income.</p>
<h2>Pension increases: over the limit overnight</h2>
<p>The limit is fixed for the year; the pension is not. On 1 July 2026 the pension value rose by ${h.pct(h.P.rentenwert.anpassung_2026, 2)}, so a pension of ${h.eur(vorJuli)} became ${h.eur(nachJuli, 2)}. A full year at that amount, for a pension starting in 2026, means ${h.eur(nJuli.steuerJahr)} of tax, although the amount was below the limit before the adjustment. Pensioners cross the line this way without doing anything, and each later adjustment widens the gap. The current pension value is explained under ${h.a('rentenwert-2026', 'pension increase 2026')}.</p>
<h2>What moves the limit up or down</h2>
${h.table(['Case', 'Tax-free up to, gross a month', 'Difference from the standard case'], varianten.map((v) => [v.en, h.eur(v.g), h.eur(v.g - g26)]), 'Pension starting 2026, everything else as in the standard case', ['l', 'r', 'r'])}
<p>The health fund you choose moves the limit by only a few euros: higher contributions are deductible, but they also come out of the same pension. The big levers are marriage and other income. As little as €2,000 a year from rent or a company pension pulls the limit down noticeably, while joint assessment with a spouse who has no income almost doubles it.</p>
<h2>Expats: a small German pension and income from elsewhere</h2>
<p>If you spent only part of your career in Germany, your German pension may be well below the limit on its own. That does not settle the question. The limit on this page assumes the German statutory pension is your only income. Rent from a flat in your home country, investment income or a pension from another country can change the picture, and how they are treated depends on rules this page does not cover. Bring every source of income to the tax office or a tax adviser before concluding that nothing is due. If you keep working in Germany after the standard retirement age as an employee, wages up to ${h.eur(h.P.steuer.aktivrente_jahr)} a year can be tax-free (${h.src('estg_3', 'section 3 no. 21')}); see ${h.a('hinzuverdienst', 'earnings and the Aktivrente')}.</p>`,
  },
});
