/**
 * 0.2 The 7-Step Interview Framework - Visual Guide
 * High-signal, interactive, visually stunning presentation of the 45-minute sequencing skeleton
 * based on The Modern System Design Interview Guide (Page 6).
 * Supports pristine Light and Dark themes with maximum contrast and readability.
 */

export function renderSevenStepFrameworkContent(topic) {
  // Retrieve saved 7-step checklist states from localStorage if available
  let savedChecks = {};
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('sysdesign_7step_checklist') : null;
    if (raw) savedChecks = JSON.parse(raw);
  } catch (e) {
    savedChecks = {};
  }

  const stepsList = [
    {
      step: 1,
      name: "Clarify Requirements",
      time: "0–5 min",
      badgeTime: "5 mins",
      badgeColor: "text-[#0284C7] dark:text-cyan-400 bg-[#F0F9FF] dark:bg-cyan-500/15 border-[#BAE6FD] dark:border-cyan-500/30",
      accentBorder: "hover:border-[#0284C7] dark:hover:border-cyan-500/50",
      icon: "rule",
      summary: "Functional, non-functional, explicitly out of scope",
      content: `Separate functional (<em>"user can upload a video"</em>) from non-functional (<em>"p99 &lt; 200 ms, 99.95% availability, eventual consistency acceptable for view counts"</em>). <strong>Say out loud what you are not building.</strong> Non-functional requirements are what drive the design; functional requirements only drive the API.`,
      goldenRule: "Non-functional requirements drive the architecture; functional requirements only drive the API.",
      actionItem: "State 2-3 explicit out-of-scope boundaries to protect your time budget."
    },
    {
      step: 2,
      name: "Do the Math (sec. 0.3)",
      time: "5–8 min",
      badgeTime: "3 mins",
      badgeColor: "text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-emerald-500/15 border-[#A7F3D0] dark:border-emerald-500/30",
      accentBorder: "hover:border-[#059669] dark:hover:border-emerald-500/50",
      icon: "calculate",
      summary: "Scale math: QPS, storage/yr, bandwidth, read:write ratio",
      content: `One minute of arithmetic tells you whether this is a single-Postgres problem or a sharded, multi-region problem. <span class="text-[#E11D48] dark:text-rose-300 font-semibold underline decoration-[#FECDD3] dark:decoration-rose-500/40 underline-offset-2">Skipping it is the single most common senior-level mistake.</span> Derive traffic QPS, storage retention, ingress/egress bandwidth, and 80/20 RAM cache sizing.`,
      goldenRule: "One minute of arithmetic separates a single-Postgres problem from a multi-region sharded problem.",
      actionItem: "Calculate QPS, storage per year, network throughput, and read:write ratio on the whiteboard."
    },
    {
      step: 3,
      name: "Define API + Data Model",
      time: "8–12 min",
      badgeTime: "4 mins",
      badgeColor: "text-[#0D9488] dark:text-teal-400 bg-[#F0FDF4] dark:bg-teal-500/15 border-[#BBF7D0] dark:border-teal-500/30",
      accentBorder: "hover:border-[#0D9488] dark:hover:border-teal-500/50",
      icon: "schema",
      summary: "Endpoints, entities, access patterns",
      content: `Access patterns determine the database, not the other way round. <strong>Write the three queries the system must serve fast.</strong> Define core REST/gRPC endpoints, entity relationships, and partition/clustering keys.`,
      goldenRule: "Access patterns determine the database, not the other way round.",
      actionItem: "Write the 3 critical queries the system must serve under p99 latency constraints."
    },
    {
      step: 4,
      name: "Draw High-Level Design",
      time: "12–20 min",
      badgeTime: "8 mins",
      badgeColor: "text-[#4F46E5] dark:text-indigo-400 bg-[#F5F3FF] dark:bg-indigo-500/15 border-[#DDD6FE] dark:border-indigo-500/30",
      accentBorder: "hover:border-[#4F46E5] dark:hover:border-indigo-500/50",
      icon: "account_tree",
      summary: "Boxes, arrows, happy path end to end",
      content: `Draw boxes, arrows, and <strong>trace one request end to end before adding anything clever</strong>. Keep it simple: Client → DNS/CDN → API Gateway / Load Balancer → Stateless App Services → Primary Storage. Do not jump to Kafka or Redis prematurely.`,
      goldenRule: "Trace one single request end to end before adding anything clever.",
      actionItem: "Walkthrough client request to persisted response without adding premature complexity."
    },
    {
      step: 5,
      name: "Deep Dive Where Invited",
      time: "20–35 min",
      badgeTime: "15 mins",
      badgeColor: "text-[#7C3AED] dark:text-purple-400 bg-[#F5F3FF] dark:bg-purple-500/15 border-[#DDD6FE] dark:border-purple-500/30",
      accentBorder: "hover:border-[#7C3AED] dark:hover:border-purple-500/50",
      icon: "psychology",
      summary: "The 1–2 hard parts the interviewer steers you to",
      content: `Follow the interviewer's signal. If they ask <em>"how do you prevent double charging?"</em>, <strong>that is the entire rest of the interview (sec. 9.4.3)</strong>. Spend your largest time chunk (15 mins) deep-diving into idempotent keys, distributed locks, concurrency, or consensus.`,
      goldenRule: "Follow the interviewer's steering. Their question is your entire remaining design problem.",
      actionItem: "Pinpoint edge cases, idempotency keys, state machines, and concurrency primitives."
    },
    {
      step: 6,
      name: "Scale + Failure Modes",
      time: "35–42 min",
      badgeTime: "7 mins",
      badgeColor: "text-[#D97706] dark:text-amber-400 bg-[#FFFBEB] dark:bg-amber-500/15 border-[#FDE68A] dark:border-amber-500/30",
      accentBorder: "hover:border-[#D97706] dark:hover:border-amber-500/50",
      icon: "crisis_alert",
      summary: "Bottleneck → fix → new bottleneck; what breaks and why",
      content: `Name the bottleneck, fix it, name the next one. Then state the failure modes: <strong>what happens when this component dies, when the network partitions, when traffic is 10×?</strong> Discuss failover, split-brain, replication lag, cascading failure, and blast radius.`,
      goldenRule: "Name the bottleneck, fix it, name the next one. Always name what happens when a node dies.",
      actionItem: "Explicitly analyze component crashes, network partitions, and sudden 10× traffic spikes."
    },
    {
      step: 7,
      name: "Wrap-Up & Trade-Offs",
      time: "42–45 min",
      badgeTime: "3 mins",
      badgeColor: "text-[#E11D48] dark:text-rose-400 bg-[#FFF1F2] dark:bg-rose-500/15 border-[#FECDD3] dark:border-rose-500/30",
      accentBorder: "hover:border-[#E11D48] dark:hover:border-rose-500/50",
      icon: "workspace_premium",
      summary: "Trade-offs you chose, what you would do with more time",
      content: `Summarise the trade-offs: <span class="text-[#0F172A] dark:text-white font-semibold">"I chose X over Y because of Z; if the requirement changed to W I would revisit it."</span> <strong>This is the sentence that gets you the senior offer rather than the mid-level one.</strong> Mention operational rollout, telemetry, monitoring, and future evolution.`,
      goldenRule: `"I chose X over Y because of Z; if the requirement changed to W I would revisit it."`,
      actionItem: "Deliver the senior offer sentence summarizing your primary architectural compromise."
    }
  ];

  const scoringTable = [
    {
      signal: "Requirements",
      icon: "checklist",
      midLevel: "Starts designing immediately",
      midNote: "Jumps to drawing boxes in minute 3 without asking questions or establishing targets.",
      seniorStaff: "Pins down scale, consistency and latency targets first",
      seniorNote: "Quantifies SLAs (p99 < 200ms), availability (99.95%), and names out-of-scope items.",
      signalColor: "text-[#0284C7] dark:text-cyan-400"
    },
    {
      signal: "Technology choice",
      icon: "storage",
      midLevel: `"I'd use Kafka and Cassandra"`,
      midNote: "Name-drops popular distributed tools without tying them to data shape or workload characteristics.",
      seniorStaff: `"Write-heavy, append-only, low-cardinality queries → Cassandra; if we need ad-hoc joins, this is the wrong call"`,
      seniorNote: "Defends choice based on access patterns and immediately states when the choice fails.",
      signalColor: "text-[#0D9488] dark:text-teal-400"
    },
    {
      signal: "Trade-offs",
      icon: "balance",
      midLevel: "Lists pros and cons generically",
      midNote: "Says 'Cassandra is fast but hard to manage; SQL is consistent but doesn't scale'.",
      seniorStaff: `Quantifies: "50% storage overhead vs. 200% for 3× replication"`,
      seniorNote: "Calculates cost, memory overhead, durability multipliers, and operational trade-offs with numbers.",
      signalColor: "text-[#059669] dark:text-emerald-400"
    },
    {
      signal: "Failure handling",
      icon: "warning",
      midLevel: `"Add a replica"`,
      midNote: "Assumes backups or basic replication solve reliability without understanding failure mechanics.",
      seniorStaff: "Explains failover, split-brain, replication lag, and read-after-write repair",
      seniorNote: "Articulates quorum consistency ($R + W > N$), leader election, partition isolation, and stale reads.",
      signalColor: "text-[#D97706] dark:text-amber-400"
    },
    {
      signal: "Ownership",
      icon: "shield_person",
      midLevel: "Design only",
      midNote: "Draws an abstract diagram on the whiteboard and considers the problem complete.",
      seniorStaff: "Mentions rollout, migration, monitoring, on-call blast radius",
      seniorNote: "Considers zero-downtime schema migrations, canary deployments, SLO dashboards, and MTTR.",
      signalColor: "text-[#7C3AED] dark:text-purple-400"
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-7 animate-fadeIn text-[#0F172A] dark:text-slate-200">

      <!-- HERO BANNER: The 7-Step Sequencing Protocol -->
      <div class="relative overflow-hidden rounded-2xl bg-[#EFF6FF] dark:bg-[#161D32] border border-[#BFDBFE] dark:border-cyan-500/40 p-6 sm:p-8 shadow-sm">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-4">
          <!-- Badges & Guide Page Reference -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-lg bg-white dark:bg-cyan-500/20 text-[#0284C7] dark:text-cyan-300 border border-[#BAE6FD] dark:border-cyan-500/40 text-[11px] font-code font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span class="material-symbols-outlined text-[14px]">timer</span>
                45-Minute Sequencing Skeleton
              </span>
              <span class="px-3 py-1 rounded-lg bg-white dark:bg-indigo-500/20 text-[#4F46E5] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-500/30 text-[11px] font-code font-bold uppercase tracking-wider shadow-xs">
                Senior &amp; Staff Interview Protocol
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-code text-[#475569] dark:text-slate-400 bg-white dark:bg-[#0A0E1A]/80 px-2.5 py-1 rounded border border-[#E2E8F0] dark:border-[#24314A] font-semibold">
                Part 0 &bull; The Playbook
              </span>
              <span class="text-[11px] font-code text-[#0284C7] dark:text-cyan-400 bg-white dark:bg-cyan-950/60 px-2.5 py-1 rounded border border-[#BAE6FD] dark:border-cyan-500/30 flex items-center gap-1 font-semibold">
                <span class="material-symbols-outlined text-[13px]">menu_book</span>
                Guide Page 6
              </span>
            </div>
          </div>

          <!-- Titles -->
          <div class="flex flex-col gap-1.5">
            <h2 class="font-sans text-[24px] sm:text-[30px] font-black text-[#0F172A] dark:text-white tracking-tight leading-tight flex items-center gap-3">
              <span>0.2 The 7-Step Interview Framework</span>
            </h2>
            <p class="text-[15px] sm:text-[17px] font-medium text-[#1E40AF] dark:text-cyan-200/90 leading-snug">
              Sequencing Over Knowledge: How Senior Engineers Command the 45-Minute System Design Loop
            </p>
          </div>

          <!-- The Core Thesis Box -->
          <div class="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A0E1A]/90 border-l-4 border-[#0284C7] dark:border-cyan-400 border-r border-t border-b border-[#E2E8F0] dark:border-[#24314A] shadow-xs flex flex-col gap-2">
            <div class="flex items-center gap-2 text-[#0284C7] dark:text-cyan-400 font-code text-[11px] font-bold uppercase tracking-wider">
              <span class="material-symbols-outlined text-[16px]">priority_high</span>
              <span>The Fatal Mistake of Failed Senior Loops</span>
            </div>
            <p class="text-[14px] sm:text-[15px] text-[#0F172A] dark:text-slate-100 leading-relaxed font-sans">
              <strong class="text-[#0F172A] dark:text-white">Most failed senior loops are not failures of knowledge — they are failures of sequencing.</strong>
              The candidate starts drawing boxes at minute three, never states a number, and never names a trade-off.
              <span class="text-[#0284C7] dark:text-cyan-300 font-semibold">Use a fixed skeleton so your working memory is spent on the problem, not on the process.</span>
            </p>
          </div>

          <!-- 3 Traps Pill Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#0A0E1A]/60 border border-[#FECDD3] dark:border-rose-500/20 text-[12px] text-[#475569] dark:text-slate-300 shadow-xs">
              <span class="material-symbols-outlined text-[#E11D48] dark:text-rose-400 text-[18px] shrink-0">cancel</span>
              <span>Drawing boxes at minute 3 without requirements</span>
            </div>
            <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#0A0E1A]/60 border border-[#FECDD3] dark:border-rose-500/20 text-[12px] text-[#475569] dark:text-slate-300 shadow-xs">
              <span class="material-symbols-outlined text-[#E11D48] dark:text-rose-400 text-[18px] shrink-0">cancel</span>
              <span>Never stating a capacity arithmetic number</span>
            </div>
            <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#0A0E1A]/60 border border-[#FECDD3] dark:border-rose-500/20 text-[12px] text-[#475569] dark:text-slate-300 shadow-xs">
              <span class="material-symbols-outlined text-[#E11D48] dark:text-rose-400 text-[18px] shrink-0">cancel</span>
              <span>Never naming a concrete, quantified trade-off</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 1: THE 45-MINUTE BUDGET VISUAL TIMELINE -->
      <div class="flex flex-col gap-4 bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#F0F9FF] dark:bg-cyan-500/15 border border-[#BAE6FD] dark:border-cyan-500/30 text-[#0284C7] dark:text-cyan-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">schedule</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                45-MINUTE TIMELINE BUDGET
              </h3>
              <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
                Pacing is the #1 differentiator in senior loops. Stick to these time allocations strictly.
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-[#0284C7] dark:text-cyan-300 bg-[#F0F9FF] dark:bg-[#0A0E1A] px-3 py-1.5 rounded-lg border border-[#BAE6FD] dark:border-[#24314A] font-bold shrink-0">
            Total Allocated: 45 Mins
          </span>
        </div>

        <!-- Visual Multi-segment Timeline Bar -->
        <div class="flex flex-col gap-2 pt-1">
          <div class="h-3.5 w-full bg-[#F1F5F9] dark:bg-[#0A0E1A] rounded-full overflow-hidden flex border border-[#E2E8F0] dark:border-[#24314A] shadow-inner">
            <div style="width: 11.1%" class="h-full bg-cyan-500" title="0–5 min (11%): Requirements"></div>
            <div style="width: 6.7%" class="h-full bg-emerald-500" title="5–8 min (7%): Scale Math"></div>
            <div style="width: 8.9%" class="h-full bg-teal-500" title="8–12 min (9%): API + Data Model"></div>
            <div style="width: 17.8%" class="h-full bg-indigo-500" title="12–20 min (18%): High-Level Design"></div>
            <div style="width: 33.3%" class="h-full bg-purple-500" title="20–35 min (33%): Deep Dive"></div>
            <div style="width: 15.5%" class="h-full bg-amber-500" title="35–42 min (16%): Scale + Failure"></div>
            <div style="width: 6.7%" class="h-full bg-rose-500" title="42–45 min (7%): Wrap-up"></div>
          </div>

          <div class="flex items-center justify-between text-[10.5px] font-code text-[#64748B] dark:text-slate-500 px-1 font-semibold">
            <span>0m (Start)</span>
            <span>12m (Core Ingress)</span>
            <span>20m (Happy Path Done)</span>
            <span>35m (Hard Parts Handled)</span>
            <span>45m (Senior Wrap-up)</span>
          </div>
        </div>

        <!-- 7 Timeline Budget Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 pt-2">
          ${stepsList.map(s => `
            <div class="bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-3 flex flex-col justify-between gap-2.5 transition-all hover:border-[#0284C7] dark:hover:border-cyan-500/40 group shadow-xs">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-[#0F172A] dark:text-white group-hover:text-[#0284C7] dark:group-hover:text-cyan-300">Step ${s.step}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-code font-bold ${s.badgeColor}">
                  ${s.badgeTime}
                </span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="font-code text-[10.5px] text-[#64748B] dark:text-slate-400 font-semibold">${s.time}</span>
                <span class="font-sans text-[12.5px] font-bold text-[#0F172A] dark:text-slate-200 leading-snug">${s.name}</span>
              </div>
              <p class="text-[10.5px] text-[#475569] dark:text-slate-400 line-clamp-2 leading-relaxed">
                ${s.summary}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 2: THE 7 STEPS DETAILED BREAKDOWN -->
      <div class="flex flex-col gap-5 bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#F5F3FF] dark:bg-indigo-500/15 border border-[#DDD6FE] dark:border-indigo-500/30 text-[#4F46E5] dark:text-indigo-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">format_list_numbered</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                The 7-Step Deep Breakdown
              </h3>
              <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
                Actionable rules and high-signal behaviors for every phase of the interview
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-[#4F46E5] dark:text-indigo-300 bg-[#F5F3FF] dark:bg-[#0A0E1A] px-3 py-1.5 rounded-lg border border-[#DDD6FE] dark:border-[#24314A] font-bold">
            Modern System Design Playbook
          </span>
        </div>

        <!-- Step-by-Step Vertical Stack -->
        <div class="flex flex-col gap-4">
          ${stepsList.map(s => `
            <div class="bg-[#F8FAFC] dark:bg-[#0A0E1A] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 transition-all ${s.accentBorder} shadow-xs group">
              <!-- Step Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                <div class="flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-lg bg-white dark:bg-[#141C2E] border border-[#CBD5E1] dark:border-[#24314A] font-code text-[14px] font-black text-[#0F172A] dark:text-white flex items-center justify-center group-hover:border-[#0284C7] dark:group-hover:border-cyan-500/50 group-hover:text-[#0284C7] dark:group-hover:text-cyan-300 transition-colors shadow-xs">
                    ${s.step}
                  </span>
                  <div>
                    <h4 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white group-hover:text-[#0284C7] dark:group-hover:text-cyan-300 transition-colors">
                      ${s.step}. ${s.name}
                    </h4>
                    <span class="text-[11px] font-code text-[#64748B] dark:text-slate-400 font-semibold">${s.summary}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold ${s.badgeColor}">
                    ${s.time} (${s.badgeTime})
                  </span>
                </div>
              </div>

              <!-- Main Content & Text -->
              <p class="text-[13px] sm:text-[13.5px] text-[#334155] dark:text-slate-300 leading-relaxed font-sans">
                ${s.content}
              </p>

              <!-- High-Signal Rules Callout -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                <div class="p-3 rounded-lg bg-white dark:bg-[#141C2E]/90 border border-[#BAE6FD] dark:border-cyan-500/20 flex items-start gap-2.5 shadow-xs">
                  <span class="material-symbols-outlined text-[#0284C7] dark:text-cyan-400 text-[18px] shrink-0 mt-0.5">verified</span>
                  <div class="flex flex-col">
                    <span class="font-code text-[10px] text-[#0284C7] dark:text-cyan-400 uppercase font-bold tracking-wider">Senior Invariant</span>
                    <span class="text-[12px] text-[#0F172A] dark:text-slate-200 font-medium">${s.goldenRule}</span>
                  </div>
                </div>

                <div class="p-3 rounded-lg bg-white dark:bg-[#141C2E]/90 border border-[#DDD6FE] dark:border-indigo-500/20 flex items-start gap-2.5 shadow-xs">
                  <span class="material-symbols-outlined text-[#4F46E5] dark:text-indigo-400 text-[18px] shrink-0 mt-0.5">flag</span>
                  <div class="flex flex-col">
                    <span class="font-code text-[10px] text-[#4F46E5] dark:text-indigo-400 uppercase font-bold tracking-wider">Whiteboard Action</span>
                    <span class="text-[12px] text-[#0F172A] dark:text-slate-200 font-medium">${s.actionItem}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 3: WHAT THE INTERVIEWER IS ACTUALLY SCORING -->
      <div class="flex flex-col gap-4 bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#ECFDF5] dark:bg-emerald-500/15 border border-[#A7F3D0] dark:border-emerald-500/30 text-[#059669] dark:text-emerald-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">grading</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                ▸ What the Interviewer Is Actually Scoring
              </h3>
              <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
                Evaluation Rubric: Why Mid-Level candidates get downleveled while Senior/Staff candidates pass
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-[#059669] dark:text-emerald-300 bg-[#ECFDF5] dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-[#A7F3D0] dark:border-emerald-500/30 font-bold">
            Staff Level Calibration
          </span>
        </div>

        <!-- Rubric Comparison Matrix (Desktop Table & Mobile Friendly) -->
        <div class="overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-[#24314A] bg-white dark:bg-[#0A0E1A] shadow-xs">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#E2E8F0] dark:border-[#24314A] bg-[#F8FAFC] dark:bg-[#0F1626] font-code text-[11px] uppercase tracking-wider">
                <th class="py-3 px-4 text-[#0284C7] dark:text-cyan-400 w-1/4">Evaluation Signal</th>
                <th class="py-3 px-4 text-[#D97706] dark:text-amber-300 w-3/8 bg-[#FFFBEB] dark:bg-amber-950/10 border-r border-[#E2E8F0] dark:border-[#24314A]">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-[#D97706] dark:text-amber-400">remove_circle_outline</span>
                    <span>Mid-Level Answer (Downlevel Risk)</span>
                  </div>
                </th>
                <th class="py-3 px-4 text-[#059669] dark:text-emerald-400 w-3/8 bg-[#ECFDF5] dark:bg-emerald-950/15">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-[#059669] dark:text-emerald-400">check_circle</span>
                    <span>Senior / Staff Answer (Hire Target)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-[12.5px]">
              ${scoringTable.map(row => `
                <tr class="hover:bg-[#F8FAFC] dark:hover:bg-[#121A2B]/60 transition-colors">
                  <!-- Signal Column -->
                  <td class="py-4 px-4 font-sans font-bold text-[#0F172A] dark:text-white align-top">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] ${row.signalColor}">${row.icon}</span>
                      <span>${row.signal}</span>
                    </div>
                  </td>

                  <!-- Mid-level Column -->
                  <td class="py-4 px-4 text-[#475569] dark:text-slate-300 bg-[#FFFBEB]/40 dark:bg-amber-950/5 border-r border-[#E2E8F0] dark:border-[#24314A] align-top">
                    <div class="font-sans text-[12px] text-[#B45309] dark:text-amber-200/90 font-bold pb-1">
                      ${row.midLevel}
                    </div>
                    <p class="text-[11.5px] text-[#64748B] dark:text-slate-400 leading-relaxed font-sans">
                      ${row.midNote}
                    </p>
                  </td>

                  <!-- Senior Column -->
                  <td class="py-4 px-4 text-[#065F46] dark:text-emerald-100 bg-[#ECFDF5]/50 dark:bg-emerald-950/10 align-top">
                    <div class="font-sans text-[12px] text-[#059669] dark:text-emerald-300 font-bold pb-1">
                      ${row.seniorStaff}
                    </div>
                    <p class="text-[11.5px] text-[#047857] dark:text-emerald-200/80 leading-relaxed font-sans">
                      ${row.seniorNote}
                    </p>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 4: THE GOLDEN SENIOR OFFER SENTENCE -->
      <div class="rounded-2xl bg-[#F5F3FF] dark:bg-[#161D2A] border border-[#DDD6FE] dark:border-indigo-500/40 p-6 sm:p-7 shadow-sm flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-lg bg-white dark:bg-indigo-500/20 text-[#4F46E5] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-500/40 font-code text-[11px] font-bold uppercase tracking-wider shadow-xs">
            Step 7 Formula: The Senior Offer Sentence
          </span>
        </div>

        <p class="text-[14px] sm:text-[16px] text-[#0F172A] dark:text-slate-100 leading-relaxed font-sans">
          When concluding your design at minute 42–45, say this exact formulation out loud:
        </p>

        <div class="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A0E1A] border border-[#DDD6FE] dark:border-indigo-500/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-[#4F46E5] dark:text-indigo-400 text-[24px] shrink-0 mt-0.5">format_quote</span>
            <span class="font-sans text-[13.5px] sm:text-[15px] font-bold text-[#4338CA] dark:text-indigo-200 leading-snug">
              "I chose X over Y because of Z; if the requirement changed to W I would revisit it."
            </span>
          </div>
          <button
            type="button"
            class="copy-tradeoff-formula-btn px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] text-[11.5px] font-code font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
            data-formula="I chose X over Y because of Z; if the requirement changed to W I would revisit it."
            title="Copy formula to clipboard"
          >
            <span class="material-symbols-outlined text-[14px]">content_copy</span>
            <span>Copy Formula</span>
          </button>
        </div>

        <p class="text-[12px] text-[#475569] dark:text-slate-400 italic">
          ★ This is the sentence that gets you the senior offer rather than the mid-level one. It demonstrates trade-off awareness, technical humility, and adaptability to shifting production constraints.
        </p>
      </div>

      <!-- SECTION 5: INTERVIEW TIP - HONEST BOUNDARIES -->
      <div class="rounded-2xl bg-[#FFFBEB] dark:bg-[#1C1A16] border border-[#FDE68A] dark:border-amber-500/40 p-6 sm:p-7 shadow-sm flex flex-col gap-3.5">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-white dark:bg-amber-500/20 border border-[#FDE68A] dark:border-amber-500/40 text-[#D97706] dark:text-amber-400 flex items-center shadow-xs">
              <span class="material-symbols-outlined text-[18px]">lightbulb</span>
            </span>
            <h4 class="font-sans text-[16px] font-bold text-[#92400E] dark:text-amber-300 uppercase tracking-wider">
              INTERVIEW TIP &bull; Narrate Your Uncertainty
            </h4>
          </div>
          <span class="px-2.5 py-0.5 rounded text-[11px] font-code font-bold bg-white dark:bg-amber-500/10 text-[#D97706] dark:text-amber-300 border border-[#FDE68A] dark:border-amber-500/30 shadow-xs">
            Psychological Signal
          </span>
        </div>

        <div class="p-4 rounded-xl bg-white dark:bg-[#0A0E1A]/90 border border-[#FDE68A] dark:border-amber-500/30 shadow-xs flex flex-col gap-2">
          <p class="text-[13.5px] sm:text-[14.5px] text-[#92400E] dark:text-amber-100 font-sans leading-relaxed">
            <strong class="text-[#0F172A] dark:text-amber-100 font-sans">Narrate your uncertainty instead of hiding it:</strong>
            <br />
            <em class="font-sans text-[13px] text-[#B45309] dark:text-amber-200 mt-1 block font-medium not-italic">
              "I don't know InfluxDB's internals, but the property I need is high-cardinality-safe label indexing, and here's how I'd validate that."
            </em>
          </p>
        </div>

        <div class="flex items-center gap-2 text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed font-medium">
          <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[18px] shrink-0">check</span>
          <span>
            This scores far higher than a confident wrong claim.
            <strong class="text-[#0F172A] dark:text-white">Interviewers probe claims; they rarely probe honest boundaries.</strong>
          </span>
        </div>
      </div>

      <!-- SECTION 6: INTERACTIVE 7-STEP DRILL CHECKLIST -->
      <div class="rounded-2xl bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] p-6 sm:p-7 shadow-sm flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#F0FDF4] dark:bg-teal-500/15 border border-[#BBF7D0] dark:border-teal-500/30 text-[#0D9488] dark:text-teal-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">fact_check</span>
            </span>
            <div>
              <h3 class="font-sans text-[17px] font-bold text-[#0F172A] dark:text-white">
                45-Minute Mock Interview Drill Checklist
              </h3>
              <p class="text-[12px] font-code text-[#475569] dark:text-slate-400">
                Audit your mock design session against all 7 framework steps
              </p>
            </div>
          </div>
          <button
            type="button"
            class="reset-7step-checklist-btn px-3 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#182238] border border-[#E2E8F0] dark:border-[#24314A] text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white text-[11px] font-code transition-colors cursor-pointer shadow-xs"
          >
            Reset Drill
          </button>
        </div>

        <div class="grid grid-cols-1 gap-2.5 pt-1">
          ${stepsList.map((s, idx) => {
            const isChecked = Boolean(savedChecks[idx]);
            return `
              <label class="sevenstep-check-item flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none shadow-xs ${isChecked ? 'border-[#A7F3D0] dark:border-emerald-500/50 bg-[#ECFDF5] dark:bg-emerald-950/15 text-[#065F46] dark:text-emerald-200' : 'border-[#E2E8F0] dark:border-[#24314A] bg-[#F8FAFC] dark:bg-[#0A0E1A] hover:border-[#0284C7] dark:hover:border-cyan-500/30 text-[#0F172A] dark:text-slate-300'}">
                <input
                  type="checkbox"
                  class="sevenstep-checkbox mt-0.5 w-4 h-4 rounded border-[#CBD5E1] dark:border-slate-700 text-[#059669] focus:ring-0 focus:ring-offset-0 bg-white dark:bg-[#161D32] cursor-pointer"
                  data-idx="${idx}"
                  ${isChecked ? 'checked' : ''}
                />
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-code text-[11px] font-bold text-[#0284C7] dark:text-cyan-400">Step ${s.step} (${s.time})</span>
                    <span class="font-sans text-[13px] font-bold text-[#0F172A] dark:text-white">${s.name}</span>
                  </div>
                  <span class="text-[12px] text-[#475569] dark:text-slate-300">${s.goldenRule}</span>
                </div>
              </label>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
}
