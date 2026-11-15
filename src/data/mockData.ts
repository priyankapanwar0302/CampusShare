import { Course, CourseCategory, Subject, Resource, ResourceRequest, Announcement, User } from '../types';

export const mockCategories: CourseCategory[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    shortName: 'B.Tech',
    badge: '4 Years • Undergraduate',
    iconName: 'Cpu',
    description: 'Technical engineering curriculum across computational, mechanical, and electronic systems.',
    hasDepartments: true,
    departmentIds: ['cse', 'me', 'ece', 'ce'],
  },
  {
    id: 'computer-applications',
    name: 'Computer Applications',
    shortName: 'BCA / MCA',
    badge: '3 Years • Professional',
    iconName: 'Terminal',
    description: 'Practical software development, web engineering, cloud environments, and databases.',
    hasDepartments: false,
    directCourseId: 'bca',
  },
  {
    id: 'applied-sciences',
    name: 'Basic & Applied Sciences',
    shortName: 'B.Sc / M.Sc',
    badge: '3 Years • Core Sciences',
    iconName: 'FlaskConical',
    description: 'Foundations of mathematical logic, computational physics, and applied analytics.',
    hasDepartments: false,
    directCourseId: 'bsc',
  },
  {
    id: 'management',
    name: 'Management & Commerce',
    shortName: 'BBA / MBA',
    badge: '3 Years • Business',
    iconName: 'Briefcase',
    description: 'Strategic leadership, organizational behavior, financial accounting, and analytics.',
    hasDepartments: false,
    directCourseId: 'bba',
  },
];

export const mockUsers: Record<'student' | 'admin', User> = {
  student: {
    id: 'user-std-101',
    name: 'Ayush Joshi',
    studentId: 'CS2026048',
    email: 'ayush.joshi@campus.edu',
    role: 'student',
    courseId: 'cse',
    semester: 1,
    batch: 'Batch 2026-30',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bookmarkedResourceIds: ['res-cs201-n1', 'res-cs202-iq1', 'res-cs201-lm1'],
    isDefaultPassword: false,
  },
  admin: {
    id: 'user-adm-001',
    name: 'Prof. Sarah Jenkins',
    studentId: 'FACULTY-891',
    email: 's.jenkins@campus.edu',
    role: 'admin',
    courseId: 'cse',
    semester: 4,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bookmarkedResourceIds: [],
    isDefaultPassword: false,
  },
};

export const mockCourses: Course[] = [
  {
    id: 'cse',
    categoryId: 'engineering',
    code: 'CS',
    name: 'Computer Science & Engineering',
    shortName: 'B.Tech CSE',
    department: 'Engineering',
    semestersCount: 8,
    totalSubjects: 48,
    totalResources: 342,
    iconName: 'Code2',
    description: 'Core computing curriculum covering algorithms, system architecture, database design, and software engineering.',
  },
  {
    id: 'me',
    categoryId: 'engineering',
    code: 'ME',
    name: 'Mechanical Engineering',
    shortName: 'B.Tech ME',
    department: 'Engineering',
    semestersCount: 8,
    totalSubjects: 52,
    totalResources: 218,
    iconName: 'Cog',
    description: 'Thermodynamics, fluid mechanics, CAD/CAM manufacturing, heat transfer, and robotics automation.',
  },
  {
    id: 'ece',
    categoryId: 'engineering',
    code: 'EC',
    name: 'Electronics & Communication Engineering',
    shortName: 'B.Tech ECE',
    department: 'Engineering',
    semestersCount: 8,
    totalSubjects: 50,
    totalResources: 295,
    iconName: 'Cpu',
    description: 'Signals & systems, embedded microcontrollers, VLSI circuit design, and wireless communication protocols.',
  },
  {
    id: 'ce',
    categoryId: 'engineering',
    code: 'CE',
    name: 'Civil Engineering',
    shortName: 'B.Tech CE',
    department: 'Engineering',
    semestersCount: 8,
    totalSubjects: 46,
    totalResources: 180,
    iconName: 'Building2',
    description: 'Structural engineering, geotechnics, fluid mechanics, survey analysis, and urban construction.',
  },
  {
    id: 'bca',
    categoryId: 'computer-applications',
    code: 'BCA',
    name: 'Bachelor of Computer Applications',
    shortName: 'BCA',
    department: 'Computer Applications',
    semestersCount: 6,
    totalSubjects: 36,
    totalResources: 210,
    iconName: 'Terminal',
    description: 'Applied computing, web architecture, Python programming, database systems, and cloud fundamentals.',
  },
  {
    id: 'bsc',
    categoryId: 'applied-sciences',
    code: 'BSC',
    name: 'Bachelor of Science (Applied)',
    shortName: 'B.Sc Sciences',
    department: 'Basic & Applied Sciences',
    semestersCount: 6,
    totalSubjects: 32,
    totalResources: 195,
    iconName: 'FlaskConical',
    description: 'Mathematical calculus, computational physics, linear systems, and statistical experimentation.',
  },
  {
    id: 'bba',
    categoryId: 'management',
    code: 'BBA',
    name: 'Bachelor of Business Administration',
    shortName: 'BBA',
    department: 'Management',
    semestersCount: 6,
    totalSubjects: 34,
    totalResources: 175,
    iconName: 'Briefcase',
    description: 'Business economics, organizational behavior, financial accounting, marketing, and business strategy.',
  },
];

