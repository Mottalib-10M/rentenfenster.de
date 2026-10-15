/** Rentenlücke: Wunsch-Netto minus Nettorente und das Kapital, das sie schließt. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { luecke, nettoStandard } from '../../lib/engine/geld';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

interface Props { lang?: L; methodHref?: string; preset?: Record<string, never> }
export default function LueckeRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const d = { netto: 2600, anteil: 80, rente: 1700, jahre: 22, zins: 2 };
  const [nettoLohn, setNettoLohn] = useState(d.netto);
  const [anteil, setAnteil] = useState(d.anteil);
  const [rente, setRente] = useState(d.rente);
  const [jahre, setJahre] = useState(d.jahre);
  const [zins, setZins] = useState(d.zins);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setNettoLohn(num(u, 'n', d.netto)); setAnteil(num(u, 'q', d.anteil)); setRente(num(u, 'r', d.rente)); setJahre(num(u, 'j', d.jahre)); setZins(num(u, 'z', d.zins)); }, []);
  useEffect(() => { updateURL({ n: nettoLohn, q: anteil, r: rente, j: jahre, z: zins }); }, [nettoLohn, anteil, rente, jahre, zins]);
  const nr = nettoStandard(rente);
  const wunsch = nettoLohn * anteil / 100;
  const l = useMemo(() => luecke(wunsch, nr.netto, jahre, zins / 100), [wunsch, nr.netto, jahre, zins]);
  const steps = [
    tx(lang, `Bedarf: ${f.num(anteil)} % von ${f.eur(nettoLohn)} = ${f.eur(wunsch)} netto im Monat.`, `Need: ${f.num(anteil)}% of ${f.eur(nettoLohn)} = ${f.eur(wunsch)} net a month.`),
    tx(lang, `Rente ${f.eur(rente)} brutto ergibt ${f.eur(nr.netto)} netto (Kranken-, Pflegebeitrag und Steuer, Beginn 2026, alleinstehend).`, `A gross pension of ${f.eur(rente)} gives ${f.eur(nr.netto)} net (health, care contributions and tax, starting 2026, single).`),
    tx(lang, `Lücke ${f.eur(l.monat)} im Monat. Kapital, das sie ${f.num(jahre)} Jahre lang schließt, bei ${f.num(zins, 1)} % Zins: ${f.eur(l.kapital)}.`, `Gap ${f.eur(l.monat)} a month. Capital that closes it for ${f.num(jahre)} years at ${f.num(zins, 1)}% interest: ${f.eur(l.kapital)}.`),
    tx(lang, 'In heutigen Euro, ohne Inflation und ohne Steuer auf die Entnahmen.', 'In today’s euros, ignoring inflation and tax on withdrawals.'),
  ];
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="lu-n" label={tx(lang, 'Nettolohn heute', 'Net pay today')} value={nettoLohn} onChange={setNettoLohn} unit="€" max={30000} lang={lang} />
            <NumberField id="lu-q" label={tx(lang, 'Davon im Alter nötig', 'Share needed in retirement')} value={anteil} onChange={setAnteil} unit="%" max={150} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="lu-r" label={tx(lang, 'Erwartete Rente brutto', 'Expected gross pension')} value={rente} onChange={setRente} unit="€" max={6000} lang={lang} />
            <NumberField id="lu-j" label={tx(lang, 'Jahre im Ruhestand', 'Years in retirement')} value={jahre} onChange={setJahre} max={45} lang={lang} />
          </div>
          <NumberField id="lu-z" label={tx(lang, 'Zins auf das Kapital', 'Interest on the capital')} value={zins} onChange={setZins} unit="%" decimals={1} max={10} lang={lang} />
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'Rentenlücke im Monat', 'Monthly pension gap')} wert={f.eur(l.monat)} unter={tx(lang, `Kapitalbedarf ${f.eur(l.kapital)}`, `capital needed ${f.eur(l.kapital)}`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Wunsch-Netto', 'Target net'), value: f.eur(wunsch) },
            { label: tx(lang, 'Nettorente', 'Net pension'), value: f.eur(nr.netto) },
            { label: tx(lang, 'Lücke im Jahr', 'Gap a year'), value: f.eur(l.jahr) },
            { label: tx(lang, 'Kapitalbedarf', 'Capital needed'), value: f.eur(l.kapital), strong: true, sep: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Rentenlücke ${f.eur(l.monat)} im Monat, Kapital ${f.eur(l.kapital)}`, `Pension gap ${f.eur(l.monat)} a month, capital ${f.eur(l.kapital)}`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
