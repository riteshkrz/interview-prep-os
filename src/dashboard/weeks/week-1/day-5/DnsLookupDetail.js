/**
 * 2.3 Domain Name System (DNS) - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 26, 27, and 28
 * from The Modern System Design Interview Guide.
 */

export function renderDnsLookupContent(topic) {
  const dnsRecordRows = [
    {
      type: "A",
      name: "Address Record",
      purpose: "Maps a human-readable hostname directly to a 32-bit IPv4 address",
      example: "api.example.com ──► 198.51.100.1"
    },
    {
      type: "AAAA",
      name: "IPv6 Address Record",
      purpose: "Maps a hostname to a 128-bit IPv6 address (hexadecimal format)",
      example: "api.example.com ──► 2606:4700::6810:85e5"
    },
    {
      type: "CNAME",
      name: "Canonical Name",
      purpose: "Aliases one hostname to another canonical domain. Cannot coexist with other records at zone apex (@)",
      example: "www.example.com ──► example.com"
    },
    {
      type: "ALIAS / ANAME",
      name: "Virtual CNAME (Apex)",
      purpose: "Cloud provider proprietary record (Route 53, Cloudflare) that enables CNAME flattening at root apex (@)",
      example: "example.com ──► dualstack.prod-lb.aws.com"
    },
    {
      type: "MX",
      name: "Mail Exchange",
      purpose: "Specifies mail servers responsible for accepting incoming email, ordered by integer priority",
      example: "Priority 10: mail.example.com"
    },
    {
      type: "NS",
      name: "Name Server",
      purpose: "Delegates a DNS zone to authoritative nameservers responsible for answering queries",
      example: "ns-104.awsdns-13.com"
    },
    {
      type: "TXT",
      name: "Text Record",
      purpose: "Holds arbitrary machine-readable strings; essential for SPF, DKIM, DMARC, and domain ownership verification",
      example: "v=spf1 include:_spf.google.com ~all"
    },
    {
      type: "SOA",
      name: "Start of Authority",
      purpose: "Zone metadata: primary authoritative nameserver, administrator email, serial version, and TTL refresh intervals",
      example: "ns1.example.com admin.example.com 2026091801"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What are the latency and operational trade-offs of choosing High TTL vs. Low TTL?",
      answer: `<strong>High TTL (e.g. 86,400s / 24h):</strong> Maximizes caching across resolvers, delivers sub-millisecond local DNS responses to clients, and minimizes query volume and bills to your authoritative nameserver. <em>Trade-off:</em> Extremely slow propagation during emergencies; traffic shifts or IP re-mappings take 24 hours to take full effect.<br/><strong>Low TTL (e.g. 60s):</strong> Enables agile traffic re-routing and fast failover. <em>Trade-off:</em> Massive increase in recurring queries to authoritative nameservers, higher P99 page latency due to frequent recursive DNS resolution on cache misses, and vulnerability to authoritative server outages.`
    },
    {
      qNum: "Q2",
      question: "Why does DNS failover struggle with sub-minute SLAs during a catastrophic region outage?",
      answer: `The <strong>TTL Disrespect</strong> problem: While you can set a DNS record TTL to 30 or 60 seconds, thousands of intermediate recursive resolvers (ISPs, cellular carriers, corporate proxy caches) enforce hard minimum TTL floors (e.g., 5–15 minutes) to conserve WAN bandwidth. Furthermore, runtime environments (such as the default Java JVM DNS cache, which caches indefinitely unless <code>networkaddress.cache.ttl</code> is configured) ignore DNS changes completely. Therefore, DNS failover alone cannot satisfy sub-minute Recovery Time Objectives (RTO); you must front your architecture with <strong>BGP Anycast</strong> or dynamic Layer 4 load balancers.`
    },
    {
      qNum: "Q3",
      question: "How does BGP Anycast make Authoritative DNS resilient against multi-terabit DDoS attacks?",
      answer: `In <strong>BGP Anycast</strong>, dozens of physical nameserver nodes distributed globally in PoPs across the world announce the <em>exact same IP address</em> via Border Gateway Protocol (BGP). When a client sends a DNS query, internet routers use shortest AS-path routing to deliver the packet to the topologically closest datacenter. If a distributed botnet unleashes a massive volumetric DDoS attack, the attack traffic is split and absorbed locally by regional data centers without ever coalescing into a single global bottleneck.`
    },
    {
      qNum: "Q4",
      question: "What is DNSSEC and what specific vulnerability does it prevent?",
      answer: `Standard DNS lookups over UDP are unencrypted and unauthenticated, making them vulnerable to <strong>DNS Cache Poisoning</strong> (the Kaminsky Attack), where an attacker races forged UDP response packets with spoofed transaction IDs to inject malicious IP records into recursive resolvers. <strong>DNSSEC (DNS Security Extensions)</strong> solves this by digitally signing all DNS records using public-key cryptography. Resolvers verify signatures against a cryptographic chain of trust originating at the signed Root Zone (Trust Anchor), guaranteeing response integrity and authenticity.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 26, 27, 28: DOMAIN NAME SYSTEM (DNS) -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              2.3 Domain Name System (DNS)
            </h2>
          </div>
        </div>

        <!-- Definition & Core Role -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            The <strong>Domain Name System (DNS)</strong> is the decentralized, hierarchical phonebook of the Internet. It translates human-readable hostnames (such as <code>api.example.com</code>) into machine-routable IP addresses (such as <code>198.51.100.1</code> or IPv6 <code>2606:4700::6810:85e5</code>).
          </p>
          <p class="text-slate-400 text-[12.5px]">
            DNS operates primarily over <strong>UDP port 53</strong> for minimal query latency (&lt; 30–50 ms), automatically falling back to <strong>TCP port 53</strong> when payload sizes exceed 512 bytes (such as DNSSEC cryptographic responses or full zone transfers).
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-blue-300 uppercase">1. Recursive Resolver</span>
              <p class="text-[11.5px] text-slate-300">Operated by ISP or public DNS (Cloudflare 1.1.1.1, Google 8.8.8.8). Queries hierarchy on behalf of client and manages local cache.</p>
            </div>

            <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. Root Nameserver</span>
              <p class="text-[11.5px] text-slate-300">13 root IP clusters managed globally. Directs the resolver to the appropriate Top-Level Domain (TLD) nameserver (e.g. .com, .io).</p>
            </div>

            <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">3. TLD Nameserver</span>
              <p class="text-[11.5px] text-slate-300">Maintained by registry operators (Verisign for .com). Directs query to the authoritative nameserver hosting the specific domain.</p>
            </div>

            <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">4. Authoritative NS</span>
              <p class="text-[11.5px] text-slate-300">Holds the definitive DNS zone records (AWS Route 53, Cloudflare). Returns the actual IP address mapping and TTL to resolver.</p>
            </div>
          </div>
        </div>

        <!-- STEP-BY-STEP RESOLUTION HIERARCHY DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              DNS ITERATIVE RESOLUTION HIERARCHY FLOW
            </span>
            <span class="text-[11px] font-code text-slate-500">Query for: api.example.com</span>
          </div>

          <div class="text-[11.5px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono bg-[#0F1626] p-4 rounded-xl border border-slate-700/50">
[ Client Browser ]
      │
      ▼  (1) Query: "api.example.com"
[ Recursive Resolver ] (8.8.8.8 / 1.1.1.1)
      │
      ├───► (2) "Where is .com?" ────────────────────────► [ Root Nameserver (.) ]
      │◄─── Returns: .com TLD NS IP ──────────────────────┘
      │
      ├───► (3) "Where is example.com?" ─────────────────► [ TLD Nameserver (.com) ]
      │◄─── Returns: Authoritative NS (ns1.awsdns.com) ───┘
      │
      ├───► (4) "What is IP of api.example.com?" ────────► [ Authoritative NS ]
      │◄─── Returns: 198.51.100.1 (TTL = 300s) ───────────┘
      │
      ▼  (5) Cache Record & Return IP
[ Client Browser ] ───► Connects to 198.51.100.1 via TCP/TLS
          </div>

          <div class="flex items-center justify-between text-[11px] font-code text-cyan-300 pt-1">
            <span>▲ Iterative lookup resolves across 4 tiers; cached at resolver for TTL duration</span>
            <span class="text-slate-500 font-sans">Subsequent client queries are served directly from cache</span>
          </div>
        </div>

        <!-- DNS ROUTING POLICIES (GREEN BOX - SENIOR PERSPECTIVE) -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: ADVANCED DNS ROUTING POLICIES AT SCALE
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In production system designs, DNS is far more than a name-to-IP lookup tool; it is your <strong>global traffic controller</strong>. Modern authoritative DNS engines (AWS Route 53, Cloudflare, NS1) support sophisticated traffic steering algorithms:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <span class="font-semibold text-emerald-300">1. Latency-Based Routing (LBR)</span>
              <p class="text-slate-300">Monitors worldwide packet latency continuously and routes each user query to the AWS/GCP region providing the lowest round-trip latency.</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <span class="font-semibold text-emerald-300">2. Geolocation / GeoDNS Routing</span>
              <p class="text-slate-300">Routes users based on geographic IP origin (e.g. EU users routed to Frankfurt for GDPR compliance, Brazilian users to São Paulo).</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <span class="font-semibold text-emerald-300">3. Weighted Round-Robin</span>
              <p class="text-slate-300">Allocates traffic percentages across server clusters (e.g. 95% to current production, 5% canary test cluster) for zero-risk software rollouts.</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <span class="font-semibold text-emerald-300">4. Automated Failover Routing</span>
              <p class="text-slate-300">Integrates automated health checks. If the primary region fails consecutive synthetic probes, DNS shifts traffic to the warm standby region.</p>
            </div>
          </div>
        </div>

        <!-- DNS RECORD TYPES MATRIX TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DNS RECORD TYPES MATRIX
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3 w-28">Type</th>
                  <th class="p-3 w-48">Full Name</th>
                  <th class="p-3">Core Purpose</th>
                  <th class="p-3">Sample Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${dnsRecordRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-code font-bold text-cyan-300">${row.type}</td>
                    <td class="p-3 font-semibold text-white">${row.name}</td>
                    <td class="p-3 text-slate-300 leading-relaxed">${row.purpose}</td>
                    <td class="p-3 font-code text-[11.5px] text-indigo-300 whitespace-nowrap">${row.example}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Warning Callout: The TTL Disrespect Problem -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE "TTL DISRESPECT" PROBLEM & WHY DNS FAILOVER IS NOT INSTANT
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, never state that DNS failover handles sub-minute recovery. When an endpoint dies, changing an Authoritative DNS record takes time to propagate. Crucially, intermediate recursive resolvers (ISPs, cellular towers, enterprise DNS proxies) frequently override low TTLs (e.g. treating 30s as 300s or 900s) to reduce traffic. Client software (like Java JVMs) also caches DNS responses indefinitely by default. For true sub-second failover, place <strong>BGP Anycast</strong> or Layer 4 hardware/cloud load balancers in front of your ingress points.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why is DNS failover inadequate for systems requiring sub-minute Recovery Time Objective (RTO)?
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
            DNS is a hierarchical, distributed, aggressively cached lookup system and global routing engine. It is not an instant failover mechanism due to TTL disrespect across intermediate caches. For sub-second failover, use BGP Anycast and Layer 4 load balancers below DNS.
          </p>
        </div>

        <!-- Page 28 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 28</span>
        </div>

      </div>

    </div>
  `;
}
