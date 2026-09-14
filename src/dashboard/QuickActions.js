export function renderQuickActions() {
  return `
    <div class="bg-[#141C2E] border border-[#24314A] rounded-md p-5 flex flex-col gap-2.5 shadow-sm shadow-black/40">
      <span class="font-code text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">Quick Actions</span>
      <div class="grid grid-cols-1 gap-1.5">
        <button id="quick-action-log-btn" class="flex items-center justify-between p-2.5 rounded-md bg-[#0F1626] border border-[#24314A] hover:border-[#6366F1]/50 hover:bg-[#182238] transition-all text-left group">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded bg-[#182238] border border-[#24314A] flex items-center justify-center text-[#38BDF8]">
              <span class="material-symbols-outlined text-[15px]">add_circle</span>
            </span>
            <div class="flex flex-col">
              <span class="font-sans text-[12px] font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">Log New Solved Problem</span>
              <span class="font-sans text-[10px] text-[#94A3B8]">Record runtime, pattern tag &amp; notes</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-[15px] text-[#64748B] group-hover:text-[#F8FAFC] transition-colors">chevron_right</span>
        </button>

        <button id="quick-action-mock-btn" class="flex items-center justify-between p-2.5 rounded-md bg-[#0F1626] border border-[#24314A] hover:border-[#6366F1]/50 hover:bg-[#182238] transition-all text-left group">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded bg-[#182238] border border-[#24314A] flex items-center justify-center text-[#818CF8]">
              <span class="material-symbols-outlined text-[15px]">play_circle</span>
            </span>
            <div class="flex flex-col">
              <span class="font-sans text-[12px] font-semibold text-[#F8FAFC] group-hover:text-[#818CF8] transition-colors">Start Mock System Design</span>
              <span class="font-sans text-[10px] text-[#94A3B8]">Launch 45-min whiteboard simulation</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-[15px] text-[#64748B] group-hover:text-[#F8FAFC] transition-colors">chevron_right</span>
        </button>

        <button id="quick-action-cheatsheet-btn" class="flex items-center justify-between p-2.5 rounded-md bg-[#0F1626] border border-[#24314A] hover:border-[#6366F1]/50 hover:bg-[#182238] transition-all text-left group">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded bg-[#182238] border border-[#24314A] flex items-center justify-center text-[#10B981]">
              <span class="material-symbols-outlined text-[15px]">menu_book</span>
            </span>
            <div class="flex flex-col">
              <span class="font-sans text-[12px] font-semibold text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">Open Cheatsheets &amp; Blueprints</span>
              <span class="font-sans text-[10px] text-[#94A3B8]">Back-of-envelope math &amp; high-frequency workspaces</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-[15px] text-[#64748B] group-hover:text-[#F8FAFC] transition-colors">open_in_new</span>
        </button>

        <a href="#/blog" id="quick-action-blog-btn" class="flex items-center justify-between p-2.5 rounded-md bg-[#0F1626] border border-[#24314A] hover:border-[#6366F1]/50 hover:bg-[#182238] transition-all text-left group">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded bg-[#182238] border border-[#24314A] flex items-center justify-center text-[#F59E0B]">
              <span class="material-symbols-outlined text-[15px]">article</span>
            </span>
            <div class="flex flex-col">
              <span class="font-sans text-[12px] font-semibold text-[#F8FAFC] group-hover:text-[#F59E0B] transition-colors">Engineering Case Studies</span>
              <span class="font-sans text-[10px] text-[#94A3B8]">Stripe, Uber, Netflix &amp; Discord architectures</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-[15px] text-[#64748B] group-hover:text-[#F8FAFC] transition-colors">chevron_right</span>
        </a>
      </div>
    </div>
  `;
}
