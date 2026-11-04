/**
 * Final interview checklist — before you finish any design
 * System Design Interview Masterclass (Pages 92–93)
 * Complete with interactive readiness checklist (0/10) and 6 core architectural principles.
 */

export function renderFinalInterviewChecklistDetail() {
  const checklistItems = [
    "I nailed down primary use cases and captured key assumptions.",
    "I distinguished functional from non-functional requirements.",
    "I sized the system where scale drives design choices.",
    "I specified primary APIs, entities, and who owns each dataset.",
    "I walked through read paths and write paths.",
    "I defended choices for databases, caches, queues, and service boundaries.",
    "I addressed concurrency, idempotency, and consistency where they matter.",
    "I planned for retries, timeouts, partial failures, and recovery.",
    "I touched security, privacy, monitoring, and operating cost.",
    "I weighed real alternatives and stated known limits."
  ];

  const principles = [
    {
      num: 1,
      title: "A queue alone does not guarantee reliability",
      body: "You still need durable messages, retries, idempotent consumers, dead-letter handling, and monitoring."
    },
    {
      num: 2,
      title: "A cache alone does not fix scalability",
      body: "Plan for invalidation, TTLs, hot keys, stampedes, and behavior when the cache is unavailable."
    },
    {
      num: 3,
      title: "Horizontal scaling alone does not fix concurrency",
      body: "Inventory, seat holds, payment state, and similar critical paths still need an authoritative way to serialize competing updates."
    },
    {
      num: 4,
      title: "“Exactly once” needs precise scope",
      body: "A framework may guarantee it inside its processing boundary, but external databases, payment rails, and notifications can still duplicate side effects unless the end-to-end workflow is designed for that."
    },
    {
      num: 5,
      title: "Tie every architectural pick to a rationale",
      body: "Rather than “I will use Kafka,” name the bottleneck or failure mode Kafka mitigates and the complexity it adds."
    },
    {
      num: 6,
      title: "Begin with the smallest design that satisfies stated requirements",
      body: "Introduce sharding, multi-region layouts, specialized stores, and extra services when expected scale or reliability targets demand them—not merely because the prompt sounds big."
    }
  ];

  return `
    <div class="final-checklist-view flex flex-col gap-8 animate-fadeIn text-[#0F172A] dark:text-slate-200">
      
      <!-- HERO BANNER -->
      <div class="relative overflow-hidden rounded-2xl bg-[#EFF6FF] dark:bg-[#161D32] border border-[#BFDBFE] dark:border-indigo-500/40 p-6 sm:p-8 shadow-sm">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-4">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <span class="px-3 py-1 rounded-lg bg-white dark:bg-indigo-500/20 text-[#4F46E5] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-500/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <span class="material-symbols-outlined text-[14px]">checklist</span>
              CAPSTONE MASTERY &bull; DAY 42
            </span>
            <span class="text-[11px] font-mono text-[#475569] dark:text-slate-400 bg-white dark:bg-[#0A0E1A]/80 px-2.5 py-1 rounded border border-[#E2E8F0] dark:border-[#24314A] font-semibold">
              BEFORE YOU FINISH ANY DESIGN
            </span>
          </div>

          <div class="flex flex-col gap-1.5">
            <h2 class="font-sans text-[24px] sm:text-[30px] font-black text-[#0F172A] dark:text-white tracking-tight leading-tight">
              Final Interview Checklist &amp; Core Principles
            </h2>
            <p class="text-[14px] text-[#475569] dark:text-slate-300 leading-relaxed">
              Before you wrap a system design interview, confirm you can articulate every item on this checklist clearly and defend your architectural choices with first principles.
            </p>
          </div>
        </div>
      </div>

      <!-- READINESS CHECKLIST (10 ITEMS) -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-[#059669] dark:text-emerald-300 font-mono text-[12px] font-bold">10 / 10</span>
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">System Design Readiness Checklist</h3>
          </div>
          <span class="text-[11px] font-mono text-[#64748B] dark:text-slate-400">ACTIVE RECALL AUDIT</span>
        </div>

        <div class="flex flex-col gap-2.5">
          ${checklistItems.map((item, idx) => `
            <label class="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F1626] border border-[#E2E8F0] dark:border-[#24314A] hover:border-emerald-500/50 cursor-pointer transition-colors group">
              <input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600" />
              <span class="font-mono text-[12px] text-slate-400 font-bold shrink-0">${idx + 1}.</span>
              <span class="text-[13.5px] text-[#1E293B] dark:text-slate-200 font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">${item}</span>
            </label>
          `).join('')}
        </div>
      </section>

      <!-- THE 6 MOST IMPORTANT PRINCIPLES TO REMEMBER -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
          <span class="px-2 py-0.5 rounded bg-indigo-500/15 text-[#4F46E5] dark:text-indigo-300 font-mono text-[12px] font-bold">AXIOMS</span>
          <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">The 6 Most Important Principles to Remember</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${principles.map(p => `
            <div class="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F1626] border border-[#E2E8F0] dark:border-[#24314A] flex flex-col gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-[#4F46E5]/15 text-[#4F46E5] dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-[13px]">
                  ${p.num}
                </span>
                <h4 class="font-sans text-[15px] font-bold text-[#0F172A] dark:text-white">${p.title}</h4>
              </div>
              <p class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300 pl-9.5">
                ${p.body}
              </p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- REVISED CONTENT SCOPE -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
          <span class="px-2 py-0.5 rounded bg-cyan-500/15 text-[#0284C7] dark:text-cyan-300 font-mono text-[12px] font-bold">SCOPE</span>
          <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Revised Content Scope &amp; Delivery Standards</h3>
        </div>
        <p class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
          The master content spans all 20 questions, each with clarifying prompts and sample interviewer answers, functional and non-functional requirements, API design, data models, architecture narrative, implementation steps, component rationale, trade-offs, and follow-ups with model answers.
        </p>
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B] text-[13px] text-slate-600 dark:text-slate-300">
          For the document edition, produce high-level architecture and sequence diagrams as standalone visuals. Keep adjacent explanations, requirements, APIs, schemas, tables, and interview answers as typeset text so they remain legible and straightforward to revise.
        </div>
      </section>

    </div>
  `;
}
