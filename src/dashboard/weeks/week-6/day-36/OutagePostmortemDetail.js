/**
 * 8.4 War Story: Handling a Large-Scale Outage - Visual Guide
 * High-signal, visually rich reproduction of Pages 102–104
 * from The Modern System Design Interview Guide (Senior & Staff Engineer Edition).
 * True story by Staff Engineer at Discord, Sahn Lam.
 */

export function renderOutagePostmortemContent(topic) {
  const transferableLessons = [
    {
      num: "1",
      title: "Control-Plane Blast Radius Is the Entire Fleet",
      desc: "A bug in the tool that manages production is infinitely more dangerous than a bug in production code. Control-plane mutations require the same review rigor as production code: declarative, diffable formats (Terraform, GitOps) where changes are human-reviewed before application."
    },
    {
      num: "2",
      title: "Confirmation Dialogs Are Not a Safety Mechanism",
      desc: "A modal popup saying 'Are you sure you want to delete?' is developer friction, not a security boundary. Real safeguards: IAM permission scoping, AWS termination protection on stateful databases, rate-limiting quotas on destructive actions, and mandatory multi-party approvals."
    },
    {
      num: "3",
      title: "Recovery Time Is a Design Property, Not Heroics",
      desc: "50 engineers firefighting for 10 hours is the price paid for lacking automated disaster rebuilds. Infrastructure-as-code, pre-baked AMIs, containerized stateless services, and continuous restore drills turn 10 hours into minutes."
    },
    {
      num: "4",
      title: "Capacity to Recover Must Exist Before You Need It",
      desc: "In the outage, AWS required advance reservation notice before scaling up large fleets. Recovery was actively gated by the cloud provider's available physical hardware capacity. Always maintain reserved instance headroom."
    },
    {
      num: "5",
      title: "Blameless Postmortems: Vendor Risk Is Your Risk",
      desc: "The SRE executed an ordinary, approved maintenance request. The infrastructure control plane allowed the catastrophe. When you outsource your control plane to a third party, you inherit failure modes you cannot audit or fix."
    }
  ];

  const followUps = [
    {
      q: "How would you prevent this catastrophic total deletion failure today?",
      a: "1) <strong>Declarative Infrastructure as Code (Terraform / OpenTofu / GitOps)</strong>: an automated plan/apply pipeline where deleting nodes produces a visible red diff requiring peer review; 2) <strong>Termination Protection</strong> enabled on all databases and stateful tiers; 3) <strong>Service Quotas and IAM Guardrails</strong>: no single IAM role has permission to terminate more than 10 instances in one call without break-glass multi-party authorization; 4) <strong>Multi-Account Blast Radius Segmentation</strong>: separate AWS accounts for staging, production, and different failure domains."
    },
    {
      q: "What is your RTO for 'we lost the entire production environment', and how do you know?",
      a: "<strong>The only honest answer: 'the exact recovery duration measured during our last disaster drill.'</strong> An untested disaster recovery plan is merely a document, not an engineering capability. Because restoring multi-terabyte databases and replaying WAL logs takes hours, a real senior design maintains <strong>pre-provisioned warm standby compute</strong> in a secondary region with automated Terraform pipelines (sec. 12.4)."
    },
    {
      q: "How do you build an engineering culture where on-call SREs running commands are safe?",
      a: "Make the safe path the easiest path: <strong>enforce dry-run modes by default</strong>, stage changes across canary batches, and conduct <strong>blameless postmortems</strong> that redesign systems rather than blaming operators. If a single human keystroke or misclick can terminate production, that is an architecture and systems defect — the engineer is the victim of the system, not the cause."
    }
  ];

  return `
    <div class="modern-guide-spec flex flex-col gap-6 text-slate-200 select-text cursor-default animate-fadeIn" data-visual-guide="8.4-outage-story">
      
      <!-- Top Title & Badge Bar -->
      <div class="flex flex-col gap-2 pb-3 border-b border-[#24314A]/80">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-code font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Part 8 · War Stories &amp; Operations
            </span>
            <span class="text-[12px] font-code text-slate-400">Pages 102–104 · Section 8.4</span>
          </div>
          <span class="text-[11px] font-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Est: 20 mins
          </span>
        </div>
        <h3 class="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug">
          8.4 War Story: Handling a 10-Hour Large-Scale Outage
        </h3>
        <p class="font-sans text-[13.5px] text-slate-300 leading-relaxed">
          A true story of how a 30M-DAU platform went completely dark at 9 PM on a Friday due to a UI bug in a cloud management tool, and the five transferable architecture lessons that senior interviewers look for.
        </p>
      </div>

      <!-- Outage Narrative Box -->
      <div class="bg-[#14121F] border border-rose-500/30 rounded-xl p-5 sm:p-6 flex flex-col gap-3 font-sans text-[13px] leading-relaxed">
        <span class="font-code text-[11.5px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">report</span>
          The Incident: 30 Million Users Disconnected in Seconds
        </span>
        <p class="text-slate-300">
          <em>"It was 9 PM on a Friday. I glanced at our operational dashboard: every line was flatlining at zero. All instances across AWS had been terminated — HAProxy load balancers, PHP web servers, MySQL clusters, Memcache nodes, everything."</em>
        </p>
        <p class="text-slate-400 text-[12px]">
          An SRE performed a routine request to terminate an unused Memcache pool via a cloud management UI. The vendor's confirmation dialog correctly listed the 3 Memcache nodes, but the backend API bug under the hood issued a blanket delete across all provisioned AWS instances. It took 50 engineers 10 hours of manual rebuild to restore service.
        </p>
      </div>

      <!-- Five Transferable Lessons -->
      <div class="flex flex-col gap-3">
        <span class="font-code text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
          READING THIS AS AN INTERVIEWER WOULD: FIVE TRANSFERABLE ARCHITECTURE LESSONS
        </span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          ${transferableLessons.map(l => `
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="font-code text-[13px] font-bold text-cyan-400">#${l.num}</span>
                <span class="font-sans text-[13px] font-bold text-slate-200">${l.title}</span>
              </div>
              <p class="text-[12px] text-slate-300 font-sans leading-relaxed pt-1">
                ${l.desc}
              </p>
            </div>
          `).join('')}
        </div>
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
      <div class="bg-gradient-to-r from-rose-950/60 to-indigo-950/60 border border-rose-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-1.5">
        <span class="font-code text-[11px] text-rose-400 uppercase font-bold tracking-wider">
          KEY INTERVIEW TAKEAWAY
        </span>
        <p class="font-sans text-[13px] text-white font-medium leading-relaxed">
          "Your control plane is part of your attack and failure surface, and recovery time is something you design, not something you hope for. Blast-radius limits, declarative infrastructure and rehearsed restores are the answer — confirmation dialogs are not."
        </p>
      </div>

    </div>
  `;
}
