// Topic Notes PDF Generator Component

// Generates and renders accurate SVG diagrams via AI for all wiki-diagram-slot placeholders
async function renderWikiDiagrams() {
  const GEMINI_KEY = "AIzaSyBxkr2pIizg7eLOo5GmWHLj329uJQPwtyw";
  const slots = document.querySelectorAll('.wiki-diagram-slot');

  const svgPrompt = (query) => {
    const isGraph = /graph|curve|plot|waveform|vs |versus|displacement|velocity|time|frequency|spectrum/i.test(query);
    const isCircuit = /circuit|cell|electrode|battery|capacitor|resistor|transistor|diode/i.test(query);
    const isForce = /force|vector|diagram|field|free body|stress|torque|equilibrium/i.test(query);
    let extra = '';
    if (isGraph) extra = `\n- This is a GRAPH/CURVE diagram. Draw accurate X and Y axes with labels and units. Show the curve/waveform correctly plotted. Mark key points (peaks, zero crossings, asymptotes).`;
    else if (isCircuit) extra = `\n- This is a CIRCUIT/CELL diagram. Show all components as standard symbols. Label terminals, electrodes, current direction with arrows.`;
    else if (isForce) extra = `\n- This is a FORCE/VECTOR diagram. Show all vectors as bold arrows. Label each force with name and direction clearly.`;
    else extra = `\n- This is a PHYSICAL SETUP diagram. Show the real-world arrangement of components, label each part clearly with leader lines.`;

    return `You are a precise scientific diagram generator. Generate a clean, accurate, well-labeled SVG diagram for: "${query}".

STRICT RULES:
- Output ONLY raw SVG code. Start with <svg, end with </svg>. Nothing else before or after.
- viewBox="0 0 600 380" width="100%" height="auto"
- White background: <rect width="600" height="380" fill="white"/>
- Font: font-family="Arial, sans-serif"
- All text labels in plain English, font-size="13", fill="#111"
- Use shapes: rect, circle, line, path, polygon, polyline
- Draw arrowheads with filled polygon triangles
- Color code parts: use #2563eb (blue), #dc2626 (red), #16a34a (green), #d97706 (orange)
- Title: <text x="300" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#111">${query}</text>
- Make it educationally accurate — label every important component${extra}
- NO gradients, NO clip-path, NO complex filters`;
  };


  slots.forEach(async (el) => {
    const query = el.dataset.query;
    const type = el.dataset.type || 'diagram'; // 'diagram' or 'photo'
    if (!query) return;

    const wrapStyle = 'text-align:center;margin:24px 0;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:12px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.07);';
    const labelStyle = 'font-size:0.72rem;color:#888;margin-bottom:6px;text-align:left;';
    const imgStyle = 'max-width:100%;height:auto;border-radius:8px;background:#fff;padding:4px;';

    function extractAndShow(text) {
      text = text.replace(/```svg\s*/gi, '').replace(/```xml\s*/gi, '').replace(/```\s*/g, '').trim();
      const m = text.match(/<svg[\s\S]*<\/svg>/i);
      if (m) {
        el.outerHTML = `<div style="${wrapStyle}"><div style="${labelStyle}">� Diagram: ${query}</div>${m[0]}</div>`;
        return true;
      }
      return false;
    }

    // ── REAL_PHOTO path: Fetch an actual photo from Wikimedia Commons ─────────────
    if (type === 'photo') {
      async function tryWikiPhoto(searchQuery) {
        const encoded = encodeURIComponent(searchQuery);
        const res = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encoded}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&format=json&origin=*`);
        const data = await res.json();
        const pages = data.query && data.query.pages;
        if (!pages) return null;
        const urls = Object.values(pages).map(p => p.imageinfo?.[0]?.url).filter(u => u && !/\.(svg|ogg|webm|mp3|wav|pdf)$/i.test(u));
        for (const url of urls) {
          const ok = await new Promise(resolve => { const i = new Image(); i.onload = () => resolve(true); i.onerror = () => resolve(false); i.src = url; });
          if (ok) return url;
        }
        return null;
      }

      try {
        let url = await tryWikiPhoto(query);
        if (!url) url = await tryWikiPhoto(query.split(' ').slice(0, 3).join(' '));
        if (url) {
          el.outerHTML = `<div style="${wrapStyle}"><div style="${labelStyle}">📷 Real-World Example: ${query}</div><img src="${url}" style="${imgStyle}" alt="${query}" /></div>`;
          return;
        }
        // Wikipedia article thumbnail fallback
        const slug = encodeURIComponent(query.split(' ').slice(0, 3).join('_'));
        const res2 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`);
        const d2 = await res2.json();
        if (d2.thumbnail && d2.thumbnail.source) {
          el.outerHTML = `<div style="${wrapStyle}"><div style="${labelStyle}">📷 Real-World Example: ${query}</div><img src="${d2.thumbnail.source}" style="${imgStyle};max-width:360px;" alt="${query}" /></div>`;
          return;
        }
      } catch (e) { /* fall through to text fallback */ }
      el.outerHTML = `<div style="${wrapStyle}padding:20px;"><div style="${labelStyle}">📷 ${query}</div><div style="font-size:0.9rem;color:#555;">Real-world example: <strong>${query}</strong></div></div>`;
      return;
    }

    // ── WIKI_DIAGRAM path: AI-generated SVG ──────────────────────────────────────
    // TIER 1 — Gemini API (fastest, most accurate SVG)

    const MODELS = ["gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
    for (const model of MODELS) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: svgPrompt(query) }] }],
            generationConfig: { temperature: 0.05, maxOutputTokens: 2500 }
          })
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text && extractAndShow(text)) return;
      } catch (e) { /* try next */ }
    }

    // TIER 2 — Claude 3.7 Sonnet via puter.ai.chat (best SVG code generator)
    try {
      if (typeof puter !== 'undefined' && puter.ai && puter.ai.chat) {
        el.innerHTML = `<div style="${labelStyle}">🤖 Generating SVG with Claude 3.7…</div>`;
        const svgModels = ['claude-3-7-sonnet', 'gpt-4o', 'claude-3-5-sonnet', 'gpt-4o-mini'];
        for (const m of svgModels) {
          try {
            const resp = await puter.ai.chat([
              { role: 'system', content: 'You are a precise SVG diagram generator. Output ONLY raw SVG code, nothing else. No markdown, no fences, no explanation.' },
              { role: 'user', content: svgPrompt(query) }
            ], { model: m });
            const text = resp?.message?.content || resp?.content || (typeof resp === 'string' ? resp : '');
            if (text && extractAndShow(text)) return;
          } catch (me) { /* try next */ }
        }
      }
    } catch (e) { /* fall through */ }


    // TIER 3 — Clean HTML concept box (always readable, no garbled text)
    el.outerHTML = `<div style="${wrapStyle}padding:20px;">
      <div style="${labelStyle}">📊 Diagram: ${query}</div>
      <div style="display:inline-block;border:2px solid #2563eb;border-radius:8px;padding:14px 28px;background:#eff6ff;font-size:1rem;font-weight:600;color:#1e40af;">${query}</div>
      <div style="margin-top:10px;font-size:0.82rem;color:#6b7280;">Refer to the notes above for a full explanation of this concept.</div>
    </div>`;
  });
}




export function renderTopicNotes(container, { allSemesters, selectedCourse, getCourseByCode, getPrerequisites, getCrossConnections, getTextbookRef }) {
  const courses = allSemesters.flatMap(s => s.courses.map(c => ({ ...c, semester: s.num })));

  container.innerHTML = `
    <div class="animate-fade">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-icon cyan">📝</div>
          <div>
            <div class="card-title">Topic Notes Generator</div>
            <div class="card-desc">Select a course, unit and topic to generate structured exam-ready notes.</div>
          </div>
        </div>
        <div class="grid-2" style="margin-top:16px;">
          <div class="form-group">
            <label class="form-label">Course</label>
            <select id="tn-course" class="form-select">
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
            <label class="form-label">Difficulty Level</label>
            <select id="tn-level" class="form-select">
              <option value="bsc_level">📘 BSc Level — Core Understanding</option>
              <option value="advanced_level">🚀 Advanced Level — Deep Research & Analysis</option>
            </select>
          </div>
        </div>
        <div class="form-group" id="tn-unit-group" style="display:none;">
          <label class="form-label">Unit</label>
          <select id="tn-unit" class="form-select">
            <option value="">— Select Unit —</option>
          </select>
        </div>
        <div class="form-group" id="tn-topic-group" style="display:none;">
          <label class="form-label">Topic</label>
          <select id="tn-topic" class="form-select">
            <option value="">— Select Topic —</option>
          </select>
        </div>
        <button id="tn-generate" class="btn btn-primary" style="margin-top:4px;" disabled>✨ Generate Notes</button>
        <button id="tn-print" class="btn btn-secondary" style="margin-top:4px;margin-left:8px;display:none;" onclick="window.print()">🖨️ Print / Save PDF</button>
      </div>
      <div id="tn-output"></div>
    </div>
  `;

  const courseSelect = document.getElementById('tn-course');
  const unitGroup = document.getElementById('tn-unit-group');
  const unitSelect = document.getElementById('tn-unit');
  const topicGroup = document.getElementById('tn-topic-group');
  const topicSelect = document.getElementById('tn-topic');
  const genBtn = document.getElementById('tn-generate');
  const printBtn = document.getElementById('tn-print');
  const output = document.getElementById('tn-output');

  function populateUnits(code) {
    const course = getCourseByCode(code);
    unitSelect.innerHTML = '<option value="">— Select Unit —</option>';
    topicSelect.innerHTML = '<option value="">— Select Topic —</option>';
    if (!course || !course.units) { unitGroup.style.display = 'none'; topicGroup.style.display = 'none'; return; }
    course.units.forEach(u => {
      unitSelect.innerHTML += `<option value="${u.num}">${u.num}. ${u.title}</option>`;
    });
    unitGroup.style.display = 'block';
    topicGroup.style.display = 'none';
    genBtn.disabled = true;
  }

  function populateTopics(code, unitNum) {
    const course = getCourseByCode(code);
    const unit = course && course.units ? course.units.find(u => u.num == unitNum) : null;
    topicSelect.innerHTML = '<option value="">— Select Topic —</option>';
    if (!unit) { topicGroup.style.display = 'none'; return; }
    unit.topics.forEach(t => {
      topicSelect.innerHTML += `<option value="${t}">${t}</option>`;
    });
    topicGroup.style.display = 'block';
    genBtn.disabled = false;
  }

  courseSelect.addEventListener('change', () => populateUnits(courseSelect.value));
  unitSelect.addEventListener('change', () => {
    if (unitSelect.value) populateTopics(courseSelect.value, unitSelect.value);
  });
  topicSelect.addEventListener('change', () => { genBtn.disabled = !topicSelect.value; });

  if (selectedCourse) {
    courseSelect.value = selectedCourse.code;
    populateUnits(selectedCourse.code);
  }

  genBtn.addEventListener('click', async () => {
    try {
      output.innerHTML = '<div class="card" style="padding:16px;">Generating notes...</div>';
      console.log("Generate Notes clicked");
      const code = courseSelect.value;
      const unitNum = unitSelect.value;
      const topic = topicSelect.value || 'All Topics in Unit';
      const level = document.getElementById('tn-level').value;
      console.log("Selected:", { code, unitNum, topic, level });

      const course = getCourseByCode(code);
      if (!course) {
        output.innerHTML = '<div class="card" style="padding:16px;color:red;">Error: Course not found for code ' + code + '</div>';
        return;
      }
      const unit = course.units.find(u => u.num == unitNum);
      if (!unit) {
        output.innerHTML = '<div class="card" style="padding:16px;color:red;">Error: Unit not found for num ' + unitNum + '</div>';
        return;
      }

      await generateNotes(output, course, unit, topic, level, getPrerequisites, getCrossConnections, getTextbookRef);
      printBtn.style.display = 'inline-flex';
      console.log("Generation complete");
    } catch (err) {
      console.error(err);
      output.innerHTML = '<div class="card" style="padding:16px;color:red;white-space:pre-wrap;">Error generating notes:\n' + err.message + '\n\n' + err.stack + '</div>';
    }
  });
}

// ==========================================
// ROBUST AI RESEARCH GENERATOR
// ==========================================
async function generateTopicResearchAI(course, unit, topic, level) {
  const levelContext = {
    'bsc_level': `BSC LEVEL INSTRUCTIONS:
- Write clear definitions and core concepts that a BSc student can understand easily.
- Include standard formulas with a brief explanation of each variable.
- Show a complete step-by-step derivation of the main formula.
- Include at least 3 solved numerical problems with detailed steps.
- Use simple analogies to build intuition (e.g., compare concepts to everyday objects).
- Include a comparison table if applicable (e.g., types of motion, properties of waves).
- Include 3-4 visuals: at least 1 real-world photo and 2 technical diagrams/graphs.
- End with a Key Points / Quick Revision list.`,
    'advanced_level': `ADVANCED LEVEL INSTRUCTIONS:
- Begin with a deep conceptual analysis — explain WHY the physics/math works the way it does.
- Include full rigorous derivations showing every mathematical step.
- Cover special cases, edge conditions, and limiting behaviours.
- Include 5+ solved numerical problems ranging from simple to GATE/competitive exam level.
- Add a Data Table with actual measured values, constants, or empirical data relevant to the topic.
- Include theoretical extensions, modern research applications, and connections to other topics.
- Use 4-5 visuals: real-world photo, multiple graphs (e.g., different damping cases), schematic diagram, and data chart.
- Include MCQ-style tricky exam questions with answers at the end.`
  }[level] || 'Provide standard university-level analysis.';

  const SYMBOL_RULES = `RULE ZERO - MATHEMATICAL SYMBOLS & FORMATTING (Strictly enforced - violations not acceptable):
1. Always write the mathematical symbol, NEVER the word.
   Examples: π (not 'pi'), ω (not 'omega'), α β γ θ λ μ σ ρ φ τ δ (not 'alpha', 'beta', etc.).
   Calculus: ∂ (not 'partial'), ∇ (not 'nabla'), ∞ (not 'infinity'), ∫ (not 'integral'), ∑ (not 'sum').
   Operators: × (not 'cross'), ÷ (not 'divided by'), ± (not 'plus-minus'), ≈ (not 'approx').
2. DO NOT use LaTeX math delimiters! NEVER use \\(...\\), \\[...\\], $, or $$ wrappers around your equations.
3. Write formulas in plain, accessible text using standard HTML and Unicode (e.g., (A^†)^† = A).
4. Do not use complex unreadable markup like \\dagger or \\frac. Keep equations clean, directly readable, and visually accessible in raw HTML.`;

  const systemPrompt = `You are a post-doctoral university professor and AI research tutor for Vidhyasethu at PSG College of Technology.
Generate comprehensive, visually stunning exam notes and deep research analysis on the requested topic.

${SYMBOL_RULES}

CRITICAL FORMATTING RULES — Output ONLY raw HTML (never markdown):
1. NEVER output Markdown (**bold** or ![]() images). YOU MUST OUTPUT STRICTLY RAW HTML (<strong>, <img>).
2. Layout — Use premium note-taking structures to keep the UI stable and beautiful:

   A. CORNELL METHOD (for core theories):
      <div class="cornell-layout">
        <div class="cornell-cues">Key Questions / Cues</div>
        <div class="cornell-notes">Main Notes / Content</div>
      </div>
      <div class="cornell-summary">💡 Summary: Quick 2-line takeaway.</div>

   B. FLOW NOTES (for processes/sequences):
      <div class="flow-container">
        <div class="flow-box">Step 1</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-box">Step 2</div>
      </div>

   C. MIND MAP BUBBLES (for related sub-topics/properties):
      <div style="text-align:center; margin:16px 0;">
        <div class="bubble-note">Main Idea</div>
        <div class="bubble-note">Branch 1</div>
        <div class="bubble-note">Branch 2</div>
      </div>

   D. BULLET JOURNALING (for lists):
      <ul class="bujo-list">
        <li class="bujo-item"><span class="bujo-symbol">★</span><div class="bujo-text">Critical Exam Point</div></li>
        <li class="bujo-item"><span class="bujo-symbol">○</span><div class="bujo-text">Definition / Detail</div></li>
        <li class="bujo-item"><span class="bujo-symbol">▲</span><div class="bujo-text">Application</div></li>
      </ul>

3. Typography — Use headings and spacing to prevent clutter:
   - Use <div class="aesthetic-header"><h3>📐 Section Title</h3></div> for primary sections.
   - Use <p class="key-idea">One key idea per line/paragraph.</p> for readability.
   - Highlight key terms with <span class="hl-cyan">Term</span>, <span class="hl-purple">Term</span>, or <span class="hl-amber">Term</span>.

4. Formulas — Present EVERY formula using this structure:
   Show the formula in a <div class="formula-block"> first, then IMMEDIATELY below it a variable legend table.
   Use color to highlight each variable letter in the formula.

5. Visuals: Include 2-3 visuals per topic using [WIKI_DIAGRAM: ...] or [REAL_PHOTO: ...].

MANDATORY CONTENT INCLUSION:
- Cornell Layout for the "Definition & Core Concept" section.
- Flow Notes for the "Derivation Steps" or "Process" section.
- Mind Map Bubbles for "Properties" or "Related Concepts".
- Bujo List for the "Quick Revision" section at the end.

${levelContext}`;

  const userMessage = `Course: ${course.code} - ${course.title}
Unit: ${unit.num}. ${unit.title}
Topic: ${topic}
Task: Research this topic deeply and prepare university-grade lecture notes.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];

  function cleanHtml(text) {
    let clean = text.replace(/⚠️\s*\*\*IMPORTANT NOTICE\*\*[\s\S]*?will continue to work normally\./gi, '')
      .replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();

    // ── Strip LaTeX delimiters so they render as readable plain text ──────────
    clean = clean.replace(/\\\([\s\S]*?\\\)/g, (m) => m.slice(2, -2));
    clean = clean.replace(/\\\[[\s\S]*?\\\]/g, (m) => m.slice(2, -2));
    clean = clean.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
    clean = clean.replace(/\$([^\n$]{1,200})\$/g, '$1');
    // Common LaTeX commands → Unicode equivalents
    clean = clean
      .replace(/\\dagger/g, '†').replace(/\\dag/g, '†')
      .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
      .replace(/\\sqrt\{([^}]*)\}/g, '√($1)').replace(/\\sqrt/g, '√')
      .replace(/\\cdot/g, '·').replace(/\\times/g, '×').replace(/\\div/g, '÷')
      .replace(/\\pm/g, '±').replace(/\\approx/g, '≈')
      .replace(/\\neq/g, '≠').replace(/\\leq/g, '≤').replace(/\\geq/g, '≥')
      .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ').replace(/\\epsilon/g, 'ε').replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ').replace(/\\mu/g, 'μ').replace(/\\nu/g, 'ν')
      .replace(/\\pi/g, 'π').replace(/\\rho/g, 'ρ').replace(/\\sigma/g, 'σ')
      .replace(/\\tau/g, 'τ').replace(/\\phi/g, 'φ').replace(/\\omega/g, 'ω')
      .replace(/\\Omega/g, 'Ω').replace(/\\partial/g, '∂').replace(/\\nabla/g, '∇')
      .replace(/\\infty/g, '∞').replace(/\\int/g, '∫').replace(/\\sum/g, '∑')
      .replace(/\\prod/g, '∏').replace(/\\in/g, '∈').replace(/\\subset/g, '⊂')
      .replace(/\\rightarrow/g, '→').replace(/\\leftarrow/g, '←').replace(/\\Rightarrow/g, '⇒')
      .replace(/\\hat\{([^}]*)\}/g, '$1̂').replace(/\\vec\{([^}]*)\}/g, '$1⃗')
      .replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\mathbf\{([^}]*)\}/g, '<strong>$1</strong>')
      .replace(/\\left[[(|)\]]/g, '').replace(/\\right[[(|)\]]/g, '')
      .replace(/\{/g, '').replace(/\}/g, '')
      .replace(/\\_([a-zA-Z0-9]+)/g, '<sub>$1</sub>')
      .replace(/\\\^([a-zA-Z0-9]+)/g, '<sup>$1</sup>');

    // Auto-fix Markdown bolding
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Auto-fix mathematical superscripts (e.g. x^2 -> x<sup>2</sup>)
    clean = clean.replace(/([a-zA-Z0-9)])\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>');

    // WIKI_DIAGRAM → AI-generated SVG technical diagram (rendered later by renderWikiDiagrams())
    clean = clean.replace(/!?\[WIKI_DIAGRAM:\s*(.+?)\]/gi, (match, query) => {
      const safeQuery = query.trim().replace(/[^a-zA-Z0-9\s]/g, '');
      const uniqueId = 'wiki-img-' + Math.floor(Math.random() * 9999999);
      return `<div id="${uniqueId}" class="wiki-diagram-slot" data-query="${safeQuery}" data-type="diagram" style="text-align:center;margin:24px 0;padding:16px;font-size:0.9rem;color:var(--text-secondary);">📐 Generating diagram for "${safeQuery}"…</div>`;
    });

    // REAL_PHOTO → Wikimedia Commons photo search (rendered later by renderWikiDiagrams())
    clean = clean.replace(/!?\[REAL_PHOTO:\s*(.+?)\]/gi, (match, query) => {
      const safeQuery = query.trim().replace(/[^a-zA-Z0-9\s]/g, '');
      const uniqueId = 'wiki-img-' + Math.floor(Math.random() * 9999999);
      return `<div id="${uniqueId}" class="wiki-diagram-slot" data-query="${safeQuery}" data-type="photo" style="text-align:center;margin:24px 0;padding:16px;font-size:0.9rem;color:var(--text-secondary);">📷 Loading real-world photo for "${safeQuery}"…</div>`;
    });

    // In case the AI still outputs markdown mermaid blocks
    clean = clean.replace(/```mermaid\s*([\s\S]*?)```/gi, '<pre class="mermaid" style="text-align:center; margin: 24px 0;">\n$1\n</pre>');

    return clean;
  }

  let errorDetails = [];

  // 1. Puter.js
  const puterModels = ['claude-3-7-sonnet', 'gpt-4o', 'claude-3-5-sonnet', 'gpt-4o-mini'];
  for (const model of puterModels) {
    try {
      if (typeof puter !== 'undefined' && puter.ai) {
        const resp = await puter.ai.chat(messages, { model });
        const text = resp?.message?.content || resp?.content || (typeof resp === 'string' ? resp : '');
        if (text && text.length > 50) return cleanHtml(text);
      }
    } catch (e) {
      errorDetails.push(`Puter (${model}): ${e.message}`);
    }
  }

  // 2. Gemini API
  const GEMINI_KEY = "AIzaSyBxkr2pIizg7eLOo5GmWHLj329uJQPwtyw";
  const GEMINI_MODELS = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-2.0-flash-lite-preview-02-05"];
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.2, maxOutputTokens: 4000 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.length > 30) return cleanHtml(text);
      } else {
        const errText = await res.text();
        errorDetails.push(`Gemini (${model}): ${res.status}`);
      }
    } catch (e) {
      errorDetails.push(`Gemini (${model}): Network Error`);
    }
  }

  // 3. Pollinations fallback
  for (const model of ["openai", "mistral"]) {
    try {
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages, model: model, seed: 42 })
      });
      if (res.ok) {
        const text = await res.text();
        if (text.length > 30) return cleanHtml(text);
      } else {
        errorDetails.push(`Pollinations (${model}): ${res.status}`);
      }
    } catch (e) {
      errorDetails.push(`Pollinations (${model}): ${e.message}`);
    }
  }

  return `<div class="card" style="padding:16px;color:var(--accent-rose); border: 1px solid var(--accent-rose);">
    <div style="font-weight:bold;margin-bottom:8px;">⚠️ Live Research Generation Failed</div>
    <p style="font-size:0.9rem;opacity:0.9;">All AI research providers are currently busy or unavailable.</p>
    <div style="font-size:0.75rem; background:rgba(0,0,0,0.1); padding:8px; border-radius:4px; margin-top:10px; font-family:monospace;">
      <strong>Error Trace:</strong><br>
      ${errorDetails.slice(0, 5).join('<br>')}
    </div>
    <p style="font-size:0.8rem;opacity:0.9;margin-top:10px;">Please check your internet connection or try again in a few minutes.</p>
  </div>`;
}

