/**
 * Motor de Variantes de Ajedrez y Minijuegos Pedagógicos
 * Incluye Ajedrez Tradicional, Dados Mágicos, Rey de la Colina, Fischer 960,
 * Minijuegos Sin Reyes (Iniciación y Entrenamiento Puro) y Minijuegos con Rey Escolta.
 */

export const CHESS_VARIANTS = [
  // =========================================================================
  // GRUPO 1: MODALIDADES PRINCIPALES Y POPULARES
  // =========================================================================
  {
    id: 'standard',
    category: 'popular',
    name: 'Ajedrez Tradicional',
    subtitle: 'Reglamentario FIDE',
    icon: '♟️',
    badge: 'Oficial',
    badgeColor: '#3b82f6',
    borderGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(29, 78, 216, 0.28) 100%)',
    borderColor: '#3b82f6',
    description: 'Partida estándar con las 32 piezas reglamentarias y todas las leyes oficiales del ajedrez.',
    startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    hasDice: false,
    specialWinCondition: null,
    rules: {
      goal: 'Dar Jaque Mate al Rey rival.',
      mechanics: [
        'Partida estándar completa con 32 piezas y reglamento oficial FIDE.'
      ],
      proTip: 'Controla el centro, desarrolla tus piezas menores y enroca a tiempo.'
    }
  },
  {
    id: 'dice_chess',
    category: 'popular',
    name: 'Dados Mágicos',
    subtitle: 'Diversión Familiar',
    icon: '🎲',
    badge: 'Familiar',
    badgeColor: '#ec4899',
    borderGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.18) 0%, rgba(190, 24, 93, 0.28) 100%)',
    borderColor: '#ec4899',
    description: 'En cada turno el dado determina qué pieza mover. ¡Solo salen piezas con movimientos legales!',
    startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    hasDice: true,
    specialWinCondition: null,
    rules: {
      goal: 'Dar Jaque Mate al Rey rival como en ajedrez tradicional.',
      mechanics: [
        'En cada turno se lanza un dado que te indica qué tipo de pieza estás obligado a mover.',
        'El dado es inteligente: solo selecciona piezas que tengan al menos una jugada legal disponible en esa posición.',
        'Si estás jugando con ayudas de principiante o intermedio, tienes opción de relanzar el dado.'
      ],
      proTip: 'Mantén varias piezas activas para que cualquier tirada del dado te ofrezca buenas jugadas tácticas.'
    }
  },
  {
    id: 'king_of_the_hill',
    category: 'popular',
    name: 'Rey de la Colina',
    subtitle: 'Conquista Central',
    icon: '⛰️👑',
    badge: 'Estratégica',
    badgeColor: '#f59e0b',
    borderGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(180, 83, 9, 0.28) 100%)',
    borderColor: '#f59e0b',
    description: 'El primer Rey que pise una de las 4 casillas centrales (d4, d5, e4, e5) gana la partida de inmediato.',
    startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    hasDice: false,
    specialWinCondition: 'king_center',
    rules: {
      goal: 'Llevar a tu propio Rey a cualquiera de las 4 casillas centrales (d4, d5, e4, e5) o dar Jaque Mate tradicional.',
      mechanics: [
        'Las casillas centrales d4, d5, e4 y e5 forman "La Cima de la Colina".',
        '¡El primer jugador que logre situar su Rey en cualquiera de esas 4 casillas gana la partida al instante!',
        'El Jaque Mate tradicional sigue siendo válido como victoria.'
      ],
      proTip: 'Avanza tus peones para abrir paso a tu Rey hacia el centro mientras vigilas que el Rey rival no se cuele en la colina.'
    }
  },
  {
    id: 'fischer_960',
    category: 'popular',
    name: 'Ajedrez 960 (Fischer)',
    subtitle: 'Creatividad Pura',
    icon: '🎲♟️',
    badge: 'Creativo',
    badgeColor: '#a855f7',
    borderGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(107, 33, 168, 0.28) 100%)',
    borderColor: '#a855f7',
    description: 'Piezas mayores en orden aleatorio simétrico. Sin aperturas de memoria: pura intuición táctica.',
    startingFen: 'fischer_random',
    hasDice: false,
    specialWinCondition: null,
    rules: {
      goal: 'Dar Jaque Mate al Rey rival.',
      mechanics: [
        'La primera fila de piezas mayores se genera aleatoriamente al inicio de la partida.',
        'Ambos bandos inician con la misma posición simétrica idéntica.',
        'Los dos Alfiles siempre inician en casillas de distinto color (uno clara y otro oscura).',
        'El Rey siempre inicia en alguna casilla entre sus dos Torres para permitir el enroque.',
        'Las reglas de movimiento, captura y coronación son exactamente iguales al ajedrez tradicional.'
      ],
      proTip: 'No intentes recordar jugadas de apertura memorizadas; analiza la armonía de tus piezas desde la primera jugada.'
    }
  },

  // =========================================================================
  // GRUPO 2: MINIJUEGOS PEDAGÓGICOS SIN REY (INICIACIÓN & ENTRENAMIENTO PURO)
  // =========================================================================
  {
    id: 'pawn_wars_pure',
    category: 'learning',
    name: 'Guerra de Peones Pura',
    subtitle: '8 Peones vs 8 Peones',
    icon: '⚔️♟️',
    badge: 'Sin Reyes • Nivel 1',
    badgeColor: '#10b981',
    borderGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.20) 0%, rgba(4, 120, 87, 0.32) 100%)',
    borderColor: '#10b981',
    description: 'Sin reyes ni jaques. 8 peones contra 8 peones: el primero que corone en la 8ª fila o capture todos los peones gana.',
    startingFen: '8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion',
    rules: {
      goal: '¡El primer jugador que corone un Peón (llegando a la última fila) o capture todos los peones rivales gana la partida!',
      mechanics: [
        '¡Tablero 100% libre de reyes y jaques! Solo los 16 peones en sus filas iniciales.',
        'Los peones avanzan 1 casilla (o 2 en su primer movimiento) y capturan en diagonal.',
        'Ideal para aprender estructuras, bloqueos, peones pasados y cadenas de defensa.'
      ],
      proTip: 'Crea cadenas de peones unidas para que se defiendan entre sí y busca abrir un peón pasado en las columnas laterales.'
    }
  },
  {
    id: 'pawns_vs_knights',
    category: 'learning',
    name: 'Peones vs. Caballos (PECA)',
    subtitle: '8 Peones vs 2 Caballos',
    icon: '🐴♟️',
    badge: 'Sin Reyes • Nivel 2',
    badgeColor: '#8b5cf6',
    borderGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.20) 0%, rgba(91, 33, 182, 0.32) 100%)',
    borderColor: '#8b5cf6',
    description: '8 Peones Blancos intentan llegar a la 8ª fila mientras 2 Caballos Negros defienden la meta. ¡Domina los saltos y horquillas!',
    startingFen: '1n4n1/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_wipe',
    rules: {
      goal: 'Las Blancas ganan si coronan al menos 1 peón. Las Negras ganan si capturan a los 8 peones antes de que lleguen.',
      mechanics: [
        'Sin reyes en el tablero: combate puro de asalto vs defensa táctica.',
        'Las Blancas controlan una muralla de 8 peones.',
        'Las Negras controlan 2 Caballos ágiles con saltos en "L" para interceptar peones.'
      ],
      proTip: 'Como Blancas, avanza tus peones en grupo sin dejar peones aislados. Como Negras, busca casillas centrales para lanzar horquillas.'
    }
  },
  {
    id: 'rooks_sweeper',
    category: 'learning',
    name: 'La Torre Cazadora',
    subtitle: '8 Peones vs 1 Torre',
    icon: '🏰♟️',
    badge: 'Sin Reyes • Nivel 3',
    badgeColor: '#f97316',
    borderGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.20) 0%, rgba(194, 65, 12, 0.32) 100%)',
    borderColor: '#f97316',
    description: '8 Peones Blancos en avalancha contra 1 Torre Negra. ¿Podrán los peones romper la barrera o la torre limpiará las columnas?',
    startingFen: '3r4/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_wipe',
    rules: {
      goal: 'Las Blancas ganan si logran coronar 1 peón. Las Negras ganan si la Torre barre a todos los peones.',
      mechanics: [
        'Sin reyes: entrenamiento puro de líneas abiertas y visión horizontal/vertical.',
        'La Torre debe cortar filas y colocarse detrás de los peones para frenar su paso.',
        'Los peones deben avanzar coordinados para sobrecargar la capacidad de captura de la torre.'
      ],
      proTip: 'Avanza peones en flancos opuestos simultáneamente para obligar a la torre a elegir cuál perseguir.'
    }
  },
  {
    id: 'bishops_duel',
    category: 'learning',
    name: 'Alfiles Cruzados vs Peones',
    subtitle: '8 Peones vs 2 Alfiles',
    icon: '♗♟️',
    badge: 'Sin Reyes • Nivel 4',
    badgeColor: '#06b6d4',
    borderGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.20) 0%, rgba(14, 116, 144, 0.32) 100%)',
    borderColor: '#06b6d4',
    description: '8 Peones Blancos vs 2 Alfiles Negros (uno de casillas claras y otro oscuras). Aprende a dominar diagonales largas.',
    startingFen: '2b2b2/8/8/8/8/8/PPPPPPPP/8 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_wipe',
    rules: {
      goal: 'Las Blancas ganan coronando un peón. Los Alfiles ganan capturando los 8 peones.',
      mechanics: [
        'Sin reyes en el tablero.',
        'Los alfiles controlan largas diagonales cruzadas.',
        '¡Un peón que se cuele por una diagonal desprotegida asegura la victoria!'
      ],
      proTip: 'Aprovecha las casillas donde los alfiles no tienen visión simultánea y crea rupturas con peones encadenados.'
    }
  },
  {
    id: 'queens_duel',
    category: 'learning',
    name: 'Duelo de Damas y Peones',
    subtitle: '1 Dama + 8 Peones por bando',
    icon: '👸♟️',
    badge: 'Sin Reyes • Nivel 5',
    badgeColor: '#e11d48',
    borderGradient: 'linear-gradient(135deg, rgba(225, 29, 72, 0.20) 0%, rgba(159, 18, 57, 0.32) 100%)',
    borderColor: '#e11d48',
    description: '1 Dama + 8 Peones por bando sin reyes. Juego de máxima velocidad, ataques dobles masivos y coronaciones relámpago.',
    startingFen: '3q4/pppppppp/8/8/8/8/PPPPPPPP/3Q4 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_wipe',
    rules: {
      goal: 'El primer jugador que corone un peón a una segunda Dama o capture todas las piezas rivales gana.',
      mechanics: [
        'Sin reyes: la partida es 100% agresiva y dinámica.',
        'Las damas se desplazan en todas las direcciones para apoyar el avance de peones o cazar piezas desprotegidas.',
        'Coronar un peón otorga una segunda Dama y la victoria inmediata.'
      ],
      proTip: 'Usa tu Dama para clavar y presionar los peones rivales mientras abres camino libre a tus peones más avanzados.'
    }
  },

  // =========================================================================
  // GRUPO 3: MINIJUEGOS CON REY ESCOLTA (ENTRENAMIENTO INTERMEDIO)
  // =========================================================================
  {
    id: 'pawn_wars',
    category: 'intermediate_learning',
    name: 'Reyes y Peones (Escolta)',
    subtitle: 'Reyes + 8 Peones',
    icon: '👑♟️',
    badge: 'Con Rey • Escolta',
    badgeColor: '#14b8a6',
    borderGradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.18) 0%, rgba(15, 118, 110, 0.28) 100%)',
    borderColor: '#14b8a6',
    description: 'Aprende la oposición de reyes y cómo usar a tu Rey como bloqueador y escolta de peones pasados.',
    startingFen: '4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion',
    rules: {
      goal: 'El primer jugador que corone un Peón o dé Jaque Mate al Rey rival gana.',
      mechanics: [
        'El tablero inicia con los 2 Reyes y los 16 Peones.',
        'El Rey debe usarse activamente para abrir paso a los peones pasados o bloquear al rey rival.',
        'Coronar a Dama otorga la victoria automática.'
      ],
      proTip: 'Coloca a tu Rey DELANTE de tu peón pasado para ganar la oposición y empujar al rey rival hacia atrás.'
    }
  },
  {
    id: 'knights_and_pawns',
    category: 'intermediate_learning',
    name: 'Caballería con Rey',
    subtitle: 'Reyes + Peones + Caballos',
    icon: '🐴👑',
    badge: 'Con Rey • Caballos',
    badgeColor: '#8b5cf6',
    borderGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(91, 33, 182, 0.28) 100%)',
    borderColor: '#8b5cf6',
    description: 'Reyes + 8 Peones + 2 Caballos por bando. Domina los puestos avanzados y la coordinación rey-caballo.',
    startingFen: '1n2k1n1/pppppppp/8/8/8/8/PPPPPPPP/1N2K1N1 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_mate',
    rules: {
      goal: 'Coronar el primer Peón o dar Jaque Mate al Rey rival.',
      mechanics: [
        'El tablero inicia con los 2 Reyes, 16 Peones y 4 Caballos (2 por bando).',
        'Los caballos saltan cadenas de peones para amenazar al Rey o capturar peones clave.',
        'Cualquier peón que corone otorga la victoria inmediata.'
      ],
      proTip: 'Instala un caballo en una casilla central protegida por tu peón (puesto avanzado) donde ningún peón rival pueda expulsarlo.'
    }
  }
];