export const mockSubjects: Subject[] = [
  {
    id: 'cs201',
    courseId: 'cse',
    semester: 4,
    code: 'CS201',
    name: 'Data Structures & Algorithms',
    shortName: 'DSA',
    credits: 4,
    facultyCoordinator: 'Dr. Rajesh Rao',
    description: 'Asymptotic complexity, balanced search trees, graph algorithms, dynamic programming, and greedy heuristics.',
    syllabusHighlights: [
      'Unit 1: Linear Structures (Stacks, Queues, Linked Lists, amortized analysis)',
      'Unit 2: Trees & Priority Queues (BST, AVL, Red-Black Trees, Binary Heaps)',
      'Unit 3: Graph Algorithms (BFS, DFS, Dijkstra, Prim, Kruskal, Bellman-Ford)',
      'Unit 4: Algorithm Design Techniques (Divide & Conquer, Dynamic Programming, Backtracking)',
      'Unit 5: Advanced Topics (Tries, Disjoint Set Union, String Matching KMP)',
    ],
    resourceCounts: {
      notes: 6,
      importantQuestions: 4,
      labManuals: 2,
      projects: 3,
    },
  },
  {
    id: 'cs202',
    courseId: 'cse',
    semester: 4,
    code: 'CS202',
    name: 'Operating Systems',
    shortName: 'OS',
    credits: 4,
    facultyCoordinator: 'Prof. Ananya Sen',
    description: 'Process lifecycle, CPU scheduling, synchronization primitives, deadlocks, virtual memory management, and file system internals.',
    syllabusHighlights: [
      'Unit 1: OS Structures & System Calls',
      'Unit 2: Process Scheduling & Inter-Process Communication',
      'Unit 3: Synchronization (Semaphores, Monitors, Peterson\'s Algorithm)',
      'Unit 4: Memory Management (Paging, Segmentation, TLB, Page Replacement)',
      'Unit 5: Storage & File Systems (Disk scheduling, ext4, security)',
    ],
    resourceCounts: {
      notes: 5,
      importantQuestions: 3,
      labManuals: 2,
      projects: 2,
    },
  },
  {
    id: 'cs203',
    courseId: 'cse',
    semester: 4,
    code: 'CS203',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    credits: 4,
    facultyCoordinator: 'Dr. Vikramaditya Nair',
    description: 'Relational algebra, SQL, ER modeling, B+ Trees indexing, ACID concurrency control, and normal forms up to BCNF.',
    syllabusHighlights: [
      'Unit 1: Relational Data Model & Formal Relational Calculus',
      'Unit 2: Advanced SQL (Window functions, CTEs, Triggers, Views)',
      'Unit 3: Normalization & Functional Dependencies (1NF through 4NF)',
      'Unit 4: Indexing & Storage (B+ Trees, Hashing, Query optimization)',
      'Unit 5: Transaction Management (2PL, WAL, Recovery Algorithms)',
    ],
    resourceCounts: {
      notes: 4,
      importantQuestions: 3,
      labManuals: 2,
      projects: 2,
    },
  },
  {
    id: 'cs204',
    courseId: 'cse',
    semester: 4,
    code: 'CS204',
    name: 'Computer Organization & Architecture',
    shortName: 'COA',
    credits: 3,
    facultyCoordinator: 'Dr. H. K. Roy',
    description: 'Instruction set design (RISC vs CISC), arithmetic unit, pipelining hazards, cache hierarchies, and DMA controllers.',
    syllabusHighlights: [
      'Unit 1: Machine Instructions & Addressing Modes',
      'Unit 2: Computer Arithmetic (Booth\'s Algorithm, IEEE 754 Floating Point)',
      'Unit 3: Processor Organization & 5-Stage Pipelining',
      'Unit 4: Memory Hierarchy (Direct, Set-Associative Caches, Cache coherency)',
      'Unit 5: I/O Organization & Interrupt Handling',
    ],
    resourceCounts: {
      notes: 4,
      importantQuestions: 2,
      labManuals: 1,
      projects: 1,
    },
  },
  {
    id: 'ma201',
    courseId: 'cse',
    semester: 4,
    code: 'MA201',
    name: 'Discrete Mathematics',
    shortName: 'DM',
    credits: 4,
    facultyCoordinator: 'Prof. S. R. Raman',
    description: 'Propositional logic, set theory, combinatorics, recurrence relations, graph theory, and algebraic structures.',
    syllabusHighlights: [
      'Unit 1: Mathematical Logic & Proof Techniques',
      'Unit 2: Relations, Functions & Partial Orders (Hasse diagrams)',
      'Unit 3: Generating Functions & Recurrence Relations',
      'Unit 4: Graph Theory (Eulerian & Hamiltonian graphs, Planarity)',
      'Unit 5: Algebraic Structures (Groups, Rings, Monoids)',
    ],
    resourceCounts: {
      notes: 4,
      importantQuestions: 3,
      labManuals: 0,
      projects: 1,
    },
  },
  {
    id: 'ai301',
    courseId: 'aids',
    semester: 4,
    code: 'AI301',
    name: 'Machine Learning Fundamentals',
    shortName: 'ML',
    credits: 4,
    facultyCoordinator: 'Dr. Meera Nambiar',
    description: 'Supervised vs unsupervised learning, gradient descent, SVMs, decision trees, ensemble methods, and validation metrics.',
    syllabusHighlights: [
      'Unit 1: Linear Regression & Regularization (L1/L2)',
      'Unit 2: Classification Models & Logistic Regression',
      'Unit 3: Decision Trees & Random Forests',
      'Unit 4: Support Vector Machines & Kernel Tricks',
      'Unit 5: Unsupervised Clustering (K-Means, PCA, Hierarchical)',
    ],
    resourceCounts: {
      notes: 5,
      importantQuestions: 3,
      labManuals: 2,
      projects: 4,
    },
  },
  {
    id: 'ec201',
    courseId: 'ece',
    semester: 4,
    code: 'EC201',
    name: 'Signals & Systems',
    shortName: 'S&S',
    credits: 4,
    facultyCoordinator: 'Prof. K. Parthasarathy',
    description: 'Continuous & discrete time signals, LTI systems, Fourier series, Fourier Transform, Laplace & Z-Transform applications.',
    syllabusHighlights: [
      'Unit 1: Signal Classification & Elementary Signals',
      'Unit 2: Linear Time-Invariant Systems & Convolution',
      'Unit 3: Continuous-Time Fourier Transform & Frequency Response',
      'Unit 4: Laplace Transform & Region of Convergence (ROC)',
      'Unit 5: Z-Transform & Discrete Frequency Analysis',
    ],
    resourceCounts: {
      notes: 4,
      importantQuestions: 2,
      labManuals: 1,
      projects: 1,
    },
  },
  {
    id: 'me201',
    courseId: 'me',
    semester: 4,
    code: 'ME201',
    name: 'Applied Thermodynamics & Heat Engines',
    shortName: 'Thermodynamics',
    credits: 4,
    facultyCoordinator: 'Dr. V. K. Sharma',
    description: 'First & Second Laws, Carnot cycles, Rankine & Brayton cycles, steam turbines, refrigeration, and psychrometry.',
    syllabusHighlights: [
      'Unit 1: First Law Analysis & Steady Flow Energy Equation',
      'Unit 2: Second Law & Entropy Analysis',
      'Unit 3: Gas Power & Vapor Power Cycles (Rankine, Otto, Diesel)',
      'Unit 4: Steam Generators & Nozzles',
      'Unit 5: Refrigeration & Air Conditioning Principles',
    ],
    resourceCounts: {
      notes: 4,
      importantQuestions: 3,
      labManuals: 2,
      projects: 1,
    },
  },
  {
    id: 'bca201',
    courseId: 'bca',
    semester: 4,
    code: 'BCA201',
    name: 'Web Technologies & Frontend Frameworks',
    shortName: 'Web Tech',
    credits: 4,
    facultyCoordinator: 'Prof. Neha Gupta',
    description: 'HTML5, modern ES6+ JavaScript, CSS grid/flexbox, REST APIs, responsive design patterns, and React architecture.',
    syllabusHighlights: [
      'Unit 1: Semantic HTML5, CSS3 & Responsive Grids',
      'Unit 2: JavaScript ES6+, Asynchronous Fetch & DOM APIs',
      'Unit 3: Component-based UI with React & State Management',
      'Unit 4: Server Communication & RESTful Endpoints',
      'Unit 5: Web Security, HTTPS, and Performance Optimization',
    ],
    resourceCounts: {
      notes: 5,
      importantQuestions: 3,
      labManuals: 2,
      projects: 2,
    },
  },
  {
    id: 'bsc201',
    courseId: 'bsc',
    semester: 4,
    code: 'BSC201',
    name: 'Linear Algebra & Multivariable Calculus',
    shortName: 'Linear Algebra',
    credits: 4,
    facultyCoordinator: 'Dr. S. K. Mitra',
    description: 'Vector spaces, matrix decompositions, eigenvalues/eigenvectors, partial derivatives, double integrals, and vector fields.',
    syllabusHighlights: [
      'Unit 1: Vector Spaces, Subspaces & Linear Independence',
      'Unit 2: Linear Transformations & Matrix Representations',
      'Unit 3: Eigenvalues, Eigenvectors & Diagonalization',
      'Unit 4: Multiple Integrals & Coordinate Transformations',
      'Unit 5: Green\'s, Stokes\' & Divergence Theorems',
    ],
    resourceCounts: {
      notes: 4,
      importantQuestions: 3,
      labManuals: 1,
      projects: 1,
    },
  },
  {
    id: 'bba201',
    courseId: 'bba',
    semester: 4,
    code: 'BBA201',
    name: 'Principles of Management & Strategic Planning',
    shortName: 'Management',
    credits: 4,
    facultyCoordinator: 'Dr. Aruna Swaminathan',
    description: 'Organizational structures, leadership theories, strategic formulation, decision analysis, and corporate governance.',
    syllabusHighlights: [
      'Unit 1: Evolution of Management Thought (Taylor, Fayol, Weber)',
      'Unit 2: Strategic Planning & SWOT Analysis',
      'Unit 3: Organizational Design & Delegation',
      'Unit 4: Motivation Theories & Modern Leadership',
      'Unit 5: Control Systems & Corporate Governance',
    ],
    resourceCounts: {
      notes: 4,
      importantQuestions: 2,
      labManuals: 0,
      projects: 1,
    },
  },
];

