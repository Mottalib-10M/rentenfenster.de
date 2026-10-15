/** Tests du moteur : valeurs relues dans le SGB VI, l'EStG et les pages de la DRV le 2026-10-15. */
import { describe, expect, it } from 'vitest';
import { P } from '../src/lib/engine/params';
import { regelalter, besondersAlter, schwbAlter, beginn, idx, optionen, fenster, abschlagBei, breakEven, alterBei } from '../src/lib/engine/alter';
import { est, estSplitting, soli, besteuerungsanteil, netto, epAusBrutto, ausgleich, steuerfreieGrenze, luecke } from '../src/lib/engine/geld';
import { witwenrente, freibetrag, grossAlter, emRente, hinzuGrenze, emKuerzung, nettoEinkommen } from '../src/lib/engine/hinterbliebene';

const RW = P.rentenwert.ab_2026_07;

describe('Altersgrenzen (§§ 235, 236, 236a, 236b SGB VI)', () => {
  it('Regelaltersgrenze: Tabelle § 235 Abs. 2', () => {
    expect(regelalter(1957)).toEqual({ j: 65, m: 11 });
    expect(regelalter(1958)).toEqual({ j: 66, m: 0 });
    expect(regelalter(1959)).toEqual({ j: 66, m: 2 });
    expect(regelalter(1960)).toEqual({ j: 66, m: 4 });
    expect(regelalter(1961)).toEqual({ j: 66, m: 6 });
    expect(regelalter(1962)).toEqual({ j: 66, m: 8 });
    expect(regelalter(1963)).toEqual({ j: 66, m: 10 });
    expect(regelalter(1964)).toEqual({ j: 67, m: 0 });
    expect(regelalter(1975)).toEqual({ j: 67, m: 0 });
  });
  it('45 Jahre: Tabelle § 236b Abs. 2, ab 1964 mit 65', () => {
    expect(besondersAlter(1958)).toEqual({ j: 64, m: 0 });
    expect(besondersAlter(1962)).toEqual({ j: 64, m: 8 });
    expect(besondersAlter(1963)).toEqual({ j: 64, m: 10 });
    expect(besondersAlter(1964)).toEqual({ j: 65, m: 0 });
  });
  it('Schwerbehinderte: Tabelle § 236a Abs. 2, ab 1964 65 und 62', () => {
    expect(schwbAlter(1961)).toEqual({ voll: { j: 64, m: 6 }, frueh: { j: 61, m: 6 } });
    expect(schwbAlter(1964)).toEqual({ voll: { j: 65, m: 0 }, frueh: { j: 62, m: 0 } });
  });
});

describe('Rentenbeginn (§ 99 SGB VI, § 187 Abs. 2 BGB)', () => {
  it('Geburtstag am 15.: Beginn im Folgemonat', () => {
    expect(beginn({ jahr: 1964, monat: 5, tag: 15 }, { j: 63, m: 0 })).toBe(idx(2027, 6));
  });
  it('Geburtstag am 1.: Beginn im Geburtsmonat', () => {
    expect(beginn({ jahr: 1964, monat: 5, tag: 1 }, { j: 63, m: 0 })).toBe(idx(2027, 5));
  });
  it('Dezember-Geborene wechseln ins nächste Jahr', () => {
    expect(beginn({ jahr: 1960, monat: 12, tag: 20 }, { j: 66, m: 4 })).toBe(idx(2027, 5));
  });
  it('alterBei ist die Umkehrung', () => {
    const g = { jahr: 1962, monat: 3, tag: 10 };
    expect(alterBei(g, beginn(g, { j: 64, m: 8 }))).toEqual({ j: 64, m: 8 });
  });
});

