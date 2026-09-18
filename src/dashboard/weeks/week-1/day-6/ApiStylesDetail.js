/**
 * 2.6 REST vs. GraphQL vs. gRPC vs. WebSockets - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 32, 33, and 34
 * from The Modern System Design Interview Guide.
 */

export function renderApiStylesContent(topic) {
  const apiComparisonRows = [
    {
      dimension: "Transport Protocol",
      rest: "HTTP/1.1 or HTTP/2",
      graphql: "HTTP/1.1 or HTTP/2 (over POST)",
      grpc: "HTTP/2 exclusively",
      ws: "TCP (ws://, wss://)"
    },
    {
      dimension: "Payload Serialization",
      rest: "Text (JSON, XML)",
      graphql: "Text (JSON)",
      grpc: "Binary (Protocol Buffers)",
      ws: "Text (JSON) or raw Binary"
    },
    {
      dimension: "Contract & Typing",
      rest: "OpenAPI / Swagger (Optional)",
      graphql: "Strict Schema Definition (SDL)",
      grpc: "Strict .proto contract (Compiled)",
      ws: "Application-defined (Custom)"
    },
    {
      dimension: "Communication Flow",
      rest: "Request-Response (Half-duplex)",
      graphql: "Request-Response (+ Subscriptions)",
      grpc: "Unary, Client/Server/Bi-di Stream",
      ws: "Full-Duplex Bidirectional"
    },
    {
      dimension: "Over/Under-Fetching",
      rest: "Frequent (Fixed server schemas)",
      graphql: "Eliminated (Client asks exact fields)",
      grpc: "Rare (Tailored RPC methods)",
      ws: "N/A (Push event streams)"
    },
    {
      dimension: "Edge Caching",
      rest: "Trivial (Native URL + Cache-Control)",
      graphql: "Difficult (Single POST endpoint)",
      grpc: "No native HTTP edge caching",
      ws: "No edge caching possible"
    },
    {
      dimension: "Performance Profile",
      rest: "Moderate (JSON parsing & string overhead)",
      graphql: "Moderate (Server AST parse & resolvers)",
      grpc: "Blazing (Binary serialize + multiplex)",
      ws: "Ultra-low latency (2-10 byte frames)"
    },
    {
      dimension: "Primary Fit",
      rest: "Public APIs, standard CRUD web apps",
      graphql: "Mobile apps, complex UI aggregations",
      grpc: "Internal microservices, high-load RPC",
      ws: "Chat, live collaboration, multiplayer"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why is gRPC significantly faster and more CPU-efficient than REST with JSON?",
      answer: `gRPC gains its massive throughput advantage from three architectural factors: (1) <strong>Protocol Buffers (Protobuf)</strong> serializes data into compact binary representations rather than bulky text JSON strings, drastically reducing CPU cycles spent on string parsing; (2) <strong>HTTP/2 transport</strong> enables true multiplexing, binary framing, and header compression (HPACK) over a single persistent TCP connection; and (3) <strong>Strict schema compilation</strong> generates type-safe stubs ahead of time, eliminating runtime type checking.`
    },
    {
      qNum: "Q2",
      question: "How does the DataLoader pattern resolve the GraphQL N+1 query problem?",
      answer: `When a client queries <code>users { posts }</code>, a naive GraphQL engine executes 1 query for the list of $N$ users, and then executes $N$ individual database queries to resolve the posts for each user ($1 + N$ queries). <strong>DataLoader</strong> solves this using <strong>per-request batching and caching</strong>: it coalesces all individual resolution requests occurring within a single event loop tick into a single batched query (e.g. <code>SELECT * FROM posts WHERE user_id IN (1, 2, 3...)</code>), reducing database round-trips from $O(N)$ to $O(1)$.`
    },
    {
      qNum: "Q3",
      question: "What is the concrete difference between gRPC Bidirectional Streaming and WebSockets?",
      answer: `While both offer two-way communication, <strong>gRPC Bidirectional Streaming</strong> operates over standard <strong>HTTP/2 streams</strong> within a strongly-typed RPC contract defined by Protobuf stubs, automatically benefiting from HTTP/2 flow control, stream priorities, and microservice infrastructure (Envoy, Istio). <strong>WebSockets</strong> operates over raw <strong>TCP</strong> after an initial HTTP 101 handshake, with no built-in schema, no typing, and no native multiplexing, making it best suited for public browser-to-server connections rather than internal service-to-service communication.`
    },
    {
      qNum: "Q4",
      question: "Why is HTTP edge caching trivial in REST but notoriously difficult in GraphQL?",
      answer: `In <strong>REST</strong>, each resource has a distinct URL (e.g. <code>GET /products/42</code>) that acts as a global cache key. Standard CDNs and reverse proxies cache the response based on the URL and HTTP headers (<code>Cache-Control</code>, <code>ETag</code>). In <strong>GraphQL</strong>, virtually all requests are sent as <code>POST /graphql</code> with the query hidden inside the JSON body. Because CDNs do not cache POST requests by default, GraphQL requires complex client-side normalized caches (e.g. Apollo Client) or specialized edge gateway extensions.`
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
              2.6 REST vs. GraphQL vs. gRPC vs. WebSockets
            </h2>
          </div>
        </div>

        <!-- Definition Callout -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Distributed system components must agree on communication protocols, serialization formats, and API contracts. The four dominant paradigms serve fundamentally distinct architectural tiers:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-blue-300 uppercase">REST (Resource-Oriented)</span>
              <p class="text-[11.5px] text-slate-300">Universal standard for public APIs. HTTP verbs, URL resource paths, JSON payloads, and native CDN edge cacheability.</p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">GraphQL (Client-Driven)</span>
              <p class="text-[11.5px] text-slate-300">Single endpoint. Client queries exact shape of data. Eliminates over/under-fetching; ideal for bandwidth-constrained mobile apps.</p>
            </div>

            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">gRPC (Contract-Driven RPC)</span>
              <p class="text-[11.5px] text-slate-300">High-performance microservice RPC. Binary Protocol Buffers over HTTP/2 with code-generated client/server stubs.</p>
            </div>

            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">WebSockets (Bidirectional)</span>
              <p class="text-[11.5px] text-slate-300">Persistent full-duplex TCP connection. Minimal frame headers; purpose-built for real-time collaborative applications and live streams.</p>
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
            THE GRAPHQL N+1 PROBLEM & QUERY COMPLEXITY ATTACKS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            GraphQL gives frontend clients immense flexibility, which can compromise backend stability. First, naive nested resolution creates the <strong>N+1 Query Problem</strong>, executing hundreds of database calls for a single HTTP query (mitigate with Facebook's <strong>DataLoader</strong> batching). Second, malicious or poorly constructed nested queries (e.g. <code>author { books { author { books ... } } }</code>) can trigger <strong>Query Bomb DoS attacks</strong>. In production, always enforce <em>query depth limiting</em>, <em>query complexity cost analysis</em>, and disable introspection in public endpoints.
          </p>
        </div>

        <!-- Green Callout: Senior Perspective - The BFF Pattern -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: THE "BACKEND FOR FRONTEND" (BFF) PATTERN
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Senior architects avoid treating API paradigms as mutually exclusive. The dominant enterprise pattern is the <strong>Backend-For-Frontend (BFF)</strong>: Deploy high-performance <strong>gRPC</strong> for internal service-to-service RPC communication inside the secure VPC, where binary Protobuf reduces serialization CPU overhead and bandwidth. At the perimeter, front the architecture with a BFF layer (Node.js/Go) that translates incoming client-facing <strong>GraphQL or REST</strong> requests into internal gRPC calls, aggregating diverse backend microservices into a single optimized response for web and mobile clients.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            When would you explicitly choose REST over gRPC even for internal microservices?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
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
                <p class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </p>
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
            Choose your API style based on consumer and architectural boundary: use REST for public and third-party APIs where caching and simplicity dominate; use gRPC for internal microservices where CPU efficiency and strict contracts are vital; use GraphQL for complex client aggregation via a BFF; and use WebSockets only when persistent, bidirectional communication is strictly required.
          </p>
        </div>

        <!-- Page 34 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 34</span>
        </div>

      </div>

    </div>
  `;
}
