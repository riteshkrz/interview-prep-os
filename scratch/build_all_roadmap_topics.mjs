import fs from 'fs';
import path from 'path';

// Script to generate the comprehensive SYSTEM_DESIGN_TOPICS_BY_DAY covering Days 1 to 42.
// Note: As requested by user, for Days 22-41 (which pair with the 20 database specs),
// we SKIP the content for the 20 database problems themselves, and instead provide the
// paired theoretical concepts and architectural topics from the guide.

const TOPICS_BY_DAY = {
  1: [
    {
      id: "0.1",
      tabTitle: "0.1 Playbook",
      title: "0.1 How to Use This Guide",
      section: "Part 0 · The Playbook",
      whatItIs: "A standardized blueprint for attacking any senior/staff system design problem. Every topic follows the same anatomy: What it is → Why → Architecture / Flow → Trade-offs → When to use/avoid → Real-world systems → Follow-ups → Key takeaway.",
      architecture: "READING PATHS:\n• Two days out: Part 0, then Key Takeaway & Trade-off tables\n• Two weeks out: Parts 4, 5 & 7 in full (Databases, Caching, Messaging)\n• Infra / Platform role: Parts 1, 6 & 8 in full\n• Fintech role: Section 9.4 (Payments) + 4.1, 7.1, 7.4",
      tradeoffs: [
        "Memorizing buzzwords vs. Explaining trade-offs (Interviewers score trade-offs, not technology lists)",
        "Breadth vs. Depth (Pin down the end-to-end happy path in 20 minutes before deep-diving bottlenecks)"
      ],
      keyTakeaway: "Interviews are not a recall test — they are a judgement test. For every design you propose, say what it costs, what it breaks, and what you would monitor."
    },
    {
      id: "0.2",
      tabTitle: "0.2 7-Step Skeleton",
      title: "0.2 The 7-Step Interview Framework",
      section: "Part 0 · The Playbook",
      whatItIs: "Most failed senior loops are not failures of knowledge — they are failures of sequencing. The candidate starts drawing boxes at minute three, never states a number, and never names a trade-off. Use a fixed skeleton so your working memory is spent on the problem, not on the process.",
      architecture: "45-MINUTE TIMELINE BUDGET:\n• 0–5 min: 1. Requirements (Functional, non-functional, explicitly out of scope; say out loud what you are not building)\n• 5–8 min: 2. Scale Math (QPS, storage/yr, bandwidth, read:write ratio; 1 min of arithmetic determines single-node vs. sharded)\n• 8–12 min: 3. API + Data Model (Access patterns determine DB; write the 3 queries the system must serve fast)\n• 12–20 min: 4. High-Level Design (Boxes, arrows, trace one request end to end before adding anything clever)\n• 20–35 min: 5. Deep Dive (The 1–2 hard parts interviewer steers you to, e.g. idempotency & double charging)\n• 35–42 min: 6. Scale + Failure (Bottleneck → fix → new bottleneck; what breaks when node dies, net split, or 10× traffic)\n• 42–45 min: 7. Wrap-Up & Trade-offs (\"I chose X over Y because of Z; if requirement changed to W I would revisit it\")",
      tradeoffs: [
        "Requirements: Starts designing immediately (Mid-level) vs. Pins down scale, consistency and latency targets first (Senior/Staff)",
        "Technology choice: 'I'd use Kafka and Cassandra' (Mid-level) vs. 'Write-heavy, append-only, low-cardinality queries → Cassandra; if we need ad-hoc joins, this is the wrong call' (Senior/Staff)",
        "Trade-offs: Lists pros and cons generically (Mid-level) vs. Quantifies: '50% storage overhead vs. 200% for 3× replication' (Senior/Staff)",
        "Failure handling: 'Add a replica' (Mid-level) vs. Explains failover, split-brain, replication lag, and read-after-write repair (Senior/Staff)",
        "Ownership: Design only (Mid-level) vs. Mentions rollout, migration, monitoring, on-call blast radius (Senior/Staff)"
      ],
      keyTakeaway: "\"I chose X over Y because of Z; if the requirement changed to W I would revisit it.\" — This is the sentence that gets you the senior offer rather than the mid-level one. Narrate your uncertainty instead of hiding it: interviewers probe claims; they rarely probe honest boundaries."
    },
    {
      id: "0.3",
      tabTitle: "0.3 Estimation Math",
      title: "0.3 Back-of-the-Envelope Estimation",
      section: "Part 0 · The Playbook",
      whatItIs: "Order-of-magnitude arithmetic done on the whiteboard to size a system before designing it. Estimations are important because we need them to understand the scale of the system, justify the design, and answer whether we need a distributed solution, a cache layer, or data replication vs. sharding.",
      architecture: "THE FOUR NUMBERS TO DERIVE EVERY TIME (WORKSHEET):\n# 1. Traffic: DAU × actions/user/day = requests/day ÷ 86,400 = avg QPS; peak QPS ≈ avg × 2 to 10\n# 2. Storage: writes/day × bytes/write × 365 × retention_years × replication_factor\n# 3. Bandwidth: peak QPS × average payload bytes (split ingress vs egress)\n# 4. Memory (cache): hot set ≈ 20% of daily reads (80/20 rule) × object size\n\nWORKED EXAMPLE — TWITTER-SCALE TIMELINE:\n• Assumptions: 150M DAU, 2 tweets/day, 100 reads/day, 300B/tweet\n• Writes: 300M/day ÷ 86,400 ≈ 3,500 write QPS (Fits in 1 primary DB)\n• Reads: 15B/day ÷ 86,400 ≈ 175,000 read QPS (50:1 read:write ratio → Cache + Fanout-on-write)\n• Storage: 90 GB/day ≈ 33 TB/yr × 3 replicas ≈ 100 TB/yr\n• Conclusion: Writes fit on one beefy node; reads do not. Shard by user_id, cache in Redis.\n\nROUNDING RULES:\n• 1 day ≈ 86,400 s ≈ 10^5 s (1M/day ≈ 10 QPS; 1B/day ≈ 12K QPS)\n• 2^10=KB, 2^20=MB, 2^30=GB, 2^40=TB, 2^50=PB\n• Round to one significant figure and say so.",
      tradeoffs: [
        "Jumping to sharding vs. Checking data size: Quadtree index takes only 1.71 GB RAM (fits in 1 node); read replicas spread read load cleanly, whereas sharding introduces complex app routing and scatter-gather",
        "Estimate when: Choosing single-node vs distributed, justifying cache/shard/CDN, sizing queue buffers, arguing storage overhead vs erasure coding",
        "Don't over-invest when: Interviewer says 'assume it's huge, skip math', burning >5 min on arithmetic, or when precision changes no architectural decision",
        "Replication limits: Replicas stop working when (a) write throughput saturates, (b) working set exceeds 1 node RAM, or (c) replication lag violates SLAs → dictates sharding"
      ],
      keyTakeaway: "Numbers before boxes. Five lines of arithmetic tell you whether you need a distributed system at all. The strongest signal you can send is talking yourself out of complexity — \"1.71 GB fits in RAM, so replicas beat shards here\" — because it proves you optimise for operability, not for resume keywords."
    },
    {
      id: "0.4",
      tabTitle: "0.4 Latency Constants",
      title: "0.4 Numbers Every Engineer Should Memorise",
      section: "Part 0 · The Playbook",
      whatItIs: "The baseline physical constants of computing hardware and networks. You cannot justify a design choice without knowing the cost of each hop.",
      architecture: "LATENCY CONSTANTS:\n• L1 cache reference: ~1 ns (Free)\n• Main memory (RAM) reference: ~100 ns (100× slower than L1)\n• NVMe SSD random read: ~16–100 µs (1,000× slower than RAM)\n• Datacenter round trip (intra-DC): ~0.5 ms (20 hops = 10 ms floor)\n• Cross-continent RTT (CA to Netherlands): ~150 ms (Why CDNs/Edge PoPs exist)\n• Availability Budgets: 99.9% = 8.77 hrs downtime/yr | 99.99% = 52.6 min/yr",
      tradeoffs: [
        "Synchronous cross-region writes vs. Latency SLA (150 ms WAN RTT blows any 200 ms p99 budget; forces async replication)",
        "Serial dependencies multiplication (Five 99.9% services in series give a theoretical ceiling of 99.9%^5 ≈ 99.5%)"
      ],
      keyTakeaway: "Quote one concrete number per design decision: 'A cross-region round trip is ~150 ms, so synchronous replication would blow our 200 ms p99 budget.'"
    }
  ],

  2: [
    {
      id: "1.1",
      tabTitle: "1.1 Process vs Thread",
      title: "1.1 Process vs. Thread",
      section: "Part 1 · Compute Foundations",
      whatItIs: "A program is code on disk. A process is a program in execution with its own isolated virtual memory address space. A thread is the smallest schedulable unit of execution sharing the process heap and code segment.",
      architecture: "ADDRESS-SPACE MODEL:\nProcess A: [Code | Data | Heap] ── Threads T1, T2 share Heap & Code (cheap comms, race risk)\nProcess B: [Code | Data | Heap] ── Process A & B share NOTHING (IPC needed, full fault isolation)",
      tradeoffs: [
        "Processes (Strong isolation, memory safety boundary, Chrome tabs) vs. Threads (Shared heap, ~1 MB stack, thread pool limits)",
        "Kernel Preemptive Threads vs. User-space Cooperative Coroutines (Goroutines, Kotlin coroutines cost KBs and scale to millions)"
      ],
      keyTakeaway: "Processes buy isolation; threads buy cheap sharing; coroutines buy concurrency density. Name the property you are buying."
    },
    {
      id: "1.2",
      tabTitle: "1.2 VMs vs Containers",
      title: "1.2 Virtualization vs. Containerization",
      section: "Part 1 · Compute Foundations",
      whatItIs: "Virtualization uses a hypervisor to abstract physical hardware into multiple guest operating systems. Containerization virtualizes the host OS kernel using namespaces, cgroups, and overlayfs.",
      architecture: "ISOLATION MECHANISMS:\n• VMs: Hardware Isolation (Guest OS + Hypervisor) → Minutes start-up, GBs image, 5–15% CPU overhead\n• Containers: Linux kernel namespaces (PID, net, mount) + cgroups (CPU, RAM limits) + overlayfs → Milliseconds start-up, MBs image\n• MicroVMs (AWS Firecracker): Container density with hardware virtualization security boundary (~125 ms boot)",
      tradeoffs: [
        "Virtual Machines (Hardware boundary, multi-tenant untrusted code) vs. Containers (Shared kernel, high host density, CI/CD speed)",
        "Container escapes (A shared kernel vulnerability compromises the entire host; containers are a configuration boundary, not security)"
      ],
      keyTakeaway: "Virtualization abstracts hardware; containerization abstracts the OS. MicroVMs exist precisely because some workloads refuse to trade security for density."
    },
    {
      id: "1.3",
      tabTitle: "1.3 Cloud Models",
      title: "1.3 Cloud Service Models: IaaS, PaaS, SaaS",
      section: "Part 1 · Compute Foundations",
      whatItIs: "The three standard tiers of cloud abstraction defining the boundary of operational responsibility between cloud vendor and engineering team.",
      architecture: "RESPONSIBILITY SPECTRUM:\n• On-Prem: You manage hardware, virtualization, OS, runtime, and app\n• IaaS (EC2, S3, VPC): Vendor owns hardware & hypervisor; you manage OS, middleware, app\n• PaaS (Heroku, App Engine, RDS): Vendor manages OS & runtime; you own code & data\n• SaaS (Gmail, Datadog): Vendor manages everything; you consume via web/API",
      tradeoffs: [
        "Control vs. Operational Headcount (IaaS gives kernel tuning but requires dedicated SRE team; PaaS speeds time to market)",
        "Proprietary PaaS lock-in vs. Portability (Keep business logic in portable containers, wrap cloud services behind interfaces)"
      ],
      keyTakeaway: "Anchor choice on three axes: control, operational headcount, and lock-in vs. time-to-market."
    }
  ],

  3: [
    {
      id: "1.4",
      tabTitle: "1.4 Serverless Internals",
      title: "1.4 AWS Lambda Behind the Scenes",
      section: "Part 1 · Compute Foundations",
      whatItIs: "Serverless event-driven execution runtime that runs code in sandboxed Firecracker microVMs with sub-second provisioning and scale-to-zero billing.",
      architecture: "INVOCATION PATHWAYS:\n• Sync: Client → Frontend Worker → Worker Manager → Placement Service (Provisions MicroVM) → Init (download S3 bundle) → Invoke\n• Async: Client → ALB → Frontend → Internal SQS Queue → Pollers → Worker MicroVM\n• Cold Start: Sandbox placement + download code + runtime bootstrap + init code (avoid heavy VM runtimes, use Provisioned Concurrency)",
      tradeoffs: [
        "Serverless (Spiky, unpredictable traffic, event glue, zero idle cost) vs. Containers (Steady high-throughput, predictable p99 latency)",
        "Connection exhaustion (1,000 concurrent Lambdas exhaust DB connections; requires RDS Proxy or PgBouncer)"
      ],
      keyTakeaway: "Serverless does not remove servers; it moves capacity planning to the vendor. Judge it on traffic shape: bursty favors functions, steady favors containers."
    },
    {
      id: "1.5",
      tabTitle: "1.5 Scaling Ladder",
      title: "1.5 Scaling a Website to Millions of Users",
      section: "Part 1 · Compute Foundations",
      whatItIs: "The canonical 6-step evolution ladder from a single monolith server to a global distributed microservice platform.",
      architecture: "THE 6-STEP EVOLUTION LADDER:\nStep 1: Split Web Server & Database (Removes CPU contention)\nStep 2: Add Stateless App Server Cluster (Requires pushing session state to Redis/tokens)\nStep 3: Introduce Load Balancers (L4/L7 health checks, even distribution)\nStep 4: Separate Reads & Writes (Read-replicas for 10:1 read ratios)\nStep 5: Partition & Cache (Memcached/Redis cache-aside, horizontal database sharding)\nStep 6: Decompose into Microservices (Solves team velocity and organizational scaling)",
      tradeoffs: [
        "Read Replicas (Cheap read scale, but introduces replication lag breaking read-after-write)",
        "Monolith vs. Microservices (Microservices solve team coordination problems, not performance problems; adds 20 network hops on critical path)"
      ],
      keyTakeaway: "Scaling is not a ladder you recite — it is: find the bottleneck, remove it, name what breaks next. Replicas scale reads; only sharding scales writes."
    },
    {
      id: "1.6",
      tabTitle: "1.6 Big Data Cloud",
      title: "1.6 Choosing a Cloud Provider for Big Data",
      section: "Part 1 · Compute Foundations",
      whatItIs: "Standard 5-stage big data reference architecture and the corresponding tool equivalents across AWS, Google Cloud, and Microsoft Azure.",
      architecture: "THE 5-STAGE PIPELINE:\n1. Serverless Ingest: AWS Lambda | GCP Cloud Functions | Azure Functions\n2. Streaming Ingest: Kinesis/MSK | Pub/Sub | Event Hubs\n3. Raw Data Lake: S3 | Cloud Storage | Azure Blob\n4. Batch/Stream Processing: EMR/Glue | Dataproc/Dataflow | Databricks/HDInsight\n5. OLAP Warehouse: Redshift | BigQuery | Synapse",
      tradeoffs: [
        "Data Warehouse (Known schema, BI reporting, fast joins) vs. Data Lakehouse (Delta/Iceberg on object storage, raw schema-on-read, ML)",
        "Batch (Cheap, hourly tolerance, simple replay) vs. Streaming (Sub-second fraud/alerting, requires watermarking and stateful windowing)"
      ],
      keyTakeaway: "Big data architecture is vendor-neutral: Ingest → Lake → Process → Warehouse → Present. Differentiate on query pricing models and cross-cloud egress costs."
    }
  ],

  4: [
    {
      id: "11.1",
      tabTitle: "11.1 TCP vs UDP",
      title: "11.1 TCP and UDP Fundamentals",
      section: "Part 11 · Networking",
      whatItIs: "TCP provides an ordered, reliable byte stream over an unreliable packet network. UDP provides raw connectionless datagram delivery with minimum latency.",
      architecture: "TCP MECHANICS & BANDWIDTH-DELAY PRODUCT:\n• 3-Way Handshake: SYN → SYN-ACK → ACK + request (1 RTT before any data)\n• Slow Start: cwnd doubles every RTT (14KB → 28KB → 56KB → 113KB)\n• Bandwidth-Delay Product: Max Throughput = Window Size / RTT. On 100ms RTT link, 64KB window caps transfer at ~5 Mbps regardless of 10 Gbps line!",
      tradeoffs: [
        "TCP (Order, retransmission, congestion control, HTTP/2) vs. UDP (0-RTT, loss-tolerant, audio/video streaming, DNS, QUIC)",
        "Packet Loss Impact (1% loss at 100ms RTT collapses TCP throughput via cubic backoff; BBR congestion control measures bottleneck bandwidth instead)"
      ],
      keyTakeaway: "Latency, not bandwidth, is the constraint. Throughput is window / RTT. Terminating connections close to the user shortens the round-trip loop."
    },
    {
      id: "2.1",
      tabTitle: "2.1 HTTP Generations",
      title: "2.1 HTTP 1.0 → 1.1 → 2 → 3 (QUIC)",
      section: "Part 2 · Networking & Protocols",
      whatItIs: "The generational evolution of the web's communication protocol, systematically removing head-of-line (HOL) blocking at different layers.",
      architecture: "GENERATIONAL COMPARISON:\n• HTTP/1.0 (1996): 1 request per TCP connection (High handshake overhead)\n• HTTP/1.1 (1997): Keep-alive persistent connections, but sequential pipeline (Application HOL blocking)\n• HTTP/2 (2015): Binary framing, multiplexed streams over 1 TCP connection (Transport HOL remains if 1 packet drops)\n• HTTP/3 (2022): QUIC over UDP; independent streams (Transport HOL solved; 0-RTT resumption; connection migration)",
      tradeoffs: [
        "HTTP/2 Multiplexing Trap (On lossy mobile networks, 1 lost packet stalls all multiplexed streams; HTTP/3 solves this via UDP)",
        "Domain sharding & concatenation (Antipatterns under HTTP/2 & 3; split multiplexed benefits and defeat fine-grained caching)"
      ],
      keyTakeaway: "Each HTTP generation removed one blocking layer: 1.1 removed per-request handshakes, 2.0 removed app HOL, 3.0 removed transport HOL."
    },
    {
      id: "2.2",
      tabTitle: "2.2 How HTTPS Works",
      title: "2.2 How HTTPS Works",
      section: "Part 2 · Networking & Protocols",
      whatItIs: "HTTP layered on Transport Layer Security (TLS), combining asymmetric cryptography for key exchange with fast symmetric encryption for payload data.",
      architecture: "TLS 1.3 HANDSHAKE (1 RTT):\nClient ── ClientHello (cipher suites, key share) ──► Server\nClient ◄── ServerHello + Certificate + Finished ──── Server (1 RTT)\nClient ══ Symmetric AES-GCM Encrypted Data ════════► Server (0 extra RTT)\nModern TLS uses ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) for Forward Secrecy.",
      tradeoffs: [
        "Asymmetric encryption (RSA/ECC, expensive CPU, used only for key establishment) vs. Symmetric (AES-NI, hardware-accelerated, bulk data)",
        "TLS Termination at Edge (Enables CDN caching, compression, WAF inspection) vs. End-to-End mTLS (Zero-trust security across microservices)"
      ],
      keyTakeaway: "Asymmetric crypto establishes trust and a key; symmetric crypto does the work. TLS 1.3 uses ECDHE for forward secrecy in 1 RTT."
    }
  ],

  5: [
    {
      id: "2.3",
      tabTitle: "2.3 DNS Lookup",
      title: "2.3 DNS Lookup",
      section: "Part 2 · Networking & Protocols",
      whatItIs: "Hierarchical, globally distributed phonebook translating human-readable hostnames (google.com) into machine-routable IP addresses.",
      architecture: "RECURSIVE RESOLUTION FLOW:\nClient → Browser Cache → OS Cache → Recursive Resolver (ISP/8.8.8.8) → Root Nameserver (.) → TLD Nameserver (.com) → Authoritative Nameserver (ns1.google.com) → IP (142.251.46.238)\nCache hierarchy checked cheapest first. Real resolution takes 20–120 ms.",
      tradeoffs: [
        "DNS as Routing vs. Failover (GeoDNS routes to closest region, but client/ISP TTL disrespect makes DNS failover take minutes, not seconds)",
        "TTL Tuning (Short TTL: 30s enables fast failover but increases query volume; Long TTL: hours improves cache hit rate)"
      ],
      keyTakeaway: "DNS is a hierarchical, aggressively cached lookup service and routing tool, not a real-time failover switch. For sub-second failover, do it below DNS."
    },
    {
      id: "2.4",
      tabTitle: "2.4 URL Lifecycle",
      title: "2.4 What Happens When You Type a URL",
      section: "Part 2 · Networking & Protocols",
      whatItIs: "The complete browser request lifecycle from URL entry to rendering: URL parsing → DNS lookup → TCP handshake → TLS negotiation → HTTP GET → HTML response → DOM rendering.",
      architecture: "THE END-TO-END FLOW:\n1. URL Parsing (Scheme, host, port, path)\n2. DNS Resolution (Recursive lookup or local cache)\n3. Transport Connection (SYN → SYN-ACK → ACK)\n4. TLS Handshake (Cipher negotiation & session key)\n5. HTTP Request (GET /path HTTP/2 with headers)\n6. Server Ingress (CDN Edge → L4 LB → L7 Gateway → Microservice)\n7. Browser Rendering (DOM + CSSOM = Render Tree → Layout → Paint)",
      tradeoffs: [
        "Cold Visit Latency (Dominated by round-trips: DNS + TCP + TLS handshakes before first byte arrives)",
        "Server Compute vs. Subresources (HTML transfer is fast; network waterfall of blocking CSS/JS subresources determines user perceived speed)"
      ],
      keyTakeaway: "Tell the story as: resolve → connect → secure → request → serve-from-nearest-cache → render. Every arrow is a cache and failure boundary."
    },
    {
      id: "2.9",
      tabTitle: "2.9 Browser Internals",
      title: "2.9 How Modern Browsers Work",
      section: "Part 2 · Networking & Protocols",
      whatItIs: "Modern browsers are multi-process operating systems featuring isolated renderer processes per site, GPU compositing, and a strict critical rendering path.",
      architecture: "CRITICAL RENDERING PATH:\nHTML → Tokenize → DOM Tree ┐\nCSS → CSSOM Tree ─────────┴─► Render Tree → Layout (Geometry) → Paint (Pixels) → Composite (GPU layers)\nSynchronous <script> blocks HTML parsing; CSS blocks rendering. Animating transform/opacity runs on GPU compositor thread without triggering layout.",
      tradeoffs: [
        "Process-per-site (Strict site isolation prevents Spectre cross-origin memory leaks, at the cost of duplicate RAM overhead) vs. Process-per-tab",
        "Layout vs. Paint vs. Composite (Layout recalculates geometry on main thread; GPU compositing assembles texture layers off-thread)"
      ],
      keyTakeaway: "A browser is a distributed system on one machine: isolated processes for security, a multi-stage pipeline for rendering."
    }
  ],

  6: [
    {
      id: "2.8",
      tabTitle: "2.8 L4 vs L7 LB",
      title: "2.8 Load Balancing: L4 vs. L7",
      section: "Part 2 · Networking & Protocols",
      whatItIs: "Traffic dispatch tier distributing client connections across backend server pools to prevent server saturation and guarantee high availability.",
      architecture: "LAYERED INGRESS TOPOLOGY:\nClients ──► DNS GeoRouting ──► Anycast IP ──► Layer 4 LB (NLB/IPVS, TCP/IP passthrough, stateless, millions QPS)\n                                                  │\n                                                  ▼\n                                              Layer 7 LB / Gateway (ALB/Envoy, TLS termination, path routing, rate limits)\n                                                  │\n                                      ┌───────────┴───────────┐\n                                      ▼                       ▼\n                                  Service A Pool          Service B Pool",
      tradeoffs: [
        "Layer 4 (Transport, high throughput, protocol-agnostic, no request inspection) vs. Layer 7 (Application, TLS offload, URL path routing, header cookies)",
        "Balancing Algorithms (Round robin vs. Least connections vs. Consistent hashing for cache affinity vs. Power of two choices)",
        "Sticky Sessions (Antipattern: breaks even load distribution and complicates rolling deploys; prefer stateless servers + Redis session store)"
      ],
      keyTakeaway: "L4 for speed and protocol-agnostic failover; L7 for routing requiring request inspection. Always use health check floors to prevent cascading failovers."
    },
    {
      id: "2.6",
      tabTitle: "2.6 API Styles",
      title: "2.6 API Styles: SOAP, REST, GraphQL, RPC",
      section: "Part 2 · Networking & Protocols",
      whatItIs: "The four primary API paradigms for contract standardization between client interfaces and distributed backend services.",
      architecture: "PARADIGM MATRIX:\n• REST: Resource-oriented, HTTP verbs (GET/POST/PUT/DELETE), status codes, universally understood, highly cacheable\n• GraphQL: Single POST endpoint, client-specified query over typed schema, eliminates over/under-fetching, harder to cache\n• gRPC: Remote procedure calls, HTTP/2 binary Protobuf framing, code-generated client stubs, high-throughput internal microservices\n• SOAP: XML envelopes, WSDL strict contracts, WS-Security, legacy enterprise banking integrations",
      tradeoffs: [
        "Public APIs (REST for caching and consumer simplicity) vs. Internal Microservices (gRPC for compact binary serialization and low CPU)",
        "BFF Pattern (Backend-for-Frontend with GraphQL aggregating multiple microservice calls for mobile apps with constrained bandwidth)"
      ],
      keyTakeaway: "Choose API style by consumer and coupling: REST for public cacheable endpoints, gRPC for fast internal communication, GraphQL for heterogeneous UI clients."
    },
    {
      id: "11.2",
      tabTitle: "11.2 API Gateways",
      title: "11.2 API Gateways, Reverse Proxies and Service Discovery",
      section: "Part 11 · Networking",
      whatItIs: "The front door of a service-oriented architecture, applying authentication, rate limiting, and request transformation before dispatching to dynamically discovered instances.",
      architecture: "CONCERN SEPARATION:\n• Reverse Proxy: Front for backends (TLS termination, compression, HTTP caching)\n• Load Balancer: Distributes connections across instances by health\n• API Gateway: Understands your API (authN validation, per-tenant quotas, canary routing, request aggregation)\n• Service Discovery: Client-side (queries Eureka registry) vs. Server-side (AWS ALB / Kubernetes DNS)",
      tradeoffs: [
        "Authentication at Gateway vs. Authorization in Service (Validate token once at edge; enforce resource permissions inside service)",
        "Gateway Anti-patterns (Never put business logic in the gateway; avoid creating a monolithic shared deploy queue)"
      ],
      keyTakeaway: "The gateway answers: 'Who are you and may you make this call at this rate?' The service answers: 'May you do this to THIS object?'"
    }
  ],

  7: [
    {
      id: "rev-1",
      tabTitle: "Drills & Recall",
      title: "Revision Day 1 · Estimation, Protocols & Ingress",
      section: "Week 1 Review & Active Recall",
      whatItIs: "Consolidation and active recall drills on Week 1 fundamentals: back-of-the-envelope calculations, network protocol layers, and ingress topologies.",
      architecture: "WEEK 1 RAPID AUDIT:\n✓ 7-Step Interview skeleton timing\n✓ Latency hierarchy: RAM (100ns) vs SSD (100µs) vs WAN (150ms)\n✓ TCP slow start and Bandwidth-Delay Product math\n✓ HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC HOL blocking\n✓ DNS resolution layers and record types (A, CNAME, NS)\n✓ L4 vs L7 load balancer layered architecture",
      tradeoffs: [
        "Whiteboard Drill: Sizing bandwidth and memory for a 10M DAU service in under 3 minutes",
        "Architecture Drill: Tracing a packet through DNS Anycast, L4 NLB, L7 Envoy, and reverse proxy"
      ],
      keyTakeaway: "Never enter a design loop without pinning down scale numbers. 5 lines of estimation justify every architectural box you draw."
    },
    {
      id: "rev-1-checklist",
      tabTitle: "Week 1 Checklist",
      title: "Week 1 Core Mastery Checklist",
      section: "Week 1 Review & Active Recall",
      whatItIs: "Self-assessment checklist to verify senior-level fluency on Week 1 systems concepts.",
      architecture: "CHECKLIST OF CORE CONCEPTS:\n[ ] Can you derive QPS and storage requirements on a whiteboard without hesitation?\n[ ] Can you explain why HTTP/2 single connection causes transport HOL on mobile networks?\n[ ] Can you contrast Type-1 hypervisors with Linux cgroups and namespaces?\n[ ] Can you articulate why L4 load balancing is required in front of L7 Envoy gateways?\n[ ] Can you write the Little's Law formula ($L = \\lambda \\times W$) and explain queue collapse?",
      tradeoffs: [
        "Textbook reciting vs. Senior intuition (Always link concepts to operational failure modes)",
        "Speed vs. Clarity (State assumptions explicitly before calculating numbers)"
      ],
      keyTakeaway: "Active recall beats passive reading. If you cannot explain a concept in 60 seconds without notes, revisit the section."
    }
  ]
};

console.log("Topics base defined. Writing out file generation script...");
