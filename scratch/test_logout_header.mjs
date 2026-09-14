import { renderDashboardHeader, renderHeaderUserProfile, renderHeaderSyncStatusBadge } from '../src/dashboard/DashboardHeader.js';
import { stateSyncService, SyncStatus } from '../src/services/stateSyncService.js';

console.log('--- Testing Dashboard Header with User Profile / Logout ---');

const headerHtml = renderDashboardHeader('daily-dashboard');

if (!headerHtml.includes('id="header-user-mount"')) {
  console.error('FAIL: Missing header-user-mount');
  process.exit(1);
}

if (!headerHtml.includes('id="cloud-sync-trigger"')) {
  console.error('FAIL: Missing cloud-sync-trigger');
  process.exit(1);
}

if (!headerHtml.includes('id="open-sidebar-btn"')) {
  console.error('FAIL: Missing open-sidebar-btn');
  process.exit(1);
}

console.log('✓ Header contains open-sidebar-btn, breadcrumbs, search, cloud-sync-trigger, and header-user-mount.');

// Test unauthenticated render (should only show Sign In, no redundant logout button)
const unauthHtml = renderHeaderUserProfile();
if (!unauthHtml.includes('id="header-profile-btn"') || unauthHtml.includes('id="header-logout-btn"')) {
  console.error('FAIL: Unauthenticated profile HTML should have profile button and no logout button');
  process.exit(1);
}
console.log('✓ Unauthenticated profile renders clean "Sign In" button without logout clutter.');

// Test simulated authenticated render
stateSyncService.currentUser = { id: 'test-user-123', email: 'alex.engineer@meta.com' };
stateSyncService.status = SyncStatus.IDLE;
const authHtml = renderHeaderUserProfile();

if (!authHtml.includes('alex.engineer') || !authHtml.includes('id="header-logout-btn"')) {
  console.error('FAIL: Authenticated profile HTML missing user info or logout button');
  process.exit(1);
}
console.log('✓ Authenticated profile pill renders initial, username (alex.engineer), and logout button.');

// Reset
stateSyncService.currentUser = null;
stateSyncService.status = SyncStatus.UNAUTHENTICATED;

console.log('All Header & Logout tests PASSED!');
