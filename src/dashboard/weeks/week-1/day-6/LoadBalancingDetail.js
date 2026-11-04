/**
 * 2.8 Load Balancing: L4 vs. L7 - Visual Guide
 * High-signal, visually rich reproduction of Pages 30, 31, and 32
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderLoadBalancingContent(topic) {
  const dimensionRows = [
    {
      dim: "Everyday Mental Model",
      l4: "Highway Tollbooth: Directs cars purely by lane number without opening the trunk",
      l7: "Airport Customs: Opens suitcases, checks passports, reads destination tags",
      highlight: "text-cyan-300 font-sans"
    },
    {
      dim: "Routing Decision Basis",
      l4: "IP Address + TCP/UDP Port (Per connection)",
      l7: "URL path, headers, cookies, HTTP method, JSON body (Per request)",
      highlight: "text-cyan-300 font-code"
    },
    {
      dim: "Throughput & Performance",
      l4: "Blazing fast; wire-speed packet forwarding (Direct Server Return / IPVS)",
      l7: "Moderate; must terminate client TCP/TLS, parse HTTP, re-encrypt to backend",
      highlight: "text-slate-300"
    },
    {
      dim: "Protocol Support",
      l4: "Protocol agnostic (TCP, UDP, TLS, SCTP, VoIP)",
      l7: "Application specific (HTTP/1.1, HTTP/2, HTTP/3, gRPC, WebSockets)",
      highlight: "text-slate-300"
    },
    {
      dim: "Core Capabilities",
      l4: "Ultra-fast failover, DDoS SYN-flood defense, kernel packet dispatch",
      l7: "TLS termination, path routing (/api vs /static), header rewrites, WAF, Canary",
      highlight: "text-emerald-300"
    },
    {
      dim: "Observability & Metrics",
      l4: "Bytes/sec, packet count, active connection count, TCP resets",
      l7: "HTTP status codes (2xx/4xx/5xx), p99 latency, route-level metrics, W3C traces",
      highlight: "text-indigo-300"
    },
    {
      dim: "Industry Standard Tools",
      l4: "AWS NLB (Network Load Balancer), Linux IPVS, Meta Katran, HAProxy (TCP mode)",
      l7: "AWS ALB (Application Load Balancer), Envoy, NGINX, HAProxy (HTTP mode), Traefik",
      highlight: "text-amber-300 font-code"
    }
  ];

  const algorithmRows = [
    {
      name: "Round Robin",
      behaviour: "Sends requests to each server in sequential circular order (1, 2, 3...)",
      failsWhen: "Requests have wildly varying computational cost. A complex PDF generation query locks up server 1, but Round Robin keeps sending it equal traffic."
    },
    {
      name: "Weighted Round Robin",
      behaviour: "Dispatches traffic proportional to pre-configured capacity weights (e.g., 8-core gets 2x a 4-core)",
      failsWhen: "Weights are static hardcoded estimates that drift from runtime reality (e.g., background cron jobs or GC pauses eating CPU)."
    },
    {
      name: "Least Connections",
      behaviour: "Dispatches to the server currently handling the fewest active in-flight requests",
      failsWhen: "Cold Start Storm: When a newly deployed server boots up with 0 active connections, it gets flooded with hundreds of concurrent requests before its JIT cache is warm."
    },
    {
      name: "Least Response Time",
      behaviour: "Directs traffic to the server with the lowest observed historical latency",
      failsWhen: "Herd Oscillation: All traffic suddenly rushes to the single fastest node, instantly saturating it, causing traffic to ricochet back and forth between servers."
    },
    {
      name: "Consistent Hashing",
      behaviour: "Hashes request key (user_id or IP) onto a circular hash ring to ensure same user hits same node",
      failsWhen: "Hot Key / Celebrity Problem: A viral influencer or massive tenant concentrated on one hash slot overwhelms that specific server node."
    },
    {
      name: "Power of Two Choices (P2C)",
      behaviour: "Picks 2 servers completely at random, then routes to whichever of the two has fewer active loads",
      failsWhen: "Rarely — this is the proven, mathematical industry default (used by Envoy & NGINX) that avoids herd oscillation with $O(1)$ computational overhead."
    }
  ];

  const followUps = [
    {
      q: "Are sticky sessions acceptable in modern production architectures?",
      a: `<strong>They are an architectural anti-pattern for stateless APIs.</strong>
      <br/><br/>
      Sticky sessions (cookie-based session affinity) force all requests from a specific user to hit the exact same server instance. This causes three critical failures:
      <br/>
      1. <strong>Uneven Load Distribution:</strong> A handful of heavy power-users can pin themselves to one server and push it into 100% CPU exhaustion while neighboring servers sit idle.
      <br/>
      2. <strong>Disrupted Deployments:</strong> During rolling deploys or auto-scaling down, terminating an instance immediately kicks active users off and wipes their session.
      <br/>
      3. <strong>The Senior Solution:</strong> Keep web servers strictly <strong>stateless</strong>. Store session state in an external high-speed <strong>Redis cluster</strong> or use cryptographically signed stateless tokens (<strong>JWTs</strong>). <em>The only legitimate exception:</em> WebSockets, which are inherently persistent TCP connections pinned to a physical host.`
    },
    {
      q: "Why does a Layer 4 Load Balancer break gRPC microservices?",
      a: `<strong>Because gRPC multiplexes all requests over a single long-lived HTTP/2 TCP connection.</strong>
      <br/><br/>
      An L4 balancer operates at the TCP layer: it establishes a single TCP connection between Client A and Backend Server 1. Even if Client A fires 50,000 separate gRPC RPC calls per minute, the L4 balancer cannot see inside the HTTP/2 frames. It keeps routing 100% of those calls to Server 1, leaving Server 2 and Server 3 completely starved!
      <br/><br/>
      <strong>Solution:</strong> You must balance gRPC using a <strong>Layer 7 Load Balancer (Envoy / AWS ALB)</strong> that parses HTTP/2 binary streams and balances individual RPC requests, or implement <strong>client-side load balancing</strong> via a Service Mesh sidecar.`
    },
    {
      q: "How does a load balancer make an ongoing server outage worse (Cascading Failure)?",
      a: `<strong>Through automatic, uncoordinated retries.</strong>
      <br/><br/>
      When backend servers become overloaded and slow down, the load balancer assumes they are failing and begins retrying requests. If 1,000 requests are failing, aggressive 3x retries turn into 3,000 incoming requests, multiplying traffic precisely when backends are on the verge of collapse.
      <br/><br/>
      Furthermore, deep health checks timeout, causing the load balancer to mark servers unhealthy and pull them out of rotation. This concentrates 100% of incoming traffic onto fewer surviving servers, which immediately collapse in domino fashion.
      <br/><br/>
      <strong>Defenses:</strong> Enforce <strong>retry budgets</strong> (cap retries to ≤10% of total volume), implement <strong>circuit breakers</strong>, and configure <strong>minimum-healthy-hosts floors</strong> so the LB fails open rather than dropping the whole fleet.`
    },
    {
      q: "How do you gracefully drain a server during deployment with zero dropped requests?",
      a: `Follow the strict 4-step graceful drain sequence:
      <br/><br/>
      1. <strong>Deregister from Load Balancer:</strong> The deployment orchestrator calls the LB API to mark the target node as "draining". The LB immediately stops routing new incoming connections to this node.
      <br/>
      2. <strong>Connection Drain Timeout Window:</strong> Keep the node alive for a designated window (e.g., 30–60 seconds, which must exceed the LB health check interval plus maximum request timeout) so all in-flight requests finish processing cleanly.
      <br/>
      3. <strong>Signal Graceful HTTP Teardown:</strong> Add <code>Connection: close</code> headers to active HTTP/1.1 responses and send an HTTP/2 <code>GOAWAY</code> frame so clients naturally close their keep-alive sockets without reconnecting to this draining node.
      <br/>
      4. <strong>Send SIGTERM and Terminate:</strong> Once active connection count reaches 0 (or drain timeout expires), issue SIGTERM to shut down the process safely.`
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
          Traffic dispatchers sit between clients and backend fleets. In senior system design interviews, saying "I will just add a load balancer" is not enough. You must articulate whether it operates at Layer 4 or Layer 7, select the right dispatch algorithm, defend against health-check cascading collapse, and handle graceful zero-downtime rolling drains.
        </p>
      </div>

      <!-- Plain-English Mental Model Callout -->
      <div class="bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900 border border-cyan-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-cyan-400">psychology</span>
          <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider">
            Everyday Mental Model: Tollbooth vs. Airport Customs
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
          <div class="bg-[#0F1626]/80 border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1.5">
            <strong class="text-cyan-300 font-code text-[11.5px] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">traffic</span>
              Layer 4 = Highway Tollbooth (Fast &amp; Blind)
            </strong>
            <p class="text-slate-300 leading-relaxed">
              Looks only at the vehicle lane and license plate (IP address and Port number). It never opens the trunk or checks cargo. It routes packets instantly at wire speed with minimal CPU overhead, handling millions of connections per second.
            </p>
          </div>
          <div class="bg-[#0F1626]/80 border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1.5">
            <strong class="text-indigo-300 font-code text-[11.5px] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">luggage</span>
              Layer 7 = Airport Customs &amp; Security (Smart &amp; Thorough)
            </strong>
            <p class="text-slate-300 leading-relaxed">
              Opens the passenger's luggage, verifies their passport, and checks what items they are carrying (URL paths like <code>/checkout</code>, HTTP headers, cookies, auth tokens). Takes significantly more CPU, but can route traffic intelligently based on application content.
            </p>
          </div>
        </div>
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
      <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
              TYPICAL PRODUCTION LAYERED TOPOLOGY: MULTI-TIER LOAD BALANCING
            </span>
          </div>
          <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
            <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">5-Tier Topology</span>
            <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">DNS → L4 NLB → L7 ALB → Service Pools</span>
          </div>
        </div>

        <!-- The Architectural Diagram Image -->
        <div class="flex flex-col gap-3">
          <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
            <img 
              src="/images/production-layered-topology.jpg" 
              alt="Typical Production Layered Topology: From Users to Services (Multi-Tier Load Balancing)" 
              class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
              loading="eager"
              title="Click to view image full resolution"
              onclick="window.open('/images/production-layered-topology.jpg', '_blank')"
            />
          </div>
          <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
              Click diagram to view in high resolution in new tab
            </span>
            <span class="font-code text-[10.5px] text-slate-500">Users ➔ Geo/Latency DNS ➔ Layer 4 NLB ➔ Layer 7 ALB / Envoy ➔ Microservice Pools</span>
          </div>
        </div>

        <!-- 5-Tier Architecture Callout Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 text-[11.5px] font-sans">
          <!-- 1. Users -->
          <div class="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">1</span>
              <strong class="font-code text-[11.5px] font-bold text-blue-900 uppercase">Users</strong>
            </div>
            <p class="text-blue-950/80 text-[11.5px] leading-relaxed">
              Web, mobile, or external API clients initiate HTTPS requests to your public domain (e.g., <code>api.uber.com</code>).
            </p>
          </div>

          <!-- 2. DNS -->
          <div class="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">2</span>
              <strong class="font-code text-[11.5px] font-bold text-indigo-900 uppercase">DNS Routing</strong>
            </div>
            <p class="text-indigo-950/80 text-[11.5px] leading-relaxed">
              Route 53 / Cloudflare Anycast resolves to the nearest healthy geographic region using latency and health-check rules.
            </p>
          </div>

          <!-- 3. Layer 4 LB -->
          <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">3</span>
              <strong class="font-code text-[11.5px] font-bold text-rose-900 uppercase">Layer 4 LB</strong>
            </div>
            <p class="text-rose-950/80 text-[11.5px] leading-relaxed">
              AWS NLB / IPVS. Operates at TCP/UDP level. Handles millions of QPS statelessly, provides SYN flood protection &amp; health checks.
            </p>
          </div>

          <!-- 4. Layer 7 LB -->
          <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">4</span>
              <strong class="font-code text-[11.5px] font-bold text-amber-900 uppercase">Layer 7 / Gateway</strong>
            </div>
            <p class="text-amber-950/80 text-[11.5px] leading-relaxed">
              Envoy / AWS ALB / Kong. Operates at HTTP layer: TLS termination, path/host routing (<code>/orders</code> → svc-A), WAF, auth, &amp; canary splits.
            </p>
          </div>

          <!-- 5. Service Pools -->
          <div class="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">5</span>
              <strong class="font-code text-[11.5px] font-bold text-purple-900 uppercase">Service Pools</strong>
            </div>
            <p class="text-purple-950/80 text-[11.5px] leading-relaxed">
              Auto-scaled container fleets (Order Svc v1.0, User Svc v1.2, Canary 5% v2.0). Unhealthy nodes auto-removed by L7 health checks.
            </p>
          </div>
        </div>

        <!-- Key Points Callout (from diagram footer) -->
        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div class="flex items-center gap-2 shrink-0">
            <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[13px] font-bold">✓</span>
            <span class="font-sans font-bold text-[13px] text-emerald-900">Key Points</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[11.5px] text-emerald-950/90 leading-relaxed">
            <div>• DNS routes users to the nearest healthy region (geo/latency routing).</div>
            <div>• Traffic is distributed to service pools based on rules (path, headers, weights).</div>
            <div>• L4 LB provides high performance, extreme scalability, and SYN flood protection.</div>
            <div>• Each tier runs active health checks and automatically removes unhealthy nodes.</div>
            <div>• L7 LB handles HTTP, TLS termination, routing, rate limiting, and security.</div>
            <div>• Supports canary, blue-green, and weighted A/B deployments smoothly.</div>
          </div>
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
            1. Shallow vs. Deep Health Checks (Cascading Failure Trap)
          </span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            Shallow checks ask: <em>"is the HTTP server port responsive?"</em> Deep checks ask: <em>"can it connect to the primary database?"</em> While deep checks seem thorough, if your database has a temporary 2-second CPU spike, <strong>every backend node fails its deep check simultaneously</strong>. The load balancer terminates traffic to the entire cluster, transforming a minor database blip into a catastrophic 100% outage! Always configure a <strong>minimum-healthy-hosts floor</strong> (e.g. min 50% healthy) so the balancer "fails open" and keeps serving rather than dropping everything.
          </p>
        </div>

        <div class="bg-[#161C2E] border border-indigo-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-indigo-300 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">hub</span>
            2. Making the Load Balancer High-Availability (No SPOF)
          </span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            If the load balancer dies, does everything go down? In interviews, never leave the load balancer as an unaddressed Single Point of Failure (SPOF). Explain the two proven production solutions:
            <br/><br/>
            • <strong>Active-Passive Pair with Virtual IP (VIP):</strong> Two load balancers run VRRP / keepalived. If the active balancer stops heartbeating, the passive balancer claims the floating IP in under 1 second.
            <br/>
            • <strong>Active-Active with BGP Anycast:</strong> Multiple balancers announce the exact same public IP to Internet upstream routers via BGP. Routers spread traffic using ECMP (Equal-Cost Multi-Path). If one balancer crashes, routers automatically divert packets to surviving balancers.
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
              <div class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
                ${item.a}
              </div>
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
          "Layer 4 is for blazing wire-speed packet forwarding, protocol independence, and DDoS absorption; Layer 7 is for application routing, TLS termination, and request inspection. Real high-scale architectures place L4 in front of L7. In interviews, stand out by discussing health-check cascade protection, graceful draining during deploys, and why gRPC requires L7 balancing."
        </p>
      </div>

    </div>
  `;
}
