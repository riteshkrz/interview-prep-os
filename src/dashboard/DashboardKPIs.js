import { state, getMetrics } from './state.js';

export function renderDashboardKPIs() {
  const currentPlan = state.curriculum[state.activeDay] || {};
  const m = getMetrics(state);

  const headlineTarget = currentPlan.headlineTarget || '2 DSA + 1 Spec';
  const estTime = currentPlan.estTime || '75 mins';

  const nextSpec = (state.systemSpecs || []).find(s => s.status !== 'Mastered');
  const nextSpecName = nextSpec ? nextSpec.title : 'All Specs Mastered!';

  return `
    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Widget 1: Today's Target -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-md p-4 flex flex-col justify-between gap-3 hover:border-[#6366F1]/50 transition-colors shadow-xs">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="font-code text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Today's Target</span>
            <div class="font-sans text-[16px] text-[#F8FAFC] font-bold mt-1">${escapeHtml(headlineTarget)}</div>
          </div>
          <span class="p-1.5 rounded bg-[#182238] text-[#38BDF8] border border-[#24314A]">
            <span class="material-symbols-outlined text-[16px]">task_alt</span>
          </span>
        </div>
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between font-code text-[11px]">
            <span class="text-[#94A3B8]">Est. ${escapeHtml(estTime)}</span>
            <span class="px-1.5 py-0.2 rounded bg-[#182238] border border-[#24314A] text-[#38BDF8] text-[10px] font-semibold">${m.completedTasks}/${m.totalTasks} Done</span>
          </div>
          <div class="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#38BDF8] h-full rounded-full transition-all duration-500" style="width: ${m.taskPct}%"></div>
          </div>
        </div>
      </div>

      <!-- Widget 2: DSA Solved -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-md p-4 flex flex-col justify-between gap-3 hover:border-[#6366F1]/50 transition-colors shadow-xs">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="font-code text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">DSA Solved</span>
            <div class="flex items-baseline gap-1.5 mt-1">
              <span class="font-code text-[20px] text-[#F8FAFC] font-bold">${m.dsaSolved}</span>
              <span class="font-code text-[11px] text-[#64748B]">/ ${m.totalDsa} Target</span>
            </div>
          </div>
          <span class="p-1.5 rounded bg-[#182238] text-[#818CF8] border border-[#24314A]">
            <span class="material-symbols-outlined text-[16px]">code_blocks</span>
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between font-code text-[10px] text-[#94A3B8]">
            <span>${m.dsaMedSolved} Med</span>
            <span class="text-[#24314A]">•</span>
            <span class="text-[#F59E0B] font-semibold">${m.dsaHardSolved} Hard</span>
            <span class="text-[#24314A]">•</span>
            <span>${m.dsaEasySolved} Easy</span>
          </div>
          <div class="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden flex">
            <div class="bg-gradient-to-r from-[#38BDF8] to-[#818CF8] h-full rounded-full transition-all duration-500" style="width: ${m.dsaPct}%"></div>
          </div>
        </div>
      </div>

      <!-- Widget 3: System Design Specs -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-md p-4 flex flex-col justify-between gap-3 hover:border-[#6366F1]/50 transition-colors shadow-xs">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="font-code text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">System Design Specs</span>
            <div class="flex items-baseline gap-1.5 mt-1">
              <span class="font-code text-[20px] text-[#F8FAFC] font-bold">${m.specsSolved}</span>
              <span class="font-code text-[11px] text-[#64748B]">/ ${m.totalSpecs} Deep Dives</span>
            </div>
          </div>
          <span class="p-1.5 rounded bg-[#182238] text-[#38BDF8] border border-[#24314A]">
            <span class="material-symbols-outlined text-[16px]">hub</span>
          </span>
        </div>
        <div class="flex items-center justify-between text-[11px]">
          <span class="font-sans text-[#94A3B8] truncate max-w-[160px]" title="${escapeHtml(nextSpecName)}">Next: ${escapeHtml(nextSpecName)}</span>
          <span class="font-code text-[#38BDF8] font-semibold flex items-center gap-0.5 text-[10px]">
            <span class="material-symbols-outlined text-[12px]">arrow_forward</span> In Queue
          </span>
        </div>
      </div>

      <!-- Widget 4: Readiness & Retention -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-md p-4 flex flex-col justify-between gap-3 hover:border-[#6366F1]/50 transition-colors shadow-xs">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="font-code text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Readiness Score</span>
            <div class="flex items-baseline gap-1.5 mt-1">
              <span class="font-code text-[20px] text-[#F8FAFC] font-bold">${m.overallReadiness}%</span>
              <span class="font-code text-[10px] ${m.overallReadiness > 60 ? 'text-[#10B981] bg-emerald-500/15 border border-emerald-500/30' : 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30'} px-1.5 py-0.2 rounded font-semibold">
                ${m.overallReadiness >= 75 ? 'Interview Ready' : m.overallReadiness >= 40 ? 'On Track' : 'Building Foundations'}
              </span>
            </div>
          </div>
          <span class="p-1.5 rounded bg-[#182238] text-[#10B981] border border-[#24314A]">
            <span class="material-symbols-outlined text-[16px]">neurology</span>
          </span>
        </div>
        <div class="flex items-center justify-between text-[11px] font-sans text-[#94A3B8]">
          <span>Spaced review queue</span>
          <span class="font-code text-[#F59E0B] font-semibold text-[10px]">${m.dueTodayCount} Due Review</span>
        </div>
      </div>
    </section>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
