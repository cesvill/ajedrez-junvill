/**
 * Motor de Variantes de Ajedrez y Minijuegos Pedagógicos
 * Incluye Ajedrez Tradicional, Dados Mágicos, Rey de la Colina, Guerra de Peones,
 * Minijuegos de Piezas (Caballos, Alfiles, Torres, Damas) y Fischer Random 960.
 */

export const CHESS_VARIANTS = [
  // --- GRUPO 1: MODALIDADES PRINCIPALES Y POPULARES ---
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
    specialWinCondition: null
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
    specialWinCondition: null
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
    specialWinCondition: 'king_center'
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
    specialWinCondition: null
  },

  // --- GRUPO 2: MINIJUEGOS PEDAGÓGICOS DE APRENDIZAJE ---
  {
    id: 'pawn_wars',
    category: 'learning',
    name: 'Guerra de Peones',
    subtitle: 'Reyes + 8 Peones',
    icon: '⚔️♟️',
    badge: 'Nivel 1 • Peones',
    badgeColor: '#10b981',
    borderGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(4, 120, 87, 0.28) 100%)',
    borderColor: '#10b981',
    description: 'Solo Reyes y Peones. El primer peón que corone gana la partida al instante. ¡Ideal para aprender estructuras y avances!',
    startingFen: '4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion'
  },
  {
    id: 'knights_and_pawns',
    category: 'learning',
    name: 'Caballería e Infantería',
    subtitle: 'Reyes + Peones + Caballos',
    icon: '🐴♟️',
    badge: 'Nivel 2 • Caballos',
    badgeColor: '#8b5cf6',
    borderGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(91, 33, 182, 0.28) 100%)',
    borderColor: '#8b5cf6',
    description: 'Reyes + 8 Peones + 2 Caballos por bando. Domina los saltos, puestos avanzados y ataques dobles.',
    startingFen: '1n2k1n1/pppppppp/8/8/8/8/PPPPPPPP/1N2K1N1 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_mate'
  },
  {
    id: 'bishops_and_pawns',
    category: 'learning',
    name: 'Duelo de Diagonales',
    subtitle: 'Reyes + Peones + Alfiles',
    icon: '♗♟️',
    badge: 'Nivel 3 • Alfiles',
    badgeColor: '#06b6d4',
    borderGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18) 0%, rgba(14, 116, 144, 0.28) 100%)',
    borderColor: '#06b6d4',
    description: 'Reyes + 8 Peones + 2 Alfiles por bando. Aprende el valor de las diagonales abiertas y casillas de color opuesto.',
    startingFen: '2b1k1b1/pppppppp/8/8/8/8/PPPPPPPP/2B1K1B1 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_mate'
  },
  {
    id: 'rooks_and_pawns',
    category: 'learning',
    name: 'Batalla de Torres',
    subtitle: 'Reyes + Peones + Torres',
    icon: '🏰♟️',
    badge: 'Nivel 4 • Torres',
    badgeColor: '#f97316',
    borderGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.18) 0%, rgba(194, 65, 12, 0.28) 100%)',
    borderColor: '#f97316',
    description: 'Reyes + 8 Peones + 2 Torres. Domina la conquista de columnas abiertas, la 7ma fila y actividad de torres.',
    startingFen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_mate'
  },
  {
    id: 'queens_and_pawns',
    category: 'learning',
    name: 'Duelo de Damas Reales',
    subtitle: 'Reyes + Peones + Dama',
    icon: '👸👑',
    badge: 'Nivel 5 • Damas',
    badgeColor: '#e11d48',
    borderGradient: 'linear-gradient(135deg, rgba(225, 29, 72, 0.18) 0%, rgba(159, 18, 57, 0.28) 100%)',
    borderColor: '#e11d48',
    description: 'Reyes + 8 Peones + 1 Dama por bando. Máxima agilidad, combinaciones tácticas directas y ataque rápido.',
    startingFen: '3qk3/pppppppp/8/8/8/8/PPPPPPPP/3QK3 w - - 0 1',
    hasDice: false,
    specialWinCondition: 'first_promotion_or_mate'
  }
];

/**
 * Obtener variante por su ID
 */
export const getVariantById = (variantId) => {
  return CHESS_VARIANTS.find(v => v.id === variantId) || CHESS_VARIANTS[0];
};

/**
 * Genera una posición inicial válida de Fischer Random 960 (Chess960)
 * Reglas FIDE:
 * 1. Los alfiles deben estar en casillas de distinto color (uno en casilla clara, otro en oscura).
 * 2. El Rey debe estar ubicado entre las dos Torres (para permitir enroque a ambos lados).
 * 3. Las piezas negras son el espejo idéntico de las blancas.
 */
export const generateFischerRandomFen = () => {
  const row = new Array(8).fill(null);

  // 1. Alfil en casilla clara (índices 1, 3, 5, 7)
  const lightSquares = [1, 3, 5, 7];
  const b1 = lightSquares[Math.floor(Math.random() * lightSquares.length)];
  row[b1] = 'B';

  // 2. Alfil en casilla oscura (índices 0, 2, 4, 6)
  const darkSquares = [0, 2, 4, 6];
  const b2 = darkSquares[Math.floor(Math.random() * darkSquares.length)];
  row[b2] = 'B';

  // 3. Dama en una de las casillas vacías restantes
  const emptyForQueen = row.map((v, i) => v === null ? i : null).filter(v => v !== null);
  const q = emptyForQueen[Math.floor(Math.random() * emptyForQueen.length)];
  row[q] = 'Q';

  // 4. Dos Caballos en casillas vacías restantes
  const emptyForKnights = row.map((v, i) => v === null ? i : null).filter(v => v !== null);
  // Escoger 2 índices al azar
  const shuffledKnights = emptyForKnights.sort(() => Math.random() - 0.5);
  row[shuffledKnights[0]] = 'N';
  row[shuffledKnights[1]] = 'N';

  // 5. Las 3 casillas restantes DEBEN ser: Torre, Rey, Torre en orden
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
      const winnerColor = lastMove.color; // 'w' o 'b'
      return {
        winner: winnerColor,
        reason: 'hill_conquest',
        title: `¡Rey de la Colina conquistada en ${lastMove.to.toUpperCase()}! ⛰️👑`,
        subtitle: `El Rey de las ${winnerColor === 'w' ? 'Blancas' : 'Negras'} ha llegado al centro del tablero y gana la partida.`
      };
    }
  }

  // 2. GUERRA DE PEONES: Victoria si un peón corona a Dama/Torre/etc.
  if (variantId === 'pawn_wars' || variantId === 'knights_and_pawns' || variantId === 'bishops_and_pawns' || variantId === 'rooks_and_pawns' || variantId === 'queens_and_pawns') {
    if (lastMove.promotion) {
      const winnerColor = lastMove.color;
      return {
        winner: winnerColor,
        reason: 'pawn_promoted',
        title: `¡Coronación Decisiva en ${lastMove.to.toUpperCase()}! 👑✨`,
        subtitle: `¡Las ${winnerColor === 'w' ? 'Blancas' : 'Negras'} coronaron un peón y aseguran la victoria en este minijuego pedagógico!`
      };
    }
  }

  return null;
};
