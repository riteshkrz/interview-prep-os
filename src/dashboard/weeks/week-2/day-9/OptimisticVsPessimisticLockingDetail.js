/**
 * 4.3 Optimistic vs. Pessimistic Locking - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 50, 51, and 52
 * from The Modern System Design Interview Guide.
 */

export function renderOptimisticVsPessimisticLockingContent(topic) {
  const lockingComparison = [
    {
      dimension: "Lock Mechanism",
      optimistic: "Zero DB locks. Version integer or timestamp verified conditionally during UPDATE.",
      pessimistic: "Exclusive row-level lock acquired immediately via SELECT ... FOR UPDATE."
    },
    {
      dimension: "Contention Sweet Spot",
      optimistic: "Low contention (reads heavily dominate writes; conflict probability < 2%).",
      pessimistic: "High contention (many writers aggressively mutating the identical record)."
    },
    {
      dimension: "Throughput Under Load",
      optimistic: "Exceptional when conflicts are rare; collapses into retry storms under high contention.",
      pessimistic: "Predictable, serialized throughput; limited by lock queue depth and lock hold time."
    },
    {
      dimension: "Deadlock Vulnerability",
      optimistic: "Zero deadlock risk. Transactions never block waiting on locks held by others.",
      pessimistic: "Moderate to high risk if concurrent transactions acquire multiple rows in varying order."
    },
    {
      dimension: "Application Complexity",
      optimistic: "High. Client code must implement retry loops with exponential backoff and jitter.",
      pessimistic: "Low. Database engine manages queuing and wait-timeouts transparently."
    },
    {
      dimension: "Network Call Sensitivity",
      optimistic: "Immune. Data can be read, processed off-thread, and updated without holding resources.",
      pessimistic: "Catastrophic. Holding locks across network hops causes connection pool exhaustion."
    },
    {
      dimension: "Best Fit For",
      optimistic: "E-commerce user profiles, CMS article edits, document collaboration metadata.",
      pessimistic: "Banking ledger balance transfers, flight seat allocations, inventory reservation checkouts."
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you prevent 'Retry Storms' and livelocks in optimistic locking when contention spikes unexpectedly?",
      answer: `When 1,000 concurrent requests compete for the same optimistic record (e.g. the last seat on a flight), 1 request succeeds and 999 fail. If all 999 immediately re-read and retry simultaneously, they create an <strong>$O(N^2)$ Retry Storm</strong> that thrashes database CPU while making zero forward progress.
      <br/><br/>
      <strong class="text-indigo-400">The Senior Solution:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Truncated Exponential Backoff with Full Jitter:</strong> Calculate retry delay as <code>sleep = rand(0, min(cap, base * 2^attempt))</code>. Adding full random jitter desynchronizes clients, eliminating lockstep retries.</li>
        <li><strong>Strict Retry Budget:</strong> Limit retries to 3 attempts. If exhausted, fast-fail with HTTP 409 Conflict.</li>
        <li><strong>Dynamic Shedding:</strong> If conflict rate exceeds 20%, switch dynamically to a single-writer partition queue.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "Why is making an external third-party HTTP call inside a database transaction considered a catastrophic production antipattern?",
      answer: `Consider this antipattern:
      <pre class="bg-[#050811] p-2 rounded text-[11px] font-code text-slate-300 mt-1 border border-slate-800">BEGIN TRANSACTION;
SELECT * FROM users WHERE id = 42 FOR UPDATE; -- Acquires exclusive lock!
res = httpClient.post("https://api.stripe.com/v1/charges", ...); -- 2,000ms latency!
UPDATE users SET balance = balance - 100 WHERE id = 42;
COMMIT;</pre>
      While the application waits 2,000ms for Stripe's network response:
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li>The exclusive row lock on user #42 is held open, blocking all other operations for that user.</li>
        <li>The <strong>database connection is pinned and idle</strong>. Under 50 concurrent requests, a standard connection pool (e.g. HikariCP with 50 connections) becomes 100% exhausted in 1 second, causing <em>every other query across the entire system</em> to throw connection timeout errors!</li>
      </ol>
      <strong class="text-emerald-400">The Rule:</strong> Never span external network calls across database transactions. Prepare data $\to$ commit local transaction $\to$ call external API $\to$ record result in a fresh transaction.`
    },
    {
      qNum: "Q3",
      question: "How do distributed locks (e.g. Redis Redlock, ZooKeeper ephemeral nodes) differ from database row-level locking?",
      answer: `This is a fundamental architecture boundary:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Database Row Locks (SELECT FOR UPDATE):</strong> Enforced directly by the storage engine inside a single database instance. They are strictly ACID-compliant, automatically released on connection termination, and guarantee data consistency at the cost of database CPU and connection holding.</li>
        <li><strong>Distributed Locks (Redis Redlock / Consul / ZooKeeper):</strong> External coordination locks implemented across independent processes or microservices that share <em>no common database</em>. They protect external resources (e.g. generating a single PDF, sending a single payment webhook, or synchronizing third-party API mutations).</li>
      </ul>
      <strong class="text-amber-300">Warning:</strong> Distributed locks rely on TTL timeouts. If a garbage collection pause or network freeze exceeds the TTL, the lock expires while the holder is still running, exposing systems to split-brain updates unless paired with <strong>fencing tokens</strong>.`
    },
    {
      qNum: "Q4",
      question: "What is Deadlock Detection vs. Deadlock Prevention in pessimistic locking systems?",
      answer: `When Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1, a <strong>Deadlock</strong> occurs.
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Deadlock Detection:</strong> The database maintains a background "Wait-For Graph" (directed graph where nodes are transactions and edges are lock waits). If a cycle is detected, the engine picks a "victim" transaction (usually the one with fewest modifications), rolls it back, and returns an error (e.g. MySQL 1213: Deadlock found).</li>
        <li><strong>Deadlock Prevention (Wait-Die vs Wound-Wait):</strong> Uses transaction timestamps to prevent cycles before they form. In <em>Wound-Wait</em>, if an older transaction requests a lock held by a younger transaction, the older transaction "wounds" (aborts) the younger one; if a younger transaction requests a lock held by an older transaction, it waits.</li>
        <li><strong>Senior Application Best Practice:</strong> Always acquire locks on multiple resources in a globally deterministic lexicographical order (e.g. always sort row IDs: <code>SELECT * FROM accounts WHERE id IN (12, 45) ORDER BY id FOR UPDATE</code>).</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 50, 51, 52: OPTIMISTIC VS PESSIMISTIC LOCKING -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.3 Optimistic vs. Pessimistic Locking
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            When concurrent clients attempt to mutate the exact same record (e.g. reserving a concert seat, decrementing inventory, or transferring account balances), systems must enforce concurrency control. Choosing between <strong class="text-indigo-400">Pessimistic Locking</strong> (defensive, lock-first serialization) and <strong class="text-cyan-400">Optimistic Locking</strong> (lock-free, conflict-detection on commit) is governed strictly by the expected <strong>level of write contention</strong>.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">Pessimistic Locking</span>
                <span class="text-[10px] font-code bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Lock First (SELECT ... FOR UPDATE)</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Assumes conflict is probable. Explicitly locks the target row upon reading, forcing all other concurrent readers/writers to wait in a database queue until the transaction commits.
              </p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">Optimistic Locking</span>
                <span class="text-[10px] font-code bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Check on Commit (version = version + 1)</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Assumes conflict is rare. Reads data freely with zero locks. Upon updating, checks whether a <code>version</code> column changed. If another txn updated first, the update fails and the app retries.
              </p>
            </div>
          </div>
        </div>

        <!-- Code & Architecture Box -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              CODE MECHANICS: PESSIMISTIC EXCLUSIVE LOCK VS. OPTIMISTIC CONDITIONAL UPDATE
            </span>
            <span class="text-slate-500 text-[10.5px]">SQL Implementation Patterns</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. PESSIMISTIC LOCKING (ROW-LEVEL EXCLUSIVE LOCK)                                      │
│                                                                                        │
│   BEGIN TRANSACTION;                                                                   │
│   -- Acquires exclusive write lock on row 42; blocks any other FOR UPDATE query:       │
│   SELECT available_seats FROM flights WHERE id = 42 FOR UPDATE;                        │
│                                                                                        │
│   -- Process business logic in application...                                          │
│   UPDATE flights SET available_seats = available_seats - 1 WHERE id = 42;              │
│   COMMIT; -- Lock released; next queued transaction acquires row                       │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. OPTIMISTIC CONCURRENCY CONTROL (VERSIONED CHECK-AND-SET)                            │
│                                                                                        │
│   -- Step 1: Read without holding any locks (Fast in-memory/cache read):               │
│   SELECT id, available_seats, version FROM flights WHERE id = 42; -- version = 7       │
│                                                                                        │
│   -- Step 2: Atomic conditional update on commit:                                      │
│   UPDATE flights                                                                       │
│      SET available_seats = available_seats - 1,                                        │
│          version = version + 1                                                         │
│    WHERE id = 42                                                                       │
│      AND version = 7; -- Optimistic check!                                             │
│                                                                                        │
│   if (rows_affected == 1) {                                                            │
│       return SUCCESS;                                                                  │
│   } else {                                                                             │
│       // Another transaction updated first! Re-fetch and retry with jittered backoff   │
│       return RETRY_WITH_BACKOFF;                                                       │
│   }                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Comparison Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              COMPREHENSIVE COMPARISON: OPTIMISTIC VS. PESSIMISTIC LOCKING
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse text-[12px] font-sans">
              <thead>
                <tr class="bg-[#162032] text-slate-300 font-code text-[11px] border-b border-[#24314A]">
                  <th class="p-3.5 font-semibold text-white">Dimension</th>
                  <th class="p-3.5 font-semibold text-cyan-300">Optimistic Locking</th>
                  <th class="p-3.5 font-semibold text-indigo-300">Pessimistic Locking</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0F172A]">
                ${lockingComparison.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#111B2E]/50' : 'bg-transparent'} hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-code text-slate-300 font-medium whitespace-nowrap">${row.dimension}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.optimistic}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.pessimistic}</td>
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
              SENIOR PERSPECTIVE: ELIMINATING LOCKS WITH ATOMIC CONDITIONAL UPDATES
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In flash-sale or high-concurrency interview scenarios, naive candidates jump straight to <code>SELECT ... FOR UPDATE</code> or complex optimistic retry loops. Under 50,000 QPS, optimistic retries cause <strong class="text-white">$O(N^2)$ retry storms</strong> that crush the database, while pessimistic locking exhausts connection pools.
          </p>
          <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3 text-[12.5px] font-sans text-emerald-200/90 leading-relaxed">
            <strong class="text-white">The Senior Escape Hatch: Atomic In-Engine Decrements:</strong>
            <pre class="text-emerald-300 font-code text-[11.5px] bg-[#050E0B] p-2 rounded mt-1.5 border border-emerald-500/20">UPDATE products SET stock = stock - 1 WHERE id = 42 AND stock >= 1;</pre>
            The relational database engine handles this single atomic operation internally in microseconds using the page latch. If <code>rows_affected == 1</code>, the inventory deduction succeeded. If <code>rows_affected == 0</code>, the item is out of stock. <strong class="text-white">Zero locks held, zero application retries, and infinite scalability.</strong>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: THE NETWORK CALL INSIDE TRANSACTION TRAP
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Never hold a database transaction or lock while invoking an external third-party HTTP service (e.g. Stripe, PayPal, Twilio, OpenAI). If an external API takes 2.5 seconds to respond due to network jitter, your database connection and row locks remain frozen for 2.5 seconds.
          </p>
          <div class="font-sans text-[12.5px] text-amber-200/90 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20 leading-relaxed">
            <strong class="text-amber-100">The Cascade:</strong> Under 50 concurrent checkouts, a standard database connection pool (50 connections) is 100% starved within milliseconds. All subsequent database operations across the entire platform throw <code>ConnectionPoolTimeoutException</code>, transforming a simple payment slowdown into a full site outage.
          </div>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU
          </span>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            You are designing the seat selection engine for Ticketmaster. When a user clicks on Seat 14B, that seat must be held for 10 minutes while they enter billing info. If they don't finish, the seat releases automatically. How would you design this holding mechanism using Redis vs SQL without holding database row locks for 10 minutes?
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
            Contention determines the choice: use Optimistic Locking when conflicts are rare (reads >> writes) and Pessimistic Locking when conflicts are frequent to avoid retry storms. In production, prefer the atomic conditional update escape hatch (<code>UPDATE ... WHERE stock >= 1</code>) to eliminate locks and retries completely. Never hold locks across external network hops.
          </p>
        </div>

        <!-- Page 52 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 52</span>
        </div>

      </div>

    </div>
  `;
}
