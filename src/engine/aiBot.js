import { Chess } from 'chess.js';
import { isKinglessFen, getBestKinglessBotMove } from './kinglessEngine';

/**
 * Motor de IA para el oponente con dificultad graduable (Nivel 1 a 5)
 * Combina Minimax con poda Alfa-Beta, tablas de valor posicional (PST) y heurística de finales (Mating Nets).
 */

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Tablas de valor posicional (PST) para alentar el control central y desarrollo
const PAWN_PST = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_PST = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_PST = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

/**
 * Evaluación estática de la posición del tablero
 */
export const evaluateBoard = (chess) => {
  if (chess.isCheckmate()) {
    // Si es jaque mate, el bando que tiene el turno ha perdido
    return chess.turn() === 'w' ? -100000 : 100000;
  }

  if (chess.isDraw()) {
    return 0;
  }

  let totalEvaluation = 0;
  let whiteMaterial = 0;
  let blackMaterial = 0;
  let whiteKingPos = null;
  let blackKingPos = null;

  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        let pst = 0;

        if (piece.type === 'p') {
          pst = piece.color === 'w' ? PAWN_PST[r][c] : PAWN_PST[7 - r][c];
        } else if (piece.type === 'n') {
          pst = piece.color === 'w' ? KNIGHT_PST[r][c] : KNIGHT_PST[7 - r][c];
        } else if (piece.type === 'b') {
          pst = piece.color === 'w' ? BISHOP_PST[r][c] : BISHOP_PST[7 - r][c];
        }

        if (piece.type === 'k') {
          if (piece.color === 'w') whiteKingPos = { r, c };
          else blackKingPos = { r, c };
        } else {
          if (piece.color === 'w') whiteMaterial += val;
          else blackMaterial += val;
        }

        const score = val + pst;
        totalEvaluation += piece.color === 'w' ? score : -score;
      }
    }
  }

  // --- HEURÍSTICA DE FINALES (Mating Nets & King Drive) ---
  // Cuando un bando tiene clara ventaja de material (o el rival solo tiene el rey),
  // se incentiva acorralar al rey enemigo hacia los bordes y acercar al propio rey.
  if (whiteKingPos && blackKingPos) {
    const isWhiteWinningEndgame = whiteMaterial > blackMaterial + 200;
    const isBlackWinningEndgame = blackMaterial > whiteMaterial + 200;

    if (isWhiteWinningEndgame) {
      // Empujar rey negro al borde (distancia al centro 3.5, 3.5)
      const blackDistCenter = Math.max(Math.abs(blackKingPos.r - 3.5), Math.abs(blackKingPos.c - 3.5));
      // Acercar rey blanco al rey negro
      const kingDist = Math.max(Math.abs(whiteKingPos.r - blackKingPos.r), Math.abs(whiteKingPos.c - blackKingPos.c));
      
      totalEvaluation += blackDistCenter * 40;
      totalEvaluation += (7 - kingDist) * 30;
      if (chess.isCheck() && chess.turn() === 'b') totalEvaluation += 50;
    } else if (isBlackWinningEndgame) {
      // Empujar rey blanco al borde
      const whiteDistCenter = Math.max(Math.abs(whiteKingPos.r - 3.5), Math.abs(whiteKingPos.c - 3.5));
      // Acercar rey negro al rey blanco
      const kingDist = Math.max(Math.abs(whiteKingPos.r - blackKingPos.r), Math.abs(whiteKingPos.c - blackKingPos.c));

      totalEvaluation -= whiteDistCenter * 40;
      totalEvaluation -= (7 - kingDist) * 30;
      if (chess.isCheck() && chess.turn() === 'w') totalEvaluation -= 50;
    }
  }

  return totalEvaluation;
};

