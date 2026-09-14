export function renderHowItWorks() {
  return `
    <!-- How It Works Section -->
    <section class="w-full py-16 bg-[#0B0F19]" id="how-it-works">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <span class="font-code text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">Daily Execution Loop</span>
          <h2 class="font-headline text-[28px] md:text-[36px] font-semibold text-white mt-1 mb-2.5 tracking-tight">
            Your Preparation, Simplified.
          </h2>
          <p class="font-body text-[15px] text-slate-300">
            A zero-friction 4-step loop designed for engineers with full-time workloads.
          </p>
        </div>

        <!-- Horizontal 4-Step Process -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Step 1 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs hover:border-indigo-500/30 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="font-code text-[11px] font-semibold text-indigo-300 px-2 py-0.5 rounded-sm bg-indigo-500/10 border border-indigo-500/30">STEP 01</span>
              <span class="font-code text-[11px] text-slate-400">PLAN</span>
            </div>
            <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">Open</h3>
            <p class="font-body text-[13px] text-slate-300 leading-relaxed">
              Check today's preparation plan. No debating which topic to pick. Day 14 shows exactly: 2 LeetCode problems and 1 distributed system pattern.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs hover:border-indigo-500/30 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="font-code text-[11px] font-semibold text-cyan-300 px-2 py-0.5 rounded-sm bg-cyan-500/10 border border-cyan-500/30">STEP 02</span>
              <span class="font-code text-[11px] text-slate-400">EXEC</span>
            </div>
            <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">Practice</h3>
            <p class="font-body text-[13px] text-slate-300 leading-relaxed">
              Solve problems and practice System Design in a focused 45–60 minute session using structured frameworks instead of memorizing code.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs hover:border-indigo-500/30 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="font-code text-[11px] font-semibold text-emerald-300 px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/30">STEP 03</span>
              <span class="font-code text-[11px] text-slate-400">LOG</span>
            </div>
            <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">Track</h3>
            <p class="font-body text-[13px] text-slate-300 leading-relaxed">
              Record your progress, learnings, edge cases, and weak areas in one click. Note trade-offs and confidence scores for each item.
            </p>
          </div>

          <!-- Step 4 -->
          <div class="bg-[#151D2F] p-5 rounded-lg border border-white/[0.08] shadow-xs hover:border-indigo-500/30 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="font-code text-[11px] font-semibold text-purple-300 px-2 py-0.5 rounded-sm bg-purple-500/10 border border-purple-500/30">STEP 04</span>
              <span class="font-code text-[11px] text-slate-400">RECALL</span>
            </div>
            <h3 class="font-sans text-[15px] font-semibold text-white mb-1.5">Revise</h3>
            <p class="font-body text-[13px] text-slate-300 leading-relaxed">
              Revisit what you struggled with via spaced repetition. Weak topics automatically queue up so you never enter an interview unprepared.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}
