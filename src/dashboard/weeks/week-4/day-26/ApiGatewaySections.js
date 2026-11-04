/**
 * Question 5. Design an API Gateway — Masterclass Detailed Sections
 * Authoritative production-grade HLD, LLD, Database ERD, Algorithms,
 * Scalability, Failure Handling, Security/Observability, and Revision Rubrics.
 */

// =========================================================================
// HIGH-LEVEL DESIGN (HLD) & REQUEST ROUTING TOPOLOGY
// =========================================================================
export function getApiGatewayHldSection() {
  return {
    badge: "HLD & TOPOLOGY",
    badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
    title: "High-Level Design (HLD) & Request Routing Topology",
    content: `
      <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
        <p class="text-[13.5px] leading-relaxed">
          The API Gateway is architecturally divided into an ultra-low-latency, stateless <strong>Data Plane</strong> that processes client requests and a robust, versioned <strong>Control Plane</strong> that validates, stores, and distributes routing configurations and security policies.
        </p>

        <!-- HIGH DEFINITION SVG ARCHITECTURE DIAGRAM -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] p-5 shadow-lg overflow-x-auto">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-cyan-400 text-[20px]">hub</span>
              <strong class="text-[14px] font-bold text-white">API Gateway Architecture Blueprint &bull; Control Plane vs. Data Plane &bull; Upstream Routing</strong>
            </div>
            <span class="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/60">Architecture Diagram</span>
          </div>

          <svg viewBox="0 0 1180 720" class="w-full max-w-[1100px] h-auto min-w-[840px] select-none mx-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="gw-arr-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#38BDF8"/>
              </marker>
              <marker id="gw-arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#A855F7"/>
              </marker>
              <marker id="gw-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981"/>
              </marker>
              <marker id="gw-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#F59E0B"/>
              </marker>
            </defs>

            <!-- ================= TOP: CONTROL PLANE BOUNDARY BOX ================= -->
            <rect x="30" y="25" width="1120" height="115" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.6" stroke-dasharray="6,4"/>
            <rect x="45" y="35" width="190" height="20" rx="5" fill="#1E293B" stroke="#475569" stroke-width="1"/>
            <text x="140" y="49" font-family="Geist Mono, monospace" font-size="10" font-weight="700" fill="#94A3B8" text-anchor="middle">CONTROL PLANE (OUT-OF-BAND)</text>

            <!-- Admin API -->
            <rect x="60" y="55" width="240" height="70" rx="10" fill="#1E293B" stroke="#64748B" stroke-width="1.6"/>
            <text x="180" y="83" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#F8FAFC" text-anchor="middle">Admin Management API</text>
            <text x="180" y="103" font-family="Geist, sans-serif" font-size="10.5" fill="#94A3B8" text-anchor="middle">Route CRUD &bull; RBAC &bull; Audit Trails</text>

            <!-- Edge: Admin API -> Config Service -->
            <line x1="300" y1="90" x2="438" y2="90" stroke="#38BDF8" stroke-width="2" marker-end="url(#gw-arr-cyan)"/>
            <rect x="316" y="78" width="108" height="22" rx="4" fill="#082F49" stroke="#0284C7" stroke-width="1"/>
            <text x="370" y="93" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle">Publish Changes</text>

            <!-- Configuration Service -->
            <rect x="450" y="55" width="280" height="70" rx="10" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.8"/>
            <text x="590" y="83" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#EDE9FE" text-anchor="middle">Configuration Service</text>
            <text x="590" y="103" font-family="Geist, sans-serif" font-size="10.5" fill="#C4B5FD" text-anchor="middle">Validation &bull; Versioning &bull; Snapshot Rollout</text>

            <!-- Edge: Config Service -> Config DB -->
            <line x1="730" y1="90" x2="868" y2="90" stroke="#A855F7" stroke-width="2" marker-end="url(#gw-arr-purple)"/>
            <rect x="746" y="78" width="108" height="22" rx="4" fill="#2E1065" stroke="#7E22CE" stroke-width="1"/>
            <text x="800" y="93" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#D8B4FE" text-anchor="middle">Store Snapshot</text>

            <!-- Configuration DB -->
            <rect x="880" y="55" width="250" height="70" rx="10" fill="#451A03" stroke="#D97706" stroke-width="1.8"/>
            <text x="1005" y="83" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#FEF3C7" text-anchor="middle">Configuration Database</text>
            <text x="1005" y="103" font-family="Geist, sans-serif" font-size="10.5" fill="#FDE68A" text-anchor="middle">PostgreSQL &bull; Immutable Config Revisions</text>

            <!-- ================= MIDDLE-LEFT: CLIENTS & INGRESS ================= -->
            <!-- Web and Mobile Clients -->
            <rect x="30" y="240" width="190" height="150" rx="12" fill="#1E293B" stroke="#475569" stroke-width="1.8"/>
            <text x="125" y="275" font-family="Geist, sans-serif" font-size="14" font-weight="800" fill="#F8FAFC" text-anchor="middle">Web &amp; Mobile Clients</text>
            <text x="125" y="298" font-family="Geist, sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">iOS &bull; Android &bull; Single-Page Apps</text>
            <rect x="45" y="320" width="160" height="50" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <text x="125" y="342" font-family="Geist Mono, monospace" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">HTTPS / TLS 1.3</text>
            <text x="125" y="358" font-family="Geist Mono, monospace" font-size="9" fill="#64748B" text-anchor="middle">api.example.com</text>

            <!-- Edge: Clients -> Load Balancer -->
            <line x1="220" y1="315" x2="278" y2="315" stroke="#38BDF8" stroke-width="2.2" marker-end="url(#gw-arr-cyan)"/>

            <!-- Highly Available Load Balancer -->
            <rect x="290" y="220" width="180" height="190" rx="12" fill="#0C4A6E" stroke="#0284C7" stroke-width="2"/>
            <text x="380" y="255" font-family="Geist, sans-serif" font-size="14" font-weight="800" fill="#E0F2FE" text-anchor="middle">Load Balancer</text>
            <text x="380" y="275" font-family="Geist, sans-serif" font-size="10.5" fill="#BAE6FD" text-anchor="middle">AWS ALB / Cloud LB / L4/L7</text>
            <rect x="305" y="295" width="150" height="95" rx="8" fill="#082F49" stroke="#0369A1" stroke-width="1"/>
            <text x="380" y="318" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">&bull; TLS Termination</text>
            <text x="380" y="336" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">&bull; Active Health Checks</text>
            <text x="380" y="354" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">&bull; Anycast IP Routing</text>
            <text x="380" y="372" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">&bull; Cross-AZ Distribution</text>

            <!-- ================= CENTER: GATEWAY DATA PLANE FLEET ================= -->
            <rect x="510" y="165" width="320" height="525" rx="14" fill="#052E16" stroke="#16A34A" stroke-width="2"/>
            <rect x="525" y="175" width="290" height="22" rx="5" fill="#14532D" stroke="#22C55E" stroke-width="1"/>
            <text x="670" y="190" font-family="Geist Mono, monospace" font-size="10.5" font-weight="700" fill="#BBF7D0" text-anchor="middle">API GATEWAY DATA PLANE FLEET</text>

            <!-- Gateway Instance A -->
            <rect x="530" y="210" width="280" height="90" rx="10" fill="#064E3B" stroke="#10B981" stroke-width="1.8"/>
            <text x="670" y="235" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#ECFDF5" text-anchor="middle">Gateway Instance A</text>
            <text x="670" y="253" font-family="Geist, sans-serif" font-size="10" fill="#6EE7B7" text-anchor="middle">Route Match &bull; Token Validation &bull; Rate Limit</text>
            <text x="670" y="271" font-family="Geist Mono, monospace" font-size="9" fill="#A7F3D0" text-anchor="middle">Local In-Memory Config Cache (v4.2)</text>
            <text x="670" y="289" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#34D399" text-anchor="middle">Circuit Breaker &bull; Deadline Budgeting</text>

            <!-- Gateway Instance B -->
            <rect x="530" y="315" width="280" height="90" rx="10" fill="#064E3B" stroke="#10B981" stroke-width="1.8"/>
            <text x="670" y="340" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#ECFDF5" text-anchor="middle">Gateway Instance B</text>
            <text x="670" y="358" font-family="Geist, sans-serif" font-size="10" fill="#6EE7B7" text-anchor="middle">Route Match &bull; Token Validation &bull; Rate Limit</text>
            <text x="670" y="376" font-family="Geist Mono, monospace" font-size="9" fill="#A7F3D0" text-anchor="middle">Local In-Memory Config Cache (v4.2)</text>
            <text x="670" y="394" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#34D399" text-anchor="middle">Circuit Breaker &bull; Deadline Budgeting</text>

            <!-- Gateway Instance C -->
            <rect x="530" y="420" width="280" height="90" rx="10" fill="#064E3B" stroke="#10B981" stroke-width="1.8"/>
            <text x="670" y="445" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#ECFDF5" text-anchor="middle">Gateway Instance C</text>
            <text x="670" y="463" font-family="Geist, sans-serif" font-size="10" fill="#6EE7B7" text-anchor="middle">Route Match &bull; Token Validation &bull; Rate Limit</text>
            <text x="670" y="481" font-family="Geist Mono, monospace" font-size="9" fill="#A7F3D0" text-anchor="middle">Local In-Memory Config Cache (v4.2)</text>
            <text x="670" y="499" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#34D399" text-anchor="middle">Circuit Breaker &bull; Deadline Budgeting</text>

            <!-- Shared Rate Limit Store & Telemetry Box in Fleet footer -->
            <rect x="530" y="525" width="280" height="150" rx="10" fill="#022C22" stroke="#047857" stroke-width="1.2"/>
            <text x="670" y="548" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#A7F3D0" text-anchor="middle">Local vs. Coordinated Quotas</text>
            <text x="670" y="568" font-family="Geist, sans-serif" font-size="9.5" fill="#6EE7B7" text-anchor="middle">Local Token Buckets: 0ms overhead, approximate</text>
            <text x="670" y="586" font-family="Geist, sans-serif" font-size="9.5" fill="#6EE7B7" text-anchor="middle">Redis Cluster: atomic INCR/sliding-window</text>
            <line x1="550" y1="600" x2="790" y2="600" stroke="#047857" stroke-width="1"/>
            <text x="670" y="622" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#A7F3D0" text-anchor="middle">Asynchronous Telemetry Stream</text>
            <text x="670" y="642" font-family="Geist, sans-serif" font-size="9.5" fill="#6EE7B7" text-anchor="middle">Ring Buffers &bull; OpenTelemetry &bull; Non-Blocking</text>
            <text x="670" y="660" font-family="Geist, sans-serif" font-size="9.5" fill="#6EE7B7" text-anchor="middle">Trace ID + Baggage Header Propagation</text>

            <!-- Connecting Edges: LB -> Gateway Instances -->
            <path d="M 470 280 L 495 280 L 495 255 L 528 255" fill="none" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#gw-arr-cyan)"/>
            <path d="M 470 315 L 528 315" fill="none" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#gw-arr-cyan)"/>
            <path d="M 470 350 L 495 350 L 495 465 L 528 465" fill="none" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#gw-arr-cyan)"/>

            <!-- Connecting Edges: Config Service -> Gateway Fleet -->
            <path d="M 590 125 L 590 155 L 670 155 L 670 200" fill="none" stroke="#A855F7" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#gw-arr-purple)"/>
            <rect x="680" y="138" width="165" height="20" rx="4" fill="#2E1065" stroke="#7E22CE" stroke-width="1"/>
            <text x="762" y="152" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#E9D5FF" text-anchor="middle">Config Snapshot Push / Poll</text>

            <!-- ================= SUPPORTING SERVICES (LEFT BOTTOM) ================= -->
            <!-- Service Discovery -->
            <rect x="30" y="430" width="220" height="85" rx="10" fill="#312E81" stroke="#6366F1" stroke-width="1.6"/>
            <text x="140" y="458" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#EDE9FE" text-anchor="middle">Service Discovery</text>
            <text x="140" y="478" font-family="Geist, sans-serif" font-size="10" fill="#C4B5FD" text-anchor="middle">Consul / K8s CoreDNS / Eureka</text>
            <text x="140" y="496" font-family="Geist Mono, monospace" font-size="9" fill="#A5B4FC" text-anchor="middle">IP:Port &bull; Health State &bull; Weights</text>

            <!-- Edge: Service Discovery -> Gateway Fleet -->
            <path d="M 250 472 L 380 472 L 380 435 L 528 435" fill="none" stroke="#6366F1" stroke-width="1.6" stroke-dasharray="4,4" marker-end="url(#gw-arr-cyan)"/>

            <!-- Redis Rate Limit Store -->
            <rect x="30" y="540" width="220" height="85" rx="10" fill="#701A75" stroke="#D946EF" stroke-width="1.6"/>
            <text x="140" y="568" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#FDF4FF" text-anchor="middle">Shared Rate Limit Store</text>
            <text x="140" y="588" font-family="Geist, sans-serif" font-size="10" fill="#F5D0FE" text-anchor="middle">Redis Cluster (Optional)</text>
            <text x="140" y="606" font-family="Geist Mono, monospace" font-size="9" fill="#E879F9" text-anchor="middle">Global Tenant &amp; IP Quotas</text>

            <!-- Edge: Shared Store <-> Fleet -->
            <path d="M 250 582 L 528 582" fill="none" stroke="#D946EF" stroke-width="1.6" stroke-dasharray="4,4"/>

            <!-- ================= RIGHT: BACKEND MICROSERVICES ================= -->
            <rect x="880" y="165" width="270" height="525" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.8"/>
            <rect x="900" y="175" width="230" height="22" rx="5" fill="#1E293B" stroke="#475569" stroke-width="1"/>
            <text x="1015" y="190" font-family="Geist Mono, monospace" font-size="10.5" font-weight="700" fill="#94A3B8" text-anchor="middle">BACKEND SERVICES TIER</text>

            <!-- User Service -->
            <rect x="900" y="210" width="230" height="90" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.6"/>
            <text x="1015" y="238" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#F8FAFC" text-anchor="middle">User Service</text>
            <text x="1015" y="258" font-family="Geist, sans-serif" font-size="10.5" fill="#94A3B8" text-anchor="middle">3 Replicas &bull; Internal Port 8081</text>
            <text x="1015" y="278" font-family="Geist Mono, monospace" font-size="9" fill="#38BDF8" text-anchor="middle">/api/users/* &bull; Profile Mgmt</text>

            <!-- Order Service -->
            <rect x="900" y="315" width="230" height="90" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.6"/>
            <text x="1015" y="343" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#F8FAFC" text-anchor="middle">Order Service</text>
            <text x="1015" y="363" font-family="Geist, sans-serif" font-size="10.5" fill="#94A3B8" text-anchor="middle">5 Replicas &bull; Internal Port 8082</text>
            <text x="1015" y="383" font-family="Geist Mono, monospace" font-size="9" fill="#38BDF8" text-anchor="middle">/api/orders/* &bull; Checkout Core</text>

            <!-- Payment Service -->
            <rect x="900" y="420" width="230" height="90" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.6"/>
            <text x="1015" y="448" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#F8FAFC" text-anchor="middle">Payment Service</text>
            <text x="1015" y="468" font-family="Geist, sans-serif" font-size="10.5" fill="#94A3B8" text-anchor="middle">4 Replicas &bull; PCI-DSS Enclave</text>
            <text x="1015" y="488" font-family="Geist Mono, monospace" font-size="9" fill="#38BDF8" text-anchor="middle">/api/payments/* &bull; Idempotent</text>

            <!-- Database Tier behind microservices -->
            <rect x="900" y="525" width="230" height="150" rx="10" fill="#18181B" stroke="#27272A" stroke-width="1.2"/>
            <text x="1015" y="555" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#A1A1AA" text-anchor="middle">Microservice Databases</text>
            <text x="1015" y="578" font-family="Geist, sans-serif" font-size="9.5" fill="#71717A" text-anchor="middle">User DB (PostgreSQL / Aurora)</text>
            <text x="1015" y="598" font-family="Geist, sans-serif" font-size="9.5" fill="#71717A" text-anchor="middle">Order DB (Document / MongoDB)</text>
            <text x="1015" y="618" font-family="Geist, sans-serif" font-size="9.5" fill="#71717A" text-anchor="middle">Payment DB (ACID Distributed SQL)</text>
            <text x="1015" y="650" font-family="Geist, sans-serif" font-size="9" font-style="italic" fill="#52525B" text-anchor="middle">Gateway NEVER accesses DB directly</text>

            <!-- Forwarding Edges: Gateway Fleet -> Backend Services -->
            <path d="M 810 255 L 898 255" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#gw-arr-green)"/>
            <path d="M 810 360 L 898 360" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#gw-arr-green)"/>
            <path d="M 810 465 L 898 465" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#gw-arr-green)"/>

            <rect x="822" y="348" width="65" height="20" rx="4" fill="#064E3B" stroke="#059669" stroke-width="1"/>
            <text x="854" y="362" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#A7F3D0" text-anchor="middle">Forward</text>
          </svg>
        </div>

        <!-- Collapsible Mermaid Source for HLD -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
          <summary class="font-bold text-[12.5px] text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">code</span>
              View Mermaid.js Source Definition (HLD Architecture)
            </span>
            <span class="text-[11px] font-mono text-slate-500 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">flowchart TB
    C[Web and Mobile Clients]
    LB[Highly Available Load Balancer]

    subgraph DP["API Gateway Data Plane"]
        G1["Gateway Instance A"]
        G2["Gateway Instance B"]
        G3["Gateway Instance C"]
    end

    subgraph CP["API Gateway Control Plane"]
        ADMIN[Admin API]
        CFG[Configuration Service]
        DB[(Configuration Database)]
    end

    SD[Service Discovery]
    US[User Service Instances]
    OS[Order Service Instances]
    PS[Payment Service Instances]
    RL[(Optional Shared Rate Limit Store)]
    OBS[Logs Metrics and Tracing]

    C -->|HTTPS requests| LB
    LB --> G1
    LB --> G2
    LB --> G3

    ADMIN --> CFG
    CFG &lt;--> DB
    CFG -. Versioned configuration .-> G1
    CFG -. Versioned configuration .-> G2
    CFG -. Versioned configuration .-> G3

    G1 -. Resolve endpoints .-> SD
    G2 -. Resolve endpoints .-> SD
    G3 -. Resolve endpoints .-> SD

    SD -. Healthy endpoint information .-> G1
    SD -. Healthy endpoint information .-> G2
    SD -. Healthy endpoint information .-> G3

    G1 --> US
    G1 --> OS
    G1 --> PS
    G2 --> US
    G2 --> OS
    G2 --> PS
    G3 --> US
    G3 --> OS
    G3 --> PS

    G1 -. Optional coordinated quotas .-> RL
    G2 -. Optional coordinated quotas .-> RL
    G3 -. Optional coordinated quotas .-> RL

    G1 -. Telemetry .-> OBS
    G2 -. Telemetry .-> OBS
    G3 -. Telemetry .-> OBS</pre>
        </details>

        <!-- Component Responsibilities Table -->
        <div class="flex flex-col gap-3">
          <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-[19px]">domain_verification</span>
            Component Responsibilities
          </h4>
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/3">Component</th>
                  <th class="py-3 px-4 w-2/3">Architectural Responsibility</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Load Balancer (Layer 4/7)</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Terminates client TLS, performs health-checked traffic distribution across gateway instances across Availability Zones.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Gateway Instance (Data Plane)</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Executes the request pipeline in RAM: route matching, token validation, local rate limiting, timeout budgets, circuit breaking, and proxy forwarding.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Admin Management API</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Provides secure administrative endpoints for authorized operators or CI/CD systems to submit, inspect, and roll back routes and policy changes.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Configuration Service</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Validates route definitions, rejects conflicting regexes/paths, creates immutable versioned snapshots, and coordinates canary deployments to the fleet.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Configuration Database</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Durable relational store (PostgreSQL) maintaining route tables, policies, credentials, and full revision audit logs. Completely out-of-band from data-plane traffic.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Service Discovery</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Tracks dynamic backend IP:port allocations and health statuses (via Consul, CoreDNS, or Eureka), feeding healthy endpoints to the gateway router.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Shared Rate Limit Store</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Optional distributed Redis Cluster used exclusively when strict global tenant quotas are required; operates with explicit fail-open/fail-closed timeouts.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Backend Microservices</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Execute authoritative business logic, database transactions, domain validation, and fine-grained resource-ownership authorization checks.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Logs, Metrics &amp; Tracing (OTel)</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Asynchronously collects access telemetry, latency histograms, error counters, and distributed trace contexts without ever blocking the critical request path.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- End-to-End Request Flow & Request-Processing Pipeline Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          
          <!-- End-to-End Request Flow -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-emerald-500 text-[18px]">sync_alt</span>
              End-to-End Request Flow: GET /api/orders/123
            </h5>
            <ol class="space-y-2 text-[12px] text-slate-700 dark:text-slate-300 list-none pl-0">
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span><strong>Ingress:</strong> Client initiates TLS 1.3 handshake to <code>api.example.com</code>; public Load Balancer directs traffic to a healthy gateway instance.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span><strong>Route Matching:</strong> Gateway parses <code>/api/orders/123</code> against its in-memory prefix trie, mapping it to <code>order-service</code>.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span><strong>Auth &amp; Validation:</strong> JWT signature and claims (<code>exp</code>, <code>iss</code>) are validated locally using cached public keys; client IP and user rate limits are verified.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span><strong>Backend Resolution:</strong> Service resolver selects healthy instance <code>10.0.1.42:8080</code> from local discovery cache; checks circuit-breaker state.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">5</span>
                <span><strong>Downstream Call:</strong> Gateway scrubs untrusted headers, injects trusted context (<code>X-User-ID: usr_456</code>, <code>X-Trace-ID</code>), and forwards with a 2000ms deadline.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">6</span>
                <span><strong>Egress &amp; Telemetry:</strong> Backend returns <code>200 OK</code>. Gateway strips internal headers, streams response to client, and enqueues metric/trace to non-blocking ring buffer.</span>
              </li>
            </ol>
          </div>

          <!-- Request-Processing Pipeline Flow -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-purple-500 text-[18px]">account_tree</span>
              Request-Processing Pipeline (Filter Chain)
            </h5>
            <div class="flex flex-col gap-1.5 text-[11.5px] font-mono">
              <div class="p-2 rounded bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span class="text-slate-800 dark:text-slate-200">1. Ingress &amp; Coarse Rate Limit</span>
                <span class="text-sky-600 dark:text-sky-400 font-bold">IP &amp; DDoS Check</span>
              </div>
              <div class="text-center text-slate-400 text-[10px] leading-none">&darr;</div>
              <div class="p-2 rounded bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span class="text-slate-800 dark:text-slate-200">2. Request Validation &amp; Route Matching</span>
                <span class="text-indigo-600 dark:text-indigo-400 font-bold">Path Trie &bull; Size Caps</span>
              </div>
              <div class="text-center text-slate-400 text-[10px] leading-none">&darr;</div>
              <div class="p-2 rounded bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span class="text-slate-800 dark:text-slate-200">3. Authentication &amp; Route Authorization</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">JWT / JWKS &bull; Scopes</span>
              </div>
              <div class="text-center text-slate-400 text-[10px] leading-none">&darr;</div>
              <div class="p-2 rounded bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span class="text-slate-800 dark:text-slate-200">4. User / Tenant Rate Limiter</span>
                <span class="text-amber-600 dark:text-amber-400 font-bold">Token Bucket / 429</span>
              </div>
              <div class="text-center text-slate-400 text-[10px] leading-none">&darr;</div>
              <div class="p-2 rounded bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span class="text-slate-800 dark:text-slate-200">5. Service Discovery &amp; Circuit Breaker</span>
                <span class="text-rose-600 dark:text-rose-400 font-bold">Healthy Nodes &bull; Trip Check</span>
              </div>
              <div class="text-center text-slate-400 text-[10px] leading-none">&darr;</div>
              <div class="p-2 rounded bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span class="text-slate-800 dark:text-slate-200">6. Forward with Deadline &amp; Non-blocking Telemetry</span>
                <span class="text-purple-600 dark:text-purple-400 font-bold">Upstream I/O &bull; Trace Log</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    `
  };
}

