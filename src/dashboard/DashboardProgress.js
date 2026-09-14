import { state } from './state.js';

export function renderDashboardProgress() {
  const currentPlan = state.curriculum[state.activeDay] || {};
  const currentPhase = currentPlan.phase || 'Phase 2: Advanced Patterns & Distributed Systems';
  const completedPct = Math.round((state.activeDay / state.totalDays) * 100);

  // Milestones calculation
  const w1Done = state.activeDay > 10;
  const w2Active = state.activeDay >= 11 && state.activeDay <= 22;
  const w2Done = state.activeDay > 22;
  const w3Active = state.activeDay >= 23 && state.activeDay <= 35;
  const w3Done = state.activeDay > 35;
  const w4Active = state.activeDay >= 36;

  // Render 45 clickable day chips
  const dayChipsHtml = Array.from({ length: 45 }, (_, i) => {
    const dayNum = i + 1;
    const isActive = dayNum === state.activeDay;
    const isPast = dayNum < state.activeDay;
    return `
      <button class="day-chip shrink-0 px-2 py-0.5 rounded text-[10px] font-code transition-all ${
        isActive
          ? 'bg-[#6366F1] text-white font-semibold shadow-xs shadow-[#6366F1]/50 border border-indigo-400/50 scale-105'
          : isPast
          ? 'bg-[#182238] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#24314A]'
          : 'bg-[#0F1626] text-[#64748B] hover:text-[#94A3B8] border border-[#24314A]/60'
      }" data-jump-day="${dayNum}" title="Day ${dayNum}: ${escapeHtml(state.curriculum[dayNum]?.topic || '')}">
        ${isPast ? '✓ ' : ''}D${dayNum}
      </button>
    `;
  }).join('');

  return `
    <section class="bg-[#141C2E] border border-[#24314A] rounded-md p-5 flex flex-col gap-4 shadow-sm shadow-black/40">
      <!-- Title, Badges & Streak Row -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="flex items-center justify-center w-6 h-6 rounded bg-[#6366F1]/20 border border-[#6366F1]/40 text-[#818CF8]">
              <span class="material-symbols-outlined text-[15px]">bolt</span>
            </span>
            <h1 class="font-sans text-[20px] text-[#F8FAFC] font-bold tracking-tight">45-Day Interview Prep OS</h1>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold font-code bg-[#182238] text-[#38BDF8] border border-[#24314A]">L5 / L6 Track</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold font-code bg-emerald-500/15 text-[#10B981] border border-emerald-500/30 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-xs shadow-emerald-500/50"></span>
              Active Sprint
            </span>
          </div>
          <p class="font-sans text-[13px] text-[#94A3B8] max-w-3xl leading-relaxed">
            Single source of truth for daily execution, revision queues, and high-leverage architectural mastery.
          </p>
        </div>

        <!-- Streak & Action -->
        <div class="flex items-center gap-2.5 self-start lg:self-center">
          <div class="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0F1626] border border-[#24314A]">
            <span class="material-symbols-outlined text-[16px] text-[#F59E0B]">local_fire_department</span>
            <div class="flex items-baseline gap-1">
              <span class="font-code text-[12px] text-[#F8FAFC] font-bold leading-none">${state.streak} Days</span>
              <span class="font-code text-[9px] text-[#94A3B8] uppercase">Streak</span>
            </div>
          </div>
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#6366F1] text-white font-sans text-[12px] font-semibold hover:bg-[#4F46E5] shadow-sm shadow-[#6366F1]/40 transition-colors" id="quick-log-btn">
            <span class="material-symbols-outlined text-[14px]">add</span>
            <span>Log Entry</span>
          </button>
        </div>
      </div>

      <!-- Linear Milestone Timeline -->
      <div class="flex flex-col gap-2 bg-[#0F1626] border border-[#24314A] p-3.5 rounded-md">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div class="flex items-center gap-2">
            <span class="font-code text-[12px] font-semibold text-[#F8FAFC]">Day ${state.activeDay} of 45</span>
            <span class="text-[#64748B]">•</span>
            <span class="font-sans text-[12px] text-[#94A3B8]">${escapeHtml(currentPhase)}</span>
          </div>
          <div class="flex items-center gap-1.5 font-code text-[11px] text-[#94A3B8]">
            <span class="font-bold text-[#38BDF8]">${completedPct}% Completed</span>
            <span class="text-[#64748B]">(${state.activeDay} / 45 Days)</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-[#0A0E17] h-2 rounded-full overflow-hidden flex border border-[#24314A]/40">
          <div class="bg-gradient-to-r from-[#38BDF8] via-[#6366F1] to-[#818CF8] h-full rounded-full transition-all duration-500 shadow-sm shadow-[#38BDF8]/40" style="width: ${completedPct}%;"></div>
        </div>

        <!-- Milestone Markers -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[#24314A]/60 mt-0.5">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px] ${w1Done ? 'text-[#10B981]' : 'text-[#38BDF8]'}">
              ${w1Done ? 'check_circle' : 'radio_button_checked'}
            </span>
            <div class="flex flex-col">
              <span class="font-sans text-[11px] font-semibold text-[#F8FAFC]">W1: Core DSA</span>
              <span class="font-code text-[9px] ${w1Done ? 'text-[#10B981]' : 'text-[#38BDF8]'} font-semibold">
                ${w1Done ? 'Done (100%)' : 'In Progress'}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px] ${w2Done ? 'text-[#10B981]' : w2Active ? 'text-[#38BDF8]' : 'text-[#64748B]'}">
              ${w2Done ? 'check_circle' : 'radio_button_checked'}
            </span>
            <div class="flex flex-col">
              <span class="font-sans text-[11px] font-semibold text-[#F8FAFC]">W2: Patterns & Heaps</span>
              <span class="font-code text-[9px] ${w2Done ? 'text-[#10B981]' : 'text-[#38BDF8]'} font-medium">
                ${w2Done ? 'Done' : 'In Flight (Day 14)'}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px] ${w3Done ? 'text-[#10B981]' : w3Active ? 'text-[#38BDF8]' : 'text-[#64748B]'}">
              ${w3Done ? 'check_circle' : 'schedule'}
            </span>
            <div class="flex flex-col">
              <span class="font-sans text-[11px] font-medium text-[#94A3B8]">W3: System Design</span>
              <span class="font-code text-[9px] text-[#64748B]">${w3Done ? 'Done' : w3Active ? 'Active' : 'Starts Day 23'}</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px] ${w4Active ? 'text-[#38BDF8]' : 'text-[#64748B]'}">flag</span>
            <div class="flex flex-col">
              <span class="font-sans text-[11px] font-medium text-[#94A3B8]">W4: Mocks & Polish</span>
              <span class="font-code text-[9px] text-[#64748B]">FAANG Calibration</span>
            </div>
          </div>
        </div>

        <!-- 45-Day Clickable Timeline Strip -->
        <div class="pt-2 border-t border-[#24314A]/40 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span class="font-code text-[9px] text-[#64748B] uppercase tracking-wider shrink-0 mr-1">Day Picker:</span>
          ${dayChipsHtml}
        </div>
      </div>
    </section>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
