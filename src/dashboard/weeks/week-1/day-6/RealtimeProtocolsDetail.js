/**
 * 2.7 Short Polling vs. Long Polling vs. WebSockets vs. SSE - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 34, 35, and 36
 * from The Modern System Design Interview Guide.
 */

export function renderRealtimeProtocolsContent(topic) {
  const realtimeComparisonRows = [
    {
      dimension: "Mental Model",
      shortPoll: "Kid in back seat asking 'Are we there yet?' every 3s",
      longPoll: "Phone call where you stay on hold until friend answers",
      sse: "FM Radio / Ticker tape: tower streams news to you 24/7",
      ws: "Full telephone call / intercom: both talk & listen at once"
    },
    {
      dimension: "Directionality",
      shortPoll: "Client → Server (Half-duplex, repetitive)",
      longPoll: "Client → Server (Half-duplex, hanging GET)",
      sse: "Server → Client (Unidirectional stream)",
      ws: "Client ↔ Server (Full-duplex bidirectional)"
    },
    {
      dimension: "Transport Protocol",
      shortPoll: "Standard HTTP/1.1 or HTTP/2",
      longPoll: "Standard HTTP/1.1 or HTTP/2",
      sse: "HTTP/1.1 or HTTP/2 (text/event-stream)",
      ws: "TCP socket (ws:// or wss:// via HTTP 101 Upgrade)"
    },
    {
      dimension: "Connection Lifecycle",
      shortPoll: "Ephemeral (Closed after every empty reply)",
      longPoll: "Semi-persistent (Held open ~30s until event or timeout)",
      sse: "Persistent long-lived HTTP stream",
      ws: "Persistent long-lived stateful TCP connection"
    },
    {
      dimension: "Header Overhead",
      shortPoll: "Massive (~500–1000 bytes sent per polling tick)",
      longPoll: "High (Full HTTP headers on each event cycle)",
      sse: "Minimal (1 HTTP handshake, then raw text frames)",
      ws: "Microscopic (2–10 bytes framing overhead per message)"
    },
    {
      dimension: "Latency Profile",
      shortPoll: "High (Delay equals polling interval, e.g., up to 5s)",
      longPoll: "Low (Pushed instantly on event, then reconnect delay)",
      sse: "Ultra-low (<10ms instant server push over open stream)",
      ws: "Ultra-low (<5ms instant bidirectional push)"
    },
    {
      dimension: "Auto-Reconnection",
      shortPoll: "Manual (Managed by client setInterval / timer)",
      longPoll: "Manual (Managed by client recursive fetch loop)",
      sse: "Built-in native browser auto-reconnect + Last-Event-ID",
      ws: "Manual (Client must implement heartbeat & retry logic)"
    },
    {
      dimension: "HTTP/2 Multiplexing",
      shortPoll: "Yes",
      longPoll: "Yes",
      sse: "Yes (Multiple streams share 1 single TCP connection)",
      ws: "No (Bypasses HTTP/2 framing; occupies dedicated TCP pipe)"
    },
    {
      dimension: "Firewalls & Proxies",
      shortPoll: "100% standard HTTP (Never blocked)",
      longPoll: "100% standard HTTP (Standard timeouts apply)",
      sse: "100% standard HTTP (Traverses corporate firewalls easily)",
      ws: "Often dropped or closed by strict firewalls / intermediate proxies"
    },
    {
      dimension: "Primary Best Fit",
      shortPoll: "Low-frequency background checks (e.g., flight status every 15m)",
      longPoll: "Legacy fallback when WebSockets / SSE are blocked",
      sse: "LLM token streaming (ChatGPT), live sports tickers, notifications",
      ws: "Live chat (Slack/Discord), collaborative docs (Figma), multiplayer games"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Why is Server-Sent Events (SSE) significantly superior to WebSockets for LLM token streaming (e.g., ChatGPT / Claude)?",
      answer: `Generative AI inference is strictly <strong>unidirectional</strong>: the user submits a prompt once via HTTP POST, and the backend LLM streams dozens of token chunks sequentially over 5 to 30 seconds. <strong>SSE</strong> is purpose-built for this exact pattern:
      <br/><br/>
      1. <strong>Standard HTTP/2 Multiplexing:</strong> With HTTP/2, all SSE streams across multiple browser tabs share a <em>single</em> TCP connection, preventing socket exhaustion. WebSockets require a separate dedicated TCP socket per connection.
      <br/>
      2. <strong>Native Auto-Reconnection &amp; Resumption:</strong> The browser's native <code>EventSource</code> API automatically reconnects if the connection drops, sending the <code>Last-Event-ID</code> header so the server resumes streaming exactly where it left off without duplicate tokens.
      <br/>
      3. <strong>Effortless Infrastructure:</strong> SSE traverses corporate firewalls, reverse proxies, and standard Layer 7 load balancers (ALB, Nginx) without special connection upgrade protocols or custom sticky routing.`
    },
    {
      qNum: "Q2",
      question: "How do you scale WebSockets horizontally across a distributed cluster of servers?",
      answer: `Because WebSockets are stateful, long-lived TCP connections, Client A connected to Server 1 cannot talk directly to Client B connected to Server 2. To scale horizontally:
      <br/><br/>
      1. <strong>Distributed Message Broker (Pub/Sub Backplane):</strong> Place a high-throughput message broker like <strong>Redis Pub/Sub, Apache Kafka, or NATS</strong> behind the WebSocket gateway tier.
      <br/>
      2. <strong>Channel Subscription:</strong> When Client A connects to Server 1 and joins Room 42, Server 1 subscribes to the Redis channel <code>room:42</code>.
      <br/>
      3. <strong>Cross-Node Broadcast:</strong> When Client B (on Server 2) sends a message to Room 42, Server 2 publishes the message to Redis. Redis broadcasts it to all subscribed servers (including Server 1), which immediately pushes it down the open socket to Client A.
      <br/>
      4. <strong>Session Registry:</strong> Maintain an in-memory Redis key-value mapping (<code>user_id → server_id</code>) so 1-on-1 direct messages route directly to the specific server holding that user's socket.`
    },
    {
      qNum: "Q3",
      question: "How do you handle load balancing and server failover with persistent WebSockets without causing a Thundering Herd?",
      answer: `WebSockets cannot be load balanced per-request because all messages flow inside one persistent TCP pipe. 
      <br/><br/>
      1. <strong>Least-Connections Dispatch:</strong> Layer 7 load balancers (e.g., AWS ALB or Envoy) inspect the <code>Upgrade: websocket</code> header and dispatch new connections using <em>Least Connections</em> rather than Round Robin, preventing connection clustering on single instances.
      <br/>
      2. <strong>The Thundering Herd Trap:</strong> When a WebSocket server crashes or restarts during a deployment, 100,000 clients disconnect simultaneously and immediately attempt to reconnect in the same millisecond, crushing surviving nodes in a cascading failure.
      <br/>
      3. <strong>Mitigation (Jittered Exponential Backoff):</strong> Clients must wait a randomized delay before retrying: <code>delay = min(max_delay, base * 2^attempt) + random_jitter</code>. This spreads reconnection spikes smoothly over 30–60 seconds.`
    },
    {
      qNum: "Q4",
      question: "What is the difference between WebSocket protocol ping/pong frames and application-level heartbeats?",
      answer: `<strong>Protocol-Level Ping/Pong (RFC 6455 Opcode 0x9 / 0xA):</strong> Operates at the transport layer directly inside the browser network stack and web server. It does not invoke JavaScript application code. Its purpose is to reset idle timers on NAT routers, firewall state tables, and load balancers so they do not silently sever idle TCP connections.
      <br/><br/>
      <strong>Application-Level Heartbeats:</strong> JSON messages (e.g., <code>{"type": "heartbeat", "timestamp": 1720000000}</code>) parsed by client JS and backend application event loops. Necessary to verify that the application server process is healthy and its event loop is actually processing messages, rather than hung on a synchronous CPU lockup or thread pool deadlock while the TCP socket remains deceptively open.`
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
          <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed pl-4">
            Traditional HTTP is purely request-response: the browser asks, the server answers, and the conversation ends. Modern applications require real-time updates pushed from server to client. Here is how the four competing architectures work, when to choose each, and how to scale them to millions of users.
          </p>
        </div>

        <!-- Plain-English Mental Models -->
        <div class="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-indigo-400">psychology</span>
            <span class="font-code text-[12px] font-bold text-indigo-300 uppercase tracking-wider">
              Everyday Mental Models (How to Explain Them in an Interview)
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
            <div class="bg-[#0F1626]/80 border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-amber-300 font-code text-[11px]">Short Polling = "Are We There Yet?"</strong>
              <p class="text-slate-300">Like a restless kid asking every 5 seconds. Simple to code, but 99% of requests return "No", wasting network bandwidth and hammering your database with empty queries.</p>
            </div>
            <div class="bg-[#0F1626]/80 border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-cyan-300 font-code text-[11px]">Long Polling = "Call Me Back When Ready"</strong>
              <p class="text-slate-300">You call and stay on hold. The agent answers only when your order is ready, then hangs up. Low delivery latency, but you must dial all over again for the next update.</p>
            </div>
            <div class="bg-[#0F1626]/80 border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-emerald-300 font-code text-[11px]">SSE = Radio Broadcast / Ticker Tape</strong>
              <p class="text-slate-300">You tune your receiver once over standard HTTP. Whenever the radio station has news, they broadcast it down your antenna. One-way, lightweight, auto-reconnecting.</p>
            </div>
            <div class="bg-[#0F1626]/80 border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
              <strong class="text-indigo-300 font-code text-[11px]">WebSockets = Two-Way Telephone Call</strong>
              <p class="text-slate-300">You dial once, establish an open open-ended line, and both people talk and listen simultaneously with zero delay. Perfect for live chat and multiplayer games.</p>
            </div>
          </div>
        </div>

        <!-- TIMING & INTERACTION FLOW DIAGRAM -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                COMMUNICATION LIFECYCLE &amp; PACKET SEQUENCING: POLLING VS STREAMING (SSE &amp; WEBSOCKETS)
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-medium">Short vs. Long Polling</span>
              <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">SSE vs. WebSockets (Full-Duplex)</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/communication-lifecycle-polling-vs-streaming.png" 
                alt="Communication Lifecycle & Packet Sequencing: Polling vs Streaming (SSE & WebSockets)" 
                class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/communication-lifecycle-polling-vs-streaming.png', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">Polling Mechanisms (Client-driven) ↔ Streaming Mechanisms (Persistent Server-push)</span>
            </div>
          </div>

          <!-- 4-Mechanism Architecture Callout Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-[11.5px] font-sans">
            <!-- Short Polling -->
            <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-amber-800 uppercase tracking-wide">Short Polling</span>
                <span class="px-1.5 py-0.5 rounded bg-amber-200/60 font-code text-[10px] text-amber-800">Interval</span>
              </div>
              <p class="text-amber-900/80 text-[11.5px] leading-relaxed">
                Client issues HTTP GET on a fixed timer (e.g., every 3s). Simple to implement, but repeated handshakes, wasted headers, and latency bounded by polling interval.
              </p>
              <div class="mt-auto pt-1 border-t border-amber-200/60 flex flex-col gap-0.5 text-[11px] text-amber-900">
                <span>• Repeated HTTP GET &amp; connection teardown</span>
                <span>• High latency (data sits waiting until next tick)</span>
              </div>
            </div>

            <!-- Long Polling -->
            <div class="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Long Polling (Hanging GET)</span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-200/60 font-code text-[10px] text-emerald-800">Push-on-event</span>
              </div>
              <p class="text-emerald-900/80 text-[11.5px] leading-relaxed">
                Client requests; server holds connection open until event arrives or timeout (~30s). Returns immediately on event; client immediately opens a new hanging request.
              </p>
              <div class="mt-auto pt-1 border-t border-emerald-200/60 flex flex-col gap-0.5 text-[11px] text-emerald-900">
                <span>• Near real-time event delivery</span>
                <span>• Still incurs full HTTP header overhead per event</span>
              </div>
            </div>

            <!-- Server-Sent Events -->
            <div class="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200 text-cyan-950 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-cyan-800 uppercase tracking-wide">Server-Sent Events (SSE)</span>
                <span class="px-1.5 py-0.5 rounded bg-cyan-200/60 font-code text-[10px] text-cyan-800">Unidirectional</span>
              </div>
              <p class="text-cyan-900/80 text-[11.5px] leading-relaxed">
                Persistent unidirectional stream (Server → Client) over standard HTTP/2 (<code>text/event-stream</code>). Native browser auto-reconnect, event IDs, and zero proxy friction.
              </p>
              <div class="mt-auto pt-1 border-t border-cyan-200/60 flex flex-col gap-0.5 text-[11px] text-cyan-900">
                <span>• Native HTTP/2 multiplexing (1 TCP socket)</span>
                <span>• Ideal for ChatGPT token streaming &amp; dashboards</span>
              </div>
            </div>

            <!-- WebSockets -->
            <div class="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-indigo-800 uppercase tracking-wide">WebSockets (Full-Duplex)</span>
                <span class="px-1.5 py-0.5 rounded bg-indigo-200/60 font-code text-[10px] text-indigo-800">Bidirectional</span>
              </div>
              <p class="text-indigo-900/80 text-[11.5px] leading-relaxed">
                Persistent bidirectional TCP socket initiated via HTTP 101 Upgrade. 2–10 byte frame overhead; lowest possible latency for high-frequency interactive exchanges.
              </p>
              <div class="mt-auto pt-1 border-t border-indigo-200/60 flex flex-col gap-0.5 text-[11px] text-indigo-900">
                <span>• Full-duplex TCP socket (Client ↔ Server)</span>
                <span>• Requires distributed Pub/Sub backplane to scale</span>
              </div>
            </div>
          </div>

          <!-- Bottom Key Takeaway Callout (from diagram footer) -->
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div class="flex items-center gap-2 shrink-0">
              <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[13px] font-bold">✓</span>
              <span class="font-sans font-bold text-[13px] text-emerald-900">Key Takeaway</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[11.5px] text-emerald-950/90 leading-relaxed">
              <div>• Polling creates connection churn; long polling reduces churn by keeping connection open.</div>
              <div>• SSE uses standard HTTP/2 and is simpler for unidirectional push (server → client).</div>
              <div>• SSE and WebSockets maintain persistent channels for near-instant message delivery.</div>
              <div>• WebSockets bypass HTTP framing after 101 upgrade for full-duplex bi-directional transport.</div>
            </div>
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
                  <th class="p-3 text-emerald-200">Server-Sent Events (SSE)</th>
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
            THE HTTP/1.1 SSE MAX CONNECTION TRAP (CRITICAL INTERVIEW GOTCHA)
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Browsers enforce a hard limit of <strong>6 concurrent HTTP/1.1 connections per host domain</strong>. Because an SSE connection is persistent and never closes, opening 6 browser tabs with an active SSE stream completely exhausts the browser's connection pool. A 7th tab or any subsequent <code>fetch()</code> request to that domain will <strong>hang indefinitely</strong>! 
            <br/><br/>
            <strong>Mandatory Production Architecture:</strong> Always serve SSE over <strong>HTTP/2</strong>. Under HTTP/2, all SSE streams, AJAX calls, and asset requests are multiplexed over a single shared TCP connection, completely eliminating the 6-connection per-host ceiling.
          </p>
        </div>

        <!-- Green Callout: Senior Perspective - Scaling WebSockets to 1,000,000 Connections -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            STAFF PERSPECTIVE: SCALING WEBSOCKETS TO 1,000,000 CONCURRENT CONNECTIONS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In system design interviews, demonstrating how to scale WebSockets from 1,000 to 1,000,000 active connections reveals true production depth:
          </p>
          <ul class="text-[12.5px] text-slate-300 font-sans flex flex-col gap-2 pt-1">
            <li>• <strong class="text-emerald-300 font-code">1. OS Kernel Tuning (File Descriptors):</strong> Every open TCP connection is a file descriptor in Linux. You must elevate limits via <code>fs.file-max</code> and <code>/etc/security/limits.conf</code> to 2,000,000+, and trim TCP socket buffer sizes (<code>tcp_rmem</code>, <code>tcp_wmem</code>) down from 128KB to ~4KB so idle connections do not exhaust system RAM.</li>
            <li>• <strong class="text-emerald-300 font-code">2. Asynchronous Event Loops (epoll/kqueue):</strong> Avoid 1-thread-per-connection models (traditional Java/Apache) which blow up RAM. Use event-driven non-blocking runtimes (Go goroutines, Node.js libuv, or Rust Tokio with <code>epoll</code>) to handle 50,000+ idle connections per node using negligible CPU.</li>
            <li>• <strong class="text-emerald-300 font-code">3. Distributed Message Backplane (Redis/NATS):</strong> Individual WebSocket instances are isolated. Connect your gateway fleet via a distributed Pub/Sub broker (Redis Pub/Sub or NATS JetStream) so servers cross-broadcast messages across connected nodes.</li>
            <li>• <strong class="text-emerald-300 font-code">4. Thundering Herd Jitter:</strong> During deployments or server crashes, 100,000+ sockets drop at once. Enforce randomized jittered exponential backoff on client reconnects to prevent a tsunami of SYN packets from knocking down surviving nodes.</li>
          </ul>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            If an interviewer asks you to design Slack or Discord, would you use SSE or WebSockets? (Answer: WebSockets, because user typing indicators and instant message sending require low-overhead client-to-server pushes.)
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS &amp; COMMON SYSTEM DESIGN TRAPS
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
            Never default to WebSockets just because a feature is "real-time". If the communication is strictly one-way server-to-client (notifications, live dashboard metrics, LLM token streams), <strong>Server-Sent Events (SSE) over HTTP/2</strong> is vastly simpler, auto-reconnects natively, and traverses corporate firewalls effortlessly. Reserve <strong>WebSockets</strong> strictly for high-frequency, bidirectional interactions like chat, collaborative documents, and multiplayer games.
          </p>
        </div>

        <!-- Page 36 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Pages 34–36 · Section 2.7</span>
        </div>

      </div>

    </div>
  `;
}
