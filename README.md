# ⚒️ Minecraft Enchant & Anvil DP Optimizer (1.21+ Java & Bedrock)

[![Abrir Calculadora en Vivo](https://img.shields.io/badge/🚀_ABRIR_CALCULADORA_EN_VIVO-PC_y_Celular-15803d?style=for-the-badge)](https://thecrisxd.github.io/Calculadora-de-Encantamientos-Minecraft-bedrock-java-/)

> 👉 **[Haz clic aquí para entrar a la calculadora desde tu navegador o celular](https://thecrisxd.github.io/Calculadora-de-Encantamientos-Minecraft-bedrock-java-/)**

Una calculadora interactiva y guía visual paso a paso con estética clásica de interfaz de **Minecraft** que encuentra el **camino más corto, barato en experiencia (XP) y con menos intentos (re-rolls)** para encantar cualquier objeto del juego sin alcanzar jamás el bloqueo de *"¡Demasiado caro!"* ($>39$ niveles) en el yunque.

## 🎯 ¿Qué hace este proyecto?

Encantar equipamiento al máximo en Minecraft suele provocar pérdida de niveles o el bloqueo del yunque si los libros se combinan en un orden incorrecto. Esta herramienta resuelve el problema de forma integral:

1. **Catálogo Completo y Validación Estricta (20 Ítems y 9 Materiales):**
   * Incluye herramientas, armas, armaduras, **Élitros, Tridente, Maza, Arco, Ballesta, Caña de Pescar, Escudo, Tijeras, Mechero, Pincel y Calabaza Tallada**.
   * Selector dinámico de material (**Netherita, Diamante, Hierro, Oro, Cota de Malla, Cuero, Caparazón de Tortuga, Piedra y Madera**) que ajusta automáticamente la encantabilidad y los aldeanos disponibles.
   * Bloqueo automático de encantamientos incompatibles (por ejemplo, *Filo* vs. *Castigo*, *Fortuna* vs. *Toque de Seda*, *Infinidad* vs. *Reparación*).

2. **Evaluador Automático de Ruta Más Corta:**
   * Compara en tiempo real si conviene partir de un **objeto limpio**, comprarlo **pre-encantado a un aldeano de equipamiento** o usar la **Mesa de Encantamientos Nv. 30 con el Truco de Herramientas de Oro**, explicando el porqué y permitiendo cambiar de ruta manualmente.

3. **Cálculo de Probabilidades y Re-rolls de Aldeanos (Java y Bedrock):**
   * Calcula los intentos promedio tanto para el **método clásico de romper/colocar el Atril** (1ª ranura) como para **vista previa completa** (viendo los 4 niveles del bibliotecario antes de comerciar).

4. **Interfaces Visuales Estilo Minecraft Vanilla:**
   * Genera dinámicamente tarjetas con retratos ortogonales $32 \times 32$ del aldeano o estación correspondiente y texturas $16 \times 16$ de qué debes entregar y qué recibirás encantado.

5. **Motor Exacto de Yunque (Árbol Binario Óptimo) + Comparativa Real:**
   * Muestra el orden exacto de fusiones en el yunque y una tabla comparativa con números concretos de cuántos niveles extra gastarías (o en qué paso se bloquearía) si metieras los libros uno por uno.

6. **Base de Datos Filtrable y Código Nativo en Rust:**
   * Incluye pestañas dedicadas con la tabla filtrable de profesiones/mesas de trabajo, la explicación del **Truco del Oro** y la implementación de referencia en **Rust** (`anvil_dp_optimizer.rs`).

## 🚀 Cómo usar la calculadora o activarla en GitHub Pages

### Opción 1: Entrar directo desde el navegador o celular
Solo haz clic en el botón verde **Abrir Calculadora en Vivo** al inicio de este documento (compatible con escritorio y pantallas móviles).

### Opción 2: Activar tu propia versión gratis con GitHub Pages
No necesitas servidores, bases de datos ni instalar nada:

1. Asegúrate de que tu repositorio en GitHub sea **Público** (*Public*) y tenga el archivo llamado exactamente **`index.html`** (en minúsculas) en la carpeta raíz junto a este `README.md`.
2. En tu repositorio, entra a la pestaña superior **Settings** (Configuración).
3. En el menú lateral izquierdo, haz clic en **Pages** (dentro de la sección *Code and automation*).
4. En **Build and deployment** $\rightarrow$ **Source**, selecciona **Deploy from a branch**.
5. En **Branch**, elige la rama `main` (o `master`), deja la carpeta en `/ (root)` y haz clic en **Save**.
6. Espera entre **1 y 2 minutos** y recarga esa misma página. Aparecerá un recuadro arriba indicando:
   > *"Your site is live at `https://tu-usuario.github.io/tu-repositorio/`"*
7. Edita el enlace al inicio de este `README.md` reemplazando `TU-USUARIO` y `TU-REPOSITORIO` por los tuyos, y (opcionalmente) activa la casilla **"Use your GitHub Pages website"** en el engranaje (`⚙️`) del panel **About** en la portada del repositorio.

## 🧠 Arquitectura Técnica (Para Desarrolladores y Contribuidores)

El proyecto está construido con **Módulos ES nativos + CSS Vanilla sin bundler ni CDN de Tailwind**, manteniendo cero pasos de compilación para desplegarse directamente en GitHub Pages desde la rama `main`:

```text
├── index.html                   # Shell semántico HTML5 + barra de resumen vivo sticky
├── css/
│   ├── tokens.css               # Paleta HSL de piedra Minecraft, esmeralda, oro, lapis y XP
│   ├── components.css           # Componentes biselados Vanilla GUI e inspectores desplegables
│   └── animations.css           # Brillo encantado, parpadeo de aldeanos, forja y partículas
├── js/
│   ├── app.js                   # Estado reactivo central y delegación de eventos
│   ├── data/
│   │   ├── catalog.js           # MATERIALS, ENCHANTMENTS, ITEMS (20 ítems) y VILLAGER_DB
│   │   └── tableRules.js        # Reglas exactas de Mesa Nv. 30 y techos de aldeanos
│   ├── engine/
│   │   ├── anvilDp.js           # Motor Bitmask DP y simulador lineal ingenuo
│   │   ├── enchantingTable.js   # Distribución exacta de nivel modificado y Truco del Oro
│   │   ├── strategy.js          # Conflictos (Arco/Tridente/Maza/Bedrock), re-rolls y rutas
│   │   └── rustGenerator.js     # Generador dinámico de anvil_dp_optimizer.rs sincronizado
│   ├── pixelart/
│   │   ├── palettes.js          # Paletas de 9 materiales para recoloreo real de SVG
│   │   ├── icons.js             # Iconos pixel-art 16×16 dinámicos con brillo encantado
│   │   └── actors.js            # Actores 32×32 animados (aldeanos, mesa, yunque) + ráfagas
│   └── ui/
│       ├── reactiveBoxes.js     # Consejos 100% dinámicos, resumen vivo y teoría contextual
│       ├── inspectors.js        # Paneles desplegables de encantamientos, pasos PWP y aldeanos
│       └── renderer.js          # Renderizador modular de las 4 pestañas
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
