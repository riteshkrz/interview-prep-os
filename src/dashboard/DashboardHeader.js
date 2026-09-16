import { state, getMetrics } from './state.js';
import { stateSyncService, SyncStatus } from '../services/stateSyncService.js';

export function renderDashboardHeader(activeTab = 'daily-dashboard', isCollapsed = false) {
  const syncBadge = renderHeaderSyncStatusBadge();

  const tabTitles = {
    'daily-dashboard': 'Daily Sprint',
    'dsa-tracker': '100 Core DSA Problems',
    'system-design': '12 Production System Specs',
    'system-design-roadmap': '30-Day System Design Roadmap',
    'revision-hub': 'SM-2 Revision Hub',
    'readiness-assessment': 'Readiness Radar'
  };
  const activeTitle = tabTitles[activeTab] || 'Daily Sprint';

  return `
    <header id="dash-header" class="fixed top-0 ${isCollapsed ? 'left-0 sidebar-collapsed-header' : 'left-0 md:left-60'} right-0 h-12 bg-[#0F1626]/90 backdrop-blur-md border-b border-[#24314A] z-40 flex items-center justify-between px-4 md:px-6 transition-all duration-300">
      <!-- Left: Sidebar Toggle & Breadcrumb -->
      <div class="flex items-center gap-3 min-w-0">
        <button id="open-sidebar-btn" data-action="toggle-sidebar" class="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#141C2E] text-[#94A3B8] hover:text-[#F8FAFC] transition-all cursor-pointer ${isCollapsed ? 'border border-[#38BDF8]/40 bg-[#141C2E] text-[#38BDF8]' : ''}" title="${isCollapsed ? 'Open navigation sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}">
          <span class="material-symbols-outlined text-[19px]">${isCollapsed ? 'left_panel_open' : 'left_panel_close'}</span>
          <span class="sidebar-toggle-label text-[11px] font-code font-semibold ${isCollapsed ? 'inline' : 'hidden'}">Sidebar</span>
        </button>

        <div class="flex items-center gap-1.5 text-[12px] text-[#94A3B8] font-code truncate">
          <a href="#/dashboard" data-nav-target="daily-dashboard" class="sidebar-nav-item hover:text-[#F8FAFC] cursor-pointer">Workspace</a>
          <span class="material-symbols-outlined text-[13px] text-[#64748B]">chevron_right</span>
          <span class="text-[#38BDF8] font-medium font-sans truncate">${escapeHtml(activeTitle)}</span>
        </div>
      </div>

      <!-- Right: Search, Cloud Sync & User Profile -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <!-- Quick Search -->
        <button id="quick-search-trigger" class="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141C2E] border border-[#24314A] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#6366F1]/50 cursor-pointer transition-colors" title="Quick Search (⌘K)">
          <span class="material-symbols-outlined text-[14px] text-[#64748B]">search</span>
          <span class="text-[12px] hidden sm:inline">Search</span>
          <kbd class="font-code text-[10px] px-1 py-0.2 rounded bg-[#0A0E17] text-[#94A3B8] border border-[#24314A] hidden sm:inline">⌘K</kbd>
        </button>

        <!-- Cloud Sync Status Pill -->
        <button id="cloud-sync-trigger" class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141C2E] border border-[#24314A] hover:border-[#6366F1]/50 cursor-pointer transition-all" title="Supabase Cloud State Sync">
          ${syncBadge}
        </button>

        <!-- User Profile / Auth Mount -->
        <div id="header-user-mount">
          ${renderHeaderUserProfile()}
        </div>
      </div>
    </header>
  `;
}

export function renderHeaderSyncStatusBadge() {
  const syncInfo = stateSyncService.getStatus();

  switch (syncInfo.status) {
    case SyncStatus.UNCONFIGURED:
      return `
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span class="text-[11px] font-code text-slate-300 hidden sm:inline">Local Only</span>
      `;
    case SyncStatus.UNAUTHENTICATED:
      return `
        <span class="material-symbols-outlined text-[14px] text-slate-400">cloud</span>
        <span class="text-[11px] font-code text-slate-300 hidden sm:inline">Cloud Sync</span>
      `;
    case SyncStatus.SYNCING:
      return `
        <span class="material-symbols-outlined text-[14px] text-[#38BDF8] animate-spin">sync</span>
        <span class="text-[11px] font-code text-[#38BDF8] hidden sm:inline">Syncing</span>
      `;
    case SyncStatus.SYNCED:
      return `
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50"></span>
        <span class="text-[11px] font-code text-emerald-300 hidden sm:inline">Synced</span>
      `;
    case SyncStatus.OFFLINE:
      return `
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span class="text-[11px] font-code text-amber-300 hidden sm:inline">Offline</span>
      `;
    case SyncStatus.ERROR:
      return `
        <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
        <span class="text-[11px] font-code text-rose-300 hidden sm:inline">Sync Error</span>
      `;
    default:
      return `
        <span class="material-symbols-outlined text-[14px] text-slate-400">cloud</span>
        <span class="text-[11px] font-code text-slate-300 hidden sm:inline">Cloud</span>
      `;
  }
}

export function renderHeaderUserProfile() {
  const syncInfo = stateSyncService.getStatus();
  const isAuth = syncInfo.isAuthenticated && syncInfo.user;

  if (isAuth) {
    const email = syncInfo.user.email || 'Engineer';
    const initial = email[0].toUpperCase();
    const displayName = email.split('@')[0];

    return `
      <div class="flex items-center gap-1.5 bg-[#141C2E] border border-[#24314A] hover:border-[#6366F1]/50 rounded-md pl-2 pr-1 py-0.5 transition-all">
        <button id="header-profile-btn" class="flex items-center gap-1.5 cursor-pointer text-left py-0.5" title="Logged in as ${escapeHtml(email)} — Click to view sync details">
          <span class="w-5 h-5 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#A855F7] text-white flex items-center justify-center text-[10px] font-bold uppercase font-code shrink-0 shadow-xs">
            ${initial}
          </span>
          <span class="text-[11px] font-sans font-medium text-slate-200 hover:text-white hidden md:inline truncate max-w-[100px]">
            ${escapeHtml(displayName)}
          </span>
        </button>
        <button
          id="header-logout-btn"
          class="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors flex items-center justify-center cursor-pointer ml-0.5"
          title="Sign out"
        >
          <span class="material-symbols-outlined text-[14px]">logout</span>
        </button>
      </div>
    `;
  }

  return `
    <a
      href="#/signin"
      id="header-profile-btn"
      class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141C2E] border border-[#24314A] hover:border-[#6366F1]/50 text-slate-300 hover:text-white transition-all cursor-pointer"
      title="Sign In or Connect Account"
    >
      <span class="material-symbols-outlined text-[15px] text-[#6366F1]">account_circle</span>
      <span class="text-[11px] font-code hidden sm:inline">Sign In</span>
    </a>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

