/**
 * 6.2 Message Queue Paradigms: RabbitMQ vs. Apache Kafka - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 79 and 80
 * from The Modern System Design Interview Guide.
 */

export function renderRabbitMqVsKafkaContent(topic) {
  const comparisonMatrix = [
    {
      dimension: "Architectural Paradigm",
      rabbitmq: "Smart Broker / Dumb Consumer: Broker tracks state, manages delivery & ACKs",
      rabbitmqClass: "text-amber-400 font-bold",
      kafka: "Dumb Broker / Smart Consumer: Append-only log; consumers manage own offsets",
      kafkaClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Data Storage Model",
      rabbitmq: "Ephemeral message queues (in RAM, paged to disk if memory pressure occurs)",
      rabbitmqClass: "text-slate-300",
      kafka: "Distributed partitioned commit log (persisted sequentially to disk/page cache)",
      kafkaClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Routing Capabilities",
      rabbitmq: "Extremely rich: Direct, Fanout, Topic (wildcards *.#), and Headers exchanges",
      rabbitmqClass: "text-emerald-400 font-bold",
      kafka: "Primitive: Topic + Partition Key hashing (murmur2(key) % partitions)",
      kafkaClass: "text-slate-400"
    },
    {
      dimension: "Message Deletion & Lifespan",
      rabbitmq: "Destructive read: Message is deleted immediately once consumer sends ACK",
      rabbitmqClass: "text-rose-400 font-bold",
      kafka: "Retention-based: Messages retained for days/weeks/indefinitely regardless of consumption",
      kafkaClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Message Replayability",
      rabbitmq: "Impossible: Once acknowledged, the message is permanently gone",
      rabbitmqClass: "text-rose-400 font-bold",
      kafka: "Native: Any consumer group can rewind its offset to any historical timestamp",
      kafkaClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Peak Throughput",
      rabbitmq: "Tens of thousands of msgs/sec (~20K–50K ops/sec per node)",
      rabbitmqClass: "text-slate-400",
      kafka: "Millions of msgs/sec (~1M+ ops/sec per multi-node broker cluster)",
      kafkaClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Consumption Model",
      rabbitmq: "Push-based: Broker pushes messages to connected workers up to prefetch limit",
      rabbitmqClass: "text-slate-300",
      kafka: "Pull-based: Consumers poll batches at their own pace (natural backpressure)",
      kafkaClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Message Ordering",
      rabbitmq: "FIFO per queue, but broken when competing consumers process concurrently",
      rabbitmqClass: "text-amber-400 font-bold",
      kafka: "Strict FIFO guaranteed per partition; strict ordering per entity key",
      kafkaClass: "text-emerald-400 font-bold"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Partition-Level Ordering vs. Global Total Ordering: Murmur2 Hashing and Bottlenecks",
      answer: `Kafka guarantees <strong>strict FIFO ordering only within a single partition</strong>, never globally across the entire topic.
      <br/><br/>
      <strong class="text-cyan-400">Ordering Mechanics & Scaling Tradeoffs:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Partition Key Hashing:</strong> When producing messages, supply a partition key (e.g., <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">user_id</code>, <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">account_id</code>). Kafka applies a consistent hash (<code class="text-amber-300 bg-black/40 px-1 py-0.5 rounded">murmur2(key) % num_partitions</code>) to guarantee all events for that specific entity always route to the exact same partition.</li>
        <li><strong>Consumer Assignment:</strong> Within a Consumer Group, each partition is consumed by <strong>exactly one consumer thread</strong> at any given time. This guarantees strict sequential processing per entity.</li>
        <li><strong>The Global Ordering Trap:</strong> If an architecture requires <em>global ordering across all events in a topic</em>, you must configure the topic with <strong>exactly 1 partition</strong>. This bottlenecks the entire topic to a single consumer instance, capping throughput to ~5,000–10,000 msgs/sec and completely destroying horizontal scalability.</li>
      </ul>`
    },
    {
      conceptId: "#02",
      title: "Kafka Log Compaction Internals: State Retention vs. Time-Based Segments and Tombstones",
      answer: `By default, Kafka deletes records older than a retention threshold (e.g., <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">log.retention.hours=168</code> / 7 days). <strong>Log Compaction</strong> provides a fundamentally different retention strategy based on state rather than time.
      <br/><br/>
      <strong class="text-cyan-400">How Log Compaction Operates:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Kafka's background cleaner thread periodically scans log segment files and <strong>removes older duplicate records with identical keys</strong>, retaining only the most recent value for each key.</li>
        <li>If a message is published with a specific key and a <code class="text-rose-400 bg-black/40 px-1 py-0.5 rounded">null</code> payload (known as a <strong>Tombstone</strong>), the cleaner eventually deletes the key entirely after a configurable grace period (<code class="text-slate-300 bg-black/40 px-1 py-0.5 rounded">delete.retention.ms</code>).</li>
        <li><strong>Ideal Use Cases:</strong> Database Change Data Capture (CDC) streams (Debezium), restoring in-memory state caches (Kafka Streams <code class="text-emerald-300 bg-black/40 px-1 py-0.5 rounded">KTable</code>), and user profile / account balance state restoration where you only care about the latest current state.</li>
      </ul>`
    },
    {
      conceptId: "#03",
      title: "Strategic Selection Criteria: Why and When to Deploy RabbitMQ Over Apache Kafka",
      answer: `While Kafka dominates big data and event streams, RabbitMQ is deliberately chosen for transactional workflows and task scheduling:
      <br/><br/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-amber-300 block mb-1">1. Complex Dynamic Routing</strong>
          <span class="text-slate-300 text-[12px]">RabbitMQ supports AMQP Topic Exchanges with wildcard matching (<code class="text-cyan-300 text-[11px]">europe.orders.*</code>) and Headers Exchanges. Routing topologies can be altered dynamically in runtime without recompiling code or re-partitioning topics.</span>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-cyan-300 block mb-1">2. Per-Message Granular ACKs & Priority</strong>
          <span class="text-slate-300 text-[12px]">RabbitMQ allows individual workers to reject or dead-letter a specific message (<code class="text-rose-300 text-[11px]">basic.nack</code>) while processing other messages. It also has native support for <strong>Priority Queues (0-255)</strong>, which Kafka cannot do natively.</span>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-emerald-300 block mb-1">3. Long-Running Asynchronous Tasks</strong>
          <span class="text-slate-300 text-[12px]">Ideal for task runners (Celery, Sidekiq) executing heavy jobs (PDF rendering, video transcoding) lasting minutes to hours. In Kafka, slow processing causes consumer heartbeat timeouts and triggers rebalances.</span>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-indigo-300 block mb-1">4. Operational Simplicity at Moderate Scale</strong>
          <span class="text-slate-300 text-[12px]">For workloads under 50,000 QPS, RabbitMQ is lighter to deploy, manage, and monitor than a multi-broker Kafka cluster with KRaft / ZooKeeper quorum consensus.</span>
        </div>
      </div>`
    },
    {
      conceptId: "#04",
      title: "Kafka Exactly-Once Semantics (EOS): Idempotent Producer PIDs and Transactional Coordinator 2PC",
      answer: `In distributed systems, true end-to-end Exactly-Once processing requires coordinating two distinct mechanisms:
      <br/><br/>
      <strong class="text-cyan-400">The Two Pillars of Kafka Exactly-Once Semantics:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Idempotent Producers (<code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">enable.idempotence=true</code>):</strong> The broker assigns each producer a 64-bit <strong>Producer ID (PID)</strong>. Every message sent to a partition includes a monotonically increasing <strong>Sequence Number</strong>. If a network timeout causes the producer to re-send a batch, the broker recognizes the already-committed sequence number and silently drops the duplicate.</li>
        <li><strong>Transactional API (Consume-Transform-Produce):</strong> Kafka uses an internal <strong>Transaction Coordinator</strong> and transaction log topic (<code class="text-amber-300 bg-black/40 px-1 py-0.5 rounded">__transaction_state</code>). A two-phase commit atomically binds the produced output messages across multiple partitions with the consumer's offset commit. If the application crashes halfway through, uncommitted batches are discarded by downstream transactional consumers (<code class="text-emerald-300 bg-black/40 px-1 py-0.5 rounded">isolation.level=read_committed</code>).</li>
      </ol>`
    }
  ];

  return `
    <div class="flex flex-col gap-8 max-w-5xl mx-auto select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 79, 80: RABBITMQ VS. APACHE KAFKA -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              6.2 Message Queue Paradigms: RabbitMQ vs. Apache Kafka
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Engineers frequently treat <strong class="text-amber-300">RabbitMQ</strong> and <strong class="text-emerald-400">Apache Kafka</strong> as interchangeable message queues. In reality, they represent radically divergent paradigms: RabbitMQ is a traditional <strong class="text-white">Smart Broker / Dumb Consumer</strong> implementing the AMQP protocol with ephemeral queues, while Kafka is a distributed, partitioned <strong class="text-indigo-400">Append-Only Commit Log</strong> designed for high-throughput stream processing and multi-consumer event replay.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">1. RabbitMQ: The Smart Broker</span>
              <span class="text-[12px] text-slate-300">Tracks message acknowledgment per consumer; deletes message once ACKed. Complex routing via Direct, Topic, Fanout, and Headers exchanges. Ideal for task queues and microservice RPC.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">2. Apache Kafka: The Distributed Commit Log</span>
              <span class="text-[12px] text-slate-300">Broker stores immutable records sequentially on disk; does zero state tracking per consumer. Consumers manage their own partition offsets, enabling multi-tenant fanout and historical event replay.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Concurrency Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              ARCHITECTURAL TOPOLOGIES: AMQP EXCHANGES VS. PARTITIONED COMMIT LOG
            </span>
            <span class="text-slate-500 text-[10.5px]">Broker Internals</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. RABBITMQ: SMART BROKER / AMQP EXCHANGE ROUTING                                                │
│                                                                                                  │
│   Producer ──► [ Exchange (Topic/Direct) ]                                                       │
│                     │                                                                            │
│                     ├── Routing Key: "eu.orders.*"  ──► [ Queue A ] ──► [ Worker 1 ] (ACK ──► Del) │
│                     └── Routing Key: "us.orders.#"  ──► [ Queue B ] ──► [ Worker 2 ] (ACK ──► Del) │
│                                                                                                  │
│   * Broker State: Maintains queues in memory; tracks ACK/NACK per message.                       │
│     Once worker ACKs message, it is permanently deleted. Destructive read!                       │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. APACHE KAFKA: DUMB BROKER / DISTRIBUTED PARTITIONED COMMIT LOG                                │
│                                                                                                  │
│   Producer ──► Partition Key ("user_42") ──► murmur2(key) % 3 ──► Partition 1                   │
│                                                                                                  │
│   Topic: "order-events"                                                                          │
│   ┌────────────────────────────────────────────────────────────────────────┐                     │
│   │ Partition 0: [ 0 ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ] (Head) │                     │
│   │ Partition 1: [ 0 ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ]         (Head) │                     │
│   │ Partition 2: [ 0 ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ]    (Head) │                     │
│   └────────────────────────────────────────────────────────────────────────┘                     │
│                            ▲                   ▲                  ▲                              │
│                            │                   │                  │                              │
│                [ Consumer Group A: Billing ]   │   [ Consumer Group C: Audit / Replay ]          │
│                (Reads at Offset 3)             │   (Rewinds to Offset 0 to reprocess history!)   │
│                                                │                                                 │
│                                [ Consumer Group B: Fraud Detection ]                             │
│                                (Reads at Offset 7 in real-time)                                  │
│                                                                                                  │
│   * Broker State: Zero tracking! Messages retained on disk for 7 days. Independent consumer      │
│     groups pull at their own velocity and commit their own offsets (__consumer_offsets).         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- High-Signal Comparison Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">table_chart</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              RabbitMQ vs. Apache Kafka Architectural Matrix
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-semibold">
                  <th class="py-3 px-4 w-[20%]">System Dimension</th>
                  <th class="py-3 px-4 w-[40%] text-amber-400">RabbitMQ (Smart Broker)</th>
                  <th class="py-3 px-4 w-[40%] text-emerald-400">Apache Kafka (Commit Log)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] bg-[#0A0E1A]">
                ${comparisonMatrix.map(row => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-200 border-r border-[#24314A]/50 bg-[#0F172A]/40">
                      ${row.dimension}
                    </td>
                    <td class="py-3 px-4 ${row.rabbitmqClass} border-r border-[#24314A]/50">
                      ${row.rabbitmq}
                    </td>
                    <td class="py-3 px-4 ${row.kafkaClass}">
                      ${row.kafka}
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
            SENIOR PERSPECTIVE: WHY KAFKA IS BLINDINGLY FAST (THE THREE LOW-LEVEL PILLARS)
          </span>
          <p class="text-[13px] font-sans text-emerald-100 leading-relaxed">
            Candidates often state Kafka is fast because it is "distributed." In high-level architecture interviews, senior staff candidates explain the three low-level OS mechanisms that enable Kafka to push millions of messages per second on standard commodity hardware:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-[12px] font-sans">
            <div class="bg-black/40 p-2.5 rounded border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-emerald-300 font-bold">1. Sequential Disk I/O</strong>
              <span class="text-slate-300">Random memory access is slower than sequential disk I/O. Kafka writes strictly by appending to the end of partition segment files (<code class="text-cyan-300 text-[10.5px]">.log</code>), avoiding random disk head seeks.</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-emerald-300 font-bold">2. OS Page Cache Leverage</strong>
              <span class="text-slate-300">Kafka bypasses Java JVM heap allocation for cached data, writing directly to the Linux Page Cache. This eliminates JVM Garbage Collection pauses and prevents double-memory caching.</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-emerald-300 font-bold">3. Zero-Copy Transfer (sendfile)</strong>
              <span class="text-slate-300">Standard systems copy Disk ➔ Page Cache ➔ User Space JVM ➔ Socket Buffer ➔ NIC. Kafka uses the Linux <code class="text-amber-300 text-[10.5px]">sendfile()</code> syscall, transferring data directly from Page Cache to NIC Buffer with zero JVM copies.</span>
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: Eager Consumer Rebalance Trap -->
        <div class="bg-[#2A1608] border-l-4 border-[#F97316] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            PRODUCTION HAZARD: THE KAFKA EAGER CONSUMER REBALANCE "STOP-THE-WORLD" PAUSE
          </span>
          <p class="text-[13px] font-sans text-amber-100 leading-relaxed">
            By default in older Kafka clusters, when any consumer node joins or departs a Consumer Group (or experiences a brief network blip exceeding <code class="text-white bg-black/40 px-1 py-0.5 rounded">max.poll.interval.ms</code>), the group triggers an <strong class="text-white">Eager Rebalance</strong>.
          </p>
          <p class="text-[12.5px] font-sans text-amber-200/90 leading-relaxed pt-1">
            <strong>The Catastrophe:</strong> In an eager rebalance, <em>every single consumer in the group revokes all its partition assignments</em> and halts processing completely until the Group Coordinator finishes recalculating assignments. For large clusters with hundreds of partitions, this causes a 30-to-60-second Stop-The-World consumption freeze, resulting in catastrophic consumer lag spikes.
            <br/><br/>
            <strong>The Senior Remedy:</strong> Always configure <strong class="text-white">CooperativeStickyAssignor</strong> (<code class="text-amber-300 bg-black/40 px-1 py-0.5 rounded">partition.assignment.strategy</code>). Cooperative rebalancing performs incremental migrations: only the specific partitions being moved are paused, while all other healthy consumers continue draining their partitions uninterrupted!
          </p>
        </div>

        <!-- CRITICAL ARCHITECTURAL DEEP-DIVES Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              CRITICAL ARCHITECTURAL DEEP-DIVES &amp; DISTRIBUTED EDGE CASES
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${architecturalDeepDives.map(item => `
              <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
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
            Do not use Kafka as a simple task queue, and do not use RabbitMQ as an event streaming backbone. If your use case requires complex transactional routing, per-message ACKs/rejections, priority queues, and ephemeral task consumption (e.g. Celery workers), choose RabbitMQ. If your use case requires million-message/sec throughput, event sourcing, multi-team publish-subscribe fanout, and historical message replay, choose Apache Kafka.
          </p>
        </div>

        <!-- Page 80 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 80</span>
        </div>

      </div>

    </div>
  `;
}
