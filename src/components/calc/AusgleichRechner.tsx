/** Ausgleichszahlung für Abschläge (§ 187a, § 187 Abs. 3 SGB VI). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { ausgleich } from '../../lib/engine/geld';
import { P } from '../../lib/engine/params';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

interface Props { lang?: L; methodHref?: string; preset?: Record<string, never> }
export default function AusgleichRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const rw = P.rentenwert.ab_2026_07;
  const d = { ep: 42, monate: 24 };
  const [ep, setEp] = useState(d.ep);
  const [monate, setMonate] = useState(d.monate);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setEp(num(u, 'ep', d.ep)); setMonate(num(u, 'm', d.monate)); }, []);
  useEffect(() => { updateURL({ ep, m: monate }); }, [ep, monate]);
  const m = Math.min(Math.max(Math.round(monate), 0), 60);
  const a = useMemo(() => ausgleich(ep, m * P.zugangsfaktor.abschlag_monat, rw), [ep, m, rw]);
  const steps = [
    tx(lang, `Abschlag ${f.num(m)} × 0,3 % = ${f.pct(1 - a.zf, 1)}: ${f.num(ep, 2)} Punkte × ${f.pct(1 - a.zf, 1)} = ${f.num(a.epMinus, 4)} Punkte fehlen (${f.eur(a.renteMinus, 2)} im Monat).`, `Reduction ${f.num(m)} × 0.3% = ${f.pct(1 - a.zf, 1)}: ${f.num(ep, 2)} points × ${f.pct(1 - a.zf, 1)} = ${f.num(a.epMinus, 4)} points lost (${f.eur(a.renteMinus, 2)} a month).`),
    tx(lang, `Ein Punkt kostet 2026 Beitragssatz 18,6 % × vorläufiges Durchschnittsentgelt ${f.eur(P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig)} = ${f.eur(a.proEP, 2)} (§ 187 Abs. 3).`, `One point costs, in 2026, the 18.6% contribution rate × provisional average pay ${f.eur(P.rechengroessen.durchschnittsentgelt_2026_vorlaeufig)} = ${f.eur(a.proEP, 2)} (section 187(3)).`),
    tx(lang, `Weil die gekauften Punkte selbst gekürzt werden, wird durch den Zugangsfaktor ${f.num(a.zf, 3)} geteilt (§ 187a Abs. 3): ${f.num(a.epMinus, 4)} ÷ ${f.num(a.zf, 3)} × ${f.eur(a.proEP, 2)} = ${f.eur(a.betrag)}.`, `Because the points bought are reduced too, divide by the access factor ${f.num(a.zf, 3)} (section 187a(3)): ${f.num(a.epMinus, 4)} ÷ ${f.num(a.zf, 3)} × ${f.eur(a.proEP, 2)} = ${f.eur(a.betrag)}.`),
    tx(lang, 'Den verbindlichen Betrag nennt die Rentenversicherung in einer Auskunft, die Sie ab 50 beantragen können; Teilzahlungen sind erlaubt.', 'The binding amount comes in a statement from the pension insurer, available from age 50; part payments are allowed.'),
  ];
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="au-ep" label={tx(lang, 'Entgeltpunkte bei Rentenbeginn', 'Pension points at start')} value={ep} onChange={setEp} decimals={2} max={120} lang={lang} />
            <NumberField id="au-m" label={tx(lang, 'Monate vorzeitig', 'Months early')} value={monate} onChange={setMonate} max={60} lang={lang} />
          </div>
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'Ausgleichszahlung', 'Buy-out payment')} wert={f.eur(a.betrag)} unter={tx(lang, `gleicht ${f.eur(a.renteMinus, 2)} Rente im Monat aus`, `restores ${f.eur(a.renteMinus, 2)} of pension a month`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Abschlag', 'Reduction'), value: f.pct(1 - a.zf, 1) },
            { label: tx(lang, 'Preis je Entgeltpunkt', 'Price per point'), value: f.eur(a.proEP, 2) },
            { label: tx(lang, 'Rückfluss nach', 'Paid back after'), value: Number.isFinite(a.jahreBisAmortisiert) ? tx(lang, `${f.num(a.jahreBisAmortisiert, 1)} Jahren`, `${f.num(a.jahreBisAmortisiert, 1)} years`) : '–', strong: true, sep: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Ausgleich von ${f.pct(1 - a.zf, 1)} Abschlag: ${f.eur(a.betrag)}`, `Buying out a ${f.pct(1 - a.zf, 1)} reduction: ${f.eur(a.betrag)}`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
