/**
 * Appendix B & C.1/C.2: Last-Hour Cheat Sheet & Tip-of-the-Tongue Numbers
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 174–177
 */

export function renderAppendixCheatSheetContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="appendix-cheat-sheet">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Appendices B & C · Pages 174–177
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Interview Cheat Sheet & Rapid Recall
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Latency Hierarchy · Availability Budgets · Flagged Misconceptions</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Appendix C: Cheat Sheets for the Last Hour</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Review these tables in the final 60 minutes before entering a Senior or Staff System Design interview. Having concrete latency constants, availability downtime budgets, and throughput conversions on the tip of your tongue immediately establishes senior credibility and anchors your estimation math.
      </p>
    </div>

    <!-- Latency Hierarchy Monospace Grid -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        Tip-of-the-Tongue Latency Numbers to Memorize (Page 175)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-2">
          <div class="text-cyan-400 font-bold border-b border-slate-800 pb-1">IN-MEMORY & CPU</div>
          <div class="flex justify-between"><span>L1 Cache Reference:</span> <span class="text-emerald-400 font-bold">~0.5 – 1 ns</span></div>
          <div class="flex justify-between"><span>L2 Cache Reference:</span> <span class="text-emerald-400 font-bold">~7 ns</span></div>
          <div class="flex justify-between"><span>Mutex Lock / Unlock:</span> <span class="text-emerald-400 font-bold">~25 ns</span></div>
          <div class="flex justify-between"><span>Main Memory (RAM) Read:</span> <span class="text-amber-400 font-bold">~100 ns</span></div>
          <div class="flex justify-between"><span>Compress 1 KB with Snappy:</span> <span class="text-emerald-400 font-bold">~2 µs</span></div>
        </div>

        <div class="p-3.5 rounded-xl bg-[#141C2E] border border-slate-800 space-y-2">
          <div class="text-purple-400 font-bold border-b border-slate-800 pb-1">STORAGE & NETWORK HOPS</div>
          <div class="flex justify-between"><span>SSD Random 4KB Read:</span> <span class="text-amber-400 font-bold">~16 – 100 µs (1000× RAM)</span></div>
          <div class="flex justify-between"><span>Sequential 1MB Read from RAM:</span> <span class="text-emerald-400 font-bold">~100 µs (0.1 ms)</span></div>
          <div class="flex justify-between"><span>Datacenter Round Trip (RTT):</span> <span class="text-cyan-400 font-bold">~0.5 ms</span></div>
          <div class="flex justify-between"><span>Sequential 1MB Read from SSD:</span> <span class="text-amber-400 font-bold">~1 ms (10× RAM)</span></div>
          <div class="flex justify-between"><span>Disk Seek (HDD):</span> <span class="text-rose-400 font-bold">~10 ms (100,000× RAM)</span></div>
          <div class="flex justify-between"><span>CA to Netherlands RTT:</span> <span class="text-rose-400 font-bold">~150 ms (Speed of light)</span></div>
        </div>
      </div>
    </div>

    <!-- Quick Conversions & Availability Budgets -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        Throughput Conversions & Availability Budgets (Page 175)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800 space-y-2">
          <div class="text-purple-300 font-bold mb-1">QUICK CONVERSIONS (Rule of 86,400)</div>
          <div class="text-slate-300 space-y-1.5">
            <div>• <strong class="text-white">1 Million requests/day</strong> &approx; <span class="text-cyan-300">12 QPS</span></div>
            <div>• <strong class="text-white">100 Million requests/day</strong> &approx; <span class="text-cyan-300">1,150 QPS</span></div>
            <div>• <strong class="text-white">1 Billion requests/day</strong> &approx; <span class="text-cyan-300">12,000 QPS (12k QPS)</span></div>
            <div>• <strong class="text-white">1 KB payload at 10,000 QPS</strong> &approx; <span class="text-amber-300 font-bold">10 MB/s (80 Mbps)</span></div>
            <div>• <strong class="text-white">Bloom filter sizing:</strong> <span class="text-emerald-300 font-bold">~10 bits per element</span> buys a 1% false positive rate</div>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800 space-y-2">
          <div class="text-purple-300 font-bold mb-1">AVAILABILITY DOWNTIME BUDGETS</div>
          <div class="space-y-1.5 text-slate-300">
            <div class="flex justify-between border-b border-slate-800/60 pb-1">
              <span>99% (Two Nines):</span> <span class="text-rose-300">3.65 days/year (7.3 hrs/mo)</span>
            </div>
            <div class="flex justify-between border-b border-slate-800/60 pb-1">
              <span>99.9% (Three Nines):</span> <span class="text-amber-300">8.77 hours/year (43.8 min/mo)</span>
            </div>
            <div class="flex justify-between border-b border-slate-800/60 pb-1">
              <span>99.99% (Four Nines):</span> <span class="text-cyan-300">52.6 minutes/year (4.4 min/mo)</span>
            </div>
            <div class="flex justify-between text-emerald-300 font-bold pt-1">
              <span>99.999% (Five Nines):</span> <span>5.26 minutes/year (26 sec/mo)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appendix B: Flagged Statements from Source Material -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        Appendix B: Accuracy Review — Flagged Common Misconceptions (Pages 174–175)
      </h3>
      <div class="space-y-3 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <strong class="text-rose-400 block mb-1">Flag 1: "Cassandra Last-Write-Wins (LWW) is safe for financial balances"</strong>
          <p class="text-slate-300 leading-relaxed font-sans">
            <span class="text-red-300 font-bold font-mono">Correction:</span> NTP clock drift guarantees that two concurrent writes to the same row will overwrite one another silently based on whichever server's clock ran faster. Never use Cassandra LWW for account balances or inventory without lightweight transactions (Paxos) or append-only ledgers.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <strong class="text-rose-400 block mb-1">Flag 2: "Raft with 5 nodes across 2 Availability Zones gives multi-AZ fault tolerance"</strong>
          <p class="text-slate-300 leading-relaxed font-sans">
            <span class="text-red-300 font-bold font-mono">Correction:</span> If 3 nodes are in AZ-1 and 2 nodes are in AZ-2, losing AZ-1 destroys the quorum (only 2 of 5 survive &rarr; no majority!). A 5-node cluster needs <strong>3 distinct Availability Zones</strong> (e.g. 2 in AZ-a, 2 in AZ-b, 1 in AZ-c) to survive any single AZ failure.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <strong class="text-rose-400 block mb-1">Flag 3: "A Bloom Filter can support item deletions"</strong>
          <p class="text-slate-300 leading-relaxed font-sans">
            <span class="text-red-300 font-bold font-mono">Correction:</span> Setting bits to 0 deletes all other items whose hash functions shared those same bits! Deletions require a <em>Counting Bloom Filter</em> (which uses 4× more RAM) or a <em>Cuckoo Filter</em>.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 175)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Before proposing any distributed system, run the back-of-the-envelope math out loud: RAM is 100ns, SSD is 100&mu;s (1,000&times; slower), network datacenter RTT is 0.5ms (5,000&times; slower). If a dataset is under 10GB, a single node's RAM with read replicas is vastly superior to premature distributed sharding."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
