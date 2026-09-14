-- =============================================================================
-- 45-Day Interview Prep OS - Database-Driven Questions Catalog & Progress
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =============================================================================

-- 1. Create DSA Problems Table
CREATE TABLE IF NOT EXISTS public.dsa_problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    pattern TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    category TEXT NOT NULL,
    link TEXT,
    revision_timing TEXT DEFAULT 'In 7 days',
    est_time_minutes INTEGER DEFAULT 30,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Create System Design Specs Table
CREATE TABLE IF NOT EXISTS public.system_design_specs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Medium', 'Hard')),
    rubric JSONB NOT NULL DEFAULT '{}'::jsonb,
    reference_links JSONB NOT NULL DEFAULT '[]'::jsonb,
    revision_timing TEXT DEFAULT 'In 14 days',
    est_time_minutes INTEGER DEFAULT 45,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. Create User Problem Progress Table
CREATE TABLE IF NOT EXISTS public.user_problem_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('DSA', 'SYSTEM_DESIGN')),
    status TEXT NOT NULL DEFAULT 'Queued' CHECK (status IN ('Queued', 'In Progress', 'Mastered', 'To Revise')),
    confidence_stars INTEGER NOT NULL DEFAULT 0 CHECK (confidence_stars BETWEEN 0 AND 5),
    time_spent_minutes INTEGER DEFAULT 0,
    notes TEXT,
    code_solution TEXT,
    last_practiced_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    CONSTRAINT user_problem_progress_user_problem_key UNIQUE (user_id, problem_id)
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_dsa_problems_order ON public.dsa_problems(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_dsa_problems_category ON public.dsa_problems(category);
CREATE INDEX IF NOT EXISTS idx_system_specs_order ON public.system_design_specs(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_problem_progress(status);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.dsa_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_design_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_problem_progress ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Catalog tables: Publicly readable by all users (anonymous and authenticated)
DROP POLICY IF EXISTS "Public can view DSA problems" ON public.dsa_problems;
CREATE POLICY "Public can view DSA problems"
    ON public.dsa_problems FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can view System Design specs" ON public.system_design_specs;
CREATE POLICY "Public can view System Design specs"
    ON public.system_design_specs FOR SELECT
    TO anon, authenticated
    USING (true);

-- User Progress: Strictly isolated to each authenticated user
DROP POLICY IF EXISTS "Users can read own progress" ON public.user_problem_progress;
CREATE POLICY "Users can read own progress"
    ON public.user_problem_progress FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_problem_progress;
CREATE POLICY "Users can insert own progress"
    ON public.user_problem_progress FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_problem_progress;
CREATE POLICY "Users can update own progress"
    ON public.user_problem_progress FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own progress" ON public.user_problem_progress;
CREATE POLICY "Users can delete own progress"
    ON public.user_problem_progress FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 7. Add to Realtime Publication so live edits in Supabase reflect in app
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'dsa_problems'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.dsa_problems;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'system_design_specs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.system_design_specs;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping publication registration: %', SQLERRM;
END $$;

-- =============================================================================
-- SEED DATA: 20 Curated Production System Design Specifications
-- =============================================================================
INSERT INTO public.system_design_specs (id, title, domain, difficulty, rubric, reference_links, revision_timing, est_time_minutes, order_index)
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

-- =============================================================================
-- SEED DATA: 100 High-Frequency Curated DSA Problems
-- =============================================================================
INSERT INTO public.dsa_problems (
    id, title, description, pattern, difficulty, category, link, revision_timing, est_time_minutes, order_index
)
VALUES
(
    'dsa-1',
    'Two Sum',
    'Find two indices whose values sum to a specific target using a hash map for $O(n)$ lookup.',
    'Arrays & Hashing',
    'Easy',
    'Arrays & Hashing',
    'https://leetcode.com/problems/two-sum/',
    'In 14 days',
    15,
    1
),
(
    'dsa-2',
    'Valid Anagram',
    'Determine if two strings are permutations of each other using frequency counts.',
    'Arrays & Hashing',
    'Easy',
    'Arrays & Hashing',
    'https://leetcode.com/problems/valid-anagram/',
    'In 14 days',
    15,
    2
),
(
    'dsa-3',
    'Group Anagrams',
    'Group strings that share the same character frequencies using sorted keys or tuples.',
    'Arrays & Hashing',
    'Medium',
    'Arrays & Hashing',
    'https://leetcode.com/problems/group-anagrams/',
    'In 14 days',
    25,
    3
),
(
    'dsa-4',
    'Top K Frequent Elements',
    'Identify the $k$ most frequent numbers using a min-heap or bucket sort in linear time.',
    'Arrays & Hashing',
    'Medium',
    'Arrays & Hashing',
    'https://leetcode.com/problems/top-k-frequent-elements/',
    'In 14 days',
    25,
    4
),
(
    'dsa-5',
    'Product of Array Except Self',
    'Calculate prefix and suffix products for each index without using division in $O(1)$ extra space.',
    'Arrays & Hashing',
    'Medium',
    'Arrays & Hashing',
    'https://leetcode.com/problems/product-of-array-except-self/',
    'In 14 days',
    25,
    5
),
(
    'dsa-6',
    'Longest Consecutive Sequence',
    'Find the length of the longest streak of consecutive numbers using a hash set in $O(n)$ time.',
    'Arrays & Hashing',
    'Medium',
    'Arrays & Hashing',
    'https://leetcode.com/problems/longest-consecutive-sequence/',
    'In 14 days',
    25,
    6
),
(
    'dsa-7',
    'Subarray Sum Equals K',
    'Count continuous subarrays summing to $k$ by tracking prefix sum frequencies in a hash map.',
    'Prefix Sum',
    'Medium',
    'Arrays & Hashing',
    'https://leetcode.com/problems/subarray-sum-equals-k/',
    'In 14 days',
    25,
    7
),
(
    'dsa-8',
    'Next Permutation',
    'Rearrange numbers into the lexicographically next greater permutation in-place.',
    'Arrays & Math',
    'Medium',
    'Arrays & Hashing',
    'https://leetcode.com/problems/next-permutation/',
    'In 14 days',
    25,
    8
),
(
    'dsa-9',
    'First Missing Positive',
    'Find the smallest missing positive integer in $O(n)$time and $O(1)$space using cyclic placement.',
    'Cyclic Sort / Arrays',
    'Hard',
    'Arrays & Hashing',
    'https://leetcode.com/problems/first-missing-positive/',
    'In 14 days',
    35,
    9
),
(
    'dsa-10',
    'Valid Palindrome',
    'Verify if a string reads identically forwards and backwards ignoring non-alphanumeric characters.',
    'Two Pointers',
    'Easy',
    'Two Pointers',
    'https://leetcode.com/problems/valid-palindrome/',
    'In 14 days',
    15,
    10
),
(
    'dsa-11',
    'Two Sum II - Input Array Is Sorted',
    'Find two numbers summing to target in a 1-indexed sorted array using inward-moving pointers.',
    'Two Pointers',
    'Medium',
    'Two Pointers',
    'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    'In 14 days',
    25,
    11
),
(
    'dsa-12',
    '3Sum',
    'Find all unique triplets summing to zero by sorting the array and running two-pointer scans.',
    'Two Pointers',
    'Medium',
    'Two Pointers',
    'https://leetcode.com/problems/3sum/',
    'In 14 days',
    25,
    12
),
(
    'dsa-13',
    'Container With Most Water',
    'Maximize water trapped between two vertical lines by moving the pointer with the smaller height.',
    'Two Pointers',
    'Medium',
    'Two Pointers',
    'https://leetcode.com/problems/container-with-most-water/',
    'In 14 days',
    25,
    13
),
(
    'dsa-14',
    'Trapping Rain Water',
    'Compute total rainwater trapped across elevation bars using two pointers or prefix maximums.',
    'Two Pointers / Monotonic Stack',
    'Hard',
    'Two Pointers',
    'https://leetcode.com/problems/trapping-rain-water/',
    'In 14 days',
    35,
    14
),
(
    'dsa-15',
    'Best Time to Buy and Sell Stock',
    'Find maximum profit from a single buy-sell transaction by tracking the running minimum price.',
    'Sliding Window',
    'Easy',
    'Sliding Window',
    'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    'In 7 days',
    15,
    15
),
(
    'dsa-16',
    'Longest Substring Without Repeating Characters',
    'Find length of longest substring without duplicates by expanding/contracting a dynamic window.',
    'Sliding Window',
    'Medium',
    'Sliding Window',
    'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    'In 7 days',
    25,
    16
),
(
    'dsa-17',
    'Longest Repeating Character Replacement',
    'Find longest substring with identical letters achievable by replacing at most $k$characters.',
    'Sliding Window',
    'Medium',
    'Sliding Window',
    'https://leetcode.com/problems/longest-repeating-character-replacement/',
    'In 7 days',
    25,
    17
),
(
    'dsa-18',
    'Permutation in String',
    'Determine if string $s_2$ contains a substring that is an exact permutation of string $s_1$.',
    'Sliding Window',
    'Medium',
    'Sliding Window',
    'https://leetcode.com/problems/permutation-in-string/',
    'In 7 days',
    25,
    18
),
(
    'dsa-19',
    'Minimum Window Substring',
    'Find the smallest substring of $s$containing every character from $t$using frequency matching.',
    'Sliding Window',
    'Hard',
    'Sliding Window',
    'https://leetcode.com/problems/minimum-window-substring/',
    'In 7 days',
    35,
    19
),
(
    'dsa-20',
    'Sliding Window Maximum',
    'Return the maximum element in each sliding window of size $k$ using a monotonic deque.',
    'Sliding Window / Deque',
    'Hard',
    'Sliding Window',
    'https://leetcode.com/problems/sliding-window-maximum/',
    'In 7 days',
    35,
    20
),
(
    'dsa-21',
    'Valid Parentheses',
    'Validate balanced opening and closing bracket pairs using a Last-In-First-Out stack.',
    'Stack',
    'Easy',
    'Stack',
    'https://leetcode.com/problems/valid-parentheses/',
    'In 7 days',
    15,
    21
),
(
    'dsa-22',
    'Min Stack',
    'Design a stack supporting push, pop, top, and retrieving the minimum element in $O(1)$ time.',
    'Stack Design',
    'Medium',
    'Stack',
    'https://leetcode.com/problems/min-stack/',
    'In 7 days',
    25,
    22
),
(
    'dsa-23',
    'Evaluate Reverse Polish Notation',
    'Evaluate arithmetic expressions written in postfix notation using an operand stack.',
    'Stack',
    'Medium',
    'Stack',
    'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    'In 7 days',
    25,
    23
),
(
    'dsa-24',
    'Daily Temperatures',
    'Calculate days until a warmer temperature for each day using a decreasing monotonic stack.',
    'Monotonic Stack',
    'Medium',
    'Stack',
    'https://leetcode.com/problems/daily-temperatures/',
    'In 7 days',
    25,
    24
),
(
    'dsa-25',
    'Largest Rectangle in Histogram',
    'Compute the largest rectangular area in a histogram using an increasing monotonic stack.',
    'Monotonic Stack',
    'Hard',
    'Stack',
    'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    'In 7 days',
    35,
    25
),
(
    'dsa-26',
    'Basic Calculator',
    'Evaluate mathematical string expressions containing +, -, and parentheses using a stack.',
    'Stack / Parsing',
    'Hard',
    'Stack',
    'https://leetcode.com/problems/basic-calculator/',
    'In 7 days',
    35,
    26
),
(
    'dsa-27',
    'Binary Search',
    'Locate the index of a target value within an ascending sorted array in $O(\log n)$time.',
    'Binary Search',
    'Easy',
    'Binary Search',
    'https://leetcode.com/problems/binary-search/',
    'In 7 days',
    15,
    27
),
(
    'dsa-28',
    'Search a 2D Matrix',
    'Search for a target in an $m \times n$matrix with row-sorted properties by treating it as 1D.',
    'Binary Search',
    'Medium',
    'Binary Search',
    'https://leetcode.com/problems/search-a-2d-matrix/',
    'In 7 days',
    25,
    28
),
(
    'dsa-29',
    'Find Minimum in Rotated Sorted Array',
    'Find the inflection/minimum point in a sorted array rotated between 1 and $n$ times.',
    'Binary Search',
    'Medium',
    'Binary Search',
    'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    'In 7 days',
    25,
    29
),
(
    'dsa-30',
    'Search in Rotated Sorted Array',
    'Locate target in a rotated sorted array by determining which half is strictly ordered.',
    'Binary Search',
    'Medium',
    'Binary Search',
    'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    'In 7 days',
    25,
    30
),
(
    'dsa-31',
    'Koko Eating Bananas',
    'Find the minimum integer eating speed $k$ to finish all bananas within $h$hours.',
    'Binary Search on Answer',
    'Medium',
    'Binary Search',
    'https://leetcode.com/problems/koko-eating-bananas/',
    'In 10 days',
    25,
    31
),
(
    'dsa-32',
    'Time Based Key-Value Store',
    'Store key-value pairs with timestamps and retrieve values at or before a given timestamp.',
    'Binary Search / Design',
    'Medium',
    'Binary Search',
    'https://leetcode.com/problems/time-based-key-value-store/',
    'In 10 days',
    25,
    32
),
(
    'dsa-33',
    'Median of Two Sorted Arrays',
    'Find the combined median of two sorted arrays in $O(\log(\min(m, n)))$using binary partition.',
    'Binary Search',
    'Hard',
    'Binary Search',
    'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    'In 10 days',
    35,
    33
),
(
    'dsa-34',
    'Reverse Linked List',
    'Invert the direction of pointers in a singly-linked list iteratively or recursively.',
    'Linked List',
    'Easy',
    'Linked List',
    'https://leetcode.com/problems/reverse-linked-list/',
    'In 10 days',
    15,
    34
),
(
    'dsa-35',
    'Merge Two Sorted Lists',
    'Combine two sorted linked lists into a single continuous sorted list using dummy head nodes.',
    'Linked List',
    'Easy',
    'Linked List',
    'https://leetcode.com/problems/merge-two-sorted-lists/',
    'In 10 days',
    15,
    35
),
(
    'dsa-36',
    'Linked List Cycle',
    'Detect if a cycle exists in a linked list using Floyd''s slow and fast pointer algorithm.',
    'Fast & Slow Pointers',
    'Easy',
    'Linked List',
    'https://leetcode.com/problems/linked-list-cycle/',
    'In 10 days',
    15,
    36
),
(
    'dsa-37',
    'Reorder List',
    'Reorder a list to alternating first and last elements: $L_0 \to L_n \to L_1 \to L_{n-1} \dots$.',
    'Linked List',
    'Medium',
    'Linked List',
    'https://leetcode.com/problems/reorder-list/',
    'In 10 days',
    25,
    37
),
(
    'dsa-38',
    'Remove Nth Node From End of List',
    'Delete the $n$-th node from the tail in a single pass using two offset pointers.',
    'Fast & Slow Pointers',
    'Medium',
    'Linked List',
    'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    'In 10 days',
    25,
    38
),
(
    'dsa-39',
    'Copy List with Random Pointer',
    'Create a deep copy of a list with arbitrary random pointers via hash map or node interleaving.',
    'Linked List / Hash Map',
    'Medium',
    'Linked List',
    'https://leetcode.com/problems/copy-list-with-random-pointer/',
    'In 10 days',
    25,
    39
),
(
    'dsa-40',
    'LRU Cache',
    'Implement an eviction cache supporting $O(1)$ get and put using a doubly-linked list and map.',
    'Doubly Linked List / Hash Map',
    'Medium',
    'Linked List',
    'https://leetcode.com/problems/lru-cache/',
    'In 10 days',
    25,
    40
),
(
    'dsa-41',
    'Merge k Sorted Lists',
    'Merge $k$ sorted linked lists into one sorted list using a min-heap or divide-and-conquer.',
    'Heap / Divide & Conquer',
    'Hard',
    'Linked List',
    'https://leetcode.com/problems/merge-k-sorted-lists/',
    'In 10 days',
    35,
    41
),
(
    'dsa-42',
    'Reverse Nodes in k-Group',
    'Reverse nodes of a linked list $k$ at a time, leaving remaining sub-groups unmodified.',
    'Linked List',
    'Hard',
    'Linked List',
    'https://leetcode.com/problems/reverse-nodes-in-k-group/',
    'In 10 days',
    35,
    42
),
(
    'dsa-43',
    'Invert Binary Tree',
    'Swap left and right child nodes for every node in a binary tree recursively.',
    'Trees (DFS)',
    'Easy',
    'Trees',
    'https://leetcode.com/problems/invert-binary-tree/',
    'In 10 days',
    15,
    43
),
(
    'dsa-44',
    'Maximum Depth of Binary Tree',
    'Calculate the maximum number of nodes along the longest path from root to leaf node.',
    'Trees (DFS/BFS)',
    'Easy',
    'Trees',
    'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    'In 10 days',
    15,
    44
),
(
    'dsa-45',
    'Diameter of Binary Tree',
    'Find the longest path between any two nodes in a tree, measured by edge count.',
    'Trees (DFS)',
    'Easy',
    'Trees',
    'https://leetcode.com/problems/diameter-of-binary-tree/',
    'In 10 days',
    15,
    45
),
(
    'dsa-46',
    'Same Tree',
    'Check if two binary trees are structurally identical and share matching node values.',
    'Trees (DFS)',
    'Easy',
    'Trees',
    'https://leetcode.com/problems/same-tree/',
    'In 10 days',
    15,
    46
),
(
    'dsa-47',
    'Lowest Common Ancestor of a BST',
    'Locate the deepest shared ancestor node of two given targets utilizing BST ordering.',
    'BST Traversal',
    'Medium',
    'Trees',
    'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    'In 10 days',
    25,
    47
),
(
    'dsa-48',
    'Binary Tree Level Order Traversal',
    'Return node values level-by-level from left to right using a breadth-first queue.',
    'Trees (BFS)',
    'Medium',
    'Trees',
    'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    'In 10 days',
    25,
    48
),
(
    'dsa-49',
    'Validate Binary Search Tree',
    'Verify if every node strictly adheres to left-child-smaller and right-child-greater bounds.',
    'BST Traversal',
    'Medium',
    'Trees',
    'https://leetcode.com/problems/validate-binary-search-tree/',
    'In 10 days',
    25,
    49
),
(
    'dsa-50',
    'Kth Smallest Element in a BST',
    'Find the $k$-th smallest value in a BST using an iterative or recursive inorder traversal.',
    'BST (Inorder)',
    'Medium',
    'Trees',
    'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
    'In 10 days',
    25,
    50
),
(
    'dsa-51',
    'Construct Binary Tree from Preorder and Inorder Traversal',
    'Rebuild a binary tree from preorder root order and inorder sub-tree partition boundaries.',
    'Tree Reconstruction',
    'Medium',
    'Trees',
    'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
    'In 10 days',
    25,
    51
),
(
    'dsa-52',
    'Binary Tree Maximum Path Sum',
    'Find the non-empty path through any sequence of nodes yielding the largest sum.',
    'Trees (DFS Post-order)',
    'Hard',
    'Trees',
    'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    'In 10 days',
    35,
    52
),
(
    'dsa-53',
    'Serialize and Deserialize Binary Tree',
    'Convert a binary tree to a serialized string format and reliably reconstruct it back.',
    'Tree Traversal / Design',
    'Hard',
    'Trees',
    'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    'In 10 days',
    35,
    53
),
(
    'dsa-54',
    'Implement Trie (Prefix Tree)',
    'Build an $N$-ary prefix tree supporting efficient insert, search, and startsWith.',
    'Trie Design',
    'Medium',
    'Trie',
    'https://leetcode.com/problems/implement-trie-prefix-tree/',
    'In 10 days',
    25,
    54
),
(
    'dsa-55',
    'Design Add and Search Words Data Structure',
    'Implement a word dictionary trie supporting wildcard character . pattern searches.',
    'Trie / Backtracking',
    'Medium',
    'Trie',
    'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
    'In 10 days',
    25,
    55
),
(
    'dsa-56',
    'Word Search II',
    'Find all words from a dictionary present on a 2D board using a combined Trie and DFS.',
    'Trie / Matrix Backtracking',
    'Hard',
    'Trie',
    'https://leetcode.com/problems/word-search-ii/',
    'In 10 days',
    35,
    56
),
(
    'dsa-57',
    'Kth Largest Element in an Array',
    'Retrieve the $k$-th largest item in an unsorted list via min-heap or quickselect partition.',
    'Min-Heap / Quickselect',
    'Medium',
    'Heap',
    'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    'In 10 days',
    25,
    57
),
(
    'dsa-58',
    'Task Scheduler',
    'Find least CPU intervals needed to run tasks separated by cooling period $n$using greedy frequency.',
    'Max-Heap / Greedy',
    'Medium',
    'Heap',
    'https://leetcode.com/problems/task-scheduler/',
    'In 10 days',
    25,
    58
),
(
    'dsa-59',
    'Design Twitter',
    'Implement posting tweets, following users, and pulling 10 most recent feeds using heaps.',
    'Heap / System Design',
    'Medium',
    'Heap',
    'https://leetcode.com/problems/design-twitter/',
    'In 10 days',
    25,
    59
),
(
    'dsa-60',
    'Find Median from Data Stream',
    'Maintain running real-time median of incoming continuous numbers using balanced heaps.',
    'Two Heaps',
    'Hard',
    'Heap',
    'https://leetcode.com/problems/find-median-from-data-stream/',
    'In 10 days',
    35,
    60
),
(
    'dsa-61',
    'Subsets',
    'Generate the complete power set of unique elements using state backtracking.',
    'Backtracking',
    'Medium',
    'Backtracking',
    'https://leetcode.com/problems/subsets/',
    'In 5 days',
    25,
    61
),
(
    'dsa-62',
    'Combination Sum',
    'Find all distinct candidate combinations summing to target with unlimited element reuse.',
    'Backtracking',
    'Medium',
    'Backtracking',
    'https://leetcode.com/problems/combination-sum/',
    'In 5 days',
    25,
    62
),
(
    'dsa-63',
    'Permutations',
    'Generate all distinct complete orderings of an array of distinct integer values.',
    'Backtracking',
    'Medium',
    'Backtracking',
    'https://leetcode.com/problems/permutations/',
    'In 5 days',
    25,
    63
),
(
    'dsa-64',
    'Word Search',
    'Determine if a target string exists along horizontally/vertically adjacent cells in a grid.',
    'Matrix Backtracking',
    'Medium',
    'Backtracking',
    'https://leetcode.com/problems/word-search/',
    'In 5 days',
    25,
    64
),
(
    'dsa-65',
    'Palindrome Partitioning',
    'Partition a string such that every substring in each partition is a valid palindrome.',
    'Backtracking',
    'Medium',
    'Backtracking',
    'https://leetcode.com/problems/palindrome-partitioning/',
    'In 5 days',
    25,
    65
),
(
    'dsa-66',
    'N-Queens',
    'Place $n$ non-attacking queens on an $n \times n$chessboard tracking column and diagonal attacks.',
    'Backtracking',
    'Hard',
    'Backtracking',
    'https://leetcode.com/problems/n-queens/',
    'In 5 days',
    35,
    66
),
(
    'dsa-67',
    'Number of Islands',
    'Count distinct connected components of ''1''s surrounded by water in a 2D binary grid.',
    'Graph (Matrix BFS/DFS)',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/number-of-islands/',
    'In 5 days',
    25,
    67
),
(
    'dsa-68',
    'Clone Graph',
    'Construct a deep copy of a connected, undirected graph with unique node references.',
    'Graph (BFS/DFS)',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/clone-graph/',
    'In 5 days',
    25,
    68
),
(
    'dsa-69',
    'Pacific Atlantic Water Flow',
    'Find cells that can flow water to both Pacific and Atlantic oceans via reverse ocean searches.',
    'Graph (Multi-source BFS/DFS)',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/pacific-atlantic-water-flow/',
    'In 5 days',
    25,
    69
),
(
    'dsa-70',
    'Rotting Oranges',
    'Determine minutes until all fresh oranges rot in a grid using a multi-source BFS queue.',
    'Graph (Multi-source BFS)',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/rotting-oranges/',
    'In 5 days',
    25,
    70
),
(
    'dsa-71',
    'Course Schedule',
    'Detect if circular dependencies exist in prerequisite course pairs using cycle detection.',
    'Graph (Cycle Detection)',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/course-schedule/',
    'In 5 days',
    25,
    71
),
(
    'dsa-72',
    'Course Schedule II',
    'Return a valid linear order to finish all courses using Kahn''s topological sort algorithm.',
    'Topological Sort',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/course-schedule-ii/',
    'In 5 days',
    25,
    72
),
(
    'dsa-73',
    'Redundant Connection',
    'Find an edge that can be removed to turn a cyclic graph into a tree using Union-Find.',
    'Disjoint Set Union (DSU)',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/redundant-connection/',
    'In 5 days',
    25,
    73
),
(
    'dsa-74',
    'Network Delay Time',
    'Calculate time for all nodes to receive a signal using Dijkstra''s shortest path algorithm.',
    'Graph (Dijkstra)',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/network-delay-time/',
    'In 5 days',
    25,
    74
),
(
    'dsa-75',
    'Cheapest Flights Within K Stops',
    'Find cheapest travel route between source and destination with at most $k$intermediate stops.',
    'Graph (Bellman-Ford / BFS)',
    'Medium',
    'Graphs',
    'https://leetcode.com/problems/cheapest-flights-within-k-stops/',
    'In 5 days',
    25,
    75
),
(
    'dsa-76',
    'Word Ladder',
    'Find length of shortest transformation sequence from start to end word mutating one char at a time.',
    'Graph (Bidirectional BFS)',
    'Hard',
    'Graphs',
    'https://leetcode.com/problems/word-ladder/',
    'In 5 days',
    35,
    76
),
(
    'dsa-77',
    'Climbing Stairs',
    'Count distinct combinations to reach the top of an $n$-step staircase taking 1 or 2 steps.',
    '1-D DP (Fibonacci)',
    'Easy',
    'Dynamic Programming',
    'https://leetcode.com/problems/climbing-stairs/',
    'In 5 days',
    15,
    77
),
(
    'dsa-78',
    'House Robber',
    'Maximize stolen wealth without alerting police by avoiding robbing adjacent houses.',
    '1-D DP',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/house-robber/',
    'In 5 days',
    25,
    78
),
(
    'dsa-79',
    'House Robber II',
    'Maximize stolen wealth when houses are arranged in a circle, making the first and last adjacent.',
    '1-D DP (Circular)',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/house-robber-ii/',
    'In 5 days',
    25,
    79
),
(
    'dsa-80',
    'Longest Palindromic Substring',
    'Find the longest continuous substring in $s$ that forms a symmetric palindrome.',
    '1-D DP / Expand Center',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/longest-palindromic-substring/',
    'In 5 days',
    25,
    80
),
(
    'dsa-81',
    'Coin Change',
    'Compute minimum coins required to form a given amount using an unbounded knapsack approach.',
    '1-D DP (Unbounded Knapsack)',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/coin-change/',
    'In 5 days',
    25,
    81
),
(
    'dsa-82',
    'Maximum Subarray',
    'Find the contiguous subarray having the largest sum using Kadane''s single-pass dynamic model.',
    'Kadane''s Algorithm / 1-D DP',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/maximum-subarray/',
    'In 5 days',
    25,
    82
),
(
    'dsa-83',
    'Maximum Product Subarray',
    'Find contiguous subarray with largest product, tracking both running min and max products.',
    '1-D DP (State Tracking)',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/maximum-product-subarray/',
    'In 5 days',
    25,
    83
),
(
    'dsa-84',
    'Word Break',
    'Determine if a string can be segmented into space-separated dictionary words using DP.',
    '1-D DP',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/word-break/',
    'In 5 days',
    25,
    84
),
(
    'dsa-85',
    'Longest Increasing Subsequence',
    'Find length of longest strictly increasing subsequence in $O(n \log n)$ via patience sorting.',
    '1-D DP / Binary Search',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/longest-increasing-subsequence/',
    'In 5 days',
    25,
    85
),
(
    'dsa-86',
    'Unique Paths',
    'Count unique paths from top-left to bottom-right of an $m \times n$ grid moving only down or right.',
    '2-D DP (Grid)',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/unique-paths/',
    'In 5 days',
    25,
    86
),
(
    'dsa-87',
    'Longest Common Subsequence',
    'Find length of the longest subsequence shared across two input strings.',
    '2-D DP (String Matching)',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/longest-common-subsequence/',
    'In 5 days',
    25,
    87
),
(
    'dsa-88',
    'Target Sum',
    'Find number of ways to assign + and - signs to array elements to evaluate to target.',
    '2-D DP (0/1 Knapsack)',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/target-sum/',
    'In 5 days',
    25,
    88
),
(
    'dsa-89',
    'Interleaving String',
    'Determine whether string $s_3$ is formed by an interleaving of strings $s_1$ and $s_2$.',
    '2-D DP (String Matching)',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/interleaving-string/',
    'In 5 days',
    25,
    89
),
(
    'dsa-90',
    'Edit Distance',
    'Find minimum insertions, deletions, or substitutions to transform one string into another.',
    '2-D DP (String Matching)',
    'Medium',
    'Dynamic Programming',
    'https://leetcode.com/problems/edit-distance/',
    'In 5 days',
    25,
    90
),
(
    'dsa-91',
    'Burst Balloons',
    'Maximize coins collected by strategically choosing the bursting order of interval balloons.',
    '2-D DP (Interval DP)',
    'Hard',
    'Dynamic Programming',
    'https://leetcode.com/problems/burst-balloons/',
    'In 5 days',
    35,
    91
),
(
    'dsa-92',
    'Insert Interval',
    'Insert a new interval into a sorted list of non-overlapping intervals and merge collisions.',
    'Intervals',
    'Medium',
    'Intervals',
    'https://leetcode.com/problems/insert-interval/',
    'In 5 days',
    25,
    92
),
(
    'dsa-93',
    'Merge Intervals',
    'Combine all overlapping intervals into non-overlapping spans by sorting on start times.',
    'Intervals',
    'Medium',
    'Intervals',
    'https://leetcode.com/problems/merge-intervals/',
    'In 5 days',
    25,
    93
),
(
    'dsa-94',
    'Non-overlapping Intervals',
    'Find minimum intervals to remove to eliminate all overlaps using greedy earliest-end-time.',
    'Intervals (Greedy)',
    'Medium',
    'Intervals',
    'https://leetcode.com/problems/non-overlapping-intervals/',
    'In 5 days',
    25,
    94
),
(
    'dsa-95',
    'Minimum Number of Arrows to Burst Balloons',
    'Determine minimum arrows shot along $x$-axis to pop balloons represented as intervals.',
    'Intervals (Greedy)',
    'Medium',
    'Intervals',
    'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/',
    'In 5 days',
    25,
    95
),
(
    'dsa-96',
    'Single Number',
    'Identify the unique element appearing once in an array where all others appear twice using XOR.',
    'Bit Manipulation (XOR)',
    'Easy',
    'Bit Manipulation',
    'https://leetcode.com/problems/single-number/',
    'In 5 days',
    15,
    96
),
(
    'dsa-97',
    'Counting Bits',
    'Return array of set-bit counts ($1$s) for every number from $0$ up to $n$ in linear time.',
    'Bit Manipulation / DP',
    'Easy',
    'Bit Manipulation',
    'https://leetcode.com/problems/counting-bits/',
    'In 5 days',
    15,
    97
),
(
    'dsa-98',
    'Set Matrix Zeroes',
    'If an element in an $m \times n$ matrix is $0$, set its entire row and column to $0$ in-place.',
    'Matrix (In-place Marking)',
    'Medium',
    'Matrix',
    'https://leetcode.com/problems/set-matrix-zeroes/',
    'In 5 days',
    25,
    98
),
(
    'dsa-99',
    'Spiral Matrix',
    'Return all elements of an $m \times n$matrix in spiral order by contracting boundary pointers.',
    'Matrix (Boundary Traversal)',
    'Medium',
    'Matrix',
    'https://leetcode.com/problems/spiral-matrix/',
    'In 5 days',
    25,
    99
),
(
    'dsa-100',
    'Rotate Image',
    'Rotate an $n \times n$ 2D matrix 90 degrees clockwise in-place by transposing and reversing rows.',
    'Matrix (Transpose & Reflect)',
    'Medium',
    'Matrix',
    'https://leetcode.com/problems/rotate-image/',
    'In 5 days',
    25,
    100
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    pattern = EXCLUDED.pattern,
    difficulty = EXCLUDED.difficulty,
    category = EXCLUDED.category,
    link = EXCLUDED.link,
    revision_timing = EXCLUDED.revision_timing,
    est_time_minutes = EXCLUDED.est_time_minutes,
    order_index = EXCLUDED.order_index,
    updated_at = timezone('utc'::text, now());

-- =============================================================================
-- HELPER QUERIES: How to Insert & Manage Questions Manually in Supabase
-- =============================================================================

-- Example A: Insert a new custom DSA problem
-- INSERT INTO public.dsa_problems (id, title, pattern, difficulty, category, revision_timing, est_time_minutes, order_index)
-- VALUES ('dsa-101', 'Alien Dictionary II', 'Topological Sort / Kahn', 'Hard', 'Graphs', 'In 3 days', 35, 101)
-- ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, difficulty = EXCLUDED.difficulty;

-- Example B: Insert a new System Design specification
-- INSERT INTO public.system_design_specs (id, title, domain, difficulty, rubric, revision_timing, est_time_minutes, order_index)
-- VALUES (
--     'sd-13',
--     'Design a Distributed Search Engine (Elasticsearch)',
--     'Inverted Index / BM25',
--     'Hard',
--     '{"scope": "Index 10B documents, sub-50ms fuzzy full-text search.", "api": "POST /v1/search { query }", "dataModel": "Lucene segments + inverted index.", "deepDive": "Segment merging, primary-replica replication."}'::jsonb,
--     'Day 40',
--     50,
--     13
-- )
-- ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- Example C: How to log progress for a user (normally handled automatically by the app):
-- INSERT INTO public.user_problem_progress (user_id, problem_id, item_type, status, confidence_stars, notes)
-- VALUES (auth.uid(), 'dsa-1', 'DSA', 'Mastered', 5, 'Solved in O(N) using complement hash map.')
-- ON CONFLICT (user_id, problem_id) DO UPDATE SET status = EXCLUDED.status, confidence_stars = EXCLUDED.confidence_stars, updated_at = now();
