import { CONFIG } from '../config.js';

export function renderClosingCTA() {
  return `
    <!-- Final Closing CTA -->
    <section class="w-full py-16 bg-[#0D1322] border-t border-white/[0.08] text-center">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6 flex flex-col items-center">
        <div class="w-10 h-10 rounded-md bg-[#151D2F] border border-white/[0.1] flex items-center justify-center mb-4 text-indigo-400 shadow-xs">
          <span class="material-symbols-outlined text-[20px]">flag</span>
        </div>
        <h2 class="font-headline text-[28px] md:text-[36px] font-bold max-w-2xl text-white tracking-tight mb-3">
          Stop Collecting Resources. Start Preparing.
        </h2>
        <p class="font-body text-[15px] text-slate-300 max-w-xl mx-auto mb-6">
          You probably already have enough LeetCode problems, videos, articles, and bookmarks. Now you need a system to bring everything together.
        </p>
        <button type="button" id="closing-buy-btn" class="buy-access-trigger h-12 px-7 bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-all duration-200 rounded-md inline-flex items-center justify-center gap-2 text-[14px] font-semibold tracking-tight shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_32px_rgba(99,102,241,0.6)] ring-1 ring-indigo-400/50 mb-4 cursor-pointer">
          <span>Start Your 45-Day Preparation — ${CONFIG.PRICE}</span>
          <span class="font-mono text-[13px] opacity-90">→</span>
        </button>
        <p class="font-code text-[11px] text-slate-400">
          One system. One roadmap. One day at a time.
        </p>
      </div>
    </section>
  `;
}
