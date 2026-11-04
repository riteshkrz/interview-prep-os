/**
 * 1.3 Cloud Service Models: IaaS, PaaS, and SaaS - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 13 & 14
 * from The Modern System Design Interview Guide.
 */

export function renderCloudModelsContent(topic) {
  const stackLayers = [
    {
      layer: "Applications & Business Logic",
      onPrem: "You",
      iaas: "You",
      paas: "You",
      faas: "You",
      saas: "Provider",
      description: "Custom code, microservices, frontend UI, APIs, business domain rules"
    },
    {
      layer: "Data & Database Schema",
      onPrem: "You",
      iaas: "You",
      paas: "You",
      faas: "You",
      saas: "Provider",
      description: "Database schemas, SQL queries, data indexing, state persistence, backup schedules"
    },
    {
      layer: "Runtime & Middleware",
      onPrem: "You",
      iaas: "You",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Language engines (JVM, Node.js, Python, Go), web servers (Nginx), message queues"
    },
    {
      layer: "Operating System & Kernel",
      onPrem: "You",
      iaas: "You",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Linux distributions (Ubuntu, Amazon Linux), security patches, kernel parameter tuning"
    },
    {
      layer: "Virtualization & Compute Fabric",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Hypervisors (KVM, ESXi), MicroVMs (Firecracker), physical node orchestration"
    },
    {
      layer: "Physical Servers & Racks",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Bare-metal rack servers, CPU blades, ECC RAM modules, hardware replacements"
    },
    {
      layer: "Storage & Block Devices",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "SAN arrays, NVMe drive enclosures, disk RAID arrays, drive replacement"
    },
    {
      layer: "Physical Datacenter & Networking",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Fiber lines, core switches, power backup (UPS/generators), HVAC cooling, physical guards"
    }
  ];

  const cloudTiersComparison = [
    {
      tier: "IaaS (Infrastructure as a Service)",
      vendorExamples: "AWS EC2, Google Compute Engine, Azure VMs, AWS EBS, VPC",
      controlLevel: "Maximum Control (Root OS access, custom kernel tuning, raw network config)",
      operationalToil: "High (Requires dedicated engineers for OS patching, upgrades, and monitoring)",
      economicSweetSpot: "Large scale (> $25K/month), custom hardware requirements, predictable 24/7 load",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      tier: "PaaS (Platform as a Service)",
      vendorExamples: "Heroku, Render, AWS Elastic Beanstalk, Amazon RDS, Google Cloud SQL",
      controlLevel: "Moderate Control (Manage your code & database schema; runtime is automated)",
      operationalToil: "Near-Zero (Provider handles OS security patches, high availability & auto-healing)",
      economicSweetSpot: "Early startups, MVPs, 0-to-1 build speed, small engineering teams without DevOps",
      badgeColor: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30"
    },
    {
      tier: "FaaS (Function as a Service / Serverless)",
      vendorExamples: "AWS Lambda, Google Cloud Run, Cloudflare Workers, Azure Functions",
      controlLevel: "Code-Only Control (Write pure function handlers; cloud manages concurrency)",
      operationalToil: "Zero (Scale-to-zero, instant concurrency scaling per millisecond)",
      economicSweetSpot: "Spiky/unpredictable traffic, asynchronous event processing, webhook handlers",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      tier: "SaaS (Software as a Service)",
      vendorExamples: "Gmail, Datadog, Slack, GitHub, Salesforce, Stripe, Snowflake",
      controlLevel: "Config Only (User accounts, API keys, dashboard settings, webhook URLs)",
      operationalToil: "Zero (Vendor manages 100% of underlying infrastructure, scaling, and backups)",
      economicSweetSpot: "Undifferentiated business capabilities (auth, email, payments, monitoring)",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Where do modern serverless runtimes (AWS Lambda, Cloudflare Workers, Google Cloud Run) sit on the cloud spectrum?",
      answer: `Serverless compute is classified as <strong>FaaS (Function-as-a-Service)</strong>, an evolution of PaaS designed for event-driven computing:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Scale to Zero:</strong> Traditional PaaS (Heroku, App Engine) keeps servers running continuously, meaning you pay even when zero requests arrive. FaaS scales down to <strong>absolute zero</strong> when idle and charges strictly per millisecond of CPU execution.</li>
        <li><strong>MicroVM Execution:</strong> When a request arrives, AWS Lambda uses lightweight microVMs (AWS Firecracker) that spin up in ~5 milliseconds to execute the function handler in an isolated sandbox.</li>
        <li><strong>Container-Based Serverless:</strong> Modern tools like Google Cloud Run and AWS Fargate allow you to package full Docker containers while still getting scale-to-zero and automatic horizontal scaling without managing virtual servers.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How do you strategically decide between deploying to an IaaS VM vs. a PaaS vs. managed Kubernetes (EKS/GKE)?",
      answer: `Senior engineers evaluate this through the lens of <strong>Total Cost of Ownership (TCO)</strong> — factoring in developer salaries alongside cloud hosting fees:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Phase 1 (0 to 1 / Early Product): Choose PaaS.</strong> When your team has 3 engineers, spending $300/month on Render or Heroku is infinitely smarter than paying $180,000/year for a dedicated DevOps engineer. Speed to market is everything.</li>
        <li><strong>Phase 2 (Growth / $15K–$25K monthly spend): The Turning Point.</strong> PaaS compute carries a ~2.5x to 3x markup over raw cloud instances. When cloud spend hits $25K/month, that premium is ~$15K/month ($180,000/year) — the cost of a full-time platform engineer.</li>
        <li><strong>Phase 3 (Scale & Multi-Cloud): Choose Managed Kubernetes (EKS/GKE).</strong> The optimal sweet spot: the cloud provider manages the Kubernetes master nodes and etcd cluster (PaaS layer for orchestration), while your containers run on standard elastic EC2/Compute instances (IaaS compute pricing). You get container portability without bare VM maintenance toil.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is the difference between API lock-in and Runtime lock-in, and how do you handle it in system design?",
      answer: `Interviewers look for candidates who understand benign portability vs. dangerous architectural traps:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Runtime Lock-in (Low Risk):</strong> Packaging your services into standard Docker containers. Whether you run them on AWS ECS, Google Cloud Run, Azure AKS, or on-prem hardware, the container executes identically. Switching cloud providers takes days.</li>
        <li><strong>Proprietary API Lock-in (High Risk):</strong> Tightly coupling your application code to proprietary vendor APIs (e.g. AWS DynamoDB single-table SDKs, AWS Step Functions, Google Cloud Spanner). Migrating away requires a full rewrite of your database and business logic.</li>
        <li><strong>Interview Strategy:</strong> Use open-standard abstractions where possible (PostgreSQL on RDS rather than proprietary schemas; Kafka rather than proprietary message queues). When you do choose a proprietary service (like DynamoDB for low-latency lookups), explicitly state: <em>"We wrap our DynamoDB access in a Repository interface so our domain logic remains decoupled."</em></li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "What is the Cloud Shared Responsibility Model, and who is responsible when a cloud security breach occurs?",
      answer: `The <strong>Shared Responsibility Model</strong> cleanly divides security responsibilities:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Security OF the Cloud (Provider's Responsibility):</strong> Physical datacenter security, power, biometric entry, hypervisor isolation, and hardware decommissioning. AWS or Google guarantees the physical server cannot be physically stolen or tampered with.</li>
        <li><strong>Security IN the Cloud (Your Responsibility):</strong> Data encryption (at rest and in transit), firewall rules (Security Groups), IAM role permissions, operating system security patches (on IaaS VMs), and application code security.</li>
        <li><strong>The Key Takeaway:</strong> In over 95% of real-world enterprise cloud leaks (like exposed Amazon S3 buckets or SSRF attacks), the root cause was <strong>customer misconfiguration</strong> (e.g., wildcards in IAM policies or public permissions), NOT a breach of the cloud provider's physical infrastructure.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 13 (BOTTOM) & PAGE 14: CLOUD MODELS, MATRIX & DEEP DIVES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              1.3 Cloud Service Models: IaaS, PaaS, and SaaS
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            The Shared Responsibility Spectrum · Stack Economics, Headcount TCO, Serverless & Lock-in Dynamics
          </p>
        </div>

        <!-- THE PIZZA ANALOGY MENTAL MODEL -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: PIZZA AS A SERVICE
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            The simplest way to understand the cloud tiers is by looking at who does the cooking vs. who provides the kitchen:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12.5px] font-sans">
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-slate-700/60 flex flex-col gap-1.5">
              <span class="font-code text-[12px] font-bold text-slate-200">1. On-Premises (Homemade)</span>
              <p class="text-slate-400 text-[12px]">
                You make the dough, buy toppings, heat your own home oven, set the dining table, and wash all dishes. You control everything, but do all the work.
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-cyan-500/30 flex flex-col gap-1.5">
              <span class="font-code text-[12px] font-bold text-cyan-300">2. IaaS (Store-Bought Frozen)</span>
              <p class="text-slate-400 text-[12px]">
                The store sells you frozen pizza dough & cheese (raw VMs and storage). You still use your own oven, bake it, and set the table yourself.
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-indigo-500/30 flex flex-col gap-1.5">
              <span class="font-code text-[12px] font-bold text-indigo-300">3. PaaS (Pizza Delivery)</span>
              <p class="text-slate-400 text-[12px]">
                They prepare the pizza and bake it in their commercial oven, then deliver it hot to your door. You only supply the table and drinks.
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-emerald-500/30 flex flex-col gap-1.5">
              <span class="font-code text-[12px] font-bold text-emerald-300">4. SaaS (Dine-In Pizzeria)</span>
              <p class="text-slate-400 text-[12px]">
                You walk into the restaurant. They cook, serve at the table, and clean up. You just sit down, eat, and pay the check.
              </p>
            </div>
          </div>
        </div>

        <!-- WHY THIS MATTERS IN SYSTEM DESIGN INTERVIEWS -->
        <div class="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            INTERVIEW SIGNAL
          </span>
          <p class="text-[12.5px] text-indigo-200/90 leading-relaxed font-sans">
            <strong>Why interviewers care:</strong> Candidates often propose self-hosting databases, Redis, or Kafka on raw EC2 instances to "save money". Seniors know that managing your own clusters requires round-the-clock on-call rotations and automated failovers that cost hundreds of thousands of dollars in engineering salaries. In an interview, <strong>default to managed services (RDS, DynamoDB, SQS)</strong> unless there is a specific scale or cost reason not to.
          </p>
        </div>

        <!-- THE 8-LAYER CLOUD RESPONSIBILITY PYRAMID DIAGRAM -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                THE 8-LAYER CLOUD RESPONSIBILITY PYRAMID
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">Separation of Operational Ownership</span>
              <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">On-Premise vs. IaaS vs. PaaS vs. SaaS</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image As-Is -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/cloud-responsibility-pyramid.jpg" 
                alt="The 8-Layer Cloud Responsibility Pyramid - Separation of Operational Ownership across On-Premise, IaaS, PaaS, and SaaS" 
                class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/cloud-responsibility-pyramid.jpg', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">8 Stack Layers · On-Premise · IaaS · PaaS · SaaS Demarcation</span>
            </div>
          </div>

          <!-- Key Lines of Demarcation -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12px]">
            <div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 shadow-sm">
              <div class="flex items-center gap-2 mb-1.5 font-bold text-[13px] text-cyan-900">
                <span class="material-symbols-outlined text-[18px]">verified_user</span>
                <span>IaaS Boundary: Hardware vs. Operating System</span>
              </div>
              <p class="leading-relaxed text-[12px] text-slate-700">
                The <strong>hypervisor is the dividing line</strong>. The cloud provider guarantees that the physical server, power, and virtual hardware stay online. You are responsible for everything inside the operating system: installing kernel security updates, opening firewall ports, setting up swap space, and configuring runtimes.
              </p>
            </div>
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
              <div class="flex items-center gap-2 mb-1.5 font-bold text-[13px] text-emerald-900">
                <span class="material-symbols-outlined text-[18px]">layers</span>
                <span>PaaS Boundary: Infrastructure vs. Application Code</span>
              </div>
              <p class="leading-relaxed text-[12px] text-slate-700">
                The <strong>application runtime is the dividing line</strong>. The provider handles OS patching, server hardware failures, database replication, and auto-scaling. You bring only your application code, database schema, and environment variables.
              </p>
            </div>
          </div>
        </div>

        <!-- Cloud Service Model Overview Section (Grid Cards) -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Architectural Breakdown of the Four Cloud Tiers
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <!-- IaaS Card -->
            <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-2.5">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded font-code text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  IaaS
                </span>
                <span class="text-[13px] font-sans font-bold text-white">Infrastructure</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                Rents raw compute instances, block storage drives, and software-defined networks. You configure the OS, runtimes, and application stack; the provider maintains the physical servers.
              </p>
              <div class="pt-2 border-t border-[#24314A]/60 font-code text-[11px] text-cyan-300">
                AWS EC2 · GCP Compute · Azure VMs
              </div>
            </div>

            <!-- PaaS Card -->
            <div class="bg-[#141C2E] border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-2.5">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded font-code text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  PaaS
                </span>
                <span class="text-[13px] font-sans font-bold text-white">Platform</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                Provides a fully managed runtime environment. The provider automates operating system patching, SSL certificates, load balancing, and failover; you simply deploy your code.
              </p>
              <div class="pt-2 border-t border-[#24314A]/60 font-code text-[11px] text-indigo-300">
                Heroku · Render · Amazon RDS
              </div>
            </div>

            <!-- FaaS Card -->
            <div class="bg-[#141C2E] border border-amber-500/30 rounded-xl p-5 flex flex-col gap-2.5">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded font-code text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  FaaS
                </span>
                <span class="text-[13px] font-sans font-bold text-white">Functions / Serverless</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                Event-driven ephemeral compute. MicroVM runtimes spin up in milliseconds in response to triggers (HTTP request, S3 file upload, SQS message), scale to zero when idle, and bill per millisecond.
              </p>
              <div class="pt-2 border-t border-[#24314A]/60 font-code text-[11px] text-amber-300">
                AWS Lambda · Cloud Run · Workers
              </div>
            </div>

            <!-- SaaS Card -->
            <div class="bg-[#141C2E] border border-emerald-500/30 rounded-xl p-5 flex flex-col gap-2.5">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded font-code text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  SaaS
                </span>
                <span class="text-[13px] font-sans font-bold text-white">Software</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                Ready-to-use software applications accessed through web browsers or APIs. The vendor manages 100% of the underlying infrastructure, code updates, security, and disaster recovery.
              </p>
              <div class="pt-2 border-t border-[#24314A]/60 font-code text-[11px] text-emerald-300">
                Gmail · Datadog · Slack · Stripe
              </div>
            </div>
          </div>
        </div>

        <!-- Responsibility Matrix Table -->
        <div class="flex flex-col gap-3 pt-2">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              COMPREHENSIVE SHARED RESPONSIBILITY MATRIX
            </span>
            <div class="flex items-center gap-3 text-[11px] font-code">
              <span class="flex items-center gap-1.5 text-cyan-300">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span> You Manage
              </span>
              <span class="flex items-center gap-1.5 text-emerald-400">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Provider Manages
              </span>
            </div>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Stack Layer</th>
                  <th class="p-3.5 text-center">On-Premise</th>
                  <th class="p-3.5 text-center">IaaS</th>
                  <th class="p-3.5 text-center">PaaS</th>
                  <th class="p-3.5 text-center">FaaS</th>
                  <th class="p-3.5 text-center">SaaS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${stackLayers.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">
                      <div class="flex flex-col">
                        <span>${row.layer}</span>
                        <span class="text-[11px] text-slate-400 font-normal font-sans">${row.description}</span>
                      </div>
                    </td>
                    <td class="p-3.5 text-center">
                      <span class="px-2.5 py-1 rounded text-[11px] font-code font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        ${row.onPrem}
                      </span>
                    </td>
                    <td class="p-3.5 text-center">
                      <span class="px-2.5 py-1 rounded text-[11px] font-code font-bold ${row.iaas === 'You' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}">
                        ${row.iaas}
                      </span>
                    </td>
                    <td class="p-3.5 text-center">
                      <span class="px-2.5 py-1 rounded text-[11px] font-code font-bold ${row.paas === 'You' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}">
                        ${row.paas}
                      </span>
                    </td>
                    <td class="p-3.5 text-center">
                      <span class="px-2.5 py-1 rounded text-[11px] font-code font-bold ${row.faas === 'You' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}">
                        ${row.faas}
                      </span>
                    </td>
                    <td class="p-3.5 text-center">
                      <span class="px-2.5 py-1 rounded text-[11px] font-code font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        ${row.saas}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Official Page 13 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 13</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 14: ECONOMICS, CALLOUTS, INTERVIEW FOLLOW-UPS & TAKEAWAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Stack Economics & Total Cost of Ownership (TCO) Section -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-6 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h3 class="font-sans text-[17px] sm:text-[19px] font-bold text-white tracking-tight">
              Cloud Economics: The Headcount Cost of Raw Infrastructure
            </h3>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Junior engineers often look only at raw hosting bills and say: <em>"A managed database costs 2.5x more than running Postgres on an EC2 instance, so let's run our own."</em> This ignores the <strong>IaaS Iceberg Fallacy</strong>:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div class="bg-[#141C2E] border border-amber-500/30 rounded-xl p-5 flex flex-col gap-2.5">
              <span class="font-code text-[12px] font-bold text-amber-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">trending_down</span>
                The Visible 25%: The Monthly Cloud Bill
              </span>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                On an invoice, 10 raw virtual machines might cost ~$1,500/month, whereas the managed PaaS equivalent costs ~$3,500/month. The apparent extra cost is $2,000/month.
              </p>
            </div>

            <div class="bg-[#141C2E] border border-rose-500/30 rounded-xl p-5 flex flex-col gap-2.5">
              <span class="font-code text-[12px] font-bold text-rose-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">warning</span>
                The Hidden 75%: Engineering Salaries & On-Call Toil
              </span>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                Managing raw VMs requires hiring at least two Site Reliability Engineers ($350,000+/year total compensation) to handle 24/7 on-call alerts, OS security CVE patches, disk full panics, and database replica resyncing.
              </p>
            </div>
          </div>
        </div>

        <!-- Green Callout Box: Senior Perspective: When PaaS Becomes a Liability -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: WHEN PAAS BECOMES A LIABILITY & THE MIGRATION THRESHOLD
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            PaaS platforms (Heroku, Render, Firebase) are unmatched for rapid product launches. But they reach an architectural tipping point when: (1) <strong>Monthly hosting spend exceeds $20K–$30K</strong>, where the markup justifies hiring a full-time platform engineer; (2) <strong>Low-level network or kernel tuning is needed</strong> (e.g., custom Linux socket buffer sizes for million-connection WebSockets); or (3) <strong>Strict compliance requires isolated private networks (VPCs)</strong>. Mature startups start on PaaS for speed, and migrate to managed Kubernetes (EKS/GKE) as scale demands.
          </p>
        </div>

        <!-- Orange Callout: Warning on Vendor Lock-in -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">lock</span>
            THE VENDOR LOCK-IN TRAP: PROPRIETARY APIS VS. CONTAINER RUNTIMES
          </span>
          <p class="text-[13px] text-amber-200/90 leading-relaxed font-sans">
            Always distinguish between <strong>runtime lock-in</strong> (running Docker containers on AWS ECS, GKE, or Azure) and <strong>proprietary API lock-in</strong> (writing code tightly coupled to AWS DynamoDB single-table APIs or Google Spanner). Docker containers can move to another cloud provider in days. Proprietary database APIs create structural lock-in requiring months of software rewrites to escape. In system design interviews, wrap cloud-specific SDKs behind repository interfaces.
          </p>
        </div>

        <!-- Strategic Comparison Table: Cloud Tiers -->
        <div class="flex flex-col gap-3 pt-1">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DECISION MATRIX: BALANCING CONTROL, TOIL, AND COST
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Tier</th>
                  <th class="p-3.5">Vendor Examples</th>
                  <th class="p-3.5">Control Level</th>
                  <th class="p-3.5">Operational Toil</th>
                  <th class="p-3.5">Economic Sweet Spot</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12px]">
                ${cloudTiersComparison.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">
                      <span class="px-2.5 py-1 rounded font-code text-[11px] border ${row.badgeColor} whitespace-nowrap inline-block">
                        ${row.tier}
                      </span>
                    </td>
                    <td class="p-3.5 font-code text-slate-300 text-[11.5px]">${row.vendorExamples}</td>
                    <td class="p-3.5 text-slate-300 font-medium">${row.controlLevel}</td>
                    <td class="p-3.5 text-slate-300">${row.operationalToil}</td>
                    <td class="p-3.5 text-emerald-300 font-medium">${row.economicSweetSpot}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            At what monthly cloud spend would you propose migrating from Heroku/Firebase to an EKS/GKE cluster? What hidden operational costs (VPC peering, NAT gateway bandwidth, on-call rotations) does that introduce?
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
            Evaluate cloud architectures across three key dimensions: control, engineering toil, and lock-in vs. speed. A seasoned engineer never claims "managed services are too expensive" without factoring in the massive six-figure salary costs of dedicated DevOps teams needed to run raw infrastructure. Default to PaaS and managed services for speed, move to managed Kubernetes (EKS/GKE) at scale, and isolate proprietary cloud SDKs behind clean interfaces.
          </p>
        </div>

        <!-- Official Page 14 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 14</span>
        </div>

      </div>

    </div>
  `;
}
