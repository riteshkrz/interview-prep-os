/**
 * 2.2 How HTTPS Works - Visual Guide
 * High-signal, visually rich and faithful reproduction of Pages 22 and 23
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderHttpsContent(topic) {
  const followUps = [
    {
      q: "How much performance overhead does HTTPS add compared with HTTP?",
      a: "Two distinct costs. <strong>Latency:</strong> one extra RTT for a TLS 1.3 handshake (two for 1.2), which is the part users feel — and it is amortised by session resumption and connection reuse. <strong>CPU:</strong> negligible today for symmetric bulk encryption thanks to AES-NI hardware instructions (single-digit percent); the asymmetric handshake is the expensive part, which is why connection churn hurts far more than bytes transferred."
    },
    {
      q: "What exactly does certificate validation check?",
      a: "That the chain links to a trusted root CA, each signature verifies, the hostname matches the SAN (Subject Alternative Name), the validity dates are current, and the certificate is not revoked (CRL/OCSP, usually OCSP stapling). <em>Note what it does not prove:</em> that the operator is trustworthy — only that they control the domain."
    },
    {
      q: "Where would you terminate TLS in a large system?",
      a: "Usually at the edge (CDN or L7 load balancer) for handshake offload and session reuse, then re-encrypt internally if the threat model requires it (mTLS/service mesh in a zero-trust network). Be explicit about the trade-off: terminating early allows caching, compression and WAF inspection; end-to-end encryption gives confidentiality from your own infrastructure."
    },
    {
      q: "How does mutual TLS (mTLS) differ, and when is it worth it?",
      a: "In mTLS the client also presents a certificate, so both sides authenticate cryptographically. It is the standard for service-to-service auth inside a service mesh and for high-value B2B/partner APIs. The cost is certificate lifecycle management — issuance, rotation, revocation — which is why it is rarely used for end users."
    },
    {
      q: "Does HTTPS hide which site a user visits?",
      a: "It hides the URL path, query params, headers and body — but <strong>not</strong> the destination IP, and historically not the hostname (SNI was sent in the clear). Encrypted Client Hello (ECH / ESNI) addresses this. Traffic size and timing also leak information."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="2.2-https">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Part 2 · Networking &amp; Protocols
            </span>
            <span class="text-[12px] font-code text-slate-400">Page 22–23 · Section 2.2</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 15 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          2.2 How HTTPS Works
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Hypertext Transfer Protocol Secure (HTTPS) is an extension of HTTP that transmits encrypted data using Transport Layer Security (TLS). If intercepted online, an eavesdropper sees only encrypted binary ciphertext.
        </p>
      </div>

      <!-- Core Mechanics: 5 Steps -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-cyan-400">1. TCP Handshake</span>
          <p class="text-[12px] text-slate-300">Client and server complete standard 3-way TCP SYN / SYN-ACK / ACK.</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-indigo-400">2. TLS Negotiation</span>
          <p class="text-[12px] text-slate-300">ClientHello (ciphers, TLS version, random) → ServerHello confirms suite.</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-emerald-400">3. Cert Validation</span>
          <p class="text-[12px] text-slate-300">Server presents X.509 certificate. Client verifies root CA chain, SAN, and OCSP.</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-amber-400">4. Key Exchange</span>
          <p class="text-[12px] text-slate-300">Diffie-Hellman (ECDHE) derives symmetric session key with Forward Secrecy.</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-purple-400">5. Symmetric Data</span>
          <p class="text-[12px] text-slate-300">Fast AES-GCM or ChaCha20-Poly1305 encrypts all subsequent application traffic.</p>
        </div>
      </div>

      <!-- Handshake Timeline Diagram -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            HANDSHAKE TIMELINE: ASYMMETRIC KEY DERIVATION → SYMMETRIC SESSION
          </span>
          <span class="text-[11px] font-code text-slate-500">TLS 1.3 Timeline</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
CLIENT                                                          SERVER
  │  ── TCP SYN ─────────────────────────────────────────────►  │
  │  ◄──────────────────────────────────── TCP SYN-ACK ───────  │  1 RTT (TCP)
  │  ── ACK ─────────────────────────────────────────────────►  │
  │                                                             │
  │  ── ClientHello (TLS versions, cipher suites, key_share) ─► │
  │  ◄──── ServerHello (chosen suite, key_share) + Certificate  │  1 RTT (TLS 1.3)
  │                                                             │
  │  [validate cert chain: root CA, hostname SAN, expiry, CRL]  │
  │  ── key exchange: session key established (ECDHE) ────────► │
  │  ◄──── Finished ──────────────────────────────────────────  │
  │                                                             │
  │  ════ SYMMETRIC (AES-GCM) encrypted application data ═════► │  ~0 extra RTT
  │  ◄═════════════════════════════════════════════════════════  │
  
  ▲ Asymmetric crypto = key exchange only. Symmetric = the whole conversation.
        </div>
      </div>

      <!-- Flagged Callout: Accurate for TLS 1.2 vs TLS 1.3 -->
      <div class="bg-[#1C1322] border-l-4 border-rose-500 rounded-r-xl p-4 sm:p-5 flex flex-col gap-2">
        <div class="flex items-center gap-2 text-rose-400 font-bold font-code text-[12px] uppercase">
          <span class="material-symbols-outlined text-[16px]">warning</span>
          FLAGGED — ACCURATE FOR TLS 1.2, OUTDATED IN TLS 1.3
        </div>
        <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
          Textbook descriptions stating <em>"the client generates a session key and encrypts it using the server's public key"</em> describe <strong>RSA key transport</strong>. RSA key transport was completely removed in TLS 1.3 and is discouraged in TLS 1.2 because it lacks <strong>Forward Secrecy</strong>: an adversary who records ciphertext today and steals the private key five years later can decrypt all historical traffic.
        </p>
        <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
          Modern TLS uses <strong>(EC)DHE</strong> (Elliptic Curve Diffie-Hellman Ephemeral) — both client and server contribute ephemeral parameters to compute a fresh, unrecorded shared secret. The server's certificate private key is used <em>solely to sign</em> the exchange, not to encrypt the secret.
        </p>
      </div>

      <!-- Why Symmetric for Data Transfer -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-indigo-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">lock</span>
            Why Asymmetric for Handshake?
          </span>
          <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
            Client and server share no pre-existing secrets over public internet. Asymmetric public/private key cryptography solves the initial trust establishment and key exchange without either party revealing their private keys.
          </p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-emerald-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">bolt</span>
            Why Symmetric for Data Transfer?
          </span>
          <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
            Asymmetric encryption is computationally expensive (~100× to 1000× higher CPU load). Symmetric ciphers (AES-GCM, ChaCha20) leverage hardware acceleration (Intel/AMD AES-NI, ARMv8 Cryptography Extensions) capable of encrypting tens of gigabits per second per core.
          </p>
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
      <div class="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Asymmetric crypto establishes trust and a key; symmetric crypto does the work. If you remember only one line, make it that — and add that TLS 1.3 uses ECDHE for forward secrecy in 1 RTT."
        </p>
      </div>

    </div>
  `;
}
