// =============================================================================
// MOTOR DE SPRITES PIXEL-ART 16x16 FIELES A MINECRAFT VANILLA / MINECRAFT LIVE
// Renderizado por matriz exacta de píxeles con contorno, sombreado y recoloreo
// =============================================================================

import { getMaterialPalette } from './palettes.js';

/**
 * Compila una matriz de 16x16 caracteres en <rect> horizontales fusionados (RLE)
 * para lograr nitidez perfecta y SVG ultra-ligero.
 */
function renderPixelMatrix(rows, colorMap, sizeClass = 'px-icon-md', extraClass = '') {
  const rects = [];
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      const color = colorMap[ch];
      if (!color) {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w++;
      rects.push(`<rect x="${x}" y="${y}" width="${w}" height="1" fill="${color}"/>`);
      x += w;
    }
  }
  return `<svg viewBox="0 0 16 16" class="px-svg ${sizeClass} ${extraClass}" shape-rendering="crispEdges" aria-hidden="true">${rects.join('')}</svg>`;
}

function getToolColorMap(materialId) {
  const p = getMaterialPalette(materialId);
  return {
    o: p.outline,
    d: p.dark,
    m: p.mid,
    l: p.light,
    h: p.hi,
    // Mango clásico de palo de roble Minecraft
    k: '#3d2510',
    w: '#6b4721',
    W: '#8f6333',
    // Detalles internos armadura / cuero
    i: '#1d2028',
    g: '#cbd5e1',
    G: '#64748b'
  };
}

