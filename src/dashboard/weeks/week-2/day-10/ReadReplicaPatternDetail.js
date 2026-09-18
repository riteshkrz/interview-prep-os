/**
 * 4.5 The Read-Replica Pattern & Replication Lag - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 57 and 58
 * from The Modern System Design Interview Guide.
 */

export function renderReadReplicaPatternContent(topic) {
  const lagMitigationStrategies = [
    {
      strategy: "1. Sticky Session to Primary",
      mechanism: "Route recently-mutated users to Primary for 5–10 seconds via session cookie timestamp.",
      consistency: "Guaranteed Read-Your-Own-Writes",
      tradeoff: "Slightly higher primary read load during high write bursts, but protects 95% of reads.",
      tradeoffClass: "text-amber-400"
    },
    {
      strategy: "2. Optimistic Client Updates",
      mechanism: "Return mutated entity payload in HTTP 201/200 write response; update local UI state immediately.",
      consistency: "Apparent Instant Consistency",
      tradeoff: "Fails if user refreshes page or opens a second device before replica catches up.",
      tradeoffClass: "text-amber-400"
    },
    {
      strategy: "3. GTID / LSN Position Matching",
      mechanism: "Primary returns commit LSN/GTID in HTTP header; client sends it to replica router to wait or route to primary.",
      consistency: "Monotonic Reads & Read-Your-Own-Writes",
      tradeoff: "Increases query latency on replicas if replica must wait for log replay before answering.",
      tradeoffClass: "text-rose-400 font-bold"
    },
    {
      strategy: "4. Dynamic Lag Ejection",
      mechanism: "Health monitor polls pg_stat_replication or Seconds_Behind_Master; ejects replicas with lag > 500ms.",
      consistency: "Bounded Bounded-Staleness",
      tradeoff: "Risk of cascading overload if high lag causes all replicas to be ejected simultaneously.",
      tradeoffClass: "text-rose-400 font-bold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you guarantee 'Read-Your-Own-Writes' for a mutating user without routing all read traffic to the Primary database?",
      answer: `In a naive implementation, routing all user reads to read replicas results in immediate user complaints: a user updates their profile or posts a comment, refreshes the page, and the change is missing because the replica is 250ms behind.
      <br/><br/>
      <strong class="text-indigo-400">The Senior Architecture: Sticky Write-Window Routing</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Cookie / Token Tracking:</strong> When a user issues a mutating write (<code>POST</code>, <code>PUT</code>, <code>DELETE</code>), the API Gateway injects an encrypted timestamp cookie: <code>last_write_at=1710765430</code>.</li>
        <li><strong>Gateway Read Routing:</strong> On subsequent <code>GET</code> requests, if <code>currentTime - last_write_at &lt; 5 seconds</code> (the configured SLA window for replication), route the read directly to the Primary database.</li>
        <li><strong>Replica Offloading for Others:</strong> All anonymous users and users who have not written in the last 5 seconds are routed to the read replica pool. This preserves 90–95% of replica read offloading while guaranteeing absolute consistency for the actor who made the change.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What happens when the Primary crashes? How do production systems handle failover without split-brain?",
      answer: `When the Primary fails, an automated orchestration system (e.g. GitHub's <em>Orchestrator</em>, Postgres <em>Patroni</em> with Etcd consensus, or AWS Aurora storage quorum) must promote a replica.
      <br/><br/>
      <strong class="text-indigo-400">The Failover Protocol:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Consensus Leader Check:</strong> Health probes across multiple availability zones confirm the Primary is dead (not just an isolated network hiccup).</li>
        <li><strong>Select Most Advanced Replica:</strong> Inspect all replicas' current log position (LSN in Postgres, GTID in MySQL). Select the replica with the smallest replication lag (highest LSN) to minimize $RPO$.</li>
        <li><strong>Fencing / STONITH:</strong> Hard-isolate the old Primary (Shoot The Other Node In The Head via cloud API or power fence) to prevent it from ever accepting writes again if it revives.</li>
        <li><strong>Promotion & DNS/Proxy Repoint:</strong> Promote the chosen replica to Read-Write Primary, configure remaining replicas to follow the new leader, and update database proxies (ProxySQL, PgBouncer, Envoy) or DNS CNAME.</li>
      </ol>`
    },
    {
      qNum: "Q3",
      question: "Why do asynchronous read replicas have an RPO > 0? How can an engineer quantify the risk of data loss?",
      answer: `In asynchronous replication, the Primary commits a transaction locally to its disk and immediately sends a success ACK to the client. The write is placed in the replication log (binlog/WAL) to be pulled or pushed to replicas in the background.
      <br/><br/>
      If the Primary experiences a sudden catastrophic hardware crash (kernel panic, power outage, memory bus failure) before that log entry reaches any replica:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>The committed transaction exists <em>only</em> on the dead primary's local SSD.</li>
        <li>When a replica is promoted to new Primary, that transaction is completely missing.</li>
        <li>$RPO$ (Recovery Point Objective) equals the exact duration of replication lag at the millisecond of crash (typically 50ms to 2 seconds).</li>
        <li>If $RPO = 0$ is a strict compliance requirement (e.g., banking ledgers), you must use <strong>Semi-Synchronous replication</strong> or a consensus-backed engine (Spanner/Raft) where writes are acked only after persisting to at least one remote replica.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "When is the exact threshold to transition from Read Replicas to Database Sharding?",
      answer: `Read replicas are the easiest horizontal scaling pattern, but they hit an inescapable physical ceiling. You must transition to database sharding when:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Write Throughput Ceiling:</strong> The Primary reaches 80%+ write IOPS or CPU capacity. Because replicas must replay every write, adding replicas cannot alleviate write load.</li>
        <li><strong>Primary Replication Overhead:</strong> The Primary is spending excessive CPU and network bandwidth broadcasting binlogs to 10+ replicas (replication fanout tax).</li>
        <li><strong>Dataset Exceeds Single-Instance Storage:</strong> The table data and indexes exceed what can fit efficiently on a single database server (e.g. &gt; 5–10 TB), causing cache miss thrashing and slow maintenance operations (vacuum, backups, index builds).</li>
        <li><strong>Cross-Region Write Latency:</strong> Users worldwide require low-latency writes that cannot travel back to a single primary region.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 57, 58: THE READ-REPLICA PATTERN & REPLICATION LAG -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.5 The Read-Replica Pattern & Replication Lag
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            In modern web and mobile applications, traffic is overwhelmingly <strong class="text-cyan-400">read-heavy</strong> (typically a 10:1 to 100:1 read-to-write ratio). The <strong class="text-indigo-400">Read-Replica Pattern</strong> isolates write operations to a single authoritative Primary (Leader) node, while fanning out read queries across a fleet of Read Replicas (Followers). This scales read throughput horizontally and protects the primary from analytical query exhaustion.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">1. Write Authority</span>
              <span class="text-[12px] text-slate-300">All INSERT, UPDATE, DELETE traffic executes strictly on the Primary to maintain serialized ordering and ACID invariants.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. Horizontal Read Pool</span>
              <span class="text-[12px] text-slate-300">Add 2 to 10+ read-only replicas behind a load balancer (ProxySQL / PgBouncer) to absorb massive read spikes without sizing up the primary.</span>
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">3. The Lag Tax</span>
              <span class="text-[12px] text-slate-300">Asynchronous propagation introduces a time delay (&Delta;t). A read hitting a lagging replica can return stale data or missing rows.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Sequence Flow Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              READ-REPLICA ARCHITECTURE & THE REPLICATION LAG RACE CONDITION
            </span>
            <span class="text-slate-500 text-[10.5px]">Client Routing & Lag Anomaly</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. NORMAL WRITE & ASYNC REPLICATION FLOW                                                         │
│                                                                                                  │
│   Client App ──(1) Write: UPDATE profile SET name='Alice'──► [ PRIMARY DB ] (Commits instantly!) │
│                                                                    │                             │
│                                           ┌────────────────────────┼────────────────────────┐    │
│                                           │ (Async binlog/WAL)     │ (Async stream)         │    │
│                                           ▼                        ▼                        ▼    │
│                                    [ REPLICA 1 ]            [ REPLICA 2 ]            [ REPLICA 3 ]│
│                                    (Lag: 15ms)              (Lag: 450ms ⚠️)           (Lag: 20ms) │
│                                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. THE REPLICATION LAG ANOMALY (Lost Update Illusion)                                            │
│                                                                                                  │
│   Client Browser                                           Database Router       Replica 2       │
│         │                                                         │                  │           │
│         ├─── (1) POST /profile (name='Alice') ───────────────────►│──► [Primary]     │           │
│         │◄── (2) HTTP 200 OK (Write committed!) ─────────────────┤                  │           │
│         │                                                         │                  │           │
│         ├─── (3) Immediate Refresh: GET /profile ────────────────►│ (Random replica) │           │
│         │                                                         ├──► Routed to ───►│ (Behind!) │
│         │◄── (4) HTTP 200 OK (name='Bob' ❌ Old data returned!) ──┴──────────────────┤           │
│                                                                                                  │
│   Result: User sees their own update disappear! They submit multiple duplicate writes in panic!  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: Handling Replication Lag -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Production Strategies for Mitigating Replication Lag
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Strategy</th>
                  <th class="p-3">Implementation Mechanism</th>
                  <th class="p-3">Consistency Guarantee</th>
                  <th class="p-3">Architectural Tradeoff</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${lagMitigationStrategies.map(s => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">${s.strategy}</td>
                    <td class="p-3 text-slate-300">${s.mechanism}</td>
                    <td class="p-3 text-emerald-400 font-medium whitespace-nowrap">${s.consistency}</td>
                    <td class="p-3 ${s.tradeoffClass}">${s.tradeoff}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-gradient-to-r from-[#064E3B]/40 to-[#022C22]/30 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">verified</span>
            SENIOR PERSPECTIVE: READ-YOUR-OWN-WRITES & REPLICA HEALTH DRAINING
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In high-throughput distributed systems, do not rely on hope for replication lag. Always architect an explicit <strong class="text-emerald-300">Read-Your-Own-Writes</strong> path. When a user submits a mutation, attach a <code>last_modified_timestamp</code> or session flag in Redis. For the next <strong>5 seconds</strong>, force that user's read requests to execute on the Primary. All other users (95%+ of traffic) continue reading from replicas, maintaining high offload efficiency while eliminating the phantom missing update anomaly.
            </p>
            <p>
              Additionally, implement <strong class="text-white">Active Replica Health Draining</strong>. In MySQL, continuously scrape <code>Seconds_Behind_Master</code> (or <code>pg_stat_replication</code> replay lag in PostgreSQL). If network congestion or long-running queries cause a replica's lag to exceed <strong>500ms</strong>, your load balancer (ProxySQL/Envoy) must automatically drain traffic from that replica. Never allow a severely lagging node to serve user-facing production traffic.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - WHAT READ REPLICAS DO NOT SOLVE -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            WHAT READ REPLICAS DO NOT SOLVE: WRITE SCALABILITY & FANOUT OVERHEAD
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              <strong class="text-white">Read Replicas NEVER scale write throughput.</strong> Every single replica in your cluster must execute and replay 100% of all write operations committed on the primary. If your application executes 5,000 writes per second, every replica is burning CPU and disk I/O executing those exact 5,000 writes.
            </p>
            <p>
              Furthermore, adding too many replicas creates a <strong class="text-amber-300">Primary Replication Fanout Tax</strong>: the Primary must maintain separate network sockets and compress/broadcast binary logs to each follower. When write throughput saturates your hardware, the only solutions are <strong>Write-Batching Queues</strong>, <strong>Vertical Scaling</strong>, or transitioning to <strong>Database Sharding</strong>.
            </p>
          </div>
        </div>

        <!-- Interview Follow-ups (Q1-Q4) -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Interview Follow-Up Questions (Technical Deep Dive)
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${interviewFollowUps.map(item => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 shrink-0">
                    ${item.qNum}
                  </span>
                  <h4 class="font-sans text-[13px] font-bold text-white leading-snug">
                    ${item.question}
                  </h4>
                </div>
                <div class="text-[12.5px] text-slate-300 font-sans leading-relaxed pt-1 border-t border-[#24314A]/60">
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
            Read replicas are the most cost-effective lever to scale reads, but replication lag is the inevitable price. In every interview, articulate an explicit Read-Your-Own-Writes strategy (sticky session routing for 5s post-mutation), emphasize that replicas never scale write throughput, and explain automated consensus failover with active lag draining.
          </p>
        </div>

        <!-- Page 58 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 58</span>
        </div>

      </div>

    </div>
  `;
}
