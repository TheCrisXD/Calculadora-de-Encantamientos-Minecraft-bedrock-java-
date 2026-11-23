// =============================================================================
// CATÁLOGO MAESTRO DE MATERIALES, ENCANTAMIENTOS, ÍTEMS Y ALDEANOS (1.21+)
// Fuente unificada Java & Bedrock Edition
// =============================================================================

export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];

export const MATERIALS = {
  netherite: {
    id: 'netherite',
    name: 'Netherita',
    enchArmor: 15,
    enchTool: 15,
    villagerNote: 'Se obtiene mejorando la pieza de Diamante en la Mesa de Herrería con 1 Lingote de Netherita + Plantilla de Herrería (conserva todos los encantamientos y usos de yunque).',
    tableTip: 'Conviene encantar primero en Diamante si buscas piezas de aldeano, o mejorar antes a Netherita (encantabilidad 15 vs 10) si vas a usar Mesa Nv. 30.'
  },
  diamond: {
    id: 'diamond',
    name: 'Diamante',
    enchArmor: 10,
    enchTool: 10,
    villagerNote: 'Disponible pre-encantado en aldeanos de Nivel Experto/Maestro y crafteable con diamantes.',
    tableTip: 'Encantabilidad 10 (nivel modificado máx. 40 en Mesa Nv. 30): puede sacar Protección IV, Fortuna III y Eficiencia IV, pero Eficiencia V y Filo V requieren libro.'
  },
  iron: {
    id: 'iron',
    name: 'Hierro',
    enchArmor: 9,
    enchTool: 14,
    villagerNote: 'Vendido por aldeanos desde niveles bajos (Novato/Aprendiz/Oficial).',
    tableTip: 'Buena encantabilidad en herramientas (14), superior al diamante en mesa pero inferior en durabilidad.'
  },
  gold: {
    id: 'gold',
    name: 'Oro',
    enchArmor: 25,
    enchTool: 22,
    villagerNote: 'Máxima encantabilidad del juego (22–25): ideal para sacar múltiples encantamientos altos en Mesa Nv. 30 y como sacrificio en el Truco del Oro.',
    tableTip: 'Techo máximo en Mesa Nv. 30 (Nv. mod. hasta 47–49): puede obtener Eficiencia V y Filo V directamente.'
  },
  chainmail: {
    id: 'chainmail',
    name: 'Cota de Malla',
    enchArmor: 12,
    enchTool: 12,
    villagerNote: 'No se craftea; se compra directamente al Armero (Novato/Aprendiz) o se obtiene de mobs.',
    tableTip: 'Encantabilidad 12, ligeramente superior a diamante/hierro en Mesa de Encantamientos.'
  },
  leather: {
    id: 'leather',
    name: 'Cuero',
    enchArmor: 15,
    enchTool: 15,
    villagerNote: 'Vendido teñido por el Peletero (Leatherworker) o crafteado con cuero; las botas evitan hundirse en nieve polvo.',
    tableTip: 'Encantabilidad 15 (igual que Netherita) en Mesa Nv. 30.'
  },
  turtle: {
    id: 'turtle',
    name: 'Caparazón de Tortuga',
    enchArmor: 9,
    enchTool: 9,
    villagerNote: 'Se craftea con 5 escamas de tortuga; ningún aldeano lo vende. Otorga 10 segundos extra de Respiración Acuática.',
    tableTip: 'Encantabilidad 9 en Mesa Nv. 30; combínalo con Respiración III para exploración submarina prolongada.'
  },
  stone: {
    id: 'stone',
    name: 'Piedra',
    enchArmor: 5,
    enchTool: 5,
    villagerNote: 'Vendido por el Herrero de Herramientas en nivel Novato o crafteado con adoquín/pizarra.',
    tableTip: 'Encantabilidad baja (5): no recomendado para gastar libros caros de bibliotecario.'
  },
  wood: {
    id: 'wood',
    name: 'Madera',
    enchArmor: 15,
    enchTool: 15,
    villagerNote: 'Crafteable al inicio del juego; alta encantabilidad (15), pero durabilidad mínima (59 usos).',
    tableTip: 'Encantabilidad 15, útil solo como prueba o early-game.'
  }
};

