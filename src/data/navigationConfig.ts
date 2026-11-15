import { ResourceType, Resource } from '../types';

export interface SubjectConfig {
  id: string;
  code: string;
  name: string;
  description: string;
  semester: number; // 1 to 8
  credits?: number;
}

export interface SpecializationConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  totalSemesters?: number; // e.g., 8 for B.Tech, 2 for First Year, 6 for BBA/BCA, 4 for MBA
  subjects: SubjectConfig[];
}

export interface FieldConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  specializations: SpecializationConfig[];
}

export interface NavigationPath {
  fieldId?: string;
  specializationId?: string;
  semester?: number; // Added semester step
  resourceType?: ResourceType;
  subjectId?: string;
}

export const RESOURCE_TYPES: { id: ResourceType; label: string; description: string; icon: string }[] = [
  { id: 'notes', label: 'Notes', description: 'Curriculum lecture notes, unit summaries, and study modules', icon: 'FileText' },
  { id: 'importantQuestions', label: 'Important questions', description: 'High-yield examination questions, model papers, and solved proofs', icon: 'HelpCircle' },
  { id: 'labManuals', label: 'Lab manuals', description: 'Practical experiment manuals, commented source code, and viva question banks', icon: 'FlaskConical' },
  { id: 'projects', label: 'Projects', description: 'Capstone software projects, IEEE design reports, and presentation slides', icon: 'FolderGit2' },
  { id: 'syllabus', label: 'Syllabus', description: 'Official semester curriculum breakups, reference textbooks, and marking schemes', icon: 'BookOpen' },
];

/**
 * Single Master Configuration Object for CampusShare Navigation
 * Hierarchy: Field > Specialization > Semester > Subject
 */
