/**
 * 0.4 Numbers Every Engineer Should Memorise - Visual Guide
 * Physical Computing Constants & Availability SLAs
 * based on The Modern System Design Interview Guide (Page 8).
 * Supports pristine Light and Dark themes with maximum contrast and readability.
 */

export function renderNumbersToMemoriseContent(topic) {
  const latencyRows = [
    {
      operation: "L1 cache reference",
      latency: "0.5–1 ns",
      implication: "Register/L1 speed benchmark",
      latencyNs: 1,
      badge: "On-Chip",
      badgeColor: "text-[#0284C7] dark:text-cyan-400 bg-[#F0F9FF] dark:bg-cyan-500/15 border-[#BAE6FD] dark:border-cyan-500/30"
    },
    {
      operation: "Branch mispredict",
      latency: "3–5 ns",
      implication: "Pipeline flush penalty",
      latencyNs: 4,
      badge: "CPU Pipeline",
      badgeColor: "text-[#0284C7] dark:text-cyan-400 bg-[#F0F9FF] dark:bg-cyan-500/15 border-[#BAE6FD] dark:border-cyan-500/30"
    },
    {
      operation: "L2 cache reference",
      latency: "3–7 ns",
      implication: "~10× slower than L1",
      latencyNs: 5,
      badge: "On-Chip",
      badgeColor: "text-[#0284C7] dark:text-cyan-400 bg-[#F0F9FF] dark:bg-cyan-500/15 border-[#BAE6FD] dark:border-cyan-500/30"
    },
    {
      operation: "Mutex lock/unlock",
      latency: "~17 ns",
      implication: "Why lock-free & ring buffers win (sec. 7.4)",
      latencyNs: 17,
      badge: "Concurrency",
      badgeColor: "text-[#4F46E5] dark:text-indigo-400 bg-[#F5F3FF] dark:bg-indigo-500/15 border-[#DDD6FE] dark:border-indigo-500/30"
    },
    {
      operation: "Main memory (RAM) reference",
      latency: "~100 ns",
      implication: "Redis / Memcached speed benchmark",
      latencyNs: 100,
      badge: "RAM",
      badgeColor: "text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-emerald-500/15 border-[#A7F3D0] dark:border-emerald-500/30"
    },
    {
      operation: "Read 1 MB sequentially from memory",
      latency: "~100 µs (0.1 ms)",
      implication: "Sequential access is king (sec. 7.2)",
      latencyNs: 100000,
      badge: "Sequential",
      badgeColor: "text-[#0D9488] dark:text-teal-400 bg-[#F0FDF4] dark:bg-teal-500/15 border-[#BBF7D0] dark:border-teal-500/30"
    },
    {
      operation: "Round trip within a datacenter",
      latency: "~0.5 ms",
      implication: "Chatty microservices die here: 20 hops = 10 ms floor",
      latencyNs: 500000,
      badge: "Intra-DC",
      badgeColor: "text-[#D97706] dark:text-amber-400 bg-[#FFFBEB] dark:bg-amber-500/15 border-[#FDE68A] dark:border-amber-500/30"
    },
    {
      operation: "Read 1 MB sequentially from SSD",
      latency: "~1 ms",
      implication: "~10× slower than RAM",
      latencyNs: 1000000,
      badge: "SSD I/O",
      badgeColor: "text-[#EA580C] dark:text-orange-400 bg-[#FFF7ED] dark:bg-orange-500/15 border-[#FED7AA] dark:border-orange-500/30"
    },
    {
      operation: "Disk seek (HDD)",
      latency: "~10 ms",
      implication: "Why LSM-trees avoid random writes (sec. 4.9)",
      latencyNs: 10000000,
      badge: "Mechanical",
      badgeColor: "text-[#E11D48] dark:text-rose-400 bg-[#FFF1F2] dark:bg-rose-500/15 border-[#FECDD3] dark:border-rose-500/30"
    },
    {
      operation: "DNS lookup",
      latency: "20–120 ms",
      implication: "Cache aggressively; pre-resolve (sec. 2.3)",
      latencyNs: 60000000,
      badge: "Ingress",
      badgeColor: "text-[#D97706] dark:text-yellow-400 bg-[#FEFCE8] dark:bg-yellow-500/15 border-[#FEF08A] dark:border-yellow-500/30"
    },
    {
      operation: "Round trip CA → Netherlands",
      latency: "~150 ms",
      implication: "Why CDNs and edge PoPs exist (sec. 2.5)",
      latencyNs: 150000000,
      badge: "Transcontinental",
      badgeColor: "text-[#DB2777] dark:text-pink-400 bg-[#FDF2F8] dark:bg-pink-500/15 border-[#FBCFE8] dark:border-pink-500/30"
    }
  ];

  const availabilityRows = [
    {
      availability: '99% ("two nines")',
      downtimeYear: "3.65 days",
      downtimeMonth: "7.3 hours",
      typicalTier: "Internal tooling",
      badgeColor: "text-[#475569] dark:text-slate-300 bg-[#F1F5F9] dark:bg-slate-800 border-[#CBD5E1] dark:border-slate-700"
    },
    {
      availability: "99.9%",
      downtimeYear: "8.77 hours",
      downtimeMonth: "43.8 minutes",
      typicalTier: "Standard SaaS SLA",
      badgeColor: "text-[#0284C7] dark:text-cyan-400 bg-[#F0F9FF] dark:bg-cyan-500/15 border-[#BAE6FD] dark:border-cyan-500/30"
    },
    {
      availability: "99.99%",
      downtimeYear: "52.6 minutes",
      downtimeMonth: "4.4 minutes",
      typicalTier: "Payments, core APIs",
      badgeColor: "text-[#D97706] dark:text-amber-400 bg-[#FFFBEB] dark:bg-amber-500/15 border-[#FDE68A] dark:border-amber-500/30"
    },
    {
      availability: "99.999%",
      downtimeYear: "5.26 minutes",
      downtimeMonth: "26 seconds",
      typicalTier: "Telco, exchanges — needs multi-region + automated failover",
      badgeColor: "text-[#E11D48] dark:text-rose-400 bg-[#FFF1F2] dark:bg-rose-500/15 border-[#FECDD3] dark:border-rose-500/30"
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 animate-fadeIn text-[#0F172A] dark:text-slate-200">

      <!-- ================================================================= -->
      <!-- EXACT PAGE 8 DOCUMENT CONTAINER: MATCHES THE GUIDE FAITHFULLY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#24314A] shadow-sm dark:shadow-2xl p-6 sm:p-8 flex flex-col gap-6 select-text cursor-default">
        
        <!-- Header: Purple Accent + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <!-- Purple Left Bar (reproducing original book styling) -->
            <div class="w-1.5 h-7 bg-[#4F46E5] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              0.4 Numbers Every Engineer Should Memorise
            </h2>
          </div>
          
          <!-- Subtitle / Guiding Rule -->
          <p class="text-[14px] sm:text-[15px] text-[#475569] dark:text-slate-300 leading-relaxed pl-4 font-sans">
            You cannot reason about a design without knowing the cost of each hop. Memorise the order of magnitude, not the digits.
          </p>
        </div>

        <!-- Book Footer / Header Separation Line -->
        <div class="flex items-center justify-between pt-2 pb-3 border-b border-[#E2E8F0] dark:border-[#24314A]/70 text-[11px] font-code text-[#64748B] dark:text-slate-400">
          <span class="flex items-center gap-1.5 text-[#475569] dark:text-slate-300 font-semibold">
            <span class="material-symbols-outlined text-[14px] text-[#4F46E5] dark:text-indigo-400">menu_book</span>
            The Modern System Design Interview Guide
          </span>
          <span class="font-semibold text-[#0F172A] dark:text-slate-300 bg-[#F8FAFC] dark:bg-[#0A0E1A] px-2.5 py-0.5 rounded border border-[#E2E8F0] dark:border-[#24314A]">
            Page 8
          </span>
        </div>

        <!-- =============================================================== -->
        <!-- TABLE 1: LATENCY AT A GLANCE -->
        <!-- =============================================================== -->
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center justify-between">
            <h3 class="font-code text-[12px] font-bold text-[#0F172A] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#0284C7] dark:bg-cyan-400"></span>
              LATENCY AT A GLANCE
            </h3>
            <span class="text-[11px] font-code text-[#64748B] dark:text-slate-400 hidden sm:inline-block">Physical computing constants</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-[#24314A] shadow-xs bg-white dark:bg-[#0A0E1A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#F1F5F9] dark:bg-[#1E2356] border-b border-[#CBD5E1] dark:border-[#2A3470] text-[#0F172A] dark:text-white text-[12px] font-sans font-bold tracking-wide">
                  <th class="py-3 px-4 sm:px-5 w-[38%]">Operation</th>
                  <th class="py-3 px-4 sm:px-5 w-[22%]">Latency</th>
                  <th class="py-3 px-4 sm:px-5 w-[40%]">Design implication</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-[13px] font-sans">
                ${latencyRows.map((row, idx) => `
                  <tr class="hover:bg-[#F8FAFC] dark:hover:bg-[#151D2F] transition-colors ${idx % 2 === 1 ? 'bg-[#F8FAFC] dark:bg-[#0D1322]/60' : 'bg-white dark:bg-[#0A0E1A]'}">
                    <td class="py-3 px-4 sm:px-5 text-[#0F172A] dark:text-slate-100 font-medium">
                      ${escapeHtml(row.operation)}
                    </td>
                    <td class="py-3 px-4 sm:px-5 font-mono font-bold text-[#0284C7] dark:text-cyan-300 whitespace-nowrap">
                      ${escapeHtml(row.latency)}
                    </td>
                    <td class="py-3 px-4 sm:px-5 text-[#475569] dark:text-slate-300 leading-snug">
                      ${formatImplication(row.implication)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- =============================================================== -->
        <!-- 3 QUICK CONVERSION STAT CARDS -->
        <!-- =============================================================== -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-1 select-text">
          <!-- Card 1: 1 M/day -->
          <div class="rounded-xl p-4 bg-[#F0F9FF] dark:bg-[#181F3B] border border-[#BAE6FD] dark:border-[#2D396B] shadow-xs flex flex-col items-center justify-center text-center gap-1">
            <span class="text-[24px] sm:text-[28px] font-black text-[#0F172A] dark:text-white tracking-tight font-sans">
              1 M/day
            </span>
            <span class="text-[13px] font-bold text-[#0284C7] dark:text-cyan-300 font-mono tracking-wide">
              &approx; 12 QPS
            </span>
          </div>

          <!-- Card 2: 1 B/day -->
          <div class="rounded-xl p-4 bg-[#F0F9FF] dark:bg-[#181F3B] border border-[#BAE6FD] dark:border-[#2D396B] shadow-xs flex flex-col items-center justify-center text-center gap-1">
            <span class="text-[24px] sm:text-[28px] font-black text-[#0F172A] dark:text-white tracking-tight font-sans">
              1 B/day
            </span>
            <span class="text-[13px] font-bold text-[#0284C7] dark:text-cyan-300 font-mono tracking-wide">
              &approx; 12 K QPS
            </span>
          </div>

          <!-- Card 3: 1 KB x 10 K QPS -->
          <div class="rounded-xl p-4 bg-[#F0F9FF] dark:bg-[#181F3B] border border-[#BAE6FD] dark:border-[#2D396B] shadow-xs flex flex-col items-center justify-center text-center gap-1">
            <span class="text-[24px] sm:text-[28px] font-black text-[#0F172A] dark:text-white tracking-tight font-sans">
              1 KB &times; 10 K QPS
            </span>
            <span class="text-[13px] font-bold text-[#0284C7] dark:text-cyan-300 font-mono tracking-wide">
              &approx; 80 MBPS
            </span>
          </div>
        </div>

        <!-- =============================================================== -->
        <!-- TABLE 2: AVAILABILITY BUDGETS -->
        <!-- =============================================================== -->
        <div class="flex flex-col gap-2.5 mt-1">
          <div class="flex items-center justify-between">
            <h3 class="font-code text-[12px] font-bold text-[#0F172A] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#4F46E5] dark:bg-indigo-400"></span>
              AVAILABILITY BUDGETS &mdash; KNOW THESE BEFORE YOU PROMISE "FIVE NINES"
            </h3>
            <span class="text-[11px] font-code text-[#64748B] dark:text-slate-400 hidden sm:inline-block">Annual &amp; monthly downtime SLAs</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-[#24314A] shadow-xs bg-white dark:bg-[#0A0E1A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#F1F5F9] dark:bg-[#1E2356] border-b border-[#CBD5E1] dark:border-[#2A3470] text-[#0F172A] dark:text-white text-[12px] font-sans font-bold tracking-wide">
                  <th class="py-3 px-4 sm:px-5 w-[24%]">Availability</th>
                  <th class="py-3 px-4 sm:px-5 w-[20%]">Downtime / year</th>
                  <th class="py-3 px-4 sm:px-5 w-[20%]">Downtime / month</th>
                  <th class="py-3 px-4 sm:px-5 w-[36%]">Typical tier</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-[13px] font-sans">
                ${availabilityRows.map((row, idx) => `
                  <tr class="hover:bg-[#F8FAFC] dark:hover:bg-[#151D2F] transition-colors ${idx % 2 === 1 ? 'bg-[#F8FAFC] dark:bg-[#0D1322]/60' : 'bg-white dark:bg-[#0A0E1A]'}">
                    <td class="py-3 px-4 sm:px-5 font-bold text-[#0F172A] dark:text-white whitespace-nowrap">
                      ${escapeHtml(row.availability)}
                    </td>
                    <td class="py-3 px-4 sm:px-5 font-mono font-bold text-[#D97706] dark:text-amber-300 whitespace-nowrap">
                      ${escapeHtml(row.downtimeYear)}
                    </td>
                    <td class="py-3 px-4 sm:px-5 font-mono text-[#475569] dark:text-slate-300 whitespace-nowrap">
                      ${escapeHtml(row.downtimeMonth)}
                    </td>
                    <td class="py-3 px-4 sm:px-5 text-[#334155] dark:text-slate-200 leading-snug">
                      ${escapeHtml(row.typicalTier)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- =============================================================== -->
        <!-- CALLOUT 1: WATCH OUT -->
        <!-- =============================================================== -->
        <div class="rounded-xl bg-[#FFFBEB] dark:bg-[#1C1610] border-l-4 border-[#D97706] dark:border-amber-500 border-r border-t border-b border-[#FDE68A] dark:border-amber-500/30 p-4 sm:p-5 flex flex-col gap-2 shadow-xs">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#D97706] dark:text-amber-400 uppercase tracking-wider">
              WATCH OUT
            </span>
          </div>
          <p class="text-[13.5px] sm:text-[14px] text-[#92400E] dark:text-slate-200 leading-relaxed font-sans">
            <strong class="text-[#0F172A] dark:text-white">Serial dependencies multiply:</strong> a service calling five 99.9% dependencies has a theoretical ceiling of <span class="font-mono text-[#B45309] dark:text-amber-300 font-bold">99.9%⁵ &approx; 99.5%</span>. Either reduce the number of synchronous dependencies, or make them optional with fallbacks <span class="text-[#D97706] dark:text-amber-400 font-code text-[12px] font-bold">(sec. 8.2)</span>. Interviewers love this arithmetic because it forces you to defend synchronous fan-out.
          </p>
        </div>

        <!-- =============================================================== -->
        <!-- CALLOUT 2: KEY INTERVIEW TAKEAWAY -->
        <!-- =============================================================== -->
        <div class="rounded-xl bg-[#F5F3FF] dark:bg-[#1F2052] border border-[#DDD6FE] dark:border-indigo-500/40 p-5 sm:p-6 flex flex-col gap-2.5 shadow-xs">
          <div class="flex items-center gap-2 text-[#4F46E5] dark:text-indigo-300 font-code text-[11px] font-bold uppercase tracking-wider">
            <span class="material-symbols-outlined text-[16px] text-[#4F46E5] dark:text-indigo-400">lightbulb</span>
            <span>KEY INTERVIEW TAKEAWAY</span>
          </div>
          <p class="text-[14px] sm:text-[14.5px] text-[#0F172A] dark:text-white leading-relaxed font-sans">
            Quote <strong class="text-[#0284C7] dark:text-cyan-300 underline decoration-[#BAE6FD] dark:decoration-cyan-400/50 underline-offset-2">one</strong> concrete number per design decision. <em class="text-[#4338CA] dark:text-indigo-100 font-sans font-medium">"A cross-region round trip is ~150 ms, so synchronous replication would blow our 200 ms p99 budget — I'll replicate asynchronously and accept read-your-writes repair"</em> is a complete senior-level argument in a single sentence.
          </p>
        </div>

        <!-- Static Footer Reference -->
        <div class="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-[#24314A]/70 text-[11.5px] text-[#64748B] dark:text-slate-400 select-text">
          <span class="flex items-center gap-1.5 font-code">
            <span class="material-symbols-outlined text-[14px] text-[#4F46E5] dark:text-indigo-400">verified</span>
            The Modern System Design Interview Guide &bull; Page 8
          </span>
          <span class="font-code text-[11px] text-[#94A3B8] dark:text-slate-500 font-semibold">
            Physical Computing Constants &amp; Availability SLAs
          </span>
        </div>

      </div>

    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatImplication(text) {
  if (!text) return '';
  // Highlight section references like (sec. 5.4, sec. 6.2)
  const escaped = escapeHtml(text);
  return escaped.replace(/\(sec\.\s*[\d\.]+(?:,\s*sec\.\s*[\d\.]+)*\)/gi, match => {
    return `<span class="text-[#0284C7] dark:text-cyan-400/90 font-code text-[11px] font-bold bg-[#F0F9FF] dark:bg-cyan-950/40 px-1.5 py-0.5 rounded border border-[#BAE6FD] dark:border-cyan-500/20">${match}</span>`;
  });
}
