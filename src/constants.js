// ================================================================
// PRODOTTI
// ================================================================

export const PRODUCTS = {
    // RETI COPERTEC (Zincata)
    'SZAC102025B': { code: 'SZAC102025B', desc: 'Rete COPERTEC H.102cm (25m)', price: 114.57, category: 'reti', height: 102 },
    'SZAC122025B': { code: 'SZAC122025B', desc: 'Rete COPERTEC H.122cm (25m)', price: 137.09, category: 'reti', height: 122 },
    'SZAC152025B': { code: 'SZAC152025B', desc: 'Rete COPERTEC H.152cm (25m)', price: 164.11, category: 'reti', height: 152 },
    'SZAC183025B': { code: 'SZAC183025B', desc: 'Rete COPERTEC H.183cm (25m)', price: 197.13, category: 'reti', height: 183 },
    'SZAC203025B': { code: 'SZAC203025B', desc: 'Rete COPERTEC H.203cm (25m)', price: 218.90, category: 'reti', height: 203 },
    'SZAC223025B': { code: 'SZAC223025B', desc: 'Rete COPERTEC H.223cm (25m)', price: 254.42, category: 'reti', height: 223 },
    'SZAC253025B': { code: 'SZAC253025B', desc: 'Rete COPERTEC H.253cm (25m)', price: 287.44, category: 'reti', height: 253 },

    // RETI COPERPLAX (Plastificata)
    'SEAC1020258': { code: 'SEAC1020258', desc: 'Rete COPERPLAX H.102cm (25m)', price: 137.48, category: 'reti', height: 102 },
    'SEAC1220258': { code: 'SEAC1220258', desc: 'Rete COPERPLAX H.122cm (25m)', price: 164.51, category: 'reti', height: 122 },
    'SEAC1520258': { code: 'SEAC1520258', desc: 'Rete COPERPLAX H.152cm (25m)', price: 205.63, category: 'reti', height: 152 },
    'SEAC1830258': { code: 'SEAC1830258', desc: 'Rete COPERPLAX H.183cm (25m)', price: 246.76, category: 'reti', height: 183 },
    'SEAC2030258': { code: 'SEAC2030258', desc: 'Rete COPERPLAX H.203cm (25m)', price: 274.18, category: 'reti', height: 203 },
    'SEAC2230258': { code: 'SEAC2230258', desc: 'Rete COPERPLAX H.223cm (25m)', price: 301.19, category: 'reti', height: 223 },
    'SEAC2440258': { code: 'SEAC2440258', desc: 'Rete COPERPLAX H.244cm (25m)', price: 339.07, category: 'reti', height: 244 },

    // VITI ACCESSORI INTERNO
    'VQAS70050B': { code: 'VQAS70050B', desc: 'Vite CLS 8.0x50mm', price: 62.52, pcs: 100, category: 'interno' },
    'VQAS70060B': { code: 'VQAS70060B', desc: 'Vite CLS 8.0x65mm', price: 68.13, pcs: 100, category: 'interno' },
    'VQAS70100B': { code: 'VQAS70100B', desc: 'Vite CLS 8.0x100mm', price: 46.80, pcs: 50, category: 'interno' },
    'VQAS70035B': { code: 'VQAS70035B', desc: 'Vite TER 6.3x35mm', price: 38.77, pcs: 200, category: 'interno' },
    'VQAS70085B': { code: 'VQAS70085B', desc: 'Vite SBS 6.3x85mm', price: 21.23, pcs: 100, category: 'interno' },
    'VQAS70090B': { code: 'VQAS70090B', desc: 'Vite HBS EVO 6x90mm', price: 30.64, pcs: 100, category: 'interno' },
    'VQAS70120B': { code: 'VQAS70120B', desc: 'Vite HBS 6x120mm', price: 19.02, pcs: 100, category: 'interno' },
    'VQAS60025B': { code: 'VQAS60025B', desc: 'Nastro Forato 39x1.95mm (25m)', price: 63.23, pcs: 1, category: 'interno', isRoll: true, rollLength: 25 },

    // ACCESSORI ESTERNO
    'VQAS01142B': { code: 'VQAS01142B', desc: 'Piastra Inox 1.5mm 142x19mm', price: 99.34, pcs: 100, category: 'esterno' },
    'VQAS20142B': { code: 'VQAS20142B', desc: 'Guarnizione EPDM 142x19x4mm', price: 41.60, pcs: 100, category: 'esterno' },
    'VQAS50100B': { code: 'VQAS50100B', desc: 'Rivetto 7.7x28mm', price: 285.00, pcs: 300, category: 'esterno' },

    // ACCESSORI GIUNZIONE
    'VQAS55450B': { code: 'VQAS55450B', desc: 'Molle Galvatec', price: 50.25, pcs: 450, category: 'giunzione' },
    'VQ2430B': { code: 'VQ2430B', desc: 'Punti 20mm (Graffe)', price: 23.91, pcs: 1000, category: 'giunzione' },
};

