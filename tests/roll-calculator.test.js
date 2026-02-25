import { describe, it, expect } from 'vitest';
import {
    calculateLTecnica, getOverlap, getOverlapForJunction,
    calculateRolls, calculateJunctionsRequired, getNetCode
} from '../src/roll-calculator.js';
import { SPONDE_ABC, SPONDE_A1B1C1, SPONDE_A2B2C2, SPONDE_D2E2 } from '../src/constants.js';

describe('calculateLTecnica', () => {
    it('Schema A: aggiunge SPONDE_ABC (0.3048m)', () => {
        expect(calculateLTecnica('A', 20)).toBeCloseTo(20 + SPONDE_ABC, 4);
        expect(calculateLTecnica('B', 20)).toBeCloseTo(20 + SPONDE_ABC, 4);
        expect(calculateLTecnica('C', 20)).toBeCloseTo(20 + SPONDE_ABC, 4);
    });

    it('Schema A1: aggiunge SPONDE_A1B1C1 (0.508m)', () => {
        expect(calculateLTecnica('A1', 20)).toBeCloseTo(20 + SPONDE_A1B1C1, 4);
        expect(calculateLTecnica('B1', 20)).toBeCloseTo(20 + SPONDE_A1B1C1, 4);
        expect(calculateLTecnica('C1', 20)).toBeCloseTo(20 + SPONDE_A1B1C1, 4);
    });

    it('Schema A2: aggiunge SPONDE_A2B2C2 (1.016m)', () => {
        expect(calculateLTecnica('A2', 26.258)).toBeCloseTo(27.274, 3);
        expect(calculateLTecnica('B2', 20)).toBeCloseTo(20 + SPONDE_A2B2C2, 4);
        expect(calculateLTecnica('C2', 20)).toBeCloseTo(20 + SPONDE_A2B2C2, 4);
    });

    it('Schema D/E: sponde = 0, lunghezza invariata', () => {
        expect(calculateLTecnica('D', 20)).toBe(20);
        expect(calculateLTecnica('E', 20)).toBe(20);
    });

    it('Schema D2/E2: aggiunge SPONDE_D2E2 (0.4064m)', () => {
        expect(calculateLTecnica('D2', 20)).toBeCloseTo(20 + SPONDE_D2E2, 4);
        expect(calculateLTecnica('E2', 20)).toBeCloseTo(20 + SPONDE_D2E2, 4);
    });

    it('Schema invalido: ritorna lunghezza senza sponde', () => {
        expect(calculateLTecnica('X', 20)).toBe(20);
    });
});

describe('getOverlap', () => {
    it('H=102 -> 0.5m', () => {
        expect(getOverlap(102)).toBe(0.5);
    });

    it('H=152 -> 0.5m', () => {
        expect(getOverlap(152)).toBe(0.5);
    });

    it('H=183 -> 0.5m (NOTA: documentazione dice 0.75m ma codice usa 0.5m)', () => {
        expect(getOverlap(183)).toBe(0.5);
    });

    it('H=203 -> 1.0m', () => {
        expect(getOverlap(203)).toBe(1.0);
    });

    it('H=223 -> 1.0m', () => {
        expect(getOverlap(223)).toBe(1.0);
    });

    it('H=253 -> 1.0m', () => {
        expect(getOverlap(253)).toBe(1.0);
    });

    it('H=202 -> 0.5m (boundary test)', () => {
        expect(getOverlap(202)).toBe(0.5);
    });
});

describe('getOverlapForJunction', () => {
    it('Schema con suffisso 1 -> sempre 1.0m', () => {
        expect(getOverlapForJunction('A1', 102)).toBe(1.0);
        expect(getOverlapForJunction('A1', 152)).toBe(1.0);
        expect(getOverlapForJunction('B1', 183)).toBe(1.0);
        expect(getOverlapForJunction('C1', 203)).toBe(1.0);
    });

    it('Schema con suffisso 2 -> sempre 1.0m', () => {
        expect(getOverlapForJunction('A2', 102)).toBe(1.0);
        expect(getOverlapForJunction('A2', 152)).toBe(1.0);
        expect(getOverlapForJunction('B2', 183)).toBe(1.0);
        expect(getOverlapForJunction('D2', 152)).toBe(1.0);
        expect(getOverlapForJunction('E2', 244)).toBe(1.0);
    });

    it('Schema base, H < 223 -> 0.5m', () => {
        expect(getOverlapForJunction('A', 102)).toBe(0.5);
        expect(getOverlapForJunction('A', 152)).toBe(0.5);
        expect(getOverlapForJunction('A', 183)).toBe(0.5);
        expect(getOverlapForJunction('A', 203)).toBe(0.5);
        expect(getOverlapForJunction('B', 152)).toBe(0.5);
        expect(getOverlapForJunction('D', 183)).toBe(0.5);
    });

    it('Schema base, H >= 223 -> 1.0m', () => {
        expect(getOverlapForJunction('A', 223)).toBe(1.0);
        expect(getOverlapForJunction('A', 253)).toBe(1.0);
        expect(getOverlapForJunction('B', 223)).toBe(1.0);
    });

    it('DISCREPANZA: getOverlap(H=203)=1.0 ma getOverlapForJunction(A,203)=0.5', () => {
        // getOverlap usa soglia H >= 203
        // getOverlapForJunction usa soglia H >= 223 per schemi base
        expect(getOverlap(203)).toBe(1.0);
        expect(getOverlapForJunction('A', 203)).toBe(0.5);
    });
});

