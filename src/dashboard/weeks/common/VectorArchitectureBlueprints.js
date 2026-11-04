/**
 * Vector Architecture Blueprints
 * High-definition, razor-sharp vector SVG and HTML architectural diagrams
 * for Questions 1 through 5.
 * 
 * Scalable at any zoom level with crystal-clear typography, dark/light mode support,
 * and complete representation of all sub-flows, sequence diagrams, and component rationales.
 */

export function renderUrlShortenerVectorBlueprint() {
  return `
    <div class="vector-blueprint flex flex-col gap-6 font-sans text-slate-800 dark:text-slate-100">
      
      <!-- TOP ARCHITECTURE DIAGRAM CONTAINER -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white">1. High-Level Architecture</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">CORE TOPOLOGY</span>
        </div>

        <!-- SVG ARCHITECTURE MAP -->
        <div class="min-w-[840px] flex flex-col gap-5 py-2">
          
          <div class="grid grid-cols-12 gap-4 items-center">
            
            <!-- Clients Column (col 2) -->
            <div class="col-span-2 flex flex-col gap-3">
              <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-center shadow-xs">
                <span class="material-symbols-outlined text-[24px] text-blue-500 mb-1">devices</span>
                <div class="font-bold text-[13px] text-slate-800 dark:text-slate-200">Clients</div>
                <div class="text-[11px] text-slate-500">Web &bull; Mobile &bull; API</div>
              </div>
              <div class="flex flex-col gap-1.5 text-[10.5px] font-mono bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/50">
                <span class="text-blue-700 dark:text-blue-300 font-bold">POST /api/shorten</span>
                <span class="text-emerald-700 dark:text-emerald-300 font-bold">GET /{short-code}</span>
              </div>
            </div>

            <!-- Arrow to DNS/LB -->
            <div class="col-span-1 flex items-center justify-center">
              <div class="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                <span class="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 text-[10px]">&blacktriangleright;</span>
              </div>
            </div>

            <!-- DNS / Load Balancer (col 2) -->
            <div class="col-span-2 flex flex-col gap-2">
              <div class="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/30 text-center shadow-xs">
                <span class="material-symbols-outlined text-[26px] text-indigo-500 mb-1">hub</span>
                <div class="font-bold text-[13px] text-indigo-950 dark:text-indigo-200">DNS / Load Balancer</div>
                <div class="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">L4/L7 Traffic Steering &bull; SSL</div>
              </div>
            </div>

            <!-- Arrow to App Layer -->
            <div class="col-span-1 flex items-center justify-center">
              <div class="w-full h-0.5 bg-indigo-300 dark:bg-indigo-800 relative">
                <span class="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-500 text-[10px]">&blacktriangleright;</span>
              </div>
            </div>

            <!-- Application Layer (col 6) -->
            <div class="col-span-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700/80 p-4 bg-slate-50/50 dark:bg-slate-900/30">
              <div class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Stateless Application Layer</div>
              <div class="grid grid-cols-2 gap-3">
                
                <!-- URL Creation Service -->
                <div class="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-[#111A2E] shadow-xs">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-symbols-outlined text-[18px] text-blue-500">add_link</span>
                    <span class="font-bold text-[12.5px] text-slate-900 dark:text-white">URL Creation Service</span>
                  </div>
                  <ul class="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 mt-1.5 list-disc list-inside">
                    <li>URL Validation &amp; Sanitization</li>
                    <li>Base62 / Snowflake ID generation</li>
                    <li>Synchronous write to DB</li>
                    <li>Warm cache &amp; emit event</li>
                  </ul>
                </div>

                <!-- Redirect Service -->
                <div class="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-[#111A2E] shadow-xs">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="material-symbols-outlined text-[18px] text-emerald-500">shortcut</span>
                    <span class="font-bold text-[12.5px] text-slate-900 dark:text-white">Redirect Service</span>
                  </div>
                  <ul class="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 mt-1.5 list-disc list-inside">
                    <li>Fast lookup in Redis cache</li>
                    <li>Cache-miss fallback to DB</li>
                    <li>HTTP 302 Found redirect</li>
                    <li>Async click event emission</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>

          <!-- CONNECTING FLOW TO STORAGE & ANALYTICS -->
          <div class="grid grid-cols-12 gap-4 mt-2">
            
            <div class="col-span-5"></div>

            <!-- Storage Tier (Col 7) -->
            <div class="col-span-7 grid grid-cols-2 gap-4">
              
              <!-- Hot Cache & Database -->
              <div class="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[12.5px] text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[18px] text-rose-500">memory</span>
                    Redis Cache
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">&lt; 5ms</span>
                </div>
                <div class="text-[11px] text-slate-600 dark:text-slate-300">
                  Key-value store holding hot short codes. Eviction: LRU with TTL.
                </div>
                
                <div class="pt-2 border-t border-rose-200 dark:border-rose-900/50">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-[12.5px] text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[18px] text-purple-500">database</span>
                      Mapping DB (SQL / NoSQL)
                    </span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">Authoritative</span>
                  </div>
                  <div class="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    Stores durable short_code &rarr; long_url rows with unique constraint on code.
                  </div>
                </div>
              </div>

              <!-- Async Analytics Pipeline -->
              <div class="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[12.5px] text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[18px] text-amber-500">queue</span>
                    Kafka / SQS Stream
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">Async</span>
                </div>
                <div class="text-[11px] text-slate-600 dark:text-slate-300">
                  Decouples redirect latency from analytics writes. Ingests click events.
                </div>
                
                <div class="pt-2 border-t border-amber-200 dark:border-amber-900/50 flex flex-col gap-2">
                  <div class="flex items-center gap-1.5 text-[12px] font-semibold text-slate-800 dark:text-slate-200">
                    <span class="material-symbols-outlined text-[16px] text-teal-500">analytics</span>
                    Analytics Processor &rarr; OLAP Store
                  </div>
                  <div class="text-[11px] text-slate-600 dark:text-slate-300">
                    Aggregates click counts, geography, referrers, device types in ClickHouse / Warehouse.
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      <!-- DETAILED SEQUENCE FLOWS (CREATION VS REDIRECT) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        <!-- URL Creation Flow (Steps 1-6) -->
        <div class="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-[#0D1527] p-5 shadow-xs flex flex-col gap-3">
          <div class="flex items-center gap-2 border-b border-blue-200/60 dark:border-blue-900/40 pb-2.5">
            <span class="px-2 py-0.5 rounded bg-blue-500 text-white font-mono text-[11px] font-bold">FLOW A</span>
            <h5 class="font-bold text-[14px] text-blue-950 dark:text-blue-200">URL Creation Flow (Write Path)</h5>
          </div>
          <ol class="space-y-2.5 text-[12.5px] text-slate-700 dark:text-slate-300">
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">1</span>
              <div><strong>Client sends long URL:</strong> Submits <code class="font-mono text-blue-600 dark:text-blue-400">POST /api/shorten</code> with destination URL &amp; optional alias.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">2</span>
              <div><strong>Generate unique short code:</strong> Service generates ID via Base62 encoding or Snowflake counter; checks uniqueness.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">3</span>
              <div><strong>Persist mapping in database:</strong> Writes <code class="font-mono">short_code &rarr; long_url</code> row durably with conflict handling.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">4</span>
              <div><strong>Cache in Redis:</strong> Populates key in cache with TTL for immediate low-latency reads.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">5</span>
              <div><strong>Emit creation event:</strong> Publishes async URL created message to event queue.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">6</span>
              <div><strong>Return short URL:</strong> Responds to client with <code class="font-mono text-emerald-600 dark:text-emerald-400">https://sho.rt/abc123</code>.</div>
            </li>
          </ol>
        </div>

        <!-- Redirect Flow (Steps 1-6) -->
        <div class="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-[#0D241C] p-5 shadow-xs flex flex-col gap-3">
          <div class="flex items-center gap-2 border-b border-emerald-200/60 dark:border-emerald-900/40 pb-2.5">
            <span class="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[11px] font-bold">FLOW B</span>
            <h5 class="font-bold text-[14px] text-emerald-950 dark:text-emerald-200">Redirect Flow (Read Path)</h5>
          </div>
          <ol class="space-y-2.5 text-[12.5px] text-slate-700 dark:text-slate-300">
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">1</span>
              <div><strong>Client accesses short link:</strong> Browser issues <code class="font-mono text-emerald-600 dark:text-emerald-400">GET /abc123</code>.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">2</span>
              <div><strong>Check Redis Cache:</strong> Redirect service executes fast in-memory key lookup.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">3</span>
              <div><strong>Cache Hit path:</strong> If found, immediately returns HTTP 302 Found with <code class="font-mono">Location: long_url</code>.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">4</span>
              <div><strong>Cache Miss path:</strong> Queries durable mapping DB, warms Redis with value, and prepares redirect.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">5</span>
              <div><strong>Emit click event:</strong> Publishes click record (timestamp, IP/country, user-agent) to Kafka.</div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">6</span>
              <div><strong>Browser redirected:</strong> Client arrives at final destination with negligible latency (&lt;100ms).</div>
            </li>
          </ol>
        </div>

      </div>

    </div>
  `;
}

