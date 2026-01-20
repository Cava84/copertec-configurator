# COPERTEC SYSTEM v3.3

> Configuratore Web per Reti Anticaduta Certificate CNR A.T. 650/25

## Descrizione

Configuratore web professionale per il sistema **COPERTEC SYSTEM** di Cavatorta SpA. Genera preventivi completi con:

- Calcolo automatico BOM (Bill of Materials)
- Ottimizzazione sfridi rotoli (3 modalita)
- Export PDF, Excel, WhatsApp, Email
- Conforme a CNR A.T. 650/25

## Quick Start

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
```
Poi apri http://localhost:8000

## Struttura Progetto

```
copertec-system-v3.3/
|-- index.html                        # Pagina di test
|-- copertec-configuratore-v3.3.html  # Configuratore principale
|-- README.md                         # Questo file
|-- .gitattributes                    # Configurazione encoding
|-- .gitignore                        # File ignorati
+-- docs/
    |-- GUIDA-VALIDAZIONE-v3.3.md     # Test cases
    |-- DOCUMENTAZIONE-TECNICA.md     # Doc tecnica
    +-- GUIDA-USO.md                  # Guida utente
```

## Schemi Supportati

| Schema | Tipo | Note |
|--------|------|------|
| A, B, C | Interno | Fissaggio standard |
| A1, B1, C1 | Interno | Passo fisso |
| A2, B2, C2 | Giuntato | 2 reti (x2) |
| D2, E2 | Giuntato | Variante |
| D, E | Esterno | COPERPLAX |

## Test Critico

```
Input: Schema A2, 265 lucernari, L=26.258m, H.152cm
Atteso: 1590 rotoli (265 x 3 x 2)
```

## Changelog v3.3

- Fix encoding UTF-8
- Header gradient professionale
- Menu collapsibili
- Fix moltiplicatore x2 schemi giuntati

## Licenza

Proprietario - Cavatorta SpA 2025
