/**
 * Question 1. Design a URL shortener like Bitly
 * System Design Interview Masterclass — Module 1: Core system design (Pages 12–17)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderUrlShortenerDetail() {
  return renderMasterclassQuestion({
    questionNumber: 1,
    title: "Design a URL shortener like Bitly",
    moduleName: "Module 1 — Core system design",
    coreTopics: "generating unique IDs, key-value stores, caching, HTTP redirects, and async analytics",
    
    problemStatement: `You need a service that ingests a long URL and emits a short URL; visiting the short link should redirect the browser to the original long URL. The design should deliver quick redirects, non-colliding short codes, heavy read traffic, and dependable storage for URL mappings.`,

    problemExample: `
      <div class="flex flex-col gap-2 font-mono text-[13px]">
        <div class="text-slate-400">Example Input:</div>
        <div class="p-2.5 rounded bg-[#0B0F17] text-amber-300 border border-[#24314A]">https://example.com/products/electronics/mobile/12345</div>
        <div class="text-slate-400 mt-1">Becomes:</div>
        <div class="p-2.5 rounded bg-[#0B0F17] text-emerald-400 border border-[#24314A]">https://sho.rt/aZ81kQ</div>
      </div>
    `,

    clarifyingQuestions: [
      { q: "Must users register accounts?", a: "Users can shorten URLs without accounts at first; registered users may manage their links." },
      { q: "Can users pick custom short aliases?", a: "Yes, such as sho.rt/summer-sale, provided each alias is unique." },
      { q: "Should shortened URLs expire?", a: "Link expiration is optional." },
      { q: "Do we need click analytics?", a: "Yes—record basic click counts and timestamps; richer reporting can run asynchronously." },
      { q: "What traffic and scale should we plan for?", a: "Plan for 100 million new URLs per month, with redirect volume far exceeding creation volume." },
      { q: "Must the service be globally available?", a: "Yes—the redirect path needs high availability." }
    ],

    functionalRequirements: [
      "Produce a short URL from a valid long URL.",
      "Resolve a short URL with an HTTP redirect to the original long URL.",
      "Optional custom aliases and optional expiration.",
      "Let authorized users view, disable, or delete their links.",
      "Capture click events and expose basic analytics.",
      "Mitigate abuse you can foresee, including spammed create calls or unsafe target URLs."
    ],

    nonFunctionalRequirements: [
      "Low latency: Aim for roughly 100 ms or less on the redirect path under normal load, not counting all network and client-side delay.",
      "Availability: Keep redirects working for links that already exist.",
      "Uniqueness: No two active mappings should accidentally reuse the same short code.",
      "Durability: A completed create must survive application process restarts.",
      "Scalability: Handle redirect traffic well above write volume.",
      "Security: Validate input, curb abuse, and allow disabling malicious links."
    ],

    customSections: [
      {
        title: "Capacity Estimation",
        content: `
          <div class="flex flex-col gap-3">
            <p>Take 100 million URL creates per month as the baseline:</p>
            <ul class="list-disc pl-5 flex flex-col gap-1.5 font-mono text-[13px]">
              <li>Mean create rate: <strong>100,000,000 / 2,592,000 &approx; 39 creations per second</strong>.</li>
              <li>Expect about 100 redirects per created link over its useful life &mdash; roughly <strong>10 billion redirects per month</strong>.</li>
              <li>Mean redirect load: <strong>about 3,858 requests per second</strong>.</li>
              <li>At ten times average peak traffic, size the redirect tier for around <strong>39,000 requests per second</strong>.</li>
              <li>At roughly 500 bytes per mapping including metadata, 100 million rows land near <strong>50 GB</strong> before replication, indexes, and operational overhead.</li>
            </ul>
            <div class="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-800 dark:text-cyan-200 text-[13px] font-semibold">
              Design takeaway: Favor read-heavy throughput and cache hot mappings aggressively.
            </div>
          </div>
        `
      }
    ],

    apiDesign: `// Shorten a URL
POST /api/v1/urls
Content-Type: application/json
Request:
{
  "longUrl": "https://example.com/products/123",
  "customAlias": null,
  "expiresAt": null
}

Response:
{
  "code": "aZ81kQ",
  "shortUrl": "https://sho.rt/aZ81kQ"
}

// Follow redirect
GET /aZ81kQ
HTTP/1.1 302 Found
Location: https://example.com/products/123

// Management endpoints (Require authentication)
GET /api/v1/urls
GET /api/v1/urls/{id}
DELETE /api/v1/urls/{id}`,

    dataModel: `
      <div class="flex flex-col gap-4">
        <div class="overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-[#24314A]">
          <table class="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr class="bg-[#F1F5F9] dark:bg-[#0F1626] text-[#1E293B] dark:text-slate-200 border-b border-[#E2E8F0] dark:border-[#24314A]">
                <th class="py-2.5 px-3 font-bold">Column</th>
                <th class="py-2.5 px-3 font-bold">Role</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#24314A] font-mono">
              <tr><td class="py-2 px-3 text-cyan-600 dark:text-cyan-400 font-bold">code</td><td class="py-2 px-3 font-sans text-slate-700 dark:text-slate-300">Distinct short code; primary key</td></tr>
              <tr><td class="py-2 px-3 text-cyan-600 dark:text-cyan-400 font-bold">long_url</td><td class="py-2 px-3 font-sans text-slate-700 dark:text-slate-300">Long URL destination</td></tr>
              <tr><td class="py-2 px-3 text-cyan-600 dark:text-cyan-400 font-bold">created_by</td><td class="py-2 px-3 font-sans text-slate-700 dark:text-slate-300">Owner user ID, if any</td></tr>
              <tr><td class="py-2 px-3 text-cyan-600 dark:text-cyan-400 font-bold">created_at</td><td class="py-2 px-3 font-sans text-slate-700 dark:text-slate-300">When the mapping was created</td></tr>
              <tr><td class="py-2 px-3 text-cyan-600 dark:text-cyan-400 font-bold">expires_at</td><td class="py-2 px-3 font-sans text-slate-700 dark:text-slate-300">Optional expiry timestamp</td></tr>
              <tr><td class="py-2 px-3 text-cyan-600 dark:text-cyan-400 font-bold">status</td><td class="py-2 px-3 font-sans text-slate-700 dark:text-slate-300">Whether the link is active or disabled</td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-[12.5px] text-slate-500 italic">Add a unique database constraint on <code>code</code>. If custom aliases are supported, they must follow the same uniqueness rules.</p>
        
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-[12px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 block mb-1">Click and Analytics Record (ClickEvent)</span>
          <pre class="font-mono text-[12px] text-slate-700 dark:text-slate-300">event_id, short_code, event_timestamp, referrer, country_or_region, user_agent_category</pre>
          <span class="text-[11px] text-slate-500 block mt-1">Collect only the personal data analytics legitimately need.</span>
        </div>
      </div>
    `,

    highLevelArchitecture: `Two dominant paths: <strong>URL creation</strong> and <strong>URL redirection</strong>.<br/><br/>
    • <strong>Create path:</strong> Client &rarr; Load balancer/API gateway &rarr; URL creation service &rarr; ID generator &rarr; mapping database &rarr; short URL response.<br/>
    • <strong>Redirect path:</strong> Browser &rarr; Redirect service &rarr; Redis cache &rarr; mapping database on cache miss &rarr; HTTP redirect.<br/>
    • Click events enqueue asynchronously; a queue consumer aggregates them into an analytics store.`,

    architectureImage: '/images/url-shortener-hld-architecture.png',
    architectureImageTitle: 'Design a URL Shortener (Bitly) — Complete Architecture & Creation vs Redirect Flows',

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Produce a unique short code",
        stepBody: "Obtain a unique numeric ID from a dedicated generator and encode it in Base62 (digits, lowercase, and uppercase letters). With random codes, rely on a database uniqueness constraint and retries to resolve collisions."
      },
      {
        stepNumber: 2,
        stepTitle: "Persist the mapping durably",
        stepBody: "The creation path validates the URL and writes the mapping. A relational database fits early scale; a distributed key-value store may suit higher volume and throughput—pick storage to match query patterns and consistency needs."
      },
      {
        stepNumber: 3,
        stepTitle: "Streamline the redirect path",
        stepBody: "Look up the short code in Redis first. Cache hits return the destination without touching the database; misses read the mapping database and warm the cache."
      },
      {
        stepNumber: 4,
        stepTitle: "Issue the HTTP redirect",
        stepBody: "The service checks that the mapping exists, is active and has not expired, then returns the appropriate redirect response. <strong>301</strong> can enable permanent caching but makes destination changes and click measurement less predictable. <strong>302</strong> is a safer default for changeable links."
      },
      {
        stepNumber: 5,
        stepTitle: "Handle analytics off the hot path",
        stepBody: "Publish each click to a queue; a worker aggregates counts and writes the analytics store while the redirect response returns immediately."
      },
      {
        stepNumber: 6,
        stepTitle: "Layer in resilience features and abuse mitigation",
        stepBody: "Scale stateless app tiers horizontally, replicate the mapping database as needed, rate-limit URL creation, and provide reporting plus disable flows for abusive links."
      }
    ],

    whyComponents: [
      { component: "Front-end load balancer", why: "Distributes requests across application instances and steers traffic away from unhealthy ones" },
      { component: "Edge API gateway", why: "Applies shared request policies, authentication for management APIs, and rate limits" },
      { component: "Short-link creation service", why: "Checks destinations and persists new mappings" },
      { component: "Unique ID generator", why: "Issues unique IDs before encoding" },
      { component: "URL mapping database", why: "Holds durable short-code-to-destination rows" },
      { component: "Redis (hot cache)", why: "Avoids repeat database reads for hot codes" },
      { component: "Message queue or event stream", why: "Separates click ingestion from redirect latency" },
      { component: "Dedicated analytics store", why: "Powers rollups and reports without loading the mapping database" }
    ],

    tradeoffType: "table",
    tradeoffs: [
      { choice: "IDs encoded with Base62", upside: "Short codes and straightforward decoding", downside: "Sequential values may be guessable" },
      { choice: "Randomly generated codes", upside: "Less predictable when generated with sufficient entropy", downside: "Collisions force retry handling" },
      { choice: "In-memory Redis cache", upside: "Fast in-memory lookups", downside: "Invalidation work and RAM footprint" },
      { choice: "Cache-aside pattern", upside: "Easy pattern to implement initially", downside: "Miss storms can hammer the database" },
      { choice: "Async analytics pipeline", upside: "Keeps redirect latency stable", downside: "Metrics may lag real time" },
      { choice: "SQL relational database", upside: "Strong transactions and integrity constraints", downside: "Scaling takes care at very large volume" },
      { choice: "Distributed KV store", upside: "Very high key lookup throughput", downside: "More partitioning and operational complexity" }
    ],

    followUps: [
      {
        q: "What if two clients request the same custom alias at once?",
        a: "The database unique constraint picks the winner: one create succeeds and the other gets a conflict response, such as HTTP 409."
      },
      {
        q: "A single short link goes viral. How do you absorb the spike?",
        a: "Warm the mapping in cache, serve eligible redirects via edge infrastructure where it helps, scale redirect instances, and watch for hot-key contention. I would track cache hit ratio and database load before adding more moving parts."
      },
      {
        q: "What occurs when a link in cache has been turned off?",
        a: "Evict or invalidate the entry and cap cache TTLs. When revocation must be instant, add an authoritative check or stronger invalidation on the redirect path."
      },
      {
        q: "Is it possible to guess short codes? How would you count unique clicks?",
        a: "Sequential IDs are enumerable. Use a large random code space, an opaque ID mapping, or another non-predictable generator, combined with abuse monitoring and rate limits. For unique clicks: agree on the definition of a unique click first. Store or aggregate an appropriate identifier within privacy limits and a time window. IP alone is not a reliable per-user key."
      }
    ]
  });
}

// Keep backwards-compatibility alias for modal references
export const renderUrlShortenerInterviewDesign = renderUrlShortenerDetail;
