// =============================================================================
// PALETAS AUTÉNTICAS MINECRAFT VANILLA / MINECRAFT LIVE (5 TONOS + CONTORNO)
// =============================================================================

export const MATERIAL_PALETTES = {
  netherite: {
    hi: '#93878d',
    light: '#70656b',
    mid: '#52494f',
    dark: '#3a3237',
    outline: '#1e191c'
  },
  diamond: {
    hi: '#c4fbff',
    light: '#62ede8',
    mid: '#2cc7be',
    dark: '#188f96',
    outline: '#0c474d'
  },
  iron: {
    hi: '#ffffff',
    light: '#e6e8ec',
    mid: '#bcc2cc',
    dark: '#858d99',
    outline: '#3e434c'
  },
  gold: {
    hi: '#fff9b8',
    light: '#fcee4b',
    mid: '#e3b219',
    dark: '#a87408',
    outline: '#573604'
  },
  chainmail: {
    hi: '#e2e8f0',
    light: '#a8b4c4',
    mid: '#707d8e',
    dark: '#465161',
    outline: '#1e242e'
  },
  leather: {
    hi: '#d99e6c',
    light: '#b87644',
    mid: '#8f5228',
    dark: '#633517',
    outline: '#361a0a'
  },
  turtle: {
    hi: '#b8f7b0',
    light: '#52d656',
    mid: '#2da63a',
    dark: '#1d7328',
    outline: '#0d3d14'
  },
  stone: {
    hi: '#d2d6dc',
    light: '#a4aab3',
    mid: '#7a818c',
    dark: '#555b66',
    outline: '#2c3038'
  },
  wood: {
    hi: '#dfba7c',
    light: '#ba8e50',
    mid: '#8f6632',
    dark: '#66451e',
    outline: '#38220d'
  }
};

export function getMaterialPalette(materialId) {
  return MATERIAL_PALETTES[materialId] || MATERIAL_PALETTES.diamond;
}
