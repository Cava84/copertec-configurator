import { isExternalSchema, isJointedSchema } from './schema-utils.js';
import { getOverlapForJunction } from './roll-calculator.js';

// Formula corretta: il primo pezzo copre rollLength, ogni successivo copre (rollLength - overlap)
export function calculateJunctionsRequired(effectiveLength, rollLength, overlap) {
    if (effectiveLength <= rollLength) return 0;
    const remaining = effectiveLength - rollLength;
    const effectiveRollWithOverlap = rollLength - overlap;
    return Math.ceil(remaining / effectiveRollWithOverlap);
}

// Trova combinazione di avanzi che copre la lunghezza richiesta
export function findRemnantCombination(rolls, targetLength, overlap, minRemnant, maxPieces) {
    const usableRolls = rolls
        .filter(r => r.remaining >= minRemnant)
        .sort((a, b) => b.remaining - a.remaining);

    if (usableRolls.length === 0) return null;

    // Caso 1: Un singolo avanzo copre tutto
    for (let roll of usableRolls) {
        if (roll.remaining >= targetLength) {
            return [{ roll, useLength: targetLength, isFirst: true }];
        }
    }

    if (maxPieces < 2) return null;

    // Caso 2: Due avanzi combinati (1 giunzione tra loro)
    for (let i = 0; i < usableRolls.length; i++) {
        for (let j = i + 1; j < usableRolls.length; j++) {
            const combined = usableRolls[i].remaining + usableRolls[j].remaining - overlap;
            if (combined >= targetLength) {
                return [
                    { roll: usableRolls[i], useLength: usableRolls[i].remaining, isFirst: true },
                    { roll: usableRolls[j], useLength: targetLength - usableRolls[i].remaining + overlap, isFirst: false }
                ];
            }
        }
    }

    if (maxPieces < 3) return null;

    // Caso 3+: Tre o piu' avanzi (solo per MASSIMO RISPARMIO)
    let accumulated = 0;
    let pieces = [];

    for (let roll of usableRolls) {
        if (pieces.length >= maxPieces) break;

        const effectiveAdd = pieces.length === 0 ? roll.remaining : (roll.remaining - overlap);
        pieces.push({ roll, useLength: roll.remaining, isFirst: pieces.length === 0 });
        accumulated += effectiveAdd;

        if (accumulated >= targetLength) {
            const excess = accumulated - targetLength;
            pieces[pieces.length - 1].useLength -= excess;
            return pieces;
        }
    }

    return null;
}

