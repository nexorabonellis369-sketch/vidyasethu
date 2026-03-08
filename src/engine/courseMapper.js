// Course Mapper Engine - Maps queries to courses, topics, prerequisites
import { semester1, semester2, semester3 } from '../data/syllabus1.js';
import { semester4, semester5, semester6, professionalElectives, openElectives } from '../data/syllabus2.js';

const electiveSyllabi = {
    '24OS01': [
        { num: 1, title: 'Python Basics and Control Structures', topics: ['Basic syntax and data types', 'Variables and operators', 'Conditional statements: if-elif-else', 'Looping: for, while', 'Input and Output operations'] },
        { num: 2, title: 'Data Structures and Functions', topics: ['Lists, Tuples, and Sets', 'Dictionaries and mapping', 'Function definition and arguments', 'Lambda functions', 'Recursion and scope'] },
        { num: 3, title: 'File Handling and Modules', topics: ['File I/O operations', 'Error and Exception handling', 'Standard library modules', 'External packages and pip', 'Modules and Packages'] },
        { num: 4, title: 'Object Oriented Programming', topics: ['Classes and Objects', 'Constructors and destructors', 'Inheritance and Polymorphism', 'Encapsulation', 'Operator overloading'] },
        { num: 5, title: 'GUI and Database Integration', topics: ['Introduction to Tkinter', 'GUI event handling', 'Database connectivity (SQLite/MySQL)', 'CRUD operations', 'Regular expressions'] }
    ],
    '24S006': [
        { num: 1, title: 'Introduction to Machine Learning', topics: ['Basic concepts and terminology', 'Supervised vs Unsupervised learning', 'Training, Validation, and Test sets', 'Feature engineering basics', 'Bias-Variance tradeoff'] },
        { num: 2, title: 'Regression and Classification', topics: ['Linear and Logistic Regression', 'Gradient Descent', 'Decision Trees', 'Support Vector Machines', 'k-Nearest Neighbors'] },
        { num: 3, title: 'Neural Networks and Deep Learning', topics: ['Perceptron model', 'Multilayer Perceptron', 'Backpropagation algorithm', 'Activation functions', 'CNN and RNN basics'] },
        { num: 4, title: 'Clustering and Dimensionality Reduction', topics: ['k-Means clustering', 'Hierarchical clustering', 'Principal Component Analysis (PCA)', 'Singular Value Decomposition', 'Association rules'] },
        { num: 5, title: 'Model Evaluation and Deployment', topics: ['Confusion matrix', 'Precision, Recall, F1-score', 'ROC and AUC curves', 'Model selection and hyperparameter tuning', 'Deployment strategies'] }
    ],
    '24S007': [
        { num: 1, title: 'Foundations of AI', topics: ['History and foundations of AI', 'Intelligent agents', 'Problem-solving and search', 'Uninformed and Informed search', 'Heuristic functions'] },
        { num: 2, title: 'Knowledge Representation', topics: ['Logic and Propositional calculus', 'First-order logic', 'Rule-based systems', 'Semantic networks', 'Ontologies'] },
        { num: 3, title: 'Probabilistic Reasoning', topics: ['Uncertainty and probability', 'Bayesian networks', 'Inference in Bayesian networks', 'Markov chains', 'Decision making under uncertainty'] },
        { num: 4, title: 'Search and Optimization', topics: ['Adversarial search (Minimax)', 'Alpha-Beta pruning', 'Genetic algorithms', 'Ant colony optimization', 'Local search algorithms'] },
        { num: 5, title: 'AI Applications', topics: ['Natural Language Processing basics', 'Computer Vision basics', 'Expert systems', 'Robotics and AI', 'Ethical and social implications of AI'] }
    ],
    '24S001': [
        { num: 1, title: 'System of Linear Equations', topics: ['Gauss elimination', 'Gauss-Jordan method', 'Iterative methods', 'LU decomposition', 'Matrix inversion'] },
        { num: 2, title: 'Roots of Equations', topics: ['Bisection method', 'Newton-Raphson method', 'Secant method', 'Regula-Falsi method', 'Fixed point iteration'] },
        { num: 3, title: 'Interpolation and Approximation', topics: ['Newton forward and backward', 'Lagrange interpolation', 'Divided differences', 'Cubic splines', 'Least squares curve fitting'] },
        { num: 4, title: 'Numerical Differentiation and Integration', topics: ['Newton-Cotes formulas', 'Trapezoidal rule', 'Simpsons 1/3 and 3/8 rules', 'Gaussian quadrature', 'Richardson extrapolation'] },
        { num: 5, title: 'Numerical Solutions of ODEs', topics: ['Taylor series method', 'Eulers and modified Euler method', 'Runge-Kutta 4th order', 'Milnes predictor-corrector', 'Boundary value problems'] }
    ],
    '24S003': [
        { num: 1, title: 'Mathematical Logic', topics: ['Propositions and logical connectives', 'Truth tables', 'Tautologies and contradictions', 'Predicate logic', 'Quantifiers and rules of inference'] },
        { num: 2, title: 'Set Theory and Relations', topics: ['Basic set operations', 'Cartesian products', 'Types of relations', 'Equivalence relations', 'Partial ordering and Lattices'] },
        { num: 3, title: 'Functions and Algebraic Structures', topics: ['Types of functions', 'Composition of functions', 'Binary operations', 'Groups and Subgroups', 'Rings and Fields basics'] },
        { num: 4, title: 'Combinatorics', topics: ['Permutations and Combinations', 'Pigeonhole principle', 'Inclusion-Exclusion principle', 'Recurrence relations', 'Generating functions'] },
        { num: 5, title: 'Graph Theory Foundations', topics: ['Basic graph terminology', 'Euler and Hamiltonian paths', 'Tree graphs', 'Shortest path algorithms', 'Planar graphs'] }
    ],
    '24S016': [
        { num: 1, title: 'Laser Principles', topics: ['Spontaneous and Stimulated emission', 'Einstein coefficients', 'Population inversion', 'Optical pumping', 'Components of a laser'] },
        { num: 2, title: 'Laser Characteristics', topics: ['Coherence: Temporal and Spatial', 'Monochromaticity', 'Directionality', 'Intensity and brightness', 'Laser modes'] },
        { num: 3, title: 'Types of Lasers', topics: ['Gas lasers: He-Ne, CO2', 'Solid state lasers: Ruby, Nd:YAG', 'Semiconductor lasers', 'Dye lasers', 'Fiber lasers'] },
        { num: 4, title: 'Holography and Nonlinear Optics', topics: ['Principle of Holography', 'Recording and reconstruction', 'Second harmonic generation', 'Self-focusing', 'Optical phase conjugation'] },
        { num: 5, title: 'Industrial and Medical Applications', topics: ['Laser cutting and welding', 'Lidar and range finding', 'Laser spectroscopy', 'Medical surgeries', 'Optical communication'] }
    ],
    '24S002': [
        { num: 1, title: 'Graphs and Subgraphs', topics: ['Basic concepts', 'Isomorphism', 'Subgraphs', 'Degrees of vertices', 'Paths and cycles', 'Trees and their properties'] },
        { num: 2, title: 'Connectivity and Traversability', topics: ['Cut vertices and edges', 'Connectivity: k-connectivity', 'Eulerian graphs', 'Hamiltonian graphs', 'Algorithms for connectivity'] },
        { num: 3, title: 'Matchings and Colorings', topics: ['Matchings in bipartite graphs', 'Edge colorings', 'Vertex colorings', 'Chromatic number', 'Chromatic polynomials'] },
        { num: 4, title: 'Planar Graphs', topics: ['Embeddings', 'Eulers formula', 'Kuratowskis theorem', 'Dual graphs', 'Four color theorem basics'] },
        { num: 5, title: 'Directed Graphs and Networks', topics: ['Digraphs', 'Strong connectivity', 'Network flows', 'Max-flow Min-cut theorem', 'Applications of flows'] }
    ],
    '24S004': [
        { num: 1, title: 'Linear Programming', topics: ['Formulation of LPP', 'Graphical method', 'Simplex method', 'Big-M method', 'Two-phase simplex'] },
        { num: 2, title: 'Duality and Sensitivity', topics: ['Primal-Dual relationships', 'Dual simplex method', 'Sensitivity analysis', 'Economic interpretation of duality'] },
        { num: 3, title: 'Transportation and Assignment', topics: ['Transportation algorithms', 'MODI method', 'Degeneracy in transportation', 'Hungarian method for assignment', 'Traveling salesman problem'] },
        { num: 4, title: 'Integer and Dynamic Programming', topics: ['Gomory cutting plane', 'Branch and bound', 'Bellmans principle', 'Shortest path problems', 'Resource allocation'] },
        { num: 5, title: 'Queuing and Game Theory', topics: ['Queuing models (M/M/1)', 'Little\'s law', 'Pure and mixed strategies', 'Saddle points', 'Zero-sum games'] }
    ],
    '24S005': [
        { num: 1, title: 'Random Variables Re-visited', topics: ['Review of probability', 'Joint distributions', 'Conditional expectation', 'Moment generating functions', 'Characteristic functions'] },
        { num: 2, title: 'Markov Chains', topics: ['Transition probability matrix', 'Classification of states', 'Steady state distribution', 'Absorption probabilities', 'Birth and death processes'] },
        { num: 3, title: 'Poisson Processes', topics: ['Counting processes', 'Properties of Poisson process', 'Inter-arrival times', 'Compound Poisson process', 'Non-homogeneous Poisson process'] },
        { num: 4, title: 'Renewal Theory', topics: ['Renewal equation', 'Elementary renewal theorem', 'Key renewal theorem', 'Delayed renewal processes', 'Applications'] },
        { num: 5, title: 'Stationary Processes', topics: ['Weak and strict stationarity', 'Autocorrelation function', 'Power spectral density', 'Gaussian processes', 'White noise'] }
    ],
    '24S008': [
        { num: 1, title: 'Cyber Security Fundamentals', topics: ['CIA triad', 'Security threats and vulnerabilities', 'Access control models', 'Security policies', 'Cyber law basics'] },
        { num: 2, title: 'Cryptography', topics: ['Symmetric encryption (AES, DES)', 'Asymmetric encryption (RSA, ECC)', 'Hashing (SHA, MD5)', 'Digital signatures', 'Public Key Infrastructure (PKI)'] },
        { num: 3, title: 'Network Security', topics: ['Firewalls and IDS/IPS', 'VPN and SSL/TLS', 'Wireless security (WPA2/3)', 'Sniffing and Spoofing', 'DDoS attacks and mitigation'] },
        { num: 4, title: 'Web and System Security', topics: ['SQL injection', 'Cross-site scripting (XSS)', 'Malware: Viruses, Worms, Trojans', 'Buffer overflows', 'OS hardening'] },
        { num: 5, title: 'Incident Response and Ethics', topics: ['Risk assessment', 'Disaster recovery', 'Digital forensics basics', 'Ethical hacking concepts', 'Privacy and data protection'] }
    ],
    '24S009': [
        { num: 1, title: 'Cloud Computing Models', topics: ['NIST cloud definition', 'SaaS, PaaS, IaaS', 'Public, Private, Hybrid clouds', 'Cloud benefits and challenges', 'History of cloud computing'] },
        { num: 2, title: 'Virtualization Technology', topics: ['Resource virtualization', 'Hypervisors (Xen, KVM, VMware)', 'Containerization (Docker, Kubernetes)', 'Serverless computing', 'Full vs Para-virtualization'] },
        { num: 3, title: 'Cloud Infrastructure', topics: ['Cloud data centers', 'Compute, Storage, and Networking', 'Load balancing', 'Auto-scaling', 'High availability and replication'] },
        { num: 4, title: 'Cloud Storage and Data', topics: ['Block vs Object storage (S3, EBS)', 'Cloud databases (NoSQL, RDS)', 'Distributed file systems', 'Data consistency models', 'Backup and recovery'] },
        { num: 5, title: 'Cloud Security and Governance', topics: ['Shared responsibility model', 'Identity and Access Management (IAM)', 'Compliance and Auditing', 'Cost management', 'Cloud migration strategies'] }
    ],
    '24S017': [
        { num: 1, title: 'Semiconductor Fundamentals', topics: ['Energy bands in solids', 'Intrinsic and Extrinsic semiconductors', 'Carrier concentration', 'Fermi level and Boltzmann statistics', 'Carrier transport: Drift and Diffusion'] },
        { num: 2, title: 'PN Junctions and Diodes', topics: ['Depletion region', 'Built-in potential', 'IV characteristics', 'Junction capacitance', 'Zener and Tunnel diodes'] },
        { num: 3, title: 'Bipolar Junction Transistors', topics: ['BJT physics and operations', 'Configuration: CB, CE, CC', 'Current gain', 'Transistor as an amplifier', 'Frequency response'] },
        { num: 4, title: 'Field Effect Transistors', topics: ['JFET operations', 'MOSFET types: Enhancement and Depletion', 'CMOS technology', 'Threshold voltage', 'Short channel effects'] },
        { num: 5, title: 'Optoelectronic Devices', topics: ['Solar cells', 'LEDs and LASER diodes', 'Photodetectors', 'LCD and Plasma displays', 'Quantum dots in devices'] }
    ],
    '24S018': [
        { num: 1, title: 'Laws of Thermodynamics', topics: ['Zeroth and First law', 'Second law: Entropy and Enthalpy', 'Carnot cycle', 'Heat engines and refrigerators', 'Clausius-Clapeyron equation'] },
        { num: 2, title: 'Thermodynamic Potentials', topics: ['Internal energy', 'Helmholtz and Gibbs free energy', 'Maxwells relations', 'Third law of thermodynamics', 'Chemical potential'] },
        { num: 3, title: 'Kinetic Theory of Gases', topics: ['Pressure and temperature derivation', 'Mean free path', 'Maxwell-Boltzmann distribution', 'Equipartition of energy', 'Vander Waals equation'] },
        { num: 4, title: 'Heat Transfer Mechanisms', topics: ['Conduction: Fouriers law', 'Convection: Newtons law of cooling', 'Radiation: Stefan-Boltzmann law', 'Wiens displacement law', 'Heat exchangers'] },
        { num: 5, title: 'Statistical Mechanics Basics', topics: ['Microstates and Macrostates', 'Ensembles', 'Partition functions', 'Bose-Einstein and Fermi-Dirac statistics', 'Applications to blackbody radiation'] }
    ],
    '24S019': [
        { num: 1, title: 'Microscopic Techniques', topics: ['Optical microscopy', 'Scanning Electron Microscopy (SEM)', 'Transmission Electron Microscopy (TEM)', 'Atomic Force Microscopy (AFM)', 'Sample preparation'] },
        { num: 2, title: 'Structural Characterization', topics: ['X-Ray Diffraction (XRD)', 'Braggs law', 'Phase identification', 'Crystallite size estimation', 'SAXS basics'] },
        { num: 3, title: 'Spectroscopic Techniques', topics: ['UV-Vis-NIR spectroscopy', 'FTIR and Raman spectroscopy', 'XPS and Auger spectroscopy', 'Photoluminescence', 'NMR basics'] },
        { num: 4, title: 'Thermal Analysis', topics: ['Thermogravimetric Analysis (TGA)', 'Differential Scanning Calorimetry (DSC)', 'Differential Thermal Analysis (DTA)', 'Dynamic Mechanical Analysis (DMA)'] },
        { num: 5, title: 'Electrical and Magnetic Testing', topics: ['Four-probe method', 'Hall effect measurement', 'SQUID magnetometer', 'Vibrating Sample Magnetometer (VSM)', 'Dielectric measurements'] }
    ],
    '24S020': [
        { num: 1, title: 'Op-Amp Fundamentals', topics: ['Ideal op-amp characteristics', 'Internal circuit of 741', 'Inverting and Non-inverting configuration', 'Differential amplifiers', 'CMRR and Slew rate'] },
        { num: 2, title: 'Linear Op-Amp Applications', topics: ['Summing and Instrumentation amplifiers', 'Integrators and Differentiators', 'Voltage to Current converters', 'Log and Antilog amplifiers', 'Precision rectifiers'] },
        { num: 3, title: 'Non-Linear Applications', topics: ['Comparators and Schmitt triggers', 'Peak detectors', 'Sample and Hold circuits', 'Square and Triangular wave generators', 'Clippers and Clampers'] },
        { num: 4, title: 'Active Filters and Timers', topics: ['Butterworth filters: LPF, HPF, BPF', '555 Timer: Monostable and Astable', 'Phase Locked Loops (PLL)', 'Voltage Controlled Oscillators (VCO)'] },
        { num: 5, title: 'Data Converters and Regulators', topics: ['D/A converters: R-2R ladder', 'A/D converters: Successive approximation', 'Linear voltage regulators (78XX)', 'Switching regulators basics', 'IC 723'] }
    ],
    '24S021': [
        { num: 1, title: 'Introduction to Nanoscience', topics: ['Zero, One, Two, and Three dimensional nanomaterials', 'Surface to volume ratio', 'Quantum confinement effect', 'History and future scope', 'Safety and ethics'] },
        { num: 2, title: 'Synthesis Methods', topics: ['Top-down vs Bottom-up approaches', 'Sol-gel method', 'Chemical Vapor Deposition (CVD)', 'Physical Vapor Deposition (PVD)', 'Green synthesis of nanoparticles'] },
        { num: 3, title: 'Synthesis of Carbon Nanostructures', topics: ['Carbon Nanotubes (CNT): SWNT and MWNT', 'Graphene synthesis and properties', 'Fullerenes', 'Diamond-like carbon', 'Applications of carbon nanomaterials'] },
        { num: 4, title: 'Properties of Nanomaterials', topics: ['Enhanced mechanical properties', 'Optical properties: surface plasmon resonance', 'Magnetic properties: superparamagnetism', 'Electrical conductivity in nanostructures'] },
        { num: 5, title: 'Industrial Applications', topics: ['Nanotechnology in medicine (drug delivery)', 'Nanomaterials for energy storage (batteries/supercaps)', 'Nano-sensors', 'Environmental remediation', 'Consumer products'] }
    ],
    '24S022': [
        { num: 1, title: 'Plasma Fundamentals', topics: ['Definition of plasma', 'Debye shielding', 'Plasma frequency', 'Criteria for plasma', 'Natural and man-made plasmas'] },
        { num: 2, title: 'Single Particle Motion', topics: ['Motion in uniform E and B fields', 'Motion in non-uniform E and B fields', 'Adiabatic invariants', 'Magnetic mirrors and bottles', 'Curvature and gradient drifts'] },
        { num: 3, title: 'Plasma as a Fluid', topics: ['Fluid equations of motion', 'Convective derivative', 'Equation of state', 'Plasma resistivity', 'Diffusion in weakly ionized gases'] },
        { num: 4, title: 'Waves in Plasma', topics: ['Plasma oscillations', 'Electron and ion plasma waves', 'Sound waves in plasma', 'Hydromagnetic waves (Alfven waves)', 'Electromagnetic waves in plasma'] },
        { num: 5, title: 'Controlled Fusion and Applications', topics: ['Fusion reactions', 'Magnetic confinement: Tokamaks', 'Inertial confinement', 'Plasma processing in manufacturing', 'Space plasma applications'] }
    ],
    '24S023': [
        { num: 1, title: 'Nucleation and Growth Theories', topics: ['Homogeneous and Heterogeneous nucleation', 'Gibbs-Thomson equation', 'Kossel, Stranski, and Volmer theory', 'Frank\'s screw dislocation theory', 'Diffusion and volume growth'] },
        { num: 2, title: 'Melt Growth Techniques', topics: ['Czochralski method', 'Bridgman-Stockbarger technique', 'Zone melting and floating zone', 'Verneuil method', 'Kyropoulos method'] },
        { num: 3, title: 'Solution Growth Techniques', topics: ['Low temperature solution growth', 'Solubility and supersaturation', 'Slow cooling and evaporation', 'Gel growth technique', 'Hydrothermal synthesis'] },
        { num: 4, title: 'Vapor Growth Techniques', topics: ['Physical Vapor Transport (PVT)', 'Chemical Vapor Transport (CVT)', 'Epitaxial growth: MBE and MOCVD', 'Sublimation method'] },
        { num: 5, title: 'Characterization of Crystals', topics: ['Defects in crystals', 'Etch pit density', 'Birefringence studies', 'Thermal and mechanical testing', 'Application of single crystals'] }
    ],
    '24S024': [
        { num: 1, title: 'Ceramic Materials', topics: ['Classification of ceramics', 'Crystal structures in ceramics', 'Silicates and non-silicates', 'Properties: mechanical, thermal, electrical', 'Traditional vs Advanced ceramics'] },
        { num: 2, title: 'Processing of Ceramics', topics: ['Powder synthesis', 'Shape forming: pressing, casting, extrusion', 'Sintering mechanisms', 'Final machining and glazing', 'Glass manufacturing'] },
        { num: 3, title: 'Composite Materials Introduction', topics: ['Definition and classification', 'Matrix and reinforcement', 'Rule of mixtures', 'Particulate and fiber reinforced composites', 'Sandwich structures'] },
        { num: 4, title: 'Synthesis of Composites', topics: ['Stir casting', 'Hand lay-up and Spray-up', 'Pultrusion', 'Filament winding', 'Powder metallurgy for MMC'] },
        { num: 5, title: 'Advanced Composites', topics: ['Metal Matrix Composites (MMC)', 'Ceramic Matrix Composites (CMC)', 'Polymer Matrix Composites (PMC)', 'Carbon-Carbon composites', 'Applications in aerospace and defense'] }
    ],
    '24OS09': [
        { num: 1, title: 'Ecology and Ecosystems', topics: ['Structure and function of ecosystem', 'Energy flow in ecosystems', 'Food chains and webs', 'Ecological pyramids', 'Biodiversity: threats and conservation'] },
        { num: 2, title: 'Natural Resources', topics: ['Forest and Water resources', 'Mineral and Energy resources', 'Land resources and degradation', 'Sustainable use of resources', 'Role of an individual in conservation'] },
        { num: 3, title: 'Environmental Pollution', topics: ['Air, Water, and Soil pollution', 'Noise and Thermal pollution', 'Nuclear hazards', 'Solid waste management', 'Disaster management: Floods, Earthquakes'] },
        { num: 4, title: 'Social Issues and Environment', topics: ['Sustainable development', 'Water conservation and Rainwater harvesting', 'Climate change and Global warming', 'Ozone layer depletion', 'Environmental ethics'] },
        { num: 5, title: 'Human Population and Environment', topics: ['Population growth and explosion', 'Environment and human health', 'Human rights and value education', 'HIV/AIDS', 'Role of Information Technology in environment'] }
    ],
    '24OS10': [
        { num: 1, title: 'Metal Ions in Biology', topics: ['Essential and Trace metals', 'Role of alkali and alkaline earth metals', 'Metal ion transport and storage', 'Sodium-Potassium pump', 'Siderophores'] },
        { num: 2, title: 'Metalloproteins and Enzymes', topics: ['Hemoglobin and Myoglobin', 'Cytochromes and Iron-Sulfur proteins', 'Zinc enzymes: Carbonic anhydrase', 'Copper proteins', 'Nitrogen fixation basics'] },
        { num: 3, title: 'Metals in Medicine', topics: ['Cisplatin and related anti-cancer drugs', 'Gold compounds in rheumatoid arthritis', 'Lithium in manic depression', 'Metal-based contrast agents for MRI', 'Therapeutic chelating agents'] },
        { num: 4, title: 'Biomineralization', topics: ['Formation of bones and teeth', 'Calcium phosphate and calcium carbonate in biology', 'Silicification', 'Ferritins', 'Mechanisms of biomineralization'] },
        { num: 5, title: 'Toxicology of Metals', topics: ['Toxicity of Mercury, Lead, Cadmium, Arsenic', 'Biochemical mechanisms of toxicity', 'Detoxification mechanisms', 'Environmental impact of heavy metals'] }
    ],
    '24OS11': [
        { num: 1, title: 'Surface Preparation', topics: ['Cleaning and Degreasing', 'Mechanical cleaning: Grinding, Polishing', 'Chemical cleaning: Pickling, Etching', 'Solvent cleaning', 'Ultrasonic cleaning'] },
        { num: 2, title: 'Electroplating Technology', topics: ['Principles of electroplating', 'Plating of Copper, Nickel, Chromium', 'Electroless plating: Nickel, Copper', 'Anodizing of Aluminum', 'Electroforming basics'] },
        { num: 3, title: 'Diffusion Coatings', topics: ['Carburizing and Nitriding', 'Cyaniding and Carbonitriding', 'Boronizing', 'Chromizing', 'Aluminizing'] },
        { num: 4, title: 'Thermal Spray and PVD/CVD', topics: ['Flame spraying and Plasma spraying', 'Physical Vapor Deposition (PVD) processes', 'Chemical Vapor Deposition (CVD) processes', 'Molecular Beam Epitaxy basics', 'Sputtering techniques'] },
        { num: 5, title: 'Painting and Organic Coatings', topics: ['Selection of paints and lacquers', 'Application methods: Spray, dip, brush', 'Powder coating technology', 'Coating defects and testing', 'Eco-friendly coating materials'] }
    ],
    '24OS12': [
        { num: 1, title: 'Sensor Fundamentals', topics: ['Definitions and classifications', 'Sensitivity, Selectivity, and Stability', 'Response time and Dynamic range', 'Signal conditioning', 'Transduction principles'] },
        { num: 2, title: 'Chemical Sensors', topics: ['Potentiometric and Amperometric sensors', 'Conductometric sensors', 'Optical chemical sensors', 'Mass-sensitive sensors (QCM)', 'Calorimetric sensors'] },
        { num: 3, title: 'Introduction to Biosensors', topics: ['Bioreceptor types: Enzymes, Antibodies, DNA', 'Immobilization techniques', 'Transducers for biosensors', 'Glucose and Oxygen biosensors', 'Immuno-sensors'] },
        { num: 4, title: 'Gas and Humidity Sensors', topics: ['Metal oxide semiconductor gas sensors', 'Solid electrolyte gas sensors', 'Infrared gas sensors', 'Humidity sensing mechanisms', 'Electronic nose concepts'] },
        { num: 5, title: 'Modern Trends in Sensing', topics: ['Nano-sensors and their advantages', 'Lab-on-a-chip technology', 'Wearable sensors', 'Wireless sensor networks (WSN)', 'Smart sensors and IoT integration'] }
    ],
    '24OS13': [
        { num: 1, title: 'Composite Fundamentals', topics: ['Matrix and Reinforcement roles', 'Classification of composites', 'Rule of mixtures', 'Volume and weight fraction', 'Isotropic and Anisotropic behavior'] },
        { num: 2, title: 'Polymer Matrix Composites (PMC)', topics: ['Thermoset and Thermoplastic matrices', 'Glass, Carbon, and Aramid fibers', 'Fabrication: Hand lay-up, Bag molding', 'Resin Transfer Molding (RTM)', 'Applications of PMCs'] },
        { num: 3, title: 'Metal and Ceramic Matrix Composites', topics: ['MMC fabrication: Stir casting, Squeeze casting', 'CMC fabrication: CVI, Liquid phase infiltration', 'High temperature applications', 'Interface bonding mechanisms'] },
        { num: 4, title: 'Testing and Characterization', topics: ['Tensile and Compressive testing', 'Flexural and Impact properties', 'Microstructural analysis (SEM/EDX)', 'Nondestructive testing: Ultrasonic, X-ray', 'Damage mechanisms in composites'] },
        { num: 5, title: 'Environmental and Bio-Composites', topics: ['Natural fiber composites', 'Biodegradable composites', 'Recycling of composite materials', 'Eco-friendly resins', 'Sustainable composite manufacturing'] }
    ],
    '24OS14': [
        { num: 1, title: 'Atmospheric Chemistry', topics: ['Chemical composition of atmosphere', 'Photochemical reactions', 'Greenhouse effect and Global warming', 'Acid rain: sources and impacts', 'Stratospheric ozone depletion'] },
        { num: 2, title: 'Hydrospheric Chemistry', topics: ['Water quality parameters', 'Eutrophication', 'Heavy metal pollution in water', 'Water treatment: Coagulation, Filtration', 'Advanced oxidation processes'] },
        { num: 3, title: 'Lithospheric Chemistry', topics: ['Soil composition and properties', 'Soil pollution: Pesticides, Fertilizers', 'Industrial waste in soil', 'Biogeochemical cycles (C, N, P, S)', 'Soil remediation techniques'] },
        { num: 4, title: 'Toxicological Chemistry', topics: ['Toxic elements and compounds', 'Biochemical effects of pollutants', 'Bio-accumulation and Bio-magnification', 'Analytical methods for pollutants', 'Monitoring of air and water quality'] },
        { num: 5, title: 'Sustainable Environmental Practices', topics: ['Renewable energy chemistry', 'Waste to energy conversion', 'Green chemistry for pollution prevention', 'Environmental regulations: Water and Air acts', 'Carbon sequestration'] }
    ],
    '24OS15': [
        { num: 1, title: 'Advanced Grammar and Vocabulary', topics: ['Complex sentence structures', 'Phrasal verbs and Idioms', 'Subject-Verb agreement', 'Effective vocabulary building', 'Nuances of professional English'] },
        { num: 2, title: 'Oral Communication', topics: ['Public speaking and Presentation skills', 'Group discussion dynamics', 'Debating techniques', 'Negotiation skills', 'Active listening and Feedback'] },
        { num: 3, title: 'Professional Writing', topics: ['Business letters and Emails', 'Report writing', 'Proposal writing', 'Minutes of meeting', 'Drafting notices and circulars'] },
        { num: 4, title: 'Soft Skills for Employability', topics: ['Time management', 'Stress management', 'Emotional Intelligence (EQ)', 'Leadership and Teamwork', 'Problem solving and Critical thinking'] },
        { num: 5, title: 'Interview and Career Skills', topics: ['Resume and Cover letter preparation', 'Acing personal interviews', 'Campus to corporate transition', 'Networking skills', 'Goal setting and Career planning'] }
    ],
    '24OS16': [
        { num: 1, title: 'Verbal Ability for Competitions', topics: ['Synonyms and Antonyms', 'Reading Comprehension', 'Error spotting and sentence correction', 'Cloze test and para-jumbles', 'One-word substitution'] },
        { num: 2, title: 'Quantitative Aptitude Basics', topics: ['Number systems and HCF/LCM', 'Percentages and Averages', 'Profit and Loss', 'Simple and Compound interest', 'Ratio and Proportion'] },
        { num: 3, title: 'Logical Reasoning foundations', topics: ['Blood relations and Direction sense', 'Coding-Decoding', 'Analogy and Classification', 'Syllogisms', 'Seating arrangement basics'] },
        { num: 4, title: 'Data Interpretation', topics: ['Bar charts and Pie charts', 'Lines graphs and Tables', 'Caselets', 'Data sufficiency', 'Numerical ability and speed maths'] },
        { num: 5, title: 'Exam Strategies and Practice', topics: ['Time-bound practice tests', 'Shortcut methods', 'Previous year question patterns', 'General awareness overview', 'Mock interview concepts'] }
    ],
    '24S031': [
        { num: 1, title: 'Polymer Fundamentals', topics: ['Classification of polymers', 'Naming and terminology', 'Chain growth vs Step growth', 'Degree of polymerization', 'Molecular weight distribution'] },
        { num: 2, title: 'Synthesis and Kinetics', topics: ['Free radical polymerization', 'Ionic polymerization', 'Coordination polymerization', 'Co-polymerization basics', 'Ziegler-Natta catalysts'] },
        { num: 3, title: 'Polymer Properties', topics: ['Glass transition temperature (Tg)', 'Crystallinity in polymers', 'Mechanical and thermal properties', 'Viscoelasticity', 'Polymer rheology'] },
        { num: 4, title: 'Processing Techniques', topics: ['Injection molding', 'Extrusion', 'Blow molding', 'Compression molding', 'Spinning and casting techniques'] },
        { num: 5, title: 'Commercial and Bio-polymers', topics: ['PE, PP, PVC, PS', 'Engineering plastics: Nylon, PET', 'Biodegradable polymers', 'Conducting polymers', 'Applications in industry'] }
    ],
    '24S032': [
        { num: 1, title: 'Basics of Corrosion', topics: ['Definitions and importance', 'Electrochemical nature of corrosion', 'Galvanic series', 'Pourbaix diagrams', 'Kinetics: polarization and overpotential'] },
        { num: 2, title: 'Forms of Corrosion', topics: ['Uniform and Galvanic corrosion', 'Pitting and Crevice corrosion', 'Intergranular and Stress corrosion', 'Erosion and Cavitation', 'Microbial corrosion'] },
        { num: 3, title: 'Corrosion Testing', topics: ['Weight loss method', 'Electrochemical testing (Potentiodynamic)', 'Salt spray test', 'Humidity tests', 'Atmospheric corrosion monitoring'] },
        { num: 4, title: 'Corrosion Prevention', topics: ['Material selection', 'Design considerations', 'Inhibitors: Anodic and Cathodic', 'Cathodic protection: Sacrificial anode, impressed current', 'Anodic protection'] },
        { num: 5, title: 'Protective Coatings', topics: ['Surface preparation', 'Metallic coatings: Electroplating, Hot dipping', 'Inorganic coatings: Anodizing, Phosphating', 'Organic coatings: Paints and lacquers', 'Thermal spray coatings'] }
    ],
    '24S033': [
        { num: 1, title: 'Electrochemical Theory', topics: ['Electrolytic conductance', 'Ion-solvent interactions', 'Debye-Huckel theory', 'Electrified interfaces', 'Double layer models'] },
        { num: 2, title: 'Electrode Kinetics', topics: ['Butler-Volmer equation', 'Tafel equation', 'Exchange current density', 'Mass transfer effects', 'Rotating disk electrodes'] },
        { num: 3, title: 'Batteries and Fuel Cells', topics: ['Primary and Secondary batteries', 'Li-ion, Lead-acid, Ni-MH', 'Principles of Fuel Cells', 'PEMFC and SOFC', 'Flow batteries for energy storage'] },
        { num: 4, title: 'Industrial Electrochemistry', topics: ['Chlor-alkali industry', 'Electrowinning and Electrorefining', 'Electrochemical machining', 'Electrodialysis', 'Water electrolysis for hydrogen'] },
        { num: 5, title: 'Electrochemical Sensors', topics: ['Ion selective electrodes', 'Amperometric sensors', 'Biosensors', 'Glucose monitors', 'Environmental monitoring applications'] }
    ],
    '24S034': [
        { num: 1, title: 'Chemical Approaches to Nano', topics: ['Colloidal chemistry', 'Sol-gel process', 'Microemulsions', 'Hydrothermal synthesis', 'Microwave-assisted synthesis'] },
        { num: 2, title: 'Self-Assembly and Supramolecular', topics: ['Principles of self-assembly', 'Molecular recognition', 'Langmuir-Blodgett films', 'Self-assembled monolayers (SAMs)', 'DNA-directed assembly'] },
        { num: 3, title: 'Chemical Surface Modification', topics: ['Surface functionalization', 'Capping agents: thiols, amines', 'Core-shell structures', 'Biomolecule conjugation', 'Nano-composite interfaces'] },
        { num: 4, title: 'Nano-catalysis', topics: ['Size-dependent catalytic activity', 'Heterogeneous nano-catalysis', 'Surface active sites', 'Nano-photocatalysis', 'Applications in green chemistry'] },
        { num: 5, title: 'Nanochemistry in Life Sciences', topics: ['Targeted drug delivery', 'Bio-imaging with quantum dots', 'Nano-toxicology', 'Chemical sensors', 'Therapeutic applications'] }
    ],
    '24S035': [
        { num: 1, title: 'Drug Design Fundamentals', topics: ['Drug discovery process', 'Structure-activity relationship (SAR)', 'Pharmacophores', 'Computer-aided drug design', 'Lipinskis rule of five'] },
        { num: 2, title: 'Pharmacokinetics and Pharmacodynamics', topics: ['Absorption, Distribution, Metabolism, Excretion (ADME)', 'Drug-receptor interactions', 'Enzyme inhibition', 'Agonists and Antagonists', 'Metabolic pathways'] },
        { num: 3, title: 'Synthesis of Major Drug Classes', topics: ['Antibiotics: Penicillin, Cephalosporins', 'Analgesics and Antipyretics', 'Cardiovascular drugs', 'Antineoplastic agents', 'Antiviral drugs'] },
        { num: 4, title: 'Natural Products in Medicine', topics: ['Alkaloids and Glycosides', 'Antibiotics from microbial sources', 'Phytopharmaceuticals', 'Isolation and characterization', 'Marine natural products'] },
        { num: 5, title: 'Pharmaceutical Technology', topics: ['Formulations and dosage forms', 'Quality control and assurance', 'Pharmacopoeia standards', 'Regulatory affairs (FDA)', 'Clinical trials phases'] }
    ],
    '24S036': [
        { num: 1, title: 'Textile Fibers', topics: ['Natural fibers: Cotton, Silk, Wool', 'Synthetic fibers: Polyester, Nylon, Acrylic', 'Fiber morphology and properties', 'Identification and testing', 'Blended fibers'] },
        { num: 2, title: 'Fiber Processing', topics: ['Pre-treatments: Desizing, Scouring', 'Bleaching and Mercerization', 'Spinning and Weaving basics', 'Chemical modifiers', 'Surface treatments'] },
        { num: 3, title: 'Dyeing Chemistry', topics: ['Classification of dyes', 'Dye-fiber interactions', 'Dyeing processes for different fibers', 'Color fastness properties', 'Natural vs Synthetic dyes'] },
        { num: 4, title: 'Textile Printing', topics: ['Direct, Discharge, and Resist printing', 'Screen and digital printing', 'Thickener chemistry', 'Fixation techniques', 'Printing faults and assessment'] },
        { num: 5, title: 'Textile Finishing', topics: ['Mechanical finishes', 'Functional finishes: Water repellent, Flame retardant', 'Anti-microbial and UV-protective finishes', 'Wrinkle recovery', 'Pollution in textile industry'] }
    ],
    '24S037': [
        { num: 1, title: 'Industrial Chemicals', topics: ['Manufacturing of H2SO4, NH3, HNO3', 'Soda ash and Caustic soda', 'Industrial gases: N2, O2, H2', 'Safety in chemical handling', 'Unit operations vs Unit processes'] },
        { num: 2, title: 'Fertilizers and Pesticides', topics: ['Nitrogenous, Phosphatic, and Potassic fertilizers', 'Bio-fertilizers', 'Insecticides, Herbicides, Fungicides', 'Ecological impact', 'Pest management'] },
        { num: 3, title: 'Petrol and Petrochemicals', topics: ['Petroleum refining', 'Cracking and reforming', 'Major petrochemicals: Ethylene, Benzene', 'Lubricants and additives', 'Natural gas processing'] },
        { num: 4, title: 'Paints, Pigments and Inks', topics: ['Components of paints', 'Inorganic and organic pigments', 'Printing inks', 'Surface preparation and application', 'Drying and curing mechanisms'] },
        { num: 5, title: 'Industrial Waste Management', topics: ['Effluent treatment plants (ETP)', 'Air pollution control', 'Solid waste disposal', 'Hazardous waste management', 'ISO 14001 and environmental audits'] }
    ],
    '24S038': [
        { num: 1, title: 'Biomolecules: Structure and Function', topics: ['Amino acids and Proteins', 'Carbohydrates: Mono, Di, and Polysaccharides', 'Lipids and Biological membranes', 'Nucleic acids: DNA and RNA', 'Vitamins and Minerals'] },
        { num: 2, title: 'Enzymology', topics: ['Enzyme classification-nomenclature', 'Mechanism of enzyme action', 'Michaelis-Menten kinetics', 'Enzyme inhibition and regulation', 'Co-enzymes and Co-factors'] },
        { num: 3, title: 'Metabolic Pathways', topics: ['Glycolysis and TCA cycle', 'Oxidative phosphorylation', 'Gluconeogenesis and Glycogen metabolism', 'Fatty acid oxidation', 'Urea cycle'] },
        { num: 4, title: 'Bioenergetics', topics: ['Standard free energy change', 'ATP as energy currency', 'Redox potentials in biology', 'Photosynthesis basics', 'Bio-calorimetry'] },
        { num: 5, title: 'Clinical Biochemistry', topics: ['Blood composition and functions', 'Liver and Kidney function tests', 'Hormone regulation', 'Inborn errors of metabolism', 'Diagnostic tools: ELISA, PCR'] }
    ],
    '24S039': [
        { num: 1, title: 'Introduction to Instrumental Analysis', topics: ['Signal to noise ratio', 'Calibration methods', 'Standard addition and Internal standards', 'Accuracy and Precision in machines', 'Errors in instrumental methods'] },
        { num: 2, title: 'Optical Methods', topics: ['Atomic Absorption Spectroscopy (AAS)', 'ICP-OES and ICP-MS', 'Fluorescence and Phosphorescence', 'Nephelometry and Turbidimetry', 'Refractometry and Polarimetry'] },
        { num: 3, title: 'Chromatographic Separations', topics: ['Gas Chromatography (GC)', 'High Performance Liquid Chromatography (HPLC)', 'Ion-exchange chromatography', 'Size exclusion chromatography', 'Thin layer chromatography'] },
        { num: 4, title: 'Electrochemical Instruments', topics: ['Potentiometry and Voltammetry', 'Polarography', 'Coulometry', 'Cyclic Voltammetry', 'Conductometry instruments'] },
        { num: 5, title: 'Advanced Surface Analysis', topics: ['SIMS and ESCA', 'Electron Microprobe Analysis', 'Scanning Probe instruments', 'Hyphenated techniques: LC-MS, GC-MS', 'Automation in labs'] }
    ],
    '24S040': [
        { num: 1, title: 'Principles of Green Chemistry', topics: ['12 principles of green chemistry', 'Atom economy', 'Prevention of waste', 'Inherently safer chemistry', 'Environmental factors (E-factor)'] },
        { num: 2, title: 'Green Solvents and Reagents', topics: ['Aqueous phase reactions', 'Supercritical fluids (CO2, H2O)', 'Ionic liquids', 'Fluorous phase chemistry', 'Solvent-free reactions'] },
        { num: 3, title: 'Green Synthetic Pathways', topics: ['Microwave-assisted synthesis', 'Sonochemistry', 'Photo-catalytic reactions', 'Biocatalysis in organic synthesis', 'Solid state reactions'] },
        { num: 4, title: 'Renewable Feedstocks', topics: ['Biomass conversion to chemicals', 'Biodiesel and Bioethanol', 'Polymers from renewable sources', 'Sustainable harvesting', 'Zero waste manufacturing'] },
        { num: 5, title: 'Green Chemistry Metrics', topics: ['Life Cycle Assessment (LCA)', 'Toxicity evaluation', 'Green chemistry scorecards', 'Real-time analysis for pollution prevention', 'Case studies of green processes'] }
    ],
    '24S041': [
        { num: 1, title: 'Food Components', topics: ['Food chemistry overview', 'Proteins in food functionality', 'Carbohydrates: Browning reactions', 'Lipids: Rancidity and antioxidants', 'Water activity and food stability'] },
        { num: 2, title: 'Food Additives', topics: ['Preservatives: Antimicrobial and Antioxidant', 'Flavoring agents and enhancers', 'Emulsifiers and Stabilizers', 'Coloring agents: Natural and Synthetic', 'Sweeteners: Nutritive and non-nutritive'] },
        { num: 3, title: 'Food Processing and Preservation', topics: ['Thermal processing: Pasteurization, Sterilization', 'Dehydration and Freezing', 'Irradiation and high-pressure processing', 'Chemical preservation', 'Fermentation in food'] },
        { num: 4, title: 'Food Contaminants and Toxins', topics: ['Pesticide residues', 'Heavy metals', 'Mycotoxins', 'Food allergens', 'Adulterants and their detection'] },
        { num: 5, title: 'Food Analysis and Regulations', topics: ['Sensory evaluation', 'Proximate analysis', 'Nutritional labeling', 'FSSAI standards and international codes (Codex)', 'Quality control in food industry'] }
    ],
    '24S042': [
        { num: 1, title: 'Glasses and Ceramics', topics: ['Glassy state and network formers', 'Refractories and Abrasives', 'Specialty glasses: Fiber optics, Bio-glass', 'Magnetic ceramics', 'Superconducting ceramics'] },
        { num: 2, title: 'Building Materials', topics: ['Portland cement: composition and setting', 'Concrete technology', 'Admixtures', 'Paints and coatings for construction', 'Sustainability in building materials'] },
        { num: 3, title: 'Lubricants and Adhesives', topics: ['Mechanism of lubrication', 'Synthetic lubricants and additives', 'Greases', 'Structural adhesives', 'Pressure sensitive adhesives'] },
        { num: 4, title: 'Materials for Electronics', topics: ['Dielectric and Ferroelectric materials', 'Piezoelectric crystals', 'Conducting polymers', 'Soft and hard magnetic materials', 'Materials for batteries and capacitors'] },
        { num: 5, title: 'Advanced Coating Materials', topics: ['Smart coatings', 'Self-healing coatings', 'Anti-fouling and anti-corrosive coatings', 'Thermal barrier coatings', 'Nanocomposite coatings'] }
    ],
    '24OS02': [
        { num: 1, title: 'Algorithm Analysis', topics: ['Time and Space complexity', 'Asymptotic notations (Big O)', 'Recurrence relations', 'Master theorem', 'Worst-case and average-case analysis'] },
        { num: 2, title: 'Sorting and Searching', topics: ['Quicksort and Mergesort', 'Heapsort', 'Lower bound for sorting', 'Binary search trees', 'Hash tables and collisions'] },
        { num: 3, title: 'Greedy and Dynamic Programming', topics: ['Huffman coding', 'Knapsack problem', 'Matrix chain multiplication', 'Longest common subsequence', 'Optimal binary search trees'] },
        { num: 4, title: 'Graph Algorithms', topics: ['BFS and DFS', 'Minimum spanning trees (Kruskal, Prim)', 'Dijkstras and Bellman-Ford algorithms', 'All-pairs shortest paths', 'Topological sort'] },
        { num: 5, title: 'NP-Completeness', topics: ['P and NP classes', 'Polynomial time reductions', 'NP-complete problems (3-SAT, Clique)', 'Approximation algorithms', 'Backtracking and Branch and bound'] }
    ],
    '24OS03': [
        { num: 1, title: 'Financial Markets', topics: ['Stocks, Bonds, and Derivatives', 'Arbitrage and Hedging', 'Market efficiency hypothesis', 'Risk and Return', 'Time value of money'] },
        { num: 2, title: 'Stochastic Calculus', topics: ['Brownian motion', 'Itos lemma', 'Stochastic differential equations', 'Martingales', 'Risk-neutral measure'] },
        { num: 3, title: 'Black-Scholes Model', topics: ['Derivation of B-S equation', 'Option pricing: Calls and Puts', 'The Greeks (Delta, Gamma, etc.)', 'Implied volatility', 'Limitations of B-S model'] },
        { num: 4, title: 'Numerical Methods in Finance', topics: ['Binomial tree models', 'Monte Carlo simulation', 'Finite difference methods', 'Volatility surface', 'Hedging strategies'] },
        { num: 5, title: 'Portfolio Theory and Risk', topics: ['Markowitz portfolio optimization', 'Capital Asset Pricing Model (CAPM)', 'Value at Risk (VaR)', 'Credit risk modeling', 'Interest rate derivatives'] }
    ],
    '24OS04': [
        { num: 1, title: 'HTML5 Foundations', topics: ['Semantic HTML elements', 'Forms and validations', 'Audio and Video integration', 'Canvas and SVG basics', 'SEO best practices'] },
        { num: 2, title: 'Advanced CSS3', topics: ['Flexbox and Grid layouts', 'Responsive design: Media queries', 'CSS animations and transitions', 'SASS/SCSS preprocessors', 'CSS frameworks (Tailwind/Bootstrap)'] },
        { num: 3, title: 'JavaScript and DOM', topics: ['ES6+ features', 'Asynchronous JS: Promises, Async/Await', 'DOM manipulation', 'Event handling', 'Client-side storage: LocalStorage, SessionStorage'] },
        { num: 4, title: 'Modern Frontend Frameworks', topics: ['Introduction to React/Vue/Angular', 'Component-based architecture', 'State management', 'Routing in single-page apps', 'API integration (Fetch/Axios)'] },
        { num: 5, title: 'Web Deployment and Tools', topics: ['Iterative design and UX basics', 'Version control: Git', 'Build tools: Vite/Webpack', 'Web performance optimization', 'Hosting and CI/CD basics'] }
    ],
    '24OS05': [
        { num: 1, title: 'Mobile Ecosystem', topics: ['Android vs iOS architecture', 'Native vs Cross-platform development', 'Mobile UI/UX principles', 'App lifecycle', 'SDK and IDE setup'] },
        { num: 2, title: 'Cross-platform Frameworks', topics: ['React Native basics', 'Flutter and Dart', 'Navigation and routing', 'Styled components for mobile', 'State management in mobile apps'] },
        { num: 3, title: 'Device Integration', topics: ['Handling touch and gestures', 'Accessing camera and photos', 'GPS and Location services', 'Sensors (Accelerometer, Gyro)', 'Local notifications'] },
        { num: 4, title: 'Data Persistence and Networking', topics: ['SQLite and Room database', 'Firebase integration', 'RESTful API consumption', 'Offline sync and caching', 'Push notifications (FCM)'] },
        { num: 5, title: 'Testing and Publishing', topics: ['Unit and UI testing', 'Debugging on emulators and devices', 'App Store and Play Store guidelines', 'Monetization strategies', 'App performance monitoring'] }
    ],
    '24OS06': [
        { num: 1, title: 'Foundations of OOP', topics: ['Programming paradigms', 'Classes and Objects', 'State and Behavior', 'Constructors and initialization', 'Memory management: Stack vs Heap'] },
        { num: 2, title: 'Encapsulation and Abstraction', topics: ['Access specifiers (Private, Public, Protected)', 'Information hiding', 'Abstract classes', 'Interfaces and Contracts', 'Data hiding techniques'] },
        { num: 3, title: 'Inheritance and Polymorphism', topics: ['Is-a vs Has-a relationships', 'Method overriding vs Overloading', 'Dynamic binding', 'Final and static keywords', 'Multiple inheritance issues and solutions'] },
        { num: 4, title: 'Templates and Exception Handling', topics: ['Generic programming', 'Standard Template Library (STL)', 'Exception hierarchies', 'Try-Catch-Finally', 'Custom exception types'] },
        { num: 5, title: 'Design Patterns and Best Practices', topics: ['SOLID principles', 'Singleton, Factory, and Observer patterns', 'Code reusability', 'Unit testing in OOP', 'Refactoring techniques'] }
    ],
    '24OS07': [
        { num: 1, title: 'Introduction to Astronomy', topics: ['Celestial coordinate systems', 'Apparent and Absolute magnitude', 'Telescopes and observation tools', 'History of astronomy', 'Keplers laws'] },
        { num: 2, title: 'The Solar System', topics: ['Formation of solar system', 'Planetary properties and atmospheres', 'Asteroids, Comets, and Meteors', 'The Sun: Structure and activity', 'Moons and rings'] },
        { num: 3, title: 'Stellar Evolution', topics: ['H-R diagram', 'Nucleosynthesis', 'Star lifecycles', 'Supernovae and remnants', 'White dwarfs, Neutron stars, and Black holes'] },
        { num: 4, title: 'Galaxies and Cosmology', topics: ['Milky Way structure', 'Classification of galaxies', 'Bangs theory and Big Bang', 'Expanding universe: Hubbles law', 'Dark matter and Dark energy'] },
        { num: 5, title: 'Exoplanets and Astrobiology', topics: ['Detection methods for exoplanets', 'Habitable zones', 'Life in the universe possibilities', 'SETI and space exploration', 'Future missions'] }
    ],
    '24OS08': [
        { num: 1, title: 'Problem Solving Strategies', topics: ['Scientific method in physics', 'Dimensional analysis and orders of magnitude', 'Approximations and Taylor series', 'Error analysis', 'Graphing and data interpretation'] },
        { num: 2, title: 'Mechanics Problems', topics: ['Advanced Newton\'s law problems', 'Work-Energy and Momentum conservation', 'Rotational dynamics including tensors', 'Satellite motion and orbits', 'Oscillators and damping'] },
        { num: 3, title: 'Thermodynamics and Statistical Problems', topics: ['Heat transfer and phase transitions', 'Entropy calculations', 'Maxwell-Boltzmann applications', 'Specific heat models', 'Thermal expansion'] },
        { num: 4, title: 'Electromagnetism Problems', topics: ['Electrostatics and Gauss law', 'Magnetostatics and Ampere law', 'Faradays law and induction', 'AC circuits and resonance', 'Electromagnetic waves'] },
        { num: 5, title: 'Modern Physics Problems', topics: ['Photoelectric and Compton effects', 'Schrodinger equation applications', 'Nuclear decay and energy', 'Elementary particles', 'Relativity problems'] }
    ]
};

