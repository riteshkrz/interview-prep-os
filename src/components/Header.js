import { CONFIG } from '../config.js';

export function renderHeader() {
  return `
    <header class="sticky top-0 inset-x-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div class="h-14 max-w-[75rem] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2.5 min-w-0">
          <a href="#/" class="flex items-center gap-2.5">
            <img alt="45-Day Interview Prep OS Logo" class="h-7 w-auto object-contain shrink-0 ring-1 ring-white/10 rounded-md p-0.5 bg-[#151D2F]" src="/logo.svg"/>
            <span class="font-sans text-[15px] font-semibold text-white tracking-tight">${CONFIG.TITLE}</span>
          </a>
        </div>
        
        <nav class="hidden md:flex items-center gap-6">
          <a class="text-[13px] font-medium text-slate-400 hover:text-white transition-colors tracking-tight" href="#whats-inside">What's Inside</a>
          <a class="text-[13px] font-medium text-slate-400 hover:text-white transition-colors tracking-tight" href="#how-it-works">How It Works</a>
          <a class="text-[13px] font-medium text-slate-400 hover:text-white transition-colors tracking-tight" href="#who-its-for">Who It's For</a>
          <a class="text-[13px] font-medium text-slate-400 hover:text-white transition-colors tracking-tight" href="#/blog">Blog</a>
          <a class="text-[13px] font-medium text-slate-300 hover:text-white transition-colors tracking-tight" href="#/login">Sign In</a>
          <a class="text-[13px] font-medium text-[#38BDF8] hover:text-white transition-colors tracking-tight flex items-center gap-1" href="#/dashboard">
            <span class="material-symbols-outlined text-[15px]">space_dashboard</span>
            <span>User Dashboard</span>
          </a>
        </nav>

        <div class="flex items-center gap-2.5 shrink-0">
          <button type="button" id="header-buy-btn" class="buy-access-trigger h-8 px-3.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-all duration-200 rounded-md inline-flex items-center justify-center text-[12px] font-semibold tracking-tight shadow-[0_0_18px_rgba(99,102,241,0.35)] hover:shadow-[0_0_24px_rgba(99,102,241,0.55)] border border-indigo-400/40 cursor-pointer">
            <span>Get the Prep OS</span>
            <span class="ml-1 font-mono text-[11px] opacity-90">→</span>
          </button>
          <a href="#/login" class="w-8 h-8 rounded-md bg-[#151D2F] border border-white/10 flex items-center justify-center shrink-0 text-slate-300 hover:text-white shadow-xs transition-colors" title="Sign In or Open Workspace">
            <span class="material-symbols-outlined text-[16px]">person</span>
          </a>
          <!-- Mobile Menu Toggle -->
          <button class="md:hidden p-1 text-slate-400 hover:text-white flex items-center justify-center" id="mobile-menu-toggle" aria-label="Toggle menu">
            <span class="material-symbols-outlined text-[20px]" id="mobile-menu-icon">menu</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div class="hidden md:hidden bg-[#0D1322] border-b border-white/[0.08] px-4 py-3 flex-col gap-2.5" id="mobile-drawer">
        <a class="text-[13px] font-medium text-[#38BDF8] py-1 flex items-center gap-1.5" href="#/dashboard">
          <span class="material-symbols-outlined text-[16px]">space_dashboard</span>
          <span>Open User Dashboard</span>
        </a>
        <a class="text-[13px] font-medium text-slate-300 hover:text-white py-1 block" href="#/login">Sign In / Account</a>
        <a class="text-[13px] font-medium text-slate-300 hover:text-white py-1 block" href="#/blog">Engineering Blog</a>
        <a class="text-[13px] font-medium text-slate-300 hover:text-white py-1 block" href="#whats-inside">What's Inside</a>
        <a class="text-[13px] font-medium text-slate-300 hover:text-white py-1 block" href="#how-it-works">How It Works</a>
        <a class="text-[13px] font-medium text-slate-300 hover:text-white py-1 block" href="#who-its-for">Who It's For</a>
        <a class="text-[13px] font-medium text-slate-300 hover:text-white py-1 block" href="#pricing">Pricing</a>
        <button type="button" id="mobile-buy-btn" class="buy-access-trigger w-full h-9 mt-2 bg-[#6366F1] text-white rounded-md flex items-center justify-center text-[13px] font-semibold cursor-pointer">
          Get the Prep OS — ${CONFIG.PRICE}
        </button>
      </div>
    </header>
  `;
}