export const NAVIGATION_CONFIG: FieldConfig[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    shortName: 'B.Tech / B.E.',
    description: 'Foundational disciplines, computational theory, machine mechanics, and circuit architectures.',
    icon: 'Cpu',
    specializations: [
      {
        id: 'first-year',
        name: 'First Year (Common)',
        shortName: 'FY Common',
        description: 'Universal first-year curriculum covering foundational engineering mathematics, physics, and computing basics.',
        icon: 'GraduationCap',
        totalSemesters: 2,
        subjects: [
          { id: 'fe101', code: 'FE101', name: 'Engineering Mathematics I', description: 'Calculus, matrices, infinite series, and differential equations.', semester: 1, credits: 4 },
          { id: 'fe102', code: 'FE102', name: 'Engineering Physics', description: 'Optics, quantum mechanics, lasers, and semiconductor physics.', semester: 1, credits: 4 },
          { id: 'fe103', code: 'FE103', name: 'Basic Electrical Engineering', description: 'DC/AC network theorems, magnetic circuits, and single-phase transformers.', semester: 1, credits: 3 },
          { id: 'fe104', code: 'FE104', name: 'Engineering Graphics & Design', description: 'Orthographic projections, isometric views, and CAD modeling basics.', semester: 2, credits: 3 },
          { id: 'fe105', code: 'FE105', name: 'Problem Solving & Python Programming', description: 'Algorithmic logic, control flow, functions, lists, and file manipulation.', semester: 2, credits: 3 },
        ],
      },
      {
        id: 'cse',
        name: 'Computer Science',
        shortName: 'CSE',
        description: 'Data structures, operating systems, database engines, distributed algorithms, and compiler design.',
        icon: 'Terminal',
        totalSemesters: 8,
        subjects: [
          { id: 'cs101', code: 'CS101', name: 'Programming in C & Computational Thinking', description: 'Procedural programming, pointer arithmetic, memory allocation, and recursion.', semester: 1, credits: 4 },
          { id: 'cs102', code: 'CS102', name: 'Digital Logic & System Design', description: 'Boolean algebra, combinational circuits, flip-flops, and finite state machines.', semester: 1, credits: 3 },
          { id: 'cs103', code: 'CS103', name: 'Object Oriented Programming in C++', description: 'Encapsulation, inheritance, polymorphism, templates, and STL containers.', semester: 2, credits: 4 },
          { id: 'cs104', code: 'CS104', name: 'Computer Fundamentals & IT Systems', description: 'Architecture basics, number representations, and system bus topologies.', semester: 2, credits: 3 },
          { id: 'ma201', code: 'MA201', name: 'Discrete Mathematics', description: 'Graph theory, combinatorics, predicate logic, recurrence relations, and lattice theory.', semester: 3, credits: 4 },
          { id: 'cs204', code: 'CS204', name: 'Computer Organization & Architecture', description: 'Instruction pipelining, cache memory hierarchies, RISC vs CISC, and ALU design.', semester: 3, credits: 3 },
          { id: 'cs201', code: 'CS201', name: 'Data Structures & Algorithms', description: 'Balanced search trees, graph algorithms, dynamic programming, and complexity proofs.', semester: 4, credits: 4 },
          { id: 'cs202', code: 'CS202', name: 'Operating Systems', description: 'Virtual memory management, process scheduling, concurrency, and POSIX threads.', semester: 4, credits: 4 },
          { id: 'cs203', code: 'CS203', name: 'Database Management Systems', description: 'Relational calculus, SQL optimizations, BCNF normalization, and ACID transaction logs.', semester: 4, credits: 4 },
          { id: 'cs301', code: 'CS301', name: 'Theory of Computation & Automata', description: 'Regular expressions, DFAs/NFAs, pushdown automata, Turing completeness, and decidability.', semester: 5, credits: 4 },
          { id: 'cs302', code: 'CS302', name: 'Computer Networks', description: 'OSI/TCP-IP models, packet routing algorithms, flow control, and transport socket APIs.', semester: 5, credits: 4 },
          { id: 'cs303', code: 'CS303', name: 'Software Engineering & Agile Methodologies', description: 'UML modeling, design patterns, automated testing suites, and CI/CD pipelines.', semester: 5, credits: 3 },
          { id: 'cs304', code: 'CS304', name: 'Compiler Design', description: 'Lexical analysis, LL(1)/LR(1) parsers, intermediate code generation, and optimization.', semester: 6, credits: 4 },
          { id: 'ai301', code: 'AI301', name: 'Artificial Intelligence & Machine Learning', description: 'Informed heuristics, supervised learning, neural networks, and evaluation curves.', semester: 6, credits: 4 },
          { id: 'cs305', code: 'CS305', name: 'Cloud Computing & Distributed Systems', description: 'Virtualization, microservice patterns, consensus algorithms, and cloud storage.', semester: 6, credits: 3 },
          { id: 'cs401', code: 'CS401', name: 'Cryptography & Information Security', description: 'RSA, elliptic curves, hash message integrity, zero-knowledge proofs, and PKI.', semester: 7, credits: 4 },
          { id: 'cs402', code: 'CS402', name: 'DevOps & Site Reliability Engineering', description: 'Docker containerization, Kubernetes orchestrations, observability, and IaC.', semester: 7, credits: 3 },
          { id: 'cs403', code: 'CS403', name: 'Full-Stack Capstone Project', description: 'End-to-end production application development, architecture review, and deployment.', semester: 8, credits: 6 },
          { id: 'cs404', code: 'CS404', name: 'Cyber Law & Professional Ethics', description: 'IT Act compliance, digital forensics, intellectual property, and ethical AI governance.', semester: 8, credits: 2 },
        ],
      },
      {
        id: 'mechanical',
        name: 'Mechanical',
        shortName: 'ME',
        description: 'Thermodynamic cycles, fluid dynamics, manufacturing systems, kinematics, and solid mechanics.',
        icon: 'Wrench',
        totalSemesters: 8,
        subjects: [
          { id: 'me101', code: 'ME101', name: 'Engineering Mechanics', description: 'Static equilibrium, vector forces, friction laws, and moment of inertia.', semester: 1, credits: 4 },
          { id: 'me102', code: 'ME102', name: 'Material Science & Metallurgy', description: 'Crystal defects, phase diagrams, heat treatment, and alloy compositions.', semester: 2, credits: 3 },
          { id: 'me203', code: 'ME203', name: 'Kinematics & Dynamics of Machines', description: 'Planar mechanisms, gear trains, cam profiles, and dynamic balancing of rotors.', semester: 3, credits: 4 },
          { id: 'me201', code: 'ME201', name: 'Applied Thermodynamics', description: 'Gas power cycles, Rankine reheat cycles, steam turbine efficiency, and refrigeration.', semester: 4, credits: 4 },
          { id: 'me202', code: 'ME202', name: 'Fluid Mechanics & Machinery', description: 'Navier-Stokes equations, boundary layer theory, Pelton wheel, and centrifugal pumps.', semester: 4, credits: 4 },
          { id: 'me204', code: 'ME204', name: 'Manufacturing Technology', description: 'Metal casting, CNC machining, welding metallurgy, and additive manufacturing.', semester: 5, credits: 3 },
          { id: 'me301', code: 'ME301', name: 'Heat & Mass Transfer', description: 'Conduction Fourier laws, natural/forced convection, radiation, and heat exchangers.', semester: 5, credits: 4 },
          { id: 'me302', code: 'ME302', name: 'Design of Machine Elements', description: 'Fatigue failure theories, shafts, bearings, spur/helical gears, and bolt design.', semester: 6, credits: 4 },
          { id: 'me401', code: 'ME401', name: 'CAD/CAM & Industrial Automation', description: 'Solid modeling algorithms, G/M code generation, robotics, and PLC automation.', semester: 7, credits: 4 },
          { id: 'me402', code: 'ME402', name: 'Mechanical Engineering Major Project', description: 'Mechanical prototyping, FEA structural simulation, and experimental validation.', semester: 8, credits: 6 },
        ],
      },
      {
        id: 'electrical',
        name: 'Electrical',
        shortName: 'EE',
        description: 'Power transmission, electrical machines, electromagnetics, control engineering, and grid protection.',
        icon: 'Zap',
        totalSemesters: 8,
        subjects: [
          { id: 'ee101', code: 'EE101', name: 'Basic Electrical Circuit Analysis', description: 'Kirchhoff laws, nodal/mesh theorems, and sinusoidal AC steady-state analysis.', semester: 1, credits: 4 },
          { id: 'ee102', code: 'EE102', name: 'Electromagnetic Field Theory', description: 'Gauss law, Ampere law, boundary conditions, and magnetic vector potential.', semester: 2, credits: 4 },
          { id: 'ee201', code: 'EE201', name: 'Circuit Theory & Networks', description: 'Mesh/nodal analysis, Laplace transforms in circuits, two-port networks, and resonance.', semester: 3, credits: 4 },
          { id: 'ee202', code: 'EE202', name: 'Electrical Machines I', description: 'DC machines characteristics, transformer testing, and armature reaction.', semester: 4, credits: 4 },
          { id: 'ee203', code: 'EE203', name: 'Power Systems Engineering', description: 'Transmission line parameters, load flow analysis, symmetrical faults, and corona loss.', semester: 5, credits: 4 },
          { id: 'ee204', code: 'EE204', name: 'Control Systems Analysis', description: 'Bode plots, Nyquist criterion, root locus technique, and state-space models.', semester: 6, credits: 4 },
          { id: 'ee301', code: 'EE301', name: 'Power Electronics & Drives', description: 'SCR, MOSFET, IGBT converters, inverters, and variable frequency drives.', semester: 7, credits: 4 },
          { id: 'ee401', code: 'EE401', name: 'Electrical Systems Capstone', description: 'Grid integration, micro-inverter design, or high-voltage switchgear simulation.', semester: 8, credits: 6 },
        ],
      },
      {
        id: 'ece',
        name: 'Electronics & Communication',
        shortName: 'ECE',
        description: 'Digital logic circuits, signal processing, analog microelectronics, RF theory, and wireless protocols.',
        icon: 'Radio',
        totalSemesters: 8,
        subjects: [
          { id: 'ece101', code: 'ECE101', name: 'Semiconductor Electronic Devices', description: 'PN junction physics, BJT/FET characteristics, and diode switching models.', semester: 1, credits: 4 },
          { id: 'ece102', code: 'ECE102', name: 'Network Analysis & Synthesis', description: 'Passive filter design, network synthesis, Hurwitz polynomials, and transient response.', semester: 2, credits: 3 },
          { id: 'ece203', code: 'ECE203', name: 'Digital Logic Design & VHDL', description: 'K-maps, synchronous sequential circuits, finite state machines, and FPGA synthesis.', semester: 3, credits: 3 },
          { id: 'ece201', code: 'ECE201', name: 'Signals & Systems', description: 'Continuous/discrete convolution, Fourier transforms, Z-transforms, and LTI systems.', semester: 4, credits: 4 },
          { id: 'ece202', code: 'ECE202', name: 'Analog Integrated Circuits', description: 'BJT/MOSFET differential amplifiers, op-amp filters, oscillators, and voltage regulators.', semester: 4, credits: 4 },
          { id: 'ece204', code: 'ECE204', name: 'Electromagnetic Field Theory', description: 'Maxwell equations, plane wave propagation, waveguides, and antenna radiation patterns.', semester: 5, credits: 4 },
          { id: 'ece301', code: 'ECE301', name: 'Microprocessors & Microcontrollers', description: 'ARM Cortex/8086 architectures, assembly programming, timers, and peripheral interfaces.', semester: 6, credits: 4 },
          { id: 'ece401', code: 'ECE401', name: 'VLSI Design & Embedded Systems', description: 'CMOS layout design, static timing analysis, RTL synthesis, and RTOS fundamentals.', semester: 7, credits: 4 },
          { id: 'ece402', code: 'ECE402', name: 'Communication Engineering Capstone', description: 'Wireless transceiver hardware, SDR implementations, and antenna array testing.', semester: 8, credits: 6 },
        ],
      },
      {
        id: 'civil',
        name: 'Civil',
        shortName: 'CE',
        description: 'Structural mechanics, geotechnical soil behavior, hydraulic engineering, and transportation survey.',
        icon: 'Building2',
        totalSemesters: 8,
        subjects: [
          { id: 'ce101', code: 'CE101', name: 'Engineering Geology & Building Materials', description: 'Mineralogy, rock classifications, brick masonry, and eco-friendly cements.', semester: 1, credits: 3 },
          { id: 'ce102', code: 'CE102', name: 'Strength of Materials', description: 'Stress-strain tensors, shear force and bending moment diagrams, and column buckling.', semester: 2, credits: 4 },
          { id: 'ce202', code: 'CE202', name: 'Surveying & Geomatics', description: 'Total station operations, GPS triangulation, contour mapping, and photogrammetry.', semester: 3, credits: 3 },
          { id: 'ce201', code: 'CE201', name: 'Structural Analysis I', description: 'Moment distribution method, slope deflection equations, and strain energy theorems.', semester: 4, credits: 4 },
          { id: 'ce204', code: 'CE204', name: 'Concrete Technology & Design', description: 'Mix proportioning, limit state design of RC beams, columns, and slabs per code.', semester: 4, credits: 4 },
          { id: 'ce203', code: 'CE203', name: 'Geotechnical Engineering', description: 'Soil shear strength, Mohr-Coulomb theory, permeability, and shallow foundation bearing.', semester: 5, credits: 4 },
          { id: 'ce301', code: 'CE301', name: 'Design of Steel Structures', description: 'Bolted/welded connections, tension/compression members, and plate girders.', semester: 6, credits: 4 },
          { id: 'ce401', code: 'CE401', name: 'Environmental Engineering & Hydrology', description: 'Water purification processes, wastewater treatment, and watershed runoff modeling.', semester: 7, credits: 4 },
          { id: 'ce402', code: 'CE402', name: 'Civil Engineering Capstone', description: 'Infrastructure design proposal, structural modeling in ETABS, and environmental impact.', semester: 8, credits: 6 },
        ],
      },
    ],
  },
  {
    id: 'computer-applications',
    name: 'Computer Applications',
    shortName: 'BCA / MCA',
    description: 'Modern application engineering, enterprise software design, full-stack stacks, and cloud architectures.',
    icon: 'Layers',
    specializations: [
      {
        id: 'bca',
        name: 'BCA',
        shortName: 'BCA',
        description: 'Web engineering, object-oriented software design, dynamic scripting, and database administration.',
        icon: 'Code',
        totalSemesters: 6,
        subjects: [
          { id: 'bca101', code: 'BCA101', name: 'Programming Fundamentals in C', description: 'Control structures, arrays, pointers, structures, unions, and file handling.', semester: 1, credits: 4 },
          { id: 'bca102', code: 'BCA102', name: 'Digital Electronics & Computer Architecture', description: 'Logic gates, registers, arithmetic circuits, and memory addressing modes.', semester: 2, credits: 4 },
          { id: 'bca202', code: 'BCA202', name: 'Object Oriented Programming with Java', description: 'Inheritance hierarchies, multithreading, collections framework, and JDBC connectivity.', semester: 3, credits: 4 },
          { id: 'bca201', code: 'BCA201', name: 'Modern Web Development', description: 'Modern JavaScript ES6+, DOM manipulation, React component state, and REST integration.', semester: 4, credits: 4 },
          { id: 'bca203', code: 'BCA203', name: 'Software Engineering Principles', description: 'Agile sprints, SDLC models, UML diagrams, testing matrices, and CI/CD basics.', semester: 4, credits: 3 },
          { id: 'bca204', code: 'BCA204', name: 'Cloud Computing Fundamentals', description: 'IaaS/PaaS/SaaS architectures, containerization with Docker, and serverless APIs.', semester: 5, credits: 3 },
          { id: 'bca301', code: 'BCA301', name: 'Python Scripting & Data Science Basics', description: 'NumPy arrays, Pandas dataframes, Matplotlib plots, and exploratory data analysis.', semester: 5, credits: 3 },
          { id: 'bca302', code: 'BCA302', name: 'BCA Full-Stack Capstone Project', description: 'Complete web application architecture, deployment to cloud hosting, and user testing.', semester: 6, credits: 6 },
        ],
      },
      {
        id: 'mca',
        name: 'MCA',
        shortName: 'MCA',
        description: 'Enterprise architectures, full-stack microservices, advanced algorithms, and mobile development.',
        icon: 'Server',
        totalSemesters: 4,
        subjects: [
          { id: 'mca101', code: 'MCA101', name: 'Advanced Algorithms & Complexity', description: 'Approximation algorithms, NP-completeness proofs, network flow, and string matching.', semester: 1, credits: 4 },
          { id: 'mca102', code: 'MCA102', name: 'Enterprise Java & Spring Boot', description: 'Microservices architecture, Hibernate ORM, Spring Security, and message brokers.', semester: 2, credits: 4 },
          { id: 'ai301', code: 'MCA103', name: 'Machine Learning Foundations', description: 'Supervised regression, classification metrics, cross-entropy loss, and ROC curves.', semester: 3, credits: 4 },
          { id: 'mca104', code: 'MCA104', name: 'Mobile Application Development', description: 'Cross-platform app design, native state managers, offline caching, and store deployment.', semester: 3, credits: 3 },
          { id: 'mca201', code: 'MCA201', name: 'Enterprise Cloud System Capstone', description: 'Distributed microservice system implementation with Kubernetes, Kafka, and OAuth2.', semester: 4, credits: 8 },
        ],
      },
    ],
  },
  {
    id: 'sciences',
    name: 'Sciences',
    shortName: 'B.Sc / M.Sc',
    description: 'Empirical physics, experimental chemical kinetics, pure mathematical structures, and research analytics.',
    icon: 'FlaskConical',
    specializations: [
      {
        id: 'physics',
        name: 'Physics',
        shortName: 'Physics',
        description: 'Theoretical mechanics, quantum state formulations, wave optics, and solid-state condensed matter.',
        icon: 'Atom',
        totalSemesters: 6,
        subjects: [
          { id: 'phy101', code: 'PHY101', name: 'Classical Mechanics & Waves', description: 'Lagrangian and Hamiltonian formulations, central force problems, and wave motion.', semester: 1, credits: 4 },
          { id: 'phy102', code: 'PHY102', name: 'Quantum Physics & Relativity', description: 'Schrödinger wave equation, wave-particle duality, and Lorentz transformations.', semester: 2, credits: 4 },
          { id: 'phy103', code: 'PHY103', name: 'Electrodynamics & Optics', description: 'Poynting theorem, diffraction grating formulas, polarization, and laser physics.', semester: 3, credits: 4 },
          { id: 'phy104', code: 'PHY104', name: 'Solid State & Statistical Physics', description: 'Crystal lattice structures, band theory of solids, and Maxwell-Boltzmann statistics.', semester: 4, credits: 4 },
          { id: 'phy301', code: 'PHY301', name: 'Nuclear & Particle Physics', description: 'Radioactive decay models, nuclear binding energy, and standard model particles.', semester: 5, credits: 4 },
          { id: 'phy302', code: 'PHY302', name: 'Experimental Physics Senior Thesis', description: 'Laboratory spectroscopic analysis, data modeling, and formal research report.', semester: 6, credits: 6 },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        shortName: 'Chemistry',
        description: 'Organic reaction mechanisms, physical thermodynamics, molecular coordination, and spectroscopy.',
        icon: 'TestTube2',
        totalSemesters: 6,
        subjects: [
          { id: 'chem101', code: 'CHEM101', name: 'Organic Reaction Mechanisms', description: 'Nucleophilic substitution (SN1/SN2), aromatic electrophilic reactions, and stereochemistry.', semester: 1, credits: 4 },
          { id: 'chem102', code: 'CHEM102', name: 'Chemical Thermodynamics & Kinetics', description: 'Gibbs free energy, rate laws, transition state theory, and phase equilibria.', semester: 2, credits: 4 },
          { id: 'chem103', code: 'CHEM103', name: 'Inorganic & Coordination Chemistry', description: 'Crystal field theory, transition metal complexes, and organometallic compounds.', semester: 3, credits: 4 },
          { id: 'chem104', code: 'CHEM104', name: 'Spectroscopy & Analytical Methods', description: 'UV-Vis absorption, FTIR vibrational modes, NMR splitting patterns, and chromatography.', semester: 4, credits: 4 },
          { id: 'chem301', code: 'CHEM301', name: 'Polymer & Industrial Chemistry', description: 'Polymerization kinetics, copolymerization, and industrial chemical manufacturing.', semester: 5, credits: 4 },
          { id: 'chem302', code: 'CHEM302', name: 'Chemical Research Capstone', description: 'Independent laboratory synthesis, spectroscopic characterization, and thesis.', semester: 6, credits: 6 },
        ],
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        shortName: 'Mathematics',
        description: 'Pure and applied mathematics, multivariable calculus, abstract algebra, and stochastic processes.',
        icon: 'Sigma',
        totalSemesters: 6,
        subjects: [
          { id: 'math101', code: 'MATH101', name: 'Real & Complex Analysis', description: 'Riemann-Stieltjes integration, Cauchy-Riemann equations, and residue calculus.', semester: 1, credits: 4 },
          { id: 'math102', code: 'MATH102', name: 'Ordinary & Partial Differential Equations', description: 'Fourier series methods, Laplace transform solutions, and second-order PDE separation.', semester: 2, credits: 4 },
          { id: 'math103', code: 'MATH103', name: 'Probability & Mathematical Statistics', description: 'Joint probability distributions, Central Limit Theorem, and hypothesis testing.', semester: 3, credits: 4 },
          { id: 'bsc201', code: 'MATH201', name: 'Linear Algebra & Green\'s Theorem', description: 'Cayley-Hamilton theorem, eigenvalue decomposition, surface integrals, and vector theorems.', semester: 4, credits: 4 },
          { id: 'math301', code: 'MATH301', name: 'Abstract Algebra & Group Theory', description: 'Groups, rings, ideals, fields, Galois theory fundamentals, and homomorphism theorems.', semester: 5, credits: 4 },
          { id: 'math302', code: 'MATH302', name: 'Applied Mathematics Dissertation', description: 'Numerical computing research, algorithm convergence proofs, and defense.', semester: 6, credits: 6 },
        ],
      },
    ],
  },
  {
    id: 'management',
    name: 'Management',
    shortName: 'BBA / MBA',
    description: 'Strategic market research, corporate valuation, organizational behavior, and talent strategy.',
    icon: 'Briefcase',
    specializations: [
      {
        id: 'marketing',
        name: 'Marketing',
        shortName: 'Marketing',
        description: 'Consumer psychographics, brand positioning, digital campaigns, and product lifecycle strategy.',
        icon: 'Megaphone',
        totalSemesters: 4,
        subjects: [
          { id: 'mkt101', code: 'MKT101', name: 'Marketing Management Essentials', description: 'Market segmentation, targeting, positioning (STP), and 4Ps marketing mix framework.', semester: 1, credits: 3 },
          { id: 'mkt102', code: 'MKT102', name: 'Consumer Behavior & Market Research', description: 'Consumer decision-making models, perception biases, and quantitative survey design.', semester: 2, credits: 3 },
          { id: 'mkt103', code: 'MKT103', name: 'Digital & Social Media Marketing', description: 'Search engine optimization, performance advertising metrics (CAC, LTV), and content strategy.', semester: 3, credits: 3 },
          { id: 'mkt104', code: 'MKT104', name: 'Brand Strategy & Strategic Management', description: 'Brand architecture models, brand identity prisms, and long-term equity valuation.', semester: 4, credits: 4 },
        ],
      },
      {
        id: 'finance',
        name: 'Finance',
        shortName: 'Finance',
        description: 'Corporate valuation, capital budgeting, equity investments, risk hedging, and financial derivatives.',
        icon: 'Coins',
        totalSemesters: 4,
        subjects: [
          { id: 'fin101', code: 'FIN101', name: 'Financial Accounting & Reporting', description: 'Balance sheet reconciliation, cash flow statement analysis, and GAAP principles.', semester: 1, credits: 4 },
          { id: 'fin102', code: 'FIN102', name: 'Corporate Finance & Valuation', description: 'Discounted cash flow (DCF), cost of capital (WACC), and capital structure optimization.', semester: 2, credits: 4 },
          { id: 'fin103', code: 'FIN103', name: 'Investment Analysis & Portfolio Management', description: 'Modern Portfolio Theory (Markowitz), CAPM model, and Sharpe/Treynor ratios.', semester: 3, credits: 4 },
          { id: 'fin104', code: 'FIN104', name: 'Financial Markets & Commercial Banking', description: 'Money market instruments, bond yield curve analysis, and banking capital adequacy.', semester: 4, credits: 4 },
        ],
      },
      {
        id: 'hr',
        name: 'HR',
        shortName: 'Human Resources',
        description: 'Talent recruitment, organizational psychodynamics, labor compliance, and executive appraisal.',
        icon: 'Users2',
        totalSemesters: 4,
        subjects: [
          { id: 'hr101', code: 'HR101', name: 'Human Resource Management', description: 'Workforce planning, competency mapping, and onboarding lifecycle management.', semester: 1, credits: 3 },
          { id: 'hr102', code: 'HR102', name: 'Organizational Behavior & Leadership', description: 'Motivation theories (Herzberg, Maslow), group dynamics, and conflict negotiation.', semester: 2, credits: 3 },
          { id: 'hr103', code: 'HR103', name: 'Strategic Talent Acquisition & Retention', description: 'Executive headhunting, behavioral interview metrics, and employee satisfaction drivers.', semester: 3, credits: 3 },
          { id: 'hr104', code: 'HR104', name: 'Industrial Relations & Labor Law', description: 'Collective bargaining, trade union compliance, dispute resolution, and workplace safety laws.', semester: 4, credits: 4 },
        ],
      },
    ],
  },
];

