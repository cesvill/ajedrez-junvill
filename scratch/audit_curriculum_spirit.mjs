import { CURRICULUM_SECTIONS } from '../src/curriculum/lessonsData.js';

let totalLessons = 0;
let lessonsSummary = [];

CURRICULUM_SECTIONS.forEach((section, sIdx) => {
  section.lessons.forEach((lesson, lIdx) => {
    totalLessons++;
    const stepDetails = lesson.steps.map((st, idx) => {
      if (st.type === 'theory') return `[Theory] ${st.title}`;
      return `[Ex ${idx}] ${st.instruction} -> ${st.solution ? (st.solution.from + '-' + st.solution.to) : 'no sol'}`;
    });
    lessonsSummary.push({
      id: lesson.id,
      number: lesson.number,
      title: lesson.title,
      category: lesson.category,
      steps: stepDetails
    });
  });
});

console.log(`Total Lessons Found: ${totalLessons}`);
console.log('Sample Lessons Analysis:');
lessonsSummary.slice(0, 15).forEach(l => {
  console.log(`\n=== LECCIÓN ${l.number}: ${l.title} (${l.id}) ===`);
  l.steps.forEach(s => console.log('  ', s));
});
