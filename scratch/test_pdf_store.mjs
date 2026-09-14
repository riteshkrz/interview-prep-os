import { PDF_PRODUCTS, renderPdfStore, renderPdfCheckoutModal } from '../src/dashboard/PdfStore.js';

console.log('--- Testing PDF Products & Pricing ---');
console.log('Total Products:', PDF_PRODUCTS.length);

const expectedPrices = {
  'bundle-system-design': 249,
  'pdf-sd-vol-1': 149,
  'pdf-sd-vol-2': 149,
  'pdf-opex-cheatsheet': 149,
  'pdf-java-cheatsheet': 99,
  'pdf-springboot-cheatsheet': 99,
  'pdf-behavioral-cheatsheet': 99,
};

let allMatched = true;
for (const [id, expectedPrice] of Object.entries(expectedPrices)) {
  const prod = PDF_PRODUCTS.find(p => p.id === id);
  if (!prod) {
    console.error(`MISSING PRODUCT: ${id}`);
    allMatched = false;
  } else if (prod.price !== expectedPrice) {
    console.error(`PRICE MISMATCH for ${id}: expected ${expectedPrice}, got ${prod.price}`);
    allMatched = false;
  } else {
    console.log(`✓ ${prod.title}: ₹${prod.price} (original: ₹${prod.originalPrice}, discount: ${prod.discount || 'Bundle'})`);
  }
}

if (!allMatched) {
  process.exit(1);
}

console.log('\n--- Testing Storefront HTML Rendering ---');
const storeHtml = renderPdfStore();
console.log('Store HTML character length:', storeHtml.length);
if (!storeHtml.includes('Interview Cheat Sheets &amp; Guides')) {
  console.error('Store HTML missing title');
  process.exit(1);
}
if (!storeHtml.includes('₹249') || !storeHtml.includes('₹149') || !storeHtml.includes('₹99')) {
  console.error('Store HTML missing prices');
  process.exit(1);
}

console.log('\n--- Testing Modal HTML Rendering for each product ---');
for (const prod of PDF_PRODUCTS) {
  const modalHtml = renderPdfCheckoutModal(prod);
  if (!modalHtml.includes(prod.title) || !modalHtml.includes(`₹${prod.price}`)) {
    console.error(`Modal HTML issue for ${prod.id}`);
    process.exit(1);
  }
}

console.log('All PDF Store & Product tests PASSED!');
