/**
 * Motor de Ajedrez 3x3: Desafío Mental de 5 Piezas (Puzle Cuby)
 * 
 * Tablero 3x3 (9 casillas):
 * 5 Piezas: Rey (K), Dama (Q), Torre (R), Alfil (B), Caballo (N)
 * 4 Casillas vacías.
 * 
 * Las piezas se desplazan a casillas vacías según las leyes del ajedrez tradicional.
 * Sin capturas. Incluye solver BFS de alto rendimiento (<3ms) para par óptimo y pistas,
 * transformaciones de tarjetas (rotación 90°/180° y volteo/espejo) y mazo pedagógico graduado.
 */

export const CUBY_PIECES = {
  K: { id: 'K', name: 'Rey', symbol: '♚', code: 'k', color: '#facc15' },
  Q: { id: 'Q', name: 'Dama', symbol: '♛', code: 'q', color: '#ec4899' },
  R: { id: 'R', name: 'Torre', symbol: '♜', code: 'r', color: '#38bdf8' },
  B: { id: 'B', name: 'Alfil', symbol: '♝', code: 'b', color: '#a855f7' },
  N: { id: 'N', name: 'Caballo', symbol: '♞', code: 'n', color: '#10b981' }
};

export const CUBY_PIECE_KEYS = ['K', 'Q', 'R', 'B', 'N'];

/**
 * Mapeo de coordenadas en el tablero 3x3:
 * 0: (0,0) - a3 | 1: (0,1) - b3 | 2: (0,2) - c3
 * 3: (1,0) - a2 | 4: (1,1) - b2 | 5: (1,2) - c2
 * 6: (2,0) - a1 | 7: (2,1) - b1 | 8: (2,2) - c1
 */
export const SQUARE_NAMES = [
  'a3', 'b3', 'c3',
  'a2', 'b2', 'c2',
  'a1', 'b1', 'c1'
];

export const getRowCol = (index) => ({
  row: Math.floor(index / 3),
  col: index % 3
});

export const getIndex = (row, col) => row * 3 + col;

export const isInside = (r, c) => r >= 0 && r < 3 && c >= 0 && c < 3;

/**
 * Convierte un tablero (array de 9) a una clave string única
 */
export const boardToKey = (board) => {
  return board.map(p => p || '.').join('');
};

/**
 * Convierte una clave string a array de 9
 */
export const keyToBoard = (key) => {
  return key.split('').map(char => (char === '.' ? null : char));
};

/**
 * Comprueba si dos tableros tienen exactamente la misma configuración
 */
export const areBoardsEqual = (b1, b2) => {
  if (!b1 || !b2 || b1.length !== 9 || b2.length !== 9) return false;
  for (let i = 0; i < 9; i++) {
    if (b1[i] !== b2[i]) return false;
  }
  return true;
};

/**
 * Calcula todas las jugadas legales para una pieza en una casilla dada.
 * Solo se puede mover a casillas VACÍAS (board[target] === null).
 */
