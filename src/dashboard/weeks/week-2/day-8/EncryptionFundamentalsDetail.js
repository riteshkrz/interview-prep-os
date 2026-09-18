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
      speed: "Gigabytes/sec (Hardware AES-NI)",
      bestUse: "Bulk data at rest, disk/S3 encryption, TLS 1.3 data channel"
    },
    {
      algorithm: "ChaCha20-Poly1305",
      category: "Symmetric (Stream Cipher / AEAD)",
      keySize: "256 bits",
      securityEquiv: "256 bits",
      speed: "High speed on mobile/ARM (No hardware acceleration needed)",
      bestUse: "Mobile clients, IoT devices, WireGuard VPN protocols"
    },
    {
      algorithm: "RSA 2048 / 4096",
      category: "Asymmetric (Factoring Primes)",
      keySize: "2048–4096 bits",
      securityEquiv: "112–128 bits",
      speed: "Slow (Heavy modular exponentiation)",
      bestUse: "Legacy TLS certificates, enterprise PKI, document signing"
    },
    {
      algorithm: "ECDSA (secp256r1)",
      category: "Asymmetric (Elliptic Curve Discrete Log)",
      keySize: "256 bits",
      securityEquiv: "128 bits (Equivalent to RSA-3072)",
      speed: "Fast (10x faster signature generation than RSA)",
      bestUse: "Modern TLS 1.3 certificates, JWT signatures, Apple/Android Secure Enclave"
    },
    {
      algorithm: "Ed25519 / X25519",
      category: "Asymmetric (Twisted Edwards Curve)",
      keySize: "256 bits",
      securityEquiv: "128 bits",
      speed: "Ultra-fast, constant-time (side-channel immune)",
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
        <li><strong>Mobile & Battery Friendly:</strong> Tiny cryptographic footprints minimize battery drain on mobile and IoT devices.</li>
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
              3.5 Symmetric vs. Asymmetric Encryption: AES vs. RSA vs. ECC
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Distributed system security relies on two complementary cryptographic primitives: <strong class="text-indigo-400">Symmetric Encryption</strong> (blazing-fast data protection with a single shared key) and <strong class="text-cyan-400">Asymmetric Encryption</strong> (key pairs that solve identity verification and key distribution over untrusted networks). Modern architectures combine both into <strong class="text-white">Hybrid Cryptosystems</strong>.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
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
              CRYPTOGRAPHIC ALGORITHM BENCHMARKS & PROPERTIES
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
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: ENVELOPE ENCRYPTION SAVES CLOUD SCALE
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, amateur candidates say: <em class="text-white">"We will send each uploaded 500MB video file to AWS KMS to be encrypted before saving it to S3."</em> This immediately flags a lack of production experience. AWS KMS has a strict 4 KB payload limit and charges per request; sending streaming files over the wire to an HSM introduces catastrophic latency and multi-thousand dollar AWS bills.
          </p>
          <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-[12.5px] font-sans text-emerald-200/90 leading-relaxed">
            <strong class="text-white">The Senior Pattern:</strong> Always pitch <strong>Envelope Encryption</strong>. The master key never leaves the secure boundaries of the HSM. The application requests a temporary 256-bit Data Encryption Key (DEK), encrypts the gigabyte-scale data locally in RAM using hardware-accelerated <strong>AES-256-GCM</strong>, wipes the plaintext DEK, and stores the encrypted DEK alongside the ciphertext.
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: THE ECB PENGUIN & NON-AEAD MODES
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Never use AES in <strong>Electronic Codebook (ECB)</strong> mode. ECB encrypts identical 16-byte blocks into identical ciphertext blocks, preserving structural patterns (the infamous "ECB Penguin" where an image's silhouette remains fully visible after encryption). Furthermore, never use unauthenticated cipher modes like <strong>AES-CBC</strong> without an HMAC, which exposes systems to devastating <strong>Padding Oracle Attacks</strong> (e.g. POODLE).
          </p>
          <div class="font-sans text-[12.5px] text-amber-200/90 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20">
            <strong class="text-amber-100">The Mandatory Standard:</strong> Always mandate <strong>AEAD (Authenticated Encryption with Associated Data)</strong>, specifically <strong>AES-GCM</strong> or <strong>ChaCha20-Poly1305</strong>. AEAD simultaneously guarantees confidentiality (encryption) and tamper-proof authenticity (128-bit authentication tag).
          </div>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU
          </span>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            You are designing an end-to-end encrypted (E2EE) chat application like Signal for 500 million active users. How do you handle group chats with 1,000 members where members frequently go offline, without having the sender encrypt and upload 1,000 separate message ciphertexts for every single message sent?
          </p>
        </div>

        <!-- Interview Follow-ups: Q1 - Q4 -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#818CF8] text-[18px]">quiz</span>
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-1.5 pb-3 border-b border-[#24314A]/50 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[13.5px] font-bold text-white font-sans">${item.question}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
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
            Symmetric encryption (AES-256-GCM) secures bulk data at rest and high-throughput network channels with hardware acceleration; asymmetric encryption (ECC / RSA) solves key exchange and digital identity. In system design, always propose a Hybrid Cryptosystem (TLS 1.3) for data in transit and KMS Envelope Encryption (KEK + DEK) for data at rest, strictly using AEAD modes.
          </p>
        </div>

        <!-- Page 46 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 46</span>
        </div>

      </div>

    </div>
  `;
}
