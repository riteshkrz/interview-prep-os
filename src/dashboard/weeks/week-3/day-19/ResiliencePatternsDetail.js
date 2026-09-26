/**
 * 8.2 Resilience: Timeouts, Retries, Circuit Breakers, Backpressure - Visual Guide
 * High-signal, visually rich reproduction of Pages 99–101
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderResiliencePatternsContent(topic) {
  const patterns = [
    {
      name: "Timeout",
      what: "Bounds maximum duration caller waits for a downstream dependency.",
      getWrong: "No timeout = worker threads leak until process dies. Timeout longer than caller deadline = wasted computation nobody reads."
    },
    {
      name: "Retry + Backoff + Jitter",
      what: "Recovers automatically from transient network blips and momentary glitches.",
      getWrong: "Immediate or unbounded retries convert a temporary hiccup into a self-inflicted DDoS; synchronized retries create destructive thundering herds."
    },
    {
      name: "Circuit Breaker",
      what: "Fails fast immediately when a dependency is unhealthy, granting it breathing room to recover.",
      getWrong: "Without it, every thread pays the full 5-second timeout, exhausting upstream thread pools and taking down the caller."
    },
    {
      name: "Bulkhead",
      what: "Isolates resources (thread pools, memory, socket connections) per downstream service.",
      getWrong: "A single slow third-party dependency consumes the entire shared connection pool, crashing unrelated core checkout features."
    },
    {
      name: "Load Shedding / Backpressure",
      what: "Rejects or throttles excess load at the perimeter (HTTP 429 / 503) when capacity is exceeded.",
      getWrong: "Unbounded in-memory queues convert a throughput spike into ballooning latency, memory exhaustion, and catastrophic OOM crashes."
    }
  ];

  const followUps = [
    {
      q: "How do you choose a timeout value scientifically in production?",
      a: "Derive from the downstream service's observed latency distribution: set timeout near <strong>p99 + buffer</strong> (e.g. p99 = 180ms → timeout = 250ms), and make it strictly shorter than the caller's own deadline so you retain room to retry or degrade. <em>The staff-level solution:</em> <strong>Deadline Propagation</strong> (gRPC <code>grpc-timeout</code> / W3C Baggage) — each hop passes its remaining time budget down the call graph. If the budget hits zero, downstream nodes abort immediately, preventing wasted work."
    },
    {
      q: "A dependency is degraded, not down — returning 30% errors. What does your service do?",
      a: "A naive count-based circuit breaker flaps wildly in this scenario. Use an <strong>error-rate-based breaker</strong> with a minimum request volume threshold (e.g., trip if error rate exceeds 25% over at least 50 calls in 10s). Pair this with <strong>priority load shedding</strong>: drop non-essential features (analytics, recommendations) to preserve core transactional flows. Retries must be strictly bounded by a <strong>retry budget</strong> (max 10% of total traffic), and fallbacks should serve cached data with a degraded-mode metric emitted."
    },
    {
      q: "Where does backpressure come from in practice, and how is it signaled?",
      a: "Through <strong>bounded queues and flow control</strong>. Give every thread pool and buffer an explicit limit, and reject requests immediately with <code>HTTP 429 Too Many Requests</code> or <code>503 Service Unavailable</code> with a <code>Retry-After</code> header rather than queueing indefinitely — <em>a fast rejection is information the client can handle; an unbounded queue is a lie</em>. In event streaming (Kafka), backpressure is native: consumers pull at their own processing rate, and lag metrics make slowdowns visible."
    },
    {
      q: "How do you test and prove resilience mechanisms before an outage occurs?",
      a: "<strong>Fault injection and Game Days (Chaos Engineering, sec. 12.7):</strong> inject synthetic network latency and error spikes into dependencies in staging and at 1% canary traffic in production. Verify that circuit breakers trip into OPEN state, fallback degraded paths render cleanly, and no retry amplification occurs in upstream logs. Untested resilience code is almost always broken resilience code."
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
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          8.2 Resilience: Timeouts, Retries, Circuit Breakers, Backpressure
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          How modern distributed architectures degrade gracefully instead of collapsing. Understand the anatomy of a cascading failure and master the five core defensive primitives.
        </p>
      </div>

      <!-- Cascading Failure Anatomy Diagram -->
      <div class="bg-[#0A0E1A] border border-rose-500/30 rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-rose-400 uppercase">
            ANATOMY OF A CASCADING COLLAPSE (HOW A BLIP BECOMES AN OUTAGE)
          </span>
          <span class="text-[11px] font-code text-slate-500">Failure Progression</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
Service B slows from 50 ms ──► 5 s
  │
  ▼
Service A's worker threads all block waiting on B         ◄── NO TIMEOUT
  │
  ▼
Service A's clients time out and RETRY                    ◄── RETRIES MULTIPLY TRAFFIC 3×
  │
  ▼
Service B receives 3× traffic while already degraded     ◄── NO CIRCUIT BREAKER
  │
  ▼
Service A's memory buffers grow unbounded ──► OOM CRASH   ◄── NO BOUNDED QUEUE / LOAD SHEDDING
  │
  ▼
Health checks time out ──► Nodes removed ──► Less fleet   ◄── CASCADING COLLAPSE ACROSS CLUSTER
        </div>
      </div>

      <!-- Five Resilience Patterns Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          THE FIVE DEFENSIVE PATTERNS &amp; WHAT EACH PREVENTS
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          ${patterns.map(p => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col justify-between gap-2.5">
              <div class="flex flex-col gap-1.5">
                <span class="font-code text-[12.5px] font-bold text-cyan-300">${p.name}</span>
                <p class="text-[12px] text-slate-200 font-sans leading-relaxed">${p.what}</p>
              </div>
              <div class="p-2.5 rounded-lg bg-[#14121F] border border-rose-500/20 text-[11px] text-rose-300 font-sans leading-relaxed">
                <strong>Get it wrong:</strong> ${p.getWrong}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Circuit Breaker State Machine & Jitter Code Block -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Breaker State Machine -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-mono text-[11.5px]">
          <span class="text-[11px] font-code font-bold text-indigo-300 uppercase tracking-wider">
            CIRCUIT BREAKER STATE MACHINE
          </span>
          <div class="text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
          failures > 50% threshold
   ┌───────────────────────────────────► [ OPEN ]
   │                                       │
[ CLOSED ] ◄─── probe trial succeeds ───┐  │ cool-down 30s
 (Healthy)                              │  ▼
   ▲                                  [ HALF-OPEN ]
   └─────────── trial fails ───────────┘
          </div>
          <p class="text-[11.5px] text-slate-400 font-sans leading-relaxed pt-1">
            When OPEN: fails fast in 0 ms without making network calls. When cool-down expires, transitions to HALF-OPEN to safely probe downstream health with trial requests.
          </p>
        </div>

        <!-- Jitter & Retry Budget Code -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-mono text-[11.5px]">
          <span class="text-[11px] font-code font-bold text-emerald-300 uppercase tracking-wider">
            EXPONENTIAL BACKOFF WITH FULL JITTER &amp; RETRY BUDGET
          </span>
          <div class="text-emerald-200/90 whitespace-pre overflow-x-auto leading-relaxed bg-[#060911] p-3 rounded-lg border border-[#1E293B]">
// 1. Exponential Backoff with JITTER (Jitter prevents thundering herds)
delay = min(cap_ms, base_ms * (2 ** attempt)) * random(0.5, 1.5);

// 2. RETRY BUDGET (Mandatory at scale!)
// Cap retries at 10% of total incoming requests.
if (current_retries / total_requests > 0.10) {
    return fail_fast_no_retry(error);
}
          </div>
          <p class="text-[11.5px] text-slate-400 font-sans leading-relaxed">
            Without randomized jitter, thousands of retrying clients synchronize their timers into wave after wave of destructive load spikes.
          </p>
        </div>
      </div>

      <!-- Three Rules That Make This a Senior Answer -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2 font-sans">
        <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider">
          THREE RULES THAT SEPARATE SENIOR CANDIDATES
        </span>
        <ul class="text-[12.5px] text-slate-300 flex flex-col gap-2 list-disc list-inside leading-relaxed">
          <li><strong>Only retry idempotent operations:</strong> Retry on network timeouts and 503s, never on 400s or business rejections. For non-idempotent writes, pass an <code>Idempotency-Key</code> (sec. 9.4.3).</li>
          <li><strong>Retry at ONE layer only:</strong> Client retries × Load Balancer retries × Service Mesh retries compound multiplicatively ($3 \times 3 \times 3 = 27\times$ load explosion!). Pick one layer and disable retries on the rest.</li>
          <li><strong>Degrade, don't fail:</strong> Return stale cache data, omit personalization widgets, or enqueue writes asynchronously rather than presenting a 500 error screen.</li>
        </ul>
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
      <div class="bg-gradient-to-r from-cyan-950/60 to-rose-950/60 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Every remote call needs a timeout, a bounded retry with jitter, a circuit breaker, and a defined degraded mode. Cascading failures are almost always caused by retries amplifying load at exactly the wrong moment."
        </p>
      </div>

    </div>
  `;
}
