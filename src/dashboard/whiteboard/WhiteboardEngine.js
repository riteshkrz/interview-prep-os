/**
 * System Design Practice Studio - Interactive Engine
 * High-performance, high-DPI Retina canvas engine supporting:
 * - 3 Diagram Modes: Architecture Diagram, Sequence Diagram, Data Model
 * - Full Geometric Architecture Shapes:
 *   * 🗄️ Database Cylinder (3D cylinder with top cap ellipse, curved base, and tier disk rings)
 *   * 🔷 Hexagon (6-sided regular node for microservices, pods, workers)
 *   * ⭕ Circle / Ellipse (Load Balancers, Gateways, Edge Nodes, Users)
 *   * ▭ Service Box (Standard card with accent bar)
 *   * ☁️ Cloud (Public cloud, Internet, external networks with bezier lobes)
 *   * 📨 Queue Buffer (Horizontal FIFO pipe with slot divider marks)
 *   * 🔲 Dashed Subnet / Boundary Box & Solid Container Zone
 * - Smart Connectors:
 *   * ↪️ Bend / Elbow 90° Connector (Orthogonal with smooth rounded corner radius)
 *   * ➡️ Straight Connector
 *   * 〰️ Curved Arc Connector
 *   * Edge Port Snapping & Protocol Badges (HTTPS, gRPC, SQL Query, Async Event, WebSocket)
 * - Multi-selection, move, duplicate, delete, and alignment
 * - Contextual Properties Panel for live shape, color, routing & text editing
 * - 6-Phase 45-minute timed interview drill with dual countdown display
 * - 12-Item candidate self-assessment rubric
 * - Empty canvas welcome experience with 11 real-world question prompts
 * - Reliable autosave with visual status badge & interrupted session recovery
 * - High-res PNG (Fit to Content) and pure vector SVG export
 */

import {
  INTERVIEW_PHASES,
  INTERVIEW_RUBRIC,
  COMPONENT_CATEGORIES,
  SYSTEM_DESIGN_QUESTIONS,
  STARTER_TEMPLATES
} from './whiteboardData.js';

const STORAGE_KEY = 'sysdesign_whiteboard_clean_v5';

