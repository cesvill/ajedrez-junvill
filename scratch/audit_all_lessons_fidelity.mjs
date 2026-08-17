import { CURRICULUM_SECTIONS } from '../src/curriculum/lessonsData.js';

let totalLessons = 0;
let genericLessons = [];

CURRICULUM_SECTIONS.forEach((section, sIdx) => {
  section.lessons.forEach((lesson, lIdx) => {
    totalLessons++;
    const exSteps = lesson.steps.filter(st => st.type !== 'theory');
    // Comprobar si los 5 pasos tienen el mismo FEN o el mismo instruction genérico
    const firstFen = exSteps[0]?.fen;
    const allSameFen = exSteps.every(st => st.fen === firstFen);
    const hasGenericText = exSteps.some(st => st.instruction?.includes('Encuentra la mejor jugada para aplicar:') || st.instruction?.includes('Demuestra el siguiente paso'));

    if (allSameFen || hasGenericText) {
      genericLessons.push({
        id: lesson.id,
        number: lesson.number,
        title: lesson.title,
        section: section.title,
        allSameFen,
        hasGenericText
      });
    }
  });
});

console.log(`Total Lecciones: ${totalLessons}`);
console.log(`Lecciones con problemas de variedad o FEN idéntico: ${genericLessons.length}`);
console.log('Lista de lecciones a enriquecer:');
genericLessons.forEach(l => console.log(` - Lección ${l.number} (${l.id}): ${l.title} [SameFen: ${l.allSameFen}, GenericText: ${l.hasGenericText}]`));