// =========================================================================
// DATA MODELS & STORAGE LAYOUT (DATABASE DESIGN)
// =========================================================================
export function getApiGatewayDataModelSection() {
  return `
    <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
      
      <!-- Architectural Separation Callout -->
      <div class="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 flex flex-col gap-2">
        <h4 class="font-bold text-[14px] text-purple-900 dark:text-purple-300 flex items-center gap-2">
          <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[19px]">database</span>
          Does an API Gateway Need a Database?
        </h4>
        <p class="text-[13px] text-purple-950 dark:text-purple-200 leading-relaxed">
          <strong>Never on the critical request path.</strong> The gateway data plane serves requests entirely from high-speed in-memory routing tables. The database exists exclusively for the <strong>Control Plane</strong> to store route definitions, policy configurations, credentials, and revision histories. Instances load validated, immutable configuration snapshots into RAM and update them out-of-band via push/pull notifications.
        </p>
      </div>

      <!-- Main Entities Table -->
      <div class="flex flex-col gap-3">
        <strong class="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[18px]">table_chart</span>
          Main Entities &amp; Schema Responsibilities
        </strong>
        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
          <table class="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                <th class="py-3 px-4">Entity</th>
                <th class="py-3 px-4">Key Attributes &amp; Types</th>
                <th class="py-3 px-4">Relational Purpose &amp; Operational Invariants</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">SERVICE</td>
                <td class="py-2.5 px-4 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">service_id (PK, varchar)<br/>service_name (varchar)<br/>discovery_name (varchar)</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Identifies a logical backend microservice. Maps to discovery targets (e.g. <code>order-service.production.internal</code>).</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">CONFIG_VERSION</td>
                <td class="py-2.5 px-4 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">version_id (PK, int)<br/>created_at (datetime)<br/>created_by (varchar)<br/>status (enum: DRAFT, ACTIVE, RETIRED)</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Represents an immutable, atomic configuration snapshot. Enables atomic fleet-wide rollouts and zero-downtime instant rollbacks.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">ROUTE</td>
                <td class="py-2.5 px-4 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">route_id (PK, varchar)<br/>version_id (FK, int)<br/>service_id (FK, varchar)<br/>path_prefix (varchar)<br/>methods (text[])</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Defines exact path matching rules (e.g. <code>/api/orders</code>) and HTTP verbs for a specific configuration snapshot.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">POLICY</td>
                <td class="py-2.5 px-4 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">policy_id (PK, varchar)<br/>route_id (FK, varchar)<br/>auth_required (bool)<br/>timeout_ms (int)<br/>rate_limit (int)</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Route-specific operational policies enforcing authentication requirements, upstream deadlines (timeouts), and client rate quotas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- LOGICAL METADATA ER DIAGRAM (SVG) -->
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] p-5 shadow-lg overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-teal-400 text-[20px]">schema</span>
            <strong class="text-[14px] font-bold text-white">API Gateway Configuration Schema &bull; Relational Entity-Relationship Diagram</strong>
          </div>
          <span class="text-[11px] font-mono text-teal-300 bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-800/60">Crow's Foot Cardinality</span>
        </div>

        <svg viewBox="0 0 980 340" class="w-full max-w-[920px] h-auto min-w-[700px] select-none mx-auto" xmlns="http://www.w3.org/2000/svg">
          <!-- Entity: CONFIG_VERSION -->
          <rect x="30" y="30" width="220" height="150" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.8"/>
          <rect x="30" y="30" width="220" height="32" rx="8" fill="#312E81"/>
          <text x="140" y="52" font-family="Geist Mono, monospace" font-size="12" font-weight="700" fill="#EDE9FE" text-anchor="middle">CONFIG_VERSION</text>
          <text x="45" y="80" font-family="Geist Mono, monospace" font-size="11" fill="#C4B5FD">PK version_id : int</text>
          <text x="45" y="102" font-family="Geist Mono, monospace" font-size="11" fill="#94A3B8">created_at : datetime</text>
          <text x="45" y="124" font-family="Geist Mono, monospace" font-size="11" fill="#94A3B8">created_by : varchar</text>
          <text x="45" y="146" font-family="Geist Mono, monospace" font-size="11" fill="#94A3B8">status : varchar</text>

          <!-- Entity: ROUTE (Center) -->
          <rect x="370" y="30" width="240" height="170" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.8"/>
          <rect x="370" y="30" width="240" height="32" rx="8" fill="#075985"/>
          <text x="490" y="52" font-family="Geist Mono, monospace" font-size="12" font-weight="700" fill="#E0F2FE" text-anchor="middle">ROUTE</text>
          <text x="385" y="80" font-family="Geist Mono, monospace" font-size="11" fill="#7DD3FC">PK route_id : varchar</text>
          <text x="385" y="102" font-family="Geist Mono, monospace" font-size="11" fill="#FDE68A">FK version_id : int</text>
          <text x="385" y="124" font-family="Geist Mono, monospace" font-size="11" fill="#FDE68A">FK service_id : varchar</text>
          <text x="385" y="146" font-family="Geist Mono, monospace" font-size="11" fill="#94A3B8">path_prefix : varchar</text>
          <text x="385" y="168" font-family="Geist Mono, monospace" font-size="11" fill="#94A3B8">methods : varchar[]</text>

          <!-- Entity: SERVICE (Top Right) -->
          <rect x="730" y="30" width="220" height="130" rx="8" fill="#14532D" stroke="#16A34A" stroke-width="1.8"/>
          <rect x="730" y="30" width="220" height="32" rx="8" fill="#166534"/>
          <text x="840" y="52" font-family="Geist Mono, monospace" font-size="12" font-weight="700" fill="#DCFCE7" text-anchor="middle">SERVICE</text>
          <text x="745" y="80" font-family="Geist Mono, monospace" font-size="11" fill="#86EFAC">PK service_id : varchar</text>
          <text x="745" y="102" font-family="Geist Mono, monospace" font-size="11" fill="#94A3B8">service_name : varchar</text>
          <text x="745" y="124" font-family="Geist Mono, monospace" font-size="11" fill="#94A3B8">discovery_name : varchar</text>

          <!-- Entity: POLICY (Bottom Center) -->
          <rect x="370" y="240" width="240" height="85" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.8"/>
          <rect x="370" y="240" width="240" height="28" rx="8" fill="#78350F"/>
          <text x="490" y="260" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#FEF3C7" text-anchor="middle">POLICY</text>
          <text x="385" y="285" font-family="Geist Mono, monospace" font-size="10.5" fill="#FCD34D">PK policy_id &bull; FK route_id</text>
          <text x="385" y="305" font-family="Geist Mono, monospace" font-size="10" fill="#CBD5E1">auth_required &bull; timeout_ms &bull; rate_limit</text>

          <!-- Relationships -->
          <!-- CONFIG_VERSION ||--o{ ROUTE: "contains" -->
          <line x1="250" y1="105" x2="370" y2="105" stroke="#94A3B8" stroke-width="2"/>
          <rect x="275" y="93" width="70" height="22" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1"/>
          <text x="310" y="108" font-family="Geist, sans-serif" font-size="9.5" fill="#CBD5E1" text-anchor="middle">contains</text>

          <!-- SERVICE ||--o{ ROUTE: "serves" -->
          <line x1="610" y1="95" x2="730" y2="95" stroke="#94A3B8" stroke-width="2"/>
          <rect x="638" y="83" width="62" height="22" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1"/>
          <text x="669" y="98" font-family="Geist, sans-serif" font-size="9.5" fill="#CBD5E1" text-anchor="middle">serves</text>

          <!-- ROUTE ||--o{ POLICY: "applies" -->
          <line x1="490" y1="200" x2="490" y2="240" stroke="#94A3B8" stroke-width="2"/>
          <rect x="458" y="208" width="64" height="20" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1"/>
          <text x="490" y="222" font-family="Geist, sans-serif" font-size="9.5" fill="#CBD5E1" text-anchor="middle">applies</text>
        </svg>
      </div>

      <!-- Collapsible Mermaid Source for ERD -->
      <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
        <summary class="font-bold text-[12.5px] text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-between">
          <span class="flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">code</span>
            View Mermaid.js Source Definition (Control Plane ERD)
          </span>
          <span class="text-[11px] font-mono text-slate-500 group-open:rotate-180 transition-transform">&darr;</span>
        </summary>
        <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">erDiagram
    SERVICE ||--o{ ROUTE : serves
    CONFIG_VERSION ||--o{ ROUTE : contains
    ROUTE ||--o{ POLICY : applies

    SERVICE {
        string service_id PK
        string service_name
        string discovery_name
    }

    CONFIG_VERSION {
        int version_id PK
        datetime created_at
        string created_by
        string status
    }

    ROUTE {
        string route_id PK
        int version_id FK
        string service_id FK
        string path_prefix
        string methods
    }

    POLICY {
        string policy_id PK
        string route_id FK
        boolean auth_required
        int timeout_ms
        int rate_limit
    }</pre>
      </details>

      <!-- Database Choice Rationale -->
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
        <strong class="text-[13.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span class="material-symbols-outlined text-blue-500 text-[18px]">check_circle</span>
          Database Technology Choice: PostgreSQL
        </strong>
        <p class="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
          PostgreSQL is the recommended control-plane database because routing rules, versioning trees, and policy schemas are inherently relational and structured. ACID transactions guarantee that publishing a new configuration version activates all child routes atomically without partial state corruption.
        </p>
      </div>

    </div>
  `;
}

