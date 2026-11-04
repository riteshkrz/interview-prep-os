/**
 * Question 10. Design a food delivery platform
 * System Design Interview Masterclass — Module 2: Consumer-scale applications (Pages 48–51)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderFoodDeliveryDetail() {
  return renderMasterclassQuestion({
    questionNumber: 10,
    title: "Design a food delivery platform",
    moduleName: "Module 2 — Consumer-scale applications",
    coreTopics: "product catalog, order lifecycle, inventory, payment orchestration, courier assignment, and coordinating work without a single monolithic transaction",

    problemStatement: `Design a system that connects customers, restaurants, and delivery partners. Customers place orders; restaurants accept or reject them; couriers carry out delivery; and customers follow order status as it changes.`,

    clarifyingQuestions: [
      { q: "Which roles and parties should the design include?", a: "The system serves customers, restaurants, delivery partners, and administrators." },
      { q: "Should customers see live tracking during delivery?", a: "Yes—tracking applies to orders currently being delivered." },
      { q: "Are card or wallet payments required?", a: "Yes, and the design should cover payment failure and refund flows." },
      { q: "Which problem is toughest to solve well?", a: "Ensuring correct end-to-end handling when restaurant confirmation, payment, and courier assignment must stay aligned." }
    ],

    functionalRequirements: [
      "Discover restaurants and view their menus.",
      "Hold cart contents and compute order totals.",
      "Submit orders and run payment processing.",
      "Surface whether the restaurant accepted or rejected the order.",
      "Match orders to delivery partners.",
      "Show order progress and courier status.",
      "Cancel orders that qualify and execute refunds."
    ],

    nonFunctionalRequirements: [
      "Orders must be created reliably.",
      "Guard against duplicate orders and duplicate charges.",
      "Authoritative order state for critical transitions needs strong consistency.",
      "Catalog and menu reads should remain low latency.",
      "The platform should tolerate failures from restaurants, couriers, and external providers.",
      "Real-time status delivery must scale with load."
    ],

    apiDesign: `GET /api/v1/restaurants?lat=37.77&lng=-122.41&radius=5km
GET /api/v1/restaurants/{id}/menu

POST /api/v1/orders
Idempotency-Key: ord-unique-req-789
Content-Type: application/json
{
  "restaurantId": "rest-45",
  "items": [{ "itemId": "item-1", "quantity": 2 }]
}

GET /api/v1/orders/{id}
POST /api/v1/orders/{id}/cancel
POST /api/v1/delivery-partners/location`,

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">Entities &amp; Relations</span>
Restaurant(restaurant_id, status, location)
MenuItem(item_id, restaurant_id, price, availability)
Order(order_id, customer_id, status, total, created_at)
OrderItem(order_id, item_id, quantity, unit_price)
Payment(payment_id, order_id, amount, status)
Delivery(delivery_id, order_id, partner_id, status)
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Store price snapshots in <code>OrderItem</code> so subsequent menu price edits do not alter past purchases or invalidate receipts.
        </p>
      </div>
    `,

    highLevelArchitecture: `Shopper app &rarr; API gateway &rarr; catalog/cart/order services.<br/><br/>
    The order service saves a pending order and publishes an event. Payment, restaurant confirmation, and dispatch each handle a segment of the pipeline. A notification or live-update path pushes state changes to customers.`,

    architectureDiagram: `[Customer] ──► [API Gateway] ──► [Order Service]
                                       │ (1. Create Order: PENDING)
                                       ▼
                             [Saga Orchestrator]
                                ├── (2. Authorize Payment) ──► [Payment Service]
                                ├── (3. Accept / Reject)   ──► [Restaurant App]
                                └── (4. Dispatch Courier)  ──► [Dispatch Service]
                                       │
                                       ▼ (Publish OrderStateChanged)
                                  [Event Bus]
                                       │
                                       ▼
                             [Notification Engine] ──► Push Updates to Customer`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Cache menus while the user browses",
        stepBody: "Expose restaurant and menu metadata through a cache in front of the catalog database. Browsing can allow short-lived staleness, but checkout must re-check price and item availability."
      },
      {
        stepNumber: 2,
        stepTitle: "Write the order in a pending state",
        stepBody: "The order service verifies cart lines, restaurant status, pricing, and quantities, then records the order with an idempotency key and an initial lifecycle state."
      },
      {
        stepNumber: 3,
        stepTitle: "Orchestrate payment steps",
        stepBody: "Start payment capture or authorization for the selected method. Payment and order persistence are not one shared transaction, so define explicit states and recovery behavior."
      },
      {
        stepNumber: 4,
        stepTitle: "Seek confirmation from the restaurant",
        stepBody: "Emit an order event and ask the restaurant to accept. Rejection or a missed deadline should move the order into a specified cancellation or failure outcome."
      },
      {
        stepNumber: 5,
        stepTitle: "Attach a courier to the order",
        stepBody: "Dispatch selects a qualified partner and sends an offer. Confirm assignment in one atomic step so two in-flight orders cannot reserve the same active courier."
      },
      {
        stepNumber: 6,
        stepTitle: "Align state transitions across services",
        stepBody: "Represent the order lifecycle explicitly—for example: <code>PENDING &rarr; CONFIRMED &rarr; PREPARING &rarr; PICKED_UP &rarr; DELIVERED</code>. Define cancellation, timeout and compensation behavior for every important transition."
      },
      {
        stepNumber: 7,
        stepTitle: "Close out delivery and downstream financial work",
        stepBody: "Log delivery completion and drive final financial steps. When reversal or refund is needed, rely on durable requests plus reconciliation."
      }
    ],

    whyComponents: [
      { component: "Catalog service", why: "Tuned for fast restaurant and menu reads" },
      { component: "Order service", why: "Source of truth for order lifecycle and state" },
      { component: "Payment service", why: "Owns calls to payment providers and financial records" },
      { component: "Restaurant service", why: "Manages acceptance, prep updates, and rejection" },
      { component: "Dispatch service", why: "Locates delivery partners and binds them to orders" },
      { component: "Event bus", why: "Insulates core writes from notifications and background work" },
      { component: "Notification service", why: "Pushes status updates without stalling primary flows" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Strict checkout validation:</strong> Improves correctness at the price of extra round-trip latency.",
      "<strong>Event-driven workflows:</strong> Boost resilience while leaving brief gaps in cross-service consistency.",
      "<strong>Microservices segregation:</strong> Lets teams scale pieces separately but complicates tracing and recovery across the full path.",
      "<strong>Saga-style compensation:</strong> Replaces distributed 2PC locking, yet demands durable retries when a compensating step fails."
    ],

    followUps: [
      {
        q: "Payment completes but confirming the order fails.",
        a: "“Keep payment and order state in separate stores, make transitions idempotent, and reconcile. If fulfillment is not possible, refund or void according to the payment provider's capabilities.”"
      },
      {
        q: "The restaurant accepts, yet no courier can be assigned.",
        a: "“Retry matching, expand the search radius, or follow the configured timeout policy. If the order cannot continue, cancel and compensate instead of leaving it stuck in an unclear state.”"
      },
      {
        q: "What keeps duplicate orders from being created?",
        a: "“Require an idempotency key with a unique constraint and, on client retry, return the outcome of the original order.”"
      }
    ]
  });
}
