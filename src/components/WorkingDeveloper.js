export function renderWorkingDeveloper() {
  return `
    <!-- Working Developer Section -->
    <section class="w-full py-16 bg-[#0D1322] border-y border-white/[0.08]">
      <div class="max-w-[75rem] mx-auto px-4 md:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <span class="font-code text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">Real-World Engineering Realities</span>
            <h2 class="font-headline text-[28px] md:text-[36px] font-semibold text-white leading-tight tracking-tight">
              Built for People Who Already Have a Job.
            </h2>
            <p class="font-body text-[15px] text-slate-300 leading-relaxed">
              This isn't a 6-hour-a-day interview bootcamp. It's designed for engineers dealing with:
            </p>
            <!-- List of realities -->
            <div class="grid grid-cols-2 gap-3 pt-1 pb-2">
              <div class="flex items-center gap-2 font-body text-[13px] text-slate-200">
                <span class="material-symbols-outlined text-[16px] text-indigo-400">work</span> Full-time job & standups
              </div>
              <div class="flex items-center gap-2 font-body text-[13px] text-slate-200">
                <span class="material-symbols-outlined text-[16px] text-indigo-400">groups</span> Endless sprint meetings
              </div>
              <div class="flex items-center gap-2 font-body text-[13px] text-slate-200">
                <span class="material-symbols-outlined text-[16px] text-indigo-400">warning</span> Tight product deadlines
              </div>
              <div class="flex items-center gap-2 font-body text-[13px] text-slate-200">
                <span class="material-symbols-outlined text-[16px] text-indigo-400">home</span> Family commitments
              </div>
            </div>
            <p class="font-body text-[13px] text-slate-300">
              You don't need to study all day. You need a realistic process you can actually follow without compromising your current job performance or mental health.
            </p>
          </div>

          <div class="lg:col-span-5 bg-[#151D2F] p-6 md:p-7 rounded-lg border border-white/[0.12] shadow-xl flex flex-col justify-between space-y-5">
            <div class="space-y-2.5">
              <span class="font-code text-[11px] text-[#38BDF8] uppercase tracking-widest font-semibold">The Core Principle</span>
              <div class="font-headline text-[32px] md:text-[36px] leading-tight text-white font-bold tracking-tight">
                Consistency &gt; Intensity.
              </div>
              <p class="font-body text-[13px] text-slate-300 leading-relaxed">
                1 focused hour every day for 45 consecutive days beats an erratic 10-hour Sunday sprint that leaves you drained on Monday morning.
              </p>
            </div>
            <!-- Highlight Box -->
            <div class="p-3.5 rounded-md bg-[#0D1322] border border-white/[0.08] flex items-center gap-3">
              <div class="w-7 h-7 rounded-sm bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[16px]">timer</span>
              </div>
              <span class="font-body text-[12px] font-medium text-slate-200">
                Designed around focused 45–60 minute preparation sessions.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
