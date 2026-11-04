/**
 * Distributed Rate Limiter High-Level Architecture (HLD) Data Specification
 * Pure architecture data model separated from presentation.
 * Supports:
 * - Architecture topology (nodes, tiers, links)
 * - Request flows (Allowed Path, Throttled Path, Degraded Mode Fallback)
 * - Detailed component specifications (Responsibilities, APIs, Storage, Trade-offs, Failure modes)
 * - System-level architectural trade-offs
 */

export const RATE_LIMITER_HLD_DATA = {
  lessonId: 'rate-limiter',
  title: 'Distributed Rate Limiter High-Level Architecture',
  systemName: 'Multi-Tier Distributed Token Bucket & Sliding Window Limiter',
  scaleMetrics: {
    monthlyCreates: '10,000+ API Keys',
    avgWriteRps: '~25,000 req/sec',
    peakWriteRps: '~100,000 req/sec (Peak Traffic)',
    monthlyRedirects: '50 Billion checks/mo',
    avgReadRps: '~20,000 req/sec',
    peakReadRps: '~100,000 req/sec (P99 < 2ms)',
    targetRedirectLatency: '< 2 ms (P99)',
    storagePerYear: '~50 GB active counter RAM'
  },

  scaleMetricsList: [
    { label: 'Peak Capacity', value: '100,000 req/sec', color: 'blue' },
    { label: 'Evaluation SLA', value: '< 2 ms (P99)', color: 'cyan' },
    { label: 'Algorithm', value: 'Token Bucket (Lua)', color: 'indigo' },
    { label: 'Storage Engine', value: 'Redis Cluster (Multi-AZ)', color: 'emerald' },
    { label: 'Degraded Mode', value: 'Local In-Memory Fallback', color: 'rose' }
  ],

  // Tier boundaries for the SVG Canvas
  tierBoxes: [
    { x: 210, y: 30, w: 390, h: 390, textX: 225, textY: 55, title: 'EDGE & POLICY EVALUATION TIER', color: 'indigo' },
    { x: 615, y: 30, w: 430, h: 400, textX: 630, textY: 55, title: 'DISTRIBUTED COUNTER & DOWNSTREAM TIER', color: 'blue' },
    { x: 210, y: 440, w: 835, h: 225, textX: 225, textY: 465, title: 'TELEMETRY & REAL-TIME ABUSE MONITORING (KAFKA STREAM)', color: 'amber' }
  ],

  // Architectural Tiers for grouping
  tiers: [
    { id: 'client-tier', name: 'Client Tier', color: 'slate' },
    { id: 'ingress-tier', name: 'Edge & Ingress Tier', color: 'indigo' },
    { id: 'compute-tier', name: 'Rate Limiter & Policy Tier', color: 'blue' },
    { id: 'storage-tier', name: 'Counter & Storage Tier', color: 'emerald' },
    { id: 'analytics-tier', name: 'Telemetry & Abuse Monitoring', color: 'amber' }
  ],

  // Interactive Nodes on the SVG Canvas (viewBox 0 0 1100 680)
  nodes: [
    {
      id: 'client',
      label: 'Clients & Consumers',
      sublabel: 'Web • Mobile • API Keys',
      tier: 'client-tier',
      tierLabel: 'Clients',
      category: 'Client Tier',
      icon: 'devices',
      x: 40,
      y: 190,
      width: 150,
      height: 90,
      badge: 'Traffic Ingress',
      color: 'slate'
    },
    {
      id: 'api-gateway',
      label: 'Edge API Gateway',
      sublabel: 'Reverse Proxy • SSL • Auth',
      tier: 'ingress-tier',
      tierLabel: 'Edge Ingress',
      category: 'Edge & Ingress',
      icon: 'hub',
      x: 230,
      y: 190,
      width: 155,
      height: 90,
      badge: 'API Gateway',
      color: 'indigo'
    },
    {
      id: 'rl-middleware',
      label: 'Rate-Limit Middleware',
      sublabel: 'Key Extractor • Policy Evaluator',
      tier: 'compute-tier',
      tierLabel: 'Evaluation Engine',
      category: 'Stateless Compute',
      icon: 'shield',
      x: 420,
      y: 190,
      width: 165,
      height: 90,
      badge: 'Evaluation Engine',
      color: 'blue'
    },
    {
      id: 'policy-cache',
      label: 'Policy Cache (Local)',
      sublabel: 'In-Memory Static Rules & Quotas',
      tier: 'compute-tier',
      tierLabel: 'Local Memory',
      category: 'Stateless Compute',
      icon: 'rule',
      x: 420,
      y: 55,
      width: 165,
      height: 85,
      badge: 'Local RAM Cache',
      color: 'amber'
    },
    {
      id: 'rules-db',
      label: 'Rules Database',
      sublabel: 'PostgreSQL / DynamoDB Quotas',
      tier: 'storage-tier',
      tierLabel: 'Durable Rules',
      category: 'Storage & Caching',
      icon: 'database',
      x: 630,
      y: 55,
      width: 175,
      height: 85,
      badge: 'Durable Quota Store',
      color: 'emerald'
    },
    {
      id: 'redis-cluster',
      label: 'Redis Cluster (Counters)',
      sublabel: 'Atomic Lua • Token Bucket / Sl.Win',
      tier: 'storage-tier',
      tierLabel: 'Distributed State',
      category: 'Storage & Caching',
      icon: 'speed',
      x: 630,
      y: 180,
      width: 175,
      height: 95,
      badge: 'Atomic Lua (<2ms)',
      color: 'rose'
    },
    {
      id: 'local-limiter',
      label: 'Local Fallback Limiter',
      sublabel: 'In-Memory Bucket4j / Guava',
      tier: 'compute-tier',
      tierLabel: 'Degraded Mode',
      category: 'Stateless Compute',
      icon: 'health_and_safety',
      x: 630,
      y: 310,
      width: 175,
      height: 90,
      badge: 'Emergency Fallback',
      color: 'cyan'
    },
    {
      id: 'backend-svc',
      label: 'Backend Domain Service',
      sublabel: 'Orders • Payments • Search APIs',
      tier: 'storage-tier',
      tierLabel: 'Protected Services',
      category: 'Downstream Services',
      icon: 'dns',
      x: 855,
      y: 180,
      width: 170,
      height: 95,
      badge: 'Allowed (200 OK)',
      color: 'emerald'
    },
    {
      id: 'reject-429',
      label: 'HTTP 429 Responder',
      sublabel: 'Retry-After • Quota Headers',
      tier: 'ingress-tier',
      tierLabel: 'Rejection Gate',
      category: 'Edge & Ingress',
      icon: 'block',
      x: 855,
      y: 310,
      width: 170,
      height: 90,
      badge: 'Throttled (429)',
      color: 'rose'
    },
    {
      id: 'message-queue',
      label: 'Telemetry Stream (Kafka)',
      sublabel: 'Rate Limit Breach & Usage Bus',
      tier: 'analytics-tier',
      tierLabel: 'Async Stream',
      category: 'Messaging',
      icon: 'move_down',
      x: 420,
      y: 470,
      width: 165,
      height: 90,
      badge: 'Telemetry Bus',
      color: 'amber'
    },
    {
      id: 'analytics-worker',
      label: 'Abuse Detection Workers',
      sublabel: 'DDoS Detector • Anomaly Scorer',
      tier: 'analytics-tier',
      tierLabel: 'Abuse Analytics',
      category: 'Analytics Compute',
      icon: 'insights',
      x: 630,
      y: 470,
      width: 175,
      height: 90,
      badge: 'Security Analytics',
      color: 'amber'
    },
    {
      id: 'analytics-db',
      label: 'Metrics & Dashboards',
      sublabel: 'Prometheus • Grafana • Alerts',
      tier: 'analytics-tier',
      tierLabel: 'Monitoring Store',
      category: 'Analytics Storage',
      icon: 'analytics',
      x: 855,
      y: 470,
      width: 170,
      height: 90,
      badge: 'Observability',
      color: 'violet'
    }
  ],

  // Connections / Directed links between nodes
  links: [
    {
      id: 'link-client-gw',
      from: 'client',
      to: 'api-gateway',
      label: 'HTTPS Requests',
      type: 'forward',
      flows: ['allow', 'throttle', 'fallback'],
      path: 'M 190 235 L 230 235'
    },
    {
      id: 'link-gw-rl',
      from: 'api-gateway',
      to: 'rl-middleware',
      label: 'Pass Request to Interceptor',
      type: 'forward',
      flows: ['allow', 'throttle', 'fallback'],
      path: 'M 385 235 L 420 235'
    },
    {
      id: 'link-rl-cache',
      from: 'rl-middleware',
      to: 'policy-cache',
      label: '1. Fast Policy Lookup',
      type: 'bidirectional',
      flows: ['allow', 'throttle', 'fallback'],
      path: 'M 502 190 L 502 140'
    },
    {
      id: 'link-cache-db',
      from: 'policy-cache',
      to: 'rules-db',
      label: 'Sync Rules (Cache Miss)',
      type: 'bidirectional',
      flows: ['allow'],
      path: 'M 585 97 L 630 97'
    },
    {
      id: 'link-rl-redis',
      from: 'rl-middleware',
      to: 'redis-cluster',
      label: '2. Atomic Check & Increment',
      type: 'bidirectional',
      flows: ['allow', 'throttle'],
      path: 'M 585 220 L 630 220'
    },
    {
      id: 'link-rl-local',
      from: 'rl-middleware',
      to: 'local-limiter',
      label: 'Emergency Fallback on Redis Timeout',
      type: 'bidirectional',
      flows: ['fallback'],
      path: 'M 502 280 C 502 345, 560 355, 630 355'
    },
    {
      id: 'link-redis-backend',
      from: 'redis-cluster',
      to: 'backend-svc',
      label: 'Tokens Available &rarr; 200 Forward',
      type: 'forward',
      flows: ['allow'],
      path: 'M 805 227 L 855 227'
    },
    {
      id: 'link-redis-reject',
      from: 'redis-cluster',
      to: 'reject-429',
      label: 'Tokens Exhausted &rarr; 429 Drop',
      type: 'forward',
      flows: ['throttle'],
      path: 'M 805 240 C 825 250, 835 340, 855 350'
    },
    {
      id: 'link-local-backend',
      from: 'local-limiter',
      to: 'backend-svc',
      label: 'Local Quota Allowed',
      type: 'forward',
      flows: ['fallback'],
      path: 'M 805 330 C 825 310, 835 245, 855 235'
    },
    {
      id: 'link-rl-telemetry',
      from: 'rl-middleware',
      to: 'message-queue',
      label: 'Async Telemetry & Rate Exceeded Events',
      type: 'forward',
      flows: ['allow', 'throttle', 'fallback'],
      path: 'M 502 280 L 502 470'
    },
    {
      id: 'link-queue-worker',
      from: 'message-queue',
      to: 'analytics-worker',
      label: 'Batch Pull Events',
      type: 'forward',
      flows: ['throttle'],
      path: 'M 585 515 L 630 515'
    },
    {
      id: 'link-worker-db',
      from: 'analytics-worker',
      to: 'analytics-db',
      label: 'Aggregates & Breach Alarms',
      type: 'forward',
      flows: ['throttle'],
      path: 'M 805 515 L 855 515'
    }
  ],

  // Step-by-Step Request Flows
  flows: [
    {
      id: 'allow',
      name: '1. Allowed Request Flow (Within Quota)',
      shortDesc: 'Evaluates client identity, confirms token availability in Redis via atomic Lua, and forwards to backend.',
      color: 'emerald',
      steps: [
        {
          step: 1,
          title: 'Client Inbound Request',
          source: 'client',
          target: 'api-gateway',
          desc: 'Client sends an HTTP request (e.g. <code>POST /api/v1/orders</code>) with bearer API key or OAuth JWT token.',
          badge: 'Inbound HTTP',
          highlightNodes: ['client', 'api-gateway'],
          highlightLinks: ['link-client-gw']
        },
        {
          step: 2,
          title: 'Gateway Extraction & Middleware Intercept',
          source: 'api-gateway',
          target: 'rl-middleware',
          desc: 'Gateway extracts caller identity (API key <code>usr_9812</code>, IP, endpoint route) and invokes the rate limit middleware interceptor.',
          badge: 'Identity Extraction',
          highlightNodes: ['api-gateway', 'rl-middleware'],
          highlightLinks: ['link-gw-rl']
        },
        {
          step: 3,
          title: 'Policy Lookup in Local Cache',
          source: 'rl-middleware',
          target: 'policy-cache',
          desc: 'Middleware queries in-memory local policy cache: Tier = "Pro", Capacity = 100 req/min, Refill = 10 tokens/sec. Cache hit takes < 0.1ms.',
          badge: 'Sub-millisecond Cache',
          highlightNodes: ['rl-middleware', 'policy-cache'],
          highlightLinks: ['link-rl-cache']
        },
        {
          step: 4,
          title: 'Atomic Redis Lua Evaluation',
          source: 'rl-middleware',
          target: 'redis-cluster',
          desc: 'Executes atomic Lua script in Redis. Calculates elapsed time refill, checks if <code>tokens >= 1</code>, decrements by 1, and updates timestamp atomically.',
          badge: 'Atomic Lua Refill & Check',
          highlightNodes: ['rl-middleware', 'redis-cluster'],
          highlightLinks: ['link-rl-redis']
        },
        {
          step: 5,
          title: 'Forwarded to Backend Domain Service',
          source: 'redis-cluster',
          target: 'backend-svc',
          desc: 'With quota confirmed, middleware adds headers (<code>X-RateLimit-Limit: 100</code>, <code>X-RateLimit-Remaining: 84</code>) and forwards call to downstream Orders API.',
          badge: '200 OK & Forward',
          highlightNodes: ['redis-cluster', 'backend-svc'],
          highlightLinks: ['link-redis-backend']
        }
      ]
    },
    {
      id: 'throttle',
      name: '2. Throttled Request Flow (Quota Exhausted)',
      shortDesc: 'Detects zero available tokens, halts downstream execution immediately, and emits HTTP 429 Too Many Requests.',
      color: 'rose',
      steps: [
        {
          step: 1,
          title: 'High-Volume Burst Arrives',
          source: 'client',
          target: 'api-gateway',
          desc: 'Client bursts traffic exceeding configured capacity (e.g., 150 calls within a 10-second interval).',
          badge: 'Traffic Spike',
          highlightNodes: ['client', 'api-gateway'],
          highlightLinks: ['link-client-gw']
        },
        {
          step: 2,
          title: 'Atomic Redis Lua Checks Balance',
          source: 'rl-middleware',
          target: 'redis-cluster',
          desc: 'Redis Lua script evaluates current bucket. Available tokens = 0. Request is rejected immediately without updating token count.',
          badge: 'Zero Tokens Available',
          highlightNodes: ['rl-middleware', 'redis-cluster'],
          highlightLinks: ['link-rl-redis']
        },
        {
          step: 3,
          title: 'Immediate HTTP 429 Rejection',
          source: 'redis-cluster',
          target: 'reject-429',
          desc: 'Middleware returns HTTP 429 Too Many Requests with <code>Retry-After: 4</code>. Backend domain services are completely protected from load.',
          badge: 'HTTP 429 Too Many Requests',
          highlightNodes: ['redis-cluster', 'reject-429'],
          highlightLinks: ['link-redis-reject']
        },
        {
          step: 4,
          title: 'Asynchronous Telemetry Logging',
          source: 'rl-middleware',
          target: 'message-queue',
          desc: 'Rate limit breach event is pushed to Kafka topic <code>rate-limit-breaches</code> with timestamp, client ID, and breached endpoint.',
          badge: 'Kafka Event Logging',
          highlightNodes: ['rl-middleware', 'message-queue'],
          highlightLinks: ['link-rl-telemetry']
        },
        {
          step: 5,
          title: 'Abuse Monitoring & Alerting',
          source: 'analytics-worker',
          target: 'analytics-db',
          desc: 'Security stream workers detect sustained abusive spikes and auto-trigger temporary IP-level firewall drops if DDoS threshold is breached.',
          badge: 'DDoS Defense Alarm',
          highlightNodes: ['message-queue', 'analytics-worker', 'analytics-db'],
          highlightLinks: ['link-queue-worker', 'link-worker-db']
        }
      ]
    },
    {
      id: 'fallback',
      name: '3. Degraded Mode Flow (Redis Outage)',
      shortDesc: 'Circuit breaker trips on Redis timeout; switches to conservative local in-memory token bucket.',
      color: 'cyan',
      steps: [
        {
          step: 1,
          title: 'Redis Cluster Network Partition',
          source: 'rl-middleware',
          target: 'redis-cluster',
          desc: 'Redis counter cluster experiences transient timeout (> 5ms) or network partition.',
          badge: 'Dependency Timeout',
          highlightNodes: ['rl-middleware', 'redis-cluster'],
          highlightLinks: ['link-rl-redis']
        },
        {
          step: 2,
          title: 'Circuit Breaker Switches to Local Limiter',
          source: 'rl-middleware',
          target: 'local-limiter',
          desc: 'Circuit breaker trips. Middleware immediately fails over to local in-memory Token Bucket (Bucket4j/Guava) with localized limits.',
          badge: 'Fail-Safe Circuit Breaker',
          highlightNodes: ['rl-middleware', 'local-limiter'],
          highlightLinks: ['link-rl-local']
        },
        {
          step: 3,
          title: 'Protected Execution & Safe Forwarding',
          source: 'local-limiter',
          target: 'backend-svc',
          desc: 'Local rate limiter enforces conservative local instance quota, protecting downstream databases while preserving API availability.',
          badge: 'Graceful Degradation',
          highlightNodes: ['local-limiter', 'backend-svc'],
          highlightLinks: ['link-local-backend']
        }
      ]
    }
  ],

  // Detailed Component Specifications for Inspector Panel
  components: {
    'client': {
      id: 'client',
      name: 'Clients & Consumers',
      tier: 'Client Tier',
      tierBadge: 'External Ingress',
      status: 'External Web, Mobile & SDKs',
      role: 'Generates API traffic governed by client tiers (Anonymous, Free, Pro, Enterprise).',
      responsibilities: [
        'Include authenticating API key or Bearer JWT token in HTTP Authorization header.',
        'Honor HTTP 429 responses and respect `Retry-After` delay headers.',
        'Implement exponential backoff with jitter on rejected requests to avoid thundering herd.',
        'Handle client-side token rate limiting for high-frequency bulk ingestion.'
      ],
      apis: [
        {
          method: 'HTTP CLIENT REQUEST',
          endpoint: 'POST /api/v1/orders',
          description: 'Standard authenticated customer API call',
          sample: 'Headers:\n  Authorization: Bearer key_live_8a92b...\n  Content-Type: application/json'
        }
      ],
      storageDecisions: [
        {
          type: 'Client Side Token Store',
          decision: 'SDK Client-side Token Leases',
          rationale: 'High-throughput enterprise clients can reserve batches of 1,000 tokens locally to avoid network hops.'
        }
      ],
      tradeoffs: [
        {
          question: 'Client-side vs Server-side enforcement',
          choice: 'Server-side with optional SDK cooperative hints',
          upside: 'Server enforcement guarantees security against malicious callers.',
          downside: 'Consumes network bandwidth up to the API Gateway before rejection occurs.'
        }
      ],
      failureModes: 'Malicious client spam or runaway scripts. Handled by gateway IP-level connection limits.',
      scalingStrategy: 'Stateless external callers scale infinitely; edge gateways absorb connection spikes.'
    },

    'api-gateway': {
      id: 'api-gateway',
      name: 'Edge API Gateway',
      tier: 'Edge Ingress',
      tierBadge: 'Reverse Proxy',
      status: 'Kong / Envoy / AWS API Gateway',
      role: 'Entry point for external traffic, responsible for TLS termination, client identity resolution, and routing.',
      responsibilities: [
        'Terminate TLS/HTTPS connections with HTTP/2 and HTTP/3 multiplexing.',
        'Authenticate API keys and decode JWT tokens to resolve customer ID and subscription tier.',
        'Map request path to target service domain and policy rules.',
        'Invoke rate-limit middleware before any backend routing or heavy compute occurs.'
      ],
      apis: [
        {
          method: 'GATEWAY ROUTE',
          endpoint: 'ANY /api/v1/*',
          description: 'Reverse proxy request pipeline',
          sample: 'Incoming: GET /api/v1/products/123\nExtracted: tenantId="org_441", tier="Enterprise"'
        }
      ],
      storageDecisions: [
        {
          type: 'Route Table Cache',
          decision: 'In-memory routing tree',
          rationale: 'Instant O(1) route matching without database queries.'
        }
      ],
      tradeoffs: [
        {
          question: 'Rate limiting in Gateway vs Inside microservices',
          choice: 'In Gateway / Edge Middleware',
          upside: 'Stops malicious and excess traffic before it consumes internal bandwidth or service CPU.',
          downside: 'Gateway becomes a shared dependency for all downstream teams.'
        }
      ],
      failureModes: 'Gateway node crash. Managed by Anycast DNS and horizontal auto-scaling groups across 3 AZs.',
      scalingStrategy: 'Stateless Envoy nodes scale horizontally based on active CPU and network socket saturation.'
    },

    'rl-middleware': {
      id: 'rl-middleware',
      name: 'Rate-Limit Middleware / Interceptor',
      tier: 'Stateless Compute',
      tierBadge: 'Policy Evaluator',
      status: 'Envoy Filter / Custom Go Service',
      role: 'Core policy evaluation component executing token checks, rule matching, and decision gating in < 2ms.',
      responsibilities: [
        'Derive composite rate limit key (e.g. `rl:tenant:{id}:path:{endpoint}`).',
        'Query Policy Cache for active tier thresholds and chosen algorithm (Token Bucket vs Sliding Window).',
        'Execute atomic check against Redis cluster via SHA-1 cached Lua script.',
        'Inject standard RFC 6585 and IETF headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.'
      ],
      apis: [
        {
          method: 'INTERNAL INTERCEPTOR',
          endpoint: 'RateLimiter.evaluate(RequestCtx)',
          description: 'Synchronous evaluation function',
          sample: 'Input: key="rl:user_81:checkout", cost=1\nOutput: { allowed: true, remaining: 79, resetInSeconds: 12 }'
        }
      ],
      storageDecisions: [
        {
          type: 'Local Circuit Breaker State',
          decision: 'Netflix Hystrix / Resilience4j in memory',
          rationale: 'Tracks consecutive Redis errors to trip fallback mode within 5ms.'
        }
      ],
      tradeoffs: [
        {
          question: 'Single global counter vs Multi-tier limits',
          choice: 'Layered limits (IP + User + Tenant + Global API)',
          upside: 'Prevents one noisy customer from starving others while protecting the overall cluster.',
          downside: 'Requires multiple key lookups per request if not bundled in a single Redis script.'
        }
      ],
      failureModes: 'High evaluation latency. Guarded by strict 5ms Redis network timeouts.',
      scalingStrategy: 'Runs as a sidecar or in-process filter; scales 1:1 with gateway compute instances.'
    },

    'policy-cache': {
      id: 'policy-cache',
      name: 'Policy & Rules Cache',
      tier: 'Stateless Compute',
      tierBadge: 'Local Memory Cache',
      status: 'Caffeine / Go Ristretto in RAM',
      role: 'Stores pre-compiled rate limit configurations locally on each node to avoid database queries on the hot path.',
      responsibilities: [
        'Maintain tenant tier limits (Free: 60 rpm, Pro: 1,000 rpm, Enterprise: 10,000 rpm).',
        'Subscribe to PostgreSQL change data capture (CDC) or Redis pub/sub for instant rule updates.',
        'Provide sub-microsecond memory lookups for rule parameters.',
        'Hold route-specific multipliers (e.g. heavy `/reports/generate` costs 5 tokens; lightweight `/ping` costs 0).'
      ],
      apis: [
        {
          method: 'CACHE LOOKUP',
          endpoint: 'PolicyCache.getRule(tenantId, route)',
          description: 'In-memory configuration getter',
          sample: 'Rule: { capacity: 100, refillRate: 10.0, burst: 150, cost: 1 }'
        }
      ],
      storageDecisions: [
        {
          type: 'Cache Eviction',
          decision: 'LRU with 5-minute TTL and Pub/Sub invalidation',
          rationale: 'Ensures rule changes propagate within seconds without polling overhead.'
        }
      ],
      tradeoffs: [
        {
          question: 'Direct DB queries vs Local memory cache',
          choice: 'Local In-Memory Cache',
          upside: 'Zero network overhead (< 1 microsecond per check).',
          downside: 'Brief propagation delay (1-2s) when operators modify rate limit rules.'
        }
      ],
      failureModes: 'Rule not found. Defaults to conservative baseline free tier policy.',
      scalingStrategy: 'Replicated across every middleware instance in memory; RAM footprint < 20 MB.'
    },

    'rules-db': {
      id: 'rules-db',
      name: 'Rules & Quotas Database',
      tier: 'Storage & Caching',
      tierBadge: 'Durable ACID Store',
      status: 'PostgreSQL / AWS Aurora',
      role: 'Authoritative durable storage for customer plans, custom quotas, endpoints rules, and overrides.',
      responsibilities: [
        'Persist customer subscription plans and allocated rate limits.',
        'Support admin CRUD APIs for modifying limits and customer VIP overrides.',
        'Publish rule change events via transactional outbox to message bus.',
        'Track audit history of who changed rate limit policies and when.'
      ],
      apis: [
        {
          method: 'SQL QUERY',
          endpoint: 'SELECT * FROM rate_limit_rules WHERE tenant_id = $1',
          description: 'Rule load query',
          sample: 'Row: tenant_id="t_981", route="/checkout", capacity=500, refill_per_sec=50'
        }
      ],
      storageDecisions: [
        {
          type: 'Relational Schema',
          decision: 'Normalized SQL tables with indexes on (tenant_id, route)',
          rationale: 'Guarantees integrity and allows rich admin portal queries.'
        }
      ],
      tradeoffs: [
        {
          question: 'SQL vs Config file in repo',
          choice: 'SQL Database with Admin UI',
          upside: 'Support and sales teams can upgrade customer quotas in real time without code deployment.',
          downside: 'Requires database maintenance and replication.'
        }
      ],
      failureModes: 'DB downtime does not affect live traffic, as policy caches retain existing rules.',
      scalingStrategy: 'Low read/write volume (< 10 writes/day). Small managed instance is sufficient.'
    },

    'redis-cluster': {
      id: 'redis-cluster',
      name: 'Distributed Redis Cluster',
      tier: 'Storage & Caching',
      tierBadge: 'In-Memory Counters',
      status: 'Redis 7.2 Cluster (Multi-AZ)',
      role: 'Shared high-throughput in-memory state store executing atomic token bucket checks via Lua scripts.',
      responsibilities: [
        'Execute atomic Lua script for Token Bucket / Sliding Window in < 1ms.',
        'Maintain key per identity with automatic TTL expiry to prevent memory bloat.',
        'Handle up to 100,000+ atomic operations/sec across cluster shards.',
        'Partition keys using `{tenant_id}` hash tags so multi-route checks hit the same Redis node.'
      ],
      apis: [
        {
          method: 'EVALSHA',
          endpoint: 'EVALSHA <sha1_token_bucket> 1 "rl:user_123" 100 10 1728732000 1',
          description: 'Atomic token bucket evaluation script',
          sample: 'Keys: [ "rl:user_123" ]\nArgs: [ capacity=100, refill=10, now=1728732000, cost=1 ]\nReturn: [ 1 (allowed), 84 (remaining) ]'
        }
      ],
      storageDecisions: [
        {
          type: 'Data Structure',
          decision: 'Redis Hash: `tokens` (float) and `last_updated` (timestamp)',
          rationale: 'Eliminates background worker timers; tokens are calculated mathematically on demand.'
        }
      ],
      tradeoffs: [
        {
          question: 'Lua script vs Redis MULTI/EXEC or separate GET/SET',
          choice: 'Single Atomic Lua Script',
          upside: 'Prevents race conditions where two concurrent requests see the same token balance.',
          downside: 'Long-running Lua scripts block Redis single-threaded event loop (kept < 0.2ms).'
        }
      ],
      failureModes: 'Primary node failover. Sentinel / Redis Cluster auto-promotes replica in < 3 seconds.',
      scalingStrategy: 'Sharded across 6 primary nodes with 6 read replicas across 3 Availability Zones.'
    },

    'local-limiter': {
      id: 'local-limiter',
      name: 'Local Fallback Limiter',
      tier: 'Stateless Compute',
      tierBadge: 'Degraded Fallback',
      status: 'Bucket4j / Guava RateLimiter',
      role: 'In-process emergency rate limiter activated when Redis is unreachable or timing out.',
      responsibilities: [
        'Apply conservative per-instance token limits during Redis outages.',
        'Fail closed on high-risk routes (e.g. `/login`, `/charge_card`) to block brute-force attacks.',
        'Fail open with soft limits on read routes (e.g. `/feed`, `/search`) to keep the app functional.',
        'Auto-deactivate once Redis health check passes consistently for 30 seconds.'
      ],
      apis: [
        {
          method: 'IN-PROCESS CALL',
          endpoint: 'localBucket.tryConsume(1)',
          description: 'Local token consumption',
          sample: 'Returns: true (allowed under local safety cap)'
        }
      ],
      storageDecisions: [
        {
          type: 'In-Memory State',
          decision: 'ConcurrentHashMap with AtomicLong counters',
          rationale: 'Thread-safe local counting with zero external dependencies.'
        }
      ],
      tradeoffs: [
        {
          question: 'Fail Open vs Fail Closed on Redis outage',
          choice: 'Hybrid by Endpoint Risk Profile',
          upside: 'Protects critical payment/auth paths from abuse while keeping catalog/content available.',
          downside: 'Requires maintaining risk classification metadata per endpoint.'
        }
      ],
      failureModes: 'Instance restarts clear local counters; harmless during emergency fallback.',
      scalingStrategy: 'Operates entirely inside middleware memory with zero network overhead.'
    },

    'backend-svc': {
      id: 'backend-svc',
      name: 'Protected Backend Services',
      tier: 'Downstream Services',
      tierBadge: 'Domain Compute',
      status: 'Microservices Fleet',
      role: 'Core business logic (Order processing, checkout, payments, user services).',
      responsibilities: [
        'Execute domain business transactions knowing traffic has been sanitized and rate-limited.',
        'Read rate limit context headers for tenant identification and priority queuing.',
        'Emit downstream backpressure signals if database queues begin backing up.',
        'Return 200 OK responses to authenticated callers.'
      ],
      apis: [
        {
          method: 'GRPC / REST',
          endpoint: 'POST /v1/orders/create',
          description: 'Internal microservice call',
          sample: 'Status: 200 OK\nPayload: { "orderId": "ord_8819", "status": "CONFIRMED" }'
        }
      ],
      storageDecisions: [
        {
          type: 'Domain Databases',
          decision: 'Service-specific databases',
          rationale: 'Shielded from thundering herds by the rate limiting layer.'
        }
      ],
      tradeoffs: [
        {
          question: 'Rate limiting at service vs edge',
          choice: 'Edge with Service Secondary Defense',
          upside: 'Protects entire internal network from high-volume spam.',
          downside: 'Internal service-to-service calls need their own mesh rate limiting.'
        }
      ],
      failureModes: 'Service slow response. Isolated from rate limiter; gateway applies circuit breaking.',
      scalingStrategy: 'Autoscales independently based on CPU and domain queue depth.'
    },

    'reject-429': {
      id: 'reject-429',
      name: 'HTTP 429 Error Responder',
      tier: 'Edge Ingress',
      tierBadge: 'Fast Rejection',
      status: 'Stateless Edge Gate',
      role: 'Generates standardized HTTP 429 Too Many Requests responses with helpful retry metadata.',
      responsibilities: [
        'Emit HTTP 429 status code with zero backend service invocation.',
        'Calculate precise `Retry-After: <seconds>` based on token refill math.',
        'Provide structured JSON error payload explaining policy cap.',
        'Drop connection early on abusive volumetric attacks to preserve socket capacity.'
      ],
      apis: [
        {
          method: 'HTTP RESPONSE',
          endpoint: 'HTTP/1.1 429 Too Many Requests',
          description: 'Standard throttling response',
          sample: 'HTTP/1.1 429 Too Many Requests\nRetry-After: 4\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\n\n{\n  "error": "rate_limit_exceeded",\n  "retryAfter": 4\n}'
        }
      ],
      storageDecisions: [
        {
          type: 'Zero Storage',
          decision: 'Pure stateless response template',
          rationale: 'Zero disk or memory footprint during intense DDoS spikes.'
        }
      ],
      tradeoffs: [
        {
          question: 'Drop socket vs Return 429 with JSON body',
          choice: 'Return 429 for normal users; TCP RST for known botnets',
          upside: 'Polite developers receive clear retry instructions; volumetric attackers waste zero server RAM.',
          downside: 'Requires gateway inspection logic to differentiate abuse levels.'
        }
      ],
      failureModes: 'High TCP connection exhaustion. Mitigated by `SO_REUSEPORT` and kernel TCP SYN cookies.',
      scalingStrategy: 'Can serve 200,000+ rejections/sec per gateway node with negligible CPU usage.'
    },

    'message-queue': {
      id: 'message-queue',
      name: 'Telemetry Stream (Kafka)',
      tier: 'Telemetry & Abuse Monitoring',
      tierBadge: 'Event Streaming',
      status: 'Apache Kafka / AWS Kinesis',
      role: 'Decoupled asynchronous event pipeline buffering rate limiting telemetry, breach logs, and quota consumption.',
      responsibilities: [
        'Ingest rate limit breach events without adding latency to the client request path.',
        'Buffer telemetry during massive traffic bursts without losing security audit events.',
        'Partition events by `tenant_id` to maintain ordered consumption for billing rollups.',
        'Enable multiple consumer groups (Abuse Detection, Billing, Prometheus metrics exporter).'
      ],
      apis: [
        {
          method: 'KAFKA EVENT',
          endpoint: 'Topic: rate-limit-telemetry',
          description: 'High-throughput binary publish stream',
          sample: 'Key: "tenant_881"\nValue: { "timestamp": 1728732001, "key": "usr_99", "action": "BLOCKED", "quota": 100 }'
        }
      ],
      storageDecisions: [
        {
          type: 'Retention Policy',
          decision: '24-hour log retention',
          rationale: 'Sufficient window for consumers to process and aggregate metric windows.'
        }
      ],
      tradeoffs: [
        {
          question: 'Async message queue vs Direct Prometheus counter',
          choice: 'Kafka Stream with Metric Aggregator',
          upside: 'Can handle millions of fine-grained events without Prometheus cardinality explosion.',
          downside: 'Requires Kafka broker infrastructure.'
        }
      ],
      failureModes: 'Queue lag. Consumer auto-scaling increases worker instances to catch up.',
      scalingStrategy: '8 partitions per topic allows 8 parallel consumer workers to scale linearly.'
    },

    'analytics-worker': {
      id: 'analytics-worker',
      name: 'Abuse Detection & Aggregator Workers',
      tier: 'Telemetry & Abuse Monitoring',
      tierBadge: 'Stream Processor',
      status: 'Stateless Consumer Cluster',
      role: 'Analyzes rate limit breach streams in real time to detect distributed DDoS attacks, credential stuffing, and scraping.',
      responsibilities: [
        'Aggregate breach counts per IP, user, and tenant across 1-minute and 5-minute rolling windows.',
        'Detect credential stuffing patterns on `/login` and auto-push IP blocks to Cloudflare / AWS WAF.',
        'Calculate usage percentiles (P50, P90, P99) for capacity planning dashboards.',
        'Emit alerts to PagerDuty if overall system rejection rate exceeds 5% of total traffic.'
      ],
      apis: [
        {
          method: 'STREAM CONSUMER',
          endpoint: 'AbuseDetector.consume(EventBatch)',
          description: 'Real-time security analytics loop',
          sample: 'Detected: IP 198.51.100.22 exceeded 5,000 requests across 12 API keys in 60s'
        }
      ],
      storageDecisions: [
        {
          type: 'Rolling Window State',
          decision: 'In-memory sliding window state with Redis cache',
          rationale: 'Fast cross-event correlation without full database writes.'
        }
      ],
      tradeoffs: [
        {
          question: 'Immediate auto-ban vs Admin notification',
          choice: 'Auto-ban for severe threshold; alerts for borderline breaches',
          upside: 'Instant defense against automated attacks at 3 AM without manual intervention.',
          downside: 'Risk of false positive banning a corporate NAT IP.'
        }
      ],
      failureModes: 'Worker crash. Kafka consumer group reassigns partitions automatically.',
      scalingStrategy: 'Consumer instances scale with Kafka partition count (up to 16 workers).'
    },

    'analytics-db': {
      id: 'analytics-db',
      name: 'Observability & Dashboards',
      tier: 'Telemetry & Abuse Monitoring',
      tierBadge: 'Metrics & Alerting',
      status: 'Prometheus • Grafana • CloudWatch',
      role: 'Visualizes rate limiting health, tenant quota utilization, rejection rates, and Redis latency.',
      responsibilities: [
        'Plot real-time rate limit allow/reject graphs with breakdown by customer plan.',
        'Track Redis Lua script latency (target P99 < 2ms).',
        'Monitor local fallback activation rates across all gateway nodes.',
        'Provide customer-facing portal metrics showing remaining daily/monthly quota.'
      ],
      apis: [
        {
          method: 'PROMETHEUS METRIC',
          endpoint: 'GET /metrics',
          description: 'Prometheus scraper endpoint',
          sample: 'ratelimit_requests_total{status="allowed",tier="pro"} 948102\nratelimit_requests_total{status="rejected",tier="free"} 14092'
        }
      ],
      storageDecisions: [
        {
          type: 'Time-Series DB',
          decision: 'Prometheus TSDB with 30-day retention',
          rationale: 'Optimized for high-write time-series aggregation and Grafana dashboards.'
        }
      ],
      tradeoffs: [
        {
          question: 'High-cardinality metrics (per API key) vs Aggregate metrics (per tier)',
          choice: 'Aggregate in Prometheus; detailed logs in OpenSearch/ClickHouse',
          upside: 'Prevents TSDB crashes while retaining deep forensics in log storage.',
          downside: 'Requires two tools for metrics vs forensic deep dive.'
        }
      ],
      failureModes: 'Monitoring outage does not impact request processing or rate limiting enforcement.',
      scalingStrategy: 'Prometheus federation handles hundreds of thousands of active series.'
    }
  },

  // System-level Architectural Trade-offs
  tradeoffs: [
    {
      id: 'to-coordination',
      decision: 'Centralized Redis Cluster vs In-Memory Local Limits',
      optionA: {
        name: 'Centralized Redis Cluster (Selected Default)',
        pros: 'Strict global consistency across 100+ application instances; quotas survive restarts and auto-scaling events.',
        cons: 'Every request incurs a network round trip (0.5 - 2ms); Redis cluster failure can impact API availability unless fallback is implemented.'
      },
      optionB: {
        name: 'In-Memory Local Limits per Instance',
        pros: 'Ultra-fast in-memory execution (< 1 microsecond) with zero external network dependencies.',
        cons: 'Effective global limit scales linearly with instance count (e.g. 10 instances = 10x limit); restarts reset counters.'
      },
      verdict: 'Recommended: Redis Cluster with atomic Lua scripts on hot path; automated fallback to local in-memory token buckets if Redis latency > 5ms.',
      relatedNodes: ['rl-middleware', 'redis-cluster', 'local-limiter']
    },
    {
      id: 'to-algorithm',
      decision: 'Token Bucket vs Sliding-Window Counter vs Fixed Window',
      optionA: {
        name: 'Token Bucket Algorithm (Selected Default)',
        pros: 'Smoothly accommodates short valid bursts while maintaining strict average rate; memory-efficient with O(1) mathematical calculation on demand.',
        cons: 'Requires atomic synchronization (Lua script) to prevent race conditions on balance deduction.'
      },
      optionB: {
        name: 'Sliding-Window Counter',
        pros: 'Prevents 2x boundary bursts that plague Fixed Window; simple counter weighted by elapsed percentage of previous window.',
        cons: 'Approximation rather than strict mathematical balance; slightly higher memory than Token Bucket.'
      },
      verdict: 'Recommended: Token Bucket is the industry standard default (AWS, Stripe, Cloudflare) because it naturally handles valid network bursts while bounding average sustained RPS.',
      relatedNodes: ['rl-middleware', 'redis-cluster']
    },
    {
      id: 'to-resilience',
      decision: 'Fail Open vs Fail Closed during Dependency Outage',
      optionA: {
        name: 'Fail Open (Prioritize Availability)',
        pros: 'All valid traffic continues to flow even if Redis is completely down; zero user-facing 500 errors caused by rate limiter failure.',
        cons: 'Downstream services are exposed to thundering herd and potential cascading failure; attackers can flood sensitive APIs.'
      },
      optionB: {
        name: 'Fail Closed (Prioritize Protection)',
        pros: 'Guarantees downstream databases and payment systems will not be overwhelmed; blocks security abuse during infrastructure degradation.',
        cons: 'Valid paying customers are denied service when the limiter fails.'
      },
      verdict: 'Recommended: Hybrid policy: Fail Closed on critical security routes (/login, /auth, /checkout) and Fail Open with Conservative Local Caps on general read routes.',
      relatedNodes: ['rl-middleware', 'local-limiter', 'backend-svc', 'reject-429']
    },
    {
      id: 'to-throughput',
      decision: 'Per-Request Atomic Lua vs Token Leases / Batching',
      optionA: {
        name: 'Per-Request Atomic Lua (Standard)',
        pros: 'Exact real-time accounting with zero quota drift; simple to reason about and audit.',
        cons: 'Redis cluster must sustain 100,000+ commands/sec at peak traffic.'
      },
      optionB: {
        name: 'Token Leases / Batch Reservation',
        pros: 'App instances reserve 50-100 tokens at a time; 98% of checks happen locally in RAM; cuts Redis network traffic by up to 98%.',
        cons: 'Unused tokens expire on instance shutdown; temporary overshoot of up to one batch size.'
      },
      verdict: 'Recommended: Use per-request atomic Lua for standard traffic up to 50k RPS; enable Token Leases for extreme-volume enterprise tenants.',
      relatedNodes: ['api-gateway', 'rl-middleware', 'redis-cluster']
    }
  ]
};
