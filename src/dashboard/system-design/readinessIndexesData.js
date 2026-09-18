/**
 * 45-Day Interview Prep OS - Readiness Indexes Data & Competency Model
 * Defines the 10 core System Design & Distributed Engineering Readiness Indexes,
 * mapping all 42 Roadmap Days, all 103 Theory Topics, and the 20 Production Specs
 * to multi-index competencies.
 */

export const READINESS_INDEXES = [
  {
    id: "distributed-systems",
    key: "distributed",
    name: "Distributed Systems & Consensus",
    shortName: "Distributed Sys",
    icon: "hub",
    color: "#34D399",
    borderClass: "border-emerald-500/40",
    badgeClass: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    barClass: "bg-[#34D399]",
    description: "Consensus (Raft/Paxos), leader election, gossip membership, vector clocks, CAP theorem & partition tolerance."
  },
  {
    id: "storage-partitioning",
    key: "storage",
    name: "Storage Engines & Partitioning",
    shortName: "Storage & Sharding",
    icon: "database",
    color: "#818CF8",
    borderClass: "border-indigo-500/40",
    badgeClass: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30",
    barClass: "bg-[#818CF8]",
    description: "LSM-Trees vs B-Trees, database sharding, consistent hashing vnodes, replication lag & object storage (S3)."
  },
  {
    id: "api-networking",
    key: "api",
    name: "High-Throughput APIs & Networking",
    shortName: "APIs & Protocols",
    icon: "lan",
    color: "#38BDF8",
    borderClass: "border-cyan-500/40",
    badgeClass: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
    barClass: "bg-[#38BDF8]",
    description: "HTTP/2, HTTP/3 QUIC, gRPC, WebSockets, TLS 1.3, DNS resolution, L4/L7 load balancing & reverse proxies."
  },
  {
    id: "resiliency-availability",
    key: "resiliency",
    name: "High Availability & Fault Tolerance",
    shortName: "Availability & SLAs",
    icon: "shield",
    color: "#C084FC",
    borderClass: "border-purple-500/40",
    badgeClass: "text-purple-400 bg-purple-500/15 border-purple-500/30",
    barClass: "bg-[#C084FC]",
    description: "SLA downtime budgets, circuit breakers, bulkheads, grey failures, automated failover & blast radius reduction."
  },
  {
    id: "caching-latency",
    key: "caching",
    name: "Caching & Latency Optimization",
    shortName: "Caching & Latency",
    icon: "speed",
    color: "#F59E0B",
    borderClass: "border-amber-500/40",
    badgeClass: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    barClass: "bg-[#F59E0B]",
    description: "Redis/Memcached, Cache-Aside vs Write-Through, 80/20 RAM sizing, CDN edge PoPs & physical latency constants."
  },
  {
    id: "consistency-transactions",
    key: "consistency",
    name: "Data Consistency & Transactions",
    shortName: "Consistency & ACID",
    icon: "lock",
    color: "#FB7185",
    borderClass: "border-rose-500/40",
    badgeClass: "text-rose-400 bg-rose-500/15 border-rose-500/30",
    barClass: "bg-[#FB7185]",
    description: "ACID transactions, 2PC, Saga orchestration/choreography, transactional outbox pattern & idempotency keys."
  },
  {
    id: "streaming-queues",
    key: "streaming",
    name: "Streaming, Event Sizing & Queues",
    shortName: "Streaming & Queues",
    icon: "stream",
    color: "#2DD4BF",
    borderClass: "border-teal-500/40",
    badgeClass: "text-teal-400 bg-teal-500/15 border-teal-500/30",
    barClass: "bg-[#2DD4BF]",
    description: "Distributed message queues (Kafka, RabbitMQ), consumer groups, partition log ordering, backpressure & DLQs."
  },
  {
    id: "capacity-math",
    key: "capacity",
    name: "Capacity Planning & Mental Math",
    shortName: "Capacity Sizing",
    icon: "calculate",
    color: "#60A5FA",
    borderClass: "border-blue-500/40",
    badgeClass: "text-blue-400 bg-blue-500/15 border-blue-500/30",
    barClass: "bg-[#60A5FA]",
    description: "Whiteboard arithmetic, DAU to QPS, storage retention formulas, bandwidth saturation sizing & RAM hot sets."
  },
  {
    id: "security-auth",
    key: "security",
    name: "Security, Identity & Zero-Trust",
    shortName: "Security & Auth",
    icon: "security",
    color: "#F472B6",
    borderClass: "border-pink-500/40",
    badgeClass: "text-pink-400 bg-pink-500/15 border-pink-500/30",
    barClass: "bg-[#F472B6]",
    description: "SSO (SAML/OAuth2/OIDC), JWT tokens vs session cookies, HMAC request signing, bcrypt/Argon2 & rate-limit defense."
  },
  {
    id: "observability-telemetry",
    key: "observability",
    name: "Observability, Telemetry & SRE",
    shortName: "Observability & SRE",
    icon: "monitoring",
    color: "#A3E635",
    borderClass: "border-lime-500/40",
    badgeClass: "text-lime-400 bg-lime-500/15 border-lime-500/30",
    barClass: "bg-[#A3E635]",
    description: "Distributed tracing (W3C/OpenTelemetry), structured logging pipelines, Prometheus metrics, SLI/SLO burn rates & chaos engineering."
  }
];

