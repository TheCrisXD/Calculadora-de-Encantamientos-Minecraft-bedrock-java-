// =============================================================================
// ACTORES PIXEL-ART 32x32 ANIMADOS E INTERACTIVOS (ALDEANOS, MESA, YUNQUE)
// =============================================================================

export function renderActor(actorKey, options = {}) {
  const { sizeClass = 'px-actor-md', interactive = true } = options;
  const cls = `px-actor-svg ${sizeClass} ${interactive ? 'px-actor-interactive' : ''}`;

  switch (actorKey) {
    case 'librarian':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-villager-head">
          <rect x="8" y="3" width="16" height="3" fill="#dc2626"/>
          <rect x="6" y="6" width="20" height="2" fill="#b91c1c"/>
          <rect x="10" y="5" width="12" height="2" fill="#facc15"/>
          <rect x="9" y="8" width="14" height="13" fill="#b07250"/>
          <rect x="10" y="11" width="12" height="2" fill="#451a03"/>
          <g class="px-eye">
            <rect x="10" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="11" y="13" width="2" height="2" fill="#15803d"/>
            <rect x="19" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="19" y="13" width="2" height="2" fill="#15803d"/>
          </g>
          <rect x="14" y="14" width="4" height="6" fill="#8f5437"/>
        </g>
        <g class="px-villager-body">
          <rect x="7" y="21" width="18" height="9" fill="#991b1b"/>
          <rect x="12" y="21" width="8" height="9" fill="#f8fafc"/>
          <rect x="14" y="23" width="4" height="3" fill="#eab308"/>
        </g>
      </svg>`;

    case 'armorer':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-villager-head">
          <rect x="9" y="4" width="14" height="17" fill="#b07250"/>
          <rect x="9" y="4" width="14" height="4" fill="#475569"/>
          <rect x="11" y="5" width="10" height="2" fill="#94a3b8"/>
          <rect x="10" y="11" width="12" height="2" fill="#451a03"/>
          <g class="px-eye">
            <rect x="10" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="11" y="13" width="2" height="2" fill="#1e293b"/>
            <rect x="19" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="19" y="13" width="2" height="2" fill="#1e293b"/>
          </g>
          <rect x="14" y="14" width="4" height="6" fill="#8f5437"/>
        </g>
        <g class="px-villager-body">
          <rect x="7" y="21" width="18" height="9" fill="#334155"/>
          <rect x="11" y="21" width="10" height="9" fill="#1e293b"/>
          <rect x="14" y="24" width="4" height="2" fill="#38bdf8"/>
        </g>
      </svg>`;

    case 'weaponsmith':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-villager-head">
          <rect x="9" y="4" width="14" height="17" fill="#b07250"/>
          <rect x="18" y="11" width="5" height="5" fill="#18181b"/>
          <rect x="10" y="11" width="8" height="2" fill="#451a03"/>
          <g class="px-eye">
            <rect x="10" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="11" y="13" width="2" height="2" fill="#1e293b"/>
          </g>
          <rect x="14" y="14" width="4" height="6" fill="#8f5437"/>
        </g>
        <g class="px-villager-body">
          <rect x="7" y="21" width="18" height="9" fill="#78350f"/>
          <rect x="11" y="22" width="10" height="8" fill="#27272a"/>
          <rect x="14" y="24" width="4" height="2" fill="#94a3b8"/>
        </g>
      </svg>`;

    case 'toolsmith':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-villager-head">
          <rect x="9" y="4" width="14" height="17" fill="#b07250"/>
          <rect x="10" y="11" width="12" height="2" fill="#451a03"/>
          <g class="px-eye">
            <rect x="10" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="11" y="13" width="2" height="2" fill="#1e293b"/>
            <rect x="19" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="19" y="13" width="2" height="2" fill="#1e293b"/>
          </g>
          <rect x="14" y="14" width="4" height="6" fill="#8f5437"/>
        </g>
        <g class="px-villager-body">
          <rect x="7" y="21" width="18" height="9" fill="#57534e"/>
          <rect x="11" y="21" width="10" height="9" fill="#92400e"/>
          <rect x="14" y="24" width="4" height="2" fill="#cbd5e1"/>
        </g>
      </svg>`;

    case 'fletcher':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-villager-head">
          <rect x="8" y="4" width="16" height="3" fill="#3f6212"/>
          <rect x="10" y="3" width="4" height="2" fill="#f8fafc"/>
          <rect x="9" y="7" width="14" height="14" fill="#b07250"/>
          <rect x="10" y="11" width="12" height="2" fill="#451a03"/>
          <g class="px-eye">
            <rect x="10" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="11" y="13" width="2" height="2" fill="#1e293b"/>
            <rect x="19" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="19" y="13" width="2" height="2" fill="#1e293b"/>
          </g>
          <rect x="14" y="14" width="4" height="6" fill="#8f5437"/>
        </g>
        <g class="px-villager-body">
          <rect x="7" y="21" width="18" height="9" fill="#713f12"/>
          <rect x="13" y="21" width="6" height="9" fill="#a16207"/>
        </g>
      </svg>`;

    case 'fisherman':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-villager-head">
          <rect x="6" y="5" width="20" height="2" fill="#d97706"/>
          <rect x="9" y="3" width="14" height="2" fill="#f59e0b"/>
          <rect x="9" y="7" width="14" height="14" fill="#b07250"/>
          <rect x="10" y="11" width="12" height="2" fill="#451a03"/>
          <g class="px-eye">
            <rect x="10" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="11" y="13" width="2" height="2" fill="#1e293b"/>
            <rect x="19" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="19" y="13" width="2" height="2" fill="#1e293b"/>
          </g>
          <rect x="14" y="14" width="4" height="6" fill="#8f5437"/>
        </g>
        <g class="px-villager-body">
          <rect x="7" y="21" width="18" height="9" fill="#0369a1"/>
          <rect x="12" y="22" width="8" height="7" fill="#0ea5e9"/>
        </g>
      </svg>`;

    case 'cleric':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-villager-head">
          <rect x="9" y="4" width="14" height="17" fill="#b07250"/>
          <rect x="10" y="11" width="12" height="2" fill="#451a03"/>
          <g class="px-eye">
            <rect x="10" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="11" y="13" width="2" height="2" fill="#15803d"/>
            <rect x="19" y="13" width="3" height="2" fill="#ffffff"/>
            <rect x="19" y="13" width="2" height="2" fill="#15803d"/>
          </g>
          <rect x="14" y="14" width="4" height="6" fill="#8f5437"/>
        </g>
        <g class="px-villager-body">
          <rect x="7" y="21" width="18" height="9" fill="#6b21a8"/>
          <rect x="13" y="21" width="6" height="9" fill="#a855f7"/>
          <rect x="15" y="23" width="2" height="4" fill="#fde047"/>
        </g>
      </svg>`;

    case 'enchant_table':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <!-- Runas flotantes animadas -->
        <rect class="px-rune px-rune-1" x="4" y="7" width="2" height="2" fill="#38bdf8"/>
        <rect class="px-rune px-rune-2" x="26" y="6" width="2" height="2" fill="#facc15"/>
        <rect class="px-rune px-rune-3" x="7" y="3" width="2" height="2" fill="#a5f3fc"/>
        <!-- Libro flotante -->
        <g class="px-table-book">
          <rect x="10" y="4" width="12" height="7" fill="#991b1b"/>
          <rect x="11" y="5" width="10" height="5" fill="#fef3c7"/>
          <rect x="15" y="5" width="2" height="5" fill="#d97706"/>
        </g>
        <!-- Mesa obsidiana + diamantes -->
        <rect x="6" y="14" width="20" height="4" fill="#dc2626"/>
        <rect x="8" y="14" width="4" height="2" fill="#38bdf8"/>
        <rect x="20" y="14" width="4" height="2" fill="#38bdf8"/>
        <rect x="5" y="18" width="22" height="11" fill="#1c1f2e"/>
        <rect x="7" y="20" width="18" height="7" fill="#2c3147"/>
        <rect x="9" y="22" width="4" height="3" fill="#38bdf8" opacity="0.5"/>
      </svg>`;

    case 'end_ship':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-float-gentle">
          <rect x="15" y="3" width="2" height="15" fill="#fde047"/>
          <rect x="9" y="5" width="6" height="8" fill="#a855f7"/>
          <rect x="10" y="6" width="4" height="6" fill="#c084fc"/>
          <rect x="6" y="18" width="20" height="6" fill="#7e22ce"/>
          <rect x="8" y="24" width="16" height="4" fill="#581c87"/>
        </g>
      </svg>`;

    case 'drowned':
      return `<svg viewBox="0 0 32 32" class="${cls}" shape-rendering="crispEdges" aria-hidden="true">
        <g class="px-float-gentle">
          <rect x="9" y="4" width="14" height="15" fill="#2dd4bf"/>
          <g class="px-eye">
            <rect x="10" y="10" width="3" height="2" fill="#cffafe"/>
            <rect x="19" y="10" width="3" height="2" fill="#cffafe"/>
          </g>
          <rect x="12" y="14" width="8" height="2" fill="#0f766e"/>
          <rect x="7" y="19" width="18" height="10" fill="#115e59"/>
          <rect x="10" y="20" width="12" height="6" fill="#78350f"/>
        </g>
      </svg>`;

    case 'anvil_32':
    default:
      return `<svg viewBox="0 0 32 32" class="${cls} px-anvil-svg" shape-rendering="crispEdges" aria-hidden="true">
        <!-- Chispas de forja -->
        <rect class="px-spark px-spark-1" x="6" y="4" width="2" height="2" fill="#fde047"/>
        <rect class="px-spark px-spark-2" x="24" y="5" width="2" height="2" fill="#80ff20"/>
        <!-- Yunque -->
        <rect x="4" y="8" width="24" height="6" fill="#4b5563"/>
        <rect x="6" y="6" width="20" height="2" fill="#9ca3af"/>
        <rect x="10" y="14" width="12" height="4" fill="#374151"/>
        <rect x="12" y="18" width="8" height="5" fill="#1f2937"/>
        <rect x="6" y="23" width="20" height="6" fill="#374151"/>
        <rect x="8" y="23" width="16" height="2" fill="#6b7280"/>
        <!-- Martillo pequeño interactivo -->
        <g class="px-hammer">
          <rect x="18" y="1" width="7" height="3" fill="#cbd5e1"/>
          <rect x="20" y="4" width="2" height="4" fill="#92400e"/>
        </g>
      </svg>`;
  }
}

/**
 * Emite una ráfaga ligera de píxeles animados (orbes XP, esmeraldas, chispas o runas)
 * directamente alrededor del elemento clickeado sin librerías externas.
 */
export function spawnPixelBurst(anchorEl, type = 'xp') {
  if (!anchorEl || typeof document === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const paletteMap = {
    xp: ['#80ff20', '#bef264', '#4ade80', '#fef08a'],
    emerald: ['#10b981', '#34d399', '#6ee7b7', '#059669'],
    spark: ['#fde047', '#f59e0b', '#fb923c', '#ffffff'],
    rune: ['#38bdf8', '#a5f3fc', '#fde047', '#c4b5fd']
  };
  const colors = paletteMap[type] || paletteMap.xp;
  const rect = anchorEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span');
    p.className = 'px-particle';
    const angle = (Math.PI * 2 * i) / 8 + (Math.random() * 0.4 - 0.2);
    const dist = 24 + Math.random() * 26;
    const tx = Math.round(Math.cos(angle) * dist);
    const ty = Math.round(Math.sin(angle) * dist - 12);
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;
    p.style.backgroundColor = colors[i % colors.length];
    p.style.setProperty('--px-tx', `${tx}px`);
    p.style.setProperty('--px-ty', `${ty}px`);
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
    setTimeout(() => p.remove(), 750);
  }
}
