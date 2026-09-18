import {
  state,
  setDay,
  updateProblemStatus,
  updateProblemStars,
  subscribeState,
  saveState,
  updateCatalogFromRemote,
  toggleSysDesignRoadmapDay
} from './state.js';
import { renderDashboardSidebar } from './DashboardSidebar.js';
import { renderDashboardHeader, renderHeaderSyncStatusBadge, renderHeaderUserProfile } from './DashboardHeader.js';
import { renderProblemDetailModal } from './ProblemDetailModal.js';
import { renderDsaTrackerView } from './DsaTrackerView.js';
import { renderSystemDesignRoadmapView, renderTopicDetail, getActiveRoadmapDay, setActiveRoadmapDay } from './SystemDesignRoadmapView.js';
import { SYSTEM_DESIGN_TOPICS_BY_DAY } from './systemDesignTopicsData.js';
import {
  renderQuickSearchModal,
  renderLogEntryModal,
  renderMockDesignModal,
  renderCheatsheetModal
} from './DashboardModals.js';
import { renderCloudSyncModal, attachCloudSyncModalListeners } from './CloudSyncModal.js';
import { stateSyncService, SyncStatus } from '../services/stateSyncService.js';
import { catalogService } from '../services/catalogService.js';
import { signOut } from '../lib/supabase.js';

// Workspace Navigation & Layout State (Default: 6-Week System Design Roadmap)
let currentTab = 'system-design-roadmap';

const STORAGE_SIDEBAR_COLLAPSED_KEY = 'prep_os_sidebar_collapsed';
function getInitialSidebarCollapsed() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_SIDEBAR_COLLAPSED_KEY);
    }
  } catch (e) { }
  return false;
}
let isSidebarCollapsed = getInitialSidebarCollapsed();

// Filters for dedicated DSA Tracker Workspace
let dsaStatusFilter = 'all';
let dsaPatternFilter = 'all';
let dsaDiffFilter = 'all';
let dsaSearch = '';

// Filters for 6-Week System Design Roadmap Workspace
let sysRoadmapWeek = 'today';
let sysRoadmapStatus = 'all';
let sysRoadmapSearch = '';
let sysRoadmapReadiness = 'all';

let mockTimerInterval = null;
let unsubscribeSync = null;
let unsubscribeRemote = null;

export function renderDashboardApp() {
  let mainWorkspaceContent = '';

  if (currentTab === 'dsa-tracker') {
    mainWorkspaceContent = renderDsaTrackerView(dsaStatusFilter, dsaPatternFilter, dsaDiffFilter, dsaSearch);
  } else {
    currentTab = 'system-design-roadmap';
    mainWorkspaceContent = renderSystemDesignRoadmapView(sysRoadmapWeek, sysRoadmapStatus, sysRoadmapSearch, sysRoadmapReadiness);
  }

  return `
    <div class="dashboard-root bg-[#0A0E17] text-[#F8FAFC] min-h-screen font-body text-[13px] antialiased selection:bg-[#6366F1] selection:text-white">
      <!-- Fixed Left Sidebar -->
      ${renderDashboardSidebar(currentTab, isSidebarCollapsed)}

      <!-- Main Layout with Left Padding for Sidebar on Desktop (w-60 = pl-60) -->
      <div id="dashboard-main-layout" class="${isSidebarCollapsed ? 'pl-0 sidebar-collapsed-layout' : 'pl-0 md:pl-60'} flex flex-col min-h-screen transition-all duration-300">
        <!-- Fixed Top Navigation Header -->
        ${renderDashboardHeader(currentTab, isSidebarCollapsed)}

        <!-- Main Workspace Content -->
        <main class="w-full pt-14 px-4 lg:px-6 max-w-[1280px] mx-auto min-h-screen">
          <div id="main-workspace-mount" class="py-3">
            ${mainWorkspaceContent}
          </div>
        </main>
      </div>

      <!-- Modals Container Mount -->
      <div id="modal-mount"></div>
    </div>
  `;
}

let isDashboardServicesInitialized = false;

function initDashboardServices() {
  if (isDashboardServicesInitialized) return;
  isDashboardServicesInitialized = true;

  // Global ⌘K / Ctrl+K keyboard shortcut for Quick Search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openQuickSearch();
    }
  });

  // Initialize StateSyncService (Supabase cloud sync)
  stateSyncService.init();

  if (unsubscribeSync) unsubscribeSync();
  unsubscribeSync = stateSyncService.subscribe(() => {
    const trigger = document.getElementById('cloud-sync-trigger');
    if (trigger) {
      trigger.innerHTML = renderHeaderSyncStatusBadge();
    }
    const userMount = document.getElementById('header-user-mount');
    if (userMount) {
      userMount.innerHTML = renderHeaderUserProfile();
    }
  });

  if (unsubscribeRemote) unsubscribeRemote();
  unsubscribeRemote = subscribeState((_updatedState, meta) => {
    if (meta && meta.isRemote && !meta.isCatalog) {
      refreshFullDashboard();
    }
  });

  // Initialize CatalogService (fetches Supabase dsa_problems, system_design_specs, user_problem_progress)
  catalogService.init({
    onCatalogUpdate: (payload) => {
      updateCatalogFromRemote(payload);
      refreshWorkspaceView();
    }
  });
}

