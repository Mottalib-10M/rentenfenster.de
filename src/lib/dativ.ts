/**
 * Deutsch: Altersangaben nach Präposition stehen im Dativ („mit 63 Jahren und 4 Monaten“, nicht
 * „mit 63 Jahre und 4 Monate“). Die Formatierer liefern den Nominativ; diese Funktion korrigiert den
 * Text einer Seite einmal zentral, für Anzeige und JSON-LD gleichermaßen.
 */
const RE = /\b(mit|ab|von|bei|vor|seit|nach|zwischen) (\d+) Jahre( und (\d+) Monate)?(?![\wäöü])/g;
export function dativ(s: string): string {
  return s.replace(RE, (_m, p: string, j: string, und?: string, m?: string) => `${p} ${j} Jahren${und ? ` und ${m} Monaten` : ''}`);
}
