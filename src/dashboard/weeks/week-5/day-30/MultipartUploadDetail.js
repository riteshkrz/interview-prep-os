/**
 * 6.4 Uploading Large Files (Multipart Upload) - Visual Guide
 * High-signal, visually rich reproduction of Pages 78–80
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderMultipartUploadContent(topic) {
  const whyDesign = [
    { property: "Resumability", how: "A network failure retries one 100MB chunk, not a 10GB entire file from scratch." },
    { property: "Parallelism", how: "Chunks upload concurrently over multiple TCP streams, saturating network bandwidth." },
    { property: "Integrity", how: "Each part returns an ETag (MD5) upon storage; final assembly cryptographically verifies the full manifest." },
    { property: "Idempotency", how: "Re-uploading the same (uploadID, partNumber) simply overwrites that part safely (sec. 9.4.3)." },
    { property: "Streaming Ingestion", how: "Producers can upload chunked data as it is generated, without knowing total file size upfront." }
  ];

  const followUps = [
    {
      q: "How do abandoned multipart uploads secretly leak thousands of dollars in cloud storage?",
      a: "When a client initiates a multipart upload and disconnects halfway through, the uploaded chunks remain stored in the S3 bucket indefinitely. <strong>They are completely invisible in standard object listings (<code>s3 ls</code>) but continue to be billed at full storage rates</strong>. <em>The mandatory production control:</em> configure an S3 Bucket Lifecycle Rule: <code>AbortIncompleteMultipartUpload</code> with a 7-day retention horizon."
    },
    {
      q: "How do you architect uploads so that application backend servers never proxy gigabytes of user payload?",
      a: "<strong>Direct-to-Store Presigned URLs.</strong> The client asks your lightweight API service for permission to upload. The service validates authentication, initiates the multipart upload with S3, and returns presigned S3 PUT URLs for each part. The client then streams binary video/media directly to Amazon S3 edge endpoints, completely bypassing your backend application servers and saving compute, network, and RAM."
    },
    {
      q: "Why is the ETag of a multipart S3 object NOT the MD5 hash of the original file?",
      a: "For single-part PUTs, the S3 ETag is the hexadecimal MD5 of the content. For multipart objects, <strong>the ETag is a hash of the concatenated binary MD5 hashes of each individual part, suffixed by the part count (e.g. <code>c3b...-4</code>)</strong>. Integrity verification scripts that compare local file MD5 against the S3 ETag will fail unless they replicate the exact chunking logic."
    },
    {
      q: "How do you upload a 20GB file when client RAM is restricted to 512MB?",
      a: "<strong>Stream through fixed-size sliding memory windows.</strong> Read 16MB from disk (or incoming request socket) into a reusable memory buffer, upload that part to S3, and immediately discard/overwrite the buffer before reading the next chunk. Never materialize the entire file payload in memory."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="6.4-multipart-upload">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 6 · Storage Systems &amp; Object Storage
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 78–80 · Section 6.4</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          6.4 Uploading Large Files (S3 Multipart Upload)
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          How modern object storage systems transfer multi-gigabyte video, backups, and data sets reliably over unreliable networks by decomposing serial transfers into parallel, retryable chunks.
        </p>
      </div>

      <!-- Multipart Protocol Flow Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            MULTIPART UPLOAD PROTOCOL (1.6 GB FILE &rarr; 8 &times; 200 MB PARTS)
          </span>
          <span class="text-[11px] font-code text-slate-500">6-Stage Flow</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
CLIENT                                                                   OBJECT STORE (S3)
  │  ① InitiateMultipartUpload(bucket, key) ───────────────────────────► │
  │  ◄─── ② uploadID = "abc123-uuid" ─────────────────────────────────── │
  │                                                                      │
  │  ③ UploadPart(uploadID, partNumber=1, 200MB) ──────────────────────► │ ┐
  │  ◄─── ④ ETag = md5(part1) ────────────────────────────────────────── │ │ Parts uploaded
  │  ③ UploadPart(uploadID, partNumber=2, 200MB) ──────────────────────► │ │ INDEPENDENTLY
  │  ◄─── ④ ETag = md5(part2) ────────────────────────────────────────── │ │ and IN PARALLEL
  │  ... [parts 3 to 8 uploaded concurrently with backoff] ...           │ ┘ (retry only failed parts!)
  │                                                                      │
  │  ⑤ CompleteMultipartUpload(uploadID, [(1,etag1),(2,etag2),...]) ───► │
  │                                                                      │ ⑥ Reassembles object
  │  ◄─── 200 OK + final ETag ───────────────────────────────────────────│    metadata committed
        </div>
      </div>

      <!-- Why This Design Works Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          CORE ARCHITECTURAL BENEFITS
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/4">System Property</th>
                <th class="p-3 w-3/4">How Multipart Upload Delivers It</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${whyDesign.map(w => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-cyan-300 font-code text-[12px]">${w.property}</td>
                  <td class="p-3 text-slate-200 leading-relaxed">${w.how}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Operational Traps Callout -->
      <div class="bg-[#141C2E] border border-amber-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2 font-sans">
        <span class="font-code text-[12px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">attach_money</span>
          Two Production Details That Impress Interviewers
        </span>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          <strong>1. Abandoned Upload Storage Leak:</strong> Incomplete uploads are hidden from UI bucket listings but billed at full storage rates forever. Mention configuring automated <code>AbortIncompleteMultipartUpload</code> lifecycle rules.<br/>
          <strong>2. Direct Presigned S3 URLs:</strong> Generating presigned URLs for each chunk lets clients stream gigabytes directly to AWS S3, removing your application fleet from the data plane.
        </p>
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
          "Multipart upload turns one long, fragile, serial transfer into many small, parallel, independently retryable ones — resumability, throughput and integrity from one design change. Add the two details nobody mentions: presigned direct-to-store URLs, and an S3 lifecycle rule to reap abandoned parts."
        </p>
      </div>

    </div>
  `;
}