export function renderRateLimiterVectorBlueprint() {
  return `
    <div class="vector-blueprint flex flex-col gap-6 font-sans text-slate-800 dark:text-slate-100">
      
      <!-- TOP ARCHITECTURE MAP -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white">1. High-Level Architecture</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">MIDDLEWARE &amp; COORDINATION</span>
        </div>

        <div class="min-w-[840px] flex flex-col gap-5 py-2">
          
          <div class="grid grid-cols-12 gap-4 items-center">
            
            <!-- Clients -->
            <div class="col-span-2 flex flex-col gap-2">
              <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center shadow-xs">
                <span class="material-symbols-outlined text-[24px] text-blue-500 mb-1">public</span>
                <div class="font-bold text-[13px] text-slate-800 dark:text-slate-200">Clients</div>
                <div class="text-[10.5px] text-slate-500">Web &bull; Mobile &bull; APIs</div>
              </div>
            </div>

            <!-- Arrow -->
            <div class="col-span-1 flex items-center justify-center">
              <div class="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                <span class="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">&blacktriangleright;</span>
              </div>
            </div>

            <!-- Load Balancer / API Gateway -->
            <div class="col-span-2 flex flex-col gap-2">
              <div class="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/60 dark:bg-purple-950/30 text-center shadow-xs">
                <span class="material-symbols-outlined text-[24px] text-purple-500 mb-1">gate</span>
                <div class="font-bold text-[13px] text-purple-950 dark:text-purple-200">Load Balancer</div>
                <div class="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">API Gateway Entry</div>
              </div>
            </div>

            <!-- Arrow -->
            <div class="col-span-1 flex items-center justify-center">
              <div class="w-full h-0.5 bg-purple-300 dark:bg-purple-800 relative">
                <span class="absolute right-0 top-1/2 -translate-y-1/2 text-purple-500 text-[10px]">&blacktriangleright;</span>
              </div>
            </div>

            <!-- Rate Limiter Core -->
            <div class="col-span-3 p-4 rounded-xl border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-[20px] text-emerald-600 dark:text-emerald-400">shield</span>
                <span class="font-bold text-[13.5px] text-emerald-950 dark:text-emerald-100">Rate Limiter</span>
              </div>
              <ul class="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                <li>Identify caller (IP / User / Key)</li>
                <li>Fetch rule from policy cache</li>
                <li>Atomic Redis check &amp; debit</li>
                <li>Allow or reject (HTTP 429)</li>
              </ul>
            </div>

            <!-- Outgoing branches -->
            <div class="col-span-3 flex flex-col gap-2.5">
              <!-- Allow Path -->
              <div class="p-3 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-[#111A2E] shadow-xs flex items-center gap-2.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <div>
                  <div class="text-[11.5px] font-bold text-emerald-700 dark:text-emerald-300">Allow &rarr; Backend Service</div>
                  <div class="text-[10px] text-slate-500">Attach X-RateLimit-Remaining</div>
                </div>
              </div>
              <!-- Reject Path -->
              <div class="p-3 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-[#111A2E] shadow-xs flex items-center gap-2.5">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                <div>
                  <div class="text-[11.5px] font-bold text-rose-700 dark:text-rose-300">Reject &rarr; HTTP 429 Error</div>
                  <div class="text-[10px] text-slate-500">Include Retry-After header</div>
                </div>
              </div>
            </div>

          </div>

          <!-- BOTTOM COUPLING: RULES STORE & REDIS COUNTERS -->
          <div class="grid grid-cols-12 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div class="col-span-5"></div>
            
            <!-- Rules Store & Policy Cache -->
            <div class="col-span-3 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-[11px]">
              <div class="font-bold text-[12px] text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                <span class="material-symbols-outlined text-[16px] text-amber-500">rule</span>
                Rules Store &amp; Policy Cache
              </div>
              <div class="text-slate-600 dark:text-slate-300">
                PostgreSQL rules table + Local/Redis memory cache for static quotas.
              </div>
            </div>

            <!-- Distributed Counter Store -->
            <div class="col-span-4 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-[11px]">
              <div class="font-bold text-[12px] text-rose-900 dark:text-rose-200 flex items-center gap-1.5 mb-1">
                <span class="material-symbols-outlined text-[16px] text-rose-500">speed</span>
                Distributed Counter (Redis Cluster)
              </div>
              <div class="text-slate-600 dark:text-slate-300">
                Atomic Lua scripts execute token refill &amp; decrement. High availability with replicas.
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- 5-STEP RATE LIMITING LOGIC & ALGORITHM COMPARISON -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        <!-- 5-Step Logic Flow (col 7) -->
        <div class="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
            <h5 class="font-bold text-[14px] text-slate-900 dark:text-white">2. Request Flow &amp; Evaluation Pipeline</h5>
            <span class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">5 STEPS</span>
          </div>
          <div class="space-y-3 text-[12px]">
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">1</span>
              <div><strong>Incoming Request:</strong> Client sends request to protected route (<code class="font-mono text-indigo-500">POST /api/v1/orders</code>).</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">2</span>
              <div><strong>Identify Client:</strong> Extract API key, authenticated user ID, or client IP fallback.</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">3</span>
              <div><strong>Fetch Rate Limit Rule:</strong> Query Policy Cache for rule config (e.g. 100 requests / 60 seconds).</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">4</span>
              <div><strong>Atomic Check &amp; Increment:</strong> Execute Redis Lua script with TTL on key <code class="font-mono text-cyan-600 dark:text-cyan-400">rate:{user}:{window}</code>.</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 mt-0.5">5</span>
              <div><strong>Decision Gate:</strong> If <code class="font-mono">count &le; limit</code> &rarr; forward with headers. If exceeded &rarr; reject immediately with HTTP 429.</div>
            </div>
          </div>
        </div>

        <!-- Algorithm & Scopes Card (col 5) -->
        <div class="lg:col-span-5 flex flex-col gap-4">
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 shadow-xs">
            <h6 class="font-bold text-[13px] text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-indigo-500">tune</span>
              Algorithm Selection Matrix
            </h6>
            <ul class="text-[11.5px] space-y-1.5 text-slate-600 dark:text-slate-300">
              <li><strong>Token Bucket:</strong> Allows bursts up to capacity, refills at steady rate. (Recommended)</li>
              <li><strong>Leaky Bucket:</strong> Smooths bursts into uniform outbound traffic.</li>
              <li><strong>Sliding Window Counter:</strong> Blends prior &amp; current window counters.</li>
              <li><strong>Fixed Window:</strong> Simple, but vulnerable to 2x boundary bursts.</li>
            </ul>
          </div>

          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 shadow-xs">
            <h6 class="font-bold text-[13px] text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-cyan-500">vpn_key</span>
              Example Redis State
            </h6>
            <div class="font-mono text-[11px] p-2.5 rounded bg-slate-900 text-cyan-300 overflow-x-auto space-y-1">
              <div>Key: rate:user123:2026-10-12T07:00</div>
              <div>Value: 58 (Tokens remaining: 42)</div>
              <div>TTL: 60 seconds (Auto-expiring)</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function renderNotificationSystemVectorBlueprint() {
  return `
    <div class="vector-blueprint flex flex-col gap-6 font-sans text-slate-800 dark:text-slate-100">
      
      <!-- TOP ARCHITECTURE MAP -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white">1. High-Level Architecture</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">EVENT-DRIVEN INGESTION</span>
        </div>

        <div class="min-w-[880px] flex flex-col gap-5 py-2">
          
          <div class="grid grid-cols-12 gap-3.5 items-stretch">
            
            <!-- Event Sources (col 2) -->
            <div class="col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-2">
              <span class="text-[11px] font-mono font-bold text-slate-500 uppercase">Event Sources</span>
              <ul class="text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300">
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>User Actions</li>
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Backend Services</li>
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Scheduled Jobs</li>
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>Partner Hooks</li>
              </ul>
            </div>

            <!-- API Gateway (col 2) -->
            <div class="col-span-2 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col justify-between">
              <div>
                <div class="font-bold text-[12.5px] text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5 mb-1.5">
                  <span class="material-symbols-outlined text-[18px] text-indigo-500">fence</span>
                  API Gateway
                </div>
                <ul class="text-[10.5px] text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  <li>Authentication</li>
                  <li>Schema validation</li>
                  <li>Rate limiting</li>
                  <li>Idempotency key check</li>
                </ul>
              </div>
              <span class="text-[9.5px] font-mono text-indigo-600 dark:text-indigo-400 mt-2">Deduplicates Retries</span>
            </div>

            <!-- Notification Service (col 3) -->
            <div class="col-span-3 p-4 rounded-xl border-2 border-cyan-400 dark:border-cyan-600 bg-cyan-50/40 dark:bg-cyan-950/20 flex flex-col gap-2">
              <div class="font-bold text-[13px] text-cyan-950 dark:text-cyan-200 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[18px] text-cyan-500">campaign</span>
                Notification Service
              </div>
              <ul class="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                <li>Check recipient preferences &amp; opt-ins</li>
                <li>Fetch localized templates</li>
                <li>Fan-out to respective channel queues</li>
                <li>Persist record in Notification DB</li>
              </ul>
              <div class="mt-auto pt-2 border-t border-cyan-200 dark:border-cyan-900/40 text-[10px] text-slate-500">
                Backed by <strong>Transactional Outbox</strong>
              </div>
            </div>

            <!-- Message Queues (col 2) -->
            <div class="col-span-2 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col gap-2">
              <span class="text-[11px] font-mono font-bold text-amber-900 dark:text-amber-200">Durable Queues</span>
              <div class="space-y-1.5 text-[10.5px] font-mono">
                <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 text-blue-600 dark:text-blue-400">Push Queue</div>
                <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 text-emerald-600 dark:text-emerald-400">SMS Queue</div>
                <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 text-indigo-600 dark:text-indigo-400">Email Queue</div>
                <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 text-purple-600 dark:text-purple-400">In-App Queue</div>
              </div>
            </div>

            <!-- Workers & Providers (col 3) -->
            <div class="col-span-3 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-mono font-bold text-emerald-900 dark:text-emerald-200">Channel Workers &rarr; Providers</span>
                <div class="space-y-1.5 mt-2 text-[10.5px]">
                  <div class="flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-900">
                    <span>Push Worker</span>
                    <strong class="text-cyan-600 dark:text-cyan-400">FCM / APNs</strong>
                  </div>
                  <div class="flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-900">
                    <span>SMS Worker</span>
                    <strong class="text-emerald-600 dark:text-emerald-400">Twilio</strong>
                  </div>
                  <div class="flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-900">
                    <span>Email Worker</span>
                    <strong class="text-indigo-600 dark:text-indigo-400">SES / SendGrid</strong>
                  </div>
                </div>
              </div>
              <div class="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between text-[10px]">
                <span class="text-rose-600 dark:text-rose-400 font-bold">Exhausted &rarr; DLQ</span>
                <span class="text-slate-500">Backoff &amp; Jitter</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- 6-STEP NOTIFICATION FLOW (ORDER CONFIRMATION EXAMPLE) -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs">
        <h5 class="font-bold text-[14px] text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-indigo-500">linear_scale</span>
          2. End-to-End Notification Flow Walkthrough (Example: Order Confirmation)
        </h5>
        <div class="grid grid-cols-1 md:grid-cols-6 gap-3 text-[11.5px]">
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <strong class="text-slate-900 dark:text-white">Event Triggered</strong>
            <span class="text-slate-500">User completes checkout in Order Service.</span>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
            <strong class="text-slate-900 dark:text-white">Create &amp; Prefs</strong>
            <span class="text-slate-500">Notification Service checks consent &amp; stores metadata.</span>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
            <strong class="text-slate-900 dark:text-white">Publish to Queues</strong>
            <span class="text-slate-500">Enqueues to Push, SMS, and Email topic partitions.</span>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
            <strong class="text-slate-900 dark:text-white">Workers Process</strong>
            <span class="text-slate-500">Channel workers fetch template and call provider API.</span>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">5</span>
            <strong class="text-slate-900 dark:text-white">Update Status</strong>
            <span class="text-slate-500">Webhooks confirm DELIVERED or record failure state.</span>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">6</span>
            <strong class="text-slate-900 dark:text-white">User Receives</strong>
            <span class="text-slate-500">Notification reaches end device securely.</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function renderDistributedCacheVectorBlueprint() {
  return `
    <div class="vector-blueprint flex flex-col gap-6 font-sans text-slate-800 dark:text-slate-100">
      
      <!-- TOP ARCHITECTURE MAP -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
            <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white">1. High-Level Architecture</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">SHARDED CACHE CLUSTER</span>
        </div>

        <div class="min-w-[880px] flex flex-col gap-5 py-2">
          
          <div class="grid grid-cols-12 gap-3.5 items-center">
            
            <!-- Clients -->
            <div class="col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
              <span class="material-symbols-outlined text-[24px] text-blue-500 mb-1">devices</span>
              <div class="font-bold text-[13px] text-slate-800 dark:text-slate-200">App Clients</div>
              <div class="text-[10px] text-slate-500">Web &bull; Microservices</div>
            </div>

            <!-- Arrow -->
            <div class="col-span-1 flex items-center justify-center">
              <div class="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                <span class="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">&blacktriangleright;</span>
              </div>
            </div>

            <!-- Load Balancer -->
            <div class="col-span-2 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-center">
              <span class="material-symbols-outlined text-[22px] text-indigo-500 mb-1">alt_route</span>
              <div class="font-bold text-[13px] text-indigo-950 dark:text-indigo-200">Load Balancer</div>
              <div class="text-[10px] text-slate-500">Health checks &bull; Autoscaling</div>
            </div>

            <!-- Arrow -->
            <div class="col-span-1 flex items-center justify-center">
              <div class="w-full h-0.5 bg-indigo-300 dark:bg-indigo-800 relative">
                <span class="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-500 text-[10px]">&blacktriangleright;</span>
              </div>
            </div>

            <!-- Cache Router -->
            <div class="col-span-2 p-4 rounded-xl border-2 border-purple-400 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-950/20">
              <div class="font-bold text-[13px] text-purple-950 dark:text-purple-200 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[18px] text-purple-500">hub</span>
                Cache Router
              </div>
              <ul class="text-[10.5px] text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                <li>Consistent hashing</li>
                <li>Shard node selection</li>
                <li>Failover handling</li>
                <li>Read/write dispatch</li>
              </ul>
            </div>

            <!-- Arrow -->
            <div class="col-span-1 flex items-center justify-center">
              <div class="w-full h-0.5 bg-purple-300 dark:bg-purple-800 relative">
                <span class="absolute right-0 top-1/2 -translate-y-1/2 text-purple-500 text-[10px]">&blacktriangleright;</span>
              </div>
            </div>

            <!-- Distributed Cluster Shards -->
            <div class="col-span-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-3.5">
              <span class="text-[11px] font-mono font-bold text-rose-900 dark:text-rose-200 block mb-2">Cache Cluster (Redis Shards)</span>
              <div class="space-y-1.5 text-[10.5px]">
                <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 flex justify-between">
                  <span><strong>Shard 1:</strong> Primary</span>
                  <span class="text-rose-600 dark:text-rose-400">2 Replicas</span>
                </div>
                <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 flex justify-between">
                  <span><strong>Shard 2:</strong> Primary</span>
                  <span class="text-rose-600 dark:text-rose-400">2 Replicas</span>
                </div>
                <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 flex justify-between">
                  <span><strong>Shard N:</strong> Primary</span>
                  <span class="text-rose-600 dark:text-rose-400">2 Replicas</span>
                </div>
              </div>
            </div>

          </div>

          <!-- 4 PILLARS -->
          <div class="grid grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11.5px]">
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-0.5">Partitioning</strong>
              <span class="text-slate-600 dark:text-slate-300">Consistent Hashing with virtual nodes prevents hotspots.</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-emerald-600 dark:text-emerald-400 block mb-0.5">Replication</strong>
              <span class="text-slate-600 dark:text-slate-300">Primary + Async Replicas for high availability &amp; failover.</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-amber-600 dark:text-amber-400 block mb-0.5">Eviction Policies</strong>
              <span class="text-slate-600 dark:text-slate-300">LRU / LFU memory reclaim + TTL expiration for freshness.</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-rose-600 dark:text-rose-400 block mb-0.5">Monitoring</strong>
              <span class="text-slate-600 dark:text-slate-300">Tracks cache hit ratio, memory consumption, evictions, latency.</span>
            </div>
          </div>

        </div>
      </div>

      <!-- READ FLOW & WRITE STRATEGIES -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        <!-- Read Flow (Hit vs Miss) -->
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-3">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-emerald-500">flash_on</span>
            2. Read Flow (Cache Hit vs. Cache Miss)
          </h5>
          <div class="space-y-3 text-[12px]">
            <div class="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
              <div class="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex justify-between">
                <span>Cache Hit (Fast Path)</span>
                <span class="font-mono text-[11px]">1–5 ms Latency</span>
              </div>
              <div class="text-slate-600 dark:text-slate-300">
                1. Client issues <code class="font-mono">GET key</code> &rarr; 2. Cache Router hashes key to node &rarr; 3. Node returns cached value immediately.
              </div>
            </div>

            <div class="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
              <div class="font-bold text-amber-800 dark:text-amber-300 mb-1 flex justify-between">
                <span>Cache Miss (Fallback Path)</span>
                <span class="font-mono text-[11px]">10–100 ms Latency</span>
              </div>
              <div class="text-slate-600 dark:text-slate-300">
                1. Node returns NOT_FOUND &rarr; 2. Client queries Authoritative DB &rarr; 3. Client writes back to cache with TTL &rarr; 4. Returns payload.
              </div>
            </div>
          </div>
        </div>

        <!-- Write Strategies -->
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-3">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-blue-500">edit_note</span>
            3. Write Strategies Comparison
          </h5>
          <div class="space-y-2 text-[12px]">
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <strong class="text-indigo-600 dark:text-indigo-400">Write-Through:</strong>
              <span class="text-slate-600 dark:text-slate-300"> Writes to cache and database synchronously. Strong consistency, higher write latency.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <strong class="text-teal-600 dark:text-teal-400">Write-Behind (Write-Back):</strong>
              <span class="text-slate-600 dark:text-slate-300"> Writes to cache immediately, flushes asynchronously to DB in batches. Ultra fast, data loss risk on crash.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <strong class="text-amber-600 dark:text-amber-400">Write-Around:</strong>
              <span class="text-slate-600 dark:text-slate-300"> Writes directly to DB only; cache is only populated when read misses occur. Avoids cache churn for write-heavy data.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function renderApiGatewayVectorBlueprint() {
  return `
    <div class="vector-blueprint flex flex-col gap-6 font-sans text-slate-800 dark:text-slate-100">
      
      <!-- TOP ARCHITECTURE MAP -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white">1. High-Level Architecture</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">EDGE GATEWAY CLUSTER</span>
        </div>

        <div class="min-w-[900px] flex flex-col gap-5 py-2">
          
          <div class="grid grid-cols-12 gap-3 items-stretch">
            
            <!-- Clients (col 2) -->
            <div class="col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-mono font-bold text-slate-500 uppercase">Clients</span>
                <ul class="text-[11px] space-y-1.5 mt-2 text-slate-700 dark:text-slate-300">
                  <li>Web Browser</li>
                  <li>Mobile App</li>
                  <li>Internal Services</li>
                  <li>External Partners</li>
                </ul>
              </div>
              <span class="text-[10px] font-mono text-blue-600 dark:text-blue-400">HTTPS / gRPC</span>
            </div>

            <!-- Gateway Cluster Pipeline (col 7) -->
            <div class="col-span-7 rounded-2xl border-2 border-indigo-400 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-[13px] text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[18px] text-indigo-500">grid_view</span>
                  API Gateway Execution Pipeline (Cluster)
                </span>
                <span class="text-[10px] font-mono text-slate-500">Stateless &bull; Horizontal Scale</span>
              </div>

              <!-- 5 Pipeline Stages -->
              <div class="grid grid-cols-5 gap-2 text-[11px]">
                
                <div class="p-2.5 rounded-lg bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <strong class="text-blue-600 dark:text-blue-400 text-[11.5px]">1. TLS</strong>
                  <span class="text-slate-500 text-[10px]">HTTPS term, SSL certs, WAF</span>
                </div>

                <div class="p-2.5 rounded-lg bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <strong class="text-purple-600 dark:text-purple-400 text-[11.5px]">2. Auth</strong>
                  <span class="text-slate-500 text-[10px]">JWT verify, OAuth2, API keys</span>
                </div>

                <div class="p-2.5 rounded-lg bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <strong class="text-emerald-600 dark:text-emerald-400 text-[11.5px]">3. Rate Limit</strong>
                  <span class="text-slate-500 text-[10px]">Token bucket, per-IP/user</span>
                </div>

                <div class="p-2.5 rounded-lg bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <strong class="text-amber-600 dark:text-amber-400 text-[11.5px]">4. Transform</strong>
                  <span class="text-slate-500 text-[10px]">Rewrite headers, protocol translation</span>
                </div>

                <div class="p-2.5 rounded-lg bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <strong class="text-rose-600 dark:text-rose-400 text-[11.5px]">5. Route / LB</strong>
                  <span class="text-slate-500 text-[10px]">Service discovery, Canary / A-B</span>
                </div>

              </div>

              <!-- Top Dependencies -->
              <div class="flex items-center justify-between text-[10.5px] pt-1 text-slate-500">
                <span>Config Store: Route configs &amp; feature flags</span>
                <span>Service Registry: Kubernetes / Consul healthy pods</span>
              </div>
            </div>

            <!-- Backend Services (col 3) -->
            <div class="col-span-3 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-mono font-bold text-emerald-900 dark:text-emerald-200 uppercase">Backend Services</span>
                <div class="space-y-1.5 mt-2 text-[11px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200">User Service (/users)</div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200">Product Service (/products)</div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200">Order Service (/orders)</div>
                </div>
              </div>
              <span class="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 mt-2">Protected Behind Gateway</span>
            </div>

          </div>

          <!-- OBSERVABILITY BAR -->
          <div class="grid grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11.5px]">
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-blue-500">description</span>
              <div><strong>Logging:</strong> ELK / OpenSearch access logs</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-emerald-500">monitoring</span>
              <div><strong>Metrics:</strong> Prometheus + Grafana (QPS, p99)</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-purple-500">account_tree</span>
              <div><strong>Tracing:</strong> Jaeger / OpenTelemetry traces</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-rose-500">notifications_active</span>
              <div><strong>Alerting:</strong> PagerDuty threshold alarms</div>
            </div>
          </div>

        </div>
      </div>

      <!-- SEQUENCE FLOW (REQUEST & RESPONSE) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 text-[12px]">
        
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-2.5">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-indigo-500">arrow_forward</span>
            2. Request Ingress Flow
          </h5>
          <ol class="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside">
            <li>Client initiates HTTPS request (<code class="font-mono">GET /api/v1/orders/123</code>).</li>
            <li>Gateway terminates TLS and validates bearer JWT token.</li>
            <li>Applies rate limiting checks against Policy Cache.</li>
            <li>Queries Service Registry for healthy instances of Order Service.</li>
            <li>Applies header transformations, attaches <code class="font-mono">X-Trace-ID</code>, and dispatches.</li>
          </ol>
        </div>

        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-2.5">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-emerald-500">arrow_back</span>
            3. Response Egress Flow
          </h5>
          <ol class="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside">
            <li>Backend service replies with JSON or gRPC response.</li>
            <li>Gateway compresses payload (gzip / brotli) if accepted by client.</li>
            <li>Injects standard security headers (HSTS, CSP, CORS).</li>
            <li>Optionally caches idempotent GET responses in edge cache.</li>
            <li>Emits latency metric and returns final response (HTTP 200) to client.</li>
          </ol>
        </div>

      </div>

    </div>
  `;
}

export function renderInstagramVectorBlueprint() {
  return `
    <div class="vector-blueprint flex flex-col gap-6 font-sans text-slate-800 dark:text-slate-100">
      
      <!-- TOP ARCHITECTURE MAP -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
            <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white">1. High-Level Architecture</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold">HYBRID FAN-OUT &amp; DIRECT S3 INGRESS</span>
        </div>

        <div class="min-w-[920px] flex flex-col gap-5 py-2">
          
          <div class="grid grid-cols-12 gap-3 items-stretch">
            
            <!-- Clients (col 2) -->
            <div class="col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-mono font-bold text-slate-500 uppercase">Clients</span>
                <ul class="text-[11px] space-y-1.5 mt-2 text-slate-700 dark:text-slate-300">
                  <li>iOS &bull; Android App</li>
                  <li>Web Browser</li>
                  <li>Direct S3 Upload</li>
                  <li>Infinite-Scroll Feed</li>
                </ul>
              </div>
              <span class="text-[10px] font-mono text-pink-600 dark:text-pink-400">100M+ DAU</span>
            </div>

            <!-- Ingress & Storage (col 3) -->
            <div class="col-span-3 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col justify-between">
              <div>
                <div class="font-bold text-[12.5px] text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5 mb-1.5">
                  <span class="material-symbols-outlined text-[18px] text-indigo-500">cloud_upload</span>
                  Direct Media Ingress
                </div>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>Gateway:</strong> Presigned S3 Token
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>S3 Store:</strong> Raw &bull; WebP Variants
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>Transcoder:</strong> 150/600/1080 Thumbnails
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-indigo-600 dark:text-indigo-400 mt-2">Zero Gateway Media Choke</span>
            </div>

            <!-- Core Services & Event Stream (col 3) -->
            <div class="col-span-3 p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex flex-col justify-between">
              <div>
                <div class="font-bold text-[12.5px] text-purple-950 dark:text-purple-200 flex items-center gap-1.5 mb-1.5">
                  <span class="material-symbols-outlined text-[18px] text-purple-500">sync_alt</span>
                  Post Core &amp; Event Stream
                </div>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>Post Service:</strong> Outbox Pattern
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>PostgreSQL DB:</strong> Post &amp; Social Graph
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>Kafka:</strong> PostCreated Event Bus
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-purple-600 dark:text-purple-400 mt-2">Decoupled Timeline Processing</span>
            </div>

            <!-- Hybrid Fan-out & Timeline Cache (col 4) -->
            <div class="col-span-4 rounded-xl border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 flex flex-col justify-between">
              <div>
                <span class="font-bold text-[12.5px] text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 mb-2">
                  <span class="material-symbols-outlined text-[18px] text-emerald-500">dynamic_feed</span>
                  Hybrid Timeline Engine (Redis)
                </span>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 flex justify-between">
                    <span><strong>Normal Users (&lt; 5k):</strong> Push Fan-Out</span>
                    <span class="text-emerald-600 dark:text-emerald-400">ZSET Timeline</span>
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 flex justify-between">
                    <span><strong>Celebrities (&gt; 5k):</strong> Pull on Read</span>
                    <span class="text-amber-600 dark:text-amber-400">VIP Timeline</span>
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 flex justify-between">
                    <span><strong>Feed Aggregator:</strong> K-Way Merge</span>
                    <span class="text-blue-600 dark:text-blue-400">&lt; 150ms P99</span>
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-emerald-700 dark:text-emerald-400 mt-2">Saves 99.9% Write Amplification</span>
            </div>

          </div>

          <!-- 4 PILLARS -->
          <div class="grid grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11.5px]">
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-0.5">Direct Ingress</strong>
              <span class="text-slate-600 dark:text-slate-300">Presigned S3 PUT URLs bypass gateway bandwidth choke.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-emerald-600 dark:text-emerald-400 block mb-0.5">Hybrid Fan-Out</strong>
              <span class="text-slate-600 dark:text-slate-300">Push to follower timelines; pull dynamically for celebrities.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-purple-600 dark:text-purple-400 block mb-0.5">Cursor Pagination</strong>
              <span class="text-slate-600 dark:text-slate-300">(timestamp_postId) prevents feed drift and SQL deep offset lag.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-pink-600 dark:text-pink-400 block mb-0.5">Edge CDN Delivery</strong>
              <span class="text-slate-600 dark:text-slate-300">300+ Edge PoPs cache WebP images with 99%+ hit ratio.</span>
            </div>
          </div>

        </div>
      </div>

      <!-- SEQUENCE FLOWS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 text-[12px]">
        
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-2.5">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-indigo-500">upload_file</span>
            2. Upload &amp; Hybrid Fan-Out Pipeline
          </h5>
          <ol class="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside">
            <li>Client requests upload authorization; Gateway returns presigned S3 PUT URL.</li>
            <li>Client streams photo binary directly to S3 (zero gateway bandwidth).</li>
            <li>S3 triggers async Transcoder fleet to create 150/600/1080 WebP variants.</li>
            <li>Client invokes <code class="font-mono">POST /api/v1/posts</code>; Post Service commits to DB and emits Kafka event.</li>
            <li>Fan-out workers evaluate follower tier: Push to Redis for regular users; Pull on read for celebrities.</li>
          </ol>
        </div>

        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-2.5">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-emerald-500">feed</span>
            3. Home Feed Generation &amp; Streaming
          </h5>
          <ol class="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside">
            <li>Client issues <code class="font-mono">GET /api/v1/feed?cursor=...&amp;limit=20</code>.</li>
            <li>Feed Service fetches precomputed timeline from user's Redis ZSET.</li>
            <li>Queries Social Graph for followed celebrities and pulls recent VIP posts.</li>
            <li>Executes in-memory K-way sorted merge and hydrates post metadata.</li>
            <li>Returns JSON payload; client streams WebP image blobs from global edge CDN.</li>
          </ol>
        </div>

      </div>

    </div>
  `;
}

export function renderWhatsAppVectorBlueprint() {
  return `
    <div class="vector-blueprint flex flex-col gap-6 font-sans text-slate-800 dark:text-slate-100">
      
      <!-- TOP ARCHITECTURE MAP -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white">1. High-Level Architecture</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">REAL-TIME WEBSOCKET &amp; E2EE CHAT ENGINE</span>
        </div>

        <div class="min-w-[920px] flex flex-col gap-5 py-2">
          
          <div class="grid grid-cols-12 gap-3 items-stretch">
            
            <!-- Sender Client (col 2) -->
            <div class="col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-mono font-bold text-slate-500 uppercase">Sender Client</span>
                <ul class="text-[11px] space-y-1.5 mt-2 text-slate-700 dark:text-slate-300">
                  <li>Signal Protocol E2EE</li>
                  <li>Client SQLite DB</li>
                  <li>Persistent TLS WS</li>
                  <li>Client-Gen Msg ID</li>
                </ul>
              </div>
              <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Zero-Knowledge</span>
            </div>

            <!-- Ingress & Gateway (col 3) -->
            <div class="col-span-3 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col justify-between">
              <div>
                <div class="font-bold text-[12.5px] text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5 mb-1.5">
                  <span class="material-symbols-outlined text-[18px] text-indigo-500">electrical_services</span>
                  Connection Gateway Fleet
                </div>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>L4 NLB:</strong> TCP Anycast Ingress
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>Gateway A:</strong> 1M+ Sockets / Erlang Pod
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>Keep-Alive:</strong> 60s Heartbeat Leases
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-indigo-600 dark:text-indigo-400 mt-2">100M Live WebSockets</span>
            </div>

            <!-- Core Routing & Presence (col 3) -->
            <div class="col-span-3 p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex flex-col justify-between">
              <div>
                <div class="font-bold text-[12.5px] text-purple-950 dark:text-purple-200 flex items-center gap-1.5 mb-1.5">
                  <span class="material-symbols-outlined text-[18px] text-purple-500">hub</span>
                  Routing &amp; Session Registry
                </div>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>Message Router:</strong> Per-Chat Seq
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>Session Redis:</strong> userId &rarr; Gateway IP
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>1-Tick ACK:</strong> Server Accepted (&lt;20ms)
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-purple-600 dark:text-purple-400 mt-2">Per-Conversation Ordering</span>
            </div>

            <!-- Delivery & Offline Spool (col 4) -->
            <div class="col-span-4 rounded-xl border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 flex flex-col justify-between">
              <div>
                <span class="font-bold text-[12.5px] text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 mb-2">
                  <span class="material-symbols-outlined text-[18px] text-emerald-500">mark_chat_read</span>
                  Dual-Path Delivery Engine
                </span>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 flex justify-between">
                    <span><strong>Online Path:</strong> Direct Gateway B Push</span>
                    <span class="text-emerald-600 dark:text-emerald-400">&lt; 100ms P99</span>
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 flex justify-between">
                    <span><strong>Offline Path:</strong> Cassandra 30-Day Spool</span>
                    <span class="text-amber-600 dark:text-amber-400">APNs/FCM Wakeup</span>
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 flex justify-between">
                    <span><strong>Receipts:</strong> 1-Tick &bull; 2-Tick &bull; Blue-Tick</span>
                    <span class="text-blue-600 dark:text-blue-400">Idempotent</span>
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-emerald-700 dark:text-emerald-400 mt-2">Ephemeral Transit: Purged on Delivery</span>
            </div>

          </div>

          <!-- 4 PILLARS -->
          <div class="grid grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11.5px]">
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-0.5">Persistent Sockets</strong>
              <span class="text-slate-600 dark:text-slate-300">100M+ long-lived TLS WebSockets with lightweight 2-byte framing.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-emerald-600 dark:text-emerald-400 block mb-0.5">Ephemeral Spooling</strong>
              <span class="text-slate-600 dark:text-slate-300">Delivered messages are purged permanently; zero server retention.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-purple-600 dark:text-purple-400 block mb-0.5">Causal Ordering</strong>
              <span class="text-slate-600 dark:text-slate-300">Monotonic sequence per conversation eliminates cross-partition locks.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-emerald-600 dark:text-emerald-400 block mb-0.5">Signal Protocol E2EE</strong>
              <span class="text-slate-600 dark:text-slate-300">Double Ratchet &bull; X3DH asynchronous key exchange.</span>
            </div>
          </div>

        </div>
      </div>

      <!-- SEQUENCE FLOWS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 text-[12px]">
        
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-2.5">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-indigo-500">bolt</span>
            2. Real-Time Online Message Delivery Flow
          </h5>
          <ol class="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside">
            <li>Sender client encrypts payload with Double Ratchet and streams via WebSocket.</li>
            <li>Message Service validates envelope, assigns sequence number, and emits 1-Tick ACK.</li>
            <li>Queries Redis Session Registry to locate recipient's active gateway socket.</li>
            <li>Forwarded over internal gRPC bus to Gateway B holding recipient connection.</li>
            <li>Pushed down recipient socket in &lt; 100ms; client decrypts and returns Delivery ACK.</li>
          </ol>
        </div>

        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-2.5">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-emerald-500">sync_saved_locally</span>
            3. Offline Spool &amp; Multi-Tick Receipt Sync
          </h5>
          <ol class="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside">
            <li>If recipient is offline, message is spooled to Cassandra with 30-day TTL.</li>
            <li>Silent push notification sent via APNs / FCM to nudge device to connect.</li>
            <li>Recipient reconnects, flushes offline queue, and permanently purges server rows.</li>
            <li>Recipient device automatically emits <code class="font-mono">DELIVERY_ACK</code> (2 Gray Ticks).</li>
            <li>When recipient opens chat view, <code class="font-mono">READ_ACK</code> updates checkmarks to Blue Ticks.</li>
          </ol>
        </div>

      </div>

    </div>
  `;
}

export function renderYouTubeVectorBlueprint() {
  return `
    <div class="vector-blueprint flex flex-col gap-6 font-sans text-slate-800 dark:text-slate-100">
      
      <!-- TOP ARCHITECTURE MAP -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white">1. High-Level Architecture</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">DISTRIBUTED TRANSCODING DAG &amp; GLOBAL STREAMING</span>
        </div>

        <div class="min-w-[920px] flex flex-col gap-5 py-2">
          
          <div class="grid grid-cols-12 gap-3 items-stretch">
            
            <!-- Creator Client (col 2) -->
            <div class="col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-mono font-bold text-slate-500 uppercase">Creator Studio</span>
                <ul class="text-[11px] space-y-1.5 mt-2 text-slate-700 dark:text-slate-300">
                  <li>TUS / Multipart S3</li>
                  <li>10MB Chunk Slicer</li>
                  <li>MD5 Part Checksums</li>
                  <li>Auto-Resume Retry</li>
                </ul>
              </div>
              <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Zero Proxy IO</span>
            </div>

            <!-- Ingress & Upload Service (col 3) -->
            <div class="col-span-3 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col justify-between">
              <div>
                <div class="font-bold text-[12.5px] text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5 mb-1.5">
                  <span class="material-symbols-outlined text-[18px] text-indigo-500">cloud_upload</span>
                  Ingress &amp; Upload Coordinator
                </div>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>API Gateway:</strong> Auth &amp; Token Bucket
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>Upload Service:</strong> Presigned S3 URLs
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                    <strong>Raw S3 Bucket:</strong> 11 9s Durability
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-indigo-600 dark:text-indigo-400 mt-2">500 hrs/min Ingestion</span>
            </div>

            <!-- Transcoding DAG & GPU Cluster (col 4) -->
            <div class="col-span-4 p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex flex-col justify-between">
              <div>
                <div class="font-bold text-[12.5px] text-purple-950 dark:text-purple-200 flex items-center gap-1.5 mb-1.5">
                  <span class="material-symbols-outlined text-[18px] text-purple-500">memory</span>
                  Transcoding DAG &amp; GPU Farm
                </div>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>Orchestrator:</strong> GOP Keyframe Chunk Splitter
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>GPU Encoders:</strong> AV1 / VP9 / H.264 (1080p, 720p, 480p)
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                    <strong>CMAF Packager:</strong> Generates .m3u8 &amp; .mpd Manifests
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-purple-600 dark:text-purple-400 mt-2">50+ Parallel Spot Workers</span>
            </div>

            <!-- Edge CDN & Viewer Playback (col 3) -->
            <div class="col-span-3 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between">
              <div>
                <div class="font-bold text-[12.5px] text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 mb-1.5">
                  <span class="material-symbols-outlined text-[18px] text-emerald-500">smart_display</span>
                  Global Edge CDN &amp; Playback
                </div>
                <div class="space-y-1.5 text-[10.5px]">
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50">
                    <strong>Edge PoPs:</strong> NVMe SSD Segment Cache
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50">
                    <strong>Player App:</strong> Adaptive Bitrate (ABR)
                  </div>
                  <div class="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50">
                    <strong>Telemetry:</strong> Flink &amp; Redis HyperLogLog
                  </div>
                </div>
              </div>
              <span class="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 mt-2">&gt;98% CDN Hit &bull; &lt;150ms TTFF</span>
            </div>

          </div>

          <!-- Bottom highlights -->
          <div class="grid grid-cols-3 gap-3 text-[11px]">
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-0.5">Presigned S3 Direct Uploads</strong>
              <span class="text-slate-600 dark:text-slate-300">Eliminates backend reverse proxy saturation for multi-GB uploads.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-purple-600 dark:text-purple-400 block mb-0.5">GOP Parallel Transcoding DAG</strong>
              <span class="text-slate-600 dark:text-slate-300">Keyframe chunking turns 1-hr 4K encode time into 3-min parallel render.</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <strong class="text-emerald-600 dark:text-emerald-400 block mb-0.5">HLS / DASH Adaptive Bitrate</strong>
              <span class="text-slate-600 dark:text-slate-300">CMAF format enables seamless dynamic quality stepping with 0 stalls.</span>
            </div>
          </div>

        </div>
      </div>

      <!-- SEQUENCE FLOWS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 text-[12px]">
        
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-2.5">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-indigo-500">cloud_upload</span>
            2. Resumable Upload &amp; Transcoding DAG Flow
          </h5>
          <ol class="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside">
            <li>Creator studio requests session; Upload Service returns presigned S3 multipart URLs.</li>
            <li>Client streams 10MB chunks directly into Raw S3 bucket via concurrent PUT requests.</li>
            <li>Finalize multipart upload; Upload Service validates ETags and emits <code class="font-mono">video-uploaded</code> event.</li>
            <li>Transcoding DAG Orchestrator splits video along keyframe (GOP) boundaries.</li>
            <li>GPU workers encode chunks in parallel into H.264/VP9/AV1 at 1080p, 720p, 480p and publish to S3.</li>
          </ol>
        </div>

        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-2.5">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-emerald-500">play_circle</span>
            3. Adaptive Bitrate (ABR) Playback &amp; Telemetry
          </h5>
          <ol class="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside">
            <li>Viewer app fetches signed master manifest (<code class="font-mono">master.m3u8</code>) from API Gateway.</li>
            <li>Player queries nearest Edge CDN PoP via Anycast DNS and downloads initial chunks (&lt;150ms TTFF).</li>
            <li>Edge CDN serves cached segments (98%+ hit ratio) or pulls from origin shield S3 on miss.</li>
            <li>Player measures throughput and dynamically switches bitrates (1080p &harr; 720p &harr; 480p).</li>
            <li>Periodic 10s watch heartbeats sent to Kafka/Flink pipeline; HyperLogLog deduplicates view counts.</li>
          </ol>
        </div>

      </div>

    </div>
  `;
}