export const getLegalMovesForSquare = (board, index) => {
  const piece = board[index];
  if (!piece) return [];

  const { row: r, col: c } = getRowCol(index);
  const moves = [];

  const addIfEmpty = (tr, tc) => {
    if (isInside(tr, tc)) {
      const tIdx = getIndex(tr, tc);
      if (board[tIdx] === null) {
        moves.push(tIdx);
        return true; // Continúa el rayo
      }
    }
    return false; // Bloqueado o fuera de límites
  };

  // 1. REY: 1 casilla en cualquier dirección
  if (piece === 'K') {
    const kingDeltas = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    for (const [dr, dc] of kingDeltas) {
      const tr = r + dr;
      const tc = c + dc;
      if (isInside(tr, tc) && board[getIndex(tr, tc)] === null) {
        moves.push(getIndex(tr, tc));
      }
    }
  }

  // 2. CABALLO: Movimiento en L (salta piezas intermedias)
  else if (piece === 'N') {
    const knightDeltas = [
      [-2, -1], [-2, 1],
      [-1, -2], [-1, 2],
      [1, -2],  [1, 2],
      [2, -1],  [2, 1]
    ];
    for (const [dr, dc] of knightDeltas) {
      const tr = r + dr;
      const tc = c + dc;
      if (isInside(tr, tc) && board[getIndex(tr, tc)] === null) {
        moves.push(getIndex(tr, tc));
      }
    }
  }

  // 3. TORRE: Líneas rectas ortogonales (ray tracing con detección de bloqueo)
  else if (piece === 'R') {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      let tr = r + dr;
      let tc = c + dc;
      while (isInside(tr, tc)) {
        if (!addIfEmpty(tr, tc)) break;
        tr += dr;
        tc += dc;
      }
    }
  }

  // 4. ALFIL: Diagonales (ray tracing con detección de bloqueo)
  else if (piece === 'B') {
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of directions) {
      let tr = r + dr;
      let tc = c + dc;
      while (isInside(tr, tc)) {
        if (!addIfEmpty(tr, tc)) break;
        tr += dr;
        tc += dc;
      }
    }
  }

  // 5. DAMA: Ortogonales + Diagonales (ray tracing)
  else if (piece === 'Q') {
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];
    for (const [dr, dc] of directions) {
      let tr = r + dr;
      let tc = c + dc;
      while (isInside(tr, tc)) {
        if (!addIfEmpty(tr, tc)) break;
        tr += dr;
        tc += dc;
      }
    }
  }

  return moves;
};

/**
 * Obtiene todas las jugadas legales posibles desde una posición
 */
export const getAllLegalMoves = (board) => {
  const allMoves = [];
  for (let i = 0; i < 9; i++) {
    const piece = board[i];
    if (piece) {
      const dests = getLegalMovesForSquare(board, i);
      for (const dest of dests) {
        allMoves.push({
          from: i,
          to: dest,
          piece
        });
      }
    }
  }
  return allMoves;
};

/**
 * Ejecuta una jugada sobre un tablero (inmutable)
 */
export const applyMove = (board, from, to) => {
  const next = [...board];
  next[to] = next[from];
  next[from] = null;
  return next;
};

/* =========================================================================
   TRANSFORMACIONES DE TARJETAS (Nivel 2 Rotación & Nivel 3 Modo Espejo)
   ========================================================================= */

export const rotateBoard90 = (board) => {
  const next = new Array(9).fill(null);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const oldIdx = getIndex(r, c);
      const newIdx = getIndex(c, 2 - r);
      next[newIdx] = board[oldIdx];
    }
  }
  return next;
};

export const rotateBoard180 = (board) => {
  const next = new Array(9).fill(null);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const oldIdx = getIndex(r, c);
      const newIdx = getIndex(2 - r, 2 - c);
      next[newIdx] = board[oldIdx];
    }
  }
  return next;
};

export const rotateBoard270 = (board) => {
  const next = new Array(9).fill(null);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const oldIdx = getIndex(r, c);
      const newIdx = getIndex(2 - c, r);
      next[newIdx] = board[oldIdx];
    }
  }
  return next;
};

export const flipBoardHorizontal = (board) => {
  const next = new Array(9).fill(null);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const oldIdx = getIndex(r, c);
      const newIdx = getIndex(r, 2 - c);
      next[newIdx] = board[oldIdx];
    }
  }
  return next;
};

export const flipBoardVertical = (board) => {
  const next = new Array(9).fill(null);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const oldIdx = getIndex(r, c);
      const newIdx = getIndex(2 - r, c);
      next[newIdx] = board[oldIdx];
    }
  }
  return next;
};

/**
 * Obtiene todas las transformaciones disponibles para una tarjeta objetivo
 */