export const mockResources: Resource[] = [
  // Semester 1 Resources (First Year & CSE)
  {
    id: 'res-fe101-n1',
    courseId: 'cse',
    subjectId: 'fe101',
    semester: 1,
    type: 'notes',
    title: 'Calculus & Differential Equations Complete Lecture Notes',
    description: 'Matrices eigenvalues, Cayley-Hamilton theorem, partial derivatives, Taylor series, and multiple integrals with solved university examples.',
    unitOrTopic: 'Unit 1 & 2: Differential Calculus & Linear Algebra',
    fileFormat: 'PDF',
    fileSize: '3.6 MB',
    pageCount: 28,
    downloadCount: 42,
    rating: 4.9,
    uploadDate: '2026-10-29',
    uploaderName: 'Dr. Neha Kulkarni',
    isVerified: true,
    tags: ['Matrices', 'Eigenvalues', 'Taylor Series', 'Calculus', 'Semester 1'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Cayley-Hamilton Theorem & Matrix Inverses',
        content: [
          'Every square matrix satisfies its own characteristic equation: |A - λI| = 0.',
          'Used to compute high matrix powers A^n and matrix inverse A^-1 without row echelon reduction.',
          'Eigenvalues represent scalar multipliers of invariant coordinate directions.'
        ],
        formulaSnippet: 'P(\\lambda) = \\det(A - \\lambda I) = 0 \\implies P(A) = 0'
      }
    ]
  },
  {
    id: 'res-fe101-iq1',
    courseId: 'cse',
    subjectId: 'fe101',
    semester: 1,
    type: 'importantQuestions',
    title: 'Top 30 Important Questions for Engineering Mathematics I',
    description: 'High-yield examination problems on Green theorem, Stokes theorem, Fourier expansion, and homogeneous linear differential equations.',
    unitOrTopic: 'Exam Review: All 5 Modules',
    fileFormat: 'PDF',
    fileSize: '1.9 MB',
    pageCount: 14,
    downloadCount: 36,
    rating: 4.8,
    uploadDate: '2026-10-31',
    uploaderName: 'Ayush Joshi (Batch 2026-30)',
    isVerified: true,
    tags: ['Exam Prep', 'Important Questions', 'Vector Calculus', 'Model Solutions'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Module 1: Matrix Invariants & Orthogonal Transformations',
        content: [
          'Question 1: State and prove Cayley-Hamilton Theorem for a 3x3 real matrix (8 marks).',
          'Question 2: Reduce the quadratic form 2xy + 2yz + 2zx to canonical form by orthogonal transformation (10 marks).'
        ]
      }
    ]
  },
  {
    id: 'res-cs101-n1',
    courseId: 'cse',
    subjectId: 'cs101',
    semester: 1,
    type: 'notes',
    title: 'Procedural Programming in C: Pointers, Memory & Structs',
    description: 'Pointer arithmetic, dynamic memory allocation (malloc/calloc), bitwise operations, linked structures, and recursive function stacks.',
    unitOrTopic: 'Unit 3: Pointers & Dynamic Memory Allocation',
    fileFormat: 'PDF',
    fileSize: '2.9 MB',
    pageCount: 22,
    downloadCount: 45,
    rating: 5.0,
    uploadDate: '2026-10-27',
    uploaderName: 'Prof. Rajesh Rao (Course Lead)',
    isVerified: true,
    tags: ['C Programming', 'Pointers', 'Memory Allocation', 'Recursion', 'Semester 1'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Pointer Fundamentals & Address De-referencing',
        content: [
          'A pointer is a variable holding the memory address of another variable.',
          'Operator & retrieves the address of a variable in stack memory.',
          'Operator * de-references a pointer to read or overwrite the pointed value.'
        ],
        codeSnippet: `int a = 42;
int* ptr = &a;
printf("Address: %p, Value: %d\\n", (void*)ptr, *ptr);`
      }
    ]
  },
  // Notes for CS201
  {
    id: 'res-cs201-n1',
    courseId: 'cse',
    subjectId: 'cs201',
    semester: 4,
    type: 'notes',
    title: 'Unit 2: AVL Trees & Red-Black Trees Complete Handwritten Notes',
    description: 'Comprehensive step-by-step rotations, balance factors, color flips, and deletion algorithms with verified dry runs and complexity proofs.',
    unitOrTopic: 'Unit 2: Balanced Search Trees',
    fileFormat: 'PDF',
    fileSize: '3.4 MB',
    pageCount: 24,
    downloadCount: 38,
    rating: 4.9,
    uploadDate: '2026-10-28',
    uploaderName: 'Prof. Rajesh Rao (Course Lead)',
    isVerified: true,
    tags: ['AVL Rotations', 'Red-Black Tree', 'Time Complexity O(log n)', 'Handwritten'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'AVL Tree Fundamentals & Rotations Overview',
        content: [
          'An AVL tree is a self-balancing binary search tree where the difference between heights of left and right subtrees (Balance Factor) cannot be more than 1 for all nodes.',
          'Balance Factor (BF) = Height(Left Subtree) - Height(Right Subtree) ∈ {-1, 0, +1}.',
          'Whenever an insertion or deletion violates this property, tree rotation is applied to restore balance in O(1) operations.'
        ],
        codeSnippet: `// Balance Factor calculation
int getBalance(Node* node) {
    if (node == nullptr) return 0;
    return height(node->left) - height(node->right);
}`,
        formulaSnippet: 'BF(v) = h(v.left) - h(v.right) \\quad \\text{where } |BF(v)| \\le 1'
      },
      {
        pageNumber: 2,
        title: 'Single Rotations: Left-Left (LL) and Right-Right (RR)',
        content: [
          'LL Rotation (Right Rotation): Required when a new node is inserted into the left subtree of the left child of an unbalanced node.',
          'RR Rotation (Left Rotation): Required when a new node is inserted into the right subtree of the right child of an unbalanced node.',
          'Both single rotations preserve BST ordering while reducing maximum path height by 1 level.'
        ],
        codeSnippet: `Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;
    return x;
}`
      },
      {
        pageNumber: 3,
        title: 'Double Rotations: LR and RL Cases',
        content: [
          'LR Rotation: First perform Left Rotation on the left child, followed by Right Rotation on the root.',
          'RL Rotation: First perform Right Rotation on the right child, followed by Left Rotation on the root.',
          'Complexity summary: Search = O(log n), Insert = O(log n), Delete = O(log n).'
        ]
      }
    ]
  },
  {
    id: 'res-cs201-n2',
    courseId: 'cse',
    subjectId: 'cs201',
    semester: 4,
    type: 'notes',
    title: 'Unit 3: Graph Algorithms — BFS, DFS, Dijkstra & Minimum Spanning Trees',
    description: 'Graph representations (Adjacency Matrix vs List), shortest path algorithms, cycle detection, Prim and Kruskal MST with Union-Find.',
    unitOrTopic: 'Unit 3: Graph Theory & Algorithms',
    fileFormat: 'PDF',
    fileSize: '4.1 MB',
    pageCount: 32,
    downloadCount: 24,
    rating: 4.8,
    uploadDate: '2026-10-25',
    uploaderName: 'Ayush Joshi (Topper Notes)',
    isVerified: true,
    tags: ['Dijkstra', 'Prim MST', 'Kruskal', 'Union-Find', 'Topological Sort'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Graph Traversal Primitives',
        content: [
          'Breadth-First Search (BFS) explores vertices in level-order using a FIFO Queue. Time: O(V + E). Finds unweighted shortest path.',
          'Depth-First Search (DFS) explores as deep as possible before backtracking using recursion or a LIFO Stack. Time: O(V + E).'
        ],
        codeSnippet: `// Dijkstra Algorithm with Min-Heap Priority Queue
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
dist[source] = 0;
pq.push({0, source});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;
    for (auto [v, w] : adj[u]) {
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.push({dist[v], v});
        }
    }
}`
      }
    ]
  },
  {
    id: 'res-cs201-n3',
    courseId: 'cse',
    subjectId: 'cs201',
    semester: 4,
    type: 'notes',
    title: 'Unit 4: Dynamic Programming Patterns & Classical Problems Cheat Sheet',
    description: 'Tabulation vs Memoization, 0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication, and Coin Change with state transitions.',
    unitOrTopic: 'Unit 4: Dynamic Programming',
    fileFormat: 'PDF',
    fileSize: '2.8 MB',
    pageCount: 18,
    downloadCount: 42,
    rating: 5.0,
    uploadDate: '2026-10-18',
    uploaderName: 'Dr. Rajesh Rao',
    isVerified: true,
    tags: ['DP', 'Knapsack', 'LCS', 'Memoization', 'Interview Favorite'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'The 4 Steps of Dynamic Programming',
        content: [
          'Step 1: Characterize the structure of an optimal solution (Optimal Substructure).',
          'Step 2: Recursively define the value of an optimal solution.',
          'Step 3: Compute the value of an optimal solution (Bottom-up with table or Top-down with memoization).',
          'Step 4: Construct an optimal solution from computed information.'
        ],
        formulaSnippet: 'DP[i][w] = \\max(DP[i-1][w], \\; DP[i-1][w - wt[i-1]] + val[i-1])'
      }
    ]
  },

  // Important Questions for CS201
  {
    id: 'res-cs201-iq1',
    courseId: 'cse',
    subjectId: 'cs201',
    semester: 4,
    type: 'importantQuestions',
    title: 'CS201 Important Questions (Units 1 to 5)',
    description: 'Categorized 2-mark short answers, 8-mark numerical problems on AVL/Heap insertions, and 16-mark algorithm design proofs with model marking scheme.',
    unitOrTopic: 'All Units (1 to 5)',
    fileFormat: 'PDF',
    fileSize: '5.2 MB',
    pageCount: 42,
    downloadCount: 48,
    rating: 4.95,
    uploadDate: '2026-10-22',
    uploaderName: 'Exam Cell Archive',
    isVerified: true,
    tags: ['Important Questions', 'Solved Papers', 'Model Answers', '2021-2025 Papers'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'High-Yield 16-Mark Questions (End-Sem 2026)',
        content: [
          'Q1: Construct an AVL tree by inserting keys 14, 17, 11, 7, 53, 4, 13 in order. Specify rotations at each step and draw the final tree.',
          'Q2: State and prove the master theorem for divide-and-conquer recurrences. Apply it to solve T(n) = 3T(n/4) + n log n.',
          'Q3: Explain Dijkstra algorithm with an example directed graph having at least 6 nodes. Why does Dijkstra fail for graphs with negative weight edges?'
        ]
      }
    ]
  },
  {
    id: 'res-cs201-iq2',
    courseId: 'cse',
    subjectId: 'cs201',
    semester: 4,
    type: 'importantQuestions',
    title: 'CS201 Mid-Term 2 Important Questions with Solutions',
    description: 'Includes Units 3 & 4 (Graphs, Disjoint Sets, Greedy Algorithms, Dynamic Programming) formulated by department question setters.',
    unitOrTopic: 'Units 3 & 4',
    fileFormat: 'PDF',
    fileSize: '1.9 MB',
    pageCount: 12,
    downloadCount: 19,
    rating: 4.7,
    uploadDate: '2026-10-15',
    uploaderName: 'Prof. Rajesh Rao',
    isVerified: true,
    tags: ['Mid-Term', 'Model Paper', 'Greedy', 'MST'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Mid-Term 2 Model Paper Format',
        content: [
          'Part A (5 x 2 = 10 Marks): Mandatory short conceptual questions.',
          'Part B (2 x 15 = 30 Marks): Detailed algorithm implementation and analysis.'
        ]
      }
    ]
  },

  // Lab Manuals for CS201
  {
    id: 'res-cs201-lm1',
    courseId: 'cse',
    subjectId: 'cs201',
    semester: 4,
    type: 'labManuals',
    title: 'CS201L Data Structures Lab Manual & Complete C++ Implementations',
    description: 'Official 14 laboratory experiments with problem statements, algorithmic flowcharts, full commented C++ code, sample test cases, and viva voce question bank.',
    unitOrTopic: 'Lab Syllabus Experiments 1 - 14',
    fileFormat: 'PDF',
    fileSize: '6.5 MB',
    pageCount: 56,
    downloadCount: 45,
    rating: 4.9,
    uploadDate: '2026-09-12',
    uploaderName: 'Department Lab Incharge',
    isVerified: true,
    tags: ['Lab Manual', 'C++ Source', 'Viva Questions', 'Official Syllabus'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Experiment 7: Implementation of AVL Tree Rotations',
        content: [
          'Aim: To write a C++ program to implement an AVL Tree with insertion, deletion, and inorder traversal while maintaining balance factors.',
          'Hardware / Software: Linux / GCC 13+ / GDB.',
          'Algorithm outline: Standard BST insert followed by bottom-up balance factor verification and appropriate LL/RR/LR/RL rotation.'
        ],
        codeSnippet: `// Sample Viva Question:
// Q: What is the maximum height of an AVL tree with n nodes?
// A: h <= 1.44 * log2(n + 2) - 0.328`
      }
    ]
  },

  // Projects for CS201
  {
    id: 'res-cs201-p1',
    courseId: 'cse',
    subjectId: 'cs201',
    semester: 4,
    type: 'projects',
    title: 'Mini-Project: Real-time Campus Navigator using Dijkstra & Graph Visualizer',
    description: 'Complete project bundle: Source code (React + TypeScript + Canvas), detailed project report (IEEE format), PPT slides, and campus map graph dataset.',
    unitOrTopic: 'Graph Algorithms Applied Project',
    fileFormat: 'ZIP',
    fileSize: '18.4 MB',
    pageCount: 28,
    downloadCount: 16,
    rating: 4.9,
    uploadDate: '2026-09-20',
    uploaderName: 'Campus Open Source Club',
    isVerified: true,
    tags: ['Campus Map', 'Dijkstra', 'IEEE Report', 'Complete Bundle', 'Source Code'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Project Synopsis: Campus Indoor/Outdoor Pathfinding',
        content: [
          'Abstract: An interactive graph-based navigation tool that models campus facilities as weighted vertices and walking corridors as edges.',
          'Features dynamic obstacle rerouting, wheelchair accessibility filter, and visual step-by-step path rendering.'
        ]
      }
    ]
  },
  {
    id: 'res-cs201-p2',
    courseId: 'cse',
    subjectId: 'cs201',
    semester: 4,
    type: 'projects',
    title: 'Huffman File Compressor & Decompressor (CLI Tool & Benchmark)',
    description: 'Greedy Huffman coding lossless text compression implementation in C++20 with bit-level file I/O, entropy calculation, and project report.',
    unitOrTopic: 'Greedy Heuristic Project',
    fileFormat: 'ZIP',
    fileSize: '4.8 MB',
    pageCount: 16,
    downloadCount: 14,
    rating: 4.8,
    uploadDate: '2026-08-30',
    uploaderName: 'Alumni Dev Team',
    isVerified: true,
    tags: ['Huffman Coding', 'Bitwise IO', 'Data Compression', 'C++20'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Huffman Compression Pipeline',
        content: [
          '1. Build character frequency distribution.',
          '2. Construct optimal prefix tree using min-heap priority queue.',
          '3. Assign variable-length binary codes and write bitstream header.'
        ]
      }
    ]
  },

  // Operating Systems (CS202) Resources
  {
    id: 'res-cs202-n1',
    courseId: 'cse',
    subjectId: 'cs202',
    semester: 4,
    type: 'notes',
    title: 'Unit 4: Virtual Memory, Paging & Page Replacement Algorithms',
    description: 'In-depth coverage of Demand Paging, Inverted Page Tables, TLB hit/miss analysis, FIFO, LRU, Optimal Page Replacement numericals with solved tables.',
    unitOrTopic: 'Unit 4: Memory Management',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    pageCount: 26,
    downloadCount: 35,
    rating: 4.9,
    uploadDate: '2026-10-20',
    uploaderName: 'Prof. Ananya Sen',
    isVerified: true,
    tags: ['Virtual Memory', 'LRU', 'TLB', 'Page Faults', 'Numericals'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Demand Paging Mechanics',
        content: [
          'Demand paging loads pages into physical frames only when referenced by the CPU during execution.',
          'Page Fault Trap: Triggered by the MMU hardware when the valid/invalid bit in the page table entry is 0.',
          'Effective Access Time (EAT) = (1 - p) * ma + p * (Page Fault Service Time).'
        ],
        formulaSnippet: '\\text{EAT} = (1 - p) \\times t_{\\text{mem}} + p \\times t_{\\text{fault}}'
      }
    ]
  },
  {
    id: 'res-cs202-iq1',
    courseId: 'cse',
    subjectId: 'cs202',
    semester: 4,
    type: 'importantQuestions',
    title: 'CS202 Banker\'s Algorithm & Deadlock Avoidance Solved Numericals',
    description: 'Contains 15 university examination numericals on Safety Algorithm, Resource-Request Algorithm, and Wait-For Graphs with detailed matrix calculations.',
    unitOrTopic: 'Unit 3: Deadlocks',
    fileFormat: 'PDF',
    fileSize: '2.2 MB',
    pageCount: 18,
    downloadCount: 41,
    rating: 4.92,
    uploadDate: '2026-10-14',
    uploaderName: 'Prof. Ananya Sen',
    isVerified: true,
    tags: ['Bankers Algorithm', 'Deadlock', 'Safety State', 'Solved Matrix'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Safety Algorithm Matrix Rule',
        content: [
          'Given Allocation Matrix, Max Matrix, and Available Vector:',
          '1. Calculate Need Matrix: Need[i][j] = Max[i][j] - Allocation[i][j].',
          '2. Find index i such that Finish[i] == false and Need[i] <= Work.',
          '3. If found, Work = Work + Allocation[i]; Finish[i] = true; continue.',
          '4. If all Finish[i] == true, system is in a SAFE state.'
        ]
      }
    ]
  },
  {
    id: 'res-cs202-lm1',
    courseId: 'cse',
    subjectId: 'cs202',
    semester: 4,
    type: 'labManuals',
    title: 'CS202L Unix System Programming & POSIX Threads Lab Manual',
    description: 'Fork/Exec process creation, pipe IPC, POSIX mutex synchronization, semaphore producer-consumer, and xv6 OS kernel compilation notes.',
    unitOrTopic: 'Lab Experiments 1 - 10',
    fileFormat: 'PDF',
    fileSize: '4.7 MB',
    pageCount: 48,
    downloadCount: 29,
    rating: 4.85,
    uploadDate: '2026-09-18',
    uploaderName: 'Linux Systems Lab Team',
    isVerified: true,
    tags: ['POSIX Threads', 'Fork Exec', 'IPC Pipes', 'Semaphores'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Experiment 4: Producer-Consumer using POSIX Semaphores',
        content: [
          'Demonstrates thread synchronization using sem_init, sem_wait, and sem_post to manage bounded buffer without race conditions.'
        ]
      }
    ]
  },

  // DBMS (CS203) Resources
  {
    id: 'res-cs203-n1',
    courseId: 'cse',
    subjectId: 'cs203',
    semester: 4,
    type: 'notes',
    title: 'Unit 3: Complete Guide to Database Normalization (1NF to BCNF)',
    description: 'Closure of functional dependencies, canonical covers, lossless join decomposition proofs, and dependency preservation tests with real student registry examples.',
    unitOrTopic: 'Unit 3: Relational Design Theory',
    fileFormat: 'PDF',
    fileSize: '3.0 MB',
    pageCount: 22,
    downloadCount: 32,
    rating: 4.88,
    uploadDate: '2026-10-19',
    uploaderName: 'Dr. Vikramaditya Nair',
    isVerified: true,
    tags: ['Normalization', 'BCNF', '3NF', 'Lossless Join', 'Functional Dependencies'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Boyce-Codd Normal Form (BCNF) Definition',
        content: [
          'A relation schema R is in BCNF with respect to a set of functional dependencies F if, for all functional dependencies in F+ of the form α → β, where α ⊆ R and β ⊆ R, at least one holds:',
          '1. α → β is trivial (i.e., β ⊆ α).',
          '2. α is a superkey for R.',
          'Every BCNF schema is also in 3NF, eliminating all update anomalies caused by functional dependencies.'
        ]
      }
    ]
  },

  // Machine Learning (AI301) Resources
  {
    id: 'res-ai301-n1',
    courseId: 'aids',
    subjectId: 'ai301',
    semester: 4,
    type: 'notes',
    title: 'Unit 2: Linear & Logistic Regression Mathematical Foundations',
    description: 'Cost function derivation, batch vs stochastic gradient descent, cross-entropy loss, regularization (Ridge & Lasso), and ROC-AUC curve interpretation.',
    unitOrTopic: 'Unit 2: Supervised Learning',
    fileFormat: 'PDF',
    fileSize: '4.5 MB',
    pageCount: 30,
    downloadCount: 23,
    rating: 4.9,
    uploadDate: '2026-10-24',
    uploaderName: 'Dr. Meera Nambiar',
    isVerified: true,
    tags: ['Gradient Descent', 'Logistic Loss', 'ROC AUC', 'Regularization'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Cross-Entropy Loss in Binary Classification',
        content: [
          'For sigmoid hypothesis h_θ(x) = 1 / (1 + e^(-θ^T x)), the cross-entropy cost function guarantees convexity, preventing local minima traps in gradient descent.'
        ],
        formulaSnippet: 'J(\\theta) = -\\frac{1}{m} \\sum_{i=1}^m \\left[ y^{(i)} \\log(h_\\theta(x^{(i)})) + (1 - y^{(i)}) \\log(1 - h_\\theta(x^{(i)})) \\right]'
      }
    ]
  },

  // Mechanical Engineering (ME201) Resources
  {
    id: 'res-me201-n1',
    courseId: 'me',
    subjectId: 'me201',
    semester: 4,
    type: 'notes',
    title: 'Unit 3: Gas Power & Rankine Cycles Hand-Solved Numericals',
    description: 'Detailed analysis of Otto, Diesel, Dual, and reheat Rankine cycles with T-s & P-v diagrams, thermal efficiencies, and mean effective pressure derivations.',
    unitOrTopic: 'Unit 3: Power Cycles',
    fileFormat: 'PDF',
    fileSize: '3.6 MB',
    pageCount: 28,
    downloadCount: 39,
    rating: 4.9,
    uploadDate: '2026-10-23',
    uploaderName: 'Dr. V. K. Sharma',
    isVerified: true,
    tags: ['Rankine Cycle', 'Otto Cycle', 'P-V Diagrams', 'Thermal Efficiency'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Ideal Rankine Cycle Overview',
        content: [
          'The Rankine cycle is the fundamental operating cycle of all steam turbine power generating stations.',
          'Processes: 1-2 Isentropic pump work, 2-3 Constant pressure heat addition in boiler, 3-4 Isentropic turbine expansion, 4-1 Constant pressure heat rejection in condenser.'
        ],
        formulaSnippet: '\\eta_{\\text{th}} = \\frac{W_{\\text{net}}}{Q_{\\text{in}}} = \\frac{(h_3 - h_4) - (h_2 - h_1)}{h_3 - h_2}'
      }
    ]
  },
  {
    id: 'res-me201-iq1',
    courseId: 'me',
    subjectId: 'me201',
    semester: 4,
    type: 'importantQuestions',
    title: 'ME201 Important Questions (Units 1 to 5)',
    description: 'Solved university numericals on Clausius inequality, entropy generation, steam nozzle throat calculations, and vapor compression refrigeration.',
    unitOrTopic: 'Units 1 to 5 Comprehensive',
    fileFormat: 'PDF',
    fileSize: '4.2 MB',
    pageCount: 36,
    downloadCount: 44,
    rating: 4.88,
    uploadDate: '2026-10-16',
    uploaderName: 'Mechanical Dept Exam Cell',
    isVerified: true,
    tags: ['Important Questions', 'Solved Numericals', 'Entropy', 'Refrigeration'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'High-Yield 15-Mark Questions',
        content: [
          'Q1: Derive the expression for thermal efficiency of an air standard Otto cycle in terms of compression ratio and specific heat ratio.',
          'Q2: A steam turbine operates between 40 bar, 400°C and 0.08 bar. Calculate cycle efficiency and work ratio assuming ideal Rankine cycle.'
        ]
      }
    ]
  },
  {
    id: 'res-me201-lm1',
    courseId: 'me',
    subjectId: 'me201',
    semester: 4,
    type: 'labManuals',
    title: 'ME201L Thermal Engineering Lab Manual & Test Bench Readings',
    description: 'Performance testing on 4-stroke single cylinder diesel engine, Morse test on multi-cylinder petrol engine, and boiler efficiency calculation sheets.',
    unitOrTopic: 'Lab Experiments 1-8',
    fileFormat: 'PDF',
    fileSize: '5.1 MB',
    pageCount: 44,
    downloadCount: 25,
    rating: 4.82,
    uploadDate: '2026-09-22',
    uploaderName: 'IC Engines Lab Incharge',
    isVerified: true,
    tags: ['Morse Test', 'Diesel Test', 'Lab Manual', 'Readings'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Experiment 3: Heat Balance Sheet on Diesel Engine',
        content: [
          'Aim: To conduct a load test on single cylinder four stroke diesel engine and draw the heat balance sheet.'
        ]
      }
    ]
  },
  {
    id: 'res-me201-p1',
    courseId: 'me',
    subjectId: 'me201',
    semester: 4,
    type: 'projects',
    title: 'Mini-Project: Solar Parabolic Trough Water Heater Prototype Report',
    description: 'Design calculations, CAD models, thermal efficiency graphs, and cost analysis for a campus solar thermal prototype.',
    unitOrTopic: 'Solar Thermal Engineering',
    fileFormat: 'ZIP',
    fileSize: '12.4 MB',
    pageCount: 22,
    downloadCount: 17,
    rating: 4.75,
    uploadDate: '2026-09-05',
    uploaderName: 'Green Campus Project Cell',
    isVerified: true,
    tags: ['Solar Thermal', 'CAD Design', 'Report', 'Project'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Project Synopsis: Parabolic Solar Concentrator',
        content: [
          'Abstract: Design and thermodynamic validation of parabolic trough collector tracking the sun for industrial process heat.'
        ]
      }
    ]
  },

  // Computer Applications (BCA201) Resources
  {
    id: 'res-bca201-n1',
    courseId: 'bca',
    subjectId: 'bca201',
    semester: 4,
    type: 'notes',
    title: 'Unit 2: Modern ES6+ JavaScript, Promises & Async/Await Notes',
    description: 'Deep dive into closures, prototypal inheritance, Event Loop, Promises, Fetch API, and DOM manipulation patterns with code sandboxes.',
    unitOrTopic: 'Unit 2: Core JavaScript',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    pageCount: 26,
    downloadCount: 46,
    rating: 4.95,
    uploadDate: '2026-10-21',
    uploaderName: 'Prof. Neha Gupta',
    isVerified: true,
    tags: ['JavaScript', 'ES6', 'Promises', 'Async Await', 'DOM APIs'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'The JavaScript Event Loop & Microtask Queue',
        content: [
          'JavaScript is single-threaded: the call stack executes synchronous functions while the Event Loop orchestrates async callbacks.',
          'Microtasks (Promise.then, MutationObserver) have higher priority than Macrotasks (setTimeout, setInterval, I/O).'
        ],
        codeSnippet: `async function fetchResource(id) {
  try {
    const res = await fetch(\`/api/resources/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}`
      }
    ]
  },
  {
    id: 'res-bca201-iq1',
    courseId: 'bca',
    subjectId: 'bca201',
    semester: 4,
    type: 'importantQuestions',
    title: 'BCA201 University End-Sem Model Question Bank with Full Solutions',
    description: 'Covers CSS Grid vs Flexbox, React hooks (useState, useEffect, useMemo), state lifting, and REST API architectural principles.',
    unitOrTopic: 'All Units 1-5 Solved',
    fileFormat: 'PDF',
    fileSize: '2.8 MB',
    pageCount: 30,
    downloadCount: 40,
    rating: 4.9,
    uploadDate: '2026-10-18',
    uploaderName: 'BCA Department Toppers',
    isVerified: true,
    tags: ['BCA Important Questions', 'React Hooks', 'CSS Grid', 'Model Answers'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Core 16-Mark University Questions',
        content: [
          'Q1: Explain the React Component Lifecycle and how useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount.',
          'Q2: Compare CSS Flexbox and CSS Grid layout algorithms. When is each preferred?'
        ]
      }
    ]
  },
  {
    id: 'res-bca201-lm1',
    courseId: 'bca',
    subjectId: 'bca201',
    semester: 4,
    type: 'labManuals',
    title: 'BCA201L Web Development Practical Exercises & Solution Scripts',
    description: '12 practical exercises including responsive landing page, dynamic shopping cart with localStorage, and full CRUD REST integration.',
    unitOrTopic: 'Lab Experiments 1-12',
    fileFormat: 'PDF',
    fileSize: '4.0 MB',
    pageCount: 38,
    downloadCount: 33,
    rating: 4.88,
    uploadDate: '2026-09-25',
    uploaderName: 'Prof. Neha Gupta',
    isVerified: true,
    tags: ['Lab Manual', 'JavaScript', 'HTML5', 'CRUD Exercises'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Experiment 6: State-Driven Dynamic Todo & Cart Application',
        content: [
          'Objective: Create a modular JavaScript application using template literals, event delegation, and browser localStorage persistence.'
        ]
      }
    ]
  },
  {
    id: 'res-bca201-p1',
    courseId: 'bca',
    subjectId: 'bca201',
    semester: 4,
    type: 'projects',
    title: 'Capstone: Full-Stack Campus Marketplace (React + Express + SQLite)',
    description: 'Complete source bundle: React SPA frontend, Express backend, JWT auth middleware, SQL schema migrations, and IEEE project report.',
    unitOrTopic: 'Full-Stack Web Project',
    fileFormat: 'ZIP',
    fileSize: '16.5 MB',
    pageCount: 25,
    downloadCount: 22,
    rating: 4.94,
    uploadDate: '2026-09-10',
    uploaderName: 'Campus Web Development Club',
    isVerified: true,
    tags: ['Full Stack', 'React', 'Express', 'JWT', 'Source Code'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Campus Marketplace Synopsis & Architecture',
        content: [
          'Abstract: A decentralized peer-to-peer campus exchange application enabling verified university students to trade textbooks and calculators.'
        ]
      }
    ]
  },

  // Basic & Applied Sciences (BSC201) Resources
  {
    id: 'res-bsc201-n1',
    courseId: 'bsc',
    subjectId: 'bsc201',
    semester: 4,
    type: 'notes',
    title: 'Unit 3: Eigenvalues, Diagonalization & Matrix Powers Master Sheet',
    description: 'Step-by-step Cayley-Hamilton theorem, characteristic polynomials, algebraic vs geometric multiplicity, and symmetric matrix spectral theorem.',
    unitOrTopic: 'Unit 3: Spectral Theory',
    fileFormat: 'PDF',
    fileSize: '2.9 MB',
    pageCount: 22,
    downloadCount: 34,
    rating: 4.92,
    uploadDate: '2026-10-19',
    uploaderName: 'Dr. S. K. Mitra',
    isVerified: true,
    tags: ['Linear Algebra', 'Eigenvalues', 'Diagonalization', 'Spectral Theorem'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Characteristic Polynomial & Eigenvalues',
        content: [
          'Let A be an n x n matrix over field F. A scalar λ is an eigenvalue of A if det(A - λI) = 0.',
          'Cayley-Hamilton Theorem: Every square matrix satisfies its own characteristic equation, i.e., p(A) = 0.'
        ],
        formulaSnippet: 'P_A(\\lambda) = \\det(A - \\lambda I) = 0 \\implies A^n + c_{n-1}A^{n-1} + \\dots + c_0 I = 0'
      }
    ]
  },
  {
    id: 'res-bsc201-iq1',
    courseId: 'bsc',
    subjectId: 'bsc201',
    semester: 4,
    type: 'importantQuestions',
    title: 'BSC201 Multivariable Calculus & Green\'s Theorem Solved Important Questions',
    description: 'Vector calculus proofs, surface integrals, divergence theorem numericals, and orthogonal diagonalization test problems.',
    unitOrTopic: 'Units 3 & 4',
    fileFormat: 'PDF',
    fileSize: '2.5 MB',
    pageCount: 24,
    downloadCount: 28,
    rating: 4.85,
    uploadDate: '2026-10-12',
    uploaderName: 'Science Faculty Board',
    isVerified: true,
    tags: ['Greens Theorem', 'Multiple Integrals', 'Solved Important Questions'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Important Exam Questions (Vector Calculus)',
        content: [
          'Verify Green\'s Theorem in the plane for ∮ (xy + y²) dx + x² dy where C is bounded by y = x and y = x².'
        ]
      }
    ]
  },
  {
    id: 'res-bsc201-lm1',
    courseId: 'bsc',
    subjectId: 'bsc201',
    semester: 4,
    type: 'labManuals',
    title: 'BSC201L Computational Mathematics using Python & NumPy',
    description: 'Numerical algorithms for matrix inversion, LU decomposition, QR factorization, and numerical integration with verified Jupyter Notebooks.',
    unitOrTopic: 'Computational Lab Manual',
    fileFormat: 'PDF',
    fileSize: '3.4 MB',
    pageCount: 32,
    downloadCount: 18,
    rating: 4.8,
    uploadDate: '2026-09-15',
    uploaderName: 'Dr. S. K. Mitra',
    isVerified: true,
    tags: ['NumPy', 'Python', 'Computational Math', 'LU Decomposition'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Experiment 4: LU Decomposition with Partial Pivoting',
        content: [
          'Demonstrates solving Ax = b using Doolittle algorithm and comparing execution benchmarks with NumPy linalg solver.'
        ]
      }
    ]
  },
  {
    id: 'res-bsc201-p1',
    courseId: 'bsc',
    subjectId: 'bsc201',
    semester: 4,
    type: 'projects',
    title: 'Research Study: Principal Component Analysis (PCA) on Genomic Datasets',
    description: 'Spectral decomposition applied to dimensional reduction on real microarray cancer classification data with LaTeX report.',
    unitOrTopic: 'Applied Linear Algebra Project',
    fileFormat: 'ZIP',
    fileSize: '8.2 MB',
    pageCount: 18,
    downloadCount: 15,
    rating: 4.9,
    uploadDate: '2026-08-28',
    uploaderName: 'Department Research Scholars',
    isVerified: true,
    tags: ['PCA', 'Eigenvectors', 'Genomics', 'LaTeX Report'],
    previewPages: [
      {
        pageNumber: 1,
        title: 'Project Abstract: PCA & Covariance Matrix Eigenspaces',
        content: [
          'Derives orthogonal projection onto highest variance eigenvectors to reduce 10,000 dimensions down to 2 principal components.'
        ]
      }
    ]
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Admin: Unit 3 notes for Data Structures uploaded',
    content: 'Dr. Rajesh Rao has updated the verified lecture notes on Balanced Binary Trees (AVL & Red-Black Trees) including dry-run examples for mid-term preparation.',
    author: 'Prof. Rajesh Rao (Course Lead)',
    category: 'materials',
    date: '2 hours ago',
    isNew: true,
    targetCourse: 'Computer Science',
  },
  {
    id: 'ann-2',
    title: 'Examination Cell: Solved Important Questions Bank Live',
    content: '5 years of solved university papers for Operating Systems and DBMS have been added to the Important Questions tab.',
    author: 'Academic Dean Office',
    category: 'academic',
    date: 'Yesterday',
    isNew: true,
    targetCourse: 'All Branches',
  },
  {
    id: 'ann-3',
    title: 'Lab Notice: POSIX Threads experiment added to OS Manual',
    content: 'Students enrolled in CS202L must review Experiment 4 (Producer-Consumer with Semaphores) prior to the lab assessment on Monday.',
    author: 'Systems Lab Coordinator',
    category: 'urgent',
    date: '3 days ago',
    isNew: false,
    targetCourse: 'Computer Science',
  },
];

