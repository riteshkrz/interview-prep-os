import { state } from '../state.js';

export function renderQuickSearchModal() {
  return `
    <div id="quick-search-modal" class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-surface-container-lowest rounded-xl max-w-xl w-full shadow-2xl border border-surface-container overflow-hidden animate-fadeIn">
        <div class="flex items-center px-4 py-3 border-b border-surface-container gap-2">
          <span class="material-symbols-outlined text-[20px] text-outline">search</span>
          <input
            id="modal-search-input"
            type="text"
            class="w-full bg-transparent text-on-surface placeholder-outline font-body-md text-[14px] focus:outline-none"
            placeholder="Search 100 problems, 20 system specs, or 45-day syllabus..."
            autofocus
          />
          <kbd class="font-code-sm text-[11px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface">ESC</kbd>
        </div>

        <div id="modal-search-results" class="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
          <!-- Populated dynamically via JS -->
        </div>

        <div class="px-4 py-2 bg-surface-container-low border-t border-surface-container flex items-center justify-between text-[11px] font-label-md text-on-surface-variant">
          <span>Tip: Press ESC to close</span>
          <span class="font-code-sm text-secondary">45-Day Interview Prep OS Database</span>
        </div>
      </div>
    </div>
  `;
}

export function renderLogEntryModal() {
  return `
    <div id="log-entry-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-fadeIn">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[22px]">add_circle</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Log Solved Problem</h3>
          </div>
          <button id="close-log-modal-btn" class="text-outline hover:text-on-surface p-1">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form id="log-entry-form" class="flex flex-col gap-3">
          <div>
            <label class="font-label-md text-[11px] text-outline uppercase tracking-wider block mb-1">Problem Title</label>
            <input id="log-title-input" required type="text" class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-surface-container focus:outline-none focus:bg-surface-container-lowest" placeholder="e.g. Alien Dictionary (Topological Sort)" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-label-md text-[11px] text-outline uppercase tracking-wider block mb-1">Domain / Category</label>
              <select id="log-category-select" class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-surface-container focus:outline-none">
                <option value="DSA">DSA Problem</option>
                <option value="SYS DESIGN">System Design Spec</option>
                <option value="REVISION">Spaced Revision Drill</option>
              </select>
            </div>
            <div>
              <label class="font-label-md text-[11px] text-outline uppercase tracking-wider block mb-1">Difficulty</label>
              <select id="log-difficulty-select" class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-surface-container focus:outline-none">
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Easy">Easy</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-label-md text-[11px] text-outline uppercase tracking-wider block mb-1">Pattern</label>
              <input id="log-pattern-input" type="text" class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-surface-container focus:outline-none" placeholder="e.g. Graph BFS / Kahn's Algo" />
            </div>
            <div>
              <label class="font-label-md text-[11px] text-outline uppercase tracking-wider block mb-1">Time Spent (Minutes)</label>
              <input id="log-time-input" type="number" min="1" max="180" value="30" class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-surface-container focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="font-label-md text-[11px] text-outline uppercase tracking-wider block mb-1">Key Takeaway / Edge Cases</label>
            <textarea id="log-notes-input" rows="2" class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-surface-container focus:outline-none" placeholder="Watch out for cycles, disconnected components, and empty inputs..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" id="cancel-log-btn" class="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container text-body-sm font-body-sm">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-on-primary text-body-sm font-body-sm font-medium hover:bg-on-surface-variant transition-colors shadow-sm">Save to Database</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function renderMockDesignModal() {
  return `
    <div id="mock-design-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[24px]">play_circle</span>
            <div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">45-Minute System Design Simulation</h3>
              <span class="font-code-sm text-[11px] text-on-surface-variant">FAANG L5/L6 Senior Interview Rubric</span>
            </div>
          </div>
          <button id="close-mock-modal-btn" class="text-outline hover:text-on-surface p-1">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Timer Simulation Widget -->
        <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
          <div class="flex flex-col">
            <span class="font-label-md text-[11px] text-outline uppercase tracking-wider">Interview Clock</span>
            <span id="mock-timer-display" class="font-code-sm text-[28px] font-bold text-on-surface tracking-wider">45:00</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="mock-timer-toggle-btn" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-on-surface-variant transition-colors font-medium">
              Start Clock
            </button>
            <button id="mock-timer-reset-btn" class="px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
              Reset
            </button>
          </div>
        </div>

        <!-- 4-Phase System Design Roadmap -->
        <div class="flex flex-col gap-3">
          <span class="font-label-md text-[11px] text-outline uppercase tracking-wider font-semibold">Structured 4-Phase Execution</span>
          
          <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-body-md text-[13px] font-semibold text-on-surface">1. Scope & Requirements (0 – 5 mins)</span>
              <span class="font-code-sm text-[11px] text-secondary font-medium">5 mins</span>
            </div>
            <p class="font-body-sm text-[12px] text-on-surface-variant">Clarify functional requirements (e.g. read:write ratio, SLA, 99.99% availability). Perform back-of-the-envelope QPS & storage calculations.</p>
          </div>

          <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-body-md text-[13px] font-semibold text-on-surface">2. High-Level Architecture (5 – 15 mins)</span>
              <span class="font-code-sm text-[11px] text-secondary font-medium">10 mins</span>
            </div>
            <p class="font-body-sm text-[12px] text-on-surface-variant">Draw clients, Load Balancer, API Gateway, Stateless App Services, Database tier, and Caching layers.</p>
          </div>

          <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-body-md text-[13px] font-semibold text-on-surface">3. Deep Dive into Bottlenecks (15 – 35 mins)</span>
              <span class="font-code-sm text-[11px] text-secondary font-medium">20 mins</span>
            </div>
            <p class="font-body-sm text-[12px] text-on-surface-variant">Tackle concurrency, distributed locking, database sharding strategies (hash vs range), and replication lag tradeoffs.</p>
          </div>

          <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-body-md text-[13px] font-semibold text-on-surface">4. Failure Scenarios & Wrap-Up (35 – 45 mins)</span>
              <span class="font-code-sm text-[11px] text-secondary font-medium">10 mins</span>
            </div>
            <p class="font-body-sm text-[12px] text-on-surface-variant">Single points of failure (SPOF), circuit breaking, rate limiting, and observability (metrics, tracing, alerting).</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

import { QUICK_FIRE_50 } from '../dsa-tracker/quickFire50Data.js';

export function renderCheatsheetModal(modalTab = 'quickfire') {
  return `
    <div id="cheatsheet-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-slate-900 dark:bg-[#0F1626] rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-700 dark:border-[#24314A] flex flex-col gap-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-700/60 dark:border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[#38BDF8] text-[24px]">menu_book</span>
            <div>
              <h3 class="text-lg font-bold text-slate-100 dark:text-[#F8FAFC]">Interview Cheat Sheets &amp; Blueprint</h3>
              <span class="font-code text-[11px] text-slate-300 dark:text-[#94A3B8]">Quick-Fire 50 DSA + System Design Numbers</span>
            </div>
          </div>
          <button id="close-cheatsheet-modal-btn" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Navigation Tabs inside Modal -->
        <div class="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            class="modal-cheatsheet-tab-btn px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${modalTab === 'quickfire' ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
            data-tab="quickfire"
          >
            Quick-Fire 50 DSA
          </button>
          <button
            class="modal-cheatsheet-tab-btn px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${modalTab === 'math' ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
            data-tab="math"
          >
            System Numbers &amp; SLAs
          </button>
          <button
            class="modal-cheatsheet-tab-btn px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${modalTab === 'tree' ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
            data-tab="tree"
          >
            DSA Pattern Decision Tree
          </button>
        </div>

        <!-- Tab 1: Quick-Fire 50 DSA Cheatsheet -->
        <div id="modal-tab-quickfire" class="${modalTab === 'quickfire' ? 'flex' : 'hidden'} flex-col gap-3">
          <div class="flex items-center justify-between text-[11px] font-code text-slate-400 px-1">
            <span>50 Most Frequently Asked FAANG Coding Problems (Scan Approach in 10s)</span>
            <span class="text-cyan-400 font-bold">${QUICK_FIRE_50.length} Problems</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            ${QUICK_FIRE_50.map(q => `
              <div class="p-3.5 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-2">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] font-code px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${q.pattern}</span>
                    <span class="font-bold text-[13px] text-slate-100 dark:text-[#F8FAFC]">${q.title}</span>
                  </div>
                  <span class="text-[9px] font-code px-1.5 py-0.2 rounded font-bold shrink-0 ${q.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-300' : q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}">${q.difficulty}</span>
                </div>
                <p class="text-[12px] text-slate-200 dark:text-[#CBD5E1] leading-relaxed">
                  <span class="font-bold text-cyan-400">10s Rule:</span> ${q.approachRule}
                </p>
                <div class="p-2 rounded bg-slate-950 dark:bg-[#0A0E17] border border-slate-800 text-[11px] font-code text-emerald-400 overflow-x-auto">
                  ${q.codeOneLiner}
                </div>
                <div class="flex items-center justify-between text-[10px] font-code text-slate-400 pt-1 border-t border-slate-700/40">
                  <span>Time: <strong class="text-cyan-300">${q.timeComplexity}</strong></span>
                  <span>Space: <strong class="text-indigo-300">${q.spaceComplexity}</strong></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tab 2: System Numbers & Math -->
        <div id="modal-tab-math" class="${modalTab === 'math' ? 'grid' : 'hidden'} grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Latency Numbers -->
          <div class="p-4 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Latency Numbers Every Engineer Knows</span>
            <div class="font-code text-[12px] flex flex-col gap-1.5 text-slate-200">
              <div class="flex justify-between"><span>L1 Cache reference</span><span class="font-semibold text-emerald-400">~0.5 ns</span></div>
              <div class="flex justify-between"><span>Mutex lock / unlock</span><span class="font-semibold text-emerald-400">~17 ns</span></div>
              <div class="flex justify-between"><span>Main Memory (RAM) reference</span><span class="font-semibold text-emerald-400">~100 ns</span></div>
              <div class="flex justify-between"><span>Compress 1KB (Snappy)</span><span class="font-semibold text-emerald-400">~2 μs</span></div>
              <div class="flex justify-between"><span>Send 1KB over 1 Gbps</span><span class="font-semibold text-cyan-400">~10 μs</span></div>
              <div class="flex justify-between"><span>SSD Random 4KB Read</span><span class="font-semibold text-cyan-400">~16–100 μs</span></div>
              <div class="flex justify-between"><span>Datacenter Roundtrip</span><span class="font-semibold text-cyan-400">~0.5 ms</span></div>
              <div class="flex justify-between"><span>Disk seek (HDD)</span><span class="font-semibold text-rose-400">~10 ms</span></div>
              <div class="flex justify-between"><span>Cross-Atlantic packet RTT</span><span class="font-semibold text-rose-400">~150 ms</span></div>
            </div>
          </div>

          <!-- Powers of 2 & Scale -->
          <div class="p-4 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Powers of 2 &amp; QPS Conversion</span>
            <div class="font-code text-[12px] flex flex-col gap-1.5 text-slate-200">
              <div class="flex justify-between"><span>2^10 (1 Thousand)</span><span class="font-semibold">1 KB</span></div>
              <div class="flex justify-between"><span>2^20 (1 Million)</span><span class="font-semibold">1 MB</span></div>
              <div class="flex justify-between"><span>2^30 (1 Billion)</span><span class="font-semibold">1 GB</span></div>
              <div class="flex justify-between"><span>2^40 (1 Trillion)</span><span class="font-semibold">1 TB</span></div>
              <div class="flex justify-between"><span>1 Day in Seconds</span><span class="font-semibold text-cyan-400">86,400 ≈ 10^5 s</span></div>
              <div class="flex justify-between"><span>1 Million reqs/day</span><span class="font-semibold text-cyan-400">≈ 12 QPS</span></div>
              <div class="flex justify-between"><span>1 Billion reqs/day</span><span class="font-semibold text-cyan-400">≈ 12,000 QPS</span></div>
              <div class="flex justify-between"><span>99.9% Availability (3 9s)</span><span class="font-semibold text-amber-400">8.7 hrs down/yr</span></div>
              <div class="flex justify-between"><span>99.99% Availability (4 9s)</span><span class="font-semibold text-emerald-400">52.6 min down/yr</span></div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Pattern Decision Tree -->
        <div id="modal-tab-tree" class="${modalTab === 'tree' ? 'flex' : 'hidden'} flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">High-Frequency DSA Decision Tree</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[12px]">
            <div class="p-3 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-1">
              <span class="font-bold text-slate-100 dark:text-[#F8FAFC]">Sorted Array</span>
              <span class="text-slate-300 dark:text-[#94A3B8]">Binary Search (O(log N)) or Two Pointers (O(N))</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-1">
              <span class="font-bold text-slate-100 dark:text-[#F8FAFC]">Subarray / Substring</span>
              <span class="text-slate-300 dark:text-[#94A3B8]">Sliding Window (contiguous) or Prefix Sums (sums)</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-1">
              <span class="font-bold text-slate-100 dark:text-[#F8FAFC]">Top / Lowest K</span>
              <span class="text-slate-300 dark:text-[#94A3B8]">Min/Max Heap (O(N log K)) or Quickselect (O(N))</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-1">
              <span class="font-bold text-slate-100 dark:text-[#F8FAFC]">Next Greater Element</span>
              <span class="text-slate-300 dark:text-[#94A3B8]">Monotonic Stack (decreasing order)</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-1">
              <span class="font-bold text-slate-100 dark:text-[#F8FAFC]">Shortest Path (Unweighted)</span>
              <span class="text-slate-300 dark:text-[#94A3B8]">Breadth-First Search (Queue / Level by level)</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-1">
              <span class="font-bold text-slate-100 dark:text-[#F8FAFC]">Dynamic Programming</span>
              <span class="text-slate-300 dark:text-[#94A3B8]">State transitions + Base cases + Memoization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderDrillModal(drillType) {
  let title = 'Active Recall Drill';
  let question = '';
  let answer = '';

  if (drillType === 'top-k') {
    title = 'Top K Elements: Heap vs Quickselect';
    question = 'When is Min-Heap preferable over Quickselect for streaming Top K elements, and what are the time/space complexities?';
    answer = 'Min-Heap maintains a fixed size of K. For a stream of N items, time complexity is O(N log K) and space is strictly O(K). Quickselect requires having the full array in memory beforehand: average time is O(N), worst-case O(N^2), but does not work for unbounded real-time streams.';
  } else {
    title = 'Redis Pub/Sub vs Apache Kafka';
    question = 'What is the fundamental architectural difference between Redis Pub/Sub and Kafka regarding persistence and backpressure?';
    answer = 'Redis Pub/Sub is fire-and-forget: messages are pushed into active subscriber socket buffers without persistence. If a consumer disconnects or falls behind, messages are lost. Kafka uses a distributed commit log: messages are persisted on disk and partitioned. Consumers pull data at their own pace using offset tracking, providing true backpressure and replayability.';
  }

  return `
    <div id="drill-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-fadeIn">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[22px]">psychology</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">${escapeHtml(title)}</h3>
          </div>
          <button id="close-drill-modal-btn" class="text-outline hover:text-on-surface p-1">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
          <span class="font-label-md text-[11px] text-outline uppercase tracking-wider font-semibold">Flashcard Question</span>
          <p class="font-body-md text-[14px] text-on-surface font-medium">${escapeHtml(question)}</p>
        </div>

        <div id="drill-answer-box" class="hidden p-4 rounded-xl bg-surface-container-highest border border-surface-container flex flex-col gap-2 animate-fadeIn">
          <span class="font-label-md text-[11px] text-on-tertiary-container uppercase tracking-wider font-semibold">Ideal FAANG Answer</span>
          <p class="font-body-sm text-[13px] text-on-surface">${escapeHtml(answer)}</p>
        </div>

        <div class="flex items-center justify-between pt-2">
          <button id="reveal-drill-answer-btn" class="px-4 py-2 rounded-lg bg-secondary text-white text-label-md font-label-md hover:bg-secondary/90 transition-colors font-medium">
            Reveal Answer
          </button>
          <div id="drill-rating-btns" class="hidden flex items-center gap-2">
            <button class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md hover:bg-surface-container-high" data-rate="hard">Hard (1d)</button>
            <button class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md hover:bg-surface-container-high" data-rate="good">Good (3d)</button>
            <button class="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-label-md hover:bg-on-surface-variant font-medium" data-rate="easy">Easy (7d)</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
