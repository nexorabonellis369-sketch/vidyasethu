// Syllabus Data - Semesters 4-6 and Electives
export const semester4 = [
    {
        code: '24S401', title: 'Real Analysis', credits: 3, hours: '2-2-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Sequence', hours: 12, topics: ['Sequence of real numbers', 'Subsequences', 'Limit of a sequence', 'Convergent divergent sequences', 'Bounded monotone sequences', 'Cauchy sequences', 'Bolzano-Weierstrass theorem'] },
            { num: 2, title: 'Series', hours: 12, topics: ['Series of real numbers', 'Convergence divergence', 'Absolute convergence', 'Series with nonnegative terms', 'Alternating series', 'Conditional convergence', 'Tests for absolute convergence'] },
            { num: 3, title: 'Continuous Functions on Metric Spaces', hours: 12, topics: ['Metric spaces', 'Limits in metric spaces', 'Functions continuous at a point', 'Functions continuous on metric space', 'Open sets closed sets', 'Cantors intersection theorem'] },
            { num: 4, title: 'Connectedness and Completeness', hours: 12, topics: ['Open sets properties', 'Connected sets', 'Bounded totally bounded sets', 'Complete metric spaces'] },
            { num: 5, title: 'Compactness', hours: 12, topics: ['Compact metric spaces', 'Continuous functions on compact spaces', 'Continuity of inverse function', 'Uniform continuity'] }
        ],
        textbooks: ["Goldberg RR, Methods of Real Analysis, Oxford, 2020", "Rudin W, Principles of Mathematical Analysis, McGraw Hill, 2013"],
        references: ["Apostol TM, Mathematical Analysis, China Machine Press, 2004", "Howie JM, Real Analysis, Springer, 2017"]
    },
    {
        code: '24S402', title: 'Analog and Digital Electronics', credits: 3, hours: '3-0-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'P-N Junctions', hours: 9, topics: ['Semiconductor basics', 'Diode theory forward reverse bias', 'Reverse-bias breakdown', 'Limiters clippers clampers', 'Voltage multipliers rectifiers', 'Zener diode regulators', 'IC regulators'] },
            { num: 2, title: 'Bipolar Junction Transistors', hours: 9, topics: ['Transistor fundamentals types', 'CB CE CC configurations', 'DC operating point', 'BJT characteristics parameters', 'Fixed bias potential divider bias', 'RC coupled amplifier', 'Transistor oscillator', 'Astable multivibrator'] },
            { num: 3, title: 'Field-Effect Transistors', hours: 9, topics: ['JFET working principles', 'JFET as amplifier', 'JFET parameters', 'MOSFET depletion enhancement modes', 'MOSFET as switch', 'UJT SCR construction working'] },
            { num: 4, title: 'Operational Amplifiers', hours: 9, topics: ['Op-Amp basics ideal characteristics', 'Differential common mode operation', 'Inverting non-inverting amplifier', 'Op-Amp as adder subtractor', 'Integrator differentiator'] },
            { num: 5, title: 'Digital Electronics', hours: 9, topics: ['Number systems conversions', 'Binary octal hexadecimal', 'Excess three Gray codes', 'Binary arithmetic', 'Boolean algebra laws theorems', 'Karnaugh maps', 'Logic gates', 'Combinational logic circuits'] }
        ],
        textbooks: ["Horowitz P, Art of Electronics, Cambridge, 2016", "Mehta VK, Principles of Electronics, S.Chand, 2020"],
        references: ["Malvino AP, Digital Principles Applications, McGraw Hill, 2011", "Thomas Floyd, Digital Fundamentals, Pearson, 2015"]
    },
    {
        code: '24S403', title: 'Mechanics and Theory of Relativity', credits: 3, hours: '2-2-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Motion in One Two Three Dimensions', hours: 12, topics: ['Displacement and derivatives', 'Free-fall', 'Projectile motion', 'Uniform circular motion', 'Relative motion'] },
            { num: 2, title: 'Force Energy and Work', hours: 12, topics: ['Generalized coordinates', 'Newtons first second laws', 'Particular forces friction drag', 'Work kinetic energy power', 'Potential energy', 'Conservation of energy', 'Elastic inelastic collisions'] },
            { num: 3, title: 'Angular Momentum and Rotation', hours: 12, topics: ['Rolling motion torque', 'Angular momentum conservation', 'Gyroscope precession', 'Rotational variables', 'Moment of inertia', 'Rotational kinetic energy', 'Newtons second law rotation'] },
            { num: 4, title: 'Gravitation', hours: 12, topics: ['Newtons law of gravitation', 'Gravitation near Earth surface', 'Gravitation inside Earth', 'Gravitational potential energy', 'Keplers laws', 'Einsteins theory of gravity'] },
            { num: 5, title: 'Relativity', hours: 12, topics: ['Special relativity', 'Time dilation', 'Doppler effect', 'Length contraction', 'Twin paradox', 'Relativistic momentum', 'Mass and energy', 'E=mc2', 'General relativity'] }
        ],
        textbooks: ["Halliday Resnick Walker, Fundamentals of Physics, Wiley, 2018", "Kleppner D, Introduction to Mechanics, Cambridge, 2013"],
        references: ["Resnick R, Introduction to Special Relativity, Wiley, 2005", "Young Freedman, University Physics, Pearson, 2020"]
    },
    {
        code: '24S404', title: 'Organic Chemistry II', credits: 3, hours: '2-2-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Carbohydrates', hours: 12, topics: ['Classification of carbohydrates', 'Glucose fructose occurrence', 'Osazone formation epimers anomers', 'Cyclic structure mutarotation', 'Haworth representations', 'Disaccharides sucrose maltose', 'Polysaccharides starch cellulose'] },
            { num: 2, title: 'Heterocyclic Compounds', hours: 12, topics: ['Pyrrole furan thiophene', 'Pyridine piperidine basicity', 'Quinoline indole synthesis', 'Skraup synthesis', 'Bischler-Napieralski synthesis', 'Fisher indole synthesis', 'Pyrazoles imidazoles'] },
            { num: 3, title: 'Amino Acids and Proteins', hours: 12, topics: ['Classification of amino acids', 'Gabriel phthalimide Strecker synthesis', 'Zwitter ions isoelectric points', 'Peptide bond synthesis', 'End group analysis', 'Protein structure primary secondary tertiary', 'Denaturation', 'DNA RNA'] },
            { num: 4, title: 'Alkaloids Terpenoids Vitamins', hours: 12, topics: ['Alkaloids classification isolation', 'Hofmann exhaustive methylation', 'Structure of coniine piperine nicotine', 'Terpenoids isoprene rule', 'Geraniol menthol terpineol', 'Vitamins classification', 'Ascorbic acid pyridoxine'] },
            { num: 5, title: 'Dyes and Photochemical Reactions', hours: 12, topics: ['Dyes classification', 'Theory of colour and constitution', 'Methyl orange malachite green', 'Phenolphthalein indigo alizarin', 'Organic photochemistry', 'Photochemical elimination reduction', 'Concerted cyclo-additions'] }
        ],
        textbooks: ["Clayden J, Organic Chemistry, Oxford, 2019", "Morrison RT Boyd RN, Organic Chemistry, Pearson, 2014"],
        references: ["Finar IL, Organic Chemistry Vol I II, Pearson, 2013", "Tewari KS, Textbook of Organic Chemistry, Vikas, 2017"]
    },
    {
        code: '24S405', title: 'Inorganic Chemistry II', credits: 3, hours: '3-0-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Coordination Chemistry', hours: 9, topics: ['Double salts coordination compounds', 'Ligand types chelation effect', 'IUPAC nomenclature', 'Werners theory Sidgwicks theory', 'Valence bond theory', 'Crystal field theory', 'Octahedral tetrahedral splitting', 'CFSE spectrochemical series', 'John-Teller effect'] },
            { num: 2, title: 'Isomerisms and Synthesis', hours: 9, topics: ['Ionization hydrate linkage isomerism', 'Geometrical optical isomerism', 'Labile inert complexes', 'Trans effect and applications', 'Ligand substitution square planar'] },
            { num: 3, title: 'Bioinorganic and Organometallic', hours: 9, topics: ['Essential trace elements', 'Role of Fe2+ Cu2+', 'Hemoglobin myoglobin', 'Carbonic anhydrase', 'Ni(CO)4 sodium nitroprusside ferrocene'] },
            { num: 4, title: 'Solid State Chemistry', hours: 9, topics: ['Crystal systems Bravais lattice', 'Unit cell Miller indices', 'Symmetry elements', 'Braggs equation and method', 'Powder method', 'Crystal structures NaCl CsCl', 'Radius ratio rules packing'] },
            { num: 5, title: 'Transition and Inner Transition Elements', hours: 9, topics: ['General characteristics', 'Lanthanoids actinoids comparison', 'Metallurgical processes', 'Extraction of Ti Fe W', 'Ellingham diagram', 'Chemistry of Th U extraction', 'Alloying Hume-Rothery rules'] }
        ],
        textbooks: ["House JE, Descriptive Inorganic Chemistry, Academic Press, 2016", "Stephanos JJ, Electrons Atoms Molecules, Academic Press, 2017"],
        references: ["Madan RD, Modern Inorganic Chemistry, S.Chand, 2008", "Huheey JE, Inorganic Chemistry, Pearson, 2006"]
    },
    {
        code: '24S406', title: 'Analog and Digital Electronics Laboratory', credits: 2, hours: '0-0-4', ca: 60, fe: 40, cat: 'PC',
        units: [{ num: 1, title: 'Experiments', hours: 60, topics: ['Diode Zener characteristics DC load line', 'Regulated power supply Zener IC', 'BJT FET characteristics', 'Single stage RC amplifier', 'Astable multivibrator BJT', 'UJT characteristics', 'SCR characteristics', 'Op-Amp 741 inverting noninverting', 'Basic logic gates universal gates', 'Half full adder subtractor'] }],
        textbooks: ["Lab manual, Dept of Applied Science, PSG Tech"], references: []
    },
    {
        code: '24S407', title: 'Organic Chemistry Laboratory', credits: 2, hours: '0-0-4', ca: 60, fe: 40, cat: 'PC',
        units: [{ num: 1, title: 'Experiments', hours: 60, topics: ['Functional group characterization', 'Solid derivative preparation', 'Preparation of methyl orange', 'Preparation of aspirin', 'Preparation of soap/sanitizer', 'Melting point determination'] }],
        textbooks: ["Isac-Garcia J, Experimental Organic Chemistry, Elsevier, 2016"], references: []
    }
];