// ================================================================
// MATRICE VITI: [Struttura][Profilo] => codice vite
// ================================================================

export const SCREW_MATRIX = {
    'cls': {
        'nastro': 'VQAS70050B',
        'piatto': 'VQAS70050B',
        'profiloL': 'VQAS70050B',
        'legno': 'VQAS70100B'
    },
    'acciaio': {
        'nastro': 'VQAS70035B',
        'piatto': 'VQAS70035B',
        'profiloL': 'VQAS70035B',
        'legno': 'VQAS70085B'
    },
    'legno': {
        'nastro': 'VQAS70090B',
        'piatto': 'VQAS70090B',
        'profiloL': 'VQAS70090B',
        'legno': 'VQAS70120B'
    }
};

// ================================================================
// LOOKUP TABLES CNR
// ================================================================

export const LOOKUP_ABC = [
    { schema: 'A', net_type: 'both', height: 102, luce_min: 0, luce_max: 77, spacing: 100 },
    { schema: 'B', net_type: 'both', height: 102, luce_min: 0, luce_max: 84, spacing: 100 },
    { schema: 'C', net_type: 'both', height: 102, luce_min: 0, luce_max: 77, spacing: 100 },
    { schema: 'A', net_type: 'both', height: 122, luce_min: 73, luce_max: 97, spacing: 90 },
    { schema: 'B', net_type: 'both', height: 122, luce_min: 82, luce_max: 104, spacing: 90 },
    { schema: 'C', net_type: 'both', height: 122, luce_min: 73, luce_max: 97, spacing: 90 },
    { schema: 'A', net_type: 'both', height: 152, luce_min: 93, luce_max: 127, spacing: 70 },
    { schema: 'B', net_type: 'both', height: 152, luce_min: 102, luce_max: 134, spacing: 70 },
    { schema: 'C', net_type: 'both', height: 152, luce_min: 93, luce_max: 127, spacing: 70 },
    { schema: 'A', net_type: 'both', height: 183, luce_min: 123, luce_max: 158, spacing: 60 },
    { schema: 'B', net_type: 'both', height: 183, luce_min: 132, luce_max: 165, spacing: 60 },
    { schema: 'C', net_type: 'both', height: 183, luce_min: 123, luce_max: 158, spacing: 60 },
    { schema: 'A', net_type: 'both', height: 203, luce_min: 153, luce_max: 178, spacing: 50 },
    { schema: 'B', net_type: 'both', height: 203, luce_min: 163, luce_max: 185, spacing: 50 },
    { schema: 'C', net_type: 'both', height: 203, luce_min: 153, luce_max: 178, spacing: 50 },
    { schema: 'A', net_type: 'copertec', height: 223, luce_min: 173, luce_max: 198, spacing: 40 },
    { schema: 'B', net_type: 'copertec', height: 223, luce_min: 183, luce_max: 205, spacing: 40 },
    { schema: 'C', net_type: 'copertec', height: 223, luce_min: 173, luce_max: 198, spacing: 40 },
    { schema: 'A', net_type: 'coperplax', height: 244, luce_min: 183, luce_max: 218, spacing: 30 },
    { schema: 'B', net_type: 'coperplax', height: 244, luce_min: 193, luce_max: 225, spacing: 30 },
    { schema: 'C', net_type: 'coperplax', height: 244, luce_min: 183, luce_max: 218, spacing: 30 },
    { schema: 'A', net_type: 'copertec', height: 253, luce_min: 193, luce_max: 228, spacing: 30 },
    { schema: 'B', net_type: 'copertec', height: 253, luce_min: 203, luce_max: 235, spacing: 30 },
    { schema: 'C', net_type: 'copertec', height: 253, luce_min: 193, luce_max: 228, spacing: 30 },
];

