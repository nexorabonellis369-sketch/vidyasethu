// Syllabus Data - Semesters 1-3
export const semester1 = [
  {
    code:'24S101',title:'Calculus and its Applications',credits:4,hours:'3-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Functions, Limits and Continuity',hours:15,topics:['Basic concepts','Functions and their graphs','Combining functions','Shifting and scaling graphs','Limit of a function and limit laws','Precise definition of a limit','One-sided limits','Continuity','Derivative as a function','Functions of several variables','Partial derivatives']},
      {num:2,title:'Differential Calculus',hours:15,topics:['Functions of several variables','Extreme values and saddle points','Lagrange multipliers','Taylors formula for two variables']},
      {num:3,title:'Integral Calculus',hours:15,topics:['Double and iterated integrals','Double integral over general regions','Area by double integration','Double integrals in polar form','Triple integrals in rectangular coordinates','Triple integrals in cylindrical and spherical coordinates']},
      {num:4,title:'Improper Integrals',hours:15,topics:['Beta function','Gamma function','Relation connecting Beta and Gamma functions','Evaluation of definite integrals using Beta and Gamma functions','Applications of Beta and Gamma functions']},
      {num:5,title:'Vector Calculus',hours:15,topics:['Vector and scalar functions and fields','Gradient of a scalar field','Directional derivative','Divergence of a vector field','Curl of a vector field','Line integrals of scalar functions','Vector fields and line integrals - work circulation flux','Path independence conservative fields potential functions','Greens theorem in the plane','Surfaces and area','Surface integrals','Stokes theorem','Divergence theorem']}
    ],
    textbooks:["J. Hass, C. Heil, Maurice D.W, Thomas' Calculus, Pearson, 2023","Erwin Kreyszig, Advanced Engineering Mathematics, Wiley India, 2022"],
    references:["H. Anton et al., Calculus, John Wiley, 2016","Wylie C R, Advanced Engineering Mathematics, McGraw-Hill, 2019","Michael D. G, Foundations of Applied Mathematics, Dover, 2013","Gilbert Strang, Calculus, Wellesley Cambridge, 2017"]
  },
  {
    code:'24S102',title:'Differential Equations',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'ODE of First Order',hours:12,topics:['Basic concepts','Modeling','Separable ODEs','Exact differential equations','Integrating factors','Linear differential equations','Bernoulli equations','Applications - Mixing chemical reaction Law of cooling']},
      {num:2,title:'ODE of Second Order',hours:12,topics:['Homogeneous linear ODEs with constant coefficients','Differential operators','Non-homogeneous ODEs','Existence and uniqueness of solutions','Wronskian']},
      {num:3,title:'Applications of Second Order ODE',hours:12,topics:['Euler-Cauchy equations','Method of variation of parameters','Applications - Electric circuits','Applications - Mass spring system']},
      {num:4,title:'Series Solutions',hours:12,topics:['Power series method','Legendres equation','Frobenius method','Bessels equation','Sturm-Liouville problem']},
      {num:5,title:'Partial Differential Equations',hours:12,topics:['Formation of equations','Eliminating arbitrary constants and functions','Classification of first order PDE','Solvable by direct integration','Solution of linear semi-linear quasi-linear equations']}
    ],
    textbooks:["Erwin Kreyszig, Advanced Engineering Mathematics, Wiley India, 2022","Earl A Coddington, An Introduction to Ordinary Differential Equations, McGraw Hill, 2017"],
    references:["Dennis G Zill, Advanced Engineering Mathematics, Jones & Bartlett, 2016","Ray Wylie, Advanced Engineering Mathematics, McGraw-Hill, 2019","Ian Sneddon, Elements of Partial Differential Equations, McGraw Hill, 2006","William E. Boyce, Elementary Differential Equations, Pearson, 2016"]
  },
  {
    code:'24S103',title:'Properties of Matter and Acoustics',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Elasticity',hours:12,topics:['Modulus of elasticity','Stress-strain curve','Poissons ratio','Rigidity modulus using Torsion pendulum','Bending of beams bending moment','Theory of cantilever','Beam supported at ends loaded in middle','Youngs modulus by bending','I form girders']},
      {num:2,title:'Viscosity',hours:12,topics:['Coefficient of viscosity','Poiseuilles method','Rotation Searles viscometer','Viscosity of gases','Pascals principle','Archimedes principle','Streamline and turbulent motion','Equation of continuity','Bernoullis theorem','Venturimeter','Dynamic lifting']},
      {num:3,title:'Surface Tension',hours:12,topics:['Cohesive and adhesive forces','Surface tension','Surface energy','Wetting and non-wetting surfaces','Pressure across curved surface','Liquid drop bubble cylindrical film','Theory of capillary rise','Drop weight method','Applications of surface tension']},
      {num:4,title:'Acoustics',hours:12,topics:['Musical sound and noise','Loudness pitch quality intensity','Acoustically perfect hall','Reverberation','Sabines formula','Factors affecting acoustics']},
      {num:5,title:'Ultrasonics',hours:12,topics:['Magnetostriction generator','Piezoelectric effect','Piezoelectric generator','Detection properties applications','SONAR','Non destructive testing pulse echo','Through transmission resonance method','Industrial applications drilling cleaning welding cutting']}
    ],
    textbooks:["Brijlal, Subrahmanyam N, Mechanics and Electrodynamics, S. Chand, 2019","Textbook of Sound by BrijLal & Subramaniam, Vikas, 2017"],
    references:["Mendoza E, Properties of Matter, John-Wiley, 2017","Michael De Podesta, Understanding Properties of Matter, Taylor Francis, 2011","Halliday Resnick Walker, Fundamentals of Physics, Wiley, 2016","Gaur RK, Engineering Physics, Dhanpat Rai, 2012"]
  },
  {
    code:'24S104',title:'General Chemistry',credits:3,hours:'3-0-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Electronic Structure of Atoms',hours:9,topics:['Quantum numbers - principal azimuthal magnetic spin','Shapes of atomic orbitals','Energies of orbitals','Aufbau principle','Paulis exclusion principle','Hunds rule','(n+l) rule']},
      {num:2,title:'Structure of the Periodic Table',hours:9,topics:['Modern periodic table','Classification of elements','Periodic variation of atomic ionic radii','Ionization potential','Electron affinity','Electronegativity scales','Applications of electronegativity']},
      {num:3,title:'Chemical Bonding and Molecular Geometry',hours:9,topics:['Kossel-Lewis approach','Ionic bonding Born-Haber cycle','Lattice energies','Fajans rules','Covalent bonding Lewis structures','VSEPR theory','Dipole moment','Intermolecular forces','Hydrogen bonding']},
      {num:4,title:'Principles of Volumetric Analysis',hours:9,topics:['Concentration units','Types of titrimetric analysis','Acid-base redox precipitation complexometric titrations','Types of indicators','Balancing redox equations','Determination of equivalent weight']},
      {num:5,title:'Surface Chemistry and Colloids',hours:9,topics:['Types of adsorption','Physisorption and chemisorption','Freundlich isotherm','Langmuir isotherm','Applications of adsorption','Surface active agents','Micelle formation','Detergency','Types of colloids','Peptization and stability']}
    ],
    textbooks:["Chang R, Chemistry, McGraw Hill, 2016","Clugston MJ, Making the Transition to University Chemistry, Oxford, 2021"],
    references:["Puri BR, Principles of Inorganic Chemistry, Vishal, 2013","Chang R, General Chemistry, McGraw Hill, 2011","Soni PL, Textbook of Inorganic Chemistry, Sultan Chand, 2012","Mahan BM, University Chemistry, Pearson, 2012"]
  },
  {
    code:'24S105',title:'Physical Chemistry I',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Gaseous State',hours:12,topics:['Fundamental gas laws','Kinetic theory of gases','Maxwell distribution laws','Molecular collisions mean free path','Gas viscosity','Grahams laws','Equipartition of energy','Van der Waals equation','Liquefaction of gases','Law of corresponding states']},
      {num:2,title:'Laws of Thermodynamics and Thermochemistry',hours:12,topics:['Work and heat','First law of thermodynamics','Enthalpy heat capacities','Gas expansion isothermal adiabatic','Thermochemistry standard enthalpy','Bond energies','Entropy statistical thermodynamic','Carnot heat engine','Second law','Third law residual entropy']},
      {num:3,title:'Applications of Thermodynamics',hours:12,topics:['Gibbs Helmholtz equations','Helmholtz energy Gibbs energy','Standard molar Gibbs energy','Clapeyron and Clausius-Clapeyron equation','Partial molar quantities','Gibbs-Duhem equation','Chemical potential','Maxwells relationship']},
      {num:4,title:'Chemical Equilibrium',hours:12,topics:['Law of mass action','Relationship between Kp and Kc','Homogeneous equilibria','Dissociation of PCl5 N2O4','Formation of HI NH3 SO3','Heterogeneous equilibrium','Le Chateliers principle','Vant Hoff reaction isotherm isochore','Temperature dependence']},
      {num:5,title:'Phase Equilibria',hours:12,topics:['Derivation of phase rule','One component system water sulphur','Two component systems','Simple eutectic lead-silver bismuth-cadmium','Freezing mixtures','Compound formation congruent melting','Peritectic change','Solid solution','Copper sulphate-water system']}
    ],
    textbooks:["Atkins P, Atkins Physical Chemistry, Oxford, 2022","Levine I, Physical Chemistry, McGraw Hill, 2019"],
    references:["Puri BR, Principles of Physical Chemistry, Vishal, 2023","Bahl BS, Essentials of Physical Chemistry, S.Chand, 2022","Tinoco I, Physical Chemistry Biological Sciences, Pearson, 2022","Chang R, Physical Chemistry Chemical Biological Sciences, Viva, 2017"]
  },
  {
    code:'24S106',title:'English',credits:3,hours:'3-0-0',ca:40,fe:60,cat:'HS',
    units:[
      {num:1,title:'Vocabulary Building',hours:5,topics:['Word Formation','Compounding Backformation Clipping Blending','Root words from foreign languages','Prefixes and suffixes','Synonyms antonyms abbreviations acronyms']},
      {num:2,title:'Grammar',hours:6,topics:['Common errors in English','Tenses','Modal auxiliary verbs','Subject-verb agreement','Articles prepositions','Sentence types','Idioms and phrases','Active and passive voice']},
      {num:3,title:'Reading Comprehension',hours:9,topics:['Skimming and scanning','Critical reading','Inferential analytical skills']},
      {num:4,title:'Basic Writing Skills',hours:9,topics:['Punctuation','Paragraph writing','Describing defining classifying','Precis writing','Essay writing','Formal informal letters','Email writing']},
      {num:5,title:'Listening Skills',hours:6,topics:['Listening techniques','Short comprehension passages','Conversational practice']}
    ],
    textbooks:["Shoba KN, Communicative English: a workbook, Cambridge, 2021"],
    references:["Sanjay Kumar, Communication Skills, Oxford, 2018","Thomas Means, English & Communication, Cengage, 2017"]
  },
  {
    code:'24S107',title:'Properties of Matter and Acoustics Laboratory',credits:2,hours:'0-0-4',ca:60,fe:40,cat:'PC',
    units:[{num:1,title:'Experiments',hours:60,topics:['Youngs Modulus - Cantilever','Youngs modulus - Uniform bending','Rigidity modulus - Torsional pendulum','Surface tension - Capillary rise','Surface tension - Drop weight','Viscosity - Poiseuilles Flow','Viscosity - Searles method','Velocity of sound - Helmholtz Resonator','Ultrasonic waves - Acoustic grating','Ultrasonic interferometer']}],
    textbooks:["Arora CL, Practical Physics, S.Chand, 2020"],references:[]
  },
  {
    code:'24S108',title:'Chemistry Laboratory',credits:2,hours:'0-0-4',ca:60,fe:40,cat:'PC',
    units:[{num:1,title:'Experiments',hours:60,topics:['Chemical Laboratory Safety','Preparation of standard solution','Estimation of Na2CO3 by HCl','Estimation of HCl by NaOH','Estimation of carbonate and hydroxide mixture','Estimation of oxalic acid by KMnO4','Estimation of FeSO4 by KMnO4','Estimation of KMnO4 by thio','Estimation of CuSO4 by thio','Estimation of Ca(II) by EDTA','Determination of strength of commercial samples']}],
    textbooks:["Beran JA, Laboratory Manual for Principles of General Chemistry, Wiley, 2017"],references:[]
  }
];

