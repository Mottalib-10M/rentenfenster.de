/**
 * Rente brutto → netto (mode « netto ») oder Einkommensteuer auf die Rente (mode « steuer »):
 * KVdR nach §§ 241, 247, 249a SGB V, Pflege nach §§ 55, 59 SGB XI, Besteuerungsanteil nach § 22 EStG,
 * Tarif 2026 nach § 32a EStG, Soli und Kirchensteuer.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { netto } from '../../lib/engine/geld';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';
import { janein, kircheOpt } from './opts';

interface Props { lang?: L; methodHref?: string; mode?: 'netto' | 'steuer'; preset?: { brutto?: number; start?: number } }
export default function NettoRechner({ lang = 'de', methodHref, mode = 'netto', preset = {} }: Props) {
  const f = fm(lang);
  const st = mode === 'steuer';
  const d = { brutto: preset.brutto ?? (st ? 2000 : 1600), start: preset.start ?? 2026, zusatz: P.kv.zusatz_durchschnitt_2026 * 100, kl: 0, vh: 0, weitere: 0, partner: 0, ki: '0', fb: 0 };
  const [brutto, setBrutto] = useState(d.brutto);
  const [start, setStart] = useState(d.start);
  const [zusatz, setZusatz] = useState(d.zusatz);
  const [kl, setKl] = useState(String(d.kl));
  const [vh, setVh] = useState(String(d.vh));
  const [weitere, setWeitere] = useState(d.weitere);
  const [partner, setPartner] = useState(d.partner);
  const [ki, setKi] = useState(d.ki);
  const [fb, setFb] = useState(d.fb);
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setBrutto(num(u, 'b', d.brutto)); setStart(num(u, 's', d.start)); setZusatz(num(u, 'z', d.zusatz)); setKl(str(u, 'kl', '0')); setVh(str(u, 'vh', '0')); setWeitere(num(u, 'w', 0)); setPartner(num(u, 'p', 0)); setKi(str(u, 'ki', '0')); setFb(num(u, 'fb', 0));
  }, []);
  useEffect(() => { updateURL({ b: brutto, s: start, z: zusatz, kl, vh, w: weitere, p: partner, ki, fb }); }, [brutto, start, zusatz, kl, vh, weitere, partner, ki, fb]);
  const s = Math.min(Math.max(Math.round(start) || 2026, 2005), 2058);
  const r = useMemo(() => netto({ brutto, zusatz: zusatz / 100, kinderlos: kl === '1', startjahr: s, weitere, verheiratet: vh === '1', partner, kirche: Number(ki) / 100, freibetrag: fb }), [brutto, zusatz, kl, s, weitere, vh, partner, ki, fb]);
  const steps = [
    tx(lang, `Krankenversicherung: (14,6 % + ${f.num(zusatz, 2)} %) ÷ 2 = ${f.pct(r.kvSatz, 2)} der Rente; die andere Hälfte zahlt die Rentenversicherung (§ 249a SGB V).`, `Health insurance: (14.6% + ${f.num(zusatz, 2)}%) ÷ 2 = ${f.pct(r.kvSatz, 2)} of the pension; the pension insurer pays the other half (section 249a SGB V).`),
    tx(lang, `Pflegeversicherung: ${f.pct(r.pvSatz, 1)}, allein von Ihnen getragen (§ 59 SGB XI)${kl === '1' ? ', mit Zuschlag für Kinderlose' : ''}.`, `Long-term care insurance: ${f.pct(r.pvSatz, 1)}, paid by you alone (section 59 SGB XI)${kl === '1' ? ', including the childless surcharge' : ''}.`),
    fb > 0
      ? tx(lang, `Steuerpflichtig: Jahresrente ${f.eur(r.jahresrente)} minus Rentenfreibetrag ${f.eur(fb)} = ${f.eur(r.steuerpflichtig)}.`, `Taxable: annual pension ${f.eur(r.jahresrente)} minus your fixed tax-free amount ${f.eur(fb)} = ${f.eur(r.steuerpflichtig)}.`)
      : tx(lang, `Steuerpflichtig: ${f.pct(r.anteil, 1)} der Jahresrente ${f.eur(r.jahresrente)} (Rentenbeginn ${s}, § 22 EStG) = ${f.eur(r.steuerpflichtig)}.`, `Taxable: ${f.pct(r.anteil, 1)} of the annual pension ${f.eur(r.jahresrente)} (pension start ${s}, section 22 EStG) = ${f.eur(r.steuerpflichtig)}.`),
    tx(lang, `Minus 102 € Werbungskosten, ${vh === '1' ? '72' : '36'} € Sonderausgaben und ${f.eur(r.sozial * 12)} Kranken- und Pflegebeiträge: zu versteuern ${f.eur(r.zve)}${vh === '1' ? ' (Splitting)' : ''}; Grundfreibetrag ${f.eur(P.steuer.grundfreibetrag)}.`, `Minus €102 expenses allowance, €${vh === '1' ? '72' : '36'} special expenses and ${f.eur(r.sozial * 12)} health and care contributions: taxable income ${f.eur(r.zve)}${vh === '1' ? ' (joint assessment)' : ''}; basic allowance ${f.eur(P.steuer.grundfreibetrag)}.`),
    tx(lang, `Einkommensteuer ${f.eur(r.est)}, Soli ${f.eur(r.soli, 2)}, Kirchensteuer ${f.eur(r.kist, 2)} im Jahr. Die Rentenversicherung zieht keine Steuer ab: Sie wird mit der Steuererklärung fällig.`, `Income tax ${f.eur(r.est)}, solidarity surcharge ${f.eur(r.soli, 2)}, church tax ${f.eur(r.kist, 2)} a year. No tax is withheld from the pension: it is due with your tax return.`),
  ];
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ne-b" label={tx(lang, 'Rente brutto im Monat', 'Gross pension a month')} value={brutto} onChange={setBrutto} unit="€" max={6000} lang={lang} />
            <NumberField id="ne-s" label={tx(lang, 'Jahr des Rentenbeginns', 'Year the pension started')} value={start} onChange={setStart} max={2058} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ne-w" label={tx(lang, 'Weitere Einkünfte im Jahr', 'Other income a year')} value={weitere} onChange={setWeitere} unit="€" max={500000} lang={lang} help={tx(lang, 'steuerpflichtig, z. B. Miete', 'taxable, e.g. rent')} />
            <SelectField id="ne-vh" label={tx(lang, 'Verheiratet', 'Married')} value={vh} onChange={setVh} options={janein(lang)} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="ne-kl" label={tx(lang, 'Kinderlos', 'No children')} value={kl} onChange={setKl} options={janein(lang)} />
            <SelectField id="ne-ki" label={tx(lang, 'Kirchensteuer', 'Church tax')} value={ki} onChange={setKi} options={kircheOpt(lang)} />
          </div>
          <details className="rounded-lg border border-navy-200 p-3">
            <summary className="cursor-pointer text-sm font-medium text-navy-800">{tx(lang, 'Weitere Angaben', 'More options')}</summary>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberField id="ne-z" label={tx(lang, 'Zusatzbeitrag der Kasse', 'Health fund extra rate')} value={zusatz} onChange={setZusatz} unit="%" decimals={2} max={6} lang={lang} />
              <NumberField id="ne-fb" label={tx(lang, 'Rentenfreibetrag, falls bekannt', 'Fixed tax-free amount, if known')} value={fb} onChange={setFb} unit="€" max={50000} lang={lang} />
              <NumberField id="ne-p" label={tx(lang, 'Einkünfte des Ehepartners', 'Spouse’s taxable income')} value={partner} onChange={setPartner} unit="€" max={500000} lang={lang} />
            </div>
          </details>
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          {st
            ? <Kopf label={tx(lang, 'Steuer im Jahr', 'Tax a year')} wert={f.eur(r.steuerJahr)} unter={tx(lang, `${f.eur(r.steuerMonat)} pro Monat, zu versteuern ${f.eur(r.zve)}`, `${f.eur(r.steuerMonat)} a month, taxable income ${f.eur(r.zve)}`)} />
            : <Kopf label={tx(lang, 'Nettorente im Monat', 'Net pension a month')} wert={f.eur(r.netto)} unter={tx(lang, `von ${f.eur(brutto)} brutto`, `from ${f.eur(brutto)} gross`)} />}
          <Zeilen rows={[
            { label: tx(lang, 'Rente brutto', 'Gross pension'), value: f.eur(brutto) },
            { label: tx(lang, 'Krankenversicherung', 'Health insurance'), value: `−${f.eur(r.kv, 2)}` },
            { label: tx(lang, 'Pflegeversicherung', 'Care insurance'), value: `−${f.eur(r.pv, 2)}` },
            { label: tx(lang, 'Steuer (Monatsanteil)', 'Tax (monthly share)'), value: `−${f.eur(r.steuerMonat, 2)}` },
            { label: tx(lang, 'Netto', 'Net'), value: f.eur(r.netto, 2), strong: true, sep: true },
            { label: tx(lang, 'Steuerpflichtiger Anteil', 'Taxable share'), value: fb > 0 ? f.eur(r.steuerpflichtig) : f.pct(r.anteil, 1), muted: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Rente ${f.eur(brutto)} brutto: ${f.eur(r.netto)} netto, Steuer ${f.eur(r.steuerJahr)} im Jahr`, `Pension ${f.eur(brutto)} gross: ${f.eur(r.netto)} net, tax ${f.eur(r.steuerJahr)} a year`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
