/**
 * 1.2 Virtualization vs. Containerization - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 12 & 13
 * from The Modern System Design Interview Guide.
 */

export function renderVirtualizationVsContainersContent(topic) {
  const comparisonRows = [
    {
      dimension: "Abstraction",
      vms: "Hardware-level (hypervisor)",
      containers: "OS-level (kernel)",
      vmsHighlight: "text-slate-300",
      containersHighlight: "text-emerald-300 font-semibold"
    },
    {
      dimension: "Guest OS",
      vms: "Yes",
      containers: "No",
      vmsHighlight: "text-amber-400 font-bold",
      containersHighlight: "text-emerald-400 font-bold"
    },
    {
      dimension: "Security boundary",
      vms: "Strong (hardware boundary)",
      containers: "Weak to moderate (shared kernel)",
      vmsHighlight: "text-emerald-400 font-semibold",
      containersHighlight: "text-amber-400 font-semibold"
    },
    {
      dimension: "Startup latency",
      vms: "Minutes (full OS boot)",
      containers: "Milliseconds (process start)",
      vmsHighlight: "text-slate-400",
      containersHighlight: "text-emerald-300 font-semibold"
    },
    {
      dimension: "Image footprint",
      vms: "GBs (full OS + kernel + libraries)",
      containers: "MBs (app + dependencies only)",
      vmsHighlight: "text-slate-400",
      containersHighlight: "text-cyan-300 font-semibold"
    },
    {
      dimension: "Overhead",
      vms: "5–15% (hypervisor + guest OS)",
      containers: "Near-zero (native processes)",
      vmsHighlight: "text-slate-400",
      containersHighlight: "text-emerald-300 font-semibold"
    },
    {
      dimension: "Multi-tenancy on shared host",
      vms: "Hard boundary (safe)",
      containers: "Soft boundary (risk of noisy neighbors & container escapes)",
      vmsHighlight: "text-emerald-300 font-semibold",
      containersHighlight: "text-rose-400 font-semibold"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Can containers escape to the host OS?",
      answer: `<strong>Yes, and it happens regularly.</strong> Container isolation relies on kernel cgroups and namespaces; a bug in the shared kernel (or a container run with <code>privileged: true</code>) gives access to the host. Real isolation requires a hypervisor (Firecracker, gVisor, Kata Containers). Never run untrusted tenant code in raw containers.`
    },
    {
      qNum: "Q2",
      question: "What is container orchestration, and what problem does Kubernetes solve?",
      answer: `A single container is easy to run (<code>docker run</code>). Orchestration solves the <strong>distributed fleet problem</strong>: scheduling containers onto machines, self-healing failed containers, autoscaling, service discovery, rolling deployments, and secret management.`
    },
    {
      qNum: "Q3",
      question: "What is the difference between an image and a container?",
      answer: `An <strong>image</strong> is a read-only template built from a Dockerfile (layers of filesystem changes). A <strong>container</strong> is a runnable instance of an image with an added writable layer on top. Multiple containers can run from the same image simultaneously without modifying the underlying image.`
    },
    {
      qNum: "Q4",
      question: "If containers share the host kernel, how can you run an Ubuntu container on an Arch host?",
      answer: `Containers bundle <strong>user space</strong> (binaries, glibc, package managers, tools), not the kernel. Ubuntu user space runs fine on an Arch kernel as long as the CPU architecture (x86_64, arm64) matches and the kernel provides the required syscall interface.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 12: DEFINITIONS, ARCHITECTURAL DIAGRAM & COMPARISON TABLE -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              1.2 Virtualization vs. Containerization
            </h2>
          </div>
        </div>

        <!-- DEFINITIONS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            DEFINITIONS
          </span>
          <div class="flex flex-col gap-2 text-[13px] text-slate-300 leading-relaxed font-sans">
            <p>
              <em>"Virtualization is a technology that allows you to create multiple simulated environments or dedicated resources from a single, physical hardware system"</em> [1].
            </p>
            <p>
              <em>"Containerization is the packaging together of software code with all its necessary components like libraries, frameworks, and other dependencies so that they are isolated in their own container"</em> [2].
            </p>
          </div>
        </div>

        <!-- ARCHITECTURAL DIFFERENCE DIAGRAM -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase">
              ARCHITECTURAL DIFFERENCE
            </span>
            <span class="text-[11px] font-code text-slate-500">Hardware Abstraction vs. OS Kernel Sharing</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- VIRTUAL MACHINES (VMS) -->
            <div class="flex flex-col gap-3 bg-[#0F1626] border border-cyan-500/30 rounded-xl p-4 sm:p-5">
              <span class="font-code text-[12px] text-cyan-300 font-bold text-center">
                VIRTUAL MACHINES (VMS)
              </span>

              <!-- Stack representation -->
              <div class="flex flex-col gap-1.5 pt-2">
                <!-- Top: Apps & Bins/Libs & Guest OS per VM -->
                <div class="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div class="flex flex-col gap-1">
                    <div class="bg-[#1E293B] border border-cyan-500/30 rounded py-1 font-bold text-white">App</div>
                    <div class="bg-[#1E293B]/70 border border-slate-700 rounded py-1 text-slate-300">Bins/Libs</div>
                    <div class="bg-cyan-950/40 border border-cyan-500/40 rounded py-1 text-cyan-200 font-semibold">Guest OS</div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div class="bg-[#1E293B] border border-cyan-500/30 rounded py-1 font-bold text-white">App</div>
                    <div class="bg-[#1E293B]/70 border border-slate-700 rounded py-1 text-slate-300">Bins/Libs</div>
                    <div class="bg-cyan-950/40 border border-cyan-500/40 rounded py-1 text-cyan-200 font-semibold">Guest OS</div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div class="bg-[#1E293B] border border-cyan-500/30 rounded py-1 font-bold text-white">App</div>
                    <div class="bg-[#1E293B]/70 border border-slate-700 rounded py-1 text-slate-300">Bins/Libs</div>
                    <div class="bg-cyan-950/40 border border-cyan-500/40 rounded py-1 text-cyan-200 font-semibold">Guest OS</div>
                  </div>
                </div>

                <!-- Hypervisor Layer -->
                <div class="bg-indigo-950/50 border border-indigo-500/40 rounded py-1.5 text-center text-indigo-300 font-bold text-[11.5px] mt-1">
                  Hypervisor
                </div>

                <!-- Host Infrastructure -->
                <div class="bg-[#0A0E1A] border border-[#334155] rounded py-1.5 text-center text-slate-400 font-semibold text-[11.5px]">
                  Infrastructure
                </div>
              </div>

              <div class="pt-2 text-[11px] font-code text-cyan-300 leading-tight">
                ▲ each VM has its own kernel → heavy, strong isolation
              </div>
            </div>

            <!-- CONTAINERS -->
            <div class="flex flex-col gap-3 bg-[#0F1626] border border-emerald-500/30 rounded-xl p-4 sm:p-5">
              <span class="font-code text-[12px] text-emerald-300 font-bold text-center">
                CONTAINERS
              </span>

              <!-- Stack representation -->
              <div class="flex flex-col gap-1.5 pt-2">
                <!-- Top: Apps & Bins/Libs per Container -->
                <div class="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div class="flex flex-col gap-1">
                    <div class="bg-[#1E293B] border border-emerald-500/30 rounded py-1 font-bold text-white">App</div>
                    <div class="bg-[#1E293B]/70 border border-slate-700 rounded py-1 text-slate-300">Bins/Libs</div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div class="bg-[#1E293B] border border-emerald-500/30 rounded py-1 font-bold text-white">App</div>
                    <div class="bg-[#1E293B]/70 border border-slate-700 rounded py-1 text-slate-300">Bins/Libs</div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div class="bg-[#1E293B] border border-emerald-500/30 rounded py-1 font-bold text-white">App</div>
                    <div class="bg-[#1E293B]/70 border border-slate-700 rounded py-1 text-slate-300">Bins/Libs</div>
                  </div>
                </div>

                <!-- Container Runtime Layer -->
                <div class="grid grid-cols-12 gap-2 mt-1">
                  <div class="col-span-8 bg-emerald-950/50 border border-emerald-500/40 rounded py-1.5 text-center text-emerald-300 font-bold text-[11px]">
                    Container Runtime (Docker)
                  </div>
                  <div class="col-span-4 bg-[#1E293B] border border-slate-700 rounded py-1.5 text-center text-slate-300 text-[10px]">
                    Control groups
                  </div>
                </div>

                <!-- Host OS Layer -->
                <div class="grid grid-cols-12 gap-2">
                  <div class="col-span-8 bg-teal-950/40 border border-teal-500/30 rounded py-1.5 text-center text-teal-200 font-semibold text-[11px]">
                    Host OS (Shared)
                  </div>
                  <div class="col-span-4 bg-[#1E293B] border border-slate-700 rounded py-1.5 text-center text-slate-300 text-[10px]">
                    Namespaces
                  </div>
                </div>

                <!-- Host Infrastructure -->
                <div class="bg-[#0A0E1A] border border-[#334155] rounded py-1.5 text-center text-slate-400 font-semibold text-[11.5px]">
                  Infrastructure
                </div>
              </div>

              <div class="pt-2 text-[11px] font-code text-emerald-400 leading-tight">
                ▲ containers share the kernel → lightweight, config isolation
              </div>
            </div>
          </div>
        </div>

        <!-- Major Differences Section -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Major differences
          </h3>

          <ul class="flex flex-col gap-2.5 pl-2 text-[13px] text-slate-300 font-sans">
            <li class="flex items-start gap-2 leading-relaxed">
              <span class="text-[#818CF8] mt-1 font-bold">•</span>
              <span><strong class="text-white">Relationship to the host OS:</strong> VMs do not share the host OS, while containers share the host OS. A hypervisor abstracts the host machine's hardware into virtual machines, each with its own full operating system.</span>
            </li>
            <li class="flex items-start gap-2 leading-relaxed">
              <span class="text-[#818CF8] mt-1 font-bold">•</span>
              <span><strong class="text-white">Portability:</strong> Both provide a high degree of portability because they can be run in the cloud and on multiple physical environments. But because containers package just the application and its dependencies into a single lightweight image, they are easier to move between environments and require less storage than VMs, which package an entire OS and all its dependencies.</span>
            </li>
          </ul>
        </div>

        <!-- How containerisation works: cgroups and namespaces -->
        <div class="bg-[#141C2E] border-l-4 border-cyan-500 rounded-r-xl p-4 sm:p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            HOW CONTAINERISATION WORKS: CGROUPS AND NAMESPACES
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            A container is not a "lightweight VM"; it is a normal Linux process with two kernel-level boundaries: <strong>namespaces</strong> isolate what the process can <em>see</em> (PID, network, mount, IPC, user), and <strong>cgroups</strong> limit what the process can <em>consume</em> (CPU, memory, disk I/O, network bandwidth). The kernel itself enforces these boundaries with no hypervisor layer in between. The container runtime (Docker, containerd) simply configures these two primitives and mounts the root filesystem.
          </p>
        </div>

        <!-- Comparison Table -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DETAILED TECHNICAL COMPARISON
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3">Dimension</th>
                  <th class="p-3">Virtual machines</th>
                  <th class="p-3">Containers</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${comparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white">${row.dimension}</td>
                    <td class="p-3 ${row.vmsHighlight}">${row.vms}</td>
                    <td class="p-3 ${row.containersHighlight}">${row.containers}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Blue Callout Box: The Middle Ground: MicroVMs -->
        <div class="bg-gradient-to-r from-blue-950/40 to-cyan-950/30 border border-blue-500/40 rounded-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">memory</span>
            THE MIDDLE GROUND: MICROVMS
          </span>
          <p class="text-[13px] text-slate-200 leading-relaxed font-sans">
            MicroVMs (AWS Firecracker, Cloud Hypervisor) combine the security boundary of a VM with the startup speed of a container. A stripped-down Linux kernel boots in ~5 ms with ~5 MB memory overhead. AWS Lambda and Fargate run on Firecracker precisely because multi-tenant serverless requires hardware isolation without container startup latency.
          </p>
        </div>

        <!-- Page 12 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 12</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 13: PREFER BOXES, FOLLOW-UPS & TAKEAWAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Two Columns: Prefer Containers vs. Prefer VMs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- PREFER CONTAINERS WHEN -->
          <div class="bg-emerald-950/15 border border-emerald-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase tracking-wider">
              PREFER CONTAINERS WHEN
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-emerald-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Microservices architectures with high deploy frequency</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>CI/CD pipelines where build speed and image size matter</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Maximizing hardware density on single-tenant or trusted hosts</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1">•</span>
                <span>Single-purpose CLI tools, worker processes, batch jobs</span>
              </li>
            </ul>
          </div>

          <!-- PREFER VIRTUAL MACHINES WHEN -->
          <div class="bg-rose-950/15 border border-rose-500/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
            <span class="font-code text-[11.5px] font-bold text-rose-400 uppercase tracking-wider">
              PREFER VIRTUAL MACHINES WHEN
            </span>
            <ul class="flex flex-col gap-2 text-[12.5px] text-rose-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Running untrusted or multi-tenant code (isolation boundary)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Workloads requiring different OS kernels on the same host (e.g., Windows on Linux)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Monolithic legacy apps with complex, stateful configurations</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1">•</span>
                <span>Strict regulatory compliance requiring hardware separation</span>
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
            What prevents a container from starving its neighbors of memory on the same host? How would you find out how much RAM a container is actually using?
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
            Containers abstract the OS; VMs abstract the hardware. Containers buy speed and density; VMs buy hardware-grade isolation. MicroVMs exist because some workloads refuse to compromise on either.
          </p>
        </div>

        <!-- Page 13 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 13</span>
        </div>

      </div>

    </div>
  `;
}
