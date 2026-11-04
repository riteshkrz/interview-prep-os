/**
 * 2.5 Content Delivery Networks (CDN) - Visual Guide
 * High-signal, visually rich reproduction of Pages 26, 27, and 28
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderCdnContent(topic) {
  const tradeOffRows = [
    {
      benefit: "Sub-15ms Global Latency",
      bDesc: "Content is delivered directly from local Edge Point of Presence (PoP) servers situated ~10 ms away from users.",
      cost: "Cache Staleness Risk",
      cDesc: "Users may view stale data until TTL expires or an explicit cache purge propagates across all edge nodes."
    },
    {
      benefit: "Origin Server Offload (90%+)",
      bDesc: "Absorbs over 90% of all static traffic, database queries, and bandwidth away from your backend servers.",
      cost: "Cache-Key Fragmentation",
      cDesc: "Over-broad Vary headers (e.g. User-Agent) or random query parameters can shred hit ratios down to 20%."
    },
    {
      benefit: "DDoS & Traffic Spike Cushion",
      bDesc: "Global BGP Anycast absorbs volumetric 10+ Tbps floods at the edge before packets can touch origin VPCs.",
      cost: "Accidental PII Leakage",
      cDesc: "Misconfigured CDN cache rules can accidentally cache and serve private user session cookies (Set-Cookie)."
    },
    {
      benefit: "TLS & HTTP/3 Offloading",
      bDesc: "Terminates modern TLS 1.3 and QUIC at the edge; multiplexes traffic over pre-warmed connections to origin.",
      cost: "Bandwidth Egress Costs",
      cDesc: "Cloud provider egress fees from origin to CDN can introduce unexpected cloud invoice line items."
    }
  ];

  const followUps = [
    {
      q: "How do you prevent premium CDN-cached video content from being pirated?",
      a: `Enterprise streaming architectures (Netflix, Disney+) apply multi-layered defenses:
      <ul class='list-disc pl-5 mt-1.5 space-y-1 text-slate-300'>
        <li><strong>Signed URLs &amp; Signed Cookies:</strong> Generate cryptographic HMAC-signed URLs with a 15-minute expiration timestamp and optional client IP restriction. Expired links immediately return 403 Forbidden.</li>
        <li><strong>Digital Rights Management (DRM):</strong> Video segments are encrypted on disk. The browser requests keys via Google Widevine or Apple FairPlay; intercepted video bytes cannot be played without runtime hardware keys.</li>
        <li><strong>Token Validation at the Edge:</strong> Cloudflare Workers or AWS CloudFront Functions inspect Authorization JWTs at the edge before serving cached segments.</li>
      </ul>`
    },
    {
      q: "How do you invalidate cache across thousands of worldwide edge nodes without causing downtime?",
      a: `<strong>The Senior Secret: The Best Invalidation Strategy is Zero Invalidation.</strong>
      <br/><br/>
      Never name files <code>bundle.js</code> or <code>logo.png</code>. Use <strong>content-hashed URLs</strong> generated at build time: <code>app.7b9d1f.js</code> and configure <code>Cache-Control: public, max-age=31536000, immutable</code> (cache for 1 full year!).
      <br/><br/>
      When you deploy new code, you deploy a new file name: <code>app.8c4e2a.js</code>. The old file remains cached for users on old tabs, while new visitors immediately fetch the new file without any edge purge!
      <br/><br/>
      If you <em>must</em> invalidate dynamic content, use <strong>Tag-Based Purging (Surrogate-Key / Cache-Tags)</strong>. Never trigger global wildcard purges (<code>/*</code>) because millions of users will simultaneously hit your origin database (a catastrophic <strong>Thundering Herd / Cache Stampede</strong>).`
    },
    {
      q: "Your CDN cache hit ratio dropped to 40%. How do you diagnose and fix it?",
      a: `A 40% hit ratio indicates severe <strong>Cache Key Pollution</strong>:
      <ul class='list-disc pl-5 mt-1.5 space-y-1 text-slate-300'>
        <li><strong>Unstripped Marketing Query Parameters:</strong> If requests carry Google Ads tags (<code>?utm_source=twitter&utm_medium=cpc</code>), the CDN treats every single URL as a completely unique file! <em>Fix:</em> Configure edge rules to strip all non-functional query parameters before computing the cache key.</li>
        <li><strong>Over-broad Vary Headers:</strong> If your server sends <code>Vary: User-Agent</code>, the CDN splits cache buckets for every single browser version string on earth. <em>Fix:</em> Normalize Vary headers or only vary on <code>Accept-Encoding</code> (gzip/br).</li>
        <li><strong>Accidental Set-Cookie Headers:</strong> CDNs default to bypassing cache if the origin sends a <code>Set-Cookie</code> header. <em>Fix:</em> Strip cookies on static asset routes.</li>
        <li><strong>Add an Origin Shield Tier:</strong> Place a centralized regional cache tier between edge PoPs and the origin to catch long-tail edge misses.</li>
      </ul>`
    },
    {
      q: "Can a CDN accelerate dynamic, completely uncacheable API responses?",
      a: `<strong>Yes! A CDN provides massive acceleration even with a 0% cache hit ratio:</strong>
      <br/><br/>
      <strong>1. Edge TLS Termination:</strong> A user in Sydney querying an origin in Virginia completes their TCP and TLS handshakes with the local Sydney edge PoP in ~10 ms, rather than waiting 250 ms across the Pacific Ocean!
      <br/><br/>
      <strong>2. Route-Optimized Warm Backbones:</strong> The CDN routes dynamic requests across its private, dedicated fiber backbones using pre-warmed, persistent TCP connections (bypassing public internet routing congestion).
      <br/><br/>
      <strong>3. Edge Compute (Workers):</strong> Edge functions (Cloudflare Workers, Lambda@Edge) can handle geolocation routing, auth header verification, and A/B testing directly at the edge without querying origin servers.`
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="2.5-cdn">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Part 2 · Networking &amp; Protocols
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 26–28 · Section 2.5</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          2.5 Content Delivery Networks (CDN) Architecture
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          A Content Delivery Network (CDN) is a worldwide mesh of geographically distributed edge proxy servers designed to deliver static and dynamic content with sub-15ms latency while shielding origin databases.
        </p>
      </div>

      <!-- SIMPLE MENTAL MODEL BOX: LOCAL FULFILLMENT WAREHOUSES -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          THE SIMPLE MENTAL MODEL: LOCAL E-COMMERCE FULFILLMENT WAREHOUSES
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-300 leading-relaxed font-sans">
          <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
            <strong class="text-rose-300 flex items-center gap-1.5 mb-1.5">
              <span class="material-symbols-outlined text-[17px]">store</span>
              Without a CDN = Shipping from 1 Central Factory
            </strong>
            <p>
              Every time a customer in Tokyo or London buys a book, a single warehouse in Seattle packages it and ships it on an airplane. Customers wait 5 days for delivery (high latency), and the Seattle warehouse is overwhelmed with shipping boxes (origin overload).
            </p>
          </div>
          <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
            <strong class="text-emerald-300 flex items-center gap-1.5 mb-1.5">
              <span class="material-symbols-outlined text-[17px]">local_shipping</span>
              With a CDN = Thousands of Local Fulfillment Centers
            </strong>
            <p>
              Popular products are pre-stocked in regional warehouses in every major city. When a customer in Tokyo orders, a local courier delivers it from 5 miles away in 20 minutes (sub-15ms latency). The central Seattle factory only ships replenishment inventory once in a while.
            </p>
          </div>
        </div>
      </div>

      <!-- CDN Resolution Walk (DNS + CNAME Chain) -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
        <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
          How CDN Routing Works: The CNAME Chain
        </span>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-[12px]">
          <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-slate-300">1. Client DNS Query</span>
            <p class="text-slate-400">User requests <code>myshop.com</code>. Browser asks local DNS resolver.</p>
          </div>
          <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-indigo-300">2. Authoritative CNAME</span>
            <p class="text-slate-400">DNS answers with CNAME alias pointing to <code>myshop.cdn.cloudflare.net</code>.</p>
          </div>
          <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-emerald-300">3. Anycast GSLB</span>
            <p class="text-slate-400">CDN DNS uses BGP Anycast to return the IP of the topologically closest local Edge PoP.</p>
          </div>
          <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-cyan-300">4. Sub-15ms Delivery</span>
            <p class="text-slate-400">Browser connects to local PoP (~10 ms away) to stream cached assets.</p>
          </div>
        </div>
      </div>

      <!-- CDN Hierarchy & Cache Fill Flow Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            CDN HIERARCHY &amp; ORIGIN SHIELD ARCHITECTURE
          </span>
          <span class="text-[11px] font-code text-slate-500">Tiered Protection Flow</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
Bob (New York)
 │ ① request
 ▼
┌──────────────┐   miss   ┌────────────────┐   miss   ┌──────────────┐   miss   ┌────────┐
│   EDGE PoP   │─────────►│ REGIONAL cache │─────────►│   CENTRAL/   │─────────►│ ORIGIN │
│  (New York)  │◄─────────│   (US-East)    │◄─────────│ SHIELD cache │◄─────────│(London)│
└──────────────┘   fill   └────────────────┘   fill   └──────────────┘   fill   └────────┘
     ~10 ms                     ~30 ms                     ~60 ms                 ~150 ms

  ▲ Cache hit ratio is the game: each tier exists to protect the tier behind it.
  ▲ The Origin Shield tier collapses thousands of edge misses into ONE origin fetch (stampede defense).
        </div>
      </div>

      <!-- Comparison Matrix -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          TRADE-OFF ANALYSIS: WHAT CDN OFFERS VS WHAT IT COSTS
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/4">Key Benefit</th>
                <th class="p-3 w-1/4">Architecture Value</th>
                <th class="p-3 w-1/4">Operational Risk</th>
                <th class="p-3 w-1/4">Production Mitigation</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${tradeOffRows.map(r => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-emerald-300 font-code">${r.benefit}</td>
                  <td class="p-3 text-slate-300">${r.bDesc}</td>
                  <td class="p-3 font-semibold text-rose-300 font-code">${r.cost}</td>
                  <td class="p-3 text-slate-300">${r.cDesc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Put Behind CDN vs Do Not Cache -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#0F1626] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">check_circle</span>
            Put Behind a CDN (Cache Aggressively)
          </span>
          <ul class="text-[12px] text-slate-300 flex flex-col gap-1 list-disc list-inside leading-relaxed font-sans">
            <li>Static images (PNG, WebP, AVIF), CSS styles, JavaScript app bundles, webfonts</li>
            <li>Video chunk streams (HLS <code>.ts</code> and DASH <code>.m4s</code> segments)</li>
            <li>Immutable content-hashed assets (<code>Cache-Control: public, max-age=31536000, immutable</code>)</li>
            <li>Public read-heavy catalog items (e-commerce product listings, blog posts)</li>
          </ul>
        </div>

        <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-rose-400 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">cancel</span>
            Do Not Cache at the Edge
          </span>
          <ul class="text-[12px] text-slate-300 flex flex-col gap-1 list-disc list-inside leading-relaxed font-sans">
            <li>User-specific personalized data (shopping carts, user profiles, notifications)</li>
            <li>HTTP responses carrying authentication credentials or <code>Set-Cookie</code> tokens</li>
            <li>Write endpoints (HTTP POST/PUT/DELETE, checkout forms, payment processing)</li>
            <li>Rapidly changing live financial ticker prices or high-frequency auction bids</li>
          </ul>
        </div>
      </div>

      <!-- Interview Follow-ups -->
      <div class="flex flex-col gap-3 pt-2">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          INTERVIEW FOLLOW-UPS (SENIOR &amp; STAFF PROBES)
        </span>
        <div class="flex flex-col gap-3">
          ${followUps.map((item, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <span class="font-sans text-[13px] font-bold text-cyan-300">
                Q${idx + 1}: ${item.q}
              </span>
              <div class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
                ${item.a}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Key Interview Takeaway -->
      <div class="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "A CDN is a hierarchical cache paired with intelligent routing: BGP Anycast routes requests to the nearest edge PoP, and an Origin Shield protects backends from cache stampedes. Always highlight content-hashed immutable URLs as the primary invalidation strategy, and explain how edge TLS termination accelerates dynamic uncacheable traffic."
        </p>
      </div>

    </div>
  `;
}
