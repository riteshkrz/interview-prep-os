/**
 * 2.6 REST vs. GraphQL vs. gRPC vs. WebSockets - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 32, 33, and 34
 * from The Modern System Design Interview Guide.
 */

export function renderApiStylesContent(topic) {
  const apiComparisonRows = [
    {
      dimension: "Everyday Mental Model",
      rest: "Fixed Combo Menu: You get the exact predefined dish whether you want the sides or not",
      graphql: "Build-Your-Own Salad Bar: You hand the chef an exact checklist of ingredients",
      grpc: "Pneumatic Tube System: Pre-compressed binary canisters shot through high-speed tubes",
      ws: "Open Telephone Hotline: Continuous open channel where both talk and listen at once"
    },
    {
      dimension: "Transport Protocol",
      rest: "HTTP/1.1 or HTTP/2",
      graphql: "HTTP/1.1 or HTTP/2 (almost always over POST)",
      grpc: "HTTP/2 exclusively (Binary framing & multiplexing)",
      ws: "TCP socket (ws://, wss:// via HTTP 101 Upgrade)"
    },
    {
      dimension: "Payload Format",
      rest: "Text (JSON, XML)",
      graphql: "Text (JSON)",
      grpc: "Binary (Protocol Buffers / Protobuf)",
      ws: "Text (JSON) or raw Binary frames"
    },
    {
      dimension: "Contract & Typing",
      rest: "OpenAPI / Swagger (Optional documentation)",
      graphql: "Strict Schema Definition Language (SDL)",
      grpc: "Strict .proto contract (Ahead-of-time code generated)",
      ws: "Application-defined (Custom event types)"
    },
    {
      dimension: "Communication Pattern",
      rest: "Request-Response (Client pull, half-duplex)",
      graphql: "Request-Response (+ Subscriptions via SSE/WS)",
      grpc: "Unary RPC, Client stream, Server stream, Bi-directional stream",
      ws: "Full-duplex bidirectional stream"
    },
    {
      dimension: "Over / Under-Fetching",
      rest: "Frequent (Fixed server schemas return extra or insufficient fields)",
      graphql: "Eliminated (Client specifies exact fields needed in 1 query)",
      grpc: "Rare (Tailored RPC response messages defined in .proto)",
      ws: "N/A (Push event streams)"
    },
    {
      dimension: "Edge CDN Caching",
      rest: "Trivial & Native (Unique URL paths + Cache-Control / ETag)",
      graphql: "Extremely difficult (All queries go to single POST /graphql)",
      grpc: "No native HTTP edge caching (Internal transport)",
      ws: "No caching possible (Stateful connection)"
    },
    {
      dimension: "Performance Profile",
      rest: "Moderate (JSON serialization & text string parsing overhead)",
      graphql: "Moderate (Server AST query parse, validation & resolver fanout)",
      grpc: "Blazing fast (Binary serialization, zero string parsing, multiplexed)",
      ws: "Ultra-low latency (2–10 byte framing overhead per message)"
    },
    {
      dimension: "Primary Best Fit",
      rest: "Public APIs, third-party developer platforms, CRUD web apps",
      graphql: "Mobile apps, complex dashboards aggregating multiple services",
      grpc: "Internal microservices, high-throughput low-latency inter-service RPC",
      ws: "Live chat, collaborative canvas tools (Figma), multiplayer gaming"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why is gRPC significantly faster and more CPU-efficient than REST with JSON?",
      answer: `gRPC gains its dramatic 5x–10x throughput and latency advantage from three architectural factors:
      <br/><br/>
      1. <strong>Protocol Buffers (Protobuf) Binary Serialization:</strong> Instead of serializing data into verbose human-readable JSON text strings (where keys like <code>"first_name": "John"</code> are repeated in every single record), Protobuf encodes fields into compact binary byte streams using integer field tags. This drastically cuts payload size by 60–80% and eliminates expensive CPU string parsing.
      <br/>
      2. <strong>HTTP/2 Multiplexing:</strong> gRPC runs exclusively over HTTP/2. A single persistent TCP connection multiplexes hundreds of concurrent RPC requests in parallel without head-of-line blocking and compresses headers using HPACK.
      <br/>
      3. <strong>Ahead-of-Time Code Generation:</strong> Compiling <code>.proto</code> files generates strongly-typed client stubs and server interfaces in Go, Java, Python, or C++, completely bypassing runtime reflection and schema validation.`
    },
    {
      qNum: "Q2",
      question: "How does the DataLoader pattern resolve the GraphQL N+1 query problem?",
      answer: `When a client queries <code>users { posts }</code>, a naive GraphQL execution engine runs 1 database query to fetch a list of $N$ users, and then executes $N$ individual database queries to resolve the posts for each individual user ($1 + N$ queries). If you have 50 users, that is 51 database queries!
      <br/><br/>
      <strong>DataLoader solves this using per-request batching and caching:</strong>
      <br/>
      During a single JavaScript event loop tick, DataLoader intercepts all individual post-resolution requests and coalesces them into a single batched SQL query:
      <code>SELECT * FROM posts WHERE user_id IN (1, 2, 3, ... 50);</code>
      <br/>
      This collapses database round-trips from $O(N)$ back to $O(1)$, saving the database from connection pool exhaustion.`
    },
    {
      qNum: "Q3",
      question: "Why is HTTP edge caching trivial in REST but notoriously difficult in GraphQL?",
      answer: `In <strong>REST</strong>, every distinct resource has a unique URL (e.g. <code>GET /products/42</code>). Standard CDNs (Cloudflare, Akamai) and browser caches use the HTTP URL and method as the cache key. You simply add standard HTTP headers like <code>Cache-Control: public, max-age=3600</code> or <code>ETag</code>, and CDNs cache the response automatically.
      <br/><br/>
      In <strong>GraphQL</strong>, virtually all requests are sent as <code>POST /graphql</code> with the query string hidden inside the JSON body. Because CDNs do not cache HTTP POST requests by default, CDN edge caching is completely bypassed. 
      <br/><br/>
      <em>Workarounds:</em> GraphQL requires <strong>Persisted Queries</strong> (hashing the query string and sending it via <code>GET /graphql?hash=xyz</code>) or complex client-side normalized caches (Apollo Client / Relay).`
    },
    {
      qNum: "Q4",
      question: "What is a 'Query Bomb' in GraphQL and how do you protect against it?",
      answer: `Because GraphQL clients define the shape of incoming queries, an attacker can exploit circular relationships in your schema to craft a malicious nested query:
      <pre class="bg-black/40 p-2 rounded text-[11.5px] font-code my-1 text-cyan-300">query MaliciousBomb {
  author {
    books {
      author {
        books {
          author { books { ... } }
        }
      }
    }
  }
}</pre>
      This query forces the backend server to resolve millions of nested objects, causing 100% CPU lockup and database starvation.
      <br/><br/>
      <strong>Production Defenses:</strong>
      <br/>
      1. <strong>Query Depth Limiting:</strong> Reject any query exceeding a maximum nesting depth (e.g., max 5 levels deep).
      <br/>
      2. <strong>Query Complexity Cost Analysis:</strong> Assign cost points to each field and reject requests that exceed a total computational budget (e.g., max 1,000 points).
      <br/>
      3. <strong>Disable Introspection:</strong> Turn off schema introspection in production so attackers cannot automatically inspect your data graph.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 32, 33, 34: API STYLES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              2.6 API Styles: REST vs. GraphQL vs. gRPC vs. WebSockets
            </h2>
          </div>
          <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed pl-4">
            How systems talk to each other determines performance, developer velocity, network overhead, and scalability. In senior interviews, avoid religious debates over which API style is "best". The winning move is knowing exactly which architectural tier each paradigm belongs in.
          </p>
        </div>

        <!-- Plain-English Everyday Mental Models -->
        <div class="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-slate-900 border border-blue-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-blue-400">psychology</span>
            <span class="font-code text-[12px] font-bold text-blue-300 uppercase tracking-wider">
              Everyday Mental Models (How to Explain Them Simply)
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
            <div class="bg-[#0F1626]/80 border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-blue-300 font-code text-[11px]">REST = Fixed Combo Menu</strong>
              <p class="text-slate-300">You order Combo #2, you get the burger, fries, and soda. If you only wanted the burger, you still get the fries (over-fetching). To get dessert, you have to go to another counter (under-fetching).</p>
            </div>
            <div class="bg-[#0F1626]/80 border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-cyan-300 font-code text-[11px]">GraphQL = Custom Salad Bar</strong>
              <p class="text-slate-300">You hand the chef a checklist of exact toppings. You receive a single customized bowl with precisely those ingredients, saving mobile bandwidth and battery.</p>
            </div>
            <div class="bg-[#0F1626]/80 border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-indigo-300 font-code text-[11px]">gRPC = Pneumatic Tube Dispatch</strong>
              <p class="text-slate-300">Pre-compressed standardized metal canisters (Protobuf binary) shooting through pressurized tubes (HTTP/2) at supersonic speed. Built for machine-to-machine speed.</p>
            </div>
            <div class="bg-[#0F1626]/80 border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-emerald-300 font-code text-[11px]">WebSockets = Two-Way Phone Line</strong>
              <p class="text-slate-300">You establish an open connection once. Both parties talk and listen simultaneously with microsecond latency. Purpose-built for live chat and multiplayer games.</p>
            </div>
          </div>
        </div>

        <!-- 4-WAY ARCHITECTURAL COMPARISON TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            API PROTOCOL DIMENSIONAL COMPARISON MATRIX
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3 w-40">Dimension</th>
                  <th class="p-3 text-blue-200">REST</th>
                  <th class="p-3 text-cyan-200">GraphQL</th>
                  <th class="p-3 text-indigo-200">gRPC</th>
                  <th class="p-3 text-emerald-200">WebSockets</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12px]">
                ${apiComparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white font-code text-[11.5px]">${row.dimension}</td>
                    <td class="p-3 text-slate-300">${row.rest}</td>
                    <td class="p-3 text-slate-300">${row.graphql}</td>
                    <td class="p-3 text-indigo-300 font-semibold">${row.grpc}</td>
                    <td class="p-3 text-emerald-300 font-semibold">${row.ws}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The GraphQL N+1 Problem & Query Bomb Attacks -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE GRAPHQL N+1 PROBLEM &amp; QUERY COMPLEXITY ATTACKS (INTERVIEW DEFENSE)
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Giving frontend clients unlimited flexibility introduces dangerous backend vulnerabilities. First, naive nested resolver functions cause the <strong>N+1 Query Problem</strong>, running dozens of database queries for a single user request (solve with Facebook's <strong>DataLoader</strong> batching). Second, nested cyclical queries trigger <strong>Query Bomb DoS attacks</strong> that crash database connection pools. 
            <br/><br/>
            <strong>Mandatory Production Defenses:</strong> Always enforce <em>Query Depth Limiting</em>, <em>Cost Complexity Analysis</em>, and disable schema introspection in public production environments.
          </p>
        </div>

        <!-- Green Callout: Senior Perspective - The BFF Pattern -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR ARCHITECTURE: THE "BACKEND FOR FRONTEND" (BFF) HYBRID PATTERN
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Senior architects avoid treating API paradigms as mutually exclusive. The dominant high-scale enterprise pattern is the <strong>Backend-For-Frontend (BFF) Hybrid</strong>:
          </p>
          <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-2 pt-1">
            <li>• <strong class="text-emerald-300 font-code">Internal Tier (gRPC):</strong> Deploy high-performance <strong>gRPC</strong> over HTTP/2 for internal service-to-service RPC communication inside your private VPC. Binary Protobuf reduces CPU serialization overhead and bandwidth by up to 70%.</li>
            <li>• <strong class="text-emerald-300 font-code">Edge BFF Layer (Node.js / Go):</strong> Front your architecture with a thin BFF tier that translates incoming client <strong>GraphQL or REST</strong> requests into internal gRPC calls, aggregating diverse backend services into a single tailored JSON response.</li>
            <li>• <strong class="text-emerald-300 font-code">Public Partner API (REST):</strong> Offer standard REST endpoints for third-party developers, where URL-based caching and universal HTTP tooling dominate.</li>
          </ul>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            When would you explicitly choose REST over gRPC even for internal microservices? (Answer: When services are written in languages without mature Protobuf support, or when teams need simple curl / Postman debugging without compiling .proto schemas.)
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS (SENIOR &amp; STAFF PROBES)
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
            Choose your API style based on consumer and architectural boundary: use <strong>REST</strong> for public third-party APIs where standard CDN edge caching and developer familiarity dominate; use <strong>gRPC</strong> for internal service-to-service RPC where CPU efficiency and strict schemas are paramount; use <strong>GraphQL</strong> via a BFF for complex mobile apps that suffer from over-fetching; and use <strong>WebSockets</strong> strictly when persistent bidirectional full-duplex communication is required.
          </p>
        </div>

        <!-- Page 34 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Pages 32–34 · Section 2.6</span>
        </div>

      </div>

    </div>
  `;
}
