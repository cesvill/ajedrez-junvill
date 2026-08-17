import { Chess } from 'chess.js';
import { CURRICULUM_SECTIONS } from '../src/curriculum/lessonsData.js';

console.log('Auditando todos los ejercicios para detectar capturas múltiples o ambigüedades...');

const ambiguousExercises = [];

CURRICULUM_SECTIONS.forEach(section => {
  section.lessons.forEach(lesson => {
    lesson.steps.forEach((step, stepIdx) => {
      if (step.type === 'theory' || !step.solution) return;
      
      const chess = new Chess(step.fen);
      const allMoves = chess.moves({ verbose: true });
      const sol = step.solution;
      
      // Check if other pieces can also move to sol.to
      const movesToTarget = allMoves.filter(m => m.to === sol.to);
      
      if (movesToTarget.length > 1) {
        ambiguousExercises.push({
          lessonId: lesson.id,
          lessonNumber: lesson.number,
          lessonTitle: lesson.title,
          stepIdx: stepIdx + 1,
          stepId: step.id,
          fen: step.fen,
          expectedMove: `${sol.from}->${sol.to}`,
          otherMovesToTarget: movesToTarget.map(m => `${m.from}->${m.to} (${m.piece})`),
          instruction: step.instruction
        });
      }
    });
  });
});

console.log(`Encontrados ${ambiguousExercises.length} ejercicios con múltiples piezas que pueden ir a la casilla objetivo.`);
ambiguousExercises.forEach(e => {
  console.log(`\nLección ${e.lessonNumber} (${e.lessonId}) - Paso ${e.stepIdx} [${e.stepId}]:`);
  console.log(`  FEN: ${e.fen}`);
  console.log(`  Instrucción: ${e.instruction}`);
  console.log(`  Esperada: ${e.expectedMove}`);
  console.log(`  Otras piezas al mismo objetivo: ${e.otherMovesToTarget.join(', ')}`);
});
