import {
    LOOKUP_ABC, LOOKUP_A1B1C1, LOOKUP_A2B2C2,
    LOOKUP_D, LOOKUP_E, LOOKUP_D2, LOOKUP_E2,
    MAX_PLATE_SPACING_E
} from './constants.js';

export function getLookupTable(schema) {
    if (['A', 'B', 'C'].includes(schema)) return LOOKUP_ABC;
    if (['A1', 'B1', 'C1'].includes(schema)) return LOOKUP_A1B1C1;
    if (['A2', 'B2', 'C2'].includes(schema)) return LOOKUP_A2B2C2;
    if (schema === 'D') return LOOKUP_D;
    if (schema === 'E') return LOOKUP_E;
    if (schema === 'D2') return LOOKUP_D2;
    if (schema === 'E2') return LOOKUP_E2;
    return null;
}

export function findNetHeightOptions(schema, luce, netType) {
    const table = getLookupTable(schema);
    if (!table) return { error: 'Schema non valido' };

    const candidates = table.filter(row => {
        if (row.schema !== schema) return false;
        if (row.net_type === 'both') return true;
        return row.net_type === netType;
    });

    const matches = [];
    for (const row of candidates) {
        if (luce >= row.luce_min && luce <= row.luce_max) {
            matches.push({
                height: row.height,
                spacing: row.spacing || row.plate_spacing,
                row: row
            });
        }
    }

    if (matches.length === 0) {
        const minLuce = Math.min(...candidates.map(r => r.luce_min));
        const maxLuce = Math.max(...candidates.map(r => r.luce_max));
        return { error: `Fuori range (${minLuce}-${maxLuce}cm)` };
    }

    matches.sort((a, b) => a.height - b.height);
    return { options: matches, hasMultiple: matches.length > 1 };
}

export function isExternalSchema(schema) {
    return ['D', 'E', 'D2', 'E2'].includes(schema);
}

export function isJointedSchema(schema) {
    return ['A2', 'B2', 'C2', 'D2', 'E2'].includes(schema);
}

export function isInternalSchema(schema) {
    return ['A', 'B', 'C', 'A1', 'B1', 'C1', 'A2', 'B2', 'C2'].includes(schema);
}

export function needsPassoGreche(schema) {
    return ['E', 'E2'].includes(schema);
}

export function calculatePlateSpacing(schema, passoGreche) {
    if (!needsPassoGreche(schema)) return null;
    if (!passoGreche || passoGreche <= 0) return MAX_PLATE_SPACING_E;
    const multiplier = Math.floor(MAX_PLATE_SPACING_E / passoGreche);
    return multiplier < 1 ? passoGreche : multiplier * passoGreche;
}
