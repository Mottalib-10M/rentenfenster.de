/** Auswahllisten der Rechner, in beiden Sprachen. */
import { monatsName } from '../../lib/engine/alter';
import type { L } from './kit';
export const monatOpt = (l: L) => Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monatsName(i + 1, l) }));
export const janein = (l: L) => [{ value: '0', label: l === 'de' ? 'Nein' : 'No' }, { value: '1', label: l === 'de' ? 'Ja' : 'Yes' }];
export const kircheOpt = (l: L) => [
  { value: '0', label: l === 'de' ? 'keine Kirchensteuer' : 'no church tax' },
  { value: '8', label: l === 'de' ? '8 % (Bayern, Baden-Württemberg)' : '8% (Bavaria, Baden-Württemberg)' },
  { value: '9', label: l === 'de' ? '9 % (übrige Länder)' : '9% (other states)' },
];
