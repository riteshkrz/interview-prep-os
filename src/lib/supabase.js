/**
 * Supabase Client Integration Layer for 45-Day Interview Prep OS
 * Initializes and manages the Supabase JS SDK client with authentication helpers
 * and graceful fallback for local/offline execution.
 */

import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite environment variables (or process.env in node test runners)
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});
const supabaseUrl = env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY?.trim();

// Determine if valid credentials have been configured
export const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);

/**
 * Returns true if valid Supabase credentials have been configured in .env
 */
export function isSupabaseConfigured() {
  return isConfigured;
}

/**
 * Helper to get configured project URL or null
 */
export function getSupabaseUrl() {
  return isConfigured ? supabaseUrl : null;
}

/**
 * Fallback stub implementation for offline / unconfigured environments
 */
function createFallbackClient() {
  const notConfiguredError = {
    data: null,
    error: new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
  };

  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      async getUser() {
        return { data: { user: null }, error: null };
      },
      async signInWithPassword() {
        return notConfiguredError;
      },
      async signUp() {
        return notConfiguredError;
      },
      async signInWithOtp() {
        return notConfiguredError;
      },
      async signOut() {
        return { error: null };
      },
      onAuthStateChange(callback) {
        // Return dummy subscription
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      }
    },
    from() {
      return {
        select: () => Promise.resolve(notConfiguredError),
        insert: () => Promise.resolve(notConfiguredError),
        update: () => Promise.resolve(notConfiguredError),
        upsert: () => Promise.resolve(notConfiguredError),
        delete: () => Promise.resolve(notConfiguredError)
      };
    },
    channel() {
      return {
        on: () => ({
          subscribe: () => ({
            unsubscribe: () => {}
          })
        })
      };
    }
  };
}

// Export singleton Supabase client instance
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'prep_os_supabase_auth'
      }
    })
  : createFallbackClient();

/**
 * Auth Helper: Register a new user with email and password
 */
export async function signUp(email, password) {
  if (!isConfigured) {
    return { data: null, error: new Error('Supabase is not configured') };
  }
  return await supabase.auth.signUp({
    email,
    password
  });
}

/**
 * Auth Helper: Sign in with existing email and password
 */
export async function signIn(email, password) {
  if (!isConfigured) {
    return { data: null, error: new Error('Supabase is not configured') };
  }
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

/**
 * Auth Helper: Sign in via Magic Link / OTP
 */
export async function signInWithOtp(email) {
  if (!isConfigured) {
    return { data: null, error: new Error('Supabase is not configured') };
  }
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin
    }
  });
}

/**
 * Auth Helper: Sign out current user
 */
export async function signOut() {
  if (!isConfigured) return { error: null };
  return await supabase.auth.signOut();
}

/**
 * Auth Helper: Retrieve current active session
 */
export async function getSession() {
  if (!isConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

/**
 * Auth Helper: Retrieve current authenticated user
 */
export async function getCurrentUser() {
  if (!isConfigured) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

/**
 * Auth Helper: Listen for authentication state changes (signed in, signed out, token refreshed)
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
