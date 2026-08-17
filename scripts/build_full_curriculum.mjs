import { Chess } from 'chess.js';
import fs from 'fs';
import path from 'path';

// Validar que cada movimiento sea 100% legal con chess.js
function validateAndNorm(step, lessonId, stepIdx) {
  if (step.type === 'theory') {
    if (step.fen) {
      try { new Chess(step.fen); } catch(e) { throw new Error(`FEN inválido en teoría de ${lessonId}: ${step.fen}`); }
    }
    return step;
  }

  const chess = new Chess(step.fen);
  const sol = { ...step.solution };
  if ((sol.to.endsWith('8') || sol.to.endsWith('1')) && !sol.promotion) {
    const piece = chess.get(sol.from);
    if (piece && piece.type === 'p') {
      sol.promotion = 'q';
    }
  }

  const move = chess.move({
    from: sol.from,
    to: sol.to,
    promotion: sol.promotion || undefined
  });

  if (!move) {
    throw new Error(`¡MOVIMIENTO ILEGAL en lección ${lessonId} paso ${stepIdx}! ${sol.from}->${sol.to} en FEN: ${step.fen}`);
  }

  return {
    ...step,
    solution: sol
  };
}

console.log('Iniciando construcción del currículo maestro de 110 lecciones...');