export function attachDashboardListeners() {
  const root = document.querySelector('.dashboard-root');
  if (!root) return;

  // Run singleton service initialization once
  initDashboardServices();

  // 1. Sidebar Collapse/Expand Controls (Desktop & Mobile)
  const setSidebarState = (collapsed) => {
    isSidebarCollapsed = collapsed;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_SIDEBAR_COLLAPSED_KEY, String(collapsed));
      }
    } catch (e) { }

    const sidebar = document.getElementById('dash-sidebar');
    const backdrop = document.getElementById('dash-sidebar-backdrop');
    const mainLayout = document.getElementById('dashboard-main-layout');
    const header = document.getElementById('dash-header') || document.querySelector('header');
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (sidebar) {
      if (collapsed) {
        sidebar.classList.add('sidebar-collapsed');
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.remove('md:translate-x-0');
      } else {
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('sidebar-open');
        sidebar.classList.add('md:translate-x-0');
      }
    }

    if (mainLayout) {
      if (collapsed) {
        mainLayout.classList.add('sidebar-collapsed-layout');
        mainLayout.classList.remove('md:pl-60');
        mainLayout.classList.add('pl-0');
      } else {
        mainLayout.classList.remove('sidebar-collapsed-layout');
        mainLayout.classList.remove('pl-0');
        mainLayout.classList.add('md:pl-60');
      }
    }

    if (header) {
      if (collapsed) {
        header.classList.add('sidebar-collapsed-header');
        header.classList.remove('md:left-60');
        header.classList.add('left-0');
      } else {
        header.classList.remove('sidebar-collapsed-header');
        header.classList.remove('left-0');
        header.classList.add('md:left-60');
      }
    }

    if (openSidebarBtn) {
      openSidebarBtn.title = collapsed ? 'Open navigation sidebar (⌘B)' : 'Collapse sidebar (⌘B)';
      const icon = openSidebarBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = collapsed ? 'left_panel_open' : 'left_panel_close';
      }
      const label = openSidebarBtn.querySelector('.sidebar-toggle-label');
      if (label) {
        if (collapsed) {
          label.classList.remove('hidden');
          label.classList.add('inline');
          openSidebarBtn.classList.add('border', 'border-[#38BDF8]/40', 'bg-[#141C2E]', 'text-[#38BDF8]');
        } else {
          label.classList.add('hidden');
          label.classList.remove('inline');
          openSidebarBtn.classList.remove('border', 'border-[#38BDF8]/40', 'bg-[#141C2E]', 'text-[#38BDF8]');
        }
      }
    }

    if (backdrop) {
      if (isMobile && !collapsed) {
        backdrop.classList.remove('hidden');
      } else {
        backdrop.classList.add('hidden');
      }
    }
  };

  // Expose toggle function on window so shortcut always calls current closure
  window._togglePrepOsSidebar = () => {
    setSidebarState(!isSidebarCollapsed);
  };

  // ⌘B / Ctrl+B shortcut to toggle sidebar
  if (!window._prepOsSidebarShortcutBound) {
    window._prepOsSidebarShortcutBound = true;
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (typeof window._togglePrepOsSidebar === 'function') {
          window._togglePrepOsSidebar();
        }
      }
    });
  }

  // 2. Global Delegated Click Handler on dashboard root
  root.onclick = (e) => {
    // Sidebar close button click
    const closeBtn = e.target.closest('#close-sidebar-btn, [data-action="close-sidebar"]');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      setSidebarState(true);
      return;
    }

    // Sidebar open / toggle button click
    const openBtn = e.target.closest('#open-sidebar-btn, [data-action="toggle-sidebar"]');
    if (openBtn) {
      e.preventDefault();
      e.stopPropagation();
      setSidebarState(!isSidebarCollapsed);
      return;
    }

    // Mobile backdrop click closes sidebar
    const backdropEl = e.target.closest('#dash-sidebar-backdrop');
    if (backdropEl) {
      e.preventDefault();
      e.stopPropagation();
      setSidebarState(true);
      return;
    }

    // Navigation items (Sidebar tabs or in-page workspace links)
    const navItem = e.target.closest('[data-nav-target], .sidebar-nav-item');
    if (navItem && navItem.getAttribute('data-nav-target')) {
      e.preventDefault();
      const target = navItem.getAttribute('data-nav-target');
      currentTab = target;
      if (window.innerWidth < 768) setSidebarState(true);
      refreshFullDashboard();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Pattern Library / Cheatsheets Modal
    if (e.target.closest('#open-cheatsheets-nav-btn, #quick-action-cheatsheet-btn, #settings-tune-btn')) {
      e.preventDefault();
      if (window.innerWidth < 768) setSidebarState(true);
      openModal(renderCheatsheetModal(), 'close-cheatsheet-modal-btn');
      return;
    }

    // Mock Design Notes Modal
    if (e.target.closest('#open-mock-notes-nav-btn, #quick-action-mock-btn')) {
      e.preventDefault();
      if (window.innerWidth < 768) setSidebarState(true);
      openMockModal();
      return;
    }

    // Cloud Sync Modal Trigger & Header Profile Trigger
    if (e.target.closest('#cloud-sync-trigger, #header-profile-btn')) {
      e.preventDefault();
      openCloudSyncModal();
      return;
    }

    // Header Logout Trigger (Signs out of Supabase & clears local session)
    if (e.target.closest('#header-logout-btn')) {
      e.preventDefault();
      handleHeaderSignOut();
      return;
    }

    // Quick Search Trigger
    if (e.target.closest('#quick-search-trigger')) {
      e.preventDefault();
      openQuickSearch();
      return;
    }

    // Quick Log Entry Trigger
    if (e.target.closest('#quick-log-btn, #quick-action-log-btn')) {
      e.preventDefault();
      openLogModal();
      return;
    }

    // Dedicated DSA Tracker Tab Filters
    const dsaTabBtn = e.target.closest('.dsa-tab');
    if (dsaTabBtn) {
      e.preventDefault();
      dsaStatusFilter = dsaTabBtn.getAttribute('data-status') || 'all';
      refreshWorkspaceView();
      return;
    }

    // Star Rating click across problems and specs
    const starBtn = e.target.closest('.star, .dsa-star-btn, .spec-star-btn');
    if (starBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = starBtn.getAttribute('data-item-id') || starBtn.getAttribute('data-problem-id') || starBtn.getAttribute('data-spec-id');
      const rating = Number(starBtn.getAttribute('data-star'));
      updateProblemStars(id, rating);
      refreshFullDashboard();
      return;
    }

    // Open Problem or Spec Detail Modal
    const openItem = e.target.closest('[data-open-problem], .open-spec-modal-btn');
    if (openItem) {
      if (e.target.closest('.status-select, .dsa-status-select, .spec-status-select, .star, .dsa-star-btn, .spec-star-btn, select, button, input')) return;
      const id = openItem.getAttribute('data-open-problem') || openItem.getAttribute('data-item-id');
      if (id) {
        const isSpec = String(id).startsWith('sd-') || openItem.getAttribute('data-is-spec') === 'true';
        const item = isSpec ? state.systemSpecs.find(x => String(x.id) === String(id)) : state.dsaProblems.find(x => String(x.id) === String(id));
        if (item) {
          openDetailModal(item);
        }
      }
      return;
    }

    // 6-Week System Design Roadmap Week filter
    const weekBtn = e.target.closest('.sys-roadmap-filter-week, .roadmap-week-chip');
    if (weekBtn) {
      e.preventDefault();
      const w = weekBtn.getAttribute('data-week') || weekBtn.getAttribute('data-filter-week');
      sysRoadmapWeek = w || 'all';
      refreshWorkspaceView();
      return;
    }

    // System Design Roadmap Readiness Index chip / badge click
    const readinessBtn = e.target.closest('.sys-roadmap-filter-readiness, .sys-roadmap-readiness-chip');
    if (readinessBtn) {
      e.preventDefault();
      const rId = readinessBtn.getAttribute('data-readiness-filter') || readinessBtn.getAttribute('data-readiness-id');
      if (rId) {
        if (sysRoadmapReadiness === rId) {
          sysRoadmapReadiness = 'all'; // toggle off
        } else {
          sysRoadmapReadiness = rId;
          if (sysRoadmapWeek === 'today') {
            sysRoadmapWeek = 'all';
          }
        }
        refreshWorkspaceView();
        return;
      }
    }

    // Start the Day button in small roadmap cards (directs to complete big card for that day)
    const startDayBtn = e.target.closest('.start-roadmap-day-btn');
    if (startDayBtn) {
      e.preventDefault();
      const day = parseInt(startDayBtn.getAttribute('data-day'), 10);
      if (!isNaN(day) && day >= 1 && day <= 42) {
        setActiveRoadmapDay(day);
        sysRoadmapWeek = 'today';
        refreshWorkspaceView();
        setTimeout(() => {
          const card = document.getElementById('today-system-design-card');
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 30);
      }
      return;
    }

    // System Design Roadmap Topic Tab click (Switches displayed topic content within day card)
    const topicTab = e.target.closest('.roadmap-topic-tab');
    if (topicTab) {
      e.preventDefault();
      e.stopPropagation();
      const day = topicTab.getAttribute('data-day');
      const topicIdx = parseInt(topicTab.getAttribute('data-topic-idx'), 10);
      const card = topicTab.closest('.roadmap-day-card');
      if (card && !isNaN(topicIdx)) {
        // Update active styling on all sibling tabs
        const allTabs = card.querySelectorAll('.roadmap-topic-tab');
        allTabs.forEach(t => {
          t.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'shadow-xs', 'active');
          t.classList.add('bg-[#0F1626]', 'text-slate-400', 'border-[#24314A]');
        });
        topicTab.classList.remove('bg-[#0F1626]', 'text-slate-400', 'border-[#24314A]');
        topicTab.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'shadow-xs', 'active');

        // Dynamically update the content container with the selected topic
        const contentEl = card.querySelector(`#roadmap-topic-content-${day}`);
        if (contentEl) {
          const topics = SYSTEM_DESIGN_TOPICS_BY_DAY[day] || [];
          if (topics[topicIdx]) {
            contentEl.innerHTML = renderTopicDetail(topics[topicIdx]);
          }
        }
      }
      return;
    }

    // Course Mastery Checklist item toggle (0.1 How to Use This Course)
    const checkItem = e.target.closest('.course-mastery-checkbox');
    if (checkItem) {
      const idx = checkItem.getAttribute('data-idx');
      let saved = {};
      try {
        const raw = localStorage.getItem('sysdesign_mastery_checklist');
        if (raw) saved = JSON.parse(raw);
      } catch (err) {}
      saved[idx] = checkItem.checked;
      localStorage.setItem('sysdesign_mastery_checklist', JSON.stringify(saved));

      const parentLabel = checkItem.closest('.mastery-check-item');
      if (parentLabel) {
        if (checkItem.checked) {
          parentLabel.classList.add('border-emerald-500/50', 'bg-emerald-950/15', 'text-emerald-200');
          parentLabel.classList.remove('border-[#24314A]', 'text-slate-300');
        } else {
          parentLabel.classList.remove('border-emerald-500/50', 'bg-emerald-950/15', 'text-emerald-200');
          parentLabel.classList.add('border-[#24314A]', 'text-slate-300');
        }
      }
      return;
    }

    // 0.2 The 7-Step Interview Framework Checklist item toggle
    const sevenStepCheck = e.target.closest('.sevenstep-checkbox');
    if (sevenStepCheck) {
      const idx = sevenStepCheck.getAttribute('data-idx');
      let saved = {};
      try {
        const raw = localStorage.getItem('sysdesign_7step_checklist');
        if (raw) saved = JSON.parse(raw);
      } catch (err) {}
      saved[idx] = sevenStepCheck.checked;
      localStorage.setItem('sysdesign_7step_checklist', JSON.stringify(saved));

      const parentLabel = sevenStepCheck.closest('.sevenstep-check-item');
      if (parentLabel) {
        if (sevenStepCheck.checked) {
          parentLabel.classList.add('border-emerald-500/50', 'bg-emerald-950/15', 'text-emerald-200');
          parentLabel.classList.remove('border-[#24314A]', 'text-slate-300');
        } else {
          parentLabel.classList.remove('border-emerald-500/50', 'bg-emerald-950/15', 'text-emerald-200');
          parentLabel.classList.add('border-[#24314A]', 'text-slate-300');
        }
      }
      return;
    }

    // Reset 7-Step Checklist
    const reset7StepBtn = e.target.closest('.reset-7step-checklist-btn');
    if (reset7StepBtn) {
      e.preventDefault();
      try {
        localStorage.removeItem('sysdesign_7step_checklist');
      } catch (err) {}
      const card = reset7StepBtn.closest('.roadmap-topic-content') || document;
      card.querySelectorAll('.sevenstep-checkbox').forEach(cb => {
        cb.checked = false;
        const parentLabel = cb.closest('.sevenstep-check-item');
        if (parentLabel) {
          parentLabel.classList.remove('border-emerald-500/50', 'bg-emerald-950/15', 'text-emerald-200');
          parentLabel.classList.add('border-[#24314A]', 'text-slate-300');
        }
      });
      return;
    }

    // Copy Trade-off Formula Button
    const copyFormulaBtn = e.target.closest('.copy-tradeoff-formula-btn');
    if (copyFormulaBtn) {
      e.preventDefault();
      const formula = copyFormulaBtn.getAttribute('data-formula') || 'I chose X over Y because of Z; if the requirement changed to W I would revisit it.';
      navigator.clipboard.writeText(formula).then(() => {
        const origHtml = copyFormulaBtn.innerHTML;
        copyFormulaBtn.innerHTML = `
          <span class="material-symbols-outlined text-[14px] text-emerald-400">check</span>
          <span class="text-emerald-300">Copied!</span>
        `;
        setTimeout(() => {
          copyFormulaBtn.innerHTML = origHtml;
        }, 2000);
      }).catch(() => {});
      return;
    }

    // 0.3 Back-of-the-Envelope Estimation Q&A Accordion toggle
    const estQaToggle = e.target.closest('.est-qa-toggle');
    if (estQaToggle) {
      e.preventDefault();
      const targetId = estQaToggle.getAttribute('data-target');
      const body = document.getElementById(`est-qa-${targetId}`);
      const icon = estQaToggle.querySelector('.est-qa-icon');
      if (body) {
        const isHidden = body.classList.contains('hidden');
        if (isHidden) {
          body.classList.remove('hidden');
          if (icon) icon.textContent = 'expand_less';
        } else {
          body.classList.add('hidden');
          if (icon) icon.textContent = 'expand_more';
        }
      }
      return;
    }

    // Toggle Roadmap Day via button (Complete / Reopen Day)
    const toggleDayBtn = e.target.closest('.toggle-roadmap-day-btn');
    if (toggleDayBtn) {
      e.preventDefault();
      e.stopPropagation();
      const day = toggleDayBtn.getAttribute('data-day');
      if (day) {
        toggleSysDesignRoadmapDay(day);
        refreshWorkspaceView();
      }
      return;
    }

    // Prev / Next day buttons for Today's System Design Task
    const roadmapPrevBtn = e.target.closest('.sys-roadmap-prev-day-btn');
    if (roadmapPrevBtn) {
      e.preventDefault();
      const cur = getActiveRoadmapDay();
      if (cur > 1) {
        setActiveRoadmapDay(cur - 1);
        refreshWorkspaceView();
      }
      return;
    }

    const roadmapNextBtn = e.target.closest('.sys-roadmap-next-day-btn, .sys-roadmap-jump-day');
    if (roadmapNextBtn) {
      e.preventDefault();
      const target = roadmapNextBtn.getAttribute('data-day')
        ? parseInt(roadmapNextBtn.getAttribute('data-day'), 10)
        : getActiveRoadmapDay() + 1;
      if (target >= 1 && target <= 42) {
        setActiveRoadmapDay(target);
        refreshWorkspaceView();
      }
      return;
    }
  };

  // 3. Global Delegated Change Handler (Checkboxes, Status Selects, Dropdowns)
  root.onchange = (e) => {
    // 0.3 Estimation Scratchpad live calculation
    if (e.target.matches('#est-dau-input, #est-actions-input, #est-multiplier-input')) {
      updateEstimationScratchpad();
      return;
    }

    // 6-Week System Design Roadmap jump day select
    if (e.target.matches('.sys-roadmap-jump-select')) {
      const day = parseInt(e.target.value, 10);
      if (!isNaN(day)) {
        setActiveRoadmapDay(day);
        refreshWorkspaceView();
      }
      return;
    }

    // 6-Week System Design Roadmap day toggle
    if (e.target.matches('.sys-roadmap-toggle-checkbox')) {
      const day = e.target.getAttribute('data-roadmap-day');
      toggleSysDesignRoadmapDay(day);
      refreshWorkspaceView();
      return;
    }

    // 6-Week System Design Roadmap status select
    if (e.target.id === 'sys-roadmap-status-select') {
      sysRoadmapStatus = e.target.value;
      refreshWorkspaceView();
      return;
    }

    // System Design Roadmap readiness index select
    if (e.target.id === 'sys-roadmap-readiness-select') {
      sysRoadmapReadiness = e.target.value;
      if (sysRoadmapReadiness !== 'all' && sysRoadmapWeek === 'today') {
        sysRoadmapWeek = 'all';
      }
      refreshWorkspaceView();
      return;
    }

    // Status dropdowns for DSA Problems
    if (e.target.matches('.status-select, .dsa-status-select')) {
      const id = e.target.getAttribute('data-item-id') || e.target.getAttribute('data-problem-id');
      updateProblemStatus(id, e.target.value);
      refreshFullDashboard();
      return;
    }

    // DSA Tracker Pattern filter
    if (e.target.id === 'dsa-pattern-filter') {
      dsaPatternFilter = e.target.value;
      refreshWorkspaceView();
      return;
    }

    // DSA Tracker Difficulty filter
    if (e.target.id === 'dsa-diff-filter') {
      dsaDiffFilter = e.target.value;
      refreshWorkspaceView();
      return;
    }
  };

  // 4. Global Delegated Input Handler (Live scratchpad arithmetic)
  root.oninput = (e) => {
    if (e.target.matches('#est-dau-input, #est-actions-input, #est-multiplier-input')) {
      updateEstimationScratchpad();
      return;
    }
  };

  // Attach workspace input & key listeners
  attachWorkspaceListeners();
}

