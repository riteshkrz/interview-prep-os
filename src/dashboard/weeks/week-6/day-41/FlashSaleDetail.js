/**
 * Flash Sale System Architecture (Topic 9.6)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 126–128
 */

export function renderFlashSaleContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="flash-sale">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 9.6 · Pages 126–128
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Extreme High-Concurrency System
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">7-Layer Load Funnel · Atomic Redis DECR · Zero Database Lock Contention</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Flash Sale System: The 7-Stage Load-Shedding Funnel</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Handling 1,000,000 concurrent requests competing for 1,000 limited inventory units in under two seconds destroys traditional relational architectures. At this scale, database row locking causes immediate connection pool exhaustion and cascading system collapse. A flash sale is an aggressive load-shedding funnel that discards 99.9% of traffic at the edge and converts the inventory decision into a single atomic in-memory decrement.
      </p>
    </div>

    <!-- The 7-Stage Funnel Diagram (Page 127) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The 7-Stage Load-Shedding Funnel (Page 127)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
   10,000,000 Users Click "Buy Now" at 12:00:00.000
        │
        ▼ 1. CDN EDGE CACHING
        │    Static product pages, CSS, JS served 100% from edge PoPs. Zero origin server hit.
        │
        ▼ 2. CLIENT-SIDE THROTTLE
        │    Button disabled for 3s immediately after click; CAPTCHA / Proof-of-Work challenge.
        │
        ▼ 3. EDGE RATE LIMITER (API Gateway)
        │    Token bucket per IP / user token drops 90% of bot script traffic.
        │
        ▼ 4. ADMISSION CONTROL GATE
        │    Allows only ~10× available inventory (e.g. 10,000 requests) into backend servers.
        │
        ▼ 5. ATOMIC INVENTORY DECREMENT IN REDIS
        │    Lua Script: DECR stock; if stock &lt; 0 then return SOLD_OUT. (Atomic, sub-millisecond!)
        │    Losing 9,990,000 requests receive immediate HTTP 200 "Sold Out" response!
        │
        ▼ 6. WINNING REQUESTS ENQUEUED TO KAFKA
        │    The 1,000 winning users receive a temporary reservation token (10-minute hold).
        │
        ▼ 7. ASYNCHRONOUS DATABASE WORKERS
             Workers drain Kafka at a calm, controlled 50 RPS to charge cards and write orders.
</pre>
      </div>
    </div>

    <!-- The 6 Core Design Principles Table -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        The 6 Engineering Principles of Flash Sales (Page 127)
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Principle</th>
              <th class="p-3 font-semibold text-cyan-300">Concrete Mechanism</th>
              <th class="p-3 font-semibold text-slate-300">Architectural Rationale</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">1. Less Is More</td>
              <td class="p-3 text-cyan-200">Static page on CDN, zero user personalization on sale page</td>
              <td class="p-3 text-slate-300">Eliminates dynamic origin server database queries for avatars, history, or recommendations.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">2. Short Critical Path</td>
              <td class="p-3 text-cyan-200">Merge validation + inventory check into single service hop</td>
              <td class="p-3 text-slate-300">Avoids chatty microservice fan-out; every network hop adds a 10–50 ms latency floor.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">3. Asynchronous Pipeline</td>
              <td class="p-3 text-emerald-300 font-bold">Return "Secured / Pending" immediately after Redis DECR</td>
              <td class="p-3 text-slate-300">Heavy relational database writes and third-party credit card processing run behind Kafka.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">4. Total Bulkhead Isolation</td>
              <td class="p-3 text-amber-300 font-bold">Dedicated flash-sale cluster, Redis tier, and database</td>
              <td class="p-3 text-slate-300">A flash sale frenzy must never saturate database pools or degrade the standard commerce store.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">5. Zero Overselling</td>
              <td class="p-3 text-rose-300 font-bold">Redis Lua atomic DECR + DB CHECK constraint (stock &ge; 0)</td>
              <td class="p-3 text-slate-300">Never use Read-Check-Write (SELECT FOR UPDATE) on SQL rows under 100k concurrent threads!</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">6. Deterministic UX</td>
              <td class="p-3 text-cyan-200">Never confirm an order before securing the inventory hold</td>
              <td class="p-3 text-slate-300">Telling 10,000 customers "Order Confirmed" and cancelling 9,000 later destroys platform trust.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- The Two Fatal Interview Traps -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        The Two Fatal Mistakes That Fail This Interview (Page 127)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 space-y-2">
          <strong class="text-rose-400 block font-bold">TRAP 1: OVERSELLING VIA SQL READ-THEN-WRITE</strong>
          <p class="text-slate-300 font-sans leading-relaxed">
            Running <code>SELECT stock FROM items WHERE id=1; if (stock &gt; 0) UPDATE ...</code> fails completely. Under 100k concurrent requests, thousands of threads read <code>stock=1</code> simultaneously before any single thread commits the decrement, causing massive catastrophic overselling.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 space-y-2">
          <strong class="text-rose-400 block font-bold">TRAP 2: CONFIRMING BEFORE INVENTORY IS SECURED</strong>
          <p class="text-slate-300 font-sans leading-relaxed">
            Placing orders directly onto an asynchronous queue and displaying "Order Successful!" before inventory is decremented. When workers drain the queue, 99.9% of items are already gone, forcing mass post-facto cancellations and furious customers.
          </p>
        </div>
      </div>
    </div>

    <!-- Staff Interview Follow-ups -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Staff Interview Follow-ups (Page 127)
      </h3>
      <div class="space-y-3 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q1: How do you handle abandoned checkouts after a user wins a reservation token?</h4>
          <p class="text-slate-300 leading-relaxed">
            Winning requests receive an inventory hold with a strict 10-minute TTL stored in Redis (<code class="text-cyan-300">SET order:123:hold EX 600</code>). If the user closes their browser or payment fails, a background delayed task or Redis keyspace notification expires the hold and atomically increments the Redis inventory counter (<code class="text-cyan-300">INCR stock</code>), returning the unit back into the available pool for waiting customers.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 128)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "A flash sale is an aggressive load-shedding funnel: serve static assets from the CDN edge, throttle client clicks, rate limit bots, admit a small multiple of inventory, decide stock with a single atomic Redis DECR, and drain order persistence asynchronously through Kafka. Never let the database see the spike, and never confirm an order before inventory is secured."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
