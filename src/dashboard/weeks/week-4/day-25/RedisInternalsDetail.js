/**
 * 5.4 Why Redis Is So Fast - Visual Guide
 * High-signal, visually rich reproduction of Pages 69–70
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderRedisInternalsContent(topic) {
  const encodings = [
    {
      type: "Hash",
      small: "listpack (compact linear array in memory, cache-line friendly)",
      large: "hashtable (O(1) dictionary with MurmurHash2 + incremental rehashing)"
    },
    {
      type: "Sorted Set (Zset)",
      small: "listpack (contiguous memory for small cardinality)",
      large: "skiplist + hashtable (O(log N) probabilistic balanced multi-level index)"
    },
    {
      type: "Set",
      small: "intset (sorted array of 16/32/64-bit integers with zero pointer overhead)",
      large: "hashtable (key dictionary with NULL values)"
    },
    {
      type: "Bitmap / HLL",
      small: "raw bit vector (1 bit per entity, 100M booleans in ~12 MB)",
      large: "HyperLogLog (12 KB registers providing cardinality estimation with 0.81% error)"
    }
  ];

  const followUps = [
    {
      q: "What is I/O multiplexing concretely in the Linux kernel?",
      a: "Instead of dedicating a blocking thread per TCP connection (which wastes 1MB of stack per socket and collapses CPU via context switches), a single thread invokes the kernel's <code>epoll</code> (Linux) or <code>kqueue</code> (macOS/BSD) subsystem: <em>'Which of these 10,000 sockets have bytes ready to read?'</em>. The kernel returns only the active sockets, allowing one event loop thread to process them sequentially with zero locks — the identical architecture powering NGINX and Node.js."
    },
    {
      q: "If Redis is in-memory and handles 100k QPS, why is your production p99 latency 500ms?",
      a: "Almost never the storage engine itself: 1) <strong>A slow blocking command</strong> executed on the single thread (inspect <code>SLOWLOG GET 10</code>); 2) <strong>DEL on a huge collection:</strong> deleting a 5-million-element set blocks the event loop for hundreds of milliseconds while freeing memory (use <code>UNLINK</code> for async background reclaim); 3) <strong>RDB background fork stall:</strong> <code>fork()</code> on a huge 32GB memory footprint copies page tables, freezing the main process; 4) <strong>OS Swapping:</strong> if RAM is exhausted and the Linux kernel swaps memory pages to disk, Redis latency instantly collapses from nanoseconds to milliseconds."
    },
    {
      q: "Which Redis commands should NEVER be executed on a production cluster?",
      a: "<strong><code>KEYS *</code></strong> (scans entire keyspace in O(N), locking all callers — use <code>SCAN</code>); <strong><code>FLUSHALL / FLUSHDB</code></strong> (synchronous wipe); <strong><code>HGETALL / ZRANGE</code> without bounds</strong> on uncapped collections; <strong><code>DEL</code> on huge keys</strong> (use non-blocking <code>UNLINK</code>); and <strong>unbounded, CPU-intensive Lua scripts</strong> with loops that monopolize the single worker thread."
    },
    {
      q: "How do you scale Redis horizontally past a single machine's RAM ceiling?",
      a: "<strong>Redis Cluster with 16,384 Hash Slots.</strong> The keyspace is divided into 16,384 slots mapped across master nodes with automated replica failover. Multi-key commands (transactions, MGET, Lua) must operate on keys mapped to the <em>same hash slot</em>. Enforce co-location using <strong>Hash Tags</strong>: <code>user:{123}:profile</code> and <code>user:{123}:settings</code> will hash only the bracketed text <code>{123}</code>, guaranteeing they land on the identical shard node."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="5.4-redis-fast">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Part 5 · Caching &amp; In-Memory Data
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 69–70 · Section 5.4</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          5.4 Why Is Redis So Fast?
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Redis delivers sub-millisecond responses and 100k+ ops/sec per core. Senior candidates must articulate the three pillars: memory hierarchy latency, single-threaded epoll event loops, and adaptive memory encodings.
        </p>
      </div>

      <!-- The Three Reasons Expanded -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-emerald-400 uppercase">1. RAM, Not Disk</span>
          <div class="bg-[#0A0E1A] p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-[#1E293B] flex flex-col gap-1">
            <span>RAM read:   ~100 ns</span>
            <span>NVMe SSD:   ~16–100 µs (100–1,000×)</span>
            <span>HDD seek:   ~10 ms (100,000×)</span>
          </div>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">Pure memory access avoids physical seek times and disk block allocation bottlenecks entirely.</p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-cyan-400 uppercase">2. Non-Blocking Event Loop</span>
          <div class="bg-[#0A0E1A] p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-[#1E293B] flex flex-col gap-1">
            <span>• epoll / kqueue multiplexing</span>
            <span>• Zero lock contention</span>
            <span>• Zero thread context-switch</span>
          </div>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">Thousands of open client sockets watched by a single execution loop. Commands are guaranteed atomic!</p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-indigo-400 uppercase">3. Adaptive Encodings</span>
          <div class="bg-[#0A0E1A] p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-[#1E293B] flex flex-col gap-1">
            <span>• listpack for small data</span>
            <span>• skiplist + hash for large</span>
            <span>• intset for zero pointers</span>
          </div>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">Internal data structures automatically upgrade in place as collection size and cardinality increase.</p>
        </div>
      </div>

      <!-- Flagged Source Nuances -->
      <div class="bg-[#1C1322] border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 font-sans">
        <span class="font-code text-[12px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">info</span>
          FLAGGED — TWO NUANCES THAT PROVE SENIOR DEPTH
        </span>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          <strong>1. RAM vs. Disk Factor:</strong> Saying <em>'RAM is 1000× faster than disk'</em> is true against mechanical spinning disks (~100,000×), but against modern enterprise NVMe SSDs (~16–100µs), the gap is ~100–1,000×. Quote the raw latency numbers (100ns vs 20µs) — they cannot be argued with.<br/>
          <strong>2. Multi-Threaded I/O Footnote:</strong> Since <strong>Redis 6.0</strong>, socket read/write and protocol parsing are delegated to background I/O threads. However, <strong>command execution remains strictly single-threaded</strong>, preserving the lock-free atomicity of <code>INCR</code>, <code>SETNX</code>, and Lua scripts.
        </p>
      </div>

      <!-- Encodings Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          ADAPTIVE DATA STRUCTURE ENCODINGS UNDER THE HOOD
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/5">Data Type</th>
                <th class="p-3 w-2/5">Small Size Encoding (Memory Optimized)</th>
                <th class="p-3 w-2/5">Large Size Encoding (Speed Optimized)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${encodings.map(e => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${e.type}</td>
                  <td class="p-3 text-slate-300">${e.small}</td>
                  <td class="p-3 text-emerald-300">${e.large}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interview Follow-ups -->
      <div class="flex flex-col gap-3 pt-2">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          INTERVIEW FOLLOW-UPS (SENIOR &amp; STAFF PROBES)
        </span>
        <div class="flex flex-col gap-3">
          ${followUps.map((item, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <span class="font-sans text-[13px] font-bold text-cyan-300">
                Q${idx + 1}: ${item.q}
              </span>
              <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
                ${item.a}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Key Interview Takeaway -->
      <div class="bg-gradient-to-r from-rose-950/60 to-cyan-950/60 border border-rose-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-rose-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "RAM + a lock-free event loop + encodings tuned per data size. Single-threading is not a limitation Redis works around — it is the feature that buys atomicity and predictable latency without lock contention."
        </p>
      </div>

    </div>
  `;
}
