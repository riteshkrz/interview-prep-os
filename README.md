# ⚡ Interview Prep OS (45-Day Senior / Staff FAANG Engine)

> An opinionated, local-first preparation workspace and execution engine designed for engineers targeting L5 (Senior) and L6 (Staff) roles at Tier-1 tech companies (Google, Meta, Amazon, Netflix, Uber).

![Interview Prep OS](https://img.shields.io/badge/Prep%20OS-v1.0-6366F1?style=for-the-badge&logo=target)
![Stack](https://img.shields.io/badge/Built%20With-Vite%20•%20Tailwind%20•%20Supabase-38BDF8?style=for-the-badge)
![Status](https://img.shields.io/badge/Local--First-Cloud%20Sync%20Ready-10B981?style=for-the-badge)

---

## 🎯 Overview

Preparing for high-stakes technical loops requires more than random LeetCode grinding. **Interview Prep OS** provides a structured, day-by-day roadmap that balances:
- **Algorithmic Fluency**: 100 curated, pattern-based DSA problems.
- **Distributed Systems Architecture**: 20 production-grade system design specifications.
- **Active Recall & Retention**: Spaced repetition engine using the **SM-2 algorithm** to eliminate memory decay.
- **Leadership & STAR Rubrics**: Structured frameworks for behavioral and cross-functional leadership evaluation.
- **Competency Radar**: Real-time readiness scoring calibrated against FAANG hiring bar rubrics.

---

## 🚀 Key Features

### 1. 45-Day Daily Sprint Execution
- Sequential curriculum structured into core phases:
  - **Phase 1**: Foundations & Core DSA Patterns
  - **Phase 2**: Advanced Patterns & High-Throughput Distributed Systems
  - **Phase 3**: Concurrency, Failure Domains & Large-Scale Storage
  - **Phase 4**: Mock Loops, STAR Stories & Final Calibration
- Interactive day-by-day progress tracking with estimated completion times and milestone targets.

### 2. 100 Curated Core DSA Tracker
- Master key patterns: Two Pointers, Sliding Window, Monotonic Stack, Binary Search, Trees, Graphs/Topological Sort, Heaps, and Dynamic Programming.
- Filter by topic, difficulty (Easy, Medium, Hard), and mastery status.
- Integrated stopwatch, time-to-solve benchmarks, and confidence ratings.

### 3. 20 Production System Design Specs
- Comprehensive design blueprints modeled after high-scale production systems:
  - Distributed Key-Value Store (DynamoDB / Cassandra)
  - API Rate Limiter & Edge Gateway (Token Bucket / Redis)
  - Global Distributed Cache (Memcached / Redis Cluster)
  - Real-time Collaborative Document Editor (OT / CRDTs)
  - Search Autocomplete / Typeahead (Trie & Offline Aggregation)
  - Distributed Payment & Ledger Gateway (Idempotency / 2PC / Sagas)
  - Video Streaming Platform (HLS / MPEG-DASH / Transcoding)
  - Distributed Logging & Telemetry Pipeline (Kafka / ClickHouse)

### 4. SM-2 Spaced Repetition Revision Hub
- Retain edge cases and algorithmic nuances across $1$, $3$, $7$, and $14$-day retention buckets.
- Intelligent drill generation targeting unpracticed patterns and blindspots.

### 5. Interview Readiness Radar
- Dynamic scoring model calculating readiness across 4 dimensions:
  - **Data Structures & Algorithms** (Pattern coverage & velocity)
  - **System Architecture** (High-throughput & distributed systems)
  - **Concurrency & Storage** (ACID, distributed locking, consistency trade-offs)
  - **Behavioral & Leadership** (STAR stories & ownership)

### 6. Local-First with Optional Supabase Cloud Sync
- Works instantly with zero setup using browser `localStorage`.
- Connect your own free Supabase project to seamlessly sync progress across multiple laptops, tablets, and devices.

---

## 🛠️ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- `npm` or `yarn`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/interview-prep-os.git
cd interview-prep-os
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## ☁️ Setting Up Cloud Sync (Optional)

1. Create a free project at [Supabase](https://supabase.com).
2. Run the migration scripts in `/supabase/` inside your Supabase SQL Editor:
   - `supabase/schema.sql`
   - `supabase/update_100_dsa_problems.sql`
   - `supabase/update_20_system_designs.sql`
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Click **Cloud Sync** in the dashboard header to connect your account.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` / `Ctrl+K` | Open Quick Search & Command Palette |
| `⌘B` / `Ctrl+B` | Toggle Navigation Sidebar |

---

## 📄 License
MIT License. Built for ambitious software engineers aiming for top-tier technical roles.
