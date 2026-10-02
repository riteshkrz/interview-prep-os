/**
 * 7.2 Why Kafka Is Fast - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 96, 97, and 98
 * from The Modern System Design Interview Guide.
 */

export function renderWhyKafkaIsFastContent(topic) {
  const architecturalPillars = [
    {
      pillar: "1. Sequential Disk I/O",
      mechanism: "Append-only commit logs. Disks (both HDDs and NVMe SSDs) achieve hundreds of MBs to GBs per second during linear sequential writes, completely avoiding mechanical arm seek time and SSD write amplification.",
      performanceGain: "~600 MB/s sequential disk writes vs. ~100 KB/s random seeks (often outperforming random RAM access).",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      pillar: "2. OS Page Cache Utilization",
      mechanism: "Zero in-process JVM message caching. Kafka writes directly to OS file descriptors; the Linux kernel automatically buffers all free physical memory as Page Cache. Eliminates JVM GC pauses and retains hot cache across broker restarts.",
      performanceGain: "Zero Stop-the-World GC sweeps on 256GB+ RAM instances; 100% cache warm-state preservation on process restart.",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      pillar: "3. Zero-Copy Network Transfer",
      mechanism: "Uses the Linux sendfile() syscall with network card DMA (Direct Memory Access) scatter-gather. Bypasses user-space JVM memory entirely, moving bytes directly from the OS Page Cache into the Network Interface Card (NIC).",
      performanceGain: "Reduces context switches from 4 to 2; reduces memory copies from 4 to 0 CPU copies. Operates at line speed.",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      pillar: "4. End-to-End Batching & Compression",
      mechanism: "Producers accumulate records into compressed batches (Snappy, LZ4, ZSTD) before sending. The broker stores and forwards compressed binary batches as-is without ever decompressing them; consumers perform decompression.",
      performanceGain: "Amortizes network packet and syscall overhead by 10×–50×; conserves cross-datacenter WAN bandwidth.",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const brokerArchitectureComparison = [
    {
      dimension: "Primary Storage Engine",
      traditional: "In-memory message queues (B-Tree or linked lists in RAM; paged to disk under pressure)",
      kafka: "Distributed append-only partitioned commit logs on disk (flat binary segment files)",
      kafkaHighlight: "text-emerald-400 font-bold"
    },
    {
      dimension: "Memory Management & Cache",
      traditional: "In-process JVM / application heap. Suffers from object overhead and Stop-the-World GC pauses",
      kafka: "Linux OS Kernel Page Cache. 0 bytes in JVM heap; no GC latency on hundreds of gigabytes",
      kafkaHighlight: "text-emerald-400 font-bold"
    },
    {
      dimension: "Network Transfer Path",
      traditional: "read() + write() copying bytes 4 times: Disk ──► Kernel ──► User JVM ──► Socket ──► NIC",
      kafka: "sendfile() Zero-Copy: Kernel transfers bytes directly from Page Cache to NIC via DMA",
      kafkaHighlight: "text-emerald-400 font-bold"
    },
    {
      dimension: "Disk I/O Access Pattern",
      traditional: "Random reads and deletes. Updating message states generates random block modifications",
      kafka: "Strictly sequential writes (O(1) append). Linear reads with OS kernel readahead prefetching",
      kafkaHighlight: "text-emerald-400 font-bold"
    },
    {
      dimension: "Message Payload Inspection",
      traditional: "Broker unpacks, parses headers, and evaluates complex topic/header routing rules",
      kafka: "Broker is completely dumb: treats message batches as opaque binary payloads",
      kafkaHighlight: "text-cyan-300 font-bold"
    },
    {
      dimension: "End-to-End Compression",
      traditional: "Broker often decompresses to inspect headers or re-compresses per connection",
      kafka: "Zero broker decompression: producer compresses batch; consumer decompresses",
      kafkaHighlight: "text-emerald-400 font-bold"
    },
    {
      dimension: "Throughput Ceiling per Node",
      traditional: "Tens of thousands of messages/sec (Bottlenecked by CPU context switches & GC)",
      kafka: "Millions of messages/sec (Saturates physical 10Gbps/25Gbps network interfaces)",
      kafkaHighlight: "text-emerald-400 font-bold"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Sequential Disk I/O vs. Random RAM Access: Hardware Physics & Cache Line Prefetching",
      answer: `This counter-intuitive hardware physics principle is central to Kafka's design:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Random Memory (RAM) Pointer Chasing:</strong> When CPU instructions jump randomly across gigabytes of memory (e.g. traversing linked lists, pointer-heavy Java objects), the CPU experiences cascading <strong>L1, L2, and L3 cache misses</strong>. Each cache miss stalls the CPU for ~50–100 nanoseconds waiting for a main memory bus cycle.</li>
        <li><strong>Sequential Disk Access & Hardware Prefetching:</strong> When data is read or written sequentially in a linear commit log:
          <br/>- <em>Spinning Disks (HDD):</em> The mechanical arm stays fixed on a track, completely eliminating the catastrophic 5–10 ms rotational seek delay. Sequential HDD throughput easily hits 150–200 MB/s.
          <br/>- <em>Solid-State Drives (NVMe SSD):</em> Linear writes stream across internal parallel NAND channels with zero block fragmentation or garbage collection churn, achieving 3+ GB/s throughput.
          <br/>- <em>OS Readahead:</em> The Linux kernel automatically detects sequential read patterns and aggressively prefetches subsequent disk blocks into the OS Page Cache before the application even asks for them.</li>
      </ul>`
    },
    {
      conceptId: "#02",
      title: "The Linux sendfile() Syscall: Zero-Copy Transfers via DMA Scatter-Gather Descriptors",
      answer: `In a traditional file transfer (<code>read()</code> followed by <code>write()</code>), data crosses the user-space boundary twice, causing <strong>4 context switches and 4 memory copies</strong> (2 DMA, 2 CPU).
      <br/><br/>
      With Linux <code>sendfile()</code>:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Context Switches:</strong> Reduced from 4 to <strong>2</strong> (one user-to-kernel switch to enter <code>sendfile()</code>, and one kernel-to-user switch on return).</li>
        <li><strong>Zero CPU Copies:</strong>
          <br/>1. The Disk Controller copies data from disk into the OS Page Cache via Direct Memory Access (DMA).
          <br/>2. With network card <strong>scatter-gather DMA support</strong>, the kernel does not even copy data from the Page Cache into the socket buffer. Instead, it merely passes a small <em>descriptor</em> (memory address and length) to the socket buffer.
          <br/>3. The Network Interface Card (NIC) reads data directly from the OS Page Cache in main memory via DMA and transmits it across the wire.
        <li><strong>Result:</strong> Zero bytes are copied by the CPU. The CPU is completely freed up to handle routing and TLS handshakes, operating at line speed.</li>
      </ul>`
    },
    {
      conceptId: "#03",
      title: "OS Page Cache Architecture vs. JVM Heap: Eliminating Stop-The-World GC Latency Spikes",
      answer: `Jay Kreps and the original Kafka designers rejected in-memory JVM caching due to three severe enterprise JVM flaws:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Memory Bloat & Object Overhead:</strong> Java objects carry heavy memory overhead. A 4-byte string or primitive can easily require 24–32 bytes of heap metadata and padding. Caching raw byte buffers in the OS Page Cache is 2× to 4× more space-efficient.</li>
        <li><strong>JVM Garbage Collection Pauses:</strong> Managing hundreds of gigabytes of messages in a JVM heap forces the garbage collector (G1, ZGC) to scan millions of short-lived objects, inevitably triggering Stop-the-World pauses that spike tail latency (p99/p99.9) from milliseconds to seconds. The OS Page Cache is managed in C by kernel page replacement algorithms (LRU) with zero GC impact.</li>
        <li><strong>Warm Cache Survival Across Restarts:</strong> When a Kafka broker process restarts (for configuration updates or rolling deployments), an in-process JVM cache is wiped clean, requiring hours to warm back up. Because the OS Page Cache lives in kernel memory, restarting the Kafka JVM leaves the entire cache 100% warm and untouched.</li>
      </ul>`
    },
    {
      conceptId: "#04",
      title: "End-to-End Batching & Compression Pipeline: Producer Accumulators to Broker Zero-Overhead",
      answer: `Kafka treats batching as a first-class citizen across the entire messaging lifecycle:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Producer Accumulator:</strong> Producers do not send messages individually. The Kafka producer buffers records in memory up to <code>batch.size</code> (e.g. 64 KB) or waits up to <code>linger.ms</code> (e.g. 5–20 ms). Multiple messages bound for the same partition are coalesced into a single <code>RecordBatch</code>.</li>
        <li><strong>Client-Side Compression:</strong> The producer compresses the entire RecordBatch using efficient block algorithms (LZ4, ZSTD, Snappy). Compressing a batch of 1,000 JSON messages achieves 80–90% compression ratios because repeated JSON keys across records are eliminated.</li>
        <li><strong>Zero-Broker Overhead:</strong> The broker receives the compressed RecordBatch and appends it to the partition segment file <em>without decompressing or verifying inner records</em>. The broker's CPU usage remains near zero.</li>
        <li><strong>Consumer Decompression:</strong> Downstream consumers receive the compressed batch over the wire and decompress it in their own application memory, amortizing CPU overhead across client nodes rather than bottlenecking the shared broker cluster.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 96: THE 4 ARCHITECTURAL PILLARS OF KAFKA SPEED -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              7.2 Why Kafka Is Fast
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Hyperscale Messaging Physics · Sequential Disk I/O, OS Page Cache, sendfile() Zero-Copy & Batch Compression
          </p>
        </div>

        <!-- Overview & Philosophy -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE CORE PHILOSOPHY: DESIGN WITH THE OS, NOT AGAINST IT
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Most distributed systems fight the operating system by implementing complex in-process memory caches, custom disk flushing algorithms, and application-layer serialization buffers. Apache Kafka achieves millions of messages per second on commodity hardware by doing the exact opposite: <strong>delegating caching, prefetching, and network transfers entirely to the Linux kernel primitives</strong>.
          </p>
        </div>

        <!-- The 4 Pillars Grid -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            The Four Architectural Pillars of Kafka's Throughput
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            ${architecturalPillars.map(p => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2.5">
                <span class="font-code text-[12px] font-bold text-white flex items-center justify-between">
                  <span>${p.pillar}</span>
                  <span class="px-2 py-0.5 rounded text-[10.5px] border ${p.badgeColor}">Core Mechanism</span>
                </span>
                <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                  ${p.mechanism}
                </p>
                <div class="pt-2 border-t border-[#24314A]/60 font-code text-[11.5px] text-cyan-300">
                  ⚡ ${p.performanceGain}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Official Page 96 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 96</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 97: ZERO-COPY ARCHITECTURE DIAGRAM & COMPARISON MATRIX -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-[#6366F1] rounded-sm shrink-0"></div>
          <h3 class="font-sans text-[17px] sm:text-[19px] font-bold text-white tracking-tight">
            The Zero-Copy Data Path: Traditional vs. Linux sendfile()
          </h3>
        </div>

        <!-- ASCII Architecture Comparison -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              DATA PATH COMPARISON: 4 COPIES VS. ZERO-COPY DMA
            </span>
            <span class="text-[11px] font-code text-slate-500">Kernel vs. User Space Context Switches</span>
          </div>

          <!-- ASCII Flow Diagram -->
          <div class="p-4 bg-[#070B14] rounded-lg border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
            <pre class="font-code text-slate-300">
+-------------------------------------------------------------------------------------------------------------+
|                                    TRADITIONAL READ/WRITE NETWORK TRANSFER                                   |
|                             [ 4 Context Switches · 4 Data Copies (2 CPU, 2 DMA) ]                           |
+-------------------------------------------------------------------------------------------------------------+

  USER SPACE (JVM):                           [ Application Buffer in JVM Heap ]
                                                 ▲                          │
                       2. CPU Copy to User Space │                          │ 3. CPU Copy to Socket
                                                 │                          ▼
  KERNEL SPACE:       [ OS Page Cache (Kernel) ] ┼──────────────────────────┼──► [ Socket Buffer (Kernel) ]
                             ▲                                                              │
               1. DMA Copy   │                                                4. DMA Copy   │
                             │                                                              ▼
  HARDWARE:           [ DISK / NVMe Storage ]                                        [ Network Card (NIC) ]

  ▲ Context Switch 1: read() trap from User to Kernel      ▲ Context Switch 3: write() trap from User to Kernel
  ▲ Context Switch 2: read() returns to User               ▲ Context Switch 4: write() returns to User
  ▲ TOTAL COST: 4 Context Switches + 2 Heavy CPU Memory Copies!

=============================================================================================================

+-------------------------------------------------------------------------------------------------------------+
|                                      KAFKA ZERO-COPY SENDFILE() DATA PATH                                   |
|                             [ 2 Context Switches · 0 CPU Copies · Hardware DMA Line Speed ]                 |
+-------------------------------------------------------------------------------------------------------------+

  USER SPACE (JVM):   [ Kafka Broker Process ] ─── sendfile(socket, file, offset, len) ───┐
                                                                                           │
                                  [ ZERO USER-SPACE BUFFERING / ZERO CPU COPIES ]          │ (Only 2 Context
                                                                                           │  Switches Total!)
  KERNEL SPACE:       [ OS Page Cache (Kernel) ] ─── Scatter-Gather Descriptors ───┐       │
                             ▲                                                     │       │
               1. DMA Copy   │                                                     ▼       ▼
  HARDWARE:           [ DISK / NVMe Storage ] ──────── Direct DMA Read ────────► [ Network Card (NIC) ]

  ▲ Context Switch 1: sendfile() syscall from User to Kernel
  ▲ Context Switch 2: sendfile() completes and returns to User
  ▲ TOTAL COST: 2 Context Switches + ZERO CPU Copies (Data transfers directly from RAM to NIC via DMA!)</pre>
          </div>
        </div>

        <!-- Architectural Comparison Table: Traditional Broker vs. Kafka -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DEEP ARCHITECTURAL COMPARISON: TRADITIONAL BROKERS VS. APACHE KAFKA
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Architectural Dimension</th>
                  <th class="p-3.5">Traditional Brokers (RabbitMQ / ActiveMQ)</th>
                  <th class="p-3.5">Apache Kafka Architecture</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${brokerArchitectureComparison.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">${row.dimension}</td>
                    <td class="p-3.5 text-slate-300 font-sans leading-relaxed">${row.traditional}</td>
                    <td class="p-3.5 ${row.kafkaHighlight} font-sans leading-relaxed">${row.kafka}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Official Page 97 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 97</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 98: CALLOUTS, ARCHITECTURAL DEEP-DIVES & KEY TAKEAWAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Green Callout: Senior Perspective: Designing with the OS -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: DESIGNING WITH THE OPERATING SYSTEM INSTEAD OF FIGHTING IT
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            The genius of Kafka is not that it invented exotic new algorithms, but that it <strong>refused to reinvent what the Linux kernel already does best</strong>. The operating system kernel has spent forty years optimizing disk block caching, page eviction (LRU), read-ahead prefetching, and hardware DMA networking. By treating the filesystem as an append-only ring buffer and trusting the OS Page Cache, Kafka achieved 10× higher throughput than competitors while requiring a fraction of the codebase complexity. In interviews, praise architectures that exploit kernel primitives over complex application-tier abstractions.
          </p>
        </div>

        <!-- Orange Callout: When Zero-Copy Breaks -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            WHEN ZERO-COPY BREAKS: THE TLS/SSL ENCRYPTION & TRANSFORMATION PENALTY
          </span>
          <p class="text-[13px] text-amber-200/90 leading-relaxed font-sans">
            Staff engineers understand the boundary conditions of Zero-Copy: <strong>sendfile() requires passing bytes unaltered directly from kernel buffer to network device</strong>. If you enable TLS/SSL wire encryption between the Kafka broker and consumers, or if you configure a broker-side message interceptor to transform headers, the CPU <em>must</em> copy the ciphertext into user-space memory to run encryption/decryption routines before passing it to the network socket. Enabling TLS on a high-throughput cluster typically causes a <strong>20–35% CPU spike and disables pure zero-copy DMA transfers</strong> (mitigated in modern datacenters by using TLS hardware offload cards or keeping traffic unencrypted inside private VPC subnets with network-layer encryption).
          </p>
        </div>

        <!-- Page Cache Sizing Architectural Study -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            PRODUCTION FORMULA
          </span>
          <span class="text-slate-300 font-medium">
            <strong>Linux Page Cache Sizing Formula:</strong> To prevent cold disk reads when consumers fall behind during minor outages: <code class="text-cyan-300 font-code text-[11px]">RAM_needed = Ingress_Throughput (MB/s) * Max_Tolerable_Lag (Seconds) * Safety_Margin (1.3)</code>. For 100 MB/s ingress and 1-hour lag tolerance, provision $100 \times 3600 \times 1.3 \approx 468\text{ GB}$ of RAM across the broker cluster dedicated to Page Cache.
          </span>
        </div>

        <!-- CRITICAL ARCHITECTURAL DEEP-DIVES Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              CRITICAL ARCHITECTURAL DEEP-DIVES &amp; DISTRIBUTED EDGE CASES
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${architecturalDeepDives.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-cyan-400 shrink-0 pt-0.5">${item.conceptId}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.title}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-6 flex flex-col gap-2.5 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[14px] font-sans font-medium text-white leading-relaxed">
            Kafka is fast because it only appends (sequential disk I/O), never copies through user-space memory (zero-copy sendfile with DMA), batches aggressively end-to-end, and lets the Linux OS Page Cache handle message buffering instead of fighting the JVM garbage collector. When asked why Kafka scales to millions of events/sec, articulate these four pillars immediately.
          </p>
        </div>

        <!-- Official Page 98 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 98</span>
        </div>

      </div>

    </div>
  `;
}
