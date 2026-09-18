/**
 * 1.3 Cloud Service Models: IaaS, PaaS, and SaaS - Visual Guide
 * High-signal, visually stunning and faithful reproduction of Pages 13 & 14
 * from The Modern System Design Interview Guide.
 */

export function renderCloudModelsContent(topic) {
  const stackLayers = [
    {
      layer: "Applications",
      onPrem: "You",
      iaas: "You",
      paas: "You",
      saas: "Provider"
    },
    {
      layer: "Data",
      onPrem: "You",
      iaas: "You",
      paas: "You",
      saas: "Provider"
    },
    {
      layer: "Runtime / Middleware",
      onPrem: "You",
      iaas: "You",
      paas: "Provider",
      saas: "Provider"
    },
    {
      layer: "OS",
      onPrem: "You",
      iaas: "You",
      paas: "Provider",
      saas: "Provider"
    },
    {
      layer: "Virtualization / Servers",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      saas: "Provider"
    },
    {
      layer: "Storage / Networking",
      onPrem: "You",
      iaas: "Provider",
      paas: "Provider",
      saas: "Provider"
    },
    {
      layer: "Example",
      onPrem: "Own racks",
      iaas: "EC2, S3, GCE",
      paas: "Heroku, App Engine, RDS, Lambda",
      saas: "Gmail, Datadog, Slack, Figma",
      isExample: true
    }
  ];

  const interviewFollowUps = [
    {
      qNum: "Q1",
      question: "Where do serverless runtimes (Lambda, Cloud Functions) sit?",
      answer: `They are often classified as <strong>FaaS (Function-as-a-Service)</strong>, a specialized sub-category of PaaS. The provider manages the runtime, OS, scaling to zero, and hardware; you provide only pure application code and event bindings (sec. 1.4).`
    },
    {
      qNum: "Q2",
      question: "How do you decide between deploying to an IaaS VM vs. a PaaS like Heroku vs. managed Kubernetes (EKS)?",
      answer: `<strong>Anchor on team size and operational headcount.</strong> Solo dev / early startup: PaaS wins on time-to-market. Scaling team with standard containerized workloads: EKS gives portability, cost control, and ecosystem access without managing bare VMs. Avoid raw IaaS VMs for application workloads unless you have specialized hardware requirements (custom kernel modules, FPGA, strict compliance).`
    },
    {
      qNum: "Q3",
      question: "What is vendor lock-in risk, and how do you mitigate it in a system design interview?",
      answer: `<strong>Differentiate between proprietary API lock-in</strong> (DynamoDB, Spanner, BigQuery) and <strong>runtime lock-in</strong> (running standard containers on EKS/GKE). Mitigate by using open-source protocol-compatible options (e.g. Postgres on RDS instead of Aurora proprietary features, Kafka instead of SQS) unless the proprietary feature provides a 10× architectural advantage.`
    }
  ];

  return `
    <div class="flex flex-col gap-6 animate-fadeIn text-slate-200 select-text cursor-default">

      <!-- ================================================================= -->
      <!-- PAGE 13 (BOTTOM) & PAGE 14: CLOUD MODELS, MATRIX & DEEP DIVES -->
      <!-- ================================================================= -->
      <div class="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-[#24314A] shadow-2xl p-6 sm:p-8 flex flex-col gap-6">

        <!-- Header: Purple Accent Bar + Title -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-7 bg-[#6366F1] rounded-sm shrink-0"></div>
            <h2 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
              1.3 Cloud Service Models: IaaS, PaaS, and SaaS
            </h2>
          </div>
        </div>

        <!-- On-premises Baseline Section -->
        <div class="flex flex-col gap-2 bg-[#141C2E] border border-[#24314A] rounded-xl p-4 sm:p-5">
          <h3 class="font-sans text-[14.5px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            On-premises baseline
          </h3>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans pl-3.5">
            For on-prem applications, you are responsible for the entire stack: hardware, OS, virtualization, runtime, data, and application.
          </p>
        </div>

        <!-- Cloud Service Model Overview Section -->
        <div class="flex flex-col gap-3">
          <h3 class="font-sans text-[15px] font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Cloud service model overview
          </h3>
          <p class="text-[13px] text-slate-300 leading-relaxed font-sans pl-2">
            With cloud computing, cloud providers take on varying degrees of responsibility for managing layers of the stack:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <!-- IaaS Card -->
            <div class="bg-[#141C2E] border border-cyan-500/30 rounded-xl p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded font-code text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  IaaS
                </span>
                <span class="text-[12px] font-sans font-bold text-white">Infrastructure as a Service</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                Provides fundamental compute, storage, and networking resources over the internet. You manage the OS, middleware, runtime, and applications; the cloud provider manages the physical infrastructure.
              </p>
            </div>

            <!-- PaaS Card -->
            <div class="bg-[#141C2E] border border-indigo-500/30 rounded-xl p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded font-code text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  PaaS
                </span>
                <span class="text-[12px] font-sans font-bold text-white">Platform as a Service</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                Provides a cloud platform with hardware, software tools, and infrastructure for developers to build and run applications without worrying about managing the underlying infrastructure.
              </p>
            </div>

            <!-- SaaS Card -->
            <div class="bg-[#141C2E] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded font-code text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  SaaS
                </span>
                <span class="text-[12px] font-sans font-bold text-white">Software as a Service</span>
              </div>
              <p class="text-[12.5px] text-slate-300 leading-relaxed font-sans">
                A complete application managed and operated by the cloud provider, delivered over the internet.
              </p>
            </div>
          </div>
        </div>

        <!-- Responsibility Matrix Table -->
        <div class="flex flex-col gap-3 pt-2">
          <div class="flex items-center justify-between">
            <span class="font-code text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              SHARED RESPONSIBILITY MATRIX ACROSS CLOUD TIERS
            </span>
            <div class="flex items-center gap-3 text-[11px] font-code">
              <span class="flex items-center gap-1 text-slate-300">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span> You manage
              </span>
              <span class="flex items-center gap-1 text-emerald-400">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Provider manages
              </span>
            </div>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#24314A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#1E1B4B] border-b border-[#312E81] text-[12px] font-code font-bold text-indigo-200">
                  <th class="p-3">Layer</th>
                  <th class="p-3 text-center">On-prem</th>
                  <th class="p-3 text-center">IaaS</th>
                  <th class="p-3 text-center">PaaS</th>
                  <th class="p-3 text-center">SaaS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#24314A]/60 font-sans text-[12.5px]">
                ${stackLayers.map((row, idx) => `
                  <tr class="hover:bg-[#141C2E]/70 transition-colors ${idx % 2 === 1 ? 'bg-[#0F1626]/40' : ''}">
                    <td class="p-3 font-semibold text-white ${row.isExample ? 'font-code text-cyan-300' : ''}">
                      ${row.layer}
                    </td>
                    <td class="p-3 text-center ${row.isExample ? 'font-code text-slate-400 text-[11.5px]' : row.onPrem === 'You' ? 'text-cyan-300 font-semibold' : 'text-emerald-400 font-semibold'}">
                      ${row.onPrem}
                    </td>
                    <td class="p-3 text-center ${row.isExample ? 'font-code text-slate-300 text-[11.5px]' : row.iaas === 'You' ? 'text-cyan-300 font-semibold' : 'text-emerald-400 font-semibold'}">
                      ${row.iaas}
                    </td>
                    <td class="p-3 text-center ${row.isExample ? 'font-code text-slate-300 text-[11.5px]' : row.paas === 'You' ? 'text-cyan-300 font-semibold' : 'text-emerald-400 font-semibold'}">
                      ${row.paas}
                    </td>
                    <td class="p-3 text-center ${row.isExample ? 'font-code text-slate-300 text-[11.5px]' : row.saas === 'You' ? 'text-cyan-300 font-semibold' : 'text-emerald-400 font-semibold'}">
                      ${row.saas}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Green Callout Box: Senior Perspective: When PaaS Becomes a Liability -->
        <div class="bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-5 flex flex-col gap-2">
          <span class="font-code text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            SENIOR PERSPECTIVE: WHEN PAAS BECOMES A LIABILITY
          </span>
          <p class="text-[13px] text-emerald-200/90 leading-relaxed font-sans">
            PaaS products (Heroku, Firebase, App Engine) are optimal for 0-to-1 speed. The inflection point occurs when: (1) cloud bill exceeds the cost of a dedicated infrastructure engineer (~$15–20 K/month), (2) specialized performance tuning is needed (custom kernel parameters, bypass networking), or (3) proprietary vendor lock-in prevents multi-region or on-prem deployment. Mature teams often start on PaaS and migrate to managed Kubernetes (IaaS) at scale.
          </p>
        </div>

        <!-- Bar: OVER TO YOU -->
        <div class="bg-[#1E293B]/70 border border-[#334155] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 text-[12.5px]">
          <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-code text-[10.5px] font-bold uppercase tracking-wider shrink-0 w-fit">
            OVER TO YOU
          </span>
          <span class="text-slate-300 font-medium">
            At what monthly cloud spend would you propose migrating from Heroku/Firebase to an EKS/GKE cluster? What hidden costs does that introduce?
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
            Anchor choice on three axes: control, operational headcount, and lock-in vs. time-to-market. A senior engineer never says "PaaS is too expensive" without factoring in the headcount cost of running IaaS.
          </p>
        </div>

        <!-- Page 14 Footer -->
        <div class="pt-4 border-t border-[#24314A]/70 flex items-center justify-between text-[11px] font-code text-slate-500">
          <span>The Modern System Design Interview Guide</span>
          <span>Page 14</span>
        </div>

      </div>

    </div>
  `;
}
