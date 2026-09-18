import { state } from '../state.js';

export function renderDashboardSidebar(activeTab = 'system-design-roadmap', isCollapsed = false) {
  const completedRoadmapDays = state.sysDesignRoadmap ? Object.values(state.sysDesignRoadmap).filter(d => d && d.completed).length : 0;
  const completedPct = Math.round((completedRoadmapDays / 42) * 100);

  return `
    <aside id="dash-sidebar" class="dash-sidebar fixed left-0 top-0 h-full w-60 bg-[#0F1626] border-r border-[#24314A] z-50 flex flex-col justify-between p-4 transition-transform duration-300 ${isCollapsed ? 'sidebar-collapsed -translate-x-full' : '-translate-x-full md:translate-x-0'}">
      <div class="flex flex-col gap-5">
        <!-- App Header -->
        <div class="flex items-center justify-between px-1 pb-3.5 border-b border-[#24314A]/40">
          <div class="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Prep OS Logo" class="w-6 h-6 rounded object-contain shrink-0" />
            <span class="font-sans text-[14px] text-[#F8FAFC] font-semibold tracking-tight">Prep OS</span>
          </div>
          <!-- Close / Collapse button (works on desktop and mobile) -->
          <button id="close-sidebar-btn" data-action="close-sidebar" class="p-1 rounded hover:bg-[#141C2E] text-[#94A3B8] hover:text-white transition-colors cursor-pointer flex items-center justify-center" title="Close sidebar (⌘B)">
            <span class="material-symbols-outlined text-[18px]">left_panel_close</span>
          </button>
        </div>

        <!-- Navigation: Workspaces -->
        <div class="flex flex-col gap-1">
          <span class="px-2 font-code text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">Workspaces</span>
          <nav class="flex flex-col gap-0.5">
            <a href="#/dashboard" data-nav-target="system-design-roadmap" class="sidebar-nav-item flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all ${activeTab === 'system-design-roadmap' ? 'bg-[#182238] border border-[#24314A] text-[#F8FAFC] font-medium shadow-xs' : 'text-[#94A3B8] hover:bg-[#141C2E] hover:text-[#F8FAFC]'}">
              <span class="material-symbols-outlined text-[16px] ${activeTab === 'system-design-roadmap' ? 'text-[#38BDF8]' : 'text-[#64748B]'}">alt_route</span>
              <span>6-Week SysDesign</span>
              <span class="ml-auto text-[9px] font-code px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold">6W</span>
            </a>
            <a href="#/dashboard" data-nav-target="dsa-tracker" class="sidebar-nav-item flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all ${activeTab === 'dsa-tracker' ? 'bg-[#182238] border border-[#24314A] text-[#F8FAFC] font-medium shadow-xs' : 'text-[#94A3B8] hover:bg-[#141C2E] hover:text-[#F8FAFC]'}">
              <span class="material-symbols-outlined text-[16px] ${activeTab === 'dsa-tracker' ? 'text-[#38BDF8]' : 'text-[#64748B]'}">terminal</span>
              <span>DSA Tracker</span>
              <span class="ml-auto text-[9px] font-code px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold">100</span>
            </a>
            <a href="#/blog" class="sidebar-nav-item flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-[#94A3B8] hover:bg-[#141C2E] hover:text-[#F8FAFC]">
              <span class="material-symbols-outlined text-[16px] text-[#64748B]">article</span>
              <span>Engineering Blog</span>
              <span class="ml-auto text-[9px] font-code px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold">NEW</span>
            </a>
          </nav>
        </div>

        <!-- Navigation: Collections -->
        <div class="flex flex-col gap-1">
          <span class="px-2 font-code text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">Collections</span>
          <nav class="flex flex-col gap-0.5">
            <button id="open-cheatsheets-nav-btn" class="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[#94A3B8] hover:bg-[#141C2E] hover:text-[#F8FAFC] transition-colors w-full text-left">
              <span class="material-symbols-outlined text-[16px] text-[#64748B]">folder_open</span>
              <span>Pattern Library</span>
            </button>
            <button id="open-mock-notes-nav-btn" class="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[#94A3B8] hover:bg-[#141C2E] hover:text-[#F8FAFC] transition-colors w-full text-left">
              <span class="material-symbols-outlined text-[16px] text-[#64748B]">description</span>
              <span>Mock Notes</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Sidebar Bottom Progress Card -->
      <div class="flex flex-col gap-2.5">
        <div class="p-3 bg-[#141C2E] border border-[#24314A] rounded-md flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <span class="font-code text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">Roadmap Progress</span>
            <span class="font-code text-[11px] text-[#38BDF8] font-bold">${completedPct}%</span>
          </div>
          <div class="w-full h-1.5 bg-[#0A0E17] rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-[#38BDF8] to-[#6366F1] rounded-full transition-all duration-500" style="width: ${completedPct}%"></div>
          </div>
          <span class="font-code text-[10px] text-[#64748B]">${completedRoadmapDays} of 42 Days Completed</span>
        </div>

        <a href="#/" class="flex items-center gap-2 px-2.5 py-1.5 rounded text-[#94A3B8] hover:bg-[#141C2E] hover:text-[#F8FAFC] text-[12px] font-sans transition-colors">
          <span class="material-symbols-outlined text-[15px]">arrow_back</span>
          <span>Back to Landing Page</span>
        </a>
      </div>
    </aside>

    <!-- Mobile Overlay Backdrop -->
    <div id="dash-sidebar-backdrop" class="fixed inset-0 bg-black/60 z-40 md:hidden hidden backdrop-blur-xs"></div>
  `;
}
