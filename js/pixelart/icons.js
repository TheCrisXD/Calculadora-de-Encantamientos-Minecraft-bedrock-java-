// =============================================================================
// GENERADOR DE ICONOS PIXEL-ART 16x16 DINÁMICOS POR MATERIAL + BRILLO ENCANTADO
// =============================================================================

import { getMaterialPalette } from './palettes.js';

function wrapSvg(body, sizeClass = 'px-icon-md', extraClass = '') {
  return `<svg viewBox="0 0 16 16" class="px-svg ${sizeClass} ${extraClass}" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
}

/**
 * Renderiza un icono pixel-art 16x16 recoloreado dinámicamente al material elegido.
 */
export function renderItemIcon(iconKey, options = {}) {
  const { materialId = 'diamond', enchanted = false, sizeClass = 'px-icon-md' } = options;
  const p = getMaterialPalette(materialId);
  const enchClass = enchanted ? 'px-svg--enchanted' : '';

  switch (iconKey) {
    case 'pickaxe':
      return wrapSvg(`
        <rect x="4" y="2" width="8" height="2" fill="${p.light}"/>
        <rect x="6" y="2" width="4" height="1" fill="${p.hi}"/>
        <rect x="3" y="3" width="2" height="2" fill="${p.mid}"/>
        <rect x="11" y="3" width="2" height="3" fill="${p.mid}"/>
        <rect x="12" y="5" width="2" height="4" fill="${p.dark}"/>
        <rect x="8" y="4" width="2" height="2" fill="${p.hi}"/>
        <rect x="7" y="6" width="2" height="2" fill="#8b5a2b"/>
        <rect x="5" y="8" width="2" height="2" fill="#784920"/>
        <rect x="3" y="10" width="2" height="2" fill="#633a17"/>
        <rect x="2" y="12" width="2" height="2" fill="#45270e"/>
      `, sizeClass, enchClass);

    case 'sword':
      return wrapSvg(`
        <rect x="12" y="2" width="2" height="2" fill="${p.hi}"/>
        <rect x="10" y="4" width="3" height="3" fill="${p.light}"/>
        <rect x="8" y="6" width="3" height="3" fill="${p.mid}"/>
        <rect x="6" y="8" width="3" height="3" fill="${p.dark}"/>
        <rect x="4" y="8" width="2" height="2" fill="${p.outline}"/>
        <rect x="7" y="11" width="2" height="2" fill="${p.outline}"/>
        <rect x="5" y="10" width="2" height="2" fill="#8b5a2b"/>
        <rect x="3" y="12" width="2" height="2" fill="#45270e"/>
      `, sizeClass, enchClass);

    case 'axe':
      return wrapSvg(`
        <rect x="8" y="2" width="5" height="5" fill="${p.light}"/>
        <rect x="7" y="3" width="2" height="4" fill="${p.mid}"/>
        <rect x="11" y="3" width="2" height="3" fill="${p.hi}"/>
        <rect x="10" y="6" width="2" height="2" fill="${p.dark}"/>
        <rect x="8" y="6" width="2" height="2" fill="#8b5a2b"/>
        <rect x="6" y="8" width="2" height="2" fill="#784920"/>
        <rect x="4" y="10" width="2" height="2" fill="#633a17"/>
        <rect x="2" y="12" width="2" height="2" fill="#45270e"/>
      `, sizeClass, enchClass);

    case 'shovel':
      return wrapSvg(`
        <rect x="10" y="2" width="4" height="4" fill="${p.light}"/>
        <rect x="11" y="2" width="2" height="2" fill="${p.hi}"/>
        <rect x="9" y="5" width="2" height="2" fill="${p.dark}"/>
        <rect x="7" y="7" width="2" height="2" fill="#8b5a2b"/>
        <rect x="5" y="9" width="2" height="2" fill="#784920"/>
        <rect x="3" y="11" width="2" height="2" fill="#633a17"/>
        <rect x="2" y="12" width="2" height="2" fill="#45270e"/>
      `, sizeClass, enchClass);

    case 'hoe':
      return wrapSvg(`
        <rect x="5" y="2" width="7" height="2" fill="${p.light}"/>
        <rect x="6" y="2" width="4" height="1" fill="${p.hi}"/>
        <rect x="10" y="3" width="2" height="3" fill="${p.dark}"/>
        <rect x="8" y="4" width="2" height="2" fill="#8b5a2b"/>
        <rect x="6" y="6" width="2" height="2" fill="#784920"/>
        <rect x="4" y="8" width="2" height="2" fill="#633a17"/>
        <rect x="2" y="10" width="2" height="3" fill="#45270e"/>
      `, sizeClass, enchClass);

    case 'helmet':
      return wrapSvg(`
        <rect x="4" y="3" width="8" height="2" fill="${p.hi}"/>
        <rect x="3" y="5" width="10" height="6" fill="${p.light}"/>
        <rect x="3" y="9" width="2" height="3" fill="${p.dark}"/>
        <rect x="11" y="9" width="2" height="3" fill="${p.dark}"/>
        <rect x="5" y="7" width="6" height="4" fill="#1c2029"/>
        <rect x="7" y="6" width="2" height="3" fill="${p.mid}"/>
      `, sizeClass, enchClass);

    case 'chestplate':
      return wrapSvg(`
        <rect x="2" y="3" width="4" height="4" fill="${p.light}"/>
        <rect x="10" y="3" width="4" height="4" fill="${p.light}"/>
        <rect x="4" y="4" width="8" height="9" fill="${p.mid}"/>
        <rect x="6" y="4" width="4" height="2" fill="#1c2029"/>
        <rect x="5" y="6" width="3" height="5" fill="${p.hi}"/>
        <rect x="4" y="11" width="8" height="2" fill="${p.dark}"/>
      `, sizeClass, enchClass);

    case 'leggings':
      return wrapSvg(`
        <rect x="4" y="2" width="8" height="3" fill="${p.hi}"/>
        <rect x="4" y="5" width="3" height="8" fill="${p.light}"/>
        <rect x="9" y="5" width="3" height="8" fill="${p.mid}"/>
        <rect x="7" y="5" width="2" height="2" fill="${p.dark}"/>
        <rect x="4" y="11" width="3" height="2" fill="${p.dark}"/>
        <rect x="9" y="11" width="3" height="2" fill="${p.outline}"/>
      `, sizeClass, enchClass);

    case 'boots':
      return wrapSvg(`
        <rect x="3" y="6" width="3" height="6" fill="${p.light}"/>
        <rect x="2" y="10" width="5" height="3" fill="${p.mid}"/>
        <rect x="3" y="6" width="2" height="2" fill="${p.hi}"/>
        <rect x="10" y="6" width="3" height="6" fill="${p.light}"/>
        <rect x="9" y="10" width="5" height="3" fill="${p.mid}"/>
        <rect x="10" y="6" width="2" height="2" fill="${p.hi}"/>
        <rect x="2" y="12" width="5" height="1" fill="${p.dark}"/>
        <rect x="9" y="12" width="5" height="1" fill="${p.dark}"/>
      `, sizeClass, enchClass);

    case 'elytra':
      return wrapSvg(`
        <rect x="4" y="2" width="3" height="10" fill="#94a3b8"/>
        <rect x="9" y="2" width="3" height="10" fill="#94a3b8"/>
        <rect x="3" y="5" width="3" height="8" fill="#64748b"/>
        <rect x="10" y="5" width="3" height="8" fill="#64748b"/>
        <rect x="6" y="3" width="4" height="3" fill="#cbd5e1"/>
        <rect x="4" y="4" width="1" height="6" fill="#e2e8f0"/>
        <rect x="11" y="4" width="1" height="6" fill="#e2e8f0"/>
      `, sizeClass, enchClass);

    case 'bow':
      return wrapSvg(`
        <rect x="4" y="2" width="2" height="2" fill="#78350f"/>
        <rect x="6" y="3" width="2" height="2" fill="#92400e"/>
        <rect x="8" y="5" width="2" height="6" fill="#78350f"/>
        <rect x="6" y="11" width="2" height="2" fill="#92400e"/>
        <rect x="4" y="12" width="2" height="2" fill="#78350f"/>
        <rect x="4" y="4" width="1" height="8" fill="#e2e8f0"/>
      `, sizeClass, enchClass);

    case 'crossbow':
      return wrapSvg(`
        <rect x="3" y="3" width="10" height="2" fill="#64748b"/>
        <rect x="2" y="4" width="2" height="3" fill="#475569"/>
        <rect x="12" y="4" width="2" height="3" fill="#475569"/>
        <rect x="7" y="3" width="2" height="10" fill="#78350f"/>
        <rect x="4" y="6" width="8" height="1" fill="#e2e8f0"/>
        <rect x="7" y="2" width="2" height="2" fill="#cbd5e1"/>
      `, sizeClass, enchClass);

    case 'trident':
      return wrapSvg(`
        <rect x="9" y="2" width="1" height="4" fill="#5eead4"/>
        <rect x="11" y="2" width="1" height="4" fill="#5eead4"/>
        <rect x="13" y="3" width="1" height="4" fill="#5eead4"/>
        <rect x="9" y="5" width="5" height="2" fill="#14b8a6"/>
        <rect x="8" y="7" width="2" height="2" fill="#0d9488"/>
        <rect x="6" y="9" width="2" height="2" fill="#0f766e"/>
        <rect x="4" y="11" width="2" height="2" fill="#0f766e"/>
        <rect x="2" y="13" width="2" height="2" fill="#115e59"/>
      `, sizeClass, enchClass);

    case 'mace':
      return wrapSvg(`
        <rect x="8" y="2" width="6" height="6" fill="#475569"/>
        <rect x="9" y="3" width="4" height="4" fill="#94a3b8"/>
        <rect x="10" y="3" width="2" height="2" fill="#e2e8f0"/>
        <rect x="6" y="8" width="2" height="2" fill="#eab308"/>
        <rect x="4" y="10" width="2" height="2" fill="#ca8a04"/>
        <rect x="2" y="12" width="2" height="2" fill="#854d0e"/>
      `, sizeClass, enchClass);

    case 'rod':
      return wrapSvg(`
        <rect x="11" y="2" width="2" height="2" fill="#78350f"/>
        <rect x="9" y="4" width="2" height="2" fill="#78350f"/>
        <rect x="7" y="6" width="2" height="2" fill="#78350f"/>
        <rect x="5" y="8" width="2" height="2" fill="#78350f"/>
        <rect x="3" y="10" width="2" height="3" fill="#451a03"/>
        <rect x="12" y="4" width="1" height="7" fill="#e2e8f0"/>
        <rect x="11" y="11" width="2" height="2" fill="#ef4444"/>
      `, sizeClass, enchClass);

    case 'shield':
      return wrapSvg(`
        <rect x="4" y="2" width="8" height="11" fill="#92400e"/>
        <rect x="3" y="2" width="1" height="10" fill="#94a3b8"/>
        <rect x="12" y="2" width="1" height="10" fill="#94a3b8"/>
        <rect x="5" y="13" width="6" height="1" fill="#94a3b8"/>
        <rect x="6" y="4" width="4" height="7" fill="#b45309"/>
      `, sizeClass, enchClass);

    case 'shears':
      return wrapSvg(`
        <rect x="4" y="3" width="2" height="5" fill="#cbd5e1"/>
        <rect x="10" y="3" width="2" height="5" fill="#cbd5e1"/>
        <rect x="6" y="7" width="4" height="2" fill="#64748b"/>
        <rect x="4" y="9" width="3" height="4" fill="#dc2626"/>
        <rect x="9" y="9" width="3" height="4" fill="#dc2626"/>
      `, sizeClass, enchClass);

    case 'flint_steel':
      return wrapSvg(`
        <rect x="7" y="3" width="5" height="2" fill="#cbd5e1"/>
        <rect x="10" y="5" width="2" height="5" fill="#94a3b8"/>
        <rect x="7" y="9" width="4" height="2" fill="#cbd5e1"/>
        <rect x="4" y="7" width="4" height="5" fill="#334155"/>
      `, sizeClass, enchClass);

    case 'brush':
      return wrapSvg(`
        <rect x="10" y="2" width="4" height="4" fill="#d97706"/>
        <rect x="9" y="5" width="2" height="2" fill="#38bdf8"/>
        <rect x="7" y="7" width="2" height="2" fill="#78350f"/>
        <rect x="5" y="9" width="2" height="2" fill="#78350f"/>
        <rect x="3" y="11" width="2" height="2" fill="#451a03"/>
      `, sizeClass, enchClass);

    case 'pumpkin':
      return wrapSvg(`
        <rect x="7" y="2" width="2" height="2" fill="#15803d"/>
        <rect x="3" y="4" width="10" height="9" fill="#ea580c"/>
        <rect x="4" y="4" width="8" height="9" fill="#f97316"/>
        <rect x="5" y="6" width="2" height="2" fill="#1e1b18"/>
        <rect x="9" y="6" width="2" height="2" fill="#1e1b18"/>
        <rect x="5" y="10" width="6" height="2" fill="#1e1b18"/>
      `, sizeClass, enchClass);

    case 'anvil_mini':
      return wrapSvg(`
        <rect x="2" y="3" width="12" height="3" fill="#525b68"/>
        <rect x="3" y="2" width="10" height="1" fill="#9ca3af"/>
        <rect x="5" y="6" width="6" height="2" fill="#374151"/>
        <rect x="6" y="8" width="4" height="3" fill="#1f2937"/>
        <rect x="3" y="11" width="10" height="3" fill="#374151"/>
        <rect x="4" y="11" width="8" height="1" fill="#6b7280"/>
      `, sizeClass, '');

    case 'emerald':
      return wrapSvg(`
        <rect x="6" y="2" width="4" height="1" fill="#065f46"/>
        <rect x="5" y="3" width="6" height="1" fill="#10b981"/>
        <rect x="4" y="4" width="8" height="8" fill="#059669"/>
        <rect x="5" y="4" width="3" height="4" fill="#6ee7b7"/>
        <rect x="6" y="5" width="4" height="6" fill="#10b981"/>
        <rect x="5" y="12" width="6" height="1" fill="#047857"/>
        <rect x="6" y="13" width="4" height="1" fill="#064e3b"/>
      `, sizeClass, 'px-svg--shimmer');

    case 'lapis':
      return wrapSvg(`
        <rect x="5" y="3" width="6" height="2" fill="#1d4ed8"/>
        <rect x="3" y="5" width="10" height="6" fill="#2563eb"/>
        <rect x="4" y="4" width="4" height="3" fill="#60a5fa"/>
        <rect x="7" y="7" width="4" height="3" fill="#1e40af"/>
        <rect x="5" y="11" width="6" height="2" fill="#1e3a8a"/>
      `, sizeClass, '');

    case 'book_normal':
      return wrapSvg(`
        <rect x="3" y="2" width="9" height="12" fill="#78350f"/>
        <rect x="4" y="3" width="8" height="10" fill="#92400e"/>
        <rect x="11" y="3" width="2" height="10" fill="#fef3c7"/>
        <rect x="4" y="2" width="1" height="12" fill="#451a03"/>
        <rect x="6" y="5" width="4" height="2" fill="#fbbf24"/>
      `, sizeClass, '');

    case 'book_enchanted':
      return wrapSvg(`
        <rect x="3" y="2" width="9" height="12" fill="#5b21b6"/>
        <rect x="4" y="3" width="8" height="10" fill="#7c3aed"/>
        <rect x="11" y="3" width="2" height="10" fill="#f5f3ff"/>
        <rect x="4" y="2" width="1" height="12" fill="#3b0764"/>
        <rect x="6" y="5" width="4" height="2" fill="#fbbf24"/>
        <rect x="7" y="8" width="3" height="2" fill="#ddd6fe"/>
      `, sizeClass, 'px-svg--enchanted');

    case 'gold_shovel':
      return renderItemIcon('shovel', { materialId: 'gold', enchanted: false, sizeClass });

    case 'xp_orb':
      return wrapSvg(`
        <rect x="5" y="3" width="6" height="10" fill="#4ade80"/>
        <rect x="3" y="5" width="10" height="6" fill="#4ade80"/>
        <rect x="5" y="5" width="6" height="6" fill="#bef264"/>
        <rect x="6" y="5" width="3" height="3" fill="#fef08a"/>
      `, sizeClass, 'px-svg--xp-pulse');

    default:
      return renderItemIcon('sword', options);
  }
}
