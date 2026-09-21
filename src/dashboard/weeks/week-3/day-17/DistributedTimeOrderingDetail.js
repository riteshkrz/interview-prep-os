/**
 * 10.2 Distributed Time and Ordering - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 106, 107, and 108
 * from The Modern System Design Interview Guide.
 */

export function renderDistributedTimeOrderingContent(topic) {
  const clockMechanisms = [
    {
      name: "Physical Wall-Clock (NTP)",
      ordering: "Weak / Dangerous (Subject to drift & steps)",
      concurrency: "Cannot detect concurrency (Silent overwrite via LWW)",
      hardware: "Standard commodity quartz oscillator + NTP daemon",
      overhead: "Low (8-byte int64 epoch timestamp)",
      systems: "Cassandra (LWW), CouchDB, Redis expiry",
      verdict: "Fine for TTLs and human logs; fatal for transactional ordering",
      badgeColor: "text-rose-400 bg-rose-500/15 border-rose-500/30"
    },
    {
      name: "Lamport Timestamps",
      ordering: "Total Order (Tie-broken by Node ID: (counter, node_id))",
      concurrency: "Cannot detect concurrency (Forces arbitrary artificial order)",
      hardware: "Pure software counter incremented on message passing",
      overhead: "Minimal (4-byte or 8-byte scalar counter appended to RPCs)",
      systems: "Distributed mutual exclusion, total-order multicast",
      verdict: "Guarantees causal sequence A → B, but cannot determine if A || B",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      name: "Vector Clocks",
      ordering: "Causal Partial Order",
      concurrency: "Exact concurrency detection (Generates sibling versions)",
      hardware: "Pure software vector array: V[1..N] per node",
      overhead: "High (O(N) vector size where N = number of participating nodes)",
      systems: "Amazon Dynamo (original), Riak KV, Couchbase",
      verdict: "Perfect for optimistic offline writes; requires domain merge logic",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      name: "Hybrid Logical Clocks (HLC)",
      ordering: "Monotonic Causal Order bounded by physical wall-clock",
      concurrency: "Detects causality; tracks physical time drift threshold",
      hardware: "Standard server quartz clock + logical drift counter",
      overhead: "Medium (8-byte physical millis + 2-byte logical counter)",
      systems: "CockroachDB, MongoDB sharding, YugabyteDB",
      verdict: "Modern industry standard for distributed SQL without GPS hardware",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      name: "Google Spanner TrueTime",
      ordering: "Strict Global Linearizability (External Consistency)",
      concurrency: "Bounded uncertainty interval [earliest, latest] + Commit-Wait",
      hardware: "Dedicated GPS receivers + Rubidium Atomic clocks in every datacenter",
      overhead: "Low network metadata; latency cost is 2ε commit-wait delay (~7ms)",
      systems: "Google Spanner, CockroachDB (inspired by), FaunaDB",
      verdict: "The planetary gold standard; eliminates distributed read locks entirely",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const failureScenarios = [
    {
      title: "1. The Quartz Oscillator Drift Trap",
      icon: "schedule",
      color: "rose",
      description: "Commodity server crystal oscillators drift by 17 seconds per year (~2 seconds per month) depending on datacenter ambient temperature, voltage fluctuations, and component age. Even with NTP, virtualized cloud instances suffer asymmetric hypervisor scheduling pauses, skewing physical clocks by 100ms to 2+ seconds.",
      impact: "Two servers disagree on who updated an account first, causing transaction inversion."
    },
    {
      title: "2. The 2012 Leap Second Linux Kernel Crash",
      icon: "crisis_alert",
      color: "amber",
      description: "On June 30, 2012, an astronomical leap second (23:59:60) was inserted. When NTP servers stepped Linux clocks backward by 1 second, the Linux kernel futex subsystem suffered a catastrophic livelock. Thousands of production servers at Reddit, Yelp, LinkedIn, and Qantas spiked to 100% CPU and crashed simultaneously.",
      impact: "Modern mitigation: Google Leap Smear (spreading the extra second across a 24-hour window)."
    },
    {
      title: "3. Last-Write-Wins (LWW) Silent Data Loss",
      icon: "delete_forever",
      color: "purple",
      description: "Systems like Apache Cassandra default to Last-Write-Wins (LWW) based on client or coordinator timestamps. If Node A's clock is 80ms ahead of Node B, an older edit on Node A will permanently overwrite and silently delete a legitimate newer update on Node B without generating an error or warning.",
      impact: "Silent, unrecoverable data loss in financial, inventory, or collaborative records."
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Cassandra uses Last-Write-Wins (LWW) by default. How do you defend against silent data loss caused by clock skew in production?",
      answer: "In production, three defenses protect Cassandra systems: (1) <strong>Run Chrony instead of ntpd</strong> with tight slew configurations (max slew rate, step disabled) and alert when clock drift exceeds 10ms. (2) <strong>Use Server-Side Timestamps</strong> generated exclusively by the coordinator node rather than trusting client-provided wall clocks, eliminating client device clock skew. (3) <strong>Avoid blind LWW for read-modify-write workflows</strong>: use Lightweight Transactions (LWT, which uses Paxos underneath) or write update mutations as append-only immutable event streams and resolve state on the read path via Conflict-free Replicated Data Types (CRDTs)."
    },
    {
      qNum: "Q2",
      question: "What is a Hybrid Logical Clock (HLC) and why did CockroachDB and MongoDB adopt it over pure vector clocks or TrueTime?",
      answer: "A Hybrid Logical Clock combines a physical clock timestamp $pt$ with a logical counter $l$. If a received message has physical time $pt_{msg} > pt_{local}$, the HLC advances its physical component to $pt_{msg}$ and resets $l=0$; if $pt_{msg} == pt_{local}$, it increments $l$. CockroachDB and MongoDB adopted HLC because: (1) Unlike TrueTime, it requires <strong>no expensive proprietary atomic clock or GPS hardware</strong>; (2) Unlike Vector Clocks, its metadata footprint is fixed (10 bytes: 8-byte millis + 2-byte logical) rather than growing with cluster size $O(N)$; and (3) It stays tightly bound to real physical time (within max drift offset $\\pm 250$ms), enabling point-in-time historical snapshot queries (AS OF SYSTEM TIME)."
    },
    {
      qNum: "Q3",
      question: "If Google Spanner's atomic clocks fail or GPS antennas lose satellite lock, what happens to TrueTime and the database?",
      answer: "TrueTime explicitly quantifies its uncertainty interval as $[t - \\epsilon, t + \\epsilon]$. When GPS and atomic clocks are healthy, $\\epsilon \\approx 1-7$ms. If GPS antenna connections fail or a rubidium clock fails, Spanner's TrueTime daemon falls back to estimating clock drift using worst-case drift models (conservatively assuming drift increases by 200 microseconds per second). As time passes without synchronization, $\\epsilon$ widens (e.g. from 7ms to 50ms, then 100ms). Because Spanner's Commit-Wait rule requires transactions to wait $2\\epsilon$ before committing, <strong>Spanner write latency increases proportionally</strong>. If $\\epsilon$ exceeds a safety threshold, Spanner safely halts writes rather than risking data corruption, preserving Safety over Liveness."
    },
    {
      qNum: "Q4",
      question: "In a system design interview, when should you recommend Vector Clocks vs. CRDTs vs. a Centralized Sequencer (e.g. Snowflake / Raft)?",
      answer: "Use this decision framework: (1) <strong>Centralized Sequencer (Snowflake / Raft / ZooKeeper)</strong>: Choose when the system has a single region or can tolerate cross-region WAN consensus round trips for an absolute monotonic ID (e.g. distributed financial ledger, global ticket order). (2) <strong>Vector Clocks</strong>: Choose when multiple nodes accept offline concurrent writes in an AP/Dynamo-style architecture and the business domain requires manual human or application-level conflict resolution (e.g. Git branches, concurrent document revisions). (3) <strong>CRDTs (Conflict-free Replicated Data Types)</strong>: Choose when multi-master concurrent writes must resolve automatically without user intervention or distributed locks (e.g. collaborative live docs, shopping cart item sets, like-counters, collaborative Whiteboards)."
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 106: PART 10 BANNER & DISTRIBUTED TIME FOUNDATIONS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- PART 10 Header Banner -->
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] p-6 text-white shadow-xl shadow-indigo-950/50 flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-extrabold uppercase tracking-widest text-indigo-200">
              PART 10 · DISTRIBUTED SYSTEMS FUNDAMENTALS
            </span>
          </div>
          <h1 class="font-sans text-[24px] sm:text-[28px] font-black tracking-tight text-white leading-tight">
            Distributed Time, Causality & Event Ordering
          </h1>
          <p class="text-[13.5px] text-indigo-100/90 font-sans max-w-3xl leading-relaxed">
            The Physics of Network Asymmetry, Clock Drift, Logical Clocks, Vector Clocks & Google Spanner TrueTime
          </p>
        </div>

        <!-- Section Title: 10.2 Distributed Time and Ordering -->
        <div class="flex flex-col gap-2 pt-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-snug">
              10.2 Distributed Time and Ordering
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Why Wall-Clock Timestamps Cannot Be Trusted to Order Events in Distributed Systems
          </p>
        </div>

        <!-- Core What & Why Definition Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-cyan-400">
              <span class="material-symbols-outlined text-[20px]">help_outline</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHAT IT IS</span>
            </div>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              Mechanisms and mathematical invariants used to establish a consistent, causal, or total ordering of events across independent computers that communicate solely by passing messages over asynchronous, latency-variable networks.
            </p>
          </div>

          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-indigo-400">
              <span class="material-symbols-outlined text-[20px]">lightbulb</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHY IT MATTERS</span>
            </div>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              On a single computer, the CPU clock provides an absolute linear order. In a distributed system, physical quartz clocks drift, NTP adjustments jump unpredictably, and network message delays are asymmetric. Ordering by wall-clock time causes silent data loss, corrupts transactions, and breaks database replication.
            </p>
          </div>
        </div>

        <!-- THE PHYSICAL CLOCK FAILURE MODES (3 Column Cards) -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">warning</span>
              THE THREE HARDWARE & PROTOCOL REALITIES THAT BREAK WALL-CLOCKS
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${failureScenarios.map(item => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2.5">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-${item.color}-400 text-[20px]">${item.icon}</span>
                  <h4 class="font-sans text-[14px] font-bold text-white">${item.title}</h4>
                </div>
                <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans flex-1">
                  ${item.description}
                </p>
                <div class="pt-2 border-t border-[#24314A]/70 text-[11.5px] font-sans text-rose-300">
                  <strong>Blast Radius:</strong> ${item.impact}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- THE CAUSALITY PARADOX & DIAGRAM -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-6 flex flex-col gap-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">timeline</span>
              THE CAUSALITY PARADOX: HOW DRIFT INVERTS REALITY
            </span>
            <span class="text-[10.5px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              Leslie Lamport (1978)
            </span>
          </div>

          <div class="font-code text-[12px] sm:text-[13px] leading-relaxed text-slate-300 bg-[#070B14] p-4 rounded-lg border border-[#1E293B] overflow-x-auto">
            <div class="text-indigo-400 font-bold mb-2">// PHYSICAL TIME ANOMALY: Causality Violation (Clock(B) &lt; Clock(A))</div>
Node A (Fast Clock +50ms):  [12:00:00.100] User A posts: "Alice deposits $100" ──(Message)──►
                                                                                             │
Node B (Slow Clock -50ms):                                                  ◄────────────────┘
                            [12:00:00.080] User B reads post & responds: "Bob claims $100"

<span class="text-rose-400 font-bold">THE RESULT:</span> When sorted by Wall-Clock timestamp:
  1. [12:00:00.080] "Bob claims $100"   <span class="text-rose-400 font-bold">&lt;-- EFFECT APPEARS BEFORE CAUSE!</span>
  2. [12:00:00.100] "Alice deposits $100"

<span class="text-amber-300">CONCLUSION:</span> If an account balance check runs using timestamps, Bob's claim is rejected
            because the deposit appears to happen 20ms *in the future*!
          </div>

          <p class="text-[13px] text-slate-300 font-sans leading-relaxed">
            In physical reality, <em>User A deposited money before User B claimed it</em> ($A \to B$). But because Node B's clock was drifted behind Node A's clock, the database recorded Bob's event with an earlier timestamp. In an asynchronous distributed system, <strong>happened-before causality ($A \to B$) cannot be established by physical wall clocks</strong>.
          </p>
        </div>

        <!-- Official Page 106 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 106</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 107: LOGICAL CLOCKS, VECTOR CLOCKS & ALGORITHMIC RULES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Section Subtitle -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              MATHEMATICAL CAUSALITY IN DISTRIBUTED SYSTEMS
            </span>
          </div>
          <h3 class="font-sans text-[20px] sm:text-[23px] font-bold text-white tracking-tight">
            Lamport Timestamps vs. Vector Clocks
          </h3>
          <p class="text-[13.5px] text-slate-400 font-sans">
            How to establish causal order and detect concurrent branching without physical clocks
          </p>
        </div>

        <!-- 2 Column Algorithm Breakdown: Lamport vs Vector -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <!-- Card 1: Lamport Timestamps -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[15px] font-bold text-amber-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">tag</span>
                Lamport Timestamps (Total Order)
              </span>
              <span class="text-[10px] font-code text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Scalar Clock
              </span>
            </div>

            <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
              Each node maintains a single monotonically increasing integer counter $L$. Every message piggybacks the sender's current counter.
            </p>

            <div class="bg-[#0B1120] p-3.5 rounded-lg border border-[#1E293B] font-code text-[11.5px] text-slate-300 flex flex-col gap-1.5">
              <div class="text-indigo-400 font-bold">// Lamport Update Algorithm:</div>
              <div>1. Local event on Node i:  <span class="text-emerald-400">L_i = L_i + 1</span></div>
              <div>2. Send message:          attach <span class="text-amber-300">L_i</span> to payload</div>
              <div>3. Receive message (L_msg): <span class="text-cyan-400">L_i = max(L_i, L_msg) + 1</span></div>
              <div>4. Tie-breaking total order: <span class="text-purple-300">(L, NodeID)</span> tuple</div>
            </div>

            <div class="bg-[#1C1826] border-l-4 border-amber-500 p-3 rounded-r-lg text-[12px] font-sans text-amber-200">
              <strong>The Crucial Flaw:</strong> If $A \to B$, then $L(A) &lt; L(B)$. <em>However, the converse is NOT true!</em> If $L(A) &lt; L(B)$, you cannot know whether $A \to B$ or if $A$ and $B$ were completely independent concurrent events. Lamport clocks cannot detect concurrency!
            </div>
          </div>

          <!-- Card 2: Vector Clocks -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="font-sans text-[15px] font-bold text-cyan-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">view_column</span>
                Vector Clocks (Concurrency Detection)
              </span>
              <span class="text-[10px] font-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Vector Array V[1..N]
              </span>
            </div>

            <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
              Every node maintains a vector of integers $V$ of size $N$ (one slot per cluster node). Captures the causal history of the entire cluster.
            </p>

            <div class="bg-[#0B1120] p-3.5 rounded-lg border border-[#1E293B] font-code text-[11.5px] text-slate-300 flex flex-col gap-1.5">
              <div class="text-indigo-400 font-bold">// Vector Clock Update Algorithm:</div>
              <div>1. Local event on Node i:  <span class="text-emerald-400">V_i[i] = V_i[i] + 1</span></div>
              <div>2. Send message:          attach full vector <span class="text-cyan-300">V_i</span></div>
              <div>3. Receive vector (V_msg):  <span class="text-amber-300">V_i[k] = max(V_i[k], V_msg[k])</span> for all k</div>
              <div>4. Then increment own slot: <span class="text-emerald-400">V_i[i] = V_i[i] + 1</span></div>
            </div>

            <div class="bg-[#0D2428] border-l-4 border-cyan-500 p-3 rounded-r-lg text-[12px] font-sans text-cyan-200">
              <strong>The Superpower:</strong> Detects true concurrency!
              <br/>• $V_A \le V_B$ if $V_A[k] \le V_B[k]$ for all $k$ ($A$ happened before $B$).
              <br/>• If $V_A \not\le V_B$ and $V_B \not\le V_A$, then <strong>$A \parallel B$ (Concurrent Sibling Conflict)</strong>. The system flags a merge conflict (e.g. Amazon shopping cart sibling resolution).
            </div>
          </div>

        </div>

        <!-- VECTOR CLOCK SIBLINGS WORKED EXAMPLE -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">call_split</span>
            WORKED TRACE: HOW VECTOR CLOCKS DETECT CONFLICTS (AMAZON DYNAMO CART)
          </span>

          <div class="font-code text-[12px] leading-relaxed text-slate-300 bg-[#070B14] p-4 rounded-lg border border-[#1E293B] overflow-x-auto">
Initial State: Empty Cart. Vector V = {NodeA: 0, NodeB: 0}

1. Client 1 adds "Book" via Node A:
   Node A increments its slot: V = {A: 1, B: 0}, Cart = ["Book"]

2. Network Partition splits Node A and Node B:
   • Client 1 adds "Kindle" via Node A:
     Node A increments: <span class="text-cyan-300">V_1 = {A: 2, B: 0}</span>, Cart = ["Book", "Kindle"]
   • Client 2 concurrently adds "Headphones" via Node B (which had V = {A: 1, B: 0}):
     Node B increments: <span class="text-amber-300">V_2 = {A: 1, B: 1}</span>, Cart = ["Book", "Headphones"]

3. Network Partition heals. Client opens checkout and reads both nodes:
   Compare V_1 {A: 2, B: 0} vs V_2 {A: 1, B: 1}:
   - Does V_1 dominate V_2? No (V_1[B]=0 &lt; V_2[B]=1)
   - Does V_2 dominate V_1? No (V_2[A]=1 &lt; V_1[A]=2)
   <span class="text-rose-400 font-bold">==&gt; CONCURRENCY DETECTED (V_1 || V_2)!</span> Neither write is discarded.

4. Domain Resolution:
   Dynamo surfaces both siblings to the client application, which performs a UNION merge:
   Merged Cart = ["Book", "Kindle", "Headphones"], New Vector = <span class="text-emerald-400">{A: 2, B: 1}</span>
          </div>
        </div>

        <!-- GOOGLE SPANNER TRUETIME DEEP DIVE -->
        <div class="bg-[#141C2E] border-l-4 border-purple-500 rounded-r-xl p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-400 text-[20px]">timer</span>
              <span class="font-code text-[12px] font-bold text-purple-300 uppercase tracking-wider">
                GOOGLE SPANNER TRUETIME: HARNESSING HARDWARE TO SOLVE TIME
              </span>
            </div>
            <span class="text-[10px] font-code text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Corbett et al., OSDI 2012
            </span>
          </div>

          <p class="text-[13px] text-slate-300 font-sans leading-relaxed">
            Google Spanner took a radically different path: instead of abandoning physical time, Google installed GPS receivers and Rubidium atomic clocks directly into every datacenter. TrueTime does <em>not</em> eliminate clock drift—it exposes clock uncertainty explicitly as an API.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px] font-sans">
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-bold text-cyan-300 font-code text-[11px] uppercase tracking-wider">
                1. The TrueTime API: TT.now()
              </span>
              <p class="text-slate-300 leading-normal">
                Calling <code>TT.now()</code> returns a bounded uncertainty interval $[t_{earliest}, t_{latest}]$ where $t_{latest} - t_{earliest} = 2\epsilon$. The true absolute GPS/atomic time is guaranteed to lie within this window. Under normal operations, $\epsilon \approx 1\text{ms} - 7\text{ms}$.
              </p>
            </div>

            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-bold text-emerald-300 font-code text-[11px] uppercase tracking-wider">
                2. The Commit-Wait Rule ($2\epsilon$)
              </span>
              <p class="text-slate-300 leading-normal">
                When transaction $T_1$ commits at timestamp $s = t_{latest}$, the leader <strong>intentionally sleeps for $2\epsilon$</strong> before releasing write locks. By the time locks are released, the current earliest time anywhere on Earth is guaranteed to be $&gt; s$. Any subsequent transaction $T_2$ is guaranteed to receive a timestamp $s_2 &gt; s_1$, achieving strict global linearizability without read locks!
              </p>
            </div>
          </div>
        </div>

        <!-- Official Page 107 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 107</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 108: COMPARISON TABLE, CRDTS & SENIOR PERSPECTIVE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Section Subtitle -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              ORDERING MECHANISMS COMPARATIVE MATRIX
            </span>
          </div>
          <h3 class="font-sans text-[20px] sm:text-[23px] font-bold text-white tracking-tight">
            Comparison of Distributed Time & Ordering Solutions
          </h3>
        </div>

        <!-- Comprehensive Multi-Dimensional Matrix Table -->
        <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
          <table class="w-full text-left text-[12px] font-sans border-collapse">
            <thead>
              <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                <th class="p-3.5 font-bold">Mechanism</th>
                <th class="p-3.5 font-bold">Ordering Guarantee</th>
                <th class="p-3.5 font-bold">Concurrency Detection</th>
                <th class="p-3.5 font-bold">Hardware Cost</th>
                <th class="p-3.5 font-bold">Production Systems</th>
                <th class="p-3.5 font-bold">Architectural Verdict</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E293B] text-slate-300">
              ${clockMechanisms.map(m => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3.5 font-bold text-white font-code text-[11.5px]">${m.name}</td>
                  <td class="p-3.5">${m.ordering}</td>
                  <td class="p-3.5">${m.concurrency}</td>
                  <td class="p-3.5 text-slate-400">${m.hardware}</td>
                  <td class="p-3.5 font-code text-cyan-300 text-[11px]">${m.systems}</td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded text-[10.5px] font-code border ${m.badgeColor}">
                      ${m.verdict}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE: CRDTs & COMMUTATIVE OPERATIONS -->
        <div class="bg-[#062419] border-l-4 border-[#10B981] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-emerald-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">psychology</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: THE BEST DISTRIBUTED SYSTEM DOES NOT NEED A CLOCK
            </span>
          </div>
          <p class="text-[13.5px] text-emerald-100 font-sans leading-relaxed">
            The strongest senior signal in a distributed systems interview is actively designing away the need for ordering. If two concurrent operations are <strong>Commutative ($A + B = B + A$)</strong>, <strong>Associative ($(A + B) + C = A + (B + C)$)</strong>, and <strong>Idempotent ($A + A = A$)</strong>, their final state is identical regardless of network delay, packet arrival order, or machine clock drift.
          </p>
          <p class="text-[13.5px] text-emerald-100/90 font-sans leading-relaxed">
            This is the foundation of <strong>CRDTs (Conflict-free Replicated Data Types)</strong> used by Figma (multiplayer canvas), Apple Notes, and Redis Enterprise. Instead of paying the round-trip latency of consensus or vector clock pruning, design state mutations as grow-only sets (G-Set) or positive-negative counters (PN-Counter). Only reach for TrueTime or Raft when absolute global linearizability is a non-negotiable business invariant.
          </p>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box (Q1–Q4) -->
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
            Wall-clock time is not an ordering mechanism. Prefer designs that need no global order (commutative operations, CRDTs). When order is required, name the mechanism and its cost: Lamport timestamps for total order without concurrency, Vector Clocks for sibling tracking, Hybrid Logical Clocks for distributed SQL, and TrueTime when you have the hardware to enforce external consistency.
          </p>
        </div>

        <!-- Official Page 108 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 108</span>
        </div>

      </div>

    </div>
  `;
}
