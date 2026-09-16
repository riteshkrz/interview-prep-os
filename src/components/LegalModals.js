/**
 * Legal Policies & Modal Viewer for Interview Prep OS
 * Compliant with Razorpay, Stripe, Cashfree, and international SaaS / digital goods standards.
 */

import { CONFIG } from '../config.js';
import { renderHeader } from './Header.js';
import { renderFooter } from './Footer.js';

export const LEGAL_POLICIES = {
  terms: {
    id: 'terms',
    title: 'Terms & Conditions',
    badge: 'Agreement',
    icon: 'gavel',
    lastUpdated: 'September 16, 2026',
    content: `
      <h3>1. Acceptance of Terms</h3>
      <p>
        By accessing or purchasing access to <strong>${CONFIG.TITLE}</strong> (operated by <strong>${CONFIG.LEGAL_ENTITY_NAME}</strong>), you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
      </p>

      <h3>2. Digital Single-User License</h3>
      <p>
        Upon successful payment of the one-time access fee, ${CONFIG.LEGAL_ENTITY_NAME} grants you a non-exclusive, non-transferable, revocable single-user license to access the curriculum, dynamic databases, system design blueprints, and spaced repetition tracking tools. You agree that:
      </p>
      <ul>
        <li>You will not reproduce, redistribute, resell, duplicate, or publicly post the proprietary curriculum, system design blueprints, code solutions, or study materials.</li>
        <li>Your account credentials and private access pass are strictly for personal use and may not be shared with third parties or co-workers.</li>
        <li>Bulk sharing or credential sharing triggers automated fraud protection and may lead to immediate account termination without refund.</li>
      </ul>

      <h3>3. Educational Disclaimer & Third-Party Trademarks</h3>
      <p>
        ${CONFIG.TRADEMARK_DISCLAIMER}
      </p>
      <p>
        The materials and practice problems are provided for self-paced interview preparation and education only. We do not guarantee employment, promotion, salary outcomes, or specific hiring decisions at any company.
      </p>

      <h3>4. Platform Availability & Lifetime Access</h3>
      <p>
        "Lifetime Access" refers to the operational lifetime of the <em>${CONFIG.TITLE}</em> platform. We commit to maintaining access, cloud synchronization, and ongoing curriculum updates. Scheduled maintenance or unavoidable upstream hosting outages will be communicated in advance whenever feasible.
      </p>

      <h3>5. Limitation of Liability</h3>
      <p>
        In no event shall ${CONFIG.LEGAL_ENTITY_NAME}, its founders, or affiliates be liable for any indirect, incidental, consequential, special, or punitive damages arising out of your access to or inability to access the platform, even if advised of the possibility of such damages. Our maximum liability shall not exceed the amount paid by you for the product.
      </p>

      <h3>6. Governing Law & Jurisdiction</h3>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of India. Any legal dispute or proceeding arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
      </p>
    `
  },

  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    badge: 'Security',
    icon: 'verified_user',
    lastUpdated: 'September 16, 2026',
    content: `
      <h3>1. Information We Collect</h3>
      <p>
        We value your privacy and collect only the minimal data required to provision your account, synchronize your interview preparation progress, and verify transactions:
      </p>
      <ul>
        <li><strong>Account Information:</strong> Your email address and optional display name provided during checkout or account sign-up.</li>
        <li><strong>Preparation Metrics:</strong> Solved problem statuses, confidence scores, custom notes, checklist completion, and spaced repetition review schedules stored in encrypted browser storage and synced to cloud databases.</li>
        <li><strong>Transactional Metadata:</strong> Payment confirmation ID, order timestamp, and payment gateway reference number. <em>Note: We never store or process raw credit/debit card numbers, UPI PINs, or netbanking passwords on our servers. All payments are processed through PCI-DSS Level-1 certified payment gateways.</em></li>
      </ul>

      <h3>2. Purpose of Data Processing</h3>
      <p>
        Your data is processed strictly for:
      </p>
      <ul>
        <li>Provisioning your lifetime dashboard access and authentication tokens.</li>
        <li>Syncing study state across multiple devices via Supabase cloud storage.</li>
        <li>Sending essential transactional emails (e.g. order confirmation, access pass PIN, and system recovery notices).</li>
        <li>Detecting and preventing unauthorized access or abusive credential sharing.</li>
      </ul>

      <h3>3. Data Protection & Encryption</h3>
      <p>
        All data transmitted between your browser and our servers is secured using Industry-standard Transport Layer Security (TLS 1.3) with 256-bit encryption. Cloud-stored data is protected with AES-256 database-level encryption and strict Row-Level Security (RLS) policies ensuring users can only read and write their own records.
      </p>

      <h3>4. Third-Party Service Providers</h3>
      <p>
        We partner exclusively with trusted, SOC-2 and ISO-27001 compliant infrastructure providers:
      </p>
      <ul>
        <li><strong>Payment Processors (Razorpay / Stripe):</strong> For secure, PCI-compliant payment handling.</li>
        <li><strong>Database & Auth (Supabase):</strong> For secure authentication and synchronized PostgreSQL database storage.</li>
      </ul>
      <p>We do not sell, rent, or trade your personal data to advertisers, recruiters, or data brokers under any circumstances.</p>

      <h3>5. Your Rights & Data Deletion</h3>
      <p>
        You retain full ownership of your data. You may at any time request an export of your saved study data or permanent deletion of your account by contacting us at <a href="mailto:${CONFIG.SUPPORT_EMAIL}" class="text-cyan-400 underline">${CONFIG.SUPPORT_EMAIL}</a>. Account deletion requests are fulfilled within 48 hours.
      </p>
    `
  },

  refund: {
    id: 'refund',
    title: 'Refund & Cancellation Policy',
    badge: 'Protection',
    icon: 'currency_exchange',
    lastUpdated: 'September 16, 2026',
    content: `
      <h3>1. 7-Day Money-Back Guarantee</h3>
      <p>
        We want you to be completely confident in your preparation. If you purchase <strong>${CONFIG.TITLE}</strong> and discover within <strong>7 days of purchase</strong> that the curriculum and interactive engine do not meet your expectations, you are eligible for a 100% full refund — no hassle, no questions asked.
      </p>

      <h3>2. Refund Eligibility Guidelines</h3>
      <p>
        To qualify for a prompt refund:
      </p>
      <ul>
        <li>The refund request must be submitted via email within 7 calendar days of your original purchase timestamp.</li>
        <li>You must provide the email address used during checkout and your payment transaction ID (provided in your invoice or gateway receipt).</li>
      </ul>

      <h3>3. How to Request a Refund</h3>
      <p>
        Simply send an email to <a href="mailto:${CONFIG.SUPPORT_EMAIL}" class="text-cyan-400 underline">${CONFIG.SUPPORT_EMAIL}</a> with:
      </p>
      <ul>
        <li><strong>Subject:</strong> Refund Request - [Your Order/Payment ID]</li>
        <li><strong>Body:</strong> The email address used during payment and an optional note explaining how we could improve.</li>
      </ul>

      <h3>4. Processing Timeline & Cancellation</h3>
      <p>
        Our support team reviews and approves eligible refund requests within <strong>24 to 48 business hours</strong>. Once approved:
      </p>
      <ul>
        <li>The refund is initiated directly via our payment gateway (Razorpay/Stripe) to your original payment method (Credit/Debit Card, UPI, or Netbanking).</li>
        <li>Depending on your banking institution, funds will reflect in your account within <strong>5 to 7 business days</strong>.</li>
        <li>Upon issuance of a refund, the digital access license and cloud sync associated with your account will be revoked.</li>
      </ul>
    `
  },

  shipping: {
    id: 'shipping',
    title: 'Shipping & Delivery Policy',
    badge: 'Fulfillment',
    icon: 'local_shipping',
    lastUpdated: 'September 16, 2026',
    content: `
      <h3>1. Digital Fulfillment Notice</h3>
      <p>
        <strong>${CONFIG.TITLE} is an exclusively digital software product and online educational platform.</strong> No physical goods, packages, CDs, or books will be shipped to your postal address. All features are delivered electronically through our secure web platform.
      </p>

      <h3>2. Instant Digital Delivery</h3>
      <div class="p-4 my-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
        <span class="material-symbols-outlined align-middle text-[18px] mr-1">bolt</span>
        <strong>Digital delivery policy explicitly states:</strong> “Instant access via dashboard and email immediately upon successful payment.”
      </div>
      <p>
        Immediately after your transaction is confirmed by our payment gateway:
      </p>
      <ul>
        <li>Your browser is automatically redirected to the authenticated <strong>User Dashboard</strong> with lifetime privileges active.</li>
        <li>An automated receipt and digital access credentials email is dispatched to the email address provided during checkout within <strong>60 seconds</strong>.</li>
      </ul>

      <h3>3. Shipping Charges</h3>
      <p>
        Because all products are delivered electronically worldwide, <strong>shipping charges are ₹0.00 (Free)</strong> for all customers across all regions.
      </p>

      <h3>4. Delivery Support & Troubleshooting</h3>
      <p>
        If you have completed your payment but have not received your confirmation email within 5 minutes (due to spam filters or network latency):
      </p>
      <ul>
        <li>Check your Email Spam/Junk or Promotions folder for an email from <code>${CONFIG.SUPPORT_EMAIL}</code>.</li>
        <li>You can directly access the platform by clicking <strong>User Dashboard</strong> at the top right of this site and signing in with your checkout email.</li>
        <li>Contact our dedicated fulfillment support desk at <a href="mailto:${CONFIG.SUPPORT_EMAIL}" class="text-cyan-400 underline">${CONFIG.SUPPORT_EMAIL}</a> with your payment screenshot or transaction ID. We resolve delivery inquiries within <strong>24 hours</strong>.</li>
      </ul>
    `
  },

  contact: {
    id: 'contact',
    title: 'Contact Us & Grievance Redressal',
    badge: 'Support',
    icon: 'support_agent',
    lastUpdated: 'September 16, 2026',
    content: `
      <h3>1. Registered Business Details</h3>
      <p>
        For payment gateway verification, billing queries, customer support, or legal correspondence, please refer to our official merchant details:
      </p>
      <div class="bg-[#0F1626] border border-[#24314A] rounded-xl p-4 my-4 flex flex-col gap-3">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-cyan-400 text-[20px] shrink-0 mt-0.5">business</span>
          <div>
            <div class="text-[11px] font-code text-slate-400 uppercase tracking-wider">Legal Entity Name</div>
            <div class="text-[14px] font-bold text-white">${CONFIG.LEGAL_ENTITY_NAME}</div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-cyan-400 text-[20px] shrink-0 mt-0.5">location_on</span>
          <div>
            <div class="text-[11px] font-code text-slate-400 uppercase tracking-wider">Registered Office Address</div>
            <div class="text-[13px] text-slate-200 leading-relaxed">${CONFIG.BUSINESS_ADDRESS}</div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-cyan-400 text-[20px] shrink-0 mt-0.5">mail</span>
          <div>
            <div class="text-[11px] font-code text-slate-400 uppercase tracking-wider">Official Support Email</div>
            <a href="mailto:${CONFIG.SUPPORT_EMAIL}" class="text-[13px] font-medium text-cyan-300 hover:underline">${CONFIG.SUPPORT_EMAIL}</a>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-cyan-400 text-[20px] shrink-0 mt-0.5">schedule</span>
          <div>
            <div class="text-[11px] font-code text-slate-400 uppercase tracking-wider">Operational Hours & SLA</div>
            <div class="text-[13px] text-slate-200">${CONFIG.SUPPORT_HOURS}</div>
            <div class="text-[11px] text-emerald-400 font-code font-semibold mt-0.5">SLA: ${CONFIG.SUPPORT_SLA}</div>
          </div>
        </div>
      </div>

      <h3>2. Grievance Redressal Mechanism</h3>
      <p>
        In accordance with the Information Technology Act 2000 and Consumer Protection (E-Commerce) Rules, any grievances or concerns regarding billing, access disruption, or privacy may be directed to our designated Grievance Officer:
      </p>
      <ul>
        <li><strong>Attention:</strong> Grievance Redressal Officer</li>
        <li><strong>Entity:</strong> ${CONFIG.LEGAL_ENTITY_NAME}</li>
        <li><strong>Email:</strong> <a href="mailto:${CONFIG.SUPPORT_EMAIL}" class="text-cyan-400 underline">${CONFIG.SUPPORT_EMAIL}</a> (Subject: "Grievance Officer - Priority")</li>
        <li><strong>Acknowledgement:</strong> Within 24 hours of receipt.</li>
        <li><strong>Resolution:</strong> Within 15 business days.</li>
      </ul>
    `
  }
};

