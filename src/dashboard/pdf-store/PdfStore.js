/**
 * Interview Prep OS - Premium PDF Guides & Cheat Sheets Storefront
 * Compact, relevance-aware study guides section placed at the bottom of every dashboard page
 */

export const PDF_PRODUCTS = [
  {
    id: 'bundle-system-design',
    isBundle: true,
    title: 'System Design Complete Guide (Vol 1 + Vol 2 Bundle)',
    subtitle: 'Comprehensive 20 Senior Architectures, Capacity Math & FAANG Leveling Rubrics',
    price: 249,
    originalPrice: 598,
    saveAmount: 49,
    discount: '58% OFF',
    badge: '🔥 #1 BESTSELLER COMBO',
    rating: '4.98',
    reviews: '2,410+ engineers',
    icon: 'auto_stories',
    accentColor: '#F59E0B',
    category: 'System Design',
    pages: '240+ Pages',
    pitch: 'Master all 20 production architectures. Includes step-by-step capacity estimation math, API schemas, partitioning models, and interviewer scoring rubrics for Senior & Staff engineering loops.',
    bundleModules: [
      { title: 'Volume 1: Storage & Queues', desc: 'DynamoDB, Distributed Caching, S3 & Kafka Commit Logs', icon: 'dns', color: '#38BDF8' },
      { title: 'Volume 2: Scale & FinTech', desc: 'Real-Time Chat, DASH Video, Uber H3 & Ledgers', icon: 'hub', color: '#818CF8' },
      { title: '240+ Pages of Blueprints', desc: 'High-Res Architecture Diagrams & Math Templates', icon: 'calculate', color: '#F59E0B' },
      { title: 'FAANG Leveling Rubric', desc: 'Interviewer Scoring Matrices & Red-Flag Checklist', icon: 'gavel', color: '#10B981' }
    ],
    topics: [
      'URL Shorteners & Key Generation Services (KGS, Base62)',
      'Distributed Key-Value Store (Consistent Hashing & Quorum R+W>N)',
      'Distributed Cache (LRU/LFU, Write-Through & Stampede XFetch)',
      'Distributed Object Storage (Chunking & Reed-Solomon Erasure Coding)',
      'Distributed Message Queue (Append-Only Logs & ISR Quorums)',
      'Real-Time Chat & Messaging (WebSockets, Presence Engine)',
      'Video Streaming Platforms (DASH/HLS Chunking & CDN Shields)',
      'Ride-Hailing Dispatch System (Uber H3 Hexagonal Spatial Index)',
      'High-Concurrency Flash Sale Engine (Redis Redlock & Optimistic Locks)',
      'Payment Ledger & Double-Entry Accounting (Idempotency & Saga)'
    ],
    highlights: [
      'All 20 Production Architecture Specs (DynamoDB, Kafka, Uber H3, S3, Chat, etc.)',
      'Capacity math formulas, QPS & storage estimation cheat sheet',
      'API contracts, partitioning schemes & trade-off decision matrices',
      'FAANG interviewer scoring rubrics & anti-pattern red-flag checklist'
    ]
  },
  {
    id: 'pdf-sd-vol-1',
    title: 'System Design Complete — Volume 1',
    subtitle: 'High-Throughput Storage & Foundation Architectures',
    price: 149,
    originalPrice: 349,
    discount: '57% OFF',
    badge: 'Core Infrastructure',
    rating: '4.9',
    reviews: '920+ ratings',
    icon: 'dns',
    accentColor: '#38BDF8',
    category: 'System Design',
    pages: '115 Pages',
    pitch: 'Step-by-step blueprints for core infrastructure rounds: URL shorteners, key-value stores, distributed caches, and append-only commit logs.',
    topics: [
      'Consistent Hashing & DynamoDB',
      'Distributed Caches (LRU/LFU)',
      'Kafka Append-Only Log & ISR',
      'S3 Chunking & Erasure Coding',
      'Base62 Key Generation (KGS)'
    ],
    highlights: [
      'URL Shorteners & Key Generation Services (Base62, KGS)',
      'Distributed Key-Value Store (Consistent hashing & Quorum R+W>N)',
      'Distributed Cache (LRU/LFU, Write-Through & Stampede XFetch)',
      'Distributed Object Storage (Chunking & Reed-Solomon Erasure Coding)',
      'Distributed Message Queue (Append-only logs & ISR quorums)'
    ]
  },
  {
    id: 'pdf-sd-vol-2',
    title: 'System Design Complete — Volume 2',
    subtitle: 'Distributed Systems, FinTech & Geospatial Scale',
    price: 149,
    originalPrice: 349,
    discount: '57% OFF',
    badge: 'Scale & FinTech',
    rating: '4.9',
    reviews: '840+ ratings',
    icon: 'hub',
    accentColor: '#818CF8',
    category: 'System Design',
    pages: '125 Pages',
    pitch: 'Master high-complexity distributed systems: WebSocket chat presence, multi-bitrate video transcoding, Uber H3 geospatial dispatch, and payment saga ledgers.',
    topics: [
      'WebSocket Chat & Ephemeral Stores',
      'DASH/HLS Video CDN Shields',
      'Uber H3 Hexagonal Spatial Index',
      'Flash Sale Redis Redlocks',
      'Payment Ledger & Distributed Saga'
    ],
    highlights: [
      'Real-Time Chat & Messaging (WebSockets, presence & heartbeats)',
      'Video Streaming Platforms (DASH/HLS chunking & CDN shields)',
      'Ride-Hailing Dispatch (Uber H3 Hexagons vs Quadtrees)',
      'Flash Sale Concurrency Engine (Redis Redlock & Optimistic Locks)',
      'Payment Ledger & Accounting (Idempotency & Distributed Saga)'
    ]
  },
  {
    id: 'pdf-opex-cheatsheet',
    title: 'Operational Excellence Cheat Sheet',
    subtitle: 'Production Readiness, Incident Triage, SRE & Observability',
    price: 149,
    originalPrice: 399,
    discount: '63% OFF',
    badge: 'Senior & Staff SRE Bar',
    rating: '4.95',
    reviews: '730+ ratings',
    icon: 'shield',
    accentColor: '#F43F5E',
    category: 'SRE & DevOps',
    pages: '55 Pages',
    pitch: 'The exact frameworks used by Staff & Principal SREs to handle SEV-1 production incidents, calculate SLIs/SLOs, and write blameless post-mortems.',
    topics: [
      'SLI / SLO & Error Budgets',
      'SEV-1 Production Runbooks',
      'Bulkheads & Circuit Breakers',
      'Blameless 5-Whys Post-Mortem',
      'OpenTelemetry & Prometheus'
    ],
    highlights: [
      'SLIs, SLOs & Error Budgets formulation for high-availability systems',
      'SEV-1 Production Incident Response & On-Call runbooks',
      'Cascading failure mitigation: circuit breaking, bulkheads, shed-load',
      'Blameless Post-Mortem writing guide with 5-Whys root cause analysis',
      'Observability: Metrics (Prometheus), Distributed Tracing (OpenTelemetry)'
    ]
  },
  {
    id: 'pdf-java-cheatsheet',
    title: 'Java Interview Ready Cheat Sheet',
    subtitle: 'Concurrency, JVM Internals, GC Tuning & Modern Java 21',
    price: 99,
    originalPrice: 249,
    discount: '60% OFF',
    badge: 'JVM & Modern Java 21',
    rating: '4.9',
    reviews: '1,150+ ratings',
    icon: 'terminal',
    accentColor: '#EC4899',
    category: 'Language & Concurrency',
    pages: '45 Pages',
    pitch: 'Crack deep JVM rounds: Project Loom virtual threads, G1/ZGC low-pause garbage collection, CAS lock-free loops, and ConcurrentHashMap internals.',
    topics: [
      'Java 21 Virtual Threads (Loom)',
      'G1 vs ZGC vs Shenandoah GC',
      'JVM Heap, Metaspace & CAS',
      'ConcurrentHashMap Striping',
      'Top 50 Concurrency Traps'
    ],
    highlights: [
      'Java 21 Virtual Threads (Project Loom) vs OS Platform Threads',
      'Garbage Collection Deep Dive: G1, ZGC vs Shenandoah low-pause mechanics',
      'JVM Memory Model (Heap, Metaspace, Stack) & CAS atomic loops',
      'ConcurrentHashMap internals & CAS (Compare-And-Swap) loops',
      'Top 50 tricky output-based & multi-threading questions'
    ]
  },
  {
    id: 'pdf-springboot-cheatsheet',
    title: 'Spring Boot Interview Ready Cheat Sheet',
    subtitle: 'Auto-Config, Bean Lifecycles, Security 6 & Cloud Patterns',
    price: 99,
    originalPrice: 249,
    discount: '60% OFF',
    badge: 'Enterprise Microservices',
    rating: '4.9',
    reviews: '1,080+ ratings',
    icon: 'layers',
    accentColor: '#10B981',
    category: 'Framework & Microservices',
    pages: '50 Pages',
    pitch: 'Avoid trap questions on @Transactional propagation boundaries, circular dependency proxies, Spring Security 6 filter chains, and Resilience4j patterns.',
    topics: [
      'Auto-Config Condition Order',
      'Bean Lifecycle & Proxy Fixes',
      '@Transactional Propagation Traps',
      'Spring Security 6 & JWT Auth',
      'Resilience4j Circuit Breakers'
    ],
    highlights: [
      '@SpringBootApplication & Auto-Configuration condition evaluation order',
      'Bean lifecycle phases, circular dependency resolution & proxies',
      '@Transactional propagation traps and rollback boundaries',
      'Spring Security 6 filter chain & JWT stateless auth flow',
      'Spring Cloud Gateway, Resilience4j circuit breakers & actuator metrics'
    ]
  },
  {
    id: 'pdf-behavioral-cheatsheet',
    title: 'Behavioral Interview Cheat Sheet',
    subtitle: '30+ Battle-Tested STAR Stories & Senior Leadership Answers',
    price: 99,
    originalPrice: 249,
    discount: '60% OFF',
    badge: '30+ STAR Scripts',
    rating: '4.9',
    reviews: '1,340+ ratings',
    icon: 'psychology',
    accentColor: '#A855F7',
    category: 'Leadership & STAR',
    pages: '40 Pages',
    pitch: 'High-scoring STAR story blueprints for Senior and Staff loops. Master Amazon 16 Leadership Principles, architectural disagreements, and technical ambiguity.',
    topics: [
      '30+ Mastered STAR Stories',
      'Disagree & Commit Scripts',
      'Navigating 60% Ambiguity',
      'Handling High-SEV Outages',
      'Amazon 16 LP & Meta Rubric'
    ],
    highlights: [
      '30+ Mastered STAR Story Frameworks tailored for Senior/Staff roles',
      'Resolving architectural disagreements (Disagree and Commit)',
      'Navigating high ambiguity and 60% unknown technical specs',
      'Mentorship, engineering culture, and handling SEV outages',
      'Amazon 16 Leadership Principles & Meta L5/L6 competency matrices'
    ]
  }
];

