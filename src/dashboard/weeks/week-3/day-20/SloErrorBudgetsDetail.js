/**
 * 12.3 SLIs, SLOs and Error Budgets - Visual Guide
 * High-signal, visually rich reproduction of Pages 154–155
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderSloErrorBudgetsContent(topic) {
  const sliTypes = [
    {
      type: "Availability",
      definition: "Successful requests / Valid requests",
      useFor: "Core web & API paths. Note: 4xx client errors do NOT consume your budget; only 5xx server faults do."
    },
    {
      type: "Latency",
      definition: "% of requests completing faster than target threshold",
      useFor: "Interactive user journeys. Threshold-based (e.g. p99 < 300ms), NEVER an arithmetic mean."
    },
    {
      type: "Freshness",
      definition: "% of data updates newer than threshold X",
      useFor: "Read replicas, CDN caches, search indexes, CDC streaming pipelines (sec. 4.5)."
    },
    {
      type: "Correctness",
      definition: "% of financial/state outputs that reconcile cleanly",
      useFor: "Double-entry payment ledgers, billing runs, and transaction netting systems (sec. 9.4.4)."
    },
    {
      type: "Coverage",
      definition: "% of records successfully processed to completion",
      useFor: "Asynchronous background consumers, event streaming jobs, and batch ETL pipelines."
    }
  ];

  const burnRates = [
    {
      rate: "1× Burn Rate",
      window: "28 Days",
      action: "Sustainable Steady State",
      color: "text-emerald-400 border-emerald-500/30",
      desc: "Consumes exactly 100% of the monthly error budget over the full 28-day window. No action needed."
    },
    {
      rate: "6× Burn Rate",
      window: "~4.7 Days",
      action: "Automated Ticket / Slack Alert",
      color: "text-amber-400 border-amber-500/30",
      desc: "Slow burn: budget will be completely exhausted in 4.7 days. Triggers a ticket, not a 2 a.m. page."
    },
    {
      rate: "14.4× Burn Rate",
      window: "2 Days (48 Hours)",
      action: "High-Priority On-Call Page",
      color: "text-rose-400 border-rose-500/30",
      desc: "Fast burn: 2% of budget consumed in 1 hour. Multi-window: fires if 14.4× over 1 hour AND over 5 minutes."
    }
  ];

  const followUps = [
    {
      q: "Set an SLO for an e-commerce checkout API and defend the numbers.",
      a: "Propose two user-facing SLIs: 1) <strong>Availability:</strong> <code>99.95% of valid requests return 2xx over rolling 28 days</code>; 2) <strong>Latency:</strong> <code>99% of successful requests complete in under 500ms</code>, measured at the edge gateway. Defend 99.95% over 'four nines' (99.99%) with unit economics: 99.95% allows ~20 minutes of monthly downtime, whereas 99.99% (4.4 min/mo) mandates multi-region active-active synchronous replication (sec. 12.4), doubling infrastructure costs."
    },
    {
      q: "Why use multi-window burn-rate alerting instead of a simple error-rate threshold?",
      a: "A static threshold (e.g. 'page if error rate > 2%') is either <strong>too noisy or too slow</strong>: a transient 30-second 3% blip pages an engineer at night unnecessarily, while a persistent 1% slow leak drains the entire monthly budget without triggering an alert. <strong>Burn-rate alerting</strong> measures the exact rate of budget consumption and requires BOTH a short window (5 min) and a long window (1 hour) to match, eliminating false pages while catching real degradation."
    },
    {
      q: "Your downstream dependency has an SLO of 99.9%. What can your service's SLO be?",
      a: "<strong>Worse than 99.9%</strong> if called synchronously! Availability multiplies: five 99.9% dependencies in series yield an availability ceiling of $0.999^5 \\approx 99.5\\%$. To promise higher availability than your dependencies, you must decouple from them: cache their responses (sec. 5.1), make communication asynchronous via queues, or serve a graceful degraded fallback (sec. 8.2)."
    },
    {
      q: "How many SLOs should a microservice maintain?",
      a: "<strong>Very few: typically 2 to 3 per critical user journey.</strong> If a service has 40 internal SLOs, engineers suffer alert fatigue, alerts get ignored, and the error budget policy becomes unenforceable because something is always red. Set SLOs on journeys customers experience, not on internal implementation details."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="12.3-slo">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 12 · Reliability &amp; Operations at Scale
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 154–155 · Section 12.3</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          12.3 SLIs, SLOs and Error Budgets
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          An <strong>SLI</strong> is a measurement of user-visible behaviour. An <strong>SLO</strong> is the target for it. The <strong>Error Budget</strong> is the allowable failure margin. An <strong>SLA</strong> is a business contract with financial penalties.
        </p>
      </div>

      <!-- The Four Definitions Table -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase">SLI (Indicator)</span>
          <p class="text-[12px] text-slate-300 font-sans">What you measure: <code>Good Requests / Total Valid Requests</code></p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1">
          <span class="font-code text-[11px] font-bold text-indigo-400 uppercase">SLO (Objective)</span>
          <p class="text-[12px] text-slate-300 font-sans">Internal target: <code>99.95% over rolling 28 days</code></p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase">Error Budget</span>
          <p class="text-[12px] text-slate-300 font-sans">Allowable shortfall: <code>1 - SLO = 0.05% (~20 min/mo)</code></p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase">SLA (Agreement)</span>
          <p class="text-[12px] text-slate-300 font-sans">Legal/commercial contract: credit refunds if breached</p>
        </div>
      </div>

      <!-- The Mistake That Invalidates An SLO -->
      <div class="bg-[#1C1322] border-l-4 border-rose-500 rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 font-sans">
        <span class="font-code text-[12px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">dangerous</span>
          THE MISTAKE THAT INVALIDATES AN SLO: NEVER USE AN AVERAGE
        </span>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          <em>"Average latency under 200ms"</em> is satisfied even when 5% of your customers wait four seconds, because the arithmetic mean completely masks the long-tail p99 degradation. The only correct formulation is a <strong>proportion over a threshold</strong>: <em>"99% of requests complete in under 200ms over rolling 28 days."</em>
        </p>
      </div>

      <!-- SLI Types Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          CHOOSING AN SLI THAT MEANS SOMETHING
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/5">SLI Type</th>
                <th class="p-3 w-2/5">Formal Definition</th>
                <th class="p-3 w-2/5">Where to Apply It</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${sliTypes.map(s => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${s.type}</td>
                  <td class="p-3 text-slate-200 font-mono text-[11.5px]">${s.definition}</td>
                  <td class="p-3 text-slate-300">${s.useFor}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Burn-Rate Alerting Architecture -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            MULTI-WINDOW BURN-RATE ALERTING ARCHITECTURE
          </span>
          <span class="text-[11px] font-code text-slate-500">Google SRE Model</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          ${burnRates.map(b => `
            <div class="bg-[#0F1626] border rounded-xl p-3.5 flex flex-col gap-1.5 ${b.color}">
              <div class="flex items-center justify-between">
                <span class="font-code text-[13px] font-bold">${b.rate}</span>
                <span class="text-[10px] font-code text-slate-400">${b.window}</span>
              </div>
              <span class="font-sans text-[11.5px] font-semibold text-slate-200">${b.action}</span>
              <p class="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">${b.desc}</p>
            </div>
          `).join('')}
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
          "Express an SLO as a proportion over a threshold across a rolling window, measured where the user is, excluding client errors. The error budget turns reliability into a spendable quantity, and burn-rate alerting is how you page on it. Never promise more availability than your synchronous dependencies multiply out to."
        </p>
      </div>

    </div>
  `;
}
