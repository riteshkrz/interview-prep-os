/**
 * 45-Day Interview Prep OS - Reactive State Store & Persistence
 * Complete 45-Day Guided Curriculum: Exact syllabus, problems, system design specs,
 * revision triggers, and objectives for every single day from Day 1 to Day 45.
 */

import { stateSyncService } from '../services/stateSyncService.js';
import { catalogService } from '../services/catalogService.js';
import { SEED_DSA_PROBLEMS, SEED_SYSTEM_DESIGN_SPECS } from '../data/seedCatalog.js';

const STORAGE_KEY = 'interview_prep_os_state_v4';

// Comprehensive 45-Day Day-by-Day Syllabus
export const FULL_45_DAY_CURRICULUM = {
  1: {
    day: 1,
    week: 1,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Arrays & Frequency Hash Maps",
    objective: "Master frequency counting, hash-based O(1) lookups, and two-pass reduction to eliminate quadratic nested loops.",
    headlineTarget: "4 DSA Problems",
    estTime: "85 mins",
    tasks: [
      { id: "task-1-1", text: "Solve Two Sum (Arrays & Hashing)", category: "DSA", done: false },
      { id: "task-1-2", text: "Solve Valid Anagram (Arrays & Hashing)", category: "DSA", done: false },
      { id: "task-1-3", text: "Solve Group Anagrams (Arrays & Hashing)", category: "DSA", done: false },
      { id: "task-1-4", text: "Solve Top K Frequent Elements (Arrays & Hashing)", category: "DSA", done: false }
    ]
  },
  2: {
    day: 2,
    week: 1,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Prefix Products & Sequence Tracking",
    objective: "Calculate running prefix and suffix products in linear time without division and track consecutive sets.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-2-1", text: "Solve Product of Array Except Self (Arrays & Hashing)", category: "DSA", done: false },
      { id: "task-2-2", text: "Solve Longest Consecutive Sequence (Arrays & Hashing)", category: "DSA", done: false },
      { id: "task-2-3", text: "Solve Subarray Sum Equals K (Prefix Sum)", category: "DSA", done: false }
    ]
  },
  3: {
    day: 3,
    week: 1,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Lexicographical Permutations & Cyclic Invariants",
    objective: "Master in-place lexicographical pivot reversals, cyclic sort index positioning, and palindrome validations.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-3-1", text: "Solve Next Permutation (Arrays & Math)", category: "DSA", done: false },
      { id: "task-3-2", text: "Solve First Missing Positive (Cyclic Sort / Arrays)", category: "DSA", done: false },
      { id: "task-3-3", text: "Solve Valid Palindrome (Two Pointers)", category: "DSA", done: false }
    ]
  },
  4: {
    day: 4,
    week: 1,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Two Pointers & Inward Collision Mechanics",
    objective: "Learn convergent two-pointer technique on sorted arrays and inward boundary collision mechanics to eliminate duplicate sets.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-4-1", text: "Solve Two Sum II - Input Array Is Sorted (Two Pointers)", category: "DSA", done: false },
      { id: "task-4-2", text: "Solve 3Sum (Two Pointers)", category: "DSA", done: false },
      { id: "task-4-3", text: "Solve Container With Most Water (Two Pointers)", category: "DSA", done: false }
    ]
  },
  5: {
    day: 5,
    week: 1,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Trapping Elevation & Sliding Window Foundations",
    objective: "Calculate non-redundant rainwater trapping with two pointers and dynamic window expansions for running profit.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-5-1", text: "Solve Trapping Rain Water (Two Pointers / Monotonic Stack)", category: "DSA", done: false },
      { id: "task-5-2", text: "Solve Best Time to Buy and Sell Stock (Sliding Window)", category: "DSA", done: false },
      { id: "task-5-3", text: "Solve Longest Substring Without Repeating Characters (Sliding Window)", category: "DSA", done: false }
    ]
  },
  6: {
    day: 6,
    week: 1,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Sliding Windows & Exact Permutation Matching",
    objective: "Master dynamic window contraction under character replacements, fixed anagram frequency checks, and monotonic deques.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-6-1", text: "Solve Longest Repeating Character Replacement (Sliding Window)", category: "DSA", done: false },
      { id: "task-6-2", text: "Solve Permutation in String (Sliding Window)", category: "DSA", done: false },
      { id: "task-6-3", text: "Solve Sliding Window Maximum (Sliding Window / Deque)", category: "DSA", done: false }
    ]
  },
  7: {
    day: 7,
    week: 1,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Week 1 Milestone: Cache Architecture & Windows",
    objective: "Design distributed cache clusters with eviction policies and master variable-sized minimum window substring matches.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-7-1", text: "Solve Minimum Window Substring (Sliding Window)", category: "DSA", done: false },
      { id: "task-7-2", text: "Architect Distributed Cache (e.g., Redis / Memcached Cluster) (In-Memory Storage & Cache Invalidation)", category: "SYS DESIGN", done: false }
    ]
  },
  8: {
    day: 8,
    week: 2,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Stack LIFO & Auxiliary Min Tracking",
    objective: "Validate bracket balance invariants and design constant-time minimum retrieval stacks.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-8-1", text: "Solve Valid Parentheses (Stack)", category: "DSA", done: false },
      { id: "task-8-2", text: "Solve Min Stack (Stack Design)", category: "DSA", done: false },
      { id: "task-8-3", text: "Solve Evaluate Reverse Polish Notation (Stack)", category: "DSA", done: false }
    ]
  },
  9: {
    day: 9,
    week: 2,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Monotonic Stacks & Binary Search Foundations",
    objective: "Use monotonic stacks to compute next greater elements, boundary spans in histograms, and logarithmic array search.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-9-1", text: "Solve Daily Temperatures (Monotonic Stack)", category: "DSA", done: false },
      { id: "task-9-2", text: "Solve Largest Rectangle in Histogram (Monotonic Stack)", category: "DSA", done: false },
      { id: "task-9-3", text: "Solve Binary Search (Binary Search)", category: "DSA", done: false }
    ]
  },
  10: {
    day: 10,
    week: 2,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Expression Parsing & Typeahead Systems",
    objective: "Evaluate nested arithmetic expressions with operator stacks and architect high-frequency search autocomplete typeahead.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-10-1", text: "Solve Basic Calculator (Stack / Parsing)", category: "DSA", done: false },
      { id: "task-10-2", text: "Architect Search Autocomplete / Typeahead (e.g., Google Search Bar) (In-Memory Prefix Trees (Trie) & Offline Aggregation)", category: "SYS DESIGN", done: false }
    ]
  },
  11: {
    day: 11,
    week: 2,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Matrix Binary Search & Pivot Inflections",
    objective: "Treat 2D sorted grids as 1D arrays and find rotation minimums using logarithmic boundary comparisons.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-11-1", text: "Solve Search a 2D Matrix (Binary Search)", category: "DSA", done: false },
      { id: "task-11-2", text: "Solve Find Minimum in Rotated Sorted Array (Binary Search)", category: "DSA", done: false },
      { id: "task-11-3", text: "Solve Koko Eating Bananas (Binary Search on Answer)", category: "DSA", done: false }
    ]
  },
  12: {
    day: 12,
    week: 2,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Rotated Binary Search & Hash Key Generation",
    objective: "Locate targets across rotated sorted partitions and architect scalable URL shorteners with persistent key-generation.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-12-1", text: "Solve Search in Rotated Sorted Array (Binary Search)", category: "DSA", done: false },
      { id: "task-12-2", text: "Architect URL Shortener (e.g., TinyURL / Bitly) (Hashing Algorithms & Persistent Key Generation (KGS))", category: "SYS DESIGN", done: false }
    ]
  },
  13: {
    day: 13,
    week: 2,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Binary Search Timestamps & Median Partitions",
    objective: "Store versioned timestamps with binary search retrieval and partition two sorted arrays in logarithmic time.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-13-1", text: "Solve Time Based Key-Value Store (Binary Search / Design)", category: "DSA", done: false },
      { id: "task-13-2", text: "Solve Median of Two Sorted Arrays (Binary Search)", category: "DSA", done: false },
      { id: "task-13-3", text: "Solve Reverse Linked List (Linked List)", category: "DSA", done: false }
    ]
  },
  14: {
    day: 14,
    week: 2,
    phase: "Phase 1: Core DSA & Foundations",
    topic: "Linked List Reversals & Fast/Slow Pointers",
    objective: "Combine sorted linked lists, detect cycles with Floyd's algorithm, and reorder nodes in alternating zigzag order.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-14-1", text: "Solve Merge Two Sorted Lists (Linked List)", category: "DSA", done: false },
      { id: "task-14-2", text: "Solve Linked List Cycle (Fast & Slow Pointers)", category: "DSA", done: false },
      { id: "task-14-3", text: "Solve Reorder List (Linked List)", category: "DSA", done: false }
    ]
  },
  15: {
    day: 15,
    week: 3,
    phase: "Phase 2: Advanced Patterns & Distributed Systems",
    topic: "Distributed Storage Milestone: Key-Value & Object Storage",
    objective: "Architect distributed key-value stores with consistent hashing and object storage with chunking and erasure coding.",
    headlineTarget: "2 System Design Specs (Milestone)",
    estTime: "90 mins",
    tasks: [
      { id: "task-15-1", text: "Architect Distributed Key-Value Store (e.g., DynamoDB / Cassandra) (Consistent Hashing & Quorum Consensus)", category: "SYS DESIGN", done: false },
      { id: "task-15-2", text: "Architect Distributed Object Storage (e.g., AWS S3 / Google Cloud Storage) (Blob Storage & Multipart Resumption)", category: "SYS DESIGN", done: false }
    ]
  },
  16: {
    day: 16,
    week: 3,
    phase: "Phase 2: Advanced Patterns & Distributed Systems",
    topic: "Offset Deletions, Random Pointers & Multi-Way Merge",
    objective: "Delete tail offsets with two pointers, create deep copies with random pointers, and merge k sorted lists.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-16-1", text: "Solve Remove Nth Node From End of List (Fast & Slow Pointers)", category: "DSA", done: false },
      { id: "task-16-2", text: "Solve Copy List with Random Pointer (Linked List / Hash Map)", category: "DSA", done: false },
      { id: "task-16-3", text: "Solve Merge k Sorted Lists (Heap / Divide & Conquer)", category: "DSA", done: false }
    ]
  },
  17: {
    day: 17,
    week: 3,
    phase: "Phase 2: Advanced Patterns & Distributed Systems",
    topic: "In-Memory Eviction & API Rate Limiting Gateways",
    objective: "Implement LRU Cache using doubly-linked nodes and design token-bucket API rate limiters with Redis and Envoy.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-17-1", text: "Solve LRU Cache (Doubly Linked List / Hash Map)", category: "DSA", done: false },
      { id: "task-17-2", text: "Architect API Rate Limiter & Gateway (Token Bucket / Sliding Window & Edge Filtering)", category: "SYS DESIGN", done: false }
    ]
  },
  18: {
    day: 18,
    week: 3,
    phase: "Phase 2: Advanced Patterns & Distributed Systems",
    topic: "Group Reversals & Binary Tree DFS",
    objective: "Reverse linked lists k-nodes at a time and recursively invert binary trees while computing branch diameters.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-18-1", text: "Solve Reverse Nodes in k-Group (Linked List)", category: "DSA", done: false },
      { id: "task-18-2", text: "Solve Invert Binary Tree (Trees (DFS))", category: "DSA", done: false },
      { id: "task-18-3", text: "Solve Diameter of Binary Tree (Trees (DFS))", category: "DSA", done: false }
    ]
  },
  19: {
    day: 19,
    week: 3,
    phase: "Phase 2: Advanced Patterns & Distributed Systems",
    topic: "Tree Depths & Distributed Commit Logs",
    objective: "Calculate maximum tree heights recursively and architect Apache Kafka distributed message queues with ISR quorums.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-19-1", text: "Solve Maximum Depth of Binary Tree (Trees (DFS/BFS))", category: "DSA", done: false },
      { id: "task-19-2", text: "Architect Distributed Message Queue (e.g., Apache Kafka / RabbitMQ) (Append-Only Logs & Consumer Groups)", category: "SYS DESIGN", done: false }
    ]
  },
  20: {
    day: 20,
    week: 3,
    phase: "Phase 2: Advanced Patterns & Distributed Systems",
    topic: "Tree Structural Invariants & BST Ancestors",
    objective: "Verify identical subtrees, locate Lowest Common Ancestor, and enforce BST bounds (-inf, +inf).",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-20-1", text: "Solve Same Tree (Trees (DFS))", category: "DSA", done: false },
      { id: "task-20-2", text: "Solve Lowest Common Ancestor of a BST (BST Traversal)", category: "DSA", done: false },
      { id: "task-20-3", text: "Solve Validate Binary Search Tree (BST Traversal)", category: "DSA", done: false }
    ]
  },
  21: {
    day: 21,
    week: 3,
    phase: "Phase 2: Advanced Patterns & Distributed Systems",
    topic: "Breadth-First Queues & Real-Time WebSockets",
    objective: "Traverse trees level-by-level using queues and architect real-time chat infrastructure with connection managers and heartbeats.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-21-1", text: "Solve Binary Tree Level Order Traversal (Trees (BFS))", category: "DSA", done: false },
      { id: "task-21-2", text: "Architect Real-Time Chat & Messaging Service (e.g., WhatsApp / Slack) (Long-Lived Connections & Presence Management)", category: "SYS DESIGN", done: false }
    ]
  },
  22: {
    day: 22,
    week: 4,
    phase: "Week 4: System Design Masterclass — Core Building Blocks",
    topic: "System Design Framework & URL Shortener (Bitly)",
    objective: "Master the 7-step system design interview framework and design a high-throughput URL shortener with Base62 encoding, Redis caching, and HTTP 302 redirects.",
    headlineTarget: "Framework + 1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-22-1", text: "Master Part I: 7-Step System Design Interview Framework & Timing Template", category: "SYS DESIGN", done: false },
      { id: "task-22-2", text: "Design Question 1: URL Shortener like Bitly (Base62 IDs, Redis Cache-Aside & 302 Redirects)", category: "SYS DESIGN", done: false }
    ]
  },
  23: {
    day: 23,
    week: 4,
    phase: "Week 4: System Design Masterclass — Core Building Blocks",
    topic: "Distributed Rate Limiter",
    objective: "Design a distributed rate limiter with Token Bucket, atomic Redis Lua scripts, multiple policy tiers, and graceful degraded-mode failover.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-23-1", text: "Design Question 2: Distributed Rate Limiter (Token Bucket vs Leaky Bucket, Redis Atomic Lua & Fail-Safe Modes)", category: "SYS DESIGN", done: false }
    ]
  },
  24: {
    day: 24,
    week: 4,
    phase: "Week 4: System Design Masterclass — Core Building Blocks",
    topic: "Notification System",
    objective: "Architect a multi-channel notification platform with persistent priority queues, transactional outbox, worker pools, and provider failover.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-24-1", text: "Design Question 3: Notification System (Durable Priority Queues, Outbox Pattern, Deduplication & Provider Webhooks)", category: "SYS DESIGN", done: false }
    ]
  },
  25: {
    day: 25,
    week: 4,
    phase: "Week 4: System Design Masterclass — Core Building Blocks",
    topic: "Distributed Cache",
    objective: "Design a horizontally scalable distributed cache with consistent hashing, LRU/LFU eviction, stampede defense, and hot-key mitigation.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-25-1", text: "Design Question 4: Distributed Cache (Consistent Hashing Ring, LRU Eviction, Cache Stampede Mitigation & Hot Keys)", category: "SYS DESIGN", done: false }
    ]
  },
  26: {
    day: 26,
    week: 4,
    phase: "Week 4: System Design Masterclass — Core Building Blocks",
    topic: "API Gateway",
    objective: "Propose an edge API gateway handling north-south traffic, TLS termination, JWT authentication, per-route rate limits, and circuit breakers.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-26-1", text: "Design Question 5: API Gateway (Edge Routing, TLS Termination, Token Auth, Circuit Breaking & Tracing)", category: "SYS DESIGN", done: false }
    ]
  },
  27: {
    day: 27,
    week: 4,
    phase: "Week 4: System Design Masterclass — Consumer-Scale Applications",
    topic: "Instagram (Photo-Sharing Platform)",
    objective: "Design a photo-sharing service with direct S3 uploads, asynchronous media processing, hybrid fan-out feeds, and CDN media distribution.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-27-1", text: "Design Question 6: Instagram (Direct Presigned Uploads, Hybrid Fan-Out Feed, Cursor Pagination & CDN)", category: "SYS DESIGN", done: false }
    ]
  },
  28: {
    day: 28,
    week: 4,
    phase: "Week 4: System Design Masterclass — Consumer-Scale Applications",
    topic: "WhatsApp (Real-Time Messaging)",
    objective: "Design a real-time messaging system with persistent WebSocket gateways, offline durable queues, per-conversation ordering, and end-to-end encryption.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-28-1", text: "Design Question 7: WhatsApp (WebSocket Gateways, Offline Message Buffering, Ordering & End-to-End Encryption)", category: "SYS DESIGN", done: false }
    ]
  },
  29: {
    day: 29,
    week: 5,
    phase: "Week 5: System Design Masterclass — Media & Data-Intensive Platforms",
    topic: "YouTube (Video Streaming Platform)",
    objective: "Design a global video streaming platform with resumable chunked uploads, distributed transcoding DAGs, HLS/DASH adaptive bitrate, and CDN edge delivery.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-29-1", text: "Design Question 8: YouTube (Resumable Multipart Uploads, HLS/DASH Transcoding Pipeline & CDN Delivery)", category: "SYS DESIGN", done: false }
    ]
  },
  30: {
    day: 30,
    week: 5,
    phase: "Week 5: System Design Masterclass — Media & Data-Intensive Platforms",
    topic: "Uber (Ride-Hailing & Real-Time Dispatch)",
    objective: "Architect a real-time dispatch service with geospatial indexing (H3/Geohash), high-frequency driver location ingestion, and atomic conditional driver matching.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-30-1", text: "Design Question 9: Uber (Geospatial Indexing H3/Geohash, Location Ingestion & Atomic Driver Assignment)", category: "SYS DESIGN", done: false }
    ]
  },
  31: {
    day: 31,
    week: 5,
    phase: "Week 5: System Design Masterclass — Media & Data-Intensive Platforms",
    topic: "Food Delivery Platform (DoorDash / UberEats)",
    objective: "Design a multi-sided food delivery platform coordinating customer ordering, restaurant acceptance, courier dispatch, and distributed Saga transactions.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-31-1", text: "Design Question 10: Food Delivery Platform (Catalog Caching, Multi-Entity Saga, Courier Dispatch & Compensations)", category: "SYS DESIGN", done: false }
    ]
  },
  32: {
    day: 32,
    week: 5,
    phase: "Week 5: System Design Masterclass — Media & Data-Intensive Platforms",
    topic: "Web Crawler (Googlebot Scale)",
    objective: "Design a distributed web crawler with URL frontier scheduling, politeness delays, robots.txt caching, content deduplication, and Bloom filters.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-32-1", text: "Design Question 11: Web Crawler (URL Frontier, Politeness Delays, Bloom Filter Dedup & Object Storage)", category: "SYS DESIGN", done: false }
    ]
  },
  33: {
    day: 33,
    week: 5,
    phase: "Week 5: System Design Masterclass — Media & Data-Intensive Platforms",
    topic: "Search Autocomplete (Typeahead System)",
    objective: "Design a low-latency query autocomplete engine using Trie / FST compact structures, Top-K precomputations, prefix caching, and versioned index rollouts.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-33-1", text: "Design Question 12: Search Autocomplete (Trie/FST Index, Top-K Precomputation, Prefix Caching & Versioned Swaps)", category: "SYS DESIGN", done: false }
    ]
  },
  34: {
    day: 34,
    week: 5,
    phase: "Week 5: System Design Masterclass — Media & Data-Intensive Platforms",
    topic: "Logging and Monitoring System (Datadog / Prometheus)",
    objective: "Design an observability platform ingesting hundreds of thousands of events/sec with Kafka buffering, hot search indexes, cold S3 archives, and alerting.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-34-1", text: "Design Question 13: Logging & Monitoring System (Kafka Ingestion, Hot/Cold Tiering, Metric Rollups & Alerting)", category: "SYS DESIGN", done: false }
    ]
  },
  35: {
    day: 35,
    week: 5,
    phase: "Week 5: System Design Masterclass — Media & Data-Intensive Platforms",
    topic: "Real-Time Analytics Pipeline",
    objective: "Architect a stream processing pipeline with partitioned Kafka topics, event-time windowing, watermarks for late arrivals, and raw event replay.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-35-1", text: "Design Question 14: Real-Time Analytics Pipeline (Kafka Streaming, Event-Time Windows, Watermarks & Historical Replay)", category: "SYS DESIGN", done: false }
    ]
  },
  36: {
    day: 36,
    week: 6,
    phase: "Week 6: System Design Masterclass — Business-Critical & Distributed Systems",
    topic: "Distributed Task Scheduler",
    objective: "Design a high-scale task scheduler supporting one-off and recurring jobs with timing wheels, worker heartbeat leases, exponential backoff, and idempotent runs.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-36-1", text: "Design Question 15: Distributed Task Scheduler (Timing Wheels, Lease Fencing, Durable Queues & Idempotent Retries)", category: "SYS DESIGN", done: false }
    ]
  },
  37: {
    day: 37,
    week: 6,
    phase: "Week 6: System Design Masterclass — Business-Critical & Distributed Systems",
    topic: "E-Commerce Platform (Flash Sales & Orders)",
    objective: "Architect an end-to-end e-commerce system with atomic inventory holds, distributed checkout Sagas, payment orchestration, and flash sale resilience.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-37-1", text: "Design Question 16: E-Commerce Platform (Atomic Inventory Holds, Saga Orchestration, Cart Decoupling & Flash Sales)", category: "SYS DESIGN", done: false }
    ]
  },
  38: {
    day: 38,
    week: 6,
    phase: "Week 6: System Design Masterclass — Business-Critical & Distributed Systems",
    topic: "Ticket Booking System (Ticketmaster / BookMyShow)",
    objective: "Design an event ticketing system with numbered seating, time-bound 5-minute holds, optimistic concurrency control, and zero double-booking guarantees.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-38-1", text: "Design Question 17: Ticket Booking System (Numbered Seat Holds, Conditional Status Transitions & Concurrency Guards)", category: "SYS DESIGN", done: false }
    ]
  },
  39: {
    day: 39,
    week: 6,
    phase: "Week 6: System Design Masterclass — Business-Critical & Distributed Systems",
    topic: "Payment System (Stripe Architecture)",
    objective: "Architect a resilient payment platform with strict client idempotency, finite-state payment machines, double-entry ledger entries, and daily reconciliation.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-39-1", text: "Design Question 18: Payment System (Idempotency Keys, State Machine Transitions, Webhook Handlers & Ledger Reconciliation)", category: "SYS DESIGN", done: false }
    ]
  },
  40: {
    day: 40,
    week: 6,
    phase: "Week 6: System Design Masterclass — Business-Critical & Distributed Systems",
    topic: "Cloud File Storage Service (Dropbox)",
    objective: "Design a cloud sync and file storage platform with chunked deduplicated uploads, version tracking, durable sync cursors, and conflict branching.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-40-1", text: "Design Question 19: Cloud File Storage like Dropbox (Chunked Uploads, Content Dedup, Sync Cursors & Conflict Copies)", category: "SYS DESIGN", done: false }
    ]
  },
  41: {
    day: 41,
    week: 6,
    phase: "Week 6: System Design Masterclass — Business-Critical & Distributed Systems",
    topic: "Ad Impression Tracking System",
    objective: "Design a high-throughput ad-tech pipeline ingesting 100k+ events/sec with sliding deduplication, cached enrichment, and batch-stream reconciliation.",
    headlineTarget: "1 Masterclass Spec",
    estTime: "60 mins",
    tasks: [
      { id: "task-41-1", text: "Design Question 20: Ad Impression Tracking System (100k+ QPS Ingestion, Sliding Dedup Window, Kafka Stream & Batch Diffing)", category: "SYS DESIGN", done: false }
    ]
  },
  42: {
    day: 42,
    week: 6,
    phase: "Week 6: System Design Masterclass — Business-Critical & Distributed Systems",
    topic: "Final Interview Readiness Checklist & 6 Core Principles",
    objective: "Master the 10-point system design readiness checklist and the 6 foundational principles of real-world distributed architectures.",
    headlineTarget: "10-Point Readiness & 6 Principles",
    estTime: "60 mins",
    tasks: [
      { id: "task-42-1", text: "Master 10-Point System Design Interview Readiness Checklist", category: "SYS DESIGN", done: false },
      { id: "task-42-2", text: "Review 6 Core Principles: Queues, Caches, Concurrency, Exactly-Once, Trade-offs & Minimal Architecture", category: "SYS DESIGN", done: false }
    ]
  },
  43: {
    day: 43,
    week: 7,
    phase: "Phase 6: Final Hard Mastery, Intervals & Capstone",
    topic: "Levenshtein Edit Distance & Interval Burst Balloons",
    objective: "Compute minimum string transformation steps and maximize coins with strategic interval burst balloon orders.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-43-1", text: "Solve Edit Distance (2-D DP (String Matching))", category: "DSA", done: false },
      { id: "task-43-2", text: "Solve Burst Balloons (2-D DP (Interval DP))", category: "DSA", done: false },
      { id: "task-43-3", text: "Solve Insert Interval (Intervals)", category: "DSA", done: false }
    ]
  },
  44: {
    day: 44,
    week: 7,
    phase: "Phase 6: Final Hard Mastery, Intervals & Capstone",
    topic: "Interval Merges, Non-Overlapping Elimination & Bit XOR",
    objective: "Merge overlapping spans, eliminate conflicting intervals with greedy earliest-end, and isolate unique items using XOR.",
    headlineTarget: "4 DSA Problems",
    estTime: "85 mins",
    tasks: [
      { id: "task-44-1", text: "Solve Merge Intervals (Intervals)", category: "DSA", done: false },
      { id: "task-44-2", text: "Solve Non-overlapping Intervals (Intervals (Greedy))", category: "DSA", done: false },
      { id: "task-44-3", text: "Solve Minimum Number of Arrows to Burst Balloons (Intervals (Greedy))", category: "DSA", done: false },
      { id: "task-44-4", text: "Solve Single Number (Bit Manipulation (XOR))", category: "DSA", done: false }
    ]
  },
  45: {
    day: 45,
    week: 7,
    phase: "Phase 6: Final Hard Mastery, Intervals & Capstone",
    topic: "Bit Counts, In-Place Matrix Rotations & Graduation Capstone",
    objective: "Compute linear set bits, mark rows/cols in-place, spiral traverse matrices, and complete the full-loop readiness audit.",
    headlineTarget: "4 DSA Problems",
    estTime: "85 mins",
    tasks: [
      { id: "task-45-1", text: "Solve Counting Bits (Bit Manipulation / DP)", category: "DSA", done: false },
      { id: "task-45-2", text: "Solve Set Matrix Zeroes (Matrix (In-place Marking))", category: "DSA", done: false },
      { id: "task-45-3", text: "Solve Spiral Matrix (Matrix (Boundary Traversal))", category: "DSA", done: false },
      { id: "task-45-4", text: "Solve Rotate Image (Matrix (Transpose & Reflect))", category: "DSA", done: false }
    ]
  }
};

