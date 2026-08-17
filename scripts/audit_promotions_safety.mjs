import { Chess } from 'chess.js';
import { CURRICULUM_SECTIONS } from '../src/curriculum/lessonsData.js';

console.log('Auditando seguridad de coronación y piezas en todas las lecciones...');

CURRICULUM_SECTIONS.forEach(section => {
  section.lessons.forEach(lesson => {
    lesson.steps.forEach((step, stepIdx) => {
      if (step.type === 'theory' || !step.solution) return;
      
      const chess = new Chess(step.fen);
      const sol = step.solution;
      
      const move = chess.move({ from: sol.from, to: sol.to, promotion: sol.promotion || undefined });
      if (!move) return;
      
      // Check if after White's move, Black's king can immediately capture the piece on sol.to
      const blackMoves = chess.moves({ verbose: true });
      const kingCapturesTarget = blackMoves.find(m => m.piece === 'k' && m.to === sol.to);
      
      if (kingCapturesTarget) {
        console.log(`\n⚠️ Problema en Lección ${lesson.number} (${lesson.id}) - Paso ${stepIdx + 1} [${step.id}]:`);
        console.log(`  FEN: ${step.fen}`);
        console.log(`  Jugada: ${sol.from}->${sol.to} ${sol.promotion ? '=' + sol.promotion : ''}`);
        console.log(`  Problema: ¡El rey enemigo puede capturar ${sol.to} en la siguiente jugada!`);
      }
    });
  });
});
