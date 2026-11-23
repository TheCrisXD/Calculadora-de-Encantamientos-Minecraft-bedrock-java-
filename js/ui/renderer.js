// =============================================================================
// RENDERIZADOR PRINCIPAL DE TODAS LAS PESTAÑAS Y EVENTOS INTERACTIVOS
// =============================================================================

import { ENCHANTMENTS, ITEMS, MATERIALS, ROMAN, VILLAGER_DB } from '../data/catalog.js';
import { STRUCTURE_ONLY_ENCHANTS, VILLAGER_CAPS_BY_ITEM } from '../data/tableRules.js';
import { getEnchantConflict } from '../engine/strategy.js';
import { pwpCost } from '../engine/anvilDp.js';
import { generateRustSource } from '../engine/rustGenerator.js';
import { renderItemIcon } from '../pixelart/icons.js';
import { renderActor } from '../pixelart/actors.js';
import {
  renderLiveSummaryStrip,
  renderItemOriginBox,
  renderStage1GoldPreview,
  renderInterludeBeforeEnchants,
  renderInterludeBeforeReroll,
  renderInterludeBeforeAnvil,
  renderTheoryLiveContext
} from './reactiveBoxes.js';
import {
  renderEnchantInspector,
  renderAnvilStepInspector,
  renderVillagerInspector
} from './inspectors.js';

const ROUTE_NAMES = {
  clean: 'Ruta A · Objeto limpio + Libros exactos en árbol binario',
  villager: 'Ruta B · Pieza base pre-encantada de Aldeano + Libros restantes',
  gold: 'Ruta C · Mesa de Encantamientos Nv. 30 (Truco de Oro) + Libros restantes'
};

const PROF_TITLES = {
  armorer: 'ARMERO · ALTO HORNO',
  weaponsmith: 'HERRERO DE ARMAS · AFILADORA',
  toolsmith: 'HERRERO DE HERRAMIENTAS · MESA DE HERRERÍA',
  fletcher: 'FLECHERO · MESA DE FLECHAS',
  fisherman: 'PESCADOR · BARRIL'
};

export function renderAll(state, plan) {
  renderHeaderAndTabs(state, plan);
  renderLiveSummaryStrip(plan);
  renderStage1(state, plan);
  renderInterludeBeforeEnchants(plan);
  renderStage2Enchants(state, plan);
  renderInterludeBeforeReroll(plan);
  renderRouteSection(state, plan);
  renderStage3Rerolls(plan);
  renderStage35Showcase(state, plan);
  renderInterludeBeforeAnvil(plan);
  renderStage4Anvil(state, plan);
  renderVillagerTab(state, plan);
  renderTheoryLiveContext(plan);
  renderRustTab(plan);
}

