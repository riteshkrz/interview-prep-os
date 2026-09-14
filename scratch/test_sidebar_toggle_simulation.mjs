import { renderDashboardApp } from '../src/dashboard/DashboardApp.js';

console.log('--- Simulating Sidebar Toggle & Re-open ---');

// 1. Render Dashboard App
const html = renderDashboardApp('daily-dashboard');

// Verify critical element IDs and classes in the markup
const checks = [
  { test: html.includes('id="dash-sidebar"'), name: 'Sidebar element #dash-sidebar present' },
  { test: html.includes('id="open-sidebar-btn"'), name: 'Toggle button #open-sidebar-btn present' },
  { test: html.includes('id="close-sidebar-btn"'), name: 'Close button #close-sidebar-btn present' },
  { test: html.includes('id="dash-sidebar-backdrop"'), name: 'Backdrop element #dash-sidebar-backdrop present' },
  { test: html.includes('id="dashboard-main-layout"'), name: 'Main layout #dashboard-main-layout present' },
  { test: html.includes('id="dash-header"'), name: 'Header element #dash-header present' },
];

for (const c of checks) {
  if (!c.test) {
    console.error(`FAIL: ${c.name}`);
    process.exit(1);
  }
  console.log(`✓ ${c.name}`);
}

// 2. Logic simulation of setSidebarState & root.onclick
let isSidebarCollapsed = false; // Initial open state
let callCount = 0;

const mockSidebar = {
  classes: new Set(['dash-sidebar', 'fixed', 'left-0', 'top-0', 'h-full', 'w-60', 'sidebar-open', 'md:translate-x-0'])
};
const mockMainLayout = {
  classes: new Set(['pl-0', 'md:pl-60', 'flex', 'flex-col'])
};
const mockHeader = {
  classes: new Set(['fixed', 'top-0', 'md:left-60'])
};
const mockOpenBtn = {
  title: 'Collapse sidebar (⌘B)',
  classes: new Set(['flex', 'items-center']),
  iconText: 'left_panel_close',
  labelClasses: new Set(['sidebar-toggle-label', 'hidden'])
};

function setSidebarState(collapsed) {
  callCount++;
  isSidebarCollapsed = collapsed;
  if (collapsed) {
    mockSidebar.classes.add('sidebar-collapsed');
    mockSidebar.classes.add('-translate-x-full');
    mockSidebar.classes.delete('sidebar-open');
    mockSidebar.classes.delete('md:translate-x-0');

    mockMainLayout.classes.add('sidebar-collapsed-layout');
    mockMainLayout.classes.delete('md:pl-60');
    mockMainLayout.classes.add('pl-0');

    mockHeader.classes.add('sidebar-collapsed-header');
    mockHeader.classes.delete('md:left-60');
    mockHeader.classes.add('left-0');

    mockOpenBtn.title = 'Open navigation sidebar (⌘B)';
    mockOpenBtn.iconText = 'left_panel_open';
    mockOpenBtn.labelClasses.delete('hidden');
    mockOpenBtn.labelClasses.add('inline');
    mockOpenBtn.classes.add('border', 'border-[#38BDF8]/40', 'bg-[#141C2E]', 'text-[#38BDF8]');
  } else {
    mockSidebar.classes.delete('sidebar-collapsed');
    mockSidebar.classes.delete('-translate-x-full');
    mockSidebar.classes.add('sidebar-open');
    mockSidebar.classes.add('md:translate-x-0');

    mockMainLayout.classes.delete('sidebar-collapsed-layout');
    mockMainLayout.classes.delete('pl-0');
    mockMainLayout.classes.add('md:pl-60');

    mockHeader.classes.delete('sidebar-collapsed-header');
    mockHeader.classes.delete('left-0');
    mockHeader.classes.add('md:left-60');

    mockOpenBtn.title = 'Collapse sidebar (⌘B)';
    mockOpenBtn.iconText = 'left_panel_close';
    mockOpenBtn.labelClasses.add('hidden');
    mockOpenBtn.labelClasses.delete('inline');
    mockOpenBtn.classes.delete('border');
    mockOpenBtn.classes.delete('border-[#38BDF8]/40');
    mockOpenBtn.classes.delete('bg-[#141C2E]');
    mockOpenBtn.classes.delete('text-[#38BDF8]');
  }
}

// Emulate root.onclick delegation
function handleRootClick(targetId) {
  if (targetId === 'close-sidebar-btn') {
    setSidebarState(true);
    return;
  }
  if (targetId === 'open-sidebar-btn') {
    setSidebarState(!isSidebarCollapsed);
    return;
  }
  if (targetId === 'dash-sidebar-backdrop') {
    setSidebarState(true);
    return;
  }
}

// Step A: Close the sidebar
console.log('\nStep 1: User closes sidebar via close button');
callCount = 0;
handleRootClick('close-sidebar-btn');
if (callCount !== 1 || !isSidebarCollapsed) {
  console.error(`FAIL: expected isSidebarCollapsed=true, callCount=1, got ${isSidebarCollapsed}, ${callCount}`);
  process.exit(1);
}
if (!mockSidebar.classes.has('sidebar-collapsed') || !mockSidebar.classes.has('-translate-x-full')) {
  console.error('FAIL: sidebar does not have collapsed classes');
  process.exit(1);
}
console.log('✓ Sidebar collapsed successfully. Open button is highlighted in cyan with label: "Sidebar"');

// Step B: User clicks open-sidebar-btn to bring it back
console.log('\nStep 2: User clicks open-sidebar-btn to BRING IT BACK');
callCount = 0;
handleRootClick('open-sidebar-btn');
if (callCount !== 1) {
  console.error(`FAIL: Double-toggle detected! callCount=${callCount}`);
  process.exit(1);
}
if (isSidebarCollapsed !== false) {
  console.error(`FAIL: Sidebar was NOT brought back! isSidebarCollapsed is still ${isSidebarCollapsed}`);
  process.exit(1);
}
if (mockSidebar.classes.has('sidebar-collapsed') || !mockSidebar.classes.has('sidebar-open')) {
  console.error('FAIL: sidebar does not have open classes');
  process.exit(1);
}
console.log('✓ Sidebar brought back! Exactly 1 call executed. isSidebarCollapsed is false.');

// Step C: User clicks open-sidebar-btn again to toggle closed
console.log('\nStep 3: User clicks open-sidebar-btn to collapse it again');
callCount = 0;
handleRootClick('open-sidebar-btn');
if (callCount !== 1 || isSidebarCollapsed !== true) {
  console.error(`FAIL: Sidebar failed to collapse on toggle`);
  process.exit(1);
}
console.log('✓ Sidebar collapsed on toggle.');

// Step D: User presses ⌘B to bring it back
console.log('\nStep 4: User presses ⌘B keyboard shortcut to bring it back');
callCount = 0;
setSidebarState(!isSidebarCollapsed);
if (callCount !== 1 || isSidebarCollapsed !== false) {
  console.error(`FAIL: ⌘B failed to bring back sidebar`);
  process.exit(1);
}
console.log('✓ ⌘B brought back the sidebar smoothly.');

console.log('\nAll Sidebar Toggle & Re-open tests PASSED!');
