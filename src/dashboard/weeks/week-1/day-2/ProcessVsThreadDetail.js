/**
 * 1.1 Process vs. Thread - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 10 & 11
 * from The Modern System Design Interview Guide.
 */

export function renderProcessVsThreadContent(topic) {
  const concurrencyModels = [
    {
      model: "Process per request",
      cost: "MBs, ~1 ms spawn",
      scheduledBy: "OS kernel (preemptive)",
      failsAt: "Anything high concurrency; used for isolation, not throughput",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      model: "Thread per request",
      cost: "~1 MB stack, ~10–100 µs",
      scheduledBy: "OS kernel (preemptive)",
      failsAt: "~10 K threads — context switch and memory overhead dominate",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      model: "Coroutine / green thread",
      cost: "~KBs, ~ns–µs",
      scheduledBy: "Language runtime (cooperative)",
      failsAt: "CPU-bound work or a blocking syscall stalls the carrier thread",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      model: "Event loop (single thread)",
      cost: "One stack total",
      scheduledBy: "Application (callbacks)",
      failsAt: "Any CPU-heavy handler blocks everything (Redis, Node.js)",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you list and inspect running processes in Linux?",
      answer: `<strong>ps aux</strong> or <strong>ps -ef</strong> for a snapshot, <strong>top</strong>/<strong>htop</strong> live, <strong>pgrep -a &lt;name&gt;</strong> to find by name, <strong>ps -L -p &lt;PID&gt;</strong> for its threads, and <strong>/proc/&lt;PID&gt;/status</strong> for the details. See sec. 8.3 for the diagnose toolkit.`
    },
    {
      qNum: "Q2",
      question: "How do you size a thread pool?",
      answer: `For CPU-bound work: <em>n</em> number of cores. For I/O-bound work use <strong>Little's Law</strong> — <strong>threads = target QPS × average latency</strong> (e.g. 500 QPS × 0.2 s = 100 threads). Then bound the queue in front of it, because an unbounded queue converts a throughput problem into an out-of-memory crash (sec. 8.2).`
    },
    {
      qNum: "Q3",
      question: "Why does Chrome use a process per tab rather than a thread per tab?",
      answer: `<strong>Isolation and security.</strong> A renderer crash or a memory-safety exploit is confined to one process, and the OS can reclaim memory cleanly. The cost is hundreds of MB of duplicated overhead — an explicit trade of memory for safety.`
    },
    {
      qNum: "Q4",
      question: "What actually happens during a context switch?",
      answer: `Save registers, program counter and stack pointer; switch the kernel's task struct; for a process switch also swap the page-table base register, which invalidates TLB entries and causes subsequent cache misses. That <strong>TLB/cache pollution</strong> — not the register save — is the real cost, which is why thread switches within a process are cheaper.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 10: FOUNDATIONS & ADDRESS SPACE VIEW -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        
        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              1.1 Process vs. Thread
            </h2>
          </div>
        </div>

        <!-- WHAT IT IS & WHY IT MATTERS Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- WHAT IT IS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              WHAT IT IS
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              A <strong>program</strong> is an executable file that contains a set of instructions and is stored passively on disk. A <strong>process</strong> is a program in execution. A <strong>thread</strong> is the smallest unit of execution within a process.
            </p>
          </div>

          <!-- WHY IT MATTERS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              WHY IT MATTERS
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              Every concurrency decision — thread pool sizing, worker model, isolation boundary — starts here. It is also the cheapest way for an interviewer to check whether you understand what your runtime is doing.
            </p>
          </div>
        </div>

        <!-- Core Explanatory Text -->
        <p class="text-[13.5px] text-slate-300 leading-relaxed font-sans">
          A single program can create multiple processes. For example, the Chrome browser creates a separate process for each tab. When a program is loaded into memory and becomes active, it becomes a process. A process requires essential resources such as registers, a program counter, and a stack.
        </p>

        <!-- Section: Relationship between program, process, and thread -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Relationship between program, process, and thread
          </h3>
          
          <div class="grid grid-cols-1 gap-2.5 pl-2">
            <div class="flex items-start gap-3 bg-[#141C2E]/60 border border-[#24314A]/60 rounded-lg p-3">
              <span class="w-6 h-6 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/40 text-[#818CF8] font-code text-[12px] font-bold flex items-center justify-center shrink-0">1</span>
              <p class="text-[13px] text-slate-300 leading-relaxed pt-0.5">
                The program contains a set of instructions.
              </p>
            </div>

            <div class="flex items-start gap-3 bg-[#141C2E]/60 border border-[#24314A]/60 rounded-lg p-3">
              <span class="w-6 h-6 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/40 text-[#818CF8] font-code text-[12px] font-bold flex items-center justify-center shrink-0">2</span>
              <p class="text-[13px] text-slate-300 leading-relaxed pt-0.5">
                The program is loaded into memory and becomes one or more running processes.
              </p>
            </div>

            <div class="flex items-start gap-3 bg-[#141C2E]/60 border border-[#24314A]/60 rounded-lg p-3">
              <span class="w-6 h-6 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/40 text-[#818CF8] font-code text-[12px] font-bold flex items-center justify-center shrink-0">3</span>
              <p class="text-[13px] text-slate-300 leading-relaxed pt-0.5">
                When a process starts, it is assigned memory and resources. A process can have one or more threads. For example, in Microsoft Word, one thread might handle spell checking while another handles text insertion.
              </p>
            </div>
          </div>
        </div>

        <!-- ADDRESS-SPACE VIEW (ASCII Visual Box Diagram) -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              ADDRESS-SPACE VIEW
            </span>
            <span class="text-[11px] font-code text-slate-500">Virtual Memory Architecture</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- PROCESS A -->
            <div class="flex flex-col gap-2.5 bg-[#0F1626] border border-cyan-500/30 rounded-lg p-4">
              <span class="font-code text-[11px] text-cyan-300 font-bold">
                PROCESS A (own address space)
              </span>

              <!-- Memory Segments -->
              <div class="border border-[#334155] rounded bg-[#0A0E1A] p-2 text-center text-slate-300 font-bold text-[11.5px] tracking-wide">
                | CODE | DATA | HEAP (shared) |
              </div>

              <!-- Threads inside Process A -->
              <div class="flex flex-col gap-1 pt-1 text-[11.5px] text-slate-300 pl-1 border-t border-[#1E293B]">
                <div class="text-cyan-200">T1: stack + registers + PC</div>
                <div class="text-cyan-200">T2: stack + registers + PC</div>
                <div class="text-cyan-200">T3: stack + registers + PC</div>
              </div>

              <div class="pt-2 text-[11px] font-code text-emerald-400 leading-tight">
                ▲ threads SHARE heap/code<br/>
                &nbsp;&nbsp;= cheap comms, no isolation
              </div>
            </div>

            <!-- PROCESS B -->
            <div class="flex flex-col gap-2.5 bg-[#0F1626] border border-indigo-500/30 rounded-lg p-4">
              <span class="font-code text-[11px] text-indigo-300 font-bold">
                PROCESS B (own address space)
              </span>

              <!-- Memory Segments -->
              <div class="border border-[#334155] rounded bg-[#0A0E1A] p-2 text-center text-slate-300 font-bold text-[11.5px] tracking-wide">
                | CODE | DATA | HEAP |
              </div>

              <!-- Threads inside Process B -->
              <div class="flex flex-col gap-1 pt-1 text-[11.5px] text-slate-300 pl-1 border-t border-[#1E293B]">
                <div class="text-indigo-200">T1: stack + registers + PC</div>
              </div>

              <div class="pt-2 text-[11px] font-code text-amber-400 leading-tight">
                ▲ processes share NOTHING<br/>
                &nbsp;&nbsp;= IPC needed, full isolation
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Main differences between processes and threads -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Main differences between processes and threads
          </h3>

          <ul class="flex flex-col gap-2 pl-2 text-[13px] text-slate-300 font-sans">
            <li class="flex items-start gap-2">
              <span class="text-[#818CF8] mt-1 font-bold">•</span>
              <span><strong class="text-white">Independence:</strong> Processes are usually independent, while threads exist as subsets of a process.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#818CF8] mt-1 font-bold">•</span>
              <span><strong class="text-white">Memory:</strong> Each process has its own memory space. Threads that belong to the same process share the same memory.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#818CF8] mt-1 font-bold">•</span>
              <span><strong class="text-white">Creation cost:</strong> A process is heavier to create and terminate than a thread.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#818CF8] mt-1 font-bold">•</span>
              <span><strong class="text-white">Context switching:</strong> Context switching is generally more expensive between processes.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#818CF8] mt-1 font-bold">•</span>
              <span><strong class="text-white">Communication:</strong> Inter-thread communication is usually faster because threads share memory within the same process.</span>
            </li>
          </ul>
        </div>

        <!-- Page 10 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 10</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 11: CONCURRENCY MODELS, DECISION MATRIX & FOLLOW-UPS -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Section: Concurrency models you should be able to compare -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Concurrency models you should be able to compare
          </h3>

          <!-- Responsive Comparison Table -->
          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3">Model</th>
                  <th class="p-3">Unit cost</th>
                  <th class="p-3">Scheduled by</th>
                  <th class="p-3">Fails at</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${concurrencyModels.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white">
                      <span class="px-2 py-0.5 rounded font-code text-[11px] border ${row.badgeColor}">
                        ${row.model}
                      </span>
                    </td>
                    <td class="p-3 font-code text-[12px] text-slate-300">${row.cost}</td>
                    <td class="p-3 text-slate-300">${row.scheduledBy}</td>
                    <td class="p-3 text-slate-300 font-medium">${row.failsAt}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Box: Answer to the Source's Own Question: Coroutine vs. Thread -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            ANSWER TO THE SOURCE'S OWN QUESTION: COROUTINE VS. THREAD
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            A thread is scheduled preemptively by the OS kernel; the kernel can interrupt it at any instruction. A coroutine is scheduled cooperatively by the language runtime in user space, and only yields at explicit suspension points (await, channel operations, I/O). Consequences: coroutines cost kilobytes instead of megabytes, switch without a kernel trap, and scale to millions — but one coroutine that never yields starves its carrier thread. Go goroutines, Kotlin coroutines, Java 21 virtual threads and Python asyncio tasks are all in this family.
          </p>
        </div>

        <!-- Two Columns: Choose Processes vs. Choose Threads / Coroutines -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- CHOOSE PROCESSES WHEN -->
          <div class="bg-emerald-950/15 border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase tracking-wider">
              CHOOSE PROCESSES WHEN
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-emerald-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>You need a hard fault boundary (a crash must not take down siblings) — Chrome tabs, nginx workers</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>You need to escape a runtime-level lock (Python GIL)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Untrusted code is being executed</span>
              </li>
            </ul>
          </div>

          <!-- CHOOSE THREADS / COROUTINES WHEN -->
          <div class="bg-rose-950/15 border border-rose-500/30 rounded-xl p-4 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-rose-400 uppercase tracking-wider">
              CHOOSE THREADS / COROUTINES WHEN
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-rose-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Work is I/O-bound and needs high fan-out (10 K+ concurrent calls)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Tasks must share large in-memory state cheaply</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Startup latency matters per unit of work</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            What is the difference between a coroutine and a thread? How do you list running processes in Linux?
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
              INTERVIEW FOLLOW-UPS
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-1.5 pb-3 border-b border-[#24314A]/50 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[13.5px] font-bold text-white font-sans">${item.question}</span>
                </div>
                <p class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-5 flex flex-col gap-2 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[13.5px] font-sans font-medium text-white leading-relaxed">
            Processes buy isolation; threads buy cheap sharing; coroutines buy concurrency density. Name the property you are buying, then pick — that framing is what distinguishes a senior answer from a textbook recital.
          </p>
        </div>

        <!-- Page 11 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 11</span>
        </div>

      </div>

    </div>
  `;
}
