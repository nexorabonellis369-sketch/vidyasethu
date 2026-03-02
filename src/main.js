// Vidhyasethu - BSc Applied Science Companion
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
import { allSemesters, getAllCourses, searchTopics, inferCourse, getCourseByCode, getPrerequisites, getCrossConnections, getTextbookRef, getLabCourses, getStats } from './engine/courseMapper.js';
import { renderDashboard } from './components/dashboard.js';
import { renderTopicNotes } from './components/topicNotes.js';
import { renderDoubtSolver } from './components/doubtSolver.js';
import { renderRealWorld } from './components/realWorld.js';
import { renderExamPlanner } from './components/examPlanner.js';
import { renderLabHelper } from './components/labHelper.js';
import { renderUserNotes } from './components/userNotes.js';

// State
let currentMode = 'dashboard';
let selectedCourse = null;

// DOM refs
const contentArea = document.getElementById('content-area');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const breadcrumb = document.getElementById('breadcrumb');
const searchInput = document.getElementById('global-search');
const searchResults = document.getElementById('search-results');
const themeToggle = document.getElementById('theme-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// Global setter for components
window._setMode = setMode;

// Init
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Initialize Mermaid
    window.mermaid = mermaid;
    mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

    buildSemesterNav();
    setupEventListeners();
    setMode('dashboard');

    // Set dark theme default
    if (!document.documentElement.getAttribute('data-theme')) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        // In production, sw.js is at root; in dev, it's in /public/
        const swPath = import.meta.env.DEV ? '/public/sw.js' : '/sw.js';
        navigator.serviceWorker.register(swPath)
            .then(reg => console.log('Service Worker registered.'))
            .catch(err => console.error('Service Worker registration failed.', err));
    }
}

function setupEventListeners() {
    // Sidebar toggle (mobile)
    const toggleSidebar = (show) => {
        const isOpen = show !== undefined ? show : !sidebar.classList.contains('open');
        sidebar.classList.toggle('open', isOpen);
        sidebarOverlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    sidebarToggle.addEventListener('click', () => toggleSidebar());
    sidebarClose.addEventListener('click', () => toggleSidebar(false));
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

    // Mode navigation
    document.querySelectorAll('.nav-item[data-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            setMode(btn.dataset.mode);
            if (window.innerWidth <= 768) toggleSidebar(false);
        });
    });



    // Search
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length >= 2) searchResults.classList.remove('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.classList.add('hidden');
        }
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });

    // Global Voice Search
    const globalVoice = document.getElementById('global-voice');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && globalVoice) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        let isRecording = false;

        recognition.onstart = () => {
            isRecording = true;
            globalVoice.classList.add('recording');
            searchInput.placeholder = "Listening...";
        };

        recognition.onresult = (e) => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            searchInput.value = transcript;
            handleSearch();
        };

        recognition.onend = () => {
            isRecording = false;
            globalVoice.classList.remove('recording');
            searchInput.placeholder = "Search topics, courses...";
        };

        recognition.onerror = (e) => {
            console.error("Speech error", e.error);
            isRecording = false;
            globalVoice.classList.remove('recording');
        };

        globalVoice.addEventListener('click', () => {
            if (isRecording) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (err) {
                    console.error(err);
                }
            }
        });
    } else if (globalVoice) {
        globalVoice.style.display = 'none';
    }
}

function buildSemesterNav() {
    const nav = document.getElementById('semester-nav');
    nav.innerHTML = allSemesters.map(sem => `
    <div class="semester-group">
      <button class="semester-toggle" data-sem="${sem.num}">
        <span>📚 ${sem.label}</span>
        <span class="arrow">▶</span>
      </button>
      <div class="semester-courses" data-sem-courses="${sem.num}">
        ${sem.courses.map(c => `
          <button class="course-link" data-code="${c.code}">
            <span class="code">${c.code}</span>${c.title}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

    // Toggle semester accordion
    nav.querySelectorAll('.semester-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('open');
            const courses = nav.querySelector(`[data-sem-courses="${btn.dataset.sem}"]`);
            courses.classList.toggle('open');
        });
    });

    // Course click → topic notes
    nav.querySelectorAll('.course-link').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedCourse = getCourseByCode(btn.dataset.code);
            setMode('topic_notes_pdf');
            sidebar.classList.remove('open');
        });
    });
}

function handleSearch() {
    const q = searchInput.value.trim();
    if (q.length < 2) {
        searchResults.classList.add('hidden');
        return;
    }
    const results = searchTopics(q);
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item"><span class="search-result-title">No results found</span></div>';
    } else {
        searchResults.innerHTML = results.map(r => `
      <div class="search-result-item" data-code="${r.courseCode}" data-topic="${r.topic}">
        <div class="search-result-code">${r.courseCode} · Semester ${r.semester}</div>
        <div class="search-result-title">${r.courseTitle}</div>
        <div class="search-result-topic">${r.unitTitle ? `Unit ${r.unitNum}: ${r.unitTitle}` : ''} ${r.topic !== r.courseTitle ? '→ ' + r.topic : ''}</div>
      </div>
    `).join('');
    }
    searchResults.classList.remove('hidden');

    // Click handlers
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const code = item.dataset.code;
            selectedCourse = getCourseByCode(code);
            setMode('topic_notes_pdf');
            searchResults.classList.add('hidden');
            searchInput.value = '';
            sidebar.classList.remove('open');
        });
    });
}

export function setMode(mode, data) {
    currentMode = mode;
    if (data && data.course) selectedCourse = data.course;

    // Update nav active state
    document.querySelectorAll('.nav-item[data-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update breadcrumb
    const modeLabels = {
        dashboard: 'Dashboard',
        topic_notes_pdf: '📝 Topic Notes',
        doubt_solver: '🧠 Doubt Solver',
        real_world_visual: '🌍 Real-World Applications',
        exam_planner: '📊 Exam Planner',
        lab_helper: '🔬 Lab Helper',
        user_notes: '📁 My Personal Notes'
    };
    breadcrumb.innerHTML = `<span>${modeLabels[mode] || mode}</span>`;
    if (selectedCourse && mode !== 'dashboard') {
        breadcrumb.innerHTML += `<span class="sep">›</span><span class="current">${selectedCourse.code} ${selectedCourse.title}</span>`;
    }

    // Render content
    contentArea.scrollTop = 0;
    switch (mode) {
        case 'dashboard':
            renderDashboard(contentArea, { allSemesters, getStats, setMode: setMode });
            break;
        case 'topic_notes_pdf':
            renderTopicNotes(contentArea, { allSemesters, selectedCourse, getCourseByCode, getPrerequisites, getCrossConnections, getTextbookRef, setMode: setMode });
            break;
        case 'doubt_solver':
            renderDoubtSolver(contentArea, { inferCourse, getCourseByCode, getPrerequisites, getCrossConnections });
            break;
        case 'real_world_visual':
            renderRealWorld(contentArea, { allSemesters, selectedCourse, getCourseByCode });
            break;
        case 'exam_planner':
            renderExamPlanner(contentArea, { allSemesters, selectedCourse, getCourseByCode, getTextbookRef });
            break;
        case 'lab_helper':
            renderLabHelper(contentArea, { getLabCourses, getCourseByCode });
            break;
        case 'user_notes':
            renderUserNotes(contentArea, { allSemesters });
            break;
    }
}
