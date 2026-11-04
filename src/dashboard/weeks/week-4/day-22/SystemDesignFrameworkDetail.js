/**
 * Part I — The System Design Interview Framework
 * Pages 9–11 of the System Design Interview Masterclass.
 * Covers:
 * 1. How to approach any system design problem (7 Steps)
 * 2. The standard interview answer template (13-Row Matrix)
 * 3. What to write versus what to explain verbally
 * 4. Suggested timing for a 45-minute interview
 */

export function renderSystemDesignFrameworkContent() {
  const steps = [
    {
      num: 1,
      title: "Pin down the problem and its boundaries",
      desc: "Clarify users, primary use cases, constraints, and excluded features. Ask questions only when the reply could reshape the architecture."
    },
    {
      num: 2,
      title: "Capture functional and non-functional requirements",
      desc: "Keep functional requirements—capabilities the system must deliver—distinct from non-functional requirements—how well it must run in terms of reliability, security, and efficiency."
    },
    {
      num: 3,
      title: "Rough out scale and traffic",
      desc: "Estimate traffic, storage, bandwidth, and read/write patterns. Use the numbers to justify design choices instead of stating them without context."
    },
    {
      num: 4,
      title: "Specify the API and data model",
      desc: "Explain how clients call the system, name the core entities, and flag where correctness depends on transactions or constraints."
    },
    {
      num: 5,
      title: "Sketch the high-level architecture",
      desc: "List the main services, databases, caches, queues, and external systems, then follow the primary read and write paths."
    },
    {
      num: 6,
      title: "Drill into the hardest components",
      desc: "Cover scaling, consistency, concurrency, failure recovery, security, and observability, starting with the hardest areas."
    },
    {
      num: 7,
      title: "Discuss trade-offs and refine the design",
      desc: "Weigh realistic alternatives and describe how the design shifts when traffic, latency, cost, availability, or correctness requirements change."
    }
  ];

  const templateRows = [
    { topic: "Stated problem", includes: "Purpose of the system and what is in scope" },
    { topic: "Scope-narrowing questions", includes: "Items that could change requirements or architecture, with assumptions written down" },
    { topic: "Required behaviors", includes: "Must-have capabilities visible to users" },
    { topic: "Quality attributes", includes: "Scalability, latency, availability, consistency, durability, and security" },
    { topic: "Back-of-envelope capacity", includes: "Request rate, storage, and bandwidth figures when they add value" },
    { topic: "API surface", includes: "API endpoints, sample requests and responses, plus error-handling behavior" },
    { topic: "Persistent entities", includes: "Entities, relationships, keys, and constraints" },
    { topic: "System overview diagram", includes: "Primary building blocks and how they interact" },
    { topic: "Incremental design walkthrough", includes: "Failure, background, update, read, and create flows" },
    { topic: "Rationale for each component", includes: "What problem each technology or component solves" },
    { topic: "Design compromises", includes: "Other options, upsides, downsides, and costs" },
    { topic: "Handling failures", includes: "Observability, recovery, idempotency, timeouts, and retries" },
    { topic: "Likely follow-up questions", includes: "How the solution adapts under new constraints" }
  ];

  const timingRows = [
    { minutes: "First 0–5 min", focus: "Scoping and clarifying questions" },
    { minutes: "Next 5–10 min", focus: "Requirements plus capacity estimates" },
    { minutes: "Next 10–15 min", focus: "High-level design together with the data model and APIs" },
    { minutes: "Next 15–30 min", focus: "Deep dive on critical components" },
    { minutes: "Next 30–40 min", focus: "Trade-offs together with failure handling and bottleneck analysis" },
    { minutes: "Final 40–45 min", focus: "Follow-ups and summary" }
  ];

  return `
    <div class="system-design-framework-view flex flex-col gap-8 animate-fadeIn text-[#0F172A] dark:text-slate-200">
      
      <!-- HERO BANNER -->
      <div class="relative overflow-hidden rounded-2xl bg-[#EFF6FF] dark:bg-[#161D32] border border-[#BFDBFE] dark:border-indigo-500/40 p-6 sm:p-8 shadow-sm">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-4">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <span class="px-3 py-1 rounded-lg bg-white dark:bg-indigo-500/20 text-[#4F46E5] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-500/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <span class="material-symbols-outlined text-[14px]">psychology</span>
              PART I &bull; MASTERCLASS PLAYBOOK
            </span>
            <span class="text-[11px] font-mono text-[#475569] dark:text-slate-400 bg-white dark:bg-[#0A0E1A]/80 px-2.5 py-1 rounded border border-[#E2E8F0] dark:border-[#24314A] font-semibold">
              REPEATABLE INTERVIEW PROCESS
            </span>
          </div>

          <div class="flex flex-col gap-1.5">
            <h2 class="font-sans text-[24px] sm:text-[30px] font-black text-[#0F172A] dark:text-white tracking-tight leading-tight">
              The System Design Interview Framework
            </h2>
            <p class="text-[14px] text-[#475569] dark:text-slate-300 leading-relaxed">
              Strong candidates do not start by drawing boxes. They first nail down the problem and the constraints that will drive the architecture.
            </p>
          </div>
        </div>
      </div>

      <!-- 1. HOW TO APPROACH ANY SYSTEM DESIGN PROBLEM (7 STEPS) -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
          <span class="px-2 py-0.5 rounded bg-indigo-500/15 text-[#4F46E5] dark:text-indigo-300 font-mono text-[12px] font-bold">1</span>
          <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">1. How to Approach Any System Design Problem</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${steps.map(s => `
            <div class="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F1626] border border-[#E2E8F0] dark:border-[#24314A] flex flex-col gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-[#4F46E5]/15 text-[#4F46E5] dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-[13px]">
                  ${s.num}
                </span>
                <h4 class="font-sans text-[15px] font-bold text-[#0F172A] dark:text-white">${s.title}</h4>
              </div>
              <p class="text-[13px] leading-relaxed text-[#334155] dark:text-slate-300 pl-9.5">
                ${s.desc}
              </p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 2. THE STANDARD INTERVIEW ANSWER TEMPLATE -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
          <span class="px-2 py-0.5 rounded bg-cyan-500/15 text-[#0284C7] dark:text-cyan-300 font-mono text-[12px] font-bold">2</span>
          <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">2. The Standard Interview Answer Template</h3>
        </div>
        <p class="text-[13.5px] text-[#475569] dark:text-slate-300">
          You can apply this checklist to nearly every system design question:
        </p>
        
        <div class="overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-[#24314A]">
          <table class="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr class="bg-[#F1F5F9] dark:bg-[#0F1626] text-[#1E293B] dark:text-slate-200 border-b border-[#E2E8F0] dark:border-[#24314A]">
                <th class="py-3 px-4 font-bold w-1/3">Topic</th>
                <th class="py-3 px-4 font-bold w-2/3">What a Strong Answer Includes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#24314A]">
              ${templateRows.map(r => `
                <tr class="hover:bg-[#F8FAFC] dark:hover:bg-[#182238]/50 transition-colors">
                  <td class="py-3 px-4 font-semibold text-[#0F172A] dark:text-slate-100">${r.topic}</td>
                  <td class="py-3 px-4 text-[#334155] dark:text-slate-300">${r.includes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- 3 & 4: WHAT TO WRITE VS VERBALLY & 45-MIN TIMING -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- 3. What to write vs what to explain verbally -->
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-[#059669] dark:text-emerald-300 font-mono text-[12px] font-bold">3</span>
            <h3 class="font-sans text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight">3. What to Write vs. What to Explain Verbally</h3>
          </div>
          <div class="flex flex-col gap-3 text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
            <p>
              During an interview, put <strong>requirements, headline estimates, APIs, key entities, architecture, and critical trade-offs</strong> on the board.
            </p>
            <p>
              Discuss implementation nuances and alternatives out loud while adding detail to the diagram as needed.
            </p>
            <div class="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[13px] font-medium">
              &ldquo;Do not document every implementation detail before the architecture is aligned. A design interview is a dialogue, not a documentation sprint.&rdquo;
            </div>
          </div>
        </section>

        <!-- 4. Suggested timing for a 45-minute interview -->
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            <span class="px-2 py-0.5 rounded bg-purple-500/15 text-[#7C3AED] dark:text-purple-300 font-mono text-[12px] font-bold">4</span>
            <h3 class="font-sans text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight">4. Suggested Timing for a 45-Minute Interview</h3>
          </div>
          <div class="overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-[#24314A]">
            <table class="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr class="bg-[#F1F5F9] dark:bg-[#0F1626] text-[#1E293B] dark:text-slate-200 border-b border-[#E2E8F0] dark:border-[#24314A]">
                  <th class="py-2.5 px-3 font-bold w-2/5">Minutes</th>
                  <th class="py-2.5 px-3 font-bold w-3/5">Focus</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#24314A]">
                ${timingRows.map(r => `
                  <tr class="hover:bg-[#F8FAFC] dark:hover:bg-[#182238]/50 transition-colors">
                    <td class="py-2.5 px-3 font-mono font-semibold text-[#0F172A] dark:text-cyan-300 text-[12.5px]">${r.minutes}</td>
                    <td class="py-2.5 px-3 text-[#334155] dark:text-slate-300">${r.focus}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <p class="text-[12px] text-[#64748B] dark:text-slate-400 italic">
            The interviewer may ask you to spend more or less time on a section. Adapt instead of rigidly following the schedule.
          </p>
        </section>

      </div>

    </div>
  `;
}