export const LOOKUP_A1B1C1 = [
    { schema: 'A1', net_type: 'both', height: 102, luce_min: 0, luce_max: 77, spacing: 25.4 },
    { schema: 'B1', net_type: 'both', height: 102, luce_min: 0, luce_max: 84, spacing: 25.4 },
    { schema: 'C1', net_type: 'both', height: 102, luce_min: 0, luce_max: 77, spacing: 25.4 },
    { schema: 'A1', net_type: 'both', height: 122, luce_min: 73, luce_max: 97, spacing: 25.4 },
    { schema: 'B1', net_type: 'both', height: 122, luce_min: 82, luce_max: 104, spacing: 25.4 },
    { schema: 'C1', net_type: 'both', height: 122, luce_min: 73, luce_max: 97, spacing: 25.4 },
    { schema: 'A1', net_type: 'both', height: 152, luce_min: 93, luce_max: 123, spacing: 25.4 },
    { schema: 'B1', net_type: 'both', height: 152, luce_min: 102, luce_max: 134, spacing: 25.4 },
    { schema: 'C1', net_type: 'both', height: 152, luce_min: 93, luce_max: 123, spacing: 25.4 },
    { schema: 'A1', net_type: 'both', height: 183, luce_min: 119, luce_max: 158, spacing: 25.4 },
    { schema: 'B1', net_type: 'both', height: 183, luce_min: 132, luce_max: 165, spacing: 25.4 },
    { schema: 'C1', net_type: 'both', height: 183, luce_min: 119, luce_max: 158, spacing: 25.4 },
    { schema: 'A1', net_type: 'both', height: 203, luce_min: 153, luce_max: 178, spacing: 25.4 },
    { schema: 'B1', net_type: 'both', height: 203, luce_min: 163, luce_max: 185, spacing: 25.4 },
    { schema: 'C1', net_type: 'both', height: 203, luce_min: 153, luce_max: 178, spacing: 25.4 },
    { schema: 'A1', net_type: 'copertec', height: 223, luce_min: 173, luce_max: 198, spacing: 25.4 },
    { schema: 'B1', net_type: 'copertec', height: 223, luce_min: 183, luce_max: 205, spacing: 25.4 },
    { schema: 'C1', net_type: 'copertec', height: 223, luce_min: 173, luce_max: 198, spacing: 25.4 },
    { schema: 'A1', net_type: 'coperplax', height: 244, luce_min: 193, luce_max: 218, spacing: 25.4 },
    { schema: 'B1', net_type: 'coperplax', height: 244, luce_min: 203, luce_max: 225, spacing: 25.4 },
    { schema: 'C1', net_type: 'coperplax', height: 244, luce_min: 193, luce_max: 218, spacing: 25.4 },
    { schema: 'A1', net_type: 'copertec', height: 253, luce_min: 193, luce_max: 228, spacing: 25.4 },
    { schema: 'B1', net_type: 'copertec', height: 253, luce_min: 223, luce_max: 235, spacing: 25.4 },
    { schema: 'C1', net_type: 'copertec', height: 253, luce_min: 193, luce_max: 228, spacing: 25.4 },
];