// Inject placeholder units for electives so they work with the Topic Notes Generator
const processElectives = (electives) => (electives || []).map(e => {
    const customSyllabus = electiveSyllabi[e.code];
    return {
        ...e,
        hours: e.hours || '3-0-0',
        ca: e.ca !== undefined ? e.ca : 40,
        fe: e.fe !== undefined ? e.fe : 60,
        units: customSyllabus || [{
            num: 1,
            title: 'Overview',
            hours: 45,
            topics: ['Introduction to ' + e.title, 'Fundamental Concepts', 'Key Applications', 'Modern Trends in ' + e.title]
        }]
    };
});

export const allSemesters = [
    { num: 1, label: 'Semester I', courses: semester1 },
    { num: 2, label: 'Semester II', courses: semester2 },
    { num: 3, label: 'Semester III', courses: semester3 },
    { num: 4, label: 'Semester IV', courses: semester4 },
    { num: 5, label: 'Semester V', courses: semester5 },
    { num: 6, label: 'Semester VI', courses: semester6 },
    { num: 'PE', label: 'Professional Electives', courses: processElectives(professionalElectives) },
    { num: 'OE', label: 'Open Electives', courses: processElectives(openElectives) }
];

// Flatten all courses
export function getAllCourses() {
    const courses = [];
    allSemesters.forEach(sem => {
        sem.courses.forEach(c => {
            courses.push({ ...c, semester: sem.num });
        });
    });
    return courses;
}

