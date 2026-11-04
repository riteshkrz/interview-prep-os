/**
 * DistributedCacheSections.js
 * Rich SVG diagrams, architecture maps, and deep-dive sections for Question 4: Design a Distributed Cache.
 */

export function getDistributedCacheHldSection() {
  return {
    badge: "HLD ARCHITECTURE",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    title: "High-Level Design (HLD) & Sharded Cluster Topology",
    content: `
      <div class="flex flex-col gap-6">
        <p class="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
          The high-level design organizes a client-side routing model where the cache client determines the node responsible for each key using cluster topology metadata. Primaries handle writes and reads, asynchronous replication streams mirror data to standby replicas, and an independent cluster manager orchestrates automatic failover.
        </p>

        <!-- HIGH DEFINITION SVG ARCHITECTURE DIAGRAM -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] p-5 shadow-lg overflow-x-auto">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-400 text-[20px]">hub</span>
              <strong class="text-[14px] font-bold text-white">Distributed Cache Architecture Blueprint &bull; Client Routing &bull; Primary-Replica Topology</strong>
            </div>
            <span class="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-800/60">Architecture Diagram</span>
          </div>

          <svg viewBox="0 0 1180 700" class="w-full max-w-[1100px] h-auto min-w-[800px] select-none mx-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="dc-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#38BDF8"/>
              </marker>
              <marker id="dc-arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#A855F7"/>
              </marker>
              <marker id="dc-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981"/>
              </marker>
              <marker id="dc-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#F59E0B"/>
              </marker>
              <marker id="dc-arr-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#F43F5E"/>
              </marker>
            </defs>

            <!-- 1. APP: Application Services Tier (Top Left) -->
            <rect x="30" y="35" width="220" height="80" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.8"/>
            <rect x="42" y="45" width="46" height="18" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <text x="65" y="58" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#38BDF8" text-anchor="middle">APP</text>
            <text x="140" y="65" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#F8FAFC" text-anchor="middle">Application Services</text>
            <text x="140" y="85" font-family="Geist, sans-serif" font-size="10.5" fill="#94A3B8" text-anchor="middle">Product &bull; Order &bull; User Services</text>
            <text x="140" y="102" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#38BDF8" text-anchor="middle">Web / Mobile Clients</text>

            <!-- Edge: APP -> CLIENT: GET / PUT / DELETE -->
            <line x1="250" y1="75" x2="372" y2="75" stroke="#38BDF8" stroke-width="2" marker-end="url(#dc-arr)"/>
            <rect x="258" y="63" width="112" height="24" rx="5" fill="#082F49" stroke="#38BDF8" stroke-width="1"/>
            <text x="314" y="79" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#38BDF8" text-anchor="middle">GET / PUT / DELETE</text>

            <!-- 2. CLIENT: Cache Client / Router (Top Center) -->
            <rect x="380" y="35" width="240" height="80" rx="10" fill="#0C4A6E" stroke="#0284C7" stroke-width="2"/>
            <rect x="392" y="45" width="56" height="18" rx="4" fill="#082F49" stroke="#0369A1" stroke-width="1"/>
            <text x="420" y="58" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle">CLIENT</text>
            <text x="500" y="65" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#38BDF8" text-anchor="middle">Cache Client / Router</text>
            <text x="500" y="85" font-family="Geist, sans-serif" font-size="10.5" fill="#BAE6FD" text-anchor="middle">Consistent Hashing &bull; Connection Pool</text>
            <text x="500" y="102" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#7DD3FC" text-anchor="middle">Routes Key &rarr; Primary Shard Node</text>

            <!-- 3. MAP: Cluster Topology (Top Right) -->
            <rect x="880" y="35" width="260" height="80" rx="10" fill="#312E81" stroke="#6366F1" stroke-width="1.8"/>
            <rect x="892" y="45" width="45" height="18" rx="4" fill="#1E1B4B" stroke="#4338CA" stroke-width="1"/>
            <text x="914" y="58" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#A78BFA" text-anchor="middle">MAP</text>
            <text x="1010" y="65" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#C7D2FE" text-anchor="middle">Cluster Topology</text>
            <text x="1010" y="85" font-family="Geist, sans-serif" font-size="10.5" fill="#A5B4FC" text-anchor="middle">Node Assignments &bull; Hash Slot Allocation</text>
            <text x="1010" y="102" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#DDD6FE" text-anchor="middle">Authoritative Cluster State</text>

            <!-- Edge: CLIENT -.-> MAP: Routing metadata -->
            <path d="M 620 58 L 872 58" fill="none" stroke="#818CF8" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#dc-arr-purple)"/>
            <rect x="685" y="46" width="130" height="23" rx="4" fill="#1E1B4B" stroke="#818CF8" stroke-width="1"/>
            <text x="750" y="61" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#C4B5FD" text-anchor="middle">Routing metadata</text>

            <!-- Edge: MAP -.-> CLIENT: Node assignments -->
            <path d="M 880 92 L 628 92" fill="none" stroke="#818CF8" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#dc-arr-purple)"/>
            <rect x="680" y="80" width="140" height="23" rx="4" fill="#1E1B4B" stroke="#818CF8" stroke-width="1"/>
            <text x="750" y="95" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#C4B5FD" text-anchor="middle">Node assignments</text>

            <!-- 4. DB: Persistent Database (Bottom Left) -->
            <rect x="30" y="345" width="220" height="130" rx="12" fill="#451A03" stroke="#D97706" stroke-width="1.8"/>
            <ellipse cx="140" cy="365" rx="80" ry="14" fill="#78350F" stroke="#F59E0B" stroke-width="1.2"/>
            <rect x="42" y="375" width="36" height="18" rx="4" fill="#291002" stroke="#78350F" stroke-width="1"/>
            <text x="60" y="388" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#F59E0B" text-anchor="middle">DB</text>
            <text x="140" y="405" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#FCD34D" text-anchor="middle">Persistent Database</text>
            <text x="140" y="425" font-family="Geist, sans-serif" font-size="10.5" fill="#FDE68A" text-anchor="middle">PostgreSQL / DynamoDB</text>
            <text x="140" y="443" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#F59E0B" text-anchor="middle">Authoritative Source of Truth</text>
            <text x="140" y="460" font-family="Geist, sans-serif" font-size="8.5" fill="#FDE68A" text-anchor="middle">Serves Cache Miss Reads &amp; Writes</text>

            <!-- Edge: APP --> DB: Cache miss: load source data -->
            <path d="M 80 115 L 80 337" fill="none" stroke="#F59E0B" stroke-width="2" marker-end="url(#dc-arr-amber)"/>
            <rect x="5" y="218" width="150" height="24" rx="4" fill="#451A03" stroke="#F59E0B" stroke-width="1"/>
            <text x="80" y="234" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#FCD34D" text-anchor="middle">Cache miss: load source data</text>

            <!-- Edge: DB --> APP: Result, then populate cache -->
            <path d="M 195 345 L 195 123" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#dc-arr-green)"/>
            <rect x="125" y="218" width="145" height="24" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
            <text x="197" y="234" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#86EFAC" text-anchor="middle">Result, then populate cache</text>

            <!-- 5. SHARDED CACHE FLEET BOUNDARY BOX (Center) -->
            <rect x="320" y="165" width="530" height="445" rx="14" fill="#030712" stroke="#334155" stroke-width="1.5"/>
            <text x="340" y="190" font-family="Geist, sans-serif" font-size="11" font-weight="800" fill="#94A3B8" letter-spacing="1">SHARDED CACHE FLEET (RAM KEY-VALUE STORE)</text>

            <!-- ================= SHARD A ================= -->
            <!-- A: Primary Node A -->
            <rect x="340" y="205" width="215" height="85" rx="8" fill="#14532D" stroke="#22C55E" stroke-width="1.8"/>
            <rect x="350" y="215" width="26" height="18" rx="4" fill="#064E3B" stroke="#16A34A" stroke-width="1"/>
            <text x="363" y="228" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#86EFAC" text-anchor="middle">A</text>
            <text x="450" y="232" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#86EFAC" text-anchor="middle">Cache Node A - Primary</text>
            <text x="450" y="252" font-family="Geist, sans-serif" font-size="9.5" fill="#BBF7D0" text-anchor="middle">Hash Ring Sector: 0 - 5460</text>
            <text x="450" y="272" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#DCFCE7" text-anchor="middle">Serves Reads &amp; Writes</text>

            <!-- AR: Replica Node A -->
            <rect x="615" y="205" width="215" height="85" rx="8" fill="#064E3B" stroke="#059669" stroke-width="1.5"/>
            <rect x="625" y="215" width="32" height="18" rx="4" fill="#022C22" stroke="#047857" stroke-width="1"/>
            <text x="641" y="228" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#6EE7B7" text-anchor="middle">AR</text>
            <text x="725" y="232" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Cache Node A - Replica</text>
            <text x="725" y="252" font-family="Geist, sans-serif" font-size="9.5" fill="#A7F3D0" text-anchor="middle">Async Replication Standby</text>
            <text x="725" y="272" font-family="Geist, sans-serif" font-size="9" fill="#D1FAE5" text-anchor="middle">Promotable on Node A Failure</text>

            <!-- Edge: A --> AR: Replication stream -->
            <line x1="555" y1="247" x2="607" y2="247" stroke="#10B981" stroke-width="2" marker-end="url(#dc-arr-green)"/>
            <rect x="532" y="222" width="106" height="20" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
            <text x="585" y="236" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#86EFAC" text-anchor="middle">Replication stream</text>

            <!-- ================= SHARD B ================= -->
            <!-- B: Primary Node B -->
            <rect x="340" y="330" width="215" height="85" rx="8" fill="#14532D" stroke="#22C55E" stroke-width="1.8"/>
            <rect x="350" y="340" width="26" height="18" rx="4" fill="#064E3B" stroke="#16A34A" stroke-width="1"/>
            <text x="363" y="353" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#86EFAC" text-anchor="middle">B</text>
            <text x="450" y="357" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#86EFAC" text-anchor="middle">Cache Node B - Primary</text>
            <text x="450" y="377" font-family="Geist, sans-serif" font-size="9.5" fill="#BBF7D0" text-anchor="middle">Hash Ring Sector: 5461 - 10922</text>
            <text x="450" y="397" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#DCFCE7" text-anchor="middle">Serves Reads &amp; Writes</text>

            <!-- BR: Replica Node B -->
            <rect x="615" y="330" width="215" height="85" rx="8" fill="#064E3B" stroke="#059669" stroke-width="1.5"/>
            <rect x="625" y="340" width="32" height="18" rx="4" fill="#022C22" stroke="#047857" stroke-width="1"/>
            <text x="641" y="353" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#6EE7B7" text-anchor="middle">BR</text>
            <text x="725" y="357" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Cache Node B - Replica</text>
            <text x="725" y="377" font-family="Geist, sans-serif" font-size="9.5" fill="#A7F3D0" text-anchor="middle">Async Replication Standby</text>
            <text x="725" y="397" font-family="Geist, sans-serif" font-size="9" fill="#D1FAE5" text-anchor="middle">Promotable on Node B Failure</text>

            <!-- Edge: B --> BR: Replication stream -->
            <line x1="555" y1="372" x2="607" y2="372" stroke="#10B981" stroke-width="2" marker-end="url(#dc-arr-green)"/>
            <rect x="532" y="347" width="106" height="20" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
            <text x="585" y="361" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#86EFAC" text-anchor="middle">Replication stream</text>

            <!-- ================= SHARD C ================= -->
            <!-- C: Primary Node C -->
            <rect x="340" y="455" width="215" height="85" rx="8" fill="#14532D" stroke="#22C55E" stroke-width="1.8"/>
            <rect x="350" y="465" width="26" height="18" rx="4" fill="#064E3B" stroke="#16A34A" stroke-width="1"/>
            <text x="363" y="478" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#86EFAC" text-anchor="middle">C</text>
            <text x="450" y="482" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#86EFAC" text-anchor="middle">Cache Node C - Primary</text>
            <text x="450" y="502" font-family="Geist, sans-serif" font-size="9.5" fill="#BBF7D0" text-anchor="middle">Hash Ring Sector: 10923 - 16383</text>
            <text x="450" y="522" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#DCFCE7" text-anchor="middle">Serves Reads &amp; Writes</text>

            <!-- CR: Replica Node C -->
            <rect x="615" y="455" width="215" height="85" rx="8" fill="#064E3B" stroke="#059669" stroke-width="1.5"/>
            <rect x="625" y="465" width="32" height="18" rx="4" fill="#022C22" stroke="#047857" stroke-width="1"/>
            <text x="641" y="478" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#6EE7B7" text-anchor="middle">CR</text>
            <text x="725" y="482" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Cache Node C - Replica</text>
            <text x="725" y="502" font-family="Geist, sans-serif" font-size="9.5" fill="#A7F3D0" text-anchor="middle">Async Replication Standby</text>
            <text x="725" y="522" font-family="Geist, sans-serif" font-size="9" fill="#D1FAE5" text-anchor="middle">Promotable on Node C Failure</text>

            <!-- Edge: C --> CR: Replication stream -->
            <line x1="555" y1="497" x2="607" y2="497" stroke="#10B981" stroke-width="2" marker-end="url(#dc-arr-green)"/>
            <rect x="532" y="472" width="106" height="20" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
            <text x="585" y="486" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#86EFAC" text-anchor="middle">Replication stream</text>

            <!-- ================= CLIENT TO PRIMARY NODE ROUTING ================= -->
            <!-- Edge: CLIENT --> A: Keys assigned to A -->
            <path d="M 445 115 L 445 197" fill="none" stroke="#38BDF8" stroke-width="2" marker-end="url(#dc-arr)"/>
            <rect x="385" y="145" width="120" height="22" rx="4" fill="#082F49" stroke="#38BDF8" stroke-width="1"/>
            <text x="445" y="160" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#38BDF8" text-anchor="middle">Keys assigned to A</text>

            <!-- Edge: CLIENT --> B: Keys assigned to B -->
            <path d="M 410 115 L 410 142 L 295 142 L 295 372 L 332 372" fill="none" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#dc-arr)"/>
            <rect x="235" y="260" width="120" height="22" rx="4" fill="#082F49" stroke="#38BDF8" stroke-width="1"/>
            <text x="295" y="275" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#38BDF8" text-anchor="middle">Keys assigned to B</text>

            <!-- Edge: CLIENT --> C: Keys assigned to C -->
            <path d="M 385 115 L 385 130 L 275 130 L 275 497 L 332 497" fill="none" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#dc-arr)"/>
            <rect x="215" y="420" width="120" height="22" rx="4" fill="#082F49" stroke="#38BDF8" stroke-width="1"/>
            <text x="275" y="435" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#38BDF8" text-anchor="middle">Keys assigned to C</text>

            <!-- 6. MGMT: Cluster Manager (Far Right Middle) -->
            <rect x="880" y="220" width="260" height="340" rx="12" fill="#1E1B4B" stroke="#818CF8" stroke-dasharray="6,4" stroke-width="1.8"/>
            <rect x="892" y="232" width="56" height="18" rx="4" fill="#312E81" stroke="#6366F1" stroke-width="1"/>
            <text x="920" y="245" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#DDD6FE" text-anchor="middle">MGMT</text>
            <text x="1010" y="250" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#A78BFA" text-anchor="middle">Cluster Manager</text>
            <text x="1010" y="270" font-family="Geist, sans-serif" font-size="10.5" fill="#C4B5FD" text-anchor="middle">Heartbeat Health Checks &bull; Failover</text>
            <text x="1010" y="288" font-family="Geist, sans-serif" font-size="9.5" font-weight="600" fill="#DDD6FE" text-anchor="middle">Consensus Engine &bull; Epochs &amp; Fencing</text>

            <rect x="895" y="305" width="230" height="65" rx="6" fill="#312E81" stroke="#A78BFA" stroke-width="1"/>
            <text x="1010" y="325" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">Continuous Health Probing</text>
            <text x="1010" y="342" font-family="Geist, sans-serif" font-size="9" fill="#C7D2FE" text-anchor="middle">Detects unresponsive nodes via leases</text>
            <text x="1010" y="358" font-family="Geist, sans-serif" font-size="9" fill="#A5B4FC" text-anchor="middle">Prevents split-brain with consensus quorum</text>

            <rect x="895" y="380" width="230" height="65" rx="6" fill="#4C0519" stroke="#F43F5E" stroke-width="1"/>
            <text x="1010" y="400" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FECDD3" text-anchor="middle">Failover &amp; Promotion Controller</text>
            <text x="1010" y="417" font-family="Geist, sans-serif" font-size="9" fill="#FDA4AF" text-anchor="middle">Promotes standby replica with epoch token</text>
            <text x="1010" y="433" font-family="Geist, sans-serif" font-size="9" fill="#FEE2E2" text-anchor="middle">Broadcasts updated topology to clients</text>

            <!-- ================= MGMT TO REPLICAS: Promote replica ================= -->
            <!-- Edge: MGMT -.-> AR: Promote replica -->
            <path d="M 880 247 L 838 247" fill="none" stroke="#A855F7" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#dc-arr-purple)"/>
            <rect x="825" y="235" width="85" height="20" rx="4" fill="#2E1065" stroke="#A855F7" stroke-width="1"/>
            <text x="867" y="249" font-family="Geist, sans-serif" font-size="7.5" font-weight="700" fill="#E9D5FF" text-anchor="middle">Promote replica</text>

            <!-- Edge: MGMT -.-> BR: Promote replica -->
            <path d="M 880 372 L 838 372" fill="none" stroke="#A855F7" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#dc-arr-purple)"/>
            <rect x="825" y="360" width="85" height="20" rx="4" fill="#2E1065" stroke="#A855F7" stroke-width="1"/>
            <text x="867" y="374" font-family="Geist, sans-serif" font-size="7.5" font-weight="700" fill="#E9D5FF" text-anchor="middle">Promote replica</text>

            <!-- Edge: MGMT -.-> CR: Promote replica -->
            <path d="M 880 497 L 838 497" fill="none" stroke="#A855F7" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#dc-arr-purple)"/>
            <rect x="825" y="485" width="85" height="20" rx="4" fill="#2E1065" stroke="#A855F7" stroke-width="1"/>
            <text x="867" y="499" font-family="Geist, sans-serif" font-size="7.5" font-weight="700" fill="#E9D5FF" text-anchor="middle">Promote replica</text>

            <!-- ================= MGMT TO PRIMARIES: Health checks and failover ================= -->
            <!-- Edge: MGMT -.-> A: Health checks and failover -->
            <path d="M 960 220 L 960 185 L 495 185 L 495 197" fill="none" stroke="#F43F5E" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#dc-arr-rose)"/>
            <rect x="670" y="173" width="155" height="22" rx="4" fill="#4C0519" stroke="#F43F5E" stroke-width="1"/>
            <text x="747" y="188" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#FECDD3" text-anchor="middle">Health checks and failover</text>

            <!-- Edge: MGMT -.-> B: Health checks and failover -->
            <path d="M 880 310 L 495 310 L 495 322" fill="none" stroke="#F43F5E" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#dc-arr-rose)"/>
            <rect x="670" y="298" width="155" height="22" rx="4" fill="#4C0519" stroke="#F43F5E" stroke-width="1"/>
            <text x="747" y="313" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#FECDD3" text-anchor="middle">Health checks and failover</text>

            <!-- Edge: MGMT -.-> C: Health checks and failover -->
            <path d="M 880 435 L 495 435 L 495 447" fill="none" stroke="#F43F5E" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#dc-arr-rose)"/>
            <rect x="670" y="423" width="155" height="22" rx="4" fill="#4C0519" stroke="#F43F5E" stroke-width="1"/>
            <text x="747" y="438" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#FECDD3" text-anchor="middle">Health checks and failover</text>

            <!-- ================= ARCHITECTURAL LEGEND ================= -->
            <rect x="120" y="625" width="940" height="50" rx="10" fill="#0B1120" stroke="#1E293B" stroke-width="1.2"/>
            <line x1="140" y1="650" x2="165" y2="650" stroke="#38BDF8" stroke-width="2.5"/>
            <text x="175" y="654" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#94A3B8">Client Routing (Solid)</text>

            <line x1="320" y1="650" x2="345" y2="650" stroke="#10B981" stroke-width="2.5"/>
            <text x="355" y="654" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#94A3B8">Replication &amp; Populate (Solid)</text>

            <line x1="535" y1="650" x2="560" y2="650" stroke="#F59E0B" stroke-width="2.5"/>
            <text x="570" y="654" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#94A3B8">Cache Miss DB Query (Solid)</text>

            <line x1="745" y1="650" x2="770" y2="650" stroke="#A855F7" stroke-width="2" stroke-dasharray="4,3"/>
            <text x="780" y="654" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#94A3B8">Topology &amp; Promotion (Dashed)</text>

            <line x1="945" y1="650" x2="970" y2="650" stroke="#F43F5E" stroke-width="2" stroke-dasharray="4,3"/>
            <text x="980" y="654" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#94A3B8">Health Checks (Dashed)</text>
          </svg>
        </div>

        <!-- Collapsible Mermaid Source Code Panel -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
          <summary class="flex items-center justify-between cursor-pointer font-semibold text-[13px] text-slate-800 dark:text-slate-200 select-none">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-500 text-[18px]">account_tree</span>
              View High-Level Architecture Mermaid Source Code
            </span>
            <span class="text-[11px] font-mono text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">
flowchart TD
    APP[Application Services]
    CLIENT[Cache Client / Router]
    MAP[Cluster Topology]
    A[Cache Node A - Primary]
    AR[Cache Node A - Replica]
    B[Cache Node B - Primary]
    BR[Cache Node B - Replica]
    C[Cache Node C - Primary]
    CR[Cache Node C - Replica]
    DB[(Persistent Database)]
    MGMT[Cluster Manager]

    APP -->|GET / PUT / DELETE| CLIENT
    CLIENT -.->|Routing metadata| MAP
    MAP -.->|Node assignments| CLIENT

    CLIENT -->|Keys assigned to A| A
    CLIENT -->|Keys assigned to B| B
    CLIENT -->|Keys assigned to C| C

    A -->|Replication stream| AR
    B -->|Replication stream| BR
    C -->|Replication stream| CR

    MGMT -.->|Health checks and failover| A
    MGMT -.->|Health checks and failover| B
    MGMT -.->|Health checks and failover| C
    MGMT -.->|Promote replica| AR
    MGMT -.->|Promote replica| BR
    MGMT -.->|Promote replica| CR

    APP -->|Cache miss: load source data| DB
    DB -->|Result, then populate cache| APP</pre>
        </details>

        <!-- Component Responsibilities Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">table_chart</span>
              Component Responsibilities
            </h4>
            <span class="text-[11px] font-mono text-slate-400">7 Core Architectural Building Blocks</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/3">Component</th>
                  <th class="py-3 px-4 w-2/3">Responsibility</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Application services</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Request and populate cached data</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Cache client/router</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Hash keys and route requests</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Cluster topology</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Track node and partition assignments</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Primary cache nodes</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Serve reads and accept writes</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Replica nodes</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Maintain copies and support recovery</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Cluster manager</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Detect failures and coordinate failover</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Persistent database</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Store durable application data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- END-TO-END FLOWS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          
          <!-- End-to-end read flow -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-3 shadow-xs">
            <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">download</span>
              <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white">End-to-End Read Flow (e.g. product:101)</h5>
            </div>
            <ol class="space-y-2 text-[12.5px] text-slate-700 dark:text-slate-300">
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">1</span>
                <span>The product service receives a request from a user.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">2</span>
                <span>The cache client hashes <code>product:101</code> and identifies <strong>Node A</strong>.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">3</span>
                <span>Node A checks whether the entry exists and is still valid.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">4</span>
                <span><strong>If found:</strong> Node A returns the cached product details immediately (cache hit).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">5</span>
                <span><strong>If missing:</strong> The application queries the persistent database.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">6</span>
                <span>The application stores the result in the cache with a suitable TTL.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">7</span>
                <span>The application returns the result to the user. Subsequent requests hit memory.</span>
              </li>
            </ol>
          </div>

          <!-- End-to-end write flow -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-3 shadow-xs">
            <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">edit_note</span>
              <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white">End-to-End Write Flow (Price Update)</h5>
            </div>
            <ol class="space-y-2 text-[12.5px] text-slate-700 dark:text-slate-300">
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">1</span>
                <span>The application updates the authoritative persistent database.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">2</span>
                <span>After the database update succeeds, the application <strong>invalidates</strong> <code>product:101</code> in the cache.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">3</span>
                <span>The next cache miss triggers a read of the latest committed database value.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[10.5px] shrink-0 mt-0.5">4</span>
                <span>The cache stores the refreshed value for subsequent low-latency requests.</span>
              </li>
            </ol>
            <div class="p-2.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 text-[11.5px] text-purple-900 dark:text-purple-200 mt-1">
              <strong>Cache-Aside Write Strategy:</strong> Updating DB first and invalidating the cache avoids stale overwrites from race conditions. Production systems pair this with retries or event-driven invalidation.
            </div>
          </div>

        </div>
      </div>
    `
  };
}

