/**
 * The 6-Week System Design Interview Roadmap - Dedicated Landing Page
 * Developer tool + premium SaaS aesthetic for experienced software engineers.
 * Price: ₹799 | Access: 12 months | 42-day structured daily path
 * Strict implementation of User-Specified Design Tokens & Pedagogical Accents:
 * - Canvas: #F8FAFC (Slate 50) / #0B0F17 (Deep Obsidian)
 * - Surfaces: #FFFFFF (Pure White) with #E2E8F0 borders / #111827 & #1E293B with rgba(255,255,255,0.08)
 * - Nested Highlight Banners: #EFF6FF (Ice Blue Foundations) & #F5F3FF (Soft Indigo Playbook)
 * - Primary Brand: Electric Royal Indigo (#4F46E5 / #4338CA) paired with #FFFFFF text
 * - Headings: #0F172A (Slate 900) / #F8FAFC (Slate 50)
 * - Supporting: #475569 (Slate 600) & #64748B (Slate 500) / #94A3B8 (Slate 400)
 * - Emerald (#10B981 / #059669 & #ECFDF5): FAANG Tested, L5/L6 Target, 30-Day Zero-Risk Offer Guarantee, Live Seats, Readiness Targets
 * - Cyan (#0284C7 / #0EA5E9 & #F0F9FF): Foundations, Step 01 Learn, Timeline Blocks (MIN 00–05 & MIN 05–10)
 * - Violet (#8B5CF6 / #7C3AED & #F5F3FF): Caching & Latency metrics, Step 03 Trade-Offs, Curriculum Velocity tags
 * - Amber (#F59E0B / #D97706 & #FFFBEB): 4.96/5 Star Rating, Step 05 Defend Under Scrutiny, Failure Modes, "Don't reread, re-drill" warning
 */

import { openBuyAccessModal } from '../components/BuyAccessModal.js';
import { renderThemeToggleButton } from '../services/themeService.js';