describe('Abschläge (§ 77 SGB VI)', () => {
  it('Jahrgang 1964, 35 Jahre, mit 63: 48 Monate, 14,4 %', () => {
    const o = optionen({ jahr: 1964, monat: 6, tag: 10 }, { wz35: true, wz45: false, schwb: false }).find((x) => x.art === 'langjaehrig')!;
    expect(o.monate).toBe(48);
    expect(o.abschlag).toBeCloseTo(0.144, 10);
  });
  it('zwei Jahre früher = 7,2 %, nicht 14,4 %', () => {
    const g = { jahr: 1964, monat: 6, tag: 10 };
    const opts = optionen(g, { wz35: true, wz45: false, schwb: false });
    const start = beginn(g, { j: 65, m: 0 });
    expect(abschlagBei(opts, start)!.abschlag).toBeCloseTo(0.072, 10);
  });
  it('Jahrgang 1960, 35 Jahre: 63 bis 66 und 4 Monate = 40 Monate, 12 %', () => {
    const o = optionen({ jahr: 1960, monat: 6, tag: 10 }, { wz35: true, wz45: false, schwb: false }).find((x) => x.art === 'langjaehrig')!;
    expect(o.monate).toBe(40);
    expect(o.abschlag).toBeCloseTo(0.12, 10);
  });
  it('Schwerbehindert 1964: höchstens 36 Monate, 10,8 %', () => {
    const o = optionen({ jahr: 1964, monat: 6, tag: 10 }, { wz35: true, wz45: false, schwb: true }).find((x) => x.art === 'schwb')!;
    expect(o.abschlag).toBeCloseTo(0.108, 10);
  });
  it('mit 45 Jahren: abschlagsfrei mit 65, frühestens 63 mit 14,4 %', () => {
    const f = fenster({ jahr: 1966, monat: 2, tag: 20 }, { wz35: true, wz45: true, schwb: false });
    expect(f.abschlagsfrei.art).toBe('besonders');
    expect(f.abschlagsfrei.vollAlter).toEqual({ j: 65, m: 0 });
    expect(f.fruehest.abschlag).toBeCloseTo(0.144, 10);
  });
  it('Reformszenario: keine 45-Jahre-Rente, frühestens 64 mit 10,8 %', () => {
    const f = fenster({ jahr: 1970, monat: 2, tag: 20 }, { wz35: true, wz45: true, schwb: false }, true);
    expect(f.opts.some((o) => o.art === 'besonders')).toBe(false);
    expect(f.fruehest.fruehAlter).toEqual({ j: 64, m: 0 });
    expect(f.fruehest.abschlag).toBeCloseTo(0.108, 10);
  });
  it('Break-even: 24 Monate früher mit 7,2 % holt der spätere Beginn nach gut 25 Jahren auf', () => {
    const b = breakEven(24, 1500, RW);
    expect(b.monate / 12).toBeCloseTo(25.78, 1);
  });
});

describe('Steuer 2026 (§ 32a EStG, § 22 EStG, SolZG)', () => {
  it('Grundfreibetrag 12 348 €', () => {
    expect(est(12348)).toBe(0);
    expect(est(12349)).toBe(0);
    expect(est(13348)).toBe(Math.floor((914.51 * 0.1 + 1400) * 0.1));
  });
  it('Tarif stetig an den Zonengrenzen', () => {
    for (const x of [17799, 69878, 277825]) expect(Math.abs(est(x + 1) - est(x))).toBeLessThanOrEqual(2);
  });
  it('Splitting = doppelte Steuer auf halbes Einkommen', () => {
    expect(estSplitting(40000)).toBe(2 * est(20000));
  });
  it('Soli: Freigrenze 20 350 €', () => {
    expect(soli(20350, false)).toBe(0);
    expect(soli(30000, false)).toBeCloseTo(Math.min(30000 * 0.055, (30000 - 20350) * 0.119), 2);
  });
  it('Besteuerungsanteil: 2026 = 84 %, 2040 = 91 %, 2058 = 100 %', () => {
    expect(besteuerungsanteil(2026)).toBe(0.84);
    expect(besteuerungsanteil(2040)).toBe(0.91);
    expect(besteuerungsanteil(2058)).toBe(1);
    expect(besteuerungsanteil(2001)).toBe(0.5);
  });
});

describe('Netto (KVdR, Pflege, Steuer)', () => {
  const basis = { zusatz: 0.029, kinderlos: false, startjahr: 2026, weitere: 0, verheiratet: false, partner: 0, kirche: 0 };
  it('KV 7,3 % + halber Zusatzbeitrag, Pflege 3,6 % voll', () => {
    const n = netto({ ...basis, brutto: 1000 });
    expect(n.kv).toBeCloseTo(87.5, 2);
    expect(n.pv).toBeCloseTo(36, 2);
  });
  it('kinderlos: Pflege 4,2 %', () => {
    expect(netto({ ...basis, brutto: 1000, kinderlos: true }).pv).toBeCloseTo(42, 2);
  });
  it('1 000 € Rente: keine Einkommensteuer', () => {
    expect(netto({ ...basis, brutto: 1000 }).est).toBe(0);
  });
  it('2 000 € Rente ab 2026: zu versteuerndes Einkommen nachvollziehbar', () => {
    const n = netto({ ...basis, brutto: 2000 });
    const zve = 24000 * 0.84 - 102 - 36 - (2000 * (0.073 + 0.0145 + 0.036)) * 12;
    expect(n.zve).toBeCloseTo(zve, 6);
    expect(n.est).toBe(est(zve));
  });
  it('Steuer beginnt 2026 etwas über 1 300 € Bruttorente', () => {
    const g = steuerfreieGrenze(2026);
    expect(g).toBeGreaterThan(1300);
    expect(g).toBeLessThan(1500);
  });
});

