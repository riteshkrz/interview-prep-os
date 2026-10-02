/**
 * 12.7 Chaos Engineering & Game Days - Comprehensive System Design Deep Dive
 * Complete architectural reference covering hypothesis-driven failure injection,
 * the 4-layer fault hierarchy, automated kill-switches, blast-radius containment, and real-world failure drills.
 */

export function renderChaosEngineeringContent(topic) {
  const methodSteps = [
    {
      num: "1",
      title: "Define Steady State",
      focus: "Formulate quantifiable business-level metrics rather than infrastructure signals.",
      desc: "Measure end-to-end customer outcomes: e.g., 'checkout_completion_rate >= 99.9%', 'p99 API gateway latency <= 350ms', and 'error budget burn rate <= 1.0x'. Raw CPU or memory metrics are secondary; customer journey continuity is primary."
    },
    {
      num: "2",
      title: "Formulate Concrete Hypothesis",
      focus: "State exact testable failure expectations with explicit temporal bounds.",
      desc: "Example: 'When downstream payment service experiences 2,000ms latency, the circuit breaker trips to OPEN within 3 seconds, falling back to cached tokens; edge 5xx remains < 0.05% and zero threads are starved.'"
    },
    {
      num: "3",
      title: "Bound the Blast Radius",
      focus: "Contain experimental fallout before touching production traffic.",
      desc: "Follow the blast progression ladder: Local Docker sandbox -> Pre-production staging -> Canary traffic tier (1% users tagged with synthetic chaos headers) -> Single Availability Zone -> Multi-Region evacuation."
    },
    {
      num: "4",
      title: "Inject Single Invariant Failure",
      focus: "Isolate variables to maintain causal determinism.",
      desc: "Inject exactly ONE variable at a time (e.g., packet drop, CPU starvation, or dependency 500s). Running multiple overlapping chaos vectors makes root-cause attribution mathematically intractable."
    },
    {
      num: "5",
      title: "Observe & Correlate Telemetry",
      focus: "Validate steady state against high-frequency distributed traces and metrics.",
      desc: "Did the system self-heal? Did fallbacks engage cleanly? If steady state broke, congratulations: you uncovered a multi-million-dollar production outage in a controlled window with engineers standing by."
    },
    {
      num: "6",
      title: "Automate as Continuous CI/CD Gate",
      focus: "Transform post-mortem learnings into permanent automated regression tests.",
      desc: "Once a resilience bug is patched, convert the chaos drill into an automated pipeline gate (Continuous Chaos). Run the failure injection in nightly staging clusters to guarantee the bug never regresses."
    }
  ];

  const faultLayers = [
    {
      layer: "Layer 1: RPC / Application Faults",
      tools: "Envoy Fault Injection Filters, Istio Service Mesh, Toxiproxy, Chaos Mesh HTTPChaos",
      injections: "Injected HTTP 500/503 errors, corrupted response payloads, 1,500ms artificial network latency, dropped gRPC trailers.",
      whatItValidates: "Client retry budgets, deadline propagation, circuit breaker state transitions, and UI fallback rendering."
    },
    {
      layer: "Layer 2: Compute & OS Kernel Faults",
      tools: "Chaos Toolkit, Linux cgroups (CFS), stress-ng, tc (traffic control), eBPF probes",
      injections: "CPU quota exhaustion, memory allocation leaks triggering cgroup OOM-killer, socket buffer exhaustion, disk I/O latency.",
      whatItValidates: "Kernel thread scheduling resilience, Kubernetes pod eviction policies, readiness probe accuracy, and graceful SIGTERM handling."
    },
    {
      layer: "Layer 3: Network & Distributed Consensus",
      tools: "IPTables, eBPF TC (Traffic Control), Pumba, Chaos Mesh NetworkChaos, libfaketime",
      injections: "Asymmetric network partitions (Node A can send to B, but cannot receive), 10% packet drop, cross-AZ latency spikes, clock skew (+5s drift).",
      whatItValidates: "Raft/Paxos quorum majority survival, split-brain prevention, distributed lock lease expirations, and clock-independent ordering."
    },
    {
      layer: "Layer 4: Cloud Infrastructure & Region",
      tools: "AWS Fault Injection Service (FIS), Chaos Kong, Azure Chaos Studio, Google Cloud Chaos Engine",
      injections: "Termination of entire Availability Zones, sudden RDS Primary failover, S3 IAM permission revocation, regional WAN blackholing.",
      whatItValidates: "Disaster recovery runbook automation, Anycast traffic evacuation, stateless auto-scaling capacity, and cross-region data replication catch-up."
    }
  ];

  const topExperiments = [
    {
      name: "1. The Cache Tier Collapse (Cache Avalanche)",
      scenario: "Terminate or flush the entire Redis/Memcached cluster under peak production QPS.",
      vulnerability: "In poorly architected systems, every incoming query misses cache simultaneously and stampedes the primary SQL database. DB connection pools exhaust within 2 seconds, CPU hits 100%, and the entire application collapses.",
      architecturalFix: "Implement Single-Flight Request Coalescing (mutex-locking concurrent misses for the identical key), local in-memory fallback caches, jittered TTLs, and rate-limited database repopulation queues."
    },
    {
      name: "2. The Cascading Slow Dependency (Thread Starvation)",
      scenario: "Inject 2,500ms delay into a non-critical downstream microservice (e.g., product recommendation API).",
      vulnerability: "Upstream API gateway and caller services block their worker threads waiting for the 2.5s timeout. The caller's thread pool exhausts within seconds, rejecting incoming core checkout requests with HTTP 503.",
      architecturalFix: "Enforce strict Distributed Deadline Propagation (W3C Baggage / grpc-timeout headers), Bulkhead thread isolation (separate thread pools for optional dependencies), and instant Circuit Breaking."
    },
    {
      name: "3. The Raft Quorum Partition (Split-Brain Drill)",
      scenario: "Sever network communication between 1 follower and the remaining 2 nodes in a 3-node etcd/Consul cluster.",
      vulnerability: "If the partitioned node repeatedly increments its term and initiates bogus elections, it can cause leader flaps upon reconnection, or worse, accept split-brain writes if quorum logic is buggy.",
      architecturalFix: "Enforce Raft Pre-Vote protocol (nodes verify quorum connectivity before bumping term), generational fencing tokens validated at the storage layer, and strict N/2 + 1 majority requirements."
    },
    {
      name: "4. The Database Primary Termination (Immediate Kill)",
      scenario: "Execute 'kill -9' on the PostgreSQL Primary or trigger an unannounced AWS RDS Aurora failover.",
      vulnerability: "Application connection pools stall for 60 seconds waiting for TCP keepalives, or secondary promotion takes 3 minutes due to massive unapplied WAL backlog, causing widespread 5xx errors.",
      architecturalFix: "Deploy Patroni/Consul automated failover with sub-10s health detection, smart client connection pooling (HikariCP/PgBouncer with TCP keepalives set to 5s), and fast read replica catch-up."
    },
    {
      name: "5. The System Clock Skew Drill (+10s Drift)",
      scenario: "Use libfaketime or container hypervisor skew to jump the system clock forward by 10 seconds on half the cluster.",
      vulnerability: "Distributed locks (Redis Redlock) expire prematurely while work is still executing; JWT tokens are rejected as expired; Cassandra Last-Write-Wins timestamps silently overwrite newer writes.",
      architecturalFix: "Replace physical clock comparisons with Hybrid Logical Clocks (HLC), monotonic clock APIs (CLOCK_MONOTONIC for timeouts), and TrueTime confidence intervals."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-8 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="12.7-chaos">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Part 12 · Reliability &amp; Operations at Scale
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 160–162 · Section 12.7</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 25 mins
          </span>
        </div>
        <h3 class="font-sans text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-snug">
          12.7 Chaos Engineering, Fault Injection &amp; Production Game Days
        </h3>
        <p class="font-sans text-[14px] text-slate-300 leading-relaxed max-w-4xl">
          In large-scale distributed architectures, failures are not rare anomalies; they are mathematical certainties occurring every minute across thousands of instances. 
          <strong>Chaos Engineering is the empirical discipline of experimenting on a distributed system to build confidence in its capability to withstand turbulent production conditions.</strong> 
          Every circuit breaker, retry budget, and failover runbook in your system design remains mere unverified configuration until rigorously validated under controlled chaos.
        </p>
      </div>

      <!-- Chaos vs Testing Paradigm Shift -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Traditional Testing (Deterministic)</span>
            <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">Code Correctness</span>
          </div>
          <span class="font-mono text-[13px] text-white font-semibold">Assert: Function(Input) == ExpectedOutput</span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            Unit and integration tests verify known assertions in sterile, controlled sandboxes. They assume infrastructure is immortal, clocks are synchronized, networks are lossless, and downstream latencies are zero.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-5 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-rose-400 uppercase tracking-wider">Chaos Engineering (Empirical)</span>
            <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">System Emergence</span>
          </div>
          <span class="font-mono text-[13px] text-white font-semibold">Hypothesis: System Preserves Steady State Under Failure</span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            Probes emergent distributed behaviors invisible to unit tests: thread-pool exhaustion, cascading timeout spirals, split-brain partition handling, and silent connection leaks under real-world kernel stress.
          </p>
        </div>
      </div>

      <!-- The 6-Step Scientific Chaos Methodology -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="font-code text-[12.5px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">science</span>
            THE 6-STEP SCIENTIFIC METHOD: CHAOS IS AN EXPERIMENT, NOT VANDALISM
          </span>
          <span class="text-[11px] font-code text-slate-500">Rigorous Experimental Design</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          ${methodSteps.map(s => `
            <div class="bg-[#0A0E1A] border border-slate-800/90 rounded-xl p-4 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="font-code text-[14px] font-bold text-cyan-400">Step 0${s.num}</span>
                <span class="font-code text-[12px] font-semibold text-white">${s.title}</span>
              </div>
              <span class="text-[11px] font-code text-amber-300/90">${s.focus}</span>
              <p class="text-[11.5px] text-slate-300 font-sans leading-relaxed pt-1 border-t border-slate-800/60">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- The 4-Layer Failure Injection Hierarchy -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[12px] font-bold text-slate-300 uppercase tracking-wider">
          THE FOUR-LAYER FAILURE INJECTION HIERARCHY &amp; PRODUCTION TOOLING
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/5">Failure Injection Layer</th>
                <th class="p-3 w-1/4">Tooling Ecosystem</th>
                <th class="p-3 w-1/3">Injected Failure Primitives</th>
                <th class="p-3 w-1/4">What It Conclusively Validates</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${faultLayers.map(row => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${row.layer}</td>
                  <td class="p-3 text-indigo-300 font-code text-[11px]">${row.tools}</td>
                  <td class="p-3 text-slate-300 leading-relaxed text-[11.5px]">${row.injections}</td>
                  <td class="p-3 text-emerald-300 leading-relaxed text-[11.5px]">${row.whatItValidates}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Automated Safety Control Plane & Kill-Switch Architecture -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-3 border-b border-[#24314A]/70">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-400 text-[18px]">emergency_home</span>
            <span class="text-[12px] font-code font-bold tracking-wider text-rose-400 uppercase">
              SAFETY CONTROL PLANE: AUTOMATED ABORT CIRCS &amp; BLAST RADIUS CONTAINMENT
            </span>
          </div>
          <span class="text-[11px] font-code text-slate-500">Production Safeguards</span>
        </div>

        <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
          Chaos without automated, real-time abort mechanisms is not engineering; it is recklessness. 
          A production chaos execution engine must be continuously tethered to an <strong>Automated Emergency Abort Controller</strong>:
        </p>

        <div class="text-[11.5px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed bg-[#060911] p-4 rounded-lg border border-[#1E293B]">
 [ CHAOS CONTROL PLANE ] ──► Injects Fault via Envoy / eBPF ──► [ TARGET PRODUCTION PODS ]
          │                                                               │
          │ Heartbeat Ping (Every 1s)                                     │ Emits High-Frequency Metrics
          ▼                                                               ▼
 [ DEAD-MAN WATCHDOG ]                                        [ PROMETHEUS / TELEMETRY ]
 (Auto-reverts if orchestrator crashes)                                   │
          │                                                               │
          │                                 PromQL: Error Budget Burn Rate &gt; 6.0x ?
          │                                 OR: Edge 5xx &gt; 0.5% for 30s ?
          │                                 OR: Core Journey p99 &gt; 600ms ?
          │                                                               │
          ▼                                                               ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                       AUTOMATED KILL-SWITCH TRIGGERED                       │
 │  1. Send SIGTERM to chaos injector process immediately                      │
 │  2. Reset Linux iptables / tc netem queuing rules via eBPF cleanup          │
 │  3. Revert Envoy fault-injection configuration via dynamic xDS update       │
 │  4. Post automated incident summary to #incident-oncall Slack channel       │
 └─────────────────────────────────────────────────────────────────────────────┘
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11.5px] font-sans">
          <div class="bg-[#0F1626] border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
            <strong class="text-cyan-300 font-mono">Tenant &amp; Customer Isolation Guardrails:</strong>
            <p class="text-slate-300">Tag chaos requests with <code>X-Chaos-Context: canary-test</code>. Layer 7 Envoy proxies ensure injected latency and 500 faults only impact internal synthetic test accounts or opt-in canary users, never high-tier enterprise VIP accounts.</p>
          </div>
          <div class="bg-[#0F1626] border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
            <strong class="text-rose-300 font-mono">Error Budget Gating:</strong>
            <p class="text-slate-300">Chaos experiments are strictly forbidden if the target service has less than 20% of its 28-day error budget remaining. Chaos is funded by the error budget; when the budget is spent, chaos testing is suspended.</p>
          </div>
        </div>
      </div>

      <!-- Top 5 Chaos Experiments Every Staff Engineer Must Know -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[12px] font-bold text-slate-300 uppercase tracking-wider">
          THE FIVE HIGH-SIGNAL CHAOS DRILLS EVERY STAFF ENGINEER MUST MASTER
        </span>
        <div class="flex flex-col gap-3.5">
          ${topExperiments.map(e => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2 font-sans">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="font-code text-[13px] font-bold text-cyan-300">${e.name}</span>
                <span class="text-[11px] font-code px-2 py-0.5 rounded bg-slate-800 text-slate-300">Failure Injection Drill</span>
              </div>
              <p class="text-[12px] text-slate-300 font-mono bg-[#0A0E1A] p-2.5 rounded border border-slate-800">
                <span class="text-amber-400 font-bold">Injection Scenario:</span> ${e.scenario}
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[12px]">
                <div class="bg-[#1C1322] border border-rose-900/40 p-3 rounded-lg flex flex-col gap-1">
                  <span class="font-code text-rose-400 font-bold">Vulnerability Discovered:</span>
                  <p class="text-slate-300 text-[11.5px] leading-relaxed">${e.vulnerability}</p>
                </div>
                <div class="bg-[#0D1F1F] border border-emerald-900/40 p-3 rounded-lg flex flex-col gap-1">
                  <span class="font-code text-emerald-400 font-bold">Staff Architectural Solution:</span>
                  <p class="text-slate-300 text-[11.5px] leading-relaxed">${e.architecturalFix}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Production Game Days & Team Structure -->
      <div class="bg-[#141C2E] border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-4 font-sans">
        <div class="flex items-center gap-2 pb-2 border-b border-[#24314A]/70">
          <span class="material-symbols-outlined text-indigo-400 text-[20px]">groups</span>
          <span class="font-code text-[12.5px] font-bold text-indigo-300 uppercase tracking-wider">
            ORGANIZING PRODUCTION GAME DAYS: TEAM ROLES &amp; POST-MORTEM CONVERSION
          </span>
        </div>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          A Game Day is a scheduled operational exercise where engineering teams validate human runbooks, alerting fidelity, and system resilience under simulated catastrophic failures:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1.5">
            <span class="font-code font-bold text-rose-400">The Chaos Master</span>
            <p class="text-slate-300 text-[11.5px]">Designs and executes the failure injection. Keeps the exact failure scenario secret in black-box drills to evaluate raw on-call observability.</p>
          </div>
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1.5">
            <span class="font-code font-bold text-cyan-400">Incident Commander</span>
            <p class="text-slate-300 text-[11.5px]">Leads the on-call triage response. Interprets dashboards, delegates investigation tasks, and coordinates mitigations following standard runbooks.</p>
          </div>
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1.5">
            <span class="font-code font-bold text-amber-400">The Scribe</span>
            <p class="text-slate-300 text-[11.5px]">Maintains an exact timestamped chronological log: when the failure started, when alerts fired, when the root cause was identified, and when mitigations took effect.</p>
          </div>
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3 flex flex-col gap-1.5">
            <span class="font-code font-bold text-emerald-400">System Observers</span>
            <p class="text-slate-300 text-[11.5px]">Monitor downstream dependencies and customer sentiment channels to ensure the blast radius remains strictly within experimental boundaries.</p>
          </div>
        </div>
      </div>

      <!-- Declarative Chaos Infrastructure Manifest -->
      <div class="bg-[#060911] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="font-code text-[11.5px] font-bold text-cyan-400 uppercase tracking-wider">
            DECLARATIVE CHAOS SPECIFICATION: KUBERNETES CHAOS-MESH MANIFEST
          </span>
          <span class="text-[11px] font-code text-slate-500">network_delay_experiment.yaml</span>
        </div>
        <p class="text-[12px] text-slate-400 font-sans">
          In production GitOps workflows, chaos experiments are committed as declarative custom resources with automated duration limits and namespace blast-radius selectors:
        </p>
        <div class="text-[11px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed bg-[#0A0E1A] p-4 rounded-lg border border-slate-800">
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: payment-gateway-latency-drill
  namespace: production-drills
spec:
  action: delay
  mode: fixed-percent
  value: '20%'                     # Blast radius: impact exactly 20% of traffic
  selector:
    namespaces:
      - payment-system
    labelSelectors:
      app: payment-gateway-adapter
  delay:
    latency: '1500ms'              # Inject 1.5s latency to test downstream circuit breaker
    jitter: '200ms'
    correlation: '50'
  duration: '5m'                   # Automated experiment duration limit
  scheduler:
    cron: '@daily'
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: recommender-fault-injection
spec:
  hosts:
    - recommender.service.internal
  http:
    - fault:
        abort:
          percentage:
            value: 50.0
          httpStatus: 503          # Inject 503 Service Unavailable to test UI fallback
      match:
        - headers:
            x-chaos-test:
              exact: "true"        # Isolated strictly to synthetic canary requests
      route:
        - destination:
            host: recommender.service.internal
        </div>
      </div>

      <!-- Statistical Verification & Telemetry Correlation -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3 font-sans">
        <div class="flex items-center gap-2 pb-2 border-b border-[#24314A]/70">
          <span class="material-symbols-outlined text-cyan-400 text-[20px]">analytics</span>
          <span class="font-code text-[12.5px] font-bold text-cyan-300 uppercase tracking-wider">
            STATISTICAL OBSERVATION: EVALUATING DISTRIBUTION SHIFTS UNDER CHAOS
          </span>
        </div>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          Determining whether a system survived a chaos experiment requires more than checking if servers stayed running. 
          Staff engineers evaluate statistical distribution divergence between the control group and the chaos experiment group:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px] pt-1">
          <div class="bg-[#0A0E1A] border border-slate-800 p-3.5 rounded-lg flex flex-col gap-1.5">
            <span class="font-code font-bold text-amber-300">1. Kolmogorov-Smirnov Test</span>
            <p class="text-slate-300 text-[11.5px]">Compares empirical cumulative distribution functions (eCDF) of latency between baseline and chaos pods to detect subtle tail degradation even when p50 remains unchanged.</p>
          </div>
          <div class="bg-[#0A0E1A] border border-slate-800 p-3.5 rounded-lg flex flex-col gap-1.5">
            <span class="font-code font-bold text-cyan-300">2. Error Budget Consumption Delta</span>
            <p class="text-slate-300 text-[11.5px]">Measures the exact percentage of the rolling 28-day error budget consumed during the drill. If budget burn exceeds 0.5% during the 5-minute test, the test is marked as an architectural defect.</p>
          </div>
          <div class="bg-[#0A0E1A] border border-slate-800 p-3.5 rounded-lg flex flex-col gap-1.5">
            <span class="font-code font-bold text-emerald-300">3. Downstream Shedding Efficiency</span>
            <p class="text-slate-300 text-[11.5px]">Verifies that when dependency errors were injected, total outbound socket connections and TCP retries to that dependency dropped by >90%, proving that the circuit breaker completely shielded downstream.</p>
          </div>
        </div>
      </div>

      <!-- Key Architectural Takeaway -->
      <div class="bg-gradient-to-r from-rose-950/60 to-indigo-950/60 border border-rose-500/40 rounded-xl p-5 flex flex-col gap-2">
        <span class="font-code text-[11px] text-rose-400 uppercase font-bold tracking-wider">
          SUMMARY: SYSTEM DESIGN &amp; STAFF ARCHITECTURE PRINCIPLES
        </span>
        <p class="font-sans text-[13.5px] text-white font-medium leading-relaxed">
          "Resilience is not a theoretical attribute you design on a whiteboard; it is a battle-tested property you prove through empirical chaos experiments. 
          Always execute chaos with a formally defined steady-state hypothesis, a strictly bounded blast radius, and an automated kill-switch. 
          The highest-signal experiments in distributed systems are killing the cache tier to test database stampede defense, injecting latency into non-critical dependencies to test deadline propagation and thread pool bulkheads, and partitioning consensus nodes to verify split-brain immunity. 
          When an experiment fails, celebrate: you just prevented an impending production outage for free."
        </p>
      </div>

    </div>
  `;
}
