/**
 * 4.5 The Latency / Consistency Trade-off in Replication - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 54, 55, and 56
 * from The Modern System Design Interview Guide.
 */

export function renderReplicationTradeoffsContent(topic) {
  const replicationModes = [
    {
      mode: "Synchronous Replication",
      latency: "High (Tied to the slowest replica)",
      durability: "Zero Loss (RPO = 0)",
      durabilityClass: "text-emerald-400 font-bold",
      availability: "Low (1 slow or dead replica blocks all writes)",
      availabilityClass: "text-rose-400",
      bestFor: "Core banking ledgers, mission-critical transactions, Spanner Paxos groups"
    },
    {
      mode: "Asynchronous Replication",
      latency: "Ultra-Low (<1ms local write confirmation)",
      durability: "Data Loss Window (RPO > 0 on crash)",
      durabilityClass: "text-rose-400 font-bold",
      availability: "Maximum (Replicas can lag or crash without blocking writes)",
      availabilityClass: "text-emerald-400",
      bestFor: "High-throughput analytics, social media feeds, cross-region read replicas"
    },
    {
      mode: "Semi-Synchronous (Quorum)",
      latency: "Moderate (Tied to fastest k nodes)",
      durability: "Zero Loss (RPO = 0 on leader failure)",
      durabilityClass: "text-emerald-400 font-bold",
      availability: "High (Tolerates minority replica slowdowns)",
      availabilityClass: "text-emerald-400",
      bestFor: "Modern cloud production standard (MySQL semi-sync, Aurora, Kafka min.insync)"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you guarantee 'Read-Your-Own-Writes' consistency when reading from asynchronous read replicas?",
      answer: `When a user posts a comment, the write goes to the Primary database. When their page immediately reloads, the read query hits a replica that is 200ms behind. The user's comment is missing, so they submit the exact same comment again in frustration!
      <br/><br/>
      <strong class="text-indigo-400">Three Production Solutions:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Sticky Session Routing to Primary:</strong> When the user submits a mutation, save a timestamp in their session cookie (<code>last_write_at=timestamp</code>). For the next <strong>5 seconds</strong>, route that specific user's reads to the Primary database. All other users continue reading from replicas.</li>
        <li><strong>Optimistic UI Updates:</strong> Return the created record directly in the HTTP <code>201 Created</code> response body so the frontend updates its state in memory without re-querying the database immediately.</li>
        <li><strong>LSN / GTID Position Verification:</strong> Return the transaction commit log number (LSN) in the HTTP header. When querying a replica, if the replica hasn't reached that LSN yet, the database router automatically redirects the query to the primary.</li>
      </ol>`
    },
    {
      qNum: "Q2",
      question: "What is the exact difference between RPO and RTO in disaster recovery?",
      answer: `These two metrics define how much disaster your business can tolerate:
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <div class="bg-[#050811] p-3 rounded border border-slate-800">
          <strong class="text-rose-400 block font-code text-[12px] mb-1">RPO (Recovery Point Objective): Data Loss</strong>
          <p class="text-[12px] text-slate-300 leading-relaxed">
            The maximum acceptable amount of data loss measured in time. If your primary crashes at 12:00:00 and your promoted backup only has data up to 11:59:50, you lost 10 seconds of data. In synchronous replication, RPO is 0. In async replication, RPO equals your replication lag.
          </p>
        </div>
        <div class="bg-[#050811] p-3 rounded border border-slate-800">
          <strong class="text-amber-400 block font-code text-[12px] mb-1">RTO (Recovery Time Objective): Downtime</strong>
          <p class="text-[12px] text-slate-300 leading-relaxed">
            The maximum acceptable duration of downtime. If the database crashes, how many seconds or minutes does it take for your automated failover to detect the failure, elect a new leader, update DNS, and resume accepting traffic?
          </p>
        </div>
      </div>`
    },
    {
      qNum: "Q3",
      question: "Why does adding 10 read replicas fail to increase database write capacity?",
      answer: `Read replicas scale <strong>read query throughput only</strong>. They do <em>zero</em> to increase write capacity because of replication topology mechanics:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Every single write still enters through the single Primary database leader.</li>
        <li>Every read replica must execute <strong>100% of the leader's write log</strong> to stay synchronized.</li>
        <li>In fact, adding too many replicas can <em>degrade</em> write performance: the primary must spend CPU and network bandwidth fanning out the replication stream to 10 separate TCP sockets.</li>
      </ul>
      To scale write capacity, you must implement <strong>Database Sharding</strong> or migrate to a distributed multi-leader / NewSQL engine.`
    },
    {
      qNum: "Q4",
      question: "How does Semi-Synchronous replication achieve zero data loss (RPO = 0) without suffering from the slowest replica?",
      answer: `In pure <strong>Synchronous Replication</strong> with 3 replicas, if Replica 3 experiences a network spike or garbage collection freeze, the primary blocks the client until Replica 3 responds—meaning your write latency is dictated by the <strong>slowest node</strong> in the cluster.
      <br/><br/>
      In <strong>Semi-Synchronous Replication</strong> (e.g. MySQL Semi-Sync or Kafka with <code>min.insync.replicas=2</code>):
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>The primary sends the write log to all 3 replicas in parallel.</li>
        <li>As soon as the <strong>fastest single replica</strong> writes to its relay log and ACKs, the primary immediately commits and returns success to the client.</li>
        <li>Even if Replica 3 is completely dead, write throughput continues at full speed. And if the primary suddenly dies, at least one survivor replica holds the committed write, guaranteeing $RPO = 0$.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 54, 55, 56: REPLICATION LATENCY VS CONSISTENCY TRADEOFF -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.4 The Latency / Consistency Trade-off in Replication
            </h2>
          </div>
          <p class="text-slate-400 text-[13px] font-sans">
            How write confirmation timing dictates the balance between zero data loss and blazing write speed.
          </p>
        </div>

        <!-- Everyday Mental Model Card -->
        <div class="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-400 text-[20px]">lightbulb</span>
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              EVERYDAY MENTAL MODEL: CERTIFIED MAIL VS. REGULAR POSTCARD
            </span>
          </div>
          <p class="text-slate-300 text-[13px] leading-relaxed font-sans">
            Imagine sending a critical contract to 3 business partners:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-indigo-500/20 flex flex-col gap-1.5">
              <strong class="text-indigo-300 text-[12px] font-code">Synchronous: Certified Mail</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                You refuse to do any other work until all 3 partners sign and return a physical receipt. Absolute guarantee that everyone has the contract ($RPO = 0$), but if one partner is on vacation, your entire business grinds to a halt!
              </p>
            </div>
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-cyan-500/20 flex flex-col gap-1.5">
              <strong class="text-cyan-300 text-[12px] font-code">Asynchronous: Drop a Postcard</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                You drop postcards in the mailbox and immediately get back to work. Zero waiting, maximum productivity! But if the post office burns down before delivery, the message is permanently lost.
              </p>
            </div>
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-emerald-500/20 flex flex-col gap-1.5">
              <strong class="text-emerald-300 text-[12px] font-code">Semi-Sync: Fast Messenger</strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                You send couriers to all 3 partners. As soon as the fastest courier texts back <em>"Delivered to partner #1"</em>, you proceed. You don't wait for the slowest partner, but you know at least one backup copy exists!
              </p>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Replication Modes Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              WRITE CONFIRMATION MECHANICS: THREE REPLICATION MODES
            </span>
            <span class="text-slate-500 text-[10.5px]">Compare Data Flows</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. SYNCHRONOUS: Client ──write──► [Primary] ──replicate──► [Replica 1] (ACK)          │
│                                       │                   [Replica 2] (SLOW! Stalls!)  │
│                                       ▼                                                │
│                 Client ◄──ACK (Blocked until Replica 2 finally responds!)              │
│                 Tradeoff: Zero data loss (RPO=0), but high latency + fragile uptime!   │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. ASYNCHRONOUS: Client ──write──► [Primary] ──ACK immediately to client in &lt;1ms!     │
│                                       │                                                │
│                                       ├──async replication stream──► [Replica 1]       │
│                                       └──async replication stream──► [Replica 2]       │
│                 Tradeoff: Blazing fast writes, but Primary crash loses recent writes!  │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. SEMI-SYNCHRONOUS: Client ──write──► [Primary]                                       │
│                                           ├──replicate──► [Replica 1] ──ACK! (Fast)    │
│                                           └──replicate──► [Replica 2] (Slow network)   │
│                                           │                                            │
│                      Client ◄──ACK (Primary returns as soon as Replica 1 confirms!)    │
│                 Tradeoff: Zero data loss on primary crash; decouples slow replicas!    │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Comparison Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              REPLICATION MODES COMPARISON MATRIX
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse text-[12px] font-sans">
              <thead>
                <tr class="bg-[#162032] text-slate-300 font-code text-[11px] border-b border-[#24314A]">
                  <th class="p-3.5 font-semibold text-white">Replication Mode</th>
                  <th class="p-3.5 font-semibold text-slate-300">Write Latency</th>
                  <th class="p-3.5 font-semibold text-slate-300">Durability (RPO)</th>
                  <th class="p-3.5 font-semibold text-slate-300">Write Availability</th>
                  <th class="p-3.5 font-semibold text-indigo-300">Best Fit In Production</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0F172A]">
                ${replicationModes.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#111B2E]/50' : 'bg-transparent'} hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-code text-white font-semibold whitespace-nowrap">${row.mode}</td>
                    <td class="p-3.5 text-slate-300">${row.latency}</td>
                    <td class="p-3.5 font-code ${row.durabilityClass}">${row.durability}</td>
                    <td class="p-3.5 text-slate-300">${row.availability}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed text-[11.5px]">${row.bestFor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR ARCHITECTURE: HYBRID REPLICATION PATTERN
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In global production architectures, top tech companies use a <strong>hybrid replication model</strong>:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-sans pt-1">
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white block pb-0.5">1. Intra-Region (Semi-Synchronous):</strong>
              Within the primary data center or cloud region (e.g. AWS us-east-1 across 3 Availability Zones), use <strong>semi-synchronous replication</strong> with a quorum of 1. Latency is &lt;2ms, ensuring zero data loss ($RPO = 0$) if a single zone loses power.
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white block pb-0.5">2. Cross-Region (Asynchronous):</strong>
              Across distant global regions (e.g. us-east-1 to eu-central-1), use <strong>asynchronous replication</strong>. Local users experience sub-millisecond write responses without waiting for 100ms transatlantic fiber hops.
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: THE SPLIT-BRAIN CATASTROPHE IN FAILOVER
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            When automating database failover, beware the <strong>Split-Brain Disaster</strong>:
          </p>
          <div class="font-sans text-[12px] text-amber-200/90 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20 space-y-1.5 leading-relaxed">
            <p>
              If a temporary network glitch disconnects the Primary from its Replicas, an automated monitoring tool might conclude the Primary is dead and promote Replica 1 to be the new Primary.
            </p>
            <p>
              If the old Primary was actually still alive and serving clients, you now have <strong>two active leaders accepting writes simultaneously!</strong> Later, when the network heals, merging the divergent databases requires painful manual data surgery. Always require <strong>consensus quorum (Raft/Paxos)</strong> and automated node isolation (STONITH / fencing tokens) before promoting a new leader.
            </p>
          </div>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU
          </span>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            You are designing the database architecture for a global payments app like Wise. Users in Singapore, London, and New York must transfer funds with strict zero data loss (RPO = 0), but WAN latency between Singapore and New York is 220ms. How do you combine intra-region semi-synchronous replication with cross-region asynchronous replication without slowing down local checkouts?
          </p>
        </div>

        <!-- Interview Follow-ups: Q1 - Q4 -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#818CF8] text-[18px]">quiz</span>
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
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
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
            You cannot achieve local sub-millisecond writes and global instant consistency simultaneously. Frame the choice around business RPO and RTO metrics. In production, default to semi-synchronous replication locally within the region to prevent data loss, paired with asynchronous replication globally to keep user latency fast.
          </p>
        </div>

        <!-- Page 56 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 56</span>
        </div>

      </div>

    </div>
  `;
}
