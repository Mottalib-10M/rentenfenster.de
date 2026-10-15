/** Abschlag nach Monaten (§ 77 SGB VI), dauerhafter Verlust und der Zeitpunkt, ab dem sich das Warten gerechnet hätte. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { optionen, beginn, fmtAlter, fmtMonat, breakEven, alterBei } from '../../lib/engine/alter';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';
import { monatOpt } from './opts';

interface Props { lang?: L; methodHref?: string; preset?: { jahr?: number; art?: string; alter?: number } }
export default function AbschlagRechner({ lang = 'de', methodHref, preset = {} }: Props) {
  const f = fm(lang);
  const rw = P.rentenwert.ab_2026_07;
  const d = { jahr: preset.jahr ?? 1964, monat: 6, alterJ: preset.alter ?? 65, alterM: 0, art: preset.art ?? 'langjaehrig', rente: 1600, ep: 0 };
  const [jahr, setJahr] = useState(d.jahr);
  const [monat, setMonat] = useState(String(d.monat));
  const [alterJ, setAlterJ] = useState(d.alterJ);
  const [alterM, setAlterM] = useState(d.alterM);
  const [art, setArt] = useState(d.art);
  const [rente, setRente] = useState(d.rente);
  const [ep, setEp] = useState(d.ep);
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setJahr(num(u, 'j', d.jahr)); setMonat(str(u, 'm', String(d.monat))); setAlterJ(num(u, 'aj', d.alterJ)); setAlterM(num(u, 'am', d.alterM)); setArt(str(u, 'art', d.art)); setRente(num(u, 'r', d.rente)); setEp(num(u, 'ep', d.ep));
  }, []);
  useEffect(() => { updateURL({ j: jahr, m: monat, aj: alterJ, am: alterM, art, r: rente, ep }); }, [jahr, monat, alterJ, alterM, art, rente, ep]);

  const g = { jahr: Math.min(Math.max(Math.round(jahr) || 1964, 1955), 2000), monat: Number(monat), tag: 15 };
  const schwb = art === 'schwb';
  const o = useMemo(() => optionen(g, { wz35: true, wz45: false, schwb }).find((x) => x.art === (schwb ? 'schwb' : 'langjaehrig'))!, [g.jahr, g.monat, schwb]);
  const wunsch = beginn(g, { j: Math.round(alterJ), m: Math.min(11, Math.max(0, Math.round(alterM))) });
  const start = Math.min(Math.max(wunsch, o.frueh), o.voll);
  const monate = o.voll - start;
  const ab = monate * P.zugangsfaktor.abschlag_monat;
  const be = breakEven(monate, rente, rw, ep);
  const verlustMonat = rente * ab;
  const startAlter = alterBei(g, start);
  const beAlter = Number.isFinite(be.monate) ? alterBei(g, o.voll + Math.ceil(be.monate)) : null;
  const zuFrueh = wunsch < o.frueh;
  const steps = [
    tx(lang, `Abschlagsfrei ab ${fmtMonat(o.voll, lang)} (${fmtAlter(o.vollAlter, lang)}); frühestens ab ${fmtMonat(o.frueh, lang)} (${fmtAlter(o.fruehAlter, lang)}).`, `No reduction from ${fmtMonat(o.voll, lang)} (${fmtAlter(o.vollAlter, lang)}); earliest ${fmtMonat(o.frueh, lang)} (${fmtAlter(o.fruehAlter, lang)}).`),
    zuFrueh ? tx(lang, 'Ihr Wunschalter liegt vor dem frühesten Beginn: gerechnet wird mit dem frühesten Monat.', 'Your chosen age is before the earliest start: the earliest month is used.') : '',
    tx(lang, `${f.num(monate)} Monate × 0,3 % = ${f.pct(ab, 1)} Abschlag, lebenslang (§ 77 Abs. 2 Nr. 2a SGB VI).`, `${f.num(monate)} months × 0.3% = ${f.pct(ab, 1)} reduction, for life (section 77(2) no. 2a SGB VI).`),
    tx(lang, `Vorsprung der früheren Zahlungen: ${f.num(monate)} × ${f.eur(be.gekuerzt)} = ${f.eur(be.vorsprung)}. Monatlicher Unterschied danach: ${f.eur(be.diff)}${ep > 0 ? ` (inklusive ${f.num(ep, 2)} weiterer Entgeltpunkte × ${f.eur(rw, 2)})` : ''}.`, `Head start from the earlier payments: ${f.num(monate)} × ${f.eur(be.gekuerzt)} = ${f.eur(be.vorsprung)}. Monthly difference afterwards: ${f.eur(be.diff)}${ep > 0 ? ` (including ${f.num(ep, 2)} more pension points × ${f.eur(rw, 2)})` : ''}.`),
    tx(lang, 'Ohne Rentenanpassungen und Steuern, in heutigen Euro.', 'Ignores future pension increases and tax, in today’s euros.'),
  ].filter(Boolean);
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ab-j" label={tx(lang, 'Geburtsjahr', 'Year of birth')} value={jahr} onChange={setJahr} max={2000} lang={lang} />
            <SelectField id="ab-m" label={tx(lang, 'Geburtsmonat', 'Month of birth')} value={monat} onChange={setMonat} options={monatOpt(lang)} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ab-aj" label={tx(lang, 'Rente ab Alter (Jahre)', 'Start at age (years)')} value={alterJ} onChange={setAlterJ} max={70} lang={lang} />
            <NumberField id="ab-am" label={tx(lang, 'und Monaten', 'and months')} value={alterM} onChange={setAlterM} max={11} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="ab-art" label={tx(lang, 'Rentenart', 'Pension type')} value={art} onChange={setArt} options={[{ value: 'langjaehrig', label: tx(lang, '35 Jahre', '35 years') }, { value: 'schwb', label: tx(lang, 'Schwerbehindert', 'Severely disabled') }]} />
            <NumberField id="ab-r" label={tx(lang, 'Rente ohne Abschlag', 'Pension without reduction')} value={rente} onChange={setRente} unit="€" max={5000} lang={lang} />
          </div>
          <NumberField id="ab-ep" label={tx(lang, 'Punkte bis zum späteren Beginn', 'Points until the later start')} value={ep} onChange={setEp} decimals={2} max={10} lang={lang} help={tx(lang, 'wenn Sie weiterarbeiten würden, sonst 0', 'if you would keep working, otherwise 0')} />
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'Abschlag', 'Reduction')} wert={f.pct(ab, 1)} unter={tx(lang, `Beginn ${fmtMonat(start, lang)} mit ${fmtAlter(startAlter, lang)}`, `start ${fmtMonat(start, lang)} at ${fmtAlter(startAlter, lang)}`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Monate vor dem abschlagsfreien Beginn', 'Months before the unreduced start'), value: f.num(monate) },
            { label: tx(lang, 'Rente nach Abschlag', 'Pension after reduction'), value: f.eur(be.gekuerzt), strong: true },
            { label: tx(lang, 'Weniger pro Monat', 'Less per month'), value: f.eur(verlustMonat) },
            { label: tx(lang, 'Weniger in 20 Jahren', 'Less over 20 years'), value: f.eur(verlustMonat * 240) },
            { label: tx(lang, 'Warten lohnt sich ab', 'Waiting pays off from'), value: beAlter && monate > 0 ? tx(lang, `${beAlter.j} Jahren`, `age ${beAlter.j}`) : '–', sep: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Abschlag ${f.pct(ab, 1)}: ${f.eur(be.gekuerzt)} statt ${f.eur(rente)}`, `Reduction ${f.pct(ab, 1)}: ${f.eur(be.gekuerzt)} instead of ${f.eur(rente)}`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