async function generateNotes(output, course, unit, topic, level, getPrerequisites, getCrossConnections, getTextbookRef) {
  const prereqs = getPrerequisites(course.code);
  const crossLinks = getCrossConnections(course.code);
  const books = getTextbookRef(course.code);
  const levelLabel = { bsc_level: '📘 BSc Level', advanced_level: '🚀 Advanced Level' }[level] || level;

  output.innerHTML = `
    <div class="card" style="padding:16px; margin-bottom: 20px;">
        <div style="display:flex; align-items:center; gap:10px;">
            <div class="skeleton" style="width:24px; height:24px; border-radius:50%;"></div>
            <div>
                <strong style="color:var(--text-primary);">Fetching Live Textbook Data...</strong>
                <div style="font-size:0.8rem; color:var(--text-tertiary);">Querying Wikipedia & OpenLibrary for "${topic}"...</div>
            </div>
        </div>
    </div>`;

  const aiNotesPromise = generateTopicResearchAI(course, unit, topic, level);
  const externalDataPromise = fetchExternalData(topic, books.textbooks[0]);
  const [aiNotesHTML, externalData] = await Promise.all([aiNotesPromise, externalDataPromise]);
  const content = await getNoteContentAsync(course, unit, topic, level, externalData, aiNotesHTML);

  output.innerHTML = `
    <div class="notes-content animate-slide" id="printable-notes">
      <div class="syllabus-header">
        <div class="sh-item"><span class="sh-label">Course:</span><span class="sh-value">${course.code} – ${course.title}</span></div>
        <span class="sh-sep">|</span>
        <div class="sh-item"><span class="sh-label">Unit ${unit.num}:</span><span class="sh-value">${unit.title}</span></div>
        <span class="sh-sep">|</span>
        <div class="sh-item"><span class="sh-label">Topic:</span><span class="sh-value">${topic}</span></div>
        <span class="sh-sep">|</span>
        <div class="sh-item"><span class="badge badge-cyan">${levelLabel}</span></div>
      </div>

      ${prereqs.length > 0 ? `
        <div class="callout callout-info">
          <div class="callout-icon">🗂️</div>
          <div><strong>Prerequisites:</strong>
            <div class="prereq-chain" style="margin-top:6px;">
              ${prereqs.map((p, i) => `<span class="prereq-node" title="${p.topic}">${p.code}</span>${i < prereqs.length - 1 ? '<span class="prereq-arrow">→</span>' : ''}`).join('')}
              <span class="prereq-arrow">→</span><span class="prereq-node" style="border-color:var(--accent-cyan);color:var(--accent-cyan);">${course.code}</span>
            </div>
          </div>
        </div>` : ''}

      ${content}

      ${crossLinks.length > 0 ? `
        <h2>🔗 Connections to Other Courses</h2>
        <div class="chip-list">
          ${crossLinks.map(cl => `<div class="chip">📎 ${cl}</div>`).join('')}
        </div>` : ''}

      <h2>📚 Reference Textbooks</h2>
      <ul>
        ${books.textbooks.map(b => `<li><strong>${b.split(',')[0]}</strong> — ${b.split(',').slice(1).join(',').trim()}</li>`).join('')}
      </ul>
      ${books.references.length > 0 ? `<div style="margin-top:6px;font-size:0.78rem;color:var(--text-tertiary);">References: ${books.references.slice(0, 2).join(' | ')}</div>` : ''}
    </div>
  `;
  setTimeout(async () => {
    // Render Mermaid diagrams
    if (window.mermaid) {
      try { await mermaid.run({ querySelector: '.mermaid' }); } catch (e) { console.error('Mermaid render error:', e); }
    }
    // Render all Wikipedia diagram slots
    renderWikiDiagrams();
  }, 400);
}