/**
 * Mapping of all 42 Roadmap Days to their Readiness Indexes.
 * Complex production specs (Weeks 4-6) are mapped to 4–5 indexes each.
 */
export const ROADMAP_DAY_READINESS_MAP = {
  1: ["capacity-math", "caching-latency", "resiliency-availability"],
  2: ["distributed-systems", "resiliency-availability"],
  3: ["resiliency-availability", "caching-latency", "storage-partitioning"],
  4: ["api-networking", "security-auth", "caching-latency"],
  5: ["api-networking", "caching-latency"],
  6: ["api-networking", "resiliency-availability"],
  7: ["capacity-math", "api-networking", "resiliency-availability"],

  8: ["security-auth", "api-networking"],
  9: ["storage-partitioning", "consistency-transactions", "distributed-systems"],
  10: ["storage-partitioning", "distributed-systems", "consistency-transactions"],
  11: ["storage-partitioning", "distributed-systems", "caching-latency"],
  12: ["storage-partitioning", "observability-telemetry", "streaming-queues"],
  13: ["caching-latency", "storage-partitioning", "resiliency-availability"],
  14: ["storage-partitioning", "consistency-transactions", "caching-latency"],

  15: ["storage-partitioning", "capacity-math", "resiliency-availability"],
  16: ["streaming-queues", "consistency-transactions", "distributed-systems"],
  17: ["distributed-systems", "consistency-transactions", "resiliency-availability"],
  18: ["api-networking", "security-auth", "resiliency-availability"],
  19: ["resiliency-availability", "observability-telemetry"],
  20: ["observability-telemetry", "resiliency-availability", "distributed-systems"],
  21: ["distributed-systems", "consistency-transactions", "resiliency-availability", "streaming-queues"],

  // Week 4: Applied Specs Part I (Multi-competency mappings)
  22: ["caching-latency", "storage-partitioning", "capacity-math", "api-networking"],          // Spec 1: TinyURL
  23: ["api-networking", "caching-latency", "security-auth", "distributed-systems", "resiliency-availability"], // Spec 18: Rate Limiter & Gateway
  24: ["caching-latency", "api-networking", "resiliency-availability", "capacity-math"],           // Spec 11: CDN
  25: ["caching-latency", "distributed-systems", "storage-partitioning", "resiliency-availability"], // Spec 3: Redis Cache
  26: ["distributed-systems", "storage-partitioning", "streaming-queues", "capacity-math"],         // Spec 17: Web Crawler
  27: ["caching-latency", "storage-partitioning", "capacity-math", "api-networking"],            // Spec 16: Autocomplete
  28: ["caching-latency", "storage-partitioning", "api-networking", "capacity-math", "resiliency-availability"], // Week 4 Revision

  // Week 5: Applied Specs Part II (Multi-competency mappings)
  29: ["distributed-systems", "storage-partitioning", "consistency-transactions", "resiliency-availability"], // Spec 2: DynamoDB
  30: ["storage-partitioning", "distributed-systems", "capacity-math", "resiliency-availability", "api-networking"], // Spec 4: Amazon S3
  31: ["streaming-queues", "storage-partitioning", "resiliency-availability", "distributed-systems", "consistency-transactions"], // Spec 5: Kafka
  32: ["storage-partitioning", "observability-telemetry", "streaming-queues", "capacity-math", "resiliency-availability"], // Spec 8: Prometheus TSDB
  33: ["distributed-systems", "consistency-transactions", "streaming-queues", "resiliency-availability", "api-networking"], // Spec 7: Task Scheduler
  34: ["storage-partitioning", "distributed-systems", "caching-latency", "consistency-transactions", "capacity-math"], // Spec 9: Elasticsearch
  35: ["distributed-systems", "storage-partitioning", "streaming-queues", "consistency-transactions", "resiliency-availability"], // Week 5 Revision

  // Week 6: Applied Specs Part III & Grand Finale
  36: ["api-networking", "streaming-queues", "storage-partitioning", "distributed-systems", "security-auth"], // Spec 10: WhatsApp / Slack
  37: ["caching-latency", "storage-partitioning", "capacity-math", "api-networking", "streaming-queues"],     // Spec 13: YouTube / Netflix
  38: ["distributed-systems", "api-networking", "caching-latency", "streaming-queues", "observability-telemetry"], // Spec 12: Uber / Lyft
  39: ["consistency-transactions", "security-auth", "resiliency-availability", "storage-partitioning", "api-networking"], // Spec 6: Stripe Payments
  40: ["caching-latency", "storage-partitioning", "capacity-math", "api-networking", "consistency-transactions"], // Spec 15: Gaming Leaderboard
  41: ["caching-latency", "consistency-transactions", "resiliency-availability", "capacity-math", "storage-partitioning"], // Spec 14: Stock Exchange Order Book
  42: ["distributed-systems", "storage-partitioning", "api-networking", "resiliency-availability", "caching-latency", "consistency-transactions", "streaming-queues", "capacity-math", "security-auth", "observability-telemetry"] // Grand Finale
};

