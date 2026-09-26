/**
 * Spec 1: URL Shortener (TinyURL / Bitly) - Visual Guide & 45-Minute Interview Design
 * High-signal, interactive, and structured 6-stage interview blueprint:
 * clarify -> FR/NFR -> numbers -> API -> write/read path -> how short code is made -> grill
 */

export function renderUrlShortenerInterviewDesign(topic) {
  const initialTab = 'clarify';

  return `
    <div class="url-shortener-spec-root flex flex-col gap-5 text-slate-200 select-text cursor-default animate-fadeIn" data-active-tab="${initialTab}">
      
      <!-- Top Title Bar Matching Screenshots -->
      <div class="flex flex-col gap-1.5 pb-2 border-b border-[#24314A]/80">
        <h3 class="font-sans text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-snug">
          URL Shortener — interview design
        </h3>
        <p class="font-sans text-[13px] text-slate-400 leading-relaxed">
          45-minute system design. Speak this order: <span class="text-cyan-300 font-medium">clarify</span> &rarr; <span class="text-cyan-300 font-medium">FR/NFR</span> &rarr; <span class="text-cyan-300 font-medium">numbers</span> &rarr; <span class="text-cyan-300 font-medium">API</span> &rarr; <span class="text-cyan-300 font-medium">write/read path</span> &rarr; <span class="text-cyan-300 font-medium">how the short code is made</span> &rarr; <span class="text-cyan-300 font-medium">let them grill</span>.
        </p>
      </div>

      <!-- Navigation Tabs (Pill Buttons) -->
      <div class="flex items-center gap-2 flex-wrap border-b border-[#24314A]/40 pb-3 url-spec-nav-bar">
        <button type="button" class="url-spec-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-code font-semibold transition-all cursor-pointer bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs active" data-spec-tab="clarify">
          1. Clarify
        </button>
        <button type="button" class="url-spec-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-code font-semibold transition-all cursor-pointer bg-[#0F1626] text-slate-400 border border-[#24314A] hover:text-slate-200 hover:border-slate-500" data-spec-tab="requirements">
          2. Requirements
        </button>
        <button type="button" class="url-spec-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-code font-semibold transition-all cursor-pointer bg-[#0F1626] text-slate-400 border border-[#24314A] hover:text-slate-200 hover:border-slate-500" data-spec-tab="estimates">
          3. Estimate + API
        </button>
        <button type="button" class="url-spec-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-code font-semibold transition-all cursor-pointer bg-[#0F1626] text-slate-400 border border-[#24314A] hover:text-slate-200 hover:border-slate-500" data-spec-tab="design">
          4. Design
        </button>
        <button type="button" class="url-spec-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-code font-semibold transition-all cursor-pointer bg-[#0F1626] text-slate-400 border border-[#24314A] hover:text-slate-200 hover:border-slate-500" data-spec-tab="generate">
          5. Generate code
        </button>
        <button type="button" class="url-spec-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-code font-semibold transition-all cursor-pointer bg-[#0F1626] text-slate-400 border border-[#24314A] hover:text-slate-200 hover:border-slate-500" data-spec-tab="grill">
          6. Grill
        </button>
      </div>

      <!-- Tab 1: CLARIFY -->
      <div class="url-spec-tab-panel flex flex-col gap-5 animate-fadeIn" data-panel="clarify">
        <div class="flex flex-col gap-1.5">
          <h4 class="font-sans text-[17px] font-bold text-white tracking-tight">Open the problem</h4>
          
          <!-- Interviewer / Candidate Open Dialogue -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
            <div class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-cyan-400 text-[18px] shrink-0 mt-0.5">info</span>
              <div>
                <strong class="text-cyan-300 font-semibold block mb-0.5">Interviewer</strong>
                <span class="text-slate-200">Design a URL shortener like bit.ly. Walk me through requirements, APIs, and the core design.</span>
              </div>
            </div>
            <div class="pt-2 border-t border-[#24314A]/70 text-slate-300">
              <strong class="text-slate-100 font-semibold">Candidate:</strong> I will lock scope first, then FR / NFR, a rough capacity check, APIs, and the write vs read path. I will keep custom aliases, expiry, and analytics as optional unless you want them in v1.
            </div>
          </div>
        </div>

        <!-- Questions I ask before drawing boxes -->
        <div class="flex flex-col gap-2.5">
          <h4 class="font-sans text-[15px] font-bold text-white tracking-tight">Questions I ask before drawing boxes</h4>
          
          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0F1626]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="border-b border-[#24314A] bg-[#141C2E]/80 text-slate-300 font-semibold">
                  <th class="py-2.5 px-4">Ask</th>
                  <th class="py-2.5 px-4">Assume if they say 'you decide'</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 text-slate-200">
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-medium text-white">Create + redirect only, or also analytics / custom aliases / expiry?</td>
                  <td class="py-2.5 px-4 text-slate-300">v1: create + redirect. Expiry optional. Analytics later.</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-medium text-white">Read:write ratio and traffic?</td>
                  <td class="py-2.5 px-4 text-slate-300">Reads dominate. ~100M new URLs / month, 10:1 reads.</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-medium text-white">How long do mappings live?</td>
                  <td class="py-2.5 px-4 text-slate-300">5 years. Optional TTL per link.</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-medium text-white">Must short codes be hard to guess?</td>
                  <td class="py-2.5 px-4 text-cyan-300 font-medium">Yes &mdash; not a simple incrementing integer in the URL.</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-medium text-white">Auth? Multi-region?</td>
                  <td class="py-2.5 px-4 text-slate-300">No auth in v1. Single region first.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Why ask about guessability Callout -->
          <div class="bg-[#141C2E]/90 border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5 font-sans text-[12.5px] mt-1">
            <div class="font-semibold text-white">Interviewer: Why ask about guessability?</div>
            <div class="text-slate-300">
              <strong class="text-cyan-300">Candidate:</strong> If codes are sequential, anyone can scrape all links. That forces a large key space (Base62, 7+ chars) and no public auto-increment IDs.
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: REQUIREMENTS -->
      <div class="url-spec-tab-panel hidden flex-col gap-5 animate-fadeIn" data-panel="requirements">
        <div class="flex flex-col gap-1.5">
          <h4 class="font-sans text-[17px] font-bold text-white tracking-tight">Scope & System Requirements</h4>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            State explicitly what is in v1 and what is intentionally deferred. This signals senior scoping discipline.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Functional -->
          <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-4 flex flex-col gap-2.5">
            <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">check_circle</span>
              Functional (In Scope)
            </span>
            <ul class="text-[12.5px] text-slate-300 flex flex-col gap-2 list-disc list-inside leading-relaxed">
              <li><strong class="text-white">Shorten URL:</strong> Given a long URL, return a unique 7-character Base62 string.</li>
              <li><strong class="text-white">Redirection:</strong> Redirect <code class="text-cyan-300 bg-[#0A0E1A] px-1 py-0.5 rounded font-code">GET /{shortCode}</code> to original URL with HTTP 302 (or 301).</li>
              <li><strong class="text-white">Custom Alias:</strong> Support user-specified alias if available; reject with 409 if taken.</li>
              <li><strong class="text-white">TTL Expiration:</strong> Optional link lifetime (e.g. 30 days, 1 year, 5 years default).</li>
            </ul>
          </div>

          <!-- Non-Functional -->
          <div class="bg-[#141C2E] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2.5">
            <span class="font-code text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">speed</span>
              Non-Functional (SLAs)
            </span>
            <ul class="text-[12.5px] text-slate-300 flex flex-col gap-2 list-disc list-inside leading-relaxed">
              <li><strong class="text-white">Ultra-Low Latency:</strong> Redirection p99 &lt; 8ms (cached reads served in &lt; 2ms).</li>
              <li><strong class="text-white">High Availability:</strong> 99.999% uptime for read redirect path; writes can degrade temporarily.</li>
              <li><strong class="text-white">Zero Collisions:</strong> 100% deterministic uniqueness across billions of short codes.</li>
              <li><strong class="text-white">Non-Predictable:</strong> Keys cannot be enumerated or scraped sequentially.</li>
            </ul>
          </div>

          <!-- Out of Scope -->
          <div class="bg-[#141C2E] border border-amber-500/30 rounded-xl p-4 flex flex-col gap-2.5">
            <span class="font-code text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">block</span>
              Explicitly Out of Scope
            </span>
            <ul class="text-[12.5px] text-slate-300 flex flex-col gap-2 list-disc list-inside leading-relaxed">
              <li><strong class="text-white">Real-time Analytics:</strong> Click stream geo-aggregations & click dashboards (deferred to v2 pipeline).</li>
              <li><strong class="text-white">User Authentication:</strong> Public anonymous creation in v1; billing & auth later.</li>
              <li><strong class="text-white">Active-Active Multi-Region:</strong> Single primary region for ID sequencing in v1.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tab 3: ESTIMATE + API -->
      <div class="url-spec-tab-panel hidden flex-col gap-5 animate-fadeIn" data-panel="estimates">
        <div class="flex flex-col gap-1.5">
          <h4 class="font-sans text-[17px] font-bold text-white tracking-tight">Back-of-the-Envelope Calculations & REST APIs</h4>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Numbers dictate whether a single database node is sufficient or whether distributed sharding is mandatory.
          </p>
        </div>

        <!-- Numbers Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] text-slate-400 font-bold uppercase">Write Volume</span>
            <span class="text-[18px] font-bold text-white">~40 writes/sec</span>
            <span class="text-[11.5px] text-slate-400">100M new URLs / mo (Peak ~120/s). Fits on 1 DB easily.</span>
          </div>
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] text-slate-400 font-bold uppercase">Read Redirections</span>
            <span class="text-[18px] font-bold text-cyan-300">~400 to 4,000 QPS</span>
            <span class="text-[11.5px] text-slate-400">10:1 to 100:1 read ratio. Handled via Redis cache.</span>
          </div>
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] text-slate-400 font-bold uppercase">5-Year Storage Horizon</span>
            <span class="text-[18px] font-bold text-emerald-300">~3.3 TB Total</span>
            <span class="text-[11.5px] text-slate-400">6B URLs &times; 550 bytes/row = 3.3 TB over 5 years.</span>
          </div>
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] text-slate-400 font-bold uppercase">Cache RAM (80/20 Rule)</span>
            <span class="text-[18px] font-bold text-purple-300">~5 to 20 GB RAM</span>
            <span class="text-[11.5px] text-slate-400">20% of daily active URLs cached in Redis LRU.</span>
          </div>
        </div>

        <!-- API Contracts -->
        <div class="flex flex-col gap-3">
          <h4 class="font-sans text-[15px] font-bold text-white tracking-tight">API Interface Contracts</h4>
          
          <div class="flex flex-col gap-3">
            <!-- POST Endpoint -->
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2 font-code text-[13px]">
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">POST</span>
                <span class="text-white font-semibold">/api/v1/shorten</span>
              </div>
              <p class="text-[12px] text-slate-300">Creates a short link mapping from a given long URL.</p>
              <div class="bg-[#0A0E1A] rounded-lg p-3 font-code text-[11.5px] text-slate-200 border border-[#1E293B] overflow-x-auto">
<span class="text-slate-400">// Request Payload</span>
{
  <span class="text-cyan-300">"longUrl"</span>: <span class="text-emerald-300">"https://example.com/promotions/spring-2026/campaign-item"</span>,
  <span class="text-cyan-300">"customAlias"</span>: <span class="text-slate-400">"spring-sale"</span>, <span class="text-slate-500">// optional</span>
  <span class="text-cyan-300">"ttlDays"</span>: <span class="text-amber-300">30</span> <span class="text-slate-500">// optional, defaults to 5 years</span>
}

<span class="text-slate-400">// Response: 201 Created</span>
{
  <span class="text-cyan-300">"shortCode"</span>: <span class="text-emerald-300">"aB3xY9k"</span>,
  <span class="text-cyan-300">"shortUrl"</span>: <span class="text-emerald-300">"https://tiny.url/aB3xY9k"</span>,
  <span class="text-cyan-300">"expiresAt"</span>: <span class="text-emerald-300">"2026-10-21T00:00:00Z"</span>
}
              </div>
            </div>

            <!-- GET Endpoint -->
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2 font-code text-[13px]">
                <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">GET</span>
                <span class="text-white font-semibold">/{shortCode}</span>
              </div>
              <p class="text-[12px] text-slate-300">Redirects the user agent to the target long URL.</p>
              <div class="bg-[#0A0E1A] rounded-lg p-3 font-code text-[11.5px] text-slate-200 border border-[#1E293B] overflow-x-auto">
<span class="text-slate-400">// Response: HTTP 302 Found (or 301 Permanent)</span>
<span class="text-purple-300">HTTP/1.1 302 Found</span>
<span class="text-cyan-300">Location:</span> https://example.com/promotions/spring-2026/campaign-item
<span class="text-cyan-300">Cache-Control:</span> no-cache <span class="text-slate-500">// ensures click telemetry reaches server</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 4: DESIGN -->
      <div class="url-spec-tab-panel hidden flex-col gap-5 animate-fadeIn" data-panel="design">
        <div class="flex flex-col gap-1.5">
          <h4 class="font-sans text-[17px] font-bold text-white tracking-tight">End-to-End Architecture & Data Flow</h4>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Separate the high-throughput read path from the transactional write path.
          </p>
        </div>

        <!-- Architecture ASCII Box Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 font-mono text-[11.5px] text-cyan-200 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
WRITE PATH:
Client ──POST /shorten──► [ Envoy / ALB ] ──► [ App Web Cluster ]
                                                     │
               ┌─────────────────────────────────────┴─────────────────────────────────────┐
               ▼                                                                           ▼
     [ ID Sequencer / Ticket Service ]                                          [ Obfuscation (XOR / Permute) ]
     (Redis INCR / DB Range Ticket 10k)                                         (Hides auto-increment scrapability)
               │                                                                           │
               └─────────────────────────────────────┬─────────────────────────────────────┘
                                                     ▼
                                            [ Base62 Encoder ] ──► 7-Char Code ("aB3xY9k")
                                                     │
                                                     ▼
                                          [ DB Master (PostgreSQL) ] ──write-through──► [ Redis Cache ]

READ PATH (p99 &lt; 8ms):
User Click ──GET /aB3xY9k──► [ Edge CDN / Cloudflare ]
                                   │
                                   ├── (Cache Hit) ──► 302 Redirect (&lt; 2ms)
                                   ▼
                            [ Web App Tier ] ──► [ Redis Cache-Aside ]
                                                        │
                                                        ├── (Hit) ──► HTTP 302 Found
                                                        ▼ (Miss)
                                                [ PostgreSQL Replica ] ──populate──► [ Redis ]
        </div>

        <!-- Data Model Schema -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">database</span>
            Database Schema &amp; Storage Layout
          </span>
          <div class="bg-[#0A0E1A] rounded-lg p-3 font-code text-[11.5px] text-slate-200 border border-[#1E293B] overflow-x-auto">
<span class="text-purple-300">CREATE TABLE</span> <span class="text-cyan-300">urls</span> (
  <span class="text-white">short_code</span>    <span class="text-amber-300">VARCHAR(7)</span> <span class="text-purple-300">PRIMARY KEY</span>,  <span class="text-slate-500">-- 7 Base62 chars (Clustered Index PK)</span>
  <span class="text-white">original_url</span>  <span class="text-amber-300">VARCHAR(2048)</span> <span class="text-purple-300">NOT NULL</span>,  <span class="text-slate-500">-- Target destination link</span>
  <span class="text-white">created_at</span>    <span class="text-amber-300">TIMESTAMP</span> <span class="text-purple-300">DEFAULT CURRENT_TIMESTAMP</span>,
  <span class="text-white">expires_at</span>    <span class="text-amber-300">TIMESTAMP NULL</span>,          <span class="text-slate-500">-- TTL expiration timestamp</span>
  <span class="text-white">user_id</span>       <span class="text-amber-300">BIGINT NULL</span>              <span class="text-slate-500">-- Account ID for ownership / deletion</span>
);

<span class="text-slate-500">-- Partial index for active expiry sweep jobs</span>
<span class="text-purple-300">CREATE INDEX</span> <span class="text-cyan-300">idx_urls_expires_at</span> <span class="text-purple-300">ON</span> urls(expires_at) <span class="text-purple-300">WHERE</span> expires_at <span class="text-purple-300">IS NOT NULL</span>;
          </div>
        </div>
      </div>

      <!-- Tab 5: GENERATE CODE (From Screenshots 2, 3, & 5) -->
      <div class="url-spec-tab-panel hidden flex-col gap-5 animate-fadeIn" data-panel="generate">
        <div class="flex flex-col gap-1.5">
          <h4 class="font-sans text-[17px] font-bold text-white tracking-tight">How you generate the short code</h4>
          
          <!-- Interviewer / Candidate Open Bubble -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
            <div class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-cyan-400 text-[18px] shrink-0 mt-0.5">info</span>
              <div>
                <strong class="text-cyan-300 font-semibold block mb-0.5">Interviewer</strong>
                <span class="text-slate-200">Walk me through how aB3xY9k is produced. Why that length? Can I guess the next one?</span>
              </div>
            </div>
            <div class="pt-2 border-t border-[#24314A]/70 text-slate-300">
              <strong class="text-slate-100 font-semibold">Candidate:</strong> The short code is a unique key in a 62-character alphabet, not a hash of the page title. I pick length first, then the generator: counter plus Base62 in the interview, and I say out loud how I stop it from being sequential.
            </div>
          </div>
        </div>

        <!-- 1. Alphabet and length -->
        <div class="flex flex-col gap-2.5">
          <h4 class="font-sans text-[15px] font-bold text-white tracking-tight">1. Alphabet and length</h4>
          <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
            Alphabet is Base62: <code class="text-cyan-300 bg-[#0A0E1A] px-1 py-0.5 rounded font-code">0–9 a–z A–Z</code> (62 chars). Not Base64 &mdash; <code class="text-amber-300 bg-[#0A0E1A] px-1 py-0.5 rounded font-code">+</code> <code class="text-amber-300 bg-[#0A0E1A] px-1 py-0.5 rounded font-code">/</code> <code class="text-amber-300 bg-[#0A0E1A] px-1 py-0.5 rounded font-code">=</code> are ugly in URLs. Length 7: 62<sup>6</sup> &asymp; 57B (tight for 6B rows), 62<sup>7</sup> &asymp; 3.5T (safe). 8 chars if they want extra headroom.
          </p>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0F1626]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="border-b border-[#24314A] bg-[#141C2E]/80 text-slate-300 font-semibold">
                  <th class="py-2.5 px-4">Chars</th>
                  <th class="py-2.5 px-4">Key space</th>
                  <th class="py-2.5 px-4">Say this</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 text-slate-200 font-sans">
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-code">6</td>
                  <td class="py-2.5 px-4 font-code">62^6 &asymp; 57B</td>
                  <td class="py-2.5 px-4 text-slate-300">Fits 5 years, little slack after collisions / reserved words</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors bg-cyan-500/5">
                  <td class="py-2.5 px-4 font-code flex items-center gap-2 font-bold text-cyan-300">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    7
                  </td>
                  <td class="py-2.5 px-4 font-code font-bold text-white">62^7 &asymp; 3.5T</td>
                  <td class="py-2.5 px-4 font-medium text-emerald-300">Default. ~41 bits. Covers 6B URLs easily</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-code flex items-center gap-2 text-rose-400">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    UUID
                  </td>
                  <td class="py-2.5 px-4 font-code text-slate-400">122 bits</td>
                  <td class="py-2.5 px-4 text-rose-300">Reject &mdash; the URL is no longer short</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. Base62 of an integer -->
        <div class="flex flex-col gap-2.5">
          <h4 class="font-sans text-[15px] font-bold text-white tracking-tight">2. Base62 of an integer</h4>
          <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
            Treat the ID as a number, repeatedly mod 62, map remainder to the alphabet, then left-pad to 7.
          </p>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0F1626]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="border-b border-[#24314A] bg-[#141C2E]/80 text-slate-300 font-semibold">
                  <th class="py-2.5 px-4">Step</th>
                  <th class="py-2.5 px-4">For id = 125</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 text-slate-200 font-code">
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4">125 % 62</td>
                  <td class="py-2.5 px-4 text-cyan-300">1 &rarr; '1'</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4">2 % 62</td>
                  <td class="py-2.5 px-4 text-cyan-300">2 &rarr; '2'</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-bold text-white">Pad to 7</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-300">0000021</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="font-sans text-[12px] text-slate-400">Mapping is 1:1. Same id always same code. No collision if ids are unique.</p>
        </div>

        <!-- 3. Where the integer comes from -->
        <div class="flex flex-col gap-2.5">
          <h4 class="font-sans text-[15px] font-bold text-white tracking-tight">3. Where the integer comes from</h4>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0F1626]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="border-b border-[#24314A] bg-[#141C2E]/80 text-slate-300 font-semibold">
                  <th class="py-2.5 px-4">Option</th>
                  <th class="py-2.5 px-4">How</th>
                  <th class="py-2.5 px-4">Pick?</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 text-slate-200">
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-medium text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Counter + Base62
                  </td>
                  <td class="py-2.5 px-4 text-slate-300">Redis INCR, DB sequence, or range tickets (app takes 10k ids at a time). Encode. Unique by construction.</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-400">Yes &mdash; default</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-medium text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Hash the long URL
                  </td>
                  <td class="py-2.5 px-4 text-slate-300">MD5/SHA, take ~43 bits, Base62 to 7 chars. Same URL &rarr; same code (dedup). Collisions: unique insert, retry with extra bits or a suffix.</td>
                  <td class="py-2.5 px-4 text-slate-400">Only if they want one code per URL</td>
                </tr>
                <tr class="hover:bg-[#182238]/50 transition-colors">
                  <td class="py-2.5 px-4 font-medium text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                    Random 7 chars
                  </td>
                  <td class="py-2.5 px-4 text-slate-300">Draw 7 Base62 chars. Insert with unique constraint. On 409, draw again. No ID service.</td>
                  <td class="py-2.5 px-4 text-slate-400">Fine at low QPS</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Do not default to full Snowflake Warning Callout -->
          <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3 mt-1">
            <span class="material-symbols-outlined text-amber-400 text-[20px] shrink-0 mt-0.5">warning</span>
            <div class="flex flex-col gap-0.5">
              <strong class="font-sans text-[13px] font-bold text-amber-300">Do not default to full Snowflake</strong>
              <p class="font-sans text-[12px] text-slate-300 leading-relaxed">
                A 64-bit Snowflake Base62-encodes to ~11 chars. 7 chars only hold ~41 bits. If they want 7-char links, use a compact counter or a range allocator, not a 64-bit id.
              </p>
            </div>
          </div>
        </div>

        <!-- 4. Sequential codes are guessable -->
        <div class="flex flex-col gap-2">
          <h4 class="font-sans text-[15px] font-bold text-white tracking-tight">4. Sequential codes are guessable</h4>
          <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
            Raw counter &rarr; <code class="text-cyan-300 font-code">0000021</code>, <code class="text-cyan-300 font-code">0000022</code>, <code class="text-cyan-300 font-code">0000023</code>. Anyone can scrape. Fix (pick one): XOR the id with a secret before encoding; or permute the 7 chars with a stored shuffle; or skip random gaps. Keep the reverse map so redirect can decode if you used XOR, otherwise just store code &rarr; url and never decode.
          </p>
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-3 text-[12.5px] text-slate-200">
            <strong class="text-cyan-300">Simplest interview line:</strong> generate the unique id, XOR with a service secret, Base62-encode, persist the 7-char string as the PK. Do not put the raw counter in the URL.
          </div>
        </div>

        <!-- 5. Custom alias -->
        <div class="flex flex-col gap-2">
          <h4 class="font-sans text-[15px] font-bold text-white tracking-tight">5. Custom alias</h4>
          <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
            User-supplied string is the code. Check reserved list, length, charset. Insert-if-not-exists &rarr; 409 if taken. Do not run it through the counter.
          </p>
        </div>

        <!-- Follow-ups on generator -->
        <div class="flex flex-col gap-2.5 pt-2 border-t border-[#24314A]/60">
          <div class="bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-3 flex flex-col gap-1 text-[12.5px]">
            <span class="font-semibold text-white">Interviewer: Two app servers, same Redis INCR &mdash; collision?</span>
            <span class="text-slate-300"><strong class="text-cyan-300">Candidate:</strong> No. INCR is atomic. Two servers get 125 and 126. If Redis is the id source it must be durable (AOF/RDB) or you lose the counter on crash and risk reuse &mdash; so persist the max id in DB too, or use range tickets stored in DB.</span>
          </div>

          <div class="bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-3 flex flex-col gap-1 text-[12.5px]">
            <span class="font-semibold text-white">Interviewer: Same long URL shortened twice?</span>
            <span class="text-slate-300"><strong class="text-cyan-300">Candidate:</strong> Counter gives two codes (often what you want: campaigns). If they want one canonical code, hash the URL or look up an index long_url &rarr; code before allocating a new id.</span>
          </div>

          <div class="bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-3 flex flex-col gap-1 text-[12.5px]">
            <span class="font-semibold text-white">Interviewer: Why not hash only, no retry?</span>
            <span class="text-slate-300"><strong class="text-cyan-300">Candidate:</strong> Birthday paradox on 41 bits is real at billions of rows. Unique constraint on insert is the safety net even for a counter, and it is mandatory for hash/random.</span>
          </div>
        </div>
      </div>

      <!-- Tab 6: GRILL (From Screenshot 4) -->
      <div class="url-spec-tab-panel hidden flex-col gap-4 animate-fadeIn" data-panel="grill">
        <div class="flex flex-col gap-1">
          <h4 class="font-sans text-[17px] font-bold text-white tracking-tight">Questions they will ask</h4>
          <p class="font-sans text-[12.5px] text-slate-400">
            Answer in 3–4 sentences. If they push, go one layer deeper.
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <!-- Q1: 301 or 302? -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5 font-sans text-[12.5px]">
            <div class="font-semibold text-white">Interviewer: 301 or 302?</div>
            <div class="text-slate-300 leading-relaxed">
              <strong class="text-cyan-300">Candidate:</strong> 301 if you only care about redirect speed &mdash; browsers and CDNs cache it, so your servers see fewer hits. 302 if you need click analytics, because each visit comes back to you. I default to 302 until analytics is out of scope.
            </div>
          </div>

          <!-- Q2: Collision avoidance -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5 font-sans text-[12.5px]">
            <div class="font-semibold text-white">Interviewer: How do you avoid collisions?</div>
            <div class="text-slate-300 leading-relaxed">
              <strong class="text-cyan-300">Candidate:</strong> A monotonic ID cannot collide if encoding is 1:1. Random or hash codes: unique constraint on insert, retry with a new code. Hash of the long URL: on collision either retry with a longer prefix or store a sequence suffix.
            </div>
          </div>

          <!-- Q3: Why not SQL for everything? -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5 font-sans text-[12.5px]">
            <div class="font-semibold text-white">Interviewer: Why not SQL for everything?</div>
            <div class="text-slate-300 leading-relaxed">
              <strong class="text-cyan-300">Candidate:</strong> Postgres is fine for v1 at 40 writes/s. I still model it as a KV keyed by code because the access pattern is point lookup, not joins. When redirect QPS or data size grows, move the mapping table to Dynamo/Cassandra and keep Postgres for users/billing.
            </div>
          </div>

          <!-- Q4: Cache is down. What happens? -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5 font-sans text-[12.5px]">
            <div class="font-semibold text-white">Interviewer: Cache is down. What happens?</div>
            <div class="text-slate-300 leading-relaxed">
              <strong class="text-cyan-300">Candidate:</strong> Redirects hit the DB. I size the DB for that (or keep a replica / local in-process LRU per instance). Writes do not depend on cache. I would rather serve slower 302s than fail open with a wrong URL.
            </div>
          </div>

          <!-- Q5: How do you shard? -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5 font-sans text-[12.5px]">
            <div class="font-semibold text-white">Interviewer: How do you shard?</div>
            <div class="text-slate-300 leading-relaxed">
              <strong class="text-cyan-300">Candidate:</strong> Shard the mapping store by code (hash of the short code). ID generation must be global or per-shard with a shard prefix in the code so two shards never emit the same key.
            </div>
          </div>

          <!-- Q6: Custom aliases and abuse? -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5 font-sans text-[12.5px]">
            <div class="font-semibold text-white">Interviewer: Custom aliases and abuse?</div>
            <div class="text-slate-300 leading-relaxed">
              <strong class="text-cyan-300">Candidate:</strong> Rate-limit creates per IP / API key. Validate URLs (scheme, no javascript:). Optional malware URL check async. Aliases: reserved words blocked, unique constraint, maybe auth required so people cannot squat google.
            </div>
          </div>

          <!-- Q7: Multi-region? -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5 font-sans text-[12.5px]">
            <div class="font-semibold text-white">Interviewer: Multi-region?</div>
            <div class="text-slate-300 leading-relaxed">
              <strong class="text-cyan-300">Candidate:</strong> Redirects: replicate KV + cache per region, route via GeoDNS. Writes: one primary region for ID gen, or region-prefixed IDs. Accept a short replication lag; a brand-new link might 404 for a second in another region &mdash; or dual-write the cache.
            </div>
          </div>

          <!-- Q8: Whiteboard test plan -->
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5 font-sans text-[12.5px]">
            <div class="font-semibold text-white">Interviewer: How would you test this in the interview whiteboard?</div>
            <div class="text-slate-300 leading-relaxed">
              <strong class="text-cyan-300">Candidate:</strong> Write: two creates get two codes; duplicate alias &rarr; 409; invalid URL &rarr; 400. Read: hit, miss, expired, cache fill. Uniqueness under concurrent creates. Fail cache and still redirect.
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}
