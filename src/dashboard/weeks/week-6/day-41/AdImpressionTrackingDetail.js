/**
 * Question 20. Design an Ad Impression Tracking System
 * System Design Interview Masterclass — Module 4: Business-critical systems (Pages 87–91)
 * Includes: High-Level Architecture, Event-Processing Sequence & Optional AI/ML Fraud Detection SVG Blueprints
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

function renderSvgDiagramCard({
  svgPath,
  title,
  subtitle,
  badge = 'Razor-Sharp Vector',
  tag = 'Production Spec Blueprint'
}) {
  return `
    <div class="rounded-2xl overflow-hidden border border-[#CBD5E1] dark:border-[#24314A] bg-[#0A0F1D] shadow-md my-4">
      <div class="px-4 py-3 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="material-symbols-outlined text-[18px] text-cyan-400">schema</span>
          <span class="text-[13px] font-bold text-slate-200 tracking-wide">${title}</span>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px]">verified</span>
            ${badge}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <a href="${svgPath}" download class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11.5px] font-semibold flex items-center gap-1 transition-colors">
            <span class="material-symbols-outlined text-[14px]">download</span>
            <span>Save Vector</span>
          </a>
          <a href="${svgPath}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors">
            <span>Open Full Size</span>
            <span class="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      </div>
      <div class="p-3 sm:p-5 bg-[#030712] flex items-center justify-center overflow-x-auto min-h-[320px]">
        <img src="${svgPath}" alt="${title}" class="max-w-full w-full h-auto object-contain rounded-xl shadow-lg hover:brightness-105 transition-all cursor-zoom-in" onclick="window.open(this.src, '_blank')" />
      </div>
      <div class="px-4 py-2 bg-[#0A0F1D] border-t border-slate-800/80 text-[11.5px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
        <span>${subtitle || 'Click diagram or "Open Full Size" to inspect in infinitely scalable vector resolution.'}</span>
        <span class="font-mono text-cyan-400 font-semibold">${tag}</span>
      </div>
    </div>
  `;
}

export function renderAdImpressionTrackingDetail() {
  return renderMasterclassQuestion({
    questionNumber: 20,
    title: "Design an Ad Impression Tracking System",
    moduleName: "Module 4 — Business-critical systems (Pages 87–91)",
    coreTopics: "Event-driven architecture, Kafka, stream processing, deduplication, metadata enrichment, event-time processing, analytical storage, data reconciliation and optional ML-based fraud detection",

    // SECTION 1: PROBLEM STATEMENT
    problemStatement: `Design a distributed system that collects advertisement impression events from websites, applications and ad-serving systems, enriches those events with campaign metadata, calculates near-real-time metrics and stores the raw events for historical reporting and reconciliation.<br/><br/>
    The system must handle very high event throughput while remaining resilient to duplicate events, late arrivals, out-of-order delivery and downstream service failures.<br/><br/>
    For example, when an advertisement is displayed on a website, an impression event may be generated. That event must be captured, validated, associated with the appropriate campaign and creative, and included in the relevant reporting metrics.<br/><br/>
    An advertiser may want to see:
    <ul class="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
      <li>Total impressions for a campaign.</li>
      <li>Impressions by publisher, creative, device type or region.</li>
      <li>Impressions during a particular time window.</li>
      <li>Near-real-time campaign performance.</li>
      <li>Reconciled historical totals for reporting and billing.</li>
      <li>Data-quality or suspicious-traffic indicators.</li>
    </ul><br/>
    The system must support both operational dashboards, which need fresh metrics, and historical reports, which require accurate and reconciled numbers.<br/><br/>
    The key architectural challenge is to <strong class="text-indigo-600 dark:text-indigo-400">accept and process a large volume of events without losing valid impressions or counting duplicate deliveries as separate impressions</strong>.`,

    // SECTION 2: CLARIFYING QUESTIONS
    clarifyingQuestions: [
      {
        q: "What exactly counts as an impression?",
        a: "“An impression is recorded when an advertisement satisfies the agreed measurement criteria. The exact criteria depend on the product and measurement rules.”<br/><span class='text-cyan-600 dark:text-cyan-400 font-semibold block mt-1'>Impact: Ingestion must receive a well-defined event rather than inferring from arbitrary page views. Contract specifies emit triggers &amp; retry IDs.</span>"
      },
      {
        q: "What is the expected throughput?",
        a: "“Assume approximately 100,000 events per second on average, with peaks several times higher (e.g. 500,000+ eps).”<br/><span class='text-cyan-600 dark:text-cyan-400 font-semibold block mt-1'>Impact: Synchronous single DB updates will fail. Demands horizontally scalable ingestion fleet, durable stream, distributed consumers, and analytical OLAP storage.</span>"
      },
      {
        q: "How quickly should the dashboard reflect new events?",
        a: "“Operational dashboards should refresh within seconds to approximately one minute. Fully reconciled historical reports can take longer.”<br/><span class='text-cyan-600 dark:text-cyan-400 font-semibold block mt-1'>Impact: Two complementary paths: streaming for low latency (< 1 min) and batch reconciliation for audit/corrections. Live metrics marked PROVISIONAL.</span>"
      },
      {
        q: "Must events be enriched with campaign metadata?",
        a: "“Yes. We need campaign, creative and publisher information associated with the events.”<br/><span class='text-cyan-600 dark:text-cyan-400 font-semibold block mt-1'>Impact: Synchronous remote metadata API calls per event create fatal bottlenecks. Must use local in-memory caches or replicated views.</span>"
      },
      {
        q: "Can the same impression event arrive more than once?",
        a: "“Yes. Producers may retry after network errors, so duplicate transmissions are expected.”<br/><span class='text-cyan-600 dark:text-cyan-400 font-semibold block mt-1'>Impact: Events must carry stable event IDs. Dedup pipeline must discard repeated sends without suppressing distinct valid impressions.</span>"
      },
      {
        q: "Must we retain raw events?",
        a: "“Yes. We need to investigate discrepancies, replay historical data and recompute metrics when processing logic changes.”<br/><span class='text-cyan-600 dark:text-cyan-400 font-semibold block mt-1'>Impact: Retain immutable raw events in compressed, partitioned object storage (S3/GCS) decoupled from the online aggregate store.</span>"
      }
    ],

    // SECTION 3: FUNCTIONAL REQUIREMENTS
    functionalRequirements: [
      "<strong>FR1 — Event ingestion:</strong> Accept impression events from tracking endpoints, ad servers or client SDKs.",
      "<strong>FR2 — Schema validation:</strong> Validate required fields, event types, timestamps and schema versions. Reject or quarantine malformed events.",
      "<strong>FR3 — Deduplication:</strong> Identify repeated transmissions using a stable event ID and prevent duplicate deliveries from inflating counts.",
      "<strong>FR4 — Metadata enrichment:</strong> Associate events with relevant campaign, creative and publisher metadata.",
      "<strong>FR5 — Real-time aggregation:</strong> Aggregate impressions over defined time windows and dimensions (campaign, publisher, creative).",
      "<strong>FR6 — Analytics and reporting:</strong> Expose near-real-time metrics through reporting APIs and dashboards.",
      "<strong>FR7 — Historical reconciliation:</strong> Recompute selected totals from retained raw events and compare them with streaming aggregates.",
      "<strong>FR8 — Replay and reprocessing:</strong> Allow historical events to be replayed when data corrections, schema changes or business rules change.",
      "<strong>FR9 — Data-quality monitoring:</strong> Monitor malformed events, duplicate rates, processing lag, missing metadata and volume shifts.",
      "<strong>FR10 — Optional fraud analysis:</strong> Support downstream fraud-detection rules or ML models without blocking the critical ingestion path."
    ],

    // SECTION 4: NON-FUNCTIONAL REQUIREMENTS
    nonFunctionalRequirements: [
      "<strong>High throughput:</strong> Sustain ~100,000 events/second on average, with peak capacity up to 500,000 events/second.",
      "<strong>Durability:</strong> Accepted events must be recoverable after downstream failures (durable append boundary before 200/202 ack).",
      "<strong>Scalability:</strong> Horizontally scale ingestion instances, stream partitions, and processing workers as traffic grows.",
      "<strong>Low latency:</strong> Make operational dashboard metrics available within seconds to roughly one minute.",
      "<strong>Correctness:</strong> Handle duplicate, late, and out-of-order events strictly according to explicit watermark policies.",
      "<strong>Recoverability:</strong> Replay raw events from durable object storage and recover processor state from checkpoints.",
      "<strong>Data quality:</strong> Continuous observability over missing, invalid, duplicate, and delayed records.",
      "<strong>Privacy & Compliance:</strong> Collect and retain only necessary telemetry; enforce GDPR/CCPA data retention schedules.",
      "<strong>Cost efficiency:</strong> Separate expensive low-latency serving (ClickHouse) from inexpensive raw-event retention (S3 Parquet).",
      "<strong>Reconciliation:</strong> Distinguish provisional streaming figures from audited, reconciled historical billing totals."
    ],

    // SECTION 5: CAPACITY ESTIMATION (Custom section before API/Data)
    customSections: [
      {
        title: "Capacity Estimation & Traffic Sizing",
        content: `
          <div class="flex flex-col gap-4">
            <p class="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Capacity estimation helps justify the choice of a distributed event stream (Kafka) and analytical store (ClickHouse/Pinot) over direct database writes.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span class="text-xs font-mono font-bold text-indigo-500 uppercase block mb-1">Event Volume</span>
                <div class="text-[20px] font-black text-slate-900 dark:text-white">8.64 Billion / day</div>
                <div class="text-[12px] font-mono text-slate-500 mt-1">100,000 eps × 86,400s</div>
                <p class="text-[12px] text-slate-500 mt-2">Peak reaches 500,000 eps (5× burst target). Illustrates why synchronous database row locks will never scale.</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span class="text-xs font-mono font-bold text-cyan-500 uppercase block mb-1">Ingestion Bandwidth</span>
                <div class="text-[20px] font-black text-slate-900 dark:text-white">100 MB/s sustained</div>
                <div class="text-[12px] font-mono text-slate-500 mt-1">100K eps × 1,000 bytes (1 KB)</div>
                <p class="text-[12px] text-slate-500 mt-2">Peak traffic reaches <strong>500 MB/s</strong>. Raw daily ingest is ~8.64 TB/day before compression.</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span class="text-xs font-mono font-bold text-emerald-500 uppercase block mb-1">Storage Tiering</span>
                <div class="text-[20px] font-black text-slate-900 dark:text-white">Tiered Architecture</div>
                <div class="text-[12px] font-mono text-slate-500 mt-1">Stream + S3 + OLAP</div>
                <p class="text-[12px] text-slate-500 mt-2">Do not store raw events in online OLAP. Use 7-day Kafka retention, cold compressed S3 Parquet, and precomputed rollups.</p>
              </div>
            </div>
          </div>
        `
      }
    ],

    // SECTION 6: API DESIGN
    apiDesign: `POST /api/v1/impressions/batch
Content-Type: application/json
{
  "events": [
    {
      "eventId": "evt-789",
      "eventType": "AD_IMPRESSION",
      "eventTimestamp": "2026-10-11T10:21:30Z",
      "campaignId": "campaign-123",
      "creativeId": "creative-456",
      "publisherId": "publisher-99",
      "source": "web",
      "schemaVersion": 1
    }
  ]
}

Response (202 Accepted):
{
  "requestId": "req-123",
  "status": "ACCEPTED",
  "acceptedCount": 1
}
// Note: Acknowledged only after crossing the configured durable append boundary in Kafka.

---

GET /api/v1/analytics/impressions
    ?campaignId=campaign-123
    &startTime=2026-10-11T10:00:00Z
    &endTime=2026-10-11T11:00:00Z
    &granularity=minute

Response (200 OK):
{
  "campaignId": "campaign-123",
  "granularity": "minute",
  "status": "PROVISIONAL",
  "totalImpressions": 152340,
  "updatedAt": "2026-10-11T10:59:45Z"
}
// Note: The 'status' field distinguishes provisional streaming totals from reconciled historical totals.`,

    // SECTION 7: DATA MODEL
    dataModel: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">7.1 Raw Impression Event</span>
          <pre class="text-[#0F172A] dark:text-emerald-400">RawImpressionEvent:
  event_id: string (UUID / hash)
  event_type: string ("AD_IMPRESSION")
  event_timestamp: ISO-8601 (event time)
  campaign_id: string
  creative_id: string
  publisher_id: string
  source: string ("web" | "app" | "sdk")
  schema_version: integer
  ingestion_timestamp: ISO-8601
  raw_payload: jsonb / bytes</pre>
          <p class="font-sans text-[11.5px] text-slate-500 mt-2 italic">Keeping both event_timestamp and ingestion_timestamp measures transmission lag and allows correct watermark calculation.</p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-indigo-500 font-bold block mb-1">7.2 Campaign &amp; Creative Metadata</span>
          <pre class="text-[#0F172A] dark:text-indigo-300">Campaign:
  campaign_id: string (PK)
  advertiser_id: string
  status: string ("ACTIVE", "PAUSED")
  start_time: timestamp
  end_time: timestamp

Creative:
  creative_id: string (PK)
  campaign_id: string (FK)
  format: string ("BANNER", "VIDEO")
  status: string</pre>
          <p class="font-sans text-[11.5px] text-slate-500 mt-2 italic">Replicated to stream processor local RocksDB/memory caches to avoid per-event RPC lookups.</p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-teal-500 font-bold block mb-1">7.4 Impression Aggregate (OLAP)</span>
          <pre class="text-[#0F172A] dark:text-teal-300">ImpressionAggregate:
  window_start: timestamp
  window_size: string ("1m", "1h")
  campaign_id: string
  publisher_id: string
  impression_count: bigint
  updated_at: timestamp</pre>
          <p class="font-sans text-[11.5px] text-slate-500 mt-2 italic">Stored in ClickHouse/Pinot with ReplacingMergeTree or idempotent upsert keys matching dashboard query dimensions.</p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#24314A]">
          <span class="text-amber-500 font-bold block mb-1">7.5 Deduplication State</span>
          <pre class="text-[#0F172A] dark:text-amber-300">ProcessedEvent:
  event_id: string (PK)
  first_seen_at: timestamp
  processing_status: string ("COMMITTED")</pre>
          <p class="font-sans text-[11.5px] text-slate-500 mt-2 italic">Partitioned state with a sliding TTL window (e.g. 24 hours) matching expected producer retry boundaries.</p>
        </div>
      </div>
    `,

    // SECTION 8: HIGH-LEVEL ARCHITECTURE
    highLevelArchitecture: `
      The architecture separates concerns into two principal paths: a <strong>near-real-time streaming path</strong> for fast operational dashboards and a <strong>durable raw-event archive with batch reconciliation</strong> for audit and financial billing.<br/><br/>
      <div class="flex items-center gap-2 flex-wrap mb-3">
        <span class="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-500/20">
          <span class="material-symbols-outlined text-[14px] align-middle mr-1">hub</span>Core Pipeline
        </span>
        <span class="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20">
          <span class="material-symbols-outlined text-[14px] align-middle mr-1">speed</span>Sub-Minute Latency
        </span>
        <span class="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs border border-amber-500/20">
          <span class="material-symbols-outlined text-[14px] align-middle mr-1">verified_user</span>Reconciliation &amp; ML Guardrails
        </span>
      </div>
      Campaign and creative metadata are replicated directly to the stream processor via local caches (RocksDB/Redis) to avoid costly RPC overhead. Below is the full ASCII board representation followed by the razor-sharp production vector blueprints.
    `,

    architectureImage: '/images/hld/q20_01_ad_impression_tracking_high_level_architecture.svg',
    architectureImageTitle: 'Ad Impression Tracking System — High-Level Architecture (Core Pipeline)',

    architectureDiagram: `                    IMPRESSION PRODUCERS
              Web / App / Ad Server / SDK
                            │
                            ▼
                   Tracking Ingestion API
                            │
                            ▼
                Schema Validation and Checks
                            │
                            ▼
                  Durable Event Stream
                         (Kafka)
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
          Raw Event Archiver     Stream Processor
                 │                     │
                 ▼                     ▼
          Object Storage           Deduplication
           Raw Events                  │
                                       ▼
                              Metadata Enrichment
                                       │
                                       ▼
                            Event-Time Aggregation
                                       │
                                       ▼
                             Real-Time OLAP Store
                                       │
                                       ▼
                             Reporting API / UI


          RAW EVENT ARCHIVE
                 │
                 ▼
       Batch Reconciliation and Replay
                 │
                 ▼
     Corrected / Historical Aggregates
                 │
                 ▼
        Reporting and Audit Results`,

    // SECTION 9: STEP-BY-STEP DESIGN
    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Build a lightweight ingestion endpoint",
        stepBody: "The public-facing tracking endpoint validates required fields, event types, schema versions, size limits, and abuse controls. It assigns or verifies stable event IDs, appends events to Kafka, and immediately returns 202 Accepted once Kafka confirms durable receipt.<br/><strong class='text-indigo-600 dark:text-indigo-400'>Why:</strong> Ingestion must handle 100K–500K eps with predictable sub-10ms response times without blocking on downstream DBs or synchronous metadata calls."
      },
      {
        stepNumber: 2,
        stepTitle: "Use Kafka to buffer and distribute events",
        stepBody: "Partition events based on throughput and ordering needs. To prevent hot partitions where a giant campaign dominates traffic, avoid partitioning solely on campaignId; use a composite key or hash. Kafka absorbs downstream consumer slowdowns and decouples ingestion from analytical processing.<br/><strong class='text-indigo-600 dark:text-indigo-400'>Why:</strong> Ingestion bursts and downstream processing throughput fluctuate independently; Kafka provides durable buffering and consumer group parallelism."
      },
      {
        stepNumber: 3,
        stepTitle: "Archive raw events to object storage",
        stepBody: "A dedicated archival worker consumes from Kafka, batches events, and writes compressed (Snappy/Zstd), date-partitioned Parquet files to S3/GCS. The archive preserves original payloads, ingestion timestamps, and schema versions.<br/><strong class='text-indigo-600 dark:text-indigo-400'>Why:</strong> Aggregates discard granular data; immutable raw events are mandatory for financial audits, reprocessing after bug fixes, and batch reconciliation."
      },
      {
        stepNumber: 4,
        stepTitle: "Deduplicate using stable event IDs",
        stepBody: "The stream processor checks incoming event IDs against a partitioned sliding-window state store (e.g. RocksDB with a 24-hour TTL). Repeated deliveries of the same event ID are discarded. Updates to the aggregate store must also be idempotent.<br/><strong class='text-indigo-600 dark:text-indigo-400'>Why:</strong> Producer retries on network blips duplicate transmissions; deduplication ensures billable counts are never artificially inflated."
      },
      {
        stepNumber: 5,
        stepTitle: "Enrich events with campaign metadata",
        stepBody: "Join impressions with campaign, creative, and publisher attributes using an in-memory or replicated metadata cache. If metadata is missing or temporarily unavailable, route events to a pending-enrichment retry buffer instead of dropping them.<br/><strong class='text-indigo-600 dark:text-indigo-400'>Why:</strong> Synchronous RPC calls for 100K+ eps would cripple the metadata service; valid impressions must never be discarded due to reference data blips."
      },
      {
        stepNumber: 6,
        stepTitle: "Aggregate events using event time",
        stepBody: "Calculate tumbling and sliding metrics (e.g. 1-minute and 1-hour windows) using event timestamps rather than processing timestamps. Use watermarks to handle late arrivals and establish an allowed-lateness policy.<br/><strong class='text-indigo-600 dark:text-indigo-400'>Why:</strong> Network delays and mobile offline queues mean events arrive out of order; event-time aggregation accurately reflects when the advertisement was actually viewed."
      },
      {
        stepNumber: 7,
        stepTitle: "Write aggregates to an analytical store",
        stepBody: "Flush windowed aggregates to an OLAP database (ClickHouse, Apache Pinot) using batched, idempotent upserts. The reporting API reads precomputed rollups directly from the OLAP store and flags active windows as PROVISIONAL.<br/><strong class='text-indigo-600 dark:text-indigo-400'>Why:</strong> Advertisers need interactive sub-second dashboard queries across multiple dimensions without triggering expensive full-table scans on raw data."
      },
      {
        stepNumber: 8,
        stepTitle: "Reconcile streaming results against raw events",
        stepBody: "A nightly batch pipeline (Spark/Trino) recomputes finalized historical aggregates directly from the raw S3 archive, applies late arrivals and adjudicated fraud filters, compares with streaming totals, and issues auditable ledger corrections.<br/><strong class='text-indigo-600 dark:text-indigo-400'>Why:</strong> Near-real-time streaming prioritizes speed; batch reconciliation guarantees financial correctness and auditability for advertiser invoicing."
      }
    ],

    // SECTION 10: COMPONENT-BY-COMPONENT EXPLANATION
    whyComponents: [
      { component: "Tracking Ingestion Endpoint", why: "Provides a lightweight, horizontally scalable HTTP surface that validates contracts and acknowledges events within milliseconds." },
      { component: "Schema Validator", why: "Enforces payload structure, data types, and required identifiers, preventing poison-pill messages from entering normal pipelines." },
      { component: "Kafka Message Bus", why: "Absorbs massive traffic bursts (up to 500K eps), decouples producers from consumers, and enables independent multi-subscriber processing." },
      { component: "Raw Event Archiver", why: "Continuously writes raw events into compressed object storage (S3) for compliance, auditing, replay, and reprocessing." },
      { component: "Deduplication Stage", why: "Tracks processed event IDs over a sliding time window to ensure network retries do not double-count impressions." },
      { component: "Metadata Cache / Replicated View", why: "Supplies local, sub-millisecond campaign and creative dimensions, shielding upstream metadata databases from high-frequency queries." },
      { component: "Stream Processor (Flink/Spark)", why: "Performs stateful event-time windowing, watermark tracking, enrichment, and low-latency rollup computation." },
      { component: "Analytical OLAP Store (ClickHouse)", why: "Serves low-latency, dimensional queries and operational dashboards across millions of campaign records." },
      { component: "Batch Reconciliation Pipeline", why: "Recomputes truth from the raw immutable archive, identifies discrepancies, and produces audited numbers for monthly billing." },
      { component: "Monitoring & Observability", why: "Monitors end-to-end lag, validation failure rates, duplicate ratios, and analytical sink latency in real time." }
    ],

    // SECTION 11 & 12: EVENT PROCESSING SEQUENCE & FAILURE SCENARIOS (postComponentSections)
    postComponentSections: [
      {
        title: "Event Processing Sequence Walkthrough",
        content: `
          <div class="flex flex-col gap-4">
            <p class="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Consider an impression generated when an advertisement is rendered in a mobile app or browser:
            </p>
            <ol class="list-decimal list-inside space-y-2 text-[13.5px] text-slate-700 dark:text-slate-300 pl-2">
              <li><strong>Emission:</strong> The client emits an impression event containing a stable <code class="font-mono text-xs">eventId</code>.</li>
              <li><strong>Validation:</strong> The ingestion endpoint validates required schema fields and format version.</li>
              <li><strong>Append:</strong> The endpoint appends the accepted batch to Kafka topics.</li>
              <li><strong>Acknowledgment:</strong> Kafka confirms durable append, and the endpoint returns <code class="font-mono text-xs">202 ACCEPTED</code>.</li>
              <li><strong>Archival:</strong> The raw-event archiver asynchronously persists a compressed copy in S3 Parquet partitions.</li>
              <li><strong>Consumption:</strong> The stream processor reads the event from its assigned Kafka partition.</li>
              <li><strong>Deduplication:</strong> The processor checks <code class="font-mono text-xs">eventId</code> in RocksDB state. Duplicates are logged and suppressed.</li>
              <li><strong>Enrichment:</strong> Campaign, creative, and publisher metadata are attached from local cache.</li>
              <li><strong>Windowing:</strong> The event is assigned to its event-time window based on watermark rules.</li>
              <li><strong>OLAP Upsert:</strong> An idempotent rollup update is written to ClickHouse.</li>
              <li><strong>Dashboard Query:</strong> The reporting API serves the provisional metric to advertiser dashboards.</li>
              <li><strong>Batch Reconciliation:</strong> A scheduled reconciliation job verifies historical totals against the raw archive.</li>
            </ol>

            ${renderSvgDiagramCard({
              svgPath: '/images/hld/q20_02_ad_impression_tracking_event_processing_sequence.svg',
              title: 'Diagram 02: Ad Impression Tracking System — Event Processing Sequence',
              subtitle: '13-step sequence illustrating durable Kafka acknowledgment, RocksDB dedup, cache enrichment, and reconciliation.',
              badge: 'Razor-Sharp Vector',
              tag: 'Sequence Blueprint'
            })}
          </div>
        `
      },
      {
        title: "Handling Failure Scenarios & Edge Cases",
        content: `
          <div class="flex flex-col gap-4">
            <p class="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Production distributed pipelines must gracefully survive partial infrastructure degradation without losing billable events:
            </p>
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table class="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                    <th class="py-3 px-4 font-bold w-1/3">Failure Scenario</th>
                    <th class="py-3 px-4 font-bold w-2/3">Expected System Behavior &amp; Mitigation</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">Malformed event payload</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Reject or quarantine into a Dead Letter Queue (DLQ); increment validation failure counters.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">Producer retransmits after timeout</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Deduplicate via stable event ID; do not increment window totals twice. Sink writes remain idempotent.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">Kafka cluster becomes unavailable</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Do not return false 202s; return retryable 503s with Backoff headers. Ingestion edges buffer within tight memory limits.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">Stream processor crashes</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Restore state from checkpointed RocksDB snapshots; resume reading Kafka partitions from committed offsets.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-teal-600 dark:text-teal-400">Metadata service unavailable</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Ingestion continues unimpeded. Stream processor uses cached views; missing records route to pending-enrichment queues.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Analytical store slows down</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Buffer events in Kafka topics; processor throttles batch flushes to sink until capacity recovers.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">Late event arrives after window closed</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Update prior window if within allowed-lateness threshold; otherwise reconcile via nightly batch job.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-orange-600 dark:text-orange-400">Hot Kafka partition (skew)</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Rebalance partition keys using composite hashes (campaign + salt); increase partition parallelism.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Reconciliation discrepancy detected</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Publish audited correction records into the ledger with full audit trails rather than overwriting live history.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-red-600 dark:text-red-400">Fraudulent traffic wave detected</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Apply filtering policies to downstream reporting views; never delete raw events from the archive.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[13px] text-amber-800 dark:text-amber-300 font-semibold">
              <span class="material-symbols-outlined text-[16px] align-middle mr-1">warning</span>
              Core Design Rule: The pipeline must preserve valid events even when downstream enrichment, analytical storage, or fraud scoring is temporarily degraded.
            </div>
          </div>
        `
      }
    ],

    // SECTION 13: TRADE-OFFS AND ALTERNATIVES
    tradeoffType: 'table',
    tradeoffs: [
      {
        choice: "13.1 Durable Streaming vs. Direct DB Writes",
        upside: "Decouples producers, absorbs 500K eps bursts, and allows independent replay across multiple consumers.",
        downside: "Introduces operational overhead (Kafka cluster management) and sub-second ingestion-to-query delay.<br/><strong class='text-indigo-500 block mt-1'>Decision:</strong> Use durable event stream for 100K+ eps scale."
      },
      {
        choice: "13.2 Sliding Dedup State vs. Permanent Storage",
        upside: "Bounding dedup state to 24 hours keeps memory/storage bounded and predictable for RocksDB.",
        downside: "Extremely delayed retries (> 24 hrs) could re-trigger; requires batch reconciliation as backstop.<br/><strong class='text-indigo-500 block mt-1'>Decision:</strong> Bound dedup window; catch late retries in batch."
      },
      {
        choice: "13.3 Cached Metadata vs. Remote RPC Lookups",
        upside: "Sub-millisecond lookup latency; protects campaign service from 100K+ QPS load.",
        downside: "Local cache can be briefly stale (seconds) when campaign budgets update.<br/><strong class='text-indigo-500 block mt-1'>Decision:</strong> Prefer replicated in-memory view with CDC invalidation."
      },
      {
        choice: "13.4 Real-Time Freshness vs. Absolute Correctness",
        upside: "Operational dashboards reflect campaign performance within 10–30 seconds.",
        downside: "Streaming numbers remain provisional until late arrivals and bot filters are reconciled.<br/><strong class='text-indigo-500 block mt-1'>Decision:</strong> Explicitly mark streaming metrics PROVISIONAL."
      },
      {
        choice: "13.5 Raw Event Retention vs. Storage Cost",
        upside: "Enables recomputation, bug recovery, algorithm changes, and full financial audit trails.",
        downside: "Consumes terabytes of storage daily and increases GDPR/CCPA deletion complexity.<br/><strong class='text-indigo-500 block mt-1'>Decision:</strong> Use compressed Parquet on S3 with tiered lifecycle rules."
      },
      {
        choice: "13.6 Throughput Partitioning vs. Per-Key Ordering",
        upside: "Fine-grained hashing prevents hot partitions when a viral campaign spikes traffic.",
        downside: "Cannot guarantee strict per-campaign FIFO order across partitions without custom grouping.<br/><strong class='text-indigo-500 block mt-1'>Decision:</strong> Prioritize even distribution; rely on event timestamps."
      }
    ],

    // SECTION 14 & 15: OPTIONAL AI/ML FRAUD DETECTION & OBSERVABILITY (postTradeoffSections)
    postTradeoffSections: [
      {
        title: "Optional AI/ML Integration: Fraud Detection Extension",
        content: `
          <div class="flex flex-col gap-4">
            <p class="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Fraud detection is an <strong>optional extension</strong>, not a blocking requirement for the core ingestion pipeline. The design recommends keeping ML models downstream so model latency or outages never disrupt basic event capture.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span class="font-bold text-indigo-500 block mb-1.5">Evaluated Fraud Signals</span>
                <ul class="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Abnormal impression rates and velocity from a single IP/device.</li>
                  <li>Suspicious event patterns (impossible click-through intervals).</li>
                  <li>Unusual publisher spikes and bot signature telemetry.</li>
                  <li>Known invalid traffic (IVT) IP ranges and datacenter origins.</li>
                  <li>Downstream conversion mismatches.</li>
                </ul>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span class="font-bold text-amber-500 block mb-1.5">Why Not Run ML Synchronously in Ingestion?</span>
                <ul class="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Model inference takes 20–100ms; at 100K+ eps, this requires massive GPU clusters.</li>
                  <li>Model failures would drop or delay legitimate advertiser events.</li>
                  <li>Downstream placement isolates latency and preserves raw events.</li>
                  <li>Rules and model versions can be evaluated asynchronously.</li>
                </ul>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 text-[13px] text-slate-700 dark:text-slate-300">
              <strong class="text-indigo-600 dark:text-indigo-400">Handling Suspected Fraudulent Events:</strong> Never silently delete raw events just because a model flags them. Retain an audit trail, apply documented filtering rules to the filtered reporting view, and maintain clear separation: <em>Raw Event Counts &rarr; Valid Measurement Counts &rarr; Filtered Billable Counts</em>.
            </div>

            ${renderSvgDiagramCard({
              svgPath: '/images/hld/q20_03_ad_impression_tracking_optional_ml_fraud_detection.svg',
              title: 'Diagram 03: Ad Impression Tracking System — Optional AI/ML Fraud-Detection Extension',
              subtitle: 'Downstream scoring path, online feature store, model lifecycle, shadow canary deployment and production safeguards.',
              badge: 'Razor-Sharp Vector',
              tag: 'AI/ML Blueprint'
            })}
          </div>
        `
      },
      {
        title: "Monitoring, Observability & Alerting Strategy",
        content: `
          <div class="flex flex-col gap-4">
            <p class="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              At this scale, observability must monitor data pipelines end-to-end, measuring flow rates, quality, and processing lag:
            </p>
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table class="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                    <th class="py-3 px-4 font-bold w-1/3">Pipeline Metric</th>
                    <th class="py-3 px-4 font-bold w-2/3">Operational Purpose &amp; Alert Threshold</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Events Received per Second (EPS)</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Monitors input volume, baseline traffic, and sudden spikes or drops across producers.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Invalid Event Rate (%)</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Catches broken producer SDK updates or schema contract drift. Alert if > 0.5%.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Duplicate-Event Rate (%)</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Detects retry storms caused by network edge timeout blips. Alert on sustained rises.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Kafka Consumer Lag</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Measures stream processing backlogs. Growing lag signals an under-provisioned consumer group.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Event-to-Dashboard Latency</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Measures end-to-end freshness. Alert if latency exceeds 60 seconds for active windows.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Late-Event Ratio</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Measures events arriving outside standard watermark windows, indicating client network latency.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Metadata Cache Miss Ratio</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Identifies new campaigns not yet propagated to local caches. Alert if > 1%.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Analytical Store Write Latency</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Monitors ClickHouse batch commit health to prevent sink backpressure into Kafka.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">Reconciliation Discrepancy (%)</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Quantifies difference between streaming counts and batch totals. Alert if discrepancy > 0.1%.</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">S3 Archival Lag &amp; Storage Growth</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-300">Verifies raw events are landing continuously in cold storage and checks lifecycle tiering policies.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-[12.5px] text-slate-500 italic">
              <strong>Alerting Philosophy:</strong> Base alerts on sustained trends rather than transient spikes. For instance, growing consumer lag combined with rising event-to-dashboard latency is a reliable indicator of a processing bottleneck.
            </p>
          </div>
        `
      }
    ],

    // SECTION 16: FOLLOW-UP QUESTIONS AND MODEL ANSWERS
    followUps: [
      {
        q: "Kafka delivers the same event twice. How do you prevent double counting?",
        a: "“I use a stable event ID and deduplicate in the stream processor using recoverable, partitioned state (e.g. RocksDB) with a retention window matching expected retry times. I also ensure aggregate sink writes are idempotent (e.g. ClickHouse ReplacingMergeTree). Deduplication alone is insufficient if processing succeeds but the aggregate-write acknowledgment is lost.”"
      },
      {
        q: "How would you scale the system to 500,000 events per second?",
        a: "“I would benchmark ingestion, stream processing, and analytical writes separately. Then I would increase partition count and consumer parallelism, batch writes, monitor consumer lag, and eliminate hot keys by adding salt to partition hashes. I would ensure zero synchronous metadata lookups and keep cold raw event writes decoupled.”"
      },
      {
        q: "What happens when the metadata service is unavailable?",
        a: "“The ingestion layer continues accepting valid events into Kafka unaffected. The stream processor continues using cached and replicated metadata. If an impression references an unknown campaign, it is routed to a pending-enrichment buffer for retry rather than dropped.”"
      },
      {
        q: "How do you handle late-arriving events?",
        a: "“I use event-time windows, watermarks, and an explicit allowed-lateness policy (e.g. 10 minutes). Events arriving within the window update provisional aggregates. Events arriving after window closure are archived and reconciled during the nightly batch job against the raw S3 data.”"
      },
      {
        q: "How do you detect fraudulent impressions?",
        a: "“I separate basic ingestion validation from computationally expensive fraud scoring. The core pipeline captures all valid raw events, while downstream rules or an asynchronous ML model score risk signals (velocity, IP clusters, bot patterns). Documented business policies determine how suspicious events affect filtered reporting views without corrupting raw audit trails.”"
      },
      {
        q: "Why might the live dashboard disagree with the historical report?",
        a: "“Live metrics prioritize freshness (< 1 min) and are explicitly marked PROVISIONAL. Historical reports incorporate late-arriving events, corrected deduplication states, updated campaign metadata, and completed bot fraud adjudication. The reconciliation pipeline measures and explains this gap.”"
      },
      {
        q: "Why store raw events if we already have aggregate tables?",
        a: "“Aggregates discard granular dimensions (device info, IP, timestamps). Immutable raw events allow replaying history after schema updates, recalibrating machine learning fraud models, fixing algorithmic bugs, and providing non-repudiable audit logs for advertiser billing disputes.”"
      },
      {
        q: "Why not query the campaign database for every impression?",
        a: "“At 100,000 events per second on average, synchronous database lookups would create fatal latency spikes and crash the metadata database. Replicating campaign metadata into local processor caches enables sub-microsecond in-memory joins.”"
      },
      {
        q: "Does Kafka guarantee that an impression is counted exactly once?",
        a: "“Kafka’s transactional producer guarantees exactly-once semantics only within Kafka itself. End-to-end exactly-once counting in an external OLAP store requires combining deterministic event deduplication with idempotent aggregate writes.”"
      },
      {
        q: "What if the analytical database is down?",
        a: "“Kafka buffers incoming events up to its configured retention limit (e.g. 7 days). Ingestion continues accepting events. Once the analytical store recovers, consumers resume reading and backfill precomputed rollups.”"
      },
      {
        q: "How do you avoid data loss between ingestion and raw-event archival?",
        a: "“The durable event stream is the single source of truth for archivers. The archival worker tracks committed Kafka consumer offsets only after the batched Parquet file has been confirmed durably written to S3.”"
      },
      {
        q: "How do you prevent one campaign from becoming a hot partition?",
        a: "“Never partition Kafka topics solely on campaignId. Instead, use a composite key combining campaignId with publisherId or a hash salt (e.g. hash(campaignId + eventId % 16)). This distributes load evenly across all Kafka partitions.”"
      }
    ],

    // SECTION 17 & 18: FINAL INTERVIEW SUMMARY & KEY TAKEAWAYS (postSections)
    postSections: [
      {
        title: "Final Interview Summary & Conclusion Pitch",
        content: `
          <div class="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-col gap-3">
            <h4 class="font-bold text-[16px] text-indigo-950 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400">record_voice_over</span>
              How to Summarize This Architecture in 90 Seconds:
            </h4>
            <blockquote class="italic text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-300 border-l-4 border-indigo-500 pl-4 py-1">
              “I would build a high-throughput ingestion API that validates impression events and appends accepted events to a durable Kafka stream. One branch archives raw events to object storage, while a stream processor deduplicates by stable event ID, enriches events from a cached or replicated metadata view, and aggregates metrics using event-time windows.<br/><br/>
              The aggregate results are stored in an analytical database that powers near-real-time dashboards. A separate batch reconciliation pipeline reprocesses raw events and compares historical totals with streaming aggregates, correcting discrepancies where required.<br/><br/>
              I would scale the system through partitioning, parallel processing and batched storage writes; monitor throughput, lag, duplicate rates and data quality; and keep optional fraud-detection models downstream so they do not block basic ingestion.”
            </blockquote>
          </div>
        `
      },
      {
        title: "Key Takeaways & Core Design Principles",
        content: `
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <div><strong>Keep ingestion lightweight:</strong> Validate and durably capture events before expensive downstream processing.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <div><strong>Use a durable stream:</strong> Decouple producers from processors and absorb traffic bursts up to 500K eps.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <div><strong>Deduplicate by stable event ID:</strong> Never deduplicate solely by campaign and creative.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                <div><strong>Make output writes idempotent:</strong> Handle retries that occur after processing but before acknowledgment.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">5</span>
                <div><strong>Enrich efficiently:</strong> Prefer cached or replicated metadata views instead of synchronous remote lookups.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">6</span>
                <div><strong>Aggregate using event time:</strong> Define watermarks, allowed lateness and correction rules explicitly.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">7</span>
                <div><strong>Separate live from reconciled totals:</strong> Fresh reporting and finalized financial correctness are distinct.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">8</span>
                <div><strong>Keep raw events for replay:</strong> Retention in S3 Parquet enables audits, bug fixes, and reprocessing.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">9</span>
                <div><strong>Design for operational visibility:</strong> Track lag, malformed records, duplicates, sink health, and reconciliation.</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">10</span>
                <div><strong>Keep AI/ML optional and downstream:</strong> Apply complex fraud models without making basic ingestion dependent on them.</div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-[13.5px] text-emerald-900 dark:text-emerald-200 font-semibold flex items-center gap-3">
              <span class="material-symbols-outlined text-[24px] text-emerald-600 dark:text-emerald-400 shrink-0">military_tech</span>
              <span><strong>Final Design Principle:</strong> Preserve valid events first, process them reliably, expose fresh metrics quickly, and use retained raw data to investigate and reconcile the final numbers.</span>
            </div>
          </div>
        `
      }
    ]
  });
}
