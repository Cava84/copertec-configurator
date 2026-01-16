# COPERTEC SYSTEM v3.3 - Guida Validazione

## 🎯 Quick Test (5 minuti)

### Test 1: Schema A2 Giuntato (CRITICO)
```
Input:
- Ragione Sociale: Test Validazione
- Schema: A2
- Quantità: 265
- Larghezza: 95 cm
- Lunghezza: 26.258 m
- Altezza rete: 152 cm
- Modalità: qualsiasi

Risultato atteso:
- BOM Reti: 1590 rotoli
- Riepilogo Sfridi: 1590 rotoli necessari
- Calcolo: 265 × 3 rotoli × 2 (affiancati) = 1590
```

### Test 2: Schema A Non Giuntato
```
Input:
- Schema: A
- Quantità: 100
- Larghezza: 95 cm
- Lunghezza: 20 m
- Altezza rete: 152 cm

Risultato atteso:
- BOM Reti: 100 rotoli
- Calcolo: 100 × 1 rotolo × 1 = 100
```

---

## 📊 Logica Calcolo Rotoli

### Formula Base
```
Per ogni lucernario:
1. N_rotoli = ceil(L_Tecnica / 25m) se L ≤ 25m → 1 rotolo
2. Se L > 25m: primo rotolo = 25m, successivi = (25m - overlap)
3. Schema giuntato (A2,B2,C2,D2,E2): moltiplica × 2
```

### Overlap per Altezza
| Altezza | Overlap |
|---------|---------|
| ≤152 cm | 0.5 m |
| 153-183 cm | 0.75 m |
| >183 cm | 1.0 m |

### Schemi con Overlap Fisso 1m
- A1, B1, C1, A2, B2, C2, D2, E2 → sempre 1.0m overlap

---

## 🔧 Test Ottimizzazione Sfridi

### Modalità Standard
- Ogni lucernario usa rotoli dedicati
- Nessun riutilizzo avanzi tra lucernari diversi

### Modalità Equilibrata (Consigliata)
- Riutilizza avanzi ≥4m
- Max 1 giunzione longitudinale per lucernario

### Modalità Massimo Risparmio
- Riutilizza avanzi ≥5m
- Giunzioni multiple ammesse

### Test per vedere differenze
```
Input per vedere ottimizzazione:
- 10 lucernari × Schema A × L=15m × H.152

Calcolo manuale:
- Senza ottimizzazione: 10 rotoli (1 per lucernario)
- Avanzo per rotolo: 25m - 15m = 10m
- Con Equilibrata: 10m > 4m → riutilizzabile
- Atteso: ~7 rotoli (risparmio ~30%)
```

---

## ✅ Checklist UI/UX

### Header
- [ ] Gradient verde→blu
- [ ] Logo SVG cubo 3D
- [ ] Badge "ITC-CNR" trasparente
- [ ] Badge "v3.3" bianco
- [ ] Subtitle con sfondo scuro
- [ ] NO pulsanti export in header

### Sezione Calcoli
- [ ] Menu collapsibile con ▶
- [ ] Si apre/chiude correttamente
- [ ] Nessun carattere corrotto

### Sezione Allocazioni
- [ ] Menu collapsibile con ▶
- [ ] Mostra dettaglio rotoli per gruppo
- [ ] Avanzi colorati (verde riutilizzabile, rosso no)

### Export
- [ ] PDF genera correttamente
- [ ] Excel genera correttamente
- [ ] WhatsApp apre link
- [ ] Email apre client

---

## 🐛 Encoding - Verifiche

Nessuno di questi caratteri deve apparire:
- `ð` (emoji corrotte)
- `â` (UTF-8 double-encoded)
- `Ã` (accenti corrotti)
- `Â` (caratteri spurii)
- `â‚¬` invece di `€`
- `â†'` invece di `→`
- `Ã—` invece di `×`

Caratteri corretti da vedere:
- `€` (euro)
- `→` (freccia)
- `×` (moltiplicazione)
- `≥` (maggiore uguale)
- `à`, `è`, `é`, `ì`, `ò`, `ù` (accenti italiani)

---

## 📁 File per Replit

Carica questi file nella root del progetto Replit:
1. `index.html` - Pagina di test
2. `copertec-configuratore-v3.3.html` - Configuratore

Configura Replit per servire file statici.

---

## 📞 Supporto

Se trovi bug, documenta:
1. Screenshot dell'errore
2. Input esatti usati
3. Risultato atteso vs ottenuto
4. Browser usato

---

*Cavatorta SpA - v3.3 - Gennaio 2025*