export const ENCHANTMENTS = {
  protection: {
    name: 'Protección', maxLvl: 4, bookMult: 1, group: 'prot',
    plainDesc: 'Reduce todo tipo de daño recibido (golpes, caídas, fuego y explosiones).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Funciona igual en Java y Bedrock (4% de reducción por nivel por pieza, con tope del 80% EPF). En Armero solo llega a Protección II.'
  },
  fire_protection: {
    name: 'Protección contra el Fuego', maxLvl: 4, bookMult: 1, group: 'prot',
    plainDesc: 'Reduce mucho el daño de lava, fuego y blazes, y acorta el tiempo quemándote.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Armero (hasta III)',
    javaVsBedrock: 'Idéntico en ambas ediciones; incompatible con las demás Protecciones.'
  },
  blast_protection: {
    name: 'Protección contra Explosiones', maxLvl: 4, bookMult: 2, group: 'prot',
    plainDesc: 'Reduce el daño y el empuje de Creepers, TNT y cristales del End.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Armero',
    javaVsBedrock: 'Multiplicador x2 en libro. En Armero puede aparecer hasta Nv. IV en piezas de diamante.'
  },
  proj_protection: {
    name: 'Protección contra Proyectiles', maxLvl: 4, bookMult: 1, group: 'prot',
    plainDesc: 'Reduce el daño de flechas, tridentes y bolas de fuego.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Armero',
    javaVsBedrock: 'Idéntico en Java y Bedrock; puede salir hasta Nv. IV en Armero.'
  },
  feather_falling: {
    name: 'Caída de Pluma', maxLvl: 4, bookMult: 1, group: null,
    plainDesc: 'Reduce drásticamente el daño al caer desde lugares altos y al usar Perlas de Ender.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Armero (Botas)',
    javaVsBedrock: 'Uno de los pocos encantamientos que SÍ sale al nivel máximo (IV) en el Armero (Experto).'
  },
  respiration: {
    name: 'Respiración', maxLvl: 3, bookMult: 2, group: null,
    plainDesc: 'Permite aguantar mucho más tiempo sin aire bajo el agua y reduce daño por ahogamiento.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'El Armero solo llega a Respiración II; para Nv. III necesitas Mesa Nv. 30 o Bibliotecario.'
  },
  aqua_affinity: {
    name: 'Afinidad Acuática', maxLvl: 1, bookMult: 2, group: null,
    plainDesc: 'Permite picar bloques bajo el agua a velocidad normal (sin penalización x5).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Armero (Casco)',
    javaVsBedrock: 'Sale con ~12% en Cascos de Diamante del Armero Maestro.'
  },
  thorns: {
    name: 'Espinas', maxLvl: 3, bookMult: 4, group: null,
    plainDesc: 'Devuelve daño a los enemigos cuando te golpean (consume durabilidad extra).',
    sourceTag: 'Mesa Nv. 30 (solo Peto) / Bibliotecario',
    javaVsBedrock: 'Tiene multiplicador alto (x4) en yunque: colócalo temprano en el árbol binario. En Mesa Nv. 30 solo aparece de forma primaria en Petos; en otras piezas requiere libro.'
  },
  depth_strider: {
    name: 'Agilidad Acuática', maxLvl: 3, bookMult: 2, group: 'boot_walk',
    plainDesc: 'Permite nadar y caminar a velocidad normal bajo el agua.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: '0% en Armero. Incompatible con Paso Helado.'
  },
  frost_walker: {
    name: 'Paso Helado', maxLvl: 2, bookMult: 2, group: 'boot_walk',
    plainDesc: 'Congela el agua bajo tus pies formando hielo escarchado al caminar.',
    sourceTag: 'Tesoro (Bibliotecario / Cofres / Pesca)',
    javaVsBedrock: 'Encantamiento de tesoro: 0% en Mesa de Encantamientos y 0% en Armero. Incompatible con Agilidad Acuática.'
  },
  soul_speed: {
    name: 'Velocidad de Almas', maxLvl: 3, bookMult: 4, group: null,
    plainDesc: 'Aumenta la velocidad al caminar sobre arena y tierra de almas (consume durabilidad).',
    sourceTag: 'Exclusivo Nether (Piglins / Bastiones)',
    javaVsBedrock: '0% en Bibliotecarios y 0% en Mesa. Solo trueque con Piglins (~1.1% por lingote) o cofres de Bastión. Multiplicador x4 en yunque.'
  },
  swift_sneak: {
    name: 'Sigilo Veloz', maxLvl: 3, bookMult: 4, group: null,
    plainDesc: 'Permite caminar hasta al 75% de velocidad normal mientras vas agachado.',
    sourceTag: 'Exclusivo Ciudad Antigua (Deep Dark)',
    javaVsBedrock: '0% en Bibliotecarios y 0% en Mesa. Solo en cofres de Ciudades Antiguas (~23.2% por cofre). Multiplicador x4 en yunque.'
  },
  sharpness: {
    name: 'Filo', maxLvl: 5, bookMult: 1, group: 'dmg',
    plainDesc: 'Aumenta el daño contra todos los enemigos y jefes.',
    sourceTag: 'Mesa Nv. 30 (Espada) / Bibliotecario',
    javaVsBedrock: 'En Java suma +0.5 + 0.5×Nv (+3 a Nv.V); en Bedrock suma +1.25×Nv (+6.25 a Nv.V). En Hachas solo se aplica por Yunque.'
  },
  smite: {
    name: 'Castigo', maxLvl: 5, bookMult: 1, group: 'dmg',
    plainDesc: 'Daño masivo extra (+2.5 por nivel) contra no-muertos (Zombis, Esqueletos, Wither).',
    sourceTag: 'Mesa Nv. 30 (Espada/Maza) / Bibliotecario',
    javaVsBedrock: 'Incompatible con Filo, Perdición de los Artrópodos, y en la Maza también con Densidad y Fisura.'
  },
  bane_arthropods: {
    name: 'Perdición de los Artrópodos', maxLvl: 5, bookMult: 1, group: 'dmg',
    plainDesc: 'Daño extra y lentitud IV contra arañas, abejas, lepisma y endermites.',
    sourceTag: 'Mesa Nv. 30 (Espada/Maza) / Bibliotecario',
    javaVsBedrock: 'Incompatible con Filo, Castigo, y en la Maza también con Densidad y Fisura.'
  },
  knockback: {
    name: 'Empuje', maxLvl: 2, bookMult: 1, group: null,
    plainDesc: 'Lanza hacia atrás a los enemigos al golpearlos.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Herrero Armas',
    javaVsBedrock: 'Puede venir al máximo (Nv. II) en la Espada de Diamante del Herrero de Armas Maestro.'
  },
  fire_aspect: {
    name: 'Aspecto Ígneo', maxLvl: 2, bookMult: 2, group: null,
    plainDesc: 'Quema a los enemigos al golpearlos y cocina automáticamente la carne de animales.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'En Bedrock también puede encender velas, fogatas y TNT al golpear con la espada.'
  },
  looting: {
    name: 'Botín', maxLvl: 3, bookMult: 2, group: null,
    plainDesc: 'Aumenta la cantidad de objetos, perlas, varas y cabezas raras que sueltan los enemigos.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'El Herrero de Armas solo llega a Botín I; para Botín III usa Mesa Nv. 30 o Bibliotecario.'
  },
  sweeping_edge: {
    name: 'Filo Arrasador', maxLvl: 3, bookMult: 2, group: null,
    plainDesc: 'Aumenta el daño en área del ataque barrido de la espada (exclusivo Java Edition).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario (Solo Java)',
    javaVsBedrock: 'EXCLUSIVO DE JAVA EDITION: No existe en Bedrock Edition y se desactiva automáticamente al cambiar de edición.'
  },
  efficiency: {
    name: 'Eficiencia', maxLvl: 5, bookMult: 1, group: null,
    plainDesc: 'Aumenta drásticamente la velocidad al picar, talar o excavar.',
    sourceTag: 'Mesa Nv. 30 (máx. IV en Diamante) / Bibliotecario',
    javaVsBedrock: 'En Mesa Nv. 30 el Diamante tiene techo de nivel modificado 40, así que Eficiencia V (exige ≥41) tiene 0% directo en Diamante: saca Eficiencia IV + 1 libro Eficiencia IV.'
  },
  silk_touch: {
    name: 'Toque de Seda', maxLvl: 1, bookMult: 4, group: 'mine_drop',
    plainDesc: 'Recoge el bloque intacto (menas, cristal, hielo, césped, colmenas).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Herrero Herramientas',
    javaVsBedrock: 'Multiplicador x4 en yunque. Incompatible con Fortuna. En Herrero de Herramientas puede salir de fábrica (~3.8%).'
  },
  fortune: {
    name: 'Fortuna', maxLvl: 3, bookMult: 2, group: 'mine_drop',
    plainDesc: 'Multiplica los diamantes, carbón, cultivos y minerales obtenidos (hasta x4 en Nv. III).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Incompatible con Toque de Seda. En Herrero solo llega a Fortuna II.'
  },
  unbreaking: {
    name: 'Irrompibilidad', maxLvl: 3, bookMult: 1, group: null,
    plainDesc: 'Multiplica la vida útil del objeto (x4 en herramientas/armas, ~x1.43 en armadura).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Aldeanos Equipo',
    javaVsBedrock: 'Sale al máximo (Nv. III) en Armero, Herrero de Armas y Herrero de Herramientas.'
  },
  mending: {
    name: 'Reparación', maxLvl: 1, bookMult: 2, group: null,
    plainDesc: 'Repara automáticamente el objeto (2 durabilidad por 1 XP) usando los orbes que recoges.',
    sourceTag: 'Tesoro (Bibliotecario / Cofres / Pesca)',
    javaVsBedrock: '0% en Mesa de Encantamientos y 0% en Aldeanos de equipo. En Arcos es incompatible con Infinidad.'
  },
  power: {
    name: 'Poder', maxLvl: 5, bookMult: 1, group: null,
    plainDesc: 'Aumenta considerablemente el daño de las flechas (+25% × (Nv+1)).',
    sourceTag: 'Mesa Nv. 30 (hasta IV) / Bibliotecario',
    javaVsBedrock: 'El Arco tiene encantabilidad 1: en Mesa Nv. 30 llega hasta Poder IV (Poder V requiere libro o juntar dos IV).'
  },
  punch: {
    name: 'Retroceso', maxLvl: 2, bookMult: 2, group: null,
    plainDesc: 'Empuja hacia atrás a los enemigos impactados por tus flechas.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'En Flechero solo llega hasta Retroceso I.'
  },
  flame: {
    name: 'Fuego', maxLvl: 1, bookMult: 2, group: null,
    plainDesc: 'Dispara flechas en llamas que incendian al objetivo y activan TNT.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: '0% en Flechero. Sí aparece en Mesa Nv. 30 y Bibliotecarios.'
  },
  infinity: {
    name: 'Infinidad', maxLvl: 1, bookMult: 4, group: null,
    plainDesc: 'Permite disparar flechas normales infinitas teniendo solo 1 en el inventario.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Multiplicador x4 en yunque. Incompatible con Reparación en Arcos; no funciona con flechas con efecto ni espectrales.'
  },
  multishot: {
    name: 'Multidisparo', maxLvl: 1, bookMult: 2, group: 'xbow',
    plainDesc: 'Dispara 3 flechas o cohetes en abanico gastando solo 1 proyectil.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: '0% en Flechero. Incompatible con Perforación.'
  },
  piercing: {
    name: 'Perforación', maxLvl: 4, bookMult: 1, group: 'xbow',
    plainDesc: 'Las flechas atraviesan escudos y hasta 5 enemigos en fila (puedes recogerlas después).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Flechero (hasta III)',
    javaVsBedrock: 'Incompatible con Multidisparo.'
  },
  quick_charge: {
    name: 'Carga Rápida', maxLvl: 3, bookMult: 1, group: null,
    plainDesc: 'Reduce el tiempo de recarga de la ballesta en 0.25s por nivel (0.5s total en Nv. III).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'En Flechero solo llega hasta Carga Rápida II.'
  },
  loyalty: {
    name: 'Lealtad', maxLvl: 3, bookMult: 1, group: 'trident_mov',
    plainDesc: 'El tridente regresa automáticamente a tu mano tras lanzarlo (incluso desde el vacío en 1.21+).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Incompatible con Propulsión Acuática. Compatible con Canalización.'
  },
  riptide: {
    name: 'Propulsión Acuática', maxLvl: 3, bookMult: 2, group: 'trident_mov',
    plainDesc: 'Te impulsa por el aire cuando estás en el agua o bajo la lluvia.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Incompatible tanto con Lealtad como con Canalización (no puedes lanzar el tridente con Propulsión).'
  },
  impaling: {
    name: 'Empalamiento', maxLvl: 5, bookMult: 2, group: null,
    plainDesc: 'Inflige daño masivo extra (+2.5 por nivel) a criaturas acuáticas.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Gran diferencia: en Java solo afecta a mobs acuáticos (Guardianes, Ahogados, Peces); en Bedrock afecta a CUALQUIER mob que esté en agua o bajo la lluvia.'
  },
  channeling: {
    name: 'Canalización', maxLvl: 1, bookMult: 4, group: null,
    plainDesc: 'Invoca un rayo sobre el objetivo durante tormentas eléctricas (útil para cabezas de mobs).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Multiplicador x4 en yunque. Incompatible con Propulsión Acuática; combínalo con Lealtad III.'
  },
  density: {
    name: 'Densidad', maxLvl: 5, bookMult: 1, group: 'mace_dmg',
    plainDesc: 'Multiplica el daño de caída (+0.5 por bloque caído por nivel) con la Maza.',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Incompatible con Fisura, Castigo y Perdición de los Artrópodos en la Maza.'
  },
  breach: {
    name: 'Fisura', maxLvl: 4, bookMult: 2, group: 'mace_dmg',
    plainDesc: 'Ignora un 15% de la eficacia de la armadura enemiga por nivel (60% en Nv. IV).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario',
    javaVsBedrock: 'Excelente para PvP contra armaduras de Netherita. Incompatible con Densidad, Castigo y Artrópodos.'
  },
  wind_burst: {
    name: 'Ráfaga de Viento', maxLvl: 3, bookMult: 2, group: null,
    plainDesc: 'Te impulsa hacia arriba tras acertar un golpe smash aéreo para encadenar ataques.',
    sourceTag: 'Exclusivo Bóveda Ominosa (Trial Chambers)',
    javaVsBedrock: '0% en Bibliotecarios y 0% en Mesa. Solo cae como libro Wind Burst I en Bóvedas Ominosas (~5.5% por llave); requiere fusionar libros para Nv. II–III.'
  },
  luck_of_the_sea: {
    name: 'Suerte Marina', maxLvl: 3, bookMult: 2, group: null,
    plainDesc: 'Aumenta la probabilidad de pescar tesoros (libros encantados, monturas, etiquetas).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Pesca',
    javaVsBedrock: 'En Pescador (Aprendiz) solo llega a Suerte Marina I.'
  },
  lure: {
    name: 'Atracción', maxLvl: 3, bookMult: 2, group: null,
    plainDesc: 'Reduce el tiempo de espera para que piquen los peces (5s menos por nivel).',
    sourceTag: 'Mesa Nv. 30 / Bibliotecario / Pesca',
    javaVsBedrock: 'En Pescador (Aprendiz) solo llega a Atracción I.'
  },
  vanishing_curse: {
    name: 'Maldición de Desaparición', maxLvl: 1, bookMult: 4, group: null,
    plainDesc: 'El objeto desaparece al morir (solo útil en servidores PvP para que no lo roben).',
    sourceTag: 'Tesoro (Bibliotecario / Cofres)',
    javaVsBedrock: 'No se puede quitar con la Afiladora. Multiplicador x4 en yunque.'
  },
  binding_curse: {
    name: 'Maldición de Ligamiento', maxLvl: 1, bookMult: 4, group: null,
    plainDesc: 'Impide quitarse la pieza de armadura puesta hasta morir (o hasta que se rompa).',
    sourceTag: 'Tesoro (Bibliotecario / Cofres)',
    javaVsBedrock: 'No se puede quitar con la Afiladora. ¡Evítala en Hardcore!'
  }
};

