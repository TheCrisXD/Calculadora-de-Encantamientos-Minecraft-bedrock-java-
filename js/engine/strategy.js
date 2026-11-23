// =============================================================================
// MOTOR DE CONFLICTO, PROBABILIDADES DE BIBLIOTECARIO Y ESTRATEGIA ÓPTIMA
// =============================================================================

import { ENCHANTMENTS, ITEMS, MATERIALS, ROMAN } from '../data/catalog.js';
import { solveOptimalAnvilTree, solveLinearNaive } from './anvilDp.js';
import { analyzeEnchantingTable, areEnchantsIncompatible } from './enchantingTable.js';

export function getItemById(itemId) {
  return ITEMS.find(i => i.id === itemId) || ITEMS[0];
}

export function getMaterialForItem(item, materialId) {
  if (!item.materials || item.materials.length === 0) return null;
  const validId = item.materials.includes(materialId) ? materialId : item.materials[0];
  return MATERIALS[validId] || null;
}

export function getDisplayItemName(item, mat) {
  if (!mat) return item.name;
  return `${item.name} de ${mat.name}`;
}

export function itemHasVillagerForMaterial(item, mat) {
  if (!item.villagerMaterials || item.villagerMaterials.length === 0) return false;
  if (!mat) return item.villagerMaterials.includes('default');
  return item.villagerMaterials.includes(mat.id);
}

/**
 * Devuelve la razón por la que un encantamiento está bloqueado, o null si es válido.
 */
export function getEnchantConflict(itemId, edition, selectedEnchants, key) {
  if (key === 'sweeping_edge' && edition === 'bedrock') {
    return 'Exclusivo de Java Edition';
  }
  const target = ENCHANTMENTS[key];
  if (!target) return null;

  for (const activeKey of Object.keys(selectedEnchants)) {
    if (activeKey === key) continue;
    if (areEnchantsIncompatible(itemId, key, activeKey)) {
      const activeEnch = ENCHANTMENTS[activeKey];
      if (itemId === 'bow' && (key === 'infinity' || key === 'mending')) {
        return `Incompatible con ${activeEnch.name} en Arcos`;
      }
      if (itemId === 'trident' && (key === 'riptide' || activeKey === 'riptide')) {
        return `Incompatible con ${activeEnch.name} en Tridentes`;
      }
      if (itemId === 'mace') {
        return `Incompatible con ${activeEnch.name} en la Maza`;
      }
      return `Incompatible con ${activeEnch.name}`;
    }
  }
  return null;
}

/**
 * Probabilidad y re-rolls promedio de conseguir un libro en Bibliotecario (o estructura).
 */
export function getEnchantRerollStats(key, lvl, edition = 'java') {
  const ench = ENCHANTMENTS[key];
  if (key === 'soul_speed') {
    return {
      method: 'Trueque con Piglins / Cofres de Bastión',
      avgRerolls: null,
      avgFullMenuRerolls: null,
      noviceProbText: '0% (No sale en aldeanos)',
      fullMenuProbText: '~1.1% por lingote de oro a Piglins',
      detail: 'Dales lingotes de oro a los Piglins en el Nether para conseguir el libro o botas encantadas.'
    };
  }
  if (key === 'swift_sneak') {
    return {
      method: 'Cofres de Ciudades Antiguas (Deep Dark)',
      avgRerolls: null,
      avgFullMenuRerolls: null,
      noviceProbText: '0% (No sale en aldeanos)',
      fullMenuProbText: '~23.2% por cofre de Ciudad Antigua',
      detail: 'Explora los cofres alrededor del portal central de una Ciudad Antigua (evita activar chilladores).'
    };
  }
  if (key === 'wind_burst') {
    return {
      method: 'Bóvedas Ominosas (Cámaras de Prueba)',
      avgRerolls: null,
      avgFullMenuRerolls: null,
      noviceProbText: '0% (No sale en aldeanos)',
      fullMenuProbText: '~5.5% por Llave de Prueba Ominosa',
      detail: 'Usa una Llave de Prueba Ominosa en las bóvedas oscuras de las Trial Chambers (cae como Nv. I y se combina).'
    };
  }

  const totalPool = edition === 'java' ? 37 : 30;
  const slotHasBookProb = 2 / 3;
  const pSingle = slotHasBookProb * (1 / totalPool) * (1 / ench.maxLvl);
  const avgRerolls = Math.max(1, Math.round(1 / pSingle));
  const pPerBook = (1 / totalPool) * (1 / ench.maxLvl);
  const pFull = 1 - Math.pow(1 - (2 / 3) * pPerBook, 3) * (1 - 0.5 * pPerBook);
  const avgFullMenuRerolls = Math.max(1, Math.round(1 / pFull));

  return {
    method: 'Aldeano Bibliotecario (Atril)',
    avgRerolls,
    avgFullMenuRerolls,
    pSingle,
    pFull,
    noviceProbText: `${(pSingle * 100).toFixed(2)}% (1 cada ~${avgRerolls} intentos)`,
    fullMenuProbText: `${(pFull * 100).toFixed(2)}% (1 cada ~${avgFullMenuRerolls} aldeanos)`,
    detail:
      ench.maxLvl === 5 && lvl === 5
        ? `Consejo: Si te sale ${ench.name} IV (misma probabilidad: ~${avgRerolls} int. en atril o ~${avgFullMenuRerolls} aldeanos viendo 4 niveles), puedes juntar 2 libros de Nv. IV.`
        : `Rompiendo y poniendo el Atril tomará ~${avgRerolls} intentos en promedio; si puedes ver los 4 niveles sin tradear, baja a ~${avgFullMenuRerolls} aldeanos.`
  };
}

