/**
 * 4.1 Relational (SQL) vs. Non-Relational (NoSQL) Databases - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 46, 47, and 48
 * from The Modern System Design Interview Guide.
 */

export function renderSqlVsNosqlContent(topic) {
  const dbComparisonRows = [
    {
      dimension: "Data Model",
      sql: "Structured tables with fixed columns, strict schemas, foreign key relationships",
      nosql: "Document (JSON/BSON), Key-Value pairs, Wide-Column families, or Property Graphs"
    },
    {
      dimension: "Schema Enforcement",
      sql: "Schema-on-Write: Strict validation before disk persistence; DDL migrations required",
      nosql: "Schema-on-Read / Dynamic: Flexible schema per record; easy field evolution"
    },
    {
      dimension: "Scaling Architecture",
      sql: "Vertical (Scale-up CPU/RAM/NVMe) + Read Replicas. Horizontal sharding is complex",
      nosql: "Native Horizontal (Scale-out hash partitioning across commodity node clusters)"
    },
    {
      dimension: "Transaction Guarantees",
      sql: "Strict ACID (Atomicity, Consistency, Isolation, Durability) across multiple tables",
      nosql: "BASE (Basically Available, Soft-state, Eventual consistency). Single-row ACID"
    },
    {
      dimension: "Query Capabilities",
      sql: "Rich declarative SQL: Multi-table JOINs, subqueries, window functions, aggregates",
      nosql: "Key/Partition lookups. JOINs are forbidden or must be executed in application code"
    },
    {
      dimension: "Storage Engine Internals",
      sql: "B+ Trees & Write-Ahead Logs (WAL) optimized for fast random reads & in-place updates",
      nosql: "LSM Trees (Log-Structured Merge) or Append-Only Rings optimized for massive write throughput"
    },
    {
      dimension: "Industry Standouts",
      sql: "PostgreSQL, MySQL, Oracle, CockroachDB, Google Cloud Spanner",
      nosql: "MongoDB, Apache Cassandra, ScyllaDB, Amazon DynamoDB, Redis, Neo4j"
    },
    {
      dimension: "Optimal Workloads",
      sql: "Financial accounting, ERP, e-commerce checkout ledgers, complex reporting",
      nosql: "IoT sensor telemetry, social media feeds, real-time gaming leaderboards, clickstreams"
    }
  ];

  const nosqlFamilies = [
    {
      name: "Document Stores",
      examples: "MongoDB, Couchbase",
      structure: "Hierarchical JSON/BSON",
      bestFor: "Content management, user profiles, catalog items with varying attributes"
    },
    {
      name: "Key-Value Stores",
      examples: "Redis, AWS DynamoDB, Memcached",
      structure: "Hash map: Key → Arbitrary Blob",
      bestFor: "Session caching, rate limit counters, distributed locks, shopping carts"
    },
    {
      name: "Wide-Column Stores",
      examples: "Apache Cassandra, ScyllaDB, Bigtable",
      structure: "Row Key + Column Family + Timestamp",
      bestFor: "High-velocity time-series, log ingestion, IoT telemetry, write-heavy analytics"
    },
    {
      name: "Graph Databases",
      examples: "Neo4j, AWS Neptune, ArangoDB",
      structure: "Nodes, Edges, and Properties",
      bestFor: "Fraud detection rings, social network follower graphs, recommendation engines"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "When should you adamantly choose a Relational Database (SQL) over NoSQL, even when designing systems at massive scale?",
      answer: `Choose a Relational Database when:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Financial or Audit Accuracy is Mandatory:</strong> Ledger accounting and billing require strict multi-table ACID transactions where money deducted from Account A must atomically match money deposited into Account B.</li>
        <li><strong>Access Patterns are Highly Unpredictable:</strong> Relational SQL allows data analysts and product features to query arbitrary combinations of fields with <code>JOIN</code>, <code>GROUP BY</code>, and indexing without having to redesign data storage formats.</li>
        <li><strong>Data Relationships are Inherently Normalized:</strong> When data consists of heavily interconnected 1:N and M:N relationships (e.g. Users, Roles, Organizations, Invoices), denormalizing into NoSQL documents leads to massive data duplication and severe update anomaly bugs.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How do modern Distributed SQL (NewSQL) engines like Google Spanner and CockroachDB achieve horizontal scale while preserving full ACID?",
      answer: `Traditional SQL scales vertically because coordinating distributed multi-master transactions across standard servers creates locking bottlenecks. <strong>NewSQL</strong> solves this via:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Consensus Partitioning:</strong> Tables are automatically partitioned into ranges (splits), each managed by a Raft or Paxos consensus group.</li>
        <li><strong>Hardware-Synchronized Clocks (TrueTime / HLC):</strong> Google Spanner uses GPS and atomic clocks (TrueTime API) with bounded clock uncertainty (&plusmn;7ms) to assign globally ordered commit timestamps, enabling serializable transactions across multi-region datacenters without global locking. CockroachDB achieves similar behavior using Hybrid Logical Clocks (HLC).</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is the mechanical difference between B+ Tree (SQL) and LSM Tree (NoSQL) storage engines? Why does it matter for interview calculations?",
      answer: `This is a high-signal senior differentiator:
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>B+ Trees (PostgreSQL, MySQL InnoDB):</strong> Organize pages on disk in balanced trees. Reads are fast ($O(\\log N)$ disk seeks). However, writes require <em>random I/O</em> to update leaves in place, causing write amplification and disk head/SSD wear under heavy write loads.</li>
        <li><strong>LSM Trees (Cassandra, RocksDB, ScyllaDB):</strong> Incoming writes are appended sequentially to an in-memory <strong>MemTable</strong> and a sequential Write-Ahead Log (WAL). When full, the MemTable is flushed to disk as an immutable <strong>SSTable</strong> (Sorted String Table). Because all writes are sequential disk appends, LSM trees achieve 10x higher write throughput than B+ trees. Compaction threads merge SSTables in the background.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "How do you manage schema evolution and database migrations in a production NoSQL datastore without taking downtime?",
      answer: `Because NoSQL uses <strong>Schema-on-Read</strong>, database engines don't enforce constraints at write time. Teams manage migrations through <strong>Lazy Dual-Read / Dual-Write Adaptation</strong>:
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Application Versioning:</strong> Store a <code>schema_version: 2</code> field inside each document.</li>
        <li><strong>Backward Compatibility in Code:</strong> The application entity deserializer handles both version 1 (e.g. <code>name: \"Alice Smith\"</code>) and version 2 (e.g. <code>firstName: \"Alice\", lastName: \"Smith\"</code>).</li>
        <li><strong>Lazy Upgrade on Write:</strong> When a user document is read, it is transformed in memory. When the document is saved back to disk, it is written in the new V2 schema.</li>
        <li><strong>Background Worker Sweep:</strong> A low-priority asynchronous batch job sweeps historical inactive records to upgrade them without consuming primary database throughput.</li>
      </ol>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 46, 47, 48: SQL VS NOSQL DATABASES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.1 Relational (SQL) vs. Non-Relational (NoSQL) Databases
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Selecting a storage architecture is one of the most consequential decisions in any system design interview. The decision is never about <em>"modern vs legacy"</em>—it is a rigorous engineering tradeoff between <strong class="text-indigo-400">Strict ACID consistency, normalization, and declarative joins</strong> versus <strong class="text-cyan-400">Horizontal partition scaling, high write velocity, and flexible schema evolution</strong>.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">Relational (SQL / RDBMS)</span>
                <span class="text-[10px] font-code bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">ACID & Normalized</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Organized into normalized tables with strict types and foreign keys. Provides full transactional guarantees (ACID) and expressive queries with joins. Scaled vertically, with horizontal sharding requiring heavy operational complexity.
              </p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">Non-Relational (NoSQL)</span>
                <span class="text-[10px] font-code bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">BASE & Horizontal Scale</span>
              </div>
              <p class="text-[12.5px] text-slate-300">
                Optimized for specific data access patterns with denormalized storage. Trades multi-table ACID transactions for seamless horizontal hash partitioning, low-latency key lookups, and flexible schemas across clusters.
              </p>
            </div>
          </div>
        </div>

        <!-- 4 NoSQL Families Breakdown -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            THE 4 NOSQL DATABASE FAMILIES
          </span>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${nosqlFamilies.map(fam => `
              <div class="bg-[#111B2E] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-2">
                <span class="font-code text-[12px] font-bold text-cyan-300">${fam.name}</span>
                <div class="text-[11px] font-code text-slate-400">
                  <span class="text-slate-500">Tech:</span> ${fam.examples}
                </div>
                <div class="text-[11.5px] text-indigo-200/80 font-sans">
                  <span class="font-semibold text-slate-300">Structure:</span> ${fam.structure}
                </div>
                <p class="text-[11.5px] text-slate-300/90 font-sans leading-relaxed pt-1 border-t border-[#24314A]/60">
                  ${fam.bestFor}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ASCII Architecture / SQL Normalized vs NoSQL Partitioned Model -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-code text-[11.5px]">
          <div class="flex items-center justify-between border-b border-[#24314A]/80 pb-2">
            <span class="font-bold text-indigo-400 tracking-wider text-[11px] uppercase">
              DATA MODELING PARADIGM: NORMALIZED SQL RELATIONS VS. DENORMALIZED NOSQL PARTITION
            </span>
            <span class="text-slate-500 text-[10.5px]">Storage Representation</span>
          </div>

          <pre class="text-slate-300 leading-relaxed overflow-x-auto p-2 bg-[#050811] rounded-lg border border-slate-800">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. SQL NORMALIZED MODEL (POSTGRESQL / MYSQL)                                           │
│                                                                                        │
│   ┌──────────────────┐        ┌───────────────────┐        ┌──────────────────────┐    │
│   │   USERS TABLE    │ 1    N │   ORDERS TABLE    │ 1    N │   ORDER_ITEMS TABLE  │    │
│   ├──────────────────┤◄───────┼───────────────────┼◄───────┼──────────────────────┤    │
│   │ id (PK)          │        │ id (PK)           │        │ id (PK)              │    │
│   │ name             │        │ user_id (FK)      │        │ order_id (FK)        │    │
│   │ email            │        │ total_amount      │        │ product_id (FK)      │    │
│   │ created_at       │        │ status            │        │ quantity, price      │    │
│   └──────────────────┘        └───────────────────┘        └──────────────────────┘    │
│                                                                                        │
│   Query: SELECT * FROM users u JOIN orders o ON u.id = o.user_id WHERE u.id = 42       │
│   Pros: Zero redundancy, atomic relational integrity.                                  │
│   Cons: Cross-node JOINs at scale kill performance; requires complex sharding.         │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. NOSQL DENORMALIZED DOCUMENT / PARTITION MODEL (MONGODB / DYNAMODB)                  │
│                                                                                        │
│   Document / Partition Key: "user#42"                                                  │
│   {                                                                                    │
│     "userId": "42",                                                                    │
│     "name": "Alice Smith",                                                             │
│     "orders": [                                                                        │
│       {                                                                                │
│         "orderId": "ord_901",                                                          │
│         "status": "COMPLETED",                                                         │
│         "items": [                                                                     │
│           { "sku": "MUG-1", "qty": 2, "price": 14.50 },                                │
│           { "sku": "TSHIRT-L", "qty": 1, "price": 28.00 }                              │
│         ]                                                                              │
│       }                                                                                │
│     ]                                                                                  │
│   }                                                                                    │
│                                                                                        │
│   Lookup: db.users.find({ _id: 42 }) ──► Single I/O disk fetch directly by Hash Ring!  │
│   Pros: Blazing fast single-key reads; horizontal partition scaling across 1000 nodes. │
│   Cons: Data duplicated; updating item price requires modifying historical orders.     │
└────────────────────────────────────────────────────────────────────────────────────────┘</pre>
        </div>

        <!-- Comparison Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              COMPREHENSIVE COMPARISON: SQL VS. NOSQL
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse text-[12px] font-sans">
              <thead>
                <tr class="bg-[#162032] text-slate-300 font-code text-[11px] border-b border-[#24314A]">
                  <th class="p-3.5 font-semibold text-white">Dimension</th>
                  <th class="p-3.5 font-semibold text-indigo-300">Relational (SQL)</th>
                  <th class="p-3.5 font-semibold text-cyan-300">Non-Relational (NoSQL)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0F172A]">
                ${dbComparisonRows.map((row, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#111B2E]/50' : 'bg-transparent'} hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-code text-slate-300 font-medium whitespace-nowrap">${row.dimension}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.sql}</td>
                    <td class="p-3.5 text-slate-300 leading-relaxed">${row.nosql}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-[#0D241E] border border-[#10B981]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SENIOR PERSPECTIVE: POLYGLOT PERSISTENCE IN MODERN ARCHITECTURES
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In system design interviews, never ask: <em class="text-white">"Should we use SQL or NoSQL for our entire company?"</em> Real-world production architectures embrace <strong class="text-emerald-400">Polyglot Persistence</strong>—using different database engines tailored to the specific operational characteristics of each sub-domain:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-sans">
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white">PostgreSQL:</strong> Transactional order checkout, user ledgers, and billing (strict ACID).
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white">Redis:</strong> Session tokens, rate limit counters, and ephemeral caching (sub-millisecond in-memory).
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white">Cassandra / DynamoDB:</strong> Clickstreams, IoT tracking, and chat message history (horizontal write scale).
            </div>
            <div class="bg-[#081713] border border-[#10B981]/25 rounded-lg p-2.5 text-slate-300">
              <strong class="text-white">Elasticsearch:</strong> Full-text catalog search, product filters, and fuzzy auto-completion.
            </div>
          </div>
          <p class="font-sans text-[12.5px] text-emerald-200/90 leading-relaxed">
            Synchronize these heterogeneous stores asynchronously using <strong>Change Data Capture (CDC via Debezium + Apache Kafka)</strong> reading directly from the primary relational database WAL.
          </p>
        </div>

        <!-- Orange Warning Box: ARCHITECTURAL PITFALL -->
        <div class="bg-[#2A1805] border border-[#F59E0B]/40 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
            <span class="font-code text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
              ARCHITECTURAL PITFALL: THE NOSQL ACCESS PATTERN TRAP & HOT PARTITIONS
            </span>
          </div>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            In relational databases, you design the normalized schema first and write queries later. In NoSQL (especially DynamoDB and Cassandra), <strong>you must design the partition and sort keys around exact read access patterns</strong> before storing a single byte. Querying NoSQL without the partition key causes a catastrophic cluster-wide full table scan.
          </p>
          <div class="font-sans text-[12.5px] text-amber-200/90 bg-[#190E03] p-3 rounded-lg border border-[#F59E0B]/20">
            <strong class="text-amber-100">Beware Hot Partitions:</strong> Never choose a low-cardinality partition key (e.g. <code>status="PENDING"</code> or <code>country="US"</code>) or a single celebrity ID. This routes 99% of read/write traffic to a single physical storage node, triggering throttling and cluster cascading failures while other nodes sit idle.
          </div>
        </div>

        <!-- Over To You Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
            OVER TO YOU
          </span>
          <p class="font-sans text-[13px] text-slate-300 leading-relaxed">
            You are designing the storage layer for an e-commerce platform during Black Friday handling 200,000 requests/second. Inventory stock counts must never oversell (strict consistency), but product catalog pages must load in under 20 milliseconds across global CDNs. How do you divide this between SQL, NoSQL, and caching layers?
          </p>
        </div>

        <!-- Interview Follow-ups: Q1 - Q4 -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#818CF8] text-[18px]">quiz</span>
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-1.5 pb-3 border-b border-[#24314A]/50 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[13.5px] font-bold text-white font-sans">${item.question}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-5 flex flex-col gap-2 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[13.5px] font-sans font-medium text-white leading-relaxed">
            Never pick a database based on hype. Choose SQL when ACID transactions, relational integrity, and ad-hoc joins are non-negotiable. Choose NoSQL when horizontal write throughput, high partition availability, and predictable key-value access patterns dominate. In modern enterprise systems, propose Polyglot Persistence synchronized via Change Data Capture (CDC).
          </p>
        </div>

        <!-- Page 48 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 48</span>
        </div>

      </div>

    </div>
  `;
}
