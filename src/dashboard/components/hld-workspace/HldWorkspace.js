/**
 * Interactive High-Level Design (HLD) Architecture Workspace Component
 * 
 * Features:
 * - Two-column desktop layout (Interactive SVG canvas on left, contextual inspector on right)
 * - Mobile responsive with collapsible component-details bottom sheet / panel
 * - 4 interactive views: Architecture, Request Flow (step-by-step player), Components, Trade-offs
 * - Interactive node-based SVG renderer with pan, zoom (+ / - / fit / reset), and full-screen controls
 * - Touch-friendly panning on mobile, keyboard shortcuts (+, -, 0, f, esc)
 * - Pure data separation from presentation
 * - Loading, error, and empty states
 */

import { URL_SHORTENER_HLD_DATA } from './urlShortenerHldData.js';
import { RATE_LIMITER_HLD_DATA } from './rateLimiterHldData.js';
import { NOTIFICATION_HLD_DATA } from './notificationHldData.js';
import { DISTRIBUTED_CACHE_HLD_DATA } from './distributedCacheHldData.js';
import { API_GATEWAY_HLD_DATA } from './apiGatewayHldData.js';
import { INSTAGRAM_HLD_DATA } from './instagramHldData.js';
import { WHATSAPP_HLD_DATA } from './whatsAppHldData.js';
import { YOUTUBE_HLD_DATA } from './youTubeHldData.js';