const STORAGE_PURCHASES_KEY = 'interview_prep_purchased_pdfs';

export function getPurchasedPdfs() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_PURCHASES_KEY);
      if (saved) return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not read purchased pdfs:', e);
  }
  return [];
}

export function recordPurchase(productId) {
  try {
    const current = getPurchasedPdfs();
    const set = new Set(current);
    set.add(productId);
    // If bundle purchased, also unlock Vol 1 and Vol 2
    if (productId === 'bundle-system-design') {
      set.add('pdf-sd-vol-1');
      set.add('pdf-sd-vol-2');
    }
    const updated = Array.from(set);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_PURCHASES_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (e) {
    console.warn('Could not save purchase:', e);
    return [productId];
  }
}

/**
 * Compute context-aware relevance and recommendation badges for products
 */
export function getProductRelevance(product, { currentTab = 'system-design-roadmap', week = 'today', activeDay = null } = {}) {
  const dayNum = Number(activeDay) || 0;
  const isSysDesignTab = currentTab === 'system-design-roadmap';
  const isDsaTab = currentTab === 'dsa-tracker';

  let isRelevant = false;
  let relevanceBadge = '';
  let score = 50;

  if (isSysDesignTab) {
    const isEarlyWeek = week === '1' || week === '2' || week === '3' || (dayNum > 0 && dayNum <= 21);
    const isMidWeek = week === '4' || week === '5' || (dayNum > 21 && dayNum <= 35);
    const isLateWeek = week === '6' || dayNum > 35;

    if (product.id === 'pdf-sd-vol-1') {
      isRelevant = true;
      if (isEarlyWeek) {
        relevanceBadge = '⭐ Top Pick for Weeks 1-3 (Storage & Foundation)';
        score = 100;
      } else {
        relevanceBadge = '⚡ Core Infrastructure Blueprints';
        score = 80;
      }
    } else if (product.id === 'pdf-sd-vol-2') {
      isRelevant = true;
      if (isMidWeek) {
        relevanceBadge = '⭐ Top Pick for Weeks 4-5 (FinTech & Scale)';
        score = 100;
      } else if (isEarlyWeek) {
        relevanceBadge = '⚡ Advanced Distributed Systems (Vol 2)';
        score = 85;
      } else {
        relevanceBadge = '⚡ Real-Time & High-Throughput Scale';
        score = 85;
      }
    } else if (product.id === 'pdf-opex-cheatsheet') {
      isRelevant = true;
      if (isLateWeek) {
        relevanceBadge = '⭐ Top Pick for Week 6 (Staff SRE Bar)';
        score = 100;
      } else {
        relevanceBadge = '⚡ Production Readiness & Incident Triage';
        score = 75;
      }
    } else if (product.id === 'bundle-system-design') {
      isRelevant = true;
      relevanceBadge = '🔥 Full 20 Architectures Combo Bundle';
      score = 95;
    } else if (product.id === 'pdf-behavioral-cheatsheet') {
      isRelevant = false;
      score = 45;
    } else {
      isRelevant = false;
      score = 35;
    }
  } else if (isDsaTab) {
    if (product.id === 'pdf-java-cheatsheet') {
      isRelevant = true;
      relevanceBadge = '⭐ Top Pick for Coding Loops (JVM & Concurrency)';
      score = 100;
    } else if (product.id === 'pdf-behavioral-cheatsheet') {
      isRelevant = true;
      relevanceBadge = '⭐ Essential STAR Scripts for Senior Loops';
      score = 95;
    } else if (product.id === 'pdf-springboot-cheatsheet') {
      isRelevant = true;
      relevanceBadge = '⚡ Enterprise Microservices Architecture';
      score = 85;
    } else if (product.id === 'pdf-sd-vol-1') {
      isRelevant = false;
      score = 65;
    } else if (product.id === 'pdf-sd-vol-2') {
      isRelevant = false;
      score = 60;
    } else if (product.id === 'pdf-opex-cheatsheet') {
      isRelevant = false;
      score = 55;
    }
  } else {
    // Default context
    if (product.id === 'pdf-sd-vol-1' || product.id === 'pdf-sd-vol-2' || product.id === 'pdf-behavioral-cheatsheet') {
      isRelevant = true;
      relevanceBadge = '⚡ Recommended Study Guide';
      score = 80;
    }
  }

  return { isRelevant, relevanceBadge, score };
}

/**
 * Render the PDF Storefront section spanning full width at the bottom of the dashboard.
 * Designed with compact, smaller cards and contextually relevant suggestions.
 */
export function renderPdfStore(options = {}) {
  const currentTab = options.currentTab || 'system-design-roadmap';
  const week = options.week || 'today';
  const activeDay = options.activeDay || null;
  const activeFilter = options.filter || 'all';

  const purchased = new Set(getPurchasedPdfs());
  const bundle = PDF_PRODUCTS.find(p => p.isBundle);
  const rawItems = PDF_PRODUCTS.filter(p => !p.isBundle);
  const isBundlePurchased = purchased.has(bundle.id);

  // Compute relevance scores and badges for items
  const itemsWithRelevance = rawItems.map(p => {
    const rel = getProductRelevance(p, { currentTab, week, activeDay });
    return {
      ...p,
      isRelevant: rel.isRelevant,
      relevanceBadge: rel.relevanceBadge,
      relevanceScore: rel.score
    };
  });

  // Category filtering
  let filteredItems = itemsWithRelevance;
  if (activeFilter === 'recommended') {
    filteredItems = itemsWithRelevance.filter(p => p.isRelevant);
    if (filteredItems.length === 0) filteredItems = itemsWithRelevance;
  } else if (activeFilter === 'system-design') {
    filteredItems = itemsWithRelevance.filter(p => p.category === 'System Design');
  } else if (activeFilter === 'backend') {
    filteredItems = itemsWithRelevance.filter(p => p.category.includes('Language') || p.category.includes('Framework'));
  } else if (activeFilter === 'sre') {
    filteredItems = itemsWithRelevance.filter(p => p.category.includes('SRE'));
  } else if (activeFilter === 'behavioral') {
    filteredItems = itemsWithRelevance.filter(p => p.category.includes('Leadership'));
  }

  // Sort: relevant items first, then by score descending
  filteredItems.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const recommendedCount = itemsWithRelevance.filter(p => p.isRelevant).length;

  return `
    <section id="pdf-store-container" class="bg-white dark:bg-[#101827] border border-slate-200 dark:border-[#24314A] rounded-xl p-4 sm:p-5 lg:p-6 flex flex-col gap-4 shadow-xs dark:shadow-xl dark:shadow-black/50 transition-all">
      <!-- 1. Store Header with Relevance Context & Trust Badges -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-200 dark:border-[#24314A]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-[#F59E0B] shadow-xs shrink-0">
            <span class="material-symbols-outlined text-[20px]">auto_stories</span>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="font-sans text-[16px] sm:text-[17px] font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight">Interview Cheat Sheets &amp; Guides</h2>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-code font-bold bg-amber-50 dark:bg-[#F59E0B]/15 text-amber-800 dark:text-[#F59E0B] border border-amber-200 dark:border-[#F59E0B]/30 uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-[11px]">verified</span>
                <span>FAANG L5/L6 Calibrated</span>
              </span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-code font-semibold bg-indigo-50 dark:bg-[#182238] text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-500/30">
                ${currentTab === 'system-design-roadmap' ? '🎯 Tailored for System Design' : '🎯 Tailored for Coding & DSA Rounds'}
              </span>
            </div>
            <p class="font-sans text-[11.5px] text-slate-600 dark:text-[#94A3B8] mt-0.5">
              Battle-tested architectural specs, capacity math formulas, and behavioral scripts to clear senior loops.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 flex-wrap">
          <span class="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-[#0B111E] border border-slate-200 dark:border-[#24314A] text-[10.5px] font-code text-amber-600 dark:text-amber-400 font-semibold">
            <span class="material-symbols-outlined text-[13px]">star</span>
            <span>4.9/5 (5,200+ Engineers)</span>
          </span>
          <span class="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-[#0B111E] border border-slate-200 dark:border-[#24314A] text-[10.5px] font-code text-emerald-600 dark:text-emerald-400 font-semibold">
            <span class="material-symbols-outlined text-[13px]">bolt</span>
            <span>Instant Digital Access</span>
          </span>
        </div>
      </div>

      <!-- 2. Compact Filter Navigation Pills -->
      <div class="flex items-center justify-between gap-2 flex-wrap pt-0.5">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button 
            type="button"
            class="pdf-category-tab px-3 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer ${activeFilter === 'all' ? 'bg-[#4F46E5] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#141C2E] dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#24314A]'}"
            data-filter="all"
          >
            All Guides (${rawItems.length})
          </button>

          <button 
            type="button"
            class="pdf-category-tab px-3 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer flex items-center gap-1 ${activeFilter === 'recommended' ? 'bg-amber-500 text-black shadow-xs font-bold' : 'bg-amber-50 hover:bg-amber-100 dark:bg-[#141C2E] dark:hover:bg-[#1E293B] text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'}"
            data-filter="recommended"
          >
            <span class="material-symbols-outlined text-[13px]">stars</span>
            <span>Recommended for You (${recommendedCount})</span>
          </button>

          <button 
            type="button"
            class="pdf-category-tab px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer ${activeFilter === 'system-design' ? 'bg-[#4F46E5] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#141C2E] dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#24314A]'}"
            data-filter="system-design"
          >
            System Design (2)
          </button>

          <button 
            type="button"
            class="pdf-category-tab px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer ${activeFilter === 'backend' ? 'bg-[#4F46E5] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#141C2E] dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#24314A]'}"
            data-filter="backend"
          >
            Java &amp; Backend (2)
          </button>

          <button 
            type="button"
            class="pdf-category-tab px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer ${activeFilter === 'sre' ? 'bg-[#4F46E5] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#141C2E] dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#24314A]'}"
            data-filter="sre"
          >
            SRE &amp; Ops (1)
          </button>

          <button 
            type="button"
            class="pdf-category-tab px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer ${activeFilter === 'behavioral' ? 'bg-[#4F46E5] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#141C2E] dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#24314A]'}"
            data-filter="behavioral"
          >
            Behavioral STAR (1)
          </button>
        </div>

        <div class="text-[11px] font-code text-slate-500 dark:text-slate-400 hidden sm:inline">
          Format: Instant Markdown &amp; Printable PDF
        </div>
      </div>

      <!-- 3. Slim, Non-Intrusive Bestseller Bundle Strip -->
      <div class="pdf-bundle-strip p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs dark:shadow-md">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[16px]">menu_book</span>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[12.5px] font-sans font-bold text-slate-900 dark:text-white">${bundle.title}</span>
            <span class="text-[9.5px] font-code px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 font-bold uppercase tracking-wider">SAVE ₹${bundle.saveAmount} COMBO</span>
            <span class="text-[11px] text-slate-600 dark:text-slate-400 hidden lg:inline">• 240+ Pages of 20 architectures &amp; capacity math</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] font-code text-slate-400 dark:text-slate-500 line-through">₹${bundle.originalPrice}</span>
            <span class="text-[16px] font-bold font-code text-amber-600 dark:text-amber-400">₹${bundle.price}</span>
          </div>

          <button 
            type="button" 
            class="pdf-btn-preview open-pdf-checkout-btn px-2.5 py-1.5 rounded-lg font-sans text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
            data-product-id="${bundle.id}"
            data-action="preview"
          >
            <span class="material-symbols-outlined text-[13px]">visibility</span>
            <span>Preview</span>
          </button>

          <button 
            type="button" 
            class="open-pdf-checkout-btn pdf-btn-buy px-3 py-1.5 rounded-lg ${isBundlePurchased ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-xs'} font-sans text-[11.5px] font-bold flex items-center gap-1 transition-all cursor-pointer transform hover:-translate-y-0.2"
            data-product-id="${bundle.id}"
            data-action="${isBundlePurchased ? 'download' : 'buy'}"
          >
            <span class="material-symbols-outlined text-[14px]">${isBundlePurchased ? 'verified' : 'bolt'}</span>
            <span>${isBundlePurchased ? '✓ Bundle Unlocked' : `Buy Bundle (₹${bundle.price})`}</span>
          </button>
        </div>
      </div>

      <!-- 4. Grid of Smaller, Relevant Cheat Sheet Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        ${filteredItems.map(p => {
          const isPurchased = purchased.has(p.id) || (isBundlePurchased && (p.id === 'pdf-sd-vol-1' || p.id === 'pdf-sd-vol-2'));

          return `
            <div class="pdf-card bg-white dark:bg-[#111927] border ${p.isRelevant ? 'border-amber-400 dark:border-amber-500/40 shadow-xs shadow-amber-500/10' : 'border-slate-200 dark:border-[#24314A]'} hover:border-indigo-400 dark:hover:border-[#6366F1]/60 hover:shadow-md hover:shadow-indigo-500/10 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden">
              <!-- Glowing Top Accent Line -->
              <div class="absolute top-0 left-0 right-0 h-[2.5px]" style="background: linear-gradient(90deg, ${p.accentColor}, transparent);"></div>

              <div class="flex flex-col gap-2.5">
                <!-- Top Badge Row & Rating -->
                <div class="flex items-center justify-between gap-1.5">
                  <span class="px-2 py-0.5 rounded-full text-[8.5px] font-code font-bold uppercase tracking-wider truncate max-w-[60%]" style="background: ${p.accentColor}18; color: ${p.accentColor}; border: 1px solid ${p.accentColor}40">
                    ${p.badge}
                  </span>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[10px] font-code text-amber-600 dark:text-[#F59E0B] font-semibold flex items-center gap-0.5">
                      ★ ${p.rating}
                    </span>
                    <span class="text-[9px] font-code text-slate-500 dark:text-slate-400">(${p.reviews.replace(' ratings', '').replace('+', '+')})</span>
                    <span class="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#182238] border border-slate-200 dark:border-[#24314A] text-[9px] font-code text-slate-700 dark:text-slate-300">
                      ${p.pages}
                    </span>
                  </div>
                </div>

                <!-- Relevance Highlight Badge if active -->
                ${p.relevanceBadge ? `
                  <div class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 flex items-center gap-1 text-[9.5px] font-code text-amber-800 dark:text-amber-300 font-semibold">
                    <span class="material-symbols-outlined text-[12px] text-amber-600 dark:text-amber-400 shrink-0">offline_bolt</span>
                    <span class="truncate">${p.relevanceBadge}</span>
                  </div>
                ` : ''}

                <!-- Title & Icon -->
                <div class="flex items-start gap-2.5 pt-0.5">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#182238] border border-slate-200 dark:border-[#24314A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs" style="color: ${p.accentColor}">
                    <span class="material-symbols-outlined text-[17px]">${p.icon}</span>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <h4 class="font-sans text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#38BDF8] transition-colors leading-snug line-clamp-1">
                      ${p.title}
                    </h4>
                    <span class="text-[9.5px] font-code uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate mt-0.2">${p.subtitle}</span>
                  </div>
                </div>

                <!-- Concise 2-Line Value Pitch (Clean contrast in both Light & Dark themes) -->
                <p class="pdf-card-pitch font-sans text-[11px] leading-relaxed p-2 rounded-lg line-clamp-2">
                  ${p.pitch}
                </p>

                <!-- Compact Delivery Strip -->
                <div class="pdf-delivery-strip flex items-center justify-between text-[9px] font-code py-1 px-2 rounded">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[11px] text-indigo-600 dark:text-indigo-400">picture_as_pdf</span>
                    ${p.pages} PDF
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[11px] text-emerald-600 dark:text-emerald-400">bolt</span>
                    Instant Access
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[11px] text-amber-600 dark:text-[#F59E0B]">workspace_premium</span>
                    FAANG Tested
                  </span>
                </div>
              </div>

              <!-- Bottom Pricing & Action Row -->
              <div class="pt-2.5 mt-2.5 border-t border-slate-200 dark:border-[#24314A] flex items-center justify-between gap-2">
                <div class="flex flex-col">
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] font-code text-slate-400 dark:text-slate-500 line-through">₹${p.originalPrice}</span>
                    <span class="text-[8.5px] font-code font-bold px-1 py-0.2 rounded bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent">${p.discount}</span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="pdf-price-display text-[17px] font-bold font-code text-slate-900 dark:text-white">₹${p.price}</span>
                    <span class="text-[9px] font-code text-slate-500 dark:text-slate-400">one-time</span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  <button 
                    type="button" 
                    class="pdf-btn-preview open-pdf-checkout-btn px-2 py-1.5 rounded-lg font-sans text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    data-product-id="${p.id}"
                    data-action="preview"
                    title="Preview ${p.title}"
                  >
                    <span class="material-symbols-outlined text-[13px]">visibility</span>
                    <span>Preview</span>
                  </button>

                  <button 
                    type="button" 
                    class="open-pdf-checkout-btn pdf-btn-buy px-2.5 py-1.5 rounded-lg ${isPurchased ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] text-white shadow-xs'} font-sans text-[11.5px] font-bold flex items-center gap-1 transition-all cursor-pointer transform hover:-translate-y-0.2"
                    data-product-id="${p.id}"
                    data-action="${isPurchased ? 'download' : 'buy'}"
                    title="${isPurchased ? 'Unlocked • Click to Download' : `Buy ${p.title} for ₹${p.price}`}"
                  >
                    <span class="material-symbols-outlined text-[13px]">${isPurchased ? 'download_done' : 'shopping_bag'}</span>
                    <span>${isPurchased ? 'Download' : `Buy for ₹${p.price}`}</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- 5. Guarantees & Features Strip -->
      <div class="pt-3 border-t border-slate-200 dark:border-[#24314A] grid grid-cols-1 md:grid-cols-3 gap-2.5 text-center">
        <div class="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <span class="material-symbols-outlined text-[15px] text-amber-500">bolt</span>
          <span><strong>Instant Delivery:</strong> PDF &amp; Markdown files download immediately.</span>
        </div>
        <div class="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <span class="material-symbols-outlined text-[15px] text-emerald-500">verified</span>
          <span><strong>100% FAANG Calibrated:</strong> Formatted for Meta, Google, Amazon &amp; Uber loops.</span>
        </div>
        <div class="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <span class="material-symbols-outlined text-[15px] text-indigo-500 dark:text-[#38BDF8]">all_inclusive</span>
          <span><strong>Lifetime Free Revisions:</strong> All future architecture updates are included.</span>
        </div>
      </div>
    </section>
  `;
}

/**
 * Render the interactive Checkout / Preview Modal
 */
export function renderPdfCheckoutModal(product) {
  if (!product) return '';
  const purchased = new Set(getPurchasedPdfs());
  const isPurchased = purchased.has(product.id) || (purchased.has('bundle-system-design') && (product.id === 'pdf-sd-vol-1' || product.id === 'pdf-sd-vol-2'));

  return `
    <div id="pdf-checkout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div class="bg-white dark:bg-[#101827] text-slate-900 dark:text-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-[#24314A] overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#24314A] bg-slate-50 dark:bg-[#0B111E]">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-[#F59E0B]/15 border border-amber-200 dark:border-[#F59E0B]/30 flex items-center justify-center text-amber-600 dark:text-[#F59E0B]">
              <span class="material-symbols-outlined text-[17px]">${product.icon || 'menu_book'}</span>
            </span>
            <div>
              <span class="text-[10px] font-code uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Instant Technical Study Guide</span>
              <h3 class="font-sans text-[15px] font-bold text-slate-900 dark:text-white leading-tight">${product.title}</h3>
            </div>
          </div>
          <button id="close-pdf-modal-btn" class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md hover:bg-slate-200 dark:hover:bg-[#1E293B] transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
          <!-- Top Product Banner -->
          <div class="p-4 rounded-lg bg-slate-50 dark:bg-gradient-to-r dark:from-[#182238] dark:to-[#0F1626] border border-slate-200 dark:border-[#24314A] flex items-center justify-between gap-3">
            <div class="flex flex-col">
              <span class="text-[10px] font-code text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">${product.category}</span>
              <span class="text-[15px] font-sans font-bold text-slate-900 dark:text-white">${product.pages} • High-Res Printable PDF</span>
              <span class="text-[11.5px] text-slate-600 dark:text-slate-400 mt-0.5">${product.subtitle}</span>
            </div>
            <div class="text-right flex flex-col items-end shrink-0">
              ${product.originalPrice ? `<span class="text-[11px] font-code text-slate-400 dark:text-slate-500 line-through">₹${product.originalPrice}</span>` : ''}
              <span class="text-[22px] font-bold font-code text-amber-600 dark:text-[#F59E0B]">₹${product.price}</span>
              <span class="text-[9.5px] font-code text-emerald-600 dark:text-emerald-400 font-medium">One-time payment</span>
            </div>
          </div>

          <!-- Product Pitch -->
          <p class="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0B111E] p-3 rounded-lg border border-slate-200 dark:border-[#24314A]/70">
            ${product.pitch || product.subtitle}
          </p>

          <!-- Core Technical Modules Covered -->
          <div class="flex flex-col gap-2">
            <h4 class="font-sans text-[12px] font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider font-code">Core Technical Modules &amp; Coverage</h4>
            <div class="grid grid-cols-1 gap-2">
              ${(product.topics || product.highlights || []).map((t, idx) => `
                <div class="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B111E] border border-slate-200 dark:border-[#24314A]/70 text-[12px] text-slate-800 dark:text-slate-200">
                  <span class="w-6 h-6 rounded bg-white dark:bg-[#182238] border border-slate-200 dark:border-[#24314A] text-indigo-600 dark:text-[#38BDF8] flex items-center justify-center text-[10.5px] font-code font-bold shrink-0">
                    ${String(idx + 1).padStart(2, '0')}
                  </span>
                  <span class="font-medium">${t}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Special Upsell for Single Volumes -->
          ${(product.id === 'pdf-sd-vol-1' || product.id === 'pdf-sd-vol-2') && !isPurchased ? `
            <div class="p-3.5 rounded-lg bg-amber-50 dark:bg-[#F59E0B]/10 border border-amber-200 dark:border-[#F59E0B]/30 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-amber-600 dark:text-[#F59E0B]">local_offer</span>
                <div class="flex flex-col">
                  <span class="text-[11.5px] font-bold text-slate-900 dark:text-white">Upgrade to Vol 1 + Vol 2 Bundle</span>
                  <span class="text-[10px] text-slate-600 dark:text-slate-300">Get both volumes for only ₹249 (Save ₹49)</span>
                </div>
              </div>
              <button 
                type="button" 
                class="open-pdf-checkout-btn px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-black font-sans text-[11px] font-bold rounded shadow-xs cursor-pointer"
                data-product-id="bundle-system-design"
              >
                Switch to Combo (₹249)
              </button>
            </div>
          ` : ''}

          <!-- Delivery & Format Details -->
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#0B111E] border border-slate-200 dark:border-[#24314A] flex items-center justify-around text-center text-[10.5px] font-code text-slate-600 dark:text-slate-400">
            <div>
              <span class="block text-slate-900 dark:text-white font-bold text-[12px]">Instant</span>
              <span>Digital Access</span>
            </div>
            <div class="w-px h-6 bg-slate-200 dark:bg-[#24314A]"></div>
            <div>
              <span class="block text-slate-900 dark:text-white font-bold text-[12px]">PDF Format</span>
              <span>Tablet &amp; Print Ready</span>
            </div>
            <div class="w-px h-6 bg-slate-200 dark:bg-[#24314A]"></div>
            <div>
              <span class="block text-slate-900 dark:text-white font-bold text-[12px]">Lifetime</span>
              <span>Free Updates</span>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-4 border-t border-slate-200 dark:border-[#24314A] bg-slate-50 dark:bg-[#0B111E] flex items-center justify-between gap-3">
          <div class="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-code">
            <span class="material-symbols-outlined text-[14px] text-emerald-600 dark:text-emerald-400">lock</span>
            <span>256-bit Encrypted Checkout</span>
          </div>

          <div class="flex items-center gap-2">
            ${isPurchased ? `
              <button 
                id="download-purchased-pdf-btn" 
                class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-[12px] font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                data-product-id="${product.id}"
              >
                <span class="material-symbols-outlined text-[16px]">download</span>
                <span>Download PDF Guide</span>
              </button>
            ` : `
              <button 
                id="confirm-buy-pdf-btn" 
                class="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-black font-sans text-[13px] font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/30 cursor-pointer transition-all"
                data-product-id="${product.id}"
                data-price="${product.price}"
              >
                <span class="material-symbols-outlined text-[16px]">lock_open</span>
                <span>Pay ₹${product.price} &amp; Unlock Instantly</span>
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates and downloads study guide content for the specified product
 */
export function downloadProductGuide(product) {
  if (!product) return;

  const content = `# ${product.title}
${product.subtitle}
Price: ₹${product.price} | Pages: ${product.pages}
45-Day Interview Prep OS Verified Technical Guide

================================================================================
CORE MODULES & COVERAGE
================================================================================
${(product.topics || product.highlights || []).map((h, i) => `${i + 1}. ${h}`).join('\n')}

================================================================================
CORE ARCHITECTURAL BLUEPRINTS & FORMULAS
================================================================================
1. High-Availability SLA Targets:
   - 99.99% Availability = Maximum 52.6 minutes downtime/year
   - 99.999% Availability = Maximum 5.26 minutes downtime/year
   - Standard p99 Latency Budget: < 15ms for Cache Lookups, < 50ms for DB Queries

2. Back-of-the-Envelope Estimation Rules:
   - 1 Million requests/day ≈ 12 QPS average (Peak ~ 25-30 QPS)
   - 100 Million requests/day ≈ 1,200 QPS average (Peak ~ 2,500-3,000 QPS)
   - 1 Billion requests/day ≈ 12,000 QPS average (Peak ~ 25,000-30,000 QPS)
   - Data Storage: 1KB per record * 100M records = 100 GB / day = 36.5 TB / year

3. Invariant Proofs & Essential Principles:
   - PACELC Theorem: In partitioned networks (P), choose Availability (A) vs Consistency (C);
     ELSE (E) choose Latency (L) vs Consistency (C).
   - Write-Ahead Logging (WAL) + LSM-Trees: Sequential append-only disk writes (fast O(1)) 
     combined with MemTables and SSTables for high-throughput write workloads (Cassandra/Kafka).

4. Production Readiness Checklist:
   - Health Checks (/healthz, /readyz) with independent liveness probes
   - Jittered Exponential Backoff to prevent Thundering Herd
   - Circuit Breakers (Envoy / Resilience4j) with half-open state recovery
   - Distributed Tracing Context Propagation (W3C traceparent headers)

================================================================================
Downloaded from 45-Day Interview Prep OS.
Keep this guide accessible for immediate pre-interview active recall!
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${product.id.replace(/-/g, '_')}_interview_ready.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
