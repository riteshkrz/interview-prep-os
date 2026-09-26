/**
 * Distributed Email Architecture (Design Gmail) (Topic 9.3)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 111–113
 */

export function renderDistributedEmailContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="distributed-email">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 9.3 · Pages 111–113
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Applied Messaging System
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">SMTP vs IMAP · S3 Blob Deduplication · Sharded Wide-Column Metadata</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Distributed Email Architecture (Design Gmail)</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Building a global email infrastructure requires separating transport protocols (SMTP push vs IMAP pull), splitting mutable mailbox metadata from immutable MIME attachments (saving petabytes via content-hash deduplication), and maintaining an asynchronous per-user full-text search index.
      </p>
    </div>

    <!-- ASCII Protocol & Transfer Flow -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        End-to-End Email Delivery Topology (Page 111)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
   Sender (Alice)
      │
      ▼ HTTP POST / REST or SMTP
   Web / Outgoing Mail Server
      │
      ├─► Same Domain Check: Is recipient @gmail.com?
      │     ├─ YES ──► Write directly to Recipient Storage (Bypass Internet SMTP!)
      │     └─ NO  ──► Enqueue to Outgoing Kafka Delivery Queue
      │
      ▼
   Outgoing SMTP Workers
      │ (DNS MX Lookup on recipient domain)
      ▼
   Public Internet SMTP (Port 25 / TLS)
      │
      ▼
   Incoming SMTP Load Balancer ──► Spam Filter (SPF / DKIM / DMARC)
                                         │
                                         ▼
   ┌─────────────────────────────────────┴─────────────────────────────────────┐
   ▼                                                                           ▼
[MAILBOX METADATA DB]                                               [OBJECT STORAGE (S3)]
Sharded by user_id                                                  Immutable MIME Bodies & Files
Thread, Labels, Read State                                          Deduplicated by SHA-256 hash!
   │                                                                           │
   └─────────────────────────────────────┬─────────────────────────────────────┘
                                         ▼
                               Recipient (Bob)
                       (IMAP push / WebSocket notification)
</pre>
      </div>
    </div>

    <!-- Storage Separation: Data vs Metadata Split -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        The Data vs. Metadata Separation (Page 113)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-cyan-300 font-bold mb-2">1. METADATA TIER (Wide-Column / SQL)</div>
          <ul class="space-y-1.5 text-slate-300 font-sans list-disc list-inside">
            <li><strong>Characteristics:</strong> Small records, frequently mutated (read/unread, starring, labeling, moving folders).</li>
            <li><strong>Partition Key:</strong> Sharded strictly by <code class="text-cyan-300">user_id</code>.</li>
            <li><strong>Access Pattern:</strong> All mailbox listing and thread queries hit exactly <strong>one database shard</strong> with zero cross-node scatter-gather!</li>
          </ul>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-2">2. PAYLOAD TIER (Object Store / S3)</div>
          <ul class="space-y-1.5 text-slate-300 font-sans list-disc list-inside">
            <li><strong>Characteristics:</strong> Multi-megabyte raw MIME bodies, PDF/image attachments; completely immutable.</li>
            <li><strong>Keying:</strong> Content-addressed hash: <code class="text-purple-300">s3://attachments/&lt;sha256&gt;</code>.</li>
            <li><strong>Attachment Deduplication:</strong> If a company sends a 20MB PDF to 5,000 employees, the file is stored <strong>once</strong> in S3, creating 5,000 lightweight 32-byte pointer rows!</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Protocols: SMTP vs IMAP -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Protocols: SMTP Pushes, IMAP Pulls & Syncs (Page 111)
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Protocol</th>
              <th class="p-3 font-semibold text-cyan-300">Direction & Model</th>
              <th class="p-3 font-semibold text-slate-300">Role in Modern Email</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">SMTP</td>
              <td class="p-3 text-cyan-200">Push-based transfer</td>
              <td class="p-3 text-slate-300">Client-to-server and server-to-server email transport across the open internet.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">IMAP</td>
              <td class="p-3 text-emerald-300">Bidirectional state sync</td>
              <td class="p-3 text-slate-300">Keeps email on the server; synchronizes folders, read flags, and drafts across multiple devices simultaneously.</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">POP3 (Legacy)</td>
              <td class="p-3 text-rose-300">Download and delete</td>
              <td class="p-3 text-slate-400">Legacy; downloads email to local disk and purges server copy. Unsuitable for modern multi-device users.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Anti-Abuse & Deliverability -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Spam Defense & Deliverability (Page 113)
      </h3>
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2 leading-relaxed">
        <p class="text-slate-300">
          Over <strong>85% of all daily email traffic is malicious or unsolicited spam</strong>. A robust email system must validate identity at ingress:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[11px] text-slate-300 pt-1">
          <div class="p-2 rounded bg-slate-950 border border-slate-800">
            <strong class="text-amber-300">SPF (Sender Policy Framework):</strong> Publishes DNS TXT records listing which IP addresses are authorized to send mail for the domain.
          </div>
          <div class="p-2 rounded bg-slate-950 border border-slate-800">
            <strong class="text-cyan-300">DKIM (DomainKeys Identified Mail):</strong> Cryptographically signs outgoing emails with private key; receiver verifies with public DNS key.
          </div>
          <div class="p-2 rounded bg-slate-950 border border-slate-800">
            <strong class="text-emerald-300">DMARC:</strong> Specifies enforcement policy (reject / quarantine) if SPF or DKIM validation fails.
          </div>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 113)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Design Gmail by separating SMTP transfer from IMAP retrieval, sharding mutable mailbox metadata by user_id for zero-coordination queries, storing immutable email bodies in S3 with SHA-256 deduplication, and streaming events to an asynchronous Elasticsearch cluster for fast full-text search."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
