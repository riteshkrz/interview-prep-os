/**
 * Proximity Search: Geohash and Quadtree (Topic 9.1 - Design Yelp)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 105–108
 */

export function renderProximitySearchContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="proximity-search">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 9.1 · Pages 105–108
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Applied Geospatial Design
          </span>
        </div>
        <span class="text-xs font-mono text-slate-400">1.71 GB Full-World Sizing · 3×3 Geohash Expansion · Uber H3 vs S2</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Proximity Search: Geohash & Quadtree (Design Yelp)</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Given a user's latitude and longitude and a search radius, how do we return nearby businesses in sub-50ms? Calculating euclidean or haversine distance across hundreds of millions of database rows is intractable ($O(N)$ scan). Proximity search maps 2D continuous coordinates into 1D sortable spatial tokens that standard B-tree database indexes can resolve in logarithmic time.
      </p>
    </div>

    <!-- The 1.71 GB Sizing Drill (The Senior Candidate Move) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The Sizing Math That Decides the Architecture (Page 107)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 space-y-2">
        <div class="text-white font-bold">// Back-of-the-Envelope: 200 Million Global Businesses</div>
        <div class="text-slate-300">
          • Business ID (8 bytes) + Latitude (8 bytes) + Longitude (8 bytes) + Geohash (8 bytes) = 32 bytes/record<br/>
          • 200,000,000 businesses × 32 bytes ≈ <span class="text-emerald-400 font-bold">6.4 GB raw data</span><br/>
          • Quadtree In-Memory Index (nodes + pointers + leaf lists) ≈ <span class="text-amber-400 font-bold">1.71 GB RAM total!</span>
        </div>
        <div class="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 mt-2 font-sans">
          <strong>The Architectural Deduction:</strong> Because the entire global geospatial index fits in <strong>under 2 GB of RAM</strong>, you do NOT need complex distributed database sharding or cross-partition map-reduce queries! The entire index easily resides in the working set of a single modern server (64–128 GB RAM). Scale read traffic using stateless <strong>Read Replicas</strong> behind a load balancer.
        </div>
      </div>
    </div>

    <!-- Geohash vs Quadtree Comparison -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        Geohash vs. Quadtree: The Core Architectural Comparison (Page 107)
      </h3>
      <div class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#141C2E] text-slate-300 border-b border-slate-800">
              <th class="p-3 font-semibold">Dimension</th>
              <th class="p-3 font-semibold text-cyan-300">Geohash (Base-32 String)</th>
              <th class="p-3 font-semibold text-purple-300">Quadtree (Hierarchical In-Memory)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-[#0A0E17]/60">
            <tr>
              <td class="p-3 font-medium text-white">Where It Lives</td>
              <td class="p-3 text-cyan-200">Standard column + B-tree index in Postgres / DynamoDB</td>
              <td class="p-3 text-purple-200">Custom in-memory tree on each LBS application server</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Uneven Density</td>
              <td class="p-3 text-slate-400">Fixed grid: ocean has 0 items; downtown NY has 20,000</td>
              <td class="p-3 text-purple-200">Adaptive depth: splits recursively until node has &le;100 items</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Database Updates</td>
              <td class="p-3 text-emerald-300 font-bold">Trivial: Single standard SQL UPDATE or INSERT</td>
              <td class="p-3 text-rose-300">Complex: In-place pointer mutation with thread locking</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">Startup & Deployments</td>
              <td class="p-3 text-emerald-300 font-bold">Instant: Servers are completely stateless</td>
              <td class="p-3 text-rose-300">Cold boot takes minutes to rebuild 200M node tree</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-white">K-Nearest Neighbors</td>
              <td class="p-3 text-slate-300">Requires searching 3×3 neighbor cells + distance sort</td>
              <td class="p-3 text-purple-200">Natural: Traverse leaf and borrow from parent quadrant</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- The Boundary Problem & 3x3 Expansion -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        The Geohash Cell Boundary Trap: Why LIKE '01%' Fails (Page 106)
      </h3>
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3 leading-relaxed">
        <p class="text-slate-300">
          <strong class="text-rose-400">The Failure Mode:</strong> Two restaurants can be <strong>5 meters apart</strong> across a street, yet share ZERO common geohash prefixes if that street is the boundary of a geohash tile (in the worst case, crossing the Prime Meridian or Equator where the first character flips). A single prefix search <code class="text-cyan-300">WHERE geohash LIKE 'dr5r%'</code> will completely miss the restaurant 5 meters away!
        </p>
        <div class="p-3.5 rounded-lg bg-[#0A0E17] border border-cyan-500/30 text-cyan-200 font-mono">
          <div class="text-white font-bold mb-2">// The Production SQL Query: Always Query 3×3 Neighbourhood</div>
<pre class="text-slate-300">
SELECT business_id, lat, lng
FROM business_locations
WHERE geohash_6 IN (
  :center,      -- The cell containing the user
  :n, :ne, :e,  -- Top and right cells
  :se, :s, :sw, -- Bottom cells
  :w, :nw       -- Left and top-left cells
);
-- Then calculate exact haversine distance in memory and sort by distance
</pre>
        </div>
      </div>
    </div>

    <!-- Modern Standards: Google S2 vs Uber H3 -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
        Modern Production Alternatives: Google S2 & Uber H3 (Page 107)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="font-bold text-cyan-300 mb-1">Google S2 (Hilbert Space-Filling Curve)</div>
          <p class="text-slate-300 leading-relaxed">
            Projects a sphere onto a cube, dividing faces hierarchically with a Hilbert Curve. Unlike standard Geohash which has discontinuous jumps, the Hilbert Curve guarantees exceptional 1D spatial locality: points close on the curve are almost always close in 2D space.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="font-bold text-purple-300 mb-1">Uber H3 (Hexagonal Hierarchical Spatial Index)</div>
          <p class="text-slate-300 leading-relaxed">
            Partitions the earth into regular hexagons. <em>Why Hexagons?</em> A square grid has 2 different neighbor distances (orthogonal is $1.0\times$, diagonal is $\sqrt{2}\approx 1.414\times$). A hexagon has <strong>exact uniform distance to all 6 neighbors</strong>, drastically simplifying radius searches, surge pricing, and ride-hailing dispatch!
          </p>
        </div>
      </div>
    </div>

    <!-- Cache Key Strategy -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        Cache Key Design: Preventing Cache-Miss Stampedes (Page 108)
      </h3>
      <div class="p-4 rounded-xl bg-[#141C2E] border border-emerald-500/20 text-xs space-y-2 leading-relaxed">
        <p class="text-slate-300">
          Never cache proximity search results by raw GPS coordinates: <code class="text-rose-300">cache:lat=37.774929:lng=-122.419416</code>. Because floating point GPS coordinates fluctuate with micro-movements, the cache hit ratio will be <strong>near 0%</strong>!
        </p>
        <p class="text-emerald-300 font-mono">
          ✓ Correct Strategy: Round the user's GPS coordinates to a Geohash-6 prefix (e.g. 1.2 km × 0.6 km box):<br/>
          Key = <code class="text-white">cache:proximity:geohash6:dr5ru7:filter:restaurants</code><br/>
          Thousands of users standing within that neighborhood block hit the exact same cached response!
        </p>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 108)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "Proximity search is about reducing 2D space to 1D ordered keys so standard B-tree indexes do the heavy lifting. Ship Geohash for simplicity and stateless deployments, always expand queries to the 3×3 neighbor grid to defeat boundary blindness, quote the 1.71 GB sizing to justify read replicas over sharding, and cache by geohash tile to achieve high cache hit rates."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
