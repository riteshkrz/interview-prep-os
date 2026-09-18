/**
 * 2.7 Short Polling vs. Long Polling vs. WebSockets vs. SSE - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 34, 35, and 36
 * from The Modern System Design Interview Guide.
 */

export function renderRealtimeProtocolsContent(topic) {
  const realtimeComparisonRows = [
    {
      dimension: "Directionality",
      shortPoll: "Client → Server (Half-duplex)",
      longPoll: "Client → Server (Half-duplex)",
      sse: "Server → Client (Unidirectional)",
      ws: "Bidirectional (Full-duplex)"
    },
    {
      dimension: "Transport Protocol",
      shortPoll: "HTTP/1.1 or HTTP/2",
      longPoll: "HTTP/1.1 or HTTP/2",
      sse: "HTTP/1.1 or HTTP/2 (text/event-stream)",
      ws: "TCP (ws:// or wss:// via HTTP 101)"
    },
    {
      dimension: "Connection Lifecycle",
      shortPoll: "Ephemeral (Closed after response)",
      longPoll: "Semi-persistent (Held until event)",
      sse: "Persistent long-lived HTTP stream",
      ws: "Persistent long-lived TCP connection"
    },
    {
      dimension: "Header Overhead",
      shortPoll: "Enormous (Full headers every tick)",
      longPoll: "High (Full headers per event)",
      sse: "Minimal (1 handshake, then raw data)",
      ws: "Minimal (2 – 10 bytes per frame)"
    },
    {
      dimension: "Latency Profile",
      shortPoll: "High (Up to polling interval)",
      longPoll: "Low (Push on event, re-handshake)",
      sse: "Ultra-low (Instant server push)",
      ws: "Ultra-low (Instant two-way push)"
    },
    {
      dimension: "Reconnection Logic",
      shortPoll: "Handled by setInterval loop",
      longPoll: "Handled by client fetch loop",
      sse: "Built-in browser auto-reconnect",
      ws: "Manual (Application ping/pong logic)"
    },
    {
      dimension: "HTTP/2 Multiplexing",
      shortPoll: "Yes",
      longPoll: "Yes",
      sse: "Yes (Shares 1 TCP connection)",
      ws: "No (Bypasses HTTP/2 framing)"
    },
    {
      dimension: "Firewall / Proxy Friendliness",
      shortPoll: "100% standard HTTP",
      longPoll: "100% standard HTTP",
      sse: "100% standard HTTP",
      ws: "May be dropped/closed by proxies"
    },
    {
      dimension: "Optimal Use Case",
      shortPoll: "Low-frequency background updates",
      longPoll: "Legacy fallback systems",
      sse: "LLM token streaming, notifications, tickers",
      ws: "Chat, multiplayer games, collaborative docs"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why is Server-Sent Events (SSE) significantly superior to WebSockets for LLM token streaming (e.g. ChatGPT)?",
      answer: `Generative AI inference is strictly <strong>unidirectional</strong>: the client submits one prompt via HTTP POST, and the LLM streams back dozens of text chunks sequentially over several seconds. <strong>SSE</strong> is engineered precisely for this: it runs over standard HTTP, natively supports <strong>HTTP/2 multiplexing</strong> (preventing browser socket exhaustion across tabs), has built-in automatic reconnection with <code>Last-Event-ID</code> resume tokens, and passes seamlessly through corporate firewalls and standard load balancers without requiring specialized WebSocket connection upgrade infrastructure.`
    },
    {
      qNum: "Q2",
      question: "How do you scale WebSockets horizontally across a distributed cluster of servers?",
      answer: `Because WebSockets are stateful, long-lived TCP connections, Client A connected to Server 1 cannot receive a message published by Client B connected to Server 2. To scale horizontally, introduce a <strong>distributed Pub/Sub message broker backplane</strong> (such as <strong>Redis Pub/Sub, Kafka, or NATS</strong>). Each WebSocket node subscribes to relevant channels. When Server 2 receives a chat message, it publishes it to the broker, which broadcasts it to Server 1, which pushes it down Client A's open socket.`
    },
    {
      qNum: "Q3",
      question: "How do you handle load balancing and server failover with persistent WebSockets?",
      answer: `WebSockets cannot be load balanced per-request because all communication occurs within a single TCP session. Standard Layer 7 load balancers (e.g. NGINX, ALB) inspect the <code>Upgrade: websocket</code> header and establish a persistent TCP tunnel to a backend node using <em>Least Connections</em> balancing. When a WebSocket node crashes or undergoes deployment, thousands of clients disconnect simultaneously. To avoid a <strong>Thundering Herd</strong> reconnect storm on surviving nodes, clients must implement <strong>jittered exponential backoff</strong> upon reconnection.`
    },
    {
      qNum: "Q4",
      question: "What is the difference between WebSocket protocol ping/pong frames and application heartbeats?",
      answer: `<strong>WebSocket Protocol Ping/Pong (Opcode 0x9 / 0xA):</strong> Defined at the RFC 6455 transport layer. Handled directly by the browser network stack and web server without bubbling up to JavaScript code. It keeps NAT routers and firewall state tables from closing idle TCP connections.<br/><strong>Application-Level Heartbeats:</strong> JSON messages (e.g. <code>{\"type\": \"ping\"}</code>) parsed by client JS and application code. Necessary to verify that the application event loop is actually responsive and not locked up in heavy synchronous processing.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 34, 35, 36: REALTIME COMMUNICATION PROTOCOLS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              2.7 Short Polling vs. Long Polling vs. WebSockets vs. Server-Sent Events (SSE)
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            HTTP is historically a request-response protocol where the client initiates all communication. Modern applications require real-time asynchronous data delivery from server to client. Four competing architectures solve this problem with distinct scalability and operational trade-offs:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-slate-400 uppercase">Short Polling</span>
              <p class="text-[11.5px] text-slate-300">Periodic requests on a fixed timer. High latency, massive wasted header bandwidth, and severe database load under scale.</p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">Long Polling (Comet)</span>
              <p class="text-[11.5px] text-slate-300">Server holds request open until event arrives. Near instant delivery; client immediately opens a replacement request.</p>
            </div>

            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">Server-Sent Events (SSE)</span>
              <p class="text-[11.5px] text-slate-300">Persistent unidirectional HTTP stream. Built-in browser reconnection, event IDs, and native HTTP/2 multiplexing.</p>
            </div>

            <div class="bg-[#0F1626] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-indigo-300 uppercase">WebSockets</span>
              <p class="text-[11.5px] text-slate-300">Full-duplex bidirectional TCP connection. 2-byte frame overhead; ideal for two-way collaborative apps, gaming, and chat.</p>
            </div>
          </div>
        </div>

        <!-- TIMING & INTERACTION FLOW DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              COMMUNICATION LIFECYCLE & PACKET SEQUENCING
            </span>
            <span class="text-[11px] font-code text-slate-500">Architecture Flow Comparison</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Short vs Long Polling -->
            <div class="bg-[#0F1626] p-4 rounded-xl border border-slate-700/50 flex flex-col gap-2">
              <span class="text-[11.5px] font-code font-bold text-cyan-300">POLLING MECHANISMS</span>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
SHORT POLLING:
Client ──GET /data──► Server ──200 (No data)──► Client
[ Sleep 3s ]
Client ──GET /data──► Server ──200 (No data)──► Client
[ Sleep 3s ]
Client ──GET /data──► Server ──200 (Event!)──► Client

LONG POLLING (Hanging GET):
Client ──GET /data──► Server (Holds connection open...)
                      Server ──200 (Event!)──► Client
Client ──GET /data──► Server (Immediately re-opens)
              </div>
            </div>

            <!-- SSE vs WebSockets -->
            <div class="bg-[#0F1626] p-4 rounded-xl border border-indigo-500/30 flex flex-col gap-2">
              <span class="text-[11.5px] font-code font-bold text-indigo-300">STREAMING MECHANISMS</span>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
SERVER-SENT EVENTS (SSE):
Client ──GET /events (text/event-stream)──► Server
Client ◄── event: update \n data: {...} ── Server
Client ◄── event: update \n data: {...} ── Server (Stream stays open!)

WEBSOCKETS (Full-Duplex):
Client ──GET (Upgrade: websocket)──► Server ──101──► Client
Client ══════════════ Full-Duplex TCP Socket ══════════════ Server
Client ─── frame ───► Server | Server ─── frame ───► Client
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] font-code text-cyan-300 pt-1">
            <span>▲ Polling creates connection churn; SSE and WebSockets maintain persistent channels</span>
            <span class="text-slate-500 font-sans">SSE uses standard HTTP/2; WebSockets bypasses HTTP framing</span>
          </div>
        </div>

        <!-- 4-WAY COMPARISON MATRIX TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            REAL-TIME COMMUNICATION DIMENSIONAL COMPARISON MATRIX
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3 w-40">Dimension</th>
                  <th class="p-3 text-slate-300">Short Polling</th>
                  <th class="p-3 text-cyan-200">Long Polling</th>
                  <th class="p-3 text-emerald-200">Server-Sent Events</th>
                  <th class="p-3 text-indigo-200">WebSockets</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12px]">
                ${realtimeComparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white font-code text-[11.5px]">${row.dimension}</td>
                    <td class="p-3 text-slate-400">${row.shortPoll}</td>
                    <td class="p-3 text-cyan-300">${row.longPoll}</td>
                    <td class="p-3 text-emerald-300 font-semibold">${row.sse}</td>
                    <td class="p-3 text-indigo-300 font-semibold">${row.ws}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The HTTP/1.1 6-Connection SSE Ceiling Trap -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE HTTP/1.1 SSE MAX CONNECTION TRAP
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Browsers enforce a strict limit of <strong>6 concurrent HTTP/1.1 connections per host domain</strong>. Because an SSE connection is persistent and never closes, opening 6 browser tabs with an active SSE stream completely saturates the browser's connection pool. A 7th tab or any subsequent fetch request to the same domain will hang indefinitely! <em>Mandatory Production Architecture:</em> Always serve SSE over <strong>HTTP/2</strong>, where all SSE streams and asset requests are multiplexed over a single TCP connection, eliminating the per-domain connection limit entirely.
          </p>
        </div>

        <!-- Green Callout: Senior Perspective - Scaling WebSockets to 1,000,000 Connections -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: SCALING WEBSOCKETS TO 1,000,000 CONCURRENT CONNECTIONS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, demonstrating how to scale WebSockets from 1,000 to 1,000,000 active connections reveals true staff-level engineering depth:
          </p>
          <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-1.5 pt-1">
            <li>• <strong class="text-emerald-300 font-code">OS Kernel Tuning:</strong> Elevate Linux file descriptor limits via <code>fs.file-max</code> and <code>nofile</code> to 2,000,000+, and reduce TCP buffer memory (<code>tcp_rmem</code>, <code>tcp_wmem</code>) to prevent RAM exhaustion.</li>
            <li>• <strong class="text-emerald-300 font-code">Asynchronous I/O Event Loops:</strong> Use non-blocking, event-driven engines (Go goroutines, Node.js libuv, or Rust Tokio with <code>epoll/kqueue</code>) to manage tens of thousands of idle connections per node with under 4KB of RAM per socket.</li>
            <li>• <strong class="text-emerald-300 font-code">Distributed Message Backplane:</strong> Back WebSocket gateways with a low-latency <strong>Redis Pub/Sub</strong> or <strong>NATS</strong> message bus so nodes can cross-route messages to clients connected to different server instances.</li>
          </ul>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why is SSE significantly better suited than WebSockets for generative AI token streaming (e.g. ChatGPT)?
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
            Do not choose WebSockets by default. If your traffic pattern is unidirectional server-to-client (notifications, live metrics, LLM token streams), Server-Sent Events (SSE) over HTTP/2 is simpler, more resilient, and traverses proxies effortlessly. Reserve WebSockets strictly for true bidirectional, full-duplex communication like chat, gaming, and live collaborative canvases.
          </p>
        </div>

        <!-- Page 36 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 36</span>
        </div>

      </div>

    </div>
  `;
}