// Search topics across all courses
export function searchTopics(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const results = [];
    const all = getAllCourses();
    for (const course of all) {
        if (!course.units) continue;
        for (const unit of course.units) {
            for (const topic of unit.topics) {
                if (topic.toLowerCase().includes(q)) {
                    results.push({
                        courseCode: course.code,
                        courseTitle: course.title,
                        semester: course.semester,
                        unitNum: unit.num,
                        unitTitle: unit.title,
                        topic: topic
                    });
                }
            }
            if (unit.title.toLowerCase().includes(q)) {
                results.push({
                    courseCode: course.code,
                    courseTitle: course.title,
                    semester: course.semester,
                    unitNum: unit.num,
                    unitTitle: unit.title,
                    topic: unit.title
                });
            }
        }
        if (course.title.toLowerCase().includes(q) || course.code.toLowerCase().includes(q)) {
            results.push({
                courseCode: course.code,
                courseTitle: course.title,
                semester: course.semester,
                unitNum: 0,
                unitTitle: '',
                topic: course.title
            });
        }
    }
    return results.slice(0, 15);
}

// Infer course from natural language query
export function inferCourse(query) {
    const results = searchTopics(query);
    if (results.length > 0) return results[0];
    // Try splitting query into words and matching
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    for (const word of words) {
        const r = searchTopics(word);
        if (r.length > 0) return r[0];
    }
    return null;
}

