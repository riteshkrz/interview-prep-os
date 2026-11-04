/**
 * PracticeWhiteboardModal.js
 * Instant floating practice whiteboard overlay for sketching system architectures,
 * data flows, and component boundaries without leaving the current question or roadmap.
 */

const STORAGE_SKETCH_KEY = 'prep_os_practice_sketch_v1';

export function renderPracticeWhiteboardModal(options = {}) {
  const title = options.title || 'System Design Practice Whiteboard';
  const subtitle = options.subtitle || 'Quick sketch architectures, data flows, and component boundaries';

  return `
    <div id="practice-whiteboard-modal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="relative w-full max-w-[1400px] h-[92vh] max-h-[900px] rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        <!-- HEADER TOOLBAR -->
        <header class="p-3 sm:px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070B14] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          
          <!-- Left: Title & Drill Branding -->
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-700 to-cyan-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <span class="material-symbols-outlined text-[19px]">draw</span>
            </span>
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <h3 class="font-sans text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
                  ${title}
                </h3>
                <span class="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-bold border border-indigo-500/20">
                  DRILL
                </span>
              </div>
              <span class="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                ${subtitle}
              </span>
            </div>
          </div>

          <!-- Center: Drawing Tools Palette -->
          <div class="flex items-center gap-1 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
            <!-- Pen Tool -->
            <button type="button" data-tool="pen" class="pw-tool-btn active p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all flex items-center gap-1 text-[11.5px] font-medium" title="Freehand Pen (P)">
              <span class="material-symbols-outlined text-[17px]">edit</span>
              <span class="hidden md:inline">Pen</span>
            </button>

            <!-- Rectangle Tool (Components) -->
            <button type="button" data-tool="rectangle" class="pw-tool-btn p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all flex items-center gap-1 text-[11.5px] font-medium" title="Service / Component Box (R)">
              <span class="material-symbols-outlined text-[17px]">crop_square</span>
              <span class="hidden md:inline">Box</span>
            </button>

            <!-- Cylinder Tool (Databases/Caches) -->
            <button type="button" data-tool="cylinder" class="pw-tool-btn p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all flex items-center gap-1 text-[11.5px] font-medium" title="Database / Cache Cylinder (D)">
              <span class="material-symbols-outlined text-[17px]">database</span>
              <span class="hidden md:inline">DB</span>
            </button>

            <!-- Arrow Tool -->
            <button type="button" data-tool="arrow" class="pw-tool-btn p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all flex items-center gap-1 text-[11.5px] font-medium" title="Directional Connector (A)">
              <span class="material-symbols-outlined text-[17px]">arrow_right_alt</span>
              <span class="hidden md:inline">Arrow</span>
            </button>

            <!-- Text Tool -->
            <button type="button" data-tool="text" class="pw-tool-btn p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all flex items-center gap-1 text-[11.5px] font-medium" title="Text Label (T)">
              <span class="material-symbols-outlined text-[17px]">title</span>
              <span class="hidden md:inline">Text</span>
            </button>

            <!-- Eraser Tool -->
            <button type="button" data-tool="eraser" class="pw-tool-btn p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center gap-1 text-[11.5px] font-medium" title="Eraser (E)">
              <span class="material-symbols-outlined text-[17px]">ink_eraser</span>
              <span class="hidden md:inline">Eraser</span>
            </button>
          </div>

          <!-- Color Selector & Stroke Width -->
          <div class="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
            <button type="button" data-color="#0F172A" class="pw-color-btn active w-5 h-5 rounded-full bg-slate-900 border-2 border-white dark:border-slate-700 shadow-xs" title="Dark Slate / Black"></button>
            <button type="button" data-color="#6366F1" class="pw-color-btn w-5 h-5 rounded-full bg-indigo-500 border border-white/20 shadow-xs" title="Indigo"></button>
            <button type="button" data-color="#0284C7" class="pw-color-btn w-5 h-5 rounded-full bg-sky-500 border border-white/20 shadow-xs" title="Sky"></button>
            <button type="button" data-color="#10B981" class="pw-color-btn w-5 h-5 rounded-full bg-emerald-500 border border-white/20 shadow-xs" title="Emerald"></button>
            <button type="button" data-color="#F59E0B" class="pw-color-btn w-5 h-5 rounded-full bg-amber-500 border border-white/20 shadow-xs" title="Amber"></button>
            <button type="button" data-color="#F43F5E" class="pw-color-btn w-5 h-5 rounded-full bg-rose-500 border border-white/20 shadow-xs" title="Rose"></button>

            <div class="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

            <button type="button" data-width="1.8" class="pw-width-btn active px-1.5 py-0.5 rounded text-[10.5px] font-mono text-slate-700 dark:text-slate-300 font-bold" title="Thin Line">1x</button>
            <button type="button" data-width="3.2" class="pw-width-btn px-1.5 py-0.5 rounded text-[10.5px] font-mono text-slate-700 dark:text-slate-300 font-bold" title="Medium Line">2x</button>
            <button type="button" data-width="5.0" class="pw-width-btn px-1.5 py-0.5 rounded text-[10.5px] font-mono text-slate-700 dark:text-slate-300 font-bold" title="Thick Line">3x</button>
          </div>

          <!-- Right: Undo, Clear, Full Workspace & Close -->
          <div class="flex items-center gap-1.5">
            <!-- Undo -->
            <button type="button" id="pw-undo-btn" class="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" title="Undo (Ctrl+Z)">
              <span class="material-symbols-outlined text-[18px]">undo</span>
            </button>

            <!-- Clear Canvas -->
            <button type="button" id="pw-clear-btn" class="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors" title="Clear Canvas">
              Clear
            </button>

            <!-- Export PNG -->
            <button type="button" id="pw-export-btn" class="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors" title="Download Image">
              <span class="material-symbols-outlined text-[15px]">download</span>
              <span>Export</span>
            </button>

            <!-- Full Workspace Switcher -->
            <button type="button" id="pw-full-workspace-btn" data-nav-target="whiteboard" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11.5px] font-bold shadow-xs transition-all" title="Open Full Design Studio with 45-Min Timer & Rubric">
              <span class="material-symbols-outlined text-[16px]">open_in_full</span>
              <span class="hidden sm:inline">Full Studio</span>
            </button>

            <!-- Close Modal -->
            <button type="button" id="close-practice-whiteboard-btn" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-1" title="Close Whiteboard (Esc)">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

        </header>

        <!-- CANVAS VIEWPORT -->
        <div id="pw-canvas-container" class="relative flex-1 w-full bg-white dark:bg-[#070B14] overflow-hidden cursor-crosshair">
          <!-- Engineering Grid Background -->
          <div class="absolute inset-0 pointer-events-none opacity-[0.25] dark:opacity-[0.15]" style="background-image: radial-gradient(#64748B 1px, transparent 1px); background-size: 20px 20px;"></div>
          
          <canvas id="practice-whiteboard-canvas" class="relative w-full h-full block"></canvas>

          <!-- Watermark / Pro-Tip Overlay -->
          <div class="absolute bottom-3 left-4 pointer-events-none text-[11px] font-mono text-slate-400/80 dark:text-slate-600 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Sketch Drill &bull; Draw the core architecture in &lt; 60 seconds</span>
          </div>

          <!-- Quick Text Input Overlay (Hidden until Text tool click) -->
          <input type="text" id="pw-text-overlay" class="hidden absolute z-20 px-2 py-1 text-[13px] font-mono font-bold bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded text-slate-900 dark:text-white shadow-lg outline-none" placeholder="Label..."/>
        </div>

      </div>
    </div>
  `;
}