function attachWorkspaceListeners() {
  // Live Search Input for DSA Tracker Workspace
  const dsaSearchInput = document.getElementById('dsa-search-input');
  if (dsaSearchInput) {
    dsaSearchInput.oninput = (e) => {
      dsaSearch = e.target.value;
      const cursorPos = e.target.selectionStart;
      refreshWorkspaceView();
      const nextInput = document.getElementById('dsa-search-input');
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(cursorPos, cursorPos);
      }
    };
  }

  // Live Search Input for 6-Week System Design Roadmap
  const sysRoadmapSearchInput = document.getElementById('sys-roadmap-search');
  if (sysRoadmapSearchInput) {
    sysRoadmapSearchInput.oninput = (e) => {
      sysRoadmapSearch = e.target.value;
      const cursorPos = e.target.selectionStart;
      refreshWorkspaceView();
      const nextInput = document.getElementById('sys-roadmap-search');
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(cursorPos, cursorPos);
      }
    };
  }
}

function openModal(modalHtml, closeBtnId) {
  const mount = document.getElementById('modal-mount');
  if (!mount) return;
  mount.innerHTML = modalHtml;

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      close();
    }
  };

  const close = () => {
    mount.innerHTML = '';
    document.removeEventListener('keydown', handleEsc);
  };

  const closeBtn = document.getElementById(closeBtnId);
  if (closeBtn) closeBtn.onclick = close;

  const backdrop = mount.firstElementChild;
  if (backdrop) {
    backdrop.onclick = (e) => {
      if (e.target === backdrop) close();
    };
  }

  document.addEventListener('keydown', handleEsc);
}

