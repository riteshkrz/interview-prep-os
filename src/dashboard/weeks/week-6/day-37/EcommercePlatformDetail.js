/**
 * Question 16. Design an e-commerce platform
 * System Design Interview Masterclass — Module 4: Business-critical systems (Pages 71–74)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderEcommercePlatformDetail() {
  return renderMasterclassQuestion({
    questionNumber: 16,
    title: "Design an e-commerce platform",
    moduleName: "Module 4 — Business-critical systems",
    coreTopics: "product catalog, shopping cart, checkout, inventory holds, orders, payment orchestration, and fulfillment",

    problemStatement: `Architect an e-commerce system where shoppers discover products, maintain carts, place orders, pay, and monitor delivery. The design must survive traffic surges while avoiding overselling and incorrect monetary outcomes.`,

    clarifyingQuestions: [
      { q: "Which shopping capabilities must the system support?", a: "Capabilities span product discovery, the shopping cart, checkout, payments, stock management, and order status." },
      { q: "What scale are we targeting?", a: "Millions of users, with catalog browsing load much greater than checkout volume." },
      { q: "How critical is inventory accuracy?", a: "Very—constrained stock cannot be sold beyond what the chosen reservation model permits." },
      { q: "Are promotions in scope?", a: "Straightforward discounts are fine; a sophisticated promotion engine is excluded." },
      { q: "Should cancellation and refunds be supported?", a: "Yes, for orders that qualify under policy." }
    ],

    functionalRequirements: [
      "Discover and browse products.",
      "See product pricing and whether items are in stock.",
      "Add, change, and delete cart line items.",
      "Complete checkout and payment.",
      "Reserve stock or reduce on-hand inventory.",
      "Follow order and shipment progress.",
      "Cancel qualifying orders and start refunds."
    ],

    nonFunctionalRequirements: [
      "High read volume for catalog and product pages.",
      "Sound concurrency control on inventory.",
      "Persistent order and payment records.",
      "Secure checkout flows.",
      "Stability under promotional traffic bursts.",
      "Dependable recovery when failures occur mid-flow."
    ],

    apiDesign: `GET /api/v1/products/{productId}
GET /api/v1/search?q={query}&category={cat}&sort=price_asc
POST /api/v1/cart/items
// Body: { "productId": "prod_123", "quantity": 1 }

POST /api/v1/checkout
Idempotency-Key: chk_client_trans_55
Content-Type: application/json
{
  "cartId": "cart_88",
  "paymentMethodId": "pm_card_999",
  "shippingAddressId": "addr_44"
}

GET /api/v1/orders/{orderId}
POST /api/v1/orders/{orderId}/cancel`,

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">E-Commerce Data Models</span>
Product(product_id, title, price, status)
Inventory(product_id, available_qty, reserved_qty)
Cart(cart_id, user_id)
CartItem(cart_id, product_id, quantity)
Order(order_id, user_id, status, total_amount)
OrderItem(order_id, product_id, quantity, unit_price)
Payment(payment_id, order_id, amount, status)
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Store a price snapshot on the order so later catalog price changes do not alter what the customer was charged.
        </p>
      </div>
    `,

    highLevelArchitecture: `Traffic path: Client &rarr; API gateway &rarr; catalog, search, and cart backends.<br/><br/>
    Checkout hands off to the order service, which orchestrates inventory reservation and payment. Durable order events drive fulfillment, shipping alerts, and analytics.`,

    architectureImage: '/images/hld/q16_ecommerce_architecture.svg',
    architectureImageTitle: 'Design an E-Commerce Platform — Microservices Topology & Flash Sale Inventory Pipeline',

    architectureDiagram: `[Shopper Client] ──► [API Gateway]
                            ├── (Read Path: Caching) ──► [Catalog / Search Service] ──► [Elasticsearch / Redis]
                            ├── (Cart Path)          ──► [Cart Service] ──► [Redis Session Store]
                            └── (Checkout Path)      ──► [Order Service]
                                                              │ (1. Reserve Inventory)
                                                              ├──► [Inventory DB] (Atomic SQL Hold)
                                                              │ (2. Charge Payment)
                                                              ├──► [Payment Service] ──► [Stripe / Provider]
                                                              │ (3. Commit Order & Publish)
                                                              ▼
                                                        [Transactional Outbox]
                                                              │
                                                              ▼
                                                        [Event Bus (Kafka)] ──► [Fulfillment & Shipping]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Tune browsing and catalog reads for scale",
        stepBody: "Cache product metadata and route text search through a search index. Cached and indexed results may lag slightly, but checkout must re-check price, product status, and stock against the source of truth."
      },
      {
        stepNumber: 2,
        stepTitle: "Persist and update cart contents reliably",
        stepBody: "Treat cart contents separately from finalized orders. Unless the business explicitly reserves inventory for carts, the cart must not promise that items remain available."
      },
      {
        stepNumber: 3,
        stepTitle: "Insert an order record in pending status",
        stepBody: "During checkout, check item availability, pricing, and counts; then save the order using a unique ID plus an idempotency key."
      },
      {
        stepNumber: 4,
        stepTitle: "Hold stock in a single atomic operation",
        stepBody: `Apply a conditional update or transaction so stock is reserved only when sufficient quantity remains:
        <pre class="mt-2 p-2.5 rounded bg-[#0B0F17] text-emerald-400 font-mono text-[12px]">UPDATE Inventory
SET available_qty = available_qty - :qty,
    reserved_qty = reserved_qty + :qty
WHERE product_id = :productId
  AND available_qty >= :qty;</pre>
        The service must confirm that the intended row actually changed. Multi-SKU orders require an explicit plan for reserving several products without leaving partial holds open indefinitely.`
      },
      {
        stepNumber: 5,
        stepTitle: "Drive the payment flow to completion",
        stepBody: "Invoke payment authorization or capture per the business rules. Because order state and payment state live in separate stores, the design must tolerate uncertainty and safe retries."
      },
      {
        stepNumber: 6,
        stepTitle: "Either commit the outcome or roll back with compensation",
        stepBody: "On successful payment, confirm the order and finalize inventory per the reservation rules. On failure or timeout, reconcile payment status and release holds when the policy says to."
      },
      {
        stepNumber: 7,
        stepTitle: "Ship and notify using background processing",
        stepBody: "Emit confirmed-order events for shipping, inventory reporting, and notifications. Do not block the checkout response until unrelated downstream tasks finish."
      }
    ],

    whyComponents: [
      { component: "Catalog / search", why: "Tuned for read-heavy product discovery" },
      { component: "Cart service", why: "Holds shopping intent before an order is committed" },
      { component: "Order service", why: "Central authority for the purchase lifecycle" },
      { component: "Inventory service", why: "Applies authoritative stock limits" },
      { component: "Payment service", why: "Interfaces with external payment providers" },
      { component: "Event bus / outbox", why: "Ensures business state changes reach downstream consumers reliably" },
      { component: "Fulfillment service", why: "Runs shipping and downstream order processing" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Relational transactions:</strong> Ease inventory correctness and prevent overselling, but can turn into a row-lock bottleneck during massive flash sales.",
      "<strong>Event-driven microservices:</strong> Scale in isolation, but introduce eventual consistency and complex saga rollback compensations.",
      "<strong>Reservations (holds):</strong> Prevent overselling, but temporarily tie up inventory if shoppers abandon checkout sessions.",
      "<strong>Cached catalog data:</strong> Drastically lowers read latency, but must never drive final binding checkout decisions without source-of-truth validation.",
      "<strong>Aggressive checkout rate limits:</strong> Protect inventory database correctness, but can hurt business conversion during unexpected traffic surges."
    ],

    followUps: [
      {
        q: "What design keeps inventory counts from going negative through overselling?",
        a: "“Rely on atomic conditional writes (<code>WHERE available_qty >= :qty</code>), transactions, or another source-of-truth concurrency mechanism. Never let cached stock figures authorize the final reservation.”"
      },
      {
        q: "How do you recover when payment worked but confirming the order did not?",
        a: "“Record payment results, drive state changes idempotently, and reconcile orders stuck in pending. Confirm when the purchase is still valid; otherwise follow the void or refund workflow.”"
      },
      {
        q: "How would you architect for a flash sale traffic surge?",
        a: "“Warm catalog caches ahead of time, ring-fence checkout resources, harden the inventory write path (e.g. Redis Lua counters with async DB sync), and use queues or throttling as needed. Watch lock and update contention on high-demand SKUs.”"
      }
    ]
  });
}