export const ITEMS = [
  {
    id: 'pickaxe', name: 'Pico', category: 'Herramienta', icon: 'pickaxe',
    isArmor: false, materials: ['netherite', 'diamond', 'iron', 'gold', 'stone', 'wood'],
    villagerMaterials: ['netherite', 'diamond', 'iron', 'stone'],
    hasEnchantTable: true, actorKey: 'toolsmith',
    originTitle: 'Crafteo o Herrero de Herramientas (Mesa de Herrería)',
    originDesc: 'Puedes craftearlo con 3 unidades del material + 2 palos, o comprárselo encantado al Herrero de Herramientas.',
    villagerLabel: 'Herrero de Herramientas (Nivel Maestro): lo vende con Toque de Seda + Irrompibilidad III de fábrica.',
    allowed: ['efficiency', 'unbreaking', 'fortune', 'silk_touch', 'mending', 'vanishing_curse'],
    godRoll: { efficiency: 5, unbreaking: 3, fortune: 3, mending: 1 }
  },
  {
    id: 'sword', name: 'Espada', category: 'Arma Cuerpo a Cuerpo', icon: 'sword',
    isArmor: false, materials: ['netherite', 'diamond', 'iron', 'gold', 'stone', 'wood'],
    villagerMaterials: ['netherite', 'diamond', 'iron'],
    hasEnchantTable: true, actorKey: 'weaponsmith',
    originTitle: 'Crafteo o Herrero de Armas (Afiladora)',
    originDesc: 'Crafteable con 2 unidades del material + 1 palo, o comprada encantada al Herrero de Armas.',
    villagerLabel: 'Herrero de Armas (Nivel Maestro): puede traer Irrompibilidad III + Empuje II de fábrica.',
    allowed: ['sharpness', 'smite', 'bane_arthropods', 'unbreaking', 'looting', 'fire_aspect', 'sweeping_edge', 'knockback', 'mending', 'vanishing_curse'],
    godRoll: { sharpness: 5, unbreaking: 3, looting: 3, fire_aspect: 2, sweeping_edge: 3, mending: 1 }
  },
  {
    id: 'axe', name: 'Hacha', category: 'Herramienta / Arma', icon: 'axe',
    isArmor: false, materials: ['netherite', 'diamond', 'iron', 'gold', 'stone', 'wood'],
    villagerMaterials: ['netherite', 'diamond', 'iron', 'stone'],
    hasEnchantTable: true, actorKey: 'weaponsmith',
    originTitle: 'Crafteo, Herrero de Armas o Herrero de Herramientas',
    originDesc: 'Se craftea con 3 unidades del material + 2 palos, o se compra encantada en nivel Experto.',
    villagerLabel: 'Herrero de Armas / Herramientas (Experto): puede traer Toque de Seda + Irrompibilidad III.',
    allowed: ['efficiency', 'sharpness', 'smite', 'bane_arthropods', 'unbreaking', 'fortune', 'silk_touch', 'mending', 'vanishing_curse'],
    godRoll: { efficiency: 5, sharpness: 5, unbreaking: 3, fortune: 3, mending: 1 }
  },
  {
    id: 'shovel', name: 'Pala', category: 'Herramienta', icon: 'shovel',
    isArmor: false, materials: ['netherite', 'diamond', 'iron', 'gold', 'stone', 'wood'],
    villagerMaterials: ['netherite', 'diamond', 'iron', 'stone'],
    hasEnchantTable: true, actorKey: 'toolsmith',
    originTitle: 'Crafteo o Herrero de Herramientas (Mesa de Herrería)',
    originDesc: 'Crafteable con 1 unidad del material + 2 palos, o vendida por el Herrero de Herramientas.',
    villagerLabel: 'Herrero de Herramientas (Experto): puede traer Toque de Seda + Irrompibilidad III.',
    allowed: ['efficiency', 'unbreaking', 'fortune', 'silk_touch', 'mending', 'vanishing_curse'],
    godRoll: { efficiency: 5, unbreaking: 3, silk_touch: 1, mending: 1 }
  },
  {
    id: 'hoe', name: 'Azada', category: 'Herramienta', icon: 'hoe',
    isArmor: false, materials: ['netherite', 'diamond', 'iron', 'gold', 'stone', 'wood'],
    villagerMaterials: [],
    hasEnchantTable: true, actorKey: 'enchant_table',
    originTitle: 'Crafteo (o Trueque con Piglins en Netherita)',
    originDesc: 'Se fabrica con 2 unidades del material + 2 palos. Ningún aldeano vende azadas encantadas.',
    villagerLabel: '',
    allowed: ['efficiency', 'unbreaking', 'fortune', 'silk_touch', 'mending', 'vanishing_curse'],
    godRoll: { efficiency: 5, unbreaking: 3, fortune: 3, mending: 1 }
  },
  {
    id: 'helmet', name: 'Casco', category: 'Armadura', icon: 'helmet',
    isArmor: true, materials: ['netherite', 'diamond', 'iron', 'gold', 'chainmail', 'leather', 'turtle'],
    villagerMaterials: ['netherite', 'diamond', 'iron', 'chainmail'],
    hasEnchantTable: true, actorKey: 'armorer',
    originTitle: 'Crafteo o Armero (Alto Horno)',
    originDesc: 'Crafteable con 5 piezas del material (o escamas de tortuga) o vendido por el Armero.',
    villagerLabel: 'Armero (Maestro): puede traer Afinidad Acuática + Irrompibilidad III de fábrica.',
    allowed: ['protection', 'fire_protection', 'blast_protection', 'proj_protection', 'respiration', 'aqua_affinity', 'unbreaking', 'thorns', 'mending', 'binding_curse', 'vanishing_curse'],
    godRoll: { protection: 4, unbreaking: 3, respiration: 3, aqua_affinity: 1, mending: 1 }
  },
  {
    id: 'chestplate', name: 'Peto', category: 'Armadura', icon: 'chestplate',
    isArmor: true, materials: ['netherite', 'diamond', 'iron', 'gold', 'chainmail', 'leather'],
    villagerMaterials: ['netherite', 'diamond', 'iron', 'chainmail'],
    hasEnchantTable: true, actorKey: 'armorer',
    originTitle: 'Crafteo o Armero (Alto Horno)',
    originDesc: 'Crafteable con 8 unidades del material o vendido encantado por el Armero.',
    villagerLabel: 'Armero (Maestro): puede traer Irrompibilidad III de fábrica.',
    allowed: ['protection', 'fire_protection', 'blast_protection', 'proj_protection', 'unbreaking', 'thorns', 'mending', 'binding_curse', 'vanishing_curse'],
    godRoll: { protection: 4, unbreaking: 3, mending: 1 }
  },
  {
    id: 'leggings', name: 'Pantalones', category: 'Armadura', icon: 'leggings',
    isArmor: true, materials: ['netherite', 'diamond', 'iron', 'gold', 'chainmail', 'leather'],
    villagerMaterials: ['netherite', 'diamond', 'iron', 'chainmail'],
    hasEnchantTable: true, actorKey: 'armorer',
    originTitle: 'Crafteo o Armero (Alto Horno)',
    originDesc: 'Crafteable con 7 unidades del material o vendido encantado por el Armero.',
    villagerLabel: 'Armero (Experto): puede traer Irrompibilidad III de fábrica (Protección IV nunca sale aquí).',
    allowed: ['protection', 'fire_protection', 'blast_protection', 'proj_protection', 'swift_sneak', 'unbreaking', 'thorns', 'mending', 'binding_curse', 'vanishing_curse'],
    godRoll: { protection: 4, unbreaking: 3, swift_sneak: 3, mending: 1 }
  },
  {
    id: 'boots', name: 'Botas', category: 'Armadura', icon: 'boots',
    isArmor: true, materials: ['netherite', 'diamond', 'iron', 'gold', 'chainmail', 'leather'],
    villagerMaterials: ['netherite', 'diamond', 'iron', 'chainmail'],
    hasEnchantTable: true, actorKey: 'armorer',
    originTitle: 'Crafteo o Armero (Alto Horno)',
    originDesc: 'Crafteable con 4 unidades del material o vendidas encantadas por el Armero.',
    villagerLabel: 'Armero (Experto): puede traer Caída de Pluma IV + Irrompibilidad III juntos.',
    allowed: ['protection', 'fire_protection', 'blast_protection', 'proj_protection', 'feather_falling', 'depth_strider', 'frost_walker', 'soul_speed', 'unbreaking', 'thorns', 'mending', 'binding_curse', 'vanishing_curse'],
    godRoll: { protection: 4, feather_falling: 4, depth_strider: 3, unbreaking: 3, mending: 1 }
  },
  {
    id: 'elytra', name: 'Élitros (Elytra)', category: 'Equipamiento Especial', icon: 'elytra',
    isArmor: false, materials: [], villagerMaterials: [],
    hasEnchantTable: false, actorKey: 'end_ship', enchantability: 0,
    originTitle: 'Exclusivo de Barcos del End (NO Crafteable / NO Aldeanos)',
    originDesc: 'Se encuentran únicamente en los marcos de los Barcos flotantes de las Ciudades del End. No se craftean ni entran en la Mesa de Encantamientos.',
    villagerLabel: '',
    allowed: ['unbreaking', 'mending', 'binding_curse', 'vanishing_curse'],
    godRoll: { unbreaking: 3, mending: 1 }
  },
  {
    id: 'bow', name: 'Arco', category: 'Arma a Distancia', icon: 'bow',
    isArmor: false, materials: [], villagerMaterials: ['default'],
    hasEnchantTable: true, actorKey: 'fletcher', enchantability: 1,
    originTitle: 'Crafteo o Flechero (Mesa de Flechas)',
    originDesc: 'Se fabrica con 3 palos + 3 hilos, o se compra al Flechero (Nivel Experto).',
    villagerLabel: 'Flechero (Experto): solo llega hasta Poder III (Fuego e Infinidad tienen 0% aquí).',
    allowed: ['power', 'unbreaking', 'punch', 'flame', 'infinity', 'mending', 'vanishing_curse'],
    godRoll: { power: 5, unbreaking: 3, flame: 1, punch: 2, infinity: 1 }
  },
  {
    id: 'crossbow', name: 'Ballesta', category: 'Arma a Distancia', icon: 'crossbow',
    isArmor: false, materials: [], villagerMaterials: ['default'],
    hasEnchantTable: true, actorKey: 'fletcher', enchantability: 1,
    originTitle: 'Crafteo o Flechero (Mesa de Flechas)',
    originDesc: 'Crafteable con palos, hilo, hierro y gancho, o comprada al Flechero.',
    villagerLabel: 'Flechero (Maestro): puede dar Perforación III o Carga Rápida II (Multidisparo es 0%).',
    allowed: ['quick_charge', 'multishot', 'piercing', 'unbreaking', 'mending', 'vanishing_curse'],
    godRoll: { quick_charge: 3, multishot: 1, unbreaking: 3, mending: 1 }
  },
  {
    id: 'trident', name: 'Tridente', category: 'Arma Especial', icon: 'trident',
    isArmor: false, materials: [], villagerMaterials: [],
    hasEnchantTable: true, actorKey: 'drowned', enchantability: 1,
    originTitle: 'Exclusivo de Ahogados (Drowned) — NO Aldeanos',
    originDesc: 'Solo lo sueltan los zombis Ahogados que aparecen portándolo en océanos y ríos.',
    villagerLabel: '',
    allowed: ['impaling', 'loyalty', 'riptide', 'channeling', 'unbreaking', 'mending', 'vanishing_curse'],
    godRoll: { impaling: 5, loyalty: 3, channeling: 1, unbreaking: 3, mending: 1 }
  },
  {
    id: 'mace', name: 'Maza (Mace)', category: 'Arma Especial', icon: 'mace',
    isArmor: false, materials: [], villagerMaterials: [],
    hasEnchantTable: true, actorKey: 'enchant_table', enchantability: 15,
    originTitle: 'Crafteo con Núcleo Pesado + Vara de Breeze',
    originDesc: 'Se craftea combinando un Heavy Core (Bóveda Ominosa) y una Breeze Rod de las Trial Chambers.',
    villagerLabel: '',
    allowed: ['density', 'breach', 'wind_burst', 'smite', 'bane_arthropods', 'fire_aspect', 'unbreaking', 'mending', 'vanishing_curse'],
    godRoll: { density: 5, wind_burst: 3, unbreaking: 3, mending: 1 }
  },
  {
    id: 'fishing_rod', name: 'Caña de Pescar', category: 'Herramienta', icon: 'rod',
    isArmor: false, materials: [], villagerMaterials: ['default'],
    hasEnchantTable: true, actorKey: 'fisherman', enchantability: 1,
    originTitle: 'Crafteo o Pescador (Barril)',
    originDesc: 'Crafteable con 3 palos + 2 hilos o vendida por el Pescador (Nivel Aprendiz).',
    villagerLabel: 'Pescador (Aprendiz): solo llega a Suerte Marina I / Atracción I.',
    allowed: ['luck_of_the_sea', 'lure', 'unbreaking', 'mending', 'vanishing_curse'],
    godRoll: { luck_of_the_sea: 3, lure: 3, unbreaking: 3, mending: 1 }
  },
  {
    id: 'shield', name: 'Escudo', category: 'Defensa', icon: 'shield',
    isArmor: false, materials: [], villagerMaterials: [],
    hasEnchantTable: false, actorKey: 'librarian', enchantability: 0,
    originTitle: 'Crafteo o Armero (sin encantar)',
    originDesc: 'Se fabrica con 6 tablones de madera + 1 lingote de hierro. Solo se encanta en Yunque.',
    villagerLabel: '',
    allowed: ['unbreaking', 'mending', 'vanishing_curse'],
    godRoll: { unbreaking: 3, mending: 1 }
  },
  {
    id: 'shears', name: 'Tijeras', category: 'Herramienta', icon: 'shears',
    isArmor: false, materials: [], villagerMaterials: [],
    hasEnchantTable: false, actorKey: 'librarian', enchantability: 0,
    originTitle: 'Crafteo o Pastor (sin encantar)',
    originDesc: 'Se fabrica con 2 lingotes de hierro. Solo admite libros en el Yunque.',
    villagerLabel: '',
    allowed: ['efficiency', 'unbreaking', 'mending', 'vanishing_curse'],
    godRoll: { efficiency: 5, unbreaking: 3, mending: 1 }
  },
  {
    id: 'flint_and_steel', name: 'Mechero', category: 'Herramienta', icon: 'flint_steel',
    isArmor: false, materials: [], villagerMaterials: [],
    hasEnchantTable: false, actorKey: 'librarian', enchantability: 0,
    originTitle: 'Crafteo (1 Lingote de Hierro + 1 Pedernal)',
    originDesc: 'Solo admite libros de Irrompibilidad, Reparación o Desaparición en el Yunque.',
    villagerLabel: '',
    allowed: ['unbreaking', 'mending', 'vanishing_curse'],
    godRoll: { unbreaking: 3, mending: 1 }
  },
  {
    id: 'brush', name: 'Pincel (Brush)', category: 'Arqueología', icon: 'brush',
    isArmor: false, materials: [], villagerMaterials: [],
    hasEnchantTable: false, actorKey: 'librarian', enchantability: 0,
    originTitle: 'Crafteo (1 Pluma + 1 Lingote de Cobre + 1 Palo)',
    originDesc: 'Usado para limpiar arena y grava sospechosa. Solo se encanta mediante libros en el Yunque.',
    villagerLabel: '',
    allowed: ['unbreaking', 'mending', 'vanishing_curse'],
    godRoll: { unbreaking: 3, mending: 1 }
  },
  {
    id: 'carved_pumpkin', name: 'Calabaza Tallada', category: 'Cabeza Especial', icon: 'pumpkin',
    isArmor: false, materials: [], villagerMaterials: [],
    hasEnchantTable: false, actorKey: 'librarian', enchantability: 0,
    originTitle: 'Usar Tijeras sobre una Calabaza',
    originDesc: 'Evita que los Endermen te ataquen al mirarlos. Solo acepta maldiciones en el Yunque.',
    villagerLabel: '',
    allowed: ['binding_curse', 'vanishing_curse'],
    godRoll: { binding_curse: 1 }
  }
];

