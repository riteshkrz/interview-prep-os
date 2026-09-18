/**
 * 4.7 Consistent Hashing in Distributed Caching and Storage - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 61 and 62
 * from The Modern System Design Interview Guide.
 */

export function renderConsistentHashingContent(topic) {
  const vnodeComparisons = [
    {
      feature: "Key Distribution Uniformity",
      withoutVnodes: "Terrible (Standard deviation up to 40% variance)",
      withVnodes: "Near-Perfect (< 3% variance across cluster)",
      statusClass: "text-emerald-400 font-bold"
    },
    {
      feature: "Node Crash Blast Radius",
      withoutVnodes: "100% of failed node's traffic cascades onto single clockwise neighbor",
      withVnodes: "Failed load is evenly dispersed across ALL remaining peers",
      statusClass: "text-emerald-400 font-bold"
    },
    {
      feature: "Heterogeneous Hardware",
      withoutVnodes: "Impossible (Every node must have identical capacity)",
      withVnodes: "Proportional weighting (Allocate 2x vnodes to 2x RAM machine)",
      statusClass: "text-emerald-400 font-bold"
    },
    {
      feature: "Routing Table Memory & Lookup",
      withoutVnodes: "Negligible memory ($O(N)$), fast lookup",
      withVnodes: "Moderate memory ($O(N \\times V)$ tokens), $O(\\log(NV))$ binary search",
      statusClass: "text-amber-400"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the mathematical proof that consistent hashing remaps only K/N keys during cluster resizing?",
      answer: `In traditional modulo hashing: <code>server_idx = hash(key) mod N</code>.
      <br/><br/>
      When $N$ changes to $N+1$ (adding a node), virtually every single key's modulo value changes:
      $$\\text{Fraction of keys remapped} = \\frac{N}{N+1} \\approx 80\\% \\text{ to } 99\\%$$
      In a cache cluster with 10 million items, adding 1 node forces 8 to 9 million cache misses simultaneously $\to$ instantaneous database connection collapse (thundering herd).
      <br/><br/>
      <strong class="text-indigo-400">The Consistent Hashing Guarantee:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>The ring space $[0, 2^{32}-1]$ is fixed and infinite relative to $N$.</li>
        <li>Adding a new node $N_{new}$ claims only the arc between itself and its counter-clockwise neighbor.</li>
        <li>Only the keys that fall precisely within that newly claimed arc are remapped to $N_{new}$.</li>
        <li>On average, the expected fraction of keys that move is strictly $\\mathbf{K / N}$ (where $K$ is total keys, $N$ is total nodes). All remaining $(N-1)/N$ keys remain pinned to their original servers!</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How do virtual nodes (vnodes) enable clusters with heterogeneous hardware capacity to share load fairly?",
      answer: `In production, physical servers are rarely identical: older hardware might have 32GB RAM while newly provisioned instances have 128GB RAM.
      <br/><br/>
      <strong class="text-indigo-400">Weighted Virtual Node Allocation:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Instead of assigning a fixed number of vnodes per machine, define a weight factor $W_i$:
        <br/>
        <code>vnode_count = base_vnodes * (server_capacity / baseline_capacity)</code></li>
        <li>A 32GB server is assigned <strong>100 vnodes</strong> on the ring.</li>
        <li>A 128GB server is assigned <strong>400 vnodes</strong> on the ring.</li>
        <li>Because keys hash uniformly across the $[0, 2^{32}-1]$ address space, the 128GB server naturally owns $4\\times$ as many arcs on the ring and receives $4\\times$ as much traffic, perfectly proportional to its hardware specs without manual partitioning.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How do Cassandra and DynamoDB use consistent hashing to handle replication and quorum read/writes?",
      answer: `In leaderless peer-to-peer storage engines (Amazon Dynamo, Apache Cassandra), consistent hashing handles both partitioning and multi-datacenter replication.
      <br/><br/>
      <strong class="text-indigo-400">The Preference List Protocol:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Coordinator Node:</strong> A client query hits any random node in the cluster (acting as coordinator). The coordinator hashes the row partition key onto the ring.</li>
        <li><strong>Preference List of N Nodes:</strong> Starting at the key's position, the coordinator walks clockwise and selects the first $N$ <em>distinct physical machines</em> (skipping duplicate vnodes belonging to the same host) to form the replica preference list.</li>
        <li><strong>Quorum Writes ($W$):</strong> The coordinator sends the write to all $N$ nodes in parallel. Once $W$ nodes acknowledge (e.g. $W = \\lfloor N/2 \\rfloor + 1$ for majority), the client receives success.</li>
        <li><strong>Quorum Reads ($R$):</strong> The coordinator queries $R$ nodes, compares timestamps/vector clocks, resolves conflicts via Read Repair, and returns the freshest data. As long as $R + W > N$, strong linearizable reads are mathematically guaranteed.</li>
      </ol>`
    },
    {
      qNum: "Q4",
      question: "What exact data structure and algorithm is used to look up keys on the ring in O(log V) time?",
      answer: `A naive linear scan across millions of ring tokens would be far too slow for microsecond routing.
      <br/><br/>
      <strong class="text-indigo-400">Implementation in Production (Java / Go / Rust):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Self-Balancing Binary Search Tree / Red-Black Tree:</strong> In Java, use <code>java.util.TreeMap&lt;Long, Node&gt;</code>. In Go or Rust, use a sorted slice of token hashes <code>[]uint32</code> paired with binary search (<code>sort.Search</code>).</li>
        <li><strong>Lookup Algorithm:</strong>
          <pre class="bg-[#050811] p-2 rounded text-[11px] text-cyan-300 border border-slate-800 mt-1">
long keyHash = hash(key);
Map.Entry&lt;Long, Node&gt; entry = ring.ceilingEntry(keyHash);
if (entry == null) {
    entry = ring.firstEntry(); // Wrap around clockwise to ring start!
}
return entry.getValue();</pre>
        </li>
        <li><strong>Time Complexity:</strong> $O(\\log(N \\times V))$ where $N$ is physical servers and $V$ is vnodes per server (e.g., $\\approx \\log_2(100 \\times 200) \\approx 14$ comparisons $\\to$ sub-microsecond execution).</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 61, 62: CONSISTENT HASHING IN DISTRIBUTED CACHING & STORAGE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.7 Consistent Hashing in Distributed Caching and Storage
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            In distributed caching (Memcached, Redis) and peer-to-peer storage (Cassandra, DynamoDB), keys must be routed across $N$ servers. Naive modulo hashing (<code>hash(key) % N</code>) breaks down when servers are added or removed, causing <strong class="text-rose-400">up to 90%+ of all keys to remap</strong>, devastating cache hit rates. <strong class="text-indigo-400">Consistent Hashing</strong> maps both servers and data keys onto a continuous circular ring, ensuring that scaling the cluster moves only a tiny fraction ($K/N$) of keys.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-rose-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-rose-300 uppercase">1. Modulo Hashing Flaw</span>
              <span class="text-[12px] text-slate-300"><code>hash(key) % N</code> causes catastrophic rehash cascades when $N$ changes. Invalidate the whole cache $\to$ thundering herd on DB.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. The 32-Bit Hash Ring</span>
              <span class="text-[12px] text-slate-300">Keyspace $[0, 2^{32}-1]$ wraps around in a circle. Keys route clockwise to the first encountered physical node token.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">3. Virtual Nodes (Vnodes)</span>
              <span class="text-[12px] text-slate-300">Each physical host gets 100–256 tokens scattered across the ring, preventing non-uniform hotspots and evening failure cascades.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Hash Ring Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              THE CONSISTENT HASH RING WITH VIRTUAL NODES (0 TO 2^32 - 1)
            </span>
            <span class="text-slate-500 text-[10.5px]">Clockwise Key Traversal</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
                                   0 / 2^32 - 1
                                   [ Node A-0 ]
                                  /            \\
                      [ Key 1 ]  /              \\  [ Node B-0 ]
                                /                \\
                    [ Node D-0 ]                  \\    [ Key 2 ]
                         |                         |
                         |     CLOCKWISE ( ↻ )     |
                         |                         |
                    [ Node B-1 ]                  /    [ Node C-0 ]
                                \\                /
                      [ Key 4 ]  \\              /  [ Key 3 ]
                                  \\            /
                                   [ Node A-1 ]

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ KEY ASSIGNMENT & RESIZING MECHANICS:                                                             │
│ • Key 1 hashes to pos 10,000  ──► Moves clockwise ──► Stored on [ Node B-0 ]                     │
│ • Key 2 hashes to pos 800,000 ──► Moves clockwise ──► Stored on [ Node C-0 ]                     │
│                                                                                                  │
│ NODE FAILURE SCENARIO (Node C Dies):                                                             │
│ • Without Vnodes: All of Node C's keys suddenly crash onto Node A (Cascading neighbor failure!)   │
│ • With Vnodes: Node C's tokens (C-0, C-1, C-2...) were interleaved across the entire circle!     │
│   When Node C dies, its load is evenly dispersed across Node A, Node B, and Node D (33% each)!   │
│                                                                                                  │
│ NODE ADDITION SCENARIO (Node E is Added):                                                        │
│ • Only keys in the specific arcs preceding Node E's tokens move to Node E.                       │
│ • Exactly K / N keys move! The remaining (N-1)/N keys remain 100% cached on existing nodes!      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Strategy Table: Virtual Nodes Comparison -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Architectural Impact of Virtual Nodes (Vnodes)
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Architectural Dimension</th>
                  <th class="p-3">Naive Ring (1 Token / Node)</th>
                  <th class="p-3">Ring With Vnodes (150+ Tokens / Node)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${vnodeComparisons.map(v => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">${v.feature}</td>
                    <td class="p-3 text-slate-400">${v.withoutVnodes}</td>
                    <td class="p-3 ${v.statusClass}">${v.withVnodes}</td>
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
            SENIOR PERSPECTIVE: MULTI-REGION REPLICATION ON THE RING
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In storage engines like Apache Cassandra and Amazon DynamoDB, Consistent Hashing is never used merely for single-server lookup—it is the foundation of <strong class="text-emerald-300">Fault-Tolerant Multi-Replica Placement</strong>.
            </p>
            <p>
              When placing replicas (replication factor $N = 3$), the ring coordinator does <em>not</em> simply pick the next 3 tokens clockwise. Because those tokens might belong to the same physical host or the same availability zone, the coordinator inspects the topology and walks the ring until it selects <strong>3 distinct physical hosts across 3 separate failure domains (racks or AZs)</strong>.
            </p>
            <p>
              Furthermore, cluster membership is maintained without a single point of failure using a <strong class="text-white">Gossip Protocol</strong> (Scuttlebutt): nodes ping random peers every second to maintain ring state and detect dead nodes via $\phi$-accrual failure detectors.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - WHAT CONSISTENT HASHING DOES NOT SOLVE -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            WHAT CONSISTENT HASHING DOES NOT SOLVE: HOT KEYS & VIRAL CELEBRITY ITEMS
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              <strong class="text-white">Consistent Hashing distributes the KEYSPACE, NOT the request volume.</strong> If you have 10 million uniform keys, consistent hashing distributes them beautifully with &lt;3% variance.
            </p>
            <p>
              However, if a world-famous celebrity tweets, or a flash sale begins on item <code>SKU-999</code>, that key will generate <strong>500,000 requests per second</strong>. Because <code>hash("SKU-999")</code> produces a single immutable integer on the ring, <strong>100% of that massive traffic will hit exactly ONE server</strong>. That server will melt while the rest of the cluster sits completely idle.
            </p>
            <p>
              <strong class="text-amber-300">The Senior Interview Answer:</strong> State plainly that consistent hashing cannot solve hot keys. Mitigate hot keys via <strong>Application-Level Key Salting</strong> (e.g. appending <code>_1.._10</code> to write to multiple nodes), <strong>In-Process Local Caches</strong> (Guava/Caffeine in the API gateway), or <strong>Read-Through Edge CDNs</strong>.
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
            Consistent hashing plus virtual nodes provides smooth, elastic horizontal membership where resizing a cluster moves only $K/N$ keys instead of causing catastrophic mass rehash stampedes. In interviews, emphasize virtual nodes for failure dispersal, binary search for $O(\log V)$ routing, and explicitly call out that consistent hashing cannot solve single hot keys without application salting or in-memory L1 caching.
          </p>
        </div>

        <!-- Page 62 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 62</span>
        </div>

      </div>

    </div>
  `;
}
