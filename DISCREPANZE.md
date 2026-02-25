# Discrepanze Rilevate - Configuratore Copertec v3.3

## 1. Overlap 0.75m mancante nel codice

**Documentazione** (`GUIDA-VALIDAZIONE-v3.3.md`, `DOCUMENTAZIONE-TECNICA.md`):
```
H <= 152cm: 0.5m
H 153-183cm: 0.75m
H > 183cm: 1.0m
```

**Codice** (`getOverlap()` in HTML riga 1566):
```javascript
function getOverlap(height) {
    return height >= 203 ? 1.0 : 0.5;
}
```
- Solo 2 fasce: `< 203 -> 0.5m`, `>= 203 -> 1.0m`
- **Il caso 0.75m per H 153-183cm non esiste nel codice**
- La soglia nel codice e' 203, non 183 come nella documentazione

**Impatto**: Per H=183cm, il codice usa overlap 0.5m anziche' 0.75m (documentazione) o 1.0m.

---

## 2. Soglie diverse tra getOverlap e getOverlapForJunction

**`getOverlap(height)`** (usato in `calculateRolls`):
- H >= 203 -> 1.0m
- H < 203 -> 0.5m

**`getOverlapForJunction(schema, hRete)`** (usato nell'ottimizzazione):
- Schema con suffisso 1 o 2 -> **sempre 1.0m** (indipendentemente dall'altezza)
- Schema base (A/B/C/D/E):
  - H >= 223 -> 1.0m
  - H < 223 -> 0.5m

**Discrepanza critica**: Per schema A con H=203cm:
- `getOverlap(203)` = **1.0m** (soglia >= 203)
- `getOverlapForJunction('A', 203)` = **0.5m** (soglia >= 223)

Le due funzioni usano soglie diverse (203 vs 223) per lo stesso tipo di overlap su schemi base.

---

## 3. Test case validazione A2 (265 x 3 x 2 = 1590)

**Guida di validazione**:
```
Schema: A2, Qty: 265, Larghezza: 95cm, Lunghezza: 26.258m, H: 152cm
Atteso: 1590 rotoli (265 x 3 x 2)
```

**Analisi del codice**:
- lTecnica = 26.258 + SPONDE_A2B2C2(1.016) = 27.274m
- Per A2 (suffisso 2), `getOverlapForJunction` restituisce sempre 1.0m
- Nell'ottimizzazione standard:
  - Primo pezzo: 25m (rotolo intero)
  - Remaining: 2.274m -> spezzone (2.274m + 1.0m overlap = 3.274m di rotolo fisico)
  - **2 rotoli per istanza** (non 3 come nella guida)
- Con 265 istanze e ottimizzazione BFD sugli spezzoni:
  - 265 rotoli interi + ~38 rotoli spezzoni = ~303 rotoli
  - x2 (giuntato) = ~606 rotoli

**La formula calculateRolls (senza ottimizzazione) da anche 2 rotoli**, non 3:
- `calculateRolls(27.274, 152)` -> overlap=0.5, effectiveRoll=24.5
- remaining=2.274, ceil(2.274/24.5)=1 -> **2 rotoli**

**Possibili spiegazioni**:
1. La guida di validazione potrebbe essere errata/obsoleta
2. Potrebbe esserci una versione precedente con formula diversa
3. Potrebbe esserci un calcolo aggiuntivo non presente nel codice attuale

---

## 4. Due funzioni calculateJunctionsRequired

Il codice contiene la stessa funzione in due punti:
- `roll-calculator.js` (riga 1861 dell'HTML)
- Usata implicitamente nell'ottimizzazione

Nella versione estratta sono state mantenute entrambe per fedelta' al codice originale.

---

*Documento generato dall'analisi del codice sorgente v3.3*