export const mockRequests: ResourceRequest[] = [
  {
    id: 'req-101',
    studentId: 'CS2023012',
    studentName: 'Rohan Verma',
    studentEmail: 'rohan.v@campus.edu',
    courseId: 'cse',
    courseName: 'B.Tech CSE',
    subjectId: 'cs202',
    subjectName: 'Operating Systems (CS202)',
    resourceType: 'notes',
    topic: 'Unit 5 File Systems Internals (ext4 Inode allocation & Disk Scheduling algorithms)',
    urgency: 'high',
    status: 'pending',
    createdAt: '2026-11-01 14:15',
    note: 'Mid-term syllabus covers SSTF and SCAN disk scheduling numericals which are missing in current notes.',
  },
  {
    id: 'req-102',
    studentId: 'CS2023089',
    studentName: 'Pooja Iyer',
    studentEmail: 'pooja.i@campus.edu',
    courseId: 'cse',
    courseName: 'B.Tech CSE',
    subjectId: 'cs201',
    subjectName: 'Data Structures & Algorithms (CS201)',
    resourceType: 'importantQuestions',
    topic: '2-Mark compilation for Unit 5 Tries and Disjoint Set Union with solutions',
    urgency: 'medium',
    status: 'pending',
    createdAt: '2026-10-31 18:30',
  },
  {
    id: 'req-103',
    studentId: 'AI2023034',
    studentName: 'Dev Patel',
    studentEmail: 'dev.p@campus.edu',
    courseId: 'aids',
    courseName: 'B.Tech AI & DS',
    subjectId: 'ai301',
    subjectName: 'Machine Learning (AI301)',
    resourceType: 'labManuals',
    topic: 'Jupyter Notebooks with Scikit-learn for SVM kernel experiments',
    urgency: 'high',
    status: 'fulfilled',
    createdAt: '2026-10-29 11:00',
    note: 'Fulfilled by Dr. Meera Nambiar on Oct 30.',
  },
  {
    id: 'req-104',
    studentId: 'EC2023055',
    studentName: 'Sneha Reddy',
    studentEmail: 'sneha.r@campus.edu',
    courseId: 'ece',
    courseName: 'B.Tech ECE',
    subjectId: 'ec201',
    subjectName: 'Signals & Systems (EC201)',
    resourceType: 'importantQuestions',
    topic: 'Formula sheet for Laplace and Inverse Laplace transforms with ROC properties',
    urgency: 'low',
    status: 'pending',
    createdAt: '2026-10-28 09:45',
  },
];
