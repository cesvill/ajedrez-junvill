import { Chess } from 'chess.js';
import { CURRICULUM_SECTIONS } from './src/curriculum/lessonsData.js';
import { TRAINING_CATEGORIES } from './src/curriculum/trainingData.js';

console.log("=== INICIANDO AUDITORÍA COMPLETA DE LECCIONES Y ENTRENAMIENTOS ===");

let totalStepsAudited = 0;
let errorsFound = [];

// 1. Audit Curriculum Lessons
for (const section of CURRICULUM_SECTIONS) {
  for (const lesson of section.lessons) {
    lesson.steps.forEach((step, idx) => {
      totalStepsAudited++;
      const stepName = `[Lección ${lesson.number}: ${lesson.title}] Paso ${idx + 1} (${step.type || 'ejercicio'})`;

      if (!step.fen) {
        errorsFound.push({ stepName, error: "Falta FEN" });
        return;
      }

      let chess;
      try {
        chess = new Chess(step.fen);
      } catch (err) {
        errorsFound.push({ stepName, error: `FEN Inválido: ${step.fen} (${err.message})` });
        return;
      }

      if (step.type !== 'theory') {
        const sol = step.solution || step.targetMove;
        if (!sol || !sol.from || !sol.to) {
          errorsFound.push({ stepName, error: "Falta objeto solution (from/to)" });
          return;
        }

        const piece = chess.get(sol.from);
        if (!piece) {
          errorsFound.push({
            stepName,
            error: `La casilla origen '${sol.from}' está VACÍA. FEN: '${step.fen}', sol: ${sol.from}->${sol.to}`
          });
          return;
        }

        if (piece.color !== chess.turn()) {
          errorsFound.push({
            stepName,
            error: `El turno del FEN (${chess.turn()}) no coincide con el color de la pieza en '${sol.from}' (${piece.color})`
          });
          return;
        }

        const legalMoves = chess.moves({ verbose: true });
        const isLegal = legalMoves.some(m => m.from === sol.from && m.to === sol.to);

        if (!isLegal) {
          errorsFound.push({
            stepName,
            error: `El movimiento '${sol.from}'->'${sol.to}' NO ES LEGAL en la posición. Jugadas legales disponibles: ${legalMoves.map(m => m.from + '->' + m.to).slice(0, 8).join(', ')}`
          });
        }
      }
    });
  }
}

// 2. Audit Training Puzzles
for (const cat of TRAINING_CATEGORIES) {
  for (const p of cat.puzzles) {
    totalStepsAudited++;
    const puzzleName = `[Entrenamiento: ${cat.title}] Puzzle: ${p.title} (${p.id})`;
    try {
      const chess = new Chess(p.fen);
      const piece = chess.get(p.solution.from);
      if (!piece) {
        errorsFound.push({ puzzleName, error: `Casilla origen '${p.solution.from}' vacía en FEN: ${p.fen}` });
        continue;
      }
      const legalMoves = chess.moves({ verbose: true });
      const isLegal = legalMoves.some(m => m.from === p.solution.from && m.to === p.solution.to);
      if (!isLegal) {
        errorsFound.push({ puzzleName, error: `Movimiento ${p.solution.from}->${p.solution.to} no es legal.` });
      }
    } catch (e) {
      errorsFound.push({ puzzleName, error: `Error FEN: ${e.message}` });
    }
  }
}

console.log(`\nAuditoría finalizada.`);
console.log(`Total de pasos/ejercicios auditados: ${totalStepsAudited}`);
console.log(`Total de errores encontrados: ${errorsFound.length}`);

if (errorsFound.length > 0) {
  console.log("\n--- LISTA DETALLADA DE ERRORES A CORREGIR ---");
  errorsFound.forEach((e, i) => {
    console.log(`${i + 1}. ${e.stepName || e.puzzleName}: ${e.error}`);
  });
} else {
  console.log("¡TODAS LAS LECCIONES Y EJERCICIOS SON 100% VÁLIDOS Y LEGALES!");
}
