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
      aws: "Amazon Kinesis / MSK (Kafka)",
      gcp: "Cloud Pub/Sub",
      azure: "Event Hubs"
    },
    {
      stage: "Raw Data Lake Storage",
      aws: "Amazon S3",
      gcp: "Google Cloud Storage (GCS)",
      azure: "Azure Data Lake Storage (ADLS)"
    },
    {
      stage: "Distributed Processing Engine",
      aws: "Amazon EMR / AWS Glue (Spark)",
      gcp: "Dataproc / Cloud Dataflow",
      azure: "Azure Synapse / HDInsight"
    },
    {
      stage: "Analytical Data Warehouse",
      aws: "Amazon Redshift",
      gcp: "Google BigQuery",
      azure: "Azure Synapse Analytics"
    },
    {
      stage: "Workflow Orchestration",
      aws: "AWS Step Functions / MWAA (Airflow)",
      gcp: "Cloud Composer (Managed Airflow)",
      azure: "Azure Data Factory"
    },
    {
      stage: "Visualization / BI Dashboards",
      aws: "Amazon QuickSight",
      gcp: "Looker / Looker Studio",
      azure: "Power BI"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the difference between a Data Lake and a Data Warehouse?",
      answer: `The difference lies in <em>when</em> structure and schema are applied:
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li><strong>Data Lake (Schema-on-Read):</strong> Like a giant digital storage room (Amazon S3, GCS) where you dump raw logs, JSON blobs, CSV files, and images in their original format at minimal cost. You define how to interpret the data only when you run a query.</li>
        <li><strong>Data Warehouse (Schema-on-Write):</strong> Like an organized library with labeled shelves (BigQuery, Redshift, Snowflake). Data must be cleaned, transformed, and formatted into columnar tables <em>before</em> loading. Optimized for ultra-fast SQL aggregation queries over billions of rows.</li>
        <li><strong>The Modern Data Lakehouse:</strong> Modern table formats like <strong>Apache Iceberg</strong> and <strong>Delta Lake</strong> allow teams to run fast ACID transactions directly on cheap S3 object storage without needing to duplicate all data into an expensive separate warehouse.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "Batch processing vs. Stream processing: when do you use each in system design?",
      answer: `Choose based on <strong>freshness SLA</strong> and <strong>compute cost</strong>:
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li><strong>Batch Processing (Apache Spark / AWS EMR):</strong> Processes large chunks of historical data periodically (e.g. hourly or nightly). High throughput, cost-effective, but latency is minutes to hours. Use for daily financial reconciliation, monthly invoices, or training recommendation machine learning models.</li>
        <li><strong>Stream Processing (Apache Flink / Google Dataflow):</strong> Processes events individually or in micro-batches with sub-second latency as they arrive over Kafka or Kinesis. Use for live credit card fraud detection, real-time gaming leaderboards, and instant ride-matching in Uber.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How do you prevent OLAP analytical queries from crashing your transactional OLTP database?",
      answer: `<strong>The Golden Rule: Never run analytical reports directly against your operational database.</strong>
      <br/><br/>
      If an analyst runs <code>SELECT COUNT(*), AVG(amount) FROM orders GROUP BY country</code> on your production PostgreSQL or MySQL database, it will scan millions of rows, exhaust RAM buffer pools, lock tables, and cause customer checkout requests to time out.
      <br/><br/>
      <strong>The Solution:</strong> Use <strong>Change Data Capture (CDC)</strong> via Debezium or AWS DMS to stream database write-ahead log (WAL) changes into Kafka or Kinesis, which asynchronously streams data into an analytical warehouse (BigQuery / Redshift / Snowflake). The production OLTP database remains 100% insulated from heavy reporting queries.`
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
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            The 5-Stage Data Pipeline Architecture · Data Lakes vs. Warehouses · Multi-Cloud Tool Matrix
          </p>
        </div>

        <!-- MENTAL MODEL BOX -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: DATA LAKES VS. DATA WAREHOUSES
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-300 leading-relaxed font-sans">
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-cyan-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">water</span>
                Data Lake (Amazon S3 / GCS) = Raw Storage Room
              </strong>
              <p>
                A cheap, massive storage bucket where you dump all data in its original format (raw JSON logs, images, CSVs, clickstreams). You don't clean it first; you store it cheaply and figure out what to do with it later.
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-indigo-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">table_chart</span>
                Data Warehouse (BigQuery / Redshift) = Organized Filing Cabinet
              </strong>
              <p>
                A high-speed columnar database where data has already been cleaned, structured, and organized into tables. Optimized for business intelligence analysts running complex SQL aggregations across billions of rows in seconds.
              </p>
            </div>
          </div>
        </div>

        <!-- WHY THIS MATTERS IN GENERAL SWE INTERVIEWS -->
        <div class="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            INTERVIEW SIGNAL
          </span>
          <p class="text-[12.5px] text-indigo-200/90 leading-relaxed font-sans">
            <strong>Why interviewers ask this:</strong> Even in general backend system design interviews, interviewers check if you know <strong>never to run reporting/analytics on your primary transactional database</strong>. Showing that you know how to decouple OLTP (PostgreSQL) from OLAP (BigQuery/Redshift) using Kafka and Change Data Capture (CDC) demonstrates senior architectural maturity.
          </p>
        </div>

        <!-- 5-Stage Pipeline Pillars -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            THE 5 VENDOR-NEUTRAL PIPELINE STAGES
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div class="bg-[#141C2E]/80 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[10px] font-bold text-cyan-400 uppercase">1. Ingestion</span>
              <span class="text-[12px] text-slate-300 leading-snug">Collecting streaming events (Kafka/Kinesis) and batch files from microservices and logs.</span>
            </div>
            <div class="bg-[#141C2E]/80 border border-blue-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[10px] font-bold text-blue-400 uppercase">2. Raw Storage</span>
              <span class="text-[12px] text-slate-300 leading-snug">Durable, cheap object storage (S3/GCS) acting as the centralized raw Data Lake.</span>
            </div>
            <div class="bg-[#141C2E]/80 border border-indigo-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[10px] font-bold text-indigo-400 uppercase">3. Processing</span>
              <span class="text-[12px] text-slate-300 leading-snug">Distributed engines (Spark/Flink) transforming and aggregating raw files into structured data.</span>
            </div>
            <div class="bg-[#141C2E]/80 border border-emerald-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[10px] font-bold text-emerald-400 uppercase">4. Warehouse</span>
              <span class="text-[12px] text-slate-300 leading-snug">Columnar OLAP databases (BigQuery/Redshift) built for lightning-fast SQL aggregation queries.</span>
            </div>
            <div class="bg-[#141C2E]/80 border border-purple-500/30 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[10px] font-bold text-purple-400 uppercase">5. Presentation</span>
              <span class="text-[12px] text-slate-300 leading-snug">Interactive dashboards (Looker/QuickSight) and machine learning feature stores.</span>
            </div>
          </div>
        </div>

        <!-- Big Data Tool Comparison Table -->
        <div class="flex flex-col gap-3 pt-2">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            BIG DATA CLOUD EQUIVALENCE MATRIX
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Pipeline Stage</th>
                  <th class="p-3.5">Amazon Web Services (AWS)</th>
                  <th class="p-3.5">Google Cloud (GCP)</th>
                  <th class="p-3.5">Microsoft Azure</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${bigDataMatrix.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">${row.stage}</td>
                    <td class="p-3.5 font-code text-cyan-300 text-[12px]">${row.aws}</td>
                    <td class="p-3.5 font-code text-emerald-300 text-[12px]">${row.gcp}</td>
                    <td class="p-3.5 font-code text-blue-300 text-[12px]">${row.azure}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: The Core Decision Rule -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PRINCIPLE: "DATA GRAVITY" TRUMPS FEATURE CHECKLISTS
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            Never choose a big data cloud based on tiny feature differences — all three clouds have mature, battle-tested solutions. The overriding law is <strong>Data Gravity</strong>: moving petabytes of data across cloud boundaries incurs massive bandwidth egress fees ($0.09/GB) and high latency. Always place your data processing pipeline directly inside the cloud where your application data already lives.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Under what query patterns does Google BigQuery's on-demand per-terabyte pricing become significantly more expensive than a provisioned Redshift or Snowflake cluster?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">contact_support</span>
              DEEP-DIVE INTERVIEW FOLLOW-UPS (Q1–Q3)
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
            Every big data architecture follows the same universal 5 stages: Ingestion → Raw Lake → Distributed Processing → Columnar Warehouse → Visualization. Remember data gravity: compute moves to where data lives, never the reverse. In interviews, emphasize decoupling operational OLTP databases from analytical OLAP workloads using Change Data Capture (CDC).
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
