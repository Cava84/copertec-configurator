import { describe, it, expect } from 'vitest';
import {
    PRODUCTS, SCREW_MATRIX,
    LOOKUP_ABC, LOOKUP_A1B1C1, LOOKUP_A2B2C2,
    LOOKUP_D, LOOKUP_E, LOOKUP_D2, LOOKUP_E2,
    ROLL_LENGTH_M, MAGLIA_MM,
    SPONDE_ABC, SPONDE_A1B1C1, SPONDE_A2B2C2, SPONDE_D2E2,
    MAX_PLATE_SPACING_E, OVERLAP_SMALL, OVERLAP_LARGE
} from '../src/constants.js';

describe('PRODUCTS', () => {
    it('tutti i prodotti hanno code, price, category', () => {
        for (const [key, prod] of Object.entries(PRODUCTS)) {
            expect(prod.code).toBe(key);
            expect(prod.price).toBeGreaterThan(0);
            expect(prod.category).toBeDefined();
        }
    });

    it('reti COPERTEC hanno altezza', () => {
        const copertec = Object.values(PRODUCTS).filter(p => p.code.startsWith('SZAC'));
        expect(copertec.length).toBe(7);
        copertec.forEach(p => {
            expect(p.category).toBe('reti');
            expect(p.height).toBeGreaterThan(0);
        });
    });

    it('reti COPERPLAX hanno altezza', () => {
        const coperplax = Object.values(PRODUCTS).filter(p => p.code.startsWith('SEAC'));
        expect(coperplax.length).toBe(7);
        coperplax.forEach(p => {
            expect(p.category).toBe('reti');
            expect(p.height).toBeGreaterThan(0);
        });
    });

    it('accessori interno hanno pcs', () => {
        const interno = Object.values(PRODUCTS).filter(p => p.category === 'interno');
        expect(interno.length).toBe(8);
        interno.forEach(p => {
            expect(p.pcs).toBeGreaterThan(0);
        });
    });

    it('accessori esterno hanno pcs', () => {
        const esterno = Object.values(PRODUCTS).filter(p => p.category === 'esterno');
        expect(esterno.length).toBe(3);
        esterno.forEach(p => {
            expect(p.pcs).toBeGreaterThan(0);
        });
    });

    it('accessori giunzione hanno pcs', () => {
        const giunzione = Object.values(PRODUCTS).filter(p => p.category === 'giunzione');
        expect(giunzione.length).toBe(2);
        giunzione.forEach(p => {
            expect(p.pcs).toBeGreaterThan(0);
        });
    });
});

describe('SCREW_MATRIX', () => {
    const strutture = ['cls', 'acciaio', 'legno'];
    const profili = ['nastro', 'piatto', 'profiloL', 'legno'];

    it('copre tutte le combinazioni struttura x profilo', () => {
        strutture.forEach(s => {
            profili.forEach(p => {
                expect(SCREW_MATRIX[s][p]).toBeDefined();
                expect(PRODUCTS[SCREW_MATRIX[s][p]]).toBeDefined();
            });
        });
    });

    it('cls-nastro/piatto/profiloL -> VQAS70050B, cls-legno -> VQAS70100B', () => {
        expect(SCREW_MATRIX.cls.nastro).toBe('VQAS70050B');
        expect(SCREW_MATRIX.cls.piatto).toBe('VQAS70050B');
        expect(SCREW_MATRIX.cls.profiloL).toBe('VQAS70050B');
        expect(SCREW_MATRIX.cls.legno).toBe('VQAS70100B');
    });

    it('acciaio -> VQAS70035B (tranne legno -> VQAS70085B)', () => {
        expect(SCREW_MATRIX.acciaio.nastro).toBe('VQAS70035B');
        expect(SCREW_MATRIX.acciaio.legno).toBe('VQAS70085B');
    });

    it('legno -> VQAS70090B (tranne legno -> VQAS70120B)', () => {
        expect(SCREW_MATRIX.legno.nastro).toBe('VQAS70090B');
        expect(SCREW_MATRIX.legno.legno).toBe('VQAS70120B');
    });
});