/**
 * Helper Utilities to query and count files across the navigation hierarchy
 */

export const getFieldConfig = (fieldId?: string): FieldConfig | undefined => {
  if (!fieldId) return undefined;
  return NAVIGATION_CONFIG.find(f => f.id === fieldId);
};

export const getSpecializationConfig = (fieldId?: string, specId?: string): SpecializationConfig | undefined => {
  const field = getFieldConfig(fieldId);
  if (!field || !specId) return undefined;
  return field.specializations.find(s => s.id === specId);
};

export const getSubjectConfig = (subjectId?: string): { subject: SubjectConfig; specialization: SpecializationConfig; field: FieldConfig } | undefined => {
  if (!subjectId) return undefined;
  for (const field of NAVIGATION_CONFIG) {
    for (const spec of field.specializations) {
      const sub = spec.subjects.find(s => s.id === subjectId);
      if (sub) {
        return { subject: sub, specialization: spec, field };
      }
    }
  }
  return undefined;
};

/**
 * Helper to compute standardized Indian university academic semester tags
 */
export const getSemesterAcademicTag = (semester: number): string => {
  const year = Math.ceil(semester / 2);
  const isOdd = semester % 2 === 1;
  return `Year ${year} • ${isOdd ? 'Odd Sem' : 'Even Sem'}`;
};