export const LOOKUP_A2B2C2 = [
    { schema: 'A2', net_type: 'both', height: 102, luce_min: 152, luce_max: 167, spacing: 25.4 },
    { schema: 'B2', net_type: 'both', height: 102, luce_min: 157, luce_max: 172, spacing: 25.4 },
    { schema: 'C2', net_type: 'both', height: 102, luce_min: 152, luce_max: 167, spacing: 25.4 },
    { schema: 'A2', net_type: 'both', height: 122, luce_min: 167, luce_max: 208, spacing: 25.4 },
    { schema: 'B2', net_type: 'both', height: 122, luce_min: 172, luce_max: 212, spacing: 25.4 },
    { schema: 'C2', net_type: 'both', height: 122, luce_min: 167, luce_max: 208, spacing: 25.4 },
    { schema: 'A2', net_type: 'both', height: 152, luce_min: 208, luce_max: 269, spacing: 25.4 },
    { schema: 'B2', net_type: 'both', height: 152, luce_min: 212, luce_max: 272, spacing: 25.4 },
    { schema: 'C2', net_type: 'both', height: 152, luce_min: 208, luce_max: 269, spacing: 25.4 },
    { schema: 'A2', net_type: 'both', height: 183, luce_min: 266, luce_max: 330, spacing: 25.4 },
    { schema: 'B2', net_type: 'both', height: 183, luce_min: 272, luce_max: 334, spacing: 25.4 },
    { schema: 'C2', net_type: 'both', height: 183, luce_min: 266, luce_max: 330, spacing: 25.4 },
    { schema: 'A2', net_type: 'both', height: 203, luce_min: 330, luce_max: 369, spacing: 25.4 },
    { schema: 'B2', net_type: 'both', height: 203, luce_min: 334, luce_max: 374, spacing: 25.4 },
    { schema: 'C2', net_type: 'both', height: 203, luce_min: 330, luce_max: 369, spacing: 25.4 },
    { schema: 'A2', net_type: 'copertec', height: 223, luce_min: 369, luce_max: 409, spacing: 25.4 },
    { schema: 'B2', net_type: 'copertec', height: 223, luce_min: 374, luce_max: 414, spacing: 25.4 },
    { schema: 'C2', net_type: 'copertec', height: 223, luce_min: 369, luce_max: 409, spacing: 25.4 },
    { schema: 'A2', net_type: 'coperplax', height: 244, luce_min: 409, luce_max: 450, spacing: 25.4 },
    { schema: 'B2', net_type: 'coperplax', height: 244, luce_min: 414, luce_max: 456, spacing: 25.4 },
    { schema: 'C2', net_type: 'coperplax', height: 244, luce_min: 409, luce_max: 450, spacing: 25.4 },
    { schema: 'A2', net_type: 'copertec', height: 253, luce_min: 450, luce_max: 470, spacing: 25.4 },
    { schema: 'B2', net_type: 'copertec', height: 253, luce_min: 456, luce_max: 474, spacing: 25.4 },
    { schema: 'C2', net_type: 'copertec', height: 253, luce_min: 450, luce_max: 470, spacing: 25.4 },
];

export const LOOKUP_D = [
    { schema: 'D', net_type: 'coperplax', height: 102, luce_min: 0, luce_max: 88, plate_spacing: 50 },
    { schema: 'D', net_type: 'coperplax', height: 122, luce_min: 89, luce_max: 107, plate_spacing: 50 },
    { schema: 'D', net_type: 'coperplax', height: 152, luce_min: 108, luce_max: 139, plate_spacing: 50 },
    { schema: 'D', net_type: 'coperplax', height: 183, luce_min: 140, luce_max: 169, plate_spacing: 50 },
    { schema: 'D', net_type: 'coperplax', height: 203, luce_min: 170, luce_max: 188, plate_spacing: 50 },
    { schema: 'D', net_type: 'coperplax', height: 223, luce_min: 189, luce_max: 208, plate_spacing: 50 },
    { schema: 'D', net_type: 'coperplax', height: 244, luce_min: 209, luce_max: 230, plate_spacing: 50 },
];

