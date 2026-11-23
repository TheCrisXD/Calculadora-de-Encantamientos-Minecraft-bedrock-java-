import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ITEMS, MATERIALS } from '../js/data/catalog.js';
import { pwpCost, xpForLevel, solveOptimalAnvilTree, solveLinearNaive } from '../js/engine/anvilDp.js';
import { analyzeEnchantingTable, areEnchantsIncompatible, triangularCdf } from '../js/engine/enchantingTable.js';
import { computeFullPlan, getEnchantConflict, getEnchantRerollStats } from '../js/engine/strategy.js';
import { generateRustSource } from '../js/engine/rustGenerator.js';

test('pwpCost follows 2^w - 1', () => {
  assert.equal(pwpCost(0), 0);
  assert.equal(pwpCost(1), 1);
  assert.equal(pwpCost(2), 3);
  assert.equal(pwpCost(3), 7);
  assert.equal(pwpCost(4), 15);
  assert.equal(pwpCost(5), 31);
});

test('xpForLevel matches official Minecraft piecewise curve', () => {
  assert.equal(xpForLevel(0), 0);
  assert.equal(xpForLevel(16), 352);
  assert.equal(xpForLevel(30), 1395);
  assert.equal(xpForLevel(39), 2727);
});

test('solveOptimalAnvilTree outperforms naive linear order on 6-enchant god-roll sword', () => {
  const plan = computeFullPlan({
    itemId: 'sword',
    materialId: 'diamond',
    edition: 'java',
    selectedEnchants: {
      sharpness: 5,
      unbreaking: 3,
      looting: 3,
      fire_aspect: 2,
      sweeping_edge: 3,
      mending: 1
    },
    manualStrategy: 'clean'
  });

  assert.equal(plan.optimalResult.steps.length, 6);
  assert.ok(plan.optimalResult.maxStepCost <= 39, 'Optimal tree must stay <= 39');
  assert.ok(
    plan.optimalResult.totalLevels < plan.naiveResult.totalLevels,
    `Optimal (${plan.optimalResult.totalLevels}) should beat naive (${plan.naiveResult.totalLevels})`
  );
  // Every combined book step should list concrete enchants rather than generic placeholder
  for (const step of plan.optimalResult.steps) {
    assert.ok(step.resultEnchants.length > 0);
    assert.equal(step.cost, step.enchValue + step.leftPwp + step.rightPwp);
  }
});

test('conflict rules enforce Bow, Trident, Mace, and Bedrock exclusivity', () => {
  assert.equal(areEnchantsIncompatible('bow', 'infinity', 'mending'), true);
  assert.equal(areEnchantsIncompatible('trident', 'riptide', 'loyalty'), true);
  assert.equal(areEnchantsIncompatible('trident', 'riptide', 'channeling'), true);
  assert.equal(areEnchantsIncompatible('trident', 'loyalty', 'channeling'), false);
  assert.equal(areEnchantsIncompatible('mace', 'density', 'breach'), true);
  assert.equal(areEnchantsIncompatible('mace', 'density', 'smite'), true);
  assert.equal(areEnchantsIncompatible('mace', 'breach', 'bane_arthropods'), true);
  assert.equal(areEnchantsIncompatible('mace', 'density', 'wind_burst'), false);

  assert.match(
    getEnchantConflict('sword', 'bedrock', {}, 'sweeping_edge'),
    /Exclusivo de Java/
  );
  assert.equal(getEnchantConflict('sword', 'java', {}, 'sweeping_edge'), null);
});

test('Enchanting Table engine reproduces Diamond Pickaxe Efficiency V cap (0% at maxMod 40)', () => {
  assert.equal(triangularCdf(-1), 0);
  assert.equal(triangularCdf(0), 0.5);
  assert.equal(triangularCdf(1), 1);

  const pickaxe = ITEMS.find(i => i.id === 'pickaxe');
  const stats = analyzeEnchantingTable(
    pickaxe,
    MATERIALS.diamond,
    { efficiency: 5, unbreaking: 3, fortune: 3, mending: 1 },
    'java'
  );

  assert.equal(stats.supported, true);
  assert.equal(stats.maxMod, 40);

  const eff = stats.perEnchant.find(e => e.key === 'efficiency');
  assert.equal(eff.status, 'partial');
  assert.equal(eff.maxReachable, 4);
  assert.equal(eff.probExact, 0);

  const mend = stats.perEnchant.find(e => e.key === 'mending');
  assert.equal(mend.status, 'impossible');
});

test('Librarian reroll stats distinguish Java vs Bedrock pool size and structure-only books', () => {
  const protJava = getEnchantRerollStats('protection', 4, 'java');
  const protBedrock = getEnchantRerollStats('protection', 4, 'bedrock');
  assert.ok(protJava.avgRerolls > protBedrock.avgRerolls);
  assert.ok(protJava.avgFullMenuRerolls < protJava.avgRerolls);

  const swift = getEnchantRerollStats('swift_sneak', 3, 'java');
  assert.equal(swift.avgRerolls, null);
  assert.match(swift.method, /Ciudad/i);
});

test('Generated Rust optimizer compiles and matches JS Bitmask DP total cost', () => {
  const plan = computeFullPlan({
    itemId: 'boots',
    materialId: 'netherite',
    edition: 'java',
    selectedEnchants: {
      protection: 4,
      feather_falling: 4,
      depth_strider: 3,
      soul_speed: 3,
      unbreaking: 3,
      mending: 1
    },
    manualStrategy: 'clean'
  });

  const rustCode = generateRustSource(plan);
  const dir = mkdtempSync(join(tmpdir(), 'mc-rust-test-'));
  try {
    const srcPath = join(dir, 'anvil_dp_optimizer.rs');
    const binPath = join(dir, 'anvil_dp_optimizer');
    writeFileSync(srcPath, rustCode, 'utf8');
    execFileSync('rustc', ['-O', srcPath, '-o', binPath], { stdio: 'pipe' });
    const out = execFileSync(binPath, { encoding: 'utf8' });
    assert.match(out, new RegExp(`Coste total óptimo: ${plan.optimalResult.totalLevels} niveles`));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
