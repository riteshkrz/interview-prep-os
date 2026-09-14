import fs from 'fs';

export const RAW_DSA_TABLE = [
  {
    order: 1,
    title: 'Two Sum',
    description: 'Find two indices whose values sum to a specific target using a hash map for $O(n)$ lookup.',
    pattern: 'Arrays & Hashing',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/two-sum/'
  },
  {
    order: 2,
    title: 'Valid Anagram',
    description: 'Determine if two strings are permutations of each other using frequency counts.',
    pattern: 'Arrays & Hashing',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/valid-anagram/'
  },
  {
    order: 3,
    title: 'Group Anagrams',
    description: 'Group strings that share the same character frequencies using sorted keys or tuples.',
    pattern: 'Arrays & Hashing',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/group-anagrams/'
  },
  {
    order: 4,
    title: 'Top K Frequent Elements',
    description: 'Identify the $k$ most frequent numbers using a min-heap or bucket sort in linear time.',
    pattern: 'Arrays & Hashing',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/top-k-frequent-elements/'
  },
  {
    order: 5,
    title: 'Product of Array Except Self',
    description: 'Calculate prefix and suffix products for each index without using division in $O(1)$ extra space.',
    pattern: 'Arrays & Hashing',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/product-of-array-except-self/'
  },
  {
    order: 6,
    title: 'Longest Consecutive Sequence',
    description: 'Find the length of the longest streak of consecutive numbers using a hash set in $O(n)$ time.',
    pattern: 'Arrays & Hashing',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-consecutive-sequence/'
  },
  {
    order: 7,
    title: 'Subarray Sum Equals K',
    description: 'Count continuous subarrays summing to $k$ by tracking prefix sum frequencies in a hash map.',
    pattern: 'Prefix Sum',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/subarray-sum-equals-k/'
  },
  {
    order: 8,
    title: 'Next Permutation',
    description: 'Rearrange numbers into the lexicographically next greater permutation in-place.',
    pattern: 'Arrays & Math',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/next-permutation/'
  },
  {
    order: 9,
    title: 'First Missing Positive',
    description: 'Find the smallest missing positive integer in $O(n)$time and $O(1)$space using cyclic placement.',
    pattern: 'Cyclic Sort / Arrays',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/first-missing-positive/'
  },
  {
    order: 10,
    title: 'Valid Palindrome',
    description: 'Verify if a string reads identically forwards and backwards ignoring non-alphanumeric characters.',
    pattern: 'Two Pointers',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/valid-palindrome/'
  },
  {
    order: 11,
    title: 'Two Sum II - Input Array Is Sorted',
    description: 'Find two numbers summing to target in a 1-indexed sorted array using inward-moving pointers.',
    pattern: 'Two Pointers',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'
  },
  {
    order: 12,
    title: '3Sum',
    description: 'Find all unique triplets summing to zero by sorting the array and running two-pointer scans.',
    pattern: 'Two Pointers',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/3sum/'
  },
  {
    order: 13,
    title: 'Container With Most Water',
    description: 'Maximize water trapped between two vertical lines by moving the pointer with the smaller height.',
    pattern: 'Two Pointers',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/container-with-most-water/'
  },
  {
    order: 14,
    title: 'Trapping Rain Water',
    description: 'Compute total rainwater trapped across elevation bars using two pointers or prefix maximums.',
    pattern: 'Two Pointers / Monotonic Stack',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/trapping-rain-water/'
  },
  {
    order: 15,
    title: 'Best Time to Buy and Sell Stock',
    description: 'Find maximum profit from a single buy-sell transaction by tracking the running minimum price.',
    pattern: 'Sliding Window',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
  },
  {
    order: 16,
    title: 'Longest Substring Without Repeating Characters',
    description: 'Find length of longest substring without duplicates by expanding/contracting a dynamic window.',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
  },
  {
    order: 17,
    title: 'Longest Repeating Character Replacement',
    description: 'Find longest substring with identical letters achievable by replacing at most $k$characters.',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-repeating-character-replacement/'
  },
  {
    order: 18,
    title: 'Permutation in String',
    description: 'Determine if string $s_2$ contains a substring that is an exact permutation of string $s_1$.',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/permutation-in-string/'
  },
  {
    order: 19,
    title: 'Minimum Window Substring',
    description: 'Find the smallest substring of $s$containing every character from $t$using frequency matching.',
    pattern: 'Sliding Window',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/minimum-window-substring/'
  },
  {
    order: 20,
    title: 'Sliding Window Maximum',
    description: 'Return the maximum element in each sliding window of size $k$ using a monotonic deque.',
    pattern: 'Sliding Window / Deque',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/sliding-window-maximum/'
  },
  {
    order: 21,
    title: 'Valid Parentheses',
    description: 'Validate balanced opening and closing bracket pairs using a Last-In-First-Out stack.',
    pattern: 'Stack',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/valid-parentheses/'
  },
  {
    order: 22,
    title: 'Min Stack',
    description: 'Design a stack supporting push, pop, top, and retrieving the minimum element in $O(1)$ time.',
    pattern: 'Stack Design',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/min-stack/'
  },
  {
    order: 23,
    title: 'Evaluate Reverse Polish Notation',
    description: 'Evaluate arithmetic expressions written in postfix notation using an operand stack.',
    pattern: 'Stack',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'
  },
  {
    order: 24,
    title: 'Daily Temperatures',
    description: 'Calculate days until a warmer temperature for each day using a decreasing monotonic stack.',
    pattern: 'Monotonic Stack',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/daily-temperatures/'
  },
  {
    order: 25,
    title: 'Largest Rectangle in Histogram',
    description: 'Compute the largest rectangular area in a histogram using an increasing monotonic stack.',
    pattern: 'Monotonic Stack',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/'
  },
  {
    order: 26,
    title: 'Basic Calculator',
    description: 'Evaluate mathematical string expressions containing +, -, and parentheses using a stack.',
    pattern: 'Stack / Parsing',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/basic-calculator/'
  },
  {
    order: 27,
    title: 'Binary Search',
    description: 'Locate the index of a target value within an ascending sorted array in $O(\\log n)$time.',
    pattern: 'Binary Search',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/binary-search/'
  },
  {
    order: 28,
    title: 'Search a 2D Matrix',
    description: 'Search for a target in an $m \\times n$matrix with row-sorted properties by treating it as 1D.',
    pattern: 'Binary Search',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/search-a-2d-matrix/'
  },
  {
    order: 29,
    title: 'Find Minimum in Rotated Sorted Array',
    description: 'Find the inflection/minimum point in a sorted array rotated between 1 and $n$ times.',
    pattern: 'Binary Search',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'
  },
  {
    order: 30,
    title: 'Search in Rotated Sorted Array',
    description: 'Locate target in a rotated sorted array by determining which half is strictly ordered.',
    pattern: 'Binary Search',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
  },
  {
    order: 31,
    title: 'Koko Eating Bananas',
    description: 'Find the minimum integer eating speed $k$ to finish all bananas within $h$hours.',
    pattern: 'Binary Search on Answer',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/koko-eating-bananas/'
  },
  {
    order: 32,
    title: 'Time Based Key-Value Store',
    description: 'Store key-value pairs with timestamps and retrieve values at or before a given timestamp.',
    pattern: 'Binary Search / Design',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/time-based-key-value-store/'
  },
  {
    order: 33,
    title: 'Median of Two Sorted Arrays',
    description: 'Find the combined median of two sorted arrays in $O(\\log(\\min(m, n)))$using binary partition.',
    pattern: 'Binary Search',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'
  },
  {
    order: 34,
    title: 'Reverse Linked List',
    description: 'Invert the direction of pointers in a singly-linked list iteratively or recursively.',
    pattern: 'Linked List',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/reverse-linked-list/'
  },
  {
    order: 35,
    title: 'Merge Two Sorted Lists',
    description: 'Combine two sorted linked lists into a single continuous sorted list using dummy head nodes.',
    pattern: 'Linked List',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/merge-two-sorted-lists/'
  },
  {
    order: 36,
    title: 'Linked List Cycle',
    description: 'Detect if a cycle exists in a linked list using Floyd\'s slow and fast pointer algorithm.',
    pattern: 'Fast & Slow Pointers',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/linked-list-cycle/'
  },
  {
    order: 37,
    title: 'Reorder List',
    description: 'Reorder a list to alternating first and last elements: $L_0 \\to L_n \\to L_1 \\to L_{n-1} \\dots$.',
    pattern: 'Linked List',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/reorder-list/'
  },
  {
    order: 38,
    title: 'Remove Nth Node From End of List',
    description: 'Delete the $n$-th node from the tail in a single pass using two offset pointers.',
    pattern: 'Fast & Slow Pointers',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
  },
  {
    order: 39,
    title: 'Copy List with Random Pointer',
    description: 'Create a deep copy of a list with arbitrary random pointers via hash map or node interleaving.',
    pattern: 'Linked List / Hash Map',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/copy-list-with-random-pointer/'
  },
  {
    order: 40,
    title: 'LRU Cache',
    description: 'Implement an eviction cache supporting $O(1)$ get and put using a doubly-linked list and map.',
    pattern: 'Doubly Linked List / Hash Map',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/lru-cache/'
  },
  {
    order: 41,
    title: 'Merge k Sorted Lists',
    description: 'Merge $k$ sorted linked lists into one sorted list using a min-heap or divide-and-conquer.',
    pattern: 'Heap / Divide & Conquer',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/merge-k-sorted-lists/'
  },
  {
    order: 42,
    title: 'Reverse Nodes in k-Group',
    description: 'Reverse nodes of a linked list $k$ at a time, leaving remaining sub-groups unmodified.',
    pattern: 'Linked List',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/'
  },
  {
    order: 43,
    title: 'Invert Binary Tree',
    description: 'Swap left and right child nodes for every node in a binary tree recursively.',
    pattern: 'Trees (DFS)',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/invert-binary-tree/'
  },
  {
    order: 44,
    title: 'Maximum Depth of Binary Tree',
    description: 'Calculate the maximum number of nodes along the longest path from root to leaf node.',
    pattern: 'Trees (DFS/BFS)',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
  },
  {
    order: 45,
    title: 'Diameter of Binary Tree',
    description: 'Find the longest path between any two nodes in a tree, measured by edge count.',
    pattern: 'Trees (DFS)',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/diameter-of-binary-tree/'
  },
  {
    order: 46,
    title: 'Same Tree',
    description: 'Check if two binary trees are structurally identical and share matching node values.',
    pattern: 'Trees (DFS)',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/same-tree/'
  },
  {
    order: 47,
    title: 'Lowest Common Ancestor of a BST',
    description: 'Locate the deepest shared ancestor node of two given targets utilizing BST ordering.',
    pattern: 'BST Traversal',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/'
  },
  {
    order: 48,
    title: 'Binary Tree Level Order Traversal',
    description: 'Return node values level-by-level from left to right using a breadth-first queue.',
    pattern: 'Trees (BFS)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
  },
  {
    order: 49,
    title: 'Validate Binary Search Tree',
    description: 'Verify if every node strictly adheres to left-child-smaller and right-child-greater bounds.',
    pattern: 'BST Traversal',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/validate-binary-search-tree/'
  },
  {
    order: 50,
    title: 'Kth Smallest Element in a BST',
    description: 'Find the $k$-th smallest value in a BST using an iterative or recursive inorder traversal.',
    pattern: 'BST (Inorder)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'
  },
  {
    order: 51,
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    description: 'Rebuild a binary tree from preorder root order and inorder sub-tree partition boundaries.',
    pattern: 'Tree Reconstruction',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/'
  },
  {
    order: 52,
    title: 'Binary Tree Maximum Path Sum',
    description: 'Find the non-empty path through any sequence of nodes yielding the largest sum.',
    pattern: 'Trees (DFS Post-order)',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/'
  },
  {
    order: 53,
    title: 'Serialize and Deserialize Binary Tree',
    description: 'Convert a binary tree to a serialized string format and reliably reconstruct it back.',
    pattern: 'Tree Traversal / Design',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/'
  },
  {
    order: 54,
    title: 'Implement Trie (Prefix Tree)',
    description: 'Build an $N$-ary prefix tree supporting efficient insert, search, and startsWith.',
    pattern: 'Trie Design',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
  },
  {
    order: 55,
    title: 'Design Add and Search Words Data Structure',
    description: 'Implement a word dictionary trie supporting wildcard character . pattern searches.',
    pattern: 'Trie / Backtracking',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/'
  },
  {
    order: 56,
    title: 'Word Search II',
    description: 'Find all words from a dictionary present on a 2D board using a combined Trie and DFS.',
    pattern: 'Trie / Matrix Backtracking',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/word-search-ii/'
  },
  {
    order: 57,
    title: 'Kth Largest Element in an Array',
    description: 'Retrieve the $k$-th largest item in an unsorted list via min-heap or quickselect partition.',
    pattern: 'Min-Heap / Quickselect',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/'
  },
  {
    order: 58,
    title: 'Task Scheduler',
    description: 'Find least CPU intervals needed to run tasks separated by cooling period $n$using greedy frequency.',
    pattern: 'Max-Heap / Greedy',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/task-scheduler/'
  },
  {
    order: 59,
    title: 'Design Twitter',
    description: 'Implement posting tweets, following users, and pulling 10 most recent feeds using heaps.',
    pattern: 'Heap / System Design',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/design-twitter/'
  },
  {
    order: 60,
    title: 'Find Median from Data Stream',
    description: 'Maintain running real-time median of incoming continuous numbers using balanced heaps.',
    pattern: 'Two Heaps',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/find-median-from-data-stream/'
  },
  {
    order: 61,
    title: 'Subsets',
    description: 'Generate the complete power set of unique elements using state backtracking.',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/subsets/'
  },
  {
    order: 62,
    title: 'Combination Sum',
    description: 'Find all distinct candidate combinations summing to target with unlimited element reuse.',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/combination-sum/'
  },
  {
    order: 63,
    title: 'Permutations',
    description: 'Generate all distinct complete orderings of an array of distinct integer values.',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/permutations/'
  },
  {
    order: 64,
    title: 'Word Search',
    description: 'Determine if a target string exists along horizontally/vertically adjacent cells in a grid.',
    pattern: 'Matrix Backtracking',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/word-search/'
  },
  {
    order: 65,
    title: 'Palindrome Partitioning',
    description: 'Partition a string such that every substring in each partition is a valid palindrome.',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/palindrome-partitioning/'
  },
  {
    order: 66,
    title: 'N-Queens',
    description: 'Place $n$ non-attacking queens on an $n \\times n$chessboard tracking column and diagonal attacks.',
    pattern: 'Backtracking',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/n-queens/'
  },
  {
    order: 67,
    title: 'Number of Islands',
    description: 'Count distinct connected components of \'1\'s surrounded by water in a 2D binary grid.',
    pattern: 'Graph (Matrix BFS/DFS)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/number-of-islands/'
  },
  {
    order: 68,
    title: 'Clone Graph',
    description: 'Construct a deep copy of a connected, undirected graph with unique node references.',
    pattern: 'Graph (BFS/DFS)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/clone-graph/'
  },
  {
    order: 69,
    title: 'Pacific Atlantic Water Flow',
    description: 'Find cells that can flow water to both Pacific and Atlantic oceans via reverse ocean searches.',
    pattern: 'Graph (Multi-source BFS/DFS)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/'
  },
  {
    order: 70,
    title: 'Rotting Oranges',
    description: 'Determine minutes until all fresh oranges rot in a grid using a multi-source BFS queue.',
    pattern: 'Graph (Multi-source BFS)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/rotting-oranges/'
  },
  {
    order: 71,
    title: 'Course Schedule',
    description: 'Detect if circular dependencies exist in prerequisite course pairs using cycle detection.',
    pattern: 'Graph (Cycle Detection)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/course-schedule/'
  },
  {
    order: 72,
    title: 'Course Schedule II',
    description: 'Return a valid linear order to finish all courses using Kahn\'s topological sort algorithm.',
    pattern: 'Topological Sort',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/course-schedule-ii/'
  },
  {
    order: 73,
    title: 'Redundant Connection',
    description: 'Find an edge that can be removed to turn a cyclic graph into a tree using Union-Find.',
    pattern: 'Disjoint Set Union (DSU)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/redundant-connection/'
  },
  {
    order: 74,
    title: 'Network Delay Time',
    description: 'Calculate time for all nodes to receive a signal using Dijkstra\'s shortest path algorithm.',
    pattern: 'Graph (Dijkstra)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/network-delay-time/'
  },
  {
    order: 75,
    title: 'Cheapest Flights Within K Stops',
    description: 'Find cheapest travel route between source and destination with at most $k$intermediate stops.',
    pattern: 'Graph (Bellman-Ford / BFS)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/'
  },
  {
    order: 76,
    title: 'Word Ladder',
    description: 'Find length of shortest transformation sequence from start to end word mutating one char at a time.',
    pattern: 'Graph (Bidirectional BFS)',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/word-ladder/'
  },
  {
    order: 77,
    title: 'Climbing Stairs',
    description: 'Count distinct combinations to reach the top of an $n$-step staircase taking 1 or 2 steps.',
    pattern: '1-D DP (Fibonacci)',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/climbing-stairs/'
  },
  {
    order: 78,
    title: 'House Robber',
    description: 'Maximize stolen wealth without alerting police by avoiding robbing adjacent houses.',
    pattern: '1-D DP',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/house-robber/'
  },
  {
    order: 79,
    title: 'House Robber II',
    description: 'Maximize stolen wealth when houses are arranged in a circle, making the first and last adjacent.',
    pattern: '1-D DP (Circular)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/house-robber-ii/'
  },
  {
    order: 80,
    title: 'Longest Palindromic Substring',
    description: 'Find the longest continuous substring in $s$ that forms a symmetric palindrome.',
    pattern: '1-D DP / Expand Center',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-palindromic-substring/'
  },
  {
    order: 81,
    title: 'Coin Change',
    description: 'Compute minimum coins required to form a given amount using an unbounded knapsack approach.',
    pattern: '1-D DP (Unbounded Knapsack)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/coin-change/'
  },
  {
    order: 82,
    title: 'Maximum Subarray',
    description: 'Find the contiguous subarray having the largest sum using Kadane\'s single-pass dynamic model.',
    pattern: 'Kadane\'s Algorithm / 1-D DP',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/maximum-subarray/'
  },
  {
    order: 83,
    title: 'Maximum Product Subarray',
    description: 'Find contiguous subarray with largest product, tracking both running min and max products.',
    pattern: '1-D DP (State Tracking)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/maximum-product-subarray/'
  },
  {
    order: 84,
    title: 'Word Break',
    description: 'Determine if a string can be segmented into space-separated dictionary words using DP.',
    pattern: '1-D DP',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/word-break/'
  },
  {
    order: 85,
    title: 'Longest Increasing Subsequence',
    description: 'Find length of longest strictly increasing subsequence in $O(n \\log n)$ via patience sorting.',
    pattern: '1-D DP / Binary Search',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-increasing-subsequence/'
  },
  {
    order: 86,
    title: 'Unique Paths',
    description: 'Count unique paths from top-left to bottom-right of an $m \\times n$ grid moving only down or right.',
    pattern: '2-D DP (Grid)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/unique-paths/'
  },
  {
    order: 87,
    title: 'Longest Common Subsequence',
    description: 'Find length of the longest subsequence shared across two input strings.',
    pattern: '2-D DP (String Matching)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-common-subsequence/'
  },
  {
    order: 88,
    title: 'Target Sum',
    description: 'Find number of ways to assign + and - signs to array elements to evaluate to target.',
    pattern: '2-D DP (0/1 Knapsack)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/target-sum/'
  },
  {
    order: 89,
    title: 'Interleaving String',
    description: 'Determine whether string $s_3$ is formed by an interleaving of strings $s_1$ and $s_2$.',
    pattern: '2-D DP (String Matching)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/interleaving-string/'
  },
  {
    order: 90,
    title: 'Edit Distance',
    description: 'Find minimum insertions, deletions, or substitutions to transform one string into another.',
    pattern: '2-D DP (String Matching)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/edit-distance/'
  },
  {
    order: 91,
    title: 'Burst Balloons',
    description: 'Maximize coins collected by strategically choosing the bursting order of interval balloons.',
    pattern: '2-D DP (Interval DP)',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/burst-balloons/'
  },
  {
    order: 92,
    title: 'Insert Interval',
    description: 'Insert a new interval into a sorted list of non-overlapping intervals and merge collisions.',
    pattern: 'Intervals',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/insert-interval/'
  },
  {
    order: 93,
    title: 'Merge Intervals',
    description: 'Combine all overlapping intervals into non-overlapping spans by sorting on start times.',
    pattern: 'Intervals',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/merge-intervals/'
  },
  {
    order: 94,
    title: 'Non-overlapping Intervals',
    description: 'Find minimum intervals to remove to eliminate all overlaps using greedy earliest-end-time.',
    pattern: 'Intervals (Greedy)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/non-overlapping-intervals/'
  },
  {
    order: 95,
    title: 'Minimum Number of Arrows to Burst Balloons',
    description: 'Determine minimum arrows shot along $x$-axis to pop balloons represented as intervals.',
    pattern: 'Intervals (Greedy)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/'
  },
  {
    order: 96,
    title: 'Single Number',
    description: 'Identify the unique element appearing once in an array where all others appear twice using XOR.',
    pattern: 'Bit Manipulation (XOR)',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/single-number/'
  },
  {
    order: 97,
    title: 'Counting Bits',
    description: 'Return array of set-bit counts ($1$s) for every number from $0$ up to $n$ in linear time.',
    pattern: 'Bit Manipulation / DP',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/counting-bits/'
  },
  {
    order: 98,
    title: 'Set Matrix Zeroes',
    description: 'If an element in an $m \\times n$ matrix is $0$, set its entire row and column to $0$ in-place.',
    pattern: 'Matrix (In-place Marking)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/set-matrix-zeroes/'
  },
  {
    order: 99,
    title: 'Spiral Matrix',
    description: 'Return all elements of an $m \\times n$matrix in spiral order by contracting boundary pointers.',
    pattern: 'Matrix (Boundary Traversal)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/spiral-matrix/'
  },
  {
    order: 100,
    title: 'Rotate Image',
    description: 'Rotate an $n \\times n$ 2D matrix 90 degrees clockwise in-place by transposing and reversing rows.',
    pattern: 'Matrix (Transpose & Reflect)',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/rotate-image/'
  }
];

export function getCategoryFromPattern(pattern, order) {
  if (order >= 1 && order <= 9) return 'Arrays & Hashing';
  if (order >= 10 && order <= 14) return 'Two Pointers';
  if (order >= 15 && order <= 20) return 'Sliding Window';
  if (order >= 21 && order <= 26) return 'Stack';
  if (order >= 27 && order <= 33) return 'Binary Search';
  if (order >= 34 && order <= 42) return 'Linked List';
  if (order >= 43 && order <= 53) return 'Trees';
  if (order >= 54 && order <= 56) return 'Trie';
  if (order >= 57 && order <= 60) return 'Heap';
  if (order >= 61 && order <= 66) return 'Backtracking';
  if (order >= 67 && order <= 76) return 'Graphs';
  if (order >= 77 && order <= 91) return 'Dynamic Programming';
  if (order >= 92 && order <= 95) return 'Intervals';
  if (order >= 96 && order <= 97) return 'Bit Manipulation';
  if (order >= 98 && order <= 100) return 'Matrix';
  return 'Arrays';
}
