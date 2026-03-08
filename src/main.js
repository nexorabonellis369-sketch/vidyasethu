console.log("🚀 Vidyasetu Core Loading...");
// Vidyasetu - BSc Applied Science Companion
import { allSemesters, getAllCourses, searchTopics, inferCourse, getCourseByCode, getPrerequisites, getCrossConnections, getTextbookRef, getLabCourses, getStats } from './engine/courseMapper.js';
import { renderDashboard } from './components/dashboard.js';
import { renderTopicNotes } from './components/topicNotes.js';
import { renderExamPlanner } from './components/examPlanner.js';
import { renderLabHelper } from './components/labHelper.js';
import { renderUserNotes } from './components/userNotes.js';
import { renderDoubtSolver } from './components/doubtSolver.js';
import { renderRealWorld } from './components/realWorld.js';
import { renderAdminPanel } from './components/adminPanel.js';
import { renderAuth } from './components/auth.js';
import { getStats as getBookmarkStats, getBookmarks, clearBookmarks, syncBookmarksWithCloud } from './utils/bookmarks.js';
import { insforge } from './lib/insforge.js';


// State
let currentMode = 'dashboard';
let selectedCourse = null;
let currentUser = JSON.parse(localStorage.getItem('vidyasetu_user') || 'null');
const APP_VERSION = '5.1.0';

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
const bottomNav = document.getElementById('bottom-nav');

// Global setter for components
window._setMode = setMode;

// Init
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Brand Migration Logic (Vidhyasethu -> Vidyasetu)
    const oldPrefix = 'vidhyasethu_';
    const newPrefix = 'vidyasetu_';
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(oldPrefix)) {
            const newKey = key.replace(oldPrefix, newPrefix);
            if (!localStorage.getItem(newKey)) {
                localStorage.setItem(newKey, localStorage.getItem(key));
            }
        }
    });

    // Initialize Mermaid
    window.mermaid = mermaid;
    mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

    buildSemesterNav();
    setupEventListeners();

    if (!currentUser) {
        setMode('auth');
    } else {
        setMode('dashboard');
        syncBookmarksWithCloud();
    }

    // Set dark theme default
    if (!document.documentElement.getAttribute('data-theme')) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        const swPath = import.meta.env.DEV ? '/public/sw.js' : '/sw.js';
        navigator.serviceWorker.register(swPath)
            .then(reg => {
                console.log('Service Worker registered.');

                // Detection of new version
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New content is available; please refresh.
                                console.log('New update found! Reloading in 1s...');
                                setTimeout(() => window.location.reload(), 1000);
                            }
                        }
                    };
                };
            })
            .catch(err => console.error('Service Worker registration failed.', err));
    }

    // Handle Hardware Back Button (History API)
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.mode) {
            setMode(e.state.mode, { ...e.state.data, skipHistory: true });
        } else {
            setMode('dashboard', { skipHistory: true });
        }
    });

    // Initial state
    history.replaceState({ mode: currentUser ? 'dashboard' : 'auth' }, '', '');
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

    // Bottom navigation
    document.querySelectorAll('.bottom-nav-item[data-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            setMode(btn.dataset.mode);
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
            const topic = item.dataset.topic;
            selectedCourse = getCourseByCode(code);
            setMode('topic_notes_pdf', { topic: topic });
            searchResults.classList.add('hidden');
            searchInput.value = '';
            sidebar.classList.remove('open');
        });
    });
}

