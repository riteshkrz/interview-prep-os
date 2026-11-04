import { CONFIG } from '../config.js';

export function renderProblemSection() {
  return `
    <!-- Problem Section -->
    <section class="w-full bg-[#0D1322] py-16 border-y border-white/[0.08]">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6">
        <div class="max-w-3xl mb-10">
          <span class="font-code text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">The Preparation Trap</span>
          <h2 class="font-headline text-[28px] md:text-[36px] font-semibold text-white mt-1 mb-3 tracking-tight">
            You Don't Need Another LeetCode List.
          </h2>
          <p class="font-body text-[15px] text-slate-300 leading-relaxed">
            You already have hundreds of problems, bookmarked System Design videos, saved articles, and scattered interview notes. The problem isn't finding resources. The problem is knowing:
          </p>
        </div>

        <!-- 5 Clean Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3.5 mb-10">
          <div class="bg-[#151D2F] p-4 rounded-md border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between shadow-xs">
            <div>
              <span class="font-code text-[11px] font-semibold text-indigo-400">01</span>
              <h3 class="font-sans text-[14px] text-white font-semibold mt-2 mb-1.5">What should I study today?</h3>
              <p class="font-body text-[12px] text-slate-400 leading-relaxed">No more 30-minute decision paralysis each evening before even opening your editor.</p>
            </div>
            <div class="mt-4 pt-2.5 border-t border-white/[0.08] flex items-center gap-1 text-rose-400 font-code text-[10px]">
              <span class="material-symbols-outlined text-[13px]">close</span> Decision fatigue
            </div>
          </div>

          <div class="bg-[#151D2F] p-4 rounded-md border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between shadow-xs">
            <div>
              <span class="font-code text-[11px] font-semibold text-indigo-400">02</span>
              <h3 class="font-sans text-[14px] text-white font-semibold mt-2 mb-1.5">What should I revise?</h3>
              <p class="font-body text-[12px] text-slate-400 leading-relaxed">Solving 80 problems is useless if you forget the key pattern 10 days later in an interview.</p>
            </div>
            <div class="mt-4 pt-2.5 border-t border-white/[0.08] flex items-center gap-1 text-rose-400 font-code text-[10px]">
              <span class="material-symbols-outlined text-[13px]">close</span> Forgetting curve
            </div>
          </div>

          <div class="bg-[#151D2F] p-4 rounded-md border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between shadow-xs">
            <div>
              <span class="font-code text-[11px] font-semibold text-indigo-400">03</span>
              <h3 class="font-sans text-[14px] text-white font-semibold mt-2 mb-1.5">Which topics am I weak at?</h3>
              <p class="font-body text-[12px] text-slate-400 leading-relaxed">Blindly grinding random topics feels productive but hides your blind spots.</p>
            </div>
            <div class="mt-4 pt-2.5 border-t border-white/[0.08] flex items-center gap-1 te'xt-rose-400 font-code text-[10px]">
              <span class="material-symbols-outlined text-[13px]">close</span> Unmeasured gps
            </div>
          </div>

          <div class="bg-[#151D2F] p-4 rounded-md border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between shadow-xs">
            <div>
              <span class="font-code text-[11px] font-semibold text-indigo-400">04</span>
              <h3 class="font-sans text-[14px] text-white font-semibold mt-2 mb-1.5">Am I actually improving?</h3>
              <p class="font-body text-[12px] text-slate-400 leading-relaxed">Tracking only completed count gives false confidence without retention metrics.</p>
            </div>
            <div class="mt-4 pt-2.5 border-t border-white/[0.08] flex items-center gap-1 text-rose-400 font-code text-[10px]">
              <span class="material-symbols-outlined text-[13px]">close</span> Vague progress
            </div>
          </div>

          <div class="bg-[#151D2F] p-4 rounded-md border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between shadow-xs">
            <div>
              <span class="font-code text-[11px] font-semibold text-indigo-400">05</span>
              <h3 class="font-sans text-[14px] text-white font-semibold mt-2 mb-1.5">How to prep while working?</h3>
              <p class="font-body text-[12px] text-slate-400 leading-relaxed">College students have 10 hours daily. You have 60 high-quality focused minutes.</p>
            </div>
            <div class="mt-4 pt-2.5 border-t border-white/[0.08] flex items-center gap-1 text-rose-400 font-code text-[10px]">
              <span class="material-symbols-outlined text-[13px]">close</span> Time starvation
            </div>
          </div>
        </div>

        <!-- Callout Box -->
        <div class="w-full bg-[#151D2F] border border-indigo-500/30 p-6 md:p-7 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div class="space-y-1.5 text-center md:text-left">
            <span class="font-code text-[11px] text-[#10B981] font-semibold tracking-wider uppercase flex items-center gap-1.5 justify-center md:justify-start">
              <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> The Antidote
            </span>
            <p class="font-headline text-[18px] font-semibold text-white tracking-tight">
              The 45-Day Interview Prep OS brings your preparation into one system.
            </p>
            <p class="font-body text-[14px] text-slate-300 max-w-2xl">
              A battle-tested engineering system engineered with built-in spaced repetition, calibrated problem sets, and senior-level architectural design rubrics.
            </p>
          </div>
          <a class="shrink-0 h-10 px-5 bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-all duration-200 rounded-md inline-flex items-center justify-center text-[13px] font-semibold tracking-tight shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/40" href="#pricing">
            Get the Prep OS — ${CONFIG.PRICE}
          </a>
        </div>
      </div>
    </section>
  `;
}
