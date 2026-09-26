/**
 * 2.8 Load Balancing: L4 vs. L7 - Visual Guide
 * High-signal, visually rich reproduction of Pages 30, 31, and 32
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderLoadBalancingContent(topic) {
  const dimensionRows = [
    {
      dim: "Routing Decision",
      l4: "IP + Port (Per connection)",
      l7: "URL path, headers, cookies, HTTP method (Per request)",
      highlight: "text-cyan-300"
    },
    {
      dim: "Throughput / Cost",
      l4: "Extremely high; connection pass-through (DSR/IPVS)",
      l7: "Lower; terminates client TCP/TLS and re-establishes to backend",
      highlight: "text-slate-300"
    },
    {
      dim: "Protocol Support",
      l4: "Protocol agnostic (TCP, UDP, TLS, SCTP)",
      l7: "Application specific (HTTP/1.1, HTTP/2, gRPC, WebSocket)",
      highlight: "text-slate-300"
    },
    {
      dim: "Key Capabilities",
      l4: "Ultra-fast failover, DDoS SYN-flood defense, kernel packet dispatch",
      l7: "TLS termination, URL path routing, header rewrites, WAF, Canary (sec. 8.1)",
      highlight: "text-emerald-300"
    },
    {
      dim: "Observability",
      l4: "Bytes/sec, connection count, TCP resets",
      l7: "Per-route status codes (2xx/4xx/5xx), p99 latency, distributed tracing",
      highlight: "text-indigo-300"
    },
    {
      dim: "Representative Tools",
      l4: "AWS NLB, Linux IPVS, Katran (Meta), HAProxy (TCP mode)",
      l7: "AWS ALB, Envoy, NGINX, HAProxy (HTTP mode), Traefik",
      highlight: "text-amber-300 font-code"
    }
  ];

  const algorithmRows = [
    {
      name: "Round Robin",
      behaviour: "Next server in strict circular order",
      failsWhen: "Requests have wildly varying computational cost — a slow node keeps receiving equal work."
    },
    {
      name: "Weighted Round Robin",
      behaviour: "Dispatches proportional to pre-configured capacity weights",
      failsWhen: "Weights are static and drift from runtime server conditions."
    },
    {
      name: "Least Connections",
      behaviour: "Routes to server with the fewest active in-flight requests",
      failsWhen: "A freshly started cold instance gets abruptly flooded before its JIT/cache is warm."
    },
    {
      name: "Least Response Time",
      behaviour: "Routes to fastest observed historical response time",
      failsWhen: "Feedback loops and oscillation: all traffic rushes to the fastest node, saturating it."
    },
    {
      name: "Consistent Hashing",
      behaviour: "Hashes request key (user_id/IP) onto a hash ring (sec. 4.7)",
      failsWhen: "Hot keys create hot nodes; needed when local cache or session affinity is essential."
    },
    {
      name: "Power of Two Choices",
      behaviour: "Picks 2 servers at random, routes to the one with fewer active loads",
      failsWhen: "Rarely — this is the proven, pragmatic industry default for large-scale clusters."
    }
  ];

  const followUps = [
    {
      q: "Are sticky sessions acceptable in senior architectures?",
      a: "<strong>They are an architectural anti-pattern.</strong> Sticky sessions break even load distribution, make scaling in and rolling deployments disruptive (reboots evict users), and convert an individual server crash into visible customer session loss. <em>The senior move:</em> keep app servers strictly stateless and store session state in a shared Redis cluster or signed client token (JWT). <em>Legitimate exceptions:</em> preserving expensive in-memory local caches, and stateful long-lived connections (WebSockets) that are inherently pinned."
    },
    {
      q: "How does a load balancer make an overload worse during an incident?",
      a: "<strong>By retrying.</strong> When backend servers are saturated, load-balancer-level retries multiply request volume exactly when backends can least afford it. As responses slow, health checks time out and mark servers unhealthy, shrinking the serving pool and concentrating load onto fewer survivors. Defenses: <strong>retry budgets</strong> (cap retries to ≤10% of traffic), edge <strong>load shedding</strong> with HTTP 429/503, and circuit breaking (sec. 8.2)."
    },
    {
      q: "Should you use Layer 4 or Layer 7 for a gRPC microservice?",
      a: "<strong>You must use Layer 7 (or client-side balancing).</strong> gRPC multiplexes hundreds of concurrent RPC calls across a single long-lived HTTP/2 TCP connection. An L4 balancer only sees the TCP connection, so all requests from a client are pinned to one single backend server, causing extreme load skew. L7 balancers (Envoy/ALB) unpack HTTP/2 binary frames and balance individual RPC requests, or service meshes use client-side load balancing via sidecars."
    },
    {
      q: "How do you drain a node during deployment without dropping active requests?",
      a: "Follow the graceful drain sequence: 1) Mark the node unhealthy in the registration check so the load balancer stops routing new requests; 2) Maintain in-flight requests for a drain window longer than the LB's health-check interval + max request timeout; 3) Instruct clients to close keep-alive sockets gracefully using <code>Connection: close</code> response headers; 4) Send SIGTERM, wait for zero active connections, and terminate. Skipping the drain window is the primary cause of 5xx spikes during deploys."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="2.8-load-balancing">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Part 2 · Networking &amp; Protocols
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 30–32 · Section 2.8</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          2.8 Load Balancing: L4 vs. L7
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Traffic dispatchers sit between clients and backend fleets. Senior interviews probe beyond "add a load balancer" into layer choice, dispatch algorithms, health-check cascading traps, and graceful node draining.
        </p>
      </div>

      <!-- Layer 4 vs Layer 7 Dimension Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          LAYER 4 (TRANSPORT) VS. LAYER 7 (APPLICATION)
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/5">Dimension</th>
                <th class="p-3 w-2/5">Layer 4 (Transport / Packet)</th>
                <th class="p-3 w-2/5">Layer 7 (Application / Request)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${dimensionRows.map(r => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-slate-200 font-code text-[12px]">${r.dim}</td>
                  <td class="p-3 text-slate-300">${r.l4}</td>
                  <td class="p-3 ${r.highlight}">${r.l7}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Ingress Tier Architecture Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            TYPICAL PRODUCTION LAYERED TOPOLOGY
          </span>
          <span class="text-[11px] font-code text-slate-500">Multi-Tier Ingress Flow</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
Users ──► DNS (Geo/Latency routing, sec. 2.3)
           │
           ▼
Anycast IP ──► Layer 4 LB (AWS NLB / IPVS: fast, stateless, millions QPS, SYN flood protection)
                 │
                 ▼
             Layer 7 LB / API Gateway (Envoy / ALB: TLS termination, path routing, rate limits, sec. 3.4)
                 │
         ┌───────┴───────────────┬────────────────────────┐
         ▼                       ▼                        ▼
   [ svc-A pool ]          [ svc-B pool ]          [ canary pool (5%) ]
   (Order Service)         (User Service)          (New Version, sec. 8.1)

  ▲ Health checks run at every tier: each tier removes dead nodes from rotation automatically.
        </div>
      </div>

      <!-- Algorithms and Failure Modes -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          BALANCING ALGORITHMS &amp; WHEN EACH FAILS
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${algorithmRows.map(alg => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[12px] font-bold text-cyan-300">${alg.name}</span>
                <span class="text-[10.5px] font-code text-slate-400">${alg.behaviour}</span>
              </div>
              <p class="text-[12px] text-rose-300/90 leading-relaxed font-sans">
                <strong>Fails when:</strong> ${alg.failsWhen}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Two Details That Signal Senior Experience -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#161C2E] border border-cyan-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">health_and_safety</span>
            1. Shallow vs. Deep Health Checks
          </span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            Shallow checks ask: <em>"is the port open?"</em> Deep checks ask: <em>"can it reach its database?"</em> Deep checks are superior until a shared database has a temporary 2-second blip and <strong>every node marks itself unhealthy simultaneously</strong>. Always configure a <strong>minimum-healthy-hosts floor</strong> (e.g. 50%), or configure the LB to "fail open" rather than terminating 100% of traffic.
          </p>
        </div>

        <div class="bg-[#161C2E] border border-indigo-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-indigo-300 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">hub</span>
            2. The LB Is Not a SPOF (High Availability)
          </span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            How does the load balancer itself survive failure? Answer with the exact mechanism: <strong>Active-Passive pairs</strong> running VRRP / keepalived with a floating Virtual IP (VIP), or <strong>Multiple Active LBs</strong> sharing an Anycast BGP IP address where network routers automatically reroute around dead balancers in seconds.
          </p>
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
          "L4 for speed and protocol-agnostic failover; L7 for anything that requires understanding the request. Most real systems use both, and the follow-ups are always about health checks, retries, and statefulness — not the algorithm."
        </p>
      </div>

    </div>
  `;
}
