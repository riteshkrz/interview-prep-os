/**
 * EngineerOS — Technical Monograph Reader
 * Immersive long-form reading experience for Senior & Staff System Design Case Studies.
 */

export function renderMonographReader(article, isBookmarked = false, isRead = false) {
  if (!article) return '';

  const sectionsHtml = article.sections.map((sec, idx) => {
    // Format markdown-like code blocks and headings in content
    const formattedContent = formatMarkdownContent(sec.content);

    return `
      <section id="sec-${idx}" class="mb-12 scroll-mt-28">
        <h2 class="font-headline text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2.5 pb-2 border-b border-[#1e2638]">
          <span class="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
          ${escapeHtml(sec.title)}
        </h2>
        <div class="prose prose-invert max-w-none text-slate-300 font-body text-[15px] leading-relaxed flex flex-col gap-4">
          ${formattedContent}
        </div>
      </section>
    `;
  }).join('');

  const keyTakeawaysHtml = (article.keyTakeaways || []).map(t => `
    <li class="flex items-start gap-2.5 text-[14px] text-slate-200">
      <span class="material-symbols-outlined text-emerald-400 text-[18px] shrink-0 mt-0.5">check_circle</span>
      <span>${escapeHtml(t)}</span>
    </li>
  `).join('');

  const faangRubricHtml = (article.faangRubric || []).map(r => `
    <li class="flex items-start gap-2.5 text-[13px] text-slate-300">
      <span class="material-symbols-outlined text-indigo-400 text-[18px] shrink-0 mt-0.5">psychology</span>
      <span>${escapeHtml(r)}</span>
    </li>
  `).join('');

  const tocHtml = article.sections.map((sec, idx) => `
    <a href="#sec-${idx}" class="toc-link block text-xs text-slate-400 hover:text-indigo-300 transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-indigo-500">
      ${escapeHtml(sec.title)}
    </a>
  `).join('');

  const tagsHtml = (article.tags || []).map(t => `
    <span class="px-2 py-0.5 rounded bg-[#161f33] border border-[#263552] text-indigo-300 font-mono text-[11px]">
      #${escapeHtml(t)}
    </span>
  `).join('');

  return `
    <div class="monograph-reader w-full min-h-screen bg-[#080c14] text-[#f1f5f9] pt-20 pb-24">
      <!-- Reading Progress Bar -->
      <div id="readingProgressBar" class="fixed top-16 lg:top-20 left-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 z-50 transition-all duration-150" style="width: 0%"></div>

      <div class="max-w-7xl mx-auto px-6 lg:px-12 pt-6">
        
        <!-- Top Navigation Bar -->
        <div class="flex items-center justify-between py-4 mb-8 border-b border-[#1e2638]">
          <a href="#/blog" id="backToBlogBtn" class="inline-flex items-center gap-2 text-sm font-label font-medium text-slate-400 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to All Case Studies</span>
          </a>

          <div class="flex items-center gap-2">
            <!-- Bookmark Button -->
            <button id="readerBookmarkBtn" data-article-id="${article.id}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-label transition-colors cursor-pointer ${isBookmarked ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-[#111625] border-[#20293d] text-slate-400 hover:text-white'}">
              <span class="material-symbols-outlined text-[16px]">${isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
              <span>${isBookmarked ? 'Saved in Reading List' : 'Save to Reading List'}</span>
            </button>

            <!-- Mark as Read Button -->
            <button id="readerMarkReadBtn" data-article-id="${article.id}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-label transition-colors cursor-pointer ${isRead ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold' : 'bg-[#111625] border-[#20293d] text-slate-400 hover:text-white'}">
              <span class="material-symbols-outlined text-[16px]">${isRead ? 'check_box' : 'check_box_outline_blank'}</span>
              <span>${isRead ? 'Completed ✓' : 'Mark as Read'}</span>
            </button>

            <!-- Share Button -->
            <button id="readerShareBtn" class="p-1.5 rounded-lg bg-[#111625] border border-[#20293d] text-slate-400 hover:text-white transition-colors cursor-pointer" title="Copy Link">
              <span class="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>

        <!-- Article Layout (Content + Sidebar) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <!-- MAIN CONTENT (col-span-8) -->
          <article class="lg:col-span-8 flex flex-col">
            
            <!-- Metadata & Title Header -->
            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span class="px-2.5 py-1 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
                ${escapeHtml(article.category)}
              </span>
              <span class="px-2.5 py-1 rounded bg-[#161f33] border border-[#263552] text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
                ${escapeHtml(article.company)}
              </span>
              <span class="px-2 py-0.5 rounded text-xs font-mono ${article.difficulty === 'Hard' ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'}">
                ${escapeHtml(article.difficulty)}
              </span>
              <span class="text-xs text-slate-400 font-mono ml-auto">
                ${escapeHtml(article.readTime)}
              </span>
            </div>

            <h1 class="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              ${escapeHtml(article.title)}
            </h1>

            <!-- Author & SLA Info Bar -->
            <div class="p-4 rounded-xl bg-[#111625] border border-[#20293d] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-headline font-bold text-white text-sm shadow-md shadow-indigo-500/30">
                  ${escapeHtml(article.author?.avatar || 'OS')}
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-white">${escapeHtml(article.author?.name || 'EngineerOS')}</span>
                  <span class="text-xs text-slate-400">${escapeHtml(article.author?.role || 'Staff Infrastructure Architect')} • ${escapeHtml(article.publishedDate)}</span>
                </div>
              </div>

              ${article.sla ? `
                <div class="flex items-center gap-2 bg-[#0c101c] px-3 py-1.5 rounded-lg border border-[#1e2638] text-xs font-mono text-emerald-400">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SLA: ${escapeHtml(article.sla)}</span>
                </div>
              ` : ''}
            </div>

            <!-- Executive Summary Callout -->
            <div class="p-5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-[#0e1424] border border-indigo-500/30 shadow-lg mb-10">
              <span class="font-mono text-xs uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5 mb-2">
                <span class="material-symbols-outlined text-[16px]">info</span>
                EXECUTIVE SUMMARY & PROBLEM CONTEXT
              </span>
              <p class="font-body text-[15px] text-slate-200 leading-relaxed">
                ${escapeHtml(article.summary)}
              </p>
            </div>

            <!-- Key Engineering Takeaways Box -->
            <div class="p-6 rounded-xl bg-[#0c101c] border border-emerald-500/30 shadow-lg mb-10">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-emerald-400 text-[20px]">verified</span>
                <h3 class="font-headline text-base font-bold text-white uppercase tracking-wider">
                  Core Architectural Takeaways
                </h3>
              </div>
              <ul class="space-y-3">
                ${keyTakeawaysHtml}
              </ul>
            </div>

            <!-- Monograph Sections -->
            <div class="monograph-body">
              ${sectionsHtml}
            </div>

            <!-- FAANG L5/L6 Senior Interview Rubric Box -->
            <div class="p-6 rounded-xl bg-[#111625] border border-indigo-500/40 shadow-xl mt-6 mb-12">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-indigo-400 text-[22px]">psychology</span>
                <h3 class="font-headline text-base font-bold text-white uppercase tracking-wider">
                  FAANG L5/L6 Senior Interview Discussion Points
                </h3>
              </div>
              <p class="text-xs text-slate-400 mb-4 font-body">
                When presenting this architecture in Staff/Senior System Design interviews, proactively address these key trade-offs before the interviewer asks:
              </p>
              <ul class="space-y-3">
                ${faangRubricHtml}
              </ul>
            </div>

            <!-- Bottom Navigation Bar -->
            <div class="p-6 rounded-xl bg-[#111625] border border-[#20293d] flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <a href="#/blog" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#182033] hover:bg-[#202b45] text-slate-300 hover:text-white border border-[#25324c] text-sm font-label transition-colors">
                <span class="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back to All Case Studies</span>
              </a>

              <div class="flex items-center gap-3">
                <button id="bottomMarkReadBtn" data-article-id="${article.id}" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-label text-sm font-semibold shadow-lg transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>${isRead ? 'Completed ✓' : 'Mark Case Study as Completed'}</span>
                </button>
              </div>
            </div>

          </article>

          <!-- SIDEBAR (col-span-4): Sticky TOC & Quick Actions -->
          <aside class="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
            
            <!-- Table of Contents Card -->
            <div class="p-5 rounded-xl bg-[#111625] border border-[#20293d] shadow-md flex flex-col gap-3">
              <span class="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-indigo-400">menu_book</span>
                TABLE OF CONTENTS
              </span>
              <div class="flex flex-col space-y-1">
                ${tocHtml}
              </div>
            </div>

            <!-- Tags Card -->
            <div class="p-5 rounded-xl bg-[#111625] border border-[#20293d] shadow-md flex flex-col gap-3">
              <span class="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-indigo-400">label</span>
                CATEGORIES & TOPICS
              </span>
              <div class="flex flex-wrap gap-1.5">
                ${tagsHtml}
              </div>
            </div>

            <!-- Interview Prep OS Promo Banner -->
            <div class="p-5 rounded-xl bg-gradient-to-br from-indigo-900/40 to-[#0e1424] border border-indigo-500/30 shadow-lg flex flex-col gap-3">
              <div class="flex items-center gap-2 text-indigo-300 font-headline font-bold text-sm">
                <span class="material-symbols-outlined text-[18px]">terminal</span>
                <span>Track Your Prep in OS</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Log this system design problem in your Daily Dashboard to track active recall retention and spaced repetition drills.
              </p>
              <a href="#/dashboard" class="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-label font-medium shadow-md transition-all">
                Open Prep Dashboard →
              </a>
            </div>

          </aside>

        </div>

      </div>
    </div>
  `;
}

