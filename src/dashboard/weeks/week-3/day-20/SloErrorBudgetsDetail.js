/**
 * 12.3 SLIs, SLOs and Error Budgets - Comprehensive System Design Deep Dive
 * Complete architectural reference covering reliability quantification, telemetry placement,
 * multi-window multi-burn-rate alerting algorithms, PromQL recording rules, and error budget governance.
 */

export function renderSloErrorBudgetsContent(topic) {
  const sliTypes = [
    {
      type: "Availability",
      metric: "Good Requests / Total Valid Requests",
      formula: "sum(rate(http_requests_total{status!~\"5..\"}[5m])) / sum(rate(http_requests_total{status!~\"499\"}[5m]))",
      placement: "Edge API Gateway / Ingress Reverse Proxy",
      nuance: "Strictly filters client faults (4xx) from budget consumption. Crucial exception: 429 (Rate Limited) caused by server saturation burns budget; 499 (Client Closed) requires careful timeout attribution."
    },
    {
      type: "Latency",
      metric: "Proportion of requests completing faster than threshold T",
      formula: "sum(rate(http_request_duration_seconds_bucket{le=\"0.3\"}[5m])) / sum(rate(http_request_duration_seconds_count[5m]))",
      placement: "Edge Gateway + Ingress Service Mesh Sidecar",
      nuance: "Calculated strictly as a proportion of requests meeting a target threshold (e.g., <= 300ms), NEVER an arithmetic mean. Bimodal tail latencies (GC pauses, cold starts) are completely invisible to average metrics."
    },
    {
      type: "Freshness",
      metric: "Proportion of read operations where data lag <= max allowable delta",
      formula: "(time() - max(cdc_stream_record_timestamp_seconds)) < 5",
      placement: "CDC Pipeline Consumers, Search Replicas & Cache Invalidation Bus",
      nuance: "Evaluates staleness in asynchronous replication pipelines. Vital for read replicas, Debezium CDC connectors, search engines (Elasticsearch), and vector indices serving generative AI workflows."
    },
    {
      type: "Correctness",
      metric: "Proportion of state mutations that pass deterministic financial reconciliation",
      formula: "sum(financial_ledger_balanced_records_total) / sum(financial_ledger_evaluated_records_total)",
      placement: "Asynchronous Double-Entry Ledger Reconciler & DB Auditing Daemons",
      nuance: "A system can achieve 100% 200 OK responses with sub-10ms latency while silently corrupting balances. Correctness SLIs measure state invariants and asynchronous ledger netting fidelity."
    },
    {
      type: "Coverage",
      metric: "Proportion of expected payload records or events processed to completion",
      formula: "sum(rate(event_processor_completed_total[10m])) / sum(rate(event_ingest_received_total[10m]))",
      placement: "Kafka / Pulsar Consumer Groups, Batch ETL & Async Queue Workers",
      nuance: "Measures end-to-end data completeness across asynchronous asynchronous pipelines where individual event latency is non-critical, but dropped records violate compliance or billing."
    }
  ];

  const ninesTable = [
    {
      level: "99.0% (Two Nines)",
      monthly: "7h 18m 18s",
      weekly: "1h 40m 48s",
      daily: "14m 24s",
      archReq: "Single Cloud Region, Single AZ, standard auto-scaling group, automated VM reboot, hourly database snapshots.",
      cost: "Baseline (1x)"
    },
    {
      level: "99.9% (Three Nines)",
      monthly: "43m 50s",
      weekly: "10m 05s",
      daily: "1m 26s",
      archReq: "Multi-AZ active deployment (>= 3 AZs), redundant stateless compute, managed PostgreSQL/MySQL with synchronous multi-AZ replica, automated load-balancer health ejection.",
      cost: "Moderate (~2x)"
    },
    {
      level: "99.95% (Three and a Half)",
      monthly: "21m 55s",
      weekly: "5m 02s",
      daily: "43.2s",
      archReq: "Multi-AZ with strict circuit breakers, automated canary deployments with canary rollback gates, read replicas across AZs, synthetic canary probes, and strict retry budgets.",
      cost: "High (~3x)"
    },
    {
      level: "99.99% (Four Nines)",
      monthly: "4m 23s",
      weekly: "1m 00s",
      daily: "8.6s",
      archReq: "Multi-Region Warm Standby or Multi-Region Active-Active with single write leader, automated regional health fencing, zero-downtime expand-contract schema migrations, zero manual failover steps.",
      cost: "Very High (~5x - 8x)"
    },
    {
      level: "99.999% (Five Nines)",
      monthly: "26.3s",
      weekly: "6.0s",
      daily: "0.86s",
      archReq: "Planetary Active-Active multi-region consensus (Google Spanner / CockroachDB with TrueTime/atomic clocks), redundant edge Anycast backbones, isolated fault domains, formal chaos engineering gates.",
      cost: "Astronomical (~15x+)"
    }
  ];

  const burnRateSchedule = [
    {
      burn: "14.4x Burn Rate",
      consumption: "2% of total 28-day budget in 1 hour (100% budget gone in 2 days / 48h)",
      shortWindow: "5 Minutes (14.4x burn)",
      longWindow: "1 Hour (14.4x burn)",
      action: "High-Priority PagerDuty Page to On-Call Engineer",
      rationale: "Requires immediate human intervention. The dual-window condition ensures transient 60s spikes do not wake engineers, while genuine system outages trigger within 5 minutes."
    },
    {
      burn: "6.0x Burn Rate",
      consumption: "5% of total 28-day budget in 6 hours (100% budget gone in 4.7 days / 112h)",
      shortWindow: "30 Minutes (6.0x burn)",
      longWindow: "6 Hours (6.0x burn)",
      action: "High-Priority Notification (Business Hours Page or Next-Day Priority)",
      rationale: "Moderate deterioration. Leaves adequate time for investigation during waking hours before material customer disruption accumulates."
    },
    {
      burn: "1.0x Burn Rate",
      consumption: "10% of total 28-day budget in 3 days (100% budget consumed linearly in 28 days)",
      shortWindow: "6 Hours (1.0x burn)",
      longWindow: "3 Days (1.0x burn)",
      action: "Automated Jira / Linear Ticket assigned to Service Owner Team",
      rationale: "Chronic degradation. The system is consuming budget slightly faster than replacement rate. No on-call interruption; tracked as architectural debt."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-8 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="12.3-slo">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 12 · Reliability &amp; Operations at Scale
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 154–155 · Section 12.3</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 25 mins
          </span>
        </div>
        <h3 class="font-sans text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-snug">
          12.3 Service Level Indicators (SLIs), Objectives (SLOs) &amp; Error Budgets
        </h3>
        <p class="font-sans text-[14px] text-slate-300 leading-relaxed max-w-4xl">
          Reliability is not a binary state; it is a probability distribution governed by mathematical constraints and economic trade-offs. 
          An <strong>SLI</strong> measures actual user-experienced behavior. An <strong>SLO</strong> defines the formal target threshold. 
          The <strong>Error Budget</strong> is the permissible failure margin that balances engineering velocity with system stability. 
          An <strong>SLA</strong> is a commercial legal contract specifying financial refunds or penalties if the SLO is breached.
        </p>
      </div>

      <!-- Core Architectural Taxonomy Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">SLI (Indicator)</span>
            <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">Observation</span>
          </div>
          <span class="font-mono text-[13px] text-white font-semibold">Good Events / Valid Events</span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            The quantifiable ratio of compliance. Must be measured directly where the customer interacts (API gateway or edge proxy), filtering out malformed client requests.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-indigo-400 uppercase tracking-wider">SLO (Objective)</span>
            <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">Internal Target</span>
          </div>
          <span class="font-mono text-[13px] text-white font-semibold">SLI &gt;= Target % over Window</span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            The internal engineering commitment (e.g., <code>99.95% over rolling 28 days</code>). Serves as the authoritative architectural compass for prioritization.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Error Budget</span>
            <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">Velocity Margin</span>
          </div>
          <span class="font-mono text-[13px] text-white font-semibold">1.0 - SLO (Allowable Shortfall)</span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            The spendable currency of risk. At 99.95% SLO, the budget is 0.05% (~21.9 min/mo). Used to fund canary deployments, schema migrations, and chaos tests.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">SLA (Agreement)</span>
            <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">Commercial</span>
          </div>
          <span class="font-mono text-[13px] text-white font-semibold">SLO - Safety Buffer (Penalty)</span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            The external customer contract. Typically set looser than internal SLO (e.g., 99.9% SLA vs 99.95% SLO) so internal alerts fire and resolve before contractual breach.
          </p>
        </div>
      </div>

      <!-- The Cost of Nines Table -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="font-code text-[12px] font-bold text-slate-300 uppercase tracking-wider">
            THE MATHEMATICAL REALITY OF "NINES": DOWNTIME BUDGET &amp; INFRASTRUCTURE COST
          </span>
          <span class="text-[11px] font-code text-slate-500">Rolling 30-Day Window (43,200 Minutes)</span>
        </div>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/6">Availability Target</th>
                <th class="p-3 w-1/8">Monthly Downtime</th>
                <th class="p-3 w-1/8">Daily Downtime</th>
                <th class="p-3 w-1/2">Architectural Prerequisites &amp; Failure Domain Isolation</th>
                <th class="p-3 w-1/12 text-right">Cost Factor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${ninesTable.map(row => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${row.level}</td>
                  <td class="p-3 text-rose-300 font-mono text-[11.5px]">${row.monthly}</td>
                  <td class="p-3 text-amber-300 font-mono text-[11.5px]">${row.daily}</td>
                  <td class="p-3 text-slate-300 leading-relaxed">${row.archReq}</td>
                  <td class="p-3 text-right font-code font-bold text-emerald-400">${row.cost}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="text-[11.5px] text-slate-400 font-sans italic">
          Staff Takeaway: Every additional "nine" multiplies cloud infrastructure and engineering operational overhead exponentially. Demanding 99.99% without multi-region warm standby or synchronous quorum consensus is an architectural contradiction.
        </p>
      </div>

      <!-- The Arithmetic Mean Fallacy -->
      <div class="bg-[#1C1322] border-l-4 border-rose-500 rounded-r-xl p-5 flex flex-col gap-3 font-sans">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-rose-400 text-[20px]">warning</span>
          <span class="font-code text-[12.5px] font-bold text-rose-300 uppercase tracking-wider">
            THE CRITICAL MATHEMATICAL MISTAKE: NEVER USE AN ARITHMETIC MEAN IN AN SLO
          </span>
        </div>
        <p class="text-[13px] text-slate-300 leading-relaxed">
          Stating <em>"Average latency shall be less than 200ms"</em> is catastrophic. In real distributed systems, latency distributions are heavily skewed and multimodal (fast in-memory hits vs. cold starts, database lock stalls, and GC pauses):
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div class="bg-[#0A0E1A] border border-rose-900/40 rounded-lg p-3.5 flex flex-col gap-1.5 font-mono text-[11.5px]">
            <span class="text-rose-400 font-bold">The Deceptive Arithmetic Mean:</span>
            <p class="text-slate-300">95 requests complete in 10ms: 950ms</p>
            <p class="text-slate-300">5 requests stall for 3,800ms: 19,000ms</p>
            <p class="text-amber-300 font-bold border-t border-slate-700/60 pt-1">Average Latency = 19,950ms / 100 = 199.5ms (PASS)</p>
            <span class="text-rose-400 text-[10.5px]">Result: 5% of users experience near 4-second stalls, yet your SLO reports 100% green!</span>
          </div>
          <div class="bg-[#0A0E1A] border border-emerald-900/40 rounded-lg p-3.5 flex flex-col gap-1.5 font-mono text-[11.5px]">
            <span class="text-emerald-400 font-bold">The Correct Ratio Formulation:</span>
            <p class="text-slate-300">Target: 99% of requests complete &lt;= 300ms</p>
            <p class="text-slate-300">Compliant requests (&lt;= 300ms): 95 / 100</p>
            <p class="text-emerald-300 font-bold border-t border-slate-700/60 pt-1">Actual Ratio = 95.0% (BREACH: target 99%)</p>
            <span class="text-emerald-400 text-[10.5px]">Result: Instantly surfaces tail degradation and fires burn-rate alerts.</span>
          </div>
        </div>
        <p class="text-[12px] text-slate-300 leading-relaxed pt-1">
          Furthermore, <strong>percentiles cannot be mathematically aggregated</strong>. If cluster A reports p99 = 250ms and cluster B reports p99 = 400ms, the combined p99 is NOT 325ms (the average of percentiles is mathematically invalid under Jensen's Inequality). <strong>Ratio SLIs</strong> (good events divided by total events) aggregate perfectly across servers, clusters, and regions via linear summation.
        </p>
      </div>

      <!-- The 5 Universal SLI Archetypes Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[12px] font-bold text-slate-300 uppercase tracking-wider">
          THE FIVE UNIVERSAL SLI ARCHETYPES &amp; TELEMETRY FORMULATIONS
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/8">SLI Archetype</th>
                <th class="p-3 w-1/5">Mathematical Metric</th>
                <th class="p-3 w-1/4">PromQL Formulation</th>
                <th class="p-3 w-1/6">Probe Measurement Point</th>
                <th class="p-3 w-1/4">Production Nuance &amp; Edge Cases</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${sliTypes.map(s => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${s.type}</td>
                  <td class="p-3 text-slate-200 font-mono text-[11px]">${s.metric}</td>
                  <td class="p-3 text-amber-300 font-mono text-[10.5px] bg-[#0A0E1A]/40 p-2">${s.formula}</td>
                  <td class="p-3 text-indigo-300 font-code text-[11.5px]">${s.placement}</td>
                  <td class="p-3 text-slate-300 leading-relaxed text-[11.5px]">${s.nuance}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Multi-Window Multi-Burn-Rate Alerting Architecture -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-3 border-b border-[#24314A]/70">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-cyan-400 text-[18px]">notifications_active</span>
            <span class="text-[12px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              MULTI-WINDOW MULTI-BURN-RATE ALERTING ARCHITECTURE (GOOGLE SRE STANDARD)
            </span>
          </div>
          <span class="text-[11px] font-code text-slate-500">Eliminating Alert Fatigue</span>
        </div>

        <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
          Traditional alerting relies on static error-rate thresholds (e.g., <em>"Fire page if error rate &gt; 2% for 5 minutes"</em>). 
          This fails on two fronts: <strong>low-rate chronic leaks</strong> (a persistent 0.8% error rate drains 100% of a 99.9% SLO budget in days without firing) 
          and <strong>transient benign spikes</strong> (a 30-second network blip pages an engineer at 3 a.m. even though 99.98% of monthly budget remains intact).
        </p>

        <!-- ASCII Diagram of Multi-Window Evaluation -->
        <div class="text-[11.5px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed bg-[#060911] p-4 rounded-lg border border-[#1E293B]">
INCOMING HTTP TELEMETRY ──► [ PROMETHEUS / VICTORIAMETRICS ]
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
 [ 5-Minute Short Window ]                              [ 1-Hour Long Window ]
  Measures immediate severity                            Validates persistence
  Burn Rate &gt;= 14.4x ?                                   Burn Rate &gt;= 14.4x ?
             │                                                     │
             └───────────────────────┬─────────────────────────────┘
                                     ▼
                   [ BOTH CONDITIONS TRUE SIMULTANEOUSLY? ]
                                     │
                    ┌────────────────┴────────────────┐
                   YES                                NO
                    ▼                                 ▼
         [ FIRE ON-CALL PAGER ]              [ SUPPRESS ALERT ]
         Consumes 2% budget in 1h            Transient spike or already recovering;
         Total budget gone in 48h            prevents unnecessary off-hours awakening.
        </div>

        <!-- Burn Rate Table -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          ${burnRateSchedule.map(b => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <span class="font-code text-[13px] font-bold text-rose-400">${b.burn}</span>
              <span class="text-[11px] font-code text-amber-300">${b.consumption}</span>
              <div class="text-[11px] font-mono text-slate-300 bg-[#0A0E1A] p-2 rounded border border-slate-800/80">
                <div>Short: <span class="text-cyan-300">${b.shortWindow}</span></div>
                <div>Long: <span class="text-indigo-300">${b.longWindow}</span></div>
              </div>
              <span class="font-sans text-[11.5px] font-semibold text-white">${b.action}</span>
              <p class="text-[11px] text-slate-400 font-sans leading-relaxed">${b.rationale}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Distributed Dependency Reliability Compounding -->
      <div class="bg-[#141C2E] border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-4 font-sans">
        <div class="flex items-center gap-2 pb-2 border-b border-[#24314A]/70">
          <span class="material-symbols-outlined text-indigo-400 text-[20px]">account_tree</span>
          <span class="font-code text-[12.5px] font-bold text-indigo-300 uppercase tracking-wider">
            DISTRIBUTED DEPENDENCY RELIABILITY: THE SERIAL COMPOUNDING TRAP
          </span>
        </div>

        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          In a microservice architecture, your service's availability ceiling is strictly bounded by its dependencies. 
          When multiple dependencies are called synchronously in series, their availabilities multiply:
        </p>

        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-lg p-4 font-mono text-[12px] flex flex-col gap-2">
          <span class="text-cyan-300 font-bold">The Series Availability Formula:</span>
          <span class="text-slate-200">A_overall = A_service * A_dep1 * A_dep2 * A_dep3 * ... * A_depN</span>
          <div class="text-amber-300 text-[11.5px] pt-1">
            Example: If Service A synchronously invokes 4 downstream microservices, each boasting a 99.9% SLO:
            <br />A_overall = 0.999 * 0.999 * 0.999 * 0.999 = 0.996 (99.6%)
          </div>
          <span class="text-rose-400 text-[11px]">
            Mathematical Certainty: You cannot promise a 99.9% SLO if your synchronous serial call chain delivers a 99.6% ceiling (~175 minutes of monthly downtime)!
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1.5">
            <span class="font-code font-bold text-cyan-300">1. Stale-While-Revalidate Caches</span>
            <p class="text-slate-300">Decouple availability from read dependencies. If the pricing or catalog service fails, serve locally cached payloads with a <code>Warning: 110 Stale</code> header.</p>
          </div>
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1.5">
            <span class="font-code font-bold text-amber-300">2. Asynchronous Queue Decoupling</span>
            <p class="text-slate-300">Transform synchronous RPC writes into durable message broker ingestion (Kafka / SQS). The caller receives an immediate 202 Accepted while workers retry idempotently.</p>
          </div>
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1.5">
            <span class="font-code font-bold text-emerald-300">3. Graceful UI Degradation</span>
            <p class="text-slate-300">Design caller contracts with fallback defaults. If the personalization engine fails, return popular global items rather than failing the core checkout journey.</p>
          </div>
        </div>
      </div>

      <!-- Error Budget Policy & Organizational Governance -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3 font-sans">
        <div class="flex items-center gap-2 pb-2 border-b border-[#24314A]/70">
          <span class="material-symbols-outlined text-amber-400 text-[20px]">gavel</span>
          <span class="font-code text-[12.5px] font-bold text-amber-300 uppercase tracking-wider">
            ERROR BUDGET POLICY: THE SOCIAL CONTRACT BETWEEN PRODUCT &amp; SRE
          </span>
        </div>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          An SLO without an enforceable <strong>Error Budget Policy</strong> is merely wishful thinking ("SLO Theater"). 
          The Error Budget creates a shared quantitative objective that aligns developers (who want speed) and operators (who want stability):
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px] pt-1">
          <div class="bg-[#0A0E1A] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
            <span class="font-code font-bold text-emerald-400">&gt; 50% Budget Remaining</span>
            <span class="font-sans font-semibold text-white">Full Feature Velocity</span>
            <p class="text-slate-300 text-[11.5px]">Aggressive deployment frequency, canary rollouts, experiments, and architectural migrations proceed without restriction.</p>
          </div>
          <div class="bg-[#0A0E1A] border border-amber-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
            <span class="font-code font-bold text-amber-400">1% – 20% Budget Remaining</span>
            <span class="font-sans font-semibold text-white">Elevated Gating &amp; Canary Slowdown</span>
            <p class="text-slate-300 text-[11.5px]">Requires principal engineer sign-off on non-critical releases. Canary rollout bake times doubled; automated ACA metric analysis required.</p>
          </div>
          <div class="bg-[#0A0E1A] border border-rose-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
            <span class="font-code font-bold text-rose-400">&lt;= 0% Budget (Exhausted)</span>
            <span class="font-sans font-semibold text-white">Feature Freeze &amp; Reliability Sprint</span>
            <p class="text-slate-300 text-[11.5px]">All non-security feature deployments halted. 100% of engineering bandwidth diverted to bug fixing, infrastructure hardening, and circuit breaker implementation.</p>
          </div>
        </div>
      </div>

      <!-- Production PromQL Recording Rules -->
      <div class="bg-[#060911] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="font-code text-[11.5px] font-bold text-cyan-400 uppercase tracking-wider">
            PRODUCTION PROMETHEUS RECORDING &amp; ALERTING BLUEPRINT
          </span>
          <span class="text-[11px] font-code text-slate-500">prometheus_rules.yaml</span>
        </div>
        <p class="text-[12px] text-slate-400 font-sans">
          Production recording rules pre-compute SLI ratios every 30 seconds to prevent query engine timeouts during high-load incident investigations:
        </p>
        <div class="text-[11px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed bg-[#0A0E1A] p-4 rounded-lg border border-slate-800">
# 1. Precalculate 5m good and total request rates
- record: job:http_requests:rate5m
  expr: sum by (job) (rate(http_requests_total{job="checkout-api"}[5m]))

- record: job:http_errors:rate5m
  expr: sum by (job) (rate(http_requests_total{job="checkout-api", status=~"5.."}[5m]))

# 2. Multi-Window Burn Rate Alert (14.4x burn rate = 2% budget in 1h)
# Target SLO: 99.9% Availability (Target Error Rate = 0.001)
- alert: HighErrorBudgetBurnRate
  expr: |
    (
      job:http_errors:rate5m{job="checkout-api"} / job:http_requests:rate5m{job="checkout-api"}
      &gt; (14.4 * 0.001)
    )
    and
    (
      job:http_errors:rate1h{job="checkout-api"} / job:http_requests:rate1h{job="checkout-api"}
      &gt; (14.4 * 0.001)
    )
  for: 2m
  labels:
    severity: page
  annotations:
    summary: "Checkout API consuming error budget at 14.4x rate (100% budget gone in 48h)"
    runbook_url: "https://wiki.corp.internal/runbooks/checkout-api-degradation"
        </div>
      </div>

      <!-- Key Architectural Takeaway -->
      <div class="bg-gradient-to-r from-indigo-950/60 to-cyan-950/60 border border-indigo-500/40 rounded-xl p-5 flex flex-col gap-2">
        <span class="font-code text-[11px] text-indigo-400 uppercase font-bold tracking-wider">
          SUMMARY: SYSTEM DESIGN &amp; STAFF ARCHITECTURE PRINCIPLES
        </span>
        <p class="font-sans text-[13.5px] text-white font-medium leading-relaxed">
          "Define SLIs as proportions of good events over valid events measured at the edge gateway, filtering client-side errors. 
          Formulate SLOs over rolling 28-day windows to prevent calendar reset gaming. 
          Replace static threshold alerts with multi-window multi-burn-rate alerting to eliminate alert fatigue while catching both catastrophic collapses and slow insidious leaks. 
          Remember that serial microservice calls compound availability decay exponentially: achieve high availability not by demanding perfection from downstream dependencies, but by architecting decoupling mechanisms via caches, queues, and degraded fallbacks."
        </p>
      </div>

    </div>
  `;
}
