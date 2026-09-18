/**
 * 4.12 Big Data: The Papers and the Evolution - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 75 and 76
 * from The Modern System Design Interview Guide.
 */

export function renderBigDataEvolutionContent(topic) {
  const bigDataLineage = [
    {
      paper: "1. Google File System (GFS, 2003)",
      openSourceSuccessor: "Apache Hadoop HDFS, Cloud Object Stores (S3/GCS)",
      coreInnovation: "64MB chunkservers, single master with metadata in RAM, append-only fault tolerance on commodity hardware.",
      impact: "Proved software could provide 99.999% reliability on cheap, failing hardware."
    },
    {
      paper: "2. Google MapReduce (2004)",
      openSourceSuccessor: "Hadoop MapReduce → Apache Spark (In-memory DAGs)",
      coreInnovation: "Functional programming abstraction: Map → Shuffle & Sort → Reduce. Moving computation to data.",
      impact: "Democratized parallel processing across thousands of CPU cores without threading bugs."
    },
    {
      paper: "3. Google Bigtable (2006)",
      openSourceSuccessor: "Apache HBase, Apache Cassandra, ScyllaDB",
      coreInnovation: "Sparse, distributed, multi-dimensional sorted map indexed by (row_key, column_key, timestamp).",
      impact: "Spawned the NoSQL revolution: wide-column stores scaling writes horizontally across data centers."
    },
    {
      paper: "4. Google Dremel (2010)",
      openSourceSuccessor: "Apache Drill, Presto / Trino, Google BigQuery",
      coreInnovation: "Columnar nested storage (Cap'n Proto / Parquet) with multi-level execution trees.",
      impact: "Reduced multi-hour batch SQL queries over petabytes down to interactive sub-second responses."
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What was the truly revolutionary contribution of Google's 2004 MapReduce paper?",
      answer: `Prior to MapReduce, distributed computing required manual socket programming, explicit message passing (MPI), and custom hardware lockstep clustering. A single machine crash in a 500-node cluster doomed the entire computation.
      <br/><br/>
      <strong class="text-indigo-400">The MapReduce Breakthrough:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Moving Compute to Data:</strong> Instead of dragging petabytes of data across the network to compute nodes, the master scheduler assigns map tasks to the exact physical chunkservers holding the data locally on disk (data locality).</li>
        <li><strong>Deterministic Functional Abstraction:</strong> Developers wrote two pure functions: <code>map(k1, v1) -&gt; list(k2, v2)</code> and <code>reduce(k2, list(v2)) -&gt; list(v3)</code>. The framework transparently handled parallelization, network shuffle, and disk spilling.</li>
        <li><strong>Transparent Failure Recovery:</strong> If a worker node died mid-job, the master simply reassigned its intermediate map tasks to another worker. The developer never had to write a single line of recovery code.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "Why did Apache Spark completely replace MapReduce in modern big data pipelines?",
      answer: `MapReduce had one fatal architectural flaw: <strong>Disk I/O Bottlenecks between Pipeline Stages</strong>.
      <br/><br/>
      <strong class="text-indigo-400">MapReduce Disk Shuffle Penalty:</strong>
      <br/>
      Every MapReduce job wrote its intermediate shuffle outputs to physical disk (HDFS) and replicated them across the network. A multi-stage pipeline (e.g. 10 consecutive MapReduce jobs) forced 10 rounds of disk write, network serialize, and disk read cycles.
      <br/><br/>
      <strong class="text-emerald-400">The Apache Spark Revolution:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Resilient Distributed Datasets (RDDs):</strong> Spark keeps intermediate transformation stages directly in memory (RAM). Subsequent transformations pipeline in RAM without ever touching physical disk.</li>
        <li><strong>Directed Acyclic Graph (DAG) Engine:</strong> Spark builds an execution plan across the entire pipeline before running, allowing its optimizer (Catalyst) to fuse operations, filter early, and eliminate redundant shuffles.</li>
        <li><strong>Speed:</strong> Spark runs iterative machine learning and multi-stage queries up to <strong>100x faster in memory</strong> and 10x faster on disk than Hadoop MapReduce.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "Lambda Architecture vs. Kappa Architecture: Why did modern enterprise data platforms migrate to Kappa?",
      answer: `The **Lambda Architecture** (Nathan Marz) attempted to solve the latency vs. completeness problem by maintaining two parallel processing tracks:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Batch Layer (Hadoop/Spark):</strong> Computes accurate, complete master views over petabytes every 24 hours.</li>
        <li><strong>Speed Layer (Storm/Flink):</strong> Computes low-latency real-time delta approximations over the latest streaming data.</li>
        <li><strong>Serving Layer (HBase/Cassandra):</strong> Merges batch and speed views at query time.</li>
      </ul>
      <br/>
      <strong class="text-rose-400">The Fatal Flaw of Lambda:</strong>
      <br/>
      Developers had to write, debug, and maintain <strong>two completely separate codebases</strong> (one in MapReduce/Spark for batch, one in Storm/Flink for streaming) implementing the exact same business logic! Discrepancies between batch and streaming results were an operational nightmare.
      <br/><br/>
      <strong class="text-emerald-400">The Kappa Architecture (Jay Kreps):</strong>
      <br/>
      <em>"Everything is a stream; batch is just a stream with a bounded end."</em>
      Kappa uses a single append-only distributed log (Apache Kafka / Apache Pulsar) as the permanent record, and a single stream processing engine (Apache Flink / Spark Structured Streaming). If you need to recompute 3 years of historical data with new business logic, you simply spin up a new consumer and rewind the Kafka offset to the beginning! One codebase, one deployment, zero synchronization drift.`,
    },
    {
      qNum: "Q4",
      question: "What is the grand historical narrative of distributed data systems over the last 20 years?",
      answer: `Big data history is a grand pendulum swing: <strong>giving up guarantees for scale, and then systematically buying those guarantees back</strong>:
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>The Sacrifice (2000–2010):</strong> Faced with web-scale data volumes, engineers abandoned relational ACID transactions, SQL joins, and strict schemas to create barebones distributed stores (MapReduce, GFS, Bigtable, early Cassandra). Systems were fast but painful to program.</li>
        <li><strong>The Rebuilding of SQL (2010–2016):</strong> Writing raw MapReduce Java jobs was unsustainable. The industry built SQL layers on top of distributed storage: Hive, Impala, Presto, Spark SQL, and BigQuery.</li>
        <li><strong>The Return of ACID (2016–Present):</strong> Unbounded eventual consistency caused real-world business corruption. Google built <strong>Spanner</strong> (combining TrueTime atomic clocks with Paxos to restore linearizable ACID transactions globally). In data lakes, open table formats like <strong>Apache Iceberg</strong> and <strong>Delta Lake</strong> brought full ACID transactions, snapshot isolation, and time-travel back to S3.</li>
      </ol>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 75, 76: BIG DATA - THE PAPERS AND THE EVOLUTION -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.12 Big Data: The Papers and the Evolution
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Every modern distributed system—from Kubernetes and Kafka to Cassandra and Snowflake—traces its architectural DNA to <strong class="text-indigo-400">Google's foundational whitepaper trilogy (2003–2006)</strong>. By abandoning expensive proprietary mainframes and proving that commodity PC clusters could achieve massive fault tolerance in software, these papers inaugurated the Big Data era.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">1. GFS (2003) · Storage</span>
              <span class="text-[12px] text-slate-300">Chunk-based distributed file system. 64MB blocks replicated $3\\times$. Master coordinates metadata; data streams directly from chunkservers.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. MapReduce (2004) · Compute</span>
              <span class="text-[12px] text-slate-300">Moving compute to data. Automatic sharding, network shuffling, and transparent task re-execution on node failure.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">3. Bigtable (2006) · Serving</span>
              <span class="text-[12px] text-slate-300">Sparse multidimensional sorted map. Tablets mapped to SSTables on GFS. The architectural parent of Cassandra and HBase.</span>
            </div>
          </div>
        </div>

        <!-- Lineage Tree & Architecture Comparison Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              PROCESSING ARCHITECTURES: LAMBDA (DUAL PATH) VS. KAPPA (UNIFIED STREAM)
            </span>
            <span class="text-slate-500 text-[10.5px]">Architecture Evolution</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. THE LAMBDA ARCHITECTURE (The Dual-Codebase Headache)                                          │
│                                                                                                  │
│                 ┌──► [ Batch Layer (HDFS / Spark) ] ──► [ Batch Views ] ────────┐                │
│                 │    (Accurate, complete, but 24h latency!)                     │                │
│   New Data ─────┤                                                               ├──► [ Queries ] │
│                 │                                                               │    (Merged!)   │
│                 └──► [ Speed Layer (Storm / Flink) ] ─► [ Real-Time Views ] ────┘                │
│                      (Sub-second, but approximation! Dual codebases to maintain!)                │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. THE KAPPA ARCHITECTURE (Everything is a Stream!)                                              │
│                                                                                                  │
│   New Data ──► [ Permanent Append-Only Log ] ──► [ Stream Processing Engine ] ──► [ Serving ]    │
│                (Apache Kafka / Apache Pulsar)    (Apache Flink / Spark Streaming) (Elastic/Click)│
│                                                                                                  │
│   Historical Reprocessing: To update business logic, simply deploy a new streaming consumer     │
│   and replay the Kafka log from Offset 0! Single codebase. Single unified logic. Zero drift.     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: The Google Trilogy Lineage -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              The Google Paper Trilogy & Open Source Lineage
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Original Paper</th>
                  <th class="p-3">Open Source Successor</th>
                  <th class="p-3">Core Architectural Innovation</th>
                  <th class="p-3">Industry Impact</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${bigDataLineage.map(b => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">${b.paper}</td>
                    <td class="p-3 text-indigo-300 font-code text-[11.5px]">${b.openSourceSuccessor}</td>
                    <td class="p-3 text-slate-300 text-[12px]">${b.coreInnovation}</td>
                    <td class="p-3 text-emerald-400 text-[12px]">${b.impact}</td>
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
            SENIOR PERSPECTIVE: THE MODERN LAKEHOUSE & ACID TABLE FORMATS
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In modern data engineering interviews, demonstrate that you know where the industry landed after MapReduce and Hadoop: <strong class="text-emerald-300">The Modern Data Lakehouse</strong>.
            </p>
            <p>
              Traditional data lakes (raw JSON or Parquet on S3) suffered from missing ACID transactions: concurrent writes corrupted datasets, and deletes (for GDPR compliance) required rewriting entire partitions. The modern standard uses open table formats like <strong class="text-white">Apache Iceberg</strong> and <strong class="text-white">Delta Lake</strong> on top of cheap object storage (S3). Iceberg provides <strong>full ACID transactions, serializable snapshot isolation, schema evolution, and time-travel queries</strong> without paying proprietary warehouse storage markups.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - EVENT TIME VS. PROCESSING TIME -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            STREAMING PITFALL: EVENT TIME VS. PROCESSING TIME & WATERMARKS
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              When processing real-time event streams (clickstream, sensor events, mobile payments), <strong class="text-white">Processing Time</strong> is when the event arrives at your server, while <strong class="text-white">Event Time</strong> is when the event physically occurred on the user's device.
            </p>
            <p>
              On cellular networks or during offline mobile usage, packets can arrive <strong>hours out of order</strong>. If you calculate hourly billing or fraud detection using Processing Time, your metrics will be completely skewed.
            </p>
            <p>
              <strong class="text-amber-300">Senior Solution:</strong> Always window over <strong>Event Time</strong> and implement <strong class="text-white">Watermarks</strong> in Apache Flink or Spark. A watermark is a temporal threshold stating <em>"we believe all events prior to timestamp T have arrived."</em> It allows the engine to close windows and compute final results while routing delayed packets to a late-arriving dead-letter queue.
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
            Big data history is a story of giving up ACID guarantees for horizontal scale, then systematically engineering those guarantees back in. In production interviews, advocate for the unified Kappa Architecture (Kafka log + Flink streaming) over complex dual-codebase Lambda architectures, window strictly over Event Time with watermarks, and leverage open ACID lakehouse formats like Apache Iceberg.
          </p>
        </div>

        <!-- Page 76 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 76</span>
        </div>

      </div>

    </div>
  `;
}
