/**
 * 8.3 Diagnosing a Runaway Process on Linux - Visual Guide
 * High-signal, visually rich, interview-oriented deep dive for Senior & Staff System Design.
 * Covers the 4-Stage Linux Triage Framework, Subsystem Isolation,
 * Kernel Memory Layout, Cgroups OOM-Killer Dynamics, and eBPF vs. Ptrace Profiling.
 */

export function renderLinuxProcessTriageContent(topic) {
  const tools = [
    {
      tool: "uptime & vmstat 1",
      what: "System-wide run queue (r), blocked tasks (b), swap in/out (si/so), disk I/O blocks (bi/bo), and CPU breakdown (us, sy, id, wa, st).",
      reach: "Step 1: Determine whether system is saturated, and whether the bottleneck is CPU, Memory swapping, or Disk I/O wait.",
      commandFlag: "vmstat -w 1"
    },
    {
      tool: "iostat -xz 1",
      what: "Extended storage disk statistics per device: Read/Write IOPS (r/s, w/s), throughput (rMB/s, wMB/s), queue length (avgqu-sz), wait times (await, r_await, w_await), and disk utilization percentage (%util).",
      reach: "Step 2 (Disk I/O): Pinpoint if a physical SSD or NVMe drive is saturated (%util &gt; 95% or await &gt; 10ms).",
      commandFlag: "iostat -xz 1"
    },
    {
      tool: "pidstat 1 -u -r -d -w",
      what: "Fine-grained per-process and per-thread metrics: CPU utilization (-u), Page faults and memory RSS (-r), Disk I/O read/write bytes (-d), and voluntary/involuntary context switches (-w).",
      reach: "Step 3 (Process Attribution): Attribute system-wide degradation to a specific offending Process ID (PID) or thread.",
      commandFlag: "pidstat -u -r -d -w 1"
    },
    {
      tool: "top -H -p <PID>",
      what: "Displays all individual operating system threads belonging to a single process, showing real-time CPU and memory per thread ID (TID).",
      reach: "Step 3 (Thread Attribution): Find which specific worker or background thread inside a JVM or Go runtime is spinning at 100% CPU.",
      commandFlag: "top -H -p $PID"
    },
    {
      tool: "ss -s & ss -tanp",
      what: "Socket statistics: total established TCP sockets, TIME_WAIT sockets, socket buffer sizes (Recv-Q, Send-Q), and socket-to-process bindings.",
      reach: "Step 2 (Network): Identify socket leaks, half-open TCP leaks, send buffer bloat, or ephemeral port exhaustion.",
      commandFlag: "ss -tanp"
    },
    {
      tool: "lsof -p <PID> | wc -l",
      what: "Lists all open file descriptors, network sockets, Unix domain pipes, and unlinked deleted files pinned in memory.",
      reach: "Step 3 (FD Leaks): Debug 'EMFILE: Too many open files' errors and recover disk space held by deleted log files still held open by processes.",
      commandFlag: "lsof -p $PID"
    },
    {
      tool: "perf top / eBPF (bpftrace)",
      what: "Sampling CPU profiler and dynamic kernel instrumentation that inspects hardware counters and CPU stack frames with sub-1% overhead.",
      reach: "Step 4 (Code Inspection): Identify the exact C/C++, Java, or Go function burning CPU cycles without stopping or restarting the live process.",
      commandFlag: "perf top -p $PID"
    }
  ];

  const triageStages = [
    {
      stage: "Stage 1: System Saturation",
      command: "uptime / vmstat 1",
      question: "Is the machine overloaded, and along what dimension?",
      check: "Check 1-min load average vs core count. Look at 'r' (threads wanting CPU) vs 'b' (threads blocked on disk/NFS). If 'wa' > 20%, it is an I/O crisis; if 'si/so' > 0, memory is exhausted and paging to swap."
    },
    {
      stage: "Stage 2: Subsystem Isolation",
      command: "top / free -m / iostat -xz 1 / ss -s",
      question: "Which hardware subsystem is saturated?",
      check: "Isolate the saturated dimension: CPU (user space 'us' vs kernel space 'sy'), Memory (free -m, dmesg OOM killer logs), Disk (iostat %util > 95%), or Network (retransmission rate in sar -n ETCP)."
    },
    {
      stage: "Stage 3: Process Attribution",
      command: "pidstat 1 / top -H -p <PID>",
      question: "Which specific process and thread is responsible?",
      check: "Identify the runaway PID using pidstat. Drill down into individual thread IDs using top -H. Convert thread ID to hex to match thread dumps (e.g. jstack / pprof)."
    },
    {
      stage: "Stage 4: Syscall & Stack Inspection",
      command: "perf top / py-spy / async-profiler",
      question: "What exact code path or system call is the process executing?",
      check: "Sample stack frames to find the hot loops or lock contentions. Inspect system call rates. Never use strace in production; use sampling profilers or eBPF."
    }
  ];

  const memoryMetrics = [
    {
      metric: "VIRT (Virtual Memory)",
      meaning: "Total memory the process has mapped into its address space, including shared libraries, memory-mapped files, and uncommitted allocations.",
      significance: "High VIRT is completely harmless on modern 64-bit systems. Never alert on VIRT."
    },
    {
      metric: "RSS (Resident Set Size)",
      meaning: "Actual physical RAM pages currently allocated and held in memory for this process.",
      significance: "Critical metric. If RSS monotonically increases without plateauing, the application has an active memory leak."
    },
    {
      metric: "SHR (Shared Memory)",
      meaning: "Subset of RSS that can be shared with other processes (e.g. shared libraries like libc.so, IPC memory segments).",
      significance: "Subtracting SHR from RSS gives the process's true exclusive memory consumption."
    },
    {
      metric: "Cgroup Memory Limit",
      meaning: "The container memory boundary set by Kubernetes requests/limits: /sys/fs/cgroup/memory/memory.limit_in_bytes.",
      significance: "The metric that matters in containers! When memory.usage_in_bytes hits memory.limit_in_bytes, the kernel OOM-killer immediately issues SIGKILL."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="8.3-linux-triage">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Part 8 · Deployment, Reliability &amp; Operations
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 101–102 · Section 8.3</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Systems &amp; Production Triage
          </span>
        </div>
        <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          8.3 Diagnosing a Runaway Process on Linux
        </h2>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          How to systematically diagnose an unruly Linux process consuming excessive CPU, memory, or disk I/O at 2 a.m. Master the repeatable 4-stage triage framework, kernel observability primitives, and container cgroup dynamics.
        </p>
      </div>

      <!-- Core What, Why, How, When Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">info</span>
            WHAT IT IS
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            The methodical, non-destructive investigation procedure used by senior on-call engineers to isolate production bottlenecks from high-level machine saturation down to the exact code function or syscall.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">help</span>
            WHY IT MATTERS
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Panicked engineers blindly restart runaway processes, destroying all memory dump and stack frame evidence needed for root cause. A disciplined triage pipeline isolates the defect in minutes without causing service disruption.
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">settings</span>
            THE 4-STAGE ORDER
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Always proceed in strict hierarchy: <strong>1. System Saturation ──► 2. Subsystem Isolation ──► 3. Process/Thread Attribution ──► 4. Code &amp; Syscall Profiling</strong>. Never start at code!
          </p>
        </div>

        <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">rule</span>
            SENIOR SIGNAL
          </span>
          <p class="text-[12.5px] text-slate-300 font-sans leading-relaxed">
            Interviewers judge whether you understand what OS metrics hide: e.g. explaining why load average is 40 on an 8-core machine while CPU is 80% idle (uninterruptible disk sleep), and knowing why <code>strace</code> kills production.
          </p>
        </div>
      </div>

      <!-- The Repeatable 4-Stage Triage Flowchart -->
      <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">alt_route</span>
            THE REPEATABLE 4-STAGE LINUX ON-CALL DECISION PIPELINE
          </span>
          <span class="text-[10px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
            Brendan Gregg Systems Methodology
          </span>
        </div>

        <!-- 4 Stage Grid Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          ${triageStages.map((t, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col justify-between gap-3">
              <div class="flex flex-col gap-1.5">
                <span class="font-code text-[12px] font-bold text-cyan-400">${t.stage}</span>
                <code class="text-[11px] font-code text-amber-300 bg-[#0A0E1A] px-2 py-1 rounded border border-[#1E293B] block">${t.command}</code>
                <p class="text-[12px] font-semibold text-white pt-1">${t.question}</p>
                <p class="text-[11.5px] text-slate-300 leading-relaxed font-sans">${t.check}</p>
              </div>
              <div class="pt-2 border-t border-[#24314A]/60 text-[10.5px] font-code text-slate-400">
                Step ${idx + 1} of 4
              </div>
            </div>
          `).join('')}
        </div>

        <!-- ASCII Decision Tree -->
        <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
[ 1. Check uptime &amp; vmstat 1 ]
       │
       ├──► Load Avg &gt; Core Count AND 'r' is high? ────────► <span class="text-cyan-400 font-bold">CPU SATURATION</span> ────► Check top (us vs sy) ──► pidstat 1 -u ──► perf top
       │
       ├──► 'si'/'so' &gt; 0 OR free -m shows 0 swap? ───────► <span class="text-amber-400 font-bold">MEMORY EXHAUSTION</span> ──► Check free -m ──► pidstat 1 -r ──► heap dump / cgroup
       │
       ├──► Load Avg is 40, CPU 20% idle, 'b' &amp; 'wa' high? ─► <span class="text-rose-400 font-bold">DISK I/O BOTTLENECK</span> ─► Check iostat -xz 1 (%util &gt; 95%) ──► iotop
       │
       └──► Hardware idle, but p99 latency spiked 10×? ────► <span class="text-purple-400 font-bold">LOCK / POOL HANG</span> ───► Check ss -tanp ──► jstack (futex/deadlock)
        </div>
      </div>

      <!-- Comprehensive Linux Performance Toolkit Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          THE LINUX PERFORMANCE &amp; DIAGNOSTICS TOOLKIT
        </span>

        <div class="overflow-x-auto rounded-xl border border-[#24314A] bg-[#0B1120]">
          <table class="w-full text-left text-[12px] font-sans border-collapse">
            <thead>
              <tr class="bg-[#141C2E] border-b border-[#24314A] text-slate-300 font-code text-[11px] uppercase">
                <th class="p-3 font-bold w-[22%]">Diagnostic Tool</th>
                <th class="p-3 font-bold w-[38%]">What It Measures &amp; Underlying Kernel Source</th>
                <th class="p-3 font-bold w-[40%]">When To Reach For It &amp; Exact Command</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E293B] text-slate-300">
              ${tools.map(t => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-bold text-emerald-300 font-code text-[11.5px]">${t.tool}</td>
                  <td class="p-3 text-[11.5px] leading-relaxed text-slate-300">${t.what}</td>
                  <td class="p-3 text-[11.5px] leading-relaxed">
                    <div class="text-slate-300 mb-1">${t.reach}</div>
                    <code class="text-[10.5px] font-code text-cyan-300 bg-[#070B14] px-1.5 py-0.5 rounded border border-[#1E293B]">${t.commandFlag}</code>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Deep Dive: The Load Average Mystery -->
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            THE LOAD AVERAGE MYSTERY: WHY CPU CAN BE 80% IDLE WITH A LOAD OF 40
          </span>
          <span class="text-[10px] font-code text-slate-400 bg-[#0B1120] px-2 py-0.5 rounded border border-[#24314A]">
            Linux Task Scheduler Mechanics
          </span>
        </div>

        <p class="text-[13px] text-slate-300 leading-relaxed">
          On Unix systems, load average originally counted only threads waiting for CPU time. In 1993, Linux kernel developer Matthias Urlichs modified the Linux load average calculation to include threads in <code>TASK_UNINTERRUPTIBLE</code> (uninterruptible disk and kernel sleep). This design difference confuses many senior engineers:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-4 flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-cyan-300">1. TASK_RUNNING (State 'R')</span>
            <p class="text-slate-300 leading-relaxed">
              Threads currently executing on a CPU core or actively waiting in the OS run queue. If <code>load average &gt; CPU core count</code> and <code>vmstat 'r'</code> is high, your system is genuinely <strong>CPU saturated</strong> (too many computing threads).
            </p>
          </div>

          <div class="bg-[#0B1120] border border-[#1E293B] rounded-lg p-4 flex flex-col gap-2">
            <span class="font-code text-[11px] font-bold text-rose-300">2. TASK_UNINTERRUPTIBLE (State 'D')</span>
            <p class="text-slate-300 leading-relaxed">
              Threads blocked on uninterruptible kernel sleep—typically disk I/O, page faults, or stalled network file mounts (NFS/EFS). These threads consume <strong>zero CPU cycles</strong>, but each one increments the load average by 1! If 40 worker threads hang waiting on a stalled EBS volume, load average reports 40 while CPU sits at 20% utilization.
            </p>
          </div>
        </div>
      </div>

      <!-- Deep Dive: Linux Memory Layout & Cgroups OOM-Killer -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">memory</span>
            MEMORY ANATOMY: VIRT VS. RSS VS. CGROUP OOM-KILLER DYNAMICS
          </span>
          <span class="text-[10px] font-code text-slate-400 bg-[#0B1120] px-2 py-0.5 rounded border border-[#24314A]">
            Kubernetes Container Limits
          </span>
        </div>

        <p class="text-[13px] text-slate-300 leading-relaxed">
          Running <code>top</code> or <code>free -m</code> inside a container reports the memory of the <em>host virtual machine</em>, not the container! Kubernetes pods are constrained by <strong>Linux Control Groups (cgroups)</strong>. Understanding how memory is accounted for is vital to prevent mysterious SIGKILL terminations:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          ${memoryMetrics.map(m => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3.5 flex flex-col justify-between gap-2">
              <div class="flex flex-col gap-1">
                <span class="font-code text-[11.5px] font-bold text-cyan-400">${m.metric}</span>
                <p class="text-[11.5px] text-slate-300 leading-relaxed">${m.meaning}</p>
              </div>
              <div class="pt-2 border-t border-[#24314A]/60 text-[10.5px] font-code text-emerald-300">
                ${m.significance}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- The OOM-Killer Scoring Formula -->
        <div class="bg-[#0B1120] p-4 rounded-lg border border-[#1E293B] font-mono text-[11px] text-slate-300 leading-relaxed">
<div class="text-rose-400 font-bold mb-1">// HOW THE LINUX KERNEL SELECTS WHICH PROCESS TO KILL (OOM_SCORE)</div>
oom_score = (1000 * memory_usage_in_bytes) / memory_limit_in_bytes + oom_score_adj
• The kernel calculates an <code>oom_score</code> from 0 to 1000 for every running process.
• The process with the highest score is issued <code>SIGKILL (kill -9)</code> when physical memory or the cgroup limit is reached.
• Inspect terminated container postmortems via: <span class="text-amber-300">dmesg -T | grep -i -E "oom-killer|killed process"</span>
        </div>
      </div>

      <!-- Deep Dive: Thread Pool Starvation & Futex Lock Contention -->
      <div class="bg-[#0B1120] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-sans">
        <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#24314A]">
          <span class="font-code text-[12px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">lock_clock</span>
            THREAD POOL STARVATION, FUTEX CONTENTION &amp; STOP-THE-WORLD PAUSES
          </span>
          <span class="text-[10px] font-code text-slate-400 bg-[#141C2E] px-2 py-0.5 rounded border border-[#24314A]">
            Thread Dump Analysis (jstack / pprof)
          </span>
        </div>

        <p class="text-[13px] text-slate-300 leading-relaxed">
          The most baffling on-call scenario occurs when <strong>p99 latency spikes by 10× to 50×, yet host CPU, memory, and disk I/O are completely idle (&lt;20% utilization)</strong>. Host metrics only see operating system hardware; they cannot observe internal runtime contention:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[12px]">
          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3.5 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-rose-400">1. Futex Contention (BLOCKED)</span>
            <p class="text-slate-300 leading-relaxed">
              Dozens of threads compete for a single shared synchronized lock or mutex. One thread holds the lock while 199 worker threads sleep in kernel space waiting on a fast userspace mutex (<code>futex</code>), showing 0% CPU but delivering multi-second latency.
            </p>
          </div>

          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3.5 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-amber-400">2. Connection Pool Exhaustion</span>
            <p class="text-slate-300 leading-relaxed">
              If an application has 200 HTTP worker threads but a database connection pool capped at 20 connections, 180 threads sit in <code>TIMED_WAITING</code> state waiting for a free socket. CPU is idle, but client requests queue up and time out.
            </p>
          </div>

          <div class="bg-[#0F1626] border border-[#24314A] rounded-lg p-3.5 flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-cyan-400">3. Stop-The-World GC Pauses</span>
            <p class="text-slate-300 leading-relaxed">
              A runaway allocation rate triggers full generational Garbage Collection (e.g. JVM G1/ZGC full pause or Go GC cycle). All execution threads are frozen simultaneously for 500ms–3s. The CPU drops to near-zero, while incoming requests queue up at the socket buffer.
            </p>
          </div>
        </div>

        <!-- ASCII Thread Dump State Trace -->
        <div class="bg-[#070B14] p-4 rounded-lg border border-[#1E293B] font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
<div class="text-indigo-400 font-bold mb-1">// HOW TO MAP A RUNAWAY LINUX THREAD (TID) TO A JAVA / GO THREAD DUMP:</div>
1. Find top CPU thread:         <span class="text-amber-300">top -H -p $PID</span>  ──► Thread ID (TID) = 28416 (99.8% CPU)
2. Convert TID to hexadecimal:   <span class="text-cyan-300">printf '%x\n' 28416</span> ──► "0x6f00"
3. Capture stack trace:          <span class="text-emerald-300">jstack $PID &gt; threads.tdump</span>
4. Grep for the hex thread ID:   <span class="text-purple-300">grep -A 20 "nid=0x6f00" threads.tdump</span>
   ──► Reveals exact class, method, and source line number currently executing the infinite loop!
        </div>
      </div>

      <!-- Deep Dive: Profiling in Production: eBPF vs Ptrace (strace) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 font-sans">
        <!-- Strace Pitfall -->
        <div class="bg-[#0F1626] border border-rose-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-400 text-[18px]">block</span>
            <h4 class="font-sans text-[14px] font-bold text-white">Why strace Destroys Production Performance</h4>
          </div>
          <p class="text-[12.5px] text-slate-300 leading-relaxed">
            Running <code>strace -p &lt;PID&gt;</code> on a live high-throughput production service is one of the most dangerous operational blunders:
          </p>
          <ul class="text-[12px] text-slate-300 list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
            <li><strong>Ptrace Context Switching:</strong> <code>strace</code> attaches via the Linux <code>ptrace()</code> system call. It forces the target process to halt execution on <em>every single entry and exit</em> of every system call.</li>
            <li><strong>$10\times$ to $50\times$ Slowdown:</strong> An API handling 10,000 req/sec will experience instantaneous latency degradation from 10 ms to 500 ms, often tripping upstream circuit breakers and creating a self-inflicted cascading outage.</li>
          </ul>
        </div>

        <!-- eBPF / Profiling Modern Alternative -->
        <div class="bg-[#0F1626] border border-emerald-500/30 rounded-xl p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-400 text-[18px]">speed</span>
            <h4 class="font-sans text-[14px] font-bold text-white">The Modern Standard: eBPF &amp; Sampling Profilers</h4>
          </div>
          <p class="text-[12.5px] text-slate-300 leading-relaxed">
            Senior engineers use non-invasive statistical sampling profilers and kernel tracepoints that operate with &lt;1% overhead:
          </p>
          <ul class="text-[12px] text-slate-300 list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
            <li><strong>eBPF (Extended Berkeley Packet Filter):</strong> Tools like <code>bpftrace</code> and <code>bcc</code> compile bytecode directly into the Linux kernel, capturing socket latency and disk events without context switching to user space.</li>
            <li><strong>Sampling Profilers:</strong> <code>perf record -F 99 -p &lt;PID&gt; -g</code> interrupts the CPU only 99 times per second to sample instruction pointers, generating accurate flamegraphs with unnoticeable production overhead.</li>
          </ul>
        </div>
      </div>

      <!-- Key Architectural Takeaway -->
      <div class="bg-gradient-to-r from-amber-950/60 to-indigo-950/60 border border-amber-500/40 rounded-xl p-5 flex flex-col gap-1.5 shadow-lg shadow-indigo-950/40">
        <span class="font-code text-[11px] text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">verified</span>
          KEY SYSTEM DESIGN TAKEAWAY
        </span>
        <p class="font-sans text-[13.5px] text-white font-medium leading-relaxed">
          In systems diagnostics, maintain a strict triage order rather than guessing with random tools: System Saturation (uptime/vmstat) ──► Subsystem Isolation (CPU, memory, disk, network) ──► Process/Thread Attribution (pidstat/top -H) ──► Stack &amp; Syscall Profiling (perf/eBPF). Never attach strace to a high-throughput production process; use continuous statistical sampling profilers.
        </p>
      </div>

    </div>
  `;
}
