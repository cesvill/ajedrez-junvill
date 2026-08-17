import { Chess } from 'chess.js';
import fs from 'fs';
import path from 'path';

function normSol(s) {
  if (!s || typeof s !== 'object') return s;
  if (s.from && s.to && (s.to.endsWith('8') || s.to.endsWith('1')) && !s.promotion) {
    return { ...s, promotion: 'q' };
  }
  return s;
}

function checkStep(step, lessonId, stepIdx) {
  if (step.type === 'theory') {
    if (step.fen) {
      try { new Chess(step.fen); } catch(e) { throw new Error(`FEN de teoría inválido en ${lessonId}: ${step.fen}`); }
    }
    return step;
  }
  const chess = new Chess(step.fen);
  const sol = normSol(step.solution);
  const piece = chess.get(sol.from);
  if (piece && piece.type === 'p' && (sol.to.endsWith('8') || sol.to.endsWith('1'))) {
    sol.promotion = sol.promotion || 'q';
  }
  const move = chess.move({ from: sol.from, to: sol.to, promotion: sol.promotion || undefined });
  if (!move) {
    throw new Error(`[ERROR] Jugada ilegal en lección ${lessonId} paso ${stepIdx}: ${sol.from}->${sol.to} en FEN: ${step.fen}`);
  }
  return { ...step, solution: sol };
}

// Ahora construimos las 110 lecciones completas
console.log('Validando y ensamblando las 110 lecciones...');
