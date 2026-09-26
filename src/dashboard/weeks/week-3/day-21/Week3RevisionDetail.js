/**
 * Day 21: Week 3 Active Recall & Mastery Checklist - Visual Guide
 * High-signal, visually rich reproduction of Appendix C & D topics
 * covering Storage, Messaging, Distributed Systems & Reliability.
 */

export function renderWeek3RevisionContent(topic) {
  const patternMap = [
    { trigger: "\"Spiky, 100× peak traffic\"", reachFor: "Queue + async workers + admission control (sec. 9.6); pre-scale, don't autoscale" },
    { trigger: "\"Must not lose data\"", reachFor: "Synchronous/quorum replication, RPO = 0 (sec. 4.4); append-only ledger (sec. 9.4)" },
    { trigger: "\"Multi-region, low latency\"", reachFor: "Local reads + single write region; Anycast or GSLB to steer (sec. 12.4, sec. 11.4)" },
    { trigger: "\"Millions of concurrent connections\"", reachFor: "Event loop + connection-count scaling + pub/sub backplane (sec. 11.5, sec. 2.7)" },
    { trigger: "\"There must be exactly one leader / owner\"", reachFor: "Raft-backed election + lease + fencing token validated by resource (sec. 10.1)" },
    { trigger: "\"Two replicas disagree\"", reachFor: "CRDT if any merge is safe, app merge if domain knows, coordination if invariant exists (sec. 10.3)" },
    { trigger: "\"Which write happened first?\"", reachFor: "Nothing, if commutative; otherwise single writer per key, HLC or vector clocks (sec. 10.2)" },
    { trigger: "\"Is that node dead?\"", reachFor: "Phi-accrual or SWIM + outlier ejection for the sick-not-dead grey failure case (sec. 10.4)" },
    { trigger: "\"Deploy without downtime\"", reachFor: "Canary + expand–contract migrations + feature flags (sec. 8.1)" },
    { trigger: "\"It must never collapse\"", reachFor: "Bulkheads, breakers, degraded modes, tested restores (sec. 8.2, sec. 8.4)" }
  ];

  const selfTestQuestions = [
    "Name six deployment strategies with their rollback and cost profiles.",
    "Explain expand–contract migration and why renaming a column in one step is wrong.",
    "Your canary is healthy at 5% and breaks at 50%. What class of bug is that?",
    "Name the five resilience patterns and the failure each prevents.",
    "Why is jitter on retries not optional?",
    "Load average is 40 on 8 cores but CPU is 20% idle. Explain.",
    "Give your triage order for a runaway Linux process.",
    "Why must a consensus cluster have an odd number of members?",
    "Your lock has a TTL and the holder pauses for a long GC. What breaks, and what fixes it?",
    "Two writes arrive from different nodes 3 ms apart. Which happened first?",
    "What can a vector clock tell you that a Lamport timestamp cannot?",
    "Why can't you distinguish a crashed node from a slow one in an asynchronous network?",
    "What is a grey failure, and why do simple health checks miss it?",
    "Write an SLO for a checkout API and defend the numbers.",
    "Why alert on burn rate instead of an error-rate threshold?",
    "Name the four multi-region patterns with their RPO, RTO and cost."
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="rev-3">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Week 3 Consolidation · Day 21
            </span>
            <span class="text-[12px] font-code text-slate-400">Appendix C.3 &amp; D · Storage, Consensus &amp; Operations</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 35 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          Revision Day 3 · Distributed Consensus, Reliability &amp; Multi-Region Mastery
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Week 3 cements the foundational theory that Senior and Staff interviewers probe relentlessly: Raft consensus, vector clocks, failure detectors, resilience cascades, and multi-region disaster recovery.
        </p>
      </div>

      <!-- Pattern to Problem Index -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
          PATTERN &rarr; PROBLEM INDEX (APPENDIX C.3)
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-2/5">When You Hear Interviewer Say…</th>
                <th class="p-3 w-3/5">The Exact Architecture Pattern to Reach For</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${patternMap.map(p => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-amber-300 font-mono text-[12px]">${p.trigger}</td>
                  <td class="p-3 text-slate-200 font-sans leading-relaxed">${p.reachFor}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Rapid-Fire Self-Test Drill -->
      <div class="flex flex-col gap-3 pt-2">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          WEEK 3 RAPID-FIRE RECALL DRILL (CAN YOU ANSWER EACH IN 60 SECONDS UNPROMPTED?)
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
      <div class="bg-gradient-to-r from-purple-950/60 to-cyan-950/60 border border-purple-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-purple-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Consensus replicates decisions, not workloads. Every remote call needs a timeout, a jittered retry, a breaker, and a degraded mode. And multi-region traffic steering is seconds while the database write path is the real challenge."
        </p>
      </div>

    </div>
  `;
}
