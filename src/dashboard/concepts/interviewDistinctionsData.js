/**
 * 45-Day Interview Prep OS - System Design Architectural Distinctions Catalog
 * Sourced & curated from SystemCraft's 180+ Fine Concept Distinctions.
 * Structured as 20-second rapid-fire interview answers with traps, formulas, and diagrams.
 */

export const INTERVIEW_DISTINCTIONS = [
  // CATEGORY 1: Storage & Databases
  {
    id: "dist-part-vs-shard",
    category: "Storage & Databases",
    title: "Partitioning vs. Sharding",
    frequency: "Extremely High (Top Asked)",
    summary: "The single most-asked distinction in senior/staff system design interviews.",
    sayThis20s: "Sharding is a type of partitioning — specifically horizontal partitioning where the partitions live on different physical machines. All sharding is partitioning; not all partitioning is sharding. If I split a table by month on a single Postgres instance, that’s partitioning: I get query pruning and instant DROP PARTITION of old data, but zero extra write throughput.",
    interviewerTrap: "When would you partition without sharding?",
    trapAnswer: "Time-series or audit event tables. Partitioning by day/month allows PostgreSQL or MySQL to drop an entire file instantly via DROP PARTITION instead of issuing slow, locking DELETE queries with WAL write bloat.",
    codeOrDiagram: `// Single DB Instance:
Table -> [Partition 2024-01] | [Partition 2024-02] (Same Machine)

// Sharded Cluster:
Shard 1 (Node A: Users 1 - 1M) | Shard 2 (Node B: Users 1M - 2M)`,
    tags: ["Sharding", "Partitioning", "Databases", "Postgres"]
  },
  {
    id: "dist-horiz-vs-vert-part",
    category: "Storage & Databases",
    title: "Horizontal vs. Vertical Partitioning",
    frequency: "High",
    summary: "Splitting rows across machines vs splitting columns by access frequency.",
    sayThis20s: "Horizontal partitioning keeps the same schema and divides rows into subsets. Vertical partitioning keeps all rows and divides columns into separate tables based on access pattern. You vertically partition when 3 columns are read on every API call (e.g. user_id, status, name) while 20 columns are heavy or rarely read (e.g. bio, raw_json_blob, avatar_bytes).",
    interviewerTrap: "What is the downside of vertical partitioning?",
    trapAnswer: "Recombining them requires SQL JOINs across foreign keys, which can degrade read throughput if the access pattern changes unexpectedly.",
    codeOrDiagram: `Horizontal: [Rows 1-500] in Table A, [Rows 501-1000] in Table B
Vertical:   [id, name, email] in Table A, [id, bio, settings_blob] in Table B`,
    tags: ["Schema Design", "Performance", "Normalization"]
  },
  {
    id: "dist-drop-truncate-delete",
    category: "Storage & Databases",
    title: "DROP vs. TRUNCATE vs. DELETE",
    frequency: "Medium",
    summary: "DDL vs DML, row-by-row logging vs deallocating pages.",
    sayThis20s: "DELETE is a DML command that removes rows one-by-one, firing triggers, checking foreign keys, and writing full UNDO/REDO logs for every row (can be rolled back). TRUNCATE is a DDL command that deallocates entire data pages at once; it resets auto-increments and cannot be rolled back in some DBs. DROP removes the entire table structure and metadata from the database catalog.",
    interviewerTrap: "Why does TRUNCATE fail on tables with foreign keys even if children are empty?",
    trapAnswer: "Because TRUNCATE bypasses row-level referential integrity checks; RDBMS requires disabling foreign key constraints first.",
    codeOrDiagram: `DELETE:   Row-by-row | Logs each row | Slow | Triggers fire | Rollback OK
TRUNCATE: Page dealloc | Minimal log | Fast | No triggers | Resets identity
DROP:     Removes table structure + metadata entirely`,
    tags: ["SQL", "Postgres", "MySQL", "DDL"]
  },
  {
    id: "dist-offset-vs-cursor",
    category: "Storage & Databases",
    title: "Offset Pagination vs. Cursor (Keyset) Pagination",
    frequency: "Very High",
    summary: "Why OFFSET 100000 kills performance and duplicates rows.",
    sayThis20s: "Offset pagination (OFFSET 10000 LIMIT 20) forces the database engine to scan and discard 10,000 index entries before returning 20 rows, leading to O(N) query degradation and missing/duplicated items if new rows are inserted during user scrolling. Cursor pagination (WHERE id > last_seen_id ORDER BY id LIMIT 20) is O(1) via index seek, deterministic, and immune to concurrent write shifts.",
    interviewerTrap: "When is offset pagination actually required?",
    trapAnswer: "When UI requires jumping directly to arbitrary pages ('Go to page 47'). Cursor pagination only supports sequential NEXT/PREVIOUS browsing.",
    codeOrDiagram: `Bad:  SELECT * FROM posts ORDER BY created_at LIMIT 20 OFFSET 50000; (Scans 50,020 rows!)
Good: SELECT * FROM posts WHERE (created_at, id) < ($last_time, $last_id) ORDER BY created_at DESC, id DESC LIMIT 20; (Seeks directly)`,
    tags: ["APIs", "Pagination", "Indexing", "SQL"]
  },
  {
    id: "dist-btree-vs-lsm",
    category: "Storage & Databases",
    title: "B-Tree vs. LSM-Tree (Log-Structured Merge-Tree)",
    frequency: "Extremely High",
    summary: "Read-heavy in-place updates vs write-heavy append-only sequential disk writes.",
    sayThis20s: "B-Trees store data in balanced hierarchical pages and do in-place updates, which requires random disk writes and page splits; they excel at high-speed random reads and range queries (Postgres, MySQL). LSM-Trees convert all writes into sequential append-only writes to an in-memory MemTable and Write-Ahead Log (WAL), flushing immutable SSTables to disk; they excel at 10x higher write throughput (Cassandra, RocksDB, ScyllaDB).",
    interviewerTrap: "What is the main cost of an LSM-Tree?",
    trapAnswer: "Write amplification and CPU spikes caused by background compaction (merging SSTables), plus slower point reads requiring Bloom filter checks.",
    codeOrDiagram: `B-Tree:   Random writes (Page rewrites) -> Fast point reads O(log N)
LSM-Tree: Sequential writes (MemTable -> WAL -> SSTables) -> Compaction overhead`,
    tags: ["Storage Engines", "Cassandra", "Postgres", "RocksDB"]
  },

  // CATEGORY 2: Consistency & Distributed Systems
  {
    id: "dist-acid-c-vs-cap-c",
    category: "Consistency & Distributed Systems",
    title: "Consistency in ACID vs. Consistency in CAP",
    frequency: "Extremely High (Famous Trap)",
    summary: "Application schema invariants vs linearizable cross-replica read recency.",
    sayThis20s: "The C in ACID is NOT the C in CAP. ACID consistency means application invariant enforcement — 'no balance can be negative' or 'foreign key must exist'; the database rolls back the transaction if business rules break. CAP consistency means linearizability — every single read across all distributed replica nodes returns the most recent write or an error. Conflating them is why candidates incorrectly say 'all relational databases are CP'.",
    interviewerTrap: "Why isn't a standard multi-replica Postgres setup strictly CAP-Consistent?",
    trapAnswer: "Because asynchronous read replicas suffer from replication lag; reading from a replica can return stale data, which violates CAP Consistency (Linearizability).",
    codeOrDiagram: `ACID 'C': Invariant preservation (debit = credit, NOT NULL constraints)
CAP 'C':  Linearizability (All nodes see single atomic timeline of state)`,
    tags: ["CAP Theorem", "ACID", "Distributed Systems"]
  },
  {
    id: "dist-linearizable-vs-serializable",
    category: "Consistency & Distributed Systems",
    title: "Linearizability vs. Serializability",
    frequency: "High",
    summary: "Single-object real-time recency vs multi-object transaction ordering.",
    sayThis20s: "Linearizability is a real-time recency guarantee on a SINGLE object (if Write W finishes at 12:00:01, any Read started after 12:00:01 must see W). Serializability is a multi-object isolation guarantee that transactions appear to execute in some serial order, with NO guarantee of real-time clock alignment. Combining both is 'Strict Serializability' (External Consistency), which is what Google Spanner provides using TrueTime GPS atomic clocks.",
    interviewerTrap: "Can an execution be Serialized but NOT Linearizable?",
    trapAnswer: "Yes! A database can serialize transactions in an order that violates physical wall-clock ordering (e.g., executing a 2:00 PM transaction as if it ran before a 1:59 PM transaction).",
    codeOrDiagram: `Linearizability = Real-time recency guarantee on 1 register
Serializability = Multi-operation transaction isolation without wall-clock binding
Strict Serializability = Both together (Google Spanner / CockroachDB)`,
    tags: ["Spanner", "Distributed Systems", "Transactions"]
  },
  {
    id: "dist-quorum-formula",
    category: "Consistency & Distributed Systems",
    title: "Quorum Consensus Arithmetic (W + R > N)",
    frequency: "Extremely High",
    summary: "The mathematical guarantee of reading the latest write in Dynamo/Cassandra.",
    sayThis20s: "In a cluster with N replicas, where W nodes must acknowledge a write and R nodes must answer a read: if W + R > N, the read set and write set must overlap by the Pigeonhole Principle by at least 1 node, guaranteeing strong consistency. For N=3, standard configuration is W=2 and R=2 (tolerates 1 dead node). If you want blazing fast writes, set W=1 and R=3; for fast reads, set W=3 and R=1.",
    interviewerTrap: "What happens if a node returns a stale value during an R=2 read?",
    trapAnswer: "The client uses the version vector / timestamp to pick the highest version and triggers an asynchronous 'Read Repair' to overwrite the stale node.",
    codeOrDiagram: `N = Replicas | W = Write Acks | R = Read Acks
W + R > N -> Guaranteed overlap -> Strong Consistency
N=3, W=2, R=2 -> Tolerates 1 failure with strong consistency
N=3, W=1, R=1 -> Eventual consistency (Fast, AP system)`,
    tags: ["DynamoDB", "Cassandra", "Quorum", "Consensus"]
  },
  {
    id: "dist-2pc-vs-saga",
    category: "Consistency & Distributed Systems",
    title: "Two-Phase Commit (2PC) vs. Saga Pattern",
    frequency: "Extremely High",
    summary: "Synchronous blocking atomic transactions vs asynchronous compensating steps.",
    sayThis20s: "2PC is a synchronous, blocking protocol where a coordinator locks resources across all participating databases until all vote Commit. If the coordinator crashes or a network partition occurs, locks are held indefinitely, destroying microservice throughput. Saga is an asynchronous sequence of local transactions where each step publishes an event; if a step fails, compensating transactions are executed in reverse order (e.g. Refund Payment). Sagas trade isolation for extreme availability.",
    interviewerTrap: "What ACID property is missing in Saga architectures?",
    trapAnswer: "Isolation (I). Other users can observe intermediate uncommitted states before compensating transactions complete. It must be handled at the application layer via semantic locks.",
    codeOrDiagram: `2PC:   [Lock A] -> [Lock B] -> [Vote] -> [Commit Both] (Blocking SPOF)
Saga:  [Charge Card] -> [Reserve Inventory] -> Failed! -> [Refund Card Comp]`,
    tags: ["Microservices", "Saga", "Transactions", "Event-Driven"]
  },
  {
    id: "dist-pessimistic-vs-optimistic",
    category: "Consistency & Distributed Systems",
    title: "Optimistic vs. Pessimistic Locking",
    frequency: "High",
    summary: "SELECT FOR UPDATE vs version column increment under conflict.",
    sayThis20s: "Pessimistic locking assumes conflicts are frequent; it locks the database row immediately (SELECT ... FOR UPDATE) preventing any other transaction from reading or writing until the lock is released. Optimistic locking assumes conflicts are rare; it does not lock during reads, but checks a version column on update (UPDATE ... WHERE id=1 AND version=5). If version changed, update fails and the app retries. Optimistic wins in low-contention web apps; pessimistic wins in hot bank accounts or ticket booking.",
    interviewerTrap: "What happens to optimistic locking during a flash sale with 1,000 QPS on 1 item?",
    trapAnswer: "99.9% of transactions fail and retry constantly, causing massive CPU waste and thread exhaustion. High contention requires pessimistic locks or Redis atomic decrement queues.",
    codeOrDiagram: `Pessimistic: SELECT * FROM seats WHERE id = 10 FOR UPDATE;
Optimistic:  UPDATE items SET stock = stock - 1, version = version + 1 
             WHERE id = 42 AND version = 3; (Check rows_affected == 1)`,
    tags: ["Concurrency", "Locking", "Databases"]
  },

  // CATEGORY 3: Performance, Caching & Scaling
  {
    id: "dist-latency-vs-response-vs-service",
    category: "Performance & Caching",
    title: "Latency vs. Response Time vs. Service Time",
    frequency: "High",
    summary: "The critical queuing delay gap that causes p99 latency explosions.",
    sayThis20s: "Response time is the total roundtrip time experienced by the end client. Service time is the actual time my CPU/server took executing the business logic. Latency is the queuing time spent waiting on network hops or thread pool dispatch before execution starts. Under heavy load, service time remains constant, but queueing latency explodes exponentially, which is why p99 latency spikes long before CPU hits 100%.",
    interviewerTrap: "What mathematical law describes this queuing explosion?",
    trapAnswer: "Little’s Law (L = λW) and Kingman’s Formula, showing that as utilization approaches 100%, queue wait time approaches infinity.",
    codeOrDiagram: `Client -> [Network Latency] -> [Queue Wait Time] -> [Service Time (CPU)] -> Return
Response Time = Ingress Latency + Queue Latency + Service Time + Egress Latency`,
    tags: ["Metrics", "Latency", "Observability", "Littles Law"]
  },
  {
    id: "dist-cache-stampede-avalanche-penetration",
    category: "Performance & Caching",
    title: "Cache Stampede vs. Cache Avalanche vs. Cache Penetration",
    frequency: "Extremely High",
    summary: "The 3 classic cache failure modes and their exact mitigations.",
    sayThis20s: "Cache Stampede (Thundering Herd) is when ONE single popular hot key expires and 10,000 concurrent requests all miss and hammer the DB to rebuild it. Cache Avalanche is when THOUSANDS of keys expire at the exact same second (or Redis restarts), causing catastrophic DB overload. Cache Penetration is when clients query keys that do NOT exist in cache OR database, permanently bypassing the cache on every request.",
    interviewerTrap: "How do you fix each one in production?",
    trapAnswer: "Stampede: Singleflight / Mutex lock so only 1 worker rebuilds, or probabilistic early refresh (XFetch). Avalanche: Jitter TTLs (TTL + rand(0, 300s)). Penetration: Bloom filters or cache null values with a short 60s TTL.",
    codeOrDiagram: `Stampede:    1 hot key expires -> 10,000 DB queries -> Fix: Mutex / SingleFlight
Avalanche:   Millions of keys expire at 00:00 -> DB dies -> Fix: Jitter TTLs
Penetration: Querying fake id=-9999 -> Always hits DB -> Fix: Bloom Filter`,
    tags: ["Caching", "Redis", "Resilience"]
  },
  {
    id: "dist-write-through-vs-back-vs-aside",
    category: "Performance & Caching",
    title: "Write-Through vs. Write-Back vs. Cache-Aside",
    frequency: "High",
    summary: "Synchronous dual-write vs asynchronous write buffer vs application-orchestrated.",
    sayThis20s: "Cache-Aside (Lazy Loading): Application queries cache; on miss, loads from DB and writes to cache. DB is source of truth. Write-Through: Application writes to cache, and cache synchronously writes to DB before acknowledging. Strong consistency, higher write latency. Write-Back (Write-Behind): Application writes to cache; cache acknowledges instantly and writes to DB asynchronously in batches. Blazing write speed, risk of data loss if cache crashes before flush.",
    interviewerTrap: "When is Write-Back strictly necessary?",
    trapAnswer: "High-frequency write workloads like gaming leaderboard score increments, IoT telemetry ingestion, or video view counters where writing to disk on every event would melt the database.",
    codeOrDiagram: `Cache-Aside:  App -> Cache miss -> App -> DB -> App writes Cache
Write-Through: App -> Cache -> (Sync) -> DB -> Return
Write-Back:    App -> Cache -> (Immediate Ack) ... (Async Batch) -> DB`,
    tags: ["Caching", "Redis", "System Patterns"]
  },

  // CATEGORY 4: Networking & Protocols
  {
    id: "dist-l4-vs-l7-lb",
    category: "Networking & Protocols",
    title: "L4 vs. L7 Load Balancing",
    frequency: "Extremely High",
    summary: "Transport layer IP:Port packet routing vs Application layer HTTP content routing.",
    sayThis20s: "L4 load balancers operate at the Transport Layer (TCP/UDP), routing traffic purely on IP address and port without terminating the connection or inspecting packet contents; they have ultra-low CPU overhead and handle millions of connections (AWS NLB, IPVS). L7 load balancers operate at the Application Layer (HTTP/HTTPS), parsing URLs, cookies, and HTTP headers; they enable smart routing, SSL termination, and header manipulation at the cost of slightly higher latency and memory (AWS ALB, Nginx, Envoy).",
    interviewerTrap: "Can an L4 load balancer balance requests across keep-alive HTTP/2 connections?",
    trapAnswer: "No! L4 balances TCP connections. Once an HTTP/2 connection is open, all multiplexed requests on that connection hit the exact same server unless an L7 proxy inspects the HTTP/2 streams.",
    codeOrDiagram: `L4: Client TCP Syn -> NLB -> Forward to Backend Server (No packet inspection)
L7: Client -> ALB (Terminates TLS, inspects /api/v1/checkout) -> Routes to Service`,
    tags: ["Load Balancing", "Envoy", "Nginx", "Networking"]
  },
  {
    id: "dist-websockets-vs-sse-vs-polling",
    category: "Networking & Protocols",
    title: "WebSockets vs. Server-Sent Events (SSE) vs. Long Polling",
    frequency: "Extremely High",
    summary: "Bi-directional TCP socket vs uni-directional HTTP stream vs hanging HTTP request.",
    sayThis20s: "WebSockets provide full-duplex, bidirectional communication over a single persistent TCP connection with negligible framing overhead (2 bytes); ideal for real-time chat, multiplayer games, and collaborative editing. SSE (Server-Sent Events) is unidirectional server-to-client streaming over standard HTTP with built-in reconnection and HTTP/2 multiplexing support; ideal for stock tickers, LLM token streaming (ChatGPT), and live sports scores. Long Polling opens an HTTP request that the server holds until data is available; legacy fallback when persistent sockets fail.",
    interviewerTrap: "Why did ChatGPT choose SSE over WebSockets for streaming tokens?",
    trapAnswer: "Because LLM chat is unidirectional (client sends prompt once, server streams tokens back). SSE runs over standard HTTP/2, traverses enterprise proxies/firewalls cleanly without protocol upgrades, and natively supports auto-reconnection with Last-Event-ID.",
    codeOrDiagram: `WebSockets:  Client <======== Bidirectional Full-Duplex ========> Server
SSE:         Client ──(HTTP POST)──> Server ════(Event Stream)════> Client
Long Poll:   Client ──(Hold HTTP)──> Wait... -> Data -> Close & Reopen`,
    tags: ["WebSockets", "SSE", "Protocols", "Realtime"]
  },

  // CATEGORY 5: Messaging & Event Architecture
  {
    id: "dist-fanout-write-vs-read",
    category: "Messaging & Architecture",
    title: "Fan-Out on Write (Push) vs. Fan-Out on Read (Pull)",
    frequency: "Extremely High (Twitter / Social Feed)",
    summary: "Eager pre-computed timeline caching vs on-demand follower merging.",
    sayThis20s: "Fan-out on write (Push): When a user tweets, we immediately push the tweet ID into the Redis timeline cache of every one of their followers. Reads are blazing fast O(1), but writes are disastrous for celebrities (e.g. Elon Musk with 150M followers causes 150M cache writes). Fan-out on read (Pull): When a user opens their feed, we fetch the latest tweets of everyone they follow and merge-sort on the fly. Writes are O(1), but reads are slow. Production systems use Hybrid: Fan-out on write for regular users; Fan-out on read for celebrities (>50K followers).",
    interviewerTrap: "What is this hybrid exception called in system design?",
    trapAnswer: "The 'Celebrity Problem' or 'Justin Bieber Effect'. Celebrity posts are never pushed to timelines; they are merged into the feed at read time.",
    codeOrDiagram: `Push (Write Fanout): Tweet -> Push to 10,000 follower Redis ZSETs (Fast Read, Heavy Write)
Pull (Read Fanout):  Open App -> Query DB for 500 followees -> Merge-sort (Slow Read)
Hybrid (Industry):   Push for regular users (<50k) + Pull & Merge for celebrities`,
    tags: ["Twitter", "System Design", "Caching", "Queues"]
  },
  {
    id: "dist-message-queue-vs-event-stream",
    category: "Messaging & Architecture",
    title: "Message Queue (RabbitMQ) vs. Distributed Log (Kafka)",
    frequency: "Extremely High",
    summary: "Point-to-point transient message deletion vs persistent partitioned append-only replayable log.",
    sayThis20s: "RabbitMQ is a message broker that tracks per-message delivery state: once a consumer acknowledges a message, it is deleted from the queue; it excels at complex routing, individual task retries, and worker queues. Kafka is a partitioned append-only distributed commit log: messages are immutable, retained by time regardless of consumption, and consumers track their own offsets; it excels at high-throughput event sourcing, analytics, and replayability for new services.",
    interviewerTrap: "Can RabbitMQ replay yesterday’s messages for a newly deployed microservice?",
    trapAnswer: "No! Acknowledged messages are deleted. Kafka retains them on disk, allowing any new consumer group to set its offset to 0 and replay the entire history.",
    codeOrDiagram: `RabbitMQ: Message -> Queue -> Consumer Acks -> Deleted! (Transient worker tasks)
Kafka:    Commit Log [0 | 1 | 2 | 3 | 4] -> Offset tracking (Replayable forever)`,
    tags: ["Kafka", "RabbitMQ", "Architecture"]
  }
];