function formatMarkdownContent(md) {
  if (!md) return '';

  let html = md;

  // Code blocks: ```lang ... ```
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `
      <div class="my-4 rounded-xl overflow-hidden border border-[#263552] bg-[#070a12] shadow-xl">
        <div class="flex items-center justify-between px-4 py-2 bg-[#0d1322] border-b border-[#1e2638] text-[11px] font-mono text-slate-400">
          <span class="uppercase font-semibold text-sky-400">${escapeHtml(lang || 'CODE')}</span>
          <button class="copy-code-btn hover:text-white transition-colors cursor-pointer flex items-center gap-1" data-code="${escapeHtml(code.trim())}">
            <span class="material-symbols-outlined text-[14px]">content_copy</span>
            <span>Copy</span>
          </button>
        </div>
        <pre class="p-4 overflow-x-auto text-[13px] font-mono text-[#38BDF8] leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>
      </div>
    `;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#161f33] border border-[#263552] text-indigo-300 font-mono text-[13px]">$1</code>');

  // Headings: ### Header
  html = html.replace(/^### (.*$)/gim, '<h3 class="font-headline text-lg font-bold text-white mt-6 mb-2">$1</h3>');

  // Markdown tables: basic table converter
  html = html.replace(/\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g, (match, headerLine, rowsBlock) => {
    const headers = headerLine.split('|').map(h => h.trim()).filter(Boolean);
    const rows = rowsBlock.trim().split('\n').map(r => r.split('|').map(c => c.trim()).filter(Boolean));

    const ths = headers.map(h => `<th class="py-2.5 px-3 font-mono text-[12px] uppercase tracking-wider text-slate-300 border-b border-[#24314A] bg-[#0d121f] text-left">${escapeHtml(h)}</th>`).join('');
    const trs = rows.map(r => {
      const tds = r.map(c => `<td class="py-2.5 px-3 text-[13px] font-body text-slate-300 border-b border-[#1e2638]">${escapeHtml(c)}</td>`).join('');
      return `<tr class="hover:bg-[#111625] transition-colors">${tds}</tr>`;
    }).join('');

    return `
      <div class="my-4 overflow-x-auto rounded-xl border border-[#24314A]">
        <table class="w-full text-left border-collapse bg-[#0b0f19]">
          <thead><tr>${ths}</tr></thead>
          <tbody>${trs}</tbody>
        </table>
      </div>
    `;
  });

  // Bullet lists: - item or 1. item
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="flex items-start gap-2 text-slate-300"><span class="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span><span>$1</span></li>');
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="flex items-start gap-2 text-slate-300"><span class="font-mono text-indigo-400 text-xs mt-0.5 shrink-0 font-bold">•</span><span>$1</span></li>');

  // Wrap loose <li> in <ul>
  html = html.replace(/(<li[\s\S]*?<\/li>)+/g, '<ul class="space-y-2 my-3 pl-1">$0</ul>');

  // Bold text: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
