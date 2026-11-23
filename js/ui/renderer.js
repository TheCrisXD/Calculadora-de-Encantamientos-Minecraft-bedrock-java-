// =============================================================================
// RENDERIZADOR PRINCIPAL: 4 PESTAÑAS, PANEL DE RUTA DINÁMICO Y ETAPA 3 UNIFICADA
// =============================================================================

import { ENCHANTMENTS, ITEMS, MATERIALS, ROMAN, VILLAGER_DB } from '../data/catalog.js';
import { STRUCTURE_ONLY_ENCHANTS } from '../data/tableRules.js';
import { getEnchantConflict } from '../engine/strategy.js';
import { pwpCost } from '../engine/anvilDp.js';
import { generateRustSource } from '../engine/rustGenerator.js';
import { renderItemIcon } from '../pixelart/icons.js';
import { renderActor } from '../pixelart/actors.js';
import {
  renderLiveSummaryStrip,
  renderItemOriginBox,
  renderInterludeBeforeAnvil,
  renderTheoryLiveContext
} from './reactiveBoxes.js';
import {
  renderEnchantInspector,
  renderAnvilStepInspector,
  renderVillagerInspector
} from './inspectors.js';

const ROUTE_NAMES = {
  clean: 'Ruta A · Objeto limpio + Libros en árbol binario',
  villager: 'Ruta B · Pieza base de Aldeano + Libros restantes',
  gold: 'Ruta C · Mesa Nv. 30 (Truco de Oro) + Libros restantes'
};

const PROF_TITLES = {
  armorer: 'ARMERO · ALTO HORNO',
  weaponsmith: 'HERRERO DE ARMAS · AFILADORA',
  toolsmith: 'HERRERO DE HERRAMIENTAS · MESA DE HERRERÍA',
  fletcher: 'FLECHERO · MESA DE FLECHAS',
  fisherman: 'PESCADOR · BARRIL'
};

export function renderAll(state, plan) {
  renderHeaderAndTabs(state);
  renderLiveSummaryStrip(plan);
  renderStage1(state, plan);
  renderStage2Enchants(state, plan);
  renderRouteSection(plan);
  renderStage3Unified(state, plan);
  renderInterludeBeforeAnvil(plan);
  renderStage4Anvil(state, plan);
  renderVillagerTab(state, plan);
  renderTheoryLiveContext(plan);
  renderRustTab(plan);
}

