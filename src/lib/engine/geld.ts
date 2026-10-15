/**
 * Rentenhöhe, Beiträge und Steuer.
 * Rentenformel (§ 64 SGB VI), Entgeltpunkte (§ 70), KVdR (§§ 241, 247, 249a SGB V), Pflege (§§ 55, 59 SGB XI),
 * Besteuerungsanteil (§ 22 EStG), Tarif 2026 (§ 32a EStG), Pauschbeträge (§§ 9a, 10c), Soli (§§ 3, 4 SolZG).
 */
import { P, r2 } from './params';

const RG = P.rechengroessen;
const S = P.steuer;

/** Entgeltpunkte eines Jahresbruttos (bis zur Beitragsbemessungsgrenze) mit dem vorläufigen Durchschnittsentgelt 2026. */
export function epAusBrutto(jahresbrutto: number): number {
  return Math.min(Math.max(0, jahresbrutto), RG.bbg_rv_monat * 12) / RG.durchschnittsentgelt_2026_vorlaeufig;
}
export const epMax = () => (RG.bbg_rv_monat * 12) / RG.durchschnittsentgelt_2026_vorlaeufig;
/** Monatsrente brutto: Entgeltpunkte × Zugangsfaktor × Rentenartfaktor × Rentenwert. */
export const monatsrente = (ep: number, rw: number, zf = 1, raf = 1) => r2(ep * zf * raf * rw);

/** Hochrechnung: heutige Punkte plus weitere Jahre mit gleichem Bruttolohn, in heutigen Werten (keine Lohn- oder Rentensteigerung). */
export function hochrechnung(epHeute: number, jahresbrutto: number, jahre: number, rw: number) {
  const epJahr = epAusBrutto(jahresbrutto);
  const ep = epHeute + epJahr * Math.max(0, jahre);
  return { epJahr, ep, rente: monatsrente(ep, rw) };
}

/** Einkommensteuer nach § 32a Abs. 1 EStG (Grundtarif 2026), auf volle Euro abgerundet. */
export function est(zve: number): number {
  const x = Math.floor(Math.max(0, zve));
  if (x <= S.grundfreibetrag) return 0;
  if (x <= S.zone2_bis) { const y = (x - S.grundfreibetrag) / 10000; return Math.floor((S.z2[0] * y + S.z2[1]) * y); }
  if (x <= S.zone3_bis) { const z = (x - S.zone2_bis) / 10000; return Math.floor((S.z3[0] * z + S.z3[1]) * z + S.z3[2]); }
  if (x <= S.zone4_bis) return Math.floor(S.z4[0] * x - S.z4[1]);
  return Math.floor(S.z5[0] * x - S.z5[1]);
}
/** Splittingtarif (§ 32a Abs. 5). */
export const estSplitting = (zve: number) => 2 * est(zve / 2);
/** Solidaritätszuschlag mit Freigrenze und Milderungszone. */
export function soli(steuer: number, zusammen: boolean): number {
  const frei = zusammen ? S.soli_freigrenze_zusammen : S.soli_freigrenze_einzel;
  if (steuer <= frei) return 0;
  return r2(Math.min(steuer * S.soli_satz, (steuer - frei) * S.soli_milderung));
}
/** Besteuerungsanteil nach Jahr des Rentenbeginns (Prozent → Anteil). */
export function besteuerungsanteil(jahr: number): number {
  const t = S.besteuerungsanteil as Record<string, number>;
  const j = Math.min(Math.max(jahr, 2005), 2058);
  return t[String(j)] / 100;
}

