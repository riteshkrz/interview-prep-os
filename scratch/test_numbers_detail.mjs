import { renderNumbersToMemoriseContent } from '../src/dashboard/NumbersToMemoriseDetail.js';
import { SYSTEM_DESIGN_TOPICS_BY_DAY } from '../src/dashboard/systemDesignTopicsData.js';
import { renderTopicDetail } from '../src/dashboard/SystemDesignRoadmapView.js';

const topic = SYSTEM_DESIGN_TOPICS_BY_DAY["1"].find(t => t.id === '0.4');
console.log('Topic found:', topic ? topic.title : 'NOT FOUND');

const html = renderNumbersToMemoriseContent(topic);
console.log('Render direct length:', html.length);

const roadmapHtml = renderTopicDetail(topic);
console.log('Render via roadmap length:', roadmapHtml.length);

// Verify key elements from Page 8
const checks = [
  "0.4 Numbers Every Engineer Should Memorise",
  "You cannot reason about a design without knowing the cost of each hop",
  "LATENCY AT A GLANCE",
  "L1 cache reference",
  "~1 ns",
  "Main memory reference",
  "~100 ns",
  "Compress 1 KB (Snappy)",
  "Send 1 KB over 1 Gbps network",
  "SSD random read (4 KB)",
  "Read 1 MB sequentially from memory",
  "Round trip within a datacenter",
  "Read 1 MB sequentially from SSD",
  "Disk seek (HDD)",
  "DNS lookup",
  "Round trip CA → Netherlands",
  "1 M/day",
  "≈ 12 QPS",
  "1 B/day",
  "≈ 12 K QPS",
  "1 KB × 10 K QPS",
  "≈ 80 MBPS",
  "AVAILABILITY BUDGETS",
  "99% (&quot;two nines&quot;)",
  "99.9%",
  "99.99%",
  "99.999%",
  "WATCH OUT",
  "99.9%⁵ ≈ 99.5%",
  "KEY INTERVIEW TAKEAWAY",
  "A cross-region round trip is ~150 ms"
];

let allPassed = true;
for (const check of checks) {
  if (!html.includes(check)) {
    console.error(`MISSING IN HTML: "${check}"`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('SUCCESS: All 31 checks passed perfectly!');
} else {
  process.exit(1);
}