function renderHeaderAndTabs(state) {
  const headerIcon = document.getElementById('header-anvil-icon');
  if (headerIcon && !headerIcon.dataset.ready) {
    headerIcon.innerHTML = renderActor('anvil_32', { sizeClass: 'px-actor-md' });
    headerIcon.dataset.ready = '1';
  }

  const btnJava = document.getElementById('btn-ed-java');
  const btnBed = document.getElementById('btn-ed-bedrock');
  if (btnJava && btnBed) {
    btnJava.classList.toggle('mc-tab-active', state.edition === 'java');
    btnJava.setAttribute('aria-pressed', String(state.edition === 'java'));
    btnBed.classList.toggle('mc-tab-active', state.edition === 'bedrock');
    btnBed.setAttribute('aria-pressed', String(state.edition === 'bedrock'));
  }

  const rerollBadge = document.getElementById('reroll-ed-badge');
  if (rerollBadge) {
    rerollBadge.textContent = state.edition === 'java' ? 'JAVA EDITION' : 'BEDROCK EDITION';
  }

  ['calc', 'villagers', 'theory', 'rust'].forEach(t => {
    const panel = document.getElementById(`tab-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (panel) panel.classList.toggle('hidden', t !== state.activeTab);
    if (btn) {
      btn.classList.toggle('mc-tab-active', t === state.activeTab);
      btn.setAttribute('aria-selected', String(t === state.activeTab));
    }
  });
}

function renderStage1(state, plan) {
  const catBadge = document.getElementById('item-category-badge');
  if (catBadge) catBadge.textContent = plan.item.category;

  const iconSlot = document.getElementById('selected-item-icon');
  if (iconSlot) {
    const isEnchanted = plan.activeKeys.length > 0;
    iconSlot.className = `mc-slot-hero mc-slot-interactive ${isEnchanted ? 'mc-slot-enchanted' : 'mc-slot'}`;
    iconSlot.title = `Haz clic para animar ${plan.displayName}`;
    iconSlot.innerHTML = renderItemIcon(plan.item.icon, {
      materialId: plan.mat ? plan.mat.id : 'diamond',
      enchanted: isEnchanted,
      sizeClass: 'px-icon-lg'
    });
  }

  const itemSelect = document.getElementById('item-select');
  if (itemSelect && itemSelect.options.length === 0) {
    itemSelect.innerHTML = ITEMS.map(it => `<option value="${it.id}">${it.name}</option>`).join('');
  }
  if (itemSelect && itemSelect.value !== plan.item.id) {
    itemSelect.value = plan.item.id;
  }

  const fieldsWrap = document.getElementById('selector-fields-grid');
  const matWrap = document.getElementById('material-select-wrap');
  const matSelect = document.getElementById('material-select');
  if (matWrap && matSelect) {
    if (plan.item.materials.length > 0) {
      const targetOpts = plan.item.materials.join(',');
      if (matSelect.dataset.opts !== targetOpts) {
        matSelect.innerHTML = plan.item.materials
          .map(mKey => `<option value="${mKey}">${MATERIALS[mKey].name}</option>`)
          .join('');
        matSelect.dataset.opts = targetOpts;
      }
      matSelect.value = plan.mat.id;
      matWrap.classList.remove('hidden');
      if (fieldsWrap) fieldsWrap.classList.add('mc-selector-fields--two');
    } else {
      matWrap.classList.add('hidden');
      matSelect.innerHTML = '';
      matSelect.dataset.opts = '';
      if (fieldsWrap) fieldsWrap.classList.remove('mc-selector-fields--two');
    }
  }

  renderItemOriginBox(plan, state.editionNotice);
}

function renderStage2Enchants(state, plan) {
  const container = document.getElementById('enchants-list');
  if (!container) return;

  container.innerHTML = plan.item.allowed
    .map(key => {
      const ench = ENCHANTMENTS[key];
      const isSelected = Boolean(state.selectedEnchants[key]);
      const currentLvl = state.selectedEnchants[key] || ench.maxLvl;
      const conflictReason = !isSelected
        ? getEnchantConflict(plan.item.id, state.edition, state.selectedEnchants, key)
        : null;
      const isOpen = state.openEnchantInspectors.has(key);

      return `
        <div class="mc-card mc-enchant-row ${isSelected ? 'mc-card-selected' : ''} ${conflictReason ? 'mc-card-disabled' : ''}">
          <div class="mc-enchant-main">
            <label class="mc-enchant-label">
              <input
                type="checkbox"
                data-action="toggle-enchant"
                data-key="${key}"
                ${isSelected ? 'checked' : ''}
                ${conflictReason ? 'disabled' : ''}
              />
              <div class="text-xs">
                <div class="flex-row" style="gap:0.4rem;">
                  <span style="font-weight:800; font-size:0.86rem;">${ench.name}</span>
                  <span class="mc-badge mc-badge--dark">Coste libro: x${ench.bookMult}</span>
                  ${
                    conflictReason
                      ? `<span class="mc-badge mc-badge--danger">✖ ${conflictReason}</span>`
                      : ''
                  }
                </div>
                <p class="text-muted" style="margin-top:0.18rem;">${ench.plainDesc}</p>
              </div>
            </label>

            <div class="mc-enchant-controls">
              ${
                isSelected
                  ? `<div class="mc-level-stepper">
                      <button type="button" class="mc-btn mc-btn--icon font-pixel" data-action="step-level" data-key="${key}" data-delta="-1" ${currentLvl <= 1 ? 'disabled' : ''} aria-label="Bajar nivel de ${ench.name}">-</button>
                      <span class="mc-level-readout">Nv. ${ROMAN[currentLvl]}</span>
                      <button type="button" class="mc-btn mc-btn--icon font-pixel" data-action="step-level" data-key="${key}" data-delta="1" ${currentLvl >= ench.maxLvl ? 'disabled' : ''} aria-label="Subir nivel de ${ench.name}">+</button>
                    </div>`
                  : ''
              }
              <button
                type="button"
                class="mc-btn mc-btn--sm ${isOpen ? 'mc-btn--lapis' : ''}"
                data-action="inspect-enchant"
                data-key="${key}"
                aria-expanded="${isOpen}"
              >
                ${isOpen ? '▴ Ocultar' : 'ℹ Detalles'}
              </button>
            </div>
          </div>

          ${isOpen ? renderEnchantInspector(plan, key, currentLvl, conflictReason) : ''}
        </div>
      `;
    })
    .join('');
}

function renderRouteSection(plan) {
  const modeBadge = document.getElementById('route-mode-badge');
  const btnReset = document.getElementById('btn-reset-recommended');

  if (modeBadge) {
    modeBadge.textContent = plan.isUsingRecommended ? '★ SIGUIENDO RUTA SUGERIDA' : '⚙ RUTA PERSONALIZADA';
    modeBadge.className = `mc-badge font-pixel ${plan.isUsingRecommended ? 'mc-badge--emerald' : 'mc-badge--gold'}`;
  }
  if (btnReset) {
    btnReset.classList.toggle('hidden', plan.isUsingRecommended);
  }

  const recBanner = document.getElementById('recommended-route-banner');
  if (recBanner) {
    recBanner.innerHTML = `
      <div class="flex-row" style="align-items:flex-start;">
        <span style="font-size:1.1rem;">🏆</span>
        <div class="text-xs mc-stack-xs" style="flex:1;">
          <div class="font-pixel text-xs text-emerald">Sugerencia óptima: ${ROUTE_NAMES[plan.recommended]}</div>
          <p style="line-height:1.5;">${plan.reason}</p>
        </div>
      </div>
    `;
  }

  const radClean = document.getElementById('rad-clean-base');
  const radVill = document.getElementById('rad-villager-base');
  const radGold = document.getElementById('rad-gold-trick');

  if (radVill) radVill.disabled = !plan.hasVillagerForMat;
  if (radGold) radGold.disabled = !plan.item.hasEnchantTable;

  const wrapVill = document.getElementById('wrap-villager-base');
  const wrapGold = document.getElementById('wrap-gold-trick');
  if (wrapVill) wrapVill.classList.toggle('mc-card-disabled', !plan.hasVillagerForMat);
  if (wrapGold) wrapGold.classList.toggle('mc-card-disabled', !plan.item.hasEnchantTable);

  const descVill = document.getElementById('desc-villager-base');
  if (descVill) {
    descVill.textContent = plan.hasVillagerForMat
      ? plan.item.villagerLabel
      : `No disponible para ${plan.displayName}.`;
  }

  const descGold = document.getElementById('desc-gold-trick');
  if (descGold) {
    if (!plan.item.hasEnchantTable) {
      descGold.textContent = 'No disponible: no entra en Mesa de Encantamientos.';
    } else if (plan.goldStats.supported && plan.goldStats.comboTargets.length > 0) {
      const comboPreview = plan.goldStats.comboTargets
        .map(t => `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}`)
        .join(' + ');
      descGold.textContent = `~${plan.goldStats.goldRerollsFull} re-rolls oro (${(plan.goldStats.probComboFull * 100).toFixed(1)}%) para ${comboPreview}.`;
    } else {
      descGold.textContent = 'Mesa Nv. 30 con rotación de semilla usando herramienta de oro.';
    }
  }

  ['clean', 'villager', 'gold'].forEach(st => {
    const tag = document.getElementById(`tag-rec-${st}`);
    const costTag = document.getElementById(`cost-tag-${st}`);
    const wrap = document.getElementById(
      `wrap-${st === 'clean' ? 'clean-base' : st === 'villager' ? 'villager-base' : 'gold-trick'}`
    );
    const radio = st === 'clean' ? radClean : st === 'villager' ? radVill : radGold;

    if (radio && !radio.disabled) radio.checked = st === plan.strategy;
    if (tag) tag.classList.toggle('hidden', st !== plan.recommended);
    if (wrap) wrap.classList.toggle('mc-card-selected', st === plan.strategy);

    if (costTag) {
      const ev = plan.evaluations[st];
      if (ev && plan.activeKeys.length > 0) {
        costTag.textContent = `${ev.totalLevels} Niv. · ${ev.booksCount} libro(s)`;
        costTag.classList.remove('hidden');
      } else {
        costTag.classList.add('hidden');
      }
    }
  });

  renderRouteDetailPanel(plan);
}

/**
 * Panel dinámico y conciso debajo de la selección de ruta:
 * Cambia según Ruta A / B / C y muestra solo porcentajes, re-rolls y niveles.
 */
function renderRouteDetailPanel(plan) {
  const panel = document.getElementById('route-detail-panel');
  if (!panel) return;

  if (plan.activeKeys.length === 0) {
    panel.classList.add('hidden');
    return;
  }

  const totalAtril = plan.bookEntries.reduce((acc, b) => acc + (b.stats.avgRerolls || 0), 0);
  const totalFullMenu = plan.bookEntries.reduce((acc, b) => acc + (b.stats.avgFullMenuRerolls || 0), 0);
  const maxCost = plan.optimalResult.maxStepCost;
  const picoClass = maxCost > 39 ? 'text-light-danger' : 'mc-xp-text';

  if (plan.strategy === 'clean') {
    panel.innerHTML = `
      <div class="flex-between" style="border-bottom:2px solid #8a8a8a; padding-bottom:0.45rem;">
        <h3 class="font-pixel text-xs">📊 Métricas · Ruta A (Objeto limpio)</h3>
        <span class="mc-badge mc-badge--dark font-pixel">${plan.displayName}</span>
      </div>
      <div class="mc-grid-4">
        <div class="mc-recessed-dark mc-kpi-box">
          <span class="mc-kpi-label">Libros necesarios</span>
          <div class="mc-kpi-value text-light-gold">${plan.bookEntries.length}</div>
          <span class="mc-kpi-sub">100% controlados</span>
        </div>
        <div class="mc-recessed-dark mc-kpi-box">
          <span class="mc-kpi-label">Re-rolls Atril (Nv.1)</span>
          <div class="mc-kpi-value text-light-cyan">~${totalAtril}</div>
          <span class="mc-kpi-sub">Solo 1ª ranura</span>
        </div>
        <div class="mc-recessed-dark mc-kpi-box">
          <span class="mc-kpi-label">Vista completa (4 niv.)</span>
          <div class="mc-kpi-value text-light-emerald">~${totalFullMenu}</div>
          <span class="mc-kpi-sub">Con pack de tradeos</span>
        </div>
        <div class="mc-recessed-dark mc-kpi-box">
          <span class="mc-kpi-label">Coste en Yunque</span>
          <div class="mc-kpi-value ${picoClass}">${plan.optimalResult.totalLevels} Niv.</div>
          <span class="mc-kpi-sub">Pico máx: ${maxCost}/39</span>
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
    return;
  }

  if (plan.strategy === 'villager') {
    const vs = plan.villagerEquipStats;
    const slotPct = vs ? `${(vs.slotProb * 100).toFixed(0)}%` : '—';
    const rows =
      vs && vs.targetOdds.length > 0
        ? vs.targetOdds
            .map(
              o => `
              <div class="mc-dark-list-row">
                <strong style="color:#fff;">${o.name}</strong>
                <span class="font-mono text-light-emerald">
                  ${(o.effectiveProb * 100).toFixed(2)}% / aldeano · ~${o.avgVillagers} aldeanos
                </span>
              </div>`
            )
            .join('')
        : `<div class="mc-dark-list-row"><span class="text-light-gold">Ningún encantamiento elegido sale al máximo en este aldeano (ahorras 0 libros).</span></div>`;

    panel.innerHTML = `
      <div class="flex-between" style="border-bottom:2px solid #8a8a8a; padding-bottom:0.45rem;">
        <h3 class="font-pixel text-xs text-emerald">📊 Métricas · Ruta B (${vs ? vs.prof : 'Aldeano'})</h3>
        <span class="mc-badge mc-badge--emerald font-pixel">${vs ? vs.tier : 'Equipamiento'} · ${plan.edition === 'java' ? 'Java' : 'Bedrock'}</span>
      </div>
      <div class="mc-grid-4">
        <div class="mc-recessed-dark mc-kpi-box">
          <span class="mc-kpi-label">Prob. ranura pieza</span>
          <div class="mc-kpi-value text-light-emerald">${slotPct}</div>
          <span class="mc-kpi-sub">${plan.edition === 'java' ? 'Java garantizado' : 'Bedrock 50%'}</span>
        </div>
        <div class="mc-recessed-dark mc-kpi-box">
          <span class="mc-kpi-label">Aldeanos a revisar</span>
          <div class="mc-kpi-value text-light-gold">~${vs ? vs.avgVillagersAny : '—'}</div>
          <span class="mc-kpi-sub">${vs ? `${(vs.anyTargetProb * 100).toFixed(1)}% / aldeano` : ''}</span>
        </div>
        <div class="mc-recessed-dark mc-kpi-box">
          <span class="mc-kpi-label">Libros restantes</span>
          <div class="mc-kpi-value text-light-cyan">${plan.bookEntries.length}</div>
          <span class="mc-kpi-sub">Ahorras ${plan.preApplied.size} libro(s)</span>
        </div>
        <div class="mc-recessed-dark mc-kpi-box">
          <span class="mc-kpi-label">Coste en Yunque</span>
          <div class="mc-kpi-value ${picoClass}">${plan.optimalResult.totalLevels} Niv.</div>
          <span class="mc-kpi-sub">Pico máx: ${maxCost}/39</span>
        </div>
      </div>
      <div class="mc-recessed-dark" style="overflow:hidden;">
        <div class="mc-dark-list-header">PROBABILIDADES EN ${vs ? vs.prof.toUpperCase() : 'ALDEANO'} (NIVEL 5–19):</div>
        ${rows}
      </div>
    `;
    panel.classList.remove('hidden');
    return;
  }

  // Ruta C: Mesa Nv. 30 + Truco de Oro (solo porcentajes, re-rolls y niveles)
  const goldStats = plan.goldStats;
  if (!goldStats || !goldStats.supported) {
    panel.classList.add('hidden');
    return;
  }

  const rowsHtml = goldStats.perEnchant
    .map(e => {
      const enchName = `${ENCHANTMENTS[e.key].name} ${ROMAN[e.desiredLvl]}`;
      let badge = '';
      let statsText = '';

      if (e.status === 'impossible') {
        badge = `<span class="mc-badge mc-badge--dark-danger font-pixel">0% MESA</span>`;
        statsText = `<span class="text-light-danger">${e.reason}</span>`;
      } else if (e.status === 'partial') {
        const rPart = Math.max(1, Math.round(1 / e.probTableTarget));
        badge = `<span class="mc-badge mc-badge--gold font-pixel">MÁX. ${ROMAN[e.maxReachable]}</span>`;
        statsText = `<span class="text-light-gold">${(e.probTableTarget * 100).toFixed(1)}% (~${rPart} int.) · Pista: ${(e.probClue * 100).toFixed(1)}%</span>`;
      } else {
        const rExact = Math.max(1, Math.round(1 / e.probExact));
        badge = `<span class="mc-badge mc-badge--emerald font-pixel">NV. ${ROMAN[e.desiredLvl]}</span>`;
        statsText = `<span class="text-light-emerald">${(e.probExact * 100).toFixed(1)}% (~${rExact} int.) · Pista: ${(e.probClue * 100).toFixed(1)}%</span>`;
      }

      return `
        <div class="mc-dark-list-row">
          <div class="flex-row">
            <strong style="color:#fff;">${enchName}</strong>
            ${badge}
          </div>
          <div class="font-mono">${statsText}</div>
        </div>
      `;
    })
    .join('');

  panel.innerHTML = `
    <div class="flex-between" style="border-bottom:2px solid #8a8a8a; padding-bottom:0.45rem;">
      <h3 class="font-pixel text-xs text-gold">📊 Métricas · Ruta C (Mesa Nv. 30 + Truco de Oro)</h3>
      <span class="mc-badge mc-badge--gold font-pixel">E=${goldStats.enchantability} · Nv. Mod. ${goldStats.minMod}–${goldStats.maxMod}</span>
    </div>
    ${
      goldStats.comboTargets.length > 0
        ? `<div class="mc-grid-4">
            <div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Combo completo</span>
              <div class="mc-kpi-value text-light-gold">~${goldStats.goldRerollsFull} re-rolls</div>
              <span class="mc-kpi-sub">${(goldStats.probComboFull * 100).toFixed(1)}% / semilla</span>
            </div>
            <div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Mín. 2 objetivos</span>
              <div class="mc-kpi-value mc-xp-text">~${goldStats.goldRerolls2} re-rolls</div>
              <span class="mc-kpi-sub">${(goldStats.probComboAtLeast2 * 100).toFixed(1)}% / semilla</span>
            </div>
            <div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Pista útil ranura 3</span>
              <div class="mc-kpi-value text-light-emerald">${(goldStats.probAnyTargetClue * 100).toFixed(1)}%</div>
              <span class="mc-kpi-sub">~${goldStats.lapisFull} Lapis · ~${goldStats.netXpFull} Niv.</span>
            </div>
            <div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Yunque restante</span>
              <div class="mc-kpi-value ${picoClass}">${plan.optimalResult.totalLevels} Niv.</div>
              <span class="mc-kpi-sub">Pico: ${maxCost}/39 · ${plan.bookEntries.length} lib.</span>
            </div>
          </div>`
        : `<p class="text-xs text-danger" style="font-weight:700;">0% en Mesa Nv. 30 para los encantamientos elegidos.</p>`
    }
    <div class="mc-recessed-dark" style="overflow:hidden;">
      <div class="mc-dark-list-header">PROBABILIDAD POR ENCANTAMIENTO EN MESA NV. 30:</div>
      ${rowsHtml}
    </div>
  `;
  panel.classList.remove('hidden');
}

/**
 * ETAPA 3 UNIFICADA: Combina la interfaz visual animada de obtención con los
 * porcentajes, probabilidades, niveles y re-rolls debajo de cada ítem correlacionado
 * (tanto Vista Nv. 1 como Vista Completa con pack de tradeos).
 */
function renderStage3Unified(state, plan) {
  const banner = document.getElementById('reroll-summary-banner');
  const container = document.getElementById('stage3-unified-showcase');
  if (!banner || !container) return;

  const librarianBooks = plan.bookEntries.filter(b => !STRUCTURE_ONLY_ENCHANTS.has(b.key));
  const structureBooks = plan.bookEntries.filter(b => STRUCTURE_ONLY_ENCHANTS.has(b.key));
  const totalNoviceRerolls = librarianBooks.reduce((acc, b) => acc + (b.stats.avgRerolls || 0), 0);
  const totalFullMenuRerolls = librarianBooks.reduce((acc, b) => acc + (b.stats.avgFullMenuRerolls || 0), 0);

  // Banner resumen superior de Etapa 3 (incluye pieza base + libros)
  if (plan.activeKeys.length === 0) {
    banner.innerHTML = `<div class="text-xs" style="font-weight:700;">Selecciona al menos un encantamiento en la Etapa 2 para ver las interfaces de obtención, probabilidades y re-rolls.</div>`;
    container.innerHTML = '';
    return;
  }

  const baseLine =
    plan.strategy === 'gold' && plan.goldStats.goldRerollsFull
      ? `<p class="text-gold">• <strong>Mesa Nv. 30 (Truco del Oro):</strong> <strong>~${plan.goldStats.goldRerollsFull} re-rolls oro</strong> (${(plan.goldStats.probComboFull * 100).toFixed(1)}% combo · ~${plan.goldStats.lapisFull} Lapis · ~${plan.goldStats.netXpFull} Niv. netos).</p>`
      : plan.strategy === 'villager' && plan.villagerEquipStats
        ? `<p class="text-emerald">• <strong>${plan.villagerEquipStats.prof} (${plan.villagerEquipStats.tier}):</strong> ranura <strong>${(plan.villagerEquipStats.slotProb * 100).toFixed(0)}%</strong> · <strong>~${plan.villagerEquipStats.avgVillagersAny} aldeanos</strong> (${(plan.villagerEquipStats.anyTargetProb * 100).toFixed(1)}%).</p>`
        : `<p>• <strong>Pieza base (${plan.displayName}):</strong> objeto limpio sin re-rolls previos.</p>`;

  const booksLine =
    librarianBooks.length > 0
      ? `<p>• <strong>Bibliotecario (${librarianBooks.length} ${librarianBooks.length === 1 ? 'libro' : 'libros'}):</strong> Vista Nv. 1 (Atril): <strong>~${totalNoviceRerolls} intentos</strong> · Pack Vista Completa (4 niveles): <strong class="text-lapis">~${totalFullMenuRerolls} aldeanos</strong>.</p>`
      : `<p class="text-emerald">• <strong>Bibliotecario:</strong> 0 libros necesarios en aldeano bibliotecario.</p>`;

  banner.innerHTML = `
    <div class="flex-between" style="align-items:flex-start;">
      <div class="text-xs mc-stack-xs" style="flex:1;">
        ${baseLine}
        ${booksLine}
        ${structureBooks.length > 0 ? `<p class="text-danger">• <strong>Estructuras / Trueque:</strong> ${structureBooks.length} libro(s) no disponibles en aldeanos.</p>` : ''}
      </div>
      <div class="flex-row">
        <div class="mc-recessed-dark" style="padding:0.4rem 0.75rem; text-align:center;">
          <span class="mc-kpi-label">Libros</span>
          <span class="font-pixel text-light-gold" style="font-size:1.05rem;">${plan.bookEntries.length}</span>
        </div>
        <div class="mc-recessed-dark" style="padding:0.4rem 0.75rem; text-align:center;">
          <span class="mc-kpi-label">Yunque</span>
          <span class="font-pixel mc-xp-text" style="font-size:1.05rem;">${plan.optimalResult.totalLevels} Niv.</span>
        </div>
      </div>
    </div>
  `;

  const matId = plan.mat ? plan.mat.id : 'diamond';
  const itemIconClean = renderItemIcon(plan.item.icon, { materialId: matId, enchanted: false, sizeClass: 'px-icon-md' });
  const itemIconEnch = renderItemIcon(plan.item.icon, { materialId: matId, enchanted: true, sizeClass: 'px-icon-md' });
  const cards = [];

  // ---------------------------------------------------------------------------
  // TARJETA 1: PIEZA BASE (ALDEANO / MESA NV.30 / BARCO END / AHOGADO)
  // Con probabilidades, niveles y re-rolls correlacionados justo debajo
  // ---------------------------------------------------------------------------
  if (plan.strategy === 'villager' && plan.hasVillagerForMat && plan.villagerEquipStats) {
    const actorKey = plan.item.actorKey || 'armorer';
    const vs = plan.villagerEquipStats;
    const preList = [...plan.preApplied].map(k => `${ENCHANTMENTS[k].name} ${ROMAN[state.selectedEnchants[k]]}`);
    const perTargetHtml =
      vs.targetOdds.length > 0
        ? vs.targetOdds
            .map(
              o => `
                <div class="mc-card mc-stack-xs" style="padding:0.65rem 0.8rem;">
                  <div class="flex-between">
                    <div class="flex-row">
                      <div class="mc-slot-enchanted" style="width:36px; height:36px; display:flex; align-items:center; justify-content:center;">${itemIconEnch}</div>
                      <div>
                        <strong class="text-xs">${plan.displayName} con ${o.name}</strong>
                        <span class="text-xs text-emerald" style="display:block; font-weight:700;">${vs.prof} · ${vs.tier} (${vs.station})</span>
                      </div>
                    </div>
                    <div class="flex-row">
                      <span class="mc-badge mc-badge--dark font-pixel">~${o.avgVillagers} aldeanos</span>
                      <span class="mc-badge mc-badge--emerald font-pixel">${(o.effectiveProb * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div class="mc-grid-2 text-xs" style="background:#b5b5b5; padding:0.4rem 0.6rem; border:1px solid #7a7a7a;">
                    <div><span class="text-muted">Vista Nv. 1 (sin pack):</span> <strong class="font-mono">Subir a ${vs.tier} (${(vs.slotProb * 100).toFixed(0)}% ranura × ${(o.enchantProb * 100).toFixed(1)}%)</strong></div>
                    <div><span class="text-muted">Pack vista completa:</span> <strong class="font-mono text-lapis">Ver en Nv. 1 con ${vs.station} (~${o.avgVillagers} re-rolls sin gastar esmeraldas)</strong></div>
                  </div>
                </div>
              `
            )
            .join('')
        : `<div class="mc-card text-xs">Este aldeano vende ${plan.displayName} (${(vs.slotProb * 100).toFixed(0)}% ranura en ${plan.edition === 'java' ? 'Java' : 'Bedrock'}), pero tus encantamientos elegidos superan su techo Nv. 5–19.</div>`;

    cards.push(`
      <div>
        <div class="mc-vanilla-header-tab">
          <button type="button" class="px-actor-btn" data-action="poke-actor" data-actor="${actorKey}" data-burst="emerald" title="Haz clic para interactuar con el aldeano">
            ${renderActor(actorKey, { sizeClass: 'px-actor-sm' })}
          </button>
          <span class="font-pixel text-xs">${PROF_TITLES[actorKey] || 'ALDEANO DE EQUIPAMIENTO'}</span>
        </div>
        <div class="mc-vanilla-gui mc-stack-sm">
          <div class="flex-between" style="border-bottom:2px solid #8b8b8b; padding-bottom:0.45rem;">
            <span class="font-pixel text-xs">PIEZA BASE PRE-ENCANTADA (${vs.tier.toUpperCase()})</span>
            <span class="mc-badge mc-badge--xp">Ranura ${(vs.slotProb * 100).toFixed(0)}% · Ahorra ${plan.preApplied.size} libro(s)</span>
          </div>

          <div class="mc-trade-row">
            <div class="mc-trade-box">
              <span class="font-pixel" style="font-size:0.6rem; margin-bottom:0.3rem;">ENTREGAS</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="emerald">${renderItemIcon('emerald', { sizeClass: 'px-icon-md' })}</div>
              <span class="text-xs" style="font-weight:700; margin-top:0.25rem;">18–35 Esmeraldas</span>
            </div>
            <div class="mc-trade-arrow">➔</div>
            <div class="mc-trade-box mc-trade-box--result">
              <span class="font-pixel text-emerald" style="font-size:0.6rem; margin-bottom:0.3rem;">RECIBES</span>
              <div class="mc-slot-enchanted mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="xp">${itemIconEnch}</div>
              <span class="text-xs" style="font-weight:800; margin-top:0.25rem;">${plan.displayName}</span>
              <span class="mc-trade-caption">${preList.length > 0 ? `Objetivo: <strong>${preList.join(' + ')}</strong>` : 'Encantamiento base Nv. 5–19'}</span>
            </div>
          </div>

          <!-- Datos detallados correlacionados debajo del ítem -->
          <div class="mc-stack-xs">${perTargetHtml}</div>
        </div>
      </div>
    `);
  } else if (plan.strategy === 'gold' && plan.item.hasEnchantTable && plan.goldStats.supported) {
    const gs = plan.goldStats;
    const comboNames = gs.comboTargets.map(t => `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}`).join(' + ');
    const perTableRows = gs.comboTargets
      .map(t => {
        const prob = t.practicalLvl >= t.desiredLvl ? t.probExact : t.probTableTarget;
        const rolls = Math.max(1, Math.round(1 / prob));
        return `
          <div class="mc-card mc-stack-xs" style="padding:0.65rem 0.8rem;">
            <div class="flex-between">
              <div class="flex-row">
                <div class="mc-slot-enchanted" style="width:36px; height:36px; display:flex; align-items:center; justify-content:center;">${itemIconEnch}</div>
                <div>
                  <strong class="text-xs">${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}${t.practicalLvl < t.desiredLvl ? ` (luego +1 libro → ${ROMAN[t.desiredLvl]})` : ''}</strong>
                  <span class="text-xs text-gold" style="display:block; font-weight:700;">Mesa Nv. 30 · Encantabilidad ${gs.enchantability} (Nv. Mod. ${gs.minMod}–${gs.maxMod})</span>
                </div>
              </div>
              <div class="flex-row">
                <span class="mc-badge mc-badge--dark font-pixel">~${rolls} re-rolls oro</span>
                <span class="mc-badge mc-badge--gold font-pixel">${(prob * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div class="mc-grid-2 text-xs" style="background:#b5b5b5; padding:0.4rem 0.6rem; border:1px solid #7a7a7a;">
              <div><span class="text-muted">Prob. real en tirada:</span> <strong class="font-mono">${(prob * 100).toFixed(1)}% (~${rolls} intentos)</strong></div>
              <div><span class="text-muted">Pista visible (Ranura 3):</span> <strong class="font-mono text-lapis">${(t.probClue * 100).toFixed(1)}% (ves antes de pagar)</strong></div>
            </div>
          </div>
        `;
      })
      .join('');

    cards.push(`
      <div>
        <div class="mc-vanilla-header-tab">
          <button type="button" class="px-actor-btn" data-action="poke-actor" data-actor="enchant_table" data-burst="rune" title="Haz clic para animar la Mesa de Encantamientos">
            ${renderActor('enchant_table', { sizeClass: 'px-actor-sm' })}
          </button>
          <span class="font-pixel text-xs">MESA DE ENCANTAMIENTOS · NIVEL 30 (TRUCO DE ORO)</span>
        </div>
        <div class="mc-vanilla-gui mc-stack-sm">
          <div class="flex-between" style="border-bottom:2px solid #8b8b8b; padding-bottom:0.45rem;">
            <span class="font-pixel text-xs">ENCANTAMIENTO DIRECTO + ROTACIÓN CON ORO</span>
            <span class="mc-badge mc-badge--dark">Combo: ~${gs.goldRerollsFull || '—'} re-rolls · ~${gs.lapisFull || 3} Lapis · ~${gs.netXpFull || 3} Niv.</span>
          </div>

          <div class="mc-trade-row">
            <div class="mc-trade-box">
              <span class="font-pixel" style="font-size:0.6rem; margin-bottom:0.3rem;">1º OBJETO</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="rune">${itemIconClean}</div>
              <span class="text-xs" style="font-weight:700; margin-top:0.25rem;">${plan.displayName}</span>
            </div>
            <div class="mc-trade-box">
              <span class="font-pixel text-lapis" style="font-size:0.6rem; margin-bottom:0.3rem;">2º LAPIS</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="rune">${renderItemIcon('lapis', { sizeClass: 'px-icon-md' })}</div>
              <span class="text-xs" style="font-weight:700; margin-top:0.25rem;">3 Lapislázuli</span>
            </div>
            <div class="mc-trade-box">
              <span class="font-pixel text-gold" style="font-size:0.6rem; margin-bottom:0.3rem;">REROLL SEMILLA</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="spark">${renderItemIcon('gold_shovel', { sizeClass: 'px-icon-md' })}</div>
              <span class="text-xs text-gold" style="font-weight:700; margin-top:0.25rem;">Pala Oro (1 Niv.)</span>
            </div>
            <div class="mc-trade-arrow">➔</div>
            <div class="mc-trade-box mc-trade-box--result">
              <span class="font-pixel text-emerald" style="font-size:0.6rem; margin-bottom:0.3rem;">RECIBES</span>
              <div class="mc-slot-enchanted mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="xp">${itemIconEnch}</div>
              <span class="text-xs" style="font-weight:800; margin-top:0.25rem;">${plan.displayName}</span>
              <span class="mc-trade-caption">Combo: <strong>${comboNames || 'Base Nv. 30'}</strong> (${(gs.probComboFull * 100).toFixed(1)}% completo · ${(gs.probComboAtLeast2 * 100).toFixed(1)}% ≥2)</span>
            </div>
          </div>

          <div class="mc-stack-xs">${perTableRows}</div>
        </div>
      </div>
    `);
  } else if (plan.item.id === 'elytra' || plan.item.id === 'trident') {
    const isElytra = plan.item.id === 'elytra';
    const actorKey = isElytra ? 'end_ship' : 'drowned';
    const dropStat = isElytra
      ? '100% garantizado en marco de Barco del End'
      : plan.edition === 'java'
        ? '~8.5% drop en Ahogados con tridente (Java · mejora con Botín III a ~11.5%)'
        : '~25% drop en Ahogados con tridente (Bedrock · mejora con Botín III a ~37%)';

    cards.push(`
      <div>
        <div class="mc-vanilla-header-tab">
          <button type="button" class="px-actor-btn" data-action="poke-actor" data-actor="${actorKey}" data-burst="rune" title="Haz clic para ver consejo">
            ${renderActor(actorKey, { sizeClass: 'px-actor-sm' })}
          </button>
          <span class="font-pixel text-xs">${isElytra ? 'EXPLORACIÓN · BARCO DEL END' : 'COMBATE · AHOGADOS (OCÉANO/RÍO)'}</span>
        </div>
        <div class="mc-vanilla-gui flex-row" style="gap:0.9rem;">
          <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="rune">${itemIconClean}</div>
          <div class="text-xs mc-stack-xs" style="flex:1;">
            <strong>${plan.displayName} (pieza base)</strong>
            <span class="font-mono text-emerald" style="font-weight:700;">${dropStat}</span>
          </div>
        </div>
      </div>
    `);
  }

  // ---------------------------------------------------------------------------
  // TARJETA 2: BIBLIOTECARIO · ATRIL + CADA LIBRO CORRELACIONADO DEBAJO
  // (Con Vista Nv. 1 y Pack Vista Completa de 4 niveles)
  // ---------------------------------------------------------------------------
  if (librarianBooks.length > 0) {
    const bookBadges = librarianBooks
      .map(
        b =>
          `${ENCHANTMENTS[b.key].name} ${ROMAN[b.bookLvl]}${b.isUpgradeFromTable ? ` (→${ROMAN[b.finalLvl]})` : ''}`
      )
      .join(', ');

    const bookCardsHtml = librarianBooks
      .map(b => {
        const { stats } = b;
        return `
          <div class="mc-card mc-stack-xs" style="padding:0.65rem 0.8rem;">
            <div class="flex-between">
              <div class="flex-row">
                <div class="mc-slot-enchanted mc-slot-interactive" data-action="burst-slot" data-burst="xp" style="width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  ${renderItemIcon('book_enchanted', { sizeClass: 'px-icon-sm', enchanted: true })}
                </div>
                <div>
                  <strong class="text-xs">
                    Libro: ${ENCHANTMENTS[b.key].name} ${ROMAN[b.bookLvl]}${
                      b.isUpgradeFromTable
                        ? ` <span class="text-gold">(sube ${ROMAN[b.bookLvl]} → ${ROMAN[b.finalLvl]})</span>`
                        : ''
                    }
                  </strong>
                  <span class="text-xs text-muted" style="display:block;">Coste yunque base: +${b.finalLvl * ENCHANTMENTS[b.key].bookMult} Niv. (x${ENCHANTMENTS[b.key].bookMult})</span>
                </div>
              </div>
              <div class="flex-row">
                <span class="mc-badge mc-badge--dark font-pixel" title="Solo 1er hueco rompiendo y poniendo el Atril">
                  Nv.1 Atril: ~${stats.avgRerolls} int.
                </span>
                <span class="mc-badge mc-badge--lapis font-pixel" title="Con pack de vista completa de los 4 niveles">
                  Pack 4 Niv.: ~${stats.avgFullMenuRerolls} ald.
                </span>
              </div>
            </div>
            <div class="mc-grid-2 text-xs" style="background:#b5b5b5; padding:0.4rem 0.6rem; border:1px solid #7a7a7a;">
              <div><span class="text-muted">Vista Nv. 1 (Atril):</span> <strong class="font-mono">${stats.noviceProbText}</strong></div>
              <div><span class="text-muted">Pack vista completa (4 niv.):</span> <strong class="font-mono text-lapis">${stats.fullMenuProbText}</strong></div>
            </div>
          </div>
        `;
      })
      .join('');

    cards.push(`
      <div>
        <div class="mc-vanilla-header-tab">
          <button type="button" class="px-actor-btn" data-action="poke-actor" data-actor="librarian" data-burst="emerald" title="Haz clic para hablar con el Bibliotecario">
            ${renderActor('librarian', { sizeClass: 'px-actor-sm' })}
          </button>
          <span class="font-pixel text-xs">BIBLIOTECARIO · ATRIL (LECTERN)</span>
        </div>
        <div class="mc-vanilla-gui mc-stack-sm">
          <div class="flex-between" style="border-bottom:2px solid #8b8b8b; padding-bottom:0.45rem;">
            <span class="font-pixel text-xs">LIBROS REQUERIDOS (${librarianBooks.length})</span>
            <span class="mc-badge mc-badge--xp">Nv.1: ~${totalNoviceRerolls} int. · Pack 4 Niv.: ~${totalFullMenuRerolls} ald.</span>
          </div>

          <div class="mc-trade-row">
            <div class="mc-trade-box">
              <span class="font-pixel" style="font-size:0.6rem; margin-bottom:0.3rem;">RANURA 1</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="emerald">${renderItemIcon('emerald', { sizeClass: 'px-icon-md' })}</div>
              <span class="text-xs" style="font-weight:700; margin-top:0.25rem;">5–64 Esmeraldas</span>
            </div>
            <div class="mc-trade-arrow">+</div>
            <div class="mc-trade-box">
              <span class="font-pixel" style="font-size:0.6rem; margin-bottom:0.3rem;">RANURA 2</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="spark">${renderItemIcon('book_normal', { sizeClass: 'px-icon-md' })}</div>
              <span class="text-xs" style="font-weight:700; margin-top:0.25rem;">1 Libro normal</span>
            </div>
            <div class="mc-trade-arrow">➔</div>
            <div class="mc-trade-box mc-trade-box--result">
              <span class="font-pixel text-emerald" style="font-size:0.6rem; margin-bottom:0.3rem;">RECIBES</span>
              <div class="mc-slot-enchanted mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="xp">${renderItemIcon('book_enchanted', { sizeClass: 'px-icon-md', enchanted: true })}</div>
              <span class="text-xs" style="font-weight:800; margin-top:0.25rem;">Libro Encantado</span>
              <span class="mc-trade-caption"><strong>${bookBadges}</strong></span>
            </div>
          </div>

          <!-- Lista detallada correlacionada de cada libro debajo del intercambio -->
          <div class="mc-stack-xs">${bookCardsHtml}</div>
        </div>
      </div>
    `);
  }

  // ---------------------------------------------------------------------------
  // TARJETA 3 (OPCIONAL): LIBROS EXCLUSIVOS DE ESTRUCTURA / TRUEQUE
  // ---------------------------------------------------------------------------
  if (structureBooks.length > 0) {
    const structCards = structureBooks
      .map(
        b => `
          <div class="mc-card mc-stack-xs" style="padding:0.65rem 0.8rem;">
            <div class="flex-between">
              <div class="flex-row">
                <div class="mc-slot-enchanted mc-slot-interactive" data-action="burst-slot" data-burst="rune" style="width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
                  ${renderItemIcon('book_enchanted', { sizeClass: 'px-icon-sm', enchanted: true })}
                </div>
                <div>
                  <strong class="text-xs">${ENCHANTMENTS[b.key].name} ${ROMAN[b.bookLvl]}</strong>
                  <span class="text-xs text-danger" style="display:block; font-weight:700;">${b.stats.method}</span>
                </div>
              </div>
              <span class="mc-badge mc-badge--dark-danger font-pixel">0% Aldeanos</span>
            </div>
            <div class="mc-grid-2 text-xs" style="background:#b5b5b5; padding:0.4rem 0.6rem; border:1px solid #7a7a7a;">
              <div><span class="text-muted">Prob. Bibliotecario:</span> <strong class="font-mono">${b.stats.noviceProbText}</strong></div>
              <div><span class="text-muted">Prob. Estructura / Trueque:</span> <strong class="font-mono text-lapis">${b.stats.fullMenuProbText}</strong></div>
            </div>
          </div>
        `
      )
      .join('');

    cards.push(`
      <div class="mc-vanilla-gui mc-stack-xs">
        <div class="flex-between" style="border-bottom:2px solid #8b8b8b; padding-bottom:0.4rem;">
          <span class="font-pixel text-xs text-danger">🗺️ LIBROS EXCLUSIVOS DE EXPLORACIÓN / TRUEQUE</span>
          <span class="mc-badge mc-badge--dark-danger font-pixel">${structureBooks.length} libro(s)</span>
        </div>
        ${structCards}
      </div>
    `);
  }

  const speechHtml = state.actorSpeech
    ? `<div class="mc-speech-bubble" role="status">
        <div>${state.actorSpeech}</div>
        <button type="button" class="mc-btn mc-btn--sm" data-action="close-speech" aria-label="Cerrar mensaje">✕</button>
      </div>`
    : '';

  container.innerHTML =
    cards.length > 0
      ? `${speechHtml}${cards.join('')}`
      : `${speechHtml}<div class="mc-card text-xs" style="text-align:center; font-weight:700;">✔ Sin intercambios necesarios; pasa directo al Yunque (Etapa 4).</div>`;
}

function renderStage4Anvil(state, plan) {
  const { optimalResult, naiveResult, savings } = plan;
  const finalWork = optimalResult.workCount ?? 0;

  document.getElementById('kpi-total-levels').textContent = `${optimalResult.totalLevels} Niv.`;
  document.getElementById('kpi-total-xp').textContent = `~${optimalResult.totalXpPoints.toLocaleString()} pts XP`;
  document.getElementById('kpi-max-step').textContent = `${optimalResult.maxStepCost} Niv.`;
  document.getElementById('kpi-steps-count').textContent = `${optimalResult.steps.length} ${optimalResult.steps.length === 1 ? 'paso' : 'pasos'}`;
  document.getElementById('kpi-pwp-final').textContent = `Recargo final: +${pwpCost(finalWork)}`;
  document.getElementById('kpi-savings').textContent = `${savings > 0 ? '-' : ''}${savings} Niv.`;
  document.getElementById('kpi-savings-sub').textContent =
    naiveResult.maxStepCost > 39 ? 'Evita bloqueo >39' : 'vs meter 1 a 1';

  const statusEl = document.getElementById('kpi-anvil-status');
  const alertBox = document.getElementById('anvil-alert-box');

  if (optimalResult.maxStepCost > 39) {
    statusEl.textContent = '¡PASA DE 39 NIVELES!';
    statusEl.className = 'mc-kpi-sub text-light-danger';
    alertBox.className = 'mc-alert mc-alert--danger';
    alertBox.innerHTML = `
      <div>
        <div class="font-pixel text-xs text-danger">⚠ ¡CUIDADO! Un paso cuesta ${optimalResult.maxStepCost} niveles (máx. 39)</div>
        <p style="margin-top:0.25rem;">Cambia arriba a <strong>Ruta C (Mesa Nv. 30 + Truco de Oro)</strong> o <strong>Ruta B (Aldeano)</strong> para traer encantamientos en la pieza base.</p>
      </div>
    `;
    alertBox.classList.remove('hidden');
  } else if (optimalResult.steps.length > 0) {
    statusEl.textContent = '100% Posible (≤ 39)';
    statusEl.className = 'mc-kpi-sub text-light-emerald';
    alertBox.className = 'mc-alert mc-alert--success';
    alertBox.innerHTML = `
      <div><strong>✔ Ruta verificada:</strong> Ningún paso supera los 39 niveles permitidos por el juego.</div>
      <span class="mc-badge mc-badge--xp font-pixel">Pico máx: ${optimalResult.maxStepCost}/39</span>
    `;
    alertBox.classList.remove('hidden');
  } else {
    statusEl.textContent = '0 usos necesarios';
    statusEl.className = 'mc-kpi-sub text-light-emerald';
    alertBox.classList.add('hidden');
  }

  const stepsContainer = document.getElementById('steps-container');
  const matId = plan.mat ? plan.mat.id : 'diamond';
  const itemIconEnch = renderItemIcon(plan.item.icon, { materialId: matId, enchanted: true, sizeClass: 'px-icon-md' });
  const itemIconClean = renderItemIcon(plan.item.icon, {
    materialId: matId,
    enchanted: plan.preApplied.size > 0,
    sizeClass: 'px-icon-md'
  });

  if (optimalResult.steps.length === 0) {
    stepsContainer.innerHTML = `
      <div class="mc-card text-xs" style="text-align:center; font-weight:700; padding:1.15rem;">
        ${
          plan.activeKeys.length === 0
            ? 'Elige los encantamientos en la Etapa 2 para ver aquí el orden exacto del yunque.'
            : '✔ ¡Tu objeto ya queda listo sin necesidad de usar el Yunque (0 niveles gastados en fusiones)!'
        }
      </div>
    `;
  } else {
    stepsContainer.innerHTML = optimalResult.steps
      .map((st, idx) => {
        const leftIcon = st.leftIsItem
          ? st.leftWork > 0 || plan.preApplied.size > 0
            ? itemIconEnch
            : itemIconClean
          : renderItemIcon('book_enchanted', { sizeClass: 'px-icon-md', enchanted: true });
        const resultIcon = st.leftIsItem
          ? itemIconEnch
          : renderItemIcon('book_enchanted', { sizeClass: 'px-icon-md', enchanted: true });
        const isOpen = state.openStepInspectors.has(idx);

        return `
          <div class="anvil-step-card" data-step-card="${idx}">
            <div class="mc-vanilla-header-tab">
              <button type="button" class="px-actor-btn" data-action="inspect-step" data-step="${idx}" data-burst="spark" title="Haz clic para forjar y ver el cálculo PWP">
                ${renderActor('anvil_32', { sizeClass: 'px-actor-sm' })}
              </button>
              <span class="font-pixel text-xs">YUNQUE · PASO ${idx + 1} DE ${optimalResult.steps.length}</span>
            </div>
            <div class="mc-vanilla-gui mc-stack-sm ${st.tooExpensive ? 'mc-anvil-too-expensive' : ''}">
              <div class="flex-between" style="border-bottom:2px solid #8b8b8b; padding-bottom:0.45rem;">
                <div class="flex-row">
                  ${renderItemIcon('anvil_mini', { sizeClass: 'px-icon-sm' })}
                  <span class="font-pixel text-xs">REPARAR Y ENCANTAR</span>
                </div>
                <div class="flex-row">
                  <span class="mc-badge ${st.tooExpensive ? 'mc-badge--dark-danger' : 'mc-badge--xp'} font-pixel">
                    ${st.tooExpensive ? `¡DEMASIADO CARO! (${st.cost} Niv.)` : `Coste: ${st.cost} Niv.`}
                  </span>
                  <button
                    type="button"
                    class="mc-btn mc-btn--sm ${isOpen ? 'mc-btn--lapis' : ''}"
                    data-action="inspect-step"
                    data-step="${idx}"
                    data-burst="xp"
                    aria-expanded="${isOpen}"
                  >
                    ${isOpen ? '▴ Ocultar cálculo' : '🔍 Ver por qué'}
                  </button>
                </div>
              </div>

              <div class="mc-anvil-grid text-xs">
                <div class="mc-anvil-slot-box">
                  <span class="font-pixel text-lapis" style="font-size:0.6rem;">1º RANURA IZQUIERDA</span>
                  <div class="${st.leftIsItem && st.leftWork === 0 && plan.preApplied.size === 0 ? 'mc-slot' : 'mc-slot-enchanted'} mc-slot-trade mc-slot-interactive" data-action="inspect-step" data-step="${idx}" data-burst="spark">${leftIcon}</div>
                  <span style="font-weight:700; line-height:1.3;">${st.left}</span>
                </div>

                <div class="mc-trade-arrow" style="text-align:center;">+</div>

                <div class="mc-anvil-slot-box">
                  <span class="font-pixel text-gold" style="font-size:0.6rem;">2º RANURA DERECHA</span>
                  <div class="mc-slot-enchanted mc-slot-trade mc-slot-interactive" data-action="inspect-step" data-step="${idx}" data-burst="spark">${renderItemIcon('book_enchanted', { sizeClass: 'px-icon-md', enchanted: true })}</div>
                  <span style="font-weight:700; line-height:1.3;">${st.right}</span>
                </div>

                <div class="mc-trade-arrow" style="text-align:center;">➔</div>

                <div class="mc-anvil-slot-box mc-anvil-slot-box--result">
                  <span class="font-pixel text-emerald" style="font-size:0.6rem;">RESULTADO</span>
                  <div class="mc-slot-enchanted mc-slot-trade mc-slot-interactive" data-action="inspect-step" data-step="${idx}" data-burst="xp">${resultIcon}</div>
                  <span style="font-weight:800; line-height:1.3;">${st.result}</span>
                </div>
              </div>

              <div class="flex-between text-xs" style="background:#b5b5b5; border:1px solid #808080; padding:0.4rem 0.7rem;">
                <span><strong>Cálculo exacto:</strong> +${st.enchValue} por encantamiento + ${st.pwpTotal} de penalización acumulada (PWP).</span>
                <span class="font-mono text-muted">~${st.xpPoints.toLocaleString()} pts XP</span>
              </div>

              ${isOpen ? renderAnvilStepInspector(st, idx, plan) : ''}
            </div>
          </div>
        `;
      })
      .join('');
  }

  renderOrderComparisonPanel(plan);
}

function renderOrderComparisonPanel(plan) {
  const panel = document.getElementById('order-comparison-panel');
  if (!panel) return;
  const { optimalResult, naiveResult, displayName } = plan;

  if (optimalResult.steps.length <= 1) {
    panel.innerHTML = '';
    return;
  }

  const diffLevels = Math.max(0, naiveResult.totalLevels - optimalResult.totalLevels);
  const blockedCount = naiveResult.steps.filter(s => s.tooExpensive).length;

  const naiveRows = naiveResult.steps
    .map(
      (s, i) => `
        <div class="mc-dark-list-row ${s.tooExpensive ? 'mc-dark-list-row--danger' : ''}">
          <span>Paso ${i + 1}: Meter <strong>${s.bookName}</strong> directo al ${displayName}</span>
          <span class="font-mono" style="font-weight:700; color:${s.tooExpensive ? '#fda4af' : '#fde047'};">
            ${s.bookValue} + ${s.penalty} recargo = ${s.stepCost} Niv. ${s.tooExpensive ? '🚫 BLOQUEADO (>39)' : ''}
          </span>
        </div>
      `
    )
    .join('');

  panel.innerHTML = `
    <div class="mc-card mc-stack-sm">
      <div class="flex-row" style="border-bottom:2px solid #8a8a8a; padding-bottom:0.45rem;">
        <span>📊</span>
        <h3 class="font-pixel text-xs text-gold">Comparativa real: Orden Óptimo vs 1 a 1</h3>
      </div>

      <div class="mc-grid-2 text-xs">
        <div class="mc-compare-good mc-stack-xs">
          <span class="font-pixel" style="font-size:0.68rem;">✔ CON EL ORDEN ÓPTIMO</span>
          <div class="font-pixel" style="font-size:1.05rem;">${optimalResult.totalLevels} Niveles totales</div>
          <p>Paso más caro: <strong>${optimalResult.maxStepCost} niveles</strong> (≤ 39).</p>
        </div>

        <div class="mc-compare-bad mc-stack-xs">
          <span class="font-pixel" style="font-size:0.68rem;">✖ METIDOS UNO POR UNO</span>
          <div class="font-pixel" style="font-size:1.05rem;">${naiveResult.totalLevels} Niveles (+${diffLevels} extra)</div>
          <p>
            Paso más caro: <strong>${naiveResult.maxStepCost} niveles</strong>
            ${
              blockedCount > 0
                ? ` — <strong>¡${blockedCount} bloqueado(s) (>39)!</strong>`
                : ' (XP desperdiciada).'
            }
          </p>
        </div>
      </div>

      <div class="mc-recessed-dark" style="overflow:hidden;">
        <div class="mc-dark-list-header">SIMULACIÓN 1 A 1 DIRECTO AL OBJETO:</div>
        ${naiveRows}
      </div>
    </div>
  `;
}

function renderVillagerTab(state, plan) {
  const listEl = document.getElementById('villager-cards-list');
  const contextBanner = document.getElementById('villager-live-context');
  if (!listEl) return;

  if (contextBanner) {
    const relevantProfs = VILLAGER_DB.filter(v => v.relatedItems.includes(plan.item.id)).map(v => v.prof);
    contextBanner.innerHTML = `
      <div class="flex-row" style="align-items:flex-start;">
        <span>✨</span>
        <div class="text-xs">
          <strong>Destacados para ${plan.displayName} (${state.edition === 'java' ? 'Java' : 'Bedrock'}):</strong>
          ${
            relevantProfs.length > 0
              ? `<strong>${relevantProfs.join(', ')}</strong> + Bibliotecario y Clérigo.`
              : `<strong>Bibliotecario</strong> (libros) y <strong>Clérigo</strong> (XP/Lapis).`
          }
        </div>
      </div>
    `;
  }

  const q = state.villagerSearch.trim().toLowerCase();
  const prof = state.villagerProfFilter;

  const filtered = VILLAGER_DB.filter(v => {
    const matchProf = prof === 'ALL' || v.prof.startsWith(prof);
    const haystack = `${v.prof} ${v.station} ${v.item} ${v.cap} ${v.impossible}`.toLowerCase();
    return matchProf && (!q || haystack.includes(q));
  }).sort((a, b) => {
    const aMatch = a.relatedItems.includes(plan.item.id) ? 1 : 0;
    const bMatch = b.relatedItems.includes(plan.item.id) ? 1 : 0;
    return bMatch - aMatch;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="mc-card text-xs" style="text-align:center;">No se encontraron aldeanos que coincidan con "${state.villagerSearch}".</div>`;
    return;
  }

  listEl.innerHTML = filtered
    .map(v => {
      const isItemMatch = v.relatedItems.includes(plan.item.id);
      const isOpen = state.openVillagerInspectors.has(v.id);
      const activeProb = state.edition === 'java' ? v.probJava : v.probBedrock;

      return `
        <div class="mc-card mc-stack-xs ${isItemMatch ? 'mc-card-highlight' : ''}">
          <div class="flex-between">
            <div class="flex-row">
              <button type="button" class="px-actor-btn" data-action="inspect-villager" data-villager="${v.id}" data-burst="emerald" title="Haz clic para ver ficha táctica">
                ${renderActor(v.actorKey, { sizeClass: 'px-actor-sm' })}
              </button>
              <div>
                <div class="flex-row" style="gap:0.4rem;">
                  <strong class="font-pixel text-xs">${v.prof}</strong>
                  ${isItemMatch ? `<span class="mc-badge mc-badge--emerald font-pixel">★ PARA TU ${plan.item.name.toUpperCase()}</span>` : ''}
                </div>
                <span class="text-xs text-muted">Mesa: <strong>${v.station}</strong> · ${v.lvl}</span>
              </div>
            </div>
            <div class="flex-row">
              <span class="mc-badge mc-badge--dark font-pixel">
                ${state.edition === 'java' ? 'Java' : 'Bedrock'}: ${activeProb}
              </span>
              <button type="button" class="mc-btn mc-btn--sm ${isOpen ? 'mc-btn--lapis' : ''}" data-action="inspect-villager" data-villager="${v.id}" aria-expanded="${isOpen}">
                ${isOpen ? '▴ Ocultar' : 'ℹ Ficha'}
              </button>
            </div>
          </div>

          <div class="text-xs"><strong>Ofrece:</strong> ${v.item}</div>
          <div class="mc-grid-2 text-xs">
            <div style="background:#dcfce7; border:1px solid #15803d; padding:0.45rem 0.6rem; color:#14532d;">
              <strong>✔ Techo máximo posible:</strong> ${v.cap}
            </div>
            <div style="background:#fee2e2; border:1px solid #b91c1c; padding:0.45rem 0.6rem; color:#7f1d1d;">
              <strong>✖ Imposibles (0%):</strong> ${v.impossible}
            </div>
          </div>

          ${isOpen ? renderVillagerInspector(v, plan) : ''}
        </div>
      `;
    })
    .join('');
}

function renderRustTab(plan) {
  const codeBlock = document.getElementById('rust-code-block');
  const syncLabel = document.getElementById('rust-sync-badge');
  if (codeBlock) {
    codeBlock.textContent = generateRustSource(plan);
  }
  if (syncLabel) {
    syncLabel.textContent = `Sincronizado: ${plan.displayName} (${plan.bookEntries.length} libro${plan.bookEntries.length === 1 ? '' : 's'} · ${plan.optimalResult.totalLevels} Niv.)`;
  }
}
