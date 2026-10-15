/**
 * Altersgrenzen und Rentenbeginn (§§ 35 bis 38, 235 bis 236b, 77, 99 SGB VI; § 187 Abs. 2 BGB).
 * Monate werden als fortlaufender Index gezählt: idx = Jahr × 12 + (Monat − 1).
 */
import { P } from './params';

export interface Geburt { jahr: number; monat: number; tag: number }
export interface Alter { j: number; m: number }
export type Art = 'regel' | 'langjaehrig' | 'besonders' | 'schwb';
export const ARTEN: Art[] = ['regel', 'langjaehrig', 'besonders', 'schwb'];

const A = P.altersgrenzen;
const ZF = P.zugangsfaktor;
export const ENDGUELTIG = A.endgueltig_ab_jahrgang;

export const idx = (jahr: number, monat: number) => jahr * 12 + (monat - 1);
export const vonIdx = (i: number) => ({ jahr: Math.floor(i / 12), monat: (i % 12) + 1 });
const plus = (basis: number, monate: number): Alter => ({ j: basis + Math.floor(monate / 12), m: monate % 12 });
const anhebung = (tab: Array<{ jahrgang: number; monate: number }>, jahr: number) => tab.find((r) => r.jahrgang === jahr)?.monate;

/** Regelaltersgrenze des Jahrgangs (§ 235 Abs. 2, § 35). */
export function regelalter(jahr: number): Alter {
  if (jahr >= ENDGUELTIG) return { j: A.regel_endalter, m: 0 };
  return plus(A.regel_tabelle_basis, anhebung(A.regel_anhebung, jahr) ?? 0);
}
/** Altersgrenze für besonders langjährig Versicherte, 45 Jahre (§ 236b, § 38). */
export function besondersAlter(jahr: number): Alter {
  if (jahr >= ENDGUELTIG) return { j: A.besonders_endalter, m: 0 };
  return plus(A.besonders_basis, anhebung(A.besonders_anhebung, jahr) ?? 0);
}
/** Schwerbehinderte Menschen: abschlagsfreies und frühestes Alter (§ 236a, § 37). */
export function schwbAlter(jahr: number): { voll: Alter; frueh: Alter } {
  if (jahr >= ENDGUELTIG) return { voll: { j: A.schwb_endalter, m: 0 }, frueh: { j: A.schwb_frueh_endalter, m: 0 } };
  const n = anhebung(A.schwb_anhebung, jahr) ?? 0;
  return { voll: plus(A.schwb_basis, n), frueh: plus(A.schwb_frueh_basis, n) };
}
/** Langjährig Versicherte, 35 Jahre: frühestens 63, abschlagsfrei mit der Regelaltersgrenze (§ 236, § 36). */
export function langjaehrigAlter(jahr: number, reform = false): { voll: Alter; frueh: Alter } {
  return { voll: regelalter(jahr), frueh: { j: reform ? P.reform.langjaehrig_neu_frueheste : A.langjaehrig_frueheste, m: 0 } };
}

/**
 * Erster Rentenmonat bei einem Alter: Das Lebensalter ist mit Ablauf des Tages vor dem Geburtstag
 * vollendet (§ 187 Abs. 2 BGB), die Rente beginnt mit dem Folgemonat (§ 99 Abs. 1 SGB VI).
 * Wer am 1. eines Monats geboren ist, vollendet sein Alter am letzten Tag des Vormonats.
 */
