import { CONFIG } from '../config.js';

export function renderFooter() {
  return `
    <footer class="w-full bg-[#0B0F19] border-t border-white/[0.08] py-8">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <img alt="45-Day Interview Prep OS Logo" class="h-6 w-auto object-contain rounded p-0.5 bg-[#151D2F]" src="/logo.svg"/>
          <span class="font-sans text-[14px] text-white font-semibold tracking-tight">${CONFIG.TITLE}</span>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-5">
          <a class="text-[12px] text-slate-400 hover:text-white transition-colors" href="#whats-inside">What's Inside</a>
          <a class="text-[12px] text-slate-400 hover:text-white transition-colors" href="#how-it-works">How It Works</a>
          <a class="text-[12px] text-slate-400 hover:text-white transition-colors" href="#who-its-for">Who It's For</a>
          <a class="text-[12px] text-slate-400 hover:text-white transition-colors" href="#pricing">Pricing</a>
          <a class="text-[12px] text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 font-medium" href="#/dashboard">User Dashboard</a>
        </div>
        <div class="font-code text-[11px] text-slate-500 text-center md:text-right">
          © 2025 45-Day Interview Prep OS. Built for focused engineers.
        </div>
      </div>
    </footer>
  `;
}
