/**
 * 5.1 Caching Strategies: Cache-Aside, Write-Through, Write-Behind, Refresh-Ahead - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 67 and 68
 * from The Modern System Design Interview Guide.
 */

export function renderCacheStrategiesContent(topic) {
  const cachingPatterns = [
    {
      pattern: "1. Cache-Aside (Lazy Loading)",
      readLatency: "Low on hit; High on miss (3 roundtrips: Cache → DB → Cache)",
      writeLatency: "Normal (Writes DB, then deletes cache key)",
      dataLoss: "Zero (DB is immediate source of truth)",
      consistency: "Eventual (Staleness bounded by TTL / eviction)",
      bestFor: "General read-heavy web apps, user profiles, product listings"
    },
    {
      pattern: "2. Write-Through",
      readLatency: "Ultra-Low (Cache is always warmed with freshest data)",
      writeLatency: "High (Must wait for synchronous DB commit)",
      dataLoss: "Zero (Write only succeeds after DB confirms)",
      consistency: "Strong (Cache and DB always in lockstep)",
      bestFor: "Financial account balances, access tokens, strictly fresh state"
    },
    {
      pattern: "3. Write-Behind (Write-Back)",
      readLatency: "Ultra-Low (Data served from in-memory cache)",
      writeLatency: "Ultra-Low (<1ms, client returns on cache ACK)",
      dataLoss: "High Risk (Crash before DB flush loses data!)",
      consistency: "Temporary Inconsistency until batch worker flushes",
      bestFor: "High-volume write ingest, video view counters, game state tracking"
    },
    {
      pattern: "4. Refresh-Ahead",
      readLatency: "Deterministic Ultra-Low (Keys refreshed before expiration)",
      writeLatency: "Normal (Standard DB write flow)",
      dataLoss: "Zero (DB is durable source of truth)",
      consistency: "High (Minimizes cache miss windows)",
      bestFor: "High-traffic hot keys, breaking news articles, live sports feeds"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why should you DELETE a cache key on write instead of UPDATING it (Set)?",
      answer: `This is one of the classic senior concurrency questions in distributed caching.
      <br/><br/>
      <strong class="text-rose-400">The Updating Race Condition (Concurrent Dual Writes):</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Thread A updates the Database with value $X = 1$.</li>
        <li>Thread B updates the Database with value $X = 2$.</li>
        <li>Thread B reaches the cache first and updates Redis: <code>SET X = 2</code>.</li>
        <li>Thread A experiences a network hiccup, arrives late, and overwrites Redis: <code>SET X = 1</code>.</li>
      </ol>
      <strong>Disaster:</strong> The Database holds the correct value ($2$), but Redis is permanently stuck with stale value ($1$) until TTL expires!
      <br/><br/>
      <strong class="text-emerald-400">The Deletion Fix (Cache Invalidation):</strong>
      <br/>
      If both threads execute <code>DEL X</code> on DB write, the cache is simply emptied. The next incoming read query will read the authoritative latest value ($2$) from the database and populate the cache safely. Invalidation eliminates write-write race conditions.`,
    },
    {
      qNum: "Q2",
      question: "Can a race condition still happen during Cache-Aside between a concurrent Read and a Write?",
      answer: `Yes, there is a theoretical interleaving:
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Thread 1 (Reader) misses cache, reads old value $V_1$ from DB.</li>
        <li>Thread 2 (Writer) updates DB to $V_2$ and deletes cache key.</li>
        <li>Thread 1 finishes late and writes $V_1$ to cache.</li>
      </ol>
      <strong class="text-indigo-400">Why This is Rare in Practice:</strong>
      <br/>
      Database write operations take significantly longer (disk I/O, transaction locks, binlog commits: 10–50ms) than in-memory cache set operations (<1ms). For this race to occur, Thread 1's memory write to Redis must take <em>longer</em> than Thread 2's entire database transaction and network roundtrip.
      <br/><br/>
      <strong class="text-white">Senior Mitigation:</strong>
      Always configure reasonable TTLs (e.g. 5 minutes) as a backstop, or use <strong>Delayed Double Deletion</strong> (delete key $\to$ commit DB $\to$ sleep 500ms $\to$ delete key again).`,
    },
    {
      qNum: "Q3",
      question: "When is Write-Through strictly preferred over Cache-Aside?",
      answer: `Write-Through introduces an abstraction layer where the application writes solely to the Cache, and the Cache plugin/middleware writes to the Database synchronously.
      <br/><br/>
      <strong class="text-indigo-400">Optimal Use Cases:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Read-Immediately-After-Write Workloads:</strong> In systems where every write is guaranteed to be read within seconds, Cache-Aside forces every write to suffer a cache miss on the first subsequent read. Write-Through keeps the cache 100% pre-warmed.</li>
        <li><strong>Strict Data Freshness:</strong> Simplifies application code by guaranteeing the cache never holds stale values because updates are synchronous atomic units.</li>
        <li><strong>Write Penalty:</strong> Every write pays the roundtrip cost to both the cache and the database before acknowledging the client. Avoid Write-Through if write throughput dominates read traffic.</li>
      </ul>`,
    },
    {
      qNum: "Q4",
      question: "How does Refresh-Ahead predict and refresh hot keys without hammering the database?",
      answer: `Refresh-Ahead is designed to eliminate the latency penalty of cold cache misses for predictably accessed data (e.g., live sports scoreboards, stock ticker dashboards).
      <br/><br/>
      <strong class="text-indigo-400">Implementation Mechanics:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Access Frequency Tracking:</strong> The cache records the access timestamp of keys. If a key with a 60-second TTL is read frequently in the 50th to 59th second window, the cache engine detects high demand.</li>
        <li><strong>Asynchronous Background Pre-Fetch:</strong> An asynchronous worker thread reaches out to the database at the 55-second mark, fetches the latest record, and updates the cache value while resetting the TTL.</li>
        <li><strong>Zero Client Latency Penalty:</strong> Clients continuously hit warm in-memory cache data with 0ms latency, never experiencing a synchronous database miss.</li>
      </ul>`,
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 67, 68: CACHING STRATEGIES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              5.1 Caching Strategies: Cache-Aside, Write-Through, Write-Behind, Refresh-Ahead
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            In distributed architectures, RAM is approximately <strong class="text-cyan-400">100,000x faster than disk</strong>. Caching intercepts requests before they hit the database, shielding storage from connection exhaustion and slashing latency from tens of milliseconds to sub-millisecond territory. The critical architectural decision is <strong class="text-indigo-400">cache orchestration</strong>: who coordinates data synchronization between the cache and the persistent database?
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">1. Cache-Aside</span>
              <span class="text-[12px] text-slate-300">App queries cache; on miss reads DB & populates cache. App updates DB & deletes cache key. The industry default.</span>
            </div>
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">2. Write-Through</span>
              <span class="text-[12px] text-slate-300">App writes to cache; cache synchronously writes to DB before confirming. Cache is always 100% warm and fresh.</span>
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">3. Write-Behind</span>
              <span class="text-[12px] text-slate-300">App writes to cache; cache returns immediate ACK and flushes batches to DB asynchronously. Highest write speed.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">4. Refresh-Ahead</span>
              <span class="text-[12px] text-slate-300">Cache automatically predicts expiration and reloads hot keys in the background before TTL expires.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Sequence Flow Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              READ & WRITE SYNCHRONIZATION FLOWS ACROSS PATTERNS
            </span>
            <span class="text-slate-500 text-[10.5px]">Request Lifecycle</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. CACHE-ASIDE (Lazy Loading Read Miss & Write Invalidation)                                     │
│                                                                                                  │
│   READ:  Client ──(1) GET /user/42──► [ Application ] ──(2) Check Cache──► [ Redis Cache ] (MISS)│
│                                            │                                                     │
│                                            ├──(3) Query DB────────► [ PostgreSQL DB ]            │
│                                            ├──(4) SET user:42 (TTL)► [ Redis Cache ]             │
│                                            └──(5) Return Response──► Client                      │
│                                                                                                  │
│   WRITE: Client ──(1) PUT /user/42──► [ Application ] ──(2) UPDATE DB────► [ PostgreSQL DB ]     │
│                                            │                                                     │
│                                            └──(3) DEL user:42──────► [ Redis Cache ] (Invalidate)│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. WRITE-THROUGH VS. WRITE-BEHIND (Write-Back)                                                   │
│                                                                                                  │
│   WRITE-THROUGH:                                                                                 │
│   Client ──Write──► [ Cache ] ──Synchronous Write──► [ Database ]                                │
│   Client ◄──ACK─────┴── (Client waits for DB commit before ACK! Zero data loss risk!)            │
│                                                                                                  │
│   WRITE-BEHIND (Write-Back):                                                                     │
│   Client ──Write──► [ Cache ] ──(Immediate ACK!)──► Client (<1ms write response!)                │
│                           │                                                                      │
│                           └──Async Batch Worker──► [ Database ] (⚠️ Data loss risk on crash!)     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: Patterns Comparison -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Detailed Comparison of Caching Synchronization Patterns
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Caching Pattern</th>
                  <th class="p-3">Read Latency</th>
                  <th class="p-3">Write Latency</th>
                  <th class="p-3">Data Loss Risk</th>
                  <th class="p-3">Consistency</th>
                  <th class="p-3">Dominant Use Case</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${cachingPatterns.map(p => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">${p.pattern}</td>
                    <td class="p-3 text-slate-300">${p.readLatency}</td>
                    <td class="p-3 text-slate-300">${p.writeLatency}</td>
                    <td class="p-3 ${p.dataLoss.includes('High') ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${p.dataLoss}</td>
                    <td class="p-3 text-slate-300">${p.consistency}</td>
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
            SENIOR PERSPECTIVE: ALWAYS INVALIDATE (DEL), NEVER UPDATE (SET)
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              When mutating data in Cache-Aside, junior engineers frequently write:
              <code>db.update(user); cache.set(user.id, user);</code>.
              <strong class="text-white">This is a fatal concurrency antipattern.</strong> If two concurrent writes execute simultaneously (Thread A with <code>name='Alice'</code> and Thread B with <code>name='Bob'</code>), network delays can cause Thread A's cache set to arrive <em>after</em> Thread B's cache set. The database ends up with Bob, while the cache is permanently corrupted with Alice!
            </p>
            <p>
              <strong class="text-emerald-300">The Golden Rule:</strong> Always <strong>DELETE</strong> (<code>DEL key</code>) from the cache on database write. When you delete the key, the next read safely fetches the authoritative state from the database. Furthermore, avoid deleting <em>before</em> writing to the database; always commit the database transaction first, then invalidate the cache.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - WRITE-BEHIND DATA LOSS HAZARD -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            THE WRITE-BEHIND TRAP: DURABILITY RISK & IN-FLIGHT LOSS
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              <strong class="text-white">Write-Behind (Write-Back) trades away durability for speed.</strong> Because the client receives an HTTP 200/201 success ACK as soon as the data hits volatile RAM, any hardware crash, memory fault, or power cut before the background worker flushes to the database results in <strong>permanent, unrecoverable data loss</strong>.
            </p>
            <p>
              Never use Write-Behind for financial balances, user authentication credentials, or order checkout pipelines. Reserve Write-Behind strictly for high-throughput, loss-tolerant streams: YouTube video view counts, live clickstream analytics, or gaming leaderboard increments where losing 2 seconds of aggregate data does not compromise system integrity.
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
            Default to Cache-Aside for read-heavy applications, and always invalidate (delete) cache keys on write rather than updating to eliminate dual-write race condition hazards. Use Write-Through when immediate read freshness after write is non-negotiable, and restrict Write-Behind strictly to high-volume loss-tolerant write streams like view counts and telemetry.
          </p>
        </div>

        <!-- Page 68 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 68</span>
        </div>

      </div>

    </div>
  `;
}