/**
 * Obtener variante por su ID
 */
export const getVariantById = (variantId) => {
  return CHESS_VARIANTS.find(v => v.id === variantId) || CHESS_VARIANTS[0];
};

/**
 * Comprueba si una variante es de tipo sin rey
 */
export const isKinglessVariantId = (variantId) => {
  return ['pawn_wars_pure', 'pawns_vs_knights', 'rooks_sweeper', 'bishops_duel', 'queens_duel'].includes(variantId);
};

/**
 * Genera una posición inicial válida de Fischer Random 960 (Chess960)
 */
export const generateFischerRandomFen = () => {
  const row = new Array(8).fill(null);

  const lightSquares = [1, 3, 5, 7];
  const b1 = lightSquares[Math.floor(Math.random() * lightSquares.length)];
  row[b1] = 'B';

  const darkSquares = [0, 2, 4, 6];
  const b2 = darkSquares[Math.floor(Math.random() * darkSquares.length)];
  row[b2] = 'B';

  const emptyForQueen = row.map((v, i) => v === null ? i : null).filter(v => v !== null);
  const q = emptyForQueen[Math.floor(Math.random() * emptyForQueen.length)];
  row[q] = 'Q';

  const emptyForKnights = row.map((v, i) => v === null ? i : null).filter(v => v !== null);
  const shuffledKnights = emptyForKnights.sort(() => Math.random() - 0.5);
  row[shuffledKnights[0]] = 'N';
  row[shuffledKnights[1]] = 'N';

  const remaining = row.map((v, i) => v === null ? i : null).filter(v => v !== null).sort((a, b) => a - b);
  row[remaining[0]] = 'R';
  row[remaining[1]] = 'K';
  row[remaining[2]] = 'R';

  const whiteRow = row.join('');
  const blackRow = row.map(c => c.toLowerCase()).join('');

  return `${blackRow}/pppppppp/8/8/8/8/PPPPPPPP/${whiteRow} w KQkq - 0 1`;
};