function openDetailModal(item) {
  const mount = document.getElementById('modal-mount');
  if (!mount) return;
  mount.innerHTML = renderProblemDetailModal(item);

  const close = () => {
    mount.innerHTML = '';
    document.removeEventListener('keydown', handleEsc);
  };
  const closeBtn = document.getElementById('close-spec-modal-btn');
  const bottomCloseBtn = document.getElementById('close-spec-modal-bottom-btn');
  const backdrop = document.getElementById('spec-detail-modal');

  if (closeBtn) closeBtn.onclick = close;
  if (bottomCloseBtn) bottomCloseBtn.onclick = close;
  if (backdrop) backdrop.onclick = (e) => { if (e.target === backdrop) close(); };

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      close();
    }
  };
  document.addEventListener('keydown', handleEsc);
}

function openQuickSearch() {
  openModal(renderQuickSearchModal(), 'close-quick-search-modal-btn');

  const searchInput = document.getElementById('modal-search-input');
  const resultsContainer = document.getElementById('modal-search-results');
  if (!searchInput || !resultsContainer) return;

  const renderResults = (q) => {
    q = (q || '').toLowerCase().trim();
    if (!q) {
      resultsContainer.innerHTML = `
        <div class="p-3 text-slate-400 text-[12px]">
          Start typing to search 100 problems, 20 system design specs, and roadmap topics.
        </div>
      `;
      return;
    }

    const matchedDSA = state.dsaProblems.filter(p => p.title.toLowerCase().includes(q) || (p.pattern && p.pattern.toLowerCase().includes(q))).slice(0, 4);
    const matchedSpecs = state.systemSpecs.filter(s => s.title.toLowerCase().includes(q) || (s.pattern && s.pattern.toLowerCase().includes(q)) || (s.domain && s.domain.toLowerCase().includes(q))).slice(0, 3);
    const matchedDays = Object.values(state.curriculum || {}).filter(c => (c.topic && c.topic.toLowerCase().includes(q)) || (c.objective && c.objective.toLowerCase().includes(q))).slice(0, 3);

    if (matchedDSA.length === 0 && matchedSpecs.length === 0 && matchedDays.length === 0) {
      resultsContainer.innerHTML = `<div class="p-4 text-center text-slate-400 text-[13px]">No matches found for "${escapeHtml(q)}"</div>`;
      return;
    }

    let html = '';
    if (matchedSpecs.length > 0) {
      html += `<div class="px-2 py-1 font-code text-[10px] text-slate-400 uppercase tracking-wider">System Design Specs</div>`;
      matchedSpecs.forEach(s => {
        html += `
          <div class="search-result-item flex items-center justify-between p-2 rounded-lg hover:bg-[#182238] cursor-pointer transition-colors" data-spec-id="${s.id}">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#38BDF8] text-[16px]">schema</span>
              <span class="text-[13px] font-medium text-slate-200">${escapeHtml(s.title)}</span>
            </div>
            <span class="font-code text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">SPEC</span>
          </div>
        `;
      });
    }

    if (matchedDSA.length > 0) {
      html += `<div class="px-2 py-1 font-code text-[10px] text-slate-400 uppercase tracking-wider mt-1">DSA Problems</div>`;
      matchedDSA.forEach(p => {
        html += `
          <div class="search-result-item flex items-center justify-between p-2 rounded-lg hover:bg-[#182238] cursor-pointer transition-colors" data-dsa-id="${p.id}">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400 text-[16px]">terminal</span>
              <span class="text-[13px] font-medium text-slate-200">${escapeHtml(p.title)}</span>
            </div>
            <span class="font-code text-[10px] text-slate-400">${escapeHtml(p.pattern || p.category || '')}</span>
          </div>
        `;
      });
    }

    if (matchedDays.length > 0) {
      html += `<div class="px-2 py-1 font-code text-[10px] text-slate-400 uppercase tracking-wider mt-1">Curriculum Days</div>`;
      matchedDays.forEach(d => {
        html += `
          <div class="search-result-item flex items-center justify-between p-2 rounded-lg hover:bg-[#182238] cursor-pointer transition-colors" data-day-num="${d.day}">
            <div class="flex items-center gap-2">
              <span class="font-code text-[#38BDF8] font-bold text-[11px]">Day ${d.day}</span>
              <span class="text-[13px] font-medium text-slate-200">${escapeHtml(d.topic)}</span>
            </div>
            <span class="font-code text-[10px] text-slate-400">Open Day</span>
          </div>
        `;
      });
    }

    resultsContainer.innerHTML = html;

    // Attach click triggers on search items
    resultsContainer.querySelectorAll('[data-spec-id]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-spec-id');
        const spec = state.systemSpecs.find(x => x.id === id);
        if (spec) {
          openDetailModal(spec);
        }
      });
    });

    resultsContainer.querySelectorAll('[data-dsa-id]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-dsa-id');
        const prob = state.dsaProblems.find(x => String(x.id) === String(id));
        if (prob) {
          openDetailModal(prob);
        }
      });
    });

    resultsContainer.querySelectorAll('[data-day-num]').forEach(el => {
      el.addEventListener('click', () => {
        const day = Number(el.getAttribute('data-day-num'));
        setActiveRoadmapDay(day);
        document.getElementById('modal-mount').innerHTML = '';
        currentTab = 'system-design-roadmap';
        sysRoadmapWeek = 'today';
        refreshFullDashboard();
      });
    });
  };

  renderResults('');
  searchInput.addEventListener('input', (e) => renderResults(e.target.value));
}

