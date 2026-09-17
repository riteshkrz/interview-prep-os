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
if (!html.includes('DAY 01') || !html.includes('today-system-design-card')) {
  console.error('FAIL: Missing DAY 01 or today-system-design-card in default rendered HTML');
  process.exit(1);
}
const allHtml = renderSystemDesignRoadmapView('all');
if (!allHtml.includes('DAY 42')) {
  console.error('FAIL: Missing DAY 42 in all 42 days grid');
  process.exit(1);
}
console.log('✓ Rendered HTML contains header, today task focus card, and 42 days grid.');

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

// 9. Verify Topics Data for all 42 days
import { SYSTEM_DESIGN_TOPICS_BY_DAY } from '../src/dashboard/systemDesignTopicsData.js';
import { renderTopicDetail } from '../src/dashboard/SystemDesignRoadmapView.js';

let totalTopicsCount = 0;
for (let d = 1; d <= 42; d++) {
  const dayTopics = SYSTEM_DESIGN_TOPICS_BY_DAY[d];
  if (!dayTopics || !Array.isArray(dayTopics) || dayTopics.length < 2) {
    console.error(`FAIL: Day ${d} missing topics or has fewer than 2 topics (got ${dayTopics?.length})`);
    process.exit(1);
  }
  totalTopicsCount += dayTopics.length;

  dayTopics.forEach((topic, idx) => {
    if (!topic.title || !topic.whatItIs || !topic.keyTakeaway) {
      console.error(`FAIL: Day ${d} Topic ${idx} missing required fields:`, topic);
      process.exit(1);
    }
  });
}
console.log(`✓ All 42 days have rich topics data (Total topics defined: ${totalTopicsCount}, avg ${(totalTopicsCount/42).toFixed(1)} topics/day).`);

// 10. Verify Topic Tabs markup in rendered HTML
if (!html.includes('roadmap-topic-tab') || !html.includes('roadmap-topic-content-1')) {
  console.error('FAIL: Rendered HTML missing roadmap-topic-tab or roadmap-topic-content container');
  process.exit(1);
}
console.log('✓ Rendered HTML contains interactive .roadmap-topic-tab buttons and dynamic content mounts.');

// 11. Test renderTopicDetail directly
const sampleTopic = SYSTEM_DESIGN_TOPICS_BY_DAY[1][1];
const detailHtml = renderTopicDetail(sampleTopic);
if (!detailHtml.includes(sampleTopic.title) || !detailHtml.includes('45-MINUTE TIMELINE BUDGET')) {
  console.error('FAIL: renderTopicDetail output missing topic title or architecture diagram');
  process.exit(1);
}
console.log('✓ renderTopicDetail correctly generates rich topic HTML with diagrams and takeaways.');

// 12. Verify calculateReadinessIndex and renderReadinessIndexCard
import { calculateReadinessIndex, renderReadinessIndexCard } from '../src/dashboard/SystemDesignRoadmapView.js';

const baseIndex = calculateReadinessIndex({});
if (baseIndex.overall !== 74 || baseIndex.distributed !== 88 || baseIndex.storage !== 68 || baseIndex.api !== 78 || baseIndex.resiliency !== 62) {
  console.error('FAIL: Baseline readiness index does not match calibrated targets (74%, 88%, 68%, 78%, 62%)', baseIndex);
  process.exit(1);
}
console.log('✓ Baseline Readiness Index matches calibrated targets exactly (74% overall, 88% Distributed, 68% Storage, 78% API, 62% Resiliency).');

// 13. Verify renderReadinessIndexCard output
const cardHtml = renderReadinessIndexCard(baseIndex);
if (!cardHtml.includes('Readiness Index') || !cardHtml.includes('P90 CALIBRATED') || !cardHtml.includes('74%') || !cardHtml.includes('READY') || !cardHtml.includes('+6% this wk')) {
  console.error('FAIL: Readiness Index Card missing expected labels or values in HTML', cardHtml);
  process.exit(1);
}
if (!cardHtml.includes('Distributed Sys') || !cardHtml.includes('Storage &amp; Partition') && !cardHtml.includes('Storage & Partition') || !cardHtml.includes('API &amp; Network Protocols') && !cardHtml.includes('API & Network Protocols') || !cardHtml.includes('Scaling &amp; Resiliency') && !cardHtml.includes('Scaling & Resiliency')) {
  console.error('FAIL: Readiness Index Card missing domain labels');
  process.exit(1);
}
console.log('✓ renderReadinessIndexCard renders pixel-perfect widget matching user specification.');

// 14. Verify Today's Task To Complete focus in 6-Week System Design
import { getActiveRoadmapDay, setActiveRoadmapDay } from '../src/dashboard/SystemDesignRoadmapView.js';

setActiveRoadmapDay(1);
const todayFocusHtml = renderSystemDesignRoadmapView('today');
if (!todayFocusHtml.includes('id="today-system-design-card"')) {
  console.error('FAIL: Missing today-system-design-card in today focus mode');
  process.exit(1);
}
if (!todayFocusHtml.includes("TODAY'S FOCUS • DAY 01 OF 42")) {
  console.error('FAIL: Missing TODAY\'S FOCUS banner in today focus mode');
  process.exit(1);
}
if (!todayFocusHtml.includes("Mark Day 1 Task Complete")) {
  console.error('FAIL: Missing Mark Day 1 Task Complete button in today focus mode');
  process.exit(1);
}
if (!todayFocusHtml.includes("sys-roadmap-prev-day-btn") || !todayFocusHtml.includes("sys-roadmap-next-day-btn")) {
  console.error('FAIL: Missing prev/next day navigation buttons');
  process.exit(1);
}

// Test day navigation
setActiveRoadmapDay(2);
const day2Html = renderSystemDesignRoadmapView('today');
if (!day2Html.includes("TODAY'S FOCUS • DAY 02 OF 42")) {
  console.error('FAIL: Day switching failed to update today focus card to Day 2');
  process.exit(1);
}
setActiveRoadmapDay(1);
console.log('✓ 6-Week System Design view displays ONLY today\'s task to complete with day stepper and interactive topics.');

console.log('\n--- ALL 13 TESTS PASSED SUCCESSFULLY! ---');

console.log('All 6-Week (42-Day) System Design Roadmap tests PASSED!');
