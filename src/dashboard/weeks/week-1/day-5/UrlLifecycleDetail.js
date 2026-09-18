/**
 * 2.4 What Happens When You Type a URL in a Browser? - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 28, 29, and 30
 * from The Modern System Design Interview Guide.
 */

export function renderUrlLifecycleContent(topic) {
  const lifecycleStages = [
    {
      stage: "1. URL Parsing",
      layer: "Application (Browser)",
      latency: "< 1 ms",
      protocol: "Internal Parser",
      bottleneck: "Malformed URL syntax, HSTS list check, punycode internationalization"
    },
    {
      stage: "2. DNS Resolution",
      layer: "Application / Transport",
      latency: "20 – 120 ms",
      protocol: "UDP 53 (DoH / DoT 443)",
      bottleneck: "Cold cache misses, recursive 4-tier traversal, geographical distance to NS"
    },
    {
      stage: "3. TCP Handshake",
      layer: "Transport (L4)",
      latency: "1 RTT (~30 – 100 ms)",
      protocol: "TCP (SYN → SYN-ACK → ACK)",
      bottleneck: "High round-trip network latency, packet loss during SYN phase"
    },
    {
      stage: "4. TLS Handshake",
      layer: "Security / Presentation",
      latency: "1 RTT (TLS 1.3) / 2 RTT (1.2)",
      protocol: "TLS 1.3 (ECDHE Key Share)",
      bottleneck: "Asymmetric RSA/ECC key computation, large certificate revocation lists (CRL/OCSP)"
    },
    {
      stage: "5. HTTP Req & TTFB",
      layer: "Application (L7)",
      latency: "50 – 350 ms",
      protocol: "HTTP/2 or HTTP/3",
      bottleneck: "Server queuing, backend microservice fan-out, slow database queries"
    },
    {
      stage: "6. Browser CRP Render",
      layer: "Client Rendering Engine",
      latency: "50 – 200 ms",
      protocol: "DOM + CSSOM Pipeline",
      bottleneck: "Render-blocking CSS, parser-blocking synchronous JS, expensive layout thrashing"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is Time to First Byte (TTFB) and what concrete factors contribute to it?",
      answer: `<strong>TTFB</strong> is the elapsed duration from the moment the browser initiates the HTTP request until the very first byte of the response arrives from the server. It is composed of three sequential phases: (1) <em>Network Latency</em> (client-to-server RTT through CDN/firewalls), (2) <em>Server Processing Time</em> (routing, auth verification, business logic, DB queries, dynamic template rendering), and (3) <em>Response Transmission Time</em> (time for the first packet to traverse back). A high TTFB (>500ms) typically indicates unoptimized database queries, lack of edge caching, or missing connection pooling.`
    },
    {
      qNum: "Q2",
      question: "What is the exact distinction between preload, prefetch, and preconnect?",
      answer: `<strong>&lt;link rel=\"preload\"&gt;:</strong> Mandatory, high-priority directive telling the browser to fetch a critical resource needed for the <em>current page</em> (e.g. above-the-fold hero image or webfont) immediately before the parser discovers it.<br/><strong>&lt;link rel=\"prefetch\"&gt;:</strong> Low-priority hint suggesting the browser fetch an asset needed for a <em>future navigation</em> during idle browser time (e.g. bundle for the next checkout step).<br/><strong>&lt;link rel=\"preconnect\"&gt;:</strong> Establishes early connection (DNS + TCP + TLS handshake) to a third-party origin (e.g. <code>https://fonts.googleapis.com</code>) without requesting a specific file yet, saving 100–300ms later.`
    },
    {
      qNum: "Q3",
      question: "How does TLS 1.3 eliminate a full round-trip from the URL connection lifecycle?",
      answer: `In <strong>TLS 1.2</strong>, connection setup required 2 full round-trips: ClientHello/ServerHello agreed on cipher suites in RTT 1, and key exchange occurred in RTT 2. In <strong>TLS 1.3</strong>, the client anticipates the server's cryptographic algorithm and bundles its <em>Diffie-Hellman key share</em> directly inside the initial <code>ClientHello</code> packet. The server responds with its own key share and certificate in <code>ServerHello</code>, allowing symmetric encryption to begin in just <strong>1 RTT</strong>. For returning visitors, TLS 1.3 supports <strong>0-RTT resumption</strong>.`
    },
    {
      qNum: "Q4",
      question: "Why does CSS block rendering while synchronous JavaScript blocks HTML parsing?",
      answer: `The browser cannot render anything to the screen without the <strong>Render Tree</strong>, which requires both the DOM and the <strong>CSSOM</strong>. If the browser rendered before CSS finished downloading, it would flash unstyled content (FOUC) and immediately redraw, causing severe visual jitter. Therefore, <em>CSS blocks rendering</em>. Conversely, HTML parsing creates the DOM incrementally, but when the parser hits a synchronous <code>&lt;script&gt;</code>, it must halt because JavaScript could call <code>document.write()</code> or modify existing DOM nodes. Therefore, <em>synchronous JS blocks HTML parsing</em> unless marked with <code>defer</code> or <code>async</code>.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 28, 29, 30: WHAT HAPPENS WHEN YOU TYPE A URL -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              2.4 What Happens When You Type a URL in a Browser?
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            One of the most classic senior system design and networking questions. Answering it effectively requires tracing the request across the entire OSI stack—from client input parsing through multi-tier DNS, transport connection, TLS negotiation, server-side reverse proxy ingress, to the browser's <strong>Critical Rendering Path (CRP)</strong>.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-blue-300 uppercase">Phase 1: Ingress Resolution</span>
              <p class="text-[12px] text-slate-300">URL syntax parsing, HSTS pre-load validation, browser DNS cache, OS hosts file, recursive resolver 4-tier traversal.</p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">Phase 2: Secure Transport</span>
              <p class="text-[12px] text-slate-300">TCP 3-way handshake (SYN, SYN-ACK, ACK), TLS 1.3 ECDHE key exchange (1 RTT), and HTTP/2 or HTTP/3 negotiation.</p>
            </div>

            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">Phase 3: Server & CRP Render</span>
              <p class="text-[12px] text-slate-300">Reverse proxy / ALB termination, application execution, HTML streaming, DOM + CSSOM construction, Layout, Paint, and Compositing.</p>
            </div>
          </div>
        </div>

        <!-- END-TO-END SEQUENCE & TIMING WATERFALL DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              END-TO-END TIMING & CONNECTION SEQUENCE
            </span>
            <span class="text-[11px] font-code text-slate-500">From Keystroke to Pixels</span>
          </div>

          <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono bg-[#0F1626] p-4 rounded-xl border border-slate-700/50">
[ User Types URL & Hits Enter ]
      │
      ├─► [ 1. URL Parsing ] ──── Check HSTS cache → Parse domain & protocol
      │
      ├─► [ 2. DNS Resolution ] ── Browser Cache → OS Cache → Recursive DNS (20-120ms)
      │                            Returns: Edge IP (198.51.100.1)
      │
      ├─► [ 3. TCP 3-Way Handshake ] ──── SYN ──► SYN-ACK ◄── ACK (1 RTT)
      │
      ├─► [ 4. TLS 1.3 Handshake ] ────── ClientHello (Key Share) ──► ServerHello (1 RTT)
      │
      ├─► [ 5. HTTP GET / Request ] ───── Sent over encrypted TLS tunnel
      │    └──► [ TTFB Server Execution ] L4 LB → NGINX → App Service → Database (50-300ms)
      │    └──► [ Response Stream ] ───── 200 OK + Content-Type: text/html + HTML payload
      │
      └─► [ 6. Critical Rendering Path ]
           HTML Parser ──► [ DOM Tree ] ────┐
           CSS Parser  ──► [ CSSOM Tree ] ──┴─► [ Render Tree ] ──► [ Layout (Reflow) ] ──► [ Paint ] ──► [ GPU Composite ]
          </div>

          <div class="flex items-center justify-between text-[11px] font-code text-cyan-300 pt-1">
            <span>▲ Total Cold Navigation Latency = DNS + TCP + TLS + TTFB + Download + First Paint</span>
            <span class="text-slate-500 font-sans">Subsequent requests reuse persistent HTTP/2+ connections</span>
          </div>
        </div>

        <!-- DETAILED STAGE LATENCY TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            LIFECYCLE STAGES, PROTOCOLS & BOTTLENECK PROFILE
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3 w-40">Stage</th>
                  <th class="p-3 w-44">OSI / Architecture Layer</th>
                  <th class="p-3 w-28">Latency</th>
                  <th class="p-3 w-48">Protocol / Mechanics</th>
                  <th class="p-3">Primary Bottlenecks</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${lifecycleStages.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white">${row.stage}</td>
                    <td class="p-3 text-indigo-300">${row.layer}</td>
                    <td class="p-3 font-code text-cyan-300 font-bold whitespace-nowrap">${row.latency}</td>
                    <td class="p-3 font-code text-[11.5px] text-slate-300">${row.protocol}</td>
                    <td class="p-3 text-slate-400 leading-relaxed">${row.bottleneck}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The Critical Rendering Path & Resource Hints -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE CRITICAL RENDERING PATH & MODERN RESOURCE HINTS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Senior interviewers will push you beyond network handshakes into browser optimization. Accelerate page load by using declarative resource hints in the HTML header:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-amber-500/20">
              <strong class="text-amber-300 font-code">&lt;link rel="preconnect"&gt;</strong>
              <p class="text-slate-300 text-[11.5px] mt-0.5">Executes DNS lookup, TCP handshake, and TLS negotiation in advance for critical third-party origins (e.g. CDNs, fonts, analytics).</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-amber-500/20">
              <strong class="text-amber-300 font-code">&lt;link rel="preload"&gt;</strong>
              <p class="text-slate-300 text-[11.5px] mt-0.5">Forces immediate high-priority fetching of late-discovered assets required for the current page (e.g. hero images, critical fonts).</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-amber-500/20">
              <strong class="text-amber-300 font-code">&lt;link rel="prefetch"&gt;</strong>
              <p class="text-slate-300 text-[11.5px] mt-0.5">Instructs the browser to download resources in the background during idle time that will be needed for future page navigations.</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-amber-500/20">
              <strong class="text-amber-300 font-code">&lt;script defer&gt;</strong>
              <p class="text-slate-300 text-[11.5px] mt-0.5">Downloads scripts asynchronously without blocking HTML parsing, executing them in document order after the DOM is fully constructed.</p>
            </div>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why does CSS block rendering, while synchronous JavaScript blocks HTML parsing?
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
            Structure your answer as a clear end-to-end journey across 6 stages: Parse → Resolve (DNS) → Connect (TCP) → Secure (TLS) → Request/Serve (HTTP) → Render (DOM/CSSOM). Every stage represents a potential latency bottleneck, a network round-trip, and a critical caching opportunity.
          </p>
        </div>

        <!-- Page 30 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 30</span>
        </div>

      </div>

    </div>
  `;
}
