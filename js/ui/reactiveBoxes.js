// =============================================================================
// RECUADROS DE INFORMACIÓN 100% REACTIVOS (RESUMEN VIVO, CONSEJOS Y TEORÍA)
// Reaccionan en vivo a cada clic, objeto, material, edición y ruta elegida
// =============================================================================

import { ENCHANTMENTS, ROMAN } from '../data/catalog.js';
import { STRUCTURE_ONLY_ENCHANTS } from '../data/tableRules.js';
import { renderItemIcon } from '../pixelart/icons.js';
import { pwpCost } from '../engine/anvilDp.js';

const ROUTE_SHORT_LABELS = {
  clean: 'Ruta A · Limpio',
  villager: 'Ruta B · Aldeano',
  gold: 'Ruta C · Mesa Oro'
};

export function renderLiveSummaryStrip(plan) {
  const iconEl = document.getElementById('live-strip-icon');
  const nameEl = document.getElementById('live-strip-name');
  const metaEl = document.getElementById('live-strip-meta');
  const kpisEl = document.getElementById('live-strip-kpis');
  if (!iconEl || !nameEl || !metaEl || !kpisEl) return;

  const isEnchanted = plan.activeKeys.length > 0;
  iconEl.className = `mc-live-slot-mini ${isEnchanted ? 'mc-slot-enchanted' : 'mc-slot'} mc-slot-interactive`;
  iconEl.innerHTML = renderItemIcon(plan.item.icon, {
    materialId: plan.mat ? plan.mat.id : 'diamond',
    enchanted: isEnchanted,
    sizeClass: 'px-icon-xs'
  });

  nameEl.textContent = plan.displayName;
  metaEl.innerHTML = `
    <span>${plan.edition === 'java' ? 'Java' : 'Bedrock'}</span>
    <span>·</span>
    <span>${plan.activeKeys.length} encant.</span>
    <span>·</span>
    <span>${ROUTE_SHORT_LABELS[plan.strategy]}</span>
  `;

  const maxCost = plan.optimalResult.maxStepCost;
  const statusPill =
    maxCost > 39
      ? `<span class="mc-live-pill mc-live-pill--warn">⚠ Pico ${maxCost}/39</span>`
      : `<span class="mc-live-pill mc-live-pill--ok">✔ Pico ${maxCost}/39</span>`;

  kpisEl.innerHTML = `
    <span class="mc-live-pill mc-live-pill--xp">Yunque: ${plan.optimalResult.totalLevels} Niv.</span>
    ${statusPill}
    <span class="mc-live-pill">Libros: ${plan.bookEntries.length}</span>
  `;
}

export function renderItemOriginBox(plan, editionNotice) {
  const el = document.getElementById('item-origin-box');
  if (!el) return;

  const edVillagerNote =
    plan.hasVillagerForMat
      ? plan.edition === 'java'
        ? ' En <strong>Java Edition</strong> este aldeano garantiza la pieza al subir de nivel (100% en ranura de Maestro).'
        : ' En <strong>Bedrock Edition</strong> el tradeo de pieza de equipamiento tiene 50% por hueco, así que puede requerir 2 aldeanos.'
      : '';

  const noticeHtml = editionNotice
    ? `<div class="mc-badge mc-badge--gold" style="margin-top:0.45rem;">ℹ ${editionNotice}</div>`
    : '';

  el.innerHTML = `
    <div class="flex-row" style="align-items:flex-start;">
      <span style="font-size:1.05rem;">🧭</span>
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <div style="font-weight:800;" class="text-gold">
          Cómo conseguir ${plan.displayName}: ${plan.item.originTitle}
        </div>
        <p style="line-height:1.5;">
          ${plan.item.originDesc}${plan.mat ? ` <strong>Nota de ${plan.mat.name}:</strong> ${plan.mat.villagerNote}` : ''}${edVillagerNote}
        </p>
        ${noticeHtml}
      </div>
    </div>
  `;
}

