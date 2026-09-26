/**
 * 11.2 API Gateways, Reverse Proxies and Service Discovery - Visual Guide
 * High-signal, visually rich reproduction of Pages 141, 142, and 143
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderApiGatewayContent(topic) {
  const antiPatterns = [
    {
      pattern: "Business Logic in the Gateway",
      whyItFails: "Turns the gateway into a shared distributed monolith with its own release train and a single global deploy queue (sec. 13.4)."
    },
    {
      pattern: "Object-Level Authorisation in Gateway",
      whyItFails: "Object-level decisions require domain data the gateway does not possess. Authenticate at edge; authorise inside domain service."
    },
    {
      pattern: "One Gateway for Internal and External",
      whyItFails: "Different threat models, compliance scopes, change rates, and SLAs; an internal modification can take down public traffic."
    },
    {
      pattern: "Gateway as the Only Rate Limiter",
      whyItFails: "Internal callers and async retry storms bypass the gateway entirely; backend services still require local admission control (sec. 8.2)."
    },
    {
      pattern: "Chatty Aggregation in the Gateway",
      whyItFails: "Fanning out 20 backend calls per incoming request turns the gateway into a cascading latency and failure amplifier. Use a BFF instead."
    }
  ];

  const discoveryModels = [
    {
      model: "Client-Side Discovery",
      works: "Client queries registry (Eureka/Consul), then dispatches directly to chosen instance",
      tradeoff: "Eliminates an extra network hop; requires smart discovery logic in every client language"
    },
    {
      model: "Server-Side Discovery",
      works: "Client connects to stable load balancer; load balancer queries registry and proxies traffic",
      tradeoff: "Language agnostic and simple; adds a network hop and a stateful component to scale"
    },
    {
      model: "DNS-Based Discovery",
      works: "Service name resolves to instance IP addresses via internal CoreDNS",
      tradeoff: "Universal compatibility; slow failover propagation due to resolver TTL caching (sec. 2.3)"
    },
    {
      model: "Orchestrator-Native",
      works: "Kubernetes Endpoints/EndpointSlices maintained automatically by kube-controller-manager",
      tradeoff: "Automatic liveness lifecycle; couples service availability to control plane health"
    },
    {
      model: "Sidecar / Service Mesh",
      works: "Local Envoy sidecar maintains in-memory endpoint cache pushed by control plane (sec. 11.3)",
      tradeoff: "Sub-millisecond routing decisions and rich policy; requires operating a service mesh"
    }
  ];

  const followUps = [
    {
      q: "Where does authentication happen, and why not in each individual service?",
      a: "<strong>Validate credentials once at the API Gateway</strong>, then propagate verified identity inward using a short-lived cryptographically signed internal token (or trusted mutual-TLS header). Validating in every service leads to <em>N</em> separate token validation implementations, <em>N</em> libraries to patch during zero-day CVEs, and inconsistent expiration behaviors. <strong>Crucial distinction:</strong> Keep <em>authorisation</em> ('may user X edit document Y?') inside the service that owns the data model."
    },
    {
      q: "The API Gateway is a single point of failure (SPOF). How do you architect around it?",
      a: "Deploy <strong>stateless gateway instances</strong> behind an active-active Layer 4 Anycast load balancer across multiple Availability Zones. Protect against dependency collapse: cache JWT public signing keys (JWKS) and rate-limit counters locally so an identity provider or Redis outage degrades gracefully rather than causing total failure. Maintain strictly separated internal vs. external gateway fleets, and canary all routing configuration changes."
    },
    {
      q: "API Gateway versus Service Mesh — do you need both?",
      a: "<strong>They solve orthogonal axes.</strong> The API Gateway governs <strong>North-South</strong> traffic: untrusted external internet clients entering your perimeter, where authentication, public contracts, and quota enforcement live. The Service Mesh governs <strong>East-West</strong> traffic: trusted service-to-service internal RPCs, where mutual TLS (mTLS), retry budgets, and per-hop telemetry live. Small organizations should start with a gateway; a mesh only earns its complexity when managing polyglot microservices across teams."
    },
    {
      q: "What is the propagation gap in service discovery that nobody plans for?",
      a: "Service discovery is <strong>eventually consistent</strong>. Between an instance crashing and every caller learning about its death, there is a window (health-check interval + gossip propagation + client cache TTL) where requests are routed to a dead node. You cannot eliminate this gap; you must design for it: <strong>retry idempotent requests on a different host</strong> (sec. 8.2), enforce graceful <strong>node draining</strong> before termination (sec. 2.8), and keep client DNS/cache TTLs bounded to seconds."
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
          The front door of distributed systems. Reverse proxies forward and cache HTTP; load balancers distribute connections; API gateways apply policy to API-shaped traffic; service discovery enables dynamic target resolution.
        </p>
      </div>

      <!-- The 3 Roles Clarified -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
          <span class="font-code text-[12px] font-bold text-slate-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-cyan-400">call_split</span>
            Load Balancer
          </span>
          <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
            Chooses <em>which instance</em> receives the request. Cares strictly about connection distribution, socket saturation, and node health — not application semantics (sec. 2.8).
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
          <span class="font-code text-[12px] font-bold text-slate-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-indigo-400">alt_route</span>
            Reverse Proxy
          </span>
          <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
            A single front for multiple backends: terminates TLS, caches static responses, compresses payloads, and rewrites headers. Cares about HTTP, not business APIs.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
          <span class="font-code text-[12px] font-bold text-slate-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-emerald-400">door_open</span>
            API Gateway
          </span>
          <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
            A reverse proxy that <em>understands your API</em>: identifies caller identity, verifies JWTs, enforces tenant quotas, manages versioning, and injects tracing context.
          </p>
        </div>
      </div>

      <!-- Ingress Architecture Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            WHERE EACH CONCERN BELONGS IN THE INGRESS PIPELINE
          </span>
          <span class="text-[11px] font-code text-slate-500">Tier Separation</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
Client
  │
  ▼
CDN / Edge         ── Static caching, TLS near user, volumetric DDoS absorption (sec. 2.5)
  │
  ▼
Layer 4 LB         ── Spreads connections across gateway instances (NLB / IPVS, sec. 2.8)
  │
  ▼
API GATEWAY        ── TLS termination, AuthN token validation (sec. 3.1)
  │                   Rate limits &amp; per-tenant quotas (sec. 3.4)
  │                   Routing by path / host / version, canary traffic splitting (sec. 8.1)
  │                   Request shaping, request IDs &amp; W3C trace context injection (sec. 12.1)
  ▼
Service Mesh       ── mTLS encryption, retry budgets, circuit breakers, telemetry (sec. 11.3)
  │
  ▼
Service            ── Business logic, AUTHORISATION decisions, input validation
  │
  ▼
Datastore

  RULE OF THUMB:
  • The gateway answers: "Who are you and may you make this call at this rate?"
  • The service answers: "May you do this to THIS object?" — Never move that to the gateway!
        </div>
      </div>

      <!-- Service Discovery Models Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          SERVICE DISCOVERY PATTERNS: HOW CALLERS FIND INSTANCES
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
          A single general-purpose API gateway cannot serve a mobile app, desktop web client, and third-party partner API optimally — their payload size limits, chattiness budgets, and auth models conflict. The <strong>BFF pattern</strong> deploys a dedicated, thin aggregation tier owned by the team that owns that client experience. Mobile gets a coarse, bundled response minimizing battery and radio wakeups; web gets richer fine-grained views; partners get a stable versioned contract.
        </p>
      </div>

      <!-- Anti-Patterns Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-rose-400 uppercase tracking-wider">
          COMMON GATEWAY ANTI-PATTERNS
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
          "Name the three roles precisely and put each concern at exactly one layer: edge for caching and volumetric defence, gateway for authentication, quotas, routing and versioning, service for authorisation and business rules. Then acknowledge discovery is eventually consistent, so retries and draining are mandatory, not optional."
        </p>
      </div>

    </div>
  `;
}
