/**
 * Question 12. Design search autocomplete
 * System Design Interview Masterclass — Module 3: Data-intensive systems (Pages 56–59)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderSearchAutocompleteDetail() {
  return renderMasterclassQuestion({
    questionNumber: 12,
    title: "Design search autocomplete",
    moduleName: "Module 3 — Data-intensive systems",
    coreTopics: "prefix matching, tries, compact indexes, top-K ranking, caching, and refreshing indexes",

    problemStatement: `Design a service that proposes likely search queries while the user types. It should return a small, relevant suggestion set with low latency and keep results reasonably up to date as query popularity shifts.`,

    clarifyingQuestions: [
      { q: "What should appear in suggestions?", a: "Emphasize popular queries; personalization can be optional." },
      { q: "What latency should the design target?", a: "Aim to respond within tens of milliseconds (e.g., < 20–30ms)." },
      { q: "How should suggestions be ordered?", a: "At first, rank by popularity together with recency." },
      { q: "Must the index reflect every change immediately?", a: "No. Periodic or streaming index updates are acceptable." },
      { q: "Can sensitive queries be suggested?", a: "Do not skip privacy, abuse, and content policy enforcement." }
    ],

    functionalRequirements: [
      "Take an incomplete query prefix as input.",
      "Respond with the top K relevant suggestions.",
      "Score and order candidates by popularity and recency.",
      "Apply language rules and text normalization.",
      "Refresh suggestions when query patterns shift.",
      "Remove prohibited or inappropriate entries."
    ],

    nonFunctionalRequirements: [
      "Minimal end-to-end latency.",
      "Read throughput must stay high.",
      "Frugal memory footprint.",
      "Predictable index update and rollout.",
      "Ability to scale horizontally.",
      "Treat search logs with privacy-aware practices."
    ],

    apiDesign: `GET /api/v1/autocomplete?q=dist&limit=10
Content-Type: application/json

Response:
{
  "suggestions": [
    "distributed systems",
    "distributed cache",
    "distributed transactions"
  ]
}
// Note: Cap maximum results and prefix length to guard serving capacity.`,

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">QuerySuggestion Schema</span>
QuerySuggestion:
  normalized_query: String (Lowercase, trimmed)
  display_query: String
  recent_count: Integer (e.g. past 24h count)
  historical_count: Integer (past 30 days)
  language: String (e.g. "en-US")
  policy_status: Enum (ACTIVE / BANNED / UNDER_REVIEW)
  last_updated_at: Timestamp
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Ranking signals come from an offline or streaming aggregation pipeline that tallies historical and recent search query submissions.
        </p>
      </div>
    `,

    highLevelArchitecture: `Suggestion path: Search UI &rarr; autocomplete API &rarr; prefix cache &rarr; autocomplete service &rarr; in-memory trie or compact FST index &rarr; ranked top-K suggestions.<br/><br/>
    Search events feed a separate aggregation pipeline. A versioned index builder emits new index versions and rolls them out safely to serving nodes.`,

    architectureImage: '/images/hld/q12_search_autocomplete_architecture.svg',
    architectureImageTitle: 'Design Search Autocomplete System — Trie Architecture & Real-Time Query Flow',

    architectureDiagram: `[Search UI Client]
       │ (Key stroke: "dist")
       ▼
[Edge Prefix Cache (Redis / CDN)]
       │ (Cache Miss)
       ▼
[Autocomplete Service] ──► [In-Memory Trie / FST Index Node]
       │                         │ (Precomputed Top-K at prefix node)
       ▼                         ▼
[Return Top-K Suggestions: "distributed systems", ...]

── Offline / Streaming Index Builder ──
[Search Logs Stream] ──► [Spark / Flink Aggregator] ──► [Weekly / Daily Trie Snapshot]
                                                              │
                                                              ▼ (Atomic Swap)
                                                   [Serving Fleet In-Memory]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Gather and normalize query signals",
        stepBody: "Aggregate query events under privacy-aware retention. Normalize case, whitespace, and suitable Unicode forms without erasing language-specific semantics."
      },
      {
        stepNumber: 2,
        stepTitle: "Derive ranking features",
        stepBody: "Measure recent and historical popularity. Drop banned suggestions and keep short-lived abusive spikes from hijacking ranks."
      },
      {
        stepNumber: 3,
        stepTitle: "Construct a prefix index",
        stepBody: "A trie is a clear baseline for prefix lookup. At higher scale, a compact finite-state transducer (FST) or another compressed index can shrink memory use."
      },
      {
        stepNumber: 4,
        stepTitle: "Precompute top candidates",
        stepBody: "For frequent prefixes, precompute top-ranked candidates directly on the prefix trie node so request time does not scan huge candidate lists or subtree leaves."
      },
      {
        stepNumber: 5,
        stepTitle: "Handle live queries",
        stepBody: "Normalize the user prefix, consult a cache for hot prefixes, on miss query the in-memory index, and return a bounded top-K payload."
      },
      {
        stepNumber: 6,
        stepTitle: "Roll out index updates safely",
        stepBody: "Build a fresh index version, validate it, and roll out gradually. Serving nodes can swap versions via pointer exchange without partially rebuilding the live index."
      },
      {
        stepNumber: 7,
        stepTitle: "Enforce safeguards",
        stepBody: "Block sensitive or inappropriate queries and protect user privacy. Keep personalization optional and never expose another user's private search history."
      }
    ],

    whyComponents: [
      { component: "Query aggregation", why: "Produces popularity and recency signals" },
      { component: "Trie / FST", why: "Enables efficient prefix lookup in O(p) where p = prefix length" },
      { component: "Precomputed top-K results", why: "Cuts runtime subtree traversal work on the request path" },
      { component: "Cache", why: "Speeds up heavily requested prefixes like 'a', 'b', 'fac'" },
      { component: "Versioned index builder", why: "Allows safe refresh and zero-downtime rollback of indexes" },
      { component: "Policy filters", why: "Keep unsuitable, profane, or PII queries out of suggestions" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Tries:</strong> Intuitive and fast to traverse, but can consume considerable RAM due to pointer overhead.",
      "<strong>Compact FST indexes:</strong> Save memory footprint significantly, but are harder to update incrementally.",
      "<strong>Precomputed top-K:</strong> Drastically lowers latency on query path, but suggestions may lag newly breaking trends.",
      "<strong>Popularity-only ranking:</strong> Straightforward to compute, but can suppress emerging or seasonal trends.",
      "<strong>Personalization:</strong> Boosts relevance for individual users, but adds privacy risks and caching complexity."
    ],

    followUps: [
      {
        q: "How would you surface trending searches?",
        a: "“Mix popularity in a recent time window (e.g. past 1 hour) with longer-term popularity. Use abuse controls and rate bounds so a short burst of junk queries cannot manipulate or hijack the index.”"
      },
      {
        q: "What techniques shrink autocomplete latency?",
        a: "“Hold the entire index in RAM, cache hot prefixes in edge Redis layers, cap the response payload size to top 5–10, and keep synchronous database calls off the hot serving path.”"
      },
      {
        q: "How could personalization be added?",
        a: "“Fetch global candidates first from the fast in-memory trie, then optionally rerank with authorized user context and local history. That bounds personalized computation and simplifies privacy enforcement.”"
      }
    ]
  });
}
