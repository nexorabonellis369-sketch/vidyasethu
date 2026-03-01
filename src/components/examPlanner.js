// Exam Planner Component
export function renderExamPlanner(container, { allSemesters, selectedCourse, getCourseByCode, getTextbookRef }) {
  container.innerHTML = `
    <div class="animate-fade">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-icon emerald">📊</div>
          <div>
            <div class="card-title">Exam Planner</div>
            <div class="card-desc">Get exam strategy, unit weightages, high-yield topics, and a daily revision plan.</div>
          </div>
        </div>
        <div class="grid-2" style="margin-top:14px;">
          <div class="form-group">
            <label class="form-label">Course</label>
            <select id="ep-course" class="form-select">
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
          <div class="form-group">
            <label class="form-label">Days Until Exam</label>
            <select id="ep-days" class="form-select">
              <option value="7">7 days (Intensive)</option>
              <option value="14" selected>14 days (Standard)</option>
              <option value="30">30 days (Comprehensive)</option>
            </select>
          </div>
        </div>
        <button id="ep-generate" class="btn btn-primary">📊 Generate Plan</button>
      </div>
      <div id="ep-output"></div>
    </div>
  `;

  if (selectedCourse) document.getElementById('ep-course').value = selectedCourse.code;

  document.getElementById('ep-generate').addEventListener('click', () => {
    const code = document.getElementById('ep-course').value;
    const days = parseInt(document.getElementById('ep-days').value);
    const course = getCourseByCode(code);
    if (course) renderPlan(document.getElementById('ep-output'), course, days, getTextbookRef);
  });
}

