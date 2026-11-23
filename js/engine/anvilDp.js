// =============================================================================
// MOTOR EXACTO DEL YUNQUE (BITMASK DP + COMPARADOR LINEAL INGENUO)
// =============================================================================

export function pwpCost(workCount) {
  return (1 << workCount) - 1;
}

export function xpForLevel(L) {
  if (L <= 0) return 0;
  if (L <= 16) return L * L + 6 * L;
  if (L <= 31) return Math.floor(2.5 * L * L - 40.5 * L + 360);
  return Math.floor(4.5 * L * L - 162.5 * L + 2220);
}

/**
 * Resuelve el árbol binario óptimo de fusiones en el yunque mediante Bitmask DP.
 * Criterio lexicográfico:
 *   1. Minimizar pasos > 39 niveles ("¡Demasiado caro!")
 *   2. Minimizar suma total de niveles gastados
 *   3. Minimizar pico máximo de un paso individual
 *
 * @param {Array<{isTargetItem: boolean, bookValue: number, label: string, shortName: string, enchants?: string[]}>} nodes
 */
export function solveOptimalAnvilTree(nodes) {
  const n = nodes.length;
  if (n <= 1) {
    return {
      totalLevels: 0,
      totalXpPoints: 0,
      maxStepCost: 0,
      workCount: 0,
      steps: []
    };
  }

  const fullMask = (1 << n) - 1;
  const dp = Array.from({ length: 1 << n }, () => new Map());

  for (let i = 0; i < n; i++) {
    const node = nodes[i];
    dp[1 << i].set(0, {
      workCount: 0,
      bookValue: node.bookValue,
      isTargetItem: node.isTargetItem,
      label: node.label,
      enchants: node.enchants ? [...node.enchants] : (node.isTargetItem ? [] : [node.shortName]),
      totalLevels: 0,
      totalXpPoints: 0,
      maxStepCost: 0,
      steps: []
    });
  }

  for (let size = 2; size <= n; size++) {
    for (let mask = 1; mask <= fullMask; mask++) {
      let bits = 0;
      for (let b = 0; b < n; b++) if (mask & (1 << b)) bits++;
      if (bits !== size) continue;

      for (let sub1 = (mask - 1) & mask; sub1 > 0; sub1 = (sub1 - 1) & mask) {
        const sub2 = mask ^ sub1;
        for (const s1 of dp[sub1].values()) {
          for (const s2 of dp[sub2].values()) {
            // El ítem objetivo nunca puede ir a la derecha como sacrificio
            if (s2.isTargetItem) continue;

            const pwp1 = pwpCost(s1.workCount);
            const pwp2 = pwpCost(s2.workCount);
            const stepCost = s2.bookValue + pwp1 + pwp2;
            const newWork = Math.max(s1.workCount, s2.workCount) + 1;
            const newTotal = s1.totalLevels + s2.totalLevels + stepCost;
            const newXp = s1.totalXpPoints + s2.totalXpPoints + xpForLevel(stepCost);
            const newMax = Math.max(s1.maxStepCost, s2.maxStepCost, stepCost);

            const curr = dp[mask].get(newWork);
            const isBetter =
              !curr ||
              (newMax <= 39 && curr.maxStepCost > 39) ||
              ((newMax <= 39) === (curr.maxStepCost <= 39) &&
                (newTotal < curr.totalLevels ||
                  (newTotal === curr.totalLevels && newMax < curr.maxStepCost)));

            if (isBetter) {
              const combinedEnchants = [...s1.enchants, ...s2.enchants];
              const resLabel = s1.isTargetItem
                ? `${nodes[0].shortName} (${newWork} ${newWork === 1 ? 'uso' : 'usos'})`
                : `Libro: ${combinedEnchants.join(' + ')}`;

              const swappedCost = s1.isTargetItem
                ? null
                : s1.bookValue + pwp1 + pwp2;

              dp[mask].set(newWork, {
                workCount: newWork,
                bookValue: s1.bookValue + s2.bookValue,
                isTargetItem: s1.isTargetItem,
                label: resLabel,
                enchants: combinedEnchants,
                totalLevels: newTotal,
                totalXpPoints: newXp,
                maxStepCost: newMax,
                steps: [
                  ...s1.steps,
                  ...s2.steps,
                  {
                    left: s1.label,
                    right: s2.label,
                    result: resLabel,
                    leftIsItem: s1.isTargetItem,
                    leftWork: s1.workCount,
                    rightWork: s2.workCount,
                    resultWork: newWork,
                    leftPwp: pwp1,
                    rightPwp: pwp2,
                    pwpTotal: pwp1 + pwp2,
                    leftBookValue: s1.bookValue,
                    enchValue: s2.bookValue,
                    cost: stepCost,
                    xpPoints: xpForLevel(stepCost),
                    swappedCost,
                    leftEnchants: [...s1.enchants],
                    rightEnchants: [...s2.enchants],
                    resultEnchants: combinedEnchants,
                    tooExpensive: stepCost > 39
                  }
                ]
              });
            }
          }
        }
      }
    }
  }

  let best = null;
  for (const state of dp[fullMask].values()) {
    if (!best) {
      best = state;
    } else {
      const bestOk = best.maxStepCost <= 39;
      const stOk = state.maxStepCost <= 39;
      if (
        (stOk && !bestOk) ||
        (stOk === bestOk &&
          (state.totalLevels < best.totalLevels ||
            (state.totalLevels === best.totalLevels && state.maxStepCost < best.maxStepCost)))
      ) {
        best = state;
      }
    }
  }
  return best;
}

/**
 * Simulación lineal ingenua: aplica los libros 1 a 1 directamente al objeto base.
 */
export function solveLinearNaive(nodes) {
  if (nodes.length <= 1) {
    return { totalLevels: 0, totalXpPoints: 0, maxStepCost: 0, steps: [] };
  }
  const books = nodes.slice(1).sort((a, b) => a.bookValue - b.bookValue);
  let itemWork = 0;
  let totalLevels = 0;
  let totalXpPoints = 0;
  let maxStepCost = 0;
  const steps = [];

  for (const b of books) {
    const penalty = pwpCost(itemWork);
    const stepCost = b.bookValue + penalty;
    totalLevels += stepCost;
    totalXpPoints += xpForLevel(stepCost);
    maxStepCost = Math.max(maxStepCost, stepCost);
    steps.push({
      bookName: b.shortName,
      bookValue: b.bookValue,
      penalty,
      stepCost,
      tooExpensive: stepCost > 39
    });
    itemWork++;
  }
  return { totalLevels, totalXpPoints, maxStepCost, steps };
}