async function getNoteContentAsync(course, unit, topic, level, externalData, aiNotesHTML) {
  const isDeep = level === 'advanced_level';
  const noteData = getTopicNoteData(course, unit, topic, isDeep);
  const levelLabel = { bsc_level: '📘 BSc Level', advanced_level: '🚀 Advanced Level' }[level] || level;

  const searchQuery = externalData.bookInfo ? `${externalData.bookInfo.title} ${externalData.bookInfo.author}` : `${topic} textbook`;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  const knimbusUrl = `https://www.knimbus.com/`;

  // Generate Book HTML
  let bookHTML = '';
  if (externalData.bookInfo) {
    bookHTML = `
      <div style="display:flex; gap:16px; align-items:flex-start; margin-bottom: 16px;">
        ${externalData.bookInfo.cover ? `<img src="${externalData.bookInfo.cover}" alt="Book Cover" style="width:60px; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.3);">` : '<div style="width:60px; height:80px; background:var(--bg-secondary); border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:24px;">📘</div>'}
        <div>
          <div style="font-weight:600; font-size:1rem; color:var(--text-primary); margin-bottom:4px;">${externalData.bookInfo.title}</div>
          <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:4px;">By ${externalData.bookInfo.author} ${externalData.bookInfo.year ? `(First published: ${externalData.bookInfo.year})` : ''}</div>
          <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
            <a href="https://share.google/4P7fnR4hCwpKEImmN" target="_blank" style="font-size:0.8rem; color:white; background:#10b981; padding: 4px 10px; border-radius: 4px; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">📗 Read on Green Sci-Hub <span style="font-size:12px;">↗</span></a>
            <a href="${externalData.bookInfo.link}" target="_blank" style="font-size:0.8rem; color:white; background:var(--accent-cyan); padding: 4px 10px; border-radius: 4px; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">📖 View on OpenLibrary <span style="font-size:12px;">↗</span></a>
          </div>
        </div>
      </div>`;
  } else {
    bookHTML = `<div style="color:var(--text-tertiary); font-size:0.85rem; margin-bottom: 16px;">Direct textbook cover not found. Refer to Green Sci-Hub for free PDFs.</div>`;
  }

  bookHTML += `
    <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
      <div style="margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">Access full texts through your institutional library or search web:</div>
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <a href="https://share.google/4P7fnR4hCwpKEImmN" target="_blank" class="btn btn-secondary" style="font-size:0.8rem; padding: 4px 12px; display:inline-flex; align-items:center; gap:6px; border-color: #10b981; color: #10b981;">
          📗 Green Sci-Hub (Free PDFs)
        </a>
        <a href="${googleSearchUrl}" target="_blank" class="btn btn-secondary" style="font-size:0.8rem; padding: 4px 12px; display:inline-flex; align-items:center; gap:6px;">
          🔍 Search on Google
        </a>
        <a href="${knimbusUrl}" target="_blank" class="btn btn-secondary" style="font-size:0.8rem; padding: 4px 12px; display:inline-flex; align-items:center; gap:6px; border-color: var(--accent-rose); color: var(--accent-rose);">
          🎓 mLibrary
        </a>
      </div>
    </div>
  `;

  return `
    <h2>🧠 Deep AI Research & Analysis</h2>
    <div class="ai-generated-notes" style="margin-bottom: 24px; line-height: 1.6; color: var(--text-secondary);">
      ${aiNotesHTML}
    </div>    <h2>📚 Reference Book Search</h2>
    <div class="card" style="padding:16px;">
      ${bookHTML}
    </div>

    <h2>⚡ Quick Exam Guide</h2>
    <div style="margin-bottom:12px; font-size:0.9rem; color:var(--text-secondary);">
      <strong>Expected Exam Weightage:</strong> ${noteData.expectedMarks}
    </div>
    <div class="grid-2">
      ${noteData.examPatterns.map(ep => `
        <div class="card" style="padding:12px; border:1px solid var(--border-color);">
          <div class="badge ${ep.badge}" style="margin-bottom:6px;">${ep.type}</div>
          <div style="font-size:0.82rem;color:var(--text-secondary);">${ep.q}</div>
        </div>
      `).join('')}
    </div>
  `;
}

