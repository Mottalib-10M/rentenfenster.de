/** Typisierter Zugriff auf params-2026.json: jeder Rechtswert der Seite steht dort, nie in Seiten oder Code. */
import raw from '../../data/params-2026.json';

export type SourceKey = keyof typeof raw.sources;
export type Params = typeof raw;
export const P: Params = raw;

/** Kaufmännische Rundung auf Cent. */
export const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
/** Aktueller Rentenwert in einem Monat. Ab 1. Juli 2026: 42,52 €. */
export function rentenwert(jahr = 2026, monat = 7): number {
  return jahr > 2026 || (jahr === 2026 && monat >= 7) ? P.rentenwert.ab_2026_07 : P.rentenwert.bis_2026_06;
}
