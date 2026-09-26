/**
 * Week 4 Revision Day 4: Ingress, Caching & Search Timed Mocks
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 175–177
 */

export function renderWeek4RevisionContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="week-4-revision">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Revision Day 4 · Week 4 Mastery
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Timed Whiteboard Simulations
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">45-Minute Pacing Rule · Applied Specs Consolidation</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Revision Day 4: Ingress, Caching & Search Whiteboard Mocks</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Week 4 marks the pivot from isolated distributed components into end-to-end applied architectures. This session drills the 45-minute whiteboard pacing rule across the six core foundation blueprints: TinyURL, Rate Limiting, CDN Origin Shields, Redis Caching, Web Crawlers, and Search Autocomplete.
      </p>
    </div>

    <!-- The 45-Minute Pacing Rule Diagram -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The 45-Minute Interview Whiteboard Pacing Template
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-cyan-500/30">
          <div class="text-cyan-300 font-bold mb-1">00:00 – 08:00 (8 Mins)</div>
          <strong class="text-white block mb-1">Scope & Estimation</strong>
          <p class="text-slate-400 text-[11px] font-sans">
            Clarify 3 core functional features. Establish non-functional targets: DAU, QPS write/read ratio, p99 latency, durability, and storage growth over 5 years.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-purple-500/30">
          <div class="text-purple-300 font-bold mb-1">08:00 – 15:00 (7 Mins)</div>
          <strong class="text-white block mb-1">API & Data Schema</strong>
          <p class="text-slate-400 text-[11px] font-sans">
            Write REST / gRPC contract. Define primary keys and database entities. Justify SQL vs NoSQL vs wide-column choices based on query patterns.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-emerald-500/30">
          <div class="text-emerald-300 font-bold mb-1">15:00 – 30:00 (15 Mins)</div>
          <strong class="text-white block mb-1">High-Level Topology</strong>
          <p class="text-slate-400 text-[11px] font-sans">
            Draw client, CDN, load balancer, stateless API layer, cache tier, messaging buffer, and primary database replicas. Walk the happy write and read paths.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-amber-500/30">
          <div class="text-amber-300 font-bold mb-1">30:00 – 45:00 (15 Mins)</div>
          <strong class="text-white block mb-1">Bottlenecks & Scale</strong>
          <p class="text-slate-400 text-[11px] font-sans">
            Lead the deep dive into failure modes: hot keys, cache stampedes, database failover split-brain, network partitions, and disaster recovery.
          </p>
        </div>
      </div>
    </div>

    <!-- 6 Whiteboard Blueprints Rapid Drills -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        The 6 Core Blueprints: 60-Second Flash Checklist
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-1.5">
          <strong class="text-cyan-300 block font-bold font-sans">1. TinyURL (Spec 1)</strong>
          <p class="text-slate-300 text-[11.5px] font-sans">
            • 64-bit ID encoded in Base62 (7 chars)<br/>
            • Key Generation Service (KGS) pre-allocates ID batches to web servers in RAM<br/>
            • Defend HTTP 301 (browser caches permanently, origin sees zero analytics) vs 302 (all traffic hits service for click tracking).
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-1.5">
          <strong class="text-cyan-300 block font-bold font-sans">2. API Rate Limiter (Spec 18)</strong>
          <p class="text-slate-300 text-[11.5px] font-sans">
            • Redis Token Bucket executed via atomic Lua script (zero read-then-write race conditions)<br/>
            • Return HTTP 429 Too Many Requests with <code class="text-slate-100">Retry-After</code> header<br/>
            • Deployed as an Envoy sidecar / API gateway filter.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-1.5">
          <strong class="text-cyan-300 block font-bold font-sans">3. Search Autocomplete (Spec 16)</strong>
          <p class="text-slate-300 text-[11.5px] font-sans">
            • Serialized Trie in RAM: each node stores top-5 historical query completions<br/>
            • 10M prefix nodes &times; 100 bytes &approx; 1 GB RAM (fits in memory!)<br/>
            • Query logs streamed to Kafka &rarr; Spark batch job rebuilds Trie weekly.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-1.5">
          <strong class="text-cyan-300 block font-bold font-sans">4. Distributed Cache Cluster (Spec 3)</strong>
          <p class="text-slate-300 text-[11.5px] font-sans">
            • Consistent Hashing ring with virtual nodes (256 vnodes per physical node)<br/>
            • Cache-aside with random TTL jitter (+10%) to defeat cache avalanche<br/>
            • Single-flight mutex request coalescing to defeat hot-key stampedes.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Under interview pressure, structure is your safety net. Keep strictly to the 45-minute pacing rule, drive architecture from estimated QPS and data volume, and never let the interviewer prompt you for bottlenecks: proactively identify your single points of failure before they ask."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
