import { defineGuide } from '../../lib/guide-types';
import { besondersAlter, regelalter, beginn, fmtMonat, fmtAlter, abschlag, optionen, abschlagBei } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/** Rente nach 45 Beitragsjahren: Altersgrenze je Jahrgang 1953 bis 1964, Vorsprung vor der Regelaltersgrenze, Vergleich der Wege. Alles aus dem Motor. */
const WZ = P.altersgrenzen.besonders_wartezeit_jahre;
const AB = P.zugangsfaktor.abschlag_monat;
const FRIST = P.antrag.frist_monate;
const RENTE = 1700;
const geb = (j: number) => ({ jahr: j, monat: 6, tag: 15 });
const reihe = [1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964].map((j) => {
  const b = besondersAlter(j), r = regelalter(j);
  const start = beginn(geb(j), b);
  return { j, b, r, start, vor: beginn(geb(j), r) - start };
});
const z53 = reihe[0];
const z57 = reihe.find((x) => x.j === 1957)!;
const z60 = reihe.find((x) => x.j === 1960)!;
const z62 = reihe.find((x) => x.j === 1962)!;
const z64 = reihe[reihe.length - 1];
/** Dieselben Monate über die Rente nach 35 Jahren vorgezogen. */
const ab35 = abschlag(z64.vor);
const minus35 = RENTE * ab35;
const mehrZahlungen = RENTE * z64.vor;
/** Jahrgang 1964, alle Wege (Geburtstag 15. Juni). */
const opts64 = optionen(geb(1964), { wz35: true, wz45: true, schwb: false });
const lj64 = opts64.find((o) => o.art === 'langjaehrig')!;
const mit63 = abschlagBei(opts64, lj64.frueh)!;
/** Geburtstag am Ersten gegen Geburtstag am 15. (März 1964). */
const amErsten = beginn({ jahr: 1964, monat: 3, tag: 1 }, besondersAlter(1964));
const amFuenfzehnten = beginn({ jahr: 1964, monat: 3, tag: 15 }, besondersAlter(1964));

