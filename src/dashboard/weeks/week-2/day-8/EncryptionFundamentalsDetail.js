/**
 * 3.5 Symmetric vs. Asymmetric Encryption: AES vs. RSA vs. ECC - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 44, 45, and 46
 * from The Modern System Design Interview Guide.
 */

export function renderEncryptionFundamentalsContent(topic) {
  const cryptoComparisonRows = [
    {
      algorithm: "AES-256-GCM",
      category: "Symmetric (Block Cipher / AEAD)",
      keySize: "256 bits",
      securityEquiv: "256 bits (Quantum-resistant)",
      speed: "Gigabytes/sec (Hardware AES-NI offload)",
      bestUse: "Bulk data at rest, disk/S3 encryption, TLS 1.3 payload channel"
    },
    {
      algorithm: "ChaCha20-Poly1305",
      category: "Symmetric (Stream Cipher / AEAD)",
      keySize: "256 bits",
      securityEquiv: "256 bits",
      speed: "Blazing fast on mobile/ARM (Zero hardware acceleration needed)",
      bestUse: "Mobile clients, IoT devices, WireGuard VPN protocol"
    },
    {
      algorithm: "RSA 2048 / 4096",
      category: "Asymmetric (Factoring Prime Numbers)",
      keySize: "2048–4096 bits",
      securityEquiv: "112–128 bits",
      speed: "Slow (Heavy CPU modular exponentiation math)",
      bestUse: "Legacy TLS certificates, enterprise PKI, document signing"
    },
    {
      algorithm: "ECDSA (secp256r1)",
      category: "Asymmetric (Elliptic Curve Discrete Log)",
      keySize: "256 bits",
      securityEquiv: "128 bits (Equivalent to RSA-3072)",
      speed: "Fast (10x faster signature verification than RSA)",
      bestUse: "Modern TLS 1.3 certificates, JWT signing, Apple Secure Enclave"
    },
    {
      algorithm: "Ed25519 / X25519",
      category: "Asymmetric (Twisted Edwards Curve)",
      keySize: "256 bits",
      securityEquiv: "128 bits",
      speed: "Ultra-fast, constant-time (side-channel attack immune)",
      bestUse: "SSH keys, Git commit signing, Signal protocol, modern key exchange"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why has Elliptic Curve Cryptography (ECC) largely replaced RSA in modern high-scale distributed systems and TLS 1.3?",
      answer: `Three decisive technical advantages:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Key Size vs. Security:</strong> A 256-bit ECC key provides the equivalent cryptographic strength of a 3072-bit RSA key. Smaller keys mean dramatically smaller network payload packets during TLS handshakes.</li>
        <li><strong>Computational Efficiency:</strong> ECC requires significantly less CPU power and memory to generate keys and compute signatures, saving millions in cloud compute costs on API gateways terminating 100k+ TLS handshakes/second.</li>
        <li><strong>Mobile &amp; Battery Friendly:</strong> Tiny cryptographic footprints minimize battery drain on mobile and IoT devices.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is Perfect Forward Secrecy (PFS) and why is it mandatory in modern distributed transport security?",
      answer: `Without <strong>Perfect Forward Secrecy (PFS)</strong>, if an attacker records all encrypted HTTPS traffic going to your servers today, and then 3 years later breaches your data center and steals your server's static private RSA key, they can retroactively decrypt <em>every historical session ever recorded</em>.
      <br/><br/>
      PFS prevents this by using <strong>Ephemeral Diffie-Hellman (ECDHE)</strong>: A unique, disposable asymmetric key pair is generated for each individual session and discarded immediately after the handshake. Even if an attacker obtains the server's long-term certificate private key, they cannot decrypt past traffic because the ephemeral keys were never saved to disk.`
    },
    {
      qNum: "Q3",
      question: "What is the difference between Encryption, Hashing, and Encoding? (The classic screening question)",
      answer: `Always answer with mathematical clarity:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Encoding (e.g. Base64, Hex):</strong> Reversible data transformation without any secret key. Purpose: ensure data survives transport protocols without corruption. Provides <em>zero security</em>.</li>
        <li><strong>Hashing (e.g. SHA-256, Argon2id):</strong> One-way irreversible mathematical compression. Given the output, you cannot compute the input. Used for password verification and file integrity checks.</li>
        <li><strong>Encryption (e.g. AES, RSA):</strong> Two-way reversible mathematical transformation using a secret cryptographic key. Guarantees <em>confidentiality</em>: only holders of the matching key can recover plaintext.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "What is an Initialization Vector (IV) or Nonce in AES-GCM, and what catastrophe happens if an IV is reused with the same key?",
      answer: `In AES-GCM, an <strong>Initialization Vector (IV)</strong> or <strong>Nonce</strong> (Number used Once) is a 96-bit random or sequential value passed alongside the secret key to ensure that encrypting the exact same plaintext multiple times yields completely distinct ciphertexts.
      <br/><br/>
      <strong class="text-rose-400">The Catastrophe:</strong> In Galois/Counter Mode (GCM), reusing an (IV, Key) pair is completely fatal. An attacker who captures two ciphertexts encrypted with the same key and IV can XOR the ciphertexts together to eliminate the keystream and recover the underlying plaintext. Furthermore, it completely breaks the GHASH authentication tag, allowing the attacker to forge valid encrypted messages at will.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 44, 45, 46: ENCRYPTION FUNDAMENTALS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              8.7 Symmetric vs. Asymmetric Encryption: AES vs. RSA vs. ECC
            </h2>
          </div>
          <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed pl-4">
            Security in distributed systems relies on two foundational cryptographic pillars: <strong class="text-indigo-400">Symmetric Encryption</strong> (blazing-fast data protection with one secret key) and <strong class="text-cyan-400">Asymmetric Encryption</strong> (public/private key pairs that solve key exchange across untrusted networks). Modern architectures combine both into high-throughput <strong class="text-white">Hybrid Cryptosystems</strong>.
          </p>
        </div>

        <!-- Everyday Mental Model Banner -->
        <div class="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-slate-900 border border-blue-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">psychology</span>
            <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider">
              Everyday Mental Model: Shared Padlock vs. Mailbox Slit vs. Envelope Safe
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
            <div class="bg-[#0F1626]/80 border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-indigo-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">lock</span>
                Symmetric (AES) = Lockbox with 1 Physical Key
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Super fast to lock and unlock (gigabytes/second). But both parties must possess the exact same physical key. If a thief intercepts the key while you are mailing it to your partner, your security is blown.
              </p>
            </div>
            <div class="bg-[#0F1626]/80 border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-cyan-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">key</span>
                Asymmetric (RSA/ECC) = Mailbox with Drop Slot
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Anyone on the street can drop a letter through the public slot (Public Key). But only the homeowner with the private key can unlock the door to retrieve the letters (Private Key). 1,000x slower to compute.
              </p>
            </div>
            <div class="bg-[#0F1626]/80 border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-emerald-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">mark_email_read</span>
                Envelope Encryption = Safe + Locked Key Envelope
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Lock a 100GB database backup with a fast random symmetric key (DEK). Put that 32-byte key into an envelope and lock it using a cloud master key (AWS KMS KEK). Zero network bottlenecks!
              </p>
            </div>
          </div>
        </div>

        <!-- Overview Text Grid -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">Symmetric (AES-256 / ChaCha20)</span>
                <span class="text-[10px] font-code bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">1 Shared Key</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Uses the same secret key to encrypt and decrypt. Highly parallelizable and hardware-accelerated via dedicated CPU instruction sets (AES-NI), achieving throughputs over <strong>5+ GB/sec per core</strong>. Primary challenge: securely sharing the key.
              </p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">Asymmetric (RSA / ECC / Ed25519)</span>
                <span class="text-[10px] font-code bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Public / Private Pair</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Uses mathematically linked public and private keys. Public key can be freely broadcast; private key never leaves the owner. Solves key distribution, but is <strong>1,000x computationally slower</strong> than symmetric ciphers.
              </p>
            </div>
          </div>
        </div>

        <!-- ASCII Architecture / Hybrid & Envelope Encryption Flow -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              ARCHITECTURAL PATTERN: CLOUD KMS ENVELOPE ENCRYPTION
            </span>
            <span class="text-slate-500 text-[10.5px]">Two-Tier Key Hierarchy</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-2 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ENVELOPE ENCRYPTION WORKFLOW (AWS KMS / HASHICORP VAULT / GCP CLOUD KMS)               │
│                                                                                        │
│  Step 1: Application requests Data Key from Cloud HSM                                  │
│                                                                                        │
│     [App Service] ───GenerateDataKey(KeyId="kms-master-kek")───► [Cloud HSM / KMS]    │
│            ▲                                                            │              │
│            │  Returns:                                                  │              │
│            │  1. Plaintext DEK (Data Encryption Key: 32 bytes)          │              │
│            └─ 2. Encrypted DEK (Encrypted under HSM Master Key) ◄───────┘              │
│                                                                                        │
│  Step 2: Local High-Throughput Encryption                                              │
│                                                                                        │
│     Plaintext Multi-GB Data ──► [AES-256-GCM Engine] ──► Ciphertext Payload            │
│                                           ▲                                            │
│                                           │ (Uses Plaintext DEK in RAM)                │
│                                                                                        │
│  Step 3: Secure Destruction of Plaintext DEK                                           │
│                                                                                        │
│     [App Service] ──► Wipe Plaintext DEK from RAM memory immediately!                  │
│                                                                                        │
│  Step 4: Storage at Rest (Disk / Database / S3 Bucket)                                 │
│                                                                                        │
│     ┌───────────────────────────────────────────────────────────────────────┐          │
│     │ STORED OBJECT IN S3 / POSTGRESQL:                                     │          │
│     │  • Header: 96-bit Random Nonce/IV                                     │          │
│     │  • Key Envelope: Encrypted DEK (Ciphertext, 32+ bytes)                │          │
│     │  • Body: Ciphertext Payload                                           │          │
│     │  • Trailer: 128-bit GCM Authentication Tag (Guarantees Integrity)     │          │
│     └───────────────────────────────────────────────────────────────────────┘          │
│                                                                                        │
│  Why this wins: KMS never sees your bulk data; zero network bottleneck; HSM security!  │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Comparison Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              CRYPTOGRAPHIC ALGORITHM BENCHMARKS &amp; PROPERTIES
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse text-[12px] font-sans">
              <thead>
                <tr class="bg-[#162032] text-slate-300 font-code text-[11px] border-b border-[#24314A]">
                  <th class="p-3.5 font-semibold text-white">Algorithm</th>
                  <th class="p-3.5 font-semibold text-slate-300">Category</th>
                  <th class="p-3.5 font-semibold text-slate-300">Key Size</th>
                  <th class="p-3.5 font-semibold text-slate-300">Security Equivalence</th>
                  <th class="p-3.5 font-semibold text-slate-300">Speed / Throughput</th>
                  <th class="p-3.5 font-semibold text-indigo-300">Primary System Design Use Case</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0F172A]">
                ${cryptoComparisonRows.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#111B2E]/50' : 'bg-transparent'} hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-code text-white font-semibold whitespace-nowrap">${row.algorithm}</td>
                    <td class="p-3.5 text-slate-300">${row.category}</td>
                    <td class="p-3.5 font-code text-cyan-300">${row.keySize}</td>
                    <td class="p-3.5 text-slate-300">${row.securityEquiv}</td>
                    <td class="p-3.5 text-slate-300 text-[11.5px]">${row.speed}</td>
                    <td class="p-3.5 text-slate-300">${row.bestUse}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              STAFF PERSPECTIVE: ZERO-DOWNTIME KEY ROTATION WITHOUT RE-ENCRYPTING PETABYTES
            </span>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, when asked <em>"How do you rotate your master encryption key when storing 500 Terabytes of encrypted customer data?"</em>, naive candidates answer: <em class="text-white">"Download all 500TB, decrypt it, re-encrypt it with the new key, and write it back."</em> This causes days of database downtime and massive cloud egress costs.
          </p>
          <div class="text-[12.5px] text-emerald-200/90 bg-[#081713] p-3 rounded-lg border border-[#10B981]/25 leading-relaxed">
            <strong class="text-white">The Envelope Encryption Solution:</strong> Your bulk data remains encrypted with its unique Data Encryption Key (DEK). To rotate keys, KMS only decrypts the <strong>32-byte encrypted DEK header</strong> using Master Key v1 and re-encrypts it using Master Key v2. You rotate 500 Terabytes of encrypted data in seconds with zero downtime and zero bulk data reads!
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px] font-sans">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            What is Perfect Forward Secrecy (PFS) and why did TLS 1.3 completely remove RSA key exchange?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#818CF8] text-[18px]">quiz</span>
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS &amp; STAFF PROBES
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-1.5 pb-3 border-b border-[#24314A]/50 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[13.5px] font-bold text-white">${item.question}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-5 flex flex-col gap-2 shadow-lg shadow-indigo-950/40 font-sans">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[13.5px] font-medium text-white leading-relaxed">
            Use symmetric AES-256-GCM for high-throughput bulk data encryption; use asymmetric ECC (ECDSA / Ed25519) for TLS handshakes, signatures, and key exchange. In production architectures, implement <strong>Envelope Encryption</strong> with AWS KMS to protect multi-terabyte datastores without bottlenecking cloud network interfaces and to enable instantaneous zero-downtime key rotation.
          </p>
        </div>

        <!-- Page 46 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Pages 44–46 · Section 8.7</span>
        </div>

      </div>

    </div>
  `;
}