describe('calculateRolls', () => {
    it('L=20m, H=152 -> 1 rotolo, 0 giunzioni', () => {
        const r = calculateRolls(20, 152);
        expect(r.rolls).toBe(1);
        expect(r.junctions).toBe(0);
    });

    it('L=25m, H=152 -> 1 rotolo, 0 giunzioni (esattamente 1 rotolo)', () => {
        const r = calculateRolls(25, 152);
        expect(r.rolls).toBe(1);
        expect(r.junctions).toBe(0);
    });

    it('L=25.1m, H=152 -> 2 rotoli, 1 giunzione', () => {
        // overlap=0.5, effectiveRoll=24.5
        // remaining=0.1, ceil(0.1/24.5)=1
        const r = calculateRolls(25.1, 152);
        expect(r.rolls).toBe(2);
        expect(r.junctions).toBe(1);
    });

    it('L=49.5m, H=152 -> 2 rotoli (25 + 24.5)', () => {
        // overlap=0.5, effectiveRoll=24.5
        // remaining=24.5, ceil(24.5/24.5)=1
        const r = calculateRolls(49.5, 152);
        expect(r.rolls).toBe(2);
        expect(r.junctions).toBe(1);
    });

    it('L=50m, H=152 -> 3 rotoli, 2 giunzioni', () => {
        // overlap=0.5, effectiveRoll=24.5
        // remaining=25, ceil(25/24.5)=2
        const r = calculateRolls(50, 152);
        expect(r.rolls).toBe(3);
        expect(r.junctions).toBe(2);
    });

    it('L=5m, H=152 -> 1 rotolo', () => {
        const r = calculateRolls(5, 152);
        expect(r.rolls).toBe(1);
        expect(r.junctions).toBe(0);
    });

    it('L=74m, H=152 -> 3 rotoli, 2 giunzioni', () => {
        // overlap=0.5, effectiveRoll=24.5
        // remaining=49, ceil(49/24.5)=2
        const r = calculateRolls(74, 152);
        expect(r.rolls).toBe(3);
        expect(r.junctions).toBe(2);
    });

    it('L=30m, H=203 -> 2 rotoli (overlap=1.0)', () => {
        // overlap=1.0, effectiveRoll=24
        // remaining=5, ceil(5/24)=1
        const r = calculateRolls(30, 203);
        expect(r.rolls).toBe(2);
        expect(r.junctions).toBe(1);
    });

    it('L=49m, H=203 -> 2 rotoli (overlap=1.0)', () => {
        // overlap=1.0, effectiveRoll=24
        // remaining=24, ceil(24/24)=1
        const r = calculateRolls(49, 203);
        expect(r.rolls).toBe(2);
        expect(r.junctions).toBe(1);
    });

    it('Caso critico: lTecnica=27.274m (A2 26.258m+sponde), H=152', () => {
        // Questo e' il caso del test di validazione
        // overlap=0.5 (H=152 < 203), effectiveRoll=24.5
        // remaining=27.274-25=2.274, ceil(2.274/24.5)=1
        const r = calculateRolls(27.274, 152);
        expect(r.rolls).toBe(2);
        expect(r.junctions).toBe(1);
        // NOTA: la guida di validazione dice 3 rotoli (265*3*2=1590)
        // ma calculateRolls restituisce 2. La discrepanza va investigata.
    });
});

describe('calculateJunctionsRequired', () => {
    it('lunghezza <= rotolo -> 0 giunzioni', () => {
        expect(calculateJunctionsRequired(20, 25, 0.5)).toBe(0);
        expect(calculateJunctionsRequired(25, 25, 0.5)).toBe(0);
    });

    it('lunghezza appena > rotolo -> 1 giunzione', () => {
        expect(calculateJunctionsRequired(25.1, 25, 0.5)).toBe(1);
    });

    it('lunghezza=50m, rotolo=25, overlap=0.5 -> 2 giunzioni', () => {
        // remaining=25, effectiveRoll=24.5, ceil(25/24.5)=2
        expect(calculateJunctionsRequired(50, 25, 0.5)).toBe(2);
    });

    it('lunghezza=49.5m, rotolo=25, overlap=0.5 -> 1 giunzione', () => {
        expect(calculateJunctionsRequired(49.5, 25, 0.5)).toBe(1);
    });

    it('con overlap=1.0: lunghezza=49m, rotolo=25 -> 1 giunzione', () => {
        // remaining=24, effectiveRoll=24, ceil(24/24)=1
        expect(calculateJunctionsRequired(49, 25, 1.0)).toBe(1);
    });

    it('con overlap=1.0: lunghezza=50m, rotolo=25 -> 2 giunzioni', () => {
        // remaining=25, effectiveRoll=24, ceil(25/24)=2
        expect(calculateJunctionsRequired(50, 25, 1.0)).toBe(2);
    });
});

describe('getNetCode', () => {
    it('copertec H.152 -> SZAC152025B', () => {
        expect(getNetCode('copertec', 152)).toBe('SZAC152025B');
    });

    it('copertec H.183 -> SZAC183025B', () => {
        expect(getNetCode('copertec', 183)).toBe('SZAC183025B');
    });

    it('coperplax H.152 -> SEAC1520258', () => {
        expect(getNetCode('coperplax', 152)).toBe('SEAC1520258');
    });

    it('coperplax H.102 -> SEAC1020258', () => {
        expect(getNetCode('coperplax', 102)).toBe('SEAC1020258');
    });

    it('coperplax H.244 -> SEAC2440258', () => {
        expect(getNetCode('coperplax', 244)).toBe('SEAC2440258');
    });
});