function openLogModal() {
  openModal(renderLogEntryModal(), 'close-log-modal-btn');
  const cancelBtn = document.getElementById('cancel-log-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', () => { document.getElementById('modal-mount').innerHTML = ''; });

  const form = document.getElementById('log-entry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('log-title-input')?.value.trim();
      const cat = document.getElementById('log-category-select')?.value || 'DSA';
      const diff = document.getElementById('log-difficulty-select')?.value || 'Medium';
      const pattern = document.getElementById('log-pattern-input')?.value.trim() || 'General';

      if (title) {
        const newId = Date.now();
        state.dsaProblems.unshift({
          id: newId,
          title,
          pattern,
          difficulty: diff,
          confidence: 4,
          status: 'Mastered'
        });
        saveState();
        document.getElementById('modal-mount').innerHTML = '';
        refreshFullDashboard();
      }
    });
  }
}

function openCloudSyncModal() {
  const mount = document.getElementById('modal-mount');
  if (!mount) return;
  mount.innerHTML = renderCloudSyncModal();
  const close = () => { mount.innerHTML = ''; };
  attachCloudSyncModalListeners(close);

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

async function handleHeaderSignOut() {
  const btn = document.getElementById('header-logout-btn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-50');
  }

  try {
    await signOut();
  } catch (err) {
    console.warn('[Auth] Supabase signOut error:', err);
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('prep_os_pending_sync');
      localStorage.removeItem('prep_os_last_synced_at');
      localStorage.removeItem('prep_os_last_local_modified');
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase.auth'))) {
          localStorage.removeItem(key);
        }
      }
    }
  } catch (e) {
    console.warn('[Auth] LocalStorage clean error:', e);
  }

  if (stateSyncService) {
    stateSyncService.currentUser = null;
    stateSyncService.status = SyncStatus.UNAUTHENTICATED;
    if (typeof stateSyncService._teardownRealtimeSubscription === 'function') {
      stateSyncService._teardownRealtimeSubscription();
    }
    stateSyncService._notifySubscribers();
  }

  if (window.location.hash === '#/signin' || window.location.hash.startsWith('#/signin?')) {
    window.location.reload();
  } else {
    window.location.hash = '#/signin?signedout=true';
  }
}