export function getDistributedCacheDataModelSection() {
  return `
    <div class="flex flex-col gap-5">
      <p class="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
        A distributed cache is not normally modeled as a relational database. Its primary data model is a key-value map held in memory. Partition and node mappings represent cluster metadata.
      </p>

      <!-- 5.1 Main Entities Table -->
      <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
        <table class="w-full text-left text-[12.5px] border-collapse">
          <thead>
            <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
              <th class="py-3 px-4 w-1/4">Entity</th>
              <th class="py-3 px-4 w-1/3">Fields &amp; Types</th>
              <th class="py-3 px-4 w-5/12">Purpose</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td class="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">PARTITION</td>
              <td class="py-2.5 px-4 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">
                string partitionId <span class="text-amber-500 font-bold">PK</span><br/>
                string primaryNodeId <span class="text-blue-500 font-bold">FK</span>
              </td>
              <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Maps a logical hash-ring partition to its authoritative primary cache node</td>
            </tr>
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td class="py-2.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">CACHE_NODE</td>
              <td class="py-2.5 px-4 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">
                string nodeId <span class="text-amber-500 font-bold">PK</span><br/>
                string role<br/>
                string status
              </td>
              <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Represents an operational cache server instance (Primary or Replica)</td>
            </tr>
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td class="py-2.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">REPLICA_MAPPING</td>
              <td class="py-2.5 px-4 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">
                string primaryNodeId <span class="text-blue-500 font-bold">FK</span><br/>
                string replicaNodeId <span class="text-blue-500 font-bold">FK</span>
              </td>
              <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Tracks primary-to-replica replication relationships and standby failover targets</td>
            </tr>
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td class="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">CACHE_ENTRY</td>
              <td class="py-2.5 px-4 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">
                string key <span class="text-amber-500 font-bold">PK</span><br/>
                bytes value<br/>
                timestamp expiresAt
              </td>
              <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Stores the actual cached key-value payload in RAM with TTL metadata</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Cache Entry Example & Layout -->
      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] text-slate-200 flex flex-col gap-2 font-mono text-[12.5px]">
        <div class="text-cyan-400 font-bold">// In-Memory Cache Entry Sample</div>
        <div><strong>Key:</strong> product:101</div>
        <div><strong>Value:</strong> {"name":"Laptop","price":65000}</div>
        <div><strong>ExpiresAt:</strong> 2026-10-24T22:00:00Z</div>
      </div>

      <!-- Logical Metadata ER Diagram (Vector SVG with Crow's Foot Cardinality) -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0B1120] p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
          <strong class="text-[13px] font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-400 text-[18px]">schema</span>
            Logical Metadata ER Diagram
          </strong>
          <span class="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">Crow's Foot Cardinality</span>
        </div>

        <div class="w-full overflow-x-auto py-3 flex justify-center">
          <svg viewBox="0 0 940 370" class="w-full max-w-[920px] h-auto min-w-[720px] select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Card Drop Shadows -->
              <filter id="er-shadow" x="-4%" y="-4%" width="108%" height="110%" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
              </filter>
            </defs>

            <!-- ================= TOP ROW: PARTITION ================= -->
            <g filter="url(#er-shadow)">
              <rect x="30" y="25" width="220" height="125" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.8"/>
              <rect x="30" y="25" width="220" height="34" rx="8" fill="#312E81"/>
              <text x="140" y="47" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#E0E7FF" text-anchor="middle">PARTITION</text>
              <line x1="30" y1="59" x2="250" y2="59" stroke="#6366F1" stroke-width="1"/>
              
              <!-- Attributes -->
              <text x="45" y="82" font-family="Geist Mono, monospace" font-size="11" fill="#C7D2FE">string partitionId</text>
              <text x="215" y="82" font-family="Geist Mono, monospace" font-size="10.5" font-weight="700" fill="#FBBF24" text-anchor="end">PK</text>
              
              <text x="45" y="106" font-family="Geist Mono, monospace" font-size="11" fill="#C7D2FE">string primaryNodeId</text>
              <text x="215" y="106" font-family="Geist Mono, monospace" font-size="10.5" font-weight="700" fill="#38BDF8" text-anchor="end">FK</text>
            </g>

            <!-- ================= TOP ROW: CACHE_NODE ================= -->
            <g filter="url(#er-shadow)">
              <rect x="360" y="25" width="220" height="145" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.8"/>
              <rect x="360" y="25" width="220" height="34" rx="8" fill="#0369A1"/>
              <text x="470" y="47" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#BAE6FD" text-anchor="middle">CACHE_NODE</text>
              <line x1="360" y1="59" x2="580" y2="59" stroke="#0284C7" stroke-width="1"/>

              <!-- Attributes -->
              <text x="375" y="82" font-family="Geist Mono, monospace" font-size="11" fill="#7DD3FC">string nodeId</text>
              <text x="545" y="82" font-family="Geist Mono, monospace" font-size="10.5" font-weight="700" fill="#FBBF24" text-anchor="end">PK</text>

              <text x="375" y="106" font-family="Geist Mono, monospace" font-size="11" fill="#BAE6FD">string role</text>

              <text x="375" y="130" font-family="Geist Mono, monospace" font-size="11" fill="#BAE6FD">string status</text>
            </g>

            <!-- ================= TOP ROW: CACHE_ENTRY ================= -->
            <g filter="url(#er-shadow)">
              <rect x="690" y="25" width="220" height="145" rx="8" fill="#14532D" stroke="#15803D" stroke-width="1.8"/>
              <rect x="690" y="25" width="220" height="34" rx="8" fill="#166534"/>
              <text x="800" y="47" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#BBF7D0" text-anchor="middle">CACHE_ENTRY</text>
              <line x1="690" y1="59" x2="910" y2="59" stroke="#15803D" stroke-width="1"/>

              <!-- Attributes -->
              <text x="705" y="82" font-family="Geist Mono, monospace" font-size="11" fill="#86EFAC">string key</text>
              <text x="875" y="82" font-family="Geist Mono, monospace" font-size="10.5" font-weight="700" fill="#FBBF24" text-anchor="end">PK</text>

              <text x="705" y="106" font-family="Geist Mono, monospace" font-size="11" fill="#BBF7D0">bytes value</text>

              <text x="705" y="130" font-family="Geist Mono, monospace" font-size="11" fill="#BBF7D0">timestamp expiresAt</text>
            </g>

            <!-- ================= BOTTOM ROW: REPLICA_MAPPING ================= -->
            <g filter="url(#er-shadow)">
              <rect x="360" y="235" width="220" height="115" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.8"/>
              <rect x="360" y="235" width="220" height="34" rx="8" fill="#78350F"/>
              <text x="470" y="257" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FDE68A" text-anchor="middle">REPLICA_MAPPING</text>
              <line x1="360" y1="269" x2="580" y2="269" stroke="#D97706" stroke-width="1"/>

              <!-- Attributes -->
              <text x="375" y="292" font-family="Geist Mono, monospace" font-size="11" fill="#FCD34D">string primaryNodeId</text>
              <text x="545" y="292" font-family="Geist Mono, monospace" font-size="10.5" font-weight="700" fill="#38BDF8" text-anchor="end">FK</text>

              <text x="375" y="316" font-family="Geist Mono, monospace" font-size="11" fill="#FCD34D">string replicaNodeId</text>
              <text x="545" y="316" font-family="Geist Mono, monospace" font-size="10.5" font-weight="700" fill="#38BDF8" text-anchor="end">FK</text>
            </g>

            <!-- ================= RELATIONSHIP 1: PARTITION ||--|| CACHE_NODE ================= -->
            <!-- Line: x=250 to x=360 at y=85 -->
            <line x1="250" y1="85" x2="360" y2="85" stroke="#818CF8" stroke-width="2"/>
            
            <!-- Crow's foot notation: Exactly one || on PARTITION side (x=258, 264) -->
            <line x1="258" y1="78" x2="258" y2="92" stroke="#818CF8" stroke-width="2"/>
            <line x1="264" y1="78" x2="264" y2="92" stroke="#818CF8" stroke-width="2"/>

            <!-- Crow's foot notation: Exactly one || on CACHE_NODE side (x=346, 352) -->
            <line x1="346" y1="78" x2="346" y2="92" stroke="#818CF8" stroke-width="2"/>
            <line x1="352" y1="78" x2="352" y2="92" stroke="#818CF8" stroke-width="2"/>

            <!-- Relationship Label Pill -->
            <rect x="256" y="94" width="98" height="18" rx="4" fill="#1E1B4B" stroke="#6366F1" stroke-width="1"/>
            <text x="305" y="106" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#C7D2FE" text-anchor="middle">owned by primary</text>

            <!-- ================= RELATIONSHIP 2: CACHE_NODE ||--o{ CACHE_ENTRY ================= -->
            <!-- Line: x=580 to x=690 at y=85 -->
            <line x1="580" y1="85" x2="690" y2="85" stroke="#34D399" stroke-width="2"/>

            <!-- Crow's foot notation: Exactly one || on CACHE_NODE side (x=588, 594) -->
            <line x1="588" y1="78" x2="588" y2="92" stroke="#34D399" stroke-width="2"/>
            <line x1="594" y1="78" x2="594" y2="92" stroke="#34D399" stroke-width="2"/>

            <!-- Crow's foot notation: Zero or more o{ on CACHE_ENTRY side (Circle at x=674, Crow at x=690) -->
            <circle cx="674" cy="85" r="4" fill="#0B1120" stroke="#34D399" stroke-width="1.8"/>
            <line x1="680" y1="85" x2="690" y2="78" stroke="#34D399" stroke-width="2"/>
            <line x1="680" y1="85" x2="690" y2="85" stroke="#34D399" stroke-width="2"/>
            <line x1="680" y1="85" x2="690" y2="92" stroke="#34D399" stroke-width="2"/>

            <!-- Relationship Label Pill -->
            <rect x="596" y="94" width="78" height="18" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
            <text x="635" y="106" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">stores entries</text>

            <!-- ================= RELATIONSHIP 3: CACHE_NODE ||--o{ REPLICA_MAPPING (primary) ================= -->
            <!-- Vertical line: x=425 from y=170 to y=235 -->
            <line x1="425" y1="170" x2="425" y2="235" stroke="#F59E0B" stroke-width="2"/>

            <!-- Exactly one || on CACHE_NODE side (y=176, 182) -->
            <line x1="418" y1="176" x2="432" y2="176" stroke="#F59E0B" stroke-width="2"/>
            <line x1="418" y1="182" x2="432" y2="182" stroke="#F59E0B" stroke-width="2"/>

            <!-- Zero or more o{ on REPLICA_MAPPING side (Circle at y=222, Crow at y=235) -->
            <circle cx="425" cy="221" r="4" fill="#0B1120" stroke="#F59E0B" stroke-width="1.8"/>
            <line x1="425" y1="226" x2="418" y2="235" stroke="#F59E0B" stroke-width="2"/>
            <line x1="425" y1="226" x2="425" y2="235" stroke="#F59E0B" stroke-width="2"/>
            <line x1="425" y1="226" x2="432" y2="235" stroke="#F59E0B" stroke-width="2"/>

            <!-- Label Pill -->
            <rect x="400" y="193" width="50" height="18" rx="4" fill="#451A03" stroke="#D97706" stroke-width="1"/>
            <text x="425" y="205" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#FCD34D" text-anchor="middle">primary</text>

            <!-- ================= RELATIONSHIP 4: CACHE_NODE ||--o{ REPLICA_MAPPING (replica) ================= -->
            <!-- Vertical line: x=515 from y=170 to y=235 -->
            <line x1="515" y1="170" x2="515" y2="235" stroke="#F59E0B" stroke-width="2"/>

            <!-- Exactly one || on CACHE_NODE side (y=176, 182) -->
            <line x1="508" y1="176" x2="522" y2="176" stroke="#F59E0B" stroke-width="2"/>
            <line x1="508" y1="182" x2="522" y2="182" stroke="#F59E0B" stroke-width="2"/>

            <!-- Zero or more o{ on REPLICA_MAPPING side (Circle at y=222, Crow at y=235) -->
            <circle cx="515" cy="221" r="4" fill="#0B1120" stroke="#F59E0B" stroke-width="1.8"/>
            <line x1="515" y1="226" x2="508" y2="235" stroke="#F59E0B" stroke-width="2"/>
            <line x1="515" y1="226" x2="515" y2="235" stroke="#F59E0B" stroke-width="2"/>
            <line x1="515" y1="226" x2="522" y2="235" stroke="#F59E0B" stroke-width="2"/>

            <!-- Label Pill -->
            <rect x="490" y="193" width="50" height="18" rx="4" fill="#451A03" stroke="#D97706" stroke-width="1"/>
            <text x="515" y="205" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#FCD34D" text-anchor="middle">replica</text>
          </svg>
        </div>

        <!-- Collapsible Mermaid Source Definition -->
        <details class="group mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 text-[12px]">
          <summary class="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-purple-500">code</span>
              View ER Diagram Mermaid Source Code
            </span>
            <span class="text-[11px] font-mono text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">
erDiagram
    PARTITION ||--|| CACHE_NODE : "owned by primary"
    CACHE_NODE ||--o{ REPLICA_MAPPING : "primary"
    CACHE_NODE ||--o{ REPLICA_MAPPING : "replica"
    CACHE_NODE ||--o{ CACHE_ENTRY : "stores entries"

    PARTITION {
        string partitionId PK
        string primaryNodeId FK
    }

    CACHE_NODE {
        string nodeId PK
        string role
        string status
    }

    REPLICA_MAPPING {
        string primaryNodeId FK
        string replicaNodeId FK
    }

    CACHE_ENTRY {
        string key PK
        bytes value
        timestamp expiresAt
    }</pre>
        </details>
      </div>

      <!-- Why use an in-memory key-value store? -->
      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-2">
        <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
          <span class="material-symbols-outlined text-purple-500 text-[18px]">verified</span>
          Why use an in-memory key-value store?
        </h5>
        <p class="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
          A key-value model perfectly matches the application's dominant access pattern: <code>key &rarr; value</code>. It eliminates relational joins, disk I/O, and query parsing overhead. Direct RAM address lookup yields sub-millisecond latencies, while TTL and eviction policies prevent memory exhaustion. The durable database remains the persistent system of record.
        </p>
      </div>
    </div>
  `;
}

