// =============================================================================
// GENERADOR DINÁMICO DEL MOTOR NATIVO EN RUST (PESTAÑA 4)
// Sincroniza automáticamente main() con el ítem y los libros elegidos por el usuario
// =============================================================================

function escapeRustStr(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function generateRustSource(plan) {
  const nodes = plan && plan.nodes && plan.nodes.length > 0
    ? plan.nodes
    : [
        { label: 'Élitros (Limpio)', bookValue: 0, isTargetItem: true },
        { label: 'Libro: Irrompibilidad III', bookValue: 3, isTargetItem: false },
        { label: 'Libro: Reparación I', bookValue: 2, isTargetItem: false }
      ];

  const nodesLines = nodes
    .map(
      n =>
        `        AnvilNode { label: "${escapeRustStr(n.label)}".into(), book_value: ${n.bookValue}, is_target_item: ${n.isTargetItem} },`
    )
    .join('\n');

  const headerTarget = plan
    ? `// Configuración sincronizada: ${plan.displayName} (${plan.edition.toUpperCase()} · ${plan.bookEntries.length} libro(s))`
    : '// Configuración de ejemplo: Élitros';

  return `// anvil_dp_optimizer.rs
// Motor nativo en Rust de Programación Dinámica (Bitmask DP) para encontrar
// el árbol binario óptimo de fusión en el Yunque de Minecraft.
${headerTarget}
// Compilar y ejecutar: rustc -O anvil_dp_optimizer.rs && ./anvil_dp_optimizer

use std::collections::HashMap;

#[derive(Clone, Debug)]
pub struct AnvilNode {
    pub label: String,
    pub book_value: u32,
    pub is_target_item: bool,
}

#[derive(Clone, Debug)]
pub struct MergeStep {
    pub left: String,
    pub right: String,
    pub step_cost: u32,
    pub result_work_count: u32,
}

#[derive(Clone, Debug)]
pub struct DpState {
    pub work_count: u32,
    pub book_value: u32,
    pub is_target_item: bool,
    pub label: String,
    pub total_levels: u32,
    pub max_step_cost: u32,
    pub steps: Vec<MergeStep>,
}

#[inline(always)]
pub fn prior_work_penalty(work_count: u32) -> u32 {
    (1u32 << work_count) - 1
}

pub fn solve_optimal_anvil(nodes: &[AnvilNode]) -> Option<DpState> {
    let n = nodes.len();
    assert!(n > 0 && n <= 16);

    let full_mask: usize = (1 << n) - 1;
    let mut dp: Vec<HashMap<u32, DpState>> = vec![HashMap::new(); 1 << n];

    for (i, node) in nodes.iter().enumerate() {
        dp[1 << i].insert(0, DpState {
            work_count: 0,
            book_value: node.book_value,
            is_target_item: node.is_target_item,
            label: node.label.clone(),
            total_levels: 0,
            max_step_cost: 0,
            steps: Vec::new(),
        });
    }

    for size in 2..=n {
        for mask in 1..=full_mask {
            if mask.count_ones() as usize != size { continue; }
            let mut sub1 = (mask - 1) & mask;
            while sub1 > 0 {
                let sub2 = mask ^ sub1;
                let left_states: Vec<DpState> = dp[sub1].values().cloned().collect();
                let right_states: Vec<DpState> = dp[sub2].values().cloned().collect();

                for s1 in &left_states {
                    for s2 in &right_states {
                        if s2.is_target_item { continue; }
                        let step_cost = s2.book_value
                            + prior_work_penalty(s1.work_count)
                            + prior_work_penalty(s2.work_count);
                        let new_work = s1.work_count.max(s2.work_count) + 1;
                        let new_total = s1.total_levels + s2.total_levels + step_cost;
                        let new_max = s1.max_step_cost.max(s2.max_step_cost).max(step_cost);

                        let is_better = match dp[mask].get(&new_work) {
                            None => true,
                            Some(curr) => (new_max <= 39 && curr.max_step_cost > 39)
                                || ((new_max <= 39) == (curr.max_step_cost <= 39)
                                    && (new_total < curr.total_levels
                                        || (new_total == curr.total_levels && new_max < curr.max_step_cost))),
                        };

                        if is_better {
                            let new_label = if s1.is_target_item {
                                s1.label.clone()
                            } else {
                                format!("[{} + {}]", s1.label, s2.label)
                            };
                            let mut new_steps = s1.steps.clone();
                            new_steps.extend(s2.steps.iter().cloned());
                            new_steps.push(MergeStep {
                                left: s1.label.clone(),
                                right: s2.label.clone(),
                                step_cost,
                                result_work_count: new_work,
                            });
                            dp[mask].insert(new_work, DpState {
                                work_count: new_work,
                                book_value: s1.book_value + s2.book_value,
                                is_target_item: s1.is_target_item,
                                label: new_label,
                                total_levels: new_total,
                                max_step_cost: new_max,
                                steps: new_steps,
                            });
                        }
                    }
                }
                sub1 = (sub1 - 1) & mask;
            }
        }
    }

    dp[full_mask].values().cloned().min_by(|a, b| {
        (b.max_step_cost <= 39).cmp(&(a.max_step_cost <= 39))
            .then_with(|| a.total_levels.cmp(&b.total_levels))
            .then_with(|| a.max_step_cost.cmp(&b.max_step_cost))
    })
}

fn main() {
    let nodes = vec![
${nodesLines}
    ];
    if let Some(best) = solve_optimal_anvil(&nodes) {
        println!("Coste total óptimo: {} niveles (pico máx: {}/39)", best.total_levels, best.max_step_cost);
        for (i, st) in best.steps.iter().enumerate() {
            println!("  Paso {}: [{}] + [{}] => {} Niv. (usos={})", i + 1, st.left, st.right, st.step_cost, st.result_work_count);
        }
    }
}`;
}
