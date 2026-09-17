import { renderRoadmapDayCard, SYSTEM_DESIGN_6_WEEK_ROADMAP } from '../src/dashboard/SystemDesignRoadmapView.js';

const day1 = SYSTEM_DESIGN_6_WEEK_ROADMAP.find(d => d.day === 1);
const html1 = renderRoadmapDayCard(day1, { completed: false });

console.log('Day 1 Card Length:', html1.length);
console.log('Contains Topics to Cover:', html1.includes('Topics to Cover'));
console.log('Contains Start the Day:', html1.includes('Start the Day'));
console.log('Contains 0.1:', html1.includes('0.1'));
console.log('Contains 0.4:', html1.includes('0.4'));
console.log('Does NOT contain Latency table:', !html1.includes('LATENCY AT A GLANCE'));

const day29 = SYSTEM_DESIGN_6_WEEK_ROADMAP.find(d => d.day === 29);
const html29 = renderRoadmapDayCard(day29, { completed: true });
console.log('Day 29 Card Length:', html29.length);
console.log('Contains Spec:', html29.includes('Production Blueprint Spec'));
console.log('Contains Review Day:', html29.includes('Review Day'));

if (html1.includes('Start the Day') && !html1.includes('LATENCY AT A GLANCE') && html29.includes('Review Day')) {
  console.log('SUCCESS: Small cards verified perfectly!');
} else {
  process.exit(1);
}