/**
 * Explicit mapping for the 20 Applied Design Specs (specId -> Readiness Indexes).
 * Every production spec spans 4 to 5 readiness indexes simultaneously.
 */
export const SPEC_READINESS_MAP = {
  "sd-1": ["caching-latency", "storage-partitioning", "capacity-math", "api-networking"],
  "sd-18": ["api-networking", "caching-latency", "security-auth", "distributed-systems", "resiliency-availability"],
  "sd-11": ["caching-latency", "api-networking", "resiliency-availability", "capacity-math"],
  "sd-3": ["caching-latency", "distributed-systems", "storage-partitioning", "resiliency-availability"],
  "sd-17": ["distributed-systems", "storage-partitioning", "streaming-queues", "capacity-math"],
  "sd-16": ["caching-latency", "storage-partitioning", "capacity-math", "api-networking"],
  "sd-rev4": ["caching-latency", "storage-partitioning", "api-networking", "capacity-math", "resiliency-availability"],
  "sd-2": ["distributed-systems", "storage-partitioning", "consistency-transactions", "resiliency-availability"],
  "sd-4": ["storage-partitioning", "distributed-systems", "capacity-math", "resiliency-availability", "api-networking"],
  "sd-5": ["streaming-queues", "storage-partitioning", "resiliency-availability", "distributed-systems", "consistency-transactions"],
  "sd-8": ["storage-partitioning", "observability-telemetry", "streaming-queues", "capacity-math", "resiliency-availability"],
  "sd-7": ["distributed-systems", "consistency-transactions", "streaming-queues", "resiliency-availability", "api-networking"],
  "sd-9": ["storage-partitioning", "distributed-systems", "caching-latency", "consistency-transactions", "capacity-math"],
  "sd-rev5": ["distributed-systems", "storage-partitioning", "streaming-queues", "consistency-transactions", "resiliency-availability"],
  "sd-10": ["api-networking", "streaming-queues", "storage-partitioning", "distributed-systems", "security-auth"],
  "sd-13": ["caching-latency", "storage-partitioning", "capacity-math", "api-networking", "streaming-queues"],
  "sd-12": ["distributed-systems", "api-networking", "caching-latency", "streaming-queues", "observability-telemetry"],
  "sd-6": ["consistency-transactions", "security-auth", "resiliency-availability", "storage-partitioning", "api-networking"],
  "sd-15": ["caching-latency", "storage-partitioning", "capacity-math", "api-networking", "consistency-transactions"],
  "sd-14": ["caching-latency", "consistency-transactions", "resiliency-availability", "capacity-math", "storage-partitioning"],
  "sd-finale": ["distributed-systems", "storage-partitioning", "api-networking", "resiliency-availability", "caching-latency", "consistency-transactions", "streaming-queues", "capacity-math", "security-auth", "observability-telemetry"]
};

