/**
 * API Gateway High-Level Architecture (HLD) Data Specification
 * Pure architecture data model separated from presentation.
 * Supports:
 * - Architecture topology (nodes, tiers, links)
 * - Request flows (North-South Ingress Flow, Canary Traffic Shifting Flow, Downstream Outage & Circuit Breaker Flow)
 * - Detailed component specifications (Responsibilities, APIs, Storage, Trade-offs, Failure modes)
 * - System-level architectural trade-offs
 */

export const API_GATEWAY_HLD_DATA = {
  lessonId: 'api-gateway',
  title: 'Distributed API Gateway & Reverse Proxy High-Level Architecture',
  systemName: 'High-Throughput Edge API Gateway Fleet with Policy Pipeline & Service Mesh Ingress',
  scaleMetrics: {
    monthlyCreates: '1,000,000 req/sec peak cluster ingress',
    avgWriteRps: '~350,000 requests/sec',
    peakWriteRps: '~1,000,000 requests/sec',
    monthlyRedirects: '25 Billion transactions/mo',
    avgReadRps: '~750,000 requests/sec',
    peakReadRps: '~1,200,000 requests/sec',
    targetRedirectLatency: '< 2.5 ms P99 Gateway Overhead',
    storagePerYear: '2,500 active dynamic route rules across 150+ microservices'
  },

  scaleMetricsList: [
    { label: 'Ingress Throughput', value: '1,000,000 req / sec', color: 'blue' },
    { label: 'Gateway Latency SLA', value: '< 2.5ms P99 Overhead', color: 'emerald' },
    { label: 'Uptime Availability', value: '99.999% Five Nines', color: 'indigo' },
    { label: 'Active Endpoints', value: '2,500 Dynamic Routes', color: 'cyan' },
    { label: 'Security Enforcement', value: 'TLS 1.3 • JWT Auth • WAF', color: 'amber' }
  ],

  // Tier boundaries for the SVG Canvas (viewBox 0 0 1100 680)
  tierBoxes: [
    { x: 210, y: 30, w: 380, h: 390, textX: 225, textY: 55, title: 'EDGE INGRESS, AUTH & POLICY PIPELINE (GATEWAY FLEET)', color: 'indigo' },
    { x: 605, y: 30, w: 440, h: 400, textX: 620, textY: 55, title: 'DYNAMIC SERVICE DISCOVERY & BACKEND MICROSERVICES', color: 'blue' },
    { x: 210, y: 440, w: 835, h: 225, textX: 225, textY: 465, title: 'CONTROL PLANE (xDS CONFIGS) & DISTRIBUTED TELEMETRY (OTEL)', color: 'amber' }
  ],

  // Architectural Tiers for grouping
  tiers: [
    { id: 'client-tier', name: 'External Client Tier', color: 'slate' },
    { id: 'ingress-tier', name: 'Edge Ingress & Gateway Fleet Tier', color: 'indigo' },
    { id: 'backend-tier', name: 'Internal Services & Service Discovery Tier', color: 'emerald' },
    { id: 'control-tier', name: 'Control Plane & Telemetry Pipeline Tier', color: 'amber' }
  ],

  // Interactive Nodes on the SVG Canvas (viewBox 0 0 1100 680)
  nodes: [
    {
      id: 'clients',
      label: 'Clients (Web, Mobile, B2B)',
      sublabel: 'HTTPS • gRPC • WebSockets',
      tier: 'client-tier',
      tierLabel: 'External Callers',
      category: 'Client Tier',
      icon: 'devices',
      x: 40,
      y: 190,
      width: 150,
      height: 90,
      badge: 'North-South Ingress',
      color: 'slate'
    },
    {
      id: 'l4-lb',
      label: 'L4 Network Load Balancer',
      sublabel: 'AWS NLB / Maglev Anycast IP',
      tier: 'ingress-tier',
      tierLabel: 'L4 Ingress',
      category: 'Edge & Ingress',
      icon: 'alt_route',
      x: 230,
      y: 190,
      width: 155,
      height: 85,
      badge: 'L4 Pass-Through',
      color: 'indigo'
    },
    {
      id: 'gw-tls',
      label: 'TLS 1.3 & WAF Filter',
      sublabel: 'SNI Routing • SQLi / XSS Shield',
      tier: 'ingress-tier',
      tierLabel: 'Edge Security',
      category: 'Security & Auth',
      icon: 'lock',
      x: 230,
      y: 55,
      width: 155,
      height: 85,
      badge: 'Edge SSL & WAF',
      color: 'cyan'
    },
    {
      id: 'gw-auth',
      label: 'Identity & Auth Engine',
      sublabel: 'JWKS Verify • OAuth2 Scope Check',
      tier: 'ingress-tier',
      tierLabel: 'Auth Filter',
      category: 'Security & Auth',
      icon: 'verified_user',
      x: 415,
      y: 55,
      width: 165,
      height: 85,
      badge: 'Zero-Trust Token Auth',
      color: 'emerald'
    },
    {
      id: 'gw-rate-limiter',
      label: 'Distributed Rate Limiter',
      sublabel: 'Token Bucket • Redis Quotas',
      tier: 'ingress-tier',
      tierLabel: 'Traffic Shaping',
      category: 'Traffic Policy',
      icon: 'speed',
      x: 415,
      y: 175,
      width: 165,
      height: 85,
      badge: 'Quota & Throttling',
      color: 'amber'
    },
    {
      id: 'gw-router',
      label: 'Dynamic Proxy Router',
      sublabel: 'Envoy Core • Path Matching & Rewrite',
      tier: 'ingress-tier',
      tierLabel: 'Reverse Proxy',
      category: 'Reverse Proxy',
      icon: 'hub',
      x: 415,
      y: 295,
      width: 165,
      height: 90,
      badge: 'Reverse Proxy Core',
      color: 'blue'
    },
    {
      id: 'control-plane',
      label: 'xDS Control Plane (K8s)',
      sublabel: 'Dynamic Routes • Canary Splits (xDS)',
      tier: 'control-tier',
      tierLabel: 'Dynamic Config',
      category: 'Control Plane',
      icon: 'settings_suggest',
      x: 415,
      y: 470,
      width: 165,
      height: 95,
      badge: 'Dynamic xDS Stream',
      color: 'indigo'
    },
    {
      id: 'service-registry',
      label: 'Service Registry (K8s/Consul)',
      sublabel: 'Real-time Pod Endpoints & Health',
      tier: 'backend-tier',
      tierLabel: 'Discovery Store',
      category: 'Service Discovery',
      icon: 'inventory_2',
      x: 620,
      y: 55,
      width: 180,
      height: 85,
      badge: 'Health Endpoint Map',
      color: 'cyan'
    },
    {
      id: 'order-service',
      label: 'Order Microservice',
      sublabel: '/api/v1/orders • gRPC / mTLS',
      tier: 'backend-tier',
      tierLabel: 'Domain Microservice',
      category: 'Internal Microservice',
      icon: 'shopping_bag',
      x: 840,
      y: 65,
      width: 180,
      height: 85,
      badge: 'Order API Pods',
      color: 'emerald'
    },
    {
      id: 'user-service',
      label: 'User / Auth Microservice',
      sublabel: '/api/v1/users • Profile & Creds',
      tier: 'backend-tier',
      tierLabel: 'Domain Microservice',
      category: 'Internal Microservice',
      icon: 'person',
      x: 840,
      y: 175,
      width: 180,
      height: 85,
      badge: 'User API Pods',
      color: 'emerald'
    },
    {
      id: 'payment-service',
      label: 'Payment Microservice',
      sublabel: '/api/v1/payments • Idempotent Vault',
      tier: 'backend-tier',
      tierLabel: 'PCI-DSS Enclave',
      category: 'Internal Microservice',
      icon: 'credit_card',
      x: 840,
      y: 285,
      width: 180,
      height: 85,
      badge: 'PCI Payment Pods',
      color: 'rose'
    },
    {
      id: 'otel-collector',
      label: 'OpenTelemetry & Metrics',
      sublabel: 'Jaeger Traces • Prometheus QPS/p99',
      tier: 'control-tier',
      tierLabel: 'Observability',
      category: 'Observability & Logs',
      icon: 'analytics',
      x: 620,
      y: 470,
      width: 180,
      height: 95,
      badge: 'Trace & Latency Mesh',
      color: 'violet'
    }
  ],

  // Directed links between nodes
  links: [
    {
      id: 'link-client-l4',
      from: 'clients',
      to: 'l4-lb',
      label: 'HTTPS / TCP 443 Handshake',
      type: 'forward',
      flows: ['ingress-routing', 'canary-routing', 'circuit-breaker'],
      path: 'M 190 232 L 230 232'
    },
    {
      id: 'link-l4-tls',
      from: 'l4-lb',
      to: 'gw-tls',
      label: 'Terminate TLS & Apply WAF',
      type: 'forward',
      flows: ['ingress-routing', 'canary-routing', 'circuit-breaker'],
      path: 'M 307 190 L 307 140'
    },
    {
      id: 'link-tls-auth',
      from: 'gw-tls',
      to: 'gw-auth',
      label: '1. Decrypted Stream & Claims',
      type: 'forward',
      flows: ['ingress-routing', 'canary-routing', 'circuit-breaker'],
      path: 'M 385 97 L 415 97'
    },
    {
      id: 'link-auth-rate',
      from: 'gw-auth',
      to: 'gw-rate-limiter',
      label: '2. Identity Verified (sub, tenant)',
      type: 'forward',
      flows: ['ingress-routing', 'canary-routing', 'circuit-breaker'],
      path: 'M 497 140 L 497 175'
    },
    {
      id: 'link-rate-router',
      from: 'gw-rate-limiter',
      to: 'gw-router',
      label: '3. Token Quota Allowed',
      type: 'forward',
      flows: ['ingress-routing', 'canary-routing', 'circuit-breaker'],
      path: 'M 497 260 L 497 295'
    },
    {
      id: 'link-cp-router',
      from: 'control-plane',
      to: 'gw-router',
      label: 'Stream RouteConfiguration (xDS)',
      type: 'forward',
      flows: ['canary-routing'],
      path: 'M 497 470 L 497 385'
    },
    {
      id: 'link-reg-router',
      from: 'service-registry',
      to: 'gw-router',
      label: 'Endpoint Discovery (EDS)',
      type: 'forward',
      flows: ['ingress-routing', 'canary-routing', 'circuit-breaker'],
      path: 'M 620 97 C 560 97, 560 310, 580 310'
    },
    {
      id: 'link-router-order',
      from: 'gw-router',
      to: 'order-service',
      label: 'Forward /orders (mTLS)',
      type: 'forward',
      flows: ['ingress-routing'],
      path: 'M 580 320 C 700 320, 750 107, 840 107'
    },
    {
      id: 'link-router-user',
      from: 'gw-router',
      to: 'user-service',
      label: 'Forward /users (mTLS)',
      type: 'forward',
      flows: ['canary-routing'],
      path: 'M 580 340 C 700 340, 750 217, 840 217'
    },
    {
      id: 'link-router-pay',
      from: 'gw-router',
      to: 'payment-service',
      label: 'Forward /payments (Idempotent)',
      type: 'forward',
      flows: ['circuit-breaker'],
      path: 'M 580 355 L 840 327'
    },
    {
      id: 'link-gw-otel',
      from: 'gw-router',
      to: 'otel-collector',
      label: 'Async Trace Spans & Metrics',
      type: 'forward',
      flows: ['ingress-routing', 'circuit-breaker'],
      path: 'M 530 385 C 530 450, 570 515, 620 515'
    }
  ],

  // Step-by-Step Request Flows
  flows: [
    {
      id: 'ingress-routing',
      name: '1. North-South Ingress & Authentication Pipeline Flow',
      shortDesc: 'End-to-end traversal from public internet to internal microservice with zero-trust validation and header injection.',
      color: 'emerald',
      steps: [
        {
          step: 1,
          title: 'TCP Handshake & TLS 1.3 Termination',
          source: 'clients',
          target: 'gw-tls',
          desc: 'External client connects over TLS 1.3. L4 NLB forwards TCP packets to Envoy gateway fleet. Envoy terminates SSL certificate in <strong>0.6ms</strong> and checks WAF rules.',
          badge: 'TLS 1.3 Termination',
          highlightNodes: ['clients', 'l4-lb', 'gw-tls'],
          highlightLinks: ['link-client-l4', 'link-l4-tls']
        },
        {
          step: 2,
          title: 'Stateless JWT Verification & Claims Extraction',
          source: 'gw-tls',
          target: 'gw-auth',
          desc: 'Auth filter parses <code>Authorization: Bearer &lt;jwt&gt;</code>. Validates cryptographic signature locally using cached RSA public keys (JWKS) with 0 network calls.',
          badge: 'Cryptographic Auth (<0.4ms)',
          highlightNodes: ['gw-tls', 'gw-auth'],
          highlightLinks: ['link-tls-auth']
        },
        {
          step: 3,
          title: 'Per-Tenant Rate Limit Evaluation',
          source: 'gw-auth',
          target: 'gw-rate-limiter',
          desc: 'Rate limit filter queries in-memory local token bucket (or Redis cluster for tier quotas). Verified caller is within 1,000 req/min quota; request is permitted.',
          badge: 'Quota Granted',
          highlightNodes: ['gw-auth', 'gw-rate-limiter'],
          highlightLinks: ['link-auth-rate']
        },
        {
          step: 4,
          title: 'Header Mutation & Distributed Trace Injection',
          source: 'gw-rate-limiter',
          target: 'gw-router',
          desc: 'Envoy strips public credentials and injects internal headers: <code>X-User-Id: 8842</code>, <code>X-Tenant: enterprise</code>, and W3C <code>traceparent</code>.',
          badge: 'Context Injection',
          highlightNodes: ['gw-rate-limiter', 'gw-router'],
          highlightLinks: ['link-rate-router']
        },
        {
          step: 5,
          title: 'mTLS Dispatch to Healthy Order Service Pod',
          source: 'gw-router',
          target: 'order-service',
          desc: 'Envoy queries local Endpoint Discovery (EDS) table, picks healthy Order Service Pod via Power-of-2-Choices load balancing, and opens mTLS connection.',
          badge: 'mTLS Dispatch (< 2ms)',
          highlightNodes: ['gw-router', 'order-service'],
          highlightLinks: ['link-router-order']
        }
      ]
    },
    {
      id: 'canary-routing',
      name: '2. Canary Deployment & Traffic Shifting Flow (90/10 Split)',
      shortDesc: 'Dynamic zero-downtime routing adjustment controlled via xDS control plane without restarting gateway processes.',
      color: 'blue',
      steps: [
        {
          step: 1,
          title: 'Operator Deploys Canary v2.0 CRD',
          source: 'control-plane',
          target: 'control-plane',
          desc: 'DevOps engineer deploys Kubernetes Canary Ingress specifying: <code>Weight(v1.0)=90%</code> and <code>Weight(v2.0)=10%</code> for User Service.',
          badge: 'Kubernetes CRD Updated',
          highlightNodes: ['control-plane'],
          highlightLinks: []
        },
        {
          step: 2,
          title: 'Control Plane Pushes xDS Delta to Envoy',
          source: 'control-plane',
          target: 'gw-router',
          desc: 'Control Plane (Istio / Contour) streams delta <code>RouteConfiguration</code> over persistent gRPC connection to all Envoy gateway instances.',
          badge: 'Hot xDS Stream Push',
          highlightNodes: ['control-plane', 'gw-router'],
          highlightLinks: ['link-cp-router']
        },
        {
          step: 3,
          title: 'Envoy Hot-Swaps Route Table with Zero Drops',
          source: 'gw-router',
          target: 'gw-router',
          desc: 'Envoy updates internal memory route tables atomically using RCU (Read-Copy-Update) pointers. Existing active TCP connections are never severed.',
          badge: 'Zero-Downtime Swap',
          highlightNodes: ['gw-router'],
          highlightLinks: []
        },
        {
          step: 4,
          title: 'Weighted Dynamic Traffic Split',
          source: 'gw-router',
          target: 'user-service',
          desc: 'Subsequent incoming requests to <code>/api/v1/users</code> are deterministically partitioned: exactly 10% route to Canary v2 pods, 90% to Baseline v1 pods.',
          badge: '90/10 Canary Split',
          highlightNodes: ['gw-router', 'user-service'],
          highlightLinks: ['link-router-user']
        },
        {
          step: 5,
          title: 'Automated Telemetry Comparison & Promotion',
          source: 'user-service',
          target: 'otel-collector',
          desc: 'OpenTelemetry collects error rates and p99 latencies for v1 vs v2. If canary error rate stays < 0.01%, control plane auto-promotes v2 to 100%.',
          badge: 'Continuous Verification',
          highlightNodes: ['user-service', 'otel-collector'],
          highlightLinks: ['link-gw-otel']
        }
      ]
    },
    {
      id: 'circuit-breaker',
      name: '3. Downstream Service Outage & Circuit Breaker Tripping Flow',
      shortDesc: 'Protects gateway thread pool and upstream callers by isolating failing microservices and shedding load gracefully.',
      color: 'rose',
      steps: [
        {
          step: 1,
          title: 'Downstream Payment Outage & 504 Timeouts',
          source: 'payment-service',
          target: 'payment-service',
          desc: 'Payment Service database connection pool exhausts; 80% of calls to <code>/api/v1/payments</code> hang past the 3,000ms deadline.',
          badge: 'Downstream Failure',
          highlightNodes: ['payment-service'],
          highlightLinks: []
        },
        {
          step: 2,
          title: 'Envoy Outlier Detection Tripped',
          source: 'gw-router',
          target: 'payment-service',
          desc: 'Envoy outlier detection tracks 5 consecutive 5xx errors and ejects failing payment pods from the active upstream cluster for 30 seconds.',
          badge: 'Outlier Pod Ejected',
          highlightNodes: ['gw-router', 'payment-service'],
          highlightLinks: ['link-router-pay']
        },
        {
          step: 3,
          title: 'Circuit Breaker Switches to OPEN State',
          source: 'gw-router',
          target: 'gw-router',
          desc: 'Cluster error percentage exceeds 50% threshold. Circuit breaker trips to <strong>OPEN</strong> state, short-circuiting all subsequent payment requests instantly.',
          badge: 'Circuit OPEN (Fail Fast)',
          highlightNodes: ['gw-router'],
          highlightLinks: []
        },
        {
          step: 4,
          title: 'Immediate HTTP 503 / Degraded Fallback Returned',
          source: 'gw-router',
          target: 'clients',
          desc: 'Gateway returns immediate <code>HTTP 503 Service Unavailable</code> with <code>Retry-After: 30</code> in <strong>0.5ms</strong>, preventing client thread starvation.',
          badge: 'Load Shedding Active',
          highlightNodes: ['gw-router', 'clients'],
          highlightLinks: ['link-client-l4']
        },
        {
          step: 5,
          title: 'Half-Open Probe & Automatic Recovery',
          source: 'gw-router',
          target: 'payment-service',
          desc: 'After 30-second sleep window, circuit enters <strong>HALF-OPEN</strong> state, sending 5% canary probe requests. When probes succeed, circuit re-closes.',
          badge: 'Auto-Healing Re-Close',
          highlightNodes: ['gw-router', 'payment-service'],
          highlightLinks: ['link-router-pay']
        }
      ]
    }
  ],

  // Detailed Component Specifications for Inspector Panel
  components: {
    'clients': {
      id: 'clients',
      name: 'External Clients & Upstream Callers',
      tier: 'External Client Tier',
      category: 'Client Tier',
      responsibilities: [
        'Single entry domain (e.g. api.company.com) for Web, iOS, Android, and external B2B partner integrations',
        'Initiate TLS 1.3 encrypted sessions over HTTP/2 or HTTP/3 (QUIC)',
        'Pass standard authentication tokens via <code>Authorization: Bearer &lt;jwt&gt;</code> header',
        'Include idempotency keys on mutating operations (POST /orders, POST /payments)'
      ],
      apis: [
        'GET /api/v1/:service/:resource — Query entity state',
        'POST /api/v1/:service/:resource — Create resource with Idempotency-Key'
      ],
      storage: 'Client-side cookie / secure enclave storage for OAuth2 refresh & access tokens',
      ha: 'Global Anycast DNS routing (Cloudflare / Route 53) steering users to the nearest geographical edge PoP',
      failureModes: [
        'Client-Side Timeout: Client terminates request early while gateway is still processing; mitigated by downstream cancellation propagate headers'
      ],
      tradeoffs: [
        'BFF (Backend-for-Frontend) vs Single Unified API Gateway: BFF tailors responses per client type (Mobile vs Web) at the expense of maintaining multiple gateway fleets'
      ]
    },

    'l4-lb': {
      id: 'l4-lb',
      name: 'L4 Network Load Balancer (NLB / Maglev)',
      tier: 'Edge Ingress Tier',
      category: 'Edge & Ingress',
      responsibilities: [
        'Handle millions of raw TCP connections per second at Layer 4 (Transport Layer)',
        'Distribute incoming TCP SYN packets across healthy Envoy gateway worker nodes using consistent hashing (5-tuple: src_ip, src_port, dst_ip, dst_port, protocol)',
        'Perform zero SSL decryption to achieve maximum packet-per-second hardware throughput',
        'Preserve client source IP addresses via PROXY Protocol v2 headers'
      ],
      apis: [
        'TCP 443 — Public TLS Port pass-through',
        'TCP 80 — Automatic HTTP to HTTPS 301 redirection'
      ],
      storage: 'In-memory connection tracking table (IPVS / eBPF kernel maps)',
      ha: 'Multi-AZ active-active deployment across 3 availability zones with BGP Anycast failover (< 1s)',
      failureModes: [
        'Gateway Pod Descheduling: If an Envoy pod crashes, L4 NLB must cleanly RST existing TCP sockets and steer new connections to surviving pods'
      ],
      tradeoffs: [
        'L4 Load Balancing vs L7 ALB: L4 handles 10x higher QPS per dollar because it bypasses application-layer HTTP parsing and TLS termination'
      ]
    },

    'gw-tls': {
      id: 'gw-tls',
      name: 'TLS 1.3 Termination & Web Application Firewall (WAF)',
      tier: 'Edge Ingress Tier',
      category: 'Security & Auth',
      responsibilities: [
        'Terminate modern TLS 1.3 and TLS 1.2 handshakes using optimized BoringSSL / OpenSSL libraries',
        'Enforce HTTP/2 multiplexing over single TCP connections to reduce client connection latency',
        'Inspect HTTP headers and payload bodies for malicious OWASP Top 10 exploits (SQLi, XSS, Log4j, RCE)',
        'Perform SNI (Server Name Indication) routing to support multi-tenant wildcard certificates (*.api.platform.com)'
      ],
      apis: [
        'TLS ALPN negotiation: h2, http/1.1',
        'ModSecurity / Coraza WAF rule evaluation'
      ],
      storage: 'In-memory SSL session ticket cache and Let\'s Encrypt / Vault automated certificate rotation',
      ha: 'Horizontally autoscaled Envoy workers utilizing hardware AES-NI CPU acceleration for ultra-fast crypto',
      failureModes: [
        'Certificate Expiration: Outdated SSL certs cause global browser security warnings; prevented by automated 30-day ACME cert renewer with alerting'
      ],
      tradeoffs: [
        'Edge TLS Termination vs End-to-End TLS: Terminating at gateway allows deep packet inspection and routing, but requires internal mTLS to protect backend hops'
      ]
    },

    'gw-auth': {
      id: 'gw-auth',
      name: 'Identity & Authentication Engine (JWT & OAuth2)',
      tier: 'Edge Ingress Tier',
      category: 'Security & Auth',
      responsibilities: [
        'Verify JSON Web Token (JWT) cryptographic signatures locally without calling centralized auth databases',
        'Validate standard claims: expiration (<code>exp</code>), audience (<code>aud</code>), and issuer (<code>iss</code>)',
        'Periodically refresh JSON Web Key Sets (JWKS) from Identity Provider (Okta / Auth0 / Keycloak)',
        'Reject unauthenticated or expired requests immediately with <code>HTTP 401 Unauthorized</code>'
      ],
      apis: [
        'GET /.well-known/jwks.json — Periodic key sync',
        'envoy.filters.http.jwt_authn — In-process C++ filter'
      ],
      storage: 'In-memory LRU cache storing public RSA/ECDSA signing keys with 24-hour TTL',
      ha: '100% stateless in-memory verification; zero downstream network dependencies during hot execution path',
      failureModes: [
        'Token Revocation Delay: A compromised JWT remains valid until its <code>exp</code> timestamp; mitigated by short 15-minute token TTLs and Redis revocation denylists'
      ],
      tradeoffs: [
        'Stateless JWT Verification vs Remote OAuth2 Introspection: Local JWT check takes 0.3ms; remote introspection adds 15ms latency per request but allows instant token revocation'
      ]
    },

    'gw-rate-limiter': {
      id: 'gw-rate-limiter',
      name: 'Distributed Rate Limiter & Traffic Shaper',
      tier: 'Edge Ingress Tier',
      category: 'Traffic Policy',
      responsibilities: [
        'Protect backend services from denial-of-service and accidental customer DDoS loops',
        'Enforce tiered rate limits: Tier 1 Free (100 req/min), Tier 2 Pro (5,000 req/min), Enterprise (50,000 req/min)',
        'Apply Token Bucket and Sliding Window algorithms partitioned by API key, User ID, or Client IP',
        'Return standardized <code>HTTP 429 Too Many Requests</code> with <code>Retry-After</code> headers when exhausted'
      ],
      apis: [
        'ratelimit.service.v3.RateLimitService — Envoy gRPC rate limit contract',
        'Redis EVALSHA — Atomic sliding window counter script'
      ],
      storage: 'Centralized Redis cluster (or local in-memory token buckets with gossip synchronization)',
      ha: 'Fails open on Redis outage: if rate limiter service is unreachable, traffic is permitted to avoid blocking legitimate revenue',
      failureModes: [
        'Redis Latency Spike: Rate limiter network call slows gateway; mitigated by local in-memory caching and 5ms timeout fail-open'
      ],
      tradeoffs: [
        'Local In-Memory Rate Limiting vs Centralized Redis: Local is zero-latency but imprecise across 100 gateway pods; Redis is exact but adds ~1ms network hop'
      ]
    },

    'gw-router': {
      id: 'gw-router',
      name: 'Dynamic Reverse Proxy Router (Envoy Core)',
      tier: 'Edge Ingress Tier',
      category: 'Reverse Proxy',
      responsibilities: [
        'Match incoming request path prefix, domain host, HTTP method, and query parameters to upstream clusters',
        'Rewrite paths (e.g. strip <code>/api/v1</code> prefix) and inject downstream identity context headers',
        'Perform advanced traffic steering: Canary 90/10 splits, A/B testing, and blue-green releases',
        'Enforce upstream connection limits, circuit breakers, and bounded request timeouts'
      ],
      apis: [
        'envoy.config.route.v3.RouteConfiguration — Dynamic routing table',
        'HTTP/1.1, HTTP/2, and gRPC reverse proxying'
      ],
      storage: 'In-memory Trie and radix-tree route tables compiled into C++ execution graphs',
      ha: 'Stateless worker threads bound to CPU cores using epoll/kqueue non-blocking event loops',
      failureModes: [
        'Route Configuration Desync: Rogue deployment pushes invalid route syntax; protected by strict xDS schema validation and automated rollback'
      ],
      tradeoffs: [
        'Envoy Proxy vs NGINX / Lua: Envoy features native dynamic gRPC control plane (xDS), built-in observability, and zero reload connection drops'
      ]
    },

    'control-plane': {
      id: 'control-plane',
      name: 'xDS Control Plane (Istio / Contour / Custom Go)',
      tier: 'Control Plane Tier',
      category: 'Control Plane',
      responsibilities: [
        'Translate high-level Kubernetes Ingress and Gateway API CRDs into raw Envoy xDS protocols',
        'Stream dynamic updates over bidirectional gRPC: LDS (Listeners), RDS (Routes), CDS (Clusters), EDS (Endpoints)',
        'Orchestrate progressive canary rollouts and automated traffic shifting',
        'Audit and enforce global security policies across the fleet'
      ],
      apis: [
        'discovery.v3.AggregatedDiscoveryService (ADS) — Bidirectional gRPC stream'
      ],
      storage: 'Etcd / Kubernetes API Server persistent state store',
      ha: 'Multi-replica deployment on Kubernetes with leader election; gateway data plane continues routing even if control plane is down',
      failureModes: [
        'Control Plane Crash: Gateway fleet continues operating flawlessly using cached route configurations; only new deployments are paused'
      ],
      tradeoffs: [
        'Dynamic xDS Control Plane vs Static File Configuration: xDS updates routes in milliseconds without process reloads, but introduces control plane infrastructure complexity'
      ]
    },

    'service-registry': {
      id: 'service-registry',
      name: 'Service Registry (Kubernetes CoreDNS / Consul)',
      tier: 'Internal Services Tier',
      category: 'Service Discovery',
      responsibilities: [
        'Track real-time IP addresses and ports of healthy backend service containers / pods',
        'Perform active health checking (HTTP /healthz, TCP liveness probes) to eject crashed instances',
        'Feed Endpoint Discovery Service (EDS) to Envoy routers within sub-second propagation delay'
      ],
      apis: [
        'k8s.io/api/core/v1/Endpoints — Kubernetes endpoint watch API',
        '/v1/health/service/:service — Consul catalog API'
      ],
      storage: 'Kubernetes etcd memory-backed Raft state store',
      ha: '3-node to 5-node distributed quorum spread across availability zones',
      failureModes: [
        'Split-Brain Discovery: Network partition causes conflicting endpoint tables; resolved by Raft consensus leader election'
      ],
      tradeoffs: [
        'Client-Side Routing (Envoy EDS) vs Server-Side LB (Internal Kube-Proxy): Envoy EDS eliminates internal hop latency and enables rich client-side load balancing algorithms'
      ]
    },

    'order-service': {
      id: 'order-service',
      name: 'Order Microservice Cluster',
      tier: 'Internal Services Tier',
      category: 'Internal Microservice',
      responsibilities: [
        'Execute checkout, order placement, and fulfillment state workflows',
        'Trust injected identity headers (<code>X-User-ID</code>) guaranteed by API gateway boundary',
        'Participate in distributed tracing by forwarding <code>traceparent</code> headers to downstream databases'
      ],
      apis: [
        'POST /orders — Place new customer order',
        'GET /orders/:id — Retrieve order status and shipment details'
      ],
      storage: 'Dedicated PostgreSQL Order Database with Read Replicas',
      ha: 'Autoscaled Kubernetes Horizontal Pod Autoscaler (HPA) targeting 70% CPU utilization',
      failureModes: [
        'Database Lock Contention: Flash sale order volume causes DB row locks; mitigated by Kafka asynchronous order ingestion'
      ],
      tradeoffs: [
        'mTLS Service-to-Service vs Plain HTTP Inside VPC: mTLS prevents lateral movement attacks inside the private subnet at small CPU overhead'
      ]
    },

    'user-service': {
      id: 'user-service',
      name: 'User & Account Microservice Cluster',
      tier: 'Internal Services Tier',
      category: 'Internal Microservice',
      responsibilities: [
        'Manage user profiles, billing addresses, settings, and team memberships',
        'Serve user query lookups with aggressive read caching in distributed Redis',
        'Expose internal endpoints for identity enrichment'
      ],
      apis: [
        'GET /users/:id — Query user profile data',
        'PUT /users/:id — Update user settings'
      ],
      storage: 'PostgreSQL User Database + Redis L2 Cache',
      ha: 'Multi-AZ pod distribution with automatic rolling restart updates',
      failureModes: [
        'Cache Miss Storm: Mass invalidation triggers database spike; protected by SingleFlight mutex'
      ],
      tradeoffs: [
        'Enriching User Data in Gateway vs in Backend Service: Enriching in gateway adds memory overhead; leaving in backend preserves separation of concerns'
      ]
    },

    'payment-service': {
      id: 'payment-service',
      name: 'Payment Microservice (PCI-DSS Enclave)',
      tier: 'Internal Services Tier',
      category: 'Internal Microservice',
      responsibilities: [
        'Interface with credit card payment gateways (Stripe, Adyen, PayPal)',
        'Enforce strict idempotency on all charge operations to guarantee zero duplicate billing',
        'Operate inside isolated PCI-DSS compliant network enclave with zero direct external ingress'
      ],
      apis: [
        'POST /payments/charge — Process payment with Idempotency-Key header'
      ],
      storage: 'Tokenized credit card vault database with hardware security module (HSM) encryption',
      ha: 'Dedicated redundant pods with multi-provider payment gateway failover',
      failureModes: [
        'External Payment Provider Outage: Stripe returns 500s; gateway circuit breaker isolates payment cluster to protect upstream checkout queue'
      ],
      tradeoffs: [
        'Synchronous Charge vs Asynchronous Webhook Payment: Synchronous gives instant feedback but blocks HTTP threads; async is resilient but requires polling/websockets'
      ]
    },

    'otel-collector': {
      id: 'otel-collector',
      name: 'OpenTelemetry & Unified Telemetry Pipeline',
      tier: 'Control Plane Tier',
      category: 'Observability & Logs',
      responsibilities: [
        'Ingest high-volume access logs, distributed trace spans, and Prometheus metric points asynchronously',
        'Aggregate request counts, error rates (4xx, 5xx), and latency histograms (p50, p90, p99)',
        'Correlate end-to-end trace spans from edge gateway through internal microservices using W3C TraceContext',
        'Trigger automated PagerDuty alerts on gateway error spikes or latency budget violations'
      ],
      apis: [
        'OTLP / gRPC port 4317 — OpenTelemetry span ingest',
        '/metrics — Prometheus scrape endpoint'
      ],
      storage: 'ClickHouse / ElasticSearch for logs; Jaeger / Tempo for traces; Prometheus / VictoriaMetrics for metrics',
      ha: 'Stateless collector fleet with Kafka buffer to absorb telemetry bursts during flash spikes',
      failureModes: [
        'Collector Overload: Extreme QPS overwhelms telemetry storage; gateway drops non-critical sample traces (probabilistic trace sampling at 1%)'
      ],
      tradeoffs: [
        '100% Trace Sampling vs Head-Based Probabilistic Sampling: 100% tracing consumes massive disk storage; 1% sampling captures macro performance trends cheaply'
      ]
    }
  },

  // System-level Architectural Trade-offs
  tradeoffs: [
    {
      id: 'to-mesh-vs-gateway',
      decision: 'API Gateway vs. Service Mesh (North-South vs East-West Architecture)',
      optionA: {
        name: 'API Gateway at Edge + Service Mesh Internally (Selected Default)',
        pros: 'Clear separation of concerns: API Gateway manages public edge concerns (TLS, WAF, OAuth2, public rate limits); Service Mesh handles internal mTLS, service discovery, and tracing.',
        cons: 'Operating two distinct proxy tiers increases operational cognitive load and adds ~1ms cumulative network latency.'
      },
      optionB: {
        name: 'Single Unified Ingress Gateway (No Mesh)',
        pros: 'Significantly simpler operational infrastructure; only one set of Envoy proxies to deploy and maintain.',
        cons: 'Lacks mutual TLS (mTLS) encryption and fine-grained authorization between internal microservices behind the gateway.'
      },
      verdict: 'Recommended: Dedicated Edge API Gateway for North-South ingress, layered with lightweight Service Mesh (e.g. Istio Ambient / Linkerd) for zero-trust microservice security.',
      relatedNodes: ['l4-lb', 'gw-router', 'order-service', 'payment-service']
    },
    {
      id: 'to-proxy-engine',
      decision: 'Proxy Engine Selection: Envoy C++ vs NGINX / OpenResty vs Go/Java Gateway',
      optionA: {
        name: 'Envoy C++ Event-Driven Proxy (Selected Default)',
        pros: 'Exceptional throughput and sub-millisecond p99 latency; native support for dynamic gRPC xDS control plane without reload packet drops; battle-tested at Lyft/Google.',
        cons: 'Steeper learning curve; writing custom plugins requires C++ or WebAssembly (WASM).'
      },
      optionB: {
        name: 'NGINX / OpenResty (Lua) or Go (Traefik / KrakenD)',
        pros: 'Simpler configuration syntax; easy to write custom business routing rules in Lua or Go.',
        cons: 'Traditional NGINX requires configuration reloads on upstream changes; Go gateways suffer garbage collection (GC) latency jitter under 500K+ QPS.'
      },
      verdict: 'Recommended: Envoy C++ for modern high-scale cloud-native edge infrastructure with dynamic discovery requirements.',
      relatedNodes: ['gw-tls', 'gw-router', 'control-plane']
    },
    {
      id: 'to-bff',
      decision: 'Single Unified API Gateway vs Backend-for-Frontend (BFF) Pattern',
      optionA: {
        name: 'Unified Gateway with Path-Based Routing (Selected Default)',
        pros: 'Centralized policy enforcement, single point for WAF and rate limiting, lower operational overhead and unified telemetry.',
        cons: 'Risk of gateway team becoming a bottleneck; mobile and web clients receive identical coarse payloads, wasting mobile cellular bandwidth.'
      },
      optionB: {
        name: 'Backend-for-Frontend (BFF) Multi-Gateway Architecture',
        pros: 'Dedicated gateways tailored per client experience (Mobile BFF formats lightweight JSON; Web BFF serves rich hydrated payloads).',
        cons: 'Multiple gateway codebases to maintain, potential drift in security policies and authentication rules.'
      },
      verdict: 'Recommended: Unified Gateway at the edge for security, TLS, and rate limiting; optional lightweight GraphQL / BFF layer behind it for frontend payload tailoring.',
      relatedNodes: ['clients', 'gw-tls', 'gw-router']
    },
    {
      id: 'to-jwt-validation',
      decision: 'Stateless Local JWT Verification vs Centralized OAuth2 Token Introspection',
      optionA: {
        name: 'Stateless Local JWT Verification via JWKS (Selected Default)',
        pros: 'Sub-millisecond verification (< 0.4ms) using local cached public keys. Zero database lookups or network hops on the hot request path.',
        cons: 'Revoking a stolen token immediately is impossible until its expiration timestamp unless maintaining an active revocation blacklist in Redis.'
      },
      optionB: {
        name: 'Remote OAuth2 Token Introspection (RFC 7662)',
        pros: 'Instant token revocation capability; authoritative identity server validates status on every call.',
        cons: 'Every single incoming request incurs a 15–30ms network round-trip to the identity provider, creating a massive bottleneck.'
      },
      verdict: 'Recommended: Stateless Local JWT Verification with short token lifespans (10–15 min) paired with Redis revocation blacklist for emergency session terminations.',
      relatedNodes: ['gw-auth', 'user-service']
    },
    {
      id: 'to-rate-limit-arch',
      decision: 'Rate Limiting Architecture: In-Memory Token Bucket vs Centralized Redis Cluster',
      optionA: {
        name: 'Local In-Memory Token Bucket with Gossip (Selected Default)',
        pros: 'Zero network overhead on every request; impervious to Redis cluster outages; handles microsecond decision loops at 1M req/sec.',
        cons: 'Rate limits are approximate across the 100-pod gateway fleet; slight variations in per-pod traffic distribution.'
      },
      optionB: {
        name: 'Centralized Redis Cluster (Global Exact Rate Limiting)',
        pros: 'Mathematically exact rate limit counting across all nodes globally.',
        cons: 'Adds 1.5ms network hop to every incoming request; Redis cluster failure risks taking down the entire edge gateway tier.'
      },
      verdict: 'Recommended: Local In-Memory Token Bucket for DDOS / IP protection; Centralized Redis only for paid billable API tenant quotas with fail-open safety.',
      relatedNodes: ['gw-rate-limiter', 'gw-router']
    }
  ]
};
