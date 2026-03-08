// Admin Panel Component — App Health, Course Stats, Storage Inspector
import { getStats } from '../utils/bookmarks.js';
import { allSemesters } from '../engine/courseMapper.js';
import { generateContent, generateImage } from '../utils/aiClient.js';

const APP_VERSION = '2.5.0';
const RELEASE_DATE = '2026-03-03';

export function renderAdminPanel(container) {
  const stats = getStats();
  const totalCourses = allSemesters.flatMap(s => s.courses).length;
  const totalTopics = allSemesters.flatMap(s => s.courses).flatMap(c => c.units || []).flatMap(u => u.topics || []).length;
  const aiNotes = JSON.parse(localStorage.getItem('vidyasetu_saved_notes') || '[]');
  const bookmarks = JSON.parse(localStorage.getItem('vidyasetu_bookmarks') || '[]');
  const doubts = parseInt(localStorage.getItem('vidyasetu_doubts_count') || '0');

  // Estimate localStorage usage
  let storageUsedKB = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        storageUsedKB += (localStorage[key].length * 2) / 1024;
      }
    }
  } catch (e) { }
  const storageUsedStr = storageUsedKB < 1024
    ? `${storageUsedKB.toFixed(1)} KB`
    : `${(storageUsedKB / 1024).toFixed(2)} MB`;

  // Announcement from localStorage or default
  const announcement = localStorage.getItem('vidyasetu_announcement') || '';

  container.innerHTML = `
    <div class="animate-fade">
      <!-- Header -->
      <div class="card-premium" style="padding: 28px; margin-bottom: 24px;">
        <div class="card-header" style="margin-bottom: 8px;">
          <div class="card-icon" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); width: 52px; height: 52px; font-size: 1.6rem;">⚙️</div>
          <div>
            <div class="card-title" style="font-size: 1.4rem;">Admin Panel</div>
            <div class="card-desc">App health, storage inspector, and content management for Vidyasetu v${APP_VERSION}.</div>
          </div>
        </div>
        <div class="chip-list" style="margin-top: 8px;">
          <span class="badge badge-emerald">v${APP_VERSION}</span>
          <span class="badge badge-cyan">Released ${RELEASE_DATE}</span>
          <span class="badge" style="background: rgba(99,102,241,0.15); color: #818cf8;">PSG Tech BSc Applied Science</span>
        </div>
      </div>

      <!-- App Stats -->
      <div class="grid-3" style="margin-bottom: 24px; gap: 16px;">
        <div class="card-premium" style="padding: 20px; text-align: center;">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">📚</div>
          <div style="font-weight: 800; font-size: 1.8rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${totalCourses}</div>
          <div style="font-size: 0.78rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">Courses</div>
        </div>
        <div class="card-premium" style="padding: 20px; text-align: center;">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🗂️</div>
          <div style="font-weight: 800; font-size: 1.8rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${totalTopics}</div>
          <div style="font-size: 0.78rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">Topics Indexed</div>
        </div>
        <div class="card-premium" style="padding: 20px; text-align: center;">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">💾</div>
          <div style="font-weight: 800; font-size: 1.8rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${storageUsedStr}</div>
          <div style="font-size: 0.78rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">Storage Used</div>
        </div>
      </div>

      <!-- User Data Inspector -->
      <div class="card-premium" style="margin-bottom: 24px;">
        <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 16px; display: flex; align-items: center; gap: 8px;">
          🗄️ Storage Inspector
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${renderStorageRow('📝 AI Saved Notes', aiNotes.length + ' notes', aiNotes.length > 0 ? 'badge-cyan' : '')}
          ${renderStorageRow('⭐ Bookmarked Topics', bookmarks.length + ' topics', bookmarks.length > 0 ? 'badge-amber' : '')}
          ${renderStorageRow('🧠 Doubts Solved', doubts + ' total', doubts > 0 ? 'badge-emerald' : '')}
          ${renderStorageRow('🌐 PWA Cached', navigator.onLine ? 'Online' : 'Offline', navigator.onLine ? 'badge-emerald' : 'badge-rose')}
        </div>
        <div style="margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button id="export-storage-btn" class="btn btn-secondary btn-sm">📥 Export App Data</button>
          <button id="import-storage-btn" class="btn btn-outline btn-sm">📤 Import Data</button>
          <button id="clear-all-admin-btn" class="btn btn-ghost btn-sm" style="color: var(--accent-rose);">🗑️ Clear All Data</button>
        </div>
        <input type="file" id="import-file-input" accept=".json" style="display:none;">
      </div>

      <!-- Semester Overview -->
      <div class="card-premium" style="margin-bottom: 24px;">
        <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 16px;">📚 Course Registry</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${allSemesters.map(sem => `
            <div style="padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">📘 ${sem.label}</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 2px;">${sem.courses.length} courses</div>
              </div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; max-width: 60%;">
                ${sem.courses.map(c => `<span class="badge" style="font-size: 0.65rem; padding: 2px 6px;">${c.code}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Announcement Banner -->
      <div class="card-premium" style="margin-bottom: 24px;">
        <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 12px;">📢 Announcement Banner</h3>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 12px;">This message appears at the top of the Dashboard for all students.</p>
        <textarea id="announcement-input" rows="3" class="form-input" style="width: 100%; margin-bottom: 12px; font-size: 0.9rem;" placeholder="e.g. Semester exams start on April 14! Best of luck 🎉">${announcement}</textarea>
        <div style="display: flex; gap: 10px;">
          <button id="save-announcement-btn" class="btn btn-primary btn-sm">💾 Save Announcement</button>
          <button id="clear-announcement-btn" class="btn btn-ghost btn-sm" style="color: var(--accent-rose);">✕ Clear</button>
        </div>
        <div id="announcement-feedback" style="font-size: 0.8rem; color: var(--accent-emerald); margin-top: 8px; display: none;">✅ Announcement saved!</div>
      </div>

      <!-- AI Scale Health (New Phase 9) -->
      <div class="card-premium" style="margin-bottom: 24px;">
        <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 12px; display: flex; align-items: center; gap: 8px;">
          🌐 AI Cluster Scale Status
          <span style="font-size: 0.7rem; font-weight: 400; padding: 2px 6px; background: var(--accent-cyan-dim); color: var(--accent-cyan); border-radius: 4px;">UNLIMITED BACKBONE</span>
        </h3>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">Monitoring availability for large-scale student traffic.</p>
        
        <div id="ai-health-status" style="padding: 12px; background: var(--bg-tertiary); border-radius: 10px; margin-bottom: 16px; border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.85rem;">Intelligence (Flash/Llama)</span>
            <span id="txt-health-pill" class="pill" style="background: var(--bg-primary); font-size: 0.65rem;">PENDING TEST</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem;">Precision Imagery (Flux.1)</span>
            <span id="img-health-pill" class="pill" style="background: var(--bg-primary); font-size: 0.65rem;">PENDING TEST</span>
          </div>
        </div>
        
        <button id="test-ai-btn" class="btn btn-primary btn-sm" style="width: 100%;">⚡ Run Scale Readiness Test</button>
      </div>

      <!-- System Checks -->
      <div class="card-premium">
        <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 16px;">✅ System Health Checks</h3>
        <div id="health-checks" style="display: flex; flex-direction: column; gap: 8px;">
          ${renderCheck('localStorage API', typeof Storage !== 'undefined')}
          ${renderCheck('IndexedDB (User Notes)', typeof indexedDB !== 'undefined')}
          ${renderCheck('Speech Recognition API', !!(window.SpeechRecognition || window.webkitSpeechRecognition))}
          ${renderCheck('Camera API (getUserMedia)', !!(navigator.mediaDevices?.getUserMedia))}
          ${renderCheck('Service Worker (PWA)', 'serviceWorker' in navigator)}
          ${renderCheck('Mermaid Diagrams', !!window.mermaid)}
          ${renderCheck('Network Connection', navigator.onLine)}
        </div>
      </div>
    </div>
  `;

  // Export data
  container.querySelector('#export-storage-btn')?.addEventListener('click', () => {
    const data = {
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      savedNotes: JSON.parse(localStorage.getItem('vidyasetu_saved_notes') || '[]'),
      bookmarks: JSON.parse(localStorage.getItem('vidyasetu_bookmarks') || '[]'),
      doubtsCount: localStorage.getItem('vidyasetu_doubts_count') || '0',
      announcement: localStorage.getItem('vidyasetu_announcement') || '',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vidyasetu_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import data
  const importBtn = container.querySelector('#import-storage-btn');
  const importFile = container.querySelector('#import-file-input');
  importBtn?.addEventListener('click', () => importFile.click());
  importFile?.addEventListener('change', () => {
    const file = importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.savedNotes) localStorage.setItem('vidyasetu_saved_notes', JSON.stringify(data.savedNotes));
        if (data.bookmarks) localStorage.setItem('vidyasetu_bookmarks', JSON.stringify(data.bookmarks));
        if (data.doubtsCount) localStorage.setItem('vidyasetu_doubts_count', data.doubtsCount);
        if (data.announcement) localStorage.setItem('vidyasetu_announcement', data.announcement);
        alert('✅ Data imported successfully! Reloading panel...');
        renderAdminPanel(container);
      } catch (err) {
        alert('❌ Invalid backup file. Please use a file exported from Vidyasetu.');
      }
    };
    reader.readAsText(file);
  });

  // Clear all
  container.querySelector('#clear-all-admin-btn')?.addEventListener('click', () => {
    if (confirm('⚠️ This will delete ALL saved notes, bookmarks, and doubts count permanently. Continue?')) {
      ['vidyasetu_saved_notes', 'vidyasetu_bookmarks', 'vidyasetu_doubts_count'].forEach(k => localStorage.removeItem(k));
      renderAdminPanel(container);
    }
  });

  // Announcement
  container.querySelector('#save-announcement-btn')?.addEventListener('click', () => {
    const text = container.querySelector('#announcement-input')?.value.trim() || '';
    localStorage.setItem('vidyasetu_announcement', text);
    const fb = container.querySelector('#announcement-feedback');
    if (fb) { fb.style.display = 'block'; setTimeout(() => fb.style.display = 'none', 2500); }
  });

  container.querySelector('#clear-announcement-btn')?.addEventListener('click', () => {
    localStorage.removeItem('vidyasetu_announcement');
    const el = container.querySelector('#announcement-input');
    if (el) el.value = '';
  });

  // AI Scale Readiness Test
  container.querySelector('#test-ai-btn')?.addEventListener('click', async (e) => {
    const btn = e.target;
    const txtPill = container.querySelector('#txt-health-pill');
    const imgPill = container.querySelector('#img-health-pill');

    btn.disabled = true;
    btn.innerText = '🧪 Testing Cluster...';
    txtPill.innerText = 'WAITING...';
    imgPill.innerText = 'WAITING...';
    txtPill.style.background = 'var(--bg-primary)';
    imgPill.style.background = 'var(--bg-primary)';

    // 1. Test Text Intelligence
    try {
      const start = Date.now();
      await generateContent([{ role: 'user', content: 'Ping' }]);
      txtPill.innerText = `OK (${Date.now() - start}ms)`;
      txtPill.style.background = 'var(--accent-emerald-dim)';
      txtPill.style.color = 'var(--accent-emerald)';
    } catch (err) {
      txtPill.innerText = 'OFFLINE';
      txtPill.style.background = 'var(--accent-rose-dim)';
      txtPill.style.color = 'var(--accent-rose)';
    }

    // 2. Test Image Precision
    try {
      const start = Date.now();
      const url = await generateImage('Test');
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        imgPill.innerText = `OK (${Date.now() - start}ms)`;
        imgPill.style.background = 'var(--accent-emerald-dim)';
        imgPill.style.color = 'var(--accent-emerald)';
      } else throw new Error();
    } catch (err) {
      imgPill.innerText = 'LIMITED';
      imgPill.style.background = 'var(--accent-amber-dim)';
      imgPill.style.color = 'var(--accent-amber)';
    }

    btn.disabled = false;
    btn.innerText = '⚡ Run Scale Readiness Test';
  });
}

function renderStorageRow(label, value, badgeClass = '') {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
      <span style="font-size: 0.85rem; color: var(--text-secondary);">${label}</span>
      <span class="badge ${badgeClass}" style="font-size: 0.75rem;">${value}</span>
    </div>`;
}

function renderCheck(label, passing) {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
      <span style="font-size: 0.85rem; color: var(--text-secondary);">${label}</span>
      <span class="${passing ? 'badge badge-emerald' : 'badge badge-rose'}" style="font-size: 0.75rem;">${passing ? '✅ OK' : '❌ Missing'}</span>
    </div>`;
}
