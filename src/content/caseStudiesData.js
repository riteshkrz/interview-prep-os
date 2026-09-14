/**
 * Real-World System Design Case Studies & Engineering Monographs
 * Curated for FAANG/Tier-1 Senior & Staff Software Engineer Interviews.
 */

export const CASE_STUDIES = [
  {
    id: 'url-shortener-kgs',
    slug: 'design-url-shortener-kgs',
    title: 'How to Design a URL Shortener: A Practical System Design Guide',
    company: 'System Design Standard',
    category: 'System Design',
    difficulty: 'Medium',
    readTime: '12 min read',
    publishedDate: 'Sept 2026',
    author: {
      name: 'Aris Thorne',
      role: 'Staff Infrastructure Engineer',
      avatar: 'AT'
    },
    summary: 'Understand the end-to-end architecture, data model, scalability challenges, caching strategy, and trade-offs behind a production-ready URL shortener handling 100M daily writes and 1B daily reads.',
    tags: ['System Design', 'Base62', 'Redis', 'PostgreSQL', 'KGS'],
    keywords: 'url shortener tinyurl base62 kgs key generation service murmur3 redis bloom filter sharding',
    sla: '100M Writes / Day • p99 < 8ms',
    keyTakeaways: [
      'Base62 encoding avoids collisions cleanly compared to raw MD5/SHA-256 truncation.',
      'A dedicated Key Generation Service (KGS) eliminates database race conditions during concurrent write bursts.',
      'Cache-aside Redis with bloom filters eliminates cold-key lookup penalties and database exhaustion.',
      'Hash-based range partitioning prevents write hotspots on popular domain suffixes.'
    ],
    faangRubric: [
      'Scope Clarification: Differentiate 100:1 read-to-write ratio from write-heavy telemetry systems.',
      'Capacity Math: 100M writes/day ≈ 1,160 writes/sec, peak ≈ 3,500 writes/sec. 500 bytes per URL = 18.25 TB/year.',
      'Key Collision Strategy: Proactively defend why pre-generated keys (KGS) outperform MD5 hashing with retry loops.',
      'SPOF & Resiliency: Master-Replica PostgreSQL with automated Patroni failover and Redis Sentinel cluster.'
    ],
    sections: [
      {
        title: '1. Functional & Non-Functional Requirements',
        content: `
### Functional Requirements
1. Given a long URL, generate a unique, short URL string (e.g. \`https://prep.os/xyz89\`).
2. Redirect incoming requests on the short link to the original target URL via \`301 Moved Permanently\` or \`302 Found\`.
3. Support custom URL aliases with custom expiration times (TTL).
4. Provide basic analytics (total clicks, referrer, client geo).

### Non-Functional Requirements
- **High Availability**: Redirect service must never go down (99.999% SLA).
- **Ultra-Low Latency**: Read redirection latency must be **sub-10ms** (p99 < 8ms).
- **Collision Immunity**: Generated short keys must never collide under 50,000 concurrent writes/sec.
        `
      },
      {
        title: '2. Capacity & Back-of-the-Envelope Calculations',
        content: `
- **Write Volume**: 100 million new URLs per day.
  - Write QPS: \`100,000,000 / 86,400 ≈ 1,160 writes/sec\`. Peak (3x) = **~3,500 writes/sec**.
- **Read Volume**: 1 billion redirections per day (10:1 read ratio).
  - Read QPS: \`1,000,000,000 / 86,400 ≈ 11,574 reads/sec\`. Peak = **~35,000 reads/sec**.
- **Storage**:
  - Each record: URL ID (8 bytes) + Short Key (7 bytes) + Original URL (500 bytes) + CreatedAt (8 bytes) + UserID (8 bytes) ≈ **550 bytes**.
  - Yearly storage: \`100M * 365 * 550 bytes ≈ 20 TB / year\`.
  - 5-Year Storage Horizon: **~100 TB**.
- **Memory Cache (80/20 Rule)**:
  - Cache 20% of daily active reads: \`1B * 20% * 550 bytes ≈ 110 GB RAM\`. Easily handled by a 2-node Redis cluster.
        `
      },
      {
        title: '3. Architectural Blueprint & Component Flow',
        content: `
\`\`\`
[ Client App ] ──> [ Envoy API Gateway / Token Bucket ]
                         │
                         ├── (POST /shorten) ──> [ Encoding Engine ] ──> [ Key Gen Service (KGS) ]
                         │                                                       │
                         │                                            [ Pre-allocated Range DB ]
                         │
                         └── (GET /{key}) ──> [ Redis Cluster (L1 Cache) ]
                                                       │ (Cache Miss)
                                                       ▼
                                            [ PostgreSQL Sharded Cluster ]
\`\`\`

1. **API Gateway (Envoy)**: Handles TLS termination, IP-based rate limiting (Token Bucket: 100 req/min per IP), and sticky routing.
2. **Key Generation Service (KGS)**: Standalone microservice that pre-generates 7-character Base62 keys in batches and stores them in two database tables: \`unused_keys\` and \`used_keys\`.
3. **In-Memory Range Buffers**: KGS worker instances load 10,000 keys into memory at startup. Even if a worker crashes, lost keys are negligible because 7 Base62 characters yield **3.5 trillion unique combinations** (\`62^7 = 3,521,614,606,208\`).
4. **Redis Cache-Aside**: High-traffic keys reside in Redis with an LRU eviction policy. Read queries hit Redis in under 1ms.
        `
      },
      {
        title: '4. Deep-Dive: 301 vs 302 Redirection Trade-off',
        content: `
In an interview, interviewers always ask whether to return **HTTP 301** or **HTTP 302**:

- **HTTP 301 (Moved Permanently)**:
  - The browser caches the redirection locally. Subsequent user clicks bypass your server entirely and navigate straight to the destination.
  - **Advantage**: Reduces server load to zero for repeated clicks.
  - **Disadvantage**: Breaks click analytics tracking, geolocation logging, and link invalidation.
- **HTTP 302 (Found / Temporary Redirect)**:
  - Every click routes back to your server before redirecting.
  - **Advantage**: Real-time click counters, referrer tracking, abuse mitigation, and analytics.
  - **Verdict**: Use **302** for commercial URL shorteners needing metrics; use **301** only if minimizing edge egress bandwidth is the primary constraint.
        `
      }
    ]
  },
  {
    id: 'stripe-idempotency',
    slug: 'stripe-idempotent-apis-distributed-deduplication',
    title: 'Designing Idempotent Payment APIs & Distributed Deduplication',
    company: 'Stripe',
    category: 'Backend Engineering',
    difficulty: 'Hard',
    readTime: '15 min read',
    publishedDate: 'Aug 2026',
    author: {
      name: 'Evelyn Vane',
      role: 'Principal Systems Architect',
      avatar: 'EV'
    },
    summary: 'A deep dive into how financial infrastructure guarantees exactly-once payment processing over unreliable networks using idempotency keys, database transaction locks, and atomic state machines.',
    tags: ['Backend Engineering', 'Idempotency', 'Distributed Transactions', 'PostgreSQL', 'Redis'],
    keywords: 'stripe idempotency exactly-once payment api deduplication distributed lock pgbouncer atomic commit',
    sla: 'Zero Double-Charges • 99.999% Financial Consistency',
    keyTakeaways: [
      'Idempotency keys must be coupled with the request payload hash to prevent replay payload mutation.',
      'Distributed locks in Redis must have deterministic leases with two-phase release to avoid split-brain execution.',
      'Transactional outbox pattern guarantees that external webhook notifications never fire if the database rolls back.',
      'Database unique constraints on (user_id, idempotency_key) act as the final immovable line of defense.'
    ],
    faangRubric: [
      'Fault Domain Separation: Explain network partitions (client sent payment, server processed it, ACK dropped).',
      'Locking Strategy: Compare Redis Redlock vs PostgreSQL advisory locks vs SELECT FOR UPDATE.',
      'Payload Validation: Explain why an idempotency key with a changed amount must return HTTP 400 Conflict.',
      'Recovery Phase: How to handle requests when the first attempt is still IN_PROGRESS (HTTP 409 or polling header).'
    ],
    sections: [
      {
        title: '1. The Core Distributed Systems Problem',
        content: `
In distributed systems, networks are inherently unreliable. When a client executes a payment:
1. Client sends \`POST /v1/charges\` ($100.00).
2. Server deducts funds from bank and commits to the database.
3. Server attempts to respond with \`200 OK\`, but a network timeout drops the response packet.
4. Client assumes the request failed and retries.

Without an idempotency layer, the user is **double-charged**. In financial software, this is catastrophic.
        `
      },
      {
        title: '2. Stripe Idempotency Architecture',
        content: `
\`\`\`
[ Client ] ──> Headers: Idempotency-Key: "req_99x" ──> [ API Gateway ]
                                                             │
                                              ┌──────────────┴──────────────┐
                                              │ Check Idempotency Store     │
                                              ▼                             ▼
                                      [ State: DONE ]               [ State: LOCK / NEW ]
                                       Return Cached Response        Acquire Redis Mutex Lease
                                       (HTTP 200)                    Execute Payment Engine
                                                                            │
                                                                     Commit to DB
                                                                     Update Key to DONE
\`\`\`

1. **Client Generates Key**: The client generates a UUIDv4 header \`Idempotency-Key: d98f-431a-88cf\`.
2. **Payload Hash Verification**: Server hashes the request body (\`SHA-256(body)\`). If the key exists but the hash differs, reject immediately with \`400 Bad Request (Idempotency key reused with different parameters)\`.
3. **Atomic State Lifecycle**:
   - **LOCK / IN_PROGRESS**: Stored in Redis with a 120-second lease.
   - **RESOLVED / DONE**: Permanent record in PostgreSQL containing the full HTTP status code and response payload.
   - Any concurrent request arriving while state is \`IN_PROGRESS\` receives \`409 Conflict\` or waits on an event subscription.
        `
      },
      {
        title: '3. Production SQL Schema for Idempotency',
        content: `
\`\`\`sql
CREATE TABLE idempotency_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL,
  idempotency_key VARCHAR(255) NOT NULL,
  request_path VARCHAR(255) NOT NULL,
  request_hash VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL CHECK (status IN ('processing', 'resolved', 'failed')),
  response_code INT,
  response_body JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  CONSTRAINT uq_account_idempotency UNIQUE (account_id, idempotency_key)
);

CREATE INDEX idx_idempotency_lookup ON idempotency_keys (account_id, idempotency_key);
\`\`\`
        `
      }
    ]
  },
  {
    id: 'uber-geospatial-h3',
    slug: 'uber-geospatial-partitioning-h3-hexagons',
    title: 'Geospatial Partitioning: Dispatching Millions of Rides with Hexagonal Grids (H3)',
    company: 'Uber',
    category: 'Distributed Systems',
    difficulty: 'Hard',
    readTime: '14 min read',
    publishedDate: 'Aug 2026',
    author: {
      name: 'Kiran Patel',
      role: 'Staff Infrastructure Lead',
      avatar: 'KP'
    },
    summary: 'How Uber solves the 2D geospatial indexing problem at planetary scale using discrete hexagonal hierarchical spatial indexing (H3), Ringpop consistent hashing, and in-memory spatial shards.',
    tags: ['Distributed Systems', 'Geospatial', 'H3', 'Consistent Hashing', 'Go'],
    keywords: 'uber h3 geospatial indexing geohash hexagon ringpop ride dispatch surge pricing kd-tree r-tree',
    sla: 'Sub-50ms Driver Matching • 10M GPS Updates / Min',
    keyTakeaways: [
      'Hexagons have only 1 invariant neighbor distance (6 equidistant neighbors), eliminating distortion bugs inherent to squares and Geohashes.',
      'Hierarchical H3 indexes enable O(1) parent-child spatial aggregation for dynamic surge pricing calculation.',
      'Ringpop consistent hashing rings with SWIM gossip protocol keep driver locations in memory without hitting disk.',
      'Sharding by spatial cell rather than driver ID allows localized geospatial queries to execute on a single physical node.'
    ],
    faangRubric: [
      'Spatial Indexing Alternatives: Compare QuadTree, R-Tree, Geohash, and Google S2 against Uber H3.',
      'Write Ingestion: How to ingest 10M driver GPS pings/min without causing disk I/O bottlenecks (memory ring buffers).',
      'Surge Pricing Calculation: Aggregating demand vs supply across H3 resolution 7 cells in real time.',
      'Boundary Conditions: How driver search queries inspect adjacent H3 rings (\`kRing(origin, 1)\`).'
    ],
    sections: [
      {
        title: '1. The Problem with Square Geohashes & QuadTrees',
        content: `
When partitioning the Earth for real-time ride matching:
- **Square Grids / Geohash**: A square cell has **two different neighbor distances**: 4 orthogonal neighbors at distance \`d\`, and 4 diagonal neighbors at distance \`d * √2\`. This produces mathematical distortion when calculating nearest drivers.
- **Hexagons (H3)**: Every hexagon has exactly **6 neighbors at the exact same distance**. The distance from center to center is uniform across all directions, making radial searches (\`kRing\`) computationally trivial.
        `
      },
      {
        title: '2. Uber Dispatch Topology',
        content: `
\`\`\`
[ Driver App (GPS Ping) ] ──> [ Netty / WebSockets Ingest ]
                                        │
                                        ▼
                   [ Spatial Gateway: Lat/Lng -> H3 Index (64-bit int) ]
                                        │
                     ┌──────────────────┴──────────────────┐
                     ▼                                     ▼
     [ Ringpop Node A: H3 Cells 88268... ]   [ Ringpop Node B: H3 Cells 88283... ]
     In-Memory Driver Roster (Spatial Set)   In-Memory Driver Roster (Spatial Set)
                     │
                     └── [ Surge Pricing Aggregator (H3 Parent Resolution 7) ]
\`\`\`

1. **64-bit Hex Address**: Each driver's coordinates are converted into a compact 64-bit integer H3 cell identifier.
2. **Ringpop Partitioning**: Nodes form an application-level consistent hash ring using the SWIM gossip protocol. The H3 cell ID determines which physical server holds the state for that neighborhood.
3. **Localized Match Engine**: When a rider in downtown Manhattan requests a trip, the query routes strictly to the server owning cell \`882685623ffffff\`. It queries \`kRing(cell, 2)\` to evaluate the 19 neighboring hexagons in under 5ms from local memory.
        `
      }
    ]
  },
  {
    id: 'netflix-active-active',
    slug: 'netflix-active-active-multi-region-resiliency',
    title: 'Active-Active Multi-Region Resiliency: Keeping Streaming Up During AWS Region Outages',
    company: 'Netflix',
    category: 'System Design',
    difficulty: 'Hard',
    readTime: '16 min read',
    publishedDate: 'July 2026',
    author: {
      name: 'Marcus Brody',
      role: 'Distinguished Reliability Engineer',
      avatar: 'MB'
    },
    summary: 'How Netflix operates across 3 AWS regions simultaneously with active traffic routing, multi-region Cassandra clusters, Zuul dynamic DNS shedding, and automated Chaos Gorilla evacuation.',
    tags: ['System Design', 'Active-Active', 'Resilience', 'Chaos Engineering', 'Cassandra'],
    keywords: 'netflix active-active multi-region aws outage chaos monkey gorilla cassandra zuul latency routing',
    sla: '99.999% Availability • Evacuate AWS Region in < 7 mins',
    keyTakeaways: [
      'True active-active architecture requires cross-region data replication with conflict-free replicated data types (CRDTs) or Last-Write-Wins timestamps.',
      'Stateless microservices allow traffic to be instantly drained from an impaired region via Route 53 latency weighted records.',
      'Caching must be warmed continuously across all regions; a cold region cannot absorb an emergency traffic shift.',
      'Chaos Gorilla drills intentionally terminate entire AWS availability zones and regions in production.'
    ],
    faangRubric: [
      'CAP Theorem in Practice: Explain why Netflix chooses Availability over Strong Consistency for viewing bookmarks.',
      'Data Replication Lag: How Cassandra handles cross-region async replication without blocking user playback.',
      'Fallback Degradation: How client devices fall back to cached local catalogs when regional APIs brown out.',
      'Traffic Evacuation Playbook: DNS health checks vs BGP Anycast vs Zuul proxy rerouting.'
    ],
    sections: [
      {
        title: '1. Why Multi-Region Active-Passive Fails',
        content: `
Traditional architectures use **Active-Passive** (Region A active, Region B standby). In production at Netflix scale, this repeatedly fails because:
1. **Cold Caches**: Standby regions have empty in-memory caches. Suddenly dumping 100% of global traffic causes database meltdown.
2. **Untested Pathways**: Passive failover configurations bit-rot silently. When a disaster strikes, failover fails.
3. **Active-Active Solution**: All 3 regions (us-east-1, us-west-2, eu-west-1) serve live customer traffic 24/7/365. Each operates at ~60% capacity headroom to absorb a sister region's traffic in 7 minutes.
        `
      }
    ]
  },
  {
    id: 'discord-scylladb-migration',
    slug: 'discord-scylladb-migration-billions-messages',
    title: 'Migrating from MongoDB to ScyllaDB: Storing Billions of Messages with P99 < 5ms',
    company: 'Discord',
    category: 'Databases',
    difficulty: 'Hard',
    readTime: '13 min read',
    publishedDate: 'July 2026',
    author: {
      name: 'Soren Lind',
      role: 'Staff Infrastructure Architect',
      avatar: 'SL'
    },
    summary: 'How Discord scaled their chat message storage past trillions of messages by moving from MongoDB to Cassandra and ultimately to C++-powered ScyllaDB to eliminate JVM GC pauses and hot partitions.',
    tags: ['Databases', 'ScyllaDB', 'Cassandra', 'Hot Partitions', 'Distributed Storage'],
    keywords: 'discord scylladb cassandra mongodb rust hot partitions gc pause lsm-tree compaction',
    sla: 'Trillions of Messages • Sub-5ms P99 Latency',
    keyTakeaways: [
      'Garbage Collection pauses in JVM-based Cassandra caused severe p99 tail latency spikes; ScyllaDB’s shared-nothing C++ engine eliminated GC pauses.',
      'Partitioning messages by (channel_id, bucket) prevents unbounded partition sizes on high-volume servers.',
      'Reverse read pagination using Snowflake IDs eliminates expensive offset scans.',
      'Rust-based data routing middleware absorbs spikes in chat bursts without hammering the database ring.'
    ],
    faangRubric: [
      'LSM-Tree vs B-Tree: Explain why Log-Structured Merge trees excel at write-heavy append-only chat workloads.',
      'Partition Key Design: Differentiate composite partition keys ((channel_id, bucket), message_id) from single keys.',
      'Tombstone Overhead: Discuss how message deletions in Cassandra/ScyllaDB cause compaction latency if not bucketted.',
      'Dual-Writing Migration Strategy: Shadow reads, backfill migration, and incremental verification.'
    ],
    sections: [
      {
        title: '1. The Evolution of Discord Storage',
        content: `
- **Phase 1 (2015)**: Single MongoDB replica set. Crashed when messages exceeded RAM.
- **Phase 2 (2017)**: Apache Cassandra cluster. Handled petabytes, but JVM Garbage Collection (GC) pauses caused p99 tail latency spikes over 1,000ms.
- **Phase 3 (2022+)**: ScyllaDB (C++ rewrite of Cassandra). Utilizes an asynchronous, thread-per-core shared-nothing architecture on NVMe disks, dropping p99 to **under 4ms** across trillions of messages.
        `
      }
    ]
  },
  {
    id: 'distributed-rate-limiter',
    slug: 'distributed-rate-limiter-sliding-window',
    title: 'Designing a Distributed Rate Limiter: Sliding Window Counter vs Token Bucket',
    company: 'System Design Standard',
    category: 'Backend Engineering',
    difficulty: 'Medium',
    readTime: '11 min read',
    publishedDate: 'June 2026',
    author: {
      name: 'Aris Thorne',
      role: 'Staff Infrastructure Engineer',
      avatar: 'AT'
    },
    summary: 'Analyze the 4 classical rate-limiting algorithms, race conditions under high concurrency in Redis, atomic Lua scripts, and client side back-off protocols.',
    tags: ['Backend Engineering', 'Rate Limiting', 'Redis', 'Lua Scripts', 'System Design'],
    keywords: 'rate limiter token bucket sliding window counter leaky bucket redis lua atomic script envoy',
    sla: 'Overhead < 1ms • 500k QPS Ingestion',
    keyTakeaways: [
      'Sliding Window Counter offers the best balance of memory efficiency and boundary precision.',
      'Lua scripts in Redis guarantee atomic execution of GET + INCREMENT without distributed lock overhead.',
      'Return standard HTTP 429 Too Many Requests with Retry-After and X-RateLimit-Reset headers.',
      'Hierarchical limits: Layered rate limiting at API Gateway (global IP) and Application Service (user/token level).'
    ],
    faangRubric: [
      'Algorithm Comparison: Token Bucket vs Leaky Bucket vs Fixed Window vs Sliding Window Log vs Sliding Window Counter.',
      'Race Condition Handling: Explain why standalone Redis GET and SET causes over-admissions under concurrency.',
      'Memory Footprint: Calculate memory requirements for 50M active users with sliding window counters.',
      'Graceful Degradation: What should happen if Redis crashes? (Fail open vs Fail closed based on business criticality).'
    ],
    sections: [
      {
        title: '1. The 4 Rate Limiting Algorithms Compared',
        content: `
| Algorithm | Memory Usage | Burst Handling | Accuracy | Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Token Bucket** | Minimal (2 numbers: tokens, last_updated) | Allows controlled bursts | High | Low |
| **Leaky Bucket** | Minimal (queue capacity) | Smoothes bursts to constant rate | High | Moderate |
| **Fixed Window** | Minimal (1 integer counter) | Vulnerable to 2x burst at boundary | Low | Lowest |
| **Sliding Window Counter** | Low (current + previous window weight) | Handles bursts smoothly | 99.9% accurate | Moderate |
        `
      },
      {
        title: '2. Atomic Redis Lua Script Implementation',
        content: `
\`\`\`lua
-- KEYS[1]: rate limiter key (e.g. "rate:user_123")
-- ARGV[1]: max requests limit (e.g. 100)
-- ARGV[2]: window size in seconds (e.g. 60)

local current = redis.call('incr', KEYS[1])
if current == 1 then
    redis.call('expire', KEYS[1], ARGV[2])
end

if current > tonumber(ARGV[1]) then
    return 0 -- Rate limited
else
    return 1 -- Allowed
end
\`\`\`
        `
      }
    ]
  },
  {
    id: 'kafka-consumer-lag',
    slug: 'kafka-partition-rebalancing-consumer-lag',
    title: 'High-Throughput Message Queues: Kafka Partition Rebalancing & Consumer Lag',
    company: 'LinkedIn',
    category: 'Distributed Systems',
    difficulty: 'Hard',
    readTime: '14 min read',
    publishedDate: 'June 2026',
    author: {
      name: 'Devon Zhao',
      role: 'Principal Streaming Engineer',
      avatar: 'DZ'
    },
    summary: 'Master the mechanics of Apache Kafka at scale: zero-copy page cache transfers, cooperative sticky partition rebalancing, and eliminating consumer lag spikes during traffic surges.',
    tags: ['Distributed Systems', 'Kafka', 'Streaming', 'Java', 'Zero-Copy'],
    keywords: 'kafka consumer lag partition rebalancing cooperative sticky zero copy sendfile pagecache commit log',
    sla: '5M Events / Sec • Consumer Lag < 100ms',
    keyTakeaways: [
      'Linux sendfile() bypasses user-space buffer copies, streaming disk blocks straight to network sockets.',
      'Cooperative Sticky Assignor eliminates the stop-the-world pauses caused by eager partition reassignment.',
      'Consumer lag must be measured in message offsets and wall-clock time (\`time_lag = now - record_timestamp\`).',
      'Idempotent producers with sequence IDs and transactional coordinators achieve true end-to-end exactly-once semantics.'
    ],
    faangRubric: [
      'Zero-Copy Architecture: Explain why Kafka outperforms RabbitMQ on raw throughput (Kernel PageCache + sendfile).',
      'Partition Scaling: Differentiate scaling consumers within a group vs adding partitions.',
      'Rebalance Storms: How to tune max.poll.interval.ms and session.timeout.ms to stop cascading crashes.',
      'Data Compaction vs Retention: Log compaction semantics for stateful Kafka Streams key-value state stores.'
    ],
    sections: [
      {
        title: '1. Zero-Copy I/O: Why Kafka is Incredibly Fast',
        content: `
Traditional network applications move data across 4 context switches:
1. Disk -> OS Page Cache (DMA Copy)
2. OS Page Cache -> Application Buffer (CPU Copy)
3. Application Buffer -> Socket Buffer (CPU Copy)
4. Socket Buffer -> NIC Buffer (DMA Copy)

**Kafka Zero-Copy (Linux \`sendfile()\`)**:
Kafka instructs the Linux kernel to transfer data directly from the **OS Page Cache to the Network Interface Card (NIC)**. The application process never reads the bytes into user space. This enables line-rate saturation with negligible CPU usage.
        `
      }
    ]
  },
  {
    id: 'lmax-disruptor',
    slug: 'lmax-disruptor-lock-free-ring-buffer',
    title: 'LMAX Disruptor & Lock-Free Ring Buffers: Processing 6M TPS on Modern Hardware',
    company: 'LMAX Exchange',
    category: 'Java',
    difficulty: 'Hard',
    readTime: '13 min read',
    publishedDate: 'May 2026',
    author: {
      name: 'Aris Thorne',
      role: 'Staff Infrastructure Engineer',
      avatar: 'AT'
    },
    summary: 'How mechanical sympathy, CPU L1/L2 cache-line padding, memory barriers, and lock-free circular ring buffers allow financial exchanges to execute millions of transactions per second with nanosecond latencies.',
    tags: ['Java', 'Concurrency', 'Lock-Free', 'Low-Latency', 'Performance'],
    keywords: 'lmax disruptor ring buffer lock-free false sharing cpu cache line volatile memory barrier java',
    sla: '6,000,000 TPS • Latency < 500ns',
    keyTakeaways: [
      'Operating system mutexes and synchronized blocks force kernel context switches costing 1,000+ nanoseconds.',
      'CPU Cache Line False Sharing occurs when unrelated variables share the same 64-byte L1 cache line; resolve with cache padding.',
      'Single-writer ring buffers use power-of-two modulo indexing (\`index & (size - 1)\`) for ultra-fast bitwise math.',
      'Volatile sequence tracking with memory barriers prevents out-of-order execution without thread contention.'
    ],
    faangRubric: [
      'Mechanical Sympathy: Explain how modern CPU architecture (L1/L2/L3 caches and memory bus) impacts high-concurrency design.',
      'False Sharing Prevention: How \`@Contended\` or long padding fields prevent cache line invalidation storms.',
      'Lock-Free Ring Buffer vs LinkedBlockingQueue: Compare throughput and GC allocation overhead.',
      'Batching Effect: How consumers process multiple sequence slots in a single batch when under heavy load.'
    ],
    sections: [
      {
        title: '1. Why Traditional Blocking Queues Fail at Low Latency',
        content: `
Java's \`ArrayBlockingQueue\` and \`LinkedBlockingQueue\` rely on \`ReentrantLock\` and \`Condition\` objects. When threads contend for locks:
1. Thread suspended by OS kernel.
2. Context switch overhead: ~1,000 to 3,000 ns.
3. CPU registers flushed; instruction pipeline stalled; cache invalidated.

**The Disruptor Solution**:
A single circular array with pre-allocated objects. Zero runtime memory allocation (zero Garbage Collection pauses). Sequence counters use atomic CAS (\`Compare-And-Swap\`) and memory barriers, allowing 6 million transactions/sec on a single core.
        `
      }
    ]
  }
];

export function getCaseStudyBySlug(slug) {
  if (!slug) return null;
  return CASE_STUDIES.find(c => c.slug === slug || c.id === slug) || null;
}

