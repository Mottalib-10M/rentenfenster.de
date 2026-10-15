import { defineGuide } from '../../lib/guide-types';
import { besteuerungsanteil, nettoStandard } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Besteuerung der Rente: Tabelle des Besteuerungsanteils 2005 bis 2058 (§ 22 EStG) direkt aus params-2026.json,
 * eingefrorener Rentenfreibetrag. Beispiel: 1.500 € im Monat, später 1.650 € und 1.800 € (Annahmen).
 */
const S = P.steuer;
const TAB = S.besteuerungsanteil as Record<string, number>;
const jahre = Object.keys(TAB).map(Number).sort((a, b) => a - b);
const alt = jahre.filter((j) => j <= 2025);
const neu = jahre.filter((j) => j >= 2026);
const ERSTES = jahre[0];
const LETZTES = jahre[jahre.length - 1];
/** Schritt je Jahr zwischen zwei Startjahren, als Anteil. */
const schritt = (a: number, b: number) => (besteuerungsanteil(b) - besteuerungsanteil(a)) / (b - a);
const s1 = schritt(2005, 2020), s2 = schritt(2020, 2022), s3 = schritt(2023, 2058);
const a05 = besteuerungsanteil(2005), a15 = besteuerungsanteil(2015), a20 = besteuerungsanteil(2020);
const a26 = besteuerungsanteil(2026), a27 = besteuerungsanteil(2027), a28 = besteuerungsanteil(2028), a35 = besteuerungsanteil(2035);

const MON = 1500;
const JAHR = MON * 12;
const frei = (start: number) => JAHR * (1 - besteuerungsanteil(start));
const frei26 = frei(2026);
/** Spätere Rente nach Erhöhungen (Annahme): der Freibetrag bleibt in Euro gleich. */
const spaeter = [1500, 1650, 1800].map((m) => { const j = m * 12; const pfl = j - frei26; return { m, j, pfl, eff: pfl / j }; });
const eff1650 = spaeter[1].eff;
const n26 = nettoStandard(MON, 2026);
const n35 = nettoStandard(MON, 2035);
const n15 = nettoStandard(MON, 2015);
const mehrJahr = JAHR * s3;

const zeilen = (liste: number[], l: 'de' | 'en', h: { pct: (x: number, d?: number) => string; eur: (n: number, d?: number) => string }) =>
  liste.map((j) => {
    const a = besteuerungsanteil(j);
    return [String(j), h.pct(a, 1), h.pct(1 - a, 1), h.eur(JAHR * (1 - a))];
  });