/**
 * Map legacy course/subject identifiers to new navigation path
 */
export const mapLegacyToPath = (courseId?: string, subjectId?: string): NavigationPath => {
  // If subjectId is known, use its master mapping
  if (subjectId) {
    const info = getSubjectConfig(subjectId);
    if (info) {
      return {
        fieldId: info.field.id,
        specializationId: info.specialization.id,
        semester: info.subject.semester,
        subjectId: info.subject.id,
      };
    }
  }

  // Fallback map by courseId
  switch (courseId) {
    case 'cse':
      return { fieldId: 'engineering', specializationId: 'cse', semester: 4, subjectId: 'cs201' };
    case 'me':
      return { fieldId: 'engineering', specializationId: 'mechanical', semester: 4, subjectId: 'me201' };
    case 'ee':
      return { fieldId: 'engineering', specializationId: 'electrical', semester: 3, subjectId: 'ee201' };
    case 'ece':
      return { fieldId: 'engineering', specializationId: 'ece', semester: 4, subjectId: 'ece201' };
    case 'ce':
      return { fieldId: 'engineering', specializationId: 'civil', semester: 4, subjectId: 'ce201' };
    case 'bca':
      return { fieldId: 'computer-applications', specializationId: 'bca', semester: 4, subjectId: 'bca201' };
    case 'bsc':
      return { fieldId: 'sciences', specializationId: 'mathematics', semester: 4, subjectId: 'bsc201' };
    case 'aids':
      return { fieldId: 'computer-applications', specializationId: 'mca', semester: 3, subjectId: 'ai301' };
    case 'bba':
      return { fieldId: 'management', specializationId: 'marketing', semester: 1, subjectId: 'mkt101' };
    default:
      return { fieldId: 'engineering', specializationId: 'cse', semester: 4, subjectId: 'cs201' };
  }
};

