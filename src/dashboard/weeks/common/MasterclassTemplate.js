/**
 * System Design Interview Masterclass - Universal Question Layout Component
 * Renders complete 12-section walkthrough for all 20 Masterclass questions.
 * Supports light and dark mode with high contrast and responsive layout.
 */

import {
  renderUrlShortenerVectorBlueprint,
  renderRateLimiterVectorBlueprint,
  renderNotificationSystemVectorBlueprint,
  renderDistributedCacheVectorBlueprint,
  renderApiGatewayVectorBlueprint,
  renderInstagramVectorBlueprint,
  renderWhatsAppVectorBlueprint,
  renderYouTubeVectorBlueprint
} from './VectorArchitectureBlueprints.js';
import { renderHldWorkspace } from '../../components/hld-workspace/HldWorkspace.js';
import { URL_SHORTENER_HLD_DATA } from '../../components/hld-workspace/urlShortenerHldData.js';
import { RATE_LIMITER_HLD_DATA } from '../../components/hld-workspace/rateLimiterHldData.js';
import { NOTIFICATION_HLD_DATA } from '../../components/hld-workspace/notificationHldData.js';
import { DISTRIBUTED_CACHE_HLD_DATA } from '../../components/hld-workspace/distributedCacheHldData.js';
import { API_GATEWAY_HLD_DATA } from '../../components/hld-workspace/apiGatewayHldData.js';
import { INSTAGRAM_HLD_DATA } from '../../components/hld-workspace/instagramHldData.js';
import { WHATSAPP_HLD_DATA } from '../../components/hld-workspace/whatsAppHldData.js';
import { YOUTUBE_HLD_DATA } from '../../components/hld-workspace/youTubeHldData.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderMasterclassQuestion(data) {
  const {
    questionNumber,
    title,
    moduleName,
    coreTopics,
    problemStatement,
    problemExample,
    clarifyingQuestions = [],
    functionalRequirements = [],
    nonFunctionalRequirements = [],
    customSections = [], // e.g. capacityEstimation, algorithmSelection, exampleApi, etc.
    apiDesign = '',
    dataModel = '',
    highLevelArchitecture = '',
    hideHighLevelArchitecture = false,
    hideStepByStepDesign = false,
    architectureDiagram = '',
    architectureImage = '',
    architectureImageTitle = 'High-Level Architecture & Request Flow Blueprint',
    vectorBlueprint = null,
    hldWorkspace = null,
    stepByStepDesign = [],
    whyComponents = [],
    tradeoffs = [],
    tradeoffType = 'table', // 'table' or 'list'
    followUps = [],
    postComponentSections = [],
    postTradeoffSections = [],
    postSections = []
  } = data;

  const resolvedHldWorkspace = hldWorkspace || (
    questionNumber === 1 ? renderHldWorkspace(URL_SHORTENER_HLD_DATA) :
    questionNumber === 2 ? renderHldWorkspace(RATE_LIMITER_HLD_DATA) :
    questionNumber === 3 ? renderHldWorkspace(NOTIFICATION_HLD_DATA) :
    questionNumber === 4 ? renderHldWorkspace(DISTRIBUTED_CACHE_HLD_DATA) :
    questionNumber === 5 ? renderHldWorkspace(API_GATEWAY_HLD_DATA) :
    questionNumber === 6 ? renderHldWorkspace(INSTAGRAM_HLD_DATA) :
    questionNumber === 7 ? renderHldWorkspace(WHATSAPP_HLD_DATA) :
    questionNumber === 8 ? renderHldWorkspace(YOUTUBE_HLD_DATA) :
    null
  );

  let resolvedVectorBlueprint = vectorBlueprint;
  if (!resolvedVectorBlueprint) {
    if (questionNumber === 1) resolvedVectorBlueprint = renderUrlShortenerVectorBlueprint();
    else if (questionNumber === 2) resolvedVectorBlueprint = renderRateLimiterVectorBlueprint();
    else if (questionNumber === 3) resolvedVectorBlueprint = renderNotificationSystemVectorBlueprint();
    else if (questionNumber === 4) resolvedVectorBlueprint = renderDistributedCacheVectorBlueprint();
    else if (questionNumber === 5) resolvedVectorBlueprint = renderApiGatewayVectorBlueprint();
    else if (questionNumber === 6) resolvedVectorBlueprint = renderInstagramVectorBlueprint();
    else if (questionNumber === 7) resolvedVectorBlueprint = renderWhatsAppVectorBlueprint();
    else if (questionNumber === 8) resolvedVectorBlueprint = renderYouTubeVectorBlueprint();
  }


  return `
    <div class="masterclass-question-view flex flex-col gap-8 animate-fadeIn text-[#0F172A] dark:text-slate-200">
      
      <!-- HERO BANNER -->
      <div class="relative overflow-hidden rounded-2xl bg-[#EFF6FF] dark:bg-[#161D32] border border-[#BFDBFE] dark:border-indigo-500/40 p-6 sm:p-8 shadow-sm">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-4">
          <!-- Badges -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-lg bg-white dark:bg-indigo-500/20 text-[#4F46E5] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-500/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span class="material-symbols-outlined text-[14px]">architecture</span>
                Question ${questionNumber} &bull; 45-Min Masterclass
              </span>
              <span class="px-3 py-1 rounded-lg bg-white dark:bg-cyan-500/15 text-[#0284C7] dark:text-cyan-300 border border-[#BAE6FD] dark:border-cyan-500/30 text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs">
                ${escapeHtml(moduleName)}
              </span>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[11px] font-mono text-[#475569] dark:text-slate-400 bg-white dark:bg-[#0A0E1A]/80 px-2.5 py-1 rounded border border-[#E2E8F0] dark:border-[#24314A] font-semibold">
                STEP-BY-STEP SOLUTION
              </span>
              <button type="button" class="trigger-practice-whiteboard-btn px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer" title="Open practice whiteboard to sketch this system">
                <span class="material-symbols-outlined text-[14px]">draw</span>
                <span>Practice Whiteboard</span>
              </button>
            </div>
          </div>

          <!-- Titles -->
          <div class="flex flex-col gap-1.5">
            <h2 class="font-sans text-[24px] sm:text-[30px] font-black text-[#0F172A] dark:text-white tracking-tight leading-tight flex items-center gap-3">
              <span>Question ${questionNumber}. ${escapeHtml(title)}</span>
            </h2>
            <div class="flex items-center gap-2 pt-1 text-[13px] text-[#475569] dark:text-slate-300">
              <span class="font-bold text-[#0284C7] dark:text-cyan-400">Core topics:</span>
              <span class="italic font-sans">${escapeHtml(coreTopics)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 1: PROBLEM STATEMENT -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
          <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Problem Statement</h3>
        </div>
        <p class="text-[14px] leading-relaxed text-[#334155] dark:text-slate-300">
          ${problemStatement}
        </p>
        ${problemExample ? `
          <div class="bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl p-4 overflow-x-auto">
            ${problemExample}
          </div>
        ` : ''}
      </section>

      <!-- SECTION 2: CLARIFYING QUESTIONS -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
          <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Clarifying Questions &amp; Scope Narrowing</h3>
        </div>
        <p class="text-[13px] text-[#64748B] dark:text-slate-400 italic">
          Ask questions only when the reply could reshape the architecture. Treat sample interviewer answers as training assumptions, not mandatory scope.
        </p>
        <div class="overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-[#24314A]">
          <table class="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr class="bg-[#F1F5F9] dark:bg-[#0F1626] text-[#1E293B] dark:text-slate-200 border-b border-[#E2E8F0] dark:border-[#24314A]">
                <th class="py-3 px-4 font-bold w-1/2">Clarifying Question to Ask</th>
                <th class="py-3 px-4 font-bold w-1/2">Example Interviewer Reply</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#24314A]">
              ${clarifyingQuestions.map(item => `
                <tr class="hover:bg-[#F8FAFC] dark:hover:bg-[#182238]/50 transition-colors">
                  <td class="py-3 px-4 font-semibold text-[#0F172A] dark:text-slate-100">${escapeHtml(item.q)}</td>
                  <td class="py-3 px-4 text-[#334155] dark:text-slate-300">${escapeHtml(item.a)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- SECTION 3 & 4: FUNCTIONAL & NON-FUNCTIONAL REQUIREMENTS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Functional Requirements -->
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            <h3 class="font-sans text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-emerald-500">check_circle</span>
              Functional Requirements
            </h3>
          </div>
          <ul class="flex flex-col gap-2.5 text-[13.5px] text-[#334155] dark:text-slate-300">
            ${functionalRequirements.map((req, i) => `
              <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">${i + 1}</span>
                <span>${req}</span>
              </li>
            `).join('')}
          </ul>
        </section>

        <!-- Non-Functional Requirements -->
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            <h3 class="font-sans text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-amber-500">speed</span>
              Non-Functional Requirements
            </h3>
          </div>
          <ul class="flex flex-col gap-2.5 text-[13.5px] text-[#334155] dark:text-slate-300">
            ${nonFunctionalRequirements.map(req => `
              <li class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-amber-500 text-[18px] shrink-0 mt-0.5">verified</span>
                <span>${req}</span>
              </li>
            `).join('')}
          </ul>
        </section>
      </div>

      <!-- CUSTOM INTERMEDIATE SECTIONS (Capacity, Algorithm, Example Flow, Schemas, etc.) -->
      ${customSections.map((sec) => `
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            ${sec.badge ? `<span class="px-2 py-0.5 rounded ${sec.badgeColor || 'bg-purple-500/15 text-[#7C3AED] dark:text-purple-300'} font-mono text-[12px] font-bold">${escapeHtml(sec.badge)}</span>` : ''}
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">${escapeHtml(sec.title)}</h3>
          </div>
          <div class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
            ${sec.content}
          </div>
        </section>
      `).join('')}

      <!-- API DESIGN (If Provided) -->
      ${apiDesign ? `
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            <span class="px-2 py-0.5 rounded bg-blue-500/15 text-[#2563EB] dark:text-blue-300 font-mono text-[12px] font-bold">API</span>
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">API Surface &amp; Protocol Contracts</h3>
          </div>
          <div class="bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl p-4 overflow-x-auto text-[13px] font-mono text-[#0F172A] dark:text-emerald-400 leading-relaxed whitespace-pre-wrap">
${apiDesign}
          </div>
        </section>
      ` : ''}

      <!-- DATA MODEL (If Provided) -->
      ${dataModel ? `
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            <span class="px-2 py-0.5 rounded bg-teal-500/15 text-[#0D9488] dark:text-teal-300 font-mono text-[12px] font-bold">DATA</span>
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Data Models &amp; Storage Layout</h3>
          </div>
          <div class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
            ${dataModel}
          </div>
        </section>
      ` : ''}

      <!-- HIGH-LEVEL ARCHITECTURE -->
      ${!hideHighLevelArchitecture ? `
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-sky-500/15 text-[#0284C7] dark:text-sky-300 font-mono text-[12px] font-bold">ARCH</span>
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">High-Level Architecture</h3>
          </div>
          <div class="flex items-center gap-2">
            ${resolvedVectorBlueprint ? `
              <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">verified</span>
                Ultra-Sharp Vector
              </span>
            ` : ''}
            ${architectureImage ? `
              <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">account_tree</span>
                Diagram Included
              </span>
            ` : ''}
          </div>
        </div>

        <div class="text-[14px] leading-relaxed text-[#334155] dark:text-slate-300">
          ${highLevelArchitecture}
        </div>

        ${resolvedHldWorkspace ? `
          <!-- INTERACTIVE HLD ARCHITECTURE WORKSPACE & VIEW TOGGLE -->
          <div class="flex flex-col gap-4 my-2">
            <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div class="flex items-center gap-1.5 flex-wrap">
                ${architectureImage ? `
                  <button type="button" 
                    class="arch-tab-btn-${questionNumber} active px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer" 
                    onclick="
                      const parent = this.closest('section');
                      const hld = parent.querySelector('.hld-view-${questionNumber}');
                      const vector = parent.querySelector('.vector-view-${questionNumber}');
                      const poster = parent.querySelector('.poster-view-${questionNumber}');
                      if (poster) poster.classList.remove('hidden');
                      if (hld) hld.classList.add('hidden');
                      if (vector) vector.classList.add('hidden');
                      this.parentElement.querySelectorAll('button').forEach(b => {
                        b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                        b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                      });
                      this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                      this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                    ">
                    <span class="material-symbols-outlined text-[16px]">image</span>
                    <span>Infographic Poster</span>
                  </button>
                ` : ''}
                <button type="button" 
                  class="arch-tab-btn-${questionNumber} ${!architectureImage ? 'active bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'} px-3.5 py-1.5 rounded-lg text-[12px] hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                  onclick="
                    const parent = this.closest('section');
                    const hld = parent.querySelector('.hld-view-${questionNumber}');
                    const vector = parent.querySelector('.vector-view-${questionNumber}');
                    const poster = parent.querySelector('.poster-view-${questionNumber}');
                    if (hld) hld.classList.remove('hidden');
                    if (vector) vector.classList.add('hidden');
                    if (poster) poster.classList.add('hidden');
                    this.parentElement.querySelectorAll('button').forEach(b => {
                      b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                      b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                    });
                    this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  ">
                  <span class="material-symbols-outlined text-[16px]">touch_app</span>
                  <span>Interactive HLD Studio</span>
                </button>
                <button type="button" 
                  class="arch-tab-btn-${questionNumber} px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                  onclick="
                    const parent = this.closest('section');
                    const hld = parent.querySelector('.hld-view-${questionNumber}');
                    const vector = parent.querySelector('.vector-view-${questionNumber}');
                    const poster = parent.querySelector('.poster-view-${questionNumber}');
                    if (vector) vector.classList.remove('hidden');
                    if (hld) hld.classList.add('hidden');
                    if (poster) poster.classList.add('hidden');
                    this.parentElement.querySelectorAll('button').forEach(b => {
                      b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                      b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                    });
                    this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  ">
                  <span class="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Vector Blueprint (Full Spec)</span>
                </button>
              </div>
              <span class="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 px-2 flex items-center gap-1 font-semibold">
                <span class="material-symbols-outlined text-[14px]">tune</span>
                Pan &bull; Zoom &bull; Flow Player &bull; Inspector
              </span>
            </div>

            <!-- Poster View (Default when available) -->
            ${architectureImage ? `
              <div class="poster-view-${questionNumber}">
                <div class="rounded-2xl overflow-hidden border border-[#CBD5E1] dark:border-[#24314A] bg-[#0A0F1D] shadow-md">
                  <div class="px-4 py-3 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] text-cyan-400">schema</span>
                      <span class="text-[13px] font-bold text-slate-200 tracking-wide">${escapeHtml(architectureImageTitle)}</span>
                    </div>
                    <a href="${architectureImage}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors">
                      <span>Open Full Size</span>
                      <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                  <div class="p-3 sm:p-5 bg-[#030712] flex items-center justify-center overflow-x-auto">
                    <img src="${architectureImage}" alt="${escapeHtml(title)} Architecture Diagram" class="max-w-full h-auto object-contain rounded-xl shadow-lg cursor-zoom-in" onclick="window.open(this.src, '_blank')" />
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Interactive HLD Studio View (Secondary) -->
            <div class="hld-view-${questionNumber} ${architectureImage ? 'hidden' : ''}">
              ${resolvedHldWorkspace}
            </div>

            <!-- Vector Blueprint View (Tertiary) -->
            <div class="vector-view-${questionNumber} hidden">
              ${resolvedVectorBlueprint || ''}
            </div>
          </div>
        ` : (resolvedVectorBlueprint ? `
          <!-- ARCHITECTURE BLUEPRINT CONTROLS -->
          <div class="flex flex-col gap-4 my-2">
            <div class="flex items-center justify-between flex-wrap gap-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div class="flex items-center gap-1.5 flex-wrap">
                ${architectureImage ? `
                  <button type="button" 
                    class="arch-tab-btn-${questionNumber} active px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs flex items-center gap-1.5 cursor-pointer" 
                    onclick="
                      const parent = this.closest('section');
                      parent.querySelector('.poster-view-${questionNumber}').classList.remove('hidden');
                      const vector = parent.querySelector('.vector-view-${questionNumber}');
                      if (vector) vector.classList.add('hidden');
                      this.parentElement.querySelectorAll('button').forEach(b => {
                        b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                        b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                      });
                      this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                      this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                    ">
                    <span class="material-symbols-outlined text-[16px]">image</span>
                    <span>Infographic Poster</span>
                  </button>
                ` : ''}
                <button type="button" 
                  class="arch-tab-btn-${questionNumber} ${!architectureImage ? 'active bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'} px-3.5 py-1.5 rounded-lg text-[12px] hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer" 
                  onclick="
                    const parent = this.closest('section');
                    parent.querySelector('.vector-view-${questionNumber}').classList.remove('hidden');
                    const poster = parent.querySelector('.poster-view-${questionNumber}');
                    if (poster) poster.classList.add('hidden');
                    this.parentElement.querySelectorAll('button').forEach(b => {
                      b.classList.remove('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                      b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
                    });
                    this.classList.add('active', 'bg-white', 'dark:bg-indigo-600', 'text-indigo-700', 'dark:text-white', 'shadow-xs', 'font-bold');
                    this.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');
                  ">
                  <span class="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Vector Blueprint (Razor Sharp)</span>
                </button>
              </div>
              <span class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 px-2 flex items-center gap-1 font-semibold">
                <span class="material-symbols-outlined text-[14px]">fit_screen</span>
                Vector Sharp &bull; Selectable Text
              </span>
            </div>

            <!-- Poster View (Default when available) -->
            ${architectureImage ? `
              <div class="poster-view-${questionNumber}">
                <div class="rounded-2xl overflow-hidden border border-[#CBD5E1] dark:border-[#24314A] bg-[#0A0F1D] shadow-md">
                  <div class="px-4 py-3 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] text-cyan-400">schema</span>
                      <span class="text-[13px] font-bold text-slate-200 tracking-wide">${escapeHtml(architectureImageTitle)}</span>
                    </div>
                    <a href="${architectureImage}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors">
                      <span>Open Full Size</span>
                      <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                  <div class="p-3 sm:p-5 bg-[#030712] flex items-center justify-center overflow-x-auto">
                    <img src="${architectureImage}" alt="${escapeHtml(title)} Architecture Diagram" class="max-w-full h-auto object-contain rounded-xl shadow-lg cursor-zoom-in" onclick="window.open(this.src, '_blank')" />
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Vector Blueprint View (Toggleable) -->
            <div class="vector-view-${questionNumber} ${architectureImage ? 'hidden' : ''}">
              ${resolvedVectorBlueprint}
            </div>
          </div>
        ` : (architectureImage ? `
          <div class="rounded-2xl overflow-hidden border border-[#CBD5E1] dark:border-[#24314A] bg-[#0A0F1D] shadow-md my-2">
            <div class="px-4 py-3 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="material-symbols-outlined text-[18px] text-cyan-400">schema</span>
                <span class="text-[13px] font-bold text-slate-200 tracking-wide">${escapeHtml(architectureImageTitle)}</span>
                ${architectureImage.endsWith('.svg') ? `
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">verified</span>
                    Razor-Sharp Vector
                  </span>
                ` : ''}
              </div>
              <div class="flex items-center gap-2">
                <a href="${architectureImage}" download class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11.5px] font-semibold flex items-center gap-1 transition-colors">
                  <span class="material-symbols-outlined text-[14px]">download</span>
                  <span>Save Vector</span>
                </a>
                <a href="${architectureImage}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors">
                  <span>Open Full Size</span>
                  <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
            <div class="p-3 sm:p-5 bg-[#030712] flex items-center justify-center overflow-x-auto min-h-[350px]">
              <img src="${architectureImage}" alt="${escapeHtml(title)} Architecture Diagram" class="max-w-full w-full h-auto object-contain rounded-xl shadow-lg hover:brightness-105 transition-all cursor-zoom-in" onclick="window.open(this.src, '_blank')" />
            </div>
            <div class="px-4 py-2 bg-[#0A0F1D] border-t border-slate-800/80 text-[11.5px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <span>Click diagram or "Open Full Size" to inspect in infinitely scalable vector resolution.</span>
              <span class="font-mono text-cyan-400 font-semibold">Production Spec Blueprint</span>
            </div>
          </div>
        ` : ''))}

        ${architectureDiagram ? `
          <div class="bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl p-4 overflow-x-auto">
            <pre class="font-mono text-[12px] sm:text-[12.5px] text-[#0F172A] dark:text-cyan-300 leading-relaxed">${architectureDiagram}</pre>
          </div>
        ` : ''}
      </section>
      ` : ''}

      <!-- STEP-BY-STEP DESIGN — WHAT TO WRITE IN THE INTERVIEW -->
      ${!hideStepByStepDesign && stepByStepDesign && stepByStepDesign.length > 0 ? `
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-rose-500/15 text-[#E11D48] dark:text-rose-300 font-mono text-[12px] font-bold">STEPS</span>
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Step-by-Step Design — What to Write in the Interview</h3>
          </div>
          <span class="text-[11px] font-mono text-[#64748B] dark:text-slate-400">BOARD BLUEPRINT</span>
        </div>
        <div class="flex flex-col gap-4">
          ${stepByStepDesign.map(s => `
            <div class="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F1626] border border-[#E2E8F0] dark:border-[#24314A] flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-[#4F46E5]/15 text-[#4F46E5] dark:text-indigo-300 font-bold text-[11px] uppercase tracking-wider">
                  Step ${s.stepNumber}
                </span>
                <h4 class="font-sans text-[15px] font-bold text-[#0F172A] dark:text-white">${escapeHtml(s.stepTitle)}</h4>
              </div>
              <div class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300 pl-1">
                ${s.stepBody}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}

      <!-- WHY EACH COMPONENT IS NEEDED -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
          <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-[#059669] dark:text-emerald-300 font-mono text-[12px] font-bold">COMPONENTS</span>
          <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Why Each Component is Needed</h3>
        </div>
        <div class="overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-[#24314A]">
          <table class="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr class="bg-[#F1F5F9] dark:bg-[#0F1626] text-[#1E293B] dark:text-slate-200 border-b border-[#E2E8F0] dark:border-[#24314A]">
                <th class="py-3 px-4 font-bold w-1/3">Building Block / Component</th>
                <th class="py-3 px-4 font-bold w-2/3">Why It Is There (Design Rationale)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#24314A]">
              ${whyComponents.map(c => `
                <tr class="hover:bg-[#F8FAFC] dark:hover:bg-[#182238]/50 transition-colors">
                  <td class="py-3 px-4 font-semibold text-[#0F172A] dark:text-slate-100">${escapeHtml(c.component)}</td>
                  <td class="py-3 px-4 text-[#334155] dark:text-slate-300">${escapeHtml(c.why)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      ${postComponentSections.map(sec => `
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            ${sec.badge ? `<span class="px-2 py-0.5 rounded ${sec.badgeColor || 'bg-purple-500/15 text-[#7C3AED] dark:text-purple-300'} font-mono text-[12px] font-bold">${escapeHtml(sec.badge)}</span>` : ''}
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">${escapeHtml(sec.title)}</h3>
          </div>
          <div class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
            ${sec.content}
          </div>
        </section>
      `).join('')}

      <!-- TRADE-OFFS AND ALTERNATIVES -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
          <span class="px-2 py-0.5 rounded bg-amber-500/15 text-[#D97706] dark:text-amber-300 font-mono text-[12px] font-bold">TRADE-OFFS</span>
          <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Trade-Offs and Architectural Alternatives</h3>
        </div>
        ${tradeoffType === 'table' ? `
          <div class="overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-[#24314A]">
            <table class="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr class="bg-[#F1F5F9] dark:bg-[#0F1626] text-[#1E293B] dark:text-slate-200 border-b border-[#E2E8F0] dark:border-[#24314A]">
                  <th class="py-3 px-4 font-bold w-1/4">Choice / Decision</th>
                  <th class="py-3 px-4 font-bold w-3/8 text-emerald-600 dark:text-emerald-400">Upside / Benefit</th>
                  <th class="py-3 px-4 font-bold w-3/8 text-rose-600 dark:text-rose-400">Downside / Cost</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#24314A]">
                ${tradeoffs.map(t => `
                  <tr class="hover:bg-[#F8FAFC] dark:hover:bg-[#182238]/50 transition-colors">
                    <td class="py-3 px-4 font-semibold text-[#0F172A] dark:text-slate-100">${escapeHtml(t.choice || t.decision)}</td>
                    <td class="py-3 px-4 text-[#334155] dark:text-slate-300">${escapeHtml(t.upside || t.benefit)}</td>
                    <td class="py-3 px-4 text-[#334155] dark:text-slate-300">${escapeHtml(t.downside || t.cost)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <ul class="flex flex-col gap-3 text-[13.5px] text-[#334155] dark:text-slate-300">
            ${tradeoffs.map(t => `
              <li class="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F1626] border border-[#E2E8F0] dark:border-[#24314A]">
                <span class="material-symbols-outlined text-amber-500 text-[18px] shrink-0 mt-0.5">balance</span>
                <span>${t}</span>
              </li>
            `).join('')}
          </ul>
        `}
      </section>

      ${postTradeoffSections.map(sec => `
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            ${sec.badge ? `<span class="px-2 py-0.5 rounded ${sec.badgeColor || 'bg-purple-500/15 text-[#7C3AED] dark:text-purple-300'} font-mono text-[12px] font-bold">${escapeHtml(sec.badge)}</span>` : ''}
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">${escapeHtml(sec.title)}</h3>
          </div>
          <div class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
            ${sec.content}
          </div>
        </section>
      `).join('')}

      <!-- FOLLOW-UP QUESTIONS AND MODEL ANSWERS -->
      <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div class="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-violet-500/15 text-[#7C3AED] dark:text-violet-300 font-mono text-[12px] font-bold">INTERVIEW DRILL</span>
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Follow-Up Questions &amp; Model Answers</h3>
          </div>
          <span class="text-[11px] font-mono text-[#64748B] dark:text-slate-400">STAFF-LEVEL DRILL</span>
        </div>
        <div class="flex flex-col gap-4">
          ${followUps.map((fu, idx) => `
            <div class="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F1626] border border-[#E2E8F0] dark:border-[#24314A] flex flex-col gap-3">
              <div class="flex items-start gap-2">
                <span class="px-2 py-0.5 rounded bg-[#4F46E5]/15 text-[#4F46E5] dark:text-indigo-300 font-mono font-bold text-[11px] shrink-0 mt-0.5">
                  Q${idx + 1}
                </span>
                <div class="font-sans text-[14.5px] font-bold text-[#0F172A] dark:text-white">
                  ${escapeHtml(fu.q)}
                </div>
              </div>
              <div class="p-3.5 rounded-lg bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-200">
                <span class="font-bold text-[#0284C7] dark:text-cyan-400 block mb-1">Model Answer:</span>
                ${fu.a}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      ${postSections.map(sec => `
        <section class="bg-white dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#24314A]/80 pb-3">
            ${sec.badge ? `<span class="px-2 py-0.5 rounded ${sec.badgeColor || 'bg-purple-500/15 text-[#7C3AED] dark:text-purple-300'} font-mono text-[12px] font-bold">${escapeHtml(sec.badge)}</span>` : ''}
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">${escapeHtml(sec.title)}</h3>
          </div>
          <div class="text-[13.5px] leading-relaxed text-[#334155] dark:text-slate-300">
            ${sec.content}
          </div>
        </section>
      `).join('')}

    </div>
  `;
}
