/**
 * 4.8 A Visual Guide to Choosing the Right Database - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 63 and 64
 * from The Modern System Design Interview Guide.
 */

export function renderChoosingRightDatabaseContent(topic) {
  const databaseMatrix = [
    {
      paradigm: "Relational (RDBMS)",
      engines: "PostgreSQL, MySQL",
      dataModel: "Strict Normalized Tables (Rows & Columns), Foreign Keys",
      scaling: "Vertical + Read Replicas; Horizontal via Citus / Vitess",
      bestFor: "Financial ledgers, order checkouts, complex multi-table SQL joins, strict ACID compliance",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Massive write streams (>50k writes/sec single table), dynamic unstructured nested schemas",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Document Store",
      engines: "MongoDB, Couchbase",
      dataModel: "Hierarchical JSON / BSON Trees with Dynamic Schema",
      scaling: "Horizontal Sharding via Config Replica Sets",
      bestFor: "Product catalogs, user profiles, rapidly evolving content management, polymorphic schemas",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Deep relational graph traversals, highly normalized financial data requiring multi-table ACID",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Key-Value Store",
      engines: "AWS DynamoDB, Redis",
      dataModel: "Opaque Key-Value Pairs, Hashes, Sorted Sets",
      scaling: "Automatic horizontal partition hash rings, sub-10ms at petabyte scale",
      bestFor: "User session caches, rate-limiting tokens, leaderboards, shopping carts, single-key lookups",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Ad-hoc range filtering, aggregation queries without pre-defined secondary indexes",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Wide-Column (LSM)",
      engines: "Apache Cassandra, ScyllaDB",
      dataModel: "Sparse Multidimensional Tables (Partition Key + Clustering Key)",
      scaling: "Leaderless masterless peer-to-peer ring, linear horizontal write scaling",
      bestFor: "High-velocity time-series ingest, IoT sensor data, user messaging history, multi-DC global writes",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Relational joins, ad-hoc aggregation across partitions, strong immediate ACID consistency",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Graph Database",
      engines: "Neo4j, AWS Neptune",
      dataModel: "Nodes, Directed Edges, and First-Class Relationship Properties",
      scaling: "Vertical primary; read replicas; sharding is notoriously complex",
      bestFor: "Social networks, fraud detection networks, knowledge graphs, recommendation route traversal",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "High-volume bulk sequential time-series logging, simple tabular CRUD operations",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Time-Series (TSDB)",
      engines: "TimescaleDB, InfluxDB",
      dataModel: "Append-only timestamped telemetry metrics + tag sets",
      scaling: "Time-window Hypertables, Gorilla compression, automatic retention drops",
      bestFor: "DevOps APM monitoring (Prometheus), financial tick streams, IoT telemetry",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Frequent random record updates, arbitrary deletes, transactional e-commerce checkout",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Search Engine",
      engines: "Elasticsearch, OpenSearch",
      dataModel: "Inverted Index of Tokenized Text Documents",
      scaling: "Distributed primary/replica shard clusters",
      bestFor: "Full-text search, auto-complete fuzzy matching, log analytics (ELK stack)",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Primary source of truth for transactional data, ACID transactions, financial balances",
      avoidForClass: "text-rose-400"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you defend picking PostgreSQL as your default database in almost every System Design interview?",
      answer: `Senior interviewers respect candidates who default to PostgreSQL because it avoids the premature polyglot trap.
      <br/><br/>
      <strong class="text-indigo-400">The 5 Justifications for PostgreSQL as Default:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>ACID Invariant Defense:</strong> Foreign keys, unique constraints, and serializable transactions guarantee that your core entity balances and user state never corrupt.</li>
        <li><strong>Native JSONB (Document Hybrid):</strong> PostgreSQL's <code>JSONB</code> datatype with GIN indexing handles polymorphic, schema-less document storage with performance rivaling MongoDB.</li>
        <li><strong>Full-Text & Extensions Ecosystem:</strong> PostgreSQL includes built-in full-text search, geospatial capabilities (<code>PostGIS</code>), and AI vector search (<code>pgvector</code>) in a single operational engine.</li>
        <li><strong>Proven Scale:</strong> With connection pooling (PgBouncer) and read replicas, single PostgreSQL instances easily handle 50,000+ QPS.</li>
        <li><strong>Rule of Thumb:</strong> Choose PostgreSQL first, and only spin off dedicated NoSQL stores when a specific bounded context hits measurable throughput or access pattern ceilings.</li>
      </ol>`
    },
    {
      qNum: "Q2",
      question: "What are the fundamental architectural tradeoffs of DynamoDB's Single-Table Design pattern?",
      answer: `AWS DynamoDB's Single-Table Design collapses multiple business entities (Users, Orders, Items) into a single physical table using generic partition keys (<code>PK</code>) and sort keys (<code>SK</code>) with Global Secondary Indexes (GSIs).
      <br/><br/>
      <strong class="text-indigo-400">Tradeoffs:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Pros (Sub-10ms Predictable Latency):</strong> By modeling access patterns so that a user and all their recent orders share a single <code>PK</code>, a single query retrieves all related data in one network roundtrip without joins.</li>
        <li><strong>Cons (Extreme Rigidity & Query Lock-In):</strong> You must know every single query pattern upfront before designing keys. An unexpected ad-hoc business query (e.g. "find all orders over $100 placed on Tuesdays") requires a full table scan costing thousands of dollars or complex GSI additions.</li>
        <li><strong>Operational Overhead:</strong> Steep learning curve; impossible to query via standard SQL BI tools without an ETL pipeline to a data warehouse.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How do you synchronize a primary SQL database with Elasticsearch without suffering from dual-write split-brain?",
      answer: `A classic junior mistake is executing dual writes in the application layer:
      <br/>
      <code>1. db.save(order); 2. es.index(order);</code>
      <br/>
      If the app crashes or the network blips between steps 1 and 2, Elasticsearch permanently diverges from the database.
      <br/><br/>
      <strong class="text-indigo-400">The Senior Production Pattern: Transactional Outbox + CDC</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Transactional Outbox:</strong> The application writes both the business entity and an event row into an <code>outbox_events</code> table within the <em>exact same local ACID database transaction</em>. Both succeed or both rollback together.</li>
        <li><strong>Change Data Capture (Debezium):</strong> A CDC engine monitors the database transaction log (Postgres WAL) and streams outbox events to an Apache Kafka topic with at-least-once delivery guarantees.</li>
        <li><strong>Elasticsearch Consumer:</strong> A dedicated consumer service pulls events from Kafka and writes documents to Elasticsearch idempotently (using the database entity ID as Elasticsearch document <code>_id</code>).</li>
      </ol>`
    },
    {
      qNum: "Q4",
      question: "Why are traditional relational B-Trees inefficient for IoT and Metrics data compared to Time-Series engines?",
      answer: `High-frequency IoT sensors generate millions of append-only data points per second.
      <br/><br/>
      <strong class="text-indigo-400">B-Tree Inefficiency:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li>In-place B-Tree page updates cause heavy random disk I/O and page-splitting overhead.</li>
        <li>Each row incurs fixed per-row overhead and index amplification (16KB page rewrites).</li>
        <li>Deleting expired metric data requires massive <code>DELETE</code> transactions that lock tables and generate severe database bloat requiring heavy VACUUM.</li>
      </ul>
      <br/>
      <strong class="text-indigo-400">Time-Series Engine Advantages (Timescale / Influx / Gorilla):</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Time-Partitioned Chunks:</strong> Data is partitioned by time windows (e.g. 1 hour). Dropping 30-day-old metrics is an instantaneous metadata drop of an entire physical chunk ($O(1)$) with zero row deletes.</li>
        <li><strong>Gorilla Compression:</strong> Uses delta-of-delta encoding for timestamps and XOR bitwise floating-point compression, reducing telemetry storage footprint by <strong>90–95%</strong> (often under 1.5 bytes per sample).</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 63, 64: A VISUAL GUIDE TO CHOOSING THE RIGHT DATABASE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              4.8 A Visual Guide to Choosing the Right Database
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Never choose a database based on technology hype or resume-driven development. In system design interviews, <strong class="text-indigo-400">database selection is a rigorous derivation</strong> based on three non-negotiable vectors: <em>1. Data Structure & Schema Flexibility</em>, <em>2. Read/Write Throughput & Access Patterns</em>, and <em>3. Consistency Requirements vs. Availability Constraints</em>.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">1. Relational (RDBMS)</span>
              <span class="text-[12px] text-slate-300">PostgreSQL / MySQL. Structured schemas, foreign keys, multi-table ACID transactions, and ad-hoc joins.</span>
            </div>
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">2. Document & KV</span>
              <span class="text-[12px] text-slate-300">MongoDB / DynamoDB / Redis. Sub-10ms point lookups, hierarchical JSON trees, horizontal partition scaling.</span>
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">3. Wide-Column & TSDB</span>
              <span class="text-[12px] text-slate-300">Cassandra / TimescaleDB. High-velocity append-only write ingest, multi-datacenter replication, Gorilla compression.</span>
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-amber-300 uppercase">4. Search & Graph</span>
              <span class="text-[12px] text-slate-300">Elasticsearch / Neo4j. Inverted indexes for fuzzy text search, recursive pointer-hopping graph traversals.</span>
            </div>
          </div>
        </div>

        <!-- The Grand Database Selection Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              The Grand Database Selection Matrix (Cheatsheet)
            </h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left font-sans text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-[#141C2E] text-slate-300 font-code text-[11px] uppercase tracking-wider border-b border-[#24314A]">
                  <th class="p-3">Paradigm & Engines</th>
                  <th class="p-3">Data Model</th>
                  <th class="p-3">Scaling Mechanism</th>
                  <th class="p-3">Strongest Fit (Best For)</th>
                  <th class="p-3">Antipatterns (Avoid For)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 bg-[#0B1120]">
                ${databaseMatrix.map(db => `
                  <tr class="hover:bg-[#141E33] transition-colors">
                    <td class="p-3 font-code font-bold text-cyan-300 whitespace-nowrap">
                      ${db.paradigm}
                      <div class="text-[11px] font-normal text-slate-400">${db.engines}</div>
                    </td>
                    <td class="p-3 text-slate-300">${db.dataModel}</td>
                    <td class="p-3 text-slate-300 text-[12px]">${db.scaling}</td>
                    <td class="p-3 ${db.bestForClass} text-[12px]">${db.bestFor}</td>
                    <td class="p-3 ${db.avoidForClass} text-[12px]">${db.avoidFor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: SENIOR PERSPECTIVE -->
        <div class="bg-gradient-to-r from-[#064E3B]/40 to-[#022C22]/30 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">verified</span>
            SENIOR PERSPECTIVE: POLYGLOT PERSISTENCE & CHANGE DATA CAPTURE (CDC)
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In production enterprises (Uber, Netflix, Airbnb), no single database engine handles the entire system. Instead, architectures leverage <strong class="text-emerald-300">Polyglot Persistence</strong>:
              use <strong>PostgreSQL</strong> as the single source of truth for transactional billing and accounts; stream events via <strong>Change Data Capture (Debezium + Kafka)</strong> to populate <strong>Elasticsearch</strong> for search, <strong>Redis</strong> for caching, and <strong>ClickHouse</strong> for analytics.
            </p>
            <p>
              <strong class="text-white">Crucial Rule:</strong> Never execute dual writes directly from your application code! Dual writes guarantee eventual data divergence. Always make the primary ACID database the single authoritative writer, and asynchronously synchronize all secondary search and analytical stores via transaction log replication.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - THE POLYGLOT PERSISTENCE TAX -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            THE POLYGLOT PERSISTENCE TAX: RESIST PREMATURE SPECIALIZATION
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              Every new database engine you introduce into an infrastructure incurs an enormous <strong class="text-white">Operational Tax</strong>:
              separate backup protocols, custom Terraform provisioning, monitoring dashboards, distinct connection pools, specialized on-call pager rotas, and distributed reconciliation debugging.
            </p>
            <p>
              In system design interviews, <strong class="text-amber-300">start with PostgreSQL as your pragmatic baseline</strong>. Only introduce specialized stores (like Cassandra or Neo4j) after mathematically demonstrating that your write throughput (>50,000 writes/sec) or query graph shape exceeds PostgreSQL's capabilities. Cost-justifying each database signals true senior engineering maturity.
            </p>
          </div>
        </div>

        <!-- Interview Follow-ups (Q1-Q4) -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              Interview Follow-Up Questions (Technical Deep Dive)
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${interviewFollowUps.map(item => `
              <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 shrink-0">
                    ${item.qNum}
                  </span>
                  <h4 class="font-sans text-[13px] font-bold text-white leading-snug">
                    ${item.question}
                  </h4>
                </div>
                <div class="text-[12.5px] text-slate-300 font-sans leading-relaxed pt-1 border-t border-[#24314A]/60">
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
            Derive your database choice strictly from data relationships, write throughput, and access patterns. Default to PostgreSQL for transactional integrity; scale reads with read replicas before sharding; and adopt specialized NoSQL engines only when specific bounded contexts require horizontal write scale, sub-millisecond point lookups, or full-text inverted indexes synchronized via CDC.
          </p>
        </div>

        <!-- Page 64 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 64</span>
        </div>

      </div>

    </div>
  `;
}
