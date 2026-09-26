import { CONFIG } from '../config.js';

export function renderClosingCTA() {
  return `
    <!-- Final Closing CTA -->
    <section class="w-full py-16 bg-[#F8FAFC] dark:bg-[#0B0F17] border-t border-[#E2E8F0] dark:border-white/[0.08] text-center transition-colors">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6 flex flex-col items-center">
        <div class="w-10 h-10 rounded-md bg-[#EFF6FF] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/[0.1] flex items-center justify-center mb-4 text-[#4F46E5] dark:text-[#818CF8] shadow-xs">
          <span class="material-symbols-outlined text-[20px]">flag</span>
        </div>
        <h2 class="font-headline text-[28px] md:text-[36px] font-bold max-w-2xl text-[#0F172A] dark:text-[#F8FAFC] tracking-tight mb-3">
          Stop Collecting Resources. Start Preparing.
        </h2>
        <p class="font-body text-[15px] text-[#475569] dark:text-[#94A3B8] max-w-xl mx-auto mb-6">
          You probably already have enough LeetCode problems, videos, articles, and bookmarks. Now you need a system to bring everything together.
        </p>
        <button type="button" id="closing-buy-btn" class="buy-access-trigger h-12 px-7 bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] transition-all duration-200 rounded-md inline-flex items-center justify-center gap-2 text-[14px] font-semibold tracking-tight shadow-[0_0_24px_rgba(79,70,229,0.35)] hover:shadow-[0_0_32px_rgba(79,70,229,0.55)] mb-4 cursor-pointer">
          <span>Start Your 45-Day Preparation — ${CONFIG.PRICE}</span>
          <span class="font-mono text-[13px] opacity-90">→</span>
        </button>
        <p class="font-code text-[11px] text-[#64748B] dark:text-slate-400">
          One system. One roadmap. One day at a time.
        </p>
      </div>
    </section>
  `;
}
