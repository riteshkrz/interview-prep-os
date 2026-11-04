/**
 * Question 2. Design a distributed rate limiter
 * System Design Interview Masterclass — Module 1: Core system design (Pages 18–21)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';
import { renderRateLimiterSimulator } from './RateLimiterSimulator.js';
import { getRateLimiterLldCustomSections } from './RateLimiterLldSections.js';

export function renderDistributedRateLimiterDetail() {
  return renderMasterclassQuestion({
    questionNumber: 2,
    title: "Design a distributed rate limiter",
    moduleName: "Module 1 — Core system design",
    coreTopics: "Token Bucket, Redis, atomic operations, distributed coordination, and graceful handling when dependencies fail",

    problemStatement: `A distributed rate limiter controls how many requests a client can make within a specified period, even when requests are distributed across multiple application servers.<br/><br/>
    <strong>Examples:</strong>
    <ul class="list-disc list-inside space-y-1 my-2.5 pl-2 text-[#334155] dark:text-slate-300">
      <li>An API allows each user to make 100 requests per minute.</li>
      <li>A login endpoint allows only 5 attempts per minute per account.</li>
      <li>A payment API limits each merchant to 1,000 requests per second.</li>
      <li>A public API protects backend services from traffic spikes and abuse.</li>
    </ul>
    The difficult part is not counting requests. It is ensuring that multiple servers enforce one consistent limit without introducing excessive latency or a single point of failure.`,

    clarifyingQuestions: [
      { q: "Which identities or resources need throttling?", a: "Throttle individual API keys and chosen endpoints, with optional limits that span the whole service." },
      { q: "Must enforcement be perfectly global?", a: "Behavior should stay largely aligned across app instances; small, short-lived drift during failures is acceptable." },
      { q: "What behavior is required when the limiter backend is down?", a: "Ordinary reads can fall back to a conservative local limit; sensitive endpoints should remain protected." },
      { q: "Is one limit applied uniformly to every API?", a: "No—limits differ by route and by customer plan." }
    ],

    functionalRequirements: [
      "Limit requests by user, API key, IP address, tenant or endpoint.",
      "Allow requests under the configured limit and reject excess requests.",
      "Support configurable limits and time windows.",
      "Return useful response headers and a retry time.",
      "Support concurrent requests across many application instances."
    ],

    nonFunctionalRequirements: [
      "Low latency, ideally only a few milliseconds of additional overhead.",
      "High availability and horizontal scalability.",
      "Correct enforcement across application servers.",
      "Predictable behavior during Redis failures and traffic spikes.",
      "Protection against spoofed identities and abuse."
    ],

    customSections: [
      {
        badge: "FLOW",
        badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
        title: "Basic Rate Limiter Flow",
        content: `
          <div class="flex flex-col gap-4">
            <p class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
              At the edge or middleware layer, every client request is intercepted by the rate limiter before reaching downstream services. Based on the client's allocated quota, the request is either <strong>allowed</strong> to proceed to the backend server or immediately <strong>rejected</strong> with an HTTP 429 response.
            </p>

            <!-- Vector Flowchart SVG Diagram -->
            <div class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#070B14] p-4 sm:p-6 shadow-xs">
              <svg viewBox="0 0 840 230" class="w-full h-auto min-w-[700px] select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <!-- Arrowhead markers -->
                  <marker id="rl-arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284C7" />
                  </marker>
                  <marker id="rl-arrow-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
                  </marker>
                  <marker id="rl-arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#F43F5E" />
                  </marker>

                  <!-- Gradients -->
                  <linearGradient id="rl-client-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.16"/>
                    <stop offset="100%" stop-color="#0284C7" stop-opacity="0.06"/>
                  </linearGradient>
                  <linearGradient id="rl-limiter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#818CF8" stop-opacity="0.18"/>
                    <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.08"/>
                  </linearGradient>
                  <linearGradient id="rl-server-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#34D399" stop-opacity="0.18"/>
                    <stop offset="100%" stop-color="#059669" stop-opacity="0.06"/>
                  </linearGradient>
                  <linearGradient id="rl-reject-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FB7185" stop-opacity="0.18"/>
                    <stop offset="100%" stop-color="#E11D48" stop-opacity="0.06"/>
                  </linearGradient>
                </defs>

                <!-- Connectors -->
                <!-- A to B (Client to Rate Limiter) -->
                <line x1="190" y1="115" x2="278" y2="115" stroke="#0284C7" stroke-width="2.5" marker-end="url(#rl-arrow-cyan)" />
                <!-- Small badge above A -> B -->
                <rect x="206" y="93" width="60" height="18" rx="9" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="1" class="dark:fill-sky-950/80 dark:stroke-sky-800"/>
                <text x="236" y="105" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="600" fill="#0369A1" class="dark:fill-sky-300">Request</text>

                <!-- B to C (Rate Limiter to Backend Server - Allowed) -->
                <path d="M 470 100 C 515 100, 525 55, 578 55" fill="none" stroke="#10B981" stroke-width="2.5" marker-end="url(#rl-arrow-emerald)" />
                <!-- "Allowed" Badge -->
                <g transform="translate(488, 62)">
                  <rect x="0" y="0" width="72" height="22" rx="11" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.5" class="dark:fill-[#064E3B] dark:stroke-emerald-600" />
                  <text x="36" y="15" text-anchor="middle" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#047857" class="dark:fill-emerald-200">✓ Allowed</text>
                </g>

                <!-- B to D (Rate Limiter to HTTP 429 - Rejected) -->
                <path d="M 470 130 C 515 130, 525 175, 578 175" fill="none" stroke="#F43F5E" stroke-width="2.5" marker-end="url(#rl-arrow-rose)" />
                <!-- "Rejected" Badge -->
                <g transform="translate(488, 146)">
                  <rect x="0" y="0" width="74" height="22" rx="11" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1.5" class="dark:fill-[#4C0519] dark:stroke-rose-600" />
                  <text x="37" y="15" text-anchor="middle" font-family="Geist, sans-serif" font-size="11" font-weight="700" fill="#BE123C" class="dark:fill-rose-200">✕ Rejected</text>
                </g>

                <!-- NODE A: Client -->
                <g transform="translate(25, 70)">
                  <rect width="165" height="90" rx="14" fill="url(#rl-client-grad)" stroke="#38BDF8" stroke-width="1.8" class="dark:stroke-sky-500/60" />
                  <rect x="12" y="14" width="30" height="30" rx="8" fill="#0284C7" fill-opacity="0.15" />
                  <!-- Device Icon -->
                  <path d="M 20 23 h 14 v 10 h -14 z M 25 33 v 3 h 4 v -3" fill="none" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <text x="50" y="32" font-family="Geist, sans-serif" font-size="14" font-weight="800" fill="#0F172A" class="dark:fill-white">Client</text>
                  <text x="16" y="65" font-family="Geist, sans-serif" font-size="11" font-weight="500" fill="#475569" class="dark:fill-slate-300">Web &bull; Mobile &bull; API Caller</text>
                  <text x="16" y="80" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#0284C7" class="dark:fill-sky-400">Node A</text>
                </g>

                <!-- NODE B: Rate Limiter -->
                <g transform="translate(285, 70)">
                  <rect width="185" height="90" rx="14" fill="url(#rl-limiter-grad)" stroke="#6366F1" stroke-width="2" class="dark:stroke-indigo-500/70" />
                  <rect x="14" y="14" width="30" height="30" rx="8" fill="#4F46E5" fill-opacity="0.18" />
                  <!-- Shield / Security Icon -->
                  <path d="M 29 20 L 37 23 V 28 C 37 33 29 37 29 37 C 29 37 21 33 21 28 V 23 Z" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linejoin="round" class="dark:stroke-indigo-400"/>
                  <text x="52" y="32" font-family="Geist, sans-serif" font-size="14" font-weight="800" fill="#0F172A" class="dark:fill-white">Rate Limiter</text>
                  <text x="16" y="65" font-family="Geist, sans-serif" font-size="11" font-weight="500" fill="#475569" class="dark:fill-slate-300">Token Bucket / Gateway</text>
                  <text x="16" y="80" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#4F46E5" class="dark:fill-indigo-300">Node B &bull; Decision Point</text>
                </g>

                <!-- NODE C: Backend Server -->
                <g transform="translate(585, 12)">
                  <rect width="225" height="85" rx="14" fill="url(#rl-server-grad)" stroke="#10B981" stroke-width="1.8" class="dark:stroke-emerald-500/70" />
                  <rect x="14" y="14" width="30" height="30" rx="8" fill="#059669" fill-opacity="0.18" />
                  <!-- Server Stack Icon -->
                  <path d="M 21 22 h 16 v 4 h -16 z M 21 28 h 16 v 4 h -16 z M 21 34 h 16 v 4 h -16 z" fill="none" stroke="#059669" stroke-width="1.6" class="dark:stroke-emerald-400" />
                  <text x="52" y="32" font-family="Geist, sans-serif" font-size="14" font-weight="800" fill="#0F172A" class="dark:fill-white">Backend Server</text>
                  <text x="16" y="62" font-family="Geist, sans-serif" font-size="11" font-weight="500" fill="#475569" class="dark:fill-slate-300">Process &amp; Return 200 OK</text>
                  <text x="16" y="77" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#059669" class="dark:fill-emerald-400">Node C &bull; Quota Available</text>
                </g>

                <!-- NODE D: HTTP 429 -->
                <g transform="translate(585, 132)">
                  <rect width="225" height="85" rx="14" fill="url(#rl-reject-grad)" stroke="#F43F5E" stroke-width="1.8" class="dark:stroke-rose-500/70" />
                  <rect x="14" y="14" width="30" height="30" rx="8" fill="#E11D48" fill-opacity="0.18" />
                  <!-- Ban / Reject Icon -->
                  <circle cx="29" cy="29" r="8" fill="none" stroke="#E11D48" stroke-width="1.8" class="dark:stroke-rose-400"/>
                  <line x1="23" y1="23" x2="35" y2="35" stroke="#E11D48" stroke-width="1.8" class="dark:stroke-rose-400"/>
                  <text x="52" y="32" font-family="Geist, sans-serif" font-size="14" font-weight="800" fill="#0F172A" class="dark:fill-white">HTTP 429</text>
                  <text x="16" y="62" font-family="Geist, sans-serif" font-size="11" font-weight="500" fill="#475569" class="dark:fill-slate-300">Too Many Requests (Retry-After)</text>
                  <text x="16" y="77" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#E11D48" class="dark:fill-rose-400">Node D &bull; Limit Exceeded</text>
                </g>
              </svg>
            </div>

            <!-- INTERACTIVE RATE LIMITER SIMULATOR -->
            ${renderRateLimiterSimulator()}
          </div>
        `
      },
      {
        badge: "ALGORITHM",
        badgeColor: "bg-purple-500/15 text-[#7C3AED] dark:text-purple-300",
        title: "Algorithm Selection & Comparison",
        content: `
          <div class="flex flex-col gap-6">
            <p class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
              There are several common algorithms. Choosing the right one is an interview decision, not just an implementation detail. <strong>Token Bucket</strong> is a strong default for general APIs. The bucket holds at most a configured capacity and gains tokens at a fixed refill rate. Each request spends one token; if none remain, the request is denied.
            </p>

            <!-- 5 ALGORITHMS DETAILED COMPARISON CARDS -->
            <div class="flex flex-col gap-4">
              
              <!-- 1. Fixed Window Counter -->
              <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0B1120] p-4 flex flex-col gap-3 shadow-xs">
                <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <span class="px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/50 font-bold text-[13px] flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">calendar_view_day</span>
                    1. Fixed Window Counter
                  </span>
                  <span class="text-[11px] font-mono text-slate-500">Reset at Window End</span>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
                  <!-- Flow Diagram -->
                  <div class="lg:col-span-5 bg-white dark:bg-[#070B14] rounded-lg border border-slate-200 dark:border-slate-800/80 p-2 overflow-x-auto flex items-center justify-center min-h-[90px]">
                    <svg viewBox="0 0 350 90" class="w-full h-auto min-w-[310px] max-w-[350px]" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="27" width="62" height="36" rx="6" fill="#F3E8FF" stroke="#C084FC" stroke-width="1.5" class="dark:fill-purple-950/40 dark:stroke-purple-700"/>
                      <text x="36" y="49" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#7E22CE" class="dark:fill-purple-300" text-anchor="middle">A[Requests]</text>
                      <line x1="67" y1="45" x2="88" y2="45" stroke="#94A3B8" stroke-width="1.8" />
                      <polygon points="88,42 94,45 88,48" fill="#94A3B8" />
                      <rect x="95" y="21" width="84" height="48" rx="6" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5" class="dark:fill-sky-950/40 dark:stroke-sky-700"/>
                      <text x="137" y="42" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#0369A1" class="dark:fill-sky-300" text-anchor="middle">B[Requests]</text>
                      <text x="137" y="56" font-family="Geist, sans-serif" font-size="9" fill="#0284C7" class="dark:fill-sky-400" text-anchor="middle">(1 min)</text>
                      <line x1="179" y1="45" x2="198" y2="45" stroke="#94A3B8" stroke-width="1.8" />
                      <polygon points="198,42 204,45 198,48" fill="#94A3B8" />
                      <polygon points="205,45 230,27 255,45 230,63" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" class="dark:fill-amber-950/40 dark:stroke-amber-600"/>
                      <text x="230" y="48" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#B45309" class="dark:fill-amber-300" text-anchor="middle">Count ≤ N?</text>
                      <path d="M 248 37 L 265 24 L 280 24" fill="none" stroke="#10B981" stroke-width="1.6"/>
                      <text x="264" y="20" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#047857" class="dark:fill-emerald-400">Yes</text>
                      <rect x="282" y="12" width="58" height="24" rx="4" fill="#DCFCE7" stroke="#22C55E" stroke-width="1.5" class="dark:fill-emerald-950/50 dark:stroke-emerald-600"/>
                      <text x="311" y="27" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#15803D" class="dark:fill-emerald-300" text-anchor="middle">D[Allow]</text>
                      <path d="M 248 53 L 265 66 L 280 66" fill="none" stroke="#F43F5E" stroke-width="1.6"/>
                      <text x="264" y="74" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#BE123C" class="dark:fill-rose-400">No</text>
                      <rect x="282" y="54" width="64" height="24" rx="4" fill="#FFE4E6" stroke="#F43F5E" stroke-width="1.5" class="dark:fill-rose-950/50 dark:stroke-rose-600"/>
                      <text x="314" y="69" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#BE123C" class="dark:fill-rose-300" text-anchor="middle">E[Reject (429)]</text>
                    </svg>
                  </div>
                  <!-- How it works -->
                  <div class="lg:col-span-3 text-[12.5px] leading-relaxed">
                    <strong class="text-slate-900 dark:text-white block mb-0.5 text-[11px] uppercase tracking-wider font-bold">How it works</strong>
                    <p class="text-slate-600 dark:text-slate-300">Count requests in a fixed time window (e.g., per minute). Reset counter at window end.</p>
                  </div>
                  <!-- Pros & Cons -->
                  <div class="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-emerald-700 dark:text-emerald-400">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span> Pros
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Simple to implement</li>
                        <li>Low memory &amp; cost</li>
                      </ul>
                    </div>
                    <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-rose-700 dark:text-rose-400">
                        <span class="material-symbols-outlined text-[14px]">cancel</span> Cons
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Burst at window boundary</li>
                        <li>Not very fair</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. Sliding Window Log -->
              <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0B1120] p-4 flex flex-col gap-3 shadow-xs">
                <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <span class="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 font-bold text-[13px] flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">history</span>
                    2. Sliding Window Log
                  </span>
                  <span class="text-[11px] font-mono text-slate-500">Exact Timestamp Tracking</span>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
                  <!-- Flow Diagram -->
                  <div class="lg:col-span-5 bg-white dark:bg-[#070B14] rounded-lg border border-slate-200 dark:border-slate-800/80 p-2 overflow-x-auto flex items-center justify-center min-h-[90px]">
                    <svg viewBox="0 0 350 90" class="w-full h-auto min-w-[310px] max-w-[350px]" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="27" width="58" height="36" rx="6" fill="#F3E8FF" stroke="#C084FC" stroke-width="1.5" class="dark:fill-purple-950/40 dark:stroke-purple-700"/>
                      <text x="34" y="49" font-family="Geist, sans-serif" font-size="10.5" font-weight="700" fill="#7E22CE" class="dark:fill-purple-300" text-anchor="middle">A[Request]</text>
                      <line x1="63" y1="45" x2="84" y2="45" stroke="#94A3B8" stroke-width="1.8" />
                      <polygon points="84,42 90,45 84,48" fill="#94A3B8" />
                      <!-- Cylinder Database Store -->
                      <rect x="91" y="20" width="94" height="50" rx="10" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5" class="dark:fill-sky-950/40 dark:stroke-sky-700"/>
                      <text x="138" y="41" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#0369A1" class="dark:fill-sky-300" text-anchor="middle">B(Timestamps)</text>
                      <text x="138" y="55" font-family="Geist, sans-serif" font-size="9" fill="#0284C7" class="dark:fill-sky-400" text-anchor="middle">(Last 60s)</text>
                      <line x1="185" y1="45" x2="204" y2="45" stroke="#94A3B8" stroke-width="1.8" />
                      <polygon points="204,42 210,45 204,48" fill="#94A3B8" />
                      <polygon points="211,45 236,27 261,45 236,63" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" class="dark:fill-amber-950/40 dark:stroke-amber-600"/>
                      <text x="236" y="48" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#B45309" class="dark:fill-amber-300" text-anchor="middle">Count ≤ N?</text>
                      <path d="M 254 37 L 271 24 L 285 24" fill="none" stroke="#10B981" stroke-width="1.6"/>
                      <text x="270" y="20" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#047857" class="dark:fill-emerald-400">Yes</text>
                      <rect x="287" y="12" width="55" height="24" rx="4" fill="#DCFCE7" stroke="#22C55E" stroke-width="1.5" class="dark:fill-emerald-950/50 dark:stroke-emerald-600"/>
                      <text x="314" y="27" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#15803D" class="dark:fill-emerald-300" text-anchor="middle">D[Allow]</text>
                      <path d="M 254 53 L 271 66 L 285 66" fill="none" stroke="#F43F5E" stroke-width="1.6"/>
                      <text x="270" y="74" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#BE123C" class="dark:fill-rose-400">No</text>
                      <rect x="287" y="54" width="58" height="24" rx="4" fill="#FFE4E6" stroke="#F43F5E" stroke-width="1.5" class="dark:fill-rose-950/50 dark:stroke-rose-600"/>
                      <text x="316" y="69" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#BE123C" class="dark:fill-rose-300" text-anchor="middle">E[Reject]</text>
                    </svg>
                  </div>
                  <!-- How it works -->
                  <div class="lg:col-span-3 text-[12.5px] leading-relaxed">
                    <strong class="text-slate-900 dark:text-white block mb-0.5 text-[11px] uppercase tracking-wider font-bold">How it works</strong>
                    <p class="text-slate-600 dark:text-slate-300">Store timestamps of recent requests and count only those within the last T seconds.</p>
                  </div>
                  <!-- Pros & Cons -->
                  <div class="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-emerald-700 dark:text-emerald-400">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span> Pros
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Accurate &amp; fair</li>
                        <li>No boundary burst</li>
                      </ul>
                    </div>
                    <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-rose-700 dark:text-rose-400">
                        <span class="material-symbols-outlined text-[14px]">cancel</span> Cons
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Higher memory (stores each request)</li>
                        <li>More processing overhead</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. Sliding Window Counter -->
              <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0B1120] p-4 flex flex-col gap-3 shadow-xs">
                <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <span class="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 font-bold text-[13px] flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">timelapse</span>
                    3. Sliding Window Counter
                  </span>
                  <span class="text-[11px] font-mono text-slate-500">Weighted Average Hybrid</span>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
                  <!-- Flow Diagram -->
                  <div class="lg:col-span-5 bg-white dark:bg-[#070B14] rounded-lg border border-slate-200 dark:border-slate-800/80 p-2 overflow-x-auto flex items-center justify-center min-h-[90px]">
                    <svg viewBox="0 0 350 90" class="w-full h-auto min-w-[310px] max-w-[350px]" xmlns="http://www.w3.org/2000/svg">
                      <rect x="15" y="8" width="145" height="36" rx="6" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="1.5" class="dark:fill-indigo-950/40 dark:stroke-indigo-700"/>
                      <text x="87" y="23" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#6D28D9" class="dark:fill-indigo-300" text-anchor="middle">Previous Window (t-1)</text>
                      <text x="87" y="37" font-family="JetBrains Mono, monospace" font-size="9" fill="#7C3AED" class="dark:fill-indigo-400" text-anchor="middle">count = 40</text>
                      <rect x="190" y="8" width="145" height="36" rx="6" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5" class="dark:fill-sky-950/40 dark:stroke-sky-700"/>
                      <text x="262" y="23" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#0369A1" class="dark:fill-sky-300" text-anchor="middle">Current Window (t)</text>
                      <text x="262" y="37" font-family="JetBrains Mono, monospace" font-size="9" fill="#0284C7" class="dark:fill-sky-400" text-anchor="middle">count = 20</text>
                      <path d="M 87 44 L 87 56 L 175 56" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
                      <path d="M 262 44 L 262 56 L 175 56" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
                      <line x1="175" y1="56" x2="175" y2="62" stroke="#94A3B8" stroke-width="1.5"/>
                      <polygon points="172,62 175,67 178,62" fill="#94A3B8"/>
                      <rect x="30" y="66" width="290" height="22" rx="5" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.2" class="dark:fill-slate-900 dark:stroke-slate-700"/>
                      <text x="175" y="81" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#0F172A" class="dark:fill-cyan-300" text-anchor="middle">Effective Count = 40×(1 - α) + 20</text>
                    </svg>
                  </div>
                  <!-- How it works -->
                  <div class="lg:col-span-3 text-[12.5px] leading-relaxed">
                    <strong class="text-slate-900 dark:text-white block mb-0.5 text-[11px] uppercase tracking-wider font-bold">How it works</strong>
                    <p class="text-slate-600 dark:text-slate-300">Approximate a sliding window by combining current and previous window counts using a weight α (based on time progress).</p>
                  </div>
                  <!-- Pros & Cons -->
                  <div class="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-emerald-700 dark:text-emerald-400">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span> Pros
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Good accuracy</li>
                        <li>Lower memory than log</li>
                        <li>Smooths boundary burst</li>
                      </ul>
                    </div>
                    <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-rose-700 dark:text-rose-400">
                        <span class="material-symbols-outlined text-[14px]">cancel</span> Cons
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Approximate (not exact)</li>
                        <li>Slightly more complex than fixed window</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4. Token Bucket -->
              <div class="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 p-4 flex flex-col gap-3 shadow-xs">
                <div class="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/50 pb-2.5">
                  <span class="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[13px] flex items-center gap-1.5 shadow-xs">
                    <span class="material-symbols-outlined text-[15px]">toll</span>
                    4. Token Bucket (Industry Standard)
                  </span>
                  <span class="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[13px]">recommend</span> RECOMMENDED
                  </span>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
                  <!-- Flow Diagram -->
                  <div class="lg:col-span-5 bg-white dark:bg-[#070B14] rounded-lg border border-slate-200 dark:border-slate-800/80 p-2 overflow-x-auto flex items-center justify-center min-h-[90px]">
                    <svg viewBox="0 0 350 90" class="w-full h-auto min-w-[310px] max-w-[350px]" xmlns="http://www.w3.org/2000/svg">
                      <!-- Refill Pill Top -->
                      <rect x="95" y="4" width="96" height="18" rx="9" fill="#DCFCE7" stroke="#10B981" stroke-width="1.2" class="dark:fill-emerald-950/60 dark:stroke-emerald-600"/>
                      <text x="143" y="16.5" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#047857" class="dark:fill-emerald-300" text-anchor="middle">Refill r tokens/sec</text>
                      <line x1="143" y1="22" x2="143" y2="30" stroke="#10B981" stroke-width="1.6" />
                      <polygon points="140,30 143,35 146,30" fill="#10B981"/>
                      <!-- Requests Input -->
                      <rect x="5" y="45" width="65" height="32" rx="6" fill="#F3E8FF" stroke="#C084FC" stroke-width="1.4" class="dark:fill-purple-950/40 dark:stroke-purple-700"/>
                      <text x="37" y="58" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#7E22CE" class="dark:fill-purple-300" text-anchor="middle">Requests</text>
                      <text x="37" y="70" font-family="Geist, sans-serif" font-size="8.5" fill="#9333EA" class="dark:fill-purple-400" text-anchor="middle">(1 token)</text>
                      <line x1="70" y1="61" x2="98" y2="61" stroke="#94A3B8" stroke-width="1.6"/>
                      <polygon points="98,58 104,61 98,64" fill="#94A3B8"/>
                      <!-- Bucket Body -->
                      <path d="M 105 38 L 185 38 L 175 76 L 115 76 Z" fill="#FEF3C7" stroke="#D97706" stroke-width="1.6" class="dark:fill-amber-950/30 dark:stroke-amber-600"/>
                      <!-- Tokens -->
                      <circle cx="130" cy="56" r="4.5" fill="#F59E0B"/>
                      <circle cx="145" cy="54" r="4.5" fill="#F59E0B"/>
                      <circle cx="160" cy="56" r="4.5" fill="#F59E0B"/>
                      <circle cx="138" cy="67" r="4" fill="#F59E0B"/>
                      <circle cx="152" cy="67" r="4" fill="#F59E0B"/>
                      <text x="145" y="86" font-family="Geist, sans-serif" font-size="8.5" font-weight="700" fill="#92400E" class="dark:fill-amber-300" text-anchor="middle">Capacity = C</text>
                      <line x1="183" y1="57" x2="204" y2="57" stroke="#94A3B8" stroke-width="1.6"/>
                      <polygon points="204,54 210,57 204,60" fill="#94A3B8"/>
                      <!-- Decision -->
                      <polygon points="211,57 236,38 261,57 236,76" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" class="dark:fill-amber-950/40 dark:stroke-amber-600"/>
                      <text x="236" y="53" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#B45309" class="dark:fill-amber-300" text-anchor="middle">Token</text>
                      <text x="236" y="64" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#B45309" class="dark:fill-amber-300" text-anchor="middle">available?</text>
                      <path d="M 254 48 L 271 35 L 285 35" fill="none" stroke="#10B981" stroke-width="1.6"/>
                      <text x="270" y="31" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#047857" class="dark:fill-emerald-400">Yes</text>
                      <rect x="287" y="23" width="55" height="24" rx="4" fill="#DCFCE7" stroke="#22C55E" stroke-width="1.5" class="dark:fill-emerald-950/50 dark:stroke-emerald-600"/>
                      <text x="314" y="38" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#15803D" class="dark:fill-emerald-300" text-anchor="middle">Allow</text>
                      <path d="M 254 65 L 271 76 L 285 76" fill="none" stroke="#F43F5E" stroke-width="1.6"/>
                      <text x="270" y="84" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#BE123C" class="dark:fill-rose-400">No</text>
                      <rect x="287" y="64" width="55" height="24" rx="4" fill="#FFE4E6" stroke="#F43F5E" stroke-width="1.5" class="dark:fill-rose-950/50 dark:stroke-rose-600"/>
                      <text x="314" y="79" font-family="Geist, sans-serif" font-size="9" font-weight="700" fill="#BE123C" class="dark:fill-rose-300" text-anchor="middle">Reject</text>
                    </svg>
                  </div>
                  <!-- How it works -->
                  <div class="lg:col-span-3 text-[12.5px] leading-relaxed">
                    <strong class="text-slate-900 dark:text-white block mb-0.5 text-[11px] uppercase tracking-wider font-bold">How it works</strong>
                    <p class="text-slate-600 dark:text-slate-300">Bucket holds tokens (max C). Tokens are added at a steady rate (r). Each request consumes tokens.</p>
                  </div>
                  <!-- Pros & Cons -->
                  <div class="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-emerald-700 dark:text-emerald-400">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span> Pros
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Allows controlled bursts</li>
                        <li>Smooth &amp; flexible</li>
                        <li>Widely used in production</li>
                      </ul>
                    </div>
                    <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-rose-700 dark:text-rose-400">
                        <span class="material-symbols-outlined text-[14px]">cancel</span> Cons
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Slightly more complex</li>
                        <li>Needs token refill logic</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 5. Leaky Bucket -->
              <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0B1120] p-4 flex flex-col gap-3 shadow-xs">
                <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <span class="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900/50 font-bold text-[13px] flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">water_drop</span>
                    5. Leaky Bucket
                  </span>
                  <span class="text-[11px] font-mono text-slate-500">Constant Egress Shaping</span>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
                  <!-- Flow Diagram -->
                  <div class="lg:col-span-5 bg-white dark:bg-[#070B14] rounded-lg border border-slate-200 dark:border-slate-800/80 p-2 overflow-x-auto flex items-center justify-center min-h-[90px]">
                    <svg viewBox="0 0 350 90" class="w-full h-auto min-w-[310px] max-w-[350px]" xmlns="http://www.w3.org/2000/svg">
                      <!-- Incoming Requests -->
                      <rect x="5" y="27" width="85" height="38" rx="6" fill="#F3E8FF" stroke="#C084FC" stroke-width="1.5" class="dark:fill-purple-950/40 dark:stroke-purple-700"/>
                      <text x="47" y="42" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#7E22CE" class="dark:fill-purple-300" text-anchor="middle">Incoming</text>
                      <text x="47" y="55" font-family="Geist, sans-serif" font-size="8.5" fill="#9333EA" class="dark:fill-purple-400" text-anchor="middle">Requests (Burst)</text>
                      <line x1="90" y1="46" x2="114" y2="46" stroke="#94A3B8" stroke-width="1.8"/>
                      <polygon points="114,43 120,46 114,49" fill="#94A3B8"/>
                      <!-- Queue Container -->
                      <rect x="122" y="16" width="92" height="58" rx="8" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5" class="dark:fill-sky-950/40 dark:stroke-sky-700"/>
                      <!-- Queue Bars -->
                      <rect x="142" y="32" width="6" height="20" rx="1" fill="#0284C7"/>
                      <rect x="153" y="27" width="6" height="25" rx="1" fill="#0284C7"/>
                      <rect x="164" y="22" width="6" height="30" rx="1" fill="#0284C7"/>
                      <rect x="175" y="19" width="6" height="33" rx="1" fill="#0284C7"/>
                      <text x="168" y="65" font-family="Geist, sans-serif" font-size="8" font-weight="700" fill="#0369A1" class="dark:fill-sky-300" text-anchor="middle">Queue (capacity = C)</text>
                      <line x1="214" y1="46" x2="236" y2="46" stroke="#94A3B8" stroke-width="1.8"/>
                      <polygon points="236,43 242,46 236,49" fill="#94A3B8"/>
                      <!-- Fixed Rate Process -->
                      <rect x="244" y="27" width="100" height="38" rx="6" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5" class="dark:fill-sky-950/40 dark:stroke-sky-700"/>
                      <text x="294" y="42" font-family="Geist, sans-serif" font-size="9.5" font-weight="700" fill="#0369A1" class="dark:fill-sky-300" text-anchor="middle">Process at</text>
                      <text x="294" y="55" font-family="Geist, sans-serif" font-size="8.5" fill="#0284C7" class="dark:fill-sky-400" text-anchor="middle">fixed rate (r)</text>
                    </svg>
                  </div>
                  <!-- How it works -->
                  <div class="lg:col-span-3 text-[12.5px] leading-relaxed">
                    <strong class="text-slate-900 dark:text-white block mb-0.5 text-[11px] uppercase tracking-wider font-bold">How it works</strong>
                    <p class="text-slate-600 dark:text-slate-300">Requests enter a queue (bucket) and are processed at a constant rate (r), &ldquo;leaking&rdquo; out like water.</p>
                  </div>
                  <!-- Pros & Cons -->
                  <div class="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-emerald-700 dark:text-emerald-400">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span> Pros
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Smooths out traffic</li>
                        <li>Good for traffic shaping</li>
                        <li>Simple and predictable</li>
                      </ul>
                    </div>
                    <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                      <div class="font-bold flex items-center gap-1 mb-1 text-[11.5px] text-rose-700 dark:text-rose-400">
                        <span class="material-symbols-outlined text-[14px]">cancel</span> Cons
                      </div>
                      <ul class="list-disc pl-3.5 space-y-0.5">
                        <li>Adds queueing delay</li>
                        <li>Not ideal for low-latency APIs</li>
                        <li>Needs queue management</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- QUICK COMPARISON TABLE & RECOMMENDATION -->
            <div class="flex flex-col gap-4 mt-2">
              <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 class="font-bold text-[15px] text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px] text-cyan-600 dark:text-cyan-400">table_chart</span>
                  Quick Comparison
                </h4>
                <span class="text-[11px] font-mono text-slate-500">5-Algorithm Trade-off Matrix</span>
              </div>

              <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xs">
                <table class="w-full text-left text-[12.5px] border-collapse">
                  <thead>
                    <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-semibold text-[11.5px] uppercase tracking-wider">
                      <th class="py-3 px-3.5">Algorithm</th>
                      <th class="py-3 px-3">Accuracy</th>
                      <th class="py-3 px-3">Burst Support</th>
                      <th class="py-3 px-3">Memory</th>
                      <th class="py-3 px-3">Complexity</th>
                      <th class="py-3 px-4">Best For</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">Fixed Window</td>
                      <td class="py-2.5 px-3">Low</td>
                      <td class="py-2.5 px-3 text-rose-500 font-bold">✕</td>
                      <td class="py-2.5 px-3">Low</td>
                      <td class="py-2.5 px-3">Low</td>
                      <td class="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">Simple quotas (e.g., 100 req/min)</td>
                    </tr>
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">Sliding Window Log</td>
                      <td class="py-2.5 px-3">High</td>
                      <td class="py-2.5 px-3 text-emerald-500 font-bold">✓</td>
                      <td class="py-2.5 px-3">High</td>
                      <td class="py-2.5 px-3">Medium</td>
                      <td class="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">Strict &amp; fair limits (e.g., login attempts)</td>
                    </tr>
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">Sliding Window Counter</td>
                      <td class="py-2.5 px-3">Medium</td>
                      <td class="py-2.5 px-3 text-emerald-500 font-bold">✓</td>
                      <td class="py-2.5 px-3">Medium</td>
                      <td class="py-2.5 px-3">Medium</td>
                      <td class="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">Balanced accuracy &amp; performance</td>
                    </tr>
                    <tr class="bg-indigo-50/40 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors">
                      <td class="py-2.5 px-3.5 font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Token Bucket
                      </td>
                      <td class="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">High</td>
                      <td class="py-2.5 px-3 text-emerald-500 font-bold">✓</td>
                      <td class="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">Low</td>
                      <td class="py-2.5 px-3">Medium</td>
                      <td class="py-2.5 px-4 font-bold text-indigo-700 dark:text-indigo-300">Most common (APIs, microservices)</td>
                    </tr>
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td class="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">Leaky Bucket</td>
                      <td class="py-2.5 px-3">High</td>
                      <td class="py-2.5 px-3 font-medium text-emerald-600 dark:text-emerald-400">✓ <span class="text-[11px] text-slate-500 dark:text-slate-400">(controlled)</span></td>
                      <td class="py-2.5 px-3">Medium</td>
                      <td class="py-2.5 px-3">Medium</td>
                      <td class="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">Traffic shaping, stable downstream load</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Recommendation Box -->
              <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-[13px] text-amber-950 dark:text-amber-200 shadow-xs">
                <span class="text-[22px] shrink-0 leading-none">⭐</span>
                <div class="flex flex-col gap-1">
                  <strong class="text-[14px] font-bold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">Recommendation</strong>
                  <p class="leading-relaxed">
                    Use <strong>Token Bucket</strong> in most real-world systems. It provides a good balance of burst handling, accuracy, and performance.
                  </p>
                </div>
              </div>
            </div>

          </div>
        `
      }
    ],

    highLevelArchitecture: `Client &rarr; API gateway &rarr; rate-limit middleware &rarr; policy cache &rarr; Redis atomic operation &rarr; backend, when permitted.<br/><br/>
    When quota is exhausted, respond with HTTP 429. On certain routes, apply local fallback throttling if Redis is unreachable.`,

    architectureImage: '/images/distributed-rate-limiter-hld-architecture.jpg',
    architectureImageTitle: 'Design a Distributed Rate Limiter — High-Level Architecture & 5-Step Logic Flow',

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Derive the policy key",
        stepBody: "Build the key from a trusted user id or API key plus any needed route or tenant field. Do not rate-limit authenticated users by IP alone, since many users can appear behind one public address."
      },
      {
        stepNumber: 2,
        stepTitle: "Decide allow/deny in one atomic step",
        stepBody: "Keep token balance and last refill time in Redis. Run a Lua script or equivalent atomic logic to apply elapsed-time refill up to capacity, test for an available token, and decrement if the request may proceed."
      },
      {
        stepNumber: 3,
        stepTitle: "Apply limits at the gateway",
        stepBody: "Run the limit check before costly backend work. Respond with 429 when limits are exceeded."
      },
      {
        stepNumber: 4,
        stepTitle: "Layer multiple policies",
        stepBody: "Enforce tenant-wide, per-user, and per-endpoint caps as required. Specify evaluation order and how violations are surfaced when several limits fail at once."
      },
      {
        stepNumber: 5,
        stepTitle: "Plan degraded-mode behavior",
        stepBody: "Redis being unavailable must not imply unlimited traffic by default. By endpoint sensitivity, apply emergency local limits, fail closed on selected routes, or accept a bounded risk to availability."
      },
      {
        stepNumber: 6,
        stepTitle: "Scale out",
        stepBody: "Shard limiter state, watch for hot keys, and consider local token leases at extreme throughput when approximate global caps suffice. Leases cut coordination cost but can allow limited temporary overshoot."
      }
    ],

    whyComponents: [
      { component: "Edge API gateway", why: "Applies limits before domain logic runs" },
      { component: "Policy Cache", why: "Skips loading static policy on every single request" },
      { component: "Shared Redis store", why: "Shared, low-latency state visible to all instances" },
      { component: "Atomic Lua Script", why: "Stops parallel requests from debiting the same tokens twice" },
      { component: "Local Fallback Limiter", why: "Backup throttling when the shared store is unavailable" },
      { component: "Metrics and Alerts", why: "Surface rejections, latency, hot keys, and dependency health" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Global Redis state:</strong> Tighter cross-instance consistency, but every request pays a network round trip.",
      "<strong>In-memory limits:</strong> Very fast, but effective quotas scale with instance count and vanish on restart.",
      "<strong>Fail open:</strong> Keeps the API up but can flood downstream systems.",
      "<strong>Fail closed:</strong> Shields downstream services but may deny valid callers.",
      "<strong>Token leases:</strong> Boost throughput at the cost of strict instantaneous global accuracy."
    ],

    // LOW-LEVEL DESIGN (LLD) & DEEP DIVE SECTIONS (Placed after HLD, Steps, Components & Trade-Offs)
    postTradeoffSections: getRateLimiterLldCustomSections(),

    followUps: [
      {
        q: "What motivates a Lua script here?",
        a: "“Refill, check, and consume must happen atomically. Otherwise concurrent callers can all observe the same token balance and collectively exceed the intended cap.”"
      },
      {
        q: "How do you enforce one strict cap across multiple regions?",
        a: "“One global coordinator enforces tighter totals but adds latency and a single point of failure. Regional quotas or leased tokens improve locality but permit bounded overshoot. Pick based on whether the cap is a business guardrail or a hard security boundary.”"
      },
      {
        q: "How do you avoid a hot Redis key?",
        a: "“Where policy allows, use local token leases or partitioned quota. Splitting one global limit into unrelated counters without proper allocation would change the effective rate.”"
      },
      {
        q: "Should login fail open when the limiter is down?",
        a: "“Typically no—not without separate safeguards. Prefer strict local limits or another secure fallback, because an unthrottled login path invites credential stuffing and brute-force attacks.”"
      }
    ]
  });
}
