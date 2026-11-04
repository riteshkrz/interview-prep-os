/**
 * System Design Practice Studio - Data Models & Reference Catalog
 * Comprehensive components across 6 categories, 11 interview question prompts,
 * 12-item self-assessment rubric, and multi-phase interview timer configuration.
 */

export const INTERVIEW_PHASES = [
  { id: 'requirements', name: 'Requirements & Scoping', durationMinutes: 5, color: '#0284C7', desc: 'Clarify functional & non-functional requirements, out-of-scope boundaries, and SLA targets.' },
  { id: 'api_data', name: 'API & Data Model', durationMinutes: 5, color: '#6366F1', desc: 'Define core REST/gRPC endpoints, payload schemas, and primary database schema with indexes.' },
  { id: 'hld', name: 'High-Level Design', durationMinutes: 10, color: '#059669', desc: 'Draft end-to-end request flow: client -> CDN/LB -> gateway -> services -> cache/DB.' },
  { id: 'deep_dive', name: 'Deep Dive & Scaling', durationMinutes: 15, color: '#D97706', desc: 'Tackle core bottlenecks: sharding keys, cache invalidation, consensus, partitioning, and replication.' },
  { id: 'tradeoffs', name: 'Trade-offs & Failure Handling', durationMinutes: 7, color: '#DC2626', desc: 'Analyze CAP theorem trade-offs, circuit breakers, fallback modes, rate limiting, and catastrophic recovery.' },
  { id: 'summary', name: 'Final Summary & Wrap-Up', durationMinutes: 3, color: '#8B5CF6', desc: 'Recap architecture, verify non-functional SLA compliance, cost efficiency, and interviewer Q&A.' }
];

export const TOTAL_INTERVIEW_MINUTES = INTERVIEW_PHASES.reduce((acc, p) => acc + p.durationMinutes, 0); // Exactly 45 mins

export const INTERVIEW_RUBRIC = [
  { id: 'r1', category: 'Scoping', title: 'Requirement Clarification', desc: 'Asked clarifying questions, defined active users, read:write ratio, and identified out-of-scope features.' },
  { id: 'r2', category: 'Scoping', title: 'Functional & Non-Functional Requirements', desc: 'Explicitly separated user-facing features from availability (99.99%), latency (p99 < 50ms), and durability goals.' },
  { id: 'r3', category: 'Estimation', title: 'Capacity Estimates & Napkin Math', desc: 'Calculated peak QPS, ingress/egress bandwidth, daily storage retention, and memory hot-set sizing.' },
  { id: 'r4', category: 'Contracts', title: 'APIs and Data Models', desc: 'Drafted clean idempotency keys, request/response contracts, and schema normalization/denormalization.' },
  { id: 'r5', category: 'Architecture', title: 'High-Level Architecture', desc: 'Created clean separation of concerns with CDN, API Gateway, stateless service tier, and data tier.' },
  { id: 'r6', category: 'Flow', title: 'Data Flow & Sequence Logic', desc: 'Traced synchronous critical paths vs asynchronous event-driven worker flows without circular dependencies.' },
  { id: 'r7', category: 'Storage', title: 'Database & Cache Choices', desc: 'Justified SQL vs NoSQL vs In-Memory choices based on ACID, write throughput, and access patterns.' },
  { id: 'r8', category: 'Scale', title: 'Scalability & Bottleneck Analysis', desc: 'Identified single points of failure (SPOF), partition/shard keys, and hotspot mitigation strategies.' },
  { id: 'r9', category: 'Consistency', title: 'Consistency & Concurrency', desc: 'Addressed race conditions, distributed locking, optimistic concurrency control, and transactional boundaries.' },
  { id: 'r10', category: 'Resilience', title: 'Reliability & Failure Recovery', desc: 'Specified health checks, retries with exponential backoff & jitter, DLQs, and cross-AZ failover.' },
  { id: 'r11', category: 'Operations', title: 'Security & Observability', desc: 'Included TLS termination, token verification, distributed tracing (Trace ID), metrics, and alerts.' },
  { id: 'r12', category: 'Synthesis', title: 'Trade-offs & Cost Awareness', desc: 'Weighed latency vs consistency, cloud egress costs, in-memory footprint, and maintenance complexity.' }
];

