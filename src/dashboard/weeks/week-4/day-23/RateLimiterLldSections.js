/**
 * Rate Limiter LLD Sections (Sections 7 through 14)
 * Complete Low-Level Design, Sequence Diagrams, Multi-Server Coordination,
 * Data Models, Lua Algorithm, Failure Scenarios, and Capacity Estimation
 * Question 2: Design a Distributed Rate Limiter
 */

export function getRateLimiterLldCustomSections() {
  return [
    // =========================================================================
    // SECTION 7: LLD DIAGRAM — HOW THE TOKEN BUCKET WORKS & REFILL FORMULA
    // =========================================================================
    {
      badge: "LLD & MATH",
      badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
      title: "LLD diagram — how the Token Bucket works",
      content: `
        <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          
          <!-- Policy Assumption Card -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <span class="text-[12px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Baseline Policy Assumption</span>
            <ul class="list-disc pl-5 space-y-1 text-[13px]">
              <li><strong>Bucket capacity:</strong> 5 tokens.</li>
              <li><strong>Refill rate:</strong> 1 token per second.</li>
              <li><strong>Each request costs:</strong> 1 token.</li>
            </ul>
            <p class="text-[12.5px] text-slate-500 dark:text-slate-400 pt-1">
              The bucket starts full. A request consumes one token, and time replenishes the bucket up to its maximum capacity.
            </p>
          </div>

          <!-- LLD LOGIC FLOW DIAGRAM (SVG - FLOWCHART TD) -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[17px] text-cyan-600 dark:text-cyan-400">account_tree</span>
                Atomic Token Bucket Decision Flowchart
              </span>
              <span class="text-[11px] font-mono text-slate-400">Top-Down Execution Flow</span>
            </div>

            <div class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
              <svg viewBox="0 0 680 620" class="w-full max-w-[620px] h-auto min-w-[320px] select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="td-arr" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 1 1 L 5 8 L 9 1 z" fill="#94A3B8" class="dark:fill-slate-500" />
                  </marker>
                  <marker id="td-arr-green" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 1 1 L 5 8 L 9 1 z" fill="#10B981" />
                  </marker>
                  <marker id="td-arr-red" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 1 1 L 5 8 L 9 1 z" fill="#F43F5E" />
                  </marker>
                </defs>

                <!-- START: Incoming Request -->
                <rect x="250" y="15" width="180" height="40" rx="20" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" class="dark:fill-slate-900 dark:stroke-slate-700"/>
                <text x="340" y="39" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#0F172A" class="dark:fill-white" text-anchor="middle">Incoming Request</text>
                <line x1="340" y1="55" x2="340" y2="78" stroke="#94A3B8" stroke-width="1.8" marker-end="url(#td-arr)" class="dark:stroke-slate-600"/>

                <!-- KEY: Build Rate-Limit Key -->
                <rect x="225" y="80" width="230" height="50" rx="8" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5" class="dark:fill-sky-950/40 dark:stroke-sky-700"/>
                <text x="340" y="99" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#0369A1" class="dark:fill-sky-300" text-anchor="middle">Build Rate-Limit Key</text>
                <text x="340" y="116" font-family="JetBrains Mono, monospace" font-size="10" fill="#0284C7" class="dark:fill-sky-400" text-anchor="middle">user:123:products</text>
                <line x1="340" y1="130" x2="340" y2="153" stroke="#94A3B8" stroke-width="1.8" marker-end="url(#td-arr)" class="dark:stroke-slate-600"/>

                <!-- LOAD: Read Bucket State -->
                <rect x="225" y="155" width="230" height="50" rx="8" fill="#EDE9FE" stroke="#A78BFA" stroke-width="1.5" class="dark:fill-indigo-950/40 dark:stroke-indigo-700"/>
                <text x="340" y="174" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#6D28D9" class="dark:fill-indigo-300" text-anchor="middle">Read Bucket State</text>
                <text x="340" y="191" font-family="JetBrains Mono, monospace" font-size="10" fill="#7C3AED" class="dark:fill-indigo-400" text-anchor="middle">tokens, lastRefillTime</text>
                <line x1="340" y1="205" x2="340" y2="228" stroke="#94A3B8" stroke-width="1.8" marker-end="url(#td-arr)" class="dark:stroke-slate-600"/>

                <!-- CALC: Calculate Elapsed Time -->
                <rect x="225" y="230" width="230" height="44" rx="8" fill="#EEF2FF" stroke="#818CF8" stroke-width="1.5" class="dark:fill-indigo-950/40 dark:stroke-indigo-600"/>
                <text x="340" y="256" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#4338CA" class="dark:fill-indigo-300" text-anchor="middle">Calculate Elapsed Time</text>
                <line x1="340" y1="274" x2="340" y2="297" stroke="#94A3B8" stroke-width="1.8" marker-end="url(#td-arr)" class="dark:stroke-slate-600"/>

                <!-- REFILL: Add Refilled Tokens up to Capacity -->
                <rect x="225" y="299" width="230" height="50" rx="8" fill="#E0E7FF" stroke="#6366F1" stroke-width="1.5" class="dark:fill-indigo-950/50 dark:stroke-indigo-500"/>
                <text x="340" y="318" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#4338CA" class="dark:fill-indigo-200" text-anchor="middle">Add Refilled Tokens</text>
                <text x="340" y="335" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#4F46E5" class="dark:fill-indigo-400" text-anchor="middle">up to Capacity</text>
                <line x1="340" y1="349" x2="340" y2="372" stroke="#94A3B8" stroke-width="1.8" marker-end="url(#td-arr)" class="dark:stroke-slate-600"/>

                <!-- CHECK: Enough tokens? (Diamond Decision) -->
                <polygon points="340,374 420,406 340,438 260,406" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" class="dark:fill-amber-950/40 dark:stroke-amber-600"/>
                <text x="340" y="410" font-family="Geist, sans-serif" font-size="11" font-weight="800" fill="#B45309" class="dark:fill-amber-300" text-anchor="middle">Enough tokens?</text>

                <!-- BRANCH 1: Yes -> ALLOW -> OK -->
                <path d="M 260 406 L 170 406 L 170 478" fill="none" stroke="#10B981" stroke-width="1.8" marker-end="url(#td-arr-green)"/>
                <rect x="195" y="394" width="34" height="18" rx="4" fill="#DCFCE7" stroke="#10B981" stroke-width="1" class="dark:fill-emerald-950 dark:stroke-emerald-700"/>
                <text x="212" y="407" font-family="Geist, sans-serif" font-size="10" font-weight="800" fill="#047857" class="dark:fill-emerald-400" text-anchor="middle">Yes</text>

                <rect x="55" y="480" width="230" height="50" rx="8" fill="#ECFDF5" stroke="#10B981" stroke-width="1.5" class="dark:fill-emerald-950/50 dark:stroke-emerald-700"/>
                <text x="170" y="499" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#065F46" class="dark:fill-emerald-200" text-anchor="middle">Subtract Request Cost</text>
                <text x="170" y="516" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#047857" class="dark:fill-emerald-400" text-anchor="middle">Persist State Atomically</text>
                <line x1="170" y1="530" x2="170" y2="553" stroke="#10B981" stroke-width="1.8" marker-end="url(#td-arr-green)"/>

                <rect x="85" y="555" width="170" height="40" rx="20" fill="#DCFCE7" stroke="#10B981" stroke-width="1.8" class="dark:fill-emerald-950/70 dark:stroke-emerald-500"/>
                <text x="170" y="579" font-family="Geist, sans-serif" font-size="11.5" font-weight="800" fill="#065F46" class="dark:fill-emerald-300" text-anchor="middle">Allow Request</text>

                <!-- BRANCH 2: No -> DENY -> NO -->
                <path d="M 420 406 L 510 406 L 510 478" fill="none" stroke="#F43F5E" stroke-width="1.8" marker-end="url(#td-arr-red)"/>
                <rect x="450" y="394" width="32" height="18" rx="4" fill="#FFE4E6" stroke="#F43F5E" stroke-width="1" class="dark:fill-rose-950 dark:stroke-rose-700"/>
                <text x="466" y="407" font-family="Geist, sans-serif" font-size="10" font-weight="800" fill="#BE123C" class="dark:fill-rose-400" text-anchor="middle">No</text>

                <rect x="395" y="480" width="230" height="50" rx="8" fill="#FFF1F2" stroke="#F43F5E" stroke-width="1.5" class="dark:fill-rose-950/50 dark:stroke-rose-700"/>
                <text x="510" y="509" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#9F1239" class="dark:fill-rose-200" text-anchor="middle">Calculate Retry-After</text>
                <line x1="510" y1="530" x2="510" y2="553" stroke="#F43F5E" stroke-width="1.8" marker-end="url(#td-arr-red)"/>

                <rect x="425" y="555" width="170" height="40" rx="20" fill="#FFE4E6" stroke="#F43F5E" stroke-width="1.8" class="dark:fill-rose-950/70 dark:stroke-rose-500"/>
                <text x="510" y="579" font-family="Geist, sans-serif" font-size="11.5" font-weight="800" fill="#9F1239" class="dark:fill-rose-300" text-anchor="middle">Reject: HTTP 429</text>
              </svg>
            </div>
          </div>

          <!-- THE TOKEN REFILL FORMULA -->
          <div class="flex flex-col gap-3">
            <h4 class="font-bold text-[15px] text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">functions</span>
              The Token Refill Formula
            </h4>
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-[13px] flex flex-col gap-3 font-mono">
              <div class="text-[12px] font-sans text-slate-600 dark:text-slate-400">
                Let: <strong>C</strong> = max capacity &bull; <strong>r</strong> = refill rate (tokens/sec) &bull; <strong>T</strong> = elapsed time (sec) &bull; <strong>t_old</strong> = previously stored tokens &bull; <strong>q</strong> = request cost
              </div>

              <!-- Mathematical Blocks -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div class="p-3 rounded-lg bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <span class="text-[11px] font-sans text-cyan-600 dark:text-cyan-400 font-bold uppercase">1. Available Tokens Before Request</span>
                  <div class="text-[14px] font-bold text-slate-900 dark:text-white">t_available = min(C, t_old + r &times; T)</div>
                </div>

                <div class="p-3 rounded-lg bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <span class="text-[11px] font-sans text-emerald-600 dark:text-emerald-400 font-bold uppercase">2. Admission Condition</span>
                  <div class="text-[14px] font-bold text-slate-900 dark:text-white">allow &iff; t_available &ge; q</div>
                </div>

                <div class="p-3 rounded-lg bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <span class="text-[11px] font-sans text-indigo-600 dark:text-indigo-400 font-bold uppercase">3. New State if Allowed</span>
                  <div class="text-[14px] font-bold text-slate-900 dark:text-white">t_new = t_available - q</div>
                </div>

                <div class="p-3 rounded-lg bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  <span class="text-[11px] font-sans text-rose-600 dark:text-rose-400 font-bold uppercase">4. Denied Retry-After Time</span>
                  <div class="text-[14px] font-bold text-rose-600 dark:text-rose-400">RetryAfter = &lceil;(q - t_available) / r&rceil;</div>
                </div>
              </div>
            </div>
          </div>

          <!-- EXAMPLE WALKTHROUGH -->
          <div class="flex flex-col gap-3">
            <h4 class="font-bold text-[15px] text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-400">timeline</span>
              Example Walkthrough: Burst &amp; Replenishment
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14]">
                <div class="text-[11px] font-mono uppercase text-slate-400 font-bold">Bucket Capacity</div>
                <div class="text-[22px] font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1">5</div>
                <div class="text-[11.5px] text-slate-500">Tokens Max (C)</div>
              </div>
              <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14]">
                <div class="text-[11px] font-mono uppercase text-slate-400 font-bold">Refill Rate</div>
                <div class="text-[22px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">1/s</div>
                <div class="text-[11.5px] text-slate-500">1 Token per second (r)</div>
              </div>
              <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14]">
                <div class="text-[11px] font-mono uppercase text-slate-400 font-bold">Initial State</div>
                <div class="text-[22px] font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1">5</div>
                <div class="text-[11.5px] text-slate-500">Starts completely full</div>
              </div>
            </div>

            <!-- Walkthrough Table -->
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120]">
              <table class="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px]">
                    <th class="py-2.5 px-3">Time Elapsed</th>
                    <th class="py-2.5 px-3">Burst Consumption</th>
                    <th class="py-2.5 px-3">Tokens Available</th>
                    <th class="py-2.5 px-4">Behavior &amp; Result</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[12px]">
                  <tr>
                    <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white">0 seconds</td>
                    <td class="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-bold">5 tokens consumed</td>
                    <td class="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">0 tokens left</td>
                    <td class="py-2.5 px-4 font-sans text-slate-600 dark:text-slate-300">Initial burst permitted; bucket immediately drained. Next requests rejected with HTTP 429.</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white">5 seconds</td>
                    <td class="py-2.5 px-3 text-slate-400">0 consumed</td>
                    <td class="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">5 tokens refilled</td>
                    <td class="py-2.5 px-4 font-sans text-slate-600 dark:text-slate-300">Time elapsed = 5s &times; 1/s = 5 tokens added. Bucket is back at full capacity (5).</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white">10 seconds</td>
                    <td class="py-2.5 px-3 text-slate-400">0 consumed</td>
                    <td class="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">5 tokens (capped)</td>
                    <td class="py-2.5 px-4 font-sans text-slate-600 dark:text-slate-300">Tokens stop accumulating at maximum capacity <code class="text-[11px] bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded">min(C, ...)</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[12.5px] text-amber-950 dark:text-amber-200">
              <strong>Key Architectural Takeaway:</strong> Notice that the token bucket allows a burst of up to 5 requests immediately. After that burst, it replenishes at 1 token per second. It does not guarantee that every rolling 60-second interval contains at most 60 requests if the bucket capacity permits a larger burst.
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 8: DISTRIBUTED REQUEST SEQUENCE DIAGRAM
    // =========================================================================
    {
      badge: "SEQUENCE",
      badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
      title: "Distributed request sequence diagram",
      content: `
        <div class="flex flex-col gap-5 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            The sequence diagram shows the exact interaction between a client, gateway, rate limiter, Redis and the backend.
          </p>

          <!-- SEQUENCE DIAGRAM (SVG) -->
          <div class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14] p-4 sm:p-5 shadow-xs">
            <svg viewBox="0 0 860 440" class="w-full h-auto min-w-[760px] select-none" xmlns="http://www.w3.org/2000/svg">
              <!-- Entity Headers -->
              <g transform="translate(40, 15)">
                <rect width="100" height="34" rx="8" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" class="dark:fill-slate-900 dark:stroke-slate-700"/>
                <text x="50" y="22" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#0F172A" class="dark:fill-white" text-anchor="middle">Client (C)</text>
                <line x1="50" y1="34" x2="50" y2="425" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" class="dark:stroke-slate-800"/>
              </g>

              <g transform="translate(210, 15)">
                <rect width="110" height="34" rx="8" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5" class="dark:fill-sky-950/50 dark:stroke-sky-700"/>
                <text x="55" y="22" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#0284C7" class="dark:fill-sky-300" text-anchor="middle">API Gateway (G)</text>
                <line x1="55" y1="34" x2="55" y2="425" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" class="dark:stroke-slate-800"/>
              </g>

              <g transform="translate(390, 15)">
                <rect width="110" height="34" rx="8" fill="#EDE9FE" stroke="#818CF8" stroke-width="1.5" class="dark:fill-indigo-950/50 dark:stroke-indigo-700"/>
                <text x="55" y="22" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#6366F1" class="dark:fill-indigo-300" text-anchor="middle">Rate Limiter (R)</text>
                <line x1="55" y1="34" x2="55" y2="425" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" class="dark:stroke-slate-800"/>
              </g>

              <g transform="translate(570, 15)">
                <rect width="100" height="34" rx="8" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" class="dark:fill-amber-950/50 dark:stroke-amber-700"/>
                <text x="50" y="22" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#D97706" class="dark:fill-amber-300" text-anchor="middle">Redis (D)</text>
                <line x1="50" y1="34" x2="50" y2="425" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" class="dark:stroke-slate-800"/>
              </g>

              <g transform="translate(730, 15)">
                <rect width="100" height="34" rx="8" fill="#DCFCE7" stroke="#10B981" stroke-width="1.5" class="dark:fill-emerald-950/50 dark:stroke-emerald-700"/>
                <text x="50" y="22" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#059669" class="dark:fill-emerald-300" text-anchor="middle">Backend (B)</text>
                <line x1="50" y1="34" x2="50" y2="425" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" class="dark:stroke-slate-800"/>
              </g>

              <!-- Step 1: Client -> API Gateway -->
              <line x1="90" y1="72" x2="260" y2="72" stroke="#0284C7" stroke-width="1.8"/>
              <polygon points="260,69 265,72 260,75" fill="#0284C7"/>
              <text x="175" y="65" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#0284C7" class="dark:fill-sky-300" text-anchor="middle">1. GET /api/products + credentials</text>

              <!-- Step 2: Gateway Self-Call (Authenticate caller) -->
              <path d="M 265 92 L 305 92 L 305 110 L 265 110" fill="none" stroke="#0284C7" stroke-width="1.6"/>
              <polygon points="270,107 265,110 270,113" fill="#0284C7"/>
              <text x="312" y="105" font-family="Geist, sans-serif" font-size="10.5" font-weight="600" fill="#0284C7" class="dark:fill-sky-300">2. Authenticate caller</text>

              <!-- Step 3: Gateway -> Rate Limiter -->
              <line x1="265" y1="134" x2="440" y2="134" stroke="#6366F1" stroke-width="1.8"/>
              <polygon points="440,131 445,134 440,137" fill="#6366F1"/>
              <text x="355" y="127" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#6366F1" class="dark:fill-indigo-300" text-anchor="middle">3. Check policy and identity</text>

              <!-- Step 4: Rate Limiter -> Redis -->
              <line x1="445" y1="158" x2="615" y2="158" stroke="#D97706" stroke-width="1.8"/>
              <polygon points="615,155 620,158 615,161" fill="#D97706"/>
              <text x="532" y="151" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#D97706" class="dark:fill-amber-300" text-anchor="middle">4. Atomic token-bucket operation</text>

              <!-- PATH 1: ALLOWED (Green Box Container) -->
              <rect x="25" y="176" width="810" height="120" rx="10" fill="#ECFDF5" fill-opacity="0.3" stroke="#10B981" stroke-width="1.2" stroke-dasharray="3 3" class="dark:fill-emerald-950/20 dark:stroke-emerald-700"/>
              <text x="35" y="191" font-family="Geist, sans-serif" font-size="10" font-weight="800" fill="#047857" class="dark:fill-emerald-400">PATH 1: ALLOWED</text>

              <!-- 5. Redis -> Rate Limiter -->
              <line x1="620" y1="202" x2="450" y2="202" stroke="#10B981" stroke-width="1.8" stroke-dasharray="3 2"/>
              <polygon points="452,199 447,202 452,205" fill="#10B981"/>
              <text x="532" y="196" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#047857" class="dark:fill-emerald-400" text-anchor="middle">5. Allowed + remaining tokens</text>

              <!-- 6. Rate Limiter -> Gateway -->
              <line x1="445" y1="224" x2="270" y2="224" stroke="#10B981" stroke-width="1.8" stroke-dasharray="3 2"/>
              <polygon points="272,221 267,224 272,227" fill="#10B981"/>
              <text x="355" y="218" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#047857" class="dark:fill-emerald-400" text-anchor="middle">6. Allow</text>

              <!-- 7. Gateway -> Backend -->
              <line x1="265" y1="246" x2="775" y2="246" stroke="#10B981" stroke-width="1.8"/>
              <polygon points="775,243 780,246 775,249" fill="#10B981"/>
              <text x="520" y="240" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#047857" class="dark:fill-emerald-400" text-anchor="middle">7. Forward request</text>

              <!-- 8. Backend -> Gateway -->
              <line x1="780" y1="268" x2="270" y2="268" stroke="#10B981" stroke-width="1.8" stroke-dasharray="3 2"/>
              <polygon points="272,265 267,268 272,271" fill="#10B981"/>
              <text x="520" y="262" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#047857" class="dark:fill-emerald-400" text-anchor="middle">8. 200 OK + response</text>

              <!-- 9. Gateway -> Client -->
              <line x1="265" y1="288" x2="95" y2="288" stroke="#10B981" stroke-width="1.8" stroke-dasharray="3 2"/>
              <polygon points="97,285 92,288 97,291" fill="#10B981"/>
              <text x="175" y="282" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#047857" class="dark:fill-emerald-400" text-anchor="middle">9. 200 OK + rate-limit headers</text>

              <!-- Note over C,D: If insufficient tokens -->
              <rect x="75" y="310" width="560" height="26" rx="6" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.2" class="dark:fill-amber-950/60 dark:stroke-amber-600"/>
              <text x="355" y="327" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#B45309" class="dark:fill-amber-300" text-anchor="middle">Note over C, D: If insufficient tokens</text>

              <!-- PATH 2: REJECTED (Red Box Container) -->
              <rect x="25" y="348" width="810" height="74" rx="10" fill="#FFF1F2" fill-opacity="0.3" stroke="#F43F5E" stroke-width="1.2" stroke-dasharray="3 3" class="dark:fill-rose-950/20 dark:stroke-rose-700"/>
              <text x="35" y="362" font-family="Geist, sans-serif" font-size="10" font-weight="800" fill="#BE123C" class="dark:fill-rose-400">PATH 2: REJECTED</text>

              <!-- 10. Rate Limiter -> Gateway -->
              <line x1="445" y1="376" x2="270" y2="376" stroke="#F43F5E" stroke-width="1.8" stroke-dasharray="3 2"/>
              <polygon points="272,373 267,376 272,379" fill="#F43F5E"/>
              <text x="355" y="370" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#BE123C" class="dark:fill-rose-400" text-anchor="middle">10. Deny + retry delay</text>

              <!-- 11. Gateway -> Client -->
              <line x1="265" y1="400" x2="95" y2="400" stroke="#F43F5E" stroke-width="1.8" stroke-dasharray="3 2"/>
              <polygon points="97,397 92,400 97,403" fill="#F43F5E"/>
              <text x="175" y="394" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#BE123C" class="dark:fill-rose-400" text-anchor="middle">11. 429 Too Many Requests</text>
            </svg>
          </div>

          <!-- Notes & Example HTTP Headers -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <strong class="text-slate-900 dark:text-white text-[13px] font-bold">Two Alternative Outcomes:</strong>
              <ul class="list-disc pl-5 space-y-1 text-[12.5px]">
                <li><strong>Allowed:</strong> The gateway forwards the request and returns the backend response.</li>
                <li><strong>Rejected:</strong> The gateway returns 429 without calling the backend.</li>
              </ul>
              <p class="text-[12px] text-slate-500 pt-1">
                The diagram's two outcomes are alternatives. In an implementation, the limiter returns one decision per request; it does not return both responses.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#0B0F17] text-slate-200 border border-[#24314A] font-mono text-[12px] flex flex-col gap-2">
              <span class="text-rose-400 font-bold">// Standard HTTP 429 Response Headers</span>
              <pre class="text-slate-300 overflow-x-auto"><code>HTTP/1.1 429 Too Many Requests
Retry-After: 3
RateLimit-Limit: 100
RateLimit-Remaining: 0</code></pre>
              <span class="text-[11px] text-slate-400 font-sans">
                Header conventions can vary by API standard. <strong>Retry-After</strong> is particularly useful because it tells the client exactly when to retry.
              </span>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 9: HOW MULTIPLE APPLICATION SERVERS SHARE ONE LIMIT
    // =========================================================================
    {
      badge: "DISTRIBUTED",
      badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-300",
      title: "How multiple application servers share one limit",
      content: `
        <div class="flex flex-col gap-5 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            This is the most important distributed-systems concept in the problem. Suppose a user has a limit of 5 requests and the load balancer routes traffic across three servers.
          </p>

          <!-- MULTI-SERVER TOPOLOGY DIAGRAM (SVG - FLOWCHART TB) -->
          <div class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 680 470" class="w-full max-w-[620px] h-auto min-w-[320px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="tb-srv-arr" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 1 1 L 5 8 L 9 1 z" fill="#64748B" />
                </marker>
                <marker id="tb-app-arr" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 1 1 L 5 8 L 9 1 z" fill="#3973AC" />
                </marker>
                <marker id="tb-store-arr" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 1 1 L 5 8 L 9 1 z" fill="#B78020" />
                </marker>
              </defs>

              <!-- Node C: User: 123 / 5-token bucket -->
              <rect x="245" y="14" width="190" height="48" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" class="dark:fill-slate-900 dark:stroke-slate-700"/>
              <text x="340" y="32" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#0F172A" class="dark:fill-white" text-anchor="middle">User: 123</text>
              <text x="340" y="49" font-family="Geist, sans-serif" font-size="10.5" font-weight="500" fill="#64748B" class="dark:fill-slate-400" text-anchor="middle">5-token bucket</text>

              <!-- Line C -> LB -->
              <line x1="340" y1="62" x2="340" y2="84" stroke="#64748B" stroke-width="1.8" marker-end="url(#tb-srv-arr)" class="dark:stroke-slate-600"/>

              <!-- Node LB: Load Balancer -->
              <rect x="245" y="86" width="190" height="40" rx="8" fill="#F1F5F9" stroke="#64748B" stroke-width="1.5" class="dark:fill-slate-800 dark:stroke-slate-600"/>
              <text x="340" y="110" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#1E293B" class="dark:fill-slate-100" text-anchor="middle">Load Balancer</text>

              <!-- Lines LB -> App Servers A, B, C -->
              <path d="M 340 126 L 340 142 L 110 142 L 110 158" fill="none" stroke="#3973AC" stroke-width="1.8" marker-end="url(#tb-app-arr)" class="dark:stroke-sky-500"/>
              <line x1="340" y1="126" x2="340" y2="158" stroke="#3973AC" stroke-width="1.8" marker-end="url(#tb-app-arr)" class="dark:stroke-sky-500"/>
              <path d="M 340 126 L 340 142 L 570 142 L 570 158" fill="none" stroke="#3973AC" stroke-width="1.8" marker-end="url(#tb-app-arr)" class="dark:stroke-sky-500"/>

              <!-- Node A: App Server A -->
              <rect x="35" y="160" width="150" height="44" rx="8" fill="#E8F2FF" stroke="#3973AC" stroke-width="1.6" class="dark:fill-sky-950/40 dark:stroke-sky-600"/>
              <text x="110" y="186" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#152D4A" class="dark:fill-sky-200" text-anchor="middle">App Server A</text>

              <!-- Node B: App Server B -->
              <rect x="265" y="160" width="150" height="44" rx="8" fill="#E8F2FF" stroke="#3973AC" stroke-width="1.6" class="dark:fill-sky-950/40 dark:stroke-sky-600"/>
              <text x="340" y="186" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#152D4A" class="dark:fill-sky-200" text-anchor="middle">App Server B</text>

              <!-- Node S: App Server C -->
              <rect x="495" y="160" width="150" height="44" rx="8" fill="#E8F2FF" stroke="#3973AC" stroke-width="1.6" class="dark:fill-sky-950/40 dark:stroke-sky-600"/>
              <text x="570" y="186" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#152D4A" class="dark:fill-sky-200" text-anchor="middle">App Server C</text>

              <!-- Lines App Servers -> Shared Redis State -->
              <path d="M 110 204 C 110 230, 290 225, 305 244" fill="none" stroke="#B78020" stroke-width="1.8" marker-end="url(#tb-store-arr)" class="dark:stroke-amber-500"/>
              <line x1="340" y1="204" x2="340" y2="244" stroke="#B78020" stroke-width="1.8" marker-end="url(#tb-store-arr)" class="dark:stroke-amber-500"/>
              <path d="M 570 204 C 570 230, 390 225, 375 244" fill="none" stroke="#B78020" stroke-width="1.8" marker-end="url(#tb-store-arr)" class="dark:stroke-amber-500"/>

              <!-- Node R: Shared Redis State / user:123 (Cylinder) -->
              <path d="M 230 256 v 34 a 110 10 0 0 0 220 0 v -34" fill="#FFF1D6" stroke="#B78020" stroke-width="1.6" class="dark:fill-amber-950/40 dark:stroke-amber-600"/>
              <ellipse cx="340" cy="256" rx="110" ry="10" fill="#FFE8B8" stroke="#B78020" stroke-width="1.6" class="dark:fill-amber-900/60 dark:stroke-amber-600"/>
              <text x="340" y="274" font-family="Geist, sans-serif" font-size="11.5" font-weight="800" fill="#583B0B" class="dark:fill-amber-200" text-anchor="middle">Shared Redis State</text>
              <text x="340" y="291" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" fill="#B78020" class="dark:fill-amber-400" text-anchor="middle">user:123</text>

              <!-- Line R -> D -->
              <line x1="340" y1="300" x2="340" y2="328" stroke="#B78020" stroke-width="1.8" marker-end="url(#tb-store-arr)" class="dark:stroke-amber-500"/>

              <!-- Node D: Atomic check + update -->
              <rect x="230" y="330" width="220" height="42" rx="8" fill="#FFF1D6" stroke="#B78020" stroke-width="1.6" class="dark:fill-amber-950/40 dark:stroke-amber-600"/>
              <text x="340" y="356" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#583B0B" class="dark:fill-amber-200" text-anchor="middle">Atomic check + update</text>

              <!-- Line D -> O -->
              <line x1="340" y1="372" x2="340" y2="400" stroke="#B78020" stroke-width="1.8" marker-end="url(#tb-store-arr)" class="dark:stroke-amber-500"/>

              <!-- Node O: One shared decision / across all servers -->
              <rect x="220" y="402" width="240" height="50" rx="8" fill="#FFF1D6" stroke="#B78020" stroke-width="1.6" class="dark:fill-amber-950/40 dark:stroke-amber-600"/>
              <text x="340" y="422" font-family="Geist, sans-serif" font-size="11.5" font-weight="800" fill="#583B0B" class="dark:fill-amber-200" text-anchor="middle">One shared decision</text>
              <text x="340" y="439" font-family="Geist, sans-serif" font-size="10.5" font-weight="600" fill="#B78020" class="dark:fill-amber-400" text-anchor="middle">across all servers</text>
            </svg>
          </div>

          <!-- Why Atomicity Matters Deep Dive -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-2">
              <strong class="text-rose-700 dark:text-rose-400 text-[13px] font-bold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[17px]">warning</span>
                The Multi-Server Race Condition
              </strong>
              <p class="text-[12.5px] leading-relaxed">
                Imagine the bucket contains just <strong>1 token</strong> and two requests arrive simultaneously:
              </p>
              <ol class="list-decimal pl-5 space-y-1 text-[12px] font-mono text-rose-800 dark:text-rose-300">
                <li>Server A reads 1 token.</li>
                <li>Server B reads 1 token.</li>
                <li>Both conclude the request is allowed.</li>
                <li>Both subtract 1, permitting two requests with only one token.</li>
              </ol>
              <span class="text-[11.5px] text-rose-700 dark:text-rose-400 font-semibold pt-1">
                Without shared atomic coordination, a user could make 5 requests to each server &mdash; 15 in total!
              </span>
            </div>

            <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2">
              <strong class="text-emerald-700 dark:text-emerald-400 text-[13px] font-bold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[17px]">verified</span>
                The Lua Script Solution
              </strong>
              <p class="text-[12.5px] leading-relaxed">
                Perform <strong>refill, check, decrement, and state update</strong> in one atomic Redis operation (typically via a Lua script).
              </p>
              <ul class="list-disc pl-5 space-y-1 text-[12px] text-emerald-800 dark:text-emerald-300">
                <li>Redis executes Lua scripts in a single thread without interruption.</li>
                <li>All competing application servers see a strictly serialized decision for that key.</li>
                <li>Guarantees zero double-spending of tokens across all servers.</li>
              </ul>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 10: REDIS DATA MODEL & STORAGE LAYOUT
    // =========================================================================
    {
      badge: "DATA MODEL",
      badgeColor: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
      title: "Redis data model",
      content: `
        <div class="flex flex-col gap-5 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            A simple representation of one token bucket stored in Redis is:
          </p>

          <!-- JSON Schema Blocks -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[12px]">
            <div class="p-4 rounded-xl bg-[#0B0F17] text-slate-200 border border-[#24314A] flex flex-col gap-2">
              <span class="text-cyan-400 font-bold">// Token Bucket State in Redis Hash</span>
              <pre class="text-emerald-400 overflow-x-auto"><code>{
  "key": "rl:{user:123}:products",
  "tokens": 3.0,
  "last_refill_ms": 1792800000000
}</code></pre>
              <span class="text-[11px] text-slate-400 font-sans">
                The timestamp above is illustrative. Stored as a Redis hash or compact binary string.
              </span>
            </div>

            <div class="p-4 rounded-xl bg-[#0B0F17] text-slate-200 border border-[#24314A] flex flex-col gap-2">
              <span class="text-purple-400 font-bold">// Policy Configuration Entity</span>
              <pre class="text-indigo-300 overflow-x-auto"><code>{
  "policy_id": "products-read",
  "capacity": 100,
  "refill_rate_per_second": 10,
  "request_cost": 1,
  "key_dimension": "user_id"
}</code></pre>
              <span class="text-[11px] text-slate-400 font-sans">
                Separate limits exist for different routes (e.g. product reads vs payment writes).
              </span>
            </div>
          </div>

          <!-- Field Description Table -->
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120]">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px]">
                  <th class="py-2.5 px-3.5 w-1/4">Field</th>
                  <th class="py-2.5 px-3.5 w-3/4">Purpose</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[12px]">
                <tr>
                  <td class="py-2.5 px-3.5 font-bold text-cyan-600 dark:text-cyan-400">key</td>
                  <td class="py-2.5 px-3.5 font-sans text-slate-600 dark:text-slate-300">Identifies the caller and applicable policy (e.g., <code class="text-[11px] bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded">rl:{user:123}:products</code>).</td>
                </tr>
                <tr>
                  <td class="py-2.5 px-3.5 font-bold text-cyan-600 dark:text-cyan-400">tokens</td>
                  <td class="py-2.5 px-3.5 font-sans text-slate-600 dark:text-slate-300">Current token balance, stored as a float to allow smooth fractional replenishment.</td>
                </tr>
                <tr>
                  <td class="py-2.5 px-3.5 font-bold text-cyan-600 dark:text-cyan-400">last_refill_ms</td>
                  <td class="py-2.5 px-3.5 font-sans text-slate-600 dark:text-slate-300">Timestamp of the last refill event in milliseconds (using Redis server time).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Key Design Considerations -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <strong class="text-slate-900 dark:text-white text-[13px] font-bold">Key Design Considerations</strong>
            <ul class="list-disc pl-5 space-y-1.5 text-[12.5px]">
              <li><strong>TTL Eviction:</strong> Use TTLs to clean up inactive buckets, sized consistent with the time needed for a bucket to refill to maximum capacity.</li>
              <li><strong>Cardinality Protection:</strong> Avoid creating unbounded state from arbitrary, attacker-controlled keys (e.g., raw IP spoofing).</li>
              <li><strong>Multi-Limit Evaluation:</strong> If multiple keys must be checked together (e.g. user quota + tenant quota), execute both checks within the same atomic script.</li>
              <li><strong>Redis Cluster Hash Slots:</strong> For Redis Cluster, keys that participate in one atomic script must share a hash tag (e.g. <code class="text-[11px] bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">{user:123}</code>) to guarantee co-location on the same shard.</li>
            </ul>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 11: LLD CLASS DIAGRAM & OBJECT-ORIENTED ARCHITECTURE
    // =========================================================================
    {
      badge: "OOP & LLD",
      badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
      title: "LLD class diagram",
      content: `
        <div class="flex flex-col gap-5 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            The low-level design separates policy selection, algorithm behavior, shared-state access and HTTP integration into decoupled components.
          </p>

          <!-- CLASS DIAGRAM (SVG - FULL UML ARCHITECTURE) -->
          <div class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14] p-4 sm:p-5 shadow-xs">
            <svg viewBox="0 0 910 435" class="w-full h-auto min-w-[800px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="uml-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748B" />
                </marker>
                <marker id="uml-dep" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981" />
                </marker>
                <marker id="uml-realize-sky" viewBox="0 0 12 12" refX="6" refY="2" markerWidth="9" markerHeight="9" orient="auto">
                  <polygon points="1,11 6,2 11,11" fill="#FFFFFF" stroke="#38BDF8" stroke-width="1.5" class="dark:fill-[#070B14]"/>
                </marker>
                <marker id="uml-realize-amber" viewBox="0 0 12 12" refX="6" refY="2" markerWidth="9" markerHeight="9" orient="auto">
                  <polygon points="1,11 6,2 11,11" fill="#FFFFFF" stroke="#F59E0B" stroke-width="1.5" class="dark:fill-[#070B14]"/>
                </marker>
              </defs>

              <!-- ================= COLUMN 1 ================= -->
              <!-- Class 1: RateLimitMiddleware -->
              <g transform="translate(25, 20)">
                <rect width="230" height="66" rx="6" fill="#EDE9FE" stroke="#818CF8" stroke-width="1.5" class="dark:fill-indigo-950/50 dark:stroke-indigo-700"/>
                <text x="115" y="24" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#4F46E5" class="dark:fill-indigo-300" text-anchor="middle">RateLimitMiddleware</text>
                <line x1="0" y1="34" x2="230" y2="34" stroke="#818CF8" stroke-width="1" class="dark:stroke-indigo-700"/>
                <text x="12" y="52" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#312E81" class="dark:fill-indigo-200">+handle(request, next)</text>
              </g>

              <!-- Class 2: IdentityResolver -->
              <g transform="translate(25, 115)">
                <rect width="230" height="62" rx="6" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" class="dark:fill-slate-900 dark:stroke-slate-700"/>
                <text x="115" y="23" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#334155" class="dark:fill-slate-200" text-anchor="middle">IdentityResolver</text>
                <line x1="0" y1="33" x2="230" y2="33" stroke="#94A3B8" stroke-width="1" class="dark:stroke-slate-700"/>
                <text x="12" y="49" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#1E293B" class="dark:fill-slate-300">+resolveIdentity(request)</text>
              </g>

              <!-- Class 3: PolicyProvider -->
              <g transform="translate(25, 205)">
                <rect width="230" height="62" rx="6" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" class="dark:fill-slate-900 dark:stroke-slate-700"/>
                <text x="115" y="23" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#334155" class="dark:fill-slate-200" text-anchor="middle">PolicyProvider</text>
                <line x1="0" y1="33" x2="230" y2="33" stroke="#94A3B8" stroke-width="1" class="dark:stroke-slate-700"/>
                <text x="12" y="49" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#1E293B" class="dark:fill-slate-300">+getPolicy(identity, route)</text>
              </g>

              <!-- Class 4: RateLimitPolicy -->
              <g transform="translate(25, 295)">
                <rect width="230" height="96" rx="6" fill="#DCFCE7" stroke="#10B981" stroke-width="1.5" class="dark:fill-emerald-950/40 dark:stroke-emerald-700"/>
                <text x="115" y="22" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#047857" class="dark:fill-emerald-300" text-anchor="middle">RateLimitPolicy</text>
                <line x1="0" y1="32" x2="230" y2="32" stroke="#10B981" stroke-width="1" class="dark:stroke-emerald-700"/>
                <text x="14" y="49" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#065F46" class="dark:fill-emerald-200">+capacity</text>
                <text x="14" y="66" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#065F46" class="dark:fill-emerald-200">+refillRate</text>
                <text x="14" y="83" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#065F46" class="dark:fill-emerald-200">+requestCost</text>
              </g>

              <!-- ================= COLUMN 2 ================= -->
              <!-- Interface: RateLimiter -->
              <g transform="translate(335, 20)">
                <rect width="240" height="76" rx="6" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5" class="dark:fill-sky-950/50 dark:stroke-sky-700"/>
                <text x="120" y="18" font-family="Geist, sans-serif" font-size="9.5" font-style="italic" fill="#0284C7" class="dark:fill-sky-400" text-anchor="middle">&laquo;interface&raquo;</text>
                <text x="120" y="33" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#0369A1" class="dark:fill-sky-300" text-anchor="middle">RateLimiter</text>
                <line x1="0" y1="42" x2="240" y2="42" stroke="#38BDF8" stroke-width="1" class="dark:stroke-sky-700"/>
                <text x="12" y="60" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#075985" class="dark:fill-sky-200">+allow(key, policy) Decision</text>
              </g>

              <!-- Impl: TokenBucketRateLimiter -->
              <g transform="translate(335, 135)">
                <rect width="240" height="86" rx="6" fill="#F8FAFC" stroke="#38BDF8" stroke-width="1.5" class="dark:fill-[#0A101D] dark:stroke-sky-600"/>
                <text x="120" y="24" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#0284C7" class="dark:fill-sky-300" text-anchor="middle">TokenBucketRateLimiter</text>
                <line x1="0" y1="34" x2="240" y2="34" stroke="#38BDF8" stroke-width="1" class="dark:stroke-sky-700"/>
                <text x="12" y="52" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#334155" class="dark:fill-slate-300">+allow(key, policy) Decision</text>
                <text x="12" y="70" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#64748B" class="dark:fill-slate-400">-calculateRefill(state, now)</text>
              </g>

              <!-- Class: RateLimitDecision -->
              <g transform="translate(335, 295)">
                <rect width="240" height="96" rx="6" fill="#DCFCE7" stroke="#10B981" stroke-width="1.5" class="dark:fill-emerald-950/40 dark:stroke-emerald-700"/>
                <text x="120" y="22" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#047857" class="dark:fill-emerald-300" text-anchor="middle">RateLimitDecision</text>
                <line x1="0" y1="32" x2="240" y2="32" stroke="#10B981" stroke-width="1" class="dark:stroke-emerald-700"/>
                <text x="14" y="49" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#065F46" class="dark:fill-emerald-200">+allowed</text>
                <text x="14" y="66" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#065F46" class="dark:fill-emerald-200">+remaining</text>
                <text x="14" y="83" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#065F46" class="dark:fill-emerald-200">+retryAfterSeconds</text>
              </g>

              <!-- ================= COLUMN 3 ================= -->
              <!-- Interface: RateLimitStateStore -->
              <g transform="translate(645, 20)">
                <rect width="240" height="76" rx="6" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" class="dark:fill-amber-950/50 dark:stroke-amber-700"/>
                <text x="120" y="18" font-family="Geist, sans-serif" font-size="9.5" font-style="italic" fill="#D97706" class="dark:fill-amber-400" text-anchor="middle">&laquo;interface&raquo;</text>
                <text x="120" y="33" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#B45309" class="dark:fill-amber-300" text-anchor="middle">RateLimitStateStore</text>
                <line x1="0" y1="42" x2="240" y2="42" stroke="#F59E0B" stroke-width="1" class="dark:stroke-amber-700"/>
                <text x="12" y="60" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#78350F" class="dark:fill-amber-200">+consume(key, policy) Decision</text>
              </g>

              <!-- Impl: RedisTokenBucketStore -->
              <g transform="translate(645, 135)">
                <rect width="240" height="86" rx="6" fill="#F8FAFC" stroke="#F59E0B" stroke-width="1.5" class="dark:fill-[#0A101D] dark:stroke-amber-600"/>
                <text x="120" y="24" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#D97706" class="dark:fill-amber-300" text-anchor="middle">RedisTokenBucketStore</text>
                <line x1="0" y1="34" x2="240" y2="34" stroke="#F59E0B" stroke-width="1" class="dark:stroke-amber-700"/>
                <text x="12" y="52" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#334155" class="dark:fill-slate-300">+consume(key, policy) Decision</text>
                <text x="12" y="70" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#64748B" class="dark:fill-slate-400">-executeAtomicScript()</text>
              </g>

              <!-- ================= RELATIONSHIPS ================= -->
              <!-- RateLimitMiddleware --> IdentityResolver -->
              <line x1="140" y1="86" x2="140" y2="113" stroke="#64748B" stroke-width="1.6" marker-end="url(#uml-arr)" class="dark:stroke-slate-500"/>

              <!-- RateLimitMiddleware --> PolicyProvider (Track x=275) -->
              <path d="M 230 86 L 230 100 L 275 100 L 275 236 L 257 236" fill="none" stroke="#64748B" stroke-width="1.6" marker-end="url(#uml-arr)" class="dark:stroke-slate-500"/>

              <!-- RateLimitMiddleware --> RateLimiter -->
              <line x1="255" y1="52" x2="333" y2="52" stroke="#64748B" stroke-width="1.6" marker-end="url(#uml-arr)" class="dark:stroke-slate-500"/>

              <!-- PolicyProvider --> RateLimitPolicy -->
              <line x1="140" y1="267" x2="140" y2="293" stroke="#64748B" stroke-width="1.6" marker-end="url(#uml-arr)" class="dark:stroke-slate-500"/>

              <!-- RateLimiter <|.. TokenBucketRateLimiter -->
              <line x1="455" y1="135" x2="455" y2="98" stroke="#38BDF8" stroke-width="1.8" stroke-dasharray="4 3" marker-end="url(#uml-realize-sky)"/>

              <!-- TokenBucketRateLimiter --> RateLimitStateStore -->
              <path d="M 575 160 L 610 160 L 610 52 L 643 52" fill="none" stroke="#64748B" stroke-width="1.6" marker-end="url(#uml-arr)" class="dark:stroke-slate-500"/>

              <!-- RateLimitStateStore <|.. RedisTokenBucketStore -->
              <line x1="765" y1="135" x2="765" y2="98" stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="4 3" marker-end="url(#uml-realize-amber)"/>

              <!-- RateLimitMiddleware ..> RateLimitDecision (Track x=295) -->
              <path d="M 255 68 L 295 68 L 295 345 L 333 345" fill="none" stroke="#10B981" stroke-width="1.6" stroke-dasharray="4 3" marker-end="url(#uml-dep)" class="dark:stroke-emerald-500"/>

              <!-- ================= LEGEND ================= -->
              <g transform="translate(25, 412)">
                <line x1="0" y1="8" x2="25" y2="8" stroke="#64748B" stroke-width="1.6" marker-end="url(#uml-arr)" class="dark:stroke-slate-500"/>
                <text x="32" y="12" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#64748B" class="dark:fill-slate-400">Association (--&gt;)</text>

                <line x1="190" y1="8" x2="215" y2="8" stroke="#38BDF8" stroke-width="1.6" stroke-dasharray="4 3" marker-end="url(#uml-realize-sky)"/>
                <text x="225" y="12" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#0284C7" class="dark:fill-sky-400">Realization (&lt;|..)</text>

                <line x1="380" y1="8" x2="405" y2="8" stroke="#10B981" stroke-width="1.6" stroke-dasharray="4 3" marker-end="url(#uml-dep)" class="dark:stroke-emerald-500"/>
                <text x="415" y="12" font-family="Geist, sans-serif" font-size="10" font-weight="600" fill="#047857" class="dark:fill-emerald-400">Dependency (..&gt;)</text>
              </g>
            </svg>
          </div>

          <!-- Responsibilities Breakdown -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[12px]">
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">RateLimitMiddleware</strong>
              Intercepts incoming requests and converts decisions into HTTP responses or 429 errors.
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">IdentityResolver</strong>
              Extracts a trustworthy identity from authenticated credentials or validated client IP.
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">PolicyProvider</strong>
              Chooses the appropriate policy and limits for the caller and target route.
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800">
              <strong class="text-cyan-600 dark:text-cyan-400 block mb-1">TokenBucketRateLimiter</strong>
              Implements the high-level rate-limiting interface and decision strategy.
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800">
              <strong class="text-amber-600 dark:text-amber-400 block mb-1">RedisTokenBucketStore</strong>
              Executes the atomic Lua script against Redis and persists bucket updates.
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800">
              <strong class="text-emerald-600 dark:text-emerald-400 block mb-1">RateLimitDecision</strong>
              Carries the allow/deny boolean, remaining quota count, and retry delay.
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[12.5px] text-cyan-900 dark:text-cyan-200">
            <strong>Implementation Nuance:</strong> If Redis performs the refill and decision inside a Lua script, <code class="font-bold">TokenBucketRateLimiter</code> acts as a thin orchestration layer. Avoid duplicating the token calculation independently in both the application and the Redis script.
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 12: ATOMIC TOKEN BUCKET ALGORITHM (REDIS SCRIPT LOGIC)
    // =========================================================================
    {
      badge: "ALGORITHM",
      badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
      title: "LLD algorithm — atomic token bucket",
      content: `
        <div class="flex flex-col gap-5 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            The following pseudocode describes the logic the Redis script must execute atomically:
          </p>

          <!-- Pseudocode Block -->
          <div class="p-4 rounded-xl bg-[#0B0F17] text-slate-200 border border-[#24314A] font-mono text-[12.5px] leading-relaxed overflow-x-auto shadow-sm">
            <div class="text-cyan-400 font-bold mb-2">// Atomic Token Bucket Pseudocode (Executed in Redis Lua Script)</div>
            <pre class="text-emerald-400"><code>def check_rate_limit(key, capacity, refill_rate, cost, now):
    # Entire operation must execute atomically.
    state = redis_read(key)
    if state is missing:
        tokens = capacity
        last_refill = now
    else:
        tokens = state.tokens
        last_refill = state.last_refill_time

    elapsed = max(0, now - last_refill)
    tokens = min(
        capacity,
        tokens + elapsed * refill_rate
    )

    if tokens &gt;= cost:
        tokens -= cost
        allowed = True
        retry_after = 0
    else:
        allowed = False
        retry_after = ceil(
            (cost - tokens) / refill_rate
        )

    redis_write(
        key,
        tokens=tokens,
        last_refill_time=now
    )

    return {
        "allowed": allowed,
        "remaining": math.floor(tokens),
        "retry_after": retry_after
    }</code></pre>
          </div>

          <!-- Production Implementation Notes -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <strong class="text-slate-900 dark:text-white text-[13px] font-bold">Production Considerations:</strong>
            <ul class="list-disc pl-5 space-y-1.5 text-[12.5px]">
              <li><strong>Atomicity:</strong> The entire read &rarr; calculate &rarr; write sequence must run atomically without preemption.</li>
              <li><strong>Time Source:</strong> Use a consistent time source, preferably Redis server time (<code class="text-[11px] bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">redis.call('TIME')</code>) inside the script, to eliminate application-server clock skew.</li>
              <li><strong>Policy Validation:</strong> Validate policy values beforehand: capacity and cost must be positive, and refill rate must be positive to calculate retry times.</li>
              <li><strong>State Key TTL:</strong> Set an appropriate TTL on state keys to automatically prune cold buckets.</li>
              <li><strong>Fractional Tokens:</strong> Maintain floating-point tokens in state so sub-second refills accumulate smoothly.</li>
            </ul>
          </div>

          <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[12.5px] text-amber-950 dark:text-amber-200">
            <strong>Important Optimization:</strong> The algorithm writes state even when a request is denied. A production implementation may optimize write volume, but it must still preserve the correct refill timestamp and token balance. Incorrect timestamp handling can accidentally grant extra tokens or delay refill.
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 13: PRODUCTION FAILURE SCENARIOS & HIGH AVAILABILITY
    // =========================================================================
    {
      badge: "RESILIENCE",
      badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
      title: "Production failure scenarios",
      content: `
        <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            A senior-level interview answer should explain not just the happy path, but what happens when components fail.
          </p>

          <!-- Failure Matrix Table -->
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4 w-1/3">Failure Scenario</th>
                  <th class="py-3 px-4 w-2/3">Recommended Handling</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[12px]">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Redis unavailable</td>
                  <td class="py-2.5 px-4">Choose fail-open or fail-closed per endpoint and risk profile.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Redis timeout</td>
                  <td class="py-2.5 px-4">Apply a strict timeout (e.g. 5–10ms); avoid indefinite request blocking.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Traffic spike</td>
                  <td class="py-2.5 px-4">Scale Redis appropriately, protect hot keys, and monitor saturation.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Concurrent requests</td>
                  <td class="py-2.5 px-4">Atomic token-bucket operation via serialized Lua execution.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Redis failover</td>
                  <td class="py-2.5 px-4">Understand asynchronous replication lag and accept temporary bounded overshoot.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Application restart</td>
                  <td class="py-2.5 px-4">Shared Redis state survives ordinary application restarts without quota loss.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Policy service unavailable</td>
                  <td class="py-2.5 px-4">Use a bounded, validated local policy cache in memory.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Malicious identity values</td>
                  <td class="py-2.5 px-4">Authenticate callers and validate key construction; do not rely on spoofable IP headers.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Regional network partition</td>
                  <td class="py-2.5 px-4">Define whether regional limits are independent or globally coordinated.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Fail-Open vs Fail-Closed -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2">
              <strong class="text-emerald-700 dark:text-emerald-400 text-[13px] font-bold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[17px]">lock_open</span>
                Fail-Open (Availability Focus)
              </strong>
              <p class="text-[12.5px] leading-relaxed">
                Allow requests if the rate limiter cannot be reached.
              </p>
              <ul class="list-disc pl-5 space-y-1 text-[12px] text-emerald-800 dark:text-emerald-300">
                <li>Preserves user availability during infrastructure hiccups.</li>
                <li>Can expose downstream services to overload or abuse.</li>
                <li><strong>Best for:</strong> Low-risk public read endpoints (e.g., search catalog, view post).</li>
              </ul>
            </div>

            <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-2">
              <strong class="text-rose-700 dark:text-rose-400 text-[13px] font-bold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[17px]">lock</span>
                Fail-Closed (Security Focus)
              </strong>
              <p class="text-[12.5px] leading-relaxed">
                Reject requests when the limiter cannot verify available quota.
              </p>
              <ul class="list-disc pl-5 space-y-1 text-[12px] text-rose-800 dark:text-rose-300">
                <li>Protects mission-critical resources and stops brute-force attacks.</li>
                <li>May cause legitimate traffic to experience downtime.</li>
                <li><strong>Best for:</strong> Login / auth endpoints, checkout, and payment write APIs.</li>
              </ul>
            </div>
          </div>

          <!-- Multi-Region Challenge -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <strong class="text-slate-900 dark:text-white text-[13px] font-bold">The Multi-Region Challenge</strong>
            <p class="text-[12.5px] leading-relaxed">
              A Redis cluster within one region does not automatically enforce an exact global quota across multiple regions. If each region independently permits 100 requests per minute, the aggregate allowance across two regions may reach 200 req/min.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[12px]">
              <div class="p-2.5 rounded-lg bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">1. Central Global Store</strong>
                Exact totals, but cross-region network latency (100–200ms) on every single check.
              </div>
              <div class="p-2.5 rounded-lg bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">2. Regional Token Budgets</strong>
                Allocate fractional quotas from global pool (e.g. 60% US-East, 40% EU-West).
              </div>
              <div class="p-2.5 rounded-lg bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">3. Independent Limits</strong>
                Fast local checks when approximate aggregate limits are business-acceptable.
              </div>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 14: CAPACITY ESTIMATION EXAMPLE & HARDWARE SIZING
    // =========================================================================
    {
      badge: "CAPACITY",
      badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
      title: "Capacity estimation example",
      content: `
        <div class="flex flex-col gap-5 text-[#334155] dark:text-slate-300">
          <!-- Assumptions Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14]">
              <div class="text-[10.5px] font-mono uppercase text-slate-400 font-bold">Active Identities</div>
              <div class="text-[20px] font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1">1,000,000</div>
              <div class="text-[11px] text-slate-500">1 Million Callers</div>
            </div>
            <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14]">
              <div class="text-[10.5px] font-mono uppercase text-slate-400 font-bold">State Size</div>
              <div class="text-[20px] font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1">100–200 B</div>
              <div class="text-[11px] text-slate-500">Raw Key Payload</div>
            </div>
            <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14]">
              <div class="text-[10.5px] font-mono uppercase text-slate-400 font-bold">Throughput</div>
              <div class="text-[20px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">100,000</div>
              <div class="text-[11px] text-slate-500">Requests per Second</div>
            </div>
            <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14]">
              <div class="text-[10.5px] font-mono uppercase text-slate-400 font-bold">Ops per Request</div>
              <div class="text-[20px] font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1">1 Atomic</div>
              <div class="text-[11px] text-slate-500">Redis Operation</div>
            </div>
          </div>

          <!-- Memory Calculation Card -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-2 font-mono text-[13px]">
            <span class="text-cyan-600 dark:text-cyan-400 font-bold font-sans text-[12px] uppercase tracking-wider">Memory Sizing Formula</span>
            <div class="text-[15px] font-extrabold text-slate-900 dark:text-white">
              Raw State Memory = 1,000,000 identities &times; 100–200 bytes = 100–200 MB
            </div>
            <p class="font-sans text-[12.5px] text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
              That is only the raw payload estimate. Actual production memory usage will be higher because of Redis internal dict structures, jemalloc memory allocator bucketing, replication buffers, and operational headroom. Plan for <strong>1&ndash;2 GB RAM</strong> to ensure comfort.
            </p>
          </div>

          <!-- Throughput & CPU Sizing -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <strong class="text-slate-900 dark:text-white text-[13px] font-bold">Throughput &amp; CPU Sizing</strong>
            <p class="text-[12.5px] leading-relaxed">
              At <strong>100,000 requests per second</strong>, the system must process 100,000 atomic Lua scripts per second.
            </p>
            <ul class="list-disc pl-5 space-y-1 text-[12px]">
              <li>A single Redis primary core typically handles ~50,000–80,000 complex Lua ops/sec.</li>
              <li>Deploy a <strong>Redis Cluster (e.g. 4–6 primary shards)</strong> to comfortably distribute the 100k ops/sec load.</li>
              <li>Always benchmark with realistic key distributions and hot-key patterns rather than relying on a generic Redis benchmark.</li>
            </ul>
          </div>

        </div>
      `
    }
  ];
}