export function getDistributedCacheLldSection() {
  return {
    badge: "LLD & CODE",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    title: "Low-Level Design (LLD), Class & Sequence Diagrams, Pseudocode",
    content: `
      <div class="flex flex-col gap-6">
        <p class="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
          The LLD describes how the client and individual cache nodes implement operations, maintain consistent hash ring routing, enforce LRU eviction, and coordinate cache-aside flows.
        </p>

        <!-- Main Classes and Interfaces Table -->
        <div class="flex flex-col gap-3">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px]">view_module</span>
            Main Classes and Interfaces
          </h5>
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/3">Class or Interface</th>
                  <th class="py-3 px-4 w-2/3">Responsibility</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">CacheClient</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Exposes <code>get(key)</code>, <code>put(key, value, ttl)</code>, and <code>delete(key)</code> to application services</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">PartitionRouter</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Determines node assignment via <code>getNode(key)</code> and maintains cluster routing via <code>refreshTopology()</code></td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">HashRing</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Implements consistent hashing with virtual nodes via <code>getNode(key)</code>, <code>addNode(nodeId)</code>, and <code>removeNode(nodeId)</code></td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">CacheNode</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Primary storage engine managing in-memory <code>-entries</code> map and serving <code>get</code>, <code>put</code>, and <code>delete</code></td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">CacheEntry</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Encapsulates <code>key</code>, <code>value</code>, <code>expiresAt</code>, and evaluates TTL expiration via <code>isExpired()</code></td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">EvictionPolicy</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Interface defining eviction behavior under memory limits via <code>onInsert(key)</code> and <code>evictCandidate()</code></td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">ReplicationManager</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Propagates primary write/delete mutations to follower replicas via <code>replicate(operation)</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Class Diagram (Vector SVG) -->
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0B1120] p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-[13px] font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-400 text-[18px]">account_tree</span>
              LLD Class Diagram
            </strong>
            <span class="text-[11px] font-mono text-emerald-400">Object Relationships &amp; Method Contracts</span>
          </div>

          <div class="w-full overflow-x-auto py-2 flex justify-center">
            <svg viewBox="0 0 1060 400" class="w-full max-w-[1020px] h-auto min-w-[780px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="lld-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#34D399"/>
                </marker>
                <marker id="lld-arr-sky" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#38BDF8"/>
                </marker>
                <marker id="lld-arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#A855F7"/>
                </marker>
                <marker id="lld-arr-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#F43F5E"/>
                </marker>
              </defs>

              <!-- ================= TOP ROW ================= -->

              <!-- 1. CacheClient -->
              <rect x="20" y="25" width="220" height="120" rx="8" fill="#042F2E" stroke="#10B981" stroke-width="1.6"/>
              <rect x="20" y="25" width="220" height="30" rx="8" fill="#064E3B"/>
              <text x="130" y="45" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">CacheClient</text>
              <line x1="20" y1="55" x2="240" y2="55" stroke="#10B981" stroke-width="1"/>
              <text x="32" y="75" font-family="Geist Mono, monospace" font-size="10" fill="#A7F3D0">+get(key) value</text>
              <text x="32" y="97" font-family="Geist Mono, monospace" font-size="10" fill="#A7F3D0">+put(key, value, ttl)</text>
              <text x="32" y="119" font-family="Geist Mono, monospace" font-size="10" fill="#A7F3D0">+delete(key)</text>

              <!-- Line: CacheClient --> PartitionRouter -->
              <line x1="240" y1="85" x2="288" y2="85" stroke="#34D399" stroke-width="2" marker-end="url(#lld-arr)"/>

              <!-- 2. PartitionRouter -->
              <rect x="295" y="25" width="230" height="120" rx="8" fill="#042F2E" stroke="#10B981" stroke-width="1.6"/>
              <rect x="295" y="25" width="230" height="30" rx="8" fill="#064E3B"/>
              <text x="410" y="45" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">PartitionRouter</text>
              <line x1="295" y1="55" x2="525" y2="55" stroke="#10B981" stroke-width="1"/>
              <text x="307" y="80" font-family="Geist Mono, monospace" font-size="10" fill="#A7F3D0">+getNode(key) CacheNode</text>
              <text x="307" y="105" font-family="Geist Mono, monospace" font-size="10" fill="#A7F3D0">+refreshTopology()</text>

              <!-- Line: PartitionRouter --> HashRing -->
              <line x1="410" y1="145" x2="410" y2="217" stroke="#34D399" stroke-width="2" marker-end="url(#lld-arr)"/>

              <!-- Line: PartitionRouter --> CacheNode -->
              <line x1="525" y1="85" x2="573" y2="85" stroke="#34D399" stroke-width="2" marker-end="url(#lld-arr)"/>

              <!-- 3. CacheNode -->
              <rect x="580" y="25" width="215" height="150" rx="8" fill="#082F49" stroke="#0284C7" stroke-width="1.8"/>
              <rect x="580" y="25" width="215" height="30" rx="8" fill="#0C4A6E"/>
              <text x="687" y="45" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#38BDF8" text-anchor="middle">CacheNode</text>
              <line x1="580" y1="55" x2="795" y2="55" stroke="#0284C7" stroke-width="1"/>
              <!-- Attributes -->
              <text x="592" y="74" font-family="Geist Mono, monospace" font-size="10" fill="#FDA4AF">-entries</text>
              <line x1="580" y1="84" x2="795" y2="84" stroke="#0284C7" stroke-width="1" stroke-dasharray="3,3"/>
              <!-- Methods -->
              <text x="592" y="103" font-family="Geist Mono, monospace" font-size="10" fill="#BAE6FD">+get(key)</text>
              <text x="592" y="125" font-family="Geist Mono, monospace" font-size="10" fill="#BAE6FD">+put(key, value, ttl)</text>
              <text x="592" y="147" font-family="Geist Mono, monospace" font-size="10" fill="#BAE6FD">+delete(key)</text>

              <!-- Relationship: CacheNode *-- CacheEntry (COMPOSITION) -->
              <!-- Solid diamond at CacheNode side (x=795..811), solid line to CacheEntry (x=845) -->
              <polygon points="795,85 805,79 815,85 805,91" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5"/>
              <line x1="815" y1="85" x2="845" y2="85" stroke="#38BDF8" stroke-width="2"/>

              <!-- 4. CacheEntry -->
              <rect x="845" y="25" width="195" height="150" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.8"/>
              <rect x="845" y="25" width="195" height="30" rx="8" fill="#78350F"/>
              <text x="942" y="45" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FCD34D" text-anchor="middle">CacheEntry</text>
              <line x1="845" y1="55" x2="1040" y2="55" stroke="#D97706" stroke-width="1"/>
              <!-- Attributes -->
              <text x="857" y="74" font-family="Geist Mono, monospace" font-size="10" fill="#FDE68A">+key</text>
              <text x="857" y="94" font-family="Geist Mono, monospace" font-size="10" fill="#FDE68A">+value</text>
              <text x="857" y="114" font-family="Geist Mono, monospace" font-size="10" fill="#FDE68A">+expiresAt</text>
              <line x1="845" y1="124" x2="1040" y2="124" stroke="#D97706" stroke-width="1" stroke-dasharray="3,3"/>
              <!-- Methods -->
              <text x="857" y="145" font-family="Geist Mono, monospace" font-size="10" fill="#FEF08A">+isExpired()</text>

              <!-- ================= BOTTOM ROW ================= -->

              <!-- 5. HashRing -->
              <rect x="295" y="225" width="230" height="135" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.6"/>
              <rect x="295" y="225" width="230" height="30" rx="8" fill="#312E81"/>
              <text x="410" y="245" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#C7D2FE" text-anchor="middle">HashRing</text>
              <line x1="295" y1="255" x2="525" y2="255" stroke="#6366F1" stroke-width="1"/>
              <text x="307" y="280" font-family="Geist Mono, monospace" font-size="10" fill="#E0E7FF">+getNode(key) nodeId</text>
              <text x="307" y="305" font-family="Geist Mono, monospace" font-size="10" fill="#E0E7FF">+addNode(nodeId)</text>
              <text x="307" y="330" font-family="Geist Mono, monospace" font-size="10" fill="#E0E7FF">+removeNode(nodeId)</text>

              <!-- Line: CacheNode --> EvictionPolicy -->
              <line x1="655" y1="175" x2="655" y2="227" stroke="#A855F7" stroke-width="2" marker-end="url(#lld-arr-purple)"/>

              <!-- 6. EvictionPolicy -->
              <rect x="580" y="235" width="215" height="120" rx="8" fill="#2E1065" stroke="#9333EA" stroke-width="1.6"/>
              <rect x="580" y="235" width="215" height="30" rx="8" fill="#581C87"/>
              <text x="687" y="255" font-family="Geist, sans-serif" font-size="11.5" font-weight="800" fill="#E9D5FF" text-anchor="middle">EvictionPolicy</text>
              <line x1="580" y1="265" x2="795" y2="265" stroke="#9333EA" stroke-width="1"/>
              <text x="592" y="292" font-family="Geist Mono, monospace" font-size="10" fill="#DDD6FE">+onInsert(key)</text>
              <text x="592" y="318" font-family="Geist Mono, monospace" font-size="10" fill="#DDD6FE">+evictCandidate()</text>

              <!-- Line: CacheNode --> ReplicationManager -->
              <path d="M 740 175 L 740 205 L 942 205 L 942 227" fill="none" stroke="#F43F5E" stroke-width="2" marker-end="url(#lld-arr-rose)"/>

              <!-- 7. ReplicationManager -->
              <rect x="845" y="235" width="195" height="120" rx="8" fill="#4C0519" stroke="#E11D48" stroke-width="1.6"/>
              <rect x="845" y="235" width="195" height="30" rx="8" fill="#881337"/>
              <text x="942" y="255" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FECDD3" text-anchor="middle">ReplicationManager</text>
              <line x1="845" y1="265" x2="1040" y2="265" stroke="#E11D48" stroke-width="1"/>
              <text x="857" y="302" font-family="Geist Mono, monospace" font-size="10" fill="#FFE4E6">+replicate(operation)</text>

              <!-- Mini Legend Bar -->
              <line x1="30" y1="380" x2="55" y2="380" stroke="#34D399" stroke-width="2" marker-end="url(#lld-arr)"/>
              <text x="65" y="384" font-family="Geist, sans-serif" font-size="9.5" fill="#94A3B8">--&gt; Directed Association</text>

              <polygon points="230,380 236,375 242,380 236,385" fill="#38BDF8" stroke="#0284C7" stroke-width="1.2"/>
              <line x1="242" y1="380" x2="265" y2="380" stroke="#38BDF8" stroke-width="1.8"/>
              <text x="275" y="384" font-family="Geist, sans-serif" font-size="9.5" fill="#94A3B8">*-- Composition (CacheNode owns CacheEntry)</text>
            </svg>
          </div>
        </div>

        <!-- Collapsible Mermaid Source Code Panel -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
          <summary class="flex items-center justify-between cursor-pointer font-semibold text-[13px] text-slate-800 dark:text-slate-200 select-none">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-500 text-[18px]">account_tree</span>
              View LLD Class Diagram Mermaid Source Code
            </span>
            <span class="text-[11px] font-mono text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">
classDiagram
    class CacheClient {
        +get(key) value
        +put(key, value, ttl)
        +delete(key)
    }

    class PartitionRouter {
        +getNode(key) CacheNode
        +refreshTopology()
    }

    class HashRing {
        +getNode(key) nodeId
        +addNode(nodeId)
        +removeNode(nodeId)
    }

    class CacheNode {
        -entries
        +get(key)
        +put(key, value, ttl)
        +delete(key)
    }

    class CacheEntry {
        +key
        +value
        +expiresAt
        +isExpired()
    }

    class EvictionPolicy {
        +onInsert(key)
        +evictCandidate()
    }

    class ReplicationManager {
        +replicate(operation)
    }

    CacheClient --> PartitionRouter
    PartitionRouter --> HashRing
    PartitionRouter --> CacheNode
    CacheNode *-- CacheEntry
    CacheNode --> EvictionPolicy
    CacheNode --> ReplicationManager</pre>
        </details>

        <!-- Sequence Diagram: Cache-Aside Read (Vector SVG) -->
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0B1120] p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-[13px] font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-cyan-400 text-[18px]">sync_alt</span>
              Sequence Diagram: Cache-Aside Read (Hit vs Miss)
            </strong>
            <span class="text-[11px] font-mono text-cyan-400">Application Fallback Execution Flow</span>
          </div>

          <div class="w-full overflow-x-auto py-2 flex justify-center">
            <svg viewBox="0 0 920 540" class="w-full max-w-[880px] h-auto min-w-[700px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="seq-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#38BDF8"/>
                </marker>
                <marker id="seq-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981"/>
                </marker>
                <marker id="seq-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#F59E0B"/>
                </marker>
                <marker id="seq-arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#A855F7"/>
                </marker>
              </defs>

              <!-- Lifelines Header -->
              <!-- 1. App as Application -->
              <rect x="30" y="15" width="160" height="40" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1.8"/>
              <text x="110" y="40" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#F8FAFC" text-anchor="middle">Application</text>
              <line x1="110" y1="55" x2="110" y2="520" stroke="#475569" stroke-dasharray="4,4" stroke-width="1.5"/>

              <!-- 2. Client as Cache Client -->
              <rect x="250" y="15" width="160" height="40" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.8"/>
              <text x="330" y="40" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#38BDF8" text-anchor="middle">Cache Client</text>
              <line x1="330" y1="55" x2="330" y2="520" stroke="#0284C7" stroke-dasharray="4,4" stroke-width="1.5"/>

              <!-- 3. Node as Cache Node -->
              <rect x="470" y="15" width="160" height="40" rx="8" fill="#14532D" stroke="#10B981" stroke-width="1.8"/>
              <text x="550" y="40" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#6EE7B7" text-anchor="middle">Cache Node</text>
              <line x1="550" y1="55" x2="550" y2="520" stroke="#10B981" stroke-dasharray="4,4" stroke-width="1.5"/>

              <!-- 4. DB as Database -->
              <rect x="690" y="15" width="160" height="40" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.8"/>
              <text x="770" y="40" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FCD34D" text-anchor="middle">Database</text>
              <line x1="770" y1="55" x2="770" y2="520" stroke="#F59E0B" stroke-dasharray="4,4" stroke-width="1.5"/>

              <!-- Step 1: App -> Client: GET product:101 -->
              <line x1="110" y1="80" x2="322" y2="80" stroke="#38BDF8" stroke-width="2" marker-end="url(#seq-arr)"/>
              <text x="220" y="72" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">GET product:101</text>

              <!-- Step 2: Client -> Node: GET product:101 -->
              <line x1="330" y1="105" x2="542" y2="105" stroke="#38BDF8" stroke-width="2" marker-end="url(#seq-arr)"/>
              <text x="440" y="97" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">GET product:101</text>

              <!-- ALT BOX: alt Cache hit / else Cache miss -->
              <rect x="45" y="125" width="790" height="385" rx="8" fill="none" stroke="#64748B" stroke-width="1.2" stroke-dasharray="6,4"/>
              
              <!-- Alt Tag: Cache Hit -->
              <rect x="45" y="125" width="110" height="22" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
              <text x="100" y="140" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#86EFAC" text-anchor="middle">alt [Cache hit]</text>

              <!-- Step 3: Node -->> Client: Cached value -->
              <line x1="550" y1="155" x2="338" y2="155" stroke="#10B981" stroke-width="1.8" stroke-dasharray="4,3" marker-end="url(#seq-arr-green)"/>
              <text x="440" y="147" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#86EFAC" text-anchor="middle">Cached value</text>

              <!-- Step 4: Client -->> App: Product details -->
              <line x1="330" y1="180" x2="118" y2="180" stroke="#10B981" stroke-width="1.8" stroke-dasharray="4,3" marker-end="url(#seq-arr-green)"/>
              <text x="220" y="172" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#86EFAC" text-anchor="middle">Product details</text>

              <!-- Else Divider Line -->
              <line x1="45" y1="205" x2="835" y2="205" stroke="#64748B" stroke-dasharray="4,4" stroke-width="1"/>
              <rect x="45" y="205" width="125" height="22" rx="4" fill="#451A03" stroke="#F59E0B" stroke-width="1"/>
              <text x="107" y="220" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#FCD34D" text-anchor="middle">[else: Cache miss]</text>

              <!-- Step 5: Node -->> Client: Not found -->
              <line x1="550" y1="235" x2="338" y2="235" stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="4,3" marker-end="url(#seq-arr-amber)"/>
              <text x="440" y="227" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FCD34D" text-anchor="middle">Not found</text>

              <!-- Step 6: Client -->> App: Cache miss -->
              <line x1="330" y1="260" x2="118" y2="260" stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="4,3" marker-end="url(#seq-arr-amber)"/>
              <text x="220" y="252" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FCD34D" text-anchor="middle">Cache miss</text>

              <!-- Step 7: App -> DB: SELECT product 101 -->
              <line x1="110" y1="295" x2="762" y2="295" stroke="#F59E0B" stroke-width="2" marker-end="url(#seq-arr-amber)"/>
              <text x="440" y="287" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FCD34D" text-anchor="middle">SELECT product 101</text>

              <!-- Step 8: DB -->> App: Product details -->
              <line x1="770" y1="325" x2="118" y2="325" stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="4,3" marker-end="url(#seq-arr-amber)"/>
              <text x="440" y="317" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FCD34D" text-anchor="middle">Product details</text>

              <!-- Step 9: App -> Client: PUT product:101, value, TTL -->
              <line x1="110" y1="360" x2="322" y2="360" stroke="#38BDF8" stroke-width="2" marker-end="url(#seq-arr)"/>
              <text x="220" y="351" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#38BDF8" text-anchor="middle">PUT product:101, value, TTL</text>

              <!-- Step 10: Client -> Node: Store entry -->
              <line x1="330" y1="390" x2="542" y2="390" stroke="#38BDF8" stroke-width="2" marker-end="url(#seq-arr)"/>
              <text x="440" y="381" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">Store entry</text>

              <!-- Step 11: Node -->> Client: Stored -->
              <line x1="550" y1="420" x2="338" y2="420" stroke="#10B981" stroke-width="1.8" stroke-dasharray="4,3" marker-end="url(#seq-arr-green)"/>
              <text x="440" y="412" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#86EFAC" text-anchor="middle">Stored</text>

              <!-- Step 12: App -->> App: Continue response processing (Self message) -->
              <path d="M 110 455 L 165 455 L 165 480 L 118 480" fill="none" stroke="#A78BFA" stroke-dasharray="4,3" stroke-width="1.8" marker-end="url(#seq-arr-purple)"/>
              <text x="175" y="471" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#DDD6FE" text-anchor="start">Continue response processing</text>
            </svg>
          </div>
          <p class="text-[12px] text-slate-400">
            <strong>Demonstration:</strong> The application coordinates database fallback because the cache does not own durable truth. If cache insertion fails, the application still returns the database result safely.
          </p>
        </div>

        <!-- Collapsible Mermaid Sequence Diagram Source Code Panel -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
          <summary class="flex items-center justify-between cursor-pointer font-semibold text-[13px] text-slate-800 dark:text-slate-200 select-none">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-cyan-500 text-[18px]">sync_alt</span>
              View Sequence Diagram Mermaid Source Code
            </span>
            <span class="text-[11px] font-mono text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">
sequenceDiagram
    participant App as Application
    participant Client as Cache Client
    participant Node as Cache Node
    participant DB as Database

    App->>Client: GET product:101
    Client->>Node: GET product:101

    alt Cache hit
        Node-->>Client: Cached value
        Client-->>App: Product details
    else Cache miss
        Node-->>Client: Not found
        Client-->>App: Cache miss
        App->>DB: SELECT product 101
        DB-->>App: Product details
        App->>Client: PUT product:101, value, TTL
        Client->>Node: Store entry
        Node-->>Client: Stored
        App-->>App: Continue response processing
    end</pre>
        </details>

        <!-- Simple Pseudocode -->
        <div class="flex flex-col gap-3">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px]">code</span>
            Simple Local Cache Node Pseudocode
          </h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#0A0F1D] border border-slate-800 rounded-xl p-4 font-mono text-[12px] text-slate-200 leading-relaxed overflow-x-auto">
              <span class="text-cyan-400 font-bold block mb-2">// GET(key) with Passive Expiration</span>
GET(key):
    entry = entries.get(key)

    if entry does not exist:
        return MISS

    if entry.isExpired():
        entries.remove(key)
        evictionPolicy.onRemove(key)
        return MISS

    evictionPolicy.onAccess(key)
    return entry.value
            </div>

            <div class="bg-[#0A0F1D] border border-slate-800 rounded-xl p-4 font-mono text-[12px] text-slate-200 leading-relaxed overflow-x-auto">
              <span class="text-emerald-400 font-bold block mb-2">// PUT(key, value, ttl) with Eviction</span>
PUT(key, value, ttl):
    while memoryLimitReached():
        victim = evictionPolicy.evictCandidate()
        if victim is None: break
        entries.remove(victim)

    expiresAt = currentTime() + ttl
    newEntry = CacheEntry(value, expiresAt)
    entries[key] = newEntry
    evictionPolicy.onInsert(key)
    replicationManager.replicateAsync("PUT", key, newEntry)
            </div>
          </div>
        </div>

      </div>
    `
  };
}

