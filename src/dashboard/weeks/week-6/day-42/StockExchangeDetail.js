/**
 * High-Frequency Stock Exchange & Matching Engine (Topic 9.5)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 122–126
 */

export function renderStockExchangeContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="stock-exchange">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 9.5 · Pages 122–126
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Ultra-Low Latency Architecture
          </span>
        </div>
        <span class="text-xs font-sans text-slate-400 font-medium">Microsecond Latency · Pinned CPU Cores · O(1) Limit Order Book</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">High-Frequency Stock Exchange & Matching Engine</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        While web applications optimize for milliseconds, financial exchanges operate under strict <strong>microsecond-level latency budgets</strong>. At this scale, distributed systems advice is completely inverted: network hops, database fsyncs, thread context switches, and garbage collection pauses are strictly forbidden on the critical matching path.
      </p>
    </div>

    <!-- The Inverted Bare-Metal Architecture (Page 125) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The Bare-Metal Architecture: Shared Memory & Zero Locks (Page 125)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
 ┌──────────────── ONE PHYSICAL SERVER (Bare Metal, No Hypervisor, No Containers) ─────────────────┐
 │                                                                                                 │
 │   ┌────────────────────── SHARED MEMORY RING BUFFER EVENT BUS ──────────────────────────────┐   │
 │   │  (LMAX Disruptor pattern: Lock-free, zero syscalls, zero network hops, zero disk I/O)   │   │
 │   └───▲───────────────▲───────────────▲─────────────────▲────────────────▲──────────────────┘   │
 │       │               │               │                 │                │                      │
 │   ┌───┴────┐      ┌───┴────┐      ┌───┴─────┐       ┌───┴─────┐      ┌───┴─────┐                │
 │   │ ORDER  │      │SEQUENCER│     │MATCHING │       │REPORTER │      │ MARKET  │                │
 │   │MANAGER │      │ (Total │      │ ENGINE  │       │(Off-path│      │  DATA   │                │
 │   │ (Risk) │      │ Order) │      │(Book O1)│       │ Journal)│      │Multicast│                │
 │   │ Core 2 │      │ Core 3 │      │ Core 4  │       │ Core 5  │      │ Core 6  │                │
 │   └────────┘      └────────┘      └─────────┘       └─────────┘      └─────────┘                │
 │    ▲ Single-threaded application loops PINNED to dedicated CPU cores (No context switching)   │
 └─────────────────────────────────────────────────────────────────────────────────────────────────┘

 CRITICAL PATH:
 Order In ──► In-Memory Risk Check ──► Sequencer Assigns ID ──► Matching Engine Fills ──► Output
 Disk persistence, database writes, and market data broadcasting are 100% OFF the critical path!
</pre>
      </div>
    </div>

    <!-- The O(1) Limit Order Book Data Structure -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        The O(1) Limit Order Book: Price-Time Priority (Page 124)
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-2">LIMIT ORDER BOOK SNAPSHOT</div>
<pre class="text-slate-300">
  SELL BOOK (Asks, Ascending)
  100.12 │ ████████ 1,800
  100.11 │ ██████   1,200   (Partially filled)
  100.10 │ ████████ 1,500   (Best Ask - Consumed)
  ───────┼────────────────  SPREAD (1 Cent)
  100.09 │ ████████ 1,100   (Best Bid)
  100.08 │ █████      900
  100.07 │ ███████  1,400
  BUY BOOK (Bids, Descending)

  PRICE-TIME PRIORITY:
  • Best price wins first (Lowest Ask / Highest Bid).
  • At the same price tick, earlier arrival wins (FIFO).
</pre>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800 font-sans space-y-2">
          <div class="text-emerald-300 font-bold font-mono">HOW TRUE O(1) COMPLEXITY IS ACHIEVED</div>
          <p class="text-slate-300 text-[11.5px] leading-relaxed">
            The data structure interviewers test for: An array/indexed map of discrete price tick levels where each level holds a <strong>Doubly-Linked List of Orders</strong> in FIFO sequence, paired with a <strong>Hash Map from order_id &rarr; list node pointer</strong>.
          </p>
          <ul class="space-y-1.5 text-slate-300 text-[11.5px] list-disc list-inside">
            <li><strong>Add Order:</strong> Append to tail of price level list &rarr; <code class="text-cyan-300 font-mono">O(1)</code>.</li>
            <li><strong>Cancel Order:</strong> Hash map lookup then unlink pointer &rarr; <code class="text-cyan-300 font-mono">O(1)</code> with zero scanning!</li>
            <li><strong>Match Order:</strong> Pop from head of best price level &rarr; <code class="text-cyan-300 font-mono">O(1)</code> amortized.</li>
            <li><strong>Best Bid/Ask:</strong> Maintain non-empty level pointers &rarr; <code class="text-cyan-300 font-mono">O(1)</code>.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- The Sequencer & Deterministic State Machine -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        The Sequencer: Making Matching 100% Deterministic (Page 123)
      </h3>
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2 leading-relaxed">
        <p class="text-slate-300">
          Why can a single-threaded matching engine outperform 64 multithreaded cores? The <strong>Sequencer</strong> assigns a strictly monotonic integer sequence number to every valid order.
        </p>
        <p class="text-cyan-200 font-mono">
          Sequenced Input Stream &rarr; Deterministic State Machine &rarr; Identical Execution Output
        </p>
        <p class="text-slate-400 text-[11.5px]">
          Because execution is deterministic, hot standbys consume the exact same sequence stream in parallel memory. If the primary engine server suffers physical hardware death, the standby takes over instantly with zero state loss and zero consensus pauses!
        </p>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 126)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "A high-frequency stock exchange is a deterministic state machine driven by a sequenced input stream, matched single-threaded on a CPU-pinned core over shared-memory ring buffers. Build the order book with indexed price levels and doubly-linked FIFO queues for O(1) adds, matches, and hash-map unlinking cancellations, pushing all disk persistence and reporting off the critical path."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
