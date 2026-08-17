import { Chess } from 'chess.js';
import { getBestBotMove } from './aiBot';

/**
 * Motor de Análisis Post-Partida (Game Review Engine) de Ajedrez Junvill
 * Calcula la evaluación numérica turno a turno, la precisión (CAPS) y clasifica cada jugada.
 */

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Evalúa una posición estática desde la perspectiva de las Blancas (en centipeones)
export const evaluateFenNumerical = (fen) => {
  const chess = new Chess(fen);
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -10000 : 10000;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        // Bonificación por control de casillas centrales (d4, e4, d5, e5)
        let centerBonus = 0;
        if ((r === 3 || r === 4) && (c === 3 || c === 4)) {
          centerBonus = 25;
        } else if (r >= 2 && r <= 5 && c >= 2 && c <= 5) {
          centerBonus = 10;
        }

        if (piece.color === 'w') {
          score += (val + centerBonus);
        } else {
          score -= (val + centerBonus);
        }
      }
    }
  }

  // Bonificación por seguridad de rey (enroque)
  if (fen.includes('KQ') || fen.includes('K') || fen.includes('Q')) {
    score += 15;
  }
  if (fen.includes('kq') || fen.includes('k') || fen.includes('q')) {
    score -= 15;
  }

  return score;
};

// Convierte centipeones a porcentaje de victoria (0% a 100%)
const scoreToWinProb = (scoreCp) => {
  return 50 + 50 * (2 / (1 + Math.exp(-0.0035 * scoreCp)) - 1);
};

/**
 * Analiza una partida completa jugada a jugada
 */
export const analyzeFullGame = (fenHistory, moveHistory) => {
  if (!fenHistory || fenHistory.length < 2 || !moveHistory || moveHistory.length === 0) {
    return null;
  }

  const evaluations = [];
  const classifiedMoves = [];

  let whiteAccuracySum = 0;
  let whiteMoveCount = 0;
  let blackAccuracySum = 0;
  let blackMoveCount = 0;

  const whiteCounts = { brilliant: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 };
  const blackCounts = { brilliant: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 };
  const keyMistakes = [];

  // 1. Evaluación inicial
  const initEval = evaluateFenNumerical(fenHistory[0]);
  evaluations.push({ moveIndex: 0, evalCp: initEval, evalFormatted: (initEval / 100).toFixed(1) });

  // 2. Evaluar cada movimiento
  for (let i = 0; i < moveHistory.length; i++) {
    const prevFen = fenHistory[i];
    const currFen = fenHistory[i + 1];
    const move = moveHistory[i];
    const isWhite = (i % 2 === 0);

    const prevScore = evaluateFenNumerical(prevFen);
    const currScore = evaluateFenNumerical(currFen);
    evaluations.push({ moveIndex: i + 1, evalCp: currScore, evalFormatted: (currScore / 100).toFixed(1) });

    // Determinar la mejor jugada teórica en prevFen
    const bestMove = getBestBotMove(prevFen, 3);
    let bestFen = currFen;
    if (bestMove) {
      const tempGame = new Chess(prevFen);
      tempGame.move(bestMove);
      bestFen = tempGame.fen();
    }
    const bestScore = evaluateFenNumerical(bestFen);

    // Calcular la pérdida de evaluación
    const scoreDiff = isWhite ? (bestScore - currScore) : (currScore - bestScore);
    const winProbBefore = isWhite ? scoreToWinProb(prevScore) : (100 - scoreToWinProb(prevScore));
    const winProbAfter = isWhite ? scoreToWinProb(currScore) : (100 - scoreToWinProb(currScore));
    const winProbDiff = Math.max(0, winProbBefore - winProbAfter);

    // Precisión de esta jugada
    const moveAccuracy = Math.max(0, 100 - (winProbDiff * 2.8));

    if (isWhite) {
      whiteAccuracySum += moveAccuracy;
      whiteMoveCount++;
    } else {
      blackAccuracySum += moveAccuracy;
      blackMoveCount++;
    }

    // Clasificación
    let classification = 'good';
    let label = 'Buena';
    let badge = '⚪';
    let explanation = `Jugada sólida de desarrollo (${move.san}).`;

    const isSacrifice = move.captured && PIECE_VALUES[move.captured] < PIECE_VALUES[move.piece];

    if (scoreDiff <= 15) {
      if (isSacrifice && currScore > prevScore) {
        classification = 'brilliant';
        label = 'Brillante';
        badge = '🌟';
        explanation = `¡Jugada brillante! Sacrificio estratégico con ventaja decisiva.`;
        if (isWhite) whiteCounts.brilliant++; else blackCounts.brilliant++;
      } else {
        classification = 'best';
        label = 'Mejor Jugada';
        badge = '🟢';
        explanation = `La mejor jugada del motor. Maximiza la actividad y la posición.`;
        if (isWhite) whiteCounts.best++; else blackCounts.best++;
      }
    } else if (scoreDiff <= 45) {
      classification = 'excellent';
      label = 'Excelente';
      badge = '🔵';
      explanation = `Movimiento muy fuerte que mantiene la ventaja.`;
      if (isWhite) whiteCounts.excellent++; else blackCounts.excellent++;
    } else if (scoreDiff <= 95) {
      classification = 'good';
      label = 'Buena';
      badge = '⚪';
      explanation = `Jugada razonable dentro del plan de la posición.`;
      if (isWhite) whiteCounts.good++; else blackCounts.good++;
    } else if (scoreDiff <= 220) {
      classification = 'inaccuracy';
      label = 'Imprecisión';
      badge = '🟡';
      explanation = `Imprecisión: cede parte de la iniciativa al rival.`;
      if (isWhite) whiteCounts.inaccuracy++; else blackCounts.inaccuracy++;
    } else if (scoreDiff <= 480) {
      classification = 'mistake';
      label = 'Error';
      badge = '🟠';
      explanation = `Error táctico: permite al rival ganar material o activar su ataque.`;
      if (isWhite) whiteCounts.mistake++; else blackCounts.mistake++;
      if (isWhite) {
        keyMistakes.push({ moveIndex: i + 1, fenBefore: prevFen, moveMade: move, bestMove, classification, explanation });
      }
    } else {
      classification = 'blunder';
      label = 'Grave Error';
      badge = '🔴';
      explanation = `Grave error: cuelga una pieza o concede una ventaja decisiva.`;
      if (isWhite) whiteCounts.blunder++; else blackCounts.blunder++;
      if (isWhite) {
        keyMistakes.push({ moveIndex: i + 1, fenBefore: prevFen, moveMade: move, bestMove, classification, explanation });
      }
    }

    classifiedMoves.push({
      moveIndex: i + 1,
      san: move.san,
      from: move.from,
      to: move.to,
      isWhite,
      classification,
      label,
      badge,
      evalCp: currScore,
      evalFormatted: (currScore / 100).toFixed(1),
      explanation,
      bestMoveSan: bestMove ? bestMove.san : null
    });
  }

  const whiteAccuracy = whiteMoveCount > 0 ? Math.round(whiteAccuracySum / whiteMoveCount) : 80;
  const blackAccuracy = blackMoveCount > 0 ? Math.round(blackAccuracySum / blackMoveCount) : 80;

  return {
    evaluations,
    classifiedMoves,
    whiteAccuracy: Math.min(99, Math.max(20, whiteAccuracy)),
    blackAccuracy: Math.min(99, Math.max(20, blackAccuracy)),
    whiteCounts,
    blackCounts,
    keyMistakes
  };
};
