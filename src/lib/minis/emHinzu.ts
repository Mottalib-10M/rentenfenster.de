/** Hinzuverdienst bei Erwerbsminderungsrente (§ 96a SGB VI). */
import type { MiniSpec } from '../mini-types';
import { hinzuGrenze, emKuerzung } from '../engine/hinterbliebene';
import { T, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Hinzuverdienst neben der vollen EM-Rente', 'Earnings alongside a full disability pension'),
  cta: T(l, 'EM-Rente berechnen', 'Calculate the disability pension'),
  inputs: [
    { id: 'r', label: T(l, 'EM-Rente brutto', 'Disability pension, gross'), def: 1200, unit: '€', max: 4000 },
    { id: 'h', label: T(l, 'Hinzuverdienst im Jahr', 'Earnings a year'), def: 24000, unit: '€', max: 100000 },
  ],
  run: (v) => {
    const gr = hinzuGrenze(true); const k = emKuerzung(v.r, v.h, gr);
    return {
      head: [T(l, 'Rente nach Anrechnung', 'Pension after the test'), eur(k.zahlbetrag, l)],
      rows: [
        [T(l, 'Hinzuverdienstgrenze 2026', 'Earnings limit 2026'), eur(gr, l, 2)],
        [T(l, 'Über der Grenze', 'Above the limit'), eur(k.ueber, l)],
        [T(l, 'Kürzung im Monat', 'Cut a month'), eur(k.abzug, l, 2)],
      ],
      note: T(l, 'Mehr Arbeitsstunden als ärztlich festgestellt können den Anspruch selbst gefährden.', 'Working more hours than the medical finding allows can put the entitlement itself at risk.'),
    };
  },
});
