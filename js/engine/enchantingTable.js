// =============================================================================
// MOTOR MATEMÁTICO EXACTO DE LA MESA DE ENCANTAMIENTOS NV. 30 (VANILLA 1.21+)
// Calcula distribución del nivel modificado, pesos, conflictos y Truco del Oro
// =============================================================================

import { ENCHANTMENTS } from '../data/catalog.js';
import {
  TABLE_PRIMARY_ENCHANTS,
  TABLE_ENCHANT_RULES,
  TREASURE_ENCHANTS
} from '../data/tableRules.js';

const enchantTableCache = new Map();

/**
 * Reglas exactas de incompatibilidad mutua entre dos encantamientos en un ítem.
 */
export function areEnchantsIncompatible(itemId, keyA, keyB) {
  if (keyA === keyB) return false;
  const enchA = ENCHANTMENTS[keyA];
  const enchB = ENCHANTMENTS[keyB];
  if (!enchA || !enchB) return false;

  if (enchA.group && enchB.group && enchA.group === enchB.group) {
    return true;
  }
  // Arco: Infinidad vs Reparación
  if (itemId === 'bow') {
    if ((keyA === 'infinity' && keyB === 'mending') || (keyA === 'mending' && keyB === 'infinity')) {
      return true;
    }
  }
  // Tridente: Propulsión Acuática incompatible con Lealtad Y Canalización
  if (itemId === 'trident') {
    if ((keyA === 'riptide' && keyB === 'channeling') || (keyA === 'channeling' && keyB === 'riptide')) {
      return true;
    }
  }
  // Maza: Densidad, Fisura, Castigo y Perdición de los Artrópodos son todos excluyentes entre sí
  if (itemId === 'mace') {
    const maceDmgSet = new Set(['density', 'breach', 'smite', 'bane_arthropods']);
    if (maceDmgSet.has(keyA) && maceDmgSet.has(keyB)) {
      return true;
    }
  }
  return false;
}

/**
 * CDF exacta de Z = U1 + U2 - 1 en [-1, 1] (distribución triangular del bono ±15%).
 */
export function triangularCdf(z) {
  if (z <= -1) return 0;
  if (z >= 1) return 1;
  if (z <= 0) return 0.5 * (z + 1) * (z + 1);
  return 1 - 0.5 * (1 - z) * (1 - z);
}

/**
 * Genera y cachea todas las salidas exactas posibles en Mesa Nv. 30 para (item, E, edition).
 */
