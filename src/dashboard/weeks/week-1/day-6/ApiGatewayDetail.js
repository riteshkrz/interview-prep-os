/**
 * 11.2 API Gateways, Reverse Proxies and Service Discovery - Visual Guide
 * High-signal, visually rich reproduction of Pages 141, 142, and 143
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderApiGatewayContent(topic) {
  const antiPatterns = [
    {
      pattern: "Business Logic in the Gateway",
      whyItFails: "Turns the gateway into a bloated distributed monolith. Every small business feature requires deploying the gateway, creating a single global release bottleneck across all engineering teams."
    },
    {
      pattern: "Object-Level Authorisation in the Gateway",
      whyItFails: "Deciding if User 42 owns Document 999 requires querying domain database tables the gateway should never touch. Authenticate at the gateway (valid token?); authorise inside the domain microservice."
    },
    {
      pattern: "One Gateway for Internal and External Traffic",
      whyItFails: "Violates security zoning and blast radius containment. Internal services have different compliance scopes, zero-trust requirements, and traffic spikes; an internal bug could take down public revenue-generating traffic."
    },
    {
      pattern: "Gateway as the Only Rate Limiter",
      whyItFails: "Internal services, asynchronous event workers, and retry storms bypass the gateway entirely. If microservices lack their own local rate limiting (token buckets), an internal loop can easily crash downstream databases."
    },
    {
      pattern: "Chatty Aggregation in the Gateway",
      whyItFails: "Having the gateway fan out 20 parallel backend calls per incoming request turns it into a cascading latency amplifier. If one microservice slows down, gateway worker threads hang. Use a dedicated BFF instead."
    }
  ];

  const discoveryModels = [
    {
      model: "Client-Side Discovery",
      works: "Client queries the service registry (Eureka / Consul) directly to fetch available node IPs, then picks an instance and calls it directly.",
      tradeoff: "Eliminates an extra network hop and load balancer cost; but requires embedding smart discovery and load-balancing libraries into every client programming language."
    },
    {
      model: "Server-Side Discovery",
      works: "Client connects to a stable intermediary load balancer (e.g., AWS ALB). The balancer queries the registry and proxies the request to a healthy backend.",
      tradeoff: "Language agnostic and very simple for developers; but introduces an extra network hop and adds a central infrastructure tier to operate and scale."
    },
    {
      model: "DNS-Based Discovery",
      works: "Internal service names (e.g., <code>orders.internal</code>) resolve directly to backend IP addresses via Kubernetes CoreDNS / Route 53 private zones.",
      tradeoff: "Universal compatibility with zero SDK dependencies; but failover is sluggish due to DNS client caching and TTL propagation delays."
    },
    {
      model: "Orchestrator-Native (K8s)",
      works: "Kubernetes EndpointSlices and <code>kube-proxy</code> dynamically track pod IP additions and deletions via iptables / IPVS kernel rules.",
      tradeoff: "Fully automated lifecycle for container fleets; tightly couples service availability to the health and responsiveness of the Kubernetes control plane."
    },
    {
      model: "Sidecar / Service Mesh (Envoy)",
      works: "Each pod runs a local Envoy proxy. A centralized control plane (Istio) pushes real-time endpoint topology into the sidecar's memory via xDS APIs.",
      tradeoff: "Sub-millisecond routing, mutual TLS encryption, automatic retries, and rich telemetry; adds operational complexity and minor memory overhead per pod."
    }
  ];

  const followUps = [
    {
      q: "Where does authentication happen, and why not inside each individual microservice?",
      a: `<strong>Authenticate credentials once at the API Gateway</strong>, then propagate the verified identity inward using a short-lived cryptographically signed internal token or trusted mTLS headers.
      <br/><br/>
      Why not inside each microservice?
      <br/>
      1. <strong>Maintenance Nightmare:</strong> If 50 microservices each parse JWTs, you have 50 separate authentication library implementations to patch whenever a zero-day cryptographic CVE occurs.
      <br/>
      2. <strong>Wasted CPU &amp; Database Calls:</strong> Microservices would repeatedly validate tokens and make duplicate queries to Auth0 / identity databases for the exact same client request.
      <br/>
      3. <strong>Crucial Senior Distinction:</strong> Always separate <em>Authentication</em> ("Who are you?") from <em>Authorisation</em> ("May User A edit Document B?"). Authentication lives at the API Gateway; fine-grained Authorisation must live inside the domain service that owns the data.`
    },
    {
      q: "The API Gateway is a Single Point of Failure (SPOF). How do you make it resilient?",
      a: `To eliminate the Gateway as a SPOF:
      <br/><br/>
      1. <strong>Stateless Multi-AZ Fleet:</strong> Deploy gateway instances as completely stateless containers spread across at least 3 Availability Zones behind an active-active Layer 4 Anycast load balancer (e.g. AWS NLB).
      <br/>
      2. <strong>In-Memory Key &amp; Quota Caching:</strong> Cache JWT public signing keys (JWKS) and rate-limiting quotas in local memory (with a fast Redis cluster as backup). If the central Auth service or Redis blips for 5 seconds, the gateway keeps validating tokens locally without dropping incoming traffic.
      <br/>
      3. <strong>Canary Route Deployments:</strong> Never deploy routing table updates to 100% of gateway nodes at once. Roll out route configuration changes in canary stages (5% → 25% → 100%) with automated health-check rollback.`
    },
    {
      q: "API Gateway versus Service Mesh — do you need both?",
      a: `<strong>They govern two completely orthogonal traffic axes:</strong>
      <br/><br/>
      • <strong>API Gateway = North-South Traffic:</strong> Manages untrusted external traffic entering your company's network perimeter from the internet. Enforces public API rate limits, API keys, JWT verification, public documentation, and path routing.
      <br/>
      • <strong>Service Mesh = East-West Traffic:</strong> Manages trusted service-to-service internal RPC communication inside your private VPC. Enforces mutual TLS (mTLS) encryption between pods, inter-service circuit breakers, retry budgets, and distributed tracing.
      <br/><br/>
      <em>Senior Interview Advice:</em> Early-stage or small startups should start with an API Gateway alone. A Service Mesh only justifies its operational overhead when an organization operates dozens of polyglot microservices managed by independent engineering teams.`
    },
    {
      q: "What is the 'Propagation Gap' in service discovery that causes unexpected 500 errors?",
      a: `Service discovery is inherently <strong>eventually consistent</strong>. 
      <br/><br/>
      When an application server crashes, there is an unavoidable delay before every caller discovers that the node is dead:
      <code>Crash → Health check timeout (e.g. 5s) → Registry update (e.g. 2s) → Cache TTL expiration in callers (e.g. 5s) = 12-second window</code>.
      <br/><br/>
      During this 12-second propagation gap, callers will continue sending requests to the dead IP address! You cannot reduce this window to zero across a distributed network. Instead, you must design for it:
      <br/>
      1. <strong>Automatic Retries on Alternate Hosts:</strong> Callers must immediately retry failed idempotent GET requests against a different backend instance.
      <br/>
      2. <strong>Graceful Node Draining:</strong> Before a server terminates during a routine deployment, it must enter a draining state <em>before</em> killing the process, allowing discovery caches to expire while active requests finish.`
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="11.2-gateway">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 11 · Networking at Scale
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 141–143 · Section 11.2</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          11.2 API Gateways, Reverse Proxies and Service Discovery
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          The front door of distributed systems. In modern architectures, clients never speak directly to individual microservices. An ingress pipeline coordinates security, rate limiting, and dynamic service routing. Here is how to cleanly separate responsibilities and avoid building a bottlenecked distributed monolith.
        </p>
      </div>

      <!-- Plain-English Hotel Mental Model -->
      <div class="bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-900 border border-indigo-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-indigo-400">psychology</span>
          <span class="font-code text-[12px] font-bold text-indigo-300 uppercase tracking-wider">
            Everyday Mental Model: The Luxury Hotel Analogy
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
          <div class="bg-[#0F1626]/80 border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <strong class="text-cyan-300 font-code text-[11.5px] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">call_split</span>
              Load Balancer = Parking Attendant
            </strong>
            <p class="text-slate-300 leading-relaxed">
              Directs arriving cars into available garage parking spots based on open spaces. Cares strictly about space availability (connection load), not who is inside the car or what they plan to do.
            </p>
          </div>
          <div class="bg-[#0F1626]/80 border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
            <strong class="text-indigo-300 font-code text-[11.5px] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">alt_route</span>
              Reverse Proxy = Front Desk Receptionist
            </strong>
            <p class="text-slate-300 leading-relaxed">
              The public face of the building. Greets guests, hands out brochures (caches static assets), verifies hotel check-in hours, and terminates TLS. Knows about HTTP, not internal business logic.
            </p>
          </div>
          <div class="bg-[#0F1626]/80 border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
            <strong class="text-emerald-300 font-code text-[11.5px] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">security</span>
              API Gateway = Security Guard + VIP Concierge
            </strong>
            <p class="text-slate-300 leading-relaxed">
              Inspects your photo ID (Authentication), verifies your VIP badge tier (Plan Quotas &amp; Rate Limits), tracks how many complimentary drinks you ordered this hour, and escorts you to the penthouse elevator.
            </p>
          </div>
        </div>
      </div>

      <!-- Ingress Architecture Diagram -->
      <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
              INGRESS PIPELINE: END-TO-END FLOW (WHERE EACH CONCERN BELONGS)
            </span>
          </div>
          <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
            <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">6-Stage Ingress Chain</span>
            <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">Client → Edge → Gateway → Mesh → Datastore</span>
          </div>
        </div>

        <!-- The Architectural Diagram Image -->
        <div class="flex flex-col gap-3">
          <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
            <img 
              src="/images/ingress-pipeline-end-to-end.jpg" 
              alt="Ingress Pipeline: End-to-End Flow - From Client to Datastore (Where Each Concern Belongs)" 
              class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
              loading="eager"
              title="Click to view image full resolution"
              onclick="window.open('/images/ingress-pipeline-end-to-end.jpg', '_blank')"
            />
          </div>
          <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
              Click diagram to view in high resolution in new tab
            </span>
            <span class="font-code text-[10.5px] text-slate-500">Client ➔ CDN/Edge ➔ Layer 4 LB ➔ API Gateway ➔ Service Mesh ➔ Microservice ➔ Datastore</span>
          </div>
        </div>

        <!-- 6-Stage Concern Callout Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 text-[11.5px] font-sans">
          <!-- 1. CDN / Edge -->
          <div class="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">1</span>
              <strong class="font-code text-[11.5px] font-bold text-emerald-900 uppercase">CDN / Edge (Cloudflare / Akamai)</strong>
            </div>
            <p class="text-emerald-950/80 text-[11.5px] leading-relaxed">
              Static asset caching (images, JS, CSS), TLS termination close to users, volumetric DDoS absorption, basic WAF bot mitigation, &amp; routing to origin.
            </p>
          </div>

          <!-- 2. Layer 4 Load Balancer -->
          <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">2</span>
              <strong class="font-code text-[11.5px] font-bold text-rose-900 uppercase">Layer 4 Load Balancer (NLB / IPVS)</strong>
            </div>
            <p class="text-rose-950/80 text-[11.5px] leading-relaxed">
              Operates at TCP/UDP layer. Spreads incoming connections across gateway instances, handles millions of QPS, SYN flood protection &amp; health checks.
            </p>
          </div>

          <!-- 3. API Gateway -->
          <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">3</span>
              <strong class="font-code text-[11.5px] font-bold text-amber-900 uppercase">API Gateway (Envoy / ALB / Kong)</strong>
            </div>
            <p class="text-amber-950/80 text-[11.5px] leading-relaxed">
              TLS termination, AuthN token validation, rate limits &amp; per-tenant quotas, path/host routing, canary traffic splitting, request IDs &amp; W3C trace context.
            </p>
          </div>

          <!-- 4. Service Mesh -->
          <div class="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">4</span>
              <strong class="font-code text-[11.5px] font-bold text-purple-900 uppercase">Service Mesh (Istio / Linkerd)</strong>
            </div>
            <p class="text-purple-950/80 text-[11.5px] leading-relaxed">
              mTLS encryption between services, service-to-service load balancing, retry budgets, circuit breakers, timeouts, fault isolation &amp; distributed telemetry.
            </p>
          </div>

          <!-- 5. Service (Microservice) -->
          <div class="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">5</span>
              <strong class="font-code text-[11.5px] font-bold text-blue-900 uppercase">Service (Microservice)</strong>
            </div>
            <p class="text-blue-950/80 text-[11.5px] leading-relaxed">
              Business logic &amp; workflows, <strong>AUTHORISATION</strong> (object/tenant level), input validation &amp; sanitization, downstream datastore calls, &amp; domain metrics.
            </p>
          </div>

          <!-- 6. Datastore -->
          <div class="p-3.5 rounded-xl bg-fuchsia-50/70 border border-fuchsia-200 text-fuchsia-950 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-fuchsia-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">6</span>
              <strong class="font-code text-[11.5px] font-bold text-fuchsia-900 uppercase">Datastore (DB / Cache / Queue)</strong>
            </div>
            <p class="text-fuchsia-950/80 text-[11.5px] leading-relaxed">
              Persistent storage (Postgres, Cassandra, Redis). Enforces data-level access control, backups, replication, sharding, and caching layers.
            </p>
          </div>
        </div>

        <!-- Rule of Thumb Callout Banner (from diagram footer) -->
        <div class="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200 text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
          <div class="flex items-center gap-2.5 shrink-0">
            <span class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <span class="material-symbols-outlined text-[18px]">lightbulb</span>
            </span>
            <span class="font-sans font-bold text-[13px] text-indigo-950 uppercase tracking-wide">Golden Rule of Thumb</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 text-[12px] flex-1">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-medium">
              <span class="text-emerald-700 font-bold">✓</span>
              <span><strong>The Gateway answers:</strong> "Who are you and may you make this call at this rate?"</span>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100/80 border border-purple-300 text-purple-950 font-medium">
              <span class="text-purple-700 font-bold">✓</span>
              <span><strong>The Service answers:</strong> "May you modify THIS specific object?" — Never move that to the gateway!</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Discovery Models Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          SERVICE DISCOVERY PATTERNS: HOW CALLERS FIND INSTANCES DYNAMICALLY
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/4">Discovery Model</th>
                <th class="p-3 w-2/5">How It Works</th>
                <th class="p-3 w-1/3">Key Architectural Trade-Off</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${discoveryModels.map(m => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${m.model}</td>
                  <td class="p-3 text-slate-300">${m.works}</td>
                  <td class="p-3 text-slate-400">${m.tradeoff}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Backend for Frontend (BFF) Pattern -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2 font-sans">
        <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">devices</span>
          The Backend for Frontend (BFF) Pattern
        </span>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          A single general-purpose API gateway cannot serve a mobile app, desktop web client, and third-party partner API optimally — their payload size limits, network reliability, battery budgets, and auth models conflict. 
          <br/><br/>
          The <strong>BFF pattern</strong> deploys dedicated, lightweight aggregation layers for each client platform:
          <br/>
          • <strong>Mobile BFF:</strong> Aggregates 10 microservice calls into 1 compact JSON payload, stripping unnecessary fields to save cellular bandwidth and prevent radio battery drain.
          <br/>
          • <strong>Web Desktop BFF:</strong> Provides rich, detailed views designed for multi-column dashboards.
          <br/>
          • <strong>Public Partner BFF:</strong> Enforces strict backward-compatible OpenAPI versioning, API key quotas, and partner-specific SLAs.
        </p>
      </div>

      <!-- Anti-Patterns Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-rose-400 uppercase tracking-wider">
          COMMON GATEWAY ANTI-PATTERNS (INTERVIEW RED FLAGS)
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${antiPatterns.map(ap => `
            <div class="bg-[#0F1626] border border-rose-500/20 rounded-xl p-3.5 flex flex-col gap-1">
              <span class="font-code text-[11.5px] font-bold text-rose-300">${ap.pattern}</span>
              <p class="text-[12px] text-slate-300 font-sans leading-relaxed">${ap.whyItFails}</p>
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
          "Define the ingress chain crisply: CDN at the edge for static caching and DDoS protection; L4 balancer for wire-speed connection dispatch; API Gateway for perimeter authentication, quota enforcement, and routing; and domain microservices for object-level authorization and business logic. Never put business logic or data authorization in the gateway."
        </p>
      </div>

    </div>
  `;
}
