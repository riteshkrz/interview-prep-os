/**
 * Distributed Cache High-Level Architecture (HLD) Data Specification
 * Pure architecture data model separated from presentation.
 * Supports:
 * - Architecture topology (nodes, tiers, links)
 * - Request flows (Cache-Aside Read Flow, Write-Invalidate Flow, Shard Failover & Rebalance Flow)
 * - Detailed component specifications (Responsibilities, APIs, Storage, Trade-offs, Failure modes)
 * - System-level architectural trade-offs
 */

export const DISTRIBUTED_CACHE_HLD_DATA = {
  lessonId: 'distributed-cache',
  title: 'Distributed In-Memory Cache High-Level Architecture',
  systemName: 'Horizontally Scalable Distributed Cache with Consistent Hashing & Sharded Replication',
  scaleMetrics: {
    monthlyCreates: '500 GB active working set',
    avgWriteRps: '~50,000 writes/sec',
    peakWriteRps: '~150,000 writes/sec',
    monthlyRedirects: '15 Billion ops/mo',
    avgReadRps: '~250,000 reads/sec',
    peakReadRps: '~500,000 reads/sec',
    targetRedirectLatency: '< 1 ms (P99 Hit) / < 15 ms (DB Fallback)',
    storagePerYear: '1 TB across 8 primary shards + replicas'
  },

  scaleMetricsList: [
    { label: 'Cluster Throughput', value: '500,000 ops / sec', color: 'blue' },
    { label: 'Working Set in RAM', value: '500 GB Active Data', color: 'cyan' },
    { label: 'Read Latency SLA', value: '< 1ms P99 (Cache Hit)', color: 'emerald' },
    { label: 'Partitioning Scheme', value: 'Consistent Hashing (256 V-Nodes)', color: 'indigo' },
    { label: 'Eviction Strategy', value: 'LRU / LFU + TTL Jitter', color: 'amber' }
  ],

  // Tier boundaries for the SVG Canvas (viewBox 0 0 1100 680)
  tierBoxes: [
    { x: 210, y: 30, w: 380, h: 390, textX: 225, textY: 55, title: 'ROUTING & CLUSTER COORDINATION TIER', color: 'indigo' },
    { x: 605, y: 30, w: 440, h: 400, textX: 620, textY: 55, title: 'SHARDED IN-MEMORY STORAGE TIER (PRIMARY + REPLICAS)', color: 'blue' },
    { x: 210, y: 440, w: 835, h: 225, textX: 225, textY: 465, title: 'PERSISTENCE & STAMPEDE DEFENSE (DB, CDC & MUTEX LOCKS)', color: 'amber' }
  ],

  // Architectural Tiers for grouping
  tiers: [
    { id: 'client-tier', name: 'Application Client Tier', color: 'slate' },
    { id: 'routing-tier', name: 'Consistent Hash Router & Coordination Tier', color: 'indigo' },
    { id: 'storage-tier', name: 'In-Memory Sharded Cache Cluster', color: 'emerald' },
    { id: 'persistence-tier', name: 'Authoritative Storage & Invalidation Pipeline', color: 'amber' }
  ],

  // Interactive Nodes on the SVG Canvas (viewBox 0 0 1100 680)
  nodes: [
    {
      id: 'app-servers',
      label: 'App Instances & Microservices',
      sublabel: 'Web Tiers • API Workers • Checkouts',
      tier: 'client-tier',
      tierLabel: 'Cache Clients',
      category: 'Client Tier',
      icon: 'devices',
      x: 40,
      y: 190,
      width: 150,
      height: 90,
      badge: 'Clients / Workers',
      color: 'slate'
    },
    {
      id: 'cache-router',
      label: 'Consistent Hash Router',
      sublabel: 'Ketama Ring • Virtual Nodes (V-Nodes)',
      tier: 'routing-tier',
      tierLabel: 'Router / Client Lib',
      category: 'Routing & Discovery',
      icon: 'hub',
      x: 230,
      y: 190,
      width: 160,
      height: 90,
      badge: 'Hash Ring Locator',
      color: 'indigo'
    },
    {
      id: 'cluster-coordinator',
      label: 'Cluster Coordinator (ZooKeeper)',
      sublabel: 'Heartbeats • Health Monitor • Gossip',
      tier: 'routing-tier',
      tierLabel: 'Discovery & Topology',
      category: 'Routing & Discovery',
      icon: 'groups',
      x: 230,
      y: 55,
      width: 160,
      height: 85,
      badge: 'Topology Registry',
      color: 'cyan'
    },
    {
      id: 'mutex-lock',
      label: 'Stampede Guard (SingleFlight)',
      sublabel: 'Distributed Mutex • Request Coalescing',
      tier: 'routing-tier',
      tierLabel: 'Stampede Shield',
      category: 'Routing & Discovery',
      icon: 'lock',
      x: 415,
      y: 190,
      width: 165,
      height: 95,
      badge: 'Thundering Herd Shield',
      color: 'amber'
    },
    {
      id: 'shard-1-primary',
      label: 'Shard 1 Primary (In-RAM)',
      sublabel: 'Slot [0 - 5460] • LRU Eviction',
      tier: 'storage-tier',
      tierLabel: 'Memory Shard 1',
      category: 'In-Memory Compute',
      icon: 'memory',
      x: 620,
      y: 65,
      width: 180,
      height: 85,
      badge: 'Shard 1 Primary',
      color: 'emerald'
    },
    {
      id: 'shard-1-replica',
      label: 'Shard 1 Read Replica',
      sublabel: 'Async Replication • Warm Standby',
      tier: 'storage-tier',
      tierLabel: 'Memory Shard 1',
      category: 'In-Memory Compute',
      icon: 'storage',
      x: 830,
      y: 65,
      width: 180,
      height: 85,
      badge: 'Read Replica',
      color: 'teal'
    },
    {
      id: 'shard-2-primary',
      label: 'Shard 2 Primary (In-RAM)',
      sublabel: 'Slot [5461 - 10922] • Hot Key Defense',
      tier: 'storage-tier',
      tierLabel: 'Memory Shard 2',
      category: 'In-Memory Compute',
      icon: 'memory',
      x: 620,
      y: 175,
      width: 180,
      height: 85,
      badge: 'Shard 2 Primary',
      color: 'emerald'
    },
    {
      id: 'shard-2-replica',
      label: 'Shard 2 Read Replica',
      sublabel: 'Async Replication • Read Scaling',
      tier: 'storage-tier',
      tierLabel: 'Memory Shard 2',
      category: 'In-Memory Compute',
      icon: 'storage',
      x: 830,
      y: 175,
      width: 180,
      height: 85,
      badge: 'Read Replica',
      color: 'teal'
    },
    {
      id: 'shard-3-primary',
      label: 'Shard 3 Primary (In-RAM)',
      sublabel: 'Slot [10923 - 16383] • LRU Memory Pool',
      tier: 'storage-tier',
      tierLabel: 'Memory Shard 3',
      category: 'In-Memory Compute',
      icon: 'memory',
      x: 620,
      y: 285,
      width: 180,
      height: 85,
      badge: 'Shard 3 Primary',
      color: 'emerald'
    },
    {
      id: 'shard-3-replica',
      label: 'Shard 3 Read Replica',
      sublabel: 'Async Replication • Hot Spare',
      tier: 'storage-tier',
      tierLabel: 'Memory Shard 3',
      category: 'In-Memory Compute',
      icon: 'storage',
      x: 830,
      y: 285,
      width: 180,
      height: 85,
      badge: 'Read Replica',
      color: 'teal'
    },
    {
      id: 'authoritative-db',
      label: 'Authoritative DB (Postgres)',
      sublabel: 'Durable Disk Storage • System of Record',
      tier: 'persistence-tier',
      tierLabel: 'Durable Storage',
      category: 'Persistence Tier',
      icon: 'database',
      x: 620,
      y: 470,
      width: 180,
      height: 95,
      badge: 'Authoritative Truth',
      color: 'violet'
    },
    {
      id: 'cdc-invalidator',
      label: 'CDC Invalidator (Debezium)',
      sublabel: 'WAL Tailer • Kafka Eviction Bus',
      tier: 'persistence-tier',
      tierLabel: 'Event Invalidation',
      category: 'Persistence Tier',
      icon: 'sync_problem',
      x: 415,
      y: 470,
      width: 165,
      height: 95,
      badge: 'Async Invalidation',
      color: 'rose'
    }
  ],

  // Directed links between nodes
  links: [
    {
      id: 'link-app-router',
      from: 'app-servers',
      to: 'cache-router',
      label: 'GET / SET (Key)',
      type: 'forward',
      flows: ['cache-aside', 'write-invalidation', 'shard-failover'],
      path: 'M 190 235 L 230 235'
    },
    {
      id: 'link-coord-router',
      from: 'cluster-coordinator',
      to: 'cache-router',
      label: 'Sync Ring Topologies',
      type: 'bidirectional',
      flows: ['shard-failover'],
      path: 'M 310 140 L 310 190'
    },
    {
      id: 'link-router-mutex',
      from: 'cache-router',
      to: 'mutex-lock',
      label: '1. Check Miss & Acquire Lock',
      type: 'forward',
      flows: ['cache-aside'],
      path: 'M 390 235 L 415 235'
    },
    {
      id: 'link-router-s1',
      from: 'cache-router',
      to: 'shard-1-primary',
      label: 'Slot 0-5460 Fast Hit',
      type: 'bidirectional',
      flows: ['cache-aside'],
      path: 'M 380 205 C 450 150, 520 107, 620 107'
    },
    {
      id: 'link-router-s2',
      from: 'cache-router',
      to: 'shard-2-primary',
      label: 'Slot 5461-10922 Hit',
      type: 'bidirectional',
      flows: ['cache-aside', 'write-invalidation', 'shard-failover'],
      path: 'M 390 220 L 620 220'
    },
    {
      id: 'link-router-s3',
      from: 'cache-router',
      to: 'shard-3-primary',
      label: 'Slot 10923-16383 Hit',
      type: 'bidirectional',
      flows: ['cache-aside'],
      path: 'M 380 255 C 450 300, 520 327, 620 327'
    },
    {
      id: 'link-s1-repl',
      from: 'shard-1-primary',
      to: 'shard-1-replica',
      label: 'Async Stream',
      type: 'forward',
      flows: [],
      path: 'M 800 107 L 830 107'
    },
    {
      id: 'link-s2-repl',
      from: 'shard-2-primary',
      to: 'shard-2-replica',
      label: 'Async Stream / Promotion',
      type: 'bidirectional',
      flows: ['shard-failover'],
      path: 'M 800 217 L 830 217'
    },
    {
      id: 'link-s3-repl',
      from: 'shard-3-primary',
      to: 'shard-3-replica',
      label: 'Async Stream',
      type: 'forward',
      flows: [],
      path: 'M 800 327 L 830 327'
    },
    {
      id: 'link-mutex-db',
      from: 'mutex-lock',
      to: 'authoritative-db',
      label: '2. Fetch Authoritative Record',
      type: 'forward',
      flows: ['cache-aside'],
      path: 'M 497 285 C 497 400, 550 515, 620 515'
    },
    {
      id: 'link-db-cdc',
      from: 'authoritative-db',
      to: 'cdc-invalidator',
      label: 'WAL Transaction Log Stream',
      type: 'forward',
      flows: ['write-invalidation'],
      path: 'M 620 515 L 580 515'
    },
    {
      id: 'link-cdc-router',
      from: 'cdc-invalidator',
      to: 'cache-router',
      label: 'Broadcast Cache Evict (DEL key)',
      type: 'forward',
      flows: ['write-invalidation'],
      path: 'M 497 470 C 497 380, 360 360, 310 280'
    }
  ],

  // Step-by-Step Request Flows
  flows: [
    {
      id: 'cache-aside',
      name: '1. Cache-Aside Read Flow (Hit vs. Miss with Stampede Defense)',
      shortDesc: 'Sub-millisecond fast-path reads on hit; single-flight distributed mutex prevents stampedes on miss.',
      color: 'emerald',
      steps: [
        {
          step: 1,
          title: 'App Issues Read Request',
          source: 'app-servers',
          target: 'cache-router',
          desc: 'App client initiates <code>GET /user/profile/8842</code>. The local Cache Router computes <code>MurmurHash3(key) % 16384</code> to locate shard slot.',
          badge: 'Consistent Hash Lookup',
          highlightNodes: ['app-servers', 'cache-router'],
          highlightLinks: ['link-app-router']
        },
        {
          step: 2,
          title: 'Direct Query to Primary Shard',
          source: 'cache-router',
          target: 'shard-2-primary',
          desc: 'Router dispatches TCP packet to Shard 2 Primary. If cached, Shard 2 returns the in-memory serialized payload in <strong>0.8ms</strong> (Fast Path).',
          badge: 'Fast Path Hit (< 1ms)',
          highlightNodes: ['cache-router', 'shard-2-primary'],
          highlightLinks: ['link-router-s2']
        },
        {
          step: 3,
          title: 'Cache Miss & Stampede Mutex Acquisition',
          source: 'cache-router',
          target: 'mutex-lock',
          desc: 'On cache miss, concurrent workers execute <code>SingleFlight.Do(key)</code>. Only 1 worker acquires the mutex lock; all other requests await completion.',
          badge: 'Thundering Herd Protection',
          highlightNodes: ['cache-router', 'mutex-lock'],
          highlightLinks: ['link-router-mutex']
        },
        {
          step: 4,
          title: 'Authoritative DB Query',
          source: 'mutex-lock',
          target: 'authoritative-db',
          desc: 'The single winning worker queries PostgreSQL with indexed <code>SELECT * FROM users WHERE id = 8842</code> (takes ~8ms).',
          badge: 'Authoritative DB Read',
          highlightNodes: ['mutex-lock', 'authoritative-db'],
          highlightLinks: ['link-mutex-db']
        },
        {
          step: 5,
          title: 'Cache Population with TTL Jitter',
          source: 'authoritative-db',
          target: 'shard-2-primary',
          desc: 'Worker writes payload to Shard 2 with randomized TTL: <code>TTL = Base(3600s) + Jitter(rand(0, 300s))</code> to avoid synchronized bulk expirations.',
          badge: 'Cache Warm + Jitter',
          highlightNodes: ['shard-2-primary', 'authoritative-db'],
          highlightLinks: ['link-router-s2']
        }
      ]
    },
    {
      id: 'write-invalidation',
      name: '2. Write-Through / Write-Invalidate Flow with CDC Stream',
      shortDesc: 'Guarantees eventual consistency between database source of truth and distributed cache memory via WAL tailing.',
      color: 'blue',
      steps: [
        {
          step: 1,
          title: 'Authoritative Mutation Committed',
          source: 'app-servers',
          target: 'authoritative-db',
          desc: 'App server updates user status via transaction: <code>UPDATE users SET tier="vip" WHERE id=8842</code> committed to PostgreSQL WAL.',
          badge: 'Durable Commit',
          highlightNodes: ['app-servers', 'authoritative-db'],
          highlightLinks: ['link-app-router']
        },
        {
          step: 2,
          title: 'CDC Engine Captures Transaction Log',
          source: 'authoritative-db',
          target: 'cdc-invalidator',
          desc: 'Debezium tails the PostgreSQL Write-Ahead Log (WAL) with zero overhead on the query engine and emits an update event to Kafka.',
          badge: 'Zero-Lag CDC Capture',
          highlightNodes: ['authoritative-db', 'cdc-invalidator'],
          highlightLinks: ['link-db-cdc']
        },
        {
          step: 3,
          title: 'Broadcast Eviction Event',
          source: 'cdc-invalidator',
          target: 'cache-router',
          desc: 'CDC consumer reads Kafka topic and dispatches <code>DEL user:profile:8842</code> to the cache cluster router.',
          badge: 'Kafka Eviction Bus',
          highlightNodes: ['cdc-invalidator', 'cache-router'],
          highlightLinks: ['link-cdc-router']
        },
        {
          step: 4,
          title: 'Cache Invalidation Executed',
          source: 'cache-router',
          target: 'shard-2-primary',
          desc: 'Shard 2 deletes or marks key as expired. Subsequent reads will reload fresh data from the authoritative DB, preventing stale reads.',
          badge: 'Stale Key Eliminated',
          highlightNodes: ['cache-router', 'shard-2-primary'],
          highlightLinks: ['link-router-s2']
        }
      ]
    },
    {
      id: 'shard-failover',
      name: '3. Node Failure, Consistent Hash Rebalancing & Replica Promotion Flow',
      shortDesc: 'Automated failover of dead cache nodes with zero data loss on reads and localized key redistribution.',
      color: 'rose',
      steps: [
        {
          step: 1,
          title: 'Primary Shard Hardware Crash',
          source: 'shard-2-primary',
          target: 'shard-2-primary',
          desc: 'Shard 2 Primary node suffers sudden OOM kill or network partition, severing active TCP socket connections.',
          badge: 'Node Crash Detected',
          highlightNodes: ['shard-2-primary'],
          highlightLinks: []
        },
        {
          step: 2,
          title: 'Heartbeat Failure & Quorum Consensus',
          source: 'cluster-coordinator',
          target: 'shard-2-primary',
          desc: 'ZooKeeper / Gossip peers miss 3 consecutive heartbeat pings (> 3 seconds). Quorum consensus declares Shard 2 Primary dead.',
          badge: 'Failure Quorum Reached',
          highlightNodes: ['cluster-coordinator', 'shard-2-primary'],
          highlightLinks: []
        },
        {
          step: 3,
          title: 'Replica Promoted to New Primary',
          source: 'shard-2-replica',
          target: 'shard-2-replica',
          desc: 'Cluster coordinator issues promotion command: <code>REPLICAOF NO ONE</code>. Shard 2 Replica assumes Primary write duties instantly.',
          badge: 'Auto-Promotion',
          highlightNodes: ['shard-2-replica'],
          highlightLinks: ['link-s2-repl']
        },
        {
          step: 4,
          title: 'Consistent Hash Ring Topology Update',
          source: 'cluster-coordinator',
          target: 'cache-router',
          desc: 'ZooKeeper broadcasts updated node IP mapping. Only keys mapped to the failed node are reassigned; remaining 87.5% of keys remain untouched.',
          badge: 'Minimal Churn Rebalance',
          highlightNodes: ['cluster-coordinator', 'cache-router'],
          highlightLinks: ['link-coord-router']
        },
        {
          step: 5,
          title: 'Traffic Re-Routed with Zero Downtime',
          source: 'cache-router',
          target: 'shard-2-replica',
          desc: 'Cache routers seamlessly direct new traffic to the newly promoted primary node. Background task provisions a new standby replica.',
          badge: 'Full Recovery Complete',
          highlightNodes: ['cache-router', 'shard-2-replica'],
          highlightLinks: ['link-router-s2']
        }
      ]
    }
  ],

  // Detailed Component Specifications for Inspector Panel
  components: {
    'app-servers': {
      id: 'app-servers',
      name: 'App Instances & Microservices',
      tier: 'Application Client Tier',
      category: 'Compute Clients',
      responsibilities: [
        'Execute core business logic across checkout, auth, and user catalog services',
        'Leverage smart cache client library to access in-memory data with sub-millisecond latency',
        'Implement Cache-Aside read/write pattern with fallback to authoritative database',
        'Handle cache degradation gracefully by serving stale data or degraded UI instead of cascading failures'
      ],
      apis: [
        'GET /api/v1/resource/:id — Read resource from cache or DB',
        'POST /api/v1/resource — Commit write to database and invalidate cache'
      ],
      storage: 'Stateless application memory; connection pools to cache router and primary database',
      ha: 'Horizontal autoscaling behind AWS ALB / Envoy ingress; pods distributed across multiple availability zones',
      failureModes: [
        'Cache Client Disconnect: Falls back to direct database queries; must apply rate limiter to avoid DB overload',
        'Connection Pool Exhaustion: Occurs if cache read latency degrades from 1ms to >50ms during network partitions'
      ],
      tradeoffs: [
        'Thick Client SDK vs Thin Proxy: Thick client removes network hop latency but requires updating client libraries across all microservice languages'
      ]
    },

    'cache-router': {
      id: 'cache-router',
      name: 'Consistent Hash Router (Ketama Algorithm)',
      tier: 'Routing & Coordination Tier',
      category: 'Hash Ring Locator',
      responsibilities: [
        'Map arbitrary cache keys (strings/blobs) to deterministic 32-bit integer positions on consistent hash ring',
        'Maintain 100–256 virtual nodes (V-nodes) per physical machine to ensure uniform distribution of data',
        'Perform binary search on sorted token ring (O(log N)) to find immediate successor node for any key',
        'Cache cluster topology locally and subscribe to ZooKeeper change events for instant ring updates'
      ],
      apis: [
        'locateNode(key: string) -> NodeEndpoint (IP:Port)',
        'getMultiNodes(keys: string[]) -> Map<NodeEndpoint, string[]>'
      ],
      storage: 'In-memory Red-Black tree / binary array storing sorted 32-bit hashes for 2,048 virtual nodes (~64 KB RAM)',
      ha: 'Embedded directly into application SDK as zero-overhead library; completely stateless and replicated in every process',
      failureModes: [
        'Stale Topology Ring: If ZooKeeper notification is delayed, router may send requests to dead primary; mitigated by immediate socket retry on next replica',
        'Hot Key Imbalance: A single viral celebrity profile key (e.g. key="user:999999") routes to 1 shard regardless of v-nodes; requires local L1 in-process caching'
      ],
      tradeoffs: [
        'MD5 / Murmur3 Hashing vs CRC32: Murmur3 provides superior uniform distribution across ring with negligible CPU cost compared to cryptographic SHA-256'
      ]
    },

    'cluster-coordinator': {
      id: 'cluster-coordinator',
      name: 'Cluster Coordinator (ZooKeeper / Consul)',
      tier: 'Routing & Coordination Tier',
      category: 'Consensus & Discovery',
      responsibilities: [
        'Maintain authoritative cluster topology, shard slots, and primary-replica assignments',
        'Monitor heartbeats and ephemerally register active cache shard nodes',
        'Execute Raft/ZAB consensus protocol to orchestrate primary failovers without split-brain risk',
        'Broadcast ring state changes to all connected client routers via persistent push watchers'
      ],
      apis: [
        '/cache/cluster/nodes — Tree of active node endpoints',
        '/cache/cluster/shards/:id/leader — Ephemeral znode holding primary master'
      ],
      storage: 'Persistent commit log on SSD with in-memory hierarchical znode directory (< 100 MB)',
      ha: '3-node or 5-node distributed quorum spread across 3 availability zones; tolerates (N-1)/2 node failures',
      failureModes: [
        'ZooKeeper Quorum Loss: If 2 of 3 nodes crash, ring updates freeze; existing cache nodes continue serving traffic using cached topology',
        'False Failure Detection: High GC pause on primary shard triggers premature failover; mitigated by 3-second heartbeat debounce window'
      ],
      tradeoffs: [
        'Centralized Coordinator (ZooKeeper) vs Peer-to-Peer Gossip (Redis Cluster): Gossip requires no extra infrastructure but converges slower (5–10s vs 1s)'
      ]
    },

    'mutex-lock': {
      id: 'mutex-lock',
      name: 'Stampede Guard (SingleFlight & Distributed Mutex)',
      tier: 'Routing & Coordination Tier',
      category: 'Concurrency Control',
      responsibilities: [
        'Intercept cache misses for identical keys across concurrent web requests (Thundering Herd / Cache Stampede)',
        'Ensure only 1 worker issues the expensive SQL query to the authoritative database',
        'Coalesce all other concurrent requests to wait on the single in-flight Promise / Mutex',
        'Broadcast the fetched result to all awaiting clients simultaneously upon completion'
      ],
      apis: [
        'SingleFlight.Do(key, fetchFunc) -> (interface{}, error)',
        'Redis.SETNX(lock_key, token, PX=5000) -> Boolean'
      ],
      storage: 'In-process synchronization table (Go SingleFlight channel map) or ephemeral Redis distributed lock',
      ha: 'Local in-process mutexes require zero network overhead; distributed locks use Redis Redlock across quorum',
      failureModes: [
        'Worker Crash While Holding Lock: Awaiting requests could hang; mitigated by hard 5000ms execution timeout and lock expiration',
        'Database Query Latency Spike: Causes worker thread backlog; mitigated by circuit breaker and fallback stale cache serve'
      ],
      tradeoffs: [
        'SingleFlight Mutex vs Probabilistic Early Expiration (XFetch): XFetch refreshes hot keys before they expire asynchronously, eliminating read wait entirely'
      ]
    },

    'shard-1-primary': {
      id: 'shard-1-primary',
      name: 'Shard 1 Primary Node (In-Memory Engine)',
      tier: 'In-Memory Sharded Storage Tier',
      category: 'In-Memory Compute',
      responsibilities: [
        'Store and serve active key-value entries mapped to Hash Slot Range [0 – 5460]',
        'Execute atomic in-memory read and write primitives: GET, SET, INCR, HSET, DEL',
        'Enforce memory cap (e.g. 64 GB RAM per node) using exact LRU (Least Recently Used) doubly linked list',
        'Asynchronously stream replication write log (AOF/replication backlog) to connected read replicas'
      ],
      apis: [
        'GET key -> byte[]',
        'SET key value [EX seconds] -> OK',
        'DEL key -> Integer'
      ],
      storage: '64 GB High-Speed DDR5 RAM with jemalloc allocator; optional RDB snapshotting to NVMe SSD',
      ha: 'Paired with 1–2 dedicated read replicas; automated failover orchestrated via cluster coordinator',
      failureModes: [
        'Out-Of-Memory (OOM): Memory fills before eviction can keep pace; mitigated by aggressive <code>maxmemory-policy allkeys-lru</code>',
        'Single-Threaded Head-of-Line Blocking: Heavy <code>KEYS *</code> or large blob deserialization blocks event loop; forbidden by linting rules'
      ],
      tradeoffs: [
        'LRU vs LFU: LRU reclaims keys based on recency; LFU retains frequently accessed keys even if idle for short bursts, ideal for long-tail catalogs'
      ]
    },

    'shard-1-replica': {
      id: 'shard-1-replica',
      name: 'Shard 1 Read Replica Node',
      tier: 'In-Memory Sharded Storage Tier',
      category: 'In-Memory Compute',
      responsibilities: [
        'Maintain exact replica of Shard 1 Primary by continuously consuming replication stream',
        'Serve read-only queries (GET) for read-heavy workloads to scale cluster throughput',
        'Serve as immediate zero-data-loss failover target if Shard 1 Primary crashes'
      ],
      apis: [
        'REPLICAOF primary_ip primary_port — Initiate replication sync',
        'GET key -> byte[]'
      ],
      storage: '64 GB RAM mirroring primary memory working set',
      ha: 'Deployed in an alternate Availability Zone (AZ) from Shard 1 Primary for disaster resilience',
      failureModes: [
        'Replication Lag: Under extreme write burst, replica may return slightly stale values (acceptable in cache-aside model)',
        'Full Resynchronization Storm: Replica disconnect forces primary to fork and dump full RDB to disk, spiking CPU'
      ],
      tradeoffs: [
        'Synchronous vs Asynchronous Replication: Asynchronous replication preserves sub-millisecond write latency at the cost of potential microsecond data loss during hard power cut'
      ]
    },

    'shard-2-primary': {
      id: 'shard-2-primary',
      name: 'Shard 2 Primary Node (In-Memory Engine)',
      tier: 'In-Memory Sharded Storage Tier',
      category: 'In-Memory Compute',
      responsibilities: [
        'Store and serve active key-value entries mapped to Hash Slot Range [5461 – 10922]',
        'Handle viral celebrity profile keys using sub-key salt partitioning (e.g. user:8842:salt_1..N)',
        'Enforce memory ceiling with constant-time O(1) hash map and doubly linked list eviction pointers',
        'Stream write operations to Shard 2 Replica continuously'
      ],
      apis: [
        'GET key -> byte[]',
        'SET key value [EX seconds] -> OK'
      ],
      storage: '64 GB High-Speed DDR5 RAM',
      ha: 'Auto-promoted by coordinator within 2 seconds upon hardware outage',
      failureModes: [
        'Network Partition: Shard becomes isolated from coordinator; automatically blocks writes to prevent split-brain writes'
      ],
      tradeoffs: [
        'In-Memory Only vs Disk Persistence (RDB/AOF): Pure in-memory achieves max IOPS; AOF provides crash recovery durability but adds disk fsync jitter'
      ]
    },

    'shard-2-replica': {
      id: 'shard-2-replica',
      name: 'Shard 2 Read Replica Node',
      tier: 'In-Memory Sharded Storage Tier',
      category: 'In-Memory Compute',
      responsibilities: [
        'Provide read capacity offloading for Shard 2 keys',
        'Act as warm standby ready for instant promotion upon failure of Shard 2 Primary',
        'Maintain persistent connection to Primary replication backlog offset'
      ],
      apis: [
        'GET key -> byte[]',
        'REPLICAOF NO ONE — Promote to primary'
      ],
      storage: '64 GB RAM mirroring primary memory working set',
      ha: 'Cross-AZ placement ensures tolerance against complete data center loss',
      failureModes: [
        'Stale Reads: If primary write rate exceeds replica ingestion rate, replica lag increases'
      ],
      tradeoffs: [
        'Dedicated Replicas vs Cross-Shard Placement: Dedicated replicas simplify topology but require 100% hardware redundancy'
      ]
    },

    'shard-3-primary': {
      id: 'shard-3-primary',
      name: 'Shard 3 Primary Node (In-Memory Engine)',
      tier: 'In-Memory Sharded Storage Tier',
      category: 'In-Memory Compute',
      responsibilities: [
        'Store and serve active key-value entries mapped to Hash Slot Range [10923 – 16383]',
        'Manage high-volume session and authorization tokens with strict TTL expiration',
        'Execute passive expiration on access and active background sampling expiration (10 times/sec)'
      ],
      apis: [
        'GET key -> byte[]',
        'SET key value [EX seconds] -> OK'
      ],
      storage: '64 GB High-Speed DDR5 RAM',
      ha: 'Monitored continuously via TCP heartbeat pings from cluster coordinator',
      failureModes: [
        'TTL Expiration Cascade: Thousands of keys expiring at the exact same second spike CPU during eviction sweep'
      ],
      tradeoffs: [
        'Active vs Passive Expiration: Passive eviction on read is O(1) but wastes RAM for abandoned keys; active sweep reclaims memory at small CPU cost'
      ]
    },

    'shard-3-replica': {
      id: 'shard-3-replica',
      name: 'Shard 3 Read Replica Node',
      tier: 'In-Memory Sharded Storage Tier',
      category: 'In-Memory Compute',
      responsibilities: [
        'Mirror Shard 3 primary in-memory state',
        'Handle read queries during marketing flash sale events',
        'Enable online zero-downtime rolling upgrades and kernel patches'
      ],
      apis: [
        'GET key -> byte[]'
      ],
      storage: '64 GB High-Speed DDR5 RAM',
      ha: 'Isolated power, rack, and network switch infrastructure',
      failureModes: [
        'Buffer Overflow: Replication output buffer overflow disconnects replica if primary write rate exceeds network interface capacity'
      ],
      tradeoffs: [
        'Read Replicas vs Shard Splitting: For read-heavy loads, replicas are cheaper; for write-heavy loads, splitting into smaller shards is mandatory'
      ]
    },

    'authoritative-db': {
      id: 'authoritative-db',
      name: 'Authoritative Database (PostgreSQL / Aurora)',
      tier: 'Authoritative Persistence Tier',
      category: 'System of Record',
      responsibilities: [
        'Serve as ACID-compliant durable system of record for all persistent business entities',
        'Satisfy cache miss lookups safely with indexed B-Tree queries',
        'Commit updates to Write-Ahead Log (WAL) to trigger event-driven cache invalidation',
        'Survive complete cache cluster failure without permanent data loss'
      ],
      apis: [
        'SELECT * FROM table WHERE id = $1',
        'UPDATE table SET data = $1 WHERE id = $2'
      ],
      storage: 'Multi-terabyte NVMe SSD storage with synchronous multi-AZ storage replication (AWS Aurora)',
      ha: 'Automated primary-replica failover (< 30s) with read replicas scaling query capacity',
      failureModes: [
        'Cache Penetration / Stampede Overload: When cache hit ratio drops below 90%, DB connection pool saturates within seconds; protected by SingleFlight mutex and rate limiting',
        'Slow Query Blockage: Unindexed query hogs DB thread pool; enforced by statement timeouts'
      ],
      tradeoffs: [
        'Write-Through to DB vs Write-Behind (Write-Back): Write-Through ensures 100% durable consistency; Write-Behind buffers writes in RAM for massive write throughput but risks data loss on sudden power cutoff'
      ]
    },

    'cdc-invalidator': {
      id: 'cdc-invalidator',
      name: 'CDC Invalidation Engine (Debezium / Kafka)',
      tier: 'Authoritative Persistence Tier',
      category: 'Event Invalidation',
      responsibilities: [
        'Continuously tail PostgreSQL Write-Ahead Log (WAL) using logical decoding replication slots',
        'Parse modified rows, extract affected primary keys, and serialize into lightweight invalidation events',
        'Publish invalidation events to dedicated Kafka topic (<code>cache-invalidations</code>) with partition key = hash(cache_key)',
        'Dispatch <code>DEL key</code> commands to Cache Routers to eliminate stale cached data across the fleet'
      ],
      apis: [
        'Kafka Producer: Produce(topic="cache-invalidations", key=entity_id, value={action: "DELETE"})'
      ],
      storage: 'Kafka broker commit logs with 24-hour retention buffer for replay and consumer lag tracking',
      ha: 'Debezium deployed on Kubernetes with automated leader re-election; Kafka cluster distributed across 3 AZs',
      failureModes: [
        'CDC Ingestion Lag: If Kafka consumer falls behind, cache retains stale values for several seconds; monitored by consumer lag metrics and Datadog alarms',
        'Duplicate Invalidation Events: Safe because cache deletion (<code>DEL key</code>) is inherently idempotent'
      ],
      tradeoffs: [
        'Application-Level Dual Writes vs CDC Log Tailing: Dual writes (App writes to DB then deletes cache) suffer race conditions and partial failure; CDC guarantees that every committed DB write triggers invalidation'
      ]
    }
  },

  // System-level Architectural Trade-offs
  tradeoffs: [
    {
      id: 'to-partitioning',
      decision: 'Consistent Hashing with Virtual Nodes vs Centralized Proxy Router',
      optionA: {
        name: 'Consistent Hashing + V-Nodes (Selected Default)',
        pros: 'Uniform key distribution with zero extra network hops (direct client-to-shard routing). Adding or removing a node only migrates K/N keys without cluster flushes.',
        cons: 'Every application client library must embed the hashing algorithm and listen to ZooKeeper cluster topology events.'
      },
      optionB: {
        name: 'Centralized Proxy Router (e.g., Twemproxy / Envoy)',
        pros: 'Application clients remain simple and lightweight across polyglot languages.',
        cons: 'Adds a mandatory network hop (+0.5ms latency) and proxy becomes a high-CPU throughput bottleneck at 500K ops/sec.'
      },
      verdict: 'Recommended: Consistent Hashing with 256 V-nodes in client SDK for sub-millisecond microservice performance.',
      relatedNodes: ['app-servers', 'cache-router', 'cluster-coordinator']
    },
    {
      id: 'to-eviction',
      decision: 'Eviction Strategy: Approximated LRU vs LFU Frequency Eviction',
      optionA: {
        name: 'Approximated LRU with Jitter (Selected Default)',
        pros: 'Constant-time O(1) memory reclaim based on recency. Sampling 5–10 random keys achieves near-perfect LRU without global linked-list lock contention.',
        cons: 'Susceptible to temporary scan pollution if a large batch job reads millions of cold keys once.'
      },
      optionB: {
        name: 'Least Frequently Used (LFU)',
        pros: 'Protects popular historical keys from being evicted by temporary batch scans.',
        cons: 'Requires 8-bit or 16-bit frequency counters per key and an exponential decay timer to drop obsolete popular keys.'
      },
      verdict: 'Recommended: Approximated LRU with TTL Jitter. Protects RAM ceilings without locking or pointer mutation overhead.',
      relatedNodes: ['shard-1-primary', 'shard-2-primary', 'shard-3-primary']
    },
    {
      id: 'to-invalidation',
      decision: 'Invalidation Strategy: Cache-Aside with CDC vs Synchronous Write-Through',
      optionA: {
        name: 'Cache-Aside with CDC WAL Tailing (Selected Default)',
        pros: 'Decoupled writes; cache failure never prevents database mutations; Debezium CDC eliminates stale read race conditions.',
        cons: 'Cache misses incur full DB read latency; CDC introduces minor ~50ms eventual consistency lag.'
      },
      optionB: {
        name: 'Synchronous Write-Through',
        pros: 'Newly written keys are instantly warm in memory for subsequent reads.',
        cons: 'Every write incurs double latency (RAM write + DB disk fsync); cache failure fails application writes.'
      },
      verdict: 'Recommended: Cache-Aside with CDC WAL Invalidation. Keeps authoritative storage isolated from cache cluster crashes.',
      relatedNodes: ['authoritative-db', 'cdc-invalidator', 'cache-router']
    },
    {
      id: 'to-stampede',
      decision: 'Cache Stampede Defense: SingleFlight Mutex vs XFetch Probabilistic Refresh',
      optionA: {
        name: 'SingleFlight Mutex Lock (Selected Default)',
        pros: 'Guarantees exactly 1 worker executes the DB query during cold misses; suppresses thundering herd 100%.',
        cons: 'Awaiting concurrent threads still block until the single query returns from the database (~10ms).'
      },
      optionB: {
        name: 'XFetch (Probabilistic Early Expiration)',
        pros: 'Refreshes hot keys asynchronously before expiration; users experience 0ms cache miss penalty.',
        cons: 'Requires recording computation duration (delta) with every key, adding ~8 bytes memory overhead per item.'
      },
      verdict: 'Recommended: SingleFlight Mutex on Miss combined with 10% TTL Jitter on writes to prevent synchronized expirations.',
      relatedNodes: ['mutex-lock', 'cache-router', 'authoritative-db']
    },
    {
      id: 'to-replication',
      decision: 'High Availability: Active In-Memory Replicas vs Recomputation on Miss',
      optionA: {
        name: 'Active In-Memory Read Replicas (Selected Default)',
        pros: 'Sub-second auto-promotion upon primary crash; scales read IOPS across multiple replicas; protects DB from avalanche.',
        cons: 'Consumes 2x to 3x RAM hardware infrastructure cost; async replication can return slightly stale reads during bursts.'
      },
      optionB: {
        name: 'Recomputation from DB (No Replicas)',
        pros: 'Cuts infrastructure hardware cost by 50% to 66%; treats cache purely as disposable RAM.',
        cons: 'A single node crash dumps 50,000 queries/sec directly onto the database, triggering catastrophic cascading outage.'
      },
      verdict: 'Recommended: Active In-Memory Replicas (1 Primary + 1 Cross-AZ Replica per shard) to guarantee 99.99% uptime.',
      relatedNodes: ['shard-1-primary', 'shard-1-replica', 'shard-2-primary', 'shard-2-replica']
    }
  ]
};

