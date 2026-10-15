import { defineGuide } from '../../lib/guide-types';
import { optionen, beginn, regelalter, fmtMonat, fmtAlter, vonIdx, monatsName, type Geburt } from '../../lib/engine/alter';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Rente beantragen: frühester sinnvoller Antrag (ein Jahr vorher, Hinweis der DRV) und Frist nach § 99 SGB VI.
 * Beispiele aus dem Motor: vier Geburtsdaten, ein verspäteter Antrag mit 1.500 € Rente, eine Frührente Jahrgang 1964.
 */
const FRIST = P.antrag.frist_monate;
const fall = (g: Geburt) => {
  const b = beginn(g, regelalter(g.jahr));
  const spaet = vonIdx(b - 1 + FRIST);
  return { g, b, frueh: b - 12, spaet };
};
const faelle = [
  { jahr: 1960, monat: 9, tag: 15 },
  { jahr: 1960, monat: 9, tag: 1 },
  { jahr: 1962, monat: 11, tag: 15 },
  { jahr: 1964, monat: 3, tag: 15 },
].map(fall);
const f60 = faelle[0];
const f60erster = faelle[1];
/** Verspäteter Antrag: gestellt im Juli 2027 statt bis Ende April 2027, Rente ab Antragsmonat. */
const antragJuli = f60.b + 5;
const verloreneMonate = antragJuli - f60.b;
const verlust = 1500 * verloreneMonate;
/** Frührente nach 35 Jahren, geboren 15. September 1964. */
const g64 = { jahr: 1964, monat: 9, tag: 15 };
const o64 = optionen(g64, { wz35: true, wz45: true, schwb: false });
const lj64 = o64.find((o) => o.art === 'langjaehrig')!;
const bl64 = o64.find((o) => o.art === 'besonders')!;
const lj64spaet = vonIdx(lj64.frueh - 1 + FRIST);
const datum = (g: Geburt, l: 'de' | 'en') => (l === 'de' ? `${g.tag}. ${monatsName(g.monat, 'de')} ${g.jahr}` : `${g.tag} ${monatsName(g.monat, 'en')} ${g.jahr}`);
const ende = (x: { jahr: number; monat: number }, l: 'de' | 'en') => `${monatsName(x.monat, l)} ${x.jahr}`;

