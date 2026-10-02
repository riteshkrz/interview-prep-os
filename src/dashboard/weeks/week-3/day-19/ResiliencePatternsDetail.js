/**
 * 8.2 Resilience: Timeouts, Retries, Circuit Breakers, Backpressure - Visual Guide
 * High-signal, visually rich, interview-oriented deep dive for Senior & Staff System Design.
 * Covers Cascading Failure Dynamics, Deadline Propagation, Jitter Math,
 * Circuit Breaker State Transitions, Bulkhead Isolation, and Priority Load Shedding.
 */

export function renderResiliencePatternsContent(topic) {
  const patterns = [
    {
      name: "1. Timeouts & Deadlines",
      what: "Enforces an absolute upper bound on how long a caller will wait for a downstream dependency to respond.",
      implementation: "Client socket timeout, HTTP connect/read timeouts, and distributed deadline propagation (gRPC grpc-timeout).",
      failureMode: "No timeout = worker threads block indefinitely until thread pool exhausts. Timeout > caller deadline = wasted downstream compute nobody reads.",
      defaultSetting: "Downstream observed p99 + 25% safety margin, or parent deadline remainder.",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      name: "2. Retries + Backoff + Jitter",
      what: "Automatically re-executes operations that failed due to transient, non-permanent network blips or momentary node restarts.",
      implementation: "Exponential backoff: delay = min(cap, base * 2^attempt) combined with Full Jitter and global Retry Budgets (max 10% traffic).",
      failureMode: "Unbounded or un-jittered retries create catastrophic retry storms, multiplying load 3× to 10× on struggling dependencies.",
      defaultSetting: "Max 2 or 3 retries; full jitter; only retry idempotent operations and 503/429 status codes.",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      name: "3. Circuit Breaker",
      what: "Monitors downstream error rates; fails fast in 0 ms when an error threshold is crossed, giving the downstream service breathing room to recover.",
      implementation: "State machine: CLOSED (healthy) ──► OPEN (failing fast in 0ms) ──► HALF-OPEN (testing canary probe traffic).",
      failureMode: "Without it, every inbound request pays the full 5-second timeout, exhausting upstream connection pools and crashing the caller.",
      defaultSetting: "Trip if error rate &gt; 50% over a 100-request sliding window; 30s cool-down sleep window.",
      badgeColor: "text-rose-400 bg-rose-500/15 border-rose-500/30"
    },
    {
      name: "4. Bulkhead Isolation",
      what: "Partitions system resources (thread pools, connection pools, memory buffers) into isolated compartments so failure in one cannot sink the entire ship.",
      implementation: "Dedicated per-dependency thread pools (e.g. 20 threads for Payments, 10 for Recommendations) or semaphore concurrency limits.",
      failureMode: "A single slow third-party API consumes all 200 shared HTTP connection pool sockets, freezing checkout and catalog browsing.",
      defaultSetting: "Isolate high-criticality transactional paths from non-critical analytical or recommendation integrations.",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      name: "5. Backpressure & Load Shedding",
      what: "Rejects or throttles incoming requests at the perimeter when system resource saturation crosses safe operating thresholds.",
      implementation: "Bounded in-memory queues, TCP window flow control, reactive pull streaming, and HTTP 429/503 shedding with Retry-After headers.",
      failureMode: "Unbounded queues absorb excess traffic by ballooning memory until the Linux kernel OOM-killer terminates the process.",
      defaultSetting: "Bounded queues (e.g. 500 items max); shed requests with p99 queue wait &gt; 100ms.",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const jitterFormulas = [
    {
      type: "1. No Jitter (Synchronized)",
      formula: "T = min(T_max, T_base * 2^attempt)",
      behavior: "Catastrophic. All clients back off for identical durations, synchronizing retries into destructive harmonic load spikes.",
      verdict: "Anti-pattern in distributed systems."
    },
    {
      type: "2. Full Jitter (AWS Recommended)",
      formula: "T = random_between(0, min(T_max, T_base * 2^attempt))",
      behavior: "Optimal. Spreads client retry requests uniformly across the entire backoff window, completely flattening retry spikes into smooth queues.",
      verdict: "Standard production default."
    },
    {
      type: "3. Equal Jitter",
      formula: "half = min(T_max, T_base * 2^attempt) / 2;\nT = half + random_between(0, half)",
      behavior: "Guarantees a deterministic minimum wait time while adding randomness to the upper half of the window.",
      verdict: "Good when dependency requires a guaranteed minimum recovery sleep."
    },
    {
      type: "4. Decorrelated Jitter",
      formula: "T = min(T_max, random_between(T_base, T_prev * 3))",
      behavior: "Calculates backoff relative to the previous sleep time. Prevents clustering over long retry sequences.",
      verdict: "Preferred for long-running batch synchronization."
    }
  ];

  const circuitBreakerStates = [
    {
      state: "CLOSED (Normal Operation)",
      traffic: "100% of requests pass through to downstream dependency.",
      metricEvaluation: "Sliding window tracks success/failure ratio and latency. If failure rate exceeds threshold (e.g. 50% over last 100 calls), transitions to OPEN.",
      latencyCost: "Normal network RTT."
    },
    {
      state: "OPEN (Fast Failure)",
      traffic: "0% of requests reach downstream. All calls fail fast immediately in 0 ms.",
      metricEvaluation: "Returns cached fallback, default degraded value, or HTTP 503 instantly. A timer runs (cool-down period, e.g. 30 seconds). When timer expires, transitions to HALF-OPEN.",
      latencyCost: "Zero ms (No network call attempted)."
    },
    {
      state: "HALF-OPEN (Canary Probing)",
      traffic: "A limited trial cohort of requests (e.g. 5 requests) is permitted to call downstream.",
      metricEvaluation: "If all trial requests succeed, the breaker resets to CLOSED. If even a single trial request fails or times out, the breaker immediately re-opens for another 30 seconds.",
      latencyCost: "Standard RTT for trial requests."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="8.2-resilience">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Part 8 · Deployment, Reliability &amp; Operations
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 99–101 · Section 8.2</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Staff-Level Architecture
          </span>
        </div>
        <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          8.2 Resilience: Timeouts, Retries, Circuit Breakers, Backpressure
        </h2>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          How modern distributed architectures degrade gracefully under failure instead of collapsing. Understand the anatomy of cascading collapse and master the five core defensive primitives.
        </p>
      </div>

      <!-- Core What, Why, How, When Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">info</span>
            WHAT IT IS
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            The collection of architectural patterns that prevent localized software bugs, network jitter, or hardware degradations from snowballing into fleet-wide cascading outages.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">help</span>
            WHY IT MATTERS
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            In microservices, availability is multiplicative: if 10 services each have 99.9% availability, overall system availability drops to $0.999^{10} \approx 99.0\%$ (7.2 hours downtime/month). Resilience decouples failure.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">settings</span>
            HOW IT WORKS
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Combines bounded execution deadlines, full-jitter exponential backoff, sliding-window circuit breakers, thread pool compartmentalization, and perimeter load shedding.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">rule</span>
            GOLDEN RULE
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            <em>"Fast failure is always better than slow failure."</em> A 0 ms HTTP 503 allows the client to retry or render a cached fallback; a 10-second timeout hangs the entire calling stack.
          </p>
        </div>
      </div>

      <!-- Cascading Failure Anatomy Diagram -->
      <div class="bg-[#0A0E1A] border border-rose-500/30 rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-rose-400 uppercase flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            ANATOMY OF A CASCADING COLLAPSE (HOW A 50MS BLIP DESTROYS A CLUSTER)
          </span>
          <span class="text-[10px] font-code text-slate-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">The Death Spiral</span>
        </div>
        <div class="text-[11.5px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed bg-[#060911] p-4 rounded-lg border border-[#1E293B]">
Step 1: Downstream Service C experiences minor disk I/O stall; latency jumps from 50 ms ──► 5,000 ms.
          │
          ▼
Step 2: Upstream Service B's worker threads block waiting on Service C.               ◄── <span class="text-rose-400 font-bold">MISSING TIMEOUT</span>
          │
          ▼
Step 3: Service B exhausts its thread pool (all 200 threads stuck in blocking wait).   ◄── <span class="text-rose-400 font-bold">MISSING BULKHEAD</span>
          │
          ▼
Step 4: Upstream Service A times out on B and immediately RETRIES 3 times.           ◄── <span class="text-rose-400 font-bold">UNBOUNDED RETRIES</span>
          │
          ▼
Step 5: Incoming traffic volume to struggling Service B multiplies 3× to 4×.           ◄── <span class="text-rose-400 font-bold">RETRY STORM AMPLIFICATION</span>
          │
          ▼
Step 6: Service B memory buffers grow unbounded; Linux OOM-killer executes SIGKILL.   ◄── <span class="text-rose-400 font-bold">NO BACKPRESSURE / BOUNDED QUEUE</span>
          │
          ▼
Step 7: Load Balancer removes dead B nodes; remaining nodes take 2× load and die.    ◄── <span class="text-rose-400 font-bold">FULL CLUSTER CASCADE</span>
        </div>
      </div>

      <!-- The Five Resilience Patterns Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          THE FIVE DEFENSIVE RESILIENCE PATTERNS &amp; PRODUCTION CONFIGURATIONS
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${patterns.map(p => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3">
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="font-code text-[13px] font-bold text-white">${p.name}</span>
                  <span class="text-[10px] font-code px-2 py-0.5 rounded border ${p.badgeColor}">Core Primitive</span>
                </div>
                <p class="text-[12.5px] text-slate-200 font-sans leading-relaxed">${p.what}</p>
                <div class="p-2.5 rounded-lg bg-[#0A0E1A] font-mono text-[11px] text-cyan-300 border border-[#1E293B]">
                  <strong>Implementation:</strong> ${p.implementation}
                </div>
                <div class="p-2.5 rounded-lg bg-[#14121F] border border-rose-500/20 text-[11px] text-rose-300 font-sans leading-relaxed">
                  <strong>Get it wrong:</strong> ${p.failureMode}
                </div>
              </div>
              <div class="pt-2 border-t border-[#24314A]/60 text-[11px] font-code text-emerald-300">
                Default: ${p.defaultSetting}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Deep Dive: Distributed Deadline Propagation -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">hourglass_bottom</span>
            DISTRIBUTED DEADLINE PROPAGATION (THE END-TO-END TIME BUDGET)
          </span>
          <span class="text-[10px] font-code text-slate-400 bg-[#0B1120] px-2 py-0.5 rounded border border-[#24314A]">
            gRPC grpc-timeout / W3C Baggage
          </span>
        </div>

        <p class="text-[13px] text-slate-300 leading-relaxed">
          The classic rookie system design mistake is setting static, independent timeouts at every hop in a microservice call graph. If Service A has a 5-second timeout, calls Service B with a 5-second timeout, which calls Service C with a 5-second timeout, the total potential wait is 15 seconds. If the end user's browser gives up after 4 seconds, Services B and C continue computing for 11 seconds for a response that will be discarded upon arrival!
        </p>

        <!-- ASCII Architecture for Deadline Propagation -->
        <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] font-mono text-[11px] text-slate-300 overflow-x-auto">
Client (HTTP Deadline = 500 ms)
   │
   ▼
[ API Gateway ] ──(Spends 50ms)──► gRPC grpc-timeout: 450 ms
                                           │
                                           ▼
                                    [ Order Service ] ──(Spends 150ms)──► gRPC grpc-timeout: 300 ms
                                                                                  │
                                                                                  ▼
                                                                           [ Inventory Service ]
                                                                           Checks time left: 300 ms
                                                                           *If DB call takes 350 ms:
                                                                           <span class="text-rose-400 font-bold">ABORT IMMEDIATELY AT 300 ms!</span>
                                                                           Prevents wasted downstream DB load!
        </div>
      </div>

      <!-- Deep Dive: Exponential Backoff & Jitter Math -->
      <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">shuffle</span>
            EXPONENTIAL BACKOFF WITH FULL JITTER &amp; RETRY BUDGETS
          </span>
          <span class="text-[10px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
            Marc Brooker (AWS Reliability Paper)
          </span>
        </div>

        <p class="text-[13px] text-slate-300 leading-relaxed">
          When an outage causes thousands of requests to fail simultaneously, retrying without randomness creates <strong>synchronized thundering herds</strong>: all clients sleep for 1 second, then attack the recovering service simultaneously, crashing it again. Adding randomized <strong>jitter</strong> breaks synchronization and transforms spikes into a flat, steady arrival rate.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          ${jitterFormulas.map(j => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3.5 flex flex-col justify-between gap-2">
              <div class="flex flex-col gap-1.5">
                <span class="font-code text-[11.5px] font-bold text-white">${j.type}</span>
                <div class="p-2 rounded bg-[#070B14] font-mono text-[10.5px] text-emerald-300 border border-[#1E293B] whitespace-pre-wrap">
                  ${j.formula}
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed pt-1">${j.behavior}</p>
              </div>
              <div class="pt-2 border-t border-[#24314A]/60 text-[10.5px] font-code text-cyan-300">
                ${j.verdict}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Retry Budget Code Block -->
        <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] font-mono text-[11.5px] text-emerald-200/90 flex flex-col gap-2">
          <div class="text-indigo-400 font-bold">// THE RETRY BUDGET ALGORITHM (Mandatory for Large-Scale Distributed Fleets)</div>
<div>1. Token Bucket: Every regular successful request adds 0.1 tokens to the retry bucket.</div>
<div>2. When an RPC fails: Consume 1.0 token to retry. If tokens &lt;= 0: <span class="text-rose-400 font-bold">FAIL FAST WITHOUT RETRY!</span></div>
<div>3. Mathematical Guarantee: Total retry volume can NEVER exceed 10% of standard traffic, preventing retry storms during catastrophic outages!</div>
        </div>
      </div>

      <!-- Deep Dive: Circuit Breaker State Machine & Sliding Windows -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">toggle_on</span>
          CIRCUIT BREAKER STATE MACHINE &amp; SLIDING WINDOW EVALUATION
        </span>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          ${circuitBreakerStates.map(c => `
            <div class="bg-[#141C2E] border border-[#24314A] rounded-lg p-4 flex flex-col justify-between gap-2.5">
              <div class="flex flex-col gap-1.5">
                <span class="font-sans text-[13px] font-bold text-cyan-300">${c.state}</span>
                <p class="text-[11.5px] text-slate-300 font-sans leading-relaxed">${c.traffic}</p>
                <p class="text-[11px] text-slate-400 leading-relaxed pt-1">${c.metricEvaluation}</p>
              </div>
              <div class="pt-2 border-t border-[#24314A]/60 text-[11px] font-code text-emerald-400">
                Latency: ${c.latencyCost}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Circuit Breaker Diagram -->
        <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] font-mono text-[11.5px] text-slate-300 overflow-x-auto leading-relaxed">
                        failures &gt; 50% over sliding window
                 ┌────────────────────────────────────────────────► [ OPEN ]
                 │                                                    │
             [ CLOSED ] ◄──────── trial requests all succeed ───────┐  │ cool-down sleep 30s
             (Healthy)                                              │  ▼
                 ▲                                               [ HALF-OPEN ]
                 └────────────── any trial request fails ───────────┘
        </div>
      </div>

      <!-- Deep Dive: Bulkhead Isolation & Little's Law -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Bulkhead Isolation -->
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-cyan-400 text-[18px]">dns</span>
            <h4 class="font-sans text-[14px] font-bold text-white">Bulkhead Isolation (Thread Pool vs Semaphore)</h4>
          </div>
          <p class="text-[12.5px] text-slate-300 leading-relaxed">
            In nautical engineering, bulkheads divide a ship into watertight compartments so one breach does not sink the ship. In distributed systems:
          </p>
          <ul class="text-[12px] text-slate-300 list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
            <li><strong>Thread Pool Bulkhead:</strong> Each downstream client executes in an isolated thread pool (e.g. 20 threads for Checkout, 5 for Recommendations). If Recommendations hangs, its 5 threads block; Checkout continues running at 100% capacity.</li>
            <li><strong>Semaphore Bulkhead:</strong> Uses atomic counters without thread context switching overhead. Once concurrent calls reach the limit, excess requests are rejected immediately with HTTP 429.</li>
          </ul>
        </div>

        <!-- Little's Law & Load Shedding -->
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-400 text-[18px]">filter_alt</span>
            <h4 class="font-sans text-[14px] font-bold text-white">Priority Load Shedding &amp; Little's Law</h4>
          </div>
          <p class="text-[12.5px] text-slate-300 leading-relaxed">
            Little's Law dictates that average in-flight concurrency is $L = \lambda \times W$ (Arrival Rate $\times$ Latency). When latency $W$ increases 10×, in-flight requests $L$ increase 10×. If concurrency is capped, excess requests must be shed:
          </p>
          <ul class="text-[12px] text-slate-300 list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
            <li><strong>Priority Tiering:</strong> Tag requests with priority levels: Tier 1 (Checkout Payment) &gt; Tier 2 (Product Search) &gt; Tier 3 (Analytics / Recommendations).</li>
            <li><strong>Early Rejection:</strong> When queue wait time exceeds 50 ms, immediately drop Tier 3 traffic at the ingress gateway, preserving 100% of CPU for Tier 1 revenue transactions.</li>
          </ul>
        </div>
      </div>

      <!-- Three Rules That Separate Senior Candidates -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3 font-sans">
        <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">verified</span>
          THREE ARCHITECTURAL LAWS THAT SEPARATE SENIOR CANDIDATES
        </span>
        <ul class="text-[12.5px] text-slate-300 flex flex-col gap-2.5 list-disc list-inside leading-relaxed">
          <li><strong>Law 1: Only Retry Idempotent Operations.</strong> Retrying a failed HTTP POST without a unique <code>Idempotency-Key</code> creates duplicate credit card charges and phantom orders. Only retry HTTP GET/PUT, or pass an idempotent deduplication token.</li>
          <li><strong>Law 2: Retry at Exactly ONE Layer in the Call Graph.</strong> If the mobile client retries 3×, the API Gateway retries 3×, and the Service Mesh retries 3×, a single user request multiplies into $3 \times 3 \times 3 = 27$ calls! Standardize retries at the service mesh or client, never both.</li>
          <li><strong>Law 3: Degrade Gracefully Instead of Failing.</strong> Return cached data from Redis, render a default recommendations list, or enqueue operations asynchronously into Kafka rather than showing a user-facing HTTP 500 error screen.</li>
        </ul>
      </div>

      <!-- Key Architectural Takeaway -->
      <div class="bg-gradient-to-r from-cyan-950/60 to-rose-950/60 border border-cyan-500/40 rounded-xl p-5 flex flex-col gap-1.5 shadow-lg shadow-rose-950/40">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">key</span>
          KEY SYSTEM DESIGN TAKEAWAY
        </span>
        <p class="font-sans text-[13.5px] text-white font-medium leading-relaxed">
          Every remote network call must have an explicit deadline, exponential backoff with full jitter, a retry budget, a circuit breaker, and an isolated bulkhead. Cascading outages are almost never caused by the original failure; they are caused by uncontrolled retries and thread pool starvation amplifying load at the worst possible moment.
        </p>
      </div>

    </div>
  `;
}