const minimax = (chess, depth, alpha, beta, isMaximizing) => {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = chess.moves({ verbose: true });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

/**
 * Selecciona la mejor jugada para el bot según su nivel y variante
 */
export const getBestBotMove = (fen, level = 1, allowedPiece = null, variant = 'standard') => {
  if (isKinglessFen(fen)) {
    return getBestKinglessBotMove(fen, level);
  }

  const chess = new Chess(fen);
  let moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Filtrado por pieza permitida en Dados Mágicos (si no es comodín 'k')
  if (allowedPiece && allowedPiece !== 'k') {
    const pieceMoves = moves.filter(m => m.piece === allowedPiece);
    if (pieceMoves.length > 0) {
      moves = pieceMoves;
    } else {
      return null; // Sin jugadas legales para esta tirada
    }
  }

  // REGLA REY DE LA COLINA: Si el bot puede colocar su Rey en d4, d5, e4 o e5, lo hace para ganar al instante
  if (variant === 'king_of_the_hill') {
    const hillSquares = ['d4', 'd5', 'e4', 'e5'];
    const winningHillMove = moves.find(m => m.piece === 'k' && hillSquares.includes(m.to));
    if (winningHillMove) {
      return winningHillMove;
    }
  }

  const isWhite = chess.turn() === 'w';

  // 1. REGLA UNIVERSAL: Si hay un Jaque Mate en 1 jugada, realizarlo SIEMPRE (en todos los niveles)
  for (const move of moves) {
    chess.move(move);
    const givesMate = chess.isCheckmate();
    chess.undo();
    if (givesMate) {
      return move;
    }
  }

  // 2. REGLA UNIVERSAL: Si hay una coronación de peón a Dama, realizarla con altísima prioridad
  const promotions = moves.filter(m => m.promotion === 'q');
  if (promotions.length > 0 && Math.random() < 0.9) {
    return promotions[0];
  }

  // Nivel 1: ~400 Elo (Juego principiante pero con sentido en finales)
  if (level === 1) {
    // Si el rival solo tiene el rey o estamos en final, jugar con lógica para acorralar en lugar de pasear la torre
    let bestMove = null;
    let bestScore = isWhite ? -Infinity : Infinity;

    for (const move of moves) {
      chess.move(move);
      // Evitar ahogado accidental si estamos ganando
      if (chess.isDraw() && !chess.isCheckmate()) {
        chess.undo();
        continue;
      }
      const score = evaluateBoard(chess);
      chess.undo();

      if (isWhite ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    // Un 50% de las veces en nivel 1 elige la jugada más sensata (para cerrar la partida)
    if (bestMove && Math.random() < 0.6) {
      return bestMove;
    }

    const captures = moves.filter(m => m.captured);
    if (captures.length > 0 && Math.random() < 0.4) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return bestMove || moves[Math.floor(Math.random() * moves.length)];
  }

  // Nivel 2: ~800 Elo (Evaluación 1-ply con evitación de ahogados)
  if (level === 2) {
    let bestMove = moves[0];
    let bestScore = isWhite ? -Infinity : Infinity;

    for (const move of moves) {
      chess.move(move);
      // Evitar tablas por ahogado si se tiene ventaja
      if (chess.isDraw() && !chess.isCheckmate()) {
        chess.undo();
        continue;
      }
      const score = evaluateBoard(chess);
      chess.undo();

      if (isWhite ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // Nivel 3: ~1200 Elo (Minimax Profundidad 2)
  if (level === 3) {
    let bestMove = moves[0];
    let bestScore = isWhite ? -Infinity : Infinity;

    for (const move of moves) {
      chess.move(move);
      if (chess.isDraw() && !chess.isCheckmate()) {
        chess.undo();
        continue;
      }
      const score = minimax(chess, 2, -Infinity, Infinity, !isWhite);
      chess.undo();

      if (isWhite ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // Nivel 4 y 5: ~1600 y 2000+ Elo (Minimax Profundidad 3 o 4)
  const depth = level >= 5 ? 4 : 3;
  let bestMove = moves[0];
  let bestScore = isWhite ? -Infinity : Infinity;

  for (const move of moves) {
    chess.move(move);
    if (chess.isDraw() && !chess.isCheckmate()) {
      chess.undo();
      continue;
    }
    const score = minimax(chess, depth - 1, -Infinity, Infinity, !isWhite);
    chess.undo();

    if (isWhite ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

