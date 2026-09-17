/**
 * 0.2 The 7-Step Interview Framework - Visual Guide
 * High-signal, interactive, visually stunning presentation of the 45-minute sequencing skeleton
 * based on The Modern System Design Interview Guide (Page 6).
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
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
      accentBorder: "hover:border-cyan-500/50",
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
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
      accentBorder: "hover:border-emerald-500/50",
      icon: "calculate",
      summary: "Scale math: QPS, storage/yr, bandwidth, read:write ratio",
      content: `One minute of arithmetic tells you whether this is a single-Postgres problem or a sharded, multi-region problem. <span class="text-rose-300 font-semibold underline decoration-rose-500/40 underline-offset-2">Skipping it is the single most common senior-level mistake.</span> Derive traffic QPS, storage retention, ingress/egress bandwidth, and 80/20 RAM cache sizing.`,
      goldenRule: "One minute of arithmetic separates a single-Postgres problem from a multi-region sharded problem.",
      actionItem: "Calculate QPS, storage per year, network throughput, and read:write ratio on the whiteboard."
    },
    {
      step: 3,
      name: "Define API + Data Model",
      time: "8–12 min",
      badgeTime: "4 mins",
      badgeColor: "text-teal-400 bg-teal-500/15 border-teal-500/30",
      accentBorder: "hover:border-teal-500/50",
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
      badgeColor: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30",
      accentBorder: "hover:border-indigo-500/50",
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
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30",
      accentBorder: "hover:border-purple-500/50",
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
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      accentBorder: "hover:border-amber-500/50",
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
      badgeColor: "text-rose-400 bg-rose-500/15 border-rose-500/30",
      accentBorder: "hover:border-rose-500/50",
      icon: "workspace_premium",
      summary: "Trade-offs you chose, what you would do with more time",
      content: `Summarise the trade-offs: <span class="text-white font-semibold">"I chose X over Y because of Z; if the requirement changed to W I would revisit it."</span> <strong>This is the sentence that gets you the senior offer rather than the mid-level one.</strong> Mention operational rollout, telemetry, monitoring, and future evolution.`,
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
      signalColor: "text-cyan-400"
    },
    {
      signal: "Technology choice",
      icon: "storage",
      midLevel: `"I'd use Kafka and Cassandra"`,
      midNote: "Name-drops popular distributed tools without tying them to data shape or workload characteristics.",
      seniorStaff: `"Write-heavy, append-only, low-cardinality queries → Cassandra; if we need ad-hoc joins, this is the wrong call"`,
      seniorNote: "Defends choice based on access patterns and immediately states when the choice fails.",
      signalColor: "text-teal-400"
    },
    {
      signal: "Trade-offs",
      icon: "balance",
      midLevel: "Lists pros and cons generically",
      midNote: "Says 'Cassandra is fast but hard to manage; SQL is consistent but doesn't scale'.",
      seniorStaff: `Quantifies: "50% storage overhead vs. 200% for 3× replication"`,
      seniorNote: "Calculates cost, memory overhead, durability multipliers, and operational trade-offs with numbers.",
      signalColor: "text-emerald-400"
    },
    {
      signal: "Failure handling",
      icon: "warning",
      midLevel: `"Add a replica"`,
      midNote: "Assumes backups or basic replication solve reliability without understanding failure mechanics.",
      seniorStaff: "Explains failover, split-brain, replication lag, and read-after-write repair",
      seniorNote: "Articulates quorum consistency ($R + W > N$), leader election, partition isolation, and stale reads.",
      signalColor: "text-amber-400"
    },
    {
      signal: "Ownership",
      icon: "shield_person",
      midLevel: "Design only",
      midNote: "Draws an abstract diagram on the whiteboard and considers the problem complete.",
      seniorStaff: "Mentions rollout, migration, monitoring, on-call blast radius",
      seniorNote: "Considers zero-downtime schema migrations, canary deployments, SLO dashboards, and MTTR.",
      signalColor: "text-purple-400"
    }
  ];

  return `
    <div class="flex flex-col gap-7 animate-fadeIn text-slate-200">

      <!-- HERO BANNER: The 7-Step Sequencing Protocol -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161D32] via-[#0F172A] to-[#1A2644] border border-cyan-500/40 p-6 sm:p-8 shadow-xl shadow-cyan-950/30">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-4">
          <!-- Badges & Guide Page Reference -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-code font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px]">timer</span>
                45-Minute Sequencing Skeleton
              </span>
              <span class="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-code font-bold uppercase tracking-wider">
                Senior & Staff Interview Protocol
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-code text-slate-400 bg-[#0A0E1A]/80 px-2.5 py-1 rounded border border-[#24314A]">
                Part 0 · The Playbook
              </span>
              <span class="text-[11px] font-code text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30 flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">menu_book</span>
                Guide Page 6
              </span>
            </div>
          </div>

          <!-- Titles -->
          <div class="flex flex-col gap-1.5">
            <h2 class="font-sans text-[24px] sm:text-[30px] font-black text-white tracking-tight leading-tight flex items-center gap-3">
              <span>0.2 The 7-Step Interview Framework</span>
            </h2>
            <p class="text-[15px] sm:text-[17px] font-medium text-cyan-200/90 leading-snug">
              Sequencing Over Knowledge: How Senior Engineers Command the 45-Minute System Design Loop
            </p>
          </div>

          <!-- The Core Thesis Box -->
          <div class="p-4 sm:p-5 rounded-xl bg-[#0A0E1A]/90 border-l-4 border-cyan-400 border-r border-t border-b border-[#24314A] shadow-inner flex flex-col gap-2">
            <div class="flex items-center gap-2 text-cyan-400 font-code text-[11px] font-bold uppercase tracking-wider">
              <span class="material-symbols-outlined text-[16px]">priority_high</span>
              <span>The Fatal Mistake of Failed Senior Loops</span>
            </div>
            <p class="text-[14px] sm:text-[15px] text-slate-100 leading-relaxed font-sans">
              <strong class="text-white">Most failed senior loops are not failures of knowledge — they are failures of sequencing.</strong>
              The candidate starts drawing boxes at minute three, never states a number, and never names a trade-off.
              <span class="text-cyan-300 font-semibold">Use a fixed skeleton so your working memory is spent on the problem, not on the process.</span>
            </p>
          </div>

          <!-- 3 Traps Pill Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0A0E1A]/60 border border-rose-500/20 text-[12px] text-slate-300">
              <span class="material-symbols-outlined text-rose-400 text-[18px] shrink-0">cancel</span>
              <span>Drawing boxes at minute 3 without requirements</span>
            </div>
            <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0A0E1A]/60 border border-rose-500/20 text-[12px] text-slate-300">
              <span class="material-symbols-outlined text-rose-400 text-[18px] shrink-0">cancel</span>
              <span>Never stating a capacity arithmetic number</span>
            </div>
            <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0A0E1A]/60 border border-rose-500/20 text-[12px] text-slate-300">
              <span class="material-symbols-outlined text-rose-400 text-[18px] shrink-0">cancel</span>
              <span>Never naming a concrete, quantified trade-off</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 1: THE 45-MINUTE BUDGET VISUAL TIMELINE -->
      <div class="flex flex-col gap-4 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">schedule</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-white tracking-tight">
                45-MINUTE TIMELINE BUDGET
              </h3>
              <p class="text-[12px] font-code text-slate-400">
                Pacing is the #1 differentiator in senior loops. Stick to these time allocations strictly.
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-cyan-300 bg-[#0A0E1A] px-3 py-1.5 rounded-lg border border-[#24314A] shrink-0">
            Total Allocated: 45 Mins
          </span>
        </div>

        <!-- Visual Multi-segment Timeline Bar -->
        <div class="flex flex-col gap-2 pt-1">
          <div class="h-3.5 w-full bg-[#0A0E1A] rounded-full overflow-hidden flex border border-[#24314A] shadow-inner">
            <div style="width: 11.1%" class="h-full bg-cyan-500" title="0–5 min (11%): Requirements"></div>
            <div style="width: 6.7%" class="h-full bg-emerald-500" title="5–8 min (7%): Scale Math"></div>
            <div style="width: 8.9%" class="h-full bg-teal-500" title="8–12 min (9%): API + Data Model"></div>
            <div style="width: 17.8%" class="h-full bg-indigo-500" title="12–20 min (18%): High-Level Design"></div>
            <div style="width: 33.3%" class="h-full bg-purple-500" title="20–35 min (33%): Deep Dive"></div>
            <div style="width: 15.5%" class="h-full bg-amber-500" title="35–42 min (16%): Scale + Failure"></div>
            <div style="width: 6.7%" class="h-full bg-rose-500" title="42–45 min (7%): Wrap-up"></div>
          </div>

          <div class="flex items-center justify-between text-[10.5px] font-code text-slate-500 px-1">
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
            <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-3 flex flex-col justify-between gap-2.5 transition-all hover:border-cyan-500/40 group">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-white group-hover:text-cyan-300">Step ${s.step}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-code font-bold ${s.badgeColor}">
                  ${s.badgeTime}
                </span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="font-code text-[10.5px] text-slate-400">${s.time}</span>
                <span class="font-sans text-[12.5px] font-bold text-slate-200 leading-snug">${s.name}</span>
              </div>
              <p class="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">
                ${s.summary}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 2: THE 7 STEPS DETAILED BREAKDOWN -->
      <div class="flex flex-col gap-5 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">format_list_numbered</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-white tracking-tight">
                The 7-Step Deep Breakdown
              </h3>
              <p class="text-[12px] font-code text-slate-400">
                Actionable rules and high-signal behaviors for every phase of the interview
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-indigo-300 bg-[#0A0E1A] px-3 py-1.5 rounded-lg border border-[#24314A]">
            Modern System Design Playbook
          </span>
        </div>

        <!-- Step-by-Step Vertical Stack -->
        <div class="flex flex-col gap-4">
          ${stepsList.map(s => `
            <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 transition-all ${s.accentBorder} shadow-sm group">
              <!-- Step Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1E293B]">
                <div class="flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-lg bg-[#141C2E] border border-[#24314A] font-code text-[14px] font-black text-white flex items-center justify-center group-hover:border-cyan-500/50 group-hover:text-cyan-300 transition-colors">
                    ${s.step}
                  </span>
                  <div>
                    <h4 class="font-sans text-[16px] font-bold text-white group-hover:text-cyan-300 transition-colors">
                      ${s.step}. ${s.name}
                    </h4>
                    <span class="text-[11px] font-code text-slate-400">${s.summary}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold ${s.badgeColor}">
                    ${s.time} (${s.badgeTime})
                  </span>
                </div>
              </div>

              <!-- Main Content & Text -->
              <p class="text-[13px] sm:text-[13.5px] text-slate-300 leading-relaxed font-sans">
                ${s.content}
              </p>

              <!-- High-Signal Rules Callout -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                <div class="p-3 rounded-lg bg-[#141C2E]/90 border border-cyan-500/20 flex items-start gap-2.5">
                  <span class="material-symbols-outlined text-cyan-400 text-[18px] shrink-0 mt-0.5">verified</span>
                  <div class="flex flex-col">
                    <span class="font-code text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Senior Invariant</span>
                    <span class="text-[12px] text-slate-200 font-medium">${s.goldenRule}</span>
                  </div>
                </div>

                <div class="p-3 rounded-lg bg-[#141C2E]/90 border border-indigo-500/20 flex items-start gap-2.5">
                  <span class="material-symbols-outlined text-indigo-400 text-[18px] shrink-0 mt-0.5">flag</span>
                  <div class="flex flex-col">
                    <span class="font-code text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Whiteboard Action</span>
                    <span class="text-[12px] text-slate-200 font-medium">${s.actionItem}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 3: WHAT THE INTERVIEWER IS ACTUALLY SCORING -->
      <div class="flex flex-col gap-4 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">grading</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-white tracking-tight">
                ▸ What the Interviewer Is Actually Scoring
              </h3>
              <p class="text-[12px] font-code text-slate-400">
                Evaluation Rubric: Why Mid-Level candidates get downleveled while Senior/Staff candidates pass
              </p>
            </div>
          </div>
          <span class="text-[11px] font-code text-emerald-300 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-bold">
            Staff Level Calibration
          </span>
        </div>

        <!-- Rubric Comparison Matrix (Desktop Table & Mobile Friendly) -->
        <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0A0E1A]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#24314A] bg-[#0F1626] font-code text-[11px] uppercase tracking-wider">
                <th class="py-3 px-4 text-cyan-400 w-1/4">Evaluation Signal</th>
                <th class="py-3 px-4 text-amber-300 w-3/8 bg-amber-950/10 border-r border-[#24314A]">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-amber-400">remove_circle_outline</span>
                    <span>Mid-Level Answer (Downlevel Risk)</span>
                  </div>
                </th>
                <th class="py-3 px-4 text-emerald-400 w-3/8 bg-emerald-950/15">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-emerald-400">check_circle</span>
                    <span>Senior / Staff Answer (Hire Target)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E293B] text-[12.5px]">
              ${scoringTable.map(row => `
                <tr class="hover:bg-[#121A2B]/60 transition-colors">
                  <!-- Signal Column -->
                  <td class="py-4 px-4 font-sans font-bold text-white align-top">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] ${row.signalColor}">${row.icon}</span>
                      <span>${row.signal}</span>
                    </div>
                  </td>

                  <!-- Mid-level Column -->
                  <td class="py-4 px-4 text-slate-300 bg-amber-950/5 border-r border-[#24314A] align-top">
                    <div class="font-mono text-[12px] text-amber-200/90 font-medium pb-1">
                      ${row.midLevel}
                    </div>
                    <p class="text-[11px] text-slate-400 leading-relaxed font-sans">
                      ${row.midNote}
                    </p>
                  </td>

                  <!-- Senior Column -->
                  <td class="py-4 px-4 text-emerald-100 bg-emerald-950/10 align-top">
                    <div class="font-mono text-[12px] text-emerald-300 font-bold pb-1">
                      ${row.seniorStaff}
                    </div>
                    <p class="text-[11px] text-emerald-200/80 leading-relaxed font-sans">
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
      <div class="rounded-2xl bg-gradient-to-br from-indigo-950/50 via-[#101932] to-[#0A1024] border border-indigo-500/40 p-6 sm:p-7 shadow-xl flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[11px] font-bold uppercase tracking-wider">
            Step 7 Formula: The Senior Offer Sentence
          </span>
        </div>

        <p class="text-[14px] sm:text-[16px] text-slate-100 leading-relaxed font-sans">
          When concluding your design at minute 42–45, say this exact formulation out loud:
        </p>

        <div class="p-4 sm:p-5 rounded-xl bg-[#0A0E1A] border border-indigo-500/50 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-indigo-400 text-[24px] shrink-0 mt-0.5">format_quote</span>
            <span class="font-mono text-[13.5px] sm:text-[15px] font-bold text-indigo-200 leading-snug">
              "I chose X over Y because of Z; if the requirement changed to W I would revisit it."
            </span>
          </div>
          <button
            type="button"
            class="copy-tradeoff-formula-btn px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-[11.5px] font-code font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            data-formula="I chose X over Y because of Z; if the requirement changed to W I would revisit it."
            title="Copy formula to clipboard"
          >
            <span class="material-symbols-outlined text-[14px]">content_copy</span>
            <span>Copy Formula</span>
          </button>
        </div>

        <p class="text-[12px] text-slate-400 italic">
          ★ This is the sentence that gets you the senior offer rather than the mid-level one. It demonstrates trade-off awareness, technical humility, and adaptability to shifting production constraints.
        </p>
      </div>

      <!-- SECTION 5: INTERVIEW TIP - HONEST BOUNDARIES -->
      <div class="rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#1C1A16] to-[#0E0F14] border border-amber-500/40 p-6 sm:p-7 shadow-xl flex flex-col gap-3.5">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center">
              <span class="material-symbols-outlined text-[18px]">lightbulb</span>
            </span>
            <h4 class="font-sans text-[16px] font-bold text-amber-300 uppercase tracking-wider">
              INTERVIEW TIP · Narrate Your Uncertainty
            </h4>
          </div>
          <span class="px-2.5 py-0.5 rounded text-[11px] font-code font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Psychological Signal
          </span>
        </div>

        <div class="p-4 rounded-xl bg-[#0A0E1A]/90 border border-amber-500/30 shadow-inner flex flex-col gap-2">
          <p class="text-[13.5px] sm:text-[14.5px] text-amber-100 font-sans leading-relaxed">
            <strong>Narrate your uncertainty instead of hiding it:</strong>
            <br />
            <em class="font-mono text-[12.5px] text-amber-200 mt-1 block">
              "I don't know InfluxDB's internals, but the property I need is high-cardinality-safe label indexing, and here's how I'd validate that."
            </em>
          </p>
        </div>

        <div class="flex items-center gap-2 text-[12.5px] text-slate-300 leading-relaxed font-medium">
          <span class="material-symbols-outlined text-emerald-400 text-[18px] shrink-0">check</span>
          <span>
            This scores far higher than a confident wrong claim.
            <strong class="text-white">Interviewers probe claims; they rarely probe honest boundaries.</strong>
          </span>
        </div>
      </div>

      <!-- SECTION 6: INTERACTIVE 7-STEP DRILL CHECKLIST -->
      <div class="rounded-2xl bg-[#141C2E] border border-[#24314A] p-6 sm:p-7 shadow-lg flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">fact_check</span>
            </span>
            <div>
              <h3 class="font-sans text-[17px] font-bold text-white">
                45-Minute Mock Interview Drill Checklist
              </h3>
              <p class="text-[12px] font-code text-slate-400">
                Audit your mock design session against all 7 framework steps
              </p>
            </div>
          </div>
          <button
            type="button"
            class="reset-7step-checklist-btn px-3 py-1 rounded-lg bg-[#182238] border border-[#24314A] text-slate-400 hover:text-white text-[11px] font-code transition-colors cursor-pointer"
          >
            Reset Drill
          </button>
        </div>

        <div class="grid grid-cols-1 gap-2.5 pt-1">
          ${stepsList.map((s, idx) => {
            const isChecked = Boolean(savedChecks[idx]);
            return `
              <label class="sevenstep-check-item flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${isChecked ? 'border-emerald-500/50 bg-emerald-950/15 text-emerald-200' : 'border-[#24314A] bg-[#0A0E1A] hover:border-cyan-500/30 text-slate-300'}">
                <input
                  type="checkbox"
                  class="sevenstep-checkbox mt-0.5 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-[#161D32] cursor-pointer"
                  data-idx="${idx}"
                  ${isChecked ? 'checked' : ''}
                />
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-code text-[11px] font-bold text-cyan-400">Step ${s.step} (${s.time})</span>
                    <span class="font-sans text-[13px] font-bold text-white">${s.name}</span>
                  </div>
                  <span class="text-[12px] text-slate-300">${s.goldenRule}</span>
                </div>
              </label>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
}
