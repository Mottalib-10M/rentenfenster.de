import { defineGuide } from '../../lib/guide-types';
import { besondersAlter, optionen, abschlagBei, beginn, fmtMonat, fmtAlter } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/** Was auf die 45 Jahre zählt (§ 51 Abs. 3a SGB VI): Rechenfälle wie im Mini-Rechner, Kosten des Verfehlens. */
const WZ = P.altersgrenzen.besonders_wartezeit_jahre;
const WZ35 = P.altersgrenzen.langjaehrig_wartezeit_jahre;
const RENTE = 1600;
/** Gleiche Rechnung wie der Mini-Rechner wartezeit45: Arbeitslosengeld der letzten 2 Jahre fällt heraus. */
const zaehlt = (b: number, k: number, a: number, z: number) => {
  const alg = Math.max(0, a - Math.min(z, 2, a));
  return { alg, raus: a - alg, sum: b + k + alg };
};
const fallA = zaehlt(40, 3, 2, 1);
const fallB = zaehlt(40, 3, 2, 0);
const fallC = zaehlt(41, 2, 3, 2);
/** Jahrgang 1964, Geburtstag 15. Juni: Beginn zur 45-Jahre-Grenze mit und ohne erfüllte 45 Jahre. */
const g = { jahr: 1964, monat: 6, tag: 15 };
const b64 = besondersAlter(1964);
const start = beginn(g, b64);
const ohne45 = abschlagBei(optionen(g, { wz35: true, wz45: false, schwb: false }), start)!;

