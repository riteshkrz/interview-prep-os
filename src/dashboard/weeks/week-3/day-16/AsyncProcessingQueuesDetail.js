/**
 * 6.1 Asynchronous Processing & Message Queues - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 77 and 78
 * from The Modern System Design Interview Guide.
 */

export function renderAsyncProcessingQueuesContent(topic) {
  const comparisonMatrix = [
    {
      dimension: "Latency Model",
      sync: "Blocking round-trip: T_producer = T_network + T_callee_exec",
      syncClass: "text-rose-400 font-bold",
      async: "Non-blocking: T_producer = T_enqueue (sub-millisecond ~1-2ms)",
      asyncClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Service Coupling",
      sync: "Tight temporal & spatial coupling; shared lifecycle & failure domain",
      syncClass: "text-rose-400 font-bold",
      async: "Loose coupling: producer & consumer run independently in time & space",
      asyncClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Traffic Surge Handling",
      sync: "Downstream thread pool exhaustion; 429 Too Many Requests or 503/504 errors",
      syncClass: "text-amber-400 font-bold",
      async: "Load Leveling (Peak Shaving): Queue buffers bursts; workers drain at steady rate",
      asyncClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Failure Semantics",
      sync: "Cascading failure: Downstream outage immediately crashes upstream callers",
      syncClass: "text-rose-400 font-bold",
      async: "Fault isolation: Downstream downtime causes queue backlog, not data loss",
      asyncClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Backpressure Mechanism",
      sync: "Difficult; requires rate limiters, circuit breakers, and thread pool rejections",
      syncClass: "text-slate-400",
      async: "Native: Pull-based consumers or prefetch limits control consumption rate",
      asyncClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Error Recovery",
      sync: "Synchronous retry loops amplify downstream overload (Retry Storms)",
      syncClass: "text-rose-400 font-bold",
      async: "Exponential backoff, retry queues, and Dead Letter Queues (DLQ)",
      asyncClass: "text-emerald-400 font-bold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is Backpressure, and how do push-based vs. pull-based message queues handle it?",
      answer: `Backpressure is the resistance or flow-control signal exerted by a downstream consumer when incoming message velocity exceeds its processing throughput capacity.
      <br/><br/>
      <strong class="text-indigo-400">Push vs. Pull Flow Control:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Push-Based Queues (RabbitMQ):</strong> The broker proactively pushes messages to connected workers. If a worker is slow, unconsumed messages pile up in the worker's TCP buffer and application memory, causing <em>buffer bloat and Out-Of-Memory (OOM) crashes</em>. <strong>Mitigation:</strong> Consumers must set <code class="text-amber-300 bg-black/40 px-1 py-0.5 rounded">basic.qos(prefetch_count=N)</code> to restrict unacknowledged in-flight messages.</li>
        <li><strong>Pull-Based Systems (Apache Kafka, AWS SQS):</strong> Workers continuously pull or poll message batches on their own cadence. When a worker is busy running heavy tasks, it simply delays its next poll request. The broker never overwhelms the consumer, providing <strong>inherent backpressure protection</strong>.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How do you guarantee message ordering in a distributed queue without crippling throughput?",
      answer: `Enforcing <strong>total global ordering</strong> across an entire distributed message system requires a single sequential queue thread, which creates a catastrophic throughput bottleneck (&lt; 1,000 msgs/sec).
      <br/><br/>
      <strong class="text-indigo-400">The Distributed Solution: Partitioned Partial Ordering:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>In real-world business domains, messages only need to be ordered <em>relative to a specific entity</em> (e.g., events for <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">order_id #4812</code> must be ordered, but Order A and Order B have zero ordering dependency).</li>
        <li><strong>Partitioning Keys:</strong> In Kafka or AWS SQS FIFO, producers provide a <strong>Partition Key / Message Group ID</strong> (e.g. <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">customer_id</code>). The broker hashes this key to assign all messages for that entity to the exact same partition and consumer thread.</li>
        <li>This guarantees <strong>strict FIFO ordering per entity</strong> while allowing hundreds of partitions to process concurrently in parallel across worker instances.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is the difference between Point-to-Point (Queue) and Publish-Subscribe (Topic) topologies?",
      answer: `Distributed messaging architectures rely on two distinct message distribution paradigms:
      <br/><br/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-cyan-400 block mb-1">1. Point-to-Point (Work Queue)</strong>
          <span class="text-slate-300 text-[12px]">Implemented via Competing Consumers pattern. Multiple workers listen to a single queue, but <strong>each message is delivered to exactly one worker</strong>. Used for task distribution, background job processing, and work balancing.</span>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-emerald-400 block mb-1">2. Publish-Subscribe (Pub/Sub Topic)</strong>
          <span class="text-slate-300 text-[12px]">Broadcast/fanout paradigm. A producer publishes an event to a topic, and <strong>a copy is delivered to every subscribed consumer group</strong>. Used when multiple independent microservices (Billing, Shipping, Analytics) must all react to the same event.</span>
        </div>
      </div>`
    },
    {
      qNum: "Q4",
      question: "How do you design an Idempotent Consumer to handle At-Least-Once delivery re-transmissions?",
      answer: `Because distributed message brokers retry unacknowledged messages upon network timeouts, duplicate deliveries are guaranteed to occur in production.
      <br/><br/>
      <strong class="text-indigo-400">Three Idempotent Implementation Strategies:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Unique Idempotency Key in Database:</strong> Include a globally unique <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">message_id</code> or <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">idempotency_key</code> in every message. Execute database writes using an upsert with uniqueness constraint: <br/><code class="text-emerald-300 bg-black/50 px-2 py-0.5 rounded text-[11px] block mt-1">INSERT INTO processed_events (event_id, payload) VALUES ($1, $2) ON CONFLICT (event_id) DO NOTHING;</code></li>
        <li><strong>Atomic Redis Cache Check:</strong> Before processing, check and set a distributed lock with TTL: <code class="text-amber-300 bg-black/40 px-1 py-0.5 rounded">SET event:id123 "PROCESSED" NX EX 86400</code>. If key already exists, acknowledge and discard the duplicate immediately.</li>
        <li><strong>Naturally Idempotent Operations:</strong> Design state transitions as absolute values rather than deltas (e.g., <code class="text-indigo-300 bg-black/40 px-1 py-0.5 rounded">SET status = 'PAID'</code> instead of <code class="text-rose-300 bg-black/40 px-1 py-0.5 rounded">INCREMENT balance BY 10</code>).</li>
      </ol>`
    }
  ];

  return `
    <div class="flex flex-col gap-8 max-w-5xl mx-auto select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 77, 78: ASYNCHRONOUS PROCESSING & MESSAGE QUEUES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              6.1 Asynchronous Processing & Message Queues
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Synchronous communication (<strong class="text-rose-400">HTTP/REST, gRPC</strong>) requires the caller thread to wait blocked until the callee finishes. In distributed architectures, synchronous cascades create <strong class="text-amber-300">tight coupling, shared failure domains, and vulnerability to traffic spikes</strong>. Asynchronous processing introduces an intermediary durable message buffer, decoupling the producer of work from the consumer of work in both time and space.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">1. Temporal Decoupling</span>
              <span class="text-[12px] text-slate-300">The producer emits a task and returns immediately. The consumer does not need to be online or available at the instant of publication; it drains tasks at its own capacity.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">2. Spatial Decoupling & Fault Isolation</span>
              <span class="text-[12px] text-slate-300">Producers have zero awareness of worker IPs or cluster topologies. If the worker fleet crashes, messages remain durably buffered in the queue without data loss.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Concurrency Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              ARCHITECTURAL PATTERN: SYNCHRONOUS CASCADE VS. ASYNCHRONOUS LOAD LEVELING
            </span>
            <span class="text-slate-500 text-[10.5px]">Traffic Smoothing Mechanics</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. SYNCHRONOUS HTTP CASCADE: THREAD BLOCKING & CASCADING CRASH                                    │
│                                                                                                  │
│   Incoming Surge (50,000 QPS)                                                                    │
│        │                                                                                         │
│        ▼                                                                                         │
│   [ API Gateway ] ──► [ Order Service ] ──► [ Payment Gateway ] ──► [ Inventory DB ]             │
│        │                   │                      │                     │                        │
│        │  (Thread Blocked) │  (Thread Blocked)    │  (Slow Network)     │  (DB Lock Contention)  │
│        ▼                   ▼                      ▼                     ▼                        │
│   * Result: Thread pools exhaust across all microservices. Latency explodes to 30s.              │
│     Cascading 504 Gateway Timeouts crash the entire upstream customer checkout funnel.           │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. ASYNCHRONOUS LOAD LEVELING (PEAK SHAVING): QUEUE BUFFERING                                    │
│                                                                                                  │
│   Incoming Surge (50,000 QPS)                                                                    │
│        │                                                                                         │
│        ▼                                                                                         │
│   [ API Gateway ] ──► [ Order Service ] ──► Enqueue Message (1-2ms) ──► HTTP 202 Accepted        │
│                                                   │                     (Customer unblocked)     │
│                                                   ▼                                              │
│                                  ┌─────────────────────────────────┐                             │
│                                  │   DURABLE MESSAGE QUEUE / LOG   │                             │
│                                  │   (Buffers 500,000 messages)    │                             │
│                                  └────────────────┬────────────────┘                             │
│                                                   │                                              │
│                       ┌───────────────────────────┼───────────────────────────┐                  │
│                       ▼                           ▼                           ▼                  │
│               [ Worker Pod 1 ]            [ Worker Pod 2 ]            [ Worker Pod N ]           │
│                       │                           │                           │                  │
│                       └───────────────────────────┼───────────────────────────┘                  │
│                                                   ▼                                              │
│                         Smooth, Controlled Drain: Constant 5,000 QPS Rate                        │
│                                                   ▼                                              │
│                                  [ Downstream Database / External APIs ]                         │
│                                  (Protected from overload; zero lock blowout)                    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- High-Signal Comparison Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">table_chart</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              Synchronous vs. Asynchronous Communication Matrix
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-semibold">
                  <th class="py-3 px-4 w-[22%]">Architectural Dimension</th>
                  <th class="py-3 px-4 w-[39%] text-rose-400">Synchronous (HTTP / REST / gRPC)</th>
                  <th class="py-3 px-4 w-[39%] text-emerald-400">Asynchronous (Message Queue / Log)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] bg-[#0A0E1A]">
                ${comparisonMatrix.map(row => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-200 border-r border-[#24314A]/50 bg-[#0F172A]/40">
                      ${row.dimension}
                    </td>
                    <td class="py-3 px-4 ${row.syncClass} border-r border-[#24314A]/50">
                      ${row.sync}
                    </td>
                    <td class="py-3 px-4 ${row.asyncClass}">
                      ${row.async}
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
            SENIOR PERSPECTIVE: AUTOSCALING WORKERS ON QUEUE DEPTH (KEDA) & IDEMPOTENCY
          </span>
          <p class="text-[13px] font-sans text-emerald-100 leading-relaxed">
            A rookie architect autoscales worker fleets based on <strong>CPU utilization</strong>. In asynchronous queue consumers, workers are almost always <em>I/O bound</em> (waiting on database writes, third-party payment gateways, or S3 uploads). During a downstream bottleneck, worker CPU might stay at a calm 15% while the queue backlog explodes by 100,000 messages.
          </p>
          <p class="text-[12.5px] font-sans text-emerald-200/90 leading-relaxed pt-1">
            <strong>The Production Rule:</strong> Always configure autoscaling based on <strong>Queue Depth (Message Lag / Oldest Message Age)</strong> using tools like <em>KEDA (Kubernetes Event-driven Autoscaling)</em> or CloudWatch metric alarms. If queue latency exceeds SLA threshold (e.g. oldest message &gt; 30s), spin up worker pods immediately. Combine this with strictly <strong>Idempotent Consumer Logic</strong> so repeated deliveries do not corrupt state.
          </p>
        </div>

        <!-- Orange Warning Box: Poison Pills & Cascading Worker Death -->
        <div class="bg-[#2A1608] border-l-4 border-[#F97316] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            CRITICAL SYSTEM FAILURE: THE POISON PILL & CASCADING WORKER DEATH SPIRAL
          </span>
          <p class="text-[13px] font-sans text-amber-100 leading-relaxed">
            A <strong class="text-white">Poison Pill</strong> is a malformed message (corrupted JSON, unhandled null field, or schema mismatch) that causes the consuming worker to crash or throw an unhandled exception before acknowledging the message.
          </p>
          <p class="text-[12.5px] font-sans text-amber-200/90 leading-relaxed pt-1">
            <strong>The Death Spiral:</strong> When the worker crashes, the broker detects TCP connection termination and re-queues the message at the front of the queue. The next worker consumes it and immediately crashes too. Within minutes, a single poison pill message can crash every single worker in a 50-instance cluster.
            <br/><br/>
            <strong>Mandatory Production Defense:</strong> Enforce a strict <strong class="text-white">Max Retry Policy</strong> (e.g. 3 attempts with exponential backoff). Once a message fails 3 times, divert it to a <strong class="text-white">Dead Letter Queue (DLQ)</strong>, acknowledge it on the main queue to keep traffic moving, and trigger an automated PagerDuty alarm.
          </p>
        </div>

        <!-- Interview Follow-ups: Deep Dive Technical Q&As -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#24314A] pb-2">
            <span class="material-symbols-outlined text-[18px] text-indigo-400">quiz</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              Senior Interview Deep-Dives: Real-World Follow-Ups
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
            Asynchronous messaging is not just about background jobs; it is the fundamental architectural tool for failure isolation, traffic smoothing (load leveling), and service decoupling. In system design interviews, never let client-facing APIs block on heavy processing or third-party network calls. Insert an asynchronous queue, buffer incoming bursts, enforce strict Dead Letter Queue (DLQ) policies for poison pills, and autoscale consumers based on queue lag rather than CPU.
          </p>
        </div>

        <!-- Page 78 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 78</span>
        </div>

      </div>

    </div>
  `;
}
