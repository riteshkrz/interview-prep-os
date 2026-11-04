/**
 * 2.2 How HTTPS Works - Visual Guide
 * High-signal, visually rich and faithful reproduction of Pages 22 and 23
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderHttpsContent(topic) {
  const followUps = [
    {
      q: "How much performance overhead does HTTPS add compared with plaintext HTTP?",
      a: "HTTPS introduces two distinct costs: <strong>(1) Latency:</strong> Exactly 1 extra network Round-Trip Time (RTT) for the TLS 1.3 handshake (down from 2 RTTs in TLS 1.2). This delay is heavily amortized by connection pooling (HTTP Keep-Alive) and TLS session resumption. <strong>(2) CPU Load:</strong> Virtually negligible today for bulk data encryption because modern Intel, AMD, and ARM chips have hardware-accelerated <strong>AES-NI instructions</strong> capable of encrypting 50+ Gbps per CPU core. The expensive operation is establishing brand new handshakes, which is why connection churn hurts far more than data volume."
    },
    {
      q: "What exact checks does a browser perform when validating an SSL/TLS certificate?",
      a: "The client verifies five critical criteria: <strong>(1) Trust Chain:</strong> Follows digital signatures up to a trusted Root Certificate Authority (CA) pre-installed in the browser/OS keystore; <strong>(2) Subject Alternative Name (SAN):</strong> Verifies the requested hostname (e.g. <code>api.example.com</code>) matches the domain on the cert; <strong>(3) Validity Period:</strong> Checks that the current time is between the 'Not Before' and 'Not After' dates; <strong>(4) Revocation Status:</strong> Checks that the certificate hasn't been revoked by the issuer via OCSP stapling or CRLs; <strong>(5) Digital Signature:</strong> Verifies the CA's cryptographic signature using the CA's public key."
    },
    {
      q: "Where should you terminate TLS in a large-scale system architecture?",
      a: "In 95% of production systems, <strong>terminate TLS at the edge (CDN or Cloud Load Balancer / Reverse Proxy)</strong>. This offloads cryptographic handshakes from application servers, enables edge static caching, and lets WAFs inspect plaintext headers for SQLi/XSS attacks. Traffic from the load balancer across the internal private VPC can travel over plaintext HTTP or lightweight internal <strong>mTLS via a service mesh (Istio/Envoy)</strong> if regulatory zero-trust compliance (HIPAA/PCI-DSS) requires it."
    },
    {
      q: "How does mutual TLS (mTLS) differ from standard HTTPS, and when is it used?",
      a: "In standard HTTPS, only the server proves its identity (one-way). In <strong>mTLS (Mutual TLS)</strong>, both the client AND server present X.509 certificates to cryptographically authenticate each other. It is the gold standard for <strong>zero-trust service-to-service communication inside Kubernetes</strong> and high-security B2B banking/partner API integrations. The trade-off is high operational toil: managing certificate lifecycle, rotation, and revocation across hundreds of microservices."
    },
    {
      q: "Does HTTPS hide which website or domain a user is visiting?",
      a: "HTTPS hides the URL path (<code>/users/123/profile</code>), query parameters (<code>?token=secret</code>), request headers, cookies, and payload body. However, an eavesdropper (like an ISP or public Wi-Fi operator) can still see the <strong>destination IP address</strong> and, until recently, the hostname via the plaintext <strong>Server Name Indication (SNI)</strong> header. The emerging standard <strong>Encrypted Client Hello (ECH)</strong> encrypts the SNI header to close this privacy leak."
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
          2.2 How HTTPS Works: The TLS 1.3 Handshake
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          Hypertext Transfer Protocol Secure (HTTPS) secures HTTP by running it over an encrypted <strong>Transport Layer Security (TLS)</strong> tunnel. If an eavesdropper intercepts packets on public Wi-Fi or internet fiber lines, they see only scrambled binary ciphertext.
        </p>
      </div>

      <!-- SIMPLE MENTAL MODEL BOX: THE OPEN PADLOCK VS. COMBINATION SAFE -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          THE SIMPLE MENTAL MODEL: ASYMMETRIC VS. SYMMETRIC ENCRYPTION
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-300 leading-relaxed font-sans">
          <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
            <strong class="text-indigo-300 flex items-center gap-1.5 mb-1.5">
              <span class="material-symbols-outlined text-[17px]">lock_open</span>
              Asymmetric Handshake = The Open Padlock
            </strong>
            <p>
              The server hands open padlocks (Public Keys) to anyone in the world. You place a secret session combination inside an iron box, snap the lock shut, and mail it back. Only the server holds the physical key (Private Key) that can unlock it. <strong>Safe across public untrusted networks, but computationally slow.</strong>
            </p>
          </div>
          <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
            <strong class="text-emerald-300 flex items-center gap-1.5 mb-1.5">
              <span class="material-symbols-outlined text-[17px]">lock</span>
              Symmetric Data Transfer = The Combination Safe
            </strong>
            <p>
              Once both sides safely share the secret combination code, they switch to a high-speed combination safe (Symmetric Key, e.g., AES-GCM). Both parties use the same key to lock and unlock data in nanoseconds using CPU hardware instructions. <strong>Blazing fast bulk encryption.</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- Core Mechanics: 5 Steps -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-cyan-400">1. TCP Handshake</span>
          <p class="text-[12px] text-slate-300">Client and server complete 3-way TCP SYN / SYN-ACK / ACK (1 RTT).</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-indigo-400">2. TLS ClientHello</span>
          <p class="text-[12px] text-slate-300">Client sends supported ciphers, TLS 1.3 version, and Diffie-Hellman key share.</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-emerald-400">3. Cert Validation</span>
          <p class="text-[12px] text-slate-300">Server presents X.509 certificate. Client verifies Root CA signature chain and SAN.</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-amber-400">4. Key Derivation</span>
          <p class="text-[12px] text-slate-300">Both sides compute matching symmetric session keys via ECDHE with Forward Secrecy.</p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-purple-400">5. Symmetric Data</span>
          <p class="text-[12px] text-slate-300">Hardware-accelerated AES-GCM encrypts all subsequent HTTP payloads.</p>
        </div>
      </div>

      <!-- Handshake Timeline Diagram -->
      <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
              HANDSHAKE TIMELINE: ASYMMETRIC KEY DERIVATION → SYMMETRIC SESSION
            </span>
          </div>
          <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
            <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">TCP + TLS 1.3 Timeline</span>
            <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">ECDHE + AES-GCM</span>
          </div>
        </div>

        <!-- The Architectural Diagram Image As-Is -->
        <div class="flex flex-col gap-3">
          <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
            <img 
              src="/images/tcp-tls-handshake-timeline.png" 
              alt="TCP + TLS Handshake Timeline (Asymmetric Key Derivation → Symmetric Session)" 
              class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
              loading="eager"
              title="Click to view image full resolution"
              onclick="window.open('/images/tcp-tls-handshake-timeline.png', '_blank')"
            />
          </div>
          <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
              Click diagram to view in high resolution in new tab
            </span>
            <span class="font-code text-[10.5px] text-slate-500">TCP Handshake (1 RTT) + TLS 1.3 Handshake (1 RTT) + Encrypted Data (~0 RTT)</span>
          </div>
        </div>

        <!-- Key Takeaway Callout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11.5px] font-sans">
          <div class="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-2.5">
            <span class="text-blue-600 font-bold shrink-0 text-[14px]">1</span>
            <div>
              <strong class="block font-bold mb-0.5 text-blue-900">TCP Handshake (1 RTT):</strong>
              <span>SYN → SYN-ACK → ACK establishes the transport-level network connection between client and server.</span>
            </div>
          </div>
          <div class="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
            <span class="text-emerald-600 font-bold shrink-0 text-[14px]">2</span>
            <div>
              <strong class="block font-bold mb-0.5 text-emerald-900">TLS 1.3 Handshake (1 RTT):</strong>
              <span>ClientHello sends ECDHE key parameters; ServerHello confirms cipher suite and returns certificate. Keys derived immediately.</span>
            </div>
          </div>
          <div class="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
            <span class="text-amber-600 font-bold shrink-0 text-[14px]">3</span>
            <div>
              <strong class="block font-bold mb-0.5 text-amber-900">Encrypted Data (~0 RTT):</strong>
              <span>Fast symmetric AES-GCM encryption with derived session keys encrypts all subsequent application payload.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Flagged Callout: Accurate for TLS 1.2 vs TLS 1.3 -->
      <div class="bg-[#1C1322] border-l-4 border-rose-500 rounded-r-xl p-4 sm:p-5 flex flex-col gap-2">
        <div class="flex items-center gap-2 text-rose-400 font-bold font-code text-[12px] uppercase">
          <span class="material-symbols-outlined text-[16px]">warning</span>
          CRITICAL INTERVIEW TRAP: RSA KEY TRANSPORT IS DEAD
        </div>
        <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
          Older textbooks often state: <em>"the client generates a random session key and encrypts it using the server's public key."</em> That is <strong>RSA key transport</strong>. RSA key exchange was completely <strong>banned in TLS 1.3</strong> because it lacks <strong>Forward Secrecy</strong>: if an attacker records your encrypted internet traffic today and steals the server's private key 3 years from now, they can retroactively decrypt all past traffic!
        </p>
        <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
          Modern TLS 1.3 strictly mandates <strong>(EC)DHE (Elliptic Curve Diffie-Hellman Ephemeral)</strong>: ephemeral key parameters generate a one-time session key that is never stored anywhere, guaranteeing that past traffic can never be decrypted even if the server is compromised later.
        </p>
      </div>

      <!-- Why Symmetric for Data Transfer -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-indigo-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">lock</span>
            Why Use Asymmetric for the Handshake?
          </span>
          <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
            Client and server share no pre-existing passwords over the open internet. Asymmetric public/private key cryptography solves the initial trust establishment and key exchange without either party exposing secrets over the wire.
          </p>
        </div>
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-emerald-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">bolt</span>
            Why Use Symmetric for Actual Data?
          </span>
          <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
            Asymmetric cryptography is computationally expensive (~1,000x slower CPU calculations). Symmetric ciphers (AES-GCM) execute directly on CPU hardware registers (Intel/AMD AES-NI) capable of encrypting tens of gigabits per second with zero noticeable CPU load.
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
          "Asymmetric cryptography establishes trust and derives a shared session key; symmetric cryptography encrypts the actual data at wire speed. In modern TLS 1.3, this completes in 1 RTT with mandatory Forward Secrecy via ECDHE."
        </p>
      </div>

    </div>
  `;
}
