import { Chess } from 'chess.js';
import fs from 'fs';
import path from 'path';

// Helper para validar jugadas
function V(fen, from, to, promo) {
  const chess = new Chess(fen);
  const sol = { from, to };
  if (promo || ((to.endsWith('8') || to.endsWith('1')) && chess.get(from)?.type === 'p')) {
    sol.promotion = promo || 'q';
  }
  const res = chess.move({ from: sol.from, to: sol.to, promotion: sol.promotion });
  if (!res) {
    throw new Error(`¡Jugada inválida! ${from}->${to} en FEN: ${fen}`);
  }
  return { fen, solution: sol };
}

console.log('Generando currículo maestro interactivo de 110 lecciones...');