describe('Costanti numeriche', () => {
    it('ROLL_LENGTH_M = 25', () => {
        expect(ROLL_LENGTH_M).toBe(25);
    });

    it('MAGLIA_MM = 50.8', () => {
        expect(MAGLIA_MM).toBe(50.8);
    });

    it('SPONDE_ABC = 3 * 0.0508 * 2 = 0.3048', () => {
        expect(SPONDE_ABC).toBeCloseTo(0.3048, 4);
    });

    it('SPONDE_A1B1C1 = 10 * 0.0254 * 2 = 0.508', () => {
        expect(SPONDE_A1B1C1).toBeCloseTo(0.508, 4);
    });

    it('SPONDE_A2B2C2 = 10 * 0.0508 * 2 = 1.016', () => {
        expect(SPONDE_A2B2C2).toBeCloseTo(1.016, 4);
    });

    it('SPONDE_D2E2 = 4 * 0.0508 * 2 = 0.4064', () => {
        expect(SPONDE_D2E2).toBeCloseTo(0.4064, 4);
    });

    it('MAX_PLATE_SPACING_E = 55', () => {
        expect(MAX_PLATE_SPACING_E).toBe(55);
    });

    it('OVERLAP_SMALL = 0.5, OVERLAP_LARGE = 1.0', () => {
        expect(OVERLAP_SMALL).toBe(0.5);
        expect(OVERLAP_LARGE).toBe(1.0);
    });
});

describe('Lookup Tables - struttura', () => {
    it('LOOKUP_ABC ha entrate per A, B, C', () => {
        const schemas = [...new Set(LOOKUP_ABC.map(r => r.schema))];
        expect(schemas.sort()).toEqual(['A', 'B', 'C']);
    });

    it('LOOKUP_A1B1C1 ha entrate per A1, B1, C1', () => {
        const schemas = [...new Set(LOOKUP_A1B1C1.map(r => r.schema))];
        expect(schemas.sort()).toEqual(['A1', 'B1', 'C1']);
    });

    it('LOOKUP_A2B2C2 ha entrate per A2, B2, C2', () => {
        const schemas = [...new Set(LOOKUP_A2B2C2.map(r => r.schema))];
        expect(schemas.sort()).toEqual(['A2', 'B2', 'C2']);
    });

    it('LOOKUP_D ha solo schema D', () => {
        expect(LOOKUP_D.every(r => r.schema === 'D')).toBe(true);
    });

    it('LOOKUP_E ha solo schema E', () => {
        expect(LOOKUP_E.every(r => r.schema === 'E')).toBe(true);
    });

    it('LOOKUP_D2 ha solo schema D2', () => {
        expect(LOOKUP_D2.every(r => r.schema === 'D2')).toBe(true);
    });

    it('LOOKUP_E2 ha solo schema E2', () => {
        expect(LOOKUP_E2.every(r => r.schema === 'E2')).toBe(true);
    });

    it('tabelle esterne usano solo coperplax', () => {
        [...LOOKUP_D, ...LOOKUP_E, ...LOOKUP_D2, ...LOOKUP_E2].forEach(r => {
            expect(r.net_type).toBe('coperplax');
        });
    });

    it('tabelle interne A/B/C hanno spacing (non plate_spacing)', () => {
        LOOKUP_ABC.forEach(r => {
            expect(r.spacing).toBeDefined();
            expect(r.plate_spacing).toBeUndefined();
        });
    });

    it('tabelle esterne D/E hanno plate_spacing (non spacing)', () => {
        [...LOOKUP_D, ...LOOKUP_E, ...LOOKUP_D2, ...LOOKUP_E2].forEach(r => {
            expect(r.plate_spacing).toBeDefined();
            expect(r.spacing).toBeUndefined();
        });
    });

    it('altezze COPERTEC disponibili: 102, 122, 152, 183, 203, 223, 253', () => {
        const heights = [...new Set(LOOKUP_ABC
            .filter(r => r.net_type === 'copertec' || r.net_type === 'both')
            .map(r => r.height))].sort((a, b) => a - b);
        // both copre fino a 203, poi copertec ha 223 e 253
        expect(heights).toContain(102);
        expect(heights).toContain(152);
        expect(heights).toContain(223);
        expect(heights).toContain(253);
    });

    it('altezze COPERPLAX disponibili includono 244', () => {
        const heights = [...new Set(LOOKUP_ABC
            .filter(r => r.net_type === 'coperplax')
            .map(r => r.height))];
        expect(heights).toContain(244);
    });
});
