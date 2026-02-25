import { describe, it, expect } from 'vitest';
import {
    calculateLongitudinalJunctions,
    calculateScrews, calculateTape,
    calculatePlates, calculateSprings, calculateClips,
    calculateAllAccessories
} from '../src/accessories-calculator.js';

describe('calculateLongitudinalJunctions', () => {
    it('lTecnica <= 25m -> 0 giunzioni', () => {
        const r = calculateLongitudinalJunctions(20, 'A', 152);
        expect(r.count).toBe(0);
        expect(r.overlap).toBe(0.5);
    });

    it('lTecnica=27.274m, schema A2, H=152 -> 1 giunzione, overlap=1.0', () => {
        const r = calculateLongitudinalJunctions(27.274, 'A2', 152);
        expect(r.count).toBe(1);
        expect(r.overlap).toBe(1.0); // suffisso 2 -> sempre 1.0
    });

    it('lTecnica=50m, schema A, H=152 -> 2 giunzioni, overlap=0.5', () => {
        // remaining=25, effectiveRoll=24.5, ceil(25/24.5)=2
        const r = calculateLongitudinalJunctions(50, 'A', 152);
        expect(r.count).toBe(2);
        expect(r.overlap).toBe(0.5);
    });

    it('lTecnica=30m, schema A, H=203 -> 1 giunzione, overlap=0.5', () => {
        // getOverlapForJunction('A', 203) -> 0.5 (H < 223 per schema base)
        const r = calculateLongitudinalJunctions(30, 'A', 203);
        expect(r.count).toBe(1);
        expect(r.overlap).toBe(0.5);
    });
});