// 20 Production-Grade System Design Specs
export const SYSTEM_DESIGN_SPECS = SEED_SYSTEM_DESIGN_SPECS;

// Curated 100 DSA Problems
export const DSA_PROBLEMS = SEED_DSA_PROBLEMS;

// Helper to initialize clean daily tasks map (all false by default for real user tracking)
export function initCleanDailyTasks() {
  const map = {};
  for (let d = 1; d <= 45; d++) {
    const plan = FULL_45_DAY_CURRICULUM[d];
    if (plan && plan.tasks) {
      map[d] = plan.tasks.map(t => ({ ...t, done: false }));
    } else {
      map[d] = [
        { id: `task-${d}-1`, text: `Curated High-Frequency Problem for Day ${d}`, category: 'DSA', done: false },
        { id: `task-${d}-2`, text: `System Architecture Spec Deep Dive`, category: 'SYS DESIGN', done: false },
        { id: `task-${d}-3`, text: `Spaced Recall Queue Revision`, category: 'REVISION', done: false }
      ];
    }
  }
  return map;
}

// Helper to initialize demo daily tasks (with days 1-13 completed)
export function initDemoDailyTasks() {
  const map = {};
  for (let d = 1; d <= 45; d++) {
    const plan = FULL_45_DAY_CURRICULUM[d];
    if (plan && plan.tasks) {
      map[d] = plan.tasks.map(t => ({ ...t, done: d < 14 }));
    } else {
      map[d] = [
        { id: `task-${d}-1`, text: `Curated High-Frequency Problem for Day ${d}`, category: 'DSA', done: d < 14 },
        { id: `task-${d}-2`, text: `System Architecture Spec Deep Dive`, category: 'SYS DESIGN', done: d < 14 },
        { id: `task-${d}-3`, text: `Spaced Recall Queue Revision`, category: 'REVISION', done: d < 14 }
      ];
    }
  }
  return map;
}