export function getDistributedCacheAlgorithmsSection() {
  return {
    badge: "ALGORITHMS & PATTERNS",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    title: "Important Algorithms and Design Patterns",
    content: `
      <div class="flex flex-col gap-6">
        <p class="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
          A distributed cache relies on a concise set of foundational distributed algorithms and patterns: consistent hashing, cache-aside, TTL expiration, capacity eviction, replication, request coalescing, and circuit breakers.
        </p>

        <!-- Consistent Hashing with Virtual Nodes Visual -->
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0B1120] p-5 flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-[13.5px] font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-400 text-[18px]">rotate_right</span>
              Consistent Hashing &amp; Hash Ring Partitioning
            </strong>
            <span class="text-[11px] font-mono text-amber-400">Minimal Key Movement Under Scaling</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <!-- Ring Visual (SVG) -->
            <div class="md:col-span-5 flex justify-center">
              <svg viewBox="0 0 280 280" class="w-[260px] h-[260px] select-none" xmlns="http://www.w3.org/2000/svg">
                <!-- Outer Ring -->
                <circle cx="140" cy="140" r="100" fill="none" stroke="#475569" stroke-width="4" stroke-dasharray="3,3"/>
                <text x="140" y="135" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#94A3B8" text-anchor="middle">HASH RING</text>
                <text x="140" y="152" font-family="Geist, sans-serif" font-size="9" fill="#64748B" text-anchor="middle">0 &rarr; 2^32 - 1</text>

                <!-- Node A (Top) -->
                <circle cx="140" cy="40" r="14" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
                <text x="140" y="44" font-family="Geist, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">A</text>
                <text x="140" y="18" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">Node A</text>

                <!-- Node B (Bottom Right) -->
                <circle cx="225" cy="190" r="14" fill="#16A34A" stroke="#4ADE80" stroke-width="2"/>
                <text x="225" y="194" font-family="Geist, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">B</text>
                <text x="245" y="215" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#4ADE80" text-anchor="middle">Node B</text>

                <!-- Node C (Bottom Left) -->
                <circle cx="55" cy="190" r="14" fill="#9333EA" stroke="#C084FC" stroke-width="2"/>
                <text x="55" y="194" font-family="Geist, sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">C</text>
                <text x="35" y="215" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#C084FC" text-anchor="middle">Node C</text>

                <!-- Key product:101 mapped to A -->
                <circle cx="100" cy="55" r="5" fill="#F59E0B"/>
                <path d="M 100 55 A 100 100 0 0 1 130 42" fill="none" stroke="#F59E0B" stroke-width="1.8"/>
                <text x="80" y="42" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#FCD34D">product:101</text>

                <!-- Key product:202 mapped to B -->
                <circle cx="210" cy="130" r="5" fill="#F59E0B"/>
                <path d="M 210 130 A 100 100 0 0 1 222 178" fill="none" stroke="#F59E0B" stroke-width="1.8"/>
                <text x="220" y="120" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#FCD34D">product:202</text>

                <!-- Key user:501 mapped to C -->
                <circle cx="120" cy="238" r="5" fill="#F59E0B"/>
                <path d="M 120 238 A 100 100 0 0 1 65 198" fill="none" stroke="#F59E0B" stroke-width="1.8"/>
                <text x="120" y="260" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#FCD34D">user:501</text>
              </svg>
            </div>

            <!-- Explanation & Tradeoffs -->
            <div class="md:col-span-7 flex flex-col gap-3 text-[12.5px] text-slate-300">
              <p>
                <strong>What it does:</strong> Maps both keys and cache node tokens onto a continuous $2^{32}-1$ integer ring. A key is assigned to the first node encountered moving clockwise.
              </p>
              <p>
                <strong>Why it is needed:</strong> When nodes are added or removed, standard modular hashing (<code>hash(key) % N</code>) remaps nearly $100\%$ of keys, causing a catastrophic database overload. Consistent hashing remaps only $K/N$ keys on average.
              </p>
              <div class="grid grid-cols-2 gap-3 pt-1">
                <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11.5px]">
                  <strong class="text-emerald-400 block mb-1">Advantages</strong>
                  <ul class="list-disc list-inside space-y-0.5 text-slate-300">
                    <li>Limits key remapping to $1/N$ during node scaling</li>
                    <li>Virtual nodes smooth out variance across hardware</li>
                  </ul>
                </div>
                <div class="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-[11.5px]">
                  <strong class="text-rose-400 block mb-1">Limitations</strong>
                  <ul class="list-disc list-inside space-y-0.5 text-slate-300">
                    <li>Does not stop single hot keys from pinning 1 node</li>
                    <li>Requires clients to maintain up-to-date topology</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cache-Aside Decision Pattern -->
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0B1120] p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-[13.5px] font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-400 text-[18px]">account_tree</span>
              Cache-Aside Pattern Decision Flow
            </strong>
            <span class="text-[11px] font-mono text-blue-400">Application Lazy-Loading Core</span>
          </div>

          <div class="w-full overflow-x-auto py-2 flex justify-center">
            <svg viewBox="0 0 860 480" class="w-full max-w-[820px] h-auto min-w-[650px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="ca-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#38BDF8"/>
                </marker>
                <marker id="ca-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981"/>
                </marker>
                <marker id="ca-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#F59E0B"/>
                </marker>
              </defs>

              <!-- Node A: Application requests key -->
              <rect x="290" y="20" width="280" height="50" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1.8"/>
              <rect x="300" y="32" width="22" height="18" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1"/>
              <text x="311" y="45" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#38BDF8" text-anchor="middle">A</text>
              <text x="440" y="51" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#F8FAFC" text-anchor="middle">Application requests key</text>

              <!-- Arrow A -> B -->
              <line x1="430" y1="70" x2="430" y2="102" stroke="#38BDF8" stroke-width="2" marker-end="url(#ca-arr)"/>

              <!-- Node B: Decision Diamond {Cache hit?} -->
              <polygon points="430,105 520,150 430,195 340,150" fill="#0C4A6E" stroke="#0284C7" stroke-width="2"/>
              <rect x="350" y="141" width="20" height="18" rx="4" fill="#082F49" stroke="#0369A1" stroke-width="1"/>
              <text x="360" y="154" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle">B</text>
              <text x="430" y="154" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#38BDF8" text-anchor="middle">Cache hit?</text>

              <!-- ================= BRANCH YES ================= -->
              <!-- Edge: B -->|Yes| C -->
              <path d="M 340 150 L 200 150 L 200 220" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#ca-arr-green)"/>
              <rect x="245" y="138" width="50" height="22" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
              <text x="270" y="153" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#86EFAC" text-anchor="middle">Yes</text>

              <!-- Node C: Return cached value -->
              <rect x="90" y="225" width="220" height="65" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.8"/>
              <rect x="100" y="235" width="20" height="18" rx="4" fill="#022C22" stroke="#047857" stroke-width="1"/>
              <text x="110" y="248" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#86EFAC" text-anchor="middle">C</text>
              <text x="200" y="252" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#86EFAC" text-anchor="middle">Return cached value</text>
              <text x="200" y="272" font-family="Geist, sans-serif" font-size="9.5" fill="#BBF7D0" text-anchor="middle">Sub-millisecond In-Memory Hit</text>

              <!-- ================= BRANCH NO ================= -->
              <!-- Edge: B -->|No| D -->
              <path d="M 520 150 L 650 150 L 650 220" fill="none" stroke="#F59E0B" stroke-width="2" marker-end="url(#ca-arr-amber)"/>
              <rect x="560" y="138" width="45" height="22" rx="4" fill="#451A03" stroke="#F59E0B" stroke-width="1"/>
              <text x="582" y="153" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#FCD34D" text-anchor="middle">No</text>

              <!-- Node D: Read database -->
              <rect x="540" y="225" width="220" height="60" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.8"/>
              <rect x="550" y="235" width="20" height="18" rx="4" fill="#291002" stroke="#78350F" stroke-width="1"/>
              <text x="560" y="248" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#F59E0B" text-anchor="middle">D</text>
              <text x="650" y="250" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FCD34D" text-anchor="middle">Read database</text>
              <text x="650" y="270" font-family="Geist, sans-serif" font-size="9.5" fill="#FDE68A" text-anchor="middle">Query Authoritative Database</text>

              <!-- Edge: D --> E -->
              <line x1="650" y1="285" x2="650" y2="310" stroke="#38BDF8" stroke-width="2" marker-end="url(#ca-arr)"/>

              <!-- Node E: Populate cache -->
              <rect x="540" y="315" width="220" height="60" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.8"/>
              <rect x="550" y="325" width="20" height="18" rx="4" fill="#082F49" stroke="#0369A1" stroke-width="1"/>
              <text x="560" y="338" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle">E</text>
              <text x="650" y="340" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#38BDF8" text-anchor="middle">Populate cache</text>
              <text x="650" y="360" font-family="Geist, sans-serif" font-size="9.5" fill="#BAE6FD" text-anchor="middle">Store Key-Value with Suitable TTL</text>

              <!-- Edge: E --> F -->
              <line x1="650" y1="375" x2="650" y2="400" stroke="#38BDF8" stroke-width="2" marker-end="url(#ca-arr)"/>

              <!-- Node F: Return value -->
              <rect x="540" y="405" width="220" height="60" rx="8" fill="#1E293B" stroke="#34D399" stroke-width="1.8"/>
              <rect x="550" y="415" width="20" height="18" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1"/>
              <text x="560" y="428" font-family="Geist Mono, monospace" font-size="9" font-weight="700" fill="#34D399" text-anchor="middle">F</text>
              <text x="650" y="430" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#34D399" text-anchor="middle">Return value</text>
              <text x="650" y="450" font-family="Geist, sans-serif" font-size="9.5" fill="#A7F3D0" text-anchor="middle">Deliver Result to Consumer Service</text>
            </svg>
          </div>
        </div>

        <!-- Collapsible Mermaid Cache-Aside Flowchart Source Code Panel -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 transition-all">
          <summary class="flex items-center justify-between cursor-pointer font-semibold text-[13px] text-slate-800 dark:text-slate-200 select-none">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-500 text-[18px]">account_tree</span>
              View Cache-Aside Decision Flow Mermaid Source Code
            </span>
            <span class="text-[11px] font-mono text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
          </summary>
          <pre class="mt-2.5 p-3 rounded-md bg-[#070B14] border border-slate-800 font-mono text-[11.5px] text-cyan-300 overflow-x-auto leading-relaxed">
flowchart TD
    A[Application requests key] --> B{Cache hit?}
    B -->|Yes| C[Return cached value]
    B -->|No| D[Read database]
    D --> E[Populate cache]
    E --> F[Return value]</pre>
        </details>

        <!-- Algorithm Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- TTL and Eviction -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
            <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-amber-500 text-[18px]">timer</span>
              TTL and Eviction Policies
            </h5>
            <p class="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>TTL (Time to Live):</strong> Dictates temporal validity. Evaluated passively on access, and actively via background random sampling (e.g. 20 random keys every 100ms).<br/>
              <strong>Eviction:</strong> Frees memory when RAM budget reaches capacity. <strong>LRU</strong> removes the least recently accessed keys via doubly linked lists; <strong>LFU</strong> tracks access counters to preserve persistently hot items.
            </p>
          </div>

          <!-- Request Coalescing and TTL Jitter -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
            <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-indigo-500 text-[18px]">alt_route</span>
              Request Coalescing &amp; TTL Jitter
            </h5>
            <p class="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Singleflight / Coalescing:</strong> If 1,000 concurrent threads request missing key <code>product:101</code>, coalescing pauses 999 threads and executes only 1 database query, broadcasting the answer to all.<br/>
              <strong>TTL Jitter:</strong> Adds $\pm 10\%$ randomized variance to TTL expiration times so that millions of bulk-warmed keys do not expire simultaneously in a devastating cliff.
            </p>
          </div>

          <!-- Replication and Failover -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
            <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-emerald-500 text-[18px]">autorenew</span>
              Replication and Automatic Failover
            </h5>
            <p class="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Primaries replicate operations asynchronously to follower standby nodes. If the primary misses heartbeats, the cluster consensus layer promotes the replica with the lowest offset, issues a fencing epoch, and publishes an updated partition map to clients.
            </p>
          </div>

          <!-- Circuit Breaker and Bounded Retries -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
            <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-rose-500 text-[18px]">gpp_bad</span>
              Circuit Breaker &amp; Bounded Retries
            </h5>
            <p class="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Trips open when cache error rates exceed defined thresholds, redirecting callers to an aggressive rate-limited fallback or shedding non-critical reads. Bounded retries with exponential backoff prevent retry storms from executing against failing infrastructure.
            </p>
          </div>
        </div>

      </div>
    `
  };
}