export const getTargetCardVariants = (targetBoard, { allowRotation = false, allowFlip = false } = {}) => {
  const variants = [
    { type: 'none', penalty: 0, label: 'Original', board: targetBoard }
  ];

  if (allowRotation) {
    variants.push(
      { type: 'rot90', penalty: 1, label: 'Giro 90° (+1)', board: rotateBoard90(targetBoard) },
      { type: 'rot180', penalty: 2, label: 'Giro 180° (+2)', board: rotateBoard180(targetBoard) },
      { type: 'rot270', penalty: 1, label: 'Giro 270° (+1)', board: rotateBoard270(targetBoard) }
    );
  }

  if (allowFlip) {
    const flippedH = flipBoardHorizontal(targetBoard);
    variants.push(
      { type: 'flipH', penalty: 1, label: 'Modo Espejo (+1)', board: flippedH }
    );

    if (allowRotation) {
      variants.push(
        { type: 'flipH_rot90', penalty: 2, label: 'Espejo + 90° (+2)', board: rotateBoard90(flippedH) },
        { type: 'flipH_rot180', penalty: 3, label: 'Espejo + 180° (+3)', board: rotateBoard180(flippedH) },
        { type: 'flipH_rot270', penalty: 2, label: 'Espejo + 270° (+2)', board: rotateBoard270(flippedH) }
      );
    }
  }

  return variants;
};

/* =========================================================================
   SOLVER BFS DE ALTO RENDIMIENTO (PAR ÓPTIMO Y PISTAS EN < 3ms)
   ========================================================================= */

/**
 * Resuelve la distancia mínima desde startBoard hasta targetBoard mediante BFS.
 * Retorna la ruta óptima, el par mínimo y la mejor pista.
 */
export const solveCubyBFS = (startBoard, targetBoard, options = {}) => {
  const { allowRotation = false, allowFlip = false } = options;
  const startKey = boardToKey(startBoard);
  const targetKey = boardToKey(targetBoard);

  if (startKey === targetKey) {
    return {
      solved: true,
      minMoves: 0,
      pieceMovesCount: 0,
      transformPenalty: 0,
      usedTransform: 'none',
      path: [],
      hint: null
    };
  }

  // Precalculamos las claves objetivo válidas (con sus penalizaciones)
  const targetVariants = getTargetCardVariants(targetBoard, { allowRotation, allowFlip });
  const targetMap = new Map();
  for (const v of targetVariants) {
    const k = boardToKey(v.board);
    // Si hay colisión de claves, nos quedamos con la de menor penalización
    if (!targetMap.has(k) || targetMap.get(k).penalty > v.penalty) {
      targetMap.set(k, v);
    }
  }

  // BFS para encontrar la distancia más corta
  const queue = [{ board: startBoard, key: startKey, depth: 0, parent: null, move: null }];
  const visited = new Map();
  visited.set(startKey, { depth: 0, parent: null, move: null });

  let bestSolution = null;

  while (queue.length > 0) {
    const current = queue.shift();

    // Comprobar si el estado actual cumple con algún objetivo
    if (targetMap.has(current.key)) {
      const targetVar = targetMap.get(current.key);
      const totalCost = current.depth + targetVar.penalty;

      if (!bestSolution || totalCost < bestSolution.totalCost) {
        // Reconstruir camino
        const path = [];
        let currNode = current;
        while (currNode.parent) {
          path.unshift({
            from: currNode.move.from,
            to: currNode.move.to,
            piece: currNode.move.piece,
            board: currNode.board
          });
          currNode = currNode.parent;
        }

        bestSolution = {
          solved: true,
          totalCost,
          minMoves: totalCost,
          pieceMovesCount: current.depth,
          transformPenalty: targetVar.penalty,
          usedTransform: targetVar.type,
          path,
          hint: path.length > 0 ? {
            from: path[0].from,
            to: path[0].to,
            piece: path[0].piece,
            pieceName: CUBY_PIECES[path[0].piece]?.name || path[0].piece,
            fromSquare: SQUARE_NAMES[path[0].from],
            toSquare: SQUARE_NAMES[path[0].to],
            description: `Mueve ${CUBY_PIECES[path[0].piece]?.name || path[0].piece} de ${SQUARE_NAMES[path[0].from].toUpperCase()} a ${SQUARE_NAMES[path[0].to].toUpperCase()}`
          } : null
        };

        // Si encontramos una solución directa sin penalización (transform = 'none'), es óptima absoluta
        if (targetVar.penalty === 0) {
          return bestSolution;
        }
      }
    }

    // Si ya superamos la profundidad de una solución conocida mejor, no expandir más allá
    if (bestSolution && current.depth >= bestSolution.totalCost) {
      continue;
    }

    // Generar sucesores
    const moves = getAllLegalMoves(current.board);
    for (const move of moves) {
      const nextBoard = applyMove(current.board, move.from, move.to);
      const nextKey = boardToKey(nextBoard);

      if (!visited.has(nextKey)) {
        visited.set(nextKey, { depth: current.depth + 1 });
        const nextNode = {
          board: nextBoard,
          key: nextKey,
          depth: current.depth + 1,
          parent: current,
          move
        };
        queue.push(nextNode);
      }
    }
  }

  if (bestSolution) return bestSolution;

  return {
    solved: false,
    minMoves: -1,
    pieceMovesCount: -1,
    transformPenalty: 0,
    usedTransform: 'none',
    path: [],
    hint: null
  };
};