export function renderStage1GoldPreview(plan) {
  const box = document.getElementById('stage1-enchant-table-box');
  if (!box) return;

  const tableStats = plan.stage1GoldStats;
  if (!tableStats || !tableStats.supported || tableStats.comboTargets.length === 0) {
    box.classList.add('hidden');
    return;
  }

  const comboLabel = tableStats.comboTargets
    .map(
      t =>
        `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}${t.practicalLvl < t.desiredLvl ? ` (→${ROMAN[t.desiredLvl]} con 1 libro)` : ''}`
    )
    .join(' + ');

  const cappedItems = tableStats.perEnchant.filter(e => e.status === 'partial');
  const capWarning =
    cappedItems.length > 0
      ? `<div class="mc-tip-box" style="padding:0.55rem 0.75rem; font-size:0.72rem;">
          <strong>⚠ Techo de Mesa Nv. 30 (${plan.mat ? plan.mat.name : plan.item.name}, Nv. mod. máx. ${tableStats.maxMod}):</strong>
          ${cappedItems
            .map(
              c =>
                `<strong>${ENCHANTMENTS[c.key].name} ${ROMAN[c.desiredLvl]}</strong> tiene <strong>0%</strong> directo en mesa para este material (máx. <strong>${ROMAN[c.maxReachable]}</strong>); con el Truco del Oro busca <strong>${ENCHANTMENTS[c.key].name} ${ROMAN[c.maxReachable]}</strong> y súbelo a ${ROMAN[c.desiredLvl]} con 1 libro.`
            )
            .join(' ')}
        </div>`
      : '';

  box.innerHTML = `
    <div class="flex-between" style="border-bottom:1px solid #8a8a8a; padding-bottom:0.5rem;">
      <div class="flex-row">
        <span>🪙</span>
        <h3 class="font-pixel text-xs text-gold">Vista rápida Truco del Oro (Mesa Nv. 30) — ${plan.displayName}</h3>
      </div>
      <span class="mc-badge mc-badge--dark">
        Encantabilidad: ${tableStats.enchantability} · Nv. Mod.: ${tableStats.minMod}–${tableStats.maxMod}
      </span>
    </div>

    <div class="mc-grid-3">
      <div class="mc-recessed-dark mc-kpi-box">
        <span class="mc-kpi-label">Combo óptimo en mesa</span>
        <div class="mc-kpi-value text-light-gold">~${tableStats.goldRerollsFull} re-rolls</div>
        <span class="mc-kpi-sub">Prob: ${(tableStats.probComboFull * 100).toFixed(1)}% / semilla</span>
      </div>
      ${
        tableStats.comboTargets.length >= 2
          ? `<div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Al menos 2 objetivos</span>
              <div class="mc-kpi-value mc-xp-text">~${tableStats.goldRerolls2} re-rolls</div>
              <span class="mc-kpi-sub">Prob: ${(tableStats.probComboAtLeast2 * 100).toFixed(1)}% / semilla</span>
            </div>`
          : `<div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Pista visible (Ranura 3)</span>
              <div class="mc-kpi-value mc-xp-text">${(tableStats.probAnyTargetClue * 100).toFixed(1)}%</div>
              <span class="mc-kpi-sub">Lo ves antes de gastar XP</span>
            </div>`
      }
      <div class="mc-recessed-dark mc-kpi-box">
        <span class="mc-kpi-label">Coste aprox. re-rolls</span>
        <div class="mc-kpi-value text-light-cyan">~${tableStats.lapisFull} Lapis</div>
        <span class="mc-kpi-sub">~${tableStats.netXpFull} Niv. netos (Afiladora)</span>
      </div>
    </div>

    <p class="text-xs" style="line-height:1.5;">
      <strong>Objetivo sugerido en Mesa Nv. 30:</strong> busca <strong>${comboLabel}</strong> en tu <strong>${plan.displayName}</strong> reseteando la semilla con una <strong>Pala de Oro en la 1ª ranura (1 nivel + 1 lapislázuli)</strong>.
    </p>
    ${capWarning}
  `;
  box.classList.remove('hidden');
}

