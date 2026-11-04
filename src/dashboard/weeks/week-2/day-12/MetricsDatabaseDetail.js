/**
 * 4.11 Choosing a Database for a Metrics Collecting Service - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 73 and 74
 * from The Modern System Design Interview Guide.
 */

export function renderMetricsDatabaseContent(topic) {
  const tsdbEngines = [
    {
      engine: "1. InfluxDB",
      storageModel: "Custom TSM (Time-Structured Merge Tree), Gorilla Compression",
      queryModel: "InfluxQL / Flux (SQL-like)",
      cardinalityResilience: "Moderate (TSI index in InfluxDB 2.0+ handles ~10M series)",
      bestFor: "IoT telemetry, real-time sensor streams, standalone time-series apps"
    },
    {
      engine: "2. TimescaleDB",
      storageModel: "PostgreSQL Extension with Automated Time-Partitioned 'Hypertables'",
      queryModel: "Full ANSI SQL with relational JOINs",
      cardinalityResilience: "High (PostgreSQL B-Trees and hypertables handle high tag counts)",
      bestFor: "Mixed workloads needing both time-series metrics and relational business metadata"
    },
    {
      engine: "3. Prometheus",
      storageModel: "Local Append-Only Segment Chunks (2-hour blocks), Pull-Scraped",
      queryModel: "PromQL (Vector-based instant & range queries)",
      cardinalityResilience: "Extremely Fragile to High Cardinality (In-memory head block)",
      bestFor: "Kubernetes cluster monitoring, microservice alerting, short-term APM (15 days)"
    },
    {
      engine: "4. VictoriaMetrics / Thanos",
      storageModel: "LSM-based distributed object storage (S3/GCS backend)",
      queryModel: "PromQL / MetricsQL compatible",
      cardinalityResilience: "Very High (Optimized for multi-tenant billions of series)",
      bestFor: "Global multi-cluster long-term Prometheus telemetry aggregation"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why do relational databases (MySQL, PostgreSQL) fail for high-throughput metrics collection?",
      answer: `Relational databases are designed for balanced transactional OLTP workloads with strict ACID guarantees. When subjected to operational telemetry (100,000 to 1,000,000 datapoints/second), they collapse due to:
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Random I/O & Index Amplification:</strong> Every insert into a relational table with secondary indexes (<code>host_id</code>, <code>metric_name</code>, <code>timestamp</code>) requires updating multiple B-Trees in-place. Writing 50 bytes of metric data generates 16KB random page rewrites on disk.</li>
        <li><strong>Catastrophic Deletion Bloat:</strong> Metrics have strict retention policies (e.g. discard data after 30 days). Executing <code>DELETE FROM metrics WHERE created_at &lt; NOW() - INTERVAL '30 days'</code> on billions of rows causes massive row-locking, transaction log bloat, and table fragmentation that requires disruptive <code>VACUUM FULL</code>.</li>
        <li><strong>Lack of Native Compression:</strong> Relational tables store timestamps and float values as raw 8-byte integers/doubles (16 bytes per sample). A TSDB with Gorilla compression stores the exact same sample in <strong>under 1.5 bytes</strong> (a $10\\times$ to $12\\times$ storage savings!).</li>
      </ol>`
    },
    {
      qNum: "Q2",
      question: "How does Facebook's Gorilla compression algorithm compress timestamps and floating-point values?",
      answer: `Gorilla (Pelkonen et al., VLDB 2015) is the compression standard powering modern TSDBs (Prometheus, InfluxDB, M3DB).
      <br/><br/>
      <strong class="text-indigo-400">1. Delta-of-Delta Timestamp Compression:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Metrics are collected at regular intervals (e.g. every 10 seconds: $t_1 = 10, t_2 = 20, t_3 = 30$).</li>
        <li>The first delta is $D = t_i - t_{i-1} = 10$.</li>
        <li>The delta-of-delta is $D' = D_i - D_{i-1} = 10 - 10 = 0$.</li>
        <li>If $D' = 0$ (the interval was on time), Gorilla stores a single <strong>1-bit value: '0'</strong>! Over 95% of timestamps in regular collection are stored in a single bit instead of 64 bits.</li>
      </ul>
      <br/>
      <strong class="text-indigo-400">2. XOR Floating-Point Value Compression:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Successive metric values change slowly (e.g. CPU at 42.1% then 42.2%).</li>
        <li>The current 64-bit IEEE float is bitwise XORed with the previous value: $X = V_i \oplus V_{i-1}$.</li>
        <li>If the value is unchanged, $X = 0$, stored as a <strong>single bit '0'</strong>.</li>
        <li>If $X \neq 0$, Gorilla stores only the count of leading and trailing zeros and the meaningful middle bits, compressing 64-bit floats to an average of <strong>1.37 bytes</strong>.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "Push vs. Pull Metrics Architecture: What are the fundamental trade-offs?",
      answer: `This is a classic infrastructure debate (Prometheus Pull vs. StatsD / OpenTelemetry / Datadog Push).
      <br/><br/>
      <strong class="text-cyan-400">The Pull Model (Prometheus):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Health Detection:</strong> If a target fails to respond to a scrape, Prometheus immediately flags the instance as <code>DOWN</code> (instant liveness monitoring).</li>
        <li><strong>Centralized Rate Control:</strong> The central server dictates scrape frequency; target applications cannot accidentally overwhelm the monitoring cluster with runaway metrics.</li>
        <li><strong>Challenge:</strong> Scraper must discover target IP addresses (requires Consul/Kubernetes DNS service discovery) and cannot scrape short-lived serverless functions (AWS Lambda).</li>
      </ul>
      <br/>
      <strong class="text-emerald-400">The Push Model (StatsD / OpenTelemetry):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Ephemeral & Serverless Native:</strong> Ideal for AWS Lambda, batch jobs, and mobile apps that execute and terminate before a pull scraper can run.</li>
        <li><strong>Simplified Security:</strong> Applications push outbound HTTPS/UDP; no need for central scrapers to reach into private VPC subnets.</li>
        <li><strong>Challenge:</strong> If a service crashes, it simply stops pushing; the monitoring system cannot easily distinguish between a crashed service and a decommissioned node.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "How do production systems architect long-term metrics storage without storage costs exploding?",
      answer: `Raw metrics collected at 10-second resolution for 100,000 servers generate over 250 billion data points per month.
      <br/><br/>
      <strong class="text-indigo-400">The 3-Tier Downsampling Pipeline:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Tier 1: High-Resolution Hot Tier (0 to 7 Days):</strong> Store raw 10-second metrics on local NVMe SSDs for rapid active incident response and fine-grained debugging.</li>
        <li><strong>Tier 2: Medium-Resolution Warm Tier (7 to 30 Days):</strong> Background rollup workers downsample 10-second raw points into <strong>1-minute rollups</strong>, precomputing <code>min</code>, <code>max</code>, <code>avg</code>, <code>sum</code>, and <code>count</code>. Storage volume drops by $6\\times$.</li>
        <li><strong>Tier 3: Low-Resolution Cold Tier (30 Days to 2 Years):</strong> Downsample into <strong>1-hour rollups</strong> and archive onto cheap cloud object storage (AWS S3, Google Cloud Storage) queried via Thanos or Cortex. Storage volume drops by another $60\\times$.</li>
      </ol>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 73, 74: CHOOSING A DATABASE FOR A METRICS SERVICE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.11 Choosing a Database for a Metrics Collecting Service
            </h2>
          </div>
          <p class="text-slate-400 text-[13px] font-sans">
            Why telemetry data demands append-only time-series engines, Gorilla bitwise compression, and strict label cardinality limits.
          </p>
        </div>

        <!-- Everyday Mental Model Card -->
        <div class="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-400 text-[20px]">lightbulb</span>
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              EVERYDAY MENTAL MODEL: THE HOSPITAL PATIENT FILE VS. THE HEART MONITOR
            </span>
          </div>
          <p class="text-slate-300 text-[13px] leading-relaxed font-sans">
            Why can't you just use standard MySQL or PostgreSQL for telemetry metrics?
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-indigo-500/20 flex flex-col gap-1.5">
              <strong class="text-indigo-300 text-[12px] font-code">The Relational Database: Patient Medical Binder</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                A thick binder with address, insurance, prescriptions, and surgeon notes. Complex, indexed, and cross-referenced. You would never open this heavy binder 1,000 times a second just to write down a single heartbeat number!
              </p>
            </div>
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-emerald-500/20 flex flex-col gap-1.5">
              <strong class="text-emerald-300 text-[12px] font-code">The TSDB: Continuous EKG Strip</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                A continuous roll of paper spitting out timestamps and electrical pulses. There are no row edits or complex joins—just continuous, append-only numbers. Because heart rates change slowly, Gorilla compression records identical values in a single bit ('0')!
              </p>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Ingestion Pipeline Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              TIME-SERIES INGESTION PIPELINE & GORILLA COMPACT CHUNK ARCHITECTURE
            </span>
            <span class="text-slate-500 text-[10.5px]">High-Throughput Ingest Path</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ INGESTION & STORAGE WORKFLOW:                                                                    │
│                                                                                                  │
│   [ Host Fleet / Apps ] ──(Prometheus Pull / OTel Push)──► [ Ingestion Gateway ]                 │
│                                                                    │                             │
│                                           ┌────────────────────────┴────────────────────────┐    │
│                                           ▼                                                 ▼    │
│                                    [ Sequential WAL ]                             [ In-Memory Chunks ]│
│                                    (Crash recovery disk log)                       (Current 2h Block)│
│                                                                                             │    │
│                                                                                             ▼    │
│   [ Gorilla Compression Engine ] ◄──────────────────────────────────────────────────────────┘    │
│   • Timestamps: Delta-of-Delta ──► 1 bit per sample                                              │
│   • Floating Values: Bitwise XOR ──► ~1.37 bytes per sample                                      │
│                                                                                                  │
│                                           ▼ (Flushed to disk every 2 hours)                       │
│   [ Immutable 2-Hour Chunk Files ] ──► Contains: Raw compressed samples + Inverted Tag Index     │
│                                           │                                                      │
│                                           ▼ (After 7 Days: Automated Downsampling)               │
│   [ Rollup Worker ] ──► Downsamples 10s raw ──► 1m rollups (30d) ──► 1h rollups (2 years)       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: TSDB Comparison -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Detailed Comparison of Time-Series Database Engines
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">TSDB Engine</th>
                  <th class="p-3">Storage Model</th>
                  <th class="p-3">Query Language</th>
                  <th class="p-3">High-Cardinality Resilience</th>
                  <th class="p-3">Best For</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${tsdbEngines.map(t => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">${t.engine}</td>
                    <td class="p-3 text-slate-300">${t.storageModel}</td>
                    <td class="p-3 font-code text-indigo-300 text-[11px]">${t.queryModel}</td>
                    <td class="p-3 ${t.cardinalityResilience.includes('Fragile') ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${t.cardinalityResilience}</td>
                    <td class="p-3 text-slate-300 text-[12px]">${t.bestFor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-gradient-to-r from-[#064E3B]/40 to-[#022C22]/30 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">verified</span>
            SENIOR PERSPECTIVE: PUSH VS. PULL & MULTI-TIER RETENTION
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In system design interviews, articulate the <strong class="text-emerald-300">Push vs. Pull Collection Paradigm</strong>:
              Prometheus Pull is superior for steady-state container infrastructure because the central scraper performs active liveness monitoring (if an endpoint fails to respond, it is marked <code>DOWN</code> immediately). However, Push is mandatory for short-lived ephemeral serverless tasks (AWS Lambda) that finish execution in milliseconds.
            </p>
            <p>
              Always propose a <strong class="text-white">Multi-Tier Downsampling Strategy</strong>. Never store raw 10-second metrics indefinitely! Store raw metrics for <strong>7 days</strong> on local SSDs for active incident debugging; downsample to <strong>1-minute rollups</strong> for 30 days; and downsample to <strong>1-hour rollups</strong> archived to object storage (S3) for 2 years. This preserves trend visibility while cutting disk costs by 95%+.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - THE HIGH-CARDINALITY TRAP -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            THE HIGH-CARDINALITY TRAP: AVOIDING THE PROMETHEUS OOM CRASH
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              <strong class="text-white">Cardinality</strong> is the mathematical product of all unique values across your metric labels. In TSDBs, every unique combination of label keys and values forms a completely distinct time series with its own memory-resident inverted index chunk.
            </p>
            <p>
              The classic catastrophic mistake: attaching unbounded identifiers like <code>user_id</code>, <code>request_id</code>, <code>email</code>, or <code>ip_address</code> to a metric:
              <br/>
              <code class="text-rose-300">http_requests_total{service="api", user_id="u_9841824", request_id="req_9812"}</code> ❌
              <br/>
              With 10 million active users, you suddenly create <strong>10,000,000 separate time series</strong>! The inverted index consumes tens of gigabytes of RAM within minutes, causing immediate <strong>Out-of-Memory (OOM) crash loops</strong>.
            </p>
            <p>
              <strong class="text-amber-300">The Golden Rule:</strong> Keep metric labels strictly low-cardinality (<code>env</code>, <code>service</code>, <code>status_code</code>, <code>region</code>). High-cardinality IDs belong in <strong>Distributed Tracing (Jaeger / OpenTelemetry)</strong> or <strong>Log Aggregation (Loki / Elasticsearch)</strong>, NEVER in metrics.
            </p>
          </div>
        </div>

        <!-- Interview Follow-ups (Q1-Q4) -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Interview Follow-Up Questions (Technical Deep Dive)
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${interviewFollowUps.map(item => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 shrink-0">
                    ${item.qNum}
                  </span>
                  <h4 class="font-sans text-[13px] font-bold text-white leading-snug">
                    ${item.question}
                  </h4>
                </div>
                <div class="text-[12.5px] text-slate-300 font-sans leading-relaxed pt-1 border-t border-[#24314A]/60">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-5 flex flex-col gap-2 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[13.5px] font-sans font-medium text-white leading-relaxed">
            Metrics are write-heavy, append-only, time-ordered, and read in aggregate. Purpose-built TSDBs win through Gorilla bitwise compression and time-partitioned chunking. Always enforce strict label cardinality limits to prevent in-memory index explosion, combine Prometheus pull scraping with OpenTelemetry push gateways, and implement automated multi-tier downsampling rollups.
          </p>
        </div>

        <!-- Page 74 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 74</span>
        </div>

      </div>

    </div>
  `;
}
