export function renderProductShowcase() {
  return `
    <!-- Product Preview Showcase Gallery -->
    <section class="w-full py-16 bg-[#0B0F19]">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6">
        <div class="max-w-3xl mx-auto text-center mb-10">
          <span class="font-code text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">Inside the Prep OS</span>
          <h2 class="font-headline text-[28px] md:text-[36px] font-semibold text-white mt-1 mb-2.5 tracking-tight">
            See What You're Getting.
          </h2>
          <p class="font-body text-[15px] text-slate-300">
            Take a look at the core spaces designed to govern your 45-day preparation sprint.
          </p>
        </div>

        <!-- Tabbed Gallery Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Item 1 -->
          <div class="bg-[#151D2F] rounded-lg border border-white/[0.08] shadow-xs p-5 flex flex-col justify-between hover:border-white/20 transition-all">
            <div class="space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[10px] px-2 py-0.5 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">VIEW 01</span>
                <span class="material-symbols-outlined text-indigo-400 text-[16px]">calendar_today</span>
              </div>
              <h3 class="font-sans text-[16px] font-semibold text-white">45-Day Daily Roadmap</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Daily calendar grid with curated checklists. Eliminates the cognitive burden of deciding what to study every single evening.
              </p>
              <!-- Mini Visual Representation -->
              <div class="bg-[#0D1322] p-3 rounded-md border border-white/[0.08] space-y-2 font-code text-[11px]">
                <div class="flex justify-between items-center text-[10px] text-slate-400 pb-1 border-b border-white/[0.08] uppercase tracking-wider">
                  <span>WEEK 2 SCHEDULE</span>
                  <span class="text-emerald-400 font-medium">5/7 Complete</span>
                </div>
                <div class="grid grid-cols-7 gap-1 text-center text-[10px]">
                  <span class="p-1 rounded-sm bg-[#6366F1] text-white font-medium">D8 ✓</span>
                  <span class="p-1 rounded-sm bg-[#6366F1] text-white font-medium">D9 ✓</span>
                  <span class="p-1 rounded-sm bg-[#6366F1] text-white font-medium">D10 ✓</span>
                  <span class="p-1 rounded-sm bg-[#6366F1] text-white font-medium">D11 ✓</span>
                  <span class="p-1 rounded-sm bg-[#6366F1] text-white font-medium">D12 ✓</span>
                  <span class="p-1 rounded-sm bg-slate-800 border border-white/10 text-slate-200 font-medium">D13</span>
                  <span class="p-1 rounded-sm bg-transparent border border-white/10 text-slate-500">D14</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Item 2 -->
          <div class="bg-[#151D2F] rounded-lg border border-white/[0.08] shadow-xs p-5 flex flex-col justify-between hover:border-white/20 transition-all">
            <div class="space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[10px] px-2 py-0.5 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">VIEW 02</span>
                <span class="material-symbols-outlined text-indigo-400 text-[16px]">terminal</span>
              </div>
              <h3 class="font-sans text-[16px] font-semibold text-white">DSA Practice Matrix</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Rich database table pre-populated with problem tags, pattern classification, optimal time/space complexity fields, and self-review markers.
              </p>
              <!-- Mini Visual Representation -->
              <div class="bg-[#0D1322] p-3 rounded-md border border-white/[0.08] space-y-1.5 font-code text-[11px]">
                <div class="flex items-center justify-between">
                  <span class="text-white font-medium">Merge K Sorted Lists</span>
                  <span class="px-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-sm text-[10px]">Hard</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-white font-medium">Course Schedule (Topological)</span>
                  <span class="px-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-sm text-[10px]">Medium</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-white font-medium">Coin Change II (Knapsack DP)</span>
                  <span class="px-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-sm text-[10px]">Medium</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="bg-[#151D2F] rounded-lg border border-white/[0.08] shadow-xs p-5 flex flex-col justify-between hover:border-white/20 transition-all">
            <div class="space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[10px] px-2 py-0.5 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">VIEW 03</span>
                <span class="material-symbols-outlined text-indigo-400 text-[16px]">schema</span>
              </div>
              <h3 class="font-sans text-[16px] font-semibold text-white">System Design Workspace</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                12 senior-level design specs structured around functional/non-functional requirements, back-of-the-envelope estimations, API contracts, and trade-offs.
              </p>
              <!-- Mini Visual Representation -->
              <div class="bg-[#0D1322] p-3 rounded-md border border-white/[0.08] space-y-1 font-body text-[12px]">
                <div class="flex items-center gap-1.5 font-code text-white text-[11px] font-semibold">
                  <span class="material-symbols-outlined text-[14px] text-emerald-400">check</span> System Rubric Checklist:
                </div>
                <p class="font-code text-[10px] text-slate-400 leading-normal">
                  1. Scope & Estimation • 2. API Design • 3. Data Model • 4. Deep-Dives (Replication & Partitioning)
                </p>
              </div>
            </div>
          </div>

          <!-- Item 4 -->
          <div class="bg-[#151D2F] rounded-lg border border-white/[0.08] shadow-xs p-5 flex flex-col justify-between hover:border-white/20 transition-all">
            <div class="space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[10px] px-2 py-0.5 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">VIEW 04</span>
                <span class="material-symbols-outlined text-indigo-400 text-[16px]">history</span>
              </div>
              <h3 class="font-sans text-[16px] font-semibold text-white">Revision Hub (Spaced Repetition)</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Spaced repetition queue using red/yellow/green mastery tags. Automatically promotes solved problems back to your daily task list on day 1, 3, and 7.
              </p>
              <!-- Mini Visual Representation -->
              <div class="bg-[#0D1322] p-3 rounded-md border border-white/[0.08] space-y-2">
                <div class="flex items-center justify-between font-code text-[10px] text-slate-300">
                  <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Needs Review (2)</span>
                  <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Solid (14)</span>
                  <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Mastered (32)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
