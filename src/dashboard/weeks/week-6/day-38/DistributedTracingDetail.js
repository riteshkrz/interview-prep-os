/**
 * Distributed Tracing and Context Propagation (Topic 12.1)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 150–152
 */

export function renderDistributedTracingContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="distributed-tracing">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 12.1 · Pages 150–152
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Distributed Observability
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">W3C Context Propagation · Tail-Based Sampling · N+1 Waterfall Analysis</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Distributed Tracing & Context Propagation</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Tracing answers the single question that metrics and logs cannot: <em>"Where in the microservice call graph did the time go?"</em> By propagating a causal context (<code class="text-cyan-300">traceparent</code>) across asynchronous threads, network hops, and queue boundaries, distributed tracing reveals latency bottlenecks that are invisible on service dashboards.
      </p>
    </div>

    <!-- The Waterfall Diagram from Page 150 -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The Real-World Trace Waterfall: Spotting the Hidden Bottleneck (Page 150)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
  Trace ID: 7f3a9e01b... Total Request Duration: 840 ms
  ├─ api-gateway               ████████████████████████████████████  840 ms
  │  ├─ auth-service           ██                                     45 ms
  │  └─ order-service          █████████████████████████████         680 ms
  │     └─ inventory-service   ████████████████████████              580 ms  ◄── BOTTLE NECK
  │        └─ 6 × SELECT stock ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓               6 × 95 ms
  │                            └─ Sequential N+1 query loop inside inventory service!

  CONCLUSION IN ONE GLANCE:
  • The root cause is NOT "the database is slow" or "the network has jitter".
  • It is a sequential N+1 query in a loop inside inventory-service.
  • No metrics dashboard would have revealed this: every service's individual p99 latency
    looked completely "acceptable" in isolation!
</pre>
      </div>
    </div>

    <!-- Sampling Strategies: Head vs Tail -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        Head-Based vs. Tail-Based Sampling (Page 151)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-2">HEAD-BASED SAMPLING (At Ingress)</div>
          <ul class="space-y-2 text-slate-300 font-sans list-disc list-inside">
            <li><strong>Decision:</strong> Made at the very first hop (API Gateway) before request execution.</li>
            <li><strong>Cost:</strong> Extremely cheap: unsampled requests generate and send zero spans.</li>
            <li><strong>The Flaw:</strong> At a standard 1% sample rate, rare 5xx errors or 4-second latency tail outliers are almost always dropped!</li>
            <li><strong>Best For:</strong> High-volume, homogeneous steady-state traffic where storage costs dominate.</li>
          </ul>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-2">TAIL-BASED SAMPLING (At Collector)</div>
          <ul class="space-y-2 text-slate-300 font-sans list-disc list-inside">
            <li><strong>Decision:</strong> Made after the request completes by an OpenTelemetry Collector.</li>
            <li><strong>Cost:</strong> Requires buffering all spans in memory across all nodes during in-flight requests.</li>
            <li><strong>The Benefit:</strong> Retains 100% of errors (HTTP 5xx) and 100% of SLO latency violations!</li>
            <li><strong>Best For:</strong> Complex enterprise distributed microservices where incident debugging takes priority.</li>
          </ul>
        </div>
      </div>

      <div class="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed font-sans">
        <strong class="font-bold text-amber-300 uppercase tracking-wider block mb-1">The Answer That Lands Well in Staff Interviews (Page 151):</strong>
        "I configure <strong>head-based sampling</strong> at a low base rate (e.g. 1%) for the steady-state traffic bulk, combined with <strong>tail-based sampling rules</strong> in the collector that unconditionally keep 100% of errors and any trace exceeding our p95 latency SLO. Furthermore, we support on-demand force-sampling by customer tenant ID or trace ID header during live customer debugging sessions."
      </div>
    </div>

    <!-- Context Propagation Mechanics & Failure Modes -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
        Context Propagation: Where Traces Break in Practice (Page 151)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="font-bold text-cyan-300 mb-1">1. Async Message Queues</div>
          <p class="text-slate-300 text-[11.5px] leading-relaxed">
            Context does not cross Kafka or SQS boundaries automatically. Engineers must manually serialize the W3C <code class="text-slate-100">traceparent</code> header into Kafka record headers, and reconstruct the span context in the consumer worker. Without this, the trace terminates at producer publish!
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="font-bold text-cyan-300 mb-1">2. Thread & Coroutine Hops</div>
          <p class="text-slate-300 text-[11.5px] leading-relaxed">
            Trace context lives in <code class="text-slate-100">ThreadLocal</code> or async-local execution storage. Handing work off to a background thread pool without wrapping the task detaches the context, creating detached orphan spans.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="font-bold text-cyan-300 mb-1">3. Multi-Host Clock Skew</div>
          <p class="text-slate-300 text-[11.5px] leading-relaxed">
            Host NTP clocks drift by 1–50 ms across datacenters. A child span on Server B can appear to start before its parent span on Server A! Tracing visualization tools must trust parent-child duration intervals rather than absolute wall-clock alignment.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 152)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Tracing answers where time was spent across service boundaries. Senior engineers demonstrate mastery by explaining how context propagates across queues via W3C headers, combining low head-based sampling with tail-based error retention, and linking trace IDs directly into log lines and client response headers."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
