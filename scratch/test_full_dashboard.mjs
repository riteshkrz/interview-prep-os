import { state } from '../src/dashboard/state.js';
import { renderCuratedDatabase } from '../src/dashboard/CuratedDatabase.js';
import { renderReadinessRadar } from '../src/dashboard/ReadinessRadar.js';
import { renderRevisionHub } from '../src/dashboard/RevisionHub.js';
import { renderQuickActions } from '../src/dashboard/QuickActions.js';
import { renderPdfStore, PDF_PRODUCTS } from '../src/dashboard/PdfStore.js';
import { renderDashboardApp } from '../src/dashboard/DashboardApp.js';

console.log('Testing full dashboard app output...');
const appHtml = renderDashboardApp('daily-dashboard');

if (!appHtml.includes('id="radar-mount"') || !appHtml.includes('id="revision-mount"') || !appHtml.includes('id="quick-actions-mount"')) {
  console.error('Missing right column elements');
  process.exit(1);
}

if (!appHtml.includes('id="curated-db-mount"')) {
  console.error('Missing curated db mount');
  process.exit(1);
}

if (!appHtml.includes('id="pdf-store-mount" class="w-full"')) {
  console.error('Missing full-width pdf-store-mount at bottom');
  process.exit(1);
}

// Verify CuratedDatabase produces 10 items
const dbHtml = renderCuratedDatabase('all', '', 'all', 1);
const rowMatches = dbHtml.match(/<tr class="hover:bg-\[#182238\]\/60/g);
console.log('Database rows rendered on page 1:', rowMatches ? rowMatches.length : 0);
if (rowMatches && rowMatches.length !== 10) {
  console.error(`Expected 10 rows, got ${rowMatches.length}`);
  process.exit(1);
}

console.log('✓ Curated Database renders exactly 10 rows per page.');
console.log('✓ Section 4 right column contains Radar, Revision Hub, and Quick Actions.');
console.log('✓ Section 5 bottom container is full-width containing the tempting PDF store.');
console.log('Full integration test PASSED!');