// Get course by code
export function getCourseByCode(code) {
    const all = getAllCourses();
    return all.find(c => c.code === code) || null;
}

// Get prerequisite chain
export function getPrerequisites(courseCode) {
    const prereqMap = {
        '24S102': [{ code: '24S101', topic: 'Calculus fundamentals, limits, derivatives' }],
        '24S203': [{ code: '24S101', topic: 'Vector calculus, multivariable functions' }, { code: '24S102', topic: 'ODEs, series solutions' }, { code: '24S201', topic: 'Matrices, eigenvalues' }],
        '24S204': [{ code: '24S103', topic: 'Elasticity, oscillations basics' }],
        '24S205': [{ code: '24S105', topic: 'Thermodynamics, phase equilibria' }],
        '24S301': [{ code: '24S101', topic: 'Integral calculus, series' }],
        '24S302': [{ code: '24S202', topic: 'C programming - arrays, pointers, structures' }],
        '24S303': [{ code: '24S204', topic: 'Wave motion, optics' }],
        '24S304': [{ code: '24S103', topic: 'Properties of matter basics' }],
        '24S305': [{ code: '24S104', topic: 'Chemical bonding, molecular geometry' }],
        '24S306': [{ code: '24S104', topic: 'Electronic structure, periodic table' }],
        '24S401': [{ code: '24S101', topic: 'Limits, continuity, sequences' }],
        '24S402': [{ code: '24S304', topic: 'Electric circuits, electromagnetic induction' }],
        '24S403': [{ code: '24S103', topic: 'Elasticity, viscosity' }, { code: '24S204', topic: 'Oscillatory motion, waves' }],
        '24S404': [{ code: '24S305', topic: 'Organic reaction mechanisms, stereochemistry' }],
        '24S405': [{ code: '24S306', topic: 'Chemical bonding theories, acids bases' }],
        '24S501': [{ code: '24S101', topic: 'Calculus, integration' }, { code: '24S102', topic: 'Differential equations' }, { code: '24S203', topic: 'Fourier series, special functions' }],
        '24S502': [{ code: '24S201', topic: 'Linear algebra - vector spaces, linear transformations' }],
        '24S503': [{ code: '24S303', topic: 'Atomic structure, X-rays' }, { code: '24S304', topic: 'Electricity and magnetism' }],
        '24S504': [{ code: '24S203', topic: 'Mathematical physics - operators, special functions' }, { code: '24S303', topic: 'Atomic structure, Bohr model' }],
        '24S505': [{ code: '24S105', topic: 'Thermodynamics, chemical equilibrium' }, { code: '24S205', topic: 'Electrochemistry, kinetics' }],
        '24S506': [{ code: '24S305', topic: 'Organic chemistry fundamentals' }, { code: '24S205', topic: 'Photochemistry' }],
        '24S601': [{ code: '24S101', topic: 'Calculus optimization' }, { code: '24S201', topic: 'Linear algebra, matrix methods' }]
    };
    return prereqMap[courseCode] || [];
}

