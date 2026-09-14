import { CONFIG } from '../config.js';

export function renderHero() {
  return `
    <!-- Hero Section -->
    <section class="w-full max-w-[75rem] mx-auto px-4 md:px-6 pt-14 md:pt-20 pb-16 flex flex-col items-center text-center relative hero-mesh-glow bg-[#0B0F19]">
      <!-- Precision Status Tag -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#151D2F]/90 border border-white/10 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.3)] backdrop-blur-md">
        <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] ring-2 ring-emerald-400/20"></span>
        <span class="font-code text-[11px] uppercase tracking-wider text-slate-300 font-medium">Built for working software engineers</span>
      </div>

      <!-- Main Headline -->
      <h1 class="font-headline text-[38px] md:text-[56px] leading-[1.08] max-w-4xl text-white font-bold tracking-[-0.035em] mb-4 drop-shadow-sm">
        Prepare for Senior-Level Interviews in 45 Days — <span class="text-slate-400 font-normal">Without Burning Out.</span>
      </h1>

      <!-- Supporting Text -->
      <p class="font-body text-[16px] md:text-[18px] leading-relaxed text-slate-300 max-w-2xl mx-auto mb-8 font-normal">
        ${CONFIG.SUBTITLE}
      </p>

      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row items-center gap-3 mb-14 w-full sm:w-auto">
        <button type="button" id="hero-buy-btn" class="buy-access-trigger w-full sm:w-auto h-11 px-6 bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-all duration-200 rounded-md inline-flex items-center justify-center gap-2 text-[14px] font-semibold tracking-tight shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_32px_rgba(99,102,241,0.6)] ring-1 ring-indigo-400/50 cursor-pointer">
          <span>Get the Prep OS — ${CONFIG.PRICE}</span>
          <span class="font-mono text-[13px] opacity-90">→</span>
        </button>
        <a class="w-full sm:w-auto h-11 px-5 bg-[#151D2F] border border-white/15 hover:border-slate-400 text-slate-200 hover:text-white transition-colors rounded-md inline-flex items-center justify-center gap-1.5 text-[13px] font-medium shadow-xs" href="#whats-inside">
          <span>See What's Inside</span>
          <span class="material-symbols-outlined text-[15px] text-[#38BDF8]">south</span>
        </a>
      </div>

      <!-- Centerpiece Prep OS Dashboard Mockup -->
      <div class="w-full max-w-5xl text-left bg-[#151D2F] rounded-lg border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-sm">
        <!-- Window Titlebar -->
        <div class="bg-[#0D1322] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            <span class="ml-2 font-code text-[11px] text-slate-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px] text-indigo-400">terminal</span>
              Workspace / 45-Day Interview Prep OS
            </span>
          </div>
          <div class="flex items-center gap-2.5">
            <a href="#/dashboard" class="font-code text-[10px] px-2 py-0.5 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium uppercase tracking-wide hover:bg-indigo-500/20 transition-colors flex items-center gap-1">
              <span>Live Dashboard</span>
              <span class="font-mono text-[10px]">→</span>
            </a>
            <span class="material-symbols-outlined text-slate-500 text-[15px]">more_horiz</span>
          </div>
        </div>

        <!-- Inner Prep OS Content -->
        <div class="p-6 md:p-7 space-y-5 bg-[#111827]/80">
          <!-- OS Header Bar with Icon & Title -->
          <div class="flex items-start gap-3.5 pb-4 border-b border-white/[0.08]">
            <div class="w-10 h-10 rounded-md bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <span class="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h2 class="font-headline text-[18px] text-white font-semibold tracking-tight">45-Day Interview Prep OS</h2>
                <span class="px-2 py-0.5 rounded-sm text-[10px] font-code bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-medium uppercase tracking-wider">L5 / L6 TRACK</span>
              </div>
              <p class="font-body text-[13px] text-slate-400 mt-0.5">Single source of truth for daily execution, revision queues, and high-leverage topic mastery.</p>
            </div>
          </div>

          <!-- 45-Day Progress Bar Section -->
          <div class="bg-[#151D2F] border border-white/[0.08] p-4 rounded-md space-y-2.5">
            <div class="flex items-center justify-between text-[12px]">
              <span class="font-medium text-slate-200 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-[#38BDF8]">schedule</span>
                Day 14 of 45 <span class="text-slate-600">•</span> <span class="text-slate-300">Phase 2: System Architecture & Distributed Patterns</span>
              </span>
              <span class="font-code text-[11px] font-semibold text-[#38BDF8]">31% Completed (14/45 Days)</span>
            </div>
            <!-- Segmented Progress Bar -->
            <div class="w-full h-1.5 bg-slate-800 rounded-sm overflow-hidden">
              <div class="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all shadow-[0_0_8px_rgba(56,189,248,0.5)]" style="width: 31%;"></div>
            </div>
            <div class="flex justify-between text-[10px] font-code text-slate-400 pt-0.5">
              <span class="text-indigo-300 font-medium">Phase 1: Core DSA</span>
              <span class="text-cyan-300 font-medium">Phase 2: Advanced Patterns</span>
              <span>Phase 3: System Architecture</span>
              <span>Phase 4: Mock & Polish</span>
            </div>
          </div>

          <!-- KPI Row -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-[#151D2F] p-3 rounded-md border border-white/[0.08]">
              <div class="font-code text-[10px] text-slate-400 uppercase tracking-wider">Today's Target</div>
              <div class="font-headline text-[16px] text-white font-semibold mt-1">2 DSA + 1 Spec</div>
              <div class="font-code text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">check_circle</span> Est. 75 mins
              </div>
            </div>
            <div class="bg-[#151D2F] p-3 rounded-md border border-white/[0.08]">
              <div class="font-code text-[10px] text-slate-400 uppercase tracking-wider">DSA Solved</div>
              <div class="font-headline text-[16px] text-white font-semibold mt-1">48 / 100</div>
              <div class="font-code text-[11px] text-slate-400 mt-0.5">32 Medium • 16 Hard</div>
            </div>
            <div class="bg-[#151D2F] p-3 rounded-md border border-white/[0.08]">
              <div class="font-code text-[10px] text-slate-400 uppercase tracking-wider">System Design Specs</div>
              <div class="font-headline text-[16px] text-white font-semibold mt-1">6 / 12</div>
              <div class="font-code text-[11px] text-cyan-300 mt-0.5">Distributed Lock next</div>
            </div>
            <div class="bg-[#151D2F] p-3 rounded-md border border-white/[0.08]">
              <div class="font-code text-[10px] text-slate-400 uppercase tracking-wider">Spaced Retention</div>
              <div class="font-headline text-[16px] text-white font-semibold mt-1">92%</div>
              <div class="font-code text-[11px] text-emerald-400 mt-0.5">Active recall on track</div>
            </div>
          </div>

          <!-- Split View: Tasks + Radar -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
            <!-- Left Col: Today's Tasks (7 cols) -->
            <div class="md:col-span-7 space-y-2.5">
              <div class="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
                <span class="font-sans text-[13px] text-white flex items-center gap-1.5 font-semibold">
                  <span class="material-symbols-outlined text-[16px] text-indigo-400">checklist</span> Today's Checklist (Day 14)
                </span>
                <span class="font-code text-[11px] bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-sm text-emerald-300 font-medium">2 of 3 Done</span>
              </div>
              <!-- Task Items -->
              <div class="space-y-1.5">
                <div class="flex items-center gap-2.5 p-2 rounded-md bg-[#0D1322]/80 border border-white/[0.06]">
                  <span class="material-symbols-outlined text-emerald-400 text-[18px]">check_box</span>
                  <span class="font-body text-[13px] text-slate-500 line-through">Review LRU Cache & Sliding Window (Hard)</span>
                  <span class="ml-auto text-[10px] font-code bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-sm text-slate-400">DSA</span>
                </div>
                <div class="flex items-center gap-2.5 p-2 rounded-md bg-[#151D2F] border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.15)]">
                  <span class="material-symbols-outlined text-indigo-400 text-[18px]">check_box_outline_blank</span>
                  <span class="font-body text-[13px] text-white font-medium">Distributed Locking with Redis (Redlock vs Consensus)</span>
                  <span class="ml-auto text-[10px] font-code bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-sm border border-indigo-500/30 font-semibold">SYS DESIGN</span>
                </div>
                <div class="flex items-center gap-2.5 p-2 rounded-md bg-[#0D1322]/80 border border-white/[0.06]">
                  <span class="material-symbols-outlined text-emerald-400 text-[18px]">check_box</span>
                  <span class="font-body text-[13px] text-slate-500 line-through">Active Recall Deck: Consistent Hashing & CAP</span>
                  <span class="ml-auto text-[10px] font-code bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-sm text-slate-400">REVISION</span>
                </div>
              </div>
            </div>

            <!-- Right Col: Interview Readiness Radar (5 cols) -->
            <div class="md:col-span-5 bg-[#151D2F] p-3.5 rounded-md border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-1.5">
                  <span class="font-sans text-[13px] text-white font-semibold flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-[#38BDF8]">analytics</span> Readiness Metric
                  </span>
                  <span class="font-code text-[10px] text-slate-400">L6 Target: 80%+</span>
                </div>
                <div class="space-y-2">
                  <div>
                    <div class="flex justify-between font-body text-[11px] mb-1">
                      <span class="text-slate-300">Data Structures & Algo</span>
                      <span class="font-code text-[#38BDF8]">78%</span>
                    </div>
                    <div class="w-full h-1 bg-slate-800 rounded-sm overflow-hidden">
                      <div class="h-full bg-indigo-500" style="width: 78%;"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between font-body text-[11px] mb-1">
                      <span class="text-slate-300">System Architecture</span>
                      <span class="font-code text-[#38BDF8]">82%</span>
                    </div>
                    <div class="w-full h-1 bg-slate-800 rounded-sm overflow-hidden">
                      <div class="h-full bg-cyan-400" style="width: 82%;"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between font-body text-[11px] mb-1">
                      <span class="text-slate-300">Concurrency & Storage</span>
                      <span class="font-code text-slate-400">65%</span>
                    </div>
                    <div class="w-full h-1 bg-slate-800 rounded-sm overflow-hidden">
                      <div class="h-full bg-slate-500" style="width: 65%;"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between font-body text-[11px] mb-1">
                      <span class="text-slate-300">Behavioral & Leadership</span>
                      <span class="font-code text-[#10B981]">88%</span>
                    </div>
                    <div class="w-full h-1 bg-slate-800 rounded-sm overflow-hidden">
                      <div class="h-full bg-emerald-400" style="width: 88%;"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3 pt-2 border-t border-white/[0.08] text-right">
                <span class="font-code text-[10px] text-emerald-400 font-medium">Confidence Velocity: +14% this week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Metric badges below preview -->
      <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-slate-400 font-code text-[12px]">
        <span class="text-slate-300">45 calendar days</span>
        <span class="text-slate-600">•</span>
        <span class="text-slate-300">1 structured system</span>
        <span class="text-slate-600">•</span>
        <span class="text-slate-300">Calculated progression</span>
        <span class="text-slate-600">•</span>
        <span class="text-slate-300">Zero context switching</span>
      </div>
    </section>
  `;
}
