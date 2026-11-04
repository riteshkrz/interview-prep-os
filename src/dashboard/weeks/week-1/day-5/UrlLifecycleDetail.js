/**
 * 2.4 What Happens When You Type a URL in a Browser? - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 28, 29, and 30
 * from The Modern System Design Interview Guide.
 */

export function renderUrlLifecycleContent(topic) {
  const lifecycleStages = [
    {
      stage: "1. URL Parsing & Cache",
      layer: "Application (Browser)",
      latency: "< 2 ms",
      protocol: "Browser Engine",
      bottleneck: "Malformed URL syntax, HSTS security preload list check, browser cache verification"
    },
    {
      stage: "2. DNS Resolution",
      layer: "Application / Transport",
      latency: "20 – 120 ms",
      protocol: "UDP 53 / DoH 443",
      bottleneck: "Cold DNS cache miss, 4-tier recursive hierarchy walk, geographical distance to Name Server"
    },
    {
      stage: "3. TCP Handshake",
      layer: "Transport (L4)",
      latency: "1 RTT (20 – 80 ms)",
      protocol: "TCP (SYN → SYN-ACK → ACK)",
      bottleneck: "Physical distance to server/CDN edge, packet drop during SYN phase"
    },
    {
      stage: "4. TLS 1.3 Handshake",
      layer: "Security / Session",
      latency: "1 RTT (20 – 80 ms)",
      protocol: "TLS 1.3 (ECDHE Key Share)",
      bottleneck: "Asymmetric cryptographic key computation, large certificate chains, OCSP checks"
    },
    {
      stage: "5. HTTP Request & TTFB",
      layer: "Application (L7)",
      latency: "50 – 300 ms",
      protocol: "HTTP/2 or HTTP/3",
      bottleneck: "Reverse proxy routing, microservice fan-out, slow database queries, dynamic page rendering"
    },
    {
      stage: "6. Browser CRP Rendering",
      layer: "Client Rendering Engine",
      latency: "50 – 250 ms",
      protocol: "DOM + CSSOM Pipeline",
      bottleneck: "Render-blocking CSS, parser-blocking synchronous JS scripts, expensive layout reflows"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is Time to First Byte (TTFB) and what concrete factors cause it to be slow?",
      answer: `<strong>Time to First Byte (TTFB)</strong> is the total time elapsed from the moment the browser presses "Enter" until the very first byte of the HTTP response arrives from the server.
      <br/><br/>
      <strong>The Three Sequential Phases of TTFB:</strong>
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li><strong>Network RTT Latency:</strong> The physical time required for TCP/TLS handshakes and the HTTP request packet to traverse undersea fiber cables and CDN edge nodes.</li>
        <li><strong>Server Processing Time:</strong> Reverse proxy (Nginx) routing, auth token verification, business logic computation, slow database SQL queries, and template compilation.</li>
        <li><strong>Response Transmission Time:</strong> Time taken to serialize the response header and push the first TCP segment back onto the network wire.</li>
        <li><em>Optimization:</em> If TTFB is > 500 ms, add a CDN edge cache, index slow SQL queries, or implement database connection pooling (RDS Proxy).</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is the exact distinction between preload, prefetch, and preconnect?",
      answer: `These are modern HTML <strong>Resource Hints</strong> used to optimize page speed:
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li><strong>&lt;link rel="preload"&gt; (Immediate Need):</strong> Mandatory, high-priority instruction telling the browser to fetch a critical asset needed for the <em>current page</em> (e.g. above-the-fold hero image or custom webfont) before the HTML parser reaches it.</li>
        <li><strong>&lt;link rel="prefetch"&gt; (Future Need):</strong> Low-priority hint suggesting the browser download an asset in the background during idle time because the user is likely to visit that page next (e.g. the checkout bundle on an ecommerce cart page).</li>
        <li><strong>&lt;link rel="preconnect"&gt; (Early Handshake):</strong> Performs the DNS lookup, TCP handshake, and TLS negotiation in advance to a third-party origin (e.g. <code>https://fonts.googleapis.com</code>) without requesting a specific file yet, saving 150–300 ms later.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How does TLS 1.3 eliminate a full round-trip from the connection lifecycle?",
      answer: `In legacy <strong>TLS 1.2</strong>, setting up encryption required 2 full network round-trips:
      <br/>• RTT 1: ClientHello / ServerHello agreed on cryptographic cipher suites.
      <br/>• RTT 2: Client and Server exchanged Diffie-Hellman keys and verified certificates.
      <br/><br/>
      In <strong>TLS 1.3</strong>, the client predicts the server's encryption cipher and bundles its <em>Diffie-Hellman key share</em> directly inside the initial <code>ClientHello</code> packet. The server responds with its key share and certificate in <code>ServerHello</code>, allowing symmetric encryption to begin in just <strong>1 RTT</strong>. Returning visitors can even use <strong>0-RTT early data</strong>.`
    },
    {
      qNum: "Q4",
      question: "Why does CSS block page rendering while synchronous JavaScript blocks HTML parsing?",
      answer: `The browser cannot draw pixels on the screen without constructing the <strong>Render Tree</strong>, which requires combining the <strong>DOM</strong> (HTML structure) with the <strong>CSSOM</strong> (CSS styling rules).
      <ul class="list-disc pl-5 mt-1.5 space-y-1 text-slate-300">
        <li><strong>CSS Blocks Rendering:</strong> If the browser painted pixels before CSS finished downloading, users would see an ugly Flash of Unstyled Content (FOUC), followed by a jarring visual layout jump when styles arrive. The browser deliberately halts rendering until all CSS stylesheets are parsed.</li>
        <li><strong>Synchronous JS Blocks HTML Parsing:</strong> HTML parsing constructs the DOM incrementally. But when the parser encounters a <code>&lt;script src="app.js"&gt;</code> tag without <code>defer</code> or <code>async</code>, it must stop completely and wait for the script to download and execute, because JavaScript can modify the DOM (e.g. via <code>document.write()</code>). Always use <code>defer</code> on script tags!</li>
      </ul>`
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
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            The Golden System Design Question · End-to-End Request Journey Across All 7 OSI Layers
          </p>
        </div>

        <!-- 30-SECOND EXECUTIVE INTERVIEW SUMMARY -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE 30-SECOND EXECUTIVE SUMMARY (HOW TO START YOUR INTERVIEW ANSWER)
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            When asked this question, impress the interviewer by delivering a concise 6-stage roadmap before diving into technical details:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[12px] font-sans">
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-slate-700/60">
              <strong class="text-blue-300 block mb-1">1. Parse &amp; Cache Check:</strong>
              <span class="text-slate-400">Browser inspects URL, checks HSTS preload list, and queries browser/OS cache.</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-cyan-500/30">
              <strong class="text-cyan-300 block mb-1">2. DNS Resolution:</strong>
              <span class="text-slate-400">Translates domain (<code>api.example.com</code>) to IP address via 4-tier DNS hierarchy.</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-indigo-500/30">
              <strong class="text-indigo-300 block mb-1">3. TCP 3-Way Handshake:</strong>
              <span class="text-slate-400">Establishes reliable L4 transport stream (SYN → SYN-ACK → ACK) in 1 RTT.</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-purple-500/30">
              <strong class="text-purple-300 block mb-1">4. TLS 1.3 Encryption:</strong>
              <span class="text-slate-400">Validates server X.509 cert and derives AES-GCM symmetric keys via ECDHE in 1 RTT.</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-amber-500/30">
              <strong class="text-amber-300 block mb-1">5. HTTP Request &amp; TTFB:</strong>
              <span class="text-slate-400">Request hits CDN/Reverse Proxy; app server executes business logic and returns HTML.</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-emerald-500/30">
              <strong class="text-emerald-300 block mb-1">6. Critical Rendering Path:</strong>
              <span class="text-slate-400">Browser parses HTML/CSS, builds DOM &amp; CSSOM, runs layout, and paints pixels to screen.</span>
            </div>
          </div>
        </div>

        <!-- END-TO-END WEB REQUEST FLOW DIAGRAM -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                END-TO-END WEB REQUEST FLOW: FROM URL TO PIXEL ON SCREEN
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">9-Stage Execution Pipeline</span>
              <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">Detailed Sequence &amp; Timings</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/end-to-end-web-request-flow.jpg" 
                alt="End-to-End Web Request Flow - From URL to Pixel on Screen (Detailed Sequence & Timings)" 
                class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/end-to-end-web-request-flow.jpg', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">Client (Browser) ↔ Network / Internet ↔ Server Side (Origin) ↔ Typical Timing Breakdown</span>
            </div>
          </div>

          <!-- Stage Timing Breakdown Grid matching the diagram's 9 stages -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 text-[11.5px] font-sans">
            <div class="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">1</span>
                <div>
                  <strong class="font-semibold block text-blue-950">User Types URL</strong>
                  <span class="text-blue-900/80">Presses Enter (e.g. <code>https://api.example.com</code>)</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-blue-100 font-code text-[10.5px] font-bold text-blue-700 shrink-0">~0 ms</span>
            </div>

            <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">2</span>
                <div>
                  <strong class="font-semibold block text-emerald-950">URL Parsing &amp; Security</strong>
                  <span class="text-emerald-900/80">Check HSTS, parse scheme, domain, path, check service worker</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-emerald-100 font-code text-[10.5px] font-bold text-emerald-700 shrink-0">~1–5 ms</span>
            </div>

            <div class="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">3</span>
                <div>
                  <strong class="font-semibold block text-purple-950">DNS Resolution</strong>
                  <span class="text-purple-900/80">Browser → OS cache → Recursive resolver → Root → TLD → Auth</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-purple-100 font-code text-[10.5px] font-bold text-purple-700 shrink-0">~20–120 ms</span>
            </div>

            <div class="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">4</span>
                <div>
                  <strong class="font-semibold block text-amber-950">TCP 3-Way Handshake</strong>
                  <span class="text-amber-900/80">SYN → SYN-ACK → ACK to Edge/CDN Anycast IP</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-amber-100 font-code text-[10.5px] font-bold text-amber-700 shrink-0">~20–100 ms (1 RTT)</span>
            </div>

            <div class="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">5</span>
                <div>
                  <strong class="font-semibold block text-rose-950">TLS 1.3 Handshake</strong>
                  <span class="text-rose-900/80">ClientHello (key_share) → ServerHello + Cert → Encrypted Tunnel</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-rose-100 font-code text-[10.5px] font-bold text-rose-700 shrink-0">~20–100 ms (1 RTT)</span>
            </div>

            <div class="p-3 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">6</span>
                <div>
                  <strong class="font-semibold block text-cyan-950">HTTP Request</strong>
                  <span class="text-cyan-900/80">HTTPS GET (Host, headers, cookies, body) over encrypted tunnel</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-cyan-100 font-code text-[10.5px] font-bold text-cyan-700 shrink-0">~1–5 ms</span>
            </div>

            <div class="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">7</span>
                <div>
                  <strong class="font-semibold block text-yellow-950">Server Processing (TTFB)</strong>
                  <span class="text-yellow-900/80">L4 LB → NGINX → App Service → DB/Cache queries</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-yellow-100 font-code text-[10.5px] font-bold text-yellow-700 shrink-0">~50–300 ms</span>
            </div>

            <div class="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">8</span>
                <div>
                  <strong class="font-semibold block text-indigo-950">Response Stream</strong>
                  <span class="text-indigo-900/80">200 OK + headers + HTML streamed payload chunks</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-indigo-100 font-code text-[10.5px] font-bold text-indigo-700 shrink-0">~10 ms – 1s+</span>
            </div>

            <div class="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 flex items-start justify-between gap-2">
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">9</span>
                <div>
                  <strong class="font-semibold block text-teal-950">Critical Rendering Path</strong>
                  <span class="text-teal-900/80">HTML/CSS parsing → Render Tree → Layout → Paint → Compositing</span>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-teal-100 font-code text-[10.5px] font-bold text-teal-700 shrink-0">~50–500 ms+</span>
            </div>
          </div>

          <!-- Bottom Key Points from Diagram -->
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[12px] text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-indigo-700 font-semibold font-sans">
              <span class="material-symbols-outlined text-[18px] text-indigo-600">lightbulb</span>
              <span>Key Performance Takeaways:</span>
            </div>
            <div class="text-[11.5px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 font-sans">
              <span>• DNS, TCP, and TLS each cost physical network round-trips (RTT)</span>
              <span>• CDN Edge terminating TLS saves up to 200 ms of latency</span>
              <span>• TTFB includes reverse proxy queuing, microservices, and database queries</span>
            </div>
          </div>
        </div>

        <!-- DETAILED STAGE LATENCY TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            LIFECYCLE STAGES, PROTOCOLS &amp; BOTTLENECK PROFILE
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5 w-44">Stage</th>
                  <th class="p-3.5 w-48">OSI / Architecture Layer</th>
                  <th class="p-3.5 w-28">Typical Latency</th>
                  <th class="p-3.5 w-48">Protocol / Mechanics</th>
                  <th class="p-3.5">Primary Bottlenecks</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${lifecycleStages.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">${row.stage}</td>
                    <td class="p-3.5 text-indigo-300">${row.layer}</td>
                    <td class="p-3.5 font-code text-cyan-300 font-bold whitespace-nowrap">${row.latency}</td>
                    <td class="p-3.5 font-code text-[11.5px] text-slate-300">${row.protocol}</td>
                    <td class="p-3.5 text-slate-400 leading-relaxed">${row.bottleneck}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The Critical Rendering Path & Resource Hints -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">bolt</span>
            HOW SENIOR ENGINEERS SPEED UP THE URL LIFECYCLE: RESOURCE HINTS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Senior interviewers will ask: <em>"How do you shave 300 ms off this URL load?"</em> Use declarative browser resource hints in the HTML <code>&lt;head&gt;</code>:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0F1626]/80 p-3.5 rounded-lg border border-amber-500/20">
              <strong class="text-amber-300 font-code block mb-1">&lt;link rel="preconnect"&gt;</strong>
              <p class="text-slate-300 text-[11.5px] leading-relaxed">Performs DNS lookup, TCP handshake, and TLS negotiation in advance for critical third-party origins (e.g. CDNs, Stripe, Google Fonts), saving 150–300 ms.</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3.5 rounded-lg border border-amber-500/20">
              <strong class="text-amber-300 font-code block mb-1">&lt;link rel="preload"&gt;</strong>
              <p class="text-slate-300 text-[11.5px] leading-relaxed">Forces immediate high-priority fetching of critical assets needed for the current screen (e.g. hero banner image, custom typography) before the CSS is even parsed.</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3.5 rounded-lg border border-amber-500/20">
              <strong class="text-amber-300 font-code block mb-1">&lt;link rel="prefetch"&gt;</strong>
              <p class="text-slate-300 text-[11.5px] leading-relaxed">Instructs the browser to download resources in the background during idle time that will be needed for future navigations (e.g. next page in checkout flow).</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3.5 rounded-lg border border-amber-500/20">
              <strong class="text-amber-300 font-code block mb-1">&lt;script defer&gt;</strong>
              <p class="text-slate-300 text-[11.5px] leading-relaxed">Downloads JavaScript asynchronously in parallel without blocking HTML parsing, executing scripts in document order only after the DOM is fully constructed.</p>
            </div>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why does CSS block rendering while synchronous JavaScript blocks HTML parsing? How does this impact your Largest Contentful Paint (LCP) Core Web Vital score?
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
            Structure your answer as an end-to-end journey across six distinct milestones: Parse → Resolve (DNS) → Connect (TCP) → Secure (TLS 1.3) → Request/Process (HTTP &amp; TTFB) → Render (DOM/CSSOM). Emphasize that each network stage consumes round-trip time (RTT), and point out how modern techniques (Anycast CDNs, TLS 1.3, HTTP/3, and Resource Hints) systematically eliminate round trips.
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