// =========================================================================
// LOW-LEVEL DESIGN (LLD), CLASS & SEQUENCE DIAGRAMS, PSEUDOCODE
// =========================================================================
export function getApiGatewayLldSection() {
  return {
    badge: "LLD & CODE",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-300",
    title: "Low-Level Design (LLD), Class & Sequence Diagrams, Pseudocode",
    content: `
      <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
        <p class="text-[13.5px] leading-relaxed">
          While the HLD illustrates how distributed nodes interact across the network, the Low-Level Design defines the internal object-oriented structure and request execution pipeline of a single gateway process.
        </p>

        <!-- Main Classes and Interfaces Table -->
        <div class="flex flex-col gap-3">
          <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[19px]">account_tree</span>
            Core Classes, Interfaces &amp; Execution Roles
          </h4>
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/4">Class / Interface</th>
                  <th class="py-3 px-4 w-3/4">Object Responsibility &amp; Method Signatures</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">GatewayHandler</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Top-level pipeline coordinator orchestrating filter chain steps via <code>handle(request): Response</code>.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">RouteMatcher</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Performs high-performance prefix-trie lookup via <code>match(request): Route</code> against the active configuration.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">RequestValidator</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Validates HTTP methods, header constraints, and payload sizes via <code>validate(request, route): Result</code>.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">AuthService</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Validates tokens via <code>authenticate(request): Identity</code> and verifies permissions via <code>authorize(identity, route): bool</code>.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">RateLimiter</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Enforces token-bucket or sliding-window limits via <code>allow(key, route): bool</code>, rejecting over-quota calls with HTTP 429.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">ServiceResolver</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Interrogates service registry or DNS cache via <code>resolve(serviceName): EndpointList</code> to find healthy backend instances.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">LoadBalancer</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Picks optimal target node via <code>select(endpoints): Endpoint</code> using round robin, least connections, or EWMA latency.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">ProxyClient</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Asynchronously forwards the HTTP request to upstream service via <code>forward(request, endpoint, deadline): Response</code>.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">CircuitBreaker</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Maintains closed/open/half-open state via <code>allowRequest(): bool</code>, <code>recordSuccess()</code>, and <code>recordFailure()</code>.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-slate-500">ConfigProvider</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Serves in-memory snapshot via <code>getActiveConfig(): Config</code> and atomically swaps pointers on updates.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-slate-500">TelemetryRecorder</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Non-blocking metric and log emission via <code>record(result, duration)</code> into lock-free ring buffers.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- LLD CLASS DIAGRAM (SVG) -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] p-5 shadow-lg overflow-x-auto">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-400 text-[20px]">account_tree</span>
              <strong class="text-[14px] font-bold text-white">LLD Object-Oriented Class Diagram &bull; Component Dependencies</strong>
            </div>
            <span class="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-800/60">Class Model</span>
          </div>

          <svg viewBox="0 0 1020 480" class="w-full max-w-[960px] h-auto min-w-[740px] select-none mx-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="gw-class-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748B"/>
              </marker>
              <marker id="gw-cb-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#E11D48"/>
              </marker>
              <marker id="gw-lb-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#16A34A"/>
              </marker>
            </defs>

            <!-- Top Row: ConfigProvider, GatewayHandler, TelemetryRecorder -->
            <!-- ConfigProvider -->
            <rect x="40" y="20" width="260" height="75" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.6"/>
            <rect x="40" y="20" width="260" height="24" rx="8" fill="#312E81"/>
            <text x="170" y="37" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#EDE9FE" text-anchor="middle">ConfigProvider</text>
            <text x="55" y="65" font-family="Geist Mono, monospace" font-size="10.5" fill="#C4B5FD">+getActiveConfig() : Config</text>
            <text x="55" y="83" font-family="Geist, sans-serif" font-size="9.5" fill="#A5B4FC">In-memory immutable revision cache</text>

            <!-- Center Orchestrator: GatewayHandler -->
            <rect x="360" y="15" width="300" height="90" rx="10" fill="#0C4A6E" stroke="#0284C7" stroke-width="2"/>
            <rect x="360" y="15" width="300" height="26" rx="10" fill="#0369A1"/>
            <text x="510" y="33" font-family="Geist Mono, monospace" font-size="12.5" font-weight="700" fill="#E0F2FE" text-anchor="middle">GatewayHandler</text>
            <text x="375" y="64" font-family="Geist Mono, monospace" font-size="11" font-weight="600" fill="#BAE6FD">+handle(request) : Response</text>
            <text x="375" y="84" font-family="Geist Mono, monospace" font-size="9.5" fill="#7DD3FC">-filterChain : List&lt;GatewayFilter&gt;</text>
            <text x="375" y="98" font-family="Geist, sans-serif" font-size="9" fill="#94A3B8">Top-level non-blocking event coordinator</text>

            <!-- TelemetryRecorder -->
            <rect x="720" y="20" width="260" height="75" rx="8" fill="#18181B" stroke="#3F3F46" stroke-width="1.6"/>
            <rect x="720" y="20" width="260" height="24" rx="8" fill="#27272A"/>
            <text x="850" y="37" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#F4F4F5" text-anchor="middle">TelemetryRecorder</text>
            <text x="735" y="65" font-family="Geist Mono, monospace" font-size="10.5" fill="#D4D4D8">+record(result, duration)</text>
            <text x="735" y="83" font-family="Geist, sans-serif" font-size="9.5" fill="#A1A1AA">Non-blocking lock-free metrics/tracing</text>

            <!-- Connecting Edges: Top Row -->
            <line x1="360" y1="58" x2="302" y2="58" stroke="#64748B" stroke-width="1.5" marker-end="url(#gw-class-arr)"/>
            <line x1="660" y1="58" x2="718" y2="58" stroke="#64748B" stroke-width="1.5" marker-end="url(#gw-class-arr)"/>

            <!-- Middle Row: Left Filter Stack -->
            <!-- RouteMatcher -->
            <rect x="40" y="140" width="260" height="65" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.6"/>
            <text x="170" y="164" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#ECFDF5" text-anchor="middle">RouteMatcher</text>
            <text x="55" y="186" font-family="Geist Mono, monospace" font-size="10.5" fill="#6EE7B7">+match(request) : Route</text>

            <!-- RequestValidator -->
            <rect x="40" y="230" width="260" height="65" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1.6"/>
            <text x="170" y="254" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#F8FAFC" text-anchor="middle">RequestValidator</text>
            <text x="55" y="276" font-family="Geist Mono, monospace" font-size="10.5" fill="#94A3B8">+validate(request, route) : Result</text>

            <!-- AuthService -->
            <rect x="40" y="320" width="260" height="85" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.6"/>
            <text x="170" y="344" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#FEF3C7" text-anchor="middle">AuthService</text>
            <text x="55" y="366" font-family="Geist Mono, monospace" font-size="10" fill="#FDE68A">+authenticate(request) : Identity</text>
            <text x="55" y="386" font-family="Geist Mono, monospace" font-size="10" fill="#FDE68A">+authorize(identity, route) : bool</text>

            <!-- Middle Column: RateLimiter, ServiceResolver, LoadBalancer -->
            <!-- RateLimiter -->
            <rect x="360" y="140" width="300" height="65" rx="8" fill="#701A75" stroke="#D946EF" stroke-width="1.6"/>
            <text x="510" y="164" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#FDF4FF" text-anchor="middle">RateLimiter</text>
            <text x="375" y="186" font-family="Geist Mono, monospace" font-size="10.5" fill="#F5D0FE">+allow(key, route) : bool</text>

            <!-- ServiceResolver -->
            <rect x="360" y="235" width="300" height="65" rx="8" fill="#312E81" stroke="#6366F1" stroke-width="1.6"/>
            <text x="510" y="259" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#EDE9FE" text-anchor="middle">ServiceResolver</text>
            <text x="375" y="281" font-family="Geist Mono, monospace" font-size="10.5" fill="#C4B5FD">+resolve(serviceName) : EndpointList</text>

            <!-- LoadBalancer -->
            <rect x="360" y="340" width="300" height="65" rx="8" fill="#14532D" stroke="#16A34A" stroke-width="1.6"/>
            <text x="510" y="364" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#DCFCE7" text-anchor="middle">LoadBalancer</text>
            <text x="375" y="386" font-family="Geist Mono, monospace" font-size="10.5" fill="#86EFAC">+select(endpoints) : Endpoint</text>

            <!-- ServiceResolver -> LoadBalancer -->
            <line x1="510" y1="300" x2="510" y2="338" stroke="#16A34A" stroke-width="1.8" marker-end="url(#gw-lb-arr)"/>
            <text x="520" y="322" font-family="Geist, sans-serif" font-size="8.5" fill="#86EFAC">select</text>

            <!-- Right Column: ProxyClient, CircuitBreaker -->
            <!-- ProxyClient -->
            <rect x="720" y="140" width="260" height="75" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="1.6"/>
            <text x="850" y="164" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#F0F9FF" text-anchor="middle">ProxyClient</text>
            <text x="735" y="186" font-family="Geist Mono, monospace" font-size="9.5" fill="#7DD3FC">+forward(req, endpoint, deadline)</text>
            <text x="735" y="202" font-family="Geist Mono, monospace" font-size="9.5" fill="#38BDF8">  : Response</text>

            <!-- CircuitBreaker -->
            <rect x="720" y="255" width="260" height="85" rx="8" fill="#4C0519" stroke="#E11D48" stroke-width="1.6"/>
            <text x="850" y="279" font-family="Geist Mono, monospace" font-size="11.5" font-weight="700" fill="#FFE4E6" text-anchor="middle">CircuitBreaker</text>
            <text x="735" y="301" font-family="Geist Mono, monospace" font-size="10" fill="#FDA4AF">+allowRequest() : bool</text>
            <text x="735" y="321" font-family="Geist Mono, monospace" font-size="10" fill="#FDA4AF">+recordSuccess() / recordFailure()</text>

            <!-- ProxyClient -> CircuitBreaker -->
            <line x1="850" y1="215" x2="850" y2="253" stroke="#E11D48" stroke-width="1.8" marker-end="url(#gw-cb-arr)"/>
            <text x="860" y="238" font-family="Geist, sans-serif" font-size="8.5" fill="#FDA4AF">guard</text>

            <!-- Connecting Edges: GatewayHandler -> Filters & Upstream -->
            <!-- to RouteMatcher -->
            <path d="M 400 105 L 400 120 L 170 120 L 170 138" fill="none" stroke="#64748B" stroke-width="1.4" marker-end="url(#gw-class-arr)"/>
            <!-- to RateLimiter -->
            <line x1="510" y1="105" x2="510" y2="138" stroke="#64748B" stroke-width="1.4" marker-end="url(#gw-class-arr)"/>
            <!-- to ServiceResolver -->
            <path d="M 450 105 L 450 215 L 450 233" fill="none" stroke="#64748B" stroke-width="1.4" marker-end="url(#gw-class-arr)"/>
            <!-- to ProxyClient -->
            <path d="M 620 105 L 620 120 L 850 120 L 850 138" fill="none" stroke="#64748B" stroke-width="1.4" marker-end="url(#gw-class-arr)"/>
          </svg>
        </div>

        <!-- Collapsible Mermaid Source for LLD Class Diagram -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
          <summary class="font-bold text-[12.5px] text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">code</span>
              View Mermaid.js Source Definition (LLD Class Diagram)
            </span>
            <span class="text-[11px] font-mono text-slate-500 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">classDiagram
    class GatewayHandler {
        +handle(request) Response
    }

    class RouteMatcher {
        +match(request) Route
    }

    class RequestValidator {
        +validate(request, route) Result
    }

    class AuthService {
        +authenticate(request) Identity
        +authorize(identity, route) bool
    }

    class RateLimiter {
        +allow(key, route) bool
    }

    class ServiceResolver {
        +resolve(serviceName) EndpointList
    }

    class LoadBalancer {
        +select(endpoints) Endpoint
    }

    class ProxyClient {
        +forward(request, endpoint, deadline) Response
    }

    class CircuitBreaker {
        +allowRequest() bool
        +recordSuccess()
        +recordFailure()
    }

    class ConfigProvider {
        +getActiveConfig() Config
    }

    class TelemetryRecorder {
        +record(result, duration)
    }

    GatewayHandler --&gt; RouteMatcher
    GatewayHandler --&gt; RequestValidator
    GatewayHandler --&gt; AuthService
    GatewayHandler --&gt; RateLimiter
    GatewayHandler --&gt; ServiceResolver
    GatewayHandler --&gt; ProxyClient
    GatewayHandler --&gt; ConfigProvider
    GatewayHandler --&gt; TelemetryRecorder
    ServiceResolver --&gt; LoadBalancer
    ProxyClient --&gt; CircuitBreaker</pre>
        </details>

        <!-- SEQUENCE DIAGRAM (SVG) -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] p-5 shadow-lg overflow-x-auto">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-400 text-[20px]">swap_horiz</span>
              <strong class="text-[14px] font-bold text-white">Sequence Diagram &bull; Synchronous End-to-End Request Execution</strong>
            </div>
            <span class="text-[11px] font-mono text-blue-300 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/60">Execution Flow</span>
          </div>

          <svg viewBox="0 0 1040 630" class="w-full max-w-[980px] h-auto min-w-[760px] select-none mx-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="seq-arr-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#38BDF8"/>
              </marker>
              <marker id="seq-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#34D399"/>
              </marker>
              <marker id="seq-arr-ret" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#94A3B8"/>
              </marker>
            </defs>

            <!-- Participant Lifelines -->
            <!-- 1. Client -->
            <rect x="20" y="15" width="80" height="36" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
            <text x="60" y="38" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#F8FAFC" text-anchor="middle">Client</text>
            <line x1="60" y1="51" x2="60" y2="615" stroke="#334155" stroke-dasharray="4,4" stroke-width="1.2"/>

            <!-- 2. GatewayHandler -->
            <rect x="130" y="15" width="120" height="36" rx="6" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
            <text x="190" y="38" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#E0F2FE" text-anchor="middle">GatewayHandler</text>
            <line x1="190" y1="51" x2="190" y2="615" stroke="#334155" stroke-dasharray="4,4" stroke-width="1.2"/>

            <!-- 3. RouteMatcher -->
            <rect x="270" y="15" width="100" height="36" rx="6" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
            <text x="320" y="38" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#ECFDF5" text-anchor="middle">RouteMatcher</text>
            <line x1="320" y1="51" x2="320" y2="615" stroke="#334155" stroke-dasharray="4,4" stroke-width="1.2"/>

            <!-- 4. AuthService -->
            <rect x="390" y="15" width="100" height="36" rx="6" fill="#451A03" stroke="#D97706" stroke-width="1.5"/>
            <text x="440" y="38" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FEF3C7" text-anchor="middle">AuthService</text>
            <line x1="440" y1="51" x2="440" y2="615" stroke="#334155" stroke-dasharray="4,4" stroke-width="1.2"/>

            <!-- 5. RateLimiter -->
            <rect x="510" y="15" width="100" height="36" rx="6" fill="#701A75" stroke="#D946EF" stroke-width="1.5"/>
            <text x="560" y="38" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FDF4FF" text-anchor="middle">RateLimiter</text>
            <line x1="560" y1="51" x2="560" y2="615" stroke="#334155" stroke-dasharray="4,4" stroke-width="1.2"/>

            <!-- 6. ServiceResolver -->
            <rect x="630" y="15" width="110" height="36" rx="6" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5"/>
            <text x="685" y="38" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#EDE9FE" text-anchor="middle">ServiceResolver</text>
            <line x1="685" y1="51" x2="685" y2="615" stroke="#334155" stroke-dasharray="4,4" stroke-width="1.2"/>

            <!-- 7. ProxyClient -->
            <rect x="760" y="15" width="100" height="36" rx="6" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
            <text x="810" y="38" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#F0F9FF" text-anchor="middle">ProxyClient</text>
            <line x1="810" y1="51" x2="810" y2="615" stroke="#334155" stroke-dasharray="4,4" stroke-width="1.2"/>

            <!-- 8. Order Service -->
            <rect x="880" y="15" width="110" height="36" rx="6" fill="#18181B" stroke="#52525B" stroke-width="1.5"/>
            <text x="935" y="38" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#F4F4F5" text-anchor="middle">Order Service</text>
            <line x1="935" y1="51" x2="935" y2="615" stroke="#334155" stroke-dasharray="4,4" stroke-width="1.2"/>

            <!-- Interactions -->
            <!-- 1. C -> G: GET /api/orders/123 -->
            <line x1="60" y1="80" x2="183" y2="80" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#seq-arr-blue)"/>
            <text x="120" y="73" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#7DD3FC" text-anchor="middle">1. GET /api/orders/123</text>

            <!-- 2. G -> R: Match request -->
            <line x1="190" y1="115" x2="313" y2="115" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#seq-arr-blue)"/>
            <text x="255" y="108" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">2. Match request</text>

            <!-- 3. R --> G: Route configuration -->
            <line x1="320" y1="145" x2="197" y2="145" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#seq-arr-ret)"/>
            <text x="255" y="138" font-family="Geist, sans-serif" font-size="9.5" fill="#94A3B8" text-anchor="middle">3. Route configuration</text>

            <!-- 4. G -> G: Validate request (self-call) -->
            <path d="M 190 170 L 235 170 L 235 192 L 197 192" fill="none" stroke="#60A5FA" stroke-width="1.5" marker-end="url(#seq-arr-blue)"/>
            <text x="242" y="184" font-family="Geist, sans-serif" font-size="9" fill="#93C5FD" text-anchor="start">4. Validate request</text>

            <!-- 5. G -> A: Authenticate and authorize -->
            <line x1="190" y1="220" x2="433" y2="220" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#seq-arr-blue)"/>
            <text x="315" y="213" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">5. Authenticate and authorize</text>

            <!-- 6. A --> G: Authorized -->
            <line x1="440" y1="250" x2="197" y2="250" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#seq-arr-ret)"/>
            <text x="315" y="243" font-family="Geist, sans-serif" font-size="9.5" fill="#FDE68A" text-anchor="middle">6. Authorized</text>

            <!-- 7. G -> L: Check quota -->
            <line x1="190" y1="285" x2="553" y2="285" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#seq-arr-blue)"/>
            <text x="375" y="278" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">7. Check quota</text>

            <!-- 8. L --> G: Allowed -->
            <line x1="560" y1="315" x2="197" y2="315" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#seq-arr-ret)"/>
            <text x="375" y="308" font-family="Geist, sans-serif" font-size="9.5" fill="#F5D0FE" text-anchor="middle">8. Allowed</text>

            <!-- 9. G -> S: Resolve order-service -->
            <line x1="190" y1="350" x2="678" y2="350" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#seq-arr-blue)"/>
            <text x="435" y="343" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">9. Resolve order-service</text>

            <!-- 10. S --> G: Healthy endpoint -->
            <line x1="685" y1="380" x2="197" y2="380" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#seq-arr-ret)"/>
            <text x="435" y="373" font-family="Geist, sans-serif" font-size="9.5" fill="#C4B5FD" text-anchor="middle">10. Healthy endpoint</text>

            <!-- 11. G -> P: Forward with deadline -->
            <line x1="190" y1="415" x2="803" y2="415" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#seq-arr-blue)"/>
            <text x="500" y="408" font-family="Geist, sans-serif" font-size="9.5" fill="#7DD3FC" text-anchor="middle">11. Forward with deadline</text>

            <!-- 12. P -> B: GET /orders/123 -->
            <line x1="810" y1="450" x2="928" y2="450" stroke="#34D399" stroke-width="2" marker-end="url(#seq-arr-green)"/>
            <text x="870" y="442" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#6EE7B7" text-anchor="middle">12. GET /orders/123</text>

            <!-- 13. B --> P: 200 OK + order -->
            <line x1="935" y1="485" x2="817" y2="485" stroke="#34D399" stroke-width="1.8" stroke-dasharray="3,3" marker-end="url(#seq-arr-green)"/>
            <text x="875" y="477" font-family="Geist, sans-serif" font-size="9.5" fill="#A7F3D0" text-anchor="middle">13. 200 OK + order</text>

            <!-- 14. P --> G: Backend response -->
            <line x1="810" y1="520" x2="197" y2="520" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#seq-arr-ret)"/>
            <text x="500" y="513" font-family="Geist, sans-serif" font-size="9.5" fill="#94A3B8" text-anchor="middle">14. Backend response</text>

            <!-- 15. G -> G: Record outcome and telemetry (self-call) -->
            <path d="M 190 545 L 245 545 L 245 567 L 197 567" fill="none" stroke="#60A5FA" stroke-width="1.5" marker-end="url(#seq-arr-blue)"/>
            <text x="252" y="559" font-family="Geist, sans-serif" font-size="9" fill="#93C5FD" text-anchor="start">15. Record outcome and telemetry</text>

            <!-- 16. G --> C: 200 OK + order -->
            <line x1="190" y1="600" x2="67" y2="600" stroke="#38BDF8" stroke-width="2" marker-end="url(#seq-arr-blue)"/>
            <text x="125" y="592" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">16. 200 OK + order</text>
          </svg>
        </div>

        <!-- Collapsible Mermaid Source for Sequence Diagram -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
          <summary class="font-bold text-[12.5px] text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">code</span>
              View Mermaid.js Source Definition (Sequence Diagram)
            </span>
            <span class="text-[11px] font-mono text-slate-500 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">sequenceDiagram
    participant C as Client
    participant G as GatewayHandler
    participant R as RouteMatcher
    participant A as AuthService
    participant L as RateLimiter
    participant S as ServiceResolver
    participant P as ProxyClient
    participant B as Order Service

    C-&gt;&gt;G: GET /api/orders/123
    G-&gt;&gt;R: Match request
    R--&gt;&gt;G: Route configuration
    G-&gt;&gt;G: Validate request
    G-&gt;&gt;A: Authenticate and authorize
    A--&gt;&gt;G: Authorized
    G-&gt;&gt;L: Check quota
    L--&gt;&gt;G: Allowed
    G-&gt;&gt;S: Resolve order-service
    S--&gt;&gt;G: Healthy endpoint
    G-&gt;&gt;P: Forward with deadline
    P-&gt;&gt;B: GET /orders/123
    B--&gt;&gt;P: 200 OK + order
    P--&gt;&gt;G: Backend response
    G-&gt;&gt;G: Record outcome and telemetry
    G--&gt;&gt;C: 200 OK + order</pre>
        </details>

        <!-- SIMPLIFIED PSEUDOCODE -->
        <div class="flex flex-col gap-2">
          <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[19px]">terminal</span>
            Simplified Gateway Request Handler Pseudocode
          </h4>
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 font-mono text-[12.5px] text-cyan-300 overflow-x-auto leading-relaxed shadow-sm">
<pre>function handle(request):
    startTime = now()
    result = initializeResult()

    try:
        // 1. Route Resolution
        route = routeMatcher.match(request)
        if route is null:
            result.response = error(404, "Route not found")
            return result.response

        // 2. Request Constraints & Size Validation
        if not requestValidator.validate(request, route):
            result.response = error(400, "Malformed request or oversized payload")
            return result.response

        // 3. Authentication & Coarse Authorization
        identity = authService.authenticate(request)
        if identity is null or identity.isExpired():
            result.response = error(401, "Invalid or expired token")
            return result.response

        if not authService.authorize(identity, route):
            result.response = error(403, "Insufficient route permissions")
            return result.response

        // 4. Rate Limiting (Token Bucket / Sliding Window)
        if not rateLimiter.allow(identity.userId, route):
            result.response = error(429, "Too Many Requests")
            return result.response

        // 5. Backend Instance Discovery
        endpoints = serviceResolver.resolve(route.targetService)
        if endpoints.isEmpty():
            result.response = error(503, "Service Unavailable - No healthy instances")
            return result.response

        targetEndpoint = loadBalancer.select(endpoints)

        // 6. Upstream Invocation with Bounded Deadline & Circuit Breaker
        result.response = proxyClient.forward(
            request,
            targetEndpoint,
            deadline = route.timeoutMs
        )
        return result.response

    catch UpstreamTimeoutException:
        result.response = error(504, "Gateway Timeout")
        return result.response

    catch UpstreamConnectionException:
        result.response = error(502, "Bad Gateway")
        return result.response

    finally:
        // Non-blocking telemetry emission ensures logs never crash or delay user traffic
        try:
            telemetryRecorder.record(result, duration = now() - startTime)
        catch TelemetryException:
            incrementLocalTelemetryFailureCounter()</pre>
          </div>
        </div>

      </div>
    `
  };
}

