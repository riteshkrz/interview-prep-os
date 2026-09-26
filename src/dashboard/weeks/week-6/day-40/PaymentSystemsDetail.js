/**
 * Payment Systems: Clearing, Settlement & Ledgers (Topic 9.4)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 113–122
 */

export function renderPaymentSystemsContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="payment-systems">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 9.4 · Pages 113–122
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Mission-Critical FinTech
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">Double-Entry Bookkeeping · ID Chaining · Daily Batch Reconciliation</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Payment Systems: Clearing, Settlement & Double-Entry Ledgers</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Building a payment platform is an exercise in distributed consensus where partial failure means lost money. In modern financial architecture, balances are never updated in-place. Every cent is tracked through immutable double-entry journal records, chained upstream identifiers, and automated daily reconciliation against external bank settlement files.
      </p>
    </div>

    <!-- ASCII Architecture Diagram -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The 7 Core Components of a Payment System (Page 114)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
  Customer Checkout
         │ 1. POST /payments (with Idempotency-Key)
         ▼
  ┌───────────────────────┐
  │    PAYMENT SERVICE    │──► Stores Payment Event (State: IN_PROGRESS)
  └──────────┬────────────┘
             │ 2. Split multi-seller cart into individual orders
             ▼
  ┌───────────────────────┐
  │   PAYMENT EXECUTOR    │──► 3. Calls external Payment Service Provider (PSP / Stripe)
  └──────────┬────────────┘
             │
             ├─► PSP / Card Scheme (Visa / Mastercard) ──► Acquirer Bank ──► Issuer Bank
             │     (Returns: psp_transaction_id, authorization_code)
             ▼
  ┌───────────────────────┐
  │    WALLET SERVICE     │──► 4. Updates seller balance projection
  └──────────┬────────────┘
             │ 5. Asynchronous Transactional Outbox Event
             ▼
  ┌───────────────────────┐
  │ DOUBLE-ENTRY LEDGER   │──► 6. Appends immutable debit/credit entries (Debit = Credit)
  └───────────────────────┘
             ▲
             │ 7. Nightly Settlement Batch Comparison
  ┌───────────────────────┐
  │ RECONCILIATION ENGINE │◄── 8. Bank / PSP Settlement CSV Files (End-of-Day)
  └───────────────────────┘
</pre>
      </div>
    </div>

    <!-- Double-Entry Bookkeeping Principles -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Double-Entry Bookkeeping: The Absolute FinTech Rule (Page 122)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-rose-400 font-bold mb-2">NEVER MUTATE BALANCES IN-PLACE</div>
          <div class="bg-black/50 p-2 rounded text-rose-300 mb-2">
            UPDATE accounts SET balance = balance + 100 WHERE id = 42;
          </div>
          <p class="text-slate-400 leading-relaxed font-sans">
            Why this is a catastrophic anti-pattern: A balance update destroys audit history. If the database crashes, or a network race occurs, money appears or disappears with zero explanation. It is completely unauditable.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-emerald-300 font-bold mb-2">THE IMMUTABLE LEDGER JOURNAL</div>
          <div class="bg-black/50 p-2 rounded text-emerald-300 mb-2">
            INSERT INTO ledger_entries (account, debit, credit, txn_id)...
          </div>
          <p class="text-slate-300 leading-relaxed font-sans">
            Every transaction creates a balanced pair of rows. Current balance is derived by summing the journal history. Debits must mathematically equal credits: <code class="text-cyan-300">&Sigma; Debits - &Sigma; Credits = 0</code>.
          </p>
        </div>
      </div>

      <div class="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
        <div class="text-amber-300 font-bold mb-2">Example: Customer Buys $100 Shoes (Platform Takes $10 Fee, Merchant Gets $90)</div>
        <div class="grid grid-cols-4 gap-2 text-slate-300 border-b border-slate-800 pb-1 font-bold">
          <span>Account</span>
          <span>Debit (Assets)</span>
          <span>Credit (Liabilities)</span>
          <span>Notes</span>
        </div>
        <div class="grid grid-cols-4 gap-2 text-slate-400 py-1">
          <span class="text-white">Customer Funds Transit</span>
          <span class="text-emerald-400">$100.00</span>
          <span>$0.00</span>
          <span>Inbound cash from Visa</span>
        </div>
        <div class="grid grid-cols-4 gap-2 text-slate-400 py-1">
          <span class="text-white">Merchant Wallet Payable</span>
          <span>$0.00</span>
          <span class="text-cyan-400">$90.00</span>
          <span>Liability owed to seller</span>
        </div>
        <div class="grid grid-cols-4 gap-2 text-slate-400 py-1">
          <span class="text-white">Platform Revenue</span>
          <span>$0.00</span>
          <span class="text-purple-400">$10.00</span>
          <span>Take rate income</span>
        </div>
        <div class="grid grid-cols-4 gap-2 text-emerald-300 font-bold pt-1 border-t border-slate-800">
          <span>SUM TOTALS</span>
          <span>$100.00</span>
          <span>$100.00</span>
          <span>Balanced to 0.00 Cents</span>
        </div>
      </div>
    </div>

    <!-- ID Chaining & Automated Reconciliation (Page 119) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
        ID Chaining: The Thread That Makes Reconciliation Possible (Page 119)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-blue-300 space-y-3">
