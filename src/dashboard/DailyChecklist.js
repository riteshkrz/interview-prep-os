import { state, findMatchingCatalogItem } from './state.js';

export function renderDailyChecklist() {
  const currentPlan = state.curriculum[state.activeDay] || {};
  const tasks = state.checklist[state.activeDay] || [];
  const activeTopic = currentPlan.topic || `Day ${state.activeDay} Focus`;
  const phase = currentPlan.phase || 'Interview Preparation Sprint';
  const headlineTarget = currentPlan.headlineTarget || 'Core Practice';
  const estTime = currentPlan.estTime || '75 mins';

  const completedCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length || 1;
  const completionPct = Math.round((completedCount / totalCount) * 100);

  const tasksHtml = tasks.map((t, idx) => {
    const isDone = Boolean(t.done);
    const isRunning = Boolean(t.inProgress);
    const category = (t.category || 'DSA').toUpperCase();
    const confidence = Number(t.confidence || 0);
    const timerSeconds = Number(t.timerSeconds || 0);

    // Resolve matching catalog item (DSA Problem or System Design Spec)
    const match = findMatchingCatalogItem(t);
    const catItem = match?.item;

    // Determine titles & details
    let displayTitle = t.text;
    let difficulty = catItem?.difficulty || (category === 'DSA' ? (idx === 0 ? 'Easy' : idx === 1 ? 'Medium' : 'Hard') : 'Hard');
    let patternOrDomain = catItem?.pattern || catItem?.domain || (category === 'DSA' ? 'Core Algorithmic Pattern' : category === 'SYS DESIGN' ? 'Distributed Systems' : 'Active Spaced Recall');
    let complexityStr = '';
    let detailedDesc = '';
    let keyInsight = '';

    if (match?.type === 'DSA' && catItem) {
      displayTitle = catItem.title || t.text;
      const parenMatch = t.text.match(/\(([^)]+)\)/);
      const technique = parenMatch ? parenMatch[1] : (catItem.pattern || 'Optimal Pattern');

      // Extract complexity from technique if mentioned, or provide standard target
      const compMatch = technique.match(/O\([^)]+\)/g);
      const timeComp = compMatch ? compMatch[0] : (catItem.pattern?.includes('Binary') ? 'O(log N)' : 'O(N)');
      const spaceComp = compMatch && compMatch[1] ? compMatch[1] : (catItem.pattern?.includes('In-place') ? 'O(1)' : 'O(N)');
      complexityStr = `<span class="font-code text-[11px] text-[#818CF8] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">bolt</span>Time: ${escapeHtml(timeComp)} | Space: ${escapeHtml(spaceComp)}</span>`;

      detailedDesc = catItem.description || `${technique}. Analyze optimal algorithmic guarantees, edge cases, and boundary invariant proofs.`;
      keyInsight = `
        <div class="mt-1.5 p-2.5 rounded bg-[#0A0E17]/80 border border-[#24314A]/80 flex items-start gap-2">
          <span class="material-symbols-outlined text-[15px] text-[#38BDF8] mt-0.5 shrink-0">lightbulb</span>
          <div class="text-[11.5px] text-[#94A3B8] leading-relaxed">
            <strong class="text-[#E2E8F0]">Algorithmic Blueprint:</strong> ${escapeHtml(technique)} — ${escapeHtml(currentPlan.objective || 'Master invariant bounds and zero-redundancy space reduction.')}
          </div>
        </div>
      `;
    } else if (match?.type === 'SYS DESIGN' && catItem) {
      displayTitle = catItem.title || t.text;
      const rubric = catItem.rubric || {};
      detailedDesc = rubric.scope || catItem.domain || t.subnote || 'Architect high-availability distributed component with bounded latencies and failover.';
      keyInsight = `
        <div class="mt-1.5 p-2.5 rounded bg-[#0A0E17]/80 border border-[#24314A]/80 flex flex-col gap-1.5 text-[11.5px] text-[#94A3B8]">
          <div class="flex items-start gap-2">
            <span class="material-symbols-outlined text-[15px] text-[#818CF8] mt-0.5 shrink-0">account_tree</span>
            <div><strong class="text-[#E2E8F0]">API Contract:</strong> <code class="font-code text-[10.5px] text-[#38BDF8]">${escapeHtml(rubric.api || 'POST /v1/resource { id }')}</code></div>
          </div>
          <div class="flex items-start gap-2">
            <span class="material-symbols-outlined text-[15px] text-[#F59E0B] mt-0.5 shrink-0">storage</span>
            <div><strong class="text-[#E2E8F0]">Storage &amp; Scale:</strong> ${escapeHtml(rubric.dataModel || rubric.deepDive || 'Clustered in-memory state with replication')}</div>
          </div>
        </div>
      `;
    } else {
      detailedDesc = t.subnote || currentPlan.objective || 'Active interval recall drill to reinforce invariant principles and complexity defense.';
      keyInsight = `
        <div class="mt-1.5 p-2 rounded bg-[#0A0E17]/60 border border-[#24314A]/60 flex items-center gap-2 text-[11px] text-[#94A3B8]">
          <span class="material-symbols-outlined text-[14px] text-[#34D399]">replay</span>
          <span><strong class="text-[#E2E8F0]">Objective:</strong> ${escapeHtml(currentPlan.objective || 'Spaced retention drill')}</span>
        </div>
      `;
    }

    // Category Badge
    let catBadge = '';
    if (category === 'SYS DESIGN' || category === 'SYSTEM DESIGN') {
      catBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code bg-purple-500/15 text-[#C084FC] border border-purple-500/30 font-bold">SYS DESIGN</span>`;
    } else if (category === 'REVISION' || category === 'STAR') {
      catBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code bg-emerald-500/15 text-[#34D399] border border-emerald-500/30 font-bold">REVISION</span>`;
    } else {
      catBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code bg-cyan-500/15 text-[#38BDF8] border border-cyan-500/30 font-bold">DSA</span>`;
    }

    // Difficulty Badge
    let diffBadge = '';
    if (difficulty === 'Hard') {
      diffBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code bg-rose-500/15 text-[#F87171] border border-rose-500/30 font-bold">Hard</span>`;
    } else if (difficulty === 'Medium') {
      diffBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code bg-amber-500/15 text-[#F59E0B] border border-amber-500/30 font-bold">Medium</span>`;
    } else {
      diffBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-code bg-emerald-500/15 text-[#10B981] border border-emerald-500/30 font-bold">Easy</span>`;
    }

    // Confidence Stars Label
    const confidenceText = confidence > 0 
      ? `${confidence}/5 Stars: ${getConfidenceDescriptor(confidence)}`
      : 'Click 1–5 stars to set confidence';

    // Status Badge
    let statusBadge = '';
    if (isDone) {
      statusBadge = `
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-code bg-emerald-500/20 text-[#10B981] border border-emerald-500/40 font-bold flex items-center gap-1">
          <span class="material-symbols-outlined text-[13px]">check_circle</span> Mastered
        </span>
      `;
    } else if (isRunning) {
      statusBadge = `
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-code bg-cyan-500/20 text-[#38BDF8] border border-cyan-500/40 font-bold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping"></span> Live Timer Running
        </span>
      `;
    } else {
      statusBadge = `
        <span class="px-2 py-0.5 rounded-full text-[10px] font-code bg-slate-500/15 text-[#64748B] border border-[#24314A] font-medium">
          Pending
        </span>
      `;
    }

    // Specs & Code Button
    const viewModalBtn = catItem ? `
      <button 
        type="button" 
        class="view-task-details-btn px-2.5 py-1.5 rounded-md bg-[#182238] hover:bg-[#24314A] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#24314A] hover:border-[#38BDF8]/40 font-code text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors" 
        data-task-id="${t.id}" 
        data-catalog-id="${catItem.id}"
        data-catalog-type="${match.type}"
        title="Open full problem rubric, test cases, and clean code solution"
      >
        <span class="material-symbols-outlined text-[14px] text-[#38BDF8]">code_blocks</span>
        <span>Specs &amp; Code</span>
      </button>
    ` : '';

    const leetCodeLinkBtn = catItem?.link ? `
      <a 
        href="${catItem.link}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="px-2.5 py-1.5 rounded-md bg-[#182238] hover:bg-[#24314A] text-[#38BDF8] border border-[#24314A] hover:border-[#38BDF8]/40 font-code text-[11px] font-semibold flex items-center gap-1 transition-colors"
        title="Open problem directly on LeetCode"
      >
        <span class="material-symbols-outlined text-[13px]">open_in_new</span>
        <span>LeetCode</span>
      </a>
    ` : '';

    return `
      <div 
        class="task-card bg-[#0F1626] border ${isDone ? 'border-emerald-500/40 bg-emerald-950/10' : isRunning ? 'border-[#38BDF8] shadow-sm shadow-[#38BDF8]/20 bg-[#121B2F]' : 'border-[#24314A] hover:border-[#6366F1]/50'} rounded-xl p-4 md:p-5 flex flex-col gap-3.5 transition-all duration-200" 
        data-task-id="${t.id}"
      >
        <!-- Top Row: Badges, Live Timer, Remove -->
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            ${catBadge}
            ${diffBadge}
            <span class="font-code text-[10.5px] text-[#38BDF8] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded font-semibold">
              ${escapeHtml(patternOrDomain)}
            </span>
            ${complexityStr}
          </div>

          <div class="flex items-center gap-2.5">
            ${statusBadge}
            
            <!-- Live Stopwatch Badge -->
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0E17] border border-[#24314A] font-code text-[11px] text-[#94A3B8]">
              <span class="material-symbols-outlined text-[13px] ${isRunning ? 'text-[#38BDF8] animate-spin' : 'text-[#64748B]'}">schedule</span>
              <span class="timer-text font-bold ${isRunning ? 'text-[#38BDF8]' : 'text-[#F8FAFC]'}" data-timer-display="${t.id}">
                ${formatTimer(timerSeconds)}
              </span>
            </div>

            <!-- Remove Button -->
            <button class="delete-task-btn text-[#64748B] hover:text-[#F87171] p-1 transition-colors cursor-pointer" data-task-id="${t.id}" title="Remove task from daily plan">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        <!-- Problem / Spec Headline & Core Description -->
        <div class="flex flex-col gap-1">
          <h3 class="font-sans text-[16px] font-bold ${isDone ? 'text-slate-300 line-through' : 'text-[#F8FAFC]'} flex items-center gap-2">
            ${escapeHtml(displayTitle)}
            ${catItem?.id ? `<span class="font-code text-[10px] text-[#64748B] font-normal no-underline">#${catItem.id}</span>` : ''}
          </h3>

          <p class="font-sans text-[13px] text-[#94A3B8] leading-relaxed mt-0.5">
            ${escapeHtml(detailedDesc)}
          </p>

          ${keyInsight}
        </div>

        <!-- Bottom Action Strip: Confidence Stars + Live Timer + Complete Action -->
        <div class="pt-3 border-t border-[#24314A]/70 flex items-center justify-between flex-wrap gap-3">
          
          <!-- Left: 1-5 Confidence Stars Picker -->
          <div class="flex items-center gap-2.5 flex-wrap" id="confidence-wrap-${t.id}">
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-code text-[#94A3B8] font-semibold">Confidence Rating:</span>
              <div class="flex items-center gap-0.5 star-container" data-task-confidence-stars="${t.id}">
                ${renderConfidenceStars(confidence, t.id)}
              </div>
            </div>
            
            <span class="text-[11px] font-code ${confidence > 0 ? 'text-[#F59E0B] font-semibold' : 'text-[#64748B]'}" id="confidence-label-${t.id}">
              ${escapeHtml(confidenceText)}
            </span>

            <!-- Inline validation warning if user clicks complete without rating -->
            <div class="hidden items-center gap-1 px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-code text-[10.5px] font-semibold animate-pulse" id="confidence-warning-${t.id}">
              <span class="material-symbols-outlined text-[13px]">warning</span>
              <span>Rate 1–5★ before completing!</span>
            </div>
          </div>

          <!-- Right: Action Buttons (Start Timer, Specs, Complete / Reopen) -->
          <div class="flex items-center gap-2.5">
            <!-- Start / Pause Timer Button -->
            <button 
              type="button"
              class="task-timer-btn px-3 py-1.5 rounded-md font-sans text-[11.5px] font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${isRunning ? 'bg-cyan-500/20 text-[#38BDF8] border-[#38BDF8] hover:bg-cyan-500/30' : 'bg-[#182238] hover:bg-[#24314A] text-[#38BDF8] border-[#24314A] hover:border-[#38BDF8]/60'}" 
              data-task-id="${t.id}"
              data-running="${isRunning ? 'true' : 'false'}"
            >
              <span class="material-symbols-outlined text-[15px]">${isRunning ? 'pause' : 'play_arrow'}</span>
              <span class="timer-btn-text">${isRunning ? 'Pause Timer' : 'Start Timer'}</span>
            </button>

            <!-- Specs & Code Modal Button -->
            ${viewModalBtn}
            ${leetCodeLinkBtn}

            <!-- Complete or Reopen Button -->
            ${isDone ? `
              <div class="flex items-center gap-1.5">
                <span class="px-3 py-1.5 rounded-md bg-emerald-500/20 text-[#10B981] border border-emerald-500/40 font-sans text-[11.5px] font-bold flex items-center gap-1 shadow-xs">
                  <span class="material-symbols-outlined text-[15px]">done_all</span>
                  <span>Mastered</span>
                </span>
                <button 
                  type="button" 
                  class="reopen-task-btn px-2.5 py-1.5 rounded-md bg-[#182238] hover:bg-[#24314A] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#24314A] font-code text-[11px] font-medium transition-colors cursor-pointer" 
                  data-task-id="${t.id}"
                  title="Reopen task to practice again"
                >
                  <span class="material-symbols-outlined text-[13px] align-middle">replay</span>
                  <span>Reopen</span>
                </button>
              </div>
            ` : `
              <button 
                type="button" 
                class="complete-task-btn px-4 py-1.5 rounded-md bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white font-sans text-[12px] font-bold shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer" 
                data-task-id="${t.id}"
                title="Mark this task completed and update readiness metrics"
              >
                <span class="material-symbols-outlined text-[15px]">check</span>
                <span>Complete Task</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="w-full bg-[#141C2E] border border-[#24314A] rounded-xl p-5 md:p-6 flex flex-col gap-4 shadow-md shadow-black/40">
      
      <!-- Full-Width Header Bar -->
      <div class="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#24314A]/70">
        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-[#38BDF8] flex items-center justify-center">
            <span class="material-symbols-outlined text-[18px]">checklist</span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="font-sans text-[17px] text-[#F8FAFC] font-bold tracking-tight">Today's Execution Checklist</h2>
              <span class="px-2 py-0.5 rounded font-code text-[10.5px] bg-[#182238] text-[#38BDF8] border border-[#24314A] font-bold">
                Day ${state.activeDay} of 45
              </span>
              <span class="px-2 py-0.5 rounded font-code text-[10.5px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                ${escapeHtml(phase)}
              </span>
            </div>
            <span class="text-[12px] font-sans text-[#94A3B8] mt-0.5">
              Topic: <strong class="text-[#F8FAFC]">${escapeHtml(activeTopic)}</strong> • Target: ${escapeHtml(headlineTarget)} (Est. ${escapeHtml(estTime)})
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Day Completion Pill -->
          <div class="flex items-center gap-2 bg-[#0A0E17] border border-[#24314A] px-3 py-1.5 rounded-lg">
            <div class="flex flex-col text-right">
              <span class="font-code text-[11.5px] font-bold ${completionPct === 100 ? 'text-[#10B981]' : 'text-[#38BDF8]'}">
                ${completedCount} / ${totalCount} Done (${completionPct}%)
              </span>
              <span class="font-sans text-[10px] text-[#64748B]">Daily Velocity</span>
            </div>
            <div class="w-12 bg-[#182238] h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-[#38BDF8] to-[#10B981] h-full rounded-full transition-all duration-500" style="width: ${completionPct}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Checklist Items Container (Full Width Cards) -->
      <div class="flex flex-col gap-3.5" id="checklist-container">
        ${tasksHtml || '<p class="text-[13px] text-[#64748B] p-4 text-center">No tasks defined for this day yet. Add an ad-hoc problem or spec below!</p>'}
      </div>

      <!-- Quick Add Task Bar -->
      <div class="flex items-center gap-2 pt-2 border-t border-[#24314A]/50 flex-wrap">
        <div class="relative flex-1 min-w-[240px]">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-[#64748B]">add_task</span>
          <input 
            type="text" 
            id="new-task-input" 
            placeholder="Add an ad-hoc problem, bug note, or concept to drill today..." 
            class="w-full bg-[#0F1626] text-[#F8FAFC] text-[12.5px] font-sans pl-9 pr-3 py-2 rounded-lg border border-[#24314A] placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] focus:bg-[#182238] transition-colors"
          />
        </div>
        
        <select id="new-task-cat" class="bg-[#0F1626] text-[#94A3B8] border border-[#24314A] rounded-lg px-2.5 py-2 font-code text-[12px] focus:outline-none focus:border-[#6366F1]">
          <option value="DSA">DSA</option>
          <option value="SYS DESIGN">SYS DESIGN</option>
          <option value="REVISION">REVISION</option>
        </select>

        <button id="add-task-btn" class="px-4 py-2 bg-[#182238] hover:bg-[#6366F1] text-[#F8FAFC] border border-[#24314A] hover:border-[#6366F1] rounded-lg font-sans text-[12px] font-bold transition-all cursor-pointer">
          Add Task
        </button>
      </div>
    </div>
  `;
}

function renderConfidenceStars(rating = 0, taskId) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= rating;
    html += `
      <button 
        type="button" 
        class="task-star-btn p-0.5 text-left transition-transform hover:scale-125 focus:outline-none cursor-pointer" 
        data-task-id="${taskId}" 
        data-star="${i}" 
        title="${getStarTooltip(i)}"
      >
        <span class="material-symbols-outlined text-[19px] ${isFilled ? 'text-[#F59E0B]' : 'text-[#334155] hover:text-[#F59E0B]/70'}">
          star
        </span>
      </button>
    `;
  }
  return html;
}

function getStarTooltip(star) {
  switch (star) {
    case 1: return '1★: Struggled / Needed solution';
    case 2: return '2★: Needed heavy hints';
    case 3: return '3★: Solved with moderate effort';
    case 4: return '4★: Clean optimal solve';
    case 5: return '5★: Mastered instantly / Interview ready';
    default: return 'Rate confidence';
  }
}

function getConfidenceDescriptor(rating) {
  switch (rating) {
    case 1: return 'Struggled / Needed Solution';
    case 2: return 'Needed Hints';
    case 3: return 'Solved with Effort';
    case 4: return 'Clean Optimal Solve';
    case 5: return 'Mastered Instantly';
    default: return 'Rated';
  }
}

function formatTimer(seconds = 0) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
