/**
 * 45-Day Interview Prep OS - Curated Base Catalog
 * Exactly matching supabase/seed_questions.sql (100 DSA problems & 20 System Design specs)
 */

export const SEED_SYSTEM_DESIGN_SPECS = [
  {
    "id": "sd-1",
    "title": "URL Shortener (e.g., TinyURL / Bitly)",
    "domain": "Hashing Algorithms & Persistent Key Generation (KGS)",
    "difficulty": "Medium",
    "rubric": {
      "scope": "100M writes/day, 1B reads/day (10:1 read ratio). Generate 7-character Base62 keys with 99.999% availability and p99 read redirection < 8ms.",
      "api": "POST /api/v1/shorten { longUrl, customAlias?, expireAt? } -> { shortUrl, key }\nGET /{shortKey} -> HTTP 301 / 302 Redirect",
      "dataModel": "Key Generation Service (KGS) pre-allocating Base62 key blocks in memory. Sharded PostgreSQL with Redis cache-aside (LRU).",
      "deepDive": "Base62 vs MD5/Murmur3 collision handling; Bloom filters to eliminate cold-key database exhaustion; HTTP 301 (browser cached) vs 302 (server analytics) trade-offs."
    },
    "referenceLinks": [
      {
        "title": "System Design Primer: URL Shortener",
        "url": "https://github.com/donnemartin/system-design-primer#design-pastebin"
      },
      {
        "title": "High Scalability: TinyURL Architecture",
        "url": "http://highscalability.com"
      },
      {
        "title": "Engineering Monograph: Base62 & KGS Deep Dive",
        "url": "#/blog?article=design-url-shortener-kgs"
      }
    ],
    "revision": "In 14 days",
    "timeSpent": "40m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-2",
    "title": "Distributed Key-Value Store (e.g., DynamoDB / Cassandra)",
    "domain": "Consistent Hashing & Quorum Consensus",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Planetary-scale distributed key-value store with tunable consistency (AP/CP), multi-master writes, and sub-10ms p99 at 1M+ QPS.",
      "api": "PUT /v1/kv/{key} { value, clientTimestamp } -> { versionToken, status }\nGET /v1/kv/{key}?consistency=QUORUM -> { value, vectorClock }",
      "dataModel": "LSM-Trees (MemTable + SSTables) with commit logs on NVMe disk. Consistent hash ring with virtual nodes (vnodes). Vector clocks for versioning.",
      "deepDive": "Quorum consensus math (R + W > N); Hinted handoff and read repair; Anti-entropy synchronization using Merkle trees; Gossip protocol for cluster membership."
    },
    "referenceLinks": [
      {
        "title": "Amazon Dynamo Paper: Highly Available Key-Value Store",
        "url": "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf"
      },
      {
        "title": "Apache Cassandra Architecture",
        "url": "https://cassandra.apache.org/doc/latest/cassandra/architecture/"
      }
    ],
    "revision": "Day 16",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-3",
    "title": "Distributed Cache (e.g., Redis / Memcached Cluster)",
    "domain": "In-Memory Storage & Cache Invalidation",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Sub-millisecond latency distributed cache cluster storing 500GB active working set, handling 500K ops/sec with horizontal peer-to-peer sharding.",
      "api": "GET /cache/{key}\nSET /cache/{key} { value, ttlSeconds }\nDEL /cache/{key}",
      "dataModel": "In-memory hash table with doubly-linked list for O(1) LRU eviction. Redis cluster with 16,384 hash slots.",
      "deepDive": "Eviction policies (LRU, LFU, ARC); Invalidation strategies (Cache-aside, Write-through, Write-behind); Mitigating cache stampede (probabilistic early expiration XFetch, singleflight locks); Sentinel master-replica failover."
    },
    "referenceLinks": [
      {
        "title": "Redis Cluster Specification",
        "url": "https://redis.io/topics/cluster-spec"
      },
      {
        "title": "Facebook: Scaling Memcached at Scale",
        "url": "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf"
      }
    ],
    "revision": "Day 18",
    "timeSpent": "45m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-4",
    "title": "Distributed Object Storage (e.g., AWS S3 / Google Cloud Storage)",
    "domain": "Blob Storage & Multipart Resumption",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Store exabytes of unstructured blob data (images, videos, backups) with 99.999999999% (11 9s) durability and multi-region availability.",
      "api": "PUT /buckets/{name}/objects/{key} (Stream or Multipart)\nPOST /buckets/{name}/objects/{key}?uploadId\nGET /buckets/{name}/objects/{key} (Byte-Range support)",
      "dataModel": "Decoupled architecture: Metadata Tier (NoSQL/Spanner holding bucket ownership, ACLs, chunk mappings) + Storage Tier (Chunk servers holding 64MB immutable blocks with Reed-Solomon erasure coding).",
      "deepDive": "Multipart upload chunking and resumption under flaky network conditions; Erasure coding (8+4 scheme) vs 3x replication cost analysis; Garbage collection of orphaned upload parts."
    },
    "referenceLinks": [
      {
        "title": "AWS S3 Architecture & Durability Model",
        "url": "https://aws.amazon.com/s3/faqs/"
      },
      {
        "title": "Google Cloud Storage Architecture",
        "url": "https://cloud.google.com/storage/docs"
      }
    ],
    "revision": "Day 20",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-5",
    "title": "Distributed Message Queue (e.g., Apache Kafka / RabbitMQ)",
    "domain": "Append-Only Logs & Consumer Groups",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Ingest 5 million events/sec with strictly ordered partitions, durable replayability, multi-tenant consumer isolation, and consumer lag < 100ms.",
      "api": "POST /v1/topics/{topic}/publish { partitionKey?, payload } -> { offset, partition }\nGET /v1/topics/{topic}/poll?group={groupId}&limit=100 -> [ { offset, payload } ]",
      "dataModel": "Append-only disk commit logs segmented into 1GB rollups with sparse time-indexed and offset-indexed files.",
      "deepDive": "Zero-copy disk streaming using Linux sendfile(); Consumer group rebalancing (Eager vs Cooperative Sticky Assignor); Idempotent producer sequence numbering; Log compaction for key-value state tables."
    },
    "referenceLinks": [
      {
        "title": "LinkedIn Kafka Architecture: A Distributed Commit Log",
        "url": "https://kafka.apache.org/documentation/"
      },
      {
        "title": "Engineering Monograph: Zero-Copy & Consumer Lag",
        "url": "#/blog?article=kafka-partition-rebalancing-consumer-lag"
      }
    ],
    "revision": "Day 22",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-6",
    "title": "Social Media News Feed (e.g., Twitter / Instagram / Facebook)",
    "domain": "Fan-Out Engine & Hybrid Timeline Aggregation",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Real-time news feed for 300M DAU. Tweet creation latency < 50ms p95, timeline retrieval latency < 100ms p99.",
      "api": "POST /v1/tweets { content, mediaUrls } -> { tweetId }\nGET /v1/feed?cursor={timestamp} -> { tweets: [], nextCursor }",
      "dataModel": "Social graph in PostgreSQL/Neo4j; In-memory timeline cache per user using Redis Sorted Sets (ZSET) scored by reverse chronological timestamp.",
      "deepDive": "Fan-out-on-write (push to follower feeds) vs Fan-out-on-read (pull at request time); The Celebrity/VIP Problem (hybrid push/pull routing); Feed ranking heuristics and pagination with 64-bit Snowflake IDs."
    },
    "referenceLinks": [
      {
        "title": "Twitter Timelines at Scale",
        "url": "https://blog.x.com/engineering/en_us/topics/infrastructure/2013/timelines-at-scale"
      },
      {
        "title": "Instagram Feed Architecture",
        "url": "https://instagram-engineering.com"
      }
    ],
    "revision": "Day 24",
    "timeSpent": "45m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-7",
    "title": "Real-Time Chat & Messaging Service (e.g., WhatsApp / Slack)",
    "domain": "Long-Lived Connections & Presence Management",
    "difficulty": "Hard",
    "rubric": {
      "scope": "2 billion users sending 100 billion messages daily. End-to-end encryption, 1:1 and group chats up to 1,000 members, read receipts, and sub-100ms message delivery.",
      "api": "WebSocket Connection: wss://gateway.prep.os/chat\nClient Frame: { type: \"MSG\", to: \"usr_45\", payload: \"...\" }\nServer ACK: { type: \"ACK\", msgId: \"...\" }",
      "dataModel": "Transient connection registry in Redis (UserID -> Gateway Pod IP); Message history in ScyllaDB/Cassandra partitioned by ((conversation_id, bucket), message_id).",
      "deepDive": "Connection management at 500K concurrent WebSockets per node (Epoll/Netty); Ephemeral presence heartbeats via Redis Pub/Sub; Handling offline message queues; End-to-end Signal Double Ratchet key exchange."
    },
    "referenceLinks": [
      {
        "title": "WhatsApp 1M Connections Per Box",
        "url": "https://blog.whatsapp.com"
      },
      {
        "title": "Discord: Storing Billions of Messages in ScyllaDB",
        "url": "#/blog?article=discord-scylladb-migration-billions-messages"
      }
    ],
    "revision": "Tomorrow (Urgent)",
    "timeSpent": "45m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-8",
    "title": "Notification System (e.g., Firebase Cloud Messaging / Apple Push)",
    "domain": "Priority Queues & Gateway Decoupling",
    "difficulty": "Medium",
    "rubric": {
      "scope": "Deliver 10 billion notifications daily across iOS (APNs), Android (FCM), SMS (Twilio), and Email (SendGrid) with user opt-out preference enforcement.",
      "api": "POST /v1/notifications/dispatch { recipientUserId, templateId, channel: \"AUTO|PUSH|SMS\", priority: \"HIGH|NORMAL\", payload: {} }",
      "dataModel": "PostgreSQL for user notification settings and device tokens; Redis/RabbitMQ priority queues (High vs Bulk); Distributed deduplication store with 5-minute TTL window.",
      "deepDive": "Decoupled gateway workers with circuit breakers; Rate limiting per recipient to prevent device notification fatigue; Third-party gateway throttling mitigation; Idempotent deduplication tokens."
    },
    "referenceLinks": [
      {
        "title": "Uber Notification Platform",
        "url": "https://eng.uber.com/building-uber-notification-platform/"
      },
      {
        "title": "Apple Push Notification Network Protocol",
        "url": "https://developer.apple.com/documentation/usernotifications"
      }
    ],
    "revision": "Day 26",
    "timeSpent": "40m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-9",
    "title": "Collaborative Document Editor (e.g., Google Docs / Notion)",
    "domain": "Conflict Resolution (OT vs. CRDTs)",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Real-time concurrent rich-text editing with up to 50 active co-editors per document. Sub-50ms keystroke broadcast, automatic conflict resolution, offline synchronization.",
      "api": "WebSocket wss://collab.prep.os/doc/{id}\nClient Frame: { type: \"OP\", clientSeq: 142, ops: [ { retain: 5 }, { insert: \"hello\" } ] }",
      "dataModel": "Operational Transformation (OT) state machine with central server sequence sequencer, or CRDT (Yjs / Automerge) with unique Lamport character timestamps.",
      "deepDive": "Operational Transformation (Transform function mechanics) vs Conflict-free Replicated Data Types (CRDTs); Undo/Redo state trees under concurrent branches; Snapshotting document history into S3."
    },
    "referenceLinks": [
      {
        "title": "Google Wave OT Protocol Whitepaper",
        "url": "https://www.waveprotocol.org/whitepapers/operational-transform"
      },
      {
        "title": "Figma: How Multiplayer Works",
        "url": "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/"
      }
    ],
    "revision": "Day 28",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-10",
    "title": "Video Streaming Platform (e.g., YouTube / Netflix)",
    "domain": "Adaptive Bitrate Streaming (DASH/HLS) & Video Ingestion",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Ingest 500 hours of video uploaded every minute. Support adaptive bitrate streaming (1080p, 4K, 720p, 480p) across 1 billion daily playback hours.",
      "api": "POST /v1/videos/upload-session { fileSize, format } -> { uploadUrl, videoId }\nGET /v1/videos/{id}/manifest.m3u8 (HLS Playlist)",
      "dataModel": "Video metadata in PostgreSQL; Raw and transcoded video segments in S3; Asynchronous encoding DAG tasks tracked in Celery/Temporal; Edge video segments cached in CDN.",
      "deepDive": "Asynchronous transcoding pipeline with chunk-based parallel encoders; Adaptive Bitrate (ABR) algorithm (switching bitrates based on client buffer health); Real-time view count deduplication with Kafka and HyperLogLog."
    },
    "referenceLinks": [
      {
        "title": "Netflix Dynamic Video Streaming Architecture",
        "url": "https://netflixtechblog.com"
      },
      {
        "title": "HLS Specification RFC 8216",
        "url": "https://datatracker.ietf.org/doc/html/rfc8216"
      }
    ],
    "revision": "Day 30",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-11",
    "title": "Content Delivery Network (CDN)",
    "domain": "Anycast BGP Routing & Origin Shielding",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Geographically distributed edge proxy caching static and dynamic web assets, reducing origin server load by 95% and lowering global latency from 300ms to < 20ms.",
      "api": "GET /assets/{path} (Edge Cached)\nPOST /v1/purge { bucket, path, purgeType: \"TAG|URL|ALL\" } -> { purgedEdgeNodes: 240 }",
      "dataModel": "In-memory and NVMe SSD edge tiered caches (Varnish / Nginx); Global edge configuration synchronized via Raft; Origin shield layer.",
      "deepDive": "BGP Anycast routing vs GeoDNS routing trade-offs; Cache purge propagation within 150ms across 300 global PoPs; Origin shielding to prevent thundering herds on cache miss; Cache poisoning and TLS session resumption."
    },
    "referenceLinks": [
      {
        "title": "Cloudflare Edge Architecture",
        "url": "https://blog.cloudflare.com/how-we-built-it/"
      },
      {
        "title": "Fastly Origin Shielding Guide",
        "url": "https://www.fastly.com/documentation/guides/concepts/origin-shielding/"
      }
    ],
    "revision": "Day 31",
    "timeSpent": "45m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-12",
    "title": "Ride-Sharing / Dispatch Service (e.g., Uber / Lyft)",
    "domain": "Geospatial Indexing & Real-Time Driver Matching",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Match millions of riders and drivers in real time with sub-50ms dispatch latency. Ingest 10M GPS coordinates per minute; handle dynamic surge pricing.",
      "api": "POST /v1/drivers/location { driverId, lat, lng, bearing, status }\nPOST /v1/trips/request { riderId, pickupLat, pickupLng, destLat, destLng } -> { tripId, driverMatched }",
      "dataModel": "Spatial indexing using Uber H3 hexagonal hierarchical spatial index (64-bit integer cells) or Google S2. In-memory spatial driver registry partitioned by H3 cell ID.",
      "deepDive": "Comparing Quadtree, Geohash, and H3 hexagons; Ringpop consistent hash ring with SWIM gossip protocol; Dynamic surge pricing aggregation over resolution 7 parent cells; Concurrency lock during driver offer dispatch."
    },
    "referenceLinks": [
      {
        "title": "Uber H3 Spatial Indexing System",
        "url": "https://www.uber.com/blog/h3/"
      },
      {
        "title": "Engineering Monograph: Uber Geospatial Architecture",
        "url": "#/blog?article=uber-geospatial-partitioning-h3-hexagons"
      }
    ],
    "revision": "Day 32",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-13",
    "title": "Proximity Server (e.g., Yelp / Google Maps Places)",
    "domain": "Read-Heavy Spatial Queries & Radius Indexing",
    "difficulty": "Medium",
    "rubric": {
      "scope": "100M registered businesses, 50,000 search QPS globally. Sub-50ms response for \"find top-rated coffee shops within 5km of current latitude/longitude\".",
      "api": "GET /v1/places/search?lat=37.7749&lng=-122.4194&radiusKm=5&category=food&sortBy=rating -> { places: [] }",
      "dataModel": "Relational DB (PostgreSQL with PostGIS) as system of record; Geohash / 2D R-Tree spatial index; Read-cache in Redis keyed by Geohash prefixes (e.g. places:geohash:9q8yy).",
      "deepDive": "Boundary search problem when search radius overlaps multiple Geohash cells; Precision tuning (6-character Geohash ≈ 1.2km × 0.6km); Tiered caching for popular metropolitan areas; Static spatial data vs dynamic moving objects."
    },
    "referenceLinks": [
      {
        "title": "Yelp Engineering: Geospatial Search",
        "url": "https://engineeringblog.yelp.com"
      },
      {
        "title": "PostGIS Spatial Indexing Documentation",
        "url": "https://postgis.net"
      }
    ],
    "revision": "Day 33",
    "timeSpent": "40m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-14",
    "title": "E-Commerce Flash Sale System (e.g., Amazon Prime Day / Ticketmaster)",
    "domain": "High-Concurrency Inventory Locks & Thundering Herd",
    "difficulty": "Hard",
    "rubric": {
      "scope": "100,000 units of a heavily discounted product sold out in 60 seconds with 2 million concurrent checkout requests. Zero overselling, strict FIFO fair queueing.",
      "api": "POST /v1/flash-sale/reserve { itemId, userId, count: 1 } -> { reservationToken, expiresAt: 900 }\nPOST /v1/flash-sale/checkout { reservationToken, paymentMethod }",
      "dataModel": "Redis clustered in-memory inventory counter with atomic Lua script; PostgreSQL order ledger; Kafka asynchronous checkout queue.",
      "deepDive": "Preventing database meltdown using virtual waiting rooms (Token Bucket gatekeepers); Redis atomic Lua inventory decrement vs PostgreSQL SELECT ... FOR UPDATE; Distributed locking (Redlock) and lease timeouts; Compensating transactions on payment cancellation."
    },
    "referenceLinks": [
      {
        "title": "Amazon DynamoDB Flash Sale Architecture",
        "url": "https://aws.amazon.com/blogs/database/"
      },
      {
        "title": "Martin Kleppmann on Redlock Critique",
        "url": "https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html"
      }
    ],
    "revision": "Day 35",
    "timeSpent": "45m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-15",
    "title": "Payment Processing & Ledger System (e.g., Stripe / PayPal)",
    "domain": "Distributed Transactions, Idempotency & Double-Entry",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Process billions of dollars in daily payments with exactly-once execution, zero double charges, strict double-entry ledger balancing, and PCI-DSS compliance.",
      "api": "POST /v1/charges (Headers: Idempotency-Key: \"uuid\") { amount, currency, sourceAccount, destAccount } -> { chargeId, status: \"SUCCEEDED\" }",
      "dataModel": "PostgreSQL strict ACID ledger with append-only entries (debits and credits equal zero); Redis idempotency key registry with 120s locks and cached JSON responses.",
      "deepDive": "Idempotency keys with payload hash verification; Distributed transactions: Two-Phase Commit (2PC) vs Saga pattern with compensating transactions; Transactional outbox pattern for asynchronous webhook events; End-of-day bank reconciliation jobs."
    },
    "referenceLinks": [
      {
        "title": "Stripe Architecture: Designing Idempotent APIs",
        "url": "https://stripe.com/blog/idempotency"
      },
      {
        "title": "Engineering Monograph: Stripe Payment Deduplication",
        "url": "#/blog?article=stripe-idempotent-apis-distributed-deduplication"
      }
    ],
    "revision": "Day 36",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-16",
    "title": "Search Autocomplete / Typeahead (e.g., Google Search Bar)",
    "domain": "In-Memory Prefix Trees (Trie) & Offline Aggregation",
    "difficulty": "Medium",
    "rubric": {
      "scope": "Sub-20ms autocomplete suggestions for 5 billion searches per day. Return top 5 most relevant queries for any typed prefix (e.g., \"sys\" -> \"system design\").",
      "api": "GET /v1/suggest?prefix=sys&limit=5 -> { suggestions: [ \"system design\", \"system architecture\", ... ] }",
      "dataModel": "In-memory Trie where each node stores pre-computed top-5 suggestions; Offline MapReduce / Apache Spark analytics jobs computing 24-hour query frequencies; Redis L1 edge cache.",
      "deepDive": "Trie partition sharding by prefix character range (A-E, F-K, etc.); Optimizing Trie node serialization to fit within memory; Handling trending/breaking search terms via real-time stream aggregation; Client-side keystroke debouncing."
    },
    "referenceLinks": [
      {
        "title": "Google Search Autocomplete Architecture",
        "url": "https://research.google/pubs/pub45530/"
      },
      {
        "title": "Algorithms 4th Edition: Tries",
        "url": "https://algs4.cs.princeton.edu/52trie/"
      }
    ],
    "revision": "Day 37",
    "timeSpent": "40m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-17",
    "title": "Web Crawler & Search Indexer (e.g., Googlebot)",
    "domain": "URL Frontier, Deduplication & Inverted Indexing",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Crawl 10 billion web pages per month with strict politeness policies (respecting robots.txt and domain host rates), distributed deduplication, and inverted index generation.",
      "api": "POST /v1/frontier/seed { urls: [] }\nGET /v1/frontier/next-fetch-batch?workerId={id} -> [ { url, crawlDelayMs } ]",
      "dataModel": "URL Frontier organized into Politeness Queues (one per target domain) and Priority Queues; Content deduplication via Bloom filters and SimHash 64-bit fingerprints; Inverted index in Bigtable/Lucene.",
      "deepDive": "URL Frontier architecture (Mercator model); DNS resolver bottleneck mitigation via local caching; Distributed crawling traps and cyclic link detection; MapReduce indexing pipeline building postings lists."
    },
    "referenceLinks": [
      {
        "title": "Mercator: A Scalable, Extensible Web Crawler",
        "url": "https://www.cs.cornell.edu/courses/cs4320/2012fa/crawl-paper.pdf"
      },
      {
        "title": "The Anatomy of a Large-Scale Web Search Engine (Google)",
        "url": "https://infolab.stanford.edu/~backrub/google.html"
      }
    ],
    "revision": "Day 38",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-18",
    "title": "API Rate Limiter & Gateway",
    "domain": "Token Bucket / Sliding Window & Edge Filtering",
    "difficulty": "Medium",
    "rubric": {
      "scope": "Cloud-native API gateway processing 500,000 RPS with sub-millisecond rate checking overhead, multi-tenant tiered quotas (free, pro, enterprise), and DDoS protection.",
      "api": "HTTP Middleware Inspection: Authorization: Bearer <key> -> Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, 429 Too Many Requests",
      "dataModel": "Redis cluster with in-memory sliding window counters; Atomic Redis Lua scripts; Local memory L1 cache inside Envoy proxy pods with periodic batch synchronization.",
      "deepDive": "Detailed comparison of 4 algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, and Sliding Window Counter; Handling Redis cluster failover (Fail-Open vs Fail-Closed policy); Edge throttling at Cloudflare/Envoy vs core service throttling."
    },
    "referenceLinks": [
      {
        "title": "Envoy Proxy Rate Limiting Architecture",
        "url": "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/other_features/global_rate_limiting"
      },
      {
        "title": "Engineering Monograph: Distributed Rate Limiting",
        "url": "#/blog?article=distributed-rate-limiter-sliding-window"
      }
    ],
    "revision": "Day 39",
    "timeSpent": "40m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-19",
    "title": "Metrics & Logging Monitoring System (e.g., Datadog / Prometheus)",
    "domain": "Time-Series Database (TSDB) & Inverted Metric Index",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Ingest 100 million metric data points per minute from 50,000 servers. Sub-second dashboards for p95/p99 query latency, automated alerting on anomalies, 1-year retention.",
      "api": "POST /api/v1/metrics/ingest [ { metric: \"cpu.utilization\", tags: { host: \"i-98\", env: \"prod\" }, timestamp: 1718000000, val: 84.2 } ]\nPOST /api/v1/query { expr: \"avg_over_time(cpu.utilization[5m])\" }",
      "dataModel": "Time-series database (TSDB) using Gorilla delta-of-delta timestamp and XOR floating-point compression; Inverted index for high-cardinality tag lookups; ClickHouse for log aggregation.",
      "deepDive": "Ingestion pipeline buffering with Kafka; Gorilla compression algorithm compressing 16-byte datapoints to 1.37 bytes; Downsampling rollups (10s raw -> 1m -> 1hr); Push (Datadog agent) vs Pull (Prometheus scraping) architectural trade-offs."
    },
    "referenceLinks": [
      {
        "title": "Facebook Gorilla: A Fast, Scalable, In-Memory Time Series Database",
        "url": "https://www.vldb.org/pvldb/vol8/p1816-teller.pdf"
      },
      {
        "title": "Prometheus Storage Engine Architecture",
        "url": "https://prometheus.io/docs/prometheus/latest/storage/"
      }
    ],
    "revision": "Day 41",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  },
  {
    "id": "sd-20",
    "title": "Distributed Task Scheduler / Job Queue (e.g., Celery / AWS Step Functions)",
    "domain": "Two-Tier Scheduling & Worker Heartbeat Leases",
    "difficulty": "Hard",
    "rubric": {
      "scope": "Schedule and execute millions of asynchronous background tasks and recurring cron jobs across 1,000 worker nodes with delayed queues, priority routing, and zero lost jobs.",
      "api": "POST /v1/tasks/schedule { taskType, payload, runAtTimestamp?, retryPolicy: { maxRetries: 5, backoff: \"EXPONENTIAL\" } } -> { taskId, status: \"SCHEDULED\" }\nGET /v1/tasks/{id}/status",
      "dataModel": "Task metadata in PostgreSQL with state machine (PENDING, RUNNING, COMPLETED, FAILED); Delayed queues using Redis Sorted Sets scored by run_at UNIX timestamp; Heartbeat lease renewals in Redis.",
      "deepDive": "Worker crash detection and lease stealing; Distributed priority scheduling (Two-Tier scheduler); Preventing thundering herd upon timer expiration; State machines for complex multi-step workflow DAGs (Sagas / Step Functions)."
    },
    "referenceLinks": [
      {
        "title": "Uber Cherami: Distributed Task Queue",
        "url": "https://eng.uber.com/cherami-message-queue-system/"
      },
      {
        "title": "Temporal Architecture & Execution Model",
        "url": "https://docs.temporal.io/evaluate/architecture"
      }
    ],
    "revision": "Day 43",
    "timeSpent": "50m",
    "status": "Queued",
    "stars": 0
  }
];

