/**
 * Durable Execution Engines (Temporal / Cadence) (Topic 13.3)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 167–169
 */

export function renderDurableExecutionContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="durable-execution">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 13.3 · Pages 167–169
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Resilient Workflow Systems
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Journal & Replay Mechanics · Determinism Invariants · Temporal vs Step Functions</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Durable Execution Engines: Temporal & Cadence</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Writing long-running distributed sagas with standard queues and database status columns results in brittle, bespoke state machines that leak edge cases. Durable execution engines allow developers to write standard synchronous-looking code (including 30-day timers) that survives server crashes, worker restarts, and datacenter failures using event-history replaying.
      </p>
    </div>

    <!-- The Journal and Replay Mechanism Diagram -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The Journal-and-Replay Execution Lifecycle (Page 168)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
  WORKFLOW CODE WRITTEN BY ENGINEER:
  async function orderWorkflow(order) {
    const payment = await workflow.executeActivity(chargePayment, order);
    await workflow.sleep('7 days'); // Durable pause without holding thread memory!
    const receipt = await workflow.executeActivity(sendReceipt, payment);
    return receipt;
  }

  CRASH & REPLAY MECHANICS:
  Worker Node crashes during the 7-day sleep or during sendReceipt!
  1. A new Worker Node in another availability zone picks up the workflow execution task.
  2. The worker loads the APPEND-ONLY EVENT HISTORY from Temporal Server.
  3. The worker RE-RUNS 'orderWorkflow()' from Line 1.
  4. At 'chargePayment': The engine DOES NOT call the payment gateway! It reads the previous
     result from the event journal and instantaneously resolves the Promise in memory.
  5. At 'workflow.sleep': The engine sees the timer already expired in history and advances.
  6. The worker resumes LIVE execution exactly where the crashed process stopped!
</pre>
      </div>
    </div>

    <!-- Determinism Invariants: The Hard Rules -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        The Iron Rule of Determinism: Where Workflow Code Fails (Page 168)
      </h3>
      <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 space-y-3 leading-relaxed">
        <p>
          Because state is reconstructed by replaying the function body against past recorded events, <strong>workflow code must be 100% deterministic</strong>. If a replayed run takes a different conditional branch than the original run, the engine detects a non-deterministic error and blocks the workflow.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 font-mono">
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <strong class="text-rose-400 block mb-1">STRICTLY FORBIDDEN IN WORKFLOWS:</strong>
            • Direct system clocks: <code class="text-rose-300">Date.now()</code> or <code class="text-rose-300">time.Now()</code><br/>
            • Random generation: <code class="text-rose-300">Math.random()</code> or <code class="text-rose-300">UUID.random()</code><br/>
            • Direct network I/O: <code class="text-rose-300">fetch()</code>, database queries, Redis calls<br/>
            • Iterating over unordered hash maps/sets
          </div>
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <strong class="text-emerald-400 block mb-1">HOW TO IMPLEMENT CORRECTLY:</strong>
            • Use deterministic engine APIs: <code class="text-emerald-300">workflow.now()</code><br/>
            • Use deterministic random seeds provided by the runtime<br/>
            • Move all I/O and side effects into <strong>Activities</strong><br/>
            • Activities must be idempotent because they retry automatically
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Matrix Table -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        Orchestration Tool Selection Matrix (Page 168)
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Tool</th>
              <th class="p-3 font-semibold text-cyan-300">Execution Model</th>
              <th class="p-3 font-semibold text-slate-300">When to Choose</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">Temporal / Cadence</td>
              <td class="p-3 text-cyan-200">Real code in TS/Go/Java replayed from event journal</td>
              <td class="p-3 text-slate-300"><strong class="text-emerald-300">Gold standard for complex sagas.</strong> Multi-step financial transactions, long-lived subscriptions, human approval flows.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">AWS Step Functions</td>
              <td class="p-3 text-purple-200">Declarative JSON/YAML state machine DSL</td>
              <td class="p-3 text-slate-300">Serverless AWS integrations (Lambda, DynamoDB); simple flows without maintaining server clusters.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Airflow / Dagster</td>
              <td class="p-3 text-amber-200">Scheduled batch DAGs over data partitions</td>
              <td class="p-3 text-slate-300">ETL data pipelines and ML training batches. Unsuitable for low-latency per-request business transactions.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">DB Status Column + Cron</td>
              <td class="p-3 text-slate-400">Custom SQL polling state machine</td>
              <td class="p-3 text-slate-300">Simple 2-step async task within a single team. Inevitably outgrown when timers, retries, and compensation proliferate.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Staff Interview Follow-ups -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Staff Interview Follow-up: Versioning 30-Day In-Flight Workflows
      </h3>
      <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800 text-xs space-y-2">
        <h4 class="font-bold text-cyan-300">The Hard Problem: How do you deploy code changes when 50,000 workflows are currently paused?</h4>
        <p class="text-slate-300 leading-relaxed">
          If a workflow sleeps for 30 days and you deploy a new version that adds or removes an activity call, the next event replay against the new code will fail with a non-deterministic assertion error. Engines solve this with explicit version branching:
        </p>
        <div class="bg-[#0A0E17] p-2.5 rounded border border-slate-800 font-mono text-cyan-300 text-[11px]">
          const version = workflow.getVersion('payment-v2-check', workflow.DEFAULT_VERSION, 2);<br/>
          if (version === 2) {<br/>
          &nbsp;&nbsp;await workflow.executeActivity(newPaymentActivity);<br/>
          } else {<br/>
          &nbsp;&nbsp;await workflow.executeActivity(legacyPaymentActivity);<br/>
          }
        </div>
        <p class="text-slate-400 text-[11.5px] leading-relaxed">
          The version marker is recorded in the event journal so older workflows continue executing the legacy branch during replay, while new instances run the upgraded path cleanly.
        </p>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 169)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Durable execution replaces fragile custom polling loops with guaranteed stateful execution via journal-and-replay. Enforce strict determinism in workflow code, make all activities idempotent, and use versioning branches to protect long-running in-flight workflows across code deployments."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
