import { CONFIG } from '../config.js';

export function renderFooter() {
  return `
    <footer class="w-full bg-[#F8FAFC] dark:bg-[#0B0F17] border-t border-[#E2E8F0] dark:border-white/[0.08] py-8 transition-colors">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            OS
          </div>
          <span class="font-sans text-[14px] text-[#0F172A] dark:text-[#F8FAFC] font-semibold tracking-tight">${CONFIG.TITLE}</span>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-5">
          <a class="text-[12px] text-[#475569] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-white transition-colors" href="#whats-inside">What's Inside</a>
          <a class="text-[12px] text-[#475569] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-white transition-colors" href="#how-it-works">How It Works</a>
          <a class="text-[12px] text-[#475569] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-white transition-colors" href="#who-its-for">Who It's For</a>
          <a class="text-[12px] text-[#475569] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-white transition-colors" href="#pricing">Pricing</a>
          <a class="text-[12px] text-[#0284C7] dark:text-[#38BDF8] hover:underline transition-colors flex items-center gap-1 font-medium" href="#/dashboard">User Dashboard</a>
        </div>
        <div class="font-code text-[11px] text-[#64748B] dark:text-slate-500 text-center md:text-right">
          © 2025 45-Day Interview Prep OS. Built for focused engineers.
        </div>
      </div>
    </footer>
  `;
}
