/**
 * Appendix C.3: Problem-to-Pattern Index & Prompt Association Matrix
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Page 177
 */

export function renderAppendixPatternIndexContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="appendix-pattern-index">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Appendix C.3 · Page 177
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Instant Association Matrix
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Reflexive Recall · 12 Standard Prompt Triggers</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Appendix C.3: Problem-to-Pattern Index</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Senior engineers don't invent architectures from scratch during a 45-minute loop; they match requirement signals directly to proven distributed patterns. Drill these prompt phrases so your architectural response is reflexive, authoritative, and immediately backed by trade-offs.
      </p>
    </div>

    <!-- The 12 Reflexive Associations Table (Page 177) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        Prompt Phrase &rarr; Architecture Pattern Mapping (Page 177)
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold text-amber-300">Interviewer Prompt Phrase</th>
              <th class="p-3 font-semibold text-cyan-300">Architectural Pattern to Deploy</th>
              <th class="p-3 font-semibold text-slate-300">Primary Trade-off to Name Immediately</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">"Read-heavy, same data repeatedly"</td>
              <td class="p-3 text-cyan-200">Cache-Aside + TTL Jitter (5.1) + CDN Edge (2.5)</td>
              <td class="p-3 text-slate-400">Stale reads during update window; cache invalidation race conditions.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Write-heavy, append-only events"</td>
              <td class="p-3 text-cyan-200">LSM-Tree Storage Engine (4.9) + Kafka Buffer (7.2)</td>
              <td class="p-3 text-slate-400">High compaction I/O write amplification; slower random read latency.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Needs to be exactly once"</td>
              <td class="p-3 text-cyan-200">At-Least-Once Delivery + Idempotency Key Constraint (13.2)</td>
              <td class="p-3 text-slate-400">Database storage for key history; TTL determines safe retry window.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Spiky 100&times; traffic flash peak"</td>
              <td class="p-3 text-cyan-200">Queue Buffer + Admission Control + Atomic Redis DECR (9.6)</td>
              <td class="p-3 text-slate-400">High user rejection rate; must pre-scale instead of reactive autoscaling.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Must never lose customer funds"</td>
              <td class="p-3 text-cyan-200">Synchronous Quorum Replication (RPO=0) + Double-Entry Ledger (9.4)</td>
              <td class="p-3 text-slate-400">Higher write latency floor (slowest quorum replica ACK).</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Millions of concurrent live sockets"</td>
              <td class="p-3 text-cyan-200">Event Loop Gateway (epoll) + Pub/Sub Backplane (Redis/Kafka) (11.5)</td>
              <td class="p-3 text-slate-400">Stateful connection tier requires sticky load balancing & reconnection jitter.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Find points of interest near me"</td>
              <td class="p-3 text-cyan-200">Geohash / Uber H3 + 3&times;3 Neighbor Cells Query (9.1)</td>
              <td class="p-3 text-slate-400">Boundary cell blindness requires multi-cell query expansion & distance filters.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Does this key exist? at huge scale"</td>
              <td class="p-3 text-cyan-200">In-Memory Bloom Filter (5.5)</td>
              <td class="p-3 text-slate-400">Small false positive rate (1%); standard bloom filters do not support item deletes.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Multi-gigabyte file upload"</td>
              <td class="p-3 text-cyan-200">S3 Multipart Upload + Direct Presigned URLs (6.4)</td>
              <td class="p-3 text-slate-400">Uncompleted abandoned parts accrue storage billing without lifecycle abort rules.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Coordinate multi-service checkout"</td>
              <td class="p-3 text-cyan-200">Saga Pattern + Transactional Outbox (7.4) + Temporal (13.3)</td>
              <td class="p-3 text-slate-400">Loss of transaction isolation (dirty reads); requires explicit compensating steps.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Debug mysterious tail p99 latency"</td>
              <td class="p-3 text-cyan-200">Distributed Tracing + W3C Context Propagation (12.1)</td>
              <td class="p-3 text-slate-400">Context must be carried manually across message queues and thread pools.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">"Deliver events to customer servers"</td>
              <td class="p-3 text-cyan-200">Per-Tenant Webhook Queues + HMAC-SHA256 + Egress Proxy (13.5)</td>
              <td class="p-3 text-slate-400">SSRF attack vulnerability requires strict private IP and loopback DNS blocking.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 177)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "When the interviewer drops a requirements cue, immediately state the matching design pattern and its single biggest trade-off in the same breath. This demonstrates reflexive architectural experience rather than academic memorization."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
