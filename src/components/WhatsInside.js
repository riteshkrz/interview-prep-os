export function renderWhatsInside() {
  return `
    <!-- What's Inside Section -->
    <section class="w-full py-16 bg-[#0D1322] border-y border-white/[0.08]" id="whats-inside">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <span class="font-code text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">Workspace Architecture</span>
          <h2 class="font-headline text-[28px] md:text-[36px] font-semibold text-white mt-1 mb-2.5 tracking-tight">
            Everything You Need to Stay on Track.
          </h2>
          <p class="font-body text-[15px] text-slate-300">
            Six meticulously connected modules that turn chaotic interview prep into a calm, predictable daily routine.
          </p>
        </div>

        <!-- 2x3 Grid of Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Card 1 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#1E293B] transition-all">
            <div>
              <div class="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-3 text-indigo-400">
                <span class="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
              <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">45-Day Roadmap</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Know exactly what to focus on each day without wasting time planning your preparation. Daily breakdown covering arrays, trees, dynamic programming, and systems.
              </p>
            </div>
            <div class="mt-5 pt-3 border-t border-white/[0.08] text-[11px] font-code text-cyan-400 font-medium flex items-center justify-between">
              <span>45 calibrated daily sprints</span>
              <span class="font-mono">→</span>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#1E293B] transition-all">
            <div>
              <div class="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-400">
                <span class="material-symbols-outlined text-[18px]">task_alt</span>
              </div>
              <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">DSA Practice Tracker</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Track problems, patterns, difficulty, confidence, time taken, and key learnings. Structured properties eliminate random LeetCode clicking.
              </p>
            </div>
            <div class="mt-5 pt-3 border-t border-white/[0.08] text-[11px] font-code text-cyan-400 font-medium flex items-center justify-between">
              <span>100 core patterns mapped</span>
              <span class="font-mono">→</span>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#1E293B] transition-all">
            <div>
              <div class="w-8 h-8 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 text-[#38BDF8]">
                <span class="material-symbols-outlined text-[18px]">schema</span>
              </div>
              <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">System Design Workspace</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Practice requirements, capacity estimation, architecture, APIs, databases, caching, scalability, and trade-offs using senior engineering rubrics.
              </p>
            </div>
            <div class="mt-5 pt-3 border-t border-white/[0.08] text-[11px] font-code text-cyan-400 font-medium flex items-center justify-between">
              <span>12 end-to-end templates</span>
              <span class="font-mono">→</span>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#1E293B] transition-all">
            <div>
              <div class="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-3 text-indigo-400">
                <span class="material-symbols-outlined text-[18px]">autorenew</span>
              </div>
              <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">Revision Hub</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Bring back problems and concepts that need another review instead of simply moving on. Built-in 1-day, 3-day, and 7-day spaced repetition triggers.
              </p>
            </div>
            <div class="mt-5 pt-3 border-t border-white/[0.08] text-[11px] font-code text-cyan-400 font-medium flex items-center justify-between">
              <span>Automated review reminders</span>
              <span class="font-mono">→</span>
            </div>
          </div>

          <!-- Card 5 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#1E293B] transition-all">
            <div>
              <div class="w-8 h-8 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3 text-purple-400">
                <span class="material-symbols-outlined text-[18px]">speed</span>
              </div>
              <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">Interview Readiness</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Track your confidence across DSA, System Design, problem solving, communication, and overall readiness with objective radar evaluations.
              </p>
            </div>
            <div class="mt-5 pt-3 border-t border-white/[0.08] text-[11px] font-code text-cyan-400 font-medium flex items-center justify-between">
              <span>Objective confidence score</span>
              <span class="font-mono">→</span>
            </div>
          </div>

          <!-- Card 6 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#1E293B] transition-all">
            <div>
              <div class="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-400">
                <span class="material-symbols-outlined text-[18px]">menu_book</span>
              </div>
              <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">Quick-Start Guide</h3>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                Launch your system and start your focused daily preparation within minutes. Complete video walkthrough and markdown cheatsheets included.
              </p>
            </div>
            <div class="mt-5 pt-3 border-t border-white/[0.08] text-[11px] font-code text-cyan-400 font-medium flex items-center justify-between">
              <span>Under 5-minute setup</span>
              <span class="font-mono">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