/* =========================================================================
   MAZO DE CARTAS PEDAGÓGICAS GRADUADAS (PREDEFINIDAS & PROCEDURALES)
   ========================================================================= */

export const CURATED_CUBY_CARDS = [
  {
    "id": "card_01",
    "title": "Paso de Rey",
    "difficulty": "easy",
    "stars": 1,
    "target": [
      "K",
      null,
      "R",
      "N",
      "B",
      "Q",
      null,
      null,
      null
    ],
    "optimalMoves": 1,
    "description": "Llega a esta configuración en 1 movimientos óptimos."
  },
  {
    "id": "card_02",
    "title": "Salida de Dama",
    "difficulty": "easy",
    "stars": 1,
    "target": [
      "K",
      "Q",
      null,
      "N",
      "B",
      "R",
      null,
      null,
      null
    ],
    "optimalMoves": 1,
    "description": "Llega a esta configuración en 1 movimientos óptimos."
  },
  {
    "id": "card_03",
    "title": "Salto del Caballo",
    "difficulty": "easy",
    "stars": 1,
    "target": [
      null,
      "K",
      "R",
      "N",
      "B",
      "Q",
      null,
      null,
      null
    ],
    "optimalMoves": 2,
    "description": "Llega a esta configuración en 2 movimientos óptimos."
  },
  {
    "id": "card_04",
    "title": "Vuelo del Alfil",
    "difficulty": "easy",
    "stars": 1,
    "target": [
      "K",
      "R",
      null,
      "N",
      "B",
      "Q",
      null,
      null,
      null
    ],
    "optimalMoves": 2,
    "description": "Llega a esta configuración en 2 movimientos óptimos."
  },
  {
    "id": "card_05",
    "title": "Columna de la Torre",
    "difficulty": "easy",
    "stars": 1,
    "target": [
      null,
      "K",
      "R",
      null,
      "B",
      "Q",
      null,
      null,
      "N"
    ],
    "optimalMoves": 3,
    "description": "Llega a esta configuración en 3 movimientos óptimos."
  },
  {
    "id": "card_06",
    "title": "Crucigrama Staunton",
    "difficulty": "easy",
    "stars": 1,
    "target": [
      "B",
      "K",
      "R",
      "N",
      null,
      "Q",
      null,
      null,
      null
    ],
    "optimalMoves": 3,
    "description": "Llega a esta configuración en 3 movimientos óptimos."
  },
  {
    "id": "card_07",
    "title": "Despeje Central",
    "difficulty": "medium",
    "stars": 2,
    "target": [
      "B",
      "K",
      "R",
      null,
      null,
      "Q",
      null,
      null,
      "N"
    ],
    "optimalMoves": 4,
    "description": "Llega a esta configuración en 4 movimientos óptimos."
  },
  {
    "id": "card_08",
    "title": "Corona Cruzada",
    "difficulty": "medium",
    "stars": 2,
    "target": [
      null,
      "K",
      "R",
      null,
      null,
      "Q",
      "B",
      null,
      "N"
    ],
    "optimalMoves": 4,
    "description": "Llega a esta configuración en 4 movimientos óptimos."
  },
  {
    "id": "card_09",
    "title": "Maniobra Flanqueada",
    "difficulty": "medium",
    "stars": 2,
    "target": [
      "B",
      null,
      "R",
      null,
      "K",
      "Q",
      null,
      null,
      "N"
    ],
    "optimalMoves": 5,
    "description": "Llega a esta configuración en 5 movimientos óptimos."
  },
  {
    "id": "card_10",
    "title": "Ataque en L",
    "difficulty": "medium",
    "stars": 2,
    "target": [
      "B",
      "K",
      "R",
      null,
      "Q",
      null,
      null,
      null,
      "N"
    ],
    "optimalMoves": 5,
    "description": "Llega a esta configuración en 5 movimientos óptimos."
  },
  {
    "id": "card_11",
    "title": "Laberinto de Damas",
    "difficulty": "medium",
    "stars": 2,
    "target": [
      "B",
      "R",
      null,
      null,
      "K",
      "Q",
      null,
      null,
      "N"
    ],
    "optimalMoves": 6,
    "description": "Llega a esta configuración en 6 movimientos óptimos."
  },
  {
    "id": "card_12",
    "title": "Coordinación Total",
    "difficulty": "medium",
    "stars": 2,
    "target": [
      "B",
      "N",
      "R",
      null,
      "K",
      "Q",
      null,
      null,
      null
    ],
    "optimalMoves": 6,
    "description": "Llega a esta configuración en 6 movimientos óptimos."
  },
  {
    "id": "card_13",
    "title": "Espiral de Caballos",
    "difficulty": "hard",
    "stars": 3,
    "target": [
      "B",
      "R",
      "K",
      null,
      null,
      "Q",
      null,
      null,
      "N"
    ],
    "optimalMoves": 7,
    "description": "Llega a esta configuración en 7 movimientos óptimos."
  },
  {
    "id": "card_14",
    "title": "El Trono Desplazado",
    "difficulty": "hard",
    "stars": 3,
    "target": [
      "B",
      "R",
      "Q",
      null,
      "K",
      null,
      null,
      null,
      "N"
    ],
    "optimalMoves": 7,
    "description": "Llega a esta configuración en 7 movimientos óptimos."
  },
  {
    "id": "card_15",
    "title": "Torbellino Posicional",
    "difficulty": "hard",
    "stars": 3,
    "target": [
      "B",
      null,
      "K",
      null,
      "R",
      "Q",
      null,
      null,
      "N"
    ],
    "optimalMoves": 8,
    "description": "Llega a esta configuración en 8 movimientos óptimos."
  },
  {
    "id": "card_16",
    "title": "Gran Diagonal Cerrada",
    "difficulty": "hard",
    "stars": 3,
    "target": [
      "B",
      "R",
      "K",
      null,
      "Q",
      null,
      null,
      null,
      "N"
    ],
    "optimalMoves": 8,
    "description": "Llega a esta configuración en 8 movimientos óptimos."
  },
  {
    "id": "card_17",
    "title": "Vórtice Táctico",
    "difficulty": "hard",
    "stars": 3,
    "target": [
      "B",
      "N",
      "K",
      null,
      "R",
      "Q",
      null,
      null,
      null
    ],
    "optimalMoves": 9,
    "description": "Llega a esta configuración en 9 movimientos óptimos."
  },
  {
    "id": "card_18",
    "title": "Cálculo de 9 Tiempos",
    "difficulty": "hard",
    "stars": 3,
    "target": [
      "B",
      "R",
      "K",
      null,
      null,
      "Q",
      "N",
      null,
      null
    ],
    "optimalMoves": 9,
    "description": "Llega a esta configuración en 9 movimientos óptimos."
  },
  {
    "id": "card_19",
    "title": "El Enigma de los Reyes",
    "difficulty": "master",
    "stars": 4,
    "target": [
      "B",
      null,
      "K",
      null,
      "R",
      "Q",
      "N",
      null,
      null
    ],
    "optimalMoves": 10,
    "description": "Llega a esta configuración en 10 movimientos óptimos."
  },
  {
    "id": "card_20",
    "title": "Maestría Suprema 3x3",
    "difficulty": "master",
    "stars": 4,
    "target": [
      "B",
      "N",
      "K",
      null,
      "R",
      null,
      null,
      null,
      "Q"
    ],
    "optimalMoves": 10,
    "description": "Llega a esta configuración en 10 movimientos óptimos."
  },
  {
    "id": "card_21",
    "title": "El Desafío Definitivo",
    "difficulty": "master",
    "stars": 4,
    "target": [
      "B",
      "R",
      "K",
      null,
      null,
      "N",
      null,
      null,
      "Q"
    ],
    "optimalMoves": 11,
    "description": "Llega a esta configuración en 11 movimientos óptimos."
  },
  {
    "id": "card_22",
    "title": "Inmortal de Cuby",
    "difficulty": "master",
    "stars": 4,
    "target": [
      "B",
      "R",
      "K",
      null,
      "Q",
      "N",
      null,
      null,
      null
    ],
    "optimalMoves": 11,
    "description": "Llega a esta configuración en 11 movimientos óptimos."
  }
];

