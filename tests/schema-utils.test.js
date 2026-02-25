import { describe, it, expect } from 'vitest';
import {
    getLookupTable, findNetHeightOptions,
    isExternalSchema, isJointedSchema, isInternalSchema,
    needsPassoGreche, calculatePlateSpacing
} from '../src/schema-utils.js';
import {
    LOOKUP_ABC, LOOKUP_A1B1C1, LOOKUP_A2B2C2,
    LOOKUP_D, LOOKUP_E, LOOKUP_D2, LOOKUP_E2
} from '../src/constants.js';

describe('getLookupTable', () => {
    it('A/B/C -> LOOKUP_ABC', () => {
        expect(getLookupTable('A')).toBe(LOOKUP_ABC);
        expect(getLookupTable('B')).toBe(LOOKUP_ABC);
        expect(getLookupTable('C')).toBe(LOOKUP_ABC);
    });

    it('A1/B1/C1 -> LOOKUP_A1B1C1', () => {
        expect(getLookupTable('A1')).toBe(LOOKUP_A1B1C1);
        expect(getLookupTable('B1')).toBe(LOOKUP_A1B1C1);
        expect(getLookupTable('C1')).toBe(LOOKUP_A1B1C1);
    });

    it('A2/B2/C2 -> LOOKUP_A2B2C2', () => {
        expect(getLookupTable('A2')).toBe(LOOKUP_A2B2C2);
        expect(getLookupTable('B2')).toBe(LOOKUP_A2B2C2);
        expect(getLookupTable('C2')).toBe(LOOKUP_A2B2C2);
    });

    it('D -> LOOKUP_D', () => {
        expect(getLookupTable('D')).toBe(LOOKUP_D);
    });

    it('E -> LOOKUP_E', () => {
        expect(getLookupTable('E')).toBe(LOOKUP_E);
    });

    it('D2 -> LOOKUP_D2', () => {
        expect(getLookupTable('D2')).toBe(LOOKUP_D2);
    });

    it('E2 -> LOOKUP_E2', () => {
        expect(getLookupTable('E2')).toBe(LOOKUP_E2);
    });

    it('schema invalido -> null', () => {
        expect(getLookupTable('X')).toBeNull();
        expect(getLookupTable('F')).toBeNull();
        expect(getLookupTable('')).toBeNull();
    });
});

describe('isExternalSchema', () => {
    it('D, E, D2, E2 sono esterni', () => {
        expect(isExternalSchema('D')).toBe(true);
        expect(isExternalSchema('E')).toBe(true);
        expect(isExternalSchema('D2')).toBe(true);
        expect(isExternalSchema('E2')).toBe(true);
    });

    it('A-C2 non sono esterni', () => {
        ['A', 'B', 'C', 'A1', 'B1', 'C1', 'A2', 'B2', 'C2'].forEach(s => {
            expect(isExternalSchema(s)).toBe(false);
        });
    });
});

describe('isJointedSchema', () => {
    it('A2, B2, C2, D2, E2 sono giuntati', () => {
        expect(isJointedSchema('A2')).toBe(true);
        expect(isJointedSchema('B2')).toBe(true);
        expect(isJointedSchema('C2')).toBe(true);
        expect(isJointedSchema('D2')).toBe(true);
        expect(isJointedSchema('E2')).toBe(true);
    });

    it('schemi non giuntati', () => {
        ['A', 'B', 'C', 'A1', 'B1', 'C1', 'D', 'E'].forEach(s => {
            expect(isJointedSchema(s)).toBe(false);
        });
    });
});

describe('isInternalSchema', () => {
    it('A-C, A1-C1, A2-C2 sono interni', () => {
        ['A', 'B', 'C', 'A1', 'B1', 'C1', 'A2', 'B2', 'C2'].forEach(s => {
            expect(isInternalSchema(s)).toBe(true);
        });
    });

    it('D, E, D2, E2 non sono interni', () => {
        ['D', 'E', 'D2', 'E2'].forEach(s => {
            expect(isInternalSchema(s)).toBe(false);
        });
    });
});

describe('needsPassoGreche', () => {
    it('solo E e E2 necessitano passo greche', () => {
        expect(needsPassoGreche('E')).toBe(true);
        expect(needsPassoGreche('E2')).toBe(true);
    });

    it('tutti gli altri non necessitano passo greche', () => {
        ['A', 'B', 'C', 'A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'D', 'D2'].forEach(s => {
            expect(needsPassoGreche(s)).toBe(false);
        });
    });
});

