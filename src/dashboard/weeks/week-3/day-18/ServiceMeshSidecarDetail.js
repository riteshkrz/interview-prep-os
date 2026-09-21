/**
 * 11.3 Service Mesh and the Sidecar Model - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 111, 112, and 113
 * from The Modern System Design Interview Guide.
 */

export function renderServiceMeshSidecarContent(topic) {
  const meshApproaches = [
    {
      approach: "1. In-Application SDKs (Hystrix, Finagle)",
      implementation: "Language-specific libraries linked directly into application binaries",
      pros: "Zero proxy network hops; lowest possible latency (in-memory execution)",
      cons: "Polyglot tax: duplicate logic across Java, Go, Python, Node; upgrades require redeploying all services",
      verdict: "Viable only in strict mono-language organizations (e.g. 100% Java shops)",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      approach: "2. Sidecar Proxy Mesh (Istio / Envoy / Linkerd)",
      implementation: "Dedicated C++ proxy (Envoy) container per Pod sharing localhost network namespace",
      pros: "100% language-agnostic; transparent mTLS; dynamic xDS routing without restarting pods",
      cons: "Resource tax: 50–150 MB RAM per pod; +1 to 2 ms latency per RPC hop (2 proxies per call)",
      verdict: "The enterprise industry standard for polyglot microservice fleets (20+ services)",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      approach: "3. Sidecarless eBPF Mesh (Cilium / Ambient)",
      implementation: "Kernel-level eBPF programs on host + per-node Layer 4 tunnel (ztunnel) + shared L7 waypoints",
      pros: "Eliminates sidecars entirely; drastically reduces memory overhead; near-zero latency for L4 mTLS",
      cons: "Bleeding-edge Linux kernel requirements (5.4+); more complex kernel-level debugging",
      verdict: "The emerging next-generation architecture for massive hyperscale clusters",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    }
  ];

  const trafficTaxonomy = [
    {
      dimension: "Primary Scope",
      northSouth: "External Clients ──► Edge Cluster Ingress",
      eastWest: "Internal Service ◄──► Internal Service"
    },
    {
      dimension: "Core Gateway / Component",
      northSouth: "API Gateway (Kong, AWS API Gateway, Envoy Ingress)",
      eastWest: "Service Mesh Sidecars (Envoy / Istio / Linkerd)"
    },
    {
      dimension: "Authentication Model",
      northSouth: "User-level tokens: OAuth2, OpenID Connect, JWT, API Keys",
      eastWest: "Machine-level identity: SPIFFE IDs & Mutual TLS (mTLS)"
    },
    {
      dimension: "Traffic Control & Routing",
      northSouth: "Domain host routing, path prefix rewrites, public SSL offload",
      eastWest: "Canary traffic splitting (90/10), circuit breaking, fault injection"
    },
    {
      dimension: "Rate Limiting & Defense",
      northSouth: "Global client IP rate limits, WAF, bot detection, DDoS filtering",
      eastWest: "Per-service concurrency limits, bulkhead thread pools, outlier ejection"
    }
  ];

  const xdsApis = [
    {
      api: "LDS (Listener Discovery Service)",
      role: "Informs Envoy which ports (e.g. 15001/15006) and network filters to open for inbound and outbound traffic interception."
    },
    {
      api: "RDS (Route Discovery Service)",
      role: "Dynamically pushes HTTP virtual host tables, prefix path rewrites, header matches, and traffic splitting percentages (e.g. 90% v1 / 10% canary v2)."
    },
    {
      api: "CDS (Cluster Discovery Service)",
      role: "Defines upstream service clusters, circuit breaker thresholds, outlier detection parameters, and TLS certificates required to connect."
    },
    {
      api: "EDS (Endpoint Discovery Service)",
      role: "Provides real-time IP and port lists of individual healthy pods backing each cluster, updated instantaneously as pods scale up or down."
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How does an Envoy sidecar intercept incoming and outgoing traffic without modifying application code?",
      answer: "In a Kubernetes pod, all containers share the exact same Linux Network Namespace (<code>netns</code>) and network loopback interface. During pod initialization, an <code>initContainer</code> (such as <code>istio-init</code>) runs with <code>NET_ADMIN</code> Linux capabilities and executes <code>iptables</code> (or <code>nftables</code>) rules. These rules configure <code>PREROUTING</code> and <code>OUTPUT</code> chains to inspect all inbound and outbound TCP packets on port 80/443 and transparently redirect them using <code>REDIRECT</code> or <code>TPROXY</code> to Envoy's local listening port (e.g. port 15001/15006). The application thinks it is connecting directly to an external IP, while Envoy intercepts the socket."
    },
    {
      qNum: "Q2",
      question: "A single RPC between Service A and Service B experiences double latency overhead in a mesh. Why?",
      answer: "Every internal service-to-service call in a standard sidecar service mesh passes through <strong>two separate proxies</strong>: (1) Service A calls <code>http://service-b</code>. Outbound iptables redirects the packet to <strong>Envoy Proxy A</strong> (Hop 1). (2) Envoy Proxy A encrypts the payload via mTLS, evaluates routing rules, and transmits the packet over the node network to Service B's host. (3) On arrival, inbound iptables on Pod B redirects the encrypted packet to <strong>Envoy Proxy B</strong> (Hop 2). (4) Envoy Proxy B decrypts mTLS, validates the SPIFFE identity certificate, checks authorization policies, and forwards the plaintext packet over <code>localhost</code> to Service B's application container. Each proxy traversal incurs user-space context switching, socket buffer copying, and TLS crypto processing, adding ~0.5ms to 1.5ms per proxy (total 1-3ms per RPC)."
    },
    {
      qNum: "Q3",
      question: "When should an architecture use both an API Gateway and a Service Mesh, and what are their respective boundaries?",
      answer: "Use both in enterprise production: they solve fundamentally different problems across distinct trust boundaries. The <strong>API Gateway</strong> sits at the public edge (North-South) to protect the internal network: it terminates public SSL, maps public REST/GraphQL endpoints to internal gRPC contracts, validates user JWT sessions, enforces corporate API rate limits, and defends against DDoS. The <strong>Service Mesh</strong> operates strictly behind the DMZ (East-West): it assumes all traffic is already authenticated to enter the cluster, and its sole mission is providing uniform zero-trust encryption (mTLS with SPIFFE identities between pods), transparent retry budgets, distributed tracing context propagation (W3C TraceContext headers), and canary deployment traffic shifting across polyglot microservices."
    },
    {
      qNum: "Q4",
      question: "What is the 'Mesh Tax' and how does Istio Ambient Mesh / Cilium eBPF eliminate it?",
      answer: "The 'Mesh Tax' refers to the cumulative CPU and RAM consumed by running an Envoy sidecar in every single pod (e.g. 50-100MB RAM × 5,000 pods = 250-500 GB RAM overhead), plus the operational headache of pod restarts whenever sidecar configurations or versions update. <strong>Istio Ambient Mesh</strong> eliminates sidecars by splitting the mesh into two layers: (1) <strong>ztunnel (Zero-trust tunnel)</strong>: A shared, lightweight per-node Layer 4 daemon that handles mTLS encryption and mutual authentication with virtually zero CPU overhead and no pod injection. (2) <strong>Waypoint Proxies</strong>: Optional, dynamically provisioned Layer 7 Envoy proxies that run per namespace or per service <em>only</em> when complex features (like HTTP header routing or JWT validation) are explicitly required. Cilium achieves a similar revolution at the Linux kernel level using eBPF socket maps."
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 111: PART 11 BANNER & SERVICE MESH FOUNDATIONS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- PART 11 Header Banner -->
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] p-6 text-white shadow-xl shadow-indigo-950/50 flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-extrabold uppercase tracking-widest text-indigo-200">
              PART 11 · NETWORKING & TRAFFIC INFRASTRUCTURE
            </span>
          </div>
          <h1 class="font-sans text-[24px] sm:text-[28px] font-black tracking-tight text-white leading-tight">
            Service Mesh and the Sidecar Model
          </h1>
          <p class="text-[13.5px] text-indigo-100/90 font-sans max-w-3xl leading-relaxed">
            Data Plane vs. Control Plane, Envoy Architecture, Transparent mTLS, and North-South vs. East-West Traffic
          </p>
        </div>

        <!-- Section Title: 11.3 Service Mesh and the Sidecar Model -->
        <div class="flex flex-col gap-2 pt-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-snug">
              11.3 Service Mesh and the Sidecar Model
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            How Dedicated Infrastructure Proxies Free Application Code from Transport Complexity
          </p>
        </div>

        <!-- WHAT IT IS & WHY Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-cyan-400">
              <span class="material-symbols-outlined text-[20px]">help_outline</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHAT IT IS</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              A dedicated, programmable infrastructure layer consisting of lightweight network proxies (such as Envoy) deployed as <strong>sidecars</strong> directly alongside microservice containers to manage service-to-service communication.
            </p>
          </div>

          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-indigo-400">
              <span class="material-symbols-outlined text-[20px]">lightbulb</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHY IT MATTERS</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              In microservice architectures, developers repeatedly reimplement retries, circuit breaking, timeouts, mutual TLS encryption, and telemetry. Embedding these in application code creates a maintenance nightmare across polyglot languages. A service mesh abstracts transport mechanics into uniform infrastructure.
            </p>
          </div>
        </div>

        <!-- ARCHITECTURAL DIAGRAM: DATA PLANE VS CONTROL PLANE -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-6 flex flex-col gap-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              THE SERVICE MESH ARCHITECTURE: DATA PLANE VS. CONTROL PLANE
            </span>
            <span class="text-[10.5px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              Envoy + Istio Control Plane
            </span>
          </div>

          <div class="font-code text-[12px] sm:text-[13px] leading-relaxed text-slate-300 bg-[#070B14] p-5 rounded-lg border border-[#1E293B] overflow-x-auto">
                              ┌──────────────────────────────────────────────┐
                              │          <span class="text-purple-400 font-bold">CONTROL PLANE (e.g. Istio)</span>          │
                              │  • Pilot (xDS Routing, LDS/RDS/CDS/EDS)      │
                              │  • Citadel (SPIFFE mTLS X.509 Cert Issuer)   │
                              └──────────────────────┬───────────────────────┘
                                                     │ Dynamic xDS Push &amp; Cert Rotation
                      ┌──────────────────────────────┴──────────────────────────────┐
                      ▼                                                             ▼
       ┌───────────────────────────────┐                             ┌───────────────────────────────┐
       │   <span class="text-cyan-300 font-bold">POD A (Billing Service)</span>     │                             │   <span class="text-emerald-300 font-bold">POD B (Payment Gateway)</span>     │
       │                               │                             │                               │
       │  ┌─────────────────────────┐  │                             │  ┌─────────────────────────┐  │
       │  │   App Code Container    │  │                             │  │   App Code Container    │  │
       │  │   (e.g. Node.js / Go)   │  │                             │  │   (e.g. Java / Python)  │  │
       │  └───────────┬─────────────┘  │                             │  └─────────────▲───────────┘  │
       │              │ localhost:8080 │                             │                │ localhost    │
       │              ▼                │                             │                │              │
       │  ┌─────────────────────────┐  │     <span class="text-emerald-400 font-bold">Encrypted mTLS Link</span>     │  ┌─────────────┴───────────┐  │
       │  │   <span class="text-amber-300 font-bold">Envoy Sidecar Proxy</span>   │──┼─────────────────────────────┼─►│   <span class="text-amber-300 font-bold">Envoy Sidecar Proxy</span>   │  │
       │  │   (Data Plane Intercept)│  │    (SPIFFE Identity Verified) │  │   (Data Plane Terminate)│  │
       │  └─────────────────────────┘  │                             │  └─────────────────────────┘  │
       └───────────────────────────────┘                             └───────────────────────────────┘
               Shared Linux Network Namespace (netns)                        Shared Linux Network Namespace (netns)
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 text-[12.5px] font-sans">
            <div class="bg-[#141C2E] border border-[#24314A] rounded-lg p-3.5 flex flex-col gap-1">
              <span class="font-bold text-amber-300 font-code text-[11px] uppercase tracking-wider">
                1. Data Plane (Envoy C++ Proxy)
              </span>
              <p class="text-slate-300 leading-normal">
                Sits directly on the network fast-path in every single pod. Intercepts all ingress and egress TCP sockets via <code>iptables</code>. Enforces mTLS encryption, extracts distributed tracing headers, runs circuit breaking, and collects Prometheus metrics.
              </p>
            </div>

            <div class="bg-[#141C2E] border border-[#24314A] rounded-lg p-3.5 flex flex-col gap-1">
              <span class="font-bold text-purple-300 font-code text-[11px] uppercase tracking-wider">
                2. Control Plane (Istio / Pilot)
              </span>
              <p class="text-slate-300 leading-normal">
                Completely off the packet fast-path. Converts high-level YAML policies into low-level Envoy configuration directives and streams them dynamically via gRPC (xDS protocols: LDS, RDS, CDS, EDS) while rotating cryptographic certificates every few hours.
              </p>
            </div>
          </div>
        </div>

        <!-- DYNAMIC CONFIGURATION: THE ENVOY xDS PROTOCOL -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            THE FOUR PILLARS OF THE ENVOY xDS DYNAMIC CONFIGURATION APIS
          </span>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px] font-sans">
            ${xdsApis.map(item => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
                <span class="font-code text-[12px] font-bold text-cyan-300">${item.api}</span>
                <p class="text-slate-300 leading-relaxed font-sans">${item.role}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Official Page 111 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 111</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 112: NORTH-SOUTH VS. EAST-WEST TRAFFIC TAXONOMY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Section Subtitle -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              TRAFFIC SEGREGATION IN MODERN INFRASTRUCTURE
            </span>
          </div>
          <h3 class="font-sans text-[20px] sm:text-[23px] font-bold text-white tracking-tight">
            North-South (API Gateway) vs. East-West (Service Mesh)
          </h3>
          <p class="text-[13.5px] text-slate-400 font-sans">
            Why external public edge routing and internal pod-to-pod routing require separate architectures
          </p>
        </div>

        <!-- Taxonomy Comparison Table -->
        <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
          <table class="w-full text-left text-[12.5px] font-sans border-collapse">
            <thead>
              <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                <th class="p-3.5 font-bold w-[25%]">Dimension</th>
                <th class="p-3.5 font-bold w-[37.5%] text-cyan-300">North-South Traffic (Ingress)</th>
                <th class="p-3.5 font-bold w-[37.5%] text-purple-300">East-West Traffic (Internal Mesh)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E293B] text-slate-300">
              ${trafficTaxonomy.map(row => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3.5 font-bold text-white font-code text-[11.5px]">${row.dimension}</td>
                  <td class="p-3.5 font-sans">${row.northSouth}</td>
                  <td class="p-3.5 font-sans">${row.eastWest}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- THE 3 SERVICE MESH ARCHITECTURAL EVOLUTIONS -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            THREE GENERATIONS OF INTER-SERVICE NETWORKING
          </span>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${meshApproaches.map(item => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
                <h4 class="font-sans text-[14px] font-bold text-white">${item.approach}</h4>
                <div class="text-[12px] font-code text-slate-400">
                  ${item.implementation}
                </div>
                <div class="flex flex-col gap-1 text-[12px] font-sans flex-1">
                  <div class="text-emerald-300"><strong>Pros:</strong> ${item.pros}</div>
                  <div class="text-rose-300"><strong>Cons:</strong> ${item.cons}</div>
                </div>
                <div class="pt-2 border-t border-[#24314A]/70">
                  <span class="px-2 py-0.5 rounded text-[10.5px] font-code border ${item.badgeColor}">
                    ${item.verdict}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Official Page 112 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 112</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 113: SENIOR PERSPECTIVE, FOLLOW-UPS & TAKEAWAYS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Green Callout Box: SENIOR PERSPECTIVE: BEWARE THE MESH TAX -->
        <div class="bg-[#062419] border-l-4 border-[#10B981] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-emerald-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">psychology</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: DO NOT ADOPT A MESH PREMATURELY
            </span>
          </div>
          <p class="text-[13.5px] text-emerald-100 font-sans leading-relaxed">
            A service mesh is not free: it introduces real operational overhead known as the <strong>Mesh Tax</strong>. Each Envoy sidecar consumes 50–150 MB of memory and adds 1–2ms of p99 latency to every RPC call. In an organization with 10 microservices written in the same language, installing Istio is massive over-engineering.
          </p>
          <p class="text-[13.5px] text-emerald-100/90 font-sans leading-relaxed">
            In system design interviews, state clearly: <em>"We should adopt a Service Mesh only when we exceed 20+ microservices in multiple programming languages, or when regulatory compliance mandates mutual TLS zero-trust cryptographic verification on every internal RPC."</em> If the interview problem requires ultra-low sub-millisecond latency (e.g. high-frequency trading), an Envoy sidecar is an immediate disqualifier.
          </p>
        </div>

        <!-- ZERO-TRUST IDENTITY WITH SPIFFE / SPIRE -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">fingerprint</span>
              ZERO-TRUST CRYPTOGRAPHIC IDENTITY VIA SPIFFE / SPIRE
            </span>
            <span class="text-[10px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              Cloud Native Computing Foundation (CNCF)
            </span>
          </div>

          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Traditional firewalls authenticate based on IP addresses, which are ephemeral in Kubernetes. A service mesh uses <strong>SPIFFE (Secure Production Identity Framework for Everyone)</strong>. Every workload receives an immutable URI encoded in the Subject Alternative Name (SAN) of an X.509 certificate:
          </p>

          <div class="bg-[#070B14] p-3.5 rounded-lg border border-[#1E293B] font-code text-[12px] text-emerald-300">
            spiffe://cluster.local/ns/production/sa/payment-service-account
          </div>

          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            When Pod A initiates a connection to Pod B, both Envoys present their SPIFFE certificates. Envoy cryptographically validates not just the encryption, but enforces fine-grained authorization: <em>"Only workloads with SPIFFE ID billing-service may POST to /v1/charge on payment-service."</em>
          </p>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box (Q1–Q4) -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">contact_support</span>
              DEEP-DIVE INTERVIEW FOLLOW-UPS (Q1–Q4)
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.question}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-6 flex flex-col gap-2.5 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[14px] font-sans font-medium text-white leading-relaxed">
            A service mesh moves transport concerns out of application code into a uniform infrastructure layer. North-south traffic belongs at the API Gateway; east-west belongs in the Mesh. Beware the mesh tax: evaluate whether your scale justifies 1-2ms extra hop latency and thousands of proxy instances.
          </p>
        </div>

        <!-- Official Page 113 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 113</span>
        </div>

      </div>

    </div>
  `;
}
