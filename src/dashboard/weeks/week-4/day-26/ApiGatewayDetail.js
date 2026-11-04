/**
 * Question 5. Design an API Gateway
 * System Design Interview Guide · HLD · LLD · Capacity Estimation · Scalability · Failure Handling
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';
import {
  getApiGatewayHldSection,
  getApiGatewayDataModelSection,
  getApiGatewayLldSection,
  getApiGatewayAlgorithmsSection,
  getApiGatewayScalabilitySection,
  getApiGatewayFailureScenariosSection,
  getApiGatewaySecurityObservabilitySection,
  getApiGatewayFinalSummarySection
} from './ApiGatewaySections.js';

export function renderApiGatewayDetail() {
  return renderMasterclassQuestion({
    questionNumber: 5,
    title: "Design an API Gateway",
    moduleName: "Module 1 — Core System Design",
    coreTopics: "HLD · LLD · Rate Limiting · Policy Enforcement · Observability",

    problemStatement: `
      <div class="flex flex-col gap-4">
        <p class="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">
          An <strong>API Gateway</strong> is a common entry point for client requests to backend services. It routes requests to the appropriate service and applies shared policies such as authentication, rate limiting, request validation, and timeout handling.<br/><br/>
          Without a gateway, clients may need to know the addresses of multiple backend services and implement common security and traffic-handling logic independently.
        </p>

        <!-- Real-world Example Box -->
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <h4 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-[18px]">storefront</span>
            Real-world Example
          </h4>
          <p class="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
            Consider an e-commerce application with three distinct microservices:
          </p>
          <ul class="text-[12.5px] text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside pl-1">
            <li><strong>User Service:</strong> Manages user profiles and authentication context.</li>
            <li><strong>Order Service:</strong> Manages order placement and history.</li>
            <li><strong>Payment Service:</strong> Processes credit card and wallet payments.</li>
          </ul>
          <p class="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
            A mobile application requests order details using <code>GET /api/orders/123</code>. The API Gateway validates the request, checks the user's identity and permissions, applies rate limits, forwards the request to the Order Service, and returns its response. The mobile application does not need to know the Order Service's internal network address.
          </p>

          <!-- Without vs With API Gateway Comparison Cards with Hand-Drawn Architecture SVGs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            <!-- Without an API Gateway -->
            <div class="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col gap-3">
              <strong class="text-rose-700 dark:text-rose-400 text-[13px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[17px]">cancel</span>
                Without an API Gateway (Direct Client-to-Service)
              </strong>
              <div class="rounded-lg overflow-hidden border border-rose-200/80 dark:border-rose-900/60 bg-[#070B14] p-2 shadow-xs">
                <svg viewBox="0 0 520 330" class="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arr-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#F43F5E"/>
                    </marker>
                    <marker id="arr-db" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#94A3B8"/>
                    </marker>
                  </defs>

                  <!-- Title Banner -->
                  <rect x="15" y="8" width="490" height="24" rx="4" fill="#4C0519" stroke="#E11D48" stroke-width="1"/>
                  <text x="260" y="24" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#FFE4E6" text-anchor="middle">Direct Client-to-Service Communication</text>

                  <!-- Group 1: Client Apps dashed boundary -->
                  <rect x="15" y="38" width="95" height="280" rx="8" stroke="#64748B" stroke-dasharray="4,4" fill="none" stroke-width="1.2"/>
                  <text x="62" y="52" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#94A3B8" text-anchor="middle">Client Apps</text>

                  <!-- Web Client -->
                  <rect x="25" y="65" width="75" height="90" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
                  <circle cx="62" cy="92" r="12" fill="#334155" stroke="#64748B"/>
                  <path d="M 47 116 A 15 15 0 0 1 77 116 Z" fill="#334155" stroke="#64748B"/>
                  <text x="62" y="136" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#F8FAFC" text-anchor="middle">Web</text>

                  <!-- Mobile Client -->
                  <rect x="25" y="185" width="75" height="110" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
                  <circle cx="62" cy="215" r="12" fill="#334155" stroke="#64748B"/>
                  <path d="M 47 239 A 15 15 0 0 1 77 239 Z" fill="#334155" stroke="#64748B"/>
                  <rect x="52" y="250" width="20" height="26" rx="3" fill="#0F172A" stroke="#475569" stroke-width="1"/>
                  <circle cx="62" cy="272" r="1.5" fill="#94A3B8"/>
                  <text x="62" y="286" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#F8FAFC" text-anchor="middle">Mobile</text>

                  <!-- Red Chaos / Coupling Box -->
                  <rect x="20" y="58" width="315" height="252" rx="8" stroke="#E11D48" stroke-width="1.8" fill="#E11D48" fill-opacity="0.04"/>

                  <!-- Group 2: Microservices dashed boundary -->
                  <rect x="215" y="38" width="115" height="280" rx="8" stroke="#64748B" stroke-dasharray="4,4" fill="none" stroke-width="1.2"/>
                  <text x="272" y="52" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#94A3B8" text-anchor="middle">Microservices</text>

                  <!-- Product Service -->
                  <rect x="225" y="65" width="95" height="42" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.4"/>
                  <text x="272" y="90" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#F8FAFC" text-anchor="middle">Product</text>

                  <!-- Shopping Cart Service -->
                  <rect x="225" y="125" width="95" height="42" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.4"/>
                  <text x="272" y="150" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#F8FAFC" text-anchor="middle">Shopping Cart</text>

                  <!-- Discount Service -->
                  <rect x="225" y="185" width="95" height="42" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.4"/>
                  <text x="272" y="210" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#F8FAFC" text-anchor="middle">Discount</text>

                  <!-- Ordering Service -->
                  <rect x="225" y="245" width="95" height="42" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.4"/>
                  <text x="272" y="270" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#F8FAFC" text-anchor="middle">Ordering</text>

                  <!-- Spiderweb Connections: Web (100, 110) to 4 Microservices -->
                  <line x1="100" y1="105" x2="220" y2="83" stroke="#F43F5E" stroke-width="1.4" marker-end="url(#arr-rose)"/>
                  <line x1="100" y1="110" x2="220" y2="140" stroke="#F43F5E" stroke-width="1.4" marker-end="url(#arr-rose)"/>
                  <line x1="100" y1="115" x2="220" y2="198" stroke="#F43F5E" stroke-width="1.4" marker-end="url(#arr-rose)"/>
                  <line x1="100" y1="120" x2="220" y2="258" stroke="#F43F5E" stroke-width="1.4" marker-end="url(#arr-rose)"/>

                  <!-- Spiderweb Connections: Mobile (100, 240) to 4 Microservices -->
                  <line x1="100" y1="235" x2="220" y2="92" stroke="#F43F5E" stroke-width="1.4" marker-end="url(#arr-rose)"/>
                  <line x1="100" y1="240" x2="220" y2="152" stroke="#F43F5E" stroke-width="1.4" marker-end="url(#arr-rose)"/>
                  <line x1="100" y1="245" x2="220" y2="210" stroke="#F43F5E" stroke-width="1.4" marker-end="url(#arr-rose)"/>
                  <line x1="100" y1="250" x2="220" y2="270" stroke="#F43F5E" stroke-width="1.4" marker-end="url(#arr-rose)"/>

                  <!-- Group 3: Databases (Far Right) -->
                  <!-- Product DB -->
                  <line x1="320" y1="86" x2="368" y2="86" stroke="#64748B" stroke-width="1.4" marker-end="url(#arr-db)"/>
                  <g transform="translate(372, 66)">
                    <path d="M 0 8 L 0 32 A 20 6 0 0 0 40 32 L 40 8 Z" fill="#1E293B" stroke="#64748B" stroke-width="1.2"/>
                    <ellipse cx="20" cy="8" rx="20" ry="6" fill="#334155" stroke="#64748B" stroke-width="1.2"/>
                    <text x="20" y="24" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#CBD5E1" text-anchor="middle">NoSQL</text>
                    <text x="75" y="16" font-family="Geist, sans-serif" font-size="9" fill="#94A3B8">NoSQL</text>
                    <text x="75" y="28" font-family="Geist, sans-serif" font-size="8.5" fill="#64748B">Document</text>
                  </g>

                  <!-- Shopping Cart DB -->
                  <line x1="320" y1="146" x2="368" y2="146" stroke="#64748B" stroke-width="1.4" marker-end="url(#arr-db)"/>
                  <g transform="translate(372, 126)">
                    <path d="M 0 8 L 0 32 A 20 6 0 0 0 40 32 L 40 8 Z" fill="#1E293B" stroke="#64748B" stroke-width="1.2"/>
                    <ellipse cx="20" cy="8" rx="20" ry="6" fill="#334155" stroke="#64748B" stroke-width="1.2"/>
                    <text x="20" y="24" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#CBD5E1" text-anchor="middle">NoSQL</text>
                    <text x="75" y="16" font-family="Geist, sans-serif" font-size="9" fill="#94A3B8">NoSQL</text>
                    <text x="75" y="28" font-family="Geist, sans-serif" font-size="8.5" fill="#64748B">Key-Value</text>
                  </g>

                  <!-- Discount DB -->
                  <line x1="320" y1="206" x2="368" y2="206" stroke="#64748B" stroke-width="1.4" marker-end="url(#arr-db)"/>
                  <g transform="translate(372, 186)">
                    <path d="M 0 8 L 0 32 A 20 6 0 0 0 40 32 L 40 8 Z" fill="#1E293B" stroke="#64748B" stroke-width="1.2"/>
                    <ellipse cx="20" cy="8" rx="20" ry="6" fill="#334155" stroke="#64748B" stroke-width="1.2"/>
                    <text x="20" y="24" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#CBD5E1" text-anchor="middle">RDB</text>
                    <text x="75" y="22" font-family="Geist, sans-serif" font-size="9" fill="#94A3B8">Relational</text>
                  </g>

                  <!-- Ordering DB -->
                  <line x1="320" y1="266" x2="368" y2="266" stroke="#64748B" stroke-width="1.4" marker-end="url(#arr-db)"/>
                  <g transform="translate(372, 246)">
                    <path d="M 0 8 L 0 32 A 20 6 0 0 0 40 32 L 40 8 Z" fill="#1E293B" stroke="#64748B" stroke-width="1.2"/>
                    <ellipse cx="20" cy="8" rx="20" ry="6" fill="#334155" stroke="#64748B" stroke-width="1.2"/>
                    <text x="20" y="24" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#CBD5E1" text-anchor="middle">RDB</text>
                    <text x="75" y="22" font-family="Geist, sans-serif" font-size="9" fill="#94A3B8">Relational</text>
                  </g>
                </svg>
              </div>
              <p class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Clients must understand multiple internal endpoints, handle differing protocols, and independently duplicate authentication, retry budgets, and SSL termination.
              </p>
            </div>

            <!-- With an API Gateway -->
            <div class="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex flex-col gap-3">
              <strong class="text-emerald-700 dark:text-emerald-400 text-[13px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[17px]">check_circle</span>
                With an API Gateway (Centralized Facade)
              </strong>
              <div class="rounded-lg overflow-hidden border border-emerald-200/80 dark:border-emerald-900/60 bg-[#070B14] p-2 shadow-xs">
                <svg viewBox="0 0 520 330" class="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="gw-arr-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#38BDF8"/>
                    </marker>
                    <marker id="gw-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#34D399"/>
                    </marker>
                    <marker id="gw-arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#A855F7"/>
                    </marker>
                    <marker id="gw-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#F59E0B"/>
                    </marker>
                  </defs>

                  <!-- Title Banner -->
                  <rect x="15" y="8" width="490" height="24" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
                  <text x="260" y="24" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#ECFDF5" text-anchor="middle">Centralized API Gateway Pattern</text>

                  <!-- Client Box -->
                  <rect x="20" y="140" width="75" height="52" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
                  <text x="57" y="171" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#F8FAFC" text-anchor="middle">Client</text>

                  <!-- Arrow: Client -> Gateway -->
                  <line x1="95" y1="166" x2="148" y2="166" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#gw-arr-cyan)"/>

                  <!-- API Gateway Box (Centralized facade) -->
                  <rect x="150" y="128" width="95" height="76" rx="10" fill="#0C4A6E" stroke="#0284C7" stroke-width="2"/>
                  <text x="197" y="163" font-family="Geist, sans-serif" font-size="12.5" font-weight="800" fill="#E0F2FE" text-anchor="middle">API</text>
                  <text x="197" y="180" font-family="Geist, sans-serif" font-size="12.5" font-weight="800" fill="#E0F2FE" text-anchor="middle">Gateway</text>

                  <!-- ================= TOP BRANCH: USER SERVICES ================= -->
                  <!-- Edge: Gateway -> Load Balancer (User) -->
                  <path d="M 245 150 L 285 150 L 285 80 L 308 80" fill="none" stroke="#A855F7" stroke-width="1.6" marker-end="url(#gw-arr-purple)"/>

                  <!-- Load Balancer (User) -->
                  <rect x="310" y="58" width="65" height="44" rx="6" fill="#2E1065" stroke="#7E22CE" stroke-width="1.4"/>
                  <text x="342" y="77" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#E9D5FF" text-anchor="middle">Load</text>
                  <text x="342" y="91" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#E9D5FF" text-anchor="middle">Balancer</text>

                  <!-- Edges: LB -> 3 User Services -->
                  <line x1="375" y1="72" x2="418" y2="48" stroke="#A855F7" stroke-width="1.3" marker-end="url(#gw-arr-purple)"/>
                  <line x1="375" y1="80" x2="418" y2="80" stroke="#A855F7" stroke-width="1.3" marker-end="url(#gw-arr-purple)"/>
                  <line x1="375" y1="88" x2="418" y2="112" stroke="#A855F7" stroke-width="1.3" marker-end="url(#gw-arr-purple)"/>

                  <!-- User Service Replicas -->
                  <rect x="420" y="34" width="85" height="28" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
                  <text x="462" y="52" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#F8FAFC" text-anchor="middle">User Service</text>

                  <rect x="420" y="66" width="85" height="28" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
                  <text x="462" y="84" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#F8FAFC" text-anchor="middle">User Service</text>

                  <rect x="420" y="98" width="85" height="28" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
                  <text x="462" y="116" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#F8FAFC" text-anchor="middle">User Service</text>

                  <!-- ================= MIDDLE BRANCH: PRODUCT SERVICES ================= -->
                  <!-- Edge: Gateway -> Load Balancer (Product) -->
                  <path d="M 245 170 L 285 170 L 285 195 L 308 195" fill="none" stroke="#10B981" stroke-width="1.6" marker-end="url(#gw-arr-green)"/>

                  <!-- Load Balancer (Product) -->
                  <rect x="310" y="173" width="65" height="44" rx="6" fill="#064E3B" stroke="#059669" stroke-width="1.4"/>
                  <text x="342" y="192" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#A7F3D0" text-anchor="middle">Load</text>
                  <text x="342" y="206" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#A7F3D0" text-anchor="middle">Balancer</text>

                  <!-- Edges: LB -> 2 Product Services -->
                  <line x1="375" y1="188" x2="418" y2="173" stroke="#10B981" stroke-width="1.3" marker-end="url(#gw-arr-green)"/>
                  <line x1="375" y1="202" x2="418" y2="217" stroke="#10B981" stroke-width="1.3" marker-end="url(#gw-arr-green)"/>

                  <!-- Product Service Replicas -->
                  <rect x="420" y="159" width="85" height="28" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
                  <text x="462" y="177" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#F8FAFC" text-anchor="middle">Product Service</text>

                  <rect x="420" y="203" width="85" height="28" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
                  <text x="462" y="221" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#F8FAFC" text-anchor="middle">Product Service</text>

                  <!-- ================= BOTTOM BRANCH: PAYMENT SERVICE ================= -->
                  <!-- Edge: Gateway -> Payment Service -->
                  <path d="M 245 190 L 285 190 L 285 285 L 328 285" fill="none" stroke="#F59E0B" stroke-width="1.6" marker-end="url(#gw-arr-amber)"/>

                  <!-- Payment Service Box -->
                  <rect x="330" y="268" width="115" height="34" rx="6" fill="#451A03" stroke="#D97706" stroke-width="1.4"/>
                  <text x="387" y="289" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FEF3C7" text-anchor="middle">Payment Service</text>
                </svg>
              </div>
              <p class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Clients use one unified public entry point. The gateway terminates TLS, enforces token validation and rate limits, and routes traffic directly to healthy backend microservices.
              </p>
            </div>

          </div>
        </div>

        <!-- Design Objectives & Scope Assumption -->
        <div class="p-3.5 rounded-lg bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-800/50 text-[12.5px] text-cyan-950 dark:text-cyan-200 leading-relaxed">
          <strong>Design Objective:</strong> Build a highly available, low-latency API Gateway that routes requests to the correct backend, enforces security and traffic policies, protects backend services from cascading failures, scales horizontally, and allows routing configuration to change safely.<br/>
          <em>Scope Assumption:</em> We are designing an HTTP/HTTPS gateway for synchronous API requests. WebSockets, gRPC streaming, service-mesh functionality, and complex backend response aggregation are optional extensions rather than initial requirements.
        </div>
      </div>
    `,

    clarifyingQuestions: [
      { q: "Is the gateway responsible for synchronous HTTP/HTTPS requests only?", a: "Yes. Focus on an HTTP/HTTPS reverse proxy for microservices. WebSockets, gRPC, and message streaming can be addressed as secondary extensions." },
      { q: "What security policies belong at the gateway tier?", a: "TLS termination, client authentication (JWT verification), coarse route-level authorization, rate limiting, and request sanitization. Fine-grained business authorization remains in the microservices." },
      { q: "Must routing and security policies be updated dynamically without gateway restarts?", a: "Yes. Route and policy configurations must update out-of-band with versioned, atomic snapshots, ensuring zero downtime." },
      { q: "Should the gateway enforce global rate limits or local per-node limits?", a: "Start with high-speed local in-memory token buckets for standard DDoS and abuse protection. Provide an optional shared Redis Cluster for strict global tenant quotas." },
      { q: "What added latency budget is acceptable for the gateway tier?", a: "The gateway should add minimal overhead—typically sub-2ms processing latency at p99." }
    ],

    functionalRequirements: [
      "Request routing: Route requests using host, path, HTTP method, and configured rules.",
      "Authentication: Verify caller credentials or access tokens (JWT/OAuth2).",
      "Authorization: Enforce coarse route-level permission checks before forwarding.",
      "Rate limiting: Restrict excessive requests per client, user IP, or tenant tier.",
      "Load balancing: Distribute traffic across healthy backend service instances.",
      "Resilience: Apply bounded timeouts, limited retries with backoff, and circuit breakers.",
      "Configuration management: Add, update, validate, and roll back routes and policies safely.",
      "Observability: Collect access logs, golden signal metrics, and distributed trace headers."
    ],

    nonFunctionalRequirements: [
      "Availability: 99.99% availability; avoid a single gateway instance becoming a system-wide failure point.",
      "Performance: Ultra-low latency overhead; keep gateway-added processing under 2ms at p99.",
      "Scalability: Horizontal scaling to handle sudden traffic surges from 2,300 to 15,000+ RPS seamlessly.",
      "Security: Terminate TLS 1.3, scrub untrusted client headers, and protect sensitive credentials.",
      "Reliability: Isolate unhealthy backend services via circuit breakers to prevent retry storms.",
      "Configuration consistency: Distribute validated configuration with explicit versioning and rollout behavior."
    ],

    hideHighLevelArchitecture: true,
    hideStepByStepDesign: true,

    customSections: [
      {
        badge: "CAPACITY MATH",
        badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
        title: "Capacity Estimation & Back-of-the-Envelope Math",
        content: `
          <div class="flex flex-col gap-5 text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              Capacity estimation helps determine gateway fleet sizing, bandwidth throughput, memory consumption, and whether a single node or network link could become a bottleneck.
            </p>

            <!-- Traffic Assumptions Table -->
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
              <table class="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                    <th class="py-3 px-4 w-1/2">Metric</th>
                    <th class="py-3 px-4 w-1/2">Illustrative Assumption</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Daily Active Users (DAU)</td>
                    <td class="py-2 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">10 million</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Average API requests per user per day</td>
                    <td class="py-2 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">20 requests</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Total daily API requests</td>
                    <td class="py-2 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">200 million requests</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Peak-to-average traffic multiplier</td>
                    <td class="py-2 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">4&times;</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Average request payload size</td>
                    <td class="py-2 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">2 KB</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2 px-4 font-medium text-slate-900 dark:text-white">Average response payload size</td>
                    <td class="py-2 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">10 KB</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mathematical Breakdown Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <!-- RPS Calculation Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
                <div class="flex items-center gap-1.5 text-blue-400 font-bold text-[13px]">
                  <span class="material-symbols-outlined text-[18px]">speed</span>
                  Throughput (RPS)
                </div>
                <div class="text-[12px] text-slate-300 space-y-1">
                  <div><strong>Daily requests:</strong><br/><code>10M &times; 20 = 200,000,000 req/day</code></div>
                  <div><strong>Average RPS:</strong><br/><code>200M / 86,400s &approx; 2,315 RPS</code></div>
                  <div><strong>Peak RPS (4&times; multiplier):</strong><br/><code>2,315 &times; 4 &approx; 9,260 &approx; 9,300 RPS</code></div>
                </div>
                <div class="p-2 rounded bg-blue-950/40 border border-blue-900/50 text-[11px] text-blue-300 font-mono mt-1">
                  &bull; Design for 9,300 peak RPS; benchmark at 12,000–15,000 RPS
                </div>
              </div>

              <!-- Bandwidth Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
                <div class="flex items-center gap-1.5 text-emerald-400 font-bold text-[13px]">
                  <span class="material-symbols-outlined text-[18px]">network_check</span>
                  Network Bandwidth
                </div>
                <div class="text-[12px] text-slate-300 space-y-1">
                  <div><strong>Combined Payload per req:</strong><br/><code>2 KB + 10 KB = 12 KB</code></div>
                  <div><strong>Average combined bandwidth:</strong><br/><code>2,315 &times; 12 KB &approx; 27.8 MB/s</code></div>
                  <div><strong>Peak combined bandwidth:</strong><br/><code>9,260 &times; 12 KB &approx; 111.1 MB/s (0.89 Gbps)</code></div>
                </div>
                <div class="p-2 rounded bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300 font-mono mt-1">
                  &bull; Ingress: ~148 Mbps &bull; Egress: ~741 Mbps peak
                </div>
              </div>

              <!-- Storage Estimates Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] flex flex-col gap-2">
                <div class="flex items-center gap-1.5 text-purple-400 font-bold text-[13px]">
                  <span class="material-symbols-outlined text-[18px]">storage</span>
                  Storage &amp; Logging Estimates
                </div>
                <div class="text-[12px] text-slate-300 space-y-1">
                  <div><strong>Route Configuration (RAM):</strong><br/><code>10,000 routes &times; 2 KB &approx; 20 MB</code></div>
                  <div><strong>Daily Request Access Logs:</strong><br/><code>200M &times; 200 bytes &approx; 40 GB/day</code></div>
                  <div><strong>7-Day Retention (Raw Logs):</strong><br/><code>40 GB &times; 7 = 280 GB</code></div>
                </div>
                <div class="p-2 rounded bg-purple-950/40 border border-purple-900/50 text-[11px] text-purple-300 font-mono mt-1">
                  &bull; Gateway RAM: negligible (20 MB routes) &bull; Asynchronous log export
                </div>
              </div>

            </div>

            <!-- Architectural Implications -->
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <strong class="text-slate-900 dark:text-white text-[13.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-amber-500 text-[18px]">lightbulb</span>
                How These Estimates Influence Architecture
              </strong>
              <ul class="text-[12.5px] text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                <li><strong>Fleet Sizing:</strong> If load testing shows an instance safely processes 2,000 RPS, a minimum of 5 nodes provides 10,000 RPS. Add 3–5 nodes for $N+2$ failure headroom and multi-AZ parity (fleet size: 8–10 instances).</li>
                <li><strong>Asymmetric Network:</strong> Egress traffic (10 KB responses) is 5&times; heavier than ingress traffic (2 KB requests). Provision instances with 10 GbE network interfaces.</li>
                <li><strong>In-Memory Configuration:</strong> 20 MB of route definitions easily fits entirely in RAM, completely eliminating database lookups on the request path.</li>
                <li><strong>Asynchronous Telemetry:</strong> At 9,300 peak RPS, synchronous logging would lock worker threads. Access logs must stream to non-blocking ring buffers.</li>
              </ul>
            </div>
          </div>
        `
      },
      getApiGatewayHldSection()
    ],

    apiDesign: `// ==========================================
// 1. PROXIED APIS (DATA PLANE)
// ==========================================

// A. Fetch Order Details
GET /api/orders/{orderId}
Authorization: Bearer <access-token>
X-Request-ID: req-abc-123

Successful Response — 200 OK:
{
  "orderId": "123",
  "status": "SHIPPED",
  "total": 1499
}

Status Codes:
- 200 OK — Request successfully processed and returned by Order Service
- 401 Unauthorized — Missing, expired, or cryptographically invalid access token
- 403 Forbidden — Caller does not possess required read scope for this route
- 404 Not Found — Order ID not found
- 429 Too Many Requests — Client exceeded allocated rate limit
- 502 Bad Gateway — Upstream Order Service returned an unparseable or reset socket
- 503 Service Unavailable — Circuit breaker open or no healthy instances available
- 504 Gateway Timeout — Upstream service failed to respond within 2000ms deadline

// B. Create an Order (Idempotent Mutation)
POST /api/orders
Authorization: Bearer <access-token>
Content-Type: application/json
Idempotency-Key: checkout-789-xyz

{
  "productId": "P100",
  "quantity": 2
}

Successful Response — 201 Created:
{
  "orderId": "ORD-123",
  "status": "CREATED"
}

// C. Gateway Health & Readiness Check
GET /health
Response — 200 OK:
{
  "status": "UP",
  "configVersion": 42,
  "activeConnections": 340
}

// ==========================================
// 2. ADMINISTRATIVE APIS (CONTROL PLANE)
// ==========================================
// Restricted to authorized deployment automation / operators

GET    /admin/routes              // List configured routes in active version
POST   /admin/routes              // Create a new route definition
PUT    /admin/routes/{routeId}    // Update route or policy configuration
DELETE /admin/routes/{routeId}    // Remove a route

Example Route Configuration Entity (JSON):
{
  "routeId": "orders-route",
  "pathPrefix": "/api/orders",
  "methods": ["GET", "POST"],
  "targetService": "order-service",
  "timeoutMs": 2000,
  "rateLimitPerSecond": 100
}

// Critical Architectural Rules:
- The Control Plane validates route regexes, syntax, and target reachability before publishing.
- The Gateway NEVER retries non-idempotent POST operations on timeout without backend idempotency.
- Gateway-generated errors strictly adhere to RFC 7807 (Problem Details for HTTP APIs).`,

    dataModel: getApiGatewayDataModelSection(),

    whyComponents: [
      { component: "Load Balancer", why: "Terminates public TLS and distributes traffic evenly across gateway nodes." },
      { component: "Gateway Instance", why: "Executes the in-memory request-processing pipeline: routing, auth, rate limiting, and timeouts." },
      { component: "Admin API", why: "Accepts authorized route and policy changes from operators and deployment pipelines." },
      { component: "Configuration Service", why: "Validates, versions, and rolls out atomic configuration snapshots to gateway nodes." },
      { component: "Configuration Database", why: "Durable relational store (PostgreSQL) for route definitions, policies, and audit history." },
      { component: "Service Discovery", why: "Tracks live healthy backend IP:port endpoints as instances autoscale or restart." },
      { component: "Shared Rate Limit Store", why: "Coordinates global quotas across gateway instances using Redis when strict limits are required." },
      { component: "Backend Services", why: "Execute core business logic, domain database mutations, and resource-level authorization." },
      { component: "Logs, Metrics & Tracing", why: "Asynchronously records request telemetry and trace context without blocking the critical path." }
    ],

    postComponentSections: [
      getApiGatewayLldSection(),
      getApiGatewayAlgorithmsSection(),
      getApiGatewayScalabilitySection(),
      getApiGatewayFailureScenariosSection(),
      getApiGatewaySecurityObservabilitySection()
    ],

    tradeoffType: "table",
    tradeoffs: [
      {
        choice: "Managed vs. Self-managed Gateway",
        upside: "Managed gateways (AWS API Gateway) eliminate infrastructure maintenance, OS patching, and manual autoscaling.",
        downside: "Self-managed gateways (Envoy, Kong, NGINX) offer microsecond latencies, full custom filter plugins, and predictable high-volume pricing."
      },
      {
        choice: "Local vs. Global Rate Limiting",
        upside: "Local token buckets add 0ms network latency and have no external dependencies; global stores enforce strict multi-node quotas.",
        downside: "Local quotas allow aggregate traffic to multiply as fleet scales; global Redis stores add a network hop and fail-open/closed dilemmas."
      },
      {
        choice: "Strong vs. Eventual Config Consistency",
        upside: "Strong consistency ensures all nodes activate changes at the exact same millisecond; eventual rollout keeps instances available during control-plane outages.",
        downside: "Strong rollouts require two-phase commit barriers; eventual propagation allows brief windows where instances run adjacent configuration versions."
      },
      {
        choice: "API Gateway vs. Service Mesh",
        upside: "API Gateway centralizes edge North-South client policies; Service Mesh (Istio/Linkerd) handles East-West microservice-to-microservice security.",
        downside: "Running both introduces operational overhead; do not deploy a complex service mesh if only an external client ingress gateway is required."
      },
      {
        choice: "Backend Response Aggregation (BFF)",
        upside: "Aggregating multiple service responses into one payload reduces round-trips for mobile clients on high-latency networks.",
        downside: "Couples the gateway to backend schemas, creates tail-latency amplification, and turns the gateway into an monolithic application layer."
      }
    ],

    followUps: [
      {
        q: "Why do we need an API Gateway if we already have a load balancer?",
        a: "A load balancer operates at L4/L7 to distribute raw bytes and HTTP connections across server pools. An API Gateway understands application API route semantics—it verifies JWT tokens, checks fine-grained client quotas, terminates SSL, injects user context headers, coordinates circuit breakers, and isolates backend service topologies from external clients."
      },
      {
        q: "How do you prevent the gateway from becoming a single point of failure?",
        a: "Deploy multiple stateless gateway instances across three Availability Zones behind a highly available Layer 4/Layer 7 cloud load balancer (e.g. AWS NLB/ALB with Anycast IPs). Ensure each gateway instance stores a validated configuration snapshot locally in memory so it can continue serving traffic even if the control-plane database crashes."
      },
      {
        q: "How would you scale to one million RPS?",
        a: "Benchmark realistic gateway workloads (TLS handshake cost, JWT crypto overhead, payload size). If optimized Envoy instances handle 25,000 RPS each, size a fleet of 50–60 nodes with $N+2$ headroom. Use Anycast DNS (Cloudflare/Route 53) to distribute traffic across multiple geographic edge regions, utilize local in-memory token buckets to eliminate shared Redis bottlenecks, and scale backend services in lockstep."
      },
      {
        q: "Why not query the configuration database for every request?",
        a: "Querying PostgreSQL for every request would add 5–15ms of network and disk latency per call and immediately crash the database at thousands of requests per second. Route configurations change infrequently, so caching immutable snapshots in gateway memory gives sub-microsecond route resolution and insulates client traffic from database downtime."
      },
      {
        q: "How do you implement a global rate limit?",
        a: "Use an external distributed cache such as a Redis Cluster running a Lua script that executes atomic sliding-window log or token-bucket decrements. Alternatively, use coordinated token allocation where gateway instances periodically claim batches of tokens (e.g. 50 tokens every 500ms) from Redis, avoiding a network call on every individual request."
      },
      {
        q: "How do you handle a slow backend?",
        a: "Enforce strict per-route timeouts (e.g. 2000ms), bound the max concurrent connection pool for that service, and wrap calls in a circuit breaker. If the failure or timeout rate exceeds 50%, the circuit breaker trips to OPEN, failing fast with HTTP 503 instead of tying up gateway worker threads until connection pools starve."
      },
      {
        q: "How do you prevent duplicate operations when retrying requests?",
        a: "Never retry non-idempotent HTTP methods (such as POST /api/orders) on timeout without an <code>Idempotency-Key</code> header. The gateway passes this key to the backend, which stores the key and its committed result in an ACID transaction table. If a duplicate request arrives, the backend returns the cached result without repeating the business operation."
      },
      {
        q: "What if a configuration update reaches only some instances?",
        a: "Use immutable versioned snapshots (e.g. <code>v42</code>). Gateway instances poll or receive version notifications, download the complete snapshot, validate syntax, and atomically swap the active configuration pointer. If strict fleet synchronization is required, use a two-phase rollout or canary deployment."
      },
      {
        q: "Should every GET response be cached?",
        a: "No. Only cache public, read-heavy, low-volatility responses (e.g. product catalog data) with explicit <code>Cache-Control</code> headers. Never cache personalized endpoints returning user profile details, shopping cart contents, or responses containing <code>Authorization</code> or <code>Set-Cookie</code> headers."
      },
      {
        q: "How would you handle a sudden traffic spike?",
        a: "Rely on local token-bucket rate limiters to instantly reject requests exceeding peak provisioned capacity with HTTP 429. Implement priority load shedding to prioritize critical checkout traffic over background telemetry. Autoscaling groups provision additional nodes, but rate limiting acts as the immediate shock absorber during the 2–3 minute container startup window."
      },
      {
        q: "What is the difference between 502, 503, and 504?",
        a: "<strong>502 Bad Gateway:</strong> The upstream backend responded, but with an invalid response, protocol error, or dropped the socket prematurely.<br/><strong>503 Service Unavailable:</strong> The gateway cannot forward the request because the circuit breaker is open or no healthy backend endpoints exist in service discovery.<br/><strong>504 Gateway Timeout:</strong> The gateway forwarded the request, but the upstream backend failed to respond within the configured timeout deadline."
      },
      {
        q: "When would you choose a managed gateway instead of building your own?",
        a: "Choose a managed gateway (e.g. AWS API Gateway) for rapid time-to-market, low-to-moderate traffic, native serverless (AWS Lambda) integrations, and zero infrastructure maintenance. Choose self-managed infrastructure (e.g. Envoy, Kong, Traefik) when you require microsecond p99 latency, customized C++/Go/Lua plugins, WebSocket/gRPC advanced features, multi-cloud portability, or when request volume makes managed per-million request pricing cost-prohibitive."
      }
    ],

    postSections: [
      ...getApiGatewayFinalSummarySection()
    ]
  });
}
