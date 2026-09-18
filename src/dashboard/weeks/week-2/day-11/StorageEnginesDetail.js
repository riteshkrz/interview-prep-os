/**
 * 4.9 Storage Engine Internals: B-Tree vs. LSM-Tree - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 65 and 66
 * from The Modern System Design Interview Guide.
 */

export function renderStorageEnginesContent(topic) {
  const engineComparisons = [
    {
      metric: "Write Throughput",
      btree: "Moderate (Limited by random disk I/O & page rewrites)",
      lsm: "Ultra-High (Append-only in-memory RAM write + sequential WAL)",
      lsmClass: "text-emerald-400 font-bold"
    },
    {
      metric: "Point Read Latency (p50 / p99)",
      btree: "Ultra-Fast & Deterministic ($O(\\log N)$ page walk, single I/O)",
      btreeClass: "text-emerald-400 font-bold",
      lsm: "Slower / Variable (May check MemTable + multiple SSTables)",
      lsmClass: "text-amber-400"
    },
    {
      metric: "Range Query Efficiency",
      btree: "Optimal (Leaf pages form contiguous doubly linked list)",
      btreeClass: "text-emerald-400 font-bold",
      lsm: "Moderate (Requires multi-way merge across sorted SSTable runs)",
      lsmClass: "text-slate-300"
    },
    {
      metric: "Write Amplification (WA)",
      btree: "High (Overwrites entire 16KB page for single-byte change; WA: 10–50x)",
      btreeClass: "text-rose-400 font-bold",
      lsm: "Moderate to High (Compaction rewrites files across levels; WA: 5–30x)",
      lsmClass: "text-amber-400"
    },
    {
      metric: "Space Amplification (Overhead)",
      btree: "High (Page fragmentation from splits; leaves 20–40% empty space)",
      btreeClass: "text-amber-400",
      lsm: "Low (Immutable SSTables packed densely; purged via compaction)",
      lsmClass: "text-emerald-400 font-bold"
    },
    {
      metric: "Primary Engines",
      btree: "PostgreSQL, MySQL (InnoDB), Oracle, SQLite",
      lsm: "RocksDB, Apache Cassandra, ScyllaDB, CockroachDB (Pebble), LevelDB"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why do LSM-Trees achieve an order-of-magnitude higher write throughput than B-Trees?",
      answer: `The fundamental reason comes down to the physics of storage media: <strong>Sequential I/O vs. Random I/O</strong>.
      <br/><br/>
      <strong class="text-indigo-400">The B-Tree Bottleneck (Random In-Place Updates):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>A B-Tree organizes data in fixed-size pages (typically 16KB). When you insert or update a row, the engine must traverse the tree, locate the exact leaf page, read it into memory, mutate the row, and write the entire 16KB page back to disk in-place.</li>
        <li>Writing 50 bytes across 1,000 scattered keys triggers 1,000 distinct random disk page rewrites (16 MB of disk I/O!). Even on modern NVMe SSDs, random I/O incurs heavy flash translation layer (FTL) wear and high write latency.</li>
      </ul>
      <br/>
      <strong class="text-indigo-400">The LSM-Tree Breakthrough (Append-Only Sequential Flow):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>In an LSM-Tree, incoming writes are appended sequentially to a Write-Ahead Log (WAL) on disk and inserted into a concurrent in-memory sorted skip-list (the <strong>MemTable</strong>).</li>
        <li>The write returns to the client in microseconds! There are <em>zero random disk seeks</em> on the write path. When the MemTable fills up (e.g. 64MB), it is flushed to disk in one large, blistering-fast sequential write as an immutable <strong>SSTable</strong>.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What are Write Amplification, Read Amplification, and Space Amplification in storage engines?",
      answer: `These three ratios define the fundamental trilemma of database storage architecture:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Write Amplification (WA):</strong> The ratio of bytes written to persistent storage versus bytes requested by the application:
        <br/>
        $$\\text{WA} = \\frac{\\text{Bytes Written to Disk}}{\\text{Bytes Written by Application}}$$
        If you update a 50-byte record and InnoDB rewrites a 16KB page, your write amplification is $16,384 / 50 = 327\\times$! In LSMs, compaction merges cause a write amplification of $10\\times$ to $30\\times$.</li>
        <li><strong>Read Amplification (RA):</strong> The number of disk page accesses required to satisfy a single logical read request. B-Trees guarantee $\\text{RA} = O(\\log_B N)$ (usually 3 to 4 page reads max). In naive LSMs, reading a missing key could check every SSTable across all levels (mitigated by Bloom filters).</li>
        <li><strong>Space Amplification (SA):</strong> The ratio of physical disk space occupied versus actual logical user data size:
        <br/>
        $$\\text{SA} = \\frac{\\text{Physical Disk Consumption}}{\\text{Uncompressed Raw Data Size}}$$
        High space amplification occurs in B-Trees due to internal page fragmentation (half-empty pages after splits), and in LSMs due to old overwritten row versions pending compaction.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is the mechanical difference between Leveled Compaction and Size-Tiered Compaction in LSM-Trees?",
      answer: `Compaction is the background process of merging sorted SSTables, discarding overwritten versions, and purging tombstones.
      <br/><br/>
      <strong class="text-indigo-400">1. Size-Tiered Compaction Strategy (STCS):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Flushes immutable SSTables of roughly equal size into a tier. When a tier accumulates $N$ files (e.g. 4 files of 100MB), it merges them into 1 larger file (400MB).</li>
        <li><strong>Pros:</strong> Lowest write amplification; great for write-heavy logging where data is rarely overwritten.</li>
        <li><strong>Cons (Space Overhead):</strong> Requires up to <strong>50% free disk headroom</strong> just to execute compaction of the largest files, and read amplification is higher because keys can reside in multiple SSTables in the same tier.</li>
      </ul>
      <br/>
      <strong class="text-indigo-400">2. Leveled Compaction Strategy (LCS / RocksDB default):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Organizes disk storage into exponential levels (L0: 10MB, L1: 100MB, L2: 1GB, L3: 10GB).</li>
        <li>At Level 1 and higher, <strong>keys within each level are strictly non-overlapping</strong>! Each level is a single partitioned sorted run.</li>
        <li><strong>Pros:</strong> Optimal read performance (a point read checks at most 1 SSTable per level) and low space amplification (&lt;10% disk overhead).</li>
        <li><strong>Cons:</strong> Higher write amplification because files must be continuously merged across levels.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "How do Bloom Filters and Block Caches bring LSM-Tree read latency close to B-Tree speeds?",
      answer: `Because an LSM-tree distributes data across multiple SSTable files, a point read (<code>GET user:42</code>) could theoretically require opening and scanning dozens of files across levels.
      <br/><br/>
      <strong class="text-indigo-400">The Two Read Acceleration Pillars:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>In-Memory Bloom Filters:</strong> Every SSTable file has a compact Bloom filter stored directly in RAM (10 bits per key).
        <br/>
        When reading <code>user:42</code>, the engine queries the Bloom filter first. If the filter returns <em>false</em>, the key is <strong>100% guaranteed not to exist</strong> in that SSTable file $\to$ disk read is completely avoided! Over 99% of negative file lookups are discarded in nanoseconds without touching the SSD.</li>
        <li><strong>Uncompressed Block Cache:</strong> Frequently accessed data blocks (4KB–64KB) within SSTables are pinned in an in-memory LRU block cache. Point lookups on hot records resolve entirely in RAM, matching B-Tree buffer pool latency.</li>
      </ol>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 65, 66: STORAGE ENGINES - B-TREE VS. LSM-TREE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.9 Storage Engine Internals: B-Tree vs. LSM-Tree
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            At the heart of every database is a <strong class="text-indigo-400">storage engine</strong> responsible for laying bytes onto physical disk. Storage engines fall into two opposing architectural paradigms: <strong class="text-cyan-400">B-Trees</strong> (which mutate fixed-size pages in-place via random I/O) and <strong class="text-emerald-400">Log-Structured Merge-Trees (LSM-Trees)</strong> (which append writes sequentially into memory and flush to immutable sorted files). Understanding their disk I/O profile dictates database selection at scale.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">1. B-Tree: In-Place Update (Read-Optimized)</span>
              <span class="text-[12px] text-slate-300">Organized into fixed 16KB pages. Updates overwrite existing disk blocks in-place. Guarantees deterministic $O(\\log N)$ point reads and superb range scans, but suffers from random write amplification.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">2. LSM-Tree: Append-Only (Write-Optimized)</span>
              <span class="text-[12px] text-slate-300">Writes buffer in an in-memory MemTable and append to a sequential WAL. Flushed to immutable SSTables on disk. Order-of-magnitude higher write throughput, paid for via background compaction.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Storage Engines Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              DISK I/O ARCHITECTURE: B-TREE RANDOM MUTATION VS. LSM SEQUENTIAL PIPELINE
            </span>
            <span class="text-slate-500 text-[10.5px]">Page Layout vs. SSTable Levels</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. B-TREE / B+TREE WRITE PATH (PostgreSQL / MySQL InnoDB)                                        │
│                                                                                                  │
│   Write ──► [ WAL ] (Append-only for crash recovery)                                             │
│               │                                                                                  │
│               └──► In-Memory Buffer Pool ──► [ Dirty 16KB Page ] ──RANDOM I/O──► [ DISK Page #4092]│
│                                              (In-place page overwrite!)      (Rewrites 16KB!)    │
│                                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. LSM-TREE WRITE & COMPACTION PIPELINE (RocksDB / Cassandra)                                    │
│                                                                                                  │
│   Write ──┬──► [ Disk WAL ] (Sequential append-only log)                                        │
│           │                                                                                      │
│           └──► [ MemTable in RAM ] (Concurrent Sorted Skip-List: O(log N) insert in nanoseconds!)│
│                      │                                                                           │
│                      ▼ (When MemTable reaches 64MB, flush as contiguous sequential block!)        │
│                [ L0 SSTables ] (Immutable, sorted string tables on disk)                         │
│                      │                                                                           │
│                      ▼ (Background Compaction: K-way merge sort purges duplicates & tombstones) │
│                [ L1 SSTables ] ──Compaction──► [ L2 SSTables ] ──Compaction──► [ L3 SSTables ]  │
│                (Non-overlapping)               (10x larger)                    (100x larger)     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: Storage Engine Comparison -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Detailed Architectural Comparison: B-Tree vs. LSM-Tree
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Performance Dimension</th>
                  <th class="p-3">B-Tree (InnoDB / Postgres)</th>
                  <th class="p-3">LSM-Tree (RocksDB / Cassandra)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${engineComparisons.map(e => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">${e.metric}</td>
                    <td class="p-3 ${e.btreeClass || 'text-slate-300'}">${e.btree}</td>
                    <td class="p-3 ${e.lsmClass || 'text-slate-300'}">${e.lsm}</td>
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
            SENIOR PERSPECTIVE: BLOOM FILTERS & INGESTION-HEAVY WORKLOADS
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In system design interviews, never claim that LSM-trees are strictly superior to B-Trees because of their write speed. LSM-trees trade away predictability: <strong class="text-emerald-300">B-Trees offer deterministic sub-millisecond p99 read latencies</strong> that OLTP applications rely upon. If your workload is 80% reads and 20% writes (e-commerce, SaaS CRUD), B-Trees in PostgreSQL or MySQL InnoDB are optimal.
            </p>
            <p>
              However, when your write volume reaches tens of thousands of writes per second (time-series metrics, financial tick capture, event logs), B-Trees collapse under random I/O and page-splitting locks. In those ingestion-heavy workloads, choose an LSM-Tree (RocksDB/Cassandra), and explicitly explain that <strong class="text-white">Bloom Filters and Block Caches</strong> mitigate read amplification by filtering out 99%+ of negative SSTable file scans.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - COMPACTION STALLS & TOMBSTONES -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            THE COMPACTION TAX: WRITE STALLS & TOMBSTONE ACCUMULATION
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              The dirty secret of LSM-trees is <strong class="text-white">Compaction Debt</strong>. Background compaction threads are constantly reading, merging, and rewriting gigabytes of SSTables across disk levels. This competes directly with incoming client read/write traffic for disk I/O bandwidth.
            </p>
            <p>
              If incoming write throughput exceeds the disk's ability to compact files, Level 0 files pile up. Once L0 reaches a hard limit (e.g. 20 files in RocksDB), the engine initiates an emergency <strong class="text-amber-300">Write Stall</strong>: incoming client writes are throttled from 50,000 ops/sec down to 500 ops/sec, causing catastrophic latency spikes. Furthermore, deleting rows in an LSM-tree writes <em>tombstones</em>; querying across heavily deleted ranges forces the engine to scan millions of dead tombstones until compaction finishes.
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
            Random disk writes are the ultimate performance bottleneck. B-Trees mutate pages in-place, delivering rock-solid p99 read latencies for balanced transactional OLTP. LSM-Trees convert all writes into sequential memory buffers and immutable append-only SSTables, achieving extreme write throughput at the operational expense of background compaction debt and tombstone overhead.
          </p>
        </div>

        <!-- Page 66 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 66</span>
        </div>

      </div>

    </div>
  `;
}