export interface NettoEingabe {
  brutto: number;            // Monatsrente brutto
  zusatz: number;            // Zusatzbeitrag der Krankenkasse (Anteil, z. B. 0,029)
  kinderlos: boolean;
  startjahr: number;         // Jahr des Rentenbeginns
  weitere: number;           // weitere steuerpflichtige Einkünfte im Jahr (nach deren Freibeträgen)
  verheiratet: boolean;      // Zusammenveranlagung
  partner: number;           // steuerpflichtige Einkünfte des Ehegatten im Jahr
  kirche: number;            // 0, 0,08 oder 0,09
  freibetrag?: number;       // Rentenfreibetrag laut Steuerbescheid, falls bekannt
  kvFrei?: boolean;          // privat versichert: kein Beitrag aus der Rente (Zuschuss nicht eingerechnet)
}
export interface NettoErgebnis {
  kv: number; pv: number; kvSatz: number; pvSatz: number; sozial: number;
  jahresrente: number; anteil: number; steuerpflichtig: number; zve: number;
  est: number; soli: number; kist: number; steuerJahr: number; steuerMonat: number;
  netto: number; nettoVorSteuer: number;
}
export function netto(e: NettoEingabe): NettoErgebnis {
  const kvSatz = e.kvFrei ? 0 : (P.kv.allgemein + e.zusatz) * P.kv.rentner_anteil;
  const pvSatz = e.kvFrei ? 0 : P.pv.satz + (e.kinderlos ? P.pv.kinderlos_zuschlag : 0);
  const kv = r2(e.brutto * kvSatz), pv = r2(e.brutto * pvSatz);
  const sozial = r2(kv + pv);
  const jahresrente = e.brutto * 12;
  const anteil = besteuerungsanteil(e.startjahr);
  const steuerpflichtig = e.freibetrag && e.freibetrag > 0 ? Math.max(0, jahresrente - e.freibetrag) : jahresrente * anteil;
  const einkuenfte = Math.max(0, steuerpflichtig - S.wk_pauschbetrag_rente);
  const sa = S.sa_pauschbetrag * (e.verheiratet ? 2 : 1);
  const vorsorge = sozial * 12;
  const zve = Math.max(0, einkuenfte + e.weitere + (e.verheiratet ? e.partner : 0) - sa - vorsorge);
  const st = e.verheiratet ? estSplitting(zve) : est(zve);
  const so = soli(st, e.verheiratet);
  const ki = r2(st * e.kirche);
  const steuerJahr = st + so + ki;
  const steuerMonat = r2(steuerJahr / 12);
  return { kv, pv, kvSatz, pvSatz, sozial, jahresrente, anteil, steuerpflichtig, zve, est: st, soli: so, kist: ki, steuerJahr, steuerMonat, nettoVorSteuer: r2(e.brutto - sozial), netto: r2(e.brutto - sozial - steuerMonat) };
}

/** Standardfall für Texte: alleinstehend, Eltern, durchschnittlicher Zusatzbeitrag, keine weiteren Einkünfte. */
export const nettoStandard = (brutto: number, startjahr = 2026) => netto({ brutto, zusatz: P.kv.zusatz_durchschnitt_2026, kinderlos: false, startjahr, weitere: 0, verheiratet: false, partner: 0, kirche: 0 });

/** Bruttorente, ab der Einkommensteuer anfällt (Standardfall), auf den Euro. */
export function steuerfreieGrenze(startjahr: number): number {
  let lo = 0, hi = 5000;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (nettoStandard(mid, startjahr).est > 0) hi = mid; else lo = mid; }
  return Math.floor(lo);
}

/** Rentenlücke: Wunsch-Netto minus Netto-Rente, und das Kapital, das sie über n Jahre deckt. */
export function luecke(wunschNetto: number, nettoRente: number, jahre: number, zins = 0) {
  const monat = Math.max(0, wunschNetto - nettoRente);
  const n = Math.max(0, jahre) * 12;
  const i = zins / 12;
  const kapital = i > 0 ? monat * (1 - Math.pow(1 + i, -n)) / i : monat * n;
  return { monat, jahr: monat * 12, kapital: r2(kapital) };
}

/** Ausgleichszahlung (§ 187a, § 187 Abs. 3): Betrag für einen Entgeltpunkt durch den Zugangsfaktor. */
export function ausgleich(ep: number, abschlagAnteil: number, rw: number) {
  const zf = 1 - abschlagAnteil;
  const proEP = RG.durchschnittsentgelt_2026_vorlaeufig * RG.beitragssatz_rv;
  const epMinus = ep * abschlagAnteil;
  const betrag = zf > 0 ? (epMinus / zf) * proEP : 0;
  const renteMinus = r2(epMinus * rw);
  return { zf, proEP: r2(proEP), epMinus, betrag: r2(betrag), renteMinus, jahreBisAmortisiert: renteMinus > 0 ? betrag / (renteMinus * 12) : Infinity };
}
