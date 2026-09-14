import { renderDashboardSidebar } from '../src/dashboard/DashboardSidebar.js';
import { renderDashboardHeader } from '../src/dashboard/DashboardHeader.js';
import { renderDashboardApp } from '../src/dashboard/DashboardApp.js';

console.log('--- Testing Closable Sidebar ---');

// 1. Test Expanded Sidebar
const openSidebarHtml = renderDashboardSidebar('daily-dashboard', false);
if (!openSidebarHtml.includes('md:translate-x-0')) {
  console.error('FAIL: Open sidebar should have md:translate-x-0');
  process.exit(1);
}
if (!openSidebarHtml.includes('id="close-sidebar-btn"')) {
  console.error('FAIL: Missing close-sidebar-btn');
  process.exit(1);
}
if (openSidebarHtml.includes('id="close-sidebar-btn" class="md:hidden') || openSidebarHtml.includes('id="close-sidebar-btn" class="lg:hidden')) {
  console.error('FAIL: close-sidebar-btn should not be hidden on desktop');
  process.exit(1);
}
console.log('✓ Open sidebar rendered with close-sidebar-btn available on desktop.');

// 2. Test Collapsed Sidebar
const collapsedSidebarHtml = renderDashboardSidebar('daily-dashboard', true);
if (collapsedSidebarHtml.includes('md:translate-x-0')) {
  console.error('FAIL: Collapsed sidebar should not have md:translate-x-0');
  process.exit(1);
}
console.log('✓ Collapsed sidebar rendered without md:translate-x-0.');

// 3. Test Header Toggle
const headerHtml = renderDashboardHeader('daily-dashboard', false);
if (!headerHtml.includes('id="open-sidebar-btn"')) {
  console.error('FAIL: Missing open-sidebar-btn in header');
  process.exit(1);
}
if (headerHtml.includes('id="open-sidebar-btn" class="lg:hidden')) {
  console.error('FAIL: open-sidebar-btn in header should not be lg:hidden');
  process.exit(1);
}
console.log('✓ Header toggle button is accessible on desktop.');

// 4. Test Full App HTML
const appHtml = renderDashboardApp('daily-dashboard');
if (!appHtml.includes('id="dashboard-main-layout"')) {
  console.error('FAIL: Missing dashboard-main-layout');
  process.exit(1);
}
console.log('✓ Full Dashboard App layout wrapper is present.');

console.log('All Closable Sidebar tests PASSED!');
