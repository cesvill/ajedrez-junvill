/**
 * Libro de Aperturas Inteligente de Ajedrez Junvill
 * Proporciona un repertorio rico, variado y pedagógico con personalidades por bot.
 */

// Biblioteca de aperturas indexada por FEN normalizado (solo tablero + turno + enroque)
export const OPENING_BOOK = {
  // Posición inicial (Turno Blancas)
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq': [
    { from: 'e2', to: 'e4', weight: 45, name: 'Apertura de Peón de Rey (1. e4)' },
    { from: 'd2', to: 'd4', weight: 35, name: 'Apertura de Peón de Dama (1. d4)' },
    { from: 'c2', to: 'c4', weight: 12, name: 'Apertura Inglesa (1. c4)' },
    { from: 'g1', to: 'f3', weight: 8,  name: 'Apertura Réti / Zukertort (1. Nf3)' }
  ],

  // --- RESPUESTAS DE NEGRAS A 1. e4 ---
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq': [
    { from: 'e7', to: 'e5', weight: 40, name: 'Juego Abierto Clásico (1... e5)' },
    { from: 'c7', to: 'c5', weight: 30, name: 'Defensa Siciliana (1... c5)' },
    { from: 'e7', to: 'e6', weight: 14, name: 'Defensa Francesa (1... e6)' },
    { from: 'c7', to: 'c6', weight: 10, name: 'Defensa Caro-Kann (1... c6)' },
    { from: 'd7', to: 'd5', weight: 4,  name: 'Defensa Escandinava (1... d5)' },
    { from: 'g8', to: 'f6', weight: 2,  name: 'Defensa Alekhine (1... Nf6)' }
  ],

  // --- RESPUESTAS DE NEGRAS A 1. d4 ---
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq': [
    { from: 'd7', to: 'd5', weight: 45, name: 'Juego Cerrado Clásico (1... d5)' },
    { from: 'g8', to: 'f6', weight: 40, name: 'Defensa India / Nimzoindia (1... Nf6)' },
    { from: 'e7', to: 'e6', weight: 10, name: 'Defensa Francesa / Gambito Dama (1... e6)' },
    { from: 'f7', to: 'f5', weight: 5,  name: 'Defensa Holandesa (1... f5)' }
  ],

  // --- RESPUESTAS DE NEGRAS A 1. c4 ---
  'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq': [
    { from: 'e7', to: 'e5', weight: 45, name: 'Inglesa Simétrica Inversa (1... e5)' },
    { from: 'c7', to: 'c5', weight: 30, name: 'Inglesa Simétrica (1... c5)' },
    { from: 'g8', to: 'f6', weight: 25, name: 'Defensa Flexible (1... Nf6)' }
  ],

  // --- CONTINUACIONES TRAS 1. e4 e5 (Blancas) ---
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq': [
    { from: 'g1', to: 'f3', weight: 70, name: 'Caballo de Rey (2. Nf3)' },
    { from: 'f1', to: 'c4', weight: 12, name: 'Apertura de Alfil (2. Bc4)' },
    { from: 'b1', to: 'c3', weight: 10, name: 'Apertura Vienesa (2. Nc3)' },
    { from: 'f2', to: 'f4', weight: 8,  name: 'Gambito de Rey (2. f4)' }
  ],

  // --- 1. e4 e5 2. Nf3 (Negras) ---
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq': [
    { from: 'b8', to: 'c6', weight: 75, name: 'Defensa Principal (2... Nc6)' },
    { from: 'g8', to: 'f6', weight: 18, name: 'Defensa Petrov / Rusa (2... Nf6)' },
    { from: 'd7', to: 'd6', weight: 7,  name: 'Defensa Philidor (2... d6)' }
  ],

  // --- 1. e4 e5 2. Nf3 Nc6 (Blancas) ---
  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq': [
    { from: 'f1', to: 'c4', weight: 45, name: 'Apertura Italiana (3. Bc4)' },
    { from: 'f1', to: 'b5', weight: 35, name: 'Apertura Española / Ruy López (3. Bb5)' },
    { from: 'd2', to: 'd4', weight: 12, name: 'Apertura Escocesa (3. d4)' },
    { from: 'b1', to: 'c3', weight: 8,  name: 'Apertura Cuatro Caballos (3. Nc3)' }
  ],

  // --- 1. e4 e5 2. Nf3 Nc6 3. Bc4 (Italiana - Negras) ---
  'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq': [
    { from: 'f1', to: 'c5', weight: 55, name: 'Giuoco Piano (3... Bc5)' },
    { from: 'g8', to: 'f6', weight: 45, name: 'Defensa Dos Caballos (3... Nf6)' }
  ],

  // --- 1. e4 c5 (Siciliana - Blancas) ---
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq': [
    { from: 'g1', to: 'f3', weight: 75, name: 'Siciliana Abierta (2. Nf3)' },
    { from: 'c2', to: 'c3', weight: 15, name: 'Siciliana Alapin (2. c3)' },
    { from: 'b1', to: 'c3', weight: 10, name: 'Siciliana Cerrada (2. Nc3)' }
  ],

  // --- 1. d4 d5 (Blancas) ---
  'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq': [
    { from: 'c2', to: 'c4', weight: 65, name: 'Gambito de Dama (2. c4)' },
    { from: 'g1', to: 'f3', weight: 20, name: 'Apertura de Peón de Dama (2. Nf3)' },
    { from: 'c1', to: 'f4', weight: 15, name: 'Sistema Londres (2. Bf4)' }
  ],

  // --- 1. d4 d5 2. c4 (Gambito de Dama - Negras) ---
  'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq': [
    { from: 'e7', to: 'e6', weight: 50, name: 'Gambito de Dama Declinado (2... e6)' },
    { from: 'c7', to: 'c6', weight: 35, name: 'Defensa Eslava (2... c6)' },
    { from: 'd5', to: 'c4', weight: 15, name: 'Gambito de Dama Aceptado (2... dxc4)' }
  ],

  // --- 1. d4 Nf6 (Blancas) ---
  'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq': [
    { from: 'c2', to: 'c4', weight: 70, name: 'Gambito de Dama / India (2. c4)' },
    { from: 'g1', to: 'f3', weight: 20, name: 'Desarrollo de Caballo (2. Nf3)' },
    { from: 'c1', to: 'g5', weight: 10, name: 'Ataque Trompowsky (2. Bg5)' }
  ]
};

