/**
 * 3.4 Rate Limiting - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 34, 35, and 36
 * from The Modern System Design Interview Guide.
 */

export function renderRateLimitingContent(topic) {
  const algorithms = [
    {
      name: "Token Bucket",
      howItWorks: "Tokens added to bucket at constant refill rate. Requests consume 1 token. If bucket empty, request dropped or delayed.",
      pros: "Allows bursts of traffic up to bucket capacity; memory efficient (2 state variables)",
      cons: "Tuning two parameters (capacity and refill rate) requires careful traffic profiling",
      memory: "O(1) state per key (tokens, last_refill)",
      bestFor: "General API rate limiting (AWS, Stripe, GitHub)"
    },
    {
      name: "Leaky Bucket",
      howItWorks: "Requests enter a FIFO queue of fixed capacity. Requests leak out of the queue and are processed at a constant, steady rate.",
      pros: "Enforces a strictly smooth outflow rate; completely eliminates backend traffic spikes",
      cons: "Bursts of valid requests are delayed in queue; queue memory overhead",
      memory: "O(Queue Size) per key",
      bestFor: "Traffic shaping, packet switching, background job processing"
    },
    {
      name: "Fixed Window",
      howItWorks: "Time divided into fixed windows (e.g. 1 min). Counter tracks requests in window. Resets at window boundary.",
      pros: "Trivial to implement; minimal memory (single integer counter with TTL)",
      cons: "Boundary Burst Flaw: Can receive 2x limit at window edges (e.g. 00:59 and 01:00)",
      memory: "O(1) single integer counter",
      bestFor: "Coarse, low-precision quotas (e.g. 5,000 requests per day)"
    },
    {
      name: "Sliding Window Log",
      howItWorks: "Stores timestamp of every request in sorted set (Redis ZSET). Discards timestamps older than window. Counts remaining.",
      pros: "100% mathematically exact; zero boundary burst vulnerability",
      cons: "High memory consumption: storing every timestamp scales linearly with traffic volume",
      memory: "O(N) where N is request count in window",
      bestFor: "Low-volume, high-security APIs (login attempts, payments)"
    },
    {
      name: "Sliding Window Counter",
      howItWorks: "Weighted sum of current window count + previous window count multiplied by percentage of window remaining.",
      pros: "Memory efficient; smooths out boundary bursts; fast sub-millisecond evaluation",
      cons: "Slight mathematical approximation (assumes uniform distribution in previous window, ~0.05% error)",
      memory: "O(1) two counter integers",
      bestFor: "High-scale production systems (Cloudflare, Akamai)"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you implement distributed rate limiting across multi-region datacenters without adding cross-region WAN latency?",
      answer: `Connecting every regional API Gateway back to a single centralized Redis cluster in US-East adds 100–150ms of cross-region network round-trip latency to every HTTP request, completely destroying user experience.
      <br/><br/>
      <strong class="text-indigo-400">The Multi-Region Solution:</strong> Deploy an isolated Redis rate-limiting cluster in <em>each physical region</em>. Use a <strong>Centralized Quota Allocator</strong> service that partitions global tenant quotas into regional budgets based on historical traffic (e.g., EU gets 60% of budget, US gets 40%). Regions enforce local rate limits at sub-millisecond speeds and asynchronously reconcile actual usage every 5–10 seconds.`
    },
    {
      qNum: "Q2",
      question: "Why is the Token Bucket algorithm universally preferred over Leaky Bucket for customer-facing REST APIs?",
      answer: `Human and application traffic is inherently <strong>bursty</strong>. When a user opens a modern web application, the frontend fires 15–30 parallel API requests to fetch user profiles, notifications, theme preferences, and dashboard feeds.
      <br/><br/>
      A <strong>Token Bucket</strong> allows this initial 30-request burst instantly as long as tokens are available in the bucket, returning responses immediately. In contrast, a <strong>Leaky Bucket</strong> buffers excess requests in a queue and leaks them out at a rigid, uniform pace, artificially introducing latency and making the web application feel sluggish and unresponsive to human users.`
    },
    {
      qNum: "Q3",
      question: "How do you identify a client for rate limiting when users are behind NAT proxies or rotating IP addresses?",
      answer: `Always propose a <strong>Multi-Tiered Client Identification Hierarchy</strong>:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Authenticated Requests:</strong> Rate limit by <code>user_id</code> (from verified JWT) or <code>api_key</code>. This guarantees fair quotas regardless of which WiFi network or IP address the user connects from.</li>
        <li><strong>Unauthenticated / Public Requests:</strong> Rate limit by client IP extracted from the <code>X-Forwarded-For</code> header (validated against your edge proxy/CDN to prevent client spoofing).</li>
        <li><strong>Corporate NAT Defense:</strong> When 5,000 corporate employees share a single outbound corporate NAT IP, combine IP with the client <code>User-Agent</code> or TLS Client Fingerprint (JA3) to prevent one rogue employee from exhausting the rate limit for the entire company.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "What is the difference between Rate Limiting and Load Shedding? (High-signal senior differentiator)",
      answer: `While both reject excess requests, their purpose and perspective are fundamentally opposite:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Rate Limiting (Caller-Centric):</strong> Enforces fair usage and contract quotas <em>per client or tenant</em> to prevent single-tenant resource starvation, regardless of whether the server cluster is relaxed (10% CPU) or burning.</li>
        <li><strong>Load Shedding (Server-Centric):</strong> When a backend service is experiencing a brownout (e.g. CPU > 90%, thread pool exhausted, queue latency spiking), the server drops lower-priority incoming traffic (e.g. analytics pings, background syncs) while preserving high-priority traffic (e.g. checkout payments), <em>regardless of whether any individual client exceeded their quota</em>.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 34, 35, 36: RATE LIMITING -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              3.4 Rate Limiting
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            <strong>Rate limiting</strong> controls the rate of traffic sent or received by a network interface or service. In distributed architectures, it is a foundational defensive perimeter that prevents resource starvation, manages unexpected traffic spikes, and protects backend infrastructure against credential stuffing, web scraping, and denial-of-service (DoS) attacks.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">1. DoS & Resource Defense</span>
              <span class="text-[12px] text-slate-300">Prevents abusive clients from monopolizing database connections and server CPU threads.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. Cloud Cost Control</span>
              <span class="text-[12px] text-slate-300">Caps third-party paid API invocations (OpenAI, Stripe, Twilio) to avoid catastrophic billing spikes.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">3. Cascade Failure Defense</span>
              <span class="text-[12px] text-slate-300">Stops upstream retry storms from propagating into downstream microservices and queues.</span>
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">4. Multi-Tenant Fairness</span>
              <span class="text-[12px] text-slate-300">Isolates noisy neighbors in SaaS platforms to guarantee baseline quality of service for all users.</span>
            </div>
          </div>
        </div>

        <!-- Algorithms Comparison Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              CORE RATE LIMITING ALGORITHMS
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse text-[12px] font-sans">
              <thead>
                <tr class="bg-[#162032] text-slate-300 font-code text-[11px] border-b border-[#24314A]">
                  <th class="p-3.5 font-semibold text-white">Algorithm</th>
                  <th class="p-3.5 font-semibold text-slate-300">How It Works</th>
                  <th class="p-3.5 font-semibold text-emerald-400">Pros</th>
                  <th class="p-3.5 font-semibold text-rose-400">Cons</th>
                  <th class="p-3.5 font-semibold text-cyan-300">Memory Cost</th>
                  <th class="p-3.5 font-semibold text-indigo-300">Best For</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0F172A]">
                ${algorithms.map((alg, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#111B2E]/50' : 'bg-transparent'} hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-code text-white font-semibold whitespace-nowrap">${alg.name}</td>
                    <td class="p-3.5 text-slate-300">${alg.howItWorks}</td>
                    <td class="p-3.5 text-emerald-300/90">${alg.pros}</td>
                    <td class="p-3.5 text-rose-300/90">${alg.cons}</td>
                    <td class="p-3.5 font-code text-cyan-300 whitespace-nowrap">${alg.memory}</td>
                    <td class="p-3.5 text-indigo-200/90 font-medium">${alg.bestFor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ASCII Architecture & Redis Lua Script Box -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-4 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              PRODUCTION ARCHITECTURE: DISTRIBUTED TOKEN BUCKET IN REDIS VIA ATOMIC LUA
            </span>
            <span class="text-slate-500 text-[10.5px]">Sub-Millisecond Atomic Execution</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ATOMIC REDIS LUA SCRIPT (Eliminates Distributed Race Conditions)                       │
│                                                                                        │
│  local key = KEYS[1]                                  -- e.g. "ratelimit:{user_42}"    │
│  local capacity = tonumber(ARGV[1])                   -- Bucket max capacity (e.g. 100)│
│  local refill_rate = tonumber(ARGV[2])                -- Tokens added/sec (e.g. 10)    │
│  local now = tonumber(ARGV[3])                        -- Current unix epoch seconds    │
│  local requested = tonumber(ARGV[4])                  -- Cost of request (e.g. 1)      │
│                                                                                        │
│  -- Fetch current state atomically from Redis memory                                   │
│  local last_refill = tonumber(redis.call('get', key .. ':last_refill') or now)        │
│  local tokens = tonumber(redis.call('get', key .. ':tokens') or capacity)              │
│                                                                                        │
│  -- Calculate regenerated tokens based on elapsed time                                 │
│  local elapsed = math.max(0, now - last_refill)                                        │
│  tokens = math.min(capacity, tokens + (elapsed * refill_rate))                         │
│                                                                                        │
│  if tokens >= requested then                                                           │
│      tokens = tokens - requested                                                       │
│      redis.call('set', key .. ':tokens', tokens)                                       │
│      redis.call('set', key .. ':last_refill', now)                                     │
│      redis.call('pexpire', key .. ':tokens', 60000)   -- Auto-cleanup idle keys        │
│      return 1 -- ALLOWED                                                               │
│  else                                                                                  │
│      return 0 -- REJECTED (HTTP 429 Too Many Requests)                                 │
│  end                                                                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>

          <!-- HTTP Headers Breakdown -->
          <div class="flex flex-col gap-2 pt-1">
            <span class="text-[11px] font-bold text-cyan-300 uppercase">Standard HTTP 429 Response Headers (RFC 6585)</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
              <div class="bg-[#0F172A] p-2.5 rounded border border-[#24314A]">
                <code class="text-indigo-300 font-bold block">HTTP/1.1 429 Too Many Requests</code>
                <span class="text-slate-400 text-[10.5px]">Standard IETF rate-limit status</span>
              </div>
              <div class="bg-[#0F172A] p-2.5 rounded border border-[#24314A]">
                <code class="text-cyan-300 font-bold block">X-RateLimit-Limit: 100</code>
                <span class="text-slate-400 text-[10.5px]">Max quota permitted per window</span>
              </div>
              <div class="bg-[#0F172A] p-2.5 rounded border border-[#24314A]">
                <code class="text-amber-300 font-bold block">X-RateLimit-Remaining: 0</code>
                <span class="text-slate-400 text-[10.5px]">Available calls left in window</span>
              </div>
              <div class="bg-[#0F172A] p-2.5 rounded border border-[#24314A]">
                <code class="text-rose-400 font-bold block">Retry-After: 30</code>
                <span class="text-slate-400 text-[10.5px]">Seconds client must pause retries</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: DISTRIBUTED RATE LIMITING AT HYPER-SCALE
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, naive candidates say: <em class="text-white">"Each gateway server reads the counter from Redis, checks if counter &lt; 100, and writes counter + 1 back to Redis."</em> This reveals a failure to recognize <strong>distributed race conditions</strong>: under concurrent load, 50 gateway nodes will read <code>counter = 99</code> simultaneously and allow 50 requests through, completely breaking the quota.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[12px] font-sans pt-1">
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 flex flex-col gap-1">
              <strong class="text-white font-code text-[11px]">1. Redis Lua Scripts</strong>
              <span class="text-slate-300 text-[11.5px]">Redis executes Lua scripts single-threaded in memory, guaranteeing atomic read-check-write with zero lock contention.</span>
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 flex flex-col gap-1">
              <strong class="text-white font-code text-[11px]">2. Cluster Hash Tags</strong>
              <span class="text-slate-300 text-[11.5px]">In sharded Redis clusters, use hash tags like <code>{user_42}:tokens</code> to guarantee all keys for that user map to the identical cluster shard.</span>
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 flex flex-col gap-1">
              <strong class="text-white font-code text-[11px]">3. Local Token Leases</strong>
              <span class="text-slate-300 text-[11.5px]">At 1M+ QPS, pinging Redis on every call saturates network NICs. Gateways fetch a lease of 50 tokens and decrement locally.</span>
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: THE FIXED WINDOW BURST & FAIL-OPEN VS. FAIL-CLOSED
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Never use <strong>Fixed Window Counter</strong> for security-critical or capacity-constrained APIs. If a user is allowed 100 requests per minute, they can send 100 requests at <code>00:59</code> and another 100 requests at <code>01:00</code>, delivering a burst of <strong>200 requests in 2 seconds</strong> without violating the algorithm!
          </p>
          <div class="font-sans text-[12.5px] text-amber-200/90 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20 leading-relaxed">
            <strong class="text-amber-100">The Availability Trap:</strong> If your centralized Redis rate limiting cluster experiences a network partition or crash, does your API Gateway <strong>Fail-Open</strong> (permit traffic) or <strong>Fail-Closed</strong> (drop all traffic)? In 99% of web architectures, you must <strong>Fail-Open with local fallback limits</strong>. Failing closed turns a cache glitch into a total company-wide outage.
          </div>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU
          </span>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            You are designing the rate limiting tier for an AI search platform like Perplexity. Free anonymous users get 5 queries/hour, authenticated users get 50 queries/hour, and Pro subscribers get 500 queries/hour. How would you design the identification layer (IP vs Session vs JWT), bypass internal microservices, and ensure rate-limiting adds less than 1ms of overhead to p99 requests?
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
            Rate limiting protects system availability, controls cloud costs, and guarantees multi-tenant fairness. Know the 5 algorithms cold: Token Bucket (burst-tolerant default), Leaky Bucket (smooth output), Fixed Window (simple but flawed boundary), Sliding Log (exact but memory heavy), and Sliding Window Counter (production hybrid). In distributed systems, use atomic Redis Lua scripts with hash tags, implement local token leases for high scale, and always fail-open with local fallbacks if the cache cluster crashes.
          </p>
        </div>

        <!-- Page 36 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 36</span>
        </div>

      </div>

    </div>
  `;
}
