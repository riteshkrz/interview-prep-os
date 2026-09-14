/**
 * 45-Day Interview Prep OS - Database Catalog Service
 * Manages database-driven DSA problems and System Design specifications.
 * Implements Cache-First / Stale-While-Revalidate architecture for 0ms instant rendering
 * with background revalidation, Supabase user progress synchronization, and Realtime updates.
 */

import { supabase, isSupabaseConfigured, getCurrentUser } from '../lib/supabase.js';
import { SEED_DSA_PROBLEMS, SEED_SYSTEM_DESIGN_SPECS } from '../data/seedCatalog.js';

const STORAGE_CACHE_DSA = 'prep_os_cached_dsa_v1';
const STORAGE_CACHE_SPECS = 'prep_os_cached_specs_v1';
const STORAGE_CATALOG_SYNC_AT = 'prep_os_catalog_synced_at';

class CatalogService {
  constructor() {
    this.listeners = new Set();
    this.realtimeChannel = null;
    this.isFetching = false;
    this.isInitialized = false;
    this.lastCatalogSyncAt = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_CATALOG_SYNC_AT) : null) || null;
  }

  /**
   * Initialize catalog service: fetch remote catalog in background and attach realtime listeners
   */
  async init({ onCatalogUpdate } = {}) {
    if (onCatalogUpdate) {
      this.listeners.add(onCatalogUpdate);
    }

    if (!isSupabaseConfigured() || this.isInitialized) {
      return;
    }
    this.isInitialized = true;

    // 1. Fetch remote catalog asynchronously in background (does not block UI)
    this.fetchRemoteCatalog().catch(err => {
      console.warn('[CatalogService] Background catalog fetch notice:', err.message);
    });

    // 2. Attach realtime listeners for instant admin edits
    this.setupRealtimeSubscription();
  }

  /**
   * Subscribe to catalog updates (triggered when remote database changes)
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notifySubscribers(payload) {
    this.listeners.forEach(callback => {
      try {
        callback(payload);
      } catch (err) {
        console.error('[CatalogService] Error in subscriber callback:', err);
      }
    });
  }

  /**
   * Read cached DSA problems synchronously (0ms latency, always 100 problems)
   */
  getCachedDsaProblems(fallbackList = SEED_DSA_PROBLEMS) {
    try {
      if (typeof localStorage !== 'undefined') {
        const cached = localStorage.getItem(STORAGE_CACHE_DSA);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length >= 100) return parsed;
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge existing cached progress into the full 100 seed problems
            const cacheMap = new Map(parsed.map(p => [String(p.id), p]));
            return fallbackList.map(p => {
              const saved = cacheMap.get(String(p.id));
              return saved ? { ...p, ...saved } : p;
            });
          }
        }
      }
    } catch (e) {
      console.warn('[CatalogService] Failed to read DSA cache:', e);
    }
    return fallbackList;
  }

  /**
   * Read cached System Design specs synchronously (0ms latency, always 20 specs)
   */
  getCachedSystemSpecs(fallbackList = SEED_SYSTEM_DESIGN_SPECS) {
    try {
      if (typeof localStorage !== 'undefined') {
        const cached = localStorage.getItem(STORAGE_CACHE_SPECS);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length >= 20) return parsed;
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cacheMap = new Map(parsed.map(s => [String(s.id), s]));
            return fallbackList.map(s => {
              const saved = cacheMap.get(String(s.id));
              return saved ? { ...s, ...saved } : s;
            });
          }
        }
      }
    } catch (e) {
      console.warn('[CatalogService] Failed to read Specs cache:', e);
    }
    return fallbackList;
  }

  /**
   * Fetch questions, specs, and user progress from Supabase database
   */
  async fetchRemoteCatalog() {
    if (!isSupabaseConfigured() || (typeof navigator !== 'undefined' && !navigator.onLine) || this.isFetching) return null;

    this.isFetching = true;
    try {
      const user = await getCurrentUser();

      // Fetch dsa_problems, system_design_specs, and user_problem_progress in parallel
      const queries = [
        supabase.from('dsa_problems').select('*').order('order_index', { ascending: true }),
        supabase.from('system_design_specs').select('*').order('order_index', { ascending: true })
      ];

      if (user) {
        queries.push(
          supabase.from('user_problem_progress').select('*').eq('user_id', user.id)
        );
      }

      const results = await Promise.all(queries);
      const dsaRes = results[0];
      const specsRes = results[1];
      const progressRes = user ? results[2] : null;

      // User progress map
      const userProgressMap = new Map();
      if (progressRes && !progressRes.error && Array.isArray(progressRes.data)) {
        progressRes.data.forEach(row => {
          userProgressMap.set(String(row.problem_id), row);
        });
      }

      // Build 100 DSA Problems
      const dbDsaMap = new Map();
      if (!dsaRes.error && Array.isArray(dsaRes.data)) {
        dsaRes.data.forEach(p => dbDsaMap.set(String(p.id), p));
      }

      // Start with SEED_DSA_PROBLEMS (guarantees all 100), override with DB rows, then apply user progress
      const freshDsa = SEED_DSA_PROBLEMS.map(seedProb => {
        const id = String(seedProb.id);
        const dbProb = dbDsaMap.get(id);
        const userProg = userProgressMap.get(id);

        return {
          id: seedProb.id,
          title: dbProb?.title || seedProb.title,
          description: dbProb?.description || seedProb.description || '',
          pattern: dbProb?.pattern || seedProb.pattern,
          difficulty: dbProb?.difficulty || seedProb.difficulty,
          category: dbProb?.category || seedProb.category,
          link: dbProb?.link || seedProb.link || '',
          revision: dbProb?.revision_timing || seedProb.revision || 'In 7 days',
          timeSpent: userProg?.time_spent_minutes ? `${userProg.time_spent_minutes}m` : (dbProb?.est_time_minutes ? `${dbProb.est_time_minutes}m` : seedProb.timeSpent || '25m'),
          status: userProg?.status || 'Queued',
          confidence: userProg?.confidence_stars ?? 0,
          notes: userProg?.notes || null,
          code: userProg?.code_solution || null
        };
      });

      // Build 20 System Design Specs
      const dbSpecsMap = new Map();
      if (!specsRes.error && Array.isArray(specsRes.data)) {
        specsRes.data.forEach(s => dbSpecsMap.set(String(s.id), s));
      }

      const freshSpecs = SEED_SYSTEM_DESIGN_SPECS.map(seedSpec => {
        const id = String(seedSpec.id);
        const dbSpec = dbSpecsMap.get(id);
        const userProg = userProgressMap.get(id);

        return {
          id: seedSpec.id,
          title: dbSpec?.title || seedSpec.title,
          domain: dbSpec?.domain || seedSpec.domain,
          difficulty: dbSpec?.difficulty || seedSpec.difficulty,
          rubric: dbSpec?.rubric || seedSpec.rubric || {},
          referenceLinks: dbSpec?.reference_links || seedSpec.referenceLinks || [],
          revision: dbSpec?.revision_timing || seedSpec.revision || 'Day 15',
          timeSpent: userProg?.time_spent_minutes ? `${userProg.time_spent_minutes}m` : (dbSpec?.est_time_minutes ? `${dbSpec.est_time_minutes}m` : seedSpec.timeSpent || '45m'),
          status: userProg?.status || 'Queued',
          stars: userProg?.confidence_stars ?? 0,
          notes: userProg?.notes || null
        };
      });

      // Cache into localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_CACHE_DSA, JSON.stringify(freshDsa));
        localStorage.setItem(STORAGE_CACHE_SPECS, JSON.stringify(freshSpecs));
        this.lastCatalogSyncAt = new Date().toISOString();
        localStorage.setItem(STORAGE_CATALOG_SYNC_AT, this.lastCatalogSyncAt);
      }

      // Always notify subscribers with fresh database catalog
      this._notifySubscribers({
        dsaProblems: freshDsa,
        systemSpecs: freshSpecs,
        userProgress: progressRes?.data || [],
        syncedAt: this.lastCatalogSyncAt
      });

      return { dsa: freshDsa, specs: freshSpecs };
    } catch (err) {
      console.warn('[CatalogService] Remote catalog sync notice:', err.message);
      return null;
    } finally {
      this.isFetching = false;
    }
  }

  /**
   * Listen to real-time changes on dsa_problems and system_design_specs
   */
  setupRealtimeSubscription() {
    if (!isSupabaseConfigured() || this.realtimeChannel) return;

    try {
      this.realtimeChannel = supabase
        .channel('catalog-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'dsa_problems' },
          () => {
            console.log('[CatalogService] Realtime update on dsa_problems received, revalidating...');
            this.fetchRemoteCatalog();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'system_design_specs' },
          () => {
            console.log('[CatalogService] Realtime update on system_design_specs received, revalidating...');
            this.fetchRemoteCatalog();
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('[CatalogService] Realtime subscription notice:', err.message);
    }
  }

  /**
   * Save individual problem completion / rating to user_problem_progress in Supabase
   */
  async syncUserProblemProgress(problemId, itemType, progressData) {
    if (!isSupabaseConfigured() || (typeof navigator !== 'undefined' && !navigator.onLine)) return;

    try {
      const user = await getCurrentUser();
      if (!user) return;

      const payload = {
        user_id: user.id,
        problem_id: String(problemId),
        item_type: itemType || (String(problemId).startsWith('sd-') ? 'SYSTEM_DESIGN' : 'DSA'),
        status: progressData.status || 'Queued',
        confidence_stars: progressData.confidence ?? (progressData.stars ?? 0),
        notes: progressData.notes || null,
        code_solution: progressData.code || null,
        last_practiced_at: new Date().toISOString()
      };

      await supabase
        .from('user_problem_progress')
        .upsert(payload, { onConflict: 'user_id, problem_id' });
    } catch (err) {
      console.warn('[CatalogService] Failed to sync problem progress:', err.message);
    }
  }
}

export const catalogService = new CatalogService();