<pre class="overflow-x-auto">
  ECOMMERCE SHOP         PAYMENT GATEWAY (PSP)          BANK SETTLEMENT          ACCOUNTING
    order_id     ──►        psp_txn_id         ──►     payout_batch_id    ──►    invoice_id
       │                         │                            │                      │
       └─────────────────────────┴────────────────────────────┴──────────────────────┘
            Every single hop CARRIES THE UPSTREAM ID so records can be joined!
</pre>
        <p class="text-slate-300 font-sans leading-relaxed">
          Without ID chaining, reconciliation degrades to fuzzy guessing on <code class="text-slate-100">(amount, date, currency)</code> — which fails catastrophically on partial captures, chargebacks, currency exchanges, and bundled batch payouts.
        </p>
      </div>

      <div class="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
        <strong class="font-bold text-amber-300 uppercase tracking-wider block mb-1">Reconciliation as a First-Class System:</strong>
        "Reconciliation is not an admission of software failure — it is a mandatory distributed systems control. When dealing with independent banks and asynchronous network hops, breaks are mathematically inevitable. The reconciliation engine downloads nightly settlement CSVs, correlates chained IDs, auto-clears matched transactions, and routes mismatched breaks to a finance exception queue with an automated alert on the age of the oldest unresolved break."
      </div>
    </div>

    <!-- Staff Interview Follow-ups -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Staff Interview Follow-ups (Page 122)
      </h3>
      <div class="space-y-3 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q1: The network call to Stripe times out after 30 seconds. What do you do?</h4>
          <p class="text-slate-300 leading-relaxed">
            Never immediately retry with a new key and never tell the customer it failed! (1) Query Stripe's lookup endpoint passing your client idempotency key to inspect the outcome; (2) If still unknown, poll with exponential backoff; (3) Put the transaction into a <code class="text-amber-300">PENDING</code> state on the UI; (4) Only after explicit confirmation do you update wallet balances and append double-entry ledger rows. Nightly reconciliation acts as the ultimate safety net.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <h4 class="font-bold text-cyan-300 mb-1">Q2: How do you handle refunds, partial captures, and chargebacks?</h4>
          <p class="text-slate-300 leading-relaxed">
            Always as <strong>new immutable ledger entries</strong>, never as edits or row deletions. A refund is an opposing debit/credit entry linking back to the original order ID. A chargeback is a debit entry plus an operational dispute fee entry arriving weeks later via the bank webhook. The immutable journal preserves full temporal auditability.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 122)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Design payment systems with double-entry immutable ledgers where debits equal credits (&Sigma;=0), chain upstream transaction IDs across every hop, propagate idempotency keys to eliminate double-charging, and implement daily automated batch reconciliation against bank settlement files."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
