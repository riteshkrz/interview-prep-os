import { state, getMetrics } from './state.js';

export function renderRevisionHub() {
  const problems = state.dsaProblems || [];
  const specs = state.systemSpecs || [];
  const m = getMetrics(state);

  const urgentDsa = problems.filter(p => p.revision && (p.revision.includes('Today') || p.revision.includes('Tomorrow') || p.revision.includes('Urgent')));
  const urgentSpecs = specs.filter(s => s.revision && (s.revision.includes('Today') || s.revision.includes('Tomorrow') || s.revision.includes('Urgent')));
  const dueToday = [...urgentDsa, ...urgentSpecs];

  const oneDayCount = dueToday.length;
  const threeDayCount = problems.filter(p => p.status === 'In Progress').length;
  const sevenDayCount = Math.floor(m.dsaSolved * 0.3);
  const fourteenDayCount = Math.max(0, m.dsaSolved - sevenDayCount);

  return `
    <div id="revision-hub-section" class="bg-[#141C2E] border border-[#24314A] rounded-md p-5 flex flex-col gap-3.5 shadow-sm shadow-black/40">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-[#38BDF8]">replay</span>
          <h2 class="font-sans text-[15px] text-[#F8FAFC] font-bold">Revision Hub</h2>
        </div>
        <span class="font-code text-[10px] text-[#64748B]">Spaced Repetition (SM-2)</span>
      </div>

      <!-- Interval Buckets -->
      <div class="grid grid-cols-4 gap-1.5 bg-[#0F1626] border border-[#24314A] p-1 rounded-md text-center font-code">
        <div class="p-1.5 rounded bg-[#182238] border ${oneDayCount > 0 ? 'border-amber-500/40' : 'border-[#24314A]'} shadow-xs">
          <div class="text-[9px] text-[#94A3B8] font-medium">1-Day</div>
          <div class="text-[13px] font-bold ${oneDayCount > 0 ? 'text-[#F59E0B]' : 'text-slate-400'}">${oneDayCount}</div>
        </div>
        <div class="p-1.5 rounded bg-[#182238] border border-[#24314A]">
          <div class="text-[9px] text-[#94A3B8] font-medium">3-Day</div>
          <div class="text-[13px] font-bold text-[#F8FAFC]">${threeDayCount}</div>
        </div>
        <div class="p-1.5 rounded bg-[#182238] border border-[#24314A]">
          <div class="text-[9px] text-[#94A3B8] font-medium">7-Day</div>
          <div class="text-[13px] font-bold text-[#F8FAFC]">${sevenDayCount}</div>
        </div>
        <div class="p-1.5 rounded bg-[#182238] border border-[#24314A]">
          <div class="text-[9px] text-[#94A3B8] font-medium">14-Day</div>
          <div class="text-[13px] font-bold ${fourteenDayCount > 0 ? 'text-emerald-400' : 'text-slate-400'}">${fourteenDayCount}</div>
        </div>
      </div>

      <!-- Review Cards -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-[10px] font-code text-[#94A3B8] uppercase tracking-wider font-semibold">
          <span>Needs Review Today (${dueToday.length})</span>
          <button id="start-review-drill-btn" class="test-drill-btn text-[#38BDF8] cursor-pointer hover:underline" data-topic="Top Active Patterns">Start Review</button>
        </div>

        ${dueToday.length === 0 ? `
          <div class="p-3 rounded-md bg-[#0F1626] border border-[#24314A] text-center text-[12px] text-slate-400 flex flex-col items-center gap-1">
            <span class="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
            <span>All spaced repetition queues are clear for today.</span>
          </div>
        ` : dueToday.slice(0, 3).map(item => `
          <div class="flex items-center justify-between p-2 rounded-md bg-[#0F1626] border border-[#24314A] hover:border-[#6366F1]/50 transition-colors">
            <div class="flex items-center gap-2 min-w-0">
              <span class="material-symbols-outlined text-[15px] text-[#F59E0B] shrink-0">bolt</span>
              <div class="flex flex-col min-w-0">
                <span class="font-sans text-[12px] font-semibold text-[#F8FAFC] truncate">${escapeHtml(item.title)}</span>
                <span class="font-code text-[9px] text-[#94A3B8] truncate">${escapeHtml(item.pattern || item.domain || 'Algorithm Review')} • ${escapeHtml(item.revision || 'Due')}</span>
              </div>
            </div>
            <button class="test-drill-btn px-2.5 py-0.5 rounded text-[10px] font-code bg-[#182238] border border-[#24314A] text-[#38BDF8] font-semibold hover:bg-[#6366F1] hover:text-white transition-colors shrink-0" data-topic="${escapeHtml(item.title)}">
              Test
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
