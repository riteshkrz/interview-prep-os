/**
 * 45-Day Interview Prep OS - System Design Workspace
 * Dedicated view showcasing the 20 Senior Production System Design Specifications
 * managed in Supabase database with live progress tracking and rubric deep-dives.
 */

import { state, getMetrics, updateProblemStatus, updateProblemStars } from './state.js';

export function renderSystemDesignView(filterTab = 'all', searchQuery = '', diffFilter = 'all') {
  const specs = state.systemSpecs || [];
  const m = getMetrics(state);

  let filtered = [...specs];

  if (filterTab === 'in-progress') {
    filtered = filtered.filter(s => s.status === 'In Progress');
  } else if (filterTab === 'mastered') {
    filtered = filtered.filter(s => s.status === 'Mastered');
  } else if (filterTab === 'queued') {
    filtered = filtered.filter(s => !s.status || s.status === 'Queued');
  }

  if (diffFilter !== 'all') {
    filtered = filtered.filter(s => (s.difficulty || '').toLowerCase() === diffFilter.toLowerCase());
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(s => 
      (s.title || '').toLowerCase().includes(q) ||
      (s.domain || '').toLowerCase().includes(q) ||
      (s.rubric?.scope || '').toLowerCase().includes(q)
    );
  }

  return `
    <div class="flex flex-col gap-5 w-full animate-fadeIn" id="system-design-view">
      
      <!-- Top Header & Architecture Metrics Banner -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-black/40 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col gap-1.5 z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">schema</span>
            </div>
            <h1 class="font-sans text-[20px] font-bold text-white tracking-tight">System Design Workspace</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-code bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold uppercase">L5 / L6 Staff Level</span>
          </div>
          <p class="text-[13px] text-slate-400 max-w-2xl leading-relaxed">
            20 production-grade architectural templates covering storage, real-time streaming, geospatial dispatch, and transaction ledgers with capacity estimates, API contracts, partitioned storage data models, and reference links.
          </p>
        </div>

        <!-- Quick Metrics Badges -->
        <div class="flex items-center gap-3 z-10 shrink-0">
          <div class="px-4 py-2.5 bg-[#0F1626] border border-[#24314A] rounded-lg flex flex-col items-center">
            <span class="text-[10px] font-code text-slate-400 uppercase tracking-wider">Mastered</span>
            <span class="text-[18px] font-bold font-code text-emerald-400">${m.specsSolved} / ${m.totalSpecs}</span>
          </div>
          <div class="px-4 py-2.5 bg-[#0F1626] border border-[#24314A] rounded-lg flex flex-col items-center">
            <span class="text-[10px] font-code text-slate-400 uppercase tracking-wider">In Progress</span>
            <span class="text-[18px] font-bold font-code text-[#38BDF8]">${m.specsInProgress}</span>
          </div>
        </div>
      </div>

      <!-- Controls: Filters, Difficulty & Search Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0F1626] border border-[#24314A] p-3 rounded-xl">
        <!-- Status Tabs -->
        <div class="flex items-center gap-1 bg-[#141C2E] border border-[#24314A] p-0.5 rounded-lg overflow-x-auto">
          <button class="sys-tab px-3 py-1 rounded text-[11.5px] font-code transition-colors cursor-pointer ${filterTab === 'all' ? 'bg-[#6366F1] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'}" data-tab="all">
            All Specs (${specs.length})
          </button>
          <button class="sys-tab px-3 py-1 rounded text-[11.5px] font-code transition-colors cursor-pointer ${filterTab === 'in-progress' ? 'bg-[#6366F1] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'}" data-tab="in-progress">
            In Progress (${m.specsInProgress})
          </button>
          <button class="sys-tab px-3 py-1 rounded text-[11.5px] font-code transition-colors cursor-pointer ${filterTab === 'mastered' ? 'bg-[#6366F1] text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-white'}" data-tab="mastered">
            Mastered (${m.specsSolved})
          </button>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Difficulty Filter -->
          <select id="sys-diff-filter" class="bg-[#141C2E] border border-[#24314A] text-slate-300 text-[11.5px] font-code rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#6366F1] cursor-pointer">
            <option value="all" ${diffFilter === 'all' ? 'selected' : ''}>All Difficulties</option>
            <option value="hard" ${diffFilter === 'hard' ? 'selected' : ''}>Hard Only</option>
            <option value="medium" ${diffFilter === 'medium' ? 'selected' : ''}>Medium Only</option>
          </select>

          <!-- Search Bar -->
          <div class="relative">
            <span class="material-symbols-outlined absolute left-2.5 top-2 text-[15px] text-slate-500">search</span>
            <input
              id="sys-search-input"
              type="text"
              placeholder="Search architectures..."
              value="${escapeHtml(searchQuery)}"
              class="bg-[#141C2E] border border-[#24314A] rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1] w-44 sm:w-56 transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Specs Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${filtered.length === 0 ? `
          <div class="col-span-full py-12 text-center bg-[#141C2E] border border-[#24314A] rounded-xl text-slate-400 flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-[32px] text-slate-600">search_off</span>
            <span class="text-[13px] font-medium">No system design specifications match your filter criteria.</span>
            <button class="sys-tab text-[12px] font-code text-[#38BDF8] hover:underline cursor-pointer" data-tab="all">Clear filters</button>
          </div>
        ` : filtered.map((spec) => {
          const isMastered = spec.status === 'Mastered';
          const isInProgress = spec.status === 'In Progress';
          const stars = spec.stars || (isMastered ? 5 : isInProgress ? 3 : 0);

          return `
            <div class="bg-[#141C2E] border ${isMastered ? 'border-emerald-500/30 shadow-emerald-500/5' : isInProgress ? 'border-indigo-500/40 shadow-indigo-500/5' : 'border-[#24314A]'} rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-[#38BDF8]/60 transition-all shadow-md group">
              
              <!-- Card Top -->
              <div class="flex flex-col gap-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2 py-0.5 rounded text-[10px] font-code font-bold ${spec.difficulty === 'Hard' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'}">
                      ${spec.difficulty || 'Hard'}
                    </span>
                    <span class="text-[11px] font-code text-[#38BDF8] font-medium">${escapeHtml(spec.domain || 'Distributed Architecture')}</span>
                    ${(spec.referenceLinks || spec.reference_links || []).length > 0 ? `
                      <span class="px-1.5 py-0.2 rounded text-[10px] font-code bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1" title="${(spec.referenceLinks || spec.reference_links).length} reference links available in blueprint">
                        <span class="material-symbols-outlined text-[11px]">link</span>
                        <span>${(spec.referenceLinks || spec.reference_links).length} Refs</span>
                      </span>
                    ` : ''}
                  </div>

                  <!-- Status Select Pill -->
                  <select
                    class="spec-status-select bg-[#0F1626] border text-[10.5px] font-code font-semibold rounded px-2 py-0.5 cursor-pointer focus:outline-none ${isMastered ? 'border-emerald-500/40 text-emerald-400' : isInProgress ? 'border-indigo-500/40 text-indigo-300' : 'border-[#24314A] text-slate-400'}"
                    data-spec-id="${spec.id}"
                  >
                    <option value="Queued" ${!isMastered && !isInProgress ? 'selected' : ''}>Queued</option>
                    <option value="In Progress" ${isInProgress ? 'selected' : ''}>In Progress</option>
                    <option value="Mastered" ${isMastered ? 'selected' : ''}>Mastered</option>
                  </select>
                </div>

                <div>
                  <h3 class="font-sans text-[16px] font-bold text-white group-hover:text-[#38BDF8] transition-colors flex items-center gap-1.5 cursor-pointer" data-open-problem="${spec.id}">
                    <span>${escapeHtml(spec.title)}</span>
                    <span class="material-symbols-outlined text-[15px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </h3>
                  <p class="text-[12px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    ${escapeHtml(spec.rubric?.scope || 'High-throughput distributed architecture template with sub-millisecond SLOs.')}
                  </p>
                </div>

                <!-- Rubric Highlights Grid -->
                <div class="p-3 rounded-lg bg-[#0F1626] border border-[#24314A]/80 flex flex-col gap-2 text-[11px]">
                  <div class="flex items-start gap-2">
                    <span class="text-slate-500 font-code shrink-0">API:</span>
                    <span class="text-slate-300 font-code truncate">${escapeHtml(spec.rubric?.api?.split('\n')[0] || 'REST / gRPC Gateway')}</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-slate-500 font-code shrink-0">Storage:</span>
                    <span class="text-slate-300 font-code truncate">${escapeHtml(spec.rubric?.dataModel?.slice(0, 60) || 'Clustered hash store')}...</span>
                  </div>
                </div>
              </div>

              <!-- Card Bottom Action Bar -->
              <div class="pt-3 border-t border-[#24314A]/80 flex items-center justify-between gap-2">
                <!-- Stars Rating -->
                <div class="flex items-center gap-0.5 text-amber-400 text-[14px]">
                  ${[1, 2, 3, 4, 5].map(starNum => `
                    <button
                      type="button"
                      class="spec-star-btn hover:scale-125 transition-transform cursor-pointer text-[13px] ${starNum <= stars ? 'text-amber-400' : 'text-slate-700'}"
                      data-spec-id="${spec.id}"
                      data-star="${starNum}"
                      title="Rate ${starNum} Stars"
                    >★</button>
                  `).join('')}
                </div>

                <!-- View Blueprint Button -->
                <button
                  type="button"
                  class="open-spec-modal-btn px-3 py-1.5 rounded-lg bg-[#182238] hover:bg-[#6366F1] text-slate-200 hover:text-white border border-[#24314A] hover:border-indigo-500 text-[11.5px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  data-open-problem="${spec.id}"
                >
                  <span class="material-symbols-outlined text-[14px]">visibility</span>
                  <span>View Full Blueprint</span>
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
