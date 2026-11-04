/**
 * 2.2 Forward Proxy vs. Reverse Proxy - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 24, 25, and 26
 * from The Modern System Design Interview Guide.
 */

export function renderForwardVsReverseProxyContent(topic) {
  const proxyComparisonRows = [
    {
      dimension: "Whom it Represents",
      forward: "Acts on behalf of the client (Outbound gateway)",
      reverse: "Acts on behalf of the servers (Inbound gatekeeper)"
    },
    {
      dimension: "Network Placement",
      forward: "Edge of client private network, enterprise LAN, or on client device",
      reverse: "Perimeter / edge of server infrastructure, cloud VPC, or datacenter"
    },
    {
      dimension: "Client Awareness",
      forward: "Client is fully aware; configured in browser or OS VPN settings",
      reverse: "Client is completely unaware (thinks the proxy IS the web server)"
    },
    {
      dimension: "Target Server Visibility",
      forward: "Target server only sees proxy IP; client real IP is masked",
      reverse: "Backend app servers see proxy IP; client IP forwarded in headers"
    },
    {
      dimension: "Core Responsibilities",
      forward: "Client privacy, anonymity, bypassing geo-blocks, corporate content filtering",
      reverse: "Load balancing, SSL/TLS termination, DDoS defense, response caching"
    },
    {
      dimension: "HTTP Header Handling",
      forward: "Strips identifying client tracking headers for privacy",
      reverse: "Injects X-Forwarded-For, X-Real-IP, and Forwarded headers"
    },
    {
      dimension: "Popular Technologies",
      forward: "Squid, Tor, Charles Proxy, Corporate BlueCoat, Shadowsocks, VPNs",
      reverse: "NGINX, HAProxy, Envoy, Cloudflare, Traefik, AWS ALB / NLB"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the concrete difference between a Reverse Proxy and an API Gateway?",
      answer: `While all API Gateways are technically reverse proxies, they serve different layers:
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li><strong>Reverse Proxy (NGINX / HAProxy / Cloudflare):</strong> Operates at Layer 4 and Layer 7 network perimeters. Focused on raw speed, TCP connection pooling, SSL/TLS certificate termination, static asset caching, and basic load balancing.</li>
        <li><strong>API Gateway (Kong / Envoy / Spring Cloud Gateway):</strong> Sits behind the reverse proxy and is application-aware. Handles business orchestration: validating OAuth2/JWT tokens, per-user rate limiting (e.g. 100 req/min for free tier), request/response JSON schema transformations, dynamic service discovery, and distributed OpenTelemetry tracing.</li>
        <li><em>Best Practice:</em> Keep your edge reverse proxy lightweight for speed, and let your API Gateway handle microservice logic.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How do you eliminate the Single Point of Failure (SPOF) for an edge Reverse Proxy cluster?",
      answer: `Placing all traffic through a reverse proxy creates an obvious risk: what if the proxy crashes?
      <br/><br/>
      <strong>Enterprise High-Availability Solutions:</strong>
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li><strong>Within a Datacenter (VRRP / Floating IP):</strong> Pair proxies in an active-passive or active-active cluster using <strong>Keepalived and VRRP</strong> sharing a virtual IP (VIP). If the primary node hardware dies, the backup node takes over the VIP in milliseconds via gratuitous ARP.</li>
        <li><strong>Global Scale (BGP Anycast):</strong> Announce the identical public IP address from 50+ data centers worldwide via BGP. Internet routers automatically send packets to the topologically closest healthy proxy data center. If one data center goes dark, BGP automatically re-routes traffic to the next closest facility.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is the difference between TLS Termination and TLS Pass-Through?",
      answer: `Interviewers check if you know where encryption stops:
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li><strong>TLS Termination (Most Common):</strong> The reverse proxy decrypts HTTPS at the perimeter, inspects HTTP paths and headers (for routing, caching, and WAF security rules), and forwards unencrypted HTTP (or re-encrypted lightweight mTLS) across the private VPC to backend servers. Saves massive CPU encryption overhead on app servers.</li>
        <li><strong>TLS Pass-Through:</strong> The proxy inspects only the <em>SNI (Server Name Indication)</em> header in the initial TLS handshake and forwards encrypted raw TCP packets directly to backends without decrypting. Used for zero-trust compliance (e.g., banking regulations requiring end-to-end encryption directly to the database or payment HSM).</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "How do backend microservices determine the true client IP address through a Reverse Proxy?",
      answer: `Because the physical TCP socket connects from the reverse proxy to the backend server, the backend server's socket sees the <em>proxy's internal IP address</em>.
      <br/><br/>
      <strong>The Solution &amp; The Security Trap:</strong>
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li>The reverse proxy appends the real user IP to the <code>X-Forwarded-For</code> header: <code>X-Forwarded-For: &lt;client-ip&gt;, &lt;proxy-ip&gt;</code>.</li>
        <li><strong>The Security Trap (Header Spoofing):</strong> An attacker can send a fake header: <code>X-Forwarded-For: 127.0.0.1</code> to bypass admin IP restrictions! Backend applications must <em>only</em> trust headers added by proxies located inside trusted private subnet CIDR blocks.</li>
      </ul>`
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
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Client-Side Outbound Gateways vs. Server-Side Inbound Proxies · TLS Termination &amp; Architectural Placement
          </p>
        </div>

        <!-- SIMPLE MENTAL MODEL BOX -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: PERSONAL BODYGUARD VS. HOTEL RECEPTIONIST
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-300 leading-relaxed font-sans">
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-blue-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">vpn_lock</span>
                Forward Proxy = Personal Bodyguard / VPN
              </strong>
              <p>
                When you leave home to go shopping, your bodyguard steps up to the store counter and pays for items on your behalf. The store clerk only sees the bodyguard and never knows who you are. <strong>Protects the client's identity from external websites.</strong>
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-indigo-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">hotel</span>
                Reverse Proxy = Hotel Concierge / Receptionist
              </strong>
              <p>
                When guests enter a luxury hotel, they are not allowed to wander directly into private executive suites or the kitchen. They talk to the receptionist, who checks reservations, inspects bags, and directs them to the right room. <strong>Protects internal servers from the public internet.</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- WHY THIS MATTERS IN SYSTEM DESIGN INTERVIEWS -->
        <div class="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            INTERVIEW SIGNAL
          </span>
          <p class="text-[12.5px] text-indigo-200/90 leading-relaxed font-sans">
            <strong>Where to draw it in an interview:</strong> Virtually every modern web system design diagram starts with a <strong>Reverse Proxy (e.g. Nginx, Envoy, Cloudflare)</strong> sitting directly behind the DNS/CDN layer. It provides SSL termination, DDoS protection, and routes <code>/api</code> requests to backend microservices while serving static files directly from cache.
          </p>
        </div>

        <!-- SIDE-BY-SIDE ARCHITECTURAL FLOW DIAGRAMS -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              NETWORK ARCHITECTURE &amp; TRAFFIC FLOW
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
            <span class="font-code text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">security</span>
              FORWARD PROXY USE CASES
            </span>
            <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-2 leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="text-blue-400 font-bold">•</span>
                <span><strong>Anonymity & Privacy:</strong> Hides client geographic origin and real IP address (Tor network, consumer VPNs).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 font-bold">•</span>
                <span><strong>Corporate Compliance & DLP:</strong> Inspects outbound employee packets to prevent intellectual property data leaks.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 font-bold">•</span>
                <span><strong>Content Filtering:</strong> Blocks access to malicious, unauthorized, or adult domains across company networks.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 font-bold">•</span>
                <span><strong>Outbound Bandwidth Caching:</strong> Caches common external downloads (e.g. OS patches) to save office WAN bandwidth.</span>
              </li>
            </ul>
          </div>

          <!-- Reverse Proxy Use Cases -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">dns</span>
              REVERSE PROXY USE CASES
            </span>
            <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-2 leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="text-indigo-400 font-bold">•</span>
                <span><strong>Load Balancing:</strong> Distributes incoming traffic across backend servers via Round-Robin or Least Connections.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-400 font-bold">•</span>
                <span><strong>SSL/TLS Termination:</strong> Handles expensive cryptographic handshakes at the edge, freeing application server CPU.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-400 font-bold">•</span>
                <span><strong>WAF & DDoS Mitigation:</strong> Shields private VPC IPs from public exposure, filters SQLi/XSS, and rate-limits attacks.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-400 font-bold">•</span>
                <span><strong>Path-Based Routing:</strong> Routes <code>/api</code> to microservices, <code>/auth</code> to auth servers, and static images to CDN cache.</span>
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
                  <th class="p-3.5">Dimension</th>
                  <th class="p-3.5">Forward Proxy (Client-Side)</th>
                  <th class="p-3.5">Reverse Proxy (Server-Side)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${proxyComparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">${row.dimension}</td>
                    <td class="p-3.5 text-blue-200">${row.forward}</td>
                    <td class="p-3.5 text-indigo-200">${row.reverse}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout: Senior Perspective - Reverse Proxy vs API Gateway Boundary -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: ARCHITECTURAL BOUNDARIES
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, never confuse a <strong>Reverse Proxy</strong> with an <strong>API Gateway</strong>. Place a high-performance reverse proxy (e.g. <strong>NGINX, HAProxy</strong>) at the network edge for raw Layer 4/7 routing, SSL offload, and response caching. Behind it, deploy an API Gateway (e.g. <strong>Kong, Envoy</strong>) to handle business-level orchestration: JWT validation, user-tier rate limiting, circuit breaking, and response formatting. Keep your edge proxy lean and fast.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            In a high-availability architecture, how do you prevent the reverse proxy itself from becoming a Single Point of Failure (SPOF)? How does BGP Anycast solve this globally?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
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
            A forward proxy hides the client from the outside world; a reverse proxy hides backend server architecture from the public internet. In system design, reverse proxies are the front door: place them at the network perimeter for TLS termination, DDoS filtering, and intelligent request routing before traffic ever reaches your application servers.
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
