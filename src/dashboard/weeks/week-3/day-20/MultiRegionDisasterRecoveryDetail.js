/**
 * 12.4 Multi-Region Architecture & Disaster Recovery - Visual Guide
 * High-signal, visually rich reproduction of Pages 155–157
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderMultiRegionDisasterRecoveryContent(topic) {
  const drPatterns = [
    {
      pattern: "Backup & Restore",
      rpo: "Hours",
      rto: "Hours to Days",
      cost: "Lowest ($)",
      desc: "One active region; periodic database snapshots exported to off-region S3/GCS. Fine for non-critical internal apps; catastrophic for financial services."
    },
    {
      pattern: "Pilot Light / Warm Standby",
      rpo: "Seconds to Minutes",
      rto: "Minutes (<15m)",
      cost: "Moderate ($$)",
      desc: "Standby region has continuous database replication active, with a skeletal or zero-scale compute tier that autoscale groups scale up upon regional failover."
    },
    {
      pattern: "Active-Active Reads, Single Writer",
      rpo: "Seconds (Replication lag)",
      rto: "Seconds to Minutes",
      cost: "High ($$$)",
      desc: "Pragmatic industry sweet spot: read replicas deployed across all continents serving local 5ms reads; all mutating writes forwarded to one designated Primary region."
    },
    {
      pattern: "Full Multi-Region Active-Active",
      rpo: "~0 (Zero)",
      rto: "Seconds",
      cost: "Highest ($$$$)",
      desc: "Writes accepted at every global region simultaneously. Requires complex multi-leader conflict resolution (CRDTs, vector clocks, or Spanner TrueTime)."
    }
  ];

  const followUps = [
    {
      q: "Why not make the entire application active-active across all regions?",
      a: "Because accepting writes in two places simultaneously guarantees <strong>concurrent conflicting writes</strong> that must be reconciled (sec. 10.3). While conflict resolution is acceptable for shopping carts, it is disastrous for account balances and inventory stock where invariants cannot be protected by mathematical merge functions. Furthermore, full active-active doubles cloud infrastructure costs and requires bi-directional schema migration compatibility. <strong>The pragmatic senior choice:</strong> local reads with a single write region."
    },
    {
      q: "What is your RPO for a financial payment ledger, and how do you achieve it?",
      a: "<strong>RPO = 0.</strong> A settled payment must never be lost. Within the primary region, commit synchronously to a quorum across three separate Availability Zones before acknowledging the client (sec. 4.4). Replicate asynchronously to a secondary region for disaster recovery, with an explicit acceptance that catastrophic whole-region loss requires <strong>reconstructing the ledger from upstream PSP settlement files and event logs</strong> (sec. 9.4.4)."
    },
    {
      q: "How do you decide which data must be global vs. regional?",
      a: "Classify strictly by access patterns and business invariants: 1) <strong>Global read-heavy data:</strong> Configuration, product catalogs, and permissions replicate globally and cheaply; 2) <strong>User-pinned data:</strong> Data owned by one user (profiles, shopping carts, order history) pins strictly to their home region, satisfying GDPR data residency rules; 3) <strong>Strict global invariants:</strong> Unique usernames and bank account balances shard by key with exactly one authoritative master per partition."
    },
    {
      q: "Your region is degraded but not completely down (30% errors). Do you initiate failover?",
      a: "<strong>Usually not immediately.</strong> Partial 'grey' failures (sec. 10.4) often make failover riskier than staying, because regional failover itself is a massive, rarely exercised state transition. First <strong>shed non-critical load and trip circuit breakers</strong> (sec. 8.2). If failover is necessary, base the decision on pre-agreed criteria tied to the <strong>Error Budget burn rate</strong> (sec. 12.3) rather than an ad-hoc panic decision."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="12.4-multi-region">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Part 12 · Reliability &amp; Operations at Scale
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 155–157 · Section 12.4</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 25 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          12.4 Multi-Region Architecture &amp; Disaster Recovery
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Running in multiple global cloud regions and having a battle-tested strategy for regional evacuation. Traffic steering is solved in seconds with Anycast; the database write path is where the real engineering begins.
        </p>
      </div>

      <!-- The Four Multi-Region Patterns Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          THE FOUR ARCHITECTURAL PATTERNS (ORDERED BY COST &amp; CAPABILITY)
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/4">Architecture Pattern</th>
                <th class="p-3 w-1/6">Target RPO</th>
                <th class="p-3 w-1/6">Target RTO</th>
                <th class="p-3 w-1/6">Cost Profile</th>
                <th class="p-3 w-1/3">Operational Mechanism</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${drPatterns.map(p => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${p.pattern}</td>
                  <td class="p-3 text-amber-300 font-mono text-[11.5px]">${p.rpo}</td>
                  <td class="p-3 text-emerald-300 font-mono text-[11.5px]">${p.rto}</td>
                  <td class="p-3 text-slate-300 font-code text-[11.5px]">${p.cost}</td>
                  <td class="p-3 text-slate-300 leading-relaxed">${p.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Active-Active Reads, Single Writer Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            ACTIVE-ACTIVE READS, SINGLE WRITER (THE PRAGMATIC SWEET SPOT)
          </span>
          <span class="text-[11px] font-code text-slate-500">Cross-Region Topology</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
   EU USER                                          US USER
     │                                                │
     ├── read: 5 ms ──► [ EU REPLICA ]                ├── read: 5 ms ──► [ US REPLICA ]
     │                                                │
     └── write: 90 ms WAN ────────────────────────────┴──► [ US PRIMARY REGION (LEADER) ]
                                                                │
                                                                ▼ async replication
                                                           [ EU REPLICA ] (lag: 10–300 ms)

  • WHAT YOU GET: Reads are lightning fast locally (~5 ms). Exactly ONE authority, so ZERO conflicts.
  • WHAT YOU PAY: Cross-region network round-trip (~90 ms) on write operations for non-primary regions.
  • WHAT YOU MUST HANDLE: Read-After-Write consistency (sec. 4.5). Client must pin to primary for N seconds.
        </div>
      </div>

      <!-- Regional Failover Traps -->
      <div class="bg-[#141C2E] border border-rose-500/30 rounded-xl p-5 flex flex-col gap-3 font-sans">
        <span class="font-code text-[12px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">warning</span>
          REGIONAL FAILOVER IS A DATA PROBLEM, NOT A TRAFFIC PROBLEM
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[12px] text-slate-300">
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-amber-300">Split-Brain Risk</span>
            <p>If two regions lose connectivity and both promote local databases to Primary, data diverges irreversibly. Promotion requires a 3-region consensus quorum (sec. 10.1) or manual human decision + fencing token.</p>
          </div>
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-cyan-300">Failback Complexity</span>
            <p>Failing back to the original region is far harder than failing over, because the old region's storage diverged. Pre-plan reconciliation and expect resynchronization to be a deliberate, throttled procedure.</p>
          </div>
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-indigo-300">Dependency Boot Ordering</span>
            <p>Services must start in exact topological order. If your authentication identity provider lived in the failed region, no service in the recovery region can boot — the control plane trap (sec. 8.4).</p>
          </div>
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-rose-300">Data Sovereignty &amp; GDPR</span>
            <p>Failing European citizen PII over to a US datacenter violates GDPR data residency laws. Disaster recovery design is a legal compliance boundary, not merely a technical choice.</p>
          </div>
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
          "State the pattern with its RPO, RTO and cost, and note that traffic steering takes seconds while the database write path is the real challenge. Default to local reads with a single write leader; and remember: an untested failover is no failover at all."
        </p>
      </div>

    </div>
  `;
}
