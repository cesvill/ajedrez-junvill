import { Chess } from 'chess.js';
import { CURRICULUM_SECTIONS } from '../src/curriculum/lessonsData.js';
import { TRAINING_CATEGORIES } from '../src/curriculum/trainingData.js';

let badPositions = [];
for (const section of CURRICULUM_SECTIONS) {
  for (const lesson of section.lessons) {
    lesson.steps.forEach((step, idx) => {
      if (!step.fen) return;
      try {
        const tokens = step.fen.split(' ');
        const otherTurn = tokens[1] === 'w' ? 'b' : 'w';
        tokens[1] = otherTurn;
        const otherFen = tokens.join(' ');
        const otherChess = new Chess(otherFen);
        if (otherChess.inCheck()) {
          badPositions.push({
            lessonId: lesson.id,
            lessonNumber: lesson.number,
            lessonTitle: lesson.title,
            stepIndex: idx + 1,
            type: step.type,
            instruction: step.instruction || step.title,
            fen: step.fen
          });
        }
      } catch (e) {}
    });
  }
}

console.log(JSON.stringify(badPositions, null, 2));
