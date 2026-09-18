/**
 * 1.5 Scaling a Website to Millions of Users - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 16, 17, and 18
 * from The Modern System Design Interview Guide.
 */

export function renderScalingWebsiteContent(topic) {
  const scalingStages = [
    {
      stage: "Stage 1",
      title: "Single Server (All-in-one)",
      desc: "Web application, database, and cache all run on a single machine. Simplicity is maximized; failure takes down the entire system. Bottlenecks: CPU, memory, disk I/O.",
      badgeColor: "bg-slate-800 text-slate-300 border-slate-700"
    },
    {
      stage: "Stage 2",
      title: "Separate Web and Database Tiers",
      desc: "Split the web tier and database tier onto separate machines. Web servers can scale compute independently of database storage and memory.",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    },
    {
      stage: "Stage 3",
      title: "Horizontal Scaling with Load Balancer",
      desc: "Introduce a Load Balancer (ALB) to distribute incoming traffic across multiple stateless web servers. Redundancy is achieved; if one server dies, traffic routes to others.",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
    },
    {
      stage: "Stage 4",
      title: "Database Replication (Read Replicas)",
      desc: "Master-slave (primary-replica) database architecture. All write operations go to the primary; read queries are distributed across read replicas. Ideal for read-heavy systems (e.g., 90% reads).",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    },
    {
      stage: "Stage 5",
      title: "Caching and Content Delivery Network (CDN)",
      desc: "Add an in-memory cache (Redis/Memcached) for hot database queries and a CDN (Cloudflare, CloudFront) for static assets. Drastically reduces database load and global round-trip latency.",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30"
    },
    {
      stage: "Stage 6",
      title: "Stateless Architecture",
      desc: "Move user session data out of web server local memory into a shared data store (Redis, DynamoDB). Web servers become completely stateless and can scale dynamically based on CPU/traffic.",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
    },
    {
      stage: "Stage 7",
      title: "Multiple Data Centers",
      desc: "Deploy across multiple geographical regions with GeoDNS routing for disaster recovery and localized latency.",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    },
    {
      stage: "Stage 8",
      title: "Message Queues for Async Processing",
      desc: "Introduce message queues (Kafka, RabbitMQ, SQS) to decouple components and process heavy tasks asynchronously.",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
    },
    {
      stage: "Stage 9",
      title: "Database Sharding",
      desc: "Partition the database horizontally across multiple physical machines when write volume or dataset size exceeds a single primary's capacity.",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the difference between vertical scaling and horizontal scaling?",
      answer: `<strong>Vertical scaling (scaling up)</strong> means adding more power (CPU, RAM, disk) to an existing machine. It is simple and introduces no distributed complexity, but has a hard hardware ceiling and single point of failure. <strong>Horizontal scaling (scaling out)</strong> means adding more machines to your resource pool. It enables near-infinite scale and redundancy, but introduces distributed challenges like networking, data consistency, and state management.`
    },
    {
      qNum: "Q2",
      question: "What is replication lag, and how do you handle it in a system using read replicas?",
      answer: `Replication lag is the delay between a write being committed on the primary database and being reflected on read replicas. If a user updates their profile and immediately refreshes, they may read from an out-of-date replica. Solutions: <strong>(1) Read-your-own-writes:</strong> route reads from the user who performed the write to the primary for a few seconds, <strong>(2) Track replication log positions</strong>, or <strong>(3) Use caching</strong> for recently modified objects.`
    },
    {
      qNum: "Q3",
      question: "What actually breaks when you shard a database?",
      answer: `Sharding introduces major engineering tradeoffs: <strong>(1) Cross-shard joins</strong> become slow or impossible in SQL, <strong>(2) Referential integrity</strong> (foreign keys) across shards is no longer enforced by the DB, <strong>(3) Transactions spanning multiple shards</strong> require two-phase commit (2PC), which kills write throughput, and <strong>(4) Re-sharding and rebalancing</strong> data as partitions grow is extremely complex.`
    },
    {
      qNum: "Q4",
      question: "How do you choose a shard key?",
      answer: `A good shard key distributes data and query volume evenly across all shards to prevent hot spots. <strong>User ID</strong> is common for user-centric apps, but can create hot shards if one user is a celebrity (the "Justin Bieber problem"). Avoid low-cardinality keys (e.g. country, gender) and monotonically increasing keys (e.g. timestamp, auto-incrementing ID), which route all recent writes to the newest shard.`
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
        </div>

        <!-- Introductory Paragraph -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5">
          <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
            Scaling a system is not a single leap — it is a sequence of incremental architectural transformations as traffic grows. Each transition solves an immediate bottleneck while introducing the next architectural constraint. The classical scaling ladder progresses through the following stages [1]:
          </p>
        </div>

        <!-- The 9 Scaling Stages Grid -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            THE 9-STAGE ARCHITECTURAL EVOLUTION LADDER
          </span>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            ${scalingStages.map(s => `
              <div class="bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-4 flex flex-col gap-2 hover:border-cyan-500/40 transition-colors">
                <div class="flex items-center justify-between gap-2">
                  <span class="px-2 py-0.5 rounded font-code text-[10.5px] font-bold border ${s.badgeColor}">
                    ${s.stage}
                  </span>
                  <span class="text-[12.5px] font-sans font-bold text-white truncate">${s.title}</span>
                </div>
                <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                  ${s.desc}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- END-STATE DISTRIBUTED ARCHITECTURE DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              END-STATE DISTRIBUTED ARCHITECTURE
            </span>
            <span class="text-[11px] font-code text-slate-500">Full Scale Tier Decomposition</span>
          </div>

          <div class="p-4 bg-[#0F1626] border border-cyan-500/30 rounded-xl flex flex-col gap-3">
            <div class="text-[11.5px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
[Users / DNS] ──> [CDN (Static Content)]
       │
       v
[Load Balancers (L4 / L7)]
       │
       ├───> [Stateless Web / App Tier] ──> [Session Cache (Redis)]
                    │             │
                    │             ├───> [Message Queue (Kafka / SQS)] ──> [Worker Fleet]
                    v             v
       [Query Cache (Redis)]   [DB Primary (Writes)]
                                     │
                                (Replication)
                                     v
                               [Read Replicas (Reads)]
                                     │
                                (Horizontal)
                                     v
                               [Sharded Shards (1..N)]
            </div>

            <div class="pt-2 border-t border-[#1E293B] text-[11px] font-code text-cyan-300">
              ▲ Progressive evolution: single server → split DB → load balanced → cached → async decoupled → sharded
            </div>
          </div>
        </div>

        <!-- Green Box: Senior Perspective: The Trap of Premature Scaling -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: THE TRAP OF PREMATURE SCALING
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            Junior candidates memorize the entire scaling ladder and propose Kafka, Redis clusters, and database sharding for a service with 10,000 users. A senior answer is grounded in economics: do not introduce distributed systems complexity (replication lag, two-phase commits, distributed transactions) until you have exhausted vertical scaling and read replicas. Name the bottleneck first, then apply the minimal surgical change.
          </p>
        </div>

        <!-- Orange Box: Three Common Bottlenecks to Watch For -->
        <div class="bg-amber-950/15 border border-amber-500/30 rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THREE COMMON BOTTLENECKS TO WATCH FOR
          </span>
          <ul class="flex flex-col gap-2.5 text-[12.5px] text-slate-300 font-sans pl-1">
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold mt-0.5">•</span>
              <span><strong class="text-white">Read bottlenecks:</strong> Slow database queries. Solution: Add indexes first, then query caching (Redis), then read replicas.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold mt-0.5">•</span>
              <span><strong class="text-white">Write bottlenecks:</strong> Single primary database saturation. Solution: Optimize transactions, batch writes, offload non-critical updates to queues, shard the database.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold mt-0.5">•</span>
              <span><strong class="text-white">Session state:</strong> Web servers storing in-memory sessions cannot autoscale or survive node restarts. Solution: Store sessions in Redis or use stateless JWT tokens.</span>
            </li>
          </ul>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            At what point does database replication break down and force you to shard? What specific symptoms will you see?
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
            Scaling is not a ladder you recite — it is: find the bottleneck, remove it, name what breaks next. Replicas scale reads; only sharding scales writes. Never introduce distributed complexity before exhausting simpler primitives.
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
