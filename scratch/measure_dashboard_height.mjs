import { state } from '../src/dashboard/state.js';
import { renderCuratedDatabase } from '../src/dashboard/CuratedDatabase.js';
import { renderReadinessRadar } from '../src/dashboard/ReadinessRadar.js';
import { renderRevisionHub } from '../src/dashboard/RevisionHub.js';
import { renderQuickActions } from '../src/dashboard/QuickActions.js';

console.log("State problems:", state.dsaProblems.length);
const radarHtml = renderReadinessRadar();
const revHtml = renderRevisionHub();
const qaHtml = renderQuickActions();

console.log("Radar length:", radarHtml.length);
console.log("RevisionHub length:", revHtml.length);
console.log("QuickActions length:", qaHtml.length);

for (const ps of [6, 7, 8, 9, 10, 12, 15, 20]) {
  const dbHtml = renderCuratedDatabase('all', '', 'all', 1);
  console.log(`Page size test - problems: ${state.dsaProblems.length}`);
}
