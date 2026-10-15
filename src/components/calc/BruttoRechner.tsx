/** Rentenrechner brutto: Entgeltpunkte heute + Punkte aus dem Lohn bis zum Rentenbeginn × Rentenwert (§§ 64, 70 SGB VI). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { hochrechnung, nettoStandard, epMax } from '../../lib/engine/geld';
import { P } from '../../lib/engine/params';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

interface Props { lang?: L; methodHref?: string; preset?: { ep?: number; lohn?: number; jahre?: number } }
export default function BruttoRechner({ lang = 'de', methodHref, preset = {} }: Props) {
  const f = fm(lang);
  const rw = P.rentenwert.ab_2026_07;
  const d = { ep: preset.ep ?? 28, lohn: preset.lohn ?? 48000, jahre: preset.jahre ?? 12, ab: 0 };
  const [ep, setEp] = useState(d.ep);
  const [lohn, setLohn] = useState(d.lohn);
  const [jahre, setJahre] = useState(d.jahre);
  const [ab, setAb] = useState(d.ab);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setEp(num(u, 'ep', d.ep)); setLohn(num(u, 'l', d.lohn)); setJahre(num(u, 'n', d.jahre)); setAb(num(u, 'a', d.ab)); }, []);
  useEffect(() => { updateURL({ ep, l: lohn, n: jahre, a: ab }); }, [ep, lohn, jahre, ab]);
  const h = useMemo(() => hochrechnung(ep, lohn, jahre, rw), [ep, lohn, jahre, rw]);
  const brutto = h.rente * (1 - Math.min(ab, 14.4) / 100);
  const n = nettoStandard(brutto);
  const steps = [
    tx(lang, `Lohn ${f.eur(lohn)} ÷ vorläufiges Durchschnittsentgelt 2026 ${f.eur(P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig)} = ${f.num(h.epJahr, 4)} Punkte pro Jahr (höchstens ${f.num(epMax(), 4)} an der Beitragsbemessungsgrenze).`, `Pay ${f.eur(lohn)} ÷ provisional 2026 average pay ${f.eur(P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig)} = ${f.num(h.epJahr, 4)} points a year (at most ${f.num(epMax(), 4)} at the contribution ceiling).`),
    tx(lang, `${f.num(ep, 2)} Punkte heute + ${f.num(jahre)} × ${f.num(h.epJahr, 4)} = ${f.num(h.ep, 2)} Punkte.`, `${f.num(ep, 2)} points today + ${f.num(jahre)} × ${f.num(h.epJahr, 4)} = ${f.num(h.ep, 2)} points.`),
    tx(lang, `× Rentenwert ${f.eur(rw, 2)} (ab 1. Juli 2026) = ${f.eur(h.rente, 2)}${ab > 0 ? `, nach ${f.num(ab, 1)} % Abschlag ${f.eur(brutto, 2)}` : ''}.`, `× pension value ${f.eur(rw, 2)} (from 1 July 2026) = ${f.eur(h.rente, 2)}${ab > 0 ? `, after a ${f.num(ab, 1)}% reduction ${f.eur(brutto, 2)}` : ''}.`),
    tx(lang, 'In heutigen Werten: künftige Lohn- und Rentenerhöhungen sind nicht eingerechnet, sie heben sich ungefähr auf.', 'In today’s values: future wage and pension increases are left out; they roughly offset each other.'),
  ];
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="br-ep" label={tx(lang, 'Entgeltpunkte bisher', 'Pension points so far')} value={ep} onChange={setEp} decimals={2} max={120} lang={lang} help={tx(lang, 'Renteninformation, Seite 1', 'pension statement, page 1')} />
            <NumberField id="br-l" label={tx(lang, 'Bruttolohn im Jahr', 'Gross pay a year')} value={lohn} onChange={setLohn} unit="€" max={1000000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="br-n" label={tx(lang, 'Jahre bis zur Rente', 'Years until retirement')} value={jahre} onChange={setJahre} max={50} lang={lang} />
            <NumberField id="br-a" label={tx(lang, 'Abschlag', 'Reduction')} value={ab} onChange={setAb} unit="%" decimals={1} max={14.4} lang={lang} help={tx(lang, '0 bei Beginn ohne Abschlag', '0 if no early start')} />
          </div>
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'Monatsrente brutto', 'Gross monthly pension')} wert={f.eur(brutto)} unter={tx(lang, `${f.num(h.ep, 2)} Entgeltpunkte, netto rund ${f.eur(n.netto)}`, `${f.num(h.ep, 2)} pension points, about ${f.eur(n.netto)} net`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Punkte pro Arbeitsjahr', 'Points per working year'), value: f.num(h.epJahr, 4) },
            { label: tx(lang, 'Wert eines Punktes', 'Value of one point'), value: f.eur(rw, 2) },
            { label: tx(lang, 'Rente aus einem Arbeitsjahr', 'Pension from one working year'), value: f.eur(h.epJahr * rw, 2) },
            { label: tx(lang, 'Kranken- und Pflegebeitrag', 'Health and care contributions'), value: `−${f.eur(n.sozial, 2)}` },
            { label: tx(lang, 'Netto (alleinstehend, Beginn 2026)', 'Net (single, starting 2026)'), value: f.eur(n.netto), strong: true, sep: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `${f.num(h.ep, 2)} Entgeltpunkte: ${f.eur(brutto)} brutto`, `${f.num(h.ep, 2)} points: ${f.eur(brutto)} gross`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
