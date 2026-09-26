/**
 * 10.3 Conflict Resolution & Anti-Entropy - Visual Guide
 * High-signal, visually rich reproduction of Pages 134–137
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderConflictResolutionContent(topic) {
  const crdts = [
    { type: "G-Counter", use: "Increment-only metrics, video views, like counts", catch: "One counter per replica; total value is the sum." },
    { type: "PN-Counter", use: "Counters that go up and down (shopping cart items)", catch: "Two G-Counters. CANNOT enforce 'never below zero' — not for inventory!" },
    { type: "LWW-Register", use: "Single scalar value with latest timestamp", catch: "Still last-write-wins; silent data loss if clocks drift (sec. 10.2)." },
    { type: "OR-Set", use: "Sets with add and remove operations (tags, members)", catch: "Removals generate tombstones, which accumulate until compacted." },
    { type: "RGA / Sequence", use: "Collaborative rich text editing (Figma / Notion)", catch: "Metadata per character; requires periodic garbage collection." }
  ];

  const followUps = [
    {
      q: "Why are deletes the hardest operation in an eventually consistent distributed datastore?",
      a: "Because in a distributed system, <strong>'absent' and 'deleted' are completely indistinguishable</strong>. If node A simply purges a deleted row from disk, an anti-entropy Merkle repair with node B (which still holds the row) will conclude node A is missing data and <em>resurrect the deleted record</em>! Therefore, deletions must be written as <strong>tombstones</strong> — markers with timestamps that suppress older copies. Tombstones must outlive the maximum divergence window before being permanently purged."
    },
    {
      q: "Read Repair versus Scheduled Merkle Anti-Entropy — why do you need both?",
      a: "<strong>Read repair is opportunistic and cheap</strong>, but it only repairs data that someone actually queries. Cold data (historical records, dormant user profiles) is never read and will silently diverge indefinitely. When a catastrophic disk failure occurs, the stale replica is suddenly promoted, surfacing corrupted stale data. <strong>Merkle tree background repair</strong> scans the entire keyspace periodically (off-peak) using $O(\\log N)$ hierarchical hashes, ensuring cold data never rots."
    },
    {
      q: "Can you use a CRDT counter to manage inventory in a flash sale?",
      a: "<strong>No, and this is the classic interview trap.</strong> CRDTs guarantee <em>eventual convergence</em>, not business invariant correctness. If two warehouse nodes each have 1 item left in stock and simultaneously accept an order, a PN-Counter will converge perfectly on <code>-1</code>, violating the business constraint. Inventory decrements require <strong>pessimistic locking, single-owner partitioning, or atomic database constraints (CHECK stock &gt;= 0)</strong> (sec. 9.6)."
    },
    {
      q: "How do you keep Vector Clock or CRDT metadata from growing indefinitely?",
      a: "Vector clocks grow with the number of participating nodes. Prevent unbounded memory expansion through <strong>causal stability pruning</strong>: establish a periodic garbage-collection watermark past which all active replicas have confirmed seeing an update, allowing tombstones and historical vector counters to be pruned safely."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="10.3-anti-entropy">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 10 · Distributed Systems Fundamentals
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 134–137 · Section 10.3</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 25 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          10.3 Conflict Resolution &amp; Anti-Entropy
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Deciding what the value is when replicas disagree, and the background machinery (Read Repair, Hinted Handoff, and Merkle Trees) that brings divergent replicas back into sync.
        </p>
      </div>

      <!-- Four Conflict Strategies Table -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11.5px] font-bold text-rose-400 uppercase">1. Last Write Wins (LWW)</span>
          <p class="text-[11.5px] text-slate-300">Highest wall-clock timestamp survives. Simple, but lossy — silently discards concurrent updates due to clock drift (sec. 10.2).</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11.5px] font-bold text-amber-400 uppercase">2. Application Merge</span>
          <p class="text-[11.5px] text-slate-300">Store retains sibling versions. Read path invokes domain code to merge them (Dynamo's original shopping cart model).</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase">3. CRDTs</span>
          <p class="text-[11.5px] text-slate-300">Conflict-free Replicated Data Types: mathematically provable commutative merges without coordination.</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11.5px] font-bold text-cyan-400 uppercase">4. Operational Transform</span>
          <p class="text-[11.5px] text-slate-300">Rewrites concurrent character operations against each other; requires central ordering server (Google Docs).</p>
        </div>
      </div>

      <!-- Anti-Entropy Architecture Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            THREE ANTI-ENTROPY MECHANISMS (CHEAPEST TO DEEPEST)
          </span>
          <span class="text-[11px] font-code text-slate-500">Cassandra / Dynamo Model</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
① READ REPAIR — Opportunistic on read path
   Client Quorum Read ──► Replica A (v7), Replica B (v7), Replica C (v5 stale)
                           └─► Returns v7 to client, pushes v7 to Replica C asynchronously.
                           Cost: Near-zero overhead. Only fixes data that clients actually query.

② HINTED HANDOFF — Short network disconnect buffer
   Write arrives ──► Replica C is unreachable (network blip)
   Coordinator stores a "hint" locally on disk ──► When C rejoins, coordinator replays hints.
   Cost: Coordinator disk space. Hints expire after a bounded window (e.g. 3 hours).

③ MERKLE TREE SYNC — Full hierarchical comparison for long-term drift
   Replica A Tree            Replica B Tree            COMPARE ROOT HASHES:
       Root H0                   Root H0'              If H0 == H0' ──► In sync (1 hash exchanged!)
       /     \                   /     \               If H0 != H0' ──► Descend only differing branch
     H1       H2               H1       H2'
    /  \     /  \             /  \     /  \
   k1  k2   k3  k4           k1  k2   k3  k4' (k4 differs!) ──► Ship only key range k4!
   Cost: O(log N) hash comparisons instead of transferring gigabytes of raw records.
        </div>
      </div>

      <!-- CRDT Types Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          CRDTS WORTH KNOWING BY NAME
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/4">CRDT Type</th>
                <th class="p-3 w-2/5">Ideal Use Case</th>
                <th class="p-3 w-1/3">The Catch / Trade-off</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${crdts.map(c => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${c.type}</td>
                  <td class="p-3 text-slate-300">${c.use}</td>
                  <td class="p-3 text-rose-300/90">${c.catch}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interview Follow-ups -->
      <div class="flex flex-col gap-3 pt-2">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          INTERVIEW FOLLOW-UPS (SENIOR &amp; STAFF PROBES)
        </span>
        <div class="flex flex-col gap-3">
          ${followUps.map((item, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <span class="font-sans text-[13px] font-bold text-cyan-300">
                Q${idx + 1}: ${item.q}
              </span>
              <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
                ${item.a}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Key Interview Takeaway -->
      <div class="bg-gradient-to-r from-indigo-950/60 to-cyan-950/60 border border-indigo-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Pick the resolution strategy from the data's tolerance for loss: LWW for disposable state, CRDTs where any merge is acceptable, application merge where domain logic is required, and coordination wherever invariants must be enforced. Name the repair loop: read repair for hot data, hinted handoff for blips, Merkle sync for the rest."
        </p>
      </div>

    </div>
  `;
}
