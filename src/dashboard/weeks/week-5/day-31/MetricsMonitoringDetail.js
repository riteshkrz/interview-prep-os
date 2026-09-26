/**
 * Metrics Monitoring & Alerting System (Topics 7.5 & 7.6)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 90–94
 */

export function renderMetricsMonitoringContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="metrics-monitoring">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topics 7.5 & 7.6 · Pages 90–94
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Production Observability Architecture
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Scale: 5M+ Series · 330k+ Samples/sec</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Metrics Monitoring, Alerting & Pull vs. Push Collection</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        A resilient metrics pipeline decouples collection from persistence using streaming buffers (Kafka), indexes time-series data with extreme label-cardinality governance (TSDB), and drives actionable alerting based on user-visible symptoms (Four Golden Signals & SLO burn rates) rather than internal hardware causes.
      </p>
    </div>

    <!-- ASCII Pipeline Diagram -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        End-to-End Metrics & Alerting Pipeline (Page 91)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
  App servers ──┐
  Databases   ──┼──► METRICS COLLECTOR ──► KAFKA ──► CONSUMERS ──► TIME-SERIES DB
  Queues      ──┘        (Pull / Push)      (Buffer)    (Flink/Spark:  (InfluxDB / M3DB /
  Hosts                                                 downsample)    Prometheus TSDB)
                                                                             │
                                                                             ▼
                                                                    ┌── QUERY SERVICE ──┐
                                                                    ▼                   ▼
                                                            ALERTING SYSTEM       VISUALIZATION
                                                                    │               (Grafana)
                                                          ┌─────────┴─────────┐
                                                       Email / Slack       PagerDuty

 Why Kafka in the middle:
 • Absorbs collection spikes during cascading incident failovers.
 • Decouples collection rate from TSDB write pressure.
 • Survives TSDB downtime (Kafka retention acts as an elastic crash buffer).
 • Enables multiple consumers: real-time anomaly detection, cold Parquet archives, and TSDB ingest.
</pre>
      </div>
    </div>

    <!-- Section 7.6: Pull vs Push Architecture & Tradeoffs -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          Topic 7.6: Pull (Prometheus) vs. Push (StatsD / OTel) Model
        </h3>
        <span class="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">The Great Industry Debate</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 font-mono text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-cyan-500/30">
          <div class="text-cyan-400 font-bold mb-2">PULL (Prometheus Model)</div>
<pre class="text-slate-300 whitespace-pre-wrap leading-relaxed">
  Service Discovery (k8s/Consul)
       │ (Endpoint list + intervals)
       ▼
  COLLECTOR ──GET /metrics──► App Node A
            ──GET /metrics──► App Node B
            ──GET /metrics──► App Node C

✓ Free Liveness: Scrape fails ⇒ host is down ("up" metric)
✓ Flow Control: Collector dictates rate; clients cannot flood
✓ Easy Debugging: Developers can curl /metrics locally
✗ Reachability: Collector must route to every private pod
✗ Short-lived: Lambdas may finish before next scrape cycle
</pre>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-purple-500/30">
          <div class="text-purple-400 font-bold mb-2">PUSH (StatsD / OTel / InfluxDB Model)</div>
<pre class="text-slate-300 whitespace-pre-wrap leading-relaxed">
  App Node A ──emit──► Local Agent / Daemon ──► TSDB
  Lambda Task──emit──► Push Gateway / Aggregator
  Mobile App ──emit──► Edge Ingestion Gateway

