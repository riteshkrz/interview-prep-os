import {
  state,
  setDay,
  resetState,
  startCleanSprint,
  loadDemoData,
  toggleTask,
  completeTask,
  reopenTask,
  setTaskConfidence,
  setTaskTimer,
  addTask,
  deleteTask,
  updateProblemStatus,
  updateProblemStars,
  subscribeState,
  saveState,
  updateCatalogFromRemote
} from './state.js';
import { renderDashboardSidebar } from './DashboardSidebar.js';
import { renderDashboardHeader, renderHeaderSyncStatusBadge, renderHeaderUserProfile } from './DashboardHeader.js';
import { renderDashboardProgress } from './DashboardProgress.js';
import { renderDashboardKPIs } from './DashboardKPIs.js';
import { renderDailyChecklist } from './DailyChecklist.js';
import { renderCuratedDatabase } from './CuratedDatabase.js';
import { renderReadinessRadar } from './ReadinessRadar.js';
import { renderRevisionHub } from './RevisionHub.js';
import { renderQuickActions } from './QuickActions.js';
import { renderPdfStore, renderPdfCheckoutModal, downloadProductGuide, PDF_PRODUCTS, recordPurchase } from './PdfStore.js';
import { renderProblemDetailModal } from './ProblemDetailModal.js';
import { renderDsaTrackerView } from './DsaTrackerView.js';
import { renderSystemDesignView } from './SystemDesignView.js';
import { renderRevisionHubView } from './RevisionHubView.js';
import { renderReadinessView } from './ReadinessView.js';
import {
  renderQuickSearchModal,
  renderLogEntryModal,
  renderMockDesignModal,
  renderCheatsheetModal,
  renderDrillModal
} from './DashboardModals.js';
import { renderCloudSyncModal, attachCloudSyncModalListeners } from './CloudSyncModal.js';
import { stateSyncService, SyncStatus } from '../services/stateSyncService.js';
import { catalogService } from '../services/catalogService.js';
import { signOut } from '../lib/supabase.js';

// Workspace Navigation & Layout State
let currentTab = 'daily-dashboard';

const STORAGE_SIDEBAR_COLLAPSED_KEY = 'prep_os_sidebar_collapsed';
function getInitialSidebarCollapsed() {
  // Navigation sidebar is always visible by default on dashboard load
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_SIDEBAR_COLLAPSED_KEY);
    }
  } catch (e) {}
  return false;
}
let isSidebarCollapsed = getInitialSidebarCollapsed();

// Filters for Daily Dashboard Curated Database
let currentDbTab = 'all';
let currentSearch = '';
let currentDiff = 'all';
let currentDbPage = 1;

// Filters for dedicated DSA Tracker Workspace
let dsaStatusFilter = 'all';
let dsaPatternFilter = 'all';
let dsaDiffFilter = 'all';
let dsaSearch = '';

// Filters for dedicated System Design Workspace
let sysTab = 'all';
let sysDiff = 'all';
let sysSearch = '';

let focusTimerInterval = null;
let mockTimerInterval = null;
let unsubscribeSync = null;
let unsubscribeRemote = null;