// Clean initial state for genuine user tracking
export const CLEAN_STATE = {
  activeDay: 1,
  totalDays: 45,
  streak: 1,
  userTrack: 'L5 / L6 Track',
  curriculum: FULL_45_DAY_CURRICULUM,
  dailyTasks: initCleanDailyTasks(),
  checklist: initCleanDailyTasks(),
  dsaProblems: DSA_PROBLEMS.map(p => ({ ...p, status: 'Queued', confidence: 0, timeSpent: '—' })),
  systemSpecs: SYSTEM_DESIGN_SPECS.map(s => ({ ...s, status: 'Queued', stars: 0, timeSpent: '—' })),
  sysDesignRoadmap: {},
  highlights: {}
};

// Demo state showing an active mid-sprint student
export const DEMO_STATE = {
  activeDay: 14,
  totalDays: 45,
  streak: 14,
  userTrack: 'L5 / L6 Track',
  curriculum: FULL_45_DAY_CURRICULUM,
  dailyTasks: initDemoDailyTasks(),
  checklist: initDemoDailyTasks(),
  dsaProblems: DSA_PROBLEMS,
  systemSpecs: SYSTEM_DESIGN_SPECS,
  highlights: {}
};

// Default export uses clean state for authentic user onboarding
export const DEFAULT_STATE = CLEAN_STATE;

