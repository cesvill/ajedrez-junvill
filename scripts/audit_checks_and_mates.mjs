import { Chess } from 'chess.js';
import { getStage1 } from './stages/stage1.mjs';
import { getStage2 } from './stages/stage2.mjs';
import { getStage3 } from './stages/stage3.mjs';
import { getStage4 } from './stages/stage4.mjs';
import { getStage5 } from './stages/stage5.mjs';

function ex(id, fen, from, to, instruction, hint, feedback, promoOrOptions) {
  const sol = { from, to };
  let promo = typeof promoOrOptions === 'string' ? promoOrOptions : (promoOrOptions?.promotion || null);
  let options = typeof promoOrOptions === 'object' && promoOrOptions !== null ? promoOrOptions : {};
  if (promo || to.endsWith('8') || to.endsWith('1')) {
    sol.promotion = promo || 'q';
  }
  return { id, fen, solution: sol, instruction, feedback, hint, ...options };
}
function th(title, text, fen) {
  return { type: 'theory', title, text, fen };
}

const stages = [
  getStage1(ex, th),
  getStage2(ex, th),
  getStage3(ex, th),
  getStage4(ex, th),
  getStage5(ex, th)
];

console.log('Auditing all lessons for legitimate checks and checkmates...');
let issues = 0;

stages.forEach(stage => {
  stage.lessons.forEach(lesson => {
    lesson.steps.forEach((step, stepIdx) => {
      if (step.type === 'theory' || !step.solution) return;
      const chess = new Chess(step.fen);
      const move = chess.move({ from: step.solution.from, to: step.solution.to, promotion: step.solution.promotion });
      
      const instrLower = (step.instruction || '').toLowerCase();
      const feedbackLower = (step.feedback || '').toLowerCase();
      const titleLower = (lesson.title || '').toLowerCase();

      const claimsCheck = instrLower.includes('jaque') && !instrLower.includes('escapa') && !instrLower.includes('bloquea') && !instrLower.includes('evita');
      const claimsMate = instrLower.includes('mate') || feedbackLower.includes('mate');

      if (claimsMate && !chess.isCheckmate()) {
        // Only flag if it specifically claims "jaque mate" as the objective of this single move
        if (instrLower.includes('jaque mate') || instrLower.includes('da mate') || instrLower.includes('asesta jaque mate')) {
          console.log(`⚠️ Falso Mate en Lección ${lesson.number} (${lesson.id}) Paso ${stepIdx + 1}: ${step.solution.from}->${step.solution.to} no es mate.`);
          issues++;
        }
      }

      if (claimsCheck && !chess.inCheck()) {
        if (instrLower.includes('dar jaque') || instrLower.includes('dando jaque') || instrLower.includes('da jaque') || titleLower.includes('cómo dar jaque')) {
          console.log(`⚠️ Falso Jaque en Lección ${lesson.number} (${lesson.id}) Paso ${stepIdx + 1}: ${step.solution.from}->${step.solution.to} no da jaque (inCheck: false).`);
          issues++;
        }
      }
    });
  });
});

console.log(`\nAuditoría finalizada: ${issues} problemas detectados.`);
