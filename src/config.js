/**
 * Central Configuration for 45-Day Interview Prep OS
 * Single source of truth for external checkout links, pricing, and site metadata.
 */

export const CONFIG = {
  // Configurable external checkout URL (e.g. Razorpay, Stripe, LemonSqueezy)
  CHECKOUT_URL: 'https://checkout.interviewprepos.com/45-day-interview-prep-os',

  // Pricing info
  PRICE: '₹499',
  ORIGINAL_PRICE: '₹1,999',
  SAVINGS: 'SAVE ₹1,500',
  DISCOUNT_LABEL: 'MOST POPULAR • 75% OFF INTRO',
  TOTAL_DAYS: 45,

  // Site branding & metadata
  TITLE: '45-Day Interview Prep OS',
  TAGLINE: 'Prepare for Senior-Level Interviews in 45 Days — Without Burning Out.',
  SUBTITLE: 'A practical interview-prep system that helps working software engineers organize DSA, System Design, revision, and daily preparation in one structured workspace.',
  VALUE_PROP: '45-Day structured interview preparation platform for software engineers targeting L5/L6 roles.',
  
  // Merchant & Compliance Details for Payment Gateway Approval
  LEGAL_ENTITY_NAME: 'Interview Prep OS Tech LLP',
  BUSINESS_ADDRESS: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India',
  SUPPORT_EMAIL: 'support@interviewprepos.com',
  SUPPORT_HOURS: 'Mon - Fri, 9:00 AM - 6:00 PM IST',
  SUPPORT_SLA: 'Response within 24 hours',
  TRADEMARK_DISCLAIMER: 'Interview Prep OS is an independent preparation platform and is not affiliated with, sponsored by, or endorsed by Google, Meta, Amazon, Apple, Netflix, or LeetCode. All trademarks belong to their respective owners.',

  // Navigation Links
  NAV_LINKS: [
    { label: "What's Inside", href: "#whats-inside" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Who It's For", href: "#who-its-for" },
  ]
};
