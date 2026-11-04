/**
 * URL Shortener (Bitly) High-Level Architecture (HLD) Data Specification
 * Pure architecture data model separated from presentation.
 * Supports:
 * - Architecture topology (nodes, tiers, links)
 * - Request flows (Creation, Redirect, Async Analytics)
 * - Detailed component specifications (Responsibilities, APIs, Storage, Trade-offs, Failure modes)
 * - System-level architectural trade-offs
 */

export const URL_SHORTENER_HLD_DATA = {
  lessonId: 'url-shortener',
  title: 'URL Shortener (Bitly) High-Level Architecture',
  systemName: 'Bitly-Scale Distributed URL Shortener',
  scaleMetrics: {
    monthlyCreates: '100 Million URLs/mo',
    avgWriteRps: '~39 creates/sec',
    peakWriteRps: '~390 creates/sec (10x burst)',
    monthlyRedirects: '10 Billion redirects/mo (100:1 read-to-write)',
    avgReadRps: '~3,858 requests/sec',
    peakReadRps: '~38,580 requests/sec',
    targetRedirectLatency: '< 10 ms (P99)',
    storagePerYear: '~600 GB / year metadata'
  },

  // Architectural Tiers for grouping
  tiers: [
    { id: 'client-tier', name: 'Client Tier', color: 'slate' },
    { id: 'ingress-tier', name: 'Edge & Ingress Tier', color: 'indigo' },
    { id: 'compute-tier', name: 'Stateless Application Tier', color: 'blue' },
    { id: 'storage-tier', name: 'Hot Cache & Storage Tier', color: 'emerald' },
    { id: 'analytics-tier', name: 'Asynchronous Analytics Pipeline', color: 'amber' }
  ],

  // Interactive Nodes on the SVG Canvas
  nodes: [
    {
      id: 'client',
      label: 'Clients & Browsers',
      sublabel: 'Web • Mobile • REST API',
      tier: 'client-tier',
      tierLabel: 'Clients',
      category: 'Client Tier',
      icon: 'devices',
      x: 40,
      y: 220,
      width: 150,
      height: 90,
      badge: 'Clients',
      color: 'slate'
    },
    {
      id: 'dns-lb',
      label: 'DNS & Global LB',
      sublabel: 'Anycast DNS • L4/L7 LB',
      tier: 'ingress-tier',
      tierLabel: 'Ingress',
      category: 'Edge & Ingress',
      icon: 'hub',
      x: 230,
      y: 220,
      width: 155,
      height: 90,
      badge: 'Edge Ingress',
      color: 'indigo'
    },
    {
      id: 'api-gateway',
      label: 'Edge API Gateway',
      sublabel: 'Rate Limiter • SSL • Auth',
      tier: 'ingress-tier',
      tierLabel: 'Security & Route',
      category: 'Edge & Ingress',
      icon: 'shield',
      x: 420,
      y: 220,
      width: 160,
      height: 90,
      badge: 'API Gateway',
      color: 'indigo'
    },
    {
      id: 'creation-svc',
      label: 'URL Creation Service',
      sublabel: 'Validation • Base62 • Write',
      tier: 'compute-tier',
      tierLabel: 'Write Path',
      category: 'Stateless Compute',
      icon: 'add_link',
      x: 630,
      y: 110,
      width: 175,
      height: 95,
      badge: 'Write Path (Stateless)',
      color: 'blue'
    },
    {
      id: 'id-generator',
      label: 'Unique ID Generator',
      sublabel: 'Snowflake / Range Server',
      tier: 'compute-tier',
      tierLabel: 'ID Co-pilot',
      category: 'Stateless Compute',
      icon: 'pin',
      x: 855,
      y: 110,
      width: 170,
      height: 95,
      badge: 'Snowflake / Range',
      color: 'cyan'
    },
    {
      id: 'redirect-svc',
      label: 'Redirect Service',
      sublabel: 'Sub-10ms • HTTP 302',
      tier: 'compute-tier',
      tierLabel: 'Read Path',
      category: 'Stateless Compute',
      icon: 'shortcut',
      x: 630,
      y: 330,
      width: 175,
      height: 95,
      badge: 'Read Path (Hot)',
      color: 'emerald'
    },
    {
      id: 'redis-cache',
      label: 'Redis Cache Cluster',
      sublabel: 'LRU Eviction • < 5ms P99',
      tier: 'storage-tier',
      tierLabel: 'Hot Cache',
      category: 'Storage & Caching',
      icon: 'memory',
      x: 855,
      y: 280,
      width: 170,
      height: 95,
      badge: 'In-Memory (80/20)',
      color: 'rose'
    },
    {
      id: 'url-db',
      label: 'URL Mapping Database',
      sublabel: 'PostgreSQL / NoSQL KV',
      tier: 'storage-tier',
      tierLabel: 'Durable Store',
      category: 'Storage & Caching',
      icon: 'database',
      x: 855,
      y: 430,
      width: 170,
      height: 95,
      badge: 'Durable ACID Store',
      color: 'emerald'
    },
    {
      id: 'message-queue',
      label: 'Kafka Click Queue',
      sublabel: 'Partitioned Topic Buffer',
      tier: 'analytics-tier',
      tierLabel: 'Async Bus',
      category: 'Messaging',
      icon: 'move_down',
      x: 420,
      y: 490,
      width: 165,
      height: 90,
      badge: 'Async Event Stream',
      color: 'amber'
    },
    {
      id: 'analytics-worker',
      label: 'Analytics Workers',
      sublabel: 'Batch Aggregator • Geo-IP',
      tier: 'analytics-tier',
      tierLabel: 'Stream Worker',
      category: 'Analytics Compute',
      icon: 'insights',
      x: 630,
      y: 490,
      width: 175,
      height: 90,
      badge: 'Stream Consumer',
      color: 'amber'
    },
    {
      id: 'analytics-db',
      label: 'Analytics OLAP DB',
      sublabel: 'ClickHouse / Timescale',
      tier: 'analytics-tier',
      tierLabel: 'OLAP Store',
      category: 'Analytics Storage',
      icon: 'analytics',
      x: 855,
      y: 560,
      width: 170,
      height: 90,
      badge: 'Columnar Store',
      color: 'violet'
    }
  ],

  // Connections / Directed links between nodes
  links: [
    {
      id: 'link-client-lb',
      from: 'client',
      to: 'dns-lb',
      label: 'HTTPS Requests',
      type: 'bidirectional',
      flows: ['create', 'redirect'],
      path: 'M 190 265 L 230 265'
    },
    {
      id: 'link-lb-gw',
      from: 'dns-lb',
      to: 'api-gateway',
      label: 'Internal Routing',
      type: 'forward',
      flows: ['create', 'redirect'],
      path: 'M 385 265 L 420 265'
    },
    {
      id: 'link-gw-create',
      from: 'api-gateway',
      to: 'creation-svc',
      label: 'POST /urls (Write)',
      type: 'forward',
      flows: ['create'],
      path: 'M 580 235 C 595 235, 605 160, 630 160'
    },
    {
      id: 'link-gw-redirect',
      from: 'api-gateway',
      to: 'redirect-svc',
      label: 'GET /{code} (Read)',
      type: 'forward',
      flows: ['redirect'],
      path: 'M 580 285 C 595 285, 605 375, 630 375'
    },
    {
      id: 'link-create-idgen',
      from: 'creation-svc',
      to: 'id-generator',
      label: 'Fetch Unique ID',
      type: 'bidirectional',
      flows: ['create'],
      path: 'M 805 155 L 855 155'
    },
    {
      id: 'link-create-db',
      from: 'creation-svc',
      to: 'url-db',
      label: 'Durable Insert',
      type: 'forward',
      flows: ['create'],
      path: 'M 720 205 C 720 380, 810 450, 855 460'
    },
    {
      id: 'link-create-cache',
      from: 'creation-svc',
      to: 'redis-cache',
      label: 'Warm Cache (Optional)',
      type: 'forward',
      flows: ['create'],
      path: 'M 805 175 C 825 195, 835 290, 855 310'
    },
    {
      id: 'link-redirect-cache',
      from: 'redirect-svc',
      to: 'redis-cache',
      label: '1. Fast Cache Query',
      type: 'bidirectional',
      flows: ['redirect'],
      path: 'M 805 350 C 825 350, 835 330, 855 330'
    },
    {
      id: 'link-redirect-db',
      from: 'redirect-svc',
      to: 'url-db',
      label: '2. Fallback on Cache Miss',
      type: 'bidirectional',
      flows: ['redirect'],
      path: 'M 805 395 C 825 410, 835 450, 855 470'
    },
    {
      id: 'link-redirect-queue',
      from: 'redirect-svc',
      to: 'message-queue',
      label: 'Async ClickEvent',
      type: 'forward',
      flows: ['analytics', 'redirect'],
      path: 'M 630 405 C 540 430, 510 460, 510 490'
    },
    {
      id: 'link-queue-worker',
      from: 'message-queue',
      to: 'analytics-worker',
      label: 'Pull Event Batches',
      type: 'forward',
      flows: ['analytics'],
      path: 'M 585 535 L 630 535'
    },
    {
      id: 'link-worker-analyticsdb',
      from: 'analytics-worker',
      to: 'analytics-db',
      label: 'Batch Aggregates',
      type: 'forward',
      flows: ['analytics'],
      path: 'M 805 540 C 820 540, 835 580, 855 590'
    }
  ],

  // Step-by-Step Request Flows
  flows: [
    {
      id: 'create',
      name: '1. URL Creation Flow (Write Path)',
      shortDesc: 'Generates collision-free Base62 short links, writes durably to DB, and primes cache.',
      color: 'blue',
      steps: [
        {
          step: 1,
          title: 'Client Submits Long URL',
          source: 'client',
          target: 'api-gateway',
          desc: 'Client sends <code>POST /api/v1/urls</code> with <code>longUrl</code>, optional custom alias, and optional expiration date.',
          badge: 'HTTP POST',
          highlightNodes: ['client', 'dns-lb', 'api-gateway'],
          highlightLinks: ['link-client-lb', 'link-lb-gw']
        },
        {
          step: 2,
          title: 'Gateway Sanitization & Rate Limiting',
          source: 'api-gateway',
          target: 'creation-svc',
          desc: 'API Gateway authenticates request, checks Token Bucket rate limits (e.g. 50 creates/min/user), sanitizes URL, and routes to URL Creation Service.',
          badge: 'Rate Limit & Route',
          highlightNodes: ['api-gateway', 'creation-svc'],
          highlightLinks: ['link-gw-create']
        },
        {
          step: 3,
          title: 'Unique 64-bit ID Generation',
          source: 'creation-svc',
          target: 'id-generator',
          desc: 'Creation Service requests a globally unique 64-bit ID from Snowflake / Range generator. ID is encoded using Base62 (e.g., ID <code>10,234,567</code> becomes <code>aZ81kQ</code>).',
          badge: 'Snowflake / Base62',
          highlightNodes: ['creation-svc', 'id-generator'],
          highlightLinks: ['link-create-idgen']
        },
        {
          step: 4,
          title: 'Durable Database Write',
          source: 'creation-svc',
          target: 'url-db',
          desc: 'Writes the mapping row into PostgreSQL / DynamoDB with a strict uniqueness constraint on <code>code</code>. If custom alias clashes, returns HTTP 409 Conflict.',
          badge: 'ACID Persist',
          highlightNodes: ['creation-svc', 'url-db'],
          highlightLinks: ['link-create-db']
        },
        {
          step: 5,
          title: 'Cache Warm & Success Response',
          source: 'creation-svc',
          target: 'client',
          desc: 'Optionally writes key to Redis cache (Write-Through/Write-Around) and returns <code>{ "code": "aZ81kQ", "shortUrl": "https://sho.rt/aZ81kQ" }</code> with HTTP 201 Created.',
          badge: 'HTTP 201 Created',
          highlightNodes: ['creation-svc', 'redis-cache', 'client'],
          highlightLinks: ['link-create-cache', 'link-gw-create', 'link-lb-gw', 'link-client-lb']
        }
      ]
    },
    {
      id: 'redirect',
      name: '2. URL Redirection Flow (Read / Hot Path)',
      shortDesc: 'Resolves short codes in < 10ms via Redis with graceful fallback to DB and non-blocking telemetry.',
      color: 'emerald',
      steps: [
        {
          step: 1,
          title: 'Browser Requests Short Code',
          source: 'client',
          target: 'api-gateway',
          desc: 'Browser navigates to <code>https://sho.rt/aZ81kQ</code>. DNS resolves via Anycast, and the load balancer dispatches the connection to the Edge Gateway.',
          badge: 'GET /{code}',
          highlightNodes: ['client', 'dns-lb', 'api-gateway'],
          highlightLinks: ['link-client-lb', 'link-lb-gw']
        },
        {
          step: 2,
          title: 'Gateway Routes to Redirect Service',
          source: 'api-gateway',
          target: 'redirect-svc',
          desc: 'Gateway routes request directly to the high-throughput stateless Redirect Service tier (horizontally autoscaled based on CPU/connections).',
          badge: 'Stateless Dispatch',
          highlightNodes: ['api-gateway', 'redirect-svc'],
          highlightLinks: ['link-gw-redirect']
        },
        {
          step: 3,
          title: 'Redis Cache Lookup (Fast Path)',
          source: 'redirect-svc',
          target: 'redis-cache',
          desc: 'Redirect Service checks Redis cache cluster for key <code>url:aZ81kQ</code>. In 90%+ cases, cache hit returns the original long URL in < 3ms.',
          badge: 'Redis Query (< 3ms)',
          highlightNodes: ['redirect-svc', 'redis-cache'],
          highlightLinks: ['link-redirect-cache']
        },
        {
          step: 4,
          title: 'Cache Miss Fallback & Prime',
          source: 'redirect-svc',
          target: 'url-db',
          desc: 'On cache miss, Redirect Service queries URL Mapping DB (indexed on <code>code</code>), populates Redis cache with TTL, and validates expiration/status.',
          badge: 'DB Miss Query',
          highlightNodes: ['redirect-svc', 'url-db', 'redis-cache'],
          highlightLinks: ['link-redirect-db', 'link-redirect-cache']
        },
        {
          step: 5,
          title: 'HTTP 302 Redirect & Async Event Emission',
          source: 'redirect-svc',
          target: 'client',
          desc: 'Returns <code>HTTP 302 Found</code> with <code>Location: https://example.com/item/123</code>. Asynchronously publishes a <code>ClickEvent</code> to Kafka without blocking redirect response.',
          badge: 'HTTP 302 Found',
          highlightNodes: ['redirect-svc', 'client', 'message-queue'],
          highlightLinks: ['link-gw-redirect', 'link-lb-gw', 'link-client-lb', 'link-redirect-queue']
        }
      ]
    },
    {
      id: 'analytics',
      name: '3. Asynchronous Analytics Pipeline',
      shortDesc: 'Decoupled, high-throughput click tracking with zero impact on user redirect latency.',
      color: 'amber',
      steps: [
        {
          step: 1,
          title: 'Non-blocking Click Event Published',
          source: 'redirect-svc',
          target: 'message-queue',
          desc: 'Redirect service emits <code>ClickEvent</code> payload containing <code>{ short_code, timestamp, ip, user_agent, referrer }</code> to Kafka topic <code>url-clicks</code>.',
          badge: 'Kafka Producer',
          highlightNodes: ['redirect-svc', 'message-queue'],
          highlightLinks: ['link-redirect-queue']
        },
        {
          step: 2,
          title: 'Kafka Topic Buffering',
          source: 'message-queue',
          target: 'message-queue',
          desc: 'Kafka partitions absorb traffic spikes up to 40,000+ events/sec, decoupling real-time user traffic from downstream analytical compute.',
          badge: 'Partition Buffer',
          highlightNodes: ['message-queue'],
          highlightLinks: []
        },
        {
          step: 3,
          title: 'Worker Ingestion & Enrichment',
          source: 'message-queue',
          target: 'analytics-worker',
          desc: 'Stream consumer workers pull batches of 500-1000 events, enrich with MaxMind GeoIP (country/city), parse User-Agent (browser/OS), and deduplicate bot scrapers.',
          badge: 'Stream Consumer',
          highlightNodes: ['message-queue', 'analytics-worker'],
          highlightLinks: ['link-queue-worker']
        },
        {
          step: 4,
          title: 'Batch Writes to Columnar OLAP DB',
          source: 'analytics-worker',
          target: 'analytics-db',
          desc: 'Workers flush aggregated counts into ClickHouse / TimescaleDB every 5 seconds. Powers customer analytics dashboards with instant sub-second queries.',
          badge: 'OLAP Batch Write',
          highlightNodes: ['analytics-worker', 'analytics-db'],
          highlightLinks: ['link-worker-analyticsdb']
        }
      ]
    }
  ],

  // Detailed Component Specifications (Shown in right-hand inspector)
  components: {
    'client': {
      id: 'client',
      name: 'Clients & Browsers',
      tier: 'Client Tier',
      tierBadge: 'Ingress Point',
      status: 'External Systems',
      role: 'End-user web browsers, mobile apps, and third-party API clients interacting with the service.',
      responsibilities: [
        'Send URL creation requests (POST) with long URLs and custom metadata.',
        'Follow HTTP 302 Found redirects when navigating to shortened short links.',
        'Manage owned URLs and view real-time click analytics via management dashboard.',
        'Handle HTTP 429 Too Many Requests with exponential backoff on rate limits.'
      ],
      apis: [
        {
          method: 'POST',
          endpoint: '/api/v1/urls',
          description: 'Request creation of a new short URL link',
          sample: '{\n  "longUrl": "https://company.org/page/123",\n  "customAlias": "summer-sale",\n  "expiresAt": "2026-12-31T23:59:59Z"\n}'
        },
        {
          method: 'GET',
          endpoint: '/{shortCode}',
          description: 'Browser navigates to short link to trigger HTTP redirect',
          sample: 'GET /aZ81kQ HTTP/1.1\nHost: sho.rt'
        }
      ],
      storageDecisions: [
        {
          type: 'Client Cache',
          decision: 'Honor HTTP 302 vs 301 headers',
          rationale: 'With 302 Found, browsers re-query on every click, allowing fresh analytics. With 301, browsers cache locally, starving server metrics.'
        }
      ],
      tradeoffs: [
        {
          question: 'Browser Caching (301 vs 302)',
          choice: 'HTTP 302 Found',
          upside: 'Full click telemetry and immediate ability to revoke/edit malicious destination URLs.',
          downside: 'Slightly higher server request volume on repeat visits.'
        }
      ],
      failureModes: 'Network partition or client timeout. Client retry loop should employ jittered exponential backoff.',
      scalingStrategy: 'N/A (External entity). CDN edge endpoints absorb regional connectivity overhead.'
    },

    'dns-lb': {
      id: 'dns-lb',
      name: 'DNS & Global Load Balancer',
      tier: 'Edge & Ingress Tier',
      tierBadge: 'Layer 4 / Layer 7',
      status: 'Managed Infrastructure',
      role: 'Routes global Internet traffic to the nearest Point of Presence (PoP) with minimal latency.',
      responsibilities: [
        'Anycast BGP routing to direct client DNS queries to geographically closest data center.',
        'TLS/SSL termination at the network edge to eliminate TLS handshake latency on internal hops.',
        'Layer 4 (TCP/UDP) & Layer 7 (HTTP/HTTPS) health checking to steer around dead nodes.',
        'DDoS mitigation and basic SYN flood / volumetric attack shielding (e.g. AWS CloudFront / Cloudflare).'
      ],
      apis: [
        {
          method: 'PROTOCOL',
          endpoint: 'TCP Port 443 (HTTPS)',
          description: 'TLS 1.3 termination with session resumption ticket cache',
          sample: 'TLS Handshake latency: ~15ms (warm 0-RTT)'
        }
      ],
      storageDecisions: [
        {
          type: 'TLS Session Cache',
          decision: 'In-memory distributed TLS session tickets',
          rationale: 'Avoids repeated cryptographic roundtrips during short-lived connection spikes.'
        }
      ],
      tradeoffs: [
        {
          question: 'Edge TLS Termination vs End-to-End Encryption',
          choice: 'Edge Termination with mTLS backplane',
          upside: 'Significantly accelerates client handshake speeds while keeping private cloud traffic encrypted.',
          downside: 'Requires internal certificate management.'
        }
      ],
      failureModes: 'Datacenter fiber cut. Handled via automated DNS health-check failover to secondary region.',
      scalingStrategy: 'Horizontally scaled by cloud provider Anycast edge nodes across 200+ global PoPs.'
    },

    'api-gateway': {
      id: 'api-gateway',
      name: 'Edge API Gateway & Rate Limiter',
      tier: 'Edge & Ingress Tier',
      tierBadge: 'Ingress Security',
      status: 'Stateless Gateway Tier (Kong / Envoy)',
      role: 'Single entry point for client requests, enforcing authentication, rate limits, and path routing.',
      responsibilities: [
        'Enforce Token Bucket or Sliding Window rate limits per API key and client IP.',
        'Authenticate user tokens (JWT verification) for link management and creation endpoints.',
        'Validate incoming payload schemas (URL validity, length limit <= 2048 chars).',
        'Route write requests (`/api/v1/urls`) to URL Creation Service and read requests (`/{code}`) to Redirect Service.'
      ],
      apis: [
        {
          method: 'POST / GET',
          endpoint: 'Path-based routing',
          description: 'Dispatches traffic based on URI prefix',
          sample: '/api/v1/* -> URL Creation Svc\n/*        -> Redirect Svc'
        }
      ],
      storageDecisions: [
        {
          type: 'Rate Limit Storage',
          decision: 'Shared Redis cluster using atomic Lua scripts',
          rationale: 'Coordinates global sliding window rate limits across all gateway instances in < 1ms.'
        }
      ],
      tradeoffs: [
        {
          question: 'Combined Gateway vs Separate Endpoints',
          choice: 'Edge Gateway with path routing',
          upside: 'Single domain (sho.rt) for both vanity redirects and REST API; unified security enforcement.',
          downside: 'Gateway becomes a single critical point of failure if misconfigured.'
        }
      ],
      failureModes: 'Rate limit Redis cluster offline. Fails open for trusted read redirects; fails closed for write creation.',
      scalingStrategy: 'Horizontally autoscaled based on CPU utilization and active TCP connection count.'
    },

    'creation-svc': {
      id: 'creation-svc',
      name: 'URL Creation Service',
      tier: 'Stateless Application Tier',
      tierBadge: 'Write Compute Tier',
      status: 'Stateless Microservice (Go / Rust / Node)',
      role: 'Handles URL shortening lifecycle, coordinates ID generation, sanitizes destinations, and persists mappings.',
      responsibilities: [
        'Validate syntax and reachability of target URL (prevent loopbacks, localhost, malicious domains).',
        'Check custom alias availability against database unique constraint.',
        'Obtain unique 64-bit ID from ID Generator and encode into Base62 alphanumeric string.',
        'Persist record into URL Mapping DB with creation timestamp and expiry date.',
        'Optionally prime Redis cache (Write-Through) to prepare for immediate traffic spikes.'
      ],
      apis: [
        {
          method: 'POST',
          endpoint: '/api/v1/urls',
          description: 'Generate short code mapping',
          sample: 'Request:\n{\n  "longUrl": "https://example.com/long/path",\n  "customAlias": null\n}\n\nResponse (201 Created):\n{\n  "code": "aZ81kQ",\n  "shortUrl": "https://sho.rt/aZ81kQ",\n  "createdAt": 1728732000\n}'
        }
      ],
      storageDecisions: [
        {
          type: 'Cache Strategy',
          decision: 'Write-Around vs Write-Through',
          rationale: 'Write-Through warms cache immediately; beneficial when users share newly created links instantly.'
        }
      ],
      tradeoffs: [
        {
          question: 'MD5/SHA256 Hash vs ID-Based Base62',
          choice: 'ID-Based Base62 Encoding',
          upside: 'Guaranteed uniqueness with 0 hash collision retries. Clean, deterministic 7-character string.',
          downside: 'Requires a highly available unique ID generation service.'
        }
      ],
      failureModes: 'Primary DB write timeout. Service throws 503 Service Unavailable, triggering client retry with idempotency key.',
      scalingStrategy: 'Stateless pods managed via Kubernetes HPA. 39 creates/sec requires only 4-6 replicas with generous headroom.'
    },

    'id-generator': {
      id: 'id-generator',
      name: 'Distributed Unique ID Generator',
      tier: 'Stateless Application Tier',
      tierBadge: 'Snowflake / Range Server',
      status: 'High-Throughput Coordination Tier',
      role: 'Produces collision-free 64-bit integer IDs at extreme throughput without cross-node locking.',
      responsibilities: [
        'Generate sequential or semi-sequential 64-bit integers with 0 coordination bottleneck.',
        'Option A (Snowflake): 41 bits timestamp, 10 bits machine ID, 12 bits sequence number (4,096 IDs/ms/node).',
        'Option B (Range Allocation): Central DB allocates ID ranges (e.g., node 1 takes [1 to 1,000,000]) into memory.',
        'Guarantee no duplicate ID is ever produced even across node crashes.'
      ],
      apis: [
        {
          method: 'gRPC / In-Process',
          endpoint: 'GetNextId() -> int64',
          description: 'High-speed binary RPC returning 64-bit integer ID',
          sample: 'uint64: 10234567 -> Base62: "aZ81kQ"'
        }
      ],
      storageDecisions: [
        {
          type: 'Range State',
          decision: 'Range leasing via ZooKeeper or SQL sequence ticket',
          rationale: 'Nodes query central coordinator only once every 1 million IDs, reducing central DB load to near zero.'
        }
      ],
      tradeoffs: [
        {
          question: 'Snowflake vs Range Allocation',
          choice: 'Twitter Snowflake or Range Server',
          upside: 'Sub-millisecond ID generation completely in memory without distributed locks.',
          downside: 'Clock drift must be monitored with NTP; sequential IDs can be reverse-engineered unless obfuscated.'
        }
      ],
      failureModes: 'Clock rollback. Snowflake pauses generation until wall clock catches up, or falls back to backup range generator.',
      scalingStrategy: '10 machine nodes can produce 40 million IDs per second—vastly exceeding the 39 creates/sec requirement.'
    },

    'redirect-svc': {
      id: 'redirect-svc',
      name: 'Redirect Service (Hot Path)',
      tier: 'Stateless Application Tier',
      tierBadge: 'Ultra-Low Latency',
      status: 'Stateless Read-Heavy Tier',
      role: 'Resolves incoming short codes to long URLs in single-digit milliseconds and triggers asynchronous analytics.',
      responsibilities: [
        'Parse short code from request path (e.g., `aZ81kQ`).',
        'Execute sub-3ms lookup against local or distributed Redis cache.',
        'On cache miss, query URL Mapping DB, populate Redis with TTL, and check expiration.',
        'Return HTTP 302 Found redirect with `Location` header.',
        'Publish non-blocking `ClickEvent` into Kafka stream for downstream analytics.'
      ],
      apis: [
        {
          method: 'GET',
          endpoint: '/{code}',
          description: 'Lookup mapping and redirect caller',
          sample: 'HTTP/1.1 302 Found\nLocation: https://example.com/products/123\nCache-Control: private, max-age=90\nX-Redirect-Latency: 4.2ms'
        }
      ],
      storageDecisions: [
        {
          type: 'Cache-Aside Query',
          decision: 'Redis GET url:{code} with 1-day TTL',
          rationale: '80% of redirects target top 20% viral links. Redis absorbs 95%+ of traffic, shielding the database.'
        }
      ],
      tradeoffs: [
        {
          question: 'HTTP 301 vs HTTP 302 Status Code',
          choice: 'HTTP 302 Found',
          upside: 'Enables real-time click tracking on every visit; allows editing destination or revoking scam links.',
          downside: 'Does not benefit from browser permanent caching.'
        }
      ],
      failureModes: 'Redis cluster cache miss storm. Addressed using single-flight request coalescing to DB.',
      scalingStrategy: 'Horizontally scaled to 25-50 pods across multi-AZ deployment to handle 39,000 peak RPS effortlessly.'
    },

    'redis-cache': {
      id: 'redis-cache',
      name: 'Redis Cache Cluster',
      tier: 'Hot Cache & Storage Tier',
      tierBadge: 'In-Memory Store',
      status: 'Managed Redis Cluster (Primary + Read Replicas)',
      role: 'In-memory key-value store holding the hottest 20% of URL mappings to deliver sub-5ms P99 redirect latency.',
      responsibilities: [
        'Store key-value pairs: `url:{shortCode} -> {longUrl, status, expiresAt}`.',
        'Evict old links using Volatile-LRU (Least Recently Used) policy when RAM threshold is hit.',
        'Support cluster sharding via consistent hashing over 16,384 hash slots.',
        'Read replicas per primary shard to absorb read throughput bursts.'
      ],
      apis: [
        {
          method: 'REDIS PROTOCOL',
          endpoint: 'GET url:{code} / SETEX url:{code} 86400',
          description: 'Fast binary in-memory key lookup',
          sample: 'GET url:aZ81kQ -> "https://example.com/page"'
        }
      ],
      storageDecisions: [
        {
          type: 'Memory Estimation',
          decision: '100M URLs * 500 bytes = 50 GB. 20% hot links = ~10 GB RAM.',
          rationale: 'Easily hosted on a 3-shard Redis cluster with 32 GB RAM per node, providing massive headroom.'
        }
      ],
      tradeoffs: [
        {
          question: 'Redis vs Memcached',
          choice: 'Redis Cluster',
          upside: 'Native persistence options (RDB/AOF), built-in cluster failover, read replicas, and richer data types.',
          downside: 'Slightly higher memory overhead per key compared to raw slab-allocated Memcached.'
        }
      ],
      failureModes: 'Shard failure. Automated Sentinel/Cluster failover promotes replica to primary in under 3 seconds.',
      scalingStrategy: 'Cluster partitioned into 6 shards with 2 read replicas each, easily serving 100,000+ QPS.'
    },

    'url-db': {
      id: 'url-db',
      name: 'URL Mapping Database',
      tier: 'Hot Cache & Storage Tier',
      tierBadge: 'Durable System of Record',
      status: 'Relational PostgreSQL / Partitioned NoSQL',
      role: 'Durable source of truth storing short-code to long-URL mappings, user ownership, and link metadata.',
      responsibilities: [
        'Provide strong persistence and ACID durability for newly created URL mappings.',
        'Enforce UNIQUE B-Tree index on `short_code` column to prevent duplicate assignments.',
        'Store lifecycle attributes: `created_at`, `expires_at`, `user_id`, `status` (active/disabled).',
        'Support range queries for user dashboards (`SELECT * FROM urls WHERE user_id = ?`).'
      ],
      apis: [
        {
          method: 'SQL QUERY',
          endpoint: 'SELECT / INSERT',
          description: 'Indexed point queries on primary key `code`',
          sample: 'SELECT long_url, status, expires_at \nFROM url_mappings \nWHERE code = \'aZ81kQ\';'
        }
      ],
      storageDecisions: [
        {
          type: 'Storage Engine Selection',
          decision: 'PostgreSQL with Hash Sharding or DynamoDB',
          rationale: 'Relational DB fits early scale (100M rows = 50GB). Beyond 1B rows, shard by hash(code) across 16 DB instances.'
        }
      ],
      tradeoffs: [
        {
          question: 'Relational SQL vs NoSQL Key-Value',
          choice: 'SQL (Postgres) or Distributed KV (DynamoDB)',
          upside: 'SQL provides strict uniqueness, secondary indices for user queries, and clear schema migrations.',
          downside: 'Horizontal write scaling requires manual sharding, whereas NoSQL scales automatically.'
        }
      ],
      failureModes: 'Disk corruption or primary failover. Managed cloud Multi-AZ sync standby automatically takes over.',
      scalingStrategy: 'Read replicas across Availability Zones. Primary handles 39 writes/sec; replicas handle cache-miss reads.'
    },

    'message-queue': {
      id: 'message-queue',
      name: 'Kafka Event Stream / Message Queue',
      tier: 'Asynchronous Analytics Pipeline',
      tierBadge: 'Event Streaming',
      status: 'Apache Kafka / AWS Kinesis',
      role: 'Decouples redirect request path from heavy analytical ingestion, buffering high-volume click telemetry.',
      responsibilities: [
        'Buffer up to 40,000+ click events/sec during viral redirect spikes without dropping packets.',
        'Partition events by `short_code` hash to guarantee ordered delivery per URL.',
        'Persist click log with 48-hour retention window for consumer replay and disaster recovery.',
        'Isolate analytical database write latency from client redirect latency.'
      ],
      apis: [
        {
          method: 'KAFKA PROTOCOL',
          endpoint: 'Topic: url-clicks',
          description: 'High-throughput binary publish stream',
          sample: 'Key: "aZ81kQ"\nValue: {\n  "code": "aZ81kQ",\n  "ts": 1728732001,\n  "ip": "203.0.113.19",\n  "ua": "Mozilla/5.0 ..."\n}'
        }
      ],
      storageDecisions: [
        {
          type: 'Retention Policy',
          decision: 'Compact & delete retention of 48 hours',
          rationale: 'Provides enough buffer for downstream worker maintenance or consumer restarts without losing events.'
        }
      ],
      tradeoffs: [
        {
          question: 'Kafka vs Direct DB Insert',
          choice: 'Kafka Message Queue',
          upside: 'Prevents analytical queries or DB locks from degrading redirect response times.',
          downside: 'Introduces eventual consistency (analytics metrics lag by a few seconds).'
        }
      ],
      failureModes: 'Broker partition leader rebalance. Managed via replicate factor 3 with ack=1 for speed.',
      scalingStrategy: '16 partitions per topic allows 16 parallel consumer worker threads to scale linearly.'
    },

    'analytics-worker': {
      id: 'analytics-worker',
      name: 'Analytics Stream Consumer Workers',
      tier: 'Asynchronous Analytics Pipeline',
      tierBadge: 'Batch Stream Compute',
      status: 'Stateless Consumer Cluster',
      role: 'Consumes raw click events in batches, enriches them with geolocation and user-agent data, and flushes to OLAP.',
      responsibilities: [
        'Poll Kafka consumer group for batches of 500-1,000 click events.',
        'Enrich IP addresses into Country, Region, and City using in-memory MaxMind GeoLite2 database.',
        'Filter out automated web scrapers and crawlers to report true human impressions.',
        'Flush micro-batched aggregate writes to ClickHouse OLAP store every 5 seconds.'
      ],
      apis: [
        {
          method: 'CONSUMER LOOP',
          endpoint: 'KafkaConsumer.poll(Duration.ofMillis(500))',
          description: 'Batch worker event processing loop',
          sample: 'Processed batch: 850 events in 18ms'
        }
      ],
      storageDecisions: [
        {
          type: 'Local GeoIP Cache',
          decision: 'In-memory MMDB memory-mapped file',
          rationale: 'Zero network calls during IP-to-Country translation (< 1 microsecond per lookup).'
        }
      ],
      tradeoffs: [
        {
          question: 'Per-event writes vs Micro-batching',
          choice: 'Micro-batching (5-second flushes)',
          upside: 'Reduces OLAP write load by 98% through columnar batch insertions.',
          downside: 'Metrics on dashboard display a 5-second propagation delay.'
        }
      ],
      failureModes: 'Worker crash. Consumer group offset management automatically assigns uncommitted partitions to healthy workers.',
      scalingStrategy: 'Autoscale worker count up to the number of Kafka topic partitions (e.g. 16 workers).'
    },

    'analytics-db': {
      id: 'analytics-db',
      name: 'Analytics OLAP Database',
      tier: 'Asynchronous Analytics Pipeline',
      tierBadge: 'Columnar Analytics Store',
      status: 'ClickHouse / TimescaleDB',
      role: 'Column-oriented analytical database designed for aggregation queries over billions of click records.',
      responsibilities: [
        'Store columnar time-series click telemetry with high data compression (10x ratio).',
        'Execute sub-second aggregations for customer charts: clicks by date, top referrers, top countries.',
        'Maintain pre-aggregated materialized views for total hourly and daily click counts.',
        'Support retention policies and partition dropping for data older than 2 years.'
      ],
      apis: [
        {
          method: 'SQL QUERY',
          endpoint: 'OLAP Aggregate Query',
          description: 'Instant aggregation over millions of rows',
          sample: 'SELECT toDate(ts), count(*)\nFROM url_clicks\nWHERE code = \'aZ81kQ\'\nGROUP BY 1 ORDER BY 1 DESC;'
        }
      ],
      storageDecisions: [
        {
          type: 'Columnar Table Engine',
          decision: 'ClickHouse MergeTree partitioned by toYYYYMM(ts)',
          rationale: 'Allows querying billions of rows in under 200ms while using 70% less disk space than row-based storage.'
        }
      ],
      tradeoffs: [
        {
          question: 'ClickHouse OLAP vs Transactional Postgres',
          choice: 'Dedicated OLAP ClickHouse',
          upside: 'Massive aggregations do not lock or slow down transaction tables; columnar scan is 100x faster.',
          downside: 'Requires maintaining a secondary database pipeline.'
        }
      ],
      failureModes: 'Disk volume full. Mitigated by automated time-based partitioning and cold storage offloading to S3.',
      scalingStrategy: 'Clustered with distributed table definitions and ZooKeeper-coordinated replicas.'
    }
  },

  // System-Level Architectural Trade-Offs Matrix
  tradeoffs: [
    {
      id: 'to-encoding',
      decision: 'Short Code Encoding Algorithm',
      optionA: {
        name: 'Base62 of Unique Numeric ID',
        pros: '100% collision-free, deterministic length, compact alphanumeric string (0-9, a-z, A-Z), easily supports 3.5T unique codes with 7 chars.',
        cons: 'Requires unique integer generator; sequential IDs are guessable unless obfuscated or randomized.'
      },
      optionB: {
        name: 'MD5 / SHA-256 Hash Truncation',
        pros: 'Stateless generation without a central ID server; deterministic for identical long URLs.',
        cons: 'Hash truncation inevitably causes collisions, requiring costly DB lookups and retry loops on insertion.'
      },
      verdict: 'Recommended: Base62 of Unique 64-bit ID. Zero collision handling guarantees stable write throughput.',
      relatedNodes: ['creation-svc', 'id-generator', 'url-db']
    },
    {
      id: 'to-redirect',
      decision: 'HTTP Status Code for Redirection',
      optionA: {
        name: 'HTTP 302 Found (Temporary Redirect)',
        pros: 'Every click hits the server, providing 100% accurate click analytics; allows instant link revocation or target URL modification.',
        cons: 'Higher redirect server traffic because browsers do not cache the destination permanently.'
      },
      optionB: {
        name: 'HTTP 301 Moved Permanently',
        pros: 'Browser caches mapping permanently, reducing server redirect load to 0 on subsequent visits.',
        cons: 'Severely distorts analytics (misses all repeat clicks); cannot revoke malicious or compromised links once cached in client browsers.'
      },
      verdict: 'Recommended: HTTP 302 Found. Analytics and link security far outweigh minor server bandwidth costs.',
      relatedNodes: ['client', 'redirect-svc']
    },
    {
      id: 'to-caching',
      decision: 'Caching Strategy for Redirection',
      optionA: {
        name: 'Cache-Aside with In-Memory Redis',
        pros: 'Only frequently queried links live in RAM (80/20 rule), keeping memory costs small; resilient if cache restarts.',
        cons: 'Cache miss incurs DB latency; potential cache stampede (thundering herd) on sudden viral spikes without single-flight protection.'
      },
      optionB: {
        name: 'Write-Through Cache',
        pros: 'Newly created URLs are immediately available in memory; zero miss latency on immediate sharing.',
        cons: 'Consumes cache memory for links that may never be visited again (wasted RAM footprint).'
      },
      verdict: 'Recommended: Cache-Aside with Write-Around/Write-Through on creation. High hit ratio (90%+) with 5ms P99 latency.',
      relatedNodes: ['redirect-svc', 'redis-cache', 'url-db']
    },
    {
      id: 'to-db',
      decision: 'URL Mapping Primary Database',
      optionA: {
        name: 'Relational Database (PostgreSQL / MySQL)',
        pros: 'Strict ACID transactions, built-in unique constraint on code, secondary indexes for user management, simple schema migrations.',
        cons: 'Requires manual sharding by hash(code) when scaling beyond hundreds of millions of records.'
      },
      optionB: {
        name: 'Distributed Key-Value Store (DynamoDB / Cassandra)',
        pros: 'Automatic horizontal partitioning, predictable single-digit millisecond key lookups at petabyte scale.',
        cons: 'More complex querying for user management; conditional writes needed for custom alias uniqueness.'
      },
      verdict: 'Recommended: PostgreSQL for initial 100M scale; migrate to DynamoDB or Hash-Sharded Postgres for billions of rows.',
      relatedNodes: ['creation-svc', 'url-db']
    },
    {
      id: 'to-analytics',
      decision: 'Click Analytics Pipeline Architecture',
      optionA: {
        name: 'Asynchronous Event Stream (Kafka + ClickHouse)',
        pros: 'Redirect latency is completely shielded from analytics compute; buffers traffic spikes; OLAP database provides 100x faster aggregations.',
        cons: 'Introduces architectural components (Kafka, workers, OLAP store) and eventual consistency delay (~5 seconds).'
      },
      optionB: {
        name: 'Synchronous DB Counter Update',
        pros: 'Simple initial design without extra message queues.',
        cons: 'Severely bottlenecks redirect throughput with row-level locks on mapping DB; risk of database collapse under viral traffic.',
        verdict: 'Recommended: Asynchronous Kafka pipeline. Essential for production scalability.'
      },
      verdict: 'Recommended: Asynchronous Event Stream. Decoupling ingestion from query execution is mandatory for high-scale designs.',
      relatedNodes: ['redirect-svc', 'message-queue', 'analytics-worker', 'analytics-db']
    }
  ]
};
