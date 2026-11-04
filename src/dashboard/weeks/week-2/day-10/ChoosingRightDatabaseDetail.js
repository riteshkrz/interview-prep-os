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
      dataModel: "Normalized Tables (Rows & Columns), Foreign Keys, Schemas",
      scaling: "Vertical primary + Read Replicas; Sharding via Citus / Vitess",
      bestFor: "Financial transactions, user billing, order checkout, complex multi-table SQL joins",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Massive append streams (>50k writes/sec single table), unstructured dynamic nested trees",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Document Store",
      engines: "MongoDB, Couchbase",
      dataModel: "Hierarchical JSON / BSON Trees with Dynamic Schema",
      scaling: "Horizontal Sharding across Replica Sets",
      bestFor: "Product catalogs, user profiles, polymorphic schemas, content management",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Deep relational graph joins, strict double-entry accounting ledgers",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Key-Value Store",
      engines: "AWS DynamoDB, Redis",
      dataModel: "Key-Value Pairs, In-memory Hashes, Sorted Sets",
      scaling: "Partition hash rings; sub-10ms latency at massive petabyte scale",
      bestFor: "Session caches, rate limiting, shopping carts, fast single-key lookups",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Ad-hoc range filtering, aggregation across multiple dimensions",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Wide-Column (LSM)",
      engines: "Apache Cassandra, ScyllaDB",
      dataModel: "Multi-dimensional tables (Partition Key + Clustering Key)",
      scaling: "Masterless peer-to-peer ring; linear horizontal write scaling",
      bestFor: "High-velocity sensor ingest, messaging inbox history, multi-region writes",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Cross-partition SQL joins, ad-hoc ad-hoc aggregation, ACID transactions",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Graph Database",
      engines: "Neo4j, AWS Neptune",
      dataModel: "Nodes (Entities) & Directed Edges (Relationships)",
      scaling: "Vertical primary; read replicas; cross-node sharding is complex",
      bestFor: "Social networks (friends of friends), fraud ring detection, recommendation routing",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "High-volume sequential time-series logging, simple tabular CRUD apps",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Time-Series (TSDB)",
      engines: "TimescaleDB, InfluxDB",
      dataModel: "Append-only timestamped telemetry metrics + tag sets",
      scaling: "Time-window partitions, Gorilla compression, instant retention drops",
      bestFor: "Server APM monitoring (Prometheus), IoT device telemetry, financial ticks",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Frequent random record updates, transactional e-commerce checkout",
      avoidForClass: "text-rose-400"
    },
    {
      paradigm: "Search Engine",
      engines: "Elasticsearch, OpenSearch",
      dataModel: "Inverted Index of tokenized text documents",
      scaling: "Distributed primary and replica shard clusters",
      bestFor: "Full-text search, auto-complete fuzzy matching, log analytics (ELK stack)",
      bestForClass: "text-emerald-400 font-medium",
      avoidFor: "Primary authoritative source of truth, banking balances, ACID writes",
      avoidForClass: "text-rose-400"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why do senior engineers always default to PostgreSQL in System Design interviews?",
      answer: `Defaulting to PostgreSQL shows engineering maturity because it prevents the trap of <strong>premature polyglot persistence</strong> (introducing 4 different databases on Day 1).
      <br/><br/>
      <strong class="text-indigo-400">The 5 Reasons PostgreSQL is the Best Default:</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Rock-Solid ACID Invariants:</strong> Foreign keys, unique constraints, and transaction safety ensure core data never gets corrupted.</li>
        <li><strong>Document Support via JSONB:</strong> PostgreSQL's <code>JSONB</code> with GIN indexing allows you to store schema-less document data with speeds rivaling MongoDB.</li>
        <li><strong>Built-In Extensions:</strong> Full-text search, geospatial indexing (<code>PostGIS</code>), and vector embeddings (<code>pgvector</code>) are all built right into the same operational engine.</li>
        <li><strong>Scale Headroom:</strong> With connection poolers (PgBouncer) and read replicas, a single PostgreSQL instance comfortably handles 40,000+ queries per second.</li>
        <li><strong>The Senior Rule of Thumb:</strong> Start with PostgreSQL. Only add specialized NoSQL databases when a specific service hits proven write limits or unique access constraints.</li>
      </ol>`
    },
    {
      qNum: "Q2",
      question: "What are the core tradeoffs of DynamoDB's Single-Table Design pattern?",
      answer: `AWS DynamoDB Single-Table Design combines multiple business entities (Users, Orders, Products) into one physical table using generic keys (<code>PK</code> and <code>SK</code>) and Global Secondary Indexes (GSIs).
      <br/><br/>
      <strong class="text-indigo-400">The Tradeoffs:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>The Benefit (Guaranteed Speed):</strong> By structuring keys so a User and all their recent Orders share the same <code>PK</code>, a single query fetches both in one network round-trip without any slow relational joins. Latency remains under 10ms at any scale.</li>
        <li><strong>The Trap (Extreme Query Rigidity):</strong> You must know all your query access patterns before writing any code. If the business introduces a new ad-hoc question (e.g., "Find all orders from users in Seattle placed on a Tuesday"), you cannot run a simple SQL query. You must scan the entire table (costing thousands of dollars) or design a brand new GSI.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "How do you synchronize PostgreSQL with Elasticsearch without dual-write split-brain bugs?",
      answer: `A common candidate mistake is writing to both in application code:
      <pre class="bg-[#050811] p-1.5 rounded text-[11px] font-code text-rose-300 mt-1 border border-slate-800">await db.save(user); // If this succeeds...
await es.index(user); // ...but this network fails, your search index is out of sync forever!</pre>
      <strong class="text-emerald-400">The Senior Production Pattern: Transactional Outbox + CDC</strong>
      <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Outbox Table:</strong> The app writes both the user data and an outbox event into an <code>outbox_events</code> table inside the <em>same local ACID transaction</em>. Both commit together or both rollback.</li>
        <li><strong>Change Data Capture (Debezium):</strong> A CDC worker reads PostgreSQL's transaction log (WAL) and publishes events to an Apache Kafka topic with guaranteed delivery.</li>
        <li><strong>Search Consumer:</strong> An Elasticsearch worker reads from Kafka and updates the index idempotently using the database ID as document <code>_id</code>.</li>
      </ol>`
    },
    {
      qNum: "Q4",
      question: "Why do standard relational B-Tree databases fail for IoT metrics and telemetry streams?",
      answer: `High-frequency IoT sensors generate millions of append-only events per second.
      <br/><br/>
      <strong class="text-rose-400">Why Relational B-Trees Struggle:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Random Disk I/O:</strong> Updating secondary indexes (device_id, metric, timestamp) rewrites 16KB disk pages in place, causing high write amplification.</li>
        <li><strong>Deletion Nightmares:</strong> Cleaning up old data (e.g. deleting rows older than 30 days) runs giant <code>DELETE</code> queries that lock tables and leave massive table fragmentation requiring manual VACUUM.</li>
      </ul>
      <strong class="text-emerald-400">How Time-Series Engines (Timescale / Influx) Solve It:</strong>
      <ul class="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
        <li><strong>Time Chunks:</strong> Data is split into physical time slices (e.g. 1 chunk per day). Expiring 30-day data is an instant file deletion ($O(1)$) with zero row locks.</li>
        <li><strong>Gorilla Compression:</strong> Compresses timestamps using delta-of-delta and floats with XOR bitwise encoding, cutting disk storage by <strong>90%</strong> (often under 1.5 bytes per sample).</li>
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
          <p class="text-slate-400 text-[13px] font-sans">
            How to select the right storage engine using access patterns, write volume, and data shape rather than industry buzzwords.
          </p>
        </div>

        <!-- Everyday Mental Model Card -->
        <div class="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-400 text-[20px]">lightbulb</span>
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              EVERYDAY MENTAL MODEL: THE CARPENTER'S TOOLBOX
            </span>
          </div>
          <p class="text-slate-300 text-[13px] leading-relaxed font-sans">
            Databases are specialized tools, not universal magic boxes:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div class="bg-[#090D16] p-3 rounded-lg border border-indigo-500/20 flex flex-col gap-1">
              <strong class="text-indigo-300 text-[12px] font-code">Swiss Army Knife (SQL)</strong>
              <p class="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                PostgreSQL/MySQL. Reliable for 80% of jobs. Enforces structure, prevents errors, joins tables cleanly.
              </p>
            </div>
            <div class="bg-[#090D16] p-3 rounded-lg border border-cyan-500/20 flex flex-col gap-1">
              <strong class="text-cyan-300 text-[12px] font-code">Speedy Sticky Notes (KV)</strong>
              <p class="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                Redis / DynamoDB. Super-fast single item lookups under 2ms. No fancy queries, just instant answers by key.
              </p>
            </div>
            <div class="bg-[#090D16] p-3 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
              <strong class="text-emerald-300 text-[12px] font-code">Firehose Log (LSM / TSDB)</strong>
              <p class="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                Cassandra / Timescale. Absorbs millions of continuous writes per second without breaking a sweat.
              </p>
            </div>
            <div class="bg-[#090D16] p-3 rounded-lg border border-amber-500/20 flex flex-col gap-1">
              <strong class="text-amber-300 text-[12px] font-code">Library Index (Search)</strong>
              <p class="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                Elasticsearch. Scans millions of words for typos, partial matches, and relevance scoring in milliseconds.
              </p>
            </div>
          </div>
        </div>

        <!-- The Grand Database Selection Matrix Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 class="font-sans text-[15px] font-bold text-white tracking-wide">
              The Grand Database Selection Matrix
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
            SENIOR ARCHITECTURE: POLYGLOT PERSISTENCE WITH CHANGE DATA CAPTURE (CDC)
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              In large production companies (Netflix, Uber, Stripe), no single database does everything. Instead, systems use <strong class="text-emerald-300">Polyglot Persistence</strong>:
              use <strong>PostgreSQL</strong> as the single source of truth for accounts and payments; stream changes via <strong>Change Data Capture (Debezium + Kafka)</strong> to populate <strong>Elasticsearch</strong> for search, <strong>Redis</strong> for caching, and <strong>ClickHouse</strong> for analytics.
            </p>
            <p>
              <strong class="text-white">Crucial Rule:</strong> Never execute dual writes from your application code! Network blips between dual writes will corrupt your data. Always write to your primary ACID database first, and let log-based CDC update the secondary search and cache engines asynchronously.
            </p>
          </div>
        </div>

        <!-- Orange Callout Box: WARNING - THE POLYGLOT TAX -->
        <div class="bg-gradient-to-r from-[#7C2D12]/40 to-[#451A03]/30 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">warning</span>
            THE POLYGLOT TAX: RESIST PREMATURE SPECIALIZATION
          </span>
          <div class="text-[13px] text-slate-300 font-sans leading-relaxed space-y-2">
            <p>
              Every new database technology you adopt comes with an ongoing <strong class="text-white">Operational Tax</strong>:
              separate backup routines, custom monitoring dashboards, distinct connection pools, specialized on-call pager shifts, and complex troubleshooting when data gets out of sync.
            </p>
            <p>
              In interviews, <strong class="text-amber-300">always start with PostgreSQL as your pragmatic baseline</strong>. Only introduce specialized engines (like Cassandra or Neo4j) after mathematically proving that your write rate (>50k writes/sec) or data structure (recursive graph traversals) cannot be handled by PostgreSQL.
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
            Choose databases based on your read/write patterns and consistency requirements, not technology hype. Default to PostgreSQL for transactional safety; scale reads with read replicas; and only add specialized NoSQL engines when a specific subsystem requires extreme write scaling, sub-10ms point queries, or full-text search fed safely via Change Data Capture (CDC).
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