export function getDistributedCacheScalabilitySection() {
  return {
    badge: "SCALABILITY",
    badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    title: "Scalability, Reliability & Architectural Trade-offs",
    content: `
      <div class="flex flex-col gap-5">
        <p class="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
          Scaling a distributed cache requires separating what is essential in Day 1 from optimizations added as traffic explodes.
        </p>

        <!-- Scalability Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[12.5px]">
          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">grid_view</span>
              Horizontal Scaling
            </strong>
            <span class="text-slate-600 dark:text-slate-300">Add nodes and redistribute hash ring slots. Virtual nodes limit keys migrated during scaling.</span>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">layers</span>
              Caching Strategy (L1/L2)
            </strong>
            <span class="text-slate-600 dark:text-slate-300">Optional small in-process L1 cache (e.g. Caffeine) handles extreme hot keys before hitting distributed L2.</span>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">alt_route</span>
              Routing &amp; Load Balancing
            </strong>
            <span class="text-slate-600 dark:text-slate-300">Client-side hashing skips proxy hops; proxy-based routing centralizes security and simplifies client code.</span>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">pie_chart</span>
              Partitioning &amp; Sharding
            </strong>
            <span class="text-slate-600 dark:text-slate-300">Divides keyspace across primaries. Each node owns only its fraction of the working set.</span>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">copy_all</span>
              Replication
            </strong>
            <span class="text-slate-600 dark:text-slate-300">Asynchronous replica mirroring preserves node recovery without penalizing write latency.</span>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">database</span>
              Database Scaling
            </strong>
            <span class="text-slate-600 dark:text-slate-300">Database must be sized for the 10% miss rate (3,000 queries/sec) with connection pooling and read replicas.</span>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">schedule_send</span>
              Asynchronous Processing
            </strong>
            <span class="text-slate-600 dark:text-slate-300">CDC (Debezium) or event-stream consumers handle reliable background cache invalidation on DB commits.</span>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">speed</span>
              Rate Limiting &amp; Backpressure
            </strong>
            <span class="text-slate-600 dark:text-slate-300">Bounds concurrent fallback queries to prevent cascading database crashes during cache cold starts.</span>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
            <strong class="text-slate-900 dark:text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-blue-500 text-[16px]">health_and_safety</span>
              Fault Tolerance &amp; DR
            </strong>
            <span class="text-slate-600 dark:text-slate-300">Automatic promotion, circuit breaking, and staged cache warm-up scripts protect production systems.</span>
          </div>
        </div>

        <!-- Essential vs Optional Table -->
        <div class="flex flex-col gap-2 mt-2">
          <h5 class="font-bold text-[13.5px] text-slate-900 dark:text-white">Essential versus Optional Design Choices</h5>
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/2 text-emerald-700 dark:text-emerald-400">Essential for the Initial Design</th>
                  <th class="py-3 px-4 w-1/2 text-purple-700 dark:text-purple-400">Add When Justified by Requirements</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">&bull; Key-value storage in RAM</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">&bull; In-process L1 local cache layer</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">&bull; TTL expiration and LRU eviction</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">&bull; Advanced adaptive eviction policies</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">&bull; Consistent hashing partitioning</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">&bull; Automated rebalancing optimization</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">&bull; Timeouts and bounded retries</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">&bull; Sophisticated traffic shaping &amp; QoS tiers</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">&bull; Replication and failure detection</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">&bull; Cross-region cache replication</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">&bull; Cache-miss fallback to DB</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">&bull; Durable event-driven invalidation (CDC)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `
  };
}