export default defineGuide({
  id: 'rente-nach-45-jahren',
  group: 'beginn',
  order: 20,
  mini: 'jahre45',
  miniHref: 'rentenbeginn-rechner',
  related: ['wartezeit-45-jahre', 'rente-mit-63', 'renteneintrittsalter-tabelle', 'arbeitslos-vor-der-rente', 'rentenreform', 'jahrgang-1962'],
  sources: ['sgb6_38', 'sgb6_236b', 'sgb6_51', 'sgb6_77', 'sgb6_99', 'bgb_187', 'drvReform', 'bmasKommission', 'vo883'],
  de: {
    slug: 'rente-nach-45-jahren',
    nav: 'Rente nach 45 Jahren',
    card: 'Ohne Abschlag zwei Jahre vor der Regelaltersgrenze: die Altersgrenze je Jahrgang.',
    title: 'Rente nach 45 Beitragsjahren 2026: Tabelle je Jahrgang',
    description: 'Rente nach 45 Beitragsjahren 2026: ohne Abschlag mit 64 bis 65 je Jahrgang, nie früher. Tabelle 1953 bis 1964, Startmonat, Vergleich mit 35 Jahren, Reform.',
    h1: 'Rente nach 45 Beitragsjahren: Altersgrenze und Startmonat',
    intro: 'Wer 45 Jahre zusammenbringt, geht ohne Abschlag zwei Jahre vor der Regelaltersgrenze. Der Rechner zeigt das Alter für Ihren Jahrgang.',
    resume: `Die Altersrente für besonders langjährig Versicherte setzt ${WZ} Jahre auf dem Rentenkonto voraus und zahlt ohne Abschlag, allerdings erst ab einer festen Altersgrenze und keinen Monat davor (§ 38 und § 236b SGB VI). Für den Jahrgang 1953 lag diese Grenze bei ${fmtAlter(z53.b, 'de')}; seitdem steigt sie um zwei Monate je Geburtsjahr. Der Jahrgang 1960 erreicht sie mit ${fmtAlter(z60.b, 'de')}, der Jahrgang 1962 mit ${fmtAlter(z62.b, 'de')}, ab Jahrgang 1964 gilt dauerhaft ${fmtAlter(z64.b, 'de')}. Ab dem Jahrgang 1958 liegt diese Rente damit immer ${DE.num(z64.vor)} Monate vor der Regelaltersgrenze. Wer dieselben ${DE.num(z64.vor)} Monate über die Rente nach 35 Jahren vorzieht, verliert dauerhaft ${DE.pct(ab35, 1)}, bei ${DE.eur(RENTE)} Rente also ${DE.eur(minus35, 2)} in jedem Monat. Die 45 Jahre sind deshalb bares Geld. Die Alterssicherungskommission hat im Juni 2026 vorgeschlagen, diese Rente abzuschaffen; das ist ein Vorschlag, kein geltendes Recht.`,
    faqs: [
      { q: 'Ab welchem Alter gibt es die Rente nach 45 Beitragsjahren für den Jahrgang 1962?', a: `Mit ${fmtAlter(z62.b, 'de')}. Wer am 15. Juni 1962 geboren ist, bekommt die erste Zahlung für ${fmtMonat(z62.start, 'de')}, sofern der Antrag rechtzeitig gestellt ist. Das sind ${DE.num(z62.vor)} Monate vor der Regelaltersgrenze von ${fmtAlter(z62.r, 'de')}. Einen früheren Beginn mit Abschlag kennt diese Rentenart nicht; dafür müsste man auf die Rente nach 35 Jahren ausweichen.` },
      { q: 'Kann ich die Rente nach 45 Jahren mit Abschlag vorziehen?', a: `Nein. Diese Rente gibt es nur ab ihrer Altersgrenze, nie davor. Wer früher aufhören will, nimmt die Altersrente für langjährig Versicherte, und deren Abschlag rechnet bis zur Regelaltersgrenze, nicht bis zur 45-Jahre-Grenze. Für den Jahrgang 1964 heißt ein Beginn mit 63 deshalb ${DE.num(mit63.monate)} Monate und ${DE.pct(mit63.abschlag, 1)} Abschlag, obwohl 45 Jahre auf dem Konto stehen.` },
      { q: 'Was bringt mir die Rente nach 45 Jahren im Vergleich zur Rente nach 35 Jahren?', a: `Den Abschlag. Beide Renten erlauben einen Beginn zwei Jahre vor der Regelaltersgrenze, doch nur die Rente nach ${WZ} Jahren zahlt dann den vollen Betrag. Über die Rente nach 35 Jahren kosten dieselben ${DE.num(z64.vor)} Monate ${DE.pct(ab35, 1)}, lebenslang und auch für eine spätere Witwen- oder Witwerrente aus dieser Rente. Bei ${DE.eur(RENTE)} sind das ${DE.eur(minus35, 2)} weniger im Monat.` },
      { q: 'Wann muss ich den Antrag für die Rente nach 45 Jahren stellen?', a: `Am besten drei bis vier Monate vor dem gewünschten Beginn. Die Rente startet im Monat nach Erreichen der Altersgrenze, wenn der Antrag innerhalb von ${FRIST} Kalendermonaten danach eingeht; später gestellt, zahlt sie erst ab dem Antragsmonat. Frühestens geht der Antrag ein Jahr vor Rentenbeginn. Vorher lohnt die Kontenklärung, damit jede Lücke in den ${WZ} Jahren auffällt.` },
      { q: 'Darf ich nach Beginn der Rente nach 45 Jahren noch arbeiten?', a: 'Ja, ohne Grenze für den Verdienst; die Hinzuverdienstgrenzen für Altersrenten gibt es seit 2023 nicht mehr. Als Beschäftigter zahlen Sie weiter Rentenbeiträge, die neuen Entgeltpunkte kommen jeweils zum 1. Juli des Folgejahres auf die Rente. Die steuerfreie Aktivrente greift aber erst nach der Regelaltersgrenze, also nicht in den zwei Jahren davor.' },
      { q: 'Bleibt die Rente nach 45 Jahren bestehen, wenn die Reform kommt?', a: 'Das ist offen. Die Alterssicherungskommission empfiehlt in ihrem Bericht vom 23. Juni 2026, diese Rente möglichst bald und mit Vertrauensschutz abzuschaffen. Ein Gesetzentwurf ist nicht veröffentlicht, Stichtage und Übergänge stehen nirgends fest. Maßgeblich ist das Recht am Tag des Rentenbeginns; ein früh gestellter Antrag ändert daran nach Auskunft der Rentenversicherung nichts.' },
    ],
    body: (h) => `
<h2>Altersgrenze nach 45 Jahren, Jahrgang für Jahrgang</h2>
<p>Die Tabelle zeigt für jeden Jahrgang ab 1953, mit welchem Alter die Rente nach ${WZ} Jahren abschlagsfrei beginnt, welcher Monat bei einem Geburtstag am 15. Juni der erste Rentenmonat ist und wie weit dieser Termin vor der Regelaltersgrenze liegt (${h.src('sgb6_236b', '§ 236b SGB VI')}, ab 1964 ${h.src('sgb6_38', '§ 38 SGB VI')}).</p>
${h.table(['Jahrgang', 'Ohne Abschlag mit', 'Erster Rentenmonat', 'Monate vor der Regelaltersgrenze'], reihe.map((x) => [x.j >= 1960 ? h.a(`jahrgang-${x.j}`, x.j === 1964 ? 'ab 1964' : String(x.j)) : String(x.j), fmtAlter(x.b, 'de'), fmtMonat(x.start, 'de'), h.num(x.vor)]), `Geburtstag am 15. Juni, ${WZ} Jahre erfüllt`, ['l', 'l', 'l', 'r'])}
<p>Auffällig ist die letzte Spalte. Für den Jahrgang 1953 lag die Rente nach ${WZ} Jahren noch ${h.num(z53.vor)} Monate vor der Regelaltersgrenze, für 1957 waren es ${h.num(z57.vor)}. Der Grund: Die Grenze für ${WZ} Jahre stieg in diesen Jahrgängen um zwei Monate, die Regelaltersgrenze nur um einen. Ab dem Jahrgang 1958 wachsen beide im gleichen Takt, der Abstand bleibt bei ${h.num(z64.vor)} Monaten. Die Zeilen bis 1959 sind Geschichte, die Jahrgänge ab 1961 haben ihren Termin noch vor sich.</p>
<h2>Kein Monat früher: die starre Grenze</h2>
<p>Anders als die Rente nach 35 Jahren lässt sich die Rente nach ${WZ} Jahren nicht vorziehen, auch nicht gegen Abschlag. Wer vor der Grenze aufhören will, muss die Rentenart wechseln, und dann zählt die Regelaltersgrenze als Bezugspunkt. Für den Jahrgang 1964 ergibt das folgende Lage (Geburtstag 15. Juni):</p>
${h.table(['Weg', 'Frühester Beginn', 'Abschlag beim frühesten Beginn'], [[h.a('langjaehrig-versicherte', 'Rente nach 35 Jahren'), fmtMonat(lj64.frueh, 'de'), h.pct(mit63.abschlag, 1)], [`Rente nach ${WZ} Jahren`, fmtMonat(z64.start, 'de'), 'keiner'], ['Regelaltersrente', fmtMonat(beginn(geb(1964), z64.r), 'de'), 'keiner']], 'Jahrgang 1964, 35 und 45 Jahre erfüllt', ['l', 'l', 'r'])}
<p>Wer also mit ${WZ} Jahren schon mit 63 geht, verschenkt den Vorteil fast vollständig: ${h.num(mit63.monate)} Monate zu je ${h.pct(AB, 1)}, gerechnet nach ${h.src('sgb6_77', '§ 77 SGB VI')}. Zwei Jahre Warten auf die abschlagsfreie Grenze ersparen in diesem Fall den gesamten Abschlag. Ob die Überbrückung durch Arbeitslosengeld vor dem Rentenbeginn die ${WZ} Jahre gefährdet, klärt ${h.a('arbeitslos-vor-der-rente', 'Arbeitslos vor der Rente')}.</p>
<h2>Was der Vorsprung in Euro bedeutet</h2>
<p>Zwei Jahre früher und ohne Kürzung heißt bei ${h.eur(RENTE)} Monatsrente: ${h.num(z64.vor)} zusätzliche Zahlungen, zusammen ${h.eur(mehrZahlungen)} brutto, ohne dass die spätere Rente kleiner wird. Kleiner wird sie nur um die Entgeltpunkte, die in diesen zwei Jahren nicht mehr entstehen. Der Vergleich mit dem 35-Jahre-Weg zum selben Termin zeigt den eigentlichen Wert der ${WZ} Jahre: ${h.eur(minus35, 2)} im Monat, die dort für immer fehlen würden, nach zwanzig Rentenjahren ${h.eur(minus35 * 240)}. Mit eigenen Beträgen rechnet der ${h.a('abschlag-rechner', 'Abschlagsrechner')}.</p>
<h2>Der genaue Startmonat</h2>
<p>Das Alter ist nach ${h.src('bgb_187', '§ 187 Abs. 2 BGB')} mit dem Ablauf des Tages vor dem Geburtstag vollendet, die Rente beginnt im folgenden Monat (${h.src('sgb6_99', '§ 99 SGB VI')}). Daraus folgt eine Eigenheit für alle, die am Ersten eines Monats geboren sind: Wer am 1. März 1964 Geburtstag hat, vollendet die 65 schon Ende Februar und bekommt die Rente ab ${fmtMonat(amErsten, 'de')}; mit Geburtstag am 15. März beginnt sie erst ${fmtMonat(amFuenfzehnten, 'de')}.</p>
<p>Der Antrag muss innerhalb von ${FRIST} Kalendermonaten nach Erreichen der Altersgrenze eingehen, sonst beginnt die Rente erst mit dem Antragsmonat, und verlorene Monate werden nicht nachgezahlt. Gestellt werden kann er frühestens ein Jahr vor dem Beginn. Den Ablauf beschreibt ${h.a('rente-beantragen', 'Rente beantragen')}.</p>
<h2>Welche Jahre in die 45 eingehen</h2>
<p>Die ${WZ} Jahre sind strenger als die 35: Es zählen Pflichtbeiträge, Kindererziehung bis zum 10. Lebensjahr des Kindes, Pflege sowie Arbeitslosengeld, Krankengeld und Übergangsgeld, Arbeitslosengeld in den letzten zwei Jahren vor Rentenbeginn aber nur nach Insolvenz oder vollständiger Geschäftsaufgabe des Arbeitgebers (${h.src('sgb6_51', '§ 51 Abs. 3a SGB VI')}). Bürgergeld, Schule und Studium zählen nicht. Die Einzelheiten mit Rechenbeispielen stehen unter ${h.a('wartezeit-45-jahre', 'Wartezeit 45 Jahre: was zählt')}.</p>
<h2>Der Reformvorschlag</h2>
<p>Die Alterssicherungskommission hat am 23. Juni 2026 ihren Bericht mit ${h.P.reform.empfehlungen} Empfehlungen vorgelegt (${h.src('bmasKommission', 'Bundesarbeitsministerium')}). Eine davon: die Rente für besonders langjährig Versicherte so früh wie möglich abschaffen, mit Vertrauensschutz. Ein Gesetzentwurf liegt nicht vor. Nach Auskunft der Rentenversicherung gilt bis dahin allein das geltende Recht, und zwar das Recht zum Zeitpunkt des Rentenbeginns (${h.src('drvReform', 'Deutsche Rentenversicherung')}). Was sich für die einzelnen Wege ändern würde, vergleicht ${h.a('rentenreform', 'Rentenreform')}; die Tabelle aller Altersgrenzen steht unter ${h.a('renteneintrittsalter-tabelle', 'Renteneintrittsalter-Tabelle')}.</p>`,
  },
  en: {
    slug: 'pension-after-45-years',
    nav: 'Pension after 45 years',
    card: 'No reduction two years before the standard age: the age limit by birth year.',
    title: 'Pension after 45 years 2026: age limit by birth year',
    description: 'Pension after 45 years of contributions in Germany, 2026: unreduced at 64 to 65 by birth year, never earlier. Table 1953 to 1964, first month, reform plan.',
    h1: 'German pension after 45 years: age limit and first month',
    intro: 'With 45 qualifying years you retire unreduced two years before the standard age. The calculator shows the exact age for your birth year.',
    resume: `The pension for especially long-term insured persons (Altersrente für besonders langjährig Versicherte) requires ${WZ} qualifying years and pays the full amount, but only from a fixed age and not one month before (sections 38 and 236b of Book VI of the Social Code, SGB VI). For people born in 1953 that age was ${fmtAlter(z53.b, 'en')}; it has risen by two months for each birth year since. The 1960 cohort reaches it at ${fmtAlter(z60.b, 'en')}, the 1962 cohort at ${fmtAlter(z62.b, 'en')}, and from 1964 it is fixed at ${fmtAlter(z64.b, 'en')}. From the 1958 cohort on, this pension therefore always starts ${EN.num(z64.vor)} months before the standard retirement age. Taking the same ${EN.num(z64.vor)} months early through the 35-year pension would cost ${EN.pct(ab35, 1)} for life, which on a ${EN.eur(RENTE)} pension means ${EN.eur(minus35, 2)} less every month. The 45 years are worth real money. In June 2026 the pension commission proposed abolishing this pension; it is a proposal, not law.`,
    faqs: [
      { q: 'At what age can someone born in 1962 draw the 45-year pension?', a: `At ${fmtAlter(z62.b, 'en')}. If your birthday is 15 June 1962, the first payment is for ${fmtMonat(z62.start, 'en')}, as long as you apply in time. That is ${EN.num(z62.vor)} months before your standard age of ${fmtAlter(z62.r, 'en')}. This pension has no earlier start with a reduction; for that you would have to switch to the 35-year pension.` },
      { q: 'Can I take the 45-year pension early and accept a reduction?', a: `No. It exists only from its own age limit. If you want to stop earlier, you need the pension for long-term insured persons, and its reduction is measured to the standard retirement age, not to the 45-year limit. Born in 1964 and starting at 63, that means ${EN.num(mit63.monate)} months and a ${EN.pct(mit63.abschlag, 1)} cut, even with 45 years on your record.` },
      { q: 'Do years worked outside Germany help me reach the 45 years?', a: 'Insurance periods from other EU and EEA states and Switzerland are added to German periods when the qualifying period is checked, under Regulation 883/2004. Whether a given foreign period is treated like a German compulsory contribution period is decided by the German pension insurance, so ask an advice centre (Beratungsstelle) before you plan around it. The German pension is paid only on your German periods.' },
      { q: 'How much more is the 45-year pension worth than the 35-year one?', a: `Exactly the reduction. Both can start two years before the standard age, but only the 45-year pension pays in full at that point. Through the 35-year pension the same ${EN.num(z64.vor)} months cost ${EN.pct(ab35, 1)} for life, and the cut also carries over to any widow’s or widower’s pension derived from it. On ${EN.eur(RENTE)} that is ${EN.eur(minus35, 2)} a month.` },
      { q: 'When should I file the application for the 45-year pension?', a: `Three to four months before you want it to start is a sensible margin. It begins the month after you reach the age limit if the application arrives within ${FRIST} calendar months; filed later, it starts only in the month of application. You can apply at the earliest one year in advance. Have your record checked first (Kontenklärung) so gaps in the ${WZ} years come to light.` },
      { q: 'Is the 45-year pension being abolished by the 2026 reform?', a: 'Not yet. The pension commission recommended on 23 June 2026 abolishing it as soon as possible while protecting legitimate expectations. No draft bill has been published, and no cut-off dates exist. Your pension follows the law in force on the day it starts, and the pension insurance has made clear that applying early does not lock in the current rules.' },
    ],
    body: (h) => `
<h2>Age limit after 45 years, birth year by birth year</h2>
<p>For each cohort from 1953, the table gives the age at which the 45-year pension starts without a reduction, the first pension month for a birthday on 15 June, and how far that date lies ahead of the standard retirement age, the Regelaltersgrenze (${h.src('sgb6_236b', 'section 236b SGB VI')}, from 1964 ${h.src('sgb6_38', 'section 38 SGB VI')}).</p>
${h.table(['Born', 'Unreduced at', 'First pension month', 'Months before standard age'], reihe.map((x) => [x.j >= 1960 ? h.a(`jahrgang-${x.j}`, x.j === 1964 ? '1964 and later' : String(x.j)) : String(x.j), fmtAlter(x.b, 'en'), fmtMonat(x.start, 'en'), h.num(x.vor)]), `Birthday 15 June, ${WZ} years completed`, ['l', 'l', 'l', 'r'])}
<p>Look at the last column. For the 1953 cohort the 45-year pension came ${h.num(z53.vor)} months before the standard age; for 1957 it was ${h.num(z57.vor)}. In those years the 45-year limit rose by two months per cohort while the standard age rose by only one. From 1958 both move in step and the gap stays at ${h.num(z64.vor)} months. Rows up to 1959 are history; people born from 1961 onwards still have their date ahead of them.</p>
<h2>A hard limit with no early option</h2>
<p>Unlike the 35-year pension, the 45-year pension cannot be brought forward, not even with a reduction. To stop earlier you change pension type, and the reduction is then measured against the standard age. For someone born on 15 June 1964 who has both 35 and 45 years, the choice looks like this:</p>
${h.table(['Route', 'Earliest start', 'Reduction at earliest start'], [[h.a('langjaehrig-versicherte', '35-year pension'), fmtMonat(lj64.frueh, 'en'), h.pct(mit63.abschlag, 1)], [`${WZ}-year pension`, fmtMonat(z64.start, 'en'), 'none'], ['Standard pension', fmtMonat(beginn(geb(1964), z64.r), 'en'), 'none']], 'Born 1964, 35 and 45 years completed', ['l', 'l', 'r'])}
<p>So with ${WZ} years, stopping at 63 throws the advantage away almost entirely: ${h.num(mit63.monate)} months at ${h.pct(AB, 1)} each, under ${h.src('sgb6_77', 'section 77 SGB VI')}. Waiting two more years for the unreduced limit removes the whole cut. If you plan to bridge the gap with unemployment benefit (Arbeitslosengeld), read ${h.a('arbeitslos-vor-der-rente', 'unemployed before retirement')} first, because benefit in the final two years usually does not count.</p>
<h2>The head start in euros</h2>
<p>Two years earlier with no reduction means, on a ${h.eur(RENTE)} monthly pension, ${h.num(z64.vor)} extra payments worth ${h.eur(mehrZahlungen)} gross, while the later pension is not cut. It is only smaller by the pension points you would have earned in those two years. The real value of the ${WZ} years shows against the 35-year route on the same date: ${h.eur(minus35, 2)} a month lost for good, ${h.eur(minus35 * 240)} over twenty years. Note that this is gross; health and long-term care contributions and income tax still come off, and the ${h.a('rentenrechner-brutto-netto', 'net pension calculator')} shows what reaches your account.</p>
<h2>The exact first month</h2>
<p>Under ${h.src('bgb_187', 'section 187(2) of the Civil Code')} you complete an age at the end of the day before your birthday, and the pension starts the following month (${h.src('sgb6_99', 'section 99 SGB VI')}). If you were born on the 1st of a month, that moves everything forward: born on 1 March 1964, you complete 65 at the end of February and receive the pension from ${fmtMonat(amErsten, 'en')}; born on 15 March, it starts in ${fmtMonat(amFuenfzehnten, 'en')}.</p>
<p>The application must arrive within ${FRIST} calendar months of reaching the limit, otherwise the pension starts only in the month you apply and the missed months are not paid. The earliest you can apply is one year ahead, so a request filed today for a start in three years is not possible. Step by step: ${h.a('rente-beantragen', 'applying for your pension')}.</p>
<h2>Which years go into the 45</h2>
<p>The ${WZ}-year test is stricter than the 35-year one. Compulsory contributions count, as do child-raising until the child turns 10, caring for a relative, and periods of unemployment, sickness or transitional benefit. Unemployment benefit in the last two years before the pension only counts after the employer’s insolvency or complete closure (${h.src('sgb6_51', 'section 51(3a) SGB VI')}). Citizen’s benefit (Bürgergeld), school and university do not count. EU periods are added under ${h.src('vo883', 'Regulation 883/2004')}. The detail, with worked cases, is under ${h.a('wartezeit-45-jahre', 'what counts towards 45 years')}.</p>
<h2>The reform proposal</h2>
<p>The pension commission (Alterssicherungskommission) presented its report with ${h.P.reform.empfehlungen} recommendations on 23 June 2026 (${h.src('bmasKommission', 'Federal Ministry of Labour')}). One of them is to abolish the pension for especially long-term insured persons as early as possible, with protection of legitimate expectations. There is no draft bill. According to the pension insurance, only current law applies until then, namely the law in force when your pension begins (${h.src('drvReform', 'German pension insurance')}). How each route would change is compared under ${h.a('rentenreform', 'pension reform')}; every age limit in one place is in the ${h.a('renteneintrittsalter-tabelle', 'retirement age table')}.</p>`,
  },
});
