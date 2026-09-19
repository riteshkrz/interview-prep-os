/**
 * 6.3 Distributed Transactions: 2PC vs. Saga Pattern - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 81 and 82
 * from The Modern System Design Interview Guide.
 */

export function renderDistributedTransactionsSagaContent(topic) {
  const comparisonMatrix = [
    {
      dimension: "Coordination Model",
      twopc: "Centralized XA Coordinator (Synchronous blocking RPCs)",
      twopcClass: "text-rose-400 font-bold",
      choreo: "Decentralized Pub/Sub (Domain events published to message broker)",
      choreoClass: "text-cyan-300",
      orchestrator: "Centralized Workflow Engine (State machine orchestrator)",
      orchestratorClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Atomicity Guarantee",
      twopc: "Strict: All-or-Nothing across all participant databases",
      twopcClass: "text-slate-300",
      choreo: "Eventual: Forward execution or reverse compensating transactions",
      choreoClass: "text-emerald-400 font-bold",
      orchestrator: "Eventual: Orchestrator executes compensations on failure",
      orchestratorClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Data Consistency",
      twopc: "Strong Consistency: Data committed simultaneously everywhere",
      twopcClass: "text-slate-300",
      choreo: "Eventual Consistency: Intermediate states temporarily visible",
      choreoClass: "text-amber-300",
      orchestrator: "Eventual Consistency: Explicit state machine transitions",
      orchestratorClass: "text-amber-300"
    },
    {
      dimension: "Database Lock Duration",
      twopc: "Long-lived blocking locks held open across network roundtrips",
      twopcClass: "text-rose-400 font-bold",
      choreo: "Zero distributed locks: Local DB transactions commit in milliseconds",
      choreoClass: "text-emerald-400 font-bold",
      orchestrator: "Zero distributed locks: Local DB transactions commit in milliseconds",
      orchestratorClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "System Availability",
      twopc: "Catastrophic: Product of all participants (A_system = A_coord × A_1 × A_2...)",
      twopcClass: "text-rose-400 font-bold",
      choreo: "High: Services process asynchronously; unblocked by transient downtime",
      choreoClass: "text-emerald-400 font-bold",
      orchestrator: "High: Fault-tolerant persistent state engine with automated retries",
      orchestratorClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Cognitive Complexity",
      twopc: "Low application logic; heavy low-level DB driver protocol config",
      twopcClass: "text-slate-400",
      choreo: "High: Event spaghetti, circular dependencies, invisible global state",
      choreoClass: "text-amber-400 font-bold",
      orchestrator: "Moderate: Workflow code explicitly defines steps and rollbacks",
      orchestratorClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Microservices Fit",
      twopc: "Anti-pattern: Violates service autonomy and cloud database models",
      twopcClass: "text-rose-400 font-bold",
      choreo: "Good for small 2–3 service flows without complex branching",
      choreoClass: "text-cyan-300",
      orchestrator: "Industry Standard for complex enterprise multi-step workflows",
      orchestratorClass: "text-emerald-400 font-bold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why is Two-Phase Commit (2PC) considered an anti-pattern in cloud microservices?",
      answer: `While 2PC provides strict ACID guarantees in monolithic databases, it breaks catastrophically in distributed cloud architectures:
      <br/><br/>
      <strong class="text-indigo-400">The Four 2PC Failure Modes:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Blocking Database Locks:</strong> During Phase 1 (Prepare), every participating database acquires exclusive row locks. These locks remain held across multiple network hops until Phase 2 finishes. If one participant is slow, <em>all other services freeze waiting for locks to release</em>.</li>
        <li><strong>Coordinator Single Point of Failure (SPOF):</strong> If the transaction coordinator crashes after participants vote "YES" but before sending "COMMIT", participants are left in an <strong>in-doubt state</strong>. They cannot abort or commit independently and must hold locks indefinitely.</li>
        <li><strong>Availability Multiplication Collapse:</strong> If each of 5 services has 99.9% uptime, system availability drops to <code class="text-amber-300 bg-black/40 px-1 py-0.5 rounded">0.999^5 ≈ 99.5%</code>. If any node is down, the entire transaction fails.</li>
        <li><strong>Heterogeneous Datastore Incompatibility:</strong> Modern cloud datastores (DynamoDB, MongoDB, Redis, Cassandra, Stripe API) do not support XA/2PC protocols.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "Choreography vs. Orchestration: What are the concrete criteria for choosing between them?",
      answer: `Choosing between Choreography and Orchestration depends on workflow complexity, team boundaries, and state visibility requirements:
      <br/><br/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-cyan-400 block mb-1">Choose Choreography When:</strong>
          <ul class="list-disc list-inside text-slate-300 text-[12px] space-y-1">
            <li>Workflow is simple (2 to 4 services, linear execution).</li>
            <li>No complex conditional branching or parallel split/joins.</li>
            <li>Team owns all services and prefers zero extra infrastructure.</li>
            <li>Loose coupling and direct pub/sub event semantics are preferred.</li>
          </ul>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-emerald-400 block mb-1">Choose Orchestration When:</strong>
          <ul class="list-disc list-inside text-slate-300 text-[12px] space-y-1">
            <li>Workflow involves 5+ services with branching and compensating paths.</li>
            <li>You need centralized auditability and real-time execution dashboards.</li>
            <li>Steps are long-running (tasks take hours, days, or require human approval).</li>
            <li>Tools like <strong>Temporal.io, AWS Step Functions, or Cadence</strong> are available.</li>
          </ul>
        </div>
      </div>`
    },
    {
      qNum: "Q3",
      question: "What is the Transactional Outbox Pattern and why is it mandatory in Saga implementations?",
      answer: `In any Saga step, a service must execute two actions: <strong>(1) update its local database</strong> and <strong>(2) publish a domain event to a message broker</strong> (e.g. Kafka).
      <br/><br/>
      <strong class="text-indigo-400">The Dual-Write Race Condition:</strong>
      <p class="text-slate-300 mt-1">
        If you commit to the database first and the message broker is unreachable, the event is never published (downstream services never run). If you publish to the broker first and the database commit fails, downstream services process a phantom transaction.
      </p>
      <br/>
      <strong class="text-emerald-400">The Outbox Architecture Solution:</strong>
      <ol class="list-decimal list-inside mt-1 space-y-1 text-slate-300">
        <li>Create an <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">outbox</code> table in the service's local database.</li>
        <li>Within a <strong>single local ACID database transaction</strong>, update the business tables and insert the domain event into the <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">outbox</code> table. Both succeed or fail together atomically.</li>
        <li>A background Change Data Capture (CDC) process (such as <strong>Debezium</strong> streaming the database WAL) or a lightweight transaction log poller reads the outbox table and reliably forwards events to Kafka with guaranteed at-least-once delivery.</li>
      </ol>`
    },
    {
      qNum: "Q4",
      question: "How do you handle a Compensating Transaction that itself fails?",
      answer: `In a Saga, <strong>compensating transactions are not allowed to fail</strong>. You cannot "rollback a rollback."
      <br/><br/>
      <strong class="text-indigo-400">Production Remediation Strategy:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Indefinite Retries with Exponential Backoff:</strong> Transient network glitches, database locks, or rate limits will eventually resolve. The orchestrator must retry the compensating step until it succeeds.</li>
        <li><strong>Strict Idempotency:</strong> Because the compensation may be executed multiple times due to retries, the compensating endpoint (e.g., <code class="text-amber-300 bg-black/40 px-1 py-0.5 rounded">refundPayment(orderId)</code>) must be strictly idempotent to prevent duplicate refunds.</li>
        <li><strong>Dead Letter & Manual Intervention Queue:</strong> If a compensation fails permanently (e.g., user's bank account is closed), the orchestrator moves the workflow to an <strong class="text-rose-400">Action Required / Failed Compensation State</strong>, alerts on-call SREs via PagerDuty, and logs the incident to a financial reconciliation ledger for human manual remediation.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-8 max-w-5xl mx-auto select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 81, 82: DISTRIBUTED TRANSACTIONS - 2PC VS. SAGA PATTERN -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              6.3 Distributed Transactions: 2PC vs. Saga Pattern
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            In modern microservices architectures, every service manages its own isolated database (<strong class="text-indigo-400">Database-per-Service pattern</strong>). A single business transaction—such as an e-commerce checkout—spans multiple independent databases (Order DB, Payment DB, Inventory DB, Shipping DB). Because physical networks can partition and nodes can crash, single-database ACID guarantees cannot physically exist. Distributed systems must choose between synchronous blocking protocols (<strong class="text-rose-400">Two-Phase Commit / 2PC</strong>) and asynchronous compensating workflows (<strong class="text-emerald-400">The Saga Pattern</strong>).
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-rose-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-rose-300 uppercase">1. Two-Phase Commit (2PC): The Anti-Pattern</span>
              <span class="text-[12px] text-slate-300">Synchronously coordinates commit across participants. Holds blocking database row locks across network roundtrips. Fragile coordinator SPOF; availability collapses at scale.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">2. The Saga Pattern: The Cloud Standard</span>
              <span class="text-[12px] text-slate-300">A sequence of local ACID transactions. Each step commits immediately and releases locks. If a subsequent step fails, compensating transactions run in reverse to undo changes.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Concurrency Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              DISTRIBUTED TRANSACTION ARCHITECTURES: 2PC LOCKING VS. SAGA COMPENSATING WORKFLOW
            </span>
            <span class="text-slate-500 text-[10.5px]">Transaction Mechanics</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. TWO-PHASE COMMIT (2PC): SYNCHRONOUS BLOCKING LOCKS (XA PROTOCOL)                              │
│                                                                                                  │
│   Coordinator ──── Phase 1: PREPARE? ────► [ Participant 1 ] (Acquires row lock, votes YES)      │
│               ──── Phase 1: PREPARE? ────► [ Participant 2 ] (Acquires row lock, votes YES)      │
│                                                                                                  │
│   * Critical Danger: Locks held across network roundtrips. If Coordinator crashes before Phase 2,│
│     all participant tables remain LOCKED indefinitely (In-Doubt state). System halts.            │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. CHOREOGRAPHY-BASED SAGA: DECENTRALIZED EVENT STREAMING (KAFKA)                                │
│                                                                                                  │
│   [ Order Service ] ──► Emits: "OrderCreated" ──► [ Payment Service ]                            │
│                                                          │                                       │
│                                           Payment OK? ───┴─── Payment Failed?                    │
│                                                │                    │                            │
│                                                ▼                    ▼                            │
│                                   Emits: "PaymentApproved"   Emits: "PaymentFailed"              │
│                                                │                    │                            │
│                                                ▼                    ▼                            │
│                                       [ Inventory Service ]   [ Order Service ]                  │
│                                       (Deducts Stock)        (Compensates: Sets status=CANCELLED)│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. ORCHESTRATION-BASED SAGA: CENTRALIZED STATE MACHINE (TEMPORAL / STEP FUNCTIONS)               │
│                                                                                                  │
│                        ┌─────────────────────────────────────┐                                   │
│                        │       SAGA ORCHESTRATOR ENGINE      │                                   │
│                        │   (Persistent Workflow State Mach)  │                                   │
│                        └───────┬─────────────┬─────────────┬─┘                                   │
│                                │             │             │                                     │
│                1. ExecuteCmd() │             │             │ 3. CompensateCmd()                  │
│                                ▼             │             ▼ (on failure)                        │
│                       [ Order Service ]      │     [ Payment Service ]                           │
│                       (Create PENDING)       │     (Refund $50)                                  │
│                                              ▼                                                   │
│                                     2. ExecuteCmd()                                              │
│                                     [ Inventory Service ] ──► (FAILED: Out of Stock!)            │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- High-Signal Comparison Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">table_chart</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              2PC vs. Choreography Saga vs. Orchestration Saga Matrix
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-semibold">
                  <th class="py-3 px-4 w-[18%]">Transaction Dimension</th>
                  <th class="py-3 px-4 w-[26%] text-rose-400">Two-Phase Commit (2PC)</th>
                  <th class="py-3 px-4 w-[28%] text-cyan-300">Choreography Saga (Pub/Sub)</th>
                  <th class="py-3 px-4 w-[28%] text-emerald-400">Orchestration Saga (Engine)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] bg-[#0A0E1A]">
                ${comparisonMatrix.map(row => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-200 border-r border-[#24314A]/50 bg-[#0F172A]/40">
                      ${row.dimension}
                    </td>
                    <td class="py-3 px-4 ${row.twopcClass} border-r border-[#24314A]/50">
                      ${row.twopc}
                    </td>
                    <td class="py-3 px-4 ${row.choreoClass} border-r border-[#24314A]/50">
                      ${row.choreo}
                    </td>
                    <td class="py-3 px-4 ${row.orchestratorClass}">
                      ${row.orchestrator}
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
            SENIOR PERSPECTIVE: THREE UNBREAKABLE RULES FOR PRODUCTION SAGAS
          </span>
          <p class="text-[13px] font-sans text-emerald-100 leading-relaxed">
            Implementing Sagas in production requires addressing subtle distributed failure modes that do not exist in monolithic databases:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-[12px] font-sans">
            <div class="bg-black/40 p-2.5 rounded border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-emerald-300 font-bold">1. Compensations MUST Be Idempotent</strong>
              <span class="text-slate-300">Network retries or broker re-deliveries mean a compensating transaction (e.g. <code class="text-cyan-300 text-[10.5px]">refundPayment(orderId)</code>) may be triggered multiple times. It must never execute duplicate refunds.</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-emerald-300 font-bold">2. Compensations CANNOT Fail</strong>
              <span class="text-slate-300">You cannot "rollback a rollback." If a compensating call times out, the orchestrator must retry indefinitely with exponential backoff until it succeeds, or alert an SRE via manual intervention queues.</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-emerald-300 font-bold">3. Step Ordering Matters</strong>
              <span class="text-slate-300">Place irreversible, non-compensatable actions (e.g., sending customer confirmation emails or physically loading a warehouse pallet) as the absolute FINAL step of the Saga after all pivots pass.</span>
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: The Lack of Isolation (ACID without the I) -->
        <div class="bg-[#2A1608] border-l-4 border-[#F97316] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            THE SAGA VULNERABILITY: THE LACK OF ISOLATION (ACID WITHOUT THE "I")
          </span>
          <p class="text-[13px] font-sans text-amber-100 leading-relaxed">
            In standard ACID transactions, changes are invisible to other transactions until committed (<strong class="text-white">Isolation</strong>). In a Saga, each local transaction commits immediately. This means intermediate states are visible to external users and concurrent transactions (<strong class="text-white">Dirty Reads</strong>).
          </p>
          <p class="text-[12.5px] font-sans text-amber-200/90 leading-relaxed pt-1">
            <strong>The Scenario:</strong> Step 1 reserves warehouse stock. User B sees stock is 0 and leaves the store. In Step 2, Payment fails and Step 1 compensates, restocking inventory. User B missed a sale due to an intermediate dirty state!
            <br/><br/>
            <strong>Architectural Mitigations:</strong>
            <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300 text-[12px]">
              <li><strong>Semantic Locks:</strong> Mark records with intermediate pending states (e.g., <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">status = 'ORDER_PENDING'</code> or <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">stock_reserved = 5</code>) rather than deducting outright.</li>
              <li><strong>Commutative Updates:</strong> Design operations such that order of execution does not alter final state (e.g., account balance delta tracking).</li>
            </ul>
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
            Never propose Two-Phase Commit (2PC) for microservices in system design interviews. Embrace eventual consistency using the Saga Pattern with compensating transactions. Use Choreography for simple 2–3 service flows, Orchestration (Temporal / Step Functions) for complex multi-step enterprise workflows, and always pair local database updates with the Transactional Outbox Pattern to guarantee message delivery without dual-write inconsistencies.
          </p>
        </div>

        <!-- Page 82 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 82</span>
        </div>

      </div>

    </div>
  `;
}
