/**
 * 2.5 Content Delivery Networks (CDN) - Visual Guide
 * High-signal, visually rich reproduction of Pages 26, 27, and 28
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderCdnContent(topic) {
  const tradeOffRows = [
    {
      benefit: "Sub-15ms Latency",
      bDesc: "Content served from geographically proximate Edge PoPs (~10 ms away).",
      cost: "Staleness Risk",
      cDesc: "Stale data until TTL expiry or explicit purge."
    },
    {
      benefit: "Origin Offload (90%+)",
      bDesc: "Absorbs over 90% of requests and bandwidth from origin servers.",
      cost: "Cache-Key Pollution",
      cDesc: "Over-broad Vary headers or query params shred hit ratio."
    },
    {
      benefit: "DDoS & Spike Absorption",
      bDesc: "Anycast edge absorbs volumetric flood before reaching origin infrastructure.",
      cost: "Information Leakage",
      cDesc: "Misconfigured edge can accidentally cache private, user-specific Set-Cookie data."
    },
    {
      benefit: "Free HTTP/3 & TLS Offload",
      bDesc: "Terminates modern TLS 1.3 / QUIC at edge; reuses warm TCP backbones to origin.",
      cost: "Vendor Dependency & Egress",
      cDesc: "Third-party vendor in critical path; egress transfer cost traps."
    }
  ];

  const followUps = [
    {
      q: "How do you prevent CDN-cached video from being pirated?",
      a: "Layer defenses in depth: <strong>Signed URLs &amp; Signed Cookies</strong> with short expiration (e.g. 15 mins) and optional client IP binding so leaked URLs expire fast; token authentication validated at edge; <strong>DRM</strong> (Google Widevine, Apple FairPlay, Microsoft PlayReady) with per-session decryption keys so intercepted bytes cannot be played; segmented HLS/DASH chunking with rotating keys; geo/referrer restrictions; and forensic watermarking to identify leakers. Be honest about the boundary: screen recorders cannot be stopped cryptographically, but casual piracy is prevented."
    },
    {
      q: "How do you invalidate content across thousands of edges?",
      a: "<strong>Prefer not to invalidate at all.</strong> Use immutable, content-hashed asset URLs (e.g., <code>app.9f3ac1.js</code>) with a 1-year <code>Cache-Control: public, max-age=31536000, immutable</code> header. Every deployment changes the URL hash rather than the content. When explicit invalidation is mandatory, use targeted purge-by-tag (Surrogate-Key) or purge-by-exact-URL. Avoid global wildcard purges (<code>/*</code>) because they induce a catastrophic stampede on your origin."
    },
    {
      q: "Your hit ratio is 40%. Diagnose it.",
      a: "Almost always <strong>cache-key pollution</strong>: extraneous query strings (tracking UTM parameters, timestamp anti-caches), an over-broad <code>Vary: User-Agent</code> header (which fragments cache per device string), <code>Set-Cookie</code> sent on static files, missing or tiny TTLs, or data with high cardinality that gets evicted before reuse. Fix: normalize URLs at the edge, strip unneeded query params, remove cookies on static routes, and add an <strong>Origin Shield</strong> tier to protect against long-tail misses."
    },
    {
      q: "Can a CDN accelerate dynamic, completely uncacheable content?",
      a: "<strong>Yes, in two major ways.</strong> Even with 0% caching, terminating TLS at the nearest edge PoP saves transcontinental TCP and TLS handshake round-trips (~150ms saved). The CDN then routes requests over private, pre-warmed, route-optimized backbone connections to your origin. Furthermore, modern CDNs support <strong>Edge Compute</strong> (Workers) to assemble personalizations and <code>stale-while-revalidate</code> to deliver cached data instantly while asynchronously refreshing."
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
          2.5 Content Delivery Networks (CDN)
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          A Content Delivery Network (CDN) is a geographically distributed mesh of edge servers designed to deliver static and dynamic content with sub-20ms latency while shielding origin backends.
        </p>
      </div>

      <!-- CDN Resolution Walk (DNS + CNAME Chain) -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
        <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
          How CDN Routing Works: The CNAME Chain
        </span>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-[12px]">
          <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-slate-300">1. Client DNS Query</span>
            <p class="text-slate-400">User requests <code>myshop.com</code>. Browser queries local resolver.</p>
          </div>
          <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-indigo-300">2. Authoritative CNAME</span>
            <p class="text-slate-400">DNS answers with CNAME alias <code>myshop.cdn.com</code>.</p>
          </div>
          <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-emerald-300">3. Anycast GSLB</span>
            <p class="text-slate-400">CDN DNS uses Geo/Anycast to return IP of optimal local Edge PoP.</p>
          </div>
          <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
            <span class="font-code font-bold text-cyan-300">4. Edge Delivery</span>
            <p class="text-slate-400">Browser connects to local PoP (~10ms) to stream cached assets.</p>
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
│  (New York)  │◄─────────│   (US-East)    │◄─────────│ shield cache │◄─────────│(London)│
└──────────────┘   fill   └────────────────┘   fill   └──────────────┘   fill   └────────┘
     ~10 ms                     ~30 ms                     ~60 ms                 ~150 ms

  ▲ Cache hit ratio is the whole game: each tier exists to protect the tier behind it.
  ▲ The shield tier collapses thousands of edge misses into ONE origin fetch (stampede defense).
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
                <th class="p-3 w-1/4">Cost / Operational Risk</th>
                <th class="p-3 w-1/4">Mitigation Strategy</th>
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
            Put Behind a CDN
          </span>
          <ul class="text-[12px] text-slate-300 flex flex-col gap-1 list-disc list-inside leading-relaxed font-sans">
            <li>Static images, audio/video segments (HLS/DASH), JS/CSS bundles, fonts</li>
            <li>Immutable content-hashed assets (<code>Cache-Control: public, max-age=31536000, immutable</code>)</li>
            <li>Public API responses with short, bounded TTLs</li>
            <li>Geographically distributed, read-heavy catalog items</li>
          </ul>
        </div>

        <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-rose-400 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">cancel</span>
            Do Not Cache at the Edge
          </span>
          <ul class="text-[12px] text-slate-300 flex flex-col gap-1 list-disc list-inside leading-relaxed font-sans">
            <li>Per-user personalized HTML (unless using Edge SSI / Worker assembly)</li>
            <li>Responses carrying authentication headers or <code>Set-Cookie</code> credentials</li>
            <li>Write paths, transactional mutations, and checkout endpoints</li>
            <li>Rapidly mutating data where even 500ms staleness causes business errors</li>
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
              <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
                ${item.a}
              </p>
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
          "A CDN is a hierarchical cache plus a routing decision: DNS/anycast picks the nearest edge, and each tier shields the one behind it. Talk about cache keys and hit ratio — that is where real CDN engineering happens, not in the diagram."
        </p>
      </div>

    </div>
  `;
}
