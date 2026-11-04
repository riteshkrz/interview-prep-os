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
      definition: "Request received, protocol handshake continuing in progress",
      keyCodes: "100 Continue, 101 Switching Protocols (WebSockets), 103 Early Hints (Preload CSS/JS)"
    },
    {
      range: "2xx",
      category: "Success",
      definition: "Client request was successfully received, understood, and processed",
      keyCodes: "200 OK, 201 Created (with Location header), 202 Accepted (Async jobs), 204 No Content (DELETE)"
    },
    {
      range: "3xx",
      category: "Redirection",
      definition: "Further action or navigation required to complete the request",
      keyCodes: "301 Moved Permanently, 302 Found, 304 Not Modified (Cache hit), 307 Temporary Redirect, 308 Permanent"
    },
    {
      range: "4xx",
      category: "Client Error",
      definition: "The client made an error (bad syntax, missing auth, non-existent path)",
      keyCodes: "400 Bad Request, 401 Unauthorized (AuthN), 403 Forbidden (AuthZ), 404 Not Found, 409 Conflict, 429 Rate Limit"
    },
    {
      range: "5xx",
      category: "Server Error",
      definition: "The server failed to fulfill an otherwise valid client request",
      keyCodes: "500 Internal Server Error, 502 Bad Gateway (Upstream crash), 503 Unavailable (Overload), 504 Gateway Timeout"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How does a Reverse Proxy (NGINX / AWS ALB) determine whether to emit a 502 Bad Gateway vs. a 504 Gateway Timeout?",
      answer: `This is a classic senior debugging question:
      <ul class='list-disc pl-5 mt-1.5 space-y-1 text-slate-300'>
        <li><strong>502 Bad Gateway (Upstream Crashed / Reset):</strong> The proxy sent a request to the backend microservice, and the backend closed the socket immediately (TCP RST), segfaulted, died from Out-Of-Memory (OOM-killed by Linux), or returned garbled, invalid HTTP headers. The proxy got an answer, but it was illegal.</li>
        <li><strong>504 Gateway Timeout (Upstream Took Too Long):</strong> The backend microservice is alive and processing, but it failed to respond within the proxy's configured timeout window (e.g. <code>proxy_read_timeout 60s</code> in NGINX). This usually points to a slow unindexed SQL query, a deadlocked database transaction, or a slow third-party API call.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "Why were 307 Temporary Redirect and 308 Permanent Redirect created when 301 and 302 already existed?",
      answer: `Historical browser non-compliance:
      <br/><br/>
      When HTTP/1.0 defined <strong>301</strong> and <strong>302</strong>, browsers frequently violated the spec by converting <code>POST</code> requests into <code>GET</code> requests when following the redirect location.
      <br/><br/>
      If a user submitted a credit card form via <code>POST /checkout</code>, an unexpected 301 redirect would cause the browser to send a <code>GET /checkout</code> with no payload, dropping all payment data!
      <br/><br/>
      RFC 7231 introduced <strong>307 (Temporary)</strong> and <strong>308 (Permanent)</strong> to strictly enforce <strong>HTTP Method Preservation</strong>: the client <em>must</em> re-send the exact same HTTP method (POST remains POST) with the exact same body payload to the new URL.`
    },
    {
      qNum: "Q3",
      question: "In an OAuth2 / JWT microservice architecture, when MUST an API return 401 vs. 403?",
      answer: `Interviewers check if you know the difference between <strong>Authentication (AuthN)</strong> and <strong>Authorization (AuthZ)</strong>:
      <ul class='list-disc pl-5 mt-1.5 space-y-1 text-slate-300'>
        <li><strong>401 Unauthorized (Who are you? - Authentication Failure):</strong> The user failed to prove their identity. The <code>Authorization</code> header is missing, expired, or the JWT digital signature is forged. The client should prompt for login or use a Refresh Token.</li>
        <li><strong>403 Forbidden (I know who you are, but you cannot enter - Authorization Failure):</strong> The user proved their identity (valid JWT token), but their role lacks permission to touch this resource (e.g. a regular user attempting <code>DELETE /admin/users</code>). Retrying with the same login will NEVER succeed.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "What headers must accompany a 429 Too Many Requests response in production APIs?",
      answer: `Never return a bare 429 status code. Production rate limiters must return standard telemetry headers:
      <ul class='list-disc pl-5 mt-1.5 space-y-1 text-slate-300'>
        <li><code>Retry-After: 30</code> — Tells the client's automated SDK to pause for exactly 30 seconds before retrying.</li>
        <li><code>X-RateLimit-Limit: 1000</code> — The maximum requests allowed in this quota window.</li>
        <li><code>X-RateLimit-Remaining: 0</code> — How many requests remain in the current window.</li>
        <li><code>X-RateLimit-Reset: 1727500000</code> — The Unix timestamp when the user's quota resets.</li>
      </ul>`
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
              2.5 HTTP Status Codes: The Essential Production Taxonomy
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Mastering 200 vs 201, 301 vs 308, 401 vs 403, and 502 vs 503 vs 504 in System Design
          </p>
        </div>

        <!-- SIMPLE MENTAL MODEL BOX: THE 5-FAMILY CHEATSHEET -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: 5 STATUS FAMILIES
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-[12px] font-sans">
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-slate-700/60">
              <strong class="text-slate-300 block mb-1">1xx: "Hold on"</strong>
              <span class="text-slate-400">Request received; protocol upgrade or hints continuing.</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-emerald-500/30">
              <strong class="text-emerald-300 block mb-1">2xx: "Here you go!"</strong>
              <span class="text-slate-400">Success! Resource found, created, or accepted for async work.</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-cyan-500/30">
              <strong class="text-cyan-300 block mb-1">3xx: "Go over there"</strong>
              <span class="text-slate-400">Redirect! Resource has moved or cache is still valid (304).</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-amber-500/30">
              <strong class="text-amber-300 block mb-1">4xx: "You messed up"</strong>
              <span class="text-slate-400">Client error: missing token (401), forbidden (403), or rate limited (429).</span>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-rose-500/30">
              <strong class="text-rose-300 block mb-1">5xx: "I messed up"</strong>
              <span class="text-slate-400">Server error: backend crash (502), overload (503), or slow query timeout (504).</span>
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
                <strong class="text-white font-code text-[11px]">301 vs 308 (Permanent Redirect):</strong>
                <p class="text-slate-400 text-[11.5px]">Cached permanently by browsers. 301 allows browsers to mutate POST to GET. <strong>308 strictly preserves the HTTP POST method and payload</strong>.</p>
              </div>
              <div>
                <strong class="text-white font-code text-[11px]">302 vs 307 (Temporary Redirect):</strong>
                <p class="text-slate-400 text-[11.5px]">Not cached. 302 may switch POST to GET. <strong>307 guarantees method preservation</strong> (critical for payment gateway callbacks).</p>
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
                <strong class="text-white font-code text-[11px]">401 Unauthorized (Authentication):</strong>
                <p class="text-slate-400 text-[11.5px]"><em>"Who are you?"</em> The token is missing, expired, or corrupted. The client should redirect to the login screen or refresh token.</p>
              </div>
              <div>
                <strong class="text-white font-code text-[11px]">403 Forbidden (Authorization):</strong>
                <p class="text-slate-400 text-[11.5px]"><em>"I know who you are, but you are not allowed in."</em> Valid user token, but lacks required role or scope. Logging in again won't fix it.</p>
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
                <p class="text-slate-400 text-[11.5px]">Reverse proxy got an illegal response from backend (app crashed, segfaulted, or severed TCP socket abruptly).</p>
              </div>
              <div>
                <strong class="text-white font-code text-[11px]">503 Service Unavailable:</strong>
                <p class="text-slate-400 text-[11.5px]">Server is overloaded or down for planned maintenance (often paired with a <code>Retry-After</code> header).</p>
              </div>
              <div>
                <strong class="text-white font-code text-[11px]">504 Gateway Timeout:</strong>
                <p class="text-slate-400 text-[11.5px]">Backend took too long to answer. The proxy hit its internal read timeout (e.g. slow unindexed database query).</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FULL STATUS CODE TAXONOMY TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            HTTP STATUS CLASSES &amp; KEY PRODUCTION CODES
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5 w-28">Class</th>
                  <th class="p-3.5 w-40">Category</th>
                  <th class="p-3.5">Core Definition</th>
                  <th class="p-3.5">Essential System Design Status Codes</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${statusClasses.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-code font-bold text-cyan-300">${row.range}</td>
                    <td class="p-3.5 font-semibold text-white">${row.category}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.definition}</td>
                    <td class="p-3.5 font-code text-[11.5px] text-indigo-300">${row.keyCodes}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout: Senior Perspective - Designing Idempotent APIs -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: NEVER DEFAULT TO BARE 200 OK
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, show maturity by designing clean, expressive API contracts:
          </p>
          <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-1.5 pt-1">
            <li>• <strong class="text-emerald-300 font-code">201 Created + Location Header:</strong> Return when a resource is created synchronously. Always provide the URL to the new resource in the <code>Location</code> header.</li>
            <li>• <strong class="text-emerald-300 font-code">202 Accepted:</strong> Return immediately for long-running asynchronous background jobs (video transcode, report export) along with a job ID URL for status polling.</li>
            <li>• <strong class="text-emerald-300 font-code">204 No Content:</strong> Return for successful <code>DELETE</code> operations where no body payload needs to travel across the network.</li>
            <li>• <strong class="text-emerald-300 font-code">409 Conflict:</strong> Return for optimistic locking failures or duplicate unique constraints (e.g., username already taken).</li>
            <li>• <strong class="text-emerald-300 font-code">429 Too Many Requests:</strong> Return with <code>Retry-After</code> to signal automated client SDKs to back off gracefully.</li>
          </ul>
        </div>

        <!-- Orange Callout: The "200 OK with Error Body" Antipattern -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            THE CRITICAL PRODUCTION ANTIPATTERN: "HTTP 200 OK WITH ERROR BODY"
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            A devastating antipattern in web APIs is returning <code>HTTP 200 OK</code> with an error payload like <code>{"success": false, "error": "User not found"}</code>.
            <br/><br/>
            <strong>Why this breaks production:</strong>
            <br/>1. <strong>CDNs cache it:</strong> The CDN sees 200 OK and aggressively caches the error page, serving it to every subsequent user!
            <br/>2. <strong>Monitoring is blinded:</strong> Datadog and CloudWatch track 5xx error rates to trigger pager alerts. If errors return 200 OK, the on-call engineer sleeps through a major outage!
            <br/>3. <strong>Client SDKs fail to retry:</strong> Automated retry interceptors only retry on 502/503/504 status codes. A 200 OK fools the client into thinking the operation succeeded.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            When designing an asynchronous file upload service, why should your API return 202 Accepted instead of 200 OK or 201 Created? What headers should accompany it?
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
            Never return 200 OK for errors. Use 201 for synchronous creation, 202 for asynchronous jobs, 401 for authentication identity failures, 403 for permission authorization violations, 502 for upstream process crashes, and 504 for slow query timeouts. Clear status codes allow CDNs to cache properly, client SDKs to retry intelligently, and monitoring alerts to trigger accurately.
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