// MODALITA' STANDARD: rotoli interi dedicati + spezzoni ottimizzati
export function optimizeStandard(group, rollLength) {
    const SMALL_PIECE_THRESHOLD = 3.0;
    const piecesNeeded = [];

    group.skylights.forEach(s => {
        const overlap = s.overlapRequired;

        if (s.effectiveLength <= rollLength) {
            group.rolls.push({
                id: group.rolls.length + 1,
                remaining: rollLength - s.effectiveLength,
                allocations: [{
                    skylight: s,
                    length: s.effectiveLength,
                    isJunction: false
                }]
            });
        } else {
            let remainingLength = s.effectiveLength;
            let pieceNum = 0;

            while (remainingLength > 0) {
                const isFirstPiece = pieceNum === 0;
                const effectiveRollLength = isFirstPiece ? rollLength : (rollLength - overlap);

                if (remainingLength >= effectiveRollLength) {
                    group.rolls.push({
                        id: group.rolls.length + 1,
                        remaining: 0,
                        allocations: [{
                            skylight: s,
                            length: effectiveRollLength,
                            isJunction: !isFirstPiece,
                            junctionNum: !isFirstPiece ? pieceNum : null,
                            overlapUsed: !isFirstPiece ? overlap : 0
                        }]
                    });
                    remainingLength -= effectiveRollLength;
                } else {
                    const pieceLength = remainingLength + (isFirstPiece ? 0 : overlap);
                    piecesNeeded.push({
                        skylight: s,
                        pieceLength: remainingLength,
                        actualLength: pieceLength,
                        overlap: isFirstPiece ? 0 : overlap,
                        isSmall: pieceLength < SMALL_PIECE_THRESHOLD,
                        junctionNum: pieceNum
                    });
                    remainingLength = 0;
                }
                pieceNum++;
            }
        }
    });

    // FASE 2: Ottimizza spezzoni con Best Fit Decreasing
    if (piecesNeeded.length > 0) {
        piecesNeeded.sort((a, b) => b.actualLength - a.actualLength);
        const pieceRolls = [];

        piecesNeeded.forEach(piece => {
            let bestRoll = null;
            let bestRemaining = Infinity;

            for (let roll of pieceRolls) {
                if (roll.remaining >= piece.actualLength && roll.remaining < bestRemaining) {
                    bestRoll = roll;
                    bestRemaining = roll.remaining;
                }
            }

            if (bestRoll) {
                bestRoll.allocations.push({
                    skylight: piece.skylight,
                    length: piece.pieceLength,
                    isJunction: true,
                    junctionNum: piece.junctionNum,
                    overlapUsed: piece.overlap,
                    isSmallPiece: piece.isSmall
                });
                bestRoll.remaining -= piece.actualLength;
            } else {
                pieceRolls.push({
                    id: 0,
                    remaining: rollLength - piece.actualLength,
                    allocations: [{
                        skylight: piece.skylight,
                        length: piece.pieceLength,
                        isJunction: true,
                        junctionNum: piece.junctionNum,
                        overlapUsed: piece.overlap,
                        isSmallPiece: piece.isSmall
                    }]
                });
            }
        });

        pieceRolls.forEach(roll => {
            roll.id = group.rolls.length + 1;
            group.rolls.push(roll);
        });
    }
}

