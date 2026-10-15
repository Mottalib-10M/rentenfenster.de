/** Erwerbsminderungsrente mit Zurechnungszeit und Abschlag (§§ 43, 67, 77, 96a, 253a SGB VI), vereinfacht. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { emRente, hinzuGrenze } from '../../lib/engine/hinterbliebene';
import { nettoStandard } from '../../lib/engine/geld';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

interface Props { lang?: L; methodHref?: string; preset?: Record<string, never> }
export default function EmRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const rw = P.rentenwert.ab_2026_07;
  const d = { ep: 22, alter: 52, voll: '1' };
  const [ep, setEp] = useState(d.ep);
  const [alter, setAlter] = useState(d.alter);
  const [voll, setVoll] = useState(d.voll);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setEp(num(u, 'ep', d.ep)); setAlter(num(u, 'a', d.alter)); setVoll(str(u, 'v', d.voll)); }, []);
  useEffect(() => { updateURL({ ep, a: alter, v: voll }); }, [ep, alter, voll]);
  const r = useMemo(() => emRente({ ep, alter: Math.min(Math.max(alter, 18), 66), voll: voll === '1', jahr: 2026, rw }), [ep, alter, voll, rw]);
  const n = nettoStandard(r.rente);
  const grenze = hinzuGrenze(voll === '1');
  const steps = [
    tx(lang, `Durchschnitt seit dem 17. Geburtstag: ${f.num(ep, 2)} Punkte ÷ ${f.num((Math.max(alter, 18) - 17) * 12)} Monate = ${f.num(r.schnitt, 4)} je Monat.`, `Average since the 17th birthday: ${f.num(ep, 2)} points ÷ ${f.num((Math.max(alter, 18) - 17) * 12)} months = ${f.num(r.schnitt, 4)} per month.`),
    tx(lang, `Zurechnungszeit bis ${f.num(r.ende, 2)} Jahre (Rentenbeginn 2026, § 253a SGB VI): ${f.num(r.monateZ)} Monate × ${f.num(r.schnitt, 4)} = ${f.num(r.epZ, 2)} Punkte dazu.`, `Added period up to age ${f.num(r.ende, 2)} (pension starting 2026, section 253a SGB VI): ${f.num(r.monateZ)} months × ${f.num(r.schnitt, 4)} = ${f.num(r.epZ, 2)} extra points.`),
    tx(lang, `Abschlag: ${f.num(r.monateAbschlag)} Monate vor 65 × 0,3 % = ${f.pct(1 - r.zf, 1)} (höchstens 10,8 %, § 77 Abs. 2 Nr. 3).`, `Reduction: ${f.num(r.monateAbschlag)} months before 65 × 0.3% = ${f.pct(1 - r.zf, 1)} (capped at 10.8%, section 77(2) no. 3).`),
    tx(lang, `${f.num(r.ep, 2)} × ${f.num(r.zf, 3)} × Rentenartfaktor ${f.num(r.raf, 1)} × ${f.eur(rw, 2)} = ${f.eur(r.rente, 2)}.`, `${f.num(r.ep, 2)} × ${f.num(r.zf, 3)} × pension type factor ${f.num(r.raf, 1)} × ${f.eur(rw, 2)} = ${f.eur(r.rente, 2)}.`),
    tx(lang, 'Vereinfachung: Lücken, Schul- und Ausbildungszeiten bewertet die Rentenversicherung einzeln (Gesamtleistungsbewertung); der Durchschnitt kann im Bescheid höher oder niedriger sein.', 'Simplified: the pension insurer values gaps, school and training periods individually; the average in your decision may be higher or lower.'),
  ];
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="em-ep" label={tx(lang, 'Entgeltpunkte bisher', 'Pension points so far')} value={ep} onChange={setEp} decimals={2} max={100} lang={lang} />
            <NumberField id="em-a" label={tx(lang, 'Alter bei Erwerbsminderung', 'Age at onset')} value={alter} onChange={setAlter} decimals={1} max={66} lang={lang} />
          </div>
          <SelectField id="em-v" label={tx(lang, 'Art der Rente', 'Type of pension')} value={voll} onChange={setVoll} options={[{ value: '1', label: tx(lang, 'volle Erwerbsminderung (unter 3 Stunden)', 'full (under 3 hours a day)') }, { value: '0', label: tx(lang, 'teilweise (3 bis unter 6 Stunden)', 'partial (3 to under 6 hours)') }]} />
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'Erwerbsminderungsrente brutto', 'Gross disability pension')} wert={f.eur(r.rente)} unter={tx(lang, `netto rund ${f.eur(n.netto)}`, `about ${f.eur(n.netto)} net`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Punkte aus der Zurechnungszeit', 'Points from the added period'), value: f.num(r.epZ, 2) },
            { label: tx(lang, 'Abschlag', 'Reduction'), value: f.pct(1 - r.zf, 1) },
            { label: tx(lang, 'Hinzuverdienst bis (Jahr)', 'Earnings limit (year)'), value: f.eur(grenze) },
            { label: tx(lang, 'Netto (alleinstehend)', 'Net (single)'), value: f.eur(n.netto), strong: true, sep: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `EM-Rente: ${f.eur(r.rente)} brutto`, `Disability pension: ${f.eur(r.rente)} gross`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