/**
 * Checks whether a given resource belongs to a specific navigation path
 */
export const resourceMatchesPath = (resource: Resource, path: NavigationPath): boolean => {
  if (!resource) return false;

  // Filter by Semester if specified
  if (path.semester !== undefined && resource.semester !== path.semester) {
    return false;
  }

  // Filter by Resource Type if specified
  if (path.resourceType && resource.type !== path.resourceType) {
    return false;
  }

  // Filter by Subject if specified
  if (path.subjectId) {
    return resource.subjectId === path.subjectId;
  }

  // If path has specialization, check if resource belongs to one of its subjects
  if (path.fieldId && path.specializationId) {
    const spec = getSpecializationConfig(path.fieldId, path.specializationId);
    if (!spec) return false;
    const subjectIds = spec.subjects.map(s => s.id);
    return subjectIds.includes(resource.subjectId);
  }

  // If path has only field, check if resource belongs to any subject in this field
  if (path.fieldId) {
    const field = getFieldConfig(path.fieldId);
    if (!field) return false;
    const allFieldSubjectIds = field.specializations.flatMap(s => s.subjects.map(sub => sub.id));
    return allFieldSubjectIds.includes(resource.subjectId);
  }

  return true;
};

/**
 * Calculate the count of files for any card level from real resources
 */
export const countFilesForPath = (resources: Resource[], path: NavigationPath): number => {
  if (!Array.isArray(resources)) return 0;
  return resources.filter(r => resourceMatchesPath(r, path)).length;
};
