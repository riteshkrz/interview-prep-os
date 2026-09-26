/**
 * 0.3 Back-of-the-Envelope Estimation - Visual Guide
 * High-signal, interactive, visually stunning presentation of whiteboard arithmetic,
 * capacity planning, and mental math based on The Modern System Design Interview Guide (Pages 7–8).
 * Supports pristine Light and Dark themes with maximum contrast and readability.
 */

export function renderEstimationMathContent(topic) {
  const followUpQuestions = [
    {
      id: "q1",
      question: "Q1: How do you pick the peak-to-average traffic multiplier?",
      badge: "Traffic Shape",
      badgeColor: "text-[#0284C7] dark:text-cyan-400 bg-[#F0F9FF] dark:bg-cyan-500/15 border-[#BAE6FD] dark:border-cyan-500/30",
      answer: `From the traffic shape. A consumer social app is roughly <strong>2–3×</strong>, driven by an evening peak. An event-driven system (ticket sales, flash sales, tax filing deadlines) can be <strong>100×+</strong>, which fundamentally changes the design from <em>"autoscale"</em> to <em>"pre-provision and queue"</em> (sec. 9.6).`
    },
    {
      id: "q2",
      question: "Q2: Your estimate says 33 TB/year. Is that a problem?",
      badge: "Storage Pattern",
      badgeColor: "text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-emerald-500/15 border-[#A7F3D0] dark:border-emerald-500/30",
      answer: `Not by itself — <strong>it is two commodity NVMe drives</strong>. The question is the access pattern: 33 TB of cold logs goes to object storage (S3) at cents per GB; 33 TB of randomly-read indexed rows needs sharding because it no longer fits in RAM.`
    },
    {
      id: "q3",
      question: "Q3: When does a read-replica strategy stop working?",
      badge: "Limits of Replication",
      badgeColor: "text-[#D97706] dark:text-amber-400 bg-[#FFFBEB] dark:bg-amber-500/15 border-[#FDE68A] dark:border-amber-500/30",
      answer: `Three concrete limits:
        <ul class="list-disc list-inside mt-2 space-y-1 text-[#475569] dark:text-slate-300">
          <li><strong>(a) Write throughput:</strong> Every replica applies 100% of the write load, so replicas never help write throughput.</li>
          <li><strong>(b) Working set RAM ceiling:</strong> The active dataset no longer fits in one node's RAM.</li>
          <li><strong>(c) Replication lag:</strong> Async replication delay exceeds the application's read-after-write tolerance.</li>
        </ul>
        Any of those three conditions strictly dictates sharding (sec. 4.6).`
    },
    {
      id: "q4",
      question: "Q4: Estimate the storage for 5 years of 1080p video for 10 M daily uploads.",
      badge: "Exabyte Math",
      badgeColor: "text-[#7C3AED] dark:text-purple-400 bg-[#F5F3FF] dark:bg-purple-500/15 border-[#DDD6FE] dark:border-purple-500/30",
      answer: `Show the method clearly:
        <div class="p-3 my-2 rounded-lg bg-white dark:bg-[#0F1626] border border-[#E2E8F0] dark:border-[#24314A] font-mono text-[12px] text-[#0284C7] dark:text-cyan-300 shadow-xs">
          10 M uploads × 5 min × ~5 MB/min ≈ 250 TB/day of source<br />
          × 1.5 multiplier for transcoded renditions ≈ 375 TB/day<br />
          ≈ 137 PB/yr ≈ 685 PB over 5 years
        </div>
        <strong>Senior punchline:</strong> Propose tiering to cold storage and erasure coding (sec. 6.3) instead of 3× replication (saving hundreds of petabytes). That is the exact answer interviewers want, and the math is what earns it.`
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-7 animate-fadeIn text-[#0F172A] dark:text-slate-200">

      <!-- HERO BANNER: Why Estimation Precedes Architecture -->
      <div class="relative overflow-hidden rounded-2xl bg-[#EFF6FF] dark:bg-[#161D32] border border-[#BFDBFE] dark:border-cyan-500/40 p-6 sm:p-8 shadow-sm">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-4">
          <!-- Badges & Guide Reference -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-lg bg-white dark:bg-cyan-500/20 text-[#0284C7] dark:text-cyan-300 border border-[#BAE6FD] dark:border-cyan-500/40 text-[11px] font-code font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span class="material-symbols-outlined text-[14px]">calculate</span>
                Numbers Before Boxes
              </span>
              <span class="px-3 py-1 rounded-lg bg-white dark:bg-emerald-500/20 text-[#059669] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-500/30 text-[11px] font-code font-bold uppercase tracking-wider shadow-xs">
                Capacity Sizing Framework
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-code text-[#475569] dark:text-slate-400 bg-white dark:bg-[#0A0E1A]/80 px-2.5 py-1 rounded border border-[#E2E8F0] dark:border-[#24314A] font-semibold">
                Part 0 &bull; The Playbook
              </span>
              <span class="text-[11px] font-code text-[#0284C7] dark:text-cyan-400 bg-white dark:bg-cyan-950/60 px-2.5 py-1 rounded border border-[#BAE6FD] dark:border-cyan-500/30 flex items-center gap-1 font-semibold">
                <span class="material-symbols-outlined text-[13px]">menu_book</span>
                Guide Pages 7–8
              </span>
            </div>
          </div>

          <!-- Titles -->
          <div class="flex flex-col gap-1.5">
            <h2 class="font-sans text-[24px] sm:text-[30px] font-black text-[#0F172A] dark:text-white tracking-tight leading-tight flex items-center gap-3">
              <span>0.3 Back-of-the-Envelope Estimation</span>
            </h2>
            <p class="text-[15px] sm:text-[17px] font-medium text-[#1E40AF] dark:text-cyan-200/90 leading-snug">
              Order-of-magnitude arithmetic done on the whiteboard to size a system before designing it
            </p>
          </div>

          <!-- WHY ESTIMATIONS ARE MANDATORY -->
          <div class="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A0E1A]/90 border-l-4 border-[#059669] dark:border-emerald-400 border-r border-t border-b border-[#E2E8F0] dark:border-[#24314A] shadow-xs flex flex-col gap-2.5">
            <div class="flex items-center gap-2 text-[#059669] dark:text-emerald-400 font-code text-[11px] font-bold uppercase tracking-wider">
              <span class="material-symbols-outlined text-[16px]">help_center</span>
              <span>Why Estimation Dictates Every Architectural Decision</span>
            </div>
            <p class="text-[13.5px] sm:text-[14.5px] text-[#0F172A] dark:text-slate-200 leading-relaxed font-sans">
              Recently, engineers have asked whether back-of-the-envelope estimation is really necessary in a system design interview.
              <strong class="text-[#0F172A] dark:text-white">Estimations are essential because they determine the actual physical scale of the system and justify every component.</strong>
              Arithmetic answers the three core questions before you draw a single box:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div class="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] flex items-center gap-2 text-[12px] text-[#0369A1] dark:text-cyan-200 font-medium">
                <span class="material-symbols-outlined text-[#0284C7] dark:text-cyan-400 text-[16px] shrink-0">lan</span>
                <span>Do we really need a distributed solution?</span>
              </div>
              <div class="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] flex items-center gap-2 text-[12px] text-[#065F46] dark:text-emerald-200 font-medium">
                <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[16px] shrink-0">memory</span>
                <span>Is a cache layer strictly necessary?</span>
              </div>
              <div class="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] flex items-center gap-2 text-[12px] text-[#4338CA] dark:text-indigo-200 font-medium">
                <span class="material-symbols-outlined text-[#4F46E5] dark:text-indigo-400 text-[16px] shrink-0">alt_route</span>
                <span>Shall we choose data replication or sharding?</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 1: CASE STUDY - WHY JUMPING TO SHARDING IS A BAD IDEA -->
      <div class="flex flex-col gap-4 bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#FFFBEB] dark:bg-amber-500/15 border border-[#FDE68A] dark:border-amber-500/30 text-[#D97706] dark:text-amber-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">explore</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                ▸ Case Study: Why Jumping to Sharding Is a Bad Idea
              </h3>
              <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
                Proximity Service &amp; Geospatial Index: How 1.71 GB of RAM kills complex sharding proposals
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-[#D97706] dark:text-amber-300 bg-[#FFFBEB] dark:bg-amber-950/40 px-3 py-1 rounded-lg border border-[#FDE68A] dark:border-amber-500/30 font-bold">
            Real Interview Anti-Pattern
          </span>
        </div>

        <!-- The Proximity Service Source Material Card -->
        <div class="rounded-xl bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
          <div class="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#1E293B] pb-2.5">
            <span class="font-code text-[11px] text-[#475569] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <span class="material-symbols-outlined text-[15px] text-[#0284C7] dark:text-cyan-400">menu_book</span>
              FROM THE SOURCE MATERIAL (The Modern System Design Interview Guide Page 7)
            </span>
            <span class="px-2 py-0.5 rounded text-[10.5px] font-code font-bold bg-[#F0F9FF] dark:bg-cyan-500/10 text-[#0284C7] dark:text-cyan-400 border border-[#BAE6FD] dark:border-cyan-500/20">
              Quadtree Index: 1.71 GB
            </span>
          </div>

          <p class="text-[13px] sm:text-[13.5px] text-[#334155] dark:text-slate-300 leading-relaxed font-sans italic">
            "One common mistake about scaling the geospatial index is to quickly jump to a sharding scheme without considering the
            actual data size of the table. In our case, the full dataset for the geospatial index table is not large (quadtree index only
            takes 1.71 G memory and storage requirement for geohash index is similar). The whole geospatial index can easily fit in
            the working set of a modern database server.
          </p>

          <p class="text-[13px] sm:text-[13.5px] text-[#334155] dark:text-slate-300 leading-relaxed font-sans italic">
            However, depending on the read volume, a single database server might not have enough CPU or network bandwidth to
            service all read requests. If that is the case, it will be necessary to spread the read load among multiple database servers.
            There are two general approaches to spread the load of a relational database server. We can add read replicas or shard
            the database. Many engineers like to talk about sharding during interviews. However, it might not be a good fit for the
            geohash table. Sharding is complicated. The sharding logic has to be added to the application layer. Sometimes, sharding
            is the only option. In this case though, since everything can fit in the working set of a database server, there is no strong
            technical reason to shard the data among multiple servers.
          </p>

          <p class="text-[13px] sm:text-[13.5px] text-[#065F46] dark:text-emerald-300/90 leading-relaxed font-sans font-medium">
            A better approach, in this case, is to have a series of read replicas to help with the read load. This method is much simpler
            to develop and maintain. Thus, we recommend scaling the geospatial index table through replicas."
          </p>
        </div>

        <!-- Architectural Contrast: Replicas vs Sharding -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          <!-- Approach 1: Replicas (Recommended) -->
          <div class="p-4 rounded-xl bg-[#ECFDF5] dark:bg-[#0A0E1A] border border-[#A7F3D0] dark:border-emerald-500/40 flex flex-col gap-2 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-[#065F46] dark:text-emerald-300 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[18px]">check_circle</span>
                Recommended: Read Replicas
              </span>
              <span class="font-code text-[10.5px] text-[#059669] dark:text-emerald-400 bg-white dark:bg-emerald-500/15 px-2 py-0.5 rounded border border-[#A7F3D0] dark:border-emerald-500/30 font-bold">SIMPLE &amp; ROBUST</span>
            </div>
            <ul class="text-[12px] text-[#065F46] dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>1.71 GB index easily fits in 64 GB–128 GB RAM on commodity servers.</li>
              <li>Read traffic is distributed evenly across 5–10 read replicas behind a load balancer.</li>
              <li>No cross-shard scatter-gather queries, no custom routing proxies, zero re-sharding risk.</li>
            </ul>
          </div>

          <!-- Approach 2: Sharding (The Trap) -->
          <div class="p-4 rounded-xl bg-[#FFF1F2] dark:bg-[#0A0E1A] border border-[#FECDD3] dark:border-rose-500/40 flex flex-col gap-2 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-[#9F1239] dark:text-rose-300 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[18px]">cancel</span>
                The Trap: Premature Sharding
              </span>
              <span class="font-code text-[10.5px] text-[#E11D48] dark:text-rose-400 bg-white dark:bg-rose-500/15 px-2 py-0.5 rounded border border-[#FECDD3] dark:border-rose-500/30 font-bold">POINTLESS COMPLEXITY</span>
            </div>
            <ul class="text-[12px] text-[#9F1239] dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Requires application-level partition keys and complex geospatial boundary handling.</li>
              <li>Queries spanning cell boundaries must query multiple shards and merge results.</li>
              <li>Signals to the interviewer that you memorize buzzwords instead of analyzing data sizes.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- SECTION 2: THE FOUR NUMBERS TO DERIVE, EVERY TIME -->
      <div class="flex flex-col gap-4 bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#F0F9FF] dark:bg-cyan-500/15 border border-[#BAE6FD] dark:border-cyan-500/30 text-[#0284C7] dark:text-cyan-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">format_list_numbered</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                ▸ The Four Numbers to Derive, Every Time
              </h3>
              <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
                ESTIMATION WORKSHEET: Standard arithmetic protocol to execute on the whiteboard
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-[#0284C7] dark:text-cyan-400 bg-[#F0F9FF] dark:bg-[#0A0E1A] px-3 py-1.5 rounded-lg border border-[#BAE6FD] dark:border-[#24314A] font-bold">
            Core Worksheet
          </span>
        </div>

        <!-- 4 Estimation Formula Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <!-- 1. Traffic -->
          <div class="bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] hover:border-[#0284C7] dark:hover:border-cyan-500/40 rounded-xl p-4 flex flex-col gap-2.5 transition-all shadow-xs">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[#0284C7] dark:text-cyan-400 text-[18px]">traffic</span>
                # 1. Traffic (Average &amp; Peak QPS)
              </span>
              <span class="text-[10.5px] font-code text-[#0284C7] dark:text-cyan-400 bg-white dark:bg-cyan-500/10 px-2 py-0.5 rounded border border-[#BAE6FD] dark:border-cyan-500/20 font-bold">QPS</span>
            </div>
            <div class="p-3 rounded-lg bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#1E293B] font-mono text-[11.5px] text-[#0284C7] dark:text-cyan-200 leading-relaxed shadow-xs">
              DAU &times; actions/user/day = requests/day<br />
              requests/day &divide; 86,400 = average QPS<br />
              peak QPS &approx; average QPS &times; 2 to 10 <span class="text-[#64748B] dark:text-slate-400"># state assumed multiplier</span>
            </div>
            <span class="text-[11px] text-[#475569] dark:text-slate-400">
              Derives concurrency in flight and tells you how many stateless application containers you need.
            </span>
          </div>

          <!-- 2. Storage -->
          <div class="bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] hover:border-[#059669] dark:hover:border-emerald-500/40 rounded-xl p-4 flex flex-col gap-2.5 transition-all shadow-xs">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[18px]">hard_drive_2</span>
                # 2. Storage (Per Day &amp; Over Retention)
              </span>
              <span class="text-[10.5px] font-code text-[#059669] dark:text-emerald-400 bg-white dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-[#A7F3D0] dark:border-emerald-500/20 font-bold">CAPACITY</span>
            </div>
            <div class="p-3 rounded-lg bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#1E293B] font-mono text-[11.5px] text-[#059669] dark:text-emerald-200 leading-relaxed shadow-xs">
              writes/day &times; bytes/write &times; 365 &times; retention_years &times; replication_factor
            </div>
            <span class="text-[11px] text-[#475569] dark:text-slate-400">
              Tells you whether storage fits on local NVMe SSDs, needs horizontal DB sharding, or cold blob tiering.
            </span>
          </div>

          <!-- 3. Bandwidth -->
          <div class="bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] hover:border-[#4F46E5] dark:hover:border-indigo-500/40 rounded-xl p-4 flex flex-col gap-2.5 transition-all shadow-xs">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[#4F46E5] dark:text-indigo-400 text-[18px]">speed</span>
                # 3. Bandwidth (Network Throughput)
              </span>
              <span class="text-[10.5px] font-code text-[#4F46E5] dark:text-indigo-400 bg-white dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-[#DDD6FE] dark:border-indigo-500/20 font-bold">NET I/O</span>
            </div>
            <div class="p-3 rounded-lg bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#1E293B] font-mono text-[11.5px] text-[#4F46E5] dark:text-indigo-200 leading-relaxed shadow-xs">
              peak QPS &times; average payload bytes <span class="text-[#64748B] dark:text-slate-400"># split ingress vs egress</span>
            </div>
            <span class="text-[11px] text-[#475569] dark:text-slate-400">
              Dictates NIC saturation, direct client-to-storage presigned URLs, and CDN edge egress offloading.
            </span>
          </div>

          <!-- 4. Memory / Cache -->
          <div class="bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] hover:border-[#7C3AED] dark:hover:border-purple-500/40 rounded-xl p-4 flex flex-col gap-2.5 transition-all shadow-xs">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[14px] font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[#7C3AED] dark:text-purple-400 text-[18px]">memory</span>
                # 4. Memory (Cache Sizing via 80/20 Rule)
              </span>
              <span class="text-[10.5px] font-code text-[#7C3AED] dark:text-purple-400 bg-white dark:bg-purple-500/10 px-2 py-0.5 rounded border border-[#DDD6FE] dark:border-purple-500/20 font-bold">HOT SET</span>
            </div>
            <div class="p-3 rounded-lg bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#1E293B] font-mono text-[11.5px] text-[#7C3AED] dark:text-purple-200 leading-relaxed shadow-xs">
              hot set &approx; 20% of daily reads (80/20 rule) &times; object size
            </div>
            <span class="text-[11px] text-[#475569] dark:text-slate-400">
              Sizes your Redis/Memcached cluster to guarantee 80%+ cache hit ratio and protect database disks.
            </span>
          </div>
        </div>

        <!-- Interactive Quick Estimation Calculator Sandbox -->
        <div class="mt-2 rounded-xl bg-white dark:bg-[#0A0E1A] border border-[#BAE6FD] dark:border-cyan-500/30 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
          <div class="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#1E293B] pb-2.5">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0284C7] dark:text-cyan-400 text-[18px]">tune</span>
              <span class="font-sans text-[14px] font-bold text-[#0F172A] dark:text-white">Live Whiteboard Estimation Scratchpad</span>
            </div>
            <span class="text-[10.5px] font-code text-[#64748B] dark:text-slate-400">Tweak numbers to see instant computed sizing</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="flex flex-col gap-1">
              <label class="font-code text-[11px] text-[#475569] dark:text-slate-400 font-semibold">Daily Active Users (DAU in Millions)</label>
              <input
                type="number"
                id="est-dau-input"
                class="bg-[#F8FAFC] dark:bg-[#141C2E] border border-[#CBD5E1] dark:border-[#24314A] rounded-lg px-3 py-1.5 text-[#0F172A] dark:text-white font-code text-[13px] focus:outline-none focus:border-[#0284C7]"
                value="150"
                min="1"
                max="5000"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-code text-[11px] text-[#475569] dark:text-slate-400 font-semibold">Actions / User / Day</label>
              <input
                type="number"
                id="est-actions-input"
                class="bg-[#F8FAFC] dark:bg-[#141C2E] border border-[#CBD5E1] dark:border-[#24314A] rounded-lg px-3 py-1.5 text-[#0F172A] dark:text-white font-code text-[13px] focus:outline-none focus:border-[#0284C7]"
                value="2"
                min="1"
                max="500"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-code text-[11px] text-[#475569] dark:text-slate-400 font-semibold">Peak Traffic Multiplier</label>
              <select
                id="est-multiplier-input"
                class="bg-[#F8FAFC] dark:bg-[#141C2E] border border-[#CBD5E1] dark:border-[#24314A] rounded-lg px-3 py-1.5 text-[#0F172A] dark:text-white font-code text-[13px] focus:outline-none focus:border-[#0284C7]"
              >
                <option value="2">2&times; (Steady Consumer App)</option>
                <option value="5">5&times; (Moderate Spike)</option>
                <option value="10">10&times; (Flash Event / High Peak)</option>
              </select>
            </div>
          </div>

          <!-- Dynamic Output Row -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div class="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] flex flex-col shadow-xs">
              <span class="font-code text-[10px] text-[#64748B] dark:text-slate-400 uppercase font-bold">Requests / Day</span>
              <span id="est-out-requests" class="font-code text-[15px] font-bold text-[#0F172A] dark:text-white">300 M / day</span>
            </div>
            <div class="p-3 rounded-lg bg-[#F0F9FF] dark:bg-[#141C2E] border border-[#BAE6FD] dark:border-[#24314A] flex flex-col shadow-xs">
              <span class="font-code text-[10px] text-[#0284C7] dark:text-cyan-400 uppercase font-bold">Average QPS</span>
              <span id="est-out-avg-qps" class="font-code text-[15px] font-bold text-[#0284C7] dark:text-cyan-300">~3,472 QPS</span>
            </div>
            <div class="p-3 rounded-lg bg-[#ECFDF5] dark:bg-[#141C2E] border border-[#A7F3D0] dark:border-[#24314A] flex flex-col shadow-xs">
              <span class="font-code text-[10px] text-[#059669] dark:text-emerald-400 uppercase font-bold">Peak QPS</span>
              <span id="est-out-peak-qps" class="font-code text-[15px] font-bold text-[#059669] dark:text-emerald-300">~6,944 QPS</span>
            </div>
            <div class="p-3 rounded-lg bg-[#F5F3FF] dark:bg-[#141C2E] border border-[#DDD6FE] dark:border-[#24314A] flex flex-col shadow-xs">
              <span class="font-code text-[10px] text-[#7C3AED] dark:text-purple-400 uppercase font-bold">Sizing Directive</span>
              <span id="est-out-recommendation" class="font-code text-[11px] font-bold text-[#4338CA] dark:text-purple-300 leading-snug">1 Primary DB fits writes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3: WORKED EXAMPLE — TWITTER-SCALE TIMELINE -->
      <div class="flex flex-col gap-4 bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#F5F3FF] dark:bg-indigo-500/15 border border-[#DDD6FE] dark:border-indigo-500/30 text-[#4F46E5] dark:text-indigo-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">analytics</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                Worked Example: Twitter-Scale Timeline
              </h3>
              <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
                Walking through assumptions, traffic ratios, and storage tiering step-by-step
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-[#4F46E5] dark:text-indigo-300 bg-[#F5F3FF] dark:bg-indigo-950/40 px-3 py-1 rounded-lg border border-[#DDD6FE] dark:border-indigo-500/30 font-bold">
            End-to-End Walkthrough
          </span>
        </div>

        <div class="bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
          <!-- Assumptions -->
          <div class="flex items-center gap-2 font-code text-[12px] text-[#0F172A] dark:text-slate-300 bg-white dark:bg-[#141C2E] p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs">
            <span class="material-symbols-outlined text-[#4F46E5] dark:text-indigo-400 text-[18px]">info</span>
            <span><strong>Assumptions:</strong> 300 M MAU, 50% daily active &rarr; <strong>150 M DAU</strong>. 2 tweets/user/day, 100 reads/user/day. Average tweet payload: 300 bytes.</span>
          </div>

          <!-- 3-Column Derivation Step -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-lg bg-white dark:bg-[#141C2E] border border-[#BAE6FD] dark:border-cyan-500/30 flex flex-col gap-1.5 shadow-xs">
              <span class="font-code text-[11px] text-[#0284C7] dark:text-cyan-400 uppercase font-bold">1. Writes Derivation</span>
              <p class="font-mono text-[12px] text-[#334155] dark:text-slate-200">
                150 M &times; 2 = 300 M tweets/day<br />
                300 M &divide; 86,400 &approx; <strong class="text-[#0284C7] dark:text-cyan-300">3,500 write QPS</strong>
              </p>
            </div>

            <div class="p-3.5 rounded-lg bg-white dark:bg-[#141C2E] border border-[#A7F3D0] dark:border-emerald-500/30 flex flex-col gap-1.5 shadow-xs">
              <span class="font-code text-[11px] text-[#059669] dark:text-emerald-400 uppercase font-bold">2. Reads &amp; Ratio</span>
              <p class="font-mono text-[12px] text-[#334155] dark:text-slate-200">
                150 M &times; 100 = 15 B reads/day<br />
                15 B &divide; 86,400 &approx; <strong class="text-[#059669] dark:text-emerald-300">175,000 read QPS</strong><br />
                <span class="text-[#D97706] dark:text-amber-300 font-bold">Ratio read : write &approx; 50 : 1</span>
              </p>
            </div>

            <div class="p-3.5 rounded-lg bg-white dark:bg-[#141C2E] border border-[#DDD6FE] dark:border-purple-500/30 flex flex-col gap-1.5 shadow-xs">
              <span class="font-code text-[11px] text-[#7C3AED] dark:text-purple-400 uppercase font-bold">3. Storage &amp; Replicas</span>
              <p class="font-mono text-[12px] text-[#334155] dark:text-slate-200">
                300 M &times; 300 B = 90 GB/day<br />
                &approx; 33 TB/yr (pre-replication)<br />
                <span class="text-[#4338CA] dark:text-purple-300 font-bold">&times; 3 replicas &approx; 100 TB/yr</span>
              </p>
            </div>
          </div>

          <!-- Architectural Conclusion Box -->
          <div class="p-4 rounded-xl bg-[#F5F3FF] dark:bg-[#161D2A] border border-[#DDD6FE] dark:border-indigo-500/40 flex items-start gap-3 shadow-xs">
            <span class="material-symbols-outlined text-[#4F46E5] dark:text-indigo-400 text-[22px] shrink-0 mt-0.5">psychology</span>
            <div class="flex flex-col gap-1">
              <span class="font-code text-[11px] text-[#4F46E5] dark:text-indigo-400 uppercase font-bold tracking-wider">The Architectural Decision:</span>
              <p class="text-[13px] text-[#0F172A] dark:text-slate-200 leading-relaxed font-sans">
                <strong>Writes fit on one beefy node (3,500 QPS is trivial for a tuned Postgres/MySQL primary with NVMe SSD); reads do NOT (175,000 QPS melts a single disk).</strong>
                <br />
                <span class="text-[#0284C7] dark:text-cyan-300 font-semibold">Senior Action:</span> Shard database by <code>user_id</code>, cache user home timelines in Redis (fast LRU), and adopt <strong>fanout-on-write</strong> for non-celebrity users with async fanout workers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 4: ROUNDING RULES THAT KEEP MENTAL MATH FAST -->
      <div class="flex flex-col gap-4 bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div class="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <span class="p-2 rounded-xl bg-[#F0FDF4] dark:bg-teal-500/15 border border-[#BBF7D0] dark:border-teal-500/30 text-[#0D9488] dark:text-teal-400 flex items-center">
            <span class="material-symbols-outlined text-[20px]">bolt</span>
          </span>
          <div>
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">
              Rounding Rules That Keep Mental Math Fast
            </h3>
            <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
              Never get stuck doing long division on the whiteboard. Memorize these powers and conversion anchors.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div class="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] flex flex-col gap-2 shadow-xs">
            <span class="font-code text-[11px] text-[#0D9488] dark:text-teal-400 uppercase font-bold">1 Day in Seconds</span>
            <div class="font-mono text-[13px] text-[#0F172A] dark:text-white">
              1 day &approx; 86,400 s &approx; <strong class="text-[#0D9488] dark:text-teal-300">10<sup>5</sup> seconds</strong>
            </div>
            <div class="text-[11.5px] text-[#475569] dark:text-slate-300 font-sans space-y-1">
              <div>&bull; 1 Million / day &divide; 10<sup>5</sup> &approx; <strong class="text-[#0284C7] dark:text-cyan-300">10 QPS</strong></div>
              <div>&bull; 1 Billion / day &divide; 10<sup>5</sup> &approx; <strong class="text-[#0284C7] dark:text-cyan-300">10–12 K QPS</strong></div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] flex flex-col gap-2 shadow-xs">
            <span class="font-code text-[11px] text-[#4F46E5] dark:text-indigo-400 uppercase font-bold">Powers of 2 vs 10</span>
            <div class="font-mono text-[12px] text-[#334155] dark:text-slate-200 space-y-1">
              <div>&bull; 2<sup>10</sup> &approx; 1,024 &approx; <strong class="text-[#4F46E5] dark:text-indigo-300">1 KB (Thousand)</strong></div>
              <div>&bull; 2<sup>20</sup> &approx; 1 Million &approx; <strong class="text-[#4F46E5] dark:text-indigo-300">1 MB</strong></div>
              <div>&bull; 2<sup>30</sup> &approx; 1 Billion &approx; <strong class="text-[#4F46E5] dark:text-indigo-300">1 GB</strong></div>
              <div>&bull; 2<sup>40</sup> &approx; 1 Trillion &approx; <strong class="text-[#4F46E5] dark:text-indigo-300">1 TB</strong></div>
              <div>&bull; 2<sup>50</sup> &approx; 1 Quadrillion &approx; <strong class="text-[#4F46E5] dark:text-indigo-300">1 PB</strong></div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] flex flex-col gap-2 shadow-xs">
            <span class="font-code text-[11px] text-[#D97706] dark:text-amber-400 uppercase font-bold">The Significant Figure Rule</span>
            <div class="font-sans text-[12.5px] text-[#0F172A] dark:text-slate-200 leading-relaxed">
              <strong>Round to one significant figure and state it out loud:</strong>
              <div class="p-2.5 mt-1.5 rounded-lg bg-white dark:bg-[#141C2E] font-mono text-[11.5px] text-[#B45309] dark:text-amber-300 border border-[#FDE68A] dark:border-amber-500/20 shadow-xs">
                "Nobody wants 3,472.22 QPS in an interview. Say: 'Around 3,500 QPS, or ~4,000 QPS to build headroom.'"
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 5: ESTIMATE WHEN vs DON'T OVER-INVEST WHEN -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Estimate When -->
        <div class="bg-[#ECFDF5] dark:bg-[#141C2E] border border-[#A7F3D0] dark:border-emerald-500/40 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 shadow-sm">
          <div class="flex items-center gap-2 pb-2 border-b border-[#A7F3D0] dark:border-[#24314A]">
            <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[20px]">check_circle</span>
            <h4 class="font-sans text-[16px] font-bold text-[#065F46] dark:text-emerald-300 uppercase tracking-wider">ESTIMATE WHEN</h4>
          </div>
          <ul class="text-[12.5px] text-[#065F46] dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>Choosing single-node vs. distributed:</strong> Determine if DB writes or working set exceed a single commodity server.</li>
            <li><strong>Justifying a cache, shard or CDN:</strong> Show why the read:write ratio (e.g. 50:1) demands an in-memory tier.</li>
            <li><strong>Sizing a queue's retention buffer:</strong> Calculate burst volume to size Kafka/RabbitMQ disk buffer during downstream outages.</li>
            <li><strong>Arguing operational cost:</strong> Compare 3× replication storage overhead against Reed-Solomon erasure coding (50% overhead).</li>
          </ul>
        </div>

        <!-- Don't Over-Invest When -->
        <div class="bg-[#FFF1F2] dark:bg-[#141C2E] border border-[#FECDD3] dark:border-rose-500/40 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 shadow-sm">
          <div class="flex items-center gap-2 pb-2 border-b border-[#FECDD3] dark:border-[#24314A]">
            <span class="material-symbols-outlined text-[#E11D48] dark:text-rose-400 text-[20px]">highlight_off</span>
            <h4 class="font-sans text-[16px] font-bold text-[#9F1239] dark:text-rose-300 uppercase tracking-wider">DON'T OVER-INVEST WHEN</h4>
          </div>
          <ul class="text-[12.5px] text-[#9F1239] dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>The interviewer explicitly says:</strong> <em>"Assume it's huge, skip the math."</em> Take the hint and move immediately to components.</li>
            <li><strong>You are burning &gt;5 minutes on arithmetic:</strong> Math should take 2–3 minutes max; spending 8 minutes calculating fractions fails the loop.</li>
            <li><strong>Precision changes no architectural decision:</strong> Order of magnitude is the sole point. 3,000 QPS vs 3,500 QPS requires the exact same design.</li>
          </ul>
        </div>
      </div>

      <!-- SECTION 6: INTERVIEW FOLLOW-UPS (INTERACTIVE ACCORDION DRILL) -->
      <div class="flex flex-col gap-4 bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#F5F3FF] dark:bg-purple-500/15 border border-[#DDD6FE] dark:border-purple-500/30 text-[#7C3AED] dark:text-purple-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">psychology_alt</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                Interview Follow-Ups: Real Q&amp;A Probes
              </h3>
              <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
                Click any probe below to inspect the senior-level defense and source rationale
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-[#7C3AED] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/40 px-3 py-1 rounded-lg border border-[#DDD6FE] dark:border-purple-500/30 font-bold">
            Staff Level Q&amp;A
          </span>
        </div>

        <div class="flex flex-col gap-3 pt-1">
          ${followUpQuestions.map(item => `
            <div class="est-qa-card bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl overflow-hidden transition-all hover:border-[#0284C7] dark:hover:border-cyan-500/40 shadow-xs">
              <button
                type="button"
                class="est-qa-toggle w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer select-none"
                data-target="${item.id}"
              >
                <div class="flex items-center gap-2.5 flex-wrap">
                  <span class="font-sans text-[14px] font-bold text-[#0F172A] dark:text-white">${item.question}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-code font-bold ${item.badgeColor}">
                    ${item.badge}
                  </span>
                </div>
                <span class="material-symbols-outlined text-[#64748B] dark:text-slate-400 text-[18px] est-qa-icon transition-transform">
                  expand_more
                </span>
              </button>
              <div id="est-qa-${item.id}" class="est-qa-body px-4 pb-4 pt-1 text-[13px] text-[#334155] dark:text-slate-300 leading-relaxed border-t border-[#E2E8F0] dark:border-[#1E293B]">
                ${item.answer}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 7: KEY INTERVIEW TAKEAWAY -->
      <div class="rounded-2xl bg-[#F0F9FF] dark:bg-[#0F1E2E] border border-[#BAE6FD] dark:border-cyan-500/40 p-6 sm:p-8 shadow-sm flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-lg bg-white dark:bg-cyan-500/20 text-[#0284C7] dark:text-cyan-300 border border-[#BAE6FD] dark:border-cyan-500/40 font-code text-[11px] font-bold uppercase tracking-wider shadow-xs">
            Key Senior Interview Takeaway
          </span>
        </div>

        <p class="text-[15px] sm:text-[17px] text-[#0F172A] dark:text-white font-bold tracking-tight leading-snug">
          Numbers before boxes. Five lines of arithmetic tell you whether you need a distributed system at all.
        </p>

        <p class="text-[13.5px] sm:text-[14px] text-[#0369A1] dark:text-slate-200 leading-relaxed font-sans">
          The strongest signal you can send in a senior or staff interview is <strong class="text-[#0284C7] dark:text-cyan-300">talking yourself out of complexity</strong>:
          <span class="italic block sm:inline mt-1 sm:mt-0 text-[#0F172A] dark:text-white font-mono bg-white dark:bg-[#0A0E1A] px-2 py-0.5 rounded border border-[#BAE6FD] dark:border-[#24314A] shadow-xs">
            "1.71 GB fits in RAM, so replicas beat shards here."
          </span>
          This proves to the interviewer that you optimize for <strong>operability, maintainability, and blast radius</strong> — not for resume keywords.
        </p>
      </div>

    </div>
  `;
}
