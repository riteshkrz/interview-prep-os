/**
 * 6.3 / 7.3 Erasure Coding vs. Replication - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 90 and 91
 * from The Modern System Design Interview Guide.
 */

export function renderErasureCodingVsReplicationContent(topic) {
  const comparisonMatrix = [
    {
      dimension: "Storage Overhead",
      repl: "200% Overhead (3.0× Raw Storage Multiplier)",
      replClass: "text-rose-400 font-bold",
      ec42: "50% Overhead (1.5× Raw Storage Multiplier)",
      ec42Class: "text-emerald-400 font-bold",
      ec124: "33% Overhead (1.33× Raw Storage Multiplier)",
      ec124Class: "text-emerald-400 font-bold"
    },
    {
      dimension: "Storage Efficiency",
      repl: "33.3% Usable Data Capacity",
      replClass: "text-rose-400 font-bold",
      ec42: "66.7% Usable Data Capacity",
      ec42Class: "text-emerald-400 font-bold",
      ec124: "75.0% Usable Data Capacity",
      ec124Class: "text-emerald-400 font-bold"
    },
    {
      dimension: "Fault Tolerance",
      repl: "Survives any 2 node or disk crashes",
      replClass: "text-slate-300",
      ec42: "Survives loss of ANY 2 chunks simultaneously",
      ec42Class: "text-slate-300",
      ec124: "Survives loss of ANY 4 chunks simultaneously",
      ec124Class: "text-emerald-400 font-bold"
    },
    {
      dimension: "Durability Rating",
      repl: "~6 Nines (99.9999% Annual Durability)",
      replClass: "text-amber-300",
      ec42: "~9 Nines (99.9999999% Annual Durability)",
      ec42Class: "text-emerald-400 font-bold",
      ec124: "11 Nines (99.999999999% AWS S3 Standard)",
      ec124Class: "text-emerald-400 font-bold"
    },
    {
      dimension: "Encode / Write CPU",
      repl: "Zero CPU overhead (Pure byte streaming to 3 nodes)",
      replClass: "text-emerald-400 font-bold",
      ec42: "Moderate CPU (Galois Field matrix multiplication)",
      ec42Class: "text-slate-300",
      ec124: "High CPU (Hardware AVX-512 SIMD vectorization)",
      ec124Class: "text-amber-300"
    },
    {
      dimension: "Degraded Read Latency",
      repl: "Zero latency penalty: Immediately read Replica 2",
      replClass: "text-emerald-400 font-bold",
      ec42: "High penalty: Must fetch 4 chunks & solve linear equations",
      ec42Class: "text-amber-300",
      ec124: "Very high penalty: Must fetch 12 chunks across network",
      ec124Class: "text-rose-400 font-bold"
    },
    {
      dimension: "Network Repair Traffic",
      repl: "1.0× Object Size (Copy surviving replica to new disk)",
      replClass: "text-emerald-400 font-bold",
      ec42: "4.0× Object Data Chunks fetched across network",
      ec42Class: "text-amber-300",
      ec124: "12.0× Object Data Chunks fetched across network",
      ec124Class: "text-rose-400 font-bold"
    },
    {
      dimension: "Optimal Data Size",
      repl: "Small / Hot objects (&lt; 1MB), metadata, caches",
      replClass: "text-cyan-300 font-bold",
      ec42: "Medium objects (1MB – 10MB), general files",
      ec42Class: "text-slate-300",
      ec124: "Large / Cold objects (&gt; 10MB), media, backups, data lakes",
      ec124Class: "text-emerald-400 font-bold"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Reed-Solomon Galois Field Linear Algebra: Matrix Reconstruction Mechanics",
      answer: `<strong>Reed-Solomon ($k + m$)</strong> relies on linear algebra over finite Galois Fields ($GF(2^8)$ or $GF(2^{16})$):
      <br/><br/>
      <strong class="text-indigo-400">The Encoding & Decoding Mathematics:</strong>
      <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300">
        <li><strong>Encoding:</strong> An object is partitioned into $k$ data chunks represented as a vector $\\vec{D} = [d_1, d_2, \\dots, d_k]^T$. An encoding generator matrix $G$ of size $(k+m) \\times k$ (typically a Vandermonde or Cauchy matrix) is multiplied by $\\vec{D}$ to produce $k$ data chunks and $m$ parity chunks: <br/>
        <code class="text-cyan-300 bg-black/40 px-2 py-0.5 rounded text-[11px] block mt-1">\\vec{C} = G \\times \\vec{D} \\quad (\\text{producing } k+m \\text{ total chunks})</code></li>
        <li><strong>Reconstruction (Decoding):</strong> If any $m$ chunks are lost due to disk or node crashes, the system selects any $k$ surviving chunks and drops the rows of $G$ corresponding to the missing chunks, leaving a square $k \\times k$ sub-matrix $G'$.</li>
        <li>By multiplying the surviving chunks by the <strong>matrix inverse $(G')^{-1}$</strong>, the original data vector $\\vec{D}$ is 100% recovered with zero data loss!</li>
      </ul>`
    },
    {
      conceptId: "#02",
      title: "The Small File (< 1MB) Bottleneck: Protocol Metadata & Compaction Aggregation",
      answer: `Applying an 8+4 Erasure Coding scheme to a 16KB file splits it into 12 chunks of only ~1.3 KB each:
      <br/><br/>
      <strong class="text-indigo-400">The Small File Dilemma:</strong>
      <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300">
        <li><strong>Metadata & Protocol Overhead:</strong> Managing chunk placement, network socket headers, and disk allocation for hundreds of tiny 1KB files overwhelms cluster storage metadata services.</li>
        <li><strong>IOPS Amplification:</strong> Reading or writing a tiny 16KB file requires 12 separate network RPCs and disk seeks across 12 different physical servers, cratering storage throughput.</li>
        <li><strong>The Production Solution (Aggregation / Compaction):</strong> Hyperscale systems (AWS S3, Google Cloud Storage, Ceph) <strong>do not erasure-code tiny files individually</strong>. Instead, small files are initially stored using <em>3-way replication</em>. A background compaction daemon aggregates thousands of small files into a single 128MB container block, which is then erasure-coded across the cluster!</li>
      </ul>`
    },
    {
      conceptId: "#03",
      title: "11 Nines of Durability vs. 6 Nines: MTTR Calculations & 3-AZ Dispersion",
      answer: `Durability calculations depend on the <strong>Mean Time to Failure (MTTF)</strong> of disks versus the <strong>Mean Time to Repair (MTTR)</strong>:
      <br/><br/>
      <strong class="text-indigo-400">Durability Math Comparison:</strong>
      <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300">
        <li><strong>3-Way Replication:</strong> Storing 3 copies tolerates 2 concurrent drive failures. If Drive 1 fails, you only have 2 copies left. If Drive 2 fails before Drive 1 is copied across the network, you are one disk away from permanent data loss. Across a cluster of 50,000 disks, concurrent double/triple failures happen regularly, capping annual durability to approximately <strong>~6 nines ($99.9999\%$)</strong>.</li>
        <li><strong>Reed-Solomon (e.g. 12+4 across 3 AZs):</strong> The system can tolerate <strong>4 simultaneous disk or server crashes</strong> without losing data. Because chunks are scattered across 3 distinct Availability Zones with independent power and flood plains, the probability of 5 simultaneous independent failures within the repair window drops to less than $10^{-11}$, mathematically guaranteeing <strong>11 nines ($99.999999999\%$)</strong> of durability while requiring only 33% extra disk capacity!</li>
      </ul>`
    },
    {
      conceptId: "#04",
      title: "Reconstruction Storms & Network Saturation: Token-Bucket Throttling Defense",
      answer: `When an entire storage rack or high-density storage server (holding 500 Terabytes of erasure-coded chunks) suffers a catastrophic hardware failure, the storage orchestrator detects that hundreds of thousands of objects are now missing chunks.
      <br/><br/>
      <strong class="text-rose-400">The Reconstruction Storm:</strong>
      <p class="text-slate-300 mt-1">
        Because reconstructing each missing chunk requires reading $k$ surviving chunks across the network, rebuilding 500 TB of data requires reading <strong>$4 \\times 500\\text{ TB} = 2,000\\text{ TB}$ (2 Petabytes!)</strong> of network bandwidth. If left unmanaged, reconstruction traffic floods top-of-rack switches, causing severe network packet drops and latency spikes that crash customer-facing reads.
      </p>
      <br/>
      <strong class="text-emerald-400">Production Throttle Mitigations:</strong>
      <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300 text-[12px]">
        <li><strong>Token Bucket Rate Limiting:</strong> Cap reconstruction network bandwidth to a strict percentage (e.g., max 15% of NIC bandwidth).</li>
        <li><strong>Priority Scheduling:</strong> Prioritize real-time user GET requests over background repair jobs.</li>
        <li><strong>Urgency Tiering:</strong> Only immediately rebuild objects that have lost 2+ chunks; objects that have only lost 1 chunk are queued for off-peak overnight repair.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-8 max-w-5xl mx-auto select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 90, 91: ERASURE CODING VS. REPLICATION -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              6.3 Erasure Coding vs. Replication
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Hyperscale cloud storage systems (<strong class="text-cyan-400">AWS S3</strong>, <strong class="text-cyan-400">Google Cloud Storage</strong>, <strong class="text-white">Ceph</strong>) store exabytes of data on unreliable commodity hardware. To prevent data loss when disks and datacenters fail, systems choose between <strong class="text-amber-300">3-Way Replication</strong> and mathematical <strong class="text-emerald-400">Reed-Solomon Erasure Coding</strong>.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">1. 3-Way Replication (200% Overhead)</span>
              <span class="text-[12px] text-slate-300">Stores 3 complete byte-for-byte copies across 3 nodes. Simple, zero decode CPU, lowest read latency. But storage costs are 3× and durability is capped at ~6 nines.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">2. Erasure Coding (33%–50% Overhead)</span>
              <span class="text-[12px] text-slate-300">Fragments object into k data + m parity chunks. Survives ANY m simultaneous node failures. Delivers 11 nines durability with 4× less disk cost, paying in rebuild CPU and network latency.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Concurrency Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              REED-SOLOMON 4+2 ENCODING & CROSS-AZ RECONSTRUCTION ARCHITECTURE
            </span>
            <span class="text-slate-500 text-[10.5px]">Galois Field Math</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. ENCODING: REED-SOLOMON 4+2 (SPLIT 100MB OBJECT INTO 4 DATA + 2 PARITY CHUNKS)                 │
│                                                                                                  │
│   Original Object (100MB)                                                                        │
│   ┌───────────────────────────────┬───────────────────────────────┐                              │
│   │ Data Chunk 1: D1 (25MB)       │ Data Chunk 2: D2 (25MB)       │                              │
│   ├───────────────────────────────┼───────────────────────────────┤                              │
│   │ Data Chunk 3: D3 (25MB)       │ Data Chunk 4: D4 (25MB)       │                              │
│   └───────────────────────────────┴───────────────────────────────┘                              │
│                 │                                                                                │
│                 ▼ [ Galois Field GF(2^8) Matrix Multiplication ]                                 │
│   ┌───────────────────────────────┬───────────────────────────────┐                              │
│   │ Parity Chunk 1: P1 (25MB)     │ Parity Chunk 2: P2 (25MB)     │ (Total raw storage = 150MB;  │
│   └───────────────────────────────┴───────────────────────────────┘   Only 50% extra overhead!)  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. GEOGRAPHIC DISTRIBUTION ACROSS THREE INDEPENDENT AVAILABILITY ZONES                           │
│                                                                                                  │
│   ┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐        │
│   │   AVAILABILITY ZONE 1   │   │   AVAILABILITY ZONE 2   │   │   AVAILABILITY ZONE 3   │        │
│   │  [ Rack 1: Chunk D1 ]   │   │  [ Rack 3: Chunk D3 ]   │   │  [ Rack 5: Chunk P1 ]   │        │
│   │  [ Rack 2: Chunk D2 ]   │   │  [ Rack 4: Chunk D4 ]   │   │  [ Rack 6: Chunk P2 ]   │        │
│   └─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. DEGRADED RECONSTRUCTION (e.g. D2 and P1 DIE SIMULTANEOUSLY)                                   │
│                                                                                                  │
│   [ D1 (Surviving) ] ──┐                                                                         │
│   [ D3 (Surviving) ] ──┼──► Fetch 4 Surviving Chunks ──► Invert 4×4 Matrix ──► 100% Full         │
│   [ D4 (Surviving) ] ──┤     over Network                (Solve Equations)    Reconstruction     │
│   [ P2 (Surviving) ] ──┘                                                      of D2 and P1!      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- High-Signal Comparison Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">table_chart</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              3-Way Replication vs. Reed-Solomon Erasure Coding Matrix
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-semibold">
                  <th class="py-3 px-4 w-[18%]">Storage Metric</th>
                  <th class="py-3 px-4 w-[27%] text-rose-400">3-Way Replication</th>
                  <th class="py-3 px-4 w-[27%] text-emerald-400">Reed-Solomon 4+2 (EC)</th>
                  <th class="py-3 px-4 w-[28%] text-cyan-300">Reed-Solomon 12+4 (Hyperscale)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] bg-[#0A0E1A]">
                ${comparisonMatrix.map(row => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-200 border-r border-[#24314A]/50 bg-[#0F172A]/40">
                      ${row.dimension}
                    </td>
                    <td class="py-3 px-4 ${row.replClass} border-r border-[#24314A]/50">
                      ${row.repl}
                    </td>
                    <td class="py-3 px-4 ${row.ec42Class} border-r border-[#24314A]/50">
                      ${row.ec42}
                    </td>
                    <td class="py-3 px-4 ${row.ec124Class}">
                      ${row.ec124}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Box: Senior Perspective Callout -->
        <div class="bg-[#0D241E] border-l-4 border-[#10B981] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: HYBRID TIERING IN AWS S3 & SCALE ECONOMICS
          </span>
          <p class="text-[13px] font-sans text-emerald-100 leading-relaxed">
            In system design interviews, never propose a single durability scheme for every tier of data. Hyperscale architectures combine both paradigms in a <strong>Hybrid Tiering Strategy</strong>:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[12px] font-sans">
            <div class="bg-black/40 p-2.5 rounded border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-amber-300 font-bold">Hot / Small Objects (&lt; 1MB): 3-Way Replication</strong>
              <span class="text-slate-300">Used for database write-ahead logs, active caches, and small metadata files. Zero decode CPU overhead, lowest latency, and avoids tiny chunk fragmentation.</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-emerald-300 font-bold">Cold / Large Objects (&gt; 1MB): Erasure Coding</strong>
              <span class="text-slate-300">Used for media, S3 Standard, archives, and big data lakes. Saves 50% to 66% on raw disk capacity ($millions at petabyte scale) while guaranteeing 11 nines durability.</span>
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: Reconstruction Storm -->
        <div class="bg-[#2A1608] border-l-4 border-[#F97316] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            PRODUCTION HAZARD: THE RECONSTRUCTION NETWORK STORM
          </span>
          <p class="text-[13px] font-sans text-amber-100 leading-relaxed">
            When a high-density storage server holding 500 Terabytes of erasure-coded chunks crashes, the cluster detects that millions of objects are in a degraded state and begins autonomous reconstruction.
          </p>
          <p class="text-[12.5px] font-sans text-amber-200/90 leading-relaxed pt-1">
            <strong>The Datacenter Meltdown:</strong> Because rebuilding each chunk requires reading $k$ chunks across the datacenter network, repairing 500 TB generates <strong>2 Petabytes of cross-rack network traffic</strong>! Uncontrolled rebuild traffic will saturate spine switches, dropping customer packets and causing cascading timeouts across unrelated microservices.
            <br/><br/>
            <strong>Mandatory Production Mitigations:</strong>
            <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300 text-[12px]">
              <li><strong>Token Bucket Rate Limiting:</strong> Cap repair traffic to a strict threshold (e.g. &le; 10% of network switch capacity).</li>
              <li><strong>Priority Inversion Defense:</strong> Client-facing GET requests always preempt background reconstruction threads.</li>
              <li><strong>Urgency Tiering:</strong> Only immediately reconstruct objects that have lost 2+ chunks; objects missing only 1 chunk are deferred to off-peak night windows.</li>
            </ul>
          </p>
        </div>

        <!-- Critical Architectural Deep-Dives & Production Edge Cases -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#24314A] pb-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">account_tree</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              Critical Architectural Deep-Dives &amp; Production Edge Cases
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${architecturalDeepDives.map(item => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 shrink-0">
                    ${item.conceptId}
                  </span>
                  <h4 class="font-sans text-[13px] font-bold text-white leading-snug">
                    ${item.title}
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
            Erasure coding buys vastly superior durability (11 nines vs. 6 nines) at a fraction of replication's storage overhead (50% vs. 200%), paying for it in read latency and reconstruction network bandwidth. In storage architecture interviews, quote the numbers: 50% overhead vs 200%, 11 nines vs 6, and propose hybrid tiering—replicating hot small objects while erasure-coding large cold media.
          </p>
        </div>

        <!-- Page 91 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 91</span>
        </div>

      </div>

    </div>
  `;
}
