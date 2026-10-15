/**
 * Witwenrente (§§ 46, 67, 97, 242a, 255 SGB VI; §§ 18a, 18b SGB IV) und Erwerbsminderungsrente
 * (§§ 43, 67, 77, 96a, 253a SGB VI).
 */
import { P, r2 } from './params';

const W = P.witwe;
export type EinkommenTyp = keyof typeof W.abzug;
export const EINKOMMEN_TYPEN = Object.keys(W.abzug) as EinkommenTyp[];

/** Pauschal gekürztes Nettoeinkommen nach § 18b Abs. 5 SGB IV. */
export const nettoEinkommen = (typ: EinkommenTyp, brutto: number) => r2(Math.max(0, brutto) * (1 - W.abzug[typ]));
/** Freibetrag: 26,4 × aktueller Rentenwert, je waisenrentenberechtigtem Kind 5,6 × Rentenwert (§ 97 Abs. 2). */
export const freibetrag = (rw: number, kinder = 0) => r2(W.freibetrag_faktor * rw + W.kind_faktor * rw * Math.max(0, kinder));

/** Altersgrenze der großen Witwenrente nach dem Todesjahr (§ 242a Abs. 5): 2026 = 46 Jahre und 6 Monate. */
export function grossAlter(todesjahr: number): { j: number; m: number } {
  const t = W.gross_alter as Record<string, number[]>;
  const k = Math.min(Math.max(todesjahr, 2024), 2029);
  const [j, m] = t[String(k)];
  return { j, m };
}

export interface WitweEingabe {
  renteVerstorbener: number;     // Monatsrente des Verstorbenen ohne Abschlag
  gross: boolean;
  altesRecht: boolean;           // Ehe vor 2002 und ein Partner vor dem 2.1.1962 geboren
  einkommen: Array<{ typ: EinkommenTyp; brutto: number }>;
  kinder: number;
  rw: number;
}
export function witwenrente(e: WitweEingabe) {
  const faktor = e.gross ? (e.altesRecht ? W.gross_faktor_alt : W.gross_faktor) : W.klein_faktor;
  const brutto = r2(e.renteVerstorbener * faktor);
  const netto = r2(e.einkommen.reduce((s, x) => s + nettoEinkommen(x.typ, x.brutto), 0));
  const frei = freibetrag(e.rw, e.kinder);
  const ueber = Math.max(0, netto - frei);
  const anrechnung = r2(Math.min(brutto, ueber * W.anrechnung));
  return { faktor, brutto, sterbevierteljahr: r2(e.renteVerstorbener), netto, frei, ueber, anrechnung, zahlbetrag: r2(brutto - anrechnung), befristet: !e.gross && !e.altesRecht };
}

const E = P.em;
/** Ende der Zurechnungszeit nach Jahr des Rentenbeginns (§ 253a): 2026 = 66 Jahre und 3 Monate. */
export function zurechnungEnde(jahr: number): number {
  const t = E.zurechnung_ende as Record<string, number[]>;
  const k = Math.min(Math.max(jahr, 2024), 2030);
  const [j, m] = t[String(k)];
  return j + m / 12;
}
export interface EmEingabe { ep: number; alter: number; voll: boolean; jahr: number; rw: number }
/**
 * Vereinfachte Gesamtleistungsbewertung: Durchschnitt der Entgeltpunkte je Monat seit dem 17. Geburtstag,
 * fortgeschrieben bis zum Ende der Zurechnungszeit. Abschlag 0,3 % je Monat vor 65, höchstens 36 Monate.
 */
export function emRente(e: EmEingabe) {
  const alter = Math.max(E.zurechnung_beginn_alter + 1, e.alter);
  const monateBisher = (alter - E.zurechnung_beginn_alter) * 12;
  const schnitt = e.ep / monateBisher;
  const ende = zurechnungEnde(e.jahr);
  const monateZ = Math.max(0, Math.round((ende - alter) * 12));
  const epZ = schnitt * monateZ;
  const ab = Math.max(alter, P.zugangsfaktor.em_mindestalter);
  const monateAbschlag = Math.min(P.zugangsfaktor.em_max_monate, Math.max(0, Math.round((P.zugangsfaktor.em_referenzalter - ab) * 12)));
  const zf = 1 - monateAbschlag * P.zugangsfaktor.abschlag_monat;
  const raf = e.voll ? E.rentenartfaktor_voll : E.rentenartfaktor_teil;
  const ep = e.ep + epZ;
  return { schnitt, monateZ, epZ, ep, ende, monateAbschlag, zf, raf, rente: r2(ep * zf * raf * e.rw) };
}
/** Hinzuverdienstgrenze im Jahr (§ 96a Abs. 1c); bei teilweiser EM mindestens 6/8 × 14 × Bezugsgröße. */
export function hinzuGrenze(voll: boolean, epBestesJahr = 0): number {
  const bz = P.rechengroessen.bezugsgroesse_monat;
  if (voll) return r2(E.hinzu_voll_anteil * E.hinzu_monate * bz);
  return r2(Math.max(E.hinzu_teil_faktor * bz * epBestesJahr, E.hinzu_teil_min_anteil * E.hinzu_monate * bz));
}
/** Kürzung bei Überschreiten: 40 % eines Zwölftels des übersteigenden Betrags (§ 96a Abs. 1a). */
export function emKuerzung(rente: number, hinzuJahr: number, grenze: number) {
  const ueber = Math.max(0, hinzuJahr - grenze);
  const abzug = r2(Math.min(rente, (ueber / 12) * E.hinzu_anrechnung));
  return { ueber, abzug, zahlbetrag: r2(rente - abzug) };
}
