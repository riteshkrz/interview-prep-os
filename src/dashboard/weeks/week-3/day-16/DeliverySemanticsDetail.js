/**
 * 7.1 Delivery Semantics: At-Most, At-Least, Exactly Once - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 92, 93, 94, and 95
 * from The Modern System Design Interview Guide.
 */

export function renderDeliverySemanticsContent(topic) {
  const deliveryComparisonMatrix = [
    {
      guarantee: "At-Most-Once",
      howItWorks: "Consumer commits offset / sends ACK BEFORE processing message payload. If worker crashes mid-execution, message is never retried.",
      lossRisk: "High (Guaranteed message loss on worker crash or network failure)",
      lossClass: "text-rose-400 font-bold",
      duplicateRisk: "Zero (Message is never redelivered)",
      duplicateClass: "text-emerald-400 font-bold",
      throughput: "Maximum (Zero retry overhead, zero duplicate deduplication checks)",
      throughputClass: "text-emerald-400 font-bold",
      latency: "Lowest (Sub-millisecond fire-and-forget)",
      latencyClass: "text-emerald-400 font-bold",
      complexity: "Trivial (No state tracking or deduplication tables needed)",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      guarantee: "At-Least-Once",
      howItWorks: "Consumer commits offset / sends ACK AFTER processing payload and persisting state. If worker crashes before ACK reaches broker, broker redelivers.",
      lossRisk: "Zero (Messages are persistently re-sent until explicitly acknowledged)",
      lossClass: "text-emerald-400 font-bold",
      duplicateRisk: "High (Network timeouts, worker restarts cause duplicate processing)",
      duplicateClass: "text-rose-400 font-bold",
      throughput: "High (Concurrent parallel processing with minimal coordination)",
      throughputClass: "text-emerald-400 font-bold",
      latency: "Low to Moderate (Occasional redelivery on consumer lag/rebalance)",
      latencyClass: "text-slate-300",
      complexity: "Moderate (Requires consumer idempotency / deduplication logic)",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      guarantee: "Exactly-Once (EOS)",
      howItWorks: "At-Least-Once delivery coupled with idempotent deduplication OR atomic distributed transactions (Kafka 2PC Transaction Coordinator).",
      lossRisk: "Zero (Fully durable commit log tracking)",
      lossClass: "text-emerald-400 font-bold",
      duplicateRisk: "Zero (Effectively-Once state mutation guarantee)",
      duplicateClass: "text-emerald-400 font-bold",
      throughput: "Lower (15–30% overhead due to transaction markers and 2PC coordination)",
      throughputClass: "text-amber-400 font-bold",
      latency: "Higher (End-to-end latency bounded by transaction commit intervals)",
      latencyClass: "text-amber-400 font-bold",
      complexity: "High (Requires transactional producers, coordinators, and read_committed isolation)",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the fundamental difference between At-Least-Once delivery and Exactly-Once delivery?",
      answer: `The distinction boils down to <strong>failure handling and the Two Generals Problem</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>At-Least-Once Delivery:</strong> Guarantees that the message will reach the consumer <em>at least one time</em>. If an ACK packet is lost in transit due to network jitter, or if the worker crashes before sending the ACK, the broker assumes delivery failure and redelivers. Consequently, the consumer may process the identical payload multiple times.</li>
        <li><strong>Exactly-Once Delivery (The Impossibility):</strong> Across an unreliable distributed network, <em>true physical exactly-once packet delivery is impossible</em> (proven by the Two Generals theorem). Instead, modern systems implement <strong>Exactly-Once Processing (EOP)</strong> or <em>Effectively-Once Semantics</em>: the network might deliver the physical packet multiple times, but the target database or downstream state machine applies the mutation exactly once.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How does Apache Kafka achieve idempotence on the producer side without distributed locks?",
      answer: `When <code>enable.idempotence=true</code> is set on a Kafka producer, Kafka prevents duplicate writes caused by producer network retries using two lightweight metadata fields:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Producer ID (PID):</strong> On initialization, the producer sends an <code>InitProducerId</code> request to the broker. The cluster assigns a unique 64-bit PID managed internally.</li>
        <li><strong>Monotonically Increasing Sequence Number:</strong> For every topic partition, the producer tags each message batch with an incrementing integer sequence number (0, 1, 2, 3...).</li>
        <li><strong>Broker-Side De-duplication:</strong> The partition leader broker tracks the highest sequence number committed for each PID. When a producer retries a batch due to a transient network timeout:
          <br/>- If <code>Seq_received == Seq_expected + 1</code>: Broker appends to log and increments expected sequence.
          <br/>- If <code>Seq_received &lt;= Seq_expected</code>: Broker recognizes a duplicate retry, acknowledges it with ACK (so producer stops retrying), but <strong>discards the duplicate payload from the log</strong>.
          <br/>- If <code>Seq_received &gt; Seq_expected + 1</code>: Broker detects an out-of-order gap and returns an <code>OutOfOrderSequenceException</code>.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How do you design an idempotent consumer in practice when updating non-relational datastores or external third-party APIs?",
      answer: `Relational databases allow atomic deduplication via <code>INSERT ... ON CONFLICT DO NOTHING</code> inside a transaction. For non-relational or external systems, use the following patterns:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Distributed Idempotency Cache (Redis SETNX):</strong> Before mutating state, the consumer calls <code>SET idempotency:event_123 "PROCESSING" NX EX 3600</code>. If it returns <code>false</code>, the event is already processed or in-flight; immediately drop and ACK. After success, update status to <code>"COMPLETED"</code>.</li>
        <li><strong>Natural Idempotent Operations:</strong> Design state mutations to be mathematically idempotent:
          <br/>- <em>Non-idempotent:</em> <code>balance = balance + $50</code> (Executing twice adds $100).
          <br/>- <em>Idempotent:</em> <code>SET account_balance = $550 WHERE version = 4</code> (Optimistic locking; second execution touches 0 rows).
          <br/>- <em>Key-Value/Document Stores:</em> Using document IDs: <code>PUT /orders/order_789</code> with immutable payloads overwrites identical bytes without side-effects.</li>
        <li><strong>External Payment APIs (Stripe / Adyen):</strong> Pass a client-generated <code>Idempotency-Key: &lt;event_uuid&gt;</code> in the HTTP request header. Payment gateways cache the first transaction response for 24 hours and return the cached receipt on duplicate retries without double-charging the customer's card.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "What is the performance overhead of Kafka transactions, and what happens when a Transaction Coordinator crashes?",
      answer: `Kafka's transactional API (supporting read-process-write cycles across consumer offsets and producer topics) introduces measurable architectural trade-offs:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Throughput Overhead:</strong> Typically a 10%–25% throughput penalty. This is caused by: (1) round-trip network hops to the <strong>Transaction Coordinator</strong> to register partitions, (2) appending control records (<code>COMMIT</code> / <code>ABORT</code> markers) to data topic partitions, and (3) consumer buffering under <code>isolation.level=read_committed</code>.</li>
        <li><strong>Consumer Lag & Commit Wait:</strong> Downstream consumers configured with <code>read_committed</code> cannot read messages beyond the <strong>Last Stable Offset (LSO)</strong>. If a transaction remains open for 10 seconds, downstream consumers stall at the open transaction's first message until the coordinator writes a commit or abort marker.</li>
        <li><strong>Coordinator Crash Recovery:</strong> The Transaction Coordinator is simply a designated Kafka broker partition leader for the internal <code>__transaction_state</code> topic (replicated with RF=3). If the coordinator broker node crashes, Kafka's standard raft/controller failover elects a new leader replica. The new leader reads the replicated <code>__transaction_state</code> log, reconstructs active transaction states, and either completes in-doubt commits or times out abandoned transactions after <code>transaction.timeout.ms</code>.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 92: CORE DEFINITIONS, ACK TIMING & THE TWO GENERALS PROBLEM -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              7.1 Delivery Semantics: At-Most, At-Least, Exactly Once
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Message Delivery Guarantees in Distributed Systems · ACK Timing Physics, Idempotence & Kafka Transactions
          </p>
        </div>

        <!-- WHAT IT IS & ACK TIMING Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              THE DELIVERY GUARANTEE CONTRACT
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              Delivery semantics define the mathematical contract between message producers, message brokers, and consumers in the presence of node crashes, network partitions, and process restarts. The guarantee is governed entirely by <strong>when consumer acknowledgment (ACK) occurs relative to state mutation</strong>.
            </p>
          </div>

          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              THE TWO GENERALS IMPOSSIBILITY
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              Across an asynchronous, unreliable network, <strong>true Exactly-Once Delivery is physically impossible</strong>. The sender can never know whether an unacknowledged message was lost on the forward path, or whether the message was received and only the ACK was dropped on the return path. Exactly-once is achieved in practice as an <em>effect</em> via idempotent processing.
            </p>
          </div>
        </div>

        <!-- Section: Where Guarantees Come From (ACK Timing Mechanics) -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Where Delivery Guarantees Come From: The ACK Timing Dilemma
          </h3>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Every distributed queue (Kafka, RabbitMQ, SQS, Pulsar) presents a binary trade-off in consumer acknowledgment timing:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12.5px] font-sans">
            <!-- At-Most-Once Flow Card -->
            <div class="bg-[#141C2E] border border-amber-500/30 rounded-xl p-5 flex flex-col gap-3">
              <div class="flex items-center justify-between pb-2 border-b border-[#24314A]">
                <span class="px-2.5 py-0.5 rounded font-code text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  AT-MOST-ONCE (ACK First)
                </span>
                <span class="font-code text-[11px] text-rose-400">Risk: Data Loss</span>
              </div>
              <div class="font-code text-[11px] bg-[#0A0E1A] p-3 rounded-lg border border-slate-800 text-slate-300 space-y-1">
                <div>1. Receive message from broker</div>
                <div class="text-amber-300">2. Commit offset / send ACK immediately ──► Broker</div>
                <div>3. Execute business logic & update database</div>
                <div class="text-rose-400">▲ CRASH HERE: Message is permanently LOST!</div>
              </div>
              <p class="text-slate-300 leading-relaxed">
                Because the offset is committed before processing, a worker crash during step 3 causes the broker to advance past the message. When the worker restarts, it begins at the next offset. The uncompleted message is dropped forever.
              </p>
            </div>

            <!-- At-Least-Once Flow Card -->
            <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3">
              <div class="flex items-center justify-between pb-2 border-b border-[#24314A]">
                <span class="px-2.5 py-0.5 rounded font-code text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  AT-LEAST-ONCE (Process First)
                </span>
                <span class="font-code text-[11px] text-amber-300">Risk: Duplicates</span>
              </div>
              <div class="font-code text-[11px] bg-[#0A0E1A] p-3 rounded-lg border border-slate-800 text-slate-300 space-y-1">
                <div>1. Receive message from broker</div>
                <div>2. Execute business logic & update database</div>
                <div class="text-rose-400">▲ CRASH / NETWORK DROP BEFORE ACK REACHES BROKER</div>
                <div class="text-cyan-300">3. Broker times out ──► REDELIVERS message to next worker!</div>
              </div>
              <p class="text-slate-300 leading-relaxed">
                Because the offset is committed only after processing, a worker crash or dropped network packet causes the broker to re-dispatch the payload. Zero data is lost, but the consumer receives and executes the payload a second time.
              </p>
            </div>
          </div>
        </div>

        <!-- ASCII Flow Diagram: The Delivery Spectrum -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              THE THREE DELIVERY PARADIGMS IN DISTRIBUTED MESSAGING
            </span>
            <span class="text-[11px] font-code text-slate-500">Producer, Broker & Consumer Interactions</span>
          </div>

          <!-- ASCII Diagram Container -->
          <div class="p-4 bg-[#070B14] rounded-lg border border-slate-800 text-slate-300 overflow-x-auto text-[11.5px] leading-relaxed">
            <pre class="font-code text-slate-300">
+-------------------------------------------------------------------------------------------------------------+
|                                  DELIVERY SEMANTICS ACROSS DISTRIBUTED HOPS                                 |
+-------------------------------------------------------------------------------------------------------------+

 1. AT-MOST-ONCE: (Fire & Forget / Pre-Commit ACK)
    Producer ────────[ Send Message ]────────► Broker ────────[ Pull Msg ]────────► Consumer (PID: 101)
                                                 ▲                                        │
                                                 └──────────[ ACK BEFORE EXEC ]───────────┘
                                                                                          │
                                                                                 [ Crash! ] = DATA LOST!

 2. AT-LEAST-ONCE: (Retry on Timeout / Post-Commit ACK)
    Producer ────────[ Send Message ]────────► Broker ────────[ Pull Msg ]────────► Consumer (PID: 101)
        ▲                   │                    ▲                                        │
        └──[ ACK or Retry ]─┘                    │                                [ Process & Save DB ]
                                                 │                                        │
                                                 │        [ Network Packet Lost! ] ◄──────┘
                                                 │                   X
                                                 └────[ Timeout: REDELIVER SAME MSG ]────► Consumer (PID: 102)
                                                                                          ▲ DUPLICATE EXECUTION!

 3. EXACTLY-ONCE EFFECT: (At-Least-Once Delivery + Idempotent Consumer Deduplication)
    Consumer ──► [ Extract Event ID: "evt_984" ]
                     │
                     ▼
    [ Check Deduplication Store / SQL: INSERT INTO processed_events VALUES ('evt_984') ON CONFLICT DO NOTHING ]
                     │
         ┌───────────┴──────────────────────┐
         ▼ (Key Exists: Already Processed)  ▼ (Key New: First Time)
     [ Skip Processing & Send ACK ]      [ Mutate DB State + Insert Key In Same ACID Transaction ──► ACK ]</pre>
          </div>
        </div>

        <!-- Official Page 92 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 92</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 93: IDEMPOTENT CONSUMERS, ATOMIC SQL & THE OUTBOX PATTERN -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-[#6366F1] rounded-sm shrink-0"></div>
          <h3 class="font-sans text-[17px] sm:text-[19px] font-bold text-white tracking-tight">
            Engineering Exactly-Once: The Idempotent Consumer Pattern
          </h3>
        </div>

        <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
          Because network reliability cannot be mathematically guaranteed, production hyperscale architectures pair <strong>At-Least-Once message delivery</strong> with <strong>Idempotent Consumers</strong>. An idempotent operation can be applied $N$ times with the exact same final state as applying it once ($f(f(x)) = f(x)$).
        </p>

        <!-- Idempotency Techniques Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <!-- SQL Unique Constraint Deduplication -->
          <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span class="font-code text-[12px] font-bold text-cyan-300">1. Atomic Relational DB Deduplication</span>
            </div>
            <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
              The gold standard for transactional databases. Store an <code>idempotency_key</code> inside a dedicated table within the <em>same local ACID transaction</em> that executes the business mutation:
            </p>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-slate-800 text-[11.5px] font-code text-emerald-300 overflow-x-auto leading-relaxed">
              <span class="text-slate-500">-- Execute inside BEGIN ... COMMIT</span><br/>
              INSERT INTO processed_events (event_id, processed_at)<br/>
              VALUES ($1, NOW())<br/>
              <span class="text-amber-400">ON CONFLICT (event_id) DO NOTHING;</span><br/><br/>
              <span class="text-slate-500">-- Check rows affected:</span><br/>
              IF rows_affected = 0 THEN<br/>
              &nbsp;&nbsp;RETURN 'ALREADY_PROCESSED'; -- Skip & ACK<br/>
              END IF;<br/><br/>
              UPDATE accounts SET balance = balance + $2 WHERE id = $3;
            </div>
            <p class="text-[12px] text-slate-400 font-sans">
              If the worker crashes before sending the ACK to the broker, redelivery triggers the <code>ON CONFLICT</code> branch, rolling back nothing, mutating nothing, and cleanly ACKing.
            </p>
          </div>

          <!-- Distributed Cache Deduplication (Redis) -->
          <div class="bg-[#141C2E] border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span class="font-code text-[12px] font-bold text-indigo-300">2. Distributed Cache Token (Redis SETNX)</span>
            </div>
            <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
              Used when the downstream target lacks multi-statement ACID transactions (e.g. updating Elasticsearch, sending third-party webhooks, mutating S3 objects):
            </p>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-slate-800 text-[11.5px] font-code text-cyan-300 overflow-x-auto leading-relaxed">
              <span class="text-slate-500">// Atomic acquisition with 1-hour expiration</span><br/>
              const acquired = await redis.set(<br/>
              &nbsp;&nbsp;<span class="text-emerald-300">&#96;dedup:\${eventId}&#96;</span>,<br/>
              &nbsp;&nbsp;<span class="text-amber-300">'PROCESSING'</span>,<br/>
              &nbsp;&nbsp;<span class="text-cyan-400">'NX'</span>, <span class="text-cyan-400">'EX'</span>, 3600<br/>
              );<br/><br/>
              if (!acquired) {<br/>
              &nbsp;&nbsp;return ack(); // Duplicate event in-flight or done<br/>
              }<br/>
              await processExternalApiCall(payload);<br/>
              await redis.set(<span class="text-emerald-300">&#96;dedup:\${eventId}&#96;</span>, <span class="text-amber-300">'COMPLETED'</span>, <span class="text-cyan-400">'EX'</span>, 86400);
            </div>
            <p class="text-[12px] text-slate-400 font-sans">
              Guarantees only one concurrent worker executes the unrepeatable downstream side-effect, even under massive redelivery storms.
            </p>
          </div>
        </div>

        <!-- Green Box: Senior Perspective: Why Distributed Systems Choose At-Least-Once + Idempotence -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: WHY DISTRIBUTED SYSTEMS CHOOSE AT-LEAST-ONCE + IDEMPOTENCE
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            In system design interviews, novice engineers eagerly propose distributed two-phase commit (2PC) or Kafka transactions to claim "pure exactly-once delivery." Staff engineers do the opposite: they immediately proclaim <strong>"Exactly-once delivery is an anti-pattern across microservices; we will use At-Least-Once delivery and enforce consumer idempotency."</strong> Why? Because 2PC locks resources across network hops, destroys throughput by 70–90%, and halts availability if the coordinator becomes unreachable. Idempotent consumers allow independent, lock-free parallel execution where retries are mathematically safe and cheap.
          </p>
        </div>

        <!-- Official Page 93 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 93</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 94: KAFKA EXACTLY-ONCE SEMANTICS (EOS) & 2PC TRANSACTIONS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-[#6366F1] rounded-sm shrink-0"></div>
          <h3 class="font-sans text-[17px] sm:text-[19px] font-bold text-white tracking-tight">
            Kafka Exactly-Once Semantics (EOS): Producer Idempotence & 2PC
          </h3>
        </div>

        <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
          Apache Kafka provides true Exactly-Once Semantics (EOS) within the Kafka ecosystem through two coordinated features: <strong>Idempotent Producers</strong> (preventing duplicate writes) and the <strong>Transactional API</strong> (atomic read-process-write loops across topics):
        </p>

        <!-- Kafka Transaction Architecture ASCII -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              KAFKA 2-PHASE COMMIT TRANSACTION COORDINATOR WORKFLOW
            </span>
            <span class="text-[11px] font-code text-slate-500">Atomic Read-Process-Write Stream Cycles</span>
          </div>

          <div class="p-4 bg-[#070B14] rounded-lg border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
            <pre class="font-code text-slate-300">
+-------------------------------------------------------------------------------------------------------------+
|                       KAFKA EXACTLY-ONCE PROCESSING (EOP) VIA TRANSACTION COORDINATOR                       |
+-------------------------------------------------------------------------------------------------------------+

  [ KAFKA CONSUMER / PRODUCER ]                 [ TRANSACTION COORDINATOR ]           [ KAFKA BROKER / TOPICS ]
               │                                             │                                     │
               ├── 1. InitTransactions(TransactionalID) ────►│ (Assigns PID + Epoch)               │
               │                                             │                                     │
               ├── 2. BeginTransaction()                     │                                     │
               │                                             │                                     │
               ├── 3. Poll message from SourceTopic ─────────┼────────────────────────────────────►│ (Read msg)
               │                                             │                                     │
               ├── 4. AddPartitionsToTxnRequest ────────────►│ (Appends to __transaction_state)    │
               │                                             │                                     │
               ├── 5. Produce output to TargetTopic ─────────┼────────────────────────────────────►│ (Uncommitted Msg)
               │                                             │                                     │
               ├── 6. SendOffsetsToTxn(ConsumerOffset) ─────►│ (Routes offset to consumer group)   │
               │                                             │                                     │
               ├── 7. CommitTransaction() ──────────────────►│ (Phase 1: Writes PREPARE_COMMIT)   │
               │                                             │                                     │
               │                                             ├── 8. Write COMMIT Markers ─────────►│ TargetTopic Partitions
               │                                             │                                     │ ConsumerOffsets Partition
               │                                             │                                     │
               │                                             ├── 9. Writes COMMITTED to Log        │
               │◄─ 10. Success Response (Commit Complete) ───┤                                     │
               │                                             │                                     │
  [ Downstream Consumers (isolation.level=read_committed) can now see TargetTopic messages & ConsumerOffset! ]</pre>
          </div>
        </div>

        <!-- Orange Warning: The Fallacy of the Exactly-Once Silver Bullet -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            THE FALLACY OF THE "EXACTLY-ONCE" SILVER BULLET: KAFKA BOUNDARIES
          </span>
          <p class="text-[13px] text-amber-200/90 leading-relaxed font-sans">
            A catastrophic interview trap is claiming <em>"We enabled Kafka Exactly-Once Semantics, so our database and payment gateway will never see duplicates."</em> <strong>Kafka's Transactional API only guarantees exactly-once within Kafka itself</strong> (consuming from a Kafka topic and producing to another Kafka topic). As soon as the message consumer writes to an external SQL database, updates Elasticsearch, or invokes a third-party REST API (Stripe, Twilio), Kafka's transaction coordinator has <em>zero visibility</em> or control. If the database commit succeeds but the consumer crashes before committing its Kafka offset, the message is redelivered and the database is double-mutated. External writes MUST use the Transactional Outbox Pattern or Idempotent Keys.
          </p>
        </div>

        <!-- Official Page 94 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 94</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 95: COMPARISON MATRIX, INTERVIEW FOLLOW-UPS & KEY TAKEAWAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Comprehensive Comparison Matrix -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-6 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h3 class="font-sans text-[17px] sm:text-[19px] font-bold text-white tracking-tight">
              Comprehensive Architectural Comparison of Delivery Semantics
            </h3>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Evaluate delivery guarantees across risk, throughput, latency, and implementation overhead:
          </p>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Guarantee</th>
                  <th class="p-3.5">How It Works (ACK Timing)</th>
                  <th class="p-3.5">Message Loss Risk</th>
                  <th class="p-3.5">Duplication Risk</th>
                  <th class="p-3.5">Throughput Impact</th>
                  <th class="p-3.5">Latency Profile</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12px]">
                ${deliveryComparisonMatrix.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">
                      <span class="px-2.5 py-1 rounded font-code text-[11px] border ${row.badgeColor} whitespace-nowrap inline-block">
                        ${row.guarantee}
                      </span>
                    </td>
                    <td class="p-3.5 text-slate-300 font-sans leading-relaxed">${row.howItWorks}</td>
                    <td class="p-3.5 ${row.lossClass}">${row.lossRisk}</td>
                    <td class="p-3.5 ${row.duplicateClass}">${row.duplicateRisk}</td>
                    <td class="p-3.5 ${row.throughputClass}">${row.throughput}</td>
                    <td class="p-3.5 ${row.latencyClass}">${row.latency}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            If designing an online advertising click-tracking system handling 500,000 events/sec, which delivery semantic would you select for billing vs. analytics counters? How would you justify your choice using deduplication store memory limits?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">contact_support</span>
              DEEP-DIVE INTERVIEW FOLLOW-UPS (Q1–Q4)
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.question}</span>
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
            Acknowledgment timing determines the delivery guarantee. Default to at-least-once delivery and place the burden of correctness on an idempotent consumer. In an interview, always state: <em>"Exactly-once delivery across an unreliable network is physically impossible due to the Two Generals problem; exactly-once processing effect is achievable by pairing at-least-once transport with database deduplication keys or transactional commit boundaries."</em> That formulation demonstrates top-tier systems engineering maturity.
          </p>
        </div>

        <!-- Official Page 95 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 95</span>
        </div>

      </div>

    </div>
  `;
}
