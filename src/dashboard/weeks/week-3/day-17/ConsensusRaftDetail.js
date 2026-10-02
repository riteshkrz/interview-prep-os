/**
 * 10.1 Consensus and Coordination (Raft) - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 102, 103, 104, and 105
 * from The Modern System Design Interview Guide.
 */

export function renderConsensusRaftContent(topic) {
  const nodeStates = [
    {
      state: "1. Follower (Default / Passive)",
      behavior: "Completely passive; responds only to incoming RPCs from Leader or Candidates. If no Heartbeat or AppendEntries RPC is received within a randomized election timeout (150–300 ms), the Follower assumes the Leader is dead and transitions to Candidate.",
      role: "Log replication target; votes in elections",
      badgeColor: "text-slate-300 bg-slate-500/15 border-slate-500/30"
    },
    {
      state: "2. Candidate (Election State)",
      behavior: "Increments current Term number, votes for itself, and broadcasts RequestVote RPCs to all cluster peers. If it collects votes from a strict majority (Quorum = floor(N/2) + 1), it transitions to Leader. If another candidate wins or election times out with split vote, resets timer.",
      role: "Electoral nominee seeking majority quorum",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      state: "3. Leader (Active Authority)",
      behavior: "Serves all client read and write requests. Appends commands to its local log and replicates entries to all Followers via AppendEntries RPCs. Broadcasts periodic heartbeats (e.g. every 50 ms) to all Followers to maintain authority and suppress new elections.",
      role: "Single source of truth; drives commit index",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    }
  ];

  const quorumMatrix = [
    {
      size: "1 Node",
      quorum: "1 (100%)",
      failures: "0 Failures",
      failureClass: "text-rose-400 font-bold",
      latency: "Zero network latency (Local write)",
      verdict: "Development Only: Zero fault tolerance; machine crash destroys availability",
      verdictBadge: "text-rose-400 bg-rose-500/15 border-rose-500/30"
    },
    {
      size: "2 Nodes",
      quorum: "2 (100%)",
      failures: "0 Failures",
      failureClass: "text-rose-400 font-bold",
      latency: "1 Remote round-trip",
      verdict: "Dangerous Anti-Pattern: Same fault tolerance as 1 node, but worse availability (either node dying halts writes!)",
      verdictBadge: "text-rose-400 bg-rose-500/15 border-rose-500/30"
    },
    {
      size: "3 Nodes",
      quorum: "2 (67%)",
      failures: "1 Node Failure",
      failureClass: "text-emerald-400 font-bold",
      latency: "Fastest viable consensus: 1 local + 1 fastest remote peer ACK",
      verdict: "Standard Production Minimum: Tolerates 1 node crash; splits safely into 2-and-1 partition",
      verdictBadge: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      size: "4 Nodes",
      quorum: "3 (75%)",
      failures: "1 Node Failure",
      failureClass: "text-rose-400 font-bold",
      latency: "Slower: Requires 2 remote peer ACKs instead of 1",
      verdict: "Wasteful Anti-Pattern: Requires 3 ACKs to tolerate 1 failure (same resilience as 3 nodes, slower writes, 2-and-2 split paralyzes cluster)",
      verdictBadge: "text-rose-400 bg-rose-500/15 border-rose-500/30"
    },
    {
      size: "5 Nodes",
      quorum: "3 (60%)",
      failures: "2 Node Failures",
      failureClass: "text-emerald-400 font-bold",
      latency: "Balanced: Requires 1 local + 2 fastest remote peer ACKs",
      verdict: "Enterprise Gold Standard: Tolerates 1 node failure during planned rolling maintenance with zero degradation",
      verdictBadge: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      size: "7 Nodes",
      quorum: "4 (57%)",
      failures: "3 Node Failures",
      failureClass: "text-emerald-400 font-bold",
      latency: "Noticeably higher network overhead across WAN / AZ boundaries",
      verdict: "Specialized: Mission-critical geo-distributed control planes spanning 5+ datacenters",
      verdictBadge: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const coordinationStoreComparison = [
    {
      dimension: "Primary Consensus Protocol",
      etcd: "Raft (Go implementation, clean & modern)",
      etcdClass: "text-emerald-400 font-bold",
      zookeeper: "Zab (ZooKeeper Atomic Broadcast, Paxos-variant)",
      zkClass: "text-cyan-400 font-bold",
      consul: "Raft (Integrated gossip + consensus)",
      consulClass: "text-purple-400 font-bold"
    },
    {
      dimension: "Data Model & API",
      etcd: "Flat key-value store with MVCC revisions and gRPC streaming watch",
      etcdClass: "text-slate-300",
      zookeeper: "Hierarchical filesystem tree of znodes with ephemeral & sequential nodes",
      zkClass: "text-slate-300",
      consul: "Key-value store + built-in Service Discovery and Health Check catalog",
      consulClass: "text-slate-300"
    },
    {
      dimension: "Lease / Session Mechanism",
      etcd: "Explicit TTL Leases attached to keys; client periodically refreshes lease",
      etcdClass: "text-emerald-400 font-bold",
      zookeeper: "Ephemeral znodes automatically deleted when client TCP heartbeat disconnects",
      zkClass: "text-amber-400 font-bold",
      consul: "Sessions with Health Check integration",
      consulClass: "text-slate-300"
    },
    {
      dimension: "Primary Industry Workload",
      etcd: "Kubernetes Control Plane (stores all cluster specs and pod states)",
      etcdClass: "text-cyan-300 font-medium",
      zookeeper: "Legacy Hadoop/Kafka ecosystem (being phased out via KRaft in Kafka 3+)",
      zkClass: "text-slate-400",
      consul: "HashiCorp multi-datacenter service mesh & discovery",
      consulClass: "text-purple-300 font-medium"
    },
    {
      dimension: "Maximum Recommended Dataset",
      etcd: "Megabytes (Default limit: 2GB; optimal performance &lt; 500MB)",
      etcdClass: "text-amber-400 font-bold",
      zookeeper: "Megabytes (In-memory heap; strictly &lt; 500MB)",
      zkClass: "text-amber-400 font-bold",
      consul: "Megabytes (Metadata & configuration only)",
      consulClass: "text-amber-400 font-bold"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Raft Leader Completeness Guarantee: The Quorum Overlap Election Restriction",
      answer: `In Raft, logs never flow from Follower to Leader; data only flows strictly from Leader to Follower. Therefore, Raft enforces the <strong>Election Restriction</strong> at the moment of voting:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Voter Comparison Rule:</strong> When a Candidate sends a <code>RequestVote(candidateId, term, lastLogIndex, lastLogTerm)</code> RPC, the Follower compares the Candidate's log with its own:
          <br/>1. If <code>candidate.lastLogTerm &gt; voter.lastLogTerm</code>, the candidate's log is more up to date $\to$ vote granted.
          <br/>2. If terms are equal, but <code>candidate.lastLogIndex &gt;= voter.lastLogIndex</code>, vote granted.
          <br/>3. Otherwise, the vote is <strong>REJECTED</strong>.</li>
        <li><strong>The Quorum Overlap Principle:</strong> Any entry that was committed must have been replicated to a strict majority ($&gt; \lfloor N/2 \rfloor$) of nodes. Any winning candidate must collect votes from a strict majority. By the Pigeonhole Principle, at least one node in the candidate's voting majority must have witnessed the committed entry. Because that node refuses to vote for any candidate with a less up-to-date log, a candidate missing committed entries can <em>never</em> win an election!</li>
      </ul>`
    },
    {
      conceptId: "#02",
      title: "Quorum Geometry & The Symmetrical Partition Hazard: Why 4 Nodes Is An Anti-Pattern",
      answer: `This is a fundamental distributed systems mathematical reality:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Fault Tolerance Formula:</strong> A cluster of $N$ nodes tolerates $F = \lfloor (N-1)/2 \rfloor$ node crashes.
          <br/>- For $N = 3$: Tolerates $\lfloor (3-1)/2 \rfloor = 1$ crash. Quorum required: $\lfloor 3/2 \rfloor + 1 = 2$ nodes.
          <br/>- For $N = 4$: Tolerates $\lfloor (4-1)/2 \rfloor = 1$ crash. Quorum required: $\lfloor 4/2 \rfloor + 1 = 3$ nodes.</li>
        <li><strong>Why 4 Nodes Is Strictly Worse:</strong>
          <br/>1. <em>Higher Quorum Hurdle:</em> A 4-node cluster requires 3 nodes alive to operate (75% availability hurdle) compared to only 2 nodes alive for 3 nodes (67% hurdle).
          <br/>2. <em>Slower Write Path:</em> To commit a write, the leader must wait for 2 remote peer ACKs in a 4-node cluster, compared to only 1 remote peer ACK in a 3-node cluster.
          <br/>3. <em>The Symmetrical Network Partition:</em> If a network switch failure cuts a 4-node cluster in half (2 nodes on Rack A, 2 nodes on Rack B), <strong>both halves freeze completely</strong> because neither side can reach the required quorum of 3 ($2 &lt; 3$). In a 3-node cluster, a partition splits 2-and-1, allowing the majority partition to continue serving writes without interruption.</li>
        <li><strong>Takeaway:</strong> Adding a 4th node increases hardware cost and write latency while reducing overall cluster availability! Always choose <strong>odd cluster sizes (3, 5, 7)</strong>.</li>
      </ul>`
    },
    {
      conceptId: "#03",
      title: "Grey Failures & Flapping Follower Protection: The Raft Pre-Vote Protocol",
      answer: `In real datacenters, nodes rarely die cleanly; they become 'sick' or experience asymmetric network partitions:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>The Disrupted Cluster Hazard:</strong> Suppose Follower 3 suffers an outgoing packet loss or GC pause. It stops hearing heartbeats from the healthy Leader. Follower 3 increments its Term ($Term = 10 \to 11$) and broadcasts <code>RequestVote</code>. Even though Follower 3 cannot win, when the healthy Leader receives a message with a higher Term ($11 &gt; 10$), the Raft specification requires the Leader to immediately abdicate and step down to Follower! This destabilizes the cluster and interrupts client traffic.</li>
        <li><strong>The Solution (Pre-Vote Phase):</strong>
          <br/>Before incrementing its Term and declaring candidacy, a disconnected follower must first enter an exploratory <strong>Pre-Vote</strong> state:
          <br/>- It sends <code>PreVote(term=10)</code> to peers without incrementing Term.
          <br/>- Peers reject the PreVote if they are currently receiving timely heartbeats from a healthy leader.
          <br/>- Because healthy peers reject the PreVote, the flapping node never increments Term, preventing sick nodes from deposing healthy cluster leaders!</li>
      </ul>`
    },
    {
      conceptId: "#04",
      title: "Distributed Lock Safety & GC Pauses: The Martin Kleppmann Fencing Token Defense",
      answer: `A widely held misconception is that acquiring a distributed lock from ZooKeeper or etcd guarantees safe writes to storage. Martin Kleppmann proved that distributed locks without fencing tokens are inherently unsafe due to uncoordinated process pauses:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>The GC Pause Race Condition:</strong>
          <br/>1. Client 1 acquires a distributed lock for <code>resource_order_42</code> from ZooKeeper with a 10-second lease.
          <br/>2. Immediately after acquiring the lock, Client 1 experiences a major <strong>15-second Stop-the-World JVM GC pause</strong>.
          <br/>3. While Client 1 is frozen, its 10-second lease expires in ZooKeeper.
          <br/>4. Client 2 requests the lock for <code>resource_order_42</code>. ZooKeeper safely grants the lock to Client 2.
          <br/>5. Client 2 writes version 2 to the database.
          <br/>6. Client 1's GC pause ends. Unaware that its lock expired, Client 1 completes its original write to the database, silently overwriting and corrupting Client 2's data!</li>
        <li><strong>The Fencing Token Solution:</strong>
          <br/>The consensus lock server must issue a <strong>monotonically increasing integer token</strong> (e.g. <code>token = 41</code> for Client 1, <code>token = 42</code> for Client 2) with every lock grant.
          <br/>When writing to storage, the storage engine (PostgreSQL, S3, NVMe block) validates the token:
          <br/><code>UPDATE resource SET data = ..., last_token = 42 WHERE last_token &lt; 42;</code>
          <br/>When Client 1 wakes up and attempts to write with <code>token = 41</code>, the storage engine rejects the write because $41 &lt; 42$. Fencing tokens move the ultimate consistency guarantee to the storage barrier.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 102: PART 10 BANNER & CONSENSUS FOUNDATIONS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- PART 10 Massive Purple Header Banner -->
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] p-6 text-white shadow-xl shadow-indigo-950/50 flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-extrabold uppercase tracking-widest text-indigo-200">
              PART 10 · DISTRIBUTED SYSTEMS FUNDAMENTALS
            </span>
          </div>
          <h1 class="font-sans text-[24px] sm:text-[28px] font-black tracking-tight text-white leading-tight">
            Distributed Consensus & Coordination
          </h1>
          <p class="text-[13.5px] text-indigo-100/90 font-sans max-w-3xl leading-relaxed">
            State Machine Replication, Quorum Physics, Leader Election & Split-Brain Prevention across Unreliable Networks
          </p>
        </div>

        <!-- Section Title: 10.1 Consensus and Coordination (Raft) -->
        <div class="flex flex-col gap-2 pt-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-snug">
              10.1 Consensus and Coordination (Raft)
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            How a Cluster of Independent Nodes Agrees on a Single Sequence of State Machine Transitions
          </p>
        </div>

        <!-- FLP Impossibility & Asynchronous Network Card -->
        <div class="bg-[#141C2E] border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-400 text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              THE THEORETICAL IMPOSSIBILITY: WHY DISTRIBUTED CONSENSUS IS HARD
            </span>
          </div>
          <p class="text-[13.5px] text-slate-300 font-sans leading-relaxed">
            In 1985, researchers Fischer, Lynch, and Paterson published the landmark <strong>FLP Impossibility Theorem</strong>: <em>In an asynchronous network where messages can be arbitrarily delayed, dropped, or reordered, no deterministic consensus protocol can guarantee both Safety and Liveness if even a single node can crash.</em>
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-[12.5px] font-sans">
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-emerald-400 font-code text-[11px] uppercase tracking-wider">
                1. Safety (Unconditional Guarantee)
              </span>
              <p class="text-slate-300 leading-normal">
                <em>Nothing bad happens.</em> All non-faulty nodes agree on the exact same log sequence; no two conflicting entries are ever committed for the same index. Raft guarantees Safety 100% of the time, even under extreme partitions.
              </p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-cyan-400 font-code text-[11px] uppercase tracking-wider">
                2. Liveness (Probabilistic Guarantee)
              </span>
              <p class="text-slate-300 leading-normal">
                <em>Something good eventually happens.</em> Client writes eventually complete and elections resolve. Raft sidesteps the FLP impossibility by introducing <strong>randomized election timers</strong> to resolve split votes with high probability.
              </p>
            </div>
          </div>
        </div>

        <!-- The Three Raft Node States Cards -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[12px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">cycle</span>
            THE THREE RAFT NODE STATES
          </span>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${nodeStates.map(item => `
              <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between gap-3 shadow-lg">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="font-sans text-[15px] font-bold text-white">${item.state}</span>
                  </div>
                  <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
                    ${item.behavior}
                  </p>
                </div>
                <div class="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                  <span class="font-code text-[10.5px] text-slate-400">${item.role}</span>
                  <span class="font-code text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${item.badgeColor}">ACTIVE</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Official Page 102 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 102</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 103: QUORUM ARITHMETIC, REPLICATION FLOW & SPLIT BRAIN -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h3 class="font-sans text-[20px] sm:text-[22px] font-bold text-white tracking-tight leading-snug">
              Quorum Arithmetic & Architectural Data Paths
            </h3>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            The Mathematical Formula for Consensus Availability and Why Even-Numbered Clusters Fail
          </p>
        </div>

        <!-- Quorum Formula Banner -->
        <div class="bg-[#161F33] border border-[#2D3A54] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              THE MAJORITY QUORUM FORMULA
            </span>
            <p class="text-[13px] text-slate-300 font-sans">
              In a cluster of $N$ nodes, any election or log entry commit requires acknowledgement from a strict majority:
            </p>
          </div>
          <div class="bg-[#0B1120] border border-cyan-500/40 rounded-lg px-5 py-3 font-code text-[16px] font-bold text-cyan-300 shrink-0">
            Quorum = ⌊ N / 2 ⌋ + 1
          </div>
        </div>

        <!-- Quorum Matrix Table -->
        <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0A0E1A]">
          <table class="w-full text-left text-[12.5px] font-sans border-collapse">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#24314A] text-white font-bold font-code text-[11px] tracking-wider uppercase">
                <th class="py-3 px-3.5">Cluster Size (N)</th>
                <th class="py-3 px-3.5">Quorum Needed</th>
                <th class="py-3 px-3.5">Tolerated Crashes (F)</th>
                <th class="py-3 px-3.5">Write Latency</th>
                <th class="py-3 px-3.5 w-1/3">Architectural Recommendation</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E293B]">
              ${quorumMatrix.map((row, idx) => `
                <tr class="${idx % 2 === 0 ? 'bg-[#0F172A]/50' : 'bg-[#0A0E1A]'} hover:bg-[#1E293B]/40 transition-colors">
                  <td class="py-3 px-3.5 font-bold font-code text-white">${row.size}</td>
                  <td class="py-3 px-3.5 font-code text-slate-300">${row.quorum}</td>
                  <td class="py-3 px-3.5 ${row.failureClass}">${row.failures}</td>
                  <td class="py-3 px-3.5 text-slate-300">${row.latency}</td>
                  <td class="py-3 px-3.5 text-slate-300 leading-normal">
                    <span class="inline-block px-1.5 py-0.5 rounded border text-[10.5px] font-code font-bold mr-1.5 ${row.verdictBadge}">
                      ${row.size.includes('3') || row.size.includes('5') ? 'RECOMMENDED' : 'AVOID'}
                    </span>
                    ${row.verdict}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Diagram 1: Raft Log Replication Sequence -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="font-code text-[12px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">sync_alt</span>
              NORMAL LOG REPLICATION FLOW (3-NODE CLUSTER)
            </span>
            <span class="text-[11px] font-code text-slate-400">Majority ACK Commits Write</span>
          </div>

          <div class="bg-[#0A0E1A] border border-[#1E293B] rounded-xl p-4 font-code text-[12px] leading-relaxed text-slate-300 overflow-x-auto">
            <pre class="text-[#34D399]">
[Client] ─────Write("x=5")─────► [Leader (Node 1, Term 2)]
                                         │ Appends "x=5" (uncommitted)
                 ┌───────────────────────┴───────────────────────┐
                 │ AppendEntries(Term 2, "x=5")                  │ AppendEntries(Term 2, "x=5")
                 ▼                                               ▼
         [Follower: Node 2]                              [Follower: Node 3]
         (Disk fsync OK)                                 (Disk fsync OK / slow network)
                 │                                               │
                 └───────────────┬───────────────────────────────┘
                                 │
                            ACK: Success (1 of 2 followers)
                                 ▼
         Leader collects 2 ACKs total (Local + Node 2 = Quorum of 2 reached!)
         Leader Commits entry → Applies "x=5" to local State Machine
         Leader returns "200 OK" to Client ◄─── (Write Latency = 1 RTT)
         Subsequent Heartbeat informs Node 2 & 3: "CommitIndex = 5"
            </pre>
          </div>
        </div>

        <!-- Diagram 2: Split-Brain Prevention Under Partition -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="font-code text-[12px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">call_split</span>
              SPLIT-BRAIN PREVENTION DURING NETWORK PARTITION (5-NODE CLUSTER)
            </span>
            <span class="text-[11px] font-code text-slate-400">Majority Rules · Minority Writes Freeze</span>
          </div>

          <div class="bg-[#0A0E1A] border border-[#1E293B] rounded-xl p-4 font-code text-[12px] leading-relaxed text-slate-300 overflow-x-auto">
            <pre class="text-[#FBBF24]">
                      ═════════ NETWORK PARTITION CUT ═════════
         MAJORITY PARTITION (3 Nodes)           MINORITY PARTITION (2 Nodes)
  ┌────────────────────────────────────────┐  ┌───────────────────────────────────┐
  │ [Node 1: Leader]                       │  │ [Node 4: Zombie Leader Term 1]    │
  │ [Node 2: Follower]                     │  │ [Node 5: Follower]                │
  │ [Node 3: Follower]                     │  │                                   │
  │                                        │  │ Client Write: "y=10"              │
  │ Client Write: "x=99"                   │  │   ▼                               │
  │   ▼                                    │  │ Node 4 asks Node 5: 2 ACKs total  │
  │ Leader collects 3 ACKs (Quorum=3)      │  │ But Quorum requires 3! (2 &lt; 3)   │
  │ Entry Committed! Returns 200 OK!       │  │ Writes STALL / REJECTED!          │
  └────────────────────────────────────────┘  └───────────────────────────────────┘
                                  │
                 When Network Heals (Partition Clears):
                 Node 4 & 5 see Term 2 entries from Majority Leader;
                 Node 4 abdicates to Follower and truncates uncommitted writes!
            </pre>
          </div>
        </div>

        <!-- Official Page 103 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 103</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 104: FENCING TOKENS, COORDINATION STORES & INTERVIEW Q&A -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h3 class="font-sans text-[20px] sm:text-[22px] font-bold text-white tracking-tight leading-snug">
              Fencing Tokens & Production Coordination Stores
            </h3>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Solving the Zombie Leader Hazard and Comparing etcd vs. Apache ZooKeeper vs. HashiCorp Consul
          </p>
        </div>

        <!-- Fencing Tokens Deep Dive Box -->
        <div class="bg-[#111827] border border-[#1E293B] rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <span class="font-code text-[12px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">security</span>
              FENCING TOKENS: PROTECTING DISTRIBUTED LOCKS AGAINST GC PAUSES
            </span>
            <span class="font-code text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">MANDATORY DEFENSE</span>
          </div>

          <p class="text-[13px] text-slate-300 font-sans leading-relaxed">
            Acquiring a distributed lock from etcd or ZooKeeper does <strong>not</strong> prevent dual-writes if a client process freezes during a 15-second GC pause. To enforce safety, the consensus lock manager must issue a monotonically increasing <strong>Fencing Token</strong> ($T=41, 42, 43$) with every lock lease:
          </p>

          <div class="bg-[#0A0E1A] border border-[#1E293B] rounded-lg p-4 font-code text-[11.5px] leading-relaxed text-slate-300">
            <span class="text-slate-500">// Safe Storage Barrier Mutation (PostgreSQL / DynamoDB / Object Store):</span><br/>
            <span class="text-cyan-400">UPDATE</span> order_state<br/>
            <span class="text-cyan-400">SET</span> status = <span class="text-amber-300">'PROCESSED'</span>, payload = <span class="text-amber-300">'{...}'</span>, last_fencing_token = <span class="text-purple-400">42</span><br/>
            <span class="text-cyan-400">WHERE</span> order_id = <span class="text-amber-300">'ORD-9872'</span> <span class="text-cyan-400">AND</span> last_fencing_token &lt; <span class="text-purple-400">42</span>;<br/>
            <span class="text-slate-500">// If Client 1 wakes up with stale token 41, the UPDATE modifies 0 rows and fails safely!</span>
          </div>
        </div>

        <!-- Coordination Stores Comparison Table -->
        <div class="flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            PRODUCTION COORDINATION STORES: ETCD VS. ZOOKEEPER VS. CONSUL
          </span>
          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0A0E1A]">
            <table class="w-full text-left text-[12.5px] font-sans border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#24314A] text-white font-bold font-code text-[11px] tracking-wider uppercase">
                  <th class="py-3 px-3.5 w-1/4">Evaluation Dimension</th>
                  <th class="py-3 px-3.5 text-emerald-400">etcd (Kubernetes Standard)</th>
                  <th class="py-3 px-3.5 text-cyan-400">Apache ZooKeeper (Legacy Big Data)</th>
                  <th class="py-3 px-3.5 text-purple-400">HashiCorp Consul (Mesh & DNS)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B]">
                ${coordinationStoreComparison.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#0F172A]/50' : 'bg-[#0A0E1A]'} hover:bg-[#1E293B]/40 transition-colors">
                    <td class="py-2.5 px-3.5 font-medium text-slate-300 font-code text-[11px]">${row.dimension}</td>
                    <td class="py-2.5 px-3.5 ${row.etcdClass} leading-relaxed">${row.etcd}</td>
                    <td class="py-2.5 px-3.5 ${row.zkClass} leading-relaxed">${row.zookeeper}</td>
                    <td class="py-2.5 px-3.5 ${row.consulClass} leading-relaxed">${row.consul}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#062419] border-l-4 border-[#10B981] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-emerald-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">psychology</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: NEVER WRITE YOUR OWN CONSENSUS ENGINE
            </span>
          </div>
          <p class="text-[13.5px] text-emerald-100 font-sans leading-relaxed">
            Writing a working Paxos or Raft implementation from scratch for production is one of the most notorious software engineering traps. Edge cases involving disk write reordering, network socket flapping, and partial partitions take years to harden. Even Google, CockroachDB, and HashiCorp spent years debugging their Raft engines.
          </p>
          <p class="text-[13.5px] text-emerald-100/90 font-sans leading-relaxed">
            In system design interviews, <strong>never</strong> invent a new consensus algorithm. Delegate leader election and metadata coordination to proven battle-hardened tools (<strong>etcd</strong> or <strong>ZooKeeper</strong>). Your interview signal comes from knowing:
            (1) Quorum math $\lfloor N/2 \rfloor + 1$,
            (2) Why clusters must have odd node counts (3 or 5),
            (3) Fencing tokens for distributed leases, and
            (4) The Golden Rule: <em>Consensus stores hold megabytes, never gigabytes!</em>
          </p>
        </div>

        <!-- CRITICAL ARCHITECTURAL DEEP-DIVES Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              CRITICAL ARCHITECTURAL DEEP-DIVES &amp; DISTRIBUTED EDGE CASES
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${architecturalDeepDives.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-cyan-400 shrink-0 pt-0.5">${item.conceptId}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.title}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Official Page 104 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 104</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 105: OFFICIAL KEY INTERVIEW TAKEAWAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-6 flex flex-col gap-2.5 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[14px] font-sans font-medium text-white leading-relaxed">
            Consensus buys one unambiguous decision-maker at the cost of a quorum round trip. Use odd cluster sizes (3, 5), spread members across Availability Zones, and remember locks require fencing tokens. Never store application payloads in the consensus cluster—keep it strictly under a few hundred megabytes for metadata and leases.
          </p>
        </div>

        <!-- Official Page 105 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 105</span>
        </div>

      </div>

    </div>
  `;
}