export function getDistributedCacheFailureScenariosSection() {
  return {
    badge: "FAILURE DRILLS",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    title: "Failure Scenarios, Detection & Mitigation Matrix",
    content: `
      <div class="flex flex-col gap-6">
        <p class="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
          A production cache must anticipate partial and catastrophic failures to protect downstream databases and maintain uptime.
        </p>

        <!-- Complete Failure Matrix Table -->
        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
          <table class="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                <th class="py-3 px-4 w-1/5">Failure Scenario</th>
                <th class="py-3 px-4 w-1/5">Detection</th>
                <th class="py-3 px-4 w-2/5">Recovery or Mitigation</th>
                <th class="py-3 px-4 w-1/5">Remaining Limitation</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Primary cache node crashes</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Health checks &amp; missed heartbeats</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Promote replica and refresh routing metadata</td>
                <td class="py-2.5 px-4 text-slate-500">Recent async writes may be lost</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Replica falls behind</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Replication lag metrics</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Alert, resynchronize offset, or replace replica</td>
                <td class="py-2.5 px-4 text-slate-500">Reduced failover confidence</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Cache stampede</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Sudden spike in misses &amp; DB load</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Request coalescing (singleflight), TTL jitter, locks</td>
                <td class="py-2.5 px-4 text-slate-500">First query still takes latency hit</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Hot key overload</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Per-key latency &amp; uneven node CPU</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Local in-process L1 caching, replication across nodes</td>
                <td class="py-2.5 px-4 text-slate-500">Replicating complicates writes</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Cache memory exhausted</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">RAM utilization &amp; eviction rate</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">LRU eviction, scale out nodes, compress payloads</td>
                <td class="py-2.5 px-4 text-slate-500">Eviction increases miss traffic</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Entire cluster unavailable</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Connection timeouts &amp; cluster alarms</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Controlled DB fallback, circuit breakers, rate limits</td>
                <td class="py-2.5 px-4 text-slate-500">Degraded throughput &amp; latency</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Stale data after update</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Version check / freshness monitor</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Invalidate immediately, retry invalidation, version keys</td>
                <td class="py-2.5 px-4 text-slate-500">Window of eventual consistency</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Network partition</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Heartbeats &amp; quorum split detection</td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Prevent dual-primary writes with epochs/fencing</td>
                <td class="py-2.5 px-4 text-slate-500">Minority partitions reject writes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TWO DEEP DIVE SCENARIOS (Scenario A & Scenario B) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
          
          <!-- Scenario A: Primary Node Failure -->
          <div class="p-5 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-white dark:bg-[#0B1120] flex flex-col gap-3 shadow-xs">
            <div class="flex items-center gap-2 border-b border-rose-100 dark:border-rose-900/40 pb-2.5">
              <span class="material-symbols-outlined text-rose-600 dark:text-rose-400 text-[20px]">warning</span>
              <h5 class="font-bold text-[14px] text-slate-900 dark:text-white">Scenario A: Primary Node Failure</h5>
            </div>
            <p class="text-[12.5px] text-slate-700 dark:text-slate-300">Suppose Node A crashes while storing product catalog data:</p>
            <ol class="space-y-1.5 text-[12px] text-slate-700 dark:text-slate-300">
              <li><strong>Detection:</strong> Cluster manager heartbeats detect Node A is unresponsive.</li>
              <li><strong>Evaluation:</strong> Manager verifies failure quorum to rule out transient blips.</li>
              <li><strong>Promotion:</strong> Standby Replica A is elected and promoted to Primary.</li>
              <li><strong>Topology Update:</strong> New partition map is pushed to client routing rings.</li>
              <li><strong>Client Failover:</strong> Clients route retries to the new Primary safely.</li>
            </ol>
            <div class="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-[11.5px] text-rose-900 dark:text-rose-200">
              <strong>Split-Brain Guard:</strong> Fencing tokens and monotonically increasing epochs guarantee that if the dead Node A recovers, it is rejected and reconfigured as a replica.
            </div>
          </div>

          <!-- Scenario B: Cache Cluster Outage -->
          <div class="p-5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-white dark:bg-[#0B1120] flex flex-col gap-3 shadow-xs">
            <div class="flex items-center gap-2 border-b border-amber-100 dark:border-amber-900/40 pb-2.5">
              <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[20px]">crisis_alert</span>
              <h5 class="font-bold text-[14px] text-slate-900 dark:text-white">Scenario B: Entire Cluster Outage &amp; Cascading Failure</h5>
            </div>
            <p class="text-[12.5px] text-slate-700 dark:text-slate-300">
              If every cache node goes offline simultaneously, routing 35,000 peak requests/sec directly into the database will trigger instant database collapse.
            </p>
            <ul class="space-y-1.5 text-[12px] text-slate-700 dark:text-slate-300 list-disc list-inside">
              <li><strong>Circuit Breaker:</strong> Trips open immediately, cutting direct fallback flood.</li>
              <li><strong>Concurrency Bounding:</strong> Limits database connections to safe thread pool maximums.</li>
              <li><strong>Graceful Degradation:</strong> Serves stale data where permissible or sheds non-critical traffic.</li>
              <li><strong>Controlled Warm-Up:</strong> Pre-populates critical hot keys before reopening public traffic.</li>
            </ul>
            <div class="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11.5px] text-amber-900 dark:text-amber-200">
              <strong>Key Architectural Lesson:</strong> High availability requires protecting your dependencies, not merely restarting failed nodes!
            </div>
          </div>

        </div>
      </div>
    `
  };
}

