/**
 * 45-Day Interview Prep OS - Low-Level Design & Machine Coding Studio Workspace
 * Provides an interactive environment for practicing FAANG/Tier-1 machine coding rounds.
 */

import { LLD_PROBLEMS } from './lldTopicsData.js';

let activeProblemId = LLD_PROBLEMS[0]?.id || 'lld-parking-lot';
let selectedCategory = 'all';
let searchQuery = '';

export function getActiveLldProblemId() {
  return activeProblemId;
}

export function setActiveLldProblemId(id) {
  activeProblemId = id;
}

export function renderLldStudioView(filterCategory = 'all', search = '') {
  selectedCategory = filterCategory;
  searchQuery = search.toLowerCase().trim();

  const filteredProblems = LLD_PROBLEMS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery) ||
      p.subtitle.toLowerCase().includes(searchQuery) ||
      p.companies.some(c => c.toLowerCase().includes(searchQuery)) ||
      p.patterns.some(pat => pat.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const activeProblem = LLD_PROBLEMS.find(p => p.id === activeProblemId) || filteredProblems[0] || LLD_PROBLEMS[0];

  const categories = ['all', 'Real-World Systems', 'Financial Systems', 'Infrastructure & Concurrency', 'Hardware & Automation', 'Core Data Structures'];

  return `
    <div class="lld-studio-view flex flex-col gap-6 w-full animate-fadeIn">
      <!-- Header Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/60 dark:bg-[#0F1626] border border-slate-700/60 dark:border-[#24314A] shadow-sm">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#38BDF8] text-[24px]">architecture</span>
            <h1 class="text-xl font-bold text-slate-100 dark:text-[#F8FAFC] tracking-tight">Machine Coding &amp; LLD Studio</h1>
            <span class="px-2 py-0.5 rounded text-[10px] font-code font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">SYSTEMCRAFT CURATED</span>
          </div>
          <p class="text-[13px] text-slate-300 dark:text-[#94A3B8]">
            Master 90-minute machine coding rounds (Flipkart, PhonePe, Amazon, Swiggy, Uber) with clean OOP, SOLID design patterns, thread-safety, and complete runnable code.
          </p>
        </div>

        <div class="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span class="text-[12px] font-code text-slate-300 dark:text-[#94A3B8]">Problems Available:</span>
          <span class="px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-code font-bold text-[13px]">${LLD_PROBLEMS.length}</span>
        </div>
      </div>

      <!-- Controls: Category Filter & Search -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <!-- Category Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          ${categories.map(cat => `
            <button
              data-lld-cat="${cat}"
              class="lld-category-btn px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap cursor-pointer ${selectedCategory === cat ? 'bg-[#4F46E5] text-white shadow-xs' : 'bg-slate-800/80 dark:bg-[#141C2E] border border-slate-700/80 dark:border-[#24314A] text-slate-300 dark:text-[#94A3B8] hover:text-white hover:bg-slate-700 dark:hover:bg-[#1E293B]'}"
            >
              ${cat === 'all' ? 'All Domains' : cat}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar -->
        <div class="relative w-full sm:w-64 shrink-0">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-slate-400">search</span>
          <input
            id="lld-search-input"
            type="text"
            placeholder="Search problems, patterns, companies..."
            value="${searchQuery}"
            class="w-full bg-slate-900/80 dark:bg-[#0F1626] border border-slate-700 dark:border-[#24314A] rounded-lg pl-9 pr-3 py-1.5 text-[12px] text-slate-200 dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      <!-- 2-Column Studio Workspace -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Column: Problem List (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-2.5">
          <span class="text-[11px] font-code uppercase tracking-wider text-slate-400 font-semibold px-1">
            Machine Coding Problems (${filteredProblems.length})
          </span>

          <div class="flex flex-col gap-2 max-h-[750px] overflow-y-auto pr-1">
            ${filteredProblems.length === 0 ? `
              <div class="p-6 text-center text-slate-400 border border-dashed border-slate-700 rounded-xl">
                No problems match your query. Try clearing filters.
              </div>
            ` : filteredProblems.map(p => {
              const isSelected = activeProblem && activeProblem.id === p.id;
              return `
                <div
                  data-select-lld="${p.id}"
                  class="p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-indigo-950/40 dark:bg-[#1E293B] border-indigo-500/70 dark:border-[#38BDF8] shadow-sm' : 'bg-slate-900/50 dark:bg-[#141C2E] border-slate-800 dark:border-[#24314A] hover:border-slate-600 dark:hover:border-slate-500'}"
                >
                  <div class="flex items-start justify-between gap-2">
                    <span class="font-semibold text-[13px] text-slate-100 dark:text-[#F8FAFC]">${p.title}</span>
                    <span class="text-[10px] font-code px-1.5 py-0.5 rounded font-bold shrink-0 ${p.difficulty === 'Hard' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}">
                      ${p.difficulty}
                    </span>
                  </div>

                  <p class="text-[11px] text-slate-300 dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                    ${p.subtitle}
                  </p>

                  <div class="flex flex-wrap items-center gap-1.5 pt-1">
                    ${p.patterns.slice(0, 3).map(pat => `
                      <span class="text-[9px] font-code px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">${pat}</span>
                    `).join('')}
                    <span class="ml-auto text-[10px] font-code text-slate-400">${p.duration}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right Column: Active Problem Deep Dive (8 cols) -->
        <div class="lg:col-span-8 flex flex-col gap-5">
          ${activeProblem ? renderActiveProblemDetail(activeProblem) : ''}
        </div>
      </div>
    </div>
  `;
}

function renderActiveProblemDetail(p) {
  return `
    <div class="p-6 rounded-2xl bg-slate-900/70 dark:bg-[#0F1626] border border-slate-700/80 dark:border-[#24314A] flex flex-col gap-6 shadow-sm">
      <!-- Title & Header Bar -->
      <div class="flex flex-col gap-2 pb-4 border-b border-slate-700/60 dark:border-[#24314A]">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <h2 class="text-xl font-bold text-slate-100 dark:text-[#F8FAFC]">${p.title}</h2>
            <span class="px-2 py-0.5 rounded text-[10px] font-code font-bold ${p.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">${p.difficulty}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-code bg-slate-800 text-slate-300 dark:bg-[#1E293B] dark:text-[#94A3B8] border border-slate-700 dark:border-white/10">${p.duration}</span>
          </div>

          <div class="flex items-center gap-1.5">
            ${p.companies.map(c => `
              <span class="px-2 py-0.5 rounded text-[10px] font-sans font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">${c}</span>
            `).join('')}
          </div>
        </div>
        <p class="text-[13px] text-slate-300 dark:text-[#94A3B8] leading-relaxed">${p.summary}</p>
      </div>

      <!-- Design Patterns & Core Requirements -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Functional Requirements -->
        <div class="p-4 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span class="text-[12px] font-bold text-slate-200 dark:text-[#F8FAFC] uppercase tracking-wider font-code">Functional Requirements</span>
          </div>
          <ul class="flex flex-col gap-1.5 text-[12px] text-slate-300 dark:text-[#94A3B8] list-disc list-inside">
            ${p.requirements.functional.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>

        <!-- Non-Functional & Concurrency -->
        <div class="p-4 rounded-xl bg-slate-800/40 dark:bg-[#141C2E] border border-slate-700/60 dark:border-[#24314A] flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-[#38BDF8]">tune</span>
            <span class="text-[12px] font-bold text-slate-200 dark:text-[#F8FAFC] uppercase tracking-wider font-code">SOLID &amp; Concurrency</span>
          </div>
          <ul class="flex flex-col gap-1.5 text-[12px] text-slate-300 dark:text-[#94A3B8] list-disc list-inside">
            ${p.requirements.nonFunctional.map(req => `<li>${req}</li>`).join('')}
          </ul>
          <div class="flex flex-wrap gap-1.5 pt-2">
            <span class="text-[11px] font-code text-slate-400">Key Patterns:</span>
            ${p.patterns.map(pat => `<span class="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-code font-bold">${pat}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Core Entities & Class Structure -->
      <div class="flex flex-col gap-2.5">
        <span class="text-[12px] font-bold text-slate-200 dark:text-[#F8FAFC] uppercase tracking-wider font-code flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px] text-amber-400">account_tree</span>
          Domain Entities &amp; Class Diagram
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
          ${p.entities.map(e => `
            <div class="p-2.5 rounded-lg bg-slate-800/30 dark:bg-[#141C2E]/60 border border-slate-700/40 dark:border-[#24314A]/80 flex flex-col gap-0.5">
              <span class="font-code font-bold text-[#38BDF8]">${e.name}</span>
              <span class="text-slate-300 dark:text-[#94A3B8] text-[11px]">${e.desc}</span>
            </div>
          `).join('')}
        </div>

        <!-- ASCII Class Diagram Box -->
        <div class="mt-2 p-3.5 rounded-xl bg-slate-950 dark:bg-[#0A0E17] border border-slate-800 dark:border-[#24314A] overflow-x-auto">
          <pre class="font-code text-[11px] text-emerald-400 leading-tight">${p.classDiagram.trim()}</pre>
        </div>
      </div>

      <!-- Runnable Implementation Code Snippet -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between">
          <span class="text-[12px] font-bold text-slate-200 dark:text-[#F8FAFC] uppercase tracking-wider font-code flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-indigo-400">code</span>
            Thread-Safe Core Implementation
          </span>
          <button
            class="copy-lld-code-btn px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-code flex items-center gap-1.5 transition-colors cursor-pointer"
            data-code="${encodeURIComponent(p.codeSnippet)}"
          >
            <span class="material-symbols-outlined text-[13px]">content_copy</span>
            <span>Copy Code</span>
          </button>
        </div>

        <div class="p-4 rounded-xl bg-slate-950 dark:bg-[#0A0E17] border border-slate-800 dark:border-[#24314A] overflow-x-auto">
          <pre class="font-code text-[12px] text-cyan-300 leading-relaxed">${p.codeSnippet}</pre>
        </div>
      </div>

      <!-- Interviewer Follow-ups & Evaluation Traps -->
      <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-amber-400">help</span>
          <span class="text-[12px] font-bold text-amber-300 uppercase tracking-wider font-code">Tough Interviewer Follow-Ups &amp; Traps</span>
        </div>
        <ul class="flex flex-col gap-2 text-[12px] text-slate-200 dark:text-slate-300">
          ${p.interviewerQuestions.map(q => `
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold shrink-0">?</span>
              <span>${q}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}
