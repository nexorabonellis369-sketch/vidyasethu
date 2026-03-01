// Dashboard Component
export function renderDashboard(container, { allSemesters, getStats, setMode }) {
  const stats = getStats();
  container.innerHTML = `
    <div class="animate-fade">
      <div class="dashboard-hero">
        <h1>BSc Applied Science Companion</h1>
        <p>Your AI-powered academic companion for PSG College of Technology · 2024 Regulations. Get topic notes, solve doubts, plan your exams, and explore real-world applications — all mapped to your official syllabus.</p>
        <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="window._setMode('doubt_solver')">🧠 Ask a Doubt</button>
          <button class="btn btn-secondary" onclick="window._setMode('topic_notes_pdf')">📝 Get Topic Notes</button>
          <button class="btn btn-secondary" onclick="window._setMode('exam_planner')">📊 Plan Exam</button>
        </div>
      </div>

      <div class="dashboard-stats animate-slide">
        <div class="card stat-card">
          <div class="stat-value">${stats.semesters}</div>
          <div class="stat-label">Semesters</div>
        </div>
        <div class="card stat-card stagger-1">
          <div class="stat-value">${stats.totalCourses}</div>
          <div class="stat-label">Courses</div>
        </div>
        <div class="card stat-card stagger-2">
          <div class="stat-value">139</div>
          <div class="stat-label">Min Credits</div>
        </div>
        <div class="card stat-card stagger-3">
          <div class="stat-value">${stats.totalTopics}+</div>
          <div class="stat-label">Topics</div>
        </div>
        <div class="card stat-card stagger-4">
          <div class="stat-value">6</div>
          <div class="stat-label">Study Modes</div>
        </div>
        <div class="card stat-card stagger-5">
          <div class="stat-value">40+</div>
          <div class="stat-label">Electives</div>
        </div>
      </div>

      <h2 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin-bottom:14px;">Study Modes</h2>
      <div class="mode-cards animate-slide">
        ${[
      { mode: 'topic_notes_pdf', icon: '📝', color: 'cyan', title: 'Topic Notes Generator', desc: 'Get structured notes, formulas, derivations, solved examples and practice problems for any topic.' },
      { mode: 'doubt_solver', icon: '🧠', color: 'purple', title: 'AI Doubt Solver', desc: 'Ask any question and get a syllabus-aligned step-by-step solution with exam tips.' },
      { mode: 'user_notes', icon: '📁', color: 'orange', title: 'My Personal Notes', desc: 'Securely upload your own PDFs, images and media files perfectly organized by subject.' },
      { mode: 'real_world_visual', icon: '🌍', color: 'amber', title: 'Real-World Applications', desc: 'See where each concept is used in industry, devices, and everyday phenomena.' },
      { mode: 'exam_planner', icon: '📊', color: 'emerald', title: 'Exam Planner', desc: 'Get unit weightages, high-yield topics, and a 7/14/30-day revision strategy.' },
      { mode: 'lab_helper', icon: '🔬', color: 'rose', title: 'Lab Helper', desc: 'Full experiment guides: aim, apparatus, theory, procedure, calculations, viva Q&A.' }
    ].map((m, i) => `
          <div class="card mode-card stagger-${i + 1}" onclick="window._setMode('${m.mode}')">
            <div class="card-header">
              <div class="card-icon ${m.color}">${m.icon}</div>
              <div>
                <div class="card-title">${m.title}</div>
              </div>
            </div>
            <div class="card-desc">${m.desc}</div>
          </div>
        `).join('')}
      </div>

      <h2 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin:24px 0 14px;">Browse Semesters</h2>
      <div class="semester-cards animate-slide">
        ${allSemesters.map((sem, i) => `
          <div class="card semester-card stagger-${i + 1}" onclick="window._openSemester('${sem.num}')">
            <div class="sem-num">${sem.num}</div>
            <div class="sem-label">${sem.label}</div>
            <div class="sem-courses">${sem.courses.length} courses</div>
          </div>
        `).join('')}
      </div>

      <h2 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin:24px 0 14px;">Assessment Pattern</h2>
      <div class="grid-2 animate-slide">
        <div class="card">
          <div class="card-header">
            <div class="card-icon cyan">📋</div>
            <div class="card-title">Theory Courses</div>
          </div>
          <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.8;">
            <div>CA (40%) = Assignment (8) + Quiz×2 (12) + Tests avg (30)</div>
            <div>FE (60%) = Semester-end exam (100 scaled to 60)</div>
            <div style="margin-top:8px;color:var(--accent-cyan);font-weight:600;">Pass: ≥45% in FE + ≥50% total</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-icon rose">🧪</div>
            <div class="card-title">Laboratory Courses</div>
          </div>
          <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.8;">
            <div>CA (60%) = Lab Test I (30) + Lab Test II (30)</div>
            <div>FE (40%) = Lab exam (25) + Viva Voce (15)</div>
            <div style="margin-top:8px;color:var(--accent-rose);font-weight:600;">Absolute grading system</div>
          </div>
        </div>
      </div>

      <h2 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin:24px 0 14px;">2024 Absolute Grading System</h2>
      <div class="card animate-slide" style="padding:16px; margin-bottom:20px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:space-between;">
              <div style="text-align:center;"><div style="color:var(--accent-purple);font-weight:700;font-size:1.1rem;">O (10)</div><div style="font-size:0.8rem;color:var(--text-secondary);">91 - 100</div></div>
              <div style="text-align:center;"><div style="color:var(--accent-cyan);font-weight:700;font-size:1.1rem;">A+ (9)</div><div style="font-size:0.8rem;color:var(--text-secondary);">81 - 90</div></div>
              <div style="text-align:center;"><div style="color:var(--accent-emerald);font-weight:700;font-size:1.1rem;">A (8)</div><div style="font-size:0.8rem;color:var(--text-secondary);">71 - 80</div></div>
              <div style="text-align:center;"><div style="color:var(--accent-amber);font-weight:700;font-size:1.1rem;">B+ (7)</div><div style="font-size:0.8rem;color:var(--text-secondary);">61 - 70</div></div>
              <div style="text-align:center;"><div style="color:var(--accent-orange);font-weight:700;font-size:1.1rem;">B (6)</div><div style="font-size:0.8rem;color:var(--text-secondary);">56 - 60</div></div>
              <div style="text-align:center;"><div style="color:var(--text-primary);font-weight:700;font-size:1.1rem;">C (5)</div><div style="font-size:0.8rem;color:var(--text-secondary);">50 - 55</div></div>
              <div style="text-align:center;"><div style="color:var(--accent-rose);font-weight:700;font-size:1.1rem;">RA (0)</div><div style="font-size:0.8rem;color:var(--text-secondary);">&lt; 50</div></div>
          </div>
      </div>

      <div class="callout callout-info animate-slide" style="margin-top:20px;">
        <div class="callout-icon">💡</div>
        <div><strong>Pro tip:</strong> Use the search bar at the top of the sidebar to instantly find any topic across all 6 semesters. Try searching "Green's theorem", "Bernoulli", "Stack", or "Zeeman".</div>
      </div>
    </div>
  `;

  window._setMode = setMode;
  window._openSemester = (num) => {
    const toggle = document.querySelector(`.semester-toggle[data-sem="${num}"]`);
    if (toggle) {
      toggle.classList.add('open');
      const courses = document.querySelector(`[data-sem-courses="${num}"]`);
      if (courses) courses.classList.add('open');
      toggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
}