export const semester5 = [
    {
        code: '24S501', title: 'Complex Variables and Transforms', credits: 3, hours: '2-2-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Complex Variables', hours: 12, topics: ['Analytic function', 'Cauchy-Riemann equations', 'Laplaces equations', 'Conformal mapping'] },
            { num: 2, title: 'Complex Integration', hours: 12, topics: ['Line integral complex plane', 'Cauchys integral theorem', 'Cauchys integral formula', 'Laurent series', 'Singularities and zeros', 'Residue integration method'] },
            { num: 3, title: 'Laplace Transform', hours: 12, topics: ['Laplace transform linearity', 'First shifting theorem', 'Transforms of derivatives integrals', 'Unit step function', 'Second shifting theorem', 'Diracs delta function', 'Convolution', 'ODEs with variable coefficients'] },
            { num: 4, title: 'Fourier Series', hours: 12, topics: ['Periodic functions', 'Fourier series arbitrary period', 'Even odd functions', 'Half range expansions', 'Complex Fourier series'] },
            { num: 5, title: 'Fourier Transform', hours: 12, topics: ['Fourier integral', 'Fourier cosine sine transforms', 'Fourier transform inverse', 'Transform of derivatives', 'Convolution', 'Parsevals theorem'] }
        ],
        textbooks: ["Kreyszig E, Advanced Engineering Mathematics, Wiley, 2019", "Wylie CR, Advanced Engineering Mathematics, McGraw-Hill, 2019"],
        references: ["Dennis G Zill, Complex Analysis, Jones Bartlett, 2015", "Mathews JH, Complex Analysis, Narosa, 2012"]
    },
    {
        code: '24S502', title: 'Abstract Algebra', credits: 3, hours: '2-2-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Group Theory', hours: 12, topics: ['Definition of a group', 'Examples of groups', 'Preliminary lemmas', 'Subgroups', 'Counting principle'] },
            { num: 2, title: 'Group Homomorphism', hours: 12, topics: ['Normal subgroups', 'Quotient groups', 'Homomorphism', 'Automorphism', 'Cayleys theorem', 'Permutation groups'] },
            { num: 3, title: 'Groups and Coding', hours: 12, topics: ['Coding of binary information', 'Error detection', 'Group codes', 'Decoding error correction'] },
            { num: 4, title: 'Ring Theory', hours: 12, topics: ['Definition examples of rings', 'Special classes of rings', 'Ring homomorphisms', 'Ideals quotient rings', 'Ring of quaternions'] },
            { num: 5, title: 'Euclidean Ring', hours: 12, topics: ['Euclidean rings', 'Particular euclidean ring', 'Polynomial rings', 'Polynomials over rational field', 'Polynomial rings over commutative rings'] }
        ],
        textbooks: ["Herstein IN, Topics in Algebra, Wiley, 2019", "Gallian JA, Contemporary Abstract Algebra, Cengage, 2022"],
        references: ["Artin M, Algebra, Pearson, 2015", "Dummit DS, Abstract Algebra, Wiley, 2011"]
    },
    {
        code: '24S503', title: 'Solid State Physics', credits: 3, hours: '3-0-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Crystal Physics', hours: 9, topics: ['Lattice points space lattice', 'Basis crystal structure', 'Unit cell primitive cell', 'Crystal systems symmetry', 'Bravais lattice packing density', 'Miller indices', 'Linear planar density', 'Crystal imperfections'] },
            { num: 2, title: 'Mechanical Properties', hours: 9, topics: ['Elastic behaviour model', 'Rubber like elasticity', 'Viscoelastic behaviour', 'Plastic deformation stress-strain', 'Slip shear strength', 'Strengthening mechanisms', 'Creep fatigue fracture'] },
            { num: 3, title: 'Electrical Properties of Metals', hours: 9, topics: ['Classical free electron theory', 'Quantum free electron theory', 'Fermi-Dirac statistics', 'Density of energy states Fermi energy', 'Electrical conductivity quantum', 'Kronig-Penney model', 'Brillouin zones', 'Band theory metals insulators semiconductors', 'Hall effect'] },
            { num: 4, title: 'Magnetic Materials and Superconductivity', hours: 9, topics: ['Diamagnetism paramagnetism', 'Ferromagnetism Curie-Weiss law', 'Domain theory hysteresis', 'Hard soft magnetic materials', 'Antiferromagnetism ferrimagnetism', 'BCS theory', 'Josephson tunnelling', 'Superconductor applications'] },
            { num: 5, title: 'Dielectric Materials', hours: 9, topics: ['Polarization mechanisms', 'Clausius-Mossotti relation', 'Temperature frequency effects', 'Dielectric loss breakdown', 'Ferroelectric materials', 'Piezoelectric materials applications'] }
        ],
        textbooks: ["Kittel C, Introduction to Solid State Physics, Wiley, 2018", "Pillai SO, Solid State Physics, New Age, 2020"],
        references: ["Callister WD, Materials Science Engineering, Wiley, 2018", "Ashcroft NW, Solid State Physics, Holt Rinehart, 2003"]
    },
    {
        code: '24S504', title: 'Quantum Mechanics', credits: 3, hours: '2-2-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Origin of Quantum Theory', hours: 12, topics: ['Plancks quantum hypothesis', 'Einsteins photoelectric theory', 'Compton effect', 'Quantum theory of specific heat', 'Bohr theory hydrogen atom', 'Correspondence principle', 'Stern-Gerlach experiment'] },
            { num: 2, title: 'Wave Mechanical Concepts', hours: 12, topics: ['De Broglie waves', 'Wave packet group phase velocity', 'Electron microscope', 'Davisson-Germer experiment', 'Uncertainty principle applications'] },
            { num: 3, title: 'General Formalism', hours: 12, topics: ['Linear operators eigenfunction eigenvalues', 'Hermitian operator', 'Postulates of quantum mechanics', 'Commutative properties', 'Momentum kinetic total energy operators', 'Expectation values'] },
            { num: 4, title: 'Schrodinger Wave Equation', hours: 12, topics: ['Time dependent Schrodinger equation', 'Time independent equation', 'Particle in 1D 2D 3D box', 'Harmonic oscillator', 'Eigen values eigen states', 'Quantum tunneling', 'Transmission reflection coefficient'] },
            { num: 5, title: 'Quantum Theory of Hydrogen Atom', hours: 12, topics: ['Schrodinger equation hydrogen atom', 'Separation of variables', 'Quantum numbers orbital magnetic', 'Zeeman effect', 'Electron spin', 'Spin-orbit coupling', 'Total angular momentum'] }
        ],
        textbooks: ["Beiser A, Concepts of Modern Physics, McGraw Hill, 2016", "Aruldhas G, Quantum Mechanics, PHI, 2009"],
        references: ["Bransden BH, Quantum Mechanics, Pearson, 2004", "Mathews PM, Textbook of Quantum Mechanics, McGraw Hill, 2010"]
    },
    {
        code: '24S505', title: 'Applied Chemistry', credits: 3, hours: '3-0-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Fuels and Explosives', hours: 9, topics: ['Solid fuels coal analysis', 'Proximate ultimate analysis', 'GCV NCV bomb calorimeter', 'Liquid fuels petroleum refining', 'Octane cetane number', 'Gaseous fuels natural gas', 'Explosives rocket propellants'] },
            { num: 2, title: 'Corrosion and Prevention', hours: 9, topics: ['Chemical electrochemical corrosion', 'Factors influencing corrosion', 'Cathodic protection', 'Corrosion inhibitors', 'Electroplating Cu Ni Cr', 'Anodising aluminium'] },
            { num: 3, title: 'Lubricants Oils Paints', hours: 9, topics: ['Tribology classification', 'Viscosity flash fire point', 'Greases solid lubricants', 'Acid saponification iodine values', 'Paint constituents', 'Special paints'] },
            { num: 4, title: 'Industrially Important Materials', hours: 9, topics: ['Polymers classification', 'PVC Teflon polycarbonates nylon', 'Abrasives refractories adhesives', 'Cement composition manufacture', 'Glass composition classification'] },
            { num: 5, title: 'Water Chemistry', hours: 9, topics: ['Water quality parameters', 'Hardness EDTA estimation', 'BOD COD DO', 'Boiler feed water problems', 'Zeolite demineralization', 'Desalination reverse osmosis', 'Potable water treatment', 'Disinfection chlorination ozonisation'] }
        ],
        textbooks: ["Roussak OV, Applied Chemistry, Springer, 2016", "Kuriacose JC, Chemistry in Engineering, McGraw Hill, 2016"],
        references: ["Sharma BK, Industrial Chemistry, Goel, 2014", "Palanna OG, Engineering Chemistry, McGraw Hill, 2017"]
    },
    {
        code: '24S506', title: 'Analytical Chemistry', credits: 3, hours: '2-2-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'UV-Visible Spectroscopy', hours: 12, topics: ['Electronic spectra diatomic molecules', 'Beer-Lambert law', 'UV band structure', 'Chromophores conjugation', 'Woodward-Fieser rule', 'Colorimetry principles applications'] },
            { num: 2, title: 'IR and Raman Spectroscopy', hours: 12, topics: ['IR absorption process', 'Stretching bending modes', 'FTIR spectrometers', 'Correlation charts', 'Raman spectroscopy', 'Stokes anti-stokes lines', 'Laser Raman applications'] },
            { num: 3, title: 'NMR Spectroscopy', hours: 12, topics: ['Nuclear spin states', 'Chemical shift shielding', 'CW and FT NMR instrument', 'Chemical equivalence integrals', 'Spin-spin splitting n+1 rule', 'Coupling constant', '1H NMR spectra interpretation'] },
            { num: 4, title: 'Mass Spectrometry', hours: 12, topics: ['Mass spectrometer GC-MS', 'Molecular weight determination', 'Molecular formula', 'Metastable ion peak nitrogen rule', 'Fragmentation patterns'] },
            { num: 5, title: 'Chromatography', hours: 12, topics: ['Classification principle', 'Column TLC paper chromatography', 'Gas chromatography HPLC', 'Electrophoresis', 'Adsorption partition ion-exchange', 'Rf value'] }
        ],
        textbooks: ["Pavia DL, Introduction to Spectroscopy, Cengage, 2018", "Field LD, Organic Structures From Spectra, Wiley, 2020"],
        references: ["Sharma YR, Elementary Organic Spectroscopy, S.Chand, 2018", "Khopkar SM, Basic Concepts Analytical Chemistry, New Age, 2019"]
    },
    {
        code: '24S507', title: 'Solid State Physics Laboratory', credits: 2, hours: '0-0-4', ca: 60, fe: 40, cat: 'PC',
        units: [{ num: 1, title: 'Experiments', hours: 60, topics: ['Lattice constant powder diffraction', 'Hall coefficient semiconductor', 'Thermal conductivity Wiedemann-Franz', 'Band gap germanium', 'Magnetic hysteresis loss', 'Paramagnetic susceptibility Quincks tube', 'Solar cell characteristics efficiency', 'Dielectric constant liquid', 'Tensile strength demonstration', 'Shear strength demonstration'] }],
        textbooks: ["Lab manual, Dept of Applied Science, PSG Tech"], references: []
    },
    {
        code: '24S508', title: 'Applied Chemistry Laboratory', credits: 2, hours: '0-0-4', ca: 60, fe: 40, cat: 'PC',
        units: [{ num: 1, title: 'Experiments', hours: 60, topics: ['Hardness of water estimation', 'Alkalinity TDS pH conductivity', 'Available chlorine bleaching powder', 'Moisture ash content coal', 'Acid saponification iodine values oil', 'Viscosity of lubricating oil', 'Corrosion rate inhibitor efficiency', 'Anodising aluminium', 'Electroplating nickel', 'Iron estimation photocolorimetry', 'Chromatographic separation TLC HPLC'] }],
        textbooks: ["Lab manual, Dept of Applied Science, PSG Tech"], references: []
    }
];

