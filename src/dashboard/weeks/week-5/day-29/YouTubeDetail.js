/**
 * Question 8. Design YouTube
 * System Design Interview Masterclass — Module 2: Consumer-scale applications (Pages 40–43)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderYouTubeDetail() {
  return renderMasterclassQuestion({
    questionNumber: 8,
    title: "Design YouTube",
    moduleName: "Module 2 — Consumer-scale applications",
    coreTopics: "resumable uploads, transcoding, object storage, adaptive streaming, CDN delivery, and view analytics",

    problemStatement: `Build a video-sharing platform where creators upload videos and viewers find and watch them. The design must handle large media files, several playback quality levels, and heavy concurrent viewing load.`,

    clarifyingQuestions: [
      { q: "Should we optimize for uploading, watching, or both?", a: "Both; viewing traffic dominates upload traffic by a wide margin." },
      { q: "Must an upload be watchable right away?", a: "You may show a processing state until the needed output formats exist." },
      { q: "Do we need adaptive streaming?", a: "Yes—multiple resolutions and quality that adapts to network conditions." },
      { q: "Is live streaming included?", a: "No; begin with on-demand video only." },
      { q: "Are search and recommendations required?", a: "Support basic metadata search; sophisticated recommendations are out of scope." }
    ],

    functionalRequirements: [
      "Accept large video files and allow uploads to resume after interruption.",
      "Persist video ownership and metadata.",
      "Transcode source videos into several resolutions and formats.",
      "Deliver playback with adaptive bitrate.",
      "Search for and fetch video metadata.",
      "Track view counts and expose analytics to creators.",
      "Apply access, content, and copyright policy enforcement."
    ],

    nonFunctionalRequirements: [
      "Strong durability for stored media.",
      "Fast time-to-first-frame on playback.",
      "Little buffering when the network is adequate.",
      "High capacity for simultaneous streams.",
      "Transcoding that scales and recovers from failures.",
      "Economical storage and delivery for media."
    ],

    apiDesign: `POST /api/v1/videos/upload-sessions
// Returns: { "uploadId": "upl_123", "chunkSize": 5242880, "signedUrl": "https://s3.amazonaws.com/..." }

GET /api/v1/videos/{videoId}
// Returns title, author, views, published date, tags

GET /api/v1/videos/{videoId}/playback
// Returns master manifest URL: https://cdn.example.com/videos/v123/master.m3u8

GET /api/v1/videos/search?q={query}&limit=20`,

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">Entities &amp; Schemas</span>
Video:
  video_id, owner_id, title, description, status, original_object_key, created_at, published_at

VideoVariant:
  video_id, resolution, codec, manifest_key, status

VideoViewEvent:
  event_id, video_id, viewer_context, event_timestamp
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Do not embed large media payloads in relational metadata rows. Binary blobs belong exclusively in object storage.
        </p>
      </div>
    `,

    highLevelArchitecture: `Upload path: creator client &rarr; upload API &rarr; signed upload URL &rarr; original object storage.<br/><br/>
    When an upload completes, a durable processing queue and transcoding worker pool take over. Workers produce playback segments and manifests in object storage, then refresh video metadata. Viewers get playback metadata and pull video segments via a CDN.<br/><br/>
    View events feed a dedicated analytics pipeline.`,

    architectureImage: '/images/hld/q08_youtube_architecture.svg',
    architectureImageTitle: 'Design YouTube — High-Level Architecture, Transcoding DAG & CDN Edge Delivery',

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Start a resumable upload session",
        stepBody: "The creator opens an upload session. The service checks authorization and responds with an upload ID plus temporary upload credentials."
      },
      {
        stepNumber: 2,
        stepTitle: "Stream bytes directly into object storage",
        stepBody: "The client sends the file in chunks. If a transfer breaks, it can continue from missing parts instead of re-uploading the whole file."
      },
      {
        stepNumber: 3,
        stepTitle: "Close the upload and validate the original asset",
        stepBody: "Confirm the upload finished, validate file type and checksum, run applicable safety checks, persist metadata, and set the video status to processing."
      },
      {
        stepNumber: 4,
        stepTitle: "Enqueue a transcoding job",
        stepBody: "Enqueue a durable processing job. Workers generate multiple resolutions and streaming segments—for example HLS or DASH assets. The worker layer must cope with large jobs, retries, timeouts, and capacity caps."
      },
      {
        stepNumber: 5,
        stepTitle: "Expose playback-ready assets",
        stepBody: "Save manifests and segments to object storage. Set the video to READY only when the required variants are available. Partial results should not accidentally appear as complete."
      },
      {
        stepNumber: 6,
        stepTitle: "Serve playback via the CDN",
        stepBody: "The viewer loads a manifest, then pulls video segments from CDN edge nodes. The player switches resolution according to bandwidth and playback conditions."
      },
      {
        stepNumber: 7,
        stepTitle: "Record view analytics on an async path",
        stepBody: "Send play and watch events to a queue or stream. Aggregate them offline instead of updating a central database synchronously on each view."
      }
    ],

    whyComponents: [
      { component: "Direct object-storage upload", why: "Keeps application servers from saturating on bandwidth" },
      { component: "Multipart upload", why: "Handles large files and enables recovery" },
      { component: "Processing queue", why: "Smooths load spikes and enables retries" },
      { component: "Transcoding workers", why: "Keep CPU/GPU-heavy work off the request path" },
      { component: "Object storage", why: "Holds originals and processed media" },
      { component: "CDN", why: "Cuts latency and origin egress" },
      { component: "Analytics stream", why: "Decouples view counting from the playback path" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Several resolutions:</strong> Broaden device support across poor mobile and 4K screens, but raise storage and encoding costs substantially.",
      "<strong>Adaptive streaming:</strong> Improves viewer experience and stops playback stalls, but demands more processing power and complex player logic.",
      "<strong>Publishing gate:</strong> Publishing only after every variant is ready simplifies playback guarantees, but lengthens creator time-to-availability.",
      "<strong>CDN caching:</strong> Saves petabytes of origin bandwidth, but private or restricted titles need short-lived signed tokens and fast invalidation.",
      "<strong>Keeping originals:</strong> Enables future reprocessing to newer codecs (e.g., AV1), but adds substantial ongoing cold-storage expenses."
    ],

    followUps: [
      {
        q: "What if a transcoding worker fails partway through a job?",
        a: "“Persist the job, track processing state, and retry from a checkpoint or restart safely. Make output paths and finalization idempotent so incomplete runs never ship as finished assets.”"
      },
      {
        q: "How do you cope with a video that goes viral?",
        a: "“Rely on CDN delivery, cache manifests where it helps, scale metadata reads, and do not increment a central view counter synchronously for every play. Watch origin bandwidth and CDN hit ratio.”"
      },
      {
        q: "Why is routing video through application servers a bad idea?",
        a: "“App servers would waste bandwidth and become bottlenecks. Object storage plus CDN delivery fits large media transfers better.”"
      }
    ]
  });
}
