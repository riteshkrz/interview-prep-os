/**
 * 12.7 Chaos Engineering & Game Days - Visual Guide
 * High-signal, visually rich reproduction of Pages 160–162
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderChaosEngineeringContent(topic) {
  const methodSteps = [
    { num: "①", title: "Steady State", desc: "Define business health metric: e.g. <code>checkout_success &gt;= 99.5%</code>, <code>p99 &lt;= 400ms</code>." },
    { num: "②", title: "Hypothesis", desc: "State outcome before testing: <em>'If one node dies, traffic routes away in 5s with zero 5xx errors.'</em>" },
    { num: "③", title: "Blast Radius", desc: "Start in staging, then 1% prod. Define automated abort condition &amp; kill-switch BEFORE starting." },
    { num: "④", title: "Inject Failure", desc: "One variable only, during normal working business hours with the service engineering team watching." },
    { num: "⑤", title: "Observe", desc: "Did steady state hold? If not, congratulations: you uncovered an impending production outage for free." },
    { num: "⑥", title: "Automate", desc: "Fix the defect, then automate the chaos injection as a continuous regression gate in CI/CD pipeline." }
  ];

  const experiments = [
    { inject: "Kill one instance", validates: "Health check ejection speed, client retry backoff, and capacity headroom (sec. 12.5)." },
    { inject: "Add 300ms latency to dependency", validates: "Timeouts are bounded and propagate as deadlines; caller degrades instead of thread starvation (sec. 8.2)." },
    { inject: "Return 500 errors from dependency", validates: "Circuit breaker trips to OPEN; fallback path renders degraded UI without crashing." },
    { inject: "Kill an entire Availability Zone", validates: "Consensus quorum placement (sec. 10.1) and cross-AZ compute capacity (N+1 rule)." },
    { inject: "Kill the Redis Cache tier", validates: "Whether database survives the cache avalanche miss storm (sec. 5.2) without collapse." },
    { inject: "Skew machine system clocks by 5s", validates: "Token validation, lease expiries, and time-ordered conflict resolution (sec. 10.2)." },
    { inject: "Fill local disk / exhaust socket pool", validates: "Graceful degradation, backpressure rejection, and alerting before complete saturation." },
    { inject: "Evacuate an entire AWS region", validates: "The Disaster Recovery runbook is an actual executable capability, not a document (sec. 12.4)." }
  ];

  const followUps = [
    {
      q: "What is the very first chaos experiment you would run on a newly designed system?",
      a: "<strong>Kill the Cache Tier.</strong> Caching is the dependency whose failure almost all system design candidates quietly assume away. The hypothesis: the database survives the miss storm because of request coalescing (single-flight) and local negative caching (sec. 5.2). It is the premier first experiment because most architectures fail it, and discovering that your database collapses without Redis is far cheaper on a Tuesday morning than on Black Friday."
    },
    {
      q: "How do you verify in practice that a Circuit Breaker actually works?",
      a: "Inject simulated errors into the dependency at a controlled, measured rate (e.g., 60% failure rate for 15s). Assert the full lifecycle: 1) the breaker trips from CLOSED to OPEN within its threshold window; 2) subsequent callers immediately receive the cached fallback in 0ms without waiting for timeouts; 3) load on the struggling downstream drops to zero; and 4) after the cooldown, probe requests transition it to HALF-OPEN and back to CLOSED once downstream recovers."
    },
    {
      q: "Isn't Chaos Engineering just regular testing? Why the separate discipline?",
      a: "<strong>Unit and integration tests verify code against a specification in a controlled sandbox.</strong> Chaos engineering verifies that a complex distributed system — with real network latency, kernel cgroups, thread-pool limits, external third-party dependencies, and human runbooks — behaves resiliently under emergent conditions. Most production outages are caused by configuration defects invisible to unit tests: a timeout longer than the caller's deadline, a connection pool that never cleans up leaked sockets, or a runbook pointing to a dashboard that is also offline."
    },
    {
      q: "What are the mandatory prerequisites before running chaos in production?",
      a: "<strong>Chaos without prerequisites is simply an outage.</strong> You must have: 1) High-fidelity telemetry to observe steady state (sec. 12.1); 2) A verified, tested automated kill-switch that halts the experiment instantaneously; 3) Prior consent from the engineering team; 4) A strictly bounded blast radius; and 5) Error budget remaining to spend (sec. 12.3)."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="12.7-chaos">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Part 12 · Reliability &amp; Operations at Scale
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 160–162 · Section 12.7</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          12.7 Chaos Engineering &amp; Game Days
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Deliberately injecting failure under controlled conditions with a hypothesis stated in advance. Every resilience pattern in system design is mere configuration until verified by chaos drills.
        </p>
      </div>

      <!-- The 6-Step Chaos Method -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3 font-sans">
        <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">science</span>
          THE SCIENTIFIC METHOD: CHAOS IS AN EXPERIMENT, NOT VANDALISM
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          ${methodSteps.map(s => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="font-code text-[13px] font-bold text-cyan-400">${s.num}</span>
                <span class="font-code text-[12px] font-bold text-slate-200">${s.title}</span>
              </div>
              <p class="text-[11.5px] text-slate-300 leading-relaxed font-sans">${s.desc}</p>
            </div>
          `).join('')}
        </div>
        <div class="pt-2 text-[11px] font-code text-rose-300 border-t border-[#24314A]/60">
          ▲ Rule: If you cannot formally define ① Steady State and ② Hypothesis, you are not ready to inject anything.
        </div>
      </div>

      <!-- Experiments and Validation Matrix -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          EIGHT HIGH-SIGNAL EXPERIMENTS &amp; WHAT EACH VALIDATES
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/3">Injected Failure Scenario</th>
                <th class="p-3 w-2/3">What It Actually Validates in Production</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${experiments.map(e => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-rose-300 font-code text-[12px]">${e.inject}</td>
                  <td class="p-3 text-slate-300 leading-relaxed">${e.validates}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interview Follow-ups -->
      <div class="flex flex-col gap-3 pt-2">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          INTERVIEW FOLLOW-UPS (SENIOR &amp; STAFF PROBES)
        </span>
        <div class="flex flex-col gap-3">
          ${followUps.map((item, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <span class="font-sans text-[13px] font-bold text-cyan-300">
                Q${idx + 1}: ${item.q}
              </span>
              <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
                ${item.a}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Key Interview Takeaway -->
      <div class="bg-gradient-to-r from-rose-950/60 to-indigo-950/60 border border-rose-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-rose-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Chaos engineering is a hypothesis-driven experiment with a defined blast radius and an abort switch, not randomly breaking production. Its value is that it converts assumed resilience into verified resilience — and the highest-yield first experiments are killing the cache tier and evacuating a region."
        </p>
      </div>

    </div>
  `;
}
