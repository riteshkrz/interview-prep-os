/**
 * 8.3 Diagnosing a Runaway Process on Linux - Visual Guide
 * High-signal, visually rich reproduction of Pages 101–102
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 */

export function renderLinuxProcessTriageContent(topic) {
  const tools = [
    {
      tool: "vmstat 1",
      what: "Virtual memory statistics: processes (r, b), memory, swap (si, so), I/O (bi, bo), CPU (us, sy, id, wa, st)",
      reach: "Step 1 triage: is the bottleneck CPU, RAM swapping, or disk I/O wait? (Watch 'b' and 'wa')"
    },
    {
      tool: "iostat -xz 1",
      what: "Detailed disk I/O statistics per device: IOPS, throughput, queue size (avgqu-sz), await, and %util",
      reach: "Disk saturation suspected: check if %util is near 100% or await is climbing past milliseconds"
    },
    {
      tool: "pidstat 1",
      what: "Task and thread level resource utilization (CPU -u, disk -d, memory -r, stack/context switch -w)",
      reach: "Attributing system-wide degradation to a specific offending process or OS thread"
    },
    {
      tool: "ss -s / netstat",
      what: "Socket statistics: established TCP connections, TIME_WAIT counts, send/recv queues, socket buffers",
      reach: "Network connection leaks, socket exhaustion, half-open socket leaks, port starvation"
    },
    {
      tool: "lsof -p PID",
      what: "Lists all open file descriptors, network sockets, Unix domain pipes, and unlinked deleted files",
      reach: "Diagnosing 'Too many open files' errors, leaking socket handles, and disk space pinned by deleted files"
    },
    {
      tool: "perf / eBPF (bpftrace)",
      what: "Hardware performance counters, kernel tracepoints, low-overhead CPU profiling without stopping processes",
      reach: "Production profiling to identify exact functions burning CPU cycles with sub-1% overhead"
    }
  ];

  const triageSteps = [
    {
      step: "① System Saturation?",
      cmd: "uptime / vmstat 1",
      check: "Check load average vs. CPU core count. Is the run queue (r) > core count, or are tasks blocked in uninterruptible sleep (b)?"
    },
    {
      step: "② Which Resource?",
      cmd: "top / free -m / iostat",
      check: "Identify the saturated dimension: CPU (user vs system vs wa), Memory (si/so swapping, OOMs in dmesg), Disk (%util > 95%), or Net (retransmits)."
    },
    {
      step: "③ Which Process?",
      cmd: "pidstat 1 / top -H",
      check: "Attribute load to a specific PID or OS thread. Inspect per-thread CPU and thread pool status."
    },
    {
      step: "④ What Is It Doing?",
      cmd: "perf / py-spy / pprof / strace",
      check: "Profile stack frames (which application functions are executing?) and inspect blocking syscalls (read, write, futex)."
    }
  ];

  const followUps = [
    {
      q: "Load average is 40 on an 8-core server, but CPU shows 20% idle. How do you explain this?",
      a: "Linux load average counts tasks in <code>TASK_RUNNING</code> <em>plus</em> tasks in <code>TASK_UNINTERRUPTIBLE</code> (uninterruptible disk/NFS sleep). If processes are blocked on slow I/O, hung disk controllers, or a stalled network-attached storage mount (NFS/EFS), the load average balloons to 40 while the CPU sits idle waiting. Confirm with <code>vmstat 1</code>'s 'b' column (blocked tasks) and high 'wa' (I/O wait), then pinpoint the saturated drive using <code>iostat -xz 1</code>."
    },
    {
      q: "Memory keeps climbing and the process is eventually OOM-killed. How do you isolate the root cause?",
      a: "Separate the layers: 1) If <strong>Resident Set Size (RSS)</strong> climbs while the application's runtime heap (JVM / Node.js heap) is flat, the leak is outside the runtime: native C/C++ libraries, memory-mapped files, glibc heap fragmentation, or leaking thread stacks. 2) If the runtime heap is growing, take memory heap snapshots (<code>jmap</code> / <code>pprof</code>) and compare retained objects over time. 3) Inspect <code>dmesg -T | grep -i oom</code> to inspect the killed PID and verify whether the process exceeded <strong>container cgroup limits</strong> rather than host physical memory."
    },
    {
      q: "Latency spiked sharply, but host CPU, memory, and disk all look perfectly normal. Where do you look?",
      a: "Host metrics cannot see internal application queueing. Look at what OS metrics hide: <strong>internal connection pool exhaustion</strong> (requests blocked waiting for a database socket), thread pool queue saturation, garbage collection stop-the-world pauses, lock contention (threads waiting on mutexes/futexes), DNS resolution latency spikes (sec. 2.3), or downstream microservice p99 latency regressions. This is why <strong>application distributed tracing (W3C spans, sec. 12.1)</strong> is mandatory."
    },
    {
      q: "The service is slow in production, but you cannot reproduce it in staging. How do you debug safely?",
      a: "Observe production safely using <strong>continuous low-overhead sampling profilers</strong> (<code>perf</code>, <code>py-spy</code>, <code>async-profiler</code>) or <strong>eBPF tools</strong> (<code>bpftrace</code>). Never run <code>strace</code> on high-throughput production services: <code>strace</code> interrupts the process on every single system call via <code>ptrace</code>, causing an orders-of-magnitude performance collapse. Finally, mirror real traffic using <strong>Shadow Deployments (Dark Launch, sec. 8.1)</strong> rather than synthetic loads."
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
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          8.3 Diagnosing a Runaway Process on Linux
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          How to systematically diagnose an unruly Linux process consuming excessive CPU, memory, or disk I/O at 2 a.m. Master the repeatable 4-step triage methodology and production profiling toolkit.
        </p>
      </div>

      <!-- Repeatable 4-Step Triage Flow -->
      <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-3 font-sans">
        <span class="font-code text-[12px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">terminal</span>
          A REPEATABLE TRIAGE ORDER (SAY THIS IN INTERVIEWS)
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          ${triageSteps.map(t => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-3.5 flex flex-col gap-2">
              <span class="font-code text-[12px] font-bold text-cyan-400">${t.step}</span>
              <code class="text-[11px] font-code text-indigo-300 bg-[#0A0E1A] px-2 py-1 rounded border border-[#1E293B]">${t.cmd}</code>
              <p class="text-[11.5px] text-slate-300 font-sans leading-relaxed">${t.check}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Linux Diagnostics Toolkit Table -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          THE LINUX PERFORMANCE TOOLKIT
        </span>
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left border-collapse font-sans text-[12.5px]">
            <thead>
              <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[11.5px] font-code font-bold text-indigo-200">
                <th class="p-3 w-1/5">Tool &amp; Command</th>
                <th class="p-3 w-2/5">What It Measures</th>
                <th class="p-3 w-2/5">When to Reach For It</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/60">
              ${tools.map(t => `
                <tr class="hover:bg-[#141C2E]/60 transition-colors">
                  <td class="p-3 font-semibold text-emerald-300 font-code text-[12px]">${t.tool}</td>
                  <td class="p-3 text-slate-300">${t.what}</td>
                  <td class="p-3 text-slate-400">${t.reach}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Container / eBPF Note -->
      <div class="bg-[#1A162B] border-l-4 border-indigo-500 rounded-r-xl p-4 sm:p-5 flex flex-col gap-1.5 font-sans">
        <span class="font-code text-[11.5px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">info</span>
          Two Details That Prove Real-World Production Experience
        </span>
        <p class="text-[12.5px] text-slate-300 leading-relaxed">
          <strong>1. Container Cgroups:</strong> Running <code>top</code> or <code>free</code> inside a Kubernetes pod shows host machine memory, but the Linux kernel OOM-killer terminates the container when it breaches its <em>cgroup memory limit</em>. Always inspect <code>/sys/fs/cgroup/memory/memory.usage_in_bytes</code> or container metrics.<br/>
          <strong>2. eBPF over strace:</strong> In high-throughput systems, <code>strace</code> freezes the process on every context switch via <code>ptrace</code>. Modern on-call teams reach for <strong>eBPF</strong> (<code>bpftrace</code> / <code>bcc</code>), which traces kernel events inside the kernel with sub-microsecond overhead.
        </p>
      </div>

      <!-- Interview Follow-ups -->
      <div class="flex flex-col gap-3 pt-2">
        <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          INTERVIEW FOLLOW-UPS (SENIOR &amp; STAFF PROBES)
        </span>
        <div class="flex flex-col gap-3">
          ${followUps.map((item, idx) => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-2">
              <span class="font-sans text-[13px] font-bold text-cyan-300">
                Q${idx + 1}: ${item.q}
              </span>
              <p class="font-sans text-[12.5px] text-slate-300 leading-relaxed">
                ${item.a}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Key Interview Takeaway -->
      <div class="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Have a triage order, not a tool list: saturation → which resource → which process → which syscall or stack. Naming vmstat, iostat, pidstat, and then perf/eBPF in that sequence reads as someone who has actually been on call."
        </p>
      </div>

    </div>
  `;
}
