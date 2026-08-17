import { Chess } from 'chess.js';
import { getStage1 } from './stages/stage1.mjs';
import { getStage2 } from './stages/stage2.mjs';
import { getStage3 } from './stages/stage3.mjs';
import { getStage4 } from './stages/stage4.mjs';
import { getStage5 } from './stages/stage5.mjs';

function validateStage(stageGetter, stageNum) {
  const errors = [];
  const fakeEx = (id, fen, from, to, instruction, hint, feedback, promo) => {
    try {
      const chess = new Chess(fen);
      const sol = { from, to };
      const piece = chess.get(from);
      if (promo || (piece && piece.type === 'p' && (to.endsWith('8') || to.endsWith('1')))) {
        sol.promotion = promo || 'q';
      }
      const move = chess.move({ from: sol.from, to: sol.to, promotion: sol.promotion || undefined });
      if (!move) {
        errors.push({ id, fen, from, to, reason: 'chess.move returned null' });
      }
    } catch(err) {
      errors.push({ id, fen, from, to, reason: err.message });
    }
  };
  const fakeTh = () => ({});
  stageGetter(fakeEx, fakeTh);
  console.log(`Etapa ${stageNum}: ${errors.length} errores encontrados.`);
  errors.forEach(e => console.log(`  [Error en ${e.id}] ${e.from}->${e.to} en ${e.fen} (${e.reason})`));
  return errors;
}

console.log('Validando todas las etapas...');
validateStage(getStage1, 1);
validateStage(getStage2, 2);
validateStage(getStage3, 3);
validateStage(getStage4, 4);
validateStage(getStage5, 5);
