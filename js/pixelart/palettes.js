// =============================================================================
// PALETAS AUTÉNTICAS DE MATERIALES MINECRAFT PARA PIXEL-ART DINÁMICO
// =============================================================================

export const MATERIAL_PALETTES = {
  netherite: {
    hi: '#8f848a',
    light: '#6a6066',
    mid: '#4d454a',
    dark: '#332d31',
    outline: '#1d191c'
  },
  diamond: {
    hi: '#a5f3fc',
    light: '#4ae4f7',
    mid: '#1ec4dc',
    dark: '#0f8fa6',
    outline: '#095c6b'
  },
  iron: {
    hi: '#ffffff',
    light: '#e5e7eb',
    mid: '#b8bec7',
    dark: '#858d99',
    outline: '#505660'
  },
  gold: {
    hi: '#fef9c3',
    light: '#fde047',
    mid: '#eab308',
    dark: '#b87d06',
    outline: '#784e04'
  },
  chainmail: {
    hi: '#e2e8f0',
    light: '#a3b1c2',
    mid: '#6c7989',
    dark: '#475261',
    outline: '#232933'
  },
  leather: {
    hi: '#dca474',
    light: '#b87646',
    mid: '#8f552b',
    dark: '#663a1b',
    outline: '#40220e'
  },
  turtle: {
    hi: '#bbf7d0',
    light: '#4ade80',
    mid: '#22a352',
    dark: '#157338',
    outline: '#0d4a23'
  },
  stone: {
    hi: '#d1d5db',
    light: '#9ca3af',
    mid: '#737b86',
    dark: '#525861',
    outline: '#363a42'
  },
  wood: {
    hi: '#e0bc82',
    light: '#bd9053',
    mid: '#946a37',
    dark: '#6b4922',
    outline: '#452e14'
  }
};

export function getMaterialPalette(materialId) {
  return MATERIAL_PALETTES[materialId] || MATERIAL_PALETTES.diamond;
}