export function getRawTableOutcomes(item, enchantability, edition) {
  const cacheKey = `${item.id}_${enchantability}_${edition}`;
  if (enchantTableCache.has(cacheKey)) return enchantTableCache.get(cacheKey);

  const primaryKeys = (TABLE_PRIMARY_ENCHANTS[item.id] || []).filter(
    k => !(k === 'sweeping_edge' && edition === 'bedrock')
  );

  const baseLvl = 30;
  const halfE = Math.floor(enchantability / 4);
  const countR = halfE + 1;
  const modDist = new Map();

  for (let r1 = 0; r1 <= halfE; r1++) {
    for (let r2 = 0; r2 <= halfE; r2++) {
      const k = baseLvl + 1 + r1 + r2;
      const pairProb = 1 / (countR * countR);
      const mMin = Math.max(1, Math.floor(k * 0.85));
      const mMax = Math.ceil(k * 1.15);

      for (let m = mMin; m <= mMax; m++) {
        const zLow = ((m - 0.5) / k - 1) / 0.15;
        const zHigh = ((m + 0.5) / k - 1) / 0.15;
        const p = pairProb * Math.max(0, triangularCdf(zHigh) - triangularCdf(zLow));
        if (p > 1e-9) {
          modDist.set(m, (modDist.get(m) || 0) + p);
        }
      }
    }
  }

  let minMod = 999;
  let maxMod = 0;
  for (const m of modDist.keys()) {
    if (m < minMod) minMod = m;
    if (m > maxMod) maxMod = m;
  }

  const outcomeMap = new Map();
  const maxReachableByKey = {};

  function recordLeaf(drawn, prob) {
    const sorted = [...drawn].sort((a, b) => a.key.localeCompare(b.key));
    const sig = sorted.map(e => `${e.key}:${e.level}`).join('|');
    let entry = outcomeMap.get(sig);
    if (!entry) {
      const enchants = {};
      const keys = [];
      for (const e of sorted) {
        enchants[e.key] = e.level;
        keys.push(e.key);
        if (!maxReachableByKey[e.key] || e.level > maxReachableByKey[e.key]) {
          maxReachableByKey[e.key] = e.level;
        }
      }
      entry = { enchants, keys, prob: 0 };
      outcomeMap.set(sig, entry);
    }
    entry.prob += prob;
  }

  function explore(remPool, drawn, curM, prob) {
    if (prob < 1e-9) return;
    const pCont = remPool.length > 0 && drawn.length < 5 ? Math.min(1, (curM + 1) / 50) : 0;
    const stopProb = prob * (1 - pCont);
    if (stopProb > 0) recordLeaf(drawn, stopProb);

    if (pCont > 0) {
      let totalW = 0;
      for (const e of remPool) totalW += e.weight;
      const nextM = Math.floor(curM / 2);

      for (const e of remPool) {
        const nextRem = remPool.filter(
          x => x.key !== e.key && !areEnchantsIncompatible(item.id, e.key, x.key)
        );
        explore(nextRem, [...drawn, e], nextM, prob * pCont * (e.weight / totalW));
      }
    }
  }

  for (const [m, mProb] of modDist.entries()) {
    const pool = [];
    for (const key of primaryKeys) {
      const rule = TABLE_ENCHANT_RULES[key];
      const ench = ENCHANTMENTS[key];
      if (!rule || !ench) continue;
      for (let l = ench.maxLvl; l >= 1; l--) {
        if (m >= rule.min(l) && m <= rule.max(l)) {
          pool.push({ key, level: l, weight: rule.weight });
          break;
        }
      }
    }
    if (pool.length === 0) continue;

    let totalW = 0;
    for (const e of pool) totalW += e.weight;
    for (const e of pool) {
      const nextRem = pool.filter(
        x => x.key !== e.key && !areEnchantsIncompatible(item.id, e.key, x.key)
      );
      explore(nextRem, [e], m, mProb * (e.weight / totalW));
    }
  }

  const result = {
    enchantability,
    minMod,
    maxMod,
    primaryKeys,
    maxReachableByKey,
    outcomes: [...outcomeMap.values()]
  };
  enchantTableCache.set(cacheKey, result);
  return result;
}

/**
 * Analiza Mesa Nv. 30 + Truco del Oro para (item, mat, targetMap, edition).
 */