/**
 * Topic-level mapping to Readiness Indexes for all 103 individual topics in the curriculum.
 */
export const TOPIC_READINESS_MAP = {
  // Day 1: Part 0 · The Playbook
  "0.1": ["capacity-math"],
  "0.2": ["resiliency-availability", "capacity-math"],
  "0.3": ["capacity-math", "storage-partitioning"],
  "0.4": ["capacity-math", "caching-latency", "resiliency-availability"],

  // Day 2: Part 1 · Compute Foundations
  "1.1": ["distributed-systems"],
  "1.2": ["distributed-systems", "api-networking"],
  "1.3": ["storage-partitioning", "resiliency-availability"],

  // Day 3: Part 1 · Scale & Serverless
  "1.4": ["api-networking", "resiliency-availability"],
  "1.5": ["resiliency-availability", "caching-latency", "storage-partitioning"],
  "1.6": ["storage-partitioning", "streaming-queues"],

  // Day 4: Part 11 & Part 2 · Transport & Protocols
  "11.1": ["api-networking"],
  "2.1": ["api-networking", "caching-latency"],
  "2.2": ["security-auth", "api-networking", "resiliency-availability"],

  // Day 5: Part 2 · Ingress & Browser
  "2.3": ["api-networking", "caching-latency", "resiliency-availability"],
  "2.4": ["api-networking", "caching-latency"],
  "2.5": ["api-networking", "resiliency-availability"],
  "2.9": ["api-networking", "caching-latency"],

  // Day 6: Part 2 & Part 11 · Load Balancing & API Styles
  "2.8": ["api-networking", "resiliency-availability"],
  "2.6": ["api-networking", "distributed-systems"],
  "2.7": ["api-networking", "caching-latency", "resiliency-availability"],
  "11.2": ["api-networking", "resiliency-availability"],

  // Day 7: Revision Day 1
  "rev-1": ["capacity-math", "api-networking", "resiliency-availability"],
  "rev-1-checklist": ["capacity-math", "api-networking", "resiliency-availability"],

  // Day 8: Part 3 · Security, Auth & Access
  "3.1": ["security-auth", "api-networking", "distributed-systems"],
  "3.2": ["security-auth", "storage-partitioning"],
  "3.3": ["security-auth", "api-networking"],
  "3.4": ["security-auth", "api-networking", "distributed-systems"],
  "3.5": ["security-auth", "resiliency-availability"],
  "3.6": ["security-auth", "resiliency-availability", "api-networking"],
  "3.7": ["security-auth", "resiliency-availability"],

  // Day 9: Part 4 · Database Foundations & Isolation
  "4.1": ["storage-partitioning", "consistency-transactions", "distributed-systems"],
  "4.1-mvcc": ["storage-partitioning", "consistency-transactions"],
  "4.2": ["consistency-transactions", "storage-partitioning"],
  "4.3": ["distributed-systems", "consistency-transactions", "resiliency-availability"],

  // Day 10: Part 4 · Replication & Database Selection
  "4.4": ["distributed-systems", "consistency-transactions", "storage-partitioning"],
  "4.5": ["storage-partitioning", "consistency-transactions", "caching-latency"],
  "4.8": ["storage-partitioning", "distributed-systems"],

  // Day 11: Part 4 · Sharding & Storage Engines
  "4.6": ["storage-partitioning", "capacity-math"],
  "4.7": ["storage-partitioning", "distributed-systems"],
  "4.9": ["storage-partitioning", "caching-latency"],

  // Day 12: Part 4 · Time Series & Big Data
  "4.11": ["storage-partitioning", "observability-telemetry"],
  "4.12": ["storage-partitioning", "distributed-systems", "streaming-queues"],

  // Day 13: Part 5 · Caching Strategies & Redis
  "5.1": ["caching-latency", "storage-partitioning"],
  "5.2": ["caching-latency", "resiliency-availability"],
  "5.3": ["caching-latency", "storage-partitioning"],

  // Day 14: Revision Day 2
  "rev-2": ["storage-partitioning", "consistency-transactions", "caching-latency"],
  "rev-2-checklist": ["storage-partitioning", "consistency-transactions", "caching-latency"],

  // Day 15: Part 6 · Object & Block Storage
  "6.1": ["storage-partitioning", "capacity-math"],
  "6.2": ["storage-partitioning", "caching-latency"],
  "6.3": ["storage-partitioning", "resiliency-availability", "capacity-math"],

  // Day 16: Part 7 · Streaming & Transactions
  "7.1": ["streaming-queues", "consistency-transactions"],
  "7.2": ["streaming-queues", "caching-latency", "storage-partitioning"],
  "7.4": ["consistency-transactions", "distributed-systems"],

  // Day 17: Part 10 · Distributed Consensus & Time
  "10.1": ["distributed-systems", "consistency-transactions"],
  "10.2": ["distributed-systems", "consistency-transactions"],
  "10.4": ["distributed-systems", "resiliency-availability"],

  // Day 18: Part 11 · Advanced Networking & Edge
  "11.3": ["api-networking", "security-auth", "observability-telemetry"],
  "11.4": ["api-networking", "resiliency-availability"],
  "11.6": ["api-networking", "streaming-queues"],

  // Day 19: Part 8 · Reliability & Production Operations
  "8.1": ["resiliency-availability", "observability-telemetry"],
  "8.2": ["resiliency-availability", "api-networking"],
  "8.3": ["observability-telemetry", "resiliency-availability"],

  // Day 20: Part 12 · SRE Scale & Disaster Recovery
  "12.3": ["observability-telemetry", "resiliency-availability"],
  "12.4": ["resiliency-availability", "distributed-systems", "storage-partitioning"],
  "12.7": ["observability-telemetry", "resiliency-availability"],

  // Day 21: Revision Day 3
  "rev-3": ["distributed-systems", "streaming-queues", "consistency-transactions"],
  "rev-3-checklist": ["distributed-systems", "streaming-queues", "consistency-transactions"],

  // Day 22: TinyURL / Bitly
  "4.10": ["storage-partitioning", "capacity-math", "distributed-systems"],
  "kgs-base62": ["storage-partitioning", "caching-latency", "capacity-math"],

  // Day 23: Rate Limiter & Edge Gateway
  "3.4": ["api-networking", "caching-latency", "security-auth"],
  "11.2-gw": ["api-networking", "security-auth", "resiliency-availability"],

  // Day 24: CDN Architecture
  "2.5": ["caching-latency", "api-networking", "capacity-math"],
  "11.4-anycast": ["api-networking", "resiliency-availability"],

  // Day 25: Distributed Cache
  "5.4": ["caching-latency", "storage-partitioning"],
  "5.5-cache": ["caching-latency", "storage-partitioning"],

  // Day 26: Web Crawler
  "5.5-crawler": ["distributed-systems", "storage-partitioning"],
  "4.12-indexer": ["storage-partitioning", "distributed-systems"],

  // Day 27: Search Autocomplete
  "1.6-trie": ["caching-latency", "capacity-math", "storage-partitioning"],
  "trie-arch": ["caching-latency", "storage-partitioning", "capacity-math"],

  // Day 28: Revision Day 4
  "rev-4": ["caching-latency", "storage-partitioning", "api-networking", "capacity-math"],
  "rev-4-cheat": ["capacity-math", "caching-latency", "resiliency-availability"],

  // Day 29: DynamoDB / Cassandra
  "10.3": ["distributed-systems", "consistency-transactions", "storage-partitioning"],
  "4.3-quorum": ["distributed-systems", "consistency-transactions", "resiliency-availability"],

  // Day 30: Amazon S3
  "6.4": ["storage-partitioning", "api-networking", "capacity-math"],
  "6.5": ["storage-partitioning", "distributed-systems", "resiliency-availability"],

  // Day 31: Kafka Broker
  "7.1-kafka": ["streaming-queues", "consistency-transactions", "resiliency-availability"],
  "7.2-internals": ["streaming-queues", "storage-partitioning", "distributed-systems"],

  // Day 32: Metrics TSDB & Real-Time Push
  "2.7-push": ["api-networking", "streaming-queues"],
  "13.5": ["api-networking", "resiliency-availability", "security-auth"],

  // Day 33: Distributed Scheduler & Media SFU
  "11.5": ["api-networking", "resiliency-availability", "caching-latency"],
  "11.6-chat": ["api-networking", "streaming-queues"],

  // Day 34: Elasticsearch & Vector Clocks
  "13.1": ["consistency-transactions", "streaming-queues", "storage-partitioning"],
  "10.2-time": ["distributed-systems", "consistency-transactions"],

  // Day 35: Revision Day 5
  "rev-5": ["distributed-systems", "storage-partitioning", "streaming-queues"],
  "rev-5-patterns": ["distributed-systems", "storage-partitioning", "consistency-transactions"],

  // Day 36: WhatsApp / Slack & SRE Scaling
  "8.4": ["resiliency-availability", "observability-telemetry"],
  "12.5": ["capacity-math", "resiliency-availability"],

  // Day 37: YouTube / Netflix & Proximity Maps
  "9.1": ["storage-partitioning", "caching-latency", "capacity-math"],
  "9.2": ["storage-partitioning", "api-networking", "distributed-systems"],

  // Day 38: Uber / Lyft & Tracing / Logging
  "12.1": ["observability-telemetry", "distributed-systems", "api-networking"],
  "12.2": ["observability-telemetry", "storage-partitioning", "capacity-math"],

  // Day 39: Stripe Payments & Microservices
  "7.3": ["distributed-systems", "api-networking", "streaming-queues"],
  "13.4": ["distributed-systems", "resiliency-availability"],

  // Day 40: Gaming Leaderboard & Ledgers
  "9.4": ["consistency-transactions", "storage-partitioning", "security-auth"],
  "13.2-pay": ["consistency-transactions", "resiliency-availability", "security-auth"],

  // Day 41: Stock Exchange & Flash Sales
  "9.6": ["caching-latency", "resiliency-availability", "capacity-math"],
  "13.3": ["consistency-transactions", "distributed-systems", "resiliency-availability"],

  // Day 42: Grand Finale & Mock Defense
  "capstone-rubric": ["distributed-systems", "storage-partitioning", "resiliency-availability", "capacity-math"],
  "rapid-257": ["distributed-systems", "storage-partitioning", "api-networking", "resiliency-availability", "caching-latency", "consistency-transactions", "streaming-queues", "capacity-math", "security-auth", "observability-telemetry"]
};