export const semester6 = [
    {
        code: '24S601', title: 'Operations Research', credits: 3, hours: '2-2-0', ca: 40, fe: 60, cat: 'PC',
        units: [
            { num: 1, title: 'Linear Programming', hours: 12, topics: ['Formulation of LP problem', 'Graphical method', 'Simplex algorithm', 'M-method', 'Two phase simplex method'] },
            { num: 2, title: 'Duality and Post-Optimal Analysis', hours: 12, topics: ['Definition of dual problem', 'Dual primal relationships', 'Economic interpretation of duality', 'Dual simplex method', 'Sensitivity analysis'] },
            { num: 3, title: 'Transportation Model', hours: 12, topics: ['Transportation problem', 'MODI method', 'Assignment problem', 'Hungarian method'] },
            { num: 4, title: 'CPM and PERT', hours: 12, topics: ['Critical path networks', 'Various floats', 'Time estimates', 'PERT networks', 'Probability of meeting schedule'] },
            { num: 5, title: 'Dynamic Programming', hours: 12, topics: ['Recursive computations', 'Forward backward recursion', 'Tabular method', 'Short route network', 'Cargo loading', 'LP problems via DP'] }
        ],
        textbooks: ["Hillier F, Introduction to Operations Research, McGraw Hill, 2018", "Taha HA, Operations Research, Pearson, 2018"],
        references: ["Ravindran, Operations Research Principles Practice, Wiley, 2007", "Carter MW, Operations Research Practical Introduction, CRC, 2017"]
    },
    {
        code: '24S610', title: 'Project Work and Viva Voce', credits: 6, hours: '0-0-12', ca: 60, fe: 40, cat: 'EEC',
        units: [{ num: 1, title: 'Project', hours: 180, topics: ['Project Work', 'Review I', 'Review II', 'Final Report Presentation', 'Viva Voce'] }],
        textbooks: [],
        references: []
    }
];

