/**
 * Rate Limiter Simulator Component
 * Interactive educational simulator for Fixed Window Counter rate limiting
 * Question 2: Design a Distributed Rate Limiter
 */

export function calculateRateLimiterState(requests, limit, duration = '60s') {
  const reqCount = Math.max(1, Math.min(10, parseInt(requests, 10) || 7));
  const limitCount = Math.max(1, Math.min(10, parseInt(limit, 10) || 5));
  const accepted = Math.min(reqCount, limitCount);
  const rejected = Math.max(0, reqCount - limitCount);

  return {
    requests: reqCount,
    limit: limitCount,
    duration,
    accepted,
    rejected
  };
}

export function formatRateLimiterExplanation(requests, limit, duration = '60s') {
  const accepted = Math.min(requests, limit);
  const rejected = Math.max(0, requests - limit);

  const durationLabels = {
    '10s': 'a 10-second fixed window',
    '60s': 'a 60-second fixed window',
    '300s': 'a 5-minute fixed window'
  };
  const windowStr = durationLabels[duration] || 'a 60-second fixed window';

  const reqStr = requests === 1 ? '1 request' : `${requests} requests`;
  const accStr = accepted === 1 ? '1 is allowed' : `${accepted} are allowed`;
  const rejStr = rejected === 1 ? '1 is rejected' : `${rejected} are rejected`;

  let exceededStr = '';
  if (rejected === 0) {
    exceededStr = ' All requests are within the configured limit.';
  } else if (rejected === 1) {
    exceededStr = ' The rate limit has been exceeded by 1 request.';
  } else {
    exceededStr = ` The rate limit has been exceeded by ${rejected} requests.`;
  }

  return `Out of ${reqStr} in ${windowStr}, ${accStr} and ${rejStr}.${exceededStr}`;
}

export function renderRequestCards(requests, limit) {
  const cards = [];
  for (let i = 1; i <= requests; i++) {
    const isAllowed = i <= limit;
    if (isAllowed) {
      cards.push(`
        <div class="flex flex-col items-center justify-between p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 text-center gap-1.5 transition-all shadow-2xs">
          <div class="flex items-center justify-between w-full">
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">#${i}</span>
            <span class="material-symbols-outlined text-[17px] text-emerald-600 dark:text-emerald-400">check_circle</span>
          </div>
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-[12px] font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">200</span>
            <span class="text-[9.5px] uppercase font-bold text-emerald-600 dark:text-emerald-400 font-mono">Allowed</span>
          </div>
        </div>
      `);
    } else {
      cards.push(`
        <div class="flex flex-col items-center justify-between p-2.5 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 text-center gap-1.5 transition-all shadow-2xs">
          <div class="flex items-center justify-between w-full">
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">#${i}</span>
            <span class="material-symbols-outlined text-[17px] text-rose-600 dark:text-rose-400">cancel</span>
          </div>
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-[12px] font-extrabold text-rose-700 dark:text-rose-300 font-mono">429</span>
            <span class="text-[9.5px] uppercase font-bold text-rose-600 dark:text-rose-400 font-mono">Blocked</span>
          </div>
        </div>
      `);
    }
  }
  return cards.join('');
}

