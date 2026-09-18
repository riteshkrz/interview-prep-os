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
      rangeQueries: "Native & High Performance",
      rebalancing: "Complex (Requires splitting heavy ranges)",
      hotspotRisk: "High (Sequential IDs/dates burn the newest shard)",
      hotspotClass: "text-rose-400 font-bold",
      bestFor: "Time-series data, archival datasets, localized geographical ranges"
    },
    {
      scheme: "2. Hash-Based Sharding",
      routing: "Direct mathematical ($O(1)$ hash mod $N$)",
      rangeQueries: "Catastrophic (Scatter-gather across all shards)",
      rebalancing: "Massive (Adding node rehashes $N/(N+1)$ keys)",
      hotspotRisk: "Low (Evenly pseudo-random distribution)",
      hotspotClass: "text-emerald-400 font-bold",
      bestFor: "High-volume transactional OLTP, user accounts, e-commerce orders"
    },
    {
      scheme: "3. Directory / Lookup Sharding",
      routing: "Indirected ($O(1)$ cache hit to lookup service)",
      rangeQueries: "Depends on lookup configuration",
      rebalancing: "Trivial (Update key-to-shard mapping row)",
      hotspotRisk: "Lookup Service becomes the SPOF & Bottleneck",
      hotspotClass: "text-amber-400 font-bold",
      bestFor: "Multi-tenant SaaS with custom tier placement, unpredictable growth"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you execute cross-shard aggregations and joins when data is partitioned across multiple nodes?",
      answer: `Once a relational database is sharded, relational <code>JOIN</code> operations across shards are physically impossible at the database engine level.
      <br/><br/>
      <strong class="text-indigo-400">Three Production Solutions:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Co-Location by Shard Key:</strong> Shard related entities on the exact same key. If <code>orders</code> and <code>order_items</code> both contain <code>user_id</code> and are sharded by <code>user_id</code>, all related rows live on the identical physical shard $\to$ full SQL joins remain fast and local!</li>
        <li><strong>Scatter-Gather Middleware:</strong> For queries missing the shard key (e.g. <code>SELECT COUNT(*) FROM users WHERE status='ACTIVE'</code>), the routing proxy (Vitess/Citus) broadcasts the query to all $N$ shards in parallel, receives $N$ partial results, and aggregates them in memory before returning.</li>
        <li><strong>ETL / Change Data Capture to OLAP:</strong> Never run analytical cross-shard queries on production OLTP shards. Stream shard WALs via Debezium/Kafka into a centralized data warehouse (ClickHouse, Snowflake) for ad-hoc aggregation.</li>
      </ol>`
    },
    {
      qNum: "Q2",
      question: "What is the 'Celebrity Problem' in sharded systems, and how do you resolve it?",
      answer: `The Celebrity Problem (Hotspot Shard) occurs when a single partition key receives an order-of-magnitude higher traffic than all other keys. For example, Justin Bieber has 100 million followers on Twitter; if tweets are sharded by <code>user_id</code>, Bieber's shard will melt under write and read load while other shards sit idle.
      <br/><br/>
      <strong class="text-indigo-400">Resolution Strategies:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Key Salting (Compound Sharding):</strong> Detect high-traffic accounts and append a pseudo-random suffix: <code>user_id + '_' + random(1..10)</code>. This scatters Bieber's writes across 10 distinct shards. Reads must query all 10 shards and merge in memory.</li>
        <li><strong>Read-Through Caching & CDN:</strong> Put celebrity profiles and feeds entirely in Redis/Memcached and edge CDNs so read traffic never touches database shards.</li>
        <li><strong>Dedicated Shard Tier:</strong> Move enterprise VIP tenants or hyper-active entities onto dedicated, isolated hardware instances.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How do you execute a live resharding of a production database with zero downtime?",
      answer: `Resharding a live database with zero downtime is one of the most dangerous operational procedures in infrastructure engineering.
      <br/><br/>
      <strong class="text-indigo-400">The 4-Phase Online Resharding Protocol:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Provision & Dual-Write:</strong> Spin up the new shard cluster. Update application routing layer to write all new mutations to <em>both</em> the old shards and the new shards (dual-writing with asynchronous retry queues).</li>
        <li><strong>Historical Backfill:</strong> Run background workers to copy historical records from old shards to new shards. Writes are idempotent (using <code>ON CONFLICT DO UPDATE</code> or version checks).</li>
        <li><strong>Shadow Read Verification:</strong> Route a percentage of read queries to both old and new shards, comparing results in the background to verify 100.00% data parity and consistency.</li>
        <li><strong>Atomic Cutover:</strong> Flip the routing configuration so the new shards become primary. Stop dual-writing to the old cluster, archive, and decommission.</li>
      </ol>`
    },
    {
      qNum: "Q4",
      question: "When is Database Sharding an anti-pattern? What should you exhaust first?",
      answer: `Sharding introduces monumental permanent complexity: cross-shard transactions require 2PC, global unique IDs require snowflake generators, and schema migrations become distributed sagas.
      <br/><br/>
      <strong class="text-indigo-400">Exhaust These Levers Before Sharding:</strong>
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
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            When a single database server hits its physical limits for write throughput, memory, or disk I/O, vertical scaling is exhausted. <strong class="text-indigo-400">Database Sharding (Horizontal Partitioning)</strong> splits a monolithic dataset across multiple independent database instances (shards), each responsible for a distinct slice of data.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">1. Range-Based</span>
              <span class="text-[12px] text-slate-300">Partitions rows based on key intervals (e.g. ID 1–1M $\to$ Shard 1). Excellent for range scans, but creates extreme hot spots on newest intervals.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. Hash-Based</span>
              <span class="text-[12px] text-slate-300">Applies a hash function: <code>hash(key) % N</code>. Guarantees uniform distribution, but destroys range query performance and complicates node additions.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">3. Directory-Based</span>
              <span class="text-[12px] text-slate-300">Maintains a centralized lookup service mapping entity IDs to specific physical database endpoints. Maximum flexibility at the cost of lookup hops.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Query Routing Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              SHARDED DATABASE ROUTING TOPOLOGY & SCATTER-GATHER FLOW
            </span>
            <span class="text-slate-500 text-[10.5px]">Proxy-Based Architecture</span>
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
            SENIOR PERSPECTIVE: SHARD KEY SELECTION & VIRTUAL SHARDS
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              Your <strong class="text-emerald-300">Shard Key</strong> is the single most critical architectural choice in your database lifecycle because it is virtually impossible to change post-launch without a full system rewrite. A proper shard key requires:
              <strong>1. High Cardinality</strong> (millions of distinct values),
              <strong>2. Uniform Distribution</strong> (preventing skew),
              <strong>3. Alignment with 80%+ of Query Access</strong> (e.g. <code>tenant_id</code> for B2B SaaS or <code>user_id</code> for consumer apps), and
              <strong>4. Immutability</strong> (you can never update a shard key without physically deleting and inserting rows across machines).
            </p>
            <p>
              Always adopt the <strong class="text-white">Virtual Shards Pattern</strong> (used by Instagram and Pinterest). Do not map keys directly to physical servers. Instead, create <strong>1,024 logical database schemas</strong> distributed across 8 physical servers (128 logical shards per box). When traffic scales, reassign 64 logical schemas to a new physical server via metadata changes without modifying application code or repartitioning tables!
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - THE PERMANENT TAX OF SHARDING -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            THE PERMANENT TAX OF SHARDING: DISTRIBUTED ACID & OPERATIONAL OVERHEAD
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              Engineers often underestimate the severe architectural concessions required when sharding:
            </p>
            <ul class="list-disc list-inside space-y-1 text-slate-300">
              <li><strong class="text-white">Cross-Shard Joins are Dead:</strong> You cannot join tables across shards without dragging entire tables across the network or using scatter-gather application joins.</li>
              <li><strong class="text-white">Distributed Transactions (2PC):</strong> Multi-shard transactions require Two-Phase Commit (2PC) or asynchronous Saga patterns, introducing latency penalties and blocking lock hazards.</li>
              <li><strong class="text-white">Global Uniqueness:</strong> Auto-incrementing database IDs fail across shards. You must adopt Twitter Snowflake 64-bit distributed ID generators or UUIDv7.</li>
              <li><strong class="text-white">Schema Migrations:</strong> DDL migrations must now execute across dozens of independent database clusters without locking tables or drifting schemas.</li>
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
            Shard only when hardware limits force you to, and let your shard key be driven strictly by the dominant 80% query path. Always articulate the permanent operational taxes up front: loss of cross-shard joins, distributed 2PC overhead, and global secondary index sprawl. Propose the Virtual Sharding pattern to prove senior operational foresight.
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
