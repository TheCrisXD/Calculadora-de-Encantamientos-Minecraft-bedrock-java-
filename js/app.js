// =============================================================================
// PUNTO DE ENTRADA PRINCIPAL Y GESTIÓN DE ESTADO REACTIVO
// =============================================================================

import { ENCHANTMENTS } from './data/catalog.js';
import { computeFullPlan, getEnchantConflict, getItemById } from './engine/strategy.js';
import { spawnPixelBurst } from './pixelart/actors.js';
import { getActorSpeech } from './ui/inspectors.js';
import { renderAll } from './ui/renderer.js';

const state = {
  itemId: 'pickaxe',
  materialId: 'diamond',
  edition: 'java',
  activeTab: 'calc',
  selectedEnchants: {},
  manualStrategy: null,
  editionNotice: null,
  actorSpeech: null,
  villagerSearch: '',
  villagerProfFilter: 'ALL',
  openEnchantInspectors: new Set(),
  openStepInspectors: new Set(),
  openVillagerInspectors: new Set()
};

let currentPlan = null;

function applyGodRoll(itemId) {
  const item = getItemById(itemId);
  const next = { ...item.godRoll };
  if (state.edition === 'bedrock' && next.sweeping_edge) {
    delete next.sweeping_edge;
  }
  state.selectedEnchants = next;
}

function syncAndRender() {
  currentPlan = computeFullPlan({
    itemId: state.itemId,
    materialId: state.materialId,
    edition: state.edition,
    selectedEnchants: state.selectedEnchants,
    manualStrategy: state.manualStrategy
  });
  renderAll(state, currentPlan);
}

function triggerElementPop(el) {
  if (!el) return;
  el.classList.remove('is-popping', 'is-reacting');
  // Force reflow so rapid clicks replay animation cleanly
  void el.offsetWidth;
  el.classList.add('is-popping', 'is-reacting');
}