async function fetchExternalData(topicName, primaryTextbook) {
  try {
    // Query Wikipedia API for the topic
    const cleanTopic = topicName.split('-')[0].split('(')[0].trim();
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanTopic)}&utf8=&format=json&origin=*`);
    const searchData = await searchRes.json();

    let wikiInfo = { title: topicName, extract: "General theoretical context based on standard university physics/math definitions.", sentences: [] };

    if (searchData.query && searchData.query.search.length > 0) {
      const pageId = searchData.query.search[0].pageid;
      const pageRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=5&exlimit=1&pageids=${pageId}&explaintext=1&format=json&origin=*`);
      const pageData = await pageRes.json();
      const page = pageData.query.pages[pageId];

      wikiInfo.title = page.title;
      wikiInfo.extract = page.extract;

      // Split into sentences for line-by-line analysis
      wikiInfo.sentences = page.extract.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(s => s.length > 20);
    }

    // Query OpenLibrary API for the textbook
    let bookInfo = null;
    if (primaryTextbook) {
      const authorTitle = primaryTextbook.split(',');
      const searchStr = authorTitle[0].trim() + (authorTitle[1] ? " " + authorTitle[1].trim() : "");
      const bookRes = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchStr)}&limit=1`);
      const bookData = await bookRes.json();
      if (bookData.docs && bookData.docs.length > 0) {
        const doc = bookData.docs[0];
        bookInfo = {
          title: doc.title,
          author: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
          year: doc.first_publish_year || 'N/A',
          cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg` : null,
          link: `https://openlibrary.org${doc.key}`
        };
      }
    }

    return {
      wikiTitle: wikiInfo.title,
      wikiSummary: wikiInfo.extract,
      sentences: wikiInfo.sentences,
      bookInfo: bookInfo
    };
  } catch (e) {
    console.error("External fetch failed:", e);
    return {
      wikiTitle: topicName,
      wikiSummary: "Live API fetch failed. Using standard curriculum guidelines.",
      sentences: ["Definition and basic laws.", "Derivation and working formula.", "Applications and dimensional checks.", "Significant properties and constraints."],
      bookInfo: null
    };
  }
}

