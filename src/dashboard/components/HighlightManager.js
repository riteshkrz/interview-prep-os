/**
 * 45-Day Interview Prep OS - Highlight Manager
 * Contextual floating toolbar & robust text highlighting engine for Dashboard Content/Lessons.
 *
 * Scope:
 * - Scoped ONLY to lesson content reading areas (.roadmap-topic-content, [data-lesson-content="true"]).
 * - Excludes code blocks (<pre>, <code>), sidebar, header, navigation, and dashboard controls.
 * - Robust character offset + prefix/suffix context representation.
 * - Handles multi-paragraph selections, formatted text, and graceful failure on invalid ranges.
 */

import { highlightService } from '../../services/highlightService.js';

let toolbarElement = null;
let currentActiveSelection = null;
let currentContentContainer = null;
let currentIntersectingHighlightIds = [];
let isProcessingAction = false;
let isInitialized = false;

/**
 * Filter tree walker to collect only valid text nodes inside lesson content
 * Excludes text inside pre, code, buttons, and system controls.
 */
function getTextNodesInContent(container) {
  if (!container) return [];
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        // Strict Exclusion: Code blocks, buttons, interactive forms, no-highlight regions
        if (parent.closest('pre, code, button, input, textarea, select, [contenteditable="true"], .no-highlight')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let n = walker.nextNode();
  while (n) {
    textNodes.push(n);
    n = walker.nextNode();
  }
  return textNodes;
}

/**
 * Build linear text representation and mapping of character offsets to DOM text nodes
 */
function buildLinearContentMap(container) {
  const textNodes = getTextNodesInContent(container);
  let fullText = '';
  const entries = [];

  for (const node of textNodes) {
    const text = node.textContent || '';
    entries.push({
      node,
      start: fullText.length,
      end: fullText.length + text.length,
      length: text.length
    });
    fullText += text;
  }

  return { fullText, entries };
}

/**
 * Calculate robust start/end character offsets, prefix, and suffix for a DOM selection Range
 */
export function calculateRangeOffsets(container, range) {
  if (!container || !range) return null;

  const { fullText, entries } = buildLinearContentMap(container);
  if (!entries.length) return null;

  let startOffset = -1;
  let endOffset = -1;

  for (const entry of entries) {
    if (entry.node === range.startContainer) {
      startOffset = entry.start + range.startOffset;
    }
    if (entry.node === range.endContainer) {
      endOffset = entry.start + range.endOffset;
    }
  }

  // Handle case where start or end container was an element node instead of a text node
  if (startOffset === -1 || endOffset === -1) {
    for (const entry of entries) {
      if (startOffset === -1 && range.isPointInRange(entry.node, 0)) {
        startOffset = entry.start;
      }
      if (range.isPointInRange(entry.node, entry.length)) {
        endOffset = entry.end;
      }
    }
  }

  if (startOffset === -1 || endOffset === -1 || startOffset >= endOffset) {
    return null;
  }

  const selectedText = fullText.slice(startOffset, endOffset);
  if (!selectedText.trim()) {
    return null;
  }

  const prefix = fullText.slice(Math.max(0, startOffset - 32), startOffset);
  const suffix = fullText.slice(endOffset, Math.min(fullText.length, endOffset + 32));

  // Determine closest container block tag / ID
  const commonElem = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;
  const closestBlock = commonElem?.closest('p, li, h1, h2, h3, h4, h5, h6, blockquote, div');
  const containerId = closestBlock?.id || closestBlock?.tagName?.toLowerCase() || null;

  return {
    startOffset,
    endOffset,
    selectedText,
    prefix,
    suffix,
    containerId
  };
}

/**
 * Find text node and local offset from a linear character offset
 */
function findNodeAtOffset(entries, offset) {
  for (const entry of entries) {
    if (offset >= entry.start && offset <= entry.end) {
      return {
        node: entry.node,
        localOffset: Math.min(entry.length, Math.max(0, offset - entry.start))
      };
    }
  }
  return null;
}

/**
 * Wrap a DOM Range with <mark class="lesson-highlight"> elements.
 * Correctly splits text nodes without corrupting parent tag structure.
 */
export function wrapRangeWithHighlight(container, range, highlightId) {
  if (!container || !range || !highlightId) return false;

  const textNodes = getTextNodesInContent(container);
  const targetNodes = [];

  for (const node of textNodes) {
    try {
      if (range.intersectsNode(node)) {
        targetNodes.push(node);
      }
    } catch (e) {
      // Browser range check fallback
    }
  }

  if (!targetNodes.length) return false;

  targetNodes.forEach(node => {
    // Determine start and end offsets within this particular text node
    const isStart = (node === range.startContainer);
    const isEnd = (node === range.endContainer);

    let start = isStart ? range.startOffset : 0;
    let end = isEnd ? range.endOffset : node.textContent.length;

    if (start >= end) return;

    let targetNode = node;

    // Split at end first so start offset remains stable
    if (end < targetNode.textContent.length) {
      targetNode.splitText(end);
    }

    // Split at start
    if (start > 0) {
      targetNode = targetNode.splitText(start);
    }

    // Wrap the exact matching segment in <mark>
    const parent = targetNode.parentNode;
    if (parent && parent.nodeName !== 'MARK') {
      const mark = document.createElement('mark');
      mark.className = 'lesson-highlight';
      mark.setAttribute('data-highlight-id', highlightId);
      mark.setAttribute('data-lesson-highlight', 'true');
      mark.title = 'Lesson highlight (Click to remove)';
      parent.insertBefore(mark, targetNode);
      mark.appendChild(targetNode);
    } else if (parent && parent.nodeName === 'MARK') {
      // Already inside a mark, update id attribute
      parent.setAttribute('data-highlight-id', highlightId);
    }
  });

  return true;
}

/**
 * Remove an existing highlight from the DOM container by un-wrapping its <mark> elements
 */
export function unwrapHighlightFromDOM(container, highlightId) {
  if (!container || !highlightId) return;

  const marks = container.querySelectorAll(`mark.lesson-highlight[data-highlight-id="${highlightId}"]`);
  marks.forEach(mark => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
  });

  try {
    container.normalize();
  } catch (e) { }
}