// Preferencias de apertura según la personalidad de cada bot
export const BOT_OPENING_PREFERENCES = {
  // Sparky: Agresivo, le encanta e4, Italiana y Siciliana
  spark: {
    preferredWhiteFirstMoves: ['e2e4'],
    preferredBlackVsE4: ['c7c5', 'e7e5'],
    preferredItalianLine: 'c4'
  },
  // Titán Mecánico: Sólido, prefiere d4, Gambito de Dama, Londres y Eslava
  titan: {
    preferredWhiteFirstMoves: ['d2d4'],
    preferredBlackVsE4: ['c7c6', 'e7e6'],
    preferredBlackVsD4: ['c7c6', 'd7d5']
  },
  // Qwerty: Aprendiz equilibrado y clásico (e4 o d4 estándar)
  qwerty: {
    preferredWhiteFirstMoves: ['e2e4', 'd2d4'],
    preferredBlackVsE4: ['e7e5'],
    preferredBlackVsD4: ['d7d5']
  },
  // Quantum Core / Grandes Maestros: Repertorio variado de élite
  quantum: {
    preferredWhiteFirstMoves: ['e2e4', 'd2d4', 'c2c4', 'g1f3'],
    preferredBlackVsE4: ['c7c5', 'e7e5', 'e7e6', 'c7c6'],
    preferredBlackVsD4: ['g8f6', 'd7d5']
  },
  // Mono Travieso: Variaciones tácticas
  monkey: {
    preferredWhiteFirstMoves: ['e2e4', 'g1f3'],
    preferredBlackVsE4: ['e7e5', 'd7d5']
  },
  // Tiburón Táctico: Ataques y gambitos
  shark: {
    preferredWhiteFirstMoves: ['e2e4', 'd2d4'],
    preferredBlackVsE4: ['c7c5', 'e7e5']
  }
};

/**
 * Normaliza un FEN para buscar en el libro de aperturas (ignora contadores de jugadas)
 */
export const getNormalizedFenKey = (fen) => {
  const parts = (fen || '').split(' ');
  if (parts.length < 4) return fen;
  return `${parts[0]} ${parts[1]} ${parts[2]}`;
};

/**
 * Consulta si existe una jugada de libro para la posición actual
 */
export const getBookMove = (fen, botId = null) => {
  const key = getNormalizedFenKey(fen);
  const candidateMoves = OPENING_BOOK[key];
  if (!candidateMoves || candidateMoves.length === 0) return null;

  // Si el bot tiene preferencias específicas
  const botPrefs = botId ? BOT_OPENING_PREFERENCES[botId] : null;

  let movesWithAdjustedWeights = candidateMoves.map(m => {
    let weight = m.weight;
    const moveKey = `${m.from}${m.to}`;

    if (botPrefs) {
      if (botPrefs.preferredWhiteFirstMoves && botPrefs.preferredWhiteFirstMoves.includes(moveKey)) {
        weight *= 2.5;
      }
      if (botPrefs.preferredBlackVsE4 && botPrefs.preferredBlackVsE4.includes(moveKey)) {
        weight *= 2.5;
      }
      if (botPrefs.preferredBlackVsD4 && botPrefs.preferredBlackVsD4.includes(moveKey)) {
        weight *= 2.5;
      }
    }

    return { ...m, adjustedWeight: weight };
  });

  const totalWeight = movesWithAdjustedWeights.reduce((sum, m) => sum + m.adjustedWeight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const move of movesWithAdjustedWeights) {
    randomVal -= move.adjustedWeight;
    if (randomVal <= 0) {
      return { from: move.from, to: move.to, name: move.name };
    }
  }

  return candidateMoves[0];
};
