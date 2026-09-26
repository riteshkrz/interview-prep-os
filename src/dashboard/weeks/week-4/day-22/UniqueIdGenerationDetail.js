/**
 * 4.10 Generating Globally Unique IDs - Visual Guide
 * High-signal, visually rich reproduction of Pages 57–59
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderUniqueIdGenerationContent(topic) {
  const approaches = [
    {
      approach: "Database Auto-Increment",
      unique: "Yes",
      timeOrdered: "Yes",
      scale: "Single write point bottleneck",
      verdict: "Fails 'highly scalable'; leaks daily transaction volume to competitors.",
      color: "text-rose-400"
    },
    {
      approach: "UUID v4 (128-bit Random)",
      unique: "Yes (Astronomical collision resistance)",
      timeOrdered: "No (Random)",
      scale: "Infinite (Zero coordination)",
      verdict: "Fails numeric-only, 64-bit, and ordering; random inserts fragment B-tree page caches (sec. 4.9).",
      color: "text-amber-400"
    },
    {
      approach: "Ticket Server (Flickr model)",
      unique: "Yes",
      timeOrdered: "Yes",
      scale: "Better with batched ranges",
      verdict: "Central single point of failure (SPOF) and network hop per ID batch.",
      color: "text-indigo-400"
    },
    {
      approach: "Twitter Snowflake (64-bit)",
      unique: "Yes",
      timeOrdered: "Yes (Sortable by ms)",
      scale: "Local generation (No coordination per ID)",
      verdict: "Meets all five requirements — the industry standard expected answer.",
      color: "text-emerald-400"
    }
  ];

  const followUps = [
    {
      q: "Why is 'roughly time-ordered' a hard requirement in production database systems?",
      a: "Three architectural reasons: 1) <strong>B-tree write performance (sec. 4.9):</strong> monotonic time-ordered IDs append strictly to the rightmost leaf page of the primary key index, preventing expensive random page splits and maximizing buffer pool caching; random UUID v4 thrashes disk pages; 2) <strong>Cursor-based pagination:</strong> <code>WHERE id &gt; last_seen_id ORDER BY id LIMIT 20</code> is clean and constant-time; 3) <strong>Natural time partitioning:</strong> IDs can be range-partitioned without secondary timestamp lookups."
    },
    {
      q: "What are the two catastrophic failure modes of Snowflake generators and how do you prevent them?",
      a: "<strong>1) Clock Skew / NTP Step-Back:</strong> If the server's physical wall-clock jumps backwards (leap seconds, NTP corrections), the generator can re-issue IDs already minted! Fix: refuse to generate and sleep while <code>now_ms &lt; last_ms</code>, or leverage a monotonic logical counter with a persisted high-water mark.<br/><strong>2) Machine ID Collisions:</strong> If two container nodes in Kubernetes boot with identical Machine IDs, they will silently mint duplicate primary keys. Fix: allocate machine IDs dynamically via short-term leases from ZooKeeper, etcd, or Consul."
    },
    {
      q: "Snowflake IDs are sequential and enumerable. Is that an operational security risk?",
      a: "<strong>Yes, in public-facing interfaces.</strong> Sequential IDs allow competitors or scrapers to deduce business volume (e.g., measuring order IDs over 24 hours reveals total company sales) and allow attackers to enumerate resources. <em>The senior fix:</em> keep the 64-bit Snowflake ID internal for database indexing, and expose an encrypted or HMAC-masked string (or UUID v7 / Sqids) in public URLs."
    },
    {
      q: "When would you prefer UUID v7 or ULID over Snowflake?",
      a: "When IDs must be <strong>generated client-side (mobile/browser) or offline without a central machine-ID coordination cluster</strong>, or when 128-bit string keys are acceptable. UUID v7 and ULID embed a 48-bit millisecond timestamp followed by random bits, achieving lexicographic sortability without requiring ZooKeeper machine ID lease management."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="4.10-unique-id">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Part 4 · Databases &amp; Consistency
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 57–59 · Section 4.10</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          4.10 Generating Globally Unique IDs (Twitter Snowflake)
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          How distributed systems mint billions of collision-free, roughly time-ordered, 64-bit numeric identifiers at microsecond latency without a central database coordinator.
        </p>
      </div>

      <!-- Core Requirements List -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-2.5 font-sans">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3 flex flex-col gap-1 text-center">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase">Globally Unique</span>
          <span class="text-[11.5px] text-slate-300">Across all regions &amp; nodes</span>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3 flex flex-col gap-1 text-center">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase">Time-Ordered</span>
          <span class="text-[11.5px] text-slate-300">Natural index sorting</span>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3 flex flex-col gap-1 text-center">
          <span class="font-code text-[11px] font-bold text-indigo-400 uppercase">64-Bit Numeric</span>
          <span class="text-[11.5px] text-slate-300">Fits BIGINT primary key</span>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3 flex flex-col gap-1 text-center">
          <span class="font-code text-[11px] font-bold text-purple-400 uppercase">Ultra High QPS</span>
          <span class="text-[11.5px] text-slate-300">Millions of IDs / sec</span>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3 flex flex-col gap-1 text-center col-span-2 md:col-span-1">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase">Zero Network Hop</span>
          <span class="text-[11.5px] text-slate-300">Local in-process generation</span>
        </div>
      </div>

      <!-- Snowflake 64-bit Layout Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            SNOWFLAKE 64-BIT BINARY LAYOUT
          </span>
          <span class="text-[11px] font-code text-slate-500">64 Bits Total</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
 1 bit        41 bits                           10 bits          12 bits
┌──────┬───────────────────────────────────┬───────────────┬─────────────────┐
│ sign │     timestamp (milliseconds)      │  machine id   │ sequence counter│
│  0   │   since custom epoch (~69 yrs)    │ (1,024 nodes) │ (4,096 per ms)  │
└──────┴───────────────────────────────────┴───────────────┴─────────────────┘

  • 41 bits timestamp: 2^41 ms ≈ 69.7 years from custom epoch (e.g. 2024-01-01)
  • 10 bits machine ID: 2^10 = 1,024 generator instances across datacenters
  • 12 bits sequence: 2^12 = 4,096 distinct IDs per millisecond per node
  • Total Capacity: ~4.1 Million IDs per second per machine node with ZERO lock contention!
        </div>

        <!-- Generation Algorithm Code -->
        <div class="bg-[#060911] border border-[#1E293B] rounded-lg p-3 text-cyan-200/90 text-[11.5px] whitespace-pre overflow-x-auto">
// Generation is 100% local: NO network call on the ID path!
if (now_ms == last_ms) {
    seq = (seq + 1) & 4095;
    if (seq == 0) wait_until_next_millisecond(); // exhausted 4,096 IDs in this ms
} else {
    seq = 0;
    last_ms = now_ms;
}
id = ((now_ms - CUSTOM_EPOCH) &lt;&lt; 22) | (machine_id &lt;&lt; 12) | seq;
        </div>
      </div>

      <!-- Candidate Approaches Compared -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          THE FOUR CANDIDATE APPROACHES COMPARED
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/4">Candidate Approach</th>
                <th class="p-3 w-1/8">Unique?</th>
                <th class="p-3 w-1/8">Sortable?</th>
                <th class="p-3 w-1/4">Scalability Profile</th>
                <th class="p-3 w-1/3">Architectural Verdict</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${approaches.map(a => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-slate-200 font-code text-[12px]">${a.approach}</td>
                  <td class="p-3 text-emerald-300 font-mono text-[11px]">${a.unique}</td>
                  <td class="p-3 text-slate-300 font-mono text-[11px]">${a.timeOrdered}</td>
                  <td class="p-3 text-slate-300">${a.scale}</td>
                  <td class="p-3 font-medium ${a.color}">${a.verdict}</td>
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
      <div class="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Restate the requirements — unique, roughly sortable, 64-bit numeric, zero network coordination per ID — and Snowflake falls out as the answer. Then volunteer the two hard failure modes: clock skew and machine-ID collision."
        </p>
      </div>

    </div>
  `;
}