export const LOOKUP_E = [
    { schema: 'E', net_type: 'coperplax', height: 102, luce_min: 0, luce_max: 69, plate_spacing: 55 },
    { schema: 'E', net_type: 'coperplax', height: 122, luce_min: 70, luce_max: 89, plate_spacing: 55 },
    { schema: 'E', net_type: 'coperplax', height: 152, luce_min: 90, luce_max: 120, plate_spacing: 55 },
    { schema: 'E', net_type: 'coperplax', height: 183, luce_min: 121, luce_max: 150, plate_spacing: 55 },
    { schema: 'E', net_type: 'coperplax', height: 203, luce_min: 151, luce_max: 170, plate_spacing: 55 },
    { schema: 'E', net_type: 'coperplax', height: 223, luce_min: 171, luce_max: 191, plate_spacing: 55 },
    { schema: 'E', net_type: 'coperplax', height: 244, luce_min: 192, luce_max: 211, plate_spacing: 55 },
];

export const LOOKUP_D2 = [
    { schema: 'D2', net_type: 'coperplax', height: 102, luce_min: 160, luce_max: 178, plate_spacing: 50 },
    { schema: 'D2', net_type: 'coperplax', height: 122, luce_min: 179, luce_max: 219, plate_spacing: 50 },
    { schema: 'D2', net_type: 'coperplax', height: 152, luce_min: 220, luce_max: 280, plate_spacing: 50 },
    { schema: 'D2', net_type: 'coperplax', height: 183, luce_min: 281, luce_max: 341, plate_spacing: 50 },
    { schema: 'D2', net_type: 'coperplax', height: 203, luce_min: 342, luce_max: 381, plate_spacing: 50 },
    { schema: 'D2', net_type: 'coperplax', height: 223, luce_min: 382, luce_max: 422, plate_spacing: 50 },
    { schema: 'D2', net_type: 'coperplax', height: 244, luce_min: 423, luce_max: 463, plate_spacing: 50 },
];

export const LOOKUP_E2 = [
    { schema: 'E2', net_type: 'coperplax', height: 102, luce_min: 0, luce_max: 161, plate_spacing: 55 },
    { schema: 'E2', net_type: 'coperplax', height: 122, luce_min: 162, luce_max: 201, plate_spacing: 55 },
    { schema: 'E2', net_type: 'coperplax', height: 152, luce_min: 202, luce_max: 262, plate_spacing: 55 },
    { schema: 'E2', net_type: 'coperplax', height: 183, luce_min: 263, luce_max: 323, plate_spacing: 55 },
    { schema: 'E2', net_type: 'coperplax', height: 203, luce_min: 324, luce_max: 363, plate_spacing: 55 },
    { schema: 'E2', net_type: 'coperplax', height: 223, luce_min: 364, luce_max: 404, plate_spacing: 55 },
    { schema: 'E2', net_type: 'coperplax', height: 244, luce_min: 405, luce_max: 445, plate_spacing: 55 },
];

// ================================================================
// COSTANTI
// ================================================================

export const ROLL_LENGTH_M = 25;
export const MAGLIA_MM = 50.8;
export const SPONDE_ABC = 3 * 0.0508 * 2;
export const SPONDE_A1B1C1 = 10 * 0.0254 * 2;
export const SPONDE_A2B2C2 = 10 * 0.0508 * 2;
export const SPONDE_D2E2 = 4 * 0.0508 * 2;
export const MAX_PLATE_SPACING_E = 55;
export const OVERLAP_SMALL = 0.5;
export const OVERLAP_LARGE = 1.0;