/**
 * Returns full Readiness Index objects for a specific day number
 */
export function getReadinessIndexesForDay(day) {
  const indexIds = ROADMAP_DAY_READINESS_MAP[day] || ["distributed-systems", "resiliency-availability"];
  return indexIds.map(id => READINESS_INDEXES.find(idx => idx.id === id)).filter(Boolean);
}

/**
 * Returns full Readiness Index objects for a specific topic ID or day
 */
export function getReadinessIndexesForTopic(topicId, day) {
  const indexIds = TOPIC_READINESS_MAP[topicId] || ROADMAP_DAY_READINESS_MAP[day] || ["distributed-systems", "resiliency-availability"];
  return indexIds.map(id => READINESS_INDEXES.find(idx => idx.id === id)).filter(Boolean);
}

/**
 * Returns full Readiness Index objects for a specific spec ID
 */
export function getReadinessIndexesForSpec(specId, day) {
  const indexIds = SPEC_READINESS_MAP[specId] || ROADMAP_DAY_READINESS_MAP[day] || ["distributed-systems", "storage-partitioning"];
  return indexIds.map(id => READINESS_INDEXES.find(idx => idx.id === id)).filter(Boolean);
}

/**
 * Calculates metrics across all 10 Readiness Indexes based on roadmap completion state.
 */
