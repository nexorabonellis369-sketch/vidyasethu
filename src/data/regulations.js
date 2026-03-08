export const regulations2024 = {
    title: "2024 REGULATIONS OF BSc DEGREE PROGRAMMES",
    institution: "PSG COLLEGE OF TECHNOLOGY, COIMBATORE - 641 004",
    applicability: "For the batches of students admitted in 2024 - 2025 and subsequently",
    definitions: [
        { term: "Programme", desc: "BSc Degree Programme" },
        { term: "Branch", desc: "Specialization like Applied Science or Computer Systems and Design" },
        { term: "Course", desc: "A theory or laboratory course studied in a semester" },
        { term: "Credit", desc: "Weightage given to each course based on contact hours" }
    ],
    curriculumStructure: {
        totalCredits: 139,
        categories: [
            { code: "HS", name: "Humanities and Social Sciences", credits: 12 },
            { code: "BS", name: "Basic Sciences", credits: 24 },
            { code: "PC", name: "Professional Core", credits: 71 },
            { code: "PE", name: "Professional Electives", credits: 18 },
            { code: "OE", name: "Open Electives", credits: 6 },
            { code: "EEC", name: "Employability Enhancement Courses", credits: 8 }
        ]
    },
    assessmentTheory: {
        ca: 40,
        fe: 60,
        passingMinFE: 45,
        passingMinTotal: 50,
        components: [
            "Test 1 (10 marks)",
            "Test 2 (10 marks)",
            "Assignments/Quizzes/Mini-projects (20 marks)"
        ]
    },
    assessmentLab: {
        ca: 60,
        fe: 40,
        passingMinTotal: 50,
        components: [
            "Pre-lab work",
            "Experiment execution",
            "Record maintenance",
            "Viva-voce",
            "Model practical exam"
        ]
    },
    gradingSystem: {
        type: "Absolute Grading",
        scales: [
            { grade: "O", points: 10, range: "91-100", result: "Outstanding" },
            { grade: "A+", points: 9, range: "81-90", result: "Excellent" },
            { grade: "A", points: 8, range: "71-80", result: "Very Good" },
            { grade: "B+", points: 7, range: "61-70", result: "Good" },
            { grade: "B", points: 6, range: "56-60", result: "Average" },
            { grade: "C", points: 5, range: "50-55", result: "Satisfactory" },
            { grade: "RA", points: 0, range: "< 50", result: "Re-appearance" }
        ]
    }
};