export const VILLAGER_DB = [
  {
    id: 'librarian',
    actorKey: 'librarian',
    prof: 'Bibliotecario',
    station: 'Atril (Lectern)',
    lvl: 'Niveles 1–4',
    probJava: '66.7% / hueco',
    probBedrock: '66.7% / hueco',
    item: 'Libros Encantados (hasta 4 por aldeano)',
    relatedItems: ['ALL'],
    cap: 'Todos los niveles máximos (Protección IV, Filo V, Eficiencia V, Reparación, Fortuna III)',
    impossible: 'Sigilo Veloz, Velocidad de Almas, Ráfaga de Viento (0%)',
    strategy: 'Rompe y coloca el Atril antes de comerciar para rotar la 1ª ranura; bloquea el tradeo comprando 1 vez en cuanto veas tu libro.',
    javaVsBedrock: 'En Java hay 37 encantamientos en el pool del Bibliotecario; en Bedrock ~30 (no existe Filo Arrasador y el reparto tiene ligeras variaciones).'
  },
  {
    id: 'armorer',
    actorKey: 'armorer',
    prof: 'Armero',
    station: 'Alto Horno (Blast Furnace)',
    lvl: 'Experto y Maestro',
    probJava: '100% (4 piezas)',
    probBedrock: '50% por pieza',
    item: 'Casco, Peto, Pantalones y Botas de Diamante',
    relatedItems: ['helmet', 'chestplate', 'leggings', 'boots'],
    cap: 'Irrompibilidad III (~3.5%), Caída de Pluma IV en Botas (~2.8%), Afinidad Acuática en Casco (~12%), Protección II (~18%)',
    impossible: 'Protección III y IV (0%), Espinas I–III (0%), Agilidad Acuática (0%), Reparación (0%)',
    strategy: 'Excelente para conseguir Botas con Caída de Pluma IV + Irrompibilidad III o Casco con Afinidad Acuática + Irrompibilidad III.',
    javaVsBedrock: 'En Java cada Armero Maestro ofrece las 4 piezas de diamante (100%); en Bedrock cada hueco tiene 50% de aparecer, así que puedes necesitar 2 Armeros.'
  },
  {
    id: 'weaponsmith',
    actorKey: 'weaponsmith',
    prof: 'Herrero de Armas',
    station: 'Afiladora (Grindstone)',
    lvl: 'Experto y Maestro',
    probJava: '100%',
    probBedrock: '50% por pieza',
    item: 'Hacha (Nv.4) y Espada (Nv.5) de Diamante',
    relatedItems: ['sword', 'axe'],
    cap: 'Irrompibilidad III (~3.5%), Filo III (~2.2%), Empuje II (~4%), Barrido II (~5%), Toque de Seda en Hacha (~3.8%)',
    impossible: 'Filo IV y V (0%), Botín II–III (0%), Aspecto Ígneo II (0%), Barrido III (0%)',
    strategy: 'Busca Espada con Irrompibilidad III + Empuje II, o Hacha con Toque de Seda + Irrompibilidad III para ahorrar libros.',
    javaVsBedrock: 'En Java tiene 100% de ofrecer Hacha/Espada de diamante al subir de nivel; en Bedrock es 50%.'
  },
  {
    id: 'toolsmith',
    actorKey: 'toolsmith',
    prof: 'Herrero de Herramientas',
    station: 'Mesa de Herrería (Smithing Table)',
    lvl: 'Experto y Maestro',
    probJava: '66.7% (Nv.4) / 100% (Nv.5)',
    probBedrock: '50% por pieza',
    item: 'Hacha, Pala (Nv.4) y Pico de Diamante (Nv.5)',
    relatedItems: ['pickaxe', 'shovel', 'axe'],
    cap: 'Toque de Seda (~3.8%), Irrompibilidad III (~4.2%), Eficiencia III (~8.5%), Fortuna II (~2.1%)',
    impossible: 'Eficiencia IV y V (0%), Fortuna III (0%), Reparación (0%)',
    strategy: 'Premio mayor: Pico o Pala con Toque de Seda + Irrompibilidad III de fábrica (ahorra 2 libros, uno de ellos x4).',
    javaVsBedrock: 'En Java el Pico de Diamante es garantizado (100%) en Maestro; en Bedrock la selección de ranura tiene 50%.'
  },
  {
    id: 'fletcher',
    actorKey: 'fletcher',
    prof: 'Flechero',
    station: 'Mesa de Flechas (Fletching Table)',
    lvl: 'Experto y Maestro',
    probJava: '100%',
    probBedrock: '50%',
    item: 'Arco (Nv.4), Ballesta y Flechas con Efecto (Nv.5)',
    relatedItems: ['bow', 'crossbow'],
    cap: 'Poder III (~4%), Perforación III (~6%), Carga Rápida II (~4%), Flechas de Debilidad (para curar zombis)',
    impossible: 'Poder IV y V (0%), Fuego (0%), Infinidad (0%), Multidisparo (0%)',
    strategy: 'No hagas re-roll intenso para Arcos (encantabilidad 1); úsalo sobre todo para Ballestas con Perforación III y Flechas de Debilidad.',
    javaVsBedrock: 'Ideal además para farmear esmeraldas vendiendo 32 palos en Nivel 1 en ambas ediciones.'
  },
  {
    id: 'fisherman',
    actorKey: 'fisherman',
    prof: 'Pescador',
    station: 'Barril (Barrel)',
    lvl: 'Aprendiz (Nv.2)',
    probJava: '100%',
    probBedrock: '50%',
    item: 'Caña de Pescar Encantada',
    relatedItems: ['fishing_rod'],
    cap: 'Suerte Marina I (~5%), Atracción I (~5%), Irrompibilidad II (~4%)',
    impossible: 'Suerte Marina II–III (0%), Atracción II–III (0%), Reparación (0%)',
    strategy: 'Techo muy bajo (nivel 5–19): conviene mucho más encantar la caña en Mesa Nv. 30 o pescar cañas encantadas.',
    javaVsBedrock: 'Disponible desde Nivel 2 (Aprendiz), barato en early-game.'
  },
  {
    id: 'cleric',
    actorKey: 'cleric',
    prof: 'Clérigo (Soporte XP y Lapis)',
    station: 'Soporte para Pociones (Brewing Stand)',
    lvl: 'Niveles 1–5',
    probJava: '100% (Lapis Nv.2 / XP Nv.5)',
    probBedrock: '100% (Lapis Nv.2 / XP Nv.5)',
    item: 'Lapislázuli (Nv.2) y Frascos de Experiencia (Nv.5)',
    relatedItems: ['ALL'],
    cap: 'Soporte directo: vende Lapislázuli para el Truco del Oro y Frascos de XP para pagar fusiones en el Yunque.',
    impossible: 'No vende armas, armaduras ni libros encantados',
    strategy: 'Imprescindible como soporte: recarga Lapislázuli para re-rolls en Mesa Nv. 30 y Frascos de XP para el Yunque y Reparación.',
    javaVsBedrock: 'Mismas utilidades clave en Java y Bedrock; compra Carne Podrida en Nivel 1.'
  }
];
