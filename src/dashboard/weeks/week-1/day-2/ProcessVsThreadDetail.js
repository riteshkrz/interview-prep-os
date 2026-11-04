/**
 * 1.1 Process vs. Thread - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 10 & 11
 * from The Modern System Design Interview Guide.
 */

export function renderProcessVsThreadContent(topic) {
  const concurrencyModels = [
    {
      model: "Process per request",
      cost: "MBs memory, ~1 ms to create",
      scheduledBy: "OS Kernel (Preemptive)",
      contextSwitchCost: "High — switching between processes forces the CPU to throw away its memory address cache (TLB flush), causing thousands of slow page table lookups",
      faultBlastRadius: "Fully isolated — if one process crashes, zero other requests are affected (like separate apartments with their own walls)",
      failsAt: "Beyond ~1,000 concurrent requests: each process eats MBs of RAM, so memory runs out fast",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      model: "Thread per request",
      cost: "~1 MB stack, ~10–100 µs to create",
      scheduledBy: "OS Kernel (Preemptive)",
      contextSwitchCost: "Moderate — CPU saves registers but keeps the same memory maps loaded, so cache stays warm",
      faultBlastRadius: "Shared risk — one thread's crash (segfault or out-of-memory) kills the entire parent process and all its sibling threads",
      failsAt: "Beyond ~10,000 threads: CPU spends more time switching between threads than doing real work",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      model: "Coroutine / Green thread",
      cost: "Tiny: ~2–4 KB stack, nanoseconds to create",
      scheduledBy: "Language Runtime (Go, Kotlin, Java 21) — cooperative M:N scheduling",
      contextSwitchCost: "Near-zero — switches happen in user-space without asking the OS kernel, no TLB flush needed",
      faultBlastRadius: "Runtime-bound — a panic can bubble up unless caught, but other goroutines/coroutines on different OS threads survive",
      failsAt: "CPU-heavy work or calling a blocking C library — the coroutine hogs its underlying OS thread and starves siblings",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      model: "Event Loop (Single-threaded Reactor)",
      cost: "Minimal: one thread, one stack, near-zero overhead",
      scheduledBy: "Application Event Loop (Node.js, Redis, Nginx) — callbacks and I/O polling",
      contextSwitchCost: "Zero — there is literally only one thread, so no switching happens",
      faultBlastRadius: "Entire service — one uncaught exception crashes the whole event loop and drops every connected client",
      failsAt: "Any single CPU-intensive task (e.g., image resize, JSON parse of 100 MB) blocks ALL other clients until it finishes",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const processVsThreadComparison = [
    {
      dimension: "What It Is",
      process: "A running copy of a program with its own private memory, files, and identity — like a separate apartment with its own walls, kitchen, and keys",
      thread: "A lightweight worker inside a process — like a roommate sharing the same apartment but with their own desk and to-do list"
    },
    {
      dimension: "Memory Layout",
      process: "Gets its own private virtual address space — its own Code, Data, Heap, and Stack sections, completely invisible to other processes",
      thread: "Shares the parent process's Heap, Code, Data, and open files — only the Stack, CPU registers, and Thread ID are private to each thread"
    },
    {
      dimension: "What's Private vs. Shared",
      process: "Everything is private: memory map, file descriptors, credentials, environment variables, PID, and signal handlers",
      thread: "Only a few things are private: Program Counter (where it is in the code), CPU registers, Stack pointer, and Thread-Local Storage (TLS)"
    },
    {
      dimension: "Cost to Create",
      process: "Expensive (~1 ms). The OS must copy page tables, clone the file table, and set up a full memory context",
      thread: "Cheap (~10–20 µs, about 50–100× faster). Just allocates a stack and initializes a small thread control block"
    },
    {
      dimension: "Cost to Switch Between",
      process: "Slow (~1–3 µs + cache penalty). The CPU must swap page tables (CR3 register), which flushes its memory address cache (TLB) — causing thousands of cache misses",
      thread: "Fast (~100–300 ns). Only CPU registers and stack pointer are saved. Page tables stay loaded, so the cache stays warm"
    },
    {
      dimension: "How They Communicate",
      process: "Slow and complex — must go through the OS kernel using pipes, sockets, shared memory, or network calls (IPC)",
      thread: "Instant — threads read/write the same heap memory directly (but you need mutexes or locks to prevent race conditions)"
    },
    {
      dimension: "What Happens When One Crashes",
      process: "Only that process dies. Other processes are completely unaffected — the OS hardware (MMU) enforces the wall between them",
      thread: "The ENTIRE process dies, killing all sibling threads too. One bad thread's memory corruption takes everyone down"
    },
    {
      dimension: "When to Use Each",
      process: "When you need hard crash isolation and security boundaries — Chrome tabs, Nginx workers, running untrusted user code",
      thread: "When you need high-throughput concurrency with shared in-memory state — Java Tomcat handling 5,000 HTTP requests sharing a cache"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "How do you list, monitor, and inspect running processes and their threads in Linux?",
      answer: `In production debugging, use a layered inspection toolkit:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Process snapshots:</strong> <code>ps aux</code> or <code>ps -ef</code> gives full process arguments, parent PIDs (PPID), and execution states.</li>
        <li><strong>Thread-level inspection:</strong> <code>ps -L -p &lt;PID&gt;</code> displays all lightweight processes (threads) and their Thread IDs (LWP/TID). In <code>top</code> or <code>htop</code>, press <code>H</code> to toggle thread-level CPU and memory accounting.</li>
        <li><strong>Direct kernel inspection via /proc:</strong> Every Linux process exposes its state at <code>/proc/&lt;PID&gt;/status</code> (context switches, memory footprint, thread count) and <code>/proc/&lt;PID&gt;/task/</code> (directory of all active threads).</li>
        <li><strong>Context switch & system profiling:</strong> <code>pidstat -w -p &lt;PID&gt; 1</code> monitors voluntary vs. involuntary context switches per second. High involuntary switches indicate CPU saturation and scheduler thrashing.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "How do you size a thread pool in a high-throughput backend service using Little's Law?",
      answer: `Thread pool sizing is fundamentally governed by workload characteristics:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>CPU-bound tasks:</strong> Size the pool to <code>N_threads = N_cores</code> (or <code>N_cores + 1</code> to absorb occasional page faults). Adding more threads induces scheduler thrashing and TLB cache invalidation without increasing throughput.</li>
        <li><strong>I/O-bound tasks:</strong> Leverage <strong>Little's Law</strong>: <code>L = λ × W</code>, where <code>L</code> is concurrent active threads, <code>λ</code> is arrival rate (target QPS), and <code>W</code> is average service latency.
        <br/><em>Example:</em> 500 QPS with 200 ms average downstream database latency requires <code>500 × 0.2s = 100 concurrent worker threads</code>.</li>
        <li><strong>Critical production rule:</strong> Always pair the thread pool with a <strong>strictly bounded blocking queue</strong>. An unbounded queue converts a temporary downstream latency spike into an out-of-memory (OOM) JVM/process crash. When the queue fills, reject traffic immediately with HTTP 429 / 503 or apply backpressure.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "Why does Google Chrome allocate a separate OS process per tab rather than a lightweight thread per tab?",
      answer: `Chrome’s multi-process architecture represents an explicit architectural trade-off: <strong>sacrificing hundreds of megabytes of memory to purchase fault isolation and security containment</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Crash Containment:</strong> Complex web engines (Blink, V8) execute untrusted, third-party JavaScript, WebAssembly, and heavy DOM trees. If a single tab encounters an out-of-memory condition, infinite recursion, or renderer crash, the OS terminates only that tab's renderer process. The parent browser UI and sibling tabs remain completely operational.</li>
        <li><strong>Security Sandboxing & Speculative Execution:</strong> Operating system process boundaries are the fundamental hardware isolation boundary. By putting each tab in its own process, Chrome leverages OS-level sandbox policies (restricted seccomp filters, no direct disk or network access) and mitigates microarchitectural hardware side-channel attacks like Spectre and Meltdown, which can read arbitrary memory across threads in the same address space.</li>
        <li><strong>Clean Memory Reclamation:</strong> Modern JavaScript runtimes can suffer from heap fragmentation. When a user closes a tab, the OS instantly reclaims the entire address space and all allocated pages without relying on garbage collection sweeps.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "What actually happens under the hood during a context switch, and why is an inter-process switch 10× more expensive than a thread switch?",
      answer: `A context switch transitions CPU execution from one execution context to another. The sequence reveals the real bottleneck:
      <ul class="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
        <li><strong>Hardware Context Save:</strong> The CPU traps into kernel mode, saving registers (General-purpose registers, Program Counter <code>PC</code>, Stack Pointer <code>SP</code>, and floating-point registers) into the thread's Kernel Stack and Task State Segment (TSS). This operation takes ~10–20 nanoseconds.</li>
        <li><strong>Thread Switch within Same Process:</strong> The kernel scheduler swaps the active <code>task_struct</code> pointer and loads the new thread's stack pointer. <em>Crucially, the virtual memory page tables remain unchanged</em>. Memory mappings cached inside the CPU's Translation Lookaside Buffer (TLB) and L1/L2 data caches remain valid. Total cost: ~100–300 ns.</li>
        <li><strong>Inter-Process Context Switch:</strong> The kernel must swap the page tables by rewriting the CPU's <strong>CR3 control register</strong> to point to the new process's page directory base. Changing CR3 triggers a <strong>hardware TLB flush</strong>. Subsequent memory accesses incur severe penalties: every pointer dereference must perform a full multi-level page table walk in main memory until the TLB warms up, triggering cascading L1, L2, and L3 cache misses. Total effective cost: ~1–3 µs plus hundreds of microseconds of cache miss penalties.</li>
      </ul>`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 10: FOUNDATIONS, VIRTUAL MEMORY ARCHITECTURE & CORE DIFFERENCES -->
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
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Think of a process as an apartment (private walls, kitchen, keys) and a thread as a roommate inside it (shares the kitchen, has their own desk). This section explains how your OS runs code, why it matters for system design, and how to talk about it in interviews.
          </p>
        </div>

        <!-- WHAT IT IS & WHY IT MATTERS Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- WHAT IT IS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              WHAT IT IS
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              A <strong>program</strong> is just a file on your hard drive — compiled code sitting there doing nothing (like a recipe book on a shelf). A <strong>process</strong> is what happens when the OS loads that program into memory and starts running it — it gets its own private memory space, files, and an identity (PID). A <strong>thread</strong> is a worker inside that process — the smallest unit the CPU can actually schedule and run.
            </p>
          </div>

          <!-- WHY IT MATTERS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              WHY IT MATTERS IN DESIGN INTERVIEWS
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              Interviewers ask about this to test whether you understand <em>why</em> Nginx uses multiple processes, why Node.js is single-threaded, why Go uses goroutines, or how to size a thread pool. Every time you say "spin up more servers" or "use a thread pool" in a design interview, you're making a process-vs-thread decision — and the interviewer expects you to know the trade-offs.
            </p>
          </div>
        </div>

        <!-- Step-by-step Relationship: Program -> Process -> Thread -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Lifecycle & Relationship: Program, Process, and Thread
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="flex flex-col gap-2 bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-4">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/40 text-[#818CF8] font-code text-[12px] font-bold flex items-center justify-center shrink-0">1</span>
                <span class="text-[13px] font-bold text-white font-sans">Program (Disk)</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                A file sitting on your disk — compiled code that does nothing until someone runs it. Like a recipe book on a shelf: all instructions, zero action.
              </p>
            </div>

            <div class="flex flex-col gap-2 bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-4">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-code text-[12px] font-bold flex items-center justify-center shrink-0">2</span>
                <span class="text-[13px] font-bold text-white font-sans">Process (Memory)</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                The OS loads the program into memory, gives it a private address space, sets up page tables for memory translation, and assigns a PID. Now it's alive and running — like opening the recipe book and starting to cook.
              </p>
            </div>

            <div class="flex flex-col gap-2 bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-4">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-code text-[12px] font-bold flex items-center justify-center shrink-0">3</span>
                <span class="text-[13px] font-bold text-white font-sans">Threads (CPU Cores)</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                The process creates threads that share its memory (heap, code, open files) but each gets its own stack and registers. Multiple threads run on different CPU cores simultaneously — like multiple cooks in the same kitchen, each working on different dishes.
              </p>
            </div>
          </div>
        </div>

        <!-- VIRTUAL MEMORY ARCHITECTURE & ADDRESS SPACE MODEL (Process vs. Thread Architecture Diagram) -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          
          <!-- Top Section Title Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                VIRTUAL MEMORY ARCHITECTURE &amp; ADDRESS SPACE MODEL
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">Hardware MMU &amp; Page Tables</span>
              <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">CR3 Register Translation</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image As-Is -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/virtual-memory-architecture.jpg" 
                alt="Operating System Physical Hardware & RAM - Virtual Memory Architecture & Address Space Model (Process vs. Thread)" 
                class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/virtual-memory-architecture.jpg', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">Process A (PID 1042) vs. Process B (PID 1043) · Ring 0 Kernel · Hardware</span>
            </div>
          </div>

          <!-- THREADS VS. PROCESS ARCHITECTURAL DEEP-DIVE -->
          <div class="flex flex-col gap-3">
            <span class="font-code text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              MEMORY SHARING &amp; ISOLATION: THREAD CONCURRENCY INSIDE THE ADDRESS SPACE
            </span>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
              <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
                <div class="flex items-center gap-2 mb-1.5 font-bold text-[13px] text-emerald-900">
                  <span class="material-symbols-outlined text-[18px]">group_work</span>
                  <span>Threads Share the Process Heap &amp; Segments</span>
                </div>
                <p class="leading-relaxed text-[12px] text-slate-700">
                  Threads inside the same process are like roommates sharing an apartment. They all see the same <strong>Heap, Data, Code, and open files</strong>.
                  This makes communication blazing fast — threads just read and write shared memory directly (sub-microsecond). But sharing also creates danger: if two threads write to the same variable at the same time, you get <strong>race conditions</strong>. That's why you need mutexes, locks, or atomic operations to coordinate access.
                </p>
                <div class="mt-2.5 pt-2.5 border-t border-emerald-200 flex items-center gap-2 text-[11px] font-code text-emerald-800">
                  <span class="font-bold">Private per thread:</span>
                  <span>Dedicated Stack (~1MB), CPU Registers (PC, SP), Thread-Local Storage (TLS).</span>
                </div>
              </div>
              
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                <div class="flex items-center gap-2 mb-1.5 font-bold text-[13px] text-amber-900">
                  <span class="material-symbols-outlined text-[18px]">lock</span>
                  <span>Processes Share Nothing (Hardware MMU Isolation)</span>
                </div>
                <p class="leading-relaxed text-[12px] text-slate-700">
                  Processes are like <strong>separate apartments with thick walls</strong>. Process A and Process B share zero memory. The CPU's hardware memory unit (MMU) enforces this: each process has its own page tables. A crash, buffer overflow, or memory corruption in Process A <em>cannot touch</em> Process B. To communicate, they must go through the OS kernel using pipes, sockets, or shared memory (IPC).
                </p>
                <div class="mt-2.5 pt-2.5 border-t border-amber-200 flex items-center gap-2 text-[11px] font-code text-amber-800">
                  <span class="font-bold">Context Switch Penalty:</span>
                  <span>Reloading CR3 invalidates the hardware TLB, incurring multi-microsecond cache miss penalties.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Architectural Comparison Table: Process vs. Thread -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DEEP ARCHITECTURAL COMPARISON: PROCESSES VS. THREADS
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Dimension</th>
                  <th class="p-3.5">Operating System Process</th>
                  <th class="p-3.5">Process Thread (LWP)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${processVsThreadComparison.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white font-sans">${row.dimension}</td>
                    <td class="p-3.5 text-slate-300 font-sans leading-relaxed">${row.process}</td>
                    <td class="p-3.5 text-emerald-300 font-sans leading-relaxed font-medium">${row.thread}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orange Callout: The Hidden Cost of Context Switching -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            THE HIDDEN COST OF CONTEXT SWITCHING: CACHE & TLB INVALIDATION
          </span>
          <p class="text-[13px] text-amber-200/90 leading-relaxed font-sans">
          <p class="text-[13px] text-amber-200/90 leading-relaxed font-sans">
            Most people think a context switch is just saving a few CPU registers (~20 nanoseconds). That's <em>not</em> where the pain is. The real cost is the <strong>cache and TLB flush</strong>. When the OS switches to a different process, it changes the page table pointer (CR3 register), which wipes the CPU's Translation Lookaside Buffer — a fast cache that maps virtual memory addresses to physical RAM. The new process now has an ice-cold cache: every memory access triggers a slow, multi-level page table walk. You pay thousands of L1/L2 cache misses until the working set warms up. <strong>Thread switches avoid this entirely</strong> because threads in the same process share the same page tables — the TLB stays warm.
        </div>

        <!-- Official Page 10 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 10</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 11: CONCURRENCY MODELS, DECISION MATRIX, SENIOR PERSPECTIVE & TAKEAWAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Section: Concurrency models you should be able to compare -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-6 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h3 class="font-sans text-[17px] sm:text-[19px] font-bold text-white tracking-tight">
              Concurrency Models You Should Be Able to Compare
            </h3>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            Every backend framework picks one of these 4 approaches to handle multiple users at the same time. In a design interview, the interviewer expects you to know why Node.js chose event loops, why Go chose coroutines, and what breaks each model under pressure:
          </p>

          <!-- Responsive Concurrency Models Comparison Table -->
          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Model</th>
                  <th class="p-3.5">Unit Memory Cost</th>
                  <th class="p-3.5">Scheduled By</th>
                  <th class="p-3.5">Context Switch Cost</th>
                  <th class="p-3.5">Blast Radius</th>
                  <th class="p-3.5">Failure Bottleneck</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12px]">
                ${concurrencyModels.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">
                      <span class="px-2.5 py-1 rounded font-code text-[11px] border ${row.badgeColor} whitespace-nowrap inline-block">
                        ${row.model}
                      </span>
                    </td>
                    <td class="p-3.5 font-code text-slate-200">${row.cost}</td>
                    <td class="p-3.5 text-slate-300 font-medium">${row.scheduledBy}</td>
                    <td class="p-3.5 text-slate-300">${row.contextSwitchCost}</td>
                    <td class="p-3.5 text-slate-300">${row.faultBlastRadius}</td>
                    <td class="p-3.5 text-rose-300 font-medium">${row.failsAt}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Box: Senior Perspective: Sizing Thread Pools via Little's Law -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: SIZING THREAD POOLS VIA LITTLE'S LAW
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            <strong>Never say "I'll spin up 1,000 threads" in a design interview without justifying the number.</strong> Here's the simple framework: For <strong>CPU-bound work</strong> (number crunching, encoding), set <code>threads = number of CPU cores</code> — adding more just causes useless switching. For <strong>I/O-bound work</strong> (DB queries, API calls), use <strong>Little's Law</strong>: <code>threads needed = requests per second × average response time</code>. <em>Example: 2,000 QPS with 50 ms database latency → 2,000 × 0.05 = 100 threads.</em> And always use a <strong>bounded queue</strong> in front of the pool. An unbounded queue silently piles up requests during a downstream slowdown until your server runs out of memory and crashes. Respond with HTTP 429/503 instead.
        </div>

        <!-- Coroutine vs Thread Deep Dive Box -->
        <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
              COROUTINES VS. THREADS: PREEMPTIVE VS. COOPERATIVE SCHEDULING
            </span>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            <strong>OS threads</strong> are managed by the kernel, which can interrupt them at any time (preemptive scheduling) — like a teacher calling on students at random. <strong>Coroutines</strong> (Go goroutines, Kotlin coroutines, Java 21 virtual threads, Python asyncio) are managed by the language runtime — they voluntarily pause themselves at specific points (network I/O, channel reads, timers). Think of it as polite turn-taking vs. forced interruption.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-emerald-500/30 text-emerald-200">
              <strong class="text-white block mb-1">The Coroutine Advantage:</strong>
              Each coroutine starts with a tiny ~2 KB stack (a thread needs ~1 MB — that's 500× more). Switching between coroutines happens in user-space without asking the OS, so there's no TLB flush and no kernel overhead. This is how a single Go server handles millions of concurrent connections — each goroutine costs almost nothing.
            </div>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-amber-500/30 text-amber-200">
              <strong class="text-white block mb-1">The Cooperative Trap (the gotcha):</strong>
              Since coroutines only pause at yield points, a coroutine that does heavy CPU work (e.g., compressing a large file) or calls a blocking C library <em>never yields</em> — it hogs its underlying OS thread and blocks all other coroutines waiting on that thread. This is why Go's runtime detects long-running goroutines and preempts them since Go 1.14.
            </div>
          </div>
        </div>

        <!-- Two Columns: Choose Processes vs. Choose Threads / Coroutines -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- CHOOSE PROCESSES WHEN -->
          <div class="bg-emerald-950/15 border border-emerald-500/30 rounded-xl p-5 flex flex-col gap-3">
            <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">check_circle</span>
              CHOOSE PROCESSES WHEN
            </span>
            <ul class="flex flex-col gap-2.5 text-[12.5px] text-emerald-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>You need crash isolation:</strong> If one worker crashes (segfault, memory leak, infinite loop), the others must keep running. Real examples: Chrome runs each tab as a separate process, Nginx uses a master process that supervises worker processes.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Your language has a Global Interpreter Lock (GIL):</strong> Python and Ruby can only run one thread at a time due to their GIL. To use multiple CPU cores, you <em>must</em> use multiple processes (Gunicorn, Celery workers). Each process gets its own GIL.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>You're running untrusted user code:</strong> If your platform runs customer-submitted code (like a coding playground, CI/CD runner, or serverless function), each execution must be in a sandboxed process with restricted OS permissions (seccomp, namespaces) so one user can't access another's data.</span>
              </li>
            </ul>
          </div>

          <!-- CHOOSE THREADS / COROUTINES WHEN -->
          <div class="bg-cyan-950/15 border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3">
            <span class="font-code text-[11.5px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">flash_on</span>
              CHOOSE THREADS / COROUTINES WHEN
            </span>
            <ul class="flex flex-col gap-2.5 text-[12.5px] text-cyan-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1 font-bold">•</span>
                <span><strong>You need massive concurrency (10K–1M connections):</strong> WebSocket servers, API gateways, and proxy routers must handle tens of thousands of simultaneous connections. Threads would eat too much RAM; coroutines or event loops are the only viable options.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1 font-bold">•</span>
                <span><strong>Tasks need to share in-memory data:</strong> If your concurrent tasks frequently read or update a shared cache (e.g., a 10 GB product catalog in RAM), threads give instant access via shared heap — no serialization or network hops needed. Processes would require IPC, which is far slower.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1 font-bold">•</span>
                <span><strong>You need to create tasks extremely fast:</strong> In stream processing (Kafka consumers, log pipelines), spawning a new handler per message must cost nanoseconds, not milliseconds. Goroutines and coroutines spawn in nanoseconds; processes take ~1 ms — far too slow at 100K messages/sec.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            <strong>Interview scenario:</strong> You're designing an ultra-low latency stock trading gateway. Would you choose multi-threaded C++ with pinned CPU cores, or async Node.js? <em>Hint: Think about who controls scheduling, cache locality, and what happens when one handler is slow.</em>
          </span>
        </div>

        <!-- INTERVIEW FOLLOW-UPS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-6 flex flex-col gap-5">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-[#818CF8] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">contact_support</span>
              DEEP-DIVE INTERVIEW FOLLOW-UPS (Q1–Q4)
            </span>
          </div>

          <div class="flex flex-col gap-4">
            ${interviewFollowUps.map(item => `
              <div class="flex flex-col gap-2 pb-4 border-b border-[#24314A]/60 last:border-0 last:pb-0">
                <div class="flex items-start gap-2.5">
                  <span class="font-code text-[12px] font-bold text-[#818CF8] shrink-0 pt-0.5">${item.qNum}</span>
                  <span class="text-[14px] font-bold text-white font-sans leading-snug">${item.question}</span>
                </div>
                <div class="text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dark Blue Callout Box: KEY INTERVIEW TAKEAWAY -->
        <div class="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border border-[#4338CA] rounded-xl p-6 flex flex-col gap-2.5 shadow-lg shadow-indigo-950/40">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">key</span>
            KEY INTERVIEW TAKEAWAY
          </span>
          <p class="text-[14px] font-sans font-medium text-white leading-relaxed">
            Every concurrency model is a <strong>trade-off</strong>: Processes give you crash isolation but cost more memory. Threads give you cheap shared memory but one crash kills everyone. Coroutines give you million-connection concurrency but can't handle CPU-heavy work. Event loops give you zero overhead but one slow handler blocks the world. <strong>In interviews, always name the trade-off you're making</strong> — "I'm choosing Go goroutines because I need 100K concurrent WebSocket connections and the I/O-bound workload suits cooperative scheduling." That framing is what separates a senior engineer from someone reciting definitions.
          </p>
        </div>

        <!-- Official Page 11 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 11</span>
        </div>

      </div>

    </div>
  `;
}
