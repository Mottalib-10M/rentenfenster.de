import { defineGuide } from '../../lib/guide-types';
import { netto, type NettoEingabe } from '../../lib/engine/geld';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Krankenversicherung der Rentner (KVdR) und Pflege: Anteile, Abzüge je Rentenhöhe, Zusatzbeitrag (2,5 % und 3,5 % als Annahmen),
 * Pflege mit und ohne Kinder, Kinderabschlag. Rentenbeginn 2026, Standardfall.
 */
const KV = P.kv, PV = P.pv;
const basis: Omit<NettoEingabe, 'brutto'> = { zusatz: KV.zusatz_durchschnitt_2026, kinderlos: false, startjahr: 2026, weitere: 0, verheiratet: false, partner: 0, kirche: 0 };
const mit = (brutto: number, o: Partial<NettoEingabe> = {}) => netto({ ...basis, ...o, brutto });
const R = 1600;
const n16 = mit(R);
const k16 = mit(R, { kinderlos: true });
const z25 = mit(R, { zusatz: 0.025 });
const z35 = mit(R, { zusatz: 0.035 });
const stufen = [1000, 1400, 1800, 2200, 2600].map((b) => ({ b, e: mit(b), k: mit(b, { kinderlos: true }) }));
const halbAllg = KV.allgemein * KV.rentner_anteil;
const halbZusatz = KV.zusatz_durchschnitt_2026 * KV.rentner_anteil;
const kvSatz = n16.kvSatz;
const pvKl = PV.satz + PV.kinderlos_zuschlag;
/** Pflegesatz bei n Kindern unter 25: Abschlag ab dem 2. bis zum 5. Kind. */
const pvKinder = (n: number) => PV.satz - PV.kind_abschlag * Math.min(4, Math.max(0, n - 1));
const kinderReihe = [1, 2, 3, 4, 5].map((n) => ({ n, s: pvKinder(n), b: R * pvKinder(n) }));
const jahr16 = n16.sozial * 12;
const steuerMit = n16.steuerJahr;
const zveOhne = n16.zve + jahr16;
/** Rentenanpassung zum 1. Juli 2026 auf eine Rente von 1.600 € (Juni 2026). */
const nachJuli = R * (1 + P.rentenwert.anpassung_2026);
const nj = mit(nachJuli);

