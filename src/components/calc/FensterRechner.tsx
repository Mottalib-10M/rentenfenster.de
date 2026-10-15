/**
 * Rentenfenster: frühester Beginn, Abschlag und abschlagsfreier Beginn für jede Rentenart, auf den Monat,
 * nach geltendem Recht (§§ 35 bis 38, 235 bis 236b, 77, 99 SGB VI) und daneben im Szenario des
 * Kommissionsvorschlags vom 23. Juni 2026 (kein Gesetz).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { fenster, fmtAlter, fmtMonat, type Art, type Option } from '../../lib/engine/alter';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';
import { monatOpt, janein } from './opts';

export const ART_LABEL: Record<Art, { de: string; en: string }> = {
  regel: { de: 'Regelaltersrente', en: 'Standard pension' },
  langjaehrig: { de: 'Langjährig Versicherte (35 J.)', en: 'Long-term insured (35 yrs)' },
  besonders: { de: 'Besonders langjährig (45 J.)', en: 'Especially long-term (45 yrs)' },
  schwb: { de: 'Schwerbehinderte (GdB 50)', en: 'Severely disabled (GdB 50)' },
};

interface Props { lang?: L; methodHref?: string; preset?: { jahr?: number; jahre?: number; schwb?: boolean } }
export default function FensterRechner({ lang = 'de', methodHref, preset = {} }: Props) {
  const f = fm(lang);
  const d = { jahr: preset.jahr ?? 1964, monat: 6, tag: 15, jahre: preset.jahre ?? 40, schwb: preset.schwb ? 1 : 0, rente: 1600 };
  const [jahr, setJahr] = useState(d.jahr);
  const [monat, setMonat] = useState(String(d.monat));
  const [tag, setTag] = useState(d.tag);
  const [jahre, setJahre] = useState(d.jahre);
  const [schwb, setSchwb] = useState(String(d.schwb));
  const [rente, setRente] = useState(d.rente);
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setJahr(num(u, 'j', d.jahr)); setMonat(String(num(u, 'm', d.monat))); setTag(num(u, 't', d.tag)); setJahre(num(u, 'wz', d.jahre)); setSchwb(String(num(u, 'sb', d.schwb))); setRente(num(u, 'r', d.rente));
  }, []);
  useEffect(() => { updateURL({ j: jahr, m: monat, t: tag, wz: jahre, sb: schwb, r: rente }); }, [jahr, monat, tag, jahre, schwb, rente]);

  const j = Math.min(Math.max(Math.round(jahr) || 1964, 1955), 2000);
  const g = { jahr: j, monat: Number(monat), tag: Math.min(Math.max(Math.round(tag) || 1, 1), 31) };
  const lage = { wz35: jahre >= 35, wz45: jahre >= 45, schwb: schwb === '1' };
  const recht = useMemo(() => fenster(g, lage), [g.jahr, g.monat, g.tag, lage.wz35, lage.wz45, lage.schwb]);
  const reform = useMemo(() => fenster(g, lage, true), [g.jahr, g.monat, g.tag, lage.wz35, lage.wz45, lage.schwb]);
  const fr = recht.fruehest;
  const gekuerzt = (o: Option) => rente * (1 - o.abschlag);
  const zeile = (o: Option) => ({
    label: tx(lang, ART_LABEL[o.art].de, ART_LABEL[o.art].en),
    value: o.monate > 0 ? `${fmtMonat(o.frueh, lang)} · −${f.pct(o.abschlag, 1)}` : fmtMonat(o.voll, lang),
  });
  const steps = [
    tx(lang, `Regelaltersgrenze Jahrgang ${j}: ${fmtAlter(recht.regel.vollAlter, lang)} (${j >= 1964 ? '§ 35' : '§ 235 Abs. 2'} SGB VI). Beginn am ${fmtMonat(recht.regel.voll, lang)}, dem Monat nach Vollendung des Alters (§ 99 SGB VI).`, `Standard retirement age for people born in ${j}: ${fmtAlter(recht.regel.vollAlter, lang)} (${j >= 1964 ? 'section 35' : 'section 235(2)'} SGB VI). Start on ${fmtMonat(recht.regel.voll, lang)}, the month after you reach that age (section 99 SGB VI).`),
    g.tag === 1 ? tx(lang, 'Geburtstag am Monatsersten: Das Alter ist schon am letzten Tag des Vormonats vollendet (§ 187 Abs. 2 BGB), die Rente beginnt einen Monat früher.', 'Born on the 1st: the age is reached on the last day of the previous month (section 187(2) BGB), so the pension starts one month earlier.') : '',
    lage.wz35 ? tx(lang, `Mit ${f.num(jahre)} Jahren ist die Wartezeit von 35 Jahren erfüllt: frühestens mit 63, je Monat vor der Regelaltersgrenze 0,3 % Abschlag (§ 77 SGB VI).`, `With ${f.num(jahre)} years the 35-year qualifying period is met: from 63 at the earliest, minus 0.3% for each month before the standard age (section 77 SGB VI).`) : tx(lang, `Mit ${f.num(jahre)} Jahren ist die Wartezeit von 35 Jahren nicht erfüllt: Es bleibt die Regelaltersrente.`, `With ${f.num(jahre)} years the 35-year qualifying period is not met: only the standard pension is open.`),
    lage.wz45 ? tx(lang, `45 Jahre erreicht: abschlagsfrei mit ${fmtAlter(recht.opts.find((o) => o.art === 'besonders')!.vollAlter, lang)}, aber nicht früher (§ ${j >= 1964 ? '38' : '236b'} SGB VI). Was zählt, regelt § 51 Abs. 3a.`, `45 years reached: no reduction from ${fmtAlter(recht.opts.find((o) => o.art === 'besonders')!.vollAlter, lang)}, but not earlier (section ${j >= 1964 ? '38' : '236b'} SGB VI). What counts is set by section 51(3a).`) : '',
    lage.schwb && lage.wz35 ? tx(lang, `Schwerbehinderung: frühestens mit ${fmtAlter(recht.opts.find((o) => o.art === 'schwb')!.fruehAlter, lang)}, Abschlag höchstens 10,8 %.`, `Severe disability: from ${fmtAlter(recht.opts.find((o) => o.art === 'schwb')!.fruehAlter, lang)} at the earliest, reduction capped at 10.8%.`) : '',
    tx(lang, `Kommissionsvorschlag (kein Gesetz): ohne 45-Jahre-Rente und mit Mindestalter 64 wäre der früheste Beginn ${fmtMonat(reform.fruehest.frueh, lang)} mit ${f.pct(reform.fruehest.abschlag, 1)} Abschlag.`, `Commission proposal (not law): without the 45-year pension and with a minimum age of 64, the earliest start would be ${fmtMonat(reform.fruehest.frueh, lang)} with a ${f.pct(reform.fruehest.abschlag, 1)} reduction.`),
  ].filter(Boolean);
  const fruehUnter = fr.monate > 0
    ? tx(lang, `mit ${fmtAlter(fr.fruehAlter, lang)}, Abschlag ${f.pct(fr.abschlag, 1)}`, `at ${fmtAlter(fr.fruehAlter, lang)}, reduction ${f.pct(fr.abschlag, 1)}`)
    : tx(lang, `mit ${fmtAlter(fr.vollAlter, lang)}, ohne Abschlag`, `at ${fmtAlter(fr.vollAlter, lang)}, no reduction`);
  const diff = reform.fruehest.frueh - fr.frueh;
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            <NumberField id="rf-j" label={tx(lang, 'Geburtsjahr', 'Year of birth')} value={jahr} onChange={setJahr} max={2000} lang={lang} />
            <SelectField id="rf-m" label={tx(lang, 'Monat', 'Month')} value={monat} onChange={setMonat} options={monatOpt(lang)} />
            <NumberField id="rf-t" label={tx(lang, 'Tag', 'Day')} value={tag} onChange={setTag} max={31} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="rf-wz" label={tx(lang, 'Versicherungsjahre bis 63', 'Insured years by age 63')} value={jahre} onChange={setJahre} max={50} lang={lang} help={tx(lang, 'laut Renteninformation', 'from your pension statement')} />
            <SelectField id="rf-sb" label={tx(lang, 'Schwerbehindert (GdB 50)', 'Severely disabled (GdB 50)')} value={schwb} onChange={setSchwb} options={janein(lang)} />
          </div>
          <NumberField id="rf-r" label={tx(lang, 'Rente zur Regelaltersgrenze', 'Pension at standard age')} value={rente} onChange={setRente} unit="€" max={5000} lang={lang} help={tx(lang, 'Zeile „Regelaltersrente“ der Renteninformation', 'line “Regelaltersrente” on your statement')} />
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'Frühester Rentenbeginn', 'Earliest pension start')} wert={fmtMonat(fr.frueh, lang)} unter={fruehUnter} />
          <Zeilen rows={[
            ...recht.opts.map(zeile),
            { label: tx(lang, 'Ohne Abschlag ab', 'No reduction from'), value: fmtMonat(recht.abschlagsfrei.voll, lang), strong: true, sep: true },
            ...(rente > 0 ? [{ label: tx(lang, 'Rente beim frühesten Beginn', 'Pension at earliest start'), value: f.eur(gekuerzt(fr)) }] : []),
          ]} />
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-navy-900">
            <p className="font-semibold">{tx(lang, 'Wenn der Kommissionsvorschlag Gesetz würde', 'If the commission proposal became law')}</p>
            <p className="mt-1">{diff > 0
              ? tx(lang, `Frühestens ${fmtMonat(reform.fruehest.frueh, lang)} (${f.num(diff)} Monate später), Abschlag ${f.pct(reform.fruehest.abschlag, 1)}; ohne Abschlag ab ${fmtMonat(reform.abschlagsfrei.voll, lang)}.`, `Earliest ${fmtMonat(reform.fruehest.frueh, lang)} (${f.num(diff)} months later), reduction ${f.pct(reform.fruehest.abschlag, 1)}; no reduction from ${fmtMonat(reform.abschlagsfrei.voll, lang)}.`)
              : tx(lang, `Für Ihre Angaben ändert sich am frühesten Beginn nichts; ohne Abschlag ab ${fmtMonat(reform.abschlagsfrei.voll, lang)}.`, `For your inputs the earliest start stays the same; no reduction from ${fmtMonat(reform.abschlagsfrei.voll, lang)}.`)}</p>
            <p className="mt-1 text-xs text-navy-700">{tx(lang, 'Szenario ohne Übergangsregeln. Kein Gesetzentwurf veröffentlicht, es gilt das heutige Recht.', 'Scenario without transitional rules. No draft bill published; current law applies.')}</p>
          </div>
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Jahrgang ${j}: frühestens ${fmtMonat(fr.frueh, lang)} (${fruehUnter})`, `Born ${j}: earliest ${fmtMonat(fr.frueh, lang)} (${fruehUnter})`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