/**
 * Obtener FEN inicial para la variante especificada
 */
export const getStartingFenForVariant = (variantId, handicapConfig = null) => {
  if (variantId === 'fischer_960') {
    return generateFischerRandomFen();
  }

  const variant = getVariantById(variantId);

  // Si hay handicap de piezas configurado Y la variante es estándar o dados, respetar handicap
  if (handicapConfig?.enabled && handicapConfig.pieceOdds && handicapConfig.pieceOdds !== 'none') {
    if (['standard', 'dice_chess', 'king_of_the_hill'].includes(variantId)) {
      const oddsMap = {
        pawn_f_black: 'rnbqkbnr/ppppp1pp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        pawn_f_white: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPP1PP/RNBQKBNR w KQkq - 0 1',
        knight_b_black: 'r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        knight_b_white: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R1BQKBNR w KQkq - 0 1',
        rook_a_black: '1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQk - 0 1',
        rook_a_white: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR w Kkq - 0 1',
        queen_black: 'rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        queen_white: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
      };
      if (oddsMap[handicapConfig.pieceOdds]) {
        return oddsMap[handicapConfig.pieceOdds];
      }
    }
  }

  return variant.startingFen;
};

/**
 * Evalúa si se cumplió una condición de victoria especial propia de la variante
 */