export default defineGuide({
  id: 'rente-beantragen',
  group: 'beginn',
  order: 70,
  mini: 'antrag',
  miniHref: 'rentenbeginn-rechner',
  related: ['fruehrente', 'renteneintrittsalter-tabelle', 'arbeitslos-vor-der-rente', 'rente-ausland', 'krankenversicherung-rentner', 'renteninformation'],
  sources: ['sgb6_99', 'bgb_187', 'drvReform', 'sgb6_50', 'sgb6_42', 'sgb6_187a', 'sgb6_210', 'vo883'],
  de: {
    slug: 'rente-beantragen',
    nav: 'Rente beantragen',
    card: 'Wann der Antrag fällig ist, ab wann er geht und was ein verspäteter Antrag kostet.',
    title: 'Rente beantragen 2026: Frist, frühester Antrag, Ablauf',
    description: 'Rente beantragen 2026: frühestens ein Jahr vorher, spätestens drei Kalendermonate nach der Altersgrenze, sonst gehen Monate verloren. Termine je Geburtsdatum.',
    h1: 'Rente beantragen: wann der Antrag fällig ist',
    intro: 'Die Rente kommt nicht von selbst. Entscheidend sind zwei Termine: der früheste sinnvolle Antrag und die Frist, nach der Monate verloren gehen.',
    resume: `Eine Altersrente wird nur auf Antrag gezahlt. Sie beginnt mit dem Monat nach dem Erreichen der Altersgrenze, wenn der Antrag bis zum Ende des ${FRIST}. Kalendermonats danach gestellt wird; wer später kommt, erhält die Rente erst ab dem Monat des Antrags (§ 99 SGB VI). Nachgezahlt wird dann nichts. Frühestens beantragen lässt sich die Rente nach Hinweis der Deutschen Rentenversicherung ein Jahr vor dem Beginn. Beispiel: Wer am 15. September 1960 geboren ist (Regelaltersgrenze: ${fmtAlter(regelalter(1960), 'de')}), bekommt die Regelaltersrente ab dem ${fmtMonat(f60.b, 'de')}; der Antrag ist ab ${monatsName(vonIdx(f60.frueh).monat, 'de')} ${vonIdx(f60.frueh).jahr} sinnvoll und spätestens bis Ende ${ende(f60.spaet, 'de')} nötig. Wer erst im ${ende(vonIdx(antragJuli), 'de')} beantragt, verliert bei 1.500 € Rente ${verloreneMonate} Monatsrenten, also ${DE.eur(verlust)}. Wer am Ersten eines Monats geboren ist, beginnt einen Monat früher, weil das Alter schon am Vortag vollendet ist (§ 187 BGB). Für Frührenten gelten dieselben Fristen, gerechnet ab dem gewählten Beginn.`,
    faqs: [
      { q: 'Wie viele Monate vor Rentenbeginn sollte ich den Antrag stellen?', a: `Die Deutsche Rentenversicherung nimmt Anträge frühestens ein Jahr vor dem Rentenbeginn an. Wer nicht bis zum letzten Monat wartet, lässt Zeit, Lücken im Versicherungsverlauf zu klären, damit die erste Zahlung pünktlich kommt. Wer am 15. September 1960 geboren ist, kann ab ${monatsName(vonIdx(f60.frueh).monat, 'de')} ${vonIdx(f60.frueh).jahr} beantragen; die Rente beginnt am ${fmtMonat(f60.b, 'de')}.` },
      { q: 'Was passiert, wenn ich die Rente zu spät beantrage?', a: `Wer den Antrag nach dem Ende des dritten Kalendermonats nach Erreichen der Altersgrenze stellt, bekommt die Rente erst ab dem Antragsmonat. Die Monate davor sind verloren, eine Nachzahlung gibt es nicht. Im Beispiel mit Rentenbeginn ${fmtMonat(f60.b, 'de')} und Antrag im ${ende(vonIdx(antragJuli), 'de')} fehlen ${verloreneMonate} Monatsrenten, bei 1.500 € also ${DE.eur(verlust)}.` },
      { q: 'Ich bin am Ersten eines Monats geboren: verschiebt das Rentenbeginn und Antragsfrist?', a: 'Nach § 187 BGB ist ein Lebensjahr mit Ablauf des Tages vor dem Geburtstag vollendet. Wer am 1. Oktober Geburtstag hat, erreicht sein Alter also am 30. September, und die Rente beginnt am 1. Oktober statt am 1. November. Das gilt für alle Altersrenten und verschiebt auch die Antragsfrist um einen Monat nach vorn.' },
      { q: 'Kann ich die Frührente mit Abschlag später in eine abschlagsfreie Rente umwandeln?', a: 'Nein. Ist eine Altersrente bindend bewilligt, lässt sie sich nicht mehr gegen eine andere Altersrente tauschen, von einer Ausnahme abgesehen. Wer mit 63 die Rente nach 35 Jahren nimmt, behält den Abschlag also auch dann, wenn später die 45 Jahre oder eine Schwerbehinderung nachgewiesen würden. Klären Sie deshalb vor dem Antrag, welche Rentenart Ihnen zum gewünschten Termin zusteht.' },
      { q: 'Werden Steuern und Krankenkasse automatisch von der Rente abgezogen?', a: 'Den Kranken- und Pflegebeitrag behält die Rentenversicherung direkt ein, wenn Sie gesetzlich versichert sind; sie trägt die Hälfte des Krankenkassenbeitrags. Die Einkommensteuer zieht sie nicht ab. Ob Steuer anfällt, ergibt sich erst aus der Steuererklärung. Was netto bleibt, zeigt der Rechner für die Nettorente.' },
      { q: 'Was muss ich vor dem Rentenantrag erledigt haben?', a: 'Prüfen Sie den Versicherungsverlauf auf Lücken: Ausbildung, Kindererziehung, Pflege, Arbeitslosigkeit und Zeiten im Ausland sollten vollständig erfasst sein. Wer den Abschlag einer Frührente ausgleichen will, braucht vorher eine Auskunft über die Ausgleichszahlung, die es ab 50 gibt. Wer eine Schwerbehinderung geltend machen will, braucht den anerkannten Grad bei Rentenbeginn.' },
    ],
    body: (h) => `
<h2>Die zwei Termine jedes Antrags</h2>
<p>Jede Altersrente hat einen ersten möglichen Monat: den Monat nach dem Erreichen der Altersgrenze. Ob die Rente tatsächlich ab diesem Monat fließt, hängt am Antrag. ${h.src('sgb6_99', '§ 99 SGB VI')} gibt dafür eine Frist von ${FRIST} Kalendermonaten nach dem Monat, in dem die Voraussetzungen erfüllt sind. Wer innerhalb dieser Frist beantragt, bekommt die Rente rückwirkend ab dem ersten möglichen Monat. Wer sie verpasst, bekommt sie ab dem Monat, in dem der Antrag eingeht, und nicht früher.</p>
<p>Am anderen Ende steht der früheste Antrag. Die Deutsche Rentenversicherung bearbeitet Anträge nach eigenem Hinweis frühestens ein Jahr vor dem Rentenbeginn (${h.src('drvReform', 'Deutsche Rentenversicherung')}). Zwischen diesen beiden Grenzen liegen also gut 15 Monate, in denen der Antrag ohne Nachteil gestellt werden kann. Der Rechner oben zeigt beide Termine für Ihren Geburtsmonat, bezogen auf die Regelaltersrente.</p>
<h2>Termine für vier Geburtsdaten</h2>
${h.table(['Geboren am', 'Regelaltersrente ab', 'Antrag frühestens ab', 'Antrag spätestens bis Ende'], faelle.map((f) => [datum(f.g, 'de'), fmtMonat(f.b, 'de'), fmtMonat(f.frueh, 'de'), ende(f.spaet, 'de')]), 'Regelaltersrente, Fristen nach § 99 SGB VI', ['l', 'l', 'l', 'l'])}
<p>Die ersten beiden Zeilen zeigen den Effekt des Monatsersten. Wer am 1. September 1960 geboren ist, vollendet sein Lebensjahr nach ${h.src('bgb_187', '§ 187 BGB')} schon am 31. August und erreicht die Regelaltersgrenze damit einen Monat früher als jemand, der zwei Wochen später Geburtstag hat. Rentenbeginn, frühester Antrag und Frist rücken entsprechend einen Monat nach vorn: ${fmtMonat(f60erster.b, 'de')} statt ${fmtMonat(f60.b, 'de')}. Welche Altersgrenze für Ihren Jahrgang gilt, steht in der ${h.a('renteneintrittsalter-tabelle', 'Tabelle zum Renteneintrittsalter')}.</p>
<h2>Was eine verpasste Frist kostet</h2>
<p>Angenommen, die am 15. September 1960 geborene Versicherte stellt den Antrag erst im ${ende(vonIdx(antragJuli), 'de')}, weil sie die Rente für einen Selbstläufer hielt. Die Frist lief Ende ${ende(f60.spaet, 'de')} ab. Die Rente beginnt deshalb erst am ${fmtMonat(antragJuli, 'de')} und nicht am ${fmtMonat(f60.b, 'de')}. Bei einer Rente von 1.500 € fehlen ${verloreneMonate} Zahlungen, zusammen ${h.eur(verlust)}. Anders als bei einem Abschlag bleibt die Rente danach zwar ungekürzt, aber das verlorene Geld kommt nicht zurück. Wer die Regelaltersgrenze erreicht und bewusst länger arbeiten will, sollte das dagegen nicht mit einem verspäteten Antrag verwechseln: Der Zuschlag für den späteren Beginn wird anders berechnet, siehe ${h.a('spaeter-in-rente', 'später in Rente')}.</p>
<h2>Frührente beantragen</h2>
<p>Für vorgezogene Renten gelten dieselben Fristen, gerechnet ab dem Monat, in dem Sie die Rente beginnen lassen wollen. Eine am 15. September 1964 geborene Person mit 35 Versicherungsjahren kann die Altersrente für langjährig Versicherte ab dem ${fmtMonat(lj64.frueh, 'de')} beziehen, mit ${h.pct(lj64.abschlag, 1)} Abschlag. Der Antrag wäre ab dem ${fmtMonat(lj64.frueh - 12, 'de')} möglich; wer zum frühesten Termin gehen will, muss ihn spätestens bis Ende ${ende(lj64spaet, 'de')} stellen. Mit 45 Jahren wäre die Rente ohne Abschlag ab dem ${fmtMonat(bl64.voll, 'de')} möglich.</p>
<p>Gerade hier lohnt sich Sorgfalt, denn die Wahl der Rentenart ist endgültig: Eine bindend bewilligte Altersrente lässt sich nicht nachträglich gegen eine andere Altersrente austauschen, von einer Ausnahme abgesehen. Wer die Rente nach 35 Jahren mit Abschlag beantragt, obwohl die 45 Jahre zwei Jahre später erreicht wären, behält den Abschlag. Wie hoch er ist und was er über die Jahre kostet, zeigt ${h.a('fruehrente', 'Frührente')}; wer ihn ausgleichen will, braucht vor dem Rentenbeginn eine Auskunft nach ${h.src('sgb6_187a', '§ 187a SGB VI')}, die ab 50 erteilt wird.</p>
<!--mini:fruehVerlust-->
<h2>Was der Antrag voraussetzt</h2>
<p>Für die Regelaltersrente genügen fünf Jahre Wartezeit (${h.src('sgb6_50', '§ 50 SGB VI')}). Für die Rente nach 35 oder 45 Jahren müssen die jeweiligen Zeiten im Versicherungsverlauf stehen, und für die Altersrente für schwerbehinderte Menschen muss der Grad der Behinderung von mindestens 50 bei Rentenbeginn anerkannt sein. Der häufigste Grund für Verzögerungen sind Lücken im Verlauf: Ausbildungszeiten, Kindererziehung, Pflege oder Monate der Arbeitslosigkeit, die nicht gemeldet wurden. Wer sie vor dem Antrag klärt, vermeidet Rückfragen. Wie Sie den Verlauf lesen, steht unter ${h.a('renteninformation', 'Renteninformation verstehen')}.</p>
<p>Wer nicht ganz aufhören will, kann auch eine Teilrente beantragen, mindestens 10 Prozent der Vollrente (${h.src('sgb6_42', '§ 42 SGB VI')}). Neben einer Altersrente darf seit 2023 unbegrenzt hinzuverdient werden; das muss im Antrag also nicht mehr gegen eine Grenze geprüft werden. Für eine Witwen- oder Witwerrente gilt eine andere Regel: Sie wird bis zu zwölf Monate rückwirkend vor dem Antragsmonat gezahlt.</p>
<h2>Nach der Bewilligung</h2>
<p>Mit dem Bescheid beginnen die Abzüge. Der Kranken- und Pflegebeitrag wird direkt abgezogen, wenn Sie in der Krankenversicherung der Rentner sind; Einzelheiten unter ${h.a('krankenversicherung-rentner', 'Krankenversicherung der Rentner')}. Eine Änderung des Zusatzbeitrags Ihrer Kasse wirkt sich erst im zweiten Monat danach auf die Rente aus. Die Einkommensteuer behält die Rentenversicherung nicht ein; ob eine Steuererklärung nötig ist, hängt vom steuerpflichtigen Teil der Rente und von weiteren Einkünften ab.</p>
<h2>Antrag mit Zeiten im Ausland</h2>
<p>Wer auch in einem anderen EU-Staat, im EWR oder in der Schweiz versichert war, profitiert von der Koordinierung nach ${h.src('vo883', 'Verordnung (EG) Nr. 883/2004')}: Die Zeiten werden für die Wartezeiten zusammengerechnet, und jeder Staat zahlt seinen Teil. Wer Deutschland dagegen verlässt und die fünf Jahre nicht erreicht, kann unter Umständen nach 24 Monaten die Erstattung des Arbeitnehmeranteils beantragen (${h.src('sgb6_210', '§ 210 SGB VI')}); danach besteht kein Rentenanspruch aus diesen Zeiten mehr. Mehr dazu unter ${h.a('rente-ausland', 'Rente im Ausland')}. Für die persönliche Hilfe beim Antrag sind die Auskunfts- und Beratungsstellen der Deutschen Rentenversicherung zuständig; diese Seite ist unabhängig und berät nicht im Einzelfall.</p>`,
  },
  en: {
    slug: 'applying-for-your-pension',
    nav: 'Applying for your pension',
    card: 'When to apply for your German pension, the earliest date and what a late claim costs.',
    title: 'Applying for a German pension 2026: deadline, timing, steps',
    description: 'Applying for a German pension 2026: at most a year ahead, at the latest three calendar months after the age limit, or months are lost. Dates by date of birth.',
    h1: 'Applying for your German pension: when to file',
    intro: 'The German pension is never paid automatically. Two dates matter: the earliest sensible application and the deadline after which months are lost.',
    resume: `A German old-age pension (Altersrente) is paid only if you apply for it (Rentenantrag). It starts in the month after you reach the age limit, provided you apply by the end of the ${FRIST === 3 ? 'third' : FRIST + 'th'} calendar month after that; if you apply later, it is paid only from the month of your application (section 99 SGB VI), with no back payment. According to the Deutsche Rentenversicherung, you can apply at most one year before the start. Example: born on 15 September 1960, you reach the standard retirement age (Regelaltersgrenze) at ${fmtAlter(regelalter(1960), 'en')}; the pension starts on ${fmtMonat(f60.b, 'en')}, applying makes sense from ${ende(vonIdx(f60.frueh), 'en')} and is needed by the end of ${ende(f60.spaet, 'en')}. If you only apply in ${ende(vonIdx(antragJuli), 'en')}, you lose ${verloreneMonate} monthly payments of €1,500, or ${EN.eur(verlust)}. Born on the 1st of a month, you start a month earlier, because German law treats the age as reached the day before the birthday (section 187 BGB). Early pensions follow the same deadlines, counted from the start you choose.`,
    faqs: [
      { q: 'How far ahead can I apply for my German pension?', a: `The Deutsche Rentenversicherung accepts applications at most one year before the pension starts. Not waiting until the last month leaves time to resolve gaps in your insurance record, so that the first payment arrives on time. Born on 15 September 1960, you can apply from ${ende(vonIdx(f60.frueh), 'en')}; the pension starts on ${fmtMonat(f60.b, 'en')}.` },
      { q: 'What do I lose if my German pension application is late?', a: `If you apply after the end of the third calendar month following the month you reach the age limit, the pension starts only in the month of application. Earlier months are lost; there is no back payment. In the example starting ${fmtMonat(f60.b, 'en')} with an application in ${ende(vonIdx(antragJuli), 'en')}, ${verloreneMonate} payments are missing, ${EN.eur(verlust)} at €1,500 a month.` },
      { q: 'I was born on the 1st of a month: does that move my pension start and deadline?', a: 'Under section 187 of the German Civil Code (BGB), a year of life is completed at the end of the day before your birthday. With a birthday on 1 October you reach your age on 30 September, and the pension starts on 1 October instead of 1 November. This applies to every old-age pension and moves the application deadline forward by a month as well.' },
      { q: 'Can I switch from a reduced early pension to an unreduced one later?', a: 'No. Once an old-age pension has been granted with binding effect, it cannot be exchanged for a different old-age pension, apart from one exception. If you take the 35-year pension at 63 with a reduction, you keep the reduction even if 45 years or a severe disability are proven later. Settle which pension type you are entitled to on your chosen date before you apply.' },
      { q: 'Do I need to apply in Germany if I now live in another EU country?', a: 'Your periods in Germany and in other EU or EEA countries and Switzerland are added together for the qualifying periods, and each country pays its own share. Which office takes the application and how it is passed on should be confirmed with the pension insurance in your country of residence or the Deutsche Rentenversicherung. Living elsewhere in the EU does not reduce your German pension.' },
      { q: 'Is tax taken off my German pension automatically?', a: 'No. If you are in the statutory health insurance, the pension insurance deducts your health and long-term care contributions directly and pays half of the health contribution itself. It does not withhold income tax. Whether you owe tax is settled through a tax return, depending on the taxable share of your pension and your other income. The net pension calculator shows what is left.' },
    ],
    body: (h) => `
<h2>Two dates behind every application</h2>
<p>Every German old-age pension has a first possible month: the month after you reach the age limit. Whether payments actually start then depends on your application. ${h.src('sgb6_99', 'Section 99 SGB VI')} allows ${FRIST} calendar months after the month in which the conditions are met. Apply within that window and the pension is paid back to the first possible month. Miss it and the pension starts in the month your application arrives, not earlier.</p>
<p>At the other end is the earliest application. According to its own guidance, the Deutsche Rentenversicherung processes applications at most one year before the pension starts (${h.src('drvReform', 'Deutsche Rentenversicherung')}). That leaves a little over 15 months in which you can apply without any disadvantage. The calculator above shows both dates for your month of birth, based on the standard pension (Regelaltersrente).</p>
<h2>Dates for four birthdays</h2>
${h.table(['Born on', 'Standard pension from', 'Apply from', 'Apply by the end of'], faelle.map((f) => [datum(f.g, 'en'), fmtMonat(f.b, 'en'), fmtMonat(f.frueh, 'en'), ende(f.spaet, 'en')]), 'Standard pension, deadlines under section 99 SGB VI', ['l', 'l', 'l', 'l'])}
<p>The first two rows show the first-of-the-month effect. Born on 1 September 1960, you complete your year of life on 31 August under ${h.src('bgb_187', 'section 187 BGB')}, and so reach the standard age a month earlier than someone whose birthday is two weeks later. Pension start, earliest application and deadline all move forward a month: ${fmtMonat(f60erster.b, 'en')} instead of ${fmtMonat(f60.b, 'en')}. The age limit for your birth year is in the ${h.a('renteneintrittsalter-tabelle', 'retirement age table')}.</p>
<h2>What a missed deadline costs</h2>
<p>Suppose the person born on 15 September 1960 applies only in ${ende(vonIdx(antragJuli), 'en')}, assuming the pension would start by itself. The deadline expired at the end of ${ende(f60.spaet, 'en')}. The pension therefore begins on ${fmtMonat(antragJuli, 'en')} and not on ${fmtMonat(f60.b, 'en')}. On €1,500 a month, ${verloreneMonate} payments are missing, ${h.eur(verlust)} in all. Unlike a reduction, the pension itself is not cut afterwards, but the lost money does not come back. Deliberately working past the standard age is something else: that earns an increase, calculated differently, see ${h.a('spaeter-in-rente', 'retiring later')}.</p>
<h2>Applying for an early pension</h2>
<p>Early pensions follow the same deadlines, counted from the month you want the pension to start. Someone born on 15 September 1964 with 35 insured years can draw the pension for long-term insured persons (Altersrente für langjährig Versicherte) from ${fmtMonat(lj64.frueh, 'en')}, with a ${h.pct(lj64.abschlag, 1)} reduction. The application would be possible from ${fmtMonat(lj64.frueh - 12, 'en')}; to start on the earliest date, it must be filed by the end of ${ende(lj64spaet, 'en')}. With 45 years the unreduced pension would be possible from ${fmtMonat(bl64.voll, 'en')}.</p>
<p>Care matters here, because the choice of pension type is final: an old-age pension granted with binding effect cannot later be swapped for another, with one exception. If you claim the 35-year pension with a reduction although 45 years would be reached two years later, the reduction stays. How large it is and what it costs over time is on ${h.a('fruehrente', 'early retirement')}; to buy it out you need a statement under ${h.src('sgb6_187a', 'section 187a SGB VI')} before the pension starts, available from age 50.</p>
<!--mini:fruehVerlust-->
<h2>What the application requires</h2>
<p>The standard pension needs five years of qualifying periods (${h.src('sgb6_50', 'section 50 SGB VI')}). For the 35- or 45-year pensions those periods must be on your insurance record, and for the pension for severely disabled persons a degree of disability of at least 50 must be recognised when the pension starts. The most common cause of delay is gaps: training, child-raising, caring or months of unemployment that were never reported. Clearing them before you apply avoids follow-up questions. How to read the record is explained under ${h.a('renteninformation', 'reading your pension statement')}.</p>
<p>If you do not want to stop completely, you can also claim a partial pension (Teilrente) of at least 10% of the full pension (${h.src('sgb6_42', 'section 42 SGB VI')}). Since 2023 there is no earnings limit alongside an old-age pension, so the application no longer checks your pay against a cap. A widow’s or widower’s pension follows a different rule: it can be paid up to twelve months back before the month of application.</p>
<h2>After the pension is granted</h2>
<p>Deductions begin with the pension notice. Health and long-term care contributions are deducted directly if you are in the statutory health insurance for pensioners (KVdR); see ${h.a('krankenversicherung-rentner', 'health insurance for pensioners')}. A change in your fund’s additional contribution reaches the pension only in the second month afterwards. Income tax is not withheld; whether you need to file a return depends on the taxable share of the pension and your other income.</p>
<h2>Applying with periods abroad</h2>
<p>For expats, the EU coordination rules in ${h.src('vo883', 'Regulation (EC) No 883/2004')} matter most. Periods in other EU and EEA countries and Switzerland are added together for the qualifying periods, and each country pays its own part. Outside Europe, the outcome depends on the country and on any social security agreement, so check with the Deutsche Rentenversicherung. If you leave Germany without reaching five years, you may, after 24 months, apply for a refund of the employee half of your contributions (${h.src('sgb6_210', 'section 210 SGB VI')}); after that, those periods give no pension right. More on ${h.a('rente-ausland', 'German pension abroad')}. For help with your own application, the information and advice centres of the Deutsche Rentenversicherung are the right contact; this site is independent and gives no individual advice.</p>`,
  },
});
