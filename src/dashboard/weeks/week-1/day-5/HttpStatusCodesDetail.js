/**
 * 2.5 HTTP Status Codes - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 30, 31, and 32
 * from The Modern System Design Interview Guide.
 */

export function renderHttpStatusCodesContent(topic) {
  const statusClasses = [
    {
      range: "1xx",
      category: "Informational",
      definition: "Request received, protocol handshake continuing",
      keyCodes: "100 Continue, 101 Switching Protocols (WebSockets), 103 Early Hints (Preload CSS/JS)"
    },
    {
      range: "2xx",
      category: "Success",
      definition: "Action successfully received, understood, and accepted",
      keyCodes: "200 OK, 201 Created (Location header), 202 Accepted (Async jobs), 204 No Content (DELETE)"
    },
    {
      range: "3xx",
      category: "Redirection",
      definition: "Further action required to complete the request",
      keyCodes: "301 Moved Permanently, 302 Found, 304 Not Modified, 307 Temporary Redirect, 308 Permanent"
    },
    {
      range: "4xx",
      category: "Client Error",
      definition: "Request contains bad syntax, missing auth, or resource unavailable",
      keyCodes: "400 Bad Request, 401 Unauthorized (AuthN), 403 Forbidden (AuthZ), 404 Not Found, 409 Conflict, 429 Rate Limit"
    },
    {
      range: "5xx",
      category: "Server Error",
      definition: "Server failed to fulfill an apparently valid client request",
      keyCodes: "500 Internal Error, 502 Bad Gateway (Upstream crash), 503 Unavailable (Overload), 504 Timeout"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How does an edge reverse proxy (NGINX / AWS ALB) determine whether to emit a 502 Bad Gateway vs. a 504 Gateway Timeout?",
      answer: `<strong>502 Bad Gateway:</strong> The reverse proxy sent a request to the upstream backend application, and the upstream returned an invalid or illegal HTTP response—such as a connection reset (TCP RST), an immediate process segfault/crash, or unparseable corrupted headers.<br/><strong>504 Gateway Timeout:</strong> The upstream backend is alive, but processing the request took longer than the reverse proxy's configured upstream timeout threshold (e.g. <code>proxy_read_timeout 60s</code> in NGINX), causing the proxy to sever the connection and return 504 to the client.`
    },
    {
      qNum: "Q2",
      question: "Why were 307 Temporary Redirect and 308 Permanent Redirect introduced when 301 and 302 already existed?",
      answer: `Historical browser ambiguity: When RFC 1945 specified <strong>301</strong> and <strong>302</strong>, browsers frequently violated the spec by mutating a <code>POST</code> request into a <code>GET</code> request when following the redirect URL. RFC 7231 explicitly introduced <strong>307 (Temporary)</strong> and <strong>308 (Permanent)</strong> to guarantee <strong>method preservation</strong>: if a client sends a <code>POST /pay</code> and receives a 307 or 308, it <em>must</em> repeat the exact same <code>POST</code> method with the exact same payload body at the new URL.`
    },
    {
      qNum: "Q3",
      question: "In an OAuth2 / JWT microservice architecture, when MUST a service return 401 vs. 403?",
      answer: `<strong>401 Unauthorized (Authentication Failure):</strong> The client failed to prove who they are. The <code>Authorization</code> header is missing, expired, syntactically malformed, or the JWT signature check failed. The response should include <code>WWW-Authenticate</code>.<br/><strong>403 Forbidden (Authorization Failure):</strong> The server knows exactly who the user is (valid JWT), but the user's role/scope does not permit accessing this specific tenant or resource (e.g. regular user attempting <code>DELETE /admin/database</code>). Retrying with the same credentials will never succeed.`
    },
    {
      qNum: "Q4",
      question: "What headers should accompany a 429 Too Many Requests response in production APIs?",
      answer: `Production rate limiters should always provide programmatic retry telemetry: <code>Retry-After: 30</code> (seconds to wait before retrying), alongside RFC draft rate-limiting headers: <code>X-RateLimit-Limit: 1000</code> (max requests allowed per window), <code>X-RateLimit-Remaining: 0</code> (remaining quota), and <code>X-RateLimit-Reset: 1726647100</code> (Unix timestamp when quota refreshes). This allows clients to implement jittered exponential backoff rather than hammering the gateway.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 30, 31, 32: HTTP STATUS CODES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              2.5 HTTP Status Codes: 200 vs 201, 301 vs 302, 401 vs 403, 502 vs 503 vs 504
            </h2>
          </div>
        </div>

        <!-- Definition Callout -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            HTTP status codes are standardized 3-digit integers issued by web servers and proxies to communicate the result of an HTTP request. In system design interviews, precision with status codes separates senior engineers from juniors: status codes dictate how reverse proxies cache, how clients retry, and how distributed monitoring alerts trigger.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
            <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-2.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-slate-400">1xx · Informational</span>
              <span class="text-[11.5px] text-slate-300">100, 101, 103</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-2.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300">2xx · Success</span>
              <span class="text-[11.5px] text-slate-300">200, 201, 202, 204</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-2.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300">3xx · Redirection</span>
              <span class="text-[11.5px] text-slate-300">301, 302, 304, 307, 308</span>
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-2.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-amber-300">4xx · Client Error</span>
              <span class="text-[11.5px] text-slate-300">400, 401, 403, 404, 409, 429</span>
            </div>
            <div class="bg-[#0F1626] border border-rose-500/30 rounded-lg p-2.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-rose-300">5xx · Server Error</span>
              <span class="text-[11.5px] text-slate-300">500, 502, 503, 504</span>
            </div>
          </div>
        </div>

        <!-- THREE CRITICAL COMPARISON MATRICES -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Card 1: 301 vs 302 vs 307 vs 308 -->
          <div class="bg-[#0F1626] border border-cyan-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <div class="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span class="font-code text-[11.5px] font-bold text-cyan-300 uppercase">301 / 302 vs. 307 / 308</span>
              <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Method Rules</span>
            </div>
            <div class="text-[12px] text-slate-300 flex flex-col gap-2 font-sans leading-relaxed">
              <div>
                <strong class="text-white font-code text-[11px]">301 vs 308 (Permanent):</strong>
                <p class="text-slate-400 text-[11.5px]">Cached indefinitely by browsers. 301 allows browsers to change POST to GET. <strong>308 strictly preserves HTTP method</strong>.</p>
              </div>
              <div>
                <strong class="text-white font-code text-[11px]">302 vs 307 (Temporary):</strong>
                <p class="text-slate-400 text-[11.5px]">Not cached by default. 302 may mutate POST to GET. <strong>307 strictly preserves method and payload body</strong>.</p>
              </div>
            </div>
          </div>

          <!-- Card 2: 401 vs 403 -->
          <div class="bg-[#0F1626] border border-amber-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <div class="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <span class="font-code text-[11.5px] font-bold text-amber-300 uppercase">401 vs. 403</span>
              <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">AuthN vs AuthZ</span>
            </div>
            <div class="text-[12px] text-slate-300 flex flex-col gap-2 font-sans leading-relaxed">
              <div>
                <strong class="text-white font-code text-[11px]">401 Unauthorized (AuthN):</strong>
                <p class="text-slate-400 text-[11.5px]">"Who are you?" Missing, expired, or invalid token. Client should re-authenticate or refresh token.</p>
              </div>
              <div>
                <strong class="text-white font-code text-[11px]">403 Forbidden (AuthZ):</strong>
                <p class="text-slate-400 text-[11.5px]">"I know who you are, but you cannot enter." Valid identity, but lacks required role/RBAC permissions. Re-authenticating won't help.</p>
              </div>
            </div>
          </div>

          <!-- Card 3: 502 vs 503 vs 504 -->
          <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <div class="flex items-center justify-between border-b border-rose-500/20 pb-2">
              <span class="font-code text-[11.5px] font-bold text-rose-300 uppercase">502 vs. 503 vs. 504</span>
              <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Upstream Failures</span>
            </div>
            <div class="text-[12px] text-slate-300 flex flex-col gap-2 font-sans leading-relaxed">
              <div>
                <strong class="text-white font-code text-[11px]">502 Bad Gateway:</strong>
                <p class="text-slate-400 text-[11.5px]">Proxy received illegal/invalid response from upstream (backend crashed, TCP reset, bad headers).</p>
              </div>
              <div>
                <strong class="text-white font-code text-[11px]">503 Service Unavailable:</strong>
                <p class="text-slate-400 text-[11.5px]">Server is overloaded or down for planned maintenance (often with <code>Retry-After</code>).</p>
              </div>
              <div>
                <strong class="text-white font-code text-[11px]">504 Gateway Timeout:</strong>
                <p class="text-slate-400 text-[11.5px]">Upstream took too long to answer; proxy hit its internal read timeout (e.g. 60s).</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FULL STATUS CODE TAXONOMY TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            HTTP STATUS CLASSES & KEY PRODUCTION CODES
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3 w-28">Class</th>
                  <th class="p-3 w-40">Category</th>
                  <th class="p-3">Core Definition</th>
                  <th class="p-3">Essential System Design Status Codes</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${statusClasses.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-code font-bold text-cyan-300">${row.range}</td>
                    <td class="p-3 font-semibold text-white">${row.category}</td>
                    <td class="p-3 text-slate-300 leading-relaxed">${row.definition}</td>
                    <td class="p-3 font-code text-[11.5px] text-indigo-300">${row.keyCodes}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout: Senior Perspective - Designing Idempotent APIs -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: DESIGNING IDEMPOTENT & ASYNCHRONOUS APIS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, never restrict yourself to <code>200 OK</code>. Leverage semantic status codes to design production-grade contracts:
          </p>
          <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-1.5 pt-1">
            <li>• <strong class="text-emerald-300 font-code">201 Created + Location Header:</strong> Return when a resource is created synchronously; provide the URI to the created entity.</li>
            <li>• <strong class="text-emerald-300 font-code">202 Accepted:</strong> Return immediately for long-running batch or async operations (video encoding, report generation); return a job ID and status endpoint for polling.</li>
            <li>• <strong class="text-emerald-300 font-code">204 No Content:</strong> Return for successful <code>DELETE</code> or update operations where no response body needs to be transmitted.</li>
            <li>• <strong class="text-emerald-300 font-code">409 Conflict:</strong> Return for optimistic locking failures, concurrent duplicate unique key creation, or state-machine race conditions.</li>
            <li>• <strong class="text-emerald-300 font-code">429 Too Many Requests + Retry-After:</strong> Return to throttle clients gracefully and instruct automated SDKs when to retry.</li>
          </ul>
        </div>

        <!-- Orange Callout: The "200 OK with Error Body" Antipattern -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE "200 OK WITH ERROR BODY" ANTIPATTERN
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            A catastrophic antipattern in distributed architectures is returning <code>HTTP 200 OK</code> with an error payload like <code>{"success": false, "error": "User not found"}</code>. This breaks the entire web infrastructure: CDNs and reverse proxies cache 200 responses, serving the error to subsequent healthy users; API Gateways record the request as successful in latency/SLO dashboards, blinding on-call engineers; and standard HTTP client retry interceptors never trigger automatic retries. Always emit semantic 4xx/5xx status codes.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            When should an API return 202 Accepted instead of 200 OK or 201 Created?
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
            Never return 200 OK for errors. Use 201 for sync creates, 202 for async jobs, 401 for identity failures, 403 for permission violations, 502 for upstream crashes, and 504 for upstream timeouts. Precise status codes empower edge proxies to cache, retry, and protect upstream systems automatically.
          </p>
        </div>

        <!-- Page 32 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 32</span>
        </div>

      </div>

    </div>
  `;
}
