/**
 * 45-Day Interview Prep OS - Architectural Distinctions Workspace View
 * 180+ fine system design distinctions interviewers actually ask (sourced from SystemCraft).
 */

import { INTERVIEW_DISTINCTIONS } from './interviewDistinctionsData.js';

let selectedCategory = 'all';
let searchQuery = '';

export function renderDistinctionsWorkspaceView(category = 'all', search = '') {
  selectedCategory = category;
  searchQuery = search.toLowerCase().trim();

  const categories = [
    'all',
    'Storage & Databases',
    'Consistency & Distributed Systems',
    'Performance & Caching',
    'Networking & Protocols',
    'Messaging & Architecture'
  ];

  const filteredDistinctions = INTERVIEW_DISTINCTIONS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery) ||
      item.sayThis20s.toLowerCase().includes(searchQuery) ||
      item.interviewerTrap.toLowerCase().includes(searchQuery) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return `
    <div class="distinctions-workspace-view flex flex-col gap-6 w-full animate-fadeIn">
      <!-- Header Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/60 dark:bg-[#0F1626] border border-slate-700/60 dark:border-[#24314A] shadow-sm">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#F59E0B] text-[24px]">psychology</span>
            <h1 class="text-xl font-bold text-slate-100 dark:text-[#F8FAFC] tracking-tight">System Design Vocabulary &amp; Distinctions</h1>
            <span class="px-2 py-0.5 rounded text-[10px] font-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">180+ INTERVIEW DISTINCTIONS</span>
          </div>
          <p class="text-[13px] text-slate-300 dark:text-[#94A3B8]">
            Interviewers rarely ask "what is sharding?" They ask "what’s the difference between partitioning and sharding?" — because crisp answers prove you’ve operated real systems.
          </p>
        </div>

        <div class="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span class="text-[12px] font-code text-slate-300 dark:text-[#94A3B8]">Distinctions Catalog:</span>
          <span class="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-code font-bold text-[13px]">${INTERVIEW_DISTINCTIONS.length}</span>
        </div>
      </div>

      <!-- Controls: Category Pills & Search -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <!-- Category Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          ${categories.map(cat => `
            <button
              data-dist-cat="${cat}"
              class="dist-category-btn px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap cursor-pointer ${selectedCategory === cat ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-800/80 dark:bg-[#141C2E] border border-slate-700/80 dark:border-[#24314A] text-slate-300 dark:text-[#94A3B8] hover:text-white hover:bg-slate-700 dark:hover:bg-[#1E293B]'}"
            >
              ${cat === 'all' ? 'All Areas' : cat}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar -->
        <div class="relative w-full sm:w-64 shrink-0">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-slate-400">search</span>
          <input
            id="dist-search-input"
            type="text"
            placeholder="Search distinctions, traps, keywords..."
            value="${searchQuery}"
            class="w-full bg-slate-900/80 dark:bg-[#0F1626] border border-slate-700 dark:border-[#24314A] rounded-lg pl-9 pr-3 py-1.5 text-[12px] text-slate-200 dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#F59E0B]"
          />
        </div>
      </div>

      <!-- Distinctions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${filteredDistinctions.length === 0 ? `
          <div class="col-span-2 p-8 text-center text-slate-400 border border-dashed border-slate-700 rounded-xl">
            No distinctions match your search query. Try searching for "partitioning", "ACID", "linearizability", or "Kafka".
          </div>
        ` : filteredDistinctions.map(item => `
          <div class="p-5 rounded-2xl bg-slate-900/70 dark:bg-[#0F1626] border border-slate-700/70 dark:border-[#24314A] flex flex-col gap-3.5 shadow-sm hover:border-slate-500 transition-colors">
            <!-- Header -->
            <div class="flex items-start justify-between gap-2">
              <div class="flex flex-col gap-0.5">
                <span class="text-[10px] font-code font-bold uppercase tracking-wider text-amber-400 dark:text-amber-300">${item.category}</span>
                <h3 class="text-[15px] font-bold text-slate-100 dark:text-[#F8FAFC]">${item.title}</h3>
              </div>
              <span class="px-2 py-0.5 rounded text-[9px] font-code font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
                ${item.frequency}
              </span>
            </div>

            <!-- "Say this out loud" box -->
            <div class="p-3.5 rounded-xl bg-slate-800/50 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-code uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">record_voice_over</span>
                  Say this in 20 seconds
                </span>
                <button
                  class="copy-dist-btn text-slate-400 hover:text-white p-0.5 text-[11px] cursor-pointer"
                  data-copy="${encodeURIComponent(item.sayThis20s)}"
                  title="Copy 20-second pitch"
                >
                  <span class="material-symbols-outlined text-[14px]">content_copy</span>
                </button>
              </div>
              <p class="text-[12px] text-slate-200 dark:text-[#E2E8F0] leading-relaxed italic">
                "${item.sayThis20s}"
              </p>
            </div>

            <!-- Diagram or Code Snippet -->
            ${item.codeOrDiagram ? `
              <div class="p-3 rounded-lg bg-slate-950 dark:bg-[#0A0E17] border border-slate-800 dark:border-white/5 overflow-x-auto">
                <pre class="font-code text-[11px] text-cyan-300 leading-tight">${item.codeOrDiagram.trim()}</pre>
              </div>
            ` : ''}

            <!-- Interviewer Trap Callout -->
            <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex flex-col gap-1">
              <div class="flex items-center gap-1.5 text-rose-300 text-[11px] font-code font-bold">
                <span class="material-symbols-outlined text-[14px] text-rose-400">warning</span>
                <span>Follow-Up Trap: "${item.interviewerTrap}"</span>
              </div>
              <p class="text-[11px] text-slate-200 dark:text-slate-300 leading-relaxed pl-5">
                → ${item.trapAnswer}
              </p>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap items-center gap-1 pt-1 mt-auto">
              ${item.tags.map(t => `
                <span class="px-1.5 py-0.2 rounded text-[9px] font-code bg-slate-800 text-slate-400 dark:bg-slate-800/60 dark:text-slate-400 border border-slate-700/50 dark:border-white/5">${t}</span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