// =========================================================================
// IMPORTANT ALGORITHMS AND DESIGN PATTERNS
// =========================================================================
export function getApiGatewayAlgorithmsSection() {
  return {
    badge: "ALGORITHMS & PATTERNS",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    title: "Important Algorithms and Design Patterns",
    content: `
      <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
        <p class="text-[13.5px] leading-relaxed">
          An API Gateway is a composite system relying on a tight set of battle-tested algorithms. Do not overcomplicate the design with unneeded distributed consensus; focus on these core patterns that resolve latency, traffic control, and fault isolation.
        </p>

        <!-- 6 ALGORITHM DETAIL CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- Card 1: Reverse Proxy Pattern -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
            <span class="font-bold text-[13.5px] text-cyan-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">alt_route</span>
              Reverse Proxy Pattern
            </span>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Accepts client requests at a unified public facade, terminates client TLS, hides internal network topologies, and proxies traffic to private backend microservices.
            </p>
            <div class="p-2.5 rounded bg-cyan-950/40 border border-cyan-900/50 text-[11.5px] text-cyan-300 font-mono">
              Client &rarr; [Public Facade] &rarr; [Private Microservices]
            </div>
            <div class="text-[11.5px] text-slate-400">
              <strong>Trade-off:</strong> Centralizes authentication and traffic shaping, but adds a single network hop and creates an ingress tier that must be scaled horizontally.
            </div>
          </div>

          <!-- Card 2: Load Balancing Algorithms -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
            <span class="font-bold text-[13.5px] text-emerald-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">balance</span>
              Backend Load Balancing Algorithms
            </span>
            <div class="text-[12px] space-y-1.5 text-slate-300">
              <div><strong>Round Robin:</strong> Sequential dispatch across healthy nodes. Best for uniform stateless requests.</div>
              <div><strong>Least Connections:</strong> Routes to instances with fewest open sockets. Best for variable request durations.</div>
              <div><strong>Weighted Routing:</strong> Dispatches based on host capacity. Ideal for canary deployments and rolling upgrades.</div>
              <div><strong>Consistent Hashing:</strong> Hashes key (e.g. <code>userId</code>) to target instance for cache affinity.</div>
            </div>
            <div class="p-2.5 rounded bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300">
              &bull; Default recommendation: Health-aware Round Robin or Least Connections.
            </div>
          </div>

          <!-- Card 3: Token-Bucket Rate Limiting -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
            <span class="font-bold text-[13.5px] text-purple-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">speed</span>
              Token-Bucket Rate Limiting
            </span>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Maintains a bucket of capacity $C$ refilled at $R$ tokens/second. Each request consumes 1 token. Requests encountering an empty bucket are rejected immediately with HTTP 429.
            </p>
            <div class="p-2.5 rounded bg-purple-950/40 border border-purple-900/50 text-[11.5px] text-purple-300 font-mono">
              tokens = min(C, tokens + (now - lastRefill) * R)
            </div>
            <div class="text-[11.5px] text-slate-400">
              <strong>Local vs. Global:</strong> Local in-memory buckets add 0ms network latency. Global quotas require Redis Cluster coordination, which adds network hops and fail-open/closed dilemmas.
            </div>
          </div>

          <!-- Card 4: Circuit Breaker State Machine -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
            <span class="font-bold text-[13.5px] text-rose-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">electric_bolt</span>
              Circuit Breaker (Closed &rarr; Open &rarr; Half-Open)
            </span>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Prevents a slow or crashing backend service from exhausting gateway threads and connection pools.
            </p>
            <div class="text-[11.5px] text-slate-300 space-y-1">
              <div><strong>Closed:</strong> Normal execution. Tracks upstream error rate.</div>
              <div><strong>Open:</strong> Threshold exceeded (&gt;50% failures). Fails fast immediately with 503.</div>
              <div><strong>Half-Open:</strong> After cooldown (e.g. 15s), passes probe requests to test backend health.</div>
            </div>
            <div class="p-2.5 rounded bg-rose-950/40 border border-rose-900/50 text-[11px] text-rose-300">
              &bull; Prevents cascading thread exhaustion across the entire gateway cluster.
            </div>
          </div>

          <!-- Card 5: Timeouts, Retries & Idempotency -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
            <span class="font-bold text-[13.5px] text-amber-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">timer</span>
              Timeouts, Retries &amp; Idempotency
            </span>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Every upstream call MUST have an explicit deadline (e.g. 2000ms). Never retry non-idempotent mutations (POST /orders) on timeout.
            </p>
            <div class="p-2.5 rounded bg-amber-950/40 border border-amber-900/50 text-[11.5px] text-amber-300 font-mono">
              Retry Rule: Safe for idempotent reads (GET) with exponential backoff + full jitter &bull; Bound retry budget (&le;20%)
            </div>
            <div class="text-[11.5px] text-slate-400">
              <strong>Crucial:</strong> A timeout does NOT mean backend failure; the order may already have been processed. Retrying without an Idempotency-Key causes double charges!
            </div>
          </div>

          <!-- Card 6: Response Caching & Invalidation -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
            <span class="font-bold text-[13.5px] text-teal-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">memory</span>
              Gateway Response Caching
            </span>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Caches eligible public responses (e.g. <code>GET /api/products/P100</code>) in gateway memory to reduce backend CPU and network hops.
            </p>
            <div class="p-2.5 rounded bg-teal-950/40 border border-teal-900/50 text-[11.5px] text-teal-300 font-mono">
              Cache Key: hash(HTTP Method + Route + QueryParams + AcceptedEncoding)
            </div>
            <div class="text-[11.5px] text-slate-400">
              <strong>Security Rule:</strong> Never cache authenticated responses containing <code>Authorization</code> or sensitive user profiles without strict <code>Cache-Control: private</code> controls.
            </div>
          </div>

        </div>

      </div>
    `
  };
}

