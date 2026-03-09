import { toggleBookmark, isBookmarked } from '../utils/bookmarks.js';
import {
  generateContent,
  generateMermaid,
  generateImage,
  generateOptimizedImagePrompt,
  fetchImageAsBlob,
  getProxiedUrl,
  fetchWikipediaResources,
  fetchWikipediaImage,
  fetchWikipediaGallery,
  fetchWikipediaWikitext
} from '../utils/aiClient.js';

// Previous Mermaid and AI functions removed to simplify the application.
// This component now provides structural study frameworks for PSG Tech courses.

async function generateTopicResearch(course, unit, topic, level) {
  const isAdvanced = level === 'advanced_level';
  const prompt = isAdvanced
    ? `Generate comprehensive GATE/advanced-level academic notes for the topic: "${topic}" in the course "${course.title}".`
    : `Generate comprehensive academic notes for the topic: "${topic}" in the course "${course.title}".`;

  try {
    return await generateContent([
      { role: "system", content: "You are a university professor providing structured academic notes." },
      { role: "user", content: prompt }
    ]);
  } catch (error) {
    console.error("AI Research Error:", error);
    return generateLocalNotes(course, unit, topic, level);
  }
}

function generateLocalNotes(course, unit, topic, level) {
  const isAdvanced = level === 'advanced_level';
  const topicWords = topic.replace(/[-_]/g, ' ');

  return `
    <div class="aesthetic-header" style="margin-top:0;">
      <h3>📘 ${topicWords}</h3>
    </div>
    <p style="font-size:0.82rem;color:var(--accent-cyan);margin-bottom:20px;padding:16px;background:var(--accent-cyan-dim);border:1px solid var(--accent-cyan-dim);border-radius:15px;display:flex;flex-direction:column;gap:12px;box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.4rem;">🏛️</span>
        <div>
          <strong style="display:block;">Verified Academic Framework</strong>
          <span style="opacity:0.8;">The application now provides structured study frameworks and high-speed research links for all PSG Tech curriculum topics.</span>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <a href="https://www.google.com/search?q=${encodeURIComponent(topic + ' nptel notes pdf')}" target="_blank" style="flex:1; min-width:140px; text-align:center; padding:10px; background:var(--bg-secondary); border-radius:10px; color:var(--accent-cyan); text-decoration:none; font-size:0.75rem; border:1px solid var(--border-color); font-weight:600;">🔍 Get Professional PDFs</a>
      </div>
    </p>

    <!-- Cornell Layout: Core Definition -->
    <div class="cornell-layout">
      <div class="cornell-cues">
        <div style="margin-bottom:12px;"><strong>What is it?</strong></div>
        <div style="margin-bottom:12px;"><strong>Key Formula</strong></div>
        <div style="margin-bottom:12px;"><strong>SI Units</strong></div>
        <div><strong>Related to</strong></div>
      </div>
      <div class="cornell-notes">
        <p class="key-idea"><strong>${topicWords}</strong> is a fundamental concept in <span class="hl-cyan">${course.title}</span> (${course.code}), covered under Unit ${unit.num}: <em>${unit.title}</em>.</p>
        <p class="key-idea">This topic forms the foundation for understanding advanced principles in ${unit.title} and is frequently tested in university examinations.</p>
        <p class="key-idea">Master this concept to excel in ${isAdvanced ? 'GATE, competitive exams, and research' : 'semester exams and practical applications'}.</p>
      </div>
    </div>
    <div class="cornell-summary">💡 Summary: ${topicWords} is essential for ${course.title}. Understand definition, formula, derivation, and applications to score full marks.</div>

    <!-- Flow Notes: Study Strategy -->
    <div class="aesthetic-header"><h3>📐 Exam Strategy for ${topicWords}</h3></div>
    <div class="flow-container">
      <div class="flow-box">1️⃣ Learn the Definition &amp; Concept</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-box">2️⃣ Memorise the Key Formula</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-box">3️⃣ Understand the Derivation</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-box">4️⃣ Solve Numerical Problems</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-box">5️⃣ Revise Real-World Applications</div>
    </div>

    <!-- Topics in this Unit -->
    <div class="aesthetic-header"><h3>🗂️ All Topics in This Unit</h3></div>
    <div class="chip-list" style="margin-bottom:20px;">
      ${unit.topics.map(t => `<div class="chip" style="${t === topic ? 'border-color:var(--accent-cyan);color:var(--accent-cyan);' : ''}">${t === topic ? '📍 ' : ''}${t}</div>`).join('')}
    </div>

    <!-- Bujo Key Points -->
    <div class="aesthetic-header"><h3>⭐ Quick Revision Points</h3></div>
    <ul class="bujo-list">
      <li class="bujo-item"><span class="bujo-symbol">★</span><div class="bujo-text">Define <strong>${topicWords}</strong> in your own words — 2-mark questions always ask for this.</div></li>
      <li class="bujo-item"><span class="bujo-symbol">★</span><div class="bujo-text">Write the standard formula with all variables explained — essential for 6-mark derivation questions.</div></li>
      <li class="bujo-item"><span class="bujo-symbol">○</span><div class="bujo-text">Know the <span class="hl-amber">SI units</span> and <span class="hl-amber">dimensions</span> of all quantities involved.</div></li>
      <li class="bujo-item"><span class="bujo-symbol">○</span><div class="bujo-text">Understand the assumptions and limitations — often asked in advanced/GATE questions.</div></li>
      <li class="bujo-item"><span class="bujo-symbol">▲</span><div class="bujo-text">Solve at least <strong>3 numerical problems</strong> from previous question papers on ${topicWords}.</div></li>
      <li class="bujo-item"><span class="bujo-symbol">▲</span><div class="bujo-text">Connect to real-world applications in <span class="hl-purple">${course.title}</span> industry use cases.</div></li>
      ${isAdvanced ? `
      <li class="bujo-item"><span class="bujo-symbol">★</span><div class="bujo-text">Study special cases, edge conditions, and limiting behaviour for GATE-level preparation.</div></li>
      <li class="bujo-item"><span class="bujo-symbol">★</span><div class="bujo-text">Understand the mathematical rigour: full derivation, proof from first principles.</div></li>
      ` : ''}
    </ul>
  `;
}