export function renderRoadmapLandingPage() {
  return `
    <div class="roadmap-landing-wrapper w-full bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#0F172A] dark:text-[#F8FAFC] min-h-screen font-sans transition-colors duration-200">
      
      <!-- ================================================================= -->
      <!-- TOP TRUST & METRIC DIAGNOSTIC STRIP -->
      <!-- ================================================================= -->
      <div class="w-full bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-white/[0.08] py-2 px-4 text-[11.5px] font-code overflow-x-auto">
        <div class="max-w-6xl mx-auto flex items-center justify-between gap-4 whitespace-nowrap">
          <div class="flex items-center gap-3">
            <!-- Amber: 4.96/5 Star Rating -->
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFBEB] dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-amber-500/40 font-semibold">
              <span class="text-amber-500">★</span> 4.96/5 Rating &bull; 420+ Staff &amp; Principal Engineers
            </span>
            <!-- Emerald: FAANG Tested -->
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-500/40 font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> FAANG Tested
            </span>
            <!-- Emerald: L5/L6 Target -->
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-500/40 font-semibold">
              L5/L6 Target
            </span>
          </div>
          <div class="flex items-center gap-3">
            <!-- Violet: Curriculum Velocity -->
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5F3FF] dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 border border-[#DDD6FE] dark:border-purple-500/40 font-semibold">
              Curriculum Velocity: 42-Day Sprint
            </span>
            <!-- Emerald: 30-Day Zero-Risk Offer Guarantee -->
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-500/40 font-semibold">
              <span class="material-symbols-outlined text-[13px]">verified_user</span> 30-Day Zero-Risk Offer Guarantee
            </span>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- STICKY NAVIGATION BAR -->
      <!-- ================================================================= -->
      <header class="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0B0F17]/85 backdrop-blur-md border-b border-[#E2E8F0] dark:border-white/[0.08] transition-colors">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <!-- Brand Logo: PrepOS Mark in Electric Royal Indigo -->
          <a href="#/roadmap" class="flex items-center gap-2.5 text-[#0F172A] dark:text-white font-bold tracking-tight hover:opacity-95 transition-opacity">
            <div class="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-bold text-[14px] shadow-sm shadow-indigo-500/30">
              OS
            </div>
            <div class="flex flex-col">
              <span class="font-sans text-[15px] font-bold leading-none text-[#0F172A] dark:text-white tracking-tight">System Design Roadmap</span>
              <span class="font-code text-[10px] text-[#4F46E5] dark:text-[#818CF8] tracking-wider font-semibold uppercase mt-0.5">PrepOS &bull; 6-Week Architecture Path</span>
            </div>
          </a>

          <!-- Center Nav Links (Desktop) -->
          <nav class="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#475569] dark:text-[#94A3B8]">
            <a href="#how-it-works" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">How It Works</a>
            <a href="#focus-areas" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">Curriculum Areas</a>
            <a href="#execution-loop" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">6-Stage Loop</a>
            <a href="#product-preview" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">Preview</a>
            <a href="#pricing" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">Pricing</a>
            <a href="#faq" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          <!-- Right: Theme Toggle, Login + Primary CTA -->
          <div class="flex items-center gap-3">
            ${renderThemeToggleButton('w-8 h-8')}
            <a href="#/login" class="text-[13px] font-medium text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#141C2E] transition-colors">
              Login
            </a>
            <!-- Sticky Primary Conversion Touchpoint: Electric Royal Indigo -->
            <button
              type="button"
              class="roadmap-buy-trigger px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] font-sans font-bold text-[13px] shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              data-product="roadmap-799"
            >
              Enroll in Roadmap — ₹799
            </button>
          </div>
        </div>
      </header>

      <!-- ================================================================= -->
      <!-- SECTION 1: HERO SECTION -->
      <!-- ================================================================= -->
      <section class="relative pt-12 sm:pt-18 pb-16 px-4 sm:px-6 overflow-hidden border-b border-[#E2E8F0] dark:border-[#1E293B]/70">
        <!-- Subtle technical grid background -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-60"></div>
        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative max-w-4xl mx-auto flex flex-col items-center text-center">
          
          <!-- Small Technical Badge (Cyan Accent) -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] dark:bg-cyan-950/40 border border-[#BAE6FD] dark:border-cyan-500/30 text-[#0284C7] dark:text-cyan-300 font-code text-[11px] font-semibold tracking-wider uppercase mb-6 animate-fadeIn">
            <span class="w-1.5 h-1.5 rounded-full bg-[#0284C7] dark:bg-cyan-400 animate-pulse"></span>
            <span>BUILT FOR WORKING SOFTWARE ENGINEERS</span>
          </div>

          <!-- Main Headline: #0F172A (Slate 900) in Light Mode / #F8FAFC in Dark Mode -->
          <h1 class="font-sans text-[34px] sm:text-[48px] md:text-[56px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.12] mb-6">
            Know Exactly What to Study for Your Next System Design Interview.
          </h1>

          <!-- Supporting Headline: #475569 (Slate 600) in Light Mode / #94A3B8 in Dark Mode -->
          <p class="font-sans text-[16px] sm:text-[19px] text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-2xl mb-8 font-normal">
            A structured 6-week preparation roadmap that gives you a clear challenge every day &mdash; so you spend less time searching for resources and more time actually preparing.
          </p>

          <!-- High-Intent Conversion CTAs: Electric Royal Indigo (#4F46E5 / #4338CA) -->
          <div class="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-6">
            <button
              type="button"
              class="roadmap-buy-trigger w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] font-sans font-bold text-[15px] shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              data-product="roadmap-799"
            >
              <span>Enroll in Roadmap &mdash; ₹799</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <a
              href="#how-it-works"
              class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#141C2E] hover:bg-slate-50 dark:hover:bg-[#182238] border border-[#E2E8F0] dark:border-[#24314A] text-[#0F172A] dark:text-slate-200 font-sans font-semibold text-[14px] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>See How It Works</span>
              <span class="material-symbols-outlined text-[16px] text-[#0284C7] dark:text-cyan-400">arrow_downward</span>
            </a>
          </div>

          <!-- Reassurance Subtext with Emerald & Sky metric hints -->
          <div class="text-[12px] font-code text-[#64748B] dark:text-slate-400 flex items-center justify-center gap-2 flex-wrap mb-10">
            <span class="text-[#059669] dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">lock</span> 12 Months Access
            </span>
            <span>&middot;</span>
            <span>42 Daily Guided Challenges</span>
            <span>&middot;</span>
            <span class="text-[#7C3AED] dark:text-purple-300 font-semibold">Self-Paced Velocity</span>
            <span>&middot;</span>
            <span class="text-[#059669] dark:text-emerald-400 font-semibold">30-Day Zero-Risk Guarantee</span>
          </div>

          <!-- CRITICAL ALERT BOX: Amber / Warm Coral (#F59E0B / #D97706 & #FFFBEB tint) -->
          <div class="w-full max-w-3xl text-left p-4 sm:p-5 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/30 border border-[#FDE68A] dark:border-amber-500/40 text-[#D97706] dark:text-[#FBBF24] flex items-start gap-3.5 shadow-xs mb-10">
            <div class="w-8 h-8 rounded-lg bg-[#FDE68A] dark:bg-amber-500/20 text-[#D97706] dark:text-amber-400 flex items-center justify-center shrink-0 font-bold mt-0.5">
              <span class="material-symbols-outlined text-[18px]">warning</span>
            </div>
            <div class="flex flex-col gap-1 text-[13px] leading-relaxed">
              <span class="font-sans font-bold text-[14px] text-[#B45309] dark:text-amber-300 uppercase tracking-wide">
                Pedagogical Rule: Don't reread, re-drill.
              </span>
              <p class="text-[#92400E] dark:text-amber-200/90 font-normal">
                Passive reading creates the illusion of architectural competence; daily active drills build reflexive interview instinct. When interviewers challenge your replication lag or failover strategy, memorized bullets crumble. Structured daily repetition is what makes Senior and Staff engineers sound seasoned.
              </p>
            </div>
          </div>

          <!-- Hero Visual: Realistic Browser Window Mockup (Light: #FFFFFF / Dark: #111827) -->
          <div class="w-full max-w-3xl text-left">
            <div class="text-center font-code text-[11px] text-[#0284C7] dark:text-cyan-400 uppercase tracking-wider font-semibold mb-2.5">
              Your preparation, organized into one daily path.
            </div>

            <!-- Browser Frame -->
            <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/[0.08] bg-white dark:bg-[#111827] shadow-xl overflow-hidden">
              <!-- Window Chrome Bar -->
              <div class="bg-[#F8FAFC] dark:bg-[#141C2E] px-4 py-3 border-b border-[#E2E8F0] dark:border-white/[0.08] flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div class="font-code text-[11px] text-[#475569] dark:text-slate-400 bg-white dark:bg-[#0B0F17] px-3 py-1 rounded border border-[#E2E8F0] dark:border-white/[0.08] flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[13px] text-[#4F46E5] dark:text-indigo-400">lock</span>
                  <span>app.systemdesignroadmap.io/dashboard</span>
                </div>
                <div class="w-12"></div>
              </div>

              <!-- Dashboard Body -->
              <div class="p-6 sm:p-7 flex flex-col gap-5 bg-white dark:bg-[#111827]">
                <!-- Header greeting -->
                <div class="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-white/[0.08]">
                  <div>
                    <div class="font-code text-[11px] text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider font-bold">SYSTEM DESIGN ROADMAP</div>
                    <h3 class="font-sans text-[18px] sm:text-[20px] font-bold text-[#0F172A] dark:text-white mt-0.5">Good morning &#128075;</h3>
                  </div>
                  <!-- Emerald: Readiness Target -->
                  <span class="font-code text-[11.5px] px-2.5 py-1 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 border border-[#A7F3D0] dark:border-emerald-500/40 text-[#059669] dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[13px]">trending_up</span> Readiness Target: 94% Benchmark
                  </span>
                </div>

                <!-- Today's Challenge Box -->
                <div class="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3.5 shadow-xs relative overflow-hidden">
                  <div class="flex items-center justify-between flex-wrap gap-2">
                    <!-- Active Module Pill: Electric Royal Indigo -->
                    <span class="font-code text-[11px] font-bold text-white uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#4F46E5]">
                      WEEK 03 / DAY 17 &bull; ACTIVE
                    </span>
                    <span class="font-code text-[12px] text-[#475569] dark:text-slate-400 flex items-center gap-1">
                      <span class="material-symbols-outlined text-[15px] text-[#0284C7] dark:text-cyan-400">schedule</span>
                      <span>Estimated time: <strong>45&ndash;60 minutes</strong></span>
                    </span>
                  </div>

                  <div>
                    <h4 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white tracking-tight">Today's Challenge: Consistent Hashing &amp; Virtual Nodes</h4>
                    <p class="text-[12.5px] text-[#475569] dark:text-slate-300 mt-1">Implement bounded-load hashing and defend shard rebalancing against hot-key cascades.</p>
                  </div>

                  <!-- Highlight block in Ice Blue (#EFF6FF) -->
                  <div class="bg-[#EFF6FF] dark:bg-blue-950/30 border border-[#BFDBFE] dark:border-blue-900/50 rounded-lg p-3.5 text-[12.5px] text-[#1E40AF] dark:text-blue-200 flex flex-col gap-1">
                    <strong class="flex items-center gap-1.5 font-semibold text-[#1E3A8A] dark:text-blue-100">
                      <span class="material-symbols-outlined text-[15px] text-[#0284C7] dark:text-cyan-400">flag</span>
                      Today's Objective
                    </strong>
                    <p class="leading-relaxed">
                      Derive key distribution across 100 virtual nodes per server and simulate node additions with minimal key migration (&lt; 1/N).
                    </p>
                  </div>

                  <button
                    type="button"
                    class="roadmap-buy-trigger self-start px-5 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-sans text-[13px] font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-500/20 cursor-pointer"
                    data-product="roadmap-799"
                  >
                    <span>Start Today's Challenge</span>
                    <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>

                <!-- Progress Bar -->
                <div class="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-4 flex flex-col gap-2.5">
                  <div class="flex items-center justify-between text-[12px]">
                    <span class="font-sans font-bold text-[#0F172A] dark:text-white">Your Progress</span>
                    <span class="font-code text-[#4F46E5] dark:text-[#818CF8] font-bold">17 / 42 days completed (40%)</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 font-code text-[11px]">
                    <div class="flex items-center justify-between px-2.5 py-1.5 rounded bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08]">
                      <span class="text-[#475569] dark:text-slate-400">Week 1: Fundamentals</span>
                      <span class="text-[#059669] dark:text-emerald-400 font-bold flex items-center gap-1">&check; Complete</span>
                    </div>
                    <div class="flex items-center justify-between px-2.5 py-1.5 rounded bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08]">
                      <span class="text-[#475569] dark:text-slate-400">Week 2: Storage &amp; Cache</span>
                      <span class="text-[#059669] dark:text-emerald-400 font-bold flex items-center gap-1">&check; Complete</span>
                    </div>
                    <div class="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#F5F3FF] dark:bg-purple-950/30 border border-[#DDD6FE] dark:border-purple-500/40">
                      <span class="text-[#7C3AED] dark:text-purple-300 font-semibold">Week 3: Scale &amp; Sharding</span>
                      <span class="text-[#7C3AED] dark:text-purple-300 font-bold">&bull; Day 17 Active</span>
                    </div>
                    <div class="flex items-center justify-between px-2.5 py-1.5 rounded bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] opacity-60">
                      <span class="text-[#64748B] dark:text-slate-400">Week 4: Real-time Architectures</span>
                      <span class="text-[#64748B] dark:text-slate-500">&#128274; Locked</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 2: NESTED HIGHLIGHT BANNERS (Foundations vs Playbook Focus) -->
      <!-- ================================================================= -->
      <section id="focus-areas" class="py-16 sm:py-20 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B]/70 bg-white dark:bg-[#0B0F17] transition-colors">
        <div class="max-w-5xl mx-auto flex flex-col gap-10">
          
          <div class="flex flex-col gap-2 max-w-2xl">
            <span class="font-code text-[11px] text-[#4F46E5] dark:text-[#818CF8] font-bold uppercase tracking-wider">Curriculum Architecture</span>
            <h2 class="font-sans text-[26px] sm:text-[34px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              Two Deep Focus Areas. Zero Fluff.
            </h2>
            <p class="font-sans text-[15px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              We separate foundational distributed primitives from real-world interview playbooks to ensure complete structural clarity and rapid recall.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- FOCUS AREA 1: FOUNDATIONS (Ice Blue #EFF6FF) -->
            <div class="rounded-2xl p-6 sm:p-7 bg-[#EFF6FF] dark:bg-blue-950/20 border border-[#BFDBFE] dark:border-blue-900/40 flex flex-col gap-4 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-[#0284C7] dark:text-cyan-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white dark:bg-blue-900/50 border border-[#BAE6FD] dark:border-blue-800">
                  DAYS 01 &ndash; 14 &bull; FOUNDATIONS
                </span>
                <span class="material-symbols-outlined text-[#0284C7] dark:text-cyan-400 text-[20px]">layers</span>
              </div>
              <h3 class="font-sans text-[20px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                Core Distributed Systems Primitives
              </h3>
              <p class="text-[13.5px] text-[#1E3A8A] dark:text-blue-200/80 leading-relaxed">
                Master the fundamental building blocks every interviewer evaluates within the first 15 minutes of the round.
              </p>
              <ul class="flex flex-col gap-2 text-[12.5px] text-[#1E40AF] dark:text-blue-300 font-medium">
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[15px] text-[#0284C7]">check_circle</span>
                  <span>CAP, PACELC &amp; Database Isolation Levels (MVCC)</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[15px] text-[#0284C7]">check_circle</span>
                  <span>Consistent Hashing with Virtual Nodes &amp; Replication Lag</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[15px] text-[#0284C7]">check_circle</span>
                  <span>Cache-Aside, Write-Through &amp; Thundering Herd Prevention</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[15px] text-[#0284C7]">check_circle</span>
                  <span>Kafka Log Compaction vs RabbitMQ Acknowledgements</span>
                </li>
              </ul>
            </div>

            <!-- FOCUS AREA 2: PLAYBOOK (Soft Indigo #F5F3FF) -->
            <div class="rounded-2xl p-6 sm:p-7 bg-[#F5F3FF] dark:bg-indigo-950/20 border border-[#DDD6FE] dark:border-indigo-900/40 flex flex-col gap-4 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold text-[#7C3AED] dark:text-purple-300 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white dark:bg-purple-900/50 border border-[#DDD6FE] dark:border-purple-800">
                  DAYS 15 &ndash; 42 &bull; PLAYBOOK
                </span>
                <span class="material-symbols-outlined text-[#7C3AED] dark:text-purple-300 text-[20px]">architecture</span>
              </div>
              <h3 class="font-sans text-[20px] font-bold text-[#0F172A] dark:text-white tracking-tight">
                20 Real-World Production Architectures
              </h3>
              <p class="text-[13.5px] text-[#3730A3] dark:text-purple-200/80 leading-relaxed">
                Step-by-step blueprints for large-scale systems requested in FAANG/MAMAA L5 and L6 interview loops.
              </p>
              <ul class="flex flex-col gap-2 text-[12.5px] text-[#4338CA] dark:text-purple-300 font-medium">
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[15px] text-[#7C3AED]">check_circle</span>
                  <span>TinyURL &amp; Base62 Unique ID Generation (Snowflake)</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[15px] text-[#7C3AED]">check_circle</span>
                  <span>Uber Geospatial Dispatch with Google S2 &amp; Uber H3 Hexagons</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[15px] text-[#7C3AED]">check_circle</span>
                  <span>Distributed Rate Limiter with Sliding Window Counter &amp; Redis Lua</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[15px] text-[#7C3AED]">check_circle</span>
                  <span>WhatsApp E2EE Real-Time Messaging &amp; Long-Lived WebSockets</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 3: THE 6-STAGE INTERVIEW EXECUTION LOOP -->
      <!-- ================================================================= -->
      <section id="execution-loop" class="py-16 sm:py-20 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B]/70 bg-[#F8FAFC] dark:bg-[#0B0F17] transition-colors">
        <div class="max-w-5xl mx-auto flex flex-col gap-10">
          
          <div class="flex flex-col gap-2 max-w-2xl">
            <span class="font-code text-[11px] text-[#0284C7] dark:text-cyan-400 font-bold uppercase tracking-wider">Interview Diagnostic Rubric</span>
            <h2 class="font-sans text-[26px] sm:text-[34px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              The 6-Stage System Design Interview Execution Loop
            </h2>
            <p class="font-sans text-[15px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Every day in the roadmap trains you on this exact cadence so you lead the 45-minute interview instead of reacting to it.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <!-- STAGE 01: LEARN & SCRUTINIZE (Cyan Accent) -->
            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs hover:border-[#0284C7] transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0F9FF] dark:bg-cyan-950/40 text-[#0284C7] dark:text-cyan-300 border border-[#BAE6FD] dark:border-cyan-500/30">
                  STEP 01 &bull; LEARN
                </span>
                <span class="font-code text-[10.5px] text-[#64748B] dark:text-slate-400">MIN 00&ndash;05 &amp; 05&ndash;10</span>
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Scope &amp; Constraints</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Clarify functional boundaries, non-functional latency budgets, and compute scale math (QPS, IOPS, storage footprint).
              </p>
            </div>

            <!-- STAGE 02: HIGH-LEVEL TOPOLOGY -->
            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs hover:border-slate-400 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-slate-300">
                  STEP 02 &bull; BLUEPRINT
                </span>
                <span class="font-code text-[10.5px] text-[#64748B] dark:text-slate-400">MIN 10&ndash;20</span>
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">High-Level Topology</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Map client entrypoints, DNS, CDN edge, reverse proxies, stateless services, and initial storage interfaces.
              </p>
            </div>

            <!-- STAGE 03: DECIDE & WEIGH TRADE-OFFS (Violet Accent) -->
            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs hover:border-[#7C3AED] transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-[#F5F3FF] dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 border border-[#DDD6FE] dark:border-purple-500/30">
                  STEP 03 &bull; DECIDE
                </span>
                <span class="font-code text-[10.5px] text-[#64748B] dark:text-slate-400">MIN 20&ndash;30</span>
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Trade-Offs &amp; Caching</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Compare SQL vs NoSQL, evaluate p99 latency &lt; 15ms with Redis caching, and balance consistency vs availability.
              </p>
            </div>

            <!-- STAGE 04: SCALE BOTTLENECKS -->
            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs hover:border-slate-400 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-slate-300">
                  STEP 04 &bull; SCALE
                </span>
                <span class="font-code text-[10.5px] text-[#64748B] dark:text-slate-400">MIN 30&ndash;38</span>
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Partitions &amp; Sharding</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Eliminate single points of failure, partition data rings, and scale async writes through distributed Kafka logs.
              </p>
            </div>

            <!-- STAGE 05: DEFEND UNDER SCRUTINY (Amber Accent) -->
            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs hover:border-[#D97706] transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFFBEB] dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-amber-500/30">
                  STEP 05 &bull; DEFEND
                </span>
                <span class="font-code text-[10.5px] text-[#64748B] dark:text-slate-400">MIN 38&ndash;43</span>
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Failure Modes &amp; Edge Cases</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Defend against split-brain, cache stampedes, network partitions, and hot-partition load spikes under intense scrutiny.
              </p>
            </div>

            <!-- STAGE 06: BENCHMARK GATE (Emerald Accent) -->
            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs hover:border-[#059669] transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-code text-[11px] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-500/30">
                  STEP 06 &bull; PASS GATE
                </span>
                <span class="font-code text-[10.5px] text-[#64748B] dark:text-slate-400">MIN 43&ndash;45</span>
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Synthesis &amp; Benchmark</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Confirm L5/L6 competency rubric, verify SLA/SLO compliance, and secure interview pass benchmark status.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 4: THE PROBLEM WITH SCATTERED STUDY -->
      <!-- ================================================================= -->
      <section class="py-16 sm:py-20 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B]/70 bg-white dark:bg-[#0B0F17] transition-colors">
        <div class="max-w-5xl mx-auto flex flex-col gap-10">
          
          <div class="flex flex-col gap-2 max-w-2xl">
            <span class="font-code text-[11px] text-rose-500 dark:text-rose-400 font-bold uppercase tracking-wider">The Real Hurdle</span>
            <h2 class="font-sans text-[26px] sm:text-[34px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              The problem isn't a lack of resources.
            </h2>
            <p class="font-sans text-[16px] text-[#475569] dark:text-[#94A3B8] font-normal">
              It's knowing what to do with them.
            </p>
          </div>

          <!-- 4 Clean Problem Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-2 transition-all hover:border-slate-400 shadow-xs">
              <div class="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center font-code text-[13px] font-bold">
                01
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Too many resources</h3>
              <p class="text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed">
                You have videos, blogs, books, courses and AI tools &mdash; but no clear sequence.
              </p>
            </div>

            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-2 transition-all hover:border-slate-400 shadow-xs">
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-[#D97706] dark:text-amber-400 flex items-center justify-center font-code text-[13px] font-bold">
                02
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">No daily plan</h3>
              <p class="text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed">
                You sit down to prepare and spend 40 minutes deciding what to study instead of practicing.
              </p>
            </div>

            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-2 transition-all hover:border-slate-400 shadow-xs">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20 text-[#7C3AED] dark:text-purple-400 flex items-center justify-center font-code text-[13px] font-bold">
                03
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Inconsistent preparation</h3>
              <p class="text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Work gets busy. Preparation gets pushed to tomorrow. Momentum is lost.
              </p>
            </div>

            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-2 transition-all hover:border-slate-400 shadow-xs">
              <div class="w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 text-[#0284C7] dark:text-cyan-400 flex items-center justify-center font-code text-[13px] font-bold">
                04
              </div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">No clear finish line</h3>
              <p class="text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed">
                You keep consuming content without knowing whether you're actually getting interview-ready.
              </p>
            </div>

          </div>

          <!-- Bottom Statement -->
          <div class="p-4 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/30 border border-[#BFDBFE] dark:border-blue-900/50 text-center font-sans text-[15px] font-semibold text-[#1E40AF] dark:text-blue-200">
            The roadmap removes the guesswork. Open your dashboard and execute.
          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 5: HOW THE PRODUCT WORKS -->
      <!-- ================================================================= -->
      <section id="how-it-works" class="py-16 sm:py-20 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B]/70 bg-[#F8FAFC] dark:bg-[#0B0F17] transition-colors">
        <div class="max-w-5xl mx-auto flex flex-col gap-10">
          
          <div class="flex flex-col gap-2 max-w-2xl">
            <span class="font-code text-[11px] text-[#4F46E5] dark:text-[#818CF8] font-bold uppercase tracking-wider">Workflow</span>
            <h2 class="font-sans text-[26px] sm:text-[34px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              A simple system for consistent preparation.
            </h2>
          </div>

          <!-- 4 Numbered Steps Timeline -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            
            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs">
              <span class="font-code text-[12px] font-bold text-[#0284C7] dark:text-cyan-400">01 &mdash; START</span>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Create Account</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Create your account and get instant access to your private preparation dashboard.
              </p>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs">
              <span class="font-code text-[12px] font-bold text-[#0284C7] dark:text-cyan-400">02 &mdash; FOLLOW</span>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Open Dashboard</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Open your dashboard and see exactly what you need to work on today.
              </p>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs">
              <span class="font-code text-[12px] font-bold text-[#4F46E5] dark:text-[#818CF8]">03 &mdash; COMPLETE</span>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Daily Challenge</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Work through the day's learning material and targeted architectural exercise.
              </p>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-xs">
              <span class="font-code text-[12px] font-bold text-[#059669] dark:text-emerald-400">04 &mdash; PROGRESS</span>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Move Forward</h3>
              <p class="text-[12.5px] text-[#475569] dark:text-slate-300 leading-relaxed">
                Mark the day complete and move forward through your 6-week journey with cloud sync.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 6: THE 6-WEEK JOURNEY -->
      <!-- ================================================================= -->
      <section id="six-week-journey" class="py-16 sm:py-20 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B]/70 bg-white dark:bg-[#0B0F17] transition-colors">
        <div class="max-w-5xl mx-auto flex flex-col gap-10">
          
          <div class="flex flex-col gap-2 max-w-2xl">
            <span class="font-code text-[11px] text-[#0284C7] dark:text-cyan-400 font-bold uppercase tracking-wider">The Progression</span>
            <h2 class="font-sans text-[26px] sm:text-[34px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              Six weeks. One structured path.
            </h2>
            <p class="font-sans text-[15px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              A carefully sequenced journey designed to take you from foundational concepts to high-level interview mastery without overwhelming your work schedule.
            </p>
          </div>

          <!-- 6 Visually Connected Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pb-2">
            
            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-4 flex flex-col gap-1.5 shadow-xs hover:border-[#0284C7] transition-all">
              <span class="font-code text-[11px] text-[#64748B] dark:text-slate-400 font-bold uppercase">WEEK 01</span>
              <span class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Start</span>
              <span class="font-code text-[10.5px] text-[#0284C7] dark:text-cyan-400 mt-1">Days 1–7</span>
            </div>

            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-4 flex flex-col gap-1.5 shadow-xs hover:border-[#0284C7] transition-all">
              <span class="font-code text-[11px] text-[#64748B] dark:text-slate-400 font-bold uppercase">WEEK 02</span>
              <span class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Build</span>
              <span class="font-code text-[10.5px] text-[#0284C7] dark:text-cyan-400 mt-1">Days 8–14</span>
            </div>

            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-4 flex flex-col gap-1.5 shadow-xs hover:border-[#4F46E5] transition-all">
              <span class="font-code text-[11px] text-[#64748B] dark:text-slate-400 font-bold uppercase">WEEK 03</span>
              <span class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Apply</span>
              <span class="font-code text-[10.5px] text-[#4F46E5] dark:text-[#818CF8] mt-1">Days 15–21</span>
            </div>

            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-4 flex flex-col gap-1.5 shadow-xs hover:border-[#7C3AED] transition-all">
              <span class="font-code text-[11px] text-[#64748B] dark:text-slate-400 font-bold uppercase">WEEK 04</span>
              <span class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Practice</span>
              <span class="font-code text-[10.5px] text-[#7C3AED] dark:text-purple-300 mt-1">Days 22–28</span>
            </div>

            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-4 flex flex-col gap-1.5 shadow-xs hover:border-[#D97706] transition-all">
              <span class="font-code text-[11px] text-[#64748B] dark:text-slate-400 font-bold uppercase">WEEK 05</span>
              <span class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Deepen</span>
              <span class="font-code text-[10.5px] text-[#D97706] dark:text-amber-400 mt-1">Days 29–35</span>
            </div>

            <div class="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl p-4 flex flex-col gap-1.5 shadow-xs hover:border-[#059669] transition-all">
              <span class="font-code text-[11px] text-[#64748B] dark:text-slate-400 font-bold uppercase">WEEK 06</span>
              <span class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-white">Interview</span>
              <span class="font-code text-[10.5px] text-[#059669] dark:text-emerald-400 mt-1">Days 36–42</span>
            </div>

          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12.5px] text-[#475569] dark:text-slate-400 border-t border-[#E2E8F0] dark:border-white/[0.08] pt-4 font-sans">
            <span class="text-[#0F172A] dark:text-white font-medium">42 days of guided preparation</span>
            <span>Designed for engineers preparing alongside a full-time job.</span>
          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 7: 30-DAY ZERO-RISK OFFER GUARANTEE -->
      <!-- ================================================================= -->
      <section class="py-16 sm:py-20 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B]/70 bg-[#ECFDF5] dark:bg-emerald-950/20 transition-colors">
        <div class="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <div class="w-14 h-14 rounded-2xl bg-white dark:bg-emerald-900/50 border border-[#A7F3D0] dark:border-emerald-500/40 text-[#059669] dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <span class="material-symbols-outlined text-[32px]">verified_user</span>
          </div>
          <div class="flex flex-col gap-2 max-w-2xl">
            <span class="font-code text-[11px] text-[#059669] dark:text-emerald-400 font-bold uppercase tracking-wider">Pass Benchmark Guarantee</span>
            <h2 class="font-sans text-[28px] sm:text-[36px] font-bold text-[#0F172A] dark:text-white tracking-tight">
              30-Day Zero-Risk Offer Guarantee
            </h2>
            <p class="font-sans text-[15px] sm:text-[16px] text-[#065F46] dark:text-emerald-200/90 leading-relaxed">
              Enroll today for &#8377;799. Follow the daily challenges for 30 days. If you don't feel dramatically more confident, structured, and interview-ready for your upcoming rounds, simply email us for a 100% full refund. No questions asked.
            </p>
          </div>
          <button
            type="button"
            class="roadmap-buy-trigger px-7 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-sans font-bold text-[14px] shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2"
            data-product="roadmap-799"
          >
            <span>Start Your Zero-Risk Preparation &mdash; &#8377;799</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 8: ACCESS & PRICING -->
      <!-- ================================================================= -->
      <section id="pricing" class="py-16 sm:py-24 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B]/70 bg-white dark:bg-[#0B0F17] transition-colors">
        <div class="max-w-xl mx-auto flex flex-col gap-8 items-center text-center">
          
          <div class="flex flex-col gap-2">
            <span class="font-code text-[11px] text-[#4F46E5] dark:text-[#818CF8] font-bold uppercase tracking-wider">Transparent Pricing</span>
            <h2 class="font-sans text-[28px] sm:text-[36px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              Start your System Design preparation.
            </h2>
            <p class="text-[14px] text-[#475569] dark:text-[#94A3B8]">
              One price. Complete 6-week roadmap. Instant access.
            </p>
          </div>

          <!-- Large Pricing Card: Pure White / Slate 900 with Electric Royal Indigo CTA -->
          <div class="w-full bg-[#F8FAFC] dark:bg-[#111827] border-2 border-[#4F46E5]/40 rounded-3xl p-7 sm:p-9 flex flex-col gap-6 shadow-xl text-left relative overflow-hidden">
            
            <div class="flex flex-col gap-1">
              <span class="font-code text-[11px] font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">The Full Program</span>
              <h3 class="font-sans text-[20px] font-bold text-[#0F172A] dark:text-white">
                The 6-Week System Design Interview Roadmap
              </h3>
            </div>

            <!-- Price Display -->
            <div class="flex items-baseline gap-2 pt-1 border-t border-[#E2E8F0] dark:border-white/[0.08]">
              <span class="font-sans text-[42px] font-extrabold text-[#0F172A] dark:text-white tracking-tight">&#8377;799</span>
              <span class="font-sans text-[14px] text-[#64748B] dark:text-slate-400 font-medium">One-time payment</span>
            </div>

            <!-- Features list -->
            <ul class="flex flex-col gap-3 text-[13.5px] text-[#475569] dark:text-slate-200">
              <li class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[18px]">check_circle</span>
                <span>Complete 6-week guided roadmap (42 Days)</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[18px]">check_circle</span>
                <span>Foundations &amp; Playbook Focus Areas</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[18px]">check_circle</span>
                <span>20 Production-Grade Architecture Blueprints</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[18px]">check_circle</span>
                <span>Failure Mode Scenarios &amp; Defense Drills</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[#059669] dark:text-emerald-400 text-[18px]">check_circle</span>
                <span>Private Member Dashboard &amp; Progress Sync</span>
              </li>
              <li class="flex items-center gap-2.5 font-bold text-[#0F172A] dark:text-white">
                <span class="material-symbols-outlined text-[#4F46E5] dark:text-indigo-400 text-[18px]">verified</span>
                <span>Full 12 Months Access</span>
              </li>
              <li class="flex items-center gap-2.5 font-bold text-[#059669] dark:text-emerald-400">
                <span class="material-symbols-outlined text-[18px]">verified_user</span>
                <span>30-Day Zero-Risk Money-Back Guarantee</span>
              </li>
            </ul>

            <!-- High-Intent Primary CTA Button: Electric Royal Indigo -->
            <button
              type="button"
              class="roadmap-buy-trigger w-full py-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] font-sans font-bold text-[15px] shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 mt-2"
              data-product="roadmap-799"
            >
              <span>Enroll in Roadmap &mdash; &#8377;799 &rarr;</span>
            </button>

            <!-- Reassurance Note -->
            <div class="text-center font-code text-[11px] text-[#64748B] dark:text-slate-400">
              Secure UPI &amp; Card Checkout &bull; Instant activation
            </div>

          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 9: FAQ (ACCORDION) -->
      <!-- ================================================================= -->
      <section id="faq" class="py-16 sm:py-20 px-4 sm:px-6 border-b border-[#E2E8F0] dark:border-[#1E293B]/70 bg-[#F8FAFC] dark:bg-[#0B0F17] transition-colors">
        <div class="max-w-3xl mx-auto flex flex-col gap-8">
          
          <div class="flex flex-col gap-2 text-center items-center">
            <span class="font-code text-[11px] text-[#4F46E5] dark:text-[#818CF8] font-bold uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 class="font-sans text-[26px] sm:text-[34px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
              Frequently Asked Questions
            </h2>
          </div>

          <!-- Accordion Group -->
          <div class="flex flex-col gap-3">
            
            <div class="faq-item bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl overflow-hidden transition-colors shadow-xs">
              <button type="button" class="faq-toggle w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer">
                <span class="font-sans text-[14.5px] font-bold text-[#0F172A] dark:text-white">What exactly do I get after purchasing?</span>
                <span class="material-symbols-outlined text-[#64748B] transition-transform faq-arrow">expand_more</span>
              </button>
              <div class="faq-answer hidden px-4 pb-4 sm:px-5 sm:pb-5 text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed border-t border-[#E2E8F0] dark:border-white/[0.08] pt-3">
                You get access to the private course dashboard containing the 6-week System Design preparation journey, all 42 daily challenges, 20 production specs, and interactive diagnostic rubrics.
              </div>
            </div>

            <div class="faq-item bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl overflow-hidden transition-colors shadow-xs">
              <button type="button" class="faq-toggle w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer">
                <span class="font-sans text-[14.5px] font-bold text-[#0F172A] dark:text-white">Is this a video course?</span>
                <span class="material-symbols-outlined text-[#64748B] transition-transform faq-arrow">expand_more</span>
              </button>
              <div class="faq-answer hidden px-4 pb-4 sm:px-5 sm:pb-5 text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed border-t border-[#E2E8F0] dark:border-white/[0.08] pt-3">
                No. The course is primarily web-based written learning material supported by structured exercises, visual explanations, trade-off calculators, and interview-focused practice.
              </div>
            </div>

            <div class="faq-item bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl overflow-hidden transition-colors shadow-xs">
              <button type="button" class="faq-toggle w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer">
                <span class="font-sans text-[14.5px] font-bold text-[#0F172A] dark:text-white">How much time should I spend each day?</span>
                <span class="material-symbols-outlined text-[#64748B] transition-transform faq-arrow">expand_more</span>
              </button>
              <div class="faq-answer hidden px-4 pb-4 sm:px-5 sm:pb-5 text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed border-t border-[#E2E8F0] dark:border-white/[0.08] pt-3">
                Each day's challenge is designed to be manageable alongside a full-time software engineering job (45 to 60 minutes per session).
              </div>
            </div>

            <div class="faq-item bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl overflow-hidden transition-colors shadow-xs">
              <button type="button" class="faq-toggle w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer">
                <span class="font-sans text-[14.5px] font-bold text-[#0F172A] dark:text-white">What is the 30-Day Zero-Risk Offer Guarantee?</span>
                <span class="material-symbols-outlined text-[#64748B] transition-transform faq-arrow">expand_more</span>
              </button>
              <div class="faq-answer hidden px-4 pb-4 sm:px-5 sm:pb-5 text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed border-t border-[#E2E8F0] dark:border-white/[0.08] pt-3">
                If within 30 days of purchase you feel the roadmap has not accelerated your interview preparation or provided the structure you needed, you can email us for a 100% full refund with no questions asked.
              </div>
            </div>

            <div class="faq-item bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl overflow-hidden transition-colors shadow-xs">
              <button type="button" class="faq-toggle w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer">
                <span class="font-sans text-[14.5px] font-bold text-[#0F172A] dark:text-white">How long do I have access?</span>
                <span class="material-symbols-outlined text-[#64748B] transition-transform faq-arrow">expand_more</span>
              </button>
              <div class="faq-answer hidden px-4 pb-4 sm:px-5 sm:pb-5 text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed border-t border-[#E2E8F0] dark:border-white/[0.08] pt-3">
                You receive 12 months of full access from the date of purchase, allowing you to prepare, take interviews, and revise throughout your job search.
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 10: FINAL CLOSING CTA -->
      <!-- ================================================================= -->
      <section class="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-[#0B0F17] border-b border-[#E2E8F0] dark:border-[#1E293B]/70 relative overflow-hidden transition-colors">
        <div class="relative max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 class="font-sans text-[28px] sm:text-[40px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-snug">
            Stop wondering what to study next.
          </h2>

          <p class="font-sans text-[15px] sm:text-[17px] text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-xl">
            Start with Day 1. Follow the roadmap. Build your System Design interview skills one day at a time.
          </p>

          <button
            type="button"
            class="roadmap-buy-trigger px-8 py-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] font-sans font-bold text-[15px] shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2"
            data-product="roadmap-799"
          >
            <span>Enroll in Roadmap &mdash; &#8377;799</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <span class="font-code text-[11.5px] text-[#64748B] dark:text-slate-400">
            12 months access &bull; 30-day zero-risk guarantee
          </span>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- FOOTER -->
      <!-- ================================================================= -->
      <footer class="py-10 px-4 sm:px-6 bg-[#F8FAFC] dark:bg-[#0B0F17] border-t border-[#E2E8F0] dark:border-white/[0.08] text-[12px] text-[#64748B] dark:text-slate-500 font-sans transition-colors">
        <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-[#0F172A] dark:text-slate-400 font-semibold">
            <div class="w-5 h-5 rounded bg-[#4F46E5] text-white flex items-center justify-center text-[10px] font-bold">
              OS
            </div>
            <span>The 6-Week System Design Interview Roadmap</span>
          </div>

          <div class="flex items-center gap-5 text-[#475569] dark:text-slate-400 flex-wrap justify-center">
            <a href="#how-it-works" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">How It Works</a>
            <a href="#focus-areas" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">Curriculum Areas</a>
            <a href="#execution-loop" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">6-Stage Loop</a>
            <a href="#faq" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">FAQ</a>
            <a href="#/login" class="hover:text-[#4F46E5] dark:hover:text-white transition-colors">Login</a>
          </div>

          <div>
            &copy; 2026 The 6-Week System Design Roadmap. All rights reserved.
          </div>
        </div>
      </footer>

      <!-- ================================================================= -->
      <!-- STICKY MOBILE BOTTOM CTA -->
      <!-- ================================================================= -->
      <div class="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-white/[0.08] p-3 flex items-center justify-between shadow-2xl">
        <div class="flex flex-col">
          <span class="font-sans text-[14px] font-bold text-[#0F172A] dark:text-white">&#8377;799</span>
          <span class="font-code text-[10px] text-[#059669] dark:text-emerald-400 font-semibold">12 Months Access</span>
        </div>
        <button
          type="button"
          class="roadmap-buy-trigger px-5 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-sans font-bold text-[13px] shadow-sm shadow-indigo-500/30 cursor-pointer"
          data-product="roadmap-799"
        >
          Enroll in Roadmap
        </button>
      </div>

    </div>
  `;
}

/**
 * Attach interactive event listeners for Roadmap Landing Page:
 * - FAQ Accordion toggle
 * - Purchase modal trigger with custom ₹799 pass
 * - Smooth scroll anchor links
 */
export function setupRoadmapLandingListeners() {
  // 1. FAQ Accordion Toggle
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parentItem = toggle.closest('.faq-item');
      const answer = parentItem?.querySelector('.faq-answer');
      const arrow = toggle.querySelector('.faq-arrow');
      if (!answer) return;

      const isHidden = answer.classList.contains('hidden');
      if (isHidden) {
        answer.classList.remove('hidden');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        parentItem.classList.add('border-[#4F46E5]/40');
      } else {
        answer.classList.add('hidden');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        parentItem.classList.remove('border-[#4F46E5]/40');
      }
    });
  });

  // 2. Buy Modal Trigger
  const buyTriggers = document.querySelectorAll('.roadmap-buy-trigger');
  buyTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBuyAccessModal({
        productName: 'The 6-Week System Design Interview Roadmap',
        productSub: '6-Week Structured Preparation for Working Engineers',
        price: '₹799',
        originalPrice: '₹2,499',
        savings: 'SAVE ₹1,700',
        accessDuration: '12 Months Access'
      });
    });
  });
}