// =========================================================================
// SCALABILITY, RELIABILITY & ARCHITECTURAL TRADE-OFFS
// =========================================================================
export function getApiGatewayScalabilitySection() {
  return {
    badge: "SCALABILITY & RESILIENCE",
    badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
    title: "Scalability, Reliability & Architectural Trade-offs",
    content: `
      <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
        <p class="text-[13.5px] leading-relaxed">
          The overarching goal when scaling an API Gateway is to achieve linear horizontal scaling without introducing a bottleneck or shared point of failure on the critical request path.
        </p>

        <!-- Horizontal Scaling Architecture Diagram -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] p-5 shadow-lg overflow-x-auto">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-indigo-400 text-[20px]">layers</span>
              <strong class="text-[14px] font-bold text-white">Horizontal Scaling Blueprint &bull; Stateless Gateway Tier</strong>
            </div>
            <span class="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/60">Horizontal Tier</span>
          </div>

          <svg viewBox="0 0 860 220" class="w-full max-w-[820px] h-auto min-w-[640px] select-none mx-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="sc-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#818CF8"/>
              </marker>
            </defs>

            <!-- Clients -->
            <rect x="20" y="70" width="160" height="75" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.8"/>
            <text x="100" y="103" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#F8FAFC" text-anchor="middle">Clients</text>
            <text x="100" y="123" font-family="Geist, sans-serif" font-size="10.5" fill="#94A3B8" text-anchor="middle">Web &bull; Mobile &bull; 9,300 RPS</text>

            <line x1="180" y1="107" x2="238" y2="107" stroke="#818CF8" stroke-width="2" marker-end="url(#sc-arr)"/>

            <!-- Load Balancer -->
            <rect x="250" y="55" width="170" height="105" rx="10" fill="#0C4A6E" stroke="#0284C7" stroke-width="2"/>
            <text x="335" y="88" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#E0F2FE" text-anchor="middle">Load Balancer</text>
            <text x="335" y="108" font-family="Geist, sans-serif" font-size="10.5" fill="#BAE6FD" text-anchor="middle">AWS ALB / NLB</text>
            <text x="335" y="126" font-family="Geist Mono, monospace" font-size="9" fill="#7DD3FC" text-anchor="middle">Health-Checked</text>

            <!-- Gateway Fleet (3 stacked instances) -->
            <rect x="490" y="25" width="170" height="50" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.6"/>
            <text x="575" y="55" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#ECFDF5" text-anchor="middle">Gateway Instance A</text>

            <rect x="490" y="85" width="170" height="50" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.6"/>
            <text x="575" y="115" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#ECFDF5" text-anchor="middle">Gateway Instance B</text>

            <rect x="490" y="145" width="170" height="50" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.6"/>
            <text x="575" y="175" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#ECFDF5" text-anchor="middle">Gateway Instance C</text>

            <path d="M 420 85 L 455 85 L 455 50 L 478 50" fill="none" stroke="#818CF8" stroke-width="1.8" marker-end="url(#sc-arr)"/>
            <path d="M 420 107 L 478 107" fill="none" stroke="#818CF8" stroke-width="1.8" marker-end="url(#sc-arr)"/>
            <path d="M 420 130 L 455 130 L 455 170 L 478 170" fill="none" stroke="#818CF8" stroke-width="1.8" marker-end="url(#sc-arr)"/>

            <line x1="660" y1="50" x2="718" y2="50" stroke="#10B981" stroke-width="1.8" marker-end="url(#sc-arr)"/>
            <line x1="660" y1="110" x2="718" y2="110" stroke="#10B981" stroke-width="1.8" marker-end="url(#sc-arr)"/>
            <line x1="660" y1="170" x2="718" y2="170" stroke="#10B981" stroke-width="1.8" marker-end="url(#sc-arr)"/>

            <!-- Backend Services -->
            <rect x="730" y="45" width="110" height="130" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.8"/>
            <text x="785" y="85" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#F8FAFC" text-anchor="middle">Backend</text>
            <text x="785" y="105" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#F8FAFC" text-anchor="middle">Services</text>
            <text x="785" y="130" font-family="Geist, sans-serif" font-size="9.5" fill="#94A3B8" text-anchor="middle">Microservices</text>
          </svg>
        </div>

        <!-- Collapsible Mermaid Source for Horizontal Scaling Flowchart -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
          <summary class="font-bold text-[12.5px] text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[18px]">code</span>
              View Mermaid.js Source Definition (Horizontal Scaling Tier)
            </span>
            <span class="text-[11px] font-mono text-slate-500 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">flowchart TB
    C[Clients] --&gt; LB[Load Balancer]
    LB --&gt; G1[Gateway Instance A]
    LB --&gt; G2[Gateway Instance B]
    LB --&gt; G3[Gateway Instance C]

    G1 --&gt; B[Backend Services]
    G2 --&gt; B
    G3 --&gt; B</pre>
        </details>

        <!-- Scalability & Reliability Techniques Table -->
        <div class="flex flex-col gap-3">
          <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[19px]">tune</span>
            Scalability &amp; Reliability Framework Matrix
          </h4>
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/4">Technique</th>
                  <th class="py-3 px-4 w-1/2">Application to API Gateway</th>
                  <th class="py-3 px-4 w-1/4">Design Priority</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Horizontal Scaling</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Run multiple stateless gateway instances behind an L4/L7 load balancer across multi-AZs.</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Essential</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Route Caching</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Keep active route definitions in in-memory prefix tries to ensure sub-millisecond route resolution.</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Essential</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Load Balancing</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Spread client requests across healthy gateway nodes and balance outbound calls across backend replicas.</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Essential</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Rate Limiting &amp; Backpressure</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Cap max in-flight requests per backend and reject traffic spikes with 429/503 before queue starvation.</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Essential</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Asynchronous Telemetry</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Buffer access logs and trace spans into non-blocking memory queues, exporting out-of-band.</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Essential</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Multi-AZ Replication</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Distribute instances evenly across 3 Availability Zones to survive catastrophic datacenter loss.</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Essential</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Response Caching</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Cache safe, read-only public endpoints (e.g. catalog queries) with strict Cache-Control validation.</td>
                  <td class="py-2.5 px-4 text-slate-500 font-semibold">Optional Optimization</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Rate-Limit State Partitioning</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Partition Redis rate-limit keys by tenant or client ID hash slot when global state scales past 100K RPS.</td>
                  <td class="py-2.5 px-4 text-slate-500 font-semibold">Optional at High Scale</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3 In-Depth Subsections -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12.5px]">
          
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <strong class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-blue-500 text-[18px]">trending_up</span>
              Autoscaling Metrics
            </strong>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Never autoscale on CPU alone.</strong> An API Gateway is frequently I/O- and network-bound. Scale on:
            </p>
            <ul class="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
              <li>Active concurrent connections.</li>
              <li>Network bandwidth utilization (MB/s).</li>
              <li>p99 request latency degradation.</li>
              <li>CPU utilization (&gt;65% target).</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <strong class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-purple-500 text-[18px]">cached</span>
              Two Separate Caching Tiers
            </strong>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
              Keep the two caching strategies strictly segregated:
            </p>
            <ul class="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
              <li><strong>Config Cache:</strong> In-memory route table snapshot. If config DB fails, gateway continues operating normally.</li>
              <li><strong>Response Cache:</strong> Optional LRU RAM cache for static responses. Must respect <code>Vary</code> and <code>Cache-Control</code>.</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <strong class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
              Reliability Targets (SLOs)
            </strong>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
              Define concrete production recovery targets:
            </p>
            <ul class="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
              <li><strong>Gateway Added Latency:</strong> &le; 2ms at p99.</li>
              <li><strong>Data Plane Availability:</strong> 99.99% (&lt; 4.38 mins downtime/month).</li>
              <li><strong>RTO (Recovery Time):</strong> &lt; 30 seconds via auto-healing.</li>
              <li><strong>RPO (Config Data Loss):</strong> 0 data loss (persisted in DB).</li>
            </ul>
          </div>

        </div>

      </div>
    `
  };
}

