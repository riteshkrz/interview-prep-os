/**
 * 45-Day Interview Prep OS - 30-Day System Design Roadmap Workspace
 * An opinionated, day-by-day 30-day curriculum guiding senior engineers
 * from core distributed building blocks to Staff-level whiteboard execution.
 */

import { state, toggleSysDesignRoadmapDay } from './state.js';

export const SYSTEM_DESIGN_30_DAY_ROADMAP = [
  // =========================================================================
  // WEEK 1: SCALABILITY FUNDAMENTALS & BUILDING BLOCKS (Days 1 to 7)
  // =========================================================================
  {
    day: 1,
    week: 1,
    weekTitle: "Scalability Fundamentals & Protocols",
    topic: "Networking & Transport: TCP, UDP, HTTP/3, WebSockets & gRPC",
    domain: "Networking & Protocols",
    difficulty: "Foundations",
    estTime: "60 mins",
    objective: "Master connection lifecycles, latency characteristics, and transmission overhead across transport and application layer protocols.",
    keyTradeoffs: [
      "TCP (head-of-line blocking, 3-way handshake) vs UDP (loss-tolerant, ultra-low latency audio/video streaming)",
      "HTTP/2 (multiplexing single TCP connection) vs HTTP/3 QUIC (UDP-based stream multiplexing without HOL blocking)",
      "WebSockets (full-duplex persistent bidirectional socket) vs SSE (lightweight unidirectional server push) vs Long-Polling"
    ],
    readingLinks: [
      { title: "Cloudflare: What is HTTP/3 and QUIC?", url: "https://blog.cloudflare.com/http-3-vs-http-2/" },
      { title: "gRPC vs REST: Performance Benchmarks", url: "https://grpc.io/docs/what-is-grpc/introduction/" }
    ]
  },
  {
    day: 2,
    week: 1,
    weekTitle: "Scalability Fundamentals & Protocols",
    topic: "Load Balancing, Reverse Proxies & Consistent Hashing",
    domain: "Traffic Routing & Ingress",
    difficulty: "Foundations",
    estTime: "75 mins",
    objective: "Distribute ingress traffic across homogeneous clusters while preventing thundering herd problems and hot-spotting.",
    keyTradeoffs: [
      "Layer 4 (Transport, IP/Port, packet inspection only, high throughput) vs Layer 7 (Application, TLS termination, path routing, header inspection)",
      "Consistent Hashing with Virtual Nodes (mitigates re-hashing $K/N$ keys on cluster resize) vs Naive Modulo Hashing",
      "Active-Active vs Active-Passive failover configurations using DNS Anycast and BGP routing"
    ],
    readingLinks: [
      { title: "Envoy Proxy Architecture Guide", url: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/arch_overview" },
      { title: "Consistent Hashing with Virtual Nodes Deep Dive", url: "https://tom-e-white.com/2007/11/consistent-hashing.html" }
    ]
  },
  {
    day: 3,
    week: 1,
    weekTitle: "Scalability Fundamentals & Protocols",
    topic: "Caching Strategies, Invalidation & Distributed Eviction",
    domain: "Caching & In-Memory Storage",
    difficulty: "Medium",
    estTime: "75 mins",
    specId: "sd-3",
    objective: "Shield databases from read saturation using layered cache architectures and predictable invalidation semantics.",
    keyTradeoffs: [
      "Cache-Aside (application orchestrates DB fallback, stale window) vs Read/Write-Through vs Write-Back (async DB persistence, data loss risk)",
      "Eviction Algorithms: LRU (recency) vs LFU (frequency) vs 2Q/SLRU (scan-resistant caching)",
      "Cache Stampede / Dog-piling mitigation: Mutex locks, Probabilistic early expiration (XFetch), and stale-while-revalidate"
    ],
    readingLinks: [
      { title: "Facebook Paper: Scaling Memcache", url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf" },
      { title: "Redis Cluster Specification & Hash Slots", url: "https://redis.io/topics/cluster-spec" }
    ]
  },
  {
    day: 4,
    week: 1,
    weekTitle: "Scalability Fundamentals & Protocols",
    topic: "Database Paradigms & Storage Engines: B-Trees vs LSM-Trees",
    domain: "Database Internals",
    difficulty: "Medium",
    estTime: "90 mins",
    objective: "Understand how storage engines interact with OS page caches, NVMe disks, and I/O access patterns.",
    keyTradeoffs: [
      "B-Tree (read-optimized, in-place overwrites, random I/O write amplification - PostgreSQL, MySQL InnoDB) vs LSM-Tree (write-optimized, append-only commit log + SSTables - RocksDB, Cassandra)",
      "Relational (strict schema, ACID, normalized joins) vs NoSQL Document (JSON flexible schema, denormalized) vs Wide-Column (sparse tabular)",
      "Bloom Filters & Compaction strategies (Size-Tiered vs Leveled Compaction in write-heavy workloads)"
    ],
    readingLinks: [
      { title: "Martin Kleppmann: B-Trees vs LSM-Trees in DDIA", url: "https://dataintensive.net/" },
      { title: "RocksDB Architecture Guide", url: "https://github.com/facebook/rocksdb/wiki/RocksDB-Basics" }
    ]
  },
  {
    day: 5,
    week: 1,
    weekTitle: "Scalability Fundamentals & Protocols",
    topic: "Database Scaling: Replication, Partitioning & Sharding",
    domain: "Data Partitioning",
    difficulty: "Medium",
    estTime: "80 mins",
    objective: "Horizontally partition datasets across database nodes while maintaining query routing and re-balancing safety.",
    keyTradeoffs: [
      "Single-Leader (asynchronous read-replicas, replication lag) vs Multi-Leader (conflict resolution) vs Leaderless (Dynamo quorum)",
      "Range-Based Partitioning (range queries efficient, risk of write hot-spots on timestamps) vs Hash-Based Partitioning (uniform distribution, scatter-gather queries)",
      "Cross-Shard Transactions & Distributed Joins (two-phase commit penalty vs denormalization)"
    ],
    readingLinks: [
      { title: "Figma: How We Partitioned Our PostgreSQL Database", url: "https://www.figma.com/blog/how-figma-scaled-to-multiple-databases/" },
      { title: "Vitess: Horizontal Scaling for MySQL", url: "https://vitess.io/docs/overview/what-is-vitess/" }
    ]
  },
  {
    day: 6,
    week: 1,
    weekTitle: "Scalability Fundamentals & Protocols",
    topic: "Distributed Transactions, ACID, BASE & the CAP Theorem",
    domain: "Distributed Transactions",
    difficulty: "Hard",
    estTime: "80 mins",
    objective: "Evaluate consistency vs availability trade-offs and implement resilient eventual-consistency compensation models.",
    keyTradeoffs: [
      "CAP Theorem & PACELC: Under partition (P), choose Availability (A) vs Consistency (C); Else (E), choose Latency (L) vs Consistency (C)",
      "Two-Phase Commit / 2PC (blocking coordinator, single point of failure, latency overhead) vs 3PC",
      "Sagas (Event-driven asynchronous compensation) vs Orchestration Engine (Temporal / AWS Step Functions) for distributed workflows"
    ],
    readingLinks: [
      { title: "Daniel Abadi: Problems with CAP, and Yahoo PACELC", url: "http://dbmsmusings.blogspot.com/2010/04/problems-with-cap-and_26.html" },
      { title: "Sagas Pattern in Microservices Architecture", url: "https://microservices.io/patterns/data/saga.html" }
    ]
  },
  {
    day: 7,
    week: 1,
    weekTitle: "Scalability Fundamentals & Protocols",
    topic: "Milestone 1: Back-of-the-Envelope Math & Latency Numbers",
    domain: "Capacity Planning",
    difficulty: "Foundations",
    estTime: "60 mins",
    objective: "Perform real-time QPS, bandwidth, storage, and memory sizing calculations in under 5 minutes without hesitation.",
    keyTradeoffs: [
      "Numbers Every Engineer Should Know: L1 Cache (0.5 ns), RAM (100 ns), NVMe SSD Random Read (100 µs), Datacenter Roundtrip (500 µs), CA to Netherlands (150 ms)",
      "Read vs Write Ratio sizing: 100M daily active users $\\times$ 10 writes/day $\\approx 1150$ QPS (Peak $2300$ QPS with $2\\times$ traffic multiplier)",
      "Storage sizing with replication factor $3\\times$ and 5-year retention lifecycle calculations"
    ],
    readingLinks: [
      { title: "Latency Numbers Every Programmer Should Know (Interactive)", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html" }
    ]
  },

  // =========================================================================
  // WEEK 2: HIGH-FREQUENCY SYSTEM PATTERNS (Days 8 to 14)
  // =========================================================================
  {
    day: 8,
    week: 2,
    weekTitle: "High-Frequency System Patterns",
    topic: "Design a URL Shortener (TinyURL / Bitly)",
    domain: "Core System Patterns",
    difficulty: "Medium",
    estTime: "75 mins",
    specId: "sd-1",
    objective: "Architect a high-read redirection service generating unique 7-character Base62 keys with sub-10ms latency.",
    keyTradeoffs: [
      "MD5/SHA256 hash truncation (collision risks, retry overhead) vs Key Generation Service / KGS (pre-allocated ranges, in-memory tokens)",
      "HTTP 301 Permanent Redirect (browser caches redirection, reduces server load, eliminates click analytics) vs HTTP 302 Temporary (full analytics tracking)",
      "Bloom Filters in front of Redis to filter out nonexistent keys and prevent cache-penetration attacks"
    ],
    readingLinks: [
      { title: "System Design Primer: URL Shortener", url: "https://github.com/donnemartin/system-design-primer#design-pastebin" }
    ]
  },
  {
    day: 9,
    week: 2,
    weekTitle: "High-Frequency System Patterns",
    topic: "Design an API Rate Limiter & Edge Gateway",
    domain: "Security & Edge Gateways",
    difficulty: "Medium",
    estTime: "80 mins",
    specId: "sd-2",
    objective: "Protect backend clusters from denial-of-service spikes and enforce per-user/per-IP quota policies across distributed nodes.",
    keyTradeoffs: [
      "Token Bucket (allows bursts up to capacity) vs Leaky Bucket (smooth constant egress rate) vs Sliding Window Counter (accurate memory-efficient)",
      "Distributed Synchronization: Atomic Redis `INCR` + `EXPIRE` via Lua scripts vs Token server",
      "Client Response Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` with HTTP 429 Too Many Requests"
    ],
    readingLinks: [
      { title: "Stripe: Scaling Your API with Rate Limiters", url: "https://stripe.com/blog/rate-limiters" }
    ]
  },
  {
    day: 10,
    week: 2,
    weekTitle: "High-Frequency System Patterns",
    topic: "Design a Scalable Multi-Channel Notification Service",
    domain: "Async Messaging & Push",
    difficulty: "Medium",
    estTime: "75 mins",
    specId: "sd-6",
    objective: "Deliver billions of push, email, and SMS notifications across third-party gateways with priority scheduling and user preferences.",
    keyTradeoffs: [
      "Priority Queues (Transactional OTPs vs Promotional blasts) with distinct worker pools",
      "Deduplication & Idempotency: Redis TTL keys on `(userId, eventId)` to prevent double-charging or duplicate alerts",
      "Circuit Breakers and exponential backoff with jitter on downstream third-party provider timeouts (APNs, FCM, Twilio)"
    ],
    readingLinks: [
      { title: "Netflix: Scaling Push Notifications Across 200M Devices", url: "https://netflixtechblog.com" }
    ]
  },
  {
    day: 11,
    week: 2,
    weekTitle: "High-Frequency System Patterns",
    topic: "Design a Pastebin & Ephemeral Encrypted Secret Store",
    domain: "Blob Storage & Security",
    difficulty: "Medium",
    estTime: "70 mins",
    objective: "Store multi-megabyte text and code snippets with client-side encryption and automated TTL expiration.",
    keyTradeoffs: [
      "Metadata (PostgreSQL / DynamoDB) separated from raw text payload (Object Storage S3 / MinIO)",
      "Pre-signed S3 URLs for direct client-to-storage upload, bypassing application server CPU and memory bottlenecks",
      "Automated Expiration: Active background cleanup daemons vs S3 Lifecycle Expiration Rules"
    ],
    readingLinks: [
      { title: "AWS S3: Working with Pre-Signed URLs", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html" }
    ]
  },
  {
    day: 12,
    week: 2,
    weekTitle: "High-Frequency System Patterns",
    topic: "Design a Distributed Web Crawler & Inverted Indexer",
    domain: "Search & Web Ingestion",
    difficulty: "Hard",
    estTime: "85 mins",
    objective: "Traverse billions of web pages respecting robot policies, eliminating duplicate cycles, and streaming inverted indexes.",
    keyTradeoffs: [
      "URL Frontier: Host politeness queues (delay between requests to same domain) combined with priority ranking queues",
      "Duplicate Content Detection: Fingerprinting with 64-bit SimHash / MurmurHash to detect near-duplicate HTML pages",
      "Distributed Inverted Index partitioning: Document-partitioned (local index, scatter-gather queries) vs Term-partitioned (high query throughput for single words)"
    ],
    readingLinks: [
      { title: "Google Paper: The Anatomy of a Large-Scale Hypertextual Web Search Engine", url: "http://infolab.stanford.edu/pub/papers/google.pdf" }
    ]
  },
  {
    day: 13,
    week: 2,
    weekTitle: "High-Frequency System Patterns",
    topic: "Design Search Autocomplete / Typeahead (Google Search Bar)",
    domain: "In-Memory Prefix Search",
    difficulty: "Hard",
    estTime: "80 mins",
    specId: "sd-5",
    objective: "Deliver top 5 trending autocomplete suggestions under 30ms latency for every keystroke entered by millions of concurrent users.",
    keyTradeoffs: [
      "In-Memory Trie with top-K caching at each prefix node vs Inverted Index lookup vs Redis Sorted Sets (`ZREVRANGEBYLEX`)",
      "Offline Batch Aggregation (MapReduce / Spark calculating 7-day query frequencies) vs Real-Time Streaming Updates",
      "Client-side keystroke debouncing (300ms) and browser LocalStorage caching of popular single-character prefixes"
    ],
    readingLinks: [
      { title: "System Design of Google Autocomplete", url: "https://blog.bytebytego.com" }
    ]
  },
  {
    day: 14,
    week: 2,
    weekTitle: "High-Frequency System Patterns",
    topic: "Milestone 2: Distributed Locking & Concurrency Primitives",
    domain: "Concurrency Primitives",
    difficulty: "Hard",
    estTime: "80 mins",
    objective: "Coordinate distributed state across unsynchronized nodes without deadlocks or split-brain inconsistencies.",
    keyTradeoffs: [
      "Redis Redlock (consensus across 5 independent Redis masters) vs Apache ZooKeeper (ephemeral sequential zNodes + leader watches)",
      "Fencing Tokens (monotonically increasing tokens to prevent stale lock holders from executing after GC pauses)",
      "Optimistic Concurrency Control (OCC with version column: `WHERE version = 5`) vs Pessimistic DB Row Locking (`SELECT FOR UPDATE` bottleneck)"
    ],
    readingLinks: [
      { title: "Martin Kleppmann: How to Do Distributed Locking (Redlock Analysis)", url: "https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html" },
      { title: "Redis: Distributed Locks with Redis (Redlock)", url: "https://redis.io/docs/manual/patterns/distributed-locks/" }
    ]
  },

  // =========================================================================
  // WEEK 3: DISTRIBUTED STORAGE, STREAMING & CONSENSUS (Days 15 to 21)
  // =========================================================================
  {
    day: 15,
    week: 3,
    weekTitle: "Distributed Storage, Streaming & Consensus",
    topic: "Design a Distributed Key-Value Store (DynamoDB / Cassandra)",
    domain: "Distributed Database Engines",
    difficulty: "Hard",
    estTime: "90 mins",
    specId: "sd-4",
    objective: "Architect a masterless planetary-scale key-value store with tunable consistency, high write availability, and gossip membership.",
    keyTradeoffs: [
      "Consistent Hashing Ring with Virtual Nodes (mitigates hotspots and re-partitioning overhead)",
      "Tunable Quorum Consensus ($R + W > N$ ensures strong consistency; $W=1, R=1$ ensures ultra-low latency)",
      "Vector Clocks (detect concurrent write conflicts) & Merkle Trees (anti-entropy background replica repair)"
    ],
    readingLinks: [
      { title: "Amazon Dynamo Paper: Highly Available Key-Value Store", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" }
    ]
  },
  {
    day: 16,
    week: 3,
    weekTitle: "Distributed Storage, Streaming & Consensus",
    topic: "Design a Distributed Message Broker & Event Stream (Apache Kafka)",
    domain: "Event Streaming & Logs",
    difficulty: "Hard",
    estTime: "90 mins",
    specId: "sd-7",
    objective: "Build high-throughput append-only distributed commit logs capable of millions of messages per second with zero-copy I/O.",
    keyTradeoffs: [
      "Log-Structured Append-Only Storage (sequential disk write throughput matches RAM speeds) vs Random B-Tree updates",
      "Zero-Copy Transfer (`sendfile` syscall reads directly from OS page cache to network socket, bypassing JVM/user memory)",
      "Consumer Groups & Partition Rebalancing (Cooperative Sticky Rebalance vs Eager Rebalance)"
    ],
    readingLinks: [
      { title: "Kafka Design Overview: Deep Dive into Log Architecture", url: "https://kafka.apache.org/documentation/#design" }
    ]
  },
  {
    day: 17,
    week: 3,
    weekTitle: "Distributed Storage, Streaming & Consensus",
    topic: "Design Distributed Object Storage (Amazon S3 / GCS)",
    domain: "Blob Storage Systems",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-8",
    objective: "Store exabytes of unstructured blob data with 99.999999999% (11 9's) durability using chunking and erasure coding.",
    keyTradeoffs: [
      "Replication ($3\\times$ storage overhead, 200% extra cost) vs Reed-Solomon Erasure Coding (e.g. 8+4 chunk configuration, 50% extra cost, higher CPU)",
      "Decoupled Metadata Service (Spanner / CockroachDB for directory hierarchy) vs Storage Chunk Servers",
      "Multipart Upload & Resumption Protocol for multi-gigabyte video files with independent chunk checksums"
    ],
    readingLinks: [
      { title: "Design Principles of AWS S3 and Erasure Coding", url: "https://www.allthingsdistributed.com/" }
    ]
  },
  {
    day: 18,
    week: 3,
    weekTitle: "Distributed Storage, Streaming & Consensus",
    topic: "Design a Planetary-Scale Distributed Cache (Redis Cluster)",
    domain: "Distributed Caching",
    difficulty: "Hard",
    estTime: "80 mins",
    specId: "sd-3",
    objective: "Cluster in-memory nodes across 16,384 hash slots with automatic leader failover and minimal replication latency.",
    keyTradeoffs: [
      "Client-Side Partition Routing (smart clients query cluster nodes directly via hash slot MOVED redirection) vs Proxy-Based (Twemproxy/Envoy)",
      "Gossip Protocol for failure detection (PING/PONG messages among nodes without centralized coordinator)",
      "Async Master-Replica Replication (risk of lost writes during sudden primary failure before failover)"
    ],
    readingLinks: [
      { title: "Redis Cluster Specification", url: "https://redis.io/topics/cluster-spec" }
    ]
  },
  {
    day: 19,
    week: 3,
    weekTitle: "Distributed Storage, Streaming & Consensus",
    topic: "Design Real-Time Messaging & Chat (WhatsApp / Slack / Discord)",
    domain: "Real-Time Collaboration",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-9",
    objective: "Maintain millions of concurrent stateful connections with instantaneous message delivery, online presence, and offline sync.",
    keyTradeoffs: [
      "Persistent WebSocket Gateways (stateful connection tracking) vs Ephemeral HTTP REST",
      "Presence Service: Periodic heartbeat pings to Redis sorted sets vs Pub/Sub channel broadcasts",
      "Message Delivery Lifecycle: Device $\\to$ Gateway $\\to$ Queue $\\to$ DB $\\to$ Recipient Gateway (Single tick, Double tick, Blue read receipt)"
    ],
    readingLinks: [
      { title: "Discord: How Discord Scaled to 15 Million Concurrent Users on Elixir & Rust", url: "https://discord.com/blog/why-discord-is-switching-from-go-to-rust" }
    ]
  },
  {
    day: 20,
    week: 3,
    weekTitle: "Distributed Storage, Streaming & Consensus",
    topic: "Design Real-Time Collaborative Document Editing (Google Docs / Figma)",
    domain: "Concurrency & Collaborative Engines",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-10",
    objective: "Synchronize simultaneous multi-user character edits over high-latency networks without conflicting overwrites.",
    keyTradeoffs: [
      "Operational Transformation / OT (centralized server orders operations and transforms character indexes) vs Conflict-Free Replicated Data Types / CRDTs (decentralized, peer-to-peer, mathematically convergent state)",
      "State Vectors & Undo Buffers in collaborative text canvases",
      "Chunked Snapshotting & Snapshot Persistence to S3 with delta log compaction"
    ],
    readingLinks: [
      { title: "Figma: How Figma's Multiplayer Technology Works", url: "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/" }
    ]
  },
  {
    day: 21,
    week: 3,
    weekTitle: "Distributed Storage, Streaming & Consensus",
    topic: "Milestone 3: Deep Dive into Distributed Consensus (Raft & Paxos)",
    domain: "Consensus Algorithms",
    difficulty: "Staff Level",
    estTime: "90 mins",
    objective: "Understand how leader election, log replication, and safety guarantees operate in modern systems like etcd, TiKV, and CockroachDB.",
    keyTradeoffs: [
      "Classic Paxos (complex, difficult to understand and implement) vs Raft (understandable state machine, strict leader-driven flow)",
      "Leader Election (Randomized election timeouts prevent split votes) and Log Matching Property",
      "Multi-Raft Architecture (partitioning the keyspace into thousands of independent Raft consensus groups for horizontal scalability)"
    ],
    readingLinks: [
      { title: "The Raft Consensus Paper: In Search of an Understandable Consensus Algorithm", url: "https://raft.github.io/raft.pdf" },
      { title: "Secret Lives of Data: Raft Visualization", url: "http://thesecretlivesofdata.com/raft/" }
    ]
  },

  // =========================================================================
  // WEEK 4: GEOSPATIAL, MEDIA & FINANCIAL SYSTEMS (Days 22 to 28)
  // =========================================================================
  {
    day: 22,
    week: 4,
    weekTitle: "Geospatial, Media & Financial Systems",
    topic: "Design Proximity Service / Nearby Locations (Yelp / Google Maps)",
    domain: "Geospatial Architecture",
    difficulty: "Medium",
    estTime: "75 mins",
    specId: "sd-11",
    objective: "Query places within a dynamic radius (e.g. 5km) from billions of geospatial coordinates with sub-15ms response times.",
    keyTradeoffs: [
      "Geohash (Base32 encoded 2D bounding boxes, prefix string matching) vs QuadTree (recursive quadrant subdivision in memory) vs Google S2 (Hilbert curve space-filling)",
      "Read-Heavy Caching: Static places (restaurants rarely move) cached by Geohash precision prefix (e.g. length 6 $\\approx$ 1.2km)",
      "Boundary condition edge case: Target location lying right on a quadrant border requires querying 8 neighboring grid cells"
    ],
    readingLinks: [
      { title: "Uber: H3 Hexagonal Hierarchical Spatial Index", url: "https://www.uber.com/blog/h3/" }
    ]
  },
  {
    day: 23,
    week: 4,
    weekTitle: "Geospatial, Media & Financial Systems",
    topic: "Design Ride-Sharing Real-Time Dispatch & Tracking (Uber / Lyft)",
    domain: "Real-Time Geospatial Streams",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-12",
    objective: "Ingest driver GPS coordinates every 4 seconds and match ride requests with nearby active drivers under dynamic surge pricing.",
    keyTradeoffs: [
      "Location Ingestion Pipeline: High-velocity driver GPS streams into Apache Kafka $\\to$ In-Memory Location Cache (Redis Geohash)",
      "Dispatch Matching Engine: Geospatial index search combined with ETA routing engines, batching requests in 10-second matching buckets",
      "Dynamic Surge Pricing Pipeline: Real-time supply vs demand ratio calculated using Apache Flink streaming across hexagonal H3 cells"
    ],
    readingLinks: [
      { title: "Uber Engineering: Designing the Real-time Dispatch Platform", url: "https://www.uber.com/blog/engineering/" }
    ]
  },
  {
    day: 24,
    week: 4,
    weekTitle: "Geospatial, Media & Financial Systems",
    topic: "Design Global Video Streaming & Transcoding (Netflix / YouTube)",
    domain: "Media Streaming & CDNs",
    difficulty: "Hard",
    estTime: "90 mins",
    specId: "sd-13",
    objective: "Ingest 4K raw video files, transcode into multi-bitrate streams, and distribute globally with instant playback and zero buffering.",
    keyTradeoffs: [
      "Adaptive Bitrate Streaming / ABR (HLS & MPEG-DASH: client dynamically switches between 360p, 720p, 1080p, 4K based on network bandwidth)",
      "Distributed Transcoding Pipeline: Split raw video into 10-second chunks $\\to$ parallel transcode across GPU worker clusters $\\to$ stitch manifests",
      "Multi-Tier CDN Edge Caching (Open Connect / Cloudflare) with proactive pre-warming for trending releases"
    ],
    readingLinks: [
      { title: "Netflix: High Quality Video Encoding at Scale", url: "https://netflixtechblog.com/high-quality-video-encoding-at-scale-d159f3136ce7" }
    ]
  },
  {
    day: 25,
    week: 4,
    weekTitle: "Geospatial, Media & Financial Systems",
    topic: "Design Social Network Feed & Timeline (Twitter / Instagram)",
    domain: "Social Graph & Feeds",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-14",
    objective: "Generate personalized timelines for hundreds of millions of users balancing celebrity write amplification against read latencies.",
    keyTradeoffs: [
      "Fan-out on Write (Push model: post is copied to all followers' timeline caches; fast reads O(1), catastrophic for celebrities with 80M followers)",
      "Fan-out on Read (Pull model: user queries fetch posts from all followed accounts at request time; slow reads, fast writes)",
      "Hybrid Fan-out Architecture: Push for standard users, Pull for verified celebrities ($> 20k$ followers), merged at read time in Redis"
    ],
    readingLinks: [
      { title: "Twitter Engineering: Timelines at Scale", url: "https://blog.x.com/engineering/en_us/topics/infrastructure/2013/timelines-at-scale" }
    ]
  },
  {
    day: 26,
    week: 4,
    weekTitle: "Geospatial, Media & Financial Systems",
    topic: "Design Distributed Payment Gateway & Ledger (Stripe / Square)",
    domain: "Fintech & Transaction Ledgers",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-15",
    objective: "Process multi-currency monetary transactions with exactly-once settlement, immutable double-entry ledgers, and zero financial drift.",
    keyTradeoffs: [
      "Double-Entry Bookkeeping (immutable debits and credits must sum to zero; no account balance is modified in-place)",
      "Idempotency Key Protocol (Client generates unique UUID; Server acquires distributed lock and stores response snapshot for 24h)",
      "Distributed Reconciliation Engine: Asynchronous cron matching internal ledger transactions against banking partner settlement files"
    ],
    readingLinks: [
      { title: "Stripe: Designing Robust and Idempotent APIs", url: "https://stripe.com/blog/idempotency" }
    ]
  },
  {
    day: 27,
    week: 4,
    weekTitle: "Geospatial, Media & Financial Systems",
    topic: "Design Ad Click Aggregator & Real-Time Analytics Pipeline",
    domain: "Streaming & OLAP Systems",
    difficulty: "Hard",
    estTime: "80 mins",
    specId: "sd-16",
    objective: "Count billions of ad impressions and click events in real time to bill advertisers and detect click fraud.",
    keyTradeoffs: [
      "Streaming Ingestion (Kafka) $\\to$ Stream Aggregation (Apache Flink / Spark Streaming with tumbling and sliding windows) $\\to$ OLAP Datastore (ClickHouse / Druid)",
      "Lambda Architecture (Batch layer + Speed layer) vs Kappa Architecture (single stream processing engine for both real-time and historical replay)",
      "Watermarking & Handling Out-of-Order / Delayed Events without double counting"
    ],
    readingLinks: [
      { title: "Uber: Building AthenaX - Streaming SQL Engine", url: "https://www.uber.com/blog/athenax/" }
    ]
  },
  {
    day: 28,
    week: 4,
    weekTitle: "Geospatial, Media & Financial Systems",
    topic: "Design Distributed Webhook Delivery Engine (Svix / Stripe Webhooks)",
    domain: "Reliable Event Dispatch",
    difficulty: "Medium",
    estTime: "75 mins",
    specId: "sd-17",
    objective: "Deliver guaranteed webhook notifications to third-party endpoints with automated retries, signature security, and tenant fairness.",
    keyTradeoffs: [
      "Fair-Share Multi-Tenant Queuing: Prevent one slow or misconfigured customer endpoint from blocking the global dispatch pool",
      "Exponential Backoff with Full Jitter: Retry schedule over 72 hours (e.g. 5s, 1m, 15m, 1h, 6h, 24h) before moving to Dead Letter Queue (DLQ)",
      "HMAC-SHA256 Payload Signature Verification in headers to guarantee authentic sender identity"
    ],
    readingLinks: [
      { title: "Svix: Building a Webhook Service at Scale", url: "https://www.svix.com/blog/" }
    ]
  },

  // =========================================================================
  // WEEK 5: STAFF-LEVEL SYNTHESIS & WHITEBOARD MASTERY (Days 29 to 30)
  // =========================================================================
  {
    day: 29,
    week: 5,
    weekTitle: "Staff-Level Synthesis & Whiteboard Mastery",
    topic: "The 45-Minute Senior/Staff Whiteboard Framework",
    domain: "Interview Execution Framework",
    difficulty: "Staff Level",
    estTime: "90 mins",
    objective: "Internalize the 4-phase structured delivery rubric that FAANG interviewers use to evaluate L5 and L6 candidates.",
    keyTradeoffs: [
      "Phase 1 (8 mins): Understand the Problem & Establish Scope (Functional requirements, non-functional requirements: DAU, latency, availability 99.99%)",
      "Phase 2 (7 mins): High-Level API & Back-of-Envelope Sizing (Data models, API contracts, QPS, storage)",
      "Phase 3 (15 mins): High-Level Architecture Diagram (Client $\\to$ DNS $\\to$ CDN $\\to$ Load Balancers $\\to$ API Gateways $\\to$ Microservices $\\to$ Cache/DB)",
      "Phase 4 (15 mins): Deep Dive Critical Bottlenecks (Single points of failure, partition hot-spots, data replication lag, network partitioning)"
    ],
    readingLinks: [
      { title: "System Design Interview Checklist for Senior Candidates", url: "https://github.com/donnemartin/system-design-primer" }
    ]
  },
  {
    day: 30,
    week: 5,
    weekTitle: "Staff-Level Synthesis & Whiteboard Mastery",
    topic: "Resilience, Chaos Engineering, Multi-Region & Disaster Recovery",
    domain: "Disaster Recovery & Chaos",
    difficulty: "Staff Level",
    estTime: "90 mins",
    objective: "Architect mission-critical applications that survive complete cloud region outages, database corruptions, and cascading network partitions.",
    keyTradeoffs: [
      "Multi-Region Deployment: Active-Active (planetary read/write with Conflict-Free replication) vs Active-Passive with warm standbys (RTO/RPO trade-offs)",
      "Cascading Failure Prevention: Circuit Breakers, Bulkheading, Shedding load (HTTP 503 Service Unavailable), and Client-Side Rate Limiting",
      "Observability & Chaos Engineering: Distributed Tracing (OpenTelemetry/Jaeger), Structured Logs, Metrics (Prometheus), Chaos Monkey"
    ],
    readingLinks: [
      { title: "Netflix: Chaos Engineering Principles", url: "https://principlesofchaos.org/" },
      { title: "Google SRE Book: Addressing Cascading Failures", url: "https://sre.google/sre-book/addressing-cascading-failures/" }
    ]
  }
];

export function renderSystemDesignRoadmapView(weekFilter = 'all', statusFilter = 'all', searchQuery = '') {
  const roadmapState = state.sysDesignRoadmap || {};

  // Calculate statistics
  let completedCount = 0;
  SYSTEM_DESIGN_30_DAY_ROADMAP.forEach(d => {
    if (roadmapState[d.day]?.completed) {
      completedCount++;
    }
  });

  const totalDays = SYSTEM_DESIGN_30_DAY_ROADMAP.length;
  const pct = Math.round((completedCount / totalDays) * 100);
  const estTotalHours = Math.round((completedCount * 1.3));

  // Filter roadmap days
  let filtered = [...SYSTEM_DESIGN_30_DAY_ROADMAP];

  if (weekFilter !== 'all') {
    const targetWeek = parseInt(weekFilter, 10);
    if (!isNaN(targetWeek)) {
      filtered = filtered.filter(d => d.week === targetWeek);
    }
  }

  if (statusFilter === 'completed') {
    filtered = filtered.filter(d => Boolean(roadmapState[d.day]?.completed));
  } else if (statusFilter === 'pending') {
    filtered = filtered.filter(d => !roadmapState[d.day]?.completed);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(d =>
      d.topic.toLowerCase().includes(q) ||
      d.domain.toLowerCase().includes(q) ||
      d.objective.toLowerCase().includes(q) ||
      d.keyTradeoffs.some(t => t.toLowerCase().includes(q))
    );
  }

  const weeksSummary = [1, 2, 3, 4, 5].map(w => {
    const weekDays = SYSTEM_DESIGN_30_DAY_ROADMAP.filter(d => d.week === w);
    const weekDone = weekDays.filter(d => roadmapState[d.day]?.completed).length;
    return {
      week: w,
      title: weekDays[0]?.weekTitle || `Week ${w}`,
      done: weekDone,
      total: weekDays.length
    };
  });

  return `
    <div class="flex flex-col gap-5 w-full animate-fadeIn" id="system-design-roadmap-view">
      
      <!-- Top Hero Banner -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-black/40 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col gap-2 z-10 max-w-2xl">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">alt_route</span>
            </div>
            <h1 class="font-sans text-[20px] font-bold text-white tracking-tight">30-Day System Design Roadmap</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-code bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
              30 Days • L5/L6 Focus
            </span>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed">
            An opinionated, day-by-day 30-day curriculum taking you from networking fundamentals and storage engines to high-frequency production blueprints, consensus math, and Staff-level whiteboard mastery.
          </p>

          <!-- Week-by-Week Micro Progress Indicator -->
          <div class="flex flex-wrap items-center gap-2 pt-2">
            ${weeksSummary.map(w => `
              <button
                class="roadmap-week-chip px-2 py-1 rounded text-[11px] font-code border transition-all cursor-pointer ${weekFilter === String(w.week) ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-white font-semibold' : 'bg-[#0F1626] border-[#24314A] text-slate-400 hover:text-white'}"
                data-filter-week="${w.week}"
                title="${w.title}"
              >
                W${w.week}: <span class="${w.done === w.total ? 'text-emerald-400' : 'text-cyan-300'}">${w.done}/${w.total}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Overall Score Ring & Metric Badges -->
        <div class="flex items-center gap-4 bg-[#0F1626] border border-[#24314A] p-4 rounded-xl z-10 shrink-0">
          <div class="flex flex-col items-center">
            <span class="text-[10px] font-code text-slate-400 uppercase tracking-wider">Roadmap Progress</span>
            <span class="text-[30px] font-bold font-code text-cyan-400 mt-0.5">${pct}%</span>
          </div>
          <div class="w-px h-10 bg-[#24314A]"></div>
          <div class="flex flex-col text-[11px] font-code">
            <span class="text-slate-300">Days: <strong class="text-white">${completedCount} / ${totalDays}</strong></span>
            <span class="text-slate-400 mt-0.5">Study Time: <strong class="text-emerald-400">~${estTotalHours}h logged</strong></span>
            <span class="text-indigo-400 font-semibold mt-0.5">Target: 30 Days</span>
          </div>
        </div>
      </div>

      <!-- Controls & Filter Bar -->
      <div class="bg-[#0F1626] border border-[#24314A] p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <!-- Search Input -->
        <div class="relative flex-1">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            id="sys-roadmap-search"
            type="text"
            placeholder="Search topic, protocol, storage engine (e.g. Kafka, Redis, Paxos)..."
            value="${escapeHtml(searchQuery)}"
            class="w-full pl-9 pr-3 py-1.5 bg-[#141C2E] border border-[#24314A] rounded-lg text-white text-[13px] placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <!-- Week Filter -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            class="sys-roadmap-filter-week px-2.5 py-1 rounded-md text-[12px] font-code cursor-pointer transition-colors ${weekFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
            data-week="all"
          >
            All 30 Days
          </button>
          <button
            class="sys-roadmap-filter-week px-2.5 py-1 rounded-md text-[12px] font-code cursor-pointer transition-colors ${weekFilter === '1' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
            data-week="1"
          >
            Week 1: Fundamentals
          </button>
          <button
            class="sys-roadmap-filter-week px-2.5 py-1 rounded-md text-[12px] font-code cursor-pointer transition-colors ${weekFilter === '2' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
            data-week="2"
          >
            Week 2: Patterns
          </button>
          <button
            class="sys-roadmap-filter-week px-2.5 py-1 rounded-md text-[12px] font-code cursor-pointer transition-colors ${weekFilter === '3' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
            data-week="3"
          >
            Week 3: Storage
          </button>
          <button
            class="sys-roadmap-filter-week px-2.5 py-1 rounded-md text-[12px] font-code cursor-pointer transition-colors ${weekFilter === '4' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
            data-week="4"
          >
            Week 4: Geospatial & Scale
          </button>
          <button
            class="sys-roadmap-filter-week px-2.5 py-1 rounded-md text-[12px] font-code cursor-pointer transition-colors ${weekFilter === '5' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
            data-week="5"
          >
            Week 5: Staff Mastery
          </button>
        </div>

        <!-- Status Filter -->
        <div class="flex items-center gap-1 shrink-0">
          <select
            id="sys-roadmap-status-select"
            class="bg-[#141C2E] border border-[#24314A] text-slate-300 text-[12px] font-code rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>Status: All</option>
            <option value="completed" ${statusFilter === 'completed' ? 'selected' : ''}>✓ Completed Only</option>
            <option value="pending" ${statusFilter === 'pending' ? 'selected' : ''}>○ Incomplete Only</option>
          </select>
        </div>
      </div>

      <!-- Roadmap Grid / Day Cards -->
      ${filtered.length === 0 ? `
        <div class="p-12 text-center bg-[#141C2E] border border-[#24314A] rounded-xl flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-slate-500 text-[36px]">filter_list_off</span>
          <h3 class="text-white text-[15px] font-semibold">No System Design days matched your filter.</h3>
          <p class="text-slate-400 text-[13px]">Try clearing your search query or selecting "All 30 Days".</p>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${filtered.map(item => renderRoadmapDayCard(item, roadmapState[item.day])).join('')}
        </div>
      `}

    </div>
  `;
}

function renderRoadmapDayCard(item, progress) {
  const isDone = Boolean(progress?.completed);

  const diffColors = {
    'Foundations': 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30',
    'Medium': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'Hard': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    'Staff Level': 'text-purple-400 bg-purple-500/15 border-purple-500/30'
  };

  const badgeColor = diffColors[item.difficulty] || 'text-slate-300 bg-slate-800 border-slate-700';

  return `
    <div class="bg-[#141C2E] border ${isDone ? 'border-emerald-500/40 shadow-xs shadow-emerald-500/10' : 'border-[#24314A]'} rounded-xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-[#38BDF8]/40 shadow-sm relative group">
      
      <!-- Top Row: Day Pill, Week Domain & Difficulty -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded font-code text-[11px] font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-[#0F1626] text-cyan-400 border border-cyan-500/30'}">
              DAY ${String(item.day).padStart(2, '0')}
            </span>
            <span class="text-[11px] font-code text-slate-400">Week ${item.week} • ${escapeHtml(item.domain)}</span>
          </div>

          <span class="px-2 py-0.5 rounded-full text-[10px] font-code font-semibold uppercase border ${badgeColor}">
            ${item.difficulty}
          </span>
        </div>

        <!-- Topic Title -->
        <h3 class="font-sans text-[16px] font-bold ${isDone ? 'text-slate-300 line-through decoration-emerald-400/50' : 'text-white'} leading-snug group-hover:text-cyan-300 transition-colors">
          ${escapeHtml(item.topic)}
        </h3>

        <!-- Objective -->
        <p class="text-[12.5px] text-slate-400 leading-relaxed">
          ${escapeHtml(item.objective)}
        </p>

        <!-- Key Architectural Trade-offs -->
        <div class="bg-[#0F1626] border border-[#24314A]/70 rounded-lg p-3 flex flex-col gap-1.5 mt-1">
          <span class="font-code text-[10px] text-cyan-400 uppercase font-semibold tracking-wider flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">tune</span>
            Key Architectural Trade-offs &amp; Invariants:
          </span>
          <ul class="flex flex-col gap-1 text-[11.5px] text-slate-300 list-disc list-inside">
            ${item.keyTradeoffs.map(t => `<li class="leading-relaxed text-slate-300">${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Bottom Actions & Spec Launch -->
      <div class="pt-3 border-t border-[#24314A] flex items-center justify-between gap-2">
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              class="sys-roadmap-toggle-checkbox w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-[#0F1626] cursor-pointer"
              data-roadmap-day="${item.day}"
              ${isDone ? 'checked' : ''}
            />
            <span class="text-[12px] font-code ${isDone ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'}">
              ${isDone ? 'Completed ✓' : 'Mark Complete'}
            </span>
          </label>

          <span class="text-[11px] font-code text-slate-500">• ${item.estTime}</span>
        </div>

        ${item.specId ? `
          <button
            class="open-spec-modal-btn px-2.5 py-1 rounded-md bg-[#182238] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 text-[11.5px] font-code font-medium flex items-center gap-1 transition-all cursor-pointer"
            data-open-problem="${item.specId}"
            data-is-spec="true"
            title="Inspect deep-dive production blueprint"
          >
            <span>Launch Spec</span>
            <span class="material-symbols-outlined text-[14px]">arrow_outward</span>
          </button>
        ` : `
          <div class="flex items-center gap-1 text-[11px] font-code text-slate-500">
            <span>Fundamental</span>
          </div>
        `}
      </div>

    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
