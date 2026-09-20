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
      description: "Relational/NoSQL schemas, data indexing, state persistence, backup policies"
    },
    {
      layer: "Runtime & Middleware",
      onPrem: "You",
      iaas: "You",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Language runtimes (JVM, Node.js, Go, Python), web servers, message brokers"
    },
    {
      layer: "Operating System & Kernel",
      onPrem: "You",
      iaas: "You",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Linux distributions, kernel sysctl tuning, security patching, systemd daemons"
    },
    {
      layer: "Virtualization & Compute Fabric",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Hypervisors (KVM, ESXi), MicroVMs (Firecracker), physical server scheduling"
    },
    {
      layer: "Physical Servers & Racks",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Bare-metal rack servers, CPU blades, ECC RAM modules, hardware diagnostics"
    },
    {
      layer: "Storage & Block Devices",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "SAN arrays, NVMe drive enclosures, disk RAID arrays, volume striping"
    },
    {
      layer: "Physical Datacenter & Networking",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      faas: "Provider",
      saas: "Provider",
      description: "Fiber lines, spine switches, power distribution units (PDU), HVAC cooling"
    }
  ];

  const cloudTiersComparison = [
    {
      tier: "IaaS (Infrastructure as a Service)",
      vendorExamples: "AWS EC2, Google Compute Engine, Azure VMs, AWS EBS, VPC",
      controlLevel: "Maximum Control (Full OS root, kernel tuning, custom networking)",
      operationalToil: "High (Requires dedicated SREs for OS patching, upgrades, and monitoring)",
      economicSweetSpot: "Scale > $25K/month, custom hardware requirements, predictable high load",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      tier: "PaaS (Platform as a Service)",
      vendorExamples: "Heroku, Google App Engine, AWS Elastic Beanstalk, Amazon RDS, Cloud SQL",
      controlLevel: "Moderate Control (Code & schema only; standard runtime containers)",
      operationalToil: "Near-Zero (Provider automates patching, high availability & auto-healing)",
      economicSweetSpot: "Early startups, MVP development, 0-to-1 speed, small engineering teams",
      badgeColor: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30"
    },
    {
      tier: "FaaS (Function as a Service / Serverless)",
      vendorExamples: "AWS Lambda, Google Cloud Run, Cloudflare Workers, Azure Functions",
      controlLevel: "Constrained Control (Pure function logic, event trigger bindings)",
      operationalToil: "Zero (Scale-to-zero, automatic concurrency scaling per millisecond)",
      economicSweetSpot: "Spiky/unpredictable traffic, asynchronous event processing, webhook handlers",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      tier: "SaaS (Software as a Service)",
      vendorExamples: "Gmail, Datadog, Slack, GitHub, Salesforce, Stripe, Snowflake",
      controlLevel: "Application User / Config (RBAC policies, API webhook integrations)",
      operationalToil: "Zero (Vendor operates 100% of underlying infrastructure and software)",
      economicSweetSpot: "Undifferentiated business capabilities (auth, email, monitoring, billing)",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Where do modern serverless runtimes (AWS Lambda, Cloudflare Workers, Google Cloud Run) sit on the cloud spectrum?",
      answer: `Serverless compute is classified as <strong>FaaS (Function-as-a-Service)</strong>, an ultra-specialized evolution of the PaaS paradigm:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Execution Model:</strong> While traditional PaaS (Heroku, App Engine) keeps persistent application servers running continuously (paying for idle CPU cycles), FaaS introduces <strong>event-driven ephemeral execution with true scale-to-zero</strong>. Billing is metered strictly per millisecond of actual CPU execution.</li>
        <li><strong>Infrastructure Abstraction:</strong> The cloud provider manages the entire server lifecycle: provisioning microVM sandboxes (AWS Firecracker), downloading container images, routing incoming events, and tearing down idle instances. The developer provides only stateless function code and trigger bindings (HTTP gateway, S3 upload, SQS message).</li>
        <li><strong>Container-Based Serverless (Google Cloud Run / AWS Fargate):</strong> Bridges the gap between PaaS and FaaS by allowing developers to package arbitrary Docker containers while retaining scale-to-zero and fully managed infrastructure.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How do you mathematically and strategically decide between deploying to an IaaS VM vs. a PaaS (Heroku/Render) vs. managed Kubernetes (EKS/GKE)?",
      answer: `Senior engineers evaluate this decision through the lens of <strong>Total Cost of Ownership (TCO)</strong> and <strong>Operational Headcount Economics</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Stage 1 (0 to 1 / Early Startup): Choose PaaS.</strong> When a company has 3 developers and $0 revenue, spending $300/month on Heroku or Render is infinitely cheaper than hiring a DevOps engineer ($180K–$250K/year). The primary business currency is time-to-market and iteration speed.</li>
        <li><strong>Stage 2 (Growth / $15K–$25K monthly spend): The Economic Inflection Point.</strong> PaaS compute margins carry a ~2.5× to 3× markup over raw cloud instances. When cloud spend reaches $20K/month, that premium equals ~$12K/month ($144K/year) — roughly the cost of a dedicated platform engineer. However, migrating to raw IaaS VMs is an anti-pattern because managing bare OS instances introduces heavy patching toil.</li>
        <li><strong>Stage 3 (Scale & Portability): Choose Managed Kubernetes (EKS/GKE).</strong> Managed Kubernetes provides the optimal balance: the cloud provider manages the Kubernetes control plane, master nodes, and etcd cluster (PaaS layer for orchestration), while your workloads run on standard OCI containers on elastic EC2/Compute instances (IaaS compute economics). This prevents proprietary lock-in while avoiding bare VM management.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is the true architectural difference between proprietary API lock-in and runtime lock-in, and how do you mitigate it in a system design interview?",
      answer: `Interviewers look for candidates who differentiate between benign portability trade-offs and dangerous structural traps:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Runtime Lock-in (Low Risk):</strong> Packaging your services as standard Docker/OCI containers running on Linux. Whether deployed on AWS ECS, Google Cloud Run, Azure AKS, or on-premises bare metal, the container executes identically. Moving between cloud providers is straightforward.</li>
        <li><strong>Proprietary API Lock-in (High Structural Risk):</strong> Writing code deeply coupled to vendor-proprietary services with proprietary query languages and non-portable SDKs (e.g., AWS DynamoDB single-table design, Google Cloud Spanner, AWS Step Functions, BigQuery). Migrating away requires a complete rewrite of application persistence logic and data pipelines.</li>
        <li><strong>Interview Mitigation Strategy:</strong>
          <br/>1. <em>Use open-source protocol standards:</em> Prefer PostgreSQL/MySQL on managed RDS/Cloud SQL rather than proprietary database engines; prefer Apache Kafka over AWS Kinesis.
          <br/>2. <em>Hexagonal / Clean Architecture:</em> Isolate cloud-specific SDKs behind domain repository interfaces and adapters (Ports and Adapters pattern), ensuring the core domain model has zero cloud dependencies.
          <br/>3. <em>Deliberate Trade-off Justification:</em> Acknowledge lock-in explicitly: <em>"We will use AWS DynamoDB because its single-digit millisecond latency at 100K QPS with zero maintenance outweighs the migration risk for our core checkout path."</em></li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "What is the Cloud Shared Responsibility Model for security and regulatory compliance, and who is liable during a catastrophic cloud breach?",
      answer: `The <strong>Shared Responsibility Model</strong> strictly delineates security <em>OF</em> the cloud from security <em>IN</em> the cloud:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Security OF the Cloud (Provider's Liability):</strong> The cloud provider (AWS, GCP, Azure) is strictly responsible for physical datacenter security, biometric facility access, hardware decommissioning, hypervisor integrity, network infrastructure, and physical host firmware.</li>
        <li><strong>Security IN the Cloud (Customer's Liability):</strong> The customer is 100% responsible for customer data encryption (at rest and in transit), Identity & Access Management (IAM) role least privilege, security group firewall ingress/egress rules, OS security patching (on IaaS VMs), database credentials, and application vulnerability patches.</li>
        <li><strong>The Compliance Trap:</strong> In 99% of historical enterprise cloud data breaches (e.g. leaked S3 buckets, Capital One SSRF), the breach was caused by <strong>customer misconfiguration</strong> (overly permissive IAM policies, public bucket ACLs, unpatched EC2 instances), not a vulnerability in the cloud provider's physical infrastructure.</li>
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

        <!-- On-premises Baseline Section -->
        <div class="flex flex-col gap-2.5 bg-[#141C2E] border border-[#24314A] rounded-xl p-5">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#6366F1]"></span>
            On-Premises Baseline: Total Vertical Ownership
          </h3>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans pl-3.5">
            For traditional on-premises enterprise applications, you are responsible for the <strong>entire physical and virtual stack</strong>: real estate leases, HVAC cooling, power distribution units (PDUs), physical server rack blades, SAN storage arrays, hypervisors, operating system security patches, language runtimes, database clustering, backups, and application code. Cloud computing is fundamentally the systematic offloading of undifferentiated operational toil to specialized hyperscale providers.
          </p>
        </div>

        <!-- ASCII Architecture Stack Pyramid Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              THE 8-LAYER CLOUD RESPONSIBILITY PYRAMID
            </span>
            <span class="text-[11px] font-code text-slate-500">Separation of Operational Ownership</span>
          </div>

          <!-- ASCII Stack Diagram Container -->
          <div class="p-4 bg-[#070B14] rounded-lg border border-slate-800 text-slate-300 overflow-x-auto text-[11.5px] leading-relaxed">
            <pre class="font-code text-slate-300">
+-------------------------------------------------------------------------------------------------------------+
|                                    SHARED RESPONSIBILITY ACROSS CLOUD TIERS                                 |
+-------------------------------------------------------------------------------------------------------------+
 STACK LAYER              ON-PREMISE            IaaS                 PaaS                 SaaS
=============================================================================================================
 [8] Applications        [ YOU MANAGE ]       [ YOU MANAGE ]       [ YOU MANAGE ]       [ PROVIDER MANAGES ]
 [7] Data & Schemas      [ YOU MANAGE ]       [ YOU MANAGE ]       [ YOU MANAGE ]       [ PROVIDER MANAGES ]
-------------------------------------------------------------------------------------------------------------
 [6] Runtime / MW        [ YOU MANAGE ]       [ YOU MANAGE ]       [ PROVIDER MANAGES ] [ PROVIDER MANAGES ]
 [5] Operating System    [ YOU MANAGE ]       [ YOU MANAGE ]       [ PROVIDER MANAGES ] [ PROVIDER MANAGES ]
-------------------------------------------------------------------------------------------------------------
 [4] Virtualization      [ YOU MANAGE ]       [ PROVIDER MANAGES ] [ PROVIDER MANAGES ] [ PROVIDER MANAGES ]
 [3] Physical Servers    [ YOU MANAGE ]       [ PROVIDER MANAGES ] [ PROVIDER MANAGES ] [ PROVIDER MANAGES ]
 [2] Storage Arrays      [ YOU MANAGE ]       [ PROVIDER MANAGES ] [ PROVIDER MANAGES ] [ PROVIDER MANAGES ]
 [1] Datacenter / Net    [ YOU MANAGE ]       [ PROVIDER MANAGES ] [ PROVIDER MANAGES ] [ PROVIDER MANAGES ]
=============================================================================================================
 OPERATIONAL BURDEN:     100% On You          High (OS + App)      Low (App Only)       Zero (Turnkey Product)
 VENDOR EXAMPLES:        Private Datacenter   AWS EC2, GCE, VPC    Heroku, App Engine   Gmail, Slack, Datadog
 CONTROL FLEXIBILITY:    Maximum Custom       Full Kernel Control  Standard Containers  Configuration Only</pre>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12px]">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 text-cyan-200">
              <strong class="text-white block mb-1">IaaS Line of Demarcation:</strong>
              The hypervisor is the contract boundary. The cloud provider guarantees uptime of the virtual machine and underlying hardware; you are responsible for everything inside the guest OS, including kernel parameters, security patches, firewall ports, and system packages.
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 text-emerald-200">
              <strong class="text-white block mb-1">PaaS / Serverless Line of Demarcation:</strong>
              The application runtime is the contract boundary. The cloud provider guarantees automated OS patching, zero-downtime database failovers, and auto-scaling; you bring only containerized business logic, database schemas, and configuration secrets.
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
                Provides fundamental compute instances, raw block storage volumes (EBS), and software-defined networks (VPC). You manage the OS, middleware, and application; the provider owns the physical infrastructure.
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
                Provides a managed application runtime and database environment. The provider automates OS patching, load balancing, and clustering; developers deploy code directly via git pushes or container manifests.
              </p>
              <div class="pt-2 border-t border-[#24314A]/60 font-code text-[11px] text-indigo-300">
                Heroku · Elastic Beanstalk · RDS
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
                Event-driven ephemeral compute. MicroVM runtimes instantiate in milliseconds on incoming triggers (HTTP, SQS, S3 events), scale to zero when idle, and meter strictly by millisecond execution.
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
                Turnkey end-user software applications delivered over web and API interfaces. The vendor operates and scales 100% of the software, infrastructure, database, and disaster recovery processes.
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
              Cloud Economics: The Headcount Cost of Raw IaaS
            </h3>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Junior engineers often look solely at raw EC2 instance pricing and conclude: <em>"PaaS is 2.5× more expensive than EC2, so we should build our own infrastructure on raw VMs."</em> This commits the <strong>IaaS Iceberg Fallacy</strong>:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div class="bg-[#141C2E] border border-amber-500/30 rounded-xl p-5 flex flex-col gap-2.5">
              <span class="font-code text-[12px] font-bold text-amber-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">trending_down</span>
                The Visible 25%: Cloud Invoice
              </span>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                On an invoice, 10 EC2 instances cost ~$1,500/month, while the equivalent PaaS compute cluster might cost ~$3,500/month. The apparent difference is $2,000/month.
              </p>
            </div>

            <div class="bg-[#141C2E] border border-rose-500/30 rounded-xl p-5 flex flex-col gap-2.5">
              <span class="font-code text-[12px] font-bold text-rose-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">warning</span>
                The Hidden 75%: SRE Headcount & Operational Toil
              </span>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                Running raw IaaS requires hiring at least two Site Reliability Engineers ($400,000+/year total compensation) to manage 24/7 on-call rotations, OS kernel security CVE patching, disk full remediation, and backup verification.
              </p>
            </div>
          </div>
        </div>

        <!-- Green Callout Box: Senior Perspective: When PaaS Becomes a Liability -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: WHEN PAAS BECOMES A LIABILITY & THE SRE INFLECTION POINT
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            PaaS products (Heroku, Render, Firebase, App Engine) are unbeatable for 0-to-1 speed. The architectural tipping point occurs when: (1) <strong>Monthly cloud spend exceeds $20K–$30K/month</strong>, where the 2.5× PaaS premium exceeds the cost of a full-time platform engineer; (2) <strong>Low-latency hardware optimization is required</strong> (e.g. kernel bypass, custom NIC queues, custom Linux sysctl TCP buffer sizes); or (3) <strong>Strict data compliance</strong> requires VPC peering and dedicated bare-metal hardware. Mature teams start on PaaS for speed, and deliberately migrate to managed Kubernetes (EKS/GKE) as traffic scales.
          </p>
        </div>

        <!-- Orange Callout: Warning on Vendor Lock-in -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">lock</span>
            THE VENDOR LOCK-IN TRAP: PROPRIETARY APIS VS. RUNTIME ABSTRACTION
          </span>
          <p class="text-[13px] text-amber-200/90 leading-relaxed font-sans">
            Differentiate strictly between <strong>runtime lock-in</strong> (running Docker containers on AWS ECS, GKE, or Azure AKS) and <strong>proprietary API lock-in</strong> (writing code tightly coupled to DynamoDB single-table APIs, AWS Step Functions, or Google Cloud Spanner). Container runtimes are portable across clouds in days. Proprietary APIs create structural lock-in requiring months of engineering rewrites to exit. In a system design interview, always wrap proprietary cloud dependencies behind repository interfaces to demonstrate architectural foresight.
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
            Anchor your cloud architecture on three orthogonal axes: control level, operational headcount, and lock-in vs. time-to-market. A senior engineer never proclaims "PaaS is too expensive" without factoring in the six-figure headcount cost of dedicated SREs required to operate raw IaaS. Default to PaaS for speed, leverage managed container orchestration (EKS/GKE) at scale, and protect domain core logic with interface boundaries.
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
