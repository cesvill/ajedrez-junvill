import { Chess } from 'chess.js';
import { CURRICULUM_SECTIONS } from '../src/curriculum/lessonsData.js';

let totalLessons = 0;
let totalSteps = 0;
let errors = [];

for (const section of CURRICULUM_SECTIONS) {
  for (const lesson of section.lessons) {
    totalLessons++;
    lesson.steps.forEach((step, idx) => {
      totalSteps++;
      if (step.type === 'theory') {
        if (!step.fen) {
          errors.push(`[Theory] Lección ${lesson.number} (${lesson.id}) Paso ${idx + 1} no tiene FEN`);
        } else {
          try {
            new Chess(step.fen);
          } catch (e) {
            errors.push(`[Theory FEN Inválido] Lección ${lesson.number} Paso ${idx + 1}: ${e.message}`);
          }
        }
      } else {
        // Ejercicio
        if (!step.fen) {
          errors.push(`[Ex] Lección ${lesson.number} (${lesson.id}) Paso ${idx + 1} no tiene FEN`);
          return;
        }
        let chess;
        try {
          chess = new Chess(step.fen);
        } catch (e) {
          errors.push(`[Ex FEN Inválido] Lección ${lesson.number} Paso ${idx + 1}: ${e.message}`);
          return;
        }

        if (!step.solution || !step.solution.from || !step.solution.to) {
          errors.push(`[Ex Solución Inválida] Lección ${lesson.number} Paso ${idx + 1}: falta from/to`);
          return;
        }

        try {
          const move = chess.move(step.solution);
          if (!move) {
            errors.push(`[Ex Movimiento Ilegal] Lección ${lesson.number} (${lesson.title}) Paso ${idx + 1}: ${step.solution.from}-${step.solution.to} no es legal en FEN: ${step.fen}`);
          }
        } catch (e) {
          errors.push(`[Ex Excepción en Movimiento] Lección ${lesson.number} (${lesson.title}) Paso ${idx + 1}: ${e.message}`);
        }
      }
    });
  }
}

console.log(`Auditoría completada.`);
console.log(`Total Lecciones: ${totalLessons}`);
console.log(`Total Pasos auditados: ${totalSteps}`);
console.log(`Errores encontrados: ${errors.length}`);
if (errors.length > 0) {
  console.log('\nListado de Errores:');
  errors.forEach(e => console.log('❌ ' + e));
} else {
  console.log('✅ ¡TODAS LAS LECCIONES Y JUGADAS SON 100% LEGALES Y VÁLIDAS!');
}
