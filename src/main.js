import { renderHeader } from './components/Header.js';
import { renderAnnouncementBar } from './components/AnnouncementBar.js';
import { renderHero } from './components/Hero.js';
import { renderProblemSection } from './components/ProblemSection.js';
import { renderDatabasePreview } from './components/DatabasePreview.js';
import { renderWhatsInside } from './components/WhatsInside.js';
import { renderHowItWorks } from './components/HowItWorks.js';
import { renderWorkingDeveloper } from './components/WorkingDeveloper.js';
import { renderProductShowcase } from './components/ProductShowcase.js';
import { renderWhoItsFor } from './components/WhoItsFor.js';
import { renderPricing } from './components/Pricing.js';
import { renderClosingCTA } from './components/ClosingCTA.js';
import { renderFooter } from './components/Footer.js';
import { renderFaqModal } from './components/FaqModal.js';
import { renderDashboardApp, attachDashboardListeners } from './dashboard/DashboardApp.js';
import { renderBlogApp, attachBlogListeners } from './blog/BlogApp.js';
import { renderAuthPage, attachAuthPageListeners } from './auth/AuthPage.js';
import { openBuyAccessModal } from './components/BuyAccessModal.js';
import { resetState } from './dashboard/state.js';

// Route Manager
function handleRouting() {
  const hash = window.location.hash || '';
  const path = window.location.pathname || '';
  const app = document.getElementById('app');
  if (!app) return;

  const isBuy = hash === '#buy' || hash === '#/buy' || hash.startsWith('#/buy?');
  const isAuth = hash.includes('login') || hash.includes('signin') || hash.includes('signup') || hash.includes('auth') || path.includes('/login') || path.includes('/auth');
  const isBlog = hash.includes('blog') || path.includes('/blog');
  const isDashboard = hash.includes('dashboard') || path.includes('/dashboard');

  if (isBuy) {
    renderLandingPage();
    openBuyAccessModal();
    return;
  }

  if (isAuth) {
    try {
      const mode = hash.includes('signup') ? 'signup' : 'signin';
      app.innerHTML = renderAuthPage(mode);
      attachAuthPageListeners();
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error rendering auth page:', err);
    }
  } else if (isBlog) {
    try {
      app.innerHTML = renderBlogApp();
      attachBlogListeners();
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error rendering blog:', err);
    }
  } else if (isDashboard) {
    try {
      // Render Dashboard View
      app.innerHTML = renderDashboardApp();
      attachDashboardListeners();
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error rendering dashboard:', err);
      try {
        // Self-healing: reset state in case of stale cache
        resetState();
        app.innerHTML = renderDashboardApp();
        attachDashboardListeners();
        window.scrollTo(0, 0);
      } catch (innerErr) {
        console.error('Fatal dashboard render error:', innerErr);
        app.innerHTML = `
          <div class="p-8 max-w-lg mx-auto my-12 text-center bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container">
            <h2 class="text-headline-sm font-semibold text-on-surface mb-2">Dashboard Initialization Notice</h2>
            <p class="text-body-sm text-on-surface-variant mb-4">Clearing local cache to align with the latest Stitch schema...</p>
            <button onclick="localStorage.clear(); location.reload();" class="px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">Reset & Reload Dashboard</button>
          </div>
        `;
      }
    }
  } else {
    // Render Landing Page View
    renderLandingPage();
    window.scrollTo(0, 0);
  }
}

