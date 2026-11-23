# ⚒️ Minecraft Enchant & Anvil DP Optimizer (1.21+ Java & Bedrock)

[![Abrir Calculadora en Vivo](https://img.shields.io/badge/🚀_ABRIR_CALCULADORA_EN_VIVO-PC_y_Celular-15803d?style=for-the-badge)](https://thecrisxd.github.io/Calculadora-de-Encantamientos-Minecraft-bedrock-java-/)

> 👉 **Enlace directo a la calculadora en vivo:** **[https://thecrisxd.github.io/Calculadora-de-Encantamientos-Minecraft-bedrock-java-/](https://thecrisxd.github.io/Calculadora-de-Encantamientos-Minecraft-bedrock-java-/)**

Una calculadora interactiva y guía visual paso a paso con estética **Minecraft Vanilla / Minecraft Live** y sprites pixel-art animados que encuentra el **camino más corto, barato en experiencia (XP) y con menos intentos (re-rolls)** para encantar cualquier objeto del juego sin alcanzar jamás el bloqueo de *"¡Demasiado caro!"* ($>39$ niveles) en el yunque.

## 🎯 ¿Qué hace este proyecto?

Encantar equipamiento al máximo en Minecraft suele provocar pérdida de niveles o el bloqueo del yunque si los libros se combinan en un orden incorrecto. Esta herramienta resuelve el problema de forma integral:

1. **Catálogo Completo y Validación Estricta (20 Ítems y 9 Materiales):**
   * Incluye herramientas, armas, armaduras, **Élitros, Tridente, Maza, Arco, Ballesta, Caña de Pescar, Escudo, Tijeras, Mechero, Pincel y Calabaza Tallada**.
   * Selector dinámico de material (**Netherita, Diamante, Hierro, Oro, Cota de Malla, Cuero, Caparazón de Tortuga, Piedra y Madera**) con **sprites pixel-art `16×16` fieles a Minecraft** que cambian realmente de color según el material elegido y aplican brillo encantado animado.
   * Bloqueo automático de encantamientos incompatibles (incluyendo reglas exactas 1.21+ en **Arco**, **Tridente**, **Maza** y exclusividad de *Filo Arrasador* en Java) e **inspectores desplegables (`ℹ Detalles`)** por encantamiento.

2. **Evaluador Automático de Ruta Más Corta + Panel Dinámico Conciso:**
   * Compara en tiempo real si conviene partir de un **objeto limpio (Ruta A)**, comprarlo **pre-encantado a un aldeano de equipamiento (Ruta B)** o usar la **Mesa de Encantamientos Nv. 30 con el Truco del Oro (Ruta C)**.
   * Al cambiar de ruta, el panel inferior se actualiza al instante mostrando solo los datos clave: **porcentajes, re-rolls y niveles de XP**.

3. **Etapa 3 Unificada — Interfaz Animada de Obtención + Probabilidades y Re-rolls (Java y Bedrock):**
   * Fusiona la interfaz visual estilo Minecraft (con actores `32×32` animados que reaccionan al clic con diálogos contextuales y partículas pixeladas) con los **porcentajes, niveles y re-rolls debajo de cada ítem y libro correlacionado**.
   * Incluye los cálculos detallados de **Aldeanos de equipamiento**, **Mesa Nv. 30 (Truco del Oro)**, **Bibliotecarios** y estructuras, mostrando siempre **Vista Nivel 1 (sin pack)** y **Pack Vista Completa** (viendo todos los tradeos del aldeano sin tradear).

4. **Motor Exacto de Yunque (Árbol Binario Óptimo) + Inspector PWP + Comparativa Real:**
   * Muestra el orden exacto de fusiones en el yunque con etiquetas explícitas de cada libro combinado, panel desplegable **`🔍 Ver por qué`** con el desglose matemático de PWP e inversión de ranuras, y tabla comparativa real contra meter los libros 1 a 1.

5. **Guía de Aldeanos, Teoría Reactiva y Código Nativo en Rust Sincronizado:**
   * Pestaña de Aldeanos con tarjetas interactivas (incluyendo **Clérigo** de soporte XP/Lapis) destacadas según tu ítem actual, pestaña de **Truco del Oro y PWP** adaptada a tu equipo, y pestaña **4. Código Rust** cuyo `main()` se sincroniza automáticamente con tu selección actual.

## 🚀 Cómo usar la calculadora o activarla en GitHub Pages

### Opción 1: Entrar directo desde el navegador o celular
Accede directamente desde cualquier PC o celular aquí:

- 🌐 **Calculadora en vivo:** [https://thecrisxd.github.io/Calculadora-de-Encantamientos-Minecraft-bedrock-java-/](https://thecrisxd.github.io/Calculadora-de-Encantamientos-Minecraft-bedrock-java-/)

### Opción 2: Activar tu propia versión gratis con GitHub Pages
No necesitas servidores, bases de datos ni pasos de build:

1. Asegúrate de que tu repositorio en GitHub sea **Público** (*Public*) y mantenga `index.html`, `css/` y `js/` en la raíz de la rama `main`.
2. En tu repositorio, entra a **Settings** $\rightarrow$ **Pages** (*Code and automation*).
3. En **Build and deployment** $\rightarrow$ **Source**, selecciona **Deploy from a branch**.
4. En **Branch**, elige `main`, deja la carpeta en `/ (root)` y haz clic en **Save**.
5. En **1 a 2 minutos** tu copia quedará en línea en `https://tu-usuario.github.io/tu-repositorio/`.

## 🧠 Arquitectura Técnica (Para Desarrolladores y Contribuidores)

El proyecto está construido con **Módulos ES nativos + CSS Vanilla sin bundler ni CDN de Tailwind**, manteniendo cero pasos de compilación para desplegarse directamente en GitHub Pages desde la rama `main`:

```text
├── index.html                   # Shell semántico HTML5 + barra sticky de resumen vivo
├── css/
│   ├── tokens.css               # Paleta HSL de piedra Minecraft, esmeralda, oro, lapis y XP
│   ├── components.css           # Componentes biselados Vanilla GUI e inspectores desplegables
│   └── animations.css           # Brillo encantado, parpadeo de aldeanos, forja y partículas
├── js/
│   ├── app.js                   # Estado reactivo central y delegación de eventos
│   ├── data/
│   │   ├── catalog.js           # MATERIALS, ENCHANTMENTS, ITEMS (20 ítems) y VILLAGER_DB
│   │   └── tableRules.js        # Reglas exactas de Mesa Nv. 30 y probabilidades de aldeanos
│   ├── engine/
│   │   ├── anvilDp.js           # Motor Bitmask DP y simulador lineal ingenuo
│   │   ├── enchantingTable.js   # Distribución exacta de nivel modificado y Truco del Oro
│   │   ├── strategy.js          # Conflictos (Arco/Tridente/Maza/Bedrock), re-rolls y rutas
│   │   └── rustGenerator.js     # Generador dinámico de anvil_dp_optimizer.rs sincronizado
│   ├── pixelart/
│   │   ├── palettes.js          # Paletas de 5 tonos para los 9 materiales de Minecraft
│   │   ├── icons.js             # Sprites pixel-art 16×16 fieles a Minecraft con brillo
│   │   └── actors.js            # Actores 32×32 animados (aldeanos, mesa, yunque) + ráfagas
│   └── ui/
│       ├── reactiveBoxes.js     # Resumen vivo sticky, origen, diagnóstico y teoría contextual
│       ├── inspectors.js        # Paneles desplegables de encantamientos, pasos PWP y aldeanos
│       └── renderer.js          # Panel dinámico de rutas A/B/C y Etapa 3 unificada
└── tests/
    ├── engine.test.mjs          # Pruebas unitarias con Node (`node:test`) + paridad con Rust
    └── ui_smoke.py              # Prueba E2E en Chromium headless con Playwright
```

### 1. Modelo Matemático del Yunque (Bitmask DP)

En Minecraft, cada ítem o libro mantiene un contador entero de trabajos previos $w \in \mathbb{Z}_{\ge 0}$ (`workCount`). La penalización por trabajo previo (*Prior Work Penalty*) sigue la relación exponencial:

$$
PWP(w) = 2^w - 1
$$

Al combinar un objeto izquierdo $A$ con un sacrificio derecho $B$ en el yunque, el coste en niveles de experiencia y el nuevo contador de trabajos son:

$$
\text{Coste}(A, B) = V_{\text{enc}}(B) + PWP(w_A) + PWP(w_B)
$$

$$
w_{\text{nuevo}} = \max(w_A, w_B) + 1
$$

Dado que la operación **no es conmutativa** ($V_{\text{enc}}(B)$ depende únicamente de la ranura derecha) ni asociativa, el algoritmo explora todas las biparticiones de subconjuntos $S = S_1 \sqcup S_2$ sobre $n$ nodos ($1 \le \text{mask} < 2^n$) manteniendo estados indexados por `(mask, workCount)`.

* **Complejidad temporal:** $O(3^n \cdot k^2)$, donde $n$ es el número de ítems/libros ($n \le 8$ en combinaciones reales) y $k \le \lceil \log_2 n \rceil + 1$. Se ejecuta en $< 1\text{ ms}$ en navegador.
* **Criterio de optimalidad lexicográfico:**
  1. Minimizar la cantidad de pasos que exceden el límite de supervivencia ($\text{Coste} \le 39$).
  2. Minimizar la suma total de niveles gastados ($\sum \text{Coste}$).
  3. Minimizar el pico máximo de niveles de un paso individual ($\max \text{Coste}$).

### 2. Conversión de Niveles a Puntos Reales de XP

Para estimar el coste real de experiencia acumulada en la interfaz, se aplica la función por tramos oficial de Minecraft:

$$
\text{XP}(L) = \begin{cases} L^2 + 6L & \text{si } 0 \le L \le 16 \\ 2.5L^2 - 40.5L + 360 & \text{si } 17 \le L \le 31 \\ 4.5L^2 - 162.5L + 2220 & \text{si } L \ge 32 \end{cases}
$$

### 3. Pruebas Locales y Ejecución del Motor Nativo en Rust

Para levantar la web localmente (necesario para módulos ES) y correr la suite de pruebas:

```bash
# Servidor local de desarrollo
python3 -m http.server 8000

# Pruebas unitarias del motor DP, probabilidades, conflictos y compilación Rust
node --test tests/engine.test.mjs

# Pruebas E2E de interfaz, pixel-art dinámico y responsive (requiere Playwright + Chrome)
python3 tests/ui_smoke.py
```

Si deseas compilar el motor nativo en Rust con tu configuración actual, copia el código desde la pestaña **4. Código Rust** a `anvil_dp_optimizer.rs` y ejecuta:

```bash
rustc -O anvil_dp_optimizer.rs -o anvil_dp_optimizer
./anvil_dp_optimizer
```

## 🛠️ Cómo Contribuir

¡Las mejoras, reportes de errores y actualizaciones de versiones futuras de Minecraft son bienvenidos!

1. Haz un **Fork** de este repositorio.
2. Crea una rama para tu mejora (`git checkout -b feature/nueva-actualizacion`).
3. **Estructura de datos clave en `js/data/`:**
   * `js/data/catalog.js`: `MATERIALS`, `ENCHANTMENTS`, `ITEMS` y `VILLAGER_DB`.
   * `js/data/tableRules.js`: `TABLE_PRIMARY_ENCHANTS`, `TABLE_ENCHANT_RULES` y `VILLAGER_CAPS_BY_ITEM`.
   * `js/pixelart/`: Paletas de materiales, iconos `16×16` dinámicos y actores `32×32` animados.
4. Ejecuta `node --test tests/engine.test.mjs` y `python3 tests/ui_smoke.py` verificando cero errores en consola.
5. Abre un **Pull Request** describiendo claramente qué mecánica o encantamiento añadiste o corregiste.

### Ideas abiertas para futuras contribuciones
* Soporte opcional para el paquete de datos experimental **Villager Trade Rebalance** (encantamientos por bioma).
* Cálculo de coste exacto de esmeraldas con descuentos por curación de aldeano zombi y *Héroe de la Aldea*.
* Modo de exportación de la ruta en formato texto/imagen compartible.

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Eres libre de usar, modificar y compartir este proyecto citando el repositorio original.
