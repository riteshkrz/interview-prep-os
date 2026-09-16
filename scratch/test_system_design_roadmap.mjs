import { SYSTEM_DESIGN_30_DAY_ROADMAP, renderSystemDesignRoadmapView } from '../src/dashboard/SystemDesignRoadmapView.js';
import { state, toggleSysDesignRoadmapDay } from '../src/dashboard/state.js';
import { renderDashboardSidebar } from '../src/dashboard/DashboardSidebar.js';
import { renderDashboardHeader } from '../src/dashboard/DashboardHeader.js';

console.log('--- Testing 30-Day System Design Roadmap Workspace ---');

// 1. Verify 30 days structure
if (SYSTEM_DESIGN_30_DAY_ROADMAP.length !== 30) {
  console.error(`FAIL: Expected 30 days in roadmap, got ${SYSTEM_DESIGN_30_DAY_ROADMAP.length}`);
  process.exit(1);
}
console.log('✓ Curriculum contains exactly 30 structured days.');

// 2. Verify week distribution
const weekCounts = {};
SYSTEM_DESIGN_30_DAY_ROADMAP.forEach(d => {
  weekCounts[d.week] = (weekCounts[d.week] || 0) + 1;
});
console.log('✓ Week distribution:', weekCounts);

// 3. Verify render output
const html = renderSystemDesignRoadmapView();
if (!html.includes('30-Day System Design Roadmap')) {
  console.error('FAIL: Missing title in rendered HTML');
  process.exit(1);
}
if (!html.includes('DAY 01') || !html.includes('DAY 30')) {
  console.error('FAIL: Missing DAY 01 or DAY 30 in rendered HTML');
  process.exit(1);
}
console.log('✓ Rendered HTML contains header, days, and controls.');

// 4. Test state toggling
const before = Boolean(state.sysDesignRoadmap?.[1]?.completed);
toggleSysDesignRoadmapDay(1);
const after = Boolean(state.sysDesignRoadmap?.[1]?.completed);

if (after === before || !after) {
  console.error(`FAIL: toggleSysDesignRoadmapDay did not toggle state for Day 1`);
  process.exit(1);
}
console.log('✓ Day 1 toggled successfully to completed in state.');

// Verify HTML reflects updated progress
const updatedHtml = renderSystemDesignRoadmapView();
if (!updatedHtml.includes('1 / 30') && !updatedHtml.includes('3%')) {
  console.error('FAIL: Progress did not reflect completed Day 1');
  process.exit(1);
}
console.log('✓ View reflects 1/30 completed days.');

// Reset Day 1
toggleSysDesignRoadmapDay(1);

// 5. Verify Sidebar and Header
const sidebarHtml = renderDashboardSidebar('system-design-roadmap');
if (!sidebarHtml.includes('data-nav-target="system-design-roadmap"')) {
  console.error('FAIL: Sidebar missing system-design-roadmap target');
  process.exit(1);
}
console.log('✓ Sidebar contains active 30-Day SysDesign link.');

const headerHtml = renderDashboardHeader('system-design-roadmap');
if (!headerHtml.includes('30-Day System Design Roadmap')) {
  console.error('FAIL: Header missing 30-Day System Design Roadmap title');
  process.exit(1);
}
console.log('✓ Header displays 30-Day System Design Roadmap title.');

console.log('All 30-Day System Design Roadmap tests PASSED!');
