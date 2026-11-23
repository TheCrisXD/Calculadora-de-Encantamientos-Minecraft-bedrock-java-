// =============================================================================
// INSPECTORES CONTEXTUALES DESPLEGABLES (ENCANTAMIENTOS, ALDEANOS Y YUNQUE)
// + DIÁLOGOS DINÁMICOS DE ACTORES PIXEL-ART AL HACER CLIC
// =============================================================================

import { ENCHANTMENTS, ROMAN } from '../data/catalog.js';
import { areEnchantsIncompatible } from '../engine/enchantingTable.js';
import { getEnchantRerollStats } from '../engine/strategy.js';

/**
 * Panel desplegable contextual para cualquier encantamiento en la Etapa 2.
 */
export function renderEnchantInspector(plan, key, currentLvl, conflictReason) {
  const ench = ENCHANTMENTS[key];
  if (!ench) return '';

  // Encontrar TODOS los encantamientos de este ítem incompatibles con `key`
  const incompatibleNames = plan.item.allowed
    .filter(other => other !== key && areEnchantsIncompatible(plan.item.id, key, other))
    .map(other => ENCHANTMENTS[other].name);

  const reroll = getEnchantRerollStats(key, currentLvl, plan.edition);
  const tableEntry = plan.goldStats.supported
    ? plan.goldStats.perEnchant.find(e => e.key === key)
    : null;

  let tableLine = 'Este objeto no admite Mesa de Encantamientos.';
  if (plan.goldStats.supported) {
    if (tableEntry) {
      if (tableEntry.status === 'impossible') {
        tableLine = `0% en Mesa Nv. 30 (${tableEntry.reason}).`;
      } else if (tableEntry.status === 'partial') {
        tableLine = `Máx. Nv. ${ROMAN[tableEntry.maxReachable]} en Mesa (${(tableEntry.probTableTarget * 100).toFixed(1)}%, ~${tableEntry.avgRerolls} intentos). Sube a ${ROMAN[currentLvl]} con +1 libro.`;
      } else {
        tableLine = `Posible Nv. ${ROMAN[currentLvl]} directo en Mesa (${(tableEntry.probExact * 100).toFixed(1)}%, pista visible ${(tableEntry.probClue * 100).toFixed(1)}%).`;
      }
    } else {
      tableLine = `Actívalo para ver su probabilidad exacta en Mesa Nv. 30 para ${plan.displayName}.`;
    }
  }

  const anvilCost = currentLvl * ench.bookMult;

  return `
    <div class="mc-inspector mc-inspector-body" id="inspector-ench-${key}">
      <div class="flex-between">
        <span class="font-pixel text-xs text-light-gold">🔍 Inspector: ${ench.name} ${ROMAN[currentLvl]} en ${plan.displayName}</span>
        <span class="mc-badge mc-badge--xp">Valor libro yunque: ${currentLvl} × ${ench.bookMult} = +${anvilCost} Niv.</span>
      </div>
      <div class="mc-inspector-grid">
        <div class="mc-inspector-cell">
          <strong>Incompatibilidades en ${plan.item.name}</strong>
          <span>${
            incompatibleNames.length > 0
              ? `Excluyente con: ${incompatibleNames.join(', ')}.${conflictReason ? ` (Actualmente bloqueado: ${conflictReason})` : ''}`
              : 'Sin conflictos: compatible con todos los demás encantamientos de este objeto.'
          }</span>
        </div>
        <div class="mc-inspector-cell">
          <strong>Java vs Bedrock (${plan.edition === 'java' ? 'Viendo Java' : 'Viendo Bedrock'})</strong>
          <span>${ench.javaVsBedrock}</span>
        </div>
        <div class="mc-inspector-cell">
          <strong>Probabilidad en Bibliotecario / Fuente</strong>
          <span>${reroll.method}: ${reroll.noviceProbText} · 4 ranuras: ${reroll.fullMenuProbText}</span>
        </div>
        <div class="mc-inspector-cell">
          <strong>Comportamiento en Mesa Nv. 30 (${plan.mat ? plan.mat.name : plan.item.name})</strong>
          <span>${tableLine}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Panel desplegable contextual para cualquier paso del Yunque en la Etapa 4.
 */
export function renderAnvilStepInspector(step, idx, plan) {
  const swapAnalysis =
    step.swappedCost !== null
      ? step.swappedCost > step.cost
        ? `Si invirtieras las ranuras (poner <em>${step.left}</em> a la derecha), pagarías <strong>${step.swappedCost} Niv.</strong> en lugar de <strong>${step.cost} Niv.</strong> (ahorras <strong>${step.swappedCost - step.cost} Niv.</strong> manteniendo el libro más caro a la izquierda).`
        : `Ambos libros tienen el mismo coste de encantamiento (${step.enchValue} Niv.), por lo que el orden Izq/Der cuesta lo mismo (${step.cost} Niv.).`
      : `Tu <strong>${plan.displayName}</strong> debe ir SIEMPRE en la <strong>1ª ranura (Izquierda)</strong>; un libro jamás puede ir a la izquierda de un equipamiento.`;

  return `
    <div class="mc-inspector mc-inspector-body" id="inspector-step-${idx}">
      <div class="flex-between">
        <span class="font-pixel text-xs text-light-gold">⚒️ Desglose Matemático — Paso ${idx + 1}</span>
        <span class="mc-badge mc-badge--xp">~${step.xpPoints.toLocaleString()} pts XP reales</span>
      </div>
      <div class="mc-inspector-grid">
        <div class="mc-inspector-cell">
          <strong>Fórmula exacta del Yunque</strong>
          <span class="font-mono">
            Valor derecha (+${step.enchValue}) + PWP Izq (${step.leftWork} uso${step.leftWork === 1 ? '' : 's'} → +${step.leftPwp}) + PWP Der (${step.rightWork} uso${step.rightWork === 1 ? '' : 's'} → +${step.rightPwp}) = <strong>${step.cost} Niv.</strong>
          </span>
        </div>
        <div class="mc-inspector-cell">
          <strong>¿Por qué este orden Izquierda / Derecha?</strong>
          <span>${swapAnalysis}</span>
        </div>
        <div class="mc-inspector-cell">
          <strong>Encantamientos que lleva el resultado</strong>
          <span>${step.resultEnchants.length > 0 ? step.resultEnchants.join(' + ') : 'Base sin encantamientos previos'}</span>
        </div>
        <div class="mc-inspector-cell">
          <strong>Nuevo contador de trabajos (WorkCount)</strong>
          <span>max(${step.leftWork}, ${step.rightWork}) + 1 = <strong>${step.resultWork} ${step.resultWork === 1 ? 'uso' : 'usos'}</strong> (próximo recargo base: +${(1 << step.resultWork) - 1} Niv.)</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Panel desplegable contextual para cada Aldeano en la Pestaña 2.
 */
export function renderVillagerInspector(v, plan) {
  const isRelevant = v.relatedItems.includes('ALL') || v.relatedItems.includes(plan.item.id);
  const relevanceMsg = isRelevant
    ? `✔ Relevante para tu selección actual (<strong>${plan.displayName}</strong> en ${plan.edition === 'java' ? 'Java' : 'Bedrock'}).`
    : `Este aldeano no comercia directamente con ${plan.displayName}, pero sigue siendo útil para otras piezas de tu equipo.`;

  return `
    <div class="mc-inspector mc-inspector-body" id="inspector-villager-${v.id}">
      <div class="flex-between">
        <span class="font-pixel text-xs text-light-gold">🧑‍🌾 Ficha táctica: ${v.prof} (${v.station})</span>
        <span class="mc-badge ${isRelevant ? 'mc-badge--emerald' : 'mc-badge--dark'}">${isRelevant ? 'ÚTIL PARA TU ÍTEM' : 'OTRO EQUIPAMIENTO'}</span>
      </div>
      <div class="mc-inspector-grid">
        <div class="mc-inspector-cell">
          <strong>Relación con tu selección</strong>
          <span>${relevanceMsg}</span>
        </div>
        <div class="mc-inspector-cell">
          <strong>Diferencia Java vs Bedrock</strong>
          <span>${v.javaVsBedrock}</span>
        </div>
        <div class="mc-inspector-cell" style="grid-column: 1 / -1;">
          <strong>Estrategia recomendada</strong>
          <span>${v.strategy}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Mensaje contextual dinámico al hacer clic en cualquier actor pixel-art 32x32.
 */
export function getActorSpeech(actorKey, plan) {
  switch (actorKey) {
    case 'librarian': {
      const libCount = plan.bookEntries.filter(
        b => !['soul_speed', 'swift_sneak', 'wind_burst'].includes(b.key)
      ).length;
      return `<strong>Bibliotecario:</strong> "¡Hrmm! Para tu ${plan.displayName} en ${plan.edition === 'java' ? 'Java' : 'Bedrock'} necesitas <strong>${libCount} ${libCount === 1 ? 'libro' : 'libros'}</strong> de mi Atril. ¡No me comercies hasta ver el encantamiento exacto que buscas!"`;
    }
    case 'armorer':
    case 'weaponsmith':
    case 'toolsmith':
    case 'fletcher':
    case 'fisherman': {
      const probTxt = plan.edition === 'java' ? '100% en ranura Maestro (Java)' : '50% por ranura (Bedrock)';
      return `<strong>Aldeano de Equipo:</strong> "¡Hrmm! Vendo piezas pre-encantadas simulando nivel 5–19 (${probTxt}). Para tu <strong>${plan.displayName}</strong> puedo ahorrarte <strong>${plan.preApplied.size} libro(s)</strong> si eliges Ruta B."`;
    }
    case 'cleric':
      return `<strong>Clérigo:</strong> "¡Hrmm! Trae esmeraldas: te vendo <strong>Lapislázuli</strong> para el Truco del Oro y <strong>Frascos de Experiencia</strong> para pagar tus ${plan.optimalResult.totalLevels} niveles de Yunque."`;
    case 'enchant_table': {
      if (plan.goldStats.supported && plan.goldStats.goldRerollsFull) {
        return `<strong>Mesa de Encantamientos Nv. 30:</strong> "Con 15 librerías tu ${plan.displayName} alcanza Nivel Modificado <strong>${plan.goldStats.minMod}–${plan.goldStats.maxMod}</strong>. ¡Calculo ~<strong>${plan.goldStats.goldRerollsFull} re-rolls con pala de oro</strong> para tu combo!"`;
      }
      return `<strong>Mesa de Encantamientos:</strong> "Necesito 15 librerías a 1 bloque de aire y 3 de Lapislázuli para alcanzar el Nivel 30."`;
    }
    case 'anvil_32':
      return `<strong>Yunque:</strong> "¡CLANK! Tu ruta óptima suma <strong>${plan.optimalResult.totalLevels} niveles</strong> en <strong>${plan.optimalResult.steps.length} paso(s)</strong> (pico máx: ${plan.optimalResult.maxStepCost}/39). Haz clic en cada paso para ver el desglose exacto."`;
    case 'end_ship':
      return `<strong>Barco del End:</strong> "Los Élitros solo aparecen en el marco del Barco del End. Encántalos en Yunque con Irrompibilidad III + Reparación (solo 2 pasos)."`;
    case 'drowned':
      return `<strong>Ahogado (Drowned):</strong> "Suelto Tridentes al derrotarme en océanos y ríos. Recuerda: Propulsión Acuática no se puede mezclar con Lealtad ni Canalización."`;
    default:
      return `<strong>Guía Minecraft:</strong> "Configuración activa: ${plan.displayName} (${plan.activeKeys.length} encantamientos)."`;
  }
}