/**
 * Consejo Intermedio 0 (antes de Etapa 2) — AHORA 100% DINÁMICO
 */
export function renderInterludeBeforeEnchants(plan) {
  const el = document.getElementById('interlude-before-enchants');
  if (!el) return;

  const prepSteps = [];
  if (plan.mat && plan.mat.id === 'netherite') {
    prepSteps.push(
      `1) Si vas a usar <strong>Aldeano</strong>, compra primero la pieza de <strong>Diamante</strong> y mejórala a Netherita en Mesa de Herrería; si usas <strong>Mesa Nv. 30</strong>, mejorar a Netherita antes sube la encantabilidad de 10 a 15.`
    );
  } else {
    prepSteps.push(
      `1) Ten listo tu <strong>${plan.displayName}</strong> nuevo (0 usos previos en yunque para evitar recargos ocultos).`
    );
  }

  if (!plan.item.hasEnchantTable) {
    prepSteps.push(
      `2) <strong>Sin Mesa de Encantamientos:</strong> ${plan.displayName} no entra en la Mesa Nv. 30; prepara directamente tu <strong>Yunque</strong> y al menos 1 <strong>Bibliotecario con Atril</strong>.`
    );
  } else if (plan.hasVillagerForMat) {
    prepSteps.push(
      `2) Puedes combinar 3 fuentes para ${plan.displayName}: <strong>Aldeano de equipamiento</strong>, <strong>Mesa Nv. 30 (15 librerías + pala de oro)</strong> y <strong>Bibliotecario con Atril</strong>.`
    );
  } else {
    prepSteps.push(
      `2) Ningún aldeano vende ${plan.displayName} pre-encantado; prepara tu <strong>Mesa Nv. 30 con 15 librerías</strong> y/o <strong>Bibliotecario con Atril</strong>.`
    );
  }

  if (plan.item.id === 'sword' && plan.edition === 'bedrock') {
    prepSteps.push(
      `3) Modo <strong>Bedrock Edition</strong> activo: <em>Filo Arrasador</em> está deshabilitado automáticamente porque solo existe en Java.`
    );
  } else if (plan.item.id === 'mace') {
    prepSteps.push(
      `3) Regla 1.21+: <strong>Densidad, Fisura, Castigo y Artrópodos</strong> son excluyentes entre sí, y <em>Ráfaga de Viento</em> solo cae en Bóvedas Ominosas.`
    );
  } else if (plan.item.id === 'trident') {
    prepSteps.push(
      `3) Regla de Tridente: <strong>Propulsión Acuática</strong> bloquea tanto <em>Lealtad</em> como <em>Canalización</em>.`
    );
  } else {
    prepSteps.push(
      `3) Marca abajo tus encantamientos y haz clic en <strong>ℹ Detalles</strong> en cualquiera para ver sus probabilidades, incompatibilidades y diferencias Java/Bedrock.`
    );
  }

  el.innerHTML = `
    <div class="flex-row" style="align-items:flex-start;">
      <span style="font-size:1.05rem;">📋</span>
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <h3 class="font-pixel text-xs text-gold">Preparación recomendada para tu ${plan.displayName} (${plan.edition === 'java' ? 'Java' : 'Bedrock'})</h3>
        <p style="line-height:1.55;">${prepSteps.join(' ')}</p>
      </div>
    </div>
  `;
}

/**
 * Consejo Intermedio 1 (después de Etapa 2, antes de Rutas/Re-rolls) — 100% DINÁMICO
 */
