/**
 * 1.2 Virtualization vs. Containerization - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 12 & 13
 * from The Modern System Design Interview Guide.
 */

export function renderVirtualizationVsContainersContent(topic) {
  const comparisonRows = [
    {
      dimension: "Abstraction Layer",
      vms: "Hardware level (Hypervisor simulates CPU, RAM, disk, and network card)",
      containers: "Operating System level (Shares the host Linux kernel via namespaces & cgroups)",
      vmsHighlight: "text-slate-300 font-sans",
      containersHighlight: "text-emerald-300 font-semibold font-sans"
    },
    {
      dimension: "Guest OS Requirement",
      vms: "Mandatory. Each VM boots its own complete OS kernel with full system drivers",
      containers: "None. Containers package only application code, binaries, and libraries",
      vmsHighlight: "text-amber-400 font-bold font-sans",
      containersHighlight: "text-emerald-400 font-bold font-sans"
    },
    {
      dimension: "Security Boundary",
      vms: "Hardware-grade (CPU ring -1 / hypervisor VT-x hardware isolation)",
      containers: "Software configuration (Shared kernel — container escape can compromise host)",
      vmsHighlight: "text-emerald-400 font-semibold font-sans",
      containersHighlight: "text-amber-400 font-semibold font-sans"
    },
    {
      dimension: "Startup Latency",
      vms: "Minutes to 30+ seconds (Full BIOS boot, kernel initialization, background daemons)",
      containers: "Milliseconds to ~1 second (Instantaneous fork/exec of an isolated native process)",
      vmsHighlight: "text-slate-400 font-sans",
      containersHighlight: "text-emerald-300 font-semibold font-sans"
    },
    {
      dimension: "Image Disk Footprint",
      vms: "Gigabytes to tens of GBs (Full OS files, system packages, swap file, logs)",
      containers: "Megabytes (Minimal Alpine or Distroless images are only 5–20 MB)",
      vmsHighlight: "text-slate-400 font-sans",
      containersHighlight: "text-cyan-300 font-semibold font-sans"
    },
    {
      dimension: "Resource Overhead (Tax)",
      vms: "5–15% CPU & RAM overhead (Virtual MMU emulation, hypervisor scheduling overhead)",
      containers: "Near-zero overhead (Executes directly as native Linux processes on physical hardware)",
      vmsHighlight: "text-slate-400 font-sans",
      containersHighlight: "text-emerald-300 font-semibold font-sans"
    },
    {
      dimension: "Host Packing Density",
      vms: "Low (Dozens of VMs per physical host before memory runs out)",
      containers: "High (Hundreds to thousands of containers can run on a single physical host)",
      vmsHighlight: "text-slate-400 font-sans",
      containersHighlight: "text-emerald-300 font-semibold font-sans"
    },
    {
      dimension: "Multi-Tenancy Safety",
      vms: "Safe for untrusted tenants (Hard hardware barrier protects neighboring tenants)",
      containers: "Unsafe for untrusted tenants (Risk of noisy-neighbor slowdowns & kernel exploits)",
      vmsHighlight: "text-emerald-300 font-semibold font-sans",
      containersHighlight: "text-rose-400 font-semibold font-sans"
    },
    {
      dimension: "OS & Kernel Diversity",
      vms: "High. Run Linux, Windows Server, and FreeBSD side-by-side on the same physical host",
      containers: "Same OS family. All containers must match the host's Linux kernel ABI",
      vmsHighlight: "text-cyan-300 font-semibold font-sans",
      containersHighlight: "text-slate-400 font-sans"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Can a container escape to the host operating system, and how do production systems prevent it?",
      answer: `<strong>Yes, container escapes happen in production.</strong> A container is simply a normal Linux process running with namespace and cgroup boundaries. If an attacker exploits a Linux kernel vulnerability (like Dirty COW, Dirty Pipe, or use-after-free bugs), they can gain full root access to the underlying host server.
      <br/><br/>
      Furthermore, running a container with <code>--privileged</code> or mounting the host Docker socket (<code>/var/run/docker.sock</code>) gives immediate root access to the host. Production systems use <strong>defense-in-depth</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">
        <li><strong>Drop Linux capabilities:</strong> Strip away dangerous capabilities like <code>CAP_SYS_ADMIN</code>, <code>CAP_NET_ADMIN</code>, and <code>CAP_PTRACE</code>.</li>
        <li><strong>Seccomp & LSM:</strong> Use Seccomp filters to block risky system calls, combined with AppArmor or SELinux profiles.</li>
        <li><strong>Rootless containers & User Namespaces:</strong> Map root inside the container (UID 0) to a completely unprivileged high UID (e.g., UID 100001) on the host.</li>
        <li><strong>MicroVM sandboxes:</strong> When running untrusted user code (e.g., online code runners, cloud IDEs, serverless functions), do not use raw containers — use hardware-isolated microVMs like <strong>AWS Firecracker</strong> or sandboxed runtimes like <strong>Google gVisor</strong>.</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is container orchestration, and what distributed system problems does Kubernetes solve?",
      answer: `While a container runtime (like Docker or containerd) runs a container on a <em>single server</em>, <strong>Kubernetes orchestrates thousands of containers across a cluster of servers</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">
        <li><strong>Intelligent Scheduling (Bin-Packing):</strong> Finds the best physical node for each container based on CPU/RAM requests, avoiding wasted hardware.</li>
        <li><strong>Self-Healing:</strong> If a container crashes, Kubernetes restarts it automatically. If an entire physical node dies, it re-creates those pods on healthy nodes.</li>
        <li><strong>Internal Service Discovery & Load Balancing:</strong> Assigns a stable virtual IP (ClusterIP) and DNS name to groups of pods so services can communicate reliably even as individual pod IPs change.</li>
        <li><strong>Zero-Downtime Rolling Updates:</strong> Gradually replaces old versions with new ones, checking health probes before routing production traffic.</li>
        <li><strong>Auto-Scaling (HPA & VPA):</strong> Adds more pod replicas when CPU, memory, or custom request metrics surge.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is the exact internal difference between a container image, an image layer, and a running container?",
      answer: `The secret is the <strong>Union Filesystem (OverlayFS)</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">
        <li><strong>Image Layer:</strong> An immutable, read-only tarball created by a Dockerfile command (e.g. <code>RUN apt-get install</code>). Each layer only stores the difference (delta) from the previous layer.</li>
        <li><strong>Container Image:</strong> A JSON manifest file pointing to an ordered stack of these read-only layers, plus metadata like environment variables and default command.</li>
        <li><strong>Running Container:</strong> The container engine stacks all the read-only layers (called <code>lowerdir</code>) and adds a single, thin <strong>read-write layer on top</strong> (called <code>upperdir</code>).
        <br/>When the application modifies an existing file, OverlayFS copies the file from the lower read-only layer into the upper writeable layer before changing it (called <strong>Copy-on-Write</strong>). When the container is destroyed, only that top thin layer is deleted; the base image layers stay cached on disk for other containers to reuse.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "If containers share the host kernel, how can you run an Ubuntu container on an Amazon Linux or Red Hat host?",
      answer: `Because operating systems have two distinct parts: <strong>User Space</strong> and <strong>Kernel Space</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">
        <li><strong>User Space:</strong> Includes command-line utilities, package managers (<code>apt</code>, <code>yum</code>, <code>pacman</code>), libraries (glibc), and application code.</li>
        <li><strong>Kernel Space:</strong> The core Linux kernel that directly controls CPU scheduling, memory page tables, and hardware drivers via the standard <strong>Linux System Call Interface (syscall ABI)</strong>.</li>
      </ul>
      A container packages <em>only the user space</em>. An Ubuntu container simply contains Ubuntu's version of <code>bash</code>, <code>apt</code>, and libraries. When an application inside that container makes a system call (like reading a file or opening a network socket), that request goes directly to the host machine's Linux kernel. As long as the CPU architecture matches (e.g., x86_64) and the host kernel supports those standard system calls, any Linux distribution can run on any Linux host.`
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
          <p class="text-[13.5px] text-slate-400 font-sans pl-4">
            Hardware Abstraction vs. Kernel Multiplexing · Hypervisors, Namespaces, cgroups & MicroVM Sandboxes
          </p>
        </div>

        <!-- DEFINITIONS & MENTAL MODEL Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            THE SIMPLE MENTAL MODEL: HOUSES VS. APARTMENTS
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-300 leading-relaxed font-sans">
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-cyan-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">home</span>
                Virtual Machine = Standalone House
              </strong>
              <p>
                A VM is like building a whole standalone house on a plot of land. It has its own private foundation, plumbing, and roof (a complete guest OS with its own kernel, device drivers, and background services). <strong>Complete isolation and privacy</strong>, but it takes minutes to build and consumes gigabytes of space.
              </p>
            </div>
            <div class="bg-[#0A0E1A] p-4 rounded-lg border border-[#24314A]">
              <strong class="text-emerald-300 flex items-center gap-1.5 mb-1.5">
                <span class="material-symbols-outlined text-[17px]">apartment</span>
                Container = High-Rise Apartment
              </strong>
              <p>
                A container is like an apartment inside a shared residential tower. You have your own private locked door and furniture (application code, dependencies, environment), but every unit <strong>shares the same structural foundation and water pipes (the host OS kernel)</strong>. Extremely lightweight and boots in milliseconds, but a break in the main foundation affects everyone.
              </p>
            </div>
          </div>
        </div>

        <!-- WHY THIS MATTERS IN SYSTEM DESIGN INTERVIEWS -->
        <div class="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            INTERVIEW SIGNAL
          </span>
          <p class="text-[12.5px] text-indigo-200/90 leading-relaxed font-sans">
            <strong>Why interviewers care:</strong> They want to see if you understand compute trade-offs. Default to <strong>containers</strong> for microservices (fast deployments, high density). Use <strong>MicroVMs (Firecracker)</strong> when running untrusted customer code in multi-tenant environments. Use <strong>full VMs</strong> only when you need custom kernel modules, strict regulatory hardware isolation, or legacy non-Linux systems.
          </p>
        </div>

        <!-- ARCHITECTURAL DIFFERENCE DIAGRAM: HYPERVISOR VS. CONTAINER RUNTIME -->
        <div class="os-diagram-canvas rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl border border-slate-200 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[12.5px] sm:text-[13px] font-code font-bold tracking-wider text-cyan-800 uppercase">
                ARCHITECTURAL DIFFERENCE: HYPERVISOR VS. CONTAINER RUNTIME
              </span>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-code text-slate-600">
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-medium">Hardware-Level Isolation</span>
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">OS Kernel Sharing</span>
            </div>
          </div>

          <!-- The Architectural Diagram Image As-Is -->
          <div class="flex flex-col gap-3">
            <div class="os-diagram-img-frame relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-sm flex items-center justify-center">
              <img 
                src="/images/vm-vs-containers.jpg" 
                alt="Virtual Machines vs. Containers (Hardware-Level Isolation vs. Operating System-Level Kernel Sharing)" 
                class="w-full h-auto max-w-5xl rounded-lg object-contain bg-white cursor-zoom-in transition-transform duration-200 hover:scale-[1.008]"
                loading="eager"
                title="Click to view image full resolution"
                onclick="window.open('/images/vm-vs-containers.jpg', '_blank')"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-sans text-slate-500 px-1">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px] text-cyan-600">zoom_in</span>
                Click diagram to view in high resolution in new tab
              </span>
              <span class="font-code text-[10.5px] text-slate-500">Virtual Machines (VM 1 JVM, VM 2 Node) vs. Containers (containerd / runc)</span>
            </div>
          </div>

          <!-- Key Architectural Comparisons -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12px]">
            <div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 shadow-sm">
              <div class="flex items-center gap-2 mb-1.5 font-bold text-[13px] text-cyan-900">
                <span class="material-symbols-outlined text-[18px]">dns</span>
                <span>Hypervisor Emulation (Virtual Machines)</span>
              </div>
              <p class="leading-relaxed text-[12px] text-slate-700">
                Virtualizes raw hardware using a <strong>Type 1 (bare-metal, e.g. ESXi, KVM)</strong> or <strong>Type 2 (hosted, e.g. VirtualBox)</strong> hypervisor. The hypervisor intercepts CPU instructions, manages virtual memory tables, and emulates virtual disks and network cards. Every VM runs a complete guest OS kernel, providing ironclad hardware security at the cost of high RAM overhead and minute-long boots.
              </p>
            </div>
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
              <div class="flex items-center gap-2 mb-1.5 font-bold text-[13px] text-emerald-900">
                <span class="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>Kernel Namespaces &amp; cgroups (Containers)</span>
              </div>
              <p class="leading-relaxed text-[12px] text-slate-700">
                Containers are not simulated computers — they are regular Linux processes running directly on the <strong>shared host OS kernel</strong>. <strong>Namespaces</strong> act as blindfolds (controlling what the process can <em>see</em>), and <strong>cgroups</strong> act as ration cards (limiting how much CPU and RAM it can <em>consume</em>). This enables sub-second startups and tiny image footprints.
              </p>
            </div>
          </div>
        </div>

        <!-- Deep Dive: How Containerisation Works: cgroups and namespaces -->
        <div class="bg-[#141C2E] border-l-4 border-cyan-500 rounded-r-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">tune</span>
            HOW CONTAINERS ACTUALLY WORK: THREE LINUX KERNEL BUILDING BLOCKS
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            A container is not a magical virtual box. It is a standard Linux process isolated by three core kernel primitives:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0A0E1A] p-4 rounded-xl border border-[#24314A] flex flex-col gap-2">
              <span class="font-code text-[12px] font-bold text-cyan-300 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">visibility_off</span>
                1. Namespaces (What You Can See)
              </span>
              <p class="text-slate-300 leading-relaxed text-[12px]">
                Gives the process its own private view of system resources so it thinks it is the only program on the computer:
              </p>
              <ul class="text-[11.5px] text-slate-400 space-y-1 font-code">
                <li>• <strong>PID:</strong> Sees itself as Process ID 1; cannot see host processes.</li>
                <li>• <strong>NET:</strong> Own private IP address, routing table, and port range.</li>
                <li>• <strong>MNT:</strong> Dedicated root file system mount point.</li>
                <li>• <strong>IPC:</strong> Private inter-process message queues and shared memory.</li>
                <li>• <strong>UTS:</strong> Independent hostname (e.g. <code>my-service-pod-3</code>).</li>
                <li>• <strong>USER:</strong> Maps container root (UID 0) to a safe, unprivileged host user.</li>
              </ul>
            </div>

            <div class="bg-[#0A0E1A] p-4 rounded-xl border border-[#24314A] flex flex-col gap-2">
              <span class="font-code text-[12px] font-bold text-emerald-300 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">speed</span>
                2. cgroups v2 (What You Can Use)
              </span>
              <p class="text-slate-300 leading-relaxed text-[12px]">
                Enforces hard resource limits so a single broken container cannot crash the entire physical machine:
              </p>
              <ul class="text-[11.5px] text-slate-400 space-y-1 font-code">
                <li>• <strong>CPU Quota:</strong> Caps CPU time via <code>cpu.cfs_quota_us</code>. Throttles CPU on breach.</li>
                <li>• <strong>Memory Ceiling:</strong> Sets max RAM. If exceeded, Linux OOM-killer immediately kills the container.</li>
                <li>• <strong>Block I/O:</strong> Restricts read/write disk speed so log writes do not choke disk throughput.</li>
                <li>• <strong>PIDs Limit:</strong> Caps maximum running processes to completely prevent fork bombs.</li>
              </ul>
            </div>

            <div class="bg-[#0A0E1A] p-4 rounded-xl border border-[#24314A] flex flex-col gap-2">
              <span class="font-code text-[12px] font-bold text-indigo-300 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">layers</span>
                3. OverlayFS (How Files Are Stored)
              </span>
              <p class="text-slate-300 leading-relaxed text-[12px]">
                Stacks read-only layers like sheets of clear glass, with a single writable layer on top:
              </p>
              <ul class="text-[11.5px] text-slate-400 space-y-1 font-code">
                <li>• <strong>LowerDir:</strong> The read-only base image layers (Ubuntu, Node.js, packages). Shared across containers.</li>
                <li>• <strong>UpperDir:</strong> A thin, ephemeral writable layer unique to this running container.</li>
                <li>• <strong>MergedDir:</strong> The unified view the application actually interacts with.</li>
                <li>• <strong>Copy-on-Write:</strong> Modifying a file copies it up to UpperDir before editing, preserving the base image.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Technical Comparison Table -->
        <div class="flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DETAILED TECHNICAL COMPARISON MATRIX
          </span>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3.5">Dimension</th>
                  <th class="p-3.5">Virtual Machines (VMs)</th>
                  <th class="p-3.5">Containers</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${comparisonRows.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3.5 font-semibold text-white">${row.dimension}</td>
                    <td class="p-3.5 ${row.vmsHighlight}">${row.vms}</td>
                    <td class="p-3.5 ${row.containersHighlight}">${row.containers}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- The Middle Ground: MicroVMs (AWS Firecracker & gVisor) -->
        <div class="bg-gradient-to-r from-blue-950/40 to-cyan-950/30 border border-blue-500/40 rounded-xl p-5 sm:p-6 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">memory</span>
            THE MODERN COMPROMISE: MICROVMS & SANDBOXED RUNTIMES
          </span>
          <p class="text-[13px] text-slate-200 leading-relaxed font-sans">
            Engineers once faced a painful trade-off: accept the <strong>minute-long boot times of heavy VMs</strong>, or accept the <strong>shared-kernel security risks of containers</strong>. Modern cloud architecture solved this with <strong>MicroVMs</strong>:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0A0E1A]/80 border border-cyan-500/30 rounded-lg p-4">
              <span class="font-code text-[12px] font-bold text-cyan-300 block mb-1">AWS Firecracker (KVM MicroVM)</span>
              <p class="text-slate-300 leading-relaxed">
                A minimalist hypervisor written in Rust on top of Linux KVM. It strips out all legacy emulated hardware (floppy drives, IDE controllers). A minimal Linux kernel boots in <strong>~5 milliseconds with only ~5 MB of memory overhead</strong>. Powers AWS Lambda and Fargate to run millions of untrusted customer workloads daily with true hardware isolation.
              </p>
            </div>
            <div class="bg-[#0A0E1A]/80 border border-indigo-500/30 rounded-lg p-4">
              <span class="font-code text-[12px] font-bold text-indigo-300 block mb-1">Google gVisor & Kata Containers</span>
              <p class="text-slate-300 leading-relaxed">
                <strong>gVisor:</strong> A user-space kernel written in memory-safe Go. It intercepts application system calls before they ever reach the host Linux kernel (used in Google Cloud Run and GKE Sandbox).
                <br/><br/>
                <strong>Kata Containers:</strong> Looks and feels like a regular Docker container, but runs each pod inside a dedicated, ultra-lightweight hardware VM.
              </p>
            </div>
          </div>
        </div>

        <!-- Official Page 12 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 12</span>
        </div>

      </div>


      <!-- ================================================================= -->
      <!-- PAGE 13: PREFER BOXES, CALLOUTS, FOLLOW-UPS & TAKEAWAY -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Two Columns: Prefer Containers vs. Prefer VMs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- PREFER CONTAINERS WHEN -->
          <div class="bg-emerald-950/15 border border-emerald-500/30 rounded-xl p-5 flex flex-col gap-3">
            <span class="font-code text-[11.5px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              PREFER CONTAINERS WHEN
            </span>
            <ul class="flex flex-col gap-2.5 text-[12.5px] text-emerald-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Internal Microservices & Fast CI/CD:</strong> Quick build cycles, sub-second deployment rollouts, and identical environments from local laptop to staging.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Single-Tenant / Trusted Code:</strong> High hardware density where all microservices belong to your company and you do not execute arbitrary code from strangers.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Sudden Traffic Bursts:</strong> Rapidly auto-scaling web API instances from 5 to 500 pods in seconds to handle flash sales or viral spikes.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Short-Lived Ephemeral Tasks:</strong> Spawning background worker jobs (e.g. resizing an image, sending email batches) that exit immediately upon completion.</span>
              </li>
            </ul>
          </div>

          <!-- PREFER VIRTUAL MACHINES WHEN -->
          <div class="bg-rose-950/15 border border-rose-500/30 rounded-xl p-5 flex flex-col gap-3">
            <span class="font-code text-[11.5px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">security</span>
              PREFER VIRTUAL MACHINES WHEN
            </span>
            <ul class="flex flex-col gap-2.5 text-[12.5px] text-rose-200/90 font-sans">
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Multi-Tenant Untrusted Code:</strong> Running user-submitted code (like LeetCode code execution, CI/CD runners, or multi-tenant SaaS) where a kernel escape would be catastrophic.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Operating System Diversity:</strong> Running different OS kernels (Windows Server, Linux, BSD) simultaneously on the same physical hardware.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Strict Regulatory Compliance:</strong> Audits (PCI-DSS Level 1, HIPAA, FedRAMP High) mandating dedicated hypervisor-enforced hardware isolation.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Custom Kernel Drivers:</strong> Legacy enterprise applications requiring specialized kernel modules, specific kernel versions, or low-level hardware hooks.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Orange Callout: The Container Escape Vulnerability -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            THE CRITICAL INTERVIEW TRAP: CONTAINERS ARE NOT SECURITY WALLS
          </span>
          <p class="text-[13px] text-amber-200/90 leading-relaxed font-sans">
            A container is a <strong>software configuration boundary, not a hardware security barrier</strong>. Because every container on a host shares one single Linux kernel, any unpatched kernel bug allows an attacker to break out and control the entire host server. <em>Interview tip:</em> Never propose running untrusted third-party code in standard Docker containers. Always specify <strong>MicroVMs (AWS Firecracker)</strong> or <strong>sandboxed kernels (gVisor)</strong>.
          </p>
        </div>

        <!-- Green Box: Senior Perspective: Multi-Tenancy & The Kubernetes Fleet Illusion -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: MULTI-TENANCY & THE KUBERNETES FLEET REALITY
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            Senior engineers recognize that <strong>Kubernetes solves fleet management, not security isolation</strong>. Kubernetes namespaces are purely logical labels for grouping resources — they do not prevent noisy neighbors from exhausting network bandwidth or triggering kernel panics. In production, use <strong>Soft Multi-Tenancy</strong> (separate namespaces) only for internal trusted teams on the same cluster, and enforce <strong>Hard Multi-Tenancy</strong> (separate physical nodes via taints/tolerations or separate clusters entirely) for different external clients.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            If a container begins leaking memory on a shared server, what prevents it from crashing the other services? Which cgroups v2 file would you inspect to verify its memory limit?
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
            Containers abstract the operating system; virtual machines abstract physical hardware. Containers give you rapid deployments, sub-second auto-scaling, and maximum resource density; virtual machines give you hardware-grade security and isolation. When designing modern hyperscale serverless systems (like AWS Lambda), MicroVMs (Firecracker) bridge the gap by delivering hardware isolation with 5ms boot times.
          </p>
        </div>

        <!-- Official Page 13 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 13</span>
        </div>

      </div>

    </div>
  `;
}
