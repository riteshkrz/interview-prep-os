/**
 * 45-Day Interview Prep OS - 6-Week (42-Day) System Design Master Roadmap Workspace
 * Complete, opinionated day-by-day curriculum mapping Parts 0 to 13,
 * with weekly revision days every 7th day, and the 20 production specs
 * executed in the last 18 study days paired with key architectural concepts.
 */

import { state, toggleSysDesignRoadmapDay } from '../state.js';
import { SYSTEM_DESIGN_TOPICS_BY_DAY } from './systemDesignTopicsData.js';
import {
  READINESS_INDEXES,
  ROADMAP_DAY_READINESS_MAP,
  SPEC_READINESS_MAP,
  TOPIC_READINESS_MAP,
  getReadinessIndexesForDay,
  getReadinessIndexesForTopic,
  getReadinessIndexesForSpec,
  calculateAllReadinessIndexes
} from './readinessIndexesData.js';
import {
  renderHowToUseCourseContent,
  renderSevenStepFrameworkContent,
  renderEstimationMathContent,
  renderNumbersToMemoriseContent,
  renderProcessVsThreadContent,
  renderVirtualizationVsContainersContent,
  renderCloudModelsContent,
  renderAwsLambdaContent,
  renderScalingWebsiteContent,
  renderBigDataCloudContent,
  renderTcpUdpFundamentalsContent,
  renderHttpGenerationsContent,
  renderForwardVsReverseProxyContent,
  renderDnsLookupContent,
  renderUrlLifecycleContent,
  renderHttpStatusCodesContent,
  renderApiStylesContent,
  renderRealtimeProtocolsContent,
  renderJwtVsSessionContent,
  renderPasswordHashingContent,
  renderSsoOAuthOidcContent,
  renderRbacVsAbacContent,
  renderEncryptionFundamentalsContent,
  renderSqlVsNosqlContent,
  renderRateLimitingContent,
  renderLog4ShellContent,
  renderDatabaseIsolationMvccContent,
  renderOptimisticVsPessimisticLockingContent,
  renderCapVsPacelcContent,
  renderReplicationTradeoffsContent,
  renderReadReplicaPatternContent,
  renderDatabaseShardingContent,
  renderConsistentHashingContent,
  renderChoosingRightDatabaseContent,
  renderStorageEnginesContent,
  renderCacheStrategiesContent,
  renderCacheEvictionStampedeContent,
  renderRedisVsMemcachedContent,
  renderAsyncProcessingQueuesContent,
  renderRabbitMqVsKafkaContent,
  renderDistributedTransactionsSagaContent,
  renderEventDrivenArchitectureContent,
  renderDeliverySemanticsContent,
  renderWhyKafkaIsFastContent,
  renderBlockVsFileVsObjectContent,
  renderWhySsdsAreFastContent,
  renderErasureCodingVsReplicationContent,
  renderMetricsDatabaseContent,
  renderBigDataEvolutionContent,
  renderMicroserviceCollaborationContent,
  renderConsensusRaftContent,
  renderDistributedTimeOrderingContent,
  renderFailureDetectionContent,
  renderServiceMeshSidecarContent,
  renderGlobalTrafficManagementContent,
  renderScalingLongLivedConnectionsContent,
  renderWebRtcRealTimeMediaContent,
  renderUrlShortenerInterviewDesign,
  renderHttpsContent,
  renderCdnContent,
  renderBrowserInternalsContent,
  renderLoadBalancingContent,
  renderApiGatewayContent,
  renderWeek1RevisionContent,
  renderDeploymentStrategiesContent,
  renderResiliencePatternsContent,
  renderLinuxProcessTriageContent,
  renderSloErrorBudgetsContent,
  renderMultiRegionDisasterRecoveryContent,
  renderChaosEngineeringContent,
  renderWeek3RevisionContent,
  renderSystemDesignFrameworkContent,
  renderUrlShortenerDetail,
  renderDistributedRateLimiterDetail,
  renderNotificationSystemDetail,
  renderDistributedCacheDetail,
  renderApiGatewayDetail,
  renderInstagramDetail,
  renderWhatsAppDetail,
  renderYouTubeDetail,
  renderUberDetail,
  renderFoodDeliveryDetail,
  renderWebCrawlerDetail,
  renderSearchAutocompleteDetail,
  renderLoggingMonitoringDetail,
  renderRealTimeAnalyticsDetail,
  renderDistributedTaskSchedulerDetail,
  renderEcommercePlatformDetail,
  renderTicketBookingDetail,
  renderPaymentSystemDetail,
  renderCloudFileStorageDetail,
  renderAdImpressionTrackingDetail,
  renderFinalInterviewChecklistDetail
} from '../weeks/index.js';

