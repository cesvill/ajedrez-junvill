import { KinglessChess, getBestKinglessBotMove } from './kinglessEngine.mjs';

// Test 1: Peones Blancos juegan e4, Bot de Negras responde con peón negro
const pGame = new KinglessChess('8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1');
pGame.move({ from: 'e2', to: 'e4' });
console.log('FEN after e4:', pGame.fen());

const botMove = getBestKinglessBotMove(pGame.fen(), 2);
console.log('Bot response to e4:', botMove);

// Test 2: Peones vs Caballos: Blancas mueven e4, Caballo negro responde
const kGame = new KinglessChess('1n4n1/8/8/8/8/8/PPPPPPPP/8 b - - 0 1');
const knightMove = getBestKinglessBotMove(kGame.fen(), 2);
console.log('Knight bot move:', knightMove);

// Test 3: Blanco a 1 paso de coronar en e8
const winGame = new KinglessChess('8/4P3/8/8/8/8/8/8 w - - 0 1');
const promoMove = getBestKinglessBotMove(winGame.fen(), 2);
console.log('Instant winning promotion move:', promoMove);
