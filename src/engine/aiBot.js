import { Chess } from 'chess.js';
import { isKinglessFen, getBestKinglessBotMove } from './kinglessEngine.js';
import { getBookMove } from './openingBook.js';

/**
 * Motor de IA para el oponente con dificultad graduable (Nivel 1 a 5)
 * Combina Libro de Aperturas por Personalidad, Minimax con poda Alfa-Beta, 
 * tablas de valor posicional (PST) y heurística de finales (Mating Nets).
 */

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Tablas de valor posicional (PST) para alentar el control central, avance de peones y desarrollo armónico
const PAWN_PST = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [15, 15, 25, 35, 35, 25, 15, 15],
  [10, 10, 20, 35, 35, 20, 10, 10],
  [5,   5, 15, 30, 30, 15,  5,  5],
  [5,  -5,-10, 10, 10,-10, -5,  5],
  [5,  10, 10,-15,-15, 10, 10,  5],
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
  if (whiteKingPos && blackKingPos) {
    const isWhiteWinningEndgame = whiteMaterial > blackMaterial + 200;
    const isBlackWinningEndgame = blackMaterial > whiteMaterial + 200;

    if (isWhiteWinningEndgame) {
      const blackDistCenter = Math.max(Math.abs(blackKingPos.r - 3.5), Math.abs(blackKingPos.c - 3.5));
      const kingDist = Math.max(Math.abs(whiteKingPos.r - blackKingPos.r), Math.abs(whiteKingPos.c - blackKingPos.c));
      
      totalEvaluation += blackDistCenter * 40;
      totalEvaluation += (7 - kingDist) * 30;
      if (chess.isCheck() && chess.turn() === 'b') totalEvaluation += 50;
    } else if (isBlackWinningEndgame) {
      const whiteDistCenter = Math.max(Math.abs(whiteKingPos.r - 3.5), Math.abs(whiteKingPos.c - 3.5));
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
 * Selecciona la mejor jugada para el bot según su nivel, variante y personalidad
 */
export const getBestBotMove = (fen, level = 1, allowedPiece = null, variant = 'standard', botId = null) => {
  if (isKinglessFen(fen)) {
    return getBestKinglessBotMove(fen, level);
  }

  const chess = new Chess(fen);
  let moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  // 1. CONSULTA DE LIBRO DE APERTURAS (Para variantes estándar sin restricciones de dados)
  if (variant === 'standard' && !allowedPiece) {
    const bookMove = getBookMove(fen, botId);
    if (bookMove) {
      const matchedMove = moves.find(m => m.from === bookMove.from && m.to === bookMove.to);
      if (matchedMove) {
        return matchedMove;
      }
    }
  }

  // Filtrado por pieza permitida en Dados Mágicos (si no es comodín 'k')
  if (allowedPiece && allowedPiece !== 'k') {
    const pieceMoves = moves.filter(m => m.piece === allowedPiece);
    if (pieceMoves.length > 0) {
      moves = pieceMoves;
    } else {
      return null;
    }
  }

  // REGLA REY DE LA COLINA
  if (variant === 'king_of_the_hill') {
    const hillSquares = ['d4', 'd5', 'e4', 'e5'];
    const winningHillMove = moves.find(m => m.piece === 'k' && hillSquares.includes(m.to));
    if (winningHillMove) {
      return winningHillMove;
    }
  }

  const isWhite = chess.turn() === 'w';

  // 2. REGLA UNIVERSAL: Si hay Jaque Mate en 1 jugada, realizarlo SIEMPRE
  for (const move of moves) {
    chess.move(move);
    const givesMate = chess.isCheckmate();
    chess.undo();
    if (givesMate) {
      return move;
    }
  }

  // 3. REGLA UNIVERSAL: Coronación de peón a Dama
  const promotions = moves.filter(m => m.promotion === 'q');
  if (promotions.length > 0 && Math.random() < 0.92) {
    return promotions[0];
  }

  // Nivel 1: ~400 Elo (Juego principiante con variedad y control en finales)
  if (level === 1) {
    const evaluatedMoves = [];

    for (const move of moves) {
      chess.move(move);
      if (chess.isDraw() && !chess.isCheckmate()) {
        chess.undo();
        continue;
      }
      const score = evaluateBoard(chess);
      chess.undo();
      evaluatedMoves.push({ move, score });
    }

    evaluatedMoves.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);

    // En 50% de los casos juega una de las mejores 3 jugadas
    if (evaluatedMoves.length > 0 && Math.random() < 0.55) {
      const topPool = evaluatedMoves.slice(0, Math.min(3, evaluatedMoves.length));
      return topPool[Math.floor(Math.random() * topPool.length)].move;
    }

    const captures = moves.filter(m => m.captured);
    if (captures.length > 0 && Math.random() < 0.4) {
      return captures[Math.floor(Math.random() * captures.length)];
    }

    return evaluatedMoves[0]?.move || moves[Math.floor(Math.random() * moves.length)];
  }

  // Nivel 2: ~800 Elo (Evaluación 1-ply con selección equilibrada entre las mejores opciones)
  if (level === 2) {
    const evaluatedMoves = [];

    for (const move of moves) {
      chess.move(move);
      if (chess.isDraw() && !chess.isCheckmate()) {
        chess.undo();
        continue;
      }
      const score = evaluateBoard(chess);
      chess.undo();
      evaluatedMoves.push({ move, score });
    }

    evaluatedMoves.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);

    if (evaluatedMoves.length > 0) {
      const bestScore = evaluatedMoves[0].score;
      // Seleccionar entre jugadas que estén a menos de 20 centipeones de la mejor
      const closeCandidates = evaluatedMoves.filter(m => Math.abs(m.score - bestScore) <= 20);
      return closeCandidates[Math.floor(Math.random() * closeCandidates.length)].move;
    }
    return moves[0];
  }

  // Nivel 3: ~1200 Elo (Minimax Profundidad 2 con variedad táctica)
  if (level === 3) {
    const evaluatedMoves = [];

    for (const move of moves) {
      chess.move(move);
      if (chess.isDraw() && !chess.isCheckmate()) {
        chess.undo();
        continue;
      }
      const score = minimax(chess, 2, -Infinity, Infinity, !isWhite);
      chess.undo();
      evaluatedMoves.push({ move, score });
    }

    evaluatedMoves.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);

    if (evaluatedMoves.length > 0) {
      const bestScore = evaluatedMoves[0].score;
      const closeCandidates = evaluatedMoves.filter(m => Math.abs(m.score - bestScore) <= 15);
      return closeCandidates[Math.floor(Math.random() * closeCandidates.length)].move;
    }
    return moves[0];
  }

  // Nivel 4 y 5: ~1600 y 2000+ Elo (Minimax Profundidad 3 o 4 con alta precisión)
  const depth = level >= 5 ? 4 : 3;
  const evaluatedMoves = [];

  for (const move of moves) {
    chess.move(move);
    if (chess.isDraw() && !chess.isCheckmate()) {
      chess.undo();
      continue;
    }
    const score = minimax(chess, depth - 1, -Infinity, Infinity, !isWhite);
    chess.undo();
    evaluatedMoves.push({ move, score });
  }

  evaluatedMoves.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);

  if (evaluatedMoves.length > 0) {
    const bestScore = evaluatedMoves[0].score;
    // En niveles altos, solo varía entre jugadas virtualmente idénticas en evaluación
    const closeCandidates = evaluatedMoves.filter(m => Math.abs(m.score - bestScore) <= 8);
    return closeCandidates[Math.floor(Math.random() * closeCandidates.length)].move;
  }

  return moves[0];
};
