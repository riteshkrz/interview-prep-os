/**
 * 1.6 Choosing a Cloud Vendor for Big Data Solutions - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 18 & 19
 * from The Modern System Design Interview Guide.
 */

export function renderBigDataCloudContent(topic) {
  const bigDataMatrix = [
    {
      stage: "Serverless Ingestion",
      aws: "AWS Lambda",
      gcp: "Cloud Functions",
      azure: "Azure Functions"
    },
    {
      stage: "Streaming Ingestion",
      aws: "Amazon Kinesis / MSK",
      gcp: "Cloud Pub/Sub",
      azure: "Event Hubs"
    },
    {
      stage: "Raw Data Lake Storage",
      aws: "Amazon S3",
      gcp: "Cloud Storage",
      azure: "Azure Data Lake Storage (ADLS)"
    },
    {
      stage: "Distributed Processing Engine",
      aws: "Amazon EMR / AWS Glue",
      gcp: "Dataproc / Dataflow",
      azure: "Azure Synapse Analytics / HDInsight"
    },
    {
      stage: "Analytical Data Warehouse",
      aws: "Amazon Redshift",
      gcp: "BigQuery",
      azure: "Azure Synapse"
    },
    {
      stage: "Orchestration / Workflow",
      aws: "AWS Step Functions / MWAA",
      gcp: "Cloud Composer (Airflow)",
      azure: "Azure Data Factory"
    },
    {
      stage: "Visualization / BI",
      aws: "Amazon QuickSight",
      gcp: "Looker / Looker Studio",
      azure: "Power BI"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the difference between a Data Lake and a Data Warehouse?",
      answer: `A <strong>Data Lake</strong> stores raw, unstructured, semi-structured, and structured data in its original format (schema-on-read) using cheap object storage (S3, GCS). A <strong>Data Warehouse</strong> stores cleaned, structured, relational data transformed into a defined schema (schema-on-write) optimized for fast SQL aggregation and BI reporting. Modern architectures use a <strong>Lakehouse pattern</strong> (Delta Lake, Apache Iceberg) to combine the flexibility of a lake with the ACID transactions of a warehouse.`
    },
    {
      qNum: "Q2",
      question: "Batch processing vs. Stream processing: when do you use which?",
      answer: `Use <strong>batch processing</strong> (Hadoop, Spark, AWS Glue) when computing on large historical datasets where processing latency (hours, days) is acceptable (e.g. daily sales aggregation, ML training). Use <strong>stream processing</strong> (Apache Flink, Spark Streaming, GCP Dataflow) when low latency (milliseconds to seconds) is required to act on continuous events (e.g. fraud detection, live anomaly alerts, real-time leaderboards).`
    },
    {
      qNum: "Q3",
      question: "How do you handle schema evolution in a big data pipeline?",
      answer: `Use <strong>schema registries</strong> (Confluent Schema Registry, AWS Glue Schema Registry) with binary serialization formats like Apache Avro or Protocol Buffers. Enforce backward or full compatibility rules so newer producers do not break downstream consumers. In data lake tables, use open table formats (Apache Iceberg, Delta Lake) that support schema evolution without rewriting entire partitions.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 18 & 19: PIPELINE STAGES, CLOUD MATRIX & DECISION RULES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              1.6 Choosing a Cloud Vendor for Big Data Solutions
            </h2>
          </div>
        </div>

        <!-- Introductory Paragraph -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5">
          <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
            Modern big data architectures follow a vendor-neutral 5-stage pipeline pattern: <strong>Ingestion → Storage → Processing → Analytical Warehouse → Visualization</strong>. Every major cloud provider (AWS, Google Cloud Platform, Microsoft Azure) offers a suite of managed services that map to these pipeline stages [1]:
          </p>
        </div>

        <!-- 5-Stage Pipeline Pillars -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div class="bg-[#141C2E]/80 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span class="font-code text-[10px] font-bold text-cyan-400 uppercase">1. Ingestion</span>
            <span class="text-[12px] text-slate-300 leading-snug">Streaming and batch events from microservices, logs, and IoT devices.</span>
          </div>
          <div class="bg-[#141C2E]/80 border border-blue-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span class="font-code text-[10px] font-bold text-blue-400 uppercase">2. Raw Storage</span>
            <span class="text-[12px] text-slate-300 leading-snug">Durable, scalable object storage acting as the central data lake.</span>
          </div>
          <div class="bg-[#141C2E]/80 border border-indigo-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span class="font-code text-[10px] font-bold text-indigo-400 uppercase">3. Processing</span>
            <span class="text-[12px] text-slate-300 leading-snug">Distributed engines for batch transformations and low-latency streaming.</span>
          </div>
          <div class="bg-[#141C2E]/80 border border-emerald-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span class="font-code text-[10px] font-bold text-emerald-400 uppercase">4. Warehouse</span>
            <span class="text-[12px] text-slate-300 leading-snug">Columnar OLAP databases built for high-concurrency SQL aggregations.</span>
          </div>
          <div class="bg-[#141C2E]/80 border border-purple-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span class="font-code text-[10px] font-bold text-purple-400 uppercase">5. Presentation</span>
            <span class="text-[12px] text-slate-300 leading-snug">Interactive dashboards, BI exploration, and machine learning feeds.</span>
          </div>
        </div>

        <!-- Big Data Tool Comparison Table -->
        <div class="flex flex-col gap-3 pt-2">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            BIG DATA TOOL COMPARISON ACROSS CLOUDS
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3">Pipeline Stage</th>
                  <th class="p-3">AWS</th>
                  <th class="p-3">Google Cloud (GCP)</th>
                  <th class="p-3">Azure</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${bigDataMatrix.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white">${row.stage}</td>
                    <td class="p-3 font-code text-cyan-300 text-[12px]">${row.aws}</td>
                    <td class="p-3 font-code text-emerald-300 text-[12px]">${row.gcp}</td>
                    <td class="p-3 font-code text-blue-300 text-[12px]">${row.azure}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: The Core Decision Rule -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            THE CORE DECISION RULE
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            Do not pick a big data vendor based on raw feature checklists — all three clouds have mature, capable equivalents. The deciding criteria are: <strong>(1) Existing organizational footprint</strong> (data gravity wins: move compute to where data lives, not vice versa), <strong>(2) Query model preference</strong> (BigQuery's serverless pay-per-query model vs. Redshift's provisioned cluster model), and <strong>(3) AI/ML ecosystem integration</strong> (GCP leads in Vertex AI / TensorFlow; AWS leads in breadth and partner tools).
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Under what query patterns does BigQuery's on-demand pricing become significantly more expensive than a provisioned Redshift cluster?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-1.5 pb-3 border-b border-[#24314A]/50 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[13.5px] font-bold text-white font-sans">${item.question}</span>
                </div>
                <p class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </p>
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
            Big data architectures are vendor-neutral: Ingestion → Lake → Processing → Warehouse → Presentation. Focus on data gravity, query pricing models (serverless vs. provisioned), and schema governance. Never move petabytes across cloud boundaries — compute must travel to the data.
          </p>
        </div>

        <!-- Page 19 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 19</span>
        </div>

      </div>

    </div>
  `;
}
