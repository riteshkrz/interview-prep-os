/**
 * 1.1 Process vs. Thread - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 10 & 11
 * from The Modern System Design Interview Guide.
 */

export function renderProcessVsThreadContent(topic) {
  const concurrencyModels = [
    {
      model: "Process per request",
      cost: "MBs memory, ~1 ms spawn",
      scheduledBy: "OS Kernel (Preemptive)",
      contextSwitchCost: "High (TLB flush + page table swap + cache misses)",
      faultBlastRadius: "Isolated (Crash affects 0 other requests)",
      failsAt: "High concurrency (>1,000 concurrent requests; memory exhaustion)",
      badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30"
    },
    {
      model: "Thread per request",
      cost: "~1 MB stack, ~10–100 µs spawn",
      scheduledBy: "OS Kernel (Preemptive)",
      contextSwitchCost: "Moderate (Registers saved, same page tables, mild cache pollution)",
      faultBlastRadius: "Shared (Uncaught segfault / OOM kills parent process)",
      failsAt: "~10,000 threads (Context switch overhead and RAM stack dominate)",
      badgeColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
    },
    {
      model: "Coroutine / Green thread",
      cost: "~2–4 KB stack, ~ns–µs spawn",
      scheduledBy: "Language Runtime (Cooperative/M:N)",
      contextSwitchCost: "Near-zero (User-space register swap, 0 syscalls)",
      faultBlastRadius: "Runtime-bound (Panic can bubble unless recovered)",
      failsAt: "CPU-bound work or blocking C syscall stalls underlying OS thread",
      badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
    },
    {
      model: "Event Loop (Single-threaded Reactor)",
      cost: "Single stack total, near-zero overhead",
      scheduledBy: "Application Event Loop (Callbacks/Poll)",
      contextSwitchCost: "Zero (Single thread executing sequential tasks)",
      faultBlastRadius: "Entire service (Uncaught exception crashes loop)",
      failsAt: "Any single CPU-intensive handler halts all concurrent clients",
      badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30"
    }
  ];

  const processVsThreadComparison = [
    {
      dimension: "Definition & Identity",
      process: "An isolated instance of a program in execution with private kernel-allocated resources",
      thread: "The smallest dispatchable unit of execution within a parent process"
    },
    {
      dimension: "Virtual Address Space",
      process: "Independent virtual address space (Code, Data, Heap, Stack mapped via own Page Tables)",
      thread: "Shares parent process address space (Heap, Data, Code segment, file descriptors)"
    },
    {
      dimension: "Private State",
      process: "Entire memory map, file descriptors, credentials, environment, PID, signal handlers",
      thread: "Program Counter (PC), CPU registers, Stack pointer, Thread-Local Storage (TLS), TID"
    },
    {
      dimension: "Creation & Termination Overhead",
      process: "Heavyweight (~1 ms). Requires cloning page tables, file table, and allocating mm_struct",
      thread: "Lightweight (~10–20 µs). Allocates stack memory and initializes thread control block (TCB)"
    },
    {
      dimension: "Context Switch Overhead",
      process: "Expensive (~1–3 µs). Saves registers, switches CR3 page table register, invalidates TLB, cache pollution",
      thread: "Moderate (~100–300 ns). Saves CPU registers and stack pointer. Page tables stay loaded in TLB"
    },
    {
      dimension: "Inter-Entity Communication",
      process: "Slow & complex. Requires IPC (Pipes, Unix domain sockets, shared memory, signals, network)",
      thread: "Blazing fast. Direct memory reads/writes to shared heap (requires mutexes, semaphores, atomics)"
    },
    {
      dimension: "Fault Isolation Boundary",
      process: "Strict hardware-enforced isolation. Memory violation (SIGSEGV) kills only that process",
      thread: "Zero isolation. A segfault or memory corruption in one thread crashes the entire process"
    },
    {
      dimension: "Primary Architectural Use Case",
      process: "Hard security & failure boundaries (Chrome browser tabs, Nginx worker processes)",
      thread: "High-throughput concurrent tasks sharing large in-memory caches (Java Tomcat, C++ servers)"
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
            The Fundamental Concurrency Abstraction · Memory Virtualization, Execution Entities & Context Switching
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
              A <strong>program</strong> is a passive, immutable executable binary stored on persistent disk (ELF, Mach-O). A <strong>process</strong> is an active instance of that program in execution, allocated a private virtual address space and kernel resources. A <strong>thread</strong> is the smallest schedulable unit of CPU execution inside a process.
            </p>
          </div>

          <!-- WHY IT MATTERS -->
          <div class="md:col-span-6 bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              WHY IT MATTERS
            </span>
            <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
              Every critical backend architectural decision — thread pool sizing, async event loops (Node.js/Redis), coroutine runtimes (Go/Kotlin), multi-process workers (Gunicorn/Nginx), and security sandboxing — begins at this boundary. It is an interviewer's top litmus test for operating system depth.
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
                Static instructions and initialized data stored passively in non-volatile storage. Contains compiled machine bytecode and symbol tables.
              </p>
            </div>

            <div class="flex flex-col gap-2 bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-4">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-code text-[12px] font-bold flex items-center justify-center shrink-0">2</span>
                <span class="text-[13px] font-bold text-white font-sans">Process (Memory)</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                The kernel invokes <code>execve()</code>, maps virtual memory pages, instantiates a <code>task_struct</code>, sets up page tables, and allocates file descriptors.
              </p>
            </div>

            <div class="flex flex-col gap-2 bg-[#141C2E]/80 border border-[#24314A] rounded-xl p-4">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-code text-[12px] font-bold flex items-center justify-center shrink-0">3</span>
                <span class="text-[13px] font-bold text-white font-sans">Threads (CPU Cores)</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                The process spawns worker threads sharing heap and global data. Threads execute concurrently across hardware cores, each running an independent execution stream.
              </p>
            </div>
          </div>
        </div>

        <!-- ADDRESS-SPACE VIEW (ASCII Visual Architectural Diagram) -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              VIRTUAL MEMORY ARCHITECTURE & ADDRESS SPACE MODEL
            </span>
            <span class="text-[11px] font-code text-slate-500">Hardware Memory Management Unit (MMU) & Page Tables</span>
          </div>

          <!-- ASCII Architecture Diagram Container -->
          <div class="p-4 bg-[#070B14] rounded-lg border border-slate-800 text-slate-300 overflow-x-auto text-[11.5px] leading-relaxed">
            <pre class="font-code text-slate-300">
+-------------------------------------------------------------------------------------------------------------+
|                                    OPERATING SYSTEM PHYSICAL HARDWARE & RAM                                  |
+-------------------------------------------------------------------------------------------------------------+
                                       ▲                                    ▲
                   Page Table Mapping  │                                    │  Page Table Mapping
                   (CR3 Register Ptr)  │                                    │  (CR3 Register Ptr)
                                       ▼                                    ▼
+------------------------------------------------------+    +-------------------------------------------------+
|               PROCESS A (PID: 1042)                  |    |              PROCESS B (PID: 1043)              |
|        Isolated Virtual 64-bit Address Space         |    |       Isolated Virtual 64-bit Address Space     |
+------------------------------------------------------+    +-------------------------------------------------+
| [0xFFFFFFFFFFFFFFFF] Kernel Space (Ring 0)           |    | [0xFFFFFFFFFFFFFFFF] Kernel Space (Ring 0)      |
|------------------------------------------------------|    |-------------------------------------------------|
| USER SPACE:                                          |    | USER SPACE:                                     |
|                                                      |    |                                                 |
|  +------------------------------------------------+  |    |  +-------------------------------------------+  |
|  | SHARED PROCESS MEMORY:                         |  |    |  | SHARED PROCESS MEMORY:                    |  |
|  |  * Code Segment (.text): Read-only instructions|  |    |  |  * Code Segment (.text): Machine code     |  |
|  |  * Data Segment (.data / .bss): Global/static  |  |    |  |  * Data Segment (.data): Global state     |  |
|  |  * Heap (Dynamic malloc/new allocations)       |  |    |  |  * Heap Segment: Isolated heap allocations|  |
|  |  * File Descriptors: Sockets, pipes, open files|  |    |  |  * File Descriptors: Isolated fd table    |  |
|  +------------------------------------------------+  |    |  +-------------------------------------------+  |
|          ▲                      ▲                     |    |                                                 |
|          │ Direct Heap Access   │ Direct Heap Access  |    |                                                 |
|          ▼                      ▼                     |    |                                                 |
|  +-----------------+  +-----------------+             |    |  +-----------------+                            |
|  | THREAD 1 (TID1) |  | THREAD 2 (TID2) |             |    |  | THREAD 1 (TID1) |                            |
|  | * Private Stack |  | * Private Stack |             |    |  | * Private Stack |                            |
|  | * Registers, PC |  | * Registers, PC |             |    |  | * Registers, PC |                            |
|  | * TLS storage   |  | * TLS storage   |             |    |  | * TLS storage   |                            |
|  +-----------------+  +-----------------+             |    |  +-----------------+                            |
|                                                      |    |                                                 |
|  ▲ Cheap sharing of in-memory heap data              |    |  ▲ Process A and Process B share NOTHING!       |
|  ▲ Zero isolation: memory bug in T1 corrupts T2      |    |  ▲ Communication REQUIRES explicit IPC          |
+------------------------------------------------------+    +-------------------------------------------------+
            │                                                                ▲
            └────────────────────── [ IPC BOUNDARY ] ────────────────────────┘
                       Unix Domain Sockets / Pipes / Shared Memory / TCP</pre>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12px]">
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 text-emerald-300">
              <strong class="text-white block mb-1">Threads Share the Heap:</strong>
              Enables sub-microsecond data passing via shared memory pointers without copying bytes, but introduces concurrent race conditions, deadlocks, and memory corruption risks that require synchronization locks.
            </div>
            <div class="bg-[#0F1626] border border-amber-500/30 rounded-lg p-3 text-amber-300">
              <strong class="text-white block mb-1">Processes Share Nothing:</strong>
              Provides hardware-enforced MMU memory protection. One process crashing leaves sibling processes completely unaffected, but passing data requires OS syscalls, memory copying, and context switching.
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
            Junior engineers often assume a context switch only costs the time required to save and restore CPU registers (~10–20 nanoseconds). In reality, an <strong>inter-process context switch costs microseconds to milliseconds of tail latency</strong> because reloading the <code>CR3</code> register flushes the CPU’s Translation Lookaside Buffer (TLB). The newly scheduled process suffers thousands of L1/L2 data cache misses and multi-level page table walks in main memory to warm its working set. Thread switches preserve page table mappings, avoiding the devastating TLB shootdown penalty.
          </p>
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
            Every backend application framework chooses a concurrency runtime. You must be able to contrast their memory footprints, scheduling mechanisms, and catastrophic failure modes on the whiteboard:
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
            In system design interviews, never say <em>"I'll spin up 1,000 threads to handle the traffic."</em> For CPU-bound workloads, optimal thread count is strictly tied to physical hardware: <code>Threads = N_cores</code>. For I/O-bound microservices (calling databases or downstream APIs), size your thread pool using <strong>Little’s Law</strong>: <code>Concurrency = QPS × Average Latency</code>. If your service handles 2,000 QPS with 50 ms latency, you need exactly <code>2,000 × 0.05 = 100 concurrent threads</code>. Always pair this with a strictly bounded queue and fail-fast backpressure (HTTP 429/503), because an unbounded queue converts temporary downstream latency spikes into catastrophic out-of-memory crashes.
          </p>
        </div>

        <!-- Coroutine vs Thread Deep Dive Box -->
        <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
              COROUTINES VS. THREADS: PREEMPTIVE VS. COOPERATIVE SCHEDULING
            </span>
          </div>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            An OS thread is scheduled <strong>preemptively</strong> by the kernel scheduler; the CPU timer interrupt halts it at arbitrary instructions to allocate core cycles fairly. A <strong>coroutine</strong> (Go Goroutines, Kotlin Coroutines, Java 21 Virtual Threads, Python asyncio) is scheduled <strong>cooperatively</strong> by the user-space language runtime. Coroutines yield control only at explicit suspension points (network I/O, channel reads, sleep timers).
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-emerald-500/30 text-emerald-200">
              <strong class="text-white block mb-1">The Coroutine Advantage:</strong>
              Starts with an elastic ~2KB stack (scaling dynamically up to MBs), performs context switches purely in user space without kernel traps or TLB flushes, allowing millions of concurrent connections on a single machine.
            </div>
            <div class="bg-[#0A0E1A] p-3.5 rounded-lg border border-amber-500/30 text-amber-200">
              <strong class="text-white block mb-1">The Cooperative Trap:</strong>
              If a coroutine enters an intensive CPU calculation or executes a blocking C-level system call without yielding, it hijacks its underlying OS carrier thread, starving all other coroutines mapped to that carrier core.
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
                <span><strong>Hardware fault isolation:</strong> A segfault or memory leak in one worker must never compromise sibling workers (Chrome tab renderers, Nginx master/worker architecture).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Bypassing runtime Global Interpreter Locks:</strong> Overcoming single-threaded runtime limitations (e.g., Python GIL, Ruby MRI) using multi-process pools (Gunicorn, Celery).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Executing untrusted multi-tenant code:</strong> Sandboxing customer-submitted scripts using operating system process restrictions and seccomp filters.</span>
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
                <span><strong>Massive I/O fan-out concurrency:</strong> Handling 10,000 to 1,000,000 concurrent network connections (WebSockets, API gateways, proxy routers).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1 font-bold">•</span>
                <span><strong>Cheap shared memory state:</strong> Concurrent tasks frequently query or update a large in-memory cache without incurring IPC serialization overhead.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-cyan-400 mt-1 font-bold">•</span>
                <span><strong>Near-instantaneous task spawning:</strong> Sub-microsecond dispatch latency is mandatory for high-throughput batch stream processing.</span>
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
            In an interview, if asked to build an ultra-low latency trading gateway, would you select a multi-threaded C++ model with pinned CPU cores or an async Node.js reactor? How would you justify your choice using cache locality and TLB metrics?
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
            Processes buy hardware-enforced fault isolation at the expense of memory footprint and context-switch latency; threads buy ultra-cheap shared state at the expense of memory safety; coroutines buy massive concurrency density at the expense of cooperative CPU scheduling. Always explicitly state the property you are buying before choosing a concurrency model — that architectural framing is what separates a senior systems engineer from a textbook memorizer.
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
