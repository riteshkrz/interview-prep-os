/**
 * 10.4 Failure Detection & Grey Failures - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 137 and 138
 * from The Modern System Design Interview Guide.
 */

export function renderFailureDetectionContent(topic) {
  const detectionMechanisms = [
    {
      mechanism: "Fixed-timeout heartbeat",
      howItWorks: "Miss N heartbeats in a row, declare dead.",
      whereItFits: "Small clusters. Simple, but one threshold must suit both a quiet night and a GC pause.",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      mechanism: "Phi-accrual (φ)",
      howItWorks: "Model the distribution of past heartbeat arrival times; output a suspicion level φ rather than a boolean.",
      whereItFits: "Adapts to a link's normal jitter; different actions can use different thresholds. Cassandra, Akka.",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      mechanism: "SWIM gossip",
      howItWorks: "Random peer probes; on no reply, ask other nodes to probe indirectly before declaring death.",
      whereItFits: "Large clusters. Indirect probes filter out single bad links. Consul, Serf, HashiCorp stack.",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      mechanism: "Lease expiry",
      howItWorks: "The node must actively renew; silence is death.",
      whereItFits: "Leadership and locks — fails safe, because a node that cannot renew must stop acting (sec. 10.1).",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    },
    {
      mechanism: "External health check",
      howItWorks: "Load balancer or orchestrator probes an endpoint.",
      whereItFits: "Traffic routing (sec. 2.8). Beware checks that only prove the process is running, not that it works.",
      badgeColor: "text-rose-400 bg-rose-500/15 border-rose-500/30"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Heartbeat Interval & Failure Threshold Tuning: Balancing Detection Speed vs. False Positives",
      answer: "Work backwards from the recovery budget. If leadership must move within two seconds, and you want three missed beats before acting, the interval is roughly 500 ms with a 1.5 s threshold. Then sanity-check it against your p99.9 GC pause and network jitter; if either exceeds the threshold, you have designed in false positives. When they conflict, do not just widen the timeout — make the failover safe with fencing (sec. 10.1), which lets you detect aggressively without risking corruption."
    },
    {
      conceptId: "#02",
      title: "Semantic Health Probes & Deep Dependency Testing: Liveness vs. Readiness Pitfalls",
      answer: "The check tested the wrong thing — usually that the process is up and the HTTP stack responds, rather than that the node can do its job. A useful check exercises the critical dependency path (can I reach the database, is my cache warm, is my queue consumer actually progressing) and fails when it cannot, while deliberately not failing on non-critical dependencies, or one downstream blip will cascade into the whole fleet marking itself unhealthy. Separating liveness from readiness exists precisely for this distinction."
    },
    {
      conceptId: "#03",
      title: "The SWIM Protocol: Indirect Probing & Constant O(1) Network Overhead at Scale",
      answer: "Because a failed probe has two explanations: the target is dead, or the path between these two particular nodes is broken. Indirect probing distinguishes them cheaply — if three other members can reach the target, the problem is your link, not the node. It also keeps load flat as the cluster grows, since each node probes a constant number of peers instead of all of them, which is why gossip detection scales to thousands of nodes where all-to-all heartbeating does not."
    },
    {
      conceptId: "#04",
      title: "Correlated Fleet Failures & Mass Failover Circuit Breakers: Preventing Self-Inflicted Disasters",
      answer: "Assume the detector is wrong, not the fleet. The right behaviour is built in beforehand: a circuit breaker on failover itself that stops automated recovery when the suspected-dead fraction crosses a threshold, and pages a human instead. Mass automated recovery under a mistaken signal is how a network blip becomes a multi-hour outage — the failure mode sec. 8.4 describes, where the recovery machinery was the outage."
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 137: CORE DEFINITION, 2x2 ERROR MATRIX & DETECTION MECHANISMS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- PART 10 Banner Header -->
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] p-6 text-white shadow-xl shadow-indigo-950/50 flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-extrabold uppercase tracking-widest text-indigo-200">
              PART 10 · DISTRIBUTED SYSTEMS FUNDAMENTALS
            </span>
          </div>
          <h1 class="font-sans text-[24px] sm:text-[28px] font-black tracking-tight text-white leading-tight">
            Failure Detection & Grey Failures
          </h1>
          <p class="text-[13.5px] text-indigo-100/90 font-sans max-w-3xl leading-relaxed">
            The Impossibility of Discerning Dead vs. Slow, 2x2 Error Trade-offs, Heartbeat Protocols, and Fleet-Wide Resilience
          </p>
        </div>

        <!-- Section Title: 10.4 Failure Detection -->
        <div class="flex flex-col gap-2 pt-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-snug">
              10.4 Failure Detection
            </h2>
          </div>
        </div>

        <!-- WHAT IT IS & WHY Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-cyan-400">
              <span class="material-symbols-outlined text-[20px]">help_outline</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHAT IT IS</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              Deciding that a node is dead so the rest of the system can act — promote a new leader, reassign shards, stop routing traffic.
            </p>
          </div>

          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-indigo-400">
              <span class="material-symbols-outlined text-[20px]">lightbulb</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHY</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              Every recovery mechanism in this guide is triggered by a failure detector. Get it wrong in one direction and you fail over needlessly; wrong in the other and you serve errors for minutes.
            </p>
          </div>
        </div>

        <!-- Blue Callout Box: THE IMPOSSIBILITY YOU MUST ACKNOWLEDGE -->
        <div class="bg-[#0B1528] border-l-4 border-[#38BDF8] rounded-r-xl p-5 flex flex-col gap-2 shadow-lg shadow-sky-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#38BDF8] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#38BDF8] uppercase tracking-wider">
              THE IMPOSSIBILITY YOU MUST ACKNOWLEDGE
            </span>
          </div>
          <p class="text-[13.5px] text-sky-100 font-sans leading-relaxed">
            In an asynchronous network <strong>you cannot distinguish a crashed node from a slow node or a broken link</strong>. Every failure detector is therefore a guess with a tunable bias. Saying this out loud is a strong senior signal, because it reframes the question from <em>"how do I detect failure?"</em> to <strong>"which mistake can I afford?"</strong>
          </p>
        </div>

        <!-- ASCII / 2x2 Matrix: THE TWO ERRORS AND WHAT THEY COST -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-6 flex flex-col gap-4">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">grid_4x4</span>
            THE TWO ERRORS AND WHAT THEY COST
          </span>

          <div class="font-code text-[12px] sm:text-[13px] leading-relaxed text-slate-300 bg-[#070B14] p-5 rounded-lg border border-[#1E293B] overflow-x-auto">
                           ┌───────────────────────────────┬───────────────────────────────┐
                           │      detector says DEAD       │      detector says ALIVE      │
┌──────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│                          │                               │ <span class="text-rose-400 font-bold">LATE DETECTION</span>                │
│      actually DEAD       │ <span class="text-emerald-400 font-bold">correct</span>                       │ requests keep routing to a    │
│                          │                               │ black hole ──► timeouts,      │
│                          │                               │ downtime                      │
├──────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│                          │ <span class="text-amber-400 font-bold">FALSE POSITIVE</span>                │                               │
│      actually ALIVE      │ needless failover,            │ <span class="text-emerald-400 font-bold">correct</span>                       │
│                          │ two leaders, thrash,          │                               │
│                          │ shard reshuffle storm         │                               │
└──────────────────────────┴───────────────────────────────┴───────────────────────────────┘

<span class="text-cyan-300 font-bold">TUNING = CHOOSING YOUR POISON</span>
  • aggressive timeout  ──► fast recovery, more false positives
  • patient timeout     ──► stable, slower recovery
Fence the action (sec. 10.1) and a false positive stops being catastrophic.
          </div>
        </div>

        <!-- DETECTION MECHANISMS TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            DETECTION MECHANISMS
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
            <table class="w-full text-left text-[12.5px] font-sans border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                  <th class="p-3.5 font-bold w-[22%]">Mechanism</th>
                  <th class="p-3.5 font-bold w-[38%]">How it works</th>
                  <th class="p-3.5 font-bold w-[40%]">Where it fits</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] text-slate-300">
                ${detectionMechanisms.map(m => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="p-3.5 font-bold text-white font-code text-[12px]">
                      <span class="px-2 py-0.5 rounded text-[11px] font-code border ${m.badgeColor}">
                        ${m.mechanism}
                      </span>
                    </td>
                    <td class="p-3.5 leading-relaxed">${m.howItWorks}</td>
                    <td class="p-3.5 leading-relaxed text-slate-300">${m.whereItFits}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- DEEP-DIVE: PHI-ACCRUAL & SWIM PROTOCOL DETAILS -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">

          <!-- Phi Accrual Breakdown -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[15px] font-bold text-cyan-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">query_stats</span>
                The Phi-Accrual (φ) Detector
              </span>
              <span class="text-[10px] font-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Hayashibara et al.
              </span>
            </div>
            <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
              Traditional detectors output a binary boolean (Alive / Dead). Phi-accrual outputs a continuous suspicion scale $\\phi = -\\log_{10}(P_{\\text{later}}(t - t_{\\text{last}}))$ by fitting historical heartbeat arrival intervals to a normal distribution.
            </p>
            <div class="bg-[#0B1120] p-3.5 rounded-lg border border-[#1E293B] font-code text-[11.5px] text-slate-300 flex flex-col gap-1.5">
              <div class="text-cyan-400 font-bold">// Cassandra phi_convict_threshold:</div>
              <div>• φ = 1  ──► 10% chance node is alive (P = 0.1)</div>
              <div>• φ = 8  ──► Standard Cassandra LAN threshold (P = 10^-8)</div>
              <div>• φ = 12 ──► Cross-datacenter WAN threshold (resists jitter)</div>
              <div>• Multi-action: φ=3 stops routing; φ=8 starts failover!</div>
            </div>
          </div>

          <!-- SWIM Protocol Breakdown -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[15px] font-bold text-emerald-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">share</span>
                SWIM Protocol with Suspicion
              </span>
              <span class="text-[10px] font-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Consul / Serf
              </span>
            </div>
            <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
              Solves the $O(N^2)$ network scaling limit of all-to-all heartbeating. Every $T$ period, a node randomly selects 1 peer to probe directly. If no ACK is received, it asks $k$ random members to probe indirectly.
            </p>
            <div class="bg-[#0B1120] p-3.5 rounded-lg border border-[#1E293B] font-code text-[11.5px] text-slate-300 flex flex-col gap-1.5">
              <div class="text-emerald-400 font-bold">// SWIM State Progression:</div>
              <div>1. Node A ──Ping──► Node B (Timeout after 200ms)</div>
              <div>2. Node A asks C, D, E: "Probe B for me" (Indirect)</div>
              <div>3. If all fail: Node B marked <span class="text-amber-300 font-bold">SUSPECT</span> (Not Dead!)</div>
              <div>4. B has grace period to refute suspect message via gossip</div>
              <div>5. If period expires without refutation ──► <span class="text-rose-400 font-bold">DEAD</span></div>
            </div>
          </div>

        </div>

        <!-- Official Page 137 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 137</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 138: GREY FAILURES, CORRELATED FALSE POSITIVES & FOLLOW-UPS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Green Callout Box: GREY FAILURE — THE CASE THAT DEFEATS NAIVE DETECTORS -->
        <div class="bg-[#062419] border-l-4 border-[#10B981] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-emerald-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">healing</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              GREY FAILURE — THE CASE THAT DEFEATS NAIVE DETECTORS
            </span>
          </div>
          <p class="text-[13.5px] text-emerald-100 font-sans leading-relaxed">
            The hardest real-world failure is not a dead node, it is a <strong>sick one</strong>: answering health checks promptly while serving 40% errors, or responding 20× slower than its peers because of a failing disk or a noisy neighbour. Binary detectors call it alive, so it keeps taking traffic and poisons your p99.
          </p>
          <p class="text-[13.5px] text-emerald-100/90 font-sans leading-relaxed">
            Defences that actually work: <strong>health checks that exercise a real dependency</strong> rather than returning <code>200 OK</code>; <strong>outlier detection</strong> that compares a node's error rate and latency against its peers and ejects the deviant; and <strong>client-side circuit breaking per host</strong> (sec. 8.2) so callers route away without waiting for a cluster-wide verdict.
          </p>
        </div>

        <!-- ENVOY OUTLIER DETECTION PRODUCTION CONFIGURATION -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">terminal</span>
              HOW ENVOY EXECUTES OUTLIER DETECTION (STATISTICAL PEER COMPARISON)
            </span>
            <span class="text-[10.5px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              Envoy / Istio DestinationRule
            </span>
          </div>

          <div class="font-code text-[12px] leading-relaxed text-slate-300 bg-[#070B14] p-4 rounded-lg border border-[#1E293B] overflow-x-auto">
<span class="text-indigo-400 font-bold">// Envoy Outlier Detection Cluster Configuration:</span>
outlier_detection:
  consecutive_5xx: 5               <span class="text-slate-400">// Eject host after 5 consecutive HTTP 5xx errors</span>
  interval: 10s                    <span class="text-slate-400">// Evaluate cluster peer statistical error distribution every 10s</span>
  base_ejection_time: 30s          <span class="text-slate-400">// Initial ejection period (multiplies exponentially on repeat)</span>
  max_ejection_percent: 20         <span class="text-amber-300 font-bold">// CIRCUIT BREAKER: Never eject &gt; 20% of the fleet simultaneously!</span>
  success_rate_stdev_factor: 1900  <span class="text-slate-400">// Statistical outlier: eject if (mean - 1.9 * stdev) &gt; host_success_rate</span>
          </div>

          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Unlike static health checks, <strong>outlier detection continuously observes live user traffic</strong>. If a node begins intermittently returning 500s or dropping RPCs due to bad network hardware, Envoy temporarily removes that single host from the load balancing pool without requiring an orchestrator reboot.
          </p>
        </div>

        <!-- Orange Callout Box: THE CORRELATED FALSE POSITIVE -->
        <div class="bg-[#231507] border-l-4 border-[#F97316] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-amber-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F97316] text-[18px]">group_remove</span>
            <span class="font-code text-[11px] font-bold text-[#F97316] uppercase tracking-wider">
              THE CORRELATED FALSE POSITIVE
            </span>
          </div>
          <p class="text-[13.5px] text-amber-100 font-sans leading-relaxed">
            Failure detectors assume failures are independent. They are not. A network blip, a fleet-wide GC pause from a synchronised cache expiry, or a control plane hiccup can make many nodes look dead at once — and the resulting mass failover is usually worse than the original problem (sec. 8.4).
          </p>
          <p class="text-[13.5px] text-amber-100/90 font-sans leading-relaxed">
            Production systems cap the damage: <strong>never reassign more than x% of shards per minute</strong>, require a <strong>quorum of observers</strong> to agree before eviction, and <strong>refuse to evict when "dead" nodes exceed a threshold</strong>, on the grounds that the detector is more likely broken than the whole fleet.
          </p>
        </div>

        <!-- KUBERNETES PROBE TAXONOMY: LIVENESS VS READINESS VS STARTUP -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">splitscreen</span>
            THE THREE KUBERNETES PROBE PRIMITIVES AND THEIR BLAST RADIUS
          </span>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px] font-sans">
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-amber-400 font-code text-[11px]">1. Startup Probe</span>
              <p class="text-slate-300 leading-relaxed">
                Disables liveness/readiness checks until slow legacy containers finish initial boot (e.g. JVM warm-up). Prevents k8s from killing initializing containers.
              </p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-rose-400 font-code text-[11px]">2. Liveness Probe</span>
              <p class="text-slate-300 leading-relaxed">
                Action on failure: <strong>SIGKILL container restart</strong>. Only check local process health (e.g. deadlocked thread loop). Never check downstream DBs!
              </p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-emerald-400 font-code text-[11px]">3. Readiness Probe</span>
              <p class="text-slate-300 leading-relaxed">
                Action on failure: <strong>Remove from Endpoint slice</strong>. Pod keeps running without restart; traffic pauses until cache warms or DB reconnects.
              </p>
            </div>
          </div>
        </div>

        <!-- CRITICAL ARCHITECTURAL DEEP-DIVES Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              CRITICAL ARCHITECTURAL DEEP-DIVES &amp; DISTRIBUTED EDGE CASES
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${architecturalDeepDives.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-cyan-400 shrink-0 pt-0.5">${item.conceptId}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.title}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-6 flex flex-col gap-2.5 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[14px] font-sans font-medium text-white leading-relaxed">
            You cannot tell dead from slow, so pick which error you can afford and make the consequence survivable. Aggressive detection is safe only when the action is fenced; patient detection costs availability. Then handle the case that actually happens in production: not a dead node but a sick one, which needs outlier ejection and per-host circuit breaking rather than a cluster-wide verdict.
          </p>
        </div>

        <!-- Official Page 138 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 138</span>
        </div>

      </div>

    </div>
  `;
}