export function beginn(g: Geburt, a: Alter): number {
  return idx(g.jahr + a.j, g.monat) + a.m + (g.tag === 1 ? 0 : 1);
}
/** Alter (Jahre, Monate) am ersten Tag eines Rentenmonats. */
export function alterBei(g: Geburt, i: number): Alter {
  const m = i - idx(g.jahr, g.monat) - (g.tag === 1 ? 0 : 1);
  return { j: Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
}
/** Abschlag als Anteil (0,003 je Monat vor dem abschlagsfreien Beginn). */
export const abschlag = (monate: number) => Math.max(0, monate) * ZF.abschlag_monat;
/** Zuschlag nach der Regelaltersgrenze (0,005 je Monat). */
export const zuschlag = (monate: number) => Math.max(0, monate) * ZF.zuschlag_monat;

export interface Option {
  art: Art;
  /** Erster möglicher Rentenmonat (Index). */
  frueh: number;
  /** Erster Monat ohne Abschlag (Index). */
  voll: number;
  fruehAlter: Alter;
  vollAlter: Alter;
  monate: number;
  abschlag: number;
}
export interface Lage { wz35: boolean; wz45: boolean; schwb: boolean }

/** Alle Rentenarten, die nach geltendem Recht (oder im Reformszenario) offenstehen. */
export function optionen(g: Geburt, lage: Lage, reform = false): Option[] {
  const out: Option[] = [];
  const mk = (art: Art, fa: Alter, va: Alter): Option => {
    const frueh = beginn(g, fa), voll = beginn(g, va);
    return { art, frueh, voll, fruehAlter: fa, vollAlter: va, monate: voll - frueh, abschlag: abschlag(voll - frueh) };
  };
  const r = regelalter(g.jahr);
  out.push(mk('regel', r, r));
  if (lage.wz35) { const l = langjaehrigAlter(g.jahr, reform); out.push(mk('langjaehrig', l.frueh, l.voll)); }
  if (lage.wz45 && !reform) { const b = besondersAlter(g.jahr); out.push(mk('besonders', b, b)); }
  if (lage.schwb && lage.wz35) { const s = schwbAlter(g.jahr); out.push(mk('schwb', s.frueh, s.voll)); }
  return out;
}

/** Abschlag, wenn die Rente in Monat `start` beginnt: die günstigste offene Rentenart. */
export function abschlagBei(opts: Option[], start: number): { art: Art; monate: number; abschlag: number } | null {
  const offen = opts.filter((o) => o.frueh <= start);
  if (!offen.length) return null;
  const best = offen.map((o) => ({ art: o.art, monate: Math.max(0, o.voll - start), abschlag: abschlag(o.voll - start) })).sort((a, b) => a.abschlag - b.abschlag)[0];
  return best;
}

export interface Fenster { fruehest: Option; abschlagsfrei: Option; regel: Option; opts: Option[] }
export function fenster(g: Geburt, lage: Lage, reform = false): Fenster {
  const opts = optionen(g, lage, reform);
  const fruehest = [...opts].sort((a, b) => a.frueh - b.frueh || a.abschlag - b.abschlag)[0];
  const abschlagsfrei = [...opts].sort((a, b) => a.voll - b.voll)[0];
  const regel = opts.find((o) => o.art === 'regel')!;
  return { fruehest, abschlagsfrei, regel, opts };
}

/**
 * Lohnt sich der frühe Beginn? Vorsprung der früheren Zahlungen geteilt durch den monatlichen
 * Unterschied. `epZusatz`: Entgeltpunkte, die bis zum späteren Beginn noch hinzukämen.
 */
export function breakEven(monateFrueher: number, renteVoll: number, rw: number, epZusatz = 0) {
  const gekuerzt = renteVoll * (1 - abschlag(monateFrueher));
  const spaet = renteVoll + epZusatz * rw;
  const vorsprung = gekuerzt * monateFrueher;
  const diff = spaet - gekuerzt;
  const monate = diff > 0 ? vorsprung / diff : Infinity;
  return { gekuerzt, spaet, vorsprung, diff, monate };
}

export const fmtAlter = (a: Alter, l: 'de' | 'en') =>
  a.m === 0 ? (l === 'de' ? `${a.j} Jahre` : `${a.j} years`) : l === 'de' ? `${a.j} Jahre und ${a.m} ${a.m === 1 ? 'Monat' : 'Monate'}` : `${a.j} years ${a.m} ${a.m === 1 ? 'month' : 'months'}`;
const MON = {
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
export const fmtMonat = (i: number, l: 'de' | 'en') => { const d = vonIdx(i); return `${l === 'de' ? '1. ' : '1 '}${MON[l][d.monat - 1]} ${d.jahr}`; };
export const monatsName = (m: number, l: 'de' | 'en') => MON[l][m - 1];