export function calculateAllReadinessIndexes(roadmapState = {}) {
  const indexMetrics = READINESS_INDEXES.map(idx => {
    // Collect all days mapped to this index
    const mappedDays = Object.entries(ROADMAP_DAY_READINESS_MAP)
      .filter(([_, indexIds]) => indexIds.includes(idx.id))
      .map(([day]) => parseInt(day, 10));

    const totalMapped = mappedDays.length;
    const completedDays = mappedDays.filter(day => Boolean(roadmapState[day]?.completed));
    const completedCount = completedDays.length;

    // Calibrated baseline score formula:
    // Base calibrated at 65% + up to 35% proportional to mastered days
    const rawPct = totalMapped > 0 ? (completedCount / totalMapped) : 0;
    const calibratedScore = Math.min(100, Math.round(65 + rawPct * 35));

    return {
      ...idx,
      totalMapped,
      completedCount,
      completedDays,
      score: calibratedScore,
      rawPercentage: Math.round(rawPct * 100)
    };
  });

  // Calculate composite overall readiness score
  const totalScore = indexMetrics.reduce((sum, item) => sum + item.score, 0);
  const overall = Math.round(totalScore / indexMetrics.length);

  // Total completed days across the 42-day roadmap
  const allCompletedDays = Object.keys(roadmapState).filter(k => roadmapState[k]?.completed).length;
  const weeklyGain = 6 + Math.round((allCompletedDays / 42) * 12);

  // Backward compatibility convenience properties
  const getScore = (id) => (indexMetrics.find(m => m.id === id)?.score || 70);

  return {
    overall,
    weeklyGain,
    indexes: indexMetrics,
    distributed: getScore("distributed-systems"),
    storage: getScore("storage-partitioning"),
    api: getScore("api-networking"),
    resiliency: getScore("resiliency-availability"),
    caching: getScore("caching-latency"),
    consistency: getScore("consistency-transactions"),
    streaming: getScore("streaming-queues"),
    capacity: getScore("capacity-math"),
    security: getScore("security-auth"),
    observability: getScore("observability-telemetry")
  };
}