export const SEED_DSA_PROBLEMS = [
  {
    "id": "dsa-1",
    "title": "Two Sum",
    "description": "Find two indices whose values sum to a specific target using a hash map for $O(n)$ lookup.",
    "pattern": "Arrays & Hashing",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/two-sum/",
    "revision": "In 14 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-2",
    "title": "Valid Anagram",
    "description": "Determine if two strings are permutations of each other using frequency counts.",
    "pattern": "Arrays & Hashing",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/valid-anagram/",
    "revision": "In 14 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-3",
    "title": "Group Anagrams",
    "description": "Group strings that share the same character frequencies using sorted keys or tuples.",
    "pattern": "Arrays & Hashing",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/group-anagrams/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-4",
    "title": "Top K Frequent Elements",
    "description": "Identify the $k$ most frequent numbers using a min-heap or bucket sort in linear time.",
    "pattern": "Arrays & Hashing",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/top-k-frequent-elements/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-5",
    "title": "Product of Array Except Self",
    "description": "Calculate prefix and suffix products for each index without using division in $O(1)$ extra space.",
    "pattern": "Arrays & Hashing",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/product-of-array-except-self/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-6",
    "title": "Longest Consecutive Sequence",
    "description": "Find the length of the longest streak of consecutive numbers using a hash set in $O(n)$ time.",
    "pattern": "Arrays & Hashing",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/longest-consecutive-sequence/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-7",
    "title": "Subarray Sum Equals K",
    "description": "Count continuous subarrays summing to $k$ by tracking prefix sum frequencies in a hash map.",
    "pattern": "Prefix Sum",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/subarray-sum-equals-k/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-8",
    "title": "Next Permutation",
    "description": "Rearrange numbers into the lexicographically next greater permutation in-place.",
    "pattern": "Arrays & Math",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/next-permutation/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-9",
    "title": "First Missing Positive",
    "description": "Find the smallest missing positive integer in $O(n)$time and $O(1)$space using cyclic placement.",
    "pattern": "Cyclic Sort / Arrays",
    "difficulty": "Hard",
    "category": "Arrays & Hashing",
    "link": "https://leetcode.com/problems/first-missing-positive/",
    "revision": "In 14 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-10",
    "title": "Valid Palindrome",
    "description": "Verify if a string reads identically forwards and backwards ignoring non-alphanumeric characters.",
    "pattern": "Two Pointers",
    "difficulty": "Easy",
    "category": "Two Pointers",
    "link": "https://leetcode.com/problems/valid-palindrome/",
    "revision": "In 14 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-11",
    "title": "Two Sum II - Input Array Is Sorted",
    "description": "Find two numbers summing to target in a 1-indexed sorted array using inward-moving pointers.",
    "pattern": "Two Pointers",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "link": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-12",
    "title": "3Sum",
    "description": "Find all unique triplets summing to zero by sorting the array and running two-pointer scans.",
    "pattern": "Two Pointers",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "link": "https://leetcode.com/problems/3sum/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-13",
    "title": "Container With Most Water",
    "description": "Maximize water trapped between two vertical lines by moving the pointer with the smaller height.",
    "pattern": "Two Pointers",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "link": "https://leetcode.com/problems/container-with-most-water/",
    "revision": "In 14 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-14",
    "title": "Trapping Rain Water",
    "description": "Compute total rainwater trapped across elevation bars using two pointers or prefix maximums.",
    "pattern": "Two Pointers / Monotonic Stack",
    "difficulty": "Hard",
    "category": "Two Pointers",
    "link": "https://leetcode.com/problems/trapping-rain-water/",
    "revision": "In 14 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-15",
    "title": "Best Time to Buy and Sell Stock",
    "description": "Find maximum profit from a single buy-sell transaction by tracking the running minimum price.",
    "pattern": "Sliding Window",
    "difficulty": "Easy",
    "category": "Sliding Window",
    "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "revision": "In 7 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-16",
    "title": "Longest Substring Without Repeating Characters",
    "description": "Find length of longest substring without duplicates by expanding/contracting a dynamic window.",
    "pattern": "Sliding Window",
    "difficulty": "Medium",
    "category": "Sliding Window",
    "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-17",
    "title": "Longest Repeating Character Replacement",
    "description": "Find longest substring with identical letters achievable by replacing at most $k$characters.",
    "pattern": "Sliding Window",
    "difficulty": "Medium",
    "category": "Sliding Window",
    "link": "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-18",
    "title": "Permutation in String",
    "description": "Determine if string $s_2$ contains a substring that is an exact permutation of string $s_1$.",
    "pattern": "Sliding Window",
    "difficulty": "Medium",
    "category": "Sliding Window",
    "link": "https://leetcode.com/problems/permutation-in-string/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-19",
    "title": "Minimum Window Substring",
    "description": "Find the smallest substring of $s$containing every character from $t$using frequency matching.",
    "pattern": "Sliding Window",
    "difficulty": "Hard",
    "category": "Sliding Window",
    "link": "https://leetcode.com/problems/minimum-window-substring/",
    "revision": "In 7 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-20",
    "title": "Sliding Window Maximum",
    "description": "Return the maximum element in each sliding window of size $k$ using a monotonic deque.",
    "pattern": "Sliding Window / Deque",
    "difficulty": "Hard",
    "category": "Sliding Window",
    "link": "https://leetcode.com/problems/sliding-window-maximum/",
    "revision": "In 7 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-21",
    "title": "Valid Parentheses",
    "description": "Validate balanced opening and closing bracket pairs using a Last-In-First-Out stack.",
    "pattern": "Stack",
    "difficulty": "Easy",
    "category": "Stack",
    "link": "https://leetcode.com/problems/valid-parentheses/",
    "revision": "In 7 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-22",
    "title": "Min Stack",
    "description": "Design a stack supporting push, pop, top, and retrieving the minimum element in $O(1)$ time.",
    "pattern": "Stack Design",
    "difficulty": "Medium",
    "category": "Stack",
    "link": "https://leetcode.com/problems/min-stack/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-23",
    "title": "Evaluate Reverse Polish Notation",
    "description": "Evaluate arithmetic expressions written in postfix notation using an operand stack.",
    "pattern": "Stack",
    "difficulty": "Medium",
    "category": "Stack",
    "link": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-24",
    "title": "Daily Temperatures",
    "description": "Calculate days until a warmer temperature for each day using a decreasing monotonic stack.",
    "pattern": "Monotonic Stack",
    "difficulty": "Medium",
    "category": "Stack",
    "link": "https://leetcode.com/problems/daily-temperatures/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-25",
    "title": "Largest Rectangle in Histogram",
    "description": "Compute the largest rectangular area in a histogram using an increasing monotonic stack.",
    "pattern": "Monotonic Stack",
    "difficulty": "Hard",
    "category": "Stack",
    "link": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "revision": "In 7 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-26",
    "title": "Basic Calculator",
    "description": "Evaluate mathematical string expressions containing +, -, and parentheses using a stack.",
    "pattern": "Stack / Parsing",
    "difficulty": "Hard",
    "category": "Stack",
    "link": "https://leetcode.com/problems/basic-calculator/",
    "revision": "In 7 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-27",
    "title": "Binary Search",
    "description": "Locate the index of a target value within an ascending sorted array in $O(\\log n)$time.",
    "pattern": "Binary Search",
    "difficulty": "Easy",
    "category": "Binary Search",
    "link": "https://leetcode.com/problems/binary-search/",
    "revision": "In 7 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-28",
    "title": "Search a 2D Matrix",
    "description": "Search for a target in an $m \\times n$matrix with row-sorted properties by treating it as 1D.",
    "pattern": "Binary Search",
    "difficulty": "Medium",
    "category": "Binary Search",
    "link": "https://leetcode.com/problems/search-a-2d-matrix/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-29",
    "title": "Find Minimum in Rotated Sorted Array",
    "description": "Find the inflection/minimum point in a sorted array rotated between 1 and $n$ times.",
    "pattern": "Binary Search",
    "difficulty": "Medium",
    "category": "Binary Search",
    "link": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-30",
    "title": "Search in Rotated Sorted Array",
    "description": "Locate target in a rotated sorted array by determining which half is strictly ordered.",
    "pattern": "Binary Search",
    "difficulty": "Medium",
    "category": "Binary Search",
    "link": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "revision": "In 7 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-31",
    "title": "Koko Eating Bananas",
    "description": "Find the minimum integer eating speed $k$ to finish all bananas within $h$hours.",
    "pattern": "Binary Search on Answer",
    "difficulty": "Medium",
    "category": "Binary Search",
    "link": "https://leetcode.com/problems/koko-eating-bananas/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-32",
    "title": "Time Based Key-Value Store",
    "description": "Store key-value pairs with timestamps and retrieve values at or before a given timestamp.",
    "pattern": "Binary Search / Design",
    "difficulty": "Medium",
    "category": "Binary Search",
    "link": "https://leetcode.com/problems/time-based-key-value-store/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-33",
    "title": "Median of Two Sorted Arrays",
    "description": "Find the combined median of two sorted arrays in $O(\\log(\\min(m, n)))$using binary partition.",
    "pattern": "Binary Search",
    "difficulty": "Hard",
    "category": "Binary Search",
    "link": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "revision": "In 10 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-34",
    "title": "Reverse Linked List",
    "description": "Invert the direction of pointers in a singly-linked list iteratively or recursively.",
    "pattern": "Linked List",
    "difficulty": "Easy",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/reverse-linked-list/",
    "revision": "In 10 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-35",
    "title": "Merge Two Sorted Lists",
    "description": "Combine two sorted linked lists into a single continuous sorted list using dummy head nodes.",
    "pattern": "Linked List",
    "difficulty": "Easy",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "revision": "In 10 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-36",
    "title": "Linked List Cycle",
    "description": "Detect if a cycle exists in a linked list using Floyd's slow and fast pointer algorithm.",
    "pattern": "Fast & Slow Pointers",
    "difficulty": "Easy",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/linked-list-cycle/",
    "revision": "In 10 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-37",
    "title": "Reorder List",
    "description": "Reorder a list to alternating first and last elements: $L_0 \\to L_n \\to L_1 \\to L_{n-1} \\dots$.",
    "pattern": "Linked List",
    "difficulty": "Medium",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/reorder-list/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-38",
    "title": "Remove Nth Node From End of List",
    "description": "Delete the $n$-th node from the tail in a single pass using two offset pointers.",
    "pattern": "Fast & Slow Pointers",
    "difficulty": "Medium",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-39",
    "title": "Copy List with Random Pointer",
    "description": "Create a deep copy of a list with arbitrary random pointers via hash map or node interleaving.",
    "pattern": "Linked List / Hash Map",
    "difficulty": "Medium",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/copy-list-with-random-pointer/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-40",
    "title": "LRU Cache",
    "description": "Implement an eviction cache supporting $O(1)$ get and put using a doubly-linked list and map.",
    "pattern": "Doubly Linked List / Hash Map",
    "difficulty": "Medium",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/lru-cache/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-41",
    "title": "Merge k Sorted Lists",
    "description": "Merge $k$ sorted linked lists into one sorted list using a min-heap or divide-and-conquer.",
    "pattern": "Heap / Divide & Conquer",
    "difficulty": "Hard",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "revision": "In 10 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-42",
    "title": "Reverse Nodes in k-Group",
    "description": "Reverse nodes of a linked list $k$ at a time, leaving remaining sub-groups unmodified.",
    "pattern": "Linked List",
    "difficulty": "Hard",
    "category": "Linked List",
    "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    "revision": "In 10 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-43",
    "title": "Invert Binary Tree",
    "description": "Swap left and right child nodes for every node in a binary tree recursively.",
    "pattern": "Trees (DFS)",
    "difficulty": "Easy",
    "category": "Trees",
    "link": "https://leetcode.com/problems/invert-binary-tree/",
    "revision": "In 10 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-44",
    "title": "Maximum Depth of Binary Tree",
    "description": "Calculate the maximum number of nodes along the longest path from root to leaf node.",
    "pattern": "Trees (DFS/BFS)",
    "difficulty": "Easy",
    "category": "Trees",
    "link": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "revision": "In 10 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-45",
    "title": "Diameter of Binary Tree",
    "description": "Find the longest path between any two nodes in a tree, measured by edge count.",
    "pattern": "Trees (DFS)",
    "difficulty": "Easy",
    "category": "Trees",
    "link": "https://leetcode.com/problems/diameter-of-binary-tree/",
    "revision": "In 10 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-46",
    "title": "Same Tree",
    "description": "Check if two binary trees are structurally identical and share matching node values.",
    "pattern": "Trees (DFS)",
    "difficulty": "Easy",
    "category": "Trees",
    "link": "https://leetcode.com/problems/same-tree/",
    "revision": "In 10 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-47",
    "title": "Lowest Common Ancestor of a BST",
    "description": "Locate the deepest shared ancestor node of two given targets utilizing BST ordering.",
    "pattern": "BST Traversal",
    "difficulty": "Medium",
    "category": "Trees",
    "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-48",
    "title": "Binary Tree Level Order Traversal",
    "description": "Return node values level-by-level from left to right using a breadth-first queue.",
    "pattern": "Trees (BFS)",
    "difficulty": "Medium",
    "category": "Trees",
    "link": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-49",
    "title": "Validate Binary Search Tree",
    "description": "Verify if every node strictly adheres to left-child-smaller and right-child-greater bounds.",
    "pattern": "BST Traversal",
    "difficulty": "Medium",
    "category": "Trees",
    "link": "https://leetcode.com/problems/validate-binary-search-tree/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-50",
    "title": "Kth Smallest Element in a BST",
    "description": "Find the $k$-th smallest value in a BST using an iterative or recursive inorder traversal.",
    "pattern": "BST (Inorder)",
    "difficulty": "Medium",
    "category": "Trees",
    "link": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-51",
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "description": "Rebuild a binary tree from preorder root order and inorder sub-tree partition boundaries.",
    "pattern": "Tree Reconstruction",
    "difficulty": "Medium",
    "category": "Trees",
    "link": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-52",
    "title": "Binary Tree Maximum Path Sum",
    "description": "Find the non-empty path through any sequence of nodes yielding the largest sum.",
    "pattern": "Trees (DFS Post-order)",
    "difficulty": "Hard",
    "category": "Trees",
    "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "revision": "In 10 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-53",
    "title": "Serialize and Deserialize Binary Tree",
    "description": "Convert a binary tree to a serialized string format and reliably reconstruct it back.",
    "pattern": "Tree Traversal / Design",
    "difficulty": "Hard",
    "category": "Trees",
    "link": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "revision": "In 10 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-54",
    "title": "Implement Trie (Prefix Tree)",
    "description": "Build an $N$-ary prefix tree supporting efficient insert, search, and startsWith.",
    "pattern": "Trie Design",
    "difficulty": "Medium",
    "category": "Trie",
    "link": "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-55",
    "title": "Design Add and Search Words Data Structure",
    "description": "Implement a word dictionary trie supporting wildcard character . pattern searches.",
    "pattern": "Trie / Backtracking",
    "difficulty": "Medium",
    "category": "Trie",
    "link": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-56",
    "title": "Word Search II",
    "description": "Find all words from a dictionary present on a 2D board using a combined Trie and DFS.",
    "pattern": "Trie / Matrix Backtracking",
    "difficulty": "Hard",
    "category": "Trie",
    "link": "https://leetcode.com/problems/word-search-ii/",
    "revision": "In 10 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-57",
    "title": "Kth Largest Element in an Array",
    "description": "Retrieve the $k$-th largest item in an unsorted list via min-heap or quickselect partition.",
    "pattern": "Min-Heap / Quickselect",
    "difficulty": "Medium",
    "category": "Heap",
    "link": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-58",
    "title": "Task Scheduler",
    "description": "Find least CPU intervals needed to run tasks separated by cooling period $n$using greedy frequency.",
    "pattern": "Max-Heap / Greedy",
    "difficulty": "Medium",
    "category": "Heap",
    "link": "https://leetcode.com/problems/task-scheduler/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-59",
    "title": "Design Twitter",
    "description": "Implement posting tweets, following users, and pulling 10 most recent feeds using heaps.",
    "pattern": "Heap / System Design",
    "difficulty": "Medium",
    "category": "Heap",
    "link": "https://leetcode.com/problems/design-twitter/",
    "revision": "In 10 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-60",
    "title": "Find Median from Data Stream",
    "description": "Maintain running real-time median of incoming continuous numbers using balanced heaps.",
    "pattern": "Two Heaps",
    "difficulty": "Hard",
    "category": "Heap",
    "link": "https://leetcode.com/problems/find-median-from-data-stream/",
    "revision": "In 10 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-61",
    "title": "Subsets",
    "description": "Generate the complete power set of unique elements using state backtracking.",
    "pattern": "Backtracking",
    "difficulty": "Medium",
    "category": "Backtracking",
    "link": "https://leetcode.com/problems/subsets/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-62",
    "title": "Combination Sum",
    "description": "Find all distinct candidate combinations summing to target with unlimited element reuse.",
    "pattern": "Backtracking",
    "difficulty": "Medium",
    "category": "Backtracking",
    "link": "https://leetcode.com/problems/combination-sum/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-63",
    "title": "Permutations",
    "description": "Generate all distinct complete orderings of an array of distinct integer values.",
    "pattern": "Backtracking",
    "difficulty": "Medium",
    "category": "Backtracking",
    "link": "https://leetcode.com/problems/permutations/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-64",
    "title": "Word Search",
    "description": "Determine if a target string exists along horizontally/vertically adjacent cells in a grid.",
    "pattern": "Matrix Backtracking",
    "difficulty": "Medium",
    "category": "Backtracking",
    "link": "https://leetcode.com/problems/word-search/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-65",
    "title": "Palindrome Partitioning",
    "description": "Partition a string such that every substring in each partition is a valid palindrome.",
    "pattern": "Backtracking",
    "difficulty": "Medium",
    "category": "Backtracking",
    "link": "https://leetcode.com/problems/palindrome-partitioning/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-66",
    "title": "N-Queens",
    "description": "Place $n$ non-attacking queens on an $n \\times n$chessboard tracking column and diagonal attacks.",
    "pattern": "Backtracking",
    "difficulty": "Hard",
    "category": "Backtracking",
    "link": "https://leetcode.com/problems/n-queens/",
    "revision": "In 5 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-67",
    "title": "Number of Islands",
    "description": "Count distinct connected components of '1's surrounded by water in a 2D binary grid.",
    "pattern": "Graph (Matrix BFS/DFS)",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/number-of-islands/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-68",
    "title": "Clone Graph",
    "description": "Construct a deep copy of a connected, undirected graph with unique node references.",
    "pattern": "Graph (BFS/DFS)",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/clone-graph/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-69",
    "title": "Pacific Atlantic Water Flow",
    "description": "Find cells that can flow water to both Pacific and Atlantic oceans via reverse ocean searches.",
    "pattern": "Graph (Multi-source BFS/DFS)",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-70",
    "title": "Rotting Oranges",
    "description": "Determine minutes until all fresh oranges rot in a grid using a multi-source BFS queue.",
    "pattern": "Graph (Multi-source BFS)",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/rotting-oranges/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-71",
    "title": "Course Schedule",
    "description": "Detect if circular dependencies exist in prerequisite course pairs using cycle detection.",
    "pattern": "Graph (Cycle Detection)",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/course-schedule/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-72",
    "title": "Course Schedule II",
    "description": "Return a valid linear order to finish all courses using Kahn's topological sort algorithm.",
    "pattern": "Topological Sort",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/course-schedule-ii/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-73",
    "title": "Redundant Connection",
    "description": "Find an edge that can be removed to turn a cyclic graph into a tree using Union-Find.",
    "pattern": "Disjoint Set Union (DSU)",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/redundant-connection/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-74",
    "title": "Network Delay Time",
    "description": "Calculate time for all nodes to receive a signal using Dijkstra's shortest path algorithm.",
    "pattern": "Graph (Dijkstra)",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/network-delay-time/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-75",
    "title": "Cheapest Flights Within K Stops",
    "description": "Find cheapest travel route between source and destination with at most $k$intermediate stops.",
    "pattern": "Graph (Bellman-Ford / BFS)",
    "difficulty": "Medium",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-76",
    "title": "Word Ladder",
    "description": "Find length of shortest transformation sequence from start to end word mutating one char at a time.",
    "pattern": "Graph (Bidirectional BFS)",
    "difficulty": "Hard",
    "category": "Graphs",
    "link": "https://leetcode.com/problems/word-ladder/",
    "revision": "In 5 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-77",
    "title": "Climbing Stairs",
    "description": "Count distinct combinations to reach the top of an $n$-step staircase taking 1 or 2 steps.",
    "pattern": "1-D DP (Fibonacci)",
    "difficulty": "Easy",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/climbing-stairs/",
    "revision": "In 5 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-78",
    "title": "House Robber",
    "description": "Maximize stolen wealth without alerting police by avoiding robbing adjacent houses.",
    "pattern": "1-D DP",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/house-robber/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-79",
    "title": "House Robber II",
    "description": "Maximize stolen wealth when houses are arranged in a circle, making the first and last adjacent.",
    "pattern": "1-D DP (Circular)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/house-robber-ii/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-80",
    "title": "Longest Palindromic Substring",
    "description": "Find the longest continuous substring in $s$ that forms a symmetric palindrome.",
    "pattern": "1-D DP / Expand Center",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/longest-palindromic-substring/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-81",
    "title": "Coin Change",
    "description": "Compute minimum coins required to form a given amount using an unbounded knapsack approach.",
    "pattern": "1-D DP (Unbounded Knapsack)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/coin-change/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-82",
    "title": "Maximum Subarray",
    "description": "Find the contiguous subarray having the largest sum using Kadane's single-pass dynamic model.",
    "pattern": "Kadane's Algorithm / 1-D DP",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/maximum-subarray/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-83",
    "title": "Maximum Product Subarray",
    "description": "Find contiguous subarray with largest product, tracking both running min and max products.",
    "pattern": "1-D DP (State Tracking)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/maximum-product-subarray/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-84",
    "title": "Word Break",
    "description": "Determine if a string can be segmented into space-separated dictionary words using DP.",
    "pattern": "1-D DP",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/word-break/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-85",
    "title": "Longest Increasing Subsequence",
    "description": "Find length of longest strictly increasing subsequence in $O(n \\log n)$ via patience sorting.",
    "pattern": "1-D DP / Binary Search",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-86",
    "title": "Unique Paths",
    "description": "Count unique paths from top-left to bottom-right of an $m \\times n$ grid moving only down or right.",
    "pattern": "2-D DP (Grid)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/unique-paths/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-87",
    "title": "Longest Common Subsequence",
    "description": "Find length of the longest subsequence shared across two input strings.",
    "pattern": "2-D DP (String Matching)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/longest-common-subsequence/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-88",
    "title": "Target Sum",
    "description": "Find number of ways to assign + and - signs to array elements to evaluate to target.",
    "pattern": "2-D DP (0/1 Knapsack)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/target-sum/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-89",
    "title": "Interleaving String",
    "description": "Determine whether string $s_3$ is formed by an interleaving of strings $s_1$ and $s_2$.",
    "pattern": "2-D DP (String Matching)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/interleaving-string/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-90",
    "title": "Edit Distance",
    "description": "Find minimum insertions, deletions, or substitutions to transform one string into another.",
    "pattern": "2-D DP (String Matching)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/edit-distance/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-91",
    "title": "Burst Balloons",
    "description": "Maximize coins collected by strategically choosing the bursting order of interval balloons.",
    "pattern": "2-D DP (Interval DP)",
    "difficulty": "Hard",
    "category": "Dynamic Programming",
    "link": "https://leetcode.com/problems/burst-balloons/",
    "revision": "In 5 days",
    "timeSpent": "35m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-92",
    "title": "Insert Interval",
    "description": "Insert a new interval into a sorted list of non-overlapping intervals and merge collisions.",
    "pattern": "Intervals",
    "difficulty": "Medium",
    "category": "Intervals",
    "link": "https://leetcode.com/problems/insert-interval/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-93",
    "title": "Merge Intervals",
    "description": "Combine all overlapping intervals into non-overlapping spans by sorting on start times.",
    "pattern": "Intervals",
    "difficulty": "Medium",
    "category": "Intervals",
    "link": "https://leetcode.com/problems/merge-intervals/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-94",
    "title": "Non-overlapping Intervals",
    "description": "Find minimum intervals to remove to eliminate all overlaps using greedy earliest-end-time.",
    "pattern": "Intervals (Greedy)",
    "difficulty": "Medium",
    "category": "Intervals",
    "link": "https://leetcode.com/problems/non-overlapping-intervals/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-95",
    "title": "Minimum Number of Arrows to Burst Balloons",
    "description": "Determine minimum arrows shot along $x$-axis to pop balloons represented as intervals.",
    "pattern": "Intervals (Greedy)",
    "difficulty": "Medium",
    "category": "Intervals",
    "link": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-96",
    "title": "Single Number",
    "description": "Identify the unique element appearing once in an array where all others appear twice using XOR.",
    "pattern": "Bit Manipulation (XOR)",
    "difficulty": "Easy",
    "category": "Bit Manipulation",
    "link": "https://leetcode.com/problems/single-number/",
    "revision": "In 5 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-97",
    "title": "Counting Bits",
    "description": "Return array of set-bit counts ($1$s) for every number from $0$ up to $n$ in linear time.",
    "pattern": "Bit Manipulation / DP",
    "difficulty": "Easy",
    "category": "Bit Manipulation",
    "link": "https://leetcode.com/problems/counting-bits/",
    "revision": "In 5 days",
    "timeSpent": "15m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-98",
    "title": "Set Matrix Zeroes",
    "description": "If an element in an $m \\times n$ matrix is $0$, set its entire row and column to $0$ in-place.",
    "pattern": "Matrix (In-place Marking)",
    "difficulty": "Medium",
    "category": "Matrix",
    "link": "https://leetcode.com/problems/set-matrix-zeroes/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-99",
    "title": "Spiral Matrix",
    "description": "Return all elements of an $m \\times n$matrix in spiral order by contracting boundary pointers.",
    "pattern": "Matrix (Boundary Traversal)",
    "difficulty": "Medium",
    "category": "Matrix",
    "link": "https://leetcode.com/problems/spiral-matrix/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  },
  {
    "id": "dsa-100",
    "title": "Rotate Image",
    "description": "Rotate an $n \\times n$ 2D matrix 90 degrees clockwise in-place by transposing and reversing rows.",
    "pattern": "Matrix (Transpose & Reflect)",
    "difficulty": "Medium",
    "category": "Matrix",
    "link": "https://leetcode.com/problems/rotate-image/",
    "revision": "In 5 days",
    "timeSpent": "25m",
    "status": "Queued",
    "confidence": 0
  }
];