// Explicit curriculum task to catalog problem/spec mapping
export const CURRICULUM_TASK_MAP = {
  "task-1-1": { type: "DSA", id: "dsa-1" },
  "task-1-2": { type: "DSA", id: "dsa-2" },
  "task-1-3": { type: "DSA", id: "dsa-3" },
  "task-1-4": { type: "DSA", id: "dsa-4" },
  "task-2-1": { type: "DSA", id: "dsa-5" },
  "task-2-2": { type: "DSA", id: "dsa-6" },
  "task-2-3": { type: "DSA", id: "dsa-7" },
  "task-3-1": { type: "DSA", id: "dsa-8" },
  "task-3-2": { type: "DSA", id: "dsa-9" },
  "task-3-3": { type: "DSA", id: "dsa-10" },
  "task-4-1": { type: "DSA", id: "dsa-11" },
  "task-4-2": { type: "DSA", id: "dsa-12" },
  "task-4-3": { type: "DSA", id: "dsa-13" },
  "task-5-1": { type: "DSA", id: "dsa-14" },
  "task-5-2": { type: "DSA", id: "dsa-15" },
  "task-5-3": { type: "DSA", id: "dsa-16" },
  "task-6-1": { type: "DSA", id: "dsa-17" },
  "task-6-2": { type: "DSA", id: "dsa-18" },
  "task-6-3": { type: "DSA", id: "dsa-20" },
  "task-7-1": { type: "DSA", id: "dsa-19" },
  "task-7-2": { type: "SYS DESIGN", id: "sd-3" },
  "task-8-1": { type: "DSA", id: "dsa-21" },
  "task-8-2": { type: "DSA", id: "dsa-22" },
  "task-8-3": { type: "DSA", id: "dsa-23" },
  "task-9-1": { type: "DSA", id: "dsa-24" },
  "task-9-2": { type: "DSA", id: "dsa-25" },
  "task-9-3": { type: "DSA", id: "dsa-27" },
  "task-10-1": { type: "DSA", id: "dsa-26" },
  "task-10-2": { type: "SYS DESIGN", id: "sd-16" },
  "task-11-1": { type: "DSA", id: "dsa-28" },
  "task-11-2": { type: "DSA", id: "dsa-29" },
  "task-11-3": { type: "DSA", id: "dsa-31" },
  "task-12-1": { type: "DSA", id: "dsa-30" },
  "task-12-2": { type: "SYS DESIGN", id: "sd-1" },
  "task-13-1": { type: "DSA", id: "dsa-32" },
  "task-13-2": { type: "DSA", id: "dsa-33" },
  "task-13-3": { type: "DSA", id: "dsa-34" },
  "task-14-1": { type: "DSA", id: "dsa-35" },
  "task-14-2": { type: "DSA", id: "dsa-36" },
  "task-14-3": { type: "DSA", id: "dsa-37" },
  "task-15-1": { type: "SYS DESIGN", id: "sd-2" },
  "task-15-2": { type: "SYS DESIGN", id: "sd-4" },
  "task-16-1": { type: "DSA", id: "dsa-38" },
  "task-16-2": { type: "DSA", id: "dsa-39" },
  "task-16-3": { type: "DSA", id: "dsa-41" },
  "task-17-1": { type: "DSA", id: "dsa-40" },
  "task-17-2": { type: "SYS DESIGN", id: "sd-18" },
  "task-18-1": { type: "DSA", id: "dsa-42" },
  "task-18-2": { type: "DSA", id: "dsa-43" },
  "task-18-3": { type: "DSA", id: "dsa-45" },
  "task-19-1": { type: "DSA", id: "dsa-44" },
  "task-19-2": { type: "SYS DESIGN", id: "sd-5" },
  "task-20-1": { type: "DSA", id: "dsa-46" },
  "task-20-2": { type: "DSA", id: "dsa-47" },
  "task-20-3": { type: "DSA", id: "dsa-49" },
  "task-21-1": { type: "DSA", id: "dsa-48" },
  "task-21-2": { type: "SYS DESIGN", id: "sd-7" },
  "task-22-1": { type: "DSA", id: "dsa-50" },
  "task-22-2": { type: "SYS DESIGN", id: "sd-8" },
  "task-23-1": { type: "DSA", id: "dsa-51" },
  "task-23-2": { type: "DSA", id: "dsa-52" },
  "task-23-3": { type: "DSA", id: "dsa-57" },
  "task-24-1": { type: "DSA", id: "dsa-53" },
  "task-24-2": { type: "SYS DESIGN", id: "sd-17" },
  "task-25-1": { type: "DSA", id: "dsa-54" },
  "task-25-2": { type: "SYS DESIGN", id: "sd-12" },
  "task-26-1": { type: "DSA", id: "dsa-55" },
  "task-26-2": { type: "SYS DESIGN", id: "sd-13" },
  "task-27-1": { type: "DSA", id: "dsa-56" },
  "task-27-2": { type: "DSA", id: "dsa-58" },
  "task-27-3": { type: "DSA", id: "dsa-59" },
  "task-28-1": { type: "DSA", id: "dsa-60" },
  "task-28-2": { type: "DSA", id: "dsa-61" },
  "task-28-3": { type: "DSA", id: "dsa-62" },
  "task-29-1": { type: "DSA", id: "dsa-63" },
  "task-29-2": { type: "DSA", id: "dsa-64" },
  "task-29-3": { type: "DSA", id: "dsa-65" },
  "task-30-1": { type: "SYS DESIGN", id: "sd-14" },
  "task-30-2": { type: "SYS DESIGN", id: "sd-15" },
  "task-31-1": { type: "DSA", id: "dsa-66" },
  "task-31-2": { type: "SYS DESIGN", id: "sd-11" },
  "task-32-1": { type: "DSA", id: "dsa-67" },
  "task-32-2": { type: "SYS DESIGN", id: "sd-10" },
  "task-33-1": { type: "DSA", id: "dsa-68" },
  "task-33-2": { type: "SYS DESIGN", id: "sd-9" },
  "task-34-1": { type: "DSA", id: "dsa-69" },
  "task-34-2": { type: "SYS DESIGN", id: "sd-6" },
  "task-35-1": { type: "DSA", id: "dsa-70" },
  "task-35-2": { type: "SYS DESIGN", id: "sd-19" },
  "task-36-1": { type: "DSA", id: "dsa-71" },
  "task-36-2": { type: "SYS DESIGN", id: "sd-20" },
  "task-37-1": { type: "DSA", id: "dsa-72" },
  "task-37-2": { type: "DSA", id: "dsa-73" },
  "task-37-3": { type: "DSA", id: "dsa-74" },
  "task-38-1": { type: "DSA", id: "dsa-75" },
  "task-38-2": { type: "DSA", id: "dsa-76" },
  "task-38-3": { type: "DSA", id: "dsa-77" },
  "task-39-1": { type: "DSA", id: "dsa-78" },
  "task-39-2": { type: "DSA", id: "dsa-79" },
  "task-39-3": { type: "DSA", id: "dsa-80" },
  "task-40-1": { type: "DSA", id: "dsa-81" },
  "task-40-2": { type: "DSA", id: "dsa-82" },
  "task-40-3": { type: "DSA", id: "dsa-83" },
  "task-41-1": { type: "DSA", id: "dsa-84" },
  "task-41-2": { type: "DSA", id: "dsa-85" },
  "task-41-3": { type: "DSA", id: "dsa-86" },
  "task-42-1": { type: "DSA", id: "dsa-87" },
  "task-42-2": { type: "DSA", id: "dsa-88" },
  "task-42-3": { type: "DSA", id: "dsa-89" },
  "task-43-1": { type: "DSA", id: "dsa-90" },
  "task-43-2": { type: "DSA", id: "dsa-91" },
  "task-43-3": { type: "DSA", id: "dsa-92" },
  "task-44-1": { type: "DSA", id: "dsa-93" },
  "task-44-2": { type: "DSA", id: "dsa-94" },
  "task-44-3": { type: "DSA", id: "dsa-95" },
  "task-44-4": { type: "DSA", id: "dsa-96" },
  "task-45-1": { type: "DSA", id: "dsa-97" },
  "task-45-2": { type: "DSA", id: "dsa-98" },
  "task-45-3": { type: "DSA", id: "dsa-99" },
  "task-45-4": { type: "DSA", id: "dsa-100" }
};

