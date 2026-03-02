import { generateContent } from '../utils/aiClient.js';

function sanitizeMermaid(chart) {
  // Fix node labels with special chars: A[Label?] -> A["Label?"]
  let fixed = chart.replace(/([a-zA-Z0-9\-]+)\[(.*?)\]/gi, (m, id, label) => {
    if (/[?!+=*&^%$#@|()]/.test(label) && !label.trim().startsWith('"')) {
      return `${id}["${label.trim()}"]`;
    }
    return m;
  });
  // Fix edge labels: A -- Label? --> B
  fixed = fixed.replace(/--\s*([^-\n>\[\("]+?)\s*-->/gi, (m, label) => {
    if (/[?!+=*&^%$#@|()]/.test(label) && !label.trim().startsWith('"')) {
      return `-- "${label.trim()}" -->`;
    }
    return m;
  });
  return fixed;
}

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 15000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

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

5. Visuals & Diagrams (Mandatory):
   - Use \` \` \`mermaid \` blocks for flowcharts and logic. IMPORTANT: Use double quotes for any node labels containing spaces or special characters (e.g., A["Start Process"] or B["Is it full?"]).
   - Use [AI_IMAGE: descriptive prompt] for technical graphs and photos. Keep the prompt as plain text (no HTML tags).
   - Use [VIDEO_SEARCH: topic name] for educational animations.

MANDATORY CONTENT INCLUSION:
- Include at least one Mermaid flow-chart (with quoted labels) per topic.
- Include 2-3 [AI_IMAGE: ...] tags for technical visualizations.
- Use Cornell Layout for the "Definition & Core Concept" section.
- Use Flow Notes for the "Derivation Steps" or "Process" section.
- End with a Bujo-style Key Points summary.

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
      .trim();

    const placeholders = [];

    // 1. EXTRACTION - Pull out all technical tags into placeholders
    // This protects them from being "fixed" by math formatting rules.

    // A. AI Images
    clean = clean.replace(/!?\[AI_IMAGE:\s*(.+?)\]/gi, (_, q) => {
      const safe = q.trim().replace(/['"]/g, '');
      const uniqueId = 'ai-img-' + Math.floor(Math.random() * 9999999);
      const slot = `<div id="${uniqueId}" class="visual-slot" data-query="${safe}" data-type="image" style="text-align:center;margin:24px 0;background:var(--bg-tertiary);border-radius:12px;overflow:hidden;min-height:200px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-color);">
        <div class="skeleton-text">🎨 Generating high-intellect visual for "${safe.substring(0, 30)}..."</div>
      </div>`;
      const p = `@@@VISUAL_SLOT_${placeholders.length}@@@`;
      placeholders.push(slot);
      return p;
    });

    // B. Video Search
    clean = clean.replace(/!?\[VIDEO_SEARCH:\s*(.+?)\]/gi, (_, q) => {
      const safe = q.trim().replace(/['"]/g, '');
      const uniqueId = 'vid-slot-' + Math.floor(Math.random() * 9999999);
      const slot = `<div id="${uniqueId}" class="visual-slot" data-query="${safe}" data-type="video" style="margin:20px 0;"></div>`;
      const p = `@@@VISUAL_SLOT_${placeholders.length}@@@`;
      placeholders.push(slot);
      return p;
    });

    // C. Mermaid Blocks
    clean = clean.replace(/```\s*mermaid\s*([\s\S]*?)```/gi, (_, chart) => {
      const fixedChart = sanitizeMermaid(chart.trim());
      const slot = `<pre class="mermaid" style="text-align:center; margin: 24px 0; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px;">\n${fixedChart}\n</pre>`;
      const p = `@@@VISUAL_SLOT_${placeholders.length}@@@`;
      placeholders.push(slot);
      return p;
    });

    // D. Generic Code Blocks
    clean = clean.replace(/```(?:html|javascript|python|css|json)?\s*([\s\S]*?)```/gi, (_, code) => {
      const slot = `<div class="code-block" style="background:var(--bg-tertiary); padding:12px; border-radius:8px; font-family:var(--font-mono); font-size:0.85rem; margin:12px 0; overflow-x:auto; border:1px solid var(--border);">${code.trim()}</div>`;
      const p = `@@@VISUAL_SLOT_${placeholders.length}@@@`;
      placeholders.push(slot);
      return p;
    });

    // 2. TRANSFORMATION - Format neutral text

    // Strip remaining lone backticks
    clean = clean.replace(/```/g, '');

    clean = clean.replace(/\\\(([\s\S]*?)\\\)/g, '$1');
    clean = clean.replace(/\\\[([\s\S]*?)\\\]/g, '$1');
    clean = clean.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
    clean = clean.replace(/\$([^\n$]{1,200})\$/g, '$1');

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

    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    clean = clean.replace(/([a-zA-Z0-9)])\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>');

    // 3. RESTORATION - Put visuals back in
    placeholders.forEach((slot, i) => {
      clean = clean.replace(`@@@VISUAL_SLOT_${i}@@@`, slot);
    });

    return clean;
  }

  let errorDetails = [];


  // Process via unified multi-provider AI Client
  try {
    const text = await generateContent(messages);
    if (text) return cleanHtml(text);
  } catch (e) {
    errorDetails.push(`AI Client Failed: ${e.message}`);
  }

  return `<div class="card" style="padding:16px;color:var(--accent-rose); border: 1px solid var(--accent-rose);">
    <div style="font-weight:bold;margin-bottom:8px;">⚠️ Live Research Generation Failed</div>
    <p style="font-size:0.9rem;opacity:0.9;">All intellectual AI research providers are currently busy. Please try again in 1 minute.</p>
    <div style="font-size:0.75rem; background:rgba(0,0,0,0.1); padding:8px; border-radius:4px; margin-top:10px; font-family:monospace;">
      <strong>Error Trace:</strong><br>
      ${errorDetails.slice(0, 5).join('<br>')}
    </div>
  </div>`;
}

export function renderTopicNotes(container, { allSemesters, selectedCourse, getCourseByCode, getPrerequisites, getCrossConnections, getTextbookRef, setMode }) {
  let innerCourse = selectedCourse;
  let unit = innerCourse?.units?.[0] || null;
  let topic = unit?.topics?.[0] || null;
  let level = 'bsc_level';

  function update() {
    container.innerHTML = `
      <div class="animate-fade">
        <div class="card" style="margin-bottom: 24px;">
          <h1 style="font-size:1.4rem; margin-bottom:12px;">📝 Topic Notes Generator</h1>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom: 20px;">Get comprehensive, university-grade study notes with derivations, solved examples, and interactive visuals.</p>
          
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Select Course</label>
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
              <label class="form-label">Study Depth</label>
              <select id="level-sel" class="form-select">
                <option value="bsc_level" ${level === 'bsc_level' ? 'selected' : ''}>📘 BSc Level (Foundation & Exam Focus)</option>
                <option value="advanced_level" ${level === 'advanced_level' ? 'selected' : ''}>🚀 Advanced Level (Deep Analysis & GATE)</option>
              </select>
            </div>
          </div>

          ${innerCourse ? `
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Select Unit</label>
                <select id="unit-sel" class="form-select">
                  ${innerCourse.units.map(u => `<option value="${u.num}" ${unit?.num === u.num ? 'selected' : ''}>Unit ${u.num}: ${u.title}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Select Topic</label>
                <select id="topic-sel" class="form-select">
                  ${unit ? unit.topics.map(t => `<option value="${t}" ${topic === t ? 'selected' : ''}>${t}</option>`).join('') : '<option>Select unit first</option>'}
                </select>
              </div>
            </div>
            <button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:8px;" id="gen-btn">✨ Generate Intelligent Notes</button>
          ` : '<div class="callout callout-info"><div class="callout-icon">👆</div><div>Please select a course to start generating notes.</div></div>'}
        </div>
        <div id="notes-output"></div>
        <button id="print-btn" class="btn btn-secondary print-btn" style="display:none;">🖨️ Export as PDF / Print</button>
      </div>
    `;

    // Listeners
    container.querySelector('#course-sel').addEventListener('change', (e) => {
      innerCourse = getCourseByCode(e.target.value);
      unit = innerCourse?.units?.[0] || null;
      topic = unit?.topics?.[0] || null;
      update();
    });

    if (innerCourse) {
      container.querySelector('#level-sel').addEventListener('change', (e) => {
        level = e.target.value;
      });
      container.querySelector('#unit-sel').addEventListener('change', (e) => {
        unit = innerCourse.units.find(u => u.num == e.target.value);
        topic = unit?.topics?.[0] || null;
        update();
      });
      container.querySelector('#topic-sel').addEventListener('change', (e) => {
        topic = e.target.value;
      });
      container.querySelector('#gen-btn').addEventListener('click', () => {
        generateNotes(container.querySelector('#notes-output'), innerCourse, unit, topic, level, getPrerequisites, getCrossConnections, getTextbookRef);
        container.querySelector('#print-btn').style.display = 'flex';
      });
    }

    container.querySelector('#print-btn').addEventListener('click', () => window.print());
  }
  update();
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
    if (window.mermaid) {
      try {
        await window.mermaid.run({ nodes: output.querySelectorAll('.mermaid') });
      } catch (e) {
        console.error('Mermaid render error:', e);
      }
    }
    renderVisuals();
  }, 400);
}

async function getNoteContentAsync(course, unit, topic, level, externalData, aiNotesHTML) {
  const isDeep = level === 'advanced_level';
  const noteData = getTopicNoteData(course, unit, topic, isDeep);

  const searchQuery = externalData.bookInfo ? `${externalData.bookInfo.title} ${externalData.bookInfo.author}` : `${topic} textbook`;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  const knimbusUrl = `https://www.knimbus.com/`;

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
    const cleanTopic = topicName.split('-')[0].split('(')[0].trim();
    const searchRes = await fetchWithTimeout(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanTopic)}&utf8=&format=json&origin=*`, { timeout: 10000 });
    const searchData = await searchRes.json();
    let wikiInfo = { title: topicName, extract: "General theoretical context based on standard university physics/math definitions.", sentences: [] };

    if (searchData.query && searchData.query.search.length > 0) {
      const pageId = searchData.query.search[0].pageid;
      const pageRes = await fetchWithTimeout(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=5&exlimit=1&pageids=${pageId}&explaintext=1&format=json&origin=*`, { timeout: 10000 });
      const pageData = await pageRes.json();
      const page = pageData.query.pages[pageId];

      wikiInfo.title = page.title;
      wikiInfo.extract = page.extract;
      wikiInfo.sentences = page.extract.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(s => s.length > 20);
    }

    let bookInfo = null;
    if (primaryTextbook) {
      const authorTitle = primaryTextbook.split(',');
      const searchStr = authorTitle[0].trim() + (authorTitle[1] ? " " + authorTitle[1].trim() : "");
      const bookRes = await fetchWithTimeout(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchStr)}&limit=1`, { timeout: 10000 });
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

    return { wikiTitle: wikiInfo.title, wikiSummary: wikiInfo.extract, sentences: wikiInfo.sentences, bookInfo: bookInfo };
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
  const topicLower = topic.toLowerCase();

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

export function renderVisuals() {
  document.querySelectorAll('.visual-slot').forEach(async slot => {
    const query = slot.dataset.query;
    const type = slot.dataset.type;

    if (type === 'image') {
      const seed = Math.floor(Math.random() * 10000);
      const imageUrl = `/ai-img/${encodeURIComponent(query)}?width=1024&height=768&nologo=true&enhance=true&seed=${seed}`;

      // Show loading state
      slot.innerHTML = `
        <div class="ai-img-wrapper" style="position:relative; width:100%; max-width:640px; margin:0 auto; min-height:240px; background:var(--bg-tertiary); border-radius:12px; overflow:hidden; border:1px solid var(--border-color);">
          <div class="vis-loader" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; z-index:2;">
            <div style="font-size:2.5rem;">🎨</div>
            <div class="skeleton-text" style="font-size:0.9rem;">Generating high-intellect visual...</div>
            <div style="font-size:0.7rem; color:var(--text-tertiary); max-width:220px; text-align:center;">${query.substring(0, 50)}...</div>
          </div>
        </div>`;

      const wrapper = slot.querySelector('.ai-img-wrapper');

      // Fetch as blob to bypass ORB browser security
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        wrapper.innerHTML = `
          <img src="${blobUrl}"
               style="width:100%; display:block; border-radius:12px; box-shadow:0 12px 40px rgba(0,0,0,0.5);"
               alt="${query}">
          <div style="background:rgba(0,0,0,0.7); color:white; font-size:0.75rem; padding:8px 12px; border-radius:0 0 12px 12px; text-align:left; backdrop-filter:blur(4px);">
            ✨ AI Generated: ${query.length > 80 ? query.substring(0, 77) + '...' : query}
          </div>`;
        // Revoke blob URL after 5 minutes to free memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 300000);
      } catch (err) {
        console.warn('Image fetch failed:', err);
        wrapper.innerHTML = `
          <div style="padding:24px; text-align:center;">
            <div style="font-size:2rem; margin-bottom:8px;">🖼️</div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">Visual for: <em>${query.substring(0, 60)}</em></div>
            <a href="https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=1024&height=768&nologo=true" target="_blank"
               style="font-size:0.75rem; color:var(--accent-cyan); text-decoration:underline;">🔗 Open image in new tab</a>
          </div>`;
      }
    } else if (type === 'video') {
      const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' educational science')}`;
      slot.innerHTML = `
        <div class="card" style="padding:16px; border:1px dashed var(--accent-cyan); background:var(--bg-tertiary);">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <div style="font-size:1.5rem;">🎬</div>
            <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary);">Extended Learning: Video Resources</div>
          </div>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">Explore high-quality animations and lectures for "${query}" to visualize the concepts better.</p>
          <div style="display:flex; gap:10px;">
            <a href="${ytSearch}" target="_blank" class="btn btn-primary btn-sm" style="background:#ff0000; border:none;">▶ Watch on YouTube</a>
            <a href="https://vimeo.com/search?q=${encodeURIComponent(query)}" target="_blank" class="btn btn-secondary btn-sm">🎥 Search Vimeo</a>
          </div>
        </div>
      `;
    }
  });
}

