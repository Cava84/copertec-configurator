import {
    ROLL_LENGTH_M,
    SPONDE_ABC, SPONDE_A1B1C1, SPONDE_A2B2C2, SPONDE_D2E2,
    OVERLAP_SMALL, OVERLAP_LARGE
} from './constants.js';

export function calculateLTecnica(schema, lunghezzaVanoM) {
    const validSchemas = ['A','B','C','A1','B1','C1','A2','B2','C2','D','E','D2','E2'];

    if (!validSchemas.includes(schema)) {
        return lunghezzaVanoM;
    }

    let sponde = 0;
    if (['A', 'B', 'C'].includes(schema)) sponde = SPONDE_ABC;
    else if (['A1', 'B1', 'C1'].includes(schema)) sponde = SPONDE_A1B1C1;
    else if (['A2', 'B2', 'C2'].includes(schema)) sponde = SPONDE_A2B2C2;
    else if (['D2', 'E2'].includes(schema)) sponde = SPONDE_D2E2;
    // D ed E hanno sponde = 0

    return lunghezzaVanoM + sponde;
}

export function getOverlap(height) {
    return height >= 203 ? OVERLAP_LARGE : OVERLAP_SMALL;
}

export function getOverlapForJunction(schema, hRete) {
    // Schemi A1, B1, C1, A2, B2, C2, D2, E2: sempre 100cm
    if (schema.endsWith('1') || schema.endsWith('2')) {
        return 1.0;
    }
    // Schemi A, B, C, D, E: dipende dall'altezza
    if (hRete >= 223) {
        return 1.0;
    }
    return 0.5;
}

export function calculateRolls(lTecnica, height) {
    const overlap = getOverlap(height);
    const effectiveRoll = ROLL_LENGTH_M - overlap;

    if (lTecnica <= ROLL_LENGTH_M) {
        return { rolls: 1, junctions: 0 };
    }

    let remaining = lTecnica - ROLL_LENGTH_M;
    let additionalRolls = Math.ceil(remaining / effectiveRoll);

    return {
        rolls: 1 + additionalRolls,
        junctions: additionalRolls
    };
}

export function calculateJunctionsRequired(effectiveLength, rollLength, overlap) {
    if (effectiveLength <= rollLength) return 0;
    const remaining = effectiveLength - rollLength;
    const effectiveRollWithOverlap = rollLength - overlap;
    return Math.ceil(remaining / effectiveRollWithOverlap);
}

export function getNetCode(netType, height) {
    if (netType === 'copertec') {
        return `SZAC${height}025B`;
    } else {
        const heightStr = height.toString().padStart(3, '0');
        return `SEAC${heightStr}0258`;
    }
}