// =============================================================================
// MATRICES 16x16 AUTÉNTICAS DE MINECRAFT (SILUETAS Y SOMBRAS ORIGINALES)
// =============================================================================
const SPRITES = {
  pickaxe: [
    '................',
    '.....ooooo......',
    '....ohlllmo.....',
    '...odmlhllmo....',
    '...oo..ooklmo...',
    '........owkmo...',
    '.......owWkdo...',
    '......owWk.odo..',
    '.....owWk..odo..',
    '....owWk...oo...',
    '...owWk.........',
    '..owWk..........',
    '.owWk...........',
    '.okw............',
    '.oo.............',
    '................'
  ],
  sword: [
    '................',
    '............ooo.',
    '...........ohlmo',
    '..........ohllmo',
    '.........ohllmo.',
    '........ohllmo..',
    '.......ohllmo...',
    '..oo..ohllmo....',
    '..olooohllmo....',
    '...odmlllmo.....',
    '....odmmmo......',
    '...owWoddo......',
    '..owWk.olmo.....',
    '.owWk...oo......',
    '.okw............',
    '..oo............'
  ],
  axe: [
    '................',
    '.......oooo.....',
    '......ohllmo....',
    '.....ohlllmo....',
    '.....ollllmo....',
    '.....odmmklmo...',
    '......oodwkmo...',
    '.......owWko....',
    '......owWk......',
    '.....owWk.......',
    '....owWk........',
    '...owWk.........',
    '..owWk..........',
    '.owWk...........',
    '.okw............',
    '..oo............'
  ],
  shovel: [
    '................',
    '..........oooo..',
    '.........ohllmo.',
    '........ohlllmo.',
    '........ollllmo.',
    '........odmlmo..',
    '.......okdmmo...',
    '......owWkoo....',
    '.....owWk.......',
    '....owWk........',
    '...owWk.........',
    '..owWk..........',
    '.owWk...........',
    '.okw............',
    '..oo............',
    '................'
  ],
  hoe: [
    '................',
    '......oooooo....',
    '.....ohllllmo...',
    '....odmllhlmo...',
    '....oooooklmo...',
    '........owkdo...',
    '.......owWko....',
    '......owWk......',
    '.....owWk.......',
    '....owWk........',
    '...owWk.........',
    '..owWk..........',
    '.owWk...........',
    '.okw............',
    '..oo............',
    '................'
  ],
  helmet: [
    '................',
    '................',
    '....oooooooo....',
    '...ohlllllmmo...',
    '..ohllllllmmmo..',
    '..olllmmmmmmdo..',
    '..olmoiiiimmdo..',
    '..olmoimmiimdo..',
    '..olmoimmiimdo..',
    '..odmoiiiimmdo..',
    '..odmo....omdo..',
    '..odmo....omdo..',
    '...oo......oo...',
    '................',
    '................',
    '................'
  ],
  chestplate: [
    '................',
    '..oooo....oooo..',
    '.ohllmo..omllmo.',
    '.ohlllmooolllmo.',
    '.olllllmmllllmo.',
    '.odmmllllllmmmo.',
    '..ooomhllmmmoo..',
    '...oohlllmmmo...',
    '...oollllmmmo...',
    '...oolllmmmmo...',
    '...oodllmmmmo...',
    '...oodmmmmmmo...',
    '...oodddmmmmo...',
    '....oooooooo....',
    '................',
    '................'
  ],
  leggings: [
    '................',
    '...oooooooooo...',
    '..ohllllllllmo..',
    '..olllmmmmmmmo..',
    '..odmmmmmmmmmo..',
    '..olllmoolmmmo..',
    '..olllmoommmmo..',
    '..olllmo.ommmo..',
    '..olllmo.ommmo..',
    '..odllmo.ommmo..',
    '..odmmmo.ommdo..',
    '..odmmmo.ommdo..',
    '..odddmo.odddo..',
    '...oooo...oooo..',
    '................',
    '................'
  ],
  boots: [
    '................',
    '................',
    '................',
    '................',
    '..ooooo..ooooo..',
    '..ohllmoohllmo..',
    '..olllmooollmo..',
    '..olllmooolmmo..',
    '.oolllmooolmmmo.',
    'ohllllmooolmmmdo',
    'olllllmooolmmmmo',
    'odddddmooodddddo',
    '.oooooo..oooooo.',
    '................',
    '................',
    '................'
  ],
  elytra: [
    '................',
    '....ooo..ooo....',
    '...oLLmooLLmo...',
    '..oHLLmddLLmmo..',
    '..oHLLmddLLmmo..',
    '..oLLLmddLLmmo..',
    '.oHLLLm..mLLmmo.',
    '.oLLLLm..mLLmmo.',
    '.oLLLm....mLmmo.',
    '.oLLmm....mmmmo.',
    '..oLmm....mmmo..',
    '..oDmm....mmDo..',
    '...oDm....mDo...',
    '....oo....oo....',
    '................',
    '................'
  ],
  bow: [
    '................',
    '..........ooo...',
    '.........oWWko..',
    '........oWWkso..',
    '.......oWWks....',
    '......oWWks.....',
    '.....oWWks......',
    '....oWWks.......',
    '...oWWks........',
    '..oWWks.........',
    '..oWks..........',
    '.oWks...........',
    '.oWko...........',
    '..oo............',
    '................',
    '................'
  ],
  crossbow: [
    '................',
    '......oooo......',
    '....ooGGgGoo....',
    '...oGgoWWogGo...',
    '..oGgsWWkWsgGo..',
    '..oGsoWWkWosGo..',
    '...oo.oWWk.oo...',
    '.....ooWWko.....',
    '....oWWkWko.....',
    '...oWWk..oo.....',
    '..oWWk..........',
    '.oWWk...........',
    '.okw............',
    '..oo............',
    '................',
    '................'
  ],
  trident: [
    '................',
    '........oo..oo..',
    '.......oHmoHmo..',
    '........oHmoHmo.',
    '......oo.oHmoHmo',
    '.....oHmooTTmmo.',
    '......oTTmTTmo..',
    '.......ooTTmo...',
    '........oTmo....',
    '.......oTDmo....',
    '......oTDmo.....',
    '.....oTDmo......',
    '....oTDmo.......',
    '...oTDmo........',
    '..oTDo..........',
    '..ooo...........'
  ],
  mace: [
    '................',
    '.......oooooo...',
    '......oHHLLDDo..',
    '......oHLLLLDo..',
    '......oHLMMLLo..',
    '......oHLMMLLo..',
    '......oHDDDDDo..',
    '......ooGGddoo..',
    '.......oYYyo....',
    '......oYYyo.....',
    '.....oYYyo......',
    '....oYYyo.......',
    '...oYYyo........',
    '..oYYyo.........',
    '..oyyo..........',
    '...oo...........'
  ],
  rod: [
    '................',
    '..........ooo...',
    '.........oWWko..',
    '........oWWkso..',
    '.......oWWk..s..',
    '......oWWk...s..',
    '.....oWWk....s..',
    '....oWWk.....s..',
    '...oWWk......s..',
    '..oWWk......oro.',
    '.oWWk......oRRro',
    '.okw.......oWWwo',
    '..oo........ooo.',
    '................',
    '................',
    '................'
  ],
  shield: [
    '................',
    '..oooooooooooo..',
    '..oGGGGGGGGGGoo.',
    '..oGWWwWWwWWGo..',
    '..oGWWwWWwWWGo..',
    '..oGWWwWWwWWGo..',
    '..oGWWwWWwWWGo..',
    '..oGWWwWWwWWGo..',
    '..oGWWwWWwWWGo..',
    '..oGWWwWWwWWGo..',
    '...oGWWwWWwGo...',
    '...oGWWwWWwGo...',
    '....oGWWwWGo....',
    '.....oGGGGG.....',
    '......ooooo.....',
    '................'
  ],
  shears: [
    '................',
    '.........oo.....',
    '........oHGo....',
    '.......oHGGo....',
    '......oHGGgo....',
    '....ooGGgGoo....',
    '...oHGGgGo......',
    '..oHGGgo........',
    '..oGgooRoo......',
    '...oo.oRRro.....',
    '.....oRroRro....',
    '.....oRroRro....',
    '......oooo......',
    '................',
    '................',
    '................'
  ],
  flint_steel: [
    '................',
    '......oooooo....',
    '.....oHGGGgGo...',
    '....oHGo..oGGo..',
    '....oGo...oGGo..',
    '....oo....oGGo..',
    '...oooo..oGGo...',
    '..oFFfFo.oGo....',
    '.oFFfFFfooo.....',
    '.oFfFFFFo.......',
    '.oFFFFfFo.......',
    '..oFFFFo........',
    '...oooo.........',
    '................',
    '................',
    '................'
  ],
  brush: [
    '................',
    '.........oooo...',
    '........oBBbBo..',
    '.......oBBbBBo..',
    '.......oBbBBbo..',
    '......ooCCcco...',
    '.....oCCcco.....',
    '.....oWWko......',
    '....oWWko.......',
    '...oWWko........',
    '..oWWko.........',
    '.oWWko..........',
    '.okwo...........',
    '..oo............',
    '................',
    '................'
  ],
  pumpkin: [
    '................',
    '.......oo.......',
    '......oGGo......',
    '...oooooooooo...',
    '..oPOOPOOOPOOo..',
    '.oPOPOOPOOPOPOo.',
    '.oPOiiOPOiiOPOo.',
    '.oPOiiOPOiiOPOo.',
    '.oPOPOOPOOPOPOo.',
    '.oPOiiOPOiiOPOo.',
    '.oPOiiiiiiiOPOo.',
    '.oPOPOiOiOPOPOo.',
    '..oPOOPOOOPOOo..',
    '...oooooooooo...',
    '................',
    '................'
  ],
  emerald: [
    '................',
    '......oooo......',
    '.....oHEEEo.....',
    '....oHEEEEeo....',
    '...oHHEEEEeeo...',
    '...oHEHEEEeeo...',
    '...oHEEEEEEeo...',
    '...oHEEEEEEeo...',
    '...oHEEEEEeeo...',
    '...oEEEEEEeeo...',
    '...oEEEEEeeeo...',
    '....oEEEEeeo....',
    '.....oEEeeo.....',
    '......oooo......',
    '................',
    '................'
  ],
  lapis: [
    '................',
    '................',
    '.....oooooo.....',
    '....oHBBBBbo....',
    '...oHBBBBBbb....',
    '..oHBBBBBBbbo...',
    '..oHBBBBBBbbo...',
    '..oBBBBBBbbbo...',
    '..oBBBBBbbbbo...',
    '...oBBBBbbbo....',
    '....oBBBbbbo....',
    '.....oooooo.....',
    '................',
    '................',
    '................',
    '................'
  ],
  book_normal: [
    '................',
    '.....ooooooo....',
    '....oBBBBBBBo...',
    '...oBBBBBBBBBo..',
    '..oBbbBBBBBBBo..',
    '..oBbBYYYYBBBo..',
    '..oBbBBBBBBBBo..',
    '..oBbBBBBBBBBo..',
    '..oBbBBBBBBBBo..',
    '..oBbBBBBBBPPo..',
    '..oBbBBBBPPPPo..',
    '...oBbbBPPPPo...',
    '....ooPPPPPo....',
    '......ooooo.....',
    '................',
    '................'
  ],
  book_enchanted: [
    '................',
    '.....ooooooo....',
    '....oVVVVVVVo...',
    '...oVLLVVVVVVo..',
    '..oVddVVVVVVVo..',
    '..oVdVYYYYVVVo..',
    '..oVdVVVVVVVVo..',
    '..oVdVRVVVVVVo..',
    '..oVdVRRVVVVVo..',
    '..oVdVVVVVVPPo..',
    '..oVdVVVVPPPPo..',
    '...oVddVPPPPo...',
    '....ooPPPPPo....',
    '......ooooo.....',
    '................',
    '................'
  ],
  anvil_mini: [
    '................',
    '..oooooooooooo..',
    '.oHGGGGGGGGGGGo.',
    '.oGGGGGGGGGGGGDo',
    '.oGGDDDDDDDDDDDo',
    '...oooGGGGooo...',
    '.....oGGDDo.....',
    '.....oGGDDo.....',
    '....oGGDDDDo....',
    '...oGGDDDDDDo...',
    '..oHGGGGGGGDDo..',
    '..oGGDDDDDDDDo..',
    '..oooooooooooo..',
    '................',
    '................',
    '................'
  ],
  xp_orb: [
    '................',
    '................',
    '.....oooooo.....',
    '....oGLLLLGo....',
    '...oGLHYYLLGo...',
    '..oGLHHYLLLGo...',
    '..oGLLYYLLLLGo..',
    '..oGLLLLLLLLGo..',
    '..oGGLLLLLLGGo..',
    '...oGGGLLGGGo...',
    '....oGGGGGGGo...',
    '.....oooooo.....',
    '................',
    '................',
    '................',
    '................'
  ]
};

