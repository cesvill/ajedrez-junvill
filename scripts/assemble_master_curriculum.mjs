import { Chess } from 'chess.js';
import fs from 'fs';
import path from 'path';
import { getStage1 } from './stages/stage1.mjs';
import { getStage2 } from './stages/stage2.mjs';
import { getStage3 } from './stages/stage3.mjs';
import { getStage4 } from './stages/stage4.mjs';
import { getStage5 } from './stages/stage5.mjs';

function ex(id, fen, from, to, instruction, hint, feedback, promoOrOptions) {
  const chess = new Chess(fen);
  const sol = { from, to };
  const piece = chess.get(from);
  
  let promo = typeof promoOrOptions === 'string' ? promoOrOptions : null;
  let options = typeof promoOrOptions === 'object' && promoOrOptions !== null ? promoOrOptions : {};

  if (promo || (piece && piece.type === 'p' && (to.endsWith('8') || to.endsWith('1')))) {
    sol.promotion = promo || 'q';
  }
  const move = chess.move({ from: sol.from, to: sol.to, promotion: sol.promotion || undefined });
  if (!move) {
    throw new Error(`¡Jugada inválida en ${id}! ${from}->${to} en FEN: ${fen}`);
  }
  
  const stepObj = {
    id,
    fen,
    instruction,
    solution: sol,
    hint,
    feedback
  };

  if (options.alternativeSolutions) {
    options.alternativeSolutions.forEach(alt => {
      const cAlt = new Chess(fen);
      const mAlt = cAlt.move({ from: alt.from, to: alt.to, promotion: alt.promotion || undefined });
      if (!mAlt) {
        throw new Error(`¡Jugada alternativa inválida en ${id}! ${alt.from}->${alt.to}`);
      }
    });
    stepObj.alternativeSolutions = options.alternativeSolutions;
  }

  if (options.incorrectFeedback) {
    stepObj.incorrectFeedback = options.incorrectFeedback;
  }

  return stepObj;
}

function th(title, text, fen) {
  if (fen) {
    try { new Chess(fen); } catch(e) { throw new Error(`FEN inválido en teoría: ${fen}`); }
  }
  return { type: 'theory', title, text, fen: fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' };
}

console.log('Validando y ensamblando las 110 lecciones con chess.js...');

const s1 = getStage1(ex, th);
const s2 = getStage2(ex, th);
const s3 = getStage3(ex, th);
const s4 = getStage4(ex, th);
const s5 = getStage5(ex, th);

const allSections = [s1, s2, s3, s4, s5];

let totalLessons = 0;
let totalExercises = 0;

allSections.forEach(sec => {
  sec.lessons.forEach(l => {
    totalLessons++;
    const exercises = l.steps.filter(s => s.type !== 'theory');
    totalExercises += exercises.length;
    if (exercises.length !== 5) {
      console.warn(`Alerta: Lección ${l.id} tiene ${exercises.length} ejercicios.`);
    }
  });
});

console.log(`✓ Total de Secciones: ${allSections.length}`);
console.log(`✓ Total de Lecciones: ${totalLessons}`);
console.log(`✓ Total de Ejercicios Verificados: ${totalExercises}`);

const fileHeader = `/**
 * Base de Datos Curricular de Ajedrez Junvill (110 Puntos de Aprendizaje)
 * Basada en la Guía Curricular Infantil y Métodos Yusupov, Steps Method y KCF.
 * 
 * 5 Grandes Etapas:
 * - Etapa 1: Dominar los Conceptos Básicos (24 lecciones / 24 pts)
 * - Etapa 2: Táctica Fundamental y Combinaciones (26 lecciones / 26 pts)
 * - Etapa 3: Estrategia y Finales Esenciales (22 lecciones / 22 pts)
 * - Etapa 4: Aperturas y Medio Juego (20 lecciones / 20 pts)
 * - Etapa 5: Maestría Yusupov & Nivel FIDE (18 lecciones / 18 pts)
 * Total = 110 lecciones interactivas con teoría + 5 ejercicios únicos cada una.
 */

export const CURRICULUM_SECTIONS = ${JSON.stringify(allSections, null, 2)};

export const getAllLessons = () => {
  return CURRICULUM_SECTIONS.flatMap(section => section.lessons);
};

export const getLessonById = (id) => {
  for (const section of CURRICULUM_SECTIONS) {
    const found = section.lessons.find(l => l.id === id);
    if (found) return found;
  }
  return null;
};

export const getSectionByLessonId = (id) => {
  return CURRICULUM_SECTIONS.find(section => 
    section.lessons.some(l => l.id === id)
  );
};
`;

const targetPath = path.resolve('src/curriculum/lessonsData.js');
fs.writeFileSync(targetPath, fileHeader, 'utf-8');
console.log(`✓ Archivo ${targetPath} generado y guardado con éxito.`);
