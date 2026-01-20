# Documentazione Tecnica - Copertec System

## Architettura

File HTML singolo standalone con:
- CSS inline
- JavaScript inline
- Dati prodotti embedded
- CDN: jsPDF, SheetJS

## Schemi di Posa

### Interni (COPERTEC)
| Schema | Note |
|--------|------|
| A, B, C | Standard |
| A1, B1, C1 | Passo 25.4mm |
| A2, B2, C2 | Giuntato x2 |
| D2, E2 | Giuntato x2 |

### Esterni (COPERPLAX)
| Schema | Note |
|--------|------|
| D, E | Fissaggio esterno |

## Calcolo Rotoli

```
Base: ceil(L_Tecnica / 25m)
Giuntato: risultato x 2
```

### Overlap
- H <= 152cm: 0.5m
- H 153-183cm: 0.75m
- H > 183cm: 1.0m

## Ottimizzazione

1. Standard - No riutilizzo
2. Equilibrata - Avanzi >= 4m
3. Max Risparmio - Avanzi >= 5m

## Codici Prodotto

### COPERTEC
- SZAC152025B (H.152)
- SZAC183025B (H.183)
- SZAC213025B (H.213)

### COPERPLAX
- SEAC1520258 (H.152)
- SEAC1830258 (H.183)
- SEAC2130258 (H.213)

---

*Cavatorta SpA - v3.3*
