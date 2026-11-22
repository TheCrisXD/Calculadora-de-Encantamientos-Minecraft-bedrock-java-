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

El proyecto está construido intencionalmente bajo una **arquitectura Single-File (`index.html`)** sin dependencias de backend ni bundlers para garantizar portabilidad absoluta y cero latencia en GitHub Pages:

* **UI & Estilos:** Tailwind CSS (vía CDN) combinado con clases personalizadas `.mc-panel`, `.mc-card`, `.mc-slot` y `.mc-vanilla-gui` que emulan los biseles de luz/sombra de `3px` de la GUI de Minecraft.
* **Gráficos Vectoriales Pixel-Art:** Diccionarios `PIXEL_ICONS` ($16 \times 16$) y `LIVE_ACTORS` ($32 \times 32$) renderizados mediante `<svg shape-rendering="crispEdges">` con coordenadas enteras puras (sin recursos externos ni riesgo de enlaces rotos).
* **Motor Algorítmico (`solveOptimalAnvilTree`):** Implementación en JavaScript ES6+ de programación dinámica por máscara de bits (*Bitmask DP*), acompañada de su equivalente nativo en Rust en la pestaña 4.

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

### 3. Ejecución del Motor Nativo en Rust

Si deseas compilar o integrar el optimizador en un proyecto externo o compilarlo a WebAssembly (`wasm32-unknown-unknown`), extrae el código de la pestaña **4. Código Rust** a un archivo `anvil_dp_optimizer.rs` y compílalo con optimizaciones máximas:

```bash
rustc -O anvil_dp_optimizer.rs -o anvil_dp_optimizer
./anvil_dp_optimizer
```

## 🛠️ Cómo Contribuir

¡Las mejoras, reportes de errores y actualizaciones de versiones futuras de Minecraft son bienvenidos!

1. Haz un **Fork** de este repositorio.
2. Crea una rama para tu mejora (`git checkout -b feature/nueva-actualizacion`).
3. **Estructura de datos clave dentro de `index.html`:**
   * `MATERIALS`: Define encantabilidad de armadura (`enchArmor`) y herramienta (`enchTool`) por material.
   * `ENCHANTMENTS`: Define `maxLvl`, `bookMult` (multiplicador de libro en yunque) y `group` (grupo de exclusión mutua).
   * `ITEMS`: Define los ítems encantables, materiales permitidos, disponibilidad en aldeanos (`villagerMaterials`), `allowed` y `godRoll`.
4. Prueba tus cambios abriendo `index.html` en escritorio y móvil verificando que no existan errores en la consola del navegador.
5. Abre un **Pull Request** describiendo claramente qué mecánica o encantamiento añadiste o corregiste.

### Ideas abiertas para futuras contribuciones
* Soporte opcional para el paquete de datos experimental **Villager Trade Rebalance** (encantamientos por bioma).
* Cálculo de coste exacto de esmeraldas con descuentos por curación de aldeano zombi y *Héroe de la Aldea*.
* Modo de exportación de la ruta en formato texto/imagen compartible.

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Eres libre de usar, modificar y compartir este proyecto citando el repositorio original.
