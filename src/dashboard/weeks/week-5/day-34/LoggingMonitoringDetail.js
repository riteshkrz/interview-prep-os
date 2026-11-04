/**
 * Question 13. Design a logging and monitoring system
 * System Design Interview Masterclass — Module 3: Data-intensive systems (Pages 60–62)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderLoggingMonitoringDetail() {
  return renderMasterclassQuestion({
    questionNumber: 13,
    title: "Design a logging and monitoring system",
    moduleName: "Module 3 — Data-intensive systems",
    coreTopics: "high-throughput ingestion, Kafka, search indexes, metrics, alerting, and retention tiers",

    problemStatement: `Design a platform that ingests application logs, metrics, and traces; makes recent events searchable; retains older data economically; and alerts engineers when behavior crosses defined thresholds.`,

    clarifyingQuestions: [
      { q: "Which telemetry types are in scope?", a: "Structured logs alongside metrics and distributed traces." },
      { q: "What peak ingest rate should we plan for?", a: "Plan for on the order of several hundred thousand log events per second." },
      { q: "How long must logs stay searchable?", a: "Keep recent logs searchable for a short window (e.g. 7–14 days); older logs may move to cold archive." },
      { q: "Do apps block when logging fails?", a: "Not indefinitely—use bounded buffers and explicit loss / load-shedding behavior." },
      { q: "Do records contain sensitive fields?", a: "They may. Redaction and access control are mandatory." }
    ],

    functionalRequirements: [
      "Collect logs, metrics, and trace spans from services.",
      "Standardize schemas and add enrichment fields.",
      "Look up recent logs by service, severity, and time range.",
      "Build dashboards and fire alerts.",
      "Roll up metrics across time windows.",
      "Tier older data and apply retention rules."
    ],

    nonFunctionalRequirements: [
      "High ingest throughput.",
      "Graceful behavior when downstream systems fail.",
      "Fast search over recent data.",
      "Predictable storage spend.",
      "Secure telemetry with strong access controls.",
      "Isolation so telemetry outages do not crash business services."
    ],

    customSections: [
      {
        title: "Example Event Schema",
        content: `
          <div class="flex flex-col gap-2">
            <div class="bg-[#0B0F17] border border-[#24314A] rounded-xl p-4 font-mono text-[12.5px] text-emerald-400">
{
  "timestamp": "2026-10-11T10:21:30Z",
  "service": "order-service",
  "level": "ERROR",
  "traceId": "trace-123",
  "message": "Payment provider timeout",
  "attributes": {
    "region": "ap-south-1"
  }
}
            </div>
            <p class="text-[12.5px] text-slate-500 italic">
              The sample is illustrative. Never log credentials, API tokens, or unnecessary personal identifiable information (PII).
            </p>
          </div>
        `
      }
    ],

    highLevelArchitecture: `Applications and agents &rarr; collectors &rarr; ingestion gateway &rarr; Kafka or another durable buffer &rarr; processing and normalization.<br/><br/>
    Recent events land in a search store (OpenSearch/ClickHouse). Raw or compressed payloads archive to object storage (S3). Metrics and traces use dedicated stores (Prometheus/TSDB/Jaeger). Alert evaluation reads relevant metrics and events and delivers alerts to ops channels.`,

    architectureImage: '/images/hld/q13_logging_monitoring_architecture.svg',
    architectureImageTitle: 'Design a Distributed Logging & Monitoring System — Telemetry Ingestion Pipeline',

    architectureDiagram: `[Apps & Services] ──(Sidecar / OTel Agent)──► [Local Bounded Ring Buffer]
                                                      │ (Batched Push)
                                                      ▼
                                           [Ingestion Gateway]
                                                      │
                                                      ▼
                                        [Distributed Kafka Topics]
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       ▼                              ▼                              ▼
              [Stream Processor]              [Metrics Engine]               [Raw Archiver]
          (Redaction & Normalization)     (Rollups & Histograms)      (Compressed gzip Parquet)
                       │                              │                              │
                       ▼                              ▼                              ▼
              [Search Store (7d)]             [TSDB / Mimir]                 [S3 Cold Bucket]
                       │                              │
                       ▼                              ▼
                 [Search UI] ◄────────────── [Alert Evaluator] ──► [PagerDuty / Slack]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Capture telemetry at the edge",
        stepBody: "Agents, SDKs, or sidecars emit structured telemetry. Buffer locally with strict memory limits so a stalled logging path never blocks business work or exhausts application memory."
      },
      {
        stepNumber: 2,
        stepTitle: "Batch into the pipeline",
        stepBody: "Collectors batch events into a durable buffer. Partition for throughput while limiting partition skew across hosts."
      },
      {
        stepNumber: 3,
        stepTitle: "Normalize, enrich, and redact",
        stepBody: "Align timestamps and schemas, attach service metadata (host, cluster, environment), and strip secrets or sensitive fields before indexing or archiving when feasible."
      },
      {
        stepNumber: 4,
        stepTitle: "Split hot versus cold paths",
        stepBody: "Index fresh logs for interactive search (e.g. 7–14 days). Compress and archive older records in cold object storage to control infrastructure spend."
      },
      {
        stepNumber: 5,
        stepTitle: "Compute metric rollups",
        stepBody: "Compute rates, error counts, histograms, and percentiles (p50, p95, p99). Avoid high-cardinality metric labels such as unique request IDs when logs or traces can carry that detail."
      },
      {
        stepNumber: 6,
        stepTitle: "Run alert rules",
        stepBody: "Apply threshold and time-window rules. Deduplicate and group repeat alerts to prevent alert storms during widespread outages."
      },
      {
        stepNumber: 7,
        stepTitle: "Govern retention and access",
        stepBody: "Set retention by telemetry type and sensitivity. Audit access to sensitive logs and extend deletion policies to archives where needed."
      }
    ],

    whyComponents: [
      { component: "Collectors", why: "Batch events and unify transport" },
      { component: "Kafka", why: "Smooths ingest spikes and separates producers from consumers" },
      { component: "Stream processors", why: "Normalize, redact, and aggregate streams" },
      { component: "Search index", why: "Powers fast full-text queries on recent logs" },
      { component: "Object storage", why: "Cheap, durable long-term retention and compliance" },
      { component: "Metrics store", why: "Efficient time-series reads and graph dashboards" },
      { component: "Alert evaluator", why: "Finds failing conditions and delivers actionable notifications" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Indexing every field:</strong> Aids searchability but dramatically raises index memory and disk costs.",
      "<strong>Sampling:</strong> Cuts ingestion volume and network costs, but can miss rare, high-severity edge-case errors.",
      "<strong>Longer retention:</strong> Aids forensic postmortems and compliance investigations, but raises storage cost and privacy risk.",
      "<strong>High-cardinality labels:</strong> Enable fine-grained diagnostic views, but can crash or overload time-series metric backends.",
      "<strong>Local client buffering:</strong> Adds resilience during blips, but delays visibility and still drops data when local memory fills."
    ],

    followUps: [
      {
        q: "How should the system behave if Kafka is down?",
        a: "“Rely on bounded local buffers with explicit disk and memory caps. Once full, follow a declared policy—sampling or dropping lower-value telemetry. User-facing business requests must not wait forever or fail on logging outages.”"
      },
      {
        q: "How do you keep sensitive data out of telemetry?",
        a: "“Redact at the source or collector, block secrets from being logged, lock down access, and audit reads. Apply retention and deletion to both indexed and archived copies.”"
      },
      {
        q: "How do you keep observability spend under control?",
        a: "“Tier retention, compress payloads, index selectively, sample where appropriate, and limit label cardinality. Measure ingest and storage cost per service to find heavy emitters.”"
      }
    ]
  });
}
