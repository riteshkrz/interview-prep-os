/**
 * Event Sourcing and CQRS (Topic 13.1)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 163–165
 */

export function renderEventSourcingCqrsContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="event-sourcing-cqrs">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 13.1 · Pages 163–165
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            State Evolution Architecture
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Append-Only Logs · Asymmetric Read/Write Models · Crypto-Shredding</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Event Sourcing & Command Query Responsibility Segregation (CQRS)</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Traditional databases mutate state in-place, permanently discarding the causal history of why a value changed. Event Sourcing models state as an append-only sequence of immutable business facts. CQRS splits the write model (optimised for atomic append validation) from read models (optimised materialized views for query performance).
      </p>
    </div>

    <!-- ASCII Architecture Diagram -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        Event Sourcing & CQRS End-to-End Topology (Page 164)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
   [ COMMAND PATH (Writes) ]                              [ QUERY PATH (Reads) ]
         Client                                                   Client
           │ (POST /orders/checkout)                                │ (GET /orders/summary)
           ▼                                                        ▼
    Command Handler                                            Query Service
           │ Validate business rules                                │
           ▼                                                        ▼
   ┌───────────────────────┐                          ┌────────────────────────┐
   │   EVENT STORE         │                          │   READ PROJECTIONS     │
   │ (Append-Only Log)     │                          │ (Materialized Views)   │
   │                       │                          │ • PostgreSQL (Orders)  │
   │ 1. OrderCreated       │                          │ • Elasticsearch (Text) │
   │ 2. PaymentReserved    │                          │ • Redis (User Cache)   │
   │ 3. InventoryAllocated │                          └───────────▲────────────┘
   └───────────┬───────────┘                                      │
               │ Stream changes                                   │ Project / Upsert
               ▼                                                  │
       CDC / Kafka Event Bus ─────────────────────────────────────┘
       (Ordered partition by OrderID)
</pre>
      </div>
    </div>

    <!-- Key Core Principles Grid -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        The 3 Structural Mechanics of Event Sourcing
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-2">1. IMMUTABLE FACTS</div>
          <p class="text-slate-300 leading-relaxed font-sans">
            Events represent things that have already happened in the past tense (<code class="text-cyan-300">OrderPlaced</code>, <code class="text-cyan-300">PaymentFailed</code>). They can never be modified or deleted. State at timestamp $T$ is derived by replaying events from genesis up to $T$.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-2">2. REHYDRATION & SNAPSHOTS</div>
          <p class="text-slate-300 leading-relaxed font-sans">
            Replaying 50,000 events to compute a customer balance introduces severe latency. Every $N$ events (e.g. 500 events), the system commits a <strong>Snapshot</strong>. Rehydration loads the latest snapshot and replays only subsequent events.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-2">3. MULTIPLE PROJECTIONS</div>
          <p class="text-slate-300 leading-relaxed font-sans">
            Write models do not need indexes for filtering. Read models are tailored: Elasticsearch for free-text search, Neo4j for social graphs, and Redis for 1ms dashboard lookups. Adding a new query pattern is just building a new consumer!
          </p>
        </div>
      </div>
    </div>

    <!-- GDPR Compliance & Crypto Shredding -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        The GDPR Paradox: "Right to be Forgotten" in an Append-Only Store
      </h3>
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3 leading-relaxed">
        <p class="text-slate-300">
          <strong class="text-amber-300">The Conflict:</strong> GDPR Article 17 demands total erasure of personal data on customer request. But an append-only event store forbids mutating or deleting historical records (rewriting the log invalidates cryptographic chains and event offsets).
        </p>
        <div class="p-3 rounded-lg bg-[#0F1626] border border-cyan-500/30 text-cyan-200 font-mono">
          <div class="font-bold text-white mb-1">THE SENIOR ANSWER: CRYPTO-SHREDDING</div>
          1. Store personal identifying information (PII: name, email, phone) encrypted with a per-user KMS key.<br/>
          2. Event record stores ciphertext: <code class="text-slate-300">payload: { order_id: 88, user_pii: "enc_g819..." }</code>.<br/>
          3. When a deletion request arrives: permanently destroy that specific user's decryption key in KMS.<br/>
          4. Result: The event log remains 100% append-only and cryptographically valid, but the PII is irrevocably rendered unrecoverable random noise!
        </div>
      </div>
    </div>

    <!-- Tradeoffs Table: Event Sourcing vs CRUD -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Architectural Trade-offs: Event Sourcing vs. Standard In-Place CRUD
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Dimension</th>
              <th class="p-3 font-semibold text-cyan-300">Event Sourcing + CQRS</th>
              <th class="p-3 font-semibold text-slate-400">In-Place State CRUD</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">Audit & History</td>
              <td class="p-3 text-cyan-200">100% complete audit log built-in; zero data loss of intent</td>
              <td class="p-3 text-slate-400">Lost on update; requires separate brittle audit tables</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Read/Write Coupling</td>
              <td class="p-3 text-cyan-200">Completely decoupled; reads scale without locking writes</td>
              <td class="p-3 text-slate-400">Shared tables; heavy reporting queries lock write paths</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Consistency</td>
              <td class="p-3 text-amber-300">Eventual consistency on read models (projection lag)</td>
              <td class="p-3 text-emerald-300">Immediate read-your-writes consistency within single DB</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Schema Evolution</td>
              <td class="p-3 text-rose-300">Hard; old events must be readable forever (Upcasting/Adapters)</td>
              <td class="p-3 text-emerald-300">Standard ALTER TABLE and SQL migrations</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Operational Complexity</td>
              <td class="p-3 text-rose-300">High: Requires Kafka/CDC, event schemas, projection repair</td>
              <td class="p-3 text-emerald-300">Low: Single relational database cluster</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Staff Interview Follow-ups -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Staff Interview Follow-ups (Page 165)
      </h3>
      <div class="space-y-3 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q1: How do you handle "read-your-own-writes" when projections are asynchronous?</h4>
          <p class="text-slate-300 leading-relaxed">
            When a user places an order, the projection in PostgreSQL may lag by 50–200 ms. Options: (1) Return the newly committed event ID in the write response; the client sends this version in GET requests, and the query service waits on the local projection offset or falls back to reading the event store directly; (2) Optimistically update UI state on the frontend; (3) For critical immediate workflows, query the write-side aggregate rehydration cache.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q2: How do you rebuild a corrupted projection from scratch?</h4>
          <p class="text-slate-300 leading-relaxed">
            Because the Event Store is the single source of truth, projections are disposable. Create a new empty database table/index (<code class="text-cyan-300">orders_v2</code>). Start a new consumer group at offset 0 that replays history from genesis. When the consumer reaches within seconds of real-time, atomically switch the application query pointer to <code class="text-cyan-300">orders_v2</code> and drop the old corrupted view with zero downtime.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 165)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Use Event Sourcing when auditability, complex domain transactions, or multiple tailored query representations are mandatory (ledgers, logistics, e-commerce checkout). Solve GDPR erasure with crypto-shredding per-user encryption keys, bound replay latency with periodic aggregate snapshots, and accept eventual consistency on read projections."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
