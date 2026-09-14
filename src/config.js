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
  
  // Navigation Links
  NAV_LINKS: [
    { label: "What's Inside", href: "#whats-inside" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Who It's For", href: "#who-its-for" },
  ]
};
