/**
 * 1.2 Virtualization vs. Containerization - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 12 & 13
 * from The Modern System Design Interview Guide.
 */

export function renderVirtualizationVsContainersContent(topic) {
  const comparisonRows = [
    {
      dimension: "Abstraction Layer",
      vms: "Hardware-level abstraction (Hypervisor emulates CPU, RAM, disk, NIC)",
      containers: "Operating system-level abstraction (Shared host kernel via namespaces/cgroups)",
      vmsHighlight: "text-slate-300 font-sans",
      containersHighlight: "text-emerald-300 font-semibold font-sans"
    },
    {
      dimension: "Guest OS Requirement",
      vms: "Mandatory. Each VM boots a full, independent OS kernel with distinct drivers",
      containers: "None. Containers bundle user space binaries, libraries, and application code only",
      vmsHighlight: "text-amber-400 font-bold font-sans",
      containersHighlight: "text-emerald-400 font-bold font-sans"
    },
    {
      dimension: "Security Isolation Boundary",
      vms: "Hardware-grade (CPU ring -1 / hypervisor VT-x, VT-d hardware enforcement)",
      containers: "Weak to moderate (Software kernel config boundary; shared kernel attack surface)",
      vmsHighlight: "text-emerald-400 font-semibold font-sans",
      containersHighlight: "text-amber-400 font-semibold font-sans"
    },
    {
      dimension: "Startup Latency",
      vms: "Minutes to tens of seconds (Full BIOS/UEFI boot, kernel init, systemd daemons)",
      containers: "Milliseconds to ~1 second (Instantaneous fork/exec of isolated native process)",
      vmsHighlight: "text-slate-400 font-sans",
      containersHighlight: "text-emerald-300 font-semibold font-sans"
    },
    {
      dimension: "Image Disk Footprint",
      vms: "Gigabytes to tens of GBs (Full OS kernel, system packages, swap file, logs)",
      containers: "Megabytes (Distroless / Alpine images can be as small as 5–20 MB)",
      vmsHighlight: "text-slate-400 font-sans",
      containersHighlight: "text-cyan-300 font-semibold font-sans"
    },
    {
      dimension: "Resource Overhead & Hypervisor Tax",
      vms: "5–15% CPU & RAM overhead (Virtual MMU emulation, hypervisor scheduling, duplicate OS)",
      containers: "Near-zero overhead (Executes directly as native Linux processes on bare metal)",
      vmsHighlight: "text-slate-400 font-sans",
      containersHighlight: "text-emerald-300 font-semibold font-sans"
    },
    {
      dimension: "Host Packing Density",
      vms: "Low (Dozens of VMs per physical host before memory exhaustion)",
      containers: "High (Hundreds to thousands of containers multiplexed onto a single server)",
      vmsHighlight: "text-slate-400 font-sans",
      containersHighlight: "text-emerald-300 font-semibold font-sans"
    },
    {
      dimension: "Multi-Tenancy on Shared Host",
      vms: "Safe for untrusted tenants (Hard hardware boundary protects neighbors from noisy/malicious code)",
      containers: "Unsafe for untrusted tenants (Risk of noisy-neighbor resource starvation & container escapes)",
      vmsHighlight: "text-emerald-300 font-semibold font-sans",
      containersHighlight: "text-rose-400 font-semibold font-sans"
    },
    {
      dimension: "Kernel Heterogeneity",
      vms: "High. Run Windows, Linux, and FreeBSD side-by-side on the same physical hardware",
      containers: "Strictly homogeneous. All containers must execute against the host's Linux kernel ABI",
      vmsHighlight: "text-cyan-300 font-semibold font-sans",
      containersHighlight: "text-slate-400 font-sans"
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Can a container escape to the host operating system, and how do production clusters prevent it?",
      answer: `<strong>Yes, container escapes happen regularly.</strong> A container is fundamentally a regular Linux process running with namespace and cgroup restrictions. If an attacker exploits a kernel privilege escalation vulnerability (e.g., Dirty COW, CVE-2022-0847 Dirty Pipe, CVE-2024-1086), they gain root privileges across the entire host node.
      <br/><br/>
      Furthermore, running a container with <code>--privileged</code> or mounting the host Docker socket (<code>/var/run/docker.sock</code>) gives immediate, trivial host root access. Production defense-in-depth requires:
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">
        <li><strong>Dropping Linux capabilities:</strong> Drop <code>CAP_SYS_ADMIN</code>, <code>CAP_NET_ADMIN</code>, <code>CAP_PTRACE</code> via Kubernetes SecurityContext.</li>
        <li><strong>Enforcing Seccomp & LSM profiles:</strong> Apply strict Seccomp filters to block dangerous syscalls, paired with AppArmor or SELinux policies.</li>
        <li><strong>Rootless containers & User Namespaces:</strong> Map root inside the container (UID 0) to an unprivileged high UID (e.g. UID 100001) on the host.</li>
        <li><strong>MicroVM sandboxes:</strong> For multi-tenant untrusted code execution, never rely on raw containers; mandate hardware-isolated microVMs (AWS Firecracker, Kata Containers, gVisor).</li>
      </ul>`
    },
    {
      qNum: "Q2",
      question: "What is container orchestration, and what exact distributed system problems does Kubernetes solve?",
      answer: `While a container runtime (containerd, Docker) manages a single container on a single host, <strong>orchestration solves the distributed fleet problem</strong> across thousands of bare-metal or cloud nodes:
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">
        <li><strong>Bin-Packing & Scheduling:</strong> The Kubernetes scheduler evaluates CPU/memory requests, node affinity, taints, and tolerations to place pods efficiently across a cluster.</li>
        <li><strong>Self-Healing & Liveness:</strong> Automatically restarts crashed containers, reschedules pods when an entire hardware worker node dies, and halts traffic to unhealthy pods via readiness probes.</li>
        <li><strong>Service Discovery & Internal Load Balancing:</strong> Assigns stable virtual IPs (ClusterIP) and DNS names via CoreDNS and kube-proxy iptables/IPVS rules, routing around dead pods.</li>
        <li><strong>Declarative Rolling Updates & Rollbacks:</strong> Executes zero-downtime canary or rolling deployments, monitoring error rates and halting progress automatically on failure.</li>
        <li><strong>Secret & Config Decoupling:</strong> Mounts dynamic configurations and encrypted credentials into container filesystems without baking them into immutable container images.</li>
      </ul>`
    },
    {
      qNum: "Q3",
      question: "What is the exact internal difference between an OCI container image, an image layer, and a running container?",
      answer: `The distinction lies in the union filesystem architecture (OverlayFS):
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">
        <li><strong>Image Layer:</strong> An immutable, content-addressable tarball created by a Dockerfile instruction (e.g. <code>RUN apt-get update</code>). Layers store only the delta (added, modified, or deleted files marked with whiteout files) relative to parent layers.</li>
        <li><strong>Container Image:</strong> An immutable manifest referencing an ordered stack of read-only image layers plus a JSON configuration file defining environment variables, entrypoints, and working directories.</li>
        <li><strong>Running Container:</strong> The container engine stacks the read-only image layers as <code>lowerdir</code> and adds a thin, ephemeral <strong>read-write layer</strong> on top (<code>upperdir</code>). OverlayFS merges them into a unified mount (<code>mergeddir</code>).
        <br/>When a container writes to an existing file, OverlayFS performs a <strong>Copy-on-Write (CoW)</strong>: it copies the file from the lower read-only layer into the upper writeable layer before modifying it. When the container terminates, only the top ephemeral writeable layer is discarded; the base image layers remain cached and shared across other running containers on the host.</li>
      </ul>`
    },
    {
      qNum: "Q4",
      question: "If containers share the host operating system kernel, how can you run an Ubuntu or Debian container on an Arch Linux or Amazon Linux host?",
      answer: `Because operating systems consist of two distinct architectural layers: <strong>User Space</strong> and <strong>Kernel Space</strong>:
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">
        <li><strong>User Space:</strong> Includes user binaries, package managers (<code>apt</code>, <code>pacman</code>, <code>yum</code>), the C standard library (glibc, musl), shells, and environment configurations.</li>
        <li><strong>Kernel Space:</strong> The monolithic Linux kernel managing CPU scheduling, page tables, memory management, and hardware device drivers via the stable Linux System Call ABI (Application Binary Interface).</li>
      </ul>
      A container bundles <em>only user space</em>. An Ubuntu container simply ships Ubuntu's <code>/bin/bash</code>, <code>apt</code>, and Ubuntu-compiled shared libraries. When an Ubuntu binary executes on an Arch Linux host, its glibc issues standard Linux syscalls (e.g. <code>sys_openat</code>, <code>sys_read</code>, <code>sys_clone</code>) directly to the host's Arch kernel. As long as the underlying CPU architecture matches (e.g. x86_64) and the host kernel satisfies the minimum syscall requirements of the container's glibc, any Linux distribution container runs seamlessly on any Linux host.`
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

        <!-- DEFINITIONS Box -->
        <div class="bg-[#141C2E] border border-[#24314A] rounded-xl p-5 flex flex-col gap-2.5">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            FORMAL DEFINITIONS & CORE PHILOSOPHY
          </span>
          <div class="flex flex-col gap-2.5 text-[13px] text-slate-300 leading-relaxed font-sans">
            <p>
              <strong class="text-white">Virtualization:</strong> <em>"Virtualization is a technology that allows you to create multiple simulated environments or dedicated resources from a single, physical hardware system"</em> [1]. A hypervisor intercepts machine instructions and simulates virtual hardware devices, enabling multiple full operating systems to execute concurrently.
            </p>
            <p>
              <strong class="text-white">Containerization:</strong> <em>"Containerization is the packaging together of software code with all its necessary components like libraries, frameworks, and other dependencies so that they are isolated in their own container"</em> [2]. Containers do not emulate hardware; they execute directly as native processes multiplexed on the host OS kernel using kernel isolation primitives.
            </p>
          </div>
        </div>

        <!-- ARCHITECTURAL DIFFERENCE DIAGRAM (ASCII Art + Stack Comparison) -->
        <div class="bg-[#0A0E1A] border border-[#24314A] rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#24314A]/60">
            <span class="text-[11px] font-code font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              ARCHITECTURAL DIFFERENCE: HYPERVISOR VS. CONTAINER RUNTIME
            </span>
            <span class="text-[11px] font-code text-slate-500">Hardware Emulation vs. Kernel Sharing</span>
          </div>

          <!-- ASCII Architectural Stack Diagram -->
          <div class="p-4 bg-[#070B14] rounded-lg border border-slate-800 text-slate-300 overflow-x-auto text-[11.5px] leading-relaxed">
            <pre class="font-code text-slate-300">
+-------------------------------------------------------------------------------------------------------------+
|                                        VIRTUAL MACHINES VS. CONTAINERS                                      |
+-------------------------------------------------------------------------------------------------------------+

             VIRTUAL MACHINES (VMS)                                      CONTAINERS
     [ Hardware-Level Isolation via Hypervisor ]             [ Operating System-Level Kernel Sharing ]

    +-------------------+  +-------------------+        +-------------------+  +-------------------+
    |    App 1 (JVM)    |  |   App 2 (Node)    |        |    App 1 (JVM)    |  |   App 2 (Node)    |
    +-------------------+  +-------------------+        +-------------------+  +-------------------+
    |     Bins/Libs     |  |     Bins/Libs     |        |     Bins/Libs     |  |     Bins/Libs     |
    +-------------------+  +-------------------+        +-------------------+  +-------------------+
    |   Guest OS Kernel |  |   Guest OS Kernel |                  ▲                      ▲
    |   (Windows / RHEL)|  |   (Ubuntu / Debian|                  │                      │
    +-------------------+  +-------------------+                  │                      │
              ▲                      ▲                            │                      │
              └──────────────┬───────┘                            ▼                      ▼
                             ▼                          +--------------------------------------------------+
    +-------------------------------------------------+ |          CONTAINER RUNTIME (containerd / runc)   |
    |          HYPERVISOR (KVM / ESXi / Xen)          | |  Namespaces (PID, Net, Mount) + cgroups (Limits) |
    +-------------------------------------------------+ +--------------------------------------------------+
                             ▼                                                    ▼
    +-------------------------------------------------+ +--------------------------------------------------+
    |           HOST OPERATING SYSTEM / KERNEL        | |           HOST OPERATING SYSTEM / KERNEL         |
    +-------------------------------------------------+ +--------------------------------------------------+
                             ▼                                                    ▼
    +-------------------------------------------------+ +--------------------------------------------------+
    |         PHYSICAL HARDWARE (CPU, RAM, NIC, NVMe) | |         PHYSICAL HARDWARE (CPU, RAM, NIC, NVMe)  |
    +-------------------------------------------------+ +--------------------------------------------------+

    ▲ Each VM has its own private kernel              ▲ Containers share the underlying host kernel
    ▲ Heavyweight: GBs disk, minutes to boot          ▲ Lightweight: MBs disk, sub-second boot
    ▲ Strong hardware boundary: safe for untrusted code▲ Soft boundary: kernel bug can compromise host</pre>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12px]">
            <div class="bg-[#0F1626] border border-cyan-500/30 rounded-lg p-3 text-cyan-200">
              <strong class="text-white block mb-1">Hypervisor Emulation (VMs):</strong>
              Virtualizes the hardware architecture. The hypervisor intercepts privileged CPU instructions, emulates virtual hardware devices, and maintains separate virtual memory page tables. Each guest OS kernel manages its own scheduler and memory.
            </div>
            <div class="bg-[#0F1626] border border-emerald-500/30 rounded-lg p-3 text-emerald-200">
              <strong class="text-white block mb-1">Kernel Namespace Isolation (Containers):</strong>
              A container is not a machine; it is a standard Linux process governed by two kernel primitives: <strong>Namespaces</strong> determine what a process can <em>see</em>, and <strong>cgroups</strong> determine what a process can <em>consume</em>.
            </div>
          </div>
        </div>

        <!-- Deep Dive: How Containerisation Works: cgroups and namespaces -->
        <div class="bg-[#141C2E] border-l-4 border-cyan-500 rounded-r-xl p-5 flex flex-col gap-3">
          <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">tune</span>
            HOW CONTAINERISATION WORKS: LINUX KERNEL PRIMITIVES
          </span>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans">
            A container is not an emulation layer. It is a normal Linux process wrapped by three fundamental operating system subsystems:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0A0E1A] p-4 rounded-xl border border-[#24314A] flex flex-col gap-2">
              <span class="font-code text-[12px] font-bold text-cyan-300">1. Linux Namespaces</span>
              <p class="text-slate-300 leading-relaxed">
                Virtualizes system resources so processes believe they own a dedicated OS. Governs 6 core isolation boundaries:
              </p>
              <ul class="text-[11.5px] text-slate-400 space-y-1 font-code">
                <li>• <strong>pid:</strong> Virtualizes process IDs (container sees itself as PID 1).</li>
                <li>• <strong>net:</strong> Private virtual Ethernet pairs, routing tables, and IP.</li>
                <li>• <strong>mnt:</strong> Isolated root filesystem mount point.</li>
                <li>• <strong>ipc:</strong> System V IPC and POSIX message queue isolation.</li>
                <li>• <strong>uts:</strong> Hostname and NIS domain name isolation.</li>
                <li>• <strong>user:</strong> Maps container root UID 0 to high unprivileged host UID.</li>
              </ul>
            </div>

            <div class="bg-[#0A0E1A] p-4 rounded-xl border border-[#24314A] flex flex-col gap-2">
              <span class="font-code text-[12px] font-bold text-emerald-300">2. Control Groups (cgroups v2)</span>
              <p class="text-slate-300 leading-relaxed">
                Enforces strict hardware resource quotas to prevent noisy-neighbor server degradation:
              </p>
              <ul class="text-[11.5px] text-slate-400 space-y-1 font-code">
                <li>• <strong>CPU shares & CFS quota:</strong> Limits CPU percentage via <code>cpu.cfs_quota_us</code>.</li>
                <li>• <strong>Memory ceiling:</strong> Enforces hard RAM limits; triggers OOM-killer on breach.</li>
                <li>• <strong>Block I/O throttle:</strong> Restricts read/write IOPS and MB/s via <code>io.max</code>.</li>
                <li>• <strong>Process count:</strong> Limits maximum forks via <code>pids.max</code> to prevent fork bombs.</li>
              </ul>
            </div>

            <div class="bg-[#0A0E1A] p-4 rounded-xl border border-[#24314A] flex flex-col gap-2">
              <span class="font-code text-[12px] font-bold text-indigo-300">3. Union Filesystem (OverlayFS)</span>
              <p class="text-slate-300 leading-relaxed">
                Implements copy-on-write (CoW) storage layers to enable instant startup and low disk footprint:
              </p>
              <ul class="text-[11.5px] text-slate-400 space-y-1 font-code">
                <li>• <strong>LowerDir:</strong> Stack of read-only immutable image layers.</li>
                <li>• <strong>UpperDir:</strong> Thin, ephemeral read-write container layer.</li>
                <li>• <strong>MergedDir:</strong> Unified filesystem presentation to the application.</li>
                <li>• Modifying an image file triggers Copy-on-Write to UpperDir.</li>
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
            THE MIDDLE GROUND: MICROVMS & SANDBOXED RUNTIMES
          </span>
          <p class="text-[13px] text-slate-200 leading-relaxed font-sans">
            Engineers once faced a binary compromise: accept the <strong>minute-long boot times of heavy VMs</strong>, or accept the <strong>shared-kernel security risks of containers</strong>. Cloud hyperscalers invented <strong>MicroVMs</strong> to capture the best of both paradigms:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[12.5px] font-sans">
            <div class="bg-[#0A0E1A]/80 border border-cyan-500/30 rounded-lg p-4">
              <span class="font-code text-[12px] font-bold text-cyan-300 block mb-1">AWS Firecracker (KVM-Based MicroVM)</span>
              <p class="text-slate-300 leading-relaxed">
                A minimalist hypervisor written in Rust utilizing Linux KVM. It strips out all legacy emulated devices (floppy drives, IDE controllers, PCI buses). A stripped-down Linux kernel boots in <strong>~5 milliseconds with only ~5 MB of memory overhead</strong>. AWS Lambda and Fargate execute tens of millions of untrusted customer workloads on Firecracker daily with true hardware virtualization boundaries.
              </p>
            </div>
            <div class="bg-[#0A0E1A]/80 border border-indigo-500/30 rounded-lg p-4">
              <span class="font-code text-[12px] font-bold text-indigo-300 block mb-1">Google gVisor & Kata Containers</span>
              <p class="text-slate-300 leading-relaxed">
                <strong>gVisor:</strong> An application kernel written in memory-safe Go that runs in user space, intercepting and re-implementing Linux syscalls to completely insulate the host kernel. Used in Google Cloud Run and GKE Sandbox.
                <br/><br/>
                <strong>Kata Containers:</strong> Conforms to the standard OCI runtime specification but runs each container inside an isolated, lightweight hardware VM.
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
                <span><strong>Microservices & high deployment velocity:</strong> Fast CI/CD artifact generation, sub-second deployment rollouts, and reproducible developer staging environments.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Single-tenant / trusted enterprise workloads:</strong> High hardware density and bin-packing on private cloud clusters where all code is internal and trusted.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Auto-scaling burst traffic:</strong> Horizontally scaling API web tiers from 10 instances to 1,000 instances in seconds to absorb flash sales or sudden traffic spikes.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 mt-1 font-bold">•</span>
                <span><strong>Short-lived batch workers & CLI tasks:</strong> Spawning ephemeral worker tasks (e.g. video transcode chunks, cron jobs) that exit immediately upon completion.</span>
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
                <span><strong>Multi-tenant untrusted code execution:</strong> Running customer-submitted arbitrary code or public SaaS tenant workloads where container escapes would be catastrophic.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Operating system & kernel diversity:</strong> Running heterogeneous OS environments (Windows Server, Linux, FreeBSD) concurrently on the same physical bare-metal hardware.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Strict regulatory compliance:</strong> Industry certifications (PCI-DSS Level 1, HIPAA, FedRAMP High) mandating dedicated hypervisor-enforced hardware isolation boundaries.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-rose-400 mt-1 font-bold">•</span>
                <span><strong>Monolithic legacy configurations:</strong> Statefully running legacy enterprise software requiring specialized kernel modules, specific kernel versions, or direct virtual hardware hooks.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Orange Callout: The Container Escape Vulnerability -->
        <div class="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            THE CONTAINER ESCAPE VULNERABILITY: CONFIGURATION VS. HARDWARE BOUNDARY
          </span>
          <p class="text-[13px] text-amber-200/90 leading-relaxed font-sans">
            A container is a <strong>software configuration boundary, not a hardware security boundary</strong>. Because all containers share the single monolithic host kernel, any unpatched kernel vulnerability (such as a privilege escalation bug in the kernel memory subsystem or filesystem driver) gives an attacker full root access to the physical host machine and every neighboring tenant container. In an interview, never propose multi-tenant SaaS architecture running untrusted user scripts on raw containers; always isolate tenant code using MicroVMs (AWS Firecracker) or sandboxed kernels (gVisor).
          </p>
        </div>

        <!-- Green Box: Senior Perspective: Multi-Tenancy & The Kubernetes Fleet Illusion -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">psychology</span>
            SENIOR PERSPECTIVE: MULTI-TENANCY, MICROVMS & THE KUBERNETES FLEET ILLUSION
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            Senior engineers understand that <strong>Kubernetes solves fleet orchestration, not security isolation</strong>. Kubernetes namespaces are purely administrative metadata; they do not prevent noisy-neighbor CPU starvation, network saturation, or kernel panics. In enterprise multi-tenancy, mature engineering teams practice <strong>Soft Multi-Tenancy</strong> (separate namespaces for internal trusted teams on the same cluster) but enforce <strong>Hard Multi-Tenancy</strong> (separate physical nodes via node affinity/taints, separate VPC clusters, or Firecracker microVM runtimes) for external or untrusted tenants.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 text-[12.5px]">
          <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            What prevents a container from starving its neighbors of memory on the same host? How would you find out how much RAM a container is actually using under cgroups v2?
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
            Containers abstract the operating system; virtual machines abstract physical hardware. Containers buy developer velocity, sub-second auto-scaling, and maximum compute density; virtual machines buy hardware-grade multi-tenant fault isolation. MicroVMs (AWS Firecracker) exist because hyperscale multi-tenant serverless architectures refuse to compromise on either.
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
