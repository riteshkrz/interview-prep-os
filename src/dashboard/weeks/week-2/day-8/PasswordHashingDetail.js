/**
 * 3.2 How to Store Passwords Safely in a Database - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 38, 39, and 40
 * from The Modern System Design Interview Guide.
 */

export function renderPasswordHashingContent(topic) {
  const hashComparisonRows = [
    {
      algorithm: "Plain SHA-256",
      type: "Fast cryptographic hash (SHA-2 family)",
      memoryHard: "No (0 KB)",
      gpuSpeed: "30+ Billion hashes/sec",
      status: "Forbidden / Broken for passwords",
      statusClass: "text-rose-400 font-bold"
    },
    {
      algorithm: "PBKDF2",
      type: "Iterative key derivation (HMAC passes)",
      memoryHard: "No (0 KB)",
      gpuSpeed: "Millions/sec (Vulnerable to GPU parallelism)",
      status: "Legacy / NIST compliant minimum",
      statusClass: "text-amber-300"
    },
    {
      algorithm: "bcrypt",
      type: "Eksblowfish cipher algorithm",
      memoryHard: "Modest (~4 KB)",
      gpuSpeed: "Tens of thousands/sec",
      status: "Recommended (Battle-tested standard)",
      statusClass: "text-cyan-300 font-semibold"
    },
    {
      algorithm: "scrypt",
      type: "Memory-hard sequential memory KDF",
      memoryHard: "Yes (Configurable 16–64 MB)",
      gpuSpeed: "Thousands/sec",
      status: "Recommended",
      statusClass: "text-cyan-300"
    },
    {
      algorithm: "Argon2id",
      type: "Hybrid memory-hard (Password Hashing Competition Winner)",
      memoryHard: "Yes (Configurable 64+ MB RAM)",
      gpuSpeed: "Hundreds/sec (ASIC/GPU immune)",
      status: "Gold Standard (OWASP #1 Recommended)",
      statusClass: "text-emerald-400 font-bold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is a 'Pepper' and where MUST it be stored to provide genuine security?",
      answer: `A <strong>Salt</strong> is unique per user and stored directly in the database row alongside the hash to defeat precomputed Rainbow Tables. A <strong>Pepper</strong> is an application-wide secret cryptographic key mixed into the password before hashing. 
      <br/><br/>
      <em>Critical Architectural Rule:</em> The Pepper must <strong>NEVER be stored inside the database</strong>. It must reside in a dedicated Hardware Security Module (HSM), AWS KMS, or HashiCorp Vault. If an attacker dumps the entire relational database via SQL injection, they still cannot crack the hashes because they lack the external Pepper.`
    },
    {
      qNum: "Q2",
      question: "Why is a constant-time comparison (crypto.timingSafeEqual) mandatory when verifying hashes?",
      answer: `Standard string equality operators (e.g. <code>hashA === hashB</code>) evaluate characters sequentially and terminate on the <em>first mismatched character</em> (early exit).
      <br/><br/>
      An attacker sending thousands of requests over a low-jitter network can measure microsecond CPU timing discrepancies to deduce matching characters one byte at a time (a <strong>Timing Side-Channel Attack</strong>). 
      <br/><br/>
      <code>crypto.timingSafeEqual()</code> evaluates all characters in strictly identical clock cycles regardless of how many characters match, completely neutralizing timing attacks.`
    },
    {
      qNum: "Q3",
      question: "How do you migrate millions of users from a legacy hash (e.g. MD5 or SHA-256) to Argon2id without forcing a password reset?",
      answer: `Use <strong>Lazy Re-hashing on Successful Login</strong>: 
      <br/><br/>
      1. Add an <code>algorithm</code> version column in your database (e.g., <code>algo = "sha256"</code>).
      <br/>
      2. When a user submits their login credentials, verify their plaintext password against the old algorithm.
      <br/>
      3. If authentication succeeds, immediately compute a modern <strong>Argon2id</strong> hash from the user's plaintext password in memory, update the database row with the new hash, and set <code>algo = "argon2id"</code>.
      <br/>
      4. Over 30 to 60 days, 80%+ of active users are upgraded seamlessly with zero user disruption. Remaining inactive accounts can be prompted to reset upon their next login.`
    },
    {
      qNum: "Q4",
      question: "Why does adding a random salt fail to protect passwords against modern GPU brute-force attacks?",
      answer: `A salt guarantees uniqueness so two users with the exact same password (<code>"Password123!"</code>) produce completely different hashes, which 100% defeats <strong>precomputed Rainbow Table lookups</strong>.
      <br/><br/>
      However, a salt does <em>nothing</em> to slow down a brute-force attack on an individual compromised account! Because modern GPUs (like an NVIDIA RTX 4090) compute billions of SHA-256 hashes per second, an attacker can brute-force a salted 8-character password in minutes. Only <strong>deliberate computational slowness (Work Factor)</strong> and <strong>Memory-Hardness (Argon2id)</strong> defeat GPU parallelism.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 38, 39, 40: PASSWORD HASHING -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              8.5 How to Store Passwords Safely in a Database
            </h2>
          </div>
          <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed pl-4">
            Passwords must never be stored in plaintext or using fast general-purpose cryptographic hashes like MD5, SHA-1, or SHA-256. Securing user credentials against database leaks and hardware-accelerated GPU cracking requires a layered defense built on deliberate slowness, salt, and memory-hardness.
          </p>
        </div>

        <!-- Everyday Mental Models Banner -->
        <div class="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-slate-900 border border-blue-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-cyan-400">psychology</span>
            <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider">
              Everyday Mental Model: Fast Scanner vs. Heavy Bank Vault
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
            <div class="bg-[#0F1626]/80 border border-rose-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <strong class="text-rose-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">flash_on</span>
                Fast Hash (SHA-256) = High-Speed Barcode Scanner
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Designed to verify gigabyte file downloads in milliseconds. But for passwords, this speed is suicidal: an attacker's $1,600 consumer GPU can scan 30 billion password guesses per second!
              </p>
            </div>
            <div class="bg-[#0F1626]/80 border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <strong class="text-emerald-300 font-code text-[11.5px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">lock_clock</span>
                Slow Hash (Argon2id) = Heavy Vault Time-Lock
              </strong>
              <p class="text-slate-300 leading-relaxed">
                Engineered to be deliberately slow (~250ms) and demand 64MB of physical RAM per attempt. A GPU with 24GB of RAM can only run a tiny handful of attempts in parallel, completely neutralizing hardware brute-forcing.
              </p>
            </div>
          </div>
        </div>

        <!-- 4 Defensive Pillars -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
          <div class="bg-[#0F1626] border border-blue-500/30 rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] font-bold text-blue-300 uppercase">1. Cryptographic Salt</span>
            <p class="text-[12px] text-slate-300 leading-relaxed">16+ random bytes from a CSPRNG unique to every user. Defeats precomputed Rainbow Table lookup dictionaries.</p>
          </div>

          <div class="bg-[#0F1626] border border-cyan-500/30 rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. Work Factor (Cost)</span>
            <p class="text-[12px] text-slate-300 leading-relaxed">Tunable iteration count forcing deliberate CPU slowness (~250ms per check), making offline brute-forcing impractical.</p>
          </div>

          <div class="bg-[#0F1626] border border-emerald-500/30 rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">3. Memory-Hardness</span>
            <p class="text-[12px] text-slate-300 leading-relaxed">Forces large RAM allocations (64MB+) per evaluation. Stops massive parallel cracking on ASICs and GPU clusters.</p>
          </div>

          <div class="bg-[#0F1626] border border-indigo-500/30 rounded-xl p-3.5 flex flex-col gap-1">
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">4. Secret Pepper</span>
            <p class="text-[12px] text-slate-300 leading-relaxed">Secret key stored outside the database in AWS KMS / HSM. Protects credentials even if the full database dump is stolen.</p>
          </div>
        </div>

        <!-- STORAGE FORMAT & VERIFICATION FLOW -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              MODERN MODULAR CRYPT HASH FORMAT (ARGON2ID)
            </span>
            <span class="text-[11px] font-code text-slate-500">Self-Describing Modular Format</span>
          </div>

          <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono bg-[#0F1626] p-4 rounded-xl border border-slate-700/50">
$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$qU8xG3...9Kz
  ▲       ▲    ▲       ▲   ▲   ▲           ▲
  │       │    │       │   │   │           └─ Final 256-bit Cryptographic Hash (Base64)
  │       │    │       │   │   └─ Unique CSPRNG Salt (Base64 encoded)
  │       │    │       │   └─ Parallelism Lanes (p=4 threads)
  │       │    │       └─ Time Iterations (t=3 passes)
  │       │    └─ Memory Cost (m=65536 KB = 64 MB RAM per hash)
  │       └─ Algorithm Version (v=19)
  └─ Algorithm Identifier (Argon2id hybrid mode)
          </div>

          <div class="flex items-center justify-between text-[11px] font-code text-cyan-300 pt-1 font-sans">
            <span>▲ All cryptographic parameters are embedded directly into the hash string</span>
            <span class="text-slate-500">Allows parameter upgrades over time without database schema migrations</span>
          </div>
        </div>

        <!-- ALGORITHM COMPARISON TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            PASSWORD HASHING ALGORITHMS &amp; HARDWARE CRACKING RESISTANCE
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3 w-36">Algorithm</th>
                  <th class="p-3 w-56">Category / Type</th>
                  <th class="p-3 w-36">Memory-Hard</th>
                  <th class="p-3">GPU Cracking Throughput</th>
                  <th class="p-3 w-52">Industry Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${hashComparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white font-code text-[11.5px]">${row.algorithm}</td>
                    <td class="p-3 text-slate-300">${row.type}</td>
                    <td class="p-3 font-code text-slate-300">${row.memoryHard}</td>
                    <td class="p-3 text-slate-400">${row.gpuSpeed}</td>
                    <td class="p-3 font-code text-[11.5px] ${row.statusClass}">${row.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The Fast Hash Trap -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2 font-sans">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE "FAST HASH" TRAP: WHY SHA-256 IS FATAL FOR PASSWORDS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            Cryptographic hash functions like <strong>SHA-256</strong> were engineered for high-throughput data integrity: verifying gigabyte disk images and TLS network packets in microseconds. This speed is catastrophic for passwords: a single $1,600 consumer GPU (NVIDIA RTX 4090) calculates over <strong>30 billion SHA-256 hashes per second</strong> using Hashcat. Salting only prevents precomputed rainbow tables—it does <em>nothing</em> to slow down a GPU testing billions of combinations against a single salted hash. Never use SHA-256 for passwords.
          </p>
        </div>

        <!-- Green Callout: Senior Perspective - Capacity Math -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2 font-sans">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            STAFF PERSPECTIVE: CALCULATING CPU WORK FACTOR VS. AUTH QPS CAPACITY
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, connect cryptographic security directly to server capacity planning. If you configure bcrypt (cost 12) or Argon2id to take <strong>250 ms per verification</strong>, each CPU core can only process $1 / 0.25 = 4$ logins per second. If your authentication service experiences a morning peak of <strong>100 login requests/sec</strong>, you require:
          </p>
          <div class="bg-[#0F1626]/80 p-3 rounded-lg border border-emerald-500/20 font-mono text-[12px] text-emerald-300">
            Dedicated Auth CPU Cores = 100 logins/sec × 0.25 sec = 25 CPU Cores purely dedicated to hashing!
          </div>
          <p class="text-[12px] text-slate-400">
            Always isolate password verification on dedicated authentication worker pools to prevent login spikes from starving main application API threads.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px] font-sans">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            How do you migrate millions of existing users from legacy MD5/SHA-256 to Argon2id without forcing a password reset?
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
            Salting prevents precomputed rainbow tables; deliberate computational slowness and memory-hardness prevent GPU brute-force cracking. Use Argon2id as your gold standard, store an external Pepper in AWS KMS, verify hashes using constant-time string comparisons, and calculate dedicated CPU core capacity for peak login QPS.
          </p>
        </div>

        <!-- Page 40 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Pages 38–40 · Section 8.5</span>
        </div>

      </div>

    </div>
  `;
}
