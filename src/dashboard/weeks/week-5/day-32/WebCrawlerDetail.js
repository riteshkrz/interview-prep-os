/**
 * Question 11. Design a web crawler
 * System Design Interview Masterclass — Module 3: Data-intensive systems (Pages 52–55)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderWebCrawlerDetail() {
  return renderMasterclassQuestion({
    questionNumber: 11,
    title: "Design a web crawler",
    moduleName: "Module 3 — Data-intensive systems",
    coreTopics: "URL frontier, deduplication, robots.txt, crawl scheduling, distributed workers, and content storage",

    problemStatement: `Design a distributed crawler that begins from seed URLs, retrieves allowed pages, discovers links, and persists content for later search indexing.`,

    clarifyingQuestions: [
      { q: "What outcome should the crawler support?", a: "Produce a searchable index over publicly reachable web pages." },
      { q: "What crawl volume should the system handle?", a: "Design for millions of pages per day with room to add more workers." },
      { q: "Must crawlers follow site-specific rules?", a: "Yes—honor robots.txt and any configured crawl policies." },
      { q: "How frequently should URLs be recrawled?", a: "Base revisit timing on page importance and how often content changes." },
      { q: "Is some duplicate fetching acceptable?", a: "Occasional retries are inevitable, but unnecessary duplicate fetches should be minimized." }
    ],

    functionalRequirements: [
      "Keep a queue of URLs awaiting fetch.",
      "Retrieve allowed pages and pull out hyperlinks.",
      "Skip reprocessing the same canonical URL when possible.",
      "Cap request rate per host.",
      "Persist page bodies and associated metadata.",
      "Plan recrawls and retry failed fetches.",
      "Hand processed documents to an indexing pipeline."
    ],

    nonFunctionalRequirements: [
      "Sustain high crawl throughput.",
      "Scale out horizontally.",
      "Withstand network glitches and worker crashes.",
      "Schedule fairly across domains.",
      "Deduplicate URLs efficiently.",
      "Use external sites' resources responsibly."
    ],

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">CrawlURL &amp; PageRecord Schemas</span>
CrawlURL:
  canonical_url, host, priority, status, next_fetch_at, last_fetched_at, attempt_count

PageRecord:
  canonical_url, http_status, content_object_key, content_hash, fetched_at, last_modified
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Store fetched HTML bodies in object storage (S3/GCS) or a dedicated content store rather than bloating the relational scheduler queue tables.
        </p>
      </div>
    `,

    highLevelArchitecture: `Crawl pipeline: seed URLs &rarr; URL frontier/scheduler &rarr; host-level politeness and robots checks &rarr; distributed fetch workers &rarr; parsing and canonicalization &rarr; deduplication.<br/><br/>
    Persist parsed content durably. Enqueue newly found links on the frontier while forwarding selected metadata toward search indexing.`,

    architectureImage: '/images/hld/q11_web_crawler_architecture.svg',
    architectureImageTitle: 'Design a Web Crawler — Complete High-Level Architecture & Fetch Sequence Flow',

    architectureDiagram: `[Seed URLs]
    │
    ▼
[URL Frontier / Prioritizer]
    │ (Partitioned by Host / Domain)
    ▼
[Politeness & Robots.txt Manager] ◄──► [Robots.txt Cache]
    │ (Leases due URLs)
    ▼
[Fetch Workers Pool] ──► (HTTP GET with Timeout & Size Cap)
    │
    ▼ (Raw HTML)
[HTML Parser & Link Extractor]
    │
    ├── (Page Content) ──► [Content Hash / Dedup] ──► [Object Store (S3)] ──► [Search Indexer]
    │
    └── (Discovered URLs) ─► [URL Normalizer & Bloom Filter]
                                    │ (New URLs only)
                                    ▼
                             [Enqueue on Frontier]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Seed the frontier with starting URLs",
        stepBody: "Normalize URLs and enqueue them on the frontier. Canonicalization must apply agreed normalization rules without collapsing distinct resources into one URL."
      },
      {
        stepNumber: 2,
        stepTitle: "Prioritize and dequeue URLs to fetch",
        stepBody: "The frontier tracks pending URLs, priority, and the next time each may be fetched. Shard by host or domain so per-site crawl policy stays enforceable."
      },
      {
        stepNumber: 3,
        stepTitle: "Apply robots and politeness rules",
        stepBody: "Download and cache robots.txt, apply per-host concurrency and delay, and drop disallowed URLs. Advertise a clear crawler user agent and respect applicable site policies."
      },
      {
        stepNumber: 4,
        stepTitle: "Fetch pages with a capped worker pool",
        stepBody: "Workers lease URLs and issue HTTP requests with limits on connections, timeouts, response size, and redirects. Capture status, response headers, and fetch time."
      },
      {
        stepNumber: 5,
        stepTitle: "Parse HTML and normalize link URLs",
        stepBody: "Pull links and canonicalize each new URL. Layer a fast approximate filter ahead of a durable store or atomic claim when correctness cannot tolerate missed URLs."
      },
      {
        stepNumber: 6,
        stepTitle: "Write fetched content to storage",
        stepBody: "Save raw or normalized page data plus metadata. Drop redundant identical content when it pays off, and feed indexable records downstream."
      },
      {
        stepNumber: 7,
        stepTitle: "Queue future revisits for each URL",
        stepBody: "Favor important or volatile pages. Back off on transient errors and keep failing hosts from starving the rest of the crawl."
      }
    ],

    whyComponents: [
      { component: "URL frontier", why: "Owns scheduling and priority ordering" },
      { component: "Robots/politeness layer", why: "Blocks abusive or policy-violating request patterns" },
      { component: "Fetch worker fleet", why: "Delivers parallel fetch capacity" },
      { component: "Deduplication store", why: "Cuts repeat work on already-seen URLs" },
      { component: "Object storage", why: "Stores bulky page payloads efficiently" },
      { component: "Search indexer", why: "Keeps crawling separate from query serving" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Aggressive crawling:</strong> Freshens the search index faster but burns bandwidth and can stress or DDoS origin web sites.",
      "<strong>Bloom filters for URL dedup:</strong> Cuts millions of DB lookups, but false positives cause valid web pages to be skipped.",
      "<strong>Retaining full page copies:</strong> Enables reprocessing when parser algorithms change, but drives up raw storage costs.",
      "<strong>Single centralized frontier vs. Partitioned:</strong> Centralized is simpler to coordinate, but bottlenecks; partitioned frontiers scale gracefully yet make global PageRank prioritization harder."
    ],

    followUps: [
      {
        q: "How would you stop two workers from fetching the same URL at once?",
        a: "“Canonicalize the URL and claim or lease it atomically in shared scheduling storage. Use a fast filter to trim duplicate lookups, but do not rely on it alone when missing a URL is unacceptable.”"
      },
      {
        q: "How do you keep one site from consuming every worker?",
        a: "“Schedule or partition by host, cap per-host concurrency and delay, and quarantine slow hosts so they do not starve unrelated domains.”"
      },
      {
        q: "What happens when a crawler process dies mid-fetch?",
        a: "“Persist jobs with leases and expiry. After lease timeout, retry the job, and make content writes idempotent so reprocessing is safe.”"
      }
    ]
  });
}