/**
 * Check if a selection or element intersects existing highlights
 */
function getIntersectingHighlights(container, range) {
  if (!container || !range) return [];
  const marks = container.querySelectorAll('mark.lesson-highlight');
  const ids = new Set();

  marks.forEach(mark => {
    try {
      if (range.intersectsNode(mark)) {
        const id = mark.getAttribute('data-highlight-id');
        if (id) ids.add(id);
      }
    } catch (e) { }
  });

  // Also check if start or end container is inside a mark
  const startMark = range.startContainer.parentElement?.closest('mark.lesson-highlight');
  if (startMark) {
    const id = startMark.getAttribute('data-highlight-id');
    if (id) ids.add(id);
  }

  const endMark = range.endContainer.parentElement?.closest('mark.lesson-highlight');
  if (endMark) {
    const id = endMark.getAttribute('data-highlight-id');
    if (id) ids.add(id);
  }

  return Array.from(ids);
}

/**
 * Re-apply a stored highlight onto container DOM using offsets and context fallback
 */
export function restoreHighlightToContainer(container, highlight) {
  if (!container || !highlight) return false;

  const { fullText, entries } = buildLinearContentMap(container);
  if (!entries.length) return false;

  let resolvedStart = highlight.startOffset;
  let resolvedEnd = highlight.endOffset;
  const targetText = highlight.selectedText;

  // 1. Direct offset validation: Check if text at stored offsets matches exactly
  let matchFound = false;
  if (
    resolvedStart >= 0 &&
    resolvedEnd <= fullText.length &&
    resolvedStart < resolvedEnd
  ) {
    const slice = fullText.slice(resolvedStart, resolvedEnd);
    if (slice === targetText) {
      matchFound = true;
    }
  }

  // 2. Context anchor search if direct offsets shifted due to slight DOM variation
  if (!matchFound && targetText) {
    const candidateIndices = [];
    let idx = fullText.indexOf(targetText);
    while (idx !== -1) {
      candidateIndices.push(idx);
      idx = fullText.indexOf(targetText, idx + 1);
    }

    if (candidateIndices.length === 1) {
      // Exactly one match on page, safe to disambiguate
      resolvedStart = candidateIndices[0];
      resolvedEnd = resolvedStart + targetText.length;
      matchFound = true;
    } else if (candidateIndices.length > 1) {
      // Multiple matches on page: use prefix/suffix context anchor scoring
      let bestScore = -1;
      let bestIdx = -1;

      for (const cIdx of candidateIndices) {
        let score = 0;
        if (highlight.prefix) {
          const actualPrefix = fullText.slice(Math.max(0, cIdx - highlight.prefix.length), cIdx);
          if (actualPrefix === highlight.prefix) score += 10;
          else if (actualPrefix.includes(highlight.prefix.slice(-10))) score += 5;
        }
        if (highlight.suffix) {
          const actualSuffix = fullText.slice(cIdx + targetText.length, cIdx + targetText.length + highlight.suffix.length);
          if (actualSuffix === highlight.suffix) score += 10;
          else if (actualSuffix.includes(highlight.suffix.slice(0, 10))) score += 5;
        }
        // Distance score to original offset
        const dist = Math.abs(cIdx - highlight.startOffset);
        score += Math.max(0, 5 - Math.floor(dist / 100));

        if (score > bestScore) {
          bestScore = score;
          bestIdx = cIdx;
        }
      }

      if (bestScore >= 5 && bestIdx !== -1) {
        resolvedStart = bestIdx;
        resolvedEnd = resolvedStart + targetText.length;
        matchFound = true;
      }
    }
  }

  // Fail gracefully if highlight cannot be mapped safely
  if (!matchFound) {
    console.warn('[HighlightManager] Highlight range could not be mapped safely, skipping gracefully:', highlight.id);
    return false;
  }

  const startPoint = findNodeAtOffset(entries, resolvedStart);
  const endPoint = findNodeAtOffset(entries, resolvedEnd);

  if (!startPoint || !endPoint) return false;

  try {
    const range = document.createRange();
    range.setStart(startPoint.node, startPoint.localOffset);
    range.setEnd(endPoint.node, endPoint.localOffset);
    return wrapRangeWithHighlight(container, range, highlight.id);
  } catch (err) {
    console.warn('[HighlightManager] Failed to apply range to DOM:', err);
    return false;
  }
}

