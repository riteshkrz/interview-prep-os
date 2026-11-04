/**
 * 3.3 Single Sign-On (SSO): OAuth 2.0 vs. OpenID Connect vs. SAML - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 40, 41, and 42
 * from The Modern System Design Interview Guide.
 */

export function renderSsoOAuthOidcContent(topic) {
  const ssoComparisonRows = [
    {
      dimension: "Everyday Mental Model",
      saml: "Government Passport & Visa: Heavy stamped paper documents for corporate border control",
      oauth: "Car Valet Key: Lets the valet park your car, but won't open your locked glovebox or trunk",
      oidc: "Real ID Driver's License: Contains your photo, birthdate, and full identity verification"
    },
    {
      dimension: "Primary Objective",
      saml: "Enterprise Identity Federation & B2B SSO (AuthN + AuthZ)",
      oauth: "Delegated API Authorization (Granting permissions to third-party apps)",
      oidc: "User Identity Verification & Single Sign-On (AuthN built on OAuth 2.0)"
    },
    {
      dimension: "Data Serialization",
      saml: "Heavy XML Assertions with complex XML digital signatures",
      oauth: "Lightweight JSON payloads, opaque strings or JWT access tokens",
      oidc: "Signed JSON Web Tokens (JWT) for ID tokens (Header.Payload.Signature)"
    },
    {
      dimension: "Transport Protocol",
      saml: "HTTP POST / Redirect Bindings (Strictly browser-mediated redirects)",
      oauth: "REST / HTTPS API endpoints (Works on any device or service)",
      oidc: "REST / HTTPS API endpoints (Built directly on OAuth 2.0 transport)"
    },
    {
      dimension: "Token Standard",
      saml: "SAML 2.0 XML Assertion token",
      oauth: "Bearer Access Token (Opaque string or JWT for APIs)",
      oidc: "ID Token (JWT profile) + Access Token (API scopes) + Refresh Token"
    },
    {
      dimension: "Mobile & SPA Fit",
      saml: "Poor (Heavy XML parsing, strict cookie reliance, mobile hostile)",
      oauth: "Excellent (JSON / REST native, works effortlessly across mobile SDKs)",
      oidc: "Native & Secure (Authorization Code Grant with PKCE)"
    },
    {
      dimension: "Optimal Use Case",
      saml: "Legacy corporate IT, Active Directory / ADFS, enterprise Okta B2B portals",
      oauth: `Third-party delegated access (e.g. "Allow Spotify to view your Facebook friends")`,
      oidc: `Modern consumer & SaaS Single Sign-On ("Log in with Google / Apple / GitHub")`
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the exact functional distinction between the id_token and access_token in OpenID Connect?",
      answer: `<strong>id_token (Authentication / AuthN):</strong> Issued strictly for the <em>Client Application (Frontend / SPA / Mobile)</em>. It contains user identity claims (<code>sub</code>, <code>email</code>, <code>name</code>, <code>iat</code>, <code>exp</code>) formatted as a signed JWT. Its sole purpose is proving to the frontend who just logged in so the UI can render their profile and avatar. The frontend parses and inspects this token.
      <br/><br/>
      <strong>access_token (Authorization / AuthZ):</strong> Issued strictly for the <em>Resource Server (Backend API)</em>. It carries authorized API scopes (e.g. <code>read:invoices</code>, <code>write:reports</code>). The frontend client never parses this token—it treats it as an opaque credential and passes it in the <code>Authorization: Bearer &lt;token&gt;</code> header so the backend API can authorize incoming requests.`
    },
    {
      qNum: "Q2",
      question: "How does PKCE (Proof Key for Code Exchange) prevent authorization code interception attacks?",
      answer: `On public clients (mobile apps and Single Page Applications), an attacker or malicious app on the same device could register the same custom URI scheme (e.g. <code>myapp://callback</code>) and steal the <code>authorization_code</code> returned by the identity provider.
      <br/><br/>
      <strong>PKCE (RFC 7636) eliminates this attack completely:</strong>
      <br/>
      1. <strong>Code Verifier:</strong> Before initiating login, the client generates a high-entropy cryptographically random string (the <code>code_verifier</code>).
      <br/>
      2. <strong>Code Challenge:</strong> The client computes <code>code_challenge = BASE64URL(SHA256(code_verifier))</code> and sends only the challenge to the authorization server during the initial redirect.
      <br/>
      3. <strong>Token Exchange Verification:</strong> When exchanging the returned authorization code for tokens via POST <code>/token</code>, the client sends the raw <code>code_verifier</code>. The Auth Server hashes it and verifies it matches the original challenge.
      <br/>
      Even if an attacker intercepts the authorization code in flight, they cannot redeem it because they do not know the unhashed <code>code_verifier</code>!`
    },
    {
      qNum: "Q3",
      question: "What is Single Logout (SLO) and why is it notoriously difficult in distributed microservices?",
      answer: `In <strong>Single Logout (SLO)</strong>, when a user clicks "Log Out" at the central identity provider (e.g. Okta), they should be logged out of all connected applications (Slack, Google Workspace, GitHub) simultaneously.
      <br/><br/>
      In modern distributed systems, applications cache stateless JWT access tokens locally. Because these tokens are validated offline without querying the central IdP on every request, the applications have no built-in way of knowing the user logged out!
      <br/><br/>
      <strong>Production Solutions:</strong>
      <br/>
      1. <strong>Back-Channel Logout (OIDC Webhooks):</strong> The central IdP fires an asynchronous HTTP POST webhook to each registered app's backend to invalidate their local session. If an app is down or behind a firewall, logout fails silently.
      <br/>
      2. <strong>Short-Lived Access Tokens:</strong> Rely on 5-to-15 minute access token expiration. When the token expires and the app attempts to use the refresh token, the IdP rejects the refresh request.`
    },
    {
      qNum: "Q4",
      question: "What is the concrete difference between OAuth 2.0 Scopes and Internal Application Permissions?",
      answer: `<strong>OAuth Scopes (e.g. scope=calendar.read):</strong> Represent <em>delegated user consent</em>. It defines what subset of the user's data a third-party application is allowed to access on their behalf.
      <br/><br/>
      <strong>Application Permissions (Internal RBAC/ABAC):</strong> Represent <em>what the user themselves is actually authorized to do</em> inside the system.
      <br/><br/>
      <em>The Golden Security Rule:</em> An application can <strong>never have more authority than the consenting user</strong>. If an app requests <code>scope=admin.delete_user</code>, but the logged-in user is a regular viewer, the backend API must reject the deletion request regardless of the granted OAuth scope.`
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
              8.4 Single Sign-On (SSO): OAuth 2.0 vs. OpenID Connect (OIDC) vs. SAML 2.0
            </h2>
          </div>
          <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed pl-4">
            A fundamental interview principle: <strong>Authentication (AuthN)</strong> answers <em>"Who are you?"</em> while <strong>Authorization (AuthZ)</strong> answers <em>"What are you allowed to do?"</em> Confusing these two concepts is the most common failure mode in security and system design interviews.
          </p>
        </div>

        <!-- Everyday Mental Model Banner -->
        <div class="bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-900 border border-indigo-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-indigo-400">psychology</span>
            <span class="font-code text-[12px] font-bold text-indigo-300 uppercase tracking-wider">
              Everyday Mental Model: Valet Key vs. Driver's License
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
            <div class="bg-[#0F1626]/80 border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-blue-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">badge</span>
                SAML 2.0 = Enterprise Security Passport
              </strong>
              <p class="text-slate-300 leading-relaxed">
                A heavy, stamped, multi-page paper credential (XML). Perfect for traditional enterprise IT and corporate intranets, but clunky and poorly suited for mobile apps and single-page applications.
              </p>
            </div>
            <div class="bg-[#0F1626]/80 border border-amber-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-amber-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">key</span>
                OAuth 2.0 = Car Valet Key (Authorization)
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Lets the parking valet operate your vehicle, but won't unlock the glove compartment or trunk. It doesn't prove who you are; it delegates specific permissions (scopes) to a third party.
              </p>
            </div>
            <div class="bg-[#0F1626]/80 border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-emerald-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">verified_user</span>
                OIDC = Government Driver's License (AuthN)
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Built directly on top of OAuth 2.0. Adds an <code>id_token</code> JWT that contains your verified identity, email, and photo. Proves who you are when logging into apps ("Log in with Google").
              </p>
            </div>
          </div>
        </div>

        <!-- 3 Protocol Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
          <div class="bg-[#0F1626] border border-blue-500/30 rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] font-bold text-blue-300 uppercase">SAML 2.0 (Enterprise Federation)</span>
            <p class="text-[12px] text-slate-300 leading-relaxed">XML-based identity federation standard. Battle-tested in legacy corporate IT, on-premise Active Directory (ADFS), and enterprise Okta B2B portals.</p>
          </div>

          <div class="bg-[#0F1626] border border-amber-500/30 rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] font-bold text-amber-300 uppercase">OAuth 2.0 (Delegated AuthZ)</span>
            <p class="text-[12px] text-slate-300 leading-relaxed">Delegation framework allowing an app to access resources on behalf of a user. Issues access tokens; does NOT provide identity authentication.</p>
          </div>

          <div class="bg-[#0F1626] border border-emerald-500/30 rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">OpenID Connect (Modern AuthN)</span>
            <p class="text-[12px] text-slate-300 leading-relaxed">Identity layer built directly on top of OAuth 2.0. Introduces signed ID Tokens (JWT) for standard single sign-on across modern web and mobile apps.</p>
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
        │── 1. Clicks "Log In" ───►│                                     │                         │
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
                    <td class="p-3 text-slate-300 leading-relaxed">${row.saml}</td>
                    <td class="p-3 text-slate-300 leading-relaxed">${row.oauth}</td>
                    <td class="p-3 text-emerald-300 font-semibold leading-relaxed">${row.oidc}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: OAuth 2.0 is NOT Authentication -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2 font-sans">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE PSEUDO-AUTHENTICATION ANTIPATTERN: OAUTH 2.0 IS NOT AUTHENTICATION
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            A frequent senior interview blunder is claiming "we use OAuth 2.0 to log the user into our web app." An OAuth 2.0 access token is an authorization credential for an API—it contains no standard user profile data, no issuance timestamp, and no audience bound to your client. Checking whether an access token exists merely proves that <em>some user consented to some scopes</em>, not who they are or whether they are still active. <strong>Always use OpenID Connect (OIDC)</strong>, which layers an <code>id_token</code> JWT over OAuth 2.0 to provide cryptographically verified identity.
          </p>
        </div>

        <!-- Green Callout: Senior Perspective - Why PKCE is Mandatory -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2 font-sans">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            STAFF PERSPECTIVE: WHY PKCE IS MANDATORY FOR ALL CLIENTS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            Historically, PKCE was recommended only for "public clients" (mobile apps and SPAs) that could not keep a <code>client_secret</code> safe from decompilation. However, the emerging <strong>OAuth 2.1 specification</strong> mandates PKCE for <em>all</em> clients, including confidential server-rendered applications. PKCE cryptographically binds the authorization code request to the token redemption request, preventing authorization code injection attacks and CSRF vulnerabilities even if an attacker compromises intermediate proxy logs or browser history.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px] font-sans">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            What is Single Logout (SLO) and why is it notoriously difficult to implement across distributed microservices?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4 font-sans">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS &amp; STAFF PROBES
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-1.5 pb-3 border-b border-[#24314A]/50 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[13.5px] font-bold text-white">${item.question}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-5 flex flex-col gap-2 shadow-lg shadow-indigo-950/40 font-sans">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[13.5px] font-medium text-white leading-relaxed">
            State clearly in interviews: SAML 2.0 is for enterprise legacy identity federation; OAuth 2.0 is an authorization framework for API permissions; and OpenID Connect (OIDC) is the modern authentication standard built on OAuth 2.0. Always use Authorization Code Flow with PKCE for single sign-on.
          </p>
        </div>

        <!-- Page 42 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Pages 40–42 · Section 8.4</span>
        </div>

      </div>

    </div>
  `;
}