export const semester2 = [
  {
    code:'24S201',title:'Linear Algebra',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'System of Linear Equations',hours:12,topics:['Systems of linear equations','Row reduction and echelon forms','Vector equations','Matrix equation Ax=b','Solution sets','Applications - linear models in business science engineering']},
      {num:2,title:'Vector Spaces',hours:12,topics:['Real vector spaces','Subspaces','Linear independence','Coordinates and basis','Dimension','Change of basis','Row column null space','Rank and nullity']},
      {num:3,title:'Inner Product Spaces',hours:12,topics:['Inner products','Angle and orthogonality','Gram-Schmidt process','QR decomposition','Best approximation','Least squares']},
      {num:4,title:'Linear Transformations',hours:12,topics:['Matrix transformations Rn to Rm','Properties of matrix transformations','Geometry of matrix operators on R2','General linear transformations','Matrices for general linear transformations']},
      {num:5,title:'Eigenvalues Eigenvectors and SVD',hours:12,topics:['Eigenvalues and eigenvectors','Diagonalization','Orthogonal matrices','Orthogonal diagonalization','Quadratic forms']}
    ],
    textbooks:["David C Lay, Linear Algebra And Its Applications, Pearson, 2022","Howard Anton, Elementary Linear Algebra, Wiley, 2019"],
    references:["Gilbert Strang, Linear Algebra and Applications, Brooks/Cole, 2011","Jeffrey Holt, Linear Algebra with Applications, Freeman, 2016"]
  },
  {
    code:'24S202',title:'C Programming',credits:3,hours:'3-0-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Problem Solving and C Fundamentals',hours:9,topics:['Program development','Algorithm and flow chart','C character set','Data types constants variables','Arrays declarations','Expressions statements','Operators','Library functions','Data input output']},
      {num:2,title:'Control Statements and Functions',hours:9,topics:['While do-while for loop','Nested loop','If-else switch break continue','Goto statement','Defining and accessing functions','Passing arguments','Function prototypes','Storage classes']},
      {num:3,title:'Arrays and Pointers',hours:9,topics:['Defining and processing arrays','Passing arrays to functions','Multi dimensional arrays','Strings','Pointer declaration','Pointers to functions','Pointer arithmetic','Arrays of pointers']},
      {num:4,title:'Structures and Unions',hours:9,topics:['Structure and union definition','Processing structures','Bit field representations','Structures and pointers','Passing structures to functions','Self referential structures','Nested structures']},
      {num:5,title:'Files and Preprocessor Directives',hours:9,topics:['File structure concepts','File operations','Sequential relative indexed random access','Binary mode files','Input output functions on files','#include #define directives','Symbolic constants macros','Conditional compilation']}
    ],
    textbooks:["Kernighan BW, C Programming Language ANSI C, Prentice Hall, 2023","Deitel HM, C How to Program, Prentice Hall, 2023"],
    references:["Herbert Schildt, C Complete Reference, McGraw Hill, 2019","Byron Gottfried, Programming With C, McGraw Hill, 2021"]
  },
  {
    code:'24S203',title:'Mathematical Physics',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Curvilinear Coordinates',hours:10,topics:['Orthogonal coordinates R3','Concept of metric','Spherical coordinates','Cylindrical coordinates','Unit vectors']},
      {num:2,title:'Tensor Analysis',hours:10,topics:['Covariant and contravariant vectors','Contraction','Mixed tensors rank-2','Transformation properties','Metric tensor','Raising and lowering indices','Four-vectors position momentum']},
      {num:3,title:'Matrices',hours:10,topics:['Hermitian adjoint inverse','Hermitian orthogonal unitary matrices','Eigenvalue eigenvector','Similarity transformation','Diagonalisation of real symmetric matrices']},
      {num:4,title:'Special Functions',hours:12,topics:['Bessel functions','Legendre functions','Spherical harmonics','Hermite functions','Laguerre functions','Generating functions','Recurrence relations','Orthonormality','Dirac delta function']},
      {num:5,title:'Fourier Series',hours:10,topics:['Periodic functions','Orthogonality of sine cosine','Dirichlet conditions','Fourier coefficients','Expansion of non-periodic functions']},
      {num:6,title:'Theory of Errors',hours:8,topics:['Systematic and random errors','Propagation of errors','Normal law of errors','Standard and probable error']}
    ],
    textbooks:["Arfken Weber Harris, Mathematical Methods for Physicists, Academic Press, 2019","Sathya Prakash, Mathematical Physics, Sultan Chand, 2018"],
    references:["Chattopadhyay PK, Mathematical Physics, New Age, 2009","Kreyszig, Advanced Engineering Mathematics, Wiley, 2015"]
  },
  {
    code:'24S204',title:'Oscillations, Waves and Optics',credits:3,hours:'3-0-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Oscillatory Motion I',hours:9,topics:['Simple harmonic motion','Physical characteristics of SHM','Mass on a spring','Displacement velocity acceleration phase','Differential equation of SHM','Energy in SHM','SHM between two springs']},
      {num:2,title:'Oscillatory Motion II',hours:8,topics:['Damped harmonic motion','Light heavy critical damping','Energy loss quality factor','LCR circuits','Driven oscillations','Frequency response resonance']},
      {num:3,title:'Wave Motion',hours:9,topics:['Wave properties','Longitudinal transverse waves','Wavelength period frequency','Wave speed intensity','Attenuation','Phase velocity','Plane progressive wave equation','Spherical plane wave fronts']},
      {num:4,title:'Geometrical Optics',hours:9,topics:['Lens equation','Thin thick lenses','Spherical aberration','Chromatic aberration','Condition for achromatism','Coma astigmatism','Eyepieces cameras magnifiers']},
      {num:5,title:'Physical Optics',hours:10,topics:['Interference conditions','Air wedge thickness of wire','Plane diffraction grating','Rayleigh criterion','Resolving power','Polarization quarter half wave plates','Elliptically circularly polarized light','Lasers','Fibre optics']}
    ],
    textbooks:["Richard Wolfson, Essential University Physics, Pearson, 2016","George C King, Vibrations and Waves, Wiley, 2009"],
    references:["Subrahmanyam N, Waves and Oscillations, Vikas, 2018","Ajoy Gharak, Optics, McGraw Hill, 2020"]
  },
  {
    code:'24S205',title:'Physical Chemistry II',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Electrochemistry I',hours:12,topics:['Faradays laws','Conductance of electrolytes','Arrhenius theory','Transport number','Kohlrauschs law','Conductometric titration','Ostwald dilution law','Debye-Huckel theory','Solubility product']},
      {num:2,title:'Electrochemistry II',hours:12,topics:['Electrochemical cells','Cell potential EMF','Nernst equation','Calomel electrode glass electrode','pH determination','Potentiometric titrations','Overvoltage','Concentration cells','Polarography']},
      {num:3,title:'Chemical Kinetics and Catalysis',hours:12,topics:['Reactions of various order','Arrhenius equation','Collision theory','Transition state theory','Lindemanns hypothesis','Chain reactions','Catalysis types','Enzyme kinetics','Michaelis-Menten equation']},
      {num:4,title:'Ionic Equilibria and Solutions',hours:12,topics:['Acids bases Bronsted-Lowry Lewis','pH buffer capacity indicators','Nernst distribution law','Henrys law','Azeotropes','Raoults law','Colligative properties','Boiling point elevation','Freezing point depression']},
      {num:5,title:'Photochemistry',hours:12,topics:['Lambert-Beer law','Grotthus-Draper law','Stark-Einstein law','Quantum efficiency','H2-Cl2 H2-Br2 reactions','Jablonski diagram','Fluorescence phosphorescence','Photosensitization','Chemistry of vision']}
    ],
    textbooks:["Atkins P, Atkins Physical Chemistry, Oxford, 2022","Levine I, Physical Chemistry, McGraw Hill, 2019"],
    references:["Puri BR, Principles of Physical Chemistry, Vishal, 2023","Bahl BS, Essentials of Physical Chemistry, S.Chand, 2022"]
  },
  {
    code:'24S206',title:'Professional English',credits:3,hours:'3-0-0',ca:40,fe:60,cat:'HS',
    units:[
      {num:1,title:'Soft Skills',hours:10,topics:['Process of communication','Intrapersonal interpersonal communication','Cross-cultural communication','Barriers','Body language etiquette','Telephone conversation']},
      {num:2,title:'Presentation Skills',hours:8,topics:['Professional presentation','Public speaking','Group communication','Case study presentation','Meetings','Interview techniques']},
      {num:3,title:'Reading Skills',hours:6,topics:['Comprehension techniques','Syntax vocabulary discourse markers']},
      {num:4,title:'Writing Skills',hours:9,topics:['Professional reports','7Cs of writing','Official business letters','Email writing','Resume writing']},
      {num:5,title:'Practicals',hours:12,topics:['Professional presentations','Group discussions meetings','Mock interviews']}
    ],
    textbooks:["Abirami K, Professional English, RK Publishers, 2021"],references:[]
  },
  {code:'24S207',title:'Oscillations Waves and Optics Laboratory',credits:2,hours:'0-0-4',ca:60,fe:40,cat:'PC',
    units:[{num:1,title:'Experiments',hours:60,topics:['Spring constant - spring mass system','Frequency - Meldes apparatus','Thickness of wire - air wedge','Resolving power - diffraction grating','Refractive index - Brewsters law','Double refraction - calcite crystal','Refractive index using diffraction grating','Wavelength beam divergence of laser','Image formation using lenses','Damped driven harmonic oscillations']}],
    textbooks:["SL Gupta, Practical Physics Vol I, Pragati Prakashan, 2017"],references:[]
  },
  {code:'24S208',title:'Physical Chemistry Laboratory',credits:2,hours:'0-0-4',ca:60,fe:40,cat:'PC',
    units:[{num:1,title:'Experiments',hours:60,topics:['Heat of neutralization','Freundlich isotherm - adsorption','Phase diagram - eutectic system','Partition coefficient of iodine','Mixture of acids by conductometry','Ferrous ion by potentiometry','Weak acid by pH-metry','Cell constant and solubility','Critical solution temperature','Rate constant - ester hydrolysis']}],
    textbooks:["Job G, Physical Chemistry Different Angle, Springer, 2016"],references:[]
  },
  {code:'24S209',title:'C Programming Laboratory',credits:2,hours:'0-0-4',ca:60,fe:40,cat:'PC',
    units:[{num:1,title:'Experiments',hours:60,topics:['Data types programs','Conditional control repetition statements','Single double dimensional arrays','Functions recursive functions','Structures array of structures union','Pointers dynamic allocation','File processing']}],
    textbooks:["Yashavant Kanetkar, Let us C, BPB, 2017"],references:[]
  }
];

