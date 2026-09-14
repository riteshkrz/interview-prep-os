export function renderDatabasePreview() {
  return `
    <!-- Database Preview Section -->
    <section class="w-full py-16 bg-[#0B0F19]">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6">
        <div class="text-center max-w-3xl mx-auto mb-10">
          <span class="font-code text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">Structured Workflow</span>
          <h2 class="font-headline text-[28px] md:text-[36px] font-semibold text-white mt-1 mb-2.5 tracking-tight">
            One System for Your Entire Interview Preparation.
          </h2>
          <p class="font-body text-[15px] text-slate-300">
            Instead of jumping between random resources, use one structured workspace to plan, practice, track, and revise.
          </p>
        </div>

        <!-- Database UI Simulation -->
        <div class="w-full bg-[#151D2F] rounded-lg border border-white/[0.1] shadow-[0_12px_36px_rgba(0,0,0,0.5)] overflow-hidden">
          <!-- Database Header & Tabs -->
          <div class="px-5 py-3 border-b border-white/[0.08] bg-[#0D1322] flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#38BDF8] text-[18px]">table_chart</span>
              <span class="font-sans text-[14px] text-white font-semibold">Curated Preparation Database</span>
            </div>
            <!-- Tabs -->
            <div class="flex items-center p-0.5 bg-[#111827] rounded-md font-sans text-[12px] border border-white/[0.08]" id="db-preview-tabs">
              <button class="px-2.5 py-1 rounded-sm bg-[#1E293B] text-white font-medium flex items-center gap-1.5 shadow-xs border border-white/10 tab-btn active" data-tab="dsa">
                <span>DSA Tracker</span>
                <span class="text-[10px] px-1 bg-indigo-500/20 text-indigo-300 rounded-sm font-code">100</span>
              </button>
              <button class="px-2.5 py-1 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 tab-btn" data-tab="sysdesign">
                <span>System Design</span>
                <span class="text-[10px] px-1 bg-white/5 text-slate-400 rounded-sm font-code">12</span>
              </button>
              <button class="px-2.5 py-1 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 tab-btn" data-tab="revision">
                <span>Revision Hub</span>
                <span class="text-[10px] px-1 bg-rose-500/20 text-rose-300 rounded-sm font-code">4 Due</span>
              </button>
              <button class="px-2.5 py-1 text-slate-400 hover:text-white transition-colors tab-btn" data-tab="velocity">
                <span>Progress & Velocity</span>
              </button>
            </div>
          </div>

          <!-- Database Toolbar -->
          <div class="px-5 py-2 bg-[#111827] border-b border-white/[0.08] flex items-center justify-between text-[12px] text-slate-400">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1 cursor-pointer hover:text-white transition-colors font-code">
                <span class="material-symbols-outlined text-[14px] text-indigo-400">filter_list</span> Filter: High-Frequency Patterns
              </span>
              <span class="flex items-center gap-1 cursor-pointer hover:text-white transition-colors font-code">
                <span class="material-symbols-outlined text-[14px] text-indigo-400">swap_vert</span> Sort: Next Revision (Asc)
              </span>
            </div>
            <div class="flex items-center gap-2 font-code text-[11px] text-slate-400">
              <span class="material-symbols-outlined text-[14px]">search</span>
              <span id="db-item-count">100 items</span>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left font-body text-[13px]">
              <thead class="bg-[#0D1322] text-slate-400 border-b border-white/[0.08] font-code text-[11px] uppercase tracking-wider">
                <tr>
                  <th class="py-2.5 px-5 font-medium">Problem / System Spec</th>
                  <th class="py-2.5 px-4 font-medium">Status</th>
                  <th class="py-2.5 px-4 font-medium">Pattern / Domain</th>
                  <th class="py-2.5 px-4 font-medium">Difficulty</th>
                  <th class="py-2.5 px-4 font-medium">Confidence</th>
                  <th class="py-2.5 px-4 font-medium">Spaced Revision</th>
                  <th class="py-2.5 px-5 font-medium text-right">Time Spent</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/[0.06] text-slate-300 font-normal">
                <!-- Row 1 -->
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-[15px] text-indigo-400">article</span>
                    LRU Cache Implementation
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Mastered
                    </span>
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Hash + Doubly LL</span>
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-amber-300 bg-amber-500/10 border border-amber-500/20">Medium</span>
                  </td>
                  <td class="py-2.5 px-4 text-amber-400 text-[11px]">
                    ★★★★★
                  </td>
                  <td class="py-2.5 px-4 font-code text-[11px] text-slate-300">
                    In 7 days (Aug 24)
                  </td>
                  <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-400">
                    24m
                  </td>
                </tr>
                <!-- Row 2 -->
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-[15px] text-indigo-400">article</span>
                    Design a Distributed Rate Limiter
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> In Progress
                    </span>
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Token Bucket / Redis</span>
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-rose-300 bg-rose-500/10 border border-rose-500/20 font-medium">Hard</span>
                  </td>
                  <td class="py-2.5 px-4 text-amber-400 text-[11px]">
                    ★★★☆☆
                  </td>
                  <td class="py-2.5 px-4 font-code text-[11px] text-rose-400 font-medium">
                    Tomorrow (Urgent)
                  </td>
                  <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-400">
                    45m
                  </td>
                </tr>
                <!-- Row 3 -->
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-[15px] text-indigo-400">article</span>
                    Minimum Window Substring
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Mastered
                    </span>
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Sliding Window</span>
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-rose-300 bg-rose-500/10 border border-rose-500/20 font-medium">Hard</span>
                  </td>
                  <td class="py-2.5 px-4 text-amber-400 text-[11px]">
                    ★★★★☆
                  </td>
                  <td class="py-2.5 px-4 font-code text-[11px] text-slate-300">
                    In 3 days
                  </td>
                  <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-400">
                    31m
                  </td>
                </tr>
                <!-- Row 4 -->
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="py-2.5 px-5 font-medium text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-[15px] text-indigo-400">article</span>
                    Design Ticketmaster / Flash Sale System
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-code bg-white/5 text-slate-400 border border-white/10">
                      <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Queued
                    </span>
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="px-1.5 py-0.5 rounded-sm text-[11px] bg-white/5 font-code text-slate-300 border border-white/10">Distributed Concurrency</span>
                  </td>
                  <td class="py-2.5 px-4">
                    <span class="px-1.5 py-0.5 rounded-sm text-[11px] font-code text-rose-300 bg-rose-500/10 border border-rose-500/20 font-medium">Hard</span>
                  </td>
                  <td class="py-2.5 px-4 text-slate-600 text-[11px]">
                    ★★☆☆☆
                  </td>
                  <td class="py-2.5 px-4 font-code text-[11px] text-slate-400">
                    Day 17
                  </td>
                  <td class="py-2.5 px-5 text-right font-code text-[11px] text-slate-500">
                    —
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer Calculation Bar -->
          <div class="px-5 py-2.5 bg-[#0D1322] border-t border-white/[0.08] flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-code gap-2">
            <span class="text-slate-300 font-medium">+ Calculate Average Time: 33.3 mins</span>
            <a href="#/dashboard" class="text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 font-semibold">
              <span>Open Live User Dashboard</span>
              <span class="font-mono">→</span>
            </a>
            <span id="db-footer-showing">Showing 4 of 100 entries</span>
          </div>
        </div>
      </div>
    </section>
  `;
}
