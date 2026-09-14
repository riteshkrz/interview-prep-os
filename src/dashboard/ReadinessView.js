/**
 * 45-Day Interview Prep OS - Readiness Assessment Workspace
 * Objective senior-level competency scorecard computing readiness from actual
 * problem completion, system design specs mastered, and sprint velocity.
 */

import { state, getMetrics } from './state.js';

export function renderReadinessView() {
  const m = getMetrics(state);

  const l5Threshold = 70;
  const l6Threshold = 85;
  const currentScore = m.overallReadiness;

  const isL6Ready = currentScore >= l6Threshold;
  const isL5Ready = currentScore >= l5Threshold;

  return `
    <div class="flex flex-col gap-5 w-full animate-fadeIn" id="readiness-view">
      
      <!-- Top Readiness Hero Banner -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-black/40 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col gap-1.5 z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <h1 class="font-sans text-[20px] font-bold text-white tracking-tight">Interview Readiness Radar</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-code bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
              ${isL6Ready ? 'L6 Staff Ready' : isL5Ready ? 'L5 Senior Ready' : 'In Preparation'}
            </span>
          </div>
          <p class="text-[13px] text-slate-400 max-w-2xl leading-relaxed">
            Objective competency scorecard calibrated against FAANG / Tier-1 hiring rubrics for L5 (Senior) and L6 (Staff) engineering levels.
          </p>
        </div>

        <!-- Overall Score Ring -->
        <div class="flex items-center gap-4 bg-[#0F1626] border border-[#24314A] p-4 rounded-xl z-10 shrink-0">
          <div class="flex flex-col items-center">
            <span class="text-[10px] font-code text-slate-400 uppercase tracking-wider">Overall Score</span>
            <span class="text-[32px] font-bold font-code text-white mt-0.5">${currentScore}%</span>
          </div>
          <div class="w-px h-10 bg-[#24314A]"></div>
          <div class="flex flex-col text-[11px] font-code">
            <span class="text-slate-400">Target Level: <strong class="text-[#38BDF8]">L5 / L6</strong></span>
            <span class="text-emerald-400 font-semibold mt-0.5">
              ${currentScore >= 70 ? '✓ Ready for Mock Loops' : 'Sprint In Progress'}
            </span>
          </div>
        </div>
      </div>

      <!-- Competency Pillars Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Pillar 1: Data Structures & Algorithms -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-sm">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-[#38BDF8]">terminal</span>
                Data Structures &amp; Algorithms
              </span>
              <span class="font-code text-[14px] font-bold text-[#38BDF8]">${m.competencyDsa}%</span>
            </div>
            <p class="text-[12px] text-slate-400">
              Mastery across 100 core patterns: Arrays, Sliding Window, Trees, Graphs, DP, and Backtracking.
            </p>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <div class="w-full bg-[#0A0E17] h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-500 to-[#38BDF8] h-full rounded-full transition-all duration-700" style="width: ${m.competencyDsa}%"></div>
            </div>
            <div class="flex items-center justify-between text-[10.5px] font-code text-slate-400">
              <span>Solved: <strong class="text-white">${m.dsaSolved} / ${m.totalDsa}</strong></span>
              <span>L5 Target: <strong class="text-indigo-300">60 Problems</strong></span>
            </div>
          </div>
        </div>

        <!-- Pillar 2: System Architecture -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-sm">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-indigo-400">schema</span>
                System Architecture &amp; Scale
              </span>
              <span class="font-code text-[14px] font-bold text-indigo-300">${m.competencySysDesign}%</span>
            </div>
            <p class="text-[12px] text-slate-400">
              12 High-throughput systems: Sharding, Caching, Event-driven streaming, Consistency &amp; Partitioning.
            </p>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <div class="w-full bg-[#0A0E17] h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full transition-all duration-700" style="width: ${m.competencySysDesign}%"></div>
            </div>
            <div class="flex items-center justify-between text-[10.5px] font-code text-slate-400">
              <span>Mastered: <strong class="text-white">${m.specsSolved} / ${m.totalSpecs}</strong></span>
              <span>L5 Target: <strong class="text-indigo-300">8 Specs</strong></span>
            </div>
          </div>
        </div>

        <!-- Pillar 3: Concurrency & Storage -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-sm">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-emerald-400">hub</span>
                Concurrency &amp; Distributed Storage
              </span>
              <span class="font-code text-[14px] font-bold text-emerald-400">${m.competencyConcurrency}%</span>
            </div>
            <p class="text-[12px] text-slate-400">
              Distributed locks (Redlock), optimistic locking, vector clocks, multi-leader replication, and ACID guarantees.
            </p>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <div class="w-full bg-[#0A0E17] h-2 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-full rounded-full transition-all duration-700" style="width: ${m.competencyConcurrency}%"></div>
            </div>
            <div class="flex items-center justify-between text-[10.5px] font-code text-slate-400">
              <span>Hard Problems: <strong class="text-white">${m.dsaHardSolved} Solved</strong></span>
              <span>Target: <strong class="text-emerald-300">15 Hard</strong></span>
            </div>
          </div>
        </div>

        <!-- Pillar 4: Behavioral & Leadership -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-sm">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-amber-400">military_tech</span>
                Leadership &amp; Behavioral Rubrics
              </span>
              <span class="font-code text-[14px] font-bold text-amber-300">${m.competencyBehavioral}%</span>
            </div>
            <p class="text-[12px] text-slate-400">
              STAR stories: Resolving technical disagreements, handling SEV-1 outages, unblocking cross-functional roadmaps.
            </p>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <div class="w-full bg-[#0A0E17] h-2 rounded-full overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full transition-all duration-700" style="width: ${m.competencyBehavioral}%"></div>
            </div>
            <div class="flex items-center justify-between text-[10.5px] font-code text-slate-400">
              <span>Sprint Progress: <strong class="text-white">Day ${state.activeDay} of 45</strong></span>
              <span>Phase 4 Focus</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Objective Leveling Recommendation -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="font-sans text-[14px] font-bold text-white">Recommended Action Plan for Today:</h3>
          <p class="text-[12px] text-slate-400 mt-0.5">
            ${m.dsaSolved < 20
              ? 'Focus on Phase 1 Core DSA patterns (Two Pointers & Sliding Window) to build momentum.'
              : m.specsSolved < 4
              ? 'Complete 1 System Design Deep Dive (e.g. Distributed Rate Limiter or Bitly) to elevate architecture score.'
              : 'Conduct a timed 45-minute whiteboard mock and review active recall drills.'}
          </p>
        </div>

        <a
          href="#/dashboard"
          data-nav-target="daily-dashboard"
          class="sidebar-nav-item px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[12px] font-semibold transition-colors shrink-0 text-center"
        >
          Go to Today's Sprint →
        </a>
      </div>

    </div>
  `;
}