export function setMode(mode, data = {}) {
    const skipHistory = data?.skipHistory || false;
    currentMode = mode;
    if (data && data.course) selectedCourse = data.course;

    // Push stated to history for mobile back button
    if (!skipHistory) {
        history.pushState({ mode, data }, '', '');
    }

    // Update nav active state
    document.querySelectorAll('.nav-item[data-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    document.querySelectorAll('.bottom-nav-item[data-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Guard UI based on auth
    if (mode === 'auth') {
        sidebar.style.display = 'none';
        bottomNav.style.display = 'none';
        sidebarToggle.style.display = 'none';
        breadcrumb.style.display = 'none';
        document.body.classList.add('auth-active');
    } else {
        sidebar.style.display = '';
        bottomNav.style.display = '';
        sidebarToggle.style.display = '';
        breadcrumb.style.display = '';
        document.body.classList.remove('auth-active');
    }

    // Update breadcrumb
    const modeLabels = {
        dashboard: '🏠 Home',
        topic_notes_pdf: '📚 Study Material',
        exam_planner: '📅 Exam Planner',
        lab_helper: '🔬 Lab Helper',
        user_notes: '📁 Saved Notes',
        doubt_solver: '🤔 Doubt Solver',
        real_world_visual: '🌎 Real-World',
        profile: '👤 Profile',
        admin: '⚙️ Admin Panel',
        auth: '🔐 Authentication'
    };
    breadcrumb.innerHTML = `<span>${modeLabels[mode] || mode}</span>`;
    if (selectedCourse && mode !== 'dashboard') {
        breadcrumb.innerHTML += `<span class="sep">›</span><span class="current">${selectedCourse.code} ${selectedCourse.title}</span>`;
    }

    // Render content
    contentArea.scrollTop = 0;
    switch (mode) {
        case 'auth':
            renderAuth(contentArea, {
                onLogin: (user) => {
                    currentUser = user;
                    setMode('dashboard');
                }
            });
            break;
        case 'dashboard':
            renderDashboard(contentArea, { allSemesters, getStats, setMode: setMode, user: currentUser });
            break;
        case 'topic_notes_pdf':
            renderTopicNotes(contentArea, { allSemesters, selectedCourse, getCourseByCode, getPrerequisites, getCrossConnections, getTextbookRef, setMode: setMode }, data);
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
        case 'doubt_solver':
            renderDoubtSolver(contentArea);
            break;
        case 'real_world_visual':
            renderRealWorld(contentArea);
            break;
        case 'profile':
            renderProfile(contentArea);
            break;
        case 'admin':
            renderAdminPanel(contentArea);
            break;
    }
}

function renderProfile(container) {
    const stats = getBookmarkStats();
    const bookmarks = getBookmarks();

    container.innerHTML = `
        <div class="animate-fade">
            <!-- Hero -->
            <div class="card-glass" style="text-align:center; padding:48px 24px 32px; position: relative; overflow: hidden; margin-bottom: 24px;">
                <div class="bg-blur blur-cyan" style="opacity: 0.1;"></div>
                <div class="bg-blur blur-purple" style="opacity: 0.1;"></div>
                <div class="animate-float" style="width:100px; height:100px; background:var(--gradient-primary); border-radius:32px; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:3.5rem; color:white; box-shadow:var(--shadow-glow-cyan); transform: rotate(-5deg);">
                    ${currentUser?.avatar || '🎓'}
                </div>
                <h1 style="font-size:1.8rem; font-weight: 800; margin-bottom:6px; letter-spacing: -0.02em;">${currentUser?.name || 'Student Profile'}</h1>
                <p style="color:var(--text-secondary); margin-bottom:0; font-family:'JetBrains Mono', monospace; font-size: 0.9rem;">
                    ${currentUser?.roll || 'Not Logged In'} · ${currentUser?.dept || '2024 Regulation'}
                </p>
            </div>

            <!-- Live Stats -->
            <div class="grid-3" style="margin-bottom: 24px; gap: 16px;">
                <div class="card-premium" style="padding:20px; text-align:center;">
                    <div style="font-size:1.8rem; margin-bottom:8px;">📝</div>
                    <div style="font-weight:800; font-size:2rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${stats.notesCrafted}</div>
                    <div style="font-size:0.78rem; color:var(--text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Notes Saved</div>
                </div>
                <div class="card-premium stagger-1" style="padding:20px; text-align:center;">
                    <div style="font-size:1.8rem; margin-bottom:8px;">🧠</div>
                    <div style="font-weight:800; font-size:2rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${stats.doubtsSolved}</div>
                    <div style="font-size:0.78rem; color:var(--text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Doubts Solved</div>
                </div>
                <div class="card-premium stagger-2" style="padding:20px; text-align:center;">
                    <div style="font-size:1.8rem; margin-bottom:8px;">⭐</div>
                    <div style="font-weight:800; font-size:2rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${stats.keyBookmarks}</div>
                    <div style="font-size:0.78rem; color:var(--text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Bookmarks</div>
                </div>
            </div>

            <!-- Bookmarks -->
            <div class="card-premium" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="font-size: 1rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
                        <span style="color: var(--accent-amber);">★</span> Bookmarked Topics
                    </h3>
                    ${bookmarks.length > 0 ? `<button class="btn btn-ghost btn-sm" id="clear-bookmarks-btn" style="color:var(--accent-rose); font-size: 0.75rem;">🗑️ Clear All</button>` : ''}
                </div>
                ${bookmarks.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">★</div>
                        <div class="card-title">No bookmarks yet</div>
                        <div class="empty-state-text">Star a topic while browsing the sidebar to save it here for quick access.</div>
                    </div>
                ` : `
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${bookmarks.slice(0, 10).map((b, i) => `
                            <div class="course-link" onclick="window._setMode('topic_notes_pdf')" style="display:flex; align-items:center; justify-content:space-between; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-md); cursor: pointer; transition: background 0.2s;" id="bookmark-${i}">
                                <div>
                                    <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${b.topic}</div>
                                    <div style="font-size:0.72rem; color:var(--text-tertiary); margin-top:2px;">${b.courseCode} · Unit ${b.unitNum}</div>
                                </div>
                                <button class="btn btn-ghost btn-sm remove-bookmark-btn" data-idx="${i}" style="color:var(--accent-rose); flex-shrink:0; padding: 4px 8px; font-size: 0.9rem;">✕</button>
                            </div>
                        `).join('')}
                        ${bookmarks.length > 10 ? `<div style="font-size:0.8rem; color:var(--text-tertiary); text-align:center; padding: 8px;">+ ${bookmarks.length - 10} more in library</div>` : ''}
                    </div>
                `}
            </div>

            <!-- Settings -->
            <div class="card-premium">
                <h3 style="font-size:1rem; font-weight: 800; margin: 0 0 16px;">⚙️ Account Settings</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div class="card" style="padding:14px; display:flex; align-items:center; justify-content:space-between; background: var(--bg-tertiary); border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 1.1rem;">🌙</span>
                            <span style="font-size:0.9rem; font-weight: 500;">Theme</span>
                        </div>
                        <button class="btn btn-secondary btn-sm" id="profile-theme-toggle">Toggle Dark/Light</button>
                    </div>
                    <div class="card" style="padding:14px; display:flex; align-items:center; justify-content:space-between; background: var(--bg-tertiary); border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 1.1rem;">💾</span>
                            <span style="font-size:0.9rem; font-weight: 500;">Saved Notes</span>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="window._setMode('user_notes')">View Library</button>
                    </div>
                    <div class="card" style="padding:14px; display:flex; align-items:center; justify-content:space-between; background: var(--bg-tertiary); border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 1.1rem;">🧹</span>
                            <span style="font-size:0.9rem; font-weight: 500;">Clear All Data</span>
                        </div>
                        <button class="btn btn-ghost btn-sm" id="clear-all-data-btn" style="color:var(--accent-rose);">Reset</button>
                    </div>
                    <div class="card" style="padding:14px; display:flex; align-items:center; justify-content:space-between; background: var(--bg-tertiary); border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 1.1rem;">🚪</span>
                            <span style="font-size:0.9rem; font-weight: 500;">Session</span>
                        </div>
                        <button class="btn btn-ghost btn-sm" id="logout-btn" style="color:var(--accent-rose);">Logout</button>
                    </div>
                    <!-- Admin Link -->
                    <div style="text-align:center; margin-top: 16px;">
                        <button class="btn btn-ghost btn-sm" onclick="window._setMode('admin')" style="font-size: 0.75rem; color:var(--text-tertiary); opacity: 0.6;">🛠️ Developer Options</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Theme toggle
    container.querySelector('#profile-theme-toggle')?.addEventListener('click', () => {
        const html = document.documentElement;
        html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    // Clear all bookmarks
    container.querySelector('#clear-bookmarks-btn')?.addEventListener('click', () => {
        if (confirm('Clear all bookmarks?')) { clearBookmarks(); renderProfile(container); }
    });

    // Remove individual bookmark
    container.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.idx);
            const current = getBookmarks();
            current.splice(idx, 1);
            localStorage.setItem('vidyasetu_bookmarks', JSON.stringify(current));
            renderProfile(container);
        });
    });

    // Clear all data
    container.querySelector('#clear-all-data-btn')?.addEventListener('click', () => {
        if (confirm('This will clear all saved notes, bookmarks, and doubts count. Are you sure?')) {
            ['vidyasetu_saved_notes', 'vidyasetu_bookmarks', 'vidyasetu_doubts_count'].forEach(k => localStorage.removeItem(k));
            renderProfile(container);
        }
    });

    // Logout
    container.querySelector('#logout-btn')?.addEventListener('click', () => {
        if (confirm('Logout from Vidyasetu?')) {
            localStorage.removeItem('vidyasetu_user');
            location.reload();
        }
    });
}

function setupGlobalImageHandler() {
    // Utility for external image handling if needed in future
}
