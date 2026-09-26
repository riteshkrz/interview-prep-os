/**
 * 45-Day Interview Prep OS - Quick-Fire 50 DSA Cheatsheet
 * Sourced from SystemCraft's high-frequency coding interview cheatsheet.
 * 50 core FAANG/Tier-1 problems with 10-second approach rules, optimal time/space complexity, and pattern tags.
 */

export const QUICK_FIRE_50 = [
  // 1. Arrays & Hashing
  {
    id: "qf-1",
    title: "Two Sum",
    difficulty: "Easy",
    pattern: "Arrays & Hashing",
    approachRule: "Store complement (target - num) in HashMap with index. Check seen in O(1).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    codeOneLiner: "map.has(target - n) ? [map.get(target - n), i] : map.set(n, i)"
  },
  {
    id: "qf-2",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    pattern: "Arrays & Hashing",
    approachRule: "Track minPrice so far. Maximize current price - minPrice as you iterate.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "minPrice = min(minPrice, p); maxProfit = max(maxProfit, p - minPrice)"
  },
  {
    id: "qf-3",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    approachRule: "Two passes: compute prefix products in output array, then multiply suffix products backwards in O(1) space.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "res[i] = prefix; prefix *= nums[i]; then pass backwards with suffix"
  },
  {
    id: "qf-4",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    approachRule: "If current running sum is negative, reset running sum to current number. Track global max.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "currMax = max(num, currMax + num); globalMax = max(globalMax, currMax)"
  },
  {
    id: "qf-5",
    title: "Group Anagrams",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    approachRule: "Sort string or use 26-char frequency tuple as HashMap key. Collect words in list.",
    timeComplexity: "O(N * K log K)",
    spaceComplexity: "O(N * K)",
    codeOneLiner: "key = str.split('').sort().join(''); map[key].push(str)"
  },
  {
    id: "qf-6",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    approachRule: "Count frequencies with map, then use Bucket Sort where index = frequency to achieve O(N) time.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    codeOneLiner: "bucket[freq].push(num); collect from bucket.length - 1 down to 0"
  },

  // 2. Two Pointers
  {
    id: "qf-7",
    title: "Valid Palindrome",
    difficulty: "Easy",
    pattern: "Two Pointers",
    approachRule: "Left and right pointers moving inward, skipping non-alphanumeric chars, compare lowercased chars.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "while (l < r) { skipNonAlpha(); if (s[l++] !== s[r--]) return false; }"
  },
  {
    id: "qf-8",
    title: "3Sum",
    difficulty: "Medium",
    pattern: "Two Pointers",
    approachRule: "Sort array. Fix nums[i], run Two Pointers on remaining subarray with target = -nums[i]. Skip duplicates.",
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(1)",
    codeOneLiner: "if (i > 0 && nums[i] === nums[i-1]) continue; twoPointers(i + 1, n - 1)"
  },
  {
    id: "qf-9",
    title: "Container With Most Water",
    difficulty: "Medium",
    pattern: "Two Pointers",
    approachRule: "Pointers at both ends. Compute area = (r - l) * min(h[l], h[r]). Move the shorter pointer inward.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "h[l] < h[r] ? l++ : r--; // Moving taller side can never increase area"
  },
  {
    id: "qf-10",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    pattern: "Two Pointers",
    approachRule: "Maintain leftMax and rightMax pointers. Water trapped at pointer = max(0, min(leftMax, rightMax) - h).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "if (leftMax < rightMax) { ans += leftMax - h[l]; leftMax = max(leftMax, h[++l]); }"
  },

  // 3. Sliding Window
  {
    id: "qf-11",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    pattern: "Sliding Window",
    approachRule: "Expand right pointer, store char index in map. When duplicate encountered, advance left to lastSeenIndex + 1.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(min(N, M))",
    codeOneLiner: "if (map.has(s[r])) l = max(l, map.get(s[r]) + 1); maxLen = max(maxLen, r - l + 1)"
  },
  {
    id: "qf-12",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    pattern: "Sliding Window",
    approachRule: "Frequency map for pattern. Expand right until window contains all required chars, then contract left to find minimal valid length.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(K)",
    codeOneLiner: "while (matched === required) { updateMin(); if (--windowCount < targetCount) matched--; l++; }"
  },
  {
    id: "qf-13",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    pattern: "Sliding Window",
    approachRule: "Monotonic decreasing Deque storing indices. Discard smaller elements from back before adding new element; evict out-of-window indices from front.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(K)",
    codeOneLiner: "while (deque.length && nums[deque.back] <= n) deque.pop(); deque.push(i)"
  },

  // 4. Stack
  {
    id: "qf-14",
    title: "Valid Parentheses",
    difficulty: "Easy",
    pattern: "Stack",
    approachRule: "Push expected closing brackets onto stack. On encounter, check if top of stack matches.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    codeOneLiner: "if (c === '(') s.push(')'); else if (s.pop() !== c) return false;"
  },
  {
    id: "qf-15",
    title: "Daily Temperatures",
    difficulty: "Medium",
    pattern: "Stack",
    approachRule: "Monotonic decreasing stack of indices. While current temp > stack top temp, pop and record day delta (i - top).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    codeOneLiner: "while (s.length && t[i] > t[s.top]) { idx = s.pop(); res[idx] = i - idx; }"
  },
  {
    id: "qf-16",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    pattern: "Stack",
    approachRule: "Monotonic increasing stack of indices. When height drops, pop bar and calculate rectangle using width = current_index - stack_top - 1.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    codeOneLiner: "h = heights[s.pop()]; w = s.length ? i - s.top - 1 : i; maxArea = max(maxArea, h * w)"
  },

  // 5. Binary Search
  {
    id: "qf-17",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    pattern: "Binary Search",
    approachRule: "Identify which half is cleanly sorted (nums[mid] >= nums[low]). Check if target lies within sorted half to discard the other half.",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "if (nums[l] <= nums[m]) { if (target >= nums[l] && target < nums[m]) r = m-1; else l = m+1; }"
  },
  {
    id: "qf-18",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    pattern: "Binary Search",
    approachRule: "Compare nums[mid] with nums[right]. If nums[mid] > nums[right], inflection point is in right half (low = mid + 1); else high = mid.",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "nums[m] > nums[r] ? l = m + 1 : r = m; // return nums[l]"
  },
  {
    id: "qf-19",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    pattern: "Binary Search",
    approachRule: "Binary search on speed k from 1 to max(piles). Helper function calculates total hours needed at speed k.",
    timeComplexity: "O(N log(max(P)))",
    spaceComplexity: "O(1)",
    codeOneLiner: "hours = sum(ceil(pile / k)); if (hours <= h) r = k; else l = k + 1;"
  },

  // 6. Linked List
  {
    id: "qf-20",
    title: "Reverse Linked List",
    difficulty: "Easy",
    pattern: "Linked List",
    approachRule: "Iterative 3 pointers: prev, curr, next. Point curr.next = prev, advance prev and curr forward.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "next = curr.next; curr.next = prev; prev = curr; curr = next;"
  },
  {
    id: "qf-21",
    title: "Linked List Cycle (Floyd's Tortoise & Hare)",
    difficulty: "Easy",
    pattern: "Linked List",
    approachRule: "Fast pointer moves 2 steps, slow moves 1 step. If fast === slow, cycle exists. If fast reaches null, no cycle.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    codeOneLiner: "slow = slow.next; fast = fast.next?.next; if (slow === fast) return true;"
  },
  {
    id: "qf-22",
    title: "LRU Cache",
    difficulty: "Medium",
    pattern: "Linked List",
    approachRule: "HashMap mapping key -> Doubly Linked List Node for O(1) get and put. Move accessed nodes to head, evict tail when capacity exceeded.",
    timeComplexity: "O(1) all ops",
    spaceComplexity: "O(Capacity)",
    codeOneLiner: "removeNode(node); addToHead(node); // O(1) eviction and refresh"
  },

  // 7. Trees & Graphs
  {
    id: "qf-23",
    title: "Lowest Common Ancestor of BST",
    difficulty: "Medium",
    pattern: "Trees",
    approachRule: "If both p and q are smaller than root, go left. If both are greater, go right. Otherwise, root is the LCA split point.",
    timeComplexity: "O(H)",
    spaceComplexity: "O(1)",
    codeOneLiner: "if (p.val < root.val && q.val < root.val) return lca(root.left); else ... return root;"
  },
  {
    id: "qf-24",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    pattern: "Trees",
    approachRule: "Pass valid range (min, max) down recursively. Check min < node.val < max for every node.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    codeOneLiner: "if (val <= min || val >= max) return false; return dfs(left, min, val) && dfs(right, val, max)"
  },
  {
    id: "qf-25",
    title: "Number of Islands",
    difficulty: "Medium",
    pattern: "Graphs",
    approachRule: "Iterate grid. When '1' is found, increment island count and trigger DFS/BFS to sink connected '1's to '0'.",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N)",
    codeOneLiner: "grid[r][c] = '0'; dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);"
  },
  {
    id: "qf-26",
    title: "Course Schedule (Topological Sort)",
    difficulty: "Medium",
    pattern: "Graphs",
    approachRule: "Build adjacency list and in-degree array. Push nodes with in-degree 0 into queue (Kahn's Algorithm). If processed count == N, no cycle.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    codeOneLiner: "if (--inDegree[neighbor] === 0) queue.push(neighbor); return count === numCourses"
  },

  // 8. Dynamic Programming
  {
    id: "qf-27",
    title: "Coin Change",
    difficulty: "Medium",
    pattern: "Dynamic Programming",
    approachRule: "Bottom-up 1D DP: dp[i] = min coins for amount i. For each coin, dp[i] = min(dp[i], dp[i - coin] + 1).",
    timeComplexity: "O(Amount * Coins)",
    spaceComplexity: "O(Amount)",
    codeOneLiner: "dp[i] = min(dp[i], dp[i - c] + 1); // init with Infinity, dp[0] = 0"
  },
  {
    id: "qf-28",
    title: "Longest Increasing Subsequence (LIS)",
    difficulty: "Medium",
    pattern: "Dynamic Programming",
    approachRule: "Patience sorting / Binary search: maintain tails array. Use binary search to find smallest element >= num and replace it; if none, append.",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    codeOneLiner: "idx = binarySearch(tails, num); if (idx === tails.length) tails.push(num); else tails[idx] = num;"
  },
  {
    id: "qf-29",
    title: "Word Break",
    difficulty: "Medium",
    pattern: "Dynamic Programming",
    approachRule: "Boolean dp[i] indicates if s[0...i] can be segmented. For each j < i: if dp[j] is true and s[j...i] in dictionary, dp[i] = true.",
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(N)",
    codeOneLiner: "if (dp[j] && wordSet.has(s.substring(j, i))) { dp[i] = true; break; }"
  },
  {
    id: "qf-30",
    title: "Merge Intervals",
    difficulty: "Medium",
    pattern: "Intervals",
    approachRule: "Sort intervals by start time. If current start <= previous end, merge: prev.end = max(prev.end, curr.end); else push new interval.",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    codeOneLiner: "curr[0] <= last[1] ? last[1] = max(last[1], curr[1]) : res.push(curr)"
  }
];