export const COMPONENT_CATEGORIES = [
  {
    id: 'shapes',
    name: 'Architecture Shapes & Primitives',
    icon: 'shapes',
    components: [
      { id: 'shape-cylinder', name: 'Database Cylinder', icon: '🗄️', shape: 'cylinder', color: '#0284C7', sub: '3D DB Cylinder', w: 140, h: 92 },
      { id: 'shape-hexagon', name: 'Hexagon Service', icon: '🔷', shape: 'hexagon', color: '#7C3AED', sub: 'Hexagonal Node', w: 140, h: 90 },
      { id: 'shape-circle', name: 'Circle / Node', icon: '⭕', shape: 'circle', color: '#059669', sub: 'Round Node / Gateway', w: 96, h: 96 },
      { id: 'shape-card', name: 'Service Box (Card)', icon: '▭', shape: 'card', color: '#2563EB', sub: 'Standard Service Box', w: 154, h: 76 },
      { id: 'shape-cloud', name: 'Cloud / Network', icon: '☁️', shape: 'cloud', color: '#0284C7', sub: 'Public Cloud / VPC', w: 160, h: 96 },
      { id: 'shape-queue', name: 'Queue Buffer (Pipe)', icon: '📨', shape: 'queue', color: '#E11D48', sub: 'FIFO Buffer Pipe', w: 160, h: 68 },
      { id: 'shape-dashed-box', name: 'Dashed Subnet', icon: '🔲', shape: 'dashed-box', color: '#64748B', sub: 'VPC Subnet Box', w: 200, h: 120, isBoundary: true },
      { id: 'shape-solid-box', name: 'Solid Container', icon: '📦', shape: 'solid-box', color: '#475569', sub: 'Zone / Boundary', w: 200, h: 120, isBoundary: true }
    ]
  },
  {
    id: 'clients',
    name: 'Clients',
    icon: 'devices',
    components: [
      { id: 'web-client', name: 'Web Client', icon: '💻', shape: 'card', color: '#0284C7', sub: 'React / Next.js SPA', w: 154, h: 76 },
      { id: 'mobile-app', name: 'Mobile App', icon: '📱', shape: 'card', color: '#0284C7', sub: 'iOS / Android Native', w: 154, h: 76 },
      { id: 'external-client', name: 'External Client', icon: '🌐', shape: 'card', color: '#0369A1', sub: '3rd-Party B2B API / SDK', w: 154, h: 76 }
    ]
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: 'alt_route',
    components: [
      { id: 'dns', name: 'DNS Server', icon: '📍', shape: 'circle', color: '#D97706', sub: 'GeoDNS / Route 53', w: 96, h: 96 },
      { id: 'cdn', name: 'CDN / Edge', icon: '⚡', shape: 'card', color: '#D97706', sub: 'Cloudflare / CloudFront', w: 154, h: 76 },
      { id: 'load-balancer', name: 'Load Balancer', icon: '⚖️', shape: 'circle', color: '#4F46E5', sub: 'L4/L7 Nginx / AWS ALB', w: 104, h: 104 },
      { id: 'api-gateway', name: 'API Gateway', icon: '🛡️', shape: 'hexagon', color: '#7C3AED', sub: 'Auth, Rate Limit & Envoy', w: 140, h: 90 },
      { id: 'reverse-proxy', name: 'Reverse Proxy', icon: '🔄', shape: 'card', color: '#6366F1', sub: 'TLS / Compression / HAProxy', w: 154, h: 76 },
      { id: 'firewall', name: 'WAF / Firewall', icon: '🧱', shape: 'card', color: '#DC2626', sub: 'DDoS & OWASP Protection', w: 154, h: 76 }
    ]
  },
  {
    id: 'app_services',
    name: 'Application Services',
    icon: 'dns',
    components: [
      { id: 'microservice', name: 'Microservice', icon: '⚙️', shape: 'card', color: '#2563EB', sub: 'Stateless Go / Node / Java', w: 154, h: 76 },
      { id: 'monolith', name: 'Monolith Core', icon: '🏛️', shape: 'card', color: '#1D4ED8', sub: 'Modular Service Fleet', w: 154, h: 76 },
      { id: 'worker', name: 'Async Worker', icon: '🔨', shape: 'hexagon', color: '#0891B2', sub: 'Background Task Consumer', w: 140, h: 90 },
      { id: 'auth-service', name: 'Auth Service', icon: '🔑', shape: 'card', color: '#7C3AED', sub: 'OAuth2 / JWT / SSO', w: 154, h: 76 },
      { id: 'notification-service', name: 'Notification Service', icon: '🔔', shape: 'card', color: '#EC4899', sub: 'Push, SMS & Email Hub', w: 154, h: 76 }
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: 'database',
    components: [
      { id: 'sqldb', name: 'SQL Database', icon: '🗄️', shape: 'cylinder', color: '#0284C7', sub: 'PostgreSQL / MySQL ACID', w: 140, h: 92 },
      { id: 'nosqldb', name: 'NoSQL Database', icon: '📦', shape: 'cylinder', color: '#0D9488', sub: 'DynamoDB / Cassandra', w: 140, h: 92 },
      { id: 'redis-cache', name: 'Redis Cache', icon: '⚡', shape: 'cylinder', color: '#059669', sub: 'In-Memory Sub-ms Cluster', w: 140, h: 92 },
      { id: 'object-storage', name: 'Object Storage', icon: '☁️', shape: 'cloud', color: '#EA580C', sub: 'S3 / GCS Parquet Blob', w: 160, h: 96 },
      { id: 'search-index', name: 'Search Index', icon: '🔍', shape: 'card', color: '#CA8A04', sub: 'Elasticsearch / OpenSearch', w: 154, h: 76 },
      { id: 'data-warehouse', name: 'Data Warehouse', icon: '📊', shape: 'cylinder', color: '#9333EA', sub: 'Snowflake / BigQuery OLAP', w: 140, h: 92 }
    ]
  },
  {
    id: 'messaging',
    name: 'Messaging & Streaming',
    icon: 'reorder',
    components: [
      { id: 'message-queue', name: 'Message Queue', icon: '📬', shape: 'queue', color: '#E11D48', sub: 'RabbitMQ / AWS SQS', w: 160, h: 68 },
      { id: 'kafka-stream', name: 'Kafka / Event Stream', icon: '📨', shape: 'queue', color: '#DC2626', sub: 'Partitioned Append Log', w: 160, h: 68 },
      { id: 'dlq', name: 'Dead-Letter Queue', icon: '💀', shape: 'queue', color: '#991B1B', sub: 'Failed Poison Message DLQ', w: 160, h: 68 },
      { id: 'stream-processor', name: 'Stream Processor', icon: '🌊', shape: 'hexagon', color: '#2563EB', sub: 'Apache Flink / Spark', w: 140, h: 90 },
      { id: 'batch-processor', name: 'Batch Processor', icon: '⏱️', shape: 'card', color: '#475569', sub: 'Airflow / Nightly Spark Job', w: 154, h: 76 }
    ]
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    icon: 'hub',
    components: [
      { id: 'k8s-cluster', name: 'Kubernetes Cluster', icon: '☸️', shape: 'hexagon', color: '#326CE5', sub: 'Pod AutoScaler (HPA)', w: 140, h: 90 },
      { id: 'container', name: 'Docker Container', icon: '🐳', shape: 'card', color: '#0284C7', sub: 'Containerized Microservice', w: 154, h: 76 },
      { id: 'serverless-func', name: 'Serverless Function', icon: '⚡', shape: 'hexagon', color: '#F59E0B', sub: 'AWS Lambda / Cloud Functions', w: 140, h: 90 },
      { id: 'external-api', name: 'External API', icon: '🔌', shape: 'card', color: '#64748B', sub: 'Stripe, Twilio, Google Maps', w: 154, h: 76 },
      { id: 'cloud-region', name: 'Cloud Region', icon: '🗺️', shape: 'dashed-box', color: '#475569', sub: 'Multi-Region VPC / us-east-1', w: 200, h: 120, isBoundary: true },
      { id: 'avail-zone', name: 'Availability Zone', icon: '🏢', shape: 'solid-box', color: '#94A3B8', sub: 'Isolated AZ Failover Domain', w: 180, h: 100, isBoundary: true }
    ]
  }
];

export const SYSTEM_DESIGN_QUESTIONS = [
  {
    id: 'q-url-shortener',
    title: 'URL Shortener (TinyURL)',
    category: 'Read-Heavy Storage',
    scope: '100M new URLs/month, 10:1 read-to-write ratio, p99 redirect latency < 10ms, 7-character Base62 keys.',
    prompts: [
      'Design key generation: Offline Key Generation Service (KGS) vs on-the-fly hashing with collision checks.',
      'Explain HTTP 301 (Permanent Redirect) vs HTTP 302/307 (Temporary Redirect with analytics tracking).',
      'Determine database partition key: hash(short_url) vs range-based sharding.',
      'Plan multi-tier caching (Redis cluster with 80/20 power law) and cache eviction policies (LRU).'
    ],
    starterHint: 'Focus on: Client -> CDN -> API Gateway -> Shortener Service -> Redis Cache & Sharded DB + Key Gen Service.'
  },
  {
    id: 'q-rate-limiter',
    title: 'Distributed Rate Limiter',
    category: 'High-Throughput Middleware',
    scope: 'Evaluate 500k requests/sec across globally distributed API gateways with sub-millisecond evaluation overhead.',
    prompts: [
      'Compare algorithms: Token Bucket vs Leaky Bucket vs Sliding Window Log vs Sliding Window Counter.',
      'Centralized (Redis Lua atomic scripts) vs local in-memory synchronization (e.g. gossip protocol).',
      'Choose client identifier strategy: IP address vs User ID vs OAuth API Key (handling NAT proxies).',
      'Specify degraded mode policy: Fail-open vs Fail-closed when rate-limiter cluster experiences downtime.'
    ],
    starterHint: 'Focus on: Client -> API Gateway with Rate Limiter Filter -> Redis Cluster (Lua script atomic check).'
  },
  {
    id: 'q-notification',
    title: 'Notification System',
    category: 'Asynchronous Event Pipeline',
    scope: 'Deliver billions of push notifications, SMS alerts, and emails daily with priority queues and deduplication.',
    prompts: [
      'Architect multi-channel provider abstraction (APNs for iOS, FCM for Android, Twilio for SMS, SendGrid for Email).',
      'Design priority queues for urgent OTP transactional alerts vs marketing newsletters.',
      'Implement user notification settings & opt-out rules with low-latency in-memory cache checks.',
      'Dead-Letter Queue (DLQ) strategy, retry backoff with jitter, and rate limiting against 3rd-party providers.'
    ],
    starterHint: 'Focus on: Service Publishers -> Notification Gateway -> Priority Queues (Kafka) -> Channel Workers -> 3rd-party APIs.'
  },
  {
    id: 'q-instagram',
    title: 'Instagram / Photo Feed',
    category: 'Social Media & Media Streaming',
    scope: '500M Daily Active Users (DAU), 1M photos uploaded daily, high fan-out feed generation for celebrity accounts.',
    prompts: [
      'Hybrid feed generation: Fan-out on write (push model for normal users) vs Fan-out on read (pull model for celebrities).',
      'Media upload pipeline: Presigned S3 URLs, asynchronous image transcoding, and CDN cache warming.',
      'Storage tiering: Metadata in sharded PostgreSQL / Cassandra, media files in Object Storage (S3).',
      'Pagination strategy: Cursor-based pagination (using created_at + photo_id) vs offset pagination.'
    ],
    starterHint: 'Focus on: Mobile App -> CDN/Gateway -> Upload Service & Feed Service -> Redis Feed Cache + S3 + Sharded DB.'
  },
  {
    id: 'q-whatsapp',
    title: 'WhatsApp / Real-Time Messenger',
    category: 'Persistent Connections & Messaging',
    scope: '2 Billion users, 100 Billion messages/day, end-to-end encryption, sub-second 1:1 and group chat delivery.',
    prompts: [
      'Connection management: Long-lived WebSocket / TCP gateways with persistent gateway connection mapping.',
      'Message delivery state machine: Sent (single check), Delivered to device (double check), Read (blue checks).',
      'Offline message storage: Transient message queue / Cassandra queue, deleted once client acknowledges receipt.',
      'Group messaging: Fan-out optimization on gateway servers vs server-side group message routing.'
    ],
    starterHint: 'Focus on: Clients -> WebSocket Gateways -> Session Registry (Redis) -> Message Router -> Chat Store & Push Notification fallback.'
  },
  {
    id: 'q-youtube',
    title: 'YouTube / Video Streaming Platform',
    category: 'Video Processing & Global Distribution',
    scope: '2 Billion MAU, 500 hours of video uploaded every minute, adaptive bitrate video playback (HLS / DASH).',
    prompts: [
      'Video ingestion & transcoding pipeline: Chunking raw video, parallel GPU transcoding workers (1080p, 720p, 480p).',
      'Adaptive bitrate streaming (HLS/DASH manifest files) and CDN edge segment caching.',
      'Metadata & search queries: Elasticsearch inverted index for video search, sharded DB for metadata.',
      'View count aggregation: Buffered streaming aggregation (Kafka + Flink) to avoid write lock contention.'
    ],
    starterHint: 'Focus on: Creator App -> Video Upload Gateway -> S3 Ingestion -> Transcoding Fleet -> S3 Segments -> CDN -> Viewers.'
  },
  {
    id: 'q-uber',
    title: 'Uber / Ride-Sharing Dispatch',
    category: 'Geospatial & Low-Latency Dispatch',
    scope: '100M active riders, 5M active drivers emitting GPS pings every 4 seconds, sub-second driver matching.',
    prompts: [
      'Geospatial indexing: Google S2 geometry vs Uber H3 hexagonal hierarchical spatial index.',
      'Real-time location ingestion: Handling millions of GPS pings/sec in in-memory geospatial cache (Redis GEO / custom memory grid).',
      'Ride matching state machine: Rider requests ride -> Dispatcher queries nearby available drivers -> Lock driver -> Accept/Reject.',
      'ETA calculation service: Routing graph partitioning and traffic service updates.'
    ],
    starterHint: 'Focus on: Driver/Rider Apps -> WebSocket Gateway -> Location Ingestion Service -> Geospatial Cache (H3) -> Dispatch Engine.'
  },
  {
    id: 'q-ecommerce',
    title: 'E-commerce / Flash Sale Checkout',
    category: 'Transactional Concurrency & Inventory',
    scope: '100k items sold in 10 seconds, zero overselling, high-volume payment processing, cart expiration timers.',
    prompts: [
      'Inventory deduction strategy: Redis atomic decrement with Lua script vs Database row-level locks vs Optimistic locking.',
      'Prevent overselling: Reservation tokens with 10-minute TTL released via Delayed Queue / Redis key expiry event.',
      'Traffic surge dampening: Virtual waiting room / queuing gateway (Token bucket) to throttle checkouts to DB capacity.',
      'Asynchronous order fulfillment: Order created event published to Kafka for warehouse & notification processing.'
    ],
    starterHint: 'Focus on: Client -> Queueing Gatekeeper -> Flash Sale Order Service -> Redis Inventory Decr -> Payment Gateway -> DB.'
  },
  {
    id: 'q-ticket-booking',
    title: 'Ticket Booking (Ticketmaster)',
    category: 'Distributed Concurrency & Seat Locking',
    scope: 'Stadium seat reservations (50k seats), concurrent seat selection, temporary seat hold with automatic release.',
    prompts: [
      'Seat reservation lock: Distributed lock with Redis Redlock vs Database version field with SELECT FOR UPDATE.',
      'Temporary hold management: 10-minute countdown timer with distributed timer/scheduler (Redis TTL or Kafka delayed).',
      'Read vs Write segregation (CQRS): Cached venue seating maps served via CDN/Redis while locks hit transaction store.',
      'Payment completion webhook: Transition seat status from HELD -> CONFIRMED inside a single ACID transaction.'
    ],
    starterHint: 'Focus on: Users -> CDN (Seating Map) -> Booking Service -> Redis Distributed Lock (Hold 10m) -> Payment -> Postgres ACID.'
  },
  {
    id: 'q-payment',
    title: 'Payment System (Idempotent Ledger)',
    category: 'Financial Accuracy & Idempotency',
    scope: 'Zero duplicate transactions, double-entry bookkeeping ledger, payment provider webhooks, strict auditability.',
    prompts: [
      'Strict idempotency key protocol: Unique idempotency key in HTTP header, atomic insertion into database.',
      'Double-entry bookkeeping principle: Every transaction must balance (Sum of Debits == Sum of Credits).',
      'Payment state machine: CREATED -> AUTHORIZING -> AUTHORIZED -> CAPTURED -> SETTLED.',
      'Asynchronous webhook reconciliation: Handling out-of-order PSP notifications and nightly ledger settlement audits.'
    ],
    starterHint: 'Focus on: Checkout API -> Payment Gateway (Idempotency Guard) -> Payment Service -> PSP (Stripe) -> Double-Entry Ledger DB.'
  },
  {
    id: 'q-ad-tracking',
    title: 'Ad Impression Tracking System',
    category: 'High-Throughput Analytics & Deduplication',
    scope: '100k - 500k events/sec ingestion, 24-hour sliding deduplication window, event-time aggregation, batch reconciliation.',
    prompts: [
      'Fast ingestion: Ultra-lightweight beacon endpoint returning HTTP 202 immediately upon durable Kafka append.',
      'Sliding-window deduplication: Partitioned RocksDB / Redis bloom filter + hash set to filter duplicate impressions.',
      'Event-time tumbling windows: Handling delayed pings using stream processor watermarks (Flink / Spark Streaming).',
      'Raw event archival in S3 Parquet and nightly batch reconciliation job to verify real-time aggregates.'
    ],
    starterHint: 'Focus on: Ad SDKs -> Ingestion Fleet -> Kafka Topics -> Flink Deduplication & Aggregation -> ClickHouse OLAP + S3 Archive.'
  }
];

export const STARTER_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    mode: 'architecture',
    desc: 'Clean dot-grid canvas for drawing custom architectures from scratch'
  },
  {
    id: '3tier',
    name: '3-Tier Web Architecture',
    mode: 'architecture',
    desc: 'Client -> CDN -> Load Balancer -> API Gateway -> Stateless App Servers -> Redis Cache + Primary/Replica DB'
  },
  {
    id: 'streaming',
    name: 'Real-Time Event Streaming Pipeline',
    mode: 'architecture',
    desc: 'Beacon Ingestion -> Kafka Topics -> Stream Processors (RocksDB Dedup) -> ClickHouse OLAP + S3 Parquet Cold Archive'
  },
  {
    id: 'microservices',
    name: 'Microservices & Event-Driven Workers',
    mode: 'architecture',
    desc: 'API Gateway -> Auth / Order / Payment Services -> Message Queue -> Idempotent Background Consumers'
  },
  {
    id: 'sequence-starter',
    name: 'Sequence: User Authentication & Token Refresh',
    mode: 'sequence',
    desc: 'Lifelines: Client -> API Gateway -> Auth Service -> Redis Session Cache -> User DB with sync & async message flows'
  },
  {
    id: 'datamodel-starter',
    name: 'Data Model: URL Shortener & Analytics',
    mode: 'datamodel',
    desc: 'Entity relationship diagram with users, short_urls, clicks_analytics, and api_keys tables with foreign keys'
  }
];