// Render Landing Page
function renderLandingPage() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${renderHeader()}
    <main class="w-full bg-[#0B0F19] text-[#CBD5E1] min-h-screen" style="width: 100%; padding-top: 4rem; background-color: #0B0F19; min-height: 100vh;">
      <div style="display: flex; flex-direction: column; width: 100%;">
        ${renderAnnouncementBar()}
        ${renderHero()}
        ${renderProblemSection()}
        ${renderDatabasePreview()}
        ${renderWhatsInside()}
        ${renderHowItWorks()}
        ${renderWorkingDeveloper()}
        ${renderProductShowcase()}
        ${renderWhoItsFor()}
        ${renderPricing()}
        ${renderClosingCTA()}
      </div>
    </main>
    ${renderFooter()}
    ${renderFaqModal()}
  `;

  setupMobileMenu();
  setupHeroChecklist();
  setupLandingDatabaseTabs();
  setupFaqModal();
  setupScrollspyAndNavigation();
}

// Mobile Navigation Toggle
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const icon = document.getElementById('mobile-menu-icon');

  if (!toggleBtn || !drawer || !icon) return;

  const toggle = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      icon.textContent = 'menu';
    } else {
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      icon.textContent = 'close';
    }
  };

  toggleBtn.addEventListener('click', toggle);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      icon.textContent = 'menu';
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      icon.textContent = 'menu';
    }
  });
}

// Interactive Hero Checklist on Landing Page
function setupHeroChecklist() {
  const container = document.getElementById('hero-checklist-container');
  const countDisplay = document.getElementById('hero-checklist-count');
  if (!container || !countDisplay) return;

  const updateCount = () => {
    const total = container.querySelectorAll('.checklist-item').length;
    const done = container.querySelectorAll('.checklist-item.done').length;
    countDisplay.textContent = `${done} of ${total} Done`;
  };

  container.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', () => {
      const isDone = item.classList.toggle('done');
      const icon = item.querySelector('.task-check-icon');
      if (icon) {
        icon.textContent = isDone ? 'check_box' : 'check_box_outline_blank';
        icon.style.color = isDone ? 'var(--color-primary)' : 'var(--color-outline)';
      }
      updateCount();
    });
  });
}

// Landing Page Database Tabs
function setupLandingDatabaseTabs() {
  const tabsContainer = document.getElementById('db-tabs');
  const tbody = document.getElementById('db-table-body');
  const itemCount = document.getElementById('db-item-count');
  const footerShowing = document.getElementById('db-footer-showing');
  if (!tabsContainer || !tbody || !itemCount) return;

  const tabData = {
    dsa: {
      count: '100 items',
      showing: 'Showing 4 of 100 entries',
      rows: `
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[15px] text-indigo-400">article</span>
            LRU Cache Implementation
          </td>
          <td class="py-2.5 px-4">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Mastered
            </span>
          </td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Hash + Doubly LL</span></td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-amber-300 bg-amber-500/10 border border-amber-500/20">Medium</span></td>
          <td class="py-2.5 px-4 text-amber-400 text-[11px]">★★★★★</td>
          <td class="py-2.5 px-4 font-code text-[11px] text-slate-300">In 7 days (Aug 24)</td>
          <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-400">24m</td>
        </tr>
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[15px] text-indigo-400">article</span>
            Design a Distributed Rate Limiter
          </td>
          <td class="py-2.5 px-4">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> In Progress
            </span>
          </td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Token Bucket / Redis</span></td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-rose-300 bg-rose-500/10 border border-rose-500/20 font-medium">Hard</span></td>
          <td class="py-2.5 px-4 text-amber-400 text-[11px]">★★★☆☆</td>
          <td class="py-2.5 px-4 font-code text-[11px] text-rose-400 font-medium">Tomorrow (Urgent)</td>
          <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-400">45m</td>
        </tr>
      `
    },
    sysdesign: {
      count: '20 specs',
      showing: 'Showing 4 of 20 entries',
      rows: `
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[15px] text-indigo-400">architecture</span>
            Distributed Cache with Consistent Hashing
          </td>
          <td class="py-2.5 px-4">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Mastered
            </span>
          </td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Ketama Ring / Virtual Nodes</span></td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-rose-300 bg-rose-500/10 border border-rose-500/20 font-medium">Hard</span></td>
          <td class="py-2.5 px-4 text-amber-400 text-[11px]">★★★★★</td>
          <td class="py-2.5 px-4 font-code text-[11px] text-slate-300">In 5 days</td>
          <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-400">50m</td>
        </tr>
      `
    },
    revision: {
      count: '4 due',
      showing: 'Showing 4 due review entries',
      rows: `
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[15px] text-rose-400">notification_important</span>
            Design a Distributed Rate Limiter
          </td>
          <td class="py-2.5 px-4">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-rose-500/10 text-rose-300 border border-rose-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Due Today
            </span>
          </td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Token Bucket / Redis</span></td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-rose-300 bg-rose-500/10 border border-rose-500/20 font-medium">Hard</span></td>
          <td class="py-2.5 px-4 text-amber-400 text-[11px]">★★★☆☆</td>
          <td class="py-2.5 px-4 font-code text-[11px] text-rose-400 font-medium">Today (Expired)</td>
          <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-400">45m</td>
        </tr>
      `
    },
    velocity: {
      count: '4 phases',
      showing: 'Showing 4 active prep phases',
      rows: `
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[15px] text-emerald-400">check_circle</span>
            Phase 1: Core DSA &amp; Patterns
          </td>
          <td class="py-2.5 px-4">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              100% Completed
            </span>
          </td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Days 1–7</span></td>
          <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 font-medium">Foundational</span></td>
          <td class="py-2.5 px-4 text-amber-400 text-[11px]">★★★★★</td>
          <td class="py-2.5 px-4 font-code text-[11px] text-emerald-400">Passed Checkpoint</td>
          <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-400">7.5 hrs</td>
        </tr>
      `
    }
  };

  tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      if (tab && tabData[tab]) {
        tbody.innerHTML = tabData[tab].rows;
        itemCount.textContent = tabData[tab].count;
        if (footerShowing) footerShowing.textContent = tabData[tab].showing;
      }
    });
  });
}

// Accessible FAQ Dialog Modal
function setupFaqModal() {
  const modal = document.getElementById('faq-modal');
  const closeX = document.getElementById('close-faq-modal');
  const closeBtn = document.getElementById('close-faq-modal-btn');
  const footerFaqLink = document.getElementById('footer-faq-link');
  if (!modal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (footerFaqLink) footerFaqLink.addEventListener('click', openModal);
  if (closeX) closeX.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Smooth Scrolling with Header Offset and Active Scrollspy
function setupScrollspyAndNavigation() {
  const navLinks = document.querySelectorAll('#desktop-nav a');
  const sections = document.querySelectorAll('section[id]');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#/' || targetId.startsWith('#/dashboard') || targetId === '#checkout' || targetId === '#faq') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 64;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// Router Event Listeners
window.addEventListener('hashchange', handleRouting);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleRouting);
} else {
  handleRouting();
}

// Global Delegated Buy Modal Trigger
document.addEventListener('click', (e) => {
  const buyBtn = e.target.closest('.buy-access-trigger') ||
                 e.target.closest('#pricing-buy-btn') ||
                 e.target.closest('#hero-buy-btn') ||
                 e.target.closest('#header-buy-btn') ||
                 e.target.closest('#closing-buy-btn') ||
                 e.target.closest('#mobile-buy-btn');
  if (buyBtn) {
    e.preventDefault();
    openBuyAccessModal();
  }
});

