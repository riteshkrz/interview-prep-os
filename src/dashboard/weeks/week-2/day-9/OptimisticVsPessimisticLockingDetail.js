/**
 * 4.3 Optimistic vs. Pessimistic Locking - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 50, 51, and 52
 * from The Modern System Design Interview Guide.
 */

export function renderOptimisticVsPessimisticLockingContent(topic) {
  const lockingComparison = [
    {
      dimension: "Locking Mechanism",
      optimistic: "Zero database locks. A version number (or timestamp) is verified conditionally at UPDATE time.",
      pessimistic: "Exclusive row-level lock acquired upfront via SELECT ... FOR UPDATE."
    },
    {
      dimension: "Contention Sweet Spot",
      optimistic: "Low contention: Reads heavily dominate writes; conflict chance is very low (< 2%).",
      pessimistic: "High contention: Many concurrent requests aggressively trying to modify the exact same row."
    },
    {
      dimension: "Throughput Under Load",
      optimistic: "Ultra-fast when conflicts are rare; collapses into CPU-heavy retry storms under high contention.",
      pessimistic: "Steady, serialized throughput; capped by lock queue depth and lock hold duration."
    },
    {
      dimension: "Deadlock Vulnerability",
      optimistic: "Zero deadlock risk. Transactions never pause waiting for locks held by other sessions.",
      pessimistic: "Moderate to high risk if transactions acquire multiple rows in varying order."
    },
    {
      dimension: "Application Complexity",
      optimistic: "Higher. The app must implement retry loops with exponential backoff and random jitter.",
      pessimistic: "Lower. The database engine manages queuing and timeout waiting automatically."
    },
    {
      dimension: "Network Call Sensitivity",
      optimistic: "Completely safe. Data can be read, processed off-thread, and updated without holding resources.",
      pessimistic: "Catastrophic. Holding database locks across external HTTP calls exhausts connection pools."
    },
    {
      dimension: "Best Fit For",
      optimistic: "User profile updates, CMS article editing, collaborative document drafts.",
      pessimistic: "Bank account transfers, seat inventory checkout, high-demand limited stock allocation."
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you prevent 'Retry Storms' and livelocks in optimistic locking when contention spikes unexpectedly?",
      answer: `When 1,000 concurrent requests try to update the exact same optimistic record (e.g., the last ticket for a concert), 1 request succeeds and 999 fail. If all 999 immediately re-read and retry simultaneously, they create an <strong>$O(N^2)$ Retry Storm</strong> that melts the database CPU while making zero forward progress.
      <br/><br/>
      <strong class="text-indigo-400">The Senior Solution:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Truncated Exponential Backoff with Full Jitter:</strong> Calculate retry sleep as <code>delay = rand(0, min(max_cap, base * 2^attempt))</code>. Random jitter spreads requests across time, preventing synchronized thundering herds.</li>
        <li><strong>Strict Retry Budget:</strong> Limit retries to 3 attempts maximum. If still conflicted, fail fast with HTTP <code>409 Conflict</code> so the user or caller can decide how to proceed.</li>
        <li><strong>Partitioned Queuing:</strong> Under extreme write bursts, shift from direct database updates to a partitioned queue (Kafka/Redis) that serializes writes to a single worker per key.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "Why is making an external HTTP call inside a database transaction considered a catastrophic production antipattern?",
      answer: `Consider what happens in this common anti-pattern:
      <pre class="bg-[#050811] p-2.5 rounded text-[11px] font-code text-slate-300 mt-1 border border-slate-800">BEGIN TRANSACTION;
SELECT * FROM users WHERE id = 42 FOR UPDATE; -- Acquires exclusive row lock!
res = httpClient.post("https://api.stripe.com/v1/charges", ...); -- 2,000ms network hop!
UPDATE users SET balance = balance - 100 WHERE id = 42;
COMMIT;</pre>
      While the application waits 2,000ms for Stripe's network response:
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li>The exclusive lock on user #42 remains frozen, blocking any other operations for this user.</li>
        <li>The <strong>database connection is pinned and completely idle</strong>. If 50 concurrent users check out, a 50-connection pool (e.g. HikariCP) is 100% starved in one second! Every other query across the entire app throws <code>ConnectionPoolTimeoutException</code>, turning a payment delay into a total outage!</li>
      </ol>
      <strong class="text-emerald-400">The Golden Rule:</strong> Never hold a database transaction across network hops. Prepare data &rarr; commit local transaction &rarr; make external API call &rarr; record result in a new transaction with an idempotency key.`
    },
    {
      qNum: "Q3",
      question: "How do distributed locks (Redis Redlock, ZooKeeper) differ from database row-level locking?",
      answer: `This is a fundamental architectural boundary:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Database Row Locks (SELECT FOR UPDATE):</strong> Managed directly by the database engine inside a single database instance. They are strictly ACID-compliant, automatically release if the connection drops, and protect data rows at the cost of database connection pool usage.</li>
        <li><strong>Distributed Locks (Redis Redlock / ZooKeeper):</strong> External coordination locks implemented across independent microservices that don't share a single database. They protect external shared resources (e.g. preventing two workers from generating the same monthly invoice or sending duplicate payment webhooks).</li>
      </ul>
      <strong class="text-amber-300">The Danger:</strong> Distributed locks rely on TTL timeouts. If a Java garbage collection pause or network freeze exceeds the TTL, the lock expires while the worker is still working. To prevent split-brain writes, always use <strong>fencing tokens</strong> (monotonically increasing numbers checked at the storage layer).`
    },
    {
      qNum: "Q4",
      question: "What is Deadlock Detection vs. Deadlock Prevention in pessimistic locking systems?",
      answer: `When Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1, they are in a <strong>Deadlock</strong>.
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Deadlock Detection:</strong> The database engine maintains a background "Wait-For Graph" tracking which transaction is waiting for which. When it detects a circular loop, it picks a "victim" transaction (usually the one with fewer modifications), aborts it, and returns an error (e.g. MySQL 1213: Deadlock found).</li>
        <li><strong>Deadlock Prevention (Deterministic Sorting):</strong> Applications avoid deadlocks completely by always acquiring multiple row locks in the exact same sorted order:
        <pre class="bg-[#050811] p-1.5 rounded text-[11px] font-code text-cyan-300 mt-1 border border-slate-800">-- Always sort IDs before locking!
SELECT * FROM accounts WHERE id IN (12, 45) ORDER BY id FOR UPDATE;</pre>
        If every transaction locks ID 12 before ID 45, a circular wait is mathematically impossible!</li>
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
          <p class="text-slate-400 text-[13px] font-sans">
            Choosing between lock-first defense and conflict-detection on commit, governed strictly by write contention.
          </p>
        </div>

        <!-- Everyday Mental Model Card -->
        <div class="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-400 text-[20px]">lightbulb</span>
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              EVERYDAY MENTAL MODEL: THE SHARED GOOGLE DOC VS. THE PHYSICAL ARCHIVE SAFE
            </span>
          </div>
          <p class="text-slate-300 text-[13px] leading-relaxed font-sans">
            How do you stop two people from accidentally overwriting each other's edits on the same document?
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-indigo-500/25 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <strong class="text-indigo-300 text-[12px] font-code">Pessimistic Locking (Physical Vault)</strong>
                <span class="text-[10px] font-code bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Lock First</span>
              </div>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                You check out a paper file and lock yourself in a private room. Nobody else can even look at or touch the file until you unlock the door and hand it back. Great when 50 people want to grab the exact same file at once, but creates a long waiting line.
              </p>
            </div>
            <div class="bg-[#090D16] p-3.5 rounded-lg border border-cyan-500/25 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <strong class="text-cyan-300 text-[12px] font-code">Optimistic Locking (Google Doc Draft)</strong>
                <span class="text-[10px] font-code bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Check at Save</span>
              </div>
              <p class="text-[12px] text-slate-300 leading-relaxed font-sans">
                Anyone can open and read the file anytime without locks. When you hit "Save", the system checks: <em>"Has version 5 changed while you were typing?"</em> If it's still version 5, your save succeeds (version becomes 6). If someone saved first, you get: <em>"Conflict! Please refresh and retry."</em>
              </p>
            </div>
          </div>
        </div>

        <!-- Code Mechanics Box -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              SQL IMPLEMENTATION MECHANICS
            </span>
            <span class="text-slate-500 text-[10.5px]">Compare Side-by-Side</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-3 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. PESSIMISTIC LOCKING (ROW-LEVEL EXCLUSIVE LOCK)                                      │
│                                                                                        │
│   BEGIN TRANSACTION;                                                                   │
│   -- Holds an exclusive lock on row 42; any other FOR UPDATE waits in queue:           │
│   SELECT available_seats FROM flights WHERE id = 42 FOR UPDATE;                        │
│                                                                                        │
│   -- Execute business logic in your app...                                             │
│   UPDATE flights SET available_seats = available_seats - 1 WHERE id = 42;              │
│   COMMIT; -- Lock released; next queued transaction acquires the row                   │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. OPTIMISTIC CONCURRENCY CONTROL (VERSIONED CHECK-AND-SET)                            │
│                                                                                        │
│   -- Step 1: Read without holding any locks (Fast in-memory or cache read):            │
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
│       -- Another transaction updated first! Back off with random jitter and retry      │
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

        <!-- Green Callout Box: SENIOR ESCAPE HATCH -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR ESCAPE HATCH: ELIMINATING LOCKS WITH ATOMIC CONDITIONAL UPDATES
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In high-concurrency interview scenarios (flash sales, ticket drops), naive candidates jump straight to <code>SELECT ... FOR UPDATE</code> or complex optimistic retry loops. Under 50,000 requests/sec, optimistic retries cause <strong class="text-white">$O(N^2)$ retry storms</strong> that crush the database, while pessimistic locking fills database connection pools.
          </p>
          <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-3.5 text-[12.5px] font-sans text-emerald-200/90 leading-relaxed">
            <strong class="text-white block mb-1">The High-Scale Secret: In-Engine Atomic Decrements</strong>
            <pre class="text-emerald-300 font-code text-[11.5px] bg-[#050E0B] p-2 rounded mt-1 border border-emerald-500/20">UPDATE products SET stock = stock - 1 WHERE id = 42 AND stock >= 1;</pre>
            <p class="text-slate-300 text-[12px] mt-2">
              The database engine executes this single atomic statement in microseconds using its internal row latch. If <code>rows_affected == 1</code>, inventory deduction succeeded. If <code>rows_affected == 0</code>, the item is out of stock. <strong class="text-white">Zero locks held by the application, zero retry loops, and maximum throughput.</strong>
            </p>
          </div>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: HOLDING LOCKS ACROSS EXTERNAL NETWORK CALLS
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            Never hold an open database transaction or row lock while calling an external HTTP service (e.g. Stripe, PayPal, Twilio, OpenAI). If an external API experiences a 2-second network latency spike, your database connection and row locks stay frozen for 2 seconds.
          </p>
          <div class="font-sans text-[12px] text-amber-200/90 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20 leading-relaxed">
            <strong class="text-amber-100">The Cascade:</strong> In a pool of 50 connections, just 25 concurrent checkout attempts will exhaust 100% of available database connections within 500 milliseconds. Every other query on your website will crash with <code>ConnectionPoolTimeoutException</code>!
          </div>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU: THE TICKETMASTER HOLD PROBLEM
          </span>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            When a fan clicks on Seat 14B on Ticketmaster, that seat must be temporarily reserved for 10 minutes while they enter payment info. If they don't complete checkout, the seat must release automatically. How would you design this holding mechanism using Redis with TTL rather than holding database row locks for 10 minutes?
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
            Write contention determines the choice: use Optimistic Locking when conflicts are rare (reads >> writes) and Pessimistic Locking when conflicts are frequent to prevent retry storms. In production, always consider the atomic conditional update escape hatch (<code>UPDATE ... WHERE stock >= 1</code>) to eliminate locks and retries completely. Never hold database transactions across external network calls.
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