// Global browser update logic
if (typeof window !== 'undefined') {
  window.__prepOsRateLimiterDuration = '60s';

  window.__prepOsUpdateRateLimiterSim = function() {
    const container = document.getElementById('rate-limiter-simulator-container');
    if (!container) return;

    const reqSlider = document.getElementById('sim-requests-slider');
    const limitSlider = document.getElementById('sim-limit-slider');
    if (!reqSlider || !limitSlider) return;

    const requests = parseInt(reqSlider.value, 10);
    const limit = parseInt(limitSlider.value, 10);
    const duration = window.__prepOsRateLimiterDuration || '60s';

    const state = calculateRateLimiterState(requests, limit, duration);

    // Update value labels
    const reqVal = document.getElementById('sim-requests-val');
    if (reqVal) reqVal.textContent = state.requests;

    const limitVal = document.getElementById('sim-limit-val');
    if (limitVal) limitVal.textContent = state.limit;

    // Update summary counts
    const acceptedCount = document.getElementById('sim-accepted-count');
    if (acceptedCount) acceptedCount.textContent = state.accepted;

    const rejectedCount = document.getElementById('sim-rejected-count');
    if (rejectedCount) rejectedCount.textContent = state.rejected;

    // Update dynamic explanation text
    const explanation = document.getElementById('sim-explanation');
    if (explanation) {
      explanation.textContent = formatRateLimiterExplanation(state.requests, state.limit, state.duration);
    }

    // Update cards container
    const cardsContainer = document.getElementById('sim-cards-container');
    if (cardsContainer) {
      cardsContainer.innerHTML = renderRequestCards(state.requests, state.limit);
    }

    // Update timeline subtitle
    const timelineCount = document.getElementById('sim-timeline-count');
    if (timelineCount) {
      timelineCount.textContent = `${state.requests} ${state.requests === 1 ? 'request' : 'requests'}`;
    }

    // Update config badge
    const configLabel = document.getElementById('sim-config-label');
    if (configLabel) {
      const durText = duration === '10s' ? '10s' : duration === '300s' ? '5m' : '60s';
      configLabel.textContent = `${state.limit} req / ${durText} window`;
    }
  };

  window.__prepOsSetDurationRateLimiterSim = function(duration) {
    window.__prepOsRateLimiterDuration = duration;

    // Update active button styling
    const buttons = document.querySelectorAll('.sim-duration-btn');
    buttons.forEach(btn => {
      if (btn.dataset.duration === duration) {
        btn.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
        btn.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
      } else {
        btn.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
        btn.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
      }
    });

    window.__prepOsUpdateRateLimiterSim();
  };

  window.__prepOsResetRateLimiterSim = function() {
    const reqSlider = document.getElementById('sim-requests-slider');
    const limitSlider = document.getElementById('sim-limit-slider');
    if (reqSlider) reqSlider.value = '7';
    if (limitSlider) limitSlider.value = '5';

    window.__prepOsSetDurationRateLimiterSim('60s');
  };
}

