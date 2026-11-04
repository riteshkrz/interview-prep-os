/**
 * Question 18. Design a payment system
 * System Design Interview Masterclass — Module 4: Business-critical systems (Pages 79–82)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderPaymentSystemDetail() {
  return renderMasterclassQuestion({
    questionNumber: 18,
    title: "Design a payment system",
    moduleName: "Module 4 — Business-critical systems",
    coreTopics: "idempotency, payment lifecycle state machines, ledger postings, provider callbacks, and reconciliation",

    problemStatement: `Build a payment service that can start payments, consume provider responses, support refunds, preserve an auditable financial trail, and recover from timeouts or duplicate callbacks.`,

    clarifyingQuestions: [
      { q: "Which capabilities must the system expose?", a: "Start a payment, capture or confirm it, check status, and run refunds." },
      { q: "Do we need to integrate multiple payment providers?", a: "Begin with a single provider, but shape the design around a provider abstraction." },
      { q: "What are the top priorities?", a: "Correct money movement, strong audit trails, and dependable recovery paths." },
      { q: "Must every payment interaction block until completion?", a: "No—some flows may finish asynchronously." },
      { q: "Will we persist raw card data?", a: "No—prefer provider-hosted checkout or tokenization." }
    ],

    functionalRequirements: [
      "Support payment initiation.",
      "Model success, failure, pending, and timeout outcomes.",
      "Block duplicate charges when clients retry.",
      "Execute refund flows.",
      "Ingest provider webhooks.",
      "Keep financial records and external transaction references.",
      "Align internal books with provider reports."
    ],

    nonFunctionalRequirements: [
      "Rigorous correctness and auditability.",
      "Long-lived ledger of payment activity.",
      "Protect payment-related data in transit and at rest.",
      "High availability with deliberate degradation modes.",
      "Resolution when outcomes stay unclear.",
      "Meet applicable obligations for payment data (PCI-DSS compliance scope reduction)."
    ],

    apiDesign: `POST /api/v1/payments
Idempotency-Key: pay_req_9921_abc
Content-Type: application/json
{
  "orderId": "order-123",
  "amount": 49900,
  "currency": "INR"
}
// Note: Express amounts in a clear minor-unit form (e.g. paise/cents) and always specify currency.

GET /api/v1/payments/{paymentId}
POST /api/v1/payments/{paymentId}/refunds
POST /api/v1/webhooks/payment-provider
// Signed with HMAC signature in header (Stripe-Signature / Provider-Signature)`,

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">Payment &amp; Double-Entry Ledger Models</span>
Payment:
  payment_id, order_id, amount_minor, currency, status, idempotency_key, provider_reference, created_at, updated_at

LedgerEntry:
  entry_id, transaction_id, account_id, debit_amount, credit_amount, currency, created_at
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Products that hold or move funds need balanced double-entry ledger lines and financial controls designed for that role (Total Debits = Total Credits). A lighter merchant integration may focus on transaction records and provider references.
        </p>
      </div>
    `,

    highLevelArchitecture: `Call path: Merchant/order service &rarr; payment API &rarr; idempotency and validation &rarr; payment state machine &rarr; provider adapter &rarr; payment provider.<br/><br/>
    Provider callbacks land on a webhook handler for signature verification and deduplication. Payment rows and any required ledger lines are written durably. An outbox or event stream emits outcomes to order services. A reconciliation job lines up internal records with provider transactions and settlement reports.`,

    architectureImage: '/images/hld/q18_payment_system_architecture.svg',
    architectureImageTitle: 'Design a Payment System — Idempotency Pipeline & Double-Entry Ledger Architecture',

    architectureDiagram: `[Order Service] ──(POST /payments + Idempotency-Key)──► [Payment API]
                                                            │
                                                            ▼ (Check / Set Idempotency Lock)
                                                    [Idempotency Store]
                                                            │
                                                            ▼
                                              [Payment State Machine] ──► [Payment DB]
                                                            │
                                                            ▼
                                              [Provider Adapter] ──► [External Gateway (Stripe/Adyen)]
                                                                           │
                                                                 (Async Webhook Callback)
                                                                           ▼
[Settlement Reports (EOD)] ───────────────┐                       [Webhook Handler]
          │                               │                                │ (Verify HMAC signature & Dedup)
          ▼                               ▼                                ▼
[Reconciliation Worker] ◄─────► [Audit Ledger DB] ◄──────────────── [Outbox / State Update]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Assemble and submit the payment request",
        stepBody: "Validate order, amount, and currency. Supply an idempotency key so retries surface the same logical payment instead of opening a second charge."
      },
      {
        stepNumber: 2,
        stepTitle: "Write the starting payment state to storage",
        stepBody: "Create a payment record in a state such as <code>CREATED</code> or <code>PENDING</code>. Keep the internal payment ID separate from the provider reference."
      },
      {
        stepNumber: 3,
        stepTitle: "Invoke the external provider",
        stepBody: "Run authorization or capture via a provider adapter. A timeout is ambiguous—it does not prove the provider failed to process the payment."
      },
      {
        stepNumber: 4,
        stepTitle: "Apply provider callbacks in an idempotent way",
        stepBody: "Validate webhook signatures, persist provider event IDs, and dedupe repeat deliveries. Allow only valid state transitions—stale events must not clobber a newer terminal state."
      },
      {
        stepNumber: 5,
        stepTitle: "Persist charges, refunds, and related financial results",
        stepBody: "Store successful captures, failures, refunds, and other monetary state changes. For an accounting ledger, append immutable entries or explicit reversals so fixes stay auditable."
      },
      {
        stepNumber: 6,
        stepTitle: "Emit payment outcomes with guaranteed delivery semantics",
        stepBody: "Employ an outbox or similar pattern so a committed payment result is not dropped between the database commit and event publication."
      },
      {
        stepNumber: 7,
        stepTitle: "Run periodic reconciliation against provider records",
        stepBody: "Match internal records to provider transactions and settlement reports. Chase missing callbacks, amount mismatches, ambiguous transactions, and stuck refunds."
      }
    ],

    whyComponents: [
      { component: "Idempotency store or constraint", why: "Stops duplicate work and double-charges when requests are retried" },
      { component: "Payment state machine", why: "Governs allowed lifecycle transitions and blocks illegal state mutations" },
      { component: "Provider adapter", why: "Hides provider-specific APIs, protocols, and quirks" },
      { component: "Webhook handler", why: "Accepts asynchronous provider results and signature verifications" },
      { component: "Ledger or transaction store", why: "Holds an immutable, auditable double-entry financial history" },
      { component: "Outbox", why: "Publishes state changes without losing them across crashes" },
      { component: "Reconciliation worker", why: "Finds gaps and mismatches that callbacks and retries alone cannot close" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Synchronous provider calls:</strong> Simplify the first API response, but still leave timeout ambiguity whenever network drops mid-call.",
      "<strong>Asynchronous completion:</strong> Adds resilience, yet forces clients to handle and tolerate pending states gracefully.",
      "<strong>Multiple providers:</strong> Add business redundancy, but make automated failover risky when the first provider's outcome is unknown.",
      "<strong>Double-entry ledger:</strong> Strengthens auditability and regulatory compliance, but demands strict accounting semantics and immutable correction workflows.",
      "<strong>Retries:</strong> Improve eventual completion rates, yet can double-charge users unless idempotency is strictly enforced end-to-end."
    ],

    followUps: [
      {
        q: "The provider charged the customer but our call timed out—what is your playbook?",
        a: "“Do not spin up a fresh payment blindly. Look up the provider with the original idempotency key or merchant reference, process incoming webhooks, and reconcile until the definitive outcome is settled.”"
      },
      {
        q: "How do you stop the same webhook from being applied twice?",
        a: "“Store provider event IDs under a database uniqueness constraint and make each state transition idempotent. A duplicate delivery should ack successfully (HTTP 200) without repeating the financial side effect.”"
      },
      {
        q: "Can charging through the provider live inside one local DB transaction?",
        a: "“Not as an ordinary local ACID transaction—the provider is external and network-separated. Coordinate with idempotency, durable pending state, callbacks, compensations, and end-of-day reconciliation.”"
      },
      {
        q: "Should card numbers and CVV values be persisted in our system?",
        a: "“Avoid that completely here. Rely on provider-hosted checkout (Stripe Elements / Checkout) or tokenization to limit sensitive payment-data handling and drastically shrink PCI-DSS compliance scope.”"
      }
    ]
  });
}
