/**
 * EngineerOS — Monday Moon Engineering Blog & Real-World System Design Case Studies
 * Comprehensive editorial monographs and production architectures for Senior & Staff Engineers.
 */

import { CASE_STUDIES, getCaseStudyBySlug } from '../content/caseStudiesData.js';
import { renderMonographReader } from './BlogReader.js';

function getActiveSlugFromHash() {
  const hash = typeof window !== 'undefined' ? (window.location.hash || '') : '';
  const match = hash.match(/[?&]article=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getBookmarkedArticles() {
  try {
    if (typeof localStorage === 'undefined') return [];
    return JSON.parse(localStorage.getItem('prep_os_bookmarked_articles') || '[]');
  } catch (e) {
    return [];
  }
}

function getReadArticles() {
  try {
    if (typeof localStorage === 'undefined') return [];
    return JSON.parse(localStorage.getItem('prep_os_read_articles') || '[]');
  } catch (e) {
    return [];
  }
}

export function renderBlogApp() {
  const activeSlug = getActiveSlugFromHash();
  const bookmarked = getBookmarkedArticles();
  const readList = getReadArticles();

  if (activeSlug) {
    const article = getCaseStudyBySlug(activeSlug);
    if (article) {
      const isBookmarked = bookmarked.includes(article.id);
      const isRead = readList.includes(article.id);
      return renderMonographReader(article, isBookmarked, isRead);
    }
  }

  // Count topics
  const totalCount = CASE_STUDIES.length;
  const sysDesignCount = CASE_STUDIES.filter(c => c.category === 'System Design').length;
  const backendCount = CASE_STUDIES.filter(c => c.category === 'Backend Engineering').length;
  const distCount = CASE_STUDIES.filter(c => c.category === 'Distributed Systems').length;
  const dbCount = CASE_STUDIES.filter(c => c.category === 'Databases').length;
  const javaCount = CASE_STUDIES.filter(c => c.category === 'Java').length;

  const featuredArticle = CASE_STUDIES.find(c => c.id === 'url-shortener-kgs') || CASE_STUDIES[0];
  const gridArticles = CASE_STUDIES.filter(c => c.id !== featuredArticle?.id);

  const cardsHtml = CASE_STUDIES.map(c => {
    const isBookmarked = bookmarked.includes(c.id);
    const isRead = readList.includes(c.id);

    return `
      <article 
        class="article-card flex flex-col bg-[#111625] border border-[#1e2638] hover:border-indigo-500/50 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-all duration-200 group" 
        data-category="${escapeHtml(c.category)}" 
        data-company="${escapeHtml(c.company)}"
        data-keywords="${escapeHtml(c.keywords || '')}"
      >
        <!-- Card Top Bar -->
        <div class="w-full bg-[#0a0e18] p-4 flex flex-col justify-between border-b border-[#1e2638] relative">
          <div class="flex items-center justify-between text-[11px] font-mono">
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold uppercase">
                ${escapeHtml(c.company)}
              </span>
              <span class="text-slate-400 font-mono text-[10px]">• ${escapeHtml(c.category)}</span>
            </div>
            ${c.sla ? `
              <span class="bg-[#161f33] border border-[#263552] text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono">
                ${escapeHtml(c.sla.split('•')[0].trim())}
              </span>
            ` : ''}
          </div>

          <div class="mt-4 mb-2 flex items-center justify-between">
            <span class="font-mono text-[11px] text-slate-400">${escapeHtml(c.readTime)}</span>
            ${isRead ? `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-code font-semibold border border-emerald-500/30">
                <span class="material-symbols-outlined text-[12px]">done_all</span> Completed
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono ${c.difficulty === 'Hard' ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'}">
                ${escapeHtml(c.difficulty)}
              </span>
              <span class="text-slate-500 text-[11px]">• ${escapeHtml(c.publishedDate)}</span>
            </div>

            <h3 class="font-headline text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug cursor-pointer" data-read-article="${c.slug}">
              ${escapeHtml(c.title)}
            </h3>

            <p class="font-body text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
              ${escapeHtml(c.summary)}
            </p>
          </div>

          <div class="pt-4 border-t border-[#1e2638] flex items-center justify-between mt-auto">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-headline font-bold text-white text-[11px] shadow-sm">
                ${escapeHtml(c.author?.avatar || 'OS')}
              </div>
              <span class="text-xs font-semibold text-slate-300">${escapeHtml(c.author?.name || 'EngineerOS')}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button 
                class="bookmark-btn p-2 rounded-lg bg-[#182033] hover:bg-[#202b45] text-slate-400 hover:text-white border border-[#25324c] transition-colors cursor-pointer" 
                data-article-id="${c.id}"
                title="Bookmark article"
              >
                <span class="material-symbols-outlined text-[18px] ${isBookmarked ? 'text-indigo-400 font-variation-fill' : ''}">${isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
              </button>
              <button 
                class="read-article-btn inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-label font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-sm cursor-pointer"
                data-read-article="${c.slug}"
              >
                Read Case Study →
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="blog-root bg-[#080c14] font-body text-[#f1f5f9] antialiased min-h-screen selection:bg-indigo-600 selection:text-white relative">
      <!-- Fixed Header -->
      <header class="fixed top-0 left-0 right-0 w-full z-50 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-[#1e2638]/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div class="h-16 lg:h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="#/" class="flex items-center gap-2.5">
              <img alt="Brand logo" class="h-7 lg:h-8 w-auto object-contain brightness-0 invert" src="/logo.svg"/>
              <span class="font-headline text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                EngineerOS<span class="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              </span>
            </a>
          </div>

          <nav class="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[#111622] border border-[#1e2638]">
            <a class="px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#181c26] transition-all duration-150" href="#/">Home</a>
            <a class="px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#181c26] transition-all duration-150" href="#/dashboard">Dashboard</a>
            <a class="px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#181c26] transition-all duration-150" href="#pricing">Products</a>
            <a aria-current="page" class="px-3.5 py-2 transition-all duration-150 bg-indigo-500/15 text-indigo-300 font-semibold rounded-lg shadow-sm border border-indigo-500/30" href="#/blog">Case Studies</a>
            <a class="px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#181c26] transition-all duration-150" href="#whats-inside">Resources</a>
            <a class="px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#181c26] transition-all duration-150" href="#who-its-for">About</a>
          </nav>

          <div class="flex items-center gap-3 lg:gap-4">
            <a class="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-label font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_28px_rgba(99,102,241,0.55)] hover:brightness-110 transition-all duration-200 border border-indigo-400/30" href="#/dashboard">
              Open Prep OS →
            </a>
            <a href="#/dashboard" class="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 hover:text-white transition-colors" title="User Dashboard">
              <span class="material-symbols-outlined text-[18px]">person</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="w-full pt-16 lg:pt-20 bg-[#080c14]">
        <div class="flex flex-col w-full">
          
          <!-- Top Archival Bar / Announcement -->
          <section class="w-full bg-[#0d121f] py-2.5 px-6 lg:px-12 border-b border-[#1e2638]">
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-label">
              <div class="flex items-center gap-2 text-slate-400">
                <span class="inline-flex items-center justify-center w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                <span class="font-semibold tracking-wider uppercase text-emerald-400 font-mono">ENGINEERING ARCHIVES • CASE STUDIES</span>
                <span class="hidden sm:inline text-slate-600">•</span>
                <span class="hidden sm:inline text-slate-400">Real-World System Architecture • Zero Fluff, Production Code</span>
              </div>
              <div class="flex items-center gap-4 text-slate-400">
                <button class="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-1" id="rssBtn">
                  <span class="material-symbols-outlined text-[14px]">rss_feed</span> RSS Feed
                </button>
                <span class="text-slate-700">•</span>
                <span class="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">bookmark</span> Saved (<span class="text-indigo-400 font-mono" id="savedCount">${bookmarked.length}</span>)
                </span>
                <span class="text-slate-700">•</span>
                <span class="text-slate-400 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-emerald-400">done_all</span> Completed (<span class="text-emerald-400 font-mono" id="readCount">${readList.length}</span>)
                </span>
              </div>
            </div>
          </section>

          <!-- Editorial Hero & Header Section -->
          <section class="w-full bg-gradient-to-b from-[#0b0f19] via-[#0b0f19] to-[#080c14] py-16 lg:py-20 px-6 lg:px-12 relative overflow-hidden">
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute top-12 left-1/4 w-[300px] h-[200px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-label font-semibold text-indigo-300 uppercase tracking-widest mb-6 backdrop-blur-sm shadow-[0_0_12px_rgba(99,102,241,0.15)]">
                <span class="material-symbols-outlined text-[14px] text-indigo-400">auto_stories</span>
                <span>System Design Case Studies &amp; Engineering Monographs</span>
              </div>
              
              <h1 class="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
                Engineering knowledge for <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-400 to-cyan-300 underline decoration-indigo-500/40 underline-offset-8">real-world builders.</span>
              </h1>
              
              <p class="font-body text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
                Production-grade case studies from Stripe, Uber, Netflix, Discord, and LinkedIn. Tested in high-throughput production, structured for FAANG L5/L6 Senior &amp; Staff System Design interviews.
              </p>

              <!-- Search Field with Hotkey Badge -->
              <div class="w-full max-w-2xl relative">
                <div class="relative flex items-center w-full bg-[#111625] border border-[#232d42] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-indigo-500/50 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30">
                  <span class="material-symbols-outlined absolute left-4 text-slate-400 text-[22px]">search</span>
                  <input 
                    type="text" 
                    id="blogSearchInput" 
                    placeholder="Search case studies by topic, company, pattern (e.g., Stripe, Redis, Kafka, Uber)..." 
                    class="w-full pl-12 pr-28 py-4 text-sm sm:text-base font-body bg-transparent text-white placeholder-slate-500 focus:outline-none rounded-xl"
                  />
                  <div class="absolute right-3.5 flex items-center gap-1.5 pointer-events-none">
                    <kbd class="hidden sm:inline-flex items-center px-2 py-1 text-[11px] font-mono font-semibold text-slate-400 bg-[#182033] border border-[#2c3852] rounded shadow-inner">⌘K</kbd>
                    <button id="blogClearSearchBtn" class="hidden text-slate-400 hover:text-white p-1 pointer-events-auto">
                      <span class="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-400 mt-3 px-2">
                  <span>Popular searches: 
                    <button class="popular-query-btn underline decoration-dotted text-slate-300 hover:text-indigo-300 ml-1 transition-colors" data-term="Stripe">Stripe</button>, 
                    <button class="popular-query-btn underline decoration-dotted text-slate-300 hover:text-indigo-300 ml-1 transition-colors" data-term="Uber">Uber H3</button>, 
                    <button class="popular-query-btn underline decoration-dotted text-slate-300 hover:text-indigo-300 ml-1 transition-colors" data-term="Netflix">Netflix Multi-Region</button>, 
                    <button class="popular-query-btn underline decoration-dotted text-slate-300 hover:text-indigo-300 ml-1 transition-colors" data-term="Kafka">Kafka</button>
                  </span>
                  <span class="font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">${totalCount} Case Studies</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Horizontal Filter Navigation & Topic Selector -->
          <section class="w-full bg-[#080c14]/90 py-5 px-6 lg:px-12 sticky top-16 lg:top-20 z-40 backdrop-blur-md border-y border-[#1e2638]">
            <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
              <div class="flex items-center gap-2" id="filterPillsContainer">
                <button class="filter-pill active px-3.5 py-1.5 rounded-full text-xs font-label font-semibold whitespace-nowrap bg-indigo-600 text-white shadow-[0_0_14px_rgba(99,102,241,0.5)] transition-all cursor-pointer" data-cat="All">
                  All (${totalCount})
                </button>
                <button class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-label font-medium whitespace-nowrap bg-[#131929] border border-[#232e47] text-slate-300 hover:text-white hover:bg-[#1a233a] transition-all cursor-pointer" data-cat="System Design">
                  System Design (${sysDesignCount})
                </button>
                <button class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-label font-medium whitespace-nowrap bg-[#131929] border border-[#232e47] text-slate-300 hover:text-white hover:bg-[#1a233a] transition-all cursor-pointer" data-cat="Backend Engineering">
                  Backend Engineering (${backendCount})
                </button>
                <button class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-label font-medium whitespace-nowrap bg-[#131929] border border-[#232e47] text-slate-300 hover:text-white hover:bg-[#1a233a] transition-all cursor-pointer" data-cat="Distributed Systems">
                  Distributed Systems (${distCount})
                </button>
                <button class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-label font-medium whitespace-nowrap bg-[#131929] border border-[#232e47] text-slate-300 hover:text-white hover:bg-[#1a233a] transition-all cursor-pointer" data-cat="Databases">
                  Databases (${dbCount})
                </button>
                <button class="filter-pill px-3.5 py-1.5 rounded-full text-xs font-label font-medium whitespace-nowrap bg-[#131929] border border-[#232e47] text-slate-300 hover:text-white hover:bg-[#1a233a] transition-all cursor-pointer" data-cat="Java">
                  Java &amp; Low Latency (${javaCount})
                </button>
              </div>

              <div class="flex items-center gap-2 text-xs font-label text-slate-400 shrink-0">
                <span class="font-mono text-slate-400 bg-[#131929] border border-[#232e47] px-2.5 py-1 rounded" id="articlesCountDisplay">Showing ${totalCount} case studies</span>
              </div>
            </div>
          </section>

          <!-- Articles Responsive Grid -->
          <section class="w-full bg-[#080c14] py-12 px-6 lg:px-12">
            <div class="max-w-7xl mx-auto">
              
              <!-- Empty Search State -->
              <div id="emptySearchState" class="hidden py-16 text-center flex flex-col items-center justify-center bg-[#0d1322] border border-[#1e2638] rounded-2xl p-8 max-w-xl mx-auto">
                <span class="material-symbols-outlined text-[48px] text-slate-500 mb-3">search_off</span>
                <h3 class="font-headline text-lg font-bold text-white mb-1">No case studies found</h3>
                <p class="text-sm text-slate-400 mb-6">No articles matching "<span id="emptyQueryTerm" class="text-indigo-300 font-mono"></span>". Try another query or reset filters.</p>
                <button id="resetEmptyBtn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-label font-semibold shadow-md transition-colors cursor-pointer">
                  Reset Search &amp; Filters
                </button>
              </div>

              <!-- Main Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="articlesGrid">
                ${cardsHtml}
              </div>

            </div>
          </section>

          <!-- Prep OS Pro Callout Banner -->
          <section class="w-full bg-gradient-to-b from-[#080c14] via-[#0d121f] to-[#080c14] py-16 px-6 lg:px-12 border-t border-[#1e2638]">
            <div class="max-w-7xl mx-auto">
              <div class="w-full rounded-2xl bg-[#111625] border border-[#20293d] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div class="flex flex-col gap-4 max-w-2xl relative z-10">
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold w-fit">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>DAILY EXECUTION ENGINE ACTIVE</span>
                  </div>
                  <h2 class="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Turn Reading Into Mastery: Practice with the 45-Day Prep OS
                  </h2>
                  <p class="text-sm sm:text-base text-slate-300 font-body leading-relaxed">
                    Don't just read architectures passively. Drill 100 curated DSA patterns, 20 production system design specifications, and SM-2 spaced repetition revision directly in your daily dashboard.
                  </p>
                  <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                    <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-emerald-400 text-[16px]">check</span><span>100 Curated Problems</span></div>
                    <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-emerald-400 text-[16px]">check</span><span>20 System Design Specs</span></div>
                    <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-emerald-400 text-[16px]">check</span><span>Readiness Radar</span></div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 relative z-10">
                  <a href="#/dashboard" class="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-label font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all text-center">
                    Launch Prep OS Dashboard →
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <!-- Footer -->
      <footer class="w-full bg-[#070b12] border-t border-[#1e2638] pt-12 pb-10">
        <div class="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 EngineerOS. Curated and published for FAANG Senior &amp; Staff System Design Preparation.</p>
          <div class="flex items-center gap-6">
            <a class="hover:text-slate-300 transition-colors" href="#/">Home</a>
            <a class="hover:text-slate-300 transition-colors" href="#/dashboard">Dashboard</a>
            <a class="hover:text-slate-300 transition-colors" href="#/blog">Case Studies</a>
          </div>
        </div>
      </footer>
    </div>
  `;
}

export function attachBlogListeners() {
  const root = document.querySelector('.blog-root, .monograph-reader');
  if (!root) return;

  // 1. Reading Progress Bar
  const progressBar = document.getElementById('readingProgressBar');
  if (progressBar) {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / scrollTotal) * 100));
        progressBar.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // 2. Click to Read Article
  document.querySelectorAll('[data-read-article]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = el.getAttribute('data-read-article');
      if (slug) {
        window.location.hash = `#/blog?article=${encodeURIComponent(slug)}`;
      }
    });
  });

  // 3. Back to Blog Catalog
  const backBtn = document.getElementById('backToBlogBtn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#/blog';
    });
  }

  // 4. Bookmark Buttons (Catalog & Reader)
  document.querySelectorAll('.bookmark-btn, #readerBookmarkBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const articleId = btn.getAttribute('data-article-id');
      if (!articleId) return;

      const bookmarks = getBookmarkedArticles();
      const idx = bookmarks.indexOf(articleId);
      if (idx > -1) {
        bookmarks.splice(idx, 1);
      } else {
        bookmarks.push(articleId);
      }
      localStorage.setItem('prep_os_bookmarked_articles', JSON.stringify(bookmarks));

      // Refresh view to update state and counter
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = renderBlogApp();
        attachBlogListeners();
      }
    });
  });

  // 5. Mark as Read Buttons
  document.querySelectorAll('#readerMarkReadBtn, #bottomMarkReadBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = btn.getAttribute('data-article-id');
      if (!articleId) return;

      const readList = getReadArticles();
      const idx = readList.indexOf(articleId);
      if (idx > -1) {
        readList.splice(idx, 1);
      } else {
        readList.push(articleId);
      }
      localStorage.setItem('prep_os_read_articles', JSON.stringify(readList));

      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = renderBlogApp();
        attachBlogListeners();
      }
    });
  });

  // 6. Share Button
  const shareBtn = document.getElementById('readerShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Case Study link copied to clipboard!');
      } catch (err) {
        // Fallback
        prompt('Copy this link:', window.location.href);
      }
    });
  }

  // 7. Copy Code Block Buttons
  document.querySelectorAll('.copy-code-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const code = btn.getAttribute('data-code') || '';
      try {
        await navigator.clipboard.writeText(code);
        const span = btn.querySelector('span:last-child');
        if (span) {
          const original = span.textContent;
          span.textContent = 'Copied!';
          setTimeout(() => { span.textContent = original; }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
  });

  // 8. Search & Category Filters (Catalog view)
  let currentCategory = 'All';
  const searchInput = document.getElementById('blogSearchInput');
  const clearBtn = document.getElementById('blogClearSearchBtn');
  const articlesGrid = document.getElementById('articlesGrid');
  const emptyState = document.getElementById('emptySearchState');
  const countDisplay = document.getElementById('articlesCountDisplay');
  const emptyQueryTerm = document.getElementById('emptyQueryTerm');
  const resetEmptyBtn = document.getElementById('resetEmptyBtn');

  function filterArticles(query = '') {
    const cards = document.querySelectorAll('.article-card');
    let visibleCount = 0;
    const q = query.toLowerCase().trim();

    cards.forEach(card => {
      const cat = card.getAttribute('data-category') || '';
      const company = card.getAttribute('data-company') || '';
      const kw = card.getAttribute('data-keywords') || '';
      const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
      const desc = card.querySelector('p')?.innerText.toLowerCase() || '';

      const matchCat = (currentCategory === 'All') || (cat.toLowerCase() === currentCategory.toLowerCase());
      const matchSearch = !q || kw.includes(q) || title.includes(q) || desc.includes(q) || company.toLowerCase().includes(q);

      if (matchCat && matchSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (visibleCount === 0) {
      if (articlesGrid) articlesGrid.classList.add('hidden');
      if (emptyState) emptyState.classList.remove('hidden');
      if (emptyQueryTerm) emptyQueryTerm.innerText = query || currentCategory;
    } else {
      if (articlesGrid) articlesGrid.classList.remove('hidden');
      if (emptyState) emptyState.classList.add('hidden');
    }

    if (countDisplay) {
      countDisplay.innerText = `Showing ${visibleCount} case stud${visibleCount === 1 ? 'y' : 'ies'}`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (clearBtn) {
        if (val) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }
      filterArticles(val);
    });

    // ⌘K Hotkey
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      clearBtn.classList.add('hidden');
      filterArticles('');
    });
  }

  if (resetEmptyBtn) {
    resetEmptyBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.classList.add('hidden');
      currentCategory = 'All';
      document.querySelectorAll('.filter-pill').forEach(p => {
        if (p.getAttribute('data-cat') === 'All') {
          p.className = 'filter-pill active px-3.5 py-1.5 rounded-full text-xs font-label font-semibold whitespace-nowrap bg-indigo-600 text-white shadow-[0_0_14px_rgba(99,102,241,0.5)] transition-all cursor-pointer';
        } else {
          p.className = 'filter-pill px-3.5 py-1.5 rounded-full text-xs font-label font-medium whitespace-nowrap bg-[#131929] border border-[#232e47] text-slate-300 hover:text-white hover:bg-[#1a233a] transition-all cursor-pointer';
        }
      });
      filterArticles('');
    });
  }

  // Filter Pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      currentCategory = pill.getAttribute('data-cat') || 'All';
      document.querySelectorAll('.filter-pill').forEach(p => {
        if (p === pill) {
          p.className = 'filter-pill active px-3.5 py-1.5 rounded-full text-xs font-label font-semibold whitespace-nowrap bg-indigo-600 text-white shadow-[0_0_14px_rgba(99,102,241,0.5)] transition-all cursor-pointer';
        } else {
          p.className = 'filter-pill px-3.5 py-1.5 rounded-full text-xs font-label font-medium whitespace-nowrap bg-[#131929] border border-[#232e47] text-slate-300 hover:text-white hover:bg-[#1a233a] transition-all cursor-pointer';
        }
      });
      filterArticles(searchInput ? searchInput.value : '');
    });
  });

  // Popular queries
  document.querySelectorAll('.popular-query-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const term = btn.getAttribute('data-term') || '';
      if (searchInput) {
        searchInput.value = term;
        if (clearBtn) clearBtn.classList.remove('hidden');
        filterArticles(term);
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // RSS Button Toast
  const rssBtn = document.getElementById('rssBtn');
  if (rssBtn) {
    rssBtn.addEventListener('click', () => {
      alert('RSS feed copied to clipboard: https://engineeros.dev/feed.xml');
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