export function initPracticeWhiteboardModal(onClose, onOpenFullWorkspace) {
  const modal = document.getElementById('practice-whiteboard-modal');
  if (!modal) return;

  const canvas = document.getElementById('practice-whiteboard-canvas');
  const container = document.getElementById('pw-canvas-container');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Active Drawing State
  let tool = 'pen';
  let color = document.documentElement.classList.contains('dark') ? '#F8FAFC' : '#0F172A';
  let strokeWidth = 2.2;
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let currentShape = null;

  // History Stack for Undo
  let shapes = [];
  let undoStack = [];

  // Load saved sketch if available
  try {
    const saved = localStorage.getItem(STORAGE_SKETCH_KEY);
    if (saved) {
      shapes = JSON.parse(saved);
    }
  } catch (e) {
    shapes = [];
  }

  // Adjust canvas size for HiDPI displays
  function resize() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);
    redraw();
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 30);

  // Redraw all elements
  function redraw() {
    const rect = container.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    shapes.forEach(shape => drawShape(shape, ctx));

    if (currentShape) {
      drawShape(currentShape, ctx);
    }
  }

  function drawShape(s, targetCtx) {
    targetCtx.save();
    targetCtx.strokeStyle = s.color;
    targetCtx.fillStyle = s.color;
    targetCtx.lineWidth = s.strokeWidth;
    targetCtx.lineCap = 'round';
    targetCtx.lineJoin = 'round';

    if (s.type === 'pen') {
      if (s.points.length < 2) return;
      targetCtx.beginPath();
      targetCtx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        targetCtx.lineTo(s.points[i].x, s.points[i].y);
      }
      targetCtx.stroke();
    } else if (s.type === 'rectangle') {
      const w = s.w;
      const h = s.h;
      targetCtx.strokeRect(s.x, s.y, w, h);
    } else if (s.type === 'cylinder') {
      const rx = Math.abs(s.w) / 2;
      const ry = Math.min(10, Math.abs(s.h) / 4);
      const cx = s.x + rx;
      const topY = s.y + ry;
      const botY = s.y + s.h - ry;

      // Cylinder body
      targetCtx.beginPath();
      targetCtx.moveTo(s.x, topY);
      targetCtx.lineTo(s.x, botY);
      targetCtx.bezierCurveTo(s.x, botY + ry * 1.5, s.x + s.w, botY + ry * 1.5, s.x + s.w, botY);
      targetCtx.lineTo(s.x + s.w, topY);
      targetCtx.stroke();

      // Top ellipse
      targetCtx.beginPath();
      targetCtx.ellipse(cx, topY, rx, ry, 0, 0, Math.PI * 2);
      targetCtx.stroke();
    } else if (s.type === 'arrow') {
      targetCtx.beginPath();
      targetCtx.moveTo(s.x1, s.y1);
      targetCtx.lineTo(s.x2, s.y2);
      targetCtx.stroke();

      // Arrowhead
      const angle = Math.atan2(s.y2 - s.y1, s.x2 - s.x1);
      const headLen = 12;
      targetCtx.beginPath();
      targetCtx.moveTo(s.x2, s.y2);
      targetCtx.lineTo(s.x2 - headLen * Math.cos(angle - Math.PI / 6), s.y2 - headLen * Math.sin(angle - Math.PI / 6));
      targetCtx.lineTo(s.x2 - headLen * Math.cos(angle + Math.PI / 6), s.y2 - headLen * Math.sin(angle + Math.PI / 6));
      targetCtx.closePath();
      targetCtx.fill();
    } else if (s.type === 'text') {
      targetCtx.font = 'bold 14px Geist Mono, monospace';
      targetCtx.fillText(s.text, s.x, s.y);
    }

    targetCtx.restore();
  }

  function saveShapes() {
    try {
      localStorage.setItem(STORAGE_SKETCH_KEY, JSON.stringify(shapes));
    } catch (e) { }
  }

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Pointer Down
  function handleStart(e) {
    if (e.target !== canvas) return;
    const pos = getMousePos(e);
    startX = pos.x;
    startY = pos.y;

    if (tool === 'eraser') {
      // Remove nearest shape
      eraseAt(pos.x, pos.y);
      return;
    }

    if (tool === 'text') {
      promptTextInput(pos.x, pos.y);
      return;
    }

    isDrawing = true;

    if (tool === 'pen') {
      currentShape = {
        type: 'pen',
        color,
        strokeWidth,
        points: [pos]
      };
    } else if (tool === 'rectangle') {
      currentShape = {
        type: 'rectangle',
        color,
        strokeWidth,
        x: startX,
        y: startY,
        w: 0,
        h: 0
      };
    } else if (tool === 'cylinder') {
      currentShape = {
        type: 'cylinder',
        color,
        strokeWidth,
        x: startX,
        y: startY,
        w: 0,
        h: 0
      };
    } else if (tool === 'arrow') {
      currentShape = {
        type: 'arrow',
        color,
        strokeWidth,
        x1: startX,
        y1: startY,
        x2: startX,
        y2: startY
      };
    }
  }

  // Pointer Move
  function handleMove(e) {
    const pos = getMousePos(e);

    if (isDrawing && tool === 'eraser') {
      eraseAt(pos.x, pos.y);
      return;
    }

    if (!isDrawing || !currentShape) return;

    if (tool === 'pen') {
      currentShape.points.push(pos);
    } else if (tool === 'rectangle' || tool === 'cylinder') {
      currentShape.w = pos.x - startX;
      currentShape.h = pos.y - startY;
    } else if (tool === 'arrow') {
      currentShape.x2 = pos.x;
      currentShape.y2 = pos.y;
    }

    redraw();
  }

  // Pointer Up
  function handleEnd() {
    if (!isDrawing) return;
    isDrawing = false;

    if (currentShape) {
      // Validate shape size
      let valid = true;
      if (currentShape.type === 'pen' && currentShape.points.length < 2) valid = false;
      if ((currentShape.type === 'rectangle' || currentShape.type === 'cylinder') && (Math.abs(currentShape.w) < 5 || Math.abs(currentShape.h) < 5)) valid = false;
      if (currentShape.type === 'arrow' && Math.hypot(currentShape.x2 - currentShape.x1, currentShape.y2 - currentShape.y1) < 8) valid = false;

      if (valid) {
        shapes.push(currentShape);
        undoStack = [];
        saveShapes();
      }
      currentShape = null;
      redraw();
    }
  }

  function eraseAt(x, y) {
    const radius = 15;
    const initialLen = shapes.length;
    shapes = shapes.filter(s => {
      if (s.type === 'pen') {
        return !s.points.some(p => Math.hypot(p.x - x, p.y - y) < radius);
      } else if (s.type === 'rectangle' || s.type === 'cylinder') {
        return !(x >= s.x - 5 && x <= s.x + s.w + 5 && y >= s.y - 5 && y <= s.y + s.h + 5);
      } else if (s.type === 'arrow') {
        const d = distToSegment({ x, y }, { x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 });
        return d > radius;
      } else if (s.type === 'text') {
        return Math.hypot(s.x - x, s.y - y) > 25;
      }
      return true;
    });

    if (shapes.length !== initialLen) {
      saveShapes();
      redraw();
    }
  }

  function distToSegment(p, v, w) {
    const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  function promptTextInput(x, y) {
    const textOverlay = document.getElementById('pw-text-overlay');
    if (!textOverlay) return;

    textOverlay.style.left = `${x}px`;
    textOverlay.style.top = `${y}px`;
    textOverlay.style.color = color;
    textOverlay.value = '';
    textOverlay.classList.remove('hidden');
    textOverlay.focus();

    const commit = () => {
      const val = textOverlay.value.trim();
      textOverlay.classList.add('hidden');
      textOverlay.removeEventListener('blur', commit);
      textOverlay.removeEventListener('keydown', handleKey);

      if (val) {
        shapes.push({
          type: 'text',
          color,
          x,
          y: y + 14,
          text: val
        });
        saveShapes();
        redraw();
      }
    };

    const handleKey = (e) => {
      if (e.key === 'Enter') {
        commit();
      } else if (e.key === 'Escape') {
        textOverlay.classList.add('hidden');
        textOverlay.removeEventListener('blur', commit);
        textOverlay.removeEventListener('keydown', handleKey);
      }
    };

    textOverlay.addEventListener('blur', commit);
    textOverlay.addEventListener('keydown', handleKey);
  }

  // Mouse / Touch listeners
  canvas.addEventListener('mousedown', handleStart);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  canvas.addEventListener('touchstart', handleStart, { passive: true });
  window.addEventListener('touchmove', handleMove, { passive: true });
  window.addEventListener('touchend', handleEnd);

  // Tool Switching
  modal.querySelectorAll('.pw-tool-btn').forEach(btn => {
    btn.onclick = () => {
      modal.querySelectorAll('.pw-tool-btn').forEach(b => b.classList.remove('active', 'bg-white', 'dark:bg-slate-800', 'shadow-xs'));
      btn.classList.add('active', 'bg-white', 'dark:bg-slate-800', 'shadow-xs');
      tool = btn.getAttribute('data-tool');
    };
  });

  // Color Switching
  modal.querySelectorAll('.pw-color-btn').forEach(btn => {
    btn.onclick = () => {
      modal.querySelectorAll('.pw-color-btn').forEach(b => b.classList.remove('active', 'ring-2', 'ring-indigo-500'));
      btn.classList.add('active', 'ring-2', 'ring-indigo-500');
      color = btn.getAttribute('data-color');
    };
  });

  // Stroke Width Switching
  modal.querySelectorAll('.pw-width-btn').forEach(btn => {
    btn.onclick = () => {
      modal.querySelectorAll('.pw-width-btn').forEach(b => b.classList.remove('active', 'bg-indigo-600', 'text-white'));
      btn.classList.add('active', 'bg-indigo-600', 'text-white');
      strokeWidth = parseFloat(btn.getAttribute('data-width')) || 2.2;
    };
  });

  // Undo
  const undoBtn = document.getElementById('pw-undo-btn');
  if (undoBtn) {
    undoBtn.onclick = () => {
      if (shapes.length > 0) {
        undoStack.push(shapes.pop());
        saveShapes();
        redraw();
      }
    };
  }

  // Clear
  const clearBtn = document.getElementById('pw-clear-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('Clear practice whiteboard?')) {
        shapes = [];
        undoStack = [];
        saveShapes();
        redraw();
      }
    };
  }

  // Export PNG
  const exportBtn = document.getElementById('pw-export-btn');
  if (exportBtn) {
    exportBtn.onclick = () => {
      const link = document.createElement('a');
      link.download = `practice-whiteboard-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  }

  // Full Workspace Switch
  const fullWorkspaceBtn = document.getElementById('pw-full-workspace-btn');
  if (fullWorkspaceBtn) {
    fullWorkspaceBtn.onclick = (e) => {
      e.preventDefault();
      if (typeof onClose === 'function') onClose();
      if (typeof onOpenFullWorkspace === 'function') onOpenFullWorkspace();
    };
  }

  // Keyboard Shortcuts (P: Pen, R: Rect, D: DB, A: Arrow, T: Text, E: Eraser, Ctrl+Z: Undo)
  const handleShortcuts = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (undoBtn) undoBtn.click();
      return;
    }

    const key = e.key.toLowerCase();
    if (key === 'p') {
      const b = modal.querySelector('[data-tool="pen"]');
      if (b) b.click();
    } else if (key === 'r') {
      const b = modal.querySelector('[data-tool="rectangle"]');
      if (b) b.click();
    } else if (key === 'd') {
      const b = modal.querySelector('[data-tool="cylinder"]');
      if (b) b.click();
    } else if (key === 'a') {
      const b = modal.querySelector('[data-tool="arrow"]');
      if (b) b.click();
    } else if (key === 't') {
      const b = modal.querySelector('[data-tool="text"]');
      if (b) b.click();
    } else if (key === 'e') {
      const b = modal.querySelector('[data-tool="eraser"]');
      if (b) b.click();
    }
  };

  document.addEventListener('keydown', handleShortcuts);

  // Cleanup on close
  return () => {
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousedown', handleStart);
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleEnd);
    canvas.removeEventListener('touchstart', handleStart);
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('touchend', handleEnd);
    document.removeEventListener('keydown', handleShortcuts);
  };
}
