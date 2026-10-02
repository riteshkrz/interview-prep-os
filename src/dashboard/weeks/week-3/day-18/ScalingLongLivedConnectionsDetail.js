/**
 * 11.5 Scaling Long-Lived Connections - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 141 and 142
 * from The Modern System Design Interview Guide.
 */

export function renderScalingLongLivedConnectionsContent(topic) {
  const protocolComparison = [
    {
      protocol: "WebSocket",
      direction: "Full-duplex (Bidirectional)",
      transport: "TCP / Single persistent socket (HTTP/1.1 Upgrade)",
      framing: "Binary framing (2–10 byte overhead per message frame)",
      reconnect: "Manual client implementation required",
      bestFit: "Real-time chat, multiplayer gaming, financial order books, collaborative whiteboards",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      protocol: "Server-Sent Events (SSE)",
      direction: "Half-duplex (Server-to-Client push only)",
      transport: "Standard HTTP/1.1 or HTTP/2 persistent stream",
      framing: "Text UTF-8 plain stream (data: ...\\n\\n)",
      reconnect: "Built-in automatic reconnection with Last-Event-ID resume",
      bestFit: "Live sports scores, LLM token streaming (ChatGPT), stock price feeds, system alerts",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      protocol: "Long Polling",
      direction: "Simulated Push via sequential HTTP requests",
      transport: "New HTTP request held open until timeout or server event",
      framing: "Full HTTP header overhead (500–1000 bytes) on every message",
      reconnect: "Inherent to loop mechanism",
      bestFit: "Legacy browser fallback where WebSockets or HTTP streaming are blocked by corporate proxies",
      badgeColor: "text-rose-400 bg-rose-500/15 border-rose-500/30"
    },
    {
      protocol: "gRPC Streaming",
      direction: "Bidirectional or Unidirectional",
      transport: "HTTP/2 multiplexed TCP connection",
      framing: "Binary Protobuf encoding; high throughput and strict schema typing",
      reconnect: "Handled by gRPC client library backoff policies",
      bestFit: "Internal service-to-service streaming, mobile apps, telemetry data pipelines",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const kernelTunings = [
    {
      param: "fs.file-max & ulimit -n",
      defaultVal: "1024 or 4096 descriptors",
      tunedVal: "2,097,152 (2M+)",
      purpose: "Every open TCP socket is an OS file descriptor. Prevents 'EMFILE: Too many open files' fatal crash."
    },
    {
      param: "net.ipv4.tcp_rmem / tcp_wmem",
      defaultVal: "128 KB per buffer (256 KB total)",
      tunedVal: "4096 8192 16384 (min 4KB, def 8KB)",
      purpose: "Shrinks idle connection memory from 256GB/1M sockets down to ~12GB/1M sockets in kernel space."
    },
    {
      param: "net.ipv4.ip_local_port_range",
      defaultVal: "32768 to 60999 (28k ports)",
      tunedVal: "1024 to 65535 (64k ports)",
      purpose: "Expands outbound ephemeral source port pool for reverse proxies connecting to downstream servers."
    },
    {
      param: "net.core.somaxconn",
      defaultVal: "128 or 4096",
      tunedVal: "65,535",
      purpose: "Maximum backlog of incomplete TCP handshakes queued in the kernel listen queue during connection bursts."
    }
  ];

  const memoryCostBreakdown = [
    {
      layer: "1. Kernel Socket Buffer (rmem + wmem)",
      perConn: "~8 KB (Tuned down from 128 KB)",
      scale10M: "80 GB Kernel RAM",
      notes: "Minimizing initial buffer allocation for idle sockets allows massive socket packing."
    },
    {
      layer: "2. Linux Kernel Socket Struct (struct sock)",
      perConn: "~3.25 KB fixed struct size",
      scale10M: "32.5 GB Kernel RAM",
      notes: "OS internal networking stack representation per TCP connection."
    },
    {
      layer: "3. Gateway Runtime Struct (Go / Rust epoll)",
      perConn: "~2.5 KB user-space state",
      scale10M: "25 GB User-space RAM",
      notes: "Contains user ID mapping, channel subscription pointer, and crypto TLS session state."
    },
    {
      layer: "4. Total Cluster Memory for 10M Sockets",
      perConn: "~13.75 KB total per socket",
      scale10M: "137.5 GB RAM Total",
      notes: "Comfortably distributed across 5 to 10 standard 32GB cloud instances!"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Linux Kernel Memory Sizing for 1M Idle WebSockets: TCP Buffers & sk_buff Overhead",
      answer: "Work from the Linux kernel primitives: (1) <strong>Kernel Socket Buffers</strong>: Tuning <code>tcp_rmem</code> and <code>tcp_wmem</code> to a 4KB minimum allocates $\\approx 8\\text{ KB}$ per socket. For 1M sockets, this requires $1,000,000 \\times 8\\text{ KB} \\approx 8\\text{ GB}$ kernel RAM. (2) <strong>Kernel Socket Data Structures</strong>: Linux <code>struct sock</code> and <code>struct sk_buff</code> consume $\\approx 3.25\\text{ KB}$ per connection ($3.25\\text{ GB}$). (3) <strong>Application Runtime Overhead</strong>: A high-performance non-blocking event loop runtime (Go goroutines with 2KB stack, or epoll C/Rust structs) requires $\\approx 2-4\\text{ KB}$ per connection ($2-4\\text{ GB}$). Total memory for 1M idle connections is $\\approx 14-16\\text{ GB}$ RAM. A standard 32GB or 64GB cloud instance comfortably handles 1M idle sockets if properly tuned."
    },
    {
      conceptId: "#02",
      title: "Cluster-Wide Socket Routing: Distributed Registries vs. Pub/Sub vs. Consistent Hash Rings",
      answer: "Three production routing patterns solve this: (1) <strong>Global Distributed Registry (Redis Hash / DynamoDB)</strong>: When User 42 connects to Gateway 7, the gateway writes <code>user:42 -&gt; gateway_7_ip</code> with a TTL refreshed by heartbeats. Server 1 looks up the gateway and forwards the message via internal gRPC. (2) <strong>Pub/Sub Backplane (Redis Pub/Sub / Kafka / NATS)</strong>: Each gateway subscribes to channels for its locally connected users. Server 1 publishes to channel <code>user:42:events</code>; only Gateway 7 picks it up. (3) <strong>Consistent Hashing on User ID</strong>: Connection servers are arranged in a consistent hash ring. User 42 always connects to Gateway $H(\\text{user\\_42})$. Server 1 hashes the ID and delivers directly without a shared lookup store."
    },
    {
      conceptId: "#03",
      title: "Server-Sent Events (SSE) vs. WebSockets: Unidirectional Streaming, Firewalls & HTTP/2",
      answer: "Choose Server-Sent Events (SSE) whenever communication is <strong>unidirectional (server-to-client only)</strong> and the client uses regular HTTP POST/PUT for actions. Examples: LLM streaming token generation (OpenAI ChatGPT API), live ticker prices, notification feeds, or sports score trackers. SSE advantages over WebSockets: (1) Operates over standard HTTP/1.1 and HTTP/2 (seamlessly traverses corporate firewalls, proxies, and API gateways that block WebSockets); (2) <strong>Built-in automatic reconnection with Last-Event-ID</strong> resume natively in the browser EventSource API; (3) Multiplexes over a single HTTP/2 TCP connection alongside regular API calls."
    },
    {
      conceptId: "#04",
      title: "Rolling Deployments on Stateful Fleets: Connection Draining & Reconnection Storm Jitter",
      answer: "Rebooting a server with 100,000 active connections immediately floods load balancers with 100,000 simultaneous reconnect handshakes. Production defense requires a 4-step rolling drain: (1) <strong>Deregister from Load Balancer</strong>: Mark the node as unhealthy in the LB so it receives no new handshakes. (2) <strong>Paced Disconnection with Jitter</strong>: The gateway iterates through its active sockets and sends a WebSocket close frame (Code 1001: Going Away) with a custom requested reconnect delay spread randomly across a 60–120 second window (e.g. at 1,000 closes per second). (3) <strong>Client Full Jitter Backoff</strong>: Client SDKs must implement exponential backoff with full jitter: $T = \\text{random}(0, \\min(T_{max}, T_{base} \\times 2^{attempt}))$. (4) <strong>Connection Rate-Limiting</strong>: The Layer 4 edge load balancer caps incoming TLS handshakes per second."
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 141: PART 11 BANNER & THE C10M PROBLEM FOUNDATIONS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- PART 11 Header Banner -->
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] p-6 text-white shadow-xl shadow-indigo-950/50 flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-extrabold uppercase tracking-widest text-indigo-200">
              PART 11 · NETWORKING & TRAFFIC INFRASTRUCTURE
            </span>
          </div>
          <h1 class="font-sans text-[24px] sm:text-[28px] font-black tracking-tight text-white leading-tight">
            Scaling Long-Lived Connections
          </h1>
          <p class="text-[13.5px] text-indigo-100/90 font-sans max-w-3xl leading-relaxed">
            The C10M Problem, Linux Kernel Epoll, Socket Buffer Tuning, Edge Gateways & Pub/Sub Backplanes
          </p>
        </div>

        <!-- Section Title: 11.5 Scaling Long-Lived Connections -->
        <div class="flex flex-col gap-2 pt-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-snug">
              11.5 Scaling Long-Lived Connections
            </h2>
          </div>
        </div>

        <!-- WHAT IT IS & WHY Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-cyan-400">
              <span class="material-symbols-outlined text-[20px]">help_outline</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHAT IT IS</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              Web applications designed to maintain persistent network connections for seconds to hours (WebSocket, SSE, gRPC streaming, persistent TCP) rather than single-request HTTP.
            </p>
          </div>

          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-indigo-400">
              <span class="material-symbols-outlined text-[20px]">lightbulb</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHY</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              Traditional thread-per-connection servers choke at 10k–50k concurrent connections. Modern chat, collaboration, stock tickers, and notification systems must hold 1M to 10M open sockets per cluster with minimal memory and CPU.
            </p>
          </div>
        </div>

        <!-- THE ARCHITECTURAL DECOUPLING: STATEFUL GATEWAY VS STATELESS BUSINESS TIER -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-6 flex flex-col gap-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">hub</span>
              THE PRODUCTION TWO-TIER PATTERN: SEPARATING SOCKETS FROM LOGIC
            </span>
            <span class="text-[10.5px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              1M+ Concurrent Sockets
            </span>
          </div>

          <div class="font-code text-[12px] sm:text-[13px] leading-relaxed text-slate-300 bg-[#070B14] p-5 rounded-lg border border-[#1E293B] overflow-x-auto">
  [ 1,000,000 Client WebSockets ]
             │
             ▼
  ┌─────────────────────────────────────────────────────────────┐
  │   <span class="text-indigo-400 font-bold">Layer 4 Load Balancer Tier (Maglev / Katran / AWS NLB)</span>    │
  │   Direct Server Return (DSR), TCP Passthrough               │
  └──────────────┬───────────────────────────────┬──────────────┘
                 │                               │
                 ▼                               ▼
  ┌─────────────────────────────┐ ┌─────────────────────────────┐
  │  <span class="text-amber-300 font-bold">STATEFUL GATEWAY NODE 1</span>    │ │  <span class="text-amber-300 font-bold">STATEFUL GATEWAY NODE 2</span>    │
  │  • Holds 500k raw sockets   │ │  • Holds 500k raw sockets   │
  │  • Epoll / Kqueue loop      │ │  • Epoll / Kqueue loop      │
  │  • Zero business logic      │ │  • Zero business logic      │
  └──────────────┬──────────────┘ └──────────────┬──────────────┘
                 │                               │
                 ▼                               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │        <span class="text-purple-400 font-bold">MESSAGE ROUTING BACKPLANE (Redis Pub/Sub / Kafka)</span>    │
  │  Subscribes to user channels; routes events across nodes   │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │        <span class="text-emerald-400 font-bold">STATELESS APPLICATION WORKERS (Autoscaled)</span>           │
  │  Processes business logic, database writes, validation      │
  └─────────────────────────────────────────────────────────────┘
          </div>

          <p class="text-[13px] text-slate-300 font-sans leading-relaxed">
            <strong>The Cardinal Rule of Stateful Connections:</strong> Never run business logic in the process that terminates sockets. If your application code crashes, leaks memory, or deploys a new version, a combined server severs 1 million persistent connections at once. Separating into an ultra-lean <em>Connection Gateway Tier</em> means gateways stay up for months while business workers deploy continuously.
          </p>
        </div>

        <!-- 10M CONNECTIONS MEMORY SIZING BREAKDOWN -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            SYSTEM MEMORY SIZING BREAKDOWN FOR 10,000,000 CONCURRENT CONNECTIONS
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
            <table class="w-full text-left text-[12px] font-sans border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                  <th class="p-3.5 font-bold w-[30%]">Memory Allocation Layer</th>
                  <th class="p-3.5 font-bold w-[22%]">Per Socket Size</th>
                  <th class="p-3.5 font-bold w-[20%] text-cyan-300">10M Connections Total</th>
                  <th class="p-3.5 font-bold w-[28%]">Architectural Engineering Impact</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] text-slate-300">
                ${memoryCostBreakdown.map(m => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="p-3.5 font-bold text-white font-code text-[11.5px]">${m.layer}</td>
                    <td class="p-3.5 text-amber-300 font-code text-[11px]">${m.perConn}</td>
                    <td class="p-3.5 font-bold text-cyan-300 font-code text-[11px]">${m.scale10M}</td>
                    <td class="p-3.5 text-slate-300 text-[11.5px] leading-relaxed">${m.notes}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Official Page 141 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 141</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 142: KERNEL TUNING, PROTOCOL COMPARISON & FOLLOW-UPS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Section Subtitle: Protocol Comparison -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              REAL-TIME TRANSPORT PROTOCOLS
            </span>
          </div>
          <h3 class="font-sans text-[20px] sm:text-[23px] font-bold text-white tracking-tight">
            WebSocket vs. SSE vs. Long Polling vs. gRPC Streaming
          </h3>
        </div>

        <!-- Protocols Table -->
        <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
          <table class="w-full text-left text-[12px] font-sans border-collapse">
            <thead>
              <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                <th class="p-3.5 font-bold">Protocol</th>
                <th class="p-3.5 font-bold">Directionality</th>
                <th class="p-3.5 font-bold">Framing Overhead</th>
                <th class="p-3.5 font-bold">Reconnection</th>
                <th class="p-3.5 font-bold">Best Use Case</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E293B] text-slate-300">
              ${protocolComparison.map(p => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3.5 font-bold text-white font-code text-[11.5px]">
                    <span class="px-2 py-0.5 rounded text-[10.5px] font-code border ${p.badgeColor}">
                      ${p.protocol}
                    </span>
                  </td>
                  <td class="p-3.5 font-sans">${p.direction}</td>
                  <td class="p-3.5 font-code text-[11px] text-slate-300">${p.framing}</td>
                  <td class="p-3.5 font-sans">${p.reconnect}</td>
                  <td class="p-3.5 font-sans text-cyan-200 text-[11.5px]">${p.bestFit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- OS KERNEL TUNING TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">tune</span>
            LINUX KERNEL SYSCTL TUNING FOR THE C10M CONNECTION PROFILE
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
            <table class="w-full text-left text-[12px] font-sans border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                  <th class="p-3.5 font-bold w-[28%]">Kernel Parameter</th>
                  <th class="p-3.5 font-bold w-[18%] text-rose-300">Default (Crash)</th>
                  <th class="p-3.5 font-bold w-[22%] text-emerald-300">Tuned Value</th>
                  <th class="p-3.5 font-bold w-[32%]">Engineering Purpose</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] text-slate-300">
                ${kernelTunings.map(k => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="p-3.5 font-bold text-white font-code text-[11.5px]">${k.param}</td>
                    <td class="p-3.5 font-code text-rose-300 text-[11px]">${k.defaultVal}</td>
                    <td class="p-3.5 font-code text-emerald-300 text-[11px] font-bold">${k.tunedVal}</td>
                    <td class="p-3.5 leading-relaxed text-[11.5px] text-slate-300">${k.purpose}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- FULL JITTER RECONNECTION BACKOFF ARCHITECTURE -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">bolt</span>
              PREVENTING THUNDERING HERD RECONNECTION STORMS (FULL JITTER MATH)
            </span>
            <span class="text-[10px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              AWS Architecture Blog (Marc Brooker)
            </span>
          </div>

          <p class="text-[13px] text-slate-300 font-sans leading-relaxed">
            When 500,000 sockets disconnect concurrently, simple exponential backoff ($T = 2^{\\text{attempt}}$) synchronizes clients into catastrophic recurring waves of retries that paralyze edge load balancers. The production solution is <strong>Full Jitter</strong>:
          </p>

          <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] font-code text-[12px] text-slate-300 flex flex-col gap-2">
            <div class="text-emerald-400 font-bold">// Full Jitter Formula:</div>
            <div>sleep_time = random_between(0, min(max_backoff, base_backoff * (2 ^ attempt_count)))</div>
            <div class="text-slate-400 text-[11px] mt-1">// Result: Spreads retries evenly across time, converting traffic spikes into a flat, manageable queue!</div>
          </div>
        </div>

        <!-- CRITICAL ARCHITECTURAL DEEP-DIVES Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              CRITICAL ARCHITECTURAL DEEP-DIVES &amp; DISTRIBUTED EDGE CASES
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${architecturalDeepDives.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-cyan-400 shrink-0 pt-0.5">${item.conceptId}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.title}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-6 flex flex-col gap-2.5 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[14px] font-sans font-medium text-white leading-relaxed">
            Scaling long-lived connections is an OS and architecture problem, not a code problem. Use non-blocking event loops (epoll), tune socket memory buffers down to 4KB, isolate connections in a dedicated gateway tier, and route messages across a pub/sub backplane. Always protect reconnects with exponential backoff and full jitter.
          </p>
        </div>

        <!-- Official Page 142 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 142</span>
        </div>

      </div>

    </div>
  `;
}
