/**
 * Question 6. Design Instagram
 * System Design Interview Masterclass — Module 2: Consumer-scale applications (Pages 33–36)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderInstagramDetail() {
  return renderMasterclassQuestion({
    questionNumber: 6,
    title: "Design Instagram",
    moduleName: "Module 2 — Consumer-scale applications",
    coreTopics: "uploading media, object storage, CDN delivery, the social graph, feed construction, and hybrid fan-out approaches",

    problemStatement: `Design a photo-sharing service where users can upload media, follow others, create posts, and scroll a personalized home feed.`,

    clarifyingQuestions: [
      { q: "Which capabilities belong in scope?", a: "User profiles, follow relationships, photo uploads, posts, likes, and a home feed." },
      { q: "What scale should we assume?", a: "Assume 100 million daily active users, with read traffic much larger than upload traffic." },
      { q: "How should the feed be ordered?", a: "Ship a feed of recent posts from followed accounts first; introduce ranking in a later iteration." },
      { q: "Do we need to support private profiles?", a: "Yes—only followers who are explicitly authorized may view private content." }
    ],

    functionalRequirements: [
      "Support user profiles plus follow and unfollow relationships.",
      "Add photos and publish them as posts.",
      "Load and scroll the home feed.",
      "React with likes and fetch individual post details.",
      "Deliver media quickly to users in different regions.",
      "Apply access checks for private accounts."
    ],

    nonFunctionalRequirements: [
      "Long-lived, reliable storage for media blobs.",
      "Keep feed loads and image fetches fast.",
      "Handle a large volume of read requests.",
      "Grow capacity by adding nodes, not bigger boxes.",
      "Protect user data with privacy controls.",
      "Treat feed and engagement views as eventually consistent where acceptable, but never weaken authoritative security checks."
    ],

    apiDesign: `POST /api/v1/posts
// Request: { "caption": "Hello world", "mediaKey": "raw/user-1/post-99.jpg" }

GET /api/v1/feed?cursor=eyJjcmVhdGVkX2F0IjoxNj...&limit=20
// Returns cursor-based feed page to avoid offset degradation

POST /api/v1/users/{userId}/follow
POST /api/v1/posts/{postId}/likes
GET /api/v1/users/{userId}/posts`,

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">Relational / Document Metadata Schemas</span>
User(user_id, username, profile, privacy)
Follow(follower_id, followee_id, created_at)
Post(post_id, author_id, caption, media_key, created_at)
Like(user_id, post_id, created_at)
FeedEntry(user_id, post_id, created_at)
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Media bytes live durably in object storage (e.g. S3 / GCS); database holds metadata, follower graphs, and immutable object keys.
        </p>
      </div>
    `,

    highLevelArchitecture: `Client requests &rarr; API gateway &rarr; user/social service and post service.<br/><br/>
    Uploads rely on authorized direct-to-object-storage URLs. Media-processing workers produce thumbnails and variants. A post-created event kicks off feed generation. The feed service merges stored feed entries with recent posts when needed and returns metadata plus CDN media URLs.`,

    architectureImage: '/images/hld/q06_instagram_architecture.svg',
    architectureImageTitle: 'Design Instagram — High-Level Architecture, Hybrid Fan-Out & Media Processing Pipeline',


    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Client-direct media upload",
        stepBody: "The client obtains a short-lived upload authorization, then sends media straight to object storage instead of streaming large files through application servers."
      },
      {
        stepNumber: 2,
        stepTitle: "Post-upload media processing",
        stepBody: "A background worker checks the upload, runs required scans, and builds thumbnail and resolution variants, then persists their object keys in metadata."
      },
      {
        stepNumber: 3,
        stepTitle: "Reliable post publication",
        stepBody: "Persist post metadata and emit a post-created event. An outbox or equivalent pattern avoids committing the database while losing the published event."
      },
      {
        stepNumber: 4,
        stepTitle: "Build follower feeds",
        stepBody: "Fan-out-on-write suits typical users by appending new post IDs to each follower's feed store. Accounts followed by millions make that write fan-out costly; switch those to fan-out-on-read or a hybrid mix."
      },
      {
        stepNumber: 5,
        stepTitle: "Return feed pages",
        stepBody: "The feed service loads post IDs, pulls metadata, and returns a cursor-based page. Clients fetch media via a CDN, which lowers origin load."
      },
      {
        stepNumber: 6,
        stepTitle: "Guard private-account content",
        stepBody: "Before exposing posts or media, confirm the viewer is authorized. A cached feed entry alone must not unlock private content."
      },
      {
        stepNumber: 7,
        stepTitle: "Roll up engagement in the background",
        stepBody: "Likes and views can feed counters and ranking asynchronously; what users see may update with a small delay based on product requirements."
      }
    ],

    whyComponents: [
      { component: "Object storage", why: "Holds large media objects with durable persistence" },
      { component: "CDN", why: "Delivers frequently accessed media close to viewers" },
      { component: "Feed service", why: "Isolates feed reads from post creation" },
      { component: "Event stream", why: "Separates media processing from feed generation" },
      { component: "Feed store/cache", why: "Speeds up common feed reads" },
      { component: "Hybrid fan-out", why: "Weighs feed read latency against write amplification for high-follower accounts" }
    ],

    tradeoffType: "table",
    tradeoffs: [
      { choice: "Push fan-out at write time", upside: "Snappy feed reads", downside: "High cost at celebrity scale" },
      { choice: "Pull fan-out at read time", upside: "Reduced write amplification", downside: "Heavier work at read time" },
      { choice: "Combined fan-out approach", upside: "Middle ground between extremes", downside: "Read path gains complexity" },
      { choice: "CDN caching", upside: "Quick media delivery", downside: "Harder cache invalidation and ACL enforcement" },
      { choice: "Feeds update asynchronously", upside: "Background processing scales well", downside: "New posts can show up late" }
    ],

    followUps: [
      {
        q: "What approach works for a user with 50 million followers?",
        a: "“Do not synchronously write the post into every follower's feed. Apply a hybrid strategy and fold the celebrity's recent posts into the feed at read time or via a dedicated optimized pipeline.”"
      },
      {
        q: "How do you keep feed entries from duplicating?",
        a: "“Rely on stable post IDs and idempotent feed insertion, and specify retry and event-replay behavior. Feed generation must survive duplicate event delivery.”"
      },
      {
        q: "How should the system behave when media processing fails?",
        a: "“Keep the original upload, record processing state, and retry the job. The post can display a processing or failure state until required media variants exist.”"
      }
    ]
  });
}
