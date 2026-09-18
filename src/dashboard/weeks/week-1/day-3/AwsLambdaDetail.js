/**
 * 1.4 AWS Lambda Behind the Scenes - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 14, 15, and 16
 * from The Modern System Design Interview Guide.
 */

export function renderAwsLambdaContent(topic) {
  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you handle database connection exhaustion with Lambda?",
      answer: `Lambda functions scale rapidly to hundreds or thousands of instances, and each instance opens its own database connection. Relational databases like Postgres or MySQL cannot handle thousands of idle connections. Solutions: <strong>(1) Use Amazon RDS Proxy or PgBouncer</strong> to pool and multiplex connections, <strong>(2) Use a connectionless, HTTP-based database</strong> like DynamoDB or Aurora Serverless v2, or <strong>(3) Throttle function concurrency</strong>.`
    },
    {
      qNum: "Q2",
      question: "What is Provisioned Concurrency and when should you use it?",
      answer: `<strong>Provisioned Concurrency</strong> keeps a specified number of execution environments initialized, warm, and ready to respond immediately in single-digit milliseconds. Use it for user-facing APIs with strict latency SLAs where cold starts cannot be tolerated. You pay for provisioned concurrency continuously, trading scale-to-zero savings for latency predictability.`
    },
    {
      qNum: "Q3",
      question: "How do you share state between multiple Lambda invocations?",
      answer: `Execution environments are stateless and ephemeral. Any state that must persist across invocations must be stored externally: <strong>(1) Amazon ElastiCache (Redis)</strong> for low-latency in-memory state, <strong>(2) DynamoDB</strong> for persistent key-value state, or <strong>(3) Amazon EFS</strong> for shared filesystem access across Lambda instances.`
    },
    {
      qNum: "Q4",
      question: "How does scaling and concurrency limits work in Lambda?",
      answer: `Concurrency is the number of requests your function is executing simultaneously: <code>Concurrency = Invocations / second × Average Duration (seconds)</code>. Accounts have a default regional limit of 1,000 concurrent executions. If traffic spikes beyond your concurrency limit, requests are throttled (HTTP 429 for synchronous invocations; asynchronous events are buffered for up to 6 hours).`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 14 & 15: INVOCATION FLOWS, DIAGRAM & COLD START DEEP-DIVE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              1.4 AWS Lambda Behind the Scenes
            </h2>
          </div>
        </div>

        <!-- WHAT IT IS & WHY IT MATTERS Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- WHAT IT IS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              WHAT IT IS
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              A serverless event-driven execution runtime that runs code in sandboxed Firecracker microVMs with sub-second provisioning and scale-to-zero billing.
            </p>
          </div>

          <!-- WHY IT MATTERS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              WHY IT MATTERS
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              Serverless removes servers from your operations, not your architecture. Understanding cold starts, concurrency limits, and state handling is mandatory for modern system design.
            </p>
          </div>
        </div>

        <!-- Firecracker MicroVM Section -->
        <div class="flex flex-col gap-2 bg-[#141C2E] border border-cyan-500/30 rounded-xl p-4 sm:p-5">
          <h3 class="font-sans text-[14.5px] font-bold text-cyan-300 flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">memory</span>
            Firecracker MicroVM
          </h3>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Firecracker is an open-source virtualization technology that uses Linux's Kernel-based Virtual Machine (KVM) to launch lightweight microVMs [1]. It provides hardware-level isolation for multi-tenant serverless workloads with the startup speed of containers (~5 ms boot time, ~5 MB memory footprint). Firecracker is what enables Lambda to provide hardware isolation per customer while scaling functions instantly.
          </p>
        </div>

        <!-- Invocation Pathways: Synchronous vs. Asynchronous -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Synchronous Execution -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[12px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              Synchronous Execution
            </span>
            <ol class="flex flex-col gap-2 text-[12.5px] text-slate-300 font-sans list-decimal list-inside pl-1 leading-relaxed">
              <li>The client invokes a Lambda function synchronously (e.g. via API Gateway or direct SDK call). The request hits the <strong>Lambda Frontend</strong>.</li>
              <li>The Frontend authenticates and validates the request, then calls the <strong>Worker Manager</strong> to find an existing warm execution environment or provision a new one via the <strong>Placement Service</strong>.</li>
              <li>The Placement Service places the microVM on an EC2 worker host running Firecracker and downloads the function code from S3.</li>
              <li>The code is executed in the isolated microVM, and the response is returned directly to the caller.</li>
            </ol>
          </div>

          <!-- Asynchronous Execution -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[12px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
              Asynchronous Execution
            </span>
            <ol class="flex flex-col gap-2 text-[12.5px] text-slate-300 font-sans list-decimal list-inside pl-1 leading-relaxed">
              <li>The client invokes a Lambda function asynchronously (e.g. via S3 event notification or SNS). The request reaches the Frontend, which immediately returns an <strong>HTTP 202 Accepted</strong> to the caller.</li>
              <li>The Frontend pushes the event into an internal, managed SQS queue.</li>
              <li>A fleet of pollers reads from the internal queue and invokes the function synchronously via the Worker Manager. If execution fails, Lambda retries automatically (twice by default) before sending the event to a Dead-Letter Queue (DLQ) or EventBridge On-Failure Destination.</li>
            </ol>
          </div>
        </div>

        <!-- PLACEMENT SERVICE & WORKER HOST DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              PLACEMENT SERVICE & WORKER HOST ARCHITECTURE
            </span>
            <span class="text-[11px] font-code text-slate-500">Firecracker MicroVM Sandbox</span>
          </div>

          <div class="p-4 bg-[#0F1626] border border-cyan-500/30 rounded-xl flex flex-col gap-3">
            <div class="text-[11.5px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
[Client] ──(Sync)──> [Frontend] ──> [Worker Manager] ──> [Placement Service]
                                                               │
                                                       (find/provision)
                                                               │
                                                               v
                                                    [EC2 WORKER HOST]
                                                    ┌───────────────────────────┐
                                                    │ MicroVM (Firecracker)     │
                                                    │ ┌───────────────────────┐ │
                                                    │ │ Function Code (S3)    │ │
                                                    │ │ Runtime Bootstrap     │ │
                                                    │ │ Guest Kernel (~5 MB)  │ │
                                                    │ └───────────────────────┘ │
                                                    │ Firecracker Process       │
                                                    │ KVM                       │
                                                    │ Host Linux Kernel         │
                                                    └───────────────────────────┘
            </div>

            <div class="pt-2 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-code">
              <span class="text-amber-400 font-semibold">▲ cold start = placement + download code + runtime init + function init (~100 ms – 10 s)</span>
              <span class="text-emerald-400 font-semibold">▲ warm start = reuse running microVM (&lt;10 ms)</span>
            </div>
          </div>
        </div>

        <!-- Orange Callout: Cold Start vs. Warm Start -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            COLD START VS. WARM START
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            A cold start occurs when no idle execution environment is available to handle an incoming invocation. The system must allocate host resources, create the microVM, download the deployment package from S3, start the runtime, and execute initialization code (outside the handler). This can take hundreds of milliseconds to multiple seconds (especially for Java or .NET). A warm start reuses an existing execution environment that handled a previous request, taking single-digit milliseconds.
          </p>
        </div>

        <!-- Suited vs Poor Fit for Lambda Boxes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- SUITED FOR LAMBDA -->
          <div class="bg-emerald-950/15 border border-emerald-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase tracking-wider">
              SUITED FOR LAMBDA
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-emerald-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Event-driven architectures (S3 file uploads, DynamoDB streams)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Webhooks and integration glue between systems</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Periodic scheduled tasks (EventBridge / cron)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Spiky or unpredictable workloads with long idle periods</span>
              </li>
            </ul>
          </div>

          <!-- POOR FIT FOR LAMBDA -->
          <div class="bg-rose-950/15 border border-rose-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-rose-400 uppercase tracking-wider">
              POOR FIT FOR LAMBDA
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-rose-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Long-running background jobs (Lambda has a 15-minute hard timeout)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>High-throughput, latency-critical services where cold start jitter is unacceptable</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Stateful workloads (websockets, in-memory caches, background daemons)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Workloads with steady 24/7 utilization (cost is higher than provisioned compute)</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            What happens when 1,000 Lambda functions attempt to connect to a relational database at the same time?
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
            Serverless does not remove servers; it moves capacity planning to the vendor. Judge it on traffic shape: bursty favors functions, steady favors containers. Always name the connection exhaustion problem when pairing serverless with relational databases.
          </p>
        </div>

        <!-- Page 16 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 16</span>
        </div>

      </div>

    </div>
  `;
}
