/**
 * 3.4 Role-Based Access Control (RBAC) vs. Attribute-Based Access Control (ABAC) - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 42, 43, and 44
 * from The Modern System Design Interview Guide.
 */

export function renderRbacVsAbacContent(topic) {
  const comparisonRows = [
    {
      dimension: "Everyday Mental Model",
      rbac: "VIP Wristband: Fixed colored badge granting broad area access",
      abac: "Smart Scanner: Inspects identity, room sensitivity, time, and VPN context",
      rebac: "Google Docs Graph: Access inherited via team membership and shared folders"
    },
    {
      dimension: "Policy Model",
      rbac: "Static role-to-permission mapping (User → Role → Permission)",
      abac: "Dynamic boolean evaluation over Subject, Action, Resource, Environment attributes",
      rebac: "Graph-based relationship tuples (object#relation@user)"
    },
    {
      dimension: "Granularity",
      rbac: "Coarse-grained (service or module level: Admin, Manager, Viewer)",
      abac: "Fine-grained (contextual, row-level, field-level, temporal, geo)",
      rebac: "Deep object-level sharing and organizational hierarchy inheritance"
    },
    {
      dimension: "Role Explosion Risk",
      rbac: "Severe. Needs combinatorial roles (e.g. EU_Billing_Manager_Weekend)",
      abac: "None. Dynamic combination of attributes at evaluation time",
      rebac: "None. Expressed as graph edge connections between nodes"
    },
    {
      dimension: "Evaluation Latency",
      rbac: "Ultra-fast O(1) in-memory set lookup or bitmask check (< 1 ms)",
      abac: "Moderate (1–10 ms). Policy engine AST parsing & attribute retrieval",
      rebac: "Fast to moderate (2–8 ms). Optimized graph neighbor index traversal"
    },
    {
      dimension: "Auditability & Governance",
      rbac: "Trivial to audit static assignments; hard to audit contextual exceptions",
      abac: "Centralized policy files (Rego/Cedar); audit logs capture full context",
      rebac: "Explicit relation changelogs; full lineage tracing across graphs"
    },
    {
      dimension: "Modern Tech Stack",
      rbac: "Spring Security, AWS IAM basic roles, database join tables",
      abac: "Open Policy Agent (OPA / Rego), AWS Cedar, XACML (legacy)",
      rebac: "Google Zanzibar, Ory Keto, Auth0 Fine-Grained Authorization (FGA)"
    },
    {
      dimension: "Best Fit For",
      rbac: "Internal company portals, simple SaaS products, coarse API scopes",
      abac: "Healthcare (HIPAA), banking, zero-trust enterprise networks",
      rebac: "Google Docs ('anyone with link'), GitHub repos, Figma teams"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you prevent 'Role Explosion' when access control rules expand across hundreds of departments and conditions?",
      answer: `<strong>Role Explosion</strong> occurs in pure RBAC when business requirements introduce conditional constraints (e.g. geography, department, working hours, project assignment). Teams end up creating <code>Finance_EU_Read_Audit</code>, <code>Finance_US_Write_Full</code>, resulting in thousands of unmaintainable roles.
      <br/><br/>
      The industry solution is a <strong>Hybrid RBAC + ABAC architecture</strong>: Keep broad functional roles (e.g. <code>Doctor</code>, <code>Billing_Analyst</code>) in RBAC, but evaluate environmental and resource attributes (e.g. <code>patient.assignedDoctorId == user.id</code> and <code>request.ip in corporate_subnet</code>) via ABAC policy rules at runtime.`
    },
    {
      qNum: "Q2",
      question: "What is the difference between a Policy Enforcement Point (PEP) and a Policy Decision Point (PDP)? How does Open Policy Agent (OPA) fit in?",
      answer: `This is the fundamental architecture of modern decoupled authorization:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>PEP (Policy Enforcement Point):</strong> The proxy, API Gateway, or microservice middleware that intercepts the incoming request, extracts subject/resource tokens, asks the PDP for a decision, and enforces the outcome (permitting the call or returning <code>403 Forbidden</code>).</li>
        <li><strong>PDP (Policy Decision Point):</strong> The isolated engine (e.g. <strong>OPA</strong> running as a local sidecar) that receives input JSON (subject, action, resource, environment), evaluates it against version-controlled policy code (written in <strong>Rego</strong>), and returns a deterministic <code>{"allow": true/false}</code> in sub-millisecond time.</li>
      </ul>
      Decoupling PEP and PDP allows security policies to be updated instantly via GitOps without redeploying application services.`
    },
    {
      qNum: "Q3",
      question: "What is Relationship-Based Access Control (ReBAC) and why did Google develop Zanzibar instead of sticking to ABAC?",
      answer: `In collaborative systems like Google Drive, GitHub, or Figma, access is not determined by static roles or general attributes, but by <strong>relationships and graph inheritance</strong> (e.g. <em>User A is editor of Folder X, which contains Document Y, which is shared with Team Z</em>). Standard ABAC requires complex nested database queries to resolve ownership trees, collapsing database performance. 
      <br/><br/>
      Google built <strong>Zanzibar</strong> to store authorization as a global, distributed directed graph of relation tuples (<code>document:123#viewer@user:456</code>). Zanzibar uses distributed caching (Leopard indexing) to evaluate recursive graph reachability with sub-10ms global latency at billions of checks per second.`
    },
    {
      qNum: "Q4",
      question: "Where in a distributed microservices system should authorization be enforced: API Gateway, Microservice, or Database?",
      answer: `A robust production system enforces authorization at <strong>multiple cooperating layers (Defense in Depth)</strong>:
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>API Gateway (Coarse RBAC/Scopes):</strong> Verifies JWT signature, checks coarse OAuth scopes (e.g. <code>write:payments</code>), and blocks unauthorized traffic before reaching the internal mesh.</li>
        <li><strong>Microservice Domain Layer (Fine-Grained ABAC/ReBAC):</strong> Evaluates business ownership and contextual attributes (e.g. <em>Can this user modify invoice #9812?</em>) via an in-process or local sidecar PDP.</li>
        <li><strong>Database / Storage Layer (Row-Level Security - RLS):</strong> PostgreSQL Row-Level Security ensures that even if application code contains a SQL injection bug or bypass vulnerability, tenant ID and clearance boundaries are physically enforced by the database engine.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 42, 43, 44: RBAC vs ABAC -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              8.6 Role-Based Access Control (RBAC) vs. Attribute-Based Access Control (ABAC)
            </h2>
          </div>
          <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed pl-4">
            While <strong class="text-indigo-400">Authentication (AuthN)</strong> verifies <em>who</em> a user is, <strong class="text-indigo-400">Authorization (AuthZ)</strong> governs <em>what</em> that user is permitted to touch. As architectures scale from simple internal dashboards to zero-trust multi-tenant platforms, access control moves from static role badges to dynamic, contextual policy evaluations.
          </p>
        </div>

        <!-- Everyday Mental Model Banner -->
        <div class="bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-900 border border-indigo-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-indigo-400">psychology</span>
            <span class="font-code text-[12px] font-bold text-indigo-300 uppercase tracking-wider">
              Everyday Mental Model: VIP Wristband vs. Contextual Security Clearance
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
            <div class="bg-[#0F1626]/80 border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-indigo-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">badge</span>
                RBAC = VIP Concert Wristband
              </strong>
              <p class="text-slate-300 leading-relaxed">
                You wear a Gold wristband (Role). Bouncers let you into the backstage lounge. Fast and simple, but cannot express conditional rules ("only allowed backstage if the concert is currently active and accompanied by staff").
              </p>
            </div>
            <div class="bg-[#0F1626]/80 border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-cyan-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">security</span>
                ABAC = Smart Biometric Scanner
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Checks 4 dynamic attributes on every door tap: Who are you? What room are you entering? What time is it? Are you connecting from an approved corporate laptop? Fully dynamic and prevents role explosion.
              </p>
            </div>
            <div class="bg-[#0F1626]/80 border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-emerald-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">hub</span>
                ReBAC = Google Drive Document Tree
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Access is derived through graph relationships. You are a member of Engineering, Engineering owns Folder X, Folder X contains Document Y. You automatically inherit read access via graph reachability (Google Zanzibar).
              </p>
            </div>
          </div>
        </div>

        <!-- Overview Text Grid -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">RBAC (Role-Based)</span>
                <span class="text-[10px] font-code bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Static &amp; Coarse</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Binds permissions directly to roles (e.g. <code>Admin</code>, <code>Editor</code>, <code>Viewer</code>), and assigns users to roles. Extremely intuitive, fast to compute via bitmasks or set lookup, but suffers from severe <strong>Role Explosion</strong> when conditions multiply.
              </p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">ABAC (Attribute-Based)</span>
                <span class="text-[10px] font-code bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Dynamic &amp; Fine-Grained</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Evaluates boolean policy expressions against four dynamic attribute vectors: <strong>Subject</strong> (role, clearance), <strong>Action</strong> (read, update), <strong>Resource</strong> (owner, classification), and <strong>Environment</strong> (IP, time, device health).
              </p>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Decision Flow Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              ARCHITECTURAL FLOW: RBAC STATIC LOOKUP VS. ABAC / OPA DECOUPLED EVALUATION
            </span>
            <span class="text-slate-500 text-[10.5px]">Policy Decision Point Architecture</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-2 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. RBAC (STATIC ROLE LOOKUP)                                                           │
│                                                                                        │
│   [User: Alice] ──assigned──► [Role: Billing_Admin] ──grants──► [Action: refund_charge]│
│                                                                                        │
│   Evaluation: O(1) in-memory check: user.hasRole("Billing_Admin")                      │
│   Problem: Cannot natively express "Only refund if charge < $500 and inside office IP" │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. ABAC + DECOUPLED POLICY ENGINE (OPEN POLICY AGENT / OPA PDP)                         │
│                                                                                        │
│  [Client Request]                                                                      │
│         │ POST /invoices/42/refund (Amount: $450, IP: 10.0.1.5, Time: 14:30)           │
│         ▼                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐          │
│  │ API Gateway / Service Middleware (Policy Enforcement Point - PEP)        │          │
│  └──────────────────────────────────────────────────────────────────────────┘          │
│         │                                      ▲                                       │
│         │ JSON Context Query                   │ Allow / Deny Decision (sub-1ms)       │
│         ▼                                      │                                       │
│  ┌──────────────────────────────────────────────────────────────────────────┐          │
│  │ Policy Decision Point (PDP - OPA Sidecar / AWS Cedar Engine)             │          │
│  │                                                                          │          │
│  │  Evaluates 4 Attribute Vectors against Versioned Rego Rules:             │          │
│  │  • Subject:     clearance = 3, dept = "Finance", mfa_verified = true     │          │
│  │  • Resource:    invoice.amount = 450, invoice.tenant = "ACME"            │          │
│  │  • Action:      "refund"                                                 │          │
│  │  • Environment: time.now between 09:00-18:00, ip.subnet = "10.0.0.0/16" │          │
│  │                                                                          │          │
│  │  Policy Rule: allow if subject.dept == "Finance" &&                      │          │
│  │                        resource.amount <= 500 &&                         │          │
│  │                        environment.ip.in_corporate_vpn                   │          │
│  └──────────────────────────────────────────────────────────────────────────┘          │
│         │                                                                              │
│   Permitted: Dispatch to Billing Microservice                                          │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Comparison Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              IN-DEPTH COMPARISON: RBAC VS. ABAC VS. REBAC
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse text-[12px] font-sans">
              <thead>
                <tr class="bg-[#162032] text-slate-300 font-code text-[11px] border-b border-[#24314A]">
                  <th class="p-3.5 font-semibold text-white">Dimension</th>
                  <th class="p-3.5 font-semibold text-indigo-300">RBAC (Role-Based)</th>
                  <th class="p-3.5 font-semibold text-cyan-300">ABAC (Attribute-Based)</th>
                  <th class="p-3.5 font-semibold text-emerald-300">ReBAC (Relationship-Based)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0F172A]">
                ${comparisonRows.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#111B2E]/50' : 'bg-transparent'} hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-code text-slate-300 font-medium whitespace-nowrap">${row.dimension}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.rbac}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.abac}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.rebac}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              STAFF PERSPECTIVE: PREVENTING ROLE EXPLOSION WITH HYBRID ARCHITECTURES
            </span>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, never propose pure RBAC for complex enterprise SaaS systems. Pure RBAC inevitably suffers from <strong>Role Explosion</strong>: product managers request "an auditor role that can only view invoices under $10,000 for European clients on weekdays", forcing developers to create dozens of combinatorial roles.
          </p>
          <div class="text-[12.5px] text-emerald-200/90 bg-[#081713] p-3 rounded-lg border border-[#10B981]/25 leading-relaxed">
            <strong class="text-white">The Staff Engineering Solution:</strong> Keep coarse roles in RBAC (<code>Doctor</code>, <code>Nurse</code>, <code>Admin</code>) for top-level navigation, and deploy <strong>Open Policy Agent (OPA)</strong> as a local sidecar container evaluating fine-grained ABAC attributes at the microservice domain boundary.
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px] font-sans">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Where in a distributed microservices system should authorization be enforced: API Gateway, Microservice, or Database?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#818CF8] text-[18px]">quiz</span>
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
            Use RBAC for coarse-grained administrative access; use ABAC (via Open Policy Agent) for contextual multi-tenant policies to prevent role explosion; and use ReBAC (Google Zanzibar pattern) for deep document sharing and organizational graphs. Always separate Policy Enforcement Points (PEPs) from Policy Decision Points (PDPs).
          </p>
        </div>

        <!-- Page 44 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Pages 42–44 · Section 8.6</span>
        </div>

      </div>

    </div>
  `;
}
