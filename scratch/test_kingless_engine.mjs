import { Chess } from 'chess.js';

try {
  const kinglessFen = '8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1';
  const c = new Chess(kinglessFen);
  console.log('Valid FEN in chess.js:', c.fen());
  const moves = c.moves({ verbose: true });
  console.log('Moves count:', moves.length);
  console.log('Sample moves:', moves.slice(0, 3));
} catch (e) {
  console.log('chess.js error on kingless FEN:', e.message);
}