export const checkVariantWinCondition = (chessGame, lastMove, variantId) => {
  if (!lastMove) return null;

  // 1. REY DE LA COLINA: Victoria si el Rey llega a d4, d5, e4 o e5
  if (variantId === 'king_of_the_hill') {
    if (lastMove.piece === 'k' && ['d4', 'd5', 'e4', 'e5'].includes(lastMove.to)) {
      const winnerColor = lastMove.color;
      return {
        winner: winnerColor,
        reason: 'hill_conquest',
        title: `¡Rey de la Colina conquistada en ${lastMove.to.toUpperCase()}! ⛰️👑`,
        subtitle: `El Rey de las ${winnerColor === 'w' ? 'Blancas' : 'Negras'} ha llegado al centro del tablero y gana la partida.`
      };
    }
  }

  // 2. MINIJUEGOS SIN REY Y GUERRA DE PEONES
  if (['pawn_wars_pure', 'pawns_vs_knights', 'rooks_sweeper', 'bishops_duel', 'queens_duel', 'pawn_wars', 'knights_and_pawns'].includes(variantId)) {
    // Victoria por coronación (alcanzar la 8ª o 1ª fila)
    if (lastMove.promotion || (lastMove.color === 'w' && lastMove.to[1] === '8') || (lastMove.color === 'b' && lastMove.to[1] === '1')) {
      const winnerColor = lastMove.color;
      return {
        winner: winnerColor,
        reason: 'pawn_promoted',
        title: `¡Meta Alcanzada en ${lastMove.to.toUpperCase()}! 🏆✨`,
        subtitle: `¡Las ${winnerColor === 'w' ? 'Blancas' : 'Negras'} cruzaron el tablero y aseguran la victoria en este minijuego!`
      };
    }

    // Victoria por captura total de piezas rivales
    if (chessGame && typeof chessGame.fen === 'function') {
      const nextFen = chessGame.fen();
      const boardStr = nextFen.split(' ')[0];
      const oppColor = lastMove.color === 'w' ? 'b' : 'w';
      const hasOppPieces = oppColor === 'w' ? /[PNBRQ]/.test(boardStr) : /[pnbrq]/.test(boardStr);
      if (!hasOppPieces) {
        const winnerColor = lastMove.color;
        return {
          winner: winnerColor,
          reason: 'all_captured',
          title: `¡Todas las piezas rivales capturadas! 🎯`,
          subtitle: `¡Las ${winnerColor === 'w' ? 'Blancas' : 'Negras'} limpiaron el tablero y ganan el minijuego!`
        };
      }
    }
  }

  return null;
};
