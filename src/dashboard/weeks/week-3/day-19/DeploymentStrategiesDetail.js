/**
 * 8.1 Deployment Strategies & 8.5 DevOps/DORA - Visual Guide
 * High-signal, visually rich reproduction of Pages 95–99 and Page 104
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderDeploymentStrategiesContent(topic) {
  const strategies = [
    {
      name: "Rolling Deployment",
      diagram: "V1 V1 V1 → V2 V1 V1 → V2 V2 V1 → V2 V2 V2",
      downtime: "None",
      rollback: "Medium (redeploy V1)",
      cost: "Low (existing fleet)",
      risk: "Medium (V1 & V2 coexist)",
      suited: "Stateless services, Kubernetes deployments where versions maintain backward compatibility."
    },
    {
      name: "Blue-Green Deployment",
      diagram: "All traffic → LB [100% Blue V1 | 0% Green V2] ──flip──► [0% Blue V1 | 100% Green V2]",
      downtime: "Zero",
      rollback: "Instant (flip LB back)",
      cost: "High (2× environments)",
      risk: "High (100% blast radius)",
      suited: "Mission-critical applications where instant rollback is paramount and 2× infra cost is affordable."
    },
    {
      name: "Canary Deployment",
      diagram: "LB splits traffic: 95% Users → V1, 5% Canary Users → V2 ──ramp──► 10% → 25% → 50% → 100%",
      downtime: "Zero",
      rollback: "Fast (drop canary route)",
      cost: "Medium",
      risk: "Very Low (minimal blast radius)",
      suited: "High-traffic tier-1 services with risky changes and automated metric gates."
    },
    {
      name: "A/B Testing",
      diagram: "Group A (Region US, Cohort) → V1 | Group B (Region EU, Feature Flag) → V2",
      downtime: "Zero",
      rollback: "Fast (toggle flag)",
      cost: "Medium",
      risk: "Business-focused",
      suited: "Product experiments measuring business conversion rates (e.g. 2.1% vs 2.6%) rather than technical stability."
    },
    {
      name: "Recreate Deployment",
      diagram: "V1 V1 V1 ──stop──► [DOWNTIME WINDOW] ──start──► V2 V2 V2",
      downtime: "Yes",
      rollback: "Slow",
      cost: "Lowest",
      risk: "High",
      suited: "Non-critical internal tooling, staging environments, batch jobs where scheduled maintenance is acceptable."
    },
    {
      name: "Shadow Deployment (Dark Launch)",
      diagram: "Production Traffic ──clone──► V1 (Real users → Response) & V2 (Shadow → Discarded)",
      downtime: "Zero",
      rollback: "N/A",
      cost: "High (2× compute)",
      risk: "Zero user impact",
      suited: "Validating complex new backend rewrites, recommendation models, or database queries under production load."
    }
  ];

  const migrationSteps = [
    { step: "1. Add New Column", detail: "Add new column as NULLABLE (or with harmless default). Non-blocking DDL." },
    { step: "2. Dual-Write Application", detail: "Deploy app version writing to BOTH old and new fields; reads still use old field." },
    { step: "3. Backfill Data", detail: "Background worker backfills historical rows in throttled batches without locking." },
    { step: "4. Switch Reads", detail: "Deploy app version reading from new field; verify parity with row checksums." },
    { step: "5. Remove Old Column", detail: "Drop old column in a subsequent release once rollback to V1 is no longer needed." }
  ];

  const followUps = [
    {
      q: "What metrics gate an automated canary promotion, and who decides?",
      a: "Compare the canary against the baseline fleet <strong>on the exact same time window</strong> (not against yesterday's traffic): error rate, p50/p99 latency, CPU/memory saturation, and key business KPIs (e.g. checkout conversion rate, order count), plus automated scanning for new exception signatures in logs. Automate promotion decisions using statistical hypothesis testing with a fixed minimum bake time per step. Human manual promotion does not scale and is inherently biased toward shipping."
    },
    {
      q: "Blue-Green sounds strictly superior to rolling. Why doesn't everyone use it?",
      a: "<strong>Cost and state.</strong> Blue-Green requires 100% duplicate idle capacity (2× infrastructure cost). More importantly, the promise of 'instant rollback' breaks the moment the release includes a non-reversible database schema migration, a shared messaging format consumed by other teams, or long-lived stateful socket connections. Furthermore, switching 100% of traffic at once means a bug has a catastrophic 100% blast radius — which Canary avoids."
    },
    {
      q: "How do you canary a background worker or Kafka consumer with no HTTP inbound traffic?",
      a: "Shift the unit of routing: assign the canary worker a small fraction of topic partitions (or spin up a canary consumer group on a partition subset), or process a deterministic percentage of messages based on <code>hash(entity_id) % 100 &lt; 5</code>. Monitor consumer lag, deserialization errors, and downstream database write latency. For side-effect-free validation, run it as a <strong>shadow consumer</strong> that computes output and verifies diffs without writing."
    },
    {
      q: "What are the hidden dangers of shadow deployments?",
      a: "<strong>Unintended side effects.</strong> Mirrored shadow traffic that touches real production databases, triggers live emails/SMS, or calls external third-party payment gateways causes real-world damage. Shadow tiers must isolate mutations behind mock adapters or dedicated test databases. Additionally, shadowed traffic doubles request volume on shared downstream services, risking a self-inflicted outage."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="8.1-deployments">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 8 · Deployment &amp; Reliability
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 95–99, 104 · Sections 8.1 &amp; 8.5</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 25 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          8.1 Deployment Strategies &amp; Zero Downtime
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Deployment strategy governs how new application code is shipped to production while controlling blast radius, verifying runtime stability, and preserving database compatibility.
        </p>
      </div>

      <!-- Deployment Strategy Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        ${strategies.map(s => `
          <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col justify-between gap-3">
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[13px] font-bold text-cyan-300">${s.name}</span>
                <span class="text-[10px] font-code px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Downtime: ${s.downtime}</span>
              </div>
              <div class="p-2 rounded bg-[#0A0E1A] font-mono text-[10.5px] text-indigo-200 border border-[#1E293B]">
                ${s.diagram}
              </div>
              <p class="text-[12px] text-slate-300 font-sans leading-relaxed pt-1">
                ${s.suited}
              </p>
            </div>
            <div class="pt-2 border-t border-[#24314A]/60 flex items-center justify-between text-[11px] font-code text-slate-400">
              <span>Rollback: <strong class="text-slate-200">${s.rollback}</strong></span>
              <span>Cost: <strong class="text-slate-200">${s.cost}</strong></span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Expand-Contract Database Migration Pattern -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">sync_alt</span>
            The Expand-Contract (Parallel Change) Pattern for Databases
          </span>
          <span class="text-[11px] font-code text-rose-300">Never rename or drop columns in one step!</span>
        </div>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          Application deployments are easy; coordinated application and database schema changes are dangerous. During rolling or canary rollouts, V1 and V2 application instances run simultaneously. If V2 immediately mutates the database schema, active V1 instances crash:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-2.5 pt-1">
          ${migrationSteps.map(m => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-400">${m.step}</span>
              <p class="text-[11.5px] text-slate-300 leading-relaxed">${m.detail}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- DORA Metrics & DevOps Callout -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-purple-300 uppercase tracking-wider">
          WHAT SENIOR INTERVIEWERS EXPECT YOU TO QUOTE: THE 4 DORA METRICS (SEC. 8.5)
        </span>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="bg-[#141C2E] border border-indigo-500/30 rounded-lg p-3">
            <span class="font-code text-[11px] text-slate-400 block">Throughput</span>
            <span class="font-sans text-[13px] font-bold text-indigo-300">Deployment Frequency</span>
            <span class="text-[10.5px] text-slate-400 block mt-1">Deploy multiple times/day</span>
          </div>
          <div class="bg-[#141C2E] border border-cyan-500/30 rounded-lg p-3">
            <span class="font-code text-[11px] text-slate-400 block">Velocity</span>
            <span class="font-sans text-[13px] font-bold text-cyan-300">Lead Time for Changes</span>
            <span class="text-[10.5px] text-slate-400 block mt-1">Commit to production in hours</span>
          </div>
          <div class="bg-[#141C2E] border border-rose-500/30 rounded-lg p-3">
            <span class="font-code text-[11px] text-slate-400 block">Quality</span>
            <span class="font-sans text-[13px] font-bold text-rose-300">Change Failure Rate</span>
            <span class="text-[10.5px] text-slate-400 block mt-1">Failed releases under 5%</span>
          </div>
          <div class="bg-[#141C2E] border border-emerald-500/30 rounded-lg p-3">
            <span class="font-code text-[11px] text-slate-400 block">Resilience</span>
            <span class="font-sans text-[13px] font-bold text-emerald-300">Mean Time to Restore (MTTR)</span>
            <span class="text-[10.5px] text-slate-400 block mt-1">Recover from outage in minutes</span>
          </div>
        </div>
        <p class="text-[12px] text-slate-300 font-sans italic">
          "Speed and stability are positively correlated: teams that deploy frequently break production less, because small, reversible changes have tiny blast radiuses compared to massive quarterly releases."
        </p>
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
          "When discussing deployment strategies, always connect the choice to: Traffic → Risk → Monitoring → Rollback → Database compatibility. Never drop columns in a single step; use expand-contract with feature flags."
        </p>
      </div>

    </div>
  `;
}
