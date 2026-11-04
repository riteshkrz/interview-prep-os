/**
 * 5.2 Cache Eviction Policies & Thundering Herd Defense - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 69 and 70
 * from The Modern System Design Interview Guide.
 */

export function renderCacheEvictionStampedeContent(topic) {
  const evictionPolicies = [
    {
      policy: "1. LRU (Least Recently Used)",
      mechanism: "Evicts the item that hasn't been accessed for the longest time.",
      timeComplexity: "$O(1)$ get & put (HashMap + Doubly Linked List)",
      scanResistance: "Poor (One-off bulk table scan evicts all hot data)",
      scanClass: "text-rose-400 font-bold",
      bestFor: "General-purpose caching, web page sessions, REST API payloads"
    },
    {
      policy: "2. LFU (Least Frequently Used)",
      mechanism: "Evicts the item with the lowest historical access counter.",
      timeComplexity: "$O(1)$ get & put (HashMap + Frequency Doubly Linked Lists)",
      scanResistance: "Excellent (One-off reads cannot evict frequently hit keys)",
      scanClass: "text-emerald-400 font-bold",
      bestFor: "Stable long-term popularity (CDN edge assets, top product catalogs)"
    },
    {
      policy: "3. FIFO (First In, First Out)",
      mechanism: "Evicts the oldest inserted item regardless of access frequency.",
      timeComplexity: "$O(1)$ get & put (Simple circular buffer / queue)",
      scanResistance: "Terrible (Evicts hot keys simply because they were added early)",
      scanClass: "text-rose-400 font-bold",
      bestFor: "Strict sequential pipelines, audit event buffers, low-memory IoT"
    },
    {
      policy: "4. ARC (Adaptive Replacement Cache)",
      mechanism: "Self-tuning hybrid dynamically balancing between recency (LRU) and frequency (LFU).",
      timeComplexity: "$O(1)$ get & put (Two tracking lists + ghost caches)",
      scanResistance: "State-of-the-Art (Self-adjusting against table scans)",
      scanClass: "text-emerald-400 font-bold",
      bestFor: "High-performance storage engines (ZFS file systems, modern database caches)"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How does Go's 'singleflight' pattern eliminate cache stampedes without distributed locking?",
      answer: `When a hot key (10,000 QPS) expires in Redis, a naive application sends 10,000 simultaneous queries to the database. Distributed locking (Redis Redlock) can serialize this, but adds network roundtrips and lock lease failure risks.
      <br/><br/>
      <strong class="text-indigo-400">The In-Process SingleFlight Solution:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>In Go (<code>golang.org/x/sync/singleflight</code>) or Java (<code>Guava CacheLoader</code>), the application manages an in-memory concurrent map of active in-flight requests keyed by resource ID.</li>
        <li><strong>Request 1 arrives:</strong> Sees no in-flight call for <code>product:101</code>. Creates a new channel/future, registers it in the map, and launches the slow DB query.</li>
        <li><strong>Requests 2..10,000 arrive concurrently:</strong> Check the map, see that an in-flight query for <code>product:101</code> is already active! They <em>do not touch the database or Redis</em>; they simply subscribe and block on Request 1's channel.</li>
        <li><strong>Request 1 finishes:</strong> Writes the result to Redis, broadcasts the result over the channel to all 9,999 waiting requests, and deletes the map entry.</li>
        <li><strong>Result:</strong> Exactly <strong>ONE</strong> database query executes across that entire application instance!</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is the XFetch probabilistic early expiration algorithm, and how does it prevent cache stampedes mathematically?",
      answer: `XFetch (Vattani et al., VLDB 2015) is an optimal probabilistic algorithm that refreshes cached items in the background <em>before</em> they expire, with probability proportional to their read traffic and compute cost.
      <br/><br/>
      <strong class="text-indigo-400">The Formula:</strong>
      $$\\text{Recompute if: } \\Delta \\times \\beta \\times \\ln(\\text{rand}()) &gt; \\text{expiry} - \\text{currentTime}$$
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>$\\Delta$: Computation time (duration in ms required to query DB and compute the value).</li>
        <li>$\\beta$: Tunable aggressiveness parameter ($\beta &gt; 0$, default $1.0$).</li>
        <li>$\\text{rand}()$: Uniform random floating-point value between $0$ and $1$.</li>
        <li>$\\text{expiry} - \\text{currentTime}$: Remaining time until the key's TTL expires.</li>
      </ul>
      <br/>
      <strong class="text-white">Why it Works:</strong>
      When a key is far from expiration, the probability of recomputation is 0%. As the key approaches expiration, the probability rises exponentially. Because of the random factor, <strong>exactly one client request</strong> probabilistically triggers an early background refresh right before expiration, resetting the TTL without any user ever experiencing a cache miss!`
    },
    {
      qNum: "Q3",
      question: "Why does standard LRU fail during large batch scans, and how does LFU or Redis LRU protect against this?",
      answer: `Standard LRU moves any accessed key immediately to the head of the doubly linked list.
      <br/><br/>
      <strong class="text-rose-400">The Cache Pollution Hazard:</strong>
      <br/>
      If a nightly analytics script or backup job executes a full table scan:
      <code>SELECT * FROM users WHERE status = 'INACTIVE';</code>
      and reads 5 million cold rows into memory, standard LRU treats those cold, single-read rows as 'most recently used'! It evicts your entire warm working set (active user sessions, hot items) out of RAM. The next morning, 100% of real user traffic suffers catastrophic cache misses.
      <br/><br/>
      <strong class="text-emerald-400">Protection Mechanisms:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>LFU (Least Frequently Used):</strong> A cold row read only once has a frequency counter of $1$. It cannot evict a hot user session that has a frequency counter of $10,000$.</li>
        <li><strong>2Q / SLRU (Segmented LRU):</strong> Incoming keys enter an unprobationary queue; only keys accessed a <em>second time</em> are promoted to the protected hot queue.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "What are the essential Redis 'maxmemory-policy' options in production?",
      answer: `When Redis reaches its memory limit (<code>maxmemory 16gb</code>), it relies on its eviction policy to free space:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><code>noeviction</code> (Default): Returns Out-of-Memory (OOM) errors on write commands (<code>SET</code>, <code>HSET</code>). Safe if Redis is used as a durable datastore; catastrophic if used as a cache.</li>
        <li><code>allkeys-lru</code>: Evicts the least recently used keys out of the entire keyspace. <strong>The gold standard production default for shared cache clusters.</strong></li>
        <li><code>volatile-lru</code>: Evicts the least recently used keys <em>only among keys that have an explicit TTL set</em>. Critical if your Redis cluster holds both permanent sessions and temporary cached responses.</li>
        <li><code>allkeys-lfu</code> / <code>volatile-lfu</code>: Evicts keys with the lowest logarithmic access counter (introduced in Redis 4.0). Optimal for long-tail access patterns with scan resistance.</li>
        <li><code>volatile-ttl</code>: Evicts keys with the shortest remaining time-to-live.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 69, 70: CACHE EVICTION POLICIES & THUNDERING HERD DEFENSE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              5.2 Cache Eviction Policies & Thundering Herd Defense
            </h2>
          </div>
          <p class="text-slate-400 text-[13px] font-sans">
            How to manage finite memory, choose scan-resistant eviction algorithms, and defend persistent databases from cache stampedes.
          </p>
        </div>

        <!-- Everyday Mental Model Card -->
        <div class="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-400 text-[20px]">lightbulb</span>
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              EVERYDAY MENTAL MODEL: THE RESTAURANT CHALKBOARD STAMPEDE
            </span>
          </div>
          <p class="text-slate-300 text-[13px] leading-relaxed font-sans">
            Imagine a restaurant with 10,000 customers in line and a chalkboard displaying the daily special:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-rose-500/20 flex flex-col gap-1.5">
              <strong class="text-rose-300 text-[12px] font-code">The Stampede (Thundering Herd)</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                At 12:00:00, the chalkboard expires and gets erased. All 10,000 hungry customers immediately sprint into the kitchen at the exact same second to shout <em>"What's on the menu?!"</em> The head chef collapses from panic, all stoves crash, and nobody gets fed!
              </p>
            </div>
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-emerald-500/20 flex flex-col gap-1.5">
              <strong class="text-emerald-300 text-[12px] font-code">SingleFlight: The Line Captain</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                When the chalkboard is erased, Customer #1 walks into the kitchen to ask the chef. Customers 2 through 10,000 wait quietly in line. Customer #1 walks back, writes <em>"Chicken Parmesan"</em> on the board, and everyone reads it at once. The chef answered exactly ONE question!
              </p>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Stampede Flow Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              THE THUNDERING HERD PHENOMENON & SINGLEFLIGHT MUTEX DEFENSE
            </span>
            <span class="text-slate-500 text-[10.5px]">Concurrency Collapse vs. Coalescing</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. THE THUNDERING HERD DISASTER (Naive Unprotected Expiration)                                  │
│                                                                                                  │
│   10,000 Concurrent Readers (10k QPS)                                                            │
│        │ │ │ │ │ │ │                                                                             │
│        ▼ ▼ ▼ ▼ ▼ ▼ ▼                                                                             │
│   [ Redis Cache ] ──► Key "product:101" TTL EXPIRED at 12:00:00.000!                             │
│        │ │ │ │ │ │ │                                                                             │
│        ▼ ▼ ▼ ▼ ▼ ▼ ▼ (All 10,000 requests experience Cache Miss at the exact same millisecond!)  │
│   [ PostgreSQL Database ] ◄── 10,000 Simultaneous Heavy SQL Queries!                             │
│                                🔥 CONNECTION POOL EXHAUSTED! DB CPU 100%! TIMEOUT 504 CASCADES!  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. THE SINGLEFLIGHT / MUTEX COALESCING DEFENSE                                                   │
│                                                                                                  │
│   10,000 Concurrent Readers                                                                      │
│        │ │ │ │ │ │ │                                                                             │
│        ▼ ▼ ▼ ▼ ▼ ▼ ▼                                                                             │
│   [ Application SingleFlight Group ]                                                             │
│        │                                                                                         │
│        ├─── Request 1 (Winner) ──Acquires In-Flight Lock──► Queries DB (1 Query Only!) ──┐       │
│        │                                                                                 │       │
│        └─── Requests 2..10,000 ──Subscribe to Request 1 Channel & Wait in Memory ◄───────┘       │
│                                                                                                  │
│   Request 1 receives DB result ──► Writes to Redis ──► Broadcasts result to all 9,999 waiters!    │
│   Result: Database handles exactly 1 query! System latency remains flat!                         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: Eviction Policies Comparison -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Comprehensive Comparison of Cache Eviction Policies
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Policy</th>
                  <th class="p-3">Eviction Criterion</th>
                  <th class="p-3">Time & Memory Complexity</th>
                  <th class="p-3">Table Scan Resistance</th>
                  <th class="p-3">Dominant Use Case</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${evictionPolicies.map(p => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">${p.policy}</td>
                    <td class="p-3 text-slate-300">${p.mechanism}</td>
                    <td class="p-3 text-slate-300 text-[12px]">${p.timeComplexity}</td>
                    <td class="p-3 ${p.scanClass} text-[12px]">${p.scanResistance}</td>
                    <td class="p-3 text-emerald-400 text-[12px]">${p.bestFor}</td>
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
            SENIOR PERSPECTIVE: REDIS APPROXIMATE LRU & MANDATORY TTL JITTER
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In production, describe how Redis implements LRU: Redis does <em>not</em> maintain a true doubly linked list. Maintaining pointers for 50 million keys would consume gigabytes of memory purely on pointer metadata! Instead, Redis uses <strong class="text-emerald-300">Approximate LRU</strong>: it samples <strong>5 random keys</strong> (configurable via <code>maxmemory-samples 5</code>) and evicts the oldest key among the sample. At $N=10$, its accuracy is mathematically indistinguishable from true LRU while saving 24 bytes per key.
            </p>
            <p>
              <strong class="text-white">Mandatory Production Rule: TTL Jitter.</strong> Never write cache keys with synchronized expiration timestamps! If a batch process writes 500,000 product records with <code>TTL = 3600</code>, you have scheduled a system outage for exactly 60 minutes later. Always add entropy:
              <code>TTL = base_ttl + rand(-0.1 * base_ttl, +0.1 * base_ttl)</code>.
              Jitter smooths expirations across time, preventing cluster-wide stampedes.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - CACHE AVALANCHE DISASTER -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            THE CACHE AVALANCHE: TOTAL CLUSTER OUTAGES & CIRCUIT BREAKERS
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              A <strong class="text-white">Cache Avalanche</strong> occurs when the entire Redis cluster becomes unavailable (network partition, master crash, OOM freeze). If your application fails closed and redirects 100% of read traffic to the primary database, the database will crash within seconds.
            </p>
            <p>
              <strong class="text-amber-300">Architectural Defense:</strong>
              Implement <strong class="text-white">Circuit Breakers</strong> (Envoy / resilience4j) with active rate-limiting. When the cache cluster fails health checks, the circuit breaker trips:
              1. Restrict database queries to a safe quota (e.g. max 2,000 QPS).
              2. Return degraded responses or default placeholders to remaining users (Fail-Degraded).
              3. Never allow a transient cache outage to destroy the persistent database of record!
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
            Configure Redis with <code>allkeys-lru</code> or <code>allkeys-lfu</code> for scan-resistant eviction. Defend against the Thundering Herd using in-process SingleFlight request coalescing and probabilistic early expiration (XFetch). Always inject TTL jitter to prevent simultaneous mass expirations, and safeguard persistent databases with circuit-breaking rate limiters.
          </p>
        </div>

        <!-- Page 70 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 70</span>
        </div>

      </div>

    </div>
  `;
}