/**
 * Match a checklist task to a catalog problem or system design spec
 */
export function findMatchingCatalogItem(task, currentState = state) {
  if (!task) return null;
  const dsaList = currentState?.dsaProblems || [];
  const specList = currentState?.systemSpecs || [];

  // 1. Direct explicit map lookup by task ID
  if (task.id && CURRICULUM_TASK_MAP[task.id]) {
    const mapping = CURRICULUM_TASK_MAP[task.id];
    if (mapping.type === 'DSA') {
      const prob = dsaList.find(p => String(p.id) === String(mapping.id));
      if (prob) return { type: 'DSA', item: prob };
    } else if (mapping.type === 'SYS DESIGN') {
      const spec = specList.find(s => String(s.id) === String(mapping.id));
      if (spec) return { type: 'SYS DESIGN', item: spec };
    }
  }

  // 2. Generic title extraction & fuzzy matching for ad-hoc or custom tasks
  const rawText = (task.text || '').toLowerCase();
  const category = (task.category || '').toUpperCase();

  // Clean prefix and parenthetical notes
  let core = rawText
    .replace(/^(solve|implement|design|review|active recall:|spec foundation:|study)\s+/i, '')
    .trim();
  const parenIdx = core.indexOf('(');
  if (parenIdx !== -1) {
    core = core.substring(0, parenIdx).trim();
  }
  const cleanCore = core.replace(/[^a-z0-9]/g, ' ').trim();

  // Try matching DSA problems
  if (category === 'DSA' || !category) {
    for (const p of dsaList) {
      const pTitle = (p.title || '').toLowerCase();
      const pClean = pTitle.replace(/[^a-z0-9]/g, ' ').trim();
      if (rawText.includes(pTitle) || (cleanCore && (pClean.includes(cleanCore) || cleanCore.includes(pClean)))) {
        return { type: 'DSA', item: p };
      }
    }
  }

  // Try matching System Design specs
  if (category === 'SYS DESIGN' || category === 'SYSTEM DESIGN' || !category) {
    for (const s of specList) {
      const sTitle = (s.title || '').toLowerCase();
      const sClean = sTitle.replace(/design\s+(a\s+)?/i, '').replace(/[^a-z0-9]/g, ' ').trim();
      if (rawText.includes(sTitle) || (cleanCore && (sClean.includes(cleanCore) || cleanCore.includes(sClean)))) {
        return { type: 'SYS DESIGN', item: s };
      }
    }
  }

  return null;
}

/**
 * Compute real-time, dynamic metrics from actual user problem & spec state + completed daily checklist tasks
 */
