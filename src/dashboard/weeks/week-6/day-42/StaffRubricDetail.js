/**
 * Staff & Principal 45-Minute Interview Rubric (Topic: Day 42 Capstone)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 173–175
 */

export function renderStaffRubricContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="staff-rubric">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Capstone Rubric · Appendix A & B · Pages 173–175
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Staff & Principal Calibration
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">FAANG / Tier-1 Evaluation Signals</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Staff & Principal 45-Minute Interview Rubric</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        System design interviews at Senior, Staff, and Principal levels are not trivia quizzes. They are evaluations of engineering judgment, operational pragmatism, and your ability to navigate ambiguous trade-offs. This rubric details the exact behavioral differences calibrated by interview debrief committees.
      </p>
    </div>

    <!-- The 5 Calibration Dimensions Table -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The 5 Calibration Dimensions: Mid vs. Senior vs. Staff
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Evaluation Dimension</th>
              <th class="p-3 font-semibold text-slate-400">Mid-Level Engineer (L4)</th>
              <th class="p-3 font-semibold text-cyan-300">Senior Engineer (L5)</th>
              <th class="p-3 font-semibold text-emerald-400">Staff / Principal Engineer (L6+)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">1. Requirements & Scope</td>
              <td class="p-3 text-slate-400">Jumps immediately into drawing boxes without clarifying volume.</td>
              <td class="p-3 text-cyan-200">Asks for DAU, read/write ratio, and latency targets upfront.</td>
              <td class="p-3 text-emerald-300 font-bold">Derives constraints from business goals; identifies non-obvious failure modes before drawing anything.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">2. Technology Selection</td>
              <td class="p-3 text-slate-400">Recites buzzwords: "I will use Kafka and Cassandra."</td>
              <td class="p-3 text-cyan-200">Justifies choice based on access patterns (e.g. append-only LSM vs B-tree).</td>
              <td class="p-3 text-emerald-300 font-bold">Quantifies operational cost and team cognitive load: chooses Postgres as default; introduces Kafka only when scale demands.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">3. Estimations & Sizing</td>
              <td class="p-3 text-slate-400">Skips arithmetic or makes arithmetic errors under stress.</td>
              <td class="p-3 text-cyan-200">Calculates QPS, network bandwidth, and disk storage over 5 years.</td>
              <td class="p-3 text-emerald-300 font-bold">Uses sizing math to rule out unnecessary complexity (e.g. "1.71 GB fits in RAM, so no sharding needed").</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">4. Failure Modes</td>
              <td class="p-3 text-slate-400">Designs only for the happy path; says "add a replica" on crash.</td>
              <td class="p-3 text-cyan-200">Explains primary-replica failover, split-brain risks, and circuit breakers.</td>
              <td class="p-3 text-emerald-300 font-bold">Addresses grey failures, clock skew, retry storms, and multi-region disaster recovery (RPO/RTO).</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">5. Rollout & Operations</td>
              <td class="p-3 text-slate-400">Stops at high-level topology; ignores migration.</td>
              <td class="p-3 text-cyan-200">Mentions canary deploys and Prometheus monitoring dashboards.</td>
              <td class="p-3 text-emerald-300 font-bold">Designs zero-downtime expand-contract DB migrations, multi-window SLO burn rates, and rollback blast radius controls.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Appendix A: Company Engineering Blog Pro Tip -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        Appendix A: The Engineering Blog Advantage (Page 173)
      </h3>
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3 leading-relaxed">
        <p class="text-slate-300">
          Reading the target company's engineering blog before the interview converts preparation into three high-signal artifacts:
        </p>
        <ul class="space-y-2 text-slate-300 list-disc list-inside font-mono">
          <li><strong>Internal Architectural Vocabulary:</strong> If Uber calls it "Ringpop" or Twitter calls it "Manhattan", using their terminology eliminates communication friction.</li>
          <li><strong>One Informed Question Per Interviewer:</strong> <em>"Your recent blog post mentioned dual-write inconsistencies during your Kafka cutover &mdash; did your team implement the transactional outbox pattern to resolve it?"</em></li>
          <li><strong>Known Public Outages & Postmortems:</strong> Engineering postmortems reveal the exact failure modes that their infrastructure team has been traumatized by. Mentioning their known failure mode unprompted demonstrates staff-level empathy.</li>
        </ul>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 174)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "A system design interview is a conversation between colleagues, not an oral exam. State your assumptions clearly, lead with estimation arithmetic to bound complexity, volunteer trade-offs before being prompted, and never propose an architecture you wouldn't be comfortable operating on-call at 2 a.m."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
