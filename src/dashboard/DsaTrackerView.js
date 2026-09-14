/**
 * 45-Day Interview Prep OS - DSA Problem Tracker Workspace
 * Dedicated full-width workspace displaying all 100 high-frequency senior DSA problems
 * with real-time category filtering, difficulty selection, live search, and confidence tracking.
 */

import { state, getMetrics } from './state.js';

export function renderDsaTrackerView(statusFilter = 'all', patternFilter = 'all', diffFilter = 'all', searchQuery = '') {
  const problems = state.dsaProblems || [];
  const m = getMetrics(state);

  // Extract unique patterns
  const patternsSet = new Set();
  problems.forEach(p => {
    if (p.pattern) patternsSet.add(p.pattern);
    else if (p.category) patternsSet.add(p.category);
  });
  const patterns = Array.from(patternsSet).sort();

  let filtered = [...problems];

  if (statusFilter === 'mastered') {
    filtered = filtered.filter(p => p.status === 'Mastered');
  } else if (statusFilter === 'in-progress') {
    filtered = filtered.filter(p => p.status === 'In Progress');
  } else if (statusFilter === 'queued') {
    filtered = filtered.filter(p => !p.status || p.status === 'Queued');
  }

  if (patternFilter !== 'all') {
    filtered = filtered.filter(p => p.pattern === patternFilter || p.category === patternFilter);
  }

  if (diffFilter !== 'all') {
    filtered = filtered.filter(p => (p.difficulty || '').toLowerCase() === diffFilter.toLowerCase());
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      (p.title || '').toLowerCase().includes(q) ||
      (p.pattern || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  return `
    <div class="flex flex-col gap-5 w-full animate-fadeIn" id="dsa-tracker-view">
      
      <!-- Top Header & Metrics Banner -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-black/40 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col gap-1.5 z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/30 text-[#818CF8] flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">terminal</span>
            </div>
            <h1 class="font-sans text-[20px] font-bold text-white tracking-tight">100 Core DSA Problems</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-code bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">Cloud Catalog</span>
          </div>
          <p class="text-[13px] text-slate-400 max-w-2xl leading-relaxed">
            Curated high-frequency senior interview patterns. Master these 100 core problems to cover 95% of FAANG algorithmic rounds without rote memorization.
          </p>
        </div>

        <!-- Metric Badges -->
        <div class="flex items-center gap-3 z-10 shrink-0">
          <div class="px-4 py-2 bg-[#0F1626] border border-[#24314A] rounded-lg flex flex-col items-center">
            <span class="text-[10px] font-code text-slate-400 uppercase tracking-wider">Mastered</span>
            <span class="text-[18px] font-bold font-code text-emerald-400">${m.dsaSolved} / ${m.totalDsa}</span>
          </div>
          <div class="px-4 py-2 bg-[#0F1626] border border-[#24314A] rounded-lg flex flex-col items-center">
            <span class="text-[10px] font-code text-slate-400 uppercase tracking-wider">In Progress</span>
            <span class="text-[18px] font-bold font-code text-[#38BDF8]">${m.dsaInProgress}</span>
          </div>
          <div class="px-4 py-2 bg-[#0F1626] border border-[#24314A] rounded-lg flex flex-col items-center">
            <span class="text-[10px] font-code text-slate-400 uppercase tracking-wider">Completion</span>
            <span class="text-[18px] font-bold font-code text-indigo-300">${m.dsaPct}%</span>
          </div>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#0F1626] border border-[#24314A] p-3 rounded-xl">
        <!-- Status Tabs -->
        <div class="flex items-center gap-1 bg-[#141C2E] border border-[#24314A] p-0.5 rounded-lg overflow-x-auto">
          <button class="dsa-tab px-3 py-1 rounded text-[11.5px] font-code transition-colors cursor-pointer ${statusFilter === 'all' ? 'bg-[#6366F1] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'}" data-status="all">
            All (${problems.length})
          </button>
          <button class="dsa-tab px-3 py-1 rounded text-[11.5px] font-code transition-colors cursor-pointer ${statusFilter === 'in-progress' ? 'bg-[#6366F1] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'}" data-status="in-progress">
            In Progress (${m.dsaInProgress})
          </button>
          <button class="dsa-tab px-3 py-1 rounded text-[11.5px] font-code transition-colors cursor-pointer ${statusFilter === 'mastered' ? 'bg-[#6366F1] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'}" data-status="mastered">
            Mastered (${m.dsaSolved})
          </button>
          <button class="dsa-tab px-3 py-1 rounded text-[11.5px] font-code transition-colors cursor-pointer ${statusFilter === 'queued' ? 'bg-[#6366F1] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'}" data-status="queued">
            Queued (${m.dsaQueued})
          </button>
        </div>

        <!-- Secondary Filters & Search -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Pattern Dropdown -->
          <select id="dsa-pattern-filter" class="bg-[#141C2E] border border-[#24314A] text-slate-300 text-[11.5px] font-code rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#6366F1] cursor-pointer max-w-[170px]">
            <option value="all" ${patternFilter === 'all' ? 'selected' : ''}>All Patterns (${patterns.length})</option>
            ${patterns.map(pat => `
              <option value="${escapeHtml(pat)}" ${patternFilter === pat ? 'selected' : ''}>${escapeHtml(pat)}</option>
            `).join('')}
          </select>

          <!-- Difficulty Dropdown -->
          <select id="dsa-diff-filter" class="bg-[#141C2E] border border-[#24314A] text-slate-300 text-[11.5px] font-code rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#6366F1] cursor-pointer">
            <option value="all" ${diffFilter === 'all' ? 'selected' : ''}>All Difficulties</option>
            <option value="easy" ${diffFilter === 'easy' ? 'selected' : ''}>Easy (${problems.filter(p => p.difficulty === 'Easy').length})</option>
            <option value="medium" ${diffFilter === 'medium' ? 'selected' : ''}>Medium (${problems.filter(p => p.difficulty === 'Medium').length})</option>
            <option value="hard" ${diffFilter === 'hard' ? 'selected' : ''}>Hard (${problems.filter(p => p.difficulty === 'Hard').length})</option>
          </select>

          <!-- Live Search -->
          <div class="relative">
            <span class="material-symbols-outlined absolute left-2.5 top-2 text-[15px] text-slate-500">search</span>
            <input
              id="dsa-search-input"
              type="text"
              placeholder="Search problems or patterns..."
              value="${escapeHtml(searchQuery)}"
              class="bg-[#141C2E] border border-[#24314A] rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1] w-48 sm:w-60 transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Problem Table -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl overflow-hidden shadow-lg shadow-black/30">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr class="bg-[#0D1322] border-b border-[#24314A] text-slate-400 font-code text-[11px] uppercase tracking-wider select-none">
                <th class="py-3 px-3 w-12 text-center">#</th>
                <th class="py-3 px-3">Problem Title</th>
                <th class="py-3 px-3">Pattern / Topic</th>
                <th class="py-3 px-3 w-28">Difficulty</th>
                <th class="py-3 px-3 w-36">Status</th>
                <th class="py-3 px-3 w-32">Confidence</th>
                <th class="py-3 px-3 w-28">Revision</th>
                <th class="py-3 px-3 w-20 text-right">Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="8" class="py-12 text-center text-slate-400">
                    <span class="material-symbols-outlined text-[32px] text-slate-600 block mb-1">search_off</span>
                    No problems match your current filter criteria.
                  </td>
                </tr>
              ` : filtered.map((p, idx) => {
                const isMastered = p.status === 'Mastered';
                const isInProgress = p.status === 'In Progress';
                const stars = p.confidence || (isMastered ? 5 : isInProgress ? 3 : 0);

                let diffBadge = '';
                if (p.difficulty === 'Hard') {
                  diffBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">Hard</span>`;
                } else if (p.difficulty === 'Medium') {
                  diffBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">Medium</span>`;
                } else {
                  diffBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Easy</span>`;
                }

                return `
                  <tr class="hover:bg-[#182238]/60 transition-colors group">
                    <td class="py-3 px-3 text-center font-code text-[11px] text-slate-500">
                      ${idx + 1}
                    </td>
                    <td class="py-3 px-3">
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <span class="material-symbols-outlined text-[15px] ${isMastered ? 'text-emerald-400' : isInProgress ? 'text-[#38BDF8]' : 'text-slate-600'}">
                            ${isMastered ? 'check_circle' : isInProgress ? 'pending' : 'code'}
                          </span>
                          <span class="font-medium text-slate-200 group-hover:text-[#38BDF8] group-hover:underline cursor-pointer truncate" data-open-problem="${p.id}" title="${escapeHtml(p.description || p.title)}">
                            ${escapeHtml(p.title)}
                          </span>
                        </div>
                        ${p.link ? `
                          <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-[#38BDF8] p-1 rounded hover:bg-[#1e293b] transition-colors inline-flex items-center shrink-0" title="Solve on LeetCode" onclick="event.stopPropagation();">
                            <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                          </a>
                        ` : ''}
                      </div>
                    </td>
                    <td class="py-3 px-3 text-slate-400 font-code text-[11px]">
                      ${escapeHtml(p.pattern || p.category || 'Core DSA')}
                    </td>
                    <td class="py-3 px-3">
                      ${diffBadge}
                    </td>
                    <td class="py-3 px-3">
                      <select
                        class="dsa-status-select bg-[#0F1626] border text-[10.5px] font-code font-semibold rounded px-2 py-1 cursor-pointer focus:outline-none ${isMastered ? 'border-emerald-500/40 text-emerald-400' : isInProgress ? 'border-indigo-500/40 text-indigo-300' : 'border-[#24314A] text-slate-400'}"
                        data-problem-id="${p.id}"
                      >
                        <option value="Queued" ${!isMastered && !isInProgress ? 'selected' : ''}>Queued</option>
                        <option value="In Progress" ${isInProgress ? 'selected' : ''}>In Progress</option>
                        <option value="Mastered" ${isMastered ? 'selected' : ''}>Mastered</option>
                      </select>
                    </td>
                    <td class="py-3 px-3">
                      <div class="flex items-center gap-0.5 text-amber-400 text-[12px]">
                        ${[1, 2, 3, 4, 5].map(starNum => `
                          <button
                            type="button"
                            class="dsa-star-btn hover:scale-125 transition-transform cursor-pointer ${starNum <= stars ? 'text-amber-400' : 'text-slate-700'}"
                            data-problem-id="${p.id}"
                            data-star="${starNum}"
                            title="Rate ${starNum} Stars"
                          >★</button>
                        `).join('')}
                      </div>
                    </td>
                    <td class="py-3 px-3 text-slate-400 font-code text-[11px]">
                      ${escapeHtml(p.revision || 'Scheduled')}
                    </td>
                    <td class="py-3 px-3 text-right font-code text-[11px] text-slate-400">
                      ${escapeHtml(p.timeSpent || '—')}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="p-3.5 bg-[#0D1322] border-t border-[#24314A] flex items-center justify-between text-[11px] font-code text-slate-400">
          <span>Showing ${filtered.length} of ${problems.length} problems</span>
          <span class="text-emerald-400 font-semibold">Changes persist automatically to your Supabase cloud state</span>
        </div>
      </div>

    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
