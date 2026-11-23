// =============================================================================
// REGLAS EXACTAS DE LA MESA DE ENCANTAMIENTOS NV. 30 Y TECHOS DE ALDEANOS
// =============================================================================

export const TREASURE_ENCHANTS = new Set([
  'mending',
  'soul_speed',
  'swift_sneak',
  'wind_burst',
  'frost_walker',
  'vanishing_curse',
  'binding_curse'
]);

export const STRUCTURE_ONLY_ENCHANTS = new Set([
  'soul_speed',
  'swift_sneak',
  'wind_burst'
]);

export const TABLE_PRIMARY_ENCHANTS = {
  pickaxe: ['efficiency', 'unbreaking', 'fortune', 'silk_touch'],
  shovel: ['efficiency', 'unbreaking', 'fortune', 'silk_touch'],
  hoe: ['efficiency', 'unbreaking', 'fortune', 'silk_touch'],
  axe: ['efficiency', 'unbreaking', 'fortune', 'silk_touch'], // Filo/Castigo/Artrópodos son solo por Yunque en Hachas
  sword: ['sharpness', 'smite', 'bane_arthropods', 'knockback', 'fire_aspect', 'looting', 'sweeping_edge', 'unbreaking'],
  helmet: ['protection', 'fire_protection', 'blast_protection', 'proj_protection', 'respiration', 'aqua_affinity', 'unbreaking'],
  chestplate: ['protection', 'fire_protection', 'blast_protection', 'proj_protection', 'thorns', 'unbreaking'],
  leggings: ['protection', 'fire_protection', 'blast_protection', 'proj_protection', 'unbreaking'],
  boots: ['protection', 'fire_protection', 'blast_protection', 'proj_protection', 'feather_falling', 'depth_strider', 'unbreaking'],
  bow: ['power', 'punch', 'flame', 'infinity', 'unbreaking'],
  crossbow: ['quick_charge', 'multishot', 'piercing', 'unbreaking'],
  trident: ['loyalty', 'riptide', 'impaling', 'channeling', 'unbreaking'],
  mace: ['density', 'breach', 'smite', 'bane_arthropods', 'fire_aspect', 'unbreaking'],
  fishing_rod: ['luck_of_the_sea', 'lure', 'unbreaking']
};

export const TABLE_ENCHANT_RULES = {
  protection:       { weight: 10, min: l => 1 + (l - 1) * 11,  max: l => 12 + (l - 1) * 11 },
  fire_protection:  { weight: 5,  min: l => 10 + (l - 1) * 8,  max: l => 18 + (l - 1) * 8 },
  feather_falling:  { weight: 5,  min: l => 5 + (l - 1) * 6,   max: l => 11 + (l - 1) * 6 },
  blast_protection: { weight: 2,  min: l => 5 + (l - 1) * 8,   max: l => 13 + (l - 1) * 8 },
  proj_protection:  { weight: 5,  min: l => 3 + (l - 1) * 6,   max: l => 9 + (l - 1) * 6 },
  respiration:      { weight: 2,  min: l => 10 * l,            max: l => 10 * l + 30 },
  aqua_affinity:    { weight: 2,  min: () => 1,                max: () => 41 },
  thorns:           { weight: 1,  min: l => 10 + (l - 1) * 20, max: l => 60 + (l - 1) * 20 },
  depth_strider:    { weight: 2,  min: l => 10 * l,            max: l => 10 * l + 15 },
  sharpness:        { weight: 10, min: l => 1 + (l - 1) * 11,  max: l => 21 + (l - 1) * 11 },
  smite:            { weight: 5,  min: l => 5 + (l - 1) * 8,   max: l => 25 + (l - 1) * 8 },
  bane_arthropods:  { weight: 5,  min: l => 5 + (l - 1) * 8,   max: l => 25 + (l - 1) * 8 },
  knockback:        { weight: 5,  min: l => 5 + (l - 1) * 20,  max: l => 55 + (l - 1) * 20 },
  fire_aspect:      { weight: 2,  min: l => 10 + (l - 1) * 20, max: l => 60 + (l - 1) * 20 },
  looting:          { weight: 2,  min: l => 15 + (l - 1) * 9,  max: l => 65 + (l - 1) * 9 },
  sweeping_edge:    { weight: 2,  min: l => 5 + (l - 1) * 9,   max: l => 20 + (l - 1) * 9 },
  efficiency:       { weight: 10, min: l => 1 + (l - 1) * 10,  max: l => 51 + (l - 1) * 10 },
  silk_touch:       { weight: 1,  min: () => 15,               max: () => 65 },
  unbreaking:       { weight: 5,  min: l => 5 + (l - 1) * 8,   max: l => 55 + (l - 1) * 8 },
  fortune:          { weight: 2,  min: l => 15 + (l - 1) * 9,  max: l => 65 + (l - 1) * 9 },
  power:            { weight: 10, min: l => 1 + (l - 1) * 10,  max: l => 16 + (l - 1) * 10 },
  punch:            { weight: 2,  min: l => 12 + (l - 1) * 20, max: l => 37 + (l - 1) * 20 },
  flame:            { weight: 2,  min: () => 20,               max: () => 50 },
  infinity:         { weight: 1,  min: () => 20,               max: () => 50 },
  luck_of_the_sea:  { weight: 2,  min: l => 15 + (l - 1) * 9,  max: l => 65 + (l - 1) * 9 },
  lure:             { weight: 2,  min: l => 15 + (l - 1) * 9,  max: l => 65 + (l - 1) * 9 },
  loyalty:          { weight: 5,  min: l => 12 + (l - 1) * 7,  max: () => 50 },
  impaling:         { weight: 2,  min: l => 1 + (l - 1) * 8,   max: l => 21 + (l - 1) * 8 },
  riptide:          { weight: 2,  min: l => 17 + (l - 1) * 7,  max: () => 50 },
  channeling:       { weight: 1,  min: () => 25,               max: () => 50 },
  multishot:        { weight: 2,  min: () => 20,               max: () => 50 },
  quick_charge:     { weight: 5,  min: l => 12 + (l - 1) * 20, max: () => 50 },
  piercing:         { weight: 10, min: l => 1 + (l - 1) * 10,  max: () => 50 },
  density:          { weight: 5,  min: l => 5 + (l - 1) * 8,   max: l => 25 + (l - 1) * 8 },
  breach:           { weight: 2,  min: l => 15 + (l - 1) * 9,  max: l => 65 + (l - 1) * 9 }
};

