/**
 * 8.1 Deployment Strategies & Zero Downtime - Visual Guide
 * High-signal, visually rich, interview-oriented deep dive for Senior & Staff System Design.
 * Covers the 6 Deployment Strategies, Expand-Contract DB Migrations,
 * Automated Canary Analysis, and Non-HTTP Worker Rollouts.
 */

export function renderDeploymentStrategiesContent(topic) {
  const strategies = [
    {
      name: "1. Rolling (Ramped) Deployment",
      diagram: "V1 V1 V1 ──► V2 V1 V1 ──► V2 V2 V1 ──► V2 V2 V2",
      downtime: "Zero (Continuous availability)",
      rollback: "Moderate (Sequential redeploy of V1)",
      cost: "Lowest (1× compute fleet; runs within existing capacity)",
      risk: "Medium (V1 and V2 coexist concurrently in production)",
      routing: "Layer 4 / Layer 7 Load Balancer round-robin (Kubernetes Deployment)",
      suited: "Stateless web services and microservices where V1 and V2 maintain strict backward compatibility."
    },
    {
      name: "2. Blue-Green Deployment",
      diagram: "100% Traffic ──► [Blue: V1 (Active)] | 0% Traffic ──► [Green: V2 (Idle)] ──(Flip)──► 100% to Green",
      downtime: "Absolute Zero (Atomic traffic switch)",
      rollback: "Instantaneous (< 1 second; flip router/DNS back to Blue)",
      cost: "Highest (2× compute capacity during rollout)",
      risk: "High (100% blast radius upon traffic flip)",
      routing: "L7 Reverse Proxy, DNS CNAME switch, or Service Mesh VirtualService",
      suited: "Mission-critical applications where instant rollback is paramount and 2× infrastructure cost is acceptable."
    },
    {
      name: "3. Canary Deployment",
      diagram: "95% Traffic ──► V1 (Baseline) | 5% Traffic ──► V2 (Canary) ──(Metric Gates)──► 10% → 25% → 50% → 100%",
      downtime: "Zero",
      rollback: "Rapid (< 10 seconds; drain canary route back to 0%)",
      cost: "Low to Moderate (Small incremental canary capacity)",
      risk: "Lowest (Blast radius strictly confined to canary cohort)",
      routing: "Weighted L7 Ingress, Envoy route weights, or header/cookie matching",
      suited: "Tier-1 high-throughput distributed services where automated telemetry gates guard production safety."
    },
    {
      name: "4. A/B Testing Deployment",
      diagram: "Cohort A (Control / Flag OFF) ──► V1 | Cohort B (Experiment / Flag ON) ──► V2",
      downtime: "Zero",
      rollback: "Immediate (Toggle centralized feature flag)",
      cost: "Moderate",
      risk: "Business-focused (User experience divergence)",
      routing: "Feature flagging platform (LaunchDarkly), user session tokens, user ID hash",
      suited: "Product hypothesis testing measuring user behavior and business conversion rather than infrastructure stability."
    },
    {
      name: "5. Shadow Deployment (Dark Launch)",
      diagram: "Live Traffic ──► V1 (Serves real users) ──(Fork/Mirror)──► V2 (Runs shadow load, output discarded)",
      downtime: "Zero",
      rollback: "N/A (Shadow failures are completely invisible to end users)",
      cost: "High (2× compute + database shadow footprint)",
      risk: "Zero user impact (Requires strict mutation sandboxing)",
      routing: "L7 Proxy traffic mirroring (Envoy request mirroring, NGINX mirror)",
      suited: "Validating complex database rewrites, new recommendation ML models, or algorithmic migrations under full production volume."
    },
    {
      name: "6. Recreate Deployment",
      diagram: "V1 V1 V1 ──(Terminated)──► [DOWNTIME WINDOW] ──(Booted)──► V2 V2 V2",
      downtime: "Guaranteed Downtime (Duration = V2 cold-start time)",
      rollback: "Slow (Must terminate V2 and reboot V1 fleet)",
      cost: "Lowest ($)",
      risk: "High (Complete loss of availability during window)",
      routing: "Maintenance splash page; ingress disabled",
      suited: "Internal administrative tooling, dev/staging environments, or breaking batch migrations where state cannot be shared."
    }
  ];

  const migrationPhases = [
    {
      phase: "Phase 1: Expand (Additive Schema)",
      what: "Add new column or table as NULLABLE with safe defaults. Never rename or drop existing fields.",
      how: "Run non-blocking DDL (e.g. pt-online-schema-change or Postgres concurrent index). Existing V1 code continues reading/writing old fields without noticing the new column.",
      rollback: "Zero risk. If aborted, dropping the unused new column has zero blast radius."
    },
    {
      phase: "Phase 2: Dual-Write (Application V2)",
      what: "Deploy application version that writes to BOTH old and new fields simultaneously, while still reading exclusively from the old field.",
      how: "Wrap both writes in a local transaction or idempotent dual-write block. All new mutations populate both storage representations in lockstep.",
      rollback: "Trivial. If V2 fails, rollback to V1. V1 continues writing old fields normally."
    },
    {
      phase: "Phase 3: Backfill Historical Data",
      what: "Migrate historical rows from old format to new format in throttled background batches.",
      how: "Run asynchronous batch workers: <code>UPDATE users SET full_name = CONCAT(first_name, ' ', last_name) WHERE id BETWEEN ? AND ? AND full_name IS NULL</code>. Throttle batches to prevent disk I/O saturation and replication lag.",
      rollback: "Pause backfill worker; no production impact."
    },
    {
      phase: "Phase 4: Contract Reads (Application V3)",
      what: "Deploy application version that switches read queries to the new column, while continuing dual-writes.",
      how: "Verify data consistency with background checksum jobs comparing old vs new values. Once parity reaches 100%, switch read traffic to the new column.",
      rollback: "Revert read routing back to old field if data anomalies or unexpected query latencies arise."
    },
    {
      phase: "Phase 5: Contract Writes & Drop (Application V4)",
      what: "Cease writing to the old column completely, verify V1 is retired, then drop the legacy column.",
      how: "Deploy app version writing only to the new schema. After a 14-day bake period ensuring no legacy code accesses the old field, execute <code>ALTER TABLE DROP COLUMN</code>.",
      rollback: "Irreversible without restore from backup; execute only after all dependent services have migrated."
    }
  ];

  const canaryMetrics = [
    {
      metric: "1. HTTP Error Rate (5xx Ratio)",
      baseline: "p99.9 error rate &lt; 0.05%",
      canaryRule: "Abort if Canary 5xx rate &gt; 1.5× baseline over a 5-minute rolling window.",
      purpose: "Detects unhandled exceptions, runtime crashes, and deserialization faults."
    },
    {
      metric: "2. Latency Degradation (p95 &amp; p99)",
      baseline: "p99 &lt; 180 ms",
      canaryRule: "Abort if Canary p99 latency increases by &gt; 15% compared to the concurrent baseline.",
      purpose: "Catches lock contention, unindexed queries, and algorithmic regressions under load."
    },
    {
      metric: "3. Resource Saturation (CPU / Memory)",
      baseline: "CPU 45%, Memory stable at 1.2 GB",
      canaryRule: "Abort if Canary memory grows monotonically (leak) or CPU exceeds 2× baseline.",
      purpose: "Prevents slow memory leaks and thread deadlocks from propagating to the entire fleet."
    },
    {
      metric: "4. Business KPI Invariants",
      baseline: "Cart checkout rate = 2.45%",
      canaryRule: "Abort if transactional conversion drops by &gt; 1% statistically (Mann-Whitney U test).",
      purpose: "Catches silent business logic bugs that return HTTP 200 OK but corrupt user workflows."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="8.1-deployments">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 8 · Deployment, Reliability &amp; Operations
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 95–99, 104 · Section 8.1 &amp; 8.5</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Staff-Level Architecture
          </span>
        </div>
        <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          8.1 Deployment Strategies &amp; Zero Downtime
        </h2>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Deployment architecture governs how new software versions enter production while rigorously bounding blast radius, verifying runtime stability under real traffic, and maintaining continuous backward compatibility across stateful databases.
        </p>
      </div>

      <!-- Core What, Why, How, When Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">info</span>
            WHAT IT IS
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            The systematic orchestrations (Rolling, Blue-Green, Canary, Shadow) that transition client traffic from version $N$ to $N+1$ without dropping active TCP connections or corrupting in-flight transactions.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">help</span>
            WHY IT MATTERS
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Over 70% of production outages are triggered by change events (code releases or config updates). A superior deployment strategy isolates failures to tiny cohorts and rolls back automatically in seconds.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">settings</span>
            HOW IT WORKS
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Coordinates traffic control (Layer 4/7 reverse proxies, service mesh route weights, DNS), container orchestration lifecycle hooks, and database backward-compatibility patterns (Expand-Contract).
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">rule</span>
            WHEN TO USE WHAT
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Use <strong>Canary</strong> for high-scale public traffic; <strong>Blue-Green</strong> when compute budget is abundant and rollback must be atomic; <strong>Shadow</strong> for risky backend rewrites.
          </p>
        </div>
      </div>

      <!-- Comprehensive Comparison Matrix Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          THE SIX DEPLOYMENT STRATEGIES: ARCHITECTURAL COMPARISON MATRIX
        </span>

        <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
          <table class="w-full text-left text-[12px] font-sans border-collapse">
            <thead>
              <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                <th class="p-3 font-bold w-[16%]">Strategy</th>
                <th class="p-3 font-bold w-[12%]">Downtime</th>
                <th class="p-3 font-bold w-[13%]">Rollback Speed</th>
                <th class="p-3 font-bold w-[11%]">Compute Cost</th>
                <th class="p-3 font-bold w-[12%]">Blast Radius</th>
                <th class="p-3 font-bold w-[16%]">Routing Mechanism</th>
                <th class="p-3 font-bold w-[20%]">Best Production Use Case</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E293B] text-slate-300">
              ${strategies.map(s => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-bold text-cyan-300 font-code text-[11.5px]">${s.name}</td>
                  <td class="p-3">${s.downtime}</td>
                  <td class="p-3 font-code text-emerald-300">${s.rollback}</td>
                  <td class="p-3 font-code text-amber-300">${s.cost}</td>
                  <td class="p-3 text-rose-300">${s.risk}</td>
                  <td class="p-3 text-[11px] font-code text-slate-400">${s.routing}</td>
                  <td class="p-3 text-[11.5px] leading-relaxed">${s.suited}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Architectural Diagrams: Rolling vs Blue-Green vs Canary vs Shadow -->
      <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-5">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">account_tree</span>
            PRODUCTION TRAFFIC ROUTING ARCHITECTURES
          </span>
          <span class="text-[10px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
            Layer 7 Routing &amp; Lifecycle Management
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Diagram 1: Blue-Green Deployment -->
          <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] flex flex-col gap-2 font-mono text-[11px]">
            <div class="text-cyan-400 font-bold">// ARCHITECTURE 1: BLUE-GREEN DEPLOYMENT (ATOMIC FLIP)</div>
<pre class="text-slate-300 leading-tight">
  Public Clients
       │
       ▼
 ┌─────────────┐   Active Route (100%)
 │  L7 Router  ├────────────────────────► ┌────────────────────────┐
 │ (Envoy/ALB) │                           │ BLUE FLEET (Version 1) │
 └──────┬──────┘                           │ 4 Pods Serving Traffic │
        │                                  └────────────────────────┘
        │   Standby Route (0%)
        └································► ┌────────────────────────┐
             (Atomic Switch upon Green OK) │ GREEN FLEET (Version 2)│
                                           │ Fully Warmed &amp; Tested  │
                                           └────────────────────────┘
</pre>
            <p class="text-[11.5px] text-slate-400 font-sans leading-normal">
              <strong>Atomic Switch:</strong> The router modifies its backend target group pointer. If Green exhibits errors, the pointer flips back to Blue in &lt;1 second. <em>Limitation:</em> Requires 2× idle compute capacity.
            </p>
          </div>

          <!-- Diagram 2: Canary Deployment with Metric Gate -->
          <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] flex flex-col gap-2 font-mono text-[11px]">
            <div class="text-emerald-400 font-bold">// ARCHITECTURE 2: CANARY WITH STATISTICAL TELEMETRY GATE</div>
<pre class="text-slate-300 leading-tight">
  Public Clients
       │
       ▼
 ┌─────────────┐   95% Baseline Weight
 │  L7 Router  ├────────────────────────► ┌────────────────────────┐
 │(Weighted LB)│                           │ BASELINE FLEET (V1)    │
 └──────┬──────┘                           └───────────┬────────────┘
        │                                              │
        │   5% Canary Weight                           ▼ Metrics
        └────────────────────────────────► ┌────────────────────────┐
                                           │ CANARY FLEET (V2)      │
                                           └───────────┬────────────┘
                                                       │ Metrics
                                                       ▼
                                          ┌─────────────────────────┐
                                          │ AUTOMATED ANALYSIS GATE │
                                          │ p99 Latency / 5xx Ratio │
                                          │ Mann-Whitney U Test OK? │
                                          └───────┬─────────┬───────┘
                                           PASS:  │         │ FAIL:
                                           Ramp   ▼         ▼ Abort &amp; Drain
                                           to 10% → 100%    Route to 0%
</pre>
            <p class="text-[11.5px] text-slate-400 font-sans leading-normal">
              <strong>Gradual Exposure:</strong> Automated analysis compares Canary metrics directly against concurrent Baseline metrics. Human intervention is eliminated; rollbacks happen autonomously.
            </p>
          </div>
        </div>
      </div>

      <!-- Expand-Contract Database Migration Pattern -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">sync_alt</span>
            THE EXPAND-CONTRACT (PARALLEL RUN) PATTERN FOR STATEFUL DATABASES
          </span>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
            Mandatory for Zero Downtime
          </span>
        </div>

        <p class="text-[13px] text-slate-300 leading-relaxed">
          Application instances are ephemeral and can be rolled back instantly; databases are stateful and shared across both active V1 and V2 application nodes during a rollout. <strong>Renaming or dropping a column in a single step instantly crashes running V1 instances.</strong> Zero-downtime database evolution requires the 5-phase Expand-Contract pattern:
        </p>

        <!-- 5 Phase Grid -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
          ${migrationPhases.map(m => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3.5 flex flex-col justify-between gap-2">
              <div class="flex flex-col gap-1">
                <span class="font-code text-[11px] font-bold text-emerald-400">${m.phase}</span>
                <p class="text-[11.5px] text-slate-200 font-semibold leading-snug">${m.what}</p>
                <p class="text-[11px] text-slate-400 leading-relaxed pt-1">${m.how}</p>
              </div>
              <div class="pt-2 border-t border-[#24314A]/60 text-[10.5px] font-code text-cyan-300">
                Safety: ${m.rollback}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Worked Code & SQL Trace -->
        <div class="bg-[#0B1120] p-4 rounded-lg border border-[#1E293B] font-mono text-[11px] text-slate-300 flex flex-col gap-2 overflow-x-auto">
          <div class="text-indigo-400 font-bold">// WORKED EXAMPLE: Splitting 'name' into 'first_name' and 'last_name' without downtime</div>
<div>1. EXPAND:   <span class="text-emerald-300">ALTER TABLE users ADD COLUMN first_name VARCHAR(100) NULL, ADD COLUMN last_name VARCHAR(100) NULL;</span></div>
<div>2. DUAL-WRITE: Application V2 writes: <span class="text-cyan-300">INSERT INTO users (name, first_name, last_name) VALUES ('Jane Doe', 'Jane', 'Doe');</span></div>
<div>3. BACKFILL:  Background job iterates: <span class="text-amber-300">UPDATE users SET first_name = ..., last_name = ... WHERE id BETWEEN 1000 AND 2000;</span></div>
<div>4. SWITCH:    Application V3 reads exclusively from <code>first_name, last_name</code> while maintaining dual-writes.</div>
<div>5. CONTRACT:  Application V4 stops writing to <code>name</code>. After 14 days bake time: <span class="text-rose-300">ALTER TABLE users DROP COLUMN name;</span></div>
        </div>
      </div>

      <!-- Automated Canary Analysis (ACA) Deep Dive -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">speed</span>
          AUTOMATED CANARY ANALYSIS (ACA) &amp; STATISTICAL METRIC GATES
        </span>

        <p class="text-[13px] text-slate-300 leading-relaxed">
          Human visual inspection of dashboards during deployments is error-prone and biased toward shipping. Modern platforms (Spinnaker Kayenta, Argo Rollouts, Flagger) automate canary qualification using statistical hypothesis testing (e.g. Mann-Whitney U-test) comparing the canary against baseline nodes over the <strong>exact same concurrent time window</strong>:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          ${canaryMetrics.map(m => `
            <div class="bg-[#141C2E] border border-[#24314A] rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-sans text-[12.5px] font-bold text-white">${m.metric}</span>
              <div class="text-[11px] font-code text-slate-400">Baseline: <span class="text-slate-200">${m.baseline}</span></div>
              <div class="text-[11.5px] font-code text-rose-300">${m.canaryRule}</div>
              <p class="text-[11px] text-slate-400 leading-relaxed pt-1">${m.purpose}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Advanced Production Edge Cases -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Edge Case 1: Non-HTTP Worker Canaries -->
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-400 text-[18px]">alt_route</span>
            <h4 class="font-sans text-[14px] font-bold text-white">Canarying Asynchronous Kafka &amp; Queue Workers</h4>
          </div>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Background workers (Kafka consumers, Celery workers) have no inbound HTTP port for a load balancer to split. How do you canary a worker safely?
          </p>
          <ul class="text-[12px] text-slate-300 font-sans list-disc list-inside space-y-1.5 pl-1">
            <li><strong>Partition-Based Shifting:</strong> In Kafka, assign the canary consumer group to a dedicated subset of topic partitions (e.g. Partition 0 of 20 = 5% traffic).</li>
            <li><strong>Deterministic Modulo Routing:</strong> Workers inspect message payload keys: <code>if (hash(order_id) % 100 &lt; 5) process_v2(); else process_v1();</code></li>
            <li><strong>Shadow Consumer (Diffing):</strong> Run the canary consumer in read-only shadow mode, executing business logic and emitting metrics/diffs without performing mutating downstream writes.</li>
          </ul>
        </div>

        <!-- Edge Case 2: Mutation Sandboxing in Shadow Deployments -->
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-400 text-[18px]">science</span>
            <h4 class="font-sans text-[14px] font-bold text-white">Shadow (Dark Launch) Mutation Sandboxing</h4>
          </div>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Traffic shadowing forks live production HTTP requests to a V2 candidate. If unconstrained, shadowed requests trigger catastrophic duplicate real-world side effects:
          </p>
          <ul class="text-[12px] text-slate-300 font-sans list-disc list-inside space-y-1.5 pl-1">
            <li><strong>The Double-Charge Hazard:</strong> Shadowed checkout traffic calling Stripe/PayPal will double-bill customers. Outbound calls must be intercepted by mock adapters.</li>
            <li><strong>Database Mutation Sandboxing:</strong> Shadow traffic must point to a shadow replica database or discard write transactions on commit to prevent state corruption.</li>
            <li><strong>Downstream Resource Load:</strong> Shadowing doubles request volume on all shared dependencies (caches, internal microservices). Ensure downstream capacity is pre-provisioned.</li>
          </ul>
        </div>
      </div>

      <!-- DORA Metrics & DevOps Callout -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-purple-300 uppercase tracking-wider">
          THE FOUR DORA METRICS: HOW TOP TECH ORGANIZATIONS MEASURE DEPLOYMENT MATURITY
        </span>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="bg-[#141C2E] border border-indigo-500/30 rounded-lg p-3.5">
            <span class="font-code text-[10.5px] text-slate-400 block uppercase">Throughput</span>
            <span class="font-sans text-[14px] font-bold text-indigo-300">Deployment Frequency</span>
            <span class="text-[11px] text-slate-400 block mt-1">Multiple deploys per day</span>
          </div>
          <div class="bg-[#141C2E] border border-cyan-500/30 rounded-lg p-3.5">
            <span class="font-code text-[10.5px] text-slate-400 block uppercase">Velocity</span>
            <span class="font-sans text-[14px] font-bold text-cyan-300">Lead Time for Changes</span>
            <span class="text-[11px] text-slate-400 block mt-1">Commit to production &lt; 1 hour</span>
          </div>
          <div class="bg-[#141C2E] border border-rose-500/30 rounded-lg p-3.5">
            <span class="font-code text-[10.5px] text-slate-400 block uppercase">Quality</span>
            <span class="font-sans text-[14px] font-bold text-rose-300">Change Failure Rate</span>
            <span class="text-[11px] text-slate-400 block mt-1">Failed releases &lt; 5%</span>
          </div>
          <div class="bg-[#141C2E] border border-emerald-500/30 rounded-lg p-3.5">
            <span class="font-code text-[10.5px] text-slate-400 block uppercase">Resilience</span>
            <span class="font-sans text-[14px] font-bold text-emerald-300">Mean Time to Restore</span>
            <span class="text-[11px] text-slate-400 block mt-1">Outage recovery &lt; 15 mins</span>
          </div>
        </div>
        <p class="text-[12px] text-slate-300 font-sans italic pt-1">
          "Speed and stability are reinforcing, not mutually exclusive: high-performing teams deploy small, frequent batches with automated canary rollback, minimizing blast radius and eliminating high-risk monolithic releases."
        </p>
      </div>

      <!-- Key Architectural Takeaway -->
      <div class="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 rounded-xl p-5 flex flex-col gap-1.5 shadow-lg shadow-indigo-950/40">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">verified</span>
          KEY SYSTEM DESIGN TAKEAWAY
        </span>
        <p class="font-sans text-[13.5px] text-white font-medium leading-relaxed">
          Zero-downtime deployments are achieved at the intersection of traffic routing, container lifecycle management, and database decoupling. For stateless workloads, use Canary with automated statistical analysis gates. For database schemas, always employ the Expand-Contract pattern across multiple releases. Never deploy code that requires lockstep database schema mutations.
        </p>
      </div>

    </div>
  `;
}
