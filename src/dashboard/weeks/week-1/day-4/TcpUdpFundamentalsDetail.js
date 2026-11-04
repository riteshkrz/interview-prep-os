/**
 * 11.1 TCP and UDP Fundamentals - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 20, 21, and 22
 * from The Modern System Design Interview Guide.
 */

export function renderTcpUdpFundamentalsContent(topic) {
  const comparisonRows = [
    {
      dimension: "Connection Setup",
      tcp: "Connection-oriented (Requires 3-way handshake, 1 RTT delay)",
      udp: "Connectionless (0 RTT — transmits data immediately)",
      tcpClass: "text-cyan-300 font-semibold",
      udpClass: "text-emerald-300 font-semibold"
    },
    {
      dimension: "Delivery Guarantee",
      tcp: "100% Guaranteed (Packet acknowledgments + automatic retransmission)",
      udp: "Best-effort (Dropped packets are lost forever; no resends)",
      tcpClass: "text-emerald-400 font-bold",
      udpClass: "text-amber-400"
    },
    {
      dimension: "Packet Ordering",
      tcp: "Guaranteed in-order (Sequence numbers reassemble fragmented stream)",
      udp: "No order guarantee (Packets can arrive out-of-order or duplicate)",
      tcpClass: "text-emerald-300",
      udpClass: "text-slate-400"
    },
    {
      dimension: "Header Size (Overhead)",
      tcp: "20–60 bytes (Carries sequence numbers, ACKs, flags, window sizes)",
      udp: "8 bytes fixed (Minimal: Source Port, Dest Port, Length, Checksum)",
      tcpClass: "text-slate-300 font-code",
      udpClass: "text-emerald-300 font-code font-bold"
    },
    {
      dimension: "Speed & Latency",
      tcp: "Higher latency (Handshake setup + packet ACK overhead)",
      udp: "Ultra-low latency (Instant send; no waiting for replies)",
      tcpClass: "text-slate-400",
      udpClass: "text-emerald-300 font-bold"
    },
    {
      dimension: "Congestion & Flow Control",
      tcp: "Built-in (Sliding window prevents receiver & network overload)",
      udp: "None (Blasts packets at wire speed; app layer must throttle)",
      tcpClass: "text-cyan-300 font-semibold",
      udpClass: "text-slate-400"
    },
    {
      dimension: "Common Protocols",
      tcp: "HTTP/1.1, HTTP/2, TLS/HTTPS, SSH, gRPC, PostgreSQL, MySQL",
      udp: "DNS, DHCP, WebRTC (Audio/Video), VoIP, Gaming, QUIC (HTTP/3)",
      tcpClass: "text-indigo-300 font-code text-[11.5px]",
      udpClass: "text-teal-300 font-code text-[11.5px]"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "What is the TCP TIME_WAIT state, and why is it necessary in high-throughput servers?",
      answer: `When a server initiates closing a TCP connection (sends final ACK to the other side's FIN), it must stay in <strong>TIME_WAIT for 2 × MSL</strong> (Maximum Segment Lifetime, typically 60 to 120 seconds).
      <br/><br/>
      <strong>Why this is necessary:</strong>
      <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
        <li><strong>Guarantees the final ACK arrived:</strong> If the final ACK is lost in transit, the remote host will re-send its FIN. If the server closed immediately, it would reply with an RST error instead of a clean closure.</li>
        <li><strong>Flushes wandering duplicate packets:</strong> Allows old delayed packets bouncing around internet routers to expire so they don't corrupt a newly established connection using the same IP and port combination.</li>
        <li><strong>The Production Trap:</strong> High-traffic reverse proxies (like Nginx) making thousands of short-lived connections to backend microservices can exhaust all 65,535 ephemeral ports in TIME_WAIT. Solution: Enable <strong>HTTP Keep-Alive</strong> connection pooling or set <code>net.ipv4.tcp_tw_reuse = 1</code> in Linux sysctl.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is Head-of-Line (HOL) blocking in TCP, and how did HTTP/3 fix it?",
      answer: `TCP guarantees <strong>in-order byte delivery</strong>. If a sender transmits packets #1, #2, #3, and #4, and packet #2 is dropped by a router while #3 and #4 arrive safely:
      <br/><br/>
      The receiver's operating system buffer holds packets #3 and #4 in memory and <strong>refuses to deliver them to the application</strong> until packet #2 is retransmitted and received.
      <br/><br/>
      <strong>Why this broke HTTP/2:</strong> HTTP/2 multiplexes 50 independent browser requests over a single shared TCP socket. If one packet from an image download is dropped, <em>all other 49 streams (including critical CSS and JavaScript) freeze</em> waiting for the retransmit.
      <br/><br/>
      <strong>The HTTP/3 Fix (QUIC over UDP):</strong> QUIC runs on UDP and implements its own independent stream framing. A dropped packet on Stream A only pauses Stream A. Streams B, C, and D continue rendering without delay.`
    },
    {
      qNum: "Q3",
      question: "What is the difference between Flow Control and Congestion Control in TCP?",
      answer: `Interviewers test if you know who is being protected:
      <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
        <li><strong>Flow Control (Protects the Receiver):</strong> Prevents a fast sender from overwhelming a slow receiver's memory buffer. The receiver advertises its available buffer space in the TCP header using the <code>Receive Window (rwnd)</code>. The sender never sends more unacknowledged bytes than <code>rwnd</code>.</li>
        <li><strong>Congestion Control (Protects the Network):</strong> Prevents thousands of senders from overwhelming intermediate internet routers and optical switches. The sender estimates network pipe capacity using a <code>Congestion Window (cwnd)</code> calculated dynamically by algorithms like <strong>CUBIC</strong> or <strong>Google BBR</strong>.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "How does UDP-based QUIC achieve 100% reliability without using TCP?",
      answer: `UDP is simply the raw transport packet carrier. QUIC implements full reliability <strong>in user space (inside the Chromium / application engine)</strong>:
      <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
        <li>It generates monotonic packet sequence numbers, tracks ACKs, and manages retransmission timers just like TCP.</li>
        <li>It integrates <strong>TLS 1.3 cryptographic handshakes directly into the transport handshake</strong>, achieving <strong>0-RTT or 1-RTT connection setup</strong> (compared to TCP + TLS taking 2–3 RTTs).</li>
        <li>It supports <strong>Connection Migration</strong>: if a smartphone switches from Home Wi-Fi to 5G Cellular, the IP address changes, but QUIC uses a persistent 64-bit Connection ID so video calls and downloads continue without disconnecting.</li>
      </ul>`
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
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Connection-Oriented Reliability vs. Low-Latency Datagrams · 3-Way Handshake &amp; Head-of-Line Blocking
          </p>
        </div>

        <!-- SIMPLE MENTAL MODEL BOX -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: REGISTERED MAIL VS. A POSTCARD
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-300 leading-relaxed font-sans">
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-cyan-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">mark_email_read</span>
                TCP = Certified Registered Mail
              </strong>
              <p>
                You send a letter with return receipt requested. If it gets lost, the post office tracks it down and resends it. The recipient numbers each page so everything is read in order. <strong>Guaranteed delivery, but requires paperwork and waiting for signatures.</strong>
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-emerald-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">send</span>
                UDP = Dropping a Postcard in a Mailbox
              </strong>
              <p>
                You scribble a quick message on a postcard and toss it in the box. No tracking, no signature, and no confirmation if it arrived. If rain ruins it, nobody replaces it. <strong>Fastest possible delivery with near-zero overhead.</strong>
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
            <strong>The Golden Rule for System Design:</strong> Choose <strong>TCP</strong> when accuracy and state matter (REST APIs, payment processing, file downloads, database queries). Choose <strong>UDP</strong> when latency and real-time freshness matter more than occasional dropped packets (live video calling, VoIP, multiplayer gaming, DNS queries).
          </p>
        </div>

        <!-- Bandwidth-Delay Product (BDP) Callout -->
        <div class="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 text-[12.5px] text-slate-300 flex flex-col gap-1.5 font-sans">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              BANDWIDTH-DELAY PRODUCT (BDP): WHY INTERNET PIPES SIT EMPTY
            </span>
          </div>
          <p class="leading-relaxed">
            The volume of data that can be in flight across a network link: <code>BDP = Bandwidth (bits/sec) × Round-Trip Time (seconds)</code>. A 1 Gbps fiber link across the Pacific with 100 ms latency has a BDP of <strong>12.5 MB</strong>. If the TCP receive window is capped at the default legacy 64 KB, throughput collapses to just ~5 Mbps regardless of how fast your fiber internet is!
          </p>
        </div>

        <!-- TCP 3-WAY HANDSHAKE DIAGRAM -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                TCP 3-WAY HANDSHAKE FLOW (1 FULL ROUND-TRIP DELAY)
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">Virtual Connection Setup</span>
              <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">SYN → SYN-ACK → ACK</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image As-Is -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/tcp-3-way-handshake.png" 
                alt="TCP 3-Way Handshake (Establishing a Reliable Connection) - SYN, SYN-ACK, ACK" 
                class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/tcp-3-way-handshake.png', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">CLOSED → SYN-SENT → SYN-RECEIVED → ESTABLISHED (1 RTT)</span>
            </div>
          </div>

          <!-- Key Three-Way Handshake Steps Callouts -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11.5px] font-sans">
            <div class="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-2.5">
              <span class="text-blue-600 font-bold shrink-0 text-[14px]">1</span>
              <div>
                <strong class="block font-bold mb-0.5 text-blue-900">Step 1: Client SYN ("Can you hear me?")</strong>
                <span>Client picks initial sequence number <code>seq = x</code> and enters <code>SYN-SENT</code> state.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
              <span class="text-emerald-600 font-bold shrink-0 text-[14px]">2</span>
              <div>
                <strong class="block font-bold mb-0.5 text-emerald-900">Step 2: Server SYN-ACK ("Yes! Can you hear me?")</strong>
                <span>Server acknowledges with <code>ack = x + 1</code>, picks <code>seq = y</code>, allocates memory buffers, and enters <code>SYN-RECEIVED</code>.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-950 flex items-start gap-2.5">
              <span class="text-purple-600 font-bold shrink-0 text-[14px]">3</span>
              <div>
                <strong class="block font-bold mb-0.5 text-purple-900">Step 3: Client ACK ("Yes, let's talk!")</strong>
                <span>Client responds with <code>ack = y + 1</code>. Both ends transition to <code>ESTABLISHED</code> and bidirectional data transfer begins.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Comparison Table -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DIMENSIONAL PROTOCOL COMPARISON MATRIX
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Dimension</th>
                  <th class="p-3.5">TCP (Transmission Control Protocol)</th>
                  <th class="p-3.5">UDP (User Datagram Protocol)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${comparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">${row.dimension}</td>
                    <td class="p-3.5 ${row.tcpClass}">${row.tcp}</td>
                    <td class="p-3.5 ${row.udpClass}">${row.udp}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Box: The Packet Loss Trap -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">speed</span>
            THE CONGESTION CONTROL TRAP: CUBIC VS. GOOGLE BBR
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Traditional TCP algorithms (like CUBIC) treat <strong>any packet loss as proof of network congestion</strong>. On mobile 5G or transcontinental satellite links with 1% random packet loss, CUBIC aggressively cuts its transmission window in half, tanking throughput by 80%. Modern hyperscalers use <strong>Google BBR (Bottleneck Bandwidth and RTT)</strong>, which measures actual round-trip packet flight times rather than assuming packet loss means congestion.
          </p>
        </div>

        <!-- Two Columns: Choose TCP vs. Choose UDP -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- CHOOSE TCP WHEN -->
          <div class="bg-cyan-950/15 border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              CHOOSE TCP WHEN
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-cyan-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1 font-bold">•</span>
                <span><strong>Data Correctness is Mandatory:</strong> Financial payments, database queries, file transfers, and user authentication where a single dropped bit corrupts transactions.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1 font-bold">•</span>
                <span><strong>In-Order Sequence Matters:</strong> Chat messages or JSON documents where out-of-order bytes break parser logic.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1 font-bold">•</span>
                <span><strong>Network Self-Regulation:</strong> Built-in flow and congestion control automatically adapt to network congestion without crashing routers.</span>
              </li>
            </ul>
          </div>

          <!-- CHOOSE UDP WHEN -->
          <div class="bg-emerald-950/15 border border-emerald-500/30 rounded-xl p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">bolt</span>
              CHOOSE UDP WHEN
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-emerald-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Real-Time Latency Outweighs Dropped Data:</strong> Live video calls (Zoom), VoIP audio, and fast-paced multiplayer gaming (Fortnite). A dropped frame is useless if it arrives 500 ms late.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Tiny Single-Packet Queries:</strong> DNS lookups and NTP clock synchronization where request and response fit inside a single 512-byte packet (avoiding handshake overhead).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Custom User-Space Protocols (QUIC):</strong> Modern internet architectures building multiplexed, head-of-line-blocking-free protocols (HTTP/3) on top of raw UDP datagrams.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            Why did Google invent QUIC on top of UDP instead of introducing a brand new transport protocol to replace TCP? (Hint: Think about corporate firewalls and middleboxes!)
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
            On the modern internet, latency and round-trip times are the bottleneck, not raw bandwidth. TCP trades 1 RTT handshake delay and head-of-line blocking for 100% reliable in-order streams. UDP trades reliability for zero-handshake immediacy. HTTP/3 chose UDP not because UDP is inherently better, but because UDP allows user-space protocols (QUIC) to bypass the OS kernel and eliminate TCP head-of-line blocking across middlebox firewalls.
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
