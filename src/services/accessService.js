/**
 * 45-Day Interview Prep OS - Access PIN & Purchase Service
 * Generates and validates 4-digit activation PINs for the purchase-to-signup onboarding flow.
 * Supports both local-first instant verification and Supabase cloud persistence.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const STORAGE_PINS_KEY = 'prep_os_access_pins_v1';

class AccessService {
  constructor() {
    this.localPins = this._loadLocalPins();
  }

  /**
   * Generate a secure random 4-digit PIN (e.g. "4829")
   */
  generatePin() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Retrieve cached PIN for an email ONLY if it is still unused/unactivated
   */
  getPinForEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const record = this.localPins[cleanEmail];
    if (!record || record.isUsed) return null;
    return record.pin || null;
  }

  /**
   * Check if an account has already been registered / activated
   */
  isActivated(email) {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    const record = this.localPins[cleanEmail];
    if (record?.isUsed) return true;
    try {
      if (typeof localStorage !== 'undefined') {
        const activated = localStorage.getItem('prep_os_activated_user');
        if (activated) {
          const parsed = JSON.parse(activated);
          if (parsed.email && parsed.email.toLowerCase() === cleanEmail) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  /**
   * Register a new 4-digit activation PIN for a buyer email
   */
  async createAccessPin(email, pin) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();

    // 1. Store in local cache for instant zero-latency verification
    this.localPins[cleanEmail] = {
      pin: cleanPin,
      createdAt: new Date().toISOString(),
      isUsed: false
    };
    this._saveLocalPins();

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('access_passes')
          .insert({
            email: cleanEmail,
            pin: cleanPin,
            is_used: false,
            created_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('[AccessService] Cloud PIN backup notice:', err.message);
      }
    }

    return { email: cleanEmail, pin: cleanPin };
  }

  /**
   * Verify if a 4-digit PIN matches the user's email
   */
  async verifyAccessPin(email, pin) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();

    // 1. Check local cache first (instant)
    const localRecord = this.localPins[cleanEmail];
    if (localRecord && localRecord.pin === cleanPin) {
      return { valid: true, source: 'local' };
    }

    // 2. Check Supabase database if available
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('access_passes')
          .select('*')
          .eq('email', cleanEmail)
          .eq('pin', cleanPin)
          .maybeSingle();

        if (!error && data) {
          // Cache locally for subsequent fast checks
          this.localPins[cleanEmail] = {
            pin: cleanPin,
            isUsed: data.is_used || false
          };
          this._saveLocalPins();
          return { valid: true, source: 'cloud' };
        }
      } catch (err) {
        console.warn('[AccessService] Supabase PIN check notice:', err.message);
      }
    }

    return { valid: false, error: 'Invalid PIN for this email' };
  }

  /**
   * Mark a PIN as used after account registration
   */
  async consumeAccessPin(email, pin) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();

    if (this.localPins[cleanEmail]) {
      this.localPins[cleanEmail].isUsed = true;
      this.localPins[cleanEmail].usedAt = new Date().toISOString();
      this._saveLocalPins();
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('access_passes')
          .update({ is_used: true, used_at: new Date().toISOString() })
          .eq('email', cleanEmail)
          .eq('pin', cleanPin);
      } catch (e) { /* ignore */ }
    }
  }

  _loadLocalPins() {
    try {
      const saved = localStorage.getItem(STORAGE_PINS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  _saveLocalPins() {
    try {
      localStorage.setItem(STORAGE_PINS_KEY, JSON.stringify(this.localPins));
    } catch (e) { /* ignore */ }
  }
}

export const accessService = new AccessService();
