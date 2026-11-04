/**
 * Question 9. Design Uber
 * System Design Interview Masterclass — Module 2: Consumer-scale applications (Pages 44–47)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderUberDetail() {
  return renderMasterclassQuestion({
    questionNumber: 9,
    title: "Design Uber",
    moduleName: "Module 2 — Consumer-scale applications",
    coreTopics: "geospatial indexing, real-time location ingestion, driver matching, trip state, and concurrency control",

    problemStatement: `Design a ride-hailing platform where riders request rides, the system locates and dispatches nearby drivers, and trip progress is tracked through completion and payment.`,

    clarifyingQuestions: [
      { q: "Do we cover both riders and drivers?", a: "Yes—availability, requests, matching, and trip tracking are all in scope." },
      { q: "How current must driver location data be?", a: "Refresh active driver positions every few seconds." },
      { q: "Should we compute fares?", a: "Yes, at a conceptual level." },
      { q: "What is the primary correctness constraint?", a: "No driver may hold two active trips at once." },
      { q: "Is live trip tracking required?", a: "Yes, for the duration of an active trip." }
    ],

    functionalRequirements: [
      "Sign up and authenticate riders and drivers.",
      "Ingest driver availability and location updates.",
      "Let riders request trips and see fare estimates.",
      "Locate nearby drivers who qualify for the request.",
      "Send dispatch offers and lock in a matched driver.",
      "Follow trip state and location over time.",
      "Close out trips and run payment."
    ],

    nonFunctionalRequirements: [
      "Short matching latency.",
      "Strong availability in served regions.",
      "Location updates that scale with fleet size.",
      "Up-to-date locations for choosing candidates.",
      "Accurate driver assignment and valid trip-state changes.",
      "Protect personal and location data appropriately."
    ],

    apiDesign: `POST /api/v1/trips/estimate
// Request: { "pickup": { "lat": 37.77, "lng": -122.41 }, "destination": { "lat": 37.79, "lng": -122.40 } }
// Returns: { "estimatedFare": 2450, "currency": "USD", "etaMinutes": 4 }

POST /api/v1/trips
// Starts matching workflow; returns tripId

POST /api/v1/drivers/location
// High-frequency ping: { "driverId": "d-123", "lat": 37.7749, "lng": -122.4194, "timestamp": 1697000000 }

POST /api/v1/drivers/availability
// Body: { "isAvailable": true }

GET /api/v1/trips/{tripId}
POST /api/v1/trips/{tripId}/cancel`,

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">Driver &amp; Trip Models</span>
Driver:
  driver_id, status (OFFLINE / IDLE / MATCHED / ON_TRIP), last_location, location_timestamp, vehicle_type

Trip:
  trip_id, rider_id, driver_id, pickup_location, destination, status, fare, created_at, updated_at
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Maintain the ephemeral location index (e.g., Redis / H3 / Geohash) separate from durable trip history because locations change every 3 seconds and are queried differently from persistent trip records.
        </p>
      </div>
    `,

    highLevelArchitecture: `Rider-side app &rarr; Trip API &rarr; trip service.<br/>
    Driver-side app &rarr; location ingestion &rarr; geospatial index.<br/><br/>
    The matching service searches nearby eligible drivers, ranks them, and sends offers via the dispatch service. A conditional assignment ensures at most one trip claims a given driver. A trip-state service records progress and ties together maps, notifications, and payments.`,

    architectureDiagram: `[Driver Device] ──(Pings every 3s)──► [Location Ingestion] ──► [Geospatial Index (H3/Redis)]
                                                                          ▲
[Rider Device] ──(Request Ride)──► [Trip API]                             │ (Query nearby)
                                        │                                 │
                                        ▼                                 │
                                 [Matching Service] ──────────────────────┘
                                        │ (Rank & Select candidates)
                                        ▼
                                 [Dispatch Service] ──► [Push offer to Driver]
                                        │ (Driver accepts)
                                        ▼ (Atomic conditional update)
                               [Trip State Machine] ──► [PostgreSQL (Authoritative)]
                                        │
                                        ▼ (Trip Completed)
                                 [Payment Service]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Collect driver location updates",
        stepBody: "Drivers publish timestamped location updates. Validate each update, refresh the latest position, and treat location as stale when updates stop arriving."
      },
      {
        stepNumber: 2,
        stepTitle: "Map those locations into a geospatial index",
        stepBody: "Employ a geospatial index, geohash cells, or H3-style cell IDs to query nearby drivers efficiently. Shard by geographic region when it helps."
      },
      {
        stepNumber: 3,
        stepTitle: "Discover nearby drivers and rank them",
        stepBody: "Query neighboring cells and drop drivers who are offline, already on a trip, or otherwise ineligible. Order survivors by estimated road time, vehicle type, and applicable service rules."
      },
      {
        stepNumber: 4,
        stepTitle: "Issue dispatch offers",
        stepBody: "Deliver an offer to one or more candidates per dispatch policy. Set offer timeouts so drivers are not left blocked indefinitely waiting on rider or driver replies."
      },
      {
        stepNumber: 5,
        stepTitle: "Commit driver assignment in one atomic step",
        stepBody: "Many riders may search concurrently, but the canonical driver record must move from available to assigned exactly once. Apply conditional writes, locks, or comparable concurrency control."
      },
      {
        stepNumber: 6,
        stepTitle: "Advance and track trip state",
        stepBody: "Use explicit state transitions such as <code>REQUESTED &rarr; MATCHED &rarr; DRIVER_ARRIVING &rarr; IN_PROGRESS &rarr; COMPLETED</code>. Cancellation and payment state must be modeled with defined rules."
      },
      {
        stepNumber: 7,
        stepTitle: "Finish the trip and charge the rider",
        stepBody: "Record trip completion and emit a durable payment request. The payment subsystem handles retries, provider webhooks, and reconciliation."
      }
    ],

    whyComponents: [
      { component: "Location ingestion", why: "Absorbs high-frequency updates outside the trip path" },
      { component: "Geospatial index", why: "Locates nearby drivers quickly" },
      { component: "Matching service", why: "Encodes eligibility and ranking rules" },
      { component: "Dispatch service", why: "Coordinates offers, responses, timeouts, and retries" },
      { component: "Trip-state store", why: "Guards valid transitions and aids recovery" },
      { component: "Payment integration", why: "Isolates billing reliability from matching" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>More frequent location pings:</strong> Improve matching freshness but drain driver phone battery and burn cellular bandwidth.",
      "<strong>Bigger geographic cells:</strong> Cut lookup cost and index size, but weaken spatial accuracy.",
      "<strong>Serial offers (one driver at a time):</strong> Simplifies lock control and guarantees no race conditions, but can slow matching time significantly.",
      "<strong>Parallel offers:</strong> Shortens rider wait time, but creates higher contention and wasted driver responses.",
      "<strong>Eventual consistency:</strong> Sufficient for discovering candidate drivers in radius, but strictly forbidden for the final binding assignment."
    ],

    followUps: [
      {
        q: "What happens when two riders request the same driver?",
        a: "“Both requests might list the driver as eligible in the radius search, but only one conditional assignment should win. The loser should pick another driver or keep searching.”"
      },
      {
        q: "What if a driver's last known location is stale?",
        a: "“Check the timestamp against a freshness window (e.g. 15–30 seconds). Omit stale drivers or rank them lower until a new update arrives.”"
      },
      {
        q: "How do you handle a sudden demand spike in one city?",
        a: "“Partition location and matching by region, scale ingestion and workers, track queue backlog, and keep one hot city from consuming capacity for the entire fleet.”"
      }
    ]
  });
}