/**
 * Determina qué encantamientos aporta un aldeano de equipamiento para un ítem dado.
 */
function getVillagerPreApplied(item, selectedEnchants) {
  const preApplied = new Set();
  if (selectedEnchants.unbreaking && selectedEnchants.unbreaking <= 3) preApplied.add('unbreaking');
  if (item.id === 'boots' && selectedEnchants.feather_falling && selectedEnchants.feather_falling <= 4) preApplied.add('feather_falling');
  if (item.id === 'helmet' && selectedEnchants.aqua_affinity) preApplied.add('aqua_affinity');
  if ((item.id === 'pickaxe' || item.id === 'shovel' || item.id === 'axe') && selectedEnchants.silk_touch) preApplied.add('silk_touch');
  if (item.id === 'sword' && selectedEnchants.knockback && selectedEnchants.knockback <= 2) preApplied.add('knockback');
  return preApplied;
}

/**
 * Evalúa las 3 rutas candidatas (clean, villager, gold) y elige el camino más corto.
 */
export function evaluateBestStrategy({ item, mat, hasVillagerForMat, selectedEnchants, edition, goldStats }) {
  const activeKeys = Object.keys(selectedEnchants);
  const candidates = ['clean'];
  if (hasVillagerForMat) candidates.push('villager');
  if (item.hasEnchantTable) candidates.push('gold');

  const evaluations = {};

  for (const strat of candidates) {
    let preApplied = new Set();
    const partialFromTable = {};

    if (strat === 'villager') {
      preApplied = getVillagerPreApplied(item, selectedEnchants);
    } else if (strat === 'gold' && goldStats && goldStats.supported) {
      goldStats.fullCoveredKeys.forEach(k => preApplied.add(k));
      Object.assign(partialFromTable, goldStats.partialCoveredMap);
    }

    const books = activeKeys.filter(k => !preApplied.has(k));
    const nodes = [{ isTargetItem: true, bookValue: 0, label: item.name, shortName: item.name }];
    let totalRerolls = 0;

    books.forEach(k => {
      const finalLvl = selectedEnchants[k];
      const bookLvl = partialFromTable[k] ? partialFromTable[k] : finalLvl;
      nodes.push({
        isTargetItem: false,
        bookValue: finalLvl * ENCHANTMENTS[k].bookMult,
        label: k,
        shortName: k
      });
      const st = getEnchantRerollStats(k, bookLvl, edition);
      if (st.avgRerolls) totalRerolls += st.avgRerolls;
    });

    const anvil = solveOptimalAnvilTree(nodes);
    evaluations[strat] = {
      strat,
      preApplied,
      partialFromTable,
      booksCount: books.length,
      totalLevels: anvil.totalLevels,
      maxStepCost: anvil.maxStepCost,
      totalRerolls,
      viable: anvil.maxStepCost <= 39
    };
  }

  let recommended = 'clean';
  let reason = '';

  if (activeKeys.length === 0) {
    recommended = 'clean';
    reason =
      'Selecciona primero los encantamientos que deseas en la Etapa 2 para calcular automáticamente si te conviene partir de un objeto limpio, comprarlo a un aldeano o encantarlo en Mesa Nv. 30.';
  } else {
    const cleanEv = evaluations.clean;
    const villEv = evaluations.villager;
    const goldEv = evaluations.gold;
    const goldCoveredTotal = goldEv
      ? goldEv.preApplied.size + Object.keys(goldEv.partialFromTable).length
      : 0;

    const goldSavesBlock = Boolean(goldEv && !cleanEv.viable && goldEv.viable);
    const goldPractical = Boolean(
      goldStats && goldStats.supported && goldStats.goldRerollsFull && goldStats.goldRerollsFull <= 45
    );
    const goldBigSavings = Boolean(
      goldEv &&
        goldPractical &&
        (goldEv.preApplied.size >= 2 ||
          (goldCoveredTotal >= 2 && (cleanEv.totalLevels - goldEv.totalLevels >= 6 || activeKeys.length >= 4)))
    );
    const villUseful = Boolean(villEv && villEv.preApplied.size >= 1);

    if (goldSavesBlock) {
      recommended = 'gold';
      const comboDesc = goldStats.comboTargets
        .map(t => `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}`)
        .join(' + ');
      reason = `<strong>Por qué es el camino más corto:</strong> Con ${activeKeys.length} encantamientos, meter todos por libro desde limpio superaría los 39 niveles en yunque (${cleanEv.maxStepCost} Niv.). Usando la <strong>Mesa Nv. 30 + Truco del Oro</strong> (<strong>~${goldStats.goldRerollsFull} re-rolls con pala de oro</strong>) sacas <strong>${comboDesc}</strong> directamente, bajando el yunque a <strong>${goldEv.totalLevels} Niveles</strong>.`;
    } else if (villUseful && (!goldBigSavings || villEv.preApplied.size >= 2)) {
      recommended = 'villager';
      const savedNames = [...villEv.preApplied]
        .map(k => `${ENCHANTMENTS[k].name} ${ROMAN[selectedEnchants[k]]}`)
        .join(' + ');
      reason = `<strong>Por qué es el camino más corto:</strong> El aldeano correspondiente ya te entrega la pieza con <strong>${savedNames}</strong> de fábrica. Así evitas la aleatoriedad e incompatibilidades de la Mesa de Encantamientos, ahorras <strong>${villEv.preApplied.size} ${villEv.preApplied.size === 1 ? 'libro' : 'libros'}</strong> (~${Math.max(0, cleanEv.totalRerolls - villEv.totalRerolls)} intentos menos de atril) y dejas el yunque en solo <strong>${villEv.totalLevels} Niveles</strong>.`;
    } else if (goldBigSavings) {
      recommended = 'gold';
      const comboDesc = goldStats.comboTargets
        .map(t => `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}`)
        .join(' + ');
      const partialCount = Object.keys(goldEv.partialFromTable).length;
      reason = `<strong>Por qué es el camino más corto:</strong> Usando la <strong>Mesa de Encantamientos Nv. 30 con el Truco del Oro</strong> necesitarás aproximadamente <strong>~${goldStats.goldRerollsFull} re-rolls con pala de oro</strong> (~${goldStats.lapisFull} lapislázuli) para conseguir <strong>${comboDesc}</strong> en una sola tirada${partialCount > 0 ? ' (y solo sumas 1 libro de nivel IV para subir a V)' : ''}. Esto reduce el yunque de ${cleanEv.totalLevels} a <strong>${goldEv.totalLevels} Niveles</strong> y te ahorra ~${Math.max(0, cleanEv.totalRerolls - goldEv.totalRerolls)} intentos de atril en bibliotecarios.`;
    } else {
      recommended = 'clean';
      const noVillNote = !hasVillagerForMat
        ? 'este objeto/material no se vende encantado en aldeanos'
        : 'ninguno de los encantamientos elegidos sale al nivel máximo en aldeanos de equipo';
      const noTableNote = !item.hasEnchantTable
        ? ' y no admite mesa de encantamientos'
        : ' y en la mesa aleatoria podrías sacar encantamientos incompatibles o requerir demasiados re-rolls';
      reason = `<strong>Por qué es el camino más corto:</strong> Como ${noVillNote}${noTableNote}, partir de un <strong>objeto limpio</strong> y aplicar únicamente los ${cleanEv.booksCount} libros exactos en árbol binario es la ruta más directa (<strong>${cleanEv.totalLevels} Niveles</strong>, sin perder tiempo ni XP limpiando encantamientos basura en la afiladora).`;
    }
  }

  return { recommended, reason, evaluations };
}