export function getMetrics(currentState = state) {
  const dsaProblems = currentState?.dsaProblems || [];
  const systemSpecs = currentState?.systemSpecs || [];
  const tasksMap = currentState?.dailyTasks || currentState?.checklist || {};

  // Aggregate completion stats across all 45 days
  let totalTasksCompleted = 0;
  let dsaTasksCompleted = 0;
  let sysTasksCompleted = 0;
  let revisionTasksCompleted = 0;
  let concurrencyTasksDone = 0;

  const concurrencyRegex = /cache|lock|concurren|redis|kafka|raft|queue|stream|storage|shard|database|ledger|buffer|pool|transact|lru|priority|tree|heap/i;

  Object.values(tasksMap).forEach(tasks => {
    if (Array.isArray(tasks)) {
      tasks.forEach(t => {
        if (t && t.done) {
          totalTasksCompleted++;
          const cat = (t.category || '').toUpperCase();
          if (cat === 'SYS DESIGN' || cat === 'SYSTEM DESIGN') {
            sysTasksCompleted++;
          } else if (cat === 'REVISION' || cat === 'STAR' || cat === 'BEHAVIORAL') {
            revisionTasksCompleted++;
          } else {
            dsaTasksCompleted++;
          }
          if (concurrencyRegex.test(t.text || '')) {
            concurrencyTasksDone++;
          }
        }
      });
    }
  });

  const masteredDsa = dsaProblems.filter(p => p.status === 'Mastered');
  const masteredSpecs = systemSpecs.filter(s => s.status === 'Mastered');

  const dsaSolved = Math.max(masteredDsa.length, dsaTasksCompleted);
  const specsSolved = Math.max(masteredSpecs.length, sysTasksCompleted);

  const dsaInProgress = dsaProblems.filter(p => p.status === 'In Progress').length;
  const dsaQueued = Math.max(0, dsaProblems.length - dsaSolved - dsaInProgress);

  let dsaEasySolved = dsaProblems.filter(p => p.status === 'Mastered' && p.difficulty === 'Easy').length;
  let dsaMedSolved = dsaProblems.filter(p => p.status === 'Mastered' && p.difficulty === 'Medium').length;
  let dsaHardSolved = dsaProblems.filter(p => p.status === 'Mastered' && p.difficulty === 'Hard').length;

  // If dsaSolved exceeds catalog mastered (e.g. ad-hoc tasks), allocate gracefully
  const extraSolved = dsaSolved - (dsaEasySolved + dsaMedSolved + dsaHardSolved);
  if (extraSolved > 0) {
    dsaMedSolved += extraSolved;
  }

  const specsInProgress = systemSpecs.filter(s => s.status === 'In Progress').length;
  const specsQueued = Math.max(0, systemSpecs.length - specsSolved - specsInProgress);

  const day = currentState?.activeDay || 1;
  const currentTasks = tasksMap[day] || [];
  const completedTasks = currentTasks.filter(t => t.done).length;
  const totalTasks = currentTasks.length || 1;
  const taskPct = Math.round((completedTasks / totalTasks) * 100);
  const totalDsa = dsaProblems.length || 100;
  const totalSpecs = systemSpecs.length || 20;
  const dsaPct = Math.round((dsaSolved / totalDsa) * 100);
  const specsPct = Math.round((specsSolved / totalSpecs) * 100);

  // Pillar 1: Data Structures & Algorithms (Goal: 80%)
  const competencyDsa = Math.min(100, Math.max(0, Math.round(dsaSolved > 0 ? (dsaSolved / 80) * 88 + Math.min(12, dsaTasksCompleted * 0.5) : 0)));

  // Pillar 2: System Architecture (Goal: 70%)
  const competencySysDesign = Math.min(100, Math.max(0, Math.round(specsSolved > 0 ? (specsSolved / 15) * 80 + Math.min(20, sysTasksCompleted * 1.5) : 0)));

  // Pillar 3: Concurrency & Storage (Goal: 70%)
  const concurrencyPoints = (concurrencyTasksDone * 3) + (specsSolved * 4) + (dsaHardSolved * 3) + (dsaMedSolved * 0.8) + (totalTasksCompleted * 0.4);
  const competencyConcurrency = Math.min(100, Math.max(0, Math.round((concurrencyPoints / 45) * 100)));

  // Pillar 4: Behavioral & Leadership (STAR) (Goal: 80%)
  const starPoints = (revisionTasksCompleted * 2.5) + (totalTasksCompleted * 0.4) + ((day / 45) * 20);
  const competencyBehavioral = Math.min(100, Math.max(0, Math.round(starPoints)));

  // Overall Readiness Score: weighted composite of all 4 pillars
  const overallReadiness = Math.min(100, Math.round((competencyDsa * 0.4) + (competencySysDesign * 0.35) + (competencyConcurrency * 0.15) + (competencyBehavioral * 0.1)));

  const dueTodayCount = dsaProblems.filter(p => p.revision && (p.revision.includes('Today') || p.revision.includes('Urgent'))).length +
                        systemSpecs.filter(s => s.revision && (s.revision.includes('Today') || s.revision.includes('Urgent'))).length;

  return {
    day,
    taskPct,
    completedTasks,
    totalTasks,
    dsaSolved,
    totalDsa,
    dsaPct,
    dsaEasySolved,
    dsaMedSolved,
    dsaHardSolved,
    specsSolved,
    totalSpecs,
    specsPct,
    specsInProgress,
    specsQueued,
    overallReadiness,
    dueTodayCount,
    competencyDsa,
    competencySysDesign,
    competencyConcurrency,
    competencyBehavioral
  };
}

/**
 * Initialize state from localStorage or fallback
 */
export function loadState() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.curriculum = FULL_45_DAY_CURRICULUM;
        
        // Curriculum v5 Smart Schedule synchronization
        const cleanTasks = initCleanDailyTasks();
        const needsSmartSchedule = !parsed.curriculumVersion || parsed.curriculumVersion < 5 || !parsed.dailyTasks || !parsed.dailyTasks[7] || parsed.dailyTasks[7].length !== cleanTasks[7].length;
        if (needsSmartSchedule) {
          const userTaskDoneMap = new Map();
          if (parsed.dailyTasks) {
            Object.values(parsed.dailyTasks).forEach(tasks => {
              if (Array.isArray(tasks)) {
                tasks.forEach(t => {
                  if (t.done) userTaskDoneMap.set(t.id, t);
                });
              }
            });
          }
          const updatedTasks = {};
          for (let d = 1; d <= 45; d++) {
            const plan = FULL_45_DAY_CURRICULUM[d];
            updatedTasks[d] = (plan?.tasks || []).map(t => {
              const prev = userTaskDoneMap.get(t.id);
              return {
                ...t,
                done: prev ? Boolean(prev.done) : false,
                confidence: prev ? (prev.confidence || 0) : 0,
                timerSeconds: prev ? (prev.timerSeconds || 0) : 0,
                inProgress: false
              };
            });
          }
          parsed.dailyTasks = updatedTasks;
          parsed.checklist = updatedTasks;
          parsed.curriculumVersion = 5;
        } else {
          parsed.checklist = parsed.dailyTasks;
        }
        if (!parsed.totalDays || parsed.totalDays < 45) {
          parsed.totalDays = 45;
        }

        // Guarantee all 100 problems and 20 specs are available, merging user progress
        const cachedDsa = catalogService.getCachedDsaProblems(DSA_PROBLEMS);
        const hasStaleDsa = !parsed.dsaProblems || parsed.dsaProblems.length < cachedDsa.length || !parsed.dsaProblems[0]?.link;
        if (hasStaleDsa) {
          const userDsaMap = new Map((parsed.dsaProblems || []).map(p => [String(p.id), p]));
          parsed.dsaProblems = cachedDsa.map(p => {
            const userP = userDsaMap.get(String(p.id));
            if (!userP) return p;
            return {
              ...p,
              status: userP.status || p.status,
              confidence: userP.confidence ?? p.confidence,
              timeSpent: userP.timeSpent || p.timeSpent,
              notes: userP.notes || p.notes,
              code: userP.code || p.code
            };
          });
        }
        const cachedSpecs = catalogService.getCachedSystemSpecs(SYSTEM_DESIGN_SPECS);
        const hasStaleSpecs = !parsed.systemSpecs || parsed.systemSpecs.length < cachedSpecs.length || parsed.systemSpecs[0]?.title?.includes('Rate Limiter');
        if (hasStaleSpecs) {
          const userSpecMap = new Map((parsed.systemSpecs || []).map(s => [String(s.id), s]));
          parsed.systemSpecs = cachedSpecs.map(s => {
            const userS = userSpecMap.get(String(s.id));
            if (!userS) return s;
            return {
              ...s,
              status: userS.status || s.status,
              stars: userS.stars ?? s.stars,
              timeSpent: userS.timeSpent || s.timeSpent,
              notes: userS.notes || s.notes
            };
          });
        }
        if (!parsed.sysDesignRoadmap || typeof parsed.sysDesignRoadmap !== 'object') {
          parsed.sysDesignRoadmap = {};
        }
        if (!parsed.highlights || typeof parsed.highlights !== 'object') {
          parsed.highlights = {};
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read saved state:', err);
  }
  const fresh = JSON.parse(JSON.stringify(CLEAN_STATE));
  fresh.curriculum = FULL_45_DAY_CURRICULUM;
  return fresh;
}

export const state = loadState();

const stateListeners = new Set();

/**
 * Subscribe to state changes (both local mutations and remote sync updates)
 */
export function subscribeState(listener) {
  stateListeners.add(listener);
  return () => stateListeners.delete(listener);
}

function notifyStateListeners(meta = { isRemote: false }) {
  stateListeners.forEach((listener) => {
    try {
      listener(state, meta);
    } catch (err) {
      console.error('[State] Error in state change subscriber:', err);
    }
  });
}

/**
 * Apply remote state downloaded from Supabase Cloud and update local cache
 */
