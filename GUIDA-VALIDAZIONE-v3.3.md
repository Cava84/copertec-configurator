# Guida Validazione - Copertec v3.3

## Test Critico

### Schema A2 Giuntato
```
Input:
- Schema: A2
- Quantita: 265
- Larghezza: 95 cm
- Lunghezza: 26.258 m
- Altezza rete: 152 cm

Atteso:
- BOM Reti: 1590 rotoli
- Riepilogo: 1590 rotoli
- Calcolo: 265 x 3 x 2 = 1590
```

### Schema A Non Giuntato
```
Input:
- Schema: A
- Quantita: 100
- Lunghezza: 20 m
- Altezza: 152 cm

Atteso: 100 rotoli
```

## Calcolo Rotoli

### Formula
```
N_rotoli = ceil(L_Tecnica / 25m)
Schema giuntato: x 2
```

### Overlap
- H <= 152cm: 0.5m
- H 153-183cm: 0.75m
- H > 183cm: 1.0m

## Checklist UI

- [ ] Header gradient verde-blu
- [ ] Badge ITC-CNR e v3.3
- [ ] Menu collapsibili
- [ ] Export PDF/Excel funzionanti
- [ ] Nessun carattere corrotto

## Encoding

NON devono apparire:
- Caratteri tipo: a, A, A-
- Box drawing corrotti

---

*Cavatorta SpA - v3.3*
