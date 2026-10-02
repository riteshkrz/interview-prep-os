/**
 * 7.3 Microservice Collaboration Styles: Orchestration vs. Choreography - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 99, 100, and 101
 * from The Modern System Design Interview Guide.
 */

export function renderMicroserviceCollaborationContent(topic) {
  const collaborationParadigms = [
    {
      style: "Orchestration (Workflow Engine / Central Authority)",
      nature: "Command-Driven ('Do This, Then That')",
      coordinator: "Centralized Orchestrator (Temporal, Cadence, Conductor, AWS Step Functions)",
      communication: "Synchronous RPC / gRPC or dedicated command queues",
      visibility: "Single Pane of Glass: Entire business workflow DAG defined in one place",
      coupling: "High control-flow coupling to orchestrator; services decoupled from each other",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      style: "Choreography (Event-Driven / Decentralized Pub/Sub)",
      nature: "Event-Driven ('This Happened, React If You Care')",
      coordinator: "Decentralized Event Backbone (Apache Kafka, RabbitMQ, Amazon EventBridge)",
      communication: "Asynchronous broadcast of immutable domain events",
      visibility: "Implicit / Emergent: No single repository or diagram holds full system flow",
      coupling: "Loose spatial and temporal coupling; tight schema coupling to event payload",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const comparisonMatrix = [
    {
      dimension: "Primary Coordination Model",
      orchestration: "Central Controller: Directs participating microservices by sending explicit commands (e.g. ExecutePayment, ReserveStock)",
      orchClass: "text-cyan-300 font-bold",
      choreography: "Autonomous Pub/Sub: Services publish domain events (e.g. OrderPlaced); peers react independently without central oversight",
      choreoClass: "text-purple-300 font-bold"
    },
    {
      dimension: "Communication Semantics",
      orchestration: "Point-to-point commands (1:1 direct invocation via gRPC, REST, or task queues). Sender expects a concrete response/status",
      orchClass: "text-slate-300",
      choreography: "Broadcast notifications (1:N fan-out via event log). Publisher is indifferent to who consumes the event or when",
      choreoClass: "text-slate-300"
    },
    {
      dimension: "Flow Visibility & Observability",
      orchestration: "Extremely High: Workflow state, step history, and active execution timers are visible in a centralized Web UI (e.g. Temporal UI)",
      orchClass: "text-emerald-400 font-bold",
      choreography: "Extremely Low: Flow is distributed across disparate codebases. Requires OpenTelemetry distributed trace IDs across Kafka headers",
      choreoClass: "text-rose-400 font-bold"
    },
    {
      dimension: "Coupling Architecture",
      orchestration: "Services couple their API contracts to the orchestrator. Modifying the workflow sequence requires editing only the orchestrator",
      orchClass: "text-emerald-400 font-bold",
      choreography: "Services decouple from coordinators, but tight schema coupling emerges. Evolving event payloads risks breaking unknown consumers",
      choreoClass: "text-amber-400 font-bold"
    },
    {
      dimension: "Error Handling & Compensations",
      orchestration: "Deterministic & Robust: Built-in durable timers, exponential retries, dead-letter policies, and automated reverse compensating actions",
      orchClass: "text-emerald-400 font-bold",
      choreography: "Complex & Fragile: Each service must implement its own timeout timers, dead-letter queues, and listen for failure compensation events",
      choreoClass: "text-rose-400 font-bold"
    },
    {
      dimension: "System Single Point of Failure (SPOF)",
      orchestration: "Orchestrator engine state store (Cassandra, PostgreSQL, or Raft cluster). If orchestrator state store crashes, active executions stall",
      orchClass: "text-amber-400 font-bold",
      choreography: "Kafka broker cluster. If a single consumer service crashes, other event streams continue processing unhindered",
      choreoClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Cognitive Load on Engineers",
      orchestration: "Low to Moderate: An engineer can read the entire order lifecycle within a single 100-line workflow file",
      orchClass: "text-emerald-400 font-bold",
      choreography: "Very High: 'Event Pinball / Spaghetti'. Tracking down why an order hung in PENDING requires querying logs across 6 different teams",
      choreoClass: "text-rose-400 font-bold"
    },
    {
      dimension: "Production Best-Fit Use Cases",
      orchestration: "Transactional core: E-commerce checkout, payment settlement, flight bookings, multi-day user onboarding, human-in-the-loop approvals",
      orchClass: "text-cyan-300 font-medium",
      choreography: "Reactive tail: Real-time analytics, notification emails/SMS, search engine re-indexing, fraud score pipelines, audit logging",
      choreoClass: "text-purple-300 font-medium"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "The 'Event Pinball' Anti-Pattern: Unbounded Choreography & OTel Trace Diagnosis",
      answer: `<strong>Event Pinball</strong> occurs when a system relies exclusively on choreographing asynchronous domain events without a central coordinator:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>The Failure Mode:</strong> An event from Service A triggers an action in Service B, which publishes an event triggering Service C, which triggers Service D, which publishes an event that triggers Service B again! The event bounces unpredictably across microservices like a silver ball in a pinball machine.</li>
        <li><strong>Invisible Global State:</strong> No single service knows the holistic state of a customer's order. When a customer asks customer support why their order is stalled, engineers must inspect 5 different database tables and trace Kafka topic offsets across multiple teams.</li>
        <li><strong>Diagnosis & Remedy:</strong> Inject a standardized <code>traceparent</code> / correlation ID into every message header via OpenTelemetry. If distributed traces reveal circular dependency loops or cascades exceeding 4–5 event hops for a single business transaction, extract that transactional sequence into an explicit <strong>Workflow Orchestrator</strong>.</li>
      </ul>`
    },
    {
      conceptId: "#02",
      title: "Temporal Workflow Fault Tolerance: Deterministic Event Sourcing & State Replay",
      answer: `Modern orchestrators reject traditional volatile in-memory job queues in favor of <strong>Event Sourcing & Replay History</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Immutable Append-Only Event History:</strong> Every workflow step, timer schedule, activity dispatch, and activity result is appended as an immutable event record in a strongly consistent database (PostgreSQL, Cassandra, or Raft).</li>
        <li><strong>Deterministic Replay on Worker Crash:</strong> If the worker process executing workflow logic crashes midway through Step 3 (e.g. after reserving inventory but before charging payment), Temporal routes the workflow to a new worker. The new worker replays the event history from the beginning.</li>
        <li><strong>Skipping Completed Activities:</strong> During replay, when the workflow code calls <code>ReserveInventory()</code>, the SDK checks the recorded event log, sees that Step 1 already succeeded, and immediately returns the cached result without re-executing the remote RPC!</li>
        <li><strong>Zero Lost Timers:</strong> Long-running timers (e.g. <code>Sleep(30.days)</code> for a trial subscription) are persisted in the orchestrator's state database, consuming zero thread or CPU resources while sleeping.</li>
      </ul>`
    },
    {
      conceptId: "#03",
      title: "The Hybrid Enterprise Blueprint: Orchestrate the Core, Choreograph the Reactive Tail",
      answer: `Hyperscale architectures (Uber, Amazon, Netflix, Stripe) deliberately avoid dogmatic extremes:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>The Transactional Core Must Be Orchestrated:</strong>
          <br/>Order creation, inventory deduction, credit card authorization, and shipping label generation must execute in a strict, observable sequence. If payment fails, inventory must be released immediately via automated compensating actions. Orchestration gives you exact timeouts, automatic retries, and a single pane of glass for revenue-critical paths.</li>
        <li><strong>The Reactive Tail Must Be Choreographed:</strong>
          <br/>Once the order is committed and paid, dozens of downstream auxiliary systems care about that fact:
          <br/>- Marketing notification service (send confirmation email and SMS)
          <br/>- Data warehouse ingestion (stream order to Snowflake / BigQuery)
          <br/>- Search service (update inventory availability in Elasticsearch)
          <br/>- Machine learning fraud model (score customer risk profile)
          <br/>The Order Orchestrator should NEVER know or care about these systems! The orchestrator simply emits a single terminal event (<code>OrderCompleted</code>) to Kafka, allowing 20+ downstream consumers to react asynchronously with zero latency impact on the user.</li>
      </ul>`
    },
    {
      conceptId: "#04",
      title: "Schema Evolution in Asynchronous Streams: Protobuf, Avro & Compatibility Gates",
      answer: `Because choreographed producers do not know who is listening to their events, updating an event schema can silently crash downstream consumers:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Binary Serialization Formats:</strong> Reject loose JSON payloads in favor of strict binary schema contracts like <strong>Protocol Buffers (Protobuf)</strong> or <strong>Apache Avro</strong>.</li>
        <li><strong>Confluent Schema Registry:</strong> Producers register new schema versions with a central Schema Registry before publishing. The registry enforces compatibility rules (<code>BACKWARD</code>, <code>FORWARD</code>, or <code>FULL</code>).</li>
        <li><strong>Strict Schema Rules:</strong>
          <br/>1. Never delete or renumber existing field tags.
          <br/>2. Always add new fields as optional or provide explicit default values.
          <br/>3. Never change the semantic datatype of an existing field.
        <li><strong>Consumer Resilience:</strong> Consumers must ignore unknown fields when deserializing payloads, ensuring older consumers can safely process messages emitted by newer producers.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 99: TWO MICROSERVICE COLLABORATION PARADIGMS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              7.3 Microservice Collaboration Styles: Orchestration vs. Choreography
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Distributed Coordination Physics · Centralized Command Workflows vs. Decentralized Event Pub/Sub & The Production Hybrid Standard
          </p>
        </div>

        <!-- Callout Banner: The Fundamental Architectural Dilemma -->
        <div class="bg-[#141C2E] border-l-4 border-indigo-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            THE ARCHITECTURAL DILEMMA: WHO CONTROLS THE FLOW?
          </span>
          <p class="text-[13.5px] text-slate-300 font-sans leading-relaxed">
            When a business transaction spans multiple independent microservices and private databases, systems cannot use ACID database transactions. System architects must choose how distributed state transitions are coordinated: does a <strong>single central authority</strong> direct the sequence of actions, or do <strong>autonomous peers</strong> react independently to emitted facts?
          </p>
        </div>

        <!-- The Two Paradigms Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${collaborationParadigms.map(item => `
            <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-5 flex flex-col gap-3 shadow-lg">
              <div class="flex items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                <span class="font-sans text-[15px] font-bold text-white">${item.style}</span>
                <span class="font-code text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${item.badgeColor}">${item.nature}</span>
              </div>
              <div class="flex flex-col gap-2 text-[12.5px] font-sans">
                <div class="flex items-start gap-2">
                  <span class="font-bold text-slate-400 shrink-0 w-28">Coordinator:</span>
                  <span class="text-slate-200">${item.coordinator}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="font-bold text-slate-400 shrink-0 w-28">Communication:</span>
                  <span class="text-slate-300">${item.communication}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="font-bold text-slate-400 shrink-0 w-28">Flow Visibility:</span>
                  <span class="text-slate-300">${item.visibility}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="font-bold text-slate-400 shrink-0 w-28">Coupling Mode:</span>
                  <span class="text-slate-300">${item.coupling}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- The Hybrid Reality: The Production Standard Callout -->
        <div class="bg-[#161F33] border border-[#2D3A54] rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              THE PRODUCTION HYBRID REALITY: SPLIT BY INTENT
            </span>
          </div>
          <p class="text-[13px] text-slate-300 font-sans leading-relaxed">
            Real-world enterprise systems never choose pure choreography or pure orchestration across the entire company. Instead, they divide workflows by transactional semantics:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 text-[12.5px] font-sans">
            <div class="bg-[#0B1120] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-bold text-cyan-300 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">hub</span>
                1. Orchestrate the Transactional Core
              </span>
              <p class="text-slate-300 leading-normal">
                Steps that require strict sequential ordering, semantic atomicity, timeouts, and automated reverse compensating actions (e.g. Payment $\to$ Inventory Reservation $\to$ Shipping Label).
              </p>
            </div>
            <div class="bg-[#0B1120] border border-purple-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-bold text-purple-300 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">sensors</span>
                2. Choreograph the Reactive Tail
              </span>
              <p class="text-slate-300 leading-normal">
                Autonomous, decoupled side effects that listen for completed facts (e.g. OrderCompleted $\to$ Email receipt, push notification, Snowflake analytics ETL, Elasticsearch reindexing).
              </p>
            </div>
          </div>
        </div>

        <!-- Official Page 99 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 99</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 100: ARCHITECTURE DIAGRAMS & TOPOLOGY COMPARISON -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h3 class="font-sans text-[20px] sm:text-[22px] font-bold text-white tracking-tight leading-snug">
              Architectural Topologies: Order Fulfillment Walkthrough
            </h3>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Comparing Command Dispatch vs. Event Pub/Sub in a Distributed E-Commerce Flow
          </p>
        </div>

        <!-- Diagram 1: Centralized Orchestration Topology -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="font-code text-[12px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              ORCHESTRATION TOPOLOGY (TEMPORAL / STEP FUNCTIONS)
            </span>
            <span class="text-[11px] font-code text-slate-400">Explicit Command Invocations · Centralized State Machine</span>
          </div>

          <div class="bg-[#0A0E1A] border border-[#1E293B] rounded-xl p-4 font-code text-[12px] leading-relaxed text-slate-300 overflow-x-auto">
            <pre class="text-[#38BDF8]">
[Client] ────POST /order────► [Order Orchestrator (Temporal Workflow)]
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │ 1. cmd: ReserveStock      │ 2. cmd: AuthorizePayment  │ 3. cmd: CreateShipment
           ▼                           ▼                           ▼
  [Inventory Service]          [Payment Service]          [Shipping Service]
   (Updates Inv DB)             (Calls Stripe Gateway)     (Generates Tracking)
           │                           │                           │
           └───────────┬───────────────┴───────────┬───────────────┘
                       │                           │
                   ACK: 200 OK                 ACK: 200 OK
                       ▼                           ▼
        [Orchestrator records step in immutable append-only Event History]
            * If Step 2 fails: Orchestrator triggers Compensate(ReleaseStock)!
            </pre>
          </div>
        </div>

        <!-- Diagram 2: Decentralized Choreography Topology -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="font-code text-[12px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">share</span>
              CHOREOGRAPHY TOPOLOGY (APACHE KAFKA / EVENT-DRIVEN)
            </span>
            <span class="text-[11px] font-code text-slate-400">Decentralized Event Fan-Out · Implicit Flow</span>
          </div>

          <div class="bg-[#0A0E1A] border border-[#1E293B] rounded-xl p-4 font-code text-[12px] leading-relaxed text-slate-300 overflow-x-auto">
            <pre class="text-[#C084FC]">
[Client] ──► [Order Service]
                  │
                  ▼ pub: OrderPlaced
        ┌───────────────────────────────────────────────────────────┐
        │                 Apache Kafka Topic: orders                │
        └──────────────┬────────────────────────────┬───────────────┘
                       │                            │
                       ▼ sub: OrderPlaced           ▼ sub: OrderPlaced
               [Payment Service]           [Inventory Service]
                       │                            │
                       ▼ pub: PaymentCaptured       ▼ pub: InventoryReserved
        ┌─────────────────────────────┐    ┌────────────────────────┐
        │  Kafka Topic: payments-v1   │    │ Kafka Topic: stock-v1  │
        └──────────────┬──────────────┘    └────────┬───────────────┘
                       │                            │
                       └──────────────┬─────────────┘
                                      ▼ sub: PaymentCaptured & InventoryReserved
                              [Shipping Service]
                                      │
                                      ▼ pub: ShipmentDispatched
            </pre>
          </div>
        </div>

        <!-- Deep-Dive Tradeoff Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] font-sans">
          <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-2">
            <span class="font-bold text-cyan-300 font-code text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">manage_search</span>
              Orchestration Failure Modes & Bottlenecks
            </span>
            <ul class="list-disc pl-4 space-y-1 text-slate-300">
              <li><strong>State Store IOPS Bottleneck:</strong> Orchestrator state database must persist an event for every state change. High transaction volume requires sharding the orchestrator backing database.</li>
              <li><strong>Tight Semantic Coupling:</strong> The orchestrator developer must understand domain contracts of all invoked microservices.</li>
              <li><strong>Activity Timeouts:</strong> Long-running activities require heartbeat monitoring to detect dead worker nodes without prematurely triggering compensations.</li>
            </ul>
          </div>

          <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-2">
            <span class="font-bold text-purple-300 font-code text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">crisis_alert</span>
              Choreography Failure Modes & Bottlenecks
            </span>
            <ul class="list-disc pl-4 space-y-1 text-slate-300">
              <li><strong>Circular Event Storms:</strong> Microservice bugs can trigger infinite event loops (Event A $\to$ Service B $\to$ Event C $\to$ Service A).</li>
              <li><strong>Distributed Deadlocks:</strong> Service X waits for Event Y while Service Y waits for Event X; neither completes.</li>
              <li><strong>Complex Rollbacks:</strong> If Payment succeeds but Inventory fails, Shipping must listen for <code>PaymentRefunded</code> and cancel labels in flight.</li>
            </ul>
          </div>
        </div>

        <!-- Official Page 100 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 100</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 101: COMPARISON MATRIX, SENIOR PERSPECTIVE & TAKEAWAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h3 class="font-sans text-[20px] sm:text-[22px] font-bold text-white tracking-tight leading-snug">
              Orchestration vs. Choreography Comparison Matrix
            </h3>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Evaluating Architectural Trade-offs Across Distributed Systems Dimensions
          </p>
        </div>

        <!-- Multi-Dimensional Comparison Table -->
        <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0A0E1A]">
          <table class="w-full text-left text-[12.5px] font-sans border-collapse">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#24314A] text-white font-bold font-code text-[11px] tracking-wider uppercase">
                <th class="py-3.5 px-4 w-1/4">Architectural Dimension</th>
                <th class="py-3.5 px-4 w-[37.5%] text-cyan-300">Orchestration (Workflow Engine)</th>
                <th class="py-3.5 px-4 w-[37.5%] text-purple-300">Choreography (Event Bus / Log)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E293B]">
              ${comparisonMatrix.map((row, idx) => `
                <tr class="${idx % 2 === 0 ? 'bg-[#0F172A]/50' : 'bg-[#0A0E1A]'} hover:bg-[#1E293B]/40 transition-colors">
                  <td class="py-3 px-4 font-medium text-slate-300 font-code text-[11.5px]">${row.dimension}</td>
                  <td class="py-3 px-4 ${row.orchClass} leading-relaxed">${row.orchestration}</td>
                  <td class="py-3 px-4 ${row.choreoClass} leading-relaxed">${row.choreography}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#062419] border-l-4 border-[#10B981] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-emerald-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">psychology</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: AVOID THE PURE CHOREOGRAPHY TRAP
            </span>
          </div>
          <p class="text-[13.5px] text-emerald-100 font-sans leading-relaxed">
            In the late 2010s, many engineering teams fell into the dogmatic trap of pure choreography: <em>'Everything should be an event in Kafka! Microservices must never talk to a coordinator!'</em>
            Two years later, these teams were drowning in <strong>event pinball</strong>. When an e-commerce order hung in an intermediate state, nobody could explain which service failed or why compensating transactions did not fire.
          </p>
          <p class="text-[13.5px] text-emerald-100/90 font-sans leading-relaxed">
            Staff engineers use the <strong>Hybrid Rule</strong>: If a business transaction requires a defined sequence, timeouts, and rollbacks (e.g. checkout, money movement, onboarding), use a modern durable orchestrator like <strong>Temporal</strong>. If a step is purely reactive, asynchronous, and non-blocking (e.g. notifications, search index sync, data lake ingest), emit a domain event to <strong>Kafka</strong>.
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
            Orchestrate what must be correct, ordered, and observable; choreograph what must be decoupled, reactive, and extensible. Real architectures mix both. In an interview, immediately identify which parts of the user journey belong in the transactional core versus the reactive tail.
          </p>
        </div>

        <!-- Official Page 101 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 101</span>
        </div>

      </div>

    </div>
  `;
}