export function applyRemoteState(remoteData) {
  if (!remoteData || typeof remoteData !== 'object') return;

  if (typeof remoteData.activeDay === 'number') state.activeDay = remoteData.activeDay;
  if (typeof remoteData.totalDays === 'number') state.totalDays = remoteData.totalDays;
  if (typeof remoteData.streak === 'number') state.streak = remoteData.streak;
  if (typeof remoteData.userTrack === 'string') state.userTrack = remoteData.userTrack;
  if (typeof remoteData.dsaSolved === 'number') state.dsaSolved = remoteData.dsaSolved;
  if (typeof remoteData.totalDsa === 'number') state.totalDsa = remoteData.totalDsa;
  if (typeof remoteData.dsaMediumCount === 'number') state.dsaMediumCount = remoteData.dsaMediumCount;
  if (typeof remoteData.dsaHardCount === 'number') state.dsaHardCount = remoteData.dsaHardCount;
  if (typeof remoteData.specsSolved === 'number') state.specsSolved = remoteData.specsSolved;
  if (typeof remoteData.totalSpecs === 'number') state.totalSpecs = remoteData.totalSpecs;
  if (typeof remoteData.nextSpecName === 'string') state.nextSpecName = remoteData.nextSpecName;
  if (typeof remoteData.retentionRate === 'number') state.retentionRate = remoteData.retentionRate;
  if (typeof remoteData.confidenceVelocity === 'string') state.confidenceVelocity = remoteData.confidenceVelocity;

  if (remoteData.dailyTasks && typeof remoteData.dailyTasks === 'object') {
    state.dailyTasks = remoteData.dailyTasks;
    state.checklist = remoteData.dailyTasks;
  }
  if (Array.isArray(remoteData.dsaProblems)) {
    state.dsaProblems = remoteData.dsaProblems;
  }
  if (Array.isArray(remoteData.systemSpecs)) {
    state.systemSpecs = remoteData.systemSpecs;
  }
  if (remoteData.competency && typeof remoteData.competency === 'object') {
    state.competency = { ...state.competency, ...remoteData.competency };
  }
  if (remoteData.readinessRadar && typeof remoteData.readinessRadar === 'object') {
    state.readinessRadar = { ...state.readinessRadar, ...remoteData.readinessRadar };
  }
  if (remoteData.sysDesignRoadmap && typeof remoteData.sysDesignRoadmap === 'object') {
    state.sysDesignRoadmap = { ...state.sysDesignRoadmap, ...remoteData.sysDesignRoadmap };
  }
  if (remoteData.highlights && typeof remoteData.highlights === 'object') {
    state.highlights = { ...state.highlights, ...remoteData.highlights };
  }
  state.curriculum = FULL_45_DAY_CURRICULUM;

  // Persist into local storage
  try {
    if (typeof localStorage !== 'undefined') {
      state.curriculum = undefined;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      state.curriculum = FULL_45_DAY_CURRICULUM;
    }
  } catch (err) {
    console.error('Failed to cache applied remote state:', err);
  }

  notifyStateListeners({ isRemote: true });
}

// Bind state handlers with StateSyncService
stateSyncService.bindStateHandlers({
  getState: () => state,
  applyRemoteState
});

export function saveState() {
  try {
    if (typeof localStorage !== 'undefined') {
      state.curriculum = undefined; // Don't bloat localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      state.curriculum = FULL_45_DAY_CURRICULUM;
    }
  } catch (err) {
    console.error('Failed to save state:', err);
  }
  notifyStateListeners({ isRemote: false });
  stateSyncService.notifyLocalChange(state);
}

export function resetState() {
  startCleanSprint();
}

export function startCleanSprint() {
  const fresh = JSON.parse(JSON.stringify(CLEAN_STATE));
  fresh.curriculum = FULL_45_DAY_CURRICULUM;
  Object.assign(state, fresh);
  saveState();
}

export function loadDemoData() {
  const demo = JSON.parse(JSON.stringify(DEMO_STATE));
  demo.curriculum = FULL_45_DAY_CURRICULUM;
  Object.assign(state, demo);
  saveState();
}

export function setDay(dayNum) {
  if (dayNum < 1 || dayNum > 45) return;
  state.activeDay = dayNum;
  if (!state.dailyTasks[dayNum]) {
    const cur = FULL_45_DAY_CURRICULUM[dayNum];
    const tasks = cur ? JSON.parse(JSON.stringify(cur.tasks)) : [
      { id: `task-${dayNum}-1`, text: `Curated High-Frequency Problem for Day ${dayNum}`, category: 'DSA', done: false },
      { id: `task-${dayNum}-2`, text: `System Architecture Spec Review`, category: 'SYS DESIGN', done: false },
      { id: `task-${dayNum}-3`, text: `Spaced Recall Queue Revision`, category: 'REVISION', done: false }
    ];
    state.dailyTasks[dayNum] = tasks;
    state.checklist[dayNum] = tasks;
  }
  saveState();
}

export function toggleSysDesignRoadmapDay(dayNum) {
  if (!state.sysDesignRoadmap) {
    state.sysDesignRoadmap = {};
  }
  const day = Number(dayNum);
  const current = Boolean(state.sysDesignRoadmap[day]?.completed);
  state.sysDesignRoadmap[day] = {
    completed: !current,
    completedAt: !current ? new Date().toISOString() : null
  };
  saveState();
}

export function toggleTask(dayOrTaskId, maybeTaskId) {
  let dayNum = state.activeDay;
  let taskId = dayOrTaskId;
  if (typeof dayOrTaskId === 'number' && maybeTaskId !== undefined) {
    dayNum = dayOrTaskId;
    taskId = maybeTaskId;
  }

  // Find task in active day, or search all days if needed
  let item = state.dailyTasks[dayNum]?.find(t => t.id === taskId);
  if (!item) {
    for (const d of Object.keys(state.dailyTasks)) {
      const found = state.dailyTasks[d]?.find(t => t.id === taskId);
      if (found) {
        item = found;
        dayNum = Number(d);
        break;
      }
    }
  }
  if (!item) return;

  item.done = !item.done;
  state.checklist[dayNum] = state.dailyTasks[dayNum];

  // Link with catalog problem or spec
  const matched = findMatchingCatalogItem(item);
  if (matched) {
    if (matched.type === 'DSA') {
      const prob = state.dsaProblems.find(p => String(p.id) === String(matched.item.id));
      if (prob) {
        prob.status = item.done ? 'Mastered' : 'Queued';
        prob.confidence = item.done ? Math.max(prob.confidence || 0, 5) : 0;
        catalogService.syncUserProblemProgress(prob.id, 'DSA', {
          status: prob.status,
          confidence: prob.confidence,
          stars: prob.confidence
        });
      }
    } else if (matched.type === 'SYS DESIGN') {
      const spec = state.systemSpecs.find(s => String(s.id) === String(matched.item.id));
      if (spec) {
        spec.status = item.done ? 'Mastered' : 'Queued';
        spec.stars = item.done ? Math.max(spec.stars || 0, 5) : 0;
        catalogService.syncUserProblemProgress(spec.id, 'SYSTEM_DESIGN', {
          status: spec.status,
          confidence: spec.stars,
          stars: spec.stars
        });
      }
    }
  }

  saveState();
}

export function setTaskConfidence(taskId, stars) {
  let dayNum = state.activeDay;
  let item = state.dailyTasks[dayNum]?.find(t => t.id === taskId);
  if (!item) {
    for (const d of Object.keys(state.dailyTasks)) {
      const found = state.dailyTasks[d]?.find(t => t.id === taskId);
      if (found) {
        item = found;
        dayNum = Number(d);
        break;
      }
    }
  }
  if (!item) return;

  item.confidence = stars;
  state.checklist[dayNum] = state.dailyTasks[dayNum];

  // Also sync confidence to linked catalog item
  const matched = findMatchingCatalogItem(item);
  if (matched) {
    if (matched.type === 'DSA') {
      const prob = state.dsaProblems.find(p => String(p.id) === String(matched.item.id));
      if (prob) {
        prob.confidence = stars;
        if (item.done) prob.status = 'Mastered';
        catalogService.syncUserProblemProgress(prob.id, 'DSA', { confidence: stars, stars, status: prob.status });
      }
    } else if (matched.type === 'SYS DESIGN') {
      const spec = state.systemSpecs.find(s => String(s.id) === String(matched.item.id));
      if (spec) {
        spec.stars = stars;
        if (item.done) spec.status = 'Mastered';
        catalogService.syncUserProblemProgress(spec.id, 'SYSTEM_DESIGN', { confidence: stars, stars, status: spec.status });
      }
    }
  }

  saveState();
}

