/**
 * 3.3 Single Sign-On (SSO): OAuth 2.0 vs. OpenID Connect vs. SAML - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 40, 41, and 42
 * from The Modern System Design Interview Guide.
 */

export function renderSsoOAuthOidcContent(topic) {
  const ssoComparisonRows = [
    {
      dimension: "Primary Objective",
      saml: "Enterprise Identity Federation & SSO",
      oauth: "Delegated API Authorization (Permissions)",
      oidc: "User Authentication & Identity (AuthN)"
    },
    {
      dimension: "Data Serialization",
      saml: "Heavy XML Assertions with XML Signatures",
      oauth: "JSON payloads, opaque or JWT access tokens",
      oidc: "JSON Web Tokens (JWT) for ID tokens"
    },
    {
      dimension: "Transport Protocol",
      saml: "HTTP POST / Redirect Bindings (Browser-only)",
      oauth: "REST / HTTPS API endpoints",
      oidc: "REST / HTTPS API endpoints (built on OAuth 2.0)"
    },
    {
      dimension: "Token Standard",
      saml: "SAML 2.0 XML Assertion token",
      oauth: "Bearer Access Token (opaque or JWT)",
      oidc: "ID Token (JWT) + Access Token + Refresh Token"
    },
    {
      dimension: "Mobile & SPA Fit",
      saml: "Poor (Heavy XML parsing, cookie reliance)",
      oauth: "Excellent (JSON / REST native)",
      oidc: "Native (Authorization Code + PKCE)"
    },
    {
      dimension: "Optimal Use Case",
      saml: "Legacy corporate IT, Active Directory, Okta B2B",
      oauth: "Third-party delegated access (e.g. Google Drive API)",
      oidc: "Modern consumer & SaaS Single Sign-On (SSO)"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the exact functional distinction between the id_token and access_token in OpenID Connect?",
      answer: `<strong>id_token:</strong> Issued strictly for the <em>Client Application</em>. It contains user profile claims (<code>sub</code>, <code>email</code>, <code>name</code>, <code>iat</code>, <code>exp</code>) formatted as a signed JWT. Its sole purpose is <strong>Authentication (AuthN)</strong>: proving to the client that the user successfully authenticated.<br/><strong>access_token:</strong> Issued for the <em>Resource Server (API)</em>. It carries authorization scopes (e.g. <code>read:orders</code>). The client application never inspects it; it passes it in the <code>Authorization: Bearer</code> header so the backend API can authorize the request.`
    },
    {
      qNum: "Q2",
      question: "How does PKCE (Proof Key for Code Exchange) prevent authorization code interception attacks?",
      answer: `On public clients (SPAs, mobile apps), an attacker on the device could register the same custom URI redirect scheme (e.g. <code>myapp://callback</code>) and intercept the <code>authorization_code</code> returned by the IdP. With <strong>PKCE (RFC 7636)</strong>, the client generates a random <strong>code_verifier</strong> and hashes it into a <strong>code_challenge = SHA256(verifier)</strong> before redirecting. When exchanging the code for tokens, the client sends the secret <code>code_verifier</code>. Even if an attacker intercepted the code, they cannot redeem it without the original unhashed verifier.`
    },
    {
      qNum: "Q3",
      question: "What is Single Logout (SLO) and why is it notoriously difficult in distributed microservices?",
      answer: `In <strong>Single Logout (SLO)</strong>, when a user logs out of the central IdP (e.g. Okta), they should be logged out of all connected applications (Slack, Google Workspace, GitHub). In distributed architectures, applications cache stateless JWTs locally. When IdP logout occurs, the IdP must notify all connected apps via <em>Back-Channel Logout HTTP webhooks</em> or broadcast events over a message bus. If an app's webhook fails or is unreachable, the user remains logged in until their local access token expires.`
    },
    {
      qNum: "Q4",
      question: "What is the concrete difference between OAuth 2.0 Scopes and Application Permissions?",
      answer: `<strong>OAuth Scopes</strong> (e.g. <code>scope=photos.read</code>) represent <em>delegated client consent</em>: what specific resources the end user authorized a third-party app to access on their behalf. <strong>Application Permissions</strong> represent <em>internal authorization</em>: what actions the user themselves is permitted to perform in the system. An app can never have more privileges than the user, even if the requested scope is broader.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 40, 41, 42: SSO, OAUTH 2.0, OIDC, AND SAML -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              3.3 Single Sign-On (SSO): OAuth 2.0 vs. OpenID Connect (OIDC) vs. SAML
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            A fundamental interview principle: <strong>Authentication (AuthN)</strong> answers <em>\"Who are you?\"</em> while <strong>Authorization (AuthZ)</strong> answers <em>\"What are you allowed to do?\"</em> Conflating these two concepts is the most common failure mode in security interviews.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-blue-300 uppercase">SAML 2.0 (Enterprise Federation)</span>
              <p class="text-[12px] text-slate-300">XML-based identity federation standard. Battle-tested in legacy enterprise IT, corporate intranets, and Active Directory environments.</p>
            </div>

            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">OAuth 2.0 (Delegated AuthZ)</span>
              <p class="text-[12px] text-slate-300">Delegation framework allowing an app to access resources on behalf of a user. Issues access tokens; does NOT provide authentication.</p>
            </div>

            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">OpenID Connect (Modern AuthN)</span>
              <p class="text-[12px] text-slate-300">Identity layer built directly on top of OAuth 2.0. Introduces signed ID Tokens (JWT) for standard single sign-on across web and mobile.</p>
            </div>
          </div>
        </div>

        <!-- AUTHORIZATION CODE FLOW WITH PKCE DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              OIDC AUTHORIZATION CODE FLOW WITH PKCE (RFC 7636)
            </span>
            <span class="text-[11px] font-code text-slate-500">Gold Standard SSO Flow</span>
          </div>

          <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono bg-[#0F1626] p-4 rounded-xl border border-slate-700/50">
[ User / Browser ]         [ Client SPA / App ]            [ Identity Provider (IdP) ]      [ Resource API ]
        │                          │                                     │                         │
        │── 1. Clicks \"Log In\" ───►│                                     │                         │
        │                          │── 2. Create code_verifier & challenge│                         │
        │◄── 3. Redirect to IdP ───┴───── (with code_challenge) ────────►│                         │
        │                                                                │                         │
        │════════════ 4. User Authenticates & Consents at IdP ══════════►│                         │
        │                                                                │                         │
        │◄── 5. Redirect with auth_code ─────────────────────────────────┤                         │
        │─── 6. Deliver auth_code ─►│                                    │                         │
        │                          │── 7. POST /token ──────────────────►│                         │
        │                          │      (auth_code + code_verifier)    │                         │
        │                          │◄── 8. Return id_token & access_token│                         │
        │                          │                                                               │
        │                          │── 9. GET /api/user (Authorization: Bearer access_token) ─────►│
        │                          │◄── 10. Validates Token & Returns Data ────────────────────────┤
          </div>

          <div class="flex items-center justify-between text-[11px] font-code text-cyan-300 pt-1">
            <span>▲ PKCE ensures intercepted auth_codes cannot be exchanged without the raw code_verifier</span>
            <span class="text-slate-500 font-sans">OAuth 2.1 mandates PKCE for all clients</span>
          </div>
        </div>

        <!-- 3-WAY COMPARISON MATRIX TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            SAML 2.0 VS. OAUTH 2.0 VS. OPENID CONNECT: PROTOCOL COMPARISON
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3 w-40">Dimension</th>
                  <th class="p-3 text-blue-200">SAML 2.0</th>
                  <th class="p-3 text-amber-200">OAuth 2.0</th>
                  <th class="p-3 text-emerald-200">OpenID Connect (OIDC)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12px]">
                ${ssoComparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white font-code text-[11.5px]">${row.dimension}</td>
                    <td class="p-3 text-slate-300">${row.saml}</td>
                    <td class="p-3 text-slate-300">${row.oauth}</td>
                    <td class="p-3 text-emerald-300 font-semibold">${row.oidc}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: OAuth 2.0 is NOT Authentication -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE PSEUDO-AUTHENTICATION ANTIPATTERN: OAUTH 2.0 IS NOT AUTHENTICATION
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            A frequent senior interview blunder is claiming "we use OAuth 2.0 to log the user into our web app." An OAuth 2.0 access token is an authorization credential for an API—it contains no standard user profile data, no issuance timestamp, and no audience bound to your client. Checking whether an access token exists merely proves that <em>some user consented to some scopes</em>, not who they are or whether they are still active. <strong>Always use OpenID Connect (OIDC)</strong>, which layers an <code>id_token</code> JWT over OAuth 2.0 to provide cryptographically verified identity.
          </p>
        </div>

        <!-- Green Callout: Senior Perspective - Why PKCE is Mandatory -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: WHY PKCE IS MANDATORY FOR ALL CLIENTS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Historically, PKCE was recommended only for "public clients" (mobile apps and SPAs) that could not keep a <code>client_secret</code> safe from decompilation. However, the emerging <strong>OAuth 2.1 specification</strong> mandates PKCE for <em>all</em> clients, including confidential server-rendered applications. PKCE cryptographically binds the authorization code request to the token redemption request, preventing authorization code injection attacks and CSRF vulnerabilities even if an attacker compromises intermediate proxy logs or browser history.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            What is Single Logout (SLO) and why is it notoriously difficult to implement across distributed microservices?
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
            State clearly in interviews: SAML 2.0 is for enterprise legacy identity federation; OAuth 2.0 is an authorization framework for API permissions; and OpenID Connect (OIDC) is the modern authentication standard built on OAuth 2.0. Always use Authorization Code Flow with PKCE for single sign-on.
          </p>
        </div>

        <!-- Page 42 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 42</span>
        </div>

      </div>

    </div>
  `;
}
