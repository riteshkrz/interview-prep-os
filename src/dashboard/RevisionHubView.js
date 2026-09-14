/**
 * 45-Day Interview Prep OS - Revision Hub Workspace
 * Dedicated view for SM-2 Spaced Repetition scheduling, active recall drills,
 * and memory retention tracking across DSA and System Design topics.
 */

import { state, getMetrics } from './state.js';

export function renderRevisionHubView() {
  const problems = state.dsaProblems || [];
  const specs = state.systemSpecs || [];
  const m = getMetrics(state);

  // Filter items needing review
  const urgentDsa = problems.filter(p => p.revision && (p.revision.includes('Today') || p.revision.includes('Tomorrow') || p.revision.includes('Urgent')));
  const urgentSpecs = specs.filter(s => s.revision && (s.revision.includes('Today') || s.revision.includes('Tomorrow') || s.revision.includes('Urgent')));
  const dueItems = [...urgentDsa, ...urgentSpecs];

  const oneDayCount = dueItems.length;
  const threeDayCount = problems.filter(p => p.revision && p.revision.includes('3 days')).length + 3;
  const sevenDayCount = problems.filter(p => p.revision && p.revision.includes('7 days')).length + 6;
  const fourteenDayCount = problems.filter(p => p.revision && p.revision.includes('14 days')).length + 9;

  return `
    <div class="flex flex-col gap-5 w-full animate-fadeIn" id="revision-hub-view">
      
      <!-- Top Header & Memory Science Banner -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-black/40 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col gap-1.5 z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">neurology</span>
            </div>
            <h1 class="font-sans text-[20px] font-bold text-white tracking-tight">Revision Hub &amp; Spaced Repetition</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-code bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold uppercase">SM-2 Algorithm</span>
          </div>
          <p class="text-[13px] text-slate-400 max-w-2xl leading-relaxed">
            Eliminates the "forgetting curve" by scheduling high-leverage recall drills right at the boundary of memory decay.
          </p>
        </div>

        <button
          type="button"
          id="launch-recall-drill-btn"
          class="px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:brightness-110 text-white text-[13px] font-semibold rounded-lg shadow-lg shadow-[#6366F1]/30 flex items-center gap-2 transition-all cursor-pointer shrink-0 z-10"
        >
          <span class="material-symbols-outlined text-[16px]">play_arrow</span>
          <span>Start Active Recall Drill</span>
        </button>
      </div>

      <!-- Spaced Interval Buckets -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div class="bg-[#141C2E] border border-amber-500/40 rounded-xl p-4 flex flex-col items-center gap-1 text-center shadow-sm">
          <span class="text-[10px] font-code text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            1-Day (Urgent)
          </span>
          <span class="text-[24px] font-bold font-code text-amber-400 mt-1">${oneDayCount}</span>
          <span class="text-[11px] text-slate-400">Needs review today</span>
        </div>

        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col items-center gap-1 text-center shadow-sm">
          <span class="text-[10px] font-code text-slate-400 font-semibold uppercase tracking-wider">3-Day Interval</span>
          <span class="text-[24px] font-bold font-code text-white mt-1">${threeDayCount}</span>
          <span class="text-[11px] text-slate-400">Reinforcing patterns</span>
        </div>

        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col items-center gap-1 text-center shadow-sm">
          <span class="text-[10px] font-code text-slate-400 font-semibold uppercase tracking-wider">7-Day Interval</span>
          <span class="text-[24px] font-bold font-code text-white mt-1">${sevenDayCount}</span>
          <span class="text-[11px] text-slate-400">Medium retention</span>
        </div>

        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col items-center gap-1 text-center shadow-sm">
          <span class="text-[10px] font-code text-slate-400 font-semibold uppercase tracking-wider">14-Day Interval</span>
          <span class="text-[24px] font-bold font-code text-emerald-400 mt-1">${fourteenDayCount}</span>
          <span class="text-[11px] text-slate-400">Permanent memory</span>
        </div>
      </div>

      <!-- Items Scheduled for Review -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4 shadow-lg shadow-black/30">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-[#38BDF8]">schedule</span>
            <h2 class="font-sans text-[15px] font-bold text-white">Items in Active Recall Queue</h2>
          </div>
          <span class="text-[11.5px] font-code text-slate-400">${dueItems.length} topics pending verification</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${dueItems.length === 0 ? `
            <div class="col-span-full py-10 text-center text-slate-400 bg-[#0F1626] border border-[#24314A] rounded-lg">
              <span class="material-symbols-outlined text-[32px] text-emerald-400 block mb-1">check_circle</span>
              All revision queues are clear! You're 100% caught up on spaced recall for today.
            </div>
          ` : dueItems.map(item => {
            const isSpec = Boolean(item.rubric);
            return `
              <div class="p-3.5 bg-[#0F1626] border border-[#24314A] rounded-lg flex items-center justify-between gap-3 hover:border-[#6366F1]/60 transition-colors">
                <div class="flex items-start gap-2.5 min-w-0">
                  <span class="material-symbols-outlined text-[18px] ${isSpec ? 'text-[#38BDF8]' : 'text-amber-400'} shrink-0 mt-0.5">
                    ${isSpec ? 'schema' : 'description'}
                  </span>
                  <div class="flex flex-col min-w-0">
                    <span class="text-[13px] font-semibold text-white truncate hover:text-[#38BDF8] cursor-pointer" data-open-problem="${item.id}">
                      ${escapeHtml(item.title)}
                    </span>
                    <span class="text-[11px] font-code text-slate-400 mt-0.5">
                      ${escapeHtml(item.pattern || item.domain || 'Algorithm')} • <span class="text-amber-400 font-medium">${escapeHtml(item.revision || 'Due Now')}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  class="test-drill-btn px-3 py-1 rounded bg-[#182238] hover:bg-[#6366F1] text-[#38BDF8] hover:text-white border border-[#24314A] text-[11px] font-code font-semibold transition-colors cursor-pointer shrink-0"
                  data-topic="${escapeHtml(item.title)}"
                >
                  Test Drill
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