/**
 * Calcula el plan completo (mesa, rutas, libros, re-rolls y árbol óptimo del yunque).
 */
export function computeFullPlan({ itemId, materialId, edition, selectedEnchants, manualStrategy }) {
  const item = getItemById(itemId);
  const mat = getMaterialForItem(item, materialId);
  const displayName = getDisplayItemName(item, mat);
  const hasVillagerForMat = itemHasVillagerForMaterial(item, mat);
  const activeKeys = Object.keys(selectedEnchants);

  const goldStats = analyzeEnchantingTable(item, mat, selectedEnchants, edition);

  // Vista previa Etapa 1 (con godRoll del ítem)
  const godRollMap = { ...item.godRoll };
  if (edition === 'bedrock' && godRollMap.sweeping_edge) delete godRollMap.sweeping_edge;
  const stage1GoldStats = analyzeEnchantingTable(item, mat, godRollMap, edition);

  const evaluation = evaluateBestStrategy({
    item,
    mat,
    hasVillagerForMat,
    selectedEnchants,
    edition,
    goldStats
  });

  // Validar estrategia manual contra disponibilidad real
  let strategy = manualStrategy || evaluation.recommended;
  if (strategy === 'villager' && !hasVillagerForMat) strategy = evaluation.recommended;
  if (strategy === 'gold' && !item.hasEnchantTable) strategy = evaluation.recommended;

  const preApplied = new Set();
  const partialFromTable = {};
  let baseSourceTag = 'Limpio';

  if (strategy === 'villager' && hasVillagerForMat) {
    for (const k of getVillagerPreApplied(item, selectedEnchants)) preApplied.add(k);
    const matPrefix = mat && mat.id === 'netherite' ? 'Aldeano (Diamante → Netherita)' : 'Aldeano';
    baseSourceTag =
      preApplied.size > 0
        ? `${matPrefix} con ${[...preApplied].map(k => `${ENCHANTMENTS[k].name} ${ROMAN[selectedEnchants[k]]}`).join(' + ')}`
        : matPrefix;
  } else if (strategy === 'gold' && item.hasEnchantTable && goldStats.supported) {
    goldStats.fullCoveredKeys.forEach(k => preApplied.add(k));
    Object.assign(partialFromTable, goldStats.partialCoveredMap);
    const comboLabels = goldStats.comboTargets.map(t => `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}`);
    baseSourceTag =
      comboLabels.length > 0 ? `Mesa Nv.30 (Oro) con ${comboLabels.join(' + ')}` : 'Mesa Nv.30';
  }

  const bookEntries = activeKeys
    .filter(k => !preApplied.has(k))
    .map(k => {
      const finalLvl = selectedEnchants[k];
      const isUpgradeFromTable = Boolean(partialFromTable[k]);
      const bookLvl = isUpgradeFromTable ? partialFromTable[k] : finalLvl;
      const stats = getEnchantRerollStats(k, bookLvl, edition);
      return { key: k, bookLvl, finalLvl, isUpgradeFromTable, stats };
    });

  const nodes = [
    {
      isTargetItem: true,
      bookValue: 0,
      label: `${displayName} (${baseSourceTag})`,
      shortName: displayName,
      enchants: [...preApplied].map(k => `${ENCHANTMENTS[k].name} ${ROMAN[selectedEnchants[k]]}`)
    }
  ];

  bookEntries.forEach(b => {
    const ench = ENCHANTMENTS[b.key];
    const shortTag = `${ench.name} ${ROMAN[b.bookLvl]}${b.isUpgradeFromTable ? ` → ${ROMAN[b.finalLvl]}` : ''}`;
    nodes.push({
      isTargetItem: false,
      bookValue: b.finalLvl * ench.bookMult,
      label: `Libro: ${shortTag}`,
      shortName: shortTag,
      enchants: [shortTag]
    });
  });

  const optimalResult = solveOptimalAnvilTree(nodes);
  const naiveResult = solveLinearNaive(nodes);
  const savings = Math.max(0, naiveResult.totalLevels - optimalResult.totalLevels);

  return {
    item,
    mat,
    displayName,
    edition,
    hasVillagerForMat,
    activeKeys,
    goldStats,
    stage1GoldStats,
    recommended: evaluation.recommended,
    reason: evaluation.reason,
    evaluations: evaluation.evaluations,
    strategy,
    isUsingRecommended: strategy === evaluation.recommended,
    preApplied,
    partialFromTable,
    baseSourceTag,
    bookEntries,
    nodes,
    optimalResult,
    naiveResult,
    savings
  };
}
