/**
 * 12.5 Capacity Planning & 12.6 Cost as a Constraint - Visual Guide
 * High-signal, visually rich reproduction of Pages 157–160
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderCapacityAutoscalingContent(topic) {
  const signalRows = [
    {
      signal: "Concurrency (In-Flight Requests)",
      goodFor: "Most online I/O-bound web services — follows Little's Law directly.",
      misleads: "Requires fine-grained metrics instrumentation; conflates slow downstreams with real user traffic.",
      rating: "Recommended Default"
    },
    {
      signal: "CPU Utilization",
      goodFor: "CPU-bound batch jobs, cryptographic hashing, machine learning, and transcoding.",
      misleads: "Useless for I/O-bound microservices — CPU sits idle at 20% while latency triples waiting on DB locks.",
      rating: "Common Mistake"
    },
    {
      signal: "Queue Depth / Consumer Lag",
      goodFor: "Asynchronous background consumers, event streaming pipelines, and worker fleets.",
      misleads: "Lagging indicator — by the time queue depth spikes, the backlog is already out of control.",
      rating: "Best for Workers"
    },
    {
      signal: "Active Connections",
      goodFor: "Long-lived connection tiers: WebSockets, SSE, MQTT, and gRPC streaming (sec. 11.5).",
      misleads: "Memory and file descriptor bound; CPU will look completely idle even when node memory is exhausted.",
      rating: "Best for WebSockets"
    },
    {
      signal: "p99 Response Latency",
      goodFor: "Alerting and SLO monitoring (sec. 12.3).",
      misleads: "Extremely dangerous as an autoscaling trigger: a saturated database causes you to scale app nodes, making the database collapse faster.",
      rating: "Never Autoscale On This"
    }
  ];

  const cheapCostChoices = [
    { num: "1", title: "Raise Cache Hit Ratio", desc: "Nothing else removes as much origin compute and bandwidth per unit of effort (sec. 5.1). 80% → 95% cuts origin load by 75%." },
    { num: "2", title: "Keep Traffic in One AZ", desc: "Zone-aware load balancing is pure configuration: callers prefer same-AZ replicas, eliminating expensive cross-AZ transfer fees." },
    { num: "3", title: "Batch and Compress", desc: "Fewer, larger operations beat thousands of tiny ones for both CPU overhead and data egress (Kafka linger.ms, Parquet)." },
    { num: "4", title: "Tier Your Storage", desc: "Most data is write-once and read within 7 days. Lifecycle cold data to Infrequent Access / Glacier (sec. 6.1)." },
    { num: "5", title: "Use Spot / Preemptible", desc: "Leverage 70–90% discounts for interruptible workloads: batch ETL, CI builds, video transcoding, ML training." },
    { num: "6", title: "Enforce Retention Policies", desc: "Delete what nobody reads. Dropping 90-day-old debug logs and ephemeral metric series is the highest-leverage savings lever." }
  ];

  const followUps = [
    {
      q: "Traffic will spike 100× in 60 seconds for a product launch. What is your scaling strategy?",
      a: "<strong>Do not rely on autoscaling — pre-scale!</strong> Cloud VMs and containers take 60 to 180 seconds to spin up, pull images, and warm JITs; a 100× flash spike hits in 10 seconds. Autoscaling will always lose the race. <em>The senior playbook:</em> 1) Pre-provision capacity 1 hour before the launch; 2) Pre-warm caches and connection pools; 3) Enforce <strong>Admission Control</strong> at the edge (sec. 9.6) to admit only what backend databases can serve, rejecting the excess cheaply with HTTP 429."
    },
    {
      q: "How do you size capacity using Little's Law?",
      a: "Apply the invariant formula: <code>Concurrency = Arrival Rate × Service Time (L = λ × W)</code>. For 5,000 requests/sec with a 200ms average response time: <code>L = 5,000 × 0.2s = 1,000 concurrent requests in flight</code>. If each request consumes a thread, 1,000 threads will melt a blocking OS runtime. If latency doubles under load to 400ms, concurrency demand doubles to 2,000 — which causes queue collapse unless load shedding is in place."
    },
    {
      q: "How does autoscaling sometimes accelerate a production outage?",
      a: "<strong>By scaling into a shared dependency limit.</strong> When the app tier scales from 20 to 100 nodes, each new node opens its own database connection pool (e.g. 50 connections each = 5,000 total connections), completely exhausting PostgreSQL's connection limit. The database crashes, taking down the entire cluster. Defenses: PgBouncer connection pooling, reserved concurrency caps, and queue decoupling."
    },
    {
      q: "Your cloud bill is $2M per year. The CTO asks you to cut it by half. Where do you start?",
      a: "Attack in order of magnitude: 1) <strong>Storage tiering &amp; retention:</strong> move cold unindexed S3 data to Glacier and drop 30-day debug logs (frequently 20–30% of total spend); 2) <strong>Cache hit ratio &amp; CDN offload:</strong> eliminate origin egress and compute; 3) <strong>Compute right-sizing:</strong> replace idle over-provisioned instances with spot and serverless containers; 4) <strong>Cross-AZ chatter elimination:</strong> enable zone-affinity routing. <em>Crucial caveat:</em> explicitly refuse to cut multi-AZ redundancy or error-log retention."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="12.5-autoscaling">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Part 12 · Reliability &amp; Production at Scale
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 157–160 · Sections 12.5 &amp; 12.6</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 25 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          12.5 Capacity Planning, Autoscaling &amp; Unit Economics
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Deciding how much infrastructure capacity to run, scaling reactively vs. pre-provisioning, and framing cloud spend as unit economics ($ per 1,000 requests) rather than an uncontrolled monthly bill.
        </p>
      </div>

      <!-- Little's Law Code Box -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            LITTLE'S LAW — THE CAPACITY SIZING FORMULA TO KNOW
          </span>
          <span class="text-[11px] font-code text-slate-500">L = λ × W</span>
        </div>
        <div class="text-[12px] text-cyan-200/90 whitespace-pre overflow-x-auto leading-relaxed">
// Concurrency you must support = Arrival Rate (λ) × Average Service Time (W)
L = λ × W

// Worked Example: 5,000 RPS at 200 ms service time:
L = 5000 × 0.2 s = 1,000 concurrent requests in flight

// If each request requires an OS thread and database connection:
1,000 OS threads will cause CPU context-switch collapse (sec. 1.1)
1,000 direct database connections will melt PostgreSQL → Use PgBouncer connection pool!

// The Sizing Trap:
When latency degrades under load from 200 ms → 400 ms:
Concurrency demand DOUBLES: L = 5,000 × 0.4 s = 2,000 requests in flight!
This triggers queue collapse unless Load Shedding (sec. 8.2) rejects excess requests.
        </div>
      </div>

      <!-- Autoscaling Signals Matrix -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          AUTOSCALING SIGNALS COMPARED
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/4">Metric Signal</th>
                <th class="p-3 w-1/3">Where It Works Well</th>
                <th class="p-3 w-1/3">Why It Misleads / Fails</th>
                <th class="p-3 w-1/6">Verdict</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${signalRows.map(s => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${s.signal}</td>
                  <td class="p-3 text-slate-300">${s.goodFor}</td>
                  <td class="p-3 text-rose-300/90">${s.misleads}</td>
                  <td class="p-3 font-code text-[11px] text-amber-300">${s.rating}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Unit Economics & 6 Cheap Architecture Choices -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider">
            Unit Economics: Cost per 1,000 Requests (Sec. 12.6)
          </span>
          <span class="text-[11px] font-code text-slate-400">1B req/mo @ $40k = $0.04 / 1k requests</span>
        </div>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          Do not discuss the cloud bill in abstract totals. Frame architectural decisions around unit value: raising cache hit ratio from 80% to 95% reduces origin requests from 200M to 50M, directly slashing 75% of compute and egress spend.
        </p>

        <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
          Six Cheap Architecture Choices (Ordered by Payoff)
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          ${cheapCostChoices.map(c => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11.5px] font-bold text-emerald-400">#${c.num}: ${c.title}</span>
              <p class="text-[11px] text-slate-300 leading-relaxed font-sans">${c.desc}</p>
            </div>
          `).join('')}
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
      <div class="bg-gradient-to-r from-amber-950/60 to-cyan-950/60 border border-amber-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-amber-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Use Little's Law to size concurrency, scale on concurrency or queue depth rather than CPU, and size for peak plus one failure domain plus warm-up time. Say plainly that autoscaling cannot beat a fast spike — that is what pre-scaling and load shedding are for."
        </p>
      </div>

    </div>
  `;
}
