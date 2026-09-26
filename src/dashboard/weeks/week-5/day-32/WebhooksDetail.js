/**
 * Webhooks and Outbound Integrations (Topic 13.5)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 171–173
 */

export function renderWebhooksContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="webhooks-integrations">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 13.5 · Pages 171–173
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Enterprise Outbound Architecture
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Head-of-Line Isolation · SSRF Hardening · HMAC Security</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Webhooks & Outbound Integrations</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Delivering events to endpoints you do not control inverts your architecture: you become the client, and your platform stability depends on thousands of customer servers of wildly varying latency and reliability. Hardening requires per-tenant queue isolation, strict exponential backoff, per-endpoint circuit breakers, and ironclad SSRF perimeter defense.
      </p>
    </div>

    <!-- ASCII Delivery Architecture -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        Delivery Architecture & Per-Tenant Isolation (Page 171)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
  Domain Event ──► Transactional Outbox ──► Dispatcher ──► PER-TENANT DELIVERY QUEUES
                                                             │
                    ┌────────────────────────────────────────┴────────────────────────────────────────┐
                    ▼                                        ▼                                        ▼
             [Tenant A Queue]                         [Tenant B Queue]                         [Tenant C Queue]
                    │                                        │                                        │
             Workers (Fast)                           Workers (Fast)                     Workers (Slow / 30s timeout)
                    │                                        │                                        │
                    ▼                                        ▼                                        ▼
             Customer A API                           Customer B API                           Customer C API
             (15 ms latency)                          (40 ms latency)                          (Failing / Dropping)

  WHY PER-TENANT PARTITIONING MATTERS:
  • If all webhook events share a single global queue, ONE customer whose endpoint hangs for 30s
    will monopolize every worker thread in the fleet.
  • Result: Deliveries for thousands of healthy customers stall completely (Head-of-Line Blocking).
  • Partitioning by tenant ensures a broken endpoint only harms that specific customer's queue!