function bindEvents() {
  // Edition switch
  document.getElementById('btn-ed-java')?.addEventListener('click', e => {
    if (state.edition === 'java') return;
    state.edition = 'java';
    state.editionNotice = 'Cambiado a Java Edition (pool de 37 libros y 100% en ranuras Maestro de equipamiento).';
    spawnPixelBurst(e.currentTarget, 'emerald');
    syncAndRender();
  });

  document.getElementById('btn-ed-bedrock')?.addEventListener('click', e => {
    if (state.edition === 'bedrock') return;
    state.edition = 'bedrock';
    let removedMsg = '';
    if (state.selectedEnchants.sweeping_edge) {
      delete state.selectedEnchants.sweeping_edge;
      removedMsg = ' Se desactivó Filo Arrasador (exclusivo de Java).';
    }
    state.editionNotice = `Cambiado a Bedrock Edition (pool de ~30 libros y 50% por pieza en aldeanos).${removedMsg}`;
    spawnPixelBurst(e.currentTarget, 'emerald');
    syncAndRender();
  });

  // Tab navigation
  document.querySelectorAll('[data-tab-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.tabTarget;
      syncAndRender();
    });
  });

  // Item & Material selects
  document.getElementById('item-select')?.addEventListener('change', e => {
    const nextItemId = e.target.value;
    const nextItem = getItemById(nextItemId);
    state.itemId = nextItemId;
    if (nextItem.materials.length > 0) {
      if (!nextItem.materials.includes(state.materialId)) {
        state.materialId = nextItem.materials.includes('diamond') ? 'diamond' : nextItem.materials[0];
      }
    }
    state.manualStrategy = null;
    state.editionNotice = null;
    state.actorSpeech = null;
    state.openEnchantInspectors.clear();
    state.openStepInspectors.clear();
    applyGodRoll(nextItemId);
    syncAndRender();
    const heroSlot = document.getElementById('selected-item-icon');
    triggerElementPop(heroSlot);
    spawnPixelBurst(heroSlot, 'rune');
  });

  document.getElementById('material-select')?.addEventListener('change', e => {
    state.materialId = e.target.value;
    state.manualStrategy = null;
    state.editionNotice = null;
    state.openStepInspectors.clear();
    syncAndRender();
    const heroSlot = document.getElementById('selected-item-icon');
    triggerElementPop(heroSlot);
    spawnPixelBurst(heroSlot, state.materialId === 'gold' ? 'spark' : 'xp');
  });

  // Hero item slot interactive click
  document.getElementById('selected-item-icon')?.addEventListener('click', e => {
    triggerElementPop(e.currentTarget);
    spawnPixelBurst(e.currentTarget, state.selectedEnchants && Object.keys(state.selectedEnchants).length > 0 ? 'xp' : 'spark');
  });

  // Header anvil interactive click
  document.getElementById('header-anvil-icon')?.addEventListener('click', e => {
    triggerElementPop(e.currentTarget);
    spawnPixelBurst(e.currentTarget, 'spark');
  });

  // God Roll & Clear buttons
  document.getElementById('btn-god-roll')?.addEventListener('click', e => {
    applyGodRoll(state.itemId);
    state.manualStrategy = null;
    state.openStepInspectors.clear();
    spawnPixelBurst(e.currentTarget, 'xp');
    syncAndRender();
  });

  document.getElementById('btn-clear-enchants')?.addEventListener('click', () => {
    state.selectedEnchants = {};
    state.manualStrategy = null;
    state.openStepInspectors.clear();
    syncAndRender();
  });

  // Route selection radios
  document.querySelectorAll('input[name="base-strategy"]').forEach(radio => {
    radio.addEventListener('change', e => {
      if (e.target.checked) {
        state.manualStrategy = e.target.value;
        state.openStepInspectors.clear();
        syncAndRender();
      }
    });
  });

  document.getElementById('btn-reset-recommended')?.addEventListener('click', e => {
    state.manualStrategy = null;
    state.openStepInspectors.clear();
    spawnPixelBurst(e.currentTarget, 'emerald');
    syncAndRender();
  });

  // Villager filters (Tab 2)
  document.getElementById('villager-search')?.addEventListener('input', e => {
    state.villagerSearch = e.target.value;
    syncAndRender();
  });

  document.getElementById('villager-filter-prof')?.addEventListener('change', e => {
    state.villagerProfFilter = e.target.value;
    syncAndRender();
  });

  // Copy Rust code (Tab 4)
  document.getElementById('btn-copy-rust')?.addEventListener('click', async e => {
    const code = document.getElementById('rust-code-block')?.textContent || '';
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(code);
      btn.textContent = '✔ ¡Copiado!';
      spawnPixelBurst(btn, 'xp');
      setTimeout(() => {
        btn.textContent = 'Copiar Código';
      }, 1800);
    } catch {
      btn.textContent = 'Usa Ctrl+C';
    }
  });

  // Global event delegation for dynamic elements (enchants, inspectors, actors, anvil steps)
  document.addEventListener('change', e => {
    const target = e.target;
    if (target.matches('[data-action="toggle-enchant"]')) {
      const key = target.dataset.key;
      if (state.selectedEnchants[key]) {
        delete state.selectedEnchants[key];
      } else {
        if (getEnchantConflict(state.itemId, state.edition, state.selectedEnchants, key)) return;
        state.selectedEnchants[key] = ENCHANTMENTS[key].maxLvl;
        spawnPixelBurst(target, 'xp');
      }
      state.openStepInspectors.clear();
      syncAndRender();
    }
  });

  document.addEventListener('click', e => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'step-level') {
      const key = actionEl.dataset.key;
      const delta = Number(actionEl.dataset.delta);
      if (!state.selectedEnchants[key]) return;
      const max = ENCHANTMENTS[key].maxLvl;
      state.selectedEnchants[key] = Math.min(max, Math.max(1, state.selectedEnchants[key] + delta));
      state.openStepInspectors.clear();
      spawnPixelBurst(actionEl, 'xp');
      syncAndRender();
      return;
    }

    if (action === 'inspect-enchant') {
      const key = actionEl.dataset.key;
      if (state.openEnchantInspectors.has(key)) {
        state.openEnchantInspectors.delete(key);
      } else {
        state.openEnchantInspectors.add(key);
      }
      syncAndRender();
      return;
    }

    if (action === 'inspect-step') {
      const stepIdx = Number(actionEl.dataset.step);
      if (state.openStepInspectors.has(stepIdx)) {
        state.openStepInspectors.delete(stepIdx);
      } else {
        state.openStepInspectors.add(stepIdx);
      }
      spawnPixelBurst(actionEl, actionEl.dataset.burst || 'spark');
      syncAndRender();
      const card = document.querySelector(`[data-step-card="${stepIdx}"]`);
      if (card) {
        card.classList.add('is-striking');
        setTimeout(() => card.classList.remove('is-striking'), 500);
      }
      return;
    }

    if (action === 'inspect-villager') {
      const vId = actionEl.dataset.villager;
      if (state.openVillagerInspectors.has(vId)) {
        state.openVillagerInspectors.delete(vId);
      } else {
        state.openVillagerInspectors.add(vId);
        spawnPixelBurst(actionEl, 'emerald');
      }
      syncAndRender();
      return;
    }

    if (action === 'poke-actor') {
      const actorKey = actionEl.dataset.actor;
      triggerElementPop(actionEl);
      spawnPixelBurst(actionEl, actionEl.dataset.burst || 'emerald');
      state.actorSpeech = getActorSpeech(actorKey, currentPlan);
      syncAndRender();
      return;
    }

    if (action === 'close-speech') {
      state.actorSpeech = null;
      syncAndRender();
      return;
    }

    if (action === 'burst-slot') {
      triggerElementPop(actionEl);
      spawnPixelBurst(actionEl, actionEl.dataset.burst || 'xp');
    }
  });
}

function init() {
  applyGodRoll(state.itemId);
  bindEvents();
  syncAndRender();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