/**
 * Render the Accessible Modal Viewer
 */
export function renderLegalModal() {
  return `
    <div id="legal-policy-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs transition-opacity" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
      <div class="bg-[#0B0F19] border border-[#24314A] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl text-[#F8FAFC] relative overflow-hidden animate-fadeIn">
        
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-[#1E293B] flex items-center justify-between gap-3 bg-[#0F1626]">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <span id="legal-modal-icon" class="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 id="legal-modal-title" class="font-sans text-[16px] sm:text-[18px] font-bold text-white tracking-tight">Legal Document</h3>
                <span id="legal-modal-badge" class="px-2 py-0.5 rounded text-[10px] font-code font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Official</span>
              </div>
              <p id="legal-modal-date" class="text-[11px] font-code text-slate-400">Last updated: September 16, 2026</p>
            </div>
          </div>

          <button id="close-legal-modal-btn" aria-label="Close legal modal" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182238] transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Tab Navigation Bar -->
        <div class="px-4 py-2 bg-[#090D16] border-b border-[#1E293B] flex items-center gap-2 overflow-x-auto no-scrollbar text-[12px] font-code">
          <button class="legal-tab-btn px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer" data-tab="terms">Terms</button>
          <button class="legal-tab-btn px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer" data-tab="privacy">Privacy</button>
          <button class="legal-tab-btn px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer" data-tab="refund">Refund Policy</button>
          <button class="legal-tab-btn px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer" data-tab="shipping">Shipping &amp; Delivery</button>
          <button class="legal-tab-btn px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer" data-tab="contact">Contact Us</button>
        </div>

        <!-- Scrollable Document Body -->
        <div id="legal-modal-body" class="p-5 sm:p-6 overflow-y-auto legal-prose text-[13.5px] text-slate-300 leading-relaxed flex flex-col gap-4">
          <!-- Content dynamically injected -->
        </div>

        <!-- Modal Footer -->
        <div class="p-3.5 sm:p-4 border-t border-[#1E293B] bg-[#0F1626] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
          <div class="flex items-center gap-2 text-slate-400 font-code text-[11px]">
            <span class="material-symbols-outlined text-emerald-400 text-[16px]">lock</span>
            <span>256-Bit SSL Encrypted • Payment Gateway Compliant</span>
          </div>
          <button id="close-legal-modal-bottom-btn" class="px-4 py-1.5 rounded-lg bg-[#182238] border border-[#24314A] hover:bg-[#202C45] text-white text-[12px] font-medium transition-all cursor-pointer">
            Close Document
          </button>
        </div>

      </div>
    </div>
  `;
}