// =========================================================================
// FAILURE SCENARIOS, DETECTION & MITIGATION MATRIX
// =========================================================================
export function getApiGatewayFailureScenariosSection() {
  return {
    badge: "FAULT TOLERANCE",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    title: "Failure Scenarios, Detection & Mitigation Matrix",
    content: `
      <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
        <p class="text-[13.5px] leading-relaxed">
          Production distributed systems fail continuously. An enterprise API Gateway must detect degradation immediately, contain the blast radius, and recover predictably without dragging down unaffected microservices.
        </p>

        <!-- Failure Scenarios Matrix Table -->
        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
          <table class="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                <th class="py-3 px-4">Failure Scenario</th>
                <th class="py-3 px-4">Detection Mechanism</th>
                <th class="py-3 px-4">Mitigation &amp; Automated Recovery</th>
                <th class="py-3 px-4">System Limitation / Residual Risk</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Gateway instance crashes</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Load balancer health checks fail (HTTP <code>/health</code> socket timeout).</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Load balancer immediately drops instance from rotation; autoscaling group provisions fresh node.</td>
                <td class="py-2.5 px-4 text-rose-500 font-semibold">Active in-flight TCP connections on that crashed instance are terminated.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Backend service unavailable</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Connection refused (ECONNREFUSED) or service discovery marks 0 healthy endpoints.</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Trip Circuit Breaker to OPEN; return immediate controlled HTTP 503 Service Unavailable.</td>
                <td class="py-2.5 px-4 text-amber-500 font-semibold">Gateway cannot restore missing business capability.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Backend service becomes slow</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Upstream latency spikes beyond p99 target; timeout rate rises.</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Enforce strict per-route timeouts (e.g. 2000ms); cap active connection pool; open circuit breaker.</td>
                <td class="py-2.5 px-4 text-slate-500">Slow requests are terminated early to protect gateway thread pools.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Shared rate-limit store fails</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Redis ping timeout (&gt;10ms) or connection pool exhaustion.</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Execute explicit <strong>fail-open policy</strong> with fallback local token bucket limits.</td>
                <td class="py-2.5 px-4 text-amber-500 font-semibold">Aggregate fleet traffic may temporarily exceed strict global quota limits.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Configuration update is invalid</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Schema validation parser fails or route regex verification throws syntax error.</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Reject configuration change in Control Plane; gateway fleet retains current valid in-memory snapshot.</td>
                <td class="py-2.5 px-4 text-slate-500">New route is blocked from activation until operator corrects config.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Configuration database fails</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">PostgreSQL connection timeout or primary replica crash.</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Gateway data plane is completely unaffected; continues serving traffic from cached in-memory snapshot.</td>
                <td class="py-2.5 px-4 text-slate-500">New route modifications cannot be published until DB restores.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Sudden extreme traffic spike</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Inbound RPS and concurrency metrics double within seconds.</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Local rate limiting drops over-quota traffic (429); gateway triggers priority load shedding.</td>
                <td class="py-2.5 px-4 text-slate-500">Autoscaling has a 1–3 min provisioning delay; rate limiting must absorb the initial spike.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Entire AWS Availability Zone fails</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">AZ health checks fail; all gateway instances in that AZ become unresponsive.</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Route 53 / ALB cross-zone load balancing shifts 100% of traffic to surviving healthy AZs.</td>
                <td class="py-2.5 px-4 text-slate-500">Fleet headroom must be sized at 33–50% to absorb shifted AZ load without throttling.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Three Important Failure Decisions Deep-Dive Callout -->
        <div class="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col gap-3">
          <strong class="font-bold text-[14px] text-rose-900 dark:text-rose-300 flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-600 dark:text-rose-400 text-[19px]">psychology</span>
            Three Critical Interview Failure Decisions
          </strong>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
            <div class="p-3 rounded-lg bg-white dark:bg-[#0B1120] border border-rose-200/80 dark:border-rose-800/40 flex flex-col gap-1.5">
              <strong class="text-rose-700 dark:text-rose-400 font-bold">1. What if config distribution fails?</strong>
              <p class="text-slate-600 dark:text-slate-300">
                Never take down the data plane. The gateway instance continues running on its last known valid in-memory snapshot. Snapshots have version timestamps; if an instance falls more than $N$ hours behind, raise a high-severity alert.
              </p>
            </div>
            <div class="p-3 rounded-lg bg-white dark:bg-[#0B1120] border border-rose-200/80 dark:border-rose-800/40 flex flex-col gap-1.5">
              <strong class="text-rose-700 dark:text-rose-400 font-bold">2. What if a payment request times out?</strong>
              <p class="text-slate-600 dark:text-slate-300">
                <strong>Never blindly retry POST payments!</strong> The backend may have completed the transaction but failed while writing the response packet. Return HTTP 504 with an order reference; clients query an idempotent status reconciliation endpoint.
              </p>
            </div>
            <div class="p-3 rounded-lg bg-white dark:bg-[#0B1120] border border-rose-200/80 dark:border-rose-800/40 flex flex-col gap-1.5">
              <strong class="text-rose-700 dark:text-rose-400 font-bold">3. What if traffic exceeds capacity?</strong>
              <p class="text-slate-600 dark:text-slate-300">
                Apply aggressive load shedding at the edge. Prioritize critical revenue paths (checkout) while rejecting non-essential telemetry and analytics queries with HTTP 503. Preserves health for accepted traffic instead of crashing all systems.
              </p>
            </div>
          </div>
        </div>

      </div>
    `
  };
}

