/**
 * 1.5 Scaling a Website to Millions of Users - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 16, 17, and 18
 * from The Modern System Design Interview Guide.
 */

export function renderScalingWebsiteContent(topic) {
  const scalingStages = [
    {
      stage: "Stage 1",
      users: "1 – 1,000 Users",
      title: "Single All-in-One Server",
      desc: "Web app, database, and cache all run on a single virtual machine. Zero distributed complexity, but a single hardware crash takes down everything. Bottlenecks: CPU, RAM, and disk I/O.",
      badgeColor: "bg-slate-800 text-slate-300 border-slate-700"
    },
    {
      stage: "Stage 2",
      users: "10,000 Users",
      title: "Split Web & Database Tiers",
      desc: "Move the database to its own dedicated server. Web compute (CPU-heavy) can now scale independently of database storage (RAM and disk I/O-heavy) without fighting for machine resources.",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    },
    {
      stage: "Stage 3",
      users: "50,000 Users",
      title: "Load Balancer + Web Fleet",
      desc: "Place an Application Load Balancer (ALB) in front of multiple web instances. Eliminates single point of failure: if server A crashes, traffic routes to server B automatically.",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
    },
    {
      stage: "Stage 4",
      users: "100,000 Users",
      title: "Database Read Replicas",
      desc: "Most web apps are 90%+ reads. Send all INSERT/UPDATE/DELETE queries to the Primary (Master) DB, and replicate data asynchronously to Read Replicas for SELECT queries.",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    },
    {
      stage: "Stage 5",
      users: "500,000 Users",
      title: "In-Memory Cache & Global CDN",
      desc: "Add Redis/Memcached for hot database queries (sub-millisecond reads) and a CDN (Cloudflare/CloudFront) to cache static images, CSS, and JS at the network edge close to users.",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30"
    },
    {
      stage: "Stage 6",
      users: "1,000,000 Users",
      title: "Stateless App Tier (Shared Session)",
      desc: "Extract user session state out of local server RAM and store it in Redis or signed JWTs. Web servers become 100% stateless and can autoscale up or down dynamically in seconds.",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
    },
    {
      stage: "Stage 7",
      users: "5,000,000 Users",
      title: "Multi-Region Data Centers",
      desc: "Deploy instances across US, EU, and Asia using GeoDNS (Route 53 latency routing). Delivers low-latency page loads worldwide and enables failover if an entire AWS region experiences an outage.",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    },
    {
      stage: "Stage 8",
      users: "10,000,000 Users",
      title: "Async Message Queues & Workers",
      desc: "Decouple heavy tasks (video processing, email notifications, payment settlement) using message queues (Kafka, RabbitMQ, SQS). Web requests return immediately while background workers handle the heavy lifting.",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
    },
    {
      stage: "Stage 9",
      users: "50,000,000+ Users",
      title: "Database Sharding & Partitioning",
      desc: "When write traffic or storage exceeds a single Primary database's limits, partition the database across multiple primary shards using a consistent shard key (e.g., User ID hash).",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the difference between vertical scaling and horizontal scaling?",
      answer: `<strong>Vertical scaling (scale up)</strong> means upgrading the machine with more CPU, RAM, or faster NVMe storage. It requires zero code changes and adds no distributed systems complexity, but hits a hard physical ceiling and remains a single point of failure. <strong>Horizontal scaling (scale out)</strong> means adding more commodity machines behind a load balancer. It enables infinite capacity and high availability, but introduces distributed problems like networking lag, data consistency, and stateless session management.`
    },
    {
      qNum: "Q2",
      question: "What is replication lag, and how do you prevent users from seeing stale data after an update?",
      answer: `Replication lag is the millisecond-to-second delay between a write landing on the Primary database and syncing to the Read Replicas. If a user changes their profile and immediately refreshes, they might hit a replica that has not received the update yet (they see their old data).
      <br/><br/>
      <strong>Production Solutions:</strong>
      <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
        <li><strong>Read-Your-Own-Writes Pattern:</strong> When user X makes a write, route all reads from user X to the Primary database for the next 5 seconds. All other users continue reading from replicas.</li>
        <li><strong>Replication Log Position:</strong> Include the latest commit timestamp or transaction ID in the user's session cookie. Only query replicas that have caught up to that position.</li>
        <li><strong>In-Memory Cache Updates:</strong> Update the cache immediately on write, so subsequent profile reads hit Redis instead of the lagging database replica.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What actually breaks when you shard a database?",
      answer: `Sharding is a last resort because it breaks core relational database features:
      <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
        <li><strong>Cross-Shard Joins:</strong> Joining tables living on different physical machines requires pulling data over the network and joining in application code — making queries 100x slower.</li>
        <li><strong>Referential Integrity:</strong> Foreign key constraints cannot be enforced by the database across physical server boundaries.</li>
        <li><strong>Distributed Transactions:</strong> ACID guarantees across shards require two-phase commit (2PC) or Saga patterns, which severely degrades write throughput.</li>
        <li><strong>Re-Sharding Complexity:</strong> When a shard runs out of storage, splitting it and moving half the data to a new server without downtime is an operational nightmare.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "How do you choose an effective shard key, and what is the 'Celebrity Problem'?",
      answer: `A great shard key evenly distributes data and read/write requests across all database shards.
      <br/><br/>
      <strong>Common Pitfalls:</strong>
      <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
        <li><strong>Monotonic Keys (Timestamp / Auto-Increment ID):</strong> All new writes land on the newest shard, creating a 100% hot shard while other shards sit idle.</li>
        <li><strong>Low-Cardinality Keys (Country / Gender):</strong> Uneven data distribution (e.g., 60% of users in the US will overwhelm Shard 1).</li>
        <li><strong>The Celebrity Problem:</strong> If sharding by <code>user_id</code>, a celebrity like Taylor Swift with 100 million followers will overwhelm their specific shard with reads and notifications. Solution: Add a dedicated Redis cache for celebrity accounts, or salt the shard key with random suffixes (<code>user_id_0</code> to <code>user_id_9</code>) to distribute the load across 10 shards.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 16 & 17: SCALING LADDER, DISTRIBUTED DIAGRAM & BOTTLENECKS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              1.5 Scaling a Website to Millions of Users
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            The Step-by-Step Architectural Roadmap from 1 Server to Global Scale · Bottleneck-Driven Design
          </p>
        </div>

        <!-- Introductory Paragraph with Storytelling Framing -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE INTERVIEW STORYTELLING FRAMEWORK: "START SMALL, SOLVE BOTTLENECKS"
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, <strong>never start by drawing Kafka clusters, sharded databases, and Redis caches on minute one</strong>. Interviewers want to see you start with a simple architecture and only introduce complexity when a specific bottleneck demands it: <em>"We start with one server. When CPU caps out, we split DB and web. When reads saturate, we add replicas. When writes saturate, we shard."</em>
          </p>
        </div>

        <!-- The 9 Scaling Stages Grid -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              THE 9-STAGE ARCHITECTURAL EVOLUTION LADDER
            </span>
            <span class="font-code text-[11px] text-slate-400">Click stages to review progressive milestones</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            ${scalingStages.map(s => `
              <div class="bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-4 flex flex-col gap-2 hover:border-cyan-500/40 transition-colors">
                <div class="flex items-center justify-between gap-2">
                  <span class="px-2 py-0.5 rounded font-code text-[10.5px] font-bold border ${s.badgeColor}">
                    ${s.stage}
                  </span>
                  <span class="text-[11px] font-code text-cyan-300 font-medium">${s.users}</span>
                </div>
                <h4 class="text-[13.5px] font-sans font-bold text-white">${s.title}</h4>
                <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                  ${s.desc}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- END-STATE DISTRIBUTED ARCHITECTURE DIAGRAM -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                END-STATE DISTRIBUTED ARCHITECTURE
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">DB Router &amp; Shard Fleet</span>
              <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">Full Scale Tier Decomposition</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image As-Is -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/end-state-distributed-architecture.png" 
                alt="End-State Distributed Architecture (Full Scale Tier Decomposition - Sharding, DB Router, Query Cache)" 
                class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/end-state-distributed-architecture.png', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">Query Flow: Cache Check → Cache Miss → DB Router → Read Replicas / Primary Shards</span>
            </div>
          </div>

          <!-- Key Architectural Highlights / Progressive Evolution Callouts -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11.5px] font-sans">
            <div class="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-2.5">
              <span class="text-blue-600 font-bold shrink-0 text-[14px]">▲</span>
              <div>
                <strong class="block font-bold mb-1 text-blue-900">1. Edge &amp; Ingress Layer:</strong>
                <span>CDN static caching + Route 53 GeoDNS + Application Load Balancer with SSL termination and health-check failover.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 flex items-start gap-2.5">
              <span class="text-indigo-600 font-bold shrink-0 text-[14px]">▲</span>
              <div>
                <strong class="block font-bold mb-1 text-indigo-900">2. Stateless Compute &amp; Cache:</strong>
                <span>Autoscaling web fleet (1..N) storing zero session state locally. Redis handles user session &amp; hot query caching; Kafka handles async workers.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
              <span class="text-emerald-600 font-bold shrink-0 text-[14px]">▲</span>
              <div>
                <strong class="block font-bold mb-1 text-emerald-900">3. Data &amp; Sharding Layer:</strong>
                <span>Intelligent database router splits reads to read-replicas and writes to dedicated shards (Shard 1..N) partitioned by hash key.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Green Box: Senior Perspective: The Trap of Premature Scaling -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: THE TRAP OF PREMATURE DISTRIBUTED COMPLEXITY
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            Junior candidates often memorize the ladder and propose Kafka, Redis clusters, and database sharding for an app with 5,000 users. A senior answer is grounded in economics: <strong>do not introduce distributed complexity (replication lag, two-phase commits, distributed transactions) until you have exhausted vertical scaling and read replicas.</strong> Always name the specific bottleneck first, then apply the minimal surgical architectural fix.
          </p>
        </div>

        <!-- Orange Box: Three Common Bottlenecks to Watch For -->
        <div class="bg-amber-950/15 border border-amber-500/30 rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            THE THREE BOTTLENECKS THAT DICTATE YOUR NEXT MOVE
          </span>
          <ul class="flex flex-col gap-2.5 text-[12.5px] text-slate-300 font-sans pl-1">
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold mt-0.5">•</span>
              <span><strong class="text-white">Read Bottleneck (High DB CPU on SELECTs):</strong> Solution order: (1) Add missing indexes → (2) Add in-memory query cache (Redis) → (3) Add read replicas.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold mt-0.5">•</span>
              <span><strong class="text-white">Write Bottleneck (High DB Disk IOPS on INSERTs):</strong> Replicas DO NOT help with writes. Solution order: (1) Optimize batch writes → (2) Offload non-critical writes to async queues (Kafka) → (3) Shard the database horizontally.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold mt-0.5">•</span>
              <span><strong class="text-white">Session State Bottleneck (Sticky Sessions breaking autoscaling):</strong> Storing user logins in local web server RAM prevents nodes from dying or autoscaling. Solution: Move session tokens to Redis or use stateless JWTs.</span>
            </li>
          </ul>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            At what point does database replication break down and force you to shard? What specific metrics (write IOPS, storage capacity, lock contention) trigger that decision?
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
            Scaling is not a fixed recipe you recite — it is a diagnostic conversation: identify the current bottleneck, apply the simplest fix, and clearly state what will break next. Read replicas scale read volume; only horizontal sharding scales write volume and disk capacity. Never add distributed systems overhead before simpler optimizations are exhausted.
          </p>
        </div>

        <!-- Page 18 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 18</span>
        </div>

      </div>

    </div>
  `;
}
