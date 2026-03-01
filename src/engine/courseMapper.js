// Course Mapper Engine - Maps queries to courses, topics, prerequisites
import { semester1, semester2, semester3 } from '../data/syllabus1.js';
import { semester4, semester5, semester6, professionalElectives, openElectives } from '../data/syllabus2.js';

// Inject placeholder units for electives so they work with the Topic Notes Generator
const processElectives = (electives) => electives.map(e => ({
    ...e,
    hours: e.hours || '3-0-0',
    ca: e.ca !== undefined ? e.ca : 40,
    fe: e.fe !== undefined ? e.fe : 60,
    units: e.units || [{ num: 1, title: 'Overview', hours: 45, topics: ['Introduction to ' + e.title, 'Fundamental Concepts', 'Key Applications'] }]
}));

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
