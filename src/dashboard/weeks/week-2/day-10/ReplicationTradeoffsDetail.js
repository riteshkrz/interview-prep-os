/**
 * 4.5 The Latency / Consistency Trade-off in Replication - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 54, 55, and 56
 * from The Modern System Design Interview Guide.
 */

export function renderReplicationTradeoffsContent(topic) {
  const replicationModes = [
    {
      mode: "Synchronous Replication",
      latency: "High (Tied to slowest replica)",
      durability: "Zero Loss (RPO = 0)",
      durabilityClass: "text-emerald-400 font-bold",
      availability: "Low (1 lagging/dead node blocks all writes)",
      availabilityClass: "text-rose-400",
      bestFor: "Core banking ledgers, mission-critical ERP, Spanner Paxos groups"
    },
    {
      mode: "Asynchronous Replication",
      latency: "Ultra-Low (< 1 ms local write)",
      durability: "Data Loss Window (RPO > 0 on crash)",
      durabilityClass: "text-rose-400 font-bold",
      availability: "Maximum (Replicas can lag or die with zero write impact)",
      availabilityClass: "text-emerald-400",
      bestFor: "High-throughput analytics, social media feeds, cross-region read replicas"
    },
    {
      mode: "Semi-Synchronous (Quorum)",
      latency: "Moderate (Tied to fastest k nodes)",
      durability: "Zero Loss (RPO = 0 on leader failure)",
      durabilityClass: "text-emerald-400 font-bold",
      availability: "High (Tolerates minority replica failure)",
      availabilityClass: "text-emerald-400",
      bestFor: "Modern cloud production standard (MySQL semi-sync, Aurora, Kafka min.insync)"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you guarantee 'Read-Your-Own-Writes' consistency for an end user when read traffic is distributed across asynchronous read replicas?",
      answer: `When Alice submits a comment, the write goes to the Primary database. When her browser re-renders, the read query hits a replica that is 200ms behind due to replication lag $\to$ her comment is missing, causing her to submit duplicate comments in confusion.
      <br/><br/>
      <strong class="text-indigo-400">Three Production Solutions:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Sticky Session to Primary:</strong> Record the timestamp of Alice's latest write in her session cookie or Redis session store. For the next 5 seconds, route all read requests from Alice directly to the Primary database, bypassing replicas.</li>
        <li><strong>Optimistic Client Update:</strong> Return the created/updated record directly in the HTTP write response (<code>201 Created</code> with payload), so the frontend updates in memory without immediately re-querying the database.</li>
        <li><strong>LSN / GTID Position Checking:</strong> Return the transaction commit Log Sequence Number (LSN) to the client. When querying a replica, pass <code>min_lsn</code>; if the replica has not yet applied that LSN, it either waits or transparently forwards the query to the primary.</li>
      </ol>`
    },
    {
      qNum: "Q2",
      question: "What is the exact mechanical difference between Recovery Point Objective (RPO) and Recovery Time Objective (RTO)?",
      answer: `These are the two fundamental metrics of disaster recovery and high availability:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>RPO (Recovery Point Objective):</strong> The maximum acceptable volume of <em>data loss</em> measured in time. If a database leader crashes at 12:00:00 and failover recovers data up to 11:59:55, your data loss is 5 seconds. In synchronous replication, RPO = 0 (zero data loss). In async replication, RPO equals the replication lag at the moment of crash.</li>
        <li><strong>RTO (Recovery Time Objective):</strong> The maximum acceptable duration of <em>downtime</em> before the system becomes available again. If the failover script detects the dead leader, elects a new leader, promotes it, updates DNS, and resumes accepting traffic within 30 seconds, your RTO is 30 seconds.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "Why does adding 10 read replicas fail to increase the database's write capacity? (The classic scaling screening trap)",
      answer: `Read replicas scale <strong>read query throughput only</strong>. They do <em>zero</em> to increase write capacity because of replication topology mechanics:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Every single write still enters through the <strong>single Primary database leader</strong>.</li>
        <li>Every read replica must execute <strong>100% of the leader's write log</strong> to stay synchronized.</li>
        <li>In fact, adding too many replicas can <em>degrade</em> write performance: the primary must spend CPU and network bandwidth fanning out the replication stream to 10 separate TCP sockets, exacerbating leader CPU saturation.</li>
      </ul>
      To scale write capacity, you must implement <strong>Database Sharding (Horizontal Partitioning)</strong> or migrate to Distributed Multi-Leader / NewSQL engines.`
    },
    {
      qNum: "Q4",
      question: "How does Semi-Synchronous replication achieve zero data loss (RPO = 0) without suffering from the slowest-replica tail latency bottleneck?",
      answer: `In pure <strong>Synchronous Replication</strong> with 3 replicas, if Replica 3 experiences a garbage collection pause or network packet drop, the primary blocks the client until Replica 3 responds—meaning your write latency is dictated by the <strong>worst p99 tail latency</strong> of your slowest node.
      <br/><br/>
      In <strong>Semi-Synchronous Replication</strong> (e.g. MySQL Semi-Sync or Apache Kafka with <code>acks=all</code> and <code>min.insync.replicas=2</code>):
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>The primary sends the write log to all 3 replicas in parallel.</li>
        <li>As soon as the <strong>fastest single replica</strong> writes to its relay log and ACKs, the primary immediately commits and returns success to the client.</li>
        <li>Even if Replica 3 is completely dead, write throughput continues at full speed. And if the primary suddenly crashes, at least one survivor replica holds the committed write, guaranteeing $RPO = 0$.</li>
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
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Database replication serves two indispensable architectural functions: <strong class="text-indigo-400">High Availability</strong> (automatic failover when the primary leader dies) and <strong class="text-cyan-400">Read Scalability</strong> (distributing analytical and read traffic across multiple nodes). The foundational tradeoff centers on write confirmation timing: <em>Do you respond to the client immediately, or wait until data has physically propagated across multiple machines?</em>
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">1. Synchronous Replication</span>
              <span class="text-[12px] text-slate-300">Primary writes, forwards to all replicas, waits for all ACKs. Guarantees RPO = 0 (zero data loss), but write latency equals the slowest node.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. Asynchronous Replication</span>
              <span class="text-[12px] text-slate-300">Primary writes locally and ACKs client in &lt;1ms. Forwards updates in background. Fast and resilient, but primary crash risks data loss (RPO &gt; 0).</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">3. Semi-Synchronous (Quorum)</span>
              <span class="text-[12px] text-slate-300">Primary ACKs client as soon as at least k replicas persist to relay log. Prevents data loss without waiting for the slowest lagging replica.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Replication Modes Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              TOPOLOGY WORKFLOWS: SYNCHRONOUS VS. ASYNCHRONOUS VS. SEMI-SYNCHRONOUS
            </span>
            <span class="text-slate-500 text-[10.5px]">Write Propagation Mechanics</span>
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
              SENIOR PERSPECTIVE: ELIMINATING REPLICATION LAG ANOMALIES
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, amateur candidates distribute all read traffic round-robin across read replicas without addressing <strong>Replication Lag</strong>. A user updates their profile, clicks save, page reloads, and they see their old profile because the replica is 300ms behind.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-sans pt-1">
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white block pb-0.5">1. Read-Your-Own-Writes Routing:</strong>
              Track the user's last write timestamp in a session cookie or Redis key. For 5 seconds following any write, pin that specific user's reads to the Primary database.
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white block pb-0.5">2. GTID / LSN Position Tracking:</strong>
              Return the commit Log Sequence Number (LSN) in the API response. When reading from a replica, verify the replica has caught up to that LSN before serving the query.
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: THE SPLIT-BRAIN CATASTROPHE & REPLICA WRITE FALLACY
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Remember two critical rules when pitching read replicas in system design interviews:
          </p>
          <div class="font-sans text-[12px] text-amber-200/90 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20 space-y-1.5 leading-relaxed">
            <div>• <strong class="text-amber-100">Read Replicas Never Scale Writes:</strong> Every replica applies 100% of the leader's write log. Adding 10 replicas increases leader network fan-out and replication lag. To scale writes, you must shard or partition.</div>
            <div>• <strong class="text-amber-100">Beware Split-Brain in Automatic Failover:</strong> If network hiccup disconnects the Primary from the Standby, the Standby promotes itself to Leader. If the old Primary recovers, both accept writes simultaneously! Always mandate consensus fencing tokens (Raft/Paxos) to instantly demote zombie primaries.</div>
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
            You cannot have a local-latency write and a globally consistent read of it. Pick per data flow using RPO/RTO language, and default to semi-synchronous within a region plus asynchronous across regions — that is what most production systems actually do.
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
