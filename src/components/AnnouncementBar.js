import { CONFIG } from '../config.js';

export function renderAnnouncementBar() {
  return `
    <!-- Top Announcement Bar -->
    <div class="w-full bg-[#0D1322] py-2 text-center border-b border-white/[0.06]">
      <div class="max-w-[75rem] mx-auto px-4 flex items-center justify-center gap-2 flex-wrap">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-code text-[11px] font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Instant access
        </span>
        <p class="font-code text-[12px] text-slate-300 tracking-tight font-medium">
          Your personal interview prep system <span class="text-slate-500 mx-1">•</span> One-time purchase of <span class="text-white font-semibold">${CONFIG.PRICE}</span>
        </p>
      </div>
    </div>
  `;
}
