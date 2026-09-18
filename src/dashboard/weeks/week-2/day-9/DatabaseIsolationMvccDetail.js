/**
 * 4.2 Database Isolation Levels and MVCC - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 48, 49, and 50
 * from The Modern System Design Interview Guide.
 */

export function renderDatabaseIsolationMvccContent(topic) {
  const isolationLevels = [
    {
      level: "Read Uncommitted",
      dirtyRead: "Allowed",
      dirtyReadClass: "text-rose-400 font-bold",
      nonRepeatable: "Allowed",
      nonRepeatableClass: "text-rose-400",
      phantom: "Allowed",
      phantomClass: "text-rose-400",
      writeSkew: "Allowed",
      writeSkewClass: "text-rose-400",
      implementation: "Raw reads without shared locks. Never use in production financial or ecommerce systems."
    },
    {
      level: "Read Committed",
      dirtyRead: "Prevented",
      dirtyReadClass: "text-emerald-400 font-semibold",
      nonRepeatable: "Allowed",
      nonRepeatableClass: "text-rose-400 font-bold",
      phantom: "Allowed",
      phantomClass: "text-rose-400",
      writeSkew: "Allowed",
      writeSkewClass: "text-rose-400",
      implementation: "Each statement reads its own fresh snapshot. Default for PostgreSQL, Oracle, and SQL Server."
    },
    {
      level: "Repeatable Read",
      dirtyRead: "Prevented",
      dirtyReadClass: "text-emerald-400 font-semibold",
      nonRepeatable: "Prevented",
      nonRepeatableClass: "text-emerald-400 font-semibold",
      phantom: "Prevented*",
      phantomClass: "text-emerald-400 font-semibold",
      writeSkew: "Allowed",
      writeSkewClass: "text-rose-400 font-bold",
      implementation: "Snapshot taken once at transaction start (Snapshot Isolation). Default for MySQL InnoDB. (*MVCC blocks phantoms)."
    },
    {
      level: "Serializable",
      dirtyRead: "Prevented",
      dirtyReadClass: "text-emerald-400 font-bold",
      nonRepeatable: "Prevented",
      nonRepeatableClass: "text-emerald-400 font-bold",
      phantom: "Prevented",
      phantomClass: "text-emerald-400 font-bold",
      writeSkew: "Prevented",
      writeSkewClass: "text-emerald-400 font-bold",
      implementation: "Strict serial execution order guaranteed via 2-Phase Locking (2PL) or Serializable Snapshot Isolation (SSI)."
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is Write Skew and why does standard Snapshot Isolation (Repeatable Read) fail to prevent it?",
      answer: `<strong>Write Skew</strong> occurs when two concurrent transactions read overlapping datasets, make decisions based on what they observed, and update <em>disjoint rows</em> such that the resulting combined state violates a global business constraint.
      <br/><br/>
      <strong class="text-indigo-400">The Canonical Example (Two On-Call Doctors):</strong>
      Hospital policy requires at least one doctor on call. Doctors Alice and Bob are both on call. Both simultaneously request to go off-call.
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Txn 1 (Alice): <code>SELECT count(*) FROM doctors WHERE on_call = true;</code> (returns 2) $\to$ proceeds $\to$ <code>UPDATE doctors SET on_call = false WHERE name = 'Alice';</code></li>
        <li>Txn 2 (Bob): <code>SELECT count(*) FROM doctors WHERE on_call = true;</code> (returns 2) $\to$ proceeds $\to$ <code>UPDATE doctors SET on_call = false WHERE name = 'Bob';</code></li>
      </ul>
      Because Alice updated row A and Bob updated row B, there is <strong>zero lock conflict</strong>. Under Snapshot Isolation, both transactions commit successfully, leaving <strong>zero doctors on duty</strong>! Snapshot isolation only detects write-write conflicts on the <em>exact same row</em>; it cannot detect write skew across disjoint rows.`
    },
    {
      qNum: "Q2",
      question: "How does Multi-Version Concurrency Control (MVCC) work mechanically under the hood in PostgreSQL vs. MySQL InnoDB?",
      answer: `While both engines implement MVCC to ensure <em>readers never block writers and writers never block readers</em>, their physical storage architectures are polar opposites:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>MySQL InnoDB (Undo Log Chains):</strong> Updates modify the table page <em>in place</em>. The previous version of the row is written to an <strong>Undo Log segment</strong> in memory/disk. Older snapshots traverse a linked list of undo log pointers (<code>roll_pointer</code>) backward in time. When transactions commit, background purge threads truncate the undo log.</li>
        <li><strong>PostgreSQL (Append-Only Tuples + VACUUM):</strong> PostgreSQL never updates rows in place. Every <code>UPDATE</code> inserts an entirely new row version (tuple) into the heap table with header metadata: <code>xmin</code> (creation txn ID) and <code>xmax</code> (deletion/replacement txn ID). Old dead tuples remain in the table file until cleaned up asynchronously by the <strong>VACUUM daemon</strong>.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is PostgreSQL Transaction ID (txid) Wraparound and why is it considered an emergency existential event for DBA teams?",
      answer: `PostgreSQL uses a 32-bit unsigned integer for transaction IDs, allowing roughly <strong>4.29 billion transactions</strong>. Because numbers wrap around modulo $2^{32}$, a transaction ID from today would appear to be in the "future" relative to a transaction from 2.1 billion commits ago, making old committed data suddenly invisible!
      <br/><br/>
      To prevent this, PostgreSQL relies on <code>VACUUM FREEZE</code> to convert older transaction IDs into a special frozen ID (<code>FrozenTransactionId = 2</code>), indicating "committed in the deep past". If autovacuum cannot keep up (due to heavy write traffic or long-running transactions holding the horizon open) and the database approaches 2 billion unfrozen transactions, PostgreSQL will <strong>force an immediate emergency read-only shutdown</strong>, rejecting all write traffic until a manual single-user vacuum completes.`
    },
    {
      qNum: "Q4",
      question: "When should an enterprise system actually use SERIALIZABLE isolation in production, and what is the throughput tradeoff?",
      answer: `Use <strong>SERIALIZABLE</strong> when:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>Complex multi-row invariants cannot be enforced by database foreign keys or check constraints (e.g. financial ledgers, double-entry balance transfers, medical dosing rules).</li>
        <li>The developer team cannot guarantee that every query correctly uses explicit <code>SELECT ... FOR UPDATE</code> locks.</li>
      </ul>
      <strong class="text-rose-400">The Tradeoff:</strong> In traditional engines using 2-Phase Locking (2PL), Serializable uses heavy shared and exclusive range locks that collapse concurrency and cause frequent deadlocks. In modern PostgreSQL using <strong>Serializable Snapshot Isolation (SSI)</strong>, transactions don't lock; instead, the engine tracks read-write conflict dependencies (SIREAD locks in RAM) and <em>aborts one of the transactions</em> with a serialization failure (SQLSTATE 40001) if a cycle is detected. Your application must implement robust retry loops with exponential jitter.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 48, 49, 50: DATABASE ISOLATION LEVELS & MVCC -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.2 Database Isolation Levels and MVCC
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            In relational database systems, <strong>Isolation</strong> (the 'I' in ACID) defines the degree to which concurrent transactions observe each other's uncommitted or newly committed mutations. Database engines treat isolation as a tunable continuum: higher isolation prevents costly data anomalies but increases locking contention, transaction aborts, and latency.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-rose-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-rose-300 uppercase">1. Dirty Read</span>
              <span class="text-[12px] text-slate-300">Txn A reads a row modified by Txn B before Txn B commits. If B rolls back, A acted on invalid data.</span>
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">2. Non-Repeatable Read</span>
              <span class="text-[12px] text-slate-300">Txn A reads a row twice; Txn B updates and commits that row in between. Txn A sees two different values.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">3. Phantom Read</span>
              <span class="text-[12px] text-slate-300">Txn A queries a range; Txn B inserts new rows matching the range and commits. Re-query returns "phantom" rows.</span>
            </div>
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">4. Serialization / Skew</span>
              <span class="text-[12px] text-slate-300">Two transactions read overlapping premises, update disjoint rows, and commit an invalid global state.</span>
            </div>
          </div>
        </div>

        <!-- ANSI Isolation Levels Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ANSI SQL-92 ISOLATION LEVELS & PHENOMENA MATRIX
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse text-[12px] font-sans">
              <thead>
                <tr class="bg-[#162032] text-slate-300 font-code text-[11px] border-b border-[#24314A]">
                  <th class="p-3.5 font-semibold text-white">Isolation Level</th>
                  <th class="p-3.5 font-semibold text-slate-300">Dirty Read</th>
                  <th class="p-3.5 font-semibold text-slate-300">Non-Repeatable</th>
                  <th class="p-3.5 font-semibold text-slate-300">Phantom Read</th>
                  <th class="p-3.5 font-semibold text-slate-300">Write Skew</th>
                  <th class="p-3.5 font-semibold text-indigo-300">Underlying Engine Mechanism</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0F172A]">
                ${isolationLevels.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#111B2E]/50' : 'bg-transparent'} hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-code text-white font-semibold whitespace-nowrap">${row.level}</td>
                    <td class="p-3.5 font-code ${row.dirtyReadClass}">${row.dirtyRead}</td>
                    <td class="p-3.5 font-code ${row.nonRepeatableClass}">${row.nonRepeatable}</td>
                    <td class="p-3.5 font-code ${row.phantomClass}">${row.phantom}</td>
                    <td class="p-3.5 font-code ${row.writeSkewClass}">${row.writeSkew}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed text-[11.5px]">${row.implementation}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ASCII Architecture / MVCC Mechanics -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              MVCC MECHANICS: READ VIEWS & UNDO LOG VERSION CHAINS
            </span>
            <span class="text-slate-500 text-[10.5px]">Readers Never Block Writers</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ MULTI-VERSION CONCURRENCY CONTROL (MVCC) SNAPSHOT ISOLATION                            │
│                                                                                        │
│  Row in Primary Table (Clustered Index):                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ id = 42 | balance = 300 | DB_TRX_ID = 205 (Txn C) | DB_ROLL_PTR = 0x8A12F000    │  │
│  └──────────────────────────────────────────────────────────────┬───────────────────┘  │
│                                                                 │                      │
│     Points backward to historical version chain in Undo Log     ▼                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Undo Log Record 1: balance = 200 | DB_TRX_ID = 202 (Txn B) | DB_ROLL_PTR = 0x8A01 │  │
│  └──────────────────────────────────────────────────────────────┬───────────────────┘  │
│                                                                 │                      │
│     Points backward to initial baseline                         ▼                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Undo Log Record 2: balance = 100 | DB_TRX_ID = 199 (Txn A) | DB_ROLL_PTR = NULL   │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  CONCURRENT READ VIEW EVALUATION:                                                      │
│                                                                                        │
│  • Txn 200 starts (Read View created: max committed txn was 199):                      │
│    Reads Clustered Row (trx_id=205 > 199) ──► Skips (uncommitted/future!)              │
│    Traverses roll_ptr to Undo Record 1 (trx_id=202 > 199) ──► Skips!                   │
│    Traverses roll_ptr to Undo Record 2 (trx_id=199 <= 199) ──► MATCH! Reads $100.      │
│                                                                                        │
│  • Result: Txn C writes $300 while Txn 200 reads $100 simultaneously with ZERO locks!  │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: THE WRITE SKEW TRAP & PREVENTING IT
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, engineers often claim: <em class="text-white">"We set our database to Repeatable Read (Snapshot Isolation), so all concurrency anomalies are eliminated."</em> This is technically false. Snapshot Isolation prevents Dirty Reads, Non-Repeatable Reads, and Phantoms, but is completely vulnerable to <strong>Write Skew</strong>.
          </p>
          <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-[12.5px] font-sans text-emerald-200/90 leading-relaxed">
            <strong class="text-white">How Seniors Prevent Write Skew in Production:</strong>
            <ol class="list-decimal list-inside mt-1 space-y-1 text-slate-300">
              <li><strong>Explicit Locking (SELECT ... FOR UPDATE):</strong> Turn the read into a write lock on the evaluated rows, serializing conflicting transactions.</li>
              <li><strong>Materialized Conflict Locks:</strong> Create a dummy table representing the constraint (e.g. <code>hospital_shifts</code>) and lock the parent row before evaluating children.</li>
              <li><strong>Serializable Snapshot Isolation (SSI):</strong> Use PostgreSQL's <code>SERIALIZABLE</code> isolation level, which tracks SIREAD conflict cycles in memory with negligible lock overhead and aborts with a retry error.</li>
            </ol>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: LONG-RUNNING TRANSACTIONS & UNDO / TABLE BLOAT
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Never permit analytics queries or interactive developer shells to hold open database transactions for hours. In an MVCC database, the oldest active transaction pins the <strong>horizon of visible snapshots</strong>:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-sans pt-1">
            <div class="bg-[#190E03] border border-[#F59E0B]/20 p-2.5 rounded-lg text-slate-300">
              <strong class="text-amber-200 block pb-0.5">MySQL InnoDB:</strong> The Undo Log cannot purge historical records. The <code>ibdata1</code> tablespace swells by tens of gigabytes, consuming disk space and degrading read latency.
            </div>
            <div class="bg-[#190E03] border border-[#F59E0B]/20 p-2.5 rounded-lg text-slate-300">
              <strong class="text-amber-200 block pb-0.5">PostgreSQL:</strong> <code>VACUUM</code> cannot reclaim dead row versions. Tables and indexes bloat 10x in size, and approaching 2 billion transactions triggers an emergency read-only freeze.
            </div>
          </div>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU
          </span>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            You are designing the ticketing checkout for a Taylor Swift concert. 50,000 concurrent users are attempting to purchase 5,000 seats. If the database runs on default Read Committed, what race condition occurs, and how do you prevent overselling while maintaining 20,000 checkouts/second?
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
            Isolation levels represent a continuous tradeoff between concurrency throughput and anomaly prevention. Know your engine defaults (MySQL: Repeatable Read, Postgres: Read Committed). Explain MVCC using undo log roll-pointers or append-only xmin/xmax tuples. Always cite Write Skew as the exact boundary where Snapshot Isolation fails, and mention undo/vacuum bloat as the operational cost of long-running transactions.
          </p>
        </div>

        <!-- Page 50 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 50</span>
        </div>

      </div>

    </div>
  `;
}