export function getDistributedCacheSecurityObservabilitySection() {
  return {
    badge: "OPS & METRICS",
    badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    title: "Security Architecture & Observability Framework",
    content: `
      <div class="flex flex-col gap-6">
        
        <!-- Security Checklist -->
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-3 shadow-xs">
          <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-[18px]">security</span>
            <h5 class="font-bold text-[14px] text-slate-900 dark:text-white">Security Standards</h5>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px] text-slate-700 dark:text-slate-300">
            <div><strong>&bull; Authentication &amp; AuthZ:</strong> Mutual TLS (mTLS) or token-based authentication. Namespace ACLs prevent services from overwriting other teams' cached records.</div>
            <div><strong>&bull; Network Isolation:</strong> Cache nodes deployed within private VPC subnets with strict security groups; no public internet ingress.</div>
            <div><strong>&bull; Encryption:</strong> TLS in-transit across availability zones; data-at-rest encryption where underlying flash/memory dumps occur.</div>
            <div><strong>&bull; Data Minimization:</strong> Enforce policies forbidding plaintext secrets, PII, or raw credit cards in cached payloads.</div>
            <div><strong>&bull; Input Validation:</strong> Enforce 250-byte key limits and maximum payload limits (e.g. 1 MB) to prevent denial-of-service memory exhaustion.</div>
            <div><strong>&bull; Multi-Tenant Isolation:</strong> Tenant key prefixing (<code>{tenant_id}:{key}</code>) and memory quotas per tenant.</div>
          </div>
        </div>

        <!-- Observability & Metrics Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-[18px]">monitoring</span>
              Observability Metrics
            </h5>
            <span class="text-[11px] font-mono text-cyan-400">Key Health Indicators</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/3">Metric</th>
                  <th class="py-3 px-4 w-2/3">Why It Matters</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">Cache hit rate</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Measures how often reads are served from RAM (Target $\ge 90\%$)</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">p50, p95, p99 latency</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Reveals latency spikes and GC pause tail performance issues</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">Operations per second</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Shows current load against the 35,000 peak design limit</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">Memory usage</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Tracks RAM threshold against 70% operational ceiling</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">Eviction rate</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Spikes indicate memory pressure or inadequate TTL sizing</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">Replication lag</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Determines data freshness and safe failover readiness</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">Miss rate &amp; DB fallback rate</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Reveals potential database query overload</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">Node health &amp; failover count</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Signals hardware instability or cluster network partitions</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">Network throughput</td>
                  <td class="py-2 px-4 text-slate-600 dark:text-slate-300">Ensures traffic remains within the 280 Mbps bandwidth budget</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Hit Rate Math & Alerting -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/50 dark:bg-cyan-950/20 flex flex-col gap-2">
            <strong class="text-cyan-950 dark:text-cyan-200 text-[13px] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-cyan-600 text-[18px]">calculate</span>
              Cache Hit Rate Formula
            </strong>
            <div class="p-3 rounded-lg bg-white dark:bg-[#070D18] border border-cyan-200 dark:border-cyan-900/50 font-mono text-[12px] text-cyan-700 dark:text-cyan-300 text-center">
              Hit Rate = [ Hits / (Hits + Misses) ] &times; 100%
            </div>
            <p class="text-[11.5px] text-slate-600 dark:text-slate-400">
              A declining hit rate points to cold-start churn, insufficient memory eviction, or an application working set that outgrew RAM capacity.
            </p>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
            <strong class="text-slate-900 dark:text-white text-[13px] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-amber-500 text-[18px]">notifications_active</span>
              Alerting Thresholds
            </strong>
            <ul class="text-[11.5px] text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
              <li><strong>Critical:</strong> Cache hit rate drops below $80\%$ for $\gt 3$ minutes</li>
              <li><strong>Warning:</strong> Node memory exceeds $75\%$ capacity</li>
              <li><strong>Critical:</strong> Replication lag exceeds $500\\text{ ms}$ on any primary</li>
              <li><strong>Emergency:</strong> Circuit breaker opens on cache client fleet</li>
            </ul>
          </div>
        </div>

      </div>
    `
  };
}

