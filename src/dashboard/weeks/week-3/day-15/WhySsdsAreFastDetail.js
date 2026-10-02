/**
 * 6.2 / 7.2 Why SSDs Are Fast - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 88 and 89
 * from The Modern System Design Interview Guide.
 */

export function renderWhySsdsAreFastContent(topic) {
  const comparisonMatrix = [
    {
      metric: "Random Read IOPS (4KB)",
      hdd: "75 – 100 IOPS",
      hddClass: "text-rose-400 font-bold",
      sata: "50,000 – 100,000 IOPS",
      sataClass: "text-amber-300 font-bold",
      nvme: "800,000 – 1,500,000+ IOPS",
      nvmeClass: "text-emerald-400 font-bold"
    },
    {
      metric: "Random Write IOPS (4KB)",
      hdd: "75 – 100 IOPS",
      hddClass: "text-rose-400 font-bold",
      sata: "40,000 – 90,000 IOPS",
      sataClass: "text-amber-300 font-bold",
      nvme: "600,000 – 1,000,000+ IOPS",
      nvmeClass: "text-emerald-400 font-bold"
    },
    {
      metric: "Sequential Throughput",
      hdd: "150 – 250 MB/sec",
      hddClass: "text-rose-400 font-bold",
      sata: "500 – 560 MB/sec (SATA bus saturated)",
      sataClass: "text-amber-300",
      nvme: "7,000 – 14,000 MB/sec (PCIe 4.0/5.0)",
      nvmeClass: "text-emerald-400 font-bold"
    },
    {
      metric: "Access Latency",
      hdd: "5 – 10 ms (Mechanical arm seek + rotation)",
      hddClass: "text-rose-400 font-bold",
      sata: "50 – 100 μs",
      sataClass: "text-amber-300",
      nvme: "10 – 20 μs (Sub-millisecond flash speed)",
      nvmeClass: "text-emerald-400 font-bold"
    },
    {
      metric: "Hardware Queue Concurrency",
      hdd: "1 Queue | Max 32 commands (NCQ)",
      hddClass: "text-slate-400",
      sata: "1 Queue | Max 32 commands (AHCI)",
      sataClass: "text-slate-400",
      nvme: "64,000 Queues | 64,000 commands each",
      nvmeClass: "text-emerald-400 font-bold"
    },
    {
      metric: "Physical Wear Limit",
      hdd: "Mechanical failure (head crash, motor wear)",
      hddClass: "text-slate-400",
      sata: "NAND Flash P/E cycles (~1,000–3,000 TLC)",
      sataClass: "text-slate-300",
      nvme: "NAND Flash P/E cycles (~1,000–3,000 TLC)",
      nvmeClass: "text-slate-300"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Write Amplification Factor (WAF): LSM-Trees vs. In-Place B-Tree Updates",
      answer: `<strong>Write Amplification (WA)</strong> is the ratio of the physical data written to NAND flash chips relative to the logical data submitted by the host operating system:
      <br/><br/>
      <code class="text-amber-300 bg-black/40 px-2 py-1 rounded text-[12px] block font-code">
        Write Amplification Factor (WAF) = Physical Bytes Written to NAND / Logical Bytes Written by Host
      </code>
      <br/>
      <strong class="text-indigo-400">Why WAF Occurs:</strong>
      <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300">
        <li>Because NAND flash cannot overwrite in-place, modifying a single 4KB page inside a 4MB block marks the old page invalid. During background Garbage Collection (GC), the SSD must copy all remaining valid pages from that block into a fresh block before erasing the old one.</li>
        <li>Random writes cause heavy block fragmentation, yielding a WAF of <strong>3.0 to 10.0</strong>—meaning 1GB of host writes burns 10GB of physical flash endurance!</li>
        <li><strong>Database Optimization:</strong> Append-only storage architectures like <strong>LSM-Trees (RocksDB, Cassandra)</strong> and commit logs (Kafka) write sequential, contiguous blocks. This allows the SSD controller to fill entire erase blocks sequentially, driving WAF close to <strong>1.0</strong> and extending drive lifespan by 500%.</li>
      </ul>`
    },
    {
      conceptId: "#02",
      title: "Flash Translation Layer (FTL) Algorithms: Dynamic vs. Static Wear Leveling",
      answer: `NAND flash memory cells physically degrade every time they are erased (Program/Erase or P/E cycles). If a single block exceeds its cycle limit (e.g. 3,000 cycles for TLC flash), the cells fail and data is corrupted.
      <br/><br/>
      <strong class="text-indigo-400">The Two Wear Leveling Algorithms:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Dynamic Wear Leveling:</strong> When the host writes updated data, the FTL always chooses the erased block with the <em>lowest erase count</em>. However, this only balances blocks that are actively being rewritten.</li>
        <li><strong>Static Wear Leveling (Cold Data Relocation):</strong> If certain blocks contain static, read-only data (e.g., OS kernel binaries or cold historical database rows), those blocks never get erased and have an erase count of near 0. The FTL actively moves this cold data to heavily-worn blocks, freeing up the low-cycle blocks for high-frequency write operations!</li>
        <li>This ensures all physical NAND flash blocks across the entire SSD wear down uniformly at the exact same rate.</li>
      </ul>`
    },
    {
      conceptId: "#03",
      title: "Block Fragmentation & GC Stalls: Sequential vs. Random I/O Physics",
      answer: `In traditional spinning disks, random I/O was slow due to mechanical arm movements. In SSDs, random writes hurt performance due to <strong>Block Fragmentation and Garbage Collection Stalls</strong>:
      <br/><br/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-emerald-400 block mb-1">1. Sequential Write Workloads</strong>
          <span class="text-slate-300 text-[12px]">Sequential writes fill entire flash blocks cleanly from page 0 to page 512. When data is deleted or expired, the entire block becomes obsolete simultaneously. The FTL can erase the entire block instantly without moving a single page! WAF ≈ 1.0.</span>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-rose-400 block mb-1">2. Random Write Workloads</strong>
          <span class="text-slate-300 text-[12px]">Random writes scatter updates across hundreds of different blocks. Every block ends up with 20% invalid pages and 80% valid pages. Garbage collection must read, relocate, and re-write millions of valid pages over and over, choking drive bandwidth and burning P/E cycles.</span>
        </div>
      </div>`
    },
    {
      conceptId: "#04",
      title: "The OS TRIM (UNMAP) Command: Preventing Synchronous GC Latency Spikes",
      answer: `When a file is deleted in a traditional operating system, the filesystem simply marks the file's index entry as free in the inode table—it <strong>does not physically overwrite the disk sectors with zeros</strong>.
      <br/><br/>
      <strong class="text-indigo-400">The Problem Without TRIM:</strong>
      <p class="text-slate-300 mt-1">
        Because the SSD controller operates at the block level and cannot understand the host's filesystem structures, the SSD assumes all previously written pages are still active, important data. During Garbage Collection, the SSD wastes valuable I/O copying deleted, garbage data into new blocks!
      </p>
      <br/>
      <strong class="text-emerald-400">The TRIM Solution:</strong>
      <p class="text-slate-300 mt-1">
        The OS executes the <code class="text-amber-300 text-[11px]">TRIM</code> (SATA) or <code class="text-amber-300 text-[11px]">Dataset Management: Deallocate</code> (NVMe) command, explicitly notifying the SSD controller: <em>"LBA blocks 50,000 to 52,000 are deleted."</em> The FTL marks those physical flash pages as invalid immediately, eliminating unnecessary GC copies and preventing catastrophic p99 tail latency spikes!
      </p>`
    }
  ];

  return `
    <div class="flex flex-col gap-8 max-w-5xl mx-auto select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 88, 89: WHY SSDS ARE FAST -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              6.2 Why SSDs Are Fast
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Solid-State Drives (<strong class="text-emerald-400">SSDs</strong>) outperform spinning Hard Disk Drives (<strong class="text-rose-400">HDDs</strong>) by several orders of magnitude not merely because they lack moving parts, but because of <strong class="text-cyan-400">massive internal channel parallelism</strong> and the electronic architecture of <strong class="text-white">NAND Flash Memory</strong>. However, flash memory exhibits a fundamental physical asymmetry: <strong class="text-amber-300">it reads and writes in Pages, but can only erase in Blocks</strong>.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">1. Zero Mechanical Seek Latency</span>
              <span class="text-[12px] text-slate-300">No mechanical arm, spindle, or rotating platters. Accessing any memory cell is an electronic operation measured in microseconds (~10–20μs on PCIe NVMe).</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">2. Multi-Channel Hardware Parallelism</span>
              <span class="text-[12px] text-slate-300">The SSD controller stripes I/O across 8 to 16 parallel channels connected to dozens of NAND flash dies simultaneously, delivering up to 14,000 MB/s throughput.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Concurrency Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              HARDWARE ARCHITECTURE: MULTI-CHANNEL CONTROLLER & FLASH ASYMMETRY
            </span>
            <span class="text-slate-500 text-[10.5px]">NAND Flash Physics</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. SSD CONTROLLER & PARALLEL CHANNEL ARCHITECTURE (NVMe PCIe 4.0/5.0)                            │
│                                                                                                  │
│   Host CPU ──► [ PCIe NVMe Bus (64,000 Queues) ]                                                 │
│                     │                                                                            │
│                     ▼                                                                            │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                              SSD CONTROLLER HARDWARE                                     │   │
│   │  [ DRAM Buffer Cache ] ──► [ Flash Translation Layer (FTL) ] ──► [ Wear Leveling Engine ]│   │
│   └──────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬─────────────────┘   │
│          │          │          │          │          │          │          │                     │
│          ▼ Ch 0     ▼ Ch 1     ▼ Ch 2     ▼ Ch 3     ▼ Ch 4     ▼ Ch 5     ▼ Ch 7 (Parallel)     │
│      ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│      │ NAND 0 │ │ NAND 1 │ │ NAND 2 │ │ NAND 3 │ │ NAND 4 │ │ NAND 5 │ │ NAND 7 │ (Concurrent)  │
│      └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘                │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. THE PHYSICAL FLASH ASYMMETRY: PAGES VS. ERASE BLOCKS                                          │
│                                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ ONE FLASH BLOCK (e.g. 2 MB – 8 MB) = Unit of Physical ERASE                              │   │
│   │ ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐             │   │
│   │ │ Page 0 (4KB) │ Page 1 (4KB) │ Page 2 (4KB) │ Page 3 (4KB) │ Page N (4KB) │             │   │
│   │ └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘             │   │
│   │   ▲ Unit of READ & WRITE                                                                 │   │
│   └──────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                  │
│   * The Iron Law of Flash: You CANNOT overwrite an existing page in-place!                       │
│     To update Page 0, the FTL writes Page 0 to a brand new erased page, marks old Page 0 as     │
│     "invalid", and updates its internal LBA ➔ PBA mapping table (Out-Of-Place Write).            │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- High-Signal Comparison Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">table_chart</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              Mechanical HDD vs. SATA SSD vs. NVMe SSD Performance Matrix
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-semibold">
                  <th class="py-3 px-4 w-[20%]">Hardware Metric</th>
                  <th class="py-3 px-4 w-[25%] text-rose-400">Spinning HDD (7200 RPM)</th>
                  <th class="py-3 px-4 w-[27%] text-amber-300">SATA SSD (AHCI)</th>
                  <th class="py-3 px-4 w-[28%] text-emerald-400">PCIe NVMe SSD (Flash)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] bg-[#0A0E1A]">
                ${comparisonMatrix.map(row => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-200 border-r border-[#24314A]/50 bg-[#0F172A]/40">
                      ${row.metric}
                    </td>
                    <td class="py-3 px-4 ${row.hddClass} border-r border-[#24314A]/50">
                      ${row.hdd}
                    </td>
                    <td class="py-3 px-4 ${row.sataClass} border-r border-[#24314A]/50">
                      ${row.sata}
                    </td>
                    <td class="py-3 px-4 ${row.nvmeClass}">
                      ${row.nvme}
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
            SENIOR PERSPECTIVE: WHY SEQUENTIAL I/O STILL MATTERS ON MODERN FLASH
          </span>
          <p class="text-[13px] font-sans text-emerald-100 leading-relaxed">
            A common misconception among software engineers is that because SSDs have no mechanical arm, <em>"random I/O and sequential I/O have identical performance."</em>
          </p>
          <p class="text-[12.5px] font-sans text-emerald-200/90 leading-relaxed pt-1">
            <strong>The Hardware Reality:</strong> While random <em>reads</em> are indeed fast on flash, random <em>writes</em> are destructive. Random writes scatter updates across thousands of erase blocks, leaving blocks filled with fragmented invalid pages. This triggers aggressive background Garbage Collection (GC), causing <strong>Write Amplification Factors of 5× to 10×</strong> and causing drive performance to throttle under load.
            <br/><br/>
            <strong>Architectural Takeaway:</strong> Systems built on sequential append-only writes (such as <em>Apache Kafka commit logs</em> or <em>RocksDB / Cassandra Log-Structured Merge Trees</em>) write contiguous pages that fill entire erase blocks. When data is deleted, entire blocks are freed cleanly, achieving near-perfect <strong>WAF ≈ 1.0</strong> and maximizing SSD throughput and lifespan.
          </p>
        </div>

        <!-- Orange Warning Box: Garbage Collection Latency Spike & TRIM -->
        <div class="bg-[#2A1608] border-l-4 border-[#F97316] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            PRODUCTION HAZARD: THE GARBAGE COLLECTION LATENCY CLIFF & THE "TRIM" COMMAND
          </span>
          <p class="text-[13px] font-sans text-amber-100 leading-relaxed">
            When an operating system deletes a file, it only clears filesystem metadata; it does not inform the disk controller that the underlying storage blocks are empty.
          </p>
          <p class="text-[12.5px] font-sans text-amber-200/90 leading-relaxed pt-1">
            <strong>The Catastrophe:</strong> As the drive nears capacity, the SSD controller assumes all deleted files are still active data. When a new write arrives and free blocks are exhausted, the SSD is forced to perform <strong>Synchronous Emergency Garbage Collection</strong> in the middle of user write requests—reading valid pages, writing them elsewhere, and erasing blocks before accepting new data! This creates devastating <strong>p99 tail latency spikes exploding from 20μs to 500ms+</strong>.
            <br/><br/>
            <strong>Production Defense:</strong> Always ensure the OS <strong class="text-white">TRIM</strong> (or NVMe Deallocate) command is active, and configure enterprise SSDs with <strong>10% to 20% Over-Provisioning (OP)</strong> so the FTL always maintains a buffer of pre-erased blocks.
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
            An SSD is fast because it eliminates mechanical seek times and utilizes parallel multi-channel controllers. However, flash memory's inability to overwrite in-place means random writes trigger severe write amplification and garbage collection stalls. In database design, sequential append-only writes (WAL, LSM-Trees) remain vastly superior to random page updates even on modern NVMe drives.
          </p>
        </div>

        <!-- Page 89 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 89</span>
        </div>

      </div>

    </div>
  `;
}
