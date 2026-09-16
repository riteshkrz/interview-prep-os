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
    phase: "Phase 3: Graphs, Trees & Scalable Infrastructure",
    topic: "BST Bounded Invariants & Push Notifications",
    objective: "Extract kth smallest items using inorder traversal and design high-volume notification pipelines with priority queues.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-22-1", text: "Solve Kth Smallest Element in a BST (BST (Inorder))", category: "DSA", done: false },
      { id: "task-22-2", text: "Architect Notification System (e.g., Firebase Cloud Messaging / Apple Push) (Priority Queues & Gateway Decoupling)", category: "SYS DESIGN", done: false }
    ]
  },
  23: {
    day: 23,
    week: 4,
    phase: "Phase 3: Graphs, Trees & Scalable Infrastructure",
    topic: "Tree Reconstruction & Maximum Path Sums",
    objective: "Rebuild binary trees from preorder/inorder traversals and find global maximum path sums using post-order DFS.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-23-1", text: "Solve Construct Binary Tree from Preorder and Inorder Traversal (Tree Reconstruction)", category: "DSA", done: false },
      { id: "task-23-2", text: "Solve Binary Tree Maximum Path Sum (Trees (DFS Post-order))", category: "DSA", done: false },
      { id: "task-23-3", text: "Solve Kth Largest Element in an Array (Min-Heap / Quickselect)", category: "DSA", done: false }
    ]
  },
  24: {
    day: 24,
    week: 4,
    phase: "Phase 3: Graphs, Trees & Scalable Infrastructure",
    topic: "Tree Serialization & Web Scale Indexing",
    objective: "Serialize and deserialize trees via string encoders and architect distributed web crawlers with polite URL frontiers.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-24-1", text: "Solve Serialize and Deserialize Binary Tree (Tree Traversal / Design)", category: "DSA", done: false },
      { id: "task-24-2", text: "Architect Web Crawler & Search Indexer (e.g., Googlebot) (URL Frontier, Deduplication & Inverted Indexing)", category: "SYS DESIGN", done: false }
    ]
  },
  25: {
    day: 25,
    week: 4,
    phase: "Phase 3: Graphs, Trees & Scalable Infrastructure",
    topic: "Trie Data Structures & Geospatial Dispatch Engines",
    objective: "Implement N-ary Trie prefix trees and architect ride-hailing dispatch engines with H3 hexagonal spatial indexing.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-25-1", text: "Solve Implement Trie (Prefix Tree) (Trie Design)", category: "DSA", done: false },
      { id: "task-25-2", text: "Architect Ride-Sharing / Dispatch Service (e.g., Uber / Lyft) (Geospatial Indexing & Real-Time Driver Matching)", category: "SYS DESIGN", done: false }
    ]
  },
  26: {
    day: 26,
    week: 4,
    phase: "Phase 3: Graphs, Trees & Scalable Infrastructure",
    topic: "Wildcard Trie Backtracking & Spatial Geohashing",
    objective: "Search dictionary words with wildcard characters and design proximity location servers using geohash quadtrees.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-26-1", text: "Solve Design Add and Search Words Data Structure (Trie / Backtracking)", category: "DSA", done: false },
      { id: "task-26-2", text: "Architect Proximity Server (e.g., Yelp / Google Maps Places) (Read-Heavy Spatial Queries & Radius Indexing)", category: "SYS DESIGN", done: false }
    ]
  },
  27: {
    day: 27,
    week: 4,
    phase: "Phase 3: Graphs, Trees & Scalable Infrastructure",
    topic: "2D Board Tries & Priority Task Scheduling",
    objective: "Find multi-word targets on boards using Trie DFS and schedule tasks with cooling intervals using max-heaps.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-27-1", text: "Solve Word Search II (Trie / Matrix Backtracking)", category: "DSA", done: false },
      { id: "task-27-2", text: "Solve Task Scheduler (Max-Heap / Greedy)", category: "DSA", done: false },
      { id: "task-27-3", text: "Solve Design Twitter (Heap / System Design)", category: "DSA", done: false }
    ]
  },
  28: {
    day: 28,
    week: 4,
    phase: "Phase 3: Graphs, Trees & Scalable Infrastructure",
    topic: "Streaming Medians & Power Set Backtracking",
    objective: "Maintain continuous medians with dual heaps and generate complete power sets using state backtracking.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-28-1", text: "Solve Find Median from Data Stream (Two Heaps)", category: "DSA", done: false },
      { id: "task-28-2", text: "Solve Subsets (Backtracking)", category: "DSA", done: false },
      { id: "task-28-3", text: "Solve Combination Sum (Backtracking)", category: "DSA", done: false }
    ]
  },
  29: {
    day: 29,
    week: 5,
    phase: "Phase 4: Dynamic Programming & High-Concurrency Systems",
    topic: "Array Permutations, Matrix Word Searches & Partitions",
    objective: "Generate all distinct integer orderings, search matrix words with backtracking, and partition palindromes.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-29-1", text: "Solve Permutations (Backtracking)", category: "DSA", done: false },
      { id: "task-29-2", text: "Solve Word Search (Matrix Backtracking)", category: "DSA", done: false },
      { id: "task-29-3", text: "Solve Palindrome Partitioning (Backtracking)", category: "DSA", done: false }
    ]
  },
  30: {
    day: 30,
    week: 5,
    phase: "Phase 4: Dynamic Programming & High-Concurrency Systems",
    topic: "High-Concurrency Milestone: Flash Sales & Ledger Systems",
    objective: "Architect distributed flash sale engines with Redis locks and double-entry payment ledger systems with Saga idempotency.",
    headlineTarget: "2 System Design Specs (Milestone)",
    estTime: "90 mins",
    tasks: [
      { id: "task-30-1", text: "Architect E-Commerce Flash Sale System (e.g., Amazon Prime Day / Ticketmaster) (High-Concurrency Inventory Locks & Thundering Herd)", category: "SYS DESIGN", done: false },
      { id: "task-30-2", text: "Architect Payment Processing & Ledger System (e.g., Stripe / PayPal) (Distributed Transactions, Idempotency & Double-Entry)", category: "SYS DESIGN", done: false }
    ]
  },
  31: {
    day: 31,
    week: 5,
    phase: "Phase 4: Dynamic Programming & High-Concurrency Systems",
    topic: "N-Queens Constraints & Anycast Edge Caching",
    objective: "Place non-attacking queens with diagonal bitmasks and architect Content Delivery Networks with Anycast and origin shields.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-31-1", text: "Solve N-Queens (Backtracking)", category: "DSA", done: false },
      { id: "task-31-2", text: "Architect Content Delivery Network (CDN) (Anycast BGP Routing & Origin Shielding)", category: "SYS DESIGN", done: false }
    ]
  },
  32: {
    day: 32,
    week: 5,
    phase: "Phase 4: Dynamic Programming & High-Concurrency Systems",
    topic: "Connected Components & Adaptive Video Streaming",
    objective: "Count connected island components in binary grids and architect video streaming pipelines with chunking and adaptive bitrate.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-32-1", text: "Solve Number of Islands (Graph (Matrix BFS/DFS))", category: "DSA", done: false },
      { id: "task-32-2", text: "Architect Video Streaming Platform (e.g., YouTube / Netflix) (Adaptive Bitrate Streaming (DASH/HLS) & Video Ingestion)", category: "SYS DESIGN", done: false }
    ]
  },
  33: {
    day: 33,
    week: 5,
    phase: "Phase 4: Dynamic Programming & High-Concurrency Systems",
    topic: "Graph Deep Copies & Real-Time Collaborative Docs",
    objective: "Construct deep copies of undirected graphs and architect collaborative document editors with CRDTs and vector clocks.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-33-1", text: "Solve Clone Graph (Graph (BFS/DFS))", category: "DSA", done: false },
      { id: "task-33-2", text: "Architect Collaborative Document Editor (e.g., Google Docs / Notion) (Conflict Resolution (OT vs. CRDTs))", category: "SYS DESIGN", done: false }
    ]
  },
  34: {
    day: 34,
    week: 5,
    phase: "Phase 4: Dynamic Programming & High-Concurrency Systems",
    topic: "Reverse Ocean Flow & Ranked Social Feeds",
    objective: "Perform multi-source searches from ocean borders and architect social news feeds with fan-out-on-write and ranking.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-34-1", text: "Solve Pacific Atlantic Water Flow (Graph (Multi-source BFS/DFS))", category: "DSA", done: false },
      { id: "task-34-2", text: "Architect Social Media News Feed (e.g., Twitter / Instagram / Facebook) (Fan-Out Engine & Hybrid Timeline Aggregation)", category: "SYS DESIGN", done: false }
    ]
  },
  35: {
    day: 35,
    week: 5,
    phase: "Phase 4: Dynamic Programming & High-Concurrency Systems",
    topic: "Multi-Source Queue Rot & Time-Series Observability",
    objective: "Simulate minute-by-minute contagion in grids with BFS and architect TSDB metrics systems with Gorilla compression.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-35-1", text: "Solve Rotting Oranges (Graph (Multi-source BFS))", category: "DSA", done: false },
      { id: "task-35-2", text: "Architect Metrics & Logging Monitoring System (e.g., Datadog / Prometheus) (Time-Series Database (TSDB) & Inverted Metric Index)", category: "SYS DESIGN", done: false }
    ]
  },
  36: {
    day: 36,
    week: 6,
    phase: "Phase 5: Advanced Graphs, Dynamic Programming & Scale",
    topic: "Graph Cycle Detection & Distributed Job Orchestration",
    objective: "Detect circular prerequisite dependencies with cycle DFS and architect distributed task schedulers with delayed queues.",
    headlineTarget: "1 DSA + 1 System Design Spec",
    estTime: "80 mins",
    tasks: [
      { id: "task-36-1", text: "Solve Course Schedule (Graph (Cycle Detection))", category: "DSA", done: false },
      { id: "task-36-2", text: "Architect Distributed Task Scheduler / Job Queue (e.g., Celery / AWS Step Functions) (Two-Tier Scheduling & Worker Heartbeat Leases)", category: "SYS DESIGN", done: false }
    ]
  },
  37: {
    day: 37,
    week: 6,
    phase: "Phase 5: Advanced Graphs, Dynamic Programming & Scale",
    topic: "Topological Ordering, Disjoint Sets & Shortest Path",
    objective: "Order prerequisite tasks with Kahn's algorithm, find redundant cyclic edges with Union-Find, and calculate network delays.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-37-1", text: "Solve Course Schedule II (Topological Sort)", category: "DSA", done: false },
      { id: "task-37-2", text: "Solve Redundant Connection (Disjoint Set Union (DSU))", category: "DSA", done: false },
      { id: "task-37-3", text: "Solve Network Delay Time (Graph (Dijkstra))", category: "DSA", done: false }
    ]
  },
  38: {
    day: 38,
    week: 6,
    phase: "Phase 5: Advanced Graphs, Dynamic Programming & Scale",
    topic: "Bounded Flight Routes & Bidirectional Word Transformations",
    objective: "Find cheapest routes with Bellman-Ford / BFS, mutate words with bidirectional BFS, and solve stair climbing.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-38-1", text: "Solve Cheapest Flights Within K Stops (Graph (Bellman-Ford / BFS))", category: "DSA", done: false },
      { id: "task-38-2", text: "Solve Word Ladder (Graph (Bidirectional BFS))", category: "DSA", done: false },
      { id: "task-38-3", text: "Solve Climbing Stairs (1-D DP (Fibonacci))", category: "DSA", done: false }
    ]
  },
  39: {
    day: 39,
    week: 6,
    phase: "Phase 5: Advanced Graphs, Dynamic Programming & Scale",
    topic: "1-D Dynamic Programming & Circular Housing",
    objective: "Formulate dynamic optimal sub-structure for linear and circular houses without triggering alarms.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-39-1", text: "Solve House Robber (1-D DP)", category: "DSA", done: false },
      { id: "task-39-2", text: "Solve House Robber II (1-D DP (Circular))", category: "DSA", done: false },
      { id: "task-39-3", text: "Solve Longest Palindromic Substring (1-D DP / Expand Center)", category: "DSA", done: false }
    ]
  },
  40: {
    day: 40,
    week: 6,
    phase: "Phase 5: Advanced Graphs, Dynamic Programming & Scale",
    topic: "Unbounded Knapsacks & Kadane Maximum Subarrays",
    objective: "Solve minimum coin combinations with unbounded knapsacks and find contiguous maximum subarrays with Kadane's algorithm.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-40-1", text: "Solve Coin Change (1-D DP (Unbounded Knapsack))", category: "DSA", done: false },
      { id: "task-40-2", text: "Solve Maximum Subarray (Kadane's Algorithm / 1-D DP)", category: "DSA", done: false },
      { id: "task-40-3", text: "Solve Maximum Product Subarray (1-D DP (State Tracking))", category: "DSA", done: false }
    ]
  },
  41: {
    day: 41,
    week: 6,
    phase: "Phase 5: Advanced Graphs, Dynamic Programming & Scale",
    topic: "Word Break Segmentation & Longest Increasing Subsequences",
    objective: "Determine space-separated dictionary word validity with DP and find increasing subsequences via patience sorting.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-41-1", text: "Solve Word Break (1-D DP)", category: "DSA", done: false },
      { id: "task-41-2", text: "Solve Longest Increasing Subsequence (1-D DP / Binary Search)", category: "DSA", done: false },
      { id: "task-41-3", text: "Solve Unique Paths (2-D DP (Grid))", category: "DSA", done: false }
    ]
  },
  42: {
    day: 42,
    week: 6,
    phase: "Phase 5: Advanced Graphs, Dynamic Programming & Scale",
    topic: "2-D Dynamic Programming & Common Subsequences",
    objective: "Compute length of longest shared subsequences across two strings and assign signs to reach target evaluations.",
    headlineTarget: "3 DSA Problems",
    estTime: "70 mins",
    tasks: [
      { id: "task-42-1", text: "Solve Longest Common Subsequence (2-D DP (String Matching))", category: "DSA", done: false },
      { id: "task-42-2", text: "Solve Target Sum (2-D DP (0/1 Knapsack))", category: "DSA", done: false },
      { id: "task-42-3", text: "Solve Interleaving String (2-D DP (String Matching))", category: "DSA", done: false }
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
  sysDesignRoadmap: {}
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
  systemSpecs: SYSTEM_DESIGN_SPECS
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
