/**
 * Theme Service for 45-Day Interview Prep OS
 * Manages theme state (light / dark), persists user preference in localStorage,
 * applies DOM classes to document.documentElement, and broadcasts updates.
 *
 * Default theme: 'light' (clean modern light workspace)
 */

const THEME_STORAGE_KEY = 'prep_os_theme';
let memoryTheme = null;

export function getTheme() {
  if (memoryTheme === 'dark' || memoryTheme === 'light') {
    return memoryTheme;
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        memoryTheme = saved;
        return saved;
      }
    }
  } catch (e) {
    // In environments where localStorage is restricted or throws
  }
  return 'light'; // Default to Light Mode
}

export function setTheme(theme) {
  const isDark = theme === 'dark';
  const effectiveTheme = isDark ? 'dark' : 'light';
  memoryTheme = effectiveTheme;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, effectiveTheme);
    }
  } catch (e) {
    // Silently fall back to in-memory state
  }

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }

  // Update any existing toggle buttons on the page
  if (typeof document !== 'undefined') {
    document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
      icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    });
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const label = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);
    });
  }

  // Dispatch custom event for reactive UI components (headers, toggles)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('prep-os-theme-change', {
        detail: { theme: effectiveTheme, isDark }
      })
    );
  }

  return effectiveTheme;
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  return setTheme(next);
}

export function initTheme() {
  const theme = getTheme();
  setTheme(theme);
}

export function renderThemeToggleButton(extraClasses = 'w-8 h-8') {
  const isDark = getTheme() === 'dark';
  return `
    <button type="button" 
            class="theme-toggle-btn ${extraClasses}" 
            data-action="toggle-theme" 
            title="${isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}"
            aria-label="${isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}">
      <span class="material-symbols-outlined text-[17px] theme-toggle-icon">
        ${isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  `;
}

// Global click handler for theme toggle
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('[data-action="toggle-theme"]') || e.target.closest('.theme-toggle-btn');
    if (toggleBtn) {
      e.preventDefault();
      toggleTheme();
    }
  });

  window.addEventListener('prep-os-theme-change', (e) => {
    const isDark = e.detail?.isDark;
    document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
      icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    });
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const label = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);
    });
  });
}
