/**
 * Question 3. Design a notification system
 * System Design Interview Masterclass — Module 1: Core system design (Pages 22–25)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';
import {
  getNotificationSystemDeliveryGuaranteeCard,
  getNotificationSystemHldSection,
  getNotificationSystemLldSections,
  getNotificationSystemFinalSummarySection
} from './NotificationSystemSections.js';

export function renderNotificationSystemDetail() {
  return renderMasterclassQuestion({
    questionNumber: 3,
    title: "Design a notification system",
    moduleName: "Module 1 — Core system design",
    coreTopics: "persistent queues, async delivery, retries, transactional outbox, provider hooks, and idempotency",

    problemStatement: `A notification system delivers messages to users through multiple channels, such as push notifications, email, SMS, and in-app notifications.<br/><br/>
    <strong>Examples:</strong>
    <ul class="list-disc list-inside space-y-1 my-2.5 pl-2 text-[#334155] dark:text-slate-300">
      <li>A shopping app sends an order confirmation by email and a delivery update as a push notification.</li>
      <li>A banking app sends transaction alerts through push notifications and SMS.</li>
      <li>A social media app notifies users when someone likes their post.</li>
      <li>An authentication service sends OTPs by SMS or email.</li>
    </ul>
    The core challenge is delivering a large volume of notifications reliably, without losing messages, overwhelming external providers, or sending duplicate notifications.<br/><br/>
    <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-[13px] text-[#334155] dark:text-slate-300">
      <strong class="text-slate-900 dark:text-white block mb-1">Understand the problem:</strong>
      Imagine an e-commerce platform with 10 million users. When an order is placed, the system may need to send an email, a push notification, and possibly an SMS. The notification system must decide what to send, to whom, through which channel, and when, then track the delivery outcome.
    </div>`,

    clarifyingQuestions: [
      { q: "Which delivery channels are in scope?", a: "Email, SMS, mobile push (APNs/FCM), and in-app notifications." },
      { q: "Does every message need the same urgency?", a: "No. Security OTPs and transactional order alerts require low latency; bulk marketing campaigns can be buffered and delayed." },
      { q: "Can we guarantee exactly-once external delivery?", a: "No. External carriers and gateways (e.g. Twilio, SES) can accept sends but fail to confirm receipts, or re-deliver callbacks. We design for at-least-once with end-to-end deduplication." },
      { q: "Are user opt-outs and legal consent mutable?", a: "Yes. User preferences and regulatory opt-outs (GDPR, CAN-SPAM) must be rechecked immediately prior to dispatch." },
      { q: "Is message scheduling required?", a: "Yes. The system must accept notifications with a scheduled delivery timestamp (UTC) and process them when due." }
    ],

    functionalRequirements: [
      "Accept notification requests from different business services.",
      "Support email, SMS, push, and in-app notifications.",
      "Support templates and dynamic message content.",
      "Store user channel preferences and notification settings.",
      "Retry transient failures and handle provider errors.",
      "Track notification status, such as queued, sent, delivered, or failed.",
      "Support scheduled notifications and priority levels.",
      "Prevent duplicate notifications when requests are retried."
    ],

    nonFunctionalRequirements: [
      "High availability and durable message processing.",
      "Horizontal scalability for traffic spikes.",
      "Low latency for time-sensitive notifications.",
      "At-least-once processing with idempotent handling where practical.",
      "Rate limiting and backpressure for external providers.",
      "Security and privacy for user contact information.",
      "Observability into queue lag, delivery success, failures, and latency."
    ],

    // CUSTOM INTERMEDIATE SECTIONS (Delivery Guarantee + HLD Architecture Blueprint)
    customSections: [
      {
        badge: "DELIVERY GUARANTEE",
        badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
        title: "Important Delivery Guarantee & State Semantics",
        content: getNotificationSystemDeliveryGuaranteeCard()
      },
      getNotificationSystemHldSection()
    ],

    apiDesign: `POST /v1/notifications
Content-Type: application/json
Idempotency-Key: order-8392-confirmation-v1

// Request Payload:
{
  "idempotencyKey": "order-8392-confirmation-v1",
  "userId": "user-123",
  "eventType": "ORDER_CONFIRMED",
  "channels": ["EMAIL", "PUSH"],
  "templateId": "order-confirmation",
  "templateData": {
    "orderId": "8392",
    "estimatedDelivery": "2026-10-27"
  },
  "priority": "NORMAL",
  "scheduledAt": null
}

// 202 Accepted Response (Durable Acceptance):
{
  "notificationId": "ntf-7f32a1",
  "status": "ACCEPTED",
  "acceptedAt": "2026-10-24T11:00:00Z"
}

// -------------------------------------------------------------
// HTTP Response Codes & Behavior Contracts:
// -------------------------------------------------------------
// 202 Accepted: Request was durably accepted for asynchronous processing.
// 400 Bad Request: Malformed request, unsupported channel, or invalid fields.
// 401 Unauthorized / 403 Forbidden: Calling service failed authentication.
// 409 Conflict: An idempotency key was reused with a different request payload.
// 429 Too Many Requests: Calling service exceeded assigned ingestion rate limit.
// 5xx Server Error: Database failure prevented safe, durable acceptance.
//
// Idempotency Policy:
// If the same idempotency key and equivalent payload are submitted again,
// return the original notification result instead of creating a new notification.
// Store a SHA-256 request_hash alongside the key to detect accidental key reuse.`,

    dataModel: `
      <div class="flex flex-col gap-4 text-[#334155] dark:text-slate-300">
        <p class="text-[13px] leading-relaxed">
          The notification schema enforces strict relational integrity across notifications, per-channel delivery jobs, and append-only attempt logs.
        </p>

        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
          <table class="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                <th class="py-2.5 px-3.5">Method</th>
                <th class="py-2.5 px-3.5 font-mono">Endpoint</th>
                <th class="py-2.5 px-3.5">Purpose &amp; Semantics</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-3.5 font-bold text-blue-600 dark:text-blue-400">GET</td>
                <td class="py-2.5 px-3.5 font-mono text-[12px]">/v1/notifications/{id}</td>
                <td class="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">Fetch overall and channel-level delivery status and timestamps.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-3.5 font-bold text-rose-600 dark:text-rose-400">POST</td>
                <td class="py-2.5 px-3.5 font-mono text-[12px]">/v1/notifications/{id}/cancel</td>
                <td class="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">Best-effort cancellation of eligible pending/scheduled jobs. Once accepted by an external carrier, recall is impossible.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-3.5 font-bold text-blue-600 dark:text-blue-400">GET</td>
                <td class="py-2.5 px-3.5 font-mono text-[12px]">/v1/users/{userId}/preferences</td>
                <td class="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">Read recipient opt-in settings per channel and category.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-3.5 font-bold text-amber-600 dark:text-amber-400">PUT</td>
                <td class="py-2.5 px-3.5 font-mono text-[12px]">/v1/users/{userId}/preferences</td>
                <td class="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">Update channel opt-ins; immediately invalidates redis preference cache.</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-3.5 font-bold text-purple-600 dark:text-purple-400">POST</td>
                <td class="py-2.5 px-3.5 font-mono text-[12px]">/v1/webhooks/{provider}</td>
                <td class="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">Receive carrier delivery receipts; verify HMAC signature and deduplicate.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,

    hideHighLevelArchitecture: true,
    hideStepByStepDesign: true,

    whyComponents: [
      { component: "1. Notification API", why: "Accepts notification requests from services such as Order Service and validates the request." },
      { component: "2. Idempotency Handler", why: "Prevents duplicate notifications when a client retries the same request." },
      { component: "3. Notification Database", why: "Stores notification details, delivery jobs, statuses, and delivery attempts." },
      { component: "4. Transactional Outbox", why: "Saves an event in the same database transaction as the notification so that the event is not lost if the queue is unavailable." },
      { component: "5. Outbox Publisher", why: "Reads pending events from the database and publishes them to the message queue." },
      { component: "6. Durable Queue", why: "Temporarily stores notification jobs and distributes them to workers, especially during traffic spikes." },
      { component: "7. Channel Workers", why: "Process queued jobs and send notifications through email, SMS, push, or in-app channels." },
      { component: "8. Preference and Consent Service", why: "Checks whether the user is allowed to receive a notification through the selected channel." },
      { component: "9. Template Service", why: "Creates the final message using templates, such as an order-confirmation email or push notification." },
      { component: "10. Provider Adapters", why: "Connect the system to external services such as Amazon SES for email, Twilio for SMS, and FCM/APNs for push notifications." },
      { component: "11. Webhook Handler", why: "Receives delivery updates from providers and updates notification statuses." },
      { component: "12. Dead-Letter Queue (DLQ)", why: "Stores jobs that still fail after the allowed retries, so they can be investigated later." },
      { component: "13. Observability", why: "Monitors system health, queue delays, delivery failures, retries, and provider performance." }
    ],

    tradeoffType: "table",
    tradeoffs: [
      {
        choice: "Event publication: Polling Outbox vs. CDC",
        upside: "Polling is simple and uses standard SQL; CDC offers zero-polling overhead and near-zero latency.",
        downside: "Polling adds DB query load; CDC requires Debezium/Kafka operational complexity."
      },
      {
        choice: "Queue architecture: One shared queue vs. Separate channel queues",
        upside: "Dedicated channel queues isolate slow SMS providers from fast push notifications.",
        downside: "Requires managing multiple queue topologies and independent worker autoscaling groups."
      },
      {
        choice: "Delivery model: Synchronous sends vs. Asynchronous workers",
        upside: "Asynchronous workers buffer traffic spikes and prevent third-party timeouts from crashing the API.",
        downside: "Adds eventual consistency latency and requires worker lease management."
      },
      {
        choice: "Retry policy: Immediate retry vs. Backoff with jitter",
        upside: "Exponential backoff with full jitter prevents thundering herd retry storms against failing providers.",
        downside: "Increases worst-case message delivery latency during network interruptions."
      },
      {
        choice: "Data storage: Relational database vs. NoSQL database",
        upside: "PostgreSQL provides ACID transactional boundaries across notification records and outbox events.",
        downside: "Requires read replicas and historical partition archival at extreme 100M+/day volume."
      },
      {
        choice: "Provider selection: Single provider vs. Multiple providers",
        upside: "Multiple providers allow failover resilience during carrier outages.",
        downside: "High risk of duplicate messages if switching providers after an ambiguous timeout; higher contract overhead."
      },
      {
        choice: "Delivery guarantees: At-least-once vs. Duplicate-resistant processing",
        upside: "Duplicate-resistant processing with provider idempotency prevents duplicate customer charges.",
        downside: "Requires maintaining idempotency state, request hashes, and deduplication tables."
      }
    ],

    // LOW-LEVEL DESIGN (LLD) & DEEP DIVE SECTIONS (Sections 4, 5, 7, 8, 9, 10, 11, 12, 13, 14)
    postTradeoffSections: getNotificationSystemLldSections(),

    followUps: [
      {
        q: "Why not send notifications directly from the API?",
        a: "Direct sends make API latency dependent on external providers. Provider outages can also exhaust API threads and cause upstream failures. Asynchronous processing decouples request acceptance from delivery."
      },
      {
        q: "What happens if the database write succeeds but queue publication fails?",
        a: "Because we use the Transactional Outbox pattern, the outbox event remains durably persisted in the database. The outbox publisher retries until the event is successfully published to the queue. The notification is never silently lost."
      },
      {
        q: "How do you prevent duplicate notifications?",
        a: "Use request idempotency keys, unique delivery-job constraints, stable event IDs, and idempotent processing. Use provider-supported idempotency keys when available. However, application-level deduplication alone cannot guarantee that an external provider will never send a duplicate after an ambiguous timeout."
      },
      {
        q: "What happens if a worker crashes after sending the notification?",
        a: "The queue will redeliver the message after the visibility lease expires. The next worker inspects the persisted job state and verifies the provider delivery status. If the provider may have accepted the message but the result was not recorded, the outcome must be treated as ambiguous rather than blindly retried."
      },
      {
        q: "How do you support millions of notifications per day?",
        a: "Horizontally scale workers, partition queues by channel or priority, batch work where providers support it, enforce provider rate limits, and monitor queue age. Partition or archive historical delivery data as needed."
      },
      {
        q: "How do you ensure marketing notifications respect opt-outs?",
        a: "Check consent and applicable preferences at acceptance and again immediately before delivery (the double checkpoint strategy). Suppress jobs that are no longer permitted, and record the suppression reason."
      },
      {
        q: "How do you know an email or SMS was actually delivered?",
        a: "Track provider acceptance separately from confirmed delivery. Use signed provider webhooks or delivery receipts where supported, deduplicate callback events, and represent missing receipts as unknown rather than falsely reporting success."
      },
      {
        q: "How would you support priority notifications?",
        a: "Use separate queues or priority-aware scheduling for urgent security alerts (OTPs) versus routine marketing messages. Apply quotas and fairness so high-volume tenants cannot starve other workloads."
      },
      {
        q: "How would you schedule a notification?",
        a: "Persist its scheduled timestamp in UTC, index jobs by status and due time (<code>status, scheduled_at</code>), and publish them to the delivery queue when due. A database scheduler or delayed queue can perform this task. Never sleep worker threads."
      },
      {
        q: "When would you introduce Kafka or Change Data Capture (CDC)?",
        a: "Consider them when event volume, replay requirements, ordering requirements, or database polling overhead justify the additional operational complexity. For moderate loads, an RDBMS polling publisher with <code>SKIP LOCKED</code> is simpler and robust."
      }
    ],

    // SECTION 17: FINAL ARCHITECTURE SUMMARY (Rendered after Follow-Ups)
    postSections: getNotificationSystemFinalSummarySection()
  });
}
