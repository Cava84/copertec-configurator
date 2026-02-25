import { ROLL_LENGTH_M, SCREW_MATRIX } from './constants.js';
import { isJointedSchema, isInternalSchema, isExternalSchema } from './schema-utils.js';
import { getOverlapForJunction } from './roll-calculator.js';

// Calcola numero giunzioni longitudinali per un lucernario
export function calculateLongitudinalJunctions(lTecnica, schema, hRete) {
    const overlapLunghezza = getOverlapForJunction(schema, hRete);
    const effectiveRoll = ROLL_LENGTH_M - overlapLunghezza;
    if (lTecnica <= ROLL_LENGTH_M) return { count: 0, overlap: overlapLunghezza };
    const remaining = lTecnica - ROLL_LENGTH_M;
    return {
        count: Math.ceil(remaining / effectiveRoll),
        overlap: overlapLunghezza
    };
}

// Calcola viti/ancoranti per schemi interni (A/B/C, A1/B1/C1, A2/B2/C2)
export function calculateScrews(skylight) {
    const { lTecnica, spacing, schema, hRete, struttura, profilo, qty } = skylight;
    const isJointed = isJointedSchema(schema);

    const junctions = calculateLongitudinalJunctions(lTecnica, schema, hRete);
    const nGiunzioniLongitudinali = junctions.count;
    const overlapLunghezza = junctions.overlap;

    // Passo viti: A1/B1/C1/A2/B2/C2 fisso 25.4cm, A/B/C variabile dalla tabella
    const passoVitiCm = isJointed || schema.endsWith('1') ? 25.4 : spacing;
    const passoVitiM = passoVitiCm / 100;

    const nLati = 2;

    const zonaInfittimentoPerGiunzione = overlapLunghezza * 2;
    const zonaInfittimentoTotale = nGiunzioniLongitudinali * zonaInfittimentoPerGiunzione;

    const lunghezzaNormale = lTecnica - zonaInfittimentoTotale;
    const lunghezzaInfittita = zonaInfittimentoTotale;

    const vitiZonaNormale = lunghezzaNormale > 0 ? Math.ceil(lunghezzaNormale / passoVitiM) : 0;
    const vitiZonaInfittita = lunghezzaInfittita > 0 ? Math.ceil(lunghezzaInfittita / (passoVitiM / 2)) : 0;

    const nVitiPerLinea = vitiZonaNormale + vitiZonaInfittita;
    const infittimentoInizioFine = 12; // 6 inizio + 6 fine

    const nFissaggi = (nVitiPerLinea * nLati + infittimentoInizioFine) * qty;

    const screwCode = SCREW_MATRIX[struttura]?.[profilo];

    return {
        screwCode,
        totalScrews: nFissaggi,
        details: {
            passoVitiCm,
            nLati,
            nVitiPerLinea,
            vitiZonaNormale,
            vitiZonaInfittita,
            lunghezzaNormale,
            lunghezzaInfittita,
            nGiunzioni: nGiunzioniLongitudinali,
            overlapLunghezza,
            infittimento: infittimentoInizioFine,
            perUnit: nFissaggi / qty
        }
    };
}

// Calcola nastro forato (solo se profilo=nastro)
export function calculateTape(skylight) {
    const { lTecnica, profilo, qty } = skylight;
    if (profilo !== 'nastro') return null;

    const nLati = 2;
    const nastroMetri = lTecnica * nLati * qty;
    return {
        code: 'VQAS60025B',
        meters: nastroMetri
    };
}

// Calcola piastre per schemi esterni (D/E/D2/E2)
export function calculatePlates(skylight) {
    const { lTecnica, spacing, schema, hRete, qty } = skylight;

    const junctions = calculateLongitudinalJunctions(lTecnica, schema, hRete);
    const nGiunzioniLongitudinali = junctions.count;
    const overlapLunghezza = junctions.overlap;

    const passoPiastreCm = spacing || 50;
    const passoPiastreM = passoPiastreCm / 100;

    const nLinee = 2;

    const zonaInfittimentoPerGiunzione = overlapLunghezza * 2;
    const zonaInfittimentoTotale = nGiunzioniLongitudinali * zonaInfittimentoPerGiunzione;

    const lunghezzaNormale = lTecnica - zonaInfittimentoTotale;
    const lunghezzaInfittita = zonaInfittimentoTotale;

    const piastreZonaNormale = lunghezzaNormale > 0 ? Math.ceil(lunghezzaNormale / passoPiastreM) : 0;
    const piastreZonaInfittita = lunghezzaInfittita > 0 ? Math.ceil(lunghezzaInfittita / (passoPiastreM / 2)) : 0;

    const nPiastrePerLinea = piastreZonaNormale + piastreZonaInfittita;
    const nPiastre = nLinee * nPiastrePerLinea * qty;

    return {
        plates: nPiastre,
        gaskets: nPiastre,
        rivets: nPiastre * 2,
        details: {
            passoPiastreCm,
            nLinee,
            nPiastrePerLinea,
            piastreZonaNormale,
            piastreZonaInfittita,
            lunghezzaNormale,
            lunghezzaInfittita,
            nGiunzioni: nGiunzioniLongitudinali,
            overlapLunghezza,
            perUnit: nPiastre / qty
        }
    };
}

// Calcola molle per giunzione trasversale (solo schemi giuntati)
export function calculateSprings(lTecnica, qty) {
    const nMollePerLuc = Math.ceil((lTecnica / 0.254) * 1.5) + 8;
    return {
        code: 'VQAS55450B',
        total: nMollePerLuc * qty,
        perUnit: nMollePerLuc
    };
}

// Calcola graffe per giunzione trasversale (solo schemi giuntati)
export function calculateClips(lTecnica, qty) {
    const nGraffePerLuc = Math.ceil((lTecnica / 0.508) * 4) + 8;
    return {
        code: 'VQ2430B',
        total: nGraffePerLuc * qty,
        perUnit: nGraffePerLuc
    };
}

// Calcola tutti gli accessori per un lucernario
export function calculateAllAccessories(skylight) {
    const result = { screws: null, tape: null, plates: null, springs: null, clips: null };

    if (isInternalSchema(skylight.schema)) {
        result.screws = calculateScrews(skylight);
        result.tape = calculateTape(skylight);
    }

    if (isExternalSchema(skylight.schema)) {
        result.plates = calculatePlates(skylight);
    }

    if (isJointedSchema(skylight.schema)) {
        result.springs = calculateSprings(skylight.lTecnica, skylight.qty);
        result.clips = calculateClips(skylight.lTecnica, skylight.qty);
    }

    return result;
}