describe('calculateScrews', () => {
    it('Schema A, L=20m, spacing=70cm, H=152, nessuna giunzione', () => {
        const result = calculateScrews({
            lTecnica: 20, spacing: 70, schema: 'A', hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        // vitiPerLinea = ceil(20/0.7) = 29
        // totale = 29*2 + 12 = 70
        expect(result.details.vitiZonaNormale).toBe(29);
        expect(result.details.vitiZonaInfittita).toBe(0);
        expect(result.details.nVitiPerLinea).toBe(29);
        expect(result.totalScrews).toBe(29 * 2 + 12);
        expect(result.screwCode).toBe('VQAS70050B');
    });

    it('Schema A, L=50m, spacing=70cm, H=152, con giunzioni', () => {
        const result = calculateScrews({
            lTecnica: 50, spacing: 70, schema: 'A', hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        // 2 giunzioni (50m), overlap=0.5, zonaInfittita = 2 * 0.5 * 2 = 2.0m
        // zonaNormale = 50 - 2.0 = 48m
        // vitiNormale = ceil(48/0.7) = 69
        // vitiInfittita = ceil(2.0/0.35) = 6
        // vitiPerLinea = 69 + 6 = 75
        // totale = 75*2 + 12 = 162
        expect(result.details.nGiunzioni).toBe(2);
        expect(result.details.lunghezzaNormale).toBeCloseTo(48, 1);
        expect(result.details.lunghezzaInfittita).toBeCloseTo(2.0, 1);
        expect(result.details.vitiZonaNormale).toBe(69);
        expect(result.details.vitiZonaInfittita).toBe(6);
        expect(result.totalScrews).toBe(75 * 2 + 12);
    });

    it('Schema A1, passo fisso 25.4cm', () => {
        const result = calculateScrews({
            lTecnica: 20, spacing: 70, schema: 'A1', hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        // A1 -> passo fisso 25.4cm indipendentemente dallo spacing della tabella
        expect(result.details.passoVitiCm).toBe(25.4);
        // vitiPerLinea = ceil(20/0.254) = 79
        expect(result.details.nVitiPerLinea).toBe(79);
        expect(result.totalScrews).toBe(79 * 2 + 12);
    });

    it('Schema A2, passo fisso 25.4cm (giuntato)', () => {
        const result = calculateScrews({
            lTecnica: 27.274, spacing: 25.4, schema: 'A2', hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        expect(result.details.passoVitiCm).toBe(25.4);
        // 1 giunzione longitudinale, overlap=1.0
        expect(result.details.nGiunzioni).toBe(1);
        expect(result.details.overlapLunghezza).toBe(1.0);
    });

    it('moltiplicazione per qty', () => {
        const result1 = calculateScrews({
            lTecnica: 20, spacing: 70, schema: 'A', hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        const result5 = calculateScrews({
            lTecnica: 20, spacing: 70, schema: 'A', hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 5
        });
        expect(result5.totalScrews).toBe(result1.totalScrews * 5);
    });

    it('matrice viti: acciaio + piatto -> VQAS70035B', () => {
        const result = calculateScrews({
            lTecnica: 20, spacing: 70, schema: 'A', hRete: 152,
            struttura: 'acciaio', profilo: 'piatto', qty: 1
        });
        expect(result.screwCode).toBe('VQAS70035B');
    });

    it('matrice viti: legno + legno -> VQAS70120B', () => {
        const result = calculateScrews({
            lTecnica: 20, spacing: 70, schema: 'A', hRete: 152,
            struttura: 'legno', profilo: 'legno', qty: 1
        });
        expect(result.screwCode).toBe('VQAS70120B');
    });
});

describe('calculateTape', () => {
    it('profilo=nastro -> calcola metri nastro forato', () => {
        const result = calculateTape({ lTecnica: 20, profilo: 'nastro', qty: 1 });
        expect(result).not.toBeNull();
        expect(result.code).toBe('VQAS60025B');
        expect(result.meters).toBe(20 * 2 * 1);
    });

    it('profilo=piatto -> null (non serve nastro)', () => {
        const result = calculateTape({ lTecnica: 20, profilo: 'piatto', qty: 1 });
        expect(result).toBeNull();
    });

    it('qty=5, L=20 -> 200m di nastro', () => {
        const result = calculateTape({ lTecnica: 20, profilo: 'nastro', qty: 5 });
        expect(result.meters).toBe(200);
    });
});

describe('calculatePlates', () => {
    it('Schema D, L=20m, spacing=50cm, nessuna giunzione', () => {
        const result = calculatePlates({
            lTecnica: 20, spacing: 50, schema: 'D', hRete: 152, qty: 1
        });
        // piastrePerLinea = ceil(20/0.5) = 40
        // totale = 40 * 2 linee = 80
        expect(result.details.nPiastrePerLinea).toBe(40);
        expect(result.plates).toBe(80);
        expect(result.gaskets).toBe(80);
        expect(result.rivets).toBe(160);
    });

    it('Schema D, L=30m, spacing=50cm, con giunzione', () => {
        const result = calculatePlates({
            lTecnica: 30, spacing: 50, schema: 'D', hRete: 152, qty: 1
        });
        // 1 giunzione, overlap=0.5 (D base, H=152 < 223)
        // zonaInfittita = 1 * 0.5 * 2 = 1.0m
        // zonaNormale = 30 - 1.0 = 29m
        // piastreNormale = ceil(29/0.5) = 58
        // piastreInfittita = ceil(1.0/0.25) = 4
        // perLinea = 62
        // totale = 62 * 2 = 124
        expect(result.details.nGiunzioni).toBe(1);
        expect(result.details.piastreZonaNormale).toBe(58);
        expect(result.details.piastreZonaInfittita).toBe(4);
        expect(result.plates).toBe(124);
    });

    it('Schema E con plate_spacing=55', () => {
        const result = calculatePlates({
            lTecnica: 20, spacing: 55, schema: 'E', hRete: 152, qty: 1
        });
        // piastrePerLinea = ceil(20/0.55) = 37
        expect(result.details.passoPiastreCm).toBe(55);
        expect(result.details.nPiastrePerLinea).toBe(37);
        expect(result.plates).toBe(74);
    });

    it('moltiplicazione per qty', () => {
        const r1 = calculatePlates({
            lTecnica: 20, spacing: 50, schema: 'D', hRete: 152, qty: 1
        });
        const r3 = calculatePlates({
            lTecnica: 20, spacing: 50, schema: 'D', hRete: 152, qty: 3
        });
        expect(r3.plates).toBe(r1.plates * 3);
        expect(r3.rivets).toBe(r1.rivets * 3);
    });
});

describe('calculateSprings', () => {
    it('lTecnica=27.274m, qty=1', () => {
        // molle = ceil((27.274/0.254)*1.5) + 8
        // = ceil(107.378 * 1.5) + 8 = ceil(161.06) + 8 = 162 + 8 = 170
        const result = calculateSprings(27.274, 1);
        expect(result.code).toBe('VQAS55450B');
        expect(result.perUnit).toBe(Math.ceil((27.274 / 0.254) * 1.5) + 8);
        expect(result.total).toBe(result.perUnit);
    });

    it('lTecnica=20m, qty=5', () => {
        const perUnit = Math.ceil((20 / 0.254) * 1.5) + 8;
        const result = calculateSprings(20, 5);
        expect(result.perUnit).toBe(perUnit);
        expect(result.total).toBe(perUnit * 5);
    });

    it('formula: ceil((L/0.254)*1.5) + 8', () => {
        const result = calculateSprings(10, 1);
        const expected = Math.ceil((10 / 0.254) * 1.5) + 8;
        expect(result.perUnit).toBe(expected);
    });
});

describe('calculateClips', () => {
    it('lTecnica=27.274m, qty=1', () => {
        // graffe = ceil((27.274/0.508)*4) + 8
        // = ceil(53.689 * 4) + 8 = ceil(214.76) + 8 = 215 + 8 = 223
        const result = calculateClips(27.274, 1);
        expect(result.code).toBe('VQ2430B');
        expect(result.perUnit).toBe(Math.ceil((27.274 / 0.508) * 4) + 8);
        expect(result.total).toBe(result.perUnit);
    });

    it('lTecnica=20m, qty=5', () => {
        const perUnit = Math.ceil((20 / 0.508) * 4) + 8;
        const result = calculateClips(20, 5);
        expect(result.perUnit).toBe(perUnit);
        expect(result.total).toBe(perUnit * 5);
    });

    it('formula: ceil((L/0.508)*4) + 8', () => {
        const result = calculateClips(10, 1);
        const expected = Math.ceil((10 / 0.508) * 4) + 8;
        expect(result.perUnit).toBe(expected);
    });
});

describe('calculateAllAccessories', () => {
    it('Schema A interno -> screws + tape (se nastro), no plates/springs/clips', () => {
        const result = calculateAllAccessories({
            schema: 'A', lTecnica: 20, spacing: 70, hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        expect(result.screws).not.toBeNull();
        expect(result.tape).not.toBeNull();
        expect(result.plates).toBeNull();
        expect(result.springs).toBeNull();
        expect(result.clips).toBeNull();
    });

    it('Schema D esterno -> plates, no screws/tape/springs/clips', () => {
        const result = calculateAllAccessories({
            schema: 'D', lTecnica: 20, spacing: 50, hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        expect(result.screws).toBeNull();
        expect(result.tape).toBeNull();
        expect(result.plates).not.toBeNull();
        expect(result.springs).toBeNull();
        expect(result.clips).toBeNull();
    });

    it('Schema A2 giuntato interno -> screws + tape + springs + clips', () => {
        const result = calculateAllAccessories({
            schema: 'A2', lTecnica: 27.274, spacing: 25.4, hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        expect(result.screws).not.toBeNull();
        expect(result.tape).not.toBeNull();
        expect(result.plates).toBeNull();
        expect(result.springs).not.toBeNull();
        expect(result.clips).not.toBeNull();
    });

    it('Schema D2 giuntato esterno -> plates + springs + clips', () => {
        const result = calculateAllAccessories({
            schema: 'D2', lTecnica: 20, spacing: 50, hRete: 152,
            struttura: 'cls', profilo: 'nastro', qty: 1
        });
        expect(result.screws).toBeNull();
        expect(result.tape).toBeNull();
        expect(result.plates).not.toBeNull();
        expect(result.springs).not.toBeNull();
        expect(result.clips).not.toBeNull();
    });

    it('Schema A interno con profilo piatto -> screws, no tape', () => {
        const result = calculateAllAccessories({
            schema: 'A', lTecnica: 20, spacing: 70, hRete: 152,
            struttura: 'cls', profilo: 'piatto', qty: 1
        });
        expect(result.screws).not.toBeNull();
        expect(result.tape).toBeNull();
    });
});
