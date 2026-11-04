/**
 * 4.6 Database Sharding Strategies - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 59 and 60
 * from The Modern System Design Interview Guide.
 */

export function renderDatabaseShardingContent(topic) {
  const shardingStrategies = [
    {
      scheme: "1. Range-Based Sharding",
      routing: "Simple ($O(1)$ range lookup table)",
      rangeQueries: "Native & Fast (Contiguous disk scans)",
      rebalancing: "Complex (Requires splitting busy ranges)",
      hotspotRisk: "High (New sequential IDs or dates crush the latest shard)",
      hotspotClass: "text-rose-400 font-bold",
      bestFor: "Time-series data, historical archive tables, regional geographic datasets"
    },
    {
      scheme: "2. Hash-Based Sharding",
      routing: "Direct math: hash(key) % N or consistent hashing",
      rangeQueries: "Terrible (Scatter-gather across all N shards)",
      rebalancing: "Heavy (Unless combined with consistent hashing / virtual shards)",
      hotspotRisk: "Low (Even pseudo-random distribution across servers)",
      hotspotClass: "text-emerald-400 font-bold",
      bestFor: "High-volume transactional OLTP, user accounts, e-commerce orders"
    },
    {
      scheme: "3. Directory / Lookup Sharding",
      routing: "Indirected ($O(1)$ fast cache hit to lookup service)",
      rangeQueries: "Depends on lookup configuration",
      rebalancing: "Trivial (Simply update the key-to-shard mapping row)",
      hotspotRisk: "Lookup Service becomes the single point of failure & bottleneck",
      hotspotClass: "text-amber-400 font-bold",
      bestFor: "Multi-tenant SaaS with custom tier placement, enterprise VIP isolation"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you handle queries and joins that do NOT include the Shard Key?",
      answer: `Once a database is sharded, relational <code>JOIN</code> operations across separate physical machines are impossible at the database engine level.
      <br/><br/>
      <strong class="text-indigo-400">Three Production Solutions:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Co-Location by Entity Group (The Best Way):</strong> Shard child tables by the parent shard key. If both <code>orders</code> and <code>order_items</code> share <code>user_id</code> and are sharded by <code>user_id</code>, all related rows live on the exact same physical shard. Full SQL joins remain fast, local, and ACID-compliant!</li>
        <li><strong>Scatter-Gather Routing Proxy:</strong> For non-shard-key queries (e.g. <code>WHERE email = 'alice@acme.com'</code>), the routing proxy (Vitess/Citus) broadcasts the query to all $N$ shards in parallel, collects partial answers, and merges them in memory. <em>Warning: Latency is tied to the slowest responding shard!</em></li>
        <li><strong>Global Secondary Index / CDC:</strong> Maintain a secondary lookup table mapping <code>email &rarr; user_id</code> in Redis, or stream changes via Debezium to Elasticsearch for fast cross-dimension lookups.</li>
      </ol>`
    },
    {
      qNum: "Q2",
      question: "What is the 'Celebrity Problem' (Hotspot Shard), and how do you resolve it?",
      answer: `The Celebrity Problem occurs when a single key receives an order of magnitude more traffic than all others. For example, if Twitter shards tweets by <code>user_id</code>, an account with 100 million followers will melt its assigned shard during breaking news while other shards sit idle.
      <br/><br/>
      <strong class="text-indigo-400">Production Countermeasures:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Key Salting (Compound Sharding):</strong> For viral accounts, append a random suffix: <code>user_id + '_' + rand(1..10)</code>. This scatters the celebrity's writes across 10 distinct shards. Read queries must query all 10 shards and merge results.</li>
        <li><strong>Read-Through Caching & Edge CDNs:</strong> Put celebrity profiles and feeds entirely in Redis/Memcached and edge CDNs so read traffic never touches database shards.</li>
        <li><strong>Dedicated VIP Shard Tier:</strong> Move enterprise VIP tenants or hyper-active entities onto dedicated, isolated hardware instances.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How do you execute live resharding of a production database with zero downtime?",
      answer: `Resharding a live database without downtime is one of the ultimate tests of senior systems engineering:
      <br/><br/>
      <strong class="text-indigo-400">The 4-Phase Online Migration Protocol:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Provision & Dual-Write:</strong> Spin up the new shard cluster. Update application routing to write all new mutations to <em>both</em> old shards and new shards (dual-writing with asynchronous background retries).</li>
        <li><strong>Historical Backfill:</strong> Run offline batch jobs to copy historical records from old shards to new shards. Writes use idempotent <code>ON CONFLICT DO NOTHING</code> so newer dual-writes take precedence.</li>
        <li><strong>Shadow Verification:</strong> Route a percentage of live read queries to both old and new shards, comparing results in the background to verify 100.00% data parity and consistency.</li>
        <li><strong>Atomic Cutover:</strong> Flip the routing configuration so the new shards become primary. Stop writing to the old cluster, archive, and decommission.</li>
      </ol>`
    },
    {
      qNum: "Q4",
      question: "When is Database Sharding an antipattern? What should you exhaust first?",
      answer: `Sharding introduces monumental permanent complexity: cross-shard transactions require 2PC, global unique IDs require snowflake generators, and schema migrations become distributed sagas.
      <br/><br/>
      <strong class="text-indigo-400">Exhaust These 4 Levers Before Sharding:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>SQL Index Optimization:</strong> 90% of database bottlenecks are missing composite indexes or pathological full-table scans. Adding the right B-tree index can reduce query cost by $10,000\times$.</li>
        <li><strong>Read Replicas:</strong> Offload 90%+ of read volume to read replicas before touching your write path.</li>
        <li><strong>Application Caching:</strong> Cache frequently accessed objects in Redis to prevent database hits altogether.</li>
        <li><strong>Vertical Hardware Scaling:</strong> Modern cloud instances support 128+ vCPUs, 4TB of RAM, and 64,000 IOPS SSDs. Buying a larger instance is 100x cheaper than paying an engineering team to maintain custom sharding logic.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 59, 60: DATABASE SHARDING STRATEGIES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.6 Database Sharding Strategies
            </h2>
          </div>
          <p class="text-slate-400 text-[13px] font-sans">
            How to partition massive datasets across independent database instances when vertical hardware limits are exhausted.
          </p>
        </div>

        <!-- Everyday Mental Model Card -->
        <div class="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-400 text-[20px]">lightbulb</span>
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              EVERYDAY MENTAL MODEL: THE CITY LIBRARY SYSTEM
            </span>
          </div>
          <p class="text-slate-300 text-[13px] leading-relaxed font-sans">
            Imagine a city library whose collection of books has grown too large to fit in a single building:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-indigo-500/20 flex flex-col gap-1.5">
              <strong class="text-indigo-300 text-[12px] font-code">Partitioning by Author Name (Targeted Query)</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                The city splits books across 3 branch libraries: Branch 1 gets Authors A–H, Branch 2 gets I–P, Branch 3 gets Q–Z. If you know the author is Stephen King, you go straight to Branch 3. Fast, targeted, zero wasted effort!
              </p>
            </div>
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-amber-500/20 flex flex-col gap-1.5">
              <strong class="text-amber-300 text-[12px] font-code">Searching by Book Title (Scatter-Gather)</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                If you only know the book title is <em>"The Shining"</em> but don't know the author, you have no idea which branch has it. You must send 3 couriers to search all 3 branches in parallel (scatter-gather) and wait for the slowest courier to return!
              </p>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Query Routing Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              SHARDED DATABASE ROUTING TOPOLOGY & SCATTER-GATHER FLOW
            </span>
            <span class="text-slate-500 text-[10.5px]">Targeted Hit vs. Scatter-Gather</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. TARGETED QUERY (Includes Shard Key: user_id = 42)                                             │
│                                                                                                  │
│   Client ──► [ Query Router / Sharding Proxy ]                                                   │
│                     │  (Vitess / Citus / Envoy)                                                  │
│                     │                                                                            │
│                     ├─── Evaluates hash(42) % 3 ──► Target Shard: 1                              │
│                     │                                                                            │
│                     ▼                                                                            │
│               [ SHARD 0 ]                 [ SHARD 1 ]                 [ SHARD 2 ]                │
│               (Users 0..N)               (Users N..2N)               (Users 2N..3N)              │
│               [ Standby ]                 [ DIRECT HIT! ]             [ Standby ]                │
│                                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. NON-SHARD-KEY QUERY (Scatter-Gather: WHERE email = 'alice@acme.com')                          │
│                                                                                                  │
│   Client ──► [ Query Router ]                                                                    │
│                     │                                                                            │
│                     ├─── (1) Broadcasts Query in Parallel to ALL Shards ────────────┐            │
│                     │                                                                │            │
│                     ├──► [ SHARD 0 ] ──► (No match) ─────────────────────────────────┤            │
│                     ├──► [ SHARD 1 ] ──► (MATCH: Alice found!) ──────────────────────┼──► Merges  │
│                     └──► [ SHARD 2 ] ──► (No match) ─────────────────────────────────┘    Results │
│                                                                                                  │
│   High Latency Penalty: Scatter-gather latency is tied to the slowest responding shard!          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: Sharding Schemes Comparison -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Detailed Comparison of Database Sharding Schemes
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Sharding Scheme</th>
                  <th class="p-3">Routing Logic</th>
                  <th class="p-3">Range Scans</th>
                  <th class="p-3">Rebalancing Cost</th>
                  <th class="p-3">Hotspot Risk</th>
                  <th class="p-3">Dominant Use Case</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${shardingStrategies.map(s => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">${s.scheme}</td>
                    <td class="p-3 text-slate-300">${s.routing}</td>
                    <td class="p-3 text-slate-300">${s.rangeQueries}</td>
                    <td class="p-3 text-slate-300">${s.rebalancing}</td>
                    <td class="p-3 ${s.hotspotClass}">${s.hotspotRisk}</td>
                    <td class="p-3 text-emerald-400 text-[12px]">${s.bestFor}</td>
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
            SENIOR PERSPECTIVE: SHARD KEY CRITERIA & VIRTUAL SHARDING
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              Your <strong class="text-emerald-300">Shard Key</strong> is the single most important choice in your database design because changing it post-launch requires an expensive full-system rewrite. A robust shard key satisfies 4 rules:
              <strong>1. High Cardinality</strong> (millions of values),
              <strong>2. Uniform Distribution</strong> (prevents skew),
              <strong>3. Matches 80%+ of Read/Write Queries</strong> (e.g. <code>tenant_id</code> for B2B SaaS or <code>user_id</code> for consumer apps), and
              <strong>4. Immutability</strong> (shard keys can never be updated; moving a row across machines requires delete + insert).
            </p>
            <p>
              Always recommend the <strong class="text-white">Virtual Shards Pattern</strong> (used by Instagram and Pinterest). Never map keys directly to physical server IPs. Instead, create <strong>1,024 logical database schemas</strong> distributed across 8 physical servers (128 logical databases per box). When traffic grows, move 64 logical schemas to a newly purchased server via metadata configuration without rewriting code or re-partitioning tables!
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - THE SHARDING TAX -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            THE SHARDING TAX: ARCHITECTURAL SACRIFICES
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              Candidates frequently pitch sharding too early without understanding the heavy permanent taxes:
            </p>
            <ul class="list-disc list-inside space-y-1 text-slate-300 text-[12px]">
              <li><strong class="text-white">Cross-Shard Joins are Dead:</strong> You cannot execute SQL joins across shards without dragging entire tables over the network.</li>
              <li><strong class="text-white">Distributed Transactions (2PC):</strong> Multi-shard transactions require complex Two-Phase Commit or Saga patterns, increasing write latency significantly.</li>
              <li><strong class="text-white">No Auto-Increment IDs:</strong> Standard database sequences will generate duplicates across shards. You must adopt Twitter Snowflake distributed ID generators or UUIDv7.</li>
              <li><strong class="text-white">Schema Migrations:</strong> DDL migrations must execute safely across dozens of independent database clusters without locking tables.</li>
            </ul>
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
            Shard only when hardware write IOPS and disk limits force you to, and choose a shard key driven strictly by the dominant 80% query path. Always articulate the permanent operational taxes: loss of cross-shard joins, distributed 2PC overhead, and global ID generation. Propose the Virtual Sharding pattern to prove senior operational depth.
          </p>
        </div>

        <!-- Page 60 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 60</span>
        </div>

      </div>

    </div>
  `;
}
