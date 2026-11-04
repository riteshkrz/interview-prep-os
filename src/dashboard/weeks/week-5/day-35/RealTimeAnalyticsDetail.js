/**
 * Question 14. Design a real-time analytics pipeline
 * System Design Interview Masterclass — Module 3: Data-intensive systems (Pages 63–66)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderRealTimeAnalyticsDetail() {
  return renderMasterclassQuestion({
    questionNumber: 14,
    title: "Design a real-time analytics pipeline",
    moduleName: "Module 3 — Data-intensive systems",
    coreTopics: "event streaming, continuous stream processing, time windows, event-time semantics, deduplication, and stores built for analytics",

    problemStatement: `Propose a system that collects business events, transforms them with near-real-time processing, and makes analytics available within seconds to a few minutes. Plan for late and duplicate arrivals, and keep raw events retrievable for replay.`,

    clarifyingQuestions: [
      { q: "Which categories of events matter?", a: "Examples include user behavior and revenue-related signals—impressions, clicks, conversions, and comparable business events." },
      { q: "What event volume must the pipeline handle?", a: "Target millions of events per minute, with additional headroom for traffic spikes." },
      { q: "How quickly should dashboards reflect new data?", a: "Expect dashboard refreshes roughly within seconds up to about one minute." },
      { q: "Do we need to handle duplication and lateness?", a: "Yes—retries can produce duplicates, and network delay can reorder or delay delivery." },
      { q: "Must operators be able to replay history?", a: "Yes—when logic changes, replay stored raw events and recompute prior analytical outputs." }
    ],

    functionalRequirements: [
      "Take input from many independent event producers.",
      "Check incoming payloads against the schema and normalize fields to a canonical shape.",
      "Apply deduplication when the use case permits.",
      "Roll up counts and other metrics within configured time windows.",
      "Publish low-latency metrics plus queryable historical aggregates.",
      "When processing rules change, replay from the raw event archive."
    ],

    nonFunctionalRequirements: [
      "Sustain high ingest rates with minimal pipeline latency end to end.",
      "Capture events durably so none are lost on failure.",
      "Stateful processing that can restart and restore consistent state.",
      "Clear policies for duplicate events and data arriving after its window.",
      "Grow capacity by adding instances horizontally.",
      "Analytics that yield the same results when the same inputs are reprocessed."
    ],

    customSections: [
      {
        title: "Example Event Schema",
        content: `
          <div class="flex flex-col gap-2">
            <div class="bg-[#0B0F17] border border-[#24314A] rounded-xl p-4 font-mono text-[12.5px] text-emerald-400">
{
  "eventId": "event-123",
  "eventType": "CLICK",
  "eventTimestamp": "2026-10-11T10:21:30Z",
  "entityId": "campaign-456",
  "schemaVersion": 1
}
            </div>
            <p class="text-[12.5px] text-slate-500 italic">
              Rely on a stable event ID when one exists; never treat the event timestamp alone as a unique deduplication key.
            </p>
          </div>
        `
      }
    ],

    highLevelArchitecture: `Streaming path: event producers &rarr; ingestion API/SDK &rarr; partitioned Kafka topics &rarr; stream processor &rarr; deduplication and enrichment &rarr; windowed aggregates &rarr; real-time OLAP store.<br/><br/>
    At the same time, persist a copy of raw events to object storage to support replay and batch reconciliation.`,

    architectureImage: '/images/hld/q14_realtime_analytics_architecture.svg',
    architectureImageTitle: 'Design a Real-Time Analytics Pipeline — Stream Processing & OLAP Architecture',

    architectureDiagram: `[Event Producers (Web / Mobile SDKs)]
            │
            ▼
   [Ingestion Gateway API]
            │
            ▼ (Partitioned by entityId)
     [Apache Kafka Topics]
            │
     ┌──────┴───────────────────────────────────┐
     │ (Streaming Path)                         │ (Batch Archival Path)
     ▼                                          ▼
[Stream Processor (Flink / Spark)]     [Object Store (S3)]
  ├── Dedup via Event ID State            (Time-partitioned Parquet files)
  ├── Event-Time Windows & Watermarks           │
  └── Windowed Aggregates                       ▼
     │                                 [Batch Reconciliation Job]
     ▼ (Idempotent Upsert)                      │ (Diff & Audit)
[Real-Time OLAP Store (ClickHouse / Pinot)] ◄───┘
     │
     ▼
[Analytics Dashboards & Query APIs]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Lock down the event contract",
        stepBody: "Standardize event IDs, timestamps, schema versions, and required business identifiers. Event time marks when the business action happened; processing time marks when the pipeline consumed the record."
      },
      {
        stepNumber: 2,
        stepTitle: "Validate incoming events and ingest them",
        stepBody: "Discard or quarantine malformed records. Write valid events to partitioned topics whose layout meets throughput goals and any ordering constraints."
      },
      {
        stepNumber: 3,
        stepTitle: "Compute windows and joins on event time",
        stepBody: "The processor keeps per-window state and periodic checkpoints. Select tumbling, sliding, or session windows based on each metric’s definition."
      },
      {
        stepNumber: 4,
        stepTitle: "Account for late-arriving events",
        stepBody: "Watermarks approximate when an event-time window is complete. Set allowed lateness and decide whether stragglers amend existing aggregates or emit separate corrections."
      },
      {
        stepNumber: 5,
        stepTitle: "Persist results for querying",
        stepBody: "Pick an analytical database suited to expected filters and aggregations (e.g. ClickHouse, Druid, StarRocks). Ensure writes are idempotent or correction-friendly so replays never double-count."
      },
      {
        stepNumber: 6,
        stepTitle: "Keep an immutable copy of raw events",
        stepBody: "Store raw events in object storage, partitioned by time. That supports historical replay and helps reconcile near-real-time results."
      },
      {
        stepNumber: 7,
        stepTitle: "Watch end-to-end pipeline health",
        stepBody: "Observe consumer lag, fraction of late events, end-to-end processing delay, failed records, checkpoint time, and sink write throughput."
      }
    ],

    whyComponents: [
      { component: "Kafka", why: "Smooths load and isolates producers from downstream processors" },
      { component: "Schema validation", why: "Prevents corrupt or incompatible records from entering the main path" },
      { component: "Stream processor", why: "Performs windowing, managed state, enrichment, and aggregation" },
      { component: "Checkpointing", why: "Makes processor failures recoverable without losing progress" },
      { component: "OLAP store", why: "Serves interactive analytical queries efficiently" },
      { component: "Object storage", why: "Retains the long-term archive used for replay and reconstruction" },
      { component: "Monitoring", why: "Flags backlog, potential data loss, and partition skew" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Bigger time windows:</strong> Cut per-event overhead but postpone when updated numbers become visible.",
      "<strong>Allowing more watermark wait time:</strong> Improves completeness while slowing how fast reports stabilize.",
      "<strong>At-least-once delivery:</strong> Dependable across network blips, but forces idempotent aggregation logic.",
      "<strong>Exactly-once semantics:</strong> Hinge on the stream engine and sink two-phase commits, and may not span every external side effect.",
      "<strong>Retaining every raw event:</strong> Strengthens replay options, but raises storage spend and data privacy/compliance burdens."
    ],

    followUps: [
      {
        q: "How do you handle the same event being delivered twice?",
        a: "“Deduplicate with event IDs or design aggregations to be idempotent. Align checkpointing and sink writes so a retry cannot apply the same business effect twice.”"
      },
      {
        q: "What if processing lag grows without bound?",
        a: "“Watch consumer lag, determine whether CPU, state size, skewed partitions, or the sink is limiting throughput, then scale or tune that bottleneck. Topic retention must cover the time needed to catch up.”"
      },
      {
        q: "How would you recompute aggregates for the prior month?",
        a: "“Replay archived raw events through a versioned job and land output in a separate dataset. Compare totals and diffs against production aggregates before cutover or merge.”"
      }
    ]
  });
}