/**
 * Load and apply all stored highlights for a specific container element
 */
export async function applyHighlightsToContainer(container, contentId) {
  if (!container) return;
  const resolvedContentId = contentId || container.getAttribute('data-content-id');
  if (!resolvedContentId) return;

  // Clear existing marks if re-rendering container
  const existingMarks = container.querySelectorAll('mark.lesson-highlight');
  existingMarks.forEach(m => {
    const p = m.parentNode;
    if (p) {
      while (m.firstChild) p.insertBefore(m.firstChild, m);
      p.removeChild(m);
    }
  });
  try { container.normalize(); } catch (e) { }

  try {
    const highlights = await highlightService.getHighlights(resolvedContentId);
    if (Array.isArray(highlights)) {
      for (const h of highlights) {
        restoreHighlightToContainer(container, h);
      }
    }
  } catch (err) {
    console.warn('[HighlightManager] Error loading highlights for container:', err);
  }
}

/**
 * Load and apply highlights to all visible lesson content reading areas
 */
export function applyAllVisibleContainers() {
  const containers = document.querySelectorAll('.roadmap-topic-content, [data-lesson-content="true"]');
  containers.forEach(container => {
    const contentId = container.getAttribute('data-content-id');
    if (contentId) {
      applyHighlightsToContainer(container, contentId);
    }
  });
}

/**
 * Create or get the contextual floating toolbar element
 */
function getOrCreateToolbar() {
  if (toolbarElement && document.body.contains(toolbarElement)) {
    return toolbarElement;
  }

  const existing = document.getElementById('lesson-highlight-toolbar');
  if (existing) {
    toolbarElement = existing;
    return toolbarElement;
  }

  const toolbar = document.createElement('div');
  toolbar.id = 'lesson-highlight-toolbar';
  toolbar.className = 'lesson-highlight-toolbar hidden fixed z-50 flex items-center gap-1 p-1 bg-[#0F1626]/95 dark:bg-[#0F1626]/95 text-slate-200 border border-[#24314A] rounded-xl shadow-2xl backdrop-blur-md transition-all duration-150 select-none';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Lesson Text Highlighter');

  toolbar.innerHTML = `
    <!-- Highlight Action Button -->
    <button
      type="button"
      id="btn-highlight-apply"
      class="highlight-toolbar-btn px-2.5 py-1 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 active:bg-amber-500/30 transition-all flex items-center gap-1.5 font-sans text-[12px] font-semibold cursor-pointer shadow-xs"
      title="Apply yellow highlight to selection"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm"></span>
      <span>Highlight</span>
    </button>

    <span class="w-px h-3.5 bg-slate-700/80 my-auto"></span>

    <!-- Remove Highlight Action Button -->
    <button
      type="button"
      id="btn-highlight-remove"
      class="highlight-toolbar-btn px-2.5 py-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 active:bg-rose-500/25 transition-all flex items-center gap-1.5 font-sans text-[12px] font-semibold cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
      title="Remove highlight from selection"
    >
      <span class="material-symbols-outlined text-[15px]">format_ink_highlighter</span>
      <span>Remove</span>
    </button>
  `;

  // Attach toolbar actions
  const applyBtn = toolbar.querySelector('#btn-highlight-apply');
  const removeBtn = toolbar.querySelector('#btn-highlight-remove');

  applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleApplyHighlight();
  });

  removeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleRemoveHighlight();
  });

  // Prevent mousedown on toolbar from dismissing selection
  toolbar.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });

  const mount = document.getElementById('modal-mount') || document.body;
  mount.appendChild(toolbar);
  toolbarElement = toolbar;
  return toolbarElement;
}