// State management per workspace instance
const workspaceState = {
  activeView: 'architecture', // 'architecture' | 'flow' | 'components' | 'tradeoffs'
  selectedComponentId: null,
  activeFlowId: 'create', // 'create' | 'redirect' | 'analytics'
  activeStepIndex: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  isFullscreen: false,
  mobileSheetOpen: false
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Main render function for the HLD Workspace
 * @param {Object} customData Optional architecture data override
 */
export function renderHldWorkspace(customData = null) {
  const data = customData || URL_SHORTENER_HLD_DATA;

  if (!data) {
    return renderErrorState('Architecture data could not be loaded.');
  }

  if (typeof window !== 'undefined') {
    window.__HLD_DATA_REGISTRY = window.__HLD_DATA_REGISTRY || {};
    window.__HLD_DATA_REGISTRY[data.lessonId || 'url-shortener'] = data;
  }

  const { title, systemName, scaleMetrics } = data;

  const metricsList = data.scaleMetricsList || [
    { label: 'Scale Baseline', value: scaleMetrics.monthlyCreates || '', color: 'blue' },
    { label: 'Traffic', value: scaleMetrics.monthlyRedirects || '', color: 'emerald' },
    { label: 'Peak Load', value: scaleMetrics.peakReadRps || '', color: 'indigo' },
    { label: 'SLA Latency', value: scaleMetrics.targetRedirectLatency || '< 2 ms', color: 'cyan' }
  ].filter(m => m.value);

  const tierBoxes = data.tierBoxes || [
    { x: 210, y: 30, w: 390, h: 390, textX: 225, textY: 55, title: 'EDGE & INGRESS TIER', color: 'indigo' },
    { x: 615, y: 30, w: 430, h: 400, textX: 630, textY: 55, title: 'STATELESS APPLICATION & STORAGE TIER', color: 'blue' },
    { x: 210, y: 440, w: 835, h: 225, textX: 225, textY: 465, title: 'ASYNCHRONOUS ANALYTICS PIPELINE (DECOUPLED VIA KAFKA)', color: 'amber' }
  ];

  return `
    <div id="hld-workspace-container" data-lesson-id="${escapeHtml(data.lessonId || 'url-shortener')}" class="hld-workspace-root flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-6 shadow-sm text-slate-800 dark:text-slate-100 transition-all select-none">
      
      <!-- WORKSPACE HEADER & TOP TOOLBAR -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[11px] font-mono uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">Interactive HLD Studio</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">LIVE SPEC</span>
          </div>
          <h3 class="text-[18px] sm:text-[20px] font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>${escapeHtml(title)}</span>
          </h3>
          <p class="text-[12.5px] text-slate-500 dark:text-slate-400">
            ${escapeHtml(systemName)} &bull; Click any component to inspect responsibilities, APIs, storage decisions, and trade-offs.
          </p>
        </div>

        <!-- VIEW SWITCHER TABS -->
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0 overflow-x-auto">
          <button type="button" data-hld-view="architecture" class="hld-view-tab-btn active px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">account_tree</span>
            <span>Architecture</span>
          </button>
          <button type="button" data-hld-view="flow" class="hld-view-tab-btn px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">route</span>
            <span>Request Flow</span>
          </button>
          <button type="button" data-hld-view="components" class="hld-view-tab-btn px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">grid_view</span>
            <span>Components</span>
          </button>
          <button type="button" data-hld-view="tradeoffs" class="hld-view-tab-btn px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">balance</span>
            <span>Trade-offs</span>
          </button>
        </div>
      </div>

      <!-- SCALE METRICS PILLS ROW -->
      <div class="flex items-center gap-2 overflow-x-auto py-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
        <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px] shrink-0">Scale Baseline:</span>
        ${metricsList.map(m => `
          <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 whitespace-nowrap">
            ${escapeHtml(m.label)}: <strong class="text-${m.color}-600 dark:text-${m.color}-400">${escapeHtml(m.value)}</strong>
          </span>
        `).join('')}
      </div>

      <!-- MAIN TWO-COLUMN WORKSPACE AREA -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 relative items-start">
        
        <!-- LEFT COLUMN: DIAGRAM & INTERACTIVE CANVAS (8 COLS) -->
        <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-3 min-w-0">
          
          <!-- CANVAS CONTAINER -->
          <div id="hld-canvas-wrapper" class="relative w-full h-[540px] sm:h-[620px] rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#060913] overflow-hidden shadow-inner flex flex-col cursor-grab active:cursor-grabbing">
            
            <!-- FLOATING CANVAS CONTROLS (ZOOM, FIT, RESET, FULLSCREEN) -->
            <div class="absolute top-3 right-3 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
              <button type="button" id="hld-zoom-in-btn" title="Zoom In (+)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span class="material-symbols-outlined text-[18px]">add</span>
              </button>
              <button type="button" id="hld-zoom-out-btn" title="Zoom Out (-)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span class="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <button type="button" id="hld-fit-btn" title="Fit to Screen" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span class="material-symbols-outlined text-[18px]">fit_screen</span>
              </button>
              <button type="button" id="hld-reset-btn" title="Reset (100%)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span class="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
              <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5"></div>
              <span id="hld-zoom-display" class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 min-w-[42px] text-center">100%</span>
              <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5"></div>
              <button type="button" id="hld-fullscreen-btn" title="Toggle Fullscreen (F)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span class="material-symbols-outlined text-[18px]">fullscreen</span>
              </button>
            </div>

            <!-- CANVAS HINT BADGE -->
            <div class="absolute bottom-3 left-3 z-20 pointer-events-none flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
              <span class="material-symbols-outlined text-[14px]">pan_tool</span>
              <span>Drag to pan &bull; Scroll to zoom &bull; Click node to inspect</span>
            </div>

            <!-- SVG CANVAS CONTAINER WITH PAN & ZOOM TRANSFORM -->
            <div id="hld-viewport" class="w-full h-full flex items-center justify-center overflow-hidden">
              <svg id="hld-svg" viewBox="0 0 1100 680" class="w-full h-full transition-transform duration-75 origin-center" style="transform: translate(0px, 0px) scale(1);">
                
                <defs>
                  <!-- Background Pattern -->
                  <pattern id="hld-grid-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" class="fill-slate-300 dark:fill-slate-800" opacity="0.6" />
                  </pattern>

                  <!-- Link Arrow Markers -->
                  <marker id="arrow-forward" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" class="fill-indigo-400 dark:fill-indigo-500" />
                  </marker>
                  <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" class="fill-cyan-400" />
                  </marker>

                  <!-- Glow Filters -->
                  <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="path-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <!-- Grid Background -->
                <rect width="100%" height="100%" fill="url(#hld-grid-dots)" />

                <!-- TIER BOUNDARIES & LABELS -->
                <g class="hld-tiers-group opacity-70">
                  ${tierBoxes.map(b => `
                    <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="16" class="fill-${b.color}-500/5 stroke-${b.color}-400/20" stroke-width="1.5" stroke-dasharray="6,6" />
                    <text x="${b.textX}" y="${b.textY}" class="fill-${b.color}-600 dark:fill-${b.color}-400 text-[11px] font-mono font-bold tracking-wider">${escapeHtml(b.title)}</text>
                  `).join('')}
                </g>

                <!-- CONNECTIONS / LINKS LAYER -->
                <g class="hld-links-group" id="hld-links-layer">
                  ${renderSvgLinks(data.links)}
                </g>

                <!-- NODES LAYER -->
                <g class="hld-nodes-group" id="hld-nodes-layer">
                  ${renderSvgNodes(data.nodes)}
                </g>

              </svg>
            </div>

            <!-- REQUEST FLOW STEPPER OVERLAY (Shown when in 'flow' view) -->
            <div id="hld-flow-stepper-overlay" class="hidden absolute bottom-3 left-3 right-3 z-30 p-3 sm:p-4 rounded-xl bg-white/95 dark:bg-[#0A101D]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-2.5 animate-fadeIn">
              
              <!-- Flow Selector Tabs -->
              <div class="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 dark:border-slate-800 pb-2">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mr-1">FLOW:</span>
                  ${(data.flows || []).map((flow, idx) => `
                    <button type="button" data-flow-id="${escapeHtml(flow.id)}" class="hld-flow-selector-btn ${idx === 0 ? 'active font-bold bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30' : 'font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} px-2.5 py-1 rounded-md text-[11px] cursor-pointer">
                      ${escapeHtml(flow.name)}
                    </button>
                  `).join('')}
                </div>

                <!-- Step Controls Prev / Next -->
                <div class="flex items-center gap-1.5 ml-auto">
                  <button type="button" id="hld-step-prev-btn" class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors">
                    <span class="material-symbols-outlined text-[14px]">chevron_left</span>
                    <span>Prev</span>
                  </button>
                  <span id="hld-step-indicator" class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1">Step 1 of 5</span>
                  <button type="button" id="hld-step-next-btn" class="px-2.5 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-[11px] font-bold flex items-center gap-1 transition-colors">
                    <span>Next</span>
                    <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>
              </div>

              <!-- Active Step Detail Text -->
              <div id="hld-step-content" class="flex flex-col gap-1">
                <!-- Dynamically updated -->
              </div>
            </div>

          </div>

          <!-- BOTTOM VIEW SWITCHER PANELS (FOR COMPONENTS & TRADEOFFS VIEWS) -->
          <div id="hld-components-view-panel" class="hidden flex flex-col gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 animate-fadeIn">
            <div class="flex items-center justify-between">
              <h4 class="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-indigo-500">grid_view</span>
                <span>System Component Catalog</span>
              </h4>
              <span class="text-[11px] font-mono text-slate-500">11 Building Blocks</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              ${data.nodes.map(node => `
                <button type="button" data-component-id="${node.id}" class="hld-component-card text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] hover:border-indigo-500/50 hover:shadow-xs transition-all flex flex-col gap-1 cursor-pointer">
                  <div class="flex items-center justify-between">
                    <span class="material-symbols-outlined text-[18px] text-indigo-500">${node.icon}</span>
                    <span class="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">${node.tierLabel}</span>
                  </div>
                  <div class="font-bold text-[12.5px] text-slate-900 dark:text-white mt-1">${escapeHtml(node.label)}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${escapeHtml(node.sublabel)}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- TRADEOFFS VIEW PANEL -->
          <div id="hld-tradeoffs-view-panel" class="hidden flex flex-col gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 animate-fadeIn">
            <div class="flex items-center justify-between">
              <h4 class="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-amber-500">balance</span>
                <span>Key Architectural Trade-Offs Matrix</span>
              </h4>
              <span class="text-[11px] font-mono text-slate-500">Staff Decisions</span>
            </div>
            <div class="flex flex-col gap-3">
              ${data.tradeoffs.map(to => `
                <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] flex flex-col gap-2.5">
                  <div class="flex items-center justify-between gap-2 flex-wrap">
                    <div class="font-bold text-[13.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px] text-indigo-500">help</span>
                      <span>${escapeHtml(to.decision)}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      ${(to.relatedNodes || []).map(rn => `
                        <button type="button" data-component-id="${rn}" class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                          ${rn}
                        </button>
                      `).join('')}
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
                    <div class="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-slate-700 dark:text-slate-300">
                      <div class="font-bold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>${escapeHtml(to.optionA.name)}</span>
                      </div>
                      <p class="leading-relaxed"><strong class="text-emerald-600">Upside:</strong> ${escapeHtml(to.optionA.pros)}</p>
                      <p class="mt-1 leading-relaxed"><strong class="text-rose-500">Downside:</strong> ${escapeHtml(to.optionA.cons)}</p>
                    </div>
                    <div class="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-slate-700 dark:text-slate-300">
                      <div class="font-bold text-rose-700 dark:text-rose-300 mb-1 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">cancel</span>
                        <span>${escapeHtml(to.optionB.name)}</span>
                      </div>
                      <p class="leading-relaxed"><strong class="text-emerald-600">Upside:</strong> ${escapeHtml(to.optionB.pros)}</p>
                      <p class="mt-1 leading-relaxed"><strong class="text-rose-500">Downside:</strong> ${escapeHtml(to.optionB.cons)}</p>
                    </div>
                  </div>
                  <div class="p-2 rounded-lg bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 text-[11.5px] font-semibold border border-indigo-500/20 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-indigo-500">verified</span>
                    <span>${escapeHtml(to.verdict)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: CONTEXTUAL COMPONENT DETAILS INSPECTOR (5 COLS) -->
        <div class="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 min-w-0">
          
          <div id="hld-inspector-panel" class="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#070D1A] p-4 sm:p-5 flex flex-col gap-4 shadow-sm sticky top-20 max-h-[750px] overflow-y-auto">
            ${renderInspectorContent(null, data)}
          </div>

        </div>

      </div>

      <!-- MOBILE BOTTOM SHEET TRIGGER / ACCORDION (Visible on screens < lg) -->
      <div id="hld-mobile-sheet-bar" class="lg:hidden flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-indigo-500">info</span>
          <span id="hld-mobile-selected-label" class="text-[12px] font-bold text-slate-800 dark:text-slate-200">Inspect Component Details</span>
        </div>
        <span class="material-symbols-outlined text-[18px] text-slate-500 transition-transform" id="hld-mobile-sheet-chevron">expand_more</span>
      </div>

    </div>
  `;
}

/**
 * Render SVG Nodes with accessible data attributes and interactive styling
 */
function renderSvgNodes(nodes) {
  return nodes.map(node => {
    return `
      <g class="hld-svg-node cursor-pointer group" data-node-id="${node.id}" tabindex="0" role="button" aria-label="${escapeHtml(node.label)}">
        <!-- Node Background Shadow & Glow -->
        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="14" 
          class="hld-node-rect fill-white dark:fill-[#0E1729] stroke-slate-200 dark:stroke-slate-700/80 transition-all duration-150" 
          stroke-width="1.8" filter="url(#node-glow)" />

        <!-- Top Accent Bar -->
        <path d="M ${node.x + 14} ${node.y} L ${node.x + node.width - 14} ${node.y}" 
          class="stroke-indigo-500 dark:stroke-indigo-400" stroke-width="3" stroke-linecap="round" />

        <!-- Node Icon Circle -->
        <circle cx="${node.x + 26}" cy="${node.y + 30}" r="15" 
          class="fill-indigo-500/10 dark:fill-indigo-400/20" />
        <text x="${node.x + 26}" y="${node.y + 35}" text-anchor="middle" 
          class="fill-indigo-600 dark:fill-indigo-300 font-bold font-mono text-[13px] pointer-events-none">&#x25C6;</text>

        <!-- Tier Badge -->
        <rect x="${node.x + 48}" y="${node.y + 19}" width="${node.width - 56}" height="18" rx="4" 
          class="fill-slate-100 dark:fill-slate-800/80" />
        <text x="${node.x + 53}" y="${node.y + 31}" 
          class="fill-slate-500 dark:fill-slate-400 text-[9.5px] font-mono font-semibold uppercase tracking-wider pointer-events-none">${escapeHtml(node.tierLabel)}</text>

        <!-- Node Title -->
        <text x="${node.x + 14}" y="${node.y + 58}" 
          class="fill-slate-900 dark:fill-white font-bold text-[12.5px] font-sans pointer-events-none">${escapeHtml(node.label)}</text>

        <!-- Node Subtitle -->
        <text x="${node.x + 14}" y="${node.y + 75}" 
          class="fill-slate-500 dark:fill-slate-400 text-[10.5px] font-sans pointer-events-none">${escapeHtml(node.sublabel)}</text>
      </g>
    `;
  }).join('');
}

/**
 * Render SVG Link Paths
 */
function renderSvgLinks(links) {
  return links.map(link => {
    return `
      <g class="hld-svg-link" data-link-id="${link.id}" data-flows="${link.flows.join(',')}" data-from="${link.from}" data-to="${link.to}">
        <!-- Wide invisible hit-target for hover -->
        <path d="${link.path}" fill="none" stroke="transparent" stroke-width="14" class="cursor-pointer" />
        <!-- Actual Link Path -->
        <path d="${link.path}" fill="none" class="hld-link-path stroke-slate-300 dark:stroke-slate-700/80 transition-all duration-200" 
          stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#arrow-forward)" />
        <!-- Link Label (if any) -->
        ${link.label ? `
          <text class="fill-slate-400 dark:fill-slate-500 text-[9px] font-mono pointer-events-none" opacity="0.8">
            <textPath href="#path-${link.id}" startOffset="50%" text-anchor="middle">
              ${escapeHtml(link.label)}
            </textPath>
          </text>
        ` : ''}
      </g>
    `;
  }).join('');
}

/**
 * Render Contextual Inspector Content (Empty State or Component Details)
 */
export function renderInspectorContent(componentId, data = URL_SHORTENER_HLD_DATA) {
  if (!componentId) {
    // EMPTY / SYSTEM OVERVIEW STATE
    return `
      <div class="flex flex-col gap-4 text-slate-700 dark:text-slate-300 animate-fadeIn">
        <div class="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">architecture</span>
          </div>
          <div class="flex flex-col">
            <h4 class="font-bold text-[15px] text-slate-900 dark:text-white leading-tight">System Inspector</h4>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">Select any node on the left to inspect</span>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-[12.5px] leading-relaxed">
          <p class="font-semibold text-indigo-900 dark:text-indigo-300 mb-1">Architecture Overview</p>
          <p class="text-slate-600 dark:text-slate-400 text-[12px]">
            This design splits URL traffic into two independent paths: a synchronous <strong>Write Path</strong> that coordinates unique Base62 IDs, and an ultra-fast sub-10ms <strong>Read Path</strong> that leverages in-memory Redis caching with non-blocking click telemetry.
          </p>
        </div>

        <!-- QUICK SELECT BUTTONS -->
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">Quick Jump to Component:</span>
          <div class="flex flex-wrap gap-1.5">
            ${data.nodes.map(n => `
              <button type="button" data-component-id="${n.id}" class="hld-quick-jump-btn px-2.5 py-1 rounded-md bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[13px] text-indigo-500">${n.icon}</span>
                <span>${escapeHtml(n.label)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- KEY SYSTEM CONSTRAINTS CHECKLIST -->
        <div class="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[12px]">
          <span class="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">Key Architectural Guarantees:</span>
          <ul class="flex flex-col gap-1.5 text-slate-600 dark:text-slate-400">
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
              <span><strong>0 Hash Collisions:</strong> Base62 encoding of 64-bit Snowflake IDs avoids collision loops.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
              <span><strong>Sub-10ms Latency:</strong> Redis LRU cache absorbs 95%+ of hot link redirects.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
              <span><strong>Zero Redirect Impact:</strong> Click analytics enqueue asynchronously to Kafka.</span>
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  // ACTIVE COMPONENT SELECTED STATE
  const comp = data.components[componentId];
  if (!comp) {
    return `<div class="p-4 text-center text-slate-500 text-[13px]">Component details not found.</div>`;
  }

  // Find index for prev/next navigation
  const nodeKeys = Object.keys(data.components);
  const currentIdx = nodeKeys.indexOf(componentId);
  const prevId = currentIdx > 0 ? nodeKeys[currentIdx - 1] : nodeKeys[nodeKeys.length - 1];
  const nextId = currentIdx < nodeKeys.length - 1 ? nodeKeys[currentIdx + 1] : nodeKeys[0];

  return `
    <div class="flex flex-col gap-4 text-slate-700 dark:text-slate-300 animate-fadeIn" data-active-component="${comp.id}">
      
      <!-- INSPECTOR HEADER -->
      <div class="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
            <span class="material-symbols-outlined text-[22px]">${comp.id === 'client' ? 'devices' : (comp.id === 'redis-cache' ? 'memory' : 'hub')}</span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5 flex-wrap">
              <h4 class="font-bold text-[15px] sm:text-[16px] text-slate-900 dark:text-white leading-tight">${escapeHtml(comp.name)}</h4>
              <span class="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">${escapeHtml(comp.tierBadge)}</span>
            </div>
            <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">${escapeHtml(comp.status)}</span>
          </div>
        </div>

        <!-- PREV / NEXT / CLOSE CONTROLS -->
        <div class="flex items-center gap-1 shrink-0">
          <button type="button" data-component-id="${prevId}" title="Previous Component" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">navigate_before</span>
          </button>
          <button type="button" data-component-id="${nextId}" title="Next Component" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">navigate_next</span>
          </button>
          <button type="button" id="hld-deselect-btn" title="Deselect (Esc)" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-rose-500 transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      <!-- ROLE DESCRIPTION -->
      <div class="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0B1222] p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
        ${escapeHtml(comp.role)}
      </div>

      <!-- CORE RESPONSIBILITIES -->
      <div class="flex flex-col gap-2">
        <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[14px]">task_alt</span>
          <span>Core Responsibilities</span>
        </span>
        <ul class="flex flex-col gap-1.5 text-[12px] text-slate-600 dark:text-slate-300">
          ${comp.responsibilities.map(r => `
            <li class="flex items-start gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
              <span class="leading-relaxed">${escapeHtml(r)}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- APIS & PROTOCOL CONTRACTS -->
      ${comp.apis && comp.apis.length > 0 ? `
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">api</span>
            <span>API &amp; Protocol Contracts</span>
          </span>
          <div class="flex flex-col gap-2">
            ${comp.apis.map(api => `
              <div class="p-2.5 rounded-lg bg-slate-100 dark:bg-[#0A0E1A] border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-bold">${escapeHtml(api.method)}</span>
                  <span class="text-[11.5px] font-mono font-bold text-slate-800 dark:text-slate-200">${escapeHtml(api.endpoint)}</span>
                </div>
                <div class="text-[11px] text-slate-500">${escapeHtml(api.description)}</div>
                ${api.sample ? `
                  <pre class="mt-1 p-2 rounded bg-white dark:bg-[#060911] text-[11px] font-mono text-emerald-600 dark:text-emerald-400 overflow-x-auto border border-slate-200/60 dark:border-slate-800/60">${escapeHtml(api.sample)}</pre>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- STORAGE & CACHING DECISIONS -->
      ${comp.storageDecisions && comp.storageDecisions.length > 0 ? `
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">database</span>
            <span>Storage &amp; Caching Decisions</span>
          </span>
          <div class="flex flex-col gap-2 text-[12px]">
            ${comp.storageDecisions.map(sd => `
              <div class="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-1">
                <span class="font-bold text-emerald-800 dark:text-emerald-300 text-[11.5px]">${escapeHtml(sd.type)}: ${escapeHtml(sd.decision)}</span>
                <span class="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">${escapeHtml(sd.rationale)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- ARCHITECTURAL TRADEOFFS -->
      ${comp.tradeoffs && comp.tradeoffs.length > 0 ? `
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">balance</span>
            <span>Relevant Trade-Off</span>
          </span>
          <div class="flex flex-col gap-2 text-[12px]">
            ${comp.tradeoffs.map(t => `
              <div class="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 flex flex-col gap-1.5">
                <span class="font-bold text-slate-800 dark:text-slate-200">${escapeHtml(t.question)} &rarr; <span class="text-amber-600 dark:text-amber-400">${escapeHtml(t.choice)}</span></span>
                <div class="text-[11px] leading-relaxed">
                  <span class="text-emerald-600 font-semibold">+ Upside:</span> ${escapeHtml(t.upside)}<br/>
                  <span class="text-rose-500 font-semibold">- Downside:</span> ${escapeHtml(t.downside)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- RESILIENCE & SCALING STRATEGY -->
      <div class="grid grid-cols-1 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11.5px]">
        <div class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span class="font-bold text-slate-700 dark:text-slate-300 block mb-0.5 flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-indigo-500">sync_alt</span>
            <span>Scaling Strategy</span>
          </span>
          <span class="text-slate-600 dark:text-slate-400 text-[11px]">${escapeHtml(comp.scalingStrategy)}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span class="font-bold text-slate-700 dark:text-slate-300 block mb-0.5 flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-rose-500">warning</span>
            <span>Failure Mode &amp; Resilience</span>
          </span>
          <span class="text-slate-600 dark:text-slate-400 text-[11px]">${escapeHtml(comp.failureModes)}</span>
        </div>
      </div>

    </div>
  `;
}

/**
 * Render Error State
 */
function renderErrorState(message) {
  return `
    <div class="p-8 rounded-2xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20 text-center flex flex-col items-center gap-3">
      <span class="material-symbols-outlined text-[36px] text-rose-500">error</span>
      <h3 class="font-bold text-[16px] text-rose-900 dark:text-rose-200">Failed to Initialize HLD Workspace</h3>
      <p class="text-[13px] text-rose-700 dark:text-rose-400 max-w-md">${escapeHtml(message)}</p>
      <button type="button" onclick="location.reload()" class="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[12px] hover:bg-rose-700 transition-colors">
        Reload Lesson
      </button>
    </div>
  `;
}

/**
 * Initialize event listeners and interactive state for the HLD Workspace
 */
export function initHldWorkspace(container = document.getElementById('hld-workspace-container'), customData = null) {
  if (!container) return;

  const lessonId = container.getAttribute('data-lesson-id') || 'url-shortener';
  const data = customData || (typeof window !== 'undefined' && window.__HLD_DATA_REGISTRY?.[lessonId]) || (lessonId === 'youtube' ? YOUTUBE_HLD_DATA : (lessonId === 'whatsapp' ? WHATSAPP_HLD_DATA : (lessonId === 'instagram' ? INSTAGRAM_HLD_DATA : (lessonId === 'api-gateway' ? API_GATEWAY_HLD_DATA : (lessonId === 'cache' || lessonId === 'distributed-cache' ? DISTRIBUTED_CACHE_HLD_DATA : (lessonId === 'notification' ? NOTIFICATION_HLD_DATA : (lessonId === 'rate-limiter' ? RATE_LIMITER_HLD_DATA : URL_SHORTENER_HLD_DATA)))))));

  workspaceState.activeFlowId = data.flows?.[0]?.id || 'transactional';
  workspaceState.activeStepIndex = 0;

  const svg = container.querySelector('#hld-svg');
  const canvasWrapper = container.querySelector('#hld-canvas-wrapper');
  const inspector = container.querySelector('#hld-inspector-panel');
  const zoomDisplay = container.querySelector('#hld-zoom-display');

  if (!svg || !canvasWrapper) return;

  // Update canvas transform
  const updateTransform = () => {
    svg.style.transform = `translate(${workspaceState.panX}px, ${workspaceState.panY}px) scale(${workspaceState.zoom})`;
    if (zoomDisplay) {
      zoomDisplay.textContent = `${Math.round(workspaceState.zoom * 100)}%`;
    }
  };

  // Zoom In / Out / Reset / Fit
  const zoomIn = () => {
    workspaceState.zoom = Math.min(2.5, +(workspaceState.zoom + 0.15).toFixed(2));
    updateTransform();
  };

  const zoomOut = () => {
    workspaceState.zoom = Math.max(0.5, +(workspaceState.zoom - 0.15).toFixed(2));
    updateTransform();
  };

  const resetZoom = () => {
    workspaceState.zoom = 1;
    workspaceState.panX = 0;
    workspaceState.panY = 0;
    updateTransform();
  };

  const fitToScreen = () => {
    const rect = canvasWrapper.getBoundingClientRect();
    const scale = Math.min(rect.width / 1120, rect.height / 700, 1.2);
    workspaceState.zoom = +(Math.max(0.65, scale)).toFixed(2);
    workspaceState.panX = 0;
    workspaceState.panY = 0;
    updateTransform();
  };

  // Select Component Handler
  const selectComponent = (componentId) => {
    workspaceState.selectedComponentId = componentId;

    // Highlight node on SVG
    container.querySelectorAll('.hld-svg-node').forEach(nodeEl => {
      const nid = nodeEl.getAttribute('data-node-id');
      const rect = nodeEl.querySelector('.hld-node-rect');
      if (nid === componentId) {
        nodeEl.classList.add('selected');
        if (rect) {
          rect.setAttribute('stroke', '#06B6D4'); // cyan highlight
          rect.setAttribute('stroke-width', '3');
          rect.setAttribute('filter', 'url(#node-glow)');
        }
      } else {
        nodeEl.classList.remove('selected');
        if (rect) {
          rect.setAttribute('stroke', '');
          rect.setAttribute('stroke-width', '1.8');
        }
      }
    });

    // Highlight corresponding component card in components view
    container.querySelectorAll('.hld-component-card').forEach(card => {
      if (card.getAttribute('data-component-id') === componentId) {
        card.classList.add('border-indigo-500', 'bg-indigo-50/20', 'dark:bg-indigo-950/40');
      } else {
        card.classList.remove('border-indigo-500', 'bg-indigo-50/20', 'dark:bg-indigo-950/40');
      }
    });

    // Update Inspector Content
    if (inspector) {
      inspector.innerHTML = renderInspectorContent(componentId, data);
    }

    // Update Mobile Selected Label & Open Drawer
    const mobileLabel = container.querySelector('#hld-mobile-selected-label');
    if (mobileLabel && componentId) {
      const comp = data.components[componentId];
      mobileLabel.textContent = `Selected: ${comp ? comp.name : componentId}`;
    }
  };

  // Select View Handler (Architecture, Flow, Components, Tradeoffs)
  const setView = (viewKey) => {
    workspaceState.activeView = viewKey;

    // Update Tab Buttons
    container.querySelectorAll('.hld-view-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-hld-view') === viewKey) {
        btn.className = 'hld-view-tab-btn active px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer';
      } else {
        btn.className = 'hld-view-tab-btn px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer';
      }
    });

    // Toggle View-Specific Overlays
    const flowOverlay = container.querySelector('#hld-flow-stepper-overlay');
    const compPanel = container.querySelector('#hld-components-view-panel');
    const toPanel = container.querySelector('#hld-tradeoffs-view-panel');

    if (flowOverlay) {
      if (viewKey === 'flow') {
        flowOverlay.classList.remove('hidden');
        renderFlowStep();
      } else {
        flowOverlay.classList.add('hidden');
        clearFlowHighlights();
      }
    }

    if (compPanel) {
      if (viewKey === 'components') compPanel.classList.remove('hidden');
      else compPanel.classList.add('hidden');
    }

    if (toPanel) {
      if (viewKey === 'tradeoffs') toPanel.classList.remove('hidden');
      else toPanel.classList.add('hidden');
    }
  };

  // Flow Stepper Logic
  const renderFlowStep = () => {
    const flow = data.flows.find(f => f.id === workspaceState.activeFlowId);
    if (!flow) return;

    const currentStep = flow.steps[workspaceState.activeStepIndex];
    if (!currentStep) return;

    // Update Flow Selector Pills
    container.querySelectorAll('.hld-flow-selector-btn').forEach(btn => {
      if (btn.getAttribute('data-flow-id') === flow.id) {
        btn.className = 'hld-flow-selector-btn active px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30 cursor-pointer';
      } else {
        btn.className = 'hld-flow-selector-btn px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer';
      }
    });

    // Update Step Indicator
    const indicator = container.querySelector('#hld-step-indicator');
    if (indicator) {
      indicator.textContent = `Step ${currentStep.step} of ${flow.steps.length}`;
    }

    // Update Step Content
    const content = container.querySelector('#hld-step-content');
    if (content) {
      content.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-wider">${escapeHtml(currentStep.badge)}</span>
          <span class="font-bold text-[13px] text-slate-900 dark:text-white">${escapeHtml(currentStep.title)}</span>
        </div>
        <div class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">${currentStep.desc}</div>
      `;
    }

    // Highlight Active Nodes and Links on Canvas
    container.querySelectorAll('.hld-svg-node').forEach(nodeEl => {
      const nid = nodeEl.getAttribute('data-node-id');
      const rect = nodeEl.querySelector('.hld-node-rect');
      if (currentStep.highlightNodes.includes(nid)) {
        nodeEl.classList.add('flow-active');
        if (rect) {
          rect.setAttribute('stroke', '#38BDF8'); // active sky-blue glow
          rect.setAttribute('stroke-width', '2.5');
        }
      } else {
        nodeEl.classList.remove('flow-active');
        if (rect && nid !== workspaceState.selectedComponentId) {
          rect.setAttribute('stroke', '');
          rect.setAttribute('stroke-width', '1.8');
        }
      }
    });

    container.querySelectorAll('.hld-svg-link').forEach(linkEl => {
      const lid = linkEl.getAttribute('data-link-id');
      const path = linkEl.querySelector('.hld-link-path');
      if (currentStep.highlightLinks.includes(lid)) {
        if (path) {
          path.setAttribute('stroke', '#38BDF8');
          path.setAttribute('stroke-width', '3');
          path.setAttribute('stroke-dasharray', 'none');
          path.setAttribute('marker-end', 'url(#arrow-active)');
        }
      } else {
        if (path) {
          path.setAttribute('stroke', '');
          path.setAttribute('stroke-width', '1.8');
          path.setAttribute('stroke-dasharray', '4,4');
          path.setAttribute('marker-end', 'url(#arrow-forward)');
        }
      }
    });
  };

  const clearFlowHighlights = () => {
    container.querySelectorAll('.hld-svg-node').forEach(nodeEl => {
      const rect = nodeEl.querySelector('.hld-node-rect');
      nodeEl.classList.remove('flow-active');
      if (rect && nodeEl.getAttribute('data-node-id') !== workspaceState.selectedComponentId) {
        rect.setAttribute('stroke', '');
        rect.setAttribute('stroke-width', '1.8');
      }
    });
    container.querySelectorAll('.hld-svg-link').forEach(linkEl => {
      const path = linkEl.querySelector('.hld-link-path');
      if (path) {
        path.setAttribute('stroke', '');
        path.setAttribute('stroke-width', '1.8');
        path.setAttribute('stroke-dasharray', '4,4');
        path.setAttribute('marker-end', 'url(#arrow-forward)');
      }
    });
  };

  // Fullscreen Mode Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          container.classList.toggle('hld-pseudo-fullscreen');
        });
      } else {
        container.classList.toggle('hld-pseudo-fullscreen');
      }
      workspaceState.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      container.classList.remove('hld-pseudo-fullscreen');
      workspaceState.isFullscreen = false;
    }
  };

  // --- ATTACH EVENT LISTENERS ---

  // Zoom Buttons
  const zoomInBtn = container.querySelector('#hld-zoom-in-btn');
  const zoomOutBtn = container.querySelector('#hld-zoom-out-btn');
  const resetBtn = container.querySelector('#hld-reset-btn');
  const fitBtn = container.querySelector('#hld-fit-btn');
  const fsBtn = container.querySelector('#hld-fullscreen-btn');

  if (zoomInBtn) zoomInBtn.onclick = zoomIn;
  if (zoomOutBtn) zoomOutBtn.onclick = zoomOut;
  if (resetBtn) resetBtn.onclick = resetZoom;
  if (fitBtn) fitBtn.onclick = fitToScreen;
  if (fsBtn) fsBtn.onclick = toggleFullscreen;

  // View Switcher Tabs Click
  container.querySelectorAll('.hld-view-tab-btn').forEach(btn => {
    btn.onclick = () => {
      const view = btn.getAttribute('data-hld-view');
      setView(view);
    };
  });

  // Flow Stepper Controls
  const prevStepBtn = container.querySelector('#hld-step-prev-btn');
  const nextStepBtn = container.querySelector('#hld-step-next-btn');
  if (prevStepBtn) {
    prevStepBtn.onclick = () => {
      const flow = data.flows.find(f => f.id === workspaceState.activeFlowId);
      if (flow && workspaceState.activeStepIndex > 0) {
        workspaceState.activeStepIndex--;
        renderFlowStep();
      }
    };
  }
  if (nextStepBtn) {
    nextStepBtn.onclick = () => {
      const flow = data.flows.find(f => f.id === workspaceState.activeFlowId);
      if (flow && workspaceState.activeStepIndex < flow.steps.length - 1) {
        workspaceState.activeStepIndex++;
        renderFlowStep();
      }
    };
  }

  // Flow Selector Pills
  container.querySelectorAll('.hld-flow-selector-btn').forEach(btn => {
    btn.onclick = () => {
      const fid = btn.getAttribute('data-flow-id');
      workspaceState.activeFlowId = fid;
      workspaceState.activeStepIndex = 0;
      renderFlowStep();
    };
  });

  // Node Click Delegation on SVG
  container.querySelectorAll('.hld-svg-node').forEach(nodeEl => {
    nodeEl.onclick = (e) => {
      e.stopPropagation();
      const nid = nodeEl.getAttribute('data-node-id');
      selectComponent(nid);
    };
    nodeEl.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const nid = nodeEl.getAttribute('data-node-id');
        selectComponent(nid);
      }
    };
  });

  // Delegate Component Clicks in Catalog, Inspector, and Quick Jumps
  container.addEventListener('click', (e) => {
    const compBtn = e.target.closest('[data-component-id]');
    if (compBtn) {
      e.preventDefault();
      e.stopPropagation();
      const cid = compBtn.getAttribute('data-component-id');
      selectComponent(cid);
      return;
    }

    const deselectBtn = e.target.closest('#hld-deselect-btn');
    if (deselectBtn) {
      e.preventDefault();
      selectComponent(null);
      return;
    }

    // Mobile Sheet Accordion Toggle
    const sheetBar = e.target.closest('#hld-mobile-sheet-bar');
    if (sheetBar) {
      const chevron = container.querySelector('#hld-mobile-sheet-chevron');
      if (inspector) {
        const isHidden = inspector.classList.contains('hidden');
        if (isHidden) {
          inspector.classList.remove('hidden');
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
          inspector.classList.add('hidden');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      }
    }
  });

  // Mouse Pan & Drag on SVG Canvas
  canvasWrapper.addEventListener('mousedown', (e) => {
    if (e.target.closest('.hld-svg-node, button')) return;
    workspaceState.isDragging = true;
    workspaceState.dragStartX = e.clientX - workspaceState.panX;
    workspaceState.dragStartY = e.clientY - workspaceState.panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!workspaceState.isDragging) return;
    workspaceState.panX = e.clientX - workspaceState.dragStartX;
    workspaceState.panY = e.clientY - workspaceState.dragStartY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    workspaceState.isDragging = false;
  });

  // Wheel Zoom (Zoom in/out with mouse wheel)
  canvasWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    workspaceState.zoom = +(Math.min(2.5, Math.max(0.5, workspaceState.zoom + delta))).toFixed(2);
    updateTransform();
  }, { passive: false });

  // Touch Support for Mobile Pan
  let touchStartX = 0;
  let touchStartY = 0;
  canvasWrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX - workspaceState.panX;
      touchStartY = e.touches[0].clientY - workspaceState.panY;
    }
  }, { passive: true });

  canvasWrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      workspaceState.panX = e.touches[0].clientX - touchStartX;
      workspaceState.panY = e.touches[0].clientY - touchStartY;
      updateTransform();
    }
  }, { passive: true });

  // Keyboard Shortcuts: +, -, 0, f, Escape
  container.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-' || e.key === '_') zoomOut();
    if (e.key === '0') resetZoom();
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    if (e.key === 'Escape') {
      if (workspaceState.selectedComponentId) selectComponent(null);
      if (workspaceState.isFullscreen) toggleFullscreen();
    }
  });
}

// Automatically detect and initialize #hld-workspace-container whenever it is added to the DOM
if (typeof window !== 'undefined') {
  const autoInitHld = () => {
    const el = document.getElementById('hld-workspace-container');
    if (el && !el.dataset.hldInitialized) {
      el.dataset.hldInitialized = 'true';
      initHldWorkspace(el);
    }
  };

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      autoInitHld();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
        autoInitHld();
      });
    }
  }

  requestAnimationFrame(autoInitHld);
}

