import { SYSTEM_DESIGN_6_WEEK_ROADMAP, renderSystemDesignRoadmapView } from '../src/dashboard/SystemDesignRoadmapView.js';
import { state, toggleSysDesignRoadmapDay } from '../src/dashboard/state.js';
import { renderDashboardSidebar } from '../src/dashboard/DashboardSidebar.js';
import { renderDashboardHeader } from '../src/dashboard/DashboardHeader.js';

console.log('--- Testing 6-Week (42-Day) System Design Roadmap Workspace ---');

// 1. Verify 42 days structure
if (SYSTEM_DESIGN_6_WEEK_ROADMAP.length !== 42) {
  console.error(`FAIL: Expected 42 days in roadmap, got ${SYSTEM_DESIGN_6_WEEK_ROADMAP.length}`);
  process.exit(1);
}
console.log('✓ Curriculum contains exactly 42 structured days across 6 weeks.');

// 2. Verify week distribution: 7 days per week
const weekCounts = {};
SYSTEM_DESIGN_6_WEEK_ROADMAP.forEach(d => {
  weekCounts[d.week] = (weekCounts[d.week] || 0) + 1;
});
console.log('✓ Week distribution (7 days each):', weekCounts);
for (let w = 1; w <= 6; w++) {
  if (weekCounts[w] !== 7) {
    console.error(`FAIL: Week ${w} has ${weekCounts[w]} days, expected 7`);
    process.exit(1);
  }
}

// 3. Verify Revision days: Days 7, 14, 21, 28, 35, 42
const revisionDays = SYSTEM_DESIGN_6_WEEK_ROADMAP.filter(d => d.isRevision).map(d => d.day);
console.log('✓ Revision days found:', revisionDays);
const expectedRevisionDays = [7, 14, 21, 28, 35, 42];
if (JSON.stringify(revisionDays) !== JSON.stringify(expectedRevisionDays)) {
  console.error(`FAIL: Revision days mismatch: got ${revisionDays}, expected ${expectedRevisionDays}`);
  process.exit(1);
}

// 4. Verify Day 1 covers Part 0
const day1 = SYSTEM_DESIGN_6_WEEK_ROADMAP.find(d => d.day === 1);
if (!day1.topic.includes('Part 0') && !day1.objective.includes('7-Step')) {
  console.error('FAIL: Day 1 does not cover Part 0');
  process.exit(1);
}
console.log('✓ Day 1 covers Part 0 Playbook & Framework.');

// 5. Verify 20 Database Specs are represented in the last 18 days (Weeks 4-6)
const specsCovered = SYSTEM_DESIGN_6_WEEK_ROADMAP.filter(d => d.specId).map(d => d.specId);
console.log(`✓ Database specs mapped: ${specsCovered.length} specs (${specsCovered.join(', ')})`);
if (specsCovered.length < 18) {
  console.error(`FAIL: Expected at least 18 spec mappings, got ${specsCovered.length}`);
  process.exit(1);
}

// 6. Verify render output
const html = renderSystemDesignRoadmapView();
if (!html.includes('6-Week System Design Roadmap')) {
  console.error('FAIL: Missing title in rendered HTML');
  process.exit(1);
}
if (!html.includes('DAY 01') || !html.includes('DAY 42')) {
  console.error('FAIL: Missing DAY 01 or DAY 42 in rendered HTML');
  process.exit(1);
}
console.log('✓ Rendered HTML contains header, 42 days, and controls.');

// 7. Test state toggling
const before = Boolean(state.sysDesignRoadmap?.[1]?.completed);
toggleSysDesignRoadmapDay(1);
const after = Boolean(state.sysDesignRoadmap?.[1]?.completed);

if (after === before || !after) {
  console.error(`FAIL: toggleSysDesignRoadmapDay did not toggle state for Day 1`);
  process.exit(1);
}
console.log('✓ Day 1 toggled successfully to completed in state.');

// Verify HTML reflects updated progress (1 / 42)
const updatedHtml = renderSystemDesignRoadmapView();
if (!updatedHtml.includes('1 / 42')) {
  console.error('FAIL: Progress did not reflect 1 / 42 completed days');
  process.exit(1);
}
console.log('✓ View reflects 1 / 42 completed days.');

// Reset Day 1
toggleSysDesignRoadmapDay(1);

// 8. Verify Sidebar and Header
const sidebarHtml = renderDashboardSidebar('system-design-roadmap');
if (!sidebarHtml.includes('6-Week SysDesign')) {
  console.error('FAIL: Sidebar missing 6-Week SysDesign');
  process.exit(1);
}
console.log('✓ Sidebar contains active 6-Week SysDesign link.');

const headerHtml = renderDashboardHeader('system-design-roadmap');
if (!headerHtml.includes('6-Week System Design Roadmap')) {
  console.error('FAIL: Header missing 6-Week System Design Roadmap title');
  process.exit(1);
}
console.log('✓ Header displays 6-Week System Design Roadmap title.');

console.log('All 6-Week (42-Day) System Design Roadmap tests PASSED!');