export default defineGuide({
  id: 'krankenversicherung-rentner',
  group: 'netto',
  order: 130,
  mini: 'kvdr',
  miniHref: 'rentenrechner-brutto-netto',
  related: ['rentenrechner-brutto-netto', 'steuerfreie-rente', 'besteuerung-rente', 'rente-beantragen', 'rentenrechner', 'rente-ausland'],
  sources: ['sgb5_5', 'sgb5_241', 'sgb5_247', 'sgb5_249a', 'sgb11_55', 'sgb11_59', 'estg_10'],
  de: {
    slug: 'krankenversicherung-rentner',
    nav: 'Krankenversicherung der Rentner',
    card: 'KVdR und Pflege: wer welchen Teil trägt und was bei 1.000 bis 2.600 € Rente abgeht.',
    title: 'Krankenversicherung Rentner 2026: Beitrag, KVdR und Pflege',
    description: `Krankenversicherung Rentner 2026: ${DE.pct(halbAllg, 1)} plus halber Zusatzbeitrag, Pflege ${DE.pct(PV.satz, 1)} oder ${DE.pct(pvKl, 1)} allein getragen. Abzüge von 1.000 bis 2.600 € Rente im Vergleich.`,
    h1: 'Krankenversicherung der Rentner 2026: was von der Rente abgeht',
    intro: 'Zwei Beiträge gehen von jeder gesetzlichen Rente ab, bevor sie auf dem Konto landet. Den einen teilen Sie mit der Rentenversicherung, den anderen tragen Sie allein.',
    resume: `Rentner in der gesetzlichen Krankenversicherung zahlen 2026 zwei Beiträge aus ihrer Rente. Der Krankenkassenbeitrag besteht aus dem allgemeinen Satz von ${DE.pct(KV.allgemein, 1)} und dem Zusatzbeitrag der eigenen Kasse, im Durchschnitt ${DE.pct(KV.zusatz_durchschnitt_2026, 1)}; die Rentenversicherung übernimmt die Hälfte, Sie tragen ${DE.pct(halbAllg, 1)} plus ${DE.pct(halbZusatz, 2)}, zusammen ${DE.pct(kvSatz, 2)} der Bruttorente. Den Pflegebeitrag von ${DE.pct(PV.satz, 1)} tragen Rentner allein, ohne Kinder sind es ${DE.pct(pvKl, 1)}. Bei 1.600 € Rente gehen so ${DE.eur(n16.sozial, 2)} im Monat ab, kinderlos ${DE.eur(k16.sozial, 2)}. Erhöht die Kasse den Zusatzbeitrag, wirkt das bei Rentnern erst ab dem zweiten Monat nach der Änderung. Beide Beiträge sind als Sonderausgaben steuerlich absetzbar und senken damit die Einkommensteuer auf die Rente. Eltern mit mehreren Kindern unter 25 Jahren zahlen ab dem zweiten Kind je ${DE.num(PV.kind_abschlag * 100, 2)} Prozentpunkte weniger Pflegebeitrag.`,
    faqs: [
      { q: 'Wer zahlt den Krankenkassenbeitrag der Rentner?', a: `Rentner und Rentenversicherung teilen ihn je zur Hälfte. Vom allgemeinen Satz von ${DE.pct(KV.allgemein, 1)} tragen Sie ${DE.pct(halbAllg, 1)}, vom Zusatzbeitrag Ihrer Kasse ebenfalls die Hälfte. Die andere Hälfte trägt die Rentenversicherung zusätzlich zu Ihrer Rente. Beim Pflegebeitrag gibt es diese Teilung nicht: Ihn tragen Rentner in voller Höhe selbst.` },
      { q: 'Wie viel Kranken- und Pflegebeitrag zahle ich bei 1.600 € Rente?', a: `Mit durchschnittlichem Zusatzbeitrag und Kindern ${DE.eur(n16.kv, 2)} für die Krankenkasse und ${DE.eur(n16.pv, 2)} für die Pflege, zusammen ${DE.eur(n16.sozial, 2)} im Monat oder ${DE.eur(jahr16, 2)} im Jahr. Ohne Kinder steigt der Pflegeanteil auf ${DE.eur(k16.pv, 2)}. Vor der Einkommensteuer bleiben ${DE.eur(n16.nettoVorSteuer, 2)}, kinderlos ${DE.eur(k16.nettoVorSteuer, 2)}.` },
      { q: 'Ab wann gilt ein höherer Zusatzbeitrag für meine Rente?', a: 'Bei Rentnern nicht sofort, sondern ab dem ersten Tag des zweiten Monats nach der Änderung. Erhöht Ihre Kasse den Zusatzbeitrag zum 1. Januar, sinkt die ausgezahlte Rente deshalb erst zum 1. März. Eine Senkung wirkt mit derselben Verzögerung. Für den Februar wird also noch der alte Satz abgezogen, die Änderung erscheint erst mit der Märzrente.' },
      { q: 'Warum zahlen kinderlose Rentner mehr Pflegebeitrag?', a: `Weil der Gesetzgeber für Kinderlose ab 23 Jahren einen Zuschlag von ${DE.num(PV.kinderlos_zuschlag * 100, 1)} Prozentpunkten vorsieht, der auch im Ruhestand bleibt. Ausgenommen sind nur vor 1940 Geborene. Aus ${DE.pct(PV.satz, 1)} werden ${DE.pct(pvKl, 1)}. Bei 1.600 € Rente sind das ${DE.eur(k16.pv - n16.pv, 2)} mehr im Monat. Ein Kind genügt, um den Zuschlag zu vermeiden; sein Alter spielt dafür keine Rolle.` },
      { q: 'Gibt es einen Pflege-Abschlag für Rentner mit mehreren Kindern?', a: `Ja, solange die Kinder jünger als 25 Jahre sind. Ab dem zweiten bis zum fünften Kind sinkt der Pflegebeitrag um je ${DE.num(PV.kind_abschlag * 100, 2)} Prozentpunkte. Mit drei Kindern unter 25 zahlt man ${DE.pct(pvKinder(3), 2)} statt ${DE.pct(PV.satz, 1)}. Bei Rentnern ist das selten, weil die Kinder meist älter sind; sobald ein Kind 25 wird, entfällt sein Abschlag.` },
      { q: 'Kann ich Kranken- und Pflegebeiträge der Rente steuerlich absetzen?', a: `Ja, als Sonderausgaben nach § 10 EStG. Bei 1.600 € Rente mit Beginn 2026 mindern ${DE.eur(jahr16)} Beiträge im Jahr das zu versteuernde Einkommen von ${DE.eur(zveOhne)} auf ${DE.eur(n16.zve)}. Die Steuer beträgt dann ${DE.eur(steuerMit)} im Jahr. Ohne diesen Abzug wäre die Grenze, ab der Rentner Steuern zahlen, deutlich niedriger.` },
    ],
    body: (h) => `
<h2>Wer welchen Teil trägt</h2>
<p>Die Krankenversicherung der Rentner, kurz KVdR, ist die Pflichtversicherung in der gesetzlichen Krankenversicherung für Rentner, die die Voraussetzungen nach ${h.src('sgb5_5', '§ 5 SGB V')} erfüllen; ob Sie dazugehören, erfahren Sie bei Ihrer Krankenkasse. Für alle, die gesetzlich versichert sind, gilt dieselbe Aufteilung des Beitrags aus der Rente:</p>
${h.table(['Beitrag', 'Satz insgesamt', 'Ihr Anteil', 'Anteil der Rentenversicherung'], [
  ['Krankenversicherung, allgemeiner Satz', h.pct(h.P.kv.allgemein, 1), h.pct(halbAllg, 1), h.pct(halbAllg, 1)],
  ['Zusatzbeitrag (Durchschnitt 2026)', h.pct(h.P.kv.zusatz_durchschnitt_2026, 1), h.pct(halbZusatz, 2), h.pct(halbZusatz, 2)],
  ['Pflegeversicherung mit Kind', h.pct(h.P.pv.satz, 1), h.pct(h.P.pv.satz, 1), h.pct(0, 0)],
  ['Pflegeversicherung ohne Kind', h.pct(pvKl, 1), h.pct(pvKl, 1), h.pct(0, 0)],
], 'Beitragssätze auf die gesetzliche Rente 2026', ['l', 'r', 'r', 'r'])}
<p>Den allgemeinen Satz regelt ${h.src('sgb5_241', '§ 241 SGB V')}, die Anwendung auf die Rente ${h.src('sgb5_247', '§ 247')}, die hälftige Übernahme durch die Rentenversicherung ${h.src('sgb5_249a', '§ 249a')}. Für die Pflege gilt ${h.src('sgb11_55', '§ 55 SGB XI')} mit dem Zuschlag für Kinderlose; dass Rentner den Pflegebeitrag allein zahlen, steht in ${h.src('sgb11_59', '§ 59 SGB XI')}.</p>
<h2>Abzüge nach Rentenhöhe</h2>
${h.table(['Rente brutto', 'Krankenkasse', 'Pflege mit Kind', 'Zusammen', 'Ohne Kind zusammen'], stufen.map(({ b, e, k }) => [h.eur(b), h.eur(e.kv, 2), h.eur(e.pv, 2), h.eur(e.sozial, 2), h.eur(k.sozial, 2)]), 'Durchschnittlicher Zusatzbeitrag 2026', ['r', 'r', 'r', 'r', 'r'])}
<p>Im Bereich dieser Tabelle wachsen die Beiträge im gleichen Verhältnis wie die Rente: Mit Kind gehen rund ${h.pct(n16.kvSatz + n16.pvSatz, 2)} ab, ohne Kind ${h.pct(k16.kvSatz + k16.pvSatz, 2)}. Wer zusätzlich die Einkommensteuer wissen will, nimmt den ${h.a('rentenrechner-brutto-netto', 'Rentenrechner brutto netto')}; dort ist auch der Rentenbeginn einstellbar.</p>
<h2>Der Zusatzbeitrag Ihrer Kasse</h2>
<p>Den allgemeinen Satz zahlen alle gleich, den Zusatzbeitrag legt jede Kasse selbst fest. Der Durchschnitt von ${h.pct(h.P.kv.zusatz_durchschnitt_2026, 1)} ist nur eine Rechengröße. Zwei Beispiele mit 1.600 € Rente und Kindern: Bei einem Zusatzbeitrag von 2,5 Prozent zahlen Sie ${h.eur(z25.kv, 2)} an die Kasse, bei 3,5 Prozent ${h.eur(z35.kv, 2)}. Der Unterschied von ${h.eur(z35.kv - z25.kv, 2)} im Monat ergibt ${h.eur((z35.kv - z25.kv) * 12, 2)} im Jahr, weil Sie nur die Hälfte des Zusatzbeitrags tragen.</p>
<p>Ändert die Kasse ihren Satz, greift die Änderung bei Rentnern erst ab dem zweiten Kalendermonat danach. Bis dahin bleibt der Abzug unverändert. Ein Blick auf den aktuellen Satz der eigenen Kasse lohnt sich, denn ein Prozentpunkt Zusatzbeitrag kostet Sie bei 1.600 € Rente ${h.eur(1600 * 0.01 * h.P.kv.rentner_anteil, 2)} im Monat.</p>
<h2>Rentenerhöhung: der Beitrag steigt mit</h2>
<p>Weil die Beiträge ein fester Prozentsatz der Rente sind, nimmt jede Rentenanpassung sie mit. Zum 1. Juli 2026 stieg die Rente um ${h.pct(h.P.rentenwert.anpassung_2026, 2)}. Aus 1.600 € wurden ${h.eur(nachJuli, 2)} brutto, also ${h.eur(nachJuli - R, 2)} mehr. Davon gingen ${h.eur(nj.sozial - n16.sozial, 2)} zusätzlich an Kranken- und Pflegekasse, und vor Steuer blieben ${h.eur(nj.nettoVorSteuer - n16.nettoVorSteuer, 2)} mehr im Monat. Die Erhöhung, die im Rentenbescheid steht, kommt deshalb nie ganz auf dem Konto an. Beim Vergleich zweier Jahre lohnt es sich, Brutto und Zahlbetrag getrennt anzusehen.</p>
<h2>Pflegeversicherung: allein getragen</h2>
<p>Für die Pflege gibt es keine Beteiligung der Rentenversicherung. Mit Kind sind es ${h.pct(h.P.pv.satz, 1)}, ohne Kind ${h.pct(pvKl, 1)}, für Kinderlose ab 23 Jahren, die nach 1939 geboren sind. Eltern mit mehreren Kindern unter 25 zahlen weniger:</p>
${h.table(['Kinder unter 25', 'Pflegesatz', 'Pflegebeitrag bei 1.600 €'], kinderReihe.map((r) => [h.num(r.n), h.pct(r.s, 2), h.eur(r.b, 2)]), 'Abschlag ab dem 2. bis zum 5. Kind, nur solange das Kind jünger als 25 ist', ['r', 'r', 'r'])}
<p>Der Mini-Rechner oben kennt nur „mindestens ein Kind“ oder „keine“; den Abschlag für mehrere junge Kinder rechnet er nicht ein. Wer mit 63 in Rente geht und noch zwei Kinder unter 25 hat, zahlt nach der Tabelle ${h.eur(kinderReihe[0].b - kinderReihe[1].b, 2)} weniger im Monat, solange beide jünger als 25 sind.</p>
<h2>Beiträge und Steuer</h2>
<p>Was an Kranken- und Pflegebeitrag abgeht, mindert das zu versteuernde Einkommen (${h.src('estg_10', '§ 10 EStG')}). Bei 1.600 € Rente mit Beginn 2026 sind das ${h.eur(jahr16)} im Jahr. Ohne diesen Abzug läge das zu versteuernde Einkommen bei ${h.eur(zveOhne)}, mit ihm bei ${h.eur(n16.zve)}, und die Steuer beträgt ${h.eur(steuerMit)}. Ab welcher Rente überhaupt Steuer entsteht, zeigt ${h.a('steuerfreie-rente', 'Rente steuerfrei bis')}.</p>
<h2>Was diese Seite nicht abdeckt</h2>
<p>Alle Zahlen gelten für die gesetzliche Rente gesetzlich Versicherter. Wer privat krankenversichert ist, zahlt keinen Beitrag aus der Rente an eine gesetzliche Kasse; sein Beitrag richtet sich nach dem Vertrag. Beiträge auf Betriebsrenten oder andere Einkünfte stehen hier ebenfalls nicht. Wie Sie in der Rente versichert sind, klären Sie am besten mit Ihrer Krankenkasse, bevor Sie den ${h.a('rente-beantragen', 'Rentenantrag')} stellen.</p>`,
  },
  en: {
    slug: 'health-insurance-for-pensioners',
    nav: 'Health insurance for pensioners',
    card: 'KVdR and long-term care: who pays which share and what comes off a pension of €1,000 to €2,600.',
    title: 'Health insurance for pensioners 2026: KVdR rates in Germany',
    description: `Health insurance for pensioners in Germany 2026: ${EN.pct(halbAllg, 1)} plus half the extra rate, care ${EN.pct(PV.satz, 1)} or ${EN.pct(pvKl, 1)} paid alone. Deductions for pensions of €1,000 to €2,600.`,
    h1: 'German health insurance for pensioners (KVdR) in 2026',
    intro: 'Two contributions come off every German statutory pension before it reaches your account. You share one with the pension insurer and pay the other alone.',
    resume: `Pensioners in German statutory health insurance pay two contributions from their pension in 2026. Health insurance consists of the general rate of ${EN.pct(KV.allgemein, 1)} plus your own fund’s extra rate (Zusatzbeitrag), on average ${EN.pct(KV.zusatz_durchschnitt_2026, 1)}; the pension insurer pays half, so you pay ${EN.pct(halbAllg, 1)} plus ${EN.pct(halbZusatz, 2)}, ${EN.pct(kvSatz, 2)} of the gross pension in total. Long-term care insurance (Pflegeversicherung) of ${EN.pct(PV.satz, 1)} is paid by the pensioner alone, ${EN.pct(pvKl, 1)} without children. On a €1,600 pension that is ${EN.eur(n16.sozial, 2)} a month, or ${EN.eur(k16.sozial, 2)} without children. If your fund raises its extra rate, pensioners feel it only from the second month after the change. Both contributions are deductible as special expenses and reduce the income tax on the pension. Parents with several children under 25 pay ${EN.num(PV.kind_abschlag * 100, 2)} percentage points less for care for each child from the second.`,
    faqs: [
      { q: 'Who pays the health insurance contribution on a German pension?', a: `You and the pension insurer, half each. Of the general ${EN.pct(KV.allgemein, 1)} you pay ${EN.pct(halbAllg, 1)}, and of your fund’s extra rate also half. The pension insurer carries the other half on top of your pension. Long-term care is not split this way: pensioners pay the whole care contribution themselves.` },
      { q: 'What do health and care cost on a German pension of €1,600?', a: `With the average extra rate and children, ${EN.eur(n16.kv, 2)} for health insurance and ${EN.eur(n16.pv, 2)} for care, ${EN.eur(n16.sozial, 2)} a month or ${EN.eur(jahr16, 2)} a year. Without children the care part rises to ${EN.eur(k16.pv, 2)}. Before income tax ${EN.eur(n16.nettoVorSteuer, 2)} is left, or ${EN.eur(k16.nettoVorSteuer, 2)} without children.` },
      { q: 'When does a higher extra rate reach my pension payment?', a: 'Not straight away. For pensioners a new extra rate applies from the first day of the second month after the change. If your fund raises it on 1 January, your pension payment falls on 1 March. A cut in the rate takes effect with the same delay. So for February the old rate is still deducted, and the change shows on your pension payment from March.' },
      { q: 'Why do pensioners without children pay more for long-term care?', a: `Because people without children pay a surcharge of ${EN.num(PV.kinderlos_zuschlag * 100, 1)} percentage points from age 23, and it continues in retirement. Only people born before 1940 are exempt. The rate goes from ${EN.pct(PV.satz, 1)} to ${EN.pct(pvKl, 1)}, which is ${EN.eur(k16.pv - n16.pv, 2)} more a month on €1,600. One child is enough to avoid it, whatever the child’s age.` },
      { q: 'Is there a care discount for pensioners with several young children?', a: `Yes, while the children are under 25. For the second to the fifth child the care rate falls by ${EN.num(PV.kind_abschlag * 100, 2)} percentage points each. With three children under 25 you pay ${EN.pct(pvKinder(3), 2)} instead of ${EN.pct(PV.satz, 1)}. It is rare among pensioners because their children are usually older; the discount for a child ends when that child turns 25.` },
      { q: 'Can I deduct pension health and care contributions from my taxes?', a: `Yes, as special expenses under section 10 of the Income Tax Act. On €1,600 a month starting in 2026, ${EN.eur(jahr16)} of contributions a year cut taxable income from ${EN.eur(zveOhne)} to ${EN.eur(n16.zve)}. The tax is then ${EN.eur(steuerMit)} a year. Without this deduction the point at which pensioners start paying tax would be much lower.` },
    ],
    body: (h) => `
<h2>Who pays which part</h2>
<p>Pensioners’ health insurance (Krankenversicherung der Rentner, KVdR) is compulsory statutory health insurance for pensioners who meet the conditions of ${h.src('sgb5_5', 'section 5 SGB V')}; your health fund can tell you whether you qualify. If you are used to a tax-funded health service, the German model works differently: you pay a percentage of the pension, and the amount follows the pension. For everyone in statutory insurance, the contribution is split like this:</p>
${h.table(['Contribution', 'Total rate', 'Your share', 'Pension insurer’s share'], [
  ['Health insurance, general rate', h.pct(h.P.kv.allgemein, 1), h.pct(halbAllg, 1), h.pct(halbAllg, 1)],
  ['Extra rate (2026 average)', h.pct(h.P.kv.zusatz_durchschnitt_2026, 1), h.pct(halbZusatz, 2), h.pct(halbZusatz, 2)],
  ['Long-term care, with a child', h.pct(h.P.pv.satz, 1), h.pct(h.P.pv.satz, 1), h.pct(0, 0)],
  ['Long-term care, no child', h.pct(pvKl, 1), h.pct(pvKl, 1), h.pct(0, 0)],
], 'Contribution rates on the statutory pension in 2026', ['l', 'r', 'r', 'r'])}
<p>The general rate is set in ${h.src('sgb5_241', 'section 241 SGB V')}, its application to pensions in ${h.src('sgb5_247', 'section 247')}, and the pension insurer’s half in ${h.src('sgb5_249a', 'section 249a')}. Care follows ${h.src('sgb11_55', 'section 55 SGB XI')} with the surcharge for people without children; ${h.src('sgb11_59', 'section 59 SGB XI')} makes pensioners pay it alone.</p>
<h2>Deductions by pension amount</h2>
${h.table(['Gross pension', 'Health', 'Care with a child', 'Total', 'Total, no child'], stufen.map(({ b, e, k }) => [h.eur(b), h.eur(e.kv, 2), h.eur(e.pv, 2), h.eur(e.sozial, 2), h.eur(k.sozial, 2)]), 'Average extra rate 2026', ['r', 'r', 'r', 'r', 'r'])}
<p>Across this table the contributions rise in step with the pension: about ${h.pct(n16.kvSatz + n16.pvSatz, 2)} with a child and ${h.pct(k16.kvSatz + k16.pvSatz, 2)} without. To include income tax, use the ${h.a('rentenrechner-brutto-netto', 'gross to net pension calculator')}, which also takes the start year.</p>
<h2>Your fund’s extra rate</h2>
<p>Everyone pays the same general rate, but each fund sets its own extra rate; the ${h.pct(h.P.kv.zusatz_durchschnitt_2026, 1)} average is only a reference figure. Two examples on €1,600 with children: at an extra rate of 2.5% you pay ${h.eur(z25.kv, 2)} to the fund, at 3.5% ${h.eur(z35.kv, 2)}. The gap of ${h.eur(z35.kv - z25.kv, 2)} a month comes to ${h.eur((z35.kv - z25.kv) * 12, 2)} a year, because you carry only half of the extra rate.</p>
<p>When the fund changes its rate, pensioners see it from the second calendar month afterwards. Until then the deduction stays as it was. It is worth knowing your fund’s current rate: each percentage point of extra rate costs you ${h.eur(1600 * 0.01 * h.P.kv.rentner_anteil, 2)} a month on a €1,600 pension.</p>
<h2>Pension increases: the contribution rises too</h2>
<p>Because the contributions are a fixed percentage of the pension, every pension adjustment carries them along. On 1 July 2026 pensions rose by ${h.pct(h.P.rentenwert.anpassung_2026, 2)}. €1,600 became ${h.eur(nachJuli, 2)} gross, ${h.eur(nachJuli - R, 2)} more. Of that, ${h.eur(nj.sozial - n16.sozial, 2)} went to health and care insurance, leaving ${h.eur(nj.nettoVorSteuer - n16.nettoVorSteuer, 2)} more a month before tax. The increase announced in the pension notice therefore never reaches your account in full. When you compare two years, look at the gross amount and the amount paid out separately.</p>
<h2>Long-term care: paid alone</h2>
<p>The pension insurer does not share the care contribution. With a child it is ${h.pct(h.P.pv.satz, 1)}, without ${h.pct(pvKl, 1)}, for people without children aged 23 or over and born after 1939. Parents with several children under 25 pay less:</p>
${h.table(['Children under 25', 'Care rate', 'Care contribution on €1,600'], kinderReihe.map((r) => [h.num(r.n), h.pct(r.s, 2), h.eur(r.b, 2)]), 'Discount from the 2nd to the 5th child, only while the child is under 25', ['r', 'r', 'r'])}
<p>The mini calculator above only knows “at least one child” or “none” and leaves the discount for several young children out. Someone retiring at 63 with two children under 25 pays ${h.eur(kinderReihe[0].b - kinderReihe[1].b, 2)} a month less under the table, as long as both are under 25.</p>
<h2>Contributions and income tax</h2>
<p>Health and care contributions reduce your taxable income (${h.src('estg_10', 'section 10 Income Tax Act')}). On €1,600 a month starting in 2026 they total ${h.eur(jahr16)} a year. Without this deduction taxable income would be ${h.eur(zveOhne)}; with it, ${h.eur(n16.zve)}, and the tax is ${h.eur(steuerMit)}. The pension at which tax starts is on ${h.a('steuerfreie-rente', 'tax-free pension limit')}.</p>
<h2>What this page does not cover</h2>
<p>All figures apply to the statutory pension of people in statutory health insurance. If you are privately insured, nothing is paid from the pension to a statutory fund; your premium follows your contract. Contributions on company pensions or other income are not covered either, and neither is health cover for pensioners who move abroad, which depends on where you live. Clarify how you will be insured in retirement with your health fund before you file the ${h.a('rente-beantragen', 'pension application')}.</p>`,
  },
});