export default defineGuide({
  id: 'wartezeit-45-jahre',
  group: 'beginn',
  order: 25,
  mini: 'wartezeit45',
  miniHref: 'rentenbeginn-rechner',
  related: ['rente-nach-45-jahren', 'arbeitslos-vor-der-rente', 'langjaehrig-versicherte', 'rente-mit-63', 'renteninformation', 'rentenreform'],
  sources: ['sgb6_51', 'sgb6_38', 'sgb6_236b', 'sgb6_77', 'vo883', 'drvReform', 'bmasKommission'],
  de: {
    slug: 'wartezeit-45-jahre-was-zaehlt',
    nav: 'Was für 45 Jahre zählt',
    card: 'Welche Zeiten auf die 45 Jahre angerechnet werden und wo Lebensläufe scheitern.',
    title: 'Rente mit 45 Beitragsjahren 2026: was zählt, was nicht',
    description: 'Rente mit 45 Beitragsjahren 2026: was zählt und was nicht, von Kindererziehung bis Arbeitslosengeld in den letzten zwei Jahren, mit drei Rechenbeispielen.',
    h1: 'Wartezeit 45 Jahre: welche Zeiten zählen',
    intro: 'Für die abschlagsfreie Rente nach 45 Jahren zählt nicht jede Zeit im Versicherungsverlauf. Der Rechner prüft, ob Ihre Jahre reichen.',
    resume: `Für die Altersrente für besonders langjährig Versicherte müssen ${WZ} Jahre, also ${DE.num(WZ * 12)} Monate, aus einem engen Katalog zusammenkommen (§ 51 Abs. 3a SGB VI). Es zählen Pflichtbeiträge aus Beschäftigung oder Tätigkeit, Kindererziehung bis zum 10. Geburtstag des Kindes, Pflege, Zeiten mit Arbeitslosengeld, Krankengeld oder Übergangsgeld sowie freiwillige Beiträge, wenn mindestens 18 Jahre Pflichtbeiträge vorliegen. Nicht zählen Bürgergeld und das frühere Arbeitslosengeld II, Schule, Studium und Zeiten aus dem Versorgungsausgleich oder Rentensplitting. Die wichtigste Falle liegt kurz vor der Rente: Arbeitslosengeld in den letzten zwei Jahren vor Rentenbeginn zählt nur, wenn der Arbeitgeber insolvent ist oder den Betrieb ganz aufgegeben hat. Wer 40 Jahre gearbeitet, 3 Jahre Kinder erzogen und 2 Jahre Arbeitslosengeld bezogen hat, davon eines in diesem Zeitraum, kommt nur auf ${DE.num(fallA.sum)} Jahre. Ohne die 45 kostet derselbe Rentenbeginn ab Jahrgang 1964 ${DE.pct(ohne45.abschlag, 1)} Abschlag.`,
    faqs: [
      { q: 'Zählen Studium und Ausbildung für die Rente nach 45 Jahren?', a: 'Das Studium nicht, die Schule auch nicht. Eine betriebliche Ausbildung zählt dagegen, wenn in dieser Zeit Pflichtbeiträge gezahlt wurden, denn für die 45 Jahre entscheidet die Beitragspflicht. Wer nach dem Abitur studiert hat, kommt deshalb oft erst mit Mitte 20 in die Zählung und hat bis zur Altersgrenze von 65 kaum genug Zeit für 45 Jahre.' },
      { q: 'Werden Kindererziehungszeiten auf die 45 Jahre angerechnet?', a: `Ja, und zwar großzügiger als bei der Rentenhöhe: Für die 45 Jahre zählt die Erziehung jedes Kindes bis zu dessen 10. Geburtstag als Berücksichtigungszeit. Für die Rentenhöhe zählen dagegen nur ${P.kindererziehung.ab_1992_monate} Monate je Kind ab Geburtsjahr 1992. Ob die Erziehungszeiten im Versicherungsverlauf stehen, zeigt die Kontenklärung; fehlen sie, sollten Sie sie vor dem Rentenantrag nachtragen lassen.` },
      { q: 'Was zählt nicht für die 45 Beitragsjahre?', a: 'Bürgergeld und das frühere Arbeitslosengeld II, Schule und Studium, Zeiten aus dem Versorgungsausgleich nach einer Scheidung oder aus dem Rentensplitting unter Ehegatten. Arbeitslosengeld in den letzten zwei Jahren vor Rentenbeginn zählt nur nach Insolvenz oder vollständiger Geschäftsaufgabe des Arbeitgebers. Freiwillige Beiträge zählen nur, wenn mindestens 18 Jahre Pflichtbeiträge vorhanden sind.' },
      { q: 'Gibt es legale Schlupflöcher für die Rente mit 63 nach 45 Jahren?', a: `Eher Stellschrauben. Arbeitslosengeld zählt, wenn es vor den letzten zwei Jahren liegt; Pflege eines Angehörigen und Kindererziehung bis 10 werden angerechnet, wenn sie im Konto stehen; freiwillige Beiträge zählen nach 18 Pflichtbeitragsjahren. Die Altersgrenze selbst lässt sich nicht umgehen: Ab Jahrgang 1964 gibt es diese Rente frühestens mit ${fmtAlter(b64, 'de')}, nicht mit 63.` },
      { q: 'Was passiert, wenn mir nur wenige Monate an den 45 Jahren fehlen?', a: `Dann gibt es diese Rente nicht, auch nicht anteilig. Zum selben Termin bleibt nur die Rente nach ${WZ35} Jahren mit Abschlag, ab Jahrgang 1964 mit ${DE.pct(ohne45.abschlag, 1)}; bei ${DE.eur(RENTE)} sind das ${DE.eur(RENTE * ohne45.abschlag)} weniger im Monat. Oft hilft es, einige Monate länger zu arbeiten: Jeder weitere Beitragsmonat zählt, und sind die ${WZ} Jahre voll, ist die Rente ohne Abschlag möglich.` },
      { q: 'Zählen Monate mit Krankengeld auf die 45 Jahre?', a: 'Ja. Krankengeld, Übergangsgeld und Arbeitslosengeld stehen in § 51 Abs. 3a SGB VI ausdrücklich auf der Liste. Die Zwei-Jahres-Ausnahme gilt nur für Arbeitslosengeld, nicht für Krankengeld. Wer also kurz vor der Rente länger krank ist und Krankengeld erhält, verliert dadurch keine Monate für die 45 Jahre.' },
    ],
    body: (h) => `
<h2>Der Katalog des § 51 Abs. 3a</h2>
<p>Die 45 Jahre sind eine eigene Wartezeit mit eigener Liste (${h.src('sgb6_51', '§ 51 Abs. 3a SGB VI')}). Was nicht auf der Liste steht, zählt nicht, auch wenn es für die Rentenhöhe oder für die ${WZ35} Jahre der ${h.a('langjaehrig-versicherte', 'Rente für langjährig Versicherte')} berücksichtigt wird.</p>
${h.table(['Zeit', 'Zählt für 45 Jahre', 'Einschränkung'], [
  ['Pflichtbeiträge aus Beschäftigung oder Tätigkeit', 'ja', 'keine'],
  ['Kindererziehung', 'ja', 'bis zum 10. Geburtstag des Kindes'],
  ['Pflege eines Angehörigen', 'ja', 'muss im Versicherungsverlauf erfasst sein'],
  ['Arbeitslosengeld, Krankengeld, Übergangsgeld', 'ja', 'Arbeitslosengeld der letzten 2 Jahre nur nach Insolvenz oder Geschäftsaufgabe'],
  ['Freiwillige Beiträge', 'ja', 'nur mit mindestens 18 Jahren Pflichtbeiträgen; nicht in den letzten 2 Jahren bei gleichzeitiger Arbeitslosigkeit'],
  ['Bürgergeld, Arbeitslosengeld II', 'nein', '–'],
  ['Schule, Studium', 'nein', '–'],
  ['Versorgungsausgleich, Rentensplitting', 'nein', '–'],
], 'Anrechenbare Zeiten für die Rente nach 45 Jahren', ['l', 'l', 'l'])}
<p>Die Tabelle erklärt, warum zwei Menschen mit gleich langem Versicherungsverlauf zu verschiedenen Ergebnissen kommen. Ein Verlauf, der viele Jahre Bürgergeld oder ein langes Studium enthält, erfüllt die ${WZ35} Jahre mühelos und verfehlt die ${WZ} deutlich.</p>
<h2>Drei Rechenfälle</h2>
<p>Der Mini-Rechner oben zieht vom Arbeitslosengeld den Teil ab, der in die letzten zwei Jahre vor dem Rentenbeginn fällt. Drei Lebensläufe zeigen, wie viel davon abhängt:</p>
${h.table(['Fall', 'Pflichtbeiträge', 'Kinder bis 10, Pflege', 'Arbeitslosengeld gesamt / davon in den letzten 2 Jahren', 'Anrechenbar', 'Ergebnis'], [
  ['A', h.num(40), h.num(3), `${h.num(2)} / ${h.num(1)}`, h.num(fallA.sum), fallA.sum >= WZ ? 'erfüllt' : `${h.num(WZ - fallA.sum)} Jahr fehlt`],
  ['B', h.num(40), h.num(3), `${h.num(2)} / ${h.num(0)}`, h.num(fallB.sum), fallB.sum >= WZ ? 'erfüllt' : `${h.num(WZ - fallB.sum)} Jahre fehlen`],
  ['C', h.num(41), h.num(2), `${h.num(3)} / ${h.num(2)}`, h.num(fallC.sum), fallC.sum >= WZ ? 'erfüllt' : `${h.num(WZ - fallC.sum)} Jahre fehlen`],
], 'Jahre; Arbeitgeber weder insolvent noch aufgelöst', ['l', 'r', 'r', 'r', 'r', 'l'])}
<p>Fall A und Fall B unterscheiden sich nur darin, wann das Arbeitslosengeld bezogen wurde. Liegt das zweite Jahr Arbeitslosigkeit vor dem Zwei-Jahres-Fenster, ist die Wartezeit erfüllt, liegt es darin, fehlt ein Jahr. Fall C hat sogar mehr Beitragsjahre als A, verliert aber zwei volle Jahre, weil die Arbeitslosigkeit direkt vor der Rente lag. Hätte der Arbeitgeber Insolvenz angemeldet, zählten diese Jahre mit. Mehr zur Lage nach einer Kündigung kurz vor der Rente unter ${h.a('arbeitslos-vor-der-rente', 'Arbeitslos vor der Rente')}.</p>
<h2>Stellschrauben statt Schlupflöcher</h2>
<p>Die oft gesuchten „Schlupflöcher zur Rente mit 63“ gibt es in dieser Form nicht: Die Altersgrenze steht fest, ab Jahrgang 1964 bei ${fmtAlter(b64, 'de')} (${h.src('sgb6_38', '§ 38 SGB VI')}, für ältere Jahrgänge ${h.src('sgb6_236b', '§ 236b')}). Bei den Jahren gibt es aber Punkte, die man kennen sollte:</p>
<ul>
<li>Kindererziehung und Pflege zählen nur, wenn sie im Versicherungsverlauf stehen. Eine Kontenklärung vor dem Antrag deckt fehlende Zeiten auf; wie man den Verlauf liest, zeigt ${h.a('renteninformation', 'Renteninformation lesen')}.</li>
<li>Freiwillige Beiträge zählen, sobald 18 Jahre Pflichtbeiträge vorhanden sind, etwa für Selbstständige oder Lücken nach dem Ende der Beschäftigung. Ausnahme: die letzten zwei Jahre, wenn zugleich Arbeitslosigkeit besteht.</li>
<li>Arbeitslosengeld zählt außerhalb des Zwei-Jahres-Fensters immer. Wer den Zeitpunkt eines Ausscheidens mitgestalten kann, sollte das Fenster kennen.</li>
<li>Fehlen nur Monate, kann Weiterarbeit die Lösung sein: Jeder weitere Beitragsmonat zählt mit, und sind die ${WZ} Jahre voll, ist die Rente ohne Abschlag möglich.</li>
</ul>
<h2>Was das Verfehlen kostet</h2>
<p>Wer die ${WZ} Jahre knapp verfehlt, aber ${WZ35} hat, kann zum selben Termin über die Rente für langjährig Versicherte gehen, doch mit Abschlag bis zur Regelaltersgrenze. Für eine Person mit Geburtstag am 15. Juni 1964 heißt das: Beginn ${fmtMonat(start, 'de')}, ${h.num(ohne45.monate)} Monate Abschlag, zusammen ${h.pct(ohne45.abschlag, 1)} nach ${h.src('sgb6_77', '§ 77 SGB VI')}. Bei ${h.eur(RENTE)} Rente fehlen ${h.eur(RENTE * ohne45.abschlag)} im Monat, über zwanzig Jahre ${h.eur(RENTE * ohne45.abschlag * 240)}. Ein Jahr fehlender Wartezeit kann also mehr kosten, als ein zusätzliches Arbeitsjahr einbringt. Die Termine je Jahrgang stehen unter ${h.a('rente-nach-45-jahren', 'Rente nach 45 Jahren')}.</p>
<h2>Jahre im Ausland</h2>
<p>Versicherungszeiten aus anderen EU-Staaten, dem EWR und der Schweiz werden für Wartezeiten mit deutschen Zeiten zusammengerechnet (${h.src('vo883', 'Verordnung (EG) Nr. 883/2004')}). Ob eine bestimmte ausländische Zeit wie ein deutscher Pflichtbeitrag behandelt wird, prüft die Rentenversicherung im Einzelfall; bei Zeiten außerhalb Europas hängt es vom jeweiligen Abkommen ab.</p>
<h2>Die Reform und die 45 Jahre</h2>
<p>Die Alterssicherungskommission hat am 23. Juni 2026 empfohlen, die Rente für besonders langjährig Versicherte möglichst früh abzuschaffen, unter Vertrauensschutz (${h.src('bmasKommission', 'Bundesarbeitsministerium')}). Damit würde auch diese Wartezeit ihre Bedeutung verlieren. Ein Gesetzentwurf liegt nicht vor; bis dahin gilt der Katalog oben, und zwar in der Fassung, die bei Rentenbeginn gilt (${h.src('drvReform', 'Deutsche Rentenversicherung')}). Den Stand verfolgt ${h.a('rentenreform', 'Rentenreform')}.</p>`,
  },
  en: {
    slug: 'what-counts-for-45-years',
    nav: 'What counts for 45 years',
    card: 'Which periods count towards the 45 years and where careers fall short.',
    title: '45 qualifying years in Germany 2026: what counts, what not',
    description: '45 qualifying years for a German pension in 2026: what counts and what not, from child-raising to unemployment benefit in the final two years, worked cases.',
    h1: 'The 45-year qualifying period: which periods count',
    intro: 'Not every period on your German record counts towards the unreduced pension after 45 years. The calculator checks whether your years are enough.',
    resume: `The pension for especially long-term insured persons needs ${WZ} years, or ${EN.num(WZ * 12)} months, from a narrow list set out in section 51(3a) of Book VI of the Social Code (SGB VI). What counts: compulsory contributions from employment or self-employment, raising a child until its 10th birthday, caring for a relative, periods on unemployment benefit (Arbeitslosengeld), sickness benefit (Krankengeld) or transitional benefit, and voluntary contributions once you have at least 18 years of compulsory ones. What does not count: citizen’s benefit (Bürgergeld) and the former Arbeitslosengeld II, school, university and pension rights transferred on divorce (Versorgungsausgleich) or split between spouses. The key trap comes just before retirement: unemployment benefit in the last two years before the pension only counts if the employer became insolvent or closed down entirely. Someone with 40 years of work, 3 years of child-raising and 2 years of unemployment benefit, one of them in that window, reaches only ${EN.num(fallA.sum)} years. Without the 45, the same start date costs a ${EN.pct(ohne45.abschlag, 1)} reduction from the 1964 cohort.`,
    faqs: [
      { q: 'Does university count towards the 45 years for a German pension?', a: 'No, and neither does school. Vocational training in a company does count if compulsory contributions were paid, because for the 45 years what matters is the contribution obligation. If you studied after school, you often start counting only in your mid-twenties, which leaves little time to reach 45 years by the age limit of 65.' },
      { q: 'Are child-raising years counted towards the 45 years?', a: `Yes, and more generously than for the amount: for the 45 years, raising each child counts until its 10th birthday as a credited period (Berücksichtigungszeit). For the amount, by contrast, only ${P.kindererziehung.ab_1992_monate} months per child born from 1992 count. Whether the periods are on your record shows up in an account review (Kontenklärung); if they are missing, have them added before you apply.` },
      { q: 'Which periods do not count towards the 45 years?', a: 'Citizen’s benefit and the former Arbeitslosengeld II, school and university, and pension rights from divorce (Versorgungsausgleich) or splitting between spouses. Unemployment benefit in the two years before retirement only counts after the employer’s insolvency or complete closure. Voluntary contributions only count if you have at least 18 years of compulsory contributions.' },
      { q: 'Are there legal loopholes to reach the 45-year pension at 63?', a: `Rather a few levers. Unemployment benefit counts if it falls before the final two years; caring for a relative and raising children under 10 count if they are on your record; voluntary contributions count after 18 years of compulsory ones. The age limit itself cannot be bypassed: from the 1964 cohort this pension starts at ${fmtAlter(b64, 'en')} at the earliest, not at 63.` },
      { q: 'Do jobs in other EU countries count towards my 45 German years?', a: 'Insurance periods from other EU and EEA countries and Switzerland are added to German ones for qualifying periods under Regulation 883/2004. Whether a particular foreign period is treated like a German compulsory contribution is checked case by case by the German pension insurance. For countries outside Europe it depends on the relevant agreement, so ask before you build a plan on it.' },
      { q: 'What happens if I am a few months short of 45 years?', a: `Then you do not get this pension, not even in part. On the same date only the ${WZ35}-year pension with a reduction remains, ${EN.pct(ohne45.abschlag, 1)} from the 1964 cohort; on ${EN.eur(RENTE)} that is ${EN.eur(RENTE * ohne45.abschlag)} less a month. Working a few months longer often solves it: every further contribution month counts, and once the ${WZ} years are complete the unreduced pension is open.` },
    ],
    body: (h) => `
<h2>The list in section 51(3a)</h2>
<p>The 45 years are a separate qualifying period with their own list (${h.src('sgb6_51', 'section 51(3a) SGB VI')}). Anything not on the list does not count, even if it counts for the amount of your pension or for the ${WZ35} years of the ${h.a('langjaehrig-versicherte', 'pension for long-term insured persons')}.</p>
${h.table(['Period', 'Counts for 45 years', 'Restriction'], [
  ['Compulsory contributions from work', 'yes', 'none'],
  ['Child-raising', 'yes', 'until the child’s 10th birthday'],
  ['Caring for a relative', 'yes', 'must be on your insurance record'],
  ['Unemployment, sickness or transitional benefit', 'yes', 'unemployment benefit in the last 2 years only after insolvency or closure'],
  ['Voluntary contributions', 'yes', 'only with at least 18 years of compulsory contributions; not in the last 2 years if unemployed at the same time'],
  ['Citizen’s benefit, Arbeitslosengeld II', 'no', '–'],
  ['School, university', 'no', '–'],
  ['Pension rights from divorce or spousal splitting', 'no', '–'],
], 'Periods that count towards the 45-year pension', ['l', 'l', 'l'])}
<p>This explains why two people with equally long records end up in different places. A record with years on citizen’s benefit or a long degree meets the ${WZ35} years easily and misses the ${WZ} by a wide margin.</p>
<h2>Three worked cases</h2>
<p>The calculator above deducts the part of your unemployment benefit that falls in the two years before the pension starts. Three careers show how much depends on it:</p>
${h.table(['Case', 'Compulsory contributions', 'Children under 10, caring', 'Unemployment benefit total / in last 2 years', 'Counted', 'Result'], [
  ['A', h.num(40), h.num(3), `${h.num(2)} / ${h.num(1)}`, h.num(fallA.sum), fallA.sum >= WZ ? 'met' : `${h.num(WZ - fallA.sum)} year short`],
  ['B', h.num(40), h.num(3), `${h.num(2)} / ${h.num(0)}`, h.num(fallB.sum), fallB.sum >= WZ ? 'met' : `${h.num(WZ - fallB.sum)} years short`],
  ['C', h.num(41), h.num(2), `${h.num(3)} / ${h.num(2)}`, h.num(fallC.sum), fallC.sum >= WZ ? 'met' : `${h.num(WZ - fallC.sum)} years short`],
], 'Years; employer neither insolvent nor closed', ['l', 'r', 'r', 'r', 'r', 'l'])}
<p>Cases A and B differ only in when the unemployment benefit was paid. If the second year falls before the two-year window, the 45 are met; inside it, a year is missing. Case C even has more contribution years than A but loses two full years because the unemployment came right before retirement. Had the employer gone insolvent, those years would count. More on losing a job shortly before retirement under ${h.a('arbeitslos-vor-der-rente', 'unemployed before retirement')}.</p>
<h2>Levers rather than loopholes</h2>
<p>The age limit is fixed: from the 1964 cohort it is ${fmtAlter(b64, 'en')} (${h.src('sgb6_38', 'section 38 SGB VI')}, for older cohorts ${h.src('sgb6_236b', 'section 236b')}). On the years themselves, a few points are worth knowing:</p>
<ul>
<li>Child-raising and caring only count if they are on your record. An account review before you apply brings missing periods to light; how to read your statement is under ${h.a('renteninformation', 'reading your pension statement')}.</li>
<li>Voluntary contributions count once you have 18 years of compulsory ones, for example for self-employed people or gaps after a job ends. Exception: the last two years, if you are unemployed at the same time.</li>
<li>Unemployment benefit outside the two-year window always counts. If you have a say in when you leave a job, know where the window lies.</li>
<li>If you are only months short, working on may be the answer: every further contribution month counts, and once the ${WZ} years are complete the unreduced pension is open to you.</li>
</ul>
<h2>What missing the 45 costs</h2>
<p>If you narrowly miss ${WZ} years but have ${WZ35}, you can leave on the same date through the pension for long-term insured persons, but with a reduction up to the standard age. Born on 15 June 1964, that means a start in ${fmtMonat(start, 'en')}, ${h.num(ohne45.monate)} months of reduction, ${h.pct(ohne45.abschlag, 1)} in total under ${h.src('sgb6_77', 'section 77 SGB VI')}. On ${h.eur(RENTE)} you lose ${h.eur(RENTE * ohne45.abschlag)} a month, ${h.eur(RENTE * ohne45.abschlag * 240)} over twenty years. A missing year of qualifying time can therefore cost more than an extra year of work brings in. The dates for each birth year are under ${h.a('rente-nach-45-jahren', 'pension after 45 years')}.</p>
<h2>A career split across countries</h2>
<p>For expats the list raises a practical question: German periods must fit the categories above, and foreign periods are added under ${h.src('vo883', 'Regulation 883/2004')}, with the German pension insurance checking case by case whether a foreign period is treated like a German compulsory contribution. A career with a gap between two countries, for instance a few months without insurance after moving, counts towards neither. Keep the documents from each country, and have your German record reviewed before you reach the age limit.</p>
<h2>The reform and the 45 years</h2>
<p>On 23 June 2026 the pension commission recommended abolishing the pension for especially long-term insured persons as early as possible, with protection of legitimate expectations (${h.src('bmasKommission', 'Federal Ministry of Labour')}). This qualifying period would then lose its purpose. There is no draft bill; until then the list above applies, in the version in force when your pension starts (${h.src('drvReform', 'German pension insurance')}). Follow the state of play under ${h.a('rentenreform', 'pension reform')}.</p>`,
  },
});
