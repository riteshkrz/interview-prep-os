/**
 * System Design Practice Whiteboard - View & UI Component
 * Polished, high-density System Design Interview Practice Studio layout.
 * Features compact workspace header, mode selector, categorized component library,
 * contextual properties panel, 12-item self-assessment rubric, and empty canvas welcome modal.
 */

import {
  INTERVIEW_PHASES,
  INTERVIEW_RUBRIC,
  COMPONENT_CATEGORIES,
  SYSTEM_DESIGN_QUESTIONS,
  STARTER_TEMPLATES
} from './whiteboardData.js';

export {
  INTERVIEW_PHASES,
  INTERVIEW_RUBRIC,
  COMPONENT_CATEGORIES,
  SYSTEM_DESIGN_QUESTIONS,
  STARTER_TEMPLATES,
  SYSTEM_DESIGN_QUESTIONS as SYSTEM_DESIGN_PROMPTS,
  STARTER_TEMPLATES as SYSTEM_DESIGN_TEMPLATES
};

export function renderWhiteboardWorkspaceView() {
  return `
    <div id="sysdesign-whiteboard-root" class="w-full flex flex-col gap-2.5 animate-fadeIn text-[#0F172A] dark:text-slate-100 select-none pb-4">
      
      <!-- 1. COMPACT WORKSPACE CONTROL & INTERVIEW SIMULATION BAR -->
      <header class="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-[#24314A] shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        
        <!-- Left: Studio Branding & Diagram Mode Switcher -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <!-- Logo & Title -->
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-700 to-cyan-500 text-white flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[17px]">draw</span>
            </span>
            <div class="flex items-center gap-1.5">
              <h1 class="font-sans text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
                Design Studio
              </h1>
              <span class="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[9.5px] font-bold border border-indigo-500/20 hidden sm:inline">
                PRO
              </span>
            </div>
          </div>

          <div class="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <!-- Diagram Mode Switcher: Architecture | Sequence | Data Model -->
          <div id="wb-mode-switcher" class="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#141C2E] border border-slate-200 dark:border-[#24314A] text-[11px] font-medium" role="tablist" aria-label="Diagram Mode Selector">
            <button type="button" data-mode="architecture" class="wb-mode-tab active px-2.5 py-1 rounded-md transition-all font-medium text-slate-800 dark:text-white bg-white dark:bg-[#1E293B] shadow-xs cursor-pointer flex items-center gap-1" title="System Architecture Mode (Clients, Services, Queues, Databases)">
              <span class="material-symbols-outlined text-[14px] text-indigo-500">hub</span>
              <span>Architecture</span>
            </button>
            <button type="button" data-mode="sequence" class="wb-mode-tab px-2.5 py-1 rounded-md transition-all font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer flex items-center gap-1" title="Sequence Diagram Mode (Lifelines, Sync/Async Messages, Activations)">
              <span class="material-symbols-outlined text-[14px]">swap_horiz</span>
              <span>Sequence</span>
            </button>
            <button type="button" data-mode="datamodel" class="wb-mode-tab px-2.5 py-1 rounded-md transition-all font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer flex items-center gap-1" title="Data Model Mode (Entities, Schemas, Primary/Foreign Keys)">
              <span class="material-symbols-outlined text-[14px]">table_chart</span>
              <span>Data Model</span>
            </button>
          </div>
        </div>

        <!-- Center: 45-Minute Multi-Phase Interview Timer -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E293B] shadow-xs">
          <!-- Total Time vs Current Phase Time -->
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[17px] text-amber-500 animate-pulse">timer</span>
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <span class="text-[9.5px] uppercase font-mono font-semibold text-slate-400 dark:text-slate-500">Total:</span>
                <span id="wb-total-timer-display" class="font-mono text-[13px] font-bold text-slate-900 dark:text-white tracking-wide leading-none">45:00</span>
                <span id="wb-timer-display" class="hidden">45:00</span>
              </div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span id="wb-phase-name-badge" class="px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-mono text-[9px] font-semibold">
                  Phase 1: Requirements
                </span>
                <span id="wb-phase-timer-display" class="font-mono text-[11px] font-bold text-cyan-600 dark:text-cyan-400 leading-none">05:00</span>
              </div>
            </div>
          </div>

          <!-- Timer Actions: Play/Pause, Next Phase, Reset -->
          <div class="flex items-center gap-1 ml-1 pl-2 border-l border-slate-200 dark:border-slate-800">
            <button type="button" id="wb-timer-toggle-btn" class="p-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer flex items-center justify-center shadow-xs" title="Start / Pause Interview Timer (Space)">
              <span class="material-symbols-outlined text-[15px]">play_arrow</span>
            </button>
            <button type="button" id="wb-timer-next-phase-btn" class="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center" title="Advance to Next Interview Phase">
              <span class="material-symbols-outlined text-[15px]">skip_next</span>
            </button>
            <button type="button" id="wb-timer-reset-btn" class="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center" title="Reset Interview Timer">
              <span class="material-symbols-outlined text-[15px]">restart_alt</span>
            </button>
          </div>
        </div>

        <!-- Right: Question Selector, Rubric & Actions -->
        <div class="flex items-center gap-2 flex-wrap justify-end">
          <!-- Question Practice Selector -->
          <select id="wb-prompt-select" class="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-[#24314A] text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-all max-w-[170px] truncate" title="Select Interview Practice Question">
            <option value="" disabled>🎯 Practice Question</option>
            <option value="freeform">Freeform (Blank Practice)</option>
            ${SYSTEM_DESIGN_QUESTIONS.map(q => `
              <option value="${q.id}">${q.title}</option>
            `).join('')}
          </select>

          <!-- Architecture Starter Template Selector -->
          <select id="wb-template-select" class="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-[#24314A] text-slate-800 dark:text-slate-200 cursor-pointer max-w-[150px] truncate" title="Load Starter Architecture Template">
            <option value="" disabled selected>✨ Starters</option>
            ${STARTER_TEMPLATES.map(t => `
              <option value="${t.id}">${t.name}</option>
            `).join('')}
          </select>

          <!-- Toggle Self-Assessment Rubric Drawer -->
          <button type="button" id="wb-toggle-rubric-btn" class="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-1 cursor-pointer" title="Toggle 12-Item Self-Assessment Rubric (R)">
            <span class="material-symbols-outlined text-[15px]">fact_check</span>
            <span class="hidden md:inline">Rubric</span>
            <span id="wb-rubric-score-badge" class="px-1 py-0.2 rounded bg-indigo-600 text-white font-mono text-[9px] font-bold">0/12</span>
          </button>

          <div class="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <!-- Undo / Redo -->
          <div class="flex items-center gap-0.5">
            <button type="button" id="wb-undo-btn" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" title="Undo (Cmd+Z / Ctrl+Z)">
              <span class="material-symbols-outlined text-[17px]">undo</span>
            </button>
            <button type="button" id="wb-redo-btn" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" title="Redo (Cmd+Shift+Z / Ctrl+Y)">
              <span class="material-symbols-outlined text-[17px]">redo</span>
            </button>
          </div>

          <!-- Clear Canvas -->
          <button type="button" id="wb-clear-btn" class="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer" title="Clear Canvas">
            <span class="material-symbols-outlined text-[17px]">delete_sweep</span>
          </button>

          <!-- Export Dropdown -->
          <div class="relative inline-block text-left" id="wb-export-dropdown-wrapper">
            <button type="button" id="wb-export-menu-btn" class="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer" title="Export Diagram">
              <span class="material-symbols-outlined text-[15px]">download</span>
              <span>Export</span>
              <span class="material-symbols-outlined text-[13px]">arrow_drop_down</span>
            </button>
            <div id="wb-export-menu" class="hidden absolute right-0 mt-1 w-52 rounded-xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-[#24314A] shadow-xl p-1 z-50 flex flex-col gap-0.5 animate-fadeIn">
              <button type="button" id="wb-export-png-fit-btn" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E293B] text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-[16px] text-emerald-500">crop_free</span>
                <div>
                  <div class="font-medium">PNG (Fit to Content)</div>
                  <div class="text-[9.5px] text-slate-500">Clean margins, no wasted space</div>
                </div>
              </button>
              <button type="button" id="wb-export-svg-btn" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E293B] text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-[16px] text-indigo-500">vector_symbol</span>
                <div>
                  <div class="font-medium">SVG (Vector Diagram)</div>
                  <div class="text-[9.5px] text-slate-500">Infinitely sharp vector graphic</div>
                </div>
              </button>
              <button type="button" id="wb-export-png-full-btn" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E293B] text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-[16px] text-cyan-500">image</span>
                <div>
                  <div class="font-medium">PNG (Full Canvas)</div>
                  <div class="text-[9.5px] text-slate-500">Standard viewport snapshot</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Fullscreen -->
          <button type="button" id="wb-fullscreen-btn" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" title="Toggle Fullscreen Canvas (F11)">
            <span class="material-symbols-outlined text-[17px]">fullscreen</span>
          </button>
        </div>
      </header>

      <!-- 2. COLLAPSIBLE SELF-ASSESSMENT RUBRIC & PROMPT DRAWER -->
      <section id="wb-rubric-drawer" class="hidden rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-[#24314A] shadow-md p-4 text-[12px] animate-fadeIn transition-all">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-[#24314A] pb-3">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-[14px] text-slate-900 dark:text-white" id="wb-active-prompt-title">
                Freeform Architecture Practice
              </span>
              <span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-semibold">
                Self-Assessment Rubric (12 Dimensions)
              </span>
            </div>
            <p id="wb-active-prompt-scope" class="text-[11px] text-slate-600 dark:text-slate-400">
              Score your system design readiness across industry standards. Note: this is a self-assessment guide, not an official scorecard.
            </p>
          </div>
          <button type="button" id="wb-close-rubric-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer" title="Close Rubric">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Problem Statement Prompts (Shown if Question Selected) -->
        <div id="wb-question-prompts-box" class="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800">
          <div class="font-bold text-[11.5px] text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px] text-amber-500">lightbulb</span>
            <span>Interview Prompts &amp; Guidance:</span>
          </div>
          <ul id="wb-question-prompts-list" class="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
            <li>Clarify core read and write requirements, p99 latency targets, and multi-region availability expectations.</li>
            <li>Estimate peak transactions per second (TPS) and calculate required storage for 5-year retention.</li>
          </ul>
        </div>

        <!-- 12-Item Rubric Grid -->
        <div class="mt-3">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Evaluation Criteria
            </span>
            <div class="flex items-center gap-2">
              <span id="wb-rubric-pct-label" class="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">0% Complete</span>
              <button type="button" id="wb-rubric-reset-btn" class="text-[10px] text-slate-400 hover:text-rose-500 cursor-pointer">Reset All</button>
            </div>
          </div>

          <div id="wb-rubric-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            ${INTERVIEW_RUBRIC.map((item, idx) => `
              <label class="wb-rubric-item flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition-all cursor-pointer">
                <input type="checkbox" data-rubric-id="${item.id}" class="wb-rubric-check mt-0.5 rounded text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5" />
                <div class="flex flex-col gap-0.5">
                  <span class="font-semibold text-[11.5px] text-slate-900 dark:text-white leading-tight">
                    ${idx + 1}. ${item.title}
                  </span>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    ${item.desc}
                  </span>
                </div>
              </label>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 3. MAIN CANVAS WORKSPACE VIEWPORT (Clean Pure White Whiteboard) -->
      <main class="relative w-full rounded-2xl border border-slate-300 dark:border-[#24314A] bg-white shadow-md overflow-hidden min-h-[640px] h-[calc(100vh-130px)] flex" aria-label="Whiteboard Canvas Workspace">
        
        <!-- FLOATING TOOLBAR PALETTE (Left) -->
        <nav class="absolute left-3 top-3 z-30 flex flex-col gap-1 p-1.5 rounded-xl bg-white/95 dark:bg-[#0F1626]/95 backdrop-blur-md border border-slate-200 dark:border-[#24314A] shadow-xl text-slate-700 dark:text-slate-300" aria-label="Drawing Tools">
          
          <!-- Select / Move tool (V) - DEFAULT ACTIVE -->
          <button type="button" data-tool="select" class="wb-tool-btn active w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-indigo-600 text-white shadow-xs cursor-pointer" title="Select & Move (V)" aria-label="Select tool">
            <span class="material-symbols-outlined text-[18px]">near_me</span>
          </button>

          <!-- Component Palette Drawer Trigger (C) -->
          <button type="button" id="wb-open-stencils-btn" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer relative" title="Insert System Design Components (C)" aria-label="Components Library">
            <span class="material-symbols-outlined text-[18px]">account_tree</span>
            <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>

          <!-- Architecture Shapes Menu Button (H) -->
          <button type="button" id="wb-open-shapes-btn" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer relative" title="Shapes: Cylinder, Hexagon, Circle, Cloud, Queue (H)" aria-label="Architecture Shapes">
            <span class="material-symbols-outlined text-[18px]">shapes</span>
          </button>

          <!-- Straight Connector Arrow Tool (A) -->
          <button type="button" data-tool="arrow" class="wb-tool-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer" title="Straight Arrow Connector (A)" aria-label="Straight Arrow">
            <span class="material-symbols-outlined text-[18px]">arrow_right_alt</span>
          </button>

          <!-- Bend / Elbow 90° Connector Tool (Z) -->
          <button type="button" data-tool="bend-arrow" class="wb-tool-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer" title="Bend / Elbow 90° Connector (Z)" aria-label="Bend Arrow">
            <span class="material-symbols-outlined text-[18px]">alt_route</span>
          </button>

          <!-- Freehand Pen Tool (P) -->
          <button type="button" data-tool="pen" class="wb-tool-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer" title="Pen Marker (P)" aria-label="Freehand Pen">
            <span class="material-symbols-outlined text-[18px]">edit</span>
          </button>

          <!-- Group Boundary Box Tool (B) -->
          <button type="button" data-tool="box" class="wb-tool-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer" title="Subnet / Boundary Box (B)" aria-label="Boundary Box">
            <span class="material-symbols-outlined text-[18px]">check_box_outline_blank</span>
          </button>

          <!-- Sticky Note Tool (S) -->
          <button type="button" data-tool="sticky" class="wb-tool-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer" title="Sticky Note for Math & Estimates (S)" aria-label="Sticky Note">
            <span class="material-symbols-outlined text-[18px]">sticky_note_2</span>
          </button>

          <!-- Text Tool (T) -->
          <button type="button" data-tool="text" class="wb-tool-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer" title="Text Label (T)" aria-label="Text Label">
            <span class="material-symbols-outlined text-[18px]">title</span>
          </button>

          <!-- Eraser Tool (E) -->
          <button type="button" data-tool="eraser" class="wb-tool-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer" title="Eraser (E)" aria-label="Eraser">
            <span class="material-symbols-outlined text-[18px]">ink_eraser</span>
          </button>

          <div class="w-full h-px bg-slate-200 dark:bg-slate-800 my-0.5"></div>

          <!-- Color Swatches -->
          <div class="flex flex-col items-center gap-1.5 py-0.5">
            <button type="button" data-color="#0F172A" class="wb-color-btn active w-5 h-5 rounded-full bg-[#0F172A] border-2 border-indigo-500 shadow-xs cursor-pointer" title="Black / Slate" aria-label="Color Black"></button>
            <button type="button" data-color="#2563EB" class="wb-color-btn w-5 h-5 rounded-full bg-[#2563EB] border border-slate-300 cursor-pointer" title="Royal Blue" aria-label="Color Blue"></button>
            <button type="button" data-color="#DC2626" class="wb-color-btn w-5 h-5 rounded-full bg-[#DC2626] border border-slate-300 cursor-pointer" title="Red / Alert" aria-label="Color Red"></button>
            <button type="button" data-color="#059669" class="wb-color-btn w-5 h-5 rounded-full bg-[#059669] border border-slate-300 cursor-pointer" title="Emerald Green" aria-label="Color Green"></button>
            <button type="button" data-color="#7C3AED" class="wb-color-btn w-5 h-5 rounded-full bg-[#7C3AED] border border-slate-300 cursor-pointer" title="Purple / Gateway" aria-label="Color Purple"></button>
            <button type="button" data-color="#D97706" class="wb-color-btn w-5 h-5 rounded-full bg-[#D97706] border border-slate-300 cursor-pointer" title="Amber / Storage" aria-label="Color Amber"></button>
          </div>
        </nav>

        <!-- QUICK ARCHITECTURE SHAPES POPOUT (Cylinder, Hexagon, Circle, Cloud, Queue, Boxes) -->
        <aside id="wb-shapes-popout" class="hidden absolute left-14 top-14 z-30 w-72 rounded-2xl bg-white/95 dark:bg-[#0F1626]/95 backdrop-blur-md border border-slate-200 dark:border-[#24314A] shadow-2xl p-3 flex flex-col gap-2 animate-fadeIn" aria-label="Architecture Shapes">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <span class="text-[11.5px] font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px] text-indigo-500">shapes</span>
              <span>Architecture Shapes</span>
            </span>
            <button type="button" id="wb-close-shapes-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">close</span>
            </button>
          </div>
          <p class="text-[10px] text-slate-500 dark:text-slate-400">Click to insert custom architectural shape:</p>
          <div class="grid grid-cols-2 gap-1.5 text-[11px]">
            <button type="button" data-shape-insert="cylinder" class="wb-quick-shape-item p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 cursor-pointer transition-all">
              <span class="text-[18px]">🗄️</span>
              <span class="font-semibold text-[10.5px]">Database Cylinder</span>
              <span class="text-[9px] text-slate-400">3D Relational/NoSQL</span>
            </button>
            <button type="button" data-shape-insert="hexagon" class="wb-quick-shape-item p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 cursor-pointer transition-all">
              <span class="text-[18px]">🔷</span>
              <span class="font-semibold text-[10.5px]">Hexagon Node</span>
              <span class="text-[9px] text-slate-400">Microservice / Pod</span>
            </button>
            <button type="button" data-shape-insert="circle" class="wb-quick-shape-item p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 cursor-pointer transition-all">
              <span class="text-[18px]">⭕</span>
              <span class="font-semibold text-[10.5px]">Circle Node</span>
              <span class="text-[9px] text-slate-400">DNS / Load Balancer</span>
            </button>
            <button type="button" data-shape-insert="card" class="wb-quick-shape-item p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 cursor-pointer transition-all">
              <span class="text-[18px]">▭</span>
              <span class="font-semibold text-[10.5px]">Service Box</span>
              <span class="text-[9px] text-slate-400">Standard Card</span>
            </button>
            <button type="button" data-shape-insert="cloud" class="wb-quick-shape-item p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 cursor-pointer transition-all">
              <span class="text-[18px]">☁️</span>
              <span class="font-semibold text-[10.5px]">Cloud / Network</span>
              <span class="text-[9px] text-slate-400">VPC / External Cloud</span>
            </button>
            <button type="button" data-shape-insert="queue" class="wb-quick-shape-item p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 cursor-pointer transition-all">
              <span class="text-[18px]">📨</span>
              <span class="font-semibold text-[10.5px]">Queue Pipe</span>
              <span class="text-[9px] text-slate-400">FIFO Buffer Pipe</span>
            </button>
            <button type="button" data-shape-insert="dashed-box" class="wb-quick-shape-item p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 cursor-pointer transition-all">
              <span class="text-[18px]">🔲</span>
              <span class="font-semibold text-[10.5px]">Dashed Subnet</span>
              <span class="text-[9px] text-slate-400">VPC Subnet Box</span>
            </button>
            <button type="button" data-shape-insert="solid-box" class="wb-quick-shape-item p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 cursor-pointer transition-all">
              <span class="text-[18px]">📦</span>
              <span class="font-semibold text-[10.5px]">Solid Container</span>
              <span class="text-[9px] text-slate-400">Availability Zone</span>
            </button>
          </div>
        </aside>

        <!-- 4. COLLAPSIBLE SYSTEM DESIGN COMPONENT PALETTE (Drawer on Left) -->
        <aside id="wb-stencils-panel" class="hidden absolute left-14 top-3 z-30 w-80 max-h-[calc(100%-24px)] overflow-y-auto rounded-2xl bg-white/95 dark:bg-[#0F1626]/95 backdrop-blur-md border border-slate-200 dark:border-[#24314A] shadow-2xl p-3 flex flex-col gap-2.5 animate-fadeIn" aria-label="Architecture Component Catalog">
          
          <!-- Palette Header & Search Filter -->
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span class="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-indigo-500">dataset</span>
              <span>Component Palette</span>
            </span>
            <button type="button" id="wb-close-stencils-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer" title="Close Palette (C)">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <!-- Quick Search Filter -->
          <div class="relative">
            <input type="text" id="wb-component-search-input" placeholder="Search components (e.g. redis, kafka, lb)..." class="w-full px-2.5 py-1.5 pl-7 text-[11px] rounded-lg bg-slate-100 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500" />
            <span class="material-symbols-outlined text-[14px] text-slate-400 absolute left-2 top-2">search</span>
          </div>

          <p class="text-[10px] text-slate-500 dark:text-slate-400">
            Drag onto canvas or click to insert at center:
          </p>

          <!-- Component Categories Accordion / Sections -->
          <div id="wb-palette-categories-container" class="flex flex-col gap-3">
            ${COMPONENT_CATEGORIES.map(cat => `
              <div class="wb-category-section flex flex-col gap-1.5" data-category="${cat.id}">
                <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono">
                  <span class="material-symbols-outlined text-[14px] text-indigo-500">${cat.icon}</span>
                  <span>${cat.name}</span>
                </div>
                <div class="grid grid-cols-2 gap-1.5">
                  ${cat.components.map(comp => `
                    <div 
                      draggable="true" 
                      data-stencil="${comp.id}"
                      data-stencil-name="${comp.name}"
                      data-stencil-icon="${comp.icon}"
                      data-stencil-color="${comp.color}"
                      data-stencil-sub="${comp.sub}"
                      data-stencil-w="${comp.w || 154}"
                      data-stencil-h="${comp.h || 76}"
                      class="wb-stencil-card p-2 rounded-xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/80 dark:hover:border-indigo-400 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 transition-all text-center cursor-grab active:cursor-grabbing hover:shadow-xs group"
                    >
                      <span class="text-[18px] group-hover:scale-110 transition-transform">${comp.icon}</span>
                      <span class="text-[11px] font-semibold leading-tight">${comp.name}</span>
                      <span class="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1">${comp.sub}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </aside>

        <!-- 5. CONTEXTUAL PROPERTIES PANEL (Drawer on Right when Element is Selected) -->
        <aside id="wb-properties-panel" class="hidden absolute right-3 top-3 z-30 w-72 rounded-2xl bg-white/95 dark:bg-[#0F1626]/95 backdrop-blur-md border border-slate-200 dark:border-[#24314A] shadow-2xl p-3 flex flex-col gap-3 animate-fadeIn" aria-label="Element Properties">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span class="text-[11.5px] font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px] text-indigo-500">tune</span>
              <span id="wb-prop-heading">Properties</span>
            </span>
            <button type="button" id="wb-close-properties-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <!-- Dynamic Form Fields for Selected Element -->
          <div id="wb-properties-form" class="flex flex-col gap-2.5 text-[11.5px]">
            <!-- Rendered dynamically by Engine -->
          </div>

          <!-- Action Buttons (Duplicate, Delete, Align) -->
          <div class="flex items-center justify-between gap-1 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button type="button" id="wb-prop-duplicate-btn" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#141C2E] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer" title="Duplicate (Cmd+D)">
              <span class="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Duplicate</span>
            </button>
            <button type="button" id="wb-prop-delete-btn" class="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-[11px] font-medium flex items-center gap-1 cursor-pointer" title="Delete (Del)">
              <span class="material-symbols-outlined text-[14px]">delete</span>
              <span>Delete</span>
            </button>
          </div>
        </aside>

        <!-- 6. INITIAL EMPTY-CANVAS WELCOME MODAL OVERLAY -->
        <div id="wb-welcome-overlay" class="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-xs transition-opacity cursor-pointer">
          <div class="relative max-w-xl w-full p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-[#24314A] shadow-2xl flex flex-col gap-4 text-center cursor-default" onclick="event.stopPropagation()">
            <button type="button" id="wb-close-welcome-btn" class="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Dismiss (Start with clean canvas)">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
            
            <div class="flex flex-col items-center gap-2">
              <span class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg">
                <span class="material-symbols-outlined text-[26px]">draw</span>
              </span>
              <h2 class="font-sans text-[18px] sm:text-[20px] font-bold text-slate-900 dark:text-white">
                System Design Practice Studio
              </h2>
              <p class="text-[12px] text-slate-500 dark:text-slate-400 max-w-md">
                Interactive architecture whiteboard with 45-minute phased timer, snapping connectors, and 12-point interview rubric.
              </p>
            </div>

            <!-- Three Options Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              
              <!-- 1. Blank Canvas -->
              <button type="button" id="wb-welcome-blank-btn" class="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all flex flex-col gap-2 cursor-pointer group">
                <div class="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[18px]">crop_square</span>
                </div>
                <div>
                  <h3 class="font-bold text-[13px] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Blank Canvas
                  </h3>
                  <p class="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Start with a clean dotted whiteboard canvas
                  </p>
                </div>
              </button>

              <!-- 2. Starter Template -->
              <button type="button" id="wb-welcome-starter-btn" class="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141C2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all flex flex-col gap-2 cursor-pointer group">
                <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[18px]">account_tree</span>
                </div>
                <div>
                  <h3 class="font-bold text-[13px] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Load Starter
                  </h3>
                  <p class="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Preloaded 3-Tier Web or Event Streaming baseline
                  </p>
                </div>
              </button>

              <!-- 3. Question Practice -->
              <button type="button" id="wb-welcome-question-btn" class="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all flex flex-col gap-2 cursor-pointer group">
                <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[18px]">timer</span>
                </div>
                <div>
                  <h3 class="font-bold text-[13px] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Interview Practice
                  </h3>
                  <p class="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Pick from 11 real problems with 45m timed drill
                  </p>
                </div>
              </button>

            </div>

            <div class="flex items-center justify-center gap-4 text-[10.5px] text-slate-400 dark:text-slate-500 font-mono">
              <span>Press <kbd class="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">V</kbd> to Select</span>
              <span>&bull;</span>
              <span>Press <kbd class="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">A</kbd> for Snapping Connectors</span>
            </div>

          </div>
        </div>

        <!-- 7. PRIMARY HIGH-DPI CANVAS ELEMENT -->
        <canvas id="sysdesign-canvas" class="w-full h-full cursor-default touch-none"></canvas>

        <!-- 8. FLOATING BOTTOM-RIGHT ZOOM & VIEW CONTROLS -->
        <div class="absolute right-3 bottom-3 z-30 flex items-center gap-1 p-1 rounded-xl bg-white/95 dark:bg-[#0F1626]/95 backdrop-blur-md border border-slate-200 dark:border-[#24314A] shadow-md text-slate-700 dark:text-slate-300" aria-label="Zoom and Viewport Controls">
          <button type="button" id="wb-zoom-out-btn" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Zoom Out (-)" aria-label="Zoom Out">
            <span class="material-symbols-outlined text-[16px]">remove</span>
          </button>
          <span id="wb-zoom-level" class="font-mono text-[11px] px-1.5 font-semibold text-slate-900 dark:text-white min-w-[42px] text-center">100%</span>
          <button type="button" id="wb-zoom-in-btn" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Zoom In (+)" aria-label="Zoom In">
            <span class="material-symbols-outlined text-[16px]">add</span>
          </button>
          <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5"></div>
          <button type="button" id="wb-fit-content-btn" class="px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer" title="Fit to Content (F)">
            Fit
          </button>
          <button type="button" id="wb-reset-view-btn" class="px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer" title="Reset View (0)">
            100%
          </button>
        </div>

        <!-- 9. FLOATING BOTTOM-LEFT SHORTCUTS HINT -->
        <div class="absolute left-3 bottom-3 z-20 hidden md:flex items-center gap-2 text-[10.5px] font-mono text-slate-600 dark:text-slate-400 bg-white/95 dark:bg-[#0F1626]/95 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-slate-200 dark:border-[#24314A] shadow-xs pointer-events-none">
          <span><kbd class="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">V</kbd> Select</span>
          <span>&bull;</span>
          <span><kbd class="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">A</kbd> Arrow</span>
          <span>&bull;</span>
          <span><kbd class="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">Z</kbd> Bend Arrow</span>
          <span>&bull;</span>
          <span><kbd class="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">H</kbd> Shapes</span>
          <span>&bull;</span>
          <span><kbd class="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">Space</kbd> Pan</span>
        </div>

      </main>

    </div>
  `;
}
