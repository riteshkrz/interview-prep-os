/**
 * 45-Day Interview Prep OS - Cloud State Sync & Authentication Modal
 * Provides interactive UI for Supabase configuration, sign in/sign up, manual sync triggers,
 * and JSON state export/import.
 */

import { stateSyncService, SyncStatus } from '../../services/stateSyncService.js';
import { signIn, signUp, signOut, isSupabaseConfigured } from '../../lib/supabase.js';

export function renderCloudSyncModal() {
  const syncInfo = stateSyncService.getStatus();
  const configured = isSupabaseConfigured();
  const authenticated = syncInfo.isAuthenticated;
  const userEmail = syncInfo.user?.email || '';
  const lastSyncStr = syncInfo.lastSyncedAt
    ? new Date(syncInfo.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Never';

  // Status Badge UI
  let statusBadgeHtml = '';
  switch (syncInfo.status) {
    case SyncStatus.UNCONFIGURED:
      statusBadgeHtml = `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-code">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Offline Local Mode (Credentials not set)</span>
        </div>`;
      break;
    case SyncStatus.UNAUTHENTICATED:
      statusBadgeHtml = `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-code">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <span>Cloud Ready • Sign in to sync</span>
        </div>`;
      break;
    case SyncStatus.SYNCING:
      statusBadgeHtml = `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-code">
          <span class="material-symbols-outlined text-[14px] animate-spin">sync</span>
          <span>Syncing with Cloud...</span>
        </div>`;
      break;
    case SyncStatus.SYNCED:
      statusBadgeHtml = `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-code">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50"></span>
          <span>Cloud Synced</span>
        </div>`;
      break;
    case SyncStatus.OFFLINE:
      statusBadgeHtml = `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-code">
          <span class="material-symbols-outlined text-[14px]">wifi_off</span>
          <span>Offline • Queued Locally</span>
        </div>`;
      break;
    case SyncStatus.ERROR:
      statusBadgeHtml = `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-code">
          <span class="material-symbols-outlined text-[14px]">error</span>
          <span>Sync Alert: ${escapeHtml(syncInfo.error || 'Connection Failed')}</span>
        </div>`;
      break;
    default:
      statusBadgeHtml = `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-code">
          <span>${escapeHtml(syncInfo.status)}</span>
        </div>`;
  }

  return `
    <div id="cloud-sync-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-[#0F1626] rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#24314A] flex flex-col gap-5 text-[#F8FAFC]">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded bg-[#6366F1]/20 border border-[#6366F1]/50 text-[#818CF8] flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">cloud_sync</span>
            </div>
            <div>
              <h3 class="font-sans text-[15px] font-semibold text-white tracking-tight">Cloud State Synchronization</h3>
              <p class="text-[11px] text-[#94A3B8] font-sans">Multi-device sync powered by Supabase PostgreSQL</p>
            </div>
          </div>
          <button id="close-sync-modal-btn" class="p-1 rounded text-[#94A3B8] hover:text-white hover:bg-[#141C2E] transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Sync Status Overview Banner -->
        <div class="bg-[#141C2E] rounded-lg p-3.5 border border-[#24314A] flex flex-col gap-2.5">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] text-[#94A3B8] uppercase tracking-wider font-semibold">Engine Status</span>
            ${statusBadgeHtml}
          </div>

          <div class="grid grid-cols-2 gap-2 text-[12px] pt-2 border-t border-[#24314A]/50">
            <div>
              <span class="text-[#64748B] block text-[11px]">Last Cloud Sync:</span>
              <span class="font-code text-[#F8FAFC] font-medium">${lastSyncStr}</span>
            </div>
            <div>
              <span class="text-[#64748B] block text-[11px]">Local Changes:</span>
              <span class="font-code ${syncInfo.pendingSync ? 'text-amber-400' : 'text-emerald-400'} font-medium">
                ${syncInfo.pendingSync ? '● Pending sync' : '✓ Up to date'}
              </span>
            </div>
          </div>
        </div>

        <!-- Dynamic Content Section -->
        ${!configured ? renderUnconfiguredGuide() : authenticated ? renderAuthenticatedView(userEmail) : renderAuthForms()}

        <!-- Data Portability Footer -->
        <div class="pt-3 border-t border-[#24314A] flex items-center justify-between gap-2 flex-wrap">
          <span class="font-code text-[11px] text-[#64748B]">Local Backup:</span>
          <div class="flex items-center gap-2">
            <button id="export-json-btn" class="px-2.5 py-1 rounded bg-[#182238] border border-[#24314A] text-[11px] font-code text-[#38BDF8] hover:bg-[#202D4A] transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">download</span>
              <span>Export JSON</span>
            </button>
            <label for="import-json-input" class="px-2.5 py-1 rounded bg-[#182238] border border-[#24314A] text-[11px] font-code text-[#94A3B8] hover:text-white hover:bg-[#202D4A] transition-colors flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[14px]">upload</span>
              <span>Import</span>
              <input type="file" id="import-json-input" accept=".json,application/json" class="hidden" />
            </label>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderUnconfiguredGuide() {
  return `
    <div class="flex flex-col gap-3">
      <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[12px] text-amber-200">
        <div class="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">info</span>
          Supabase Credentials Required for Cloud Sync
        </div>
        Your progress is safely preserved in browser local storage. To sync across multiple devices or backup to the cloud, configure Supabase credentials.
      </div>

      <div class="bg-[#0A0E17] rounded-lg p-3 border border-[#24314A] font-code text-[11px] text-[#94A3B8] flex flex-col gap-2">
        <span class="text-[#38BDF8] font-semibold">Quick Setup Steps:</span>
        <ol class="list-decimal list-inside space-y-1 text-slate-300">
          <li>Create a free database project at <a href="https://supabase.com" target="_blank" class="text-[#6366F1] underline">supabase.com</a></li>
          <li>Run the SQL migration script from <span class="text-white font-mono">supabase/schema.sql</span></li>
          <li>Create a <span class="text-white font-mono">.env</span> file in the project root:</li>
        </ol>
        <div class="bg-[#141C2E] p-2.5 rounded border border-[#24314A] text-[#F8FAFC] select-all overflow-x-auto text-[10.5px]">
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        </div>
      </div>
    </div>
  `;
}

function renderAuthenticatedView(email) {
  return `
    <div class="flex flex-col gap-3.5">
      <div class="p-3.5 bg-[#141C2E] border border-[#24314A] rounded-lg flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold font-code text-[12px]">
            ${escapeHtml(email ? email[0].toUpperCase() : 'U')}
          </div>
          <div>
            <div class="text-[13px] font-medium text-white">${escapeHtml(email)}</div>
            <span class="text-[11px] font-code text-emerald-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Cloud Sync Session
            </span>
          </div>
        </div>
        <button id="auth-signout-btn" class="px-2.5 py-1 rounded bg-[#182238] border border-[#24314A] hover:bg-[#202D4A] text-slate-300 hover:text-white text-[11px] font-code transition-colors">
          Sign Out
        </button>
      </div>

      <div class="flex gap-2">
        <button id="manual-sync-now-btn" class="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:brightness-110 text-white font-medium text-[13px] transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#6366F1]/30">
          <span class="material-symbols-outlined text-[16px]">sync</span>
          <span id="sync-button-text">Sync with Cloud Now</span>
        </button>
      </div>
    </div>
  `;
}

function renderAuthForms() {
  return `
    <div class="flex flex-col gap-3">
      <!-- Tabs -->
      <div class="flex border-b border-[#24314A] gap-4 text-[13px]">
        <button id="tab-btn-signin" class="pb-2 border-b-2 border-[#6366F1] text-white font-medium">Sign In</button>
        <button id="tab-btn-signup" class="pb-2 border-b-2 border-transparent text-[#94A3B8] hover:text-white">Create Account</button>
      </div>

      <!-- Sign In Form -->
      <form id="supabase-auth-form" class="flex flex-col gap-3">
        <div id="auth-alert-box" class="hidden p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-sans"></div>

        <div>
          <label class="block font-code text-[10.5px] uppercase tracking-wider text-[#94A3B8] mb-1">Email Address</label>
          <input id="auth-email-input" type="email" required placeholder="engineer@example.com" class="w-full bg-[#141C2E] border border-[#24314A] rounded-lg px-3 py-2 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]" />
        </div>

        <div>
          <label class="block font-code text-[10.5px] uppercase tracking-wider text-[#94A3B8] mb-1">Password</label>
          <input id="auth-password-input" type="password" required minlength="6" placeholder="••••••••" class="w-full bg-[#141C2E] border border-[#24314A] rounded-lg px-3 py-2 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]" />
        </div>

        <button type="submit" id="auth-submit-btn" class="w-full py-2 px-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium text-[13px] transition-colors flex items-center justify-center gap-2 mt-1 shadow-sm shadow-[#6366F1]/30">
          <span id="auth-submit-label">Sign In & Sync</span>
        </button>
      </form>
    </div>
  `;
}

/**
 * Attach listeners to the rendered modal elements
 */
export function attachCloudSyncModalListeners(onClose) {
  let isSignUpMode = false;

  const closeBtn = document.getElementById('close-sync-modal-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', onClose);
  }

  // Backdrop click
  const modalEl = document.getElementById('cloud-sync-modal');
  if (modalEl) {
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) onClose();
    });
  }

  // Manual Sync Now Button
  const syncBtn = document.getElementById('manual-sync-now-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      const label = document.getElementById('sync-button-text');
      const origText = label ? label.innerText : 'Sync';
      if (label) label.innerText = 'Syncing...';
      syncBtn.disabled = true;
      syncBtn.classList.add('opacity-70');

      await stateSyncService.syncNow();

      if (label) label.innerText = 'Sync Completed!';
      setTimeout(() => {
        if (label) label.innerText = origText;
        syncBtn.disabled = false;
        syncBtn.classList.remove('opacity-70');
        onClose();
      }, 700);
    });
  }

  // Sign Out Button
  const signOutBtn = document.getElementById('auth-signout-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      signOutBtn.disabled = true;
      try {
        await signOut();
      } catch (e) {
        console.warn('[Auth] SignOut error:', e);
      }
      onClose();
      if (window.location.hash === '#/signin' || window.location.hash.startsWith('#/signin?')) {
        window.location.reload();
      } else {
        window.location.hash = '#/signin?signedout=true';
      }
    });
  }

  // Tabs Toggle (Sign In vs Create Account)
  const tabSignIn = document.getElementById('tab-btn-signin');
  const tabSignUp = document.getElementById('tab-btn-signup');
  const submitLabel = document.getElementById('auth-submit-label');

  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener('click', () => {
      isSignUpMode = false;
      tabSignIn.className = 'pb-2 border-b-2 border-[#6366F1] text-white font-medium';
      tabSignUp.className = 'pb-2 border-b-2 border-transparent text-[#94A3B8] hover:text-white';
      if (submitLabel) submitLabel.innerText = 'Sign In & Sync';
    });

    tabSignUp.addEventListener('click', () => {
      isSignUpMode = true;
      tabSignUp.className = 'pb-2 border-b-2 border-[#6366F1] text-white font-medium';
      tabSignIn.className = 'pb-2 border-b-2 border-transparent text-[#94A3B8] hover:text-white';
      if (submitLabel) submitLabel.innerText = 'Create Account & Start Sync';
    });
  }

  // Auth Form Submit
  const form = document.getElementById('supabase-auth-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email-input')?.value.trim();
      const password = document.getElementById('auth-password-input')?.value;
      const alertBox = document.getElementById('auth-alert-box');
      const submitBtn = document.getElementById('auth-submit-btn');

      if (!email || !password) return;

      if (submitBtn) submitBtn.disabled = true;
      if (alertBox) alertBox.classList.add('hidden');

      try {
        if (isSignUpMode) {
          const { error } = await signUp(email, password);
          if (error) throw error;
          alert('Account created! If email confirmation is enabled in your Supabase project, check your inbox.');
          onClose();
        } else {
          const { error } = await signIn(email, password);
          if (error) throw error;
          onClose();
        }
      } catch (err) {
        if (alertBox) {
          alertBox.innerText = err.message || 'Authentication failed. Please verify credentials.';
          alertBox.classList.remove('hidden');
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Export JSON backup
  const exportBtn = document.getElementById('export-json-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      stateSyncService.exportBackup();
    });
  }

  // Import JSON backup
  const importInput = document.getElementById('import-json-input');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (text && typeof text === 'string') {
          const res = stateSyncService.importBackup(text);
          if (res.success) {
            alert('State restored successfully!');
            onClose();
            window.location.reload();
          } else {
            alert('Failed to import state file: ' + res.error);
          }
        }
      };
      reader.readAsText(file);
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