export function renderInterludeBeforeReroll(plan) {
  const el = document.getElementById('interlude-before-reroll');
  if (!el) return;

  if (plan.activeKeys.length === 0) {
    el.className = 'mc-tip-box mc-tip-box--info';
    el.innerHTML = `
      <div class="flex-row">
        <span>👆</span>
        <span class="text-xs" style="font-weight:700;">
          Marca al menos un encantamiento en la Etapa 2 para calcular la ruta más corta, los intentos de aldeano y el árbol óptimo del yunque para tu ${plan.displayName}.
        </span>
      </div>
    `;
    return;
  }

  const structureBooks = plan.bookEntries
    .filter(b => STRUCTURE_ONLY_ENCHANTS.has(b.key))
    .map(b => ENCHANTMENTS[b.key].name);

  const villagerBooksCount = plan.bookEntries.length - structureBooks.length;
  el.className = structureBooks.length > 0 ? 'mc-tip-box' : 'mc-tip-box mc-tip-box--success';

  el.innerHTML = `
    <div class="flex-row" style="align-items:flex-start;">
      <span style="font-size:1.05rem;">🧑‍🌾</span>
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <div style="font-weight:800;" class="text-gold">
          Resumen de libros para ${plan.displayName} (${ROUTE_SHORT_LABELS[plan.strategy]}):
        </div>
        <p style="line-height:1.55;">
          Necesitas conseguir <strong>${plan.bookEntries.length} ${plan.bookEntries.length === 1 ? 'libro encantado' : 'libros encantados'}</strong>${plan.preApplied.size > 0 ? ` (te ahorras <strong>${plan.preApplied.size}</strong> gracias a tu pieza base de ${plan.strategy === 'gold' ? 'Mesa Nv. 30' : 'Aldeano'})` : ''}.
          ${
            structureBooks.length > 0
              ? ` <strong class="text-danger">Atención:</strong> <strong>${structureBooks.join(', ')}</strong> NO sale en bibliotecarios (requiere exploración/trueque).`
              : ''
          }
          ${
            villagerBooksCount > 0
              ? ` Para los ${villagerBooksCount} ${villagerBooksCount === 1 ? 'libro' : 'libros'} de Bibliotecario en <strong>${plan.edition === 'java' ? 'Java (pool de 37)' : 'Bedrock (pool de ~30)'}</strong>, romper/poner el Atril revisa la 1ª ranura, mientras que ver las 4 ranuras multiplica tus chances por ~2.5x.`
              : plan.bookEntries.length === 0
                ? ' ¡Todos tus encantamientos ya salen directamente en la pieza base sin buscar ningún libro!'
                : ''
          }
        </p>
      </div>
    </div>
  `;
}

/**
 * Consejo Intermedio 2 (antes de Etapa 4 Yunque) — AHORA 100% DINÁMICO
 */
