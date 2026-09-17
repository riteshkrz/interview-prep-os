/**
 * 45-Day Interview Prep OS - 6-Week (42-Day) System Design Master Roadmap Workspace
 * Complete, opinionated day-by-day curriculum mapping Parts 0 to 13,
 * with weekly revision days every 7th day, and the 20 production specs
 * executed in the last 18 study days paired with key architectural concepts.
 */

import { state, toggleSysDesignRoadmapDay } from './state.js';
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
import { renderHowToUseCourseContent } from './HowToUseCourseDetail.js';
import { renderSevenStepFrameworkContent } from './SevenStepFrameworkDetail.js';
import { renderEstimationMathContent } from './EstimationMathDetail.js';
import { renderNumbersToMemoriseContent } from './NumbersToMemoriseDetail.js';

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
    topic: "Transport Protocols & Security: TCP, UDP, HTTP/3 & HTTPS",
    domain: "Networking & Security",
    difficulty: "Medium",
    estTime: "80 mins",
    isRevision: false,
    objective: "Master connection lifecycles, flow control, head-of-line blocking, and the cryptographic mechanics of TLS 1.3.",
    keyTradeoffs: [
      "TCP (reliable byte stream, 3-way handshake, sliding window flow control) vs. UDP (datagrams, connectionless, zero handshake, loss-tolerant audio/video)",
      "HTTP/1.1 (pipelining HOL blocking) → HTTP/2 (single TCP stream multiplexing) → HTTP/3 QUIC (UDP transport, 0-RTT resumption, independent streams)",
      "TLS 1.3 Handshake: 1-RTT connection setup, Diffie-Hellman ephemeral key exchange, forward secrecy, and certificate chain validation"
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
  // WEEK 4: THE LAST 18 DAYS · APPLIED DESIGNS PART I (Days 22 to 28)
  // Ingress, Caching, Ephemeral Storage & Search
  // =========================================================================
  {
    day: 22,
    week: 4,
    weekTitle: "Applied Designs Part I: Ingress, Caching & Search",
    topic: "Spec 1: URL Shortener (TinyURL / Bitly)",
    domain: "High-Frequency Key Generation",
    difficulty: "Medium",
    estTime: "80 mins",
    specId: "sd-1",
    isRevision: false,
    objective: "Architect a high-read URL shortener generating unique 7-character Base62 keys with sub-8ms redirection.",
    keyTradeoffs: [
      "Theory Concept 4.10: Generating Globally Unique IDs (UUIDv4 128-bit vs. Twitter Snowflake 64-bit time-ordered IDs vs. Key Generation Service pre-allocated ranges)",
      "Key Generation Service (KGS): Pre-allocates unique Base62 key blocks in memory, eliminating runtime collision checking and DB roundtrips",
      "Redirection: HTTP 301 Permanent (browser caches redirect, eliminates server load, kills click telemetry) vs. HTTP 302 Temporary (full analytics tracking)"
    ],
    readingLinks: [
      { title: "Engineering Monograph: Base62 & KGS Deep Dive", url: "#/blog?article=design-url-shortener-kgs" }
    ]
  },
  {
    day: 23,
    week: 4,
    weekTitle: "Applied Designs Part I: Ingress, Caching & Search",
    topic: "Spec 18: API Rate Limiter & Edge Gateway",
    domain: "Traffic Control & Security",
    difficulty: "Medium",
    estTime: "80 mins",
    specId: "sd-18",
    isRevision: false,
    objective: "Protect backend services from DDoS traffic spikes and enforce per-client rate quotas across distributed Redis nodes.",
    keyTradeoffs: [
      "Theory Concept 3.4 & 11.2: Rate Limiting Algorithms & Edge Reverse Proxies (Token Bucket vs. Leaky Bucket vs. Sliding Window Counter)",
      "Distributed Rate Limiting: Atomic Redis Lua scripts executing `INCR` + `EXPIRE` in a single transaction, avoiding race condition gaps",
      "Edge Gateway Integration: Envoy global rate-limiting gRPC filter with fallback open behavior to avoid dropping valid traffic on cache downtime"
    ],
    readingLinks: [
      { title: "Stripe: Scaling Your API with Distributed Rate Limiters", url: "https://stripe.com/blog/rate-limiters" }
    ]
  },
  {
    day: 24,
    week: 4,
    weekTitle: "Applied Designs Part I: Ingress, Caching & Search",
    topic: "Spec 11: Content Delivery Network (CDN) Architecture",
    domain: "Global Edge Delivery",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-11",
    isRevision: false,
    objective: "Design a planetary CDN edge caching network serving static assets and dynamic content with Anycast routing.",
    keyTradeoffs: [
      "Theory Concept 2.5 & 11.4: Content Delivery Networks & Anycast BGP Routing (Multi-PoP edge topology, BGP shortest-path routing)",
      "Tiered Edge Caching: Origin Server → Cache Shield (regional tier) → Edge PoP → Client; shields origin database from collapse during traffic spikes",
      "Cache Invalidation & Purging: Soft-purge (stale-while-revalidate), surrogate keys (tag-based instant purging), and byte-range HTTP request caching"
    ],
    readingLinks: [
      { title: "Cloudflare: How CDN Edge Networks Work", url: "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/" }
    ]
  },
  {
    day: 25,
    week: 4,
    weekTitle: "Applied Designs Part I: Ingress, Caching & Search",
    topic: "Spec 3: Distributed Cache Cluster (Redis / Memcached)",
    domain: "In-Memory Data Structures",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-3",
    isRevision: false,
    objective: "Architect a sub-millisecond distributed cache handling 500K ops/sec with horizontal peer-to-peer sharding and failover.",
    keyTradeoffs: [
      "Theory Concept 5.4 & 5.5: Why Redis Is So Fast & Bloom Filters for Cache Penetration Defense",
      "Redis Cluster Sharding: 16,384 hash slots partitioned across master nodes; MOVED and ASK redirection protocols for smart clients",
      "Hot Key & Thundering Herd Mitigation: Read-replicas with local cache layers, probabilistic early expiration (XFetch), and mutex singleflight requests"
    ],
    readingLinks: [
      { title: "Redis Cluster Specification", url: "https://redis.io/topics/cluster-spec" }
    ]
  },
  {
    day: 26,
    week: 4,
    weekTitle: "Applied Designs Part I: Ingress, Caching & Search",
    topic: "Spec 17: Distributed Web Crawler & Search Indexer",
    domain: "Web Ingestion & Indexing",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-17",
    isRevision: false,
    objective: "Traverse billions of web pages respecting domain politeness, filtering duplicates, and generating distributed inverted search indexes.",
    keyTradeoffs: [
      "Theory Concept 5.5 & 4.12: Bloom Filters for Visited URLs & Big Data Inverted Indexing Papers",
      "URL Frontier Architecture: Host politeness FIFO queues with delay timers combined with priority queues (PageRank / update frequency)",
      "Deduplication: 64-bit SimHash / MurmurHash fingerprinting for near-duplicate HTML content; Bloom filters in RAM for 10B+ URL existence checks"
    ],
    readingLinks: [
      { title: "Googlebot Architecture & Web Crawling at Scale", url: "http://infolab.stanford.edu/pub/papers/google.pdf" }
    ]
  },
  {
    day: 27,
    week: 4,
    weekTitle: "Applied Designs Part I: Ingress, Caching & Search",
    topic: "Spec 16: Search Autocomplete / Typeahead (Google Search Bar)",
    domain: "Prefix Search & Ranking",
    difficulty: "Hard",
    estTime: "80 mins",
    specId: "sd-16",
    isRevision: false,
    objective: "Return top 5 ranked search suggestions under 30ms for every keystroke entered by hundreds of millions of users.",
    keyTradeoffs: [
      "Theory Concept 1.6: Choosing Cloud Providers & Storage Engines for Big Data Trie Analytics",
      "In-Memory Trie Optimization: Serialized Prefix Tree stored in RAM, caching top-K most frequent query strings directly on each Trie node",
      "Offline Batch Processing: Spark/Hadoop processing past 7 days of search query logs to compute query frequencies and update serialized Trie weekly"
    ],
    readingLinks: [
      { title: "ByteByteGo: Design Search Autocomplete System", url: "https://blog.bytebytego.com" }
    ]
  },
  {
    day: 28,
    week: 4,
    weekTitle: "Applied Designs Part I: Ingress, Caching & Search",
    topic: "REVISION DAY 4 · Ingress, Caching & Search Whiteboard Drills",
    domain: "Applied Whiteboard Drills",
    difficulty: "Review & Mock",
    estTime: "85 mins",
    isRevision: true,
    objective: "Simulate real 45-minute whiteboard interviews on Week 4 designs: TinyURL, Rate Limiter, CDN, Distributed Cache, Web Crawler, and Autocomplete.",
    keyTradeoffs: [
      "Whiteboard Mock 1: Conduct a 45-minute timed design of an API Rate Limiter. Defend sliding window counter vs. token bucket with distributed Redis",
      "Whiteboard Mock 2: Design Autocomplete prefix search under strict 30ms p99 constraints. Detail how to update top-K nodes without taking down the cluster",
      "Whiteboard Mock 3: Compare Bloom filters with Redis sets for 10 billion URL deduplication: memory sizing and false positive implications"
    ],
    readingLinks: [
      { title: "System Design Interview Cheat Sheet: The 7-Step Method", url: "#/dashboard" }
    ]
  },

  // =========================================================================
  // WEEK 5: THE LAST 18 DAYS · APPLIED DESIGNS PART II (Days 29 to 35)
  // Planetary Storage, Messaging, Real-Time Collaboration & Telemetry
  // =========================================================================
  {
    day: 29,
    week: 5,
    weekTitle: "Applied Designs Part II: Storage, Messaging & Real-Time",
    topic: "Spec 2: Distributed Key-Value Store (DynamoDB / Cassandra)",
    domain: "Planetary Database Engines",
    difficulty: "Hard",
    estTime: "90 mins",
    specId: "sd-2",
    isRevision: false,
    objective: "Design a planetary-scale key-value store with tunable consistency, multi-master writes, and sub-10ms p99 at 1M+ QPS.",
    keyTradeoffs: [
      "Theory Concept 10.3: Conflict Resolution & Anti-Entropy (Vector Clocks, Merkle Trees & Gossip Membership)",
      "Tunable Quorum Math: $R + W > N$ ensures strong consistency; $W=1, R=1$ optimizes for write availability and sub-millisecond response",
      "Storage Engine & Repair: LSM-Tree storage with commit log on NVMe; Hinted handoff during temporary node failure; Read repair on stale quorum responses"
    ],
    readingLinks: [
      { title: "Amazon Dynamo Paper: Highly Available Key-Value Store", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" }
    ]
  },
  {
    day: 30,
    week: 5,
    weekTitle: "Applied Designs Part II: Storage, Messaging & Real-Time",
    topic: "Spec 4: Distributed Object Storage (Amazon S3 / Google Cloud Storage)",
    domain: "Exabyte Storage Systems",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-4",
    isRevision: false,
    objective: "Store exabytes of unstructured blob data with 11 9's durability using chunking, parallel multipart upload, and erasure coding.",
    keyTradeoffs: [
      "Theory Concept 6.4 & 6.5: Multipart Upload Protocols & Designing Amazon S3 Interview Question",
      "Decoupled Metadata vs. Block Servers: Metadata tier (CockroachDB/Spanner) managing directory tree and chunk locations separate from raw data chunk nodes",
      "Reed-Solomon Erasure Coding (e.g., 8+4 scheme: any 4 chunk servers can fail simultaneously without data loss, with only 50% storage overhead)"
    ],
    readingLinks: [
      { title: "AWS S3 Architecture & Multipart Upload Design", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html" }
    ]
  },
  {
    day: 31,
    week: 5,
    weekTitle: "Applied Designs Part II: Storage, Messaging & Real-Time",
    topic: "Spec 5: Distributed Message Queue & Event Bus (Kafka / RabbitMQ)",
    domain: "Distributed Event Streaming",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-5",
    isRevision: false,
    objective: "Build high-throughput append-only distributed event brokers supporting multi-partition consumer groups and message retention.",
    keyTradeoffs: [
      "Theory Concept 7.1 & 7.2: Delivery Semantics (Exactly-Once) & Why Kafka Is Fast (Sequential I/O + Page Cache Zero-Copy)",
      "Partitioning & Ordering: Total order guaranteed within a partition; messages routed by partition key hash; consumer rebalancing protocols",
      "RabbitMQ (push-based AMQP, complex routing exchanges, smart broker/dumb consumer) vs. Kafka (pull-based dumb broker/smart consumer, high throughput log)"
    ],
    readingLinks: [
      { title: "Kafka Internals: The Anatomy of a Distributed Streaming Platform", url: "https://kafka.apache.org/documentation/#design" }
    ]
  },
  {
    day: 32,
    week: 5,
    weekTitle: "Applied Designs Part II: Storage, Messaging & Real-Time",
    topic: "Spec 8: Distributed Multi-Channel Notification System",
    domain: "Async Messaging & Push",
    difficulty: "Medium",
    estTime: "75 mins",
    specId: "sd-8",
    isRevision: false,
    objective: "Deliver billions of push, SMS, and email alerts with user notification preferences, rate limits, and third-party circuit breakers.",
    keyTradeoffs: [
      "Theory Concept 2.7 & 13.5: Push Protocols (SSE, WebSockets, APNs/FCM) & Webhooks Outbound Delivery",
      "Priority Queues: Dedicated worker clusters for critical transactional alerts (OTP) separate from marketing promotional batch blasts",
      "Deduplication & Replay Defense: Redis key TTL locking on `(userId, eventId)` to guarantee idempotency across network retries"
    ],
    readingLinks: [
      { title: "Designing a Scalable Notification System", url: "https://blog.bytebytego.com" }
    ]
  },
  {
    day: 33,
    week: 5,
    weekTitle: "Applied Designs Part II: Storage, Messaging & Real-Time",
    topic: "Spec 7: Real-Time Chat & Messaging Service (WhatsApp / Slack)",
    domain: "Real-Time Collaboration",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-7",
    isRevision: false,
    objective: "Maintain millions of concurrent stateful WebSocket connections with instantaneous message delivery, online presence, and offline sync.",
    keyTradeoffs: [
      "Theory Concept 11.5 & 11.6: Scaling Long-Lived Connections & WebRTC Real-Time Media",
      "Connection Gateways: Ephemeral WebSocket servers tracking user connection state; Redis Pub/Sub routing messages across gateway servers",
      "Message Delivery State Machine: Device → Gateway → Queue → DB → Recipient Gateway (Single tick: sent, Double tick: delivered, Blue tick: read receipt)"
    ],
    readingLinks: [
      { title: "Discord: How Discord Scaled WebSocket Connections to 15M Concurrent Users", url: "https://discord.com/blog/why-discord-is-switching-from-go-to-rust" }
    ]
  },
  {
    day: 34,
    week: 5,
    weekTitle: "Applied Designs Part II: Storage, Messaging & Real-Time",
    topic: "Spec 9: Collaborative Document Editor (Google Docs / Figma)",
    domain: "Multiplayer Concurrency",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-9",
    isRevision: false,
    objective: "Synchronize simultaneous character edits over unreliable networks without conflicting overwrites or data loss.",
    keyTradeoffs: [
      "Theory Concept 13.1 & 10.2: Event Sourcing, CQRS & Distributed Time / Lamport Ordering",
      "Operational Transformation (OT: centralized sequencing server transforms character indexes) vs. Conflict-Free Replicated Data Types (CRDTs: mathematically convergent peer-to-peer state vectors)",
      "Snapshot Compaction & Undo Buffers: Periodic snapshot persistence to S3 with delta log compaction"
    ],
    readingLinks: [
      { title: "Figma: How Figma's Multiplayer Technology Works", url: "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/" }
    ]
  },
  {
    day: 35,
    week: 5,
    weekTitle: "Applied Designs Part II: Storage, Messaging & Real-Time",
    topic: "REVISION DAY 5 · Storage, Messaging & Real-Time Whiteboard Drills",
    domain: "Applied Whiteboard Drills",
    difficulty: "Review & Mock",
    estTime: "85 mins",
    isRevision: true,
    objective: "Simulate whiteboard scenarios for Week 5 systems: DynamoDB, S3, Kafka, Notification Service, WhatsApp, and Google Docs.",
    keyTradeoffs: [
      "Whiteboard Mock 1: Walk through an end-to-end design of WhatsApp. Diagram message delivery flow when recipient is offline and then reconnects",
      "Whiteboard Mock 2: Contrast DynamoDB quorum consistency math ($R+W > N$) with Kafka consumer offset commit guarantees",
      "Whiteboard Mock 3: Defend Operational Transformation vs. CRDTs in a Collaborative Document Editor whiteboard design session"
    ],
    readingLinks: [
      { title: "The 7-Step System Design Interview Framework", url: "#/dashboard" }
    ]
  },

  // =========================================================================
  // WEEK 6: THE LAST 18 DAYS · APPLIED DESIGNS PART III & CAPSTONE (Days 36 to 42)
  // Media, Geospatial, Ledgers, Flash Sales & Staff Capstone
  // =========================================================================
  {
    day: 36,
    week: 6,
    weekTitle: "Applied Designs Part III: Media, Geospatial & Staff Capstone",
    topic: "Spec 10: Global Video Streaming Platform (YouTube / Netflix)",
    domain: "Media Streaming & Transcoding",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-10",
    isRevision: false,
    objective: "Ingest 4K raw video, execute parallel transcoding DAG pipelines, and distribute globally via Adaptive Bitrate Streaming (HLS/DASH).",
    keyTradeoffs: [
      "Theory Concept 8.4 & 12.5: Outage War Stories & Autoscaling Capacity Planning Under Massive Ingress",
      "Distributed Video Transcoding: Split raw video into 10-second chunks → parallel GPU worker clusters → stitch multi-bitrate HLS/DASH manifests",
      "CDN Edge Caching: Multi-tier CDN caching (Open Connect / Cloudflare) with proactive pre-warming for trending releases"
    ],
    readingLinks: [
      { title: "Netflix: High Quality Video Encoding at Scale", url: "https://netflixtechblog.com/high-quality-video-encoding-at-scale-d159f3136ce7" }
    ]
  },
  {
    day: 37,
    week: 6,
    weekTitle: "Applied Designs Part III: Media, Geospatial & Staff Capstone",
    topic: "Spec 13: Proximity Server (Yelp / Google Maps Places)",
    domain: "Geospatial Indexing",
    difficulty: "Medium",
    estTime: "80 mins",
    specId: "sd-13",
    isRevision: false,
    objective: "Query places within a dynamic radius (e.g. 5km) from billions of coordinates with sub-15ms response times.",
    keyTradeoffs: [
      "Theory Concept 9.1 & 9.2: Proximity Search: Geohash and Quadtree & Designing Google Maps Routing Engines",
      "Geospatial Indexing: Geohash (Base32 2D bounding boxes, prefix string lookup) vs. QuadTree (recursive quadrant subdivision) vs. Google S2 (Hilbert curve space-filling)",
      "Boundary Conditions: Handling locations lying on quadrant boundaries by querying 8 neighboring bounding cells in parallel"
    ],
    readingLinks: [
      { title: "Uber: H3 Hexagonal Hierarchical Spatial Indexing", url: "https://www.uber.com/blog/h3/" }
    ]
  },
  {
    day: 38,
    week: 6,
    weekTitle: "Applied Designs Part III: Media, Geospatial & Staff Capstone",
    topic: "Spec 12: Ride-Sharing Dispatch & Tracking (Uber / Lyft)",
    domain: "Real-Time Geospatial Streams",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-12",
    isRevision: false,
    objective: "Ingest driver GPS coordinates every 4 seconds and match ride requests with nearby active drivers under dynamic surge pricing.",
    keyTradeoffs: [
      "Theory Concept 12.1 & 12.2: Distributed Tracing & High-Throughput Logging Pipelines",
      "Location Ingestion Pipeline: High-velocity driver GPS streams into Kafka → In-Memory Location Cache (Redis Geohash)",
      "Surge Pricing Engine: Streaming supply vs. demand calculation using Apache Flink across hexagonal H3 cells with dynamic multiplier updates"
    ],
    readingLinks: [
      { title: "Uber Engineering: Designing the Real-Time Dispatch Platform", url: "https://www.uber.com/blog/engineering/" }
    ]
  },
  {
    day: 39,
    week: 6,
    weekTitle: "Applied Designs Part III: Media, Geospatial & Staff Capstone",
    topic: "Spec 6: Social Media News Feed (Twitter / Instagram / Facebook)",
    domain: "Social Graph & Feeds",
    difficulty: "Hard",
    estTime: "85 mins",
    specId: "sd-6",
    isRevision: false,
    objective: "Generate personalized feeds for hundreds of millions of users balancing write amplification against read latencies.",
    keyTradeoffs: [
      "Theory Concept 7.3 & 13.4: Orchestration vs. Choreography & Service Decomposition with the Strangler Fig Pattern",
      "Fan-out on Write (Push: post copied to all followers' timeline caches; instant O(1) reads, catastrophic write amplification for celebrities)",
      "Hybrid Fan-out Architecture: Push for normal users, Pull for verified celebrities (>20k followers), merged at read time in Redis"
    ],
    readingLinks: [
      { title: "Twitter Engineering: Timelines at Scale", url: "https://blog.x.com/engineering/en_us/topics/infrastructure/2013/timelines-at-scale" }
    ]
  },
  {
    day: 40,
    week: 6,
    weekTitle: "Applied Designs Part III: Media, Geospatial & Staff Capstone",
    topic: "Spec 15: Payment Processing & Ledger System (Stripe / PayPal)",
    domain: "Fintech & Ledgers",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-15",
    isRevision: false,
    objective: "Process multi-currency monetary transactions with exactly-once settlement, immutable double-entry ledgers, and zero financial drift.",
    keyTradeoffs: [
      "Theory Concept 7.4 & 13.2: Distributed Transactions (2PC vs. Saga) & Idempotency Key Architecture",
      "Double-Entry Bookkeeping: Immutable debits and credits must sum to zero; account balances are never updated in-place",
      "Idempotency Protocol: Client UUID token acquired with distributed lock; response cached for 24 hours to prevent duplicate credit card charges"
    ],
    readingLinks: [
      { title: "Stripe: Designing Robust and Idempotent APIs", url: "https://stripe.com/blog/idempotency" }
    ]
  },
  {
    day: 41,
    week: 6,
    weekTitle: "Applied Designs Part III: Media, Geospatial & Staff Capstone",
    topic: "Spec 14 & 20: Flash Sale (Ticketmaster) & Distributed Scheduler",
    domain: "High Concurrency & Scheduling",
    difficulty: "Staff Level",
    estTime: "90 mins",
    specId: "sd-14",
    isRevision: false,
    objective: "Prevent inventory overselling during 100K QPS flash sales and execute delayed tasks across distributed worker nodes.",
    keyTradeoffs: [
      "Theory Concept 9.6 & 13.3: Flash Sale Architectures & Workflow Orchestration with Durable Execution",
      "Inventory Pre-Allocation: Stock stored in atomic Redis Lua counters (`DECRBY`) with virtual queuing gates (Token Bucket)",
      "Distributed Task Scheduler (`sd-20`): Hierarchical Timing Wheels, database leases, and worker heartbeat locks for millions of delayed jobs"
    ],
    readingLinks: [
      { title: "Designing a Flash Sale System Under Extreme Concurrency", url: "https://blog.bytebytego.com" }
    ]
  },
  {
    day: 42,
    week: 6,
    weekTitle: "Applied Designs Part III: Media, Geospatial & Staff Capstone",
    topic: "REVISION DAY 6 · Full Staff/Principal Mock Simulation & Capstone",
    domain: "Staff Capstone Simulation",
    difficulty: "Staff Level",
    estTime: "90 mins",
    isRevision: true,
    objective: "Execute a full 45-minute senior/staff whiteboard interview on an unseen prompt incorporating trade-offs, disaster recovery, cost, and cross-functional leadership.",
    keyTradeoffs: [
      "The 45-Minute Execution Rubric: Step 1 Scope & Numbers (8m) → Step 2 API & Capacity (7m) → Step 3 Core Architecture (15m) → Step 4 Bottleneck Deep Dives (15m)",
      "Staff-Level Differentiation: Driving trade-offs proactively, addressing financial cost constraints, multi-region failover, and operational observability",
      "Final Review: Complete personal mastery audit across all 20 production specs and 14 concept domains"
    ],
    readingLinks: [
      { title: "The Senior / Staff Engineering Interview Rubric", url: "#/dashboard" }
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
            <span class="text-[10px] font-code text-slate-400 mt-0.5">10 Core Dimensions</span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          ${activeReadinessFilter !== 'all' ? `
            <button
              type="button"
              class="sys-roadmap-filter-readiness px-2 py-0.5 rounded text-[10px] font-code font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400 flex items-center gap-1 cursor-pointer"
              data-readiness-filter="${activeReadinessFilter}"
              title="Clear readiness filter"
            >
              <span>${activeIndexObj?.shortName || activeReadinessFilter}</span>
              <span class="material-symbols-outlined text-[12px]">close</span>
            </button>
          ` : ''}
          <span class="px-2.5 py-0.5 rounded-md text-[10.5px] font-code tracking-wider uppercase font-semibold text-[#38BDF8] bg-[#0E2A3E]/90 border border-cyan-500/30">
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
              <span class="text-[24px] font-bold font-code text-white tracking-tight leading-none">${overall}%</span>
              <span class="text-[9.5px] font-code text-cyan-400 font-bold uppercase tracking-widest mt-1">OVERALL</span>
            </div>
          </div>

          <div class="flex items-center gap-1 text-[11px] font-code text-[#34D399] font-semibold mt-2">
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
                <div class="flex items-center justify-between text-[11px] font-code">
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
              <span class="px-2 py-0.5 rounded-full text-[10px] font-code bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
                42 Days • 6 Weeks • L5/L6 Focus
              </span>
            </div>
            <p class="text-[13px] text-slate-300 leading-relaxed">
              A comprehensive 6-week curriculum covering Parts 0 to 13 with weekly revision days every 7th day, leading into the 20 production specs in the last 18 study days paired with architectural theory.
            </p>

            <!-- Week-by-Week Progress Indicator -->
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

          <!-- Bottom Badges inside Hero Banner -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#24314A]/70 text-[11.5px] font-code z-10">
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
            class="sys-roadmap-filter-week px-3 py-1.5 rounded-lg text-[12px] font-code cursor-pointer transition-all flex items-center gap-1.5 ${weekFilter === 'today' ? 'bg-[#38BDF8] text-[#0A0E17] font-bold shadow-xs' : 'bg-[#141C2E] text-slate-300 hover:text-white border border-[#24314A]'}"
            data-week="today"
            title="Only show today's system design task to complete"
          >
            <span class="material-symbols-outlined text-[15px]">task_alt</span>
            <span>Today's Task (Day ${currentActiveDay})</span>
          </button>

          <button
            class="sys-roadmap-filter-week px-3 py-1.5 rounded-lg text-[12px] font-code cursor-pointer transition-all ${weekFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
            data-week="all"
            title="View all 42 days grid"
          >
            All 42 Days
          </button>

          <div class="h-4 w-[1px] bg-[#24314A] mx-1 hidden sm:block"></div>

          ${[1, 2, 3, 4, 5, 6].map(w => `
            <button
              class="sys-roadmap-filter-week px-2 py-1 rounded-md text-[11px] font-code cursor-pointer transition-colors ${weekFilter === String(w) ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'}"
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
              class="w-full pl-8 pr-2.5 py-1 bg-[#141C2E] border border-[#24314A] rounded-lg text-white text-[12px] placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <select
            id="sys-roadmap-readiness-select"
            class="bg-[#141C2E] border ${readinessFilter !== 'all' ? 'border-cyan-400 text-cyan-300 font-semibold' : 'border-[#24314A] text-slate-300'} text-[11.5px] font-code rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer shrink-0"
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
            class="bg-[#141C2E] border border-[#24314A] text-slate-300 text-[11.5px] font-code rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer shrink-0"
          >
            <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>Status: All</option>
            <option value="completed" ${statusFilter === 'completed' ? 'selected' : ''}>✓ Completed</option>
            <option value="pending" ${statusFilter === 'pending' ? 'selected' : ''}>○ Incomplete</option>
          </select>
        </div>
      </div>

      <!-- Active Readiness Filter Indicator -->
      ${readinessFilter !== 'all' ? `
        <div class="flex items-center justify-between bg-[#141C2E] border border-cyan-500/40 rounded-xl px-4 py-2.5 shadow-sm text-[12px] font-code text-cyan-300">
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
      class="roadmap-day-card bg-[#141C2E] border ${item.isRevision ? 'border-indigo-500/50 bg-[#161D32]' : isDone ? 'border-emerald-500/50 shadow-md shadow-emerald-500/10' : 'border-cyan-500/40 shadow-lg shadow-cyan-500/5'} rounded-xl p-6 md:p-7 flex flex-col gap-5 transition-all relative group"
      data-day="${item.day}"
      id="today-system-design-card"
    >
      <!-- Top Row: Day Pill, Stepper & Badges -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#24314A]/70">
        <div class="flex items-center gap-2.5 flex-wrap">
          <span class="px-3 py-1 rounded-lg font-code text-[12px] font-bold ${item.isRevision ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'}">
            TODAY'S FOCUS • DAY ${String(item.day).padStart(2, '0')} OF 42
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-code font-bold uppercase border ${badgeColor}">
            ${item.difficulty}
          </span>
          <span class="text-[12px] font-code text-slate-400">
            Week ${item.week} • ${escapeHtml(item.weekTitle)}
          </span>
        </div>

        <!-- Day Navigation Stepper -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="flex items-center gap-1 bg-[#0F1626] border border-[#24314A] rounded-lg p-0.5">
            <button class="sys-roadmap-prev-day-btn p-1.5 rounded hover:bg-[#182238] text-slate-400 hover:text-white transition-colors cursor-pointer ${item.day <= 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}" title="Previous Day">
              <span class="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>

            <select class="sys-roadmap-jump-select bg-transparent text-cyan-300 font-code text-[11.5px] font-bold px-2 py-0.5 focus:outline-none cursor-pointer">
              ${SYSTEM_DESIGN_6_WEEK_ROADMAP.map(d => `
                <option value="${d.day}" ${d.day === item.day ? 'selected' : ''} class="bg-[#0F1626] text-white">
                  ${roadmapState[d.day]?.completed ? '✓ ' : ''}Day ${d.day}: ${escapeHtml(d.topic.slice(0, 32))}...
                </option>
              `).join('')}
            </select>

            <button class="sys-roadmap-next-day-btn p-1.5 rounded hover:bg-[#182238] text-slate-400 hover:text-white transition-colors cursor-pointer ${item.day >= 42 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}" title="Next Day">
              <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <button
            type="button"
            class="sys-roadmap-filter-week px-2.5 py-1 rounded-lg text-[11px] font-code text-slate-300 bg-[#0F1626] hover:bg-[#182238] border border-[#24314A] hover:border-cyan-500/40 transition-all flex items-center gap-1 cursor-pointer"
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
        <span class="text-[11px] font-code text-slate-400 font-semibold flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px] text-cyan-400">psychology</span>
          Target Competencies (${dayIndexes.length}):
        </span>
        ${dayIndexes.map(idx => `
          <button
            type="button"
            class="sys-roadmap-filter-readiness px-2.5 py-0.5 rounded text-[10.5px] font-code font-semibold border ${idx.badgeClass} flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
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
              <span class="font-code text-[10.5px] text-cyan-400 font-semibold uppercase tracking-wider">Production Spec Pairing</span>
              <span class="text-[13.5px] font-sans font-bold text-white truncate">
                ${escapeHtml(item.topic)}
              </span>
            </div>
          </div>
          <button
            type="button"
            class="open-spec-modal-btn px-3.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-[12px] font-code font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
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
          <span class="text-[11px] font-code text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">layers</span>
            Today's Topic Breakdown (${topics.length} Concepts):
          </span>
          <span class="text-[11px] font-code text-slate-400 hidden sm:inline">Click any concept tab below to master its architecture</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          ${topics.map((t, idx) => `
            <button
              type="button"
              class="roadmap-topic-tab px-3.5 py-1.5 rounded-lg text-[12px] font-code font-semibold cursor-pointer transition-all ${idx === 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs active ring-1 ring-cyan-500/30' : 'bg-[#0F1626] text-slate-400 border border-[#24314A] hover:text-slate-200 hover:border-slate-500'}"
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
      <div id="roadmap-topic-content-${item.day}" class="roadmap-topic-content flex flex-col gap-4 p-4 rounded-xl bg-[#0A0E1A]/90 border border-[#24314A]/90 shadow-inner">
        ${renderTopicDetail(topics[0])}
      </div>

      <!-- Bottom Card Action Strip: Completion Toggle & Reading Links -->
      <div class="pt-4 border-t border-[#24314A]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Complete / Reopen Action -->
        <div class="flex items-center gap-3 flex-wrap">
          ${isDone ? `
            <div class="flex items-center gap-2.5">
              <span class="px-4 py-2 rounded-xl bg-emerald-500/20 text-[#10B981] border border-emerald-500/40 font-code text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                <span class="material-symbols-outlined text-[18px]">done_all</span>
                <span>Day ${item.day} Mastered!</span>
              </span>
              ${item.day < 42 ? `
                <button class="sys-roadmap-jump-day px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-sans text-[12.5px] font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer" data-day="${item.day + 1}">
                  <span>Advance to Day ${item.day + 1}</span>
                  <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              ` : ''}
              <button class="toggle-roadmap-day-btn px-3 py-2 rounded-xl bg-[#182238] hover:bg-[#24314A] text-slate-300 hover:text-white border border-[#24314A] font-code text-[11.5px] transition-colors cursor-pointer" data-day="${item.day}">
                Reopen Day ${item.day}
              </button>
            </div>
          ` : `
            <button class="toggle-roadmap-day-btn px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-sans text-[13px] font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer" data-day="${item.day}">
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Mark Day ${item.day} Task Complete</span>
            </button>
          `}
        </div>

        <!-- Right: References & Est Time -->
        <div class="flex items-center gap-3 text-[12px] font-code text-slate-400 flex-wrap">
          <span>Est: <strong class="text-slate-200">${item.estTime}</strong></span>
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
              <span class="text-[10px] font-code px-2 py-0.5 rounded border ${idx.badgeClass} flex items-center gap-1 shrink-0" title="${escapeHtml(idx.name)}: ${escapeHtml(idx.description)}">
                <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${idx.color}"></span>
                <span>${idx.shortName}</span>
              </span>
            `).join('')}
          </div>
        </div>
        <span class="text-[10px] font-code text-cyan-400 shrink-0 bg-[#0A0E1A] px-2 py-0.5 rounded border border-cyan-500/20">
          ${escapeHtml(topic.section)}
        </span>
      </div>

      <!-- What it is / Explanation -->
      <p class="text-[12.5px] text-slate-300 leading-relaxed">
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
          <span class="font-code text-[10px] text-cyan-400 uppercase font-semibold tracking-wider flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">tune</span>
            Key Architectural Trade-offs & Invariants:
          </span>
          <ul class="flex flex-col gap-1 text-[11.5px] text-slate-300 list-disc list-inside">
            ${topic.tradeoffs.map(t => `<li class="leading-relaxed">${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Key Senior Takeaway -->
      ${topic.keyTakeaway ? `
        <div class="bg-cyan-950/30 border-l-2 border-cyan-500 px-3 py-2 rounded-r text-[11.5px] text-cyan-200/90 leading-relaxed font-sans mt-0.5">
          <strong class="font-code text-[10px] uppercase text-cyan-400 tracking-wider block mb-0.5">Key Senior Takeaway:</strong>
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
      class="roadmap-small-day-card bg-[#141C2E] border ${item.isRevision ? 'border-indigo-500/40 bg-[#161D32]' : isDone ? 'border-emerald-500/40 shadow-xs shadow-emerald-500/10' : 'border-[#24314A] hover:border-cyan-500/40'} rounded-xl p-5 flex flex-col justify-between gap-4 transition-all shadow-sm relative group select-text cursor-default"
      data-day="${item.day}"
    >
      <!-- Top Section -->
      <div class="flex flex-col gap-3">
        <!-- Top Row: Day Pill, Week & Difficulty Badge, Completion Status -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded font-code text-[11px] font-bold ${item.isRevision ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-[#0F1626] text-cyan-400 border border-cyan-500/30'}">
              DAY ${String(item.day).padStart(2, '0')}
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-code font-semibold uppercase border ${badgeColor}">
              ${item.difficulty}
            </span>
            <span class="text-[11px] font-code text-slate-400 truncate max-w-[140px] sm:max-w-none">
              Week ${item.week}
            </span>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <label class="flex items-center gap-1.5 cursor-pointer select-none stop-prop" title="Toggle Day Completion">
              <input
                type="checkbox"
                class="sys-roadmap-toggle-checkbox w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-[#0F1626] cursor-pointer"
                data-roadmap-day="${item.day}"
                ${isDone ? 'checked' : ''}
              />
            </label>
            ${isDone ? `
              <span class="text-[10.5px] font-code font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                Done ✓
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Headline: Day Main Topic & Objective -->
        <div class="flex flex-col gap-1">
          <h3 class="font-sans text-[15.5px] font-bold text-white tracking-tight leading-snug">
            ${escapeHtml(item.topic)}
          </h3>
          <p class="text-[12px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
            ${escapeHtml(item.objective)}
          </p>
        </div>

        <!-- Readiness Index Badges for this day -->
        <div class="flex flex-wrap items-center gap-1.5 my-0.5">
          ${dayIndexes.map(idx => `
            <span class="px-2 py-0.5 rounded text-[10px] font-code border ${idx.badgeClass} flex items-center gap-1 shrink-0" title="${escapeHtml(idx.name)}: ${escapeHtml(idx.description)}">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${idx.color}"></span>
              <span>${idx.shortName}</span>
            </span>
          `).join('')}
        </div>

        <!-- Spec Tag (If production spec) -->
        ${item.specId ? `
          <div class="flex items-center justify-between gap-2 bg-[#0F1626] border border-cyan-500/30 rounded-lg px-2.5 py-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <span class="material-symbols-outlined text-cyan-400 text-[16px] shrink-0">inventory_2</span>
              <span class="text-[11.5px] font-sans font-semibold text-cyan-300 truncate">
                Production Blueprint Spec
              </span>
            </div>
            <button
              type="button"
              class="open-spec-modal-btn px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 text-[10.5px] font-code font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer stop-prop"
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
        <div class="flex flex-col gap-2 pt-1 border-t border-[#24314A]/70">
          <div class="flex items-center justify-between text-[11px] font-code text-slate-400">
            <span class="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">checklist</span>
              Topics to Cover (${topics.length}):
            </span>
            <span>Est: <strong class="text-slate-300 font-semibold">${item.estTime}</strong></span>
          </div>

          <div class="flex flex-col gap-1.5 bg-[#0A0E1A]/80 border border-[#1E293B] rounded-xl p-2.5 shadow-inner">
            ${topics.map((t, idx) => {
              const topicIndexes = getReadinessIndexesForTopic(t.id, item.day);
              const primaryIdx = topicIndexes[0];
              return `
                <div class="flex items-center justify-between gap-2 text-[12px] text-slate-200 py-0.5">
                  <div class="flex items-start gap-2 min-w-0 flex-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                    <div class="flex items-baseline gap-1.5 min-w-0">
                      <span class="font-code text-[11px] text-cyan-300 font-semibold shrink-0">${escapeHtml(t.id || String(idx + 1))}</span>
                      <span class="truncate font-sans font-medium text-slate-300 text-[12px]">${escapeHtml(t.title || t.tabTitle)}</span>
                    </div>
                  </div>
                  ${primaryIdx ? `
                    <span class="text-[9.5px] font-code px-1.5 py-0.5 rounded border ${primaryIdx.badgeClass} shrink-0 hidden sm:inline-block" title="${escapeHtml(primaryIdx.name)}">
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
      <div class="pt-3 border-t border-[#24314A] flex items-center justify-between gap-3">
        <span class="text-[11px] font-code text-slate-500 truncate">
          ${item.readingLinks && item.readingLinks[0] ? escapeHtml(item.readingLinks[0].title.slice(0, 20)) + '...' : `Day ${item.day} Curriculum`}
        </span>

        <button
          type="button"
          class="start-roadmap-day-btn px-4 py-2 rounded-xl ${isDone ? 'bg-[#182238] hover:bg-[#202E4C] text-emerald-300 border border-emerald-500/30' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20'} font-sans text-[12.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
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