const FIXED_COLOR_MAPS = {
  elytra: { o: '#1f242e', H: '#e2e8f0', L: '#b3becf', m: '#7d889b', d: '#525b6b', D: '#39404d' },
  bow: { o: '#2e1b0b', W: '#9c6e38', k: '#6b4721', s: '#e2e8f0' },
  crossbow: { o: '#242730', G: '#94a3b8', g: '#cbd5e1', W: '#9c6e38', k: '#6b4721', s: '#e2e8f0' },
  trident: { o: '#0a3634', H: '#99f6e4', m: '#2dd4bf', T: '#14b8a6', D: '#0f766e' },
  mace: { o: '#1c1f26', H: '#cbd5e1', L: '#8b95a5', M: '#576070', D: '#383f4c', G: '#94a3b8', d: '#475569', Y: '#facc15', y: '#b47409' },
  rod: { o: '#2e1b0b', W: '#9c6e38', k: '#6b4721', s: '#e2e8f0', r: '#dc2626', R: '#f87171', w: '#f8fafc' },
  shield: { o: '#272a33', G: '#94a3b8', W: '#9c6e38', w: '#784e22' },
  shears: { o: '#1f242d', H: '#f1f5f9', G: '#cbd5e1', g: '#64748b', R: '#dc2626', r: '#991b1b' },
  flint_steel: { o: '#1a1d24', H: '#f8fafc', G: '#cbd5e1', g: '#64748b', F: '#475569', f: '#334155' },
  brush: { o: '#2e1b0b', B: '#e0b36b', b: '#b5843c', C: '#2dd4bf', c: '#0d9488', W: '#9c6e38', k: '#6b4721' },
  pumpkin: { o: '#361605', G: '#16a34a', P: '#f97316', O: '#c2410c', i: '#1c120b' },
  emerald: { o: '#043828', H: '#a7f3d0', E: '#10b981', e: '#047857' },
  lapis: { o: '#132152', H: '#93c5fd', B: '#2563eb', b: '#1d4ed8' },
  book_normal: { o: '#2e1608', B: '#9a5425', b: '#6b3614', Y: '#fbbf24', P: '#fef3c7' },
  book_enchanted: { o: '#28104a', V: '#7c3aed', L: '#c4b5fd', d: '#4c1d95', Y: '#fde047', R: '#ef4444', P: '#f3e8ff' },
  anvil_mini: { o: '#181a20', H: '#d1d5db', G: '#6b7280', D: '#374151' },
  xp_orb: { o: '#1a3a08', G: '#4ade80', L: '#80ff20', H: '#fef9c3', Y: '#d9f99d' }
};