// =========================================================================
// SECURITY ARCHITECTURE & OBSERVABILITY FRAMEWORK
// =========================================================================
export function getApiGatewaySecurityObservabilitySection() {
  return {
    badge: "SECURITY & OPS",
    badgeColor: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
    title: "Security Architecture & Observability Framework",
    content: `
      <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
        
        <!-- Security Design Matrix -->
        <div class="flex flex-col gap-3">
          <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[19px]">security</span>
            Gateway Security Architecture
          </h4>
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/4">Security Dimension</th>
                  <th class="py-3 px-4 w-3/4">Implementation Standard &amp; Production Controls</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Transport Security</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Enforce TLS 1.3 exclusively on client ingress; internally, utilize mutual TLS (mTLS) with SPIFFE/SPIRE workload identities between gateway and backend pods.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Authentication &amp; Tokens</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Validate JWT signatures, expiration (<code>exp</code>), and issuer (<code>iss</code>) locally via cached JWKS public keys. Never make remote IdP calls per request.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Header Sanitization</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Strip any client-provided identity headers (e.g. <code>X-User-ID</code>, <code>X-Roles</code>) before forwarding. Re-inject authoritative claims verified from the token.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Input Validation &amp; WAF</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Enforce max body sizes (&le; 2 MB default), sanitize URI path traversals, validate JSON schemas, and attach AWS WAF rules to block SQLi/XSS at ingress.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Credential Handling</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Store admin database credentials in AWS Secrets Manager / HashiCorp Vault with automated 30-day rotation. Never print Bearer tokens or API keys in logs.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Observability Framework Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          
          <!-- Core Golden Signals & Metrics -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 text-[12.5px]">
            <strong class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-blue-500 text-[18px]">monitoring</span>
              Observability: The 4 Golden Signals
            </strong>
            <ul class="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li><strong>Latency:</strong> Measure gateway overhead separately from upstream response time (track p50, p95, p99 histograms).</li>
              <li><strong>Traffic:</strong> Inbound requests/sec per route template (e.g. <code>/api/orders/{id}</code>) to avoid metric label explosion.</li>
              <li><strong>Errors:</strong> Segregate 4xx client errors (401, 404, 429) from 5xx gateway/upstream faults (502, 503, 504).</li>
              <li><strong>Saturation:</strong> Active TCP connections, thread pool utilization, and pending async telemetry buffer depth.</li>
            </ul>
          </div>

          <!-- Production Alerting Thresholds -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 text-[12.5px]">
            <strong class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-rose-500 text-[18px]">notifications_active</span>
              Critical Production Alerts
            </strong>
            <ul class="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li><strong>SLO Breach Alert:</strong> Gateway added latency &gt; 5ms for &gt; 2 mins (P1 Page).</li>
              <li><strong>5xx Spike:</strong> Rate of 502/503/504 exceeds 1% of total traffic.</li>
              <li><strong>Circuit Breaker Tripped:</strong> Any backend route enters OPEN state for &gt; 1 minute.</li>
              <li><strong>Config Drift:</strong> Any gateway instance running a configuration version older than current active version for &gt; 5 mins.</li>
            </ul>
          </div>

        </div>

      </div>
    `
  };
}

