/**
 * Day 7: Week 1 Active Recall & Mastery Checklist - Visual Guide
 * High-signal, visually rich reproduction of Pages 175, 176, and 177
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderWeek1RevisionContent(topic) {
  const lastHourChecklist = [
    {
      phase: "Opening",
      say: "\"Before I design, let me pin down functional requirements, non-functional targets — QPS, p99, consistency, availability — and what's out of scope.\""
    },
    {
      phase: "After the math",
      say: "\"That's ~X QPS and ~Y TB/year, read:write of Z:1. That tells me I need [cache / shard / single node].\""
    },
    {
      phase: "Choosing tech",
      say: "\"Access pattern is A, consistency requirement is B, scale is C — so I'd use D. If B changed, I'd revisit.\""
    },
    {
      phase: "Deep dive",
      say: "\"There are three options here. I'd pick the middle one because [trade-off], and the failure mode I'd watch is [X].\""
    },
    {
      phase: "Failure handling",
      say: "\"If this component dies: timeout, bounded retry with jitter, circuit break, and degrade to [specific fallback].\""
    },
    {
      phase: "Closing",
      say: "\"The main trade-offs I made were X and Y. With more time I'd look at Z. The biggest risk is W.\""
    }
  ];

  const tipOfTongueNumbers = [
    { num: "100 ns", label: "RAM Read Latency", desc: "~100× slower than L1 cache (~1ns)" },
    { num: "~0.5 ms", label: "Intra-DC RTT", desc: "Chatty microservices: 20 hops = 10ms floor" },
    { num: "~150 ms", label: "Cross-Continent RTT", desc: "CA → Netherlands; forces async replication" },
    { num: "1 M / day", label: "≈ 12 QPS", desc: "1 Billion/day ≈ 12,000 QPS (12K QPS)" },
    { num: "99.99%", label: "52.6 min / year", desc: "Four nines SLA allows ~4.4 min downtime/month" },
    { num: "~10 bits", label: "Per Item (Bloom Filter)", desc: "Buys 1% false-positive rate at 7 hashes" }
  ];

  const levelUpPhrases = [
    "\"The bottleneck moves rather than disappears — after this fix, the next constraint becomes X.\"",
    "\"I'd accept eventual consistency here and strong consistency there, because the cost of being wrong differs.\"",
    "\"This is cheap to add and expensive to remove, so I'd defer it until the numbers justify it.\"",
    "\"That number fits in RAM, so replicas beat shards — sharding would be complexity without benefit.\"",
    "\"I'd make the failure visible rather than silent: return a 429 with Retry-After instead of queueing forever.\"",
    "\"Old and new versions will coexist during rollout, so the schema change has to be backward compatible.\"",
    "\"I don't know that system's internals, but the property I need is X — here's how I'd verify it.\""
  ];

  const selfTestQuestions = [
    "Convert 1 billion requests/day into QPS, then into peak QPS. What multiplier did you assume and why?",
    "When is a distributed system the wrong answer?",
    "Difference between a process, a thread, and a coroutine — and the cost of switching between each?",
    "How do you size a thread pool for an I/O-bound service?",
    "What actually makes a container lightweight compared with a VM?",
    "Why does Lambda use Firecracker microVMs instead of containers?",
    "Walk the scaling ladder from one server to microservices, naming the new failure mode at each step.",
    "What problem does each HTTP generation solve?",
    "Why does HTTP/2 still suffer head-of-line blocking on lossy mobile links?",
    "Which parts of HTTPS use asymmetric vs. symmetric cryptography, and why?",
    "L4 vs. L7 load balancing — and why does gRPC need L7?",
    "How do you drain a node without dropping requests?"
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="rev-1">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Week 1 Consolidation · Day 7
            </span>
            <span class="text-[12px] font-code text-slate-400">Appendix C &amp; D · Pages 175–177</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 30 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          Revision Day 1 · Active Recall, Numbers &amp; 7-Step Delivery
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Mastery is active recall under pressure. Review the exact phrases to say at each stage of the 45-minute loop, lock in the latency constants, and test yourself on the 12 Week-1 rapid-fire interview probes.
        </p>
      </div>

      <!-- Numbers on the Tip of Your Tongue -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
          NUMBERS TO HAVE ON THE TIP OF YOUR TONGUE (APPENDIX C.2)
        </span>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          ${tipOfTongueNumbers.map(n => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3 flex flex-col items-center text-center gap-1">
              <span class="font-code text-[16px] sm:text-[18px] font-bold text-cyan-300">${n.num}</span>
              <span class="text-[11px] font-bold text-slate-200 font-sans">${n.label}</span>
              <span class="text-[10px] text-slate-400 font-sans">${n.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- The Last-Hour Checklist -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          THE LAST-HOUR CHECKLIST: WHAT TO SAY IN THE INTERVIEW (APPENDIX C.1)
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/4">Interview Phase</th>
                <th class="p-3 w-3/4">The Senior Response (Say This)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${lastHourChecklist.map(c => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-sans text-[12px]">${c.phase}</td>
                  <td class="p-3 text-slate-200 font-sans text-[12px]">${c.say}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sentences That Raise Your Level -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
          SENTENCES THAT RAISE YOUR LEVEL (STEAL THESE FRAMINGS — APPENDIX C.4)
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          ${levelUpPhrases.map((phrase, idx) => `
            <div class="bg-[#0F1626] border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <span class="font-sans text-[11px] font-bold text-emerald-400 shrink-0 mt-0.5">#${idx + 1}</span>
              <p class="text-[12px] text-slate-200 font-sans leading-relaxed">${phrase}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 60-Second Self-Test Drill -->
      <div class="flex flex-col gap-3 pt-2">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          WEEK 1 ACTIVE RECALL DRILL (CAN YOU ANSWER EACH IN &lt;60 SECONDS OUT LOUD?)
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${selfTestQuestions.map((q, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex items-start gap-2.5">
              <span class="font-code text-[12px] font-bold text-indigo-400 shrink-0">Q${idx + 1}</span>
              <p class="text-[12px] text-slate-300 font-sans leading-relaxed">${q}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Key Interview Takeaway -->
      <div class="bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          FINAL WORD FOR WEEK 1
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Interviews are not a recall test — they are a judgement test. Numbers before boxes, trade-offs before technology, failure modes before features."
        </p>
      </div>

    </div>
  `;
}
