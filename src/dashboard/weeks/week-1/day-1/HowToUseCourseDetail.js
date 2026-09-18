/**
 * 0.1 How to Use This Course - Visual Guide
 * High-signal, interactive, visually stunning presentation of the course methodology
 * for Senior Software Engineer, Staff Engineer, and System Design interviews.
 */

export function renderHowToUseCourseContent(topic) {
  // Retrieve saved checklist states from localStorage if available
  let savedChecks = {};
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('sysdesign_mastery_checklist') : null;
    if (raw) savedChecks = JSON.parse(raw);
  } catch (e) {
    savedChecks = {};
  }

  const checklistItems = [
    "Can I explain it in 60 seconds?",
    "Can I draw the architecture from memory?",
    "Can I explain why it exists?",
    "Can I explain when I would use it?",
    "Can I explain when I would NOT use it?",
    "Can I name at least one alternative?",
    "Can I explain the major trade-offs?",
    "Can I explain what happens when it fails?",
    "Can I explain how it scales?",
    "Can I answer common interviewer follow-ups?",
    "Can I apply it to an unfamiliar system?"
  ];

  return `
    <div class="flex flex-col gap-8 animate-fadeIn text-slate-200">

      <!-- HERO BANNER: Practice-First Philosophy -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161D32] via-[#0F172A] to-[#1A2644] border border-indigo-500/40 p-6 sm:p-8 shadow-xl shadow-indigo-950/40">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-4">
          <!-- Badges & Section -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-code font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px]">psychology</span>
                Practice-First Methodology
              </span>
              <span class="px-3 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-code font-bold uppercase tracking-wider">
                Senior & Staff Interview Accelerator
              </span>
            </div>
            <span class="text-[11px] font-code text-slate-400 bg-[#0A0E1A]/80 px-2.5 py-1 rounded border border-[#24314A]">
              PART 0 · THE PLAYBOOK
            </span>
          </div>

          <!-- Titles -->
          <div class="flex flex-col gap-1.5">
            <h2 class="font-sans text-[24px] sm:text-[30px] font-black text-white tracking-tight leading-tight flex items-center gap-3">
              <span>0.1 How to Use This Course</span>
            </h2>
            <p class="text-[15px] sm:text-[17px] font-medium text-indigo-200/90 leading-snug">
              This Is a Practice-First System Design Course
            </p>
          </div>

          <!-- Description & Callout -->
          <p class="text-[13.5px] text-slate-300 leading-relaxed max-w-4xl">
            This course is designed for working software engineers preparing for <strong class="text-white font-semibold">Senior Software Engineer, Staff Engineer, and System Design interviews</strong>.
            It is <span class="text-amber-300 font-semibold underline decoration-amber-500/40 decoration-2 underline-offset-4">not meant to be read like a novel</span>.
            The goal is not to memorize hundreds of architecture diagrams.
          </p>

          <!-- Core Competency Pillars (6-Box Grid) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            <div class="flex items-start gap-3 p-3 rounded-xl bg-[#0A0E1A]/80 border border-[#24314A]/90 hover:border-cyan-500/40 transition-all">
              <span class="material-symbols-outlined text-cyan-400 text-[20px] shrink-0 mt-0.5">explore</span>
              <div class="flex flex-col">
                <span class="text-[12.5px] font-bold text-white">Unfamiliar Systems</span>
                <span class="text-[11.5px] text-slate-400">Understand an unfamiliar system quickly</span>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-[#0A0E1A]/80 border border-[#24314A]/90 hover:border-cyan-500/40 transition-all">
              <span class="material-symbols-outlined text-cyan-400 text-[20px] shrink-0 mt-0.5">filter_alt</span>
              <div class="flex flex-col">
                <span class="text-[12.5px] font-bold text-white">Deconstruct Ambiguity</span>
                <span class="text-[11.5px] text-slate-400">Break ambiguous requirements into concrete problems</span>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-[#0A0E1A]/80 border border-[#24314A]/90 hover:border-cyan-500/40 transition-all">
              <span class="material-symbols-outlined text-cyan-400 text-[20px] shrink-0 mt-0.5">architecture</span>
              <div class="flex flex-col">
                <span class="text-[12.5px] font-bold text-white">First Principles</span>
                <span class="text-[11.5px] text-slate-400">Design scalable architectures from first principles</span>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-[#0A0E1A]/80 border border-[#24314A]/90 hover:border-cyan-500/40 transition-all">
              <span class="material-symbols-outlined text-indigo-400 text-[20px] shrink-0 mt-0.5">record_voice_over</span>
              <div class="flex flex-col">
                <span class="text-[12.5px] font-bold text-white">Crystal Articulation</span>
                <span class="text-[11.5px] text-slate-400">Explain your decisions clearly & authoritatively</span>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-[#0A0E1A]/80 border border-[#24314A]/90 hover:border-cyan-500/40 transition-all">
              <span class="material-symbols-outlined text-indigo-400 text-[20px] shrink-0 mt-0.5">balance</span>
              <div class="flex flex-col">
                <span class="text-[12.5px] font-bold text-white">Senior Trade-Offs</span>
                <span class="text-[11.5px] text-slate-400">Discuss trade-offs like a senior engineer</span>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-[#0A0E1A]/80 border border-[#24314A]/90 hover:border-cyan-500/40 transition-all">
              <span class="material-symbols-outlined text-indigo-400 text-[20px] shrink-0 mt-0.5">shield</span>
              <div class="flex flex-col">
                <span class="text-[12.5px] font-bold text-white">Pressure Defense</span>
                <span class="text-[11.5px] text-slate-400">Defend your design when interviewers challenge it</span>
              </div>
            </div>
          </div>

          <!-- Bottom Lesson Chip -->
          <div class="mt-2 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-[13px] text-indigo-200">
            <span class="material-symbols-outlined text-indigo-400 text-[18px]">lightbulb</span>
            <span><strong>Guiding Philosophy:</strong> Think of every topic as a <span class="text-white font-bold underline decoration-indigo-400 decoration-2">mini interview lesson</span>.</span>
          </div>
        </div>
      </div>

      <!-- SECTION 1: THE LEARNING LOOP -->
      <div class="flex flex-col gap-4 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">sync</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-white">The Learning Loop</h3>
              <p class="text-[12px] font-code text-slate-400">For every single topic, follow this strict 6-stage sequence</p>
            </div>
          </div>

          <!-- Visual Flow Breadcrumb -->
          <div class="hidden lg:flex items-center gap-1.5 text-[11.5px] font-code font-bold bg-[#0A0E1A] px-3 py-1.5 rounded-lg border border-[#24314A] text-slate-400">
            <span class="text-cyan-300">Learn</span> <span class="text-slate-600">→</span>
            <span class="text-teal-300">Visualize</span> <span class="text-slate-600">→</span>
            <span class="text-emerald-300">Decide</span> <span class="text-slate-600">→</span>
            <span class="text-indigo-300">Apply</span> <span class="text-slate-600">→</span>
            <span class="text-rose-300">Defend</span> <span class="text-slate-600">→</span>
            <span class="text-purple-300">Recall</span>
          </div>
        </div>

        <!-- 6 Step Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <!-- Step 1: Learn -->
          <div class="bg-[#0A0E1A] border border-[#24314A] hover:border-cyan-500/40 rounded-xl p-4 flex flex-col gap-2 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-code font-bold text-cyan-400 uppercase tracking-wider">Step 01</span>
              <span class="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform"></span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white group-hover:text-cyan-300 transition-colors">1. Learn</h4>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Understand what the technology or concept is, why it exists, and how it works under the hood.
            </p>
          </div>

          <!-- Step 2: Visualize -->
          <div class="bg-[#0A0E1A] border border-[#24314A] hover:border-teal-500/40 rounded-xl p-4 flex flex-col gap-2 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-code font-bold text-teal-400 uppercase tracking-wider">Step 02</span>
              <span class="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-125 transition-transform"></span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white group-hover:text-teal-300 transition-colors">2. Visualize</h4>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Study the architecture and practice drawing it yourself. Target: reproduce the core architecture on a whiteboard <strong class="text-teal-300 font-semibold">in under one minute</strong>.
            </p>
          </div>

          <!-- Step 3: Decide -->
          <div class="bg-[#0A0E1A] border border-[#24314A] hover:border-emerald-500/40 rounded-xl p-4 flex flex-col gap-2 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-code font-bold text-emerald-400 uppercase tracking-wider">Step 03</span>
              <span class="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform"></span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white group-hover:text-emerald-300 transition-colors">3. Decide</h4>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Don't just learn what a technology does. Learn <strong class="text-emerald-300 font-semibold">when to choose it and when not to choose it</strong>. This is where system design moves from memorization to engineering judgment.
            </p>
          </div>

          <!-- Step 4: Apply -->
          <div class="bg-[#0A0E1A] border border-[#24314A] hover:border-indigo-500/40 rounded-xl p-4 flex flex-col gap-2 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-code font-bold text-indigo-400 uppercase tracking-wider">Step 04</span>
              <span class="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform"></span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white group-hover:text-indigo-300 transition-colors">4. Apply</h4>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Connect the concept to a real-world system. Ask yourself: <em class="text-indigo-200">"Where would I actually use this in production?"</em>
            </p>
          </div>

          <!-- Step 5: Defend -->
          <div class="bg-[#0A0E1A] border border-[#24314A] hover:border-rose-500/40 rounded-xl p-4 flex flex-col gap-2 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-code font-bold text-rose-400 uppercase tracking-wider">Step 05</span>
              <span class="w-2 h-2 rounded-full bg-rose-400 group-hover:scale-125 transition-transform"></span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white group-hover:text-rose-300 transition-colors">5. Defend</h4>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Practice interviewer follow-ups. A senior interview rarely ends after your first drawing. Expect tough probes:
            </p>
            <div class="mt-1 flex flex-wrap gap-1">
              <span class="text-[10px] font-code bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded">Why this DB?</span>
              <span class="text-[10px] font-code bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded">Why not Kafka?</span>
              <span class="text-[10px] font-code bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded">10× traffic?</span>
              <span class="text-[10px] font-code bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded">Regional outage?</span>
            </div>
          </div>

          <!-- Step 6: Recall -->
          <div class="bg-[#0A0E1A] border border-[#24314A] hover:border-purple-500/40 rounded-xl p-4 flex flex-col gap-2 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-code font-bold text-purple-400 uppercase tracking-wider">Step 06</span>
              <span class="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform"></span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white group-hover:text-purple-300 transition-colors">6. Recall</h4>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Close the document and explain the concept from memory. If you cannot explain it without looking at your notes, <strong class="text-purple-300 font-semibold">you haven't mastered it yet</strong>.
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION 2: THE ANATOMY OF EVERY TOPIC -->
      <div class="flex flex-col gap-4 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col gap-1 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">view_quilt</span>
            </span>
            <h3 class="font-sans text-[18px] font-bold text-white">The Anatomy of Every Topic</h3>
          </div>
          <p class="text-[12.5px] text-slate-300 leading-relaxed">
            Every topic in this curriculum follows the same identical structure so that you can quickly identify what you know—and pinpoint what you need to practice.
          </p>
        </div>

        <!-- High-Contrast Structured Table -->
        <div class="overflow-x-auto rounded-xl border border-[#24314A]">
          <table class="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr class="bg-[#0A0E1A] border-b border-[#24314A] text-slate-400 font-code text-[11px] uppercase tracking-wider">
                <th class="py-3 px-4 w-[25%] font-semibold text-cyan-400">Block</th>
                <th class="py-3 px-4 w-[38%] font-semibold text-slate-300">What You Get</th>
                <th class="py-3 px-4 w-[37%] font-semibold text-emerald-400">What You Should Be Able to Do</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#24314A]/70 bg-[#0F1626]/80 font-sans">
              <tr class="hover:bg-[#162138]/60 transition-colors">
                <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
                  <span>What it is / Why / How</span>
                </td>
                <td class="py-3 px-4 text-slate-300">A concise explanation of the concept</td>
                <td class="py-3 px-4 text-emerald-300/90 font-medium">Explain it clearly in ~60 seconds</td>
              </tr>
              <tr class="hover:bg-[#162138]/60 transition-colors">
                <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-teal-400 shrink-0"></span>
                  <span>Architecture / Flow</span>
                </td>
                <td class="py-3 px-4 text-slate-300">A simple ASCII architecture or request flow</td>
                <td class="py-3 px-4 text-emerald-300/90 font-medium">Reproduce the core diagram on a whiteboard</td>
              </tr>
              <tr class="hover:bg-[#162138]/60 transition-colors">
                <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span>
                  <span>Trade-offs</span>
                </td>
                <td class="py-3 px-4 text-slate-300">Advantages, limitations and alternatives</td>
                <td class="py-3 px-4 text-emerald-300/90 font-medium">Explain <em>why</em> you chose one approach over another</td>
              </tr>
              <tr class="hover:bg-[#162138]/60 transition-colors">
                <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span>When to use / Avoid</span>
                </td>
                <td class="py-3 px-4 text-slate-300">Practical decision criteria</td>
                <td class="py-3 px-4 text-emerald-300/90 font-medium">Make an engineering decision instead of listing technologies</td>
              </tr>
              <tr class="hover:bg-[#162138]/60 transition-colors">
                <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                  <span>Real-world example</span>
                </td>
                <td class="py-3 px-4 text-slate-300">A recognizable production system</td>
                <td class="py-3 px-4 text-emerald-300/90 font-medium">Connect theory to real systems</td>
              </tr>
              <tr class="hover:bg-[#162138]/60 transition-colors">
                <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
                  <span>Interview follow-ups</span>
                </td>
                <td class="py-3 px-4 text-slate-300">Likely interviewer questions + model answers</td>
                <td class="py-3 px-4 text-emerald-300/90 font-medium">Defend your design under pressure</td>
              </tr>
              <tr class="hover:bg-[#162138]/60 transition-colors">
                <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>Key takeaway</span>
                </td>
                <td class="py-3 px-4 text-slate-300">One high-signal summary</td>
                <td class="py-3 px-4 text-emerald-300/90 font-medium">Recall the concept quickly during an interview</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- The Golden Rule Callout -->
        <div class="rounded-xl bg-gradient-to-r from-amber-500/15 via-[#1E1B18] to-[#141C2E] border border-amber-500/40 p-4 sm:p-5 flex items-start gap-4">
          <div class="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
            <span class="material-symbols-outlined text-[24px]">grade</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="font-code text-[11px] font-bold text-amber-400 uppercase tracking-wider">The Golden Rule</span>
            <p class="font-sans text-[15px] font-bold text-white tracking-tight leading-snug">
              "Don't memorize the answer. Memorize the decision-making process."
            </p>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              An interviewer may change the requirements, traffic, consistency needs, or failure scenarios. If you only memorized an architecture, you will struggle. If you understand <strong class="text-amber-300">why each component exists</strong>, you can redesign the system dynamically when requirements shift.
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION 3: HOW TO STUDY EACH TOPIC (5-PASS DRILL) -->
      <div class="flex flex-col gap-4 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col gap-1 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">repeat</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-white">How to Study Each Topic</h3>
              <p class="text-[12px] font-code text-slate-400">For maximum retention, execute this 5-pass drill for every concept</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <!-- Pass 1 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col sm:flex-row sm:items-baseline gap-3">
            <span class="font-code text-[11.5px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 shrink-0 w-36 text-center">
              Pass 1 — Understand
            </span>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Read the topic carefully and make sure you understand the fundamentals. Don't worry about memorizing anything yet.
            </p>
          </div>

          <!-- Pass 2 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col sm:flex-row sm:items-baseline gap-3">
            <span class="font-code text-[11.5px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20 shrink-0 w-36 text-center">
              Pass 2 — Draw
            </span>
            <div class="flex flex-col gap-2">
              <p class="text-[12.5px] text-slate-300 leading-relaxed">
                Close the document. Draw the architecture from memory. Start with the universal skeleton:
              </p>
              <div class="font-code text-[11.5px] text-teal-300 bg-[#0F1626] px-3 py-1.5 rounded-lg border border-[#24314A] w-fit">
                Client → API → Core Services → Data Layer
              </div>
              <p class="text-[11.5px] text-slate-400">
                Then add components only when the requirements justify them.
              </p>
            </div>
          </div>

          <!-- Pass 3 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col sm:flex-row sm:items-baseline gap-3">
            <span class="font-code text-[11.5px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shrink-0 w-36 text-center">
              Pass 3 — Explain
            </span>
            <div class="flex flex-col gap-1.5">
              <p class="text-[12.5px] text-slate-300 leading-relaxed">
                Give yourself <strong class="text-amber-300">60 seconds</strong> to explain:
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11.5px] font-code text-slate-300 pt-1">
                <span class="bg-[#0F1626] px-2 py-1 rounded border border-[#24314A] text-center">1. What is it?</span>
                <span class="bg-[#0F1626] px-2 py-1 rounded border border-[#24314A] text-center">2. Why need it?</span>
                <span class="bg-[#0F1626] px-2 py-1 rounded border border-[#24314A] text-center">3. How it works?</span>
                <span class="bg-[#0F1626] px-2 py-1 rounded border border-[#24314A] text-center">4. Major trade-offs?</span>
              </div>
              <span class="text-[11.5px] text-amber-400/80 italic mt-0.5">If you get stuck, go back and repeat the topic.</span>
            </div>
          </div>

          <!-- Pass 4 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col sm:flex-row sm:items-baseline gap-3">
            <span class="font-code text-[11.5px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 shrink-0 w-36 text-center">
              Pass 4 — Defend
            </span>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">
              Answer the interview follow-ups without looking at the model answers. <strong class="text-white">This is where most of your senior-level preparation should happen.</strong>
            </p>
          </div>

          <!-- Pass 5 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col sm:flex-row sm:items-baseline gap-3">
            <span class="font-code text-[11.5px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 shrink-0 w-36 text-center">
              Pass 5 — Rebuild
            </span>
            <div class="flex flex-col gap-2">
              <p class="text-[12.5px] text-slate-300 leading-relaxed">
                Take a different system-design problem and ask: <em class="text-purple-200">"Would this concept help me here?"</em>
              </p>
              <div class="p-3 rounded-lg bg-[#0F1626] border border-[#24314A] flex flex-col gap-1.5 text-[12px]">
                <div class="text-slate-300">
                  <strong class="text-purple-300">Scenario:</strong> Build a URL shortener. Don't immediately jump to: <em>"Use Redis + Kafka + DynamoDB."</em>
                </div>
                <div class="text-slate-400 text-[11.5px] flex flex-wrap gap-x-3 gap-y-1">
                  <span>• What's the traffic?</span>
                  <span>• What's the read/write ratio?</span>
                  <span>• Latency requirement?</span>
                  <span>• Need strong consistency?</span>
                  <span>• What data needs durability?</span>
                  <span>• What can be cached?</span>
                  <span>• What happens when a component fails?</span>
                </div>
              </div>
              <span class="text-[11.5px] text-purple-300/90 font-medium">That thinking process is the exact skill you're developing.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 4: YOUR INTERVIEW PREPARATION MODES -->
      <div class="flex flex-col gap-4 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col gap-1 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">tune</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-white">Your Interview Preparation Modes</h3>
              <p class="text-[12px] font-code text-slate-400">You don't always have weeks to prepare. Use the path that matches your timeline and domain.</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Mode 1: 2 Days Before -->
          <div class="p-5 rounded-xl bg-gradient-to-br from-[#1C161E] to-[#0A0E1A] border border-rose-500/40 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-code text-[11px] font-bold border border-rose-500/30 flex items-center gap-1.5">
                <span>🔥</span> TWO DAYS BEFORE
              </span>
              <span class="text-[11px] font-code text-slate-400">High-Signal Revision</span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white">Emergency Revision Track</h4>
            <p class="text-[12px] text-slate-300 leading-relaxed">
              Focus on high-signal revision, not learning everything from scratch.
            </p>
            <div class="p-3 rounded-lg bg-[#0F1626] border border-[#24314A] flex flex-col gap-1.5 text-[11.5px]">
              <span class="font-code text-rose-300 font-semibold">Recommended Path:</span>
              <span class="text-white font-mono text-[11px]">Part 0 → Key Takeaways → Trade-off Tables → Appendix C</span>
              <span class="text-slate-400 mt-1">For each topic: 1. Read Takeaway • 2. Review Trade-offs • 3. Draw once • 4. Answer 2–3 follow-ups</span>
            </div>
            <div class="mt-auto pt-2 border-t border-rose-500/20 text-[11px] font-code text-rose-300">
              <strong>Goal:</strong> Explain <em>What → Why → How → Trade-offs → Failure scenarios</em> in 90 seconds.
            </div>
          </div>

          <!-- Mode 2: 2 Weeks Before -->
          <div class="p-5 rounded-xl bg-gradient-to-br from-[#131B2E] to-[#0A0E1A] border border-cyan-500/40 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-code text-[11px] font-bold border border-cyan-500/30 flex items-center gap-1.5">
                <span>📅</span> TWO WEEKS BEFORE
              </span>
              <span class="text-[11px] font-code text-slate-400">Core Distributed Systems</span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white">Comprehensive 14-Day Sprint</h4>
            <p class="text-[12px] text-slate-300 leading-relaxed">
              Focus on the concepts that appear repeatedly across senior loops.
            </p>
            <div class="p-3 rounded-lg bg-[#0F1626] border border-[#24314A] flex flex-col gap-1.5 text-[11.5px]">
              <span class="font-code text-cyan-300 font-semibold">Priority Path:</span>
              <span class="text-white font-mono text-[11px]">Parts 4, 5 and 7 (Data, Caching, Messaging) + Part 9</span>
              <span class="text-slate-400 mt-1">Daily Routine (60–90 min): 30m Learn • 20m Draw • 20m Follow-ups • 10–20m Recall</span>
            </div>
            <div class="mt-auto pt-2 border-t border-cyan-500/20 text-[11px] font-code text-cyan-300">
              <strong>Goal:</strong> Architect unfamiliar systems from first principles without memorized templates.
            </div>
          </div>

          <!-- Mode 3: Infra / Platform -->
          <div class="p-5 rounded-xl bg-gradient-to-br from-[#161D2A] to-[#0A0E1A] border border-indigo-500/40 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-code text-[11px] font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <span>🏗️</span> INFRA / PLATFORM
              </span>
              <span class="text-[11px] font-code text-slate-400">Backend & Distributed</span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white">Infra & Platform Track</h4>
            <p class="text-[12px] text-slate-300 leading-relaxed">
              Prioritize Parts 1, 6 and 8 (Scalability, Reliability, Load Balancing, Observability, Multi-region).
            </p>
            <div class="p-3 rounded-lg bg-[#0F1626] border border-[#24314A] flex flex-col gap-1 text-[11.5px] text-slate-300">
              <span>• Service discovery, load balancers, messaging semantics</span>
              <span>• Observability, deployment strategies, multi-region failover</span>
            </div>
            <div class="mt-auto pt-2 border-t border-indigo-500/20 text-[11px] font-code text-indigo-300">
              <strong>Crucial Drill Question:</strong> <em>"What happens when this component fails? What happens during a regional outage?"</em>
            </div>
          </div>

          <!-- Mode 4: FinTech -->
          <div class="p-5 rounded-xl bg-gradient-to-br from-[#1A1A24] to-[#0A0E1A] border border-emerald-500/40 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-code text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span>💳</span> FINTECH & PAYMENTS
              </span>
              <span class="text-[11px] font-code text-slate-400">Correctness & Guarantees</span>
            </div>
            <h4 class="font-sans text-[15px] font-bold text-white">Financial Systems Track</h4>
            <p class="text-[12px] text-slate-300 leading-relaxed">
              Prioritize Section 9.4 (End to End) + 4.1 (Data), 7.1 (Messaging), 7.4 (Reliability & Guarantees).
            </p>
            <div class="p-3 rounded-lg bg-[#0F1626] border border-[#24314A] flex flex-col gap-1 text-[11.5px] text-slate-300">
              <span>• Consistency, Idempotency, Distributed Transactions, Ordering</span>
              <span>• Deduplication, Auditability, Exactly-once vs At-least-once</span>
            </div>
            <div class="mt-auto pt-2 border-t border-emerald-500/20 text-[11px] font-code text-emerald-300">
              <strong>Crucial Question:</strong> Not <em>"can it do 1M QPS?"</em> but <em>"Can the system remain correct when things go wrong?"</em>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 5: THE 30-MINUTE INTERVIEW DRILL -->
      <div class="flex flex-col gap-4 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col gap-1 pb-3 border-b border-[#24314A]">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center">
              <span class="material-symbols-outlined text-[20px]">timer</span>
            </span>
            <div>
              <h3 class="font-sans text-[18px] font-bold text-white">The 30-Minute Interview Drill</h3>
              <p class="text-[12px] font-code text-slate-400">Once you've completed the course, use this drill to simulate a real whiteboard interview</p>
            </div>
          </div>
        </div>

        <!-- Timeline Steps -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <!-- Block 1 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col gap-2">
            <div class="flex items-center justify-between text-[11px] font-code font-bold text-cyan-400">
              <span>MIN 00–05</span>
              <span class="material-symbols-outlined text-[15px]">checklist</span>
            </div>
            <h5 class="font-sans text-[13.5px] font-bold text-white">1. Requirements</h5>
            <ul class="text-[11.5px] text-slate-300 flex flex-col gap-1">
              <li>• Functional requirements</li>
              <li>• Non-functional requirements</li>
              <li>• Scale & QPS arithmetic</li>
              <li>• Latency & Availability targets</li>
              <li>• Consistency constraints</li>
            </ul>
          </div>

          <!-- Block 2 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col gap-2">
            <div class="flex items-center justify-between text-[11px] font-code font-bold text-teal-400">
              <span>MIN 05–10</span>
              <span class="material-symbols-outlined text-[15px]">draw</span>
            </div>
            <h5 class="font-sans text-[13.5px] font-bold text-white">2. High-Level Design</h5>
            <p class="text-[11.5px] text-slate-300 leading-relaxed">
              Draw core pipeline:
            </p>
            <div class="font-code text-[10.5px] text-teal-300 bg-[#0F1626] p-2 rounded border border-[#24314A] text-center">
              Client → API → Services → Storage
            </div>
            <p class="text-[11px] text-slate-400">Keep it dead simple. Don't overcomplicate early.</p>
          </div>

          <!-- Block 3 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col gap-2">
            <div class="flex items-center justify-between text-[11px] font-code font-bold text-indigo-400">
              <span>MIN 10–20</span>
              <span class="material-symbols-outlined text-[15px]">troubleshoot</span>
            </div>
            <h5 class="font-sans text-[13.5px] font-bold text-white">3. Deep Dive</h5>
            <p class="text-[11.5px] text-slate-300 leading-relaxed">
              Pick the #1 bottleneck:
            </p>
            <ul class="text-[11px] text-slate-300 flex flex-col gap-0.5">
              <li>• Database scaling & sharding</li>
              <li>• Cache invalidation strategy</li>
              <li>• Partitioning & Hot spots</li>
              <li>• Consistency vs Availability</li>
            </ul>
          </div>

          <!-- Block 4 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col gap-2">
            <div class="flex items-center justify-between text-[11px] font-code font-bold text-rose-400">
              <span>MIN 20–25</span>
              <span class="material-symbols-outlined text-[15px]">warning</span>
            </div>
            <h5 class="font-sans text-[13.5px] font-bold text-white">4. Failure & Scale</h5>
            <ul class="text-[11px] text-slate-300 flex flex-col gap-1">
              <li>• What happens at 10× traffic?</li>
              <li>• What happens when this component fails?</li>
              <li>• What happens when an entire region goes down?</li>
            </ul>
          </div>

          <!-- Block 5 -->
          <div class="p-4 rounded-xl bg-[#0A0E1A] border border-[#24314A] flex flex-col gap-2">
            <div class="flex items-center justify-between text-[11px] font-code font-bold text-emerald-400">
              <span>MIN 25–30</span>
              <span class="material-symbols-outlined text-[15px]">balance</span>
            </div>
            <h5 class="font-sans text-[13.5px] font-bold text-white">5. Trade-offs</h5>
            <ul class="text-[11px] text-slate-300 flex flex-col gap-1">
              <li>• Why this architecture?</li>
              <li>• What alternatives considered?</li>
              <li>• What was sacrificed?</li>
              <li>• What would change at 10×?</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- SECTION 6: YOUR MASTERY CHECKLIST -->
      <div class="flex flex-col gap-4 bg-[#141C2E] border border-[#24314A] rounded-2xl p-6 sm:p-7 shadow-lg">
        <div class="flex flex-col gap-1 pb-3 border-b border-[#24314A]">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2.5">
              <span class="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center">
                <span class="material-symbols-outlined text-[20px]">fact_check</span>
              </span>
              <div>
                <h3 class="font-sans text-[18px] font-bold text-white">Your Mastery Checklist</h3>
                <p class="text-[12px] font-code text-slate-400">Before considering a topic "done", you should be able to answer YES to all 11 questions:</p>
              </div>
            </div>
            <span class="text-[11px] font-code text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Interactive Self-Audit
            </span>
          </div>
        </div>

        <!-- 11 Checkbox Items -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          ${checklistItems.map((item, idx) => {
            const isChecked = Boolean(savedChecks[idx]);
            return `
              <label
                class="mastery-check-item flex items-center gap-3 p-3 rounded-xl bg-[#0A0E1A] border ${isChecked ? 'border-emerald-500/50 bg-emerald-950/15 text-emerald-200' : 'border-[#24314A] text-slate-300'} hover:border-emerald-500/40 cursor-pointer transition-all select-none"
                data-check-idx="${idx}"
              >
                <input
                  type="checkbox"
                  class="course-mastery-checkbox w-4 h-4 rounded text-emerald-500 bg-[#0F1626] border-[#24314A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  data-idx="${idx}"
                  ${isChecked ? 'checked' : ''}
                />
                <span class="text-[12.5px] font-medium leading-snug">${item}</span>
              </label>
            `;
          }).join('')}
        </div>

        <!-- Action Note -->
        <div class="mt-1 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[12px] text-amber-200/90 flex items-center gap-2.5">
          <span class="material-symbols-outlined text-amber-400 text-[18px] shrink-0">info</span>
          <span>If you cannot check all boxes for a concept, <strong>don't simply reread the section. Practice it.</strong></span>
        </div>
      </div>

      <!-- SECTION 7: THE ULTIMATE GOAL & GOLDEN QUOTE -->
      <div class="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0F1D27] to-[#0A161E] border border-emerald-500/40 p-6 sm:p-8 shadow-xl flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-code text-[11px] font-bold uppercase tracking-wider">
            The Ultimate Goal
          </span>
        </div>

        <p class="text-[14px] sm:text-[15.5px] text-slate-200 leading-relaxed">
          By the end of this course, you should stop thinking:
          <span class="text-slate-400 italic">"Which system-design template should I memorize?"</span>
          <br class="hidden sm:block" />
          And start thinking:
          <strong class="text-white block sm:inline mt-1 sm:mt-0">
            "What are the requirements, what are the bottlenecks, what are my options, and what trade-offs am I willing to make?"
          </strong>
        </p>

        <p class="text-[12.5px] text-slate-400 leading-relaxed">
          That's the fundamental difference between <span class="text-slate-200 font-semibold">knowing system design</span> and <span class="text-emerald-300 font-semibold">being able to perform system design in an interview</span>.
        </p>

        <!-- Final High-Signal Takeaway Callout -->
        <div class="mt-2 p-4 rounded-xl bg-[#0A0E1A]/90 border border-emerald-500/50 shadow-inner flex items-center gap-3">
          <span class="material-symbols-outlined text-emerald-400 text-[26px] shrink-0">military_tech</span>
          <div class="flex flex-col">
            <span class="font-code text-[10px] text-emerald-400 uppercase font-bold tracking-widest">Mastery Formula</span>
            <span class="font-sans text-[14px] sm:text-[16px] font-bold text-white tracking-tight">
              Learn the components. Understand the trade-offs. Practice the decisions. Defend the architecture.
            </span>
          </div>
        </div>
      </div>

    </div>
  `;
}
