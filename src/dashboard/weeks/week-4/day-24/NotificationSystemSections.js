/**
 * Notification System Masterclass Deep-Dive Sections
 * Complete Low-Level Design, State Machine, Sequence Diagrams, ERD,
 * Outbox Pattern, Retries/DLQ, Scaling, Observability & Summary Architecture
 * Question 3: Design a Notification System
 */

export function getNotificationSystemDeliveryGuaranteeCard() {
  return `
    <div class="flex flex-col gap-4 text-[#334155] dark:text-slate-300">
      <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 shadow-xs">
        <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[24px] shrink-0 mt-0.5">verified_user</span>
        <div class="flex flex-col gap-1.5">
          <strong class="text-[14.5px] font-bold text-amber-950 dark:text-amber-200">
            Critical Delivery Guarantee Principle
          </strong>
          <p class="text-[13px] leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            A notification system <strong>cannot guarantee that every external email, SMS, or push notification reaches the user</strong>. The provider may accept a request without confirming final delivery, and some delivery receipts may never arrive.
          </p>
          <p class="text-[12.5px] font-semibold text-amber-800 dark:text-amber-300">
            This distinction prevents us from claiming that a notification was delivered merely because an API returned success.
          </p>
        </div>
      </div>

      <!-- 6 Explicit Delivery States -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div class="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span class="font-mono font-bold text-[12.5px] text-blue-700 dark:text-blue-300">Accepted</span>
          </div>
          <p class="text-[12px] text-slate-600 dark:text-slate-300">Our API has validated and accepted the request durably.</p>
        </div>

        <div class="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span class="font-mono font-bold text-[12.5px] text-indigo-700 dark:text-indigo-300">Queued</span>
          </div>
          <p class="text-[12px] text-slate-600 dark:text-slate-300">The notification event is committed and ready for worker consumption.</p>
        </div>

        <div class="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span class="font-mono font-bold text-[12.5px] text-purple-700 dark:text-purple-300">Provider accepted</span>
          </div>
          <p class="text-[12px] text-slate-600 dark:text-slate-300">The external provider (SES, Twilio, APNs) accepted the send call.</p>
        </div>

        <div class="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span class="font-mono font-bold text-[12.5px] text-emerald-700 dark:text-emerald-300">Delivered</span>
          </div>
          <p class="text-[12px] text-slate-600 dark:text-slate-300">A verified provider delivery receipt confirms delivery, where supported.</p>
        </div>

        <div class="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span class="font-mono font-bold text-[12.5px] text-rose-700 dark:text-rose-300">Failed</span>
          </div>
          <p class="text-[12px] text-slate-600 dark:text-slate-300">The system has concluded delivery failed permanently or retry budget lapsed.</p>
        </div>

        <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span class="font-mono font-bold text-[12.5px] text-slate-700 dark:text-slate-300">Delivery unknown</span>
          </div>
          <p class="text-[12px] text-slate-600 dark:text-slate-300">The final outcome cannot be determined reliably (no callback supported).</p>
        </div>
      </div>
    </div>
  `;
}

export function getNotificationSystemHldSection() {
  return {
    badge: "HLD & TOPOLOGY",
    badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
    title: "High-Level Design (HLD) — Authoritative Architecture & Topology",
    content: `
      <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
        
        <!-- Architectural Reference & Authority Banner -->
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between flex-wrap gap-2 text-[13px]">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-500 text-[20px]">architecture</span>
            <span>
              Conceptual reference: <a href="https://viblo.asia/p/distributed-transaction-transactional-outbox-pattern-maGK7r695j2" target="_blank" rel="noopener noreferrer" class="font-bold text-blue-600 dark:text-blue-400 hover:underline">viblo.asia (Transactional Outbox Pattern)</a>.
            </span>
          </div>
          <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Authoritative Top-Down Flowchart Implementation
          </span>
        </div>

        <!-- VIEW TOGGLE CONTROLS (Authoritative Flowchart vs Conceptual Reference) -->
        <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-1.5 flex-wrap">
            <button type="button" 
              class="hld-tab-btn active px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer" 
              onclick="
                const p = this.closest('section') || this.parentElement.parentElement;
                p.querySelector('.view-authoritative-td').classList.remove('hidden');
                p.querySelector('.view-conceptual-viblo').classList.add('hidden');
                this.parentElement.querySelectorAll('button').forEach(b => {
                  b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                });
                this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
              ">
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Authoritative Flowchart (TD)</span>
            </button>
            <button type="button" 
              class="hld-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
              onclick="
                const p = this.closest('section') || this.parentElement.parentElement;
                p.querySelector('.view-authoritative-td').classList.add('hidden');
                p.querySelector('.view-conceptual-viblo').classList.remove('hidden');
                this.parentElement.querySelectorAll('button').forEach(b => {
                  b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                });
                this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
              ">
              <span class="material-symbols-outlined text-[16px]">schema</span>
              <span>viblo.asia Conceptual Pattern</span>
            </button>
          </div>
          <span class="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 px-2 flex items-center gap-1 font-semibold">
            <span class="material-symbols-outlined text-[14px]">fit_screen</span>
            Razor-Sharp Vector &bull; Exact Topology
          </span>
        </div>

        <!-- VIEW 1: AUTHORITATIVE TOP-DOWN FLOWCHART (flowchart TD) -->
        <div class="view-authoritative-td w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
          <svg viewBox="0 0 1020 920" class="w-full max-w-[980px] h-auto min-w-[760px] select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="td-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" />
              </marker>
              <marker id="td-arr-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#14B8A6" />
              </marker>
              <marker id="td-arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#A855F7" />
              </marker>
              <marker id="td-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
              </marker>
              <marker id="td-arr-red" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#F43F5E" />
              </marker>
              <marker id="td-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#F59E0B" />
              </marker>
              <marker id="td-arr-dash" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#818CF8" />
              </marker>
            </defs>

            <!-- Node A: Order Service / Payment Service / Other Clients -->
            <rect x="350" y="20" width="320" height="46" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
            <text x="510" y="48" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#F1F5F9" text-anchor="middle">Order Service / Payment Service / Other Clients</text>

            <!-- Arrow A --> B -->
            <line x1="510" y1="66" x2="510" y2="94" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#td-arr)"/>

            <!-- Node B: Notification API -->
            <rect x="410" y="96" width="200" height="45" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
            <text x="510" y="123" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#38BDF8" text-anchor="middle">Notification API</text>

            <!-- Arrow B --> C -->
            <line x1="510" y1="141" x2="510" y2="169" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#td-arr)"/>

            <!-- Node C: Authentication, Validation and Idempotency -->
            <rect x="340" y="171" width="340" height="46" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5"/>
            <text x="510" y="199" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#C7D2FE" text-anchor="middle">Authentication, Validation and Idempotency</text>

            <!-- Arrow C --> P (Branch Left) -->
            <path d="M 340 194 L 180 194 L 180 252" fill="none" stroke="#14B8A6" stroke-width="1.5" marker-end="url(#td-arr-teal)"/>
            <rect x="200" y="184" width="95" height="18" rx="4" fill="#134E4A" stroke="#0F766E" stroke-width="1"/>
            <text x="247" y="196" font-family="Geist, sans-serif" font-size="8.5" font-weight="600" fill="#5EEAD4" text-anchor="middle">Validate Opt-In</text>

            <!-- Node P: Preference and Consent Service (Left) -->
            <rect x="60" y="255" width="240" height="48" rx="8" fill="#134E4A" stroke="#14B8A6" stroke-width="1.5"/>
            <text x="180" y="284" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#5EEAD4" text-anchor="middle">Preference and Consent Service</text>

            <!-- Arrow C --> T (Branch Right) -->
            <path d="M 680 194 L 840 194 L 840 252" fill="none" stroke="#14B8A6" stroke-width="1.5" marker-end="url(#td-arr-teal)"/>
            <rect x="725" y="184" width="95" height="18" rx="4" fill="#134E4A" stroke="#0F766E" stroke-width="1"/>
            <text x="772" y="196" font-family="Geist, sans-serif" font-size="8.5" font-weight="600" fill="#5EEAD4" text-anchor="middle">Validate Template</text>

            <!-- Node T: Template Service (Right) -->
            <rect x="720" y="255" width="240" height="48" rx="8" fill="#134E4A" stroke="#14B8A6" stroke-width="1.5"/>
            <text x="840" y="284" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#5EEAD4" text-anchor="middle">Template Service</text>

            <!-- Arrow C --> D (Straight Down) -->
            <line x1="510" y1="217" x2="510" y2="252" stroke="#818CF8" stroke-width="1.8" marker-end="url(#td-arr)"/>

            <!-- Node D: Notification Database [(cylinder)] -->
            <rect x="385" y="255" width="250" height="48" rx="8" fill="#312E81" stroke="#818CF8" stroke-width="2"/>
            <text x="510" y="284" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#E0E7FF" text-anchor="middle">[( Notification Database )]</text>

            <!-- Link D - - - E (Atomic Transaction Boundary) -->
            <line x1="510" y1="303" x2="510" y2="328" stroke="#A78BFA" stroke-width="2.5"/>

            <!-- Node E: Notification + Outbox Event Same Database Transaction -->
            <rect x="360" y="330" width="300" height="48" rx="8" fill="#1E1B4B" stroke="#A78BFA" stroke-width="1.5"/>
            <text x="510" y="350" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#DDD6FE" text-anchor="middle">Notification + Outbox Event</text>
            <text x="510" y="366" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#A5B4FC" text-anchor="middle">Same Database Transaction</text>

            <!-- Arrow E --> F -->
            <line x1="510" y1="378" x2="510" y2="406" stroke="#818CF8" stroke-width="1.8" marker-end="url(#td-arr)"/>

            <!-- Node F: Outbox Publisher -->
            <rect x="410" y="408" width="200" height="45" rx="8" fill="#312E81" stroke="#818CF8" stroke-width="1.5"/>
            <text x="510" y="435" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#C7D2FE" text-anchor="middle">Outbox Publisher</text>

            <!-- Arrow F --> Q -->
            <line x1="510" y1="453" x2="510" y2="481" stroke="#F59E0B" stroke-width="1.8" marker-end="url(#td-arr-amber)"/>

            <!-- Node Q: Durable Message Queue [[subroutine]] -->
            <rect x="390" y="483" width="240" height="46" rx="4" fill="#451A03" stroke="#D97706" stroke-width="1.8"/>
            <line x1="404" y1="483" x2="404" y2="529" stroke="#D97706" stroke-width="1.5"/>
            <line x1="616" y1="483" x2="616" y2="529" stroke="#D97706" stroke-width="1.5"/>
            <text x="510" y="511" font-family="Geist, sans-serif" font-size="11.5" font-weight="800" fill="#FCD34D" text-anchor="middle">[[ Durable Message Queue ]]</text>

            <!-- Arrow Q --> W -->
            <line x1="510" y1="529" x2="510" y2="559" stroke="#10B981" stroke-width="1.8" marker-end="url(#td-arr-green)"/>

            <!-- Node W: Channel Workers -->
            <rect x="390" y="561" width="240" height="48" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="2"/>
            <text x="510" y="590" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#6EE7B7" text-anchor="middle">Channel Workers</text>

            <!-- Arrow W --> P (Recheck mutable preferences before dispatch) -->
            <path d="M 390 578 L 200 578 L 200 309" fill="none" stroke="#14B8A6" stroke-width="1.5" marker-end="url(#td-arr-teal)"/>
            <rect x="120" y="420" width="130" height="18" rx="4" fill="#134E4A" stroke="#0F766E" stroke-width="1"/>
            <text x="185" y="432" font-family="Geist, sans-serif" font-size="8.5" font-weight="600" fill="#5EEAD4" text-anchor="middle">Recheck Send-Time Consent</text>

            <!-- Arrow W --> T (Render template before dispatch) -->
            <path d="M 630 578 L 820 578 L 820 309" fill="none" stroke="#14B8A6" stroke-width="1.5" marker-end="url(#td-arr-teal)"/>
            <rect x="765" y="420" width="115" height="18" rx="4" fill="#134E4A" stroke="#0F766E" stroke-width="1"/>
            <text x="822" y="432" font-family="Geist, sans-serif" font-size="8.5" font-weight="600" fill="#5EEAD4" text-anchor="middle">Render Dynamic Msg</text>

            <!-- Arrow W --> DLQ (Failures / Exhausted Retries) -->
            <line x1="630" y1="595" x2="708" y2="595" stroke="#F43F5E" stroke-width="1.8" marker-end="url(#td-arr-red)"/>
            <rect x="710" y="572" width="180" height="46" rx="4" fill="#4C0519" stroke="#F43F5E" stroke-width="1.8"/>
            <line x1="722" y1="572" x2="722" y2="618" stroke="#F43F5E" stroke-width="1.5"/>
            <line x1="878" y1="572" x2="878" y2="618" stroke="#F43F5E" stroke-width="1.5"/>
            <text x="800" y="600" font-family="Geist, sans-serif" font-size="11" font-weight="800" fill="#FDA4AF" text-anchor="middle">[[ Dead-Letter Queue ]]</text>

            <!-- Arrow W --> R -->
            <line x1="510" y1="609" x2="510" y2="639" stroke="#A855F7" stroke-width="1.8" marker-end="url(#td-arr-purple)"/>

            <!-- Node R: Provider Adapter Interface -->
            <rect x="380" y="641" width="260" height="44" rx="6" fill="#3B0764" stroke="#A855F7" stroke-width="1.5"/>
            <text x="510" y="668" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#F3E8FF" text-anchor="middle">Provider Adapter Interface</text>

            <!-- Arrows R --> Providers (Fanning out) -->
            <path d="M 430 685 L 145 685 L 145 722" fill="none" stroke="#38BDF8" stroke-width="1.5" marker-end="url(#td-arr)"/>
            <path d="M 470 685 L 345 685 L 345 722" fill="none" stroke="#34D399" stroke-width="1.5" marker-end="url(#td-arr)"/>
            <path d="M 550 685 L 550 722" fill="none" stroke="#818CF8" stroke-width="1.5" marker-end="url(#td-arr)"/>
            <path d="M 590 685 L 775 685 L 775 722" fill="none" stroke="#F59E0B" stroke-width="1.5" marker-end="url(#td-arr)"/>

            <!-- Providers Row -->
            <!-- EM: Email Provider -->
            <rect x="50" y="725" width="190" height="42" rx="6" fill="#0C4A6E" stroke="#38BDF8" stroke-width="1.2"/>
            <text x="145" y="751" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#38BDF8" text-anchor="middle">Email Provider</text>

            <!-- SM: SMS Provider -->
            <rect x="250" y="725" width="190" height="42" rx="6" fill="#064E3B" stroke="#34D399" stroke-width="1.2"/>
            <text x="345" y="751" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">SMS Provider</text>

            <!-- PU: Push Provider -->
            <rect x="455" y="725" width="190" height="42" rx="6" fill="#1E1B4B" stroke="#818CF8" stroke-width="1.2"/>
            <text x="550" y="751" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#818CF8" text-anchor="middle">Push Provider</text>

            <!-- IN: In-App Notification Store -->
            <rect x="670" y="725" width="210" height="42" rx="6" fill="#451A03" stroke="#F59E0B" stroke-width="1.2"/>
            <text x="775" y="751" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#FCD34D" text-anchor="middle">In-App Notification Store</text>

            <!-- Webhook Connections EM, SM, PU --> WH -->
            <path d="M 145 767 L 145 790 L 320 790 L 320 812" fill="none" stroke="#14B8A6" stroke-width="1.3" marker-end="url(#td-arr-teal)"/>
            <line x1="345" y1="767" x2="345" y2="812" stroke="#14B8A6" stroke-width="1.3" marker-end="url(#td-arr-teal)"/>
            <path d="M 550 767 L 550 790 L 410 790 L 410 812" fill="none" stroke="#14B8A6" stroke-width="1.3" marker-end="url(#td-arr-teal)"/>

            <!-- Node WH: Provider Webhook Handler -->
            <rect x="240" y="815" width="250" height="46" rx="8" fill="#134E4A" stroke="#14B8A6" stroke-width="1.8"/>
            <text x="365" y="843" font-family="Geist, sans-serif" font-size="11.5" font-weight="800" fill="#5EEAD4" text-anchor="middle">Provider Webhook Handler</text>

            <!-- Arrow WH --> D (Long Feedback Loop to DB) -->
            <path d="M 240 838 L 25 838 L 25 279 L 380 279" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#td-arr-green)"/>
            <rect x="35" y="550" width="115" height="18" rx="4" fill="#064E3B" stroke="#059669" stroke-width="1"/>
            <text x="92" y="562" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Update Delivery Status</text>

            <!-- Node M: Metrics, Logs and Traces -->
            <rect x="560" y="815" width="260" height="46" rx="8" fill="#1E1B4B" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.5"/>
            <text x="690" y="843" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#C7D2FE" text-anchor="middle">Metrics, Logs and Traces</text>

            <!-- Dashed Lines to M: B, F, W, WH -->
            <!-- WH -.-> M -->
            <line x1="490" y1="838" x2="553" y2="838" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.5" marker-end="url(#td-arr-dash)"/>

            <!-- B -.-> M -->
            <path d="M 610 118 L 980 118 L 980 838 L 826 838" fill="none" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.3" marker-end="url(#td-arr-dash)"/>

            <!-- F -.-> M -->
            <path d="M 610 430 L 950 430 L 950 828 L 826 828" fill="none" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.3" marker-end="url(#td-arr-dash)"/>

            <!-- W -.-> M -->
            <path d="M 890 595 L 920 595 L 920 818 L 826 818" fill="none" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.3" marker-end="url(#td-arr-dash)"/>
          </svg>
        </div>

        <!-- VIEW 2: VIBLO.ASIA CONCEPTUAL PATTERN (Based on user reference image) -->
        <div class="view-conceptual-viblo hidden flex flex-col gap-4">
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0F1D] p-5 shadow-xs flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-400 text-[20px]">lightbulb</span>
                <strong class="text-[14px] font-bold text-white">viblo.asia Conceptual Pattern: Dual-Write Outbox Core</strong>
              </div>
              <span class="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Transactional Core</span>
            </div>

            <!-- Conceptual Pattern Vector Recreation of Attached Image -->
            <div class="w-full overflow-x-auto p-4 flex justify-center">
              <svg viewBox="0 0 940 440" class="w-full max-w-[900px] h-auto min-w-[700px] select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="vb-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#000000" class="dark:fill-slate-300"/>
                  </marker>
                </defs>

                <!-- Title on Left -->
                <text x="20" y="30" font-family="Geist, sans-serif" font-size="18" font-weight="700" fill="#0F172A" class="dark:fill-white">Notification service</text>

                <!-- Input: Message Arrow -->
                <text x="65" y="165" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#475569" class="dark:fill-slate-400">message</text>
                <line x1="15" y1="180" x2="128" y2="180" stroke="#000000" stroke-width="2.5" class="dark:stroke-slate-300" marker-end="url(#vb-arr)"/>

                <!-- Notification Service Box (Left Blue) -->
                <rect x="130" y="120" width="180" height="120" rx="6" fill="#2563EB" stroke="#1D4ED8" stroke-width="2"/>
                <text x="220" y="145" font-family="Geist, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Notification service</text>
                <!-- persist() button -->
                <rect x="155" y="160" width="130" height="30" rx="4" fill="#16A34A" stroke="#15803D" stroke-width="1"/>
                <text x="220" y="180" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">persist()</text>
                <!-- persist_outbox() button -->
                <rect x="155" y="200" width="130" height="30" rx="4" fill="#16A34A" stroke="#15803D" stroke-width="1"/>
                <text x="220" y="220" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">persist_outbox()</text>

                <!-- Database Cylinder (Center Gray) -->
                <rect x="420" y="50" width="190" height="200" rx="10" fill="#94A3B8" stroke="#64748B" stroke-width="2" class="dark:fill-slate-700 dark:stroke-slate-600"/>
                <ellipse cx="515" cy="50" rx="95" ry="25" fill="#CBD5E1" stroke="#64748B" stroke-width="2" class="dark:fill-slate-600 dark:stroke-slate-500"/>
                
                <!-- Table 1: subscription (yellow) -->
                <rect x="450" y="120" width="130" height="30" rx="4" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
                <text x="515" y="140" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#78350F" text-anchor="middle">subscription</text>

                <!-- Table 2: notification (green) -->
                <rect x="450" y="160" width="130" height="30" rx="4" fill="#22C55E" stroke="#16A34A" stroke-width="1.5"/>
                <text x="515" y="180" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">notification</text>

                <!-- Table 3: notify_outbox (green) -->
                <rect x="450" y="200" width="130" height="30" rx="4" fill="#22C55E" stroke="#16A34A" stroke-width="1.5"/>
                <text x="515" y="220" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">notify_outbox</text>

                <!-- Arrows from Notification service into DB tables -->
                <line x1="285" y1="175" x2="445" y2="175" stroke="#000000" stroke-width="2.5" class="dark:stroke-slate-300" marker-end="url(#vb-arr)"/>
                <line x1="285" y1="215" x2="445" y2="215" stroke="#000000" stroke-width="2.5" class="dark:stroke-slate-300" marker-end="url(#vb-arr)"/>

                <!-- Right Side: Subscription Service -->
                <text x="815" y="45" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#475569" class="dark:fill-slate-400">subscribe</text>
                <line x1="845" y1="25" x2="845" y2="78" stroke="#000000" stroke-width="2.5" class="dark:stroke-slate-300" marker-end="url(#vb-arr)"/>

                <rect x="750" y="80" width="190" height="90" rx="6" fill="#2563EB" stroke="#1D4ED8" stroke-width="2"/>
                <text x="845" y="105" font-family="Geist, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Subscription service</text>
                <!-- subscribe() button -->
                <rect x="780" y="120" width="130" height="30" rx="4" fill="#FBBF24" stroke="#D97706" stroke-width="1"/>
                <text x="845" y="140" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#78350F" text-anchor="middle">subscribe()</text>

                <!-- Arrow from Subscription service into subscription table -->
                <line x1="750" y1="135" x2="585" y2="135" stroke="#000000" stroke-width="2.5" class="dark:stroke-slate-300" marker-end="url(#vb-arr)"/>

                <!-- Bottom Publishers: Reading from outbox -->
                <!-- Central trunk line down from DB -->
                <line x1="515" y1="250" x2="515" y2="290" stroke="#000000" stroke-width="3" class="dark:stroke-slate-300"/>
                <line x1="220" y1="290" x2="845" y2="290" stroke="#000000" stroke-width="3" class="dark:stroke-slate-300"/>

                <!-- SMS Publisher -->
                <line x1="220" y1="290" x2="220" y2="338" stroke="#000000" stroke-width="3" class="dark:stroke-slate-300" marker-end="url(#vb-arr)"/>
                <rect x="130" y="340" width="180" height="85" rx="6" fill="#2563EB" stroke="#1D4ED8" stroke-width="2"/>
                <text x="220" y="365" font-family="Geist, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">SMS Publisher</text>
                <rect x="155" y="380" width="130" height="30" rx="4" fill="#16A34A" stroke="#15803D" stroke-width="1"/>
                <text x="220" y="400" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">publish()</text>

                <!-- Email Publisher -->
                <line x1="515" y1="290" x2="515" y2="338" stroke="#000000" stroke-width="3" class="dark:stroke-slate-300" marker-end="url(#vb-arr)"/>
                <rect x="425" y="340" width="180" height="85" rx="6" fill="#2563EB" stroke="#1D4ED8" stroke-width="2"/>
                <text x="515" y="365" font-family="Geist, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Email Publisher</text>
                <rect x="450" y="380" width="130" height="30" rx="4" fill="#16A34A" stroke="#15803D" stroke-width="1"/>
                <text x="515" y="400" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">publish()</text>

                <!-- Voice call Publisher -->
                <line x1="845" y1="290" x2="845" y2="338" stroke="#000000" stroke-width="3" class="dark:stroke-slate-300" marker-end="url(#vb-arr)"/>
                <rect x="755" y="340" width="180" height="85" rx="6" fill="#2563EB" stroke="#1D4ED8" stroke-width="2"/>
                <text x="845" y="365" font-family="Geist, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Voice call Publisher</text>
                <rect x="780" y="380" width="130" height="30" rx="4" fill="#16A34A" stroke="#15803D" stroke-width="1"/>
                <text x="845" y="400" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">publish()</text>
              </svg>
            </div>

            <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[12.5px] text-slate-300 leading-relaxed">
              <strong>How This Pattern Works:</strong>
              When a notification message is received, the <code>Notification service</code> writes the notification payload to the <code>notification</code> table and the event record to the <code>notify_outbox</code> table within the <strong>same database transaction</strong>. Independent publisher worker processes (SMS, Email, Voice call) tail the outbox table to reliably publish each message without dual-write inconsistency.
            </div>
          </div>
        </div>


        <!-- Distributed Notification System — Component Responsibilities Table -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-[18px]">table_chart</span>
              Distributed Notification System &mdash; Component Responsibilities
            </h4>
            <span class="text-[11px] font-mono text-slate-400">13 Core Architectural Building Blocks</span>
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
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">1. Notification API</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Accepts notification requests from services such as Order Service and validates the request.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">2. Idempotency Handler</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Prevents duplicate notifications when a client retries the same request.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">3. Notification Database</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Stores notification details, delivery jobs, statuses, and delivery attempts.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">4. Transactional Outbox</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Saves an event in the same database transaction as the notification so that the event is not lost if the queue is unavailable.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">5. Outbox Publisher</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Reads pending events from the database and publishes them to the message queue.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">6. Durable Queue</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Temporarily stores notification jobs and distributes them to workers, especially during traffic spikes.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">7. Channel Workers</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Process queued jobs and send notifications through email, SMS, push, or in-app channels.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">8. Preference and Consent Service</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Checks whether the user is allowed to receive a notification through the selected channel.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">9. Template Service</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Creates the final message using templates, such as an order-confirmation email or push notification.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">10. Provider Adapters</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Connect the system to external services such as Amazon SES for email, Twilio for SMS, and FCM/APNs for push notifications.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">11. Webhook Handler</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Receives delivery updates from providers and updates notification statuses.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">12. Dead-Letter Queue (DLQ)</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Stores jobs that still fail after the allowed retries, so they can be investigated later.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">13. Observability</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Monitors system health, queue delays, delivery failures, retries, and provider performance.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Simple example Walkthrough Card -->
        <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-3.5 shadow-xs">
          <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[20px]">shopping_cart_checkout</span>
            <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white">Simple example</h4>
          </div>
          <p class="text-[13px] text-slate-700 dark:text-slate-300 font-medium">When a user places an order:</p>
          <div class="flex flex-col gap-2">
            <div class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[12.5px]">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
              <span>The <strong>Notification API</strong> accepts the order-confirmation request.</span>
            </div>
            <div class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[12.5px]">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
              <span>The <strong>Database and Outbox</strong> save the notification and its event.</span>
            </div>
            <div class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[12.5px]">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
              <span>The <strong>Outbox Publisher</strong> sends the event to the Queue.</span>
            </div>
            <div class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[12.5px]">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">4</span>
              <span>A <strong>Worker</strong> picks up the job, checks preferences, and prepares the message using the Template Service.</span>
            </div>
            <div class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[12.5px]">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">5</span>
              <span>The <strong>Provider Adapter</strong> sends the email.</span>
            </div>
            <div class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[12.5px]">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">6</span>
              <span>The <strong>Webhook Handler</strong> receives a delivery update, if available.</span>
            </div>
            <div class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[12.5px]">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">7</span>
              <span><strong>Observability</strong> tracks the result, while failed jobs can be retried or moved to the DLQ.</span>
            </div>
          </div>
          
          <div class="p-3.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 flex items-start gap-2.5 text-[12.5px] mt-1">
            <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[18px] shrink-0 mt-0.5">bookmark_heart</span>
            <span class="text-indigo-950 dark:text-indigo-200 font-medium leading-relaxed">
              <strong>Remember:</strong> The API accepts the request, the queue manages the work, the workers deliver the notification, and the database tracks its state.
            </span>
          </div>
        </div>

      </div>
    `
  };
}

