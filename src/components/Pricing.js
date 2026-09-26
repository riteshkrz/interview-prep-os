import { CONFIG } from '../config.js';

export function renderPricing() {
  return `
    <!-- What You Get & Pricing Section -->
    <section class="w-full py-16 relative pricing-mesh-glow bg-[#0B0F19]" id="pricing">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6">
        <div class="max-w-xl mx-auto">
          <!-- Conversion Pricing Card -->
          <div class="bg-[#151D2F]/95 rounded-xl border border-indigo-500/40 shadow-[0_20px_60px_rgba(99,102,241,0.25)] p-7 md:p-8 space-y-6 relative backdrop-blur-md">
            <!-- Glowing top highlight badge -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-code text-[11px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.6)]">
              ${CONFIG.DISCOUNT_LABEL}
            </div>

            <!-- Top Header -->
            <div class="flex items-center justify-between pb-4 border-b border-white/[0.08] pt-2">
              <div>
                <span class="font-code text-[10px] text-[#38BDF8] font-semibold uppercase tracking-widest">Full Lifetime Access</span>
                <h3 class="font-headline text-[24px] md:text-[28px] font-bold text-white mt-0.5">${CONFIG.TITLE}</h3>
              </div>
              <div class="w-10 h-10 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <span class="material-symbols-outlined text-[20px]">bolt</span>
              </div>
            </div>

            <!-- Feature List with Mint Emerald Checkmarks -->
            <div class="space-y-3 font-body text-[13px] text-slate-200">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
                <span><strong class="font-medium text-white">45-Day Preparation Roadmap</strong> — Daily guided sprint structure</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
                <span><strong class="font-medium text-white">DSA Practice Tracker</strong> — 100 core patterns with confidence metrics</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
                <span><strong class="font-medium text-white">System Design Workspace</strong> — 12 senior architecture templates</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
                <span><strong class="font-medium text-white">Revision Hub</strong> — Automated spaced repetition queue</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
                <span><strong class="font-medium text-white">Interview Readiness Radar</strong> — Objective competency scorecard</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
                <span><strong class="font-medium text-white">Quick-Start Guide</strong> — 5-minute video setup and cheatsheets</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
                <span><strong class="font-medium text-white">Lifetime access</strong> to the system & future updates</span>
              </div>
            </div>

            <!-- Pricing & Checkout -->
            <div class="pt-5 border-t border-white/[0.08] space-y-4">
              <div class="flex items-baseline justify-between">
                <div>
                  <div class="flex items-baseline gap-2">
                    <span class="font-headline text-[36px] md:text-[40px] font-bold text-white tracking-tight">${CONFIG.PRICE}</span>
                    <span class="font-body text-[14px] text-slate-500 line-through">${CONFIG.ORIGINAL_PRICE}</span>
                  </div>
                  <p class="font-body text-[12px] text-slate-400 mt-0.5">
                    One-time payment • Digital product • Instant access
                  </p>
                </div>
                <span class="px-2.5 py-1 rounded-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-code text-[11px] font-bold uppercase tracking-wider">
                  ${CONFIG.SAVINGS}
                </span>
              </div>

              <button id="pricing-buy-btn" type="button" class="buy-access-trigger w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all duration-200 rounded-md flex items-center justify-center gap-2 text-[15px] font-semibold tracking-tight shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 ring-1 ring-indigo-400/50 cursor-pointer">
                <span>Get the Prep OS — ${CONFIG.PRICE}</span>
                <span class="font-mono text-[14px] opacity-90">→</span>
              </button>

              <div class="flex items-center justify-center gap-1.5 text-slate-400 font-body text-[11px] text-center">
                <span class="material-symbols-outlined text-[13px] text-emerald-400">lock</span>
                <span>Secure checkout via Razorpay / Stripe • Instant access to your system</span>
              </div>
              
              <p class="text-center font-code text-[11px] text-slate-400 pt-1">
                Start preparing with a clear system today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
