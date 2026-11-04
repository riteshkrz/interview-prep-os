/**
 * 2.1 HTTP/1.0, HTTP/1.1, HTTP/2, and HTTP/3 - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 22, 23, and 24
 * from The Modern System Design Interview Guide.
 */

export function renderHttpGenerationsContent(topic) {
  const comparisonRows = [
    {
      feature: "Transport Protocol",
      h10: "TCP",
      h11: "TCP",
      h2: "TCP",
      h3: "QUIC (UDP)",
      h3Highlight: "text-emerald-300 font-bold"
    },
    {
      feature: "Wire Format",
      h10: "Plain text headers",
      h11: "Plain text headers",
      h2: "Binary framing layer",
      h3: "Binary framing layer",
      h3Highlight: "text-cyan-300"
    },
    {
      feature: "TCP Sockets Used",
      h10: "1 per single request",
      h11: "1 reused (Keep-Alive)",
      h2: "1 connection multiplexed",
      h3: "1 connection multiplexed",
      h3Highlight: "text-slate-300"
    },
    {
      feature: "Concurrent Requests",
      h10: "Sequential only",
      h11: "Sequential (Pipelining broken)",
      h2: "True concurrent streams",
      h3: "True concurrent streams",
      h3Highlight: "text-emerald-300 font-semibold"
    },
    {
      feature: "Head-of-Line Blocking",
      h10: "Severe (Connection-level)",
      h11: "App-level (Queued requests)",
      h2: "Transport-level (TCP packet loss)",
      h3: "Completely Eliminated",
      h3Highlight: "text-emerald-400 font-bold"
    },
    {
      feature: "Header Compression",
      h10: "None (Raw text repeated)",
      h11: "None (Raw text repeated)",
      h2: "HPACK (Stateful table)",
      h3: "QPACK (Stream-independent)",
      h3Highlight: "text-cyan-300"
    },
    {
      feature: "Handshake Round Trips",
      h10: "2 RTTs (TCP only)",
      h11: "2–3 RTTs (TCP + TLS)",
      h2: "2–3 RTTs (TCP + TLS)",
      h3: "0-RTT / 1-RTT (Integrated)",
      h3Highlight: "text-emerald-400 font-bold"
    },
    {
      feature: "Connection Migration",
      h10: "No (Tied to IP address)",
      h11: "No (Tied to IP address)",
      h2: "No (Tied to IP address)",
      h3: "Yes (64-bit Connection ID)",
      h3Highlight: "text-emerald-400 font-bold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the difference between HPACK and QPACK header compression?",
      answer: `<strong>HPACK (HTTP/2):</strong> Assumes that all HTTP/2 frames arrive in strict serial order over a single TCP stream. Senders and receivers update a synchronized in-memory dictionary table.
      <br/><br/>
      <strong>Why HPACK breaks in HTTP/3:</strong> Because HTTP/3 runs over UDP, packets and streams arrive out of order. If Stream 2 arrives before Stream 1, HPACK cannot decode Stream 2's headers because the dictionary table hasn't received Stream 1's updates yet (re-introducing head-of-line blocking!).
      <br/><br/>
      <strong>The QPACK Fix:</strong> QPACK uses two dedicated unidirectional control streams (Encoder and Decoder streams) to decouple dictionary updates from individual data streams. Headers can be parsed immediately without stalling other concurrent streams.`
    },
    {
      qNum: "Q2",
      question: "What is 0-RTT connection resumption in HTTP/3, and what is its primary security risk?",
      answer: `When a browser reconnects to a server it previously communicated with, it already knows the server's public TLS keys.
      <br/><br/>
      With <strong>0-RTT Resumption</strong>, the client sends its encrypted HTTP request (e.g. <code>GET /feed</code>) inside the <strong>very first network packet</strong> sent to the server. The server reads and returns data immediately with zero waiting.
      <br/><br/>
      <strong>The Critical Security Risk (Replay Attacks):</strong> An attacker sniffing Wi-Fi traffic cannot decrypt the 0-RTT packet, but can record and re-transmit that identical packet 1,000 times!
      <br/><em>Rule:</em> 0-RTT is strictly permitted for idempotent, read-only <code>GET</code> requests. State-altering <code>POST /transfer-money</code> or <code>POST /checkout</code> must never accept 0-RTT early data.`
    },
    {
      qNum: "Q3",
      question: "How does Connection Migration work in HTTP/3, and why does it revolutionize mobile apps?",
      answer: `Every TCP connection (HTTP/1.1 and HTTP/2) is bound to a 4-tuple socket: <code>(Client IP, Client Port, Server IP, Server Port)</code>.
      <br/><br/>
      When a user walking down the street steps out of their house, their phone drops Home Wi-Fi and connects to 5G Cellular. The client IP changes from <code>192.168.1.50</code> to <code>172.56.21.8</code>. The operating system immediately severs all active TCP sockets, forcing YouTube or Zoom to buffer, disconnect, and renegotiate an entire TLS handshake.
      <br/><br/>
      <strong>HTTP/3 Connection Migration:</strong> QUIC connections are identified by a random, persistent <strong>64-bit Connection ID</strong> embedded in packet headers. When the phone switches to 5G, it simply transmits from the new IP using its existing Connection ID. The server seamlessly continues streaming video with zero buffering or reconnect delay.`
    },
    {
      qNum: "Q4",
      question: "Why was Server Push deprecated and removed from modern web standards?",
      answer: `HTTP/2 introduced <strong>Server Push</strong> with the idea that when a client requests <code>index.html</code>, the server could proactively push <code>bundle.js</code> and <code>style.css</code> before the client even asked.
      <br/><br/>
      <strong>Why it failed in practice:</strong> The server had no way of knowing whether the client's local browser cache already contained <code>bundle.js</code>! In real-world benchmarks, servers wasted mobile data repeatedly pushing large scripts the user already had cached.
      <br/><br/>
      Chrome completely removed Server Push in 2022. The modern production standard is <strong>HTTP 103 Early Hints</strong>, which tells the browser <em>"while I calculate your database query, go ahead and fetch these asset URLs from your cache or CDN."</em>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 22, 23, 24: HTTP GENERATIONS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              2.1 HTTP/1.0, HTTP/1.1, HTTP/2, and HTTP/3
            </h2>
          </div>
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            The Latency Evolution of the Web · Multiplexing, Binary Framing, QUIC over UDP &amp; Connection Migration
          </p>
        </div>

        <!-- SIMPLE MENTAL MODEL BOX: THE HIGHWAY ANALOGY -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: THE HIGHWAY EVOLUTION
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12.5px] font-sans">
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-slate-700/60 flex flex-col gap-1.5">
              <span class="font-code text-[12px] font-bold text-slate-300">HTTP/1.0 (Demolished Road)</span>
              <p class="text-slate-400 text-[12px]">
                A single car drives to the store. Once it delivers its package, the road is demolished. To fetch the next file, you must rebuild the entire road from scratch (new TCP handshake per file).
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-blue-500/30 flex flex-col gap-1.5">
              <span class="font-code text-[12px] font-bold text-blue-300">HTTP/1.1 (Single-Lane Road)</span>
              <p class="text-slate-400 text-[12px]">
                The road stays open (Keep-Alive). But cars must drive in single file. If the lead car gets a flat tire (slow DB query), every car behind it is stuck waiting (Application HOL blocking).
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-cyan-500/30 flex flex-col gap-1.5">
              <span class="font-code text-[12px] font-bold text-cyan-300">HTTP/2 (Multi-Lane Highway)</span>
              <p class="text-slate-400 text-[12px]">
                100 cars drive simultaneously in parallel lanes over the same road (Multiplexing). But if one pothole appears (a dropped TCP packet), traffic police freeze ALL lanes until it is filled!
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-emerald-500/30 flex flex-col gap-1.5">
              <span class="font-code text-[12px] font-bold text-emerald-300">HTTP/3 (Fleet of Flying Drones)</span>
              <p class="text-slate-400 text-[12px]">
                No shared road at all (QUIC over UDP). Each package travels by independent flying drone. If one drone gets lost, all other 99 drones arrive at your house without stopping.
              </p>
            </div>
          </div>
        </div>

        <!-- WHY THIS MATTERS IN SYSTEM DESIGN INTERVIEWS -->
        <div class="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            INTERVIEW SIGNAL
          </span>
          <p class="text-[12.5px] text-indigo-200/90 leading-relaxed font-sans">
            <strong>Production Rule:</strong> <strong>HTTP/2 is the default standard</strong> for all modern web systems and internal microservice communication (it is the transport engine powering gRPC). <strong>HTTP/3</strong> is used at the public edge by hyperscalers (YouTube, Instagram, Cloudflare) because mobile users on patchy 5G networks benefit massively from zero packet-loss stalls and connection migration.
          </p>
        </div>

        <!-- HTTP/2 TCP HOL BLOCKING VS. HTTP/3 QUIC INDEPENDENCE DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              VISUALIZING HEAD-OF-LINE (HOL) BLOCKING: TCP VS. QUIC
            </span>
            <span class="text-[11px] font-code text-slate-500">Packet Loss Impact Comparison</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- HTTP/2 -->
            <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-4 flex flex-col gap-2">
              <span class="font-code text-[11px] font-bold text-rose-300">HTTP/2 (Shared TCP Byte Stream)</span>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
Stream 1 (CSS): [Frame 1] [Frame 2]
Stream 2 (IMG): [Frame 1] [Frame 2 (DROPPED)] ──►
Stream 3 (JS) : [Frame 1] [Frame 2]

Receiver OS TCP buffer BLOCKS Stream 1 &amp; 3
until Frame 2 is retransmitted! The entire page freezes.
              </div>
            </div>

            <!-- HTTP/3 -->
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
              <span class="font-code text-[11px] font-bold text-emerald-300">HTTP/3 (QUIC over UDP Datagrams)</span>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
Stream 1 (CSS): [Frame 1] [Frame 2] ─────────────► Delivered to App!
Stream 2 (IMG): [Frame 1] [Frame 2 (DROPPED)] ──► Only Stream 2 waits
Stream 3 (JS) : [Frame 1] [Frame 2] ─────────────► Delivered to App!

Independent user-space streams!
Zero transport head-of-line stall.
              </div>
            </div>
          </div>

          <div class="pt-2 text-[11px] font-code text-cyan-300">
            ▲ HTTP/2 solved application-layer request queuing; HTTP/3 solved transport-layer packet loss stalls.
          </div>
        </div>

        <!-- Detailed Comparison Table -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            FEATURE MATRIX ACROSS HTTP GENERATIONS
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Feature</th>
                  <th class="p-3.5">HTTP/1.0</th>
                  <th class="p-3.5">HTTP/1.1</th>
                  <th class="p-3.5">HTTP/2</th>
                  <th class="p-3.5">HTTP/3</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${comparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">${row.feature}</td>
                    <td class="p-3.5 text-slate-400">${row.h10}</td>
                    <td class="p-3.5 text-slate-300">${row.h11}</td>
                    <td class="p-3.5 text-cyan-200">${row.h2}</td>
                    <td class="p-3.5 ${row.h3Highlight}">${row.h3}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The Domain Sharding Antipattern -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            OBSOLETE INTERVIEW ANTIPATTERN: DOMAIN SHARDING &amp; SPRITE SHEETS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In the legacy HTTP/1.1 era, browsers capped requests to 6 simultaneous connections per domain. Developers worked around this by <strong>domain sharding</strong> (spreading static files across <code>static1.cdn.com</code>, <code>static2.cdn.com</code>) and stitching 50 icons into one giant CSS image sprite. In modern HTTP/2 and HTTP/3, <strong>domain sharding is an antipattern</strong>: it forces multiple redundant TCP/TLS handshakes and destroys header compression efficiency. Serve all assets from a single domain and let HTTP/2 multiplexing do the work.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why is connection migration in HTTP/3 especially valuable for mobile devices when walking out of your house from Wi-Fi to cellular data?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">contact_support</span>
              DEEP-DIVE INTERVIEW FOLLOW-UPS (Q1–Q4)
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.question}</span>
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
            Every generation of HTTP solved one specific blocking bottleneck: HTTP/1.1 eliminated per-request TCP handshakes with persistent Keep-Alive; HTTP/2 eliminated application-layer request queuing via multiplexed binary streams over a single connection; HTTP/3 eliminated transport-layer packet loss head-of-line blocking by moving to QUIC over UDP. In interviews, never recommend legacy HTTP/1.1 hacks like domain sharding.
          </p>
        </div>

        <!-- Page 24 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 24</span>
        </div>

      </div>

    </div>
  `;
}
