/**
 * 5.5 Bloom Filters: Avoiding Duplicate URL Crawls - Visual Guide
 * High-signal, visually rich reproduction of Pages 70–72
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderBloomFilterContent(topic) {
  const followUps = [
    {
      q: "Why can a Bloom filter NEVER produce a false negative?",
      a: "Because adding an element <em>only ever sets bits to 1</em>, and nothing in a standard Bloom filter ever clears a bit. If an element was inserted, its corresponding <em>k</em> bit positions are guaranteed to be 1. A later check will always observe all <em>k</em> bits set. The converse does not hold: random bits set by other elements can collide to make all <em>k</em> bits 1 for an uninserted item — hence <strong>false positives are possible, but false negatives are mathematically impossible</strong>."
    },
    {
      q: "Your web crawler's Bloom filter is nearly full and the false-positive rate has spiked. What do you do?",
      a: "A Bloom filter's false-positive rate is strictly bound to its $m/n$ bit ratio — once element count $n$ exceeds capacity, the bit vector saturates with 1s and <strong>it cannot be resized in place</strong>. Production mitigations: 1) <strong>Scalable Bloom Filter:</strong> chain a new, geometrically larger filter and query both sequentially; 2) <strong>Prefix Sharding:</strong> partition URLs by domain hash so each shard maintains its own independent filter; 3) <strong>Periodic Rebuild:</strong> periodically regenerate a clean filter from the authoritative database."
    },
    {
      q: "What does a false positive actually cost a production web crawler?",
      a: "<strong>Silent data omission.</strong> A false positive causes the crawler to conclude a valid, uncrawled URL has already been visited, silently skipping it. For a broad web search index, skipping 1% of the long-tail web is an acceptable trade-off for saving 70GB of RAM. For an archival crawler (Wayback Machine), skipping is intolerable, so positive matches must fall through to an authoritative disk check."
    },
    {
      q: "Bloom Filter versus Cuckoo Filter — which do you choose?",
      a: "<strong>Choose a Cuckoo Filter when deletions are required.</strong> Standard Bloom filters cannot delete elements without corrupting shared bits. Cuckoo filters use cuckoo hashing to store compact item fingerprints, supporting deletion and higher space efficiency at low false-positive rates (&lt;3%). Choose Bloom filters for pure append-only simplicity and deterministic memory usage."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="5.5-bloom-filter">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Part 5 · Caching &amp; Indexing
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 70–72 · Section 5.5</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          5.5 Bloom Filters: Avoiding Duplicate URL Crawls at Scale
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          A probabilistic, space-efficient data structure for testing set membership. It answers in $O(k)$ time: <em>'Definitely not in set'</em> (0% false negatives) or <em>'Probably in set'</em> (tunable false positives).
        </p>
      </div>

      <!-- Bit Vector Mechanics Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            BIT VECTOR MECHANICS: THREE HASH FUNCTIONS (k=3)
          </span>
          <span class="text-[11px] font-code text-slate-500">Hash Collision &amp; Membership</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
ADD "www.myweb1.com" ──► hashA=2, hashB=5, hashC=9
ADD "www.myweb2.com" ──► hashA=5, hashB=7, hashC=12

 Index:  0  1  2  3  4  5  6  7  8  9  10 11 12
  Bits:  0  0 [1] 0  0 [1] 0 [1] 0 [1] 0  0 [1]
               ▲        ▲     ▲     ▲        ▲
               │        │     │     │        └─ hashC(web2)
               │        │     │     └────────── hashC(web1)
               │        │     └──────────────── hashB(web2)
               │        └────────────────────── SHARED bit 5 (Collision!)
               └─────────────────────────────── hashA(web1)

TEST "www.myweb3.com" ──► hashes to 2, 5, 7 ──► All bits are 1 ──► "PROBABLY PRESENT" (FALSE POSITIVE!)
TEST "www.myweb4.com" ──► hashes to 2, 5, 8 ──► Bit 8 is 0    ──► "DEFINITELY ABSENT" ✓ (ZERO False Negatives)

▲ You CANNOT delete from a standard Bloom filter: clearing bit 5 would silently break both web1 and web2!
        </div>
      </div>

      <!-- Sizing Formulas & Worked Example -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3 font-sans">
        <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider">
          MATHEMATICAL SIZING FORMULAS (QUOTE THESE IN INTERVIEWS)
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3.5 flex flex-col gap-2 font-mono">
            <span class="text-cyan-400 font-bold">Optimal Hash Functions (k):</span>
            <code class="text-emerald-300 text-[13px]">k = (m / n) · ln 2 ≈ 0.693 · (m / n)</code>
            <span class="text-slate-400 text-[11px] font-sans">Too few hashes = collisions dominate; too many hashes = bit vector saturates with 1s.</span>
          </div>

          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3.5 flex flex-col gap-2 font-mono">
            <span class="text-indigo-400 font-bold">Bits Needed for Target Error (p):</span>
            <code class="text-emerald-300 text-[13px]">m = -(n · ln p) / (ln 2)²</code>
            <span class="text-slate-400 text-[11px] font-sans">Rule of thumb: ~10 bits/item buys 1% false positives; ~15 bits buys 0.1%.</span>
          </div>
        </div>

        <div class="p-3 bg-[#0A0E1A] rounded-lg border border-[#1E293B] font-mono text-[11.5px] text-slate-300 leading-relaxed">
<strong>WORKED EXAMPLE — 1 BILLION URLS AT 1% FALSE POSITIVE (p = 0.01):</strong><br/>
• Bits needed: m = -(10⁹ · ln 0.01) / (0.693)² ≈ 9.6 × 10⁹ bits ≈ <strong>1.2 GB RAM</strong><br/>
• Optimal hashes: k = 0.693 · (9.6 × 10⁹ / 10⁹) ≈ <strong>7 hash functions</strong><br/>
• <em>Compare with HashSet:</em> Storing 1 billion URLs (~70 bytes each) in a hash set requires <strong>70+ GB RAM</strong>!
        </div>
      </div>

      <!-- Real World Usage -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2 font-sans">
        <span class="font-code text-[11.5px] font-bold text-purple-300 uppercase tracking-wider">
          PRODUCTION REAL-WORLD APPLICATIONS
        </span>
        <ul class="text-[12.5px] text-slate-300 flex flex-col gap-1.5 list-disc list-inside leading-relaxed">
          <li><strong>LSM-Tree Storage Engines (sec. 4.9):</strong> Cassandra, RocksDB, and Bigtable maintain a Bloom filter per SSTable file on disk. If key is absent, disk read is skipped entirely!</li>
          <li><strong>Web Browsers:</strong> Google Chrome historically used Bloom filters to detect malicious URLs locally before making remote safe-browsing RPC calls.</li>
          <li><strong>Content Delivery Networks:</strong> Cloudflare and Akamai use Bloom filters to avoid caching 'one-hit wonders' (only cache if requested twice).</li>
          <li><strong>Cache Penetration Defense (sec. 5.2):</strong> Reject non-existent IDs in memory before queries penetrate to the database.</li>
        </ul>
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
      <div class="bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "A bloom filter trades a bounded false-positive rate for order-of-magnitude memory savings, with zero false negatives — which is what makes it a safe pre-filter in front of anything expensive. Know that ~10 bits per element buys ~1%, and that k = 0.693·m/n is the optimum."
        </p>
      </div>

    </div>
  `;
}