function renderPlan(output, course, days, getTextbookRef) {
  const texts = getTextbookRef(course.code);
  const units = course.units || [];
  const weights = getUnitWeights(course.code);
  const highYield = getHighYieldTopics(course.code);
  const plan = generateRevisionPlan(units, days);

  output.innerHTML = `
    <div class="animate-slide">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-icon emerald">📋</div>
          <div class="card-title">${course.code} – ${course.title}</div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
          <div class="badge badge-cyan">CA: ${course.ca}% | FE: ${course.fe}%</div>
          <div class="badge badge-emerald">${days}-Day Plan</div>
          <div class="badge badge-amber">Pass: ≥45% FE + ≥50% Total</div>
        </div>
      </div>

      <div class="planner-grid">
        <div>
          <h2 style="font-size:0.95rem;font-weight:700;color:var(--text-primary);margin-bottom:14px;">📈 Unit Weightages (Expected)</h2>
          <div class="card">
            ${units.map((u, i) => {
    const w = weights[i] || Math.round(100 / units.length);
    return `<div class="unit-weight-bar">
                <div class="unit-weight-label" title="Unit ${u.num}: ${u.title}">Unit ${u.num}</div>
                <div class="unit-weight-track"><div class="unit-weight-fill" style="width:${w}%"></div></div>
                <div class="unit-weight-pct">${w}%</div>
              </div>`;
  }).join('')}
          </div>
        </div>
        <div>
          <h2 style="font-size:0.95rem;font-weight:700;color:var(--text-primary);margin-bottom:14px;">⭐ High-Yield Topics</h2>
          <div class="card">
            ${highYield.map(h => `
              <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-color);">
                <span class="badge badge-${h.priority === 'Must' ? 'rose' : h.priority === 'High' ? 'amber' : 'cyan'}">${h.priority}</span>
                <div>
                  <div style="font-size:0.82rem;color:var(--text-primary);font-weight:500;">${h.topic}</div>
                  <div style="font-size:0.72rem;color:var(--text-tertiary);">Unit ${h.unit} · ${h.marks}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <h2 style="font-size:0.95rem;font-weight:700;color:var(--text-primary);margin:20px 0 14px;">📅 ${days}-Day Revision Plan</h2>
      <div class="card" style="overflow-x:auto;">
        <table class="revision-table">
          <thead>
            <tr>
              <th>Day(s)</th>
              <th>Focus Area</th>
              <th>Key Topics</th>
              <th>Resources</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            ${plan.map(row => `
              <tr>
                <td style="white-space:nowrap;"><strong>${row.day}</strong></td>
                <td><span class="badge badge-${row.color}">${row.focus}</span></td>
                <td style="font-size:0.8rem;">${row.topics}</td>
                <td style="font-size:0.78rem;color:var(--text-tertiary);">${row.resources}</td>
                <td style="font-size:0.8rem;color:var(--accent-emerald);">${row.target}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="grid-2" style="margin-top:20px;">
        <div class="card">
          <div style="font-size:0.88rem;font-weight:600;color:var(--text-primary);margin-bottom:8px;">📖 Textbooks</div>
          ${texts.textbooks.map(b => `<div style="font-size:0.78rem;color:var(--text-secondary);margin:4px 0;padding-left:10px;border-left:2px solid var(--accent-cyan);">${b}</div>`).join('')}
        </div>
        <div class="card">
          <div style="font-size:0.88rem;font-weight:600;color:var(--text-primary);margin-bottom:8px;">⚡ Exam Day Strategy</div>
          <ul style="font-size:0.8rem;color:var(--text-secondary);padding-left:16px;line-height:1.8;">
            <li>Attempt all 10 Part A (2-mark) questions first</li>
            <li>Choose 8 of 10 Part B (13-mark) questions</li>
            <li>Start with your strongest unit</li>
            <li>Spend max 15 min on each 13-mark question</li>
            <li>Show all steps — partial marks are awarded</li>
          </ul>
        </div>
      </div>

      <div class="callout callout-success" style="margin-top:16px;">
        <div class="callout-icon">✅</div>
        <div><strong>Quick self-test:</strong> After each study session, close your notes and write out 3 key definitions and 1 formula from memory. This is the single most effective exam preparation technique.</div>
      </div>
    </div>
  `;
}

function getUnitWeights(code) {
  const m = {
    '24S101': [20, 20, 20, 15, 25],
    '24S102': [25, 20, 20, 20, 15],
    '24S103': [20, 20, 20, 20, 20],
    '24S104': [20, 20, 25, 20, 15],
    '24S105': [20, 25, 20, 20, 15],
    '24S201': [20, 20, 20, 20, 20],
    '24S202': [20, 20, 25, 20, 15],
    '24S203': [15, 15, 20, 25, 15, 10],
    '24S204': [20, 20, 20, 20, 20],
    '24S205': [20, 20, 25, 20, 15],
    '24S301': [20, 25, 20, 20, 15],
    '24S302': [15, 20, 20, 25, 20],
    '24S303': [20, 20, 20, 20, 20],
    '24S304': [20, 20, 20, 20, 20],
    '24S401': [20, 20, 20, 20, 20],
    '24S402': [20, 20, 20, 25, 15],
    '24S501': [20, 20, 20, 20, 20],
    '24S503': [20, 20, 25, 20, 15],
    '24S504': [15, 20, 20, 25, 20],
  };
  return m[code] || [];
}

function getHighYieldTopics(code) {
  const m = {
    '24S101': [
      { topic: "Green's Theorem – statement, proof, applications", unit: 5, marks: "8/13-mark", priority: "Must" },
      { topic: "Stokes' and Divergence theorem", unit: 5, marks: "8/13-mark", priority: "Must" },
      { topic: "Lagrange multipliers – optimization problems", unit: 2, marks: "8-mark", priority: "High" },
      { topic: "Triple integrals – cylindrical/spherical coords", unit: 3, marks: "8-mark", priority: "High" },
      { topic: "Beta and Gamma function relations", unit: 4, marks: "8-mark", priority: "High" },
      { topic: "Partial derivatives, directional derivative", unit: 2, marks: "2/8-mark", priority: "Medium" }
    ],
    '24S102': [
      { topic: "Second order ODE – homogeneous with constant coeff.", unit: 2, marks: "13-mark", priority: "Must" },
      { topic: "Variation of parameters", unit: 3, marks: "13-mark", priority: "Must" },
      { topic: "Power series and Frobenius method", unit: 4, marks: "8-mark", priority: "High" },
      { topic: "Exact ODE and integrating factors", unit: 1, marks: "8-mark", priority: "High" },
      { topic: "Formation and solution of PDE", unit: 5, marks: "8-mark", priority: "High" }
    ],
    '24S103': [
      { topic: "Bending of beams – cantilever, uniform bending", unit: 1, marks: "13-mark", priority: "Must" },
      { topic: "Poiseuille's method – viscosity of liquid", unit: 2, marks: "8/13-mark", priority: "Must" },
      { topic: "Surface tension – capillary rise, drop weight", unit: 3, marks: "8-mark", priority: "High" },
      { topic: "Sabine's formula – acoustics of hall", unit: 4, marks: "8-mark", priority: "High" },
      { topic: "Piezoelectric ultrasonic generator", unit: 5, marks: "8-mark", priority: "High" }
    ],
    '24S202': [
      { topic: "Pointers – arithmetic, pointer to function", unit: 3, marks: "13-mark", priority: "Must" },
      { topic: "Structures – nested, array of structures", unit: 4, marks: "8/13-mark", priority: "Must" },
      { topic: "File operations – fread/fwrite/fseek", unit: 5, marks: "8-mark", priority: "High" },
      { topic: "Recursion – Towers of Hanoi, factorial", unit: 2, marks: "8-mark", priority: "High" }
    ],
    '24S302': [
      { topic: "Linked list – singly, doubly, circular operations", unit: 3, marks: "13-mark", priority: "Must" },
      { topic: "Binary tree traversals – inorder/preorder/postorder", unit: 4, marks: "8/13-mark", priority: "Must" },
      { topic: "Stack applications – infix to postfix", unit: 2, marks: "8-mark", priority: "High" },
      { topic: "Sorting – Quick sort, Merge sort derivation", unit: 5, marks: "8-mark", priority: "High" },
      { topic: "Heap sort and binary search", unit: 5, marks: "8-mark", priority: "Medium" }
    ],
    '24S304': [
      { topic: "Maxwell's equations – all four + derivation", unit: 5, marks: "13-mark", priority: "Must" },
      { topic: "Faraday's law and LCR induction", unit: 4, marks: "8/13-mark", priority: "Must" },
      { topic: "Biot-Savart law – coil and solenoid", unit: 3, marks: "8-mark", priority: "High" },
      { topic: "Gauss law applications – sphere, cylinder", unit: 1, marks: "8-mark", priority: "High" }
    ],
    '24S504': [
      { topic: "Schrödinger equation – particle in a box", unit: 4, marks: "13-mark", priority: "Must" },
      { topic: "Quantum tunnelling and transmission coefficient", unit: 4, marks: "8-mark", priority: "Must" },
      { topic: "Postulates of Quantum Mechanics", unit: 3, marks: "8-mark", priority: "High" },
      { topic: "Hydrogen atom – separation of variables, quantum numbers", unit: 5, marks: "13-mark", priority: "High" }
    ]
  };
  const found = m[code];
  if (found) return found;
  const course = { units: [] }; // fallback
  return [
    { topic: "Derivations and Proofs from each unit", unit: "1-5", marks: "13-mark", priority: "Must" },
    { topic: "Numerical problems from all units", unit: "1-5", marks: "8-mark", priority: "High" },
    { topic: "Definitions and 2-mark questions", unit: "1-5", marks: "2-mark", priority: "Medium" }
  ];
}

function generateRevisionPlan(units, days) {
  const plan = [];
  const phase1 = Math.floor(days * 0.5);
  const phase2 = Math.floor(days * 0.3);
  const phase3 = days - phase1 - phase2;
  const daysPerUnit = Math.max(1, Math.floor(phase1 / (units.length || 5)));

  units.forEach((u, i) => {
    const start = i * daysPerUnit + 1;
    const end = start + daysPerUnit - 1;
    const day = start === end ? `Day ${start}` : `Day ${start}–${end}`;
    plan.push({
      day, focus: `Unit ${u.num}: ${u.title.substring(0, 25)}...`, color: 'cyan',
      topics: u.topics.slice(0, 3).join(', ') + (u.topics.length > 3 ? '...' : ''),
      resources: 'Textbook + class notes',
      target: `Master ${Math.min(3, u.topics.length)} key topics`
    });
  });
  const revStart = phase1 + 1;
  const revEnd = phase1 + phase2;
  plan.push({
    day: `Day ${revStart}–${revEnd}`, focus: 'Revision & Problems', color: 'amber',
    topics: 'High-yield topics, past papers, formulas',
    resources: 'Question banks, solved papers',
    target: 'Solve 2 problems per topic'
  });
  if (phase3 > 1) plan.push({
    day: `Day ${revEnd + 1}–${days}`, focus: 'Mock Tests', color: 'emerald',
    topics: 'Full-length mock exams under timed conditions',
    resources: 'Prescribed textbook exercises',
    target: '≥70% score in mock test'
  });
  plan.push({
    day: `Day ${days}`, focus: 'Final Review', color: 'purple',
    topics: 'Quick revision bullets, key formulas only',
    resources: 'Your own concise notes',
    target: 'Confidence check & rest'
  });
  return plan;
}