describe('Entgeltpunkte, Ausgleich, Lücke', () => {
  it('Durchschnittsentgelt 51 944 € = 1 Punkt', () => {
    expect(epAusBrutto(51944)).toBeCloseTo(1, 10);
    expect(epAusBrutto(500000)).toBeCloseTo(101400 / 51944, 10);
  });
  it('Ausgleichszahlung: 40 Punkte, 14,4 %', () => {
    const a = ausgleich(40, 0.144, RW);
    expect(a.proEP).toBeCloseTo(9661.58, 2);
    expect(a.betrag).toBeCloseTo((40 * 0.144 / 0.856) * 51944 * 0.186, 0);
  });
  it('Lücke ohne Zins', () => {
    expect(luecke(2000, 1500, 20).kapital).toBe(500 * 240);
  });
});

describe('Witwenrente (§ 97 SGB VI, § 18b SGB IV)', () => {
  it('Freibetrag 26,4 × 42,52 €', () => {
    expect(freibetrag(RW)).toBeCloseTo(1122.53, 2);
    expect(freibetrag(RW, 1)).toBeCloseTo(1122.53 + 238.11, 1);
  });
  it('Lohn 2 500 €: 40 % Pauschalabzug, 40 % Anrechnung', () => {
    expect(nettoEinkommen('arbeitsentgelt', 2500)).toBe(1500);
    const w = witwenrente({ renteVerstorbener: 1500, gross: true, altesRecht: false, einkommen: [{ typ: 'arbeitsentgelt', brutto: 2500 }], kinder: 0, rw: RW });
    expect(w.brutto).toBe(825);
    expect(w.anrechnung).toBeCloseTo((1500 - 1122.53) * 0.4, 1);
  });
  it('altes Recht 60 %, kleine 25 %', () => {
    expect(witwenrente({ renteVerstorbener: 1000, gross: true, altesRecht: true, einkommen: [], kinder: 0, rw: RW }).brutto).toBe(600);
    expect(witwenrente({ renteVerstorbener: 1000, gross: false, altesRecht: false, einkommen: [], kinder: 0, rw: RW }).brutto).toBe(250);
  });
  it('Altersgrenze große Witwenrente 2026: 46 Jahre 6 Monate', () => {
    expect(grossAlter(2026)).toEqual({ j: 46, m: 6 });
    expect(grossAlter(2031)).toEqual({ j: 47, m: 0 });
  });
});

describe('Erwerbsminderung (§§ 43, 77, 96a, 253a SGB VI)', () => {
  it('Zurechnungszeit 2026 bis 66 Jahre 3 Monate, Abschlag höchstens 10,8 %', () => {
    const r = emRente({ ep: 30, alter: 50, voll: true, jahr: 2026, rw: RW });
    expect(r.monateZ).toBe(195);
    expect(r.zf).toBeCloseTo(0.892, 10);
  });
  it('teilweise EM: halbe Rente', () => {
    const v = emRente({ ep: 30, alter: 50, voll: true, jahr: 2026, rw: RW }).rente;
    const t = emRente({ ep: 30, alter: 50, voll: false, jahr: 2026, rw: RW }).rente;
    expect(t).toBeCloseTo(v / 2, 1);
  });
  it('Hinzuverdienstgrenze 2026: volle EM 3/8 × 14 × 3 955 €', () => {
    expect(hinzuGrenze(true)).toBeCloseTo(20763.75, 2);
    expect(hinzuGrenze(false, 0.5)).toBeCloseTo(41527.5, 2);
    expect(emKuerzung(1200, 26763.75, 20763.75).abzug).toBeCloseTo(200, 2);
  });
});
