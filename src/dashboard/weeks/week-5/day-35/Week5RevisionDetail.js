/**
 * Week 5 Revision Day 5: Storage, Messaging & Real-Time Whiteboard Drills
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 176–177
 */

export function renderWeek5RevisionContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="week-5-revision">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Revision Day 5 · Week 5 Mastery
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Storage & Real-Time Whiteboard Mocks
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">DynamoDB · S3 · Kafka · WhatsApp · Collaborative Docs</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Revision Day 5: Storage, Messaging & Real-Time Whiteboard Drills</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Mastering large-scale stateful storage, durable asynchronous event streaming, and bidirectional WebSocket tiers. Drill these five advanced architectural blueprints before tackling full mock interviews.
      </p>
    </div>

    <!-- 5 Deep Whiteboard Drills Grid -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        Week 5 Whiteboard Target Drills
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-1.5">
          <strong class="text-cyan-300 block font-bold font-sans">1. WhatsApp / Real-Time Messaging (Spec 7)</strong>
          <p class="text-slate-300 text-[11.5px] font-sans">
            • Gateway tier terminates WebSockets; Redis cluster routes socket IDs to hosts<br/>
            • 3-state delivery machine: Sent (1 tick) &rarr; Delivered (2 grey ticks) &rarr; Read (2 blue ticks)<br/>
            • Ephemeral message spooling: once delivered, messages are purged from server RAM.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-1.5">
          <strong class="text-cyan-300 block font-bold font-sans">2. Planetary S3 Object Storage (Spec 4)</strong>
          <p class="text-slate-300 text-[11.5px] font-sans">
            • Strict architectural separation: immutable data plane vs strongly consistent metadata plane<br/>
            • 8+4 Reed-Solomon Erasure Coding guarantees 11 nines durability at 50% storage overhead<br/>
            • Multipart upload with MD5 ETags and lifecycle rule abort for abandoned chunks.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-1.5">
          <strong class="text-cyan-300 block font-bold font-sans">3. Distributed Key-Value Store / DynamoDB (Spec 2)</strong>
          <p class="text-slate-300 text-[11.5px] font-sans">
            • Consistent hashing ring with 256 virtual nodes per physical host<br/>
            • Tunable quorum consistency: R + W &gt; N ensures strong consistency (e.g. N=3, R=2, W=2)<br/>
            • Anti-entropy synchronization via background Merkle Tree exchange.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-1.5">
          <strong class="text-cyan-300 block font-bold font-sans">4. Collaborative Docs: Google Docs / Figma (Spec 9)</strong>
          <p class="text-slate-300 text-[11.5px] font-sans">
            • Centralized Operational Transformation (OT) for linear text with central sequencer authority<br/>
            • Conflict-Free Replicated Data Types (CRDTs - Yjs/Automerge) for offline-first tree structures<br/>
            • Compaction & tombstone pruning to prevent memory bloat over document editing lifetime.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "For stateful and real-time distributed systems, draw the boundary between connection tiers and application tiers early. Use Redis pub/sub backplanes for cross-server message routing, and isolate high-churn metadata from immutable bulk storage."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