export const professionalElectives = [
    { code: '24S001', title: 'Numerical Methods', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S002', title: 'Graph Theory', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S003', title: 'Discrete Mathematics', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S004', title: 'Optimization Techniques', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S005', title: 'Stochastic Processes', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S006', title: 'Machine Learning', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S007', title: 'Artificial Intelligence', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S008', title: 'Cyber Security', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S009', title: 'Cloud Computing', credits: 3, cat: 'PE', dept: 'Maths & CS' },
    { code: '24S016', title: 'Laser Physics and Applications', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S017', title: 'Semiconductor Physics and Devices', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S018', title: 'Heat and Thermodynamics', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S019', title: 'Characterization Techniques in Materials Science', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S020', title: 'Linear Integrated Circuits', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S021', title: 'Nanomaterials and Applications', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S022', title: 'Plasma Physics and Applications', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S023', title: 'Crystal Growth Techniques', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S024', title: 'Ceramics and Composites', credits: 3, cat: 'PE', dept: 'Physics' },
    { code: '24S031', title: 'Polymer Chemistry', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S032', title: 'Corrosion Science and Engineering', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S033', title: 'Applied Electrochemistry', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S034', title: 'Chemistry of Nanomaterials', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S035', title: 'Pharmaceutical Chemistry', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S036', title: 'Textile Chemistry and Chemical Processing', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S037', title: 'Industrial Chemistry', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S038', title: 'Biochemistry', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S039', title: 'Instrumental Methods of Chemical Analysis', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S040', title: 'Green Chemistry', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S041', title: 'Food Chemistry', credits: 3, cat: 'PE', dept: 'Chemistry' },
    { code: '24S042', title: 'Chemistry of Industrially Important Materials', credits: 3, cat: 'PE', dept: 'Chemistry' }
];