// =========================================================================
// FINAL REVISION SUMMARY & KEY TAKEAWAYS
// =========================================================================
export function getApiGatewayFinalSummarySection() {
  return [
    {
      badge: "SUMMARY BLUEPRINT",
      badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
      title: "Final Revision Summary & Key Takeaways",
      content: `
        <div class="flex flex-col gap-5">
          
          <!-- Compact Architecture Summary -->
          <div class="flex flex-col gap-3">
            <h5 class="font-bold text-[14.5px] text-slate-900 dark:text-white">
              Compact Architecture Summary
            </h5>

            <div class="max-w-[760px] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-6 sm:p-8 shadow-xs flex flex-col items-center gap-3.5 mx-auto">
              <!-- Tier 1: Clients -->
              <div class="flex flex-col items-center justify-center gap-1.5 py-1">
                <span class="material-symbols-outlined text-slate-800 dark:text-slate-200 text-[26px]">smartphone</span>
                <span class="font-bold text-[15px] text-slate-900 dark:text-white">Web and Mobile Clients</span>
              </div>

              <!-- Arrow -->
              <div class="text-slate-700 dark:text-slate-300 font-bold text-[17px] leading-none select-none my-0.5">&darr;</div>

              <!-- Tier 2: Load Balancer -->
              <div class="w-full py-4 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center shadow-xs">
                <div class="font-bold text-[15px] text-slate-900 dark:text-white">Highly Available Load Balancer</div>
                <div class="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">Health checks and traffic distribution</div>
              </div>

              <!-- Arrow -->
              <div class="text-slate-700 dark:text-slate-300 font-bold text-[17px] leading-none select-none my-0.5">&darr;</div>

              <!-- Tier 3: API Gateway Fleet (Highlighted Container) -->
              <div class="w-full rounded-xl border border-blue-200/90 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/25 text-center overflow-hidden shadow-xs">
                <div class="py-4 px-5">
                  <div class="font-bold text-[15.5px] text-slate-900 dark:text-white">API Gateway Fleet</div>
                  <div class="text-[12.5px] text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Routing &bull; Authentication &bull; Authorization &bull; Rate limiting &bull; Timeouts &bull; Circuit breakers
                  </div>
                </div>
                <div class="w-full border-t border-blue-200/70 dark:border-blue-800/40"></div>
                <div class="py-3 px-5 text-[12.5px] text-slate-600 dark:text-slate-400">
                  Local configuration snapshots and healthy endpoint information
                </div>
              </div>

              <!-- Arrow -->
              <div class="text-slate-700 dark:text-slate-300 font-bold text-[17px] leading-none select-none my-0.5">&darr;</div>

              <!-- Tier 4: Microservices Grid -->
              <div class="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div class="py-4 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center flex flex-col items-center justify-center gap-1.5 shadow-xs">
                  <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-[22px]">group</span>
                  <div class="font-bold text-[13.5px] text-slate-900 dark:text-white">User Service</div>
                </div>
                <div class="py-4 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center flex flex-col items-center justify-center gap-1.5 shadow-xs">
                  <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-[22px]">shopping_cart</span>
                  <div class="font-bold text-[13.5px] text-slate-900 dark:text-white">Order Service</div>
                </div>
                <div class="py-4 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center flex flex-col items-center justify-center gap-1.5 shadow-xs">
                  <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-[22px]">credit_card</span>
                  <div class="font-bold text-[13.5px] text-slate-900 dark:text-white">Payment Service</div>
                </div>
              </div>

              <!-- Horizontal Separator -->
              <div class="w-full border-t border-slate-200 dark:border-slate-800 my-1"></div>

              <!-- Supporting Components footer -->
              <div class="w-full text-center flex flex-col items-center gap-1 pt-1">
                <div class="font-bold text-[14px] text-slate-900 dark:text-white">Supporting components</div>
                <div class="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[620px]">
                  Configuration Service and Database &bull; Service Discovery &bull; Optional Shared Rate-Limit Store &bull; Logs, Metrics and Tracing
                </div>
              </div>
            </div>

            <p class="text-[13px] text-slate-600 dark:text-slate-400 italic mt-1">
              The central principle is to keep the request path fast and resilient while managing configuration separately.
            </p>
          </div>

          <!-- Ten Points to Remember -->
          <div class="flex flex-col gap-3 mt-4">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h5 class="font-bold text-[14.5px] text-slate-900 dark:text-white">
                The Ten Points to Remember in the Interview
              </h5>
              <div class="flex items-center gap-3">
                <span id="gw-points-counter" class="text-[12px] font-mono font-bold text-cyan-600 dark:text-cyan-400">0 of 10 reviewed</span>
                <button type="button" 
                  class="text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  onclick="
                    const parent = this.closest('.masterclass-question-view') || document;
                    parent.querySelectorAll('.gw-point-check').forEach(c => c.checked = false);
                    const counter = document.getElementById('gw-points-counter');
                    if (counter) counter.textContent = '0 of 10 reviewed';
                  ">
                  Reset
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              ${[
                "An API Gateway provides a common entry point for client API traffic.",
                "Separate the data plane from the control plane completely.",
                "Keep active routing configuration in memory instead of querying a database on every request.",
                "Use multiple gateway instances and a highly available load-balancing layer.",
                "Apply authentication, authorization, validation, and appropriate rate limits.",
                "Use health-aware backend selection, bounded timeouts, and circuit breakers.",
                "Do not blindly retry non-idempotent operations; enforce idempotency where required.",
                "Cache only responses with correct freshness, authorization, and invalidation rules.",
                "Protect against overload with connection limits, bounded concurrency, and load shedding.",
                "Monitor latency, errors, throughput, configuration health, and recovery behavior."
              ].map((pt, i) => `
                <label class="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors shadow-2xs">
                  <input type="checkbox" class="gw-point-check mt-1 rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500" 
                    onchange="
                      const parent = this.closest('.masterclass-question-view') || document;
                      const checked = parent.querySelectorAll('.gw-point-check:checked').length;
                      const counter = document.getElementById('gw-points-counter');
                      if (counter) counter.textContent = checked + ' of 10 reviewed';
                    "/>
                  <span class="text-[13px] text-slate-700 dark:text-slate-300 leading-snug">
                    <strong class="text-slate-900 dark:text-white">${i + 1}.</strong> ${pt}
                  </span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Practice Checklist -->
          <div class="flex flex-col gap-3 mt-4">
            <div class="flex flex-col gap-1">
              <h5 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[19px]">task_alt</span>
                Practice checklist
              </h5>
              <p class="text-[13px] text-slate-600 dark:text-slate-400">
                Use this checklist to practice the design independently.
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-6 shadow-xs flex flex-col gap-4">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <strong class="text-[14px] font-bold text-slate-900 dark:text-white">Interview readiness</strong>
                <span id="gw-readiness-counter" class="text-[13px] font-medium text-slate-500 dark:text-slate-400">0 of 10</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${[
                  "Explain the problem and scope in under two minutes.",
                  "Estimate average and peak RPS.",
                  "Define representative APIs and the configuration data model.",
                  "Draw the HLD with the data plane, control plane, and backend services.",
                  "Explain a successful request and a rejected request.",
                  "Describe how configuration reaches gateway instances.",
                  "Explain local versus global rate limiting.",
                  "Handle at least five failure scenarios with concrete mitigations.",
                  "Compare managed versus self-managed gateways and local versus shared state.",
                  "Discuss the trade-offs of retries, caching, multi-zone deployment, and regional failover."
                ].map((item) => `
                  <label class="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <input type="checkbox" class="gw-readiness-check mt-1 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500" 
                      onchange="
                        const parent = this.closest('.masterclass-question-view') || document;
                        const total = parent.querySelectorAll('.gw-readiness-check').length;
                        const checked = parent.querySelectorAll('.gw-readiness-check:checked').length;
                        const counter = document.getElementById('gw-readiness-counter');
                        if (counter) counter.textContent = checked + ' of ' + total;
                      "/>
                    <span class="text-[13.5px] text-slate-700 dark:text-slate-300 leading-snug">
                      ${item}
                    </span>
                  </label>
                `).join('')}
              </div>

              <!-- Final Interview Takeaway Callout -->
              <div class="mt-2 p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 flex flex-col gap-2">
                <span class="font-bold text-[13px] text-purple-900 dark:text-purple-300">Final interview takeaway</span>
                <p class="text-[12.5px] text-purple-950 dark:text-purple-200 leading-relaxed">
                  Keep the gateway request path fast, scale it horizontally, separate configuration management from request processing, and prevent retries or slow backends from overwhelming the system.<br/><br/>
                  <em>A strong design is not the one with the most components. It is the simplest architecture that satisfies the requirements, explains its assumptions, and handles failures realistically.</em>
                </p>
              </div>
            </div>
          </div>

        </div>
      `
    }
  ];
}
