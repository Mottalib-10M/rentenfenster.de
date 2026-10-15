/** Gemeinsame Helfer der Mini-Rechner (vom Register ignoriert: Präfix „_“). */
import { formatMoney, formatPercent, formatNumber } from '../format';
import { monatsName } from '../engine/alter';
import { dativ } from '../dativ';
export type L = 'de' | 'en';
export const T = <A>(l: L, de: A, en: A): A => (l === 'en' ? en : typeof de === 'string' ? (dativ(de) as A) : de);
export const eur = (x: number, l: L, d?: number) => formatMoney(x, d ?? 0, l);
export const pct = (x: number, l: L, d = 1) => formatPercent(x, d, l);
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
export const janein = (l: L) => [{ value: '0', label: T(l, 'Nein', 'No') }, { value: '1', label: T(l, 'Ja', 'Yes') }];
export const monatOpt = (l: L) => Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monatsName(i + 1, l) }));
export type Rows = [string, string][];
