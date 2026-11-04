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
      answer: `When traffic spikes, Lambda scales to 1,000+ isolated microVMs in seconds. If each microVM opens its own direct TCP connection to PostgreSQL or MySQL, the database crashes with <em>"too many connections"</em> (a typical Postgres instance caps out at ~100–300 connections).
      <br/><br/>
      <strong>The Production Fix:</strong>
      <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
        <li><strong>Use AWS RDS Proxy or PgBouncer:</strong> Placed between Lambda and PostgreSQL/MySQL. RDS Proxy maintains a small pool of warm database connections and multiplexes thousands of incoming Lambda queries across them.</li>
        <li><strong>Use HTTP/Connectionless Databases:</strong> Choose Amazon DynamoDB or Amazon Aurora Serverless v2 with Data API, which use stateless HTTP requests rather than persistent stateful TCP sockets.</li>
        <li><strong>Set Reserved Concurrency:</strong> Cap the Lambda function to max 50 concurrent executions to protect the backend database.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is Provisioned Concurrency and when should you use it?",
      answer: `<strong>Provisioned Concurrency</strong> keeps a pre-allocated pool of microVM execution environments permanently initialized, warm, and ready to respond immediately in single-digit milliseconds.
      <br/><br/>
      <strong>Trade-off:</strong> You sacrifice scale-to-zero cost savings (you pay continuous hourly rates for warm instances) in exchange for zero cold start latency. Use it for critical, user-facing checkout or search APIs where p99 latency guarantees are non-negotiable.`
    },
    {
      qNum: "Q3",
      question: "How do you share state between multiple Lambda invocations?",
      answer: `Lambda execution environments are completely stateless and ephemeral — they can be destroyed at any moment. Never store state in local variables or memory across requests.
      <br/><br/>
      <strong>State Persistence Options:</strong>
      <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
        <li><strong>Sub-Millisecond In-Memory State:</strong> Amazon ElastiCache (Redis) or Momento for rate-limiting, session tokens, and hot caches.</li>
        <li><strong>Persistent Document State:</strong> Amazon DynamoDB for user records, shopping carts, and order workflows.</li>
        <li><strong>Shared File Storage:</strong> Mount Amazon EFS (Elastic File System) directly to Lambda for shared machine learning models or large file processing.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "How do scaling and concurrency limits work in Lambda?",
      answer: `Concurrency measures how many function executions run simultaneously at any given second:
      <div class="font-code text-[11.5px] text-cyan-300 bg-[#0A0E1A] p-2 rounded my-1.5 border border-cyan-500/30">
        Concurrency = Invocations per Second × Average Duration (seconds)
      </div>
      <em>Example:</em> 5,000 requests/sec with an average duration of 200 ms (0.2s) = <code>1,000 concurrent executions</code>.
      <br/><br/>
      AWS accounts default to a regional limit of 1,000 concurrent executions across all functions. If sudden traffic exceeds this, synchronous requests fail with <strong>HTTP 429 Too Many Requests</strong>, while asynchronous events are held in internal retry queues for up to 6 hours.`
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
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            MicroVM Sandboxes, Lifecycle Latency, Cold Starts &amp; The Database Connection Trap
          </p>
        </div>

        <!-- SIMPLE MENTAL MODEL -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: LEASING AN APARTMENT VS. CALLING AN UBER
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-300 leading-relaxed font-sans">
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-cyan-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">apartment</span>
                Traditional Server (EC2) = Leasing an Apartment
              </strong>
              <p>
                You pay rent 24 hours a day, 7 days a week, regardless of whether you are home or on vacation. The server is always running and ready to handle traffic instantly with zero wait time.
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-amber-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">local_taxi</span>
                Serverless (Lambda) = Calling an Uber
              </strong>
              <p>
                You pay strictly for the exact minutes you are in the car (CPU execution time). When you do not need a ride, your cost is exactly zero. But when you call a ride, you might wait a moment for the car to arrive (the <strong>Cold Start</strong>).
              </p>
            </div>
          </div>
        </div>

        <!-- WHAT IT IS & WHY IT MATTERS Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- WHAT IT IS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              WHAT IT IS
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              An event-driven compute engine that runs code inside isolated <strong>AWS Firecracker microVMs</strong>. It provisions resources in milliseconds, automatically scales with incoming traffic, and charges per millisecond of compute.
            </p>
          </div>

          <!-- WHY IT MATTERS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              WHY IT MATTERS IN SYSTEM DESIGN
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              "Serverless" removes servers from operations, not from architecture. Candidates must understand <strong>cold start latency</strong>, <strong>concurrency limits</strong>, and the <strong>database connection exhaustion trap</strong>.
            </p>
          </div>
        </div>

        <!-- Firecracker MicroVM Section -->
        <div class="flex flex-col gap-2 bg-[#141C2E] border border-cyan-500/30 rounded-xl p-4 sm:p-5">
          <h3 class="font-sans text-[14.5px] font-bold text-cyan-300 flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">memory</span>
            How Firecracker MicroVMs Power Lambda
          </h3>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            AWS Firecracker is a minimalist open-source hypervisor written in Rust on top of Linux KVM. By stripping out all legacy PC hardware emulation (like IDE drives, floppy controllers, and ACPI tables), it can boot a minimal Linux kernel in <strong>~5 milliseconds with just ~5 MB memory overhead</strong>. This is what allows AWS to run multi-tenant customer workloads on the same physical host with ironclad hardware isolation.
          </p>
        </div>

        <!-- Invocation Pathways: Synchronous vs. Asynchronous -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Synchronous Execution -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[12px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              Synchronous Execution (e.g. API Gateway)
            </span>
            <ol class="flex flex-col gap-2 text-[12.5px] text-slate-300 font-sans list-decimal list-inside pl-1 leading-relaxed">
              <li>Client calls Lambda (e.g. user visits API Gateway endpoint). Request reaches the <strong>Lambda Frontend</strong>.</li>
              <li>Frontend checks auth and passes request to the <strong>Worker Manager</strong> to find an existing warm container.</li>
              <li>If none exists, <strong>Placement Service</strong> assigns a Firecracker microVM on an EC2 worker host and downloads code from S3.</li>
              <li>Function executes inside the microVM and returns response directly to the waiting client.</li>
            </ol>
          </div>

          <!-- Asynchronous Execution -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[12px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
              Asynchronous Execution (e.g. S3 Upload, SNS)
            </span>
            <ol class="flex flex-col gap-2 text-[12.5px] text-slate-300 font-sans list-decimal list-inside pl-1 leading-relaxed">
              <li>Client triggers an event (e.g., photo uploaded to S3). Frontend immediately returns <strong>HTTP 202 Accepted</strong>.</li>
              <li>Frontend places the event into an internal managed <strong>SQS queue</strong>.</li>
              <li>Internal pollers read the queue and invoke functions. If execution fails, it automatically retries twice before routing to a Dead-Letter Queue (DLQ).</li>
            </ol>
          </div>
        </div>

        <!-- PLACEMENT SERVICE & WORKER HOST ARCHITECTURE DIAGRAM -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                PLACEMENT SERVICE &amp; WORKER HOST ARCHITECTURE
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">Firecracker MicroVM Sandbox</span>
              <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">EC2 Worker Fleet</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image As-Is -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/placement-service-worker-host.png" 
                alt="AWS Lambda Placement Service & Worker Host Architecture - Firecracker MicroVM Execution Model" 
                class="w-full h-auto max-w-4xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/placement-service-worker-host.png', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">Client → Frontend → Worker Manager → Placement Service → EC2 Worker Host</span>
            </div>
          </div>

          <!-- Latency & Lifecycle Callouts -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11.5px] font-sans">
            <div class="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
              <span class="text-amber-600 font-bold shrink-0 text-[14px]">▲</span>
              <div>
                <strong class="block font-bold mb-0.5 text-amber-900">Cold Start (100 ms – 5 s):</strong>
                <span>Placement decision + download code from S3 + boot microVM (~5 ms) + start runtime + execute outer code initialization.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
              <span class="text-emerald-600 font-bold shrink-0 text-[14px]">▲</span>
              <div>
                <strong class="block font-bold mb-0.5 text-emerald-900">Warm Start (&lt; 10 ms):</strong>
                <span>Reuses existing active in-memory Firecracker microVM already running on the EC2 worker host with zero boot overhead.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Orange Callout: Cold Start vs. Warm Start -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">speed</span>
            COLD START DEEP DIVE: WHY DO COLD STARTS HAPPEN?
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            A cold start happens whenever an incoming request cannot find an idle, initialized execution environment. Heavy runtimes like Java or .NET experience 2–5 second cold starts because loading JVM bytecode and heavy Spring frameworks takes significant time. Python, Node.js, and Go boot in under 200 ms. <em>Optimization tip:</em> Put database connection initialization <strong>outside the handler function</strong> so it only runs once per cold start, not on every request!
          </p>
        </div>

        <!-- Suited vs Poor Fit for Lambda Boxes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- SUITED FOR LAMBDA -->
          <div class="bg-emerald-950/15 border border-emerald-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              EXCELLENT FIT FOR LAMBDA
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-emerald-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Event-Driven Processing:</strong> S3 file uploads, DynamoDB streams, SQS message processing.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Webhook Handlers:</strong> Stripe checkout webhooks, GitHub push hooks, Slack bot commands.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Scheduled Cron Jobs:</strong> EventBridge cron triggers for nightly cleanups or report generation.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Spiky / Unpredictable Traffic:</strong> Sites with long idle periods where scale-to-zero saves 90% on hosting bills.</span>
              </li>
            </ul>
          </div>

          <!-- POOR FIT FOR LAMBDA -->
          <div class="bg-rose-950/15 border border-rose-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">cancel</span>
              POOR FIT FOR LAMBDA (USE ECS / EKS INSTEAD)
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-rose-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Long-Running Tasks:</strong> Lambda has a hard 15-minute execution timeout. Heavy video rendering will fail.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>High-Frequency Ultra-Low Latency:</strong> Finance or gaming APIs where a 300 ms cold start jitter breaks SLAs.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Persistent Connections (WebSockets):</strong> State-heavy socket daemons are much cheaper to run on long-lived containers.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Constant 24/7 High-Volume Traffic:</strong> If traffic is consistently 10,000 QPS, continuous per-millisecond Lambda pricing costs 3x more than provisioned EC2/Fargate instances.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            What happens when 1,000 Lambda functions attempt to connect to a relational database simultaneously? How does Amazon RDS Proxy solve this?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">contact_support</span>
              DEEP-DIVE INTERVIEW FOLLOW-UPS (Q1–Q4)
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
            Serverless does not eliminate servers; it delegates server capacity management to AWS. Choose serverless for spiky, event-driven workloads where scale-to-zero saves money. For steady 24/7 high-throughput traffic, long-lived containers on ECS/EKS are more cost-effective. In interviews, always mention RDS Proxy or connectionless databases to prevent Lambda from exhausting database connection pools.
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