function openMockModal() {
  openModal(renderMockDesignModal(), 'close-mock-modal-btn');

  let timeLeft = 45 * 60;
  let isRunning = false;
  const display = document.getElementById('mock-timer-display');
  const toggleBtn = document.getElementById('mock-timer-toggle-btn');
  const resetTimerBtn = document.getElementById('mock-timer-reset-btn');

  const updateDisplay = () => {
    if (!display) return;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    display.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isRunning) {
        clearInterval(mockTimerInterval);
        isRunning = false;
        toggleBtn.textContent = 'Resume Clock';
        toggleBtn.classList.remove('bg-secondary');
      } else {
        isRunning = true;
        toggleBtn.textContent = 'Pause Clock';
        toggleBtn.classList.add('bg-secondary');
        mockTimerInterval = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
          } else {
            clearInterval(mockTimerInterval);
            isRunning = false;
            alert('45-minute System Design simulation complete!');
          }
        }, 1000);
      }
    });
  }

  if (resetTimerBtn) {
    resetTimerBtn.addEventListener('click', () => {
      clearInterval(mockTimerInterval);
      isRunning = false;
      timeLeft = 45 * 60;
      updateDisplay();
      if (toggleBtn) {
        toggleBtn.textContent = 'Start Clock';
        toggleBtn.classList.remove('bg-secondary');
      }
    });
  }
}