// Cross-course connections
export function getCrossConnections(courseCode) {
    const crossMap = {
        '24S101': ['24S102 Differential Equations uses calculus tools', '24S203 Mathematical Physics builds on vector calculus', '24S301 Probability uses integration techniques'],
        '24S103': ['24S204 Oscillations extends elasticity concepts', '24S403 Mechanics uses force and energy ideas', '24S505 Applied Chemistry uses fluid mechanics'],
        '24S104': ['24S305 Organic Chemistry I builds on bonding', '24S306 Inorganic Chemistry I extends periodic table', '24S505 Applied Chemistry uses general chemistry'],
        '24S105': ['24S205 Physical Chemistry II continues electrochemistry kinetics', '24S505 Applied Chemistry applies corrosion fuel concepts'],
        '24S201': ['24S203 Mathematical Physics uses matrices tensors', '24S502 Abstract Algebra extends algebraic structures', '24S504 Quantum Mechanics uses eigenvalue problems'],
        '24S202': ['24S302 Data Structures uses C programming', '24S006 Machine Learning can use C implementations'],
        '24S203': ['24S504 Quantum Mechanics uses special functions', '24S501 Complex Variables extends Fourier analysis'],
        '24S205': ['24S505 Applied Chemistry applies electrochemistry', '24S032 Corrosion Science uses electrode potentials'],
        '24S301': ['24S005 Stochastic Processes extends probability', '24S006 Machine Learning uses statistics heavily'],
        '24S302': ['24S006 Machine Learning uses data structure concepts', '24S007 AI uses search trees algorithms'],
        '24S303': ['24S503 Solid State Physics extends crystal band theory', '24S504 Quantum Mechanics extends atomic model'],
        '24S304': ['24S402 Electronics uses circuit theory', '24S503 Solid State Physics uses electrical magnetic properties'],
        '24S601': ['24S004 Optimization Techniques extends LP methods', '24S301 Probability Statistics connects to decision theory']
    };
    return crossMap[courseCode] || [];
}

// Get textbook reference for a course
export function getTextbookRef(courseCode) {
    const course = getCourseByCode(courseCode);
    if (!course) return { textbooks: [], references: [] };
    return { textbooks: course.textbooks || [], references: course.references || [] };
}

// Get all lab courses
export function getLabCourses() {
    const all = getAllCourses();
    return all.filter(c => c.hours && c.hours.startsWith('0-0'));
}

// Get stats
export function getStats() {
    const all = getAllCourses();
    const totalCredits = all.reduce((s, c) => s + (c.credits || 0), 0);
    const theoryCourses = all.filter(c => c.hours && !c.hours.startsWith('0-0')).length;
    const labCourses = all.filter(c => c.hours && c.hours.startsWith('0-0')).length;
    let totalTopics = 0;
    all.forEach(c => {
        if (c.units) c.units.forEach(u => { totalTopics += u.topics.length; });
    });
    return { totalCourses: all.length, totalCredits, theoryCourses, labCourses, totalTopics, semesters: 6 };
}
