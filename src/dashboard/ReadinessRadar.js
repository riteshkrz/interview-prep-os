import { state, getMetrics } from './state.js';

export function renderReadinessRadar() {
  const m = getMetrics(state);
  const comp = {
    dsa: m.competencyDsa,
    sysDesign: m.competencySysDesign,
    concurrency: m.competencyConcurrency,
    behavioral: m.competencyBehavioral
  };

  const calibrationNote = m.dsaSolved < 20
    ? 'Phase 1 in progress. Build core algorithmic fluency in two pointers and sliding window.'
    : m.specsSolved < 4
    ? 'System design is current velocity bottleneck. Prioritize consensus algorithms & sharding tradeoffs in Phase 2.'
    : 'Strong dual competency across algorithms and distributed architecture. Calibrated for L5/L6 interviews.';

  return `
    <div id="readiness-radar-section" class="bg-[#141C2E] border border-[#24314A] rounded-md p-5 flex flex-col gap-3.5 shadow-sm shadow-black/40">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-[#38BDF8]">radar</span>
          <h2 class="font-sans text-[15px] text-[#F8FAFC] font-bold">Interview Readiness Radar</h2>
        </div>
        <span class="font-code text-[10px] text-[#10B981] bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">+8% this wk</span>
      </div>

      <!-- Benchmarks -->
      <div class="flex flex-col gap-3">
        <!-- Bar 1: DSA (Cyan) -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between text-[12px]">
            <span class="text-[#F8FAFC] font-medium">Data Structures &amp; Algo</span>
            <div class="flex items-center gap-1 font-code text-[11px]">
              <span class="font-bold text-[#38BDF8]">${comp.dsa}%</span>
              <span class="text-[#64748B] text-[10px]">(Goal: 80%)</span>
            </div>
          </div>
          <div class="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#38BDF8] h-full rounded-full transition-all duration-700 shadow-sm shadow-[#38BDF8]/40" style="width: ${comp.dsa}%"></div>
          </div>
        </div>

        <!-- Bar 2: Architecture (Indigo) -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between text-[12px]">
            <span class="text-[#F8FAFC] font-medium">System Architecture</span>
            <div class="flex items-center gap-1 font-code text-[11px]">
              <span class="font-bold text-[#818CF8]">${comp.sysDesign}%</span>
              <span class="text-[#64748B] text-[10px]">(Goal: 70%)</span>
            </div>
          </div>
          <div class="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#818CF8] h-full rounded-full transition-all duration-700 shadow-sm shadow-[#818CF8]/40" style="width: ${comp.sysDesign}%"></div>
          </div>
        </div>

        <!-- Bar 3: Concurrency -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between text-[12px]">
            <span class="text-[#F8FAFC] font-medium">Concurrency &amp; Storage</span>
            <div class="flex items-center gap-1 font-code text-[11px]">
              <span class="font-bold text-[#6366F1]">${comp.concurrency}%</span>
              <span class="text-[#64748B] text-[10px]">(Goal: 70%)</span>
            </div>
          </div>
          <div class="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#6366F1] h-full rounded-full transition-all duration-700 shadow-sm shadow-[#6366F1]/40" style="width: ${comp.concurrency}%"></div>
          </div>
        </div>

        <!-- Bar 4: Behavioral (Emerald) -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between text-[12px]">
            <span class="text-[#F8FAFC] font-medium">Behavioral &amp; Leadership (STAR)</span>
            <div class="flex items-center gap-1 font-code text-[11px]">
              <span class="font-bold text-[#34D399]">${comp.behavioral}%</span>
              <span class="text-[#64748B] text-[10px]">(Goal: 80%)</span>
            </div>
          </div>
          <div class="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#34D399] h-full rounded-full transition-all duration-700 shadow-sm shadow-[#34D399]/40" style="width: ${comp.behavioral}%"></div>
          </div>
        </div>
      </div>

      <!-- Calibration Callout -->
      <div class="p-2.5 bg-[#0F1626] border border-[#24314A] rounded-md flex items-start gap-2">
        <span class="material-symbols-outlined text-[16px] text-[#38BDF8] mt-0.5">insights</span>
        <div class="flex flex-col">
          <span class="font-code text-[10px] text-[#38BDF8] font-bold uppercase tracking-wider">FAANG Calibration Note</span>
          <span class="font-sans text-[11px] text-[#94A3B8] leading-relaxed mt-0.5">${calibrationNote}</span>
        </div>
      </div>
    </div>
  `;
}
