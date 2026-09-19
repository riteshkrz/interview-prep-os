/**
 * 5.3 Redis vs. Memcached: An Architectural Showdown - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 71 and 72
 * from The Modern System Design Interview Guide.
 */

export function renderRedisVsMemcachedContent(topic) {
  const comparisonMatrix = [
    {
      dimension: "Concurrency Model",
      redis: "Single-threaded event loop (epoll / kqueue) + I/O threads (v6+)",
      redisClass: "text-cyan-300",
      memcached: "Multi-threaded (pthread per core) with fine-grained slab locking",
      memcachedClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Data Structures",
      redis: "Rich: Strings, Hashes, Lists, Sets, Sorted Sets (ZSet), Bitmaps, HyperLogLog, Streams",
      redisClass: "text-emerald-400 font-bold",
      memcached: "Simple: Opaque String or Raw Byte Blobs only",
      memcachedClass: "text-slate-400"
    },
    {
      dimension: "Memory Allocator",
      redis: "Dynamic jemalloc (Flexible, but susceptible to memory fragmentation)",
      redisClass: "text-slate-300",
      memcached: "Slab Allocator (1MB pages divided into fixed chunks; prevents OS fragmentation)",
      memcachedClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Persistence Options",
      redis: "Dual: RDB point-in-time snapshots + AOF append-only log (fsync everysec)",
      redisClass: "text-emerald-400 font-bold",
      memcached: "None: Purely volatile in-memory cache (Data lost on restart)",
      memcachedClass: "text-rose-400 font-bold"
    },
    {
      dimension: "Replication & Clustering",
      redis: "Built-in Master-Replica replication, Sentinel failover, Redis Cluster (16,384 slots)",
      redisClass: "text-emerald-400 font-bold",
      memcached: "No native clustering; relies on client-side consistent hashing (Ketama/Twemproxy)",
      memcachedClass: "text-slate-400"
    },
    {
      dimension: "Maximum Key / Value Size",
      redis: "Key: 512 MB | Value: 512 MB",
      redisClass: "text-slate-300",
      memcached: "Key: 250 bytes | Value: 1 MB (Hard limit by 1MB slab page)",
      memcachedClass: "text-amber-400 font-bold"
    },
    {
      dimension: "Extensibility",
      redis: "Atomic Lua scripting, Redis Modules (RediSearch, RedisJSON, RedisGraph)",
      redisClass: "text-emerald-400 font-bold",
      memcached: "None (Basic Get, Set, Add, Replace, CAS, Delete commands)",
      memcachedClass: "text-slate-400"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why is Redis's single-threaded execution an advantage rather than a performance bottleneck?",
      answer: `In traditional multi-threaded servers, increasing thread count eventually hits diminishing returns due to <strong>lock contention, thread synchronization, and CPU context switching overhead</strong>.
      <br/><br/>
      <strong class="text-indigo-400">The Redis Architectural Insight:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>RAM Speed Eliminates Wait States:</strong> In-memory data operations (reading a hash, updating a string) execute in <em>nanoseconds</em>. Because there are zero blocking disk seeks, a single thread can execute 100,000+ operations per second uninterrupted.</li>
        <li><strong>Lock-Free Data Structures:</strong> Because only one command executes at any given millisecond, complex operations on Sorted Sets, Lists, and Hashes are <strong>100% atomic</strong> without needing mutexes, read-write locks, or semaphores.</li>
        <li><strong>Bottleneck Reality:</strong> Redis is almost never CPU-bound—it is bound by <strong>network bandwidth</strong> and <strong>memory bus speed</strong>. Redis 6.0 introduced multi-threaded I/O purely for network socket read/write system calls, while keeping command execution strictly single-threaded.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How does Memcached's Slab Allocator prevent OS-level memory fragmentation, and what is Slab Calcification?",
      answer: `Dynamic memory allocation (<code>malloc</code>/<code>free</code>) in long-running caches causes memory fragmentation: after millions of random allocations and deletions, free memory exists only in tiny disjoint slivers, causing allocation failures even when free RAM appears available.
      <br/><br/>
      <strong class="text-emerald-400">The Slab Allocation Solution:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Memcached pre-allocates memory from the OS into large <strong>1MB Slab Pages</strong>.</li>
        <li>Each slab page is divided into equal-sized <strong>Chunks</strong> based on a geometric growth factor (e.g., Slab Class 1 = 64-byte chunks, Slab Class 2 = 128-byte chunks, Slab Class 3 = 256-byte chunks).</li>
        <li>When a 100-byte value arrives, Memcached stores it in Slab Class 2 (128 bytes). Memory is never returned to the OS, completely eliminating external fragmentation!</li>
      </ul>
      <br/>
      <strong class="text-rose-400">The Flaw: Slab Calcification:</strong>
      <br/>
      If your application initially caches 60-byte keys (filling up Slab Class 1) and later shifts to 500-byte keys, Memcached cannot easily reassign existing 64-byte slab pages to larger chunk classes without restarting or running complex slab reassignment routines.`,
    },
    {
      qNum: "Q3",
      question: "How do you implement a safe, fault-tolerant distributed lock in Redis?",
      answer: `Implementing a distributed lock in Redis requires strict atomicity across acquisition, expiration, and release.
      <br/><br/>
      <strong class="text-indigo-400">1. Safe Acquisition (Single Atomic Command):</strong>
      <pre class="bg-[#050811] p-2 rounded text-[11px] text-cyan-300 border border-slate-800 mt-1">
SET lock:order_42 "random_token_abc123" NX PX 30000</pre>
      <ul class="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
        <li><code>NX</code>: Only set if the key does NOT already exist (mutual exclusion).</li>
        <li><code>PX 30000</code>: Expire automatically after 30,000ms (prevents deadlocks if worker crashes).</li>
        <li><code>random_token</code>: A unique cryptographically random UUID per client thread.</li>
      </ul>
      <br/>
      <strong class="text-indigo-400">2. Safe Release (Atomic Lua Script):</strong>
      <br/>
      A client must <em>never</em> simply run <code>DEL lock:order_42</code>! If Client A's lock expires while processing a slow query, Client B acquires the lock. If Client A finishes and runs <code>DEL</code>, it will accidentally delete Client B's lock!
      <br/>
      Always release using an atomic Lua script verifying ownership:
      <pre class="bg-[#050811] p-2 rounded text-[11px] text-cyan-300 border border-slate-800 mt-1">
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end</pre>`
    },
    {
      qNum: "Q4",
      question: "Redis RDB Snapshots vs. AOF (Append-Only File): Which should you choose for production durability?",
      answer: `Redis offers two distinct persistence mechanisms with contrasting trade-offs:
      <br/><br/>
      <strong class="text-indigo-400">1. RDB (Redis Database Snapshotting):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Forks a child process using Linux copy-on-write (COW) to dump a compact binary snapshot to disk every $N$ minutes (e.g., <code>save 900 1</code>).</li>
        <li><strong>Pros:</strong> Ultra-fast server restarts; minimal disk space footprint; zero impact on primary parent thread throughput.</li>
        <li><strong>Cons:</strong> High data loss window ($RPO$). If Redis crashes 9 minutes after a snapshot, 9 minutes of writes are permanently lost! Forking on large instances (32GB+) can cause brief latency spikes.</li>
      </ul>
      <br/>
      <strong class="text-indigo-400">2. AOF (Append-Only File):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Appends every mutating write command to a disk log. Usually configured with <code>appendfsync everysec</code> (flushes OS page cache to disk once per second).</li>
        <li><strong>Pros:</strong> Minimal data loss window (at most 1 second of writes lost on crash; $RPO \\le 1\\text{s}$).</li>
        <li><strong>Cons:</strong> Larger disk file sizes; slower server restarts (must replay every command); background rewrite (<code>BGREWRITEAOF</code>) required to compact log.</li>
      </ul>
      <br/>
      <strong class="text-emerald-400">Senior Recommendation:</strong> Use <strong>Hybrid Persistence (RDB + AOF)</strong>, the default in modern Redis. RDB provides fast disaster recovery backups, while AOF captures the trailing delta.`,
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 71, 72: REDIS VS. MEMCACHED - AN ARCHITECTURAL SHOWDOWN -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              5.3 Redis vs. Memcached: An Architectural Showdown
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Both <strong class="text-cyan-400">Redis</strong> and <strong class="text-emerald-400">Memcached</strong> are premier in-memory key-value engines capable of sub-millisecond read/write latencies. However, their internal engineering philosophies are radically opposed: Redis is an expressive, single-threaded, persistent <strong class="text-indigo-400">Data Structure Server</strong>, whereas Memcached is a multi-threaded, volatile, highly optimized <strong class="text-white">Raw Memory Slab Cache</strong>.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">1. Redis: Expressive Data Structure Server</span>
              <span class="text-[12px] text-slate-300">Single-threaded event loop eliminates lock overhead. Rich data types (ZSets, Hashes, Streams), atomic Lua scripts, RDB/AOF persistence, and native clustering.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">2. Memcached: Multi-Threaded Slab Cache</span>
              <span class="text-[12px] text-slate-300">Multi-threaded architecture scales linearly across CPU cores. Slab memory allocator prevents OS memory fragmentation. Purely volatile string/blob store.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Concurrency Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              INTERNAL CONCURRENCY ARCHITECTURE: EVENT LOOP VS. MULTI-THREADED SLABS
            </span>
            <span class="text-slate-500 text-[10.5px]">Execution Topologies</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. REDIS: SINGLE-THREADED NON-BLOCKING EVENT LOOP (epoll / kqueue)                               │
│                                                                                                  │
│   Client Connections (10,000 sockets)                                                            │
│        │ │ │ │ │ │ │                                                                             │
│        ▼ ▼ ▼ ▼ ▼ ▼ ▼                                                                             │
│   [ I/O Multiplexer (epoll) ] ──► [ Event Queue ] ──► [ SINGLE MAIN THREAD ]                     │
│                                                               │  (Zero locks! Zero mutexes!)     │
│                                                               ├──► Strings / Hashes / Sets       │
│                                                               ├──► Sorted Sets (ZSkipList)       │
│                                                               └──► Atomic Lua Script Exec        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. MEMCACHED: MULTI-THREADED WORKER THREAD POOL + SLAB ALLOCATOR                                 │
│                                                                                                  │
│   Client Requests ──► [ Dispatcher Thread ]                                                      │
│                               │ (Distributes sockets via round-robin)                            │
│                               ├──► [ Worker Thread 1 ] ──► [ Slab Class 1 (64B chunks) ]         │
│                               ├──► [ Worker Thread 2 ] ──► [ Slab Class 2 (128B chunks) ]        │
│                               └──► [ Worker Thread 3 ] ──► [ Slab Class 3 (256B chunks) ]        │
│                                       (Scales across 32+ CPU cores, but requires slab mutexes!)   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: Comparison Matrix -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Architectural Comparison Matrix: Redis vs. Memcached
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Architectural Dimension</th>
                  <th class="p-3">Redis</th>
                  <th class="p-3">Memcached</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${comparisonMatrix.map(c => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-white whitespace-nowrap">${c.dimension}</td>
                    <td class="p-3 ${c.redisClass}">${c.redis}</td>
                    <td class="p-3 ${c.memcachedClass}">${c.memcached}</td>
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
            SENIOR PERSPECTIVE: DEFAULT TO REDIS; MEMCACHED FOR PURE BLOB SCALE
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In system design interviews, <strong class="text-emerald-300">default to Redis for 95% of use cases</strong>. Even if you only need key-value caching today, you will inevitably need distributed locking (Redlock), sliding-window rate limiters (Sorted Sets), pub/sub message brokering, or persistent disaster recovery tomorrow. Redis handles all of these natively without adding new infrastructure components.
            </p>
            <p>
              Only recommend <strong class="text-white">Memcached</strong> when your workload is strictly pure key-value caching of static strings/HTML snippets, and you are running on massive multi-socket, multi-core instances (e.g. 64 vCPUs, 256GB RAM) where Memcached's multi-threaded scaling and memory-slab allocation can saturate hardware that would require running dozens of isolated Redis cluster shards.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - SLAB CALCIFICATION -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            MEMORY PITFALL: MEMCACHED SLAB CALCIFICATION VS. REDIS JEMALLOC
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              Memcached's slab allocator solves operating system memory fragmentation, but creates <strong class="text-white">Slab Calcification</strong>. If an application begins by writing small 80-byte items, Memcached allocates all available 1MB slab pages to Class 1 (96-byte chunks).
            </p>
            <p>
              If a product update subsequently increases average payload size to 400 bytes (Class 4), Memcached cannot reassign pages from Class 1 to Class 4! It will begin <strong class="text-amber-300">prematurely evicting 400-byte keys</strong> even though gigabytes of RAM in Class 1 sit half-empty.
            </p>
            <p>
              Conversely, Redis uses dynamic memory allocation (<code>jemalloc</code>), avoiding calcification, but requiring operational monitoring of the <code>mem_fragmentation_ratio</code> to prevent RSS memory runaway.
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
            Memcached is a pure volatile cache that scales multi-threaded across multi-core CPU instances using slab allocation; Redis is a single-threaded data structure server with optional RDB/AOF persistence, Sentinel HA, and rich atomic operations. In interviews, default to Redis unless your problem space is strictly massive multi-threaded raw byte caching without data structure manipulation.
          </p>
        </div>

        <!-- Page 72 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 72</span>
        </div>

      </div>

    </div>
  `;
}