function renderHeaderAndTabs(state, plan) {
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
    iconSlot.title = `Haz clic para inspeccionar ${plan.displayName}`;
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
  renderStage1GoldPreview(plan);
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

function renderRouteSection(state, plan) {
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
        <span style="font-size:1.15rem;">🏆</span>
        <div class="text-xs mc-stack-xs" style="flex:1;">
          <div class="font-pixel text-xs text-emerald">Sugerencia óptima: ${ROUTE_NAMES[plan.recommended]}</div>
          <p style="line-height:1.55;">${plan.reason}</p>
        </div>
      </div>
    `;
  }

  // Update radio buttons & availability
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
      : `No disponible: ningún aldeano vende ${plan.displayName} encantado directamente.`;
  }

  const descGold = document.getElementById('desc-gold-trick');
  if (descGold) {
    if (!plan.item.hasEnchantTable) {
      descGold.textContent = 'No disponible: este objeto no se puede meter en la Mesa de Encantamientos.';
    } else if (plan.goldStats.supported && plan.goldStats.comboTargets.length > 0) {
      const comboPreview = plan.goldStats.comboTargets
        .map(t => `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}`)
        .join(' + ');
      descGold.textContent = `Aprox. ~${plan.goldStats.goldRerollsFull} re-rolls con pala de oro (~${plan.goldStats.lapisFull} Lapis) para sacar ${comboPreview} antes del yunque${plan.goldStats.goldRerolls2 ? ` (o ~${plan.goldStats.goldRerolls2} si aceptas 2 objetivos)` : ''}.`;
    } else {
      const enchVal = plan.mat
        ? plan.item.isArmor
          ? plan.mat.enchArmor
          : plan.mat.enchTool
        : plan.item.enchantability || 0;
      descGold.textContent = `Usa herramientas de oro para refrescar la mesa (encantabilidad de ${plan.mat ? plan.mat.name : plan.item.name}: ${enchVal}) antes de usar el yunque.`;
    }
  }

  // Live cost tags per route option
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

  renderGoldTrickDeepAnalysis(plan);
}

function renderGoldTrickDeepAnalysis(plan) {
  const panel = document.getElementById('gold-trick-deep-analysis');
  if (!panel) return;

  const goldStats = plan.goldStats;
  if (
    !goldStats ||
    !goldStats.supported ||
    goldStats.perEnchant.length === 0 ||
    (plan.strategy !== 'gold' && plan.recommended !== 'gold')
  ) {
    panel.classList.add('hidden');
    return;
  }

  const comboNames = goldStats.comboTargets
    .map(t => `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}`)
    .join(' + ');

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
        badge = `<span class="mc-badge mc-badge--gold font-pixel">MÁX. ${ROMAN[e.maxReachable]} EN MESA</span>`;
        statsText = `<span class="text-light-gold">Nv. ${ROMAN[e.maxReachable]}: ${(e.probTableTarget * 100).toFixed(1)}% (~${rPart} int.) · Pista visible: ${(e.probClue * 100).toFixed(1)}%</span>`;
      } else {
        const rExact = Math.max(1, Math.round(1 / e.probExact));
        badge = `<span class="mc-badge mc-badge--emerald font-pixel">POSIBLE NV. ${ROMAN[e.desiredLvl]}</span>`;
        statsText = `<span class="text-light-emerald">Prob: ${(e.probExact * 100).toFixed(1)}% (~${rExact} int.) · Pista visible: ${(e.probClue * 100).toFixed(1)}%</span>`;
      }

      return `
        <div class="mc-dark-list-row">
          <div class="flex-row">
            <strong style="color:#ffffff;">${enchName}</strong>
            ${badge}
          </div>
          <div class="font-mono">${statsText}</div>
        </div>
      `;
    })
    .join('');

  panel.innerHTML = `
    <div class="flex-between" style="border-bottom:2px solid #8a8a8a; padding-bottom:0.55rem;">
      <div class="flex-row">
        <span>🔬</span>
        <h3 class="font-pixel text-xs text-gold">Probabilidades exactas en Mesa Nv. 30 + Truco del Oro</h3>
      </div>
      <span class="mc-badge mc-badge--gold font-pixel">
        ${plan.displayName} (E=${goldStats.enchantability} · Nv. Mod. ${goldStats.minMod}–${goldStats.maxMod})
      </span>
    </div>

    ${
      goldStats.comboTargets.length > 0
        ? `<div class="mc-grid-4">
            <div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Combo completo mesa</span>
              <div class="mc-kpi-value text-light-gold">~${goldStats.goldRerollsFull} re-rolls</div>
              <span class="mc-kpi-sub">${(goldStats.probComboFull * 100).toFixed(1)}% / tirada</span>
            </div>
            <div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Mínimo 2 objetivos</span>
              <div class="mc-kpi-value mc-xp-text">~${goldStats.goldRerolls2} re-rolls</div>
              <span class="mc-kpi-sub">${(goldStats.probComboAtLeast2 * 100).toFixed(1)}% / tirada</span>
            </div>
            <div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Lapislázuli aprox.</span>
              <div class="mc-kpi-value text-light-cyan">~${goldStats.lapisFull} Lapis</div>
              <span class="mc-kpi-sub">1/reset + 3 final</span>
            </div>
            <div class="mc-recessed-dark mc-kpi-box">
              <span class="mc-kpi-label">Pista útil ranura 3</span>
              <div class="mc-kpi-value text-light-emerald">${(goldStats.probAnyTargetClue * 100).toFixed(1)}%</div>
              <span class="mc-kpi-sub">Ves pista antes de pagar</span>
            </div>
          </div>
          <div class="mc-tip-box text-xs mc-stack-xs">
            <div><strong>🎯 Qué buscar en Mesa Nv. 30:</strong> <span class="text-emerald" style="font-weight:800;">${comboNames}</span></div>
            <p>
              <strong>Cómo hacer los ~${goldStats.goldRerollsFull} re-rolls con Truco del Oro:</strong> Pon tu <strong>${plan.displayName}</strong> en la mesa y mira la vista previa de Nivel 30. Si la pista <strong>NO</strong> muestra uno de tus objetivos, retíralo, encanta una <strong>pala de oro en la 1ª ranura (1 nivel + 1 lápiz)</strong>, pásala por la <strong>Afiladora</strong> para recuperar XP y vuelve a revisar.
            </p>
          </div>`
        : `<p class="text-xs text-danger" style="font-weight:700;">Ninguno de los encantamientos elegidos puede salir en la Mesa de Encantamientos para este objeto/material.</p>`
    }

    <div class="mc-recessed-dark" style="overflow:hidden;">
      <div class="mc-dark-list-header">DESGLOSE EXACTO POR ENCANTAMIENTO EN MESA NV. 30 (15 LIBRERÍAS):</div>
      ${rowsHtml}
    </div>
  `;
  panel.classList.remove('hidden');
}

function renderStage3Rerolls(plan) {
  const banner = document.getElementById('reroll-summary-banner');
  const container = document.getElementById('reroll-cards-container');
  if (!banner || !container) return;

  if (plan.bookEntries.length === 0) {
    banner.innerHTML = `
      <div class="text-xs" style="font-weight:700;">
        ${
          plan.activeKeys.length === 0
            ? 'No has seleccionado encantamientos todavía.'
            : plan.strategy === 'gold' && plan.goldStats.goldRerollsFull
              ? `🎉 ¡Solo necesitas ~${plan.goldStats.goldRerollsFull} re-rolls con Truco del Oro en Mesa Nv. 30 y 0 libros de bibliotecarios!`
              : '🎉 ¡No necesitas buscar ningún libro en bibliotecarios con esta configuración!'
        }
      </div>
    `;
    container.innerHTML = '';
    return;
  }

  let totalNoviceRerolls = 0;
  let totalFullMenuRerolls = 0;
  let librarianBooksCount = 0;

  container.innerHTML = plan.bookEntries
    .map(b => {
      const { stats } = b;
      if (stats.avgRerolls) {
        totalNoviceRerolls += stats.avgRerolls;
        totalFullMenuRerolls += stats.avgFullMenuRerolls;
        librarianBooksCount++;
      }

      return `
        <div class="mc-card mc-stack-xs">
          <div class="flex-between">
            <div class="flex-row">
              <div class="mc-slot-enchanted" style="width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                ${renderItemIcon('book_enchanted', { sizeClass: 'px-icon-sm', enchanted: true })}
              </div>
              <div>
                <div class="text-sm" style="font-weight:800;">
                  Libro: ${ENCHANTMENTS[b.key].name} ${ROMAN[b.bookLvl]}${
                    b.isUpgradeFromTable
                      ? ` <span class="text-gold">(sube tu Nv. ${ROMAN[b.bookLvl]} de mesa → ${ROMAN[b.finalLvl]})</span>`
                      : ''
                  }
                </div>
                <span class="text-xs text-emerald" style="font-weight:700;">${stats.method}</span>
              </div>
            </div>
            <div class="flex-row">
              <span class="mc-badge mc-badge--dark font-pixel" title="Rompiendo y poniendo el atril (solo 1er nivel)">
                ${stats.avgRerolls ? `Atril: ~${stats.avgRerolls} int.` : 'Cofre / Trueque'}
              </span>
              ${
                stats.avgFullMenuRerolls
                  ? `<span class="mc-badge mc-badge--lapis font-pixel" title="Viendo los 4 niveles sin haberle tradeado aún">4 Niveles: ~${stats.avgFullMenuRerolls} int.</span>`
                  : ''
              }
            </div>
          </div>

          <div class="mc-grid-2 text-xs" style="background:#b5b5b5; padding:0.45rem 0.65rem; border:1px solid #7a7a7a;">
            <div><span class="text-muted">Suerte 1er hueco (Atril):</span> <strong class="font-mono">${stats.noviceProbText}</strong></div>
            <div><span class="text-muted">Viendo 4 niveles:</span> <strong class="font-mono text-lapis">${stats.fullMenuProbText}</strong></div>
          </div>
          <p class="text-xs text-muted">${stats.detail}</p>
        </div>
      `;
    })
    .join('');

  banner.innerHTML = `
    <div class="flex-between" style="align-items:flex-start;">
      <div class="text-xs mc-stack-xs" style="flex:1;">
        <span style="font-weight:800; text-transform:uppercase;" class="text-muted">
          Estimación total para tu ruta (${plan.bookEntries.length} ${plan.bookEntries.length === 1 ? 'libro' : 'libros'}${plan.strategy === 'gold' && plan.goldStats.goldRerollsFull ? ' + Mesa Nv. 30' : ''})
        </span>
        ${
          plan.strategy === 'gold' && plan.goldStats.goldRerollsFull
            ? `<p class="text-gold">• <strong>Mesa Nv. 30 + Truco del Oro (pieza base):</strong> aprox. <strong>~${plan.goldStats.goldRerollsFull} re-rolls con pala de oro</strong> (~${plan.goldStats.lapisFull} lapislázuli).</p>`
            : ''
        }
        ${
          librarianBooksCount > 0
            ? `<p>• <strong>Método Atril (1er hueco):</strong> en promedio <strong>~${totalNoviceRerolls} intentos</strong> rompiendo y poniendo el atril.</p>
               <p class="text-lapis">• <strong>Viendo los 4 niveles sin tradear:</strong> baja a solo <strong>~${totalFullMenuRerolls} aldeanos</strong> revisados en total.</p>`
            : `<p>Tus libros elegidos se consiguen explorando estructuras o haciendo trueques.</p>`
        }
      </div>
      <div class="mc-recessed-dark" style="padding:0.45rem 0.85rem; text-align:center;">
        <span class="mc-kpi-label">Libros a buscar</span>
        <span class="font-pixel text-light-gold" style="font-size:1.15rem;">${plan.bookEntries.length}</span>
      </div>
    </div>
  `;
}

function renderStage35Showcase(state, plan) {
  const container = document.getElementById('minecraft-live-gui-showcase');
  if (!container) return;

  const matId = plan.mat ? plan.mat.id : 'diamond';
  const itemIconClean = renderItemIcon(plan.item.icon, { materialId: matId, enchanted: false, sizeClass: 'px-icon-md' });
  const itemIconEnch = renderItemIcon(plan.item.icon, { materialId: matId, enchanted: true, sizeClass: 'px-icon-md' });
  const cards = [];

  const buildPertinentText = sourceType => {
    const preList = [...plan.preApplied].map(k => `${ENCHANTMENTS[k].name} ${ROMAN[state.selectedEnchants[k]]}`);
    if (sourceType === 'villager') {
      const pool = VILLAGER_CAPS_BY_ITEM[plan.item.id] || ['Irrompibilidad III'];
      const selectedNames = plan.activeKeys.map(k => ENCHANTMENTS[k].name);
      const relevant = pool.filter(p => selectedNames.some(s => p.startsWith(s)) || p.includes('Irrompibilidad'));
      const finalPool = relevant.length > 0 ? relevant : pool.slice(0, 3);
      return preList.length > 0
        ? `Busca que salga con: ${preList.join(' + ')} (posibles útiles: ${finalPool.join(', ')})`
        : `Posibles útiles según tu selección: ${finalPool.join(', ')}`;
    }
    if (sourceType === 'gold' && plan.goldStats.supported && plan.goldStats.comboTargets.length > 0) {
      const exactCombo = plan.goldStats.comboTargets
        .map(t => `${ENCHANTMENTS[t.key].name} ${ROMAN[t.practicalLvl]}`)
        .join(' + ');
      return `Objetivo real en Mesa Nv. 30: ${exactCombo} (~${plan.goldStats.goldRerollsFull} re-rolls oro)`;
    }
    return 'Encantamientos base aleatorios de nivel 30';
  };

  if (plan.strategy === 'villager' && plan.hasVillagerForMat) {
    const actorKey = plan.item.actorKey || 'armorer';
    cards.push(`
      <div>
        <div class="mc-vanilla-header-tab">
          <button type="button" class="px-actor-btn" data-action="poke-actor" data-actor="${actorKey}" data-burst="emerald" title="Haz clic para hablar con el aldeano">
            ${renderActor(actorKey, { sizeClass: 'px-actor-sm' })}
          </button>
          <span class="font-pixel text-xs">${PROF_TITLES[actorKey] || 'ALDEANO DE EQUIPAMIENTO'}</span>
        </div>
        <div class="mc-vanilla-gui mc-stack-sm">
          <div class="flex-between" style="border-bottom:2px solid #8b8b8b; padding-bottom:0.45rem;">
            <span class="font-pixel text-xs">TRADEO DE PIEZA BASE PRE-ENCANTADA</span>
            <span class="mc-badge mc-badge--xp">Ahorra ${plan.preApplied.size} libro(s)</span>
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
              <span class="text-xs" style="font-weight:800; margin-top:0.25rem;">${plan.displayName} encantado</span>
              <span class="mc-trade-caption">${buildPertinentText('villager')}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  } else if (plan.strategy === 'gold' && plan.item.hasEnchantTable) {
    const rerollBadgeText =
      plan.goldStats.goldRerollsFull
        ? `~${plan.goldStats.goldRerollsFull} re-rolls oro · ~${plan.goldStats.lapisFull} Lapis`
        : 'Coste: 3 Niv. + 3 Lapis';
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
            <span class="font-pixel text-xs">ENCANTAMIENTO DIRECTO CON ROTACIÓN DE SEMILLA</span>
            <span class="mc-badge mc-badge--dark">${rerollBadgeText}</span>
          </div>
          <div class="mc-trade-row">
            <div class="mc-trade-box">
              <span class="font-pixel" style="font-size:0.6rem; margin-bottom:0.3rem;">1º OBJETO LIMPIO</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="rune">${itemIconClean}</div>
              <span class="text-xs" style="font-weight:700; margin-top:0.25rem;">${plan.displayName}</span>
            </div>
            <div class="mc-trade-box">
              <span class="font-pixel text-lapis" style="font-size:0.6rem; margin-bottom:0.3rem;">2º LAPISLÁZULI</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="rune">${renderItemIcon('lapis', { sizeClass: 'px-icon-md' })}</div>
              <span class="text-xs" style="font-weight:700; margin-top:0.25rem;">3 Lapislázuli</span>
            </div>
            <div class="mc-trade-box">
              <span class="font-pixel text-gold" style="font-size:0.6rem; margin-bottom:0.3rem;">SI SALE MAL</span>
              <div class="mc-slot mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="spark">${renderItemIcon('gold_shovel', { sizeClass: 'px-icon-md' })}</div>
              <span class="text-xs text-gold" style="font-weight:700; margin-top:0.25rem;">Pala Oro (1 Niv.)</span>
            </div>
            <div class="mc-trade-arrow">➔</div>
            <div class="mc-trade-box mc-trade-box--result">
              <span class="font-pixel text-emerald" style="font-size:0.6rem; margin-bottom:0.3rem;">RECIBES</span>
              <div class="mc-slot-enchanted mc-slot-trade mc-slot-interactive" data-action="burst-slot" data-burst="xp">${itemIconEnch}</div>
              <span class="text-xs" style="font-weight:800; margin-top:0.25rem;">${plan.displayName} encantado</span>
              <span class="mc-trade-caption">${buildPertinentText('gold')}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  } else if (plan.item.id === 'elytra' || plan.item.id === 'trident') {
    const isElytra = plan.item.id === 'elytra';
    const actorKey = isElytra ? 'end_ship' : 'drowned';
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
          <div class="text-xs" style="flex:1;">
            <strong style="display:block;">Recibes: ${plan.displayName} (sin encantar)</strong>
            <span>${plan.item.originDesc}</span>
          </div>
        </div>
      </div>
    `);
  }

  const librarianBooks = plan.bookEntries.filter(b => !STRUCTURE_ONLY_ENCHANTS.has(b.key));
  if (librarianBooks.length > 0) {
    const bookBadges = librarianBooks
      .map(
        b =>
          `${ENCHANTMENTS[b.key].name} ${ROMAN[b.bookLvl]}${b.isUpgradeFromTable ? ` (sube ${ROMAN[b.bookLvl]}→${ROMAN[b.finalLvl]})` : ''}`
      )
      .join(', ');

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
            <span class="font-pixel text-xs">INTERCAMBIO DE LIBROS (${librarianBooks.length} ${librarianBooks.length === 1 ? 'LIBRO' : 'LIBROS'})</span>
            <span class="mc-badge mc-badge--xp">Bloquea comprando 1 vez</span>
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
              <span class="mc-trade-caption">Con: <strong>${bookBadges}</strong></span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  const speechHtml = state.actorSpeech
    ? `<div class="mc-speech-bubble" role="status">
        <div>${state.actorSpeech}</div>
        <button type="button" class="mc-btn mc-btn--sm" data-action="close-speech" aria-label="Cerrar mensaje">✕</button>
      </div>`
    : '';

  if (cards.length === 0) {
    container.innerHTML = `
      <div class="mc-card text-xs" style="text-align:center; font-weight:700;">
        ${
          plan.activeKeys.length === 0
            ? 'Selecciona tus encantamientos en la Etapa 2 para desplegar las interfaces de intercambio correspondientes.'
            : '✔ Partes de un objeto limpio sin intercambios previos; pasa directamente a la Etapa 4.'
        }
      </div>
      ${speechHtml}
    `;
  } else {
    container.innerHTML = `${speechHtml}${cards.join('')}`;
  }
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
        <div class="font-pixel text-xs text-danger">⚠ ¡CUIDADO! Un paso cuesta ${optimalResult.maxStepCost} niveles (el máximo en Minecraft es 39)</div>
        <p style="margin-top:0.25rem;">Sube a la sección <strong>RUTA SUGERIDA</strong> y elige <strong>Ruta C (Mesa Nv. 30 + Truco de Oro)</strong> o <strong>Ruta B (Aldeano)</strong> para traer encantamientos ya aplicados en la pieza base.</p>
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
        <h3 class="font-pixel text-xs text-gold">¿Qué pasaría si NO los pusieras en este orden? (Con números reales)</h3>
      </div>

      <p class="text-xs" style="line-height:1.55;">
        Si metieras los <strong>${naiveResult.steps.length} libros uno por uno</strong> directamente sobre tu <strong>${displayName}</strong>, el recargo por trabajos previos subiría exponencialmente (<code class="mc-code-inline">+0, +1, +3, +7, +15, +31</code>):
      </p>

      <div class="mc-grid-2 text-xs">
        <div class="mc-compare-good mc-stack-xs">
          <span class="font-pixel" style="font-size:0.68rem;">✔ CON EL ORDEN ÓPTIMO DE ARRIBA</span>
          <div class="font-pixel" style="font-size:1.05rem;">${optimalResult.totalLevels} Niveles totales</div>
          <p>Paso más caro: <strong>${optimalResult.maxStepCost} niveles</strong> (Dentro del límite de 39).</p>
        </div>

        <div class="mc-compare-bad mc-stack-xs">
          <span class="font-pixel" style="font-size:0.68rem;">✖ SI LOS METES UNO POR UNO</span>
          <div class="font-pixel" style="font-size:1.05rem;">${naiveResult.totalLevels} Niveles totales (+${diffLevels} extra)</div>
          <p>
            Paso más caro: <strong>${naiveResult.maxStepCost} niveles</strong>
            ${
              blockedCount > 0
                ? ` — <strong>¡${blockedCount} ${blockedCount === 1 ? 'paso se bloquea' : 'pasos se bloquean'} con "¡Demasiado caro!"!</strong>`
                : ' (Gastas experiencia innecesaria).'
            }
          </p>
        </div>
      </div>

      <div class="mc-recessed-dark" style="overflow:hidden;">
        <div class="mc-dark-list-header">SIMULACIÓN DEL MAL ORDEN (1 A 1 DIRECTO AL OBJETO):</div>
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
    const relevantProfs = VILLAGER_DB.filter(
      v => v.relatedItems.includes(plan.item.id)
    ).map(v => v.prof);
    contextBanner.innerHTML = `
      <div class="flex-row" style="align-items:flex-start;">
        <span>✨</span>
        <div class="text-xs">
          <strong>Filtro inteligente para tu ${plan.displayName} (${state.edition === 'java' ? 'Java' : 'Bedrock'}):</strong>
          ${
            relevantProfs.length > 0
              ? `Se destacan arriba <strong>${relevantProfs.join(', ')}</strong> + Bibliotecario y Clérigo.`
              : `Ningún aldeano vende ${plan.displayName} encantado; prioriza <strong>Bibliotecario</strong> (libros) y <strong>Clérigo</strong> (XP/Lapis).`
          }
          Haz clic en cualquier tarjeta o aldeano para abrir su ficha táctica.
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
    // Prioritize villagers specifically matching current item
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
