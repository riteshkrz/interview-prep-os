/**
 * Enhanced Compliance & E-Commerce Footer for Interview Prep OS
 * Designed to satisfy Payment Gateway (Razorpay, Stripe, Cashfree, PayPal)
 * onboarding requirements and merchant verification standards.
 */

import { CONFIG } from '../config.js';

export function renderFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="w-full bg-[#070A12] border-t border-[#1E293B] pt-14 pb-10 text-[#CBD5E1]">
      <div class="max-w-[78rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        <!-- Main 4-Column Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          <!-- Column 1: Brand Identity & Trust -->
          <div class="flex flex-col gap-4">
            <a href="#" class="flex items-center gap-2.5 group">
              <img
                src="/logo.svg"
                alt="Interview Prep OS Logo"
                class="h-7 w-auto object-contain rounded p-1 bg-[#151D2F] border border-[#24314A] group-hover:border-cyan-500/50 transition-colors"
              />
              <span class="font-sans text-[16px] text-white font-bold tracking-tight">
                ${CONFIG.TITLE}
              </span>
            </a>

            <p class="text-[13px] text-slate-400 leading-relaxed">
              ${CONFIG.VALUE_PROP}
            </p>

            <!-- SSL 256-Bit Security Badge -->
            <div class="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0F1626] border border-emerald-500/30 shadow-xs">
              <span class="material-symbols-outlined text-emerald-400 text-[20px]">verified_user</span>
              <div class="flex flex-col">
                <span class="text-[11px] font-code font-bold text-white uppercase tracking-wider">256-Bit SSL Encrypted</span>
                <span class="text-[10px] text-slate-400">Bank-Grade PCI-DSS Checkout</span>
              </div>
            </div>
          </div>

          <!-- Column 2: Platform & Curriculum -->
          <div class="flex flex-col gap-3.5">
            <h4 class="font-code text-[12px] uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Curriculum &amp; Platform
            </h4>
            <ul class="flex flex-col gap-2 text-[13px]">
              <li>
                <a href="#whats-inside" class="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                  <span>What's Inside</span>
                  <span class="text-slate-600 group-hover:text-cyan-400 font-code text-[11px]">01</span>
                </a>
              </li>
              <li>
                <a href="#how-it-works" class="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                  <span>45-Day Curriculum</span>
                  <span class="text-slate-600 group-hover:text-cyan-400 font-code text-[11px]">02</span>
                </a>
              </li>
              <li>
                <a href="#/dashboard" class="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                  <span>100 Core DSA Problems</span>
                  <span class="text-slate-600 group-hover:text-cyan-400 font-code text-[11px]">100 Qs</span>
                </a>
              </li>
              <li>
                <a href="#/dashboard" class="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                  <span>20 System Design Specs</span>
                  <span class="text-slate-600 group-hover:text-cyan-400 font-code text-[11px]">20 Specs</span>
                </a>
              </li>
              <li>
                <a href="#pricing" class="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                  <span>Pricing &amp; Lifetime Access</span>
                  <span class="text-emerald-400 font-code text-[11px] font-semibold">${CONFIG.PRICE}</span>
                </a>
              </li>
              <li>
                <a href="#/dashboard" class="text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1 mt-1">
                  <span>Customer Login / Dashboard</span>
                  <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Mandatory Legal & Regulatory Policies -->
          <div class="flex flex-col gap-3.5">
            <h4 class="font-code text-[12px] uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Legal &amp; Compliance
            </h4>
            <ul class="flex flex-col gap-2 text-[13px]">
              <li>
                <a href="#/terms" data-legal-modal="terms" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[15px] text-slate-500">description</span>
                  <span>Terms &amp; Conditions</span>
                </a>
              </li>
              <li>
                <a href="#/privacy" data-legal-modal="privacy" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[15px] text-slate-500">security</span>
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#/refund" data-legal-modal="refund" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[15px] text-slate-500">currency_exchange</span>
                  <span>Refund &amp; Cancellation Policy</span>
                </a>
              </li>
              <li>
                <a href="#/shipping" data-legal-modal="shipping" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[15px] text-slate-500">local_shipping</span>
                  <span>Shipping &amp; Delivery Policy</span>
                </a>
              </li>
              <li>
                <a href="#/contact" data-legal-modal="contact" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[15px] text-slate-500">help</span>
                  <span>Grievance &amp; Contact Us</span>
                </a>
              </li>
            </ul>

            <!-- Third-Party Trademark Disclaimer -->
            <div class="mt-2 p-2.5 rounded-lg bg-[#0F1626]/80 border border-[#1E293B] text-[11px] text-slate-400 leading-normal font-sans">
              <span class="font-semibold text-slate-300">Disclaimer:</span> ${CONFIG.TRADEMARK_DISCLAIMER}
            </div>
          </div>

          <!-- Column 4: Merchant Contact & Business Information -->
          <div class="flex flex-col gap-3.5">
            <h4 class="font-code text-[12px] uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Merchant &amp; Business Details
            </h4>
            
            <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 flex flex-col gap-3 text-[12.5px]">
              
              <!-- Legal Entity Name -->
              <div>
                <span class="text-[10.5px] font-code uppercase tracking-wider text-slate-400 block font-semibold">
                  Legal Entity / Merchant
                </span>
                <span class="text-white font-semibold block mt-0.5">
                  ${CONFIG.LEGAL_ENTITY_NAME}
                </span>
              </div>

              <!-- Physical Business Address -->
              <div>
                <span class="text-[10.5px] font-code uppercase tracking-wider text-slate-400 block font-semibold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[13px] text-cyan-400">location_on</span>
                  Registered Office Address
                </span>
                <span class="text-slate-300 leading-snug block mt-0.5">
                  ${CONFIG.BUSINESS_ADDRESS}
                </span>
              </div>

              <!-- Official Support Email -->
              <div>
                <span class="text-[10.5px] font-code uppercase tracking-wider text-slate-400 block font-semibold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[13px] text-cyan-400">mail</span>
                  Customer Support Email
                </span>
                <a href="mailto:${CONFIG.SUPPORT_EMAIL}" class="text-cyan-300 hover:text-cyan-200 font-medium hover:underline block mt-0.5">
                  ${CONFIG.SUPPORT_EMAIL}
                </a>
              </div>

              <!-- Support Availability & SLA -->
              <div class="pt-2 border-t border-[#1E293B]">
                <span class="text-[10.5px] font-code uppercase tracking-wider text-slate-400 block font-semibold">
                  Operating Hours &amp; SLA
                </span>
                <span class="text-slate-300 text-[11.5px] block mt-0.5">
                  ${CONFIG.SUPPORT_HOURS}
                </span>
                <span class="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-code font-bold mt-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ${CONFIG.SUPPORT_SLA}
                </span>
              </div>

            </div>
          </div>

        </div>

        <!-- Payment Methods & Bottom Bar Divider -->
        <div class="pt-8 border-t border-[#1E293B] flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <!-- Copyright & Dynamic Year -->
          <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span class="font-code text-[12px] text-slate-400">
              &copy; ${currentYear} ${CONFIG.TITLE}. All rights reserved.
            </span>
            <span class="hidden sm:inline text-slate-600">&bull;</span>
            <span class="font-code text-[11.5px] text-slate-500">
              Operated by ${CONFIG.LEGAL_ENTITY_NAME}
            </span>
          </div>

          <!-- Accepted Payment Methods & Trust Badges -->
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            
            <!-- Visa Badge -->
            <div class="h-7 px-2.5 bg-[#0F1626] border border-[#24314A] rounded-md flex items-center justify-center shadow-xs" title="Visa Accepted">
              <svg class="h-3.5 w-auto" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.01 0.44L12.44 15.56H8.13L4.95 3.73C4.76 2.99 4.6 2.72 4.02 2.41C3.07 1.9 1.45 1.43 0.14 1.13L0.23 0.44H7.07C7.96 0.44 8.76 1.03 8.95 2.05L10.66 11.13L14.85 0.44H19.01ZM35.74 10.65C35.77 6.58 30.12 6.36 30.16 4.54C30.17 3.99 30.7 3.39 31.86 3.24C32.44 3.16 34.02 3.1 35.81 3.93L36.52 0.63C35.54 0.28 34.28 0 32.72 0C28.73 0 25.91 2.12 25.88 5.16C25.85 7.41 27.87 8.67 29.41 9.42C30.98 10.19 31.51 10.68 31.5 11.36C31.48 12.4 30.25 12.86 29.11 12.88C27.08 12.91 25.9 12.33 24.95 11.89L24.21 15.34C25.17 15.78 26.95 16.16 28.78 16.18C33.02 16.18 35.71 14.09 35.74 10.65ZM46.33 15.56H50L46.8 0.44H43.4C42.63 0.44 41.98 0.88 41.7 1.55L35.63 15.56H39.85L40.69 13.23H45.85L46.33 15.56ZM41.85 10.02L43.98 4.16L45.2 10.02H41.85ZM25.26 0.44L21.93 15.56H17.91L21.24 0.44H25.26Z" fill="#3B82F6"/>
              </svg>
            </div>

            <!-- Mastercard Badge -->
            <div class="h-7 px-2.5 bg-[#0F1626] border border-[#24314A] rounded-md flex items-center justify-center shadow-xs" title="Mastercard Accepted">
              <svg class="h-4 w-auto" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#EB001B"/>
                <circle cx="22" cy="10" r="10" fill="#F79E1B" fill-opacity="0.9"/>
                <path d="M16 3.1A9.97 9.97 0 0 1 19.8 10 9.97 9.97 0 0 1 16 16.9 9.97 9.97 0 0 1 12.2 10 9.97 9.97 0 0 1 16 3.1Z" fill="#FF5F00"/>
              </svg>
            </div>

            <!-- RuPay Badge -->
            <div class="h-7 px-2.5 bg-[#0F1626] border border-[#24314A] rounded-md flex items-center justify-center shadow-xs" title="RuPay Accepted">
              <span class="font-sans text-[11px] font-black tracking-tight flex items-center">
                <span class="text-white">Ru</span><span class="text-[#0EA5E9]">Pay</span>
                <span class="w-1.5 h-1.5 ml-0.5 rounded-full bg-[#F97316]"></span>
              </span>
            </div>

            <!-- UPI Badge -->
            <div class="h-7 px-2.5 bg-[#0F1626] border border-[#24314A] rounded-md flex items-center justify-center gap-1 shadow-xs" title="UPI Instant Payments Accepted">
              <span class="material-symbols-outlined text-[#10B981] text-[14px]">account_balance</span>
              <span class="font-sans text-[11px] font-extrabold tracking-wider text-white">
                UPI
              </span>
            </div>

            <!-- Netbanking Badge -->
            <div class="h-7 px-2.5 bg-[#0F1626] border border-[#24314A] rounded-md flex items-center justify-center gap-1 shadow-xs" title="50+ Netbanking Banks Accepted">
              <span class="material-symbols-outlined text-[#38BDF8] text-[14px]">domain</span>
              <span class="font-sans text-[11px] font-semibold text-slate-200">
                Netbanking
              </span>
            </div>

            <!-- Amex Badge -->
            <div class="h-7 px-2.5 bg-[#0F1626] border border-[#24314A] rounded-md flex items-center justify-center shadow-xs" title="American Express Accepted">
              <span class="font-sans text-[11px] font-black tracking-wider text-[#0284C7]">
                AMEX
              </span>
            </div>

            <!-- SSL Checkout Indicator -->
            <div class="h-7 px-2.5 bg-[#0F1626] border border-emerald-500/40 rounded-md flex items-center justify-center gap-1 text-emerald-400 text-[11px] font-code font-bold shadow-xs">
              <span class="material-symbols-outlined text-[14px]">lock</span>
              <span>SSL SECURE</span>
            </div>

          </div>

        </div>

      </div>
    </footer>
  `;
}
