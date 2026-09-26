/**
 * 45-Day Interview Prep OS - Buy & Access Pass Modal
 * Allows users to provide their email upon clicking 'Buy', generates a 4-digit random PIN,
 * and seamlessly transitions them to the Sign Up flow with pre-filled credentials.
 */

import { accessService } from '../services/accessService.js';
import { CONFIG } from '../config.js';

export function renderBuyAccessModal(options = {}) {
  const productName = options.productName || '45-Day Interview Prep OS';
  const productSub = options.productSub || 'Complete DSA &amp; System Design System';
  const price = options.price || CONFIG.PRICE;
  const originalPrice = options.originalPrice || CONFIG.ORIGINAL_PRICE;
  const savings = options.savings || CONFIG.SAVINGS;

  return `
    <div id="buy-access-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div class="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/[0.08] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl flex flex-col gap-5 text-[#0F172A] dark:text-[#F8FAFC] relative overflow-hidden transition-colors">
        
        <!-- Ambient subtle glow inside modal -->
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#4F46E5]/10 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Close Button -->
        <button id="close-buy-modal-btn" class="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>

        <!-- STATE 1: Enter Email Form Container -->
        <div id="buy-modal-step-1" class="flex flex-col gap-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-[#4F46E5]/20 border border-[#BAE6FD] dark:border-[#4F46E5]/40 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
            </div>
            <div>
              <h3 class="font-sans text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Get Instant Access Pass</h3>
              <p class="text-[12px] text-[#64748B] dark:text-slate-400">One-time payment • Lifetime updates • Cloud sync</p>
            </div>
          </div>

          <!-- Product & Pricing Preview Card -->
          <div class="p-3.5 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/[0.08] rounded-xl flex items-center justify-between">
            <div>
              <span class="text-[13px] font-semibold text-[#0F172A] dark:text-white block">${productName}</span>
              <span class="text-[11px] text-[#64748B] dark:text-slate-400">${productSub}</span>
            </div>
            <div class="text-right">
              <div class="flex items-baseline gap-1.5 justify-end">
                <span class="font-sans text-[18px] font-extrabold text-[#0F172A] dark:text-white">${price}</span>
                <span class="font-sans text-[11px] text-[#94A3B8] dark:text-slate-500 line-through">${originalPrice}</span>
              </div>
              <span class="text-[10px] font-code text-[#059669] dark:text-emerald-400 font-bold uppercase tracking-wider">${savings}</span>
            </div>
          </div>

          <!-- Buy Email Form -->
          <form id="buy-email-form" class="flex flex-col gap-3.5">
            <div>
              <label for="buy-email-input" class="block font-code text-[11px] uppercase tracking-wider text-[#475569] dark:text-slate-400 font-semibold mb-1.5">
                Enter Your Email Address
              </label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#64748B] dark:text-slate-500">mail</span>
                <input
                  id="buy-email-input"
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  class="w-full bg-[#FFFFFF] dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-lg pl-10 pr-3 py-2.5 text-[13px] text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                />
              </div>
              <span class="text-[11px] text-[#64748B] dark:text-slate-500 mt-1 block">Your 4-digit activation PIN will be tied to this email.</span>
            </div>

            <button
              type="submit"
              id="confirm-buy-btn"
              class="w-full py-3 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] font-semibold text-[13px] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#4F46E5]/30 cursor-pointer"
            >
              <span>Get Access &amp; Generate PIN</span>
              <span class="font-code text-[12px] opacity-90">→</span>
            </button>
          </form>

          <div class="flex items-center justify-center gap-1.5 text-[11px] text-[#475569] dark:text-slate-400 font-sans text-center">
            <span class="material-symbols-outlined text-[14px] text-[#059669] dark:text-emerald-400">verified_user</span>
            <span>Instant activation • 30-day zero-risk money-back guarantee</span>
          </div>
        </div>

        <!-- STATE 2: PIN Generated Success Container (Hidden initially) -->
        <div id="buy-modal-step-2" class="hidden flex flex-col gap-4 text-center">
          <div class="w-12 h-12 rounded-full bg-[#ECFDF5] dark:bg-emerald-500/20 border border-[#A7F3D0] dark:border-emerald-500/40 text-[#059669] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
            <span class="material-symbols-outlined text-[26px]">celebration</span>
          </div>

          <div>
            <h3 class="font-sans text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Access Pass Generated!</h3>
            <p class="text-[12px] text-[#475569] dark:text-slate-400 mt-0.5">
              Here is your <span class="text-[#0F172A] dark:text-white font-semibold">4-Digit Activation PIN</span> for <br/>
              <span id="pin-registered-email" class="text-[#0284C7] dark:text-[#38BDF8] font-code text-[11.5px] font-semibold"></span>
            </p>
          </div>

          <!-- 4-Digit Display Box -->
          <div class="py-3 px-4 bg-[#F8FAFC] dark:bg-[#141C2E] border border-[#E2E8F0] dark:border-[#24314A] rounded-xl flex flex-col items-center gap-2">
            <span class="text-[10.5px] font-code uppercase tracking-wider text-[#64748B] dark:text-slate-400">Your Activation PIN</span>
            <div id="pin-digits-container" class="flex items-center justify-center gap-2.5">
              <!-- Rendered via JS -->
            </div>
            <button id="copy-pin-btn" class="mt-1 text-[11px] font-code text-[#0284C7] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[13px]">content_copy</span>
              <span id="copy-pin-text">Copy PIN</span>
            </button>
          </div>

          <div class="p-3 bg-[#ECFDF5] dark:bg-[#0B0F19] border border-[#A7F3D0] dark:border-[#24314A] rounded-lg text-[11.5px] text-[#065F46] dark:text-slate-300 text-left">
            <span class="text-[#059669] dark:text-[#10B981] font-semibold block mb-0.5">Next Step:</span>
            Click below to create your account. Use this same email address, enter your 4-digit PIN, and set your password to unlock the workspace!
          </div>

          <button
            id="continue-to-signup-btn"
            class="w-full py-3 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[14px] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#4F46E5]/30 cursor-pointer"
          >
            <span>Continue to Sign Up with PIN</span>
            <span class="font-mono text-[13px]">→</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

/**
 * Open and mount the BuyAccessModal into #modal-mount or document body
 */
export function openBuyAccessModal(options = {}) {
  let mount = document.getElementById('modal-mount');
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'modal-mount';
    document.body.appendChild(mount);
  }

  mount.innerHTML = renderBuyAccessModal(options);
  attachBuyAccessModalListeners();
}

function attachBuyAccessModalListeners() {
  const mount = document.getElementById('modal-mount');
  const closeBtn = document.getElementById('close-buy-modal-btn');
  const modalEl = document.getElementById('buy-access-modal');
  const form = document.getElementById('buy-email-form');
  const step1 = document.getElementById('buy-modal-step-1');
  const step2 = document.getElementById('buy-modal-step-2');

  let generatedPin = '';
  let buyerEmail = '';

  const close = () => {
    if (mount) mount.innerHTML = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modalEl) {
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) close();
    });
  }

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);

  // Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('buy-email-input');
      buyerEmail = emailInput?.value.trim().toLowerCase();
      if (!buyerEmail) return;

      const submitBtn = document.getElementById('confirm-buy-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Generating Activation PIN...';
      }

      // Generate random 4-digit PIN
      generatedPin = accessService.generatePin();

      // Register PIN for this email
      await accessService.createAccessPin(buyerEmail, generatedPin);

      // Render State 2 (Success PIN View)
      if (step1 && step2) {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');

        const emailDisplay = document.getElementById('pin-registered-email');
        if (emailDisplay) emailDisplay.textContent = buyerEmail;

        const pinContainer = document.getElementById('pin-digits-container');
        if (pinContainer) {
          pinContainer.innerHTML = generatedPin.split('').map(digit => `
            <div class="w-11 h-13 rounded-lg bg-[#0A0E17] border border-[#6366F1]/60 text-[#38BDF8] font-code text-[24px] font-bold flex items-center justify-center shadow-inner select-all">
              ${digit}
            </div>
          `).join('');
        }
      }

      // Copy PIN listener
      const copyBtn = document.getElementById('copy-pin-btn');
      const copyText = document.getElementById('copy-pin-text');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(generatedPin);
          if (copyText) copyText.textContent = 'Copied!';
          setTimeout(() => {
            if (copyText) copyText.textContent = 'Copy PIN';
          }, 2000);
        });
      }

      // Continue to Sign Up listener
      const continueBtn = document.getElementById('continue-to-signup-btn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          close();
          // Navigate to #/signup with query parameters
          window.location.hash = `#/signup?email=${encodeURIComponent(buyerEmail)}&pin=${encodeURIComponent(generatedPin)}`;
        });
      }
    });
  }
}
