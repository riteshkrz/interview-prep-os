/**
 * Day 21: Week 3 Architectural Synthesis & Distributed Systems Master Reference
 * Comprehensive Staff-level reference unifying Distributed Consensus, Storage Engines,
 * Resilience Cascades, Failure Detectors, Telemetry Formulations, and Planetary Multi-Region Scale.
 */

export function renderWeek3RevisionContent(topic) {
  const patternMatrix = [
    {
      trigger: "Spiky, 100x Peak Traffic & Flash Sales",
      reachFor: "Admission Control + Durable Queue (Kafka/SQS) + Pre-warmed Worker Autoscaling",
      howItWorks: "Decouple synchronous HTTP request intake from compute execution. Gateway returns HTTP 202 Accepted; durable append-only log buffers traffic spike; workers pull at maximum steady-state database capacity.",
      whyChosen: "Autoscaling stateless pods in Kubernetes takes 45-120 seconds (image pull, pod boot, health probes). Traffic spikes hit within 200 milliseconds. Attempting to autoscale through a flash sale causes cascading 504 timeouts. Buffer the spike, do not autoscale into it.",
      prevents: "Database connection pool exhaustion and cascading gateway crashes."
    },
    {
      trigger: "Zero Data Loss (RPO = 0) Requirement",
      reachFor: "Multi-AZ Synchronous Quorum Commit + Append-Only Audit Ledger",
      howItWorks: "Transactions write sequentially to Write-Ahead Logs (WAL) and require synchronous acknowledgment from a majority quorum (e.g., 2 of 3 AZs) before acknowledging client 200 OK.",
      whyChosen: "Asynchronous replication leaves uncommitted bytes in local buffers. If the host burns, data is permanently destroyed. Quorum replication guarantees that any surviving majority contains at least one node with the latest committed state.",
      prevents: "Silent financial record loss, double spending, and ledger divergence."
    },
    {
      trigger: "Multi-Region Global Scale with Low Read Latency",
      reachFor: "Active-Active Reads with Single Write Leader + Anycast Routing + LSN Watermarking",
      howItWorks: "Read replicas deployed globally in local POPs/regions serving reads in <10ms. All mutating writes routed over WAN to the designated Primary Region. Clients receive monotonic LSN tokens to preserve read-your-own-writes consistency.",
      whyChosen: "Full planetary multi-master databases (e.g., multi-region Cassandra with Last-Write-Wins) cannot enforce business invariants across continents without expensive consensus. Local reads + single writer eliminates multi-master write conflicts entirely while delivering sub-10ms reads for 95% of traffic.",
      prevents: "Transatlantic read latency penalties and catastrophic multi-master merge conflicts."
    },
    {
      trigger: "Millions of Persistent Concurrent Connections (Chat / Live Updates)",
      reachFor: "Epoll / Kqueue Non-Blocking Event Loops + Pub/Sub Backplane (Redis / Pulsar)",
      howItWorks: "Thread-per-connection architectures (Tomcat) fail at 10,000 sockets due to kernel stack memory overhead (1MB per thread = 10GB for 10k connections). Non-blocking event loops multiplex 100,000 sockets per process using OS kernel epoll.",
      whyChosen: "Separates socket connection state from business compute. Epoll edge workers hold idle WebSocket connections, while messages are routed through an internal Redis/Kafka pub/sub backplane.",
      prevents: "Linux OS kernel thread starvation, context-switching thrashing, and memory exhaustion."
    },
    {
      trigger: "Exactly-One Leader / Distributed Lock Requirement",
      reachFor: "Raft Consensus (etcd/Consul) + Time-Bounded Lease + Generational Fencing Tokens",
      howItWorks: "Nodes elect a single leader via Raft majority quorum. The leader obtains a renewable time-bounded lease and receives a monotonically incrementing generation ID (e.g., fencing token = 42). Target storage validates fencing tokens on every mutation.",
      whyChosen: "Redis distributed locks (Redlock) are unsafe against stop-the-world GC pauses: if the lock holder pauses for 15 seconds, the lock expires in Redis, another node acquires it, and two nodes concurrently write to storage. A fencing token rejects writes with stale tokens at the storage tier.",
      prevents: "Split-brain state corruption caused by network partitions or JVM garbage collection pauses."
    },
    {
      trigger: "Concurrent Divergent Writes in Masterless Storage",
      reachFor: "Conflict-Free Replicated Data Types (CRDTs) or Domain-Specific Application Merge",
      howItWorks: "Replicas accept writes independently without coordination. Concurrent updates converge deterministically using mathematically commutative and associative merge operations (e.g., PN-Counters, Observed-Remove Sets).",
      whyChosen: "Last-Write-Wins (LWW) based on NTP wall clocks silently drops valid concurrent updates due to clock skew. CRDTs guarantee strong eventual consistency without centralized consensus.",
      prevents: "Silent data erasure in shopping carts, collaborative documents, and distributed telemetry counters."
    },
    {
      trigger: "Determining Causal Ordering Across Distributed Nodes",
      reachFor: "Hybrid Logical Clocks (HLC) or Vector Clocks",
      howItWorks: "Vector clocks track causality tuples across all nodes to detect concurrent vs causally related events. HLCs combine monotonic physical clocks with logical increment counters, bounding error within NTP drift (e.g., 100ms).",
      whyChosen: "Physical wall clocks (NTP) cannot determine which write happened first because clock drift across machines (5-50ms) exceeds network message latency. HLCs provide causal ordering without requiring GPS hardware.",
      prevents: "Out-of-order event processing, causality violations, and ghost updates."
    },
    {
      trigger: "Distinguishing Dead Nodes from Slow/Degraded Nodes",
      reachFor: "Phi-Accrual Failure Detector or SWIM Protocol + Outlier Ejection",
      howItWorks: "Instead of binary up/down heartbeats, phi-accrual models network heartbeat arrival intervals as a normal distribution, computing a continuous suspicion probability (phi). Envoy outlier ejection ejects nodes returning 5xx or slow responses.",
      whyChosen: "Binary timeouts cause false positive ejections during transient network congestion, triggering massive connection restabilization storms. Phi-accrual adapts dynamically to ambient network jitter.",
      prevents: "Grey failure cascades where sick nodes pass basic TCP health checks while poisoning 30% of traffic."
    },
    {
      trigger: "Zero-Downtime Deployment with Schema Evolution",
      reachFor: "Automated Canary Deployment (ACA) + 5-Phase Expand-Contract Database Migration",
      howItWorks: "Database schema is expanded first (adding nullable columns or triggers). Code is deployed with dual-writing. Background backfill updates old rows. Code switches to reading new column. Contract phase drops old column weeks later.",
      whyChosen: "Renaming a column in a single migration instantaneously crashes all running v1 application instances during rolling deployment because v1 expects the old column name. Expand-contract guarantees forward and backward binary compatibility.",
      prevents: "Rolling deployment downtime, SQL syntax crashes, and catastrophic rollbacks."
    },
    {
      trigger: "Preventing System-Wide Cascading Collapse Under Overload",
      reachFor: "Bulkhead Thread Isolation + Exponential Backoff with Full Jitter + Priority Load Shedding",
      howItWorks: "Client calls use randomized jittered retry intervals bounded by a global retry budget (<= 10%). Gateways shed non-critical requests using Little's Law when inflight queues exceed capacity. Thread pools are isolated per dependency.",
      whyChosen: "Uncoordinated retries amplify load by 3x-5x precisely when downstream services are struggling, transforming a minor 10% latency blip into total system death spiral. Jitter desynchronizes retry waves.",
      prevents: "Cascading outage death spirals and queue bufferbloat."
    }
  ];

  const consensusComparison = [
    {
      protocol: "Raft (etcd, Consul, CockroachDB)",
      leadership: "Strong Single Leader with Term Numbers",
      quorum: "Majority: (N / 2) + 1 nodes",
      commitPath: "Leader appends to log -> broadcasts AppendEntries -> commits once majority acknowledges -> replies to client.",
      splitBrainDefense: "Strict majority quorum required for elections. Isolated minority cannot elect a leader or commit writes.",
      tradeoff: "All writes must serialize through single leader; throughput bounded by leader network/disk bandwidth."
    },
    {
      protocol: "Multi-Paxos (Google Chubby, Spanner)",
      leadership: "Stable Proposer (Distinguished Leader)",
      quorum: "Majority: (N / 2) + 1 nodes",
      commitPath: "Phase 1 (Prepare/Promise) run once at leader election; Phase 2 (Accept/Accepted) run for every log entry.",
      splitBrainDefense: "Higher proposal numbers supersede older leaders; lease mechanisms ensure single active leader.",
      tradeoff: "Extreme conceptual and implementation complexity; corner cases in log hole-filling and view changes."
    },
    {
      protocol: "Two-Phase Commit (2PC / XA)",
      leadership: "External Transaction Coordinator",
      quorum: "Unanimous: 100% of participating nodes must agree",
      commitPath: "Phase 1: Coordinator sends Prepare. All nodes write to undo/redo log and vote Yes/No. Phase 2: Coordinator sends Commit/Abort.",
      splitBrainDefense: "Coordinator acts as single authority. However, if coordinator crashes during commit phase, participants remain indefinitely locked.",
      tradeoff: "Blocking anti-pattern in distributed architectures! Zero fault tolerance: failure of a single participant halts the entire system."
    }
  ];

  const latencyNumbers = [
    { operation: "CPU L1 Cache Reference", latency: "0.5 to 1.0 ns", scale: "Instantaneous instruction speed" },
    { operation: "CPU Branch Misprediction", latency: "3 to 5 ns", scale: "Pipeline flush penalty" },
    { operation: "CPU L2 Cache Reference", latency: "3 to 7 ns", scale: "Fast in-core cache" },
    { operation: "CPU L3 Cache Reference", latency: "15 to 40 ns", scale: "Shared multi-core cache" },
    { operation: "Main Memory (RAM) Access", latency: "50 to 100 ns", scale: "DRAM bus traversal" },
    { operation: "NVMe SSD Read / Write (Direct I/O)", latency: "20 to 50 microseconds", scale: "Solid-state persistence" },
    { operation: "Network Roundtrip: Same Datacenter Rack", latency: "0.1 to 0.2 milliseconds", scale: "Top-of-Rack (ToR) switch" },
    { operation: "Network Roundtrip: Intra-Availability Zone (AZ)", latency: "0.5 to 1.0 milliseconds", scale: "Local VPC latency" },
    { operation: "Network Roundtrip: Inter-AZ (Same Cloud Region)", latency: "1.0 to 2.5 milliseconds", scale: "Synchronous replication budget" },
    { operation: "Network Roundtrip: US East to US West (WAN)", latency: "60 to 75 milliseconds", scale: "Transcontinental fiber" },
    { operation: "Network Roundtrip: US East to Frankfurt (Transatlantic)", latency: "80 to 95 milliseconds", scale: "Subsea fiber optic cable" },
    { operation: "Network Roundtrip: US West to Tokyo (Transpacific)", latency: "140 to 180 milliseconds", scale: "Deep ocean routing path" }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-8 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="rev-3">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Week 3 Architectural Synthesis · Day 21
            </span>
            <span class="text-[12px] font-code text-slate-400">Appendix C.3 &amp; D · Storage, Consensus, Resilience &amp; Operations</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 40 mins
          </span>
        </div>
        <h3 class="font-sans text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-snug">
          Week 3 Senior &amp; Staff System Design Master Synthesis
        </h3>
        <p class="font-sans text-[14px] text-slate-300 leading-relaxed max-w-4xl">
          Week 3 establishes the rigorous theoretical foundation and battle-tested production primitives that separate mid-level engineers from Staff/Principal architects: 
          Raft consensus mechanics, logical vs physical clocks, failure detectors in asynchronous networks, cascading collapse prevention, SLI/SLO mathematical formulations, and multi-region disaster recovery.
        </p>
      </div>

      <!-- The Unified Distributed Systems Architecture Blueprint -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-3 border-b border-[#24314A]/70">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-400 text-[18px]">account_tree</span>
            <span class="text-[12px] font-code font-bold tracking-wider text-purple-400 uppercase">
              THE UNIFIED DISTRIBUTED SYSTEMS RELIABILITY &amp; CONSENSUS BLUEPRINT
            </span>
          </div>
          <span class="text-[11px] font-code text-slate-500">End-to-End Architectural Data Flow</span>
        </div>

        <div class="text-[11px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed bg-[#060911] p-4 rounded-lg border border-[#1E293B]">
 GLOBAL CLIENTS (Worldwide)
       │
       ▼ DNS Anycast (Cloudflare / Route53 BGP Route Convergence &lt; 3s)
 ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
 │ LAYER 1: EDGE CDN &amp; REVERSE PROXY                                                          │
 │ • TLS 1.3 Termination (Zero-RTT resume)   • DDoS Scrubbing (eBPF XDP filter)               │
 │ • Edge Static Asset Caching (Cache-Control: immutable, s-maxage=86400)                     │
 └─────────────────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼ HTTP/2 or gRPC (X-Request-ID, W3C Baggage Distributed Deadline: grpc-timeout=800ms)
 ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
 │ LAYER 2: INGRESS API GATEWAY                                                               │
 │ • Token Bucket Rate Limiting (Redis cluster backplane)                                      │
 │ • Priority Load Shedding: Little's Law (L = lambda * W). Rejects non-critical if queue full │
 │ • Automated Canary Router: ACA statistical gating (1% -&gt; 5% -&gt; 25% -&gt; 100%)                │
 └─────────────────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼ Ingress Traffic to Service Mesh Sidecar (Envoy)
 ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
 │ LAYER 3: SERVICE MESH SIDECAR (ENVOY) &amp; RESILIENCE PRIMITIVES                               │
 │ • Circuit Breaker: 3-State FSM (CLOSED -&gt; OPEN on 50% 5xx -&gt; HALF-OPEN probe after 15s)      │
 │ • Outlier Ejection: Phi-Accrual failure detection (consecutive 5xx ejections)              │
 │ • Exponential Backoff with Full Jitter: Sleep = random(0, min(max_sleep, base * 2^attempt)) │
 │ • Global Retry Budget: Retries strictly capped at &lt;= 10% of total outbound requests         │
 └─────────────────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼ Local Unix Socket / In-Pod RPC
 ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
 │ LAYER 4: COMPUTE SERVICE POD (APPLICATION ENGINE)                                          │
 │ • Bulkhead Thread Pool Isolation: Separate thread pools for payments vs recommendations   │
 │ • Cgroup Enforcement: CFS CPU quotas + Memory limits preventing OOM-kill cascades           │
 │ • Single-Flight Request Coalescing (mutex locks duplicate concurrent read misses)           │
 └─────────────────────────────────────────────────────────────────────────────────────────────┘
       │                                                      │
       │ Distributed Lock / Leader Lease                     │ Mutating Database Transaction
       ▼                                                      ▼
 ┌───────────────────────────────────────────┐  ┌──────────────────────────────────────────────┐
 │ LAYER 5: DISTRIBUTED CONSENSUS (RAFT/ETCD)│  │ LAYER 6: PRIMARY STORAGE &amp; REPLICATION      │
 │ • Raft Majority Quorum: (N/2) + 1 nodes   │  │ • Primary SQL Master (PostgreSQL / Aurora)   │
 │ • Term Numbers + Pre-Vote Protocol        │  │ • Synchronous Intra-Region Multi-AZ Quorum   │
 │ • Generational Fencing Tokens (token=42)  │  │ • Asynchronous Debezium CDC Stream (Kafka)   │
 └───────────────────────────────────────────┘  └──────────────────────────────────────────────┘
                                                              │
                                                              ▼ Transatlantic WAN Stream (Lag: 80ms)
                                                ┌──────────────────────────────────────────────┐
                                                │ LAYER 7: MULTI-REGION READ REPLICAS          │
                                                │ • Local Read Replicas (Frankfurt / Tokyo)    │
                                                │ • Read-Your-Own-Writes Session Watermarking  │
                                                │ • STONITH Fencing on Automated Failover      │
                                                └──────────────────────────────────────────────┘
        </div>
      </div>

      <!-- Architectural Problem-to-Primitive Decision Matrix -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="font-code text-[12px] font-bold text-slate-300 uppercase tracking-wider">
            ARCHITECTURAL PROBLEM &rarr; DISTRIBUTED PRIMITIVE DECISION MATRIX
          </span>
          <span class="text-[11px] font-code text-slate-500">10 Core Architectural Scenarios</span>
        </div>
        <div class="flex flex-col gap-3.5">
          ${patternMatrix.map((item, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2.5 font-sans">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="font-code text-[13px] font-bold text-amber-300 flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[11px]">#0${idx + 1}</span>
                  ${item.trigger}
                </span>
                <span class="text-[11.5px] font-code text-cyan-400 font-semibold">${item.reachFor}</span>
              </div>
              
              <div class="text-[12px] text-slate-300 bg-[#0A0E1A] p-3 rounded-lg border border-slate-800 leading-relaxed">
                <strong class="text-white font-mono">Operational Mechanism:</strong> ${item.howItWorks}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px] pt-1">
                <div class="bg-[#141C2E] border border-cyan-500/30 p-3 rounded-lg flex flex-col gap-1">
                  <span class="font-code text-cyan-300 font-bold">Staff Engineering Rationale (Why this beats alternatives):</span>
                  <p class="text-slate-300 text-[11.5px] leading-relaxed">${item.whyChosen}</p>
                </div>
                <div class="bg-[#1C1322] border border-rose-500/30 p-3 rounded-lg flex flex-col gap-1">
                  <span class="font-code text-rose-300 font-bold">Catastrophic Failure Prevented:</span>
                  <p class="text-slate-300 text-[11.5px] leading-relaxed">${item.prevents}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Consensus Protocols Deep-Dive Comparison -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[12px] font-bold text-slate-300 uppercase tracking-wider">
          CONSENSUS PROTOCOLS: RAFT VS MULTI-PAXOS VS TWO-PHASE COMMIT (2PC)
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/5">Consensus Protocol</th>
                <th class="p-3 w-1/6">Leadership Model</th>
                <th class="p-3 w-1/8">Quorum Math</th>
                <th class="p-3 w-1/4">Commit Replication Path</th>
                <th class="p-3 w-1/4">Split-Brain Defense &amp; Trade-off</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${consensusComparison.map(c => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${c.protocol}</td>
                  <td class="p-3 text-slate-200 font-sans text-[11.5px]">${c.leadership}</td>
                  <td class="p-3 text-amber-300 font-mono text-[11.5px]">${c.quorum}</td>
                  <td class="p-3 text-slate-300 leading-relaxed text-[11.5px]">${c.commitPath}</td>
                  <td class="p-3 text-slate-300 leading-relaxed text-[11.5px]">
                    <span class="text-emerald-400 font-mono">${c.splitBrainDefense}</span>
                    <div class="text-rose-400 font-mono text-[10.5px] pt-1">Trade-off: ${c.tradeoff}</div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Time, Causality & Ordering Hierarchy -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="font-code text-[12.5px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">schedule</span>
            TIME, CAUSALITY &amp; ORDERING: FROM WALL CLOCKS TO TRUETIME
          </span>
          <span class="text-[11px] font-code text-slate-500">Distributed Physics</span>
        </div>

        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          In distributed systems, physical clocks cannot determine true causality because Network Time Protocol (NTP) drift (typically 5ms to 100ms) 
          is orders of magnitude larger than typical LAN message transit times. 
          Architects select an ordering primitive based on required consistency guarantees:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-[12px] pt-1">
          <div class="bg-[#0A0E1A] border border-slate-800 p-3.5 rounded-lg flex flex-col gap-1.5">
            <span class="font-code font-bold text-rose-400">1. Physical Clock (NTP)</span>
            <span class="text-[10.5px] font-mono text-slate-400">Time-of-Day (gettimeofday)</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Subject to clock steps, leap second smearing, and unsynchronized drift. Completely unsafe for ordering distributed transactions.</p>
          </div>
          <div class="bg-[#0A0E1A] border border-slate-800 p-3.5 rounded-lg flex flex-col gap-1.5">
            <span class="font-code font-bold text-amber-300">2. Lamport Logical Clocks</span>
            <span class="text-[10.5px] font-mono text-slate-400">Scalar Monotonic Counter</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Provides a total order consistent with causality (If A -&gt; B, then L(A) &lt; L(B)). Cannot determine concurrency: if L(A) &lt; L(B), A may or may not have caused B.</p>
          </div>
          <div class="bg-[#0A0E1A] border border-slate-800 p-3.5 rounded-lg flex flex-col gap-1.5">
            <span class="font-code font-bold text-cyan-300">3. Vector Clocks</span>
            <span class="text-[10.5px] font-mono text-slate-400">Array of Counters per Node</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Uniquely detects concurrent conflicting writes across masterless nodes. Incurs storage and wire-transfer size overhead proportional to cluster size N.</p>
          </div>
          <div class="bg-[#0A0E1A] border border-slate-800 p-3.5 rounded-lg flex flex-col gap-1.5">
            <span class="font-code font-bold text-emerald-400">4. Google TrueTime</span>
            <span class="text-[10.5px] font-mono text-slate-400">GPS + Atomic Clocks [t.earliest, t.latest]</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Bounds physical uncertainty to delta &lt;= 7ms. Leaders wait out 2*delta before commit, achieving global linearizable transactions without multi-region locking.</p>
          </div>
        </div>
      </div>

      <!-- Staff Engineer Latency Envelope Cheat Sheet -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="font-code text-[12px] font-bold text-slate-300 uppercase tracking-wider">
            STAFF ENGINEER LATENCY ENVELOPE: PHYSICAL &amp; CLOUD BOUNDARIES
          </span>
          <span class="text-[11px] font-code text-slate-500">Every Architect Must Memorize</span>
        </div>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/3">Hardware / Network Operation</th>
                <th class="p-3 w-1/4">Latency Magnitude</th>
                <th class="p-3 w-2/5">Architectural Implication &amp; Budget Impact</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${latencyNumbers.map(n => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${n.operation}</td>
                  <td class="p-3 text-amber-300 font-mono text-[11.5px]">${n.latency}</td>
                  <td class="p-3 text-slate-300 leading-relaxed text-[11.5px]">${n.scale}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4 Real-World Cascading Failure Post-Mortems -->
      <div class="bg-[#141C2E] border border-rose-500/30 rounded-xl p-5 flex flex-col gap-4 font-sans">
        <div class="flex items-center gap-2 pb-2 border-b border-[#24314A]/70">
          <span class="material-symbols-outlined text-rose-400 text-[20px]">report_problem</span>
          <span class="font-code text-[12.5px] font-bold text-rose-300 uppercase tracking-wider">
            FOUR CLASSIC DISTRIBUTED SYSTEMS DISASTERS &amp; ARCHITECTURAL REMEDIATION
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
            <span class="font-code font-bold text-amber-300">1. The Long GC Pause &amp; Stale Lock Disaster</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">
              <strong>Scenario:</strong> Client 1 acquires a 10s distributed lease in Redis to write a file to S3. Client 1 experiences a 15s Full GC pause. The lock expires; Client 2 acquires the lock and begins writing. Client 1 wakes up and completes its write, silently corrupting Client 2's data.
            </p>
            <div class="mt-auto pt-2 border-t border-slate-700/50 text-[11px] text-emerald-400 font-code">
              Architectural Fix: Fencing tokens. Redis or Raft increments token on each lease grant (token 1, token 2). Storage rejects writes with token &lt; current highest token.
            </div>
          </div>

          <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
            <span class="font-code font-bold text-cyan-300">2. The Synchronous Retry Amplification Storm</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">
              <strong>Scenario:</strong> A downstream database experiences a temporary 10% latency hiccup. 50 upstream microservices with 3 un-jittered retries immediately retry every failed query, turning 10,000 QPS into 40,000 QPS. Downstream crashes completely.
            </p>
            <div class="mt-auto pt-2 border-t border-slate-700/50 text-[11px] text-emerald-400 font-code">
              Architectural Fix: Exponential backoff with Full Jitter, Circuit Breaker state machines, and a strict Global Retry Budget capping retries to &lt;= 10% of total outbound volume.
            </div>
          </div>

          <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
            <span class="font-code font-bold text-purple-300">3. The Split-Brain Double-Promotion Outage</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">
              <strong>Scenario:</strong> A WAN fiber cut isolates US-East from US-West. Automated monitoring in US-West assumes US-East is dead and promotes its replica to Primary. US-East is still alive and accepting writes from EU/US users. Data diverges irrecoverably.
            </p>
            <div class="mt-auto pt-2 border-t border-slate-700/50 text-[11px] text-emerald-400 font-code">
              Architectural Fix: Require a 3-region consensus quorum (e.g., third region acts as tie-breaking witness) and enforce STONITH (Shoot The Other Node In The Head) fencing on the old primary.
            </div>
          </div>

          <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
            <span class="font-code font-bold text-rose-300">4. The Kafka Poison Pill Consumer Stall</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">
              <strong>Scenario:</strong> A producer writes a malformed JSON payload into a partition. The consumer crashes during deserialization, restarts, re-reads the same offset, and crashes again in an infinite loop. The partition falls behind by millions of messages.
            </p>
            <div class="mt-auto pt-2 border-t border-slate-700/50 text-[11px] text-emerald-400 font-code">
              Architectural Fix: Dead-Letter Queue (DLQ) pattern. Catch deserialization exceptions, route the poison message to a DLQ topic with error metadata, commit the offset, and proceed.
            </div>
          </div>
        </div>
      </div>

      <!-- Key Interview Takeaway -->
      <div class="bg-gradient-to-r from-purple-950/60 to-cyan-950/60 border border-purple-500/40 rounded-xl p-5 flex flex-col gap-2">
        <span class="font-code text-[11px] text-purple-400 uppercase font-bold tracking-wider">
          SUMMARY: SENIOR &amp; STAFF SYSTEM DESIGN ARCHITECTURE PRINCIPLES
        </span>
        <p class="font-sans text-[13.5px] text-white font-medium leading-relaxed">
          "Consensus replicates decisions and metadata, not bulk data workloads. 
          Every remote network call is fundamentally a failure waiting to happen: protect it with a distributed deadline, exponential backoff with full jitter, a circuit breaker, a retry budget, and a graceful degraded fallback. 
          Never trust physical clocks to establish causality in distributed systems; rely on Hybrid Logical Clocks or TrueTime uncertainty intervals. 
          In multi-region designs, network traffic steering is instantaneous via BGP Anycast, while data consistency and split-brain fencing are where architectural mastery is proven. 
          And remember: an untested resilience pattern or disaster recovery plan is merely an unverified hypothesis waiting to collapse under production stress."
        </p>
      </div>

    </div>
  `;
}
