import { KinglessChess } from './kinglessEngine.mjs';

const game = new KinglessChess('8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1');
console.log('Initial FEN:', game.fen());
console.log('Turn:', game.turn());
const moves = game.moves({ verbose: true });
console.log('Legal moves count for White pawns:', moves.length);
console.log('Sample moves:', moves.map(m => m.san).slice(0, 8));

// Jugar 1. e4
const m1 = game.move({ from: 'e2', to: 'e4' });
console.log('Move 1:', m1);
console.log('FEN after e4:', game.fen());

// Jugar 1... d5
const m2 = game.move({ from: 'd7', to: 'd5' });
console.log('Move 2:', m2);
console.log('FEN after d5:', game.fen());

// Jugar 2. exd5 (captura)
const m3 = game.move({ from: 'e4', to: 'd5' });
console.log('Move 3 (Capture):', m3);
console.log('FEN after exd5:', game.fen());

// Probar Peones vs Caballos
const pvsK = new KinglessChess('1n4n1/8/8/8/8/8/PPPPPPPP/8 b - - 0 1');
console.log('Knight moves:', pvsK.moves({ verbose: true }).map(m => m.san));
