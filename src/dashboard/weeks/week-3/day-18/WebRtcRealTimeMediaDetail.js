/**
 * 11.6 WebRTC and Real-Time Media - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 143 and 144
 * from The Modern System Design Interview Guide.
 */

export function renderWebRtcRealTimeMediaContent(topic) {
  const topologyMatrix = [
    {
      topology: "Mesh (Peer-to-Peer)",
      participants: "2 to 4 participants max",
      clientUpstream: "N - 1 streams (Chokes client uplink at N ≥ 5)",
      serverCpu: "Zero (No media server needed)",
      serverBandwidth: "Zero (Direct client-to-client UDP)",
      latency: "Lowest (< 80 ms, direct peer path)",
      verdict: "1:1 video calls only (WhatsApp 1:1, Google Duo)",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      topology: "SFU (Selective Forwarding Unit)",
      participants: "Hundreds to thousands per room",
      clientUpstream: "1 stream (Simulcast with 3 layers)",
      serverCpu: "Low (Inspects headers & forwards packets; no decoding)",
      serverBandwidth: "High (Egress = N × participants)",
      latency: "Sub-150 ms (Packet forwarding adds < 10 ms)",
      verdict: "The industry standard for Zoom, Google Meet, Teams, Discord",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      topology: "MCU (Multipoint Control Unit)",
      participants: "Tens of participants",
      clientUpstream: "1 stream",
      serverCpu: "Astronomical (Decodes, composites grid video, re-encodes)",
      serverBandwidth: "Moderate (Single mixed stream to each client)",
      latency: "150–300 ms (Encoding pipeline adds 50–100 ms)",
      verdict: "Legacy telepresence systems, low-power smart displays, telephony bridges",
      badgeColor: "text-rose-400 bg-rose-500/15 border-rose-500/30"
    },
    {
      topology: "HLS / LL-HLS Broadcast",
      participants: "Millions of passive viewers",
      clientUpstream: "None (Broadcast ingestion via RTMP / WebRTC to origin)",
      serverCpu: "High transcode at origin; standard CDN distribution",
      serverBandwidth: "CDN cacheable at edge; lowest cost per viewer",
      latency: "2 to 5 seconds (LL-HLS) or 15–30 seconds (Standard HLS)",
      verdict: "One-to-many broadcast (Twitch, YouTube Live, Apple Keynotes)",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    }
  ];

  const natTraversal = [
    {
      protocol: "STUN (RFC 5389)",
      purpose: "Session Traversal Utilities for NAT",
      howItWorks: "Client sends lightweight binding request to public STUN server. Server responds with client's public reflexive IP and port mapped by NAT.",
      successRate: "Succeeds for 80%–85% of standard residential and mobile networks.",
      cost: "Negligible bandwidth (handshake only; media never passes through STUN)."
    },
    {
      protocol: "TURN (RFC 5766)",
      purpose: "Traversal Using Relays around NAT",
      howItWorks: "Fallback relay server. When both peers are behind symmetric NATs or restrictive enterprise firewalls, direct UDP fails. TURN relays all SRTP audio/video.",
      successRate: "Guarantees 100% connectivity as long as outbound TCP/UDP port 443 is open.",
      cost: "Expensive bandwidth! Relays 100% of media stream packets (15%–20% of global sessions)."
    },
    {
      protocol: "ICE (RFC 5245)",
      purpose: "Interactive Connectivity Establishment",
      howItWorks: "Orchestration framework. Gathers candidates (Host IP, STUN reflexive IP, TURN relay IP), exchanges them via signaling, and tests connectivity pairs.",
      successRate: "Finds the lowest latency, lowest cost functional media path automatically.",
      cost: "Standard ICE handshake completed in 100–300 ms during call initiation."
    }
  ];

  const latencySpectrum = [
    {
      category: "1. Ultra-Low Latency (< 150 ms)",
      tech: "WebRTC (UDP / SRTP)",
      interaction: "Real-time bidirectional human conversation (Zero perceptible delay)",
      useCase: "Video conferencing, remote surgery, cloud gaming (GeForce NOW)"
    },
    {
      category: "2. Low-Latency Broadcast (2 – 5 sec)",
      tech: "LL-HLS / CMAF Chunks",
      interaction: "Semi-interactive streaming with chat synchronization",
      useCase: "Twitch e-sports, live auctions, sports betting feeds"
    },
    {
      category: "3. Standard Broadcast (15 – 30 sec)",
      tech: "Standard HLS / MPEG-DASH",
      interaction: "Completely passive consumption (High buffer resilience)",
      useCase: "Netflix, YouTube VOD, Olympic Games planetary television"
    }
  ];

  const architecturalDeepDives = [
    {
      conceptId: "#01",
      title: "Why WebRTC Omits Signaling from W3C Specs: Protocol Decoupling & SDP Negotiation",
      answer: "The W3C working group deliberately left signaling out of the specification to provide architectural flexibility. Real-time media requirements differ wildly: a VoIP telecom system requires SIP, an enterprise chat app already maintains a persistent WebSocket connection, and a multiplayer game might use a custom binary UDP protocol. By standardizing only the <strong>Session Description Protocol (SDP)</strong> exchange and media engine, WebRTC allows developers to transport SDP offers, answers, and ICE candidates over any existing transport (WebSocket, HTTP/2, SSE, or gRPC) without forcing a rigid telecom signaling standard."
    },
    {
      conceptId: "#02",
      title: "Simulcast vs. Scalable Video Coding (SVC): Mobile Hardware Encoders vs. Uplink Bandwidth",
      answer: "Both solve the problem of sending multi-quality video through an SFU to heterogeneous clients: (1) <strong>Simulcast</strong>: The client's hardware encoder compresses 3 completely separate, independent video streams (e.g. 1080p @ 2.5 Mbps, 720p @ 1 Mbps, 360p @ 300 kbps). The SFU forwards the appropriate stream to each subscriber based on their downlink bandwidth. (2) <strong>Scalable Video Coding (SVC, e.g. VP9 / AV1)</strong>: The encoder produces a single layered stream consisting of a base layer and multiple enhancement layers. The SFU drops enhancement packets for bandwidth-constrained users without breaking the stream. Simulcast has broader hardware acceleration support across mobile devices, while SVC consumes less client uplink bandwidth."
    },
    {
      conceptId: "#03",
      title: "Global TURN Relay Sizing & Egress Network Physics: Bypass Restrictive Enterprise Firewalls",
      answer: "TURN sizing is strictly an <strong>egress bandwidth and packet-per-second (PPS) sizing exercise</strong>, not CPU-bound, because TURN proxies UDP packets without decoding. Sizing formula: For a 720p video call at 1.5 Mbps, each relayed stream consumes 1.5 Mbps ingress + 1.5 Mbps egress (3 Mbps total bandwidth per session). For 10,000 concurrent relayed streams: $10,000 \\times 3\\text{ Mbps} = 30\\text{ Gbps}$ bandwidth. Production deployment rules: (1) Deploy TURN servers (e.g. <code>coturn</code>) in every major geographical cloud region using Anycast or GeoDNS so users hit a TURN relay within 15ms. (2) Bind TURN to ports 3478 (UDP/TCP) and <strong>port 443 with TLS (TURNS)</strong> to bypass restrictive enterprise firewalls that inspect application protocols."
    },
    {
      conceptId: "#04",
      title: "Why TCP is Fatal for Conversational Media: Head-of-Line Blocking vs. SRTP Packet Loss Recovery",
      answer: "TCP guarantees delivery via retransmission (ACK/NACK) and strictly enforces Head-of-Line (HoL) blocking. If packet 3 is dropped, packets 4, 5, and 6 sit blocked in the kernel buffer until packet 3 is retransmitted, adding 100–300ms of jitter latency. In human conversation, late video is worse than missing video. WebRTC operates over <strong>UDP using SRTP (RFC 3711)</strong>: if a video frame packet is lost, WebRTC drops it and displays the next frame. To mitigate packet loss without latency spikes, WebRTC uses: (1) <strong>NACK (Negative Acknowledgement)</strong> for fast, bounded retransmission within the jitter buffer (50ms); (2) <strong>Forward Error Correction (FEC)</strong>, appending redundant parity packets so lost packets can be reconstructed mathematically; and (3) <strong>PLI (Picture Loss Indication)</strong>, requesting a new I-frame keyframe from the encoder if corruption is severe."
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 143: PART 11 BANNER & WEBRTC REAL-TIME MEDIA FOUNDATIONS -->
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
            WebRTC and Real-Time Media
          </h1>
          <p class="text-[13.5px] text-indigo-100/90 font-sans max-w-3xl leading-relaxed">
            Sub-150ms Conversational Latency, Media Topologies (Mesh vs. SFU vs. MCU), NAT Traversal (STUN/TURN) & Simulcast
          </p>
        </div>

        <!-- Section Title: 11.6 WebRTC and Real-Time Media -->
        <div class="flex flex-col gap-2 pt-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-snug">
              11.6 WebRTC and Real-Time Media
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
              Browser-native framework for real-time peer-to-peer audio, video, and arbitrary data communication with sub-150ms latency.
            </p>
          </div>

          <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2 shadow-md">
            <div class="flex items-center gap-2 text-indigo-400">
              <span class="material-symbols-outlined text-[20px]">lightbulb</span>
              <span class="font-code text-[11px] font-bold uppercase tracking-wider">WHY</span>
            </div>
            <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
              Traditional HTTP streaming (HLS, DASH) buffers media into 2–6 second chunks, resulting in 5–30 seconds of broadcast delay. Real-time human conversation breaks down when latency exceeds 150ms. WebRTC uses UDP/SRTP to achieve conversational immediacy.
            </p>
          </div>
        </div>

        <!-- ARCHITECTURAL TOPOLOGY DIAGRAM: MESH VS SFU VS MCU -->
        <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-6 flex flex-col gap-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">device_hub</span>
              MEDIA TOPOLOGY EVOLUTION: MESH VS. SFU VS. MCU
            </span>
            <span class="text-[10.5px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
              Architectural Trade-offs
            </span>
          </div>

          <div class="font-code text-[12px] sm:text-[13px] leading-relaxed text-slate-300 bg-[#070B14] p-5 rounded-lg border border-[#1E293B] overflow-x-auto">
   <span class="text-amber-300 font-bold">1. MESH (Peer-to-Peer)</span>            <span class="text-emerald-300 font-bold">2. SFU (Selective Forwarding)</span>           <span class="text-rose-300 font-bold">3. MCU (Multipoint Mixer)</span>
      (Max 4 Peers)                     (Industry Standard)                     (Legacy Telepresence)

        Peer A ◄──► Peer B                    Peer A           Peer B                 Peer A           Peer B
          ▲ ╲     ╱ ▲                            │ 1 Up           ▲ 1 Down               │ 1 Up           ▲ 1 Composite
          │   ╲ ╱   │                            ▼                │                      ▼                │
          │   ╱ ╲   │                       ┌─────────────────────────┐            ┌─────────────────────────┐
          ▼ ╱     ╲ ▼                       │   <span class="text-emerald-400 font-bold">SFU ROUTING ENGINE</span>    │            │   <span class="text-rose-400 font-bold">MCU VIDEO MIXER</span>       │
        Peer C ◄──► Peer D                  │  • Zero video decoding  │            │  • Full decode &amp; render │
                                            │  • Forwards raw packets │            │  • Heavy CPU / GPU      │
  • Uplink = N-1 streams                    └────────────┬────────────┘            └────────────┬────────────┘
  • Downlink = N-1 streams                               ▲ 1 Down                               ▲ 1 Composite
  • Chokes at 5 participants                             │                                      │
                                                       Peer C                                 Peer C
          </div>
        </div>

        <!-- TOPOLOGY COMPARISON TABLE -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            REAL-TIME MEDIA TOPOLOGIES COMPARISON
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
            <table class="w-full text-left text-[12px] font-sans border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                  <th class="p-3.5 font-bold">Topology</th>
                  <th class="p-3.5 font-bold">Max Scale</th>
                  <th class="p-3.5 font-bold">Client Upstream</th>
                  <th class="p-3.5 font-bold">Server CPU</th>
                  <th class="p-3.5 font-bold">Latency</th>
                  <th class="p-3.5 font-bold">Production Verdict</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] text-slate-300">
                ${topologyMatrix.map(t => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="p-3.5 font-bold text-white font-code text-[11.5px]">
                      <span class="px-2 py-0.5 rounded text-[10.5px] font-code border ${t.badgeColor}">
                        ${t.topology}
                      </span>
                    </td>
                    <td class="p-3.5 font-sans">${t.participants}</td>
                    <td class="p-3.5 font-code text-[11px] text-slate-300">${t.clientUpstream}</td>
                    <td class="p-3.5 font-sans">${t.serverCpu}</td>
                    <td class="p-3.5 font-bold text-cyan-300 font-code text-[11px]">${t.latency}</td>
                    <td class="p-3.5 font-sans text-slate-300 text-[11px]">${t.verdict}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Official Page 143 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 143</span>
        </div>

      </div>

      <!-- ================================================================= -->
      <!-- PAGE 144: NAT TRAVERSAL (STUN/TURN), SIMULCAST & FOLLOW-UPS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Section Subtitle: NAT Traversal -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              NAT TRAVERSAL & FIREWALL PENETRATION
            </span>
          </div>
          <h3 class="font-sans text-[20px] sm:text-[23px] font-bold text-white tracking-tight">
            ICE, STUN and TURN Architecture
          </h3>
          <p class="text-[13.5px] text-slate-400 font-sans">
            How browsers establish direct UDP media sessions through residential NATs and corporate firewalls
          </p>
        </div>

        <!-- NAT Traversal Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${natTraversal.map(item => `
            <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <span class="font-code text-[13px] font-bold text-white">${item.protocol}</span>
                <span class="text-[10px] font-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  ${item.purpose}
                </span>
              </div>
              <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed flex-1">
                ${item.howItWorks}
              </p>
              <div class="pt-2 border-t border-[#24314A]/70 text-[11.5px] font-sans flex flex-col gap-1">
                <div class="text-emerald-300"><strong>Success:</strong> ${item.successRate}</div>
                <div class="text-amber-300"><strong>Cost:</strong> ${item.cost}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- SIMULCAST & ADAPTIVE BITRATE EXPLANATION -->
        <div class="bg-[#062419] border-l-4 border-[#10B981] rounded-r-xl p-5 flex flex-col gap-2.5 shadow-lg shadow-emerald-950/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">stream</span>
            <span class="font-code text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
              SIMULCAST: SOLVING HETEROGENEOUS CLIENT BANDWIDTH
            </span>
          </div>
          <p class="text-[13.5px] text-emerald-100 font-sans leading-relaxed">
            In a group video call, one participant might be on gigabit fiber while another is on a 3G mobile train connection. In an SFU architecture, the broadcaster encodes <strong>Simulcast</strong>: sending three resolution tiers concurrently (1080p High, 720p Medium, 360p Low).
          </p>
          <p class="text-[13.5px] text-emerald-100/90 font-sans leading-relaxed">
            The SFU dynamically monitors each receiver's Real-Time Transport Control Protocol (RTCP) packet loss reports. The fiber subscriber receives the 1080p stream; the degraded mobile subscriber receives the 360p stream. <strong>The SFU performs zero transcoding</strong>, keeping server CPU flat while preventing one weak connection from degrading the call for everyone.
          </p>
        </div>

        <!-- LATENCY SPECTRUM TABLE: WEBRTC VS LL-HLS VS STANDARD HLS -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            THE DIGITAL STREAMING LATENCY SPECTRUM
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
            <table class="w-full text-left text-[12px] font-sans border-collapse">
              <thead>
                <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                  <th class="p-3.5 font-bold w-[25%]">Latency Category</th>
                  <th class="p-3.5 font-bold w-[22%] text-cyan-300">Underlying Protocol</th>
                  <th class="p-3.5 font-bold w-[30%]">Interactive Experience</th>
                  <th class="p-3.5 font-bold w-[23%]">Industry Standard Application</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1E293B] text-slate-300">
                ${latencySpectrum.map(s => `
                  <tr class="hover:bg-[#141C2E]/60 transition-colors">
                    <td class="p-3.5 font-bold text-white font-code text-[11.5px]">${s.category}</td>
                    <td class="p-3.5 font-code text-emerald-300 text-[11px]">${s.tech}</td>
                    <td class="p-3.5 font-sans leading-relaxed text-slate-300">${s.interaction}</td>
                    <td class="p-3.5 font-sans text-cyan-200 text-[11.5px]">${s.useCase}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- WEBRTC SECURITY ARCHITECTURE: DTLS + SRTP + SCTP DATA CHANNELS -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">security</span>
              MANDATORY ENCRYPTION: DTLS KEY EXCHANGE &amp; SRTP CIPHERS
            </span>
            <span class="text-[10px] font-code text-slate-400 bg-[#0B1120] px-2 py-0.5 rounded border border-[#24314A]">
              RFC 5763 / RFC 5764
            </span>
          </div>

          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Unlike standard web protocols where HTTPS is optional, <strong>WebRTC enforces end-to-end encryption by design</strong>. Media and data channels cannot run in plaintext:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11.5px] font-sans">
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-cyan-300 font-code text-[11px]">1. DTLS Handshake</span>
              <p class="text-slate-300 leading-normal">Runs over UDP. Authenticates peers via self-signed X.509 cert fingerprints exchanged in SDP, and derives symmetric SRTP keys.</p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-emerald-300 font-code text-[11px]">2. SRTP / SRTCP</span>
              <p class="text-slate-300 leading-normal">Encrypts audio/video RTP payloads using AES-128-GCM or AES-CM. Leaves RTP headers plaintext so SFUs can route packets without decrypting!</p>
            </div>
            <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-3 flex flex-col gap-1">
              <span class="font-bold text-amber-300 font-code text-[11px]">3. SCTP DataChannel</span>
              <p class="text-slate-300 leading-normal">Runs encrypted inside DTLS. Allows sending arbitrary reliable (TCP-like) or unreliable (UDP-like) messages for multiplayer games and live chat.</p>
            </div>
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
            WebRTC provides encrypted media and NAT traversal but leaves signaling to you. Topology: Mesh for 1:1, SFU with simulcast for group video calls, HLS for mass broadcast. Never use TCP for sub-150ms conversational media; deploy TURN on port 443 as a resilient fallback for restrictive enterprise NATs.
          </p>
        </div>

        <!-- Official Page 144 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 144</span>
        </div>

      </div>

    </div>
  `;
}
