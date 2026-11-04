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
      implementation: "Raw reads without shared locks. Fastest speed, zero isolation. Dangerous for production systems."
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
      implementation: "Every individual SQL statement takes a fresh snapshot. Default in PostgreSQL, Oracle, and SQL Server."
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
      implementation: "One single snapshot created at transaction start (Snapshot Isolation). Default for MySQL InnoDB. (*MVCC blocks phantoms)."
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
      implementation: "Guarantees transactions behave as if executed strictly one after another. Uses 2-Phase Locking or SSI conflict tracking."
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is Write Skew and why does standard Snapshot Isolation (Repeatable Read) fail to catch it?",
      answer: `<strong>Write Skew</strong> occurs when two concurrent transactions read the same data, make separate business decisions based on that data, and write to <em>different rows</em>—resulting in a combined state that violates a critical business rule.
      <br/><br/>
      <strong class="text-indigo-400">The Everyday Example: Two On-Call Hospital Doctors</strong>
      <p class="text-slate-300 mt-1">
        Hospital policy states: <em>"At least one doctor must be actively on call at all times."</em> Doctors Alice and Bob are both on call. Simultaneously, both feel sick and tap "Request Leave" on their phones:
      </p>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Doctor Alice's Transaction:</strong> Reads the system: <code>SELECT count(*) FROM on_call_doctors;</code> &rarr; sees <strong>2</strong>. Because $2 \ge 2$, it is safe for her to leave. She updates her row: <code>UPDATE doctors SET on_call = false WHERE name = 'Alice';</code></li>
        <li><strong>Doctor Bob's Transaction:</strong> Reads the system concurrently: <code>SELECT count(*) FROM on_call_doctors;</code> &rarr; also sees <strong>2</strong>! Because $2 \ge 2$, it is also safe for him to leave. He updates his row: <code>UPDATE doctors SET on_call = false WHERE name = 'Bob';</code></li>
      </ul>
      <strong class="text-rose-400">The Problem:</strong> Alice modified Alice's row. Bob modified Bob's row. Under standard Snapshot Isolation, row-level write locks <em>never conflict</em>! Both transactions commit without errors. Result: <strong>0 doctors on duty</strong>, breaking the hospital rule!
      <br/><br/>
      <strong class="text-emerald-400">How to Fix in Production:</strong>
      <ol class="list-decimal list-inside mt-1 space-y-1 text-slate-300">
        <li><strong>Explicit Locking (SELECT ... FOR UPDATE):</strong> Force transactions to lock the shift or team record so one must wait for the other.</li>
        <li><strong>True Serializable Isolation:</strong> Use Serializable Snapshot Isolation (SSI in PostgreSQL), which detects conflicting read-write cycles and aborts one transaction with a serialization failure error.</li>
      </ol>`
    },
    {
      qNum: "Q2",
      question: "How does Multi-Version Concurrency Control (MVCC) work under the hood in PostgreSQL vs. MySQL InnoDB?",
      answer: `The core promise of MVCC is simple: <strong>Readers never block Writers, and Writers never block Readers.</strong>
      <br/><br/>
      Instead of locking a row every time someone queries it, the database engine maintains multiple timestamped versions of each row. But how PostgreSQL and MySQL implement this physically on disk is completely different:
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <div class="bg-[#050811] p-3 rounded border border-slate-800">
          <strong class="text-cyan-400 block font-code text-[12px] mb-1">MySQL InnoDB (Undo Log Pointer Chains)</strong>
          <p class="text-[12px] text-slate-300 leading-relaxed">
            InnoDB updates rows <strong>in place</strong> on the main table page. Before overwriting the old values, it copies the previous version to an <strong>Undo Log</strong>. The active row contains a hidden <code>DB_ROLL_PTR</code> pointing backward to its historical version in the undo log. Older readers traverse this linked list backward in time. When transactions complete, background purge threads discard old undo pages.
          </p>
        </div>
        <div class="bg-[#050811] p-3 rounded border border-slate-800">
          <strong class="text-indigo-400 block font-code text-[12px] mb-1">PostgreSQL (Append-Only Tuples + VACUUM)</strong>
          <p class="text-[12px] text-slate-300 leading-relaxed">
            Postgres <strong>never overwrites data in place</strong>. Every <code>UPDATE</code> inserts a brand new row version (tuple) into the table heap with headers: <code>xmin</code> (transaction that created it) and <code>xmax</code> (transaction that deleted or replaced it). Old dead rows stay in the table data file until the background <strong>VACUUM worker</strong> cleans them up.
          </p>
        </div>
      </div>`
    },
    {
      qNum: "Q3",
      question: "What is PostgreSQL Transaction ID (txid) Wraparound and why does it terrify database administrators?",
      answer: `PostgreSQL uses a 32-bit integer for transaction IDs (TXIDs), giving about <strong>4.29 billion possible IDs</strong>. Because numbers wrap around modulo $2^{32}$, a transaction created today could appear to be in the "past" or "future" compared to an older transaction, potentially making committed historical data completely invisible!
      <br/><br/>
      <strong class="text-indigo-400">The Defense Mechanism: VACUUM FREEZE</strong>
      <p class="text-slate-300 mt-1">
        PostgreSQL periodically runs <code>VACUUM FREEZE</code>, which replaces old transaction IDs with a special marker (<code>FrozenTransactionId = 2</code>), meaning <em>"this row was committed in the deep past and is visible to all transactions forever."</em>
      </p>
      <strong class="text-amber-300">The Emergency Stop:</strong>
      <p class="text-slate-300 mt-1">
        If an open analytics query or uncommitted transaction runs for days, autovacuum cannot advance the freeze horizon. If the database reaches 2 billion unfrozen transactions, PostgreSQL <strong>shuts down writes immediately into read-only mode</strong> to prevent data loss, requiring emergency single-user maintenance.
      </p>`
    },
    {
      qNum: "Q4",
      question: "When should you actually use SERIALIZABLE in production, and what is the real-world performance cost?",
      answer: `Use <strong>SERIALIZABLE</strong> when:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>You manage multi-row financial balances, double-entry bookkeeping, or inventory reservations where business rules span across multiple records.</li>
        <li>You want absolute safety without writing custom error-prone <code>SELECT ... FOR UPDATE</code> locks in application code.</li>
      </ul>
      <strong class="text-rose-400">The Real-World Cost:</strong>
      <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300">
        <li><strong>In Traditional 2-Phase Locking (2PL):</strong> Concurrency drops dramatically because long range locks block other readers and writers, causing deadlocks.</li>
        <li><strong>In Modern PostgreSQL (SSI - Serializable Snapshot Isolation):</strong> Queries execute fast with no shared row locks, but the database tracks dependencies in RAM. If it detects a conflict cycle, it <strong>aborts the younger transaction</strong> with error code <code>40001 (serialization_failure)</code>. Your application MUST implement retry loops with random jitter.</li>
      </ul>`
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
              4.2 Database Isolation Levels & MVCC
            </h2>
          </div>
          <p class="text-slate-400 text-[13px] font-sans">
            How databases balance concurrent query speed against data corruption anomalies, and why readers never have to wait for writers.
          </p>
        </div>

        <!-- Everyday Mental Model Card -->
        <div class="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-400 text-[20px]">lightbulb</span>
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              EVERYDAY MENTAL MODEL: THE LIVE ROOM LOCK VS. THE INSTANT POLAROID PHOTO
            </span>
          </div>
          <p class="text-slate-300 text-[13px] leading-relaxed font-sans">
            Imagine a busy library reading room with a master bulletin board where daily stock prices are posted:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-slate-800 flex flex-col gap-1.5">
              <strong class="text-rose-300 text-[12px] font-code flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-400"></span>
                Without MVCC: Heavy Room Locking
              </strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                Whenever anyone wants to read the board, they lock the room door. While you read, nobody can update the board. Whenever an editor wants to write new prices, everyone must leave the room. Reading stops writing, and writing stops reading. Under heavy traffic, lines stretch around the block!
              </p>
            </div>
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-emerald-500/20 flex flex-col gap-1.5">
              <strong class="text-emerald-300 text-[12px] font-code flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                With MVCC: The Instant Polaroid Snapshot
              </strong>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                When you walk into the library, the system hands you a personal <strong>Polaroid photo</strong> of the board taken at that exact millisecond. You can sit and study your photo for 20 minutes in peace. Meanwhile, editors continue updating the physical board in real time. <em>Readers never block writers, and writers never block readers!</em>
              </p>
            </div>
          </div>
        </div>

        <!-- The 4 Concurrency Anomalies Explained Simply -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-slate-200 tracking-wider text-[11px] uppercase font-code">
              THE 4 DATA PHENOMENA (ANOMALIES) EXPLAINED IN PLAIN ENGLISH
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-rose-500/30 rounded-lg p-3 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-rose-300 uppercase">1. Dirty Read</span>
              <p class="text-[12px] text-slate-300 leading-relaxed">
                Reading uncommitted drafts. Transaction A changes bank balance from $100 to $500. Transaction B reads $500. Transaction A crashes and cancels (rolls back). Transaction B made decisions based on imaginary money that never existed.
              </p>
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">2. Non-Repeatable Read</span>
              <p class="text-[12px] text-slate-300 leading-relaxed">
                A row changes mid-transaction. You check flight seat 12B and it costs $100. Five seconds later you click buy, but an airline price-adjuster committed in between, so your second query sees $150.
              </p>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">3. Phantom Read</span>
              <p class="text-[12px] text-slate-300 leading-relaxed">
                New rows appear out of nowhere. You run <code>SELECT count(*) WHERE age &gt; 65</code> and get 10. While processing, a new senior user registers and commits. When you re-query, you get 11 rows!
              </p>
            </div>
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1.5">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">4. Write Skew</span>
              <p class="text-[12px] text-slate-300 leading-relaxed">
                Two transactions read overlapping data, mutate different rows, and commit an invalid combined state (e.g., both on-call doctors signing off simultaneously because each saw the other was on duty).
              </p>
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
            <span class="text-slate-500 text-[10.5px]">Step-by-Step Traversal</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ MULTI-VERSION CONCURRENCY CONTROL (MVCC) SNAPSHOT ISOLATION                            │
│                                                                                        │
│  Row in Primary Table (Clustered Index):                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ id = 42 | balance = $300 | DB_TRX_ID = 205 (Txn C) | DB_ROLL_PTR = 0x8A12F000   │  │
│  └──────────────────────────────────────────────────────────────┬───────────────────┘  │
│                                                                 │                      │
│     Points backward to historical version chain in Undo Log     ▼                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Undo Log Record 1: balance = $200 | DB_TRX_ID = 202 (Txn B) | DB_ROLL_PTR = 0x8A01│  │
│  └──────────────────────────────────────────────────────────────┬───────────────────┘  │
│                                                                 │                      │
│     Points backward to initial baseline                         ▼                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Undo Log Record 2: balance = $100 | DB_TRX_ID = 199 (Txn A) | DB_ROLL_PTR = NULL  │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  CONCURRENT READ VIEW EVALUATION:                                                      │
│                                                                                        │
│  1. Txn 200 starts (Read View snapshot created: max committed transaction was 199):    │
│  2. It reads primary row (trx_id=205 > 199) ──► Too new! Skips uncommitted change.    │
│  3. Follows roll_ptr to Undo Record 1 (trx_id=202 > 199) ──► Still too new! Skips.    │
│  4. Follows roll_ptr to Undo Record 2 (trx_id=199 <= 199) ──► VALID MATCH! Reads $100. │
│                                                                                        │
│  • Result: Txn C updates to $300 while Txn 200 reads $100 concurrently with NO LOCKS! │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR INTERVIEW STRATEGY: ENGINE DEFAULTS & THE WRITE SKEW TRAP
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, many candidates make two major mistakes: (1) assuming all databases use the same default isolation, and (2) believing Repeatable Read solves all race conditions.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-[12px] font-sans text-emerald-200/90 leading-relaxed">
              <strong class="text-white block font-code mb-1">1. Know The Defaults Cold:</strong>
              MySQL InnoDB defaults to <strong>Repeatable Read</strong> (uses gap locks and undo logs to prevent phantoms). PostgreSQL defaults to <strong>Read Committed</strong> (every statement sees changes committed right up to that instant). Stating these accurately signals deep production experience.
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-[12px] font-sans text-emerald-200/90 leading-relaxed">
              <strong class="text-white block font-code mb-1">2. How to Counter Write Skew:</strong>
              When asked how to prevent the on-call doctor anomaly, offer two clean paths: (a) Explicit row locks with <code>SELECT ... FOR UPDATE</code> on a parent table, or (b) Setting PostgreSQL to <code>SERIALIZABLE</code> with application retry logic.
            </div>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: LONG-RUNNING TRANSACTIONS CAUSE RUNAWAY BLOAT
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Never allow an analytical report, bulk migration script, or developer database terminal to keep a transaction open for hours. In an MVCC database, the oldest active transaction pins the <strong>visible snapshot horizon</strong>:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-sans pt-1">
            <div class="bg-[#190E03] border border-[#F59E0B]/20 p-2.5 rounded-lg text-slate-300">
              <strong class="text-amber-200 block pb-0.5">MySQL InnoDB:</strong> The engine cannot purge historical records from the Undo Log. The tablespace file (<code>ibdata1</code>) swells by gigabytes, consuming disk space and slowing down queries across the system.
            </div>
            <div class="bg-[#190E03] border border-[#F59E0B]/20 p-2.5 rounded-lg text-slate-300">
              <strong class="text-amber-200 block pb-0.5">PostgreSQL:</strong> <code>VACUUM</code> is forbidden from removing dead rows that might be visible to that long transaction. Tables swell 10x in size, and approaching 2 billion unfrozen transactions triggers an emergency read-only freeze.
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
            Isolation is a deliberate trade-off between throughput and data correctness. Remember the engine defaults: PostgreSQL uses Read Committed; MySQL InnoDB uses Repeatable Read. When explaining MVCC, highlight the Polaroid snapshot model: readers never block writers. Always bring up Write Skew (the two on-call doctors) to demonstrate why Snapshot Isolation is not foolproof, and note the table bloat dangers of long-running transactions.
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