export function getNotificationSystemLldSections() {
  return [
    // =========================================================================
    // SECTION 1: NOTIFICATION REQUEST LIFECYCLE (STATE MACHINE)
    // =========================================================================
    {
      badge: "STATE MACHINE",
      badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
      title: "Notification Request Lifecycle & State Machine",
      content: `
        <div class="state-machine-wrapper flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            A notification moves through several distinct stages. The system tracks its <strong>overall notification state separately from the delivery state of each individual channel</strong>. To prevent claiming false delivery, the system enforces strict state machine semantics distinguishing between acceptance, dispatch, provider acknowledgment, and final receipt.
          </p>

          <!-- VIEW TOGGLE CONTROLS (Interactive State Diagram vs 11-State Reference Matrix) -->
          <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" 
                class="sm-tab-btn active px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.state-machine-wrapper');
                  p.querySelector('.view-state-svg').classList.remove('hidden');
                  p.querySelector('.view-state-table').classList.add('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">conversion_path</span>
                <span>Interactive State Diagram</span>
              </button>
              <button type="button" 
                class="sm-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.state-machine-wrapper');
                  p.querySelector('.view-state-svg').classList.add('hidden');
                  p.querySelector('.view-state-table').classList.remove('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">table_rows</span>
                <span>11-State Reference Matrix</span>
              </button>
            </div>
            <span class="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 px-2 flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[14px]">done_all</span>
              17 Transitions &bull; 5 Terminal States
            </span>
          </div>

          <!-- TAB 1: INTERACTIVE VECTOR STATE DIAGRAM (SVG) -->
          <div class="view-state-svg w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 1080 540" class="w-full max-w-[1040px] h-auto min-w-[850px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="sm2-arr-default" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" />
                </marker>
                <marker id="sm2-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
                </marker>
                <marker id="sm2-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F59E0B" />
                </marker>
                <marker id="sm2-arr-red" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F43F5E" />
                </marker>
                <marker id="sm2-arr-slate" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#94A3B8" />
                </marker>
              </defs>

              <!-- ============================================================== -->
              <!-- ROW 1: INGRESS PIPELINE ([*] -> Accepted -> Persisted -> Queued -> Processing) -->
              <!-- ============================================================== -->

              <!-- START PSEUDO-STATE [*] -->
              <circle cx="45" cy="80" r="11" fill="#6366F1" stroke="#A5B4FC" stroke-width="2.5"/>
              <circle cx="45" cy="80" r="16" fill="none" stroke="#6366F1" stroke-width="1" stroke-dasharray="3,3"/>
              <text x="45" y="55" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#A5B4FC" text-anchor="middle">[*]</text>

              <!-- [*] --> Accepted: Valid request -->
              <line x1="58" y1="80" x2="114" y2="80" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#sm2-arr-default)"/>
              <rect x="62" y="66" width="48" height="15" rx="3" fill="#0B132B" stroke="#0284C7" stroke-width="0.8"/>
              <text x="86" y="77" font-family="Geist, sans-serif" font-size="7.5" font-weight="700" fill="#38BDF8" text-anchor="middle">Valid request</text>

              <!-- STATE: Accepted -->
              <rect x="118" y="55" width="116" height="50" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.6"/>
              <text x="176" y="85" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#38BDF8" text-anchor="middle">Accepted</text>

              <!-- Accepted --> Persisted: DB transaction commits -->
              <line x1="234" y1="80" x2="308" y2="80" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#sm2-arr-default)"/>
              <rect x="240" y="66" width="62" height="15" rx="3" fill="#0B132B" stroke="#0284C7" stroke-width="0.8"/>
              <text x="271" y="77" font-family="Geist, sans-serif" font-size="7" font-weight="700" fill="#38BDF8" text-anchor="middle">DB txn commits</text>

              <!-- STATE: Persisted -->
              <rect x="312" y="55" width="116" height="50" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.6"/>
              <text x="370" y="85" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#A5B4FC" text-anchor="middle">Persisted</text>

              <!-- Persisted --> Queued: Outbox event published -->
              <line x1="428" y1="80" x2="504" y2="80" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#sm2-arr-default)"/>
              <rect x="434" y="66" width="64" height="15" rx="3" fill="#0B132B" stroke="#0284C7" stroke-width="0.8"/>
              <text x="466" y="77" font-family="Geist, sans-serif" font-size="7" font-weight="700" fill="#38BDF8" text-anchor="middle">Outbox published</text>

              <!-- STATE: Queued -->
              <rect x="508" y="55" width="116" height="50" rx="8" fill="#312E81" stroke="#818CF8" stroke-width="1.6"/>
              <text x="566" y="85" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#C7D2FE" text-anchor="middle">Queued</text>

              <!-- Queued --> Processing: Worker receives job -->
              <line x1="624" y1="80" x2="698" y2="80" stroke="#F59E0B" stroke-width="1.8" marker-end="url(#sm2-arr-amber)"/>
              <rect x="630" y="66" width="62" height="15" rx="3" fill="#1C1917" stroke="#D97706" stroke-width="0.8"/>
              <text x="661" y="77" font-family="Geist, sans-serif" font-size="7" font-weight="700" fill="#FCD34D" text-anchor="middle">Worker receives job</text>

              <!-- STATE: Processing (Hub state) -->
              <rect x="702" y="52" width="145" height="56" rx="10" fill="#451A03" stroke="#F59E0B" stroke-width="2.5"/>
              <text x="774" y="86" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#FBBF24" text-anchor="middle">Processing</text>

              <!-- ============================================================== -->
              <!-- BRANCH 1: Processing --> Suppressed --> [*] -->
              <!-- ============================================================== -->
              <path d="M 847 80 L 980 80 L 980 146" fill="none" stroke="#94A3B8" stroke-width="1.8" marker-end="url(#sm2-arr-slate)"/>
              <rect x="858" y="66" width="116" height="15" rx="3" fill="#0F172A" stroke="#475569" stroke-width="0.8"/>
              <text x="916" y="77" font-family="Geist, sans-serif" font-size="6.8" font-weight="700" fill="#94A3B8" text-anchor="middle">Consent/pref blocks delivery</text>

              <!-- STATE: Suppressed -->
              <rect x="910" y="150" width="140" height="48" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
              <text x="980" y="180" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#94A3B8" text-anchor="middle">Suppressed</text>

              <!-- Suppressed --> [*] -->
              <line x1="980" y1="198" x2="980" y2="242" stroke="#64748B" stroke-width="1.8" marker-end="url(#sm2-arr-slate)"/>
              <!-- Terminal Bullseye [*] -->
              <circle cx="980" cy="256" r="13" fill="none" stroke="#64748B" stroke-width="2"/>
              <circle cx="980" cy="256" r="7" fill="#64748B"/>
              <text x="980" y="284" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#64748B" text-anchor="middle">[*]</text>

              <!-- ============================================================== -->
              <!-- BRANCH 2: Processing --> ProviderAccepted --> Delivered / DeliveryUnknown -->
              <!-- ============================================================== -->
              <line x1="774" y1="108" x2="774" y2="186" stroke="#10B981" stroke-width="1.8" marker-end="url(#sm2-arr-green)"/>
              <rect x="724" y="140" width="100" height="17" rx="3" fill="#064E3B" stroke="#059669" stroke-width="0.8"/>
              <text x="774" y="152" font-family="Geist, sans-serif" font-size="7.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Provider accepts send</text>

              <!-- STATE: ProviderAccepted -->
              <rect x="694" y="190" width="160" height="50" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.8"/>
              <text x="774" y="221" font-family="Geist, sans-serif" font-size="12.5" font-weight="800" fill="#6EE7B7" text-anchor="middle">ProviderAccepted</text>

              <!-- ProviderAccepted --> Delivered: Delivery receipt confirms -->
              <path d="M 734 240 L 734 285 L 630 285 L 630 336" fill="none" stroke="#10B981" stroke-width="1.8" marker-end="url(#sm2-arr-green)"/>
              <rect x="626" y="277" width="98" height="16" rx="3" fill="#064E3B" stroke="#059669" stroke-width="0.8"/>
              <text x="675" y="289" font-family="Geist, sans-serif" font-size="7.2" font-weight="700" fill="#6EE7B7" text-anchor="middle">Receipt confirms</text>

              <!-- STATE: Delivered (Success Terminal) -->
              <rect x="555" y="340" width="150" height="50" rx="8" fill="#065F46" stroke="#10B981" stroke-width="2"/>
              <text x="630" y="371" font-family="Geist, sans-serif" font-size="13" font-weight="800" fill="#A7F3D0" text-anchor="middle">&#10003; Delivered</text>

              <!-- Delivered --> [*] -->
              <line x1="630" y1="390" x2="630" y2="440" stroke="#10B981" stroke-width="1.8" marker-end="url(#sm2-arr-green)"/>
              <circle cx="630" cy="454" r="13" fill="none" stroke="#10B981" stroke-width="2"/>
              <circle cx="630" cy="454" r="7" fill="#10B981"/>
              <text x="630" y="482" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#10B981" text-anchor="middle">[*]</text>

              <!-- ProviderAccepted --> DeliveryUnknown: No reliable final receipt -->
              <path d="M 814 240 L 814 285 L 870 285 L 870 336" fill="none" stroke="#94A3B8" stroke-width="1.8" marker-end="url(#sm2-arr-slate)"/>
              <rect x="816" y="277" width="108" height="16" rx="3" fill="#0F172A" stroke="#475569" stroke-width="0.8"/>
              <text x="870" y="289" font-family="Geist, sans-serif" font-size="7" font-weight="700" fill="#94A3B8" text-anchor="middle">No reliable final receipt</text>

              <!-- STATE: DeliveryUnknown (Terminal) -->
              <rect x="795" y="340" width="150" height="50" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
              <text x="870" y="371" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#94A3B8" text-anchor="middle">DeliveryUnknown</text>

              <!-- DeliveryUnknown --> [*] -->
              <line x1="870" y1="390" x2="870" y2="440" stroke="#64748B" stroke-width="1.8" marker-end="url(#sm2-arr-slate)"/>
              <circle cx="870" cy="454" r="13" fill="none" stroke="#64748B" stroke-width="2"/>
              <circle cx="870" cy="454" r="7" fill="#64748B"/>
              <text x="870" y="482" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#64748B" text-anchor="middle">[*]</text>

              <!-- ============================================================== -->
              <!-- BRANCH 3: Processing --> RetryScheduled (Transient) -->
              <!-- ============================================================== -->
              <path d="M 720 108 L 720 155 L 430 155 L 430 186" fill="none" stroke="#F59E0B" stroke-width="1.8" marker-end="url(#sm2-arr-amber)"/>
              <rect x="525" y="147" width="85" height="16" rx="3" fill="#451A03" stroke="#D97706" stroke-width="0.8"/>
              <text x="567" y="159" font-family="Geist, sans-serif" font-size="7.2" font-weight="700" fill="#FCD34D" text-anchor="middle">Transient failure</text>

              <!-- STATE: RetryScheduled -->
              <rect x="350" y="190" width="160" height="50" rx="8" fill="#451A03" stroke="#F59E0B" stroke-width="1.8"/>
              <text x="430" y="221" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FCD34D" text-anchor="middle">RetryScheduled</text>

              <!-- Loop Back: RetryScheduled --> Processing: Retry due -->
              <path d="M 410 190 L 410 120 L 698 88" fill="none" stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#sm2-arr-amber)"/>
              <rect x="500" y="108" width="55" height="16" rx="3" fill="#1C1917" stroke="#D97706" stroke-width="0.8"/>
              <text x="527" y="120" font-family="Geist, sans-serif" font-size="7.5" font-weight="700" fill="#FBBF24" text-anchor="middle">Retry due</text>

              <!-- RetryScheduled --> DeadLettered: Retry budget exhausted -->
              <line x1="430" y1="240" x2="430" y2="336" stroke="#F43F5E" stroke-width="1.8" marker-end="url(#sm2-arr-red)"/>
              <rect x="375" y="277" width="110" height="16" rx="3" fill="#4C0519" stroke="#E11D48" stroke-width="0.8"/>
              <text x="430" y="289" font-family="Geist, sans-serif" font-size="7.2" font-weight="700" fill="#FDA4AF" text-anchor="middle">Retry budget exhausted</text>

              <!-- STATE: DeadLettered (DLQ Terminal) -->
              <rect x="350" y="340" width="160" height="50" rx="8" fill="#4C0519" stroke="#E11D48" stroke-width="2"/>
              <text x="430" y="371" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#FDA4AF" text-anchor="middle">DeadLettered</text>

              <!-- DeadLettered --> [*] -->
              <line x1="430" y1="390" x2="430" y2="440" stroke="#E11D48" stroke-width="1.8" marker-end="url(#sm2-arr-red)"/>
              <circle cx="430" cy="454" r="13" fill="none" stroke="#E11D48" stroke-width="2"/>
              <circle cx="430" cy="454" r="7" fill="#E11D48"/>
              <text x="430" y="482" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#FDA4AF" text-anchor="middle">[*]</text>

              <!-- ============================================================== -->
              <!-- BRANCH 4: Processing --> Failed (Permanent Failure) -->
              <!-- ============================================================== -->
              <path d="M 705 108 L 705 125 L 190 125 L 190 336" fill="none" stroke="#F43F5E" stroke-width="1.8" marker-end="url(#sm2-arr-red)"/>
              <rect x="195" y="222" width="90" height="16" rx="3" fill="#4C0519" stroke="#E11D48" stroke-width="0.8"/>
              <text x="240" y="234" font-family="Geist, sans-serif" font-size="7.2" font-weight="700" fill="#FDA4AF" text-anchor="middle">Permanent failure</text>

              <!-- STATE: Failed (Terminal) -->
              <rect x="120" y="340" width="140" height="50" rx="8" fill="#4C0519" stroke="#E11D48" stroke-width="2"/>
              <text x="190" y="371" font-family="Geist, sans-serif" font-size="12.5" font-weight="800" fill="#FDA4AF" text-anchor="middle">&#10007; Failed</text>

              <!-- Failed --> [*] -->
              <line x1="190" y1="390" x2="190" y2="440" stroke="#E11D48" stroke-width="1.8" marker-end="url(#sm2-arr-red)"/>
              <circle cx="190" cy="454" r="13" fill="none" stroke="#E11D48" stroke-width="2"/>
              <circle cx="190" cy="454" r="7" fill="#E11D48"/>
              <text x="190" y="482" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#FDA4AF" text-anchor="middle">[*]</text>
            </svg>
          </div>



          <!-- TAB 3: 11-STATE REFERENCE MATRIX -->
          <div class="view-state-table hidden flex flex-col gap-3">
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
              <table class="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                    <th class="py-3 px-4 w-1/5">State</th>
                    <th class="py-3 px-4 w-1/6">Category</th>
                    <th class="py-3 px-4 w-1/4">Trigger / Transition</th>
                    <th class="py-3 px-4 w-1/5">Owning Component</th>
                    <th class="py-3 px-4 w-1/6">Terminal?</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">Accepted</td>
                    <td class="py-2.5 px-4 text-slate-500">Ingress</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Valid incoming API request passing auth and schema checks</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Notification API</td>
                    <td class="py-2.5 px-4 font-semibold text-slate-400">No</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">Persisted</td>
                    <td class="py-2.5 px-4 text-slate-500">Ingress</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Notification and outbox record written in same DB transaction</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Transactional Outbox</td>
                    <td class="py-2.5 px-4 font-semibold text-slate-400">No</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-violet-600 dark:text-violet-400">Queued</td>
                    <td class="py-2.5 px-4 text-slate-500">Buffering</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Outbox publisher safely dispatches event into durable broker</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Outbox Publisher / Queue</td>
                    <td class="py-2.5 px-4 font-semibold text-slate-400">No</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">Processing</td>
                    <td class="py-2.5 px-4 text-slate-500">Hub / Execution</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Channel worker consumes job, checks consent, and renders template</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Channel Worker</td>
                    <td class="py-2.5 px-4 font-semibold text-slate-400">No</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-slate-500 dark:text-slate-400">Suppressed</td>
                    <td class="py-2.5 px-4 text-slate-500">Terminal Result</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Blocked by user preference, quiet hours, or marketing opt-out</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Preference / Consent Svc</td>
                    <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Yes &bull; [*]</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">ProviderAccepted</td>
                    <td class="py-2.5 px-4 text-slate-500">Intermediate</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">External provider accepts payload with HTTP 200/202</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Provider Adapter</td>
                    <td class="py-2.5 px-4 font-semibold text-slate-400">No</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">RetryScheduled</td>
                    <td class="py-2.5 px-4 text-slate-500">Transient Error</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">429 Rate Limit, 503 Outage; exponential backoff timer set</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Worker Retry Handler</td>
                    <td class="py-2.5 px-4 font-semibold text-slate-400">No</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">DeadLettered</td>
                    <td class="py-2.5 px-4 text-slate-500">Terminal Failure</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Exceeded max retry attempts (e.g., 5 attempts); routed to DLQ</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Dead-Letter Queue</td>
                    <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Yes &bull; [*]</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">Failed</td>
                    <td class="py-2.5 px-4 text-slate-500">Terminal Failure</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Permanent rejection: invalid email, phone disconnected, 400 schema error</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Provider Adapter</td>
                    <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Yes &bull; [*]</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">Delivered</td>
                    <td class="py-2.5 px-4 text-slate-500">Terminal Success</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Provider webhook delivers verified cryptographic DLR callback</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Webhook Handler</td>
                    <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Yes &bull; [*]</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-slate-500 dark:text-slate-400">DeliveryUnknown</td>
                    <td class="py-2.5 px-4 text-slate-500">Terminal Outcome</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Provider lacks DLR support or 48-hour delivery receipt window elapsed</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Reconciliation Job</td>
                    <td class="py-2.5 px-4 font-bold text-slate-500 dark:text-slate-400">Yes &bull; [*]</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Deep-Dive Callouts -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
              <strong class="text-[13.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="material-symbols-outlined text-amber-500 text-[18px]">warning</span>
                Never Equate ProviderAccepted with Delivered
              </strong>
              <p class="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                An SMS provider (e.g. Twilio) or push gateway may accept a message for processing with HTTP 202, but later asynchronously discover that the destination phone number is disconnected or the handset is turned off. <strong>ProviderAccepted means the external provider took custody; only a webhook DLR transitions to Delivered.</strong>
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
              <strong class="text-[13.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="material-symbols-outlined text-cyan-500 text-[18px]">account_tree</span>
                Multi-Channel Independence
              </strong>
              <p class="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                A single order event may fan out to email and push. An email can succeed while the mobile push token has expired. <strong>Store channel-level delivery records</strong> in a <code>notification_channel_delivery</code> table rather than forcing every channel into one shared status.
              </p>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 2: END-TO-END SEQUENCE DIAGRAM
    // =========================================================================
    {
      badge: "SEQUENCE",
      badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
      title: "End-to-End Sequence Diagram & Execution Flow",
      content: `
        <div class="sequence-wrapper flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            This authoritative end-to-end sequence details the interplay between the <strong>Transactional Outbox</strong>, asynchronous worker leasing, just-in-time preference evaluation, template compilation, external provider adapters, and deduplicated delivery receipt webhooks.
          </p>

          <!-- VIEW TOGGLE CONTROLS (Interactive SVG vs Execution Guide) -->
          <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" 
                class="seq-tab-btn active px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.sequence-wrapper');
                  p.querySelector('.view-seq-svg').classList.remove('hidden');
                  p.querySelector('.view-seq-guide').classList.add('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">timeline</span>
                <span>Interactive Sequence Diagram</span>
              </button>
              <button type="button" 
                class="seq-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.sequence-wrapper');
                  p.querySelector('.view-seq-svg').classList.add('hidden');
                  p.querySelector('.view-seq-guide').classList.remove('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Execution Step-by-Step Guide</span>
              </button>
            </div>
            <span class="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 px-2 flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[14px]">sync_alt</span>
              10 Participants &bull; 21 Interactions
            </span>
          </div>

          <!-- TAB 1: INTERACTIVE SEQUENCE DIAGRAM (SVG) -->
          <div class="view-seq-svg w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0A0E1A] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 1060 740" class="w-full max-w-[1020px] h-auto min-w-[860px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="sq2-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" />
                </marker>
                <marker id="sq2-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
                </marker>
                <marker id="sq2-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F59E0B" />
                </marker>
                <marker id="sq2-arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#A855F7" />
                </marker>
                <marker id="sq2-arr-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F43F5E" />
                </marker>
                <marker id="sq2-arr-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#14B8A6" />
                </marker>
                <marker id="sq2-arr-dash" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#94A3B8" />
                </marker>
              </defs>

              <!-- ============================================================== -->
              <!-- 10 PARTICIPANT HEADERS & LIFELINES -->
              <!-- ============================================================== -->
              <!-- 1: S (Source Service) -->
              <rect x="15" y="20" width="80" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
              <text x="55" y="42" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#E2E8F0" text-anchor="middle">Source Service</text>
              <line x1="55" y1="54" x2="55" y2="720" stroke="#334155" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 2: API (Notification API) -->
              <rect x="110" y="20" width="105" height="34" rx="6" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.2"/>
              <text x="162" y="42" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#38BDF8" text-anchor="middle">Notification API</text>
              <line x1="162" y1="54" x2="162" y2="720" stroke="#0284C7" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 3: DB (Notification DB) -->
              <rect x="225" y="20" width="100" height="34" rx="6" fill="#312E81" stroke="#6366F1" stroke-width="1.2"/>
              <text x="275" y="42" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#A5B4FC" text-anchor="middle">Notification DB</text>
              <line x1="275" y1="54" x2="275" y2="720" stroke="#4338CA" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 4: O (Outbox Publisher) -->
              <rect x="335" y="20" width="100" height="34" rx="6" fill="#1E1B4B" stroke="#818CF8" stroke-width="1.2"/>
              <text x="385" y="42" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#C7D2FE" text-anchor="middle">Outbox Publisher</text>
              <line x1="385" y1="54" x2="385" y2="720" stroke="#4F46E5" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 5: Q (Durable Queue) -->
              <rect x="445" y="20" width="95" height="34" rx="6" fill="#451A03" stroke="#D97706" stroke-width="1.2"/>
              <text x="492" y="42" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FCD34D" text-anchor="middle">Durable Queue</text>
              <line x1="492" y1="54" x2="492" y2="720" stroke="#B45309" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 6: W (Delivery Worker) -->
              <rect x="550" y="20" width="105" height="34" rx="6" fill="#064E3B" stroke="#10B981" stroke-width="1.2"/>
              <text x="602" y="42" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Delivery Worker</text>
              <line x1="602" y1="54" x2="602" y2="720" stroke="#059669" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 7: P (Preference Service) -->
              <rect x="665" y="20" width="95" height="34" rx="6" fill="#1E293B" stroke="#64748B" stroke-width="1.2"/>
              <text x="712" y="42" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#CBD5E1" text-anchor="middle">Preference Svc</text>
              <line x1="712" y1="54" x2="712" y2="720" stroke="#334155" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 8: T (Template Service) -->
              <rect x="770" y="20" width="90" height="34" rx="6" fill="#1E293B" stroke="#64748B" stroke-width="1.2"/>
              <text x="815" y="42" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#CBD5E1" text-anchor="middle">Template Svc</text>
              <line x1="815" y1="54" x2="815" y2="720" stroke="#334155" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 9: EP (External Provider) -->
              <rect x="870" y="20" width="95" height="34" rx="6" fill="#881337" stroke="#F43F5E" stroke-width="1.2"/>
              <text x="917" y="42" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FDA4AF" text-anchor="middle">External Provider</text>
              <line x1="917" y1="54" x2="917" y2="720" stroke="#E11D48" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- 10: WH (Webhook Handler) -->
              <rect x="975" y="20" width="75" height="34" rx="6" fill="#134E4A" stroke="#14B8A6" stroke-width="1.2"/>
              <text x="1012" y="42" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#5EEAD4" text-anchor="middle">Webhook</text>
              <line x1="1012" y1="54" x2="1012" y2="720" stroke="#0D9488" stroke-dasharray="3,3" stroke-width="1.2"/>

              <!-- ============================================================== -->
              <!-- PHASE 1: INGESTION & OUTBOX PERSISTENCE -->
              <!-- ============================================================== -->

              <!-- 1. S ->> API: POST notification + idempotency key -->
              <line x1="55" y1="78" x2="155" y2="78" stroke="#38BDF8" stroke-width="1.5" marker-end="url(#sq2-arr)"/>
              <text x="105" y="72" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#E2E8F0" text-anchor="middle">POST notification + idempotency key</text>

              <!-- 2. API ->> API: Authenticate and validate -->
              <path d="M 162 92 L 188 92 L 188 106 L 165 106" fill="none" stroke="#38BDF8" stroke-width="1.2" marker-end="url(#sq2-arr)"/>
              <text x="240" y="102" font-family="Geist, sans-serif" font-size="8.5" fill="#94A3B8">Authenticate and validate</text>

              <!-- DB TRANSACTION BOUNDARY BOX -->
              <rect x="155" y="118" width="130" height="98" rx="6" fill="#1E1B4B" fill-opacity="0.5" stroke="#6366F1" stroke-dasharray="3,3" stroke-width="1"/>
              <text x="220" y="130" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#A5B4FC" text-anchor="middle">SAME DB TRANSACTION</text>

              <!-- 3. API ->> DB: Begin transaction -->
              <line x1="162" y1="142" x2="268" y2="142" stroke="#818CF8" stroke-width="1.3" marker-end="url(#sq2-arr)"/>
              <text x="215" y="139" font-family="Geist, sans-serif" font-size="8.5" fill="#C7D2FE" text-anchor="middle">Begin transaction</text>

              <!-- 4. API ->> DB: Insert notification and channel jobs -->
              <line x1="162" y1="164" x2="268" y2="164" stroke="#818CF8" stroke-width="1.3" marker-end="url(#sq2-arr)"/>
              <text x="215" y="160" font-family="Geist, sans-serif" font-size="8.5" fill="#C7D2FE" text-anchor="middle">Insert notification &amp; channel jobs</text>

              <!-- 5. API ->> DB: Insert outbox event -->
              <line x1="162" y1="186" x2="268" y2="186" stroke="#818CF8" stroke-width="1.3" marker-end="url(#sq2-arr)"/>
              <text x="215" y="182" font-family="Geist, sans-serif" font-size="8.5" fill="#C7D2FE" text-anchor="middle">Insert outbox event</text>

              <!-- 6. API ->> DB: Commit transaction -->
              <line x1="162" y1="206" x2="268" y2="206" stroke="#10B981" stroke-width="1.3" marker-end="url(#sq2-arr-green)"/>
              <text x="215" y="202" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#34D399" text-anchor="middle">Commit transaction</text>

              <!-- 7. API -->> S: 202 Accepted + notificationId -->
              <line x1="162" y1="230" x2="62" y2="230" stroke="#10B981" stroke-dasharray="3,3" stroke-width="1.4" marker-end="url(#sq2-arr-green)"/>
              <text x="108" y="224" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#34D399" text-anchor="middle">202 Accepted + notificationId</text>

              <!-- ============================================================== -->
              <!-- PHASE 2: OUTBOX DISPATCHING TO DURABLE QUEUE -->
              <!-- ============================================================== -->

              <!-- 8. O ->> DB: Fetch unpublished outbox events -->
              <line x1="385" y1="260" x2="282" y2="260" stroke="#C7D2FE" stroke-width="1.3" marker-end="url(#sq2-arr)"/>
              <text x="333" y="254" font-family="Geist, sans-serif" font-size="8.5" fill="#E2E8F0" text-anchor="middle">Fetch unpublished outbox events</text>

              <!-- 9. O ->> Q: Publish event -->
              <line x1="385" y1="284" x2="485" y2="284" stroke="#F59E0B" stroke-width="1.4" marker-end="url(#sq2-arr-amber)"/>
              <text x="438" y="278" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#FCD34D" text-anchor="middle">Publish event</text>

              <!-- 10. O ->> DB: Mark event published -->
              <line x1="385" y1="308" x2="282" y2="308" stroke="#818CF8" stroke-width="1.3" marker-end="url(#sq2-arr)"/>
              <text x="333" y="302" font-family="Geist, sans-serif" font-size="8.5" fill="#C7D2FE" text-anchor="middle">Mark event published</text>

              <!-- ============================================================== -->
              <!-- PHASE 3: WORKER LEASING, CONSENT & TEMPLATING -->
              <!-- ============================================================== -->

              <!-- 11. Q ->> W: Deliver job -->
              <line x1="492" y1="338" x2="595" y2="338" stroke="#34D399" stroke-width="1.4" marker-end="url(#sq2-arr-green)"/>
              <text x="546" y="332" font-family="Geist, sans-serif" font-size="8.5" font-weight="600" fill="#6EE7B7" text-anchor="middle">Deliver job</text>

              <!-- 12. W ->> DB: Claim job with lease -->
              <line x1="602" y1="365" x2="282" y2="365" stroke="#10B981" stroke-width="1.3" marker-end="url(#sq2-arr-green)"/>
              <text x="442" y="359" font-family="Geist, sans-serif" font-size="8.5" fill="#A7F3D0" text-anchor="middle">Claim job with lease</text>

              <!-- 13. W ->> P: Check current preferences/consent -->
              <line x1="602" y1="398" x2="705" y2="398" stroke="#CBD5E1" stroke-width="1.3" marker-end="url(#sq2-arr)"/>
              <text x="657" y="392" font-family="Geist, sans-serif" font-size="8.5" fill="#E2E8F0" text-anchor="middle">Check current preferences/consent</text>

              <!-- 14. P -->> W: Allowed or suppressed -->
              <line x1="712" y1="422" x2="609" y2="422" stroke="#94A3B8" stroke-dasharray="2,2" stroke-width="1.2" marker-end="url(#sq2-arr-dash)"/>
              <text x="657" y="416" font-family="Geist, sans-serif" font-size="8.5" fill="#94A3B8" text-anchor="middle">Allowed or suppressed</text>

              <!-- 15. W ->> T: Render template -->
              <line x1="602" y1="454" x2="808" y2="454" stroke="#CBD5E1" stroke-width="1.3" marker-end="url(#sq2-arr)"/>
              <text x="708" y="448" font-family="Geist, sans-serif" font-size="8.5" fill="#E2E8F0" text-anchor="middle">Render template</text>

              <!-- 16. T -->> W: Rendered message -->
              <line x1="815" y1="478" x2="609" y2="478" stroke="#94A3B8" stroke-dasharray="2,2" stroke-width="1.2" marker-end="url(#sq2-arr-dash)"/>
              <text x="708" y="472" font-family="Geist, sans-serif" font-size="8.5" fill="#94A3B8" text-anchor="middle">Rendered message</text>

              <!-- ============================================================== -->
              <!-- PHASE 4: EXTERNAL PROVIDER DISPATCH & CALLBACK -->
              <!-- ============================================================== -->

              <!-- 17. W ->> EP: Send with provider idempotency key if supported -->
              <line x1="602" y1="512" x2="910" y2="512" stroke="#F43F5E" stroke-width="1.5" marker-end="url(#sq2-arr-rose)"/>
              <text x="760" y="506" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#FDA4AF" text-anchor="middle">Send with provider idempotency key if supported</text>

              <!-- 18. EP -->> W: Accepted or error -->
              <line x1="917" y1="538" x2="609" y2="538" stroke="#FDA4AF" stroke-dasharray="2,2" stroke-width="1.3" marker-end="url(#sq2-arr-dash)"/>
              <text x="760" y="532" font-family="Geist, sans-serif" font-size="8.5" fill="#FECDD3" text-anchor="middle">Accepted or error</text>

              <!-- 19. W ->> DB: Update attempt and job status -->
              <line x1="602" y1="570" x2="282" y2="570" stroke="#818CF8" stroke-width="1.3" marker-end="url(#sq2-arr)"/>
              <text x="442" y="564" font-family="Geist, sans-serif" font-size="8.5" fill="#C7D2FE" text-anchor="middle">Update attempt and job status</text>

              <!-- 20. EP ->> WH: Delivery callback, if supported -->
              <line x1="917" y1="610" x2="1005" y2="610" stroke="#14B8A6" stroke-width="1.4" marker-end="url(#sq2-arr-teal)"/>
              <text x="960" y="604" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#5EEAD4" text-anchor="middle">Delivery callback, if supported</text>

              <!-- 21. WH ->> DB: Deduplicate callback and update status -->
              <line x1="1012" y1="645" x2="282" y2="645" stroke="#10B981" stroke-width="1.5" marker-end="url(#sq2-arr-green)"/>
              <text x="647" y="639" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#34D399" text-anchor="middle">Deduplicate callback and update status</text>
            </svg>
          </div>



          <!-- TAB 3: STEP-BY-STEP EXECUTION GUIDE -->
          <div class="view-seq-guide hidden flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Phase 1 Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <div class="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-[13px]">
                  <span class="w-5 h-5 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-[11px] font-mono">1</span>
                  Phase 1: Ingestion &amp; Outbox (Steps 1–7)
                </div>
                <p class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  The upstream service sends a notification request with a client idempotency key. The API authenticates the caller, validates schemas, and writes the notification entity, individual channel delivery jobs, and the outbox event in a <strong>single ACID database transaction</strong> before immediately returning <code>202 Accepted</code>.
                </p>
              </div>

              <!-- Phase 2 Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-[13px]">
                  <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[11px] font-mono">2</span>
                  Phase 2: Decoupled Outbox Publishing (Steps 8–10)
                </div>
                <p class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  An asynchronous outbox publisher worker polls or tails change data capture (CDC) logs from the database, publishes the event to the partitioned message broker (Kafka/RabbitMQ), and marks the event published. This guarantees <strong>at-least-once delivery with zero dual-write inconsistency</strong>.
                </p>
              </div>

              <!-- Phase 3 Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-[13px]">
                  <span class="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-[11px] font-mono">3</span>
                  Phase 3: Worker Lease &amp; Dispatch (Steps 11–19)
                </div>
                <p class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Channel workers acquire a lease in the database to prevent duplicate processing. The worker evaluates <strong>mutable user consent and quiet hours right before dispatch</strong>, compiles localized templates, and invokes the provider adapter with a provider idempotency key.
                </p>
              </div>

              <!-- Phase 4 Card -->
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <div class="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-[13px]">
                  <span class="w-5 h-5 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center text-[11px] font-mono">4</span>
                  Phase 4: Webhook DLR Reconciliation (Steps 20–21)
                </div>
                <p class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Providers like Twilio or SendGrid send asynchronous delivery receipts (DLRs). The webhook handler validates cryptographic signatures, deduplicates incoming events using provider message IDs, and marks the channel delivery record as <code>DELIVERED</code> or <code>FAILED</code>.
                </p>
              </div>
            </div>
          </div>

          <!-- Why This Sequence Matters -->
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 flex flex-col gap-3">
            <h4 class="font-bold text-[14px] text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-blue-500">checklist</span>
              Why This Sequence Matters
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Atomic Ingestion:</strong> The notification record and outbox event commit together in one database transaction, ensuring no events are lost if servers restart.</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Fast Decoupling:</strong> The API returns <code>202 Accepted</code> only after durable persistence; external provider latency or retries never block upstream microservices.</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>At-Least-Once Delivery:</strong> The outbox publisher may publish an event more than once if it crashes before updating the DB. Consumers tolerate duplicates via idempotency.</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Worker Leases:</strong> A worker claims a job lease with an expiration timestamp, preventing crashed workers from locking tasks forever while avoiding dual execution.</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Just-in-Time Consent:</strong> The worker rechecks mutable preferences/consent right before sending, preventing delivery if a user unsubscribes while the job sits in queue.</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Webhook Deduplication:</strong> Provider delivery callbacks arrive asynchronously and repeatedly; the webhook handler deduplicates them against provider message IDs.</span>
              </div>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 3: LOW-LEVEL DESIGN (LLD) & CLASS DIAGRAM
    // =========================================================================
    {
      badge: "LLD & OOP",
      badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-300",
      title: "Low-Level Design (LLD) & Class Diagram",
      content: `
        <div class="lld-class-wrapper flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            The low-level object-oriented model decouples ingestion, transaction boundary enforcement, outbox tailing, worker execution, template compilation, and third-party channel provider adapters via the <strong>Strategy Pattern</strong>.
          </p>

          <!-- VIEW TOGGLE CONTROLS (Interactive SVG vs Design Patterns) -->
          <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" 
                class="lld-tab-btn active px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.lld-class-wrapper');
                  p.querySelector('.view-lld-svg').classList.remove('hidden');
                  p.querySelector('.view-lld-patterns').classList.add('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">account_tree</span>
                <span>Interactive Class Diagram</span>
              </button>
              <button type="button" 
                class="lld-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.lld-class-wrapper');
                  p.querySelector('.view-lld-svg').classList.add('hidden');
                  p.querySelector('.view-lld-patterns').classList.remove('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">lightbulb</span>
                <span>Design Patterns &amp; Contracts</span>
              </button>
            </div>
            <span class="text-[11px] font-mono text-purple-600 dark:text-purple-400 px-2 flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[14px]">category</span>
              13 Classes &bull; 14 Relationships &bull; Strategy Pattern
            </span>
          </div>

          <!-- TAB 1: INTERACTIVE CLASS DIAGRAM (SVG) -->
          <div class="view-lld-svg w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 1020 620" class="w-full max-w-[980px] h-auto min-w-[800px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="cd2-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" />
                </marker>
                <marker id="cd2-impl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                  <polygon points="0,1 9,5 0,9" fill="#070B14" stroke="#818CF8" stroke-width="1.5" />
                </marker>
              </defs>

              <!-- ============================================================== -->
              <!-- ROW 1: CONTROLLER -> SERVICE -> REPOSITORY -->
              <!-- ============================================================== -->

              <!-- CLASS: NotificationController -->
              <rect x="30" y="30" width="230" height="95" rx="6" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
              <text x="145" y="52" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#38BDF8" text-anchor="middle">NotificationController</text>
              <line x1="30" y1="62" x2="260" y2="62" stroke="#0369A1" stroke-width="1"/>
              <text x="42" y="78" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+createNotification(request)</text>
              <text x="42" y="94" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+getNotification(id)</text>
              <text x="42" y="110" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+cancelNotification(id)</text>

              <!-- Connection 1: NotificationController --> NotificationService -->
              <line x1="260" y1="77" x2="338" y2="77" stroke="#38BDF8" stroke-width="1.5" marker-end="url(#cd2-arrow)"/>

              <!-- CLASS: NotificationService -->
              <rect x="340" y="30" width="240" height="95" rx="6" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5"/>
              <text x="460" y="52" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#A5B4FC" text-anchor="middle">NotificationService</text>
              <line x1="340" y1="62" x2="580" y2="62" stroke="#4338CA" stroke-width="1"/>
              <text x="352" y="78" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+accept(request)</text>
              <text x="352" y="94" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+validate(request)</text>
              <text x="352" y="110" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+checkIdempotency(request)</text>

              <!-- Connection 2: NotificationService --> NotificationRepository -->
              <line x1="580" y1="77" x2="668" y2="77" stroke="#38BDF8" stroke-width="1.5" marker-end="url(#cd2-arrow)"/>

              <!-- CLASS: NotificationRepository -->
              <rect x="670" y="20" width="245" height="135" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
              <text x="792" y="42" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#CBD5E1" text-anchor="middle">NotificationRepository</text>
              <line x1="670" y1="52" x2="915" y2="52" stroke="#334155" stroke-width="1"/>
              <text x="682" y="68" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+saveNotification(notification)</text>
              <text x="682" y="84" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+saveDeliveryJobs(jobs)</text>
              <text x="682" y="100" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+saveOutboxEvent(event)</text>
              <text x="682" y="116" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+getNotification(id)</text>
              <text x="682" y="132" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+updateDeliveryStatus(id, status)</text>

              <!-- ============================================================== -->
              <!-- ROW 2: PREFERENCE & TEMPLATE SERVICES (LEFT), WORKER & PUBLISHER -->
              <!-- ============================================================== -->

              <!-- CLASS: PreferenceService -->
              <rect x="30" y="180" width="250" height="65" rx="6" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
              <text x="155" y="202" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1" text-anchor="middle">PreferenceService</text>
              <line x1="30" y1="210" x2="280" y2="210" stroke="#334155" stroke-width="1"/>
              <text x="42" y="228" font-family="JetBrains Mono, monospace" font-size="9" fill="#E2E8F0">+isAllowed(userId, channel, category)</text>

              <!-- Connection 3: NotificationService --> PreferenceService -->
              <path d="M 370 125 L 370 150 L 250 150 L 250 178" fill="none" stroke="#64748B" stroke-dasharray="2,2" stroke-width="1.2" marker-end="url(#cd2-arrow)"/>

              <!-- CLASS: TemplateService -->
              <rect x="30" y="275" width="250" height="65" rx="6" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
              <text x="155" y="297" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1" text-anchor="middle">TemplateService</text>
              <line x1="30" y1="305" x2="280" y2="305" stroke="#334155" stroke-width="1"/>
              <text x="42" y="323" font-family="JetBrains Mono, monospace" font-size="9" fill="#E2E8F0">+render(templateId, data, channel)</text>

              <!-- Connection 4: NotificationService --> TemplateService -->
              <path d="M 350 125 L 350 160 L 155 160 L 155 273" fill="none" stroke="#64748B" stroke-dasharray="2,2" stroke-width="1.2" marker-end="url(#cd2-arrow)"/>

              <!-- CLASS: OutboxPublisher -->
              <rect x="670" y="180" width="245" height="80" rx="6" fill="#312E81" stroke="#818CF8" stroke-width="1.5"/>
              <text x="792" y="202" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#C7D2FE" text-anchor="middle">OutboxPublisher</text>
              <line x1="670" y1="212" x2="915" y2="212" stroke="#4F46E5" stroke-width="1"/>
              <text x="682" y="228" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+publishPendingEvents()</text>
              <text x="682" y="246" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+markPublished(eventId)</text>

              <!-- Connection 5: OutboxPublisher --> NotificationRepository -->
              <line x1="792" y1="180" x2="792" y2="157" stroke="#818CF8" stroke-width="1.3" marker-end="url(#cd2-arrow)"/>

              <!-- CLASS: DeliveryWorker (Center Dispatch Hub) -->
              <rect x="340" y="200" width="240" height="95" rx="6" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
              <text x="460" y="222" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#6EE7B7" text-anchor="middle">DeliveryWorker</text>
              <line x1="340" y1="232" x2="580" y2="232" stroke="#059669" stroke-width="1"/>
              <text x="352" y="248" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+process(job)</text>
              <text x="352" y="264" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+scheduleRetry(job, error)</text>
              <text x="352" y="280" font-family="JetBrains Mono, monospace" font-size="10" fill="#E2E8F0">+sendToDLQ(job)</text>

              <!-- Connection 6: DeliveryWorker --> NotificationRepository -->
              <path d="M 580 225 L 630 225 L 630 115 L 668 115" fill="none" stroke="#64748B" stroke-dasharray="2,2" stroke-width="1.3" marker-end="url(#cd2-arrow)"/>

              <!-- Connection 7: DeliveryWorker --> PreferenceService -->
              <line x1="340" y1="215" x2="282" y2="215" stroke="#64748B" stroke-width="1.3" marker-end="url(#cd2-arrow)"/>

              <!-- Connection 8: DeliveryWorker --> TemplateService -->
              <path d="M 340 260 L 305 260 L 305 295 L 282 295" fill="none" stroke="#64748B" stroke-width="1.3" marker-end="url(#cd2-arrow)"/>

              <!-- ============================================================== -->
              <!-- ROW 3: WEBHOOK HANDLER (RIGHT) -->
              <!-- ============================================================== -->
              <!-- CLASS: WebhookHandler -->
              <rect x="670" y="300" width="245" height="95" rx="6" fill="#134E4A" stroke="#14B8A6" stroke-width="1.5"/>
              <text x="792" y="322" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#5EEAD4" text-anchor="middle">WebhookHandler</text>
              <line x1="670" y1="332" x2="915" y2="332" stroke="#0F766E" stroke-width="1"/>
              <text x="682" y="348" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+verifySignature(request)</text>
              <text x="682" y="364" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+deduplicateEvent(event)</text>
              <text x="682" y="380" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+updateDeliveryStatus(event)</text>

              <!-- Connection 14: WebhookHandler --> NotificationRepository -->
              <path d="M 720 300 L 720 157" fill="none" stroke="#14B8A6" stroke-width="1.3" marker-end="url(#cd2-arrow)"/>

              <!-- ============================================================== -->
              <!-- ROW 4: STRATEGY PATTERN (ProviderAdapter Interface & Adapters) -->
              <!-- ============================================================== -->

              <!-- INTERFACE: ProviderAdapter -->
              <rect x="340" y="350" width="240" height="85" rx="6" fill="#3B0764" stroke="#A855F7" stroke-width="1.5"/>
              <text x="460" y="370" font-family="Geist, sans-serif" font-size="10" font-style="italic" fill="#E9D5FF" text-anchor="middle">&laquo;interface&raquo;</text>
              <text x="460" y="385" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#F3E8FF" text-anchor="middle">ProviderAdapter</text>
              <line x1="340" y1="395" x2="580" y2="395" stroke="#6B21A8" stroke-width="1"/>
              <text x="352" y="410" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+send(message, idempotencyKey)</text>
              <text x="352" y="426" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E2E8F0">+parseError(response)</text>

              <!-- Connection 9: DeliveryWorker --> ProviderAdapter -->
              <line x1="460" y1="295" x2="460" y2="348" stroke="#A855F7" stroke-width="1.5" marker-end="url(#cd2-arrow)"/>

              <!-- Concrete Adapters: Email, SMS, Push, InApp -->
              <!-- Bus bar line for implementations -->
              <path d="M 135 490 L 135 465 L 460 465 L 460 437" fill="none" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.3" marker-end="url(#cd2-impl)"/>
              <path d="M 355 490 L 355 465" fill="none" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.3"/>
              <path d="M 575 490 L 575 465" fill="none" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.3"/>
              <path d="M 795 490 L 795 465 L 460 465" fill="none" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="1.3"/>

              <!-- Concrete Adapter 1: EmailProviderAdapter -->
              <rect x="30" y="490" width="210" height="45" rx="6" fill="#18181B" stroke="#71717A" stroke-width="1.2"/>
              <text x="135" y="517" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E4E4E7" text-anchor="middle">EmailProviderAdapter</text>

              <!-- Concrete Adapter 2: SMSProviderAdapter -->
              <rect x="250" y="490" width="210" height="45" rx="6" fill="#18181B" stroke="#71717A" stroke-width="1.2"/>
              <text x="355" y="517" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E4E4E7" text-anchor="middle">SMSProviderAdapter</text>

              <!-- Concrete Adapter 3: PushProviderAdapter -->
              <rect x="470" y="490" width="210" height="45" rx="6" fill="#18181B" stroke="#71717A" stroke-width="1.2"/>
              <text x="575" y="517" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E4E4E7" text-anchor="middle">PushProviderAdapter</text>

              <!-- Concrete Adapter 4: InAppProviderAdapter -->
              <rect x="690" y="490" width="210" height="45" rx="6" fill="#18181B" stroke="#71717A" stroke-width="1.2"/>
              <text x="795" y="517" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E4E4E7" text-anchor="middle">InAppProviderAdapter</text>
            </svg>
          </div>



          <!-- TAB 3: DESIGN PATTERNS & CONTRACTS -->
          <div class="view-lld-patterns hidden flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px]">
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-purple-500 text-[16px]">extension</span>
                  1. Strategy Pattern (<code>ProviderAdapter</code>)
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Eliminates sprawling <code>if-else</code> or <code>switch</code> blocks in workers. Concrete adapters (SES, Twilio, APNs, FCM) encapsulate provider-specific payload schemas, API authorization headers, and error mappings while exposing a clean <code>send()</code> contract.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-indigo-500 text-[16px]">database</span>
                  2. Repository Pattern (<code>NotificationRepository</code>)
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Encapsulates atomic ACID database operations. Ensures that <code>saveNotification()</code>, <code>saveDeliveryJobs()</code>, and <code>saveOutboxEvent()</code> are executed within the exact same database transaction.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-emerald-500 text-[16px]">outbox</span>
                  3. Transactional Outbox Pattern (<code>OutboxPublisher</code>)
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Tails the outbox table via periodic polling or change data capture (Debezium/CDC). Guarantees at-least-once message delivery to durable queues without two-phase commit (2PC) overhead.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-teal-500 text-[16px]">fingerprint</span>
                  4. Idempotent Consumer Pattern (<code>WebhookHandler</code>)
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Verifies cryptographic provider HMAC signatures and performs <code>deduplicateEvent()</code> using a unique provider message ID before writing delivery updates to the repository.
                </p>
              </div>
            </div>
          </div>

          <!-- 5 Key Design Decisions Table -->
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-3">
            <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">verified</span>
              5 Fundamental Low-Level Design Decisions
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              <div class="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <strong class="text-slate-900 dark:text-white">1. Provider Interface Normalization</strong>
                <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                  All channel adapters implement a uniform <code>ProviderAdapter</code> contract. The delivery worker executes generic dispatch and error translation without knowing provider-specific SDK quirks.
                </p>
              </div>

              <div class="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <strong class="text-slate-900 dark:text-white">2. Separate Channel Jobs</strong>
                <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                  A multi-channel request (e.g. Email + Push) generates two independently tracked logical delivery jobs with distinct retry counters, rate limits, and provider message IDs.
                </p>
              </div>

              <div class="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <strong class="text-slate-900 dark:text-white">3. Transaction Boundary Enforcement</strong>
                <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                  The notification entity, delivery jobs, idempotency record, and outbox event commit in <strong>one atomic database transaction</strong>. Message broker publication happens asynchronously.
                </p>
              </div>

              <div class="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <strong class="text-slate-900 dark:text-white">4. Webhook Idempotency &amp; Uniqueness</strong>
                <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                  Callbacks are recorded in <code>PROVIDER_EVENT</code> with a database uniqueness constraint on <code>(provider, provider_event_id)</code> to defend against duplicate webhook deliveries.
                </p>
              </div>

              <div class="col-span-1 md:col-span-2 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <strong class="text-slate-900 dark:text-white">5. Cancellation and Provider Race Conditions</strong>
                <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                  Workers check if a job has been cancelled before dispatching. If the cancellation races with a provider call, cancellation is <strong>best-effort</strong>; once the provider accepts, the real external status is honored.
                </p>
              </div>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 4: DATABASE DESIGN & RELATIONAL ERD
    // =========================================================================
    {
      badge: "DATA MODEL",
      badgeColor: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
      title: "Database Design & Relational ERD",
      content: `
        <div class="erd-wrapper flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            A relational database such as <strong>PostgreSQL</strong> is the gold standard for notification platforms because requests, channel delivery jobs, idempotency tracking, and outbox events require strict ACID transaction boundaries to prevent dual-write inconsistencies.
          </p>

          <!-- VIEW TOGGLE CONTROLS (Interactive Relational ERD vs Indexing Strategy) -->
          <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" 
                class="erd-tab-btn active px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.erd-wrapper');
                  p.querySelector('.view-erd-svg').classList.remove('hidden');
                  p.querySelector('.view-erd-indexes').classList.add('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">schema</span>
                <span>Interactive Relational ERD</span>
              </button>
              <button type="button" 
                class="erd-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.erd-wrapper');
                  p.querySelector('.view-erd-svg').classList.add('hidden');
                  p.querySelector('.view-erd-indexes').classList.remove('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">speed</span>
                <span>Indexing &amp; Partitioning Strategy</span>
              </button>
            </div>
            <span class="text-[11px] font-mono text-teal-600 dark:text-teal-400 px-2 flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[14px]">table_chart</span>
              9 Tables &bull; 8 Relationships &bull; Strict ACID Boundaries
            </span>
          </div>

          <!-- TAB 1: INTERACTIVE RELATIONAL ERD (SVG) -->
          <div class="view-erd-svg w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 1060 670" class="w-full max-w-[1020px] h-auto min-w-[840px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="erd-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" />
                </marker>
              </defs>

              <!-- ============================================================== -->
              <!-- ROW 1: USER, USER_PREFERENCE, DEVICE_ENDPOINT, TEMPLATE -->
              <!-- ============================================================== -->

              <!-- 1. USER Entity -->
              <rect x="20" y="20" width="190" height="95" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
              <text x="115" y="42" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">USER</text>
              <line x1="20" y1="52" x2="210" y2="52" stroke="#334155" stroke-width="1"/>
              <text x="30" y="70" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#38BDF8">PK  user_id : string</text>
              <text x="30" y="90" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    created_at : datetime</text>

              <!-- 2. USER_PREFERENCE Entity -->
              <rect x="245" y="20" width="225" height="135" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
              <text x="357" y="42" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">USER_PREFERENCE</text>
              <line x1="245" y1="52" x2="470" y2="52" stroke="#334155" stroke-width="1"/>
              <text x="255" y="70" font-family="JetBrains Mono, monospace" font-size="9" fill="#38BDF8">PK  user_id : string</text>
              <text x="255" y="88" font-family="JetBrains Mono, monospace" font-size="9" fill="#38BDF8">PK  channel : string</text>
              <text x="255" y="106" font-family="JetBrains Mono, monospace" font-size="9" fill="#38BDF8">PK  category : string</text>
              <text x="255" y="124" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    enabled : boolean</text>
              <text x="255" y="142" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    updated_at : datetime</text>

              <!-- 3. DEVICE_ENDPOINT Entity -->
              <rect x="500" y="20" width="225" height="150" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
              <text x="612" y="42" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">DEVICE_ENDPOINT</text>
              <line x1="500" y1="52" x2="725" y2="52" stroke="#334155" stroke-width="1"/>
              <text x="510" y="70" font-family="JetBrains Mono, monospace" font-size="9" fill="#38BDF8">PK  endpoint_id : string</text>
              <text x="510" y="88" font-family="JetBrains Mono, monospace" font-size="9" fill="#818CF8">FK  user_id : string</text>
              <text x="510" y="106" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    platform : string</text>
              <text x="510" y="124" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    push_token : string</text>
              <text x="510" y="142" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    status : string</text>
              <text x="510" y="160" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    updated_at : datetime</text>

              <!-- 4. TEMPLATE Entity -->
              <rect x="755" y="20" width="225" height="135" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
              <text x="867" y="42" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">TEMPLATE</text>
              <line x1="755" y1="52" x2="980" y2="52" stroke="#334155" stroke-width="1"/>
              <text x="765" y="70" font-family="JetBrains Mono, monospace" font-size="9" fill="#38BDF8">PK  template_id : string</text>
              <text x="765" y="88" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    channel : string</text>
              <text x="765" y="106" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    version : string</text>
              <text x="765" y="124" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    content : string</text>
              <text x="765" y="142" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">    updated_at : datetime</text>

              <!-- ============================================================== -->
              <!-- ROW 2: NOTIFICATION, DELIVERY_JOB, DELIVERY_ATTEMPT -->
              <!-- ============================================================== -->

              <!-- 5. NOTIFICATION Entity (Core Ingress Hub) -->
              <rect x="20" y="205" width="275" height="195" rx="6" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
              <text x="157" y="227" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#38BDF8" text-anchor="middle">NOTIFICATION</text>
              <line x1="20" y1="237" x2="295" y2="237" stroke="#0369A1" stroke-width="1"/>
              <text x="30" y="254" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#38BDF8">PK  notification_id : string</text>
              <text x="30" y="272" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#818CF8">FK  user_id : string</text>
              <text x="30" y="290" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    event_type : string</text>
              <text x="30" y="308" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#818CF8">FK  template_id : string</text>
              <text x="30" y="326" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    status : string</text>
              <text x="30" y="344" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#38BDF8">UQ  idempotency_key : string</text>
              <text x="30" y="362" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    request_hash : string</text>
              <text x="30" y="380" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    scheduled_at : datetime</text>
              <text x="30" y="396" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    created_at : datetime</text>

              <!-- 6. DELIVERY_JOB Entity (Logical Channel Delivery) -->
              <rect x="365" y="205" width="280" height="195" rx="6" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
              <text x="505" y="227" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#6EE7B7" text-anchor="middle">DELIVERY_JOB</text>
              <line x1="365" y1="237" x2="645" y2="237" stroke="#059669" stroke-width="1"/>
              <text x="375" y="254" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#38BDF8">PK  job_id : string</text>
              <text x="375" y="272" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#818CF8">FK  notification_id : string</text>
              <text x="375" y="290" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    channel : string</text>
              <text x="375" y="308" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    destination_ref : string</text>
              <text x="375" y="326" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#F59E0B">IDX status : string</text>
              <text x="375" y="344" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    attempt_count : int</text>
              <text x="375" y="362" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    next_attempt_at : datetime</text>
              <text x="375" y="380" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#F59E0B">IDX lease_until : datetime</text>

              <!-- 7. DELIVERY_ATTEMPT Entity (Immutable Audit Log) -->
              <rect x="715" y="205" width="265" height="195" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
              <text x="847" y="227" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#E2E8F0" text-anchor="middle">DELIVERY_ATTEMPT (Audit)</text>
              <line x1="715" y1="237" x2="980" y2="237" stroke="#334155" stroke-width="1"/>
              <text x="725" y="254" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#38BDF8">PK  attempt_id : string</text>
              <text x="725" y="272" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#818CF8">FK  job_id : string</text>
              <text x="725" y="290" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    attempt_number : int</text>
              <text x="725" y="308" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    provider : string</text>
              <text x="725" y="326" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    provider_message_id : string</text>
              <text x="725" y="344" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    result : string</text>
              <text x="725" y="362" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    error_code : string</text>
              <text x="725" y="380" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    attempted_at : datetime</text>

              <!-- ============================================================== -->
              <!-- ROW 3: OUTBOX_EVENT & PROVIDER_EVENT -->
              <!-- ============================================================== -->

              <!-- 8. OUTBOX_EVENT Entity (Transactional Outbox) -->
              <rect x="20" y="445" width="275" height="180" rx="6" fill="#312E81" stroke="#818CF8" stroke-width="1.5"/>
              <text x="157" y="467" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#C7D2FE" text-anchor="middle">OUTBOX_EVENT</text>
              <line x1="20" y1="477" x2="295" y2="477" stroke="#4338CA" stroke-width="1"/>
              <text x="30" y="495" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#38BDF8">PK  event_id : string</text>
              <text x="30" y="513" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#818CF8">    aggregate_id : string</text>
              <text x="30" y="531" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    event_type : string</text>
              <text x="30" y="549" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    payload : string</text>
              <text x="30" y="567" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#F59E0B">IDX status : string</text>
              <text x="30" y="585" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    created_at : datetime</text>
              <text x="30" y="603" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    published_at : datetime</text>

              <!-- 9. PROVIDER_EVENT Entity (Webhook Deduplication) -->
              <rect x="470" y="445" width="290" height="155" rx="6" fill="#134E4A" stroke="#14B8A6" stroke-width="1.5"/>
              <text x="615" y="467" font-family="Geist, sans-serif" font-size="12" font-weight="700" fill="#5EEAD4" text-anchor="middle">PROVIDER_EVENT (Webhook DLR)</text>
              <line x1="470" y1="477" x2="760" y2="477" stroke="#0F766E" stroke-width="1"/>
              <text x="480" y="495" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#38BDF8">PK  provider_event_id : string</text>
              <text x="480" y="513" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    provider : string</text>
              <text x="480" y="531" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#818CF8">IDX provider_message_id : string</text>
              <text x="480" y="549" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    event_type : string</text>
              <text x="480" y="567" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#94A3B8">    received_at : datetime</text>

              <!-- ============================================================== -->
              <!-- 8 RELATIONSHIP CONNECTORS & CARDINALITIES -->
              <!-- ============================================================== -->

              <!-- 1. USER ||--o{ USER_PREFERENCE : has -->
              <line x1="210" y1="65" x2="245" y2="65" stroke="#64748B" stroke-width="1.8"/>
              <text x="227" y="58" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#CBD5E1" text-anchor="middle">has</text>

              <!-- 2. USER ||--o{ DEVICE_ENDPOINT : registers -->
              <path d="M 115 115 L 115 140 L 500 140 L 500 85" fill="none" stroke="#64748B" stroke-width="1.5"/>
              <text x="320" y="135" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#CBD5E1" text-anchor="middle">registers</text>

              <!-- 3. USER ||--o{ NOTIFICATION : receives -->
              <line x1="115" y1="115" x2="115" y2="205" stroke="#38BDF8" stroke-width="1.8"/>
              <text x="135" y="165" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#38BDF8" text-anchor="middle">receives</text>

              <!-- 4. TEMPLATE ||--o{ NOTIFICATION : renders -->
              <path d="M 867 155 L 867 185 L 260 185 L 260 205" fill="none" stroke="#64748B" stroke-width="1.5"/>
              <text x="560" y="180" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#CBD5E1" text-anchor="middle">renders</text>

              <!-- 5. NOTIFICATION ||--o{ DELIVERY_JOB : creates -->
              <line x1="295" y1="280" x2="365" y2="280" stroke="#10B981" stroke-width="2"/>
              <text x="330" y="272" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">creates (1:N)</text>

              <!-- 6. DELIVERY_JOB ||--o{ DELIVERY_ATTEMPT : records -->
              <line x1="645" y1="280" x2="715" y2="280" stroke="#64748B" stroke-width="1.8"/>
              <text x="680" y="272" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#CBD5E1" text-anchor="middle">records</text>

              <!-- 7. NOTIFICATION ||--o{ OUTBOX_EVENT : emits -->
              <line x1="157" y1="400" x2="157" y2="445" stroke="#818CF8" stroke-dasharray="3,3" stroke-width="2"/>
              <text x="195" y="425" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#A5B4FC" text-anchor="middle">emits (Same Tx)</text>

              <!-- 8. DELIVERY_JOB ||--o{ PROVIDER_EVENT : receives -->
              <path d="M 505 400 L 505 445" fill="none" stroke="#14B8A6" stroke-width="1.8"/>
              <text x="545" y="425" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#5EEAD4" text-anchor="middle">receives DLR</text>
            </svg>
          </div>



          <!-- TAB 3: INDEXING & PARTITIONING STRATEGY -->
          <div class="view-erd-indexes hidden flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px]">
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-teal-500 text-[16px]">key</span>
                  1. Idempotency &amp; Request Hash Index
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  On <code>NOTIFICATION</code>, enforce a unique index on <code>(user_id, idempotency_key)</code>. When a client re-submits a request with the same idempotency key, verify the SHA-256 <code>request_hash</code> matches the original request payload.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-amber-500 text-[16px]">timer</span>
                  2. Partial Index for Outbox Polling
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Create a partial B-Tree index on <code>OUTBOX_EVENT(created_at) WHERE status = 'PENDING'</code>. This prevents slow sequential table scans as millions of historically published rows accumulate.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-indigo-500 text-[16px]">lock_clock</span>
                  3. Worker Lease &amp; Retry Polling Index
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  On <code>DELIVERY_JOB</code>, index <code>(status, next_attempt_at, lease_until)</code>. Enables sub-millisecond queries for workers leasing due jobs: <code>WHERE status = 'RETRY_SCHEDULED' AND next_attempt_at &lt;= NOW()</code>.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-1.5">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-purple-500 text-[16px]">call_split</span>
                  4. Time-Based Partitioning for Audit Tables
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Partition <code>DELIVERY_ATTEMPT</code> and <code>PROVIDER_EVENT</code> by month on <code>attempted_at</code> / <code>received_at</code>. Allows instant cold data archiving and fast partition drops after retention windows expire (e.g., 90 days).
                </p>
              </div>
            </div>
          </div>

          <!-- Table-Level Considerations -->
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-3">
            <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[18px]">storage</span>
              Production Table-Level Considerations &amp; Constraints
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span class="font-bold text-slate-900 dark:text-white block mb-0.5">USER_PREFERENCE</span>
                Use a composite primary key on <code>(user_id, channel, category)</code> to prevent conflicting opt-in settings across communication categories.
              </div>
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span class="font-bold text-slate-900 dark:text-white block mb-0.5">DEVICE_ENDPOINT</span>
                One user registers multiple mobile devices. Invalidate stale APNs/FCM tokens upon receiving invalid token callbacks from push providers.
              </div>
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span class="font-bold text-slate-900 dark:text-white block mb-0.5">NOTIFICATION</span>
                Enforce uniqueness for <code>(user_id, idempotency_key)</code> with <code>request_hash</code> validation to safely ignore accidental client payload re-use.
              </div>
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span class="font-bold text-slate-900 dark:text-white block mb-0.5">DELIVERY_JOB</span>
                Enforce a unique logical job on <code>(notification_id, channel)</code> to prevent duplicate parallel job creation across channels during retries.
              </div>
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span class="font-bold text-slate-900 dark:text-white block mb-0.5">DELIVERY_ATTEMPT</span>
                Append-only audit table. Never mutate prior attempts; record timestamps, raw provider message IDs, and error codes for auditing.
              </div>
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span class="font-bold text-slate-900 dark:text-white block mb-0.5">PII Security &amp; Data Minimization</span>
                Avoid storing raw phone numbers or emails in queue payloads. Use tokenized destination references and encrypt sensitive PII at rest.
              </div>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 5: TRANSACTIONAL OUTBOX PATTERN DEEP DIVE
    // =========================================================================
    {
      badge: "RELIABILITY",
      badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
      title: "Transactional Outbox Pattern & The Dual-Write Problem",
      content: `
        <div class="outbox-wrapper flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[13px] leading-relaxed">
            <strong class="text-slate-900 dark:text-white block mb-1">The Dual-Write Problem:</strong>
            Writing to a database and publishing to a message queue cannot be committed as a single atomic operation across two distributed systems. If the database transaction commits but publishing to the queue fails, the message is permanently lost. Conversely, if the message is published but the database rollbacks, workers process phantom events. The <strong>Transactional Outbox Pattern</strong> solves this by committing the business entities and an <code>OUTBOX_EVENT</code> inside the exact same local ACID database transaction.
          </div>

          <!-- VIEW TOGGLE CONTROLS (Interactive Outbox Flow vs CDC & Crash Recovery) -->
          <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" 
                class="outbox-tab-btn active px-3.5 py-1.5 rounded-lg text-[12px] font-bold bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.outbox-wrapper');
                  p.querySelector('.view-outbox-svg').classList.remove('hidden');
                  p.querySelector('.view-outbox-deepdive').classList.add('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">account_tree</span>
                <span>Interactive Outbox Flow</span>
              </button>
              <button type="button" 
                class="outbox-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.outbox-wrapper');
                  p.querySelector('.view-outbox-svg').classList.add('hidden');
                  p.querySelector('.view-outbox-deepdive').classList.remove('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">sync_alt</span>
                <span>CDC vs Polling &amp; Crash Recovery</span>
              </button>
            </div>
            <span class="text-[11px] font-mono text-amber-600 dark:text-amber-400 px-2 flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[14px]">verified_user</span>
              14 Nodes &bull; At-Least-Once Broker &bull; Zero Dual-Write Loss
            </span>
          </div>

          <!-- TAB 1: INTERACTIVE OUTBOX FLOWCHART (SVG) -->
          <div class="view-outbox-svg w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 860 760" class="w-full max-w-[840px] h-auto min-w-[700px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arr-ox" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748B" />
                </marker>
                <marker id="arr-ox-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
                </marker>
                <marker id="arr-ox-red" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F43F5E" />
                </marker>
                <marker id="arr-ox-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F59E0B" />
                </marker>
              </defs>

              <!-- ============================================================== -->
              <!-- STAGE 1: SYNCHRONOUS INGESTION & ACID COMMIT -->
              <!-- ============================================================== -->
              <rect x="30" y="20" width="800" height="240" rx="10" fill="#070E1E" stroke="#1E3A8A" stroke-width="1.2"/>
              <text x="45" y="42" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#60A5FA">STAGE 1: SYNCHRONOUS INGESTION &amp; ACID COMMIT</text>

              <!-- A: Notification API -->
              <rect x="330" y="52" width="200" height="42" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
              <text x="430" y="72" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#38BDF8" text-anchor="middle">Notification API</text>
              <text x="430" y="86" font-family="Geist, sans-serif" font-size="9" fill="#BAE6FD" text-anchor="middle">Accepts Request &amp; Computes Hash</text>

              <!-- A -> B -->
              <line x1="430" y1="94" x2="430" y2="114" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-ox)"/>

              <!-- ACID Container for B, C, D, E -->
              <rect x="50" y="116" width="760" height="60" rx="8" fill="#0B132B" stroke="#3B82F6" stroke-width="1.2" stroke-dasharray="4,4"/>
              <text x="65" y="131" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#93C5FD">SAME ACID DATABASE TRANSACTION</text>

              <!-- B: Begin Database Transaction -->
              <rect x="65" y="136" width="160" height="32" rx="5" fill="#1E293B" stroke="#475569" stroke-width="1"/>
              <text x="145" y="156" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#E2E8F0" text-anchor="middle">Begin DB Transaction</text>

              <!-- B -> C -->
              <line x1="225" y1="152" x2="252" y2="152" stroke="#64748B" stroke-width="1.4" marker-end="url(#arr-ox)"/>

              <!-- C: Insert Notification -->
              <rect x="254" y="136" width="160" height="32" rx="5" fill="#1E1B4B" stroke="#6366F1" stroke-width="1"/>
              <text x="334" y="156" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#A5B4FC" text-anchor="middle">Insert Notification</text>

              <!-- C -> D -->
              <line x1="414" y1="152" x2="441" y2="152" stroke="#64748B" stroke-width="1.4" marker-end="url(#arr-ox)"/>

              <!-- D: Insert Delivery Jobs -->
              <rect x="443" y="136" width="165" height="32" rx="5" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
              <text x="525" y="156" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Insert Delivery Jobs</text>

              <!-- D -> E -->
              <line x1="608" y1="152" x2="635" y2="152" stroke="#64748B" stroke-width="1.4" marker-end="url(#arr-ox)"/>

              <!-- E: Insert Outbox Event -->
              <rect x="637" y="136" width="160" height="32" rx="5" fill="#312E81" stroke="#818CF8" stroke-width="1"/>
              <text x="717" y="156" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#C7D2FE" text-anchor="middle">Insert Outbox Event</text>

              <!-- E -> F (Curved conduit down into Commit Diamond) -->
              <path d="M 717 168 L 717 218 L 522 218" fill="none" stroke="#64748B" stroke-width="1.6" marker-end="url(#arr-ox)"/>

              <!-- F: Commit succeeds? (Decision Diamond) -->
              <polygon points="430,194 520,218 430,242 340,218" fill="#1E293B" stroke="#818CF8" stroke-width="1.5"/>
              <text x="430" y="215" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#E0E7FF" text-anchor="middle">Commit</text>
              <text x="430" y="228" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#C7D2FE" text-anchor="middle">succeeds?</text>

              <!-- F -- No -->
              <line x1="340" y1="218" x2="242" y2="218" stroke="#F43F5E" stroke-width="1.6" marker-end="url(#arr-ox-red)"/>
              <text x="290" y="211" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#F43F5E" text-anchor="middle">No</text>

              <!-- G: Rollback all writes -->
              <rect x="75" y="198" width="165" height="40" rx="6" fill="#4C0519" stroke="#F43F5E" stroke-width="1.2"/>
              <text x="157" y="223" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FDA4AF" text-anchor="middle">Rollback all writes</text>

              <!-- F -- Yes -->
              <line x1="430" y1="242" x2="430" y2="308" stroke="#10B981" stroke-width="2" marker-end="url(#arr-ox-green)"/>
              <text x="445" y="275" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#34D399">Yes</text>

              <!-- ============================================================== -->
              <!-- STAGE 2: ASYNCHRONOUS PUBLISHING & RETRY LOOP -->
              <!-- ============================================================== -->
              <rect x="30" y="290" width="800" height="230" rx="10" fill="#070E1A" stroke="#B45309" stroke-width="1.2"/>
              <text x="45" y="312" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#FBBF24">STAGE 2: ASYNCHRONOUS PUBLISHING &amp; RETRY LOOP</text>

              <!-- H: Outbox Publisher reads pending event -->
              <rect x="300" y="316" width="260" height="42" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
              <text x="430" y="335" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Outbox Publisher reads pending event</text>
              <text x="430" y="349" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#94A3B8" text-anchor="middle">SELECT FOR UPDATE SKIP LOCKED</text>

              <!-- H -> I -->
              <line x1="430" y1="358" x2="430" y2="384" stroke="#F59E0B" stroke-width="1.8" marker-end="url(#arr-ox)"/>

              <!-- I: Publish to durable queue -->
              <rect x="310" y="386" width="240" height="40" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.5"/>
              <text x="430" y="406" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#FCD34D" text-anchor="middle">Publish to durable queue</text>
              <text x="430" y="419" font-family="Geist, sans-serif" font-size="8.5" fill="#FDE68A" text-anchor="middle">Kafka / SQS / RabbitMQ Channel Queue</text>

              <!-- I -> J -->
              <line x1="430" y1="426" x2="430" y2="448" stroke="#F59E0B" stroke-width="1.8" marker-end="url(#arr-ox)"/ >

              <!-- J: Queue accepted message? (Decision Diamond) -->
              <polygon points="430,450 530,474 430,498 330,474" fill="#3B1C05" stroke="#F59E0B" stroke-width="1.5"/>
              <text x="430" y="471" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FEF3C7" text-anchor="middle">Queue accepted</text>
              <text x="430" y="484" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#FDE68A" text-anchor="middle">message?</text>

              <!-- J -- No -->
              <line x1="330" y1="474" x2="238" y2="474" stroke="#EF4444" stroke-width="1.6" marker-end="url(#arr-ox-red)"/>
              <text x="280" y="467" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#EF4444" text-anchor="middle">No</text>

              <!-- K: Keep pending and retry -->
              <rect x="65" y="454" width="170" height="40" rx="6" fill="#450A0A" stroke="#EF4444" stroke-width="1.2"/>
              <text x="150" y="474" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FCA5A5" text-anchor="middle">Keep pending and retry</text>
              <text x="150" y="487" font-family="Geist, sans-serif" font-size="8.5" fill="#FECDD3" text-anchor="middle">Status remains PENDING</text>

              <!-- K -> H (Retry Loop back to Publisher) -->
              <path d="M 150 454 L 150 337 L 292 337" fill="none" stroke="#F59E0B" stroke-dasharray="4,4" stroke-width="1.8" marker-end="url(#arr-ox-amber)"/>
              <text x="160" y="395" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#FBBF24">Retry on next poll</text>

              <!-- J -- Yes -->
              <line x1="430" y1="498" x2="430" y2="560" stroke="#10B981" stroke-width="2" marker-end="url(#arr-ox-green)"/>
              <text x="445" y="529" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#34D399">Yes</text>

              <!-- ============================================================== -->
              <!-- STAGE 3: WORKER CONSUMPTION & IDEMPOTENT DELIVERY -->
              <!-- ============================================================== -->
              <rect x="30" y="540" width="800" height="200" rx="10" fill="#041E1C" stroke="#0D9488" stroke-width="1.2"/>
              <text x="45" y="562" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#2DD4BF">STAGE 3: WORKER CONSUMPTION &amp; IDEMPOTENT DELIVERY</text>

              <!-- L: Mark outbox event published -->
              <rect x="310" y="575" width="240" height="38" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
              <text x="430" y="594" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Mark outbox event published</text>
              <text x="430" y="606" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#A7F3D0" text-anchor="middle">status = 'PUBLISHED', published_at = NOW()</text>

              <!-- L -> M -->
              <line x1="430" y1="613" x2="430" y2="633" stroke="#10B981" stroke-width="1.8" marker-end="url(#arr-ox-green)"/>

              <!-- M: Worker consumes event -->
              <rect x="310" y="635" width="240" height="38" rx="8" fill="#042F2E" stroke="#14B8A6" stroke-width="1.5"/>
              <text x="430" y="654" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#5EEAD4" text-anchor="middle">Worker consumes event</text>
              <text x="430" y="666" font-family="Geist, sans-serif" font-size="8.5" fill="#99F6E4" text-anchor="middle">Channel Worker claims lease from queue</text>

              <!-- M -> N -->
              <line x1="430" y1="673" x2="430" y2="693" stroke="#10B981" stroke-width="1.8" marker-end="url(#arr-ox-green)"/>

              <!-- N: Idempotent processing -->
              <rect x="310" y="695" width="240" height="38" rx="8" fill="#064E3B" stroke="#059669" stroke-width="1.5"/>
              <text x="430" y="714" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Idempotent processing</text>
              <text x="430" y="726" font-family="Geist, sans-serif" font-size="8.5" fill="#A7F3D0" text-anchor="middle">Deduplicate via DB Job State &amp; Provider Key</text>
            </svg>
          </div>



          <!-- TAB 3: CDC VS POLLING & CRASH RECOVERY STRATEGY -->
          <div class="view-outbox-deepdive hidden flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px]">
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-rose-500 text-[16px]">dangerous</span>
                  1. The Dual-Write Vulnerability
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Dual writes fail because two separate network boundaries (RDBMS commit and Message Broker publish) cannot execute under a shared lock without heavy, latency-inducing 2PC protocols. If the broker is unreachable, writes are lost. If the DB commits then the process crashes, the event vanishes. Outbox solves this by delegating publication to an asynchronous daemon.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-amber-500 text-[16px]">bolt</span>
                  2. Publisher Crash &amp; At-Least-Once Delivery
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  If the publisher successfully sends an event to Kafka or SQS, but crashes <em>before</em> running <code>UPDATE OUTBOX_EVENT SET status = 'PUBLISHED'</code>, the row remains <code>PENDING</code>. Upon restart, it will republish the event. This produces duplicate queue messages, requiring downstream workers to implement idempotent processing.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-blue-500 text-[16px]">database</span>
                  3. Polling Publisher with SKIP LOCKED
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Workers poll using <code>SELECT * FROM OUTBOX_EVENT WHERE status = 'PENDING' ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 100</code>. This enables multiple publisher instances to run concurrently without lock contention or duplicate publishing under normal operation. Supported natively by PostgreSQL and MySQL 8+.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-teal-500 text-[16px]">stream</span>
                  4. Change Data Capture (CDC / Debezium)
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  At massive scale (10,000+ msg/sec), polling query overhead on the relational database becomes prohibitive. Change Data Capture connects directly to PostgreSQL's Write-Ahead Log (WAL) and streams row mutations directly into Kafka topics with zero query overhead and sub-10ms delivery latency.
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
              <strong class="text-[13.5px] font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[18px]">verified_user</span>
                End-to-End Delivery Contract
              </strong>
              <p class="text-[12.5px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                By combining the <strong>Transactional Outbox</strong> on the ingress boundary with <strong>Idempotent Processing</strong> on the worker boundary, the architecture guarantees that no notification is ever dropped due to transient infrastructure outages, while cleanly tolerating network redeliveries.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <strong class="text-[13.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="material-symbols-outlined text-blue-500 text-[18px]">rule</span>
                When to Pick Polling vs CDC in an Interview
              </strong>
              <p class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Start with a <strong>Polling Publisher using <code>SKIP LOCKED</code></strong> as the default because it requires no external operational dependencies. Mention <strong>CDC (Debezium + Kafka)</strong> when scaling to tens of thousands of notifications per second or when strict multi-region replication is required.
              </p>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 6: RETRY STRATEGY, BACKOFF MATH & DEAD-LETTER QUEUE
    // =========================================================================
    {
      badge: "FAULT TOLERANCE",
      badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
      title: "Retry Strategy, Backoff Math & Dead-Letter Queue (DLQ)",
      content: `
        <div class="retry-wrapper flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            Not all failures should be retried. Blindly retrying invalid destinations or credentials amplifies provider load and creates cascading storms. The system must classify errors, apply bounded exponential backoff with full jitter, enforce a strict retry budget, and quarantine unrecoverable jobs in a Dead-Letter Queue (DLQ).
          </p>

          <!-- VIEW TOGGLE CONTROLS (Interactive Retry Flow vs Failure Classification Strategy) -->
          <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" 
                class="retry-tab-btn active px-3.5 py-1.5 rounded-lg text-[12px] font-bold bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.retry-wrapper');
                  p.querySelector('.view-retry-svg').classList.remove('hidden');
                  p.querySelector('.view-retry-strategy').classList.add('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">replay</span>
                <span>Interactive Retry Flow</span>
              </button>
              <button type="button" 
                class="retry-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.retry-wrapper');
                  p.querySelector('.view-retry-svg').classList.add('hidden');
                  p.querySelector('.view-retry-strategy').classList.remove('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">table_chart</span>
                <span>Failure Matrix &amp; Backoff Math</span>
              </button>
            </div>
            <span class="text-[11px] font-mono text-rose-600 dark:text-rose-400 px-2 flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[14px]">shield</span>
              13 Nodes &bull; Jittered Backoff &bull; Audited DLQ Redrive
            </span>
          </div>

          <!-- TAB 1: INTERACTIVE RETRY FLOW (SVG) -->
          <div class="view-retry-svg w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 970 620" class="w-full max-w-[940px] h-auto min-w-[760px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arr-rf-slate" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748B" />
                </marker>
                <marker id="arr-rf-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
                </marker>
                <marker id="arr-rf-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F59E0B" />
                </marker>
                <marker id="arr-rf-red" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F43F5E" />
                </marker>
                <marker id="arr-rf-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" />
                </marker>
              </defs>

              <!-- ============================================================== -->
              <!-- INGRESS SPINE: A -> B -> C -> D -->
              <!-- ============================================================== -->

              <!-- A: Worker receives delivery job -->
              <rect x="370" y="25" width="240" height="42" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
              <text x="490" y="44" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Worker receives delivery job</text>
              <text x="490" y="58" font-family="Geist, sans-serif" font-size="8.5" fill="#94A3B8" text-anchor="middle">De-queued from Channel Queue</text>

              <!-- A -> B -->
              <line x1="490" y1="67" x2="490" y2="83" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-rf-slate)"/>

              <!-- B: Check status and acquire lease -->
              <rect x="360" y="85" width="260" height="42" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
              <text x="490" y="104" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#38BDF8" text-anchor="middle">Check status and acquire lease</text>
              <text x="490" y="118" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#BAE6FD" text-anchor="middle">SET lease_until = NOW() + 30s</text>

              <!-- B -> C -->
              <line x1="490" y1="127" x2="490" y2="143" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-rf-slate)"/>

              <!-- C: Call provider -->
              <rect x="380" y="145" width="220" height="42" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5"/>
              <text x="490" y="164" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#A5B4FC" text-anchor="middle">Call provider</text>
              <text x="490" y="178" font-family="Geist, sans-serif" font-size="8.5" fill="#C7D2FE" text-anchor="middle">Invoke Adapter + Idempotency Key</text>

              <!-- C -> D -->
              <line x1="490" y1="187" x2="490" y2="208" stroke="#64748B" stroke-width="1.8" marker-end="url(#arr-rf-slate)"/>

              <!-- D: Result? (Decision Diamond) -->
              <polygon points="490,210 560,235 490,260 420,235" fill="#312E81" stroke="#818CF8" stroke-width="1.5"/>
              <text x="490" y="239" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E0E7FF" text-anchor="middle">Result?</text>

              <!-- ============================================================== -->
              <!-- BRANCH 1: ACCEPTED (Left) -->
              <!-- ============================================================== -->
              <line x1="420" y1="235" x2="238" y2="235" stroke="#10B981" stroke-width="1.8" marker-end="url(#arr-rf-green)"/>
              <text x="325" y="227" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#34D399" text-anchor="middle">Accepted</text>

              <!-- E: Record provider acceptance -->
              <rect x="35" y="213" width="200" height="44" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
              <text x="135" y="232" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Record provider acceptance</text>
              <text x="135" y="246" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#A7F3D0" text-anchor="middle">status = PROVIDER_ACCEPTED</text>

              <!-- ============================================================== -->
              <!-- BRANCH 2: PERMANENT FAILURE (Right) -->
              <!-- ============================================================== -->
              <line x1="560" y1="235" x2="742" y2="235" stroke="#F43F5E" stroke-width="1.8" marker-end="url(#arr-rf-red)"/>
              <text x="650" y="227" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#F43F5E" text-anchor="middle">Permanent failure</text>

              <!-- G: Mark failed -->
              <rect x="745" y="213" width="195" height="44" rx="8" fill="#4C0519" stroke="#F43F5E" stroke-width="1.5"/>
              <text x="842" y="232" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FDA4AF" text-anchor="middle">Mark failed</text>
              <text x="842" y="246" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#FECDD3" text-anchor="middle">status = FAILED (No Retry)</text>

              <!-- ============================================================== -->
              <!-- BRANCH 3: TRANSIENT FAILURE -> F -> H (Center Down) -->
              <!-- ============================================================== -->
              <line x1="490" y1="260" x2="490" y2="303" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-rf-amber)"/>
              <text x="548" y="284" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#FBBF24">Transient failure</text>

              <!-- F: Compute backoff and jitter -->
              <rect x="360" y="305" width="260" height="42" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.5"/>
              <text x="490" y="323" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FCD34D" text-anchor="middle">Compute backoff and jitter</text>
              <text x="490" y="337" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#FDE68A" text-anchor="middle">d_n = min(d_max, d_0 * 2^n) + J</text>

              <!-- F -> H -->
              <line x1="490" y1="347" x2="490" y2="378" stroke="#F59E0B" stroke-width="1.8" marker-end="url(#arr-rf-amber)"/>

              <!-- H: Retry budget available? (Decision Diamond) -->
              <polygon points="490,380 590,408 490,436 390,408" fill="#451A03" stroke="#F59E0B" stroke-width="1.5"/>
              <text x="490" y="405" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FEF3C7" text-anchor="middle">Retry budget</text>
              <text x="490" y="418" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#FDE68A" text-anchor="middle">available?</text>

              <!-- ============================================================== -->
              <!-- H -- Yes: I -> J -> Loop back to A (Left) -->
              <!-- ============================================================== -->
              <line x1="390" y1="408" x2="282" y2="408" stroke="#10B981" stroke-width="1.8" marker-end="url(#arr-rf-green)"/>
              <text x="335" y="400" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#34D399" text-anchor="middle">Yes</text>

              <!-- I: Set next_attempt_at -->
              <rect x="85" y="388" width="195" height="40" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5"/>
              <text x="182" y="406" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#C7D2FE" text-anchor="middle">Set next_attempt_at</text>
              <text x="182" y="419" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#A5B4FC" text-anchor="middle">next_attempt_at = NOW() + d_n</text>

              <!-- I -> J -->
              <line x1="182" y1="428" x2="182" y2="466" stroke="#6366F1" stroke-width="1.8" marker-end="url(#arr-rf-cyan)"/>

              <!-- J: Requeue or let visibility timeout expire -->
              <rect x="40" y="468" width="285" height="44" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
              <text x="182" y="487" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">Requeue or let visibility timeout expire</text>
              <text x="182" y="501" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#94A3B8" text-anchor="middle">status = RETRY_SCHEDULED</text>

              <!-- J -> A (Loop back up to Worker) -->
              <path d="M 40 490 L 18 490 L 18 46 L 362 46" fill="none" stroke="#38BDF8" stroke-dasharray="4,4" stroke-width="2" marker-end="url(#arr-rf-cyan)"/>
              <text x="28" y="270" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#38BDF8" transform="rotate(-90 28,270)">Retry Loop: Visibility lease expires or delay queue triggers</text>

              <!-- ============================================================== -->
              <!-- H -- No: K -> L -> M (Right / DLQ Pipeline) -->
              <!-- ============================================================== -->
              <line x1="590" y1="408" x2="695" y2="408" stroke="#F43F5E" stroke-width="1.8" marker-end="url(#arr-rf-red)"/>
              <text x="645" y="400" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#FDA4AF" text-anchor="middle">No</text>

              <!-- K: Move to DLQ -->
              <rect x="700" y="388" width="200" height="40" rx="8" fill="#4C0519" stroke="#F43F5E" stroke-width="1.5"/>
              <text x="800" y="406" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FDA4AF" text-anchor="middle">Move to DLQ</text>
              <text x="800" y="419" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#FECDD3" text-anchor="middle">status = DEAD_LETTERED</text>

              <!-- K -> L -->
              <line x1="800" y1="428" x2="800" y2="466" stroke="#F43F5E" stroke-width="1.8" marker-end="url(#arr-rf-red)"/>

              <!-- L: Alert and inspect -->
              <rect x="700" y="468" width="200" height="40" rx="8" fill="#450A0A" stroke="#EF4444" stroke-width="1.5"/>
              <text x="800" y="487" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#FCA5A5" text-anchor="middle">Alert and inspect</text>
              <text x="800" y="501" font-family="Geist, sans-serif" font-size="8.5" fill="#FECDD3" text-anchor="middle">Trigger PagerDuty &amp; Log Metric</text>

              <!-- L -> M -->
              <line x1="800" y1="508" x2="800" y2="546" stroke="#EF4444" stroke-width="1.8" marker-end="url(#arr-rf-red)"/>

              <!-- M: Fix cause and redrive safely -->
              <rect x="675" y="548" width="250" height="44" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
              <text x="800" y="567" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Fix cause and redrive safely</text>
              <text x="800" y="581" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#A7F3D0" text-anchor="middle">Audited Redrive Pipeline (Deduplicated)</text>
            </svg>
          </div>



          <!-- TAB 3: FAILURE CLASSIFICATION & BACKOFF MATH -->
          <div class="view-retry-strategy hidden flex flex-col gap-5">
            <!-- Failure Classification Table -->
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
              <table class="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                    <th class="py-3 px-4">Failure Class</th>
                    <th class="py-3 px-4">Concrete Example</th>
                    <th class="py-3 px-4">Engineered Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-bold text-amber-600 dark:text-amber-400">Transient</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Network connection timeout, socket reset, temporary provider 503</td>
                    <td class="py-2.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Retry with exponential backoff &amp; jitter</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-bold text-purple-600 dark:text-purple-400">Rate Limit</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Provider HTTP 429 Too Many Requests</td>
                    <td class="py-2.5 px-4 font-semibold text-purple-600 dark:text-purple-300">Respect <code>Retry-After</code> header if supplied</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Permanent</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Malformed email format, invalid phone number length, unallocated token</td>
                    <td class="py-2.5 px-4 font-semibold text-rose-600 dark:text-rose-400">Fail immediately without automatic retry</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-bold text-slate-700 dark:text-slate-300">Auth / Config</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Expired provider API token, invalid signing key</td>
                    <td class="py-2.5 px-4 font-semibold text-amber-700 dark:text-amber-300">Pause channel sends; raise high-priority PagerDuty alert</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-bold text-blue-600 dark:text-blue-400">Ambiguous Outcome</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">HTTP timeout waiting for response after socket write completed</td>
                    <td class="py-2.5 px-4 font-semibold text-blue-600 dark:text-blue-400">Query provider status; retry ONLY with stable idempotency key</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Exponential Backoff Math Box -->
            <div class="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 flex flex-col gap-2">
              <span class="text-[12px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Exponential Backoff &amp; Full Jitter Formula</span>
              <div class="p-3 rounded-lg bg-white dark:bg-slate-900 font-mono text-[13.5px] text-indigo-950 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900/40">
                d_n = min(d_max, d_0 * 2^n) + random_jitter(0, J)
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px] text-slate-600 dark:text-slate-300 pt-1">
                <div>&bull; <strong>d_0:</strong> Initial delay (e.g. 1 sec)</div>
                <div>&bull; <strong>n:</strong> Retry attempt number (0, 1, 2...)</div>
                <div>&bull; <strong>d_max:</strong> Maximum cap (e.g. 60 sec)</div>
              </div>
              <p class="text-[11.5px] text-slate-500 dark:text-slate-400">
                Random jitter is mandatory to prevent thousands of retrying workers from hitting the external provider in synchrony (the "thundering herd" problem).
              </p>
            </div>

            <!-- Ambiguous Outcome & DLQ Management -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px]">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
                <strong class="text-[13.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-purple-500 text-[18px]">help</span>
                  The Hardest Failure: Provider Timeouts
                </strong>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  If the socket times out waiting for an SMS response, the worker cannot tell whether the SMS was sent or dropped. Blindly retrying creates duplicate customer notifications and costs.
                  <strong>Mitigations:</strong> Persist stable logical delivery IDs across retries, use provider idempotency keys (supported by Stripe, Twilio), and query provider status before retrying.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
                <strong class="text-[13.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-rose-500 text-[18px]">emergency</span>
                  Dead-Letter Queue Governance &amp; Safe Redrive
                </strong>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  A DLQ must never become an unmonitored graveyard. DLQ records retain the full execution history and error payloads. Once upstream provider outages or invalid credentials are fixed, engineers invoke an audited <strong>redrive pipeline</strong> with deduplication to prevent duplicate sends.
                </p>
              </div>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 7: USER PREFERENCES, CONSENT & SCHEDULING
    // =========================================================================
    {
      badge: "COMPLIANCE & TIMING",
      badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
      title: "User Preferences, Consent & Scheduled Notifications",
      content: `
        <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          
          <!-- Category vs Channel Matrix -->
          <div class="flex flex-col gap-2">
            <span class="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px]">tune</span>
              Category vs. Channel Preference Matrix
            </span>
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
              <table class="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                    <th class="py-3 px-4">Notification Category</th>
                    <th class="py-3 px-4">Email</th>
                    <th class="py-3 px-4">SMS</th>
                    <th class="py-3 px-4">Push</th>
                    <th class="py-3 px-4">Enforcement Policy</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Security Alert (OTP, Login)</td>
                    <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Mandatory</td>
                    <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Mandatory</td>
                    <td class="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Mandatory</td>
                    <td class="py-2.5 px-4 text-slate-500">Cannot be disabled by user; critical for account safety</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Order Update (Tracking)</td>
                    <td class="py-2.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Enabled</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Optional</td>
                    <td class="py-2.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Enabled</td>
                    <td class="py-2.5 px-4 text-slate-500">Transactional; default on, configurable channels</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Marketing &amp; Promotions</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Optional (Opt-In)</td>
                    <td class="py-2.5 px-4 text-rose-500 font-bold">Disabled</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Optional (Opt-In)</td>
                    <td class="py-2.5 px-4 text-slate-500">Strict legal opt-in required (CAN-SPAM, GDPR)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Double Checkpoint Strategy & Scheduling -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <strong class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                The Double Checkpoint Architecture
              </strong>
              <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                Preferences change over time. If a user unsubscribes from marketing emails while an email campaign is sitting in the message queue, sending the email violates privacy regulations.
              </p>
              <ul class="text-[12px] space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                <li><strong>Checkpoint 1 (At Acceptance):</strong> Validates category authorization and drops ineligible channels immediately to save queue space.</li>
                <li><strong>Checkpoint 2 (Immediately Before Send):</strong> Worker performs a fast Redis/DB read. If the user opted out while the job was queued, suppress delivery.</li>
              </ul>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <strong class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="material-symbols-outlined text-cyan-500 text-[18px]">schedule</span>
                Scheduled Notification Architecture
              </strong>
              <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                <strong>Never keep a worker thread sleeping for hours</strong> until a notification's due time. Scheduled work must be durably persisted:
              </p>
              <ul class="text-[12px] space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                <li>Store <code>scheduled_at</code> in UTC in the <code>NOTIFICATION</code> table.</li>
                <li><strong>Option A:</strong> Polling scheduler querying <code>WHERE status = 'SCHEDULED' AND scheduled_at &lt;= NOW()</code> with index <code>(status, scheduled_at)</code>.</li>
                <li><strong>Option B:</strong> Delayed-message queues (e.g. SQS message timer up to 15 min, or RabbitMQ delayed exchange).</li>
              </ul>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 8: SCALING THE SYSTEM & QUEUE PARTITIONING
    // =========================================================================
    {
      badge: "SCALING & MATH",
      badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
      title: "Scaling the System, Queue Partitioning & Capacity Estimation",
      content: `
        <div class="queue-wrapper flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            A single shared FIFO queue is a fatal anti-pattern in multi-channel notification systems. Because each delivery channel operates under radically different throughput constraints, provider rate limits, and latency targets, isolating traffic into <strong>dedicated per-channel queues</strong> is mandatory.
          </p>

          <!-- VIEW TOGGLE CONTROLS (Interactive Queue Topology vs Why Separate Queues) -->
          <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" 
                class="queue-tab-btn active px-3.5 py-1.5 rounded-lg text-[12px] font-bold bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.queue-wrapper');
                  p.querySelector('.view-queue-svg').classList.remove('hidden');
                  p.querySelector('.view-queue-reasons').classList.add('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">alt_route</span>
                <span>Interactive Queue Topology</span>
              </button>
              <button type="button" 
                class="queue-tab-btn px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                onclick="
                  const p = this.closest('.queue-wrapper');
                  p.querySelector('.view-queue-svg').classList.add('hidden');
                  p.querySelector('.view-queue-reasons').classList.remove('hidden');
                  this.parentElement.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  });
                  this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                  this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                ">
                <span class="material-symbols-outlined text-[16px]">lightbulb</span>
                <span>Why Separate Queues? (4 Pillars &amp; Math)</span>
              </button>
            </div>
            <span class="text-[11px] font-mono text-sky-600 dark:text-sky-400 px-2 flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[14px]">tune</span>
              4 Isolated Channels &bull; Zero Head-of-Line Blocking
            </span>
          </div>

          <!-- TAB 1: INTERACTIVE CHANNEL QUEUE TOPOLOGY (SVG) -->
          <div class="view-queue-svg w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 920 280" class="w-full max-w-[880px] h-auto min-w-[720px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="sc-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" />
                </marker>
                <marker id="sc-arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#34D399" />
                </marker>
                <marker id="sc-arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#818CF8" />
                </marker>
                <marker id="sc-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#F59E0B" />
                </marker>
                <marker id="sc-arr-slate" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748B" />
                </marker>
              </defs>

              <!-- Outbox Publisher (A) -->
              <rect x="20" y="85" width="160" height="90" rx="10" fill="#1E1B4B" stroke="#6366F1" stroke-width="2"/>
              <text x="100" y="125" font-family="Geist, sans-serif" font-size="12" font-weight="800" fill="#C7D2FE" text-anchor="middle">Outbox Publisher</text>
              <text x="100" y="142" font-family="Geist, sans-serif" font-size="9.5" fill="#A5B4FC" text-anchor="middle">Routes by Channel</text>

              <!-- ============================================================== -->
              <!-- LANE 1: EMAIL (A -> B -> F -> J) -->
              <!-- ============================================================== -->
              <line x1="180" y1="105" x2="228" y2="42" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#sc-arr)"/>

              <!-- B: Email Queue (Subroutine [[...]] Shape) -->
              <rect x="230" y="20" width="150" height="44" rx="6" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
              <line x1="242" y1="20" x2="242" y2="64" stroke="#0284C7" stroke-width="1.2"/>
              <line x1="368" y1="20" x2="368" y2="64" stroke="#0284C7" stroke-width="1.2"/>
              <text x="305" y="47" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#38BDF8" text-anchor="middle">Email Queue</text>

              <!-- B -> F -->
              <line x1="380" y1="42" x2="438" y2="42" stroke="#38BDF8" stroke-width="1.8" marker-end="url(#sc-arr)"/>

              <!-- F: Email Worker Pool -->
              <rect x="440" y="20" width="180" height="44" rx="8" fill="#1E293B" stroke="#0284C7" stroke-width="1.5"/>
              <text x="530" y="47" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Email Worker Pool</text>

              <!-- F -> J -->
              <line x1="620" y1="42" x2="678" y2="42" stroke="#64748B" stroke-width="1.6" marker-end="url(#sc-arr-slate)"/>

              <!-- J: Email Provider -->
              <rect x="680" y="20" width="180" height="44" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="1.2"/>
              <text x="770" y="47" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#38BDF8" text-anchor="middle">Email Provider</text>

              <!-- ============================================================== -->
              <!-- LANE 2: SMS (A -> C -> G -> K) -->
              <!-- ============================================================== -->
              <line x1="180" y1="120" x2="228" y2="107" stroke="#34D399" stroke-width="1.8" marker-end="url(#sc-arr-green)"/>

              <!-- C: SMS Queue (Subroutine [[...]] Shape) -->
              <rect x="230" y="85" width="150" height="44" rx="6" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
              <line x1="242" y1="85" x2="242" y2="129" stroke="#10B981" stroke-width="1.2"/>
              <line x1="368" y1="85" x2="368" y2="129" stroke="#10B981" stroke-width="1.2"/>
              <text x="305" y="112" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#6EE7B7" text-anchor="middle">SMS Queue</text>

              <!-- C -> G -->
              <line x1="380" y1="107" x2="438" y2="107" stroke="#34D399" stroke-width="1.8" marker-end="url(#sc-arr-green)"/>

              <!-- G: SMS Worker Pool -->
              <rect x="440" y="85" width="180" height="44" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
              <text x="530" y="112" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">SMS Worker Pool</text>

              <!-- G -> K -->
              <line x1="620" y1="107" x2="678" y2="107" stroke="#64748B" stroke-width="1.6" marker-end="url(#sc-arr-slate)"/>

              <!-- K: SMS Provider -->
              <rect x="680" y="85" width="180" height="44" rx="8" fill="#0F172A" stroke="#34D399" stroke-width="1.2"/>
              <text x="770" y="112" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">SMS Provider</text>

              <!-- ============================================================== -->
              <!-- LANE 3: PUSH (A -> D -> H -> L) -->
              <!-- ============================================================== -->
              <line x1="180" y1="140" x2="228" y2="172" stroke="#818CF8" stroke-width="1.8" marker-end="url(#sc-arr-purple)"/>

              <!-- D: Push Queue (Subroutine [[...]] Shape) -->
              <rect x="230" y="150" width="150" height="44" rx="6" fill="#312E81" stroke="#818CF8" stroke-width="1.5"/>
              <line x1="242" y1="150" x2="242" y2="194" stroke="#818CF8" stroke-width="1.2"/>
              <line x1="368" y1="150" x2="368" y2="194" stroke="#818CF8" stroke-width="1.2"/>
              <text x="305" y="177" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#C7D2FE" text-anchor="middle">Push Queue</text>

              <!-- D -> H -->
              <line x1="380" y1="172" x2="438" y2="172" stroke="#818CF8" stroke-width="1.8" marker-end="url(#sc-arr-purple)"/>

              <!-- H: Push Worker Pool -->
              <rect x="440" y="150" width="180" height="44" rx="8" fill="#1E293B" stroke="#818CF8" stroke-width="1.5"/>
              <text x="530" y="177" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">Push Worker Pool</text>

              <!-- H -> L -->
              <line x1="620" y1="172" x2="678" y2="172" stroke="#64748B" stroke-width="1.6" marker-end="url(#sc-arr-slate)"/>

              <!-- L: Push Provider -->
              <rect x="680" y="150" width="180" height="44" rx="8" fill="#0F172A" stroke="#818CF8" stroke-width="1.2"/>
              <text x="770" y="177" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#818CF8" text-anchor="middle">Push Provider</text>

              <!-- ============================================================== -->
              <!-- LANE 4: IN-APP (A -> E -> I -> M) -->
              <!-- ============================================================== -->
              <line x1="180" y1="155" x2="228" y2="237" stroke="#F59E0B" stroke-width="1.8" marker-end="url(#sc-arr-amber)"/>

              <!-- E: In-App Queue (Subroutine [[...]] Shape) -->
              <rect x="230" y="215" width="150" height="44" rx="6" fill="#451A03" stroke="#D97706" stroke-width="1.5"/>
              <line x1="242" y1="215" x2="242" y2="259" stroke="#D97706" stroke-width="1.2"/>
              <line x1="368" y1="215" x2="368" y2="259" stroke="#D97706" stroke-width="1.2"/>
              <text x="305" y="242" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#FCD34D" text-anchor="middle">In-App Queue</text>

              <!-- E -> I -->
              <line x1="380" y1="237" x2="438" y2="237" stroke="#F59E0B" stroke-width="1.8" marker-end="url(#sc-arr-amber)"/>

              <!-- I: In-App Worker Pool -->
              <rect x="440" y="215" width="180" height="44" rx="8" fill="#1E293B" stroke="#D97706" stroke-width="1.5"/>
              <text x="530" y="242" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" text-anchor="middle">In-App Worker Pool</text>

              <!-- I -> M -->
              <line x1="620" y1="237" x2="678" y2="237" stroke="#64748B" stroke-width="1.6" marker-end="url(#sc-arr-slate)"/>

              <!-- M: In-App Store -->
              <rect x="680" y="215" width="180" height="44" rx="8" fill="#0F172A" stroke="#F59E0B" stroke-width="1.2"/>
              <text x="770" y="242" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#F59E0B" text-anchor="middle">In-App Store</text>
            </svg>
          </div>



          <!-- TAB 3: WHY SEPARATE QUEUES (4 PILLARS & CAPACITY MATH) -->
          <div class="view-queue-reasons hidden flex flex-col gap-5">
            <!-- 4 Architectural Pillars Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px]">
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-rose-500 text-[16px]">block</span>
                  1. Head-of-Line (HoL) Blocking Isolation
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  If an SMS carrier experiences an outage or throttles sends to 100 SMS/s, workers must back off. In a shared queue, this would stall critical mobile push alerts (e.g. ride-share arrival, security OTPs) behind thousands of slow SMS jobs. Dedicated queues prevent one degraded provider from blocking healthy channels.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-purple-500 text-[16px]">speed</span>
                  2. Heterogeneous Throughput &amp; Rate Limits
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Channels have wildly different throughput physics. Apple APNs and Firebase FCM easily handle 20,000+ msg/sec. Email providers (SES) sustain 500–2,000/sec. SMS gateways (Twilio) are constrained by carrier short-codes to ~100/sec. Dedicated queues allow tuning worker concurrency and token bucket limits per channel.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-sky-500 text-[16px]">auto_mode</span>
                  3. Independent Autoscaling
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Batch marketing emails generate massive predictable surges at 9:00 AM, while push notifications spike unpredictably on breaking news or app engagement. Separate queues allow Kubernetes HPA or AWS KEDA to scale the Email Worker Pool dynamically without spinning up redundant SMS or Push workers.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[13px]">
                  <span class="material-symbols-outlined text-amber-500 text-[16px]">security</span>
                  4. Blast Radius &amp; Failure Containment
                </span>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                  If an APNs push certificate expires or an email provider has DNS errors, failure is isolated strictly to that channel's queue. Unaffected channels continue processing at 100% capacity. Dead-Letter Queues (DLQ) are partitioned per channel to simplify operator triage and replay.
                </p>
              </div>
            </div>

            <!-- Capacity Estimation Math Card -->
            <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-3">
              <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-indigo-500 text-[18px]">calculate</span>
                Production Capacity Estimation Math
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div class="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
                  <span class="font-bold text-slate-900 dark:text-white">API Ingestion Rate</span>
                  <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                    Assume the system processes <strong>10 million logical notifications per day</strong>:
                  </p>
                  <div class="font-mono text-[12.5px] text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                    10,000,000 / 86,400 sec &approx; 116 req/sec (Average)
                  </div>
                  <div class="font-mono text-[12.5px] text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                    116 * 10x &approx; 1,160 req/sec (Illustrative Peak)
                  </div>
                </div>

                <div class="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
                  <span class="font-bold text-slate-900 dark:text-white">Channel Fan-Out &amp; Delivery Jobs</span>
                  <p class="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed">
                    If each notification fans out to an average of <strong>1.5 channels</strong> (e.g. Email + Push):
                  </p>
                  <div class="font-mono text-[12.5px] text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                    116 * 1.5 &approx; 174 delivery jobs/sec (Average)
                  </div>
                  <div class="font-mono text-[12.5px] text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                    1,160 * 1.5 &approx; 1,740 jobs/sec (Peak Load)
                  </div>
                </div>
              </div>
              <p class="text-[12px] text-slate-500 italic">
                * Note: Capacity planning must size worker thread pools against external provider rate limits (e.g., Twilio 100 SMS/s per short-code, SES 500 emails/s) to prevent throttling errors.
              </p>
            </div>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 9: RELIABILITY, SECURITY & OBSERVABILITY
    // =========================================================================
    {
      badge: "OPS & METRICS",
      badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
      title: "Reliability, Security & Observability Metrics",
      content: `
        <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Reliability Checklist -->
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
              <strong class="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                Reliability Checklist
              </strong>
              <ul class="text-[12.5px] space-y-1.5 text-slate-600 dark:text-slate-300">
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Persist in DB before acknowledging API acceptance with 202.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Use Transactional Outbox to prevent database-to-queue event loss.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Design workers to be strictly idempotent to tolerate redeliveries.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Maintain stable logical delivery IDs across all provider attempts.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Use worker leases / visibility timeouts with exponential backoff &amp; jitter.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Deduplicate asynchronous provider callbacks using unique event IDs.</li>
              </ul>
            </div>

            <!-- Security Checklist -->
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] flex flex-col gap-2">
              <strong class="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="material-symbols-outlined text-rose-500 text-[18px]">security</span>
                Security &amp; Privacy Checklist
              </strong>
              <ul class="text-[12.5px] space-y-1.5 text-slate-600 dark:text-slate-300">
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Authenticate upstream services with mTLS / OAuth2 service tokens.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Store third-party API credentials in AWS Secrets Manager / Vault.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Verify cryptographic signatures (HMAC-SHA256) on incoming webhooks.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Strictly redact emails, phone numbers, and message bodies from logs.</li>
                <li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">&#10003;</span>Enforce data retention policies: archive attempts after 30–90 days.</li>
              </ul>
            </div>
          </div>

          <!-- Observability Metrics Table -->
          <div class="flex flex-col gap-2">
            <span class="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-blue-500 text-[18px]">monitoring</span>
              Observability Metrics &amp; Diagnostic Telemetry
            </span>
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
              <table class="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                    <th class="py-3 px-4">Core Metric</th>
                    <th class="py-3 px-4">Operational Insight (What It Signals)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">api_acceptance_latency</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">How quickly incoming notification requests are committed to DB (Target: &lt; 50ms)</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">outbox_oldest_event_age</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Whether the Outbox Publisher is falling behind or crashing</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">queue_depth &amp; oldest_message_age</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Indicates worker pool saturation, provider throttling, or delivery delays</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">delivery_success_rate</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Provider acceptance vs confirmed receipt (tracked and reported separately)</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">dlq_count_and_growth_rate</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Volume of permanently poisoned or exhausted messages requiring operational intervention</td>
                  </tr>
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="py-2.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">suppression_rate</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">How many jobs were safely blocked by user opt-out or regulatory consent rules</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-[12px] text-slate-500 italic mt-1">
              * Propagate an opaque <code>correlation_id</code> across API, Outbox, Queue, Worker, Provider HTTP headers, and Webhook callback for seamless OpenTelemetry end-to-end tracing.
            </p>
          </div>

        </div>
      `
    },

    // =========================================================================
    // SECTION 10: TECHNOLOGY CHOICES
    // =========================================================================
    {
      badge: "STACK",
      badgeColor: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
      title: "Technology Stack & Implementation Choices",
      content: `
        <div class="flex flex-col gap-4 text-[#334155] dark:text-slate-300">
          <p class="text-[13.5px] leading-relaxed">
            The architecture is technology-agnostic. A production-ready, enterprise-grade deployment can be implemented with the following proven stack:
          </p>

          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
            <table class="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                  <th class="py-3 px-4">Layer</th>
                  <th class="py-3 px-4">Recommended Technology</th>
                  <th class="py-3 px-4">Architecture Rationale</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">API Tier</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">Java (Spring Boot) / Go</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">High concurrency, strong typing, robust connection pooling &amp; validation</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Relational DB</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">PostgreSQL (Amazon Aurora)</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Atomic transactions across notification and outbox events with <code>SKIP LOCKED</code></td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Message Queue</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-amber-600 dark:text-amber-400">Amazon SQS / Apache Kafka / RabbitMQ</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Durable queueing with visibility leases; independent scaling per channel</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Outbox Engine</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-purple-600 dark:text-purple-400">Polling Worker or Debezium CDC</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Reliable event publish guaranteed; start with polling, upgrade to CDC at scale</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Cache Layer</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-rose-600 dark:text-rose-400">Redis (ElastiCache)</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Sub-millisecond caching of hot user preferences, compiled templates, and device tokens</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Email Provider</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-teal-600 dark:text-teal-400">Amazon SES / SendGrid</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">High deliverability, IP warming pools, and SNS delivery/bounce webhooks</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">SMS Gateways</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">Twilio / Infobip / Sinch</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Global telecommunication routing with delivery receipt callbacks</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Push Gateways</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-cyan-600 dark:text-cyan-400">Apple APNs &amp; Google FCM</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Native mobile OS push delivery with token validation feedback</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Observability</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-violet-600 dark:text-violet-400">OpenTelemetry + Prometheus + Grafana</td>
                  <td class="py-2.5 px-4 text-slate-600 dark:text-slate-300">Distributed trace context propagation across asynchronous queues and webhooks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `
    }
  ];
}

// =========================================================================
// SECTION 17: FINAL ARCHITECTURE SUMMARY & CORE LESSONS (Rendered Post Follow-Ups)
// =========================================================================
export function getNotificationSystemFinalSummarySection() {
  return [
    {
      badge: "SUMMARY BLUEPRINT",
      badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
      title: "Final Architecture Summary & Core Engineering Lessons",
      content: `
        <div class="flex flex-col gap-6 text-[#334155] dark:text-slate-300">
          
          <!-- Summary Architecture SVG Diagram -->
          <div class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#070B14] p-4 sm:p-6 shadow-xs flex justify-center">
            <svg viewBox="0 0 920 220" class="w-full max-w-[880px] h-auto min-w-[720px] select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="sum-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38BDF8" />
                </marker>
              </defs>

              <!-- Node 1: Source Service -->
              <rect x="15" y="80" width="105" height="50" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1.2"/>
              <text x="67" y="102" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#E2E8F0" text-anchor="middle">Source Service</text>
              <text x="67" y="118" font-family="Geist, sans-serif" font-size="8.5" fill="#94A3B8" text-anchor="middle">Order / Payment</text>

              <!-- Arrow 1 -> 2 -->
              <line x1="120" y1="105" x2="148" y2="105" stroke="#38BDF8" stroke-width="1.6" marker-end="url(#sum-arr)"/>

              <!-- Node 2: Notification API -->
              <rect x="150" y="80" width="115" height="50" rx="8" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
              <text x="207" y="102" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#38BDF8" text-anchor="middle">Notification API</text>
              <text x="207" y="118" font-family="Geist, sans-serif" font-size="8.5" fill="#BAE6FD" text-anchor="middle">Auth &amp; Idempotency</text>

              <!-- Arrow 2 -> 3 -->
              <line x1="265" y1="105" x2="293" y2="105" stroke="#38BDF8" stroke-width="1.6" marker-end="url(#sum-arr)"/>

              <!-- Node 3: Atomic DB Tx -->
              <rect x="295" y="70" width="135" height="70" rx="8" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5"/>
              <text x="362" y="93" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#A5B4FC" text-anchor="middle">Atomic DB Tx</text>
              <text x="362" y="108" font-family="Geist, sans-serif" font-size="8.5" fill="#C7D2FE" text-anchor="middle">Notification + Jobs</text>
              <text x="362" y="123" font-family="Geist, sans-serif" font-size="8.5" fill="#38BDF8" text-anchor="middle">+ Outbox Event</text>

              <!-- Arrow 3 -> 4 -->
              <line x1="430" y1="105" x2="458" y2="105" stroke="#38BDF8" stroke-width="1.6" marker-end="url(#sum-arr)"/>

              <!-- Node 4: Outbox Pub -->
              <rect x="460" y="80" width="105" height="50" rx="8" fill="#312E81" stroke="#818CF8" stroke-width="1.5"/>
              <text x="512" y="102" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#C7D2FE" text-anchor="middle">Outbox Pub</text>
              <text x="512" y="118" font-family="Geist, sans-serif" font-size="8.5" fill="#A5B4FC" text-anchor="middle">Polling / CDC</text>

              <!-- Arrow 4 -> 5 -->
              <line x1="565" y1="105" x2="593" y2="105" stroke="#38BDF8" stroke-width="1.6" marker-end="url(#sum-arr)"/>

              <!-- Node 5: Durable Queues -->
              <rect x="595" y="80" width="105" height="50" rx="8" fill="#451A03" stroke="#D97706" stroke-width="1.5"/>
              <text x="647" y="102" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#FCD34D" text-anchor="middle">Durable Queues</text>
              <text x="647" y="118" font-family="Geist, sans-serif" font-size="8.5" fill="#FDE68A" text-anchor="middle">Per-Channel Queues</text>

              <!-- Arrow 5 -> 6 -->
              <line x1="700" y1="105" x2="728" y2="105" stroke="#38BDF8" stroke-width="1.6" marker-end="url(#sum-arr)"/>

              <!-- Node 6: Channel Workers -->
              <rect x="730" y="70" width="175" height="70" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
              <text x="817" y="93" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#6EE7B7" text-anchor="middle">Channel Workers</text>
              <text x="817" y="108" font-family="Geist, sans-serif" font-size="8.5" fill="#A7F3D0" text-anchor="middle">Prefs &bull; Templates &bull; Retry</text>
              <text x="817" y="123" font-family="Geist, sans-serif" font-size="8.5" fill="#6EE7B7" text-anchor="middle">&rarr; SES / Twilio / APNs</text>
            </svg>
          </div>

          <!-- 7 Core Engineering Takeaways -->
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col gap-3">
            <h4 class="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
              7 Core Architectural Lessons to State in the Interview
            </h4>
            <div class="flex flex-col gap-2.5 text-[13px] text-slate-700 dark:text-slate-300">
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <span><strong>Accept durably, deliver asynchronously:</strong> Return <code>202 Accepted</code> immediately after persisting the request and outbox event. Never make client HTTP threads wait on third-party provider gateways.</span>
              </div>
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <span><strong>Transactional Outbox prevents dual-write losses:</strong> Eliminate dual writes by committing the business record and outbox event in the same database transaction.</span>
              </div>
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <span><strong>Expect duplicate processing:</strong> At-least-once queues and publisher crashes will deliver duplicates. Design idempotency keys into the API, workers, and webhook handlers.</span>
              </div>
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">4</span>
                <span><strong>Track delivery per channel independently:</strong> Distinguish provider acceptance (HTTP 202) from confirmed delivery (webhook receipt). Never assume an accepted send was delivered.</span>
              </div>
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">5</span>
                <span><strong>Handle retries &amp; ambiguous outcomes deliberately:</strong> Apply exponential backoff with full jitter. On ambiguous timeouts, query provider status before retrying to prevent duplicate SMS/emails.</span>
              </div>
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">6</span>
                <span><strong>Scale by channel job depth, not API rate:</strong> Fan-out and slow providers decouple queue growth from API RPS. Isolate channels into dedicated queues to prevent head-of-line blocking.</span>
              </div>
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">7</span>
                <span><strong>Respect consent &amp; protect PII throughout:</strong> Recheck mutable user preferences at send time and redact PII from logs and durable queue payloads.</span>
              </div>
            </div>
          </div>

        </div>
      `
    }
  ];
}