/**
 * Open the Legal Policy Modal with the requested policy active
 */
export function openLegalModal(policyKey = 'terms') {
  const modal = document.getElementById('legal-policy-modal');
  if (!modal) return;

  const key = LEGAL_POLICIES[policyKey] ? policyKey : 'terms';
  const policy = LEGAL_POLICIES[key];

  // Populate UI
  const titleEl = document.getElementById('legal-modal-title');
  const badgeEl = document.getElementById('legal-modal-badge');
  const iconEl = document.getElementById('legal-modal-icon');
  const dateEl = document.getElementById('legal-modal-date');
  const bodyEl = document.getElementById('legal-modal-body');

  if (titleEl) titleEl.textContent = policy.title;
  if (badgeEl) badgeEl.textContent = policy.badge;
  if (iconEl) iconEl.textContent = policy.icon;
  if (dateEl) dateEl.textContent = `Last updated: ${policy.lastUpdated}`;
  if (bodyEl) {
    bodyEl.innerHTML = policy.content;
    bodyEl.scrollTop = 0;
  }

  // Update tabs highlight
  document.querySelectorAll('.legal-tab-btn').forEach(btn => {
    const isCurrent = btn.dataset.tab === key;
    if (isCurrent) {
      btn.className = 'legal-tab-btn px-3 py-1.5 rounded-md font-semibold text-cyan-300 bg-[#182238] border border-cyan-500/40 whitespace-nowrap cursor-pointer';
    } else {
      btn.className = 'legal-tab-btn px-3 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#141C2E] border border-transparent whitespace-nowrap cursor-pointer';
    }
  });

  // Display modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

/**
 * Close the Legal Policy Modal
 */
export function closeLegalModal() {
  const modal = document.getElementById('legal-policy-modal');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';

  // Clean URL hash if it was a legal route without reload
  const legalRoutes = ['#terms', '#/terms', '#privacy', '#/privacy', '#refund', '#/refund', '#shipping', '#/shipping', '#contact', '#/contact'];
  if (legalRoutes.includes(window.location.hash)) {
    history.replaceState(null, '', window.location.pathname);
  }
}

/**
 * Wire up interactive listeners for modal close, tab switching, and light dismiss
 */
export function setupLegalModalListeners() {
  const modal = document.getElementById('legal-policy-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('close-legal-modal-btn');
  const bottomCloseBtn = document.getElementById('close-legal-modal-bottom-btn');

  if (closeBtn) closeBtn.onclick = closeLegalModal;
  if (bottomCloseBtn) bottomCloseBtn.onclick = closeLegalModal;

  // Tab switcher
  document.querySelectorAll('.legal-tab-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      openLegalModal(btn.dataset.tab);
    };
  });

  // Light dismiss on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeLegalModal();
    }
  };

  // Keyboard Escape listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeLegalModal();
    }
  });

  // Global click delegator for links with data-legal-modal
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-legal-modal]');
    if (trigger) {
      e.preventDefault();
      const policy = trigger.getAttribute('data-legal-modal');
      openLegalModal(policy);
    }
  });
}