export const SYSTEM_DESIGN_6_WEEK_ROADMAP = [
  // =========================================================================
  // WEEK 1: FRAMEWORKS, COMPUTE & CORE INGRESS (Days 1 to 7)
  // =========================================================================
  {
    day: 1,
    week: 1,
    weekTitle: "Frameworks, Compute & Core Ingress",
    topic: "Part 0 · The Playbook: Framework, Numbers & Estimation",
    domain: "Interview Playbook",
    difficulty: "Foundations",
    estTime: "75 mins",
    isRevision: false,
    objective: "Master the 7-Step Interview Delivery Framework, back-of-the-envelope estimation math, and the latency numbers every software engineer must memorize.",
    keyTradeoffs: [
      "The 45-Minute Pacing Rule: 8 min Requirements & Scope → 7 min Capacity & API → 15 min High-Level Architecture → 15 min Deep Dive Bottlenecks",
      "Latency Hierarchy to Memorize: L1 Cache (0.5 ns), RAM (100 ns), NVMe SSD (100 µs), Datacenter RTT (500 µs), Transcontinental CA to Netherlands (150 ms)",
      "Daily Traffic Estimation Formula: 100M DAU × 10 writes/day ≈ 1,150 QPS (Peak 2,300 QPS with 2× multiplier); 1 byte/req = 100 MB/day"
    ],
    readingLinks: [
      { title: "Latency Numbers Every Programmer Should Know (Interactive)", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html" },
      { title: "System Design Primer: Back-of-the-envelope calculations", url: "https://github.com/donnemartin/system-design-primer#back-of-the-envelope-calculations" }
    ]
  },
  {
    day: 2,
    week: 1,
    weekTitle: "Frameworks, Compute & Core Ingress",
    topic: "Compute Runtimes: Processes, Threads & Containers",
    domain: "Compute Foundations",
    difficulty: "Foundations",
    estTime: "70 mins",
    isRevision: false,
    objective: "Understand execution models, kernel context switching, memory segmentation, and containerization vs. full hardware virtualization.",
    keyTradeoffs: [
      "Process (isolated virtual address space, IPC via sockets/shared memory, high creation cost) vs. Thread (shared memory space, lightweight, race condition risks)",
      "Virtual Machines (Type-1/2 Hypervisor, guest OS overhead, full hardware isolation) vs. Containers (shared Linux kernel, cgroups resource limits, namespaces isolation)",
      "IaaS (raw VMs, AWS EC2) vs. PaaS (runtime managed, Heroku/Render) vs. SaaS (packaged software, Google Workspace)"
    ],
    readingLinks: [
      { title: "Julia Evans: What are Linux namespaces and cgroups?", url: "https://jvns.ca/blog/2016/10/10/what-even-is-a-container/" },
      { title: "Red Hat: Linux Process and Thread Management", url: "https://www.redhat.com/sysadmin" }
    ]
  },
  {
    day: 3,
    week: 1,
    weekTitle: "Frameworks, Compute & Core Ingress",
    topic: "Serverless Internals & Website Scaling to Millions",
    domain: "Cloud Architecture",
    difficulty: "Medium",
    estTime: "75 mins",
    isRevision: false,
    objective: "Analyze AWS Lambda execution internals (Firecracker microVMs), cold start mitigations, and the progressive architectural evolution to 10M+ users.",
    keyTradeoffs: [
      "AWS Lambda Behind the Scenes: MicroVMs (Firecracker), warm worker pools, execution context reuse vs. cold start latency penalties",
      "Scaling Lifecycle: Single Monolith → Read-Replicas + DB Split → Distributed Cache (Redis) → Stateless Web Cluster + LB → Multi-Region Sharding",
      "Big Data Cloud Evaluation: EMR (Hadoop/Spark on EC2) vs. BigQuery/Snowflake serverless columnar storage for analytical workloads"
    ],
    readingLinks: [
      { title: "AWS Firecracker: Lightweight MicroVMs for Serverless", url: "https://firecracker-microvm.github.io/" },
      { title: "High Scalability: Scaling Web Architecture from 1 to 10M Users", url: "http://highscalability.com" }
    ]
  },
  {
    day: 4,
    week: 1,
    weekTitle: "Frameworks, Compute & Core Ingress",
    topic: "Transport Protocols, Ingress & Security: TCP, UDP, HTTP/3, Forward & Reverse Proxies",
    domain: "Networking & Security",
    difficulty: "Medium",
    estTime: "80 mins",
    isRevision: false,
    objective: "Master connection lifecycles, flow control, head-of-line blocking, HTTP generations, and forward vs. reverse proxy boundaries.",
    keyTradeoffs: [
      "TCP (reliable byte stream, 3-way handshake, sliding window flow control) vs. UDP (datagrams, connectionless, zero handshake, loss-tolerant audio/video)",
      "HTTP/1.1 (pipelining HOL blocking) → HTTP/2 (single TCP stream multiplexing) → HTTP/3 QUIC (UDP transport, 0-RTT resumption, independent streams)",
      "Forward Proxy (Client privacy, corporate DLP, egress filtering) vs. Reverse Proxy (Ingress load balancing, TLS termination, WAF/DDoS, edge caching)"
    ],
    readingLinks: [
      { title: "Cloudflare: HTTP/3 vs. HTTP/2 Performance Benchmarks", url: "https://blog.cloudflare.com/http-3-vs-http-2/" },
      { title: "The Illustrated TLS 1.3 Connection", url: "https://tls13.xargs.org/" }
    ]
  },
  {
    day: 5,
    week: 1,
    weekTitle: "Frameworks, Compute & Core Ingress",
    topic: "DNS Resolution, Browser Pipeline & URL Navigation",
    domain: "Ingress Resolution",
    difficulty: "Foundations",
    estTime: "70 mins",
    isRevision: false,
    objective: "Trace the complete millisecond lifecycle of a web request from keystroke to DOM painting and multi-level DNS caching.",
    keyTradeoffs: [
      "DNS Resolution Hierarchy: Browser Cache → OS hosts cache → Recursive Resolver (ISP) → Root Nameserver (.) → TLD (.com) → Authoritative Nameserver",
      "What Happens When You Type a URL: Keystroke autocomplete → DNS resolution → TCP 3-way handshake → TLS negotiation → HTTP GET → HTML Parsing",
      "Browser Engine Pipeline: HTML Tokenization → DOM Construction → CSSOM → Render Tree → Layout Calculation (Reflow) → Pixel Painting"
    ],
    readingLinks: [
      { title: "Alex Gaynor: What happens when you type google.com into your browser", url: "https://github.com/alex/what-happens-when" },
      { title: "How Browsers Work: Behind the scenes of modern web browsers", url: "https://web.dev/howbrowserswork/" }
    ]
  },
  {
    day: 6,
    week: 1,
    weekTitle: "Frameworks, Compute & Core Ingress",
    topic: "Load Balancing (L4 vs. L7) & Modern API Paradigms",
    domain: "Traffic Routing & Ingress",
    difficulty: "Medium",
    estTime: "75 mins",
    isRevision: false,
    objective: "Route ingress traffic across server pools using transport and application-layer gateways, and compare REST, GraphQL, and gRPC contracts.",
    keyTradeoffs: [
      "Layer 4 (Transport, IP/Port routing, Maglev/IPVS, high packet throughput) vs. Layer 7 (Application, TLS termination, path routing, header inspection, Envoy/Nginx)",
      "API Styles: REST (resource-oriented, HTTP caching) vs. GraphQL (custom queries, single endpoint, N+1 problem) vs. gRPC (HTTP/2 binary Protobuf, high velocity)",
      "API Gateways & Service Discovery: Client-side discovery (Netflix Eureka) vs. Server-side discovery (AWS ALB / Kubernetes CoreDNS)"
    ],
    readingLinks: [
      { title: "Envoy Proxy Architecture Overview", url: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/arch_overview" },
      { title: "Google: Maglev - A Fast and Reliable Software Network Load Balancer", url: "https://research.google/pubs/pub44824/" }
    ]
  },
  {
    day: 7,
    week: 1,
    weekTitle: "Frameworks, Compute & Core Ingress",
    topic: "REVISION DAY 1 · Estimation Drills, Protocols & Ingress",
    domain: "Active Recall & Drills",
    difficulty: "Review & Mock",
    estTime: "80 mins",
    isRevision: true,
    objective: "Solidify Week 1 fundamentals: perform rapid back-of-the-envelope calculations, sketch network ingress flows, and drill protocol trade-offs.",
    keyTradeoffs: [
      "Flash Drill 1: Calculate the RAM and storage required for 500M daily active users uploading 1 photo (2 MB) per day with 3× replication",
      "Flash Drill 2: Draw the full protocol journey of a HTTPS GET request passing through DNS, L4 BGP Anycast, L7 Envoy, and reverse proxy",
      "Flash Drill 3: Defend when to use gRPC over GraphQL for internal microservices communication vs. public consumer clients"
    ],
    readingLinks: [
      { title: "System Design Interview Checklist for Senior Candidates", url: "https://github.com/donnemartin/system-design-primer" }
    ]
  },

  // =========================================================================
  // WEEK 2: SECURITY, DATA MODELING & DATABASE INTERNALS (Days 8 to 14)
  // =========================================================================
  {
    day: 8,
    week: 2,
    weekTitle: "Security, Data Modeling & Database Internals",
    topic: "Security Architecture: SSO, Password Hashing & API Tokens",
    domain: "Authentication & Security",
    difficulty: "Medium",
    estTime: "75 mins",
    isRevision: false,
    objective: "Implement zero-trust security boundaries, modern federation (OAuth2/SAML), cryptographic password storage, and HMAC request signing.",
    keyTradeoffs: [
      "Single Sign-On (SSO): OAuth 2.0 (delegated authorization) vs. OIDC (identity layer over OAuth) vs. SAML 2.0 (enterprise XML federation)",
      "Password Hashing: SHA-256 (vulnerable to GPU brute force) vs. Argon2id / bcrypt / scrypt (work-factor iteration, salt, memory hardness)",
      "Web API Security: Bearer JWT (stateless, revocation challenges) vs. HMAC SHA-256 (request payload signing, replay defense via timestamp/nonce)",
      "Zero-Day Case Study: Log4Shell (JNDI lookup executing remote untrusted Java LDAP code)"
    ],
    readingLinks: [
      { title: "OWASP Password Storage Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" },
      { title: "Cloudflare: Inside the Log4j Vulnerability (CVE-2021-44228)", url: "https://blog.cloudflare.com/inside-the-log4j2-vulnerability-cve-2021-44228/" }
    ]
  },
  {
    day: 9,
    week: 2,
    weekTitle: "Security, Data Modeling & Database Internals",
    topic: "Transactions: Isolation Levels, MVCC, CAP & PACELC",
    domain: "Transactions & Consistency",
    difficulty: "Hard",
    estTime: "85 mins",
    isRevision: false,
    objective: "Understand ACID isolation levels, multi-version concurrency control mechanics, and distributed consistency constraints.",
    keyTradeoffs: [
      "ANSI SQL Isolation Levels: Read Uncommitted (dirty reads) → Read Committed → Repeatable Read (phantom reads) → Serializable (2-Phase Locking / SSI)",
      "Multi-Version Concurrency Control (MVCC): Readers never block writers and writers never block readers via snapshot versioning",
      "CAP & PACELC Theorem: If Partition (P), choose Availability (A) vs. Consistency (C); Else (E), choose Latency (L) vs. Consistency (C)",
      "Optimistic Locking (version column check-and-set: `WHERE version = @v`) vs. Pessimistic Locking (`SELECT FOR UPDATE` blocking)"
    ],
    readingLinks: [
      { title: "Martin Kleppmann: Transactions & Isolation Levels in DDIA", url: "https://dataintensive.net/" },
      { title: "Daniel Abadi: Consistency Tradeoffs in Modern Distributed Database Design (PACELC)", url: "http://dbmsmusings.blogspot.com/2010/04/problems-with-cap-and_26.html" }
    ]
  },
  {
    day: 10,
    week: 2,
    weekTitle: "Security, Data Modeling & Database Internals",
    topic: "Replication Topology: Read-Replicas & Consistency Lag",
    domain: "Database Replication",
    difficulty: "Medium",
    estTime: "75 mins",
    isRevision: false,
    objective: "Evaluate synchronous vs. asynchronous database replication models, replica read lag, and cross-datacenter multi-master write conflicts.",
    keyTradeoffs: [
      "Synchronous Replication (zero data loss RPO, write latency dictated by slowest replica) vs. Asynchronous Replication (sub-ms writes, risk of lost data on failover)",
      "Replication Lag Anomalies: Monotonic Reads, Read-Your-Own-Writes (read from leader for 5s after write), and Consistent Prefix Reads",
      "Database Taxonomy: Relational (PostgreSQL, strict schema) vs. Document (MongoDB, JSON trees) vs. Key-Value (DynamoDB) vs. Wide-Column (Cassandra) vs. Graph (Neo4j)"
    ],
    readingLinks: [
      { title: "PostgreSQL Documentation: High Availability and Replication", url: "https://www.postgresql.org/docs/current/high-availability.html" }
    ]
  },
  {
    day: 11,
    week: 2,
    weekTitle: "Security, Data Modeling & Database Internals",
    topic: "Sharding Strategies & Storage Engines: B-Tree vs. LSM-Tree",
    domain: "Storage Engines & Sharding",
    difficulty: "Hard",
    estTime: "85 mins",
    isRevision: false,
    objective: "Horizontally partition datasets across shards and compare random I/O in B-Trees against append-only LSM-Tree commit logs.",
    keyTradeoffs: [
      "Range-Based Sharding (efficient range queries, hot-spotting on timestamp keys) vs. Hash-Based Sharding (uniform distribution, scatter-gather queries)",
      "Consistent Hashing: Hash ring with virtual nodes (vnodes) ensures only $K/N$ keys move during cluster resizing",
      "Storage Engine Internals: B-Tree (read-optimized, in-place updates, page write amplification) vs. LSM-Tree (write-optimized, append-only WAL + MemTable + SSTables with Leveled Compaction)"
    ],
    readingLinks: [
      { title: "RocksDB: A Persistent Key-Value Store for Fast Storage", url: "https://github.com/facebook/rocksdb/wiki/RocksDB-Basics" },
      { title: "Figma: Scaling Database Architecture via Partitioning", url: "https://www.figma.com/blog/how-figma-scaled-to-multiple-databases/" }
    ]
  },
  {
    day: 12,
    week: 2,
    weekTitle: "Security, Data Modeling & Database Internals",
    topic: "Time Series Databases & Big Data Evolution Papers",
    domain: "Time Series & Analytics",
    difficulty: "Hard",
    estTime: "80 mins",
    isRevision: false,
    objective: "Store high-cardinality telemetry data and understand the historical lineage from Google's GFS/MapReduce papers to modern data lakes.",
    keyTradeoffs: [
      "Time-Series DB Architecture: InfluxDB/TimescaleDB/Prometheus; Gorilla delta-of-delta timestamp compression and XOR floating-point encoding",
      "Big Data Foundation Papers: Google File System (GFS) chunk servers → MapReduce batch processing → Bigtable wide-column store",
      "Open Source Evolution: Hadoop HDFS → Apache Spark in-memory DAG engine → Apache Iceberg/Delta Lake ACID table formats"
    ],
    readingLinks: [
      { title: "Facebook Paper: Gorilla - A Fast, Scalable, In-Memory Time Series Database", url: "https://www.vldb.org/pvldb/vol8/p1816-teller.pdf" },
      { title: "Google GFS Paper: The Google File System", url: "https://research.google/pubs/pub51/" }
    ]
  },
  {
    day: 13,
    week: 2,
    weekTitle: "Security, Data Modeling & Database Internals",
    topic: "Caching Strategies, Cache Failures & Redis vs. Memcached",
    domain: "In-Memory Caching",
    difficulty: "Medium",
    estTime: "75 mins",
    isRevision: false,
    objective: "Eliminate read hot-spots, prevent catastrophic cache outages, and evaluate single-threaded vs. multi-threaded in-memory engines.",
    keyTradeoffs: [
      "The Five Cache Patterns: Cache-Aside, Read-Through, Write-Through, Write-Around, Write-Back (Write-Behind async persistence)",
      "The Three Failure Modes: Cache Penetration (nonexistent keys → Bloom filter defense), Cache Stampede (mutex lock / probabilistic early expiration XFetch), Cache Avalanche (randomized TTL jitter)",
      "Redis vs. Memcached: Redis (rich data structures: Sets, Sorted Sets, Hashes, Streams; single-threaded event loop; persistence via RDB/AOF) vs. Memcached (simple key-string, multi-threaded)"
    ],
    readingLinks: [
      { title: "Redis: An In-Depth Look at Redis Architecture", url: "https://redis.io/docs/manual/" },
      { title: "Facebook Paper: Scaling Memcache in Production", url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf" }
    ]
  },
  {
    day: 14,
    week: 2,
    weekTitle: "Security, Data Modeling & Database Internals",
    topic: "REVISION DAY 2 · Database Internals, Sharding & Caching",
    domain: "Active Recall & Drills",
    difficulty: "Review & Mock",
    estTime: "80 mins",
    isRevision: true,
    objective: "Consolidate Week 2 topics: drill ACID anomaly scenarios, sharding key selection, B-Tree vs. LSM compaction mechanics, and cache failure defenses.",
    keyTradeoffs: [
      "Flash Drill 1: Design a sharding key for a multi-tenant SaaS application that prevents noisy-neighbor write saturation",
      "Flash Drill 2: Explain step-by-step what happens when an LSM-Tree MemTable flushes to disk and how Bloom filters speed up point queries",
      "Flash Drill 3: Diagram how to resolve a Cache Stampede when 10,000 requests/sec request an expired popular product cache key"
    ],
    readingLinks: [
      { title: "Designing Data-Intensive Applications: Chapter 3 & 7", url: "https://dataintensive.net/" }
    ]
  },

  // =========================================================================
  // WEEK 3: STORAGE, MESSAGING & DISTRIBUTED FOUNDATIONS (Days 15 to 21)
  // =========================================================================
  {
    day: 15,
    week: 3,
    weekTitle: "Storage, Messaging & Distributed Foundations",
    topic: "Storage Architecture: Block, File, Object & SSD Internals",
    domain: "Physical & Cloud Storage",
    difficulty: "Medium",
    estTime: "75 mins",
    isRevision: false,
    objective: "Understand physical NVMe disk performance, storage classification, and mathematical durability via erasure coding.",
    keyTradeoffs: [
      "Storage Categories: Block Storage (SAN, raw unformatted volumes, AWS EBS, low-latency DB files) vs. File Storage (NFS, POSIX hierarchical tree) vs. Object Storage (S3, immutable REST blob keys)",
      "SSD Performance Mechanics: NAND flash pages vs. erase blocks, flash translation layer (FTL), write amplification factor, trim command",
      "Durability Math: $3\\times$ Replication (200% storage overhead, $3\\times$ cost) vs. Reed-Solomon Erasure Coding (e.g. 8+4 chunk configuration, 50% overhead, parity CPU cost)"
    ],
    readingLinks: [
      { title: "Coding for SSDs: What every programmer should know about solid-state drives", url: "https://codecapsule.com/2014/02/12/coding-for-ssds-part-1-introduction-and-table-of-contents/" },
      { title: "Backblaze: Erasure Coding Explained Simply", url: "https://www.backblaze.com/blog/reed-solomon/" }
    ]
  },
  {
    day: 16,
    week: 3,
    weekTitle: "Storage, Messaging & Distributed Foundations",
    topic: "Messaging, Event Streaming & Why Kafka Is Fast",
    domain: "Event Streaming & Queues",
    difficulty: "Hard",
    estTime: "85 mins",
    isRevision: false,
    objective: "Build high-throughput append-only distributed event brokers, evaluate delivery semantics, and design Saga workflows.",
    keyTradeoffs: [
      "Delivery Semantics: At-Most Once (fire and forget), At-Least Once (retries on timeout, requires idempotent consumer), Exactly Once (transactional producer + consumer offset commit)",
      "Why Kafka Is So Fast: Sequential disk I/O (matches RAM speeds), OS page cache utilization, zero-copy `sendfile` network socket transfer, batch compression",
      "Microservice Transactions: Orchestration (central orchestrator sends commands, e.g. Temporal) vs. Choreography (services react to domain events via Kafka)"
    ],
    readingLinks: [
      { title: "Apache Kafka Design Documentation", url: "https://kafka.apache.org/documentation/#design" },
      { title: "Microservice Architecture: Saga Pattern", url: "https://microservices.io/patterns/data/saga.html" }
    ]
  },
  {
    day: 17,
    week: 3,
    weekTitle: "Storage, Messaging & Distributed Foundations",
    topic: "Distributed Systems Core: Consensus, Time & Ordering",
    domain: "Distributed Systems Theory",
    difficulty: "Staff Level",
    estTime: "90 mins",
    isRevision: false,
    objective: "Coordinate state machines across unreliable asynchronous networks, handle clock drift, and resolve partition conflicts.",
    keyTradeoffs: [
      "Consensus Protocols: Paxos vs. Raft (Leader election via randomized timers, Log replication, Safety invariants); Multi-Raft in TiKV & CockroachDB",
      "Distributed Time: Physical clocks (NTP drift, TrueTime GPS/atomic clocks in Google Spanner) vs. Logical clocks (Lamport timestamps, Vector clocks for causal ordering)",
      "Conflict Resolution: Last-Write-Wins (data loss risk) vs. Multi-Version Concurrency vs. Merkle Tree anti-entropy background synchronization",
      "Failure Detectors: Heartbeat pings, timeout thresholds, and $\\phi$-accrual failure detectors"
    ],
    readingLinks: [
      { title: "The Raft Consensus Paper: In Search of an Understandable Consensus Algorithm", url: "https://raft.github.io/raft.pdf" },
      { title: "Google Spanner: Google's Globally Distributed Database", url: "https://research.google/pubs/pub39966/" }
    ]
  },
  {
    day: 18,
    week: 3,
    weekTitle: "Storage, Messaging & Distributed Foundations",
    topic: "Advanced Networking: Service Mesh, Anycast & WebRTC",
    domain: "Advanced Networking",
    difficulty: "Hard",
    estTime: "80 mins",
    isRevision: false,
    objective: "Manage east-west service communication, planetary Anycast routing, connection scalability (C10M), and peer-to-peer real-time media.",
    keyTradeoffs: [
      "Service Mesh (Istio, Linkerd): Sidecar proxy (Envoy) handling mTLS, distributed tracing, retries, and circuit breaking transparent to application code",
      "Global Traffic Management: BGP Anycast (multiple datacenters advertise same IP address; nearest router routes request) vs. DNS-based GSLB",
      "Scaling Long-Lived Connections: Linux `epoll` event loop, file descriptor limits (`ulimit`), socket memory buffers tuning",
      "WebRTC Architecture: Peer-to-peer media streaming, SDP session negotiation, NAT traversal via STUN/TURN servers"
    ],
    readingLinks: [
      { title: "Istio Architecture and Concepts", url: "https://istio.io/latest/docs/concepts/what-is-istio/" },
      { title: "Cloudflare: What is Anycast and How Does It Work?", url: "https://www.cloudflare.com/learning/cdn/glossary/anycast-network/" }
    ]
  },
  {
    day: 19,
    week: 3,
    weekTitle: "Storage, Messaging & Distributed Foundations",
    topic: "Deployment Patterns, Circuit Breakers & Linux Diagnostics",
    domain: "Reliability & Operations",
    difficulty: "Medium",
    estTime: "75 mins",
    isRevision: false,
    objective: "Deploy software with zero downtime, build cascading failure circuit breakers, and diagnose runaway production processes on Linux.",
    keyTradeoffs: [
      "Six Deployment Strategies: Recreate (downtime), Rolling (gradual replacement), Blue/Green (instant rollback, 2× infrastructure cost), Canary (traffic ramp: 1% → 10% → 100%), A/B Testing, Shadow/Mirroring",
      "Resilience Primitives: Exponential backoff with full jitter, circuit breakers (Closed → Open → Half-Open states), bulkheading, backpressure",
      "Linux Production Debugging: Identifying runaway CPU/memory with `top -H`, `vmstat`, `iostat`, `strace`, `perf`, and thread dump thread state inspection"
    ],
    readingLinks: [
      { title: "Martin Fowler: Canary Releases", url: "https://martinfowler.com/bliki/CanaryRelease.html" },
      { title: "Netflix Hystrix: Circuit Breaker Pattern", url: "https://github.com/Netflix/Hystrix/wiki/How-it-Works" }
    ]
  },
  {
    day: 20,
    week: 3,
    weekTitle: "Storage, Messaging & Distributed Foundations",
    topic: "SLIs/SLOs, Multi-Region DR & Chaos Engineering",
    domain: "SRE & Disaster Recovery",
    difficulty: "Hard",
    estTime: "80 mins",
    isRevision: false,
    objective: "Define availability error budgets, architect multi-region active-active disaster recovery, and inject chaos into live clusters.",
    keyTradeoffs: [
      "Reliability Metrics: SLI (measured latency/error rate) → SLO (target goal, e.g. 99.9% under 200ms) → SLA (contractual legal commitment with financial penalties)",
      "Multi-Region Architectures: Active-Passive (asynchronous DB replica in backup region, RTO/RPO trade-off) vs. Active-Active (planetary read/write, partition reconciliation)",
      "Chaos Engineering: Principles of Chaos, Game Days, Chaos Monkey (random instance termination), Chaos Kong (datacenter evacuation simulation)"
    ],
    readingLinks: [
      { title: "Google SRE Book: Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/" },
      { title: "Principles of Chaos Engineering", url: "https://principlesofchaos.org/" }
    ]
  },
  {
    day: 21,
    week: 3,
    weekTitle: "Storage, Messaging & Distributed Foundations",
    topic: "REVISION DAY 3 · Distributed Consensus, Kafka & Multi-Region",
    domain: "Active Recall & Drills",
    difficulty: "Review & Mock",
    estTime: "85 mins",
    isRevision: true,
    objective: "Master Week 3 distributed core: explain Raft leader election invariants, diagram zero-copy Kafka data flows, and design cross-region failover protocols.",
    keyTradeoffs: [
      "Flash Drill 1: Explain step-by-step how a Raft cluster handles a network partition where the leader is isolated with a minority of nodes",
      "Flash Drill 2: Trace a message byte from producer network socket through Kafka broker page cache to consumer disk without CPU memory copying",
      "Flash Drill 3: Contrast Blue-Green deployment with Canary deployment for a microservice with stateful database migrations"
    ],
    readingLinks: [
      { title: "The Secret Lives of Data: Raft Visualization", url: "http://thesecretlivesofdata.com/raft/" }
    ]
  },

  // =========================================================================
  // WEEK 4: MASTERCLASS PART I & MODULE 1 (Days 22 to 28)
  // Core System Design & Consumer Messaging
  // =========================================================================
  {
    day: 22,
    week: 4,
    weekTitle: "Masterclass: Core System Design",
    topic: "Question 1. Design a URL Shortener like Bitly",
    domain: "Unique IDs & Caching",
    difficulty: "Medium",
    estTime: "80 mins",
    specId: "sd-1",
    isRevision: false,
    objective: "Master the 7-Step System Design Framework and architect a high-read URL shortener with Base62 encoding, Redis caching, and 302 redirection.",
    keyTradeoffs: [
      "Base62 IDs (short codes, fast decode) vs. Random codes (collision retry loop)",
      "HTTP 302 Found (full click telemetry) vs. HTTP 301 Moved Permanently (browser cached)",
      "Single-region sequencer vs. Multi-region GeoDNS routing with read-replicas"
    ],
    readingLinks: [
      { title: "System Design Masterclass: URL Shortener Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 23,
    week: 4,
    weekTitle: "Masterclass: Core System Design",
    topic: "Question 2. Design a Distributed Rate Limiter",
    domain: "Traffic Control & Security",
    difficulty: "Medium",
    estTime: "80 mins",
    specId: "sd-18",
    isRevision: false,
    objective: "Protect APIs from bursts using Token Bucket algorithm, atomic Redis Lua scripts, and HTTP 429 Retry-After headers.",
    keyTradeoffs: [
      "Token Bucket (allows controlled bursts) vs. Sliding Window Counter (accurate, modest state)",
      "Atomic Redis Lua scripts (guarantee race-free checks) vs. Client-side local token leases",
      "Fail-open with local limits on cache outage vs. Fail-closed on sensitive auth routes"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Distributed Rate Limiter Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 24,
    week: 4,
    weekTitle: "Masterclass: Core System Design",
    topic: "Question 3. Design a Notification System",
    domain: "Async Messaging & Push",
    difficulty: "Medium",
    estTime: "80 mins",
    specId: "sd-8",
    isRevision: false,
    objective: "Deliver billions of push, SMS, and email alerts with persistent priority queues, worker pools, provider adapters, and idempotency.",
    keyTradeoffs: [
      "Queue Segregation: Separate urgent transactional alerts (OTP) from bulk marketing campaigns",
      "Provider Idempotency: Stable idempotency keys prevent duplicate deliveries during retries",
      "Circuit breakers and failover providers for external gateway outages"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Notification System Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 25,
    week: 4,
    weekTitle: "Masterclass: Core System Design",
    topic: "Question 4. Design a Distributed Cache",
    domain: "In-Memory Systems",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-3",
    isRevision: false,
    objective: "Architect a sub-millisecond distributed key-value cache with consistent hashing, LRU/LFU eviction, and cache stampede protection.",
    keyTradeoffs: [
      "Consistent Hashing: Minimizes key redistribution when nodes join or leave the cluster",
      "Cache-aside with singleflight request coalescing and TTL jitter to prevent stampedes",
      "Replication vs. Regenerating state from authoritative database on miss"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Distributed Cache Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 26,
    week: 4,
    weekTitle: "Masterclass: Core System Design",
    topic: "Question 5. Design an API Gateway",
    domain: "Edge Ingress & Policies",
    difficulty: "Medium",
    estTime: "80 mins",
    specId: "sd-18",
    isRevision: false,
    objective: "Propose a single entry for north-south client traffic handling TLS offloading, token auth, rate limiting, and route resolution.",
    keyTradeoffs: [
      "Keep domain business logic strictly out of the gateway to avoid tight coupling",
      "Bounded timeouts, connection limits, and circuit breakers guard downstream dependencies",
      "Stateless gateway fleet horizontally scaled behind L4 DNS load balancers"
    ],
    readingLinks: [
      { title: "System Design Masterclass: API Gateway Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 27,
    week: 4,
    weekTitle: "Masterclass: Core System Design",
    topic: "Question 6. Design Instagram",
    domain: "Consumer Media & Feeds",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-6",
    isRevision: false,
    objective: "Photo-sharing service where users upload media via direct presigned URLs, follow accounts, and scroll personalized feeds.",
    keyTradeoffs: [
      "Client-direct upload to object storage bypasses application server bandwidth bottlenecks",
      "Hybrid fan-out: Push fan-out for normal users, Pull fan-out for high-follower celebrity accounts",
      "Cursor-based pagination eliminates offset degradation on high-velocity feeds"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Instagram Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 28,
    week: 4,
    weekTitle: "Masterclass: Core System Design",
    topic: "Question 7. Design WhatsApp",
    domain: "Real-Time Collaboration",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-7",
    isRevision: false,
    objective: "Real-time messaging system with persistent WebSocket connections, offline delivery queuing, delivery receipts, and end-to-end encryption.",
    keyTradeoffs: [
      "Persistent WebSocket connection gateways with session/presence routing",
      "Per-conversation sequence metadata ensures ordering without costly global coordination",
      "End-to-end encryption keeps message bodies inaccessible to servers"
    ],
    readingLinks: [
      { title: "System Design Masterclass: WhatsApp Walkthrough", url: "#/dashboard" }
    ]
  },

  // =========================================================================
  // WEEK 5: MASTERCLASS MODULE 2 & 3 (Days 29 to 35)
  // Consumer Scale & Data-Intensive Systems
  // =========================================================================
  {
    day: 29,
    week: 5,
    weekTitle: "Masterclass: Consumer Scale & Data-Intensive",
    topic: "Question 8. Design YouTube",
    domain: "Media Streaming & Transcoding",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-10",
    isRevision: false,
    objective: "Video platform with resumable multipart chunk uploads, distributed GPU transcoding DAGs, HLS/DASH adaptive bitrate streaming, and CDN edge delivery.",
    keyTradeoffs: [
      "Resumable chunked uploads straight to object storage prevent app server saturation",
      "Asynchronous transcoding workers produce multi-bitrate HLS/DASH playlists",
      "Edge CDN PoPs cache segments close to viewers with adaptive bitrate player switching"
    ],
    readingLinks: [
      { title: "System Design Masterclass: YouTube Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 30,
    week: 5,
    weekTitle: "Masterclass: Consumer Scale & Data-Intensive",
    topic: "Question 9. Design Uber",
    domain: "Geospatial Streams & Dispatch",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-12",
    isRevision: false,
    objective: "Ride-hailing platform with high-frequency GPS ingestion, geospatial indexing (H3 / Geohash), candidate driver ranking, and atomic trip matching.",
    keyTradeoffs: [
      "Decouple ephemeral in-memory location index from durable trip records in PostgreSQL",
      "Atomic conditional assignment ensures at most one rider claims a given driver",
      "Explicit trip state machine: REQUESTED -> MATCHED -> DRIVER_ARRIVING -> IN_PROGRESS -> COMPLETED"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Uber Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 31,
    week: 5,
    weekTitle: "Masterclass: Consumer Scale & Data-Intensive",
    topic: "Question 10. Design a Food Delivery Platform",
    domain: "Multi-Party Order Lifecycle",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-14",
    isRevision: false,
    objective: "Connect customers, restaurants, and couriers with catalog caching, idempotent order submission, payment orchestration, and courier matching.",
    keyTradeoffs: [
      "Saga orchestration replaces distributed transactions across order, payment, and courier services",
      "Price snapshots in OrderItem line items protect purchases from subsequent menu price changes",
      "Idempotency keys prevent duplicate orders during client network retries"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Food Delivery Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 32,
    week: 5,
    weekTitle: "Masterclass: Consumer Scale & Data-Intensive",
    topic: "Question 11. Design a Web Crawler",
    domain: "Web Ingestion & Indexing",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-17",
    isRevision: false,
    objective: "Distributed crawler starting from seed URLs, scheduling via polite URL frontiers, robots.txt caching, Bloom filter deduplication, and S3 content storage.",
    keyTradeoffs: [
      "Host-level politeness queues prevent flooding target web domains",
      "Bloom filters in RAM for 10B+ URL existence deduplication",
      "Store bulky HTML payloads in object storage rather than scheduler database tables"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Web Crawler Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 33,
    week: 5,
    weekTitle: "Masterclass: Consumer Scale & Data-Intensive",
    topic: "Question 12. Design Search Autocomplete",
    domain: "Prefix Search & Ranking",
    difficulty: "Hard",
    estTime: "80 mins",
    specId: "sd-16",
    isRevision: false,
    objective: "Prefix query suggestions with in-memory tries, precomputed top-K candidates at prefix nodes, caching, and versioned offline index rollouts.",
    keyTradeoffs: [
      "Precomputing top-K results directly at trie nodes keeps query latency strictly under 20ms",
      "Atomic in-memory pointer swaps swap fresh weekly index snapshots with zero downtime",
      "Prefix caching at CDN / Redis edge layers absorbs viral single-character search loads"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Search Autocomplete Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 34,
    week: 5,
    weekTitle: "Masterclass: Consumer Scale & Data-Intensive",
    topic: "Question 13. Design a Logging and Monitoring System",
    domain: "Telemetry & Time-Series",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-5",
    isRevision: false,
    objective: "Telemetry ingestion pipeline with edge ring buffers, Kafka buffering, hot search indexes (OpenSearch), time-series metric rollups, and cold S3 archives.",
    keyTradeoffs: [
      "Bounded local buffers at the edge ensure business services never crash when logging fails",
      "Storage tiering: Hot full-text search (7-14 days) vs. Cold compressed Parquet in S3 (1 year)",
      "Avoid high-cardinality metric labels to protect time-series metrics backends"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Logging & Monitoring Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 35,
    week: 5,
    weekTitle: "Masterclass: Consumer Scale & Data-Intensive",
    topic: "Question 14. Design a Real-Time Analytics Pipeline",
    domain: "Stream Processing & OLAP",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-5",
    isRevision: false,
    objective: "Continuous stream processing with Kafka, Flink windowing on event time, watermarks for late events, deduplication, and real-time OLAP stores.",
    keyTradeoffs: [
      "Event-time processing with watermarks handles late and out-of-order event arrivals",
      "Dual-path architecture: Real-time OLAP for live dashboards + Batch reconciliation for authoritative billing",
      "Idempotent sink writes ensure exactly-once business outcomes on stream retries"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Real-Time Analytics Walkthrough", url: "#/dashboard" }
    ]
  },

  // =========================================================================
  // WEEK 6: MASTERCLASS MODULE 3 & 4 (Days 36 to 42)
  // Schedulers, Business-Critical Systems & Capstone
  // =========================================================================
  {
    day: 36,
    week: 6,
    weekTitle: "Masterclass: Business-Critical Systems",
    topic: "Question 15. Design a Distributed Task Scheduler",
    domain: "Job Orchestration & Leases",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-20",
    isRevision: false,
    objective: "Fires one-shot and recurring jobs with timing wheels, time-bounded database leases, durable queues, worker heartbeats, and audit trails.",
    keyTradeoffs: [
      "Separate task definitions from execution history records for clean retry tracking",
      "Atomic conditional leases prevent concurrent schedulers from double-assigning runs",
      "Heartbeats and fencing tokens guard against zombie worker clobbering"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Distributed Task Scheduler Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 37,
    week: 6,
    weekTitle: "Masterclass: Business-Critical Systems",
    topic: "Question 16. Design an E-Commerce Platform",
    domain: "Inventory Holds & Checkout",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-14",
    isRevision: false,
    objective: "E-commerce platform covering product catalog, shopping cart, checkout, atomic inventory holds, orders, and payment orchestration.",
    keyTradeoffs: [
      "Atomic conditional SQL updates (WHERE available_qty >= :qty) prevent overselling and negative inventory",
      "Price snapshots in order line items protect against subsequent catalog price changes",
      "Idempotent checkout prevents duplicate orders during network connection drops"
    ],
    readingLinks: [
      { title: "System Design Masterclass: E-Commerce Platform Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 38,
    week: 6,
    weekTitle: "Masterclass: Business-Critical Systems",
    topic: "Question 17. Design a Ticket Booking System",
    domain: "Concurrency & Seat Holds",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-14",
    isRevision: false,
    objective: "Event ticketing with numbered seating, 5-minute optimistic holds, payment coordination, automatic hold expiry, and anti-double booking guarantees.",
    keyTradeoffs: [
      "Authoritative store conditional state transitions from AVAILABLE to HELD ensure single-winner seat assignment",
      "Background worker safely releases expired holds without corrupting completed sales",
      "Virtual waiting rooms absorb extreme on-sale demand spikes before database tier"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Ticket Booking Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 39,
    week: 6,
    weekTitle: "Masterclass: Business-Critical Systems",
    topic: "Question 18. Design a Payment System",
    domain: "Fintech, Ledgers & Idempotency",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-15",
    isRevision: false,
    objective: "Payment service with idempotency keys, payment state machines, immutable double-entry ledger entries, provider webhooks, and reconciliation.",
    keyTradeoffs: [
      "Idempotency keys eliminate double charging when payment requests time out",
      "Immutable double-entry ledger ensures total debits always equal total credits",
      "Daily automated reconciliation matches internal records against provider settlement reports"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Payment System Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 40,
    week: 6,
    weekTitle: "Masterclass: Business-Critical Systems",
    topic: "Question 19. Design a Cloud File Storage Service like Dropbox",
    domain: "Object Storage & File Sync",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-4",
    isRevision: false,
    objective: "Cloud storage where users upload files, sync across devices with cursors, manage versions, share files, and resolve simultaneous edit conflicts.",
    keyTradeoffs: [
      "Chunked block uploads (e.g. 4MB) directly to object storage provide resilience for large files",
      "Sequential sync cursors enable reliable catch-up after offline disconnected periods",
      "Optimistic version checks expose simultaneous edits and create conflict copies"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Dropbox Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 41,
    week: 6,
    weekTitle: "Masterclass: Business-Critical Systems",
    topic: "Question 20. Design an Ad Impression Tracking System",
    domain: "Ad-Tech & Real-Time Streams",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-5",
    isRevision: false,
    objective: "Pipeline ingesting ad impressions at 100K-500K eps, deduplicating with stable event IDs, event-time window aggregation, and batch reconciliation.",
    keyTradeoffs: [
      "Stable event IDs prevent publisher retries from inflating billable impression counts",
      "Stream processing produces real-time provisional dashboards; batch reconciles final billing",
      "Partitioning strategy balances throughput without creating single-campaign hot partitions"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Ad Impression Tracking Walkthrough", url: "#/dashboard" }
    ]
  },
  {
    day: 42,
    week: 6,
    weekTitle: "Masterclass: Business-Critical Systems",
    topic: "Final Interview Checklist & Masterclass Principles",
    domain: "Staff Capstone Readiness",
    difficulty: "Review & Mock",
    estTime: "90 mins",
    isRevision: true,
    objective: "Audit your readiness against the 10-point checklist and memorize the 6 core architectural principles before entering senior and staff interviews.",
    keyTradeoffs: [
      "Begin with the smallest design that satisfies requirements rather than premature over-engineering",
      "Tie every single architectural choice to a concrete bottleneck or failure mode rationale",
      "Review the 10-point readiness checklist across all 20 Masterclass system walkthroughs"
    ],
    readingLinks: [
      { title: "System Design Masterclass: Final Interview Checklist & Principles", url: "#/dashboard" }
    ]
  }
];

export function calculateReadinessIndex(roadmapState = {}) {
  return calculateAllReadinessIndexes(roadmapState);
}

export function renderReadinessIndexCard(metrics, activeReadinessFilter = 'all') {
  const { overall, weeklyGain, indexes = [] } = metrics;
  
  // Circumference for r=46 is 289.03
  const circumference = 289.03;
  const strokeOffset = circumference * (1 - (overall / 100));

  const activeIndexObj = indexes.find(i => i.id === activeReadinessFilter);

  return `
    <div id="readiness-index-card" class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-lg shadow-black/40 h-full relative overflow-hidden select-text">
      <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Header Row: Icon, Title & Filter Status -->
      <div class="flex items-center justify-between gap-3 z-10">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-[#38BDF8] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l2.4 2.4 3.4-.4 1.2 3.2 3.1 1.4-1 3.2 1.9 2.8-2.3 2.5.2 3.4-3.4 1.2-1.4 3.1-3.2-1-2.8 1.9-2.5-2.3-3.4.2-1.2-3.4-3.1-1.4 1-3.2-1.9-2.8 2.3-2.5-.2-3.4 3.4-1.2 1.4-3.1 3.2 1 2.8-1.9z" fill="#0E2A3E" stroke="#38BDF8"/>
            <path d="M9 12l2 2 4-4" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="flex flex-col">
            <h3 class="font-sans text-[16.5px] font-bold text-white tracking-tight leading-none">Readiness Index</h3>
            <span class="text-[10px] font-sans text-slate-400 mt-0.5">10 Core Dimensions</span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          ${activeReadinessFilter !== 'all' ? `
            <button
              type="button"
              class="sys-roadmap-filter-readiness px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400 flex items-center gap-1 cursor-pointer"
              data-readiness-filter="${activeReadinessFilter}"
              title="Clear readiness filter"
            >
              <span>${activeIndexObj?.shortName || activeReadinessFilter}</span>
              <span class="material-symbols-outlined text-[12px]">close</span>
            </button>
          ` : ''}
          <span class="px-2.5 py-0.5 rounded-md text-[10.5px] font-sans tracking-wider uppercase font-semibold text-[#38BDF8] bg-[#0E2A3E]/90 border border-cyan-500/30">
            L5/L6 CALIBRATED
          </span>
        </div>
      </div>

      <!-- Body: Donut Ring on Left, 10 Category Chips on Right -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center z-10">
        
        <!-- Left: Donut Progress Ring -->
        <div class="sm:col-span-4 flex flex-col items-center justify-center">
          <div class="w-28 h-28 relative flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="46"
                stroke="#1A2337"
                stroke-width="9"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="46"
                stroke="#38BDF8"
                stroke-width="9"
                stroke-linecap="round"
                fill="transparent"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${strokeOffset}"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span class="text-[24px] font-bold font-sans text-white tracking-tight leading-none">${overall}%</span>
              <span class="text-[9.5px] font-sans text-cyan-400 font-bold uppercase tracking-widest mt-1">OVERALL</span>
            </div>
          </div>

          <div class="flex items-center gap-1 text-[11px] font-sans text-[#34D399] font-semibold mt-2">
            <span class="material-symbols-outlined text-[14px]">trending_up</span>
            <span>+${weeklyGain}% this wk</span>
          </div>
        </div>

        <!-- Right: 10 Domain Progress Chips (2 columns x 5 rows) -->
        <div class="sm:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-h-[220px] overflow-y-auto pr-0.5 custom-scrollbar">
          ${indexes.map(idx => {
            const isSelected = (activeReadinessFilter === idx.id);
            return `
              <div
                class="sys-roadmap-readiness-chip flex flex-col gap-1 p-2 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-cyan-500/20 border-cyan-400 shadow-xs shadow-cyan-500/20 ring-1 ring-cyan-400' : 'bg-[#0F1626]/90 border-[#24314A]/70 hover:border-slate-500 hover:bg-[#151E33]'}"
                data-readiness-id="${idx.id}"
                data-readiness-filter="${idx.id}"
                title="${escapeHtml(idx.name)}: ${idx.totalMapped} curriculum days (Click to filter)"
              >
                <div class="flex items-center justify-between text-[11px] font-sans">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="material-symbols-outlined text-[13px] shrink-0" style="color: ${idx.color}">${idx.icon}</span>
                    <span class="text-slate-200 font-medium truncate">${idx.shortName}</span>
                  </div>
                  <span class="font-bold text-[11px] shrink-0" style="color: ${idx.color}">${idx.score}%</span>
                </div>
                <div class="w-full bg-[#1A2337] h-1.5 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-700 shadow-xs"
                    style="background-color: ${idx.color}; width: ${idx.score}%"
                  ></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    </div>
  `;
}

export function getActiveRoadmapDay() {
  if (state.activeSysDesignDay && state.activeSysDesignDay >= 1 && state.activeSysDesignDay <= 42) {
    return state.activeSysDesignDay;
  }
  const roadmapState = state.sysDesignRoadmap || {};
  const firstIncomplete = SYSTEM_DESIGN_6_WEEK_ROADMAP.find(d => !roadmapState[d.day]?.completed);
  return firstIncomplete ? firstIncomplete.day : 1;
}

export function setActiveRoadmapDay(day) {
  const d = parseInt(day, 10);
  if (!isNaN(d) && d >= 1 && d <= 42) {
    state.activeSysDesignDay = d;
  }
}

export function renderSystemDesignRoadmapView(weekFilter = 'today', statusFilter = 'all', searchQuery = '', readinessFilter = 'all') {
  const roadmapState = state.sysDesignRoadmap || {};
  const currentActiveDay = getActiveRoadmapDay();
  const todayItem = SYSTEM_DESIGN_6_WEEK_ROADMAP.find(d => d.day === currentActiveDay) || SYSTEM_DESIGN_6_WEEK_ROADMAP[0];
  const isTodayMode = (weekFilter === 'today') && !searchQuery && (readinessFilter === 'all');

  // Calculate statistics across 42 days
  let completedCount = 0;
  SYSTEM_DESIGN_6_WEEK_ROADMAP.forEach(d => {
    if (roadmapState[d.day]?.completed) {
      completedCount++;
    }
  });

  const totalDays = SYSTEM_DESIGN_6_WEEK_ROADMAP.length; // 42
  const pct = Math.round((completedCount / totalDays) * 100);
  const estTotalHours = Math.round(completedCount * 1.35);

  // Filter roadmap days
  let filtered = [...SYSTEM_DESIGN_6_WEEK_ROADMAP];

  if (weekFilter !== 'all' && weekFilter !== 'today') {
    const targetWeek = parseInt(weekFilter, 10);
    if (!isNaN(targetWeek)) {
      filtered = filtered.filter(d => d.week === targetWeek);
    }
  }

  if (readinessFilter && readinessFilter !== 'all') {
    filtered = filtered.filter(d => {
      const dayIndexes = ROADMAP_DAY_READINESS_MAP[d.day] || [];
      return dayIndexes.includes(readinessFilter);
    });
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

  const weeksSummary = [1, 2, 3, 4, 5, 6].map(w => {
    const weekDays = SYSTEM_DESIGN_6_WEEK_ROADMAP.filter(d => d.week === w);
    const weekDone = weekDays.filter(d => roadmapState[d.day]?.completed).length;
    return {
      week: w,
      title: weekDays[0]?.weekTitle || `Week ${w}`,
      done: weekDone,
      total: weekDays.length
    };
  });

  const readinessMetrics = calculateReadinessIndex(roadmapState);

  return `
    <div class="flex flex-col gap-5 w-full animate-fadeIn" id="system-design-roadmap-view">
      
      <!-- Top Grid: Hero Banner + Readiness Index -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
        
        <!-- Left: 6-Week Roadmap Hero Banner (lg:col-span-7) -->
        <div class="lg:col-span-7 bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col justify-between gap-5 shadow-lg shadow-black/40 relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex flex-col gap-2 z-10">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">alt_route</span>
              </div>
              <h1 class="font-sans text-[20px] font-bold text-white tracking-tight">6-Week System Design Roadmap</h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-sans bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
                42 Days • 6 Weeks • L5/L6 Focus
              </span>
            </div>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              A comprehensive 6-week curriculum covering Parts 0 to 13 with weekly revision days every 7th day, leading into the 20 production specs in the last 18 study days paired with architectural theory.
            </p>

            <!-- Week-by-Week Progress Indicator -->
            <div class="flex flex-wrap items-center gap-2 pt-2">
              ${weeksSummary.map(w => `
                <button
                  class="roadmap-week-chip px-2 py-1 rounded text-[11px] font-sans border transition-all cursor-pointer ${weekFilter === String(w.week) ? 'bg-[#4F46E5] border-[#4F46E5] text-white font-semibold shadow-xs' : 'bg-[#0F1626] border-[#24314A] text-slate-400 hover:text-white'}"
                  data-filter-week="${w.week}"
                  title="${w.title}"
                >
                  W${w.week}: <span class="${w.done === w.total ? 'text-emerald-400' : 'text-cyan-300'}">${w.done}/${w.total}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Badges inside Hero Banner -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#24314A]/70 text-[11.5px] font-sans z-10">
            <span class="text-slate-300">Days: <strong class="text-white">${completedCount} / ${totalDays}</strong></span>
            <span class="text-slate-400">Roadmap Progress: <strong class="text-cyan-400">${pct}%</strong></span>
            <span class="text-slate-400">Study Time: <strong class="text-emerald-400">~${estTotalHours}h logged</strong></span>
          </div>
        </div>

        <!-- Right: Readiness Index Card (lg:col-span-5) -->
        <div class="lg:col-span-5">
          ${renderReadinessIndexCard(readinessMetrics, readinessFilter)}
        </div>

      </div>

      <!-- Controls & Filter Bar -->
      <div class="bg-[#0F1626] border border-[#24314A] p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        
        <!-- View Mode & Week Filters -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            class="sys-roadmap-filter-week px-3 py-1.5 rounded-lg text-[12px] font-sans cursor-pointer transition-all flex items-center gap-1.5 ${weekFilter === 'today' ? 'bg-[#4F46E5] text-white font-bold shadow-xs' : 'bg-[#141C2E] text-slate-300 hover:text-white border border-[#24314A]'}"
            data-week="today"
            title="Only show today's system design task to complete"
          >
            <span class="material-symbols-outlined text-[15px]">task_alt</span>
            <span>Today's Task (Day ${currentActiveDay})</span>
          </button>

          <button
            class="sys-roadmap-filter-week px-3 py-1.5 rounded-lg text-[12px] font-sans cursor-pointer transition-all ${weekFilter === 'all' ? 'bg-[#4F46E5] text-white border border-[#4F46E5] font-semibold shadow-xs' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
            data-week="all"
            title="View all 42 days grid"
          >
            All 42 Days
          </button>

          <div class="h-4 w-[1px] bg-[#24314A] mx-1 hidden sm:block"></div>

          ${[1, 2, 3, 4, 5, 6].map(w => `
            <button
              class="sys-roadmap-filter-week px-2 py-1 rounded-md text-[11px] font-sans cursor-pointer transition-colors ${weekFilter === String(w) ? 'bg-[#4F46E5] text-white border border-[#4F46E5] font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
              data-week="${w}"
            >
              W${w}
            </button>
          `).join('')}
        </div>

        <!-- Search, Status & Readiness Filter -->
        <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div class="relative min-w-[150px] flex-1">
            <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">search</span>
            <input
              id="sys-roadmap-search"
              type="text"
              placeholder="Search topic or spec..."
              value="${escapeHtml(searchQuery)}"
              class="w-full pl-8 pr-2.5 py-1 bg-[#141C2E] border border-[#24314A] rounded-lg text-white text-[12px] placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
            />
          </div>

          <select
            id="sys-roadmap-readiness-select"
            class="bg-[#141C2E] border ${readinessFilter !== 'all' ? 'border-cyan-400 text-cyan-300 font-semibold' : 'border-[#24314A] text-slate-300'} text-[11.5px] font-sans rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer shrink-0"
            title="Filter days by competency / readiness index"
          >
            <option value="all" ${readinessFilter === 'all' ? 'selected' : ''}>🎯 Readiness: All (10)</option>
            ${READINESS_INDEXES.map(idx => `
              <option value="${idx.id}" ${readinessFilter === idx.id ? 'selected' : ''}>
                ${idx.shortName} (${readinessMetrics.indexes.find(i => i.id === idx.id)?.score || 65}%)
              </option>
            `).join('')}
          </select>

          <select
            id="sys-roadmap-status-select"
            class="bg-[#141C2E] border border-[#24314A] text-slate-300 text-[11.5px] font-sans rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer shrink-0"
          >
            <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>Status: All</option>
            <option value="completed" ${statusFilter === 'completed' ? 'selected' : ''}>✓ Completed</option>
            <option value="pending" ${statusFilter === 'pending' ? 'selected' : ''}>○ Incomplete</option>
          </select>
        </div>
      </div>

      <!-- Active Readiness Filter Indicator -->
      ${readinessFilter !== 'all' ? `
        <div class="flex items-center justify-between bg-[#141C2E] border border-cyan-500/40 rounded-xl px-4 py-2.5 shadow-sm text-[12px] font-sans text-cyan-300">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-cyan-400 text-[18px]">filter_alt</span>
            <span>Filtering by Competency: <strong class="text-white font-semibold">${READINESS_INDEXES.find(i => i.id === readinessFilter)?.name || readinessFilter}</strong> — <span class="text-cyan-400 font-bold">${filtered.length}</span> matching days</span>
          </div>
          <button
            type="button"
            class="sys-roadmap-filter-readiness px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold cursor-pointer transition-all flex items-center gap-1"
            data-readiness-filter="${readinessFilter}"
          >
            <span>Reset Readiness Filter</span>
            <span class="material-symbols-outlined text-[13px]">close</span>
          </button>
        </div>
      ` : ''}

      <!-- Roadmap Content: Today's Task To Complete OR Full Grid -->
      ${isTodayMode ? `
        ${renderTodayRoadmapTask(todayItem, roadmapState[todayItem.day], roadmapState, currentActiveDay)}
      ` : filtered.length === 0 ? `
        <div class="p-12 text-center bg-[#141C2E] border border-[#24314A] rounded-xl flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-slate-500 text-[36px]">filter_list_off</span>
          <h3 class="text-white text-[15px] font-semibold">No System Design days matched your filter.</h3>
          <p class="text-slate-400 text-[13px]">Try clearing your search query or selecting "All 42 Days".</p>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${filtered.map(item => renderRoadmapDayCard(item, roadmapState[item.day])).join('')}
        </div>
      `}

    </div>
  `;
}

export function renderTodayRoadmapTask(item, progress, roadmapState = {}, activeDayNum = 1) {
  const isDone = Boolean(progress?.completed);
  const dayIndexes = getReadinessIndexesForDay(item.day);

  const topics = SYSTEM_DESIGN_TOPICS_BY_DAY[item.day] || [
    {
      id: `day-${item.day}`,
      tabTitle: `Day ${item.day}`,
      title: item.topic,
      section: item.weekTitle || `Week ${item.week}`,
      whatItIs: item.objective,
      architecture: '',
      tradeoffs: item.keyTradeoffs || [],
      keyTakeaway: ''
    }
  ];

  const diffColors = {
    'Foundations': 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30',
    'Medium': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'Hard': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    'Staff Level': 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    'Review & Mock': 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
  };

  const badgeColor = diffColors[item.difficulty] || 'text-slate-300 bg-slate-800 border-slate-700';

  return `
    <div
      class="roadmap-day-card bg-white dark:bg-[#141C2E] border ${item.isRevision ? 'border-[#DDD6FE] dark:border-indigo-500/50 bg-[#F5F3FF] dark:bg-[#161D32]' : isDone ? 'border-[#A7F3D0] dark:border-emerald-500/50 shadow-sm shadow-emerald-500/5' : 'border-[#BAE6FD] dark:border-cyan-500/40 shadow-sm shadow-cyan-500/5'} rounded-xl p-6 md:p-7 flex flex-col gap-5 transition-all relative group"
      data-day="${item.day}"
      id="today-system-design-card"
    >
      <!-- Top Row: Day Pill, Stepper & Badges -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0] dark:border-[#24314A]/70">
        <div class="flex items-center gap-2.5 flex-wrap">
          <span class="px-3 py-1 rounded-lg font-sans text-[12px] font-bold ${item.isRevision ? 'bg-[#F5F3FF] dark:bg-indigo-500/20 text-[#4F46E5] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-500/40' : isDone ? 'bg-[#ECFDF5] dark:bg-emerald-500/20 text-[#065F46] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-500/40' : 'bg-[#F0F9FF] dark:bg-cyan-500/20 text-[#0284C7] dark:text-cyan-300 border border-[#BAE6FD] dark:border-cyan-500/40'}">
            TODAY'S FOCUS • DAY ${String(item.day).padStart(2, '0')} OF 42
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-sans font-bold uppercase border ${badgeColor}">
            ${item.difficulty}
          </span>
          <span class="text-[12px] font-sans text-[#64748B] dark:text-slate-400">
            Week ${item.week} • ${escapeHtml(item.weekTitle)}
          </span>
        </div>

        <!-- Day Navigation Stepper -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#0F1626] border border-[#CBD5E1] dark:border-[#24314A] rounded-lg p-0.5 shadow-xs">
            <button class="sys-roadmap-prev-day-btn p-1.5 rounded hover:bg-[#E2E8F0] dark:hover:bg-[#182238] text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer ${item.day <= 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}" title="Previous Day">
              <span class="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>

            <select class="sys-roadmap-jump-select bg-transparent text-[#0284C7] dark:text-cyan-300 font-sans text-[11.5px] font-bold px-2 py-0.5 focus:outline-none cursor-pointer">
              ${SYSTEM_DESIGN_6_WEEK_ROADMAP.map(d => `
                <option value="${d.day}" ${d.day === item.day ? 'selected' : ''} class="bg-white dark:bg-[#0F1626] text-[#0F172A] dark:text-white">
                  ${roadmapState[d.day]?.completed ? '✓ ' : ''}Day ${d.day}: ${escapeHtml(d.topic.slice(0, 32))}...
                </option>
              `).join('')}
            </select>

            <button class="sys-roadmap-next-day-btn p-1.5 rounded hover:bg-[#E2E8F0] dark:hover:bg-[#182238] text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer ${item.day >= 42 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}" title="Next Day">
              <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <button
            type="button"
            class="sys-roadmap-filter-week px-2.5 py-1 rounded-lg text-[11px] font-sans text-slate-300 bg-[#0F1626] hover:bg-[#182238] border border-[#24314A] hover:border-cyan-500/40 transition-all flex items-center gap-1 cursor-pointer"
            data-week="${item.week}"
            title="View all Week ${item.week} cards"
          >
            <span class="material-symbols-outlined text-[14px] text-cyan-400">grid_view</span>
            <span class="hidden sm:inline">Week ${item.week} Cards</span>
            <span class="sm:hidden">W${item.week}</span>
          </button>
        </div>
      </div>

      <!-- Core Topic Headline & Objective -->
      <div class="flex flex-col gap-1.5">
        <h2 class="font-sans text-[20px] sm:text-[23px] font-bold text-white tracking-tight flex items-center gap-2">
          ${escapeHtml(item.topic)}
        </h2>
        <p class="text-[13.5px] text-slate-300 leading-relaxed max-w-4xl">
          ${escapeHtml(item.objective)}
        </p>
      </div>

      <!-- Target Readiness Indexes for this Day -->
      <div class="flex items-center gap-2 flex-wrap pt-0.5">
        <span class="text-[11px] font-sans text-slate-400 font-semibold flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px] text-cyan-400">psychology</span>
          Target Competencies (${dayIndexes.length}):
        </span>
        ${dayIndexes.map(idx => `
          <button
            type="button"
            class="sys-roadmap-filter-readiness px-2.5 py-0.5 rounded text-[10.5px] font-sans font-semibold border ${idx.badgeClass} flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
            data-readiness-filter="${idx.id}"
            title="Filter all days training ${escapeHtml(idx.name)}"
          >
            <span class="material-symbols-outlined text-[13px]">${idx.icon}</span>
            <span>${idx.shortName}</span>
          </button>
        `).join('')}
      </div>

      <!-- Spec Launch Callout (For the 20 Database Specs: Weeks 4–6) -->
      ${item.specId ? `
        <div class="flex items-center justify-between gap-3 bg-[#0F1626] border border-cyan-500/40 rounded-xl p-3.5 shadow-sm">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="material-symbols-outlined text-cyan-400 text-[22px] shrink-0">inventory_2</span>
            <div class="flex flex-col">
              <span class="font-sans text-[10.5px] text-cyan-400 font-semibold uppercase tracking-wider">Production Spec Pairing</span>
              <span class="text-[13.5px] font-sans font-bold text-white truncate">
                ${escapeHtml(item.topic)}
              </span>
            </div>
          </div>
          <button
            type="button"
            class="open-spec-modal-btn px-3.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-[12px] font-sans font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
            data-open-problem="${item.specId}"
            data-is-spec="true"
            title="Launch full production blueprint spec modal"
          >
            <span>Launch Spec</span>
            <span class="material-symbols-outlined text-[14px]">arrow_outward</span>
          </button>
        </div>
      ` : ''}

      <!-- Interactive Topic Tabs for Today (Click to switch content) -->
      <div class="flex flex-col gap-2 pt-1">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-sans text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">layers</span>
            Today's Topic Breakdown (${topics.length} Concepts):
          </span>
          <span class="text-[11px] font-sans text-[#64748B] dark:text-slate-400 hidden sm:inline">Click any concept tab below to master its architecture</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          ${topics.map((t, idx) => `
            <button
              type="button"
              class="roadmap-topic-tab px-3.5 py-1.5 rounded-lg text-[12px] font-sans font-semibold cursor-pointer transition-all ${idx === 0 ? 'bg-[#F0F9FF] dark:bg-cyan-500/20 text-[#0284C7] dark:text-cyan-300 border border-[#BAE6FD] dark:border-cyan-500/40 shadow-xs active ring-1 ring-[#BAE6FD] dark:ring-cyan-500/30' : 'bg-white dark:bg-[#0F1626] text-[#475569] dark:text-slate-400 border border-[#E2E8F0] dark:border-[#24314A] hover:text-[#0F172A] dark:hover:text-slate-200 hover:border-[#CBD5E1] dark:hover:border-slate-500'}"
              data-day="${item.day}"
              data-topic-idx="${idx}"
              title="${escapeHtml(t.title)}"
            >
              ${escapeHtml(t.tabTitle || t.id || `Topic ${idx + 1}`)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Dynamic Topic Content Container -->
      <div id="roadmap-topic-content-${item.day}" class="roadmap-topic-content lesson-content-area flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-[#0A0E1A]/90 border border-[#E2E8F0] dark:border-[#24314A]/90 shadow-xs dark:shadow-inner" data-content-id="${topics[0]?.id || ''}" data-day="${item.day}" data-lesson-content="true">
        ${renderTopicDetail(topics[0])}
      </div>

      <!-- Bottom Card Action Strip: Completion Toggle & Reading Links -->
      <div class="pt-4 border-t border-[#E2E8F0] dark:border-[#24314A]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Complete / Reopen Action -->
        <div class="flex items-center gap-3 flex-wrap">
          ${isDone ? `
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="day-mastered-pill px-4 py-2 rounded-xl bg-[#ECFDF5] dark:bg-emerald-500/20 text-[#065F46] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-500/40 font-sans text-[12.5px] font-bold flex items-center gap-1.5 shadow-xs">
                <span class="material-symbols-outlined text-[18px] text-[#059669] dark:text-emerald-400">done_all</span>
                <span>Day ${item.day} Mastered!</span>
              </span>
              ${item.day < 42 ? `
                <button class="sys-roadmap-jump-day px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-sans text-[12.5px] font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer" data-day="${item.day + 1}">
                  <span>Advance to Day ${item.day + 1}</span>
                  <span class="material-symbols-outlined text-[16px] text-white">arrow_forward</span>
                </button>
              ` : ''}
              <button class="toggle-roadmap-day-btn reopen-day-btn px-3.5 py-2 rounded-xl bg-white dark:bg-[#182238] hover:bg-[#F1F5F9] dark:hover:bg-[#24314A] text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white border border-[#CBD5E1] dark:border-[#24314A] font-sans text-[11.5px] font-semibold transition-colors cursor-pointer shadow-xs" data-day="${item.day}">
                Reopen Day ${item.day}
              </button>
            </div>
          ` : `
            <button class="toggle-roadmap-day-btn complete-day-btn px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-sans text-[13px] font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer" data-day="${item.day}">
              <span class="material-symbols-outlined text-[18px] text-white">check_circle</span>
              <span class="text-white">Mark Day ${item.day} Task Complete</span>
            </button>
          `}
        </div>

        <!-- Right: References & Est Time -->
        <div class="flex items-center gap-3 text-[12px] font-sans text-[#64748B] dark:text-slate-400 flex-wrap">
          <span>Est: <strong class="text-[#0F172A] dark:text-slate-200">${item.estTime}</strong></span>
          ${item.readingLinks && item.readingLinks[0] ? `
            <a
              href="${item.readingLinks[0].url}"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 rounded-lg bg-[#0F1626] border border-[#24314A] text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 flex items-center gap-1.5 transition-all"
              title="${escapeHtml(item.readingLinks[0].title)}"
            >
              <span class="material-symbols-outlined text-[14px]">menu_book</span>
              <span class="truncate max-w-[200px]">${escapeHtml(item.readingLinks[0].title)}</span>
              <span class="material-symbols-outlined text-[12px]">open_in_new</span>
            </a>
          ` : ''}
        </div>
      </div>

    </div>
  `;
}

export function renderTopicDetail(topic) {
  if (!topic) return '';
  if (topic.id === '0.1') {
    return renderHowToUseCourseContent(topic);
  }
  if (topic.id === '0.2') {
    return renderSevenStepFrameworkContent(topic);
  }
  if (topic.id === '0.3') {
    return renderEstimationMathContent(topic);
  }
  if (topic.id === '0.4') {
    return renderNumbersToMemoriseContent(topic);
  }
  if (topic.id === '1.1' || topic.title?.includes('Process vs. Thread') || topic.title?.includes('Process vs Thread')) {
    return renderProcessVsThreadContent(topic);
  }
  if (topic.id === '1.2' || topic.title?.includes('Virtualization vs. Containerization') || topic.title?.includes('VMs vs Containers')) {
    return renderVirtualizationVsContainersContent(topic);
  }
  if (topic.id === '1.3' || topic.title?.includes('Cloud Service Models') || topic.title?.includes('Cloud Models')) {
    return renderCloudModelsContent(topic);
  }
  if (topic.id === '1.4') {
    return renderAwsLambdaContent(topic);
  }
  if (topic.id === '1.5') {
    return renderScalingWebsiteContent(topic);
  }
  if (topic.id === '1.6') {
    return renderBigDataCloudContent(topic);
  }
  if (topic.id === '11.1') {
    return renderTcpUdpFundamentalsContent(topic);
  }
  if (topic.id === '2.1') {
    return renderHttpGenerationsContent(topic);
  }
  if (topic.id === '2.2-https' || topic.title?.includes('HTTPS')) {
    return renderHttpsContent(topic);
  }
  if (topic.id === '2.2') {
    return renderForwardVsReverseProxyContent(topic);
  }
  if (topic.id === '2.3') {
    return renderDnsLookupContent(topic);
  }
  if (topic.id === '2.4') {
    return renderUrlLifecycleContent(topic);
  }
  if (topic.title?.includes('CDN') || topic.title?.includes('Content Delivery')) {
    return renderCdnContent(topic);
  }
  if (topic.id === '2.5') {
    return renderHttpStatusCodesContent(topic);
  }
  if (topic.id === '2.6') {
    return renderApiStylesContent(topic);
  }
  if (topic.id === '2.7' || topic.id === '2.7-push' || topic.title?.includes('Push Channels') || topic.title?.includes('Server-to-Client Push')) {
    return renderRealtimeProtocolsContent(topic);
  }
  if (topic.id === '2.8' || topic.title?.includes('Load Balancing') || topic.title?.includes('L4 vs. L7') || topic.title?.includes('L4 vs L7')) {
    return renderLoadBalancingContent(topic);
  }
  if (topic.id === '2.9' || topic.title?.includes('Browser') || topic.title?.includes('Browsers')) {
    return renderBrowserInternalsContent(topic);
  }
  if (topic.id === '11.2' || topic.id === '11.2-gw' || topic.title?.includes('API Gateways') || topic.title?.includes('Edge Gateways')) {
    return renderApiGatewayContent(topic);
  }
  if (topic.id === 'rev-1' || topic.id === 'rev-1-checklist' || topic.title?.includes('Revision Day 1') || topic.title?.includes('Week 1 Core Mastery')) {
    return renderWeek1RevisionContent(topic);
  }
  if (topic.id === 'rev-2' || topic.id === 'rev-2-checklist' || topic.title?.includes('Revision Day 2') || topic.title?.includes('Week 2 Core Mastery')) {
    return renderDatabaseShardingContent(topic);
  }
  if (topic.id === '3.1') {
    return renderJwtVsSessionContent(topic);
  }
  if (topic.id === '3.2') {
    return renderPasswordHashingContent(topic);
  }
  if (topic.id === '3.3') {
    return renderSsoOAuthOidcContent(topic);
  }
  if (topic.title?.includes('Rate Limiting') || topic.id === '3.6') {
    return renderRateLimitingContent(topic);
  }
  if (topic.title?.includes('Log4Shell') || topic.id === '3.7') {
    return renderLog4ShellContent(topic);
  }
  if (topic.id === '3.4') {
    return renderRbacVsAbacContent(topic);
  }
  if (topic.id === '3.5') {
    return renderEncryptionFundamentalsContent(topic);
  }
  if (topic.id === '4.1') {
    return renderSqlVsNosqlContent(topic);
  }
  if (topic.id === '4.2' || topic.title?.includes('Isolation') || topic.title?.includes('MVCC')) {
    return renderDatabaseIsolationMvccContent(topic);
  }
  if (topic.id === '4.3' || topic.title?.includes('Locking')) {
    return renderOptimisticVsPessimisticLockingContent(topic);
  }
  if (topic.id === '4.3-quorum' || topic.title?.includes('Tunable Quorum Math') || topic.title?.includes('Quorum Math')) {
    return renderConflictResolutionContent(topic);
  }
  if (topic.id === '4.5-read-replica' || topic.title?.includes('Read-Replica') || topic.title?.includes('Read Replica')) {
    return renderReadReplicaPatternContent(topic);
  }
  if (topic.title?.includes('Latency / Consistency Trade-off') || topic.title?.includes('Trade-off in Replication') || topic.title?.includes('Replication Modes') || topic.id === '4.5') {
    return renderReplicationTradeoffsContent(topic);
  }
  if (topic.id === '4.4' || topic.title?.includes('PACELC') || topic.title?.includes('CAP')) {
    return renderCapVsPacelcContent(topic);
  }
  if (topic.id === '4.6' || topic.title?.includes('Sharding') || topic.title?.includes('Partitioning')) {
    return renderDatabaseShardingContent(topic);
  }
  if (topic.id === '4.7' || topic.title?.includes('Consistent Hashing')) {
    return renderConsistentHashingContent(topic);
  }
  if (topic.id === '4.8' || topic.title?.includes('Choosing the Right Database') || topic.title?.includes('Choosing DB')) {
    return renderChoosingRightDatabaseContent(topic);
  }
  if (topic.id === '4.9' || topic.title?.includes('Storage Engine') || topic.title?.includes('B-Tree vs. LSM-Tree')) {
    return renderStorageEnginesContent(topic);
  }
  if (topic.id === '5.1' || topic.title?.includes('Cache Strategies') || topic.title?.includes('Caching Strategies') || topic.title?.includes('Cache-Aside')) {
    return renderCacheStrategiesContent(topic);
  }
  if (topic.id === '5.2' || topic.title?.includes('Eviction') || topic.title?.includes('Thundering Herd') || topic.title?.includes('Stampede')) {
    return renderCacheEvictionStampedeContent(topic);
  }
  if (topic.id === '5.3' || topic.title?.includes('Redis vs') || topic.title?.includes('Memcached')) {
    return renderRedisVsMemcachedContent(topic);
  }
  if (topic.title?.includes('Block vs') || topic.title?.includes('File vs') || topic.title?.includes('Storage Tiers') || (topic.id === '6.1' && topic.section?.includes('Storage')) || (topic.id === '7.1' && topic.section?.includes('Storage'))) {
    return renderBlockVsFileVsObjectContent(topic);
  }
  if (topic.title?.includes('SSDs') || topic.title?.includes('SSD') || (topic.id === '6.2' && topic.section?.includes('Storage')) || (topic.id === '7.2' && topic.section?.includes('Storage'))) {
    return renderWhySsdsAreFastContent(topic);
  }
  if (topic.title?.includes('Erasure Coding') || (topic.id === '6.3' && topic.section?.includes('Storage')) || (topic.id === '7.3' && topic.section?.includes('Storage'))) {
    return renderErasureCodingVsReplicationContent(topic);
  }
  if (topic.id === '4.10' || topic.title?.includes('Unique ID') || topic.title?.includes('Snowflake')) {
    return renderUniqueIdGenerationContent(topic);
  }
  if (topic.id === '5.4' || topic.title?.includes('Why Redis Is So Fast') || topic.title?.includes('Why Redis Fast')) {
    return renderRedisInternalsContent(topic);
  }
  if (topic.id === '5.5' || topic.id === '5.5-cache' || topic.id === '5.5-crawler' || topic.title?.includes('Bloom Filter')) {
    return renderBloomFilterContent(topic);
  }
  if (topic.title?.includes('Multipart Upload') || (topic.id === '6.4' && (topic.section?.includes('Storage') || topic.title?.includes('Uploading Large Files')))) {
    return renderMultipartUploadContent(topic);
  }
  if (topic.id === '6.5' || topic.title?.includes('Designing S3') || topic.title?.includes('Design S3')) {
    return renderDesignS3Content(topic);
  }
  if (topic.id === '10.3' || topic.title?.includes('Conflict Resolution')) {
    return renderConflictResolutionContent(topic);
  }
  if (topic.id === '7.5-metrics' || topic.id === '7.5' || topic.id === '7.6' || topic.title?.includes('Metrics Monitoring') || topic.title?.includes('Pull vs. Push') || topic.title?.includes('Pull vs Push')) {
    return renderMetricsMonitoringContent(topic);
  }
  if (topic.id === '6.4' || topic.title?.includes('Event-Driven Architecture') || topic.title?.includes('Event-Driven')) {
    return renderEventDrivenArchitectureContent(topic);
  }
  if (topic.title?.includes('Delivery Semantics') || (topic.id === '7.1' && !topic.section?.includes('Storage'))) {
    return renderDeliverySemanticsContent(topic);
  }
  if (topic.id === '7.2-internals' || topic.title?.includes('Why Kafka Is Fast') || topic.title?.includes('Why Kafka Fast') || topic.title?.includes('Kafka Broker & Consumer Group') || (topic.id === '7.2' && !topic.section?.includes('Storage'))) {
    return renderWhyKafkaIsFastContent(topic);
  }
  if (topic.title?.includes('Microservice Collaboration') || topic.title?.includes('Orchestration vs') || topic.title?.includes('Choreography') || (topic.id === '7.3' && !topic.section?.includes('Storage'))) {
    return renderMicroserviceCollaborationContent(topic);
  }
  if (topic.id === '10.1' || (!topic.id?.startsWith('rev-') && (topic.title?.includes('Consensus and Coordination') || topic.title?.includes('Consensus & Raft')))) {
    return renderConsensusRaftContent(topic);
  }
  if (topic.id === '10.2' || topic.id === '10.2-time' || topic.title?.includes('Distributed Time') || topic.title?.includes('Time and Ordering') || topic.title?.includes('Time & Ordering') || topic.title?.includes('Vector Clocks')) {
    return renderDistributedTimeOrderingContent(topic);
  }
  if (topic.id === '10.4' || topic.title?.includes('Failure Detection') || topic.title?.includes('Grey Failures') || topic.title?.includes('Grey Failure')) {
    return renderFailureDetectionContent(topic);
  }
  if (topic.id === '11.3' || topic.title?.includes('Service Mesh') || topic.title?.includes('Sidecar Model')) {
    return renderServiceMeshSidecarContent(topic);
  }
  if (topic.id === '11.4' || topic.title?.includes('Global Traffic Management') || topic.title?.includes('Anycast') || topic.title?.includes('BGP and GSLB')) {
    return renderGlobalTrafficManagementContent(topic);
  }
  if (topic.id === '11.5' || topic.title?.includes('Scaling Long-Lived') || topic.title?.includes('Long-Lived Connections') || topic.title?.includes('Long-Lived Conn')) {
    return renderScalingLongLivedConnectionsContent(topic);
  }
  if (topic.id === '11.6' || topic.id === '11.6-chat' || topic.title?.includes('WebRTC') || topic.title?.includes('Real-Time Media') || topic.title?.includes('Selective Forwarding Units') || topic.title?.includes('SFU')) {
    return renderWebRtcRealTimeMediaContent(topic);
  }
  if (topic.title?.includes('Asynchronous Processing') || topic.title?.includes('Message Queues') || topic.id === '6.1') {
    return renderAsyncProcessingQueuesContent(topic);
  }
  if (topic.title?.includes('RabbitMQ') || topic.id === '6.2') {
    return renderRabbitMqVsKafkaContent(topic);
  }
  if (topic.id === '6.3' || topic.id === '7.4' || topic.title?.includes('2PC vs') || topic.title?.includes('Saga')) {
    return renderDistributedTransactionsSagaContent(topic);
  }
  if (topic.id === '4.11' || topic.title?.includes('Metrics') || topic.title?.includes('Time Series')) {
    return renderMetricsDatabaseContent(topic);
  }
  if (topic.id === '4.12' || topic.id === '1.6-trie' || topic.id === 'trie-arch' || topic.title?.includes('Prefix Trie') || topic.title?.includes('Big Data') || topic.title?.includes('Papers and the Evolution')) {
    return renderBigDataEvolutionContent(topic);
  }
  // --- MASTERCLASS 20 TOPICS + FRAMEWORK + FINAL CHECKLIST ROUTING ---
  if (topic.id === 'mc-framework' || topic.title?.includes('Interview Framework')) {
    return renderSystemDesignFrameworkContent(topic);
  }
  if (topic.id === 'mc-q1' || topic.id === 'spec-1-interview' || topic.id === 'sd-1' || topic.title?.includes('URL Shortener') || topic.title?.includes('TinyURL') || topic.title?.includes('Bitly')) {
    return renderUrlShortenerDetail(topic);
  }
  if (topic.id === 'mc-q2' || topic.id === 'sd-18' || topic.title?.includes('Distributed Rate Limiter') || topic.title?.includes('Rate Limiter')) {
    return renderDistributedRateLimiterDetail(topic);
  }
  if (topic.id === 'mc-q3' || topic.id === 'sd-8' || topic.title?.includes('Notification System')) {
    return renderNotificationSystemDetail(topic);
  }
  if (topic.id === 'mc-q4' || topic.id === 'sd-3' || topic.title?.includes('Distributed Cache')) {
    return renderDistributedCacheDetail(topic);
  }
  if (topic.id === 'mc-q5' || topic.title?.includes('Design an API Gateway') || topic.title?.includes('API Gateway')) {
    return renderApiGatewayDetail(topic);
  }
  if (topic.id === 'mc-q6' || topic.id === 'sd-6' || topic.title?.includes('Instagram')) {
    return renderInstagramDetail(topic);
  }
  if (topic.id === 'mc-q7' || topic.id === 'sd-7' || topic.title?.includes('WhatsApp')) {
    return renderWhatsAppDetail(topic);
  }
  if (topic.id === 'mc-q8' || topic.id === 'sd-10' || topic.title?.includes('YouTube')) {
    return renderYouTubeDetail(topic);
  }
  if (topic.id === 'mc-q9' || topic.id === 'sd-12' || topic.title?.includes('Uber')) {
    return renderUberDetail(topic);
  }
  if (topic.id === 'mc-q10' || topic.title?.includes('Food Delivery')) {
    return renderFoodDeliveryDetail(topic);
  }
  if (topic.id === 'mc-q11' || topic.id === 'sd-17' || topic.title?.includes('Web Crawler')) {
    return renderWebCrawlerDetail(topic);
  }
  if (topic.id === 'mc-q12' || topic.id === 'sd-16' || topic.title?.includes('Search Autocomplete') || topic.title?.includes('Autocomplete')) {
    return renderSearchAutocompleteDetail(topic);
  }
  if (topic.id === 'mc-q13' || topic.title?.includes('Logging and Monitoring System') || topic.title?.includes('Logging & Monitoring')) {
    return renderLoggingMonitoringDetail(topic);
  }
  if (topic.id === 'mc-q14' || topic.title?.includes('Real-Time Analytics Pipeline') || topic.title?.includes('Real-Time Analytics')) {
    return renderRealTimeAnalyticsDetail(topic);
  }
  if (topic.id === 'mc-q15' || topic.id === 'sd-20' || topic.title?.includes('Distributed Task Scheduler') || topic.title?.includes('Task Scheduler')) {
    return renderDistributedTaskSchedulerDetail(topic);
  }
  if (topic.id === 'mc-q16' || topic.title?.includes('E-Commerce Platform')) {
    return renderEcommercePlatformDetail(topic);
  }
  if (topic.id === 'mc-q17' || topic.id === 'sd-14' || topic.title?.includes('Ticket Booking')) {
    return renderTicketBookingDetail(topic);
  }
  if (topic.id === 'mc-q18' || topic.id === 'sd-15' || topic.title?.includes('Payment System')) {
    return renderPaymentSystemDetail(topic);
  }
  if (topic.id === 'mc-q19' || topic.id === 'sd-4' || topic.title?.includes('Dropbox') || topic.title?.includes('Cloud File Storage')) {
    return renderCloudFileStorageDetail(topic);
  }
  if (topic.id === 'mc-q20' || topic.title?.includes('Ad Impression Tracking')) {
    return renderAdImpressionTrackingDetail(topic);
  }
  if (topic.id === 'mc-checklist' || topic.title?.includes('Final Interview Checklist') || topic.title?.includes('Final Checklist')) {
    return renderFinalInterviewChecklistDetail(topic);
  }
  if (topic.id === '8.1' || topic.title?.includes('Deployment Strategies')) {
    return renderDeploymentStrategiesContent(topic);
  }
  if (topic.id === '8.2' || topic.title?.includes('Resilience:') || topic.title?.includes('Timeouts, Retries')) {
    return renderResiliencePatternsContent(topic);
  }
  if (topic.id === '8.3' || topic.title?.includes('Runaway Process')) {
    return renderLinuxProcessTriageContent(topic);
  }
  if (topic.id === '12.3' || topic.title?.includes('SLIs, SLOs')) {
    return renderSloErrorBudgetsContent(topic);
  }
  if (topic.id === '12.4' || topic.title?.includes('Multi-Region')) {
    return renderMultiRegionDisasterRecoveryContent(topic);
  }
  if (topic.id === '12.7' || topic.title?.includes('Chaos Engineering')) {
    return renderChaosEngineeringContent(topic);
  }
  if (topic.id === 'rev-3' || topic.id === 'rev-3-checklist' || topic.title?.includes('Revision Day 3') || topic.title?.includes('Week 3 Core Mastery')) {
    return renderWeek3RevisionContent(topic);
  }
  if (topic.customHtml) {
    return typeof topic.customHtml === 'function' ? topic.customHtml(topic) : topic.customHtml;
  }

  const topicIndexes = getReadinessIndexesForTopic(topic.id);

  return `
    <div class="flex flex-col gap-2.5 animate-fadeIn">
      <!-- Title & Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#24314A]/40">
        <div class="flex items-center gap-2 flex-wrap min-w-0">
          <h4 class="font-sans text-[15px] font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
            ${escapeHtml(topic.title)}
          </h4>
          <div class="flex items-center gap-1.5 flex-wrap">
            ${topicIndexes.map(idx => `
              <span class="text-[10px] font-sans px-2 py-0.5 rounded border ${idx.badgeClass} flex items-center gap-1 shrink-0" title="${escapeHtml(idx.name)}: ${escapeHtml(idx.description)}">
                <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${idx.color}"></span>
                <span>${idx.shortName}</span>
              </span>
            `).join('')}
          </div>
        </div>
        <span class="text-[10px] font-sans text-cyan-400 shrink-0 bg-[#0A0E1A] px-2 py-0.5 rounded border border-cyan-500/20">
          ${escapeHtml(topic.section)}
        </span>
      </div>

      <!-- What it is / Explanation -->
      <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
        ${escapeHtml(topic.whatItIs)}
      </p>

      <!-- Architecture ASCII Flow Diagram (if present) -->
      ${topic.architecture ? `
        <div class="bg-[#0A0E1A] border border-[#1E293B] rounded-lg p-3 font-mono text-[11px] text-cyan-200/90 overflow-x-auto whitespace-pre leading-tight shadow-inner">
${escapeHtml(topic.architecture)}
        </div>
      ` : ''}

      <!-- Key Trade-offs & Invariants -->
      ${topic.tradeoffs && topic.tradeoffs.length ? `
        <div class="bg-[#0F1626] border border-[#24314A]/70 rounded-lg p-3 flex flex-col gap-1.5 mt-0.5">
          <span class="font-sans text-[10px] text-cyan-400 uppercase font-semibold tracking-wider flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">tune</span>
            Key Architectural Trade-offs & Invariants:
          </span>
          <ul class="flex flex-col gap-1 text-[11.5px] text-slate-300 list-disc list-inside font-sans">
            ${topic.tradeoffs.map(t => `<li class="leading-relaxed">${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Key Senior Takeaway -->
      ${topic.keyTakeaway ? `
        <div class="bg-cyan-950/30 border-l-2 border-cyan-500 px-3 py-2 rounded-r text-[11.5px] text-cyan-200/90 leading-relaxed font-sans mt-0.5">
          <strong class="font-sans text-[10px] uppercase text-cyan-400 tracking-wider block mb-0.5">Key Senior Takeaway:</strong>
          ${escapeHtml(topic.keyTakeaway)}
        </div>
      ` : ''}
    </div>
  `;
}

export function renderRoadmapDayCard(item, progress) {
  const isDone = Boolean(progress?.completed);
  const dayIndexes = getReadinessIndexesForDay(item.day);

  const topics = SYSTEM_DESIGN_TOPICS_BY_DAY[item.day] || [
    {
      id: `day-${item.day}`,
      tabTitle: `Day ${item.day}`,
      title: item.topic,
      section: item.weekTitle || `Week ${item.week}`,
      whatItIs: item.objective,
      architecture: '',
      tradeoffs: item.keyTradeoffs || [],
      keyTakeaway: ''
    }
  ];

  const diffColors = {
    'Foundations': 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30',
    'Medium': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'Hard': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    'Staff Level': 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    'Review & Mock': 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
  };

  const badgeColor = diffColors[item.difficulty] || 'text-slate-300 bg-slate-800 border-slate-700';

  return `
    <div
      class="roadmap-small-day-card bg-white dark:bg-[#141C2E] border ${item.isRevision ? 'border-indigo-300 dark:border-indigo-500/40 bg-[#F5F3FF] dark:bg-[#161D32]' : isDone ? 'border-emerald-300 dark:border-emerald-500/40 shadow-xs shadow-emerald-500/10' : 'border-[#E2E8F0] dark:border-[#24314A] hover:border-indigo-300 dark:hover:border-cyan-500/40'} rounded-xl p-5 flex flex-col justify-between gap-4 transition-all shadow-sm relative group select-text cursor-default"
      data-day="${item.day}"
    >
      <!-- Top Section -->
      <div class="flex flex-col gap-3">
        <!-- Top Row: Day Pill, Week & Difficulty Badge, Completion Status -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded font-sans text-[11px] font-bold ${item.isRevision ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40' : isDone ? 'bg-[#ECFDF5] dark:bg-emerald-500/20 text-[#065F46] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-500/40' : 'bg-slate-100 dark:bg-[#0F1626] text-slate-800 dark:text-cyan-400 border border-slate-300 dark:border-cyan-500/30'}">
              DAY ${String(item.day).padStart(2, '0')}
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase border ${badgeColor}">
              ${item.difficulty}
            </span>
            <span class="text-[11px] font-sans text-[#64748B] dark:text-slate-400 truncate max-w-[140px] sm:max-w-none">
              Week ${item.week}
            </span>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <label class="flex items-center gap-1.5 cursor-pointer select-none stop-prop" title="Toggle Day Completion">
              <input
                type="checkbox"
                class="sys-roadmap-toggle-checkbox w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-white dark:bg-[#0F1626] cursor-pointer"
                data-roadmap-day="${item.day}"
                ${isDone ? 'checked' : ''}
              />
            </label>
            ${isDone ? `
              <span class="text-[10.5px] font-sans font-semibold text-[#065F46] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-emerald-950/40 border border-[#A7F3D0] dark:border-emerald-500/30 px-2 py-0.5 rounded">
                Done ✓
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Headline: Day Main Topic & Objective -->
        <div class="flex flex-col gap-1">
          <h3 class="font-sans text-[15.5px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
            ${escapeHtml(item.topic)}
          </h3>
          <p class="text-[12px] text-[#475569] dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
            ${escapeHtml(item.objective)}
          </p>
        </div>

        <!-- Readiness Index Badges for this day -->
        <div class="flex flex-wrap items-center gap-1.5 my-0.5">
          ${dayIndexes.map(idx => `
            <span class="px-2 py-0.5 rounded text-[10px] font-sans border ${idx.badgeClass} flex items-center gap-1 shrink-0" title="${escapeHtml(idx.name)}: ${escapeHtml(idx.description)}">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${idx.color}"></span>
              <span>${idx.shortName}</span>
            </span>
          `).join('')}
        </div>

        <!-- Spec Tag (If production spec) -->
        ${item.specId ? `
          <div class="flex items-center justify-between gap-2 bg-[#F8FAFC] dark:bg-[#0F1626] border border-[#CBD5E1] dark:border-cyan-500/30 rounded-lg px-2.5 py-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <span class="material-symbols-outlined text-indigo-600 dark:text-cyan-400 text-[16px] shrink-0">inventory_2</span>
              <span class="text-[11.5px] font-sans font-semibold text-[#0F172A] dark:text-cyan-300 truncate">
                Production Blueprint Spec
              </span>
            </div>
            <button
              type="button"
              class="open-spec-modal-btn px-2 py-0.5 rounded bg-indigo-50 dark:bg-cyan-500/15 border border-indigo-200 dark:border-cyan-500/40 text-indigo-700 dark:text-cyan-300 hover:bg-indigo-100 dark:hover:bg-cyan-500/25 text-[10.5px] font-sans font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer stop-prop"
              data-open-problem="${item.specId}"
              data-is-spec="true"
              title="Launch full production blueprint spec modal"
            >
              <span>Spec</span>
              <span class="material-symbols-outlined text-[11px]">arrow_outward</span>
            </button>
          </div>
        ` : ''}

        <!-- Topics to Cover on this Day (Clean, compact list) -->
        <div class="flex flex-col gap-2 pt-1 border-t border-[#E2E8F0] dark:border-[#24314A]/70">
          <div class="flex items-center justify-between text-[11px] font-sans text-[#475569] dark:text-slate-400">
            <span class="font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">checklist</span>
              Topics to Cover (${topics.length}):
            </span>
            <span>Est: <strong class="text-[#0F172A] dark:text-slate-300 font-semibold">${item.estTime}</strong></span>
          </div>

          <div class="flex flex-col gap-1.5 bg-[#F8FAFC] dark:bg-[#0A0E1A]/80 border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl p-2.5 shadow-inner">
            ${topics.map((t, idx) => {
              const topicIndexes = getReadinessIndexesForTopic(t.id, item.day);
              const primaryIdx = topicIndexes[0];
              return `
                <div class="flex items-center justify-between gap-2 text-[12px] text-[#1E293B] dark:text-slate-200 py-0.5">
                  <div class="flex items-start gap-2 min-w-0 flex-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400 mt-1.5 shrink-0"></span>
                    <div class="flex items-baseline gap-1.5 min-w-0">
                      <span class="font-sans text-[11px] text-indigo-700 dark:text-cyan-300 font-semibold shrink-0">${escapeHtml(t.id || String(idx + 1))}</span>
                      <span class="truncate font-sans font-medium text-[#1E293B] dark:text-slate-300 text-[12px]">${escapeHtml(t.title || t.tabTitle)}</span>
                    </div>
                  </div>
                  ${primaryIdx ? `
                    <span class="text-[9.5px] font-sans px-1.5 py-0.5 rounded border ${primaryIdx.badgeClass} shrink-0 hidden sm:inline-block" title="${escapeHtml(primaryIdx.name)}">
                      ${primaryIdx.shortName}
                    </span>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Bottom Card Action Row: Metadata & "Start the Day" Button -->
      <div class="pt-3 border-t border-[#E2E8F0] dark:border-[#24314A] flex items-center justify-between gap-3">
        <span class="text-[11px] font-sans text-[#64748B] dark:text-slate-500 truncate">
          ${item.readingLinks && item.readingLinks[0] ? escapeHtml(item.readingLinks[0].title.slice(0, 20)) + '...' : `Day ${item.day} Curriculum`}
        </span>

        <button
          type="button"
          class="start-roadmap-day-btn ${isDone ? 'is-completed' : ''} px-4 py-2 rounded-xl ${isDone ? 'bg-white dark:bg-[#182238] hover:bg-[#ECFDF5] dark:hover:bg-[#202E4C] text-[#065F46] dark:text-emerald-300 border border-[#A7F3D0] dark:border-emerald-500/30 shadow-xs' : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-indigo-600/30'} font-sans text-[12.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          data-day="${item.day}"
          title="Direct to the complete big card for Day ${item.day}"
        >
          <span>${isDone ? 'Review Day' : 'Start the Day'}</span>
          <span class="material-symbols-outlined text-[15px]">${isDone ? 'menu_book' : 'arrow_forward'}</span>
        </button>
      </div>

    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