function refreshWorkspaceView() {
  const mount = document.getElementById('main-workspace-mount');
  if (!mount) {
    refreshFullDashboard();
    return;
  }

  let html = '';
  if (currentTab === 'dsa-tracker') {
    html = renderDsaTrackerView(dsaStatusFilter, dsaPatternFilter, dsaDiffFilter, dsaSearch);
  } else {
    currentTab = 'system-design-roadmap';
    html = renderSystemDesignRoadmapView(sysRoadmapWeek, sysRoadmapStatus, sysRoadmapSearch, sysRoadmapReadiness);
  }

  mount.innerHTML = html;
  attachWorkspaceListeners();
}

function refreshFullDashboard() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = renderDashboardApp();
  attachDashboardListeners();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function updateEstimationScratchpad() {
  const dauInput = document.getElementById('est-dau-input');
  const actionsInput = document.getElementById('est-actions-input');
  const multInput = document.getElementById('est-multiplier-input');
  const outReq = document.getElementById('est-out-requests');
  const outAvg = document.getElementById('est-out-avg-qps');
  const outPeak = document.getElementById('est-out-peak-qps');
  const outRec = document.getElementById('est-out-recommendation');

  if (!dauInput || !actionsInput || !multInput) return;
  const dau = parseFloat(dauInput.value) || 0;
  const actions = parseFloat(actionsInput.value) || 0;
  const mult = parseFloat(multInput.value) || 2;

  const totalReqM = dau * actions;
  const avgQps = Math.round((totalReqM * 1000000) / 86400);
  const peakQps = Math.round(avgQps * mult);

  if (outReq) outReq.textContent = totalReqM >= 1000 ? `${(totalReqM / 1000).toFixed(1)} B / day` : `${totalReqM.toLocaleString()} M / day`;
  if (outAvg) outAvg.textContent = `~${avgQps.toLocaleString()} QPS`;
  if (outPeak) outPeak.textContent = `~${peakQps.toLocaleString()} QPS`;
  if (outRec) {
    if (peakQps < 10000) {
      outRec.textContent = '1 Primary DB fits writes';
      outRec.className = 'font-code text-[11px] font-bold text-emerald-300 leading-snug';
    } else if (peakQps < 50000) {
      outRec.textContent = 'Primary + Read Replicas';
      outRec.className = 'font-code text-[11px] font-bold text-cyan-300 leading-snug';
    } else {
      outRec.textContent = 'Sharded DB / Kafka needed';
      outRec.className = 'font-code text-[11px] font-bold text-amber-300 leading-snug';
    }
  }
}
