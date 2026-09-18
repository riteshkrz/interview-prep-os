/**
 * 11.1 TCP and UDP Fundamentals - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 20, 21, and 22
 * from The Modern System Design Interview Guide.
 */

export function renderTcpUdpFundamentalsContent(topic) {
  const comparisonRows = [
    {
      dimension: "Connection",
      tcp: "Connection-oriented (3-way handshake)",
      udp: "Connectionless (no handshake)",
      tcpClass: "text-cyan-300 font-semibold",
      udpClass: "text-emerald-300 font-semibold"
    },
    {
      dimension: "Reliability",
      tcp: "Guaranteed (ACKs + retransmission)",
      udp: "Best-effort (packets may drop)",
      tcpClass: "text-emerald-400 font-bold",
      udpClass: "text-amber-400"
    },
    {
      dimension: "Ordering",
      tcp: "Guaranteed (sequence numbers)",
      udp: "No ordering (packets may arrive out-of-order)",
      tcpClass: "text-emerald-300",
      udpClass: "text-slate-400"
    },
    {
      dimension: "Header size",
      tcp: "20–60 bytes",
      udp: "8 bytes fixed",
      tcpClass: "text-slate-300 font-code",
      udpClass: "text-emerald-300 font-code font-bold"
    },
    {
      dimension: "Speed / Latency",
      tcp: "Higher latency (handshake + ACKs)",
      udp: "Lowest latency (immediate send)",
      tcpClass: "text-slate-400",
      udpClass: "text-emerald-300 font-bold"
    },
    {
      dimension: "Flow / Congestion Control",
      tcp: "Yes (sliding window, AIMD, CUBIC, BBR)",
      udp: "No (application must implement if needed)",
      tcpClass: "text-cyan-300 font-semibold",
      udpClass: "text-slate-400"
    },
    {
      dimension: "Typical protocols",
      tcp: "HTTP/1.1, HTTP/2, SSH, TLS, gRPC, DBs",
      udp: "DNS, DHCP, WebRTC, VoIP, Gaming, QUIC",
      tcpClass: "text-indigo-300 font-code text-[11.5px]",
      udpClass: "text-teal-300 font-code text-[11.5px]"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the TCP TIME_WAIT state, and why is it necessary?",
      answer: `When a node closes a TCP connection (sends final ACK to the other side's FIN), it stays in <strong>TIME_WAIT for 2 × MSL</strong> (Maximum Segment Lifetime, typically 60–120 seconds). Why: <strong>(1) To ensure the final ACK arrives</strong> and retransmit it if lost, and <strong>(2) To allow old delayed duplicate packets to expire</strong> from the network so they don't corrupt a future connection with the same port tuple. <em>Trap:</em> high-traffic servers opening/closing thousands of outbound connections can exhaust available ephemeral ports in TIME_WAIT.`
    },
    {
      qNum: "Q2",
      question: "What is Head-of-Line (HOL) blocking in TCP?",
      answer: `TCP guarantees in-order delivery. If packet #2 is dropped in transit while packets #3, #4, and #5 arrive safely, the receiver's OS buffer holds #3, #4, and #5 until #2 is retransmitted and received. Application code cannot read #3–#5 even though they arrived. In HTTP/2 (which multiplexes multiple streams over one TCP connection), one dropped packet stalls all streams sharing that TCP connection. This was the primary motivation for HTTP/3 and QUIC.`
    },
    {
      qNum: "Q3",
      question: "What is the difference between Flow Control and Congestion Control in TCP?",
      answer: `<strong>Flow control</strong> protects the receiver from being overwhelmed by a fast sender (implemented via the <em>Receive Window / rwnd</em> header). <strong>Congestion control</strong> protects the network infrastructure (routers, switches, links) from being overloaded by too much traffic across all senders (managed via the <em>Congestion Window / cwnd</em> calculated dynamically by algorithms like CUBIC or BBR).`
    },
    {
      qNum: "Q4",
      question: "How does UDP-based QUIC achieve reliability without TCP?",
      answer: `QUIC implements packet numbers, acknowledgments, retransmission timers, and congestion control (CUBIC or BBR) directly inside user space within the application/library layer. Because it runs on UDP, individual streams within a QUIC connection are truly independent: a dropped packet on stream A stalls only stream A, not stream B.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGES 20, 21, 22: TCP VS UDP FUNDAMENTALS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              11.1 TCP and UDP Fundamentals
            </h2>
          </div>
        </div>

        <!-- Overview Text -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
          <p class="text-slate-300">
            Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) are the two primary transport-layer protocols operating on top of the Internet Protocol (IP).
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider">TCP (Stream Protocol)</span>
              <p class="text-[12.5px] text-slate-300">
                A connection-oriented, reliable, stream-based protocol. It establishes a virtual circuit before transmitting data and guarantees that all packets arrive in order, without loss, and without duplication.
              </p>
            </div>

            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3.5 flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-emerald-300 uppercase tracking-wider">UDP (Datagram Protocol)</span>
              <p class="text-[12.5px] text-slate-300">
                A connectionless, lightweight datagram protocol. It transmits individual packets (datagrams) with minimum overhead and no delivery guarantees. It does not establish a connection, retransmit lost packets, or guarantee ordering.
              </p>
            </div>
          </div>

          <!-- BDP Highlight -->
          <div class="bg-indigo-950/20 border border-indigo-500/30 rounded-lg p-3 text-[12.5px] text-slate-300 flex flex-col gap-1">
            <strong class="text-indigo-300 font-code text-[11px] uppercase tracking-wider">Bandwidth-Delay Product (BDP):</strong>
            <span>The volume of data that can be "in flight" across a network link: <code>BDP = Bandwidth (bits/sec) × RTT (seconds)</code>. A 1 Gbps link with 100 ms RTT has a BDP of 12.5 MB. If the TCP receive window is capped at the default 64 KB, throughput will be choked at ~5 Mbps regardless of network capacity.</span>
          </div>
        </div>

        <!-- TCP 3-WAY HANDSHAKE DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              TCP 3-WAY HANDSHAKE FLOW
            </span>
            <span class="text-[11px] font-code text-slate-500">Virtual Circuit Establishment</span>
          </div>

          <div class="p-4 bg-[#0F1626] border border-cyan-500/30 rounded-xl flex flex-col gap-2">
            <div class="text-[11.5px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto font-mono">
[Client]                                            [Server]
   │                                                   │
   │ ─────────────── 1. SYN (seq = x) ───────────────> │  (SYN-RECEIVED)
   │                                                   │
   │ <──────── 2. SYN-ACK (seq = y, ack = x + 1) ───── │
   │                                                   │
   │ ──────── 3. ACK (ack = y + 1, data optional) ───> │  (ESTABLISHED)
   │                                                   │
   ▼                                                   ▼
            </div>

            <div class="pt-2 border-t border-[#1E293B] text-[11px] font-code text-amber-400">
              ▲ 1 full RTT required before application data can travel
            </div>
          </div>
        </div>

        <!-- Detailed Comparison Table -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DIMENSIONAL PROTOCOL COMPARISON
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3">Dimension</th>
                  <th class="p-3">TCP</th>
                  <th class="p-3">UDP</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${comparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white">${row.dimension}</td>
                    <td class="p-3 ${row.tcpClass}">${row.tcp}</td>
                    <td class="p-3 ${row.udpClass}">${row.udp}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Box: The Packet Loss Trap -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            THE PACKET LOSS TRAP (CUBIC VS. BBR)
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            On high-latency networks (transcontinental, mobile), even 1% packet loss causes standard TCP (CUBIC) to halve its congestion window (cwnd), collapsing throughput to a fraction of available bandwidth. Modern TCP implementations use Google's <strong>BBR (Bottleneck Bandwidth and RTT)</strong>, which probes the maximum bandwidth and minimum RTT directly rather than relying on packet loss as a congestion signal.
          </p>
        </div>

        <!-- Two Columns: Choose TCP vs. Choose UDP -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- CHOOSE TCP WHEN -->
          <div class="bg-cyan-950/15 border border-cyan-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-cyan-400 uppercase tracking-wider">
              CHOOSE TCP WHEN
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-cyan-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1">•</span>
                <span>Data correctness and completeness are paramount (finance, API calls, file transfers)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1">•</span>
                <span>Out-of-order delivery would corrupt state</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1">•</span>
                <span>Built-in congestion control protects the network from saturation</span>
              </li>
            </ul>
          </div>

          <!-- CHOOSE UDP WHEN -->
          <div class="bg-emerald-950/15 border border-emerald-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase tracking-wider">
              CHOOSE UDP WHEN
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-emerald-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Real-time latency matters more than occasional lost frames (VoIP, video calls, live gaming)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Requests fit in a single datagram (DNS lookup, NTP time sync)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>You want to implement custom reliability at the application layer (QUIC, game engines)</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why did the HTTP working group build HTTP/3 on top of UDP instead of creating a new transport protocol?
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
            Latency, not bandwidth, is the bottleneck on the modern internet. Throughput is bounded by Bandwidth-Delay Product (BDP) and the window size. Always cite TCP head-of-line blocking when discussing the evolution from HTTP/2 to HTTP/3.
          </p>
        </div>

        <!-- Page 22 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 22</span>
        </div>

      </div>

    </div>
  `;
}