export function renderRateLimiterSimulator() {
  const defaultRequests = 7;
  const defaultLimit = 5;
  const defaultDuration = '60s';

  const defaultExplanation = formatRateLimiterExplanation(defaultRequests, defaultLimit, defaultDuration);
  const defaultCards = renderRequestCards(defaultRequests, defaultLimit);

  return `
    <!-- RATE LIMITER SIMULATOR COMPONENT -->
    <div id="rate-limiter-simulator-container" class="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-[#F8FAFC] dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm flex flex-col gap-5 text-[#0F172A] dark:text-slate-200 my-2">
      
      <!-- HEADER -->
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2.5">
        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[19px]">tune</span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-sans text-[16px] sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">Rate Limiter Simulator</h4>
              <span class="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/40 text-[10.5px] font-mono font-bold uppercase tracking-wider">Fixed Window Counter</span>
            </div>
            <span class="text-[12px] text-slate-500 dark:text-slate-400">Educational sandbox simulating requests arriving within one fixed window</span>
          </div>
        </div>

        <!-- Reset Button -->
        <button type="button" 
          id="sim-reset-btn"
          onclick="window.__prepOsResetRateLimiterSim()"
          class="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs">
          <span class="material-symbols-outlined text-[15px] text-slate-500 dark:text-slate-400">restart_alt</span>
          <span>Reset example</span>
        </button>
      </div>

      <!-- CONFIGURATION HIGHLIGHT BADGES -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[12px]">
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-0.5">
          <span class="text-[10.5px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold">Algorithm</span>
          <span class="font-bold text-slate-800 dark:text-slate-200 text-[12px]">Fixed Window Counter</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-0.5">
          <span class="text-[10.5px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold">Default Limit</span>
          <span class="font-bold text-indigo-600 dark:text-indigo-400 text-[12px]">5 req / user / window</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-0.5">
          <span class="text-[10.5px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold">Default Window</span>
          <span class="font-bold text-slate-800 dark:text-slate-200 text-[12px]">60 seconds</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col gap-0.5">
          <span class="text-[10.5px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold">Active Policy</span>
          <span id="sim-config-label" class="font-bold text-cyan-600 dark:text-cyan-400 text-[12px]">5 req / 60s window</span>
        </div>
      </div>

      <!-- INTERACTIVE CONTROLS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 shadow-2xs">
        
        <!-- Control A: Requests made (1-10) -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label for="sim-requests-slider" class="text-[12.5px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-cyan-600 dark:text-cyan-400">send</span>
              Requests made:
            </label>
            <span id="sim-requests-val" class="font-mono text-[14px] font-extrabold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-900/50">7</span>
          </div>
          <input type="range" 
            id="sim-requests-slider" 
            min="1" 
            max="10" 
            value="7" 
            step="1"
            aria-label="Requests made in window"
            oninput="window.__prepOsUpdateRateLimiterSim()"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>1</span>
            <span>5</span>
            <span>10 requests</span>
          </div>
        </div>

        <!-- Control B: Allowed requests per window (1-10) -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label for="sim-limit-slider" class="text-[12.5px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-indigo-600 dark:text-indigo-400">speed</span>
              Allowed requests (Limit):
            </label>
            <span id="sim-limit-val" class="font-mono text-[14px] font-extrabold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50">5</span>
          </div>
          <input type="range" 
            id="sim-limit-slider" 
            min="1" 
            max="10" 
            value="5" 
            step="1"
            aria-label="Allowed requests per window limit"
            oninput="window.__prepOsUpdateRateLimiterSim()"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>1</span>
            <span>5</span>
            <span>10 limit</span>
          </div>
        </div>

        <!-- Control C: Window duration segmented control -->
        <div class="flex flex-col gap-2">
          <label class="text-[12.5px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-amber-600 dark:text-amber-400">timer</span>
            Window duration:
          </label>
          <div class="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11.5px] w-full" role="radiogroup" aria-label="Window duration">
            <button type="button" 
              data-duration="10s"
              onclick="window.__prepOsSetDurationRateLimiterSim('10s')"
              class="sim-duration-btn flex-1 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all font-medium text-center cursor-pointer">
              10s
            </button>
            <button type="button" 
              data-duration="60s"
              onclick="window.__prepOsSetDurationRateLimiterSim('60s')"
              class="sim-duration-btn active flex-1 py-1.5 rounded-md bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs font-bold text-center cursor-pointer">
              60s
            </button>
            <button type="button" 
              data-duration="300s"
              onclick="window.__prepOsSetDurationRateLimiterSim('300s')"
              class="sim-duration-btn flex-1 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all font-medium text-center cursor-pointer">
              5 min
            </button>
          </div>
          <div class="text-[10px] text-slate-400 text-center font-mono">
            Configured sliding threshold
          </div>
        </div>

      </div>

      <!-- TWO SUMMARY CARDS (ACCEPTED & REJECTED) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <!-- Accepted Requests -->
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px]">check_circle</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Accepted Requests</span>
              <span class="text-[11.5px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold">HTTP 200 OK &bull; Under Quota</span>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span id="sim-accepted-count" class="text-[30px] font-mono font-black text-emerald-600 dark:text-emerald-400 leading-none">5</span>
          </div>
        </div>

        <!-- Rejected Requests -->
        <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px]">cancel</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Rejected Requests</span>
              <span class="text-[11.5px] font-mono text-rose-800 dark:text-rose-300 font-semibold">HTTP 429 &bull; Too Many Requests</span>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span id="sim-rejected-count" class="text-[30px] font-mono font-black text-rose-600 dark:text-rose-400 leading-none">2</span>
          </div>
        </div>
      </div>

      <!-- DYNAMIC EXPLANATION BANNER -->
      <div class="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <span class="material-symbols-outlined text-[20px] text-indigo-600 dark:text-indigo-400 shrink-0">analytics</span>
        <p id="sim-explanation" class="text-[13px] font-medium leading-relaxed text-slate-800 dark:text-slate-200">
          ${defaultExplanation}
        </p>
      </div>

      <!-- DYNAMIC REQUEST VISUALIZATION TIMELINE -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="text-[13px] font-bold text-slate-900 dark:text-white">Individual Request Cards</span>
            <span id="sim-timeline-count" class="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-semibold">7 requests</span>
          </div>
          <div class="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> 200 OK (Allowed)</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span> 429 (Blocked)</span>
          </div>
        </div>

        <!-- Rendered Request Cards Grid -->
        <div id="sim-cards-container" class="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          ${defaultCards}
        </div>
      </div>

      <!-- TECHNICAL NOTE / EDUCATIONAL DISCLAIMER -->
      <div class="p-3 rounded-lg bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800/80 text-[11.5px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <span class="material-symbols-outlined text-[16px] text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">info</span>
        <p class="leading-relaxed">
          <strong>Educational Simulation (Fixed Window Counter):</strong> All visualized requests are assumed to arrive within the same fixed time window. Adjusting the window duration changes the configured policy threshold (e.g., 5 requests per 60s per user) rather than simulating physical clock elapsed time or automated counter resets.
        </p>
      </div>

    </div>
  `;
}