export const openElectives = [
    { code: '24OS01', title: 'Python Programming', credits: 3, cat: 'OE' },
    { code: '24OS02', title: 'Design and Analysis of Algorithms', credits: 3, cat: 'OE' },
    { code: '24OS03', title: 'Mathematical Finance', credits: 3, cat: 'OE' },
    { code: '24OS04', title: 'Web Designing', credits: 3, cat: 'OE' },
    { code: '24OS05', title: 'Mobile Application Development', credits: 3, cat: 'OE' },
    { code: '24OS06', title: 'Object Oriented Programming', credits: 3, cat: 'OE' },
    { code: '24OS07', title: 'Astronomy and Cosmology', credits: 3, cat: 'OE' },
    { code: '24OS08', title: 'Problem Solving in Physics', credits: 3, cat: 'OE' },
    { code: '24OS09', title: 'Environmental Science', credits: 3, cat: 'OE' },
    { code: '24OS10', title: 'Bioinorganic Chemistry', credits: 3, cat: 'OE' },
    { code: '24OS11', title: 'Surface Finishing and Coating Technology', credits: 3, cat: 'OE' },
    { code: '24OS12', title: 'Chemical Sensors and Biosensors', credits: 3, cat: 'OE' },
    { code: '24OS13', title: 'Composite Materials', credits: 3, cat: 'OE' },
    { code: '24OS14', title: 'Environmental Chemistry', credits: 3, cat: 'OE' },
    { code: '24OS15', title: 'English and Soft Skills for Employability', credits: 3, cat: 'OE' },
    { code: '24OS16', title: 'English for Competitive Examinations', credits: 3, cat: 'OE' }
];
