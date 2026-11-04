/**
 * 4.4 CAP and PACELC Theorems - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 52, 53, and 54
 * from The Modern System Design Interview Guide.
 */

export function renderCapVsPacelcContent(topic) {
  const pacelcRows = [
    {
      system: "Google Cloud Spanner",
      ifPartition: "Consistency (PC)",
      elseNormal: "Consistency (EC)",
      classification: "PC / EC",
      tradeoffNote: "Synchronous Paxos quorum + TrueTime atomic clocks; refuses writes if quorum is lost"
    },
    {
      system: "CockroachDB",
      ifPartition: "Consistency (PC)",
      elseNormal: "Consistency (EC)",
      classification: "PC / EC",
      tradeoffNote: "Raft consensus per range; serializable transactions across multi-node clusters"
    },
    {
      system: "Amazon DynamoDB",
      ifPartition: "Availability (PA)",
      elseNormal: "Latency (EL)",
      classification: "PA / EL",
      tradeoffNote: "Eventual consistency default; serves sub-10ms reads locally; optional strong consistency"
    },
    {
      system: "Apache Cassandra",
      ifPartition: "Availability (PA)",
      elseNormal: "Latency (EL)",
      classification: "PA / EL",
      tradeoffNote: "Masterless ring topology; tunable per-query consistency (ONE, QUORUM, ALL)"
    },
    {
      system: "MongoDB (Default)",
      ifPartition: "Availability (PA)",
      elseNormal: "Consistency (EC)",
      classification: "PA / EC",
      tradeoffNote: "Primary-secondary topology; routes writes to primary with majority write concern"
    },
    {
      system: "VoltDB / HStore",
      ifPartition: "Consistency (PC)",
      elseNormal: "Latency (EL)",
      classification: "PC / EL",
      tradeoffNote: "Partitioned in-memory execution; rejects writes during splits but ultra-fast normal reads"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why is a 'CA' (Consistent + Available) system a physical impossibility on distributed networks?",
      answer: `Eric Brewer's CAP theorem is frequently misunderstood as a <em>"pick 2 of 3"</em> menu. In real physical networks, <strong>Partition Tolerance (P) is non-negotiable</strong>. Fiber optic cables get severed by backhoes, switches crash, and cloud availability zones experience packet loss.
      <br/><br/>
      When a network partition ($P$) occurs between Node 1 and Node 2:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>If you accept a write on Node 1, Node 2 cannot receive it. A client reading from Node 2 will observe stale data &rarr; <strong>Consistency is broken (AP)</strong>.</li>
        <li>If you refuse the write to preserve consistency across all nodes &rarr; <strong>Availability is broken (CP)</strong>.</li>
      </ul>
      You cannot "choose CA"—a CA database only exists on a single machine with zero network connections (where partitions are physically impossible).`
    },
    {
      qNum: "Q2",
      question: "Why is PACELC considered a strictly superior architectural evaluation framework than CAP alone?",
      answer: `CAP only describes system behavior during a network partition—an event that might happen 0.01% of the year. It tells you <em>nothing</em> about how a database behaves during the <strong>99.99% of time when the network is healthy!</strong>
      <br/><br/>
      Daniel Abadi formulated <strong>PACELC</strong>:
      <pre class="bg-[#050811] p-2 rounded text-[11px] font-code text-slate-300 mt-1 border border-slate-800">if (Partition P):
    choose Availability (A) or Consistency (C);
else (Normal State E):
    choose Latency (L) or Consistency (C);</pre>
      In normal operation ($E$), if you want immediate Consistency ($C$), the primary must wait for network acknowledgments from replicas, paying a <strong>Latency penalty ($L$)</strong>. If you want ultra-low Latency ($L$), you return immediately, accepting replication lag. PACELC captures the everyday engineering tradeoff between milliseconds and data freshness.`
    },
    {
      qNum: "Q3",
      question: "How does Apache Cassandra allow tuning between AP and CP on a per-query basis? What is the Quorum equation?",
      answer: `Cassandra is masterless: every node can accept reads and writes. It allows clients to set Consistency Levels per operation:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Write Consistency:</strong> <code>ANY</code> (fastest, writes to hinted handoff), <code>ONE</code>, <code>QUORUM</code> ($N/2 + 1$), <code>ALL</code> (slowest).</li>
        <li><strong>Read Consistency:</strong> <code>ONE</code> (fast local read), <code>QUORUM</code>, <code>ALL</code>.</li>
      </ul>
      <strong class="text-indigo-400">The Strong Consistency Formula:</strong>
      <div class="font-code text-[12px] text-cyan-300 my-1 bg-[#0F1626] p-2 rounded border border-cyan-500/30">
        Read Nodes (R) + Write Nodes (W) > Replication Factor (N)
      </div>
      If $R + W > N$, the read set and write set are guaranteed by the <strong>Pigeonhole Principle</strong> to overlap on at least <strong>one identical node</strong> containing the latest timestamp, providing Strong Consistency (CP). If $R + W \le N$, the system operates in Eventual Consistency (AP) with single-digit millisecond latency.`
    },
    {
      qNum: "Q4",
      question: "How do Google Cloud Spanner and CockroachDB reconcile the CAP theorem using TrueTime atomic clocks?",
      answer: `Google Spanner claims to be a practically "CA" database. It does not violate the laws of physics; it is fundamentally a <strong>CP system</strong> that achieves 99.999% availability through custom hardware:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>TrueTime API:</strong> Every Spanner datacenter contains GPS receivers paired with redundant rubidium atomic clocks. TrueTime exposes bounded clock uncertainty (&plusmn;7ms).</li>
        <li><strong>Commit Wait:</strong> When committing a transaction at timestamp $T$, the coordinator waits for $2\epsilon$ before releasing locks. This guarantees that no subsequent transaction can receive an earlier timestamp, establishing <strong>External Consistency (Linearizability)</strong> globally.</li>
        <li><strong>Fiber Redundancy:</strong> Google owns its private global fiber network, driving network partition probability close to zero.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 52, 53, 54: CAP & PACELC THEOREMS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              9.2 CAP and PACELC Theorems in Distributed Systems
            </h2>
          </div>
          <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed pl-4">
            The <strong class="text-indigo-400">CAP Theorem</strong> and its modern evolution, <strong class="text-cyan-400">PACELC</strong>, define the immutable mathematical and physical boundaries of distributed systems. When network cables are severed, systems must choose between immediate correctness (Consistency) and operational survival (Availability). Under normal health, they must balance latency against synchronization.
          </p>
        </div>

        <!-- Everyday Mental Models Banner -->
        <div class="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-slate-900 border border-blue-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">psychology</span>
            <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider">
              Everyday Mental Model: Two Bank Tellers Across Town
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
            <div class="bg-[#0F1626]/80 border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <strong class="text-indigo-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">call_split</span>
                CAP: When the Phone Line is Cut (Partition)
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Alice deposits $100 at Teller A in Manhattan. Meanwhile, the phone line connecting to Teller B in Brooklyn is cut! If Alice walks into Brooklyn asking to withdraw $100, what does Teller B do? If Teller B refuses &rarr; <strong>CP (Consistent but Unavailable)</strong>. If Teller B gives the cash &rarr; <strong>AP (Available but Stale/Inconsistent)</strong>. There is no magical third option.
              </p>
            </div>
            <div class="bg-[#0F1626]/80 border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <strong class="text-cyan-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">speed</span>
                PACELC: When the Phone Line Works Fine (Normal State)
              </strong>
              <p class="text-slate-300 leading-relaxed">
                99.99% of the time, the network is healthy. Does Teller A make Alice wait 30 seconds while calling Brooklyn to confirm Teller B updated their book? (<strong>High Consistency, High Latency</strong>). Or does Teller A hand Alice her receipt in 100ms and notify Brooklyn asynchronously? (<strong>Low Latency, Eventual Consistency</strong>).
              </p>
            </div>
          </div>
        </div>

        <!-- Overview Text Grid -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">CAP Theorem (During Partitions)</span>
                <span class="text-[10px] font-code bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">CP vs AP</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Because physical network partitions ($P$) cannot be avoided, systems must choose between <strong>Consistency (CP)</strong> (refusing writes to guarantee zero stale reads) and <strong>Availability (AP)</strong> (accepting writes on isolated nodes, risking temporary inconsistency).
              </p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">PACELC Theorem (Normal State)</span>
                <span class="text-[10px] font-code bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Else: Latency vs Consistency</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Extends CAP: <em>If Partition ($P$), choose $A$ or $C$; Else ($E$), choose between <strong>Latency ($L$)</strong> (responding immediately with local data) and <strong>Consistency ($C$)</strong> (waiting for cross-node replication ACKs).</em>
              </p>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Theorem Mechanics -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              MATHEMATICAL FORMULATION: CAP UNDER PARTITION VS. PACELC IN NORMAL HEALTH
            </span>
            <span class="text-slate-500 text-[10.5px]">Distributed Invariant Boundaries</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. THE CAP THEOREM IN ACTION: THE NETWORK PARTITION SPLIT                              │
│                                                                                        │
│     [ Client 1 ] ──write(x=5)──► [ Node A ]                                            │
│                                      │                                                 │
│                        ══════════════╪═══════════════ [ NETWORK FIBER CUT! ]           │
│                                      │                                                 │
│     [ Client 2 ] ◄──read(x=?)──── [ Node B ]                                            │
│                                                                                        │
│   • CP CHOICE (HBase, Spanner): Node B refuses to serve Client 2; returns 500 error    │
│     Result: Guarantees no stale data; sacrifices Availability!                         │
│   • AP CHOICE (Cassandra, DynamoDB): Node B returns stale x=4 immediately               │
│     Result: 100% Availability; sacrifices Linearizable Consistency!                    │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. PACELC TAXONOMY: HOW DATABASES OPERATE 99.99% OF THE TIME                           │
│                                                                                        │
│   • PC / EC (Spanner, CockroachDB):                                                    │
│     If Partition: Consistent (PC)  | Else Normal: Waits for Raft quorum (EC - High C)  │
│                                                                                        │
│   • PA / EL (Cassandra, DynamoDB):                                                     │
│     If Partition: Available (PA)   | Else Normal: Reads local memory (EL - Low Latency)│
│                                                                                        │
│   • PA / EC (MongoDB default):                                                         │
│     If Partition: Available (PA)   | Else Normal: Waits for Primary ACK (EC - High C)  │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Systems Taxonomy Table -->
        <div class="flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DATABASE PACELC TAXONOMY &amp; PRODUCTION TRADE-OFFS
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr class="bg-[#162032] text-slate-300 font-code text-[11px] border-b border-[#24314A]">
                  <th class="p-3.5 font-semibold text-white">Database System</th>
                  <th class="p-3.5 font-semibold text-indigo-300">If Partition (P)</th>
                  <th class="p-3.5 font-semibold text-cyan-300">Else Normal (E)</th>
                  <th class="p-3.5 font-semibold text-slate-300">PACELC Class</th>
                  <th class="p-3.5 font-semibold text-emerald-400">Production Architectural Profile</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0F172A]">
                ${pacelcRows.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#111B2E]/50' : 'bg-transparent'} hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-code text-white font-semibold whitespace-nowrap">${row.system}</td>
                    <td class="p-3.5 text-indigo-200">${row.ifPartition}</td>
                    <td class="p-3.5 text-cyan-200">${row.elseNormal}</td>
                    <td class="p-3.5 font-code text-white font-bold">${row.classification}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed text-[11.5px]">${row.tradeoffNote}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              STAFF PERSPECTIVE: PER-DATA FLOW ARCHITECTURE
            </span>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, amateur candidates declare: <em class="text-white">"Our entire application will be CP."</em> or <em class="text-white">"We pick AP everywhere for high uptime."</em> Senior engineers never treat consistency as a monolithic company-wide binary flag.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] pt-1">
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white block pb-0.5">CP Data Flows (Strong Consistency):</strong>
              Financial ledger double-entry transfers, wallet balances, inventory stock decrements, and flight seat assignments. If partitioned, return an explicit error rather than corrupt state.
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white block pb-0.5">AP Data Flows (High Availability):</strong>
              Product catalog reviews, YouTube view counters, social media likes, clickstream telemetry, and shopping cart drafts. If partitioned, serve cached data and reconcile later.
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: THE ACID 'C' VS. CAP 'C' SCREENING TRAP
            </span>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            Interviewers frequently test whether you conflate the <strong class="text-amber-300">'C' in ACID</strong> with the <strong class="text-amber-300">'C' in CAP</strong>. They represent entirely different engineering domains:
          </p>
          <div class="text-[12px] text-amber-200/90 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20 space-y-1.5 leading-relaxed">
            <div>• <strong class="text-amber-100">ACID Consistency (Application Invariants):</strong> Ensures that a transaction transitions the database from one valid state to another, satisfying all schema constraints, foreign keys, and triggers (e.g. <code>balance &gt;= 0</code>).</div>
            <div>• <strong class="text-amber-100">CAP Consistency (Linearizability):</strong> A distributed timing guarantee. It means that once a write completes, every subsequent read on any node in the cluster must return that value or an error, appearing as if there is only a single copy of data globally.</div>
          </div>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2 font-sans">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            You are designing the ATM cash withdrawal network for a retail bank. During a transatlantic network partition where London branches cannot reach the central database in New York, what decision should the local ATM make when a customer requests to withdraw $200? Do you choose CP (reject withdrawal) or AP (dispense cash with local overdraft limit)?
          </p>
        </div>

        <!-- Interview Follow-ups: Q1 - Q4 -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#818CF8] text-[18px]">quiz</span>
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS &amp; STAFF PROBES
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-1.5 pb-3 border-b border-[#24314A]/50 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[13.5px] font-bold text-white">${item.question}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-5 flex flex-col gap-2 shadow-lg shadow-indigo-950/40 font-sans">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[13.5px] font-medium text-white leading-relaxed">
            CAP only bites during a network partition; PACELC describes the trade you make every millisecond under normal health. Partitions are physical realities, so never claim to 'pick 2 of 3'. In production interviews, articulate your architecture per data flow: 'CP for the ledger balance, AP for the product catalog.'
          </p>
        </div>

        <!-- Page 54 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Pages 52–54 · Section 9.2</span>
        </div>

      </div>

    </div>
  `;
}