// MODALITA' MASSIMO RISPARMIO: riutilizza avanzi, combina piu' avanzi se necessario
export function optimizeMaxSaving(group, rollLength, minRemnant) {
    const SMALL_PIECE_THRESHOLD = 3.0;
    const MAX_PIECES = 10;

    const singleRollSkylights = [];
    const multiRollSkylights = [];

    group.skylights.forEach(s => {
        if (s.effectiveLength <= rollLength) {
            singleRollSkylights.push(s);
        } else {
            multiRollSkylights.push(s);
        }
    });

    // FASE 2: Processa lucernari multi-rotolo
    multiRollSkylights.forEach(s => {
        const overlap = s.overlapRequired;
        let remainingLength = s.effectiveLength;
        let junctionCount = 0;

        while (remainingLength > 0) {
            const isFirstPiece = junctionCount === 0;

            const combination = findRemnantCombination(
                group.rolls,
                remainingLength + (isFirstPiece ? 0 : overlap),
                overlap,
                minRemnant,
                MAX_PIECES
            );

            if (combination) {
                combination.forEach((piece, idx) => {
                    piece.roll.allocations.push({
                        skylight: s,
                        length: piece.useLength - (idx > 0 ? overlap : 0),
                        isJunction: !isFirstPiece || idx > 0,
                        junctionNum: junctionCount + idx,
                        usedRemnant: true,
                        overlapUsed: idx > 0 ? overlap : 0
                    });
                    piece.roll.remaining -= piece.useLength;
                });
                remainingLength = 0;
            } else {
                const effectiveRollLength = isFirstPiece ? rollLength : (rollLength - overlap);
                const usedLength = Math.min(remainingLength, effectiveRollLength);
                const isSmall = usedLength < SMALL_PIECE_THRESHOLD;

                group.rolls.push({
                    id: group.rolls.length + 1,
                    remaining: rollLength - usedLength - (isFirstPiece ? 0 : overlap),
                    allocations: [{
                        skylight: s,
                        length: usedLength,
                        isJunction: !isFirstPiece,
                        junctionNum: !isFirstPiece ? junctionCount : null,
                        overlapUsed: !isFirstPiece ? overlap : 0,
                        isSmallPiece: isSmall
                    }]
                });

                remainingLength -= usedLength;
            }
            junctionCount++;
        }
    });

    // FASE 3: Ottimizza i lucernari singoli con Best Fit + combinazione avanzi
    const sortedSingle = [...singleRollSkylights].sort((a, b) => b.effectiveLength - a.effectiveLength);

    sortedSingle.forEach(s => {
        const overlap = s.overlapRequired;

        const combination = findRemnantCombination(group.rolls, s.effectiveLength, overlap, minRemnant, MAX_PIECES);

        if (combination) {
            if (combination.length === 1) {
                combination[0].roll.allocations.push({
                    skylight: s,
                    length: s.effectiveLength,
                    isJunction: false,
                    usedRemnant: true
                });
                combination[0].roll.remaining -= s.effectiveLength;
            } else {
                combination.forEach((piece, idx) => {
                    piece.roll.allocations.push({
                        skylight: s,
                        length: piece.useLength - (idx > 0 ? overlap : 0),
                        isJunction: idx > 0,
                        junctionPart: idx + 1,
                        usedRemnant: true,
                        overlapUsed: idx > 0 ? overlap : 0
                    });
                    piece.roll.remaining -= piece.useLength;
                });
            }
        } else {
            let bestRoll = null;
            let bestRemaining = 0;

            for (let roll of group.rolls) {
                if (roll.remaining >= minRemnant) {
                    const totalCoverage = roll.remaining + rollLength - overlap;
                    if (totalCoverage >= s.effectiveLength && roll.remaining > bestRemaining) {
                        bestRoll = roll;
                        bestRemaining = roll.remaining;
                    }
                }
            }

            if (bestRoll) {
                const usedFromRemnant = bestRoll.remaining;
                const neededFromNew = s.effectiveLength - usedFromRemnant + overlap;
                const isSmall = neededFromNew < SMALL_PIECE_THRESHOLD;

                bestRoll.allocations.push({
                    skylight: s,
                    length: usedFromRemnant,
                    isJunction: true,
                    junctionPart: 1,
                    usedRemnant: true
                });
                bestRoll.remaining = 0;

                group.rolls.push({
                    id: group.rolls.length + 1,
                    remaining: rollLength - neededFromNew,
                    allocations: [{
                        skylight: s,
                        length: neededFromNew - overlap,
                        isJunction: true,
                        junctionPart: 2,
                        overlapUsed: overlap,
                        isSmallPiece: isSmall
                    }]
                });
            } else {
                group.rolls.push({
                    id: group.rolls.length + 1,
                    remaining: rollLength - s.effectiveLength,
                    allocations: [{
                        skylight: s,
                        length: s.effectiveLength,
                        isJunction: false
                    }]
                });
            }
        }
    });
}

