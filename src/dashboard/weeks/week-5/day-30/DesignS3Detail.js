/**
 * 6.5 Designing S3 (Distributed Object Storage) - Visual Guide
 * High-signal, visually rich reproduction of Pages 80–82
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderDesignS3Content(topic) {
  const requirements = [
    { req: "11 Nines Durability (99.999999999%)", impl: "Erasure coding (e.g. 8+4 or 12+4 Reed-Solomon) across multiple Availability Zones + continuous background bit-rot scrubbing (sec. 6.3)." },
    { req: "Objects from 1 Byte to 5 Terabytes", impl: "Two distinct storage paths: small objects packed into large consolidated containers; multi-GB objects chunked via Multipart Upload (sec. 6.4)." },
    { req: "Globally Unique Bucket Namespaces", impl: "Global strongly-consistent key-value coordinator (e.g. Spanner / Paxos consensus) for bucket registration." },
    { req: "Immutable Data, Mutable Metadata", impl: "Object payloads are write-once / append-only. Overwrites create a new immutable blob version; metadata points to the newest UUID." },
    { req: "Strong Read-After-Write Consistency", impl: "Since 2020, S3 provides strong consistency for PUTs and LISTs: metadata commit is the atomic ordering gate; data must persist before metadata commits." },
    { req: "IAM & Bucket Policy Authorization", impl: "Evaluated at API Gateway proxy tier before data store or metadata queries execute." }
  ];

  const followUps = [
    {
      q: "Why MUST you store object data and metadata in two completely separate storage engines?",
      a: "Because their requirements are diametrically opposed: <strong>Object Data</strong> is massive (petabytes/exabytes), immutable, throughput-oriented, and cost-sensitive — best served by raw disk block erasure coding on dense commodity storage. <strong>Metadata</strong> (bucket, key, size, ACL, owner, etag) is tiny (few hundred bytes), mutable, latency-critical (&lt;5ms), queried at massive QPS, and requires index range scans for <code>LIST</code> operations — best served by a distributed, strongly consistent sharded database. Merging them into one system forces that engine to be terrible at both."
    },
    {
      q: "The metadata store is the primary scalability bottleneck. How do you scale it?",
      a: "Shard by <code>hash(bucket_id)</code> or composite <code>(bucket_id, key_prefix)</code> to distribute load evenly across storage nodes. Inside each shard, store keys in lexicographical B-tree order so that prefix-based <code>LIST /photos/2024/*</code> queries remain efficient range scans. For massive single buckets with 1 billion keys, partition the bucket across multiple shards using consistent hashing on key prefixes."
    },
    {
      q: "What happens if the binary payload write succeeds, but the metadata write fails?",
      a: "You get an <strong>orphaned blob</strong>: bytes stored on disk with no metadata record pointing to them. <strong>Always write data first, metadata second.</strong> A partial failure leaks disk space (which is cheap and completely invisible to clients), whereas writing metadata first risks a client reading a dangling pointer to missing data (data corruption). A background Garbage Collector scans the data store after a 24-hour safety window and frees unreferenced blobs."
    },
    {
      q: "How do you serve 100 Gbps of read traffic for a single viral object?",
      a: "Object storage disks cannot handle 100 Gbps per key. <em>The senior architecture:</em> 1) Place a <strong>CDN Edge Cache (sec. 2.5)</strong> in front so the object is fetched from S3 exactly once per edge PoP; 2) Inside the storage tier, dynamically replicate viral hot keys to multiple storage nodes; 3) Instruct clients to parallelize downloads via HTTP <code>Range: bytes=0-1048576</code> requests."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="6.5-design-s3">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 6 · Storage Systems &amp; Object Storage
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 80–82 · Section 6.5</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 30 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          6.5 Interview Question: Design S3 (Object Storage)
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          How to design an exabyte-scale object store delivering 11 nines of durability. Master the fundamental architecture split: the high-throughput immutable Data Plane vs. the strongly consistent Metadata Plane.
        </p>
      </div>

      <!-- Data vs Metadata Split Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            THE CORE INSIGHT: COMPLETE SEPARATION OF DATA AND METADATA PLANES
          </span>
          <span class="text-[11px] font-code text-slate-500">S3 System Topology</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
                       ┌─────────────────┐
  Client ──HTTP PUT──► │   API SERVICE   │ ──── ② Auth Check ────► [ IAM Service ]
                       └────┬───────┬────┘
                 ⑥ Payload  │       │ ③, ⑦ Metadata Entry
                            ▼       ▼
    ┌───────────────────────────┐   ┌─────────────────────────────────────────┐
    │        DATA STORE         │   │             METADATA STORE              │
    │  • Immutable blobs by UUID│   │  • Mutable, small rows                  │
    │  • Erasure coding (sec6.3)│   │  • bucket_id, object_id, size, etag     │
    │  • Chunk placement on disk│   │  • Sharded + Replicated (Strongly Cons.)│
    │  • Scales by CAPACITY     │   │  • Lexicographic index for LIST scans   │
    │  • Durability: 11 Nines   │   │  • Scales by REQUEST RATE               │
    └───────────────────────────┘   └─────────────────────────────────────────┘

  THE TWO CONFLICTING PROFILES:
  • DATA:     Huge (GBs/TBs), immutable, throughput-oriented, write-once / read-many.
  • METADATA: Tiny (hundreds of bytes), mutable, latency-critical (&lt;5ms), high QPS.
        </div>
      </div>

      <!-- Requirements Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          CORE REQUIREMENTS WORTH PINNING DOWN BEFORE DRAWING BOXES
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/3">Target Requirement</th>
                <th class="p-3 w-2/3">Architectural Implementation</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${requirements.map(r => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${r.req}</td>
                  <td class="p-3 text-slate-200 leading-relaxed">${r.impl}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
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
      <div class="bg-gradient-to-r from-indigo-950/60 to-cyan-950/60 border border-indigo-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Design S3 as two distinct systems behind one unified API: an immutable, erasure-coded data plane sized by capacity, and a mutable, sharded, strongly consistent metadata plane sized by request rate. Lead with that split, and every follow-up question has an obvious home."
        </p>
      </div>

    </div>
  `;
}
