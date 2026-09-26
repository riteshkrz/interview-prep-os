/**
 * 2.9 How Modern Browsers Work - Visual Guide
 * High-signal, visually rich reproduction of Page 32
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderBrowserInternalsContent(topic) {
  const followUps = [
    {
      q: "Why does a browser use a process per site rather than per tab?",
      a: "<strong>Site isolation</strong> is a hardware-enforced security boundary aligned with the Same-Origin Policy (SOP). Cross-site iframes embedded on a page get their own isolated renderer process with its own private virtual memory space. A Spectre-style speculative execution exploit or memory-safety vulnerability in one compromised renderer cannot read credentials, tokens, or DOM data of another origin. A naive per-tab process model would co-locate multiple distinct origins inside one address space."
    },
    {
      q: "What is the practical difference between layout, paint, and composite?",
      a: "<strong>Layout (Reflow)</strong> computes exact box geometry, coordinates, and bounding rectangles — it runs synchronously on the main thread and is computationally heavy. <strong>Paint</strong> fills those geometries with raster pixels (colors, borders, text, shadows) into bitmap layers. <strong>Composite</strong> takes those painted bitmapped layers and composites them together via the GPU. Animating properties like <code>transform</code> and <code>opacity</code> runs entirely on the GPU compositor thread without triggering layout or paint, yielding 60–120 FPS."
    },
    {
      q: "Why does browser internals matter to a backend engineer?",
      a: "Because backend architectural decisions directly govern browser rendering efficiency: Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR), response payload trimming, HTTP/2 resource prioritization, early <code>103 Early Hints</code> link headers, font preloading, and <code>Cache-Control</code> headers are all backend configurations whose latency cost is settled on the browser's critical rendering path."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="2.9-browser">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Part 2 · Networking &amp; Protocols
            </span>
            <span class="text-[12px] font-code text-slate-400">Page 32 · Section 2.9</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 15 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          2.9 How Modern Browsers Work
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          A modern web browser is effectively a distributed operating system on a single machine: isolated multi-process sandboxes for memory safety, paired with a pipelined critical rendering engine.
        </p>
      </div>

      <!-- Multi-Process Browser Architecture -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">window</span>
            Browser Process
          </span>
          <p class="text-[12px] text-slate-300">Privileged controller: manages UI chrome, address bar, bookmarks, tabs, network socket stack, and disk storage access.</p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">security</span>
            Renderer Process
          </span>
          <p class="text-[12px] text-slate-300">Sandboxed process per site. Runs Blink/V8. Zero direct OS system-call access; isolated from filesystem and network.</p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">speed</span>
            GPU Process
          </span>
          <p class="text-[12px] text-slate-300">Handles 3D graphics rendering, UI layer compositing, and hardware video decoding across multiple tab renderers.</p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">extension</span>
            Utility Processes
          </span>
          <p class="text-[12px] text-slate-300">Audio mixing, plugin sandboxes, network service processes, and storage daemons isolated from crash blast radius.</p>
        </div>
      </div>

      <!-- Critical Rendering Path ASCII Flow -->
      <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-mono text-[12px]">
        <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/70">
          <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
            THE CRITICAL RENDERING PATH (INSIDE THE RENDERER PROCESS)
          </span>
          <span class="text-[11px] font-code text-slate-500">Pipeline Stages</span>
        </div>
        <div class="text-[12px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
HTML Stream ──► Tokenizer ──► DOM Tree (Document Object Model) ────┐
                                                                 ├─► [ Render Tree ] (Visible elements only)
CSS Stream  ──► Tokenizer ──► CSSOM Tree (Style Rules) ──────────┘           │
                                                                             ▼
                                                                     [ Layout / Reflow ]
                                                                     Computes geometric coordinates & box sizes (Main Thread)
                                                                             │
                                                                             ▼
                                                                     [ Paint / Raster ]
                                                                     Fills pixels into layer bitmaps (Colors, borders, text)
                                                                             │
                                                                             ▼
                                                                     [ Composite ]
                                                                     GPU composites layers into final screen pixels (Off-Thread)

  CRITICAL BLOCKING RULES:
  • Synchronous &lt;script&gt; blocks HTML parsing until downloaded and executed.
  • CSS blocks rendering (DOM parsing continues, but Render Tree creation halts to prevent FOUC).
  • Animating 'transform' / 'opacity' executes on GPU Compositor Thread without touching Main Thread Layout!
        </div>
      </div>

      <!-- Comparison: Main Thread vs GPU Compositor Thread -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-rose-300 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">hourglass_empty</span>
            Main Thread (Expensive &amp; Blocking)
          </span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            HTML parsing, JavaScript event loop execution, DOM manipulation, style recalculations, and layout coordinate calculations. If JavaScript executes long tasks (>50ms), the main thread stalls, dropping frames and rendering the UI non-responsive (INP latency degradation).
          </p>
        </div>

        <div class="bg-[#0F1626] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-emerald-300 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">bolt</span>
            Compositor Thread (Off-Thread &amp; Fluid)
          </span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            Separates the page into layers, tiles the layers, and sends draw quads to the GPU. Handles user scroll gestures, pinch-to-zoom, and CSS animations using <code>transform</code> and <code>opacity</code> smoothly at native refresh rates even when the main JavaScript thread is busy.
          </p>
        </div>
      </div>

      <!-- Interview Follow-ups -->
      <div class="flex flex-col gap-3 pt-2">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          INTERVIEW FOLLOW-UPS (SENIOR &amp; STAFF PROBES)
        </span>
        <div class="flex flex-col gap-3">
          ${followUps.map((item, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <span class="font-sans text-[13px] font-bold text-cyan-300">
                Q${idx + 1}: ${item.q}
              </span>
              <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
                ${item.a}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Key Interview Takeaway -->
      <div class="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "A browser is a distributed system on one machine: isolated processes for safety, a pipeline for rendering. Know the critical rendering path well enough to explain why a slow API or a blocking script becomes a blank screen."
        </p>
      </div>

    </div>
  `;
}