export default defineGuide({
  id: 'besteuerung-rente',
  group: 'netto',
  order: 110,
  mini: 'anteil',
  miniHref: 'rente-steuer-rechner',
  related: ['steuerfreie-rente', 'rente-steuer-rechner', 'rentenrechner-brutto-netto', 'krankenversicherung-rentner', 'hinzuverdienst', 'spaeter-in-rente'],
  sources: ['estg_22', 'estg_32a', 'estg_9a', 'estg_10c', 'estg_10', 'solzg_3', 'vo883'],
  de: {
    slug: 'besteuerung-rente-tabelle',
    nav: 'Besteuerung der Rente',
    card: 'Steuerpflichtiger Anteil je Startjahr von 2005 bis 2058 und der eingefrorene Rentenfreibetrag.',
    title: 'Besteuerung der Rente Tabelle 2026: Anteil und Freibetrag',
    description: 'Besteuerung der Rente Tabelle 2026: steuerpflichtiger Anteil für jeden Rentenbeginn von 2005 bis 2058 und wie der Rentenfreibetrag in Euro eingefroren wird.',
    h1: 'Besteuerung der Rente: Tabelle und Rentenfreibetrag 2026',
    intro: 'Welcher Teil Ihrer Rente steuerpflichtig ist, entscheidet ein einziges Datum: das Jahr, in dem die Rente beginnt. Die Tabelle zeigt jeden Jahrgang des Rentenbeginns.',
    resume: `Gesetzliche Renten werden nicht vollständig besteuert, sondern mit einem Anteil, der sich nach dem Jahr des Rentenbeginns richtet (§ 22 EStG). Wer ${ERSTES} oder früher in Rente ging, versteuert ${DE.pct(a05)} der Rente, wer 2026 beginnt ${DE.pct(a26)}, wer 2027 beginnt ${DE.pct(a27, 1)}. Danach steigt der Anteil um ${DE.num(s3 * 100, 1)} Prozentpunkte je Startjahr, bis Renten mit Beginn ${LETZTES} vollständig steuerpflichtig sind. Der übrige Teil heißt Rentenfreibetrag. Er wird im Jahr nach dem Rentenbeginn als fester Eurobetrag festgeschrieben und bleibt dann lebenslang gleich, auch wenn die Rente steigt; jede spätere Rentenerhöhung ist deshalb voll steuerpflichtig. Beispiel mit 1.500 € Monatsrente und Beginn 2026: Der Freibetrag beträgt ${DE.eur(frei26)} im Jahr. Steigt die Rente später auf 1.650 €, sind nicht mehr ${DE.pct(a26)}, sondern ${DE.pct(eff1650, 1)} der Jahresrente steuerpflichtig. Ob daraus Steuer wird, entscheidet erst der Abgleich mit dem Grundfreibetrag von ${DE.eur(S.grundfreibetrag)}.`,
    faqs: [
      { q: 'Wie hoch ist der Besteuerungsanteil bei Rentenbeginn 2027?', a: `${DE.pct(a27, 1)}. Steuerfrei bleiben also ${DE.pct(1 - a27, 1)} der Rente, festgeschrieben in Euro im Jahr 2028. Wer erst 2028 beginnt, versteuert ${DE.pct(a28)}. Maßgeblich ist das Jahr, für das die Rente zum ersten Mal gezahlt wird, nicht das Jahr des Antrags und nicht das Geburtsjahr. Eine Rente ab dem 1. Dezember 2027 trägt also den Anteil von 2027.` },
      { q: 'Wird der Rentenfreibetrag nach einer Rentenerhöhung neu berechnet?', a: `Nein. Der Betrag wird einmal festgeschrieben und danach nicht mehr angepasst. Bei 1.500 € Monatsrente und Beginn 2026 sind das ${DE.eur(frei26)} im Jahr. Steigt die Rente auf 1.800 €, bleiben es ${DE.eur(frei26)}; steuerpflichtig sind dann ${DE.eur(spaeter[2].pfl)} statt ${DE.eur(spaeter[0].pfl)}. Die Lücke zwischen Tabellenwert und tatsächlichem Anteil wächst so mit jeder Anpassung.` },
      { q: 'Gilt für eine Witwenrente ein eigener Besteuerungsanteil?', a: 'Für Renten, die aufeinander folgen, enthält § 22 EStG in Satz 8 eine eigene Regel; das betrifft etwa die Witwenrente nach der Rente des verstorbenen Partners oder die Altersrente nach einer Erwerbsminderungsrente. Der Anteil wird dann nicht einfach nach dem Jahr des neuen Rentenbeginns aus der Tabelle abgelesen. Welcher Wert gilt, steht in Ihrem Steuerbescheid; die Tabelle hier beschreibt eine erste, eigene Rente.' },
      { q: 'Warum wächst der steuerpflichtige Anteil seit 2023 langsamer?', a: `Die Tabelle in § 22 EStG hat drei Stufen. Von ${ERSTES} bis 2020 stieg der Anteil um ${DE.num(s1 * 100)} Prozentpunkte je Startjahr, 2021 und 2022 um ${DE.num(s2 * 100)} Punkt, seit 2023 um ${DE.num(s3 * 100, 1)} Punkte. Deshalb sind erst Renten mit Beginn ${LETZTES} voll steuerpflichtig. Für eine bereits laufende Rente ändert die Stufung nichts, ihr Anteil steht seit dem Beginn fest.` },
      { q: 'Welche Abzüge mindern die steuerpflichtige Rente?', a: `Vom steuerpflichtigen Teil gehen ${DE.eur(S.wk_pauschbetrag_rente)} Werbungskosten-Pauschbetrag ab, dazu ${DE.eur(S.sa_pauschbetrag)} Sonderausgaben und die Beiträge zur Kranken- und Pflegeversicherung. Bei 1.500 € Rente ab 2026 sind ${DE.eur(n26.steuerpflichtig)} steuerpflichtig; nach den Abzügen bleiben ${DE.eur(n26.zve)} zu versteuern. Weil das knapp über dem Grundfreibetrag liegt, fallen nur ${DE.eur(n26.steuerJahr)} Steuer im Jahr an.` },
      { q: 'Kostet ein um ein Jahr späterer Rentenbeginn mehr Steuer?', a: `Ein wenig: Der Besteuerungsanteil steigt um ${DE.num(s3 * 100, 1)} Prozentpunkte. Bei 1.500 € Rente werden dadurch ${DE.eur(mehrJahr)} mehr im Jahr steuerpflichtig, nicht ${DE.eur(mehrJahr)} mehr Steuer. Daraus entstehen je nach Steuersatz einige Euro im Jahr. Für die Wahl des Startmonats zählen Abschlag, Zuschlag und Ihre Lebenslage weit mehr als dieser Unterschied.` },
    ],
    body: (h) => `
<h2>Was der Besteuerungsanteil bedeutet</h2>
<p>Seit ${ERSTES} ist die gesetzliche Rente mit einem Anteil steuerpflichtig, der über Jahrzehnte wächst, bis er für Renten mit Beginn ${LETZTES} die ganze Rente erfasst. Dafür legt ${h.src('estg_22', '§ 22 Nr. 1 EStG')} für jedes Jahr des Rentenbeginns einen Prozentsatz fest. Dieser Satz begleitet die Rente bis zum Ende. Wer 2015 in Rente ging, behält ${h.pct(a15, 0)}, auch wenn er die Rente noch 2040 bezieht; wer 2035 beginnt, versteuert von Anfang an ${h.pct(a35, 1)}.</p>
<p>Abgezogen wird die Steuer von niemandem. Die Rentenversicherung zahlt die Rente brutto aus, nur Kranken- und Pflegebeitrag gehen vorher ab. Die Einkommensteuer ergibt sich aus der Steuererklärung, wenn der steuerpflichtige Teil zusammen mit anderen Einkünften den Grundfreibetrag übersteigt. Ab welchem Betrag das der Fall ist, steht unter ${h.a('steuerfreie-rente', 'Rente steuerfrei bis')}.</p>
<h2>Tabelle: Rentenbeginn ${ERSTES} bis 2025</h2>
${h.table(['Rentenbeginn', 'Besteuerungsanteil', 'Steuerfrei', 'Freibetrag bei 1.500 € im Monat'], zeilen(alt, 'de', h), 'Rentenfreibetrag bei gleichbleibender Rente von 1.500 € (18.000 € im Jahr)', ['l', 'r', 'r', 'r'])}
<p>Die erste Stufe ist steil: ${h.num(s1 * 100)} Prozentpunkte mehr je Startjahr bis 2020, dann ${h.num(s2 * 100)} Punkt für 2021 und 2022. Seit 2023 wächst der Anteil nur noch um ${h.num(s3 * 100, 1)} Punkte. Für Menschen, die 2023, 2024 oder 2025 in Rente gingen, gilt die flachere Kurve bereits: ${h.pct(besteuerungsanteil(2023), 1)}, ${h.pct(besteuerungsanteil(2024))} und ${h.pct(besteuerungsanteil(2025), 1)}.</p>
<h2>Tabelle: Rentenbeginn 2026 bis ${LETZTES}</h2>
${h.table(['Rentenbeginn', 'Besteuerungsanteil', 'Steuerfrei', 'Freibetrag bei 1.500 € im Monat'], zeilen(neu, 'de', h), `Ab ${LETZTES} ist die Rente vollständig steuerpflichtig`, ['l', 'r', 'r', 'r'])}
<p>Die Spalte „Freibetrag“ ist eine Rechenhilfe für eine gleichbleibende Rente von 1.500 €. Ihr eigener Betrag ergibt sich aus Ihrer Jahresrente im Jahr nach dem Beginn, multipliziert mit dem steuerfreien Prozentsatz. Mit Ihrem Startjahr und Ihrer Bruttorente rechnet der Mini-Rechner oben.</p>
<h2>Der Rentenfreibetrag: einmal festgelegt, nie angepasst</h2>
<p>Das Gesetz spricht vom steuerfreien Teil der Rente. Er wird nicht jedes Jahr neu aus dem Prozentsatz ermittelt, sondern im Jahr nach dem Rentenbeginn in Euro festgeschrieben. Von da an steigt die Rente mit jeder Anpassung zum 1. Juli, der Freibetrag aber nicht. Der tatsächlich besteuerte Teil wächst deshalb Jahr für Jahr über den Tabellenwert hinaus.</p>
${h.table(['Monatsrente', 'Jahresrente', 'Fester Freibetrag', 'Steuerpflichtig', 'Tatsächlicher Anteil'], spaeter.map((r) => [h.eur(r.m), h.eur(r.j), h.eur(frei26), h.eur(r.pfl), h.pct(r.eff, 1)]), 'Rentenbeginn 2026; spätere Beträge sind Annahmen für künftige Erhöhungen', ['r', 'r', 'r', 'r', 'r'])}
<p>Das erklärt, warum zwei Nachbarn mit derselben Rente unterschiedlich viel Steuer zahlen können. Wer seit 2015 eine Rente bezieht, die heute 1.500 € beträgt, hat seinen Freibetrag aus einer niedrigeren Rente von damals; sein tatsächlicher Anteil liegt über den ${h.pct(a15, 0)} der Tabelle. Wer die Steuer genau schätzen will, trägt den Freibetrag aus dem Steuerbescheid in den ${h.a('rente-steuer-rechner', 'Steuerrechner für Rentner')} ein.</p>
<h2>Vom steuerpflichtigen Teil zur Steuer</h2>
<p>Der Besteuerungsanteil ist nur der erste Schritt. Vom steuerpflichtigen Teil zieht das Finanzamt den Werbungskosten-Pauschbetrag von ${h.eur(h.P.steuer.wk_pauschbetrag_rente)} ab (${h.src('estg_9a', '§ 9a EStG')}), den Sonderausgaben-Pauschbetrag von ${h.eur(h.P.steuer.sa_pauschbetrag)}, bei Ehepaaren ${h.eur(h.P.steuer.sa_pauschbetrag * 2)} (${h.src('estg_10c', '§ 10c')}), und die gezahlten Kranken- und Pflegebeiträge (${h.src('estg_10', '§ 10')}). Auf den Rest wirkt der Tarif 2026 mit seinem Grundfreibetrag von ${h.eur(h.P.steuer.grundfreibetrag)} (${h.src('estg_32a', '§ 32a')}).</p>
<p>Drei Startjahre, dieselbe Rente von 1.500 €, alleinstehend, keine weiteren Einkünfte: Mit Beginn 2015 sind ${h.eur(n15.steuerpflichtig)} steuerpflichtig, die Steuer beträgt ${h.eur(n15.steuerJahr)}. Mit Beginn 2026 sind es ${h.eur(n26.steuerpflichtig)} und ${h.eur(n26.steuerJahr)} Steuer im Jahr, mit Beginn 2035 ${h.eur(n35.steuerpflichtig)} und ${h.eur(n35.steuerJahr)}. Der Solidaritätszuschlag spielt bei solchen Beträgen keine Rolle, weil er erst oberhalb einer Freigrenze von ${h.eur(h.P.steuer.soli_freigrenze_einzel)} Einkommensteuer greift (${h.src('solzg_3', '§ 3 SolZG')}). Kirchenmitglieder zahlen zusätzlich ${h.pct(h.P.steuer.kirchensteuer.by_bw, 0)} der Einkommensteuer in Bayern und Baden-Württemberg, ${h.pct(h.P.steuer.kirchensteuer.andere, 0)} in den übrigen Ländern.</p>
<h2>Wenn eine Rente auf die andere folgt</h2>
<p>Nicht jede Rente bekommt automatisch den Anteil ihres eigenen Startjahres. Für Folgerenten, etwa eine Altersrente im Anschluss an eine Erwerbsminderungsrente oder eine Witwenrente nach der Rente des verstorbenen Partners, sieht § 22 EStG in Satz 8 eine Sonderregel vor. Wer nach einer ${h.a('erwerbsminderungsrente', 'Erwerbsminderungsrente')} in die Altersrente wechselt oder eine ${h.a('witwenrente-rechner', 'Witwenrente')} bezieht, sollte den Prozentsatz deshalb nicht aus der Tabelle ablesen, sondern aus dem Bescheid des Finanzamts übernehmen.</p>
<h2>Arbeiten neben der Rente</h2>
<p>Der Besteuerungsanteil gilt nur für die Rente selbst. Lohn aus einer Beschäftigung nach Erreichen der Regelaltersgrenze kann bis zu ${h.eur(h.P.steuer.aktivrente_jahr)} im Jahr steuerfrei sein; diese Aktivrente und ihre Bedingungen erklärt ${h.a('hinzuverdienst', 'Hinzuverdienst neben der Rente')}. Für die Rente selbst bleibt es beim Anteil aus der Tabelle.</p>`,
  },
  en: {
    slug: 'taxation-of-german-pensions',
    nav: 'Pension taxation',
    card: 'Taxable share of a German pension for every start year from 2005 to 2058, and the frozen allowance.',
    title: 'Pension taxation table 2026: taxable share by start year',
    description: 'Pension taxation table 2026 for Germany: the taxable share for every start year from 2005 to 2058 and how the tax-free amount is frozen in euros, with examples.',
    h1: 'German pension taxation: table and tax-free amount 2026',
    intro: 'Which part of a German statutory pension is taxed depends on one date only: the year the pension starts. The table covers every start year the law lists.',
    resume: `A German statutory pension is not taxed in full. The taxable share (Besteuerungsanteil) depends on the year the pension starts (section 22 Income Tax Act). Pensions that began in ${ERSTES} or earlier are taxed on ${EN.pct(a05)}, pensions starting in 2026 on ${EN.pct(a26)}, pensions starting in 2027 on ${EN.pct(a27, 1)}. From then on the share rises by ${EN.num(s3 * 100, 1)} percentage points per start year until pensions starting in ${LETZTES} are fully taxable. The remainder is the tax-free amount (Rentenfreibetrag). It is fixed in euros in the year after the pension starts and never changes again, so every later pension increase is taxed in full. Example with a pension of €1,500 a month starting in 2026: the tax-free amount is ${EN.eur(frei26)} a year. If the pension later rises to €1,650, the taxed part is no longer ${EN.pct(a26)} but ${EN.pct(eff1650, 1)} of the annual pension. Whether any tax is actually due depends on the basic allowance of ${EN.eur(S.grundfreibetrag)}.`,
    faqs: [
      { q: 'What is the taxable share for a German pension starting in 2027?', a: `${EN.pct(a27, 1)}. That leaves ${EN.pct(1 - a27, 1)} tax-free, fixed in euros in 2028. If your pension starts in 2028, the share is ${EN.pct(a28)}. What counts is the first year for which the pension is paid, not the year you apply and not your birth year, so a pension from 1 December 2027 still takes the 2027 share.` },
      { q: 'Does the tax-free amount go up when my German pension is increased?', a: `No. It is fixed once and then stays the same in euros. On €1,500 a month starting in 2026 it is ${EN.eur(frei26)} a year. If the pension later reaches €1,800, it is still ${EN.eur(frei26)}, so the taxed part grows from ${EN.eur(spaeter[0].pfl)} to ${EN.eur(spaeter[2].pfl)}. The gap between the table value and the real share widens with every adjustment.` },
      { q: 'I worked in two EU countries: does this German table apply to both pensions?', a: 'No. Under the EU coordination rules each country where you were insured pays its own pension for its own periods. The German table describes only the German statutory pension. How the pension from the other member state is treated for tax is a separate question, which depends on the countries involved; the German tax office or a tax adviser can tell you how it fits into your return.' },
      { q: 'Why has the taxable share grown more slowly since 2023?', a: `Section 22 sets out three steps. From ${ERSTES} to 2020 the share rose by ${EN.num(s1 * 100)} percentage points per start year, in 2021 and 2022 by ${EN.num(s2 * 100)} point, and since 2023 by ${EN.num(s3 * 100, 1)} points. That is why only pensions starting in ${LETZTES} are fully taxable. A pension already running is not affected: its share was fixed when it started.` },
      { q: 'What can I deduct from the taxable part of my German pension?', a: `A flat ${EN.eur(S.wk_pauschbetrag_rente)} for expenses, ${EN.eur(S.sa_pauschbetrag)} for special expenses and the health and long-term care contributions you pay. On €1,500 a month starting in 2026, ${EN.eur(n26.steuerpflichtig)} is taxable; after those deductions ${EN.eur(n26.zve)} is left. That is just above the basic allowance, so the tax is only ${EN.eur(n26.steuerJahr)} a year.` },
      { q: 'Does starting my pension a year later cost more tax?', a: `Slightly: the taxable share is ${EN.num(s3 * 100, 1)} percentage points higher. On €1,500 a month that makes ${EN.eur(mehrJahr)} more taxable income a year, not ${EN.eur(mehrJahr)} more tax; depending on your rate it means a few euros. Reductions for early retirement, increases for later retirement and your personal situation matter far more when choosing the start month.` },
    ],
    body: (h) => `
<h2>What the taxable share means</h2>
<p>Since ${ERSTES} the German statutory pension has been taxed on a share that grows over several decades until it reaches the whole pension. To get there, ${h.src('estg_22', 'section 22 no. 1 Income Tax Act')} sets a percentage for each start year. That percentage stays with the pension for life. A pension that began in 2015 keeps ${h.pct(a15, 0)}, even if it is still paid in 2040; one starting in 2035 is taxed on ${h.pct(a35, 1)} from day one.</p>
<p>Nobody withholds income tax from a German pension. The pension insurer pays it gross, deducting only health and long-term care contributions. Income tax is assessed through your tax return when the taxable part, together with other income, exceeds the basic allowance. If you are used to tax being taken at source by an employer, plan for a payment after the assessment instead. The amount from which tax appears is on ${h.a('steuerfreie-rente', 'tax-free pension limit')}.</p>
<h2>Table: pensions starting ${ERSTES} to 2025</h2>
${h.table(['Start year', 'Taxable share', 'Tax-free', 'Tax-free amount on €1,500 a month'], zeilen(alt, 'en', h), 'Tax-free amount for an unchanged pension of €1,500 (€18,000 a year)', ['l', 'r', 'r', 'r'])}
<p>The first step is steep: ${h.num(s1 * 100)} percentage points more per start year up to 2020, then ${h.num(s2 * 100)} point for 2021 and 2022. Since 2023 the share grows by only ${h.num(s3 * 100, 1)} points. People who retired in 2023, 2024 or 2025 are already on the flatter curve: ${h.pct(besteuerungsanteil(2023), 1)}, ${h.pct(besteuerungsanteil(2024))} and ${h.pct(besteuerungsanteil(2025), 1)}.</p>
<h2>Table: pensions starting 2026 to ${LETZTES}</h2>
${h.table(['Start year', 'Taxable share', 'Tax-free', 'Tax-free amount on €1,500 a month'], zeilen(neu, 'en', h), `From ${LETZTES} the pension is fully taxable`, ['l', 'r', 'r', 'r'])}
<p>The last column is a guide for an unchanged pension of €1,500. Your own amount is your annual pension in the year after the start multiplied by the tax-free percentage. The mini calculator above works it out from your start year and gross pension.</p>
<h2>The tax-free amount: fixed once, never adjusted</h2>
<p>The law speaks of the tax-free part of the pension. It is not recalculated each year from the percentage; it is fixed in euros in the year after the pension starts. From then on the pension rises with each adjustment on 1 July, but the tax-free amount does not. The part actually taxed therefore climbs above the table value year after year.</p>
${h.table(['Monthly pension', 'Annual pension', 'Fixed tax-free amount', 'Taxable', 'Actual share'], spaeter.map((r) => [h.eur(r.m), h.eur(r.j), h.eur(frei26), h.eur(r.pfl), h.pct(r.eff, 1)]), 'Pension starting 2026; later amounts are assumptions for future increases', ['r', 'r', 'r', 'r', 'r'])}
<p>This is why two neighbours with the same pension can pay different amounts of tax. Someone drawing a pension since 2015 that now pays €1,500 had the tax-free amount set on the lower pension of that time, so the actual share is above the ${h.pct(a15, 0)} in the table. For a precise estimate, enter the amount shown in your tax assessment in the ${h.a('rente-steuer-rechner', 'pension tax calculator')}.</p>
<h2>From the taxable part to the tax bill</h2>
<p>The share is only the first step. From the taxable part the tax office deducts the flat expense allowance of ${h.eur(h.P.steuer.wk_pauschbetrag_rente)} (${h.src('estg_9a', 'section 9a')}), the flat special-expense allowance of ${h.eur(h.P.steuer.sa_pauschbetrag)}, or ${h.eur(h.P.steuer.sa_pauschbetrag * 2)} for a married couple (${h.src('estg_10c', 'section 10c')}), and the health and care contributions you paid (${h.src('estg_10', 'section 10')}). The 2026 schedule with its basic allowance of ${h.eur(h.P.steuer.grundfreibetrag)} applies to what is left (${h.src('estg_32a', 'section 32a')}).</p>
<p>Three start years, the same €1,500 pension, single, no other income: starting in 2015, ${h.eur(n15.steuerpflichtig)} is taxable and the tax is ${h.eur(n15.steuerJahr)}. Starting in 2026 it is ${h.eur(n26.steuerpflichtig)} and ${h.eur(n26.steuerJahr)} a year; starting in 2035, ${h.eur(n35.steuerpflichtig)} and ${h.eur(n35.steuerJahr)}. The solidarity surcharge plays no part at these amounts, because it only applies above ${h.eur(h.P.steuer.soli_freigrenze_einzel)} of income tax (${h.src('solzg_3', 'section 3 Solidarity Surcharge Act')}). Church members pay ${h.pct(h.P.steuer.kirchensteuer.by_bw, 0)} of the income tax in Bavaria and Baden-Württemberg and ${h.pct(h.P.steuer.kirchensteuer.andere, 0)} in the other states.</p>
<h2>Several countries, several pensions</h2>
<p>Many expats end up with pension rights in more than one country. Under ${h.src('vo883', 'Regulation (EC) No 883/2004')} insurance periods in EU and EEA countries and Switzerland are added together to check the qualifying periods, but each country then pays its own pension for its own periods. The table on this page applies only to the German statutory pension and its start year. Do not apply it to a pension from another member state: that pension has its own rules, which this page does not cover.</p>
<h2>When one pension follows another</h2>
<p>Not every pension simply takes the share of its own start year. For a pension that follows an earlier one, such as an old-age pension after a ${h.a('erwerbsminderungsrente', 'disability pension')} or a ${h.a('witwenrente-rechner', 'widow’s pension')} after the deceased partner’s pension, section 22 sentence 8 has a special rule. In those cases take the percentage from the tax office’s assessment rather than from the table. Work after the standard retirement age is a separate matter: wages can be tax-free up to ${h.eur(h.P.steuer.aktivrente_jahr)} a year, explained under ${h.a('hinzuverdienst', 'working alongside the pension')}.</p>`,
  },
});