export function completeTask(taskId, explicitStars) {
  let dayNum = state.activeDay;
  let item = state.dailyTasks[dayNum]?.find(t => t.id === taskId);
  if (!item) {
    for (const d of Object.keys(state.dailyTasks)) {
      const found = state.dailyTasks[d]?.find(t => t.id === taskId);
      if (found) {
        item = found;
        dayNum = Number(d);
        break;
      }
    }
  }
  if (!item) return { success: false, reason: 'NOT_FOUND' };

  if (typeof explicitStars === 'number' && explicitStars > 0) {
    item.confidence = explicitStars;
  }

  // Require confidence rating (1-5 stars) before marking as completed
  if (!item.confidence || item.confidence === 0) {
    return { success: false, reason: 'NEEDS_CONFIDENCE' };
  }

  item.done = true;
  item.inProgress = false;
  state.checklist[dayNum] = state.dailyTasks[dayNum];

  // Link with catalog problem or spec
  const matched = findMatchingCatalogItem(item);
  if (matched) {
    if (matched.type === 'DSA') {
      const prob = state.dsaProblems.find(p => String(p.id) === String(matched.item.id));
      if (prob) {
        prob.status = 'Mastered';
        prob.confidence = item.confidence;
        catalogService.syncUserProblemProgress(prob.id, 'DSA', {
          status: prob.status,
          confidence: prob.confidence,
          stars: prob.confidence
        });
      }
    } else if (matched.type === 'SYS DESIGN') {
      const spec = state.systemSpecs.find(s => String(s.id) === String(matched.item.id));
      if (spec) {
        spec.status = 'Mastered';
        spec.stars = item.confidence;
        catalogService.syncUserProblemProgress(spec.id, 'SYSTEM_DESIGN', {
          status: spec.status,
          confidence: spec.stars,
          stars: spec.stars
        });
      }
    }
  }

  saveState();
  return { success: true };
}

export function reopenTask(taskId) {
  let dayNum = state.activeDay;
  let item = state.dailyTasks[dayNum]?.find(t => t.id === taskId);
  if (!item) {
    for (const d of Object.keys(state.dailyTasks)) {
      const found = state.dailyTasks[d]?.find(t => t.id === taskId);
      if (found) {
        item = found;
        dayNum = Number(d);
        break;
      }
    }
  }
  if (!item) return;

  item.done = false;
  item.inProgress = false;
  state.checklist[dayNum] = state.dailyTasks[dayNum];

  const matched = findMatchingCatalogItem(item);
  if (matched) {
    if (matched.type === 'DSA') {
      const prob = state.dsaProblems.find(p => String(p.id) === String(matched.item.id));
      if (prob) {
        prob.status = 'Queued';
        catalogService.syncUserProblemProgress(prob.id, 'DSA', { status: 'Queued' });
      }
    } else if (matched.type === 'SYS DESIGN') {
      const spec = state.systemSpecs.find(s => String(s.id) === String(matched.item.id));
      if (spec) {
        spec.status = 'Queued';
        catalogService.syncUserProblemProgress(spec.id, 'SYSTEM_DESIGN', { status: 'Queued' });
      }
    }
  }

  saveState();
}

export function setTaskTimer(taskId, seconds, isRunning) {
  let dayNum = state.activeDay;
  let item = state.dailyTasks[dayNum]?.find(t => t.id === taskId);
  if (!item) {
    for (const d of Object.keys(state.dailyTasks)) {
      const found = state.dailyTasks[d]?.find(t => t.id === taskId);
      if (found) {
        item = found;
        dayNum = Number(d);
        break;
      }
    }
  }
  if (!item) return;

  if (seconds !== undefined) item.timerSeconds = seconds;
  if (isRunning !== undefined) item.inProgress = isRunning;
  state.checklist[dayNum] = state.dailyTasks[dayNum];
  saveState();
}

export function addTask(dayOrText, textOrCat, maybeCategory = 'DSA') {
  let dayNum = state.activeDay;
  let text = '';
  let category = 'DSA';

  if (typeof dayOrText === 'number') {
    dayNum = dayOrText;
    text = (textOrCat || '').trim();
    category = (maybeCategory || 'DSA').toUpperCase();
  } else {
    text = (dayOrText || '').trim();
    category = (textOrCat || 'DSA').toUpperCase();
  }

  if (!text) return null;
  if (!state.dailyTasks[dayNum]) {
    state.dailyTasks[dayNum] = [];
  }
  const newTask = {
    id: `adhoc-${Date.now()}`,
    text,
    category,
    done: false
  };
  state.dailyTasks[dayNum].push(newTask);
  state.checklist[dayNum] = state.dailyTasks[dayNum];
  saveState();
  return newTask;
}

export function deleteTask(dayOrTaskId, maybeTaskId) {
  let dayNum = state.activeDay;
  let taskId = dayOrTaskId;
  if (typeof dayOrTaskId === 'number' && maybeTaskId !== undefined) {
    dayNum = dayOrTaskId;
    taskId = maybeTaskId;
  }
  if (!state.dailyTasks[dayNum]) return;
  state.dailyTasks[dayNum] = state.dailyTasks[dayNum].filter(t => t.id !== taskId);
  state.checklist[dayNum] = state.dailyTasks[dayNum];
  saveState();
}

/**
 * Update the questions and specs catalog from Supabase while preserving local user progress
 */
export function updateCatalogFromRemote({ dsaProblems, systemSpecs, userProgress }) {
  let changed = false;

  const userProgressMap = new Map();
  if (Array.isArray(userProgress) && userProgress.length > 0) {
    userProgress.forEach(row => {
      userProgressMap.set(String(row.problem_id), row);
    });
  }

  if (Array.isArray(dsaProblems) && dsaProblems.length > 0) {
    const existingMap = new Map((state.dsaProblems || []).map(p => [String(p.id), p]));
    state.dsaProblems = dsaProblems.map(p => {
      const existing = existingMap.get(String(p.id));
      const prog = userProgressMap.get(String(p.id));
      return {
        ...p,
        status: prog?.status || existing?.status || p.status || 'Queued',
        confidence: prog?.confidence_stars ?? existing?.confidence ?? (existing?.stars ?? p.confidence ?? 0),
        notes: prog?.notes || existing?.notes || p.notes || null,
        code: prog?.code_solution || existing?.code || p.code || null
      };
    });
    changed = true;
  }

  if (Array.isArray(systemSpecs) && systemSpecs.length > 0) {
    const existingSpecMap = new Map((state.systemSpecs || []).map(s => [String(s.id), s]));
    state.systemSpecs = systemSpecs.map(s => {
      const existing = existingSpecMap.get(String(s.id));
      const prog = userProgressMap.get(String(s.id));
      return {
        ...s,
        status: prog?.status || existing?.status || s.status || 'Queued',
        stars: prog?.confidence_stars ?? existing?.stars ?? (existing?.confidence ?? s.stars ?? 0),
        notes: prog?.notes || existing?.notes || s.notes || null
      };
    });
    changed = true;
  }

  if (changed) {
    try {
      if (typeof localStorage !== 'undefined') {
        state.curriculum = undefined;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        state.curriculum = FULL_45_DAY_CURRICULUM;
      }
    } catch (e) {
      console.error('Failed to cache catalog updates:', e);
    }
    notifyStateListeners({ isRemote: true, isCatalog: true });
  }
}

export function updateProblemStatus(problemId, newStatus) {
  const isSpec = String(problemId).startsWith('sd-');
  const list = isSpec ? state.systemSpecs : state.dsaProblems;
  const item = list.find(p => String(p.id) === String(problemId));
  if (item) {
    item.status = newStatus;

    // Two-way synchronization: update corresponding checklist tasks if matched
    const isDone = newStatus === 'Mastered';
    for (const d of Object.keys(state.dailyTasks)) {
      const tasks = state.dailyTasks[d] || [];
      let dayChanged = false;
      tasks.forEach(t => {
        const matched = findMatchingCatalogItem(t);
        if (matched && String(matched.item.id) === String(problemId)) {
          t.done = isDone;
          dayChanged = true;
        }
      });
      if (dayChanged) {
        state.checklist[d] = tasks;
      }
    }

    saveState();
    catalogService.syncUserProblemProgress(problemId, isSpec ? 'SYSTEM_DESIGN' : 'DSA', { status: newStatus });
  }
}

export function updateProblemStars(problemId, stars) {
  const isSpec = String(problemId).startsWith('sd-');
  const list = isSpec ? state.systemSpecs : state.dsaProblems;
  const item = list.find(p => String(p.id) === String(problemId));
  if (item) {
    if (isSpec) {
      item.stars = stars;
      if (stars >= 4 && item.status !== 'Mastered') {
        item.status = 'Mastered';
      }
    } else {
      item.confidence = stars;
      if (stars >= 4 && item.status !== 'Mastered') {
        item.status = 'Mastered';
      }
    }

    // Two-way synchronization: update corresponding checklist tasks if marked mastered
    if (item.status === 'Mastered') {
      for (const d of Object.keys(state.dailyTasks)) {
        const tasks = state.dailyTasks[d] || [];
        let dayChanged = false;
        tasks.forEach(t => {
          const matched = findMatchingCatalogItem(t);
          if (matched && String(matched.item.id) === String(problemId)) {
            t.done = true;
            dayChanged = true;
          }
        });
        if (dayChanged) {
          state.checklist[d] = tasks;
        }
      }
    }

    saveState();
    catalogService.syncUserProblemProgress(problemId, isSpec ? 'SYSTEM_DESIGN' : 'DSA', {
      confidence: stars,
      stars,
      status: item.status
    });
  }
}
