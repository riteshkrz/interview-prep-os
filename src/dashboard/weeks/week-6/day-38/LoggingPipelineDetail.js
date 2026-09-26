/**
 * Logging Pipeline Design & Cost Control (Topic 12.2)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 152–154
 */

export function renderLoggingPipelineContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="logging-pipeline">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 12.2 · Pages 152–154
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Storage & Cost Governance
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">2.16 TB/day Raw Sizing · Kafka Ingestion Buffer · Tiered Parquet Cold Storage</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Logging Pipeline Design & Cost Control</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Logging is frequently the single largest infrastructure line item in an engineering organization's cloud bill. A poorly engineered logging pipeline will exhaust disk, throttle request threads, or collapse during the exact outages it was built to diagnose. High-scale pipelines require async non-blocking app logging, streaming buffers, and aggressive indexing governance.
      </p>
    </div>

    <!-- Sizing Math Drill (Page 152) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        Log Volume Arithmetic: Do This Before Choosing a Tool (Page 152)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 space-y-2">
        <div class="text-white font-bold">// Baseline: Moderately Busy Production Service (10,000 RPS)</div>
        <div class="text-slate-300">
          10,000 RPS × 5 lines/request × 500 Bytes = <span class="text-emerald-400 font-bold">25 MB/second</span><br/>
          = 25 MB/s × 86,400 s ≈ <span class="text-emerald-400 font-bold">2.16 TB/day raw text</span> (~790 TB/year raw)
        </div>
        <div class="text-white font-bold pt-2">// Search Index Overhead (OpenSearch/Elasticsearch with doc values & term vectors: 1.5× multiplier)</div>
        <div class="text-slate-300">
          30-day hot retention: 2.16 TB/day × 30 days × 1.5 index overhead = <span class="text-amber-400 font-bold">~97 TB hot SSD storage</span>
        </div>
        <div class="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 mt-2">
          <strong>The "Global Debug" Trap:</strong> Turning DEBUG on globally during an incident raises 5 lines → 50 lines/req = <strong>250 MB/s (10× traffic)</strong>, instantly taking down the logging pipeline mid-incident! DEBUG must be dynamic and scoped strictly to a specific request ID or tenant ID.
        </div>
      </div>
    </div>

    <!-- Pipeline Architecture Diagram -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        The Pipeline & Its Decoupled Buffers (Page 152)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
<pre>
  Application Pod
   │ (In-memory bounded async queue)
   ▼
  Local Agent (Vector / FluentBit) ──► BROKER (Kafka Buffer)
  (Spills to local disk on backpressure)      │
                                              ▼
                                       LOG PROCESSOR (Flink / Logstash)
                                       (Parse JSON, scrub PII, route)
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
            [HOT TIER: 7 Days]                                  [COLD TIER: Years]
          OpenSearch / Elastic Cluster                         S3 Data Lake (Parquet/zstd)
          Full-text searchable & indexed                       Cost-effective on-demand queries
          Aggressive field indexing caps                       (DuckDB / AWS Athena)

  CRITICAL RULE:
  The application thread NEVER blocks on logging! If the in-memory queue fills up,
  drop the oldest log lines immediately and increment a 'dropped_logs_total' metrics counter.
</pre>
      </div>
    </div>

    <!-- Cost Levers Table (Page 153) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Cost Levers: Cheapest & Highest Impact First (Page 153)
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Cost Lever</th>
              <th class="p-3 font-semibold text-emerald-400">Typical Saving</th>
              <th class="p-3 font-semibold text-slate-300">Engineering Trade-off & Rationale</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">Index Fewer Fields</td>
              <td class="p-3 text-emerald-300 font-bold font-mono">Large (40–60%)</td>
              <td class="p-3 text-slate-300">Store the full JSON document, but index ONLY the 5–10 fields developers actually filter on (<code class="text-cyan-300">service</code>, <code class="text-cyan-300">level</code>, <code class="text-cyan-300">trace_id</code>, <code class="text-cyan-300">tenant_id</code>).</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Tiered Retention</td>
              <td class="p-3 text-emerald-300 font-bold font-mono">Large (50%)</td>
              <td class="p-3 text-slate-300">95% of operational debugging queries touch logs from the last 72 hours. Keep hot SSD indexes at 7 days, then flush to cheap object storage.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Sample Healthy 200s</td>
              <td class="p-3 text-emerald-300 font-bold font-mono">Large (30–50%)</td>
              <td class="p-3 text-slate-300">Retain 100% of errors (4xx/5xx) and SLO violations; sample high-frequency 200 OK access logs down to 5%.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Structured JSON Format</td>
              <td class="p-3 text-cyan-300 font-bold font-mono">CPU Indirect</td>
              <td class="p-3 text-slate-300">Eliminates heavy regex parsing at ingestion agents, reducing cluster CPU burn by over 70%.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Drop Redundant Narration</td>
              <td class="p-3 text-cyan-300 font-bold font-mono">Medium</td>
              <td class="p-3 text-slate-300">Delete "entering method X" log statements; distributed tracing spans cover call waterfalls far more effectively.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Rules That Make Logs Worth Their Cost -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        The 4 Golden Engineering Rules for High-Signal Logging
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800">
          <strong class="text-cyan-300 block mb-1">1. Log Decisions, Not Narration</strong>
          <p class="text-slate-300 leading-relaxed">
            <span class="text-emerald-300">✓ Good:</span> <code>"Chose fallback pricing engine because primary timed out at 200ms"</code> (worth keeping forever).<br/>
            <span class="text-rose-300">✗ Bad:</span> <code>"Entering calculatePrice()"</code> (pure spam).
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800">
          <strong class="text-cyan-300 block mb-1">2. Always Carry Trace ID & Tenant ID</strong>
          <p class="text-slate-300 leading-relaxed">
            Without a correlation ID, isolating one user's failure across 300 distributed microservices is mathematically impossible. Inject <code class="text-slate-100">trace_id</code> into the logging MDC context on every inbound request.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800">
          <strong class="text-cyan-300 block mb-1">3. Scrub PII at the Ingress Edge</strong>
          <p class="text-slate-300 leading-relaxed">
            Mask credit cards, passwords, and tokens at the application logging wrapper or local daemon. Once PII hits OpenSearch indexes, read-replicas, and S3 cold archives, scrubbing it requires an expensive compliance project.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800">
          <strong class="text-cyan-300 block mb-1">4. Never Block the Application Thread</strong>
          <p class="text-slate-300 leading-relaxed">
            Always log asynchronously through an in-memory ring buffer. If downstream logging nodes experience an outage, drop oldest lines cleanly rather than allowing backpressure to seize user request handlers.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 154)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Design the logging pipeline as an asynchronous, non-blocking producer buffered by Kafka. Control multi-terabyte search costs by indexing only filtered fields, tiering hot SSD retention to 7 days, sampling healthy 200 OK traffic, and enforcing structured JSON with mandatory trace IDs."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
