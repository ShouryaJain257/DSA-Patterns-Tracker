// Difficulty scale: 1=Easy .. 5=Very Hard (mirrors the sheet's star rating)
// Each problem: [name, difficulty]

const YT = {
  striver: { label: "Striver (takeUforward)", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2" },
  adityaVerma: { label: "Aditya Verma", url: "https://www.youtube.com/c/AdityaVermaTheProgrammingLord/playlists" },
  kunal: { label: "Kunal Kushwaha", url: "https://www.youtube.com/@KunalKushwaha" },
  coderArmy: { label: "Coder Army", url: "https://www.youtube.com/@CoderArmy9/playlists" }
};

const PHASES = [
{
  title: "Phase 1 · Fundamentals & Linear Data Structures",
  topics: [
    { name: "Arrays", resource: YT.striver, subtopics: [
      { name: "Array Basics", problems: [
        ["Find Element at a Given Index",1],["Min and Max in Array",1],["Sum of Array",1],
        ["Sum of Digits",1],["Check If Array is Sorted",1],["Alternates In Array",1]
      ]},
      { name: "Core Manipulations", problems: [
        ["Remove Duplicates from Array",2],["Second Largest in Array",2],["Reverse an Array",2],
        ["Missing Number",2],["Segregate 0s and 1s",2],["Maximum Consecutive Ones",2],
        ["Palindromic Array",2],["Move Zeroes to End",2],["Sort array with 0's 1's and 2's (Dutch Flag)",2]
      ]},
      { name: "Intermediate Problems", problems: [
        ["Equilibrium Point",3],["Reverse Integer",3],["Leaders in Array",3],["Increasing Array",3],
        ["Rearrange Array Elements by Sign",3],["Rotate Array by One",3],["Majority Element I (Boyer-Moore)",3]
      ]},
      { name: "Advanced Problems", problems: [
        ["Rotate Array by K steps",4],["Wiggle Sort II",4],["Majority Element II",4],
        ["Best Time to Buy and Sell Stock",4],["Next Permutation",4],["Maximum Value Of Expression",4],
        ["First Missing Positive",5]
      ]}
    ]},
    { name: "2D Arrays", resource: YT.striver, subtopics: [
      { name: "Matrix Basics", problems: [
        ["Sum of elements in a matrix",2],["Count Number Of Zeroes",2],
        ["Count Negative Numbers in a matrix",2],["Matrix Diagonal Sum",2]
      ]},
      { name: "Matrix Operations", problems: [
        ["Addition of Two Square Matrix",3],["Multiply Matrices",3],["Transpose Matrix",3]
      ]},
      { name: "Advanced Matrix", problems: [
        ["Spiral Matrix",4],["ZigZag Matrix",4],["Rotate Matrix (90°)",4],
        ["Determine Whether matrix can be obtained by rotation",4],["Set Matrix Zeroes",5]
      ]}
    ]},
    { name: "Basic Maths", resource: YT.striver, subtopics: [
      { name: "Number Theory Basics", problems: [
        ["Check if a number is Armstrong",1],["Print all Divisors of a Number",1],
        ["Check if a number is Prime",1],["GCD / HCF of 2 numbers",1],
        ["Prime Factorisation of a Number",2],["Count Primes in range L to R",3]
      ]}
    ]},
    { name: "Strings", resource: YT.striver, subtopics: [
      { name: "String Fundamentals", problems: [
        ["Maximum Occuring Character",1],["Remove Spaces",1],
        ["Print first letter of every word in the string",2],["Remove Consecutive Characters",2],
        ["Valid Palindrome",2],["Valid Anagram",2],["Isomorphic Strings",2]
      ]},
      { name: "String Manipulation", problems: [
        ["Delete Characters To Make Fancy String",3],["Reverse Words in a String",3],
        ["String to integer (atoi)",3],["Roman to integer",3],["Rotate String",3],
        ["Longest common prefix",3]
      ]},
      { name: "Advanced Problems", problems: [
        ["Longest palindromic substring",4],["Multiply Two Strings",4],
        ["Maximum Nesting Depth of the Parentheses",4],["Beauty Of All substrings",4]
      ]}
    ]}
  ]
},
{
  title: "Phase 2 · Searching Algorithms",
  topics: [
    { name: "Binary Search", resource: YT.striver, subtopics: [
      { name: "BS on 1D Array — Basics", problems: [
        ["Search X in sorted array",2],["Lower Bound",2],["Upper Bound",2],
        ["Search insert position",2],["Floor In Sorted Array",2],["Ceil In Sorted Array",2],
        ["Guess Number Higher or Lower API",2],["First 1 in a Sorted Binary Array",2],
        ["Kth Missing Positive Number",2],["Find minimum in Rotated Sorted Array",2]
      ]},
      { name: "BS on 1D Array — Intermediate", problems: [
        ["First and last occurrence",3],["Search in rotated sorted array-I",3],
        ["Search in rotated sorted array-II",3],["Single element in a Sorted Array",3],
        ["Find kth Rotation",3],["Find Peak Element",3]
      ]},
      { name: "BS on 2D Arrays", problems: [
        ["Count Negative Numbers in a Sorted Matrix",2],["Find row with maximum 1's",2],
        ["Search a 2D Matrix I",2],["Search a 2D Matrix II",3],
        ["Find Peak Element - II",4],["Median in a row-wise sorted Matrix",4]
      ]},
      { name: "BS on Answer", problems: [
        ["Sqrt(x)",2],["Valid Perfect Square",2],["Find Nth root of a number",3],
        ["Koko eating bananas",3],["Find the Smallest Divisor Given a Threshold",3],
        ["Minimum Speed to Arrive on Time",3],["Minimum days to make M bouquets",3],
        ["Capacity to Ship Packages Within D Days",3],["Book Allocation Problem",3],
        ["Split Array Largest Sum",4],["Painter's Partition Problem",4],
        ["K-th element of two sorted Arrays",4],["Aggressive Cows",5],
        ["Minimize Max Distance to Gas Station",5],["Median of Two Sorted Arrays",5]
      ]}
    ]}
  ]
},
{
  title: "Phase 3 · Algorithmic Thinking",
  topics: [
    { name: "Recursion", resource: YT.adityaVerma, subtopics: [
      { name: "Introduction to Recursion", problems: [
        ["Print 1 to N without using loops",1],["Print N to 1 without loop",1],
        ["Sum of first N numbers",1],["Factorial of a given number",1],["Fibonacci Number",1]
      ]},
      { name: "Recursion on Arrays & Math", problems: [
        ["Reverse an array",2],["Pow(x, n)",2],["Count Good Numbers",2],
        ["Recursive Implementation of atoi()",3]
      ]},
      { name: "Recursion on Strings", problems: [
        ["Generate Binary Strings Without Consecutive 1s",3]
      ]}
    ]},
    { name: "Sorting", resource: YT.striver, subtopics: [
      { name: "Sorting Fundamentals", problems: [
        ["Linear Search",1],["Sort An Array (Implement Merge / Quick Sort)",2],
        ["Sort Array By Parity",2],["Maximum Gap",3]
      ]},
      { name: "Custom Comparator Sorting", problems: [
        ["Sort Elements by Decreasing Frequency",3],["Reorder Data In Log Files",4]
      ]},
      { name: "Advanced Sorting", problems: [
        ["Merge Intervals",3],["Count Inversions (Merge Sort)",5],["Reverse Pairs (Merge Sort)",5]
      ]}
    ]}
  ]
},
{
  title: "Phase 4 · Object Oriented Concepts",
  topics: [
    { name: "OOPS", resource: null, subtopics: [
      { name: "OOPS Fundamentals", problems: [
        ["Classes, Objects & Constructors",1],["Inheritance & Polymorphism",2],
        ["Encapsulation & Abstraction",2],["Interfaces & Abstract Classes",3]
      ]},
      { name: "Design Patterns", problems: [
        ["Singleton Pattern",3],["Factory Pattern",4]
      ]}
    ]}
  ]
},
{
  title: "Phase 5 · Advanced Linear Data Structures",
  topics: [
    { name: "Linked List", resource: YT.striver, subtopics: [
      { name: "Foundation", problems: [
        ["Array to Linked List",1],["Count Nodes / Find Length of Linked List",1],
        ["Search in a Linked List",1]
      ]},
      { name: "Insertion and Deletion", problems: [
        ["Insert Node at Head / Tail",2],["Insert in Middle of Linked List",2],
        ["Remove Linked List Elements (By Value)",2],["Remove Duplicates from Sorted List",2],
        ["Delete Node in a Linked List (Given only node ref)",3],
        ["Remove Duplicates from Unsorted List",3],["Delete the Middle Node of a Linked List",3]
      ]},
      { name: "Fast and Slow Pointer", problems: [
        ["Middle of the Linked List",2],["Linked List Cycle",2],
        ["Intersection of Two Linked Lists",2],["Length of Loop in Linked List",3],
        ["Linked List Cycle II (Find Starting Point)",3],["Remove Loop in Linked List",3],
        ["Remove Nth Node From End of List",3]
      ]},
      { name: "Reversals and Rotations", problems: [
        ["Reverse a Linked List (Iterative & Recursive)",2],["Palindrome Linked List",2],
        ["Swap Nodes in Pairs",3],["Odd Even Linked List (By Index)",3],
        ["Reorder List",4],["Rotate List",4]
      ]},
      { name: "Math in Linked List", problems: [
        ["Add One to a Number Represented by LL",3],["Add Two Numbers (Reverse Order)",3],
        ["Add Two Numbers II (Forward Order)",4]
      ]},
      { name: "Sorting, Merging & Segregating", problems: [
        ["Merge Two Sorted Lists",2],["Sort a Linked List of 0s, 1s, and 2s",3],
        ["Segregate Even and Odd Nodes (By Value)",3],["Partition List",4],
        ["Insertion Sort List",4],["Sort List (Merge Sort on LL)",5]
      ]},
      { name: "Doubly Linked Lists (DLL)", problems: [
        ["Array to Doubly Linked List",1],["Insert/Delete in a Doubly Linked List",2],
        ["Reverse a Doubly Linked List",2],["Remove Duplicates from Sorted DLL",2],
        ["Insert in Sorted way in a Sorted DLL",3],["Delete all occurrences of a key in DLL",3],
        ["Find Pairs with Given Sum in a DLL",3]
      ]},
      { name: "Advanced Problems", problems: [
        ["Copy List with Random Pointer (Clone LL)",4],["Flattening a Linked List",4],
        ["Reverse Linked List in Groups of Size K",5],["Reverse Alternate K Nodes",5]
      ]}
    ]},
    { name: "Stacks", resource: YT.striver, subtopics: [
      { name: "Core Implementation", problems: [
        ["Implement Stack using Arrays",1],["Implement Stack using Linked List",1]
      ]},
      { name: "Parentheses & String Parsing", problems: [
        ["Valid Parentheses",2],["Remove Outermost Parentheses",2],
        ["Remove All Adjacent Duplicates In String",2],["Minimum Add to Make Parentheses Valid",2],
        ["Minimum Remove to Make Valid Parentheses",3],["Evaluate Reverse Polish Notation",3]
      ]},
      { name: "Recursion Based Stack Problems", problems: [
        ["Sort a Stack Using Recursion",3],["Reverse a Stack (Using Recursion)",3]
      ]},
      { name: "Expression Conversions", problems: [
        ["Infix to Postfix Conversion",2],["Prefix to Infix Conversion",2],
        ["Postfix to Prefix Conversion",2],["Infix to Prefix Conversion",3]
      ]},
      { name: "The Monotonic Stack Pattern", problems: [
        ["Next Greater Element I",2],["Next Smaller Element / Help Classmates",3],
        ["Next Greater Element II (Circular Array)",3],["Stock Span Problem",3],
        ["Number of Greater Elements to the Right",3],["Asteroid Collision",3],
        ["Remove K Digits",4],["Remove Duplicate Letters",4]
      ]},
      { name: "Advanced Monotonic Stack & Applications", problems: [
        ["Largest Rectangle in Histogram",4],["Sum of Subarray Minimums",4],
        ["Sum of Subarray Ranges",4],["Maximal Rectangle (2D Grid)",5]
      ]},
      { name: "Classic Design Problems", problems: [
        ["Min Stack (O(1) getMin)",3],["The Celebrity Problem (Elimination via Stack)",3]
      ]}
    ]},
    { name: "Queues", resource: YT.striver, subtopics: [
      { name: "Queue Implementation", problems: [
        ["Implement Queue using Arrays",1],["Implement Queue using Linked List",1],
        ["Implement Queue using Stacks",2],["Implement Stack using Queues",2],
        ["Reverse First K elements of Queue",2]
      ]},
      { name: "Queue Applications", problems: [
        ["Number of Students Unable to Eat Lunch",2],["First non-repeating character in a stream",3]
      ]},
      { name: "Deque & Sliding Window Max", problems: [
        ["Sliding Window Maximum",4],["Longest Continuous Subarray With Abs Diff ≤ Limit",4],
        ["Constrained Subsequence Sum",5]
      ]}
    ]}
  ]
},
{
  title: "Phase 6 · Hierarchical Data Structures",
  topics: [
    { name: "Binary Trees", resource: YT.striver, subtopics: [
      { name: "Traversals & Views (Fundamentals)", problems: [
        ["Preorder Traversal (Recursive & Iterative)",3],["Inorder Traversal (Recursive & Iterative)",3],
        ["Postorder Traversal (Recursive & Iterative)",3],["Binary Tree Level Order Traversal",4],
        ["Binary Tree Zigzag Level Order Traversal",4],["Left / Right View of Binary Tree",4],
        ["Top / Bottom View of Binary Tree",4],["Boundary Traversal of Binary Tree",4],
        ["Diagonal Traversal of Binary Tree",4],["Vertical Order Traversal of a Binary Tree",5]
      ]},
      { name: "Tree Properties & Dimensions", problems: [
        ["Maximum Depth of Binary Tree",3],["Same Tree",3],["Invert Binary Tree",3],
        ["Symmetric Tree",4],["Maximum Width of Binary Tree",4],["Count Complete Tree Nodes",4],
        ["Diameter of Binary Tree",5],["Balanced Binary Tree",5]
      ]},
      { name: "Paths, Sums & LCA", problems: [
        ["Path Sum I",3],["Path Sum II",4],["Sum Root to Leaf Numbers",4],
        ["Maximum Difference Between Node and Ancestor",4],
        ["Lowest Common Ancestor of a Binary Tree",5],["Binary Tree Maximum Path Sum",5],
        ["Path Sum III",5]
      ]},
      { name: "Graph-Like Traversals in Trees", problems: [
        ["Minimum time taken to burn the BT",4],["All Nodes Distance K in Binary Tree",5],
        ["Step-By-Step Directions From a Binary Tree Node to Another",5]
      ]},
      { name: "Structural Modifications & Construction", problems: [
        ["Merge Two Binary Trees",3],["Children Sum Property in a Binary Tree",3],
        ["Construct Binary Tree from Preorder and Inorder Traversal",5],
        ["Construct Binary Tree from Inorder and Postorder Traversal",4],
        ["Flatten Binary Tree to Linked List",4],["Serialize and Deserialize Binary Tree",5]
      ]}
    ]},
    { name: "Binary Search Trees", resource: YT.striver, subtopics: [
      { name: "Core Properties & Search", problems: [
        ["Search in a Binary Search Tree",2],["Find Minimum/Maximum in BST",2],
        ["Insert into a Binary Search Tree",3],["Floor and Ceil in a BST",3],
        ["Inorder Successor in BST",4],["Lowest Common Ancestor of a Binary Search Tree",4],
        ["Validate Binary Search Tree",5],["Kth Smallest Element in a BST",5]
      ]},
      { name: "Standard Modifications & Deletions", problems: [
        ["Delete Node in a BST",4],["Two Sum IV - Input is a BST",5]
      ]},
      { name: "Construction & Advanced Operations", problems: [
        ["Convert Sorted Array to Binary Search Tree",3],["Construct BST from Preorder Traversal",4],
        ["Balance a Binary Search Tree",4],["Merge Two Balanced Binary Search Trees",4],
        ["Recover Binary Search Tree",5],["Largest BST in a Binary Tree",5]
      ]}
    ]},
    { name: "Tries", resource: YT.kunal, subtopics: [
      { name: "Implementation & String Search", problems: [
        ["Implement Trie (Prefix Tree)",4],["Design Add and Search Words Data Structure",4],
        ["Longest Word with All Prefixes",4],["Number of Distinct Substrings in a String",4],
        ["Word Search II",5]
      ]},
      { name: "Bitwise Tries (Advanced)", problems: [
        ["Maximum XOR of Two Numbers in an Array",5],["Maximum XOR With an Element From Array",5]
      ]}
    ]}
  ]
},
{
  title: "Phase 7 · Core Data Structures and Techniques",
  topics: [
    { name: "Hashmaps", resource: YT.striver, subtopics: [
      { name: "Hashmap Fundamentals", problems: [
        ["Contains Duplicate",1],["Valid Anagram (Hashmap Approach)",1],
        ["Unique Number of Occurrences",1],["Find distinct elements / Find the Frequency",1],
        ["Two Sum",2],["Intersection of Two Arrays",2],
        ["Count Number of Pairs With Absolute Difference K",2],["Design HashMap",3]
      ]},
      { name: "Intermediate Hashmap Problems", problems: [
        ["Group Anagrams",3],["Longest Consecutive Sequence",3],["Subarray Sum Equals K",3],
        ["Contiguous Array / Largest subarray with 0 sum",3],["Count subarrays with given XOR",3],
        ["Subarray Sums Divisible by K",3],["Continuous Subarray Sum",3]
      ]},
      { name: "Advanced / Multi Concept", problems: [
        ["Maximum Size Subarray Sum Equals k",3],["Top K Frequent Elements",3],
        ["LRU Cache (Least Recently Used)",4],["LFU Cache (Least Frequently Used)",5]
      ]}
    ]},
    { name: "Heaps / Priority Queues", resource: YT.striver, subtopics: [
      { name: "Heap Fundamentals", problems: [
        ["Check if an array represents a min heap",2],["Convert Min Heap to Max Heap",2],
        ["Implement Min/Max Heap",3]
      ]},
      { name: "The Top-K Pattern", problems: [
        ["Last Stone Weight",3],["Kth Largest Element in an Array",4],
        ["K Closest Points to Origin",4],["Sort a K Sorted Array / Nearly Sorted Algorithm",4],
        ["Top K Frequent Elements (Heap Approach)",4]
      ]},
      { name: "Merging & Combinations", problems: [
        ["Minimum Cost of Ropes",4],["Merge K Sorted Lists",5],
        ["Kth Smallest Element in a Sorted Matrix",4]
      ]},
      { name: "Advanced / Two-Heaps / Scheduling", problems: [
        ["Task Scheduler",5],["Reorganize String",5],
        ["Minimum Number of Refueling Stops",5],["Find Median from Data Stream",5]
      ]}
    ]},
    { name: "Prefix Sum", resource: YT.coderArmy, subtopics: [
      { name: "1D Prefix Sum", problems: [
        ["Running Sum of 1D Array",1],["Find the Highest Altitude",2],["Find Pivot Index",2],
        ["Range Sum Query - Immutable",2],["Product of Array Except Self",3],
        ["Corporate Flight Bookings",4],["Trapping Rain Water (Prefix Max / Min)",4]
      ]},
      { name: "2D Prefix Sum", problems: [
        ["Range Sum Query 2D - Immutable",3],["Matrix Block Sum",3],
        ["Maximum Sum of a 2D Subgrid of size K x K",4]
      ]}
    ]},
    { name: "Two Pointers & Sliding Window", resource: YT.striver, subtopics: [
      { name: "Two Pointers Basics", problems: [
        ["Move Zeroes (Two Pointer Intuition)",1],["Valid Palindrome (Two Pointers)",1],
        ["Two Sum II - Input Array Is Sorted",2],["Sort Colors (Dutch National Flag)",2],
        ["Container With Most Water",3],["3Sum",3]
      ]},
      { name: "Fixed Size Sliding Window", problems: [
        ["Maximum Average Subarray I",2],["Max Sum Subarray of size K",2],
        ["Number of Sub-arrays of Size K and Average ≥ Threshold",2],
        ["Minimum Consecutive Cards to Pick Up",2],["Maximum Points You Can Obtain from Cards",3]
      ]},
      { name: "Variable Size Sliding Window", problems: [
        ["Find All Anagrams in a String",3],["Permutation in String",3],
        ["Minimum Size Subarray Sum",3],["Longest Substring Without Repeating Characters",3],
        ["Longest Repeating Character Replacement",3],["Max Consecutive Ones III",3],
        ["Fruit Into Baskets",3],["Maximum Erasure Value",3],
        ["Number of Substrings Containing All Three Characters",3]
      ]},
      { name: "Advanced Sliding Window / Counting / Atmost K", problems: [
        ["Binary Subarrays With Sum",3],["Count Number of Nice Subarrays",3],
        ["Subarrays with K Different Integers",4],["Minimum Window Subsequence",4],
        ["Minimum Window Substring",5]
      ]}
    ]},
    { name: "Bit Manipulation", resource: YT.kunal, subtopics: [
      { name: "Bit Basics & Properties", problems: [
        ["K-th Bit is Set or Not",1],["Check if a Number is Odd or Not",1],
        ["Check If Number Power of 2 or Not",2],["Number Of Even and Odd Bits",2],
        ["Minimum Bit Flips To Convert Number",3]
      ]},
      { name: "XOR Tricks", problems: [
        ["Swap Two Numbers (XOR Trick)",2],["Single Number I",2],
        ["Is Binary Number Multiple of 3",2],["Find the repeating and missing number",3],
        ["Single Number II",4],["Single Number III",5]
      ]},
      { name: "Bit Counting & Advanced", problems: [
        ["Count Set Bits From 1 to N",4],["Bleak Numbers",4],["Minimum Xor Pair",4],
        ["Divide Two Integers (Bit Shifting)",4]
      ]}
    ]}
  ]
},
{
  title: "Phase 8 · Standard Algorithms",
  topics: [
    { name: "Greedy", resource: YT.striver, subtopics: [
      { name: "Basics & Array Manipulation", problems: [
        ["Assign Cookies",1],["Lemonade Change",2],["Maximize Sum of Array After K Negations",2],
        ["Shortest Job First",2],["Activity Selection / N Meetings in One Room",2]
      ]},
      { name: "Intervals & Scheduling", problems: [
        ["Merge Intervals (Greedy View)",3],["Insert Interval",3],["Non-overlapping Intervals",3],
        ["Minimum Number of Arrows to Burst Balloons",3],["Job Sequencing Problem",3],
        ["Minimum Platforms required for a railway",3],["Maximum Meetings in One Room",3],
        ["Task Scheduler (Greedy Approach)",3]
      ]},
      { name: "Array & Jump Greedy", problems: [
        ["Jump Game",3],["Valid Parenthesis String",3],["Gas Station",3],["Jump Game II",3]
      ]},
      { name: "Advanced Greedy", problems: [
        ["Minimize the Heights II",4],["Candy",4],["Huffman Decoding / Coding",4],
        ["Minimum Number of Taps to Open to Water a Garden",4],["Course Schedule III",5]
      ]}
    ]},
    { name: "Graphs", resource: YT.striver, subtopics: [
      { name: "Graphs Fundamentals & Traversals", problems: [
        ["BFS of Graph",1],["DFS of Graph",1],["Find if Path Exists in Graph",2],
        ["Number of Provinces",2],["Clone Graph",3],["Is Graph Bipartite?",3]
      ]},
      { name: "Matrix / Grid BFS Problems", problems: [
        ["Flood Fill",2],["Max Area of Island",2],["Number of Islands",3],["Rotting Oranges",3],
        ["01 Matrix / Distance of nearest cell having 1",3],["Surrounded Regions",3],
        ["Number of Enclaves",3],["Shortest Path in Binary Matrix",3],
        ["Swim in Rising Water",4],["Making A Large Island",4]
      ]},
      { name: "Cycle Detection", problems: [
        ["Cycle Detection in Undirected Graph",2],["Detect Cycle in a Directed Graph",3],
        ["Find Eventual Safe States",3]
      ]},
      { name: "Topological Sorting (Kahn's Algorithm)", problems: [
        ["Topological Sort",2],["Course Schedule",3],["Course Schedule II",3],
        ["Alien Dictionary",4],["Parallel Courses III",4]
      ]},
      { name: "Shortest Path Algorithms", problems: [
        ["Shortest Path in Undirected Graph (Unit Weights)",2],["Shortest Path in DAG",2],
        ["Dijkstra's Algorithm",3],["Network Delay Time",3],["Path With Minimum Effort",3],
        ["Cheapest Flights Within K Stops",3],["Path with Maximum Probability",3],
        ["Bellman-Ford Algorithm",3],["Floyd Warshall Algorithm",3],
        ["Find the City With the Smallest Number of Neighbors",3],
        ["Minimum Multiplications to Reach End",3],["Number of Ways to Arrive at Destination",3]
      ]},
      { name: "Minimum Spanning Tree (MST)", problems: [
        ["Minimum Spanning Tree",2],["Prim's Algorithm",3],["Min Cost to Connect All Points (Kruskal)",3]
      ]},
      { name: "Disjoint Set Union (DSU) / Union Find", problems: [
        ["Disjoint Set",2],["Number of Operations to Make Network Connected",3],
        ["Accounts Merge",3],["Most Stones Removed with Same Row or Column",3],
        ["Redundant Connection",3],["Evaluate Division",4],["Number of Islands II",4]
      ]},
      { name: "Bridges, Articulation Points & SCC", problems: [
        ["Kosaraju's Algorithm",4],["Tarjan's Algorithm / Bridges in Graph",4],
        ["Articulation Point in Graph",4],["Critical Connections in a Network",4]
      ]},
      { name: "Advanced Graphs Problems", problems: [
        ["Snake and Ladder Problem",3],["Word Ladder",4],
        ["Reorder Routes to Make All Paths Lead to the City Zero",4],["Word Ladder II",5],
        ["Escape the Spreading Fire",5]
      ]}
    ]}
  ]
},
{
  title: "Phase 9 · Exhaustive Search & Optimisation",
  topics: [
    { name: "Backtracking", resource: YT.adityaVerma, subtopics: [
      { name: "Subsequence & Subset Fundamentals", problems: [
        ["Check if subsequence with sum K Exists",2],["Count all subsequences with sum K",2],
        ["Subsets / Power Set",3],["Subsets II (With Duplicates)",3],["Subset Sums",3]
      ]},
      { name: "Combinations", problems: [
        ["Combination Sum I",3],["Combination Sum II",3],["Combination Sum III",3],
        ["N Digit numbers with digits in increasing order",3]
      ]},
      { name: "Permutations", problems: [
        ["Permutations II (With Duplicates)",3],["Letter Combinations of a Phone Number",3],
        ["Generate Parentheses",3]
      ]},
      { name: "String Backtracking", problems: [
        ["Palindrome Partitioning",4],["Word Break",4],["Remove Invalid Parentheses",5],
        ["Expression Add Operators",5]
      ]},
      { name: "Grid & Maze Backtracking", problems: [
        ["Rat in a Maze",4],["Word Search",4],["M-Coloring Problem",4],
        ["N-Queens",5],["N-Queens II",5],["Sudoku Solver",5]
      ]}
    ]},
    { name: "Dynamic Programming", resource: YT.adityaVerma, subtopics: [
      { name: "1D DP (Intro to State & Transitions)", problems: [
        ["Fibonacci Number",1],["Climbing Stairs",1],["Min Cost Climbing Stairs",2],
        ["Frog Jump",2],["Frog Jump with K Distances",2],["House Robber",2],
        ["House Robber II",3],["Decode Ways",3]
      ]},
      { name: "2D Grids & Paths", problems: [
        ["Unique Paths",2],["Unique Paths II",3],["Minimum Path Sum",3],["Triangle",3],
        ["Minimum Falling Path Sum",3],["Dungeon Game",4],["Cherry Pickup II / Ninja and his Friends",4]
      ]},
      { name: "0/1 Knapsack & Subsets", problems: [
        ["Subset Sum Problem",2],["Partition Equal Subset Sum",3],["Count Subsets with Sum K",3],
        ["Target Sum",3],["Count Partitions with Given Difference",3],["0/1 Knapsack Problem",3],
        ["Partition Array Into Two Arrays to Minimize Sum Difference",4],["Last Stone Weight II",4]
      ]},
      { name: "Unbounded Knapsack", problems: [
        ["Rod Cutting Problem",3],["Coin Change",3],["Coin Change II",3],["Perfect Squares",3]
      ]},
      { name: "DP on Strings (LCS & Edit Distance Patterns)", problems: [
        ["Longest Common Subsequence",3],["Print Longest Common Subsequence",3],
        ["Longest Common Substring",3],["Longest Palindromic Subsequence",3],
        ["Minimum Insertions to Make String Palindrome",3],["Delete Operation for Two Strings",3],
        ["Shortest Common Supersequence",4],["Distinct Subsequences",4],["Edit Distance",4],
        ["Wildcard Matching",4],["Regular Expression Matching",5]
      ]},
      { name: "DP on Stocks", problems: [
        ["Best Time to Buy and Sell Stock",1],["Best Time to Buy and Sell Stock II",2],
        ["Best Time to Buy and Sell Stock with Cooldown",2],
        ["Best Time to Buy and Sell Stock with Transaction Fee",3],
        ["Best Time to Buy and Sell Stock III",4],["Best Time to Buy and Sell Stock IV",4]
      ]},
      { name: "Longest Increasing Subsequence (LIS)", problems: [
        ["Longest Increasing Subsequence",3],["Print Longest Increasing Subsequence",3],
        ["Largest Divisible Subset",3],["Longest String Chain",3],
        ["Longest Bitonic Subsequence",4],["Number of Longest Increasing Subsequences",4],
        ["Russian Doll Envelopes",5]
      ]},
      { name: "Partition DP & Matrix Chain Multiplication (MCM)", problems: [
        ["Matrix Chain Multiplication",4],["Minimum Cost to Cut a Stick",4],
        ["Burst Balloons",5],["Palindrome Partitioning II",5]
      ]}
    ]}
  ]
},
{
  title: "Bonus · CP-Oriented Patterns (not in the master sheet)",
  topics: [
    { name: "Difference Array / Range Updates", resource: YT.coderArmy, subtopics: [
      { name: "Range Update Techniques", problems: [
        ["LC 370 — Range Addition",4],["LC 1094 — Car Pooling",4],
        ["LC 1109 — Corporate Flight Bookings (Diff Array)",4],
        ["LC 1893 — Check if All the Integers in a Range Are Covered",3],
        ["LC 1943 — Describe the Painting",4],["LC 2381 — Shifting Letters II",4]
      ]}
    ]},
    { name: "Multi-Source BFS", resource: YT.striver, subtopics: [
      { name: "Simultaneous BFS from Multiple Origins", problems: [
        ["LC 542 — 01 Matrix",3],["LC 994 — Rotting Oranges",3],
        ["LC 1162 — As Far from Land as Possible",4],["LC 286 — Walls and Gates",3],
        ["LC 1765 — Map of Highest Peak",4],["LC 934 — Shortest Bridge",4]
      ]}
    ]},
    { name: "0/1 BFS / Weighted Grid", resource: YT.coderArmy, subtopics: [
      { name: "Deque-Based Shortest Path", problems: [
        ["LC 1091 — Shortest Path in Binary Matrix",3],["LC 864 — Shortest Path to Get All Keys",5],
        ["LC 1293 — Shortest Path in a Grid with Obstacles Elimination",4],
        ["LC 1368 — Minimum Cost to Make at Least One Valid Path in a Grid",5],
        ["LC 2290 — Minimum Obstacle Removal to Reach Corner",5],
        ["LC 2577 — Minimum Time to Visit a Cell In a Grid",5]
      ]}
    ]},
    { name: "Bitmask DP", resource: YT.adityaVerma, subtopics: [
      { name: "State Compression DP", problems: [
        ["LC 78 — Subsets (Bitmask view)",3],["LC 464 — Can I Win",4],
        ["LC 526 — Beautiful Arrangement",4],["LC 698 — Partition to K Equal Sum Subsets",4],
        ["LC 1349 — Maximum Students Taking Exam",5],["LC 1723 — Find Minimum Time to Finish All Jobs",5]
      ]}
    ]},
    { name: "String Matching (KMP / Rabin-Karp / Z-function)", resource: YT.striver, subtopics: [
      { name: "Pattern Search Algorithms", problems: [
        ["LC 28 — Find the Index of the First Occurrence in a String",3],
        ["LC 214 — Shortest Palindrome (KMP)",5],["LC 459 — Repeated Substring Pattern",2],
        ["LC 1392 — Longest Happy Prefix (Z-function)",5],
        ["LC 1408 — String Matching in an Array",2],["LC 2223 — Sum of Scores of Built Strings",5]
      ]}
    ]},
    { name: "Segment Tree / Fenwick Tree (BIT)", resource: YT.coderArmy, subtopics: [
      { name: "Range Query Data Structures", problems: [
        ["LC 307 — Range Sum Query - Mutable",4],["LC 315 — Count of Smaller Numbers After Self",5],
        ["LC 327 — Count of Range Sum",5],["LC 493 — Reverse Pairs",5],
        ["LC 1649 — Create Sorted Array through Instructions",5],
        ["LC 2179 — Count Good Triplets in an Array",5]
      ]}
    ]}
  ]
}
];
