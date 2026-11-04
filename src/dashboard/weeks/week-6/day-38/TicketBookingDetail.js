/**
 * Question 17. Design a ticket booking system
 * System Design Interview Masterclass — Module 4: Business-critical systems (Pages 75–78)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderTicketBookingDetail() {
  return renderMasterclassQuestion({
    questionNumber: 17,
    title: "Design a ticket booking system",
    moduleName: "Module 4 — Business-critical systems",
    coreTopics: "available seats, time-bound holds, optimistic concurrency control, coordinated payments, and avoiding double booking",

    problemStatement: `Design an event ticketing system where buyers see open seats, hold them briefly, pay, and receive a confirmed ticket. No seat may end up confirmed for more than one booking.`,

    clarifyingQuestions: [
      { q: "Are seats assigned to specific numbers?", a: "Yes, begin with numbered seating." },
      { q: "Should checkout block the seat for the buyer?", a: "That is acceptable; the hold window is five minutes." },
      { q: "Is double booking allowed?", a: "No—a confirmed seat must belong to exactly one booking." },
      { q: "What happens when payment is slow?", a: "Rely on a fixed timeout and a documented late-payment policy." },
      { q: "Do we need virtual queues?", a: "They may be needed for major ticket releases, but not in the first version." }
    ],

    functionalRequirements: [
      "Find events and inspect seats.",
      "Display which seats are free.",
      "Create a short-lived seat hold.",
      "Run payment.",
      "Finalize bookings and deliver tickets.",
      "Drop holds that have timed out.",
      "Allow cancellation and refunds when policy permits."
    ],

    nonFunctionalRequirements: [
      "Strict correctness for who owns each seat.",
      "High availability while users browse.",
      "Robustness during on-sale traffic spikes.",
      "Trustworthy payment orchestration.",
      "Fast reads for availability.",
      "Defenses against bots and abuse."
    ],

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">SeatInventory &amp; Booking Schemas</span>
SeatInventory:
  event_id, seat_id, status (AVAILABLE / HELD / BOOKED), hold_id, hold_expires_at, booking_id, version

Booking:
  booking_id, customer_id, event_id, status (PENDING / CONFIRMED / CANCELLED), amount, created_at, expires_at
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          The combination of <code>(event_id, seat_id)</code> must be uniquely constrained. The authoritative store must support the conditional state transitions required by the design.
        </p>
      </div>
    `,

    highLevelArchitecture: `Request chain: Client &rarr; booking API &rarr; availability service &rarr; authoritative seat-inventory store.<br/><br/>
    A successful conditional hold yields a pending booking. Payment runs through the payment service; a payment-result handler either confirms the booking or clears the hold. Tickets are issued only after confirmation.`,

    architectureImage: '/images/hld/q17_ticket_booking_architecture.svg',
    architectureImageTitle: 'Design a Ticket Booking System (Ticketmaster) — Seat Reservation & Distributed Lock Pipeline',

    architectureDiagram: `[Buyer Client] ──► [Booking API] ──► [Availability Service] ──► [Seat Cache (Redis)]
       │ (1. Reserve Seats)
       ▼
[Inventory Engine] ──(Conditional CAS / SQL Update)──► [Authoritative Seat DB]
       │ (Success: Seat status = HELD, holdId = h123, expiresAt = now + 5m)
       ▼
[Booking Service] ──(Creates Booking: PENDING)
       │ (2. Forward to Payment)
       ▼
[Payment Service] ──► [Payment Gateway]
       │
       ├── (Payment Success) ──► Confirm Seat: status = BOOKED ──► [Ticket Issuer]
       └── (Payment Failure) ──► Revert Seat: status = AVAILABLE
       │
[Expiry Scanner Worker] ───────► (Releases seats where hold_expires_at < NOW and status = HELD)`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Present which seats are still open",
        stepBody: "Load inventory from the authoritative store or a sufficiently fresh replica. What the user sees is a point-in-time view—someone else may take the seat before they finish checkout."
      },
      {
        stepNumber: 2,
        stepTitle: "Place a short-lived hold on chosen seats",
        stepBody: "Use a transaction or conditional state transition to change the seat from <code>AVAILABLE</code> to <code>HELD</code>. Store a unique hold ID, customer/booking reference, and expiry time. At most one in-flight request should win."
      },
      {
        stepNumber: 3,
        stepTitle: "Open a booking that remains pending until paid",
        stepBody: "Link the hold to a booking record. Supply an idempotency key so retries surface the same logical booking rather than spawning extra holds."
      },
      {
        stepNumber: 4,
        stepTitle: "Collect payment from the customer",
        stepBody: "Charge using a stable idempotency key. The five-minute hold and payment timeout must follow aligned rules so paying customers are not stuck in unclear states."
      },
      {
        stepNumber: 5,
        stepTitle: "Confirm seat assignment in one atomic step",
        stepBody: "When payment succeeds, recheck the authoritative seat state and hold identity before transitioning to <code>BOOKED</code>. Issue the ticket only after the booking is confirmed."
      },
      {
        stepNumber: 6,
        stepTitle: "Deal with payments that arrive after the deadline",
        stepBody: "When payment completes after the hold ends, follow a clear policy. Do not assign the seat if it is already booked. Void or refund as required and inform the customer."
      },
      {
        stepNumber: 7,
        stepTitle: "Release expired holds without corrupting inventory",
        stepBody: "A background job scans for expired holds. It frees a seat only if the hold ID and state still match, so a stale expiry cannot undo a seat that was re-held or sold."
      },
      {
        stepNumber: 8,
        stepTitle: "Guard capacity when tickets go on sale",
        stepBody: "Use admission queues, per-user rate limits, and capped concurrency when demand exceeds what the inventory database can handle safely."
      }
    ],

    whyComponents: [
      { component: "Availability service", why: "Returns seat views efficiently" },
      { component: "Authoritative inventory store", why: "Source of truth for who owns each seat" },
      { component: "Temporary hold", why: "Buys the customer time to pay" },
      { component: "Payment service", why: "Isolates provider interactions from seat inventory logic" },
      { component: "Expiry worker", why: "Clears abandoned holds safely" },
      { component: "Ticket issuer", why: "Emits tickets only once a booking is confirmed" },
      { component: "Virtual waiting room", why: "Absorbs extreme traffic demand when on-sale spikes hit" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Strong transactional guarantees:</strong> Justify the coordination overhead for assigned, non-fungible seats.",
      "<strong>Redis locks vs. DB:</strong> A Redis lock alone is inadequate unless its durability and concurrency semantics satisfy strict requirements; the definitive seat transition must come from the authoritative store.",
      "<strong>Brief holds (e.g. 2 min):</strong> Free inventory faster, but can frustrate slower buyers.",
      "<strong>Longer holds (e.g. 15 min):</strong> Ease checkout UX, but shrink sellable capacity during on-sale rushes.",
      "<strong>Virtual waiting rooms:</strong> Limit system overload, but add buyer wait time and fairness concerns."
    ],

    followUps: [
      {
        q: "Two users pick the same seat at the same moment—what is the outcome?",
        a: "“Both may see the seat as available, but only one atomic transition from <code>AVAILABLE</code> to <code>HELD</code> succeeds. The other receives an unavailable-seat response.”"
      },
      {
        q: "Payment clears after the hold has already expired—then what?",
        a: "“Consult the authoritative seat record again. If the seat is taken, refuse confirmation for that buyer. Trigger the configured refund or void flow and align payment records.”"
      },
      {
        q: "Why not keep held seats in application server memory?",
        a: "“Traffic lands on many app instances that can restart anytime. Holds belong in a shared system of record with durable, atomic updates to seat state.”"
      }
    ]
  });
}