/**
 * Hide the floating toolbar
 */
export function hideToolbar() {
  if (toolbarElement) {
    toolbarElement.classList.add('hidden');
    toolbarElement.style.top = '-9999px';
    toolbarElement.style.left = '-9999px';
  }
  currentActiveSelection = null;
  currentContentContainer = null;
  currentIntersectingHighlightIds = [];
}

/**
 * Position the floating toolbar above or below the selection bounding rect
 */
function positionToolbar(rect) {
  const toolbar = getOrCreateToolbar();
  if (!rect) return;

  toolbar.classList.remove('hidden');
  const toolbarWidth = toolbar.offsetWidth || 180;
  const toolbarHeight = toolbar.offsetHeight || 38;

  // Position above selection by default
  let top = rect.top - toolbarHeight - 8;

  // Flip below if selection is near the top of the viewport
  if (top < 12) {
    top = rect.bottom + 8;
  }

  // Center horizontally relative to selection
  let left = rect.left + (rect.width / 2) - (toolbarWidth / 2);

  // Clamp within viewport boundaries
  const padding = 12;
  const maxLeft = (window.innerWidth || document.documentElement.clientWidth) - toolbarWidth - padding;
  left = Math.max(padding, Math.min(maxLeft, left));

  toolbar.style.top = `${Math.round(top)}px`;
  toolbar.style.left = `${Math.round(left)}px`;
}

/**
 * Evaluate current browser selection and show/hide contextual toolbar
 */
export function handleSelectionChange() {
  if (isProcessingAction) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    hideToolbar();
    return;
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();

  // Content boundary check: Ignore whitespace or trivial 1-character clicks
  if (!selectedText || selectedText.trim().length < 2) {
    hideToolbar();
    return;
  }

  // Content boundary check: Must be inside lesson reading area
  const startEl = range.startContainer.nodeType === Node.ELEMENT_NODE
    ? range.startContainer
    : range.startContainer.parentElement;
  const endEl = range.endContainer.nodeType === Node.ELEMENT_NODE
    ? range.endContainer
    : range.endContainer.parentElement;

  const container = startEl?.closest('.roadmap-topic-content, [data-lesson-content="true"]');
  const endContainer = endEl?.closest('.roadmap-topic-content, [data-lesson-content="true"]');

  if (!container || container !== endContainer) {
    hideToolbar();
    return;
  }

  // Strict Exclusions:
  // 1. Code blocks (<pre>, <code>)
  if (startEl?.closest('pre, code') || endEl?.closest('pre, code')) {
    hideToolbar();
    return;
  }

  // 2. Buttons, interactive inputs, navigation controls
  if (startEl?.closest('button, input, textarea, select, .roadmap-topic-tab') ||
      endEl?.closest('button, input, textarea, select, .roadmap-topic-tab')) {
    hideToolbar();
    return;
  }

  const rect = range.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) {
    hideToolbar();
    return;
  }

  // Store active context
  currentActiveSelection = range.cloneRange();
  currentContentContainer = container;
  currentIntersectingHighlightIds = getIntersectingHighlights(container, range);

  // Configure toolbar button states
  const toolbar = getOrCreateToolbar();
  const removeBtn = toolbar.querySelector('#btn-highlight-remove');
  if (removeBtn) {
    if (currentIntersectingHighlightIds.length > 0) {
      removeBtn.removeAttribute('disabled');
      removeBtn.classList.remove('opacity-35', 'cursor-not-allowed');
      removeBtn.classList.add('text-rose-400');
    } else {
      removeBtn.setAttribute('disabled', 'true');
      removeBtn.classList.add('opacity-35', 'cursor-not-allowed');
      removeBtn.classList.remove('text-rose-400');
    }
  }

  positionToolbar(rect);
}