export const semester3 = [
  {
    code:'24S301',title:'Probability and Statistics',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Probability and Random Variables',hours:12,topics:['Sample spaces events','Axioms of probability','Addition rules','Conditional probability','Multiplication total probability rules','Independence','Bayes theorem','Random variables']},
      {num:2,title:'Probability Distributions',hours:12,topics:['Binomial distribution','Poisson distribution','Geometric distribution','Uniform distribution','Normal distribution','Exponential distribution']},
      {num:3,title:'Bivariate Distributions',hours:12,topics:['Joint probability mass functions','Joint probability density functions','Independence of discrete random variables','Independence of continuous random variables','Conditional bivariate distributions']},
      {num:4,title:'Estimation and Tests of Hypotheses',hours:12,topics:['Point estimation','Sampling distributions','Central limit theorem','Hypothesis testing','Testing means large small samples','Matched pairs tests','Testing proportions','Chi square test']},
      {num:5,title:'Analysis of Variance',hours:12,topics:['Designing engineering experiments','Completely randomized single-factor experiment','Randomized complete block design']}
    ],
    textbooks:["Montgomery DC, Applied Statistics and Probability, Wiley, 2019","Johnson RA, Probability and Statistics for Engineers, Prentice Hall, 2018"],
    references:["Ghahramani S, Fundamentals of Probability, Pearson, 2014","Devore JL, Probability and Statistics, Brooks/Cole, 2012"]
  },
  {
    code:'24S302',title:'Data Structures',credits:3,hours:'3-0-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Introduction',hours:9,topics:['Data structures abstract data types','Primitive data structures','Algorithm analysis asymptotic notations','Arrays operations implementation','Sparse matrices operations applications']},
      {num:2,title:'Stacks and Queues',hours:9,topics:['Stack primitive operations','Array implementation of stacks','Infix postfix prefix expressions','Recursion Towers of Hanoi','Queue operations','Circular queues dequeues','Priority queues applications']},
      {num:3,title:'Lists',hours:9,topics:['Singly linked list operations','Linked implementation of stacks queues','Circular lists','Double linked lists operations','Applications of linked lists']},
      {num:4,title:'Trees',hours:9,topics:['Binary trees operations','Threaded binary tree','Tree traversals','Expression tree','Huffman algorithm']},
      {num:5,title:'Sorting and Searching',hours:9,topics:['Insertion sort','Selection sort','Bubble sort','Heap sort','Quick sort','Merge sort','Linear search','Binary search']}
    ],
    textbooks:["Kruse R, Data Structures and Program Design in C, Pearson, 2013","Tanenbaum AM, Data Structures using C and C++, Prentice Hall, 2016"],
    references:["Sahni S, Data Structures Algorithms Applications C++, Silicon Press, 2011","Weiss MA, Data Structures Algorithm Analysis C, Addison-Wesley, 2017"]
  },
  {
    code:'24S303',title:'Atomic and Nuclear Physics',credits:3,hours:'3-0-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Atomic Structure',hours:9,topics:['Paulis exclusion principle','Periodic table explanation','Vector atom model','Quantum numbers','Angular momentum magnetic moment','LS and JJ coupling','Spatial quantization','Larmor precession','Bohr magneton','Stern-Gerlach experiment']},
      {num:2,title:'Ionisation Potential and Splitting',hours:9,topics:['Excitation and ionization potential','Davis and Gouchers method','Zeeman effect','Larmors theorem','Debyes explanation normal Zeeman','Anomalous Zeeman effect','Lande g factor','D1 D2 lines of sodium','Stark effect']},
      {num:3,title:'X-Rays',hours:9,topics:['X-ray production','Auger effect','Polarisation of X-rays','Thomson scattering','Photoelectric effect','Moseleys law','Compton effect theory','Pair production']},
      {num:4,title:'Nuclear Transformation',hours:9,topics:['Radioactive decay alpha beta gamma','Half life','Radioactive series','Nuclear cross section','Nuclear reactions','Nuclear fission fusion','Nuclear reactors','GM counter','Scintillation counter']},
      {num:5,title:'Elementary Particles',hours:9,topics:['Interaction of charged particles','Leptons hadrons','Elementary particle quantum numbers','Quarks','Fundamental interactions']}
    ],
    textbooks:["Arthur Beiser, Concepts of Modern Physics, McGraw Hill, 2020","Murugesan R, Modern Physics, S Chand, 2018"],
    references:["Tayal DC, Nuclear Physics, Himalaya, 2017","Serway RA, Modern Physics, Cengage, 2015"]
  },
  {
    code:'24S304',title:'Electricity and Magnetism',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Electrostatics',hours:12,topics:['Electric charge Coulombs law','Electric field point charge','Electric dipole','Electric field lines flux','Gauss law applications','Laplace equation','Electric potential','Applications xerography painting actuators']},
      {num:2,title:'Capacitors and Electric Circuits',hours:12,topics:['Electrostatic energy','Capacitance calculations','Parallel plate cylindrical spherical capacitor','Series parallel capacitors','Energy in electric field','Dielectrics','Electric current density','Resistance resistivity','Electric power safety','Series parallel resistors']},
      {num:3,title:'Magnetic Fields',hours:12,topics:['Magnetic force Lorentz force','Mass spectrometer','Cathode ray oscilloscope','Cyclotron','Biot-Savart law','Amperes law','Solenoid toroid field','Torque on current loop']},
      {num:4,title:'Electromagnetic Induction',hours:12,topics:['Faradays law','Lenz law','Electric generator','Eddy current metal detector','Inductors inductance','Solenoid inductance','Energy in magnetic field','Self mutual induction','Transformer']},
      {num:5,title:'AC Circuits and Maxwells Equations',hours:12,topics:['Alternating current','Resistor capacitor inductor in AC','LC RC RL circuits','RLC circuit','Displacement current','Gauss law for magnetic field','Maxwells equations','Electromagnetic waves','Poynting vector']}
    ],
    textbooks:["Halliday Resnick Walker, Fundamentals of Physics, Wiley, 2018","Richard Wolfson, Essential University Physics, Pearson, 2016"],
    references:["Griffiths DJ, Introduction to Electrodynamics, Pearson, 2015","Murugeshan R, Electricity and Magnetism, S. Chand, 2018"]
  },
  {
    code:'24S305',title:'Organic Chemistry I',credits:3,hours:'2-2-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Basic Concepts and Electronic Effects',hours:12,topics:['IUPAC nomenclature','Bond cleavage homolytic heterolytic','Reactive intermediates carbocations carbanions free radicals','Carbenes nitrenes benzynes','Inductive resonance mesomeric effects','Hyperconjugation','Aromaticity Huckels rule']},
      {num:2,title:'Stereochemistry',hours:12,topics:['Stereoisomerism','Projection formulae Fischer Newman','Optical activity specific rotation','Enantiomers diastereoisomers meso','Racemization resolution','Walden inversion CIP rules','D/L R/S notations','Geometrical isomerism E/Z','Conformational analysis ethane butane']},
      {num:3,title:'Reaction Mechanism',hours:12,topics:['SN1 SN2 mechanisms','Aromatic electrophilic substitution','Diels-Alder reaction','Markovnikovs rule','Nucleophilic addition to carbonyl','Witting reaction','Aldol condensation','Cannizzaro reaction','E1 E2 elimination']},
      {num:4,title:'Molecular Rearrangement',hours:12,topics:['Pinacol-pinacolone rearrangement','Wagner-Meerwein','Wolff rearrangement','Benzil-benzilic acid','Favorskii rearrangement','Hofmann Curtius Schmidt Lossen','Baeyer-Villiger oxidation','Fries rearrangement']},
      {num:5,title:'Special Reagents',hours:12,topics:['DABCO DCC DIBAL NBS PCC','Grignard reagents','Organolithium organocopper','Ziegler-Natta catalyst','Malonic ester synthesis','Acetoacetic ester synthesis','Tautomerism']}
    ],
    textbooks:["Morrison RT Boyd RN, Organic Chemistry, Pearson, 2014","Carey Francis, Organic Chemistry, McGraw-Hill, 2023"],
    references:["Clayden J, Organic Chemistry, Oxford, 2019","March J, Advanced Organic Chemistry, Wiley, 2016"]
  },
  {
    code:'24S306',title:'Inorganic Chemistry I',credits:3,hours:'3-0-0',ca:40,fe:60,cat:'PC',
    units:[
      {num:1,title:'Theories of Chemical Bonding',hours:9,topics:['Valence bond theory hybridization','sp sp2 sp3 sp3d sp3d2','Molecular orbital theory','MO diagrams H2 O2 N2 F2 CO NO','Bond order magnetic properties']},
      {num:2,title:'Concepts of Acids and Bases',hours:9,topics:['Arrhenius Bronsted-Lowry concepts','Levelling differentiating solvents','Lux-Flood concept','Lewis concept','HSAB principle Pearsons concept']},
      {num:3,title:'Nuclear Chemistry',hours:9,topics:['Nuclear stability belt','Magic numbers packing fraction','Nuclear binding energy','Artificial radioactivity','Transmutation fission fusion spallation','Atomic power projects India','Carbon dating rock dating']},
      {num:4,title:'Compounds of B C N Group',hours:9,topics:['Boron sesquioxide borates borax','Borazine boranes borohydrides','Allotropes of carbon graphite diamond fullerenes','Carbon nanotubes','Silicones silicates','Nitrogen cycle','Hydrides oxides oxoacids of N and P']},
      {num:5,title:'Compounds of O and Halogen Group',hours:9,topics:['Types of oxides','Chemistry of oxygen ozone','Oxides oxoacids of sulphur','Halogen hydrides oxides oxoacids','Bleaching powder','Interhalogen compounds','Pseudo halogens pseudo halides']}
    ],
    textbooks:["Lee JD, Concise Inorganic Chemistry, Blackwell, 2018","Housecroft CE, Inorganic Chemistry, Pearson, 2018"],
    references:["Puri BR, Principles of Inorganic Chemistry, Vikas, 2017","Shriver Atkins, Inorganic Chemistry, Freeman, 2009"]
  },
  {code:'24S307',title:'Electricity and Magnetism Laboratory',credits:2,hours:'0-0-4',ca:60,fe:40,cat:'PC',
    units:[{num:1,title:'Experiments',hours:60,topics:['Resistivity - Carey Foster bridge','M and B for bar magnet','Capacitance using LCR bridge','Figure of merit of galvanometer','Magnetic field along axis of coil','Self-induction - Andersons method','Calibration of ammeter voltmeter','Capacitance with solid dielectrics','e/m ratio determination','Millikans oil drop experiment']}],
    textbooks:["SL Gupta, Practical Physics Vol I, Pragati Prakashan, 2017"],references:[]
  },
  {code:'24S308',title:'Inorganic Chemistry Laboratory',credits:2,hours:'0-0-4',ca:60,fe:40,cat:'PC',
    units:[{num:1,title:'Experiments',hours:60,topics:['Semi-micro analysis of inorganic mixture','Anion analysis carbonate sulphide sulphate chloride','Cation analysis lead copper tin cadmium','Preparation of Mohrs salt','Tetraamminecopper(II) sulphate','Calcium tartrate tetrahydrate','Estimation of nickel as Ni-DMG']}],
    textbooks:["Rao P, Practical Inorganic Chemistry, Notion Press, 2019"],references:[]
  },
  {code:'24S309',title:'Data Structures Laboratory',credits:2,hours:'0-0-4',ca:60,fe:40,cat:'PC',
    units:[{num:1,title:'Experiments',hours:60,topics:['Time complexity - arrays matrices strings','Sparse matrix operations','Stacks queues using arrays','Linked lists singly doubly circular','Linked stacks queues priority queues','Binary trees traversal algorithms','Sorting algorithms implementation','Linear binary search']}],
    textbooks:["Lab manual, Dept of Applied Science, PSG Tech"],references:[]
  }
];