function getTopicNoteData(course, unit, topic, isDeep) {
  // Dynamic note generation based on course and topic
  const topicLower = topic.toLowerCase();

  // Greens theorem
  if (topicLower.includes("green")) {
    return {
      motivation: "Green's theorem elegantly bridges the gap between a line integral around a closed curve and a double integral over the enclosed region. It is the 2-D version of the general Stokes' theorem and is used extensively in fluid dynamics, electrostatics, and computer graphics.",
      expectedMarks: "Up to 12 marks (Unit Total: 20 marks — Two 2m, One 6m, One 10m)",
      examPatterns: [
        { type: "2-mark", badge: "badge-cyan", q: "State the mathematical expression for Green's theorem in a real plane." },
        { type: "2-mark", badge: "badge-cyan", q: "State the formula for area using Green's theorem." },
        { type: "6-mark", badge: "badge-amber", q: "State and prove Green's theorem." },
        { type: "10-mark", badge: "badge-rose", q: "Verify Green's theorem for F=(xy, x²) over a given region." }
      ]
    };
  }

  // Damped SHM
  if (topicLower.includes("damp")) {
    return {
      motivation: "Real oscillators always lose energy due to friction or air resistance. Damped harmonic motion explains why a swinging door slows down, why a shock absorber works, and why tuning an LCR circuit requires careful resistance selection.",
      expectedMarks: "Up to 16 marks (Unit Total: 20 marks — Two 2m, One 6m, One 10m)",
      examPatterns: [
        { type: "2-mark", badge: "badge-cyan", q: "Define quality factor (Q-factor)." },
        { type: "2-mark", badge: "badge-cyan", q: "Write the condition for critical damping." },
        { type: "6-mark", badge: "badge-amber", q: "Discuss the three types of damping with energy diagrams." },
        { type: "10-mark", badge: "badge-rose", q: "Derive the equation of motion for damped SHM and solve for the underdamped case." }
      ]
    };
  }

  // Generic fallback generator
  const topicWords = topic.split(' ').slice(0, 4).join(' ');
  return {
    motivation: `${topic} is a fundamental concept in ${course.title} (${course.code}). Understanding this topic builds the foundation for advanced work in ${unit.title} and connects directly to exam questions.`,
    expectedMarks: "Up to 16 marks (Unit Total: 20 marks — Two 2m, One 6m, One 10m)",
    examPatterns: [
      { type: "2-mark", badge: "badge-cyan", q: `Define ${topicWords} and state its significance.` },
      { type: "2-mark", badge: "badge-cyan", q: `State the standard formula and SI units for ${topicWords}.` },
      { type: "6-mark", badge: "badge-amber", q: `Explain ${topic} with a simple derivation or conceptual diagram.` },
      { type: "10-mark", badge: "badge-rose", q: `Derive and apply the key mathematical result for ${topic} with a solved numerical example.` }
    ]
  };
}