export function renderDashboardApp() {
  let mainWorkspaceContent = '';

  if (currentTab === 'dsa-tracker') {
    mainWorkspaceContent = renderDsaTrackerView(dsaStatusFilter, dsaPatternFilter, dsaDiffFilter, dsaSearch);
  } else if (currentTab === 'system-design') {
    mainWorkspaceContent = renderSystemDesignView(sysTab, sysSearch, sysDiff);
  } else if (currentTab === 'revision-hub') {
    mainWorkspaceContent = renderRevisionHubView();
  } else if (currentTab === 'readiness-assessment') {
    mainWorkspaceContent = renderReadinessView();
  } else {
    // Default: 'daily-dashboard'
    mainWorkspaceContent = `
      <div class="flex flex-col w-full gap-5 pb-16">
        <!-- 1. Top Welcome Banner & Sprint Progression Ribbon -->
        <div id="dash-progress-mount">
          ${renderDashboardProgress()}
        </div>

        <!-- 2. Daily Target & KPI Cards Row (4 Dynamic Metric Widgets) -->
        <div id="dash-kpis-mount">
          ${renderDashboardKPIs()}
        </div>

        <!-- 3. Today's Execution Checklist (Full Width) -->
        <div id="checklist-mount" class="w-full">
          ${renderDailyChecklist()}
        </div>

        <!-- 4. Core Workspace Area (Curated Database on Left alongside Readiness Radar, Revision Hub & Quick Actions on Right) -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <!-- LEFT COLUMN (col-span-7): Curated Preparation Database (height matches Quick Actions) -->
          <div class="lg:col-span-7 flex flex-col w-full h-full">
            <div id="curated-db-mount" class="h-full flex flex-col">
              ${renderCuratedDatabase(currentDbTab, currentSearch, currentDiff, currentDbPage)}
            </div>
          </div>

          <!-- RIGHT COLUMN (col-span-5): Readiness Radar, Revision Hub, Quick Actions -->
          <div class="lg:col-span-5 flex flex-col gap-5 w-full">
            <!-- a) Interview Readiness Radar (Pulled below the full-width checklist) -->
            <div id="radar-mount">
              ${renderReadinessRadar()}
            </div>

            <!-- b) Revision Hub (Spaced Repetition SM-2) -->
            <div id="revision-mount">
              ${renderRevisionHub()}
            </div>

            <!-- c) Quick-Action Launcher -->
            <div id="quick-actions-mount">
              ${renderQuickActions()}
            </div>
          </div>
        </section>

        <!-- 5. Premium Interview Cheat Sheets & Guides (Full Width at Bottom) -->
        <section id="pdf-store-mount" class="w-full">
          ${renderPdfStore()}
        </section>
      </div>
    `;
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

// Active live task timer state
let activeTaskTimer = {
  taskId: null,
  interval: null
};

function toggleTaskTimer(taskId) {
  // If this task is already running, pause it
  if (activeTaskTimer.taskId === taskId) {
    clearInterval(activeTaskTimer.interval);
    activeTaskTimer.taskId = null;
    activeTaskTimer.interval = null;
    setTaskTimer(taskId, undefined, false);
    refreshFullDashboard();
    return;
  }

  // If another task was running, pause it first
  if (activeTaskTimer.taskId) {
    clearInterval(activeTaskTimer.interval);
    setTaskTimer(activeTaskTimer.taskId, undefined, false);
  }

  // Start timer for this task
  activeTaskTimer.taskId = taskId;
  setTaskTimer(taskId, undefined, true);

  // Live timer tick without destroying DOM
  activeTaskTimer.interval = setInterval(() => {
    const dayNum = state.activeDay;
    const task = (state.dailyTasks[dayNum] || []).find(t => t.id === taskId);
    if (task) {
      task.timerSeconds = (task.timerSeconds || 0) + 1;
      const el = document.querySelector(`[data-timer-display="${taskId}"]`);
      if (el) {
        const m = Math.floor(task.timerSeconds / 60);
        const s = task.timerSeconds % 60;
        el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }
  }, 1000);

  refreshFullDashboard();
}

function stopTaskTimer(taskId) {
  if (activeTaskTimer.taskId === taskId) {
    clearInterval(activeTaskTimer.interval);
    activeTaskTimer.taskId = null;
    activeTaskTimer.interval = null;
    setTaskTimer(taskId, undefined, false);
  }
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
    } catch (e) {}

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

    // Day Stepper & Chips
    if (e.target.closest('#day-prev-btn')) {
      e.preventDefault();
      if (state.activeDay > 1) {
        setDay(state.activeDay - 1);
        refreshFullDashboard();
      }
      return;
    }

    if (e.target.closest('#day-next-btn')) {
      e.preventDefault();
      if (state.activeDay < state.totalDays) {
        setDay(state.activeDay + 1);
        refreshFullDashboard();
      }
      return;
    }

    const dayChip = e.target.closest('.day-chip, .jump-day-btn, [data-jump-day]');
    if (dayChip) {
      e.preventDefault();
      const targetDay = Number(dayChip.getAttribute('data-jump-day'));
      if (targetDay >= 1 && targetDay <= state.totalDays) {
        setDay(targetDay);
        refreshFullDashboard();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Clean Day 1 vs Sample Demo Sprint Mode Toggle
    const sprintBtn = e.target.closest('#toggle-sprint-mode-btn');
    if (sprintBtn) {
      e.preventDefault();
      const isDemo = sprintBtn.getAttribute('data-is-demo') === 'true';
      if (isDemo) {
        if (confirm('Reset to clean, uncompleted sprint (Day 1, 0 problems solved)?')) {
          startCleanSprint();
          refreshFullDashboard();
        }
      } else {
        loadDemoData();
        refreshFullDashboard();
      }
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

    // Focus Block 45-min Button
    if (e.target.closest('#focus-btn')) {
      e.preventDefault();
      toggleFocusBlock();
      return;
    }

    // Active Recall Drill Triggers
    const drillBtn = e.target.closest('.test-drill-btn, #start-review-drill-btn, #launch-recall-drill-btn, #start-full-review-btn');
    if (drillBtn) {
      e.preventDefault();
      e.stopPropagation();
      const type = drillBtn.getAttribute('data-drill') || drillBtn.getAttribute('data-topic') || (drillBtn.id === 'start-full-review-btn' ? 'top-k' : 'spaced-recall');
      openDrillModal(type);
      return;
    }

    // Open full database button -> switches to DSA Tracker workspace
    if (e.target.closest('#open-full-database-btn, #open-all-syllabus-btn')) {
      e.preventDefault();
      currentTab = 'dsa-tracker';
      refreshFullDashboard();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Curated Database Pagination Click
    const dbPageBtn = e.target.closest('.db-page-btn');
    if (dbPageBtn && !dbPageBtn.hasAttribute('disabled')) {
      e.preventDefault();
      const targetPage = parseInt(dbPageBtn.getAttribute('data-page'), 10);
      if (targetPage && !isNaN(targetPage) && targetPage !== currentDbPage) {
        currentDbPage = targetPage;
        refreshDatabaseView();
      }
      return;
    }

    // Curated Database Tab Filters (Daily Dashboard)
    const dbTabBtn = e.target.closest('[data-dbtab], .table-tab');
    if (dbTabBtn && dbTabBtn.closest('#curated-db-mount')) {
      e.preventDefault();
      currentDbTab = dbTabBtn.getAttribute('data-dbtab') || dbTabBtn.getAttribute('data-tab') || 'all';
      currentDbPage = 1;
      refreshDatabaseView();
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

    // Dedicated System Design Tab Filters
    const sysTabBtn = e.target.closest('.sys-tab');
    if (sysTabBtn) {
      e.preventDefault();
      sysTab = sysTabBtn.getAttribute('data-tab') || 'all';
      refreshWorkspaceView();
      return;
    }

    // Checklist Task Deletion
    const delTaskBtn = e.target.closest('.delete-task-btn');
    if (delTaskBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = delTaskBtn.getAttribute('data-task-id') || delTaskBtn.getAttribute('data-delete-id');
      deleteTask(id);
      refreshFullDashboard();
      return;
    }

    // 1. Checklist Confidence Star Rating click
    const taskStarBtn = e.target.closest('.task-star-btn');
    if (taskStarBtn) {
      e.preventDefault();
      e.stopPropagation();
      const taskId = taskStarBtn.getAttribute('data-task-id');
      const star = Number(taskStarBtn.getAttribute('data-star'));
      if (taskId && star) {
        setTaskConfidence(taskId, star);

        // Update star visuals in the task card immediately for snappy zero-latency feel
        const starContainer = document.querySelector(`[data-task-confidence-stars="${taskId}"]`);
        if (starContainer) {
          const buttons = starContainer.querySelectorAll('.task-star-btn');
          buttons.forEach((btn, idx) => {
            const icon = btn.querySelector('.material-symbols-outlined');
            if (icon) {
              if (idx + 1 <= star) {
                icon.className = 'material-symbols-outlined text-[19px] text-[#F59E0B]';
              } else {
                icon.className = 'material-symbols-outlined text-[19px] text-[#334155] hover:text-[#F59E0B]/70';
              }
            }
          });
        }

        // Update text label
        const label = document.getElementById(`confidence-label-${taskId}`);
        if (label) {
          label.className = 'text-[11px] font-code text-[#F59E0B] font-semibold';
          const descriptors = ['', 'Struggled / Needed Solution', 'Needed Hints', 'Solved with Effort', 'Clean Optimal Solve', 'Mastered Instantly'];
          label.textContent = `${star}/5 Stars: ${descriptors[star] || 'Rated'}`;
        }

        // Hide warning if visible
        const warning = document.getElementById(`confidence-warning-${taskId}`);
        if (warning) {
          warning.classList.add('hidden');
          warning.classList.remove('flex');
        }
      }
      return;
    }

    // 2. Complete Task Button click (validates confidence rating)
    const completeBtn = e.target.closest('.complete-task-btn');
    if (completeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const taskId = completeBtn.getAttribute('data-task-id');
      if (taskId) {
        const res = completeTask(taskId);
        if (!res.success && res.reason === 'NEEDS_CONFIDENCE') {
          // Show validation warning
          const warning = document.getElementById(`confidence-warning-${taskId}`);
          if (warning) {
            warning.classList.remove('hidden');
            warning.classList.add('flex');
          }
          const wrap = document.getElementById(`confidence-wrap-${taskId}`);
          if (wrap) {
            wrap.classList.add('ring-1', 'ring-rose-500/50', 'p-1', 'rounded');
          }
          return;
        }

        // Stop running timer on this task if any
        stopTaskTimer(taskId);

        // Refresh dashboard immediately to reflect updated KPIs & Readiness Radar
        refreshFullDashboard();
      }
      return;
    }

    // 3. Reopen Task Button click
    const reopenBtn = e.target.closest('.reopen-task-btn');
    if (reopenBtn) {
      e.preventDefault();
      e.stopPropagation();
      const taskId = reopenBtn.getAttribute('data-task-id');
      if (taskId) {
        reopenTask(taskId);
        refreshFullDashboard();
      }
      return;
    }

    // 4. Live Task Timer Button click
    const timerBtn = e.target.closest('.task-timer-btn');
    if (timerBtn) {
      e.preventDefault();
      e.stopPropagation();
      const taskId = timerBtn.getAttribute('data-task-id');
      if (taskId) {
        toggleTaskTimer(taskId);
      }
      return;
    }

    // 5. View Task Specs & Code Modal Button click
    const viewDetailsBtn = e.target.closest('.view-task-details-btn');
    if (viewDetailsBtn) {
      e.preventDefault();
      e.stopPropagation();
      const catId = viewDetailsBtn.getAttribute('data-catalog-id');
      const catType = viewDetailsBtn.getAttribute('data-catalog-type');
      if (catId) {
        const isSpec = catType === 'SYS DESIGN' || String(catId).startsWith('sd-');
        const item = isSpec 
          ? state.systemSpecs.find(x => String(x.id) === String(catId)) 
          : state.dsaProblems.find(x => String(x.id) === String(catId));
        if (item) {
          openDetailModal(item);
        }
      }
      return;
    }

    // 6. Checklist Add Task Button (with Category selection)
    if (e.target.closest('#add-task-btn')) {
      e.preventDefault();
      const addInput = document.getElementById('new-task-input');
      const catSelect = document.getElementById('new-task-cat');
      if (addInput) {
        const val = addInput.value.trim();
        const cat = catSelect ? catSelect.value : 'DSA';
        if (val) {
          addTask(val, cat);
          addInput.value = '';
          refreshFullDashboard();
        }
      }
      return;
    }

    // PDF Guides & Cheat Sheets Store Actions
    const pdfBtn = e.target.closest('.open-pdf-checkout-btn');
    if (pdfBtn) {
      e.preventDefault();
      const prodId = pdfBtn.getAttribute('data-product-id');
      const prod = PDF_PRODUCTS.find(p => p.id === prodId);
      if (prod) {
        openModal(renderPdfCheckoutModal(prod), 'close-pdf-modal-btn');
      }
      return;
    }

    const buyPdfBtn = e.target.closest('#confirm-buy-pdf-btn');
    if (buyPdfBtn) {
      e.preventDefault();
      const prodId = buyPdfBtn.getAttribute('data-product-id');
      const prod = PDF_PRODUCTS.find(p => p.id === prodId);
      if (prod) {
        recordPurchase(prodId);
        // Re-render modal to unlocked state with Download button
        const mount = document.getElementById('modal-mount');
        if (mount) {
          mount.innerHTML = renderPdfCheckoutModal(prod);
          const closeBtn = document.getElementById('close-pdf-modal-btn');
          if (closeBtn) closeBtn.onclick = () => { mount.innerHTML = ''; };
        }
        // Refresh PDF store card in the dashboard
        const storeMount = document.getElementById('pdf-store-mount');
        if (storeMount) {
          storeMount.innerHTML = renderPdfStore();
        }
      }
      return;
    }

    const downloadPdfBtn = e.target.closest('#download-purchased-pdf-btn');
    if (downloadPdfBtn) {
      e.preventDefault();
      const prodId = downloadPdfBtn.getAttribute('data-product-id');
      const prod = PDF_PRODUCTS.find(p => p.id === prodId);
      if (prod) {
        downloadProductGuide(prod);
      }
      return;
    }

    // Star Rating click across all views
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
    const openItem = e.target.closest('[data-open-problem], .open-spec-modal-btn, .db-item-row');
    if (openItem) {
      if (e.target.closest('.status-select, .dsa-status-select, .spec-status-select, .star, .dsa-star-btn, .spec-star-btn, select, button.delete-task-btn, input')) return;
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
  };

  // 3. Global Delegated Change Handler (Checkboxes, Status Selects, Dropdowns)
  root.onchange = (e) => {
    // Checklist item toggle checkbox
    if (e.target.matches('.task-checkbox')) {
      const id = e.target.getAttribute('data-task-id');
      toggleTask(id);
      refreshFullDashboard();
      return;
    }

    // Status dropdowns across all views (Curated DB, DSA Tracker, System Design)
    if (e.target.matches('.status-select, .dsa-status-select, .spec-status-select')) {
      const id = e.target.getAttribute('data-item-id') || e.target.getAttribute('data-problem-id') || e.target.getAttribute('data-spec-id');
      updateProblemStatus(id, e.target.value);
      refreshFullDashboard();
      return;
    }

    // Curated DB Difficulty filter
    if (e.target.id === 'db-diff-filter') {
      currentDiff = e.target.value;
      currentDbPage = 1;
      refreshDatabaseView();
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

    // System Design Difficulty filter
    if (e.target.id === 'sys-diff-filter') {
      sysDiff = e.target.value;
      refreshWorkspaceView();
      return;
    }
  };

  // Attach workspace input & key listeners
  attachWorkspaceListeners();
}

function attachWorkspaceListeners() {
  // Input handler for Checklist Enter key
  const addInput = document.getElementById('new-task-input');
  if (addInput) {
    addInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const val = addInput.value.trim();
        if (val) {
          addTask(val, 'DSA');
          addInput.value = '';
          refreshFullDashboard();
        }
      }
    };
  }

  // Live Search Input for Curated DB
  const dbSearchInput = document.getElementById('db-search-input');
  if (dbSearchInput) {
    dbSearchInput.oninput = (e) => {
      currentSearch = e.target.value;
      currentDbPage = 1;
      const cursorPos = e.target.selectionStart;
      refreshDatabaseView();
      const nextInput = document.getElementById('db-search-input');
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(cursorPos, cursorPos);
      }
    };
  }

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

  // Live Search Input for System Design Workspace
  const sysSearchInput = document.getElementById('sys-search-input');
  if (sysSearchInput) {
    sysSearchInput.oninput = (e) => {
      sysSearch = e.target.value;
      const cursorPos = e.target.selectionStart;
      refreshWorkspaceView();
      const nextInput = document.getElementById('sys-search-input');
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
          Start typing to search 100 problems, 20 system design specs, and the 45-day curriculum.
        </div>
      `;
      return;
    }

    const matchedDSA = state.dsaProblems.filter(p => p.title.toLowerCase().includes(q) || p.pattern.toLowerCase().includes(q)).slice(0, 4);
    const matchedSpecs = state.systemSpecs.filter(s => s.title.toLowerCase().includes(q) || (s.pattern && s.pattern.toLowerCase().includes(q)) || (s.domain && s.domain.toLowerCase().includes(q))).slice(0, 3);
    const matchedDays = Object.values(state.curriculum).filter(c => c.topic.toLowerCase().includes(q) || c.objective.toLowerCase().includes(q)).slice(0, 3);

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
        setDay(day);
        document.getElementById('modal-mount').innerHTML = '';
        currentTab = 'daily-dashboard';
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
        // Add to active day's checklist
        addTask(title, cat);
        // Also prepend to state.dsaProblems
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
    // 1. Sign out of Supabase Auth
    await signOut();
  } catch (err) {
    console.warn('[Auth] Supabase signOut error:', err);
  }

  // 2. Clear local session tokens & sync storage
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

  // 3. Update StateSyncService in memory
  if (stateSyncService) {
    stateSyncService.currentUser = null;
    stateSyncService.status = SyncStatus.UNAUTHENTICATED;
    if (typeof stateSyncService._teardownRealtimeSubscription === 'function') {
      stateSyncService._teardownRealtimeSubscription();
    }
    stateSyncService._notifySubscribers();
  }

  // 4. Redirect immediately to the Sign In page
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

function openDrillModal(drillType) {
  openModal(renderDrillModal(drillType), 'close-drill-modal-btn');

  const revealBtn = document.getElementById('reveal-drill-answer-btn');
  const answerBox = document.getElementById('drill-answer-box');
  const ratingBtns = document.getElementById('drill-rating-btns');

  if (revealBtn) {
    revealBtn.addEventListener('click', () => {
      revealBtn.classList.add('hidden');
      answerBox?.classList.remove('hidden');
      ratingBtns?.classList.remove('hidden');
    });
  }

  ratingBtns?.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('modal-mount').innerHTML = '';
    });
  });
}

function toggleFocusBlock() {
  const btn = document.getElementById('focus-btn');
  const text = document.getElementById('focus-btn-text');
  if (!btn || !text) return;

  if (focusTimerInterval) {
    clearInterval(focusTimerInterval);
    focusTimerInterval = null;
    btn.classList.remove('bg-secondary');
    btn.classList.add('bg-[#6366F1]');
    text.textContent = 'Start 45-min Focus Block';
  } else {
    let secondsLeft = 45 * 60;
    btn.classList.remove('bg-[#6366F1]');
    btn.classList.add('bg-secondary');
    text.textContent = '45:00 Active';

    focusTimerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(focusTimerInterval);
        focusTimerInterval = null;
        btn.classList.remove('bg-secondary');
        btn.classList.add('bg-[#6366F1]');
        text.textContent = 'Focus Completed!';
        alert('45-minute Focus Block complete! Take a 5-minute break.');
      } else {
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        text.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} Active`;
      }
    }, 1000);
  }
}

function refreshKPIs() {
  const kpisMount = document.getElementById('dash-kpis-mount');
  if (kpisMount) kpisMount.innerHTML = renderDashboardKPIs();
}

function refreshDatabaseView() {
  const dbMount = document.getElementById('curated-db-mount');
  if (dbMount) dbMount.innerHTML = renderCuratedDatabase(currentDbTab, currentSearch, currentDiff, currentDbPage);
  attachWorkspaceListeners();
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
  } else if (currentTab === 'system-design') {
    html = renderSystemDesignView(sysTab, sysSearch, sysDiff);
  } else if (currentTab === 'revision-hub') {
    html = renderRevisionHubView();
  } else if (currentTab === 'readiness-assessment') {
    html = renderReadinessView();
  } else {
    refreshDatabaseView();
    return;
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