describe('calculatePlateSpacing', () => {
    it('restituisce null per schemi non E/E2', () => {
        expect(calculatePlateSpacing('A', 20)).toBeNull();
        expect(calculatePlateSpacing('D', 20)).toBeNull();
    });

    it('senza passo greche, usa MAX_PLATE_SPACING_E = 55', () => {
        expect(calculatePlateSpacing('E', 0)).toBe(55);
        expect(calculatePlateSpacing('E', null)).toBe(55);
        expect(calculatePlateSpacing('E2', -1)).toBe(55);
    });

    it('con passo greche 10cm -> floor(55/10) * 10 = 50', () => {
        expect(calculatePlateSpacing('E', 10)).toBe(50);
    });

    it('con passo greche 20cm -> floor(55/20) * 20 = 40', () => {
        expect(calculatePlateSpacing('E', 20)).toBe(40);
    });

    it('con passo greche 55cm -> floor(55/55) * 55 = 55', () => {
        expect(calculatePlateSpacing('E', 55)).toBe(55);
    });

    it('con passo greche 60cm (> max) -> multiplier < 1, ritorna passoGreche', () => {
        expect(calculatePlateSpacing('E', 60)).toBe(60);
    });

    it('con passo greche 27.5cm -> floor(55/27.5) * 27.5 = 55', () => {
        expect(calculatePlateSpacing('E', 27.5)).toBe(55);
    });
});

describe('findNetHeightOptions', () => {
    it('Schema A, luce=100cm, copertec -> H.152 (spacing=70)', () => {
        const result = findNetHeightOptions('A', 100, 'copertec');
        expect(result.error).toBeUndefined();
        expect(result.options.length).toBeGreaterThanOrEqual(1);
        expect(result.options[0].height).toBe(152);
        expect(result.options[0].spacing).toBe(70);
    });

    it('Schema A, luce=95cm, copertec -> H.102 e H.152 (multiple)', () => {
        // luce=95 e' nel range di A-102 (0-77? no, 77 < 95)
        // A-122: 73-97 -> 95 dentro
        // A-152: 93-127 -> 95 dentro
        const result = findNetHeightOptions('A', 95, 'copertec');
        expect(result.error).toBeUndefined();
        expect(result.hasMultiple).toBe(true);
        expect(result.options.map(o => o.height)).toContain(122);
        expect(result.options.map(o => o.height)).toContain(152);
    });

    it('Schema A2, luce=95cm, copertec -> fuori range (min A2 = 152)', () => {
        const result = findNetHeightOptions('A2', 95, 'copertec');
        expect(result.error).toBeDefined();
    });

    it('Schema A2, luce=250cm, copertec -> H.152 (208-269)', () => {
        const result = findNetHeightOptions('A2', 250, 'copertec');
        expect(result.error).toBeUndefined();
        expect(result.options[0].height).toBe(152);
    });

    it('Schema D, luce=120cm, coperplax -> H.152 (108-139)', () => {
        const result = findNetHeightOptions('D', 120, 'coperplax');
        expect(result.error).toBeUndefined();
        expect(result.options[0].height).toBe(152);
        expect(result.options[0].spacing).toBe(50);
    });

    it('Schema invalido -> errore', () => {
        const result = findNetHeightOptions('X', 100, 'copertec');
        expect(result.error).toBeDefined();
    });

    it('Luce fuori range -> errore con range indicato', () => {
        const result = findNetHeightOptions('A', 500, 'copertec');
        expect(result.error).toBeDefined();
        expect(result.error).toContain('Fuori range');
    });

    it('Schema E con coperplax, luce=100cm -> H.152 (90-120)', () => {
        const result = findNetHeightOptions('E', 100, 'coperplax');
        expect(result.error).toBeUndefined();
        expect(result.options[0].height).toBe(152);
        expect(result.options[0].spacing).toBe(55);
    });

    it('Schema A con copertec non restituisce altezze coperplax-only', () => {
        // H.244 e' solo coperplax nella LOOKUP_ABC
        const result = findNetHeightOptions('A', 200, 'copertec');
        if (!result.error) {
            const heights = result.options.map(o => o.height);
            expect(heights).not.toContain(244);
        }
    });

    it('Schema A con coperplax restituisce altezze coperplax e both', () => {
        const result = findNetHeightOptions('A', 200, 'coperplax');
        if (!result.error) {
            const heights = result.options.map(o => o.height);
            expect(heights).toContain(244);
        }
    });
});
