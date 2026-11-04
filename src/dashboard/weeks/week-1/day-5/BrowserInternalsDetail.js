/**
 * 2.9 How Modern Browsers Work - Visual Guide
 * High-signal, visually rich reproduction of Page 32
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderBrowserInternalsContent(topic) {
  const followUps = [
    {
      q: "Why does Chrome use a separate process per site rather than per tab?",
      a: "<strong>Site Isolation</strong> is a hardware-enforced memory security boundary aligned with the Same-Origin Policy. If a web page embeds a third-party iframe (e.g. an advertisement or embedded payment form), that iframe runs in its own isolated OS renderer process with its own private virtual memory page tables. A CPU hardware vulnerability (like Spectre or Meltdown) in malicious ad JavaScript cannot read passwords, cookies, or credit card numbers stored in the main site's memory. A naive per-tab process model would unsafely mix different domains in the same address space."
    },
    {
      q: "What is the practical difference between Layout (Reflow), Paint, and Composite?",
      a: "<strong>1. Layout (Reflow):</strong> Calculates the exact geometric dimensions, box coordinates, and bounding rectangles of every element on the screen. It runs synchronously on the main thread and is CPU-heavy.<br/><strong>2. Paint:</strong> Fills those geometric boxes with actual visual pixels — drawing colors, text glyphs, shadows, and borders into memory bitmap tiles.<br/><strong>3. Composite:</strong> The GPU takes the painted bitmap layers and composites them together onto the screen. Animating properties like <code>transform</code> and <code>opacity</code> runs entirely on the GPU Compositor thread without triggering expensive Layout or Paint, delivering fluid 60 to 120 FPS animations."
    },
    {
      q: "Why do browser rendering internals matter to a backend system designer?",
      a: `Because backend architecture directly determines frontend user experience and Core Web Vitals:
      <br/>• <strong>Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR):</strong> SSR streams pre-rendered HTML from the server so the browser constructs the DOM and achieves instant First Contentful Paint (FCP). CSR returns an empty <code>&lt;div id='root'&gt;&lt;/div&gt;</code> that leaves the screen blank while downloading a 3 MB React bundle.
      <br/>• <strong>HTTP 103 Early Hints:</strong> The backend informs the browser which CSS stylesheets to preload while the database is still assembling the SQL query.
      <br/>• <strong>Cache-Control & Compression:</strong> Gzip/Brotli compression and immutable cache headers prevent the browser from stalling on blocking network assets.`
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
          2.9 How Modern Browsers Work: Architecture &amp; The Critical Rendering Path
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          A modern browser is not a simple document viewer — it is a sophisticated <strong>distributed operating system</strong>. It coordinates sandboxed multi-process security boundaries with a high-speed rendering pipeline that converts raw HTML and CSS bytes into glowing pixels on your screen.
        </p>
      </div>

      <!-- SIMPLE MENTAL MODEL BOX: THE THEATER PRODUCTION -->
      <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          THE SIMPLE MENTAL MODEL: A MOVIE STUDIO PRODUCTION
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[12px] font-sans">
          <div class="bg-[#0A0E1A] p-3 rounded-lg border border-slate-700/60">
            <strong class="text-blue-300 block mb-1">1. DOM (The Script):</strong>
            <span class="text-slate-400">The browser reads the raw HTML text and builds a tree of all actors, dialogues, and structural props.</span>
          </div>
          <div class="bg-[#0A0E1A] p-3 rounded-lg border border-amber-500/30">
            <strong class="text-amber-300 block mb-1">2. CSSOM (Costumes &amp; Lighting):</strong>
            <span class="text-slate-400">The browser parses CSS rules to determine font sizes, colors, and styling for every element.</span>
          </div>
          <div class="bg-[#0A0E1A] p-3 rounded-lg border border-indigo-500/30">
            <strong class="text-indigo-300 block mb-1">3. Render Tree (The Cast on Stage):</strong>
            <span class="text-slate-400">Merges DOM and CSSOM, filtering out elements that are hidden (like <code>&lt;head&gt;</code> or <code>display: none</code>).</span>
          </div>
          <div class="bg-[#0A0E1A] p-3 rounded-lg border border-purple-500/30">
            <strong class="text-purple-300 block mb-1">4. Layout / Reflow (Stage Placement):</strong>
            <span class="text-slate-400">The director calculates the exact X,Y pixel coordinates and bounding width/height of every actor on the set.</span>
          </div>
          <div class="bg-[#0A0E1A] p-3 rounded-lg border border-rose-500/30">
            <strong class="text-rose-300 block mb-1">5. Paint (Painting the Set):</strong>
            <span class="text-slate-400">Fills the geometric shapes with raster pixels: gradients, background colors, shadows, and text glyphs.</span>
          </div>
          <div class="bg-[#0A0E1A] p-3 rounded-lg border border-emerald-500/30">
            <strong class="text-emerald-300 block mb-1">6. Composite (GPU Camera Filming):</strong>
            <span class="text-slate-400">The GPU stitches individual layer textures together and smoothly scrolls the viewport at 120 FPS.</span>
          </div>
        </div>
      </div>

      <!-- Multi-Process Browser Architecture -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">window</span>
            Browser Process
          </span>
          <p class="text-[12px] text-slate-300">Privileged controller: manages URL address bar, bookmarks, tabs, networking socket stack, and file system storage.</p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">security</span>
            Renderer Process
          </span>
          <p class="text-[12px] text-slate-300">Sandboxed process per site. Runs Blink and V8. Stripped of direct OS system calls for ironclad memory isolation.</p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">speed</span>
            GPU Process
          </span>
          <p class="text-[12px] text-slate-300">Hardware graphics acceleration: rasterizes draw commands and composites visual layers across all active browser tabs.</p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-1.5">
          <span class="font-code text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">extension</span>
            Utility Processes
          </span>
          <p class="text-[12px] text-slate-300">Audio playback, browser extensions, network services, and storage daemons isolated from tab crash blast radius.</p>
        </div>
      </div>

      <!-- THE CRITICAL RENDERING PATH DIAGRAM -->
      <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
              THE CRITICAL RENDERING PATH (INSIDE THE RENDERER PROCESS)
            </span>
          </div>
          <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
            <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">Renderer Process</span>
            <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">Main Thread + GPU Compositor</span>
          </div>
        </div>

        <!-- The Architectural Diagram Image -->
        <div class="flex flex-col gap-3">
          <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
            <img 
              src="/images/critical-rendering-path.jpg" 
              alt="The Critical Rendering Path (Inside the Renderer Process) - HTML/CSS Parsing, DOM, CSSOM, Render Tree, Layout, Paint, Compositor" 
              class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
              loading="eager"
              title="Click to view image full resolution"
              onclick="window.open('/images/critical-rendering-path.jpg', '_blank')"
            />
          </div>
          <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
              Click diagram to view in high resolution in new tab
            </span>
            <span class="font-code text-[10.5px] text-slate-500">HTML/CSS Streams → Tokenizers → DOM/CSSOM Trees → Render Tree → Layout → Paint → GPU Composite</span>
          </div>
        </div>

        <!-- Critical Blocking Rules Callout Cards matching image -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11.5px] font-sans">
          <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
              <strong class="text-rose-950 font-semibold">Synchronous &lt;script&gt; Blocks HTML</strong>
            </div>
            <p class="text-rose-900/80 text-[11.5px] leading-relaxed">
              HTML parser halts completely until the script downloads and finishes executing. Delays DOM construction and page interactivity.
            </p>
            <code class="mt-auto px-2 py-1 rounded bg-rose-100 font-code text-[11px] text-rose-800 border border-rose-200">&lt;script src="app.js"&gt;&lt;/script&gt;</code>
            <span class="text-[10px] font-code font-bold text-rose-600 uppercase">Blocks parsing &amp; rendering (Fix: add defer)</span>
          </div>

          <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
              <strong class="text-amber-950 font-semibold">CSS Blocks Rendering</strong>
            </div>
            <p class="text-amber-900/80 text-[11.5px] leading-relaxed">
              Browser refuses to paint pixels until CSS finishes downloading and parsing to prevent a Flash of Unstyled Content (FOUC).
            </p>
            <code class="mt-auto px-2 py-1 rounded bg-amber-100 font-code text-[11px] text-amber-800 border border-amber-200">&lt;link rel="stylesheet" href="styles.css"&gt;</code>
            <span class="text-[10px] font-code font-bold text-amber-600 uppercase">Blocks Render Tree &amp; Paint</span>
          </div>

          <div class="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
              <strong class="text-blue-950 font-semibold">Transform &amp; Opacity on GPU</strong>
            </div>
            <p class="text-blue-900/80 text-[11.5px] leading-relaxed">
              Animating CSS <code>transform</code> or <code>opacity</code> bypasses both Layout and Paint, running 100% on the GPU Compositor thread.
            </p>
            <code class="mt-auto px-2 py-1 rounded bg-blue-100 font-code text-[11px] text-blue-800 border border-blue-200">.box { transform: translateX(100px); }</code>
            <span class="text-[10px] font-code font-bold text-blue-600 uppercase">Zero layout/paint cost (Fluid 120 FPS)</span>
          </div>
        </div>

        <!-- Key Takeaways from Image 3 -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[12px] text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-emerald-700 font-semibold font-sans">
            <span class="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
            <span>Key Takeaways for System Designers:</span>
          </div>
          <div class="text-[11.5px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 font-sans">
            <span>• HTML → DOM, CSS → CSSOM, DOM + CSSOM → Render Tree</span>
            <span>• Layout and Paint execute on CPU Main Thread</span>
            <span>• Compositing runs on GPU thread (off the main thread)</span>
            <span>• Inline critical above-the-fold CSS; defer non-critical JS</span>
          </div>
        </div>
      </div>

      <!-- Comparison: Main Thread vs GPU Compositor Thread -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-rose-300 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">hourglass_empty</span>
            Main Thread (Expensive &amp; Easily Blocked)
          </span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            Handles HTML parsing, JavaScript execution, DOM tree mutations, style calculations, and layout coordinate math. If JavaScript executes long tasks (&gt; 50 ms), the main thread freezes, dropping screen refresh frames and degrading your Core Web Vitals (INP - Interaction to Next Paint).
          </p>
        </div>

        <div class="bg-[#0F1626] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[12px] font-bold text-emerald-300 flex items-center gap-1.5 uppercase">
            <span class="material-symbols-outlined text-[16px]">bolt</span>
            Compositor Thread (Off-Thread &amp; Fluid)
          </span>
          <p class="text-[12px] text-slate-300 font-sans leading-relaxed">
            Splits the page into visual texture layers, tiles them, and feeds draw commands to the GPU. Handles smooth scrolling, pinch gestures, and CSS <code>transform</code> animations effortlessly at 120 FPS even while the main JavaScript thread is busy calculating data.
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
          "A modern browser is a multi-process distributed system on a single machine: sandboxed processes for memory security, and a strict pipeline for rendering. Master the Critical Rendering Path so you can articulate why a slow backend API or an un-deferred script freezes the user's screen."
        </p>
      </div>

    </div>
  `;
}
