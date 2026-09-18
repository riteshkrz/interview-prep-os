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
      feature: "Format",
      h10: "Plain text",
      h11: "Plain text",
      h2: "Binary framing",
      h3: "Binary framing",
      h3Highlight: "text-cyan-300"
    },
    {
      feature: "Connections",
      h10: "1 per request",
      h11: "Keep-Alive (reused)",
      h2: "1 multiplexed",
      h3: "1 multiplexed",
      h3Highlight: "text-slate-300"
    },
    {
      feature: "Multiplexing",
      h10: "No",
      h11: "No (pipelining broken)",
      h2: "Yes (streams)",
      h3: "Yes (independent streams)",
      h3Highlight: "text-emerald-300 font-semibold"
    },
    {
      feature: "HOL Blocking",
      h10: "Connection-level",
      h11: "Application-level",
      h2: "Transport-level (TCP)",
      h3: "Eliminated",
      h3Highlight: "text-emerald-400 font-bold"
    },
    {
      feature: "Header Compression",
      h10: "None",
      h11: "None",
      h2: "HPACK",
      h3: "QPACK",
      h3Highlight: "text-cyan-300"
    },
    {
      feature: "0-RTT Handshake",
      h10: "No",
      h11: "No",
      h2: "No (TCP+TLS=2–3 RTT)",
      h3: "Yes (0-RTT resumption)",
      h3Highlight: "text-emerald-400 font-bold"
    },
    {
      feature: "Connection Migration",
      h10: "No",
      h11: "No",
      h2: "No",
      h3: "Yes (Connection ID)",
      h3Highlight: "text-emerald-400 font-bold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the difference between HPACK and QPACK header compression?",
      answer: `<strong>HPACK</strong> (used in HTTP/2) assumes frames arrive in strict order over a single TCP stream; each header entry updates a shared dynamic table in lockstep. Because HTTP/3 streams arrive out-of-order over UDP, HPACK would reintroduce head-of-line blocking while waiting for earlier headers. <strong>QPACK</strong> decouples header emission from table updates using two dedicated unistreams (encoder & decoder streams), allowing headers to decode immediately without waiting for sibling streams.`
    },
    {
      qNum: "Q2",
      question: "What is 0-RTT connection resumption in HTTP/3?",
      answer: `When a client reconnects to a server it previously visited, it reuses cached cryptographic parameters from the prior session to encrypt application data (e.g. <code>GET /index.html</code>) in the <strong>very first packet</strong> sent to the server. The data arrives at the server simultaneously with the connection request (0 round-trip latency). <em>Tradeoff:</em> 0-RTT requests are vulnerable to replay attacks, so 0-RTT should only be allowed for idempotent GET requests, never state-changing POST.`
    },
    {
      qNum: "Q3",
      question: "How does Connection Migration work in HTTP/3?",
      answer: `Traditional TCP connections are identified by a 4-tuple: <code>(Source IP, Source Port, Destination IP, Destination Port)</code>. If a mobile user walks out of their house and switches from WiFi to 4G/5G, their IP address changes, instantly severing all active TCP connections. HTTP/3 connections are identified by a random, opaque <strong>64-bit Connection ID</strong>. When the network changes, it simply sends its existing Connection ID from the new IP, and the session continues uninterrupted without a re-handshake.`
    },
    {
      qNum: "Q4",
      question: "Why was Server Push removed or disabled in modern HTTP/2 implementations?",
      answer: `Server Push allowed a server to send assets (e.g. <code>style.css</code>) before the client requested them. In practice, servers could not accurately predict whether the browser cache already held the file, frequently wasting mobile bandwidth re-transmitting cached assets. Chrome removed Server Push in 2022; the industry has standardized on the <strong>103 Early Hints</strong> status code instead.`
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
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            The Hypertext Transfer Protocol (HTTP) is the foundational application-layer protocol of the World Wide Web. Each generation was engineered to eliminate the fundamental latency bottlenecks of its predecessor:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div class="bg-[#0F1626] border border-slate-700/60 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-slate-400 uppercase">HTTP/1.0 (1996)</span>
              <p class="text-[12px] text-slate-300">One connection per request. Every asset requires a new TCP 3-way handshake and closes immediately. Extreme latency overhead.</p>
            </div>

            <div class="bg-[#0F1626] border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-blue-300 uppercase">HTTP/1.1 (1997)</span>
              <p class="text-[12px] text-slate-300">Introduced persistent connections (Keep-Alive) and chunked transfer. Pipelining suffered from application Head-of-Line blocking and was disabled.</p>
            </div>

            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase">HTTP/2 (2015)</span>
              <p class="text-[12px] text-slate-300">Binary framing layer, multiplexed concurrent streams over a single TCP connection, HPACK header compression, and stream prioritization.</p>
            </div>

            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase">HTTP/3 (2022)</span>
              <p class="text-[12px] text-slate-300">Swapped TCP for QUIC over UDP. Eliminates transport-layer HOL blocking, enables 0-RTT connection resumption, and connection migration.</p>
            </div>
          </div>
        </div>

        <!-- HTTP/2 TCP HOL BLOCKING VS. HTTP/3 QUIC INDEPENDENCE DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              HTTP/2 TCP HOL BLOCKING VS. HTTP/3 QUIC INDEPENDENCE
            </span>
            <span class="text-[11px] font-code text-slate-500">Packet Loss Impact Comparison</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- HTTP/2 -->
            <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-4 flex flex-col gap-2">
              <span class="font-code text-[11px] font-bold text-rose-300">HTTP/2 (Over 1 TCP Connection)</span>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
Stream 1: [Frame 1] [Frame 2]
Stream 2: [Frame 1] [Frame 2 (DROPPED)] ──►
Stream 3: [Frame 1] [Frame 2]

Receiver TCP buffer BLOCKS Stream 1 & 3
until Frame 2 is retransmitted!
              </div>
            </div>

            <!-- HTTP/3 -->
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
              <span class="font-code text-[11px] font-bold text-emerald-300">HTTP/3 (Over QUIC / UDP)</span>
              <div class="text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
Stream 1: [Frame 1] [Frame 2] ─────────────► Delivered to App!
Stream 2: [Frame 1] [Frame 2 (DROPPED)] ──► Only Stream 2 waits
Stream 3: [Frame 1] [Frame 2] ─────────────► Delivered to App!

Independent user-space streams
no transport head-of-line stall!
              </div>
            </div>
          </div>

          <div class="pt-2 text-[11px] font-code text-cyan-300">
            ▲ HTTP/2 solves app-layer HOL blocking; HTTP/3 solves transport-layer HOL blocking
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
                  <th class="p-3">Feature</th>
                  <th class="p-3">HTTP/1.0</th>
                  <th class="p-3">HTTP/1.1</th>
                  <th class="p-3">HTTP/2</th>
                  <th class="p-3">HTTP/3</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${comparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white">${row.feature}</td>
                    <td class="p-3 text-slate-400">${row.h10}</td>
                    <td class="p-3 text-slate-300">${row.h11}</td>
                    <td class="p-3 text-cyan-200">${row.h2}</td>
                    <td class="p-3 ${row.h3Highlight}">${row.h3}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The Domain Sharding Antipattern -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE DOMAIN SHARDING ANTIPATTERN
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            In the HTTP/1.1 era, browsers limited connections to 6 per domain, prompting developers to shard assets across multiple domains (e.g. <code>cdn1.example.com</code>, <code>cdn2.example.com</code>) and concatenate CSS/JS into massive single bundles. In HTTP/2 and HTTP/3, domain sharding is an antipattern: it forces multiple TCP/QUIC handshakes, splits the benefit of HPACK compression, and fragments cache invalidation. Serve assets from a single domain with HTTP/2+ multiplexing.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why is connection migration in HTTP/3 especially valuable for mobile devices?
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
            Each generation of HTTP removed one blocking layer: HTTP/1.1 eliminated per-request TCP handshakes, HTTP/2 eliminated application-layer head-of-line blocking via multiplexed streams, and HTTP/3 eliminated transport-layer head-of-line blocking via QUIC over UDP. Never propose domain sharding or bundle concatenation in an HTTP/2+ design.
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
