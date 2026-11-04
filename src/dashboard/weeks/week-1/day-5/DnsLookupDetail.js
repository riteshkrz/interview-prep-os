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
      answer: `<strong>High TTL (e.g., 86,400s / 24 hours):</strong> Maximizes caching across global ISP resolvers, delivers sub-millisecond local DNS responses to users, and reduces query bills to your DNS provider.
      <br/><em>The Trade-off:</em> Disaster recovery is frozen. If your primary datacenter burns down and you change the DNS record, it takes up to 24 hours for all traffic worldwide to switch over!
      <br/><br/>
      <strong>Low TTL (e.g., 60 seconds):</strong> Enables rapid traffic shifts, canary testing, and fast failovers.
      <br/><em>The Trade-off:</em> Massive increase in recurring queries to authoritative nameservers, higher p99 latency for users due to frequent cold DNS lookups, and total site outage if your DNS provider experiences downtime.`
    },
    {
      qNum: "Q2",
      question: "Why does DNS failover fail to achieve sub-minute recovery SLAs during cloud outages?",
      answer: `The <strong>TTL Disrespect Problem:</strong>
      <br/><br/>
      Even if you configure a 30-second TTL on AWS Route 53, thousands of intermediate recursive resolvers (ISPs, cellular carriers, corporate Wi-Fi firewalls) enforce a hard minimum floor (often 5 to 15 minutes) to save bandwidth.
      <br/><br/>
      Furthermore, application runtimes (like the default Java JVM) cache DNS lookups <em>indefinitely until the process restarts</em> unless explicitly overridden via <code>networkaddress.cache.ttl</code>.
      <br/><br/>
      <em>Senior Solution:</em> For true sub-second failover, never rely solely on DNS. Use <strong>BGP Anycast</strong> or cloud load balancers with static IPs that automatically reroute healthy backend pools below the DNS layer.`
    },
    {
      qNum: "Q3",
      question: "How does BGP Anycast make Authoritative DNS resilient against multi-terabit DDoS attacks?",
      answer: `In <strong>BGP Anycast</strong>, dozens of physical nameserver nodes located in data centers across the globe announce the <em>identical public IP address</em> (e.g. Cloudflare's <code>1.1.1.1</code> or Google's <code>8.8.8.8</code>).
      <br/><br/>
      Internet routers automatically send packets to the topologically closest geographic location using shortest AS-path routing. When a botnet launches a massive 10 Tbps DDoS attack, the malicious traffic is physically diluted and absorbed locally across 300+ global edge locations without ever overwhelming a central server.`
    },
    {
      qNum: "Q4",
      question: "What is DNSSEC and what specific vulnerability does it prevent?",
      answer: `Standard DNS lookups over UDP are unencrypted and unauthenticated, making them vulnerable to <strong>DNS Cache Poisoning (the Kaminsky Attack)</strong>: an attacker floods an ISP resolver with fake IP answers, tricking it into redirecting users from <code>bank.com</code> to a fake phishing server.
      <br/><br/>
      <strong>DNSSEC (DNS Security Extensions)</strong> cryptographically signs every DNS record with public-key digital signatures. Recursive resolvers verify that each record is signed by an unbroken cryptographic chain tracing back to the ICANN Root Trust Anchor, making forged DNS answers mathematically impossible to spoof.`
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
              2.3 Domain Name System (DNS) Deep Dive
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            The Decentralized Phonebook of the Internet · 4-Tier Iterative Hierarchy &amp; Global Traffic Steering
          </p>
        </div>

        <!-- SIMPLE MENTAL MODEL BOX: THE 4-TIER LIBRARY -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: VISITING A GIANT REFERENCE LIBRARY
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Finding the IP for <code>api.example.com</code> is like finding a specific book in the world's largest library:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px] font-sans">
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-blue-500/30 flex flex-col gap-1">
              <strong class="text-blue-300">1. Recursive Resolver (Your Assistant)</strong>
              <p class="text-slate-400">You hand your request to your personal assistant (ISP or 1.1.1.1). They run through the library halls on your behalf and remember past answers in cache.</p>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-cyan-500/30 flex flex-col gap-1">
              <strong class="text-cyan-300">2. Root Server (Front Desk)</strong>
              <p class="text-slate-400">The assistant asks the main front desk: <em>"Where is .com?"</em> The desk replies: <em>"Head to the .com wing on Floor 2."</em> (13 global root server clusters).</p>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-indigo-500/30 flex flex-col gap-1">
              <strong class="text-indigo-300">3. TLD Server (Wing Librarian)</strong>
              <p class="text-slate-400">The assistant enters the .com wing and asks: <em>"Where is example.com?"</em> The librarian says: <em>"Check with the AWS Route 53 desk."</em></p>
            </div>
            <div class="bg-[#0A0E1A] p-3 rounded-lg border border-emerald-500/30 flex flex-col gap-1">
              <strong class="text-emerald-300">4. Authoritative NS (Book Owner)</strong>
              <p class="text-slate-400">The assistant reaches the Route 53 desk, which holds the official company record: <em>"api.example.com lives at IP 198.51.100.1 with a 300s TTL."</em></p>
            </div>
          </div>
        </div>

        <!-- WHY THIS MATTERS IN SYSTEM DESIGN INTERVIEWS -->
        <div class="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            INTERVIEW SIGNAL
          </span>
          <p class="text-[12.5px] text-indigo-200/90 leading-relaxed font-sans">
            <strong>Senior Insight:</strong> In modern cloud architecture, DNS is not just a phonebook — it is your <strong>global traffic controller</strong>. Cloudflare and Route 53 use <strong>GeoDNS</strong> to route European users to Frankfurt and Asian users to Tokyo, and <strong>Latency-Based Routing (LBR)</strong> to steer traffic around internet cable cuts.
          </p>
        </div>

        <!-- DNS ITERATIVE RESOLUTION FLOW DIAGRAM -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                DNS ITERATIVE RESOLUTION FLOW: HOW api.example.com IS RESOLVED
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">4-Tier Iterative Hierarchy</span>
              <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">Root → TLD → Authoritative</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/dns-iterative-resolution-flow.jpg" 
                alt="DNS Iterative Resolution Flow - How api.example.com is resolved to an IP address" 
                class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/dns-iterative-resolution-flow.jpg', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">Recursive Resolver (8.8.8.8 / 1.1.1.1) → Root (.) → TLD (.com) → Authoritative (ns1.awsdns.com)</span>
            </div>
          </div>

          <!-- Key Iterative Resolution Steps Grid Callouts -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11.5px] font-sans">
            <div class="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
              <div>
                <strong class="font-semibold block text-blue-900">Client Query:</strong>
                <span>User visits <code>api.example.com</code>. Browser asks local Recursive Resolver (e.g. 1.1.1.1, Google 8.8.8.8).</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
              <div>
                <strong class="font-semibold block text-emerald-900">Query to Root Server:</strong>
                <span>Resolver asks Root Server (<code>.</code>): <em>"Where is .com?"</em> Root responds with addresses of <code>.com</code> TLD servers.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-950 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
              <div>
                <strong class="font-semibold block text-purple-900">Query to TLD Server:</strong>
                <span>Resolver asks TLD (<code>.com</code>): <em>"Where is example.com?"</em> TLD returns authoritative nameservers (e.g. <code>ns1.awsdns.com</code>).</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">4</span>
              <div>
                <strong class="font-semibold block text-amber-900">Query to Authoritative NS:</strong>
                <span>Resolver asks Route 53: <em>"What is the IP for api.example.com?"</em> Server returns <code>198.51.100.1</code> with a 300s TTL.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">5</span>
              <div>
                <strong class="font-semibold block text-rose-900">Cache and Return:</strong>
                <span>Recursive resolver caches the record for 300 seconds and hands the IP address back to the user's browser.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">6</span>
              <div>
                <strong class="font-semibold block text-indigo-900">Direct TCP/TLS Connection:</strong>
                <span>Browser dials IP <code>198.51.100.1</code> to initiate TCP handshake and TLS encryption with zero further DNS delay.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- DNS ROUTING POLICIES (SENIOR PERSPECTIVE) -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: ADVANCED GLOBAL DNS ROUTING PATTERNS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, describe how Route 53 or Cloudflare intelligently steers global traffic:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0F1626]/80 p-3.5 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <span class="font-semibold text-emerald-300">1. Latency-Based Routing (LBR)</span>
              <p class="text-slate-300 text-[12px]">AWS measures real-time internet latency across regions and automatically routes users to the AWS region that delivers the lowest millisecond RTT.</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3.5 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <span class="font-semibold text-emerald-300">2. GeoDNS / Geolocation Routing</span>
              <p class="text-slate-300 text-[12px]">Routes queries based on user country or continent (e.g. EU users routed to Frankfurt for strict GDPR compliance, US users to Virginia).</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3.5 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <span class="font-semibold text-emerald-300">3. Weighted Canary Routing</span>
              <p class="text-slate-300 text-[12px]">Directs 95% of traffic to existing stable production infrastructure and 5% to a new canary software version for zero-risk testing.</p>
            </div>
            <div class="bg-[#0F1626]/80 p-3.5 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <span class="font-semibold text-emerald-300">4. Health-Checked Failover Routing</span>
              <p class="text-slate-300 text-[12px]">Route 53 monitors backend health probes. If the primary region's ALB fails 3 consecutive checks, DNS shifts traffic to a secondary standby region.</p>
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
                  <th class="p-3.5 w-28">Type</th>
                  <th class="p-3.5 w-48">Full Name</th>
                  <th class="p-3.5">Core Purpose</th>
                  <th class="p-3.5">Sample Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${dnsRecordRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-code font-bold text-cyan-300">${row.type}</td>
                    <td class="p-3.5 font-semibold text-white">${row.name}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.purpose}</td>
                    <td class="p-3.5 font-code text-[11.5px] text-indigo-300 whitespace-nowrap">${row.example}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Warning Callout: The TTL Disrespect Problem -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            THE CRITICAL TRAP: "TTL DISRESPECT" AND DNS FAILOVER LIMITATIONS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, never claim that DNS failover provides instant 30-second disaster recovery. Even with a 30s TTL, intermediate ISP resolvers frequently enforce a minimum 5-to-15 minute cache to save bandwidth. Furthermore, Java applications cache DNS records indefinitely in memory. For true sub-second disaster recovery, place <strong>BGP Anycast</strong> or Layer 4 cloud load balancers in front of your system!
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why is DNS failover inadequate for systems requiring sub-minute Recovery Time Objective (RTO)? How does BGP Anycast overcome this?
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
            DNS is a decentralized, hierarchical, aggressively cached lookup system that acts as the steering wheel for global web traffic. Because intermediate ISP caches disrespect low TTLs, DNS cannot achieve instant failover on its own. Modern architectures pair Route 53 Latency-Based Routing with BGP Anycast for resilient, sub-second failover.
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
