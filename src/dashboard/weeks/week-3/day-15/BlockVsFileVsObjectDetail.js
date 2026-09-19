/**
 * 6.1 / 7.1 Block vs. File vs. Object Storage - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 86 and 87
 * from The Modern System Design Interview Guide.
 */

export function renderBlockVsFileVsObjectContent(topic) {
  const comparisonMatrix = [
    {
      dimension: "Data Abstraction",
      block: "Raw unformatted byte blocks (fixed 4KB chunks)",
      blockClass: "text-amber-300 font-bold",
      file: "Hierarchical directory tree (folders, files, paths)",
      fileClass: "text-cyan-300 font-bold",
      object: "Flat key-value bucket namespace (URI key + metadata + blob)",
      objectClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Access Protocol",
      block: "Fibre Channel, iSCSI, PCIe / NVMe (Block-level SCSI)",
      blockClass: "text-slate-300",
      file: "NFS v4, SMB / CIFS (Network File System over TCP/IP)",
      fileClass: "text-slate-300",
      object: "HTTP REST API (GET, PUT, POST, DELETE, HEAD)",
      objectClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Latency & IOPS",
      block: "Sub-millisecond (0.1–1ms); Massive random IOPS (100K+ IOPS)",
      blockClass: "text-emerald-400 font-bold",
      file: "Low millisecond (2–10ms); Moderate IOPS (1K–20K IOPS)",
      fileClass: "text-slate-300",
      object: "High latency (20–100ms); Massive bulk streaming throughput",
      objectClass: "text-amber-300"
    },
    {
      dimension: "POSIX Compliance",
      block: "Yes (Formatted with host OS filesystem: ext4, XFS, NTFS)",
      blockClass: "text-emerald-400 font-bold",
      file: "Yes (Native shared POSIX file-locking, byte-range locks)",
      fileClass: "text-emerald-400 font-bold",
      object: "No (Atomic whole-object replacement; no partial byte writes)",
      objectClass: "text-rose-400 font-bold"
    },
    {
      dimension: "Mutation Model",
      block: "In-place random byte modifications at specific block offsets",
      blockClass: "text-emerald-400 font-bold",
      file: "In-place file updates, byte-range appends, and truncations",
      fileClass: "text-slate-300",
      object: "Strictly immutable: Modifying 1 byte requires re-uploading entire object",
      objectClass: "text-rose-400 font-bold"
    },
    {
      dimension: "Scalability Limit",
      block: "Volume capacity bound (typically 16–64 TB per volume)",
      blockClass: "text-slate-400",
      file: "Petabyte scale across network NAS / managed EFS",
      fileClass: "text-slate-300",
      object: "Exabyte scale: Virtually infinite, globally distributed storage",
      objectClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Cost per Gigabyte",
      block: "Highest ($$$ - Provisioned IOPS SSD: AWS EBS gp3/io2)",
      blockClass: "text-rose-400 font-bold",
      file: "Moderate ($$ - Multi-AZ shared network filesystem: AWS EFS)",
      fileClass: "text-amber-300",
      object: "Lowest ($ - Tiered storage: S3 Standard / Infrequent / Glacier)",
      objectClass: "text-emerald-400 font-bold"
    },
    {
      dimension: "Primary Workloads",
      block: "Relational DBs (PostgreSQL, MySQL WAL), VM boot drives",
      blockClass: "text-amber-300 font-bold",
      file: "Shared multi-server uploads, legacy CMS, Git repos, shared scripts",
      fileClass: "text-cyan-300 font-bold",
      object: "Media storage (photos, video), backups, data lakes (Parquet), static sites",
      objectClass: "text-emerald-400 font-bold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why can't you run a production relational database (e.g. PostgreSQL or MySQL) directly on S3 Object Storage?",
      answer: `Running a high-concurrency database directly against S3 violates four fundamental operating requirements of database engines:
      <br/><br/>
      <strong class="text-indigo-400">The Four Architectural Roadblocks:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Immutability & No In-Place Mutation:</strong> Relational databases modify specific 8KB/16KB disk pages in-place. Because S3 objects are immutable, updating a single tuple in a 50GB table file would require rewriting the entire 50GB object over HTTP!</li>
        <li><strong>Latency Disparity:</strong> Database B-Trees and Write-Ahead Logs (WAL) require sub-millisecond (<code class="text-cyan-300 text-[11px]">&lt; 1ms</code>) random disk seeks to commit transactions. S3 HTTP REST roundtrips take 20ms to 100ms—degrading transaction throughput by 99%.</li>
        <li><strong>Lack of POSIX System Calls:</strong> Engines rely on OS primitives like <code class="text-amber-300 text-[11px]">fsync()</code>, <code class="text-amber-300 text-[11px]">fdatasync()</code>, <code class="text-amber-300 text-[11px]">flock()</code>, and direct memory mapping (<code class="text-amber-300 text-[11px]">mmap</code>) to guarantee ACID write durability, none of which exist in HTTP REST APIs.</li>
        <li><strong>Cloud Native Separation (Aurora/Snowflake):</strong> Note that modern cloud databases (Amazon Aurora) <em>do</em> write redo-log records across distributed storage, but they use proprietary low-latency storage fleets—not standard S3 buckets for transaction execution.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is Multipart Upload in S3 and when is it mandatory in system architecture?",
      answer: `<strong>Multipart Upload</strong> is an S3 protocol feature that allows uploading a single large object as a set of independent parts concurrently:
      <br/><br/>
      <strong class="text-indigo-400">Operational Mechanics & Requirements:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Mandatory Threshold:</strong> AWS S3 mandates Multipart Upload for any object exceeding <strong>5 GB</strong> in size, and strongly recommends it for any object over <strong>100 MB</strong>.</li>
        <li><strong>Parallel Throughput:</strong> The client splits a 10GB video into 1,000 ten-megabyte chunks and uploads them in parallel across multiple worker threads, saturating network bandwidth and slashing upload duration.</li>
        <li><strong>Failure Resilience:</strong> If network connection drops at 95% completion, you only need to re-upload the single failed 10MB chunk—rather than restarting the entire 10GB upload from scratch!</li>
        <li><strong>Three-Phase API Flow:</strong> <code class="text-cyan-300 text-[11px]">InitiateMultipartUpload</code> ➔ <code class="text-cyan-300 text-[11px]">UploadPart(partNumber, chunk)</code> ➔ <code class="text-emerald-300 text-[11px]">CompleteMultipartUpload(manifest)</code>.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How does Amazon S3 achieve 99.999999999% (11 9s) of durability without bankrupting storage costs?",
      answer: `Achieving 11 nines of durability means that if you store 10,000,000 objects in S3, you can expect to lose a single object once every 10,000 years.
      <br/><br/>
      <strong class="text-indigo-400">The Hyperscale Storage Architecture:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Reed-Solomon Erasure Coding:</strong> Instead of making 10 duplicate copies of your data (which would require 1,000% storage overhead), S3 breaks objects into data chunks and generates parity chunks (e.g. 8+4 or 12+4 Reed-Solomon scheme).</li>
        <li><strong>Cross-AZ Geographic Distribution:</strong> The chunks are scattered across at least <strong>3 geographically separated Availability Zones (AZs)</strong> within an AWS region. Even if an entire datacenter is destroyed by flood or fire, the mathematical equations can reconstruct the missing chunks from remaining AZs with zero data loss.</li>
        <li><strong>Continuous Background Bit-Rot Scrubbing:</strong> Storage nodes continuously scan disks for CRC checksum mismatches (bit-rot) and autonomously reconstruct degraded chunks before multiple concurrent disk failures can occur.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "How do Pre-Signed URLs work and what security and scalability problem do they solve?",
      answer: `In naive system designs, when a user uploads a video, the file routes: <br/>
      <code class="text-rose-300 bg-black/40 px-2 py-0.5 rounded text-[11.5px] inline-block my-1">Browser ──► API Web Server ──► AWS S3 Bucket</code>
      <br/>
      This saturates web server CPU, exhausts network bandwidth, and bottlenecks concurrency.
      <br/><br/>
      <strong class="text-emerald-400">The Pre-Signed URL Architecture:</strong>
      <ol class="list-decimal list-inside mt-1 space-y-1 text-slate-300">
        <li>Client sends a lightweight JSON request to backend: <code class="text-cyan-300 text-[11px]">POST /api/upload-request { filename: "video.mp4" }</code>.</li>
        <li>Backend validates authentication/authorization, generates a cryptographically signed S3 PUT URL with an embedded HMAC token and short expiration TTL (e.g. 5 minutes), and returns it to client.</li>
        <li>The client's browser uploads the multi-gigabyte video <strong>directly to Amazon S3 via HTTP PUT</strong>!</li>
        <li><strong>Benefits:</strong> Zero upload payload touches application servers; web servers handle 100,000 requests/sec with minimal RAM; bandwidth costs are offloaded directly to cloud storage.</li>
      </ol>`
    }
  ];

  return `
    <div class="flex flex-col gap-8 max-w-5xl mx-auto select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 86, 87: BLOCK VS. FILE VS. OBJECT STORAGE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              6.1 Block vs. File vs. Object Storage
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            The fundamental taxonomy of modern digital data storage is categorized into three primary abstraction layers: <strong class="text-amber-300">Block Storage</strong>, <strong class="text-cyan-400">File Storage</strong>, and <strong class="text-emerald-400">Object Storage</strong>. Each paradigm represents distinct tradeoffs across <strong class="text-white">access protocols, latency, POSIX compliance, mutation models, and cost per gigabyte</strong>.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">1. Block Storage (EBS)</span>
              <span class="text-[12px] text-slate-300">Raw fixed-size 4KB blocks over NVMe/SCSI. Sub-millisecond latency, exclusive single-host attachment. Required for relational databases and transactional engines.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. File Storage (EFS)</span>
              <span class="text-[12px] text-slate-300">Hierarchical directory tree over NFS/SMB. Shared concurrently across hundreds of EC2 instances with POSIX file locks. Ideal for CMS media and legacy apps.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">3. Object Storage (S3)</span>
              <span class="text-[12px] text-slate-300">Flat key-value bucket namespace over HTTP REST. Exabyte scale, lowest cost, immutable whole-object replacement. Ideal for video, images, data lakes, and backups.</span>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Concurrency Diagram -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              STORAGE ABSTRACTIONS: BLOCK VS. FILE VS. OBJECT ARCHITECTURES
            </span>
            <span class="text-slate-500 text-[10.5px]">Physical vs. Network Layouts</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. BLOCK STORAGE (e.g. AWS EBS / SAN / NVMe SSD)                                                 │
│                                                                                                  │
│   [ PostgreSQL Engine ] ──► [ OS Filesystem (ext4/XFS) ] ──► [ Block Device Driver ]             │
│                                                                     │                            │
│                                                                     ▼ NVMe / iSCSI Protocol      │
│   ┌───────────────┬───────────────┬───────────────┬───────────────┐                              │
│   │ Block 0 (4KB) │ Block 1 (4KB) │ Block 2 (4KB) │ Block N (4KB) │ (Raw unformatted sectors;    │
│   └───────────────┴───────────────┴───────────────┴───────────────┘  microsecond in-place writes)│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. FILE STORAGE (e.g. AWS EFS / On-Premises NAS / NFS v4)                                        │
│                                                                                                  │
│   [ EC2 Instance 1 ] ──┐                                                                         │
│   [ EC2 Instance 2 ] ──┼──► [ NFS Network Mount ] ──► Hierarchical Directory Tree                │
│   [ EC2 Instance N ] ──┘                              ├── /var/www/uploads/                      │
│                                                       │   ├── photo_1.jpg (Shared POSIX read/wrt)│
│                                                       │   └── document.pdf                       │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. OBJECT STORAGE (e.g. AWS S3 / Google Cloud Storage)                                           │
│                                                                                                  │
│   Client / Browser ──► HTTP GET / PUT / DELETE ──► [ Global S3 Endpoint ]                        │
│                                                              │                                   │
│                                                              ▼ Flat Key-Value Namespace          │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ Bucket: "production-media-assets"                                                        │   │
│   │  Key: "videos/2026/09/user_4812.mp4"                                                     │   │
│   │  Metadata: { Content-Type: "video/mp4", User-Id: "4812", Created: "2026-09-19" }        │   │
│   │  Payload: [ Raw Binary Blob (Immutable; whole-object replace only!) ]                    │   │
│   └──────────────────────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- High-Signal Comparison Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">table_chart</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              Block vs. File vs. Object Storage Architectural Matrix
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-semibold">
                  <th class="py-3 px-4 w-[18%]">Storage Dimension</th>
                  <th class="py-3 px-4 w-[27%] text-amber-300">Block Storage (AWS EBS)</th>
                  <th class="py-3 px-4 w-[27%] text-cyan-300">File Storage (AWS EFS / NFS)</th>
                  <th class="py-3 px-4 w-[28%] text-emerald-400">Object Storage (AWS S3)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] bg-[#0A0E1A]">
                ${comparisonMatrix.map(row => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-200 border-r border-[#24314A]/50 bg-[#0F172A]/40">
                      ${row.dimension}
                    </td>
                    <td class="py-3 px-4 ${row.blockClass} border-r border-[#24314A]/50">
                      ${row.block}
                    </td>
                    <td class="py-3 px-4 ${row.fileClass} border-r border-[#24314A]/50">
                      ${row.file}
                    </td>
                    <td class="py-3 px-4 ${row.objectClass}">
                      ${row.object}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Box: Senior Perspective Callout -->
        <div class="bg-[#0D241E] border-l-4 border-[#10B981] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: THE SELECTION HEURISTIC & THE BLOB ANTI-PATTERN
          </span>
          <p class="text-[13px] font-sans text-emerald-100 leading-relaxed">
            In system design interviews, selecting storage is governed by a simple heuristic: <strong>Ask who mutates the data and how.</strong>
          </p>
          <ul class="list-disc list-inside space-y-1 text-emerald-200/90 text-[12.5px] font-sans pt-1">
            <li><strong>In-place microsecond random writes?</strong> Database engines (PostgreSQL, MySQL, Cassandra) <em>must use Block Storage</em> for write-ahead logging and atomic disk page flushes.</li>
            <li><strong>Shared filesystem across legacy application servers?</strong> Use <em>File Storage (NFS/EFS)</em> for concurrent POSIX access.</li>
            <li><strong>Immutable media, user uploads, logs, or analytics?</strong> Always default to <em>Object Storage (S3)</em> fronted by a CDN.</li>
          </ul>
          <p class="text-[12.5px] font-sans text-emerald-200/90 leading-relaxed pt-1">
            <strong>The Classic Interview Red Flag:</strong> Storing raw image or video files directly inside relational database tables as <code class="text-rose-300 text-[11px]">BYTEA</code> or <code class="text-rose-300 text-[11px]">BLOB</code> columns. This bloats database RAM buffer pools, destroys vacuum performance, and wastes expensive DB IOPS. <strong>Always store the binary payload in S3, and store only the immutable S3 URI string inside the relational database.</strong>
          </p>
        </div>

        <!-- Orange Warning Box: S3 Immutability Trap -->
        <div class="bg-[#2A1608] border-l-4 border-[#F97316] rounded-r-xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            SYSTEM DESIGN TRAP: S3 IMMUTABILITY & THE ZERO-APPEND CONSTRAINT
          </span>
          <p class="text-[13px] font-sans text-amber-100 leading-relaxed">
            Candidates often design systems that treat S3 like a remote hard drive, proposing: <em>"We will continuously append log entries to an active file in S3."</em>
          </p>
          <p class="text-[12.5px] font-sans text-amber-200/90 leading-relaxed pt-1">
            <strong>The Physical Reality:</strong> S3 objects are <strong>strictly immutable</strong>. S3 does not support partial byte writes, in-place edits, or byte-range appends. Modifying 10 bytes at the end of a 2GB file requires uploading a completely new 2GB object!
            <br/><br/>
            <strong>Architectural Solution:</strong> For streaming logs or big data ingestion, buffer writes in local memory or Kafka. Once a batch reaches 128MB or 5 minutes (e.g. Parquet files in Apache Iceberg / Delta Lake), write a fresh, immutable chunk to S3.
          </p>
        </div>

        <!-- Interview Follow-ups: Deep Dive Technical Q&As -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#24314A] pb-2">
            <span class="material-symbols-outlined text-[18px] text-indigo-400">quiz</span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide uppercase">
              Senior Interview Deep-Dives: Real-World Follow-Ups
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${interviewFollowUps.map(item => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 shrink-0">
                    ${item.qNum}
                  </span>
                  <h4 class="font-sans text-[13px] font-bold text-white leading-snug">
                    ${item.question}
                  </h4>
                </div>
                <div class="text-[12.5px] text-slate-300 font-sans leading-relaxed pt-1 border-t border-[#24314A]/60">
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
            Default to Object Storage (S3) for all media, files, blobs, and cold datasets. Use Block Storage (EBS) only for database transactional state requiring raw IOPS and POSIX locks. Never design a system where application servers write user-uploaded files to local disks or shared NFS—always issue Pre-Signed URLs for direct client-to-S3 uploads.
          </p>
        </div>

        <!-- Page 87 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 87</span>
        </div>

      </div>

    </div>
  `;
}
