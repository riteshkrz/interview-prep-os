/**
 * Idempotency Keys and Exactly-Once Effects (Topic 13.2)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 165–167
 */

export function renderIdempotencyContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="idempotency-keys">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 13.2 · Pages 165–167
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Distributed Correctness
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Atomic State Machine · Concurrency Locking · Payment Safety</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Idempotency Keys & Exactly-Once Processing Effects</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Networks provide no physical mechanism to differentiate between <em>"the request failed before reaching the server"</em> and <em>"the server processed the request, but the network dropped the response"</em>. Every client retry is therefore a potential duplicate. Idempotency is what turns at-least-once network retries into exactly-once business effects.
      </p>
    </div>

    <!-- Idempotency Key State Machine Diagram -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The Idempotency Key State Machine & Race Defense (Page 166)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
   Request arrives with HTTP Header: [ Idempotency-Key: k ]
     │
     ▼
   ATOMIC INSERT (key=k, state=IN_PROGRESS) ──► DB Unique Constraint on 'key'
     │
     ├─► INSERT SUCCEEDED (First attempt seen)
     │     │
     │     ▼
     │   Execute Business Logic (e.g. Charge Stripe / Reserve Inventory)
     │     │
     │     ├─ SUCCESS ──► UPDATE state=COMPLETED, store cached response_body ──► Return 200 OK
     │     │
     │     └─ FAILURE ──► UPDATE state=FAILED (or DELETE key) ────────────────► Return 5xx (Retry allowed)
     │
     └─► CONFLICT DETECTED (Key 'k' already exists in DB) ──► Inspect Current State:
           │
           ├─ COMPLETED   ──► Return STORED CACHED RESPONSE immediately! (Never re-execute)
           ├─ IN_PROGRESS ──► Return HTTP 409 Conflict / "Operation in progress, retry shortly"
           └─ FAILED      ──► Allow a fresh attempt to proceed

   WHY THE 'IN_PROGRESS' STATE MATTERS:
   Two identical concurrent requests can hit your cluster at the exact same millisecond.
   Without an atomic claim row, both pass a read check and both execute, resulting in a DOUBLE CHARGE!
</pre>
      </div>
    </div>

    <!-- The 5 Mechanisms Table -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        The 5 Idempotency Mechanisms in Order of Preference (Page 166)
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Mechanism</th>
              <th class="p-3 font-semibold text-cyan-300">How It Works</th>
              <th class="p-3 font-semibold text-slate-300">When to Choose It</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">1. Natural Idempotency</td>
              <td class="p-3 text-emerald-300 font-mono">SET status = 'ACTIVE'</td>
              <td class="p-3 text-slate-300"><strong class="text-white">Always prefer this first.</strong> State assignments require zero bookkeeping tables or locks.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">2. Unique Constraint</td>
              <td class="p-3 text-emerald-300 font-mono">PRIMARY KEY (idempotency_key)</td>
              <td class="p-3 text-slate-300"><strong class="text-white">Most robust.</strong> Database engine guarantees atomicity; race conditions are mathematically impossible.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">3. Compare-and-Swap (CAS)</td>
              <td class="p-3 text-cyan-300 font-mono">WHERE version = expected_v</td>
              <td class="p-3 text-slate-300">When operations depend on previous state and concurrent updates must be rejected cleanly.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">4. Dedupe Store with TTL</td>
              <td class="p-3 text-amber-300 font-mono">SETNX key in Redis EX 86400</td>
              <td class="p-3 text-slate-300">Fast, but TTL is a correctness parameter: a premature Redis eviction causes duplicate execution!</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">5. Transactional Outbox</td>
              <td class="p-3 text-cyan-300 font-mono">Entity + Event in 1 SQL Commit</td>
              <td class="p-3 text-slate-300">When publishing events to Kafka without risk of dual-write discrepancies.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Staff Interview Follow-ups -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Staff Interview Follow-ups (Page 167)
      </h3>
      <div class="space-y-3 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q1: How do you make a counter increment (+1) idempotent?</h4>
          <p class="text-slate-300 leading-relaxed">
            You cannot make <code class="text-pink-300">counter = counter + 1</code> naturally idempotent. Change the shape of the problem: turn the delta into an immutable fact event (<code class="text-cyan-300">UserUpvotedPost{user_id, post_id}</code>). Enforce a unique constraint on <code class="text-slate-100">(user_id, post_id)</code>. Re-inserting the same upvote fails harmlessly, and total count is derived via aggregation. Turn deltas into deduplicated facts!
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q2: How long should idempotency keys be retained, and what breaks when they expire?</h4>
          <p class="text-slate-300 leading-relaxed">
            Keys must be retained longer than the maximum realistic retry window — including mobile clients buffering transactions offline for days, and Kafka consumers replaying a partition from an offset hours ago. When an idempotency key expires from the database, a late duplicate appears brand new and executes a second time! The TTL is a correctness parameter, which is why a volatile Redis cache without persistent backing is dangerous for financial transactions.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 167)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Networks guarantee at-least-once delivery; idempotency converts this into exactly-once processing effects. Implement idempotency keys as an atomic state machine with an IN_PROGRESS claim row to defeat concurrency races, return stored responses on completion, and size key retention beyond the maximum client retry window."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
