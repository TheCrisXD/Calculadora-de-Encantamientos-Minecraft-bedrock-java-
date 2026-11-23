// =============================================================================
// RECUADROS DE INFORMACIÓN REACTIVOS (RESUMEN VIVO, ORIGEN, YUNQUE Y TEORÍA)
// =============================================================================

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
        ? ' En <strong>Java</strong> el aldeano garantiza la pieza (100% en Maestro).'
        : ' En <strong>Bedrock</strong> la pieza tiene 50% por ranura.'
      : '';

  const noticeHtml = editionNotice
    ? `<div class="mc-badge mc-badge--gold" style="margin-top:0.4rem;">ℹ ${editionNotice}</div>`
    : '';

  el.innerHTML = `
    <div class="flex-row" style="align-items:flex-start;">
      <span style="font-size:1.05rem;">🧭</span>
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <div style="font-weight:800;" class="text-gold">
          ${plan.displayName}: ${plan.item.originTitle}
        </div>
        <p style="line-height:1.5;">
          ${plan.item.originDesc}${plan.mat ? ` <strong>${plan.mat.name}:</strong> ${plan.mat.villagerNote}` : ''}${edVillagerNote}
        </p>
        ${noticeHtml}
      </div>
    </div>
  `;
}

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
          Selecciona encantamientos en la Etapa 2 para calcular el árbol óptimo del yunque.
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
          <p>Todos tus encantamientos salen en la pieza base con <strong>PWP = +0</strong>.</p>
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
          <h3 class="font-pixel text-xs text-danger">Alerta: el paso más caro llega a ${maxStep} niveles (máx. 39)</h3>
          <p>Elige <strong>Ruta C (Mesa Oro)</strong> o <strong>Ruta B (Aldeano)</strong> para reducir libros y bajar de 39 niveles.</p>
        </div>
      </div>
    `;
    return;
  }

  el.className = 'mc-tip-box';
  const finalWork = plan.optimalResult.workCount || 0;
  const avoidBlockMsg =
    naiveMax > 39
      ? `Meter los ${stepsCount} libros 1 a 1 <strong>bloquearía el yunque en ${naiveMax} Niv.</strong> (`
      : plan.savings > 0
        ? `Ahorras <strong>${plan.savings} Niv.</strong> frente a meter 1 a 1 (`
        : `Orden óptimo verificado (`;

  el.innerHTML = `
    <div class="flex-row" style="align-items:flex-start;">
      <span style="font-size:1.05rem;">💡</span>
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <h3 class="font-pixel text-xs text-gold">Yunque para ${plan.displayName} (${stepsCount} ${stepsCount === 1 ? 'fusión' : 'fusiones'})</h3>
        <p style="line-height:1.5;">
          ${avoidBlockMsg}pico <strong>${maxStep}/39 Niv.</strong> · recargo final <code class="mc-code-inline">+${pwpCost(finalWork)}</code>). Pulsa <strong>🔍 Ver por qué</strong> en cualquier paso para el desglose PWP.
        </p>
      </div>
    </div>
  `;
}

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
      ? `Encantabilidad <strong>E = ${E}</strong> → Nivel Modificado Mesa Nv. 30: <strong>${plan.goldStats.minMod}–${plan.goldStats.maxMod}</strong>.`
      : `<strong>${plan.displayName}</strong> tiene E = 0 y no entra en Mesa de Encantamientos.`;

  el.innerHTML = `
    <div class="flex-row" style="align-items:flex-start;">
      <span style="font-size:1.1rem;">🎯</span>
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <div class="font-pixel text-xs text-gold">Tu selección actual: ${plan.displayName} (${plan.edition === 'java' ? 'Java' : 'Bedrock'})</div>
        <p style="line-height:1.5;">
          ${tableSummary} Yunque óptimo: <strong>${plan.optimalResult.totalLevels} Niv.</strong> vs lineal <strong>${plan.naiveResult.totalLevels} Niv.</strong> (ahorro: <strong>${plan.savings} Niv.</strong>).
        </p>
      </div>
    </div>
  `;
}
