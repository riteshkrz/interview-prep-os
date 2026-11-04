/**
 * 45-Day Interview Prep OS - Highlight Service
 * Manages text highlight persistence, API operations, and synchronization
 * with local-first cache and Supabase PostgreSQL.
 *
 * API Endpoints supported:
 * - POST   /highlights
 * - GET    /highlights/:contentId
 * - DELETE /highlights/:highlightId
 */

import { supabase, isSupabaseConfigured, getCurrentUser } from '../lib/supabase.js';

const STORAGE_PREFIX = 'prep_os_highlights_';

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}${userId || 'local_user'}`;
}

export const HighlightStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SYNCED: 'synced',
  ERROR: 'error'
};

class HighlightService {
  constructor() {
    this.status = HighlightStatus.IDLE;
    this.lastError = null;
    this.listeners = new Set();
    this.memoryCache = new Map(); // contentId -> Array<Highlight>
    this.activeUser = null;
  }

  /**
   * Subscribe to highlight service state updates
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify() {
    this.listeners.forEach(fn => {
      try {
        fn({ status: this.status, error: this.lastError });
      } catch (e) {
        console.error('[HighlightService] Subscriber error:', e);
      }
    });
  }

  /**
   * Resolve current user ID (or fallback local ID)
   */
  async _resolveUserId() {
    try {
      const user = await getCurrentUser();
      if (user?.id) {
        this.activeUser = user;
        return user.id;
      }
    } catch (e) {
      // Supabase unconfigured or offline
    }
    return 'local_user';
  }

  /**
   * Load user highlights from localStorage cache
   */
  _loadLocalHighlights(userId) {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(getStorageKey(userId));
        if (raw) {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        }
      }
    } catch (e) {
      console.warn('[HighlightService] Local load error:', e);
    }
    return [];
  }

  /**
   * Save user highlights to localStorage cache
   */
  _saveLocalHighlights(userId, list) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(list));
      }
    } catch (e) {
      console.warn('[HighlightService] Local save error:', e);
    }
  }

  /**
   * GET /highlights/:contentId
   * Retrieve all highlights for a given lesson/content ID
   */
  async getHighlights(contentId) {
    if (!contentId) return [];

    const strContentId = String(contentId).trim();
    const userId = await this._resolveUserId();

    // Check memory cache first
    const cacheKey = `${userId}:${strContentId}`;
    if (this.memoryCache.has(cacheKey)) {
      return [...this.memoryCache.get(cacheKey)];
    }

    this.status = HighlightStatus.LOADING;
    this.lastError = null;

    // Load from local storage immediately as base
    const allLocal = this._loadLocalHighlights(userId);
    let matched = allLocal.filter(h => String(h.contentId) === strContentId);

    // If Supabase is configured and online, sync from database
    if (isSupabaseConfigured() && userId !== 'local_user' && typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('highlights')
          .select('*')
          .eq('user_id', userId)
          .eq('content_id', strContentId)
          .order('created_at', { ascending: true });

        if (!error && Array.isArray(data)) {
          matched = data.map(row => ({
            id: row.id,
            userId: row.user_id,
            contentId: row.content_id,
            selectedText: row.selected_text,
            startOffset: row.start_offset,
            endOffset: row.end_offset,
            containerId: row.container_id,
            prefix: row.prefix || null,
            suffix: row.suffix || null,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));

          // Merge back into local storage
          const nonContent = allLocal.filter(h => String(h.contentId) !== strContentId);
          this._saveLocalHighlights(userId, [...nonContent, ...matched]);
        }
      } catch (err) {
        console.warn('[HighlightService] Remote fetch warning, using local fallback:', err.message);
        this.lastError = err.message;
      }
    }

    this.memoryCache.set(cacheKey, matched);
    this.status = HighlightStatus.SYNCED;
    this._notify();
    return matched;
  }

  /**
   * POST /highlights
   * Create and persist a new highlight
   */
  async createHighlight({
    contentId,
    selectedText,
    startOffset,
    endOffset,
    containerId = null,
    prefix = '',
    suffix = ''
  }) {
    if (!contentId || !selectedText) {
      throw new Error('contentId and selectedText are required to create a highlight.');
    }

    const userId = await this._resolveUserId();
    const strContentId = String(contentId).trim();
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'hl_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    const now = new Date().toISOString();
    const highlight = {
      id,
      userId,
      contentId: strContentId,
      selectedText: String(selectedText),
      startOffset: Number(startOffset) || 0,
      endOffset: Number(endOffset) || 0,
      containerId: containerId ? String(containerId) : null,
      prefix: prefix ? String(prefix) : '',
      suffix: suffix ? String(suffix) : '',
      createdAt: now,
      updatedAt: now
    };

    // 1. Optimistically update local storage & memory cache
    const allLocal = this._loadLocalHighlights(userId);
    allLocal.push(highlight);
    this._saveLocalHighlights(userId, allLocal);

    const cacheKey = `${userId}:${strContentId}`;
    const cached = this.memoryCache.get(cacheKey) || [];
    this.memoryCache.set(cacheKey, [...cached, highlight]);

    // 2. Persist to Supabase if configured and user is authenticated
    if (isSupabaseConfigured() && userId !== 'local_user' && typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('highlights')
          .insert({
            id: highlight.id,
            user_id: highlight.userId,
            content_id: highlight.contentId,
            selected_text: highlight.selectedText,
            start_offset: highlight.startOffset,
            end_offset: highlight.endOffset,
            container_id: highlight.containerId,
            prefix: highlight.prefix,
            suffix: highlight.suffix,
            created_at: highlight.createdAt,
            updated_at: highlight.updatedAt
          })
          .select()
          .maybeSingle();

        if (error) {
          console.warn('[HighlightService] Supabase insert warning:', error.message);
          this.lastError = error.message;
        } else if (data) {
          highlight.updatedAt = data.updated_at || highlight.updatedAt;
        }
      } catch (err) {
        console.warn('[HighlightService] Remote save failed, preserved locally:', err.message);
        this.lastError = err.message;
      }
    }

    this.status = HighlightStatus.SYNCED;
    this._notify();
    return highlight;
  }

  /**
   * DELETE /highlights/:highlightId
   * Remove an existing highlight by ID
   */
  async deleteHighlight(highlightId) {
    if (!highlightId) return false;

    const strId = String(highlightId);
    const userId = await this._resolveUserId();

    // 1. Remove from local storage
    const allLocal = this._loadLocalHighlights(userId);
    const target = allLocal.find(h => h.id === strId);
    const filtered = allLocal.filter(h => h.id !== strId);
    this._saveLocalHighlights(userId, filtered);

    // 2. Remove from memory cache
    if (target?.contentId) {
      const cacheKey = `${userId}:${String(target.contentId)}`;
      const cached = this.memoryCache.get(cacheKey) || [];
      this.memoryCache.set(cacheKey, cached.filter(h => h.id !== strId));
    } else {
      // Invalidate all memory caches for user if contentId not resolved
      for (const [key, list] of this.memoryCache.entries()) {
        if (key.startsWith(`${userId}:`)) {
          this.memoryCache.set(key, list.filter(h => h.id !== strId));
        }
      }
    }

    // 3. Delete from Supabase if online
    if (isSupabaseConfigured() && userId !== 'local_user' && typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const { error } = await supabase
          .from('highlights')
          .delete()
          .eq('user_id', userId)
          .eq('id', strId);

        if (error) {
          console.warn('[HighlightService] Remote delete notice:', error.message);
          this.lastError = error.message;
        }
      } catch (err) {
        console.warn('[HighlightService] Remote delete notice:', err.message);
        this.lastError = err.message;
      }
    }

    this.status = HighlightStatus.SYNCED;
    this._notify();
    return true;
  }

  /**
   * Express / REST-style unified API router dispatcher
   * Routes:
   * - POST   /highlights
   * - GET    /highlights/:contentId
   * - DELETE /highlights/:highlightId
   */
  async handleApiRequest(method, path, body = null) {
    const cleanMethod = (method || 'GET').toUpperCase();
    const cleanPath = (path || '').trim();

    // Route: POST /highlights
    if (cleanMethod === 'POST' && (cleanPath === '/highlights' || cleanPath === '/highlights/')) {
      const payload = typeof body === 'string' ? JSON.parse(body) : (body || {});
      const created = await this.createHighlight(payload);
      return { status: 201, data: created };
    }

    // Route: GET /highlights/:contentId
    const getMatch = cleanPath.match(/^\/highlights\/([^/]+)$/);
    if (cleanMethod === 'GET' && getMatch) {
      const contentId = decodeURIComponent(getMatch[1]);
      const list = await this.getHighlights(contentId);
      return { status: 200, data: list };
    }

    // Route: DELETE /highlights/:highlightId
    const delMatch = cleanPath.match(/^\/highlights\/([^/]+)$/);
    if (cleanMethod === 'DELETE' && delMatch) {
      const highlightId = decodeURIComponent(delMatch[1]);
      const success = await this.deleteHighlight(highlightId);
      return { status: 200, data: { success, highlightId } };
    }

    return { status: 404, error: `Route ${cleanMethod} ${cleanPath} not found` };
  }
}

export const highlightService = new HighlightService();

/**
 * Standard API client conforming to HTTP conventions
 */
export const highlightApi = {
  post: (path, body) => highlightService.handleApiRequest('POST', path, body),
  get: (path) => highlightService.handleApiRequest('GET', path),
  delete: (path) => highlightService.handleApiRequest('DELETE', path)
};