const MATERIAL_DRIVEN_ICONS = new Set([
  'pickaxe',
  'sword',
  'axe',
  'shovel',
  'hoe',
  'helmet',
  'chestplate',
  'leggings',
  'boots'
]);

/**
 * Renderiza un sprite pixel-art 16x16 fiel a Minecraft recoloreado dinámicamente al material.
 */
export function renderItemIcon(iconKey, options = {}) {
  const { materialId = 'diamond', enchanted = false, sizeClass = 'px-icon-md' } = options;

  if (iconKey === 'gold_shovel') {
    return renderItemIcon('shovel', { materialId: 'gold', enchanted: false, sizeClass });
  }

  const resolvedKey = SPRITES[iconKey] ? iconKey : 'sword';
  const colorMap = MATERIAL_DRIVEN_ICONS.has(resolvedKey)
    ? getToolColorMap(materialId)
    : FIXED_COLOR_MAPS[resolvedKey];

  let extraClass = '';
  if (enchanted || resolvedKey === 'book_enchanted') extraClass = 'px-svg--enchanted';
  else if (resolvedKey === 'emerald') extraClass = 'px-svg--shimmer';
  else if (resolvedKey === 'xp_orb') extraClass = 'px-svg--xp-pulse';

  return renderPixelMatrix(SPRITES[resolvedKey], colorMap, sizeClass, extraClass);
}
