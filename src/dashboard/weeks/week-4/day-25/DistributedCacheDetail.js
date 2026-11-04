/**
 * Question 4. Design a Distributed Cache
 * System Design Interview Guide · HLD · LLD · Capacity Estimation · Scalability · Failure Handling
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';
import {
  getDistributedCacheHldSection,
  getDistributedCacheDataModelSection,
  getDistributedCacheLldSection,
  getDistributedCacheAlgorithmsSection,
  getDistributedCacheScalabilitySection,
  getDistributedCacheFailureScenariosSection,
  getDistributedCacheSecurityObservabilitySection,
  getDistributedCacheFinalSummarySection
} from './DistributedCacheSections.js';

export function renderDistributedCacheDetail() {
  return renderMasterclassQuestion({
    questionNumber: 4,
    title: "Design a Distributed Cache",
    moduleName: "Module 1 — Core System Design",
    coreTopics: "HLD · LLD · Capacity Estimation · Scalability · Failure Handling",

    problemStatement: `
      <div class="flex flex-col gap-4">
        <p class="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">
          A distributed cache is an in-memory key-value storage system that runs across multiple servers. It helps applications retrieve frequently accessed data quickly, reduce database load, and handle high request volumes.<br/><br/>
          In this guide, we will design a distributed cache similar to <strong>Redis Cluster</strong> or <strong>Memcached</strong> and work through the problem as you would in a 45–60 minute system design interview.
        </p>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <h4 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">help_center</span>
            What problem are we solving?
          </h4>
          <p class="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
            Suppose an e-commerce application stores product details in a database. Every time a user opens a product page, the application queries the database.<br/>
            If a popular product receives <strong>10,000 requests per second</strong>, repeatedly querying the database for the same information wastes resources and increases latency.<br/>
            We can store frequently accessed product details in memory across multiple cache servers. Subsequent requests can retrieve the data from the cache instead of the database.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="p-3.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
              <strong class="text-rose-700 dark:text-rose-400 text-[12.5px] block mb-1">Without a Cache</strong>
              <p class="text-[12px] text-slate-600 dark:text-slate-300">
                Every read reaches the database, creating disk I/O contention, driving up connection counts, and escalating latency.
              </p>
            </div>
            <div class="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
              <strong class="text-emerald-700 dark:text-emerald-400 text-[12.5px] block mb-1">With a Distributed Cache</strong>
              <p class="text-[12px] text-slate-600 dark:text-slate-300">
                Most repeated reads are served directly from RAM in sub-milliseconds; database queries happen primarily on cold cache misses.
              </p>
            </div>
          </div>
        </div>

        <div class="p-3.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 text-[12.5px] text-purple-950 dark:text-purple-200 leading-relaxed">
          <strong>What must the system accomplish?</strong> Design a service that stores and retrieves key-value pairs across multiple machines, supports expiration and deletion, and continues operating when individual cache nodes fail.<br/>
          <em>Remember:</em> The cache is generally not the source of truth. The persistent database remains responsible for durable application data.
        </div>
      </div>
    `,

    clarifyingQuestions: [
      { q: "Is the cache primarily for reads, or will it handle frequent writes?", a: "Assume a read-heavy workload (e.g. 90% reads, 10% writes) typical of e-commerce catalogs and session reference data." },
      { q: "Is occasional stale data acceptable?", a: "Yes. Invalidation delays or replication lag mean eventual consistency is acceptable for product details; critical transactions query the database directly." },
      { q: "Do we need durable persistence on the cache tier?", a: "No. The persistent database is the system of record. Cache entries can be safely reconstructed on misses or node restarts." },
      { q: "What are the expected traffic and data sizes?", a: "35,000 peak operations/sec, 20 million cached entries, and an average serialized value size of 1 KB." },
      { q: "Should the cache support TTL and automatic failover?", a: "Yes. Items must expire automatically via TTL, memory pressure triggers LRU eviction, and replica promotion provides high availability." }
    ],

    functionalRequirements: [
      "GET — Retrieve a value using a unique string key.",
      "PUT — Create or update a key-value pair with optional TTL.",
      "DELETE — Explicitly remove a key from the cache.",
      "TTL (Time to Live) — Automatically expire entries after a specified duration.",
      "Eviction — Remove entries according to policy (e.g. LRU) when memory is insufficient."
    ],

    nonFunctionalRequirements: [
      "Low latency: Typically sub-millisecond to a few milliseconds for reads and writes.",
      "High availability: Continue serving requests without downtime when a node fails.",
      "Horizontal scalability: Add nodes seamlessly to scale out capacity and throughput.",
      "Fault tolerance: Replicate data to standby nodes to recover rapidly from hardware crashes.",
      "Defined consistency: Explicitly document eventual consistency and stale-read windows.",
      "Memory efficiency: Manage limited RAM effectively through active expiration and eviction."
    ],

    hideHighLevelArchitecture: true,
    hideStepByStepDesign: true,

    customSections: [
      {
        badge: "CAPACITY MATH",
        badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
        title: "Capacity Estimation & Back-of-the-Envelope Math",
        content: `
          <div class="flex flex-col gap-5 text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              Capacity estimation helps us determine how many cache nodes are needed, how much memory the fleet requires, and whether one server could bottleneck expected peak traffic.
            </p>

            <!-- Traffic Assumptions Table -->
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
              <table class="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                    <th class="py-3 px-4 w-1/2">Metric</th>
                    <th class="py-3 px-4 w-1/2">Assumption</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Daily active users (DAU)</td>
                    <td class="py-2 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">10 million</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Average cache operations per user per day</td>
                    <td class="py-2 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">100 operations</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Average serialized value size</td>
                    <td class="py-2 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">1 KB</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Peak-to-average traffic ratio</td>
                    <td class="py-2 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">3&times;</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Target cache hit rate</td>
                    <td class="py-2 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">90%</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Average stored entries</td>
                    <td class="py-2 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">20 million</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mathematical Breakdown Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <!-- Requests Per Second Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
                <div class="flex items-center gap-1.5 text-blue-400 font-bold text-[13px]">
                  <span class="material-symbols-outlined text-[18px]">speed</span>
                  Throughput (RPS)
                </div>
                <div class="text-[12px] text-slate-300 space-y-1">
                  <div><strong>Total daily operations:</strong><br/><code>10M &times; 100 = 1,000,000,000 ops</code></div>
                  <div><strong>Average RPS:</strong><br/><code>1B / 86,400 &approx; 11,574 &approx; 11,600 ops/s</code></div>
                  <div><strong>Peak RPS (3&times; multiplier):</strong><br/><code>11,574 &times; 3 &approx; 34,722 &approx; 35,000 ops/s</code></div>
                </div>
                <div class="p-2 rounded bg-blue-950/40 border border-blue-900/50 text-[11px] text-blue-300 font-mono mt-1">
                  &bull; Design for 35,000 peak ops/s
                </div>
              </div>

              <!-- Cache Storage Math Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
                <div class="flex items-center gap-1.5 text-purple-400 font-bold text-[13px]">
                  <span class="material-symbols-outlined text-[18px]">memory</span>
                  Cache Storage (RAM)
                </div>
                <div class="text-[12px] text-slate-300 space-y-1">
                  <div><strong>Raw Value Payload:</strong><br/><code>20M &times; 1 KB = 20 GB</code></div>
                  <div><strong>Metadata / Overhead (1.5&ndash;2&times;):</strong><br/><code>20 GB &times; (1.5 to 2.0) = 30 to 40 GB</code></div>
                  <div><strong>With 70% Max Target Utilization:</strong><br/><code>40 GB / 0.70 &approx; 43 to 57 GB RAM</code></div>
                </div>
                <div class="p-2 rounded bg-purple-950/40 border border-purple-900/50 text-[11px] text-purple-300 font-mono mt-1">
                  &bull; Primary RAM: 43&ndash;57 GB (+ equal replica RAM)
                </div>
              </div>

              <!-- Bandwidth Estimate Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
                <div class="flex items-center gap-1.5 text-emerald-400 font-bold text-[13px]">
                  <span class="material-symbols-outlined text-[18px]">network_check</span>
                  Network Bandwidth
                </div>
                <div class="text-[12px] text-slate-300 space-y-1">
                  <div><strong>Peak Response Bandwidth:</strong><br/><code>35,000 ops/s &times; 1 KB = 35 MB/s</code></div>
                  <div><strong>In Megabits per second:</strong><br/><code>35 MB/s &times; 8 = 280 Mbps</code></div>
                  <div><strong>Combined Request + Response:</strong><br/><code>&approx; 70 MB/s (560 Mbps)</code></div>
                </div>
                <div class="p-2 rounded bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300 font-mono mt-1">
                  &bull; Peak throughput: 280 Mbps payload
                </div>
              </div>

            </div>

            <!-- Architectural Influence -->
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <strong class="text-slate-900 dark:text-white text-[13.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-amber-500 text-[18px]">lightbulb</span>
                How These Estimates Influence Architecture
              </strong>
              <ul class="text-[12.5px] text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                <li>A single server could become a bottleneck in memory or network throughput, mandating horizontal sharding.</li>
                <li>Partitioning data across multiple nodes allows linear horizontal scaling.</li>
                <li>Replicas require matching memory and consume network bandwidth for replication streams.</li>
                <li>Headroom is necessary for traffic spikes, failover rebalancing, and uneven key hash distribution.</li>
                <li><strong>Database Impact:</strong> At 35,000 peak ops/sec with 30,000 reads, a 90% hit rate generates <strong>3,000 cache misses per second</strong> directly hitting the persistent database. The database must be sized and indexed to absorb that miss load!</li>
              </ul>
            </div>
          </div>
        `
      },
      getDistributedCacheHldSection()
    ],

    apiDesign: `// GET — Retrieve a value
GET /cache/{key}

Example:
GET /cache/product:101

Successful Response:
{
  "key": "product:101",
  "value": {
    "name": "Laptop",
    "price": 65000
  }
}

Status Codes:
- 200 OK — Key found and entry returned
- 404 Not Found — Key missing or expired (normal cache miss)
- 503 Service Unavailable — Cache cluster node unreachable

// PUT — Store or update a value
PUT /cache/{key}
Content-Type: application/json

{
  "value": {
    "name": "Laptop",
    "price": 65000
  },
  "ttlSeconds": 3600
}

Successful Response:
{
  "key": "product:101",
  "stored": true,
  "ttlSeconds": 3600
}

Status Codes:
- 200 OK — Existing value updated
- 201 Created — New entry successfully created
- 400 Bad Request — Invalid key, oversized payload, or invalid TTL
- 503 Service Unavailable — Operation could not be completed

// DELETE — Remove a value
DELETE /cache/{key}

Successful Response:
{
  "key": "product:101",
  "deleted": true
}

Status Codes:
- 204 No Content — Deletion completed
- 404 Not Found — Key did not exist (optional)
- 503 Service Unavailable — Deletion could not be completed

// API Design Considerations:
- Validate key length (<= 250 bytes) and payload size (<= 1 MB).
- Define TTL limits and default expiration behavior for omitted TTLs.
- Avoid logging sensitive cached values in plaintext.
- Use aggressive client timeouts (sub-50ms) and bounded retries.
- Distinguish a cache miss (404) from an infrastructure failure (503).`,

    dataModel: getDistributedCacheDataModelSection(),

    whyComponents: [
      { component: "Application services", why: "Request and populate cached data" },
      { component: "Cache client/router", why: "Hash keys and route requests" },
      { component: "Cluster topology", why: "Track node and partition assignments" },
      { component: "Primary cache nodes", why: "Serve reads and accept writes" },
      { component: "Replica nodes", why: "Maintain copies and support recovery" },
      { component: "Cluster manager", why: "Detect failures and coordinate failover" },
      { component: "Persistent database", why: "Store durable application data" }
    ],

    postComponentSections: [
      getDistributedCacheLldSection(),
      getDistributedCacheAlgorithmsSection(),
      getDistributedCacheScalabilitySection(),
      getDistributedCacheFailureScenariosSection(),
      getDistributedCacheSecurityObservabilitySection()
    ],

    tradeoffType: "table",
    tradeoffs: [
      {
        choice: "Redis Cluster vs. Memcached",
        upside: "Redis Cluster offers rich data structures, built-in master-replica replication, and automated cluster failover.",
        downside: "Memcached is a pure multi-threaded key-value store with simpler operational footprint, but requires client-side replication and has no native disk snapshots."
      },
      {
        choice: "Client-side vs. Proxy-based routing",
        upside: "Client-side routing eliminates intermediate network hops and extra server costs; proxy-based routing centralizes connection pools and simplifies client logic.",
        downside: "Client-side routing couples clients to cluster topology updates; proxies introduce an extra network hop and a separate tier to scale and protect."
      },
      {
        choice: "Synchronous vs. Asynchronous replication",
        upside: "Synchronous replication provides strong write durability; asynchronous replication keeps write latencies minimal (sub-millisecond) without blocking on followers.",
        downside: "Synchronous replication severely hurts write throughput and availability; asynchronous replication can lose un-replicated writes during sudden primary crashes."
      },
      {
        choice: "Cache-aside vs. Write-through / Write-behind",
        upside: "Cache-aside keeps the database as sole source of truth and only caches data that is actually read; write-through guarantees cache freshness on write.",
        downside: "Cache-aside incurs cache-miss penalties and requires invalidation logic; write-through adds write latency, and write-behind risks data loss on cache crashes."
      },
      {
        choice: "LRU vs. LFU eviction",
        upside: "LRU (Least Recently Used) is optimal when recent access predicts future demand; LFU (Least Frequently Used) protects persistently popular records.",
        downside: "LRU can evict valuable items during one-off batch scans; LFU requires frequency counters and can retain historically hot items that are no longer accessed."
      },
      {
        choice: "Strong vs. Eventual consistency",
        upside: "Eventual consistency maximizes read availability and speed, suiting catalog data where brief staleness is acceptable.",
        downside: "Strong consistency prevents stale reads but requires distributed locks, 2PC, or consensus protocols that drastically increase latency."
      }
    ],

    followUps: [
      {
        q: "How does consistent hashing work?",
        a: "It maps keys and nodes onto a logical $2^{32}-1$ hash ring. Each key is assigned to the first node encountered moving clockwise. Adding or removing a node moves only $1/N$ of keys on average, avoiding full-cluster rehashing. Virtual nodes (e.g. 150 tokens per physical node) distribute load evenly across servers."
      },
      {
        q: "What happens when a cache node fails?",
        a: "Heartbeat checks by the cluster manager detect the failure within seconds. The cluster manager promotes the standby replica to primary, increments the cluster epoch to prevent split-brain dual-primary writes, and broadcasts the updated partition map to all client routing rings."
      },
      {
        q: "How do you prevent a cache stampede?",
        a: "Use <strong>request coalescing</strong> (singleflight) so that concurrent requests for the same missing key share a single database query. Apply <strong>TTL jitter</strong> ($\pm 10\%$) so keys populated at the same time do not expire simultaneously, and use distributed locks or stale-while-revalidate for critical hot keys."
      },
      {
        q: "How do you handle hot keys?",
        a: "Layer an in-process L1 cache (e.g. Guava or Caffeine) in the application tier to absorb reads without hitting network sockets, replicate hot keys across multiple shards with randomized read suffixes (<code>key#1</code>, <code>key#2</code>), or coalesce parallel fetches."
      },
      {
        q: "How do you maintain consistency between the database and cache?",
        a: "Under the cache-aside pattern, always commit updates to the database first, then invalidate the cache key. Use retries, dead-letter queues, or Change Data Capture (CDC tailing DB binlogs with Debezium) to guarantee eventual invalidation even if network glitches occur during the write path."
      },
      {
        q: "Why not use the database directly?",
        a: "Databases are designed for durable, ACID-compliant storage on disk, incurring disk I/O, lock contention, and query parsing overhead. Repeatedly querying 10,000 requests/sec for the same unchanged product row wastes expensive database CPU and leads to high latency."
      },
      {
        q: "How would you handle one million requests per second?",
        a: "Benchmark realistic hardware limits (e.g. 100k ops/sec per Redis process on modern 10GbE network interfaces), shard horizontally into 10–15 primary-replica partitions, distribute read traffic across replicas where eventual consistency permits, and front the fleet with in-process L1 caching."
      },
      {
        q: "What happens if the entire cache cluster becomes unavailable?",
        a: "Do not allow the entire application read traffic to cascade onto the database. The cache client must trip a <strong>circuit breaker</strong>, shed non-critical requests, bound database fallback connection pools, serve stale data where permitted, and stage a controlled cache warm-up before re-enabling traffic."
      },
      {
        q: "How do you calculate the cache hit rate?",
        a: "<code>Hit Rate = [ Hits / (Hits + Misses) ] &times; 100%</code>. Track hit rate alongside p99 latency and database query fallback rate. A sudden drop in hit rate indicates mass expiration, cache stampedes, or working-set growth exceeding memory limits."
      },
      {
        q: "How do you choose TTL?",
        a: "Base TTL on data freshness tolerance, update frequency, and the cost of a cache miss. Volatile items (e.g. flash sale inventory) require short TTLs (seconds) or event-driven invalidation; static product descriptions can safely use long TTLs (hours or days)."
      },
      {
        q: "How do you scale the cache when new nodes are added?",
        a: "Add the new node's virtual tokens to the consistent hash ring, determine the subset of hash slots it inherits from adjacent nodes, migrate those key-value pairs in the background with rate-limited bandwidth, and atomic-switch ownership once synchronization completes."
      },
      {
        q: "What is the difference between a cache and a database?",
        a: "A cache prioritizes ultra-fast, in-memory access to reconstructible data and accepts automatic expiration or eviction under memory pressure. A database guarantees ACID durability, referential integrity, and persistence as the immutable system of record."
      }
    ],

    postSections: [
      getDistributedCacheFinalSummarySection()
    ]
  });
}
