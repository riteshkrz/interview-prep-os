-- =============================================================================
-- 45-Day Interview Prep OS: 20 Core System Design Specifications
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =============================================================================

-- 1. Ensure reference_links column exists in system_design_specs table
ALTER TABLE public.system_design_specs 
ADD COLUMN IF NOT EXISTS reference_links JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 2. Remove previous specifications
DELETE FROM public.system_design_specs;

-- 3. Insert the 20 Curated Production System Design Specifications
INSERT INTO public.system_design_specs (
    id, 
    title, 
    domain, 
    difficulty, 
    rubric, 
    reference_links, 
    revision_timing, 
    est_time_minutes, 
    order_index
)
VALUES
(
    'sd-1',
    'URL Shortener (e.g., TinyURL / Bitly)',
    'Hashing Algorithms & Persistent Key Generation (KGS)',
    'Medium',
    '{"scope":"100M writes/day, 1B reads/day (10:1 read ratio). Generate 7-character Base62 keys with 99.999% availability and p99 read redirection < 8ms.","api":"POST /api/v1/shorten { longUrl, customAlias?, expireAt? } -> { shortUrl, key }\nGET /{shortKey} -> HTTP 301 / 302 Redirect","dataModel":"Key Generation Service (KGS) pre-allocating Base62 key blocks in memory. Sharded PostgreSQL with Redis cache-aside (LRU).","deepDive":"Base62 vs MD5/Murmur3 collision handling; Bloom filters to eliminate cold-key database exhaustion; HTTP 301 (browser cached) vs 302 (server analytics) trade-offs."}'::jsonb,
    '[{"title":"System Design Primer: URL Shortener","url":"https://github.com/donnemartin/system-design-primer#design-pastebin"},{"title":"High Scalability: TinyURL Architecture","url":"http://highscalability.com"},{"title":"Engineering Monograph: Base62 & KGS Deep Dive","url":"#/blog?article=design-url-shortener-kgs"}]'::jsonb,
    'In 14 days',
    40,
    1
),
(
    'sd-2',
    'Distributed Key-Value Store (e.g., DynamoDB / Cassandra)',
    'Consistent Hashing & Quorum Consensus',
    'Hard',
    '{"scope":"Planetary-scale distributed key-value store with tunable consistency (AP/CP), multi-master writes, and sub-10ms p99 at 1M+ QPS.","api":"PUT /v1/kv/{key} { value, clientTimestamp } -> { versionToken, status }\nGET /v1/kv/{key}?consistency=QUORUM -> { value, vectorClock }","dataModel":"LSM-Trees (MemTable + SSTables) with commit logs on NVMe disk. Consistent hash ring with virtual nodes (vnodes). Vector clocks for versioning.","deepDive":"Quorum consensus math (R + W > N); Hinted handoff and read repair; Anti-entropy synchronization using Merkle trees; Gossip protocol for cluster membership."}'::jsonb,
    '[{"title":"Amazon Dynamo Paper: Highly Available Key-Value Store","url":"https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf"},{"title":"Apache Cassandra Architecture","url":"https://cassandra.apache.org/doc/latest/cassandra/architecture/"}]'::jsonb,
    'Day 16',
    50,
    2
),
(
    'sd-3',
    'Distributed Cache (e.g., Redis / Memcached Cluster)',
    'In-Memory Storage & Cache Invalidation',
    'Hard',
    '{"scope":"Sub-millisecond latency distributed cache cluster storing 500GB active working set, handling 500K ops/sec with horizontal peer-to-peer sharding.","api":"GET /cache/{key}\nSET /cache/{key} { value, ttlSeconds }\nDEL /cache/{key}","dataModel":"In-memory hash table with doubly-linked list for O(1) LRU eviction. Redis cluster with 16,384 hash slots.","deepDive":"Eviction policies (LRU, LFU, ARC); Invalidation strategies (Cache-aside, Write-through, Write-behind); Mitigating cache stampede (probabilistic early expiration XFetch, singleflight locks); Sentinel master-replica failover."}'::jsonb,
    '[{"title":"Redis Cluster Specification","url":"https://redis.io/topics/cluster-spec"},{"title":"Facebook: Scaling Memcached at Scale","url":"https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf"}]'::jsonb,
    'Day 18',
    45,
    3
),
(
    'sd-4',
    'Distributed Object Storage (e.g., AWS S3 / Google Cloud Storage)',
    'Blob Storage & Multipart Resumption',
    'Hard',
    '{"scope":"Store exabytes of unstructured blob data (images, videos, backups) with 99.999999999% (11 9s) durability and multi-region availability.","api":"PUT /buckets/{name}/objects/{key} (Stream or Multipart)\nPOST /buckets/{name}/objects/{key}?uploadId\nGET /buckets/{name}/objects/{key} (Byte-Range support)","dataModel":"Decoupled architecture: Metadata Tier (NoSQL/Spanner holding bucket ownership, ACLs, chunk mappings) + Storage Tier (Chunk servers holding 64MB immutable blocks with Reed-Solomon erasure coding).","deepDive":"Multipart upload chunking and resumption under flaky network conditions; Erasure coding (8+4 scheme) vs 3x replication cost analysis; Garbage collection of orphaned upload parts."}'::jsonb,
    '[{"title":"AWS S3 Architecture & Durability Model","url":"https://aws.amazon.com/s3/faqs/"},{"title":"Google Cloud Storage Architecture","url":"https://cloud.google.com/storage/docs"}]'::jsonb,
    'Day 20',
    50,
    4
),
(
    'sd-5',
    'Distributed Message Queue (e.g., Apache Kafka / RabbitMQ)',
    'Append-Only Logs & Consumer Groups',
    'Hard',
    '{"scope":"Ingest 5 million events/sec with strictly ordered partitions, durable replayability, multi-tenant consumer isolation, and consumer lag < 100ms.","api":"POST /v1/topics/{topic}/publish { partitionKey?, payload } -> { offset, partition }\nGET /v1/topics/{topic}/poll?group={groupId}&limit=100 -> [ { offset, payload } ]","dataModel":"Append-only disk commit logs segmented into 1GB rollups with sparse time-indexed and offset-indexed files.","deepDive":"Zero-copy disk streaming using Linux sendfile(); Consumer group rebalancing (Eager vs Cooperative Sticky Assignor); Idempotent producer sequence numbering; Log compaction for key-value state tables."}'::jsonb,
    '[{"title":"LinkedIn Kafka Architecture: A Distributed Commit Log","url":"https://kafka.apache.org/documentation/"},{"title":"Engineering Monograph: Zero-Copy & Consumer Lag","url":"#/blog?article=kafka-partition-rebalancing-consumer-lag"}]'::jsonb,
    'Day 22',
    50,
    5
),
(
    'sd-6',
    'Social Media News Feed (e.g., Twitter / Instagram / Facebook)',
    'Fan-Out Engine & Hybrid Timeline Aggregation',
    'Hard',
    '{"scope":"Real-time news feed for 300M DAU. Tweet creation latency < 50ms p95, timeline retrieval latency < 100ms p99.","api":"POST /v1/tweets { content, mediaUrls } -> { tweetId }\nGET /v1/feed?cursor={timestamp} -> { tweets: [], nextCursor }","dataModel":"Social graph in PostgreSQL/Neo4j; In-memory timeline cache per user using Redis Sorted Sets (ZSET) scored by reverse chronological timestamp.","deepDive":"Fan-out-on-write (push to follower feeds) vs Fan-out-on-read (pull at request time); The Celebrity/VIP Problem (hybrid push/pull routing); Feed ranking heuristics and pagination with 64-bit Snowflake IDs."}'::jsonb,
    '[{"title":"Twitter Timelines at Scale","url":"https://blog.x.com/engineering/en_us/topics/infrastructure/2013/timelines-at-scale"},{"title":"Instagram Feed Architecture","url":"https://instagram-engineering.com"}]'::jsonb,
    'Day 24',
    45,
    6
),
(
    'sd-7',
    'Real-Time Chat & Messaging Service (e.g., WhatsApp / Slack)',
    'Long-Lived Connections & Presence Management',
    'Hard',
    '{"scope":"2 billion users sending 100 billion messages daily. End-to-end encryption, 1:1 and group chats up to 1,000 members, read receipts, and sub-100ms message delivery.","api":"WebSocket Connection: wss://gateway.prep.os/chat\nClient Frame: { type: \"MSG\", to: \"usr_45\", payload: \"...\" }\nServer ACK: { type: \"ACK\", msgId: \"...\" }","dataModel":"Transient connection registry in Redis (UserID -> Gateway Pod IP); Message history in ScyllaDB/Cassandra partitioned by ((conversation_id, bucket), message_id).","deepDive":"Connection management at 500K concurrent WebSockets per node (Epoll/Netty); Ephemeral presence heartbeats via Redis Pub/Sub; Handling offline message queues; End-to-end Signal Double Ratchet key exchange."}'::jsonb,
    '[{"title":"WhatsApp 1M Connections Per Box","url":"https://blog.whatsapp.com"},{"title":"Discord: Storing Billions of Messages in ScyllaDB","url":"#/blog?article=discord-scylladb-migration-billions-messages"}]'::jsonb,
    'Tomorrow (Urgent)',
    45,
    7
),
(
    'sd-8',
    'Notification System (e.g., Firebase Cloud Messaging / Apple Push)',
    'Priority Queues & Gateway Decoupling',
    'Medium',
    '{"scope":"Deliver 10 billion notifications daily across iOS (APNs), Android (FCM), SMS (Twilio), and Email (SendGrid) with user opt-out preference enforcement.","api":"POST /v1/notifications/dispatch { recipientUserId, templateId, channel: \"AUTO|PUSH|SMS\", priority: \"HIGH|NORMAL\", payload: {} }","dataModel":"PostgreSQL for user notification settings and device tokens; Redis/RabbitMQ priority queues (High vs Bulk); Distributed deduplication store with 5-minute TTL window.","deepDive":"Decoupled gateway workers with circuit breakers; Rate limiting per recipient to prevent device notification fatigue; Third-party gateway throttling mitigation; Idempotent deduplication tokens."}'::jsonb,
    '[{"title":"Uber Notification Platform","url":"https://eng.uber.com/building-uber-notification-platform/"},{"title":"Apple Push Notification Network Protocol","url":"https://developer.apple.com/documentation/usernotifications"}]'::jsonb,
    'Day 26',
    40,
    8
),
(
    'sd-9',
    'Collaborative Document Editor (e.g., Google Docs / Notion)',
    'Conflict Resolution (OT vs. CRDTs)',
    'Hard',
    '{"scope":"Real-time concurrent rich-text editing with up to 50 active co-editors per document. Sub-50ms keystroke broadcast, automatic conflict resolution, offline synchronization.","api":"WebSocket wss://collab.prep.os/doc/{id}\nClient Frame: { type: \"OP\", clientSeq: 142, ops: [ { retain: 5 }, { insert: \"hello\" } ] }","dataModel":"Operational Transformation (OT) state machine with central server sequence sequencer, or CRDT (Yjs / Automerge) with unique Lamport character timestamps.","deepDive":"Operational Transformation (Transform function mechanics) vs Conflict-free Replicated Data Types (CRDTs); Undo/Redo state trees under concurrent branches; Snapshotting document history into S3."}'::jsonb,
    '[{"title":"Google Wave OT Protocol Whitepaper","url":"https://www.waveprotocol.org/whitepapers/operational-transform"},{"title":"Figma: How Multiplayer Works","url":"https://www.figma.com/blog/how-figmas-multiplayer-technology-works/"}]'::jsonb,
    'Day 28',
    50,
    9
),
(
    'sd-10',
    'Video Streaming Platform (e.g., YouTube / Netflix)',
    'Adaptive Bitrate Streaming (DASH/HLS) & Video Ingestion',
    'Hard',
    '{"scope":"Ingest 500 hours of video uploaded every minute. Support adaptive bitrate streaming (1080p, 4K, 720p, 480p) across 1 billion daily playback hours.","api":"POST /v1/videos/upload-session { fileSize, format } -> { uploadUrl, videoId }\nGET /v1/videos/{id}/manifest.m3u8 (HLS Playlist)","dataModel":"Video metadata in PostgreSQL; Raw and transcoded video segments in S3; Asynchronous encoding DAG tasks tracked in Celery/Temporal; Edge video segments cached in CDN.","deepDive":"Asynchronous transcoding pipeline with chunk-based parallel encoders; Adaptive Bitrate (ABR) algorithm (switching bitrates based on client buffer health); Real-time view count deduplication with Kafka and HyperLogLog."}'::jsonb,
    '[{"title":"Netflix Dynamic Video Streaming Architecture","url":"https://netflixtechblog.com"},{"title":"HLS Specification RFC 8216","url":"https://datatracker.ietf.org/doc/html/rfc8216"}]'::jsonb,
    'Day 30',
    50,
    10
),
(
    'sd-11',
    'Content Delivery Network (CDN)',
    'Anycast BGP Routing & Origin Shielding',
    'Hard',
    '{"scope":"Geographically distributed edge proxy caching static and dynamic web assets, reducing origin server load by 95% and lowering global latency from 300ms to < 20ms.","api":"GET /assets/{path} (Edge Cached)\nPOST /v1/purge { bucket, path, purgeType: \"TAG|URL|ALL\" } -> { purgedEdgeNodes: 240 }","dataModel":"In-memory and NVMe SSD edge tiered caches (Varnish / Nginx); Global edge configuration synchronized via Raft; Origin shield layer.","deepDive":"BGP Anycast routing vs GeoDNS routing trade-offs; Cache purge propagation within 150ms across 300 global PoPs; Origin shielding to prevent thundering herds on cache miss; Cache poisoning and TLS session resumption."}'::jsonb,
    '[{"title":"Cloudflare Edge Architecture","url":"https://blog.cloudflare.com/how-we-built-it/"},{"title":"Fastly Origin Shielding Guide","url":"https://www.fastly.com/documentation/guides/concepts/origin-shielding/"}]'::jsonb,
    'Day 31',
    45,
    11
),
(
    'sd-12',
    'Ride-Sharing / Dispatch Service (e.g., Uber / Lyft)',
    'Geospatial Indexing & Real-Time Driver Matching',
    'Hard',
    '{"scope":"Match millions of riders and drivers in real time with sub-50ms dispatch latency. Ingest 10M GPS coordinates per minute; handle dynamic surge pricing.","api":"POST /v1/drivers/location { driverId, lat, lng, bearing, status }\nPOST /v1/trips/request { riderId, pickupLat, pickupLng, destLat, destLng } -> { tripId, driverMatched }","dataModel":"Spatial indexing using Uber H3 hexagonal hierarchical spatial index (64-bit integer cells) or Google S2. In-memory spatial driver registry partitioned by H3 cell ID.","deepDive":"Comparing Quadtree, Geohash, and H3 hexagons; Ringpop consistent hash ring with SWIM gossip protocol; Dynamic surge pricing aggregation over resolution 7 parent cells; Concurrency lock during driver offer dispatch."}'::jsonb,
    '[{"title":"Uber H3 Spatial Indexing System","url":"https://www.uber.com/blog/h3/"},{"title":"Engineering Monograph: Uber Geospatial Architecture","url":"#/blog?article=uber-geospatial-partitioning-h3-hexagons"}]'::jsonb,
    'Day 32',
    50,
    12
),
(
    'sd-13',
    'Proximity Server (e.g., Yelp / Google Maps Places)',
    'Read-Heavy Spatial Queries & Radius Indexing',
    'Medium',
    '{"scope":"100M registered businesses, 50,000 search QPS globally. Sub-50ms response for \"find top-rated coffee shops within 5km of current latitude/longitude\".","api":"GET /v1/places/search?lat=37.7749&lng=-122.4194&radiusKm=5&category=food&sortBy=rating -> { places: [] }","dataModel":"Relational DB (PostgreSQL with PostGIS) as system of record; Geohash / 2D R-Tree spatial index; Read-cache in Redis keyed by Geohash prefixes (e.g. places:geohash:9q8yy).","deepDive":"Boundary search problem when search radius overlaps multiple Geohash cells; Precision tuning (6-character Geohash ≈ 1.2km × 0.6km); Tiered caching for popular metropolitan areas; Static spatial data vs dynamic moving objects."}'::jsonb,
    '[{"title":"Yelp Engineering: Geospatial Search","url":"https://engineeringblog.yelp.com"},{"title":"PostGIS Spatial Indexing Documentation","url":"https://postgis.net"}]'::jsonb,
    'Day 33',
    40,
    13
),
(
    'sd-14',
    'E-Commerce Flash Sale System (e.g., Amazon Prime Day / Ticketmaster)',
    'High-Concurrency Inventory Locks & Thundering Herd',
    'Hard',
    '{"scope":"100,000 units of a heavily discounted product sold out in 60 seconds with 2 million concurrent checkout requests. Zero overselling, strict FIFO fair queueing.","api":"POST /v1/flash-sale/reserve { itemId, userId, count: 1 } -> { reservationToken, expiresAt: 900 }\nPOST /v1/flash-sale/checkout { reservationToken, paymentMethod }","dataModel":"Redis clustered in-memory inventory counter with atomic Lua script; PostgreSQL order ledger; Kafka asynchronous checkout queue.","deepDive":"Preventing database meltdown using virtual waiting rooms (Token Bucket gatekeepers); Redis atomic Lua inventory decrement vs PostgreSQL SELECT ... FOR UPDATE; Distributed locking (Redlock) and lease timeouts; Compensating transactions on payment cancellation."}'::jsonb,
    '[{"title":"Amazon DynamoDB Flash Sale Architecture","url":"https://aws.amazon.com/blogs/database/"},{"title":"Martin Kleppmann on Redlock Critique","url":"https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html"}]'::jsonb,
    'Day 35',
    45,
    14
),
(
    'sd-15',
    'Payment Processing & Ledger System (e.g., Stripe / PayPal)',
    'Distributed Transactions, Idempotency & Double-Entry',
    'Hard',
    '{"scope":"Process billions of dollars in daily payments with exactly-once execution, zero double charges, strict double-entry ledger balancing, and PCI-DSS compliance.","api":"POST /v1/charges (Headers: Idempotency-Key: \"uuid\") { amount, currency, sourceAccount, destAccount } -> { chargeId, status: \"SUCCEEDED\" }","dataModel":"PostgreSQL strict ACID ledger with append-only entries (debits and credits equal zero); Redis idempotency key registry with 120s locks and cached JSON responses.","deepDive":"Idempotency keys with payload hash verification; Distributed transactions: Two-Phase Commit (2PC) vs Saga pattern with compensating transactions; Transactional outbox pattern for asynchronous webhook events; End-of-day bank reconciliation jobs."}'::jsonb,
    '[{"title":"Stripe Architecture: Designing Idempotent APIs","url":"https://stripe.com/blog/idempotency"},{"title":"Engineering Monograph: Stripe Payment Deduplication","url":"#/blog?article=stripe-idempotent-apis-distributed-deduplication"}]'::jsonb,
    'Day 36',
    50,
    15
),
(
    'sd-16',
    'Search Autocomplete / Typeahead (e.g., Google Search Bar)',
    'In-Memory Prefix Trees (Trie) & Offline Aggregation',
    'Medium',
    '{"scope":"Sub-20ms autocomplete suggestions for 5 billion searches per day. Return top 5 most relevant queries for any typed prefix (e.g., \"sys\" -> \"system design\").","api":"GET /v1/suggest?prefix=sys&limit=5 -> { suggestions: [ \"system design\", \"system architecture\", ... ] }","dataModel":"In-memory Trie where each node stores pre-computed top-5 suggestions; Offline MapReduce / Apache Spark analytics jobs computing 24-hour query frequencies; Redis L1 edge cache.","deepDive":"Trie partition sharding by prefix character range (A-E, F-K, etc.); Optimizing Trie node serialization to fit within memory; Handling trending/breaking search terms via real-time stream aggregation; Client-side keystroke debouncing."}'::jsonb,
    '[{"title":"Google Search Autocomplete Architecture","url":"https://research.google/pubs/pub45530/"},{"title":"Algorithms 4th Edition: Tries","url":"https://algs4.cs.princeton.edu/52trie/"}]'::jsonb,
    'Day 37',
    40,
    16
),
(
    'sd-17',
    'Web Crawler & Search Indexer (e.g., Googlebot)',
    'URL Frontier, Deduplication & Inverted Indexing',
    'Hard',
    '{"scope":"Crawl 10 billion web pages per month with strict politeness policies (respecting robots.txt and domain host rates), distributed deduplication, and inverted index generation.","api":"POST /v1/frontier/seed { urls: [] }\nGET /v1/frontier/next-fetch-batch?workerId={id} -> [ { url, crawlDelayMs } ]","dataModel":"URL Frontier organized into Politeness Queues (one per target domain) and Priority Queues; Content deduplication via Bloom filters and SimHash 64-bit fingerprints; Inverted index in Bigtable/Lucene.","deepDive":"URL Frontier architecture (Mercator model); DNS resolver bottleneck mitigation via local caching; Distributed crawling traps and cyclic link detection; MapReduce indexing pipeline building postings lists."}'::jsonb,
    '[{"title":"Mercator: A Scalable, Extensible Web Crawler","url":"https://www.cs.cornell.edu/courses/cs4320/2012fa/crawl-paper.pdf"},{"title":"The Anatomy of a Large-Scale Web Search Engine (Google)","url":"https://infolab.stanford.edu/~backrub/google.html"}]'::jsonb,
    'Day 38',
    50,
    17
),
(
    'sd-18',
    'API Rate Limiter & Gateway',
    'Token Bucket / Sliding Window & Edge Filtering',
    'Medium',
    '{"scope":"Cloud-native API gateway processing 500,000 RPS with sub-millisecond rate checking overhead, multi-tenant tiered quotas (free, pro, enterprise), and DDoS protection.","api":"HTTP Middleware Inspection: Authorization: Bearer <key> -> Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, 429 Too Many Requests","dataModel":"Redis cluster with in-memory sliding window counters; Atomic Redis Lua scripts; Local memory L1 cache inside Envoy proxy pods with periodic batch synchronization.","deepDive":"Detailed comparison of 4 algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, and Sliding Window Counter; Handling Redis cluster failover (Fail-Open vs Fail-Closed policy); Edge throttling at Cloudflare/Envoy vs core service throttling."}'::jsonb,
    '[{"title":"Envoy Proxy Rate Limiting Architecture","url":"https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/other_features/global_rate_limiting"},{"title":"Engineering Monograph: Distributed Rate Limiting","url":"#/blog?article=distributed-rate-limiter-sliding-window"}]'::jsonb,
    'Day 39',
    40,
    18
),
(
    'sd-19',
    'Metrics & Logging Monitoring System (e.g., Datadog / Prometheus)',
    'Time-Series Database (TSDB) & Inverted Metric Index',
    'Hard',
    '{"scope":"Ingest 100 million metric data points per minute from 50,000 servers. Sub-second dashboards for p95/p99 query latency, automated alerting on anomalies, 1-year retention.","api":"POST /api/v1/metrics/ingest [ { metric: \"cpu.utilization\", tags: { host: \"i-98\", env: \"prod\" }, timestamp: 1718000000, val: 84.2 } ]\nPOST /api/v1/query { expr: \"avg_over_time(cpu.utilization[5m])\" }","dataModel":"Time-series database (TSDB) using Gorilla delta-of-delta timestamp and XOR floating-point compression; Inverted index for high-cardinality tag lookups; ClickHouse for log aggregation.","deepDive":"Ingestion pipeline buffering with Kafka; Gorilla compression algorithm compressing 16-byte datapoints to 1.37 bytes; Downsampling rollups (10s raw -> 1m -> 1hr); Push (Datadog agent) vs Pull (Prometheus scraping) architectural trade-offs."}'::jsonb,
    '[{"title":"Facebook Gorilla: A Fast, Scalable, In-Memory Time Series Database","url":"https://www.vldb.org/pvldb/vol8/p1816-teller.pdf"},{"title":"Prometheus Storage Engine Architecture","url":"https://prometheus.io/docs/prometheus/latest/storage/"}]'::jsonb,
    'Day 41',
    50,
    19
),
(
    'sd-20',
    'Distributed Task Scheduler / Job Queue (e.g., Celery / AWS Step Functions)',
    'Two-Tier Scheduling & Worker Heartbeat Leases',
    'Hard',
    '{"scope":"Schedule and execute millions of asynchronous background tasks and recurring cron jobs across 1,000 worker nodes with delayed queues, priority routing, and zero lost jobs.","api":"POST /v1/tasks/schedule { taskType, payload, runAtTimestamp?, retryPolicy: { maxRetries: 5, backoff: \"EXPONENTIAL\" } } -> { taskId, status: \"SCHEDULED\" }\nGET /v1/tasks/{id}/status","dataModel":"Task metadata in PostgreSQL with state machine (PENDING, RUNNING, COMPLETED, FAILED); Delayed queues using Redis Sorted Sets scored by run_at UNIX timestamp; Heartbeat lease renewals in Redis.","deepDive":"Worker crash detection and lease stealing; Distributed priority scheduling (Two-Tier scheduler); Preventing thundering herd upon timer expiration; State machines for complex multi-step workflow DAGs (Sagas / Step Functions)."}'::jsonb,
    '[{"title":"Uber Cherami: Distributed Task Queue","url":"https://eng.uber.com/cherami-message-queue-system/"},{"title":"Temporal Architecture & Execution Model","url":"https://docs.temporal.io/evaluate/architecture"}]'::jsonb,
    'Day 43',
    50,
    20
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    difficulty = EXCLUDED.difficulty,
    rubric = EXCLUDED.rubric,
    reference_links = EXCLUDED.reference_links,
    revision_timing = EXCLUDED.revision_timing,
    est_time_minutes = EXCLUDED.est_time_minutes,
    order_index = EXCLUDED.order_index,
    updated_at = timezone('utc'::text, now());