export function getDistributedCacheFinalSummarySection() {
  return {
    badge: "REVISION BLUEPRINT",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    title: "Final Revision Summary & Key Takeaways",
    content: `
      <div class="flex flex-col gap-5">
        
        <!-- Compact architecture summary -->
        <div class="flex flex-col gap-3">
          <h5 class="font-bold text-[14.5px] text-slate-900 dark:text-white">
            Compact architecture summary
          </h5>

          <div class="max-w-[760px] w-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-6 md:p-8 shadow-xs flex flex-col items-center gap-3">
            <!-- Tier 1: Application -->
            <div class="w-full py-4 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center shadow-xs">
              <div class="font-bold text-[15px] text-slate-900 dark:text-white">Application</div>
            </div>

            <!-- Arrow -->
            <div class="text-slate-700 dark:text-slate-300 font-bold text-[18px] leading-none select-none my-0.5">&darr;</div>

            <!-- Tier 2: Cache Client -->
            <div class="w-full py-3.5 px-6 rounded-xl border border-[#C6EAD0] dark:border-emerald-800/60 bg-[#EBF7EE] dark:bg-emerald-950/40 text-center flex flex-col gap-1 shadow-xs">
              <div class="font-bold text-[15px] text-slate-900 dark:text-white">Cache Client</div>
              <div class="text-[13px] text-slate-600 dark:text-slate-300 font-normal">Consistent hashing and node routing</div>
            </div>

            <!-- Arrow -->
            <div class="text-slate-700 dark:text-slate-300 font-bold text-[18px] leading-none select-none my-0.5">&darr;</div>

            <!-- Tier 3: Shard Fleet Cards -->
            <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <!-- Primary A -->
              <div class="py-4 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col items-center justify-center gap-2 text-center shadow-xs">
                <div class="font-bold text-[14.5px] text-slate-900 dark:text-white">Primary A</div>
                <svg class="w-5 h-5 text-slate-800 dark:text-slate-200 my-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <div class="text-[13px] text-slate-600 dark:text-slate-400">Replica A</div>
              </div>

              <!-- Primary B -->
              <div class="py-4 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col items-center justify-center gap-2 text-center shadow-xs">
                <div class="font-bold text-[14.5px] text-slate-900 dark:text-white">Primary B</div>
                <svg class="w-5 h-5 text-slate-800 dark:text-slate-200 my-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <div class="text-[13px] text-slate-600 dark:text-slate-400">Replica B</div>
              </div>

              <!-- Primary C -->
              <div class="py-4 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col items-center justify-center gap-2 text-center shadow-xs">
                <div class="font-bold text-[14.5px] text-slate-900 dark:text-white">Primary C</div>
                <svg class="w-5 h-5 text-slate-800 dark:text-slate-200 my-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <div class="text-[13px] text-slate-600 dark:text-slate-400">Replica C</div>
              </div>
            </div>

            <!-- Partitioned data subtitle -->
            <div class="text-[13px] text-slate-500 dark:text-slate-400 text-center font-normal pt-1 pb-0.5">
              Partitioned data, replication, TTL and eviction
            </div>

            <!-- Arrow -->
            <div class="text-slate-700 dark:text-slate-300 font-bold text-[18px] leading-none select-none my-0.5">&darr;</div>

            <!-- Tier 4: Persistent Database -->
            <div class="w-full py-3.5 px-6 rounded-xl border border-[#FCDDC6] dark:border-amber-800/60 bg-[#FEF1E6] dark:bg-amber-950/40 text-center flex flex-col gap-1 shadow-xs">
              <div class="font-bold text-[15px] text-slate-900 dark:text-white">Persistent Database</div>
              <div class="text-[13px] text-slate-600 dark:text-slate-300 font-normal">Application fallback on cache miss</div>
            </div>
          </div>
        </div>

        <!-- The 9 Most Important Points to Remember -->
        <div class="flex flex-col gap-3">
          <h5 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">checklist</span>
            The 9 Most Important Points to Remember in the Interview
          </h5>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Purpose</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">Reduce latency and database load by keeping hot data in RAM.</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Access Pattern</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">Direct <code>key &rarr; value</code> lookups avoiding relational join overhead.</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Capacity Math</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">35k peak ops/s, 43–57 GB primary RAM (70% utilization), 280 Mbps bandwidth.</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">4</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Partitioning</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">Consistent hashing ring with virtual nodes minimizes key churn.</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">5</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Availability</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">Asynchronous follower replication with cluster manager failover.</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">6</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Expiration</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">TTL enforces freshness; LRU eviction enforces RAM capacity limits.</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">7</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Consistency</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">Eventual consistency via database update followed by cache invalidation.</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">8</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Reliability</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">Request coalescing (singleflight) &amp; TTL jitter stop stampedes.</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">9</span>
              <div>
                <strong class="text-slate-900 dark:text-white text-[12.5px] block">Trade-Offs</strong>
                <span class="text-slate-600 dark:text-slate-300 text-[12px]">Balance speed, memory cost, freshness, and database protection.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Practice checklist -->
        <div class="flex flex-col gap-3 mt-4">
          <div class="flex flex-col gap-1">
            <h5 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[19px]">task_alt</span>
              Practice checklist
            </h5>
            <p class="text-[13px] text-slate-600 dark:text-slate-400">
              Use this checklist to practice the design independently.
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-6 shadow-xs flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <strong class="text-[14px] font-bold text-slate-900 dark:text-white">Interview readiness</strong>
              <span id="dc-readiness-counter" class="text-[13px] font-medium text-slate-500 dark:text-slate-400">0 of 12</span>
            </div>

            <div class="flex flex-col gap-3" id="dc-checklist-items">
              <!-- Item 1 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="0" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Clarify functional and non-functional requirements</span>
              </label>

              <!-- Item 2 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="1" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">State assumptions and estimate peak traffic</span>
              </label>

              <!-- Item 3 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="2" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Calculate memory and bandwidth requirements</span>
              </label>

              <!-- Item 4 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="3" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Define GET, PUT, DELETE and TTL semantics</span>
              </label>

              <!-- Item 5 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="4" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Explain the key-value data model</span>
              </label>

              <!-- Item 6 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="5" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Draw the HLD with clients, primary nodes, replicas and database</span>
              </label>

              <!-- Item 7 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="6" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Walk through cache hit, cache miss and write flows</span>
              </label>

              <!-- Item 8 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="7" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Explain consistent hashing and replication</span>
              </label>

              <!-- Item 9 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="8" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Discuss eviction, invalidation and cache stampede</span>
              </label>

              <!-- Item 10 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="9" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Handle at least five failure scenarios</span>
              </label>

              <!-- Item 11 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="10" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Explain monitoring, security and scaling</span>
              </label>

              <!-- Item 12 -->
              <label class="dc-check-row flex items-center gap-3.5 cursor-pointer py-1 select-none group" data-idx="11" onclick="window.__toggleDcCheck && window.__toggleDcCheck(this)">
                <span class="dc-check-circle w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 transition-all group-hover:border-purple-400">
                  <span class="material-symbols-outlined dc-check-icon text-[13px] text-white opacity-0 transition-opacity">check</span>
                </span>
                <span class="dc-check-label text-[13.5px] text-slate-800 dark:text-slate-200 transition-colors">Compare alternatives and justify the final choices</span>
              </label>
            </div>

            <div class="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <button id="dc-reset-checklist-btn" type="button" onclick="window.__resetDcChecklist && window.__resetDcChecklist()" class="px-3.5 py-1.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all shadow-xs cursor-pointer active:scale-95">
                Reset checklist
              </button>
            </div>
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" onerror="window.__initDcChecklist && window.__initDcChecklist()" class="hidden" alt="" />
          </div>
        </div>

      </div>
    `
  };
}

// Client-side state handler for Section 15.3 Practice Checklist
if (typeof window !== 'undefined') {
  const STORAGE_KEY = 'dc_practice_checklist_v1';

  window.__initDcChecklist = function() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const rows = document.querySelectorAll('.dc-check-row');
      const counter = document.getElementById('dc-readiness-counter');
      let count = 0;
      rows.forEach((row, idx) => {
        const isChecked = !!saved[idx];
        const circle = row.querySelector('.dc-check-circle');
        const icon = row.querySelector('.dc-check-icon');
        const label = row.querySelector('.dc-check-label');
        if (isChecked) {
          count++;
          circle?.classList.add('bg-purple-600', 'border-purple-600', 'dark:bg-purple-500', 'dark:border-purple-500');
          circle?.classList.remove('border-slate-300', 'dark:border-slate-600');
          icon?.classList.remove('opacity-0');
          label?.classList.add('text-slate-400', 'dark:text-slate-500', 'line-through');
        } else {
          circle?.classList.remove('bg-purple-600', 'border-purple-600', 'dark:bg-purple-500', 'dark:border-purple-500');
          circle?.classList.add('border-slate-300', 'dark:border-slate-600');
          icon?.classList.add('opacity-0');
          label?.classList.remove('text-slate-400', 'dark:text-slate-500', 'line-through');
        }
      });
      if (counter) counter.textContent = `${count} of ${rows.length || 12}`;
    } catch (e) {}
  };

  window.__toggleDcCheck = function(rowEl) {
    const idx = parseInt(rowEl.getAttribute('data-idx') || '0', 10);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      saved[idx] = !saved[idx];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      window.__initDcChecklist();
    } catch (e) {}
  };

  window.__resetDcChecklist = function() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.__initDcChecklist();
    } catch (e) {}
  };

  setTimeout(() => {
    if (window.__initDcChecklist) window.__initDcChecklist();
  }, 100);
}