/**
 * Render a dedicated full-page standalone view for direct URL access (e.g. #/terms, #/privacy)
 */
export function renderLegalPage(policyKey = 'terms') {
  const key = LEGAL_POLICIES[policyKey] ? policyKey : 'terms';
  const policy = LEGAL_POLICIES[key];

  return `
    ${renderHeader()}
    <main class="w-full bg-[#0B0F19] text-[#CBD5E1] min-h-screen pt-24 pb-16 px-4 md:px-6">
      <div class="max-w-4xl mx-auto flex flex-col gap-8">
        
        <!-- Top breadcrumbs & Back button -->
        <div class="flex items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
          <a href="#" class="inline-flex items-center gap-1.5 text-[13px] font-code text-cyan-400 hover:text-cyan-300 transition-colors">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Home</span>
          </a>
          <span class="text-[12px] font-code text-slate-500">Legal Compliance Center</span>
        </div>

        <!-- Policy Navigation Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1E293B] text-[12.5px] font-code no-scrollbar">
          <a href="#/terms" class="px-3.5 py-1.5 rounded-lg transition-all ${key === 'terms' ? 'bg-[#182238] text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'}">Terms</a>
          <a href="#/privacy" class="px-3.5 py-1.5 rounded-lg transition-all ${key === 'privacy' ? 'bg-[#182238] text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'}">Privacy</a>
          <a href="#/refund" class="px-3.5 py-1.5 rounded-lg transition-all ${key === 'refund' ? 'bg-[#182238] text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'}">Refund &amp; Cancellation</a>
          <a href="#/shipping" class="px-3.5 py-1.5 rounded-lg transition-all ${key === 'shipping' ? 'bg-[#182238] text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'}">Shipping &amp; Delivery</a>
          <a href="#/contact" class="px-3.5 py-1.5 rounded-lg transition-all ${key === 'contact' ? 'bg-[#182238] text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'}">Contact Us</a>
        </div>

        <!-- Document Card -->
        <div class="bg-[#0F1626] border border-[#24314A] rounded-2xl p-6 md:p-10 shadow-2xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[22px]">${policy.icon}</span>
              </div>
              <div>
                <h1 class="font-sans text-[22px] md:text-[26px] font-bold text-white tracking-tight">${policy.title}</h1>
                <p class="text-[12px] font-code text-slate-400 mt-0.5">Last updated: ${policy.lastUpdated}</p>
              </div>
            </div>
            <span class="self-start sm:self-auto px-3 py-1 rounded-md text-[11px] font-code font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              ${policy.badge}
            </span>
          </div>

          <!-- Document Text -->
          <div class="legal-prose text-[14px] text-slate-300 leading-relaxed flex flex-col gap-4 mt-6">
            ${policy.content}
          </div>
        </div>

        <!-- Trust & Security Strip -->
        <div class="p-4 rounded-xl bg-[#0F1626]/60 border border-[#24314A]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-400 font-code">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
            <span>Official Policy of ${CONFIG.LEGAL_ENTITY_NAME}</span>
          </div>
          <div class="flex items-center gap-2 text-slate-500">
            <span>Direct inquiries:</span>
            <a href="mailto:${CONFIG.SUPPORT_EMAIL}" class="text-cyan-400 hover:underline">${CONFIG.SUPPORT_EMAIL}</a>
          </div>
        </div>

      </div>
    </main>
    ${renderFooter()}
    ${renderLegalModal()}
  `;
}
