import { getBestBotMove } from '../src/engine/aiBot.js';
import { Chess } from 'chess.js';

const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

console.log('=== TEST DE VARIEDAD DE APERTURAS (BLANCAS) ===');
const whiteFirstMoves = {};
for (let i = 0; i < 20; i++) {
  const move = getBestBotMove(initialFen, 3, null, 'standard', 'quantum');
  const san = `${move.from}-${move.to}`;
  whiteFirstMoves[san] = (whiteFirstMoves[san] || 0) + 1;
}
console.log('Distribución de jugadas iniciales de Blancas (20 partidas):', whiteFirstMoves);

console.log('\n=== TEST DE RESPUESTAS A 1. e4 (NEGRAS) ===');
const chess = new Chess();
chess.move('e4');
const e4Fen = chess.fen();
const blackVsE4 = {};
for (let i = 0; i < 20; i++) {
  const move = getBestBotMove(e4Fen, 3, null, 'standard', 'spark');
  const san = `${move.from}-${move.to}`;
  blackVsE4[san] = (blackVsE4[san] || 0) + 1;
}
console.log('Respuestas de Sparky contra 1. e4 (20 partidas):', blackVsE4);

console.log('\n=== TEST DE RESPUESTAS A 1. d4 (NEGRAS) ===');
const chessD4 = new Chess();
chessD4.move('d4');
const d4Fen = chessD4.fen();
const blackVsD4 = {};
for (let i = 0; i < 20; i++) {
  const move = getBestBotMove(d4Fen, 3, null, 'standard', 'titan');
  const san = `${move.from}-${move.to}`;
  blackVsD4[san] = (blackVsD4[san] || 0) + 1;
}
console.log('Respuestas de Titán contra 1. d4 (20 partidas):', blackVsD4);
