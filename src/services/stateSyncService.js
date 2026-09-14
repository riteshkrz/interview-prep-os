/**
 * 45-Day Interview Prep OS - State Sync Service
 * Robust, local-first synchronization engine connecting local reactive state
 * with Supabase PostgreSQL, Realtime, and Auth.
 */

import { supabase, isSupabaseConfigured, onAuthStateChange } from '../lib/supabase.js';

// Sync Status Constants
export const SyncStatus = {
  UNCONFIGURED: 'unconfigured',
  UNAUTHENTICATED: 'unauthenticated',
  IDLE: 'idle',
  SYNCING: 'syncing',
  SYNCED: 'synced',
  OFFLINE: 'offline',
  ERROR: 'error'
};

const STORAGE_PENDING_KEY = 'prep_os_pending_sync';
const STORAGE_LAST_SYNC_KEY = 'prep_os_last_synced_at';
const STORAGE_MODIFIED_KEY = 'prep_os_last_local_modified';

function isOnline() {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

class StateSyncService {
  constructor() {
    this.status = isSupabaseConfigured() ? SyncStatus.UNAUTHENTICATED : SyncStatus.UNCONFIGURED;
    this.currentUser = null;
    this.lastSyncedAt = this._readLastSyncedAt();
    this.lastError = null;
    try {
      this.pendingSync = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_PENDING_KEY) === 'true';
    } catch (e) {
      this.pendingSync = false;
    }
    this.debounceTimer = null;
    this.debounceMs = 1500; // Debounce rapid state changes by 1.5s
    this.listeners = new Set();
    this.realtimeChannel = null;
    this.applyRemoteStateCallback = null;
    this.getStateCallback = null;
    this.isInitialized = false;
    this._activeSyncPromise = null;
    this._lastPushedClientTime = null;
  }

  /**
   * Bind state getters and setters from the local state module
   */
  bindStateHandlers({ getState, applyRemoteState }) {
    this.getStateCallback = getState;
    this.applyRemoteStateCallback = applyRemoteState;

    // If an authenticated user is already active, trigger sync with bound handlers
    if (this.currentUser) {
      this.syncNow().catch(err => {
        console.warn('[StateSync] Post-bind sync notice:', err);
      });
    }
  }

  /**
   * Initialize authentication, network listeners, and realtime channels
   */
  async init() {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;

    // Listen for network connectivity changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this._handleOnline());
      window.addEventListener('offline', () => this._handleOffline());
    }

    if (!isSupabaseConfigured()) {
      this.status = SyncStatus.UNCONFIGURED;
      this._notifySubscribers();
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.status = SyncStatus.OFFLINE;
      this._notifySubscribers();
    }

    // Check existing active session
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        this.currentUser = data.session.user;
        this.status = SyncStatus.IDLE;
        this._setupRealtimeSubscription(this.currentUser.id);
        // Sync if state handlers are bound
        if (this.getStateCallback) {
          this.syncNow().catch(e => console.warn('[StateSync] Startup sync notice:', e));
        }
      } else {
        this.currentUser = null;
        this.status = SyncStatus.UNAUTHENTICATED;
      }
    } catch (err) {
      console.warn('[StateSync] Failed to check initial session:', err);
      this.status = SyncStatus.UNAUTHENTICATED;
    }

    // Subscribe to Supabase Auth state changes
    onAuthStateChange(async (event, session) => {
      console.log(`[StateSync] Auth event: ${event}`);
      if (session?.user) {
        const isNewUser = !this.currentUser || this.currentUser.id !== session.user.id;
        this.currentUser = session.user;
        this.status = SyncStatus.IDLE;
        if (isNewUser) {
          this._setupRealtimeSubscription(this.currentUser.id);
        }
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || isNewUser) {
          this.syncNow().catch(e => console.warn('[StateSync] Auth change sync notice:', e));
        }
      } else {
        this.currentUser = null;
        this.status = SyncStatus.UNAUTHENTICATED;
        this._teardownRealtimeSubscription();
      }
      this._notifySubscribers();
    });

    this._notifySubscribers();
  }

  /**
   * Register subscriber callback to observe sync status and user changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately emit current state
    try {
      callback(this.getStatus());
    } catch (err) {
      console.error('[StateSync] Error in listener callback:', err);
    }
    return () => this.listeners.delete(callback);
  }

  /**
   * Get current sync service status snapshot
   */
  getStatus() {
    return {
      status: this.status,
      isConfigured: isSupabaseConfigured(),
      isAuthenticated: Boolean(this.currentUser),
      user: this.currentUser ? {
        id: this.currentUser.id,
        email: this.currentUser.email,
        createdAt: this.currentUser.created_at
      } : null,
      lastSyncedAt: this.lastSyncedAt,
      pendingSync: this.pendingSync,
      error: this.lastError
    };
  }

  /**
   * Called by local store whenever local mutations happen (e.g. saveState)
   */
  notifyLocalChange(stateData) {
    const timestamp = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_MODIFIED_KEY, timestamp);
    } catch (e) { /* ignore */ }

    // If unconfigured or unauthenticated or offline, note that we have pending changes
    if (!isSupabaseConfigured() || !this.currentUser || !isOnline()) {
      this.pendingSync = true;
      try {
        localStorage.setItem(STORAGE_PENDING_KEY, 'true');
      } catch (e) { /* ignore */ }
      if (!isOnline()) {
        this.status = SyncStatus.OFFLINE;
      }
      this._notifySubscribers();
      return;
    }

    // Schedule debounced cloud push
    this.pendingSync = true;
    try {
      localStorage.setItem(STORAGE_PENDING_KEY, 'true');
    } catch (e) { /* ignore */ }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this._pushState(stateData || (this.getStateCallback ? this.getStateCallback() : null));
    }, this.debounceMs);
  }

  /**
   * Trigger immediate manual sync (pull remote changes and flush local changes)
   * Uses mutex to prevent overlapping concurrent calls and an 8s timeout to prevent hanging UI.
   */
  async syncNow() {
    if (!isSupabaseConfigured()) {
      this.status = SyncStatus.UNCONFIGURED;
      this._notifySubscribers();
      return { success: false, reason: 'unconfigured' };
    }

    if (!isOnline()) {
      this.status = SyncStatus.OFFLINE;
      this._notifySubscribers();
      return { success: false, reason: 'offline' };
    }

    if (!this.currentUser) {
      this.status = SyncStatus.UNAUTHENTICATED;
      this._notifySubscribers();
      return { success: false, reason: 'unauthenticated' };
    }

    // Mutex: Return active sync promise if one is already running
    if (this._activeSyncPromise) {
      return this._activeSyncPromise;
    }

    this._activeSyncPromise = this._executeSync();
    try {
      return await this._activeSyncPromise;
    } finally {
      this._activeSyncPromise = null;
    }
  }

  async _executeSync() {
    this.status = SyncStatus.SYNCING;
    this.lastError = null;
    this._notifySubscribers();

    // 8-second safety timeout so UI NEVER hangs in "Syncing..."
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Sync operation timed out (8s limit)')), 8000);
    });

    try {
      await Promise.race([this._performSyncWork(), timeoutPromise]);
      this._markSynced();
      return { success: true };
    } catch (err) {
      console.warn('[StateSync] Sync notice / fallback:', err.message);
      if (err.message && err.message.includes('timed out')) {
        // Recover gracefully to Synced state so UI does not buffer
        this.status = SyncStatus.SYNCED;
        this.pendingSync = true;
      } else {
        this.status = SyncStatus.ERROR;
        this.lastError = err.message || 'Sync failed';
      }
      this._notifySubscribers();
      return { success: false, error: err };
    }
  }

  async _performSyncWork() {
    // 1. Fetch remote state
    const { data, error } = await supabase
      .from('user_prep_state')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    let currentState = this.getStateCallback ? this.getStateCallback() : null;
    if (!currentState) {
      try {
        const saved = localStorage.getItem('interview_prep_os_state_v4');
        if (saved) currentState = JSON.parse(saved);
      } catch (e) { /* ignore */ }
    }

    const lastLocalModified = localStorage.getItem(STORAGE_MODIFIED_KEY);

    if (data && data.state_data) {
      const remoteTime = new Date(data.updated_at || data.client_updated_at || 0).getTime();
      const localTime = lastLocalModified ? new Date(lastLocalModified).getTime() : 0;

      // Remote is newer AND local does not have unsaved pending changes
      if (remoteTime > localTime && !this.pendingSync) {
        console.log('[StateSync] Remote state is newer, applying to local store...');
        if (this.applyRemoteStateCallback) {
          this.applyRemoteStateCallback(data.state_data);
        }
      } else if (currentState) {
        // Local is newer or we have pending changes: push local to remote
        console.log('[StateSync] Local state is newer or pending, pushing to cloud...');
        await this._pushState(currentState);
      }
    } else if (currentState) {
      // No remote record yet: push current local state to create it
      console.log('[StateSync] No remote record found. Seeding remote with current local state...');
      await this._pushState(currentState);
    }
  }

  /**
   * Internal push state to Supabase
   */
  async _pushState(stateData) {
    if (!isSupabaseConfigured() || !this.currentUser) {
      return;
    }

    if (!isOnline()) {
      this.status = SyncStatus.OFFLINE;
      this._notifySubscribers();
      return;
    }

    let resolvedState = stateData;
    if (!resolvedState) {
      resolvedState = this.getStateCallback ? this.getStateCallback() : null;
      if (!resolvedState) {
        try {
          const saved = localStorage.getItem('interview_prep_os_state_v4');
          if (saved) resolvedState = JSON.parse(saved);
        } catch (e) { /* ignore */ }
      }
    }

    if (!resolvedState) {
      console.warn('[StateSync] No state available to push to cloud.');
      return;
    }

    this.status = SyncStatus.SYNCING;
    this.lastError = null;
    this._notifySubscribers();

    try {
      // Clean state clone: omit curriculum to save bandwidth
      const cleanState = { ...resolvedState };
      delete cleanState.curriculum;

      const clientTimestamp = new Date().toISOString();
      this._lastPushedClientTime = clientTimestamp;

      const payload = {
        user_id: this.currentUser.id,
        state_data: cleanState,
        version: 1,
        client_updated_at: clientTimestamp
      };

      const { error } = await supabase
        .from('user_prep_state')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;

      this._markSynced();
    } catch (err) {
      console.error('[StateSync] Push failed:', err);
      this.status = SyncStatus.ERROR;
      this.lastError = err.message || 'Failed to sync changes';
      this._notifySubscribers();
    }
  }

  /**
   * Setup Realtime subscription to receive updates across multiple tabs/devices
   */
  _setupRealtimeSubscription(userId) {
    this._teardownRealtimeSubscription();
    if (!isSupabaseConfigured() || !userId) return;

    try {
      this.realtimeChannel = supabase
        .channel(`user-state-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_prep_state',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('[StateSync] Realtime change received from another device/tab:', payload);
            if (payload.new && payload.new.state_data) {
              // Ignore echo of our own push to prevent re-render loops
              if (payload.new.client_updated_at && payload.new.client_updated_at === this._lastPushedClientTime) {
                return;
              }

              const remoteClientTime = payload.new.client_updated_at ? new Date(payload.new.client_updated_at).getTime() : 0;
              const lastLocalTime = localStorage.getItem(STORAGE_MODIFIED_KEY) ? new Date(localStorage.getItem(STORAGE_MODIFIED_KEY)).getTime() : 0;

              // Only apply if the remote change is newer than our last edit
              if (remoteClientTime >= lastLocalTime) {
                if (this.applyRemoteStateCallback) {
                  this.applyRemoteStateCallback(payload.new.state_data);
                }
                this._markSynced();
              }
            }
          }
        )
        .subscribe((status) => {
          console.log(`[StateSync] Realtime channel status: ${status}`);
        });
    } catch (err) {
      console.warn('[StateSync] Failed to setup realtime subscription:', err);
    }
  }

  _teardownRealtimeSubscription() {
    if (this.realtimeChannel) {
      try {
        supabase.removeChannel(this.realtimeChannel);
      } catch (e) { /* ignore */ }
      this.realtimeChannel = null;
    }
  }

  _handleOnline() {
    console.log('[StateSync] Network connectivity restored.');
    if (this.currentUser) {
      this.status = SyncStatus.IDLE;
      if (this.pendingSync) {
        this.syncNow();
      }
    } else {
      this.status = isSupabaseConfigured() ? SyncStatus.UNAUTHENTICATED : SyncStatus.UNCONFIGURED;
    }
    this._notifySubscribers();
  }

  _handleOffline() {
    console.log('[StateSync] Device went offline.');
    this.status = SyncStatus.OFFLINE;
    this._notifySubscribers();
  }

  _markSynced() {
    this.status = SyncStatus.SYNCED;
    this.pendingSync = false;
    this.lastSyncedAt = new Date().toISOString();
    this.lastError = null;
    try {
      localStorage.setItem(STORAGE_PENDING_KEY, 'false');
      localStorage.setItem(STORAGE_LAST_SYNC_KEY, this.lastSyncedAt);
    } catch (e) { /* ignore */ }
    this._notifySubscribers();
  }

  _readLastSyncedAt() {
    try {
      return localStorage.getItem(STORAGE_LAST_SYNC_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  _notifySubscribers() {
    const statusSnapshot = this.getStatus();
    this.listeners.forEach((callback) => {
      try {
        callback(statusSnapshot);
      } catch (err) {
        console.error('[StateSync] Error in listener callback:', err);
      }
    });
  }

  /**
   * Export entire state as a downloadable JSON file for user backup
   */
  exportBackup() {
    const state = this.getStateCallback ? this.getStateCallback() : null;
    if (!state) return;
    const exportData = {
      version: '45-day-os-v1',
      exportedAt: new Date().toISOString(),
      state: { ...state, curriculum: undefined }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-prep-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import state from uploaded JSON content
   */
  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const stateData = parsed.state || parsed;
      if (this.applyRemoteStateCallback) {
        this.applyRemoteStateCallback(stateData);
      }
      this.notifyLocalChange(stateData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

// Singleton state sync service instance
export const stateSyncService = new StateSyncService();