export const VILLAGER_CAPS_BY_ITEM = {
  helmet: ['Irrompibilidad III', 'Afinidad Acuática', 'Protección II', 'Respiración II'],
  chestplate: ['Irrompibilidad III', 'Protección II', 'Prot. Fuego III', 'Prot. Proyectiles IV'],
  leggings: ['Irrompibilidad III', 'Protección II', 'Prot. Fuego III', 'Prot. Explosiones IV'],
  boots: ['Caída de Pluma IV', 'Irrompibilidad III', 'Protección II'],
  sword: ['Irrompibilidad III', 'Filo III', 'Empuje II', 'Barrido II', 'Aspecto Ígneo I'],
  pickaxe: ['Toque de Seda', 'Irrompibilidad III', 'Eficiencia III', 'Fortuna II'],
  axe: ['Toque de Seda', 'Irrompibilidad III', 'Eficiencia III', 'Filo III'],
  shovel: ['Toque de Seda', 'Irrompibilidad III', 'Eficiencia III', 'Fortuna II'],
  bow: ['Poder III', 'Irrompibilidad II', 'Retroceso I'],
  crossbow: ['Perforación III', 'Carga Rápida II', 'Irrompibilidad II'],
  fishing_rod: ['Suerte Marina I', 'Atracción I', 'Irrompibilidad II']
};

export const VILLAGER_EQUIPMENT_STATS = {
  helmet: {
    prof: 'Armero',
    station: 'Alto Horno',
    tier: 'Nivel 5 (Maestro)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { unbreaking: 0.035, aqua_affinity: 0.12, protection: 0.18, respiration: 0.04 }
  },
  chestplate: {
    prof: 'Armero',
    station: 'Alto Horno',
    tier: 'Nivel 5 (Maestro)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { unbreaking: 0.035, protection: 0.18, fire_protection: 0.06 }
  },
  leggings: {
    prof: 'Armero',
    station: 'Alto Horno',
    tier: 'Nivel 4 (Experto)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { unbreaking: 0.035, protection: 0.18, blast_protection: 0.04, proj_protection: 0.04 }
  },
  boots: {
    prof: 'Armero',
    station: 'Alto Horno',
    tier: 'Nivel 4 (Experto)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { feather_falling: 0.028, unbreaking: 0.035, protection: 0.18 }
  },
  sword: {
    prof: 'Herrero de Armas',
    station: 'Afiladora',
    tier: 'Nivel 5 (Maestro)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { unbreaking: 0.035, sharpness: 0.022, knockback: 0.04, sweeping_edge: 0.05 }
  },
  pickaxe: {
    prof: 'Herrero de Herramientas',
    station: 'Mesa de Herrería',
    tier: 'Nivel 5 (Maestro)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { silk_touch: 0.038, unbreaking: 0.042, efficiency: 0.085, fortune: 0.021 }
  },
  axe: {
    prof: 'Herrero de Armas / Herramientas',
    station: 'Afiladora / Mesa de Herrería',
    tier: 'Nivel 4 (Experto)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { silk_touch: 0.038, unbreaking: 0.042, efficiency: 0.085 }
  },
  shovel: {
    prof: 'Herrero de Herramientas',
    station: 'Mesa de Herrería',
    tier: 'Nivel 4 (Experto)',
    slotProbJava: 0.667,
    slotProbBedrock: 0.5,
    enchantOdds: { silk_touch: 0.038, unbreaking: 0.042, efficiency: 0.085 }
  },
  bow: {
    prof: 'Flechero',
    station: 'Mesa de Flechas',
    tier: 'Nivel 4 (Experto)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { power: 0.04, unbreaking: 0.055, punch: 0.06 }
  },
  crossbow: {
    prof: 'Flechero',
    station: 'Mesa de Flechas',
    tier: 'Nivel 5 (Maestro)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { piercing: 0.06, quick_charge: 0.04, unbreaking: 0.05 }
  },
  fishing_rod: {
    prof: 'Pescador',
    station: 'Barril',
    tier: 'Nivel 2 (Aprendiz)',
    slotProbJava: 1.0,
    slotProbBedrock: 0.5,
    enchantOdds: { luck_of_the_sea: 0.05, lure: 0.05, unbreaking: 0.04 }
  }
};