✓ Ephemeral: Perfect for short-lived batch jobs & serverless
✓ NAT/Firewall: Outbound only; no open inbound scrape ports
✓ Event-Driven: Transmits metrics at moment of occurrence
✗ Overwhelm: A runaway loop can DOS the metric pipeline
✗ Ambiguous Silence: Is a quiet host idle, healthy, or dead?
</pre>
        </div>
      </div>

      <!-- Trade-off Table -->
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Dimension</th>
              <th class="p-3 font-semibold text-cyan-300">Pull Model</th>
              <th class="p-3 font-semibold text-purple-300">Push Model</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">Liveness Detection</td>
              <td class="p-3 text-cyan-200">Free — a failed HTTP scrape directly records up=0</td>
              <td class="p-3 text-slate-400">Ambiguous silence; requires a distinct heartbeat ping</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Flow Control</td>
              <td class="p-3 text-cyan-200">Collector controls rate; naturally self-throttled</td>
              <td class="p-3 text-slate-400">Clients can flood collector; requires buffering & drops</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Network & Firewall</td>
              <td class="p-3 text-slate-400">Inbound access required; tricky across VPCs/firewalls</td>
              <td class="p-3 text-purple-200">Outbound only; firewall & NAT-friendly</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Short-Lived / Lambda</td>
              <td class="p-3 text-slate-400">May terminate before scrape; requires push-gateway hack</td>
              <td class="p-3 text-purple-200">Natural fit; process flushes before terminating</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Configuration Surface</td>
              <td class="p-3 text-cyan-200">Centralized in scrape configs & Service Discovery</td>
              <td class="p-3 text-slate-400">Decentralized across client code, agents, and configs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
        <strong class="font-bold text-amber-300 uppercase tracking-wider block mb-1">The Answer That Ends The Debate (Page 93):</strong>
        "There is no single correct model: production systems use <strong>Pull</strong> for long-lived backend microservices with Kubernetes Service Discovery (gaining free up metrics and preventing client flooding), and <strong>Push</strong> for short-lived Lambdas, batch jobs, and edge devices via local sidecar agents. For batch jobs pushed to a Push Gateway, always enforce an explicit TTL expiration, otherwise a crashed job reports its last value forever and hides an outage."
      </div>
    </div>

    <!-- Sizing Arithmetic & High Cardinality Drill -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
        Capacity Sizing & Arithmetic Drill (Page 93)
      </h3>
      <div class="p-4 rounded-xl bg-[#141C2E] border border-blue-500/20 text-xs space-y-3 font-mono">
        <div class="text-blue-300 font-bold">Scenario: 10,000 Hosts Fleet Telemetry</div>
        <ul class="space-y-1.5 text-slate-300 list-disc list-inside">
          <li><strong>Fleet Size:</strong> 10,000 hosts × 500 distinct metric time-series per host = <span class="text-white font-bold">5,000,000 active series</span>.</li>
          <li><strong>Scrape Frequency:</strong> Every 15 seconds.</li>
          <li><strong>Ingest Rate:</strong> 5,000,000 ÷ 15 s ≈ <span class="text-emerald-400 font-bold">333,333 metric samples/second</span>.</li>
          <li><strong>Node Capacity:</strong> A standard 8-core / 32 GB TSDB node handles ~250,000 writes/second under Gorilla compression.</li>
          <li><strong>Architectural Decision:</strong> Ingest exceeds a single node. We must hash the target list across collector replicas, shard ingest across TSDB nodes by metric-name/tenant hash, and buffer bursts with Kafka.</li>
        </ul>
      </div>
    </div>

    <!-- The 3 Pillars & Golden Signals -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
        Two Additions That Complete The Senior Design (Page 91)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="font-bold text-white mb-2 text-sm flex items-center gap-2">
            <span>1. The Three Pillars of Observability</span>
          </div>
          <ul class="space-y-2 text-slate-300">
            <li><strong class="text-cyan-300">Metrics:</strong> Low cardinality, fixed overhead, answers <em>"Is something broken right now?"</em></li>
            <li><strong class="text-amber-300">Logs:</strong> High cardinality, unstructured or JSON, answers <em>"What specific payload caused it?"</em></li>
            <li><strong class="text-emerald-300">Traces:</strong> Distributed span waterfalls (sampled), answers <em>"Where in the microservice call graph did latency spike?"</em></li>
          </ul>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="font-bold text-white mb-2 text-sm flex items-center gap-2">
            <span>2. Symptom-Based Alerting (The 4 Golden Signals)</span>
          </div>
          <p class="text-slate-400 mb-2">
            Never wake up on-call engineers for internal causes like <code class="text-pink-300">CPU &gt; 80%</code> (CPU may run at 90% efficiently without user impact). Alert on customer-perceived symptoms:
          </p>
          <div class="grid grid-cols-2 gap-1.5 font-mono text-slate-200">
            <span class="bg-slate-900 px-2 py-1 rounded">1. Latency (p99/p95)</span>
            <span class="bg-slate-900 px-2 py-1 rounded">2. Traffic (RPS demand)</span>
            <span class="bg-slate-900 px-2 py-1 rounded">3. Errors (HTTP 5xx rate)</span>
            <span class="bg-slate-900 px-2 py-1 rounded">4. Saturation (Queue lag)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Interview Follow-ups -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Staff & Principal Engineer Interview Probes
      </h3>
      <div class="space-y-4 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q1: Do you actually need Kafka in this metrics pipeline?</h4>
          <p class="text-slate-300 leading-relaxed">
            Not at small scale — direct HTTP writes from Prometheus or agent to TSDB save operational cost. Kafka earns its place when you need to absorb sudden network recovery bursts, feed independent secondary consumers (long-term Parquet cold lake on S3, real-time ML anomaly detection), and survive TSDB maintenance outages using message retention as an elastic crash buffer. Justify with scale, not habit.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q2: How do you avoid missing metrics from newly autoscaled instances?</h4>
          <p class="text-slate-300 leading-relaxed">
            Never maintain static DNS or IP target files — this fails during horizontal autoscaling. Use dynamic Service Discovery (Kubernetes Endpoints API, Consul, AWS Cloud Map). Collectors register watch notifications or poll service discovery every 10–30s. Ephemeral pod IDs must be stored as series labels so pod churn does not overwrite existing series.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q3: How do you scale rule evaluation and prevent alert storm delays?</h4>
          <p class="text-slate-300 leading-relaxed">
            Alert rules are scheduled queries: <code class="text-pink-300">Load = rules × series × frequency</code>. Shard rule evaluation across worker processes by rule hash or tenant. Precompute complex queries using Recording Rules into new series. Isolate the alerting query engine from human Grafana dashboard queries so a stampede of debugging engineers during a SEV-1 incident does not starve alert evaluations.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 94)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "The production metrics pipeline is: Collect → Buffer (Kafka) → Process/Downsample → Store (TSDB) → Query → Alert/Visualize. Pull gives you flow control and a free liveness signal; push gives you reach and works for ephemeral serverless workloads. Use pull as the core backbone with service discovery, push with TTLs for serverless, and alert strictly on user-visible symptoms with multi-window SLO burn rates."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
