/**
 * Test script to verify Footer Compliance, Payment Gateway Badges, and Legal Policies
 */

import { renderFooter } from '../src/components/Footer.js';
import { LEGAL_POLICIES, renderLegalModal, renderLegalPage } from '../src/components/LegalModals.js';
import { CONFIG } from '../src/config.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- Testing Footer Component Render ---');
const footerHtml = renderFooter();

// 1. Check 4 Distinct Columns
assert(footerHtml.includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-4'), 'Footer has 4-column responsive grid');

// 2. Column 1: Brand, Value Prop & SSL Badge
assert(footerHtml.includes('/logo.svg'), 'Column 1 has official logo');
assert(footerHtml.includes(CONFIG.TITLE), 'Column 1 has brand title');
assert(footerHtml.includes(CONFIG.VALUE_PROP), 'Column 1 has 1-line value proposition');
assert(footerHtml.includes('256-Bit SSL Encrypted'), 'Column 1 has 256-bit SSL encrypted trust badge');

// 3. Column 2: Curriculum & Navigation links
assert(footerHtml.includes('href="#whats-inside"'), 'Column 2 has #whats-inside');
assert(footerHtml.includes('href="#how-it-works"'), 'Column 2 has #how-it-works (45-Day Curriculum)');
assert(footerHtml.includes('href="#/dashboard"') && footerHtml.includes('100 Core DSA Problems'), 'Column 2 has 100 Core DSA link');
assert(footerHtml.includes('20 System Design Specs'), 'Column 2 has 20 System Design Specs link');
assert(footerHtml.includes('href="#pricing"'), 'Column 2 has Pricing link');
assert(footerHtml.includes('Customer Login / Dashboard'), 'Column 2 has Customer Login / Dashboard link');

// 4. Column 3: Legal Policies & Non-affiliation Disclaimer
assert(footerHtml.includes('data-legal-modal="terms"'), 'Column 3 has Terms link with legal modal trigger');
assert(footerHtml.includes('data-legal-modal="privacy"'), 'Column 3 has Privacy link with legal modal trigger');
assert(footerHtml.includes('data-legal-modal="refund"'), 'Column 3 has Refund link with legal modal trigger');
assert(footerHtml.includes('data-legal-modal="shipping"'), 'Column 3 has Shipping link with legal modal trigger');
assert(footerHtml.includes('data-legal-modal="contact"'), 'Column 3 has Contact link with legal modal trigger');
assert(
  footerHtml.includes('Google') && footerHtml.includes('Meta') && footerHtml.includes('Amazon') && footerHtml.includes('LeetCode'),
  'Column 3 includes non-affiliation trademark disclaimer'
);

// 5. Column 4: Merchant Contact & Business Info
assert(footerHtml.includes(CONFIG.LEGAL_ENTITY_NAME), 'Column 4 has Registered Legal Entity Name');
assert(footerHtml.includes(CONFIG.BUSINESS_ADDRESS), 'Column 4 has Physical Business Address');
assert(footerHtml.includes(CONFIG.SUPPORT_EMAIL), 'Column 4 has Official Customer Support Email');
assert(footerHtml.includes(CONFIG.SUPPORT_HOURS), 'Column 4 has Support Working Hours');
assert(footerHtml.includes(CONFIG.SUPPORT_SLA), 'Column 4 has Support SLA');

// 6. Bottom Bar: Copyright & Payment Badges
const currentYear = new Date().getFullYear().toString();
assert(footerHtml.includes(currentYear), 'Bottom bar has dynamic current year');
assert(footerHtml.includes('Visa Accepted') || footerHtml.includes('visa'), 'Bottom bar has Visa badge');
assert(footerHtml.includes('Mastercard Accepted') || footerHtml.includes('mastercard'), 'Bottom bar has Mastercard badge');
assert(footerHtml.includes('RuPay Accepted') || footerHtml.includes('RuPay'), 'Bottom bar has RuPay badge');
assert(footerHtml.includes('UPI Instant Payments Accepted') || footerHtml.includes('UPI'), 'Bottom bar has UPI badge');
assert(footerHtml.includes('Netbanking'), 'Bottom bar has Netbanking badge');
assert(footerHtml.includes('AMEX'), 'Bottom bar has American Express badge');
assert(footerHtml.includes('SSL SECURE'), 'Bottom bar has SSL Secure Checkout indicator');

// 7. Policy Content Checks
console.log('\n--- Testing Legal Policy Content & Mandatory Clauses ---');
assert(Boolean(LEGAL_POLICIES.terms), 'Terms & Conditions policy exists');
assert(Boolean(LEGAL_POLICIES.privacy), 'Privacy policy exists');
assert(Boolean(LEGAL_POLICIES.refund), 'Refund & Cancellation policy exists');
assert(Boolean(LEGAL_POLICIES.shipping), 'Shipping & Delivery policy exists');
assert(Boolean(LEGAL_POLICIES.contact), 'Contact Us policy exists');

// Explicit requirement: “Instant access via dashboard and email immediately upon successful payment”
const shippingContent = LEGAL_POLICIES.shipping.content;
const mandatoryShippingPhrase = 'Instant access via dashboard and email immediately upon successful payment';
assert(shippingContent.includes(mandatoryShippingPhrase), `Shipping policy explicitly contains: "${mandatoryShippingPhrase}"`);

// Refund turnaround
assert(LEGAL_POLICIES.refund.content.includes('7-Day Money-Back Guarantee') || LEGAL_POLICIES.refund.content.includes('7-Day'), 'Refund policy outlines money-back terms');
assert(LEGAL_POLICIES.refund.content.includes(CONFIG.SUPPORT_EMAIL), 'Refund policy provides official support email');

// 8. Test Modal & Page Renderers
console.log('\n--- Testing Modal & Page Renderers ---');
const modalHtml = renderLegalModal();
assert(modalHtml.includes('id="legal-policy-modal"'), 'renderLegalModal produces dialog with id legal-policy-modal');
assert(modalHtml.includes('data-tab="terms"') && modalHtml.includes('data-tab="shipping"'), 'Modal contains policy navigation tabs');

const pageHtml = renderLegalPage('shipping');
assert(pageHtml.includes('Shipping &amp; Delivery') || pageHtml.includes('Shipping & Delivery'), 'renderLegalPage renders requested policy');
assert(pageHtml.includes(mandatoryShippingPhrase), 'renderLegalPage preserves mandatory shipping clause');
assert(pageHtml.includes('Back to Home'), 'renderLegalPage contains Back to Home link');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All compliance tests PASSED successfully!');
}
