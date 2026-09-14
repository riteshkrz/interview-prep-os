import { state, FULL_45_DAY_CURRICULUM } from './state.js';

export function renderCuratedDatabase(activeTab = 'all', searchQuery = '', diffFilter = 'all', currentPage = 1) {
  // Count numbers for tabs
  const allCount = state.dsaProblems.length;
  const inProgressCount = state.dsaProblems.filter(p => p.status === 'In Progress').length;
  const revisionCount = state.dsaProblems.filter(p => p.revision && (p.revision.includes('Today') || p.revision.includes('Tomorrow'))).length;
  const masteredCount = state.dsaProblems.filter(p => p.status === 'Mastered').length;

  // Filter items
  let items = [...state.dsaProblems];
  if (activeTab === 'in-progress') {
    items = items.filter(p => p.status === 'In Progress');
  } else if (activeTab === 'revision') {
    items = items.filter(p => p.revision && (p.revision.includes('Today') || p.revision.includes('Tomorrow') || p.status === 'In Progress'));
  } else if (activeTab === 'mastered') {
    items = items.filter(p => p.status === 'Mastered');
  }

  if (diffFilter !== 'all') {
    items = items.filter(p => p.difficulty?.toLowerCase() === diffFilter.toLowerCase());
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    items = items.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.pattern.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }

  // 10 rows per page pagination to match Quick Actions column height
  const PAGE_SIZE = 10;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pageItems = items.slice(startIndex, endIndex);

  const rowsHtml = pageItems.map(p => {
    let statusPill = '';
    if (p.status === 'Mastered') {
      statusPill = `<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold font-code bg-emerald-500/15 border border-emerald-500/30 text-[#10B981]">Mastered</span>`;
    } else if (p.status === 'In Progress') {
      statusPill = `<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold font-code bg-indigo-500/15 border border-indigo-500/30 text-[#818CF8]">In Progress</span>`;
    } else {
      statusPill = `<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium font-code bg-[#182238] text-[#64748B] border border-[#24314A]">Queued</span>`;
    }

    const isUrgent = p.revision && (p.revision.includes('Today') || p.revision.includes('Tomorrow'));
    const revisionHtml = isUrgent 
      ? `<span class="text-[#F59E0B] font-semibold flex items-center gap-1 font-code text-[11px]"><span class="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shadow-xs shadow-[#F59E0B]/50 animate-pulse"></span> ${escapeHtml(p.revision)}</span>`
      : `<span class="text-[#94A3B8] font-code text-[11px]">${escapeHtml(p.revision || 'Scheduled')}</span>`;

    const diffClass = p.difficulty === 'Hard' ? 'text-[#F59E0B] font-semibold' : 'text-[#94A3B8]';

    return `
      <tr class="hover:bg-[#182238]/60 transition-colors group cursor-pointer" data-open-problem="${p.id}">
        <td class="py-2.5 px-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="material-symbols-outlined text-[14px] ${p.status === 'In Progress' ? 'text-[#38BDF8]' : 'text-[#64748B]'}">
                ${p.category === 'System Design' ? 'terminal' : 'description'}
              </span>
              <span class="font-medium text-[#F8FAFC] group-hover:text-[#38BDF8] group-hover:underline truncate" title="${escapeHtml(p.description || p.title)}">
                ${escapeHtml(p.title)}
              </span>
            </div>
            ${p.link ? `
              <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="text-[#64748B] hover:text-[#38BDF8] p-1 rounded hover:bg-[#1e293b] transition-colors inline-flex items-center shrink-0" title="Solve on LeetCode" onclick="event.stopPropagation();">
                <span class="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            ` : ''}
          </div>
        </td>
        <td class="py-2.5 px-2.5">
          ${statusPill}
        </td>
        <td class="py-2.5 px-2.5 text-[#94A3B8] font-code text-[11px]">
          ${escapeHtml(p.pattern)}
        </td>
        <td class="py-2.5 px-2.5 font-code text-[11px] ${diffClass}">
          ${escapeHtml(p.difficulty)}
        </td>
        <td class="py-2.5 px-2.5 text-[#F59E0B] tracking-tight text-[11px]">
          ${'★'.repeat(p.confidence || (p.status === 'Mastered' ? 5 : p.status === 'In Progress' ? 3 : 0))}${'☆'.repeat(5 - (p.confidence || (p.status === 'Mastered' ? 5 : p.status === 'In Progress' ? 3 : 0)))}
        </td>
        <td class="py-2.5 px-2.5">
          ${revisionHtml}
        </td>
        <td class="py-2.5 px-2.5 font-code text-[11px] text-[#94A3B8] text-right">
          ${escapeHtml(p.timeSpent || '—')}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="bg-[#141C2E] border border-[#24314A] rounded-md p-5 flex flex-col justify-between h-full shadow-sm shadow-black/40">
      <div class="flex flex-col gap-3.5">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="material-symbols-outlined text-[18px] text-[#38BDF8]">table_rows</span>
            <h2 class="font-sans text-[15px] text-[#F8FAFC] font-bold">Curated Preparation Database</h2>
            <span class="px-2 py-0.5 rounded bg-[#182238] border border-[#24314A] text-[#38BDF8] text-[10px] font-code flex items-center gap-1" title="Dynamic questions loaded from Supabase Database">
              <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              <span>Cloud Catalog (${allCount})</span>
            </span>
          </div>

          <!-- Filters & Search -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Search box -->
            <div class="relative">
              <span class="material-symbols-outlined absolute left-2 top-1 text-[13px] text-[#64748B]">search</span>
              <input
                type="text"
                id="db-search-input"
                placeholder="Search problems..."
                value="${escapeHtml(searchQuery)}"
                class="bg-[#0F1626] border border-[#24314A] text-[#F8FAFC] text-[11px] font-sans pl-6 pr-2 py-0.5 rounded-md focus:outline-none focus:border-[#6366F1] placeholder-[#64748B] w-32 sm:w-40"
              />
            </div>

            <!-- Difficulty dropdown -->
            <select id="db-diff-filter" class="bg-[#0F1626] border border-[#24314A] text-[#94A3B8] text-[11px] font-code px-2 py-0.5 rounded-md focus:outline-none focus:border-[#6366F1] cursor-pointer">
              <option value="all" ${diffFilter === 'all' ? 'selected' : ''}>All Diff</option>
              <option value="easy" ${diffFilter === 'easy' ? 'selected' : ''}>Easy</option>
              <option value="medium" ${diffFilter === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="hard" ${diffFilter === 'hard' ? 'selected' : ''}>Hard</option>
            </select>

            <!-- Tabs -->
            <div class="flex items-center gap-1 bg-[#0F1626] border border-[#24314A] p-0.5 rounded-md">
              <button class="table-tab px-2 py-0.5 rounded text-[11px] font-code transition-colors cursor-pointer ${activeTab === 'all' ? 'bg-[#182238] text-[#38BDF8] border border-[#38BDF8]/40 shadow-xs font-semibold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}" data-tab="all" data-dbtab="all">
                All (${allCount})
              </button>
              <button class="table-tab px-2 py-0.5 rounded text-[11px] font-code transition-colors cursor-pointer ${activeTab === 'in-progress' ? 'bg-[#182238] text-[#38BDF8] border border-[#38BDF8]/40 shadow-xs font-semibold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}" data-tab="in-progress" data-dbtab="in-progress">
                Active (${inProgressCount})
              </button>
              <button class="table-tab px-2 py-0.5 rounded text-[11px] font-code transition-colors cursor-pointer ${activeTab === 'revision' ? 'bg-[#182238] text-[#38BDF8] border border-[#38BDF8]/40 shadow-xs font-semibold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}" data-tab="revision" data-dbtab="revision">
                Revision (${revisionCount})
              </button>
              <button class="table-tab px-2 py-0.5 rounded text-[11px] font-code transition-colors cursor-pointer ${activeTab === 'mastered' ? 'bg-[#182238] text-[#38BDF8] border border-[#38BDF8]/40 shadow-xs font-semibold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}" data-tab="mastered" data-dbtab="mastered">
                Solved (${masteredCount})
              </button>
            </div>
          </div>
        </div>

        <!-- Database Table -->
        <div class="overflow-x-auto -mx-5 px-5 flex-1">
          <table class="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr class="text-[10px] uppercase tracking-wider text-[#94A3B8] font-code bg-[#0F1626] border-y border-[#24314A]">
                <th class="py-2 px-2.5">Problem / System Spec</th>
                <th class="py-2 px-2.5">Status</th>
                <th class="py-2 px-2.5">Pattern / Domain</th>
                <th class="py-2 px-2.5">Difficulty</th>
                <th class="py-2 px-2.5">Confidence</th>
                <th class="py-2 px-2.5">Revision Due</th>
                <th class="py-2 px-2.5 text-right">Time Spent</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A] text-[12px] font-sans">
              ${rowsHtml || '<tr><td colspan="7" class="py-4 text-center text-[#64748B]">No problems found matching this filter.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Table Footer & Pagination -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-2 text-[11px] font-code text-[#94A3B8] border-t border-[#24314A]">
        <div>
          Showing <span class="text-[#F8FAFC] font-semibold">${totalItems === 0 ? 0 : startIndex + 1}–${endIndex}</span> of <span class="text-[#F8FAFC] font-semibold">${totalItems}</span> problems
          ${totalItems !== allCount ? `<span class="text-[#64748B] text-[10px] ml-1">(filtered from ${allCount})</span>` : ''}
        </div>

        <div class="flex items-center gap-3">
          ${totalPages > 1 ? `
            <div class="flex items-center gap-1 bg-[#0F1626] border border-[#24314A] p-0.5 rounded-md">
              <button 
                class="db-page-btn px-2 py-0.5 rounded text-[11px] font-code transition-colors flex items-center gap-0.5 ${safePage > 1 ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#182238] cursor-pointer' : 'text-[#475569] cursor-not-allowed opacity-50'}" 
                data-page="${safePage - 1}"
                ${safePage <= 1 ? 'disabled' : ''}
                title="Previous page"
              >
                <span class="material-symbols-outlined text-[13px]">chevron_left</span>
                Prev
              </button>
              
              <span class="px-2 text-[10px] text-[#64748B] font-medium select-none">
                Page <strong class="text-[#38BDF8]">${safePage}</strong> of ${totalPages}
              </span>

              <button 
                class="db-page-btn px-2 py-0.5 rounded text-[11px] font-code transition-colors flex items-center gap-0.5 ${safePage < totalPages ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#182238] cursor-pointer' : 'text-[#475569] cursor-not-allowed opacity-50'}" 
                data-page="${safePage + 1}"
                ${safePage >= totalPages ? 'disabled' : ''}
                title="Next page"
              >
                Next
                <span class="material-symbols-outlined text-[13px]">chevron_right</span>
              </button>
            </div>
          ` : ''}

          <button id="open-full-database-btn" class="text-[#38BDF8] hover:underline flex items-center gap-0.5 font-semibold transition-colors cursor-pointer text-[11px]">
            Open full database
            <span class="material-symbols-outlined text-[13px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