/**
 * Posición inicial clásica recomendada para iniciar un mazo
 */
export const DEFAULT_START_BOARD = [
  'K', 'Q', 'R',
  'N', 'B', null,
  null, null, null
];

/**
 * Genera una tarjeta de objetivo aleatoria que esté a una distancia resoluble
 * deseada desde el tablero actual.
 */
export const generateProceduralCard = (currentBoard, desiredDifficulty = 'medium') => {
  const minMovesMap = {
    easy: 2,
    medium: 4,
    hard: 7,
    master: 9
  };
  const maxMovesMap = {
    easy: 3,
    medium: 6,
    hard: 8,
    master: 12
  };

  const targetMin = minMovesMap[desiredDifficulty] || 4;
  const targetMax = maxMovesMap[desiredDifficulty] || 6;

  // Realizamos una caminata aleatoria de BFS inverso para garantizar resolubilidad
  let simBoard = [...currentBoard];
  const steps = targetMax + Math.floor(Math.random() * 4);

  for (let s = 0; s < steps; s++) {
    const legalMoves = getAllLegalMoves(simBoard);
    if (legalMoves.length === 0) break;
    const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    simBoard = applyMove(simBoard, randomMove.from, randomMove.to);
  }

  // Verificamos con BFS la distancia exacta óptima
  const solveResult = solveCubyBFS(currentBoard, simBoard);
  if (solveResult.solved && solveResult.minMoves >= targetMin) {
    return {
      id: `proc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `Reto ${desiredDifficulty === 'easy' ? 'Iniciación' : desiredDifficulty === 'medium' ? 'Intermedio' : 'Maestro'}`,
      difficulty: desiredDifficulty,
      stars: desiredDifficulty === 'easy' ? 1 : desiredDifficulty === 'medium' ? 2 : 3,
      target: simBoard,
      optimalMoves: solveResult.minMoves,
      description: `Llega a la configuración de la tarjeta en ${solveResult.minMoves} movimientos óptimos.`
    };
  }

  // Si no cayó en rango exacto, seleccionamos del mazo predefinido
  const matchingCards = CURATED_CUBY_CARDS.filter(c => c.difficulty === desiredDifficulty);
  return matchingCards[Math.floor(Math.random() * matchingCards.length)] || CURATED_CUBY_CARDS[0];
};
