/** Witwenrente mit Einkommensanrechnung (§§ 46, 67, 97, 255 SGB VI; § 18b SGB IV). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { witwenrente, type EinkommenTyp } from '../../lib/engine/hinterbliebene';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';
import { janein } from './opts';

const TYP: Array<{ v: EinkommenTyp; de: string; en: string }> = [
  { v: 'arbeitsentgelt', de: 'Arbeitslohn (−40 %)', en: 'Wages (−40%)' },
  { v: 'rente_ab_2011', de: 'Eigene Rente seit 2011 (−14 %)', en: 'Own pension since 2011 (−14%)' },
  { v: 'rente_vor_2011', de: 'Eigene Rente vor 2011 (−13 %)', en: 'Own pension before 2011 (−13%)' },
  { v: 'pension_ab_2011', de: 'Beamtenpension seit 2011 (−25 %)', en: 'Civil service pension since 2011 (−25%)' },
  { v: 'arbeitseinkommen', de: 'Selbstständig (−39,8 %)', en: 'Self-employed (−39.8%)' },
  { v: 'betriebsrente_ab_2011', de: 'Betriebsrente seit 2011 (−23 %)', en: 'Company pension since 2011 (−23%)' },
];
interface Props { lang?: L; methodHref?: string; preset?: { gross?: boolean } }
export default function WitwenRechner({ lang = 'de', methodHref, preset = {} }: Props) {
  const f = fm(lang);
  const rw = P.rentenwert.ab_2026_07;
  const d = { rente: 1500, gross: preset.gross === false ? '0' : '1', alt: '0', typ: 'rente_ab_2011', eink: 1200, kinder: 0 };
  const [rente, setRente] = useState(d.rente);
  const [gross, setGross] = useState(d.gross);
  const [alt, setAlt] = useState(d.alt);
  const [typ, setTyp] = useState(d.typ);
  const [eink, setEink] = useState(d.eink);
  const [kinder, setKinder] = useState(d.kinder);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setRente(num(u, 'r', d.rente)); setGross(str(u, 'g', d.gross)); setAlt(str(u, 'alt', d.alt)); setTyp(str(u, 'typ', d.typ)); setEink(num(u, 'e', d.eink)); setKinder(num(u, 'k', 0)); }, []);
  useEffect(() => { updateURL({ r: rente, g: gross, alt, typ, e: eink, k: kinder }); }, [rente, gross, alt, typ, eink, kinder]);
  const t = (TYP.find((x) => x.v === typ) ?? TYP[1]).v;
  const w = useMemo(() => witwenrente({ renteVerstorbener: rente, gross: gross === '1', altesRecht: alt === '1', einkommen: [{ typ: t, brutto: eink }], kinder, rw }), [rente, gross, alt, t, eink, kinder, rw]);
  const steps = [
    tx(lang, `Erste drei Monate nach dem Tod (Sterbevierteljahr): volle Rente ${f.eur(w.sterbevierteljahr, 2)}, ohne Einkommensanrechnung (§ 67, § 97 Abs. 1 SGB VI).`, `First three months after the death: full pension ${f.eur(w.sterbevierteljahr, 2)}, no income test (sections 67 and 97(1) SGB VI).`),
    tx(lang, `Danach ${f.pct(w.faktor, 0)} der Rente des Verstorbenen = ${f.eur(w.brutto, 2)}${w.befristet ? `, längstens ${P.witwe.klein_monate} Monate` : ''}.`, `After that ${f.pct(w.faktor, 0)} of the deceased’s pension = ${f.eur(w.brutto, 2)}${w.befristet ? `, for at most ${P.witwe.klein_monate} months` : ''}.`),
    tx(lang, `Ihr Einkommen ${f.eur(eink)} brutto, pauschal gekürzt (§ 18b SGB IV): ${f.eur(w.netto, 2)}.`, `Your income ${f.eur(eink)} gross, reduced by the flat rate (section 18b SGB IV): ${f.eur(w.netto, 2)}.`),
    tx(lang, `Freibetrag 26,4 × ${f.eur(rw, 2)}${kinder > 0 ? ` + ${f.num(kinder)} × 5,6 × ${f.eur(rw, 2)}` : ''} = ${f.eur(w.frei, 2)}. Über dem Freibetrag: ${f.eur(w.ueber, 2)}, davon 40 % = ${f.eur(w.anrechnung, 2)} Anrechnung.`, `Allowance 26.4 × ${f.eur(rw, 2)}${kinder > 0 ? ` + ${f.num(kinder)} × 5.6 × ${f.eur(rw, 2)}` : ''} = ${f.eur(w.frei, 2)}. Above it: ${f.eur(w.ueber, 2)}, 40% of which = ${f.eur(w.anrechnung, 2)} deducted.`),
  ];
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="wi-r" label={tx(lang, 'Rente des Verstorbenen', 'Deceased’s pension')} value={rente} onChange={setRente} unit="€" max={5000} lang={lang} help={tx(lang, 'brutto, ohne Abschlag', 'gross, unreduced')} />
            <SelectField id="wi-g" label={tx(lang, 'Art', 'Type')} value={gross} onChange={setGross} options={[{ value: '1', label: tx(lang, 'große Witwenrente', 'large widow’s pension') }, { value: '0', label: tx(lang, 'kleine Witwenrente', 'small widow’s pension') }]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="wi-t" label={tx(lang, 'Eigenes Einkommen', 'Your own income')} value={typ} onChange={setTyp} options={TYP.map((x) => ({ value: x.v, label: tx(lang, x.de, x.en) }))} />
            <NumberField id="wi-e" label={tx(lang, 'Betrag brutto im Monat', 'Gross amount a month')} value={eink} onChange={setEink} unit="€" max={20000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="wi-a" label={tx(lang, 'Altes Recht (Ehe vor 2002)', 'Old rules (married before 2002)')} value={alt} onChange={setAlt} options={janein(lang)} help={tx(lang, 'und ein Partner vor dem 2.1.1962 geboren', 'and one spouse born before 2 Jan 1962')} />
            <NumberField id="wi-k" label={tx(lang, 'Kinder mit Waisenrente', 'Children with orphan’s pension')} value={kinder} onChange={setKinder} max={10} lang={lang} />
          </div>
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'Witwenrente ab dem 4. Monat', 'Widow’s pension from month 4')} wert={f.eur(w.zahlbetrag)} unter={tx(lang, `brutto, vor Kranken- und Pflegebeitrag`, `gross, before health and care contributions`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Sterbevierteljahr (3 Monate)', 'First three months'), value: f.eur(w.sterbevierteljahr) },
            { label: tx(lang, 'Witwenrente ohne Anrechnung', 'Pension before income test'), value: f.eur(w.brutto, 2) },
            { label: tx(lang, 'Freibetrag', 'Allowance'), value: f.eur(w.frei, 2) },
            { label: tx(lang, 'Anrechnung', 'Income deduction'), value: `−${f.eur(w.anrechnung, 2)}` },
            { label: tx(lang, 'Zahlbetrag brutto', 'Amount paid, gross'), value: f.eur(w.zahlbetrag, 2), strong: true, sep: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Witwenrente: ${f.eur(w.zahlbetrag)} brutto nach Einkommensanrechnung`, `Widow’s pension: ${f.eur(w.zahlbetrag)} gross after the income test`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
