# COPERTEC SYSTEM v3.3

> Configuratore Web per Reti Anticaduta Certificate CNR A.T. 650/25

![Version](https://img.shields.io/badge/version-3.3-green)
![License](https://img.shields.io/badge/license-Proprietary-blue)
![Status](https://img.shields.io/badge/status-Production-brightgreen)

## 📋 Descrizione

Configuratore web professionale per il sistema **COPERTEC SYSTEM** di Cavatorta SpA. Genera preventivi completi con:

- Calcolo automatico BOM (Bill of Materials)
- Ottimizzazione sfridi rotoli (3 modalità)
- Export PDF, Excel, WhatsApp, Email
- Conforme a CNR A.T. 650/25

## 🚀 Quick Start

### Opzione 1: Apertura Locale
```bash
# Apri direttamente nel browser
open index.html
# oppure
open copertec-configuratore-v3.3.html
```

### Opzione 2: Server Locale
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```
Poi apri `http://localhost:8000`

### Opzione 3: Deploy su Replit/Vercel/Netlify
Carica i file e configura come sito statico.

## 📁 Struttura Progetto

```
copertec-system-v3.3/
├── index.html                      # Pagina di test con checklist
├── copertec-configuratore-v3.3.html # Configuratore principale (standalone)
├── README.md                       # Questo file
├── docs/
│   ├── GUIDA-VALIDAZIONE-v3.3.md  # Guida test e validazione
│   ├── DOCUMENTAZIONE-TECNICA-SKILL.md # Doc tecnica (se presente)
│   └── GUIDA-USO-SKILL.md         # Guida uso skill (se presente)
└── assets/                         # Risorse statiche (vuoto, tutto inline)
```

## 🔧 Architettura

Il configuratore è un **file HTML singolo** con:
- CSS inline (no file esterni)
- JavaScript inline (no file esterni)
- Librerie CDN: jsPDF, jsPDF-AutoTable, SheetJS

**Vantaggi:**
- Zero dipendenze locali
- Facile deploy
- Funziona offline (dopo primo caricamento CDN)

## 📊 Funzionalità

### Schemi Supportati
| Schema | Tipo | Descrizione |
|--------|------|-------------|
| A, B, C | Interno | Fissaggio interno standard |
| A1, B1, C1 | Interno | Variante con passo fisso |
| A2, B2, C2 | Interno Giuntato | 2 reti affiancate |
| D2, E2 | Interno Giuntato | Variante giuntata |
| D, E | Esterno | Fissaggio esterno (COPERPLAX) |

### Modalità Ottimizzazione
1. **Standard**: Rotoli dedicati per lucernario
2. **Equilibrata** (consigliata): Riutilizza avanzi ≥4m, max 1 giunzione
3. **Massimo Risparmio**: Riutilizza avanzi ≥5m, giunzioni multiple

### Export
- **PDF**: Preventivo professionale con logo
- **Excel**: BOM completa con formule
- **WhatsApp**: Messaggio preformattato
- **Email**: Draft con allegato virtuale

## 🧪 Test di Validazione

### Test Critico (Schema Giuntato)
```
Input: Schema A2, 265 lucernari, L=26.258m, H.152cm
Atteso: 1590 rotoli (265 × 3 × 2)
```

### Test Completo
Vedi `docs/GUIDA-VALIDAZIONE-v3.3.md`

## 🛠️ Sviluppo con Claude Code

```bash
# Clona il repo
git clone https://github.com/[tuo-username]/copertec-system.git
cd copertec-system

# Apri con Claude Code
claude

# Comandi utili
> Modifica il calcolo degli sfridi
> Aggiungi un nuovo schema F
> Correggi bug nell'export PDF
```

## 📝 Changelog

### v3.3 (Gennaio 2025)
- ✅ Fix encoding UTF-8 (caratteri corrotti)
- ✅ Header professionale gradient
- ✅ Menu collapsibili per Dettaglio Calcoli/Allocazioni
- ✅ Fix moltiplicatore ×2 nel riepilogo sfridi
- ✅ Rimossi pulsanti export duplicati da header

### v3.2
- Ottimizzazione sfridi 3 modalità
- Calcolo giunzioni longitudinali

### v3.1
- Prima versione stabile
- Export PDF/Excel/WhatsApp/Email

## 📄 Licenza

Proprietario - Cavatorta SpA © 2025

## 👥 Contatti

- **Azienda**: Cavatorta SpA
- **PM**: Andrea (Innovation Lead)
- **Prodotto**: COPERTEC SYSTEM - Reti Anticaduta