export function renderInterludeBeforeAnvil(plan) {
  const el = document.getElementById('interlude-before-anvil');
  if (!el) return;

  const stepsCount = plan.optimalResult.steps.length;
  const maxStep = plan.optimalResult.maxStepCost;
  const naiveMax = plan.naiveResult.maxStepCost;

  if (plan.activeKeys.length === 0) {
    el.className = 'mc-tip-box mc-tip-box--info';
    el.innerHTML = `
      <div class="flex-row">
        <span>⚒️</span>
        <span class="text-xs" style="font-weight:700;">
          Cuando elijas encantamientos para tu ${plan.displayName}, aquí aparecerá el diagnóstico exacto de penalización de yunque (PWP) y cuánto XP ahorras.
        </span>
      </div>
    `;
    return;
  }

  if (stepsCount === 0) {
    el.className = 'mc-tip-box mc-tip-box--success';
    el.innerHTML = `
      <div class="flex-row" style="align-items:flex-start;">
        <span>🎉</span>
        <div class="text-xs mc-stack-xs">
          <h3 class="font-pixel text-xs text-emerald">¡0 usos de Yunque necesarios para tu ${plan.displayName}!</h3>
          <p>Con la ruta actual (${ROUTE_SHORT_LABELS[plan.strategy]}), todos tus encantamientos vienen en la pieza base y conservas <strong>0 recargo previo (PWP = +0)</strong> para futuras mejoras.</p>
        </div>
      </div>
    `;
    return;
  }

  if (maxStep > 39) {
    el.className = 'mc-tip-box mc-tip-box--danger';
    el.innerHTML = `
      <div class="flex-row" style="align-items:flex-start;">
        <span>🚨</span>
        <div class="text-xs mc-stack-xs">
          <h3 class="font-pixel text-xs text-danger">Alerta de Yunque: tu combinación actual alcanza ${maxStep} niveles (máximo 39)</h3>
          <p>Con ${plan.bookEntries.length} libros aplicados sobre ${plan.displayName}, incluso el árbol binario óptimo supera 39 niveles en el paso más caro. Cambia a <strong>Ruta C (Mesa Nv. 30 + Truco del Oro)</strong> o <strong>Ruta B (Aldeano)</strong> arriba para reducir el número de libros.</p>
        </div>
      </div>
    `;
    return;
  }

  el.className = 'mc-tip-box';
  const finalWork = plan.optimalResult.workCount || 0;
  const avoidBlockMsg =
    naiveMax > 39
      ? `Meter tus ${stepsCount} libros uno por uno <strong>bloquearía tu ${plan.displayName}</strong> en ${naiveMax} niveles ("¡Demasiado caro!"). `
      : plan.savings > 0
        ? `El árbol binario te ahorra exactamente <strong>${plan.savings} niveles de XP</strong> frente a meter los libros 1 a 1. `
        : `Con solo ${stepsCount} ${stepsCount === 1 ? 'fusión' : 'fusiones'}, el orden óptimo mantiene el recargo mínimo. `;

  el.innerHTML = `
    <div class="flex-row" style="align-items:flex-start;">
      <span style="font-size:1.05rem;">💡</span>
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <h3 class="font-pixel text-xs text-gold">Diagnóstico de Yunque para tu ${plan.displayName} (${stepsCount} ${stepsCount === 1 ? 'fusión' : 'fusiones'})</h3>
        <p style="line-height:1.55;">
          ${avoidBlockMsg}
          Tu paso más caro será de solo <strong>${maxStep}/39 niveles</strong> y tu ${plan.displayName} terminará con <strong>${finalWork} ${finalWork === 1 ? 'uso' : 'usos'} previos</strong> (recargo futuro <code class="mc-code-inline">+${pwpCost(finalWork)}</code>).
          <strong>Tip interactivo:</strong> haz clic en cualquier paso del yunque abajo para ver la animación de forja y el desglose exacto de PWP e inversión de ranuras.
        </p>
      </div>
    </div>
  `;
}

/**
 * Pestaña 3 (Truco Oro y Orden) — Recuadro vivo sincronizado con el objeto/material actual
 */
export function renderTheoryLiveContext(plan) {
  const el = document.getElementById('theory-live-context');
  if (!el) return;

  const E = plan.mat
    ? plan.item.isArmor
      ? plan.mat.enchArmor
      : plan.mat.enchTool
    : plan.item.enchantability || 0;

  const tableSummary =
    plan.item.hasEnchantTable && plan.goldStats.supported
      ? `Encantabilidad <strong>E = ${E}</strong> → Nivel Modificado en Mesa Nv. 30: <strong>${plan.goldStats.minMod}–${plan.goldStats.maxMod}</strong>. ${plan.mat ? plan.mat.tableTip : ''}`
      : `<strong>${plan.displayName}</strong> tiene encantabilidad 0 y <strong>no entra en la Mesa de Encantamientos</strong>; aplica siempre libros en árbol binario en el Yunque.`;

  el.innerHTML = `
    <div class="flex-row" style="align-items:flex-start;">
      <span style="font-size:1.1rem;">🎯</span>
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <div class="font-pixel text-xs text-gold">Aplicado a tu selección actual: ${plan.displayName} (${plan.edition === 'java' ? 'Java' : 'Bedrock'})</div>
        <p style="line-height:1.55;">
          ${tableSummary}
          En el Yunque, tu configuración actual (${plan.activeKeys.length} encantamientos) cuesta <strong>${plan.optimalResult.totalLevels} Niveles</strong> en orden óptimo vs <strong>${plan.naiveResult.totalLevels} Niveles</strong> en orden lineal (ahorro: <strong>${plan.savings} Niv.</strong>).
        </p>
      </div>
    </div>
  `;
}
