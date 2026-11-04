/**
 * YouTube High-Level Architecture (HLD) Data Specification
 * Pure architecture data model separated from presentation.
 * Supports:
 * - Architecture topology (nodes, tiers, links)
 * - Request flows (Resumable Upload, Transcoding DAG, ABR Playback & Analytics)
 * - Detailed component specifications (Responsibilities, APIs, Storage, Trade-offs, Failure modes)
 * - System-level architectural trade-offs
 */

export const YOUTUBE_HLD_DATA = {
  lessonId: 'youtube',
  title: 'Distributed Video Ingestion, Transcoding DAG & Global Streaming Architecture (YouTube)',
  systemName: 'Scalable Resumable Media Ingestion, Asynchronous GPU Transcoding & CDN-Edge Streaming Platform',
  scaleMetrics: {
    monthlyCreates: '500+ hours video uploaded / minute (~8.3 uploads/sec)',
    avgWriteRps: '~25,000 upload chunk requests / sec',
    peakWriteRps: '~75,000 chunk upload bursts / sec',
    monthlyRedirects: '5+ Billion video views / day (~150 Billion views / mo)',
    avgReadRps: '~58,000 stream chunk requests / sec',
    peakReadRps: '~250,000 chunk requests / sec',
    targetRedirectLatency: '< 150 ms P99 Time-To-First-Frame (TTFF)',
    storagePerYear: 'Hundreds of Petabytes raw & encoded media / year'
  },

  scaleMetricsList: [
    { label: 'Upload Ingestion Volume', value: '500 hrs / min', color: 'blue' },
    { label: 'Daily Video Views', value: '5+ Billion views / day', color: 'emerald' },
    { label: 'Peak Streaming Throughput', value: '250,000 chunks / sec', color: 'indigo' },
    { label: 'Playback Latency SLA', value: '< 150ms P99 TTFF', color: 'cyan' },
    { label: 'Streaming Standards', value: 'HLS • MPEG-DASH • CMAF', color: 'amber' }
  ],

  // Tier boundaries for the SVG Canvas (viewBox 0 0 1100 680)
  tierBoxes: [
    { x: 215, y: 30, w: 190, h: 390, textX: 230, textY: 55, title: 'INGRESS & EDGE CDN TIER', color: 'indigo' },
    { x: 420, y: 30, w: 405, h: 390, textX: 435, textY: 55, title: 'COMPUTE, TRANSCODING DAG & METADATA FLEET', color: 'blue' },
    { x: 840, y: 30, w: 235, h: 390, textX: 855, textY: 55, title: 'BLOB & SEGMENT OBJECT STORES (S3/GCS)', color: 'amber' },
    { x: 215, y: 440, w: 860, h: 225, textX: 230, textY: 465, title: 'METADATA DATABASE, SEARCH INDEX & STREAMING ANALYTICS PIPELINE', color: 'emerald' }
  ],

  // Architectural Tiers for grouping
  tiers: [
    { id: 'client-tier', name: 'Creator Studio & Viewer Client Tier', color: 'slate' },
    { id: 'ingress-tier', name: 'Ingress, Edge CDN & API Gateway Tier', color: 'indigo' },
    { id: 'compute-tier', name: 'Transcoding DAG & Compute Orchestration Tier', color: 'blue' },
    { id: 'storage-tier', name: 'Object Storage, Catalog DB & Telemetry Pipeline Tier', color: 'amber' }
  ],

  // Interactive Nodes on the SVG Canvas (viewBox 0 0 1100 680)
  nodes: [
    {
      id: 'creator-client',
      label: 'Creator Studio Client',
      sublabel: 'Web • Mobile • Resumable Multipart',
      tier: 'client-tier',
      tierLabel: 'Creator Device',
      category: 'Client Tier',
      icon: 'video_call',
      x: 35,
      y: 70,
      width: 155,
      height: 90,
      badge: 'Chunked Ingestion',
      color: 'slate'
    },
    {
      id: 'viewer-client',
      label: 'Viewer Playback App',
      sublabel: 'ExoPlayer • Shaka • HTML5 ABR',
      tier: 'client-tier',
      tierLabel: 'Viewer Device',
      category: 'Client Tier',
      icon: 'smart_display',
      x: 35,
      y: 220,
      width: 155,
      height: 90,
      badge: 'Adaptive Bitrate',
      color: 'slate'
    },
    {
      id: 'api-gw',
      label: 'API Gateway & Ingress Fleet',
      sublabel: 'Auth • Rate Limiting • Session Broker',
      tier: 'ingress-tier',
      tierLabel: 'API Gateway',
      category: 'Ingress & Security',
      icon: 'dns',
      x: 230,
      y: 70,
      width: 160,
      height: 90,
      badge: 'Envoy / NGINX',
      color: 'indigo'
    },
    {
      id: 'edge-cdn',
      label: 'Global Edge CDN PoPs',
      sublabel: 'Anycast DNS • Edge NVMe Cache',
      tier: 'ingress-tier',
      tierLabel: 'Edge Delivery',
      category: 'Content Delivery',
      icon: 'public',
      x: 230,
      y: 220,
      width: 160,
      height: 90,
      badge: '98%+ Hit Ratio',
      color: 'cyan'
    },
    {
      id: 'upload-svc',
      label: 'Resumable Upload Service',
      sublabel: 'S3 Presigned URLs • Part Validation',
      tier: 'compute-tier',
      tierLabel: 'Upload Coordinator',
      category: 'Stateless Service',
      icon: 'cloud_upload',
      x: 435,
      y: 70,
      width: 175,
      height: 90,
      badge: 'TUS / S3 Multipart',
      color: 'blue'
    },
    {
      id: 'metadata-svc',
      label: 'Metadata & Catalog Service',
      sublabel: 'Video Info • Manifest Resolver • Tags',
      tier: 'compute-tier',
      tierLabel: 'Catalog Service',
      category: 'Stateless Service',
      icon: 'menu_book',
      x: 435,
      y: 220,
      width: 175,
      height: 90,
      badge: 'gRPC / GraphQL',
      color: 'teal'
    },
    {
      id: 'transcode-orchestrator',
      label: 'Transcoding Orchestrator',
      sublabel: 'DAG Scheduler • GOP Chunk Splitter',
      tier: 'compute-tier',
      tierLabel: 'Workflow Engine',
      category: 'Distributed Compute',
      icon: 'schema',
      x: 635,
      y: 70,
      width: 175,
      height: 90,
      badge: 'Temporal / Kafka',
      color: 'violet'
    },
    {
      id: 'transcode-workers',
      label: 'GPU Transcoding Farm',
      sublabel: 'FFmpeg • NVENC • AV1 / VP9 / H.264',
      tier: 'compute-tier',
      tierLabel: 'Worker Fleet',
      category: 'GPU Cluster',
      icon: 'memory',
      x: 635,
      y: 220,
      width: 175,
      height: 90,
      badge: 'Parallel GOP Encoding',
      color: 'purple'
    },
    {
      id: 'raw-storage',
      label: 'Raw Video Store (S3)',
      sublabel: 'Original Upload Master Blobs',
      tier: 'storage-tier',
      tierLabel: 'Raw Storage',
      category: 'Object Storage',
      icon: 'inventory_2',
      x: 855,
      y: 70,
      width: 205,
      height: 90,
      badge: 'Direct S3 Multipart',
      color: 'amber'
    },
    {
      id: 'processed-storage',
      label: 'Transcoded Media Store',
      sublabel: '.m3u8 / .mpd Manifests • .ts / .m4s',
      tier: 'storage-tier',
      tierLabel: 'Streaming Assets',
      category: 'Object Storage',
      icon: 'folder_zip',
      x: 855,
      y: 220,
      width: 205,
      height: 90,
      badge: 'Multi-Bitrate Ladders',
      color: 'emerald'
    },
    {
      id: 'metadata-db',
      label: 'Video Metadata DB',
      sublabel: 'CockroachDB / Cassandra Cluster',
      tier: 'storage-tier',
      tierLabel: 'Catalog DB',
      category: 'Distributed DB',
      icon: 'database',
      x: 230,
      y: 470,
      width: 185,
      height: 95,
      badge: 'Partition by VideoID',
      color: 'indigo'
    },
    {
      id: 'analytics-pipeline',
      label: 'View Count & Telemetry Engine',
      sublabel: 'Kafka • Apache Flink • Redis HLL',
      tier: 'storage-tier',
      tierLabel: 'Analytics Bus',
      category: 'Streaming Engine',
      icon: 'analytics',
      x: 635,
      y: 470,
      width: 210,
      height: 95,
      badge: 'Deduplicated Views',
      color: 'cyan'
    }
  ],

  // Directed links between nodes
  links: [
    {
      id: 'link-creator-gw',
      from: 'creator-client',
      to: 'api-gw',
      label: '1. Init Resumable Session',
      type: 'forward',
      flows: ['resumable-upload'],
      path: 'M 190 115 L 230 115'
    },
    {
      id: 'link-gw-upload',
      from: 'api-gw',
      to: 'upload-svc',
      label: 'Session Auth & Ticket',
      type: 'forward',
      flows: ['resumable-upload'],
      path: 'M 390 115 L 435 115'
    },
    {
      id: 'link-upload-raw',
      from: 'creator-client',
      to: 'raw-storage',
      label: '2. Direct S3 Multipart PUT (Signed URLs)',
      type: 'forward',
      flows: ['resumable-upload'],
      path: 'M 112 70 C 112 20, 955 20, 955 70'
    },
    {
      id: 'link-upload-orch',
      from: 'upload-svc',
      to: 'transcode-orchestrator',
      label: '3. Video Upload Completed Event',
      type: 'forward',
      flows: ['resumable-upload', 'transcoding-dag'],
      path: 'M 610 115 L 635 115'
    },
    {
      id: 'link-orch-workers',
      from: 'transcode-orchestrator',
      to: 'transcode-workers',
      label: 'Dispatch GOP Encoding Tasks',
      type: 'forward',
      flows: ['transcoding-dag'],
      path: 'M 722 160 L 722 220'
    },
    {
      id: 'link-workers-raw',
      from: 'transcode-workers',
      to: 'raw-storage',
      label: 'Pull Raw Video Chunks',
      type: 'forward',
      flows: ['transcoding-dag'],
      path: 'M 810 240 C 830 240, 840 130, 855 115'
    },
    {
      id: 'link-workers-processed',
      from: 'transcode-workers',
      to: 'processed-storage',
      label: 'Save HLS/DASH Segments',
      type: 'forward',
      flows: ['transcoding-dag'],
      path: 'M 810 265 L 855 265'
    },
    {
      id: 'link-orch-meta',
      from: 'transcode-orchestrator',
      to: 'metadata-db',
      label: 'Publish Status = READY',
      type: 'forward',
      flows: ['transcoding-dag'],
      path: 'M 722 160 C 722 430, 322 430, 322 470'
    },
    {
      id: 'link-viewer-gw',
      from: 'viewer-client',
      to: 'api-gw',
      label: '1. Fetch Manifest URL',
      type: 'forward',
      flows: ['abr-playback'],
      path: 'M 112 220 C 112 180, 260 180, 260 160'
    },
    {
      id: 'link-gw-meta',
      from: 'api-gw',
      to: 'metadata-svc',
      label: 'Resolve Stream Info',
      type: 'forward',
      flows: ['abr-playback'],
      path: 'M 350 160 C 350 200, 435 240, 435 250'
    },
    {
      id: 'link-viewer-cdn',
      from: 'viewer-client',
      to: 'edge-cdn',
      label: '2. Request HLS/DASH Segments',
      type: 'forward',
      flows: ['abr-playback'],
      path: 'M 190 265 L 230 265'
    },
    {
      id: 'link-cdn-processed',
      from: 'edge-cdn',
      to: 'processed-storage',
      label: 'Origin Pull on Cache Miss',
      type: 'forward',
      flows: ['abr-playback'],
      path: 'M 310 310 C 310 360, 955 360, 955 310'
    },
    {
      id: 'link-viewer-analytics',
      from: 'viewer-client',
      to: 'analytics-pipeline',
      label: '3. Periodic Heartbeat & View Telemetry',
      type: 'forward',
      flows: ['abr-playback'],
      path: 'M 112 310 C 112 600, 635 600, 635 550'
    }
  ],

  // Request flows for step-by-step interactive walk-through
  flows: [
    {
      id: 'resumable-upload',
      name: 'Resumable Multipart Video Ingestion & S3 Landing',
      description: 'Zero-proxy creator upload flow streaming 10MB chunks directly to cloud object storage using presigned credentials.',
      color: 'blue',
      steps: [
        {
          index: 0,
          title: 'Session Initialization',
          nodeId: 'creator-client',
          activeNodes: ['creator-client', 'api-gw', 'upload-svc', 'metadata-db'],
          activeLinks: ['link-creator-gw', 'link-gw-upload'],
          description: 'Creator client sends video metadata (title, expected byte size, MIME container) to API Gateway, which forwards to Resumable Upload Service to register the upload session in Metadata DB.'
        },
        {
          index: 1,
          title: 'Presigned Multipart URL Allocation',
          nodeId: 'upload-svc',
          activeNodes: ['upload-svc', 'creator-client'],
          activeLinks: ['link-gw-upload', 'link-creator-gw'],
          description: 'Upload Service calculates part count (e.g. 50 chunks × 10MB) and issues signed S3 multipart upload URLs to the creator with an expiration TTL, bypassing internal application proxies.'
        },
        {
          index: 2,
          title: 'Parallel Direct-to-S3 Chunk Uploads',
          nodeId: 'raw-storage',
          activeNodes: ['creator-client', 'raw-storage'],
          activeLinks: ['link-upload-raw'],
          description: 'Creator device uploads binary chunks in parallel directly into Raw Object Storage via HTTP PUT. If a network interruption occurs, client queries uploaded byte ranges and resumes seamlessly.'
        },
        {
          index: 3,
          title: 'Multipart Finalization & Validation',
          nodeId: 'upload-svc',
          activeNodes: ['creator-client', 'upload-svc', 'raw-storage'],
          activeLinks: ['link-creator-gw', 'link-gw-upload'],
          description: 'Client issues a CompleteMultipartUpload request with part ETags. Upload Service verifies complete file integrity in S3 and marks video status as UPLOAD_COMPLETE.'
        },
        {
          index: 4,
          title: 'Transcode Queue Dispatch',
          nodeId: 'transcode-orchestrator',
          activeNodes: ['upload-svc', 'transcode-orchestrator'],
          activeLinks: ['link-upload-orch'],
          description: 'Upload Service publishes a `video-uploaded-raw` event to the message bus, notifying the Transcoding Orchestrator to trigger the encoding DAG.'
        }
      ]
    },
    {
      id: 'transcoding-dag',
      name: 'Asynchronous Transcoding DAG & Multi-Bitrate HLS/DASH Packaging',
      description: 'Distributed GOP chunk-splitting, parallel GPU transcoding into multiple codecs/resolutions, and adaptive streaming manifest generation.',
      color: 'purple',
      steps: [
        {
          index: 0,
          title: 'Ingestion & Video Inspection',
          nodeId: 'transcode-orchestrator',
          activeNodes: ['transcode-orchestrator', 'raw-storage'],
          activeLinks: ['link-upload-orch'],
          description: 'Orchestrator pulls raw video header metadata via ffprobe to inspect frame rate, audio channels, color profile, and keyframe intervals (GOP length).'
        },
        {
          index: 1,
          title: 'GOP Chunk Splitting & Task Scheduling',
          nodeId: 'transcode-orchestrator',
          activeNodes: ['transcode-orchestrator', 'transcode-workers'],
          activeLinks: ['link-orch-workers'],
          description: 'Video is split along keyframe boundaries into independent 4-second GOP chunks. Orchestrator schedules parallel encoding jobs across the distributed GPU worker pool.'
        },
        {
          index: 2,
          title: 'Parallel GPU Transcoding (H.264, VP9, AV1)',
          nodeId: 'transcode-workers',
          activeNodes: ['transcode-workers', 'raw-storage'],
          activeLinks: ['link-workers-raw'],
          description: 'GPU workers fetch chunks from raw storage and transcode in parallel across resolution ladders: 1080p, 720p, 480p, 360p, optimizing for compression efficiency and codec compatibility.'
        },
        {
          index: 3,
          title: 'HLS/DASH Segment & Manifest Packaging',
          nodeId: 'processed-storage',
          activeNodes: ['transcode-workers', 'processed-storage'],
          activeLinks: ['link-workers-processed'],
          description: 'Workers assemble chunk outputs into standardized .ts / .m4s fragments (CMAF format) and construct master playlists (master.m3u8, manifest.mpd) in Processed Media Storage.'
        },
        {
          index: 4,
          title: 'Video Catalog Publish & Search Indexing',
          nodeId: 'metadata-db',
          activeNodes: ['transcode-orchestrator', 'metadata-db', 'metadata-svc'],
          activeLinks: ['link-orch-meta'],
          description: 'Transcoding DAG completes successfully. Orchestrator updates video status to READY in Metadata DB, triggers thumbnail generation, and indexes tags into the Search Cluster.'
        }
      ]
    },
    {
      id: 'abr-playback',
      name: 'Adaptive Bitrate (ABR) Playback via Global CDN & View Analytics',
      description: 'Ultra-low latency edge playback with dynamic bandwidth adaptation, origin offloading, and deduplicated view telemetry.',
      color: 'cyan',
      steps: [
        {
          index: 0,
          title: 'Playback Resolution & Master Manifest Fetch',
          nodeId: 'viewer-client',
          activeNodes: ['viewer-client', 'api-gw', 'metadata-svc'],
          activeLinks: ['link-viewer-gw', 'link-gw-meta'],
          description: 'Viewer app requests video playback from API Gateway. Metadata Service returns master manifest URL with resolution ladder endpoints and CDN hostnames.'
        },
        {
          index: 1,
          title: 'Edge CDN Anycast Route & Initial Segment Fetch',
          nodeId: 'edge-cdn',
          activeNodes: ['viewer-client', 'edge-cdn'],
          activeLinks: ['link-viewer-cdn'],
          description: 'Player resolves nearest Edge CDN PoP via Anycast DNS and requests master.m3u8 plus initial 360p/720p chunks to achieve sub-150ms Time-To-First-Frame (TTFF).'
        },
        {
          index: 2,
          title: 'Origin Shield Pull on Cache Miss',
          nodeId: 'processed-storage',
          activeNodes: ['edge-cdn', 'processed-storage'],
          activeLinks: ['link-cdn-processed'],
          description: 'If a requested segment is not cached at the edge, the CDN fetches it from the Processed S3 Store via an origin-shield layer and caches it in local NVMe SSDs (98%+ hit ratio for hot videos).'
        },
        {
          index: 3,
          title: 'Client-Side Adaptive Bitrate (ABR) Switching',
          nodeId: 'viewer-client',
          activeNodes: ['viewer-client', 'edge-cdn'],
          activeLinks: ['link-viewer-cdn'],
          description: 'Video player continually monitors download throughput and playback buffer fullness, automatically upgrading to 1080p60 on fast connections or degrading to 480p to prevent buffering.'
        },
        {
          index: 4,
          title: 'Telemetry Heartbeats & View Counter Aggregation',
          nodeId: 'analytics-pipeline',
          activeNodes: ['viewer-client', 'analytics-pipeline'],
          activeLinks: ['link-viewer-analytics'],
          description: 'Client player sends periodic 10s playback telemetry pings. Flink streaming engine checks watch-time thresholds (>30s), filters bots via HyperLogLog deduplication, and flushes view counts to Redis and DB.'
        }
      ]
    }
  ],

  // Component Specifications for Node Inspector
  componentSpecs: {
    'creator-client': {
      title: 'Creator Studio Client (Web / Mobile)',
      tier: 'Client Tier',
      responsibilities: [
        'Splits large master video files into fixed-size chunks (e.g., 10 MB - 25 MB)',
        'Computes client-side MD5/SHA256 checksums per chunk for bit-rot detection',
        'Executes concurrent HTTP PUT uploads directly to presigned S3 URLs',
        'Maintains local state to automatically resume interrupted transfers without re-uploading completed parts'
      ],
      apis: [
        'POST /api/v1/videos/upload-sessions (Request session & presigned URLs)',
        'PUT {presignedS3Url} (Binary part upload directly to object storage)',
        'POST /api/v1/videos/upload-sessions/{id}/complete (Finalize multipart upload)'
      ],
      storage: [
        'Browser IndexedDB / SQLite (Tracks uploadId, completed part ETags, and byte offsets locally)'
      ],
      tradeoffs: [
        'Direct-to-S3 avoids overloading internal backend servers with multi-gigabyte media payload streams',
        'Requires sophisticated client retry and resume logic to handle transient mobile disconnections'
      ],
      failureModes: [
        'Network drop during chunk upload: Client catches socket error and retries the specific chunk with exponential backoff',
        'Presigned URL expiry (TTL elapsed): Client requests fresh batch of signed URLs using upload session token'
      ]
    },
    'viewer-client': {
      title: 'Video Consumer Player (ABR Engine)',
      tier: 'Client Tier',
      responsibilities: [
        'Parses master playlist (.m3u8 / .mpd) containing video bitrate ladders and audio tracks',
        'Executes Adaptive Bitrate (ABR) switching algorithms based on measured throughput and buffer length',
        'Emits periodic playback heartbeat telemetry (play, pause, buffer, watch duration)'
      ],
      apis: [
        'GET /api/v1/videos/{id}/playback (Retrieve signed master playlist URL)',
        'GET https://cdn.youtube.com/hls/{id}/1080p/segment_001.ts (Pull media segment from CDN)',
        'POST /api/v1/telemetry/watch-ping (Emit watch heartbeat)'
      ],
      storage: [
        'RAM Playback Buffer (Maintains 30-60 seconds of forward video chunks in memory)',
        'Local Storage / SQLite (Caches playback progress, quality settings, and audio language preference)'
      ],
      tradeoffs: [
        'Aggressive prefetching ensures zero stalls but consumes viewer mobile data if playback is abandoned early',
        'Conservative buffer limits memory footprint on low-end devices but increases risk of buffering during speed drops'
      ],
      failureModes: [
        'Segment download timeout: Fallback immediately to a lower bitrate variant before playback buffer empties',
        'CDN edge 5xx error: Failover to backup CDN domain configured in the player multi-CDN manifest'
      ]
    },
    'api-gw': {
      title: 'API Gateway & Ingress Fleet',
      tier: 'Ingress & Edge CDN Tier',
      responsibilities: [
        'Terminates TLS, validates JWT user authentication, and inspects request quotas',
        'Enforces distributed rate limiting per creator/viewer IP and API key',
        'Routes playback metadata requests and upload session negotiations to backend microservices'
      ],
      apis: [
        'POST /api/v1/videos/upload-sessions',
        'GET /api/v1/videos/{videoId}',
        'GET /api/v1/videos/{videoId}/playback'
      ],
      storage: [
        'Local In-Memory Cache (Short TTL routes & schema definitions)',
        'Redis Token Bucket Cluster (Tracks sliding-window rate limits)'
      ],
      tradeoffs: [
        'Stateless gateway architecture scales elastically with incoming traffic',
        'Media binary bytes intentionally bypass gateway to preserve CPU and network bandwidth for control plane'
      ],
      failureModes: [
        'Gateway pod crash: Anycast DNS and L4 NLB health checks instantly route traffic to surviving gateway replicas',
        'Upstream service latency spike: Circuit breakers trigger fallback responses and cached metadata'
      ]
    },
    'edge-cdn': {
      title: 'Global Edge Content Delivery Network (PoPs)',
      tier: 'Ingress & Edge CDN Tier',
      responsibilities: [
        'Terminates viewer requests at edge nodes closest to end-users via BGP Anycast routing',
        'Caches popular video manifest files (.m3u8, .mpd) and media segments (.ts, .m4s) on high-speed NVMe drives',
        'Collapses concurrent cache misses for identical video segments using origin request coalescing'
      ],
      apis: [
        'GET /videos/{id}/{quality}/manifest.m3u8',
        'GET /videos/{id}/{quality}/seg_{num}.ts'
      ],
      storage: [
        'Edge NVMe SSD Tier (Hot video segments cached with LRU / LFU eviction policy)',
        'Origin Shield Tier (Mid-tier caching layer shielding the primary S3 storage bucket)'
      ],
      tradeoffs: [
        'Global edge caching absorbs 98%+ of read bandwidth, reducing S3 egress costs by millions of dollars',
        'Cache invalidation for deleted or copyright-flagged videos requires fast global purge API execution'
      ],
      failureModes: [
        'Edge PoP outage: Anycast BGP automatically shifts traffic to adjacent geographical PoP',
        'Origin shield congestion: Throttles background origin pulls while serving stale cache with `stale-while-revalidate`'
      ]
    },
    'upload-svc': {
      title: 'Resumable Upload Service',
      tier: 'Transcoding & Compute Tier',
      responsibilities: [
        'Coordinates multipart upload lifecycle (creation, presigned part URL signing, completion, abort)',
        'Validates client permissions, quotas, and file format constraints (max size 256GB, approved MIME types)',
        'Emits ingestion completion events to Kafka to initiate downstream transcoding DAGs'
      ],
      apis: [
        'POST /api/v1/videos/upload-sessions (Initialize session)',
        'GET /api/v1/videos/upload-sessions/{id}/status (Check missing parts)',
        'POST /api/v1/videos/upload-sessions/{id}/complete (Verify ETags and complete S3 upload)'
      ],
      storage: [
        'Upload Session Cache (Redis: session state, completed part indices, TTL)',
        'Video Metadata DB (Persists upload session record, original file checksum, and ownership)'
      ],
      tradeoffs: [
        'Generating presigned URLs offloads high-volume binary payload ingestion from backend application servers',
        'S3 bucket requires automated lifecycle rules to prune uncompleted multipart uploads older than 7 days'
      ],
      failureModes: [
        'S3 presigned URL generation failure: Graceful retry with secondary cloud credentials',
        'Database write failure: Redis maintains active session metadata as temporary write-through buffer'
      ]
    },
    'transcode-orchestrator': {
      title: 'Transcoding DAG Orchestrator',
      tier: 'Transcoding & Compute Tier',
      responsibilities: [
        'Decomposes video transcoding into a Directed Acyclic Graph (DAG) of discrete tasks (Split, Encode, Pack, Thumbnail)',
        'Splits master videos into Group of Pictures (GOP) chunks along keyframe boundaries',
        'Manages task scheduling, dependencies, timeouts, retries, and worker dead-letter queues'
      ],
      apis: [
        'Internal gRPC: ScheduleDAG(videoId, rawBucketKey)',
        'Internal gRPC: ReportTaskCompletion(taskId, chunkId, status, outputKey)'
      ],
      storage: [
        'Workflow State Store (Temporal / DB tracking execution DAG state, retries, and task dependencies)',
        'Task Queue (Kafka / SQS partitioned by priority: premium creators vs. standard uploads)'
      ],
      tradeoffs: [
        'Fine-grained GOP chunking enables horizontal scaling across thousands of GPU nodes, reducing 1-hour 4K encode time to 3 minutes',
        'Requires complex distributed state coordination to stitch chunks and handle partial worker failures'
      ],
      failureModes: [
        'Worker timeout or spot instance termination: Orchestrator reassigns the uncompleted chunk task to another worker node',
        'Corrupt source video: Catches decoding error, aborts DAG early, and flags video as UNPROCESSABLE in metadata DB'
      ]
    },
    'transcode-workers': {
      title: 'GPU Transcoding Farm (FFmpeg / Hardware Encoders)',
      tier: 'Transcoding & Compute Tier',
      responsibilities: [
        'Fetches raw video chunks from storage and executes parallel hardware-accelerated video/audio encoding',
        'Transcodes into multiple codec standards (AV1 for modern browsers, VP9 for mobile, H.264/AVC for legacy fallback)',
        'Outputs multiple resolution profiles (2160p 4K, 1080p, 720p, 480p, 360p, 144p) with tuned Constant Rate Factors (CRF)'
      ],
      apis: [
        'Worker Internal: ProcessChunk(chunkSpec)',
        'FFmpeg CLI / NVENC C++ API'
      ],
      storage: [
        'Local Fast Scratch NVMe (Temporary disk space for decoding frames and intermediate bitstreams)'
      ],
      tradeoffs: [
        'GPU spot instances offer 70% cost reduction over on-demand hardware, but demand robust task idempotency',
        'Modern AV1 codec delivers 30%+ bandwidth savings over H.264 but consumes 3x more compute cycles during encoding'
      ],
      failureModes: [
        'Worker out-of-memory or GPU driver crash: Process supervisor restarts container; DAG orchestrator detects timeout',
        'Hardware acceleration unavailable: Fallback to multi-threaded CPU software encoding with reduced preset'
      ]
    },
    'raw-storage': {
      title: 'Raw Video Store (S3 / Cloud Storage)',
      tier: 'Storage & Analytics Tier',
      responsibilities: [
        'Serves as the high-durability ingestion repository for uploaded master video files',
        'Enforces 99.999999999% (11 9s) durability with multi-AZ replication',
        'Transitions raw video masters to Infrequent Access (IA) or Glacier after successful transcoding'
      ],
      apis: [
        'S3 Multipart Upload API (Initiate, UploadPart, CompleteMultipartUpload)',
        'S3 GetObject (Stream chunks to transcoding worker fleet)'
      ],
      storage: [
        'AWS S3 Standard / Google Cloud Storage Standard'
      ],
      tradeoffs: [
        'Original raw files are preserved for future re-transcoding into emerging codecs (e.g. AV2, VVC)',
        'High storage volume requires automated archival lifecycle rules to transition old masters to cold storage'
      ],
      failureModes: [
        'S3 regional degradation: Dual-region bucket replication ensures master files remain accessible for transcoding'
      ]
    },
    'processed-storage': {
      title: 'Transcoded Media Store (HLS / DASH Assets)',
      tier: 'Storage & Analytics Tier',
      responsibilities: [
        'Stores fragmented MP4 (fMP4) and MPEG-2 Transport Stream (.ts) chunks for all resolutions and codecs',
        'Houses master playlists (master.m3u8, manifest.mpd) and variant-specific index files',
        'Acts as the primary HTTP origin server backing the Global CDN edge fleet'
      ],
      apis: [
        'S3 PutObject / BatchPut (Written by packaging workers)',
        'HTTP GET (Origin pulls by CDN edge servers)'
      ],
      storage: [
        'Standard Object Storage with Byte-Range request support and origin shield integration'
      ],
      tradeoffs: [
        'Storing 6 resolutions across 3 codecs multiplies storage footprint by ~12x over raw file size',
        'Enables flawless Adaptive Bitrate (ABR) streaming tailored to any device screen and network capacity'
      ],
      failureModes: [
        'Origin throttling under cache miss stampede: CDN origin-shield collapsing prevents thundering herd on S3 bucket'
      ]
    },
    'metadata-db': {
      title: 'Video Metadata Database Cluster',
      tier: 'Storage & Analytics Tier',
      responsibilities: [
        'Stores structured video catalog records (videoId, channelId, title, description, status, masterManifestUrl)',
        'Tracks user subscriptions, playlists, upload histories, and video permission flags',
        'Provides low-latency indexed queries partitioned by videoId and channelId'
      ],
      apis: [
        'SQL / CQL: SELECT * FROM videos WHERE video_id = ?',
        'SQL / CQL: UPDATE videos SET status = "READY", manifest_url = ? WHERE video_id = ?'
      ],
      storage: [
        'CockroachDB / Apache Cassandra (Active-active multi-region replication with local read replicas)'
      ],
      tradeoffs: [
        'Separates video metadata from raw media binary blobs to maintain high database query performance',
        'Eventual consistency on read replicas acceptable for title/description reads, strong consistency for upload state'
      ],
      failureModes: [
        'Primary partition failover: Raft / Paxos consensus automatically promotes replica in < 2 seconds with zero data loss'
      ]
    },
    'metadata-svc': {
      title: 'Video Catalog & Metadata Service',
      tier: 'Transcoding & Compute Tier',
      responsibilities: [
        'Serves video details, author info, like/dislike counts, and playback manifest endpoints to clients',
        'Aggregates cached video metadata and resolves CDN-signed stream URLs',
        'Publishes video update events to the Elasticsearch / Vector search cluster'
      ],
      apis: [
        'GET /api/v1/videos/{videoId}',
        'GET /api/v1/videos/{videoId}/playback',
        'PATCH /api/v1/videos/{videoId} (Update title/tags)'
      ],
      storage: [
        'Distributed Redis Cache (Caches video metadata JSON blobs with 5-minute TTL and write-through updates)'
      ],
      tradeoffs: [
        'Redis caching fronting the metadata service achieves > 95% cache hit ratio for trending videos',
        'Requires cache invalidation hook when creator edits video details or privacy settings'
      ],
      failureModes: [
        'Redis cache cold start: Circuit breaker throttles DB queries and uses stale cached data during recovery'
      ]
    },
    'analytics-pipeline': {
      title: 'View Count & Telemetry Analytics Engine',
      tier: 'Storage & Analytics Tier',
      responsibilities: [
        'Ingests high-velocity viewer watch heartbeats (50,000+ pings/sec) into distributed Kafka topics',
        'Applies stream processing (Apache Flink) to deduplicate views and filter bot fraud',
        'Maintains approximate unique view counters using HyperLogLog and periodically updates Redis / SQL'
      ],
      apis: [
        'POST /api/v1/telemetry/watch-ping (Ingestion endpoint)',
        'Internal Kafka Topic: `video-playback-events`',
        'GET /api/v1/videos/{id}/views (Returns real-time aggregated view count)'
      ],
      storage: [
        'Kafka Event Stream (7-day retention distributed buffer)',
        'Redis Counter Cluster (In-memory real-time view counts flushed to database periodically)'
      ],
      tradeoffs: [
        'HyperLogLog streaming counters scale horizontally to millions of concurrent views with < 1% error rate',
        'Decouples view counting from user playback path, preventing database contention during viral video spikes'
      ],
      failureModes: [
        'Flink consumer group lag: Kafka retains raw events safely while autoscaling consumer task managers'
      ]
    }
  },

  // System-Level Architectural Trade-offs
  tradeoffs: [
    {
      id: 'to-upload-path',
      decision: 'Direct S3 Upload via Presigned URLs vs. API Gateway Proxying',
      optionA: {
        name: 'Direct-to-S3 Multipart Upload with Presigned URLs',
        pros: [
          'Offloads massive multi-gigabyte media payload streams completely from backend servers',
          'Eliminates reverse-proxy memory pressure, socket exhaustion, and network IO bottlenecks',
          'Leverages S3 Anycast edge routing and native multipart parallel upload acceleration'
        ],
        cons: [
          'Requires client to handle multipart chunk calculation, part ETags, and complete calls',
          'Direct S3 uploads cannot inspect payload content on-the-fly before bytes land in storage'
        ]
      },
      optionB: {
        name: 'Reverse Proxying Media Bytes via API Gateway Fleet',
        pros: [
          'Simpler client implementation (single standard HTTP POST)',
          'Allows immediate virus scanning and magic byte verification in gateway stream'
        ],
        cons: [
          'Gateway fleet requires massive network bandwidth and RAM buffering to support concurrent uploads',
          'Single transient failure between gateway and S3 invalidates the entire stream'
        ]
      },
      verdict: 'Direct-to-S3 uploads with presigned URLs are the undisputed industry standard for video platforms at YouTube scale, removing millions of dollars of unnecessary gateway proxy infrastructure.',
      relatedNodes: ['creator-client', 'api-gw', 'upload-svc', 'raw-storage']
    },
    {
      id: 'to-transcoding-dag',
      decision: 'Chunk-Based Parallel DAG Transcoding vs. Single-Worker Monolithic Encoding',
      optionA: {
        name: 'Chunk-Based DAG Transcoding (Split by Keyframe / GOP)',
        pros: [
          'Reduces end-to-end processing latency from hours to minutes by distributing GOP chunks across 50+ GPU workers',
          'Failed worker only invalidates a 4-second chunk rather than requiring the whole video to be re-encoded',
          'Allows dynamic scaling of spot GPU instances matching instantaneous upload queues'
        ],
        cons: [
          'Requires sophisticated keyframe alignment and audio sync during post-encode stitching',
          'High coordination overhead via workflow engines (Temporal/Kafka)'
        ]
      },
      optionB: {
        name: 'Monolithic Single-Worker Encoding Pipeline',
        pros: [
          'Simple implementation with standard FFmpeg CLI execution',
          'No complex chunk stitching or keyframe split logic required'
        ],
        cons: [
          'A 2-hour 4K video takes 1+ hour on a single worker; crashes require complete restart from byte 0',
          'Poor resource utilization and unacceptable publication delay for creators'
        ]
      },
      verdict: 'Chunk-based parallel DAG encoding is mandatory for modern consumer video; splitting along keyframe (GOP) boundaries allows 4K videos to process in minutes while providing resilience against worker failures.',
      relatedNodes: ['transcode-orchestrator', 'transcode-workers', 'processed-storage']
    },
    {
      id: 'to-streaming-format',
      decision: 'Multi-Bitrate HLS & MPEG-DASH with CMAF vs. Progressive MP4 Download',
      optionA: {
        name: 'HLS / MPEG-DASH Chunked Streaming with CMAF Segments',
        pros: [
          'Enables seamless Adaptive Bitrate (ABR) switching matching real-time user bandwidth and buffer levels',
          'CMAF (Common Media Application Format) shares single media segment pool between HLS and DASH players',
          'Standard HTTP chunk requests are natively cacheable by every edge CDN and browser cache'
        ],
        cons: [
          'Generates thousands of small segment files per video, increasing storage object counts and manifest complexity'
        ]
      },
      optionB: {
        name: 'Single Progressive MP4 File Download',
        pros: [
          'Single file per video; simple storage layout and direct HTTP range request playback'
        ],
        cons: [
          'Cannot adapt to changing mobile cellular signal; severe buffering and rebuffering stalls',
          'Fixed resolution forces low-bandwidth users to suffer or high-bandwidth users to see poor quality'
        ]
      },
      verdict: 'Chunked HLS/DASH streaming with CMAF is non-negotiable for video-sharing platforms. It eliminates playback stalls, adapts on-the-fly, and optimizes CDN delivery.',
      relatedNodes: ['viewer-client', 'edge-cdn', 'processed-storage']
    },
    {
      id: 'to-cdn-strategy',
      decision: 'Multi-CDN Edge Architecture vs. Single Cloud Vendor CDN',
      optionA: {
        name: 'Multi-CDN Anycast Edge Federation',
        pros: [
          'Eliminates single point of failure; if a CDN vendor suffers an edge outage, traffic fails over in seconds',
          'Allows dynamic DNS latency steering to select the fastest CDN per ISP and geography',
          'Grants strong commercial leverage to negotiate lower per-terabyte egress pricing'
        ],
        cons: [
          'Requires uniform caching configurations, token verification logic, and multi-CDN analytics aggregation'
        ]
      },
      optionB: {
        name: 'Single Cloud Native CDN (e.g., AWS CloudFront Only)',
        pros: [
          'Tight native integration with primary cloud storage (S3) and single billing console',
          'Simpler operations and DNS management'
        ],
        cons: [
          'High vendor lock-in and elevated egress pricing at exabyte scale',
          'Single point of global failure during regional ISP peering or CDN infrastructure outages'
        ]
      },
      verdict: 'At YouTube scale, a multi-CDN strategy provides essential redundancy, optimal regional latency, and substantial cost savings across exabytes of streaming delivery.',
      relatedNodes: ['viewer-client', 'edge-cdn', 'processed-storage']
    },
    {
      id: 'to-view-counter',
      decision: 'Streaming Approximate Aggregation (Kafka + Flink + Redis HLL) vs. Synchronous SQL Counter Increments',
      optionA: {
        name: 'Event-Driven Stream Processing with HyperLogLog & Sliding Windows',
        pros: [
          'Easily sustains 100,000+ views/sec with zero database contention or locking overhead',
          'HyperLogLog provides high-accuracy cardinality estimation with constant minimal memory per video',
          'Flink stream processing allows complex fraud detection, watch-time thresholds, and bot filtering'
        ],
        cons: [
          'View counts displayed to users are eventually consistent (delayed by 10-30 seconds)',
          'Requires maintaining a distributed streaming pipeline (Kafka, Flink, Redis)'
        ]
      },
      optionB: {
        name: 'Synchronous Relational DB Atomic Counter Updates (`UPDATE videos SET views = views + 1`)',
        pros: [
          'Instantaneous strong consistency; exact view count immediately visible'
        ],
        cons: [
          'Deadlocks and crashes relational database row locks under viral traffic spikes (>10,000 req/sec on one video)',
          'Ties critical user playback experience to database write availability'
        ]
      },
      verdict: 'Streaming approximate aggregation via Kafka, Flink, and Redis HyperLogLog decouples telemetry ingestion from database durability, ensuring resilience during viral traffic spikes.',
      relatedNodes: ['viewer-client', 'analytics-pipeline', 'metadata-db']
    }
  ]
};
