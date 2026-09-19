/**
 * 6.4 Event-Driven Architecture - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 83, 84, and 85
 * from The Modern System Design Interview Guide.
 */

export function renderEventDrivenArchitectureContent(topic) {
  const comparisonMatrix = [
    {
      pattern: "Event Notification",
      definition: "Emits minimal event payload notifying that a state change occurred (e.g. { orderId: 4812, event: 'OrderPlaced' })",
      payloadSize: "Minimal (tiny JSON / byte payload)",
      coupling: "High temporal coupling: Consumer must call back producer via RPC to fetch full state",
      overhead: "Higher network overhead due to secondary request-response query roundtrips",
      patternClass: "text-amber-300 font-bold"
    },
    {
      pattern: "Event-Carried State Transfer",
      definition: "Emits a fat payload containing both the event and the complete entity state snapshot",
      payloadSize: "Large (full customer, items, address, and pricing payload)",
      coupling: "Zero query coupling: Consumer has all required data locally; no callback needed",
      overhead: "Higher message broker bandwidth; risk of consumer processing stale cached fields",
      patternClass: "text-cyan-300 font-bold"
    },
    {
      pattern: "Event Sourcing",
      definition: "Persists the state of a business entity as an append-only sequence of immutable domain events",
      payloadSize: "Granular domain events (OrderCreated, ItemAdded, OrderShipped)",
      coupling: "State is reconstructed by replaying events from genesis; zero destructive updates",
      overhead: "Requires event log compaction or snapshots for entities with thousands of events",
      patternClass: "text-emerald-400 font-bold"
    },
    {
      pattern: "CQRS (Command Query Segregation)",
      definition: "Separates the Write Model (optimized for commands & validation) from the Read Model (optimized for queries)",
      payloadSize: "Writes hit normalized event store; reads hit denormalized Elasticsearch/Redis/Postgres projections",
      coupling: "High flexibility: Read models can be rebuilt or redesigned without modifying write storage",
      overhead: "Eventual consistency gap: Read model projections lag behind write execution by milliseconds",
      patternClass: "text-indigo-300 font-bold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Event Sourcing vs. CQRS: Do you always need to implement both patterns together?",
      answer: `<strong>No, they are orthogonal architectural patterns that can be used independently:</strong>
      <br/><br/>
      <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300">
        <li><strong>CQRS without Event Sourcing:</strong> Extremely common. A relational database (PostgreSQL) handles transactional write commands, and changes are streamed via Change Data Capture (Debezium CDC) into an <em>Elasticsearch cluster for text search</em> or a <em>Redis cache for profile lookups</em>. The write model stores standard current state, not an event log.</li>
        <li><strong>Event Sourcing without CQRS:</strong> Feasible for simple domains where the event stream itself is small enough to be queried directly, or where all reads are handled by an in-memory projection within the same process.</li>
        <li><strong>Why They Synergize:</strong> When you use Event Sourcing, querying an append-only log for complex joins (e.g. <em>"Find all orders placed in Germany with total &gt; $100"</em>) is computationally prohibitive. <strong>CQRS is the natural companion to Event Sourcing</strong> because materialized view projections transform the event log into fast, read-optimized database tables.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is the concrete tradeoff between Event Notification and Event-Carried State Transfer?",
      answer: `In system design interviews, this is the classic <strong>"Thin Event" vs. "Fat Event"</strong> architectural dilemma:
      <br/><br/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-amber-300 block mb-1">Event Notification (Thin Event)</strong>
          <span class="text-slate-300 text-[12px]">
            Payload only includes ID: <code class="text-cyan-300">{ orderId: "9823" }</code>.
            <br/><br/>
            <strong>Pros:</strong> Zero data duplication; broker stays lean; privacy-friendly (no PII in logs).
            <br/>
            <strong>Cons:</strong> 5 downstream consumers all fire synchronous HTTP GET requests back to Order Service at the exact same instant, creating a <em>thundering herd on the producer</em>.
          </span>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-[#24314A]">
          <strong class="text-cyan-300 block mb-1">Event-Carried State (Fat Event)</strong>
          <span class="text-slate-300 text-[12px]">
            Payload includes all fields: customer, items, shipping, payment details.
            <br/><br/>
            <strong>Pros:</strong> Consumers are 100% autonomous; zero callback traffic; resilient to producer outages.
            <br/>
            <strong>Cons:</strong> Broker message size grows; consumers may cache stale data; schema changes impact every consumer.
          </span>
        </div>
      </div>`
    },
    {
      qNum: "Q3",
      question: "How do you solve the Dual-Write race condition in Event-Driven Systems?",
      answer: `When an application must update its local database AND emit an event to Kafka, doing both in separate network calls guarantees inconsistency (if the DB commits but Kafka fails, the event is lost; if Kafka succeeds but DB rolls back, you publish a phantom event).
      <br/><br/>
      <strong class="text-indigo-400">The Universal Solution: The Transactional Outbox Pattern:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Create an <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">outbox</code> table in the service's relational database.</li>
        <li>Within a <strong>single ACID local transaction</strong>, write the business entity update AND insert the outgoing event payload into the <code class="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">outbox</code> table. Both atomically commit or abort together.</li>
        <li>A dedicated Change Data Capture (CDC) engine (e.g. <strong>Debezium</strong> reading PostgreSQL WAL logs) streams outbox records directly into Apache Kafka topics with guaranteed at-least-once delivery.</li>
      </ol>`
    },
    {
      qNum: "Q4",
      question: "How does Event Sourcing satisfy GDPR's 'Right to be Forgotten' when the event log is strictly immutable?",
      answer: `Because Event Sourcing relies on an append-only, immutable commit log (Kafka, EventStoreDB), deleting or modifying past events to erase personal data (PII) violates the core architectural invariant of the system.
      <br/><br/>
      <strong class="text-emerald-400">The Industry Standard: Cryptographic Shredding (Crypto-Shredding):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>When creating events containing Personally Identifiable Information (PII like name, address, email), encrypt the sensitive payload fields using a <strong>unique per-user cryptographic key</strong> stored in an external Key Management Service (AWS KMS / HashiCorp Vault).</li>
        <li>Store the encrypted ciphertext inside the immutable event log.</li>
        <li>When the user exercises their GDPR Right to be Forgotten, <strong>permanently delete the user's specific encryption key</strong> from the KMS.</li>
        <li>The historical events remain physically intact in the log (preserving sequence numbers, timestamps, and financial ledger integrity), but the encrypted PII becomes <strong>mathematically unrecoverable random noise</strong>, fully satisfying GDPR erasure requirements!</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-8 max-w-5xl mx-auto select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 83, 84, 85: EVENT-DRIVEN ARCHITECTURE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              6.4 Event-Driven Architecture
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            An <strong class="text-cyan-400">Event-Driven Architecture (EDA)</strong> is a software design pattern where state changes—called <strong class="text-white">Events</strong>—are produced, detected, and consumed asynchronously across distributed boundaries. Unlike synchronous request-response systems (RPC/REST), the producer publishes an event to an event broker without any awareness of who will consume it, when it will be consumed, or how many downstream consumers exist.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">1. Event Immutability</span>
              <span class="text-[12px] text-slate-300">An event is an immutable statement of a past fact (<code class="text-cyan-300 text-[11px]">OrderPlaced</code>, <code class="text-cyan-300 text-[11px]">PaymentDeclined</code>). It cannot be modified, edited, or retracted after publication.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">2. Unbounded Event Streams</span>
              <span class="text-[12px] text-slate-300">Events flow continuously as an ordered, append-only commit stream. Consumers process events at their own velocity, maintaining complete temporal decoupling.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Concurrency Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              EVENT-DRIVEN PATTERNS: CHOREOGRAPHY VS. EVENT SOURCING & CQRS
            </span>
            <span class="text-slate-500 text-[10.5px]">Architecture Blueprints</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. EVENT CHOREOGRAPHY: DECENTRALIZED PUB/SUB FANOUT                                              │
│                                                                                                  │
│   [ Order Service ] ──► Publishes: "OrderPlaced" ──► [ Kafka Topic: orders ]                     │
│                                                               │                                  │
│                                ┌──────────────────────────────┼──────────────────────────────┐   │
│                                ▼                              ▼                              ▼   │
│                      [ Payment Service ]            [ Inventory Service ]          [ Analytics ] │
│                      (Processes card)               (Deducts stock)                (Tracks GMV)  │
│                                │                                                                 │
│                                ▼                                                                 │
│                      Publishes: "PaymentCaptured" ──► [ Kafka Topic: payments ]                  │
│                                                               │                                  │
│                                                               ▼                                  │
│                                                     [ Shipping Service ]                         │
│                                                     (Generates shipping label)                   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. EVENT SOURCING & CQRS: COMMAND WRITE MODEL VS. QUERY READ PROJECTIONS                         │
│                                                                                                  │
│   Client Commands (Write)                                   Client Queries (Read)                │
│             │                                                         ▲                          │
│             ▼                                                         │                          │
│   ┌───────────────────────────┐                             ┌─────────────────────────┐          │
│   │   COMMAND / WRITE MODEL   │                             │    READ / QUERY MODEL   │          │
│   │  (Business Logic & State) │                             │   (Materialized Views)  │          │
│   └─────────────┬─────────────┘                             └────────────▲────────────┘          │
│                 │                                                        │                       │
│                 ▼                                                        │ Projections           │
│   ┌───────────────────────────┐                                          │ (Event Handlers)      │
│   │  IMMUTABLE EVENT STORE    │                                          │                       │
│   │  (Append-Only Log)        │ ──── Stream Events via Kafka / CDC ──────┘                       │
│   │  [0] OrderCreated         │ ──► Elasticsearch (Full-text Search index)                       │
│   │  [1] ItemAdded (SKU-89)   │ ──► PostgreSQL (Normalized reporting tables)                     │
│   │  [2] ShippingAddressSet   │ ──► Redis (Sub-millisecond user cache)                           │
│   └───────────────────────────┘                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- High-Signal Comparison Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">table_chart</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              Event-Driven Communication & Persistence Taxonomy
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-semibold">
                  <th class="py-3 px-4 w-[20%]">Pattern</th>
                  <th class="py-3 px-4 w-[35%] text-slate-300">Definition & Mechanics</th>
                  <th class="py-3 px-4 w-[22%] text-cyan-300">Coupling & Payload</th>
                  <th class="py-3 px-4 w-[23%] text-emerald-400">Architectural Overhead</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] bg-[#0A0E1A]">
                ${comparisonMatrix.map(row => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="py-3 px-4 ${row.patternClass} border-r border-[#24314A]/50 bg-[#0F172A]/40">
                      ${row.pattern}
                    </td>
                    <td class="py-3 px-4 text-slate-300 border-r border-[#24314A]/50">
                      ${row.definition}
                    </td>
                    <td class="py-3 px-4 text-slate-300 border-r border-[#24314A]/50 text-[12px]">
                      ${row.coupling}
                    </td>
                    <td class="py-3 px-4 text-slate-300 text-[12px]">
                      ${row.overhead}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout: Schema Evolution & Registry -->
        <div class="bg-[#0D241E] border-l-4 border-[#10B981] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">verified</span>
            EVENT SCHEMA EVOLUTION: CONFLUENT SCHEMA REGISTRY & AVRO/PROTOBUF
          </span>
          <p class="text-[13px] font-sans text-emerald-100 leading-relaxed">
            In an event-driven architecture, event schemas are immutable contracts. If a producer alters an event field or drops a required property without governance, downstream consumer deserializers crash in production.
          </p>
          <p class="text-[12.5px] font-sans text-emerald-200/90 leading-relaxed pt-1">
            <strong>The Production Standard:</strong> Enforce serialization through a <strong class="text-white">Schema Registry</strong> using binary protocols like <em>Apache Avro</em> or <em>Protocol Buffers (Protobuf)</em>. Configure strict <strong class="text-white">Backward Compatibility</strong> (new schemas can read data written by older schemas) or <strong class="text-white">Full Compatibility</strong>. Producers submit their schema before publishing; any breaking change is rejected at build/runtime.
          </p>
        </div>

        <!-- Orange Warning Box: CQRS Eventual Consistency & Read-Your-Own-Writes -->
        <div class="bg-[#2A1608] border-l-4 border-[#F97316] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            CQRS HAZARD: THE READ-MODEL LAG WINDOW & "READ-YOUR-OWN-WRITES" INCONSISTENCY
          </span>
          <p class="text-[13px] font-sans text-amber-100 leading-relaxed">
            In a CQRS architecture, write commands hit the event store immediately, but read views are populated asynchronously via background event consumers. Under heavy load, the read projection lags behind the write store by 50ms to several seconds.
          </p>
          <p class="text-[12.5px] font-sans text-amber-200/90 leading-relaxed pt-1">
            <strong>The User Bug:</strong> A customer updates their profile address, clicks Save, and is redirected to their profile summary page. The page queries the read model—which hasn't processed the event yet—and displays the <em>old address</em>! The confused user clicks Save three more times.
            <br/><br/>
            <strong>Architectural Mitigations:</strong>
            <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300 text-[12px]">
              <li><strong>Optimistic Client Updates:</strong> The frontend updates the local UI immediately assuming write success without waiting for query re-fetch.</li>
              <li><strong>Write Response Payload:</strong> Return the updated entity directly in the HTTP 200 write response rather than redirecting to a GET query.</li>
              <li><strong>Sticky Read / Version Tokens:</strong> Return an event sequence number (<code class="text-amber-300 text-[11px]">seq_1084</code>) to the client. The read query polls the read model with a timeout until the read model's projected version matches or exceeds <code class="text-amber-300 text-[11px]">seq_1084</code>.</li>
            </ul>
          </p>
        </div>

        <!-- Green Box: Senior Perspective Callout -->
        <div class="bg-[#0D241E] border-l-4 border-[#10B981] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: WHEN NOT TO USE EVENT SOURCING & CRYPTO-SHREDDING
          </span>
          <p class="text-[13px] font-sans text-emerald-100 leading-relaxed">
            Junior engineers often jump to Event Sourcing because it sounds intellectually elegant. In reality, Event Sourcing introduces massive operational complexity: event schema versioning, snapshotting high-frequency entities, rebuilding projections, and managing eventual consistency. <strong>For 90% of business applications, a traditional relational model with an audit table is vastly superior and 10× cheaper to maintain.</strong>
          </p>
          <p class="text-[12.5px] font-sans text-emerald-200/90 leading-relaxed pt-1">
            <strong>GDPR Compliance (Crypto-Shredding):</strong> In European jurisdictions, users have the legal "Right to be Forgotten." But an event log is append-only and cannot be altered! Senior engineers solve this by encrypting each user's PII with a unique per-user key stored in KMS. When deletion is requested, delete the encryption key. The event store remains physically untouched, but the data becomes unrecoverable garbage.
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
            Event-driven architecture provides temporal and spatial decoupling, but shifts architectural complexity from synchronous coordination to eventual consistency, schema evolution, and distributed observability. Do not introduce Event Sourcing unless you genuinely require immutable audit trails or temporal state reconstruction. In interviews, clearly articulate how you handle the Transactional Outbox Pattern, schema compatibility via a Schema Registry, and read-your-own-writes consistency in CQRS.
          </p>
        </div>

        <!-- Page 85 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 85</span>
        </div>

      </div>

    </div>
  `;
}