// MODALITA' EQUILIBRATA: max 1 giunzione per lucernario, avanzi >= 4m
export function optimizeBalanced(group, rollLength, minRemnant, maxJunctions) {
    const SMALL_PIECE_THRESHOLD = 3.0;
    const sorted = [...group.skylights].sort((a, b) => b.effectiveLength - a.effectiveLength);

    sorted.forEach(s => {
        const overlap = s.overlapRequired;

        const junctionsNeeded = calculateJunctionsRequired(s.effectiveLength, rollLength, overlap);

        if (junctionsNeeded > maxJunctions) {
            let remainingLength = s.effectiveLength;
            let junctionCount = 0;

            while (remainingLength > 0) {
                const isFirstPiece = junctionCount === 0;
                const effectiveRollLength = isFirstPiece ? rollLength : (rollLength - overlap);
                const usedLength = Math.min(remainingLength, effectiveRollLength);
                const isSmall = usedLength < SMALL_PIECE_THRESHOLD;

                group.rolls.push({
                    id: group.rolls.length + 1,
                    remaining: rollLength - usedLength - (isFirstPiece ? 0 : overlap),
                    allocations: [{
                        skylight: s,
                        length: usedLength,
                        isJunction: !isFirstPiece,
                        junctionNum: !isFirstPiece ? junctionCount : null,
                        overlapUsed: !isFirstPiece ? overlap : 0,
                        isSmallPiece: isSmall
                    }]
                });

                remainingLength -= usedLength;
                junctionCount++;
            }
            return;
        }

        // OPZIONE 1: Prova a usare 1 avanzo senza giunzione
        if (s.effectiveLength <= rollLength) {
            let bestRoll = null;
            let bestRemaining = Infinity;

            for (let roll of group.rolls) {
                if (roll.remaining >= s.effectiveLength && roll.remaining >= minRemnant) {
                    if (roll.remaining < bestRemaining) {
                        bestRoll = roll;
                        bestRemaining = roll.remaining;
                    }
                }
            }

            if (bestRoll) {
                bestRoll.allocations.push({
                    skylight: s,
                    length: s.effectiveLength,
                    isJunction: false,
                    usedRemnant: true
                });
                bestRoll.remaining -= s.effectiveLength;
                return;
            }

            // OPZIONE 2: Prova a combinare 2 avanzi con 1 giunzione
            let bestCombination = null;
            let bestWaste = Infinity;

            for (let i = 0; i < group.rolls.length; i++) {
                if (group.rolls[i].remaining < minRemnant) continue;

                for (let j = i + 1; j < group.rolls.length; j++) {
                    if (group.rolls[j].remaining < minRemnant) continue;

                    const combined = group.rolls[i].remaining + group.rolls[j].remaining - overlap;
                    if (combined >= s.effectiveLength) {
                        const waste = combined - s.effectiveLength;
                        if (waste < bestWaste) {
                            bestCombination = { roll1: group.rolls[i], roll2: group.rolls[j] };
                            bestWaste = waste;
                        }
                    }
                }
            }

            if (bestCombination) {
                const { roll1, roll2 } = bestCombination;
                const fromRoll1 = roll1.remaining;
                const fromRoll2 = s.effectiveLength - fromRoll1 + overlap;
                const isSmall1 = fromRoll1 < SMALL_PIECE_THRESHOLD;
                const isSmall2 = fromRoll2 < SMALL_PIECE_THRESHOLD;

                roll1.allocations.push({
                    skylight: s,
                    length: fromRoll1,
                    isJunction: true,
                    junctionPart: 1,
                    usedRemnant: true,
                    isSmallPiece: isSmall1
                });
                roll1.remaining = 0;

                roll2.allocations.push({
                    skylight: s,
                    length: fromRoll2 - overlap,
                    isJunction: true,
                    junctionPart: 2,
                    usedRemnant: true,
                    overlapUsed: overlap,
                    isSmallPiece: isSmall2
                });
                roll2.remaining -= fromRoll2;
                return;
            }
        }

        // OPZIONE 3: Prova avanzo + nuovo rotolo con 1 giunzione
        if (maxJunctions >= 1 && s.effectiveLength > rollLength) {
            let bestRollWithJunction = null;
            let bestRemainingWithJunction = 0;

            for (let roll of group.rolls) {
                if (roll.remaining >= minRemnant) {
                    const totalCoverage = roll.remaining + rollLength - overlap;
                    if (totalCoverage >= s.effectiveLength && roll.remaining > bestRemainingWithJunction) {
                        bestRollWithJunction = roll;
                        bestRemainingWithJunction = roll.remaining;
                    }
                }
            }

            if (bestRollWithJunction) {
                const usedFromRemnant = bestRollWithJunction.remaining;
                const neededFromNew = s.effectiveLength - usedFromRemnant + overlap;
                const isSmall1 = usedFromRemnant < SMALL_PIECE_THRESHOLD;
                const isSmall2 = neededFromNew < SMALL_PIECE_THRESHOLD;

                bestRollWithJunction.allocations.push({
                    skylight: s,
                    length: usedFromRemnant,
                    isJunction: true,
                    junctionPart: 1,
                    usedRemnant: true,
                    isSmallPiece: isSmall1
                });
                bestRollWithJunction.remaining = 0;

                group.rolls.push({
                    id: group.rolls.length + 1,
                    remaining: rollLength - neededFromNew,
                    allocations: [{
                        skylight: s,
                        length: neededFromNew - overlap,
                        isJunction: true,
                        junctionPart: 2,
                        overlapUsed: overlap,
                        isSmallPiece: isSmall2
                    }]
                });
                return;
            }
        }

        // FALLBACK: rotolo dedicato
        if (s.effectiveLength <= rollLength) {
            group.rolls.push({
                id: group.rolls.length + 1,
                remaining: rollLength - s.effectiveLength,
                allocations: [{
                    skylight: s,
                    length: s.effectiveLength,
                    isJunction: false
                }]
            });
        } else {
            let remainingLength = s.effectiveLength;
            let junctionCount = 0;

            while (remainingLength > 0) {
                const isFirstPiece = junctionCount === 0;
                const effectiveRollLength = isFirstPiece ? rollLength : (rollLength - overlap);
                const usedLength = Math.min(remainingLength, effectiveRollLength);
                const isSmall = usedLength < SMALL_PIECE_THRESHOLD;

                group.rolls.push({
                    id: group.rolls.length + 1,
                    remaining: rollLength - usedLength - (isFirstPiece ? 0 : overlap),
                    allocations: [{
                        skylight: s,
                        length: usedLength,
                        isJunction: !isFirstPiece,
                        junctionNum: !isFirstPiece ? junctionCount : null,
                        overlapUsed: !isFirstPiece ? overlap : 0,
                        isSmallPiece: isSmall
                    }]
                });

                remainingLength -= usedLength;
                junctionCount++;
            }
        }
    });
}