// Unused legacy — kept for reference
function _legacyErrorHtml(errorDetails) {
  return `<div class="card" style="padding:16px;color:var(--accent-rose); border: 1px solid var(--accent-rose);">
    <div style="font-weight:bold;margin-bottom:8px;">⚠️ Live Research Generation Failed</div>
    <p style="font-size:0.9rem;opacity:0.9;">All intellectual AI research providers are currently busy. Please try again in 1 minute.</p>
    <div style="font-size:0.75rem; background:rgba(0,0,0,0.1); padding:8px; border-radius:4px; margin-top:10px; font-family:monospace;">
      <strong>Error Trace:</strong><br>
      ${errorDetails.slice(0, 5).join('<br>')}
    </div>
  </div>`;
}

export function renderTopicNotes(container, { allSemesters, selectedCourse, getCourseByCode, getPrerequisites, getCrossConnections, getTextbookRef, setMode }, initialState = {}) {
  let innerCourse = selectedCourse;
  let unit = initialState.unit ? (innerCourse?.units?.find(u => u.num == initialState.unit) || innerCourse?.units?.[0]) : (innerCourse?.units?.[0] || null);
  let topic = initialState.topic || (unit?.topics?.[0] || null);
  let level = initialState.level || 'bsc_level';

  // If initial topic provided, trigger immediate generation
  if (initialState.topic) {
    setTimeout(() => {
      const output = container.querySelector('#notes-output');
      if (output) generateNotes(output, innerCourse, unit, topic, level, getPrerequisites, getCrossConnections, getTextbookRef, true);
      const printBtn = container.querySelector('#print-btn');
      const saveBtn = container.querySelector('#save-btn');
      if (printBtn) printBtn.style.display = 'flex';
      if (saveBtn) saveBtn.style.display = 'flex';
    }, 100);
  }

  function update() {
    container.innerHTML = `
      <div class="animate-fade">
        <div class="card-premium" style="margin-bottom: 24px; padding: 28px;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div class="card-icon cyan" style="font-size: 1.6rem; width: 52px; height: 52px;">📝</div>
            <div>
              <h1 style="font-size:1.5rem; font-weight: 800; margin: 0 0 4px;">Study Material Index</h1>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin: 0;">University-grade notes, derivations, and practice sets mapped to PSG Tech syllabus.</p>
            </div>
          </div>
          
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">📚 Select Course</label>
              <select id="course-sel" class="form-select">
                <option value="">-- Choose Course --</option>
                ${allSemesters.map(s => `
                  <optgroup label="${s.label}">
                    ${s.courses.map(c => `<option value="${c.code}" ${innerCourse?.code === c.code ? 'selected' : ''}>${c.code} - ${c.title}</option>`).join('')}
                  </optgroup>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">🎯 Study Depth</label>
              <select id="level-sel" class="form-select">
                <option value="bsc_level" ${level === 'bsc_level' ? 'selected' : ''}>📘 BSc Level (Exam Focus)</option>
                <option value="advanced_level" ${level === 'advanced_level' ? 'selected' : ''}>🚀 Advanced Level (GATE)</option>
              </select>
            </div>
          </div>

          ${innerCourse ? `
            <div class="grid-2" style="margin-top: 4px;">
              <div class="form-group">
                <label class="form-label">📖 Select Unit</label>
                <select id="unit-sel" class="form-select">
                  ${(innerCourse.units || []).map(u => `<option value="${u.num}" ${unit?.num === u.num ? 'selected' : ''}>Unit ${u.num}: ${u.title}</option>`).join('')}
                  ${(!innerCourse.units || innerCourse.units.length === 0) ? '<option value="1">Unit 1: Overview</option>' : ''}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">🔖 Select Topic</label>
                <select id="topic-sel" class="form-select">
                  ${unit ? unit.topics.map(t => `<option value="${t}" ${topic === t ? 'selected' : ''}>${t}</option>`).join('') : '<option>Select unit first</option>'}
                </select>
              </div>
            </div>
              <button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:8px; padding: 14px; font-size: 1rem; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan)); border: none; font-weight: 600;" id="gen-btn">
              ✨ Generate AI Notes & Study Material
            </button>
          ` : '<div class="callout callout-info" style="margin-top: 12px;"><div class="callout-icon">👆</div><div>Select a course above to access study materials.</div></div>'}
        </div>
        <div id="notes-output"></div>
        <div id="notes-action-bar" style="display:none; position: fixed; bottom: 80px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 50;">
          <button id="save-btn" class="btn btn-secondary" style="display:none; box-shadow: var(--shadow-lg); gap: 8px">
            💾 Save to Library
          </button>
          <button id="print-btn" class="btn btn-secondary print-btn" style="display:none; box-shadow: var(--shadow-lg);">
            🖨️ Export PDF
          </button>
        </div>
      </div>
    `;

    // Re-attach listeners after every update
    container.querySelector('#course-sel').addEventListener('change', (e) => {
      innerCourse = getCourseByCode(e.target.value);
      if (innerCourse) {
        // Fallback for electives if units missing
        if (!innerCourse.units || innerCourse.units.length === 0) {
          innerCourse.units = [{ num: 1, title: 'Overview', topics: ['Introduction to ' + innerCourse.title, 'Fundamental Concepts', 'Applications'] }];
        }
        unit = innerCourse.units[0];
        topic = unit.topics[0];
      } else {
        unit = null;
        topic = null;
      }
      update();
    });

    if (innerCourse) {
      container.querySelector('#level-sel').addEventListener('change', (e) => {
        level = e.target.value;
      });
      container.querySelector('#unit-sel').addEventListener('change', (e) => {
        unit = innerCourse.units.find(u => u.num == e.target.value) || innerCourse.units[0];
        topic = unit?.topics?.[0] || null;
        update();
      });
      container.querySelector('#topic-sel').addEventListener('change', (e) => {
        topic = e.target.value;
      });
      container.querySelector('#gen-btn').addEventListener('click', () => {
        const output = container.querySelector('#notes-output');
        generateNotes(output, innerCourse, unit, topic, level, getPrerequisites, getCrossConnections, getTextbookRef, true);
        const printBtn = container.querySelector('#print-btn');
        const saveBtn = container.querySelector('#save-btn');
        if (printBtn) { printBtn.style.display = 'flex'; }
        if (saveBtn) { saveBtn.style.display = 'flex'; }
      });
    }

    container.querySelector('#print-btn')?.addEventListener('click', () => {
      window.print();
    });

    container.querySelector('#save-btn')?.addEventListener('click', async () => {
      const notesEl = document.getElementById('printable-notes');
      if (!notesEl) return;
      const key = `note_${Date.now()}`;
      const noteData = {
        id: key,
        course: innerCourse?.code,
        courseTitle: innerCourse?.title,
        unit: unit?.num,
        topic: topic,
        level: level,
        html: notesEl.innerHTML,
        savedAt: new Date().toISOString()
      };

      const saved = JSON.parse(localStorage.getItem('vidyasetu_saved_notes') || '[]');
      saved.unshift(noteData);
      localStorage.setItem('vidyasetu_saved_notes', JSON.stringify(saved.slice(0, 50)));

      // Cloud Sync
      try {
        const { insforge, isConfigured } = await import('../lib/insforge.js');
        const user = JSON.parse(localStorage.getItem('vidyasetu_user') || 'null');
        if (isConfigured && user?.insforge_id) {
          await insforge.from('notes').upsert({
            user_id: user.insforge_id,
            course_code: innerCourse?.code,
            topic: topic,
            content: notesEl.innerHTML,
            is_ai_generated: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id, topic' });
          console.log('✅ Note synced to InsForge cloud.');
        }
      } catch (err) {
        console.error('❌ Cloud Save Error:', err);
      }

      const saveBtn = container.querySelector('#save-btn');
      if (saveBtn) {
        saveBtn.innerHTML = '✅ Saved!';
        saveBtn.style.borderColor = 'var(--accent-emerald)';
        saveBtn.style.color = 'var(--accent-emerald)';
        setTimeout(() => { saveBtn.innerHTML = '💾 Save to Library'; saveBtn.style.borderColor = ''; saveBtn.style.color = ''; }, 2500);
      }
    });
  }
  update();
}

async function generateNotes(output, course, unit, topic, level, getPrerequisites, getCrossConnections, getTextbookRef, useAI = false) {
  const prereqs = getPrerequisites(course.code);
  const crossLinks = getCrossConnections(course.code);
  const books = getTextbookRef(course.code);
  const levelLabel = { bsc_level: '📘 BSc Level', advanced_level: '🚀 Advanced Level' }[level] || level;

  // CHECK CACHE FIRST - Instant View
  const savedNotes = JSON.parse(localStorage.getItem('vidyasetu_saved_notes') || '[]');
  const cachedNote = savedNotes.find(n => n.topic === topic && n.course === course.code && n.level === level);

  if (cachedNote && useAI && !window._bypassCache) {
    console.log("[Topic Notes] Found cached note. Instant rendering.");
    // renderFullUI might not be defined if we move this above its definition, 
    // but in JS, function declarations are hoisted. renderFullUI is a function declaration.
    renderFullUI(cachedNote.html, [], [], [], false, "Loaded from Library ✅");
    return;
  }

  // Placeholder for initial state before renderFullUI takes over
  output.innerHTML = `<div style="padding:40px; text-align:center;"><div class="loading-spinner" style="margin:0 auto; width:40px; height:40px; border:4px solid var(--accent-cyan-dim); border-top:4px solid var(--accent-cyan); border-radius:50%; animation:spin 1s linear infinite;"></div></div>`;

  // Track current topic on the container to prevent race conditions
  output.dataset.currentTopic = topic;

  console.log("[Topic Notes] Loading for:", topic, "Use AI:", useAI);
  let notesHTML = "";
  let aiDiagrams = [];         // Array to store multiple AI diagrams (Mermaid)
  let aiScientificGraphs = []; // Array for multiple scientific graphs
  let aiRealWorldImgUrls = []; // Array for multiple real-world illustrations

  // 1. RENDER SKELETON IMMEDIATELY
  const skeletonNotes = `
    <div class="shimmer" style="height:200px; margin-bottom:16px; border-radius:8px;"></div>
    <div class="shimmer" style="height:150px; margin-bottom:16px; border-radius:8px;"></div>
    <div class="shimmer" style="height:250px; border-radius:8px;"></div>
  `;
  renderFullUI(skeletonNotes, [], [], [], true);

  // Define renderFullUI as a hoisted-like function to be available everywhere in generateNotes
  function renderFullUI(notes, diagrams, graphs, realWorld, isLoadingVisuals = false, status = null) {
    // Safety check for array inputs
    diagrams = Array.isArray(diagrams) ? diagrams : [];
    graphs = Array.isArray(graphs) ? graphs : [];
    realWorld = Array.isArray(realWorld) ? realWorld : [];

    output.innerHTML = `
      <div class="notes-content animate-slide" id="printable-notes" style="opacity: 1 !important; visibility: visible !important; min-height: 50vh;">
        <div class="syllabus-header" style="flex-wrap: wrap; gap: 8px;">
          <div class="sh-item"><span class="sh-label">Course:</span><span class="sh-value">${course.code} – ${course.title}</span></div>
          <span class="sh-sep">|</span>
          <div class="sh-item"><span class="sh-label">Unit ${unit.num}:</span><span class="sh-value">${unit.title}</span></div>
          <span class="sh-sep">|</span>
          <div class="sh-item"><span class="sh-label">Topic:</span><span class="sh-value">${topic}</span></div>
          <span class="sh-sep">|</span>
          <div class="sh-item"><span class="badge badge-cyan">${levelLabel}</span></div>
          <button id="bookmark-topic-btn" class="btn btn-ghost btn-sm" style="margin-left:auto; font-size: 1rem; padding: 4px 10px;"
            data-bookmarked="${isBookmarked(course.code, unit.num, topic)}">
            ${isBookmarked(course.code, unit.num, topic) ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
        </div>
  
        <div class="callout callout-success" style="margin-bottom: 24px;">
          <div class="callout-icon">📚</div>
          <div>
            <strong>Direct Study Material Links</strong>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
              <a href="https://www.google.com/search?q=site:nptel.ac.in+${encodeURIComponent(topic)}" target="_blank" class="btn btn-sm btn-ghost" style="border:1px solid var(--border-color); flex:1; min-width:120px; font-size:0.75rem;">🎓 NPTEL Notes</a>
              <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' PSG Tech PSGCT ' + course.title)}" target="_blank" class="btn btn-sm btn-ghost" style="border:1px solid var(--border-color); flex:1; min-width:120px; font-size:0.75rem;">▶ PSGCT Lectures</a>
              <a href="https://www.google.com/search?q=${encodeURIComponent(topic + ' ' + (books.textbooks[0] || ' textbook'))}+pdf" target="_blank" class="btn btn-sm btn-ghost" style="border:1px solid var(--border-color); flex:1; min-width:120px; font-size:0.75rem;">📂 Ref. Material PDF</a>
            </div>
          </div>
        </div>

        ${(isLoadingVisuals || status) ? `
          <div id="gen-hud" class="card-premium animate-pulse" style="padding:20px; margin-bottom: 24px; border: 1px solid var(--accent-cyan-dim); background: rgba(0, 188, 212, 0.03);">
            <div style="display:flex; align-items:center; gap:16px;">
              <div class="loading-spinner" style="width: 32px; height: 32px; border: 3px solid var(--accent-cyan-dim); border-top: 3px solid var(--accent-cyan); border-radius: 50%; animation: spin 1s linear infinite; flex-shrink: 0;"></div>
              <div style="flex: 1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong id="gen-status-title" style="color:var(--text-primary); font-size: 0.9rem;">
                    ${status || 'AI Processing...'}
                  </strong>
                  <span id="gen-progress-percent" style="font-size:0.75rem; color:var(--accent-cyan); font-weight:700;">${status ? '15%' : '50%'}</span>
                </div>
                <div style="width: 100%; height: 4px; background: var(--bg-tertiary); border-radius: 10px; margin-top: 8px; overflow: hidden;">
                  <div id="gen-progress-bar" style="width: ${status ? '15%' : '50%'}; height: 100%; background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple)); transition: width 0.5s ease;"></div>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        ${notes}
  
        ${(isLoadingVisuals || diagrams.length > 0 || graphs.length > 0) ? `
        <h2>📖 AI Graphical Analysis</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 16px; margin-bottom: 24px;">
            ${isLoadingVisuals && diagrams.length === 0 && graphs.length === 0 ? `
              <div class="card-premium shimmer" style="min-height:250px; border:1px solid var(--accent-purple-dim);"></div>
              <div class="card-premium shimmer" style="min-height:250px; border:1px solid var(--accent-amber-dim);"></div>
            ` : ''}
 
            ${diagrams.map((diag) => `
            <div class="card-premium" style="padding:16px; background: #0d1117; display:flex; flex-direction:column; align-items:center; border: 1px solid var(--accent-purple);">
                <strong style="margin-bottom:12px; font-size:0.85rem; color:var(--accent-purple);">Dynamic Academic Schematic</strong>
                <div class="mermaid" style="width: 100%; display:flex; justify-content:center;">
                  ${diag}
                </div>
            </div>`).join('')}
            
            ${graphs.map((g) => `
            <div class="card-premium" style="padding:16px; background: #0d1117; display:flex; flex-direction:column; align-items:center; border: 1px solid var(--accent-amber);">
                <strong style="margin-bottom:12px; font-size:0.85rem; color:var(--accent-amber);">AI-Generated Scientific Plot</strong>
                <div class="img-container shimmer" style="width:100%; position:relative; aspect-ratio: 16/9; border-radius:8px; overflow:hidden; background: white;">
                  <img src="${g}" alt="Scientific Graph" style="width:100%; height:100%; display:block; object-fit: contain;"
                    onerror="this.onerror=null; this.src='https://placehold.co/800x450/0d1117/white?text=Image+Unavailable';">
                </div>
            </div>`).join('')}
        </div>` : ''}
  
        ${(isLoadingVisuals || realWorld.length > 0) ? `
        <h2>🌍 AI Industrial Illustrations</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 16px; margin-bottom: 24px;">
            ${isLoadingVisuals && realWorld.length === 0 ? `
              <div class="card-premium shimmer" style="min-height:250px; border:1px solid var(--accent-amber-dim);"></div>
              <div class="card-premium shimmer" style="min-height:250px; border:1px solid var(--accent-cyan-dim);"></div>
            ` : ''}
 
            ${realWorld.map((url, idx) => `
            <div class="card-premium" style="padding:16px; background: #0d1117; display:flex; flex-direction:column; align-items:center; border: 1px solid var(--accent-amber);">
                <strong style="margin-bottom:12px; font-size:0.85rem; color:var(--accent-amber);">AI Visual Example ${idx + 1}</strong>
                <div class="img-container shimmer" style="width:100%; position:relative; aspect-ratio: 1/1; border-radius:8px; overflow:hidden;">
                  <img src="${url}" alt="${topic}" style="width:100%; height:100%; display:block; object-fit: cover; transition: transform 0.3s ease;" 
                    onerror="this.src='https://placehold.co/600x600/0d1117/white?text=Image+Unavailable'; this.classList.add('error-placeholder')">
                </div>
                <!-- External Visual Links -->
                <div style="display:flex; gap:8px; width:100%; margin-top:12px;">
                  <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' real world ' + (idx + 1))}" target="_blank" class="btn btn-secondary btn-sm" style="flex:1; font-size:0.7rem; padding:6px; background:rgba(255,0,0,0.1); border:1px solid rgba(255,0,0,0.3); color:#ff4d4d;">
                    🎬 Video
                  </a>
                  <a href="https://www.google.com/search?q=${encodeURIComponent(topic + ' ' + (idx + 1))}&tbm=isch" target="_blank" class="btn btn-secondary btn-sm" style="flex:1; font-size:0.7rem; padding:6px; background:rgba(0,255,255,0.05); border:1px solid rgba(0,255,255,0.2); color:var(--accent-cyan);">
                    🌐 Google
                  </a>
                </div>
            </div>`).join('')}
        </div>` : ''}
  
        <div class="card-premium" style="padding:16px; background: #0d1117; display:flex; flex-direction:column; align-items:center; border: 1px solid #ff0000; margin-bottom: 24px;">
            <strong style="margin-bottom:12px; font-size:0.85rem; color:#fc8174;">Recommended Video Lecture</strong>
            <div class="visual-slot" data-type="video" data-query="${topic} ${course.title}" style="width:100%;">
              <div style="text-align:center; padding:20px; color:var(--text-tertiary); font-style:italic;">Initializing video link...</div>
            </div>
        </div>
  
        ${crossLinks.length > 0 ? `
          <h2>🔗 Connections to Other Courses</h2>
          <div class="chip-list">
            ${crossLinks.map(cl => `<div class="chip">📎 ${cl}</div>`).join('')}
          </div>` : ''}
  
        <h2>🌐 Interactive Reference Links</h2>
        <div class="chip-list" style="margin-bottom:20px;">
          <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}" target="_blank" class="chip" style="text-decoration:none; background:var(--bg-secondary); border:1px solid var(--border-color); cursor:pointer;">
            🏛️ Wikipedia: ${topic}
          </a>
          <a href="https://www.google.com/search?q=${encodeURIComponent(topic)}+study+material+notes" target="_blank" class="chip" style="text-decoration:none; background:var(--bg-secondary); border:1px solid var(--border-color); cursor:pointer;">
            🔍 Google Search: ${topic}
          </a>
          ${books.textbooks.slice(0, 2).map(b => `
            <a href="https://www.google.com/search?q=${encodeURIComponent(b.split(',')[0] + ' ' + b.split(',')[1] + ' ' + topic)}" target="_blank" class="chip" style="text-decoration:none; background:var(--bg-secondary); border:1px solid var(--border-color); cursor:pointer;">
              📖 Ref: ${b.split(',')[0]}
            </a>
          `).join('')}
        </div>

        <h2>📚 Prescribed Syllabus Textbooks</h2>
        <ul style="font-size:0.9rem; line-height:1.6; color:var(--text-secondary);">
          ${books.textbooks.map(b => `<li><strong>${b.split(',')[0]}</strong> — ${b.split(',').slice(1).join(',').trim()}</li>`).join('')}
        </ul>
        ${books.references.length > 0 ? `
          <div style="margin-top:16px;">
            <strong style="font-size:0.85rem; color:var(--text-tertiary);">Additional References:</strong>
            <ul style="font-size:0.8rem; margin-top:8px; color:var(--text-tertiary);">
              ${books.references.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>` : ''}
      </div>
      `;

    // Remove any old floating UI from body to avoid duplicates on re-renders
    document.getElementById('vidyasetu-doubt-ui')?.remove();

    // Inject the panel and FAB directly into body so position:fixed is truly viewport-relative
    const floatingUI = document.createElement('div');
    floatingUI.id = 'vidyasetu-doubt-ui';
    floatingUI.innerHTML = `
      <!-- Inline Mini Doubt Solver Panel -->
      <div id="mini-doubt-panel" style="
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 2000;
          background: var(--bg-secondary);
          border-top: 2px solid var(--accent-purple);
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -8px 32px rgba(124, 58, 237, 0.3);
          padding: 20px 20px 24px;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-height: 70vh;
          overflow-y: auto;
      ">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.4rem;">🤔</span>
            <div>
              <strong style="color:var(--text-primary); font-size:0.95rem;">AI Doubt Solver</strong>
              <div style="font-size:0.72rem; color:var(--accent-purple);">${topic.replace(/`/g, "'")} · ${course.code}</div>
            </div>
          </div>
          <button id="mini-doubt-close" style="background:none; border:none; color:var(--text-tertiary); font-size:1.4rem; cursor:pointer; line-height:1;">✕</button>
        </div>

        <textarea id="mini-doubt-input" style="
            width:100%; min-height:70px; max-height:140px;
            background:var(--bg-tertiary);
            border:1px solid var(--border-color);
            border-radius:10px;
            color:var(--text-primary);
            font-size:0.88rem;
            padding:12px;
            resize:vertical;
            font-family:inherit;
            box-sizing:border-box;
        " placeholder="Type your doubt about ${topic.replace(/`/g, "'")}..."></textarea>

        <div style="display:flex; gap:10px; margin-top:12px;">
          <button id="mini-doubt-send" class="btn btn-primary" style="flex:1; justify-content:center; padding:11px; font-size:0.9rem; border-radius:10px;">
            🚀 Solve Doubt
          </button>
          <button id="mini-doubt-clear" class="btn btn-ghost" style="padding:11px 14px; border:1px solid var(--border-color); border-radius:10px;" title="Clear">🗑️</button>
        </div>

        <div id="mini-doubt-output" style="margin-top:14px; display:none;"></div>
      </div>

      <!-- Floating AI Doubt Solver Button -->
      <button id="floating-doubt-btn" style="
          position: fixed;
          bottom: 80px;
          right: 20px;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          font-size: 28px;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.5);
          z-index: 1001;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border: 2px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          color: white;
      " title="Ask AI Doubt Solver"
        onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 20px rgba(124,58,237,0.7)';"
        onmouseout="this.style.transform='scale(1)';   this.style.boxShadow='0 4px 15px rgba(124,58,237,0.5)';"
      >🤔</button>
    `;
    document.body.appendChild(floatingUI);

    // Wire Bookmark Button
    output.querySelector('#bookmark-topic-btn')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const added = await toggleBookmark(course.code, course.title, unit.num, unit.title, topic);
      btn.dataset.bookmarked = added;
      btn.innerHTML = added ? '\u2605 Bookmarked' : '\u2606 Bookmark';
      btn.style.color = added ? 'var(--accent-amber)' : '';
    });
    if (isBookmarked(course.code, unit.num, topic)) {
      const btn = output.querySelector('#bookmark-topic-btn');
      if (btn) btn.style.color = 'var(--accent-amber)';
    }

    // Inline Doubt Solver Panel Logic  (elements now live in document.body)
    const panel = document.getElementById('mini-doubt-panel');
    const fab = document.getElementById('floating-doubt-btn');
    const closeBtn = document.getElementById('mini-doubt-close');
    const sendBtn = document.getElementById('mini-doubt-send');
    const clearBtn = document.getElementById('mini-doubt-clear');
    const input = document.getElementById('mini-doubt-input');
    const panelOutput = document.getElementById('mini-doubt-output');

    function openPanel() {
      panel.style.display = 'block';
      requestAnimationFrame(() => {
        panel.style.transform = 'translateY(0)';
      });
      input.focus();
    }
    function closePanel() {
      panel.style.transform = 'translateY(100%)';
      setTimeout(() => { panel.style.display = 'none'; }, 350);
    }

    fab?.addEventListener('click', () => {
      if (panel.style.display === 'none' || !panel.style.display) {
        openPanel();
      } else {
        closePanel();
      }
    });

    closeBtn?.addEventListener('click', closePanel);

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      panelOutput.style.display = 'none';
      panelOutput.innerHTML = '';
      input.focus();
    });

    sendBtn?.addEventListener('click', async () => {
      const question = input.value.trim();
      if (!question) return;

      sendBtn.disabled = true;
      sendBtn.innerHTML = '⏳ Solving...';
      panelOutput.style.display = 'block';
      panelOutput.innerHTML = `
        <div style="display:flex; gap:10px; align-items:center; color:var(--accent-purple); font-size:0.85rem; padding:10px; background:var(--bg-tertiary); border-radius:8px;">
          <span style="animation: spin 1s linear infinite; display:inline-block;">⚙️</span> Generating answer...
        </div>`;

      try {
        const answer = await generateContent([
          { role: 'system', content: `You are an expert university professor in ${course.title}. The student is currently studying the topic: "${topic}" from Unit ${unit.num}: "${unit.title}". Give a clear, concise, and accurate answer. Use simple math symbols only (√, ^, /, *). No LaTeX. Format with Markdown.` },
          { role: 'user', content: question }
        ]);

        // Sync with InsForge
        try {
          const { insforge, isConfigured } = await import('../lib/insforge.js');
          const user = JSON.parse(localStorage.getItem('vidyasetu_user') || 'null');
          if (isConfigured && user?.insforge_id) {
            await insforge.from('doubts').insert({
              user_id: user.insforge_id,
              topic: topic,
              question: question,
              answer: answer
            });
            console.log('✅ Mini Doubt synced to InsForge cloud.');
          }
        } catch (err) {
          console.error('❌ Mini Doubt Sync Error:', err);
        }

        const parsed = typeof marked !== 'undefined' ? marked.parse(answer || 'No response.') : (answer || 'No response.');
        panelOutput.innerHTML = `
          <div style="background:var(--bg-tertiary); border:1px solid var(--accent-purple-dim); border-radius:12px; padding:16px; font-size:0.88rem; line-height:1.7; color:var(--text-primary);">
            <div style="font-size:0.72rem; color:var(--accent-purple); margin-bottom:10px; font-weight:600;">AI ANSWER</div>
            ${parsed}
          </div>`;
      } catch (err) {
        panelOutput.innerHTML = `<div style="color:var(--accent-rose); font-size:0.85rem; padding:10px;">⚠️ Failed to get answer. Please try again.</div>`;
      } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '🚀 Solve Doubt';
      }
    });

    // Allow Ctrl+Enter to send
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) sendBtn?.click();
    });

    setTimeout(() => {
      if (window.mermaid) {
        try {
          window.mermaid.run({ querySelector: '.mermaid', suppressErrors: true });
        } catch (e) {
          console.warn("Mermaid re-render suppressed:", e);
        }
      }
      renderVisuals();
    }, 200);
  }

  // 1. START GENERATION PROCESS
  (async () => {
    if (useAI) {
      const isAdvanced = level === 'advanced_level';
      const prompt = isAdvanced
        ? `Generate comprehensive GATE/advanced-level academic notes for the topic: "${topic}" in the course "${course.title}".
Include:
- Precise technical definition with mathematical rigour
- Full derivation from first principles, with each step explained
- Key theorems, proofs, or laws related to this topic
- Industrial and real-world engineering applications (3-4 specific examples)

### Solved Example Problems (Easy to Advanced — 4 to 5 problems)
Provide exactly **5 solved numerical/conceptual problems** in increasing difficulty:
  1. **Problem 1 (Easy – 2 marks):** A basic definitional or substitution problem. Show full working.
  2. **Problem 2 (Moderate – 4 marks):** Requires applying the formula with standard values. Show full working.
  3. **Problem 3 (Intermediate – 6 marks):** Multi-step derivation or application. Show complete solution with explanation.
  4. **Problem 4 (Hard – 8 marks):** Combines two or more concepts. Requires analytical thinking. Show full working.
  5. **Problem 5 (GATE-Level – 10 marks):** Complex problem involving edge cases, special conditions, or proof. Show rigorous solution.

- Common university exam questions (2m, 6m, 10m formats)
- Special cases, boundary conditions, and assumptions
Use simple math symbols only (e.g., √ for square root, ^ for power, / for fraction). Do NOT use LaTeX. Format in standard Markdown.`
        : `Generate comprehensive academic notes for the topic: "${topic}" in the course "${course.title}". 
Include:
- Detailed definition and conceptual overview
- **Industrial and Real-World Applications** (Provide 3-4 specific examples of where this is used in modern technology or engineering)
- Key mathematical formulas with thorough variable explanations
- Core working principles or scientific theories
- 2-3 step-by-step solved derivation points or logical proofs
- Common exam questions (2m, 6m, 10m formats)
Use professional PSG Tech level technical language. Format using standard Markdown (### for headings, ** for bold, - for lists). Do NOT use HTML tags.`;

      try {
        // Fetch text notes in background
        (async () => {
          try {
            if (output.dataset.currentTopic === topic) renderFullUI(skeletonNotes, [], [], [], true, "Generating notes with Pollinations AI...");

            const groundedSystemPrompt = `You are a university professor. Provide deep, structured academic notes for PSG Tech curriculum. 
Use proper mathematical unicode symbols (like √, x², ÷) or format equations clearly using simple text (like a/b). Do NOT use markdown LaTeX formatting (no $ or $$).`;

            const aiResult = await generateContent([
              { role: "system", content: groundedSystemPrompt },
              { role: "user", content: prompt }
            ], {
              onProgress: (status) => {
                const title = output.querySelector('#gen-status-title');
                const progress = output.querySelector('#gen-progress-bar');
                const percent = output.querySelector('#gen-progress-percent');
                if (title) title.innerText = status;
                if (progress) progress.style.width = '45%';
                if (percent) percent.innerText = '45%';
              }
            });

            if (aiResult) {
              let sanitized = aiResult.trim();
              sanitized = sanitized.replace(/^```(markdown|html|text)?\n?/i, '').replace(/\n?```$/i, '');
              notesHTML = typeof marked !== 'undefined' ? marked.parse(sanitized) : sanitized;
            } else {
              throw new Error("Empty AI result");
            }
          } catch (e) {
            console.error("[Notes] Pollinations error:", e);
            notesHTML = `<div class="callout callout-error"><div class="callout-icon">⚠️</div><div><strong>Pollinations AI Service Unavailable</strong><p>${e.message}</p></div></div>`;
          }
          if (output.dataset.currentTopic === topic) renderFullUI(notesHTML, aiDiagrams, aiScientificGraphs, aiRealWorldImgUrls, true, null);
        })();

        // === VISUAL GENERATION: Multi-Source Pipeline (Pollinations AI + Wikipedia) ===
        const generatePollinationsUrl = (prompt) => {
          const seed = Math.floor(Math.random() * 999999);
          return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}&width=800&height=600&nologo=true&seed=${seed}`;
        };

        // 1. Initial Quick Load with Diversified Pollinations AI prompts
        aiScientificGraphs = [
          generatePollinationsUrl(`Detailed scientific mathematical graph of ${topic}, labeled X and Y axes, precise curve, academic textbook style, white background`),
          generatePollinationsUrl(`Annotated technical schematic for ${topic}, industrial engineering drawing, high contrast, clean blueprint style`),
          generatePollinationsUrl(`3D mathematical model visualization of ${topic}, scientific representation, professional diagram`)
        ];

        aiRealWorldImgUrls = [
          generatePollinationsUrl(`Industrial application of ${topic} in modern engineering, factory machinery, technical context, high resolution`),
          generatePollinationsUrl(`${topic} being implemented in a laboratory setting, scientific research equipment, realistic photo`),
          generatePollinationsUrl(`Real-world engineering infrastructure related to ${topic}, high detail technical photography`)
        ];

        if (output.dataset.currentTopic === topic)
          renderFullUI(notesHTML, aiDiagrams, aiScientificGraphs, aiRealWorldImgUrls, true);

        // 2. Enhance with Wikipedia/Commons (High Reliability)
        fetchWikipediaResources(topic, 10).then(wikiRes => {
          if (output.dataset.currentTopic !== topic) return;
          const wikiDiagrams = wikiRes.diagrams || [];
          const wikiPhotos = wikiRes.photos || [];

          // Merge Wikipedia resources into the arrays (prioritize real images)
          if (wikiDiagrams.length > 0) {
            aiScientificGraphs = [...wikiDiagrams.slice(0, 3), ...aiScientificGraphs].slice(0, 4);
          }
          if (wikiPhotos.length > 0) {
            aiRealWorldImgUrls = [...wikiPhotos.slice(0, 3), ...aiRealWorldImgUrls].slice(0, 4);
          } else if (wikiDiagrams.length > 3) {
            // Use extra diagrams as industrial illustrations if no photos available
            aiRealWorldImgUrls = [...wikiDiagrams.slice(3, 6), ...aiRealWorldImgUrls].slice(0, 4);
          }

          const progress = output.querySelector('#gen-progress-bar');
          if (progress) progress.style.width = '90%';
          renderFullUI(notesHTML, aiDiagrams, aiScientificGraphs, aiRealWorldImgUrls, false);
        }).catch(() => {
          if (output.dataset.currentTopic === topic) {
            const progress = output.querySelector('#gen-progress-bar');
            if (progress) progress.style.width = '90%';
            renderFullUI(notesHTML, aiDiagrams, aiScientificGraphs, aiRealWorldImgUrls, false);
          }
        });

        // 3. Independent Mermaid Generation (Guaranteed Fallback)
        generateMermaid(`${topic} concept map`).then(d => {
          if (!d || output.dataset.currentTopic !== topic) return;
          aiDiagrams = [d.replace(/```mermaid\n?|```/g, '').trim()];
          renderFullUI(notesHTML, aiDiagrams, aiScientificGraphs, aiRealWorldImgUrls, true);
        }).catch(() => {
          aiDiagrams = [`graph TD\nA["${topic}"] --> B["Core Concepts"]\nB --> C["Theory"]\nB --> D["Real-World Applications"]\nC --> E["Formulas & Derivations"]\nD --> F["Engineering Use Cases"]`];
          if (output.dataset.currentTopic === topic)
            renderFullUI(notesHTML, aiDiagrams, aiScientificGraphs, aiRealWorldImgUrls, true);
        });

      } catch (err) {
        console.error("Critical error in generateNotes:", err);
      }
    } else {
      // Local mode
      notesHTML = generateLocalNotes(course, unit, topic, level);
      renderFullUI(notesHTML, [], null, [], false);
    }
  })();
}

// Visual generation utilities removed as AI visuals handle this now.



export function renderVisuals() {
  document.querySelectorAll('.visual-slot').forEach(slot => {
    const query = slot.dataset.query;
    const type = slot.dataset.type;

    if (type === 'video') {
      const ytQ = encodeURIComponent(query + ' lecture explanation');
      const ytUrl = `https://www.youtube.com/results?search_query=${ytQ}`;
      slot.innerHTML = `
        <div style="border-radius:12px; overflow:hidden; border:1px solid var(--border-color); background:var(--bg-tertiary);">
          <a href="${ytUrl}" target="_blank"
             style="display:flex; align-items:center; gap:14px; padding:14px 16px; background:linear-gradient(135deg,#ff000022,#ff000011); text-decoration:none; border-bottom:1px solid var(--border-color);">
            <div style="font-size:2.5rem; flex-shrink:0;">▶</div>
            <div>
              <div style="font-weight:700; font-size:0.95rem; color:#fc8174;">Watch on YouTube</div>
              <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">${query.substring(0, 60)} — educational lecture</div>
            </div>
          </a>
          <div style="display:flex; gap:10px; padding:12px 16px;">
            <a href="${ytUrl}" target="_blank"
               style="flex:1; text-align:center; padding:10px; background:#ff0000; color:#fff; border-radius:8px; text-decoration:none; font-size:0.85rem; font-weight:600;">
              ▶ Search YouTube
            </a>
            <a href="https://www.google.com/search?q=${encodeURIComponent(query)}+site:youtube.com" target="_blank"
               style="flex:1; text-align:center; padding:10px; background:var(--bg-secondary); color:var(--text-primary); border-radius:8px; text-decoration:none; font-size:0.85rem; border:1px solid var(--border-color);">
              🔍 Google Videos
            </a>
          </div>
        </div>`;
    }
  });
}