/**
 * Handle "Highlight" button click
 */
async function handleApplyHighlight() {
  if (!currentActiveSelection || !currentContentContainer) return;
  isProcessingAction = true;

  try {
    const range = currentActiveSelection;
    const container = currentContentContainer;
    const contentId = container.getAttribute('data-content-id') || 'general-lesson';

    const offsets = calculateRangeOffsets(container, range);
    if (!offsets) {
      hideToolbar();
      return;
    }

    // Persist highlight via API / Service
    const highlight = await highlightService.createHighlight({
      contentId,
      selectedText: offsets.selectedText,
      startOffset: offsets.startOffset,
      endOffset: offsets.endOffset,
      containerId: offsets.containerId,
      prefix: offsets.prefix,
      suffix: offsets.suffix
    });

    if (highlight?.id) {
      wrapRangeWithHighlight(container, range, highlight.id);
    }

    // Clear selection
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  } catch (err) {
    console.error('[HighlightManager] Error creating highlight:', err);
  } finally {
    isProcessingAction = false;
    hideToolbar();
  }
}

/**
 * Handle "Remove highlight" button click
 */
async function handleRemoveHighlight() {
  if (!currentContentContainer) return;
  isProcessingAction = true;

  try {
    const container = currentContentContainer;
    const idsToRemove = [...currentIntersectingHighlightIds];

    if (!idsToRemove.length && currentActiveSelection) {
      const ids = getIntersectingHighlights(container, currentActiveSelection);
      idsToRemove.push(...ids);
    }

    for (const id of idsToRemove) {
      unwrapHighlightFromDOM(container, id);
      await highlightService.deleteHighlight(id);
    }

    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  } catch (err) {
    console.error('[HighlightManager] Error removing highlight:', err);
  } finally {
    isProcessingAction = false;
    hideToolbar();
  }
}

/**
 * Initialize event listeners for selection, click-to-remove, and viewport responsiveness
 */
export function initHighlightManager() {
  if (isInitialized) {
    applyAllVisibleContainers();
    return;
  }
  isInitialized = true;

  // Initialize toolbar element in DOM
  getOrCreateToolbar();

  // Mouse / Trackpad selection listener
  document.addEventListener('mouseup', () => {
    setTimeout(handleSelectionChange, 10);
  });

  // Mobile / Tablet touch selection listener
  document.addEventListener('touchend', () => {
    setTimeout(handleSelectionChange, 30);
  });

  // Keyboard navigation selection listener (Shift + Arrow keys)
  document.addEventListener('keyup', (e) => {
    if (e.shiftKey || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      setTimeout(handleSelectionChange, 20);
    }
  });

  // Click on existing highlight directly selects it and shows toolbar with Remove active
  document.addEventListener('click', (e) => {
    const mark = e.target.closest('mark.lesson-highlight');
    if (mark) {
      const container = mark.closest('.roadmap-topic-content, [data-lesson-content="true"]');
      if (container) {
        const id = mark.getAttribute('data-highlight-id');
        const range = document.createRange();
        range.selectNodeContents(mark);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
        currentActiveSelection = range;
        currentContentContainer = container;
        currentIntersectingHighlightIds = id ? [id] : [];

        const toolbar = getOrCreateToolbar();
        const removeBtn = toolbar.querySelector('#btn-highlight-remove');
        if (removeBtn) {
          removeBtn.removeAttribute('disabled');
          removeBtn.classList.remove('opacity-35', 'cursor-not-allowed');
          removeBtn.classList.add('text-rose-400');
        }
        positionToolbar(mark.getBoundingClientRect());
        return;
      }
    }

    // Dismiss toolbar on clicks outside toolbar and selection
    if (toolbarElement && !toolbarElement.contains(e.target)) {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        hideToolbar();
      }
    }
  });

  // Dismiss toolbar on window scroll
  window.addEventListener('scroll', () => {
    if (!toolbarElement?.classList.contains('hidden') && currentActiveSelection) {
      const rect = currentActiveSelection.getBoundingClientRect();
      if (rect.width > 0) {
        positionToolbar(rect);
      } else {
        hideToolbar();
      }
    }
  }, { passive: true });

  // Dismiss toolbar on window resize
  window.addEventListener('resize', hideToolbar, { passive: true });

  // Apply highlights to all visible containers
  applyAllVisibleContainers();
}