export function analyzeEnchantingTable(item, mat, targetMap, edition = 'java') {
  const E = mat ? (item.isArmor ? mat.enchArmor : mat.enchTool) : (item.enchantability || 0);
  if (!item.hasEnchantTable || E <= 0) {
    return { supported: false, enchantability: E, perEnchant: [], comboTargets: [] };
  }

  const raw = getRawTableOutcomes(item, E, edition);
  const targetKeys = Object.keys(targetMap || {});
  const perEnchant = [];
  const reachableTargets = [];

  for (const key of targetKeys) {
    const desiredLvl = targetMap[key];
    const isPrimary = raw.primaryKeys.includes(key);
    const maxReachable = raw.maxReachableByKey[key] || 0;

    if (!isPrimary || maxReachable === 0) {
      const isTreasure = TREASURE_ENCHANTS.has(key);
      const isMaterialCap = isPrimary && maxReachable === 0;
      perEnchant.push({
        key,
        desiredLvl,
        maxReachable: 0,
        tableTargetLvl: 0,
        practicalLvl: 0,
        status: 'impossible',
        reason: isTreasure
          ? 'Tesoro / Maldición (0% en Mesa)'
          : isMaterialCap
            ? `Requiere Nv. mod. > ${raw.maxMod} (0% en este material)`
            : 'Secundario (Solo por libro en Yunque)',
        probExact: 0,
        probTableTarget: 0,
        probPractical: 0,
        probClue: 0,
        avgRerolls: null
      });
      continue;
    }

    const tableTargetLvl = Math.min(desiredLvl, maxReachable);
    let probExact = 0;
    let probTableTarget = 0;
    let probClue = 0;

    for (const o of raw.outcomes) {
      const rolled = o.enchants[key] || 0;
      if (rolled >= desiredLvl) probExact += o.prob;
      if (rolled >= tableTargetLvl) {
        probTableTarget += o.prob;
        probClue += o.prob / o.keys.length;
      }
    }

    let practicalLvl = tableTargetLvl;
    let probPractical = probTableTarget;
    if (desiredLvl === maxReachable && probExact < 0.025 && desiredLvl > 1) {
      practicalLvl = desiredLvl - 1;
      probPractical = 0;
      for (const o of raw.outcomes) {
        if ((o.enchants[key] || 0) >= practicalLvl) probPractical += o.prob;
      }
    }

    const status = maxReachable >= desiredLvl ? 'full' : 'partial';
    const info = {
      key,
      desiredLvl,
      maxReachable,
      tableTargetLvl,
      practicalLvl,
      status,
      reason:
        status === 'full'
          ? probExact < 0.025
            ? `Alcanzable en techo (${raw.maxMod}), pero muy raro (${(probExact * 100).toFixed(1)}%). Acepta Nv. ${practicalLvl} + libro.`
            : 'Alcanzable al máximo en Mesa Nv. 30'
          : `Techo del material (${raw.maxMod}): máx. Nv. ${maxReachable} en mesa (+1 libro Nv. ${maxReachable} → Nv. ${desiredLvl})`,
      probExact,
      probTableTarget,
      probPractical,
      probClue,
      avgRerolls: probTableTarget > 0 ? Math.max(1, Math.round(1 / probTableTarget)) : null
    };
    perEnchant.push(info);
    reachableTargets.push(info);
  }

  const comboTargets = [...reachableTargets]
    .sort((a, b) => b.probPractical - a.probPractical)
    .slice(0, 3);

  let probComboFull = 0;
  let probComboAtLeast2 = 0;
  let probAnyTargetClue = 0;

  if (comboTargets.length > 0) {
    for (const o of raw.outcomes) {
      let hasConflict = false;
      for (const rolledKey of o.keys) {
        if (targetMap[rolledKey]) continue;
        for (const tKey of targetKeys) {
          if (areEnchantsIncompatible(item.id, rolledKey, tKey)) {
            hasConflict = true;
            break;
          }
        }
        if (hasConflict) break;
      }
      if (hasConflict) continue;

      let matchedCount = 0;
      let matchedClues = 0;
      for (const t of comboTargets) {
        if ((o.enchants[t.key] || 0) >= t.practicalLvl) {
          matchedCount++;
          matchedClues++;
        }
      }

      if (matchedCount === comboTargets.length) probComboFull += o.prob;
      if (matchedCount >= Math.min(2, comboTargets.length)) probComboAtLeast2 += o.prob;
      if (matchedClues > 0) probAnyTargetClue += o.prob * (matchedClues / o.keys.length);
    }
  }

  const goldRerollsFull = probComboFull > 0 ? Math.max(1, Math.round(1 / probComboFull)) : null;
  const goldRerolls2 = probComboAtLeast2 > 0 ? Math.max(1, Math.round(1 / probComboAtLeast2)) : null;
  const lapisFull = goldRerollsFull ? goldRerollsFull - 1 + 3 : null;
  const netXpFull = goldRerollsFull ? Math.max(3, Math.round((goldRerollsFull - 1) * 0.65) + 3) : null;

  const fullCoveredKeys = comboTargets
    .filter(t => t.practicalLvl >= t.desiredLvl)
    .map(t => t.key);
  const partialCoveredMap = {};
  comboTargets
    .filter(t => t.practicalLvl < t.desiredLvl)
    .forEach(t => {
      partialCoveredMap[t.key] = t.practicalLvl;
    });

  return {
    supported: true,
    enchantability: E,
    minMod: raw.minMod,
    maxMod: raw.maxMod,
    perEnchant,
    reachableTargets,
    comboTargets,
    fullCoveredKeys,
    partialCoveredMap,
    probComboFull,
    probComboAtLeast2,
    probAnyTargetClue,
    goldRerollsFull,
    goldRerolls2,
    lapisFull,
    netXpFull
  };
}
