import { regulations2024 } from '../data/regulations.js';

// Dashboard Component
export function renderDashboard(container, { allSemesters, getStats, setMode, user }) {
  const stats = getStats();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  function showRegulations() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop animate-fade';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;';

    modal.innerHTML = `
      <div class="card-premium animate-slide" style="max-width:800px; width:100%; max-height:90vh; overflow-y:auto; padding:32px; position:relative;">
        <button id="close-reg" class="btn btn-ghost" style="position:absolute; top:20px; right:20px; font-size:1.5rem;">✕</button>
        <h2 style="font-size:1.8rem; margin-bottom:8px; color:var(--accent-cyan);">${regulations2024.title}</h2>
        <p style="font-size:0.9rem; color:var(--text-tertiary); margin-bottom:24px;">${regulations2024.institution}</p>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:32px;">
          <div class="card" style="background:var(--bg-tertiary);">
            <h4 style="color:var(--accent-purple); margin-bottom:12px;">Theory Assessment</h4>
            <div style="font-size:0.85rem; display:flex; justify-content:space-between;"><span>Continuous (CA)</span> <strong>${regulations2024.assessmentTheory.ca}%</strong></div>
            <div style="font-size:0.85rem; display:flex; justify-content:space-between;"><span>Final (FE)</span> <strong>${regulations2024.assessmentTheory.fe}%</strong></div>
            <p style="font-size:0.75rem; margin-top:8px; color:var(--text-tertiary);">Min FE: ${regulations2024.assessmentTheory.passingMinFE}% | Total: ${regulations2024.assessmentTheory.passingMinTotal}%</p>
          </div>
          <div class="card" style="background:var(--bg-tertiary);">
            <h4 style="color:var(--accent-rose); margin-bottom:12px;">Lab Assessment</h4>
            <div style="font-size:0.85rem; display:flex; justify-content:space-between;"><span>Continuous (CA)</span> <strong>${regulations2024.assessmentLab.ca}%</strong></div>
            <div style="font-size:0.85rem; display:flex; justify-content:space-between;"><span>Final (FE)</span> <strong>${regulations2024.assessmentLab.fe}%</strong></div>
            <p style="font-size:0.75rem; margin-top:8px; color:var(--text-tertiary);">Total: ${regulations2024.assessmentLab.passingMinTotal}% (Absolute)</p>
          </div>
        </div>

        <h3 style="font-size:1.1rem; margin-bottom:16px;">Absolute Grading Scales</h3>
        <div class="card" style="padding:0; overflow:hidden;">
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
            <thead style="background:var(--bg-tertiary); text-align:left;">
              <tr>
                <th style="padding:12px;">Grade</th>
                <th style="padding:12px;">Range</th>
                <th style="padding:12px;">Points</th>
                <th style="padding:12px;">Result</th>
              </tr>
            </thead>
            <tbody>
              ${regulations2024.gradingSystem.scales.map(s => `
                <tr style="border-bottom:1px solid var(--border-color);">
                  <td style="padding:12px; font-weight:800; color:var(--accent-cyan);">${s.grade}</td>
                  <td style="padding:12px;">${s.range}</td>
                  <td style="padding:12px;">${s.points}</td>
                  <td style="padding:12px; color:var(--text-secondary);">${s.result}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <h3 style="font-size:1.1rem; margin:24px 0 16px;">Curriculum Structure (139 Total Credits)</h3>
        <div class="chip-list">
          ${regulations2024.curriculumStructure.categories.map(c => `
            <div class="chip" style="padding:10px 14px;">
              <span style="color:var(--accent-purple); font-weight:700;">${c.code}:</span> ${c.name} (${c.credits}c)
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#close-reg').onclick = () => {
      modal.classList.add('animate-fade-out');
      setTimeout(() => modal.remove(), 300);
    };
  }

  container.innerHTML = `
    <div class="animate-fade">
      <div class="dashboard-hero card-glass animate-float" style="margin-bottom: 32px; position: relative; overflow: hidden;">
        <div class="bg-blur blur-cyan"></div>
        <div class="bg-blur blur-purple"></div>
        <div style="display:flex; align-items:center; gap:16px; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; background: var(--gradient-primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: var(--shadow-glow-cyan);">
                ${user?.avatar || '🎓'}
            </div>
            <div>
                <span class="badge badge-cyan" style="margin-bottom: 4px;">${greeting}, ${user?.name?.split(' ')[0] || 'Scholar'}</span>
                <div style="font-size: 0.8rem; color: var(--text-tertiary);">PSG Tech · ${user?.dept || '2024 Regulation'}</div>
            </div>
        </div>
        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.02em;">Vidyasetu</h1>
        <p style="font-size: 1.1rem; color: var(--text-secondary); max-width: 700px; line-height: 1.6; margin-bottom: 32px;">
          Your academic companion for PSG Tech students. Mapped to 2024 Regulations with study material and lab assistance.
        </p>
        <div style="display:flex; gap:16px; flex-wrap:wrap;">
          <button class="btn btn-primary btn-lg hover-glow" onclick="window._setMode('topic_notes_pdf')">
            <span>📚</span> View Study Material
          </button>
          <button id="view-reg-btn" class="btn btn-secondary btn-lg hover-glow">
            <span>📜</span> 2024 Regulations
          </button>
        </div>
      </div>

      <div class="dashboard-stats animate-slide" style="margin-bottom: 40px;">
        <div class="card stat-card hover-glow">
          <div class="stat-value">${stats.semesters}</div>
          <div class="stat-label">Semesters</div>
        </div>
        <div class="card stat-card stagger-1 hover-glow">
          <div class="stat-value">${stats.totalCourses}</div>
          <div class="stat-label">Courses</div>
        </div>
        <div class="card stat-card stagger-2 hover-glow">
          <div class="stat-value">${regulations2024.curriculumStructure.totalCredits}</div>
          <div class="stat-label">Min Credits</div>
        </div>
        <div class="card stat-card stagger-3 hover-glow">
          <div class="stat-value">${stats.totalTopics}+</div>
          <div class="stat-label">Topics</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <h2 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:0;">Explore Study Modes</h2>
        <span style="font-size: 0.8rem; color: var(--text-tertiary);">6 Modules Available</span>
      </div>

      <div class="mode-cards animate-slide">
        ${[
      { mode: 'topic_notes_pdf', icon: '📚', color: 'cyan', title: 'Study Material', desc: 'Syllabus-aligned notes with derivations and practice sets.' },
      { mode: 'exam_planner', icon: '📊', color: 'emerald', title: 'Exam Planner', desc: 'Unit weightages and high-yield revision strategies.' },
      { mode: 'lab_helper', icon: '🔬', color: 'rose', title: 'Lab Helper', desc: 'Interactive guides for all physics and chemistry experiments.' },
      { mode: 'doubt_solver', icon: '🤔', color: 'purple', title: 'Doubt Solver', desc: 'AI-powered instant doubt resolution for complex physics & math.' },
      { mode: 'real_world_visual', icon: '🌎', color: 'cyan', title: 'Real-World', desc: 'See concept applications in industry with AI visualization.' },
      { mode: 'user_notes', icon: '📁', color: 'orange', title: 'My Library', desc: 'Cloud-synced space for your own notes and bookmarks.' }
    ].map((m, i) => `
          <div class="card-premium mode-card stagger-${i + 1}" onclick="window._setMode('${m.mode}')">
            <div class="card-header">
              <div class="card-icon ${m.color}" style="font-size: 1.5rem;">${m.icon}</div>
              <div>
                <div class="card-title">${m.title}</div>
              </div>
            </div>
            <div class="card-desc" style="margin-top: 8px;">${m.desc}</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 48px;">
        <div class="card-premium">
            <h3 style="font-size: 1rem; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                <span style="color: var(--accent-purple);">⭐</span> Quick Access
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div class="course-link" style="padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; border: none; width: 100%; text-align: left;">
                    <span>Continue: Engineering Physics</span>
                    <span class="badge badge-purple">Unit 3</span>
                </div>
                <div class="course-link" style="padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; border: none; width: 100%; text-align: left;">
                    <span>Up Next: Calculus</span>
                    <span class="badge badge-cyan">Unit 1</span>
                </div>
            </div>
        </div>
        <div class="card-premium">
            <h3 style="font-size: 1rem; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                <span style="color: var(--accent-emerald);">📈</span> Your Activity
            </h3>
            <div style="height: 100px; display: flex; align-items: flex-end; gap: 8px; padding-bottom: 8px;">
                ${[40, 70, 45, 90, 65, 80, 50].map(h => `<div style="flex: 1; height: ${h}%; background: var(--gradient-primary); border-radius: 4px; opacity: 0.8;"></div>`).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-tertiary);">
                <span>MON</span><span>WED</span><span>FRI</span><span>SUN</span>
            </div>
        </div>
      </div>

      <h2 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin-bottom:20px;">Browse Semesters</h2>
      <div class="semester-cards animate-slide">
        ${allSemesters.map((sem, i) => `
          <div class="card semester-card stagger-${i + 1}" onclick="window._openSemester('${sem.num}')">
            <div class="sem-num">${sem.num}</div>
            <div class="sem-label">${sem.label}</div>
            <div class="sem-courses">${sem.courses.length} courses</div>
          </div>
        `).join('')}
      </div>

      <div class="callout callout-info animate-slide" style="margin-top:40px; margin-bottom:40px;">
        <div class="callout-icon">💡</div>
        <div><strong>Pro tip:</strong> Use the search bar in the sidebar to instantly find any topic. Explore the "Lab Helper" for interactive experiment guides.</div>
      </div>
    </div>
  `;

  window._setMode = setMode;
  document.getElementById('view-reg-btn').onclick = showRegulations;

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