// Entry point principale per l'ottimizzazione
export function calculateOptimizedRolls(skylightsToOptimize, mode) {
    const ROLL_LENGTH = 25.0;

    const MIN_REMNANT = mode === 'balanced' ? 4.0 : 5.0;
    const MAX_JUNCTIONS_PER_SKYLIGHT = mode === 'balanced' ? 1 : Infinity;

    // Raggruppa per tipo rete + altezza
    const groups = {};

    skylightsToOptimize.forEach(s => {
        const netType = isExternalSchema(s.schema) ? 'coperplax' : s.netType;
        const isJointed = isJointedSchema(s.schema);
        const overlap = getOverlapForJunction(s.schema, s.hRete);

        for (let i = 0; i < s.qty; i++) {
            const key = `${netType}-${s.hRete}`;
            if (!groups[key]) {
                groups[key] = {
                    netType: netType,
                    height: s.hRete,
                    skylights: [],
                    rolls: []
                };
            }
            groups[key].skylights.push({
                ...s,
                instanceId: `${s.id}-${i + 1}`,
                displayName: s.name || `Lucernario ${s.id}`,
                instanceNum: i + 1,
                isJointed: isJointed,
                effectiveLength: s.lTecnica,
                overlapRequired: overlap
            });
        }
    });

    // Applica algoritmo per ogni gruppo
    Object.values(groups).forEach(group => {
        switch (mode) {
            case 'standard':
                optimizeStandard(group, ROLL_LENGTH);
                break;
            case 'optimized':
                optimizeMaxSaving(group, ROLL_LENGTH, MIN_REMNANT);
                break;
            case 'balanced':
                optimizeBalanced(group, ROLL_LENGTH, MIN_REMNANT, MAX_JUNCTIONS_PER_SKYLIGHT);
                break;
        }
    });

    // Calcola statistiche
    let totalRollsOptimized = 0;
    let totalRollsWithoutOpt = 0;
    let totalJunctionsUsed = 0;

    Object.values(groups).forEach(group => {
        const isJointed = group.skylights.some(s => s.isJointed);
        const netMultiplier = isJointed ? 2 : 1;

        totalRollsOptimized += group.rolls.length * netMultiplier;
        group.skylights.forEach(s => {
            totalRollsWithoutOpt += Math.ceil(s.effectiveLength / ROLL_LENGTH) * netMultiplier;
        });
        group.rolls.forEach(roll => {
            roll.allocations.forEach(alloc => {
                if (alloc.isJunction) totalJunctionsUsed++;
            });
        });
    });

    return {
        groups: groups,
        totalRolls: totalRollsOptimized,
        totalRollsWithoutOpt: totalRollsWithoutOpt,
        totalJunctions: totalJunctionsUsed,
        savings: totalRollsWithoutOpt > 0 ? Math.round((1 - totalRollsOptimized / totalRollsWithoutOpt) * 100) : 0,
        mode: mode
    };
}
