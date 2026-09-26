/**
 * Service Decomposition and the Strangler Fig (Topic 13.4)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 169–171
 */

export function renderServiceDecompositionContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="service-decomposition">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 13.4 · Pages 169–171
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Evolutionary Architecture
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Strangler Fig Pattern · Data Ownership Seams · The Distributed Monolith Anti-Pattern</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Service Decomposition & The Strangler Fig Pattern</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Microservices are an organizational solution to scale developer velocity, not a raw computational performance optimization. Splitting a monolith requires identifying true architectural seams based on data ownership and change coupling, and incrementally migrating traffic via a Strangler Facade without risky big-bang rewrites.
      </p>
    </div>

    <!-- The Strangler Fig Evolution Diagram -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The 4-Phase Strangler Fig Migration Flow (Page 169)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
  PHASE 1: FACADE INSERTION (Zero code changes behind it)
    Clients ──► [API GATEWAY / FACADE] ──(100% Traffic)──► [LEGACY MONOLITH]

  PHASE 2: EXTRACT FIRST VERTICAL SLICE
    Clients ──► [API GATEWAY] ──(100% Core)──► [LEGACY MONOLITH]
                     │
                     └──(Shadow / 0% Writes)──► [NEW AUTH SERVICE] (Own DB)

  PHASE 3: SHADOW RUN & INCREMENTAL CUTOVER
    Clients ──► [API GATEWAY] ──(90% /api/orders)──► [LEGACY MONOLITH]
                     │
                     └──(100% /api/auth)────────► [NEW AUTH SERVICE]

  PHASE 4: STRANGLED & RETIRED
    Clients ──► [API GATEWAY] ──► [AUTH SERVICE] ──► [ORDERS SERVICE]
                                  (Monolith slice safely decommissioned)
</pre>
      </div>
    </div>

    <!-- Finding Genuine Seams Table -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        Finding Real Seams: What Justifies a Service Boundary (Page 169)
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Architectural Signal</th>
              <th class="p-3 font-semibold text-cyan-300">Why It Justifies a Service Boundary</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">Data Ownership</td>
              <td class="p-3 text-slate-300"><strong class="text-emerald-300">The Strongest Signal.</strong> If one module is the sole legitimate writer of a dataset, that is a service. Shared write access to the same database tables is NOT a boundary.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Change Coupling</td>
              <td class="p-3 text-slate-300">Analyze Git history: files and modules that always commit together belong in the same service, regardless of theoretical folder categorization.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Bounded Context</td>
              <td class="p-3 text-slate-300">The same noun means different things: "Order" in checkout (payment, pricing) vs "Order" in fulfillment (boxes, tracking). Two meanings = two independent domains.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Divergent Scaling Profiles</td>
              <td class="p-3 text-slate-300">One path receives 1,000× more traffic or requires specialized hardware (GPUs for ML inference, in-memory caches). Separating it allows isolated resource scaling.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Availability Isolation</td>
              <td class="p-3 text-slate-300">Core checkout revenue paths must remain 99.99% available even if the personalization/recommendation engine experiences a total outage.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- The Anti-Pattern: Distributed Monolith -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        The Worst Architectural Failure Mode: The Distributed Monolith (Page 170)
      </h3>
      <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 space-y-3 leading-relaxed">
        <p>
          The failure mode is not "having too many services" — it is creating services that <strong>cannot be deployed independently</strong>.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 font-mono">
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <strong class="text-rose-400 block mb-1">Tell-tale Symptoms:</strong>
            • Shared database across multiple services<br/>
            • Coordinated release trains (Service A & B must ship together)<br/>
            • Synchronous REST cascade chains (A → B → C → D)<br/>
            • Massive end-to-end integration test suite required before any deploy
          </div>
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <strong class="text-amber-400 block mb-1">The Reality:</strong>
            You pay the full penalties of distributed systems (network latency, partial network failure, serialization overhead, complex distributed tracing) while retaining all the painful coupling of the monolith. A well-modularized monolith is vastly superior!
          </div>
        </div>
      </div>
    </div>

    <!-- How to Prove the Split Worked -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Metrics That Prove the Decomposition Worked (Page 170)
      </h3>
      <div class="p-4 rounded-xl bg-[#141C2E] border border-emerald-500/20 text-xs space-y-2 leading-relaxed">
        <p class="text-slate-300">
          Never judge a microservices migration by the count of services created. Measure the four DORA metrics plus one structural health metric:
        </p>
        <ul class="space-y-1.5 text-slate-300 list-disc list-inside font-mono">
          <li><strong>Deployment Frequency per team:</strong> Must significantly increase (teams ship without cross-team meetings).</li>
          <li><strong>Lead Time for Changes:</strong> Must decrease from weeks to hours.</li>
          <li><strong>Change Failure Rate:</strong> Must remain flat or decline.</li>
          <li><strong>Single-Service Change Ratio:</strong> &gt;80% of pull requests must touch <em>exactly one service</em>. If most changes still touch 3+ services, your boundaries are drawn wrong!</li>
        </ul>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 171)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Draw service boundaries around data ownership (strictly one writer per dataset) and bounded contexts, never around domain nouns. Migrate incrementally using the Strangler Fig facade with shadow traffic, and judge success by deployment independence and DORA metrics."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
