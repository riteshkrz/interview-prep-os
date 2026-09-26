/**
 * Google Maps Architecture: Tiling, Routing & Ingestion (Topic 9.2)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 108–111
 */

export function renderGoogleMapsContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="google-maps">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 9.2 · Pages 108–111
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Planetary Geospatial Architecture
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">1B DAU · 10^6 writes/sec Ingest · Contraction Hierarchies + A*</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Google Maps Architecture: Tiling & Route Planning</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Google Maps operates across three fundamentally asymmetric system paradigms: <strong>Map Rendering is a Caching Problem</strong> (21 zoom levels of 256×256 tiles on CDN), <strong>Navigation is a Graph Compute Problem</strong> (hierarchical Contraction Hierarchies with dynamic traffic edge weights), and <strong>Location Ingestion is a High-Throughput Streaming Problem</strong> (1B DAU emitting 10^6 GPS updates/sec).
      </p>
    </div>

    <!-- The 3 Asymmetric Systems Architecture -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The 3 Structural Subsystems (Page 110)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
   1. MAP RENDERING (Caching Problem)
      S3 Storage ──► CDN Edge PoPs ──► Client Viewport (6–12 tiles per screen)
      Pre-rendered static vector tiles; constant bandwidth independent of zoom level.

   2. LOCATION INGESTION (High-Throughput Streaming Problem)
      1B DAU Phones ──(GPS every 4s)──► Edge Aggregator ──► Kafka Stream ──► Flink Live Traffic
      Never write raw GPS pings to a SQL database! (1,000,000 writes/second).

   3. NAVIGATION SERVICE (Graph Compute Problem)
      User Route Request ──► Geocoder (Address → Lat/Lng)
                                  │
                                  ▼
                             Route Planner (Hierarchical Contraction Hierarchies + A*)
                             Blends static road topology + dynamic real-time traffic speeds
</pre>
      </div>
    </div>

    <!-- Map Tile Pyramid Drill (Page 109) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        The Tile Pyramid: 4× Expansion per Zoom Level (Page 109)
      </h3>
      <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800 font-mono text-xs space-y-2">
        <div class="text-purple-300 font-bold">// The 21 Zoom Levels of Earth</div>
        <div class="text-slate-300 space-y-1">
          <div>• Zoom 0:  1 tile (256×256 px) ── Whole world</div>
          <div>• Zoom 1:  4 tiles (512×512 px) ── 2×2 grid</div>
          <div>• Zoom 2:  16 tiles (1024×1024 px) ── 4×4 grid</div>
          <div>• Zoom z:  $4^z$ tiles ── $2^z \times 2^z$ grid</div>
          <div class="text-amber-400 font-bold">• Zoom 21: $4^{21} \approx 4.4 \times 10^{12}$ tiles (4.4 Trillion tiles!)</div>
        </div>
        <div class="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 mt-2 font-sans">
          <strong>Why Tiles Are Never Precomputed Upfront:</strong> Pre-rendering 4.4 trillion image tiles would consume petabytes of useless storage for oceans and deserts. High-zoom tiles are generated <strong>lazily and on-demand</strong> when users view a viewport. Modern clients fetch <strong>Vector Tiles (Mapbox Vector Tile format)</strong>, styling roads and labels locally on the GPU with zero pixel blur!
        </div>
      </div>
    </div>

    <!-- Navigation Engine: Contraction Hierarchies + A* -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Route Planning: Precompute, Don't Dijkstra (Page 110)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-rose-400 font-bold mb-2">THE INTERVIEW MISTAKE: PLAIN DIJKSTRA</div>
          <p class="text-slate-300 leading-relaxed">
            Running raw Dijkstra's algorithm across a continent-scale graph (millions of road intersections) takes seconds or minutes of CPU time. It explores circular waves in all directions indiscriminately, making interactive routing impossible.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-emerald-300 font-bold mb-2">THE SENIOR ANSWER: CONTRACTION HIERARCHIES</div>
          <p class="text-slate-300 leading-relaxed">
            Divide the road graph into a hierarchy: local residential streets $\to$ arterial roads $\to$ national highways. Precompute shortcut edges between transit junctions (Contraction Hierarchies). Long-distance routing stitches precomputed highway paths, searching local streets only near origin and destination in &lt;15 ms!
          </p>
        </div>
      </div>

      <div class="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs leading-relaxed">
        <strong class="font-bold text-blue-300 uppercase tracking-wider block mb-1">Dynamic Traffic Overlay (Page 110):</strong>
        Static road network topology is precomputed into offline graph hierarchies. Live traffic speeds (derived from streaming GPS probe aggregates) are applied as dynamic edge-weight multipliers. The Route Planner runs bidirectional $A^*$ with a haversine distance heuristic across the contracted graph.
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 111)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Google Maps succeeds by dividing responsibilities: serve static vector map tiles from the edge via CDN caching (4^z tile pyramid), ingest 10^6 GPS writes/sec through edge Kafka stream aggregation, and compute routes using Contraction Hierarchies with real-time traffic weights rather than brute-force Dijkstra."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
