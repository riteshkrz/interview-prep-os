export function renderWhoItsFor() {
  return `
    <!-- Who It's For Section -->
    <section class="w-full py-16 bg-[#0D1322] border-y border-white/[0.08]" id="who-its-for">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6">
        <div class="max-w-3xl mx-auto text-center mb-10">
          <span class="font-code text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">Strict Compatibility</span>
          <h2 class="font-headline text-[28px] md:text-[36px] font-semibold text-white mt-1 mb-2.5 tracking-tight">
            Is This For You?
          </h2>
          <p class="font-body text-[15px] text-slate-300">
            We believe in complete transparency about who will get maximum leverage from this system.
          </p>
        </div>

        <!-- Two-Column Comparison Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <!-- Left: Perfect For -->
          <div class="bg-[#151D2F] p-6 md:p-7 rounded-lg border border-emerald-500/30 shadow-xs space-y-4">
            <div class="flex items-center gap-2 text-white border-b border-white/[0.08] pb-3">
              <span class="material-symbols-outlined text-[20px] text-[#10B981]">check_circle</span>
              <h3 class="font-sans text-[16px] font-semibold">Perfect for</h3>
            </div>
            <ul class="space-y-3 font-body text-[13px] text-slate-300">
              <li class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[16px] shrink-0 mt-0.5">check</span>
                <span>Software Engineers actively preparing for upcoming technical interviews at product companies and tier-1 tech firms.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[16px] shrink-0 mt-0.5">check</span>
                <span>Engineers targeting Senior Software Engineer (L5 / L6) roles who need structure for both DSA and System Design.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[16px] shrink-0 mt-0.5">check</span>
                <span>Working professionals with limited preparation time (1–2 hours max per evening) who need zero time wasted.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[#10B981] text-[16px] shrink-0 mt-0.5">check</span>
                <span>Engineers overwhelmed by hundreds of bookmarks, Discord channels, and disjointed prep spreadsheets.</span>
              </li>
            </ul>
          </div>

          <!-- Right: Not Designed For -->
          <div class="bg-[#151D2F] p-6 md:p-7 rounded-lg border border-white/[0.08] shadow-xs space-y-4">
            <div class="flex items-center gap-2 text-white border-b border-white/[0.08] pb-3">
              <span class="material-symbols-outlined text-[20px] text-slate-500">cancel</span>
              <h3 class="font-sans text-[16px] font-semibold">Not designed for</h3>
            </div>
            <ul class="space-y-3 font-body text-[13px] text-slate-400">
              <li class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-rose-400 text-[16px] shrink-0 mt-0.5">close</span>
                <span>Complete programming beginners who have never written code or studied basic algorithms.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-rose-400 text-[16px] shrink-0 mt-0.5">close</span>
                <span>People looking for a video tutorial coding course (this is a high-productivity operational system, not a lecture series).</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-rose-400 text-[16px] shrink-0 mt-0.5">close</span>
                <span>People expecting a guaranteed interview offer without doing the disciplined daily practice.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Note Callout -->
        <div class="text-center font-body text-[13px] text-slate-400">
          <p class="inline-block px-3.5 py-1.5 rounded-md bg-[#151D2F] border border-white/[0.08] shadow-xs">
            <span class="font-semibold text-white">Note:</span> This is a preparation system — not a magic formula. Consistency is on you.
          </p>
        </div>
      </div>
    </section>
  `;
}
