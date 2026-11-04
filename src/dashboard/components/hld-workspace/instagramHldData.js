/**
 * Instagram High-Level Architecture (HLD) Data Specification
 * Pure architecture data model separated from presentation.
 * Supports:
 * - Architecture topology (nodes, tiers, links)
 * - Request flows (Direct Media Upload, Hybrid Fan-Out, Home Feed Generation)
 * - Detailed component specifications (Responsibilities, APIs, Storage, Trade-offs, Failure modes)
 * - System-level architectural trade-offs
 */

export const INSTAGRAM_HLD_DATA = {
  lessonId: 'instagram',
  title: 'Distributed Photo-Sharing & Hybrid Feed Architecture (Instagram)',
  systemName: 'Consumer-Scale Photo Sharing, Hybrid Timeline Fan-Out & Edge CDN Platform',
  scaleMetrics: {
    monthlyCreates: '100 Million photos uploaded/day',
    avgWriteRps: '~1,200 uploads/sec',
    peakWriteRps: '~5,000 uploads/sec',
    monthlyRedirects: '300 Billion feed impressions/mo',
    avgReadRps: '~115,000 feed requests/sec',
    peakReadRps: '~300,000 feed requests/sec',
    targetRedirectLatency: '< 150 ms P99 Home Feed / < 50 ms Media TTFB',
    storagePerYear: '~7.3 PB media blobs / year + 10 TB metadata'
  },

  scaleMetricsList: [
    { label: 'Daily Active Users', value: '100M+ DAU', color: 'blue' },
    { label: 'Upload Volume', value: '100M photos / day', color: 'emerald' },
    { label: 'Feed Read QPS', value: '300,000 peak req/sec', color: 'indigo' },
    { label: 'Read-to-Write Ratio', value: '100 : 1 Read Heavy', color: 'cyan' },
    { label: 'Storage Ingestion', value: '20 TB new media / day', color: 'amber' }
  ],

  // Tier boundaries for the SVG Canvas (viewBox 0 0 1100 680)
  tierBoxes: [
    { x: 210, y: 30, w: 380, h: 390, textX: 225, textY: 55, title: 'MEDIA INGRESS & ASYNC PROCESSING TIER', color: 'indigo' },
    { x: 605, y: 30, w: 440, h: 400, textX: 620, textY: 55, title: 'HYBRID FAN-OUT & IN-MEMORY TIMELINE CLUSTERS', color: 'blue' },
    { x: 210, y: 440, w: 835, h: 225, textX: 225, textY: 465, title: 'PERSISTENCE, SOCIAL GRAPH & CDN DELIVERY PIPELINE', color: 'amber' }
  ],

  // Architectural Tiers for grouping
  tiers: [
    { id: 'client-tier', name: 'Client & Edge CDN Tier', color: 'slate' },
    { id: 'ingress-tier', name: 'Media Ingress & Stateless Compute Tier', color: 'indigo' },
    { id: 'fanout-tier', name: 'Hybrid Fan-Out & Timeline Cache Tier', color: 'emerald' },
    { id: 'storage-tier', name: 'Object Store, Graph & Persistence Tier', color: 'amber' }
  ],

  // Interactive Nodes on the SVG Canvas (viewBox 0 0 1100 680)
  nodes: [
    {
      id: 'clients',
      label: 'Clients (iOS, Android, Web)',
      sublabel: 'Camera Uploads • Inf-Scroll Feed',
      tier: 'client-tier',
      tierLabel: 'Mobile / Web',
      category: 'Client Tier',
      icon: 'devices',
      x: 40,
      y: 190,
      width: 150,
      height: 90,
      badge: '100M+ Active Users',
      color: 'slate'
    },
    {
      id: 'api-gateway',
      label: 'Edge API Gateway',
      sublabel: 'Auth • Rate Limit • Presigned Tokens',
      tier: 'ingress-tier',
      tierLabel: 'Edge Ingress',
      category: 'Edge & Ingress',
      icon: 'hub',
      x: 230,
      y: 190,
      width: 155,
      height: 85,
      badge: 'Presigned URL Issuer',
      color: 'indigo'
    },
    {
      id: 's3-storage',
      label: 'Object Storage (S3 / GCS)',
      sublabel: 'Raw Photos • Multi-Res WebP Blobs',
      tier: 'ingress-tier',
      tierLabel: 'Media Storage',
      category: 'Object Storage',
      icon: 'cloud_upload',
      x: 230,
      y: 55,
      width: 155,
      height: 85,
      badge: 'Direct Client Upload',
      color: 'cyan'
    },
    {
      id: 'media-workers',
      label: 'Media Processing Workers',
      sublabel: 'Thumbnails (150/600/1080) • NSFW Scan',
      tier: 'ingress-tier',
      tierLabel: 'Media Compute',
      category: 'Async Compute',
      icon: 'photo_size_select_actual',
      x: 415,
      y: 55,
      width: 165,
      height: 85,
      badge: 'Async Transcoder Fleet',
      color: 'teal'
    },
    {
      id: 'post-service',
      label: 'Post & Metadata Service',
      sublabel: 'Captions • User Link • Post IDs',
      tier: 'ingress-tier',
      tierLabel: 'Core Service',
      category: 'Stateless Compute',
      icon: 'post_add',
      x: 415,
      y: 190,
      width: 165,
      height: 85,
      badge: 'Transactional Posts',
      color: 'blue'
    },
    {
      id: 'event-bus',
      label: 'Event Bus (Kafka)',
      sublabel: 'PostCreated • UserFollowed Topics',
      tier: 'fanout-tier',
      tierLabel: 'Message Queue',
      category: 'Event Stream',
      icon: 'move_down',
      x: 415,
      y: 305,
      width: 165,
      height: 80,
      badge: 'Async Event Backbone',
      color: 'amber'
    },
    {
      id: 'fanout-workers',
      label: 'Hybrid Fan-Out Workers',
      sublabel: 'Push (Regular) vs Pull (Celebrities)',
      tier: 'fanout-tier',
      tierLabel: 'Timeline Engine',
      category: 'Fan-Out Compute',
      icon: 'call_split',
      x: 620,
      y: 65,
      width: 180,
      height: 85,
      badge: 'Hybrid Fan-Out Router',
      color: 'indigo'
    },
    {
      id: 'user-timeline-cache',
      label: 'User Timeline Cache (Redis)',
      sublabel: 'ZSET (PostID, Timestamp) • 800 Max',
      tier: 'fanout-tier',
      tierLabel: 'In-Memory Cache',
      category: 'Timeline Storage',
      icon: 'memory',
      x: 840,
      y: 65,
      width: 180,
      height: 85,
      badge: 'Push Timelines (ZSET)',
      color: 'emerald'
    },
    {
      id: 'celebrity-timeline-cache',
      label: 'Celebrity Timeline Cache',
      sublabel: 'Dedicated VIP Posts (Pull on Read)',
      tier: 'fanout-tier',
      tierLabel: 'In-Memory Cache',
      category: 'Timeline Storage',
      icon: 'star',
      x: 840,
      y: 175,
      width: 180,
      height: 85,
      badge: 'VIP Timelines (No Fanout)',
      color: 'amber'
    },
    {
      id: 'feed-aggregator',
      label: 'Feed Aggregator Service',
      sublabel: 'K-Way Merge • Cursor Pagination',
      tier: 'fanout-tier',
      tierLabel: 'Feed Compute',
      category: 'Stateless Compute',
      icon: 'dynamic_feed',
      x: 840,
      y: 285,
      width: 180,
      height: 85,
      badge: 'Feed Blending Engine',
      color: 'blue'
    },
    {
      id: 'social-graph-db',
      label: 'Social Graph DB (PostgreSQL)',
      sublabel: 'Followers / Followees Edge Tables',
      tier: 'storage-tier',
      tierLabel: 'Graph Storage',
      category: 'Persistence Tier',
      icon: 'hub',
      x: 415,
      y: 470,
      width: 165,
      height: 95,
      badge: 'Graph Adjacency Store',
      color: 'violet'
    },
    {
      id: 'cdn-edge',
      label: 'Global CDN Edge (Cloudflare)',
      sublabel: 'Regional Edge PoPs • 99% Cache Hit',
      tier: 'client-tier',
      tierLabel: 'Edge Delivery',
      category: 'Content Delivery',
      icon: 'public',
      x: 620,
      y: 470,
      width: 180,
      height: 95,
      badge: 'Zero-Origin Media Hit',
      color: 'cyan'
    }
  ],

  // Directed links between nodes
  links: [
    {
      id: 'link-client-gw',
      from: 'clients',
      to: 'api-gateway',
      label: '1. Request Presigned Upload URL',
      type: 'bidirectional',
      flows: ['direct-upload', 'feed-render'],
      path: 'M 190 232 L 230 232'
    },
    {
      id: 'link-client-s3',
      from: 'clients',
      to: 's3-storage',
      label: '2. Direct PUT Photo Binary',
      type: 'forward',
      flows: ['direct-upload'],
      path: 'M 150 190 C 150 97, 190 97, 230 97'
    },
    {
      id: 'link-s3-workers',
      from: 's3-storage',
      to: 'media-workers',
      label: '3. S3 ObjectCreated Event',
      type: 'forward',
      flows: ['direct-upload'],
      path: 'M 385 97 L 415 97'
    },
    {
      id: 'link-client-post',
      from: 'api-gateway',
      to: 'post-service',
      label: '4. Commit Post Metadata',
      type: 'forward',
      flows: ['direct-upload'],
      path: 'M 385 232 L 415 232'
    },
    {
      id: 'link-post-kafka',
      from: 'post-service',
      to: 'event-bus',
      label: '5. Emit PostCreated Event',
      type: 'forward',
      flows: ['direct-upload', 'hybrid-fanout'],
      path: 'M 497 275 L 497 305'
    },
    {
      id: 'link-kafka-fanout',
      from: 'event-bus',
      to: 'fanout-workers',
      label: 'Consume PostCreated Batch',
      type: 'forward',
      flows: ['hybrid-fanout'],
      path: 'M 580 345 C 650 345, 650 180, 680 150'
    },
    {
      id: 'link-fanout-graph',
      from: 'fanout-workers',
      to: 'social-graph-db',
      label: 'Query Follower Count & IDs',
      type: 'bidirectional',
      flows: ['hybrid-fanout'],
      path: 'M 710 150 C 710 320, 500 400, 500 470'
    },
    {
      id: 'link-fanout-usercache',
      from: 'fanout-workers',
      to: 'user-timeline-cache',
      label: 'Normal User: Push to Timelines',
      type: 'forward',
      flows: ['hybrid-fanout'],
      path: 'M 800 107 L 840 107'
    },
    {
      id: 'link-fanout-celebcache',
      from: 'fanout-workers',
      to: 'celebrity-timeline-cache',
      label: 'Celebrity: Write VIP Timeline',
      type: 'forward',
      flows: ['hybrid-fanout'],
      path: 'M 780 150 C 800 180, 810 217, 840 217'
    },
    {
      id: 'link-client-feed',
      from: 'clients',
      to: 'feed-aggregator',
      label: 'GET /api/v1/feed?cursor=...',
      type: 'forward',
      flows: ['feed-render'],
      path: 'M 190 250 C 350 420, 750 327, 840 327'
    },
    {
      id: 'link-feed-usercache',
      from: 'feed-aggregator',
      to: 'user-timeline-cache',
      label: 'Pull User Timeline (ZREVRANGEBYSCORE)',
      type: 'bidirectional',
      flows: ['feed-render'],
      path: 'M 930 285 L 930 150'
    },
    {
      id: 'link-feed-celebcache',
      from: 'feed-aggregator',
      to: 'celebrity-timeline-cache',
      label: 'Pull Followed VIP Posts',
      type: 'bidirectional',
      flows: ['feed-render'],
      path: 'M 930 285 L 930 260'
    },
    {
      id: 'link-cdn-client',
      from: 'cdn-edge',
      to: 'clients',
      label: 'Stream WebP Image Blobs (< 50ms)',
      type: 'forward',
      flows: ['feed-render'],
      path: 'M 620 515 C 350 515, 120 400, 115 280'
    }
  ],

  // Step-by-Step Request Flows
  flows: [
    {
      id: 'direct-upload',
      name: '1. Direct Media Upload & Post Publishing Flow',
      shortDesc: 'Bypasses application gateway bottlenecks by issuing presigned URLs for direct S3 photo uploads.',
      color: 'emerald',
      steps: [
        {
          step: 1,
          title: 'Request Presigned S3 Upload URL',
          source: 'clients',
          target: 'api-gateway',
          desc: 'Mobile client requests upload authorization via <code>POST /api/v1/media/upload-intent</code>. Gateway verifies auth and returns signed S3 PUT URL with 15-minute TTL.',
          badge: 'Presigned Authorization',
          highlightNodes: ['clients', 'api-gateway'],
          highlightLinks: ['link-client-gw']
        },
        {
          step: 2,
          title: 'Direct Binary Upload to Object Storage',
          source: 'clients',
          target: 's3-storage',
          desc: 'Client streams high-res photo binary directly to AWS S3 / GCS bucket. Application servers handle 0 bytes of media traffic, eliminating bandwidth choke.',
          badge: 'Zero-Gateway Media Traffic',
          highlightNodes: ['clients', 's3-storage'],
          highlightLinks: ['link-client-s3']
        },
        {
          step: 3,
          title: 'Asynchronous Media Transcoding Fleet',
          source: 's3-storage',
          target: 'media-workers',
          desc: 'S3 emits <code>ObjectCreated</code> event to SQS/Kafka. Media workers resize image into 150x150, 600x600, and 1080x1080 WebP variants, executing NSFW scan.',
          badge: 'WebP Multi-Resolution',
          highlightNodes: ['s3-storage', 'media-workers'],
          highlightLinks: ['link-s3-workers']
        },
        {
          step: 4,
          title: 'Commit Post Metadata to Post Service',
          source: 'api-gateway',
          target: 'post-service',
          desc: 'Client invokes <code>POST /api/v1/posts</code> with caption, tags, and mediaKey. Post Service generates 64-bit Snowflake PostID and persists record in PostgreSQL.',
          badge: 'Transactional Post Commit',
          highlightNodes: ['api-gateway', 'post-service'],
          highlightLinks: ['link-client-post']
        },
        {
          step: 5,
          title: 'Publish PostCreated Event to Kafka',
          source: 'post-service',
          target: 'event-bus',
          desc: 'Post Service writes to Transactional Outbox and publishes <code>PostCreated(postId, authorId, timestamp)</code> event to Kafka for decoupled feed fan-out.',
          badge: 'Decoupled Event Publish',
          highlightNodes: ['post-service', 'event-bus'],
          highlightLinks: ['link-post-kafka']
        }
      ]
    },
    {
      id: 'hybrid-fanout',
      name: '2. Hybrid Fan-Out Flow (Push for Normal vs. Pull for Celebrities)',
      shortDesc: 'Eliminates write amplification: pushes to timelines for regular users; pulls dynamically for celebrities.',
      color: 'blue',
      steps: [
        {
          step: 1,
          title: 'Fan-Out Worker Consumes Post Event',
          source: 'event-bus',
          target: 'fanout-workers',
          desc: 'Fan-out worker fleet dequeues <code>PostCreated</code> message from Kafka partition with parallel consumer groups.',
          badge: 'Kafka Ingestion',
          highlightNodes: ['event-bus', 'fanout-workers'],
          highlightLinks: ['link-kafka-fanout']
        },
        {
          step: 2,
          title: 'Evaluate Author Follower Tier in Social Graph',
          source: 'fanout-workers',
          target: 'social-graph-db',
          desc: 'Worker queries author follower count. If author has &lt; 5,000 followers, classified as <strong>Regular User</strong>; if &gt; 5,000 followers, classified as <strong>Celebrity / Influencer</strong>.',
          badge: 'Celebrity Classification Threshold',
          highlightNodes: ['fanout-workers', 'social-graph-db'],
          highlightLinks: ['link-fanout-graph']
        },
        {
          step: 3,
          title: 'Regular Path: Fan-Out on Write (Push)',
          source: 'fanout-workers',
          target: 'user-timeline-cache',
          desc: 'For regular user, worker fetches all follower IDs and writes post ID to each follower\'s Redis timeline: <code>ZADD timeline:user_id timestamp post_id</code>. Caps list at 800 entries.',
          badge: 'Push to Follower Timelines',
          highlightNodes: ['fanout-workers', 'user-timeline-cache'],
          highlightLinks: ['link-fanout-usercache']
        },
        {
          step: 4,
          title: 'Celebrity Path: Skip Million-User Fanout (Pull on Read)',
          source: 'fanout-workers',
          target: 'celebrity-timeline-cache',
          desc: 'For celebrity (e.g. 50M followers), worker avoids 50M Redis writes! Writes post ID ONLY to author\'s own dedicated Celebrity Timeline Cache.',
          badge: 'Zero Write Amplification',
          highlightNodes: ['fanout-workers', 'celebrity-timeline-cache'],
          highlightLinks: ['link-fanout-celebcache']
        },
        {
          step: 5,
          title: 'Zero Latency Degradation for Active Feeds',
          source: 'user-timeline-cache',
          target: 'celebrity-timeline-cache',
          desc: 'Regular feeds remain blazing fast; hot celebrity updates avoid Redis memory exhaustion and network broadcast storms.',
          badge: 'Hybrid Fanout Balanced',
          highlightNodes: ['user-timeline-cache', 'celebrity-timeline-cache'],
          highlightLinks: []
        }
      ]
    },
    {
      id: 'feed-render',
      name: '3. Home Feed Generation & Edge CDN Media Delivery Flow',
      shortDesc: 'K-way timeline blending with cursor pagination, serving media with sub-50ms TTFB via global edge CDN.',
      color: 'rose',
      steps: [
        {
          step: 1,
          title: 'Client Requests Home Feed Page',
          source: 'clients',
          target: 'feed-aggregator',
          desc: 'User opens Instagram app. Client issues <code>GET /api/v1/feed?cursor=1712000000_post99&amp;limit=20</code> to the Feed Aggregator Service.',
          badge: 'Cursor-Based Query',
          highlightNodes: ['clients', 'feed-aggregator'],
          highlightLinks: ['link-client-feed']
        },
        {
          step: 2,
          title: 'Fetch In-Memory Regular Timeline',
          source: 'feed-aggregator',
          target: 'user-timeline-cache',
          desc: 'Feed service fetches user\'s personal Redis timeline using <code>ZREVRANGEBYSCORE timeline:user_id (cursor_ts -inf LIMIT 0 40</code> (takes 1.2ms).',
          badge: 'Redis ZSET Range (< 2ms)',
          highlightNodes: ['feed-aggregator', 'user-timeline-cache'],
          highlightLinks: ['link-feed-usercache']
        },
        {
          step: 3,
          title: 'Pull Followed Celebrity Timelines & K-Way Merge',
          source: 'feed-aggregator',
          target: 'celebrity-timeline-cache',
          desc: 'Queries Social Graph for followed celebrities (typically 5–20 VIPs). Fetches their recent post IDs and merges them in memory via K-way sorted priority queue.',
          badge: 'K-Way Merge Blending',
          highlightNodes: ['feed-aggregator', 'celebrity-timeline-cache'],
          highlightLinks: ['link-feed-celebcache']
        },
        {
          step: 4,
          title: 'Hydrate Post Metadata & Return JSON Feed',
          source: 'feed-aggregator',
          target: 'clients',
          desc: 'Feed service hydrates post metadata (author username, avatar, caption, like count, CDN media URLs) from Redis read cache. Returns top 20 items in <strong>45ms</strong>.',
          badge: 'Metadata Hydration (< 50ms)',
          highlightNodes: ['feed-aggregator', 'clients'],
          highlightLinks: ['link-client-feed']
        },
        {
          step: 5,
          title: 'Client Streams WebP Blobs from Global CDN',
          source: 'cdn-edge',
          target: 'clients',
          desc: 'Client displays UI and streams image blobs directly from Cloudflare / CloudFront edge PoPs with 99% cache hit ratio and sub-50ms TTFB.',
          badge: 'Edge CDN Delivery (< 50ms)',
          highlightNodes: ['cdn-edge', 'clients'],
          highlightLinks: ['link-cdn-client']
        }
      ]
    }
  ],

  // Detailed Component Specifications for Inspector Panel
  components: {
    'clients': {
      id: 'clients',
      name: 'Clients (iOS, Android & Web Applications)',
      tier: 'Client & Edge CDN Tier',
      category: 'Client Tier',
      responsibilities: [
        'Display infinite-scrolling chronological home feed with lazy-loaded media',
        'Handle client-side camera capture, compression, and direct binary upload via Presigned S3 URLs',
        'Cache feed pages locally in SQLite / CoreData for instant offline browsing',
        'Send cursor parameters on pagination to prevent duplicate/skipped posts during feed scrolls'
      ],
      apis: [
        'GET /api/v1/feed?cursor=...&limit=20 — Load next feed chunk',
        'POST /api/v1/media/upload-intent — Obtain presigned S3 upload credentials'
      ],
      storage: 'Local SQLite cache on mobile device storing last 100 viewed posts and cached images in disk cache',
      ha: 'Mobile apps deployed globally across hundreds of millions of user devices',
      failureModes: [
        'Intermittent Network Disconnect: App pauses binary upload and resumes using chunked byte-range upload (TUS protocol)'
      ],
      tradeoffs: [
        'Client-Side Image Resizing vs Server-Side Transcoding: Client compresses photo before upload to save mobile data; server still produces canonical multi-resolution variants'
      ]
    },

    'api-gateway': {
      id: 'api-gateway',
      name: 'Edge API Gateway & Presigned URL Issuer',
      tier: 'Media Ingress & Compute Tier',
      category: 'Edge & Ingress',
      responsibilities: [
        'Authenticate incoming mobile requests via OAuth2 bearer tokens',
        'Enforce per-user upload and read rate limits to protect backend clusters',
        'Generate short-lived (15-min) cryptographically signed S3/GCS PUT URLs for client uploads',
        'Route metadata API calls to Post Service, Feed Service, and User Social Graph'
      ],
      apis: [
        'POST /api/v1/media/upload-intent -> { uploadUrl, mediaKey }',
        'POST /api/v1/posts -> { postId, status: "PUBLISHED" }'
      ],
      storage: 'Stateless Envoy / Kong proxies with local rate limit token buckets',
      ha: 'Auto-scaled across multiple availability zones behind AWS Network Load Balancer',
      failureModes: [
        'Signing Key Compromise: Mitigated by rotating IAM upload signing credentials every 24 hours'
      ],
      tradeoffs: [
        'Presigned Upload URLs vs Uploading Through Gateway: Presigned URLs save millions of dollars in gateway bandwidth by streaming directly to cloud object storage'
      ]
    },

    's3-storage': {
      id: 's3-storage',
      name: 'Distributed Object Storage (AWS S3 / GCS)',
      tier: 'Media Ingress & Compute Tier',
      category: 'Object Storage',
      responsibilities: [
        'Durable storage for billions of raw photos and processed multi-resolution media variants',
        'Emit S3 <code>ObjectCreated</code> event notifications to trigger transcoding pipelines',
        'Enforce lifecycle rules: hot storage (Standard) for first 90 days; tier to Infrequent Access (S3-IA) after 1 year',
        'Serve as the origin shield behind global Cloudflare / CloudFront CDN distributions'
      ],
      apis: [
        'PUT /raw/{userId}/{uuid}.jpg — Client binary upload',
        'GET /processed/{mediaKey}_{resolution}.webp — Origin fetch from CDN'
      ],
      storage: 'Distributed erasure-coded object storage cluster (11 nines of durability)',
      ha: 'Replicated across multiple geographical regions with automated bucket replication',
      failureModes: [
        'Direct S3 Outage: CDN edge shields 99% of read traffic; uploads queue on client until S3 recovers'
      ],
      tradeoffs: [
        'Object Storage vs Database BLOBs: Object storage is 10x cheaper per GB and scales horizontally to exabytes with zero database connection pool contention'
      ]
    },

    'media-workers': {
      id: 'media-workers',
      name: 'Async Media Processing & Transcoding Fleet',
      tier: 'Media Ingress & Compute Tier',
      category: 'Async Compute',
      responsibilities: [
        'Consume S3 upload events from SQS/Kafka and stream raw photo binaries for processing',
        'Generate responsive multi-resolution WebP images: 150x150 (Thumbnail), 600x600 (Grid), 1080x1080 (Feed)',
        'Execute automated ML content moderation (NSFW detection, copyright fingerprinting, spam filters)',
        'Write processed media variants back to S3 under deterministic media keys'
      ],
      apis: [
        'SQS/Kafka consumer polling <code>media-upload-events</code>',
        'ImageMagick / libvips / FFmpeg C++ processing pipelines'
      ],
      storage: 'Ephemeral NVMe scratch disks for image decoding and encoding buffer',
      ha: 'Autoscaled worker pool based on SQS queue backlog depth metrics',
      failureModes: [
        'Poison Pill Corrupted JPEG: Worker crashes on malformed EXIF header; caught by worker sandbox and routed to Dead-Letter Queue'
      ],
      tradeoffs: [
        'Synchronous Upload-Time Processing vs Asynchronous Background Transcoding: Asynchronous processing makes post publishing instant for users without waiting 3 seconds for image compression'
      ]
    },

    'post-service': {
      id: 'post-service',
      name: 'Post & Metadata Service',
      tier: 'Media Ingress & Compute Tier',
      category: 'Stateless Compute',
      responsibilities: [
        'Persist post metadata (caption, hashtags, author ID, location, media keys) in PostgreSQL',
        'Generate monotonically increasing 64-bit Snowflake / KSUID post identifiers',
        'Implement Transactional Outbox pattern to atomically commit post record and enqueue Kafka event',
        'Expose single-post query endpoints for deep links and profile grid views'
      ],
      apis: [
        'POST /api/v1/posts — Create new post record',
        'GET /api/v1/posts/:id — Fetch single post details'
      ],
      storage: 'PostgreSQL Post table sharded by <code>author_id</code>; read replicas for profile views',
      ha: 'Stateless Go / Java microservices behind internal Envoy load balancer',
      failureModes: [
        'Database Primary Failover: Managed RDS Aurora promotes replica within 30 seconds'
      ],
      tradeoffs: [
        'Sharding by Author ID vs Post ID: Sharding by Author ID keeps all posts for a user on one database shard, making profile grid loading a single-shard query'
      ]
    },

    'event-bus': {
      id: 'event-bus',
      name: 'Event Bus (Apache Kafka)',
      tier: 'Hybrid Fan-Out Tier',
      category: 'Event Stream',
      responsibilities: [
        'Serve as high-throughput, fault-tolerant message backbone for post lifecycle events',
        'Partition <code>PostCreated</code> topic by <code>author_id</code> to maintain sequential ordering',
        'Buffer traffic spikes when high-profile accounts publish breaking news or viral photos',
        'Support multiple consumer groups: Fan-Out Engine, Search Indexer, Analytics, Notification Engine'
      ],
      apis: [
        'Kafka Producer: produce(topic="posts.created", key=author_id, payload={postId, timestamp})'
      ],
      storage: 'Distributed append-only commit logs on NVMe SSDs with 7-day retention period',
      ha: 'Multi-AZ Kafka broker cluster with replication factor of 3 and min in-sync replicas of 2',
      failureModes: [
        'Consumer Group Lag: Sudden spike in post creation delays feed fan-out; monitored via Burrow / Datadog lag alerts'
      ],
      tradeoffs: [
        'Kafka Event Stream vs Synchronous REST Fan-Out: Decoupled Kafka stream prevents slow fan-out operations from blocking the user\'s post creation HTTP response'
      ]
    },

    'fanout-workers': {
      id: 'fanout-workers',
      name: 'Hybrid Fan-Out Workers',
      tier: 'Hybrid Fan-Out Tier',
      category: 'Fan-Out Compute',
      responsibilities: [
        'Consume <code>PostCreated</code> events and evaluate author follower counts in Social Graph',
        'Execute Fan-Out on Write (Push) for regular users (&lt; 5,000 followers) into follower Redis timelines',
        'Execute Fan-Out on Read (Pull) for celebrities (&gt; 5,000 followers) by writing only to author\'s VIP cache',
        'Enforce memory caps by trimming Redis timeline ZSETs to a maximum of 800 recent post IDs'
      ],
      apis: [
        'Redis Pipeline: ZADD timeline:{follower_id} {timestamp} {post_id}',
        'Redis ZREMRANGEBYRANK timeline:{follower_id} 0 -801'
      ],
      storage: 'Stateless worker processes executing pipelined Redis write batches',
      ha: 'Dynamic horizontal worker scaling with Kubernetes HPA based on Kafka partition lag',
      failureModes: [
        'Celebrity Post Cascade: If a celebrity with 50M followers is accidentally pushed, 50M Redis writes would saturate cluster; strictly avoided by follower-count threshold check'
      ],
      tradeoffs: [
        'Pure Push vs Pure Pull vs Hybrid Fan-Out: Hybrid combines the best of both worlds: fast O(1) reads for 95% of users without the catastrophic write amplification of celebrities'
      ]
    },

    'user-timeline-cache': {
      id: 'user-timeline-cache',
      name: 'User Timeline Cache Cluster (Redis)',
      tier: 'Hybrid Fan-Out Tier',
      category: 'Timeline Storage',
      responsibilities: [
        'Store pre-computed home feed post IDs for active users using Redis Sorted Sets (ZSET)',
        'Score entries by creation timestamp (64-bit epoch) for instant reverse-chronological retrieval',
        'Cap each user\'s timeline at 800 post IDs to conserve RAM (sufficient for active scrolling)',
        'Expire idle timelines after 14 days of inactivity to evict inactive users from memory'
      ],
      apis: [
        'ZREVRANGEBYSCORE timeline:{user_id} {max_ts} -inf LIMIT 0 {limit}',
        'ZADD timeline:{user_id} {timestamp} {post_id}'
      ],
      storage: 'Sharded Redis cluster (e.g. 32 shards with 64 GB RAM each) storing lightweight 8-byte post IDs',
      ha: 'Primary-Replica pairing across availability zones with automatic Redis Sentinel / Cluster failover',
      failureModes: [
        'Cold Cache on Inactive User Login: When inactive user opens app after months, timeline cache misses; feed aggregator regenerates timeline from database'
      ],
      tradeoffs: [
        'Storing Post IDs in Cache vs Full Post Objects: Storing only 8-byte Post IDs uses 90% less RAM than caching full JSON post objects, enabling millions of timelines to fit in memory'
      ]
    },

    'celebrity-timeline-cache': {
      id: 'celebrity-timeline-cache',
      name: 'Celebrity Timeline Cache Cluster',
      tier: 'Hybrid Fan-Out Tier',
      category: 'Timeline Storage',
      responsibilities: [
        'Store the recent post history for accounts with &gt; 5,000 followers (celebrities, news, brands)',
        'Keep last 200 post IDs per celebrity in high-speed in-memory Redis ZSET',
        'Support high read concurrency when millions of followers query feed aggregator simultaneously'
      ],
      apis: [
        'ZREVRANGEBYSCORE celeb_timeline:{celeb_id} +inf -inf LIMIT 0 50'
      ],
      storage: 'Dedicated Redis read-replica cluster with memory sharding and local in-memory L1 caching',
      ha: 'Read replicas scaled heavily behind Envoy cache proxy to handle viral read surges',
      failureModes: [
        'Hot Key Contention: A viral celebrity post receives 100,000 reads/sec; protected by in-memory client L1 caching in Feed Aggregator'
      ],
      tradeoffs: [
        'Dedicated VIP Cache vs Shared Timeline Cluster: Isolating celebrities prevents viral read traffic from degrading regular user timeline performance'
      ]
    },

    'feed-aggregator': {
      id: 'feed-aggregator',
      name: 'Feed Aggregator Service',
      tier: 'Hybrid Fan-Out Tier',
      category: 'Stateless Compute',
      responsibilities: [
        'Handle incoming <code>GET /api/v1/feed</code> requests from mobile clients',
        'Fetch user\'s personal Redis timeline and identify which followed accounts are celebrities',
        'Pull recent post IDs from followed celebrities\' timeline caches',
        'Perform in-memory K-way sorted merge of post IDs based on timestamp',
        'Hydrate top 20 post IDs with author profiles, captions, and CDN URLs; return JSON feed'
      ],
      apis: [
        'GET /api/v1/feed?cursor={timestamp_postId}&limit=20'
      ],
      storage: 'Stateless Go microservice with local L1 in-process LRU cache for post metadata',
      ha: 'Autoscaled horizontally across hundreds of pods behind internal API gateway',
      failureModes: [
        'Downstream Cache Partial Outage: If celebrity cache is slow, aggregator returns regular timeline with degraded banner instead of timing out'
      ],
      tradeoffs: [
        'K-Way Merge at Read Time vs Pre-Merged Push: Performing K-way merge for only 5–20 followed celebrities takes &lt; 5ms and eliminates billions of fan-out writes'
      ]
    },

    'social-graph-db': {
      id: 'social-graph-db',
      name: 'Social Graph DB (Followers & Followees)',
      tier: 'Persistence Tier',
      category: 'Persistence Tier',
      responsibilities: [
        'Store bidirectional user follow relationships: <code>Followers(user_id)</code> and <code>Following(user_id)</code>',
        'Expose high-speed follower count queries for fan-out threshold classification',
        'Enforce privacy boundaries: verify follow authorization before displaying private accounts\' posts'
      ],
      apis: [
        'getFollowerCount(userId) -> Integer',
        'getCelebrityFollowees(userId) -> List<CelebrityID>',
        'isFollowing(followerId, targetUserId) -> Boolean'
      ],
      storage: 'PostgreSQL with composite B-Tree indexes: <code>(follower_id, followee_id)</code> and <code>(followee_id, follower_id)</code> + Redis Graph Cache',
      ha: 'Read replicas dedicated to feed aggregator queries; primary database handles follow/unfollow mutations',
      failureModes: [
        'Heavy Follower Query Bottleneck: Caching the list of followed celebrities in user profile cache eliminates 99% of graph DB queries during feed load'
      ],
      tradeoffs: [
        'Relational Adjacency Table vs Graph Database (Neo4j): Relational DB with composite indexes easily handles 1-hop follower queries at massive scale without operational complexity of graph DBs'
      ]
    },

    'cdn-edge': {
      id: 'cdn-edge',
      name: 'Global CDN Edge (Cloudflare / CloudFront)',
      tier: 'Client & Edge CDN Tier',
      category: 'Content Delivery',
      responsibilities: [
        'Cache and serve processed WebP photos and video thumbnails from 300+ Edge PoPs worldwide',
        'Achieve &gt; 99% cache hit ratio for popular feed images, offloading 99% of media bandwidth from S3',
        'Perform TLS 1.3 termination and HTTP/3 multiplexing near end users for sub-50ms photo load speeds'
      ],
      apis: [
        'GET https://cdn.instagram.com/p/{mediaKey}_{resolution}.webp'
      ],
      storage: 'Distributed SSD edge cache with geo-distributed Anycast routing',
      ha: 'Global multi-CDN redundancy across Cloudflare and AWS CloudFront',
      failureModes: [
        'CDN Cache Purge Lag: Media updates rarely change because photos are immutable (new photo = new unique mediaKey)'
      ],
      tradeoffs: [
        'Immutable URLs vs Invalidation API: Using content-addressed media hashes guarantees that CDN never serves stale images without requiring costly global cache purge calls'
      ]
    }
  },

  // System-level Architectural Trade-offs
  tradeoffs: [
    {
      id: 'to-fanout',
      decision: 'Feed Generation: Fan-Out on Write (Push) vs Fan-Out on Read (Pull) vs Hybrid',
      optionA: {
        name: 'Hybrid Fan-Out Strategy (Selected Default)',
        pros: 'Combines O(1) instant feed reads for 95% of users (Push to followers for accounts with &lt; 5k followers) while avoiding write amplification for celebrities (Pull on read for &gt; 5k followers).',
        cons: 'Increases complexity in the Feed Aggregator, which must execute a K-way sorted merge of regular timeline + celebrity posts on demand.'
      },
      optionB: {
        name: 'Pure Fan-Out on Write (Push for All)',
        pros: 'Ultra-fast feed reads: every user\'s home feed is 100% pre-computed and stored in Redis.',
        cons: 'Catastrophic write amplification: when a celebrity with 50 million followers posts, system must execute 50,000,000 Redis writes, causing massive backlog lag and Redis memory exhaustion.'
      },
      verdict: 'Recommended: Hybrid Fan-Out. Push for regular users, Pull for celebrities. Threshold of 5,000 followers prevents write storms.',
      relatedNodes: ['fanout-workers', 'user-timeline-cache', 'celebrity-timeline-cache', 'feed-aggregator']
    },
    {
      id: 'to-upload',
      decision: 'Media Upload Pipeline: Direct-to-S3 Presigned URLs vs Upload via API Gateway',
      optionA: {
        name: 'Client Direct-to-S3 via Presigned URLs (Selected Default)',
        pros: 'Bypasses application gateway fleet entirely for heavy media bytes; saves gigabits of bandwidth and prevents gateway thread exhaustion.',
        cons: 'Requires 2-step client workflow (request intent &rarr; upload binary &rarr; commit metadata); client must handle direct upload retries.'
      },
      optionB: {
        name: 'Streaming Upload Through API Gateway',
        pros: 'Single unified HTTP endpoint for clients; gateway can inspect raw bytes before persistence.',
        cons: 'Massive bandwidth cost on gateway instances; large photo/video uploads hog TCP sockets, causing gateway crashes during traffic surges.'
      },
      verdict: 'Recommended: Direct-to-S3 Presigned URLs. Keeps application servers stateless and focused on lightweight JSON traffic.',
      relatedNodes: ['clients', 'api-gateway', 's3-storage', 'media-workers']
    },
    {
      id: 'to-pagination',
      decision: 'Feed Pagination: Cursor-Based Pagination vs Offset-Based (OFFSET / LIMIT)',
      optionA: {
        name: 'Cursor-Based Pagination (timestamp_postId) (Selected Default)',
        pros: 'Deterministic and stable: newly inserted posts while user is scrolling will never cause duplicate or skipped posts. Constant O(1) performance using Redis <code>ZREVRANGEBYSCORE</code>.',
        cons: 'Cannot jump directly to an arbitrary page number (e.g. "jump to page 25"), which is unnecessary for infinite-scrolling feeds.'
      },
      optionB: {
        name: 'Offset-Based Pagination (OFFSET 100 LIMIT 20)',
        pros: 'Simple to implement in SQL; allows jumping to arbitrary page numbers.',
        cons: 'Terrible performance at deep offsets (O(N) scan in DB); causes duplicate posts or skipped content when new posts are published while scrolling.'
      },
      verdict: 'Recommended: Cursor-Based Pagination with compound cursor <code>(timestamp, postId)</code> to guarantee consistent infinite scroll.',
      relatedNodes: ['feed-aggregator', 'user-timeline-cache']
    },
    {
      id: 'to-caching',
      decision: 'Timeline Cache Storage: Storing Post IDs vs Storing Full Post JSON Blobs',
      optionA: {
        name: 'Store Only 8-byte Post IDs in Redis ZSET (Selected Default)',
        pros: 'Extremely memory efficient: 800 post IDs require only ~6.4 KB RAM per user. 100M active timelines consume &lt; 640 GB RAM across the entire Redis cluster.',
        cons: 'Requires a secondary hydration step to fetch post author names, avatars, and captions from metadata cache.'
      },
      optionB: {
        name: 'Store Full Hydrated Post JSON Blobs in Timeline',
        pros: 'Zero hydration step: Redis returns complete feed payload ready to send to client.',
        cons: 'Astronomical memory cost: caching 800 full post objects (~2 KB each) requires ~1.6 MB RAM per user, ballooning cluster size to 160 Terabytes of expensive RAM.'
      },
      verdict: 'Recommended: Store 8-byte Post IDs in Redis ZSET + Hydrate top 20 items from Post Metadata Cache on demand.',
      relatedNodes: ['user-timeline-cache', 'feed-aggregator', 'post-service']
    },
    {
      id: 'to-graph',
      decision: 'Social Graph Modeling: Relational Adjacency Table vs Dedicated Graph DB',
      optionA: {
        name: 'Relational PostgreSQL Adjacency Table with B-Tree Indexes (Selected Default)',
        pros: 'Simple, ACID compliant, scales to billions of edges when sharded by user ID. 1-hop follower queries (e.g. "who does User A follow?") execute in &lt; 2ms.',
        cons: 'Complex multi-hop graph queries (e.g. "friends of friends of friends") require recursive CTEs and are slow.'
      },
      optionB: {
        name: 'Dedicated Graph Database (Neo4j / Amazon Neptune)',
        pros: 'Native graph traversal engine optimized for deep multi-hop relationship exploration.',
        cons: 'Heavy operational overhead, difficult to shard horizontally at 500M+ user scale, and unnecessary for simple 1-hop follower lookups.'
      },
      verdict: 'Recommended: Relational Database with composite B-Tree indexes <code>(follower_id, followee_id)</code> + Redis cache of followed celebrity IDs.',
      relatedNodes: ['social-graph-db', 'fanout-workers', 'feed-aggregator']
    }
  ]
};