</pre>
      </div>
    </div>

    <!-- Retry Schedule & Circuit Breakers -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        Production Retry Schedule & Per-Endpoint Circuit Breakers
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-3 flex items-center justify-between">
            <span>EXPONENTIAL BACKOFF + JITTER</span>
            <span class="text-[10px] text-slate-500">8 Attempts Over 24 Hours</span>
          </div>
          <div class="space-y-1.5 text-slate-300">
            <div class="flex justify-between border-b border-slate-800 pb-1"><span>Attempt 1:</span> <span class="text-cyan-400">Immediately</span></div>
            <div class="flex justify-between border-b border-slate-800 pb-1"><span>Attempt 2:</span> <span class="text-cyan-400">+10 seconds</span></div>
            <div class="flex justify-between border-b border-slate-800 pb-1"><span>Attempt 3:</span> <span class="text-cyan-400">+1 minute</span></div>
            <div class="flex justify-between border-b border-slate-800 pb-1"><span>Attempt 4:</span> <span class="text-cyan-400">+5 minutes</span></div>
            <div class="flex justify-between border-b border-slate-800 pb-1"><span>Attempt 5:</span> <span class="text-cyan-400">+30 minutes</span></div>
            <div class="flex justify-between border-b border-slate-800 pb-1"><span>Attempt 6:</span> <span class="text-cyan-400">+2 hours</span></div>
            <div class="flex justify-between border-b border-slate-800 pb-1"><span>Attempt 7:</span> <span class="text-cyan-400">+12 hours</span></div>
            <div class="flex justify-between text-amber-300 font-bold pt-1"><span>Attempt 8:</span> <span>+24 hours ──► Disable & Alert</span></div>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-3">PER-ENDPOINT CIRCUIT BREAKER</div>
          <p class="text-slate-300 mb-3 leading-relaxed">
            When a customer's endpoint fails consecutively &gt; threshold (e.g. 50 failures or 100% 5xx over 5 mins), the breaker trips to <strong>OPEN</strong>:
          </p>
          <ul class="space-y-2 text-slate-300 list-disc list-inside">
            <li>Workers immediately cease firing HTTP requests.</li>
            <li>New incoming events are parked directly into their cold queue buffer without thread consumption.</li>
            <li>A single synthetic probe or half-open trial request is scheduled every 10 minutes.</li>
            <li>When the customer recovers, delivery resumes automatically and drains the parked backlog at a rate-limited pace.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Security Trap: SSRF & HMAC Signatures -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        The Critical Security Trap: Server-Side Request Forgery (SSRF) (Page 172)
      </h3>
      <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 space-y-3 leading-relaxed">
        <p>
          <strong class="text-red-300 uppercase tracking-wider block font-bold">Vulnerability by Design:</strong>
          A webhook URL is an arbitrary attacker-supplied URL that your core backend servers make outbound HTTP POST requests to. Without aggressive controls, malicious users can register internal addresses such as:
        </p>
        <div class="bg-black/50 p-2.5 rounded font-mono text-red-300">
          http://169.254.169.254/latest/meta-data/iam/security-credentials/ (Cloud Metadata Theft)<br/>
          http://127.0.0.1:6379/ (Redis Port Smuggling)<br/>
          http://10.0.0.1/admin (Internal Network Topology Reconnaissance)
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 pt-2 font-mono">
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <strong class="text-white">1. DNS Rebinding Defense:</strong> Resolve DNS and validate the destination IP. Reject loopback (127.0.0.0/8), private (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), and link-local (169.254.0.0/16). Re-verify right before socket connect!
          </div>
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <strong class="text-white">2. Isolated Egress DMZ:</strong> Run webhook dispatchers in a dedicated, isolated egress VPC with zero routing access to internal VPC microservices or databases. Require HTTPS exclusively.
          </div>
        </div>
      </div>
    </div>

    <!-- Consumer Best Practices & Signatures -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Payload Signing & The 5 Consumer Golden Rules
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-2 font-mono">HMAC-SHA256 Payload Signature</h4>
          <p class="text-slate-300 mb-2 leading-relaxed">
            Transmit signature in header: <code class="text-emerald-300">X-Signature-256: t=1690000000,v1=a5c9f...</code>
          </p>
          <div class="bg-[#0A0E17] p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
            signature = HMAC_SHA256(secret, timestamp + "." + payload_body)
          </div>
          <p class="text-slate-400 mt-2 text-[11.5px] leading-relaxed">
            Receiver must verify in <strong>constant time</strong> (<code class="text-cyan-300">crypto.timingSafeEqual</code>) to prevent timing side-channel attacks, and reject timestamps older than 5 minutes to prevent replay attacks.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-2 font-mono">5 Guidance Rules to Publish for Customers</h4>
          <ol class="space-y-1.5 text-slate-300 list-decimal list-inside">
            <li><strong>Verify Before Parsing:</strong> Check signature and timestamp before JSON deserialization.</li>
            <li><strong>Return 2xx Instantly:</strong> ACK HTTP 200 within 500 ms and enqueue work internally; inline processing causes timeouts.</li>
            <li><strong>Idempotency by Event ID:</strong> At-least-once delivery means duplicates are normal. Deduplicate on <code class="text-cyan-300">event_id</code>.</li>
            <li><strong>Order Tolerance:</strong> Out-of-order delivery happens; compare version/timestamp and drop stale updates.</li>
            <li><strong>Tolerate Additive Schema:</strong> Ignore unknown JSON fields so provider additions never break consumer parsers.</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- Staff Follow-ups -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Staff Interview Follow-ups (Page 172)
      </h3>
      <div class="space-y-3 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q1: A customer endpoint is completely dead for 6 hours. What happens to the system?</h4>
          <p class="text-slate-300 leading-relaxed">
            The per-endpoint circuit breaker trips OPEN after 50 failures. Workers stop querying the dead URL. Incoming events are parked in their per-tenant queue, bounded by a 72-hour TTL and maximum queue depth. Retries continue on the sparse exponential backoff tier (attempt 6 at +2h, attempt 7 at +12h). When the customer fixes their server, delivery resumes and drains the parked backlog at a controlled, throttled rate so we do not crush their freshly recovered server.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q2: How do you prevent a malicious customer from discovering your private network topology?</h4>
          <p class="text-slate-300 leading-relaxed">
            Egress isolation + strict DNS validation. All webhook worker instances run in an egress-only subnet with NAT Gateway and no route tables to private subnets. Custom DNS resolver validates the IP against RFC 1918 and link-local subnets before opening TCP sockets. Never relay the HTTP response body back in test-webhook endpoints — only return the status code and latency to prevent internal data exfiltration.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 173)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "When building an outbound webhook system, partition queues by tenant to eliminate head-of-line blocking, enforce exponential retry backoff with per-endpoint circuit breakers, sign payloads with HMAC-SHA256, and guard against SSRF with pre-connection DNS IP validation and dedicated egress VPC networks."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
