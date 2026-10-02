/**
 * 11.4 Global Traffic Management: Anycast, BGP and GSLB - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 139 and 140
 * from The Modern System Design Interview Guide.
 */

export function renderGlobalTrafficManagementContent(topic) {
  const routingMechanisms = [
    {
      mechanism: "Anycast (BGP)",
      howItRoutes: "Routers advertise the same IP prefix from multiple global PoPs; Internet BGP routes packets to the topologically nearest PoP.",
      failoverSpeed: "Sub-second to a few seconds (BGP route withdrawal)",
      drawback: "Routes by Autonomous System (AS) hop count, not physical latency; BGP route flaps can reset active TCP connections.",
      verdict: "Ideal for DNS root servers, CDNs, and edge DDoS scrubbers (Cloudflare, AWS Route 53)",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      mechanism: "GeoDNS / GSLB",
      howItRoutes: "Authoritative DNS server inspects client resolver IP (EDNS Client Subnet) and returns the A/AAAA record of the chosen regional datacenter.",
      failoverSpeed: "Minutes to hours (dictated by DNS TTL and recursive resolver caching)",
      drawback: "ISP resolvers frequently ignore low TTLs; public resolvers (e.g. 8.8.8.8) can misroute users without EDNS Client Subnet.",
      verdict: "Standard for coarse-grained regional traffic steering, regulatory geo-fencing, and cost management",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      mechanism: "Application Layer (Edge Proxy)",
      howItRoutes: "Edge PoP terminates TLS immediately, inspects HTTP headers, cookies, or user session state, and reverse-proxies to the correct backend region.",
      failoverSpeed: "Immediate / Sub-second (controlled by dynamic edge routing logic)",
      drawback: "Incurs an additional network hop; edge proxy must maintain dedicated private backbone WAN to backend origins.",
      verdict: "Essential for user-pinned state, sticky session routing, and dynamic multi-tenant SaaS",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    }
  ];

  const bgpComparison = [
    {
      layer: "1. Edge Anycast Layer",
      scope: "Hundreds of PoPs (Edge)",
      tech: "BGP Prefix Announcement (/24 IPv4)",
      responsibility: "Terminates TCP/TLS handshakes within 10ms of client; caches static web assets; absorbs terabit DDoS attacks.",
      failover: "Sub-second BGP withdrawal removes failed PoP from global Internet routing tables."
    },
    {
      layer: "2. Consistent L4 Hashing Layer",
      scope: "Inside every PoP",
      tech: "Maglev / Katran (eBPF XDP)",
      responsibility: "Distributes incoming TCP flows across origin proxy nodes using consistent hash lookup tables without per-connection state.",
      failover: "Node additions/removals rehash < 1% of flows; avoids TCP connection resets."
    },
    {
      layer: "3. Regional GSLB / GeoDNS",
      scope: "Core Cloud Regions",
      tech: "Route 53, NS1, Cloudflare Load Balancing",
      responsibility: "Routes origin dynamic requests to regional backend datacenters based on database locality and legal compliance (GDPR).",
      failover: "Minutes-level controlled traffic shifting via weighted health-checked DNS records."
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Layered Global Traffic Steering: Public Edge Anycast vs. Backend GeoDNS (GSLB)",
      answer: "Use both in a layered hybrid hierarchy: (1) <strong>Anycast at the Public Edge</strong> for DNS resolution, CDN caching, and edge TLS termination. Anycast absorbs volumetric DDoS attacks across hundreds of PoPs and withdraws dead PoP routes in seconds. (2) <strong>GeoDNS / GSLB Behind the Edge</strong> for directing traffic between regional cloud datacenters (e.g. AWS us-east-1 vs. eu-central-1) based on business logic, compliance boundaries (GDPR data residency), or maintenance windows where minute-level failover is acceptable."
    },
    {
      conceptId: "#02",
      title: "BGP Route Flapping & Stateful TCP Disruption: Consistent Hashing (Maglev) & Tunneling",
      answer: "BGP is dynamic and stateless: if an intermediate transit provider drops a link or an AS path changes, the Internet may suddenly route mid-stream TCP packets for IP <code>198.51.100.1</code> to a <em>different</em> physical PoP (e.g. from Frankfurt to Amsterdam). Because the Amsterdam PoP has no TCP socket state for that connection, it responds with a <code>TCP RST</code>, abruptly terminating file downloads or WebSockets. Cloudflare and Google mitigate this using: (1) <strong>Consistent Hashing Load Balancers (Maglev / Katran)</strong> that synchronize connection tables across edge nodes; and (2) <strong>Internal Cross-PoP BGP Encapsulation</strong> (GRE or Geneve tunnels) that transparently forwards displaced packets to the origin PoP that holds the socket state."
    },
    {
      conceptId: "#03",
      title: "EDNS Client Subnet (ECS, RFC 7871): Solving Geographic Misrouting via Public Resolvers",
      answer: "Traditional DNS queries only tell the authoritative nameserver the IP address of the <em>recursive resolver</em> (e.g., Google DNS 8.8.8.8 in California), not the actual end user. If a user in Sydney Australia uses Google DNS, standard GeoDNS sees the query coming from California and incorrectly returns the IP of an Oregon datacenter (+140ms latency penalty!). <strong>EDNS Client Subnet (ECS)</strong> fixes this by having the recursive resolver append the first 24 bits of the client's actual IP subnet to the DNS query. The authoritative nameserver then returns an IP tailored to the user's geographic location."
    },
    {
      conceptId: "#04",
      title: "Regional Failover Realities: Why DNS Shifting Fails Without Database Replication Drain",
      answer: "Routing network packets is instantaneous compared to storage consistency. In multi-region active-active architectures, data is replicated asynchronously across regions. If you flip DNS from Region A to Region B: (1) <strong>Replication Lag</strong>: Region B may be 200ms–2s behind on writes, resulting in read-after-write anomalies for shifted users. (2) <strong>Write Collisions</strong>: Concurrently shifted writes can conflict with in-flight transactions. (3) <strong>Capacity Tsunami</strong>: Region B instantly receives 2x traffic load, risking CPU exhaustion. True disaster recovery requires pre-warmed backend caches, automated replication drain verification, and database-level leader fencing before completing DNS traffic shift."
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 139: GLOBAL TRAFFIC MANAGEMENT, ANYCAST & BGP ROUTING -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- PART 11 Header Banner -->
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] p-6 text-white shadow-xl shadow-indigo-950/50 flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-extrabold uppercase tracking-widest text-indigo-200">
              PART 11 · NETWORKING & TRAFFIC INFRASTRUCTURE
            </span>
          </div>
          <h1 class="font-sans text-[24px] sm:text-[28px] font-black tracking-tight text-white leading-tight">
            Global Traffic Management: Anycast, BGP and GSLB
          </h1>
          <p class="text-[13.5px] text-indigo-100/90 font-sans max-w-3xl leading-relaxed">
            Directing Planetary Traffic, Sub-Second BGP Evacuation, GeoDNS Resolution, and Hybrid Edge-to-Core Architectures
          </p>
        </div>

        <!-- Section Title: 11.4 Global Traffic Management -->
        <div class="flex flex-col gap-2 pt-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-snug">
              11.4 Global Traffic Management: Anycast, BGP and GSLB
            </h2>
          </div>
        </div>

        <!-- WHAT IT IS & WHY Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-cyan-400">
              <span class="material-symbols-outlined text-[20px]">help_outline</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHAT IT IS</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              Directing clients across the world to the right datacenter or edge location based on geography, health, and capacity.
            </p>
          </div>

          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-indigo-400">
              <span class="material-symbols-outlined text-[20px]">lightbulb</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHY</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              Network latency is dominated by the speed of light in glass (~5ms per 1,000km). Routing a user in London to a datacenter in Virginia adds 70ms of RTT before your code even runs.
            </p>
          </div>
        </div>

        <!-- COMPREHENSIVE ROUTING MECHANISMS TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            GLOBAL ROUTING MECHANISMS COMPARISON
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
            <table class="w-full text-left text-[12.5px] font-sans border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                  <th class="p-3.5 font-bold w-[20%]">Mechanism</th>
                  <th class="p-3.5 font-bold w-[35%]">How it routes</th>
                  <th class="p-3.5 font-bold w-[18%]">Failover speed</th>
                  <th class="p-3.5 font-bold w-[27%]">Drawback &amp; Verdict</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] text-slate-300">
                ${routingMechanisms.map(m => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="p-3.5 font-bold text-white font-code text-[12px]">
                      <span class="px-2 py-0.5 rounded text-[11px] font-code border ${m.badgeColor}">
                        ${m.mechanism}
                      </span>
                    </td>
                    <td class="p-3.5 leading-relaxed">${m.howItRoutes}</td>
                    <td class="p-3.5 font-bold text-cyan-300 font-code text-[11.5px]">${m.failoverSpeed}</td>
                    <td class="p-3.5 leading-relaxed">
                      <div class="text-rose-300 text-[11.5px] mb-1"><strong>Flaw:</strong> ${m.drawback}</div>
                      <div class="text-slate-400 text-[11px]">${m.verdict}</div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ANYCAST ROUTING FLOW & BGP EVACUATION DIAGRAM -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-6 flex flex-col gap-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">public</span>
              HOW BGP ANYCAST ROUTES AND EVACUATES TRAFFIC GLOBALLY
            </span>
            <span class="text-[10.5px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              Border Gateway Protocol (BGP)
            </span>
          </div>

          <div class="font-code text-[12px] sm:text-[13px] leading-relaxed text-slate-300 bg-[#070B14] p-5 rounded-lg border border-[#1E293B] overflow-x-auto">
          Single Shared IP Address: <span class="text-emerald-400 font-bold">198.51.100.1</span> (Announced by 200+ PoPs simultaneously)

  Client in Tokyo ──────► [Local ISP] ──► BGP routes via shortest AS hops ──► <span class="text-cyan-300 font-bold">Tokyo Edge PoP</span>
  Client in Frankfurt ──► [Local ISP] ──► BGP routes via shortest AS hops ──► <span class="text-emerald-300 font-bold">Frankfurt Edge PoP</span>
  Client in London ─────► [Local ISP] ──► BGP routes via shortest AS hops ──► <span class="text-amber-300 font-bold">London Edge PoP (HEALTHY)</span>

  <span class="text-rose-400 font-bold">// INSTANT EVACUATION EVENT: London PoP suffers power failure</span>
  1. London Edge PoP stops announcing BGP prefix for 198.51.100.1 to upstream transit Tier-1 routers
  2. Within 1–3 seconds, Internet BGP routing tables autonomously reconverge:
     Client in London ──► [Local ISP] ──► BGP now routes traffic to nearest peer ──► <span class="text-emerald-300 font-bold">Frankfurt Edge PoP</span>
  <span class="text-emerald-400 font-bold">// ZERO DNS TTL DELAY: Traffic evacuates without waiting for client recursive resolvers!</span>
          </div>
        </div>

        <!-- Official Page 139 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 139</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 140: THE PRODUCTION HYBRID PATTERN, FOLLOW-UPS & TAKEAWAYS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Green Callout Box: THE PRODUCTION HYBRID STANDARD -->
        <div class="bg-[#062419] border-l-4 border-[#10B981] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-emerald-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              THE PRODUCTION HYBRID STANDARD: ANYCAST EDGE + DNS REGIONAL STEERING
            </span>
          </div>
          <p class="text-[13.5px] text-emerald-100 font-sans leading-relaxed">
            Modern internet scale systems (Cloudflare, Netflix, Uber) never choose between Anycast and DNS in isolation—they combine them hierarchically:
          </p>
          <ul class="text-[13px] text-emerald-100/90 font-sans list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Anycast at the Edge:</strong> Edge PoPs terminate TCP and TLS handshakes within 10ms of the user, cache static assets, and absorb DDoS volumetric spikes.</li>
            <li><strong>GeoDNS / GSLB for Region Assignment:</strong> Authoritative DNS directs edge traffic to the appropriate regional backend datacenter based on database tenancy and regulatory data residency laws (GDPR, HIPAA).</li>
            <li><strong>Dedicated Backbone WAN:</strong> Private fiber connections link edge PoPs directly to origin datacenters, bypassing public internet congestion and BGP flapping.</li>
          </ul>
        </div>

        <!-- THREE-TIER HYBRID ARCHITECTURE CARDS -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            THREE-TIER PLANETARY TRAFFIC HIERARCHY
          </span>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${bgpComparison.map(tier => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2.5">
                <div class="flex items-center justify-between">
                  <span class="font-sans text-[14px] font-bold text-white">${tier.layer}</span>
                  <span class="text-[10px] font-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">${tier.scope}</span>
                </div>
                <div class="text-[11.5px] font-code text-amber-300">${tier.tech}</div>
                <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed flex-1">${tier.responsibility}</p>
                <div class="pt-2 border-t border-[#24314A]/70 text-[11.5px] font-sans text-emerald-300">
                  <strong>Failover Behavior:</strong> ${tier.failover}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- CONSISTENT L4 HASHING (MAGLEV / KATRAN) DEEP DIVE -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">memory</span>
              PREVENTING TCP CONNECTION DROPS UNDER BGP FLAPPING (MAGLEV / KATRAN)
            </span>
            <span class="text-[10px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              Eisenbud et al., Google Maglev
            </span>
          </div>

          <p class="text-[13px] text-slate-300 font-sans leading-relaxed">
            When BGP flaps or an edge server dies, naive load balancers recalculate hashes, remapping millions of active TCP flows to different backends and causing massive connection resets. Modern hyper-scalers (Google Maglev, Meta Katran) solve this using <strong>Consistent Hashing with Lookup Tables</strong>:
          </p>

          <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] font-code text-[11.5px] text-slate-300 flex flex-col gap-1.5">
            <div>1. Pre-generate fixed-size permutation lookup table (e.g. size $M = 65,537$ entries, prime number).</div>
            <div>2. For each incoming packet: 5-tuple hash <span class="text-cyan-400">hash(sip, sport, dip, dport, proto) % M</span> directly indexes the lookup table.</div>
            <div>3. When a backend server is removed: only its table slots are reassigned; all other servers retain their exact mappings!</div>
            <div>4. Packets are encapsulated using <span class="text-emerald-300">Generic UDP Encapsulation (GUE)</span> and routed via Direct Server Return (DSR).</div>
        </div>

        <!-- THE 5-LAYER DNS CACHING HIERARCHY & WHY TTLs GET IGNORED -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              THE 5-LAYER DNS RESOLUTION &amp; CACHING HIERARCHY
            </span>
            <span class="text-[10px] font-code text-slate-400 bg-[#0B1120] px-2 py-0.5 rounded border border-[#24314A]">
              RFC 1035 / RFC 2181
            </span>
          </div>

          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            When you set a DNS TTL of 5 seconds during an outage failover, traffic does not drain in 5 seconds because caching occurs across 5 independent network layers:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-[11.5px] font-sans">
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-cyan-300 font-code text-[10.5px]">1. Browser DNS</span>
              <p class="text-slate-300 leading-normal">Chrome/Safari internal cache (persists 1–5 min; often overrides OS TTL to preserve open tabs).</p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-emerald-300 font-code text-[10.5px]">2. OS Resolver</span>
              <p class="text-slate-300 leading-normal">macOS mDNSResponder / Linux systemd-resolved caches records per user session socket.</p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-amber-300 font-code text-[10.5px]">3. Local Router</span>
              <p class="text-slate-300 leading-normal">Home Wi-Fi gateway or office DNS proxy acting as local caching forwarder.</p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-purple-300 font-code text-[10.5px]">4. Recursive ISP</span>
              <p class="text-slate-300 leading-normal">Comcast / AT&amp;T recursive resolvers. Notoriously enforce <strong>minimum TTL floors (e.g. 300s)</strong> to conserve ISP bandwidth.</p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-rose-300 font-code text-[10.5px]">5. Authoritative GSLB</span>
              <p class="text-slate-300 leading-normal">Route 53 / Cloudflare nameservers. Only see queries when all 4 lower caches miss!</p>
            </div>
          </div>
        </div>

        <!-- PEERING ECONOMICS & INTERNET EXCHANGE POINTS (IXPs) -->
        <div class="bg-[#062419] border-l-4 border-[#10B981] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-emerald-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">handshake</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              INTERNET PEERING ECONOMICS: WHY CDNs USE DIRECT IXP CONNECTIONS
            </span>
          </div>
          <p class="text-[13px] text-emerald-100 font-sans leading-relaxed">
            Traffic traversing the public Internet passes through Tier-1 transit providers (Lumen, Telia, NTT) where bandwidth costs $0.50–$2.00 per Mbps. Hyper-scalers bypass public transit by establishing <strong>Settlement-Free Private Network Interconnects (PNIs)</strong> at Internet Exchange Points (IXPs like DE-CIX Frankfurt, AMS-IX Amsterdam, Equinix Ashburn).
          </p>
          <p class="text-[13px] text-emerald-100/90 font-sans leading-relaxed">
            By announcing Anycast BGP prefixes directly to consumer ISPs (Comcast, Deutsche Telekom) over IXP fabric, content providers eliminate intermediate router hops, shave 30–60ms off round-trip times, and reduce egress network transit bills by over 70%.
          </p>
        </div>
        <!-- CRITICAL ARCHITECTURAL DEEP-DIVES Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              CRITICAL ARCHITECTURAL DEEP-DIVES &amp; DISTRIBUTED EDGE CASES
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${architecturalDeepDives.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-cyan-400 shrink-0 pt-0.5">${item.conceptId}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.title}</span>
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
            DNS steers in minutes; anycast steers in seconds. Use DNS for policy and anycast for fast edge evacuation. Moving traffic is easy; moving the stateful write path is hard. Terminate TCP and TLS at the nearest Anycast edge, then route over an optimized private backbone to your stateful region.
          </p>
        </div>

        <!-- Official Page 140 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 140</span>
        </div>

      </div>

    </div>
  `;
}
