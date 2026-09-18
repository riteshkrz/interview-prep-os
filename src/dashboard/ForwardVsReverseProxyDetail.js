/**
 * 2.2 Forward Proxy vs. Reverse Proxy - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 24, 25, and 26
 * from The Modern System Design Interview Guide.
 */

export function renderForwardVsReverseProxyContent(topic) {
  const proxyComparisonRows = [
    {
      dimension: "Role & Perspective",
      forward: "Acts on behalf of the client (outbound intermediary)",
      reverse: "Acts on behalf of backend servers (inbound gateway)"
    },
    {
      dimension: "Network Placement",
      forward: "Edge of client private network or on device",
      reverse: "Perimeter / edge of server infrastructure / VPC"
    },
    {
      dimension: "Client Awareness",
      forward: "Client is aware; configured explicitly in OS or browser",
      reverse: "Client is completely unaware (believes proxy is the origin)"
    },
    {
      dimension: "Server Awareness",
      forward: "Origin server only sees proxy IP; client IP hidden",
      reverse: "Backend receives proxy IP, client IP passed in headers"
    },
    {
      dimension: "Primary Focus",
      forward: "Privacy, anonymity, content filtering, compliance",
      reverse: "Load balancing, TLS offload, security buffering, caching"
    },
    {
      dimension: "Header Injection",
      forward: "Strips identifying client headers for privacy",
      reverse: "Injects X-Forwarded-For, X-Real-IP, Forwarded headers"
    },
    {
      dimension: "Typical Tech Stack",
      forward: "Squid, Charles Proxy, Tor, Corporate BlueCoat, Shadowsocks",
      reverse: "NGINX, HAProxy, Envoy, Cloudflare, Traefik, AWS ALB"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the concrete difference between a Reverse Proxy and an API Gateway?",
      answer: `While all API Gateways are reverse proxies, a traditional reverse proxy (e.g. <strong>NGINX, HAProxy</strong>) focuses on Layer 4 / Layer 7 routing, TLS termination, static caching, and basic load balancing. An <strong>API Gateway</strong> (e.g. <strong>Kong, Envoy, AWS API Gateway</strong>) is application-aware and adds advanced API governance: OAuth2/JWT token validation, per-user rate limiting, request/response JSON transformation, API versioning, dynamic service discovery, and distributed telemetry/tracing.`
    },
    {
      qNum: "Q2",
      question: "How do you eliminate the Single Point of Failure (SPOF) for a Reverse Proxy cluster?",
      answer: `At the data center layer, pair reverse proxies in an <em>active-passive</em> or <em>active-active</em> cluster using <strong>Keepalived / VRRP</strong> (Virtual Router Redundancy Protocol) sharing a floating Virtual IP (VIP). If the active node crashes, the standby node claims the VIP via gratuitous ARP within milliseconds. At planetary scale, deploy <strong>BGP Anycast</strong> to announce the same IP address across dozens of worldwide PoPs, routing user packets to the topologically closest healthy proxy.`
    },
    {
      qNum: "Q3",
      question: "What is the difference between TLS Termination and TLS Pass-Through?",
      answer: `In <strong>TLS Termination</strong>, the reverse proxy decrypts incoming HTTPS traffic at the perimeter, inspects HTTP headers (path routing, WAF inspection, injecting <code>X-Forwarded-For</code>), and forwards plaintext HTTP (or re-encrypted mTLS) to backend instances. In <strong>TLS Pass-Through</strong>, the proxy inspects only the <em>SNI (Server Name Indication)</em> header in the TLS ClientHello and forwards raw encrypted TCP packets directly to backends without decrypting, preserving zero-trust end-to-end encryption at the cost of losing L7 routing and caching.`
    },
    {
      qNum: "Q4",
      question: "How do backend microservices securely determine the true client IP address?",
      answer: `Because the TCP socket connects to the reverse proxy, the backend sees the proxy's IP address. The proxy appends the client IP to the <code>X-Forwarded-For: &lt;client-ip&gt;, &lt;proxy1-ip&gt;</code> header or standard <code>Forwarded: for=&lt;client-ip&gt;;proto=https</code>. <em>Critical Security Rule:</em> Backend applications must only trust the leftmost untrusted IP, and must configure the proxy as a trusted upstream CIDR to prevent spoofed client headers.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 24, 25, 26: FORWARD PROXY VS REVERSE PROXY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              2.2 Forward Proxy vs. Reverse Proxy
            </h2>
          </div>
        </div>

        <!-- Definition Callouts -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            A <strong>proxy server</strong> is an intermediary entity that facilitates network communication between a client and a target destination. The direction of traffic and whose identity is being protected determines whether it is a forward or reverse proxy:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div class="bg-[#0F1626] border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-blue-300 uppercase">Forward Proxy (Client-Side)</span>
                <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Outbound</span>
              </div>
              <p class="text-[12px] text-slate-300">
                Acts on behalf of clients to access external resources. Intercepts outbound requests, masks the client's identity, enforces corporate security, and caches outbound resources.
              </p>
            </div>

            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">Reverse Proxy (Server-Side)</span>
                <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Inbound</span>
              </div>
              <p class="text-[12px] text-slate-300">
                Sits in front of internal web servers to intercept incoming requests from the internet. Distributes load across servers, terminates TLS, mitigates attacks, and caches web content.
              </p>
            </div>
          </div>

          <!-- Mnemonic Box -->
          <div class="mt-1 bg-indigo-950/30 border border-indigo-500/30 rounded-lg px-3.5 py-2 text-[12px] text-indigo-200 font-sans flex items-center gap-2">
            <span class="font-bold text-cyan-300">Architectural Mnemonic:</span>
            <span>A <em>forward proxy</em> hides the client from the server; a <em>reverse proxy</em> hides the server from the client.</span>
          </div>
        </div>

        <!-- SIDE-BY-SIDE ARCHITECTURAL FLOW DIAGRAMS -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              NETWORK ARCHITECTURE & TRAFFIC FLOW
            </span>
            <span class="text-[11px] font-code text-slate-500">Outbound Client vs. Inbound Server</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Forward Proxy Diagram -->
            <div class="bg-[#0F1626] border border-blue-500/25 rounded-xl p-4 flex flex-col gap-3">
              <div class="flex items-center justify-between border-b border-blue-500/20 pb-2">
                <span class="font-code text-[11.5px] font-bold text-blue-300">FORWARD PROXY ARCHITECTURE</span>
                <span class="text-[10px] text-slate-400 font-code">Origin sees Proxy IP</span>
              </div>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
[Client A] ──┐
[Client B] ──┼──► [ FORWARD PROXY ] ──► ( INTERNET ) ──► [ Origin Web Server ]
[Client C] ──┘    • Hides client IP                       • Sees: Proxy IP
                  • Enforces DLP                          • Bypasses geoblocks
                  • Filters malware
              </div>
              <p class="text-[11px] text-slate-400 font-sans">
                Clients inside a private perimeter route outbound traffic through the proxy.
              </p>
            </div>

            <!-- Reverse Proxy Diagram -->
            <div class="bg-[#0F1626] border border-indigo-500/25 rounded-xl p-4 flex flex-col gap-3">
              <div class="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <span class="font-code text-[11.5px] font-bold text-indigo-300">REVERSE PROXY ARCHITECTURE</span>
                <span class="text-[10px] text-slate-400 font-code">Client sees Proxy IP</span>
              </div>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
[Clients] ──► ( INTERNET ) ──► [ REVERSE PROXY ] ──┬──► [ App Server 1 ]
                                • TLS Offload       ├──► [ App Server 2 ]
                                • Load Balancing    └──► [ App Server 3 ]
                                • WAF & DDoS Shield      (Private VPC IPs)
              </div>
              <p class="text-[11px] text-slate-400 font-sans">
                External clients communicate solely with the reverse proxy at the edge of the datacenter.
              </p>
            </div>
          </div>
        </div>

        <!-- DETAILED USE CASES BREAKDOWN -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Forward Proxy Use Cases -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <span class="font-code text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              FORWARD PROXY PRIMARY USE CASES
            </span>
            <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-2 leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="text-blue-400 font-bold">•</span>
                <span><strong>Anonymity & Privacy:</strong> Hides client geographic origin and public IP (Tor network, consumer VPNs).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 font-bold">•</span>
                <span><strong>Corporate Compliance & DLP:</strong> Inspects outbound employee packets to prevent intellectual property data leaks.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 font-bold">•</span>
                <span><strong>Content Filtering:</strong> Blocks access to malicious, unauthorized, or adult domains across corporate networks.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 font-bold">•</span>
                <span><strong>Outbound Caching:</strong> Caches common external downloads (e.g. software patches) to conserve costly enterprise WAN bandwidth.</span>
              </li>
            </ul>
          </div>

          <!-- Reverse Proxy Use Cases -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              REVERSE PROXY PRIMARY USE CASES
            </span>
            <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-2 leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="text-indigo-400 font-bold">•</span>
                <span><strong>Load Balancing:</strong> Distributes traffic across backend pools via Round-Robin, Least Connections, or IP Hash.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-400 font-bold">•</span>
                <span><strong>TLS/SSL Termination:</strong> Handles asymmetric RSA/ECDSA handshakes at the edge, offloading heavy CPU from app servers.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-400 font-bold">•</span>
                <span><strong>WAF & DDoS Mitigation:</strong> Shields internal server topology, filters SQLi/XSS attacks, and throttles rogue IP rates.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-400 font-bold">•</span>
                <span><strong>Edge Caching & Path Routing:</strong> Serves static assets, compresses responses (Gzip/Brotli), and routes <code>/api</code> vs <code>/static</code>.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- DIMENSIONAL COMPARISON TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            FORWARD PROXY VS. REVERSE PROXY: DIMENSIONAL COMPARISON
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3">Dimension</th>
                  <th class="p-3">Forward Proxy</th>
                  <th class="p-3">Reverse Proxy</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${proxyComparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white">${row.dimension}</td>
                    <td class="p-3 text-blue-200">${row.forward}</td>
                    <td class="p-3 text-indigo-200">${row.reverse}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout: Senior Perspective - Reverse Proxy vs API Gateway Boundary -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: REVERSE PROXY VS. API GATEWAY BOUNDARY
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, candidates often conflate <strong>Reverse Proxies</strong> and <strong>API Gateways</strong>. All API Gateways are reverse proxies, but the reverse is not true. Place a high-performance reverse proxy (e.g. <strong>NGINX, HAProxy</strong>) at the network edge for Layer 4/7 load distribution, SSL termination, and static caching. Behind it, deploy an API Gateway (e.g. <strong>Kong, Envoy, Spring Cloud Gateway</strong>) to handle business-aware orchestration: JWT verification, user-tier rate limiting, circuit breaking, and response aggregation. Avoid polluting your edge reverse proxy with complex application logic.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            In a high-availability architecture, how do you prevent the reverse proxy itself from becoming a Single Point of Failure (SPOF)?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-1.5 pb-3 border-b border-[#24314A]/50 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[13.5px] font-bold text-white font-sans">${item.question}</span>
                </div>
                <p class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-5 flex flex-col gap-2 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[13.5px] font-sans font-medium text-white leading-relaxed">
            A forward proxy acts for the client; a reverse proxy acts for the server. In system design interviews, reverse proxies are ingress workhorses: place them at the perimeter for TLS offload, load distribution, and security buffering before traffic touches application code.
          </p>
        </div>

        <!-- Page 26 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 26</span>
        </div>

      </div>

    </div>
  `;
}
