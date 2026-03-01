// Real World Visualisation Component
export function renderRealWorld(container, { allSemesters, selectedCourse, getCourseByCode }) {

  container.innerHTML = `
    <div class="animate-fade">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-icon amber">🌍</div>
          <div>
            <div class="card-title">Real-World Applications</div>
            <div class="card-desc">Discover how each syllabus concept is used in real-world industries, devices and phenomena.</div>
          </div>
        </div>
        <div class="form-group" style="margin-top:14px;">
          <label class="form-label">Select Course</label>
          <select id="rw-course" class="form-select">
            <option value="">— Select Course —</option>
            ${allSemesters.map(sem => `
              <optgroup label="${sem.label}">
                ${sem.courses.filter(c => c.units).map(c => `
                  <option value="${c.code}" ${selectedCourse && selectedCourse.code === c.code ? 'selected' : ''}>${c.code} – ${c.title}</option>
                `).join('')}
              </optgroup>
            `).join('')}
          </select>
        </div>
        <button id="rw-generate" class="btn btn-primary">🌍 Show Applications</button>
      </div>
      <div id="rw-output"></div>
    </div>
  `;

  const select = document.getElementById('rw-course');
  const btn = document.getElementById('rw-generate');
  const output = document.getElementById('rw-output');

  if (selectedCourse) select.value = selectedCourse.code;

  btn.addEventListener('click', () => {
    const code = select.value;
    if (!code) return;
    const course = getCourseByCode(code);
    if (course) renderApplications(output, course);
  });

  // Auto-load if a course is already selected
  if (selectedCourse) {
    const course = getCourseByCode(selectedCourse.code);
    if (course) renderApplications(output, course);
  }
}

async function renderApplications(output, course) {
  const units = course.units ? course.units.map(u => u.title).join(', ') : course.title;

  output.innerHTML = `
      <div class="card" style="padding:20px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="skeleton" style="width:32px;height:32px;border-radius:50%;flex-shrink:0;"></div>
          <div>
            <strong style="color:var(--text-primary);">🤖 AI is researching real-world applications…</strong>
            <div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:4px;">Generating industry examples for ${course.title}</div>
          </div>
        </div>
      </div>`;

  const prompt = `You are an expert science and engineering educator. Generate 4-5 rich, specific, real-world industry applications for the BSc Applied Science course: "${course.code} – ${course.title}".

The course covers these topics: ${units}

For each application, output a JSON array. Each item must have these exact fields:
- "field": Industry/domain name (e.g. "Aerospace Engineering", "Medical Imaging")
- "icon": A single relevant emoji
- "color": one of: cyan | purple | amber | rose | green
- "badgeColor": same as color
- "topic": The specific course topic it uses (e.g. "Faraday's Law / Inductance")
- "description": 2-3 sentences explaining precisely HOW this course concept is applied. Be specific and technical.
- "techUsed": Array of 3 real tools/technologies (e.g. ["ANSYS FEM", "MATLAB", "Finite Element Method"])
- "ascii": (optional) A simple 4-6 line ASCII diagram. Use box-drawing chars ─│┌┐└┘.

Output ONLY a valid JSON array. No markdown, no explanation. Start with [ and end with ].`;

  const GEMINI_KEY = "AIzaSyBxkr2pIizg7eLOo5GmWHLj329uJQPwtyw";
  let apps = null;

  // Tier 1: puter.js — Claude 3.7 Sonnet → GPT-4o → Claude 3.5 → GPT-4o-mini
  const puterModels = ['claude-3-7-sonnet', 'gpt-4o', 'claude-3-5-sonnet', 'gpt-4o-mini'];
  for (const model of puterModels) {
    try {
      if (typeof puter !== 'undefined' && puter.ai) {
        const resp = await puter.ai.chat([
          { role: 'system', content: 'You are a precise JSON generator. Output ONLY valid JSON arrays, no markdown, no explanation.' },
          { role: 'user', content: prompt }
        ], { model });
        const text = resp?.message?.content || resp?.content || (typeof resp === 'string' ? resp : '');
        if (text) {
          const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
          const match = clean.match(/\[[\s\S]*\]/);
          if (match) { apps = JSON.parse(match[0]); break; }
        }
      }
    } catch (e) { /* try next */ }
  }

  // Tier 2: Gemini API
  if (!apps) {
    for (const model of ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite']) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 2000 }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
          const match = clean.match(/\[[\s\S]*\]/);
          if (match) { apps = JSON.parse(match[0]); break; }
        }
      } catch (e) { /* try next */ }
    }
  }

  if (!apps || !apps.length) {
    output.innerHTML = `<div class="card" style="padding:20px;color:var(--accent-rose);">⚠️ Could not generate applications. Please try again in a moment.</div>`;
    return;
  }

  output.innerHTML = `
    <div class="animate-slide">
      <h2 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin-bottom:16px;">Real-World Applications of ${course.code} – ${course.title}</h2>
      ${apps.map((app, i) => `
        <div class="card stagger-${(i % 6) + 1}" style="margin-bottom:14px;">
          <div class="card-header">
            <div class="card-icon ${app.color || 'cyan'}">${app.icon || '🔬'}</div>
            <div>
              <div class="card-title">${app.field}</div>
              <div class="badge badge-${app.badgeColor || 'cyan'}" style="margin-top:4px;">${app.topic}</div>
            </div>
          </div>
          <div class="scenario-body" style="margin-top:8px;">${app.description}</div>
          ${app.ascii ? `<div class="ascii-diagram" style="margin-top:10px;">${app.ascii}</div>` : ''}
          ${app.techUsed ? `<div class="chip-list" style="margin-top:10px;">${app.techUsed.map(t => `<span class="chip">🔧 ${t}</span>`).join('')}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}