export function initWhiteboard(root) {
  if (!root) return;

  const canvas = root.querySelector('#sysdesign-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Flatten component catalog for fast lookup
  const COMPONENT_DEF_MAP = {};
  COMPONENT_CATEGORIES.forEach(cat => {
    cat.components.forEach(comp => {
      COMPONENT_DEF_MAP[comp.id] = { ...comp, category: cat.id };
    });
  });

  // State
  const state = {
    diagramMode: 'architecture', // 'architecture' | 'sequence' | 'datamodel'
    elements: [],
    history: [],
    historyIndex: -1,
    selectedIds: [], // multi-selection support
    activeTool: 'select', // 'select' | 'arrow' | 'bend-arrow' | 'pen' | 'box' | 'sticky' | 'text' | 'eraser'
    currentColor: '#0F172A',
    currentStrokeWidth: 2.2,
    zoom: 1,
    panX: 40,
    panY: 40,
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    isSpacePressed: false,
    isDrawing: false,
    dragElements: [],
    dragOffsets: [],
    dragStartWorld: null,
    dragLastWorld: null,
    hasDragged: false,
    welcomeDismissed: false,
    currentDrawing: null,
    arrowStartPos: null,
    arrowHoverPort: null,
    activePromptId: 'freeform',
    rubricChecked: {},
    selectionBox: null, // marquee selection rect
    autosaveTimer: null
  };

  // 45-Minute Interview Timer State
  const timer = {
    totalSeconds: 45 * 60,
    remainingSeconds: 45 * 60,
    currentPhaseIndex: 0,
    phaseRemainingSeconds: INTERVIEW_PHASES[0].durationMinutes * 60,
    isRunning: false,
    intervalId: null
  };

  // -------------------------------------------------------------
  // COORDINATE UTILITIES
  // -------------------------------------------------------------
  function screenToWorld(sx, sy) {
    return {
      x: (sx - state.panX) / state.zoom,
      y: (sy - state.panY) / state.zoom
    };
  }

  function worldToScreen(wx, wy) {
    return {
      x: wx * state.zoom + state.panX,
      y: wy * state.zoom + state.panY
    };
  }

  // -------------------------------------------------------------
  // CANVAS RESIZING & HiDPI BUFFER
  // -------------------------------------------------------------
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    render();
  }

  // -------------------------------------------------------------
  // AUTOSAVE & PERSISTENCE
  // -------------------------------------------------------------
  function setAutosaveStatus() {
    // No save badge or status option displayed in UI
  }

  function scheduleAutosave() {
    setAutosaveStatus('saving');
    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(() => {
      try {
        const payload = {
          diagramMode: state.diagramMode,
          elements: state.elements,
          activePromptId: state.activePromptId,
          rubricChecked: state.rubricChecked,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setAutosaveStatus('saved');
      } catch (err) {
        console.error('Whiteboard autosave failed:', err);
        setAutosaveStatus('failed');
      }
    }, 400);
  }

  function loadSavedSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.elements)) {
        state.diagramMode = data.diagramMode || 'architecture';
        state.elements = data.elements;
        state.activePromptId = data.activePromptId || 'freeform';
        state.rubricChecked = data.rubricChecked || {};
        state.welcomeDismissed = data.elements.length > 0;
        state.history = [JSON.stringify({
          diagramMode: state.diagramMode,
          elements: state.elements
        })];
        state.historyIndex = 0;
        syncModeTabsUI();
        updateRubricUI();
        updateWelcomeOverlayVisibility();
        return true;
      }
    } catch (e) {
      console.warn('Could not restore whiteboard session:', e);
    }
    return false;
  }

  // -------------------------------------------------------------
  // HISTORY (UNDO / REDO)
  // -------------------------------------------------------------
  function pushHistory() {
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(JSON.stringify({
      diagramMode: state.diagramMode,
      elements: state.elements
    }));
    if (state.history.length > 50) state.history.shift();
    state.historyIndex = state.history.length - 1;
    scheduleAutosave();
    updateWelcomeOverlayVisibility();
  }

  function undo() {
    if (state.historyIndex > 0) {
      state.historyIndex--;
      const snapshot = JSON.parse(state.history[state.historyIndex]);
      state.diagramMode = snapshot.diagramMode || 'architecture';
      state.elements = snapshot.elements || [];
      state.selectedIds = [];
      syncModeTabsUI();
      updatePropertiesPanel();
      render();
      scheduleAutosave();
      updateWelcomeOverlayVisibility();
    }
  }

  function redo() {
    if (state.historyIndex < state.history.length - 1) {
      state.historyIndex++;
      const snapshot = JSON.parse(state.history[state.historyIndex]);
      state.diagramMode = snapshot.diagramMode || 'architecture';
      state.elements = snapshot.elements || [];
      state.selectedIds = [];
      syncModeTabsUI();
      updatePropertiesPanel();
      render();
      scheduleAutosave();
      updateWelcomeOverlayVisibility();
    }
  }

  function dismissWelcome() {
    state.welcomeDismissed = true;
    const welcome = root.querySelector('#wb-welcome-overlay');
    if (welcome) welcome.classList.add('hidden');
  }

  function updateWelcomeOverlayVisibility() {
    const welcome = root.querySelector('#wb-welcome-overlay');
    if (!welcome) return;
    if (state.welcomeDismissed) {
      welcome.classList.add('hidden');
      return;
    }
    if (state.elements.length === 0) {
      welcome.classList.remove('hidden');
    } else {
      welcome.classList.add('hidden');
    }
  }

  // -------------------------------------------------------------
  // COMPONENT PORTS & CONNECTIONS
  // -------------------------------------------------------------
  function getComponentPorts(el) {
    const rx = el.x;
    const ry = el.y;
    const rw = el.w || 154;
    const rh = el.h || 76;
    const shape = el.shape || (el.stencil ? COMPONENT_DEF_MAP[el.stencil]?.shape : 'card');

    if (shape === 'circle') {
      const r = Math.min(rw, rh) / 2;
      const cx = rx + rw / 2;
      const cy = ry + rh / 2;
      return {
        top: { x: cx, y: cy - r, port: 'top' },
        right: { x: cx + r, y: cy, port: 'right' },
        bottom: { x: cx, y: cy + r, port: 'bottom' },
        left: { x: cx - r, y: cy, port: 'left' }
      };
    }

    return {
      top: { x: rx + rw / 2, y: ry, port: 'top' },
      right: { x: rx + rw, y: ry + rh / 2, port: 'right' },
      bottom: { x: rx + rw / 2, y: ry + rh, port: 'bottom' },
      left: { x: rx, y: ry + rh / 2, port: 'left' }
    };
  }

  function findNearestPort(wx, wy, threshold = 28) {
    let nearest = null;
    let minDist = threshold;

    for (const el of state.elements) {
      if (['component', 'box', 'seq_participant', 'table_entity'].includes(el.type)) {
        const ports = getComponentPorts(el);
        for (const [key, p] of Object.entries(ports)) {
          const d = Math.hypot(wx - p.x, wy - p.y);
          if (d < minDist) {
            minDist = d;
            nearest = { elementId: el.id, port: key, x: p.x, y: p.y };
          }
        }
      }
    }
    return nearest;
  }

  function resolveArrowCoordinates(arrow) {
    let x1 = arrow.x1 !== undefined ? arrow.x1 : 0;
    let y1 = arrow.y1 !== undefined ? arrow.y1 : 0;
    let x2 = arrow.x2 !== undefined ? arrow.x2 : 0;
    let y2 = arrow.y2 !== undefined ? arrow.y2 : 0;

    if (arrow.fromId) {
      const fromEl = state.elements.find(e => e.id === arrow.fromId);
      if (fromEl) {
        const ports = getComponentPorts(fromEl);
        const p = ports[arrow.fromPort] || ports.right;
        x1 = p.x;
        y1 = p.y;
      }
    }

    if (arrow.toId) {
      const toEl = state.elements.find(e => e.id === arrow.toId);
      if (toEl) {
        const ports = getComponentPorts(toEl);
        const p = ports[arrow.toPort] || ports.left;
        x2 = p.x;
        y2 = p.y;
      }
    }

    return { x1, y1, x2, y2 };
  }

  // -------------------------------------------------------------
  // RENDERING ENGINE & SHAPES GEOMETRY
  // -------------------------------------------------------------
  function drawCleanWhiteGrid() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // Reset transform & wipe buffer to pure crisp white
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.scale(dpr, dpr);

    // Subtle technical slate dot grid
    const gridSize = 24 * state.zoom;
    const startX = ((state.panX % gridSize) + gridSize) % gridSize;
    const startY = ((state.panY % gridSize) + gridSize) % gridSize;

    ctx.fillStyle = 'rgba(100, 116, 139, 0.22)';
    const dotRadius = Math.max(0.75, 1.05 * state.zoom);

    for (let x = startX; x < w; x += gridSize) {
      for (let y = startY; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function renderSelectionHighlight(x, y, w, h) {
    const rx = Math.min(x, x + w);
    const ry = Math.min(y, y + h);
    const rw = Math.abs(w);
    const rh = Math.abs(h);

    ctx.save();
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(rx - 5, ry - 5, rw + 10, rh + 10);
    ctx.setLineDash([]);

    ctx.fillStyle = '#4F46E5';
    const corners = [
      [rx - 7, ry - 7],
      [rx + rw + 1, ry - 7],
      [rx - 7, ry + rh + 1],
      [rx + rw + 1, ry + rh + 1]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx, cy, 6, 6);
    });
    ctx.restore();
  }

  function renderPorts(el) {
    const ports = getComponentPorts(el);
    ctx.save();
    for (const [key, p] of Object.entries(ports)) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#4F46E5';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- GEOMETRIC SHAPES RENDERERS ---

  // 1. 🗄️ Database Cylinder (3D cylinder with top cap ellipse, curved base, tier rings)
  function drawCylinder(rx, ry, rw, rh, isSelected, color, title, sub, icon) {
    const vertR = Math.min(18, Math.max(10, rh * 0.18));
    const horizR = rw / 2;
    const cx = rx + horizR;
    const topY = ry + vertR;
    const bottomY = ry + rh - vertR;

    ctx.shadowColor = isSelected ? 'rgba(79, 70, 229, 0.2)' : 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = isSelected ? 12 : 6;
    ctx.shadowOffsetY = isSelected ? 3 : 2;

    // Body Path (sides + bottom curved base)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = isSelected ? '#4F46E5' : '#94A3B8';
    ctx.lineWidth = isSelected ? 2.4 : 1.5;

    ctx.beginPath();
    ctx.moveTo(rx, topY);
    ctx.lineTo(rx, bottomY);
    ctx.ellipse(cx, bottomY, horizR, vertR, 0, Math.PI, 0, true);
    ctx.lineTo(rx + rw, topY);
    ctx.ellipse(cx, topY, horizR, vertR, 0, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    // Intermediate disk rings (relational / sharded tiers)
    const tier1 = topY + (bottomY - topY) * 0.35;
    const tier2 = topY + (bottomY - topY) * 0.70;
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.2;
    [tier1, tier2].forEach(ty => {
      ctx.beginPath();
      ctx.ellipse(cx, ty, horizR - 1, vertR - 1, 0, 0, Math.PI);
      ctx.stroke();
    });

    // Top Ellipse Cap
    ctx.fillStyle = color || '#0284C7';
    ctx.beginPath();
    ctx.ellipse(cx, topY, horizR, vertR, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#4F46E5' : '#94A3B8';
    ctx.lineWidth = isSelected ? 2.4 : 1.5;
    ctx.stroke();

    // Top Cap Sheen
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.ellipse(cx, topY, horizR * 0.8, vertR * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Icon & Text centered in cylinder body
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon || '🗄️', cx, topY + (bottomY - topY) * 0.44);

    ctx.font = 'bold 11px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(title || 'Database', cx, topY + (bottomY - topY) * 0.72);

    if (sub) {
      ctx.font = '9px Inter, -apple-system, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(sub, cx, topY + (bottomY - topY) * 0.92);
    }
    ctx.textAlign = 'left';
  }

  // 2. 🔷 Hexagon (6-sided node for microservices, pods, workers)
  function drawHexagon(rx, ry, rw, rh, isSelected, color, title, sub, icon) {
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;
    const p1 = { x: rx + rw * 0.22, y: ry };
    const p2 = { x: rx + rw * 0.78, y: ry };
    const p3 = { x: rx + rw, y: cy };
    const p4 = { x: rx + rw * 0.78, y: ry + rh };
    const p5 = { x: rx + rw * 0.22, y: ry + rh };
    const p6 = { x: rx, y: cy };

    ctx.shadowColor = isSelected ? 'rgba(79, 70, 229, 0.18)' : 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = isSelected ? 12 : 6;
    ctx.shadowOffsetY = isSelected ? 3 : 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = isSelected ? '#4F46E5' : '#94A3B8';
    ctx.lineWidth = isSelected ? 2.4 : 1.5;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p6.x, p6.y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    // Top accent bar
    ctx.fillStyle = color || '#7C3AED';
    ctx.beginPath();
    ctx.roundRect(rx + rw * 0.28, ry + 2.5, rw * 0.44, 3, 1.5);
    ctx.fill();

    // Icon & Text
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon || '🔷', cx, cy - 7);

    ctx.font = 'bold 11px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(title || 'Hexagon Node', cx, cy + 10);

    if (sub) {
      ctx.font = '9px Inter, -apple-system, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(sub, cx, cy + 24);
    }
    ctx.textAlign = 'left';
  }

  // 3. ⭕ Circle / Ellipse (Load Balancers, Edge Nodes, Gateways)
  function drawCircle(rx, ry, rw, rh, isSelected, color, title, sub, icon) {
    const r = Math.min(rw, rh) / 2;
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;

    ctx.shadowColor = isSelected ? 'rgba(79, 70, 229, 0.18)' : 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = isSelected ? 12 : 6;
    ctx.shadowOffsetY = isSelected ? 3 : 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = isSelected ? '#4F46E5' : '#94A3B8';
    ctx.lineWidth = isSelected ? 2.4 : 1.5;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    // Accent curved arc
    ctx.strokeStyle = color || '#059669';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();

    // Icon & Text
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon || '⭕', cx, cy - 7);

    ctx.font = 'bold 10.5px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(title || 'Node', cx, cy + 10);

    if (sub) {
      ctx.font = '8.5px Inter, -apple-system, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(sub, cx, cy + 23);
    }
    ctx.textAlign = 'left';
  }

  // 4. ☁️ Cloud / Network (VPC, Internet, AWS, Public Cloud)
  function drawCloud(rx, ry, rw, rh, isSelected, color, title, sub, icon) {
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;

    ctx.shadowColor = isSelected ? 'rgba(79, 70, 229, 0.18)' : 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = isSelected ? 12 : 6;
    ctx.shadowOffsetY = isSelected ? 3 : 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = isSelected ? '#4F46E5' : '#94A3B8';
    ctx.lineWidth = isSelected ? 2.4 : 1.5;

    ctx.beginPath();
    ctx.moveTo(rx + 20, ry + rh - 14);
    ctx.lineTo(rx + rw - 20, ry + rh - 14);
    ctx.quadraticCurveTo(rx + rw, ry + rh - 14, rx + rw - 4, ry + rh - 28);
    ctx.arc(rx + rw - 24, ry + 36, 18, 0.2, -Math.PI * 0.6, true);
    ctx.arc(cx + 6, ry + 22, 22, -Math.PI * 0.1, -Math.PI * 0.9, true);
    ctx.arc(rx + 26, ry + 34, 18, -Math.PI * 0.4, Math.PI * 0.8, true);
    ctx.quadraticCurveTo(rx, ry + rh - 14, rx + 20, ry + rh - 14);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    // Accent bottom line
    ctx.fillStyle = color || '#0284C7';
    ctx.beginPath();
    ctx.roundRect(cx - 24, ry + rh - 18, 48, 3, 1.5);
    ctx.fill();

    // Icon & Text
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon || '☁️', cx, cy - 3);

    ctx.font = 'bold 11px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(title || 'Cloud', cx, cy + 13);

    if (sub) {
      ctx.font = '9px Inter, -apple-system, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(sub, cx, cy + 25);
    }
    ctx.textAlign = 'left';
  }

  // 5. 📨 Queue Buffer Pipe (FIFO horizontal buffer with slot dividers)
  function drawQueue(rx, ry, rw, rh, isSelected, color, title, sub, icon) {
    ctx.shadowColor = isSelected ? 'rgba(79, 70, 229, 0.18)' : 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = isSelected ? 12 : 6;
    ctx.shadowOffsetY = isSelected ? 3 : 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = isSelected ? '#4F46E5' : '#94A3B8';
    ctx.lineWidth = isSelected ? 2.4 : 1.5;

    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 10);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    // Queue slots vertical divider marks (FIFO stream)
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    for (let sx = rx + 12; sx < rx + 44; sx += 10) {
      ctx.beginPath();
      ctx.moveTo(sx, ry + 6);
      ctx.lineTo(sx, ry + rh - 6);
      ctx.stroke();
    }

    // Right accent band
    ctx.fillStyle = color || '#E11D48';
    ctx.beginPath();
    ctx.roundRect(rx + rw - 7, ry + 4, 3.5, rh - 8, 1.5);
    ctx.fill();

    // Icon & Text
    ctx.font = '16px sans-serif';
    ctx.fillText(icon || '📨', rx + 52, ry + rh / 2 + 5);

    ctx.font = 'bold 11px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(title || 'Queue', rx + 74, ry + rh / 2 - 2);

    if (sub) {
      ctx.font = '9px Inter, -apple-system, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(sub, rx + 74, ry + rh / 2 + 12);
    }
  }

  // 6. ▭ Standard Service Card
  function drawCard(rx, ry, rw, rh, isSelected, color, title, sub, icon) {
    ctx.shadowColor = isSelected ? 'rgba(79, 70, 229, 0.16)' : 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = isSelected ? 12 : 6;
    ctx.shadowOffsetY = isSelected ? 3 : 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = isSelected ? '#4F46E5' : '#CBD5E1';
    ctx.lineWidth = isSelected ? 2.4 : 1.4;

    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 10);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    // Top colored indicator bar
    ctx.fillStyle = color || '#4F46E5';
    ctx.beginPath();
    ctx.roundRect(rx + 8, ry + 3, rw - 16, 3.5, 2);
    ctx.fill();

    // Icon & Name
    ctx.font = '16px sans-serif';
    ctx.fillText(icon || '📦', rx + 12, ry + 32);

    ctx.font = 'bold 12px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(title || 'Component', rx + 36, ry + 32);

    // Subtitle / Tech label
    ctx.font = '10px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(sub || 'Service Tier', rx + 14, ry + 56);
  }

  // 7. 🔲 Solid Container Zone Box
  function drawSolidBox(rx, ry, rw, rh, isSelected, color, title, sub) {
    ctx.fillStyle = 'rgba(248, 250, 252, 0.7)';
    ctx.strokeStyle = color || '#475569';
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 10);
    ctx.fill();
    ctx.stroke();

    // Top Header Banner
    ctx.fillStyle = color || '#475569';
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, 26, [10, 10, 0, 0]);
    ctx.fill();

    ctx.font = 'bold 10.5px monospace, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(title || 'Availability Zone', rx + 10, ry + 17);

    if (sub) {
      ctx.font = '9px monospace, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(sub, rx + 10, ry + 42);
    }
  }

  // --- ELEMENT RENDER DISPATCHER ---
  function renderElement(el) {
    ctx.save();
    const isSelected = state.selectedIds.includes(el.id);

    // 1. Architecture Components & Shapes
    if (el.type === 'component') {
      const rx = el.x;
      const ry = el.y;
      const rw = el.w || 154;
      const rh = el.h || 76;
      const shape = el.shape || (el.stencil ? COMPONENT_DEF_MAP[el.stencil]?.shape : 'card') || 'card';

      if (shape === 'cylinder') {
        drawCylinder(rx, ry, rw, rh, isSelected, el.color, el.title || el.name, el.sub, el.icon);
      } else if (shape === 'hexagon') {
        drawHexagon(rx, ry, rw, rh, isSelected, el.color, el.title || el.name, el.sub, el.icon);
      } else if (shape === 'circle') {
        drawCircle(rx, ry, rw, rh, isSelected, el.color, el.title || el.name, el.sub, el.icon);
      } else if (shape === 'cloud') {
        drawCloud(rx, ry, rw, rh, isSelected, el.color, el.title || el.name, el.sub, el.icon);
      } else if (shape === 'queue') {
        drawQueue(rx, ry, rw, rh, isSelected, el.color, el.title || el.name, el.sub, el.icon);
      } else if (shape === 'solid-box') {
        drawSolidBox(rx, ry, rw, rh, isSelected, el.color, el.title || el.name, el.sub);
      } else {
        drawCard(rx, ry, rw, rh, isSelected, el.color, el.title || el.name, el.sub, el.icon);
      }

      if (isSelected) {
        renderSelectionHighlight(rx, ry, rw, rh);
        renderPorts(el);
      }
    }

    // 2. Connector Arrows (Bend / Orthogonal 90° with rounded corner, Straight, Curved)
    else if (el.type === 'arrow') {
      const coords = resolveArrowCoordinates(el);
      const { x1, y1, x2, y2 } = coords;

      ctx.strokeStyle = el.color || '#2563EB';
      ctx.lineWidth = isSelected ? 3 : (el.width || 2.2);

      if (el.style === 'dashed') {
        ctx.setLineDash([5, 4]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);

      let targetAngle = 0;
      let labelPosX = (x1 + x2) / 2;
      let labelPosY = (y1 + y2) / 2;

      // A. Bend Arrow (Orthogonal 90° with rounded elbow)
      if (el.routing === 'orthogonal') {
        const midX = (x1 + x2) / 2;
        const cornerRadius = Math.min(16, Math.max(0, Math.abs(midX - x1) * 0.7), Math.max(0, Math.abs(y2 - y1) * 0.7));

        if (cornerRadius < 3 || Math.abs(midX - x1) < 6 || Math.abs(y2 - y1) < 6) {
          ctx.lineTo(midX, y1);
          ctx.lineTo(midX, y2);
          ctx.lineTo(x2, y2);
        } else {
          const dirX1 = midX >= x1 ? 1 : -1;
          const dirY = y2 >= y1 ? 1 : -1;
          const dirX2 = x2 >= midX ? 1 : -1;

          ctx.lineTo(midX - dirX1 * cornerRadius, y1);
          ctx.arcTo(midX, y1, midX, y1 + dirY * cornerRadius, cornerRadius);
          ctx.lineTo(midX, y2 - dirY * cornerRadius);
          ctx.arcTo(midX, y2, midX + dirX2 * cornerRadius, y2, cornerRadius);
          ctx.lineTo(x2, y2);
        }
        targetAngle = x2 >= midX ? 0 : Math.PI;
        labelPosX = midX;
        labelPosY = (y1 + y2) / 2;
      }

      // B. Curved Arc Arrow
      else if (el.routing === 'curved') {
        const arcOffsetX = -(y2 - y1) * 0.22;
        const arcOffsetY = (x2 - x1) * 0.22;
        const ctrlX = (x1 + x2) / 2 + arcOffsetX;
        const ctrlY = (y1 + y2) / 2 + arcOffsetY;

        ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
        const dx = x2 - ctrlX;
        const dy = y2 - ctrlY;
        targetAngle = Math.atan2(dy, dx);
        labelPosX = ctrlX;
        labelPosY = ctrlY;
      }

      // C. Straight Arrow
      else {
        ctx.lineTo(x2, y2);
        targetAngle = Math.atan2(y2 - y1, x2 - x1);
      }

      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead at endpoint
      const headlen = 10;
      ctx.fillStyle = el.color || '#2563EB';
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headlen * Math.cos(targetAngle - Math.PI / 7), y2 - headlen * Math.sin(targetAngle - Math.PI / 7));
      ctx.lineTo(x2 - headlen * Math.cos(targetAngle + Math.PI / 7), y2 - headlen * Math.sin(targetAngle + Math.PI / 7));
      ctx.closePath();
      ctx.fill();

      // Protocol Label Badge
      if (el.label) {
        ctx.font = 'bold 10px monospace, sans-serif';
        const txtWidth = ctx.measureText(el.label).width;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = el.color || '#2563EB';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(labelPosX - txtWidth / 2 - 6, labelPosY - 9, txtWidth + 12, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0F172A';
        ctx.fillText(el.label, labelPosX - txtWidth / 2, labelPosY + 4);
      }

      if (isSelected) {
        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(x1 - 4, y1 - 4, 8, 8);
        ctx.fillRect(x2 - 4, y2 - 4, 8, 8);
        if (el.routing === 'orthogonal') {
          const midX = (x1 + x2) / 2;
          ctx.fillRect(midX - 3, y1 - 3, 6, 6);
          ctx.fillRect(midX - 3, y2 - 3, 6, 6);
        } else if (el.routing === 'curved') {
          const arcOffsetX = -(y2 - y1) * 0.22;
          const arcOffsetY = (x2 - x1) * 0.22;
          const ctrlX = (x1 + x2) / 2 + arcOffsetX;
          const ctrlY = (y1 + y2) / 2 + arcOffsetY;
          ctx.fillRect(ctrlX - 3, ctrlY - 3, 6, 6);
        }
      }
    }

    // 3. Subnet / VPC Boundary Box (Dashed)
    else if (el.type === 'box') {
      ctx.fillStyle = 'rgba(241, 245, 249, 0.65)';
      ctx.strokeStyle = el.color || '#94A3B8';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([6, 6]);

      ctx.beginPath();
      ctx.roundRect(el.x, el.y, el.w, el.h, 10);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      if (el.title) {
        ctx.font = 'bold 11px monospace, sans-serif';
        ctx.fillStyle = el.color || '#475569';
        ctx.fillText(el.title, el.x + 10, el.y + 18);
      }

      if (isSelected) renderSelectionHighlight(el.x, el.y, el.w, el.h);
    }

    // 4. Sticky Note (Estimations, Napkin Math & Trade-offs)
    else if (el.type === 'sticky') {
      ctx.shadowColor = 'rgba(15, 23, 42, 0.1)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = el.color || '#FEF08A';
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(el.x, el.y, el.w, el.h, 6);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.stroke();

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#0F172A';
      const lines = (el.text || 'Sticky Note').split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line, el.x + 10, el.y + 20 + i * 16);
      });

      if (isSelected) renderSelectionHighlight(el.x, el.y, el.w, el.h);
    }

    // 5. Text Label
    else if (el.type === 'text') {
      ctx.font = `bold ${el.fontSize || 14}px Inter, sans-serif`;
      ctx.fillStyle = el.color || '#0F172A';
      ctx.fillText(el.text || 'Text', el.x, el.y);

      if (isSelected) {
        const metrics = ctx.measureText(el.text || 'Text');
        renderSelectionHighlight(el.x - 4, el.y - (el.fontSize || 14), metrics.width + 8, (el.fontSize || 14) + 6);
      }
    }

    // 6. Freehand Stroke
    else if (el.type === 'stroke') {
      if (el.points && el.points.length > 1) {
        ctx.strokeStyle = el.color || '#0F172A';
        ctx.lineWidth = el.width || 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      }
    }

    // 7. SEQUENCE DIAGRAM: Participant Lifeline
    else if (el.type === 'seq_participant') {
      const pw = el.w || 130;
      const ph = el.h || 48;
      const lifeLen = el.lifelineLength || 460;
      const centerX = el.x + pw / 2;

      // Vertical dashed lifeline extending downwards
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX, el.y + ph);
      ctx.lineTo(centerX, el.y + ph + lifeLen);
      ctx.stroke();
      ctx.setLineDash([]);

      // Top Actor Box
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = isSelected ? '#4F46E5' : '#64748B';
      ctx.lineWidth = isSelected ? 2.2 : 1.4;
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.roundRect(el.x, el.y, pw, ph, 8);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.stroke();

      // Top color accent
      ctx.fillStyle = el.color || '#4F46E5';
      ctx.beginPath();
      ctx.roundRect(el.x + 6, el.y + 2, pw - 12, 3, 1.5);
      ctx.fill();

      // Participant Title & Subtitle
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.textAlign = 'center';
      ctx.fillText(el.title || 'Participant', centerX, el.y + 22);

      ctx.font = '9.5px Inter, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(el.sub || 'Service', centerX, el.y + 38);
      ctx.textAlign = 'left';

      if (isSelected) {
        renderSelectionHighlight(el.x, el.y, pw, ph + lifeLen);
      }
    }

    // 8. DATA MODEL: Entity Table
    else if (el.type === 'table_entity') {
      const tw = el.w || 190;
      const rowHeight = 22;
      const headerHeight = 32;
      const cols = el.columns || [];
      const th = headerHeight + cols.length * rowHeight + 10;

      ctx.shadowColor = isSelected ? 'rgba(79, 70, 229, 0.16)' : 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = isSelected ? 10 : 5;
      ctx.shadowOffsetY = 2;

      // Table Container
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = isSelected ? '#4F46E5' : '#94A3B8';
      ctx.lineWidth = isSelected ? 2.2 : 1.4;
      ctx.beginPath();
      ctx.roundRect(el.x, el.y, tw, th, 8);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.stroke();

      // Table Header Bar
      ctx.fillStyle = el.color || '#1E293B';
      ctx.beginPath();
      ctx.roundRect(el.x, el.y, tw, headerHeight, [8, 8, 0, 0]);
      ctx.fill();

      // Table Name
      ctx.font = 'bold 11.5px monospace, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`📊 ${el.tableName || 'table_name'}`, el.x + 10, el.y + 20);

      // Columns list
      cols.forEach((col, idx) => {
        const rowY = el.y + headerHeight + idx * rowHeight + 16;
        ctx.font = col.isPk ? 'bold 10px monospace, sans-serif' : '10px monospace, sans-serif';
        ctx.fillStyle = col.isPk ? '#D97706' : '#0F172A';

        const prefix = col.isPk ? '🔑 PK ' : (col.isFk ? '🔗 FK ' : '   ');
        ctx.fillText(`${prefix}${col.name}`, el.x + 8, rowY);

        ctx.fillStyle = '#64748B';
        ctx.font = '9px monospace, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(col.type || 'VARCHAR', el.x + tw - 8, rowY);
        ctx.textAlign = 'left';
      });

      if (isSelected) {
        renderSelectionHighlight(el.x, el.y, tw, th);
        renderPorts(el);
      }
    }

    ctx.restore();
  }

  // Master Render Loop
  function render() {
    drawCleanWhiteGrid();

    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(
      state.zoom * dpr, 0,
      0, state.zoom * dpr,
      state.panX * dpr, state.panY * dpr
    );

    // Render elements
    state.elements.forEach(renderElement);

    // Render currently active drawing (in-progress arrow or box)
    if (state.currentDrawing) {
      renderElement(state.currentDrawing);
    }

    // Render snapping port guide if hovering near a port
    if (state.arrowHoverPort) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(state.arrowHoverPort.x, state.arrowHoverPort.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79, 70, 229, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Render marquee selection rectangle
    if (state.selectionBox) {
      ctx.save();
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.fillRect(state.selectionBox.x, state.selectionBox.y, state.selectionBox.w, state.selectionBox.h);
      ctx.strokeRect(state.selectionBox.x, state.selectionBox.y, state.selectionBox.w, state.selectionBox.h);
      ctx.restore();
    }

    ctx.restore();

    // Update zoom label in UI
    const zoomLabel = root.querySelector('#wb-zoom-level');
    if (zoomLabel) {
      zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
    }
  }

  // -------------------------------------------------------------
  // HIT TESTING
  // -------------------------------------------------------------
  function distToSegment(p, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  function hitTest(wx, wy) {
    for (let i = state.elements.length - 1; i >= 0; i--) {
      const el = state.elements[i];

      // A. Arrow / Connectors (Bend / Orthogonal, Curved Arc, Straight)
      if (el.type === 'arrow') {
        const coords = resolveArrowCoordinates(el);
        const { x1, y1, x2, y2 } = coords;

        if (el.routing === 'orthogonal') {
          const midX = (x1 + x2) / 2;
          const d1 = distToSegment({ x: wx, y: wy }, { x: x1, y: y1 }, { x: midX, y: y1 });
          const d2 = distToSegment({ x: wx, y: wy }, { x: midX, y: y1 }, { x: midX, y: y2 });
          const d3 = distToSegment({ x: wx, y: wy }, { x: midX, y: y2 }, { x: x2, y: y2 });
          if (Math.min(d1, d2, d3) < 20) return el;

          // Check protocol label badge
          const labelX = midX;
          const labelY = (y1 + y2) / 2;
          if (Math.abs(wx - labelX) < 45 && Math.abs(wy - labelY) < 16) return el;
        } else if (el.routing === 'curved') {
          const arcOffsetX = -(y2 - y1) * 0.22;
          const arcOffsetY = (x2 - x1) * 0.22;
          const ctrlX = (x1 + x2) / 2 + arcOffsetX;
          const ctrlY = (y1 + y2) / 2 + arcOffsetY;

          let minDist = Infinity;
          let prevPt = { x: x1, y: y1 };
          for (let step = 1; step <= 8; step++) {
            const t = step / 8;
            const curPt = {
              x: (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * ctrlX + t * t * x2,
              y: (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * ctrlY + t * t * y2
            };
            minDist = Math.min(minDist, distToSegment({ x: wx, y: wy }, prevPt, curPt));
            prevPt = curPt;
          }
          if (minDist < 20) return el;

          if (Math.abs(wx - ctrlX) < 45 && Math.abs(wy - ctrlY) < 16) return el;
        } else {
          // Straight arrow
          const d = distToSegment({ x: wx, y: wy }, { x: x1, y: y1 }, { x: x2, y: y2 });
          if (d < 20) return el;

          const labelX = (x1 + x2) / 2;
          const labelY = (y1 + y2) / 2;
          if (Math.abs(wx - labelX) < 45 && Math.abs(wy - labelY) < 16) return el;
        }
      }

      // B. Architecture Components, Boxes, Sticky Notes, Shapes
      else if (['component', 'box', 'sticky', 'shape'].includes(el.type)) {
        const bx = Math.min(el.x, el.x + (el.w || 0));
        const by = Math.min(el.y, el.y + (el.h || 0));
        const bw = Math.abs(el.w || (el.type === 'sticky' ? 180 : 154));
        const bh = Math.abs(el.h || (el.type === 'sticky' ? 96 : 76));

        if (wx >= bx - 6 && wx <= bx + bw + 6 && wy >= by - 6 && wy <= by + bh + 6) {
          return el;
        }
      }

      // C. Sequence Diagram Participant & Lifeline
      else if (el.type === 'seq_participant') {
        const pw = el.w || 130;
        const ph = (el.h || 48) + (el.lifelineLength || 460);
        if (wx >= el.x - 6 && wx <= el.x + pw + 6 && wy >= el.y - 6 && wy <= el.y + ph + 6) {
          return el;
        }
      }

      // D. Data Model Table Entity
      else if (el.type === 'table_entity') {
        const tw = el.w || 190;
        const th = 32 + (el.columns ? el.columns.length * 22 : 0) + 10;
        if (wx >= el.x - 6 && wx <= el.x + tw + 6 && wy >= el.y - 6 && wy <= el.y + th + 6) {
          return el;
        }
      }

      // E. Text Label
      else if (el.type === 'text') {
        const tw = Math.max(120, (el.text ? el.text.length * 10 : 120));
        const th = (el.fontSize || 14) + 16;
        if (wx >= el.x - 8 && wx <= el.x + tw + 8 && wy >= el.y - th && wy <= el.y + 12) {
          return el;
        }
      }

      // F. Freehand Pen Stroke
      else if (el.type === 'stroke' && Array.isArray(el.points) && el.points.length > 0) {
        if (el.points.length === 1) {
          if (Math.hypot(wx - el.points[0].x, wy - el.points[0].y) < 18) return el;
        } else {
          for (let j = 0; j < el.points.length - 1; j++) {
            const d = distToSegment({ x: wx, y: wy }, el.points[j], el.points[j + 1]);
            if (d < 18) return el;
          }
        }
      }
    }
    return null;
  }

  function getElementsInRect(r) {
    const rx = Math.min(r.x, r.x + r.w);
    const ry = Math.min(r.y, r.y + r.h);
    const rw = Math.abs(r.w);
    const rh = Math.abs(r.h);

    return state.elements.filter(el => {
      if (el.type === 'arrow') {
        const coords = resolveArrowCoordinates(el);
        const inStart = coords.x1 >= rx && coords.x1 <= rx + rw && coords.y1 >= ry && coords.y1 <= ry + rh;
        const inEnd = coords.x2 >= rx && coords.x2 <= rx + rw && coords.y2 >= ry && coords.y2 <= ry + rh;
        const inMid = ((coords.x1 + coords.x2) / 2) >= rx && ((coords.x1 + coords.x2) / 2) <= rx + rw &&
                      ((coords.y1 + coords.y2) / 2) >= ry && ((coords.y1 + coords.y2) / 2) <= ry + rh;
        return inStart || inEnd || inMid;
      } else if (el.type === 'stroke') {
        if (!Array.isArray(el.points)) return false;
        return el.points.some(pt => pt.x >= rx && pt.x <= rx + rw && pt.y >= ry && pt.y <= ry + rh);
      } else {
        const ex = el.x !== undefined ? el.x : (el.x1 || 0);
        const ey = el.y !== undefined ? el.y : (el.y1 || 0);
        const ew = Math.abs(el.w || 60);
        const eh = Math.abs(el.h || 40);
        const bMinX = Math.min(ex, ex + ew);
        const bMaxX = Math.max(ex, ex + ew);
        const bMinY = Math.min(ey, ey + eh);
        const bMaxY = Math.max(ey, ey + eh);
        return !(bMaxX < rx || bMinX > rx + rw || bMaxY < ry || bMinY > ry + rh);
      }
    });
  }

  // -------------------------------------------------------------
  // DUAL TIMER IMPLEMENTATION (Total 45m vs Phase timer)
  // -------------------------------------------------------------
  function formatSeconds(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateTimerUI() {
    const totalEl = root.querySelector('#wb-total-timer-display') || root.querySelector('#wb-timer-display');
    const phaseEl = root.querySelector('#wb-phase-timer-display');
    const phaseNameBadge = root.querySelector('#wb-phase-name-badge');
    const toggleBtn = root.querySelector('#wb-timer-toggle-btn');

    if (totalEl) totalEl.textContent = formatSeconds(timer.remainingSeconds);
    if (phaseEl) phaseEl.textContent = formatSeconds(timer.phaseRemainingSeconds);

    const activePhase = INTERVIEW_PHASES[timer.currentPhaseIndex] || INTERVIEW_PHASES[0];
    if (phaseNameBadge) {
      phaseNameBadge.textContent = `Phase ${timer.currentPhaseIndex + 1}: ${activePhase.name}`;
      phaseNameBadge.style.color = activePhase.color;
    }

    if (toggleBtn) {
      const icon = toggleBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = timer.isRunning ? 'pause' : 'play_arrow';
    }
  }

  function advanceToNextPhase() {
    if (timer.currentPhaseIndex < INTERVIEW_PHASES.length - 1) {
      timer.currentPhaseIndex++;
      const nextPhase = INTERVIEW_PHASES[timer.currentPhaseIndex];
      timer.phaseRemainingSeconds = nextPhase.durationMinutes * 60;
      updateTimerUI();
    } else {
      timer.isRunning = false;
      clearInterval(timer.intervalId);
      updateTimerUI();
      alert('🎉 45-Minute System Design Interview Practice Completed! Check off your self-assessment rubric.');
    }
  }

  function toggleTimer() {
    timer.isRunning = !timer.isRunning;
    if (timer.isRunning) {
      timer.intervalId = setInterval(() => {
        if (timer.remainingSeconds > 0) {
          timer.remainingSeconds--;
          if (timer.phaseRemainingSeconds > 0) {
            timer.phaseRemainingSeconds--;
          } else {
            const nextIndex = timer.currentPhaseIndex + 1;
            if (nextIndex < INTERVIEW_PHASES.length) {
              advanceToNextPhase();
            }
          }
          updateTimerUI();
        } else {
          clearInterval(timer.intervalId);
          timer.isRunning = false;
          updateTimerUI();
        }
      }, 1000);
    } else {
      clearInterval(timer.intervalId);
    }
    updateTimerUI();
  }

  function resetTimer() {
    clearInterval(timer.intervalId);
    timer.isRunning = false;
    timer.totalSeconds = 45 * 60;
    timer.remainingSeconds = 45 * 60;
    timer.currentPhaseIndex = 0;
    timer.phaseRemainingSeconds = INTERVIEW_PHASES[0].durationMinutes * 60;
    updateTimerUI();
  }

  // -------------------------------------------------------------
  // CONTEXTUAL PROPERTIES PANEL
  // -------------------------------------------------------------
  function updatePropertiesPanel() {
    const panel = root.querySelector('#wb-properties-panel');
    const form = root.querySelector('#wb-properties-form');
    const heading = root.querySelector('#wb-prop-heading');
    if (!panel || !form) return;

    if (state.selectedIds.length !== 1) {
      panel.classList.add('hidden');
      return;
    }

    const el = state.elements.find(e => e.id === state.selectedIds[0]);
    if (!el) {
      panel.classList.add('hidden');
      return;
    }

    panel.classList.remove('hidden');

    if (el.type === 'component') {
      const currentShape = el.shape || (el.stencil ? COMPONENT_DEF_MAP[el.stencil]?.shape : 'card') || 'card';
      if (heading) heading.textContent = 'Component & Shape';
      form.innerHTML = `
        <div class="flex flex-col gap-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Component Title</label>
          <input type="text" id="prop-input-title" value="${escapeHtml(el.title || '')}" class="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Sub / Technology</label>
          <input type="text" id="prop-input-sub" value="${escapeHtml(el.sub || '')}" class="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
        </div>
        <div class="flex flex-col gap-1 mt-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Shape Geometry</label>
          <select id="prop-component-shape" class="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 cursor-pointer">
            <option value="card" ${currentShape === 'card' ? 'selected' : ''}>Service Box (Card)</option>
            <option value="cylinder" ${currentShape === 'cylinder' ? 'selected' : ''}>Database Cylinder (3D)</option>
            <option value="hexagon" ${currentShape === 'hexagon' ? 'selected' : ''}>Hexagon Service</option>
            <option value="circle" ${currentShape === 'circle' ? 'selected' : ''}>Circle / Round Node</option>
            <option value="cloud" ${currentShape === 'cloud' ? 'selected' : ''}>Cloud / Network</option>
            <option value="queue" ${currentShape === 'queue' ? 'selected' : ''}>Queue Buffer (Pipe)</option>
            <option value="solid-box" ${currentShape === 'solid-box' ? 'selected' : ''}>Solid Container Zone</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 mt-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Accent Color</label>
          <input type="color" id="prop-input-color" value="${el.color || '#4F46E5'}" class="w-full h-7 rounded border border-slate-300 cursor-pointer" />
        </div>
      `;

      const titleInput = form.querySelector('#prop-input-title');
      const subInput = form.querySelector('#prop-input-sub');
      const shapeSelect = form.querySelector('#prop-component-shape');
      const colorInput = form.querySelector('#prop-input-color');

      if (titleInput) {
        titleInput.oninput = (e) => {
          el.title = e.target.value;
          render();
          scheduleAutosave();
        };
      }
      if (subInput) {
        subInput.oninput = (e) => {
          el.sub = e.target.value;
          render();
          scheduleAutosave();
        };
      }
      if (shapeSelect) {
        shapeSelect.onchange = (e) => {
          el.shape = e.target.value;
          render();
          scheduleAutosave();
        };
      }
      if (colorInput) {
        colorInput.oninput = (e) => {
          el.color = e.target.value;
          render();
          scheduleAutosave();
        };
      }
    } else if (el.type === 'arrow') {
      if (heading) heading.textContent = 'Connector Arrow';
      const curRouting = el.routing || 'straight';
      form.innerHTML = `
        <div class="flex flex-col gap-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Routing Type</label>
          <div class="grid grid-cols-3 gap-1">
            <button type="button" data-route="orthogonal" class="prop-route-btn px-2 py-1 rounded text-[10px] font-medium border ${curRouting === 'orthogonal' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-[#141C2E] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'} cursor-pointer flex items-center justify-center gap-0.5">
              <span class="material-symbols-outlined text-[13px]">alt_route</span>
              <span>Bend (90°)</span>
            </button>
            <button type="button" data-route="straight" class="prop-route-btn px-2 py-1 rounded text-[10px] font-medium border ${curRouting !== 'orthogonal' && curRouting !== 'curved' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-[#141C2E] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'} cursor-pointer flex items-center justify-center gap-0.5">
              <span class="material-symbols-outlined text-[13px]">arrow_right_alt</span>
              <span>Straight</span>
            </button>
            <button type="button" data-route="curved" class="prop-route-btn px-2 py-1 rounded text-[10px] font-medium border ${curRouting === 'curved' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-[#141C2E] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'} cursor-pointer flex items-center justify-center gap-0.5">
              <span class="material-symbols-outlined text-[13px]">gesture</span>
              <span>Curved</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1 mt-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Protocol / Label</label>
          <input type="text" id="prop-arrow-label" value="${escapeHtml(el.label || '')}" class="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100" placeholder="e.g. HTTPS, gRPC, SQL" />
        </div>
        <div class="flex flex-wrap gap-1">
          ${['HTTPS', 'gRPC', 'SQL Query', 'Async Event', 'WebSocket', 'TCP'].map(p => `
            <button type="button" class="prop-preset-label px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer">${p}</button>
          `).join('')}
        </div>
        <div class="flex flex-col gap-1 mt-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Line Style</label>
          <select id="prop-arrow-style" class="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-slate-700">
            <option value="solid" ${el.style !== 'dashed' ? 'selected' : ''}>Solid Line</option>
            <option value="dashed" ${el.style === 'dashed' ? 'selected' : ''}>Dashed Line</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 mt-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Connector Color</label>
          <input type="color" id="prop-arrow-color" value="${el.color || '#2563EB'}" class="w-full h-7 rounded border border-slate-300 cursor-pointer" />
        </div>
      `;

      form.querySelectorAll('.prop-route-btn').forEach(btn => {
        btn.onclick = () => {
          el.routing = btn.getAttribute('data-route');
          render();
          scheduleAutosave();
          updatePropertiesPanel();
        };
      });

      const labelInput = form.querySelector('#prop-arrow-label');
      const styleSelect = form.querySelector('#prop-arrow-style');
      const colorInput = form.querySelector('#prop-arrow-color');

      if (labelInput) {
        labelInput.oninput = (e) => {
          el.label = e.target.value;
          render();
          scheduleAutosave();
        };
      }
      form.querySelectorAll('.prop-preset-label').forEach(btn => {
        btn.onclick = () => {
          el.label = btn.textContent.trim();
          if (labelInput) labelInput.value = el.label;
          render();
          scheduleAutosave();
        };
      });
      if (styleSelect) {
        styleSelect.onchange = (e) => {
          el.style = e.target.value;
          render();
          scheduleAutosave();
        };
      }
      if (colorInput) {
        colorInput.oninput = (e) => {
          el.color = e.target.value;
          render();
          scheduleAutosave();
        };
      }
    } else if (el.type === 'seq_participant') {
      if (heading) heading.textContent = 'Sequence Actor';
      form.innerHTML = `
        <div class="flex flex-col gap-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Actor Name</label>
          <input type="text" id="prop-seq-title" value="${escapeHtml(el.title || '')}" class="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-slate-700" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Role / Subtitle</label>
          <input type="text" id="prop-seq-sub" value="${escapeHtml(el.sub || '')}" class="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-slate-700" />
        </div>
      `;
      const titleInput = form.querySelector('#prop-seq-title');
      const subInput = form.querySelector('#prop-seq-sub');
      if (titleInput) titleInput.oninput = (e) => { el.title = e.target.value; render(); scheduleAutosave(); };
      if (subInput) subInput.oninput = (e) => { el.sub = e.target.value; render(); scheduleAutosave(); };
    } else if (el.type === 'table_entity') {
      if (heading) heading.textContent = 'Data Table';
      form.innerHTML = `
        <div class="flex flex-col gap-1">
          <label class="text-[10.5px] font-semibold text-slate-500">Table Name</label>
          <input type="text" id="prop-table-name" value="${escapeHtml(el.tableName || '')}" class="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-[#141C2E] border border-slate-300 dark:border-slate-700 font-mono" />
        </div>
        <div class="flex flex-col gap-1 mt-1">
          <div class="flex items-center justify-between">
            <label class="text-[10.5px] font-semibold text-slate-500">Columns</label>
            <button type="button" id="prop-add-col-btn" class="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer">+ Add Field</button>
          </div>
          <div class="text-[10px] text-slate-500">${(el.columns || []).length} fields configured</div>
        </div>
      `;
      const nameInput = form.querySelector('#prop-table-name');
      const addColBtn = form.querySelector('#prop-add-col-btn');
      if (nameInput) nameInput.oninput = (e) => { el.tableName = e.target.value; render(); scheduleAutosave(); };
      if (addColBtn) {
        addColBtn.onclick = () => {
          const colName = prompt('Enter Column Name:', 'created_at');
          if (colName) {
            el.columns = el.columns || [];
            el.columns.push({ name: colName, type: 'TIMESTAMP', isPk: false });
            pushHistory();
            render();
            updatePropertiesPanel();
          }
        };
      }
    } else {
      panel.classList.add('hidden');
    }
  }

  // -------------------------------------------------------------
  // SELECTION ACTIONS & EDITING HELPERS
  // -------------------------------------------------------------
  function deleteSelectedElements() {
    if (state.selectedIds.length === 0) return;
    const toDeleteSet = new Set(state.selectedIds);
    state.elements = state.elements.filter(el => !toDeleteSet.has(el.id));

    // Gracefully detach any remaining arrows pointing to deleted elements
    state.elements.forEach(el => {
      if (el.type === 'arrow') {
        if (el.fromId && toDeleteSet.has(el.fromId)) {
          const coords = resolveArrowCoordinates(el);
          el.x1 = coords.x1;
          el.y1 = coords.y1;
          el.fromId = null;
        }
        if (el.toId && toDeleteSet.has(el.toId)) {
          const coords = resolveArrowCoordinates(el);
          el.x2 = coords.x2;
          el.y2 = coords.y2;
          el.toId = null;
        }
      }
    });

    state.selectedIds = [];
    pushHistory();
    updatePropertiesPanel();
    render();
  }

  function duplicateSelectedElements() {
    if (state.selectedIds.length === 0) return;
    const toDup = state.elements.filter(el => state.selectedIds.includes(el.id));
    const newIds = [];
    toDup.forEach(el => {
      const clone = JSON.parse(JSON.stringify(el));
      clone.id = `${el.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      if (clone.x !== undefined) clone.x += 24;
      if (clone.y !== undefined) clone.y += 24;
      if (clone.x1 !== undefined) { clone.x1 += 24; clone.x2 += 24; }
      if (clone.y1 !== undefined) { clone.y1 += 24; clone.y2 += 24; }
      if (Array.isArray(clone.points)) {
        clone.points = clone.points.map(pt => ({ x: pt.x + 24, y: pt.y + 24 }));
      }
      state.elements.push(clone);
      newIds.push(clone.id);
    });
    state.selectedIds = newIds;
    pushHistory();
    render();
    updatePropertiesPanel();
  }

  // -------------------------------------------------------------
  // ZOOM & VIEWPORT CONTROLS
  // -------------------------------------------------------------
  function applyZoom(factor, centerX, centerY) {
    const rect = canvas.getBoundingClientRect();
    const cx = centerX !== undefined ? centerX : rect.width / 2;
    const cy = centerY !== undefined ? centerY : rect.height / 2;
    const newZoom = Math.min(Math.max(state.zoom * factor, 0.25), 3.5);
    state.panX = cx - (cx - state.panX) * (newZoom / state.zoom);
    state.panY = cy - (cy - state.panY) * (newZoom / state.zoom);
    state.zoom = newZoom;
    render();
  }

  function resetView() {
    state.zoom = 1;
    state.panX = 40;
    state.panY = 40;
    render();
  }

  // -------------------------------------------------------------
  // FIT TO CONTENT & BOUNDING BOX
  // -------------------------------------------------------------
  function getContentBoundingBox(padding = 40) {
    if (state.elements.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    state.elements.forEach(el => {
      if (el.type === 'arrow') {
        const coords = resolveArrowCoordinates(el);
        minX = Math.min(minX, coords.x1, coords.x2);
        minY = Math.min(minY, coords.y1, coords.y2);
        maxX = Math.max(maxX, coords.x1, coords.x2);
        maxY = Math.max(maxY, coords.y1, coords.y2);
      } else if (el.type === 'stroke') {
        if (Array.isArray(el.points) && el.points.length > 0) {
          el.points.forEach(pt => {
            minX = Math.min(minX, pt.x);
            minY = Math.min(minY, pt.y);
            maxX = Math.max(maxX, pt.x);
            maxY = Math.max(maxY, pt.y);
          });
        }
      } else if (el.type === 'seq_participant') {
        const pw = el.w || 130;
        const ph = (el.h || 48) + (el.lifelineLength || 460);
        minX = Math.min(minX, el.x || 0);
        minY = Math.min(minY, el.y || 0);
        maxX = Math.max(maxX, (el.x || 0) + pw);
        maxY = Math.max(maxY, (el.y || 0) + ph);
      } else if (el.type === 'table_entity') {
        const tw = el.w || 190;
        const th = 32 + (el.columns ? el.columns.length * 22 : 0) + 10;
        minX = Math.min(minX, el.x || 0);
        minY = Math.min(minY, el.y || 0);
        maxX = Math.max(maxX, (el.x || 0) + tw);
        maxY = Math.max(maxY, (el.y || 0) + th);
      } else {
        const ex = el.x !== undefined ? el.x : (el.x1 || 0);
        const ey = el.y !== undefined ? el.y : (el.y1 || 0);
        const ew = Math.abs(el.w || 154);
        const eh = Math.abs(el.h || 76);
        minX = Math.min(minX, ex);
        minY = Math.min(minY, ey);
        maxX = Math.max(maxX, ex + ew);
        maxY = Math.max(maxY, ey + eh);
      }
    });

    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
      return null;
    }

    return {
      x: minX - padding,
      y: minY - padding,
      w: (maxX - minX) + padding * 2,
      h: (maxY - minY) + padding * 2
    };
  }

  function fitViewToContent() {
    const bbox = getContentBoundingBox(60);
    if (!bbox) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / bbox.w;
    const scaleY = rect.height / bbox.h;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.35), 2.2);

    state.zoom = newZoom;
    state.panX = rect.width / 2 - (bbox.x + bbox.w / 2) * newZoom;
    state.panY = rect.height / 2 - (bbox.y + bbox.h / 2) * newZoom;
    render();
  }

  // -------------------------------------------------------------
  // EXPORT FUNCTIONS: PNG (Fit to Content) & Vector SVG
  // -------------------------------------------------------------
  function exportAsPngFit() {
    state.selectedIds = [];
    render();

    const bbox = getContentBoundingBox(40);
    if (!bbox) {
      alert('Whiteboard is empty! Place some components before exporting.');
      return;
    }

    const link = document.createElement('a');
    const sanitizedTitle = (state.activePromptId || 'system-design').replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    link.download = `${sanitizedTitle}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }

  function exportAsSvg() {
    state.selectedIds = [];
    render();

    const bbox = getContentBoundingBox(40) || { x: 0, y: 0, w: 1200, h: 800 };
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bbox.x} ${bbox.y} ${bbox.w} ${bbox.h}" width="${bbox.w}" height="${bbox.h}">\n`;
    svgContent += `  <rect x="${bbox.x}" y="${bbox.y}" width="${bbox.w}" height="${bbox.h}" fill="#FFFFFF"/>\n`;

    state.elements.forEach(el => {
      const shape = el.shape || (el.stencil ? COMPONENT_DEF_MAP[el.stencil]?.shape : 'card') || 'card';

      if (el.type === 'component') {
        const rx = el.x;
        const ry = el.y;
        const rw = el.w || 154;
        const rh = el.h || 76;
        const color = el.color || '#4F46E5';

        if (shape === 'cylinder') {
          const vertR = Math.min(18, Math.max(10, rh * 0.18));
          const horizR = rw / 2;
          const cx = rx + horizR;
          const topY = ry + vertR;
          const bottomY = ry + rh - vertR;
          svgContent += `  <g id="${el.id}">\n`;
          svgContent += `    <path d="M ${rx} ${topY} L ${rx} ${bottomY} A ${horizR} ${vertR} 0 0 0 ${rx + rw} ${bottomY} L ${rx + rw} ${topY} Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5"/>\n`;
          svgContent += `    <ellipse cx="${cx}" cy="${topY}" rx="${horizR}" ry="${vertR}" fill="${color}" stroke="#94A3B8" stroke-width="1.5"/>\n`;
          svgContent += `    <text x="${cx}" y="${topY + (bottomY - topY) * 0.5}" font-family="sans-serif" font-size="14" text-anchor="middle">${el.icon || '🗄️'}</text>\n`;
          svgContent += `    <text x="${cx}" y="${topY + (bottomY - topY) * 0.76}" font-family="sans-serif" font-size="11.5" font-weight="bold" fill="#0F172A" text-anchor="middle">${escapeXml(el.title || el.name || 'DB')}</text>\n`;
          svgContent += `  </g>\n`;
        } else if (shape === 'hexagon') {
          const cx = rx + rw / 2;
          const cy = ry + rh / 2;
          const pts = `${rx + rw * 0.22},${ry} ${rx + rw * 0.78},${ry} ${rx + rw},${cy} ${rx + rw * 0.78},${ry + rh} ${rx + rw * 0.22},${ry + rh} ${rx},${cy}`;
          svgContent += `  <g id="${el.id}">\n`;
          svgContent += `    <polygon points="${pts}" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5"/>\n`;
          svgContent += `    <rect x="${rx + rw * 0.28}" y="${ry + 3}" width="${rw * 0.44}" height="3" rx="1.5" fill="${color}"/>\n`;
          svgContent += `    <text x="${cx}" y="${cy - 6}" font-family="sans-serif" font-size="14" text-anchor="middle">${el.icon || '🔷'}</text>\n`;
          svgContent += `    <text x="${cx}" y="${cy + 12}" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">${escapeXml(el.title || el.name || 'Service')}</text>\n`;
          svgContent += `  </g>\n`;
        } else if (shape === 'circle') {
          const r = Math.min(rw, rh) / 2;
          const cx = rx + rw / 2;
          const cy = ry + rh / 2;
          svgContent += `  <g id="${el.id}">\n`;
          svgContent += `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5"/>\n`;
          svgContent += `    <text x="${cx}" y="${cy - 6}" font-family="sans-serif" font-size="14" text-anchor="middle">${el.icon || '⭕'}</text>\n`;
          svgContent += `    <text x="${cx}" y="${cy + 12}" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#0F172A" text-anchor="middle">${escapeXml(el.title || el.name || 'Node')}</text>\n`;
          svgContent += `  </g>\n`;
        } else {
          svgContent += `  <g id="${el.id}">\n`;
          svgContent += `    <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>\n`;
          svgContent += `    <rect x="${rx + 8}" y="${ry + 3}" width="${rw - 16}" height="3" rx="1.5" fill="${color}"/>\n`;
          svgContent += `    <text x="${rx + 14}" y="${ry + 32}" font-family="sans-serif" font-size="14">${el.icon || '📦'}</text>\n`;
          svgContent += `    <text x="${rx + 36}" y="${ry + 32}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0F172A">${escapeXml(el.title || el.name || 'Component')}</text>\n`;
          svgContent += `    <text x="${rx + 14}" y="${ry + 56}" font-family="sans-serif" font-size="10.5" fill="#64748B">${escapeXml(el.sub || 'Service Tier')}</text>\n`;
          svgContent += `  </g>\n`;
        }
      } else if (el.type === 'arrow') {
        const coords = resolveArrowCoordinates(el);
        const strokeDash = el.style === 'dashed' ? ' stroke-dasharray="5,4"' : '';
        svgContent += `  <g id="${el.id}">\n`;
        if (el.routing === 'orthogonal') {
          const midX = (coords.x1 + coords.x2) / 2;
          svgContent += `    <path d="M ${coords.x1} ${coords.y1} L ${midX} ${coords.y1} L ${midX} ${coords.y2} L ${coords.x2} ${coords.y2}" fill="none" stroke="${el.color || '#2563EB'}" stroke-width="${el.width || 2.2}"${strokeDash}/>\n`;
        } else {
          svgContent += `    <line x1="${coords.x1}" y1="${coords.y1}" x2="${coords.x2}" y2="${coords.y2}" stroke="${el.color || '#2563EB'}" stroke-width="${el.width || 2.2}"${strokeDash}/>\n`;
        }
        if (el.label) {
          const mx = (coords.x1 + coords.x2) / 2;
          const my = (coords.y1 + coords.y2) / 2;
          svgContent += `    <rect x="${mx - 30}" y="${my - 9}" width="60" height="18" rx="4" fill="#FFFFFF" stroke="${el.color || '#2563EB'}" stroke-width="1"/>\n`;
          svgContent += `    <text x="${mx}" y="${my + 4}" font-family="monospace" font-size="10" font-weight="bold" fill="#0F172A" text-anchor="middle">${escapeXml(el.label)}</text>\n`;
        }
        svgContent += `  </g>\n`;
      } else if (el.type === 'box') {
        svgContent += `  <rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" rx="10" fill="rgba(241, 245, 249, 0.65)" stroke="${el.color || '#94A3B8'}" stroke-width="1.8" stroke-dasharray="6,6"/>\n`;
        if (el.title) {
          svgContent += `  <text x="${el.x + 10}" y="${el.y + 18}" font-family="monospace" font-size="11" font-weight="bold" fill="${el.color || '#475569'}">${escapeXml(el.title)}</text>\n`;
        }
      } else if (el.type === 'sticky') {
        svgContent += `  <rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" rx="6" fill="${el.color || '#FEF08A'}" stroke="rgba(0,0,0,0.12)"/>\n`;
        const lines = (el.text || '').split('\n');
        lines.forEach((l, i) => {
          svgContent += `  <text x="${el.x + 10}" y="${el.y + 20 + i * 16}" font-family="sans-serif" font-size="11" fill="#0F172A">${escapeXml(l)}</text>\n`;
        });
      }
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    const sanitizedTitle = (state.activePromptId || 'system-design').replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    link.download = `${sanitizedTitle}-${new Date().toISOString().slice(0, 10)}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }

  // -------------------------------------------------------------
  // INSERTING CUSTOM ARCHITECTURE SHAPES & STENCILS
  // -------------------------------------------------------------
  function addShapeToCenter(shapeType) {
    const rect = canvas.getBoundingClientRect();
    const pos = screenToWorld(rect.width / 2, rect.height / 2);

    const defs = {
      cylinder: { title: 'SQL Database', sub: 'PostgreSQL ACID', icon: '🗄️', color: '#0284C7', w: 140, h: 92 },
      hexagon: { title: 'Microservice', sub: 'Stateless Service', icon: '🔷', color: '#7C3AED', w: 140, h: 90 },
      circle: { title: 'Load Balancer', sub: 'L4/L7 ALB Round-Robin', icon: '⭕', color: '#059669', w: 100, h: 100 },
      card: { title: 'App Service', sub: 'Stateless API Fleet', icon: '▭', color: '#2563EB', w: 154, h: 76 },
      cloud: { title: 'Cloud Network', sub: 'AWS us-east-1 VPC', icon: '☁️', color: '#0284C7', w: 160, h: 96 },
      queue: { title: 'Kafka Stream', sub: 'FIFO Partition Log', icon: '📨', color: '#E11D48', w: 160, h: 68 },
      'dashed-box': { title: 'VPC Subnet', sub: 'Private Subnet 10.0.0.0/16', icon: '🔲', color: '#64748B', w: 200, h: 120, isBoundary: true },
      'solid-box': { title: 'Availability Zone', sub: 'Isolated Failover Domain', icon: '📦', color: '#475569', w: 200, h: 120, isBoundary: true }
    };

    const def = defs[shapeType] || defs.card;
    const newEl = {
      id: `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: def.isBoundary ? 'box' : 'component',
      shape: shapeType,
      stencil: `shape-${shapeType}`,
      x: Math.round(pos.x - def.w / 2),
      y: Math.round(pos.y - def.h / 2),
      w: def.w,
      h: def.h,
      title: def.title,
      sub: def.sub,
      icon: def.icon,
      color: def.color
    };

    state.elements.push(newEl);
    state.selectedIds = [newEl.id];
    pushHistory();
    updatePropertiesPanel();
    render();
  }

  function addComponentToCenter(compDefId, customWorldPos = null) {
    const compDef = COMPONENT_DEF_MAP[compDefId] || COMPONENT_DEF_MAP['microservice'] || {
      id: compDefId,
      name: 'Service',
      icon: '⚙️',
      color: '#2563EB',
      sub: 'Stateless Service'
    };

    let pos = customWorldPos;
    if (!pos) {
      const rect = canvas.getBoundingClientRect();
      pos = screenToWorld(rect.width / 2, rect.height / 2);
      pos.x -= (compDef.w || 154) / 2;
      pos.y -= (compDef.h || 76) / 2;
    }

    const newEl = {
      id: `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: compDef.isBoundary ? 'box' : 'component',
      shape: compDef.shape || 'card',
      stencil: compDef.id,
      x: Math.round(pos.x),
      y: Math.round(pos.y),
      w: compDef.w || 154,
      h: compDef.h || 76,
      title: compDef.name,
      sub: compDef.sub,
      icon: compDef.icon,
      color: compDef.color
    };

    state.elements.push(newEl);
    state.selectedIds = [newEl.id];
    pushHistory();
    updatePropertiesPanel();
    render();

    const panel = root.querySelector('#wb-stencils-panel');
    if (panel) panel.classList.add('hidden');
  }

  // -------------------------------------------------------------
  // STARTER TEMPLATES LOADER
  // -------------------------------------------------------------
  function loadStarterTemplate(templateId) {
    dismissWelcome();
    state.selectedIds = [];
    state.panX = 50;
    state.panY = 50;
    state.zoom = 1;

    if (templateId === 'blank') {
      state.elements = [];
      state.diagramMode = 'architecture';
      pushHistory();
      render();
      syncModeTabsUI();
      return;
    }

    if (templateId === '3tier') {
      state.diagramMode = 'architecture';
      state.elements = [
        { id: 't-1', type: 'component', shape: 'card', stencil: 'web-client', x: 60, y: 160, w: 154, h: 76, title: 'Web & Mobile Apps', sub: 'React / iOS Clients', icon: '💻', color: '#0284C7' },
        { id: 't-2', type: 'component', shape: 'card', stencil: 'cdn', x: 270, y: 160, w: 154, h: 76, title: 'Edge CDN', sub: 'Cloudflare / Edge', icon: '⚡', color: '#D97706' },
        { id: 't-3', type: 'component', shape: 'circle', stencil: 'load-balancer', x: 480, y: 148, w: 104, h: 104, title: 'Load Balancer', sub: 'AWS ALB L7', icon: '⚖️', color: '#4F46E5' },
        { id: 't-4', type: 'component', shape: 'hexagon', stencil: 'api-gateway', x: 650, y: 152, w: 140, h: 92, title: 'API Gateway', sub: 'Auth & Rate Limit', icon: '🛡️', color: '#7C3AED' },
        { id: 't-5', type: 'component', shape: 'card', stencil: 'microservice', x: 860, y: 160, w: 154, h: 76, title: 'App Servers (Fleet)', sub: 'Stateless Go / Node', icon: '⚙️', color: '#2563EB' },
        { id: 't-6', type: 'component', shape: 'cylinder', stencil: 'redis-cache', x: 1080, y: 70, w: 140, h: 92, title: 'Redis Cache', sub: '80/20 In-Memory', icon: '⚡', color: '#059669' },
        { id: 't-7', type: 'component', shape: 'cylinder', stencil: 'sqldb', x: 1080, y: 230, w: 140, h: 92, title: 'PostgreSQL Primary', sub: 'ACID / Sharded DB', icon: '🗄️', color: '#0284C7' },
        { id: 't-a1', type: 'arrow', fromId: 't-1', fromPort: 'right', toId: 't-2', toPort: 'left', x1: 214, y1: 198, x2: 270, y2: 198, label: 'HTTPS', routing: 'straight', color: '#0284C7' },
        { id: 't-a2', type: 'arrow', fromId: 't-2', fromPort: 'right', toId: 't-3', toPort: 'left', x1: 424, y1: 198, x2: 480, y2: 200, label: 'Origin Pull', routing: 'straight', color: '#D97706' },
        { id: 't-a3', type: 'arrow', fromId: 't-3', fromPort: 'right', toId: 't-4', toPort: 'left', x1: 584, y1: 200, x2: 650, y2: 198, label: 'Round-Robin', routing: 'straight', color: '#4F46E5' },
        { id: 't-a4', type: 'arrow', fromId: 't-4', fromPort: 'right', toId: 't-5', toPort: 'left', x1: 790, y1: 198, x2: 860, y2: 198, label: 'Internal RPC', routing: 'straight', color: '#7C3AED' },
        { id: 't-a5', type: 'arrow', fromId: 't-5', fromPort: 'right', toId: 't-6', toPort: 'left', x1: 1014, y1: 198, x2: 1080, y2: 116, label: 'Cache Aside', routing: 'orthogonal', color: '#059669' },
        { id: 't-a6', type: 'arrow', fromId: 't-5', fromPort: 'right', toId: 't-7', toPort: 'left', x1: 1014, y1: 198, x2: 1080, y2: 276, label: 'SQL Query', routing: 'orthogonal', color: '#0284C7' },
        { id: 't-s1', type: 'sticky', x: 60, y: 280, w: 200, h: 90, text: '• 100K DAU\n• Read-to-write: 10:1\n• Cache hit ratio target > 85%', color: '#FEF08A' }
      ];
    } else if (templateId === 'streaming') {
      state.diagramMode = 'architecture';
      state.elements = [
        { id: 's-1', type: 'component', shape: 'card', stencil: 'mobile-app', x: 60, y: 150, w: 154, h: 76, title: 'Telemetry / Beacon', sub: '100k+ eps ping', icon: '📱', color: '#0284C7' },
        { id: 's-2', type: 'component', shape: 'circle', stencil: 'load-balancer', x: 270, y: 136, w: 104, h: 104, title: 'Collector LB', sub: 'Fast 202 Ack', icon: '⚖️', color: '#4F46E5' },
        { id: 's-3', type: 'component', shape: 'queue', stencil: 'kafka-stream', x: 440, y: 154, w: 160, h: 68, title: 'Kafka Topics', sub: 'Durable Partitions', icon: '📨', color: '#DC2626' },
        { id: 's-4', type: 'component', shape: 'hexagon', stencil: 'stream-processor', x: 670, y: 70, w: 140, h: 90, title: 'Stream Processor', sub: 'RocksDB Dedup', icon: '🌊', color: '#2563EB' },
        { id: 's-5', type: 'component', shape: 'cloud', stencil: 'object-storage', x: 670, y: 230, w: 160, h: 96, title: 'S3 Cold Archive', sub: 'Parquet Partitioned', icon: '☁️', color: '#EA580C' },
        { id: 's-6', type: 'component', shape: 'cylinder', stencil: 'data-warehouse', x: 890, y: 70, w: 140, h: 92, title: 'ClickHouse OLAP', sub: 'Minute Aggregates', icon: '📊', color: '#9333EA' },
        { id: 's-a1', type: 'arrow', fromId: 's-1', fromPort: 'right', toId: 's-2', toPort: 'left', x1: 214, y1: 188, x2: 270, y2: 188, label: 'POST Batch', routing: 'straight', color: '#0284C7' },
        { id: 's-a2', type: 'arrow', fromId: 's-2', fromPort: 'right', toId: 's-3', toPort: 'left', x1: 374, y1: 188, x2: 440, y2: 188, label: 'Append Log', routing: 'straight', color: '#4F46E5' },
        { id: 's-a3', type: 'arrow', fromId: 's-3', fromPort: 'right', toId: 's-4', toPort: 'left', x1: 600, y1: 188, x2: 670, y2: 115, label: 'Consume Offsets', routing: 'orthogonal', color: '#DC2626' },
        { id: 's-a4', type: 'arrow', fromId: 's-3', fromPort: 'right', toId: 's-5', toPort: 'left', x1: 600, y1: 188, x2: 670, y2: 278, label: 'Batch Flush', routing: 'orthogonal', color: '#EA580C' },
        { id: 's-a5', type: 'arrow', fromId: 's-4', fromPort: 'right', toId: 's-6', toPort: 'left', x1: 810, y1: 115, x2: 890, y2: 116, label: 'Upsert Aggs', routing: 'straight', color: '#9333EA' }
      ];
    } else if (templateId === 'sequence-starter') {
      state.diagramMode = 'sequence';
      state.elements = [
        { id: 'seq-1', type: 'seq_participant', x: 60, y: 60, w: 130, h: 48, title: 'Client App', sub: 'React SPA', color: '#0284C7', lifelineLength: 400 },
        { id: 'seq-2', type: 'seq_participant', x: 280, y: 60, w: 130, h: 48, title: 'API Gateway', sub: 'Rate Limit', color: '#7C3AED', lifelineLength: 400 },
        { id: 'seq-3', type: 'seq_participant', x: 500, y: 60, w: 130, h: 48, title: 'Auth Service', sub: 'Token Issuer', color: '#2563EB', lifelineLength: 400 },
        { id: 'seq-4', type: 'seq_participant', x: 720, y: 60, w: 130, h: 48, title: 'User DB', sub: 'PostgreSQL', color: '#059669', lifelineLength: 400 },
        { id: 'sq-a1', type: 'arrow', x1: 125, y1: 150, x2: 345, y2: 150, label: 'POST /login', routing: 'straight', color: '#0284C7' },
        { id: 'sq-a2', type: 'arrow', x1: 345, y1: 190, x2: 565, y2: 190, label: 'Verify Credentials', routing: 'straight', color: '#7C3AED' },
        { id: 'sq-a3', type: 'arrow', x1: 565, y1: 230, x2: 785, y2: 230, label: 'SELECT * FROM users', routing: 'straight', color: '#2563EB' },
        { id: 'sq-a4', type: 'arrow', x1: 785, y1: 270, x2: 565, y2: 270, label: 'User Record + Hash', routing: 'straight', style: 'dashed', color: '#059669' },
        { id: 'sq-a5', type: 'arrow', x1: 565, y1: 310, x2: 125, y2: 310, label: '200 OK (JWT Access Token)', routing: 'straight', style: 'dashed', color: '#2563EB' }
      ];
    } else if (templateId === 'datamodel-starter') {
      state.diagramMode = 'datamodel';
      state.elements = [
        {
          id: 'tbl-1',
          type: 'table_entity',
          x: 80,
          y: 100,
          w: 200,
          tableName: 'users',
          color: '#1E293B',
          columns: [
            { name: 'id', type: 'UUID', isPk: true },
            { name: 'email', type: 'VARCHAR(255)', isUnique: true },
            { name: 'password_hash', type: 'VARCHAR(255)' },
            { name: 'tier', type: 'VARCHAR(32)' },
            { name: 'created_at', type: 'TIMESTAMP' }
          ]
        },
        {
          id: 'tbl-2',
          type: 'table_entity',
          x: 360,
          y: 100,
          w: 220,
          tableName: 'short_urls',
          color: '#1E293B',
          columns: [
            { name: 'short_key', type: 'VARCHAR(7)', isPk: true },
            { name: 'original_url', type: 'VARCHAR(2048)' },
            { name: 'user_id', type: 'UUID', isFk: true },
            { name: 'created_at', type: 'TIMESTAMP' },
            { name: 'expires_at', type: 'TIMESTAMP' }
          ]
        },
        {
          id: 'tbl-3',
          type: 'table_entity',
          x: 660,
          y: 100,
          w: 220,
          tableName: 'url_clicks',
          color: '#1E293B',
          columns: [
            { name: 'id', type: 'BIGSERIAL', isPk: true },
            { name: 'short_key', type: 'VARCHAR(7)', isFk: true },
            { name: 'clicked_at', type: 'TIMESTAMP' },
            { name: 'country_code', type: 'CHAR(2)' },
            { name: 'referer', type: 'VARCHAR(512)' }
          ]
        },
        { id: 'rel-1', type: 'arrow', fromId: 'tbl-1', fromPort: 'right', toId: 'tbl-2', toPort: 'left', x1: 280, y1: 150, x2: 360, y2: 150, label: '1 : N (user_id)', routing: 'straight', color: '#4F46E5' },
        { id: 'rel-2', type: 'arrow', fromId: 'tbl-2', fromPort: 'right', toId: 'tbl-3', toPort: 'left', x1: 580, y1: 150, x2: 660, y2: 150, label: '1 : N (short_key)', routing: 'straight', color: '#059669' }
      ];
    }

    pushHistory();
    syncModeTabsUI();
    render();
    fitViewToContent();
  }

  function syncModeTabsUI() {
    root.querySelectorAll('.wb-mode-tab').forEach(tab => {
      const mode = tab.getAttribute('data-mode');
      if (mode === state.diagramMode) {
        tab.className = 'wb-mode-tab active px-2.5 py-1 rounded-md transition-all font-medium text-slate-800 dark:text-white bg-white dark:bg-[#1E293B] shadow-xs cursor-pointer flex items-center gap-1';
      } else {
        tab.className = 'wb-mode-tab px-2.5 py-1 rounded-md transition-all font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer flex items-center gap-1';
      }
    });
  }

  // -------------------------------------------------------------
  // RUBRIC & QUESTION PROMPTS
  // -------------------------------------------------------------
  function updateRubricUI() {
    let completedCount = 0;
    root.querySelectorAll('.wb-rubric-check').forEach(input => {
      const rId = input.getAttribute('data-rubric-id');
      const isChecked = !!state.rubricChecked[rId];
      input.checked = isChecked;
      if (isChecked) completedCount++;
    });

    const scoreBadge = root.querySelector('#wb-rubric-score-badge');
    const pctLabel = root.querySelector('#wb-rubric-pct-label');
    const pct = Math.round((completedCount / INTERVIEW_RUBRIC.length) * 100);

    if (scoreBadge) scoreBadge.textContent = `${completedCount}/${INTERVIEW_RUBRIC.length}`;
    if (pctLabel) pctLabel.textContent = `${pct}% Complete (Self-Assessment)`;
  }

  function setQuestionPrompt(promptId) {
    state.activePromptId = promptId;
    const q = SYSTEM_DESIGN_QUESTIONS.find(item => item.id === promptId);
    const titleEl = root.querySelector('#wb-active-prompt-title');
    const scopeEl = root.querySelector('#wb-active-prompt-scope');
    const listEl = root.querySelector('#wb-question-prompts-list');

    if (q) {
      if (titleEl) titleEl.textContent = q.title;
      if (scopeEl) scopeEl.textContent = q.scope;
      if (listEl) {
        listEl.innerHTML = q.prompts.map(p => `<li>${escapeHtml(p)}</li>`).join('');
      }
    } else {
      if (titleEl) titleEl.textContent = 'Freeform Architecture Practice';
      if (scopeEl) scopeEl.textContent = 'Score your system design readiness across industry standards. Note: this is a self-assessment guide, not an official scorecard.';
      if (listEl) {
        listEl.innerHTML = `
          <li>Clarify core read and write requirements, p99 latency targets, and multi-region availability expectations.</li>
          <li>Estimate peak transactions per second (TPS) and calculate required storage for 5-year retention.</li>
        `;
      }
    }
  }

  // -------------------------------------------------------------
  // MOUSE & TOUCH EVENT HANDLERS
  // -------------------------------------------------------------
  function handlePointerDown(e) {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

    dismissWelcome();

    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = screenToWorld(sx, sy);

    // Pan with space or middle click
    if (state.isSpacePressed || e.button === 1) {
      state.isPanning = true;
      state.panStartX = sx - state.panX;
      state.panStartY = sy - state.panY;
      canvas.style.cursor = 'grabbing';
      return;
    }

    // SELECT TOOL (Default)
    if (state.activeTool === 'select') {
      const hit = hitTest(world.x, world.y);

      if (hit) {
        if (e.shiftKey) {
          if (state.selectedIds.includes(hit.id)) {
            state.selectedIds = state.selectedIds.filter(id => id !== hit.id);
          } else {
            state.selectedIds.push(hit.id);
          }
        } else {
          // If clicked item is not already part of multi-selection, select it singly
          if (!state.selectedIds.includes(hit.id)) {
            state.selectedIds = [hit.id];
          }
        }

        state.dragElements = state.elements.filter(el => state.selectedIds.includes(el.id));
        state.dragStartWorld = { x: world.x, y: world.y };
        state.dragLastWorld = { x: world.x, y: world.y };
        state.hasDragged = false;
      } else {
        if (!e.shiftKey) {
          state.selectedIds = [];
        }
        state.dragElements = [];
        state.dragStartWorld = null;
        state.dragLastWorld = null;
        state.hasDragged = false;
        state.selectionBox = { x: world.x, y: world.y, startX: world.x, startY: world.y, w: 0, h: 0 };
      }

      updatePropertiesPanel();
      render();
    }

    // STRAIGHT ARROW OR BEND / ELBOW ARROW
    else if (state.activeTool === 'arrow' || state.activeTool === 'bend-arrow') {
      const nearPort = findNearestPort(world.x, world.y);
      const startX = nearPort ? nearPort.x : world.x;
      const startY = nearPort ? nearPort.y : world.y;

      state.isDrawing = true;
      state.arrowStartPos = { x: startX, y: startY };
      state.currentDrawing = {
        id: `arrow-${Date.now()}`,
        type: 'arrow',
        fromId: nearPort ? nearPort.elementId : null,
        fromPort: nearPort ? nearPort.port : null,
        x1: startX,
        y1: startY,
        x2: startX,
        y2: startY,
        color: state.currentColor === '#0F172A' ? '#2563EB' : state.currentColor,
        label: 'HTTPS',
        routing: state.activeTool === 'bend-arrow' ? 'orthogonal' : 'straight',
        style: 'solid'
      };
    }

    // PEN TOOL
    else if (state.activeTool === 'pen') {
      state.isDrawing = true;
      state.currentDrawing = {
        id: `stroke-${Date.now()}`,
        type: 'stroke',
        points: [{ x: world.x, y: world.y }],
        color: state.currentColor,
        width: state.currentStrokeWidth
      };
    }

    // BOX TOOL
    else if (state.activeTool === 'box') {
      state.isDrawing = true;
      state.arrowStartPos = world;
      state.currentDrawing = {
        id: `box-${Date.now()}`,
        type: 'box',
        shape: 'dashed-box',
        x: world.x,
        y: world.y,
        w: 10,
        h: 10,
        title: 'VPC Subnet',
        color: state.currentColor === '#0F172A' ? '#64748B' : state.currentColor
      };
    }

    // STICKY NOTE TOOL
    else if (state.activeTool === 'sticky') {
      const text = prompt('Enter Sticky Note text (Estimations, Math, SLAs):', '• 100K Peak QPS\n• SLA p99 < 50ms\n• Cache Hit Target > 85%');
      if (text) {
        const newSticky = {
          id: `sticky-${Date.now()}`,
          type: 'sticky',
          x: Math.round(world.x),
          y: Math.round(world.y),
          w: 180,
          h: 96,
          text: text,
          color: '#FEF08A'
        };
        state.elements.push(newSticky);
        state.selectedIds = [newSticky.id];
        pushHistory();
        selectTool('select');
        render();
      }
    }

    // TEXT TOOL
    else if (state.activeTool === 'text') {
      const text = prompt('Enter Text Label:', 'Service Fleet');
      if (text) {
        const newText = {
          id: `text-${Date.now()}`,
          type: 'text',
          x: Math.round(world.x),
          y: Math.round(world.y),
          text: text,
          fontSize: 14,
          color: state.currentColor
        };
        state.elements.push(newText);
        state.selectedIds = [newText.id];
        pushHistory();
        selectTool('select');
        render();
      }
    }

    // ERASER TOOL
    else if (state.activeTool === 'eraser') {
      const hit = hitTest(world.x, world.y);
      if (hit) {
        state.elements = state.elements.filter(el => el.id !== hit.id);
        state.selectedIds = state.selectedIds.filter(id => id !== hit.id);
        pushHistory();
        render();
      }
    }
  }

  function handlePointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = screenToWorld(sx, sy);

    if (state.isPanning) {
      state.panX = sx - state.panStartX;
      state.panY = sy - state.panStartY;
      render();
      return;
    }

    // Dragging selected elements
    if (state.dragElements.length > 0 && state.activeTool === 'select' && state.dragLastWorld) {
      const deltaX = Math.round(world.x - state.dragLastWorld.x);
      const deltaY = Math.round(world.y - state.dragLastWorld.y);

      if (deltaX !== 0 || deltaY !== 0) {
        state.hasDragged = true;
        state.dragLastWorld.x += deltaX;
        state.dragLastWorld.y += deltaY;

        state.dragElements.forEach(el => {
          if (el.type === 'arrow') {
            // If dragging single arrow that was attached to components, detach it so it moves freely
            if (state.dragElements.length === 1 && (el.fromId || el.toId)) {
              const coords = resolveArrowCoordinates(el);
              el.x1 = coords.x1;
              el.y1 = coords.y1;
              el.x2 = coords.x2;
              el.y2 = coords.y2;
              el.fromId = null;
              el.toId = null;
            }
            if (!el.fromId) {
              el.x1 = (el.x1 || 0) + deltaX;
              el.y1 = (el.y1 || 0) + deltaY;
            }
            if (!el.toId) {
              el.x2 = (el.x2 || 0) + deltaX;
              el.y2 = (el.y2 || 0) + deltaY;
            }
          } else if (el.type === 'stroke') {
            if (Array.isArray(el.points)) {
              el.points.forEach(pt => {
                pt.x += deltaX;
                pt.y += deltaY;
              });
            }
          } else {
            if (el.x !== undefined) el.x += deltaX;
            if (el.y !== undefined) el.y += deltaY;
          }
        });
        render();
      }
      return;
    }

    // Marquee Selection Box
    if (state.selectionBox) {
      state.selectionBox.w = world.x - state.selectionBox.startX;
      state.selectionBox.h = world.y - state.selectionBox.startY;
      state.selectionBox.x = Math.min(state.selectionBox.startX, world.x);
      state.selectionBox.y = Math.min(state.selectionBox.startY, world.y);
      render();
      return;
    }

    // In-Progress Drawing
    if (state.isDrawing && state.currentDrawing) {
      if (state.activeTool === 'arrow' || state.activeTool === 'bend-arrow') {
        const nearPort = findNearestPort(world.x, world.y);
        state.arrowHoverPort = nearPort;

        if (nearPort) {
          state.currentDrawing.x2 = nearPort.x;
          state.currentDrawing.y2 = nearPort.y;
          state.currentDrawing.toId = nearPort.elementId;
          state.currentDrawing.toPort = nearPort.port;
        } else {
          state.currentDrawing.x2 = Math.round(world.x);
          state.currentDrawing.y2 = Math.round(world.y);
          state.currentDrawing.toId = null;
          state.currentDrawing.toPort = null;
        }
        render();
      } else if (state.activeTool === 'pen') {
        state.currentDrawing.points.push({ x: world.x, y: world.y });
        render();
      } else if (state.activeTool === 'box') {
        state.currentDrawing.w = Math.round(world.x - state.arrowStartPos.x);
        state.currentDrawing.h = Math.round(world.y - state.arrowStartPos.y);
        render();
      }
    }
  }

  function handlePointerUp() {
    if (state.isPanning) {
      state.isPanning = false;
      canvas.style.cursor = state.isSpacePressed ? 'grab' : 'default';
      return;
    }

    if (state.dragElements.length > 0) {
      const didDrag = state.hasDragged;
      state.dragElements = [];
      state.dragOffsets = [];
      state.dragStartWorld = null;
      state.dragLastWorld = null;
      state.hasDragged = false;
      if (didDrag) {
        pushHistory();
      }
      return;
    }

    if (state.selectionBox) {
      const selected = getElementsInRect(state.selectionBox);
      state.selectedIds = selected.map(el => el.id);
      state.selectionBox = null;
      updatePropertiesPanel();
      render();
      return;
    }

    if (state.isDrawing && state.currentDrawing) {
      state.isDrawing = false;
      state.arrowHoverPort = null;

      if (state.activeTool === 'box') {
        if (state.currentDrawing.w < 0) {
          state.currentDrawing.x += state.currentDrawing.w;
          state.currentDrawing.w = Math.abs(state.currentDrawing.w);
        }
        if (state.currentDrawing.h < 0) {
          state.currentDrawing.y += state.currentDrawing.h;
          state.currentDrawing.h = Math.abs(state.currentDrawing.h);
        }
      }

      state.elements.push(state.currentDrawing);
      state.selectedIds = [state.currentDrawing.id];
      state.currentDrawing = null;
      pushHistory();
      selectTool('select');
      render();
    }
  }

  // -------------------------------------------------------------
  // TOOL SELECTION HELPER
  // -------------------------------------------------------------
  function selectTool(toolName) {
    state.activeTool = toolName;
    root.querySelectorAll('.wb-tool-btn').forEach(btn => {
      if (btn.getAttribute('data-tool') === toolName) {
        btn.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-xs');
        btn.classList.remove('hover:bg-slate-100');
      } else {
        btn.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-xs');
      }
    });

    if (toolName === 'select') {
      canvas.style.cursor = 'default';
    } else if (toolName === 'arrow' || toolName === 'bend-arrow' || toolName === 'box' || toolName === 'pen') {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = 'default';
    }
  }

  // -------------------------------------------------------------
  // HTML5 DRAG & DROP & SHAPES INTERACTION
  // -------------------------------------------------------------
  function setupDragAndDrop() {
    // Make cards draggable
    root.querySelectorAll('.wb-stencil-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        const compId = card.getAttribute('data-stencil');
        e.dataTransfer.setData('text/plain', compId);
      });

      card.addEventListener('click', () => {
        const compId = card.getAttribute('data-stencil');
        if (compId) addComponentToCenter(compId);
      });
    });

    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      const compId = e.dataTransfer.getData('text/plain');
      if (compId) {
        const rect = canvas.getBoundingClientRect();
        const worldPos = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
        addComponentToCenter(compId, worldPos);
      }
    });

    // Shapes Popout Quick Insert
    root.querySelectorAll('.wb-quick-shape-item').forEach(btn => {
      btn.onclick = () => {
        const shape = btn.getAttribute('data-shape-insert');
        if (shape) {
          addShapeToCenter(shape);
          const popout = root.querySelector('#wb-shapes-popout');
          if (popout) popout.classList.add('hidden');
        }
      };
    });

    // Shapes Popout Toggles
    const openShapesBtn = root.querySelector('#wb-open-shapes-btn');
    const closeShapesBtn = root.querySelector('#wb-close-shapes-btn');
    const shapesPopout = root.querySelector('#wb-shapes-popout');

    if (openShapesBtn && shapesPopout) {
      openShapesBtn.onclick = () => shapesPopout.classList.toggle('hidden');
    }
    if (closeShapesBtn && shapesPopout) {
      closeShapesBtn.onclick = () => shapesPopout.classList.add('hidden');
    }

    // Component Palette Search Filter
    const searchInput = root.querySelector('#wb-component-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        root.querySelectorAll('.wb-stencil-card').forEach(card => {
          const name = (card.getAttribute('data-stencil-name') || '').toLowerCase();
          const sub = (card.getAttribute('data-stencil-sub') || '').toLowerCase();
          const matches = name.includes(query) || sub.includes(query);
          card.style.display = matches ? 'flex' : 'none';
        });

        root.querySelectorAll('.wb-category-section').forEach(sec => {
          const visibleCards = sec.querySelectorAll('.wb-stencil-card:not([style*="display: none"])');
          sec.style.display = visibleCards.length > 0 ? 'flex' : 'none';
        });
      });
    }
  }

  // -------------------------------------------------------------
  // ATTACH LISTENERS & WIRE UI
  // -------------------------------------------------------------
  canvas.addEventListener('mousedown', handlePointerDown);
  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handlePointerDown({ clientX: touch.clientX, clientY: touch.clientY, button: 0, target: canvas });
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }, { passive: false });

  canvas.addEventListener('touchend', handlePointerUp);

  // Wheel Zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let zoomFactor;
    if (e.ctrlKey) {
      // Smooth trackpad pinch
      zoomFactor = Math.exp(-e.deltaY * 0.01);
    } else {
      // Mouse wheel stepped zoom
      zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    }
    applyZoom(zoomFactor, mouseX, mouseY);
  }, { passive: false });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    // 1. Modifiers (Ctrl / Cmd) - MUST BE EVALUATED FIRST to prevent tool conflict
    if (e.metaKey || e.ctrlKey) {
      const keyLower = (e.key || '').toLowerCase();

      // Undo: Ctrl+Z / Cmd+Z (without Shift)
      if ((keyLower === 'z' || e.code === 'KeyZ') && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y / Cmd+Y
      if (((keyLower === 'z' || e.code === 'KeyZ') && e.shiftKey) || keyLower === 'y' || e.code === 'KeyY') {
        e.preventDefault();
        redo();
        return;
      }

      // Select All: Ctrl+A / Cmd+A
      if (keyLower === 'a' || e.code === 'KeyA') {
        e.preventDefault();
        state.selectedIds = state.elements.map(el => el.id);
        render();
        updatePropertiesPanel();
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (keyLower === 'd' || e.code === 'KeyD') {
        e.preventDefault();
        duplicateSelectedElements();
        return;
      }

      // Zoom In: Ctrl + = or Ctrl + +
      if (e.key === '=' || e.key === '+' || e.code === 'Equal') {
        e.preventDefault();
        applyZoom(1.2);
        return;
      }

      // Zoom Out: Ctrl + -
      if (e.key === '-' || e.code === 'Minus') {
        e.preventDefault();
        applyZoom(0.83);
        return;
      }

      // Reset Zoom: Ctrl + 0
      if (e.key === '0' || e.code === 'Digit0') {
        e.preventDefault();
        resetView();
        return;
      }

      return; // Do not trigger single-key tool switches when Ctrl/Cmd is active
    }

    // 2. Delete / Backspace (without modifier)
    if (e.key === 'Delete' || e.key === 'Backspace' || e.code === 'Delete' || e.code === 'Backspace') {
      if (state.selectedIds.length > 0) {
        e.preventDefault();
        deleteSelectedElements();
        return;
      }
    }

    // 3. Zoom Shortcuts without modifiers (+, -, 0)
    if (e.key === '=' || e.key === '+') {
      e.preventDefault();
      applyZoom(1.2);
      return;
    }
    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      applyZoom(0.83);
      return;
    }
    if (e.key === '0') {
      e.preventDefault();
      resetView();
      return;
    }

    // 4. Spacebar Panning
    if (e.code === 'Space') {
      state.isSpacePressed = true;
      canvas.style.cursor = 'grab';
      return;
    }

    // 5. Tool Shortcuts (Single Letter Keys)
    const k = (e.key || '').toLowerCase();
    if (k === 'v') {
      selectTool('select');
    } else if (k === 'a') {
      selectTool('arrow');
    } else if (k === 'z') {
      selectTool('bend-arrow');
    } else if (k === 'p') {
      selectTool('pen');
    } else if (k === 'b') {
      selectTool('box');
    } else if (k === 's') {
      selectTool('sticky');
    } else if (k === 't') {
      selectTool('text');
    } else if (k === 'e') {
      selectTool('eraser');
    } else if (k === 'c') {
      const panel = root.querySelector('#wb-stencils-panel');
      if (panel) panel.classList.toggle('hidden');
    } else if (k === 'h') {
      const popout = root.querySelector('#wb-shapes-popout');
      if (popout) popout.classList.toggle('hidden');
    } else if (k === 'r') {
      const rubric = root.querySelector('#wb-rubric-drawer');
      if (rubric) rubric.classList.toggle('hidden');
    } else if (k === 'f') {
      fitViewToContent();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      state.isSpacePressed = false;
      canvas.style.cursor = state.activeTool === 'select' ? 'default' : 'crosshair';
    }
  });

  // Mode Switcher Tabs
  root.querySelectorAll('.wb-mode-tab').forEach(tab => {
    tab.onclick = () => {
      const mode = tab.getAttribute('data-mode');
      if (mode) {
        state.diagramMode = mode;
        syncModeTabsUI();
        scheduleAutosave();
      }
    };
  });

  // Tool buttons
  root.querySelectorAll('.wb-tool-btn').forEach(btn => {
    btn.onclick = () => {
      const tool = btn.getAttribute('data-tool');
      if (tool) selectTool(tool);
    };
  });

  // Stencils Panel Toggles
  const openStencilsBtn = root.querySelector('#wb-open-stencils-btn');
  const closeStencilsBtn = root.querySelector('#wb-close-stencils-btn');
  const stencilsPanel = root.querySelector('#wb-stencils-panel');

  if (openStencilsBtn && stencilsPanel) {
    openStencilsBtn.onclick = () => stencilsPanel.classList.toggle('hidden');
  }
  if (closeStencilsBtn && stencilsPanel) {
    closeStencilsBtn.onclick = () => stencilsPanel.classList.add('hidden');
  }

  // Properties Panel Close, Duplicate, Delete
  const closePropBtn = root.querySelector('#wb-close-properties-btn');
  const propDupBtn = root.querySelector('#wb-prop-duplicate-btn');
  const propDelBtn = root.querySelector('#wb-prop-delete-btn');

  if (closePropBtn) {
    closePropBtn.onclick = () => {
      const panel = root.querySelector('#wb-properties-panel');
      if (panel) panel.classList.add('hidden');
    };
  }
  if (propDupBtn) {
    propDupBtn.onclick = duplicateSelectedElements;
  }
  if (propDelBtn) {
    propDelBtn.onclick = deleteSelectedElements;
  }

  // Color Swatches
  root.querySelectorAll('.wb-color-btn').forEach(btn => {
    btn.onclick = () => {
      const c = btn.getAttribute('data-color');
      if (c) {
        state.currentColor = c;
        root.querySelectorAll('.wb-color-btn').forEach(b => b.classList.remove('border-2', 'border-indigo-500'));
        btn.classList.add('border-2', 'border-indigo-500');

        if (state.selectedIds.length > 0) {
          state.elements.forEach(el => {
            if (state.selectedIds.includes(el.id)) el.color = c;
          });
          pushHistory();
          render();
          updatePropertiesPanel();
        }
      }
    };
  });

  // Zoom and View Controls
  const zoomInBtn = root.querySelector('#wb-zoom-in-btn');
  const zoomOutBtn = root.querySelector('#wb-zoom-out-btn');
  const fitBtn = root.querySelector('#wb-fit-content-btn');
  const resetViewBtn = root.querySelector('#wb-reset-view-btn');

  if (zoomInBtn) {
    zoomInBtn.onclick = () => applyZoom(1.25);
  }
  if (zoomOutBtn) {
    zoomOutBtn.onclick = () => applyZoom(0.8);
  }
  if (fitBtn) fitBtn.onclick = fitViewToContent;
  if (resetViewBtn) {
    resetViewBtn.onclick = resetView;
  }

  // Timer Controls
  const timerToggleBtn = root.querySelector('#wb-timer-toggle-btn');
  const timerNextBtn = root.querySelector('#wb-timer-next-phase-btn');
  const timerResetBtn = root.querySelector('#wb-timer-reset-btn');
  if (timerToggleBtn) timerToggleBtn.onclick = toggleTimer;
  if (timerNextBtn) timerNextBtn.onclick = advanceToNextPhase;
  if (timerResetBtn) timerResetBtn.onclick = resetTimer;

  // Question Selector & Rubric Drawer
  const promptSelect = root.querySelector('#wb-prompt-select');
  const toggleRubricBtn = root.querySelector('#wb-toggle-rubric-btn');
  const closeRubricBtn = root.querySelector('#wb-close-rubric-btn');
  const rubricDrawer = root.querySelector('#wb-rubric-drawer');
  const rubricResetBtn = root.querySelector('#wb-rubric-reset-btn');

  if (promptSelect) {
    promptSelect.onchange = (e) => {
      setQuestionPrompt(e.target.value);
      if (rubricDrawer) rubricDrawer.classList.remove('hidden');
      scheduleAutosave();
    };
  }
  if (toggleRubricBtn && rubricDrawer) {
    toggleRubricBtn.onclick = () => rubricDrawer.classList.toggle('hidden');
  }
  if (closeRubricBtn && rubricDrawer) {
    closeRubricBtn.onclick = () => rubricDrawer.classList.add('hidden');
  }
  if (rubricResetBtn) {
    rubricResetBtn.onclick = () => {
      state.rubricChecked = {};
      updateRubricUI();
      scheduleAutosave();
    };
  }

  // Rubric Checkbox listeners
  root.querySelectorAll('.wb-rubric-check').forEach(check => {
    check.onchange = (e) => {
      const rId = check.getAttribute('data-rubric-id');
      state.rubricChecked[rId] = e.target.checked;
      updateRubricUI();
      scheduleAutosave();
    };
  });

  // Template Selector
  const templateSelect = root.querySelector('#wb-template-select');
  if (templateSelect) {
    templateSelect.onchange = (e) => {
      if (e.target.value) {
        loadStarterTemplate(e.target.value);
        e.target.value = '';
      }
    };
  }

  // Welcome Overlay Options & Dismissal
  const welcomeOverlay = root.querySelector('#wb-welcome-overlay');
  const closeWelcomeBtn = root.querySelector('#wb-close-welcome-btn');
  const welcomeBlankBtn = root.querySelector('#wb-welcome-blank-btn');
  const welcomeStarterBtn = root.querySelector('#wb-welcome-starter-btn');
  const welcomeQuestionBtn = root.querySelector('#wb-welcome-question-btn');

  if (closeWelcomeBtn) {
    closeWelcomeBtn.onclick = (e) => {
      e.stopPropagation();
      dismissWelcome();
    };
  }
  if (welcomeOverlay) {
    welcomeOverlay.onclick = (e) => {
      if (e.target === welcomeOverlay) {
        dismissWelcome();
      }
    };
  }
  if (welcomeBlankBtn) {
    welcomeBlankBtn.onclick = dismissWelcome;
  }
  if (welcomeStarterBtn) {
    welcomeStarterBtn.onclick = () => {
      dismissWelcome();
      loadStarterTemplate('3tier');
    };
  }
  if (welcomeQuestionBtn) {
    welcomeQuestionBtn.onclick = () => {
      dismissWelcome();
      if (promptSelect) {
        promptSelect.value = 'q-url-shortener';
        setQuestionPrompt('q-url-shortener');
      }
      if (rubricDrawer) rubricDrawer.classList.remove('hidden');
      if (!timer.isRunning) toggleTimer();
    };
  }

  // Undo / Redo & Clear
  const undoBtn = root.querySelector('#wb-undo-btn');
  const redoBtn = root.querySelector('#wb-redo-btn');
  const clearBtn = root.querySelector('#wb-clear-btn');

  if (undoBtn) undoBtn.onclick = undo;
  if (redoBtn) redoBtn.onclick = redo;
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('Clear entire whiteboard canvas?')) {
        state.elements = [];
        state.selectedIds = [];
        pushHistory();
        render();
        updatePropertiesPanel();
      }
    };
  }

  // Export Menu
  const exportMenuBtn = root.querySelector('#wb-export-menu-btn');
  const exportMenu = root.querySelector('#wb-export-menu');
  const exportPngFitBtn = root.querySelector('#wb-export-png-fit-btn');
  const exportSvgBtn = root.querySelector('#wb-export-svg-btn');
  const exportPngFullBtn = root.querySelector('#wb-export-png-full-btn');

  if (exportMenuBtn && exportMenu) {
    exportMenuBtn.onclick = (e) => {
      e.stopPropagation();
      exportMenu.classList.toggle('hidden');
    };
    window.addEventListener('click', () => {
      exportMenu.classList.add('hidden');
    });
  }

  if (exportPngFitBtn) {
    exportPngFitBtn.onclick = () => {
      if (exportMenu) exportMenu.classList.add('hidden');
      exportAsPngFit();
    };
  }
  if (exportSvgBtn) {
    exportSvgBtn.onclick = () => {
      if (exportMenu) exportMenu.classList.add('hidden');
      exportAsSvg();
    };
  }
  if (exportPngFullBtn) {
    exportPngFullBtn.onclick = () => {
      if (exportMenu) exportMenu.classList.add('hidden');
      state.selectedIds = [];
      render();
      const link = document.createElement('a');
      link.download = `system-design-canvas-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    };
  }

  // Fullscreen
  const fullscreenBtn = root.querySelector('#wb-fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.onclick = () => {
      if (!document.fullscreenElement) {
        root.requestFullscreen().catch(() => { });
      } else {
        document.exitFullscreen().catch(() => { });
      }
    };
  }

  // Setup Drag & Drop and Shapes
  setupDragAndDrop();

  // Resize listener
  window.addEventListener('resize', resizeCanvas);

  // Initialize from storage or clean state
  const hasRestored = loadSavedSession();
  if (!hasRestored) {
    state.elements = [];
    state.history = [JSON.stringify({
      diagramMode: state.diagramMode,
      elements: []
    })];
    state.historyIndex = 0;
  }

  resizeCanvas();
  updateTimerUI();
  updateRubricUI();
  setQuestionPrompt(state.activePromptId);
  setAutosaveStatus('saved');
}

// XML Escaping for SVG
function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
