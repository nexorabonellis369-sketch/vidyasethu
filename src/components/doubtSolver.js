// Doubt Solver Component
export function renderDoubtSolver(container, { inferCourse, getCourseByCode, getPrerequisites, getCrossConnections }) {
  let chatHistory = [];

  container.innerHTML = `
    <div class="animate-fade">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-icon purple">🧠</div>
          <div>
            <div class="card-title">AI Doubt Solver</div>
            <div class="card-desc">Type your doubt in plain English. The solver maps it to your syllabus and gives a step-by-step solution.</div>
          </div>
        </div>
        <div class="chip-list" style="margin-top:12px;">
          ${['What is Greens theorem?', 'Explain damped SHM', 'How does Bernoullis theorem apply to Venturimeter?', 'What is Fourier series?', 'Explain Zeeman effect', 'What is a stack in data structures?'].map(q => `<div class="chip sample-q">${q}</div>`).join('')}
        </div>
      </div>

      <div class="card" style="padding:16px;">
        <div class="chat-container" id="chat-messages">
          <div class="chat-msg assistant">
            👋 Hi! I'm your BSc Applied Science Companion. Ask me any doubt from your syllabus — I'll map it to your course, unit, and topic, then solve it step by step.<br><br>
            <em style="color:var(--text-tertiary);font-size:0.8rem;">Try the sample questions above, or type your own doubt below.</em>
          </div>
        </div>
        
        <!-- Hidden Camera UI Sandbox -->
        <div id="camera-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; flex-direction:column;">
          <div style="background:var(--bg-secondary); padding:16px; border-radius:12px; width:90%; max-width:400px; text-align:center;">
            <video id="camera-feed" autoplay playsinline style="width:100%; aspect-ratio:4/3; background:#000; border-radius:8px; margin-bottom:12px; transform: scaleX(-1);"></video>
            <canvas id="camera-canvas" style="display:none;"></canvas>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <button id="camera-close" class="btn btn-outline" style="flex:1;">Cancel</button>
              <button id="camera-capture" class="btn btn-primary" style="flex:1;">📸 Capture</button>
            </div>
          </div>
        </div>

        <div class="chat-input-area" style="margin-top:16px;">
          <textarea id="doubt-input" placeholder="Type your doubt here..." rows="2"></textarea>
          <div style="display:flex; flex-direction:column; gap:8px; justify-content:space-between; align-items:flex-end;">
            <button id="doubt-photo" class="btn btn-outline btn-sm" style="border-radius:50%; width:36px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-color:var(--accent-cyan); color:var(--accent-cyan);" title="Take Photo">📷</button>
            <button id="doubt-voice" class="btn btn-outline btn-sm" style="border-radius:50%; width:36px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-color:var(--accent-purple); color:var(--accent-purple);" title="Voice Search">🎤</button>
            <button id="doubt-send" class="btn btn-primary btn-sm">Send ↑</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const chatMessages = document.getElementById('chat-messages');
  const doubtInput = document.getElementById('doubt-input');
  const doubtSend = document.getElementById('doubt-send');
  const doubtVoice = document.getElementById('doubt-voice');
  const doubtPhoto = document.getElementById('doubt-photo');

  // Camera UI Elements
  const cameraModal = document.getElementById('camera-modal');
  const cameraFeed = document.getElementById('camera-feed');
  const cameraCanvas = document.getElementById('camera-canvas');
  const cameraClose = document.getElementById('camera-close');
  const cameraCaptureBtn = document.getElementById('camera-capture');
  let currentImageBase64 = null;
  let videoStream = null;

  function stopCamera() {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      videoStream = null;
    }
    cameraFeed.srcObject = null;
    cameraModal.style.display = 'none';
  }

  doubtPhoto.addEventListener('click', async () => {
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      cameraFeed.srcObject = videoStream;
      cameraFeed.style.transform = 'none'; // Back camera shouldn't be mirrored
      cameraModal.style.display = 'flex';
    } catch (e) {
      try {
        // Fallback to front camera if environment isn't found
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraFeed.srcObject = videoStream;
        cameraFeed.style.transform = 'scaleX(-1)';
        cameraModal.style.display = 'flex';
      } catch (err) {
        alert("Camera access denied or not available. Please check permissions.");
      }
    }
  });

  cameraClose.addEventListener('click', stopCamera);

  cameraCaptureBtn.addEventListener('click', () => {
    const ctx = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraFeed.videoWidth;
    cameraCanvas.height = cameraFeed.videoHeight;
    ctx.drawImage(cameraFeed, 0, 0);
    // Highly compressed JPEG to keep token size low for Gemini/GPT
    currentImageBase64 = cameraCanvas.toDataURL('image/jpeg', 0.5);

    stopCamera();

    // Add visual indicator to chat
    appendMsg('user', `<div style="margin-bottom:8px;"><img src="${currentImageBase64}" style="max-height:100px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div><div style="font-size:0.8rem; color:#aaa;">Photo uploaded. Add text and send.</div>`);
    doubtInput.placeholder = "What is your doubt about this photo?";
    doubtInput.focus();
  });

  function sendDoubt(q) {
    if (!q.trim() && !currentImageBase64) return;
    stopRecording();

    if (!currentImageBase64) {
      appendMsg('user', q);
    } // else: we already appended the image in the capture function, the text handles below

    const queryText = q;
    const imageData = currentImageBase64;

    doubtInput.value = '';
    doubtInput.placeholder = "Type your doubt here...";
    currentImageBase64 = null; // Clear staging area

    setTimeout(() => solveDoubt(queryText, imageData), 400);
  }

  // Web Speech API for Voice Search
  let isRecording = false;
  let recognition = null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      isRecording = true;
      doubtVoice.style.background = 'var(--accent-rose)';
      doubtVoice.style.color = '#fff';
      doubtVoice.style.borderColor = 'var(--accent-rose)';
      doubtVoice.innerHTML = '🛑';
      doubtInput.placeholder = "Listening... Speak now.";
    };

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      doubtInput.value = transcript;
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e.error);
      stopRecording();
      if (e.error !== 'no-speech') {
        doubtInput.placeholder = "Failed to hear. " + e.error;
      }
    };

    recognition.onend = () => {
      stopRecording();
    };

    doubtVoice.addEventListener('click', () => {
      if (isRecording) {
        recognition.stop();
      } else {
        try {
          recognition.start();
        } catch (err) {
          console.error(err);
          stopRecording();
        }
      }
    });
  } else {
    doubtVoice.style.display = 'none';
  }

  function stopRecording() {
    isRecording = false;
    if (recognition) {
      try { recognition.stop(); } catch (e) { }
    }
    doubtVoice.style.background = 'transparent';
    doubtVoice.style.color = 'var(--accent-purple)';
    doubtVoice.style.borderColor = 'var(--accent-purple)';
    doubtVoice.innerHTML = '🎤';
    doubtInput.placeholder = "Type your doubt here... (or use voice)";
  }

  doubtSend.addEventListener('click', () => sendDoubt(doubtInput.value));
  doubtInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendDoubt(doubtInput.value); }
  });

  document.querySelectorAll('.sample-q').forEach(chip => {
    chip.addEventListener('click', () => sendDoubt(chip.textContent));
  });

  function appendMsg(role, html) {
    const d = document.createElement('div');
    d.className = `chat-msg ${role}`;
    d.innerHTML = html;
    chatMessages.appendChild(d);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // After inserting the message, render any diagram/photo slots it contains
    setTimeout(() => renderDoubtDiagrams(d), 300);
  }

  function solveDoubt(query, imageData) {
    const match = inferCourse(query);
    const loading = document.createElement('div');
    loading.className = 'chat-msg assistant';
    loading.innerHTML = '<div class="skeleton skeleton-line" style="width:200px;"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line" style="width:80%;"></div>';
    chatMessages.appendChild(loading);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(async () => {
      try {
        const solution = await generateSolution(query, match, getCourseByCode, getPrerequisites, getCrossConnections, imageData);
        loading.remove();
        appendMsg('assistant', solution);
      } catch (err) {
        console.error(err);
        loading.remove();
        appendMsg('assistant', `<div style="color:var(--accent-rose); background:rgba(255,59,48,0.1); padding:12px; border-radius:8px;"><strong>Error connecting to AI tutor:</strong> ${err.message}. Please check your connection or API key.</div>`);
      }
    }, 300);
  }
}

// ── Diagram renderer for the doubt solver chat bubble ───────────────────────
async function renderDoubtDiagrams(container) {
  const GEMINI_KEY = "AIzaSyBxkr2pIizg7eLOo5GmWHLj329uJQPwtyw";
  const slots = container.querySelectorAll('.ds-diagram-slot');
  if (!slots.length) return;

  const svgPrompt = (query) => {
    const isGraph = /graph|curve|plot|waveform|vs |versus|displacement|velocity|time|frequency|spectrum/i.test(query);
    const isCircuit = /circuit|cell|electrode|battery|capacitor|resistor|transistor|diode/i.test(query);
    const isForce = /force|vector|diagram|field|free body|stress|torque|equilibrium/i.test(query);
    let extra = '';
    if (isGraph) extra = '\n- This is a GRAPH/CURVE diagram. Draw accurate X and Y axes with labels and units. Show the curve/waveform correctly plotted. Mark key points.';
    else if (isCircuit) extra = '\n- This is a CIRCUIT/CELL diagram. Show all components as standard symbols. Label terminals, electrodes, current direction with arrows.';
    else if (isForce) extra = '\n- This is a FORCE/VECTOR diagram. Show all vectors as bold arrows. Label each force with name and direction clearly.';
    else extra = '\n- This is a PHYSICAL SETUP diagram. Show the real-world arrangement of components, label each part clearly with leader lines.';

    return `You are a precise scientific diagram generator. Generate a clean, accurate, well-labeled SVG diagram for: "${query}".
STRICT RULES:
- Output ONLY raw SVG code. Start with <svg, end with </svg>. Nothing else.
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

  const wrapStyle = 'text-align:center;margin:16px 0;background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;padding:10px 14px;box-shadow:0 2px 8px rgba(0,0,0,0.07);';
  const labelStyle = 'font-size:0.7rem;color:#888;margin-bottom:4px;text-align:left;';
  const imgStyle = 'max-width:100%;height:auto;border-radius:8px;background:#fff;padding:4px;';

  function extractSVG(text, el, query) {
    text = text.replace(/```svg\s*/gi, '').replace(/```xml\s*/gi, '').replace(/```\s*/g, '').trim();
    const m = text.match(/<svg[\s\S]*<\/svg>/i);
    if (m) {
      el.outerHTML = `<div style="${wrapStyle}"><div style="${labelStyle}">📐 Diagram: ${query}</div>${m[0]}</div>`;
      return true;
    }
    return false;
  }

  slots.forEach(async (el) => {
    const query = el.dataset.query;
    const type = el.dataset.type || 'diagram';
    if (!query) return;

    // ── REAL_PHOTO path ────────────────────────────────────────────────────
    if (type === 'photo') {
      try {
        const encoded = encodeURIComponent(query);
        const res = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encoded}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&format=json&origin=*`);
        const data = await res.json();
        const pages = data.query && data.query.pages;
        if (pages) {
          const urls = Object.values(pages).map(p => p.imageinfo?.[0]?.url).filter(u => u && !/\.(svg|ogg|webm|mp3|wav|pdf)$/i.test(u));
          for (const url of urls) {
            const ok = await new Promise(r => { const i = new Image(); i.onload = () => r(true); i.onerror = () => r(false); i.src = url; });
            if (ok) { el.outerHTML = `<div style="${wrapStyle}"><div style="${labelStyle}">📷 Real-World: ${query}</div><img src="${url}" style="${imgStyle}" alt="${query}" /></div>`; return; }
          }
        }
        // Wikipedia thumbnail fallback
        const slug = encodeURIComponent(query.split(' ').slice(0, 3).join('_'));
        const res2 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`);
        const d2 = await res2.json();
        if (d2.thumbnail?.source) {
          el.outerHTML = `<div style="${wrapStyle}"><div style="${labelStyle}">📷 Real-World: ${query}</div><img src="${d2.thumbnail.source}" style="${imgStyle};max-width:340px;" alt="${query}" /></div>`;
          return;
        }
      } catch (e) { }
      el.outerHTML = `<div style="${wrapStyle}padding:14px;"><div style="${labelStyle}">📷 ${query}</div><strong>${query}</strong></div>`;
      return;
    }

    // ── WIKI_DIAGRAM path: AI SVG ──────────────────────────────────────────
    // Tier 1: Gemini
    for (const model of ['gemini-2.0-flash-lite', 'gemini-1.5-flash']) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: svgPrompt(query) }] }], generationConfig: { temperature: 0.05, maxOutputTokens: 2500 } })
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text && extractSVG(text, el, query)) return;
      } catch (e) { }
    }

    // Tier 2: puter.ai.chat → SVG
    try {
      if (typeof puter !== 'undefined' && puter.ai && puter.ai.chat) {
        for (const m of ['claude-3-7-sonnet', 'gpt-4o', 'claude-3-5-sonnet', 'gpt-4o-mini']) {
          try {
            const resp = await puter.ai.chat([
              { role: 'system', content: 'You are a precise SVG diagram generator. Output ONLY raw SVG code, nothing else. No markdown, no fences.' },
              { role: 'user', content: svgPrompt(query) }
            ], { model: m });
            const text = resp?.message?.content || resp?.content || (typeof resp === 'string' ? resp : '');
            if (text && extractSVG(text, el, query)) return;
          } catch (me) { }
        }
      }
    } catch (e) { }

    // Tier 3: Readable fallback label
    el.outerHTML = `<div style="${wrapStyle}padding:16px;"><div style="${labelStyle}">📐 ${query}</div><div style="font-size:0.9rem;color:#444;"><strong>${query}</strong></div></div>`;
  });
}

async function generateSolution(query, match, getCourseByCode, getPrerequisites, getCrossConnections, imageData) {
  let contextHeader = "";

  const SYMBOL_RULES = `RULE ZERO - MATHEMATICAL SYMBOLS & FORMATTING (Strictly enforced - violations not acceptable):
1. Always write the mathematical symbol, NEVER the word.
   Examples: π (not 'pi'), ω (not 'omega'), α β γ θ λ μ σ ρ φ τ δ (not 'alpha', 'beta', etc.).
   Calculus: ∂ (not 'partial'), ∇ (not 'nabla'), ∞ (not 'infinity'), ∫ (not 'integral'), ∑ (not 'sum').
   Operators: × (not 'cross'), ÷ (not 'divided by'), ± (not 'plus-minus'), ≈ (not 'approx').
2. DO NOT use LaTeX math delimiters! NEVER use \\(...\\), \\[...\\], $, or $$ wrappers around your equations.
3. Write formulas in plain, accessible text using standard HTML and Unicode (e.g., (A^†)^† = A).
4. Do not use complex unreadable markup like \\dagger or \\frac. Keep equations clean, directly readable, and visually accessible in raw HTML.`;

  const systemPrompt = `You are "Vidhyasethu", a highly intelligent AI academic tutor for PSG College of Technology students. 
        Your goal is to explain concepts clearly, solve problems step-by-step, and provide textbook/syllabus references.

${SYMBOL_RULES}

CRITICAL FORMATTING — Output ONLY raw HTML (never markdown):
1. NEVER output Markdown (**bold** or ![]() images). YOU MUST OUTPUT STRICTLY RAW HTML (<strong>, <img>).
2. Section headings: <h3>📐 Heading</h3>
3. Derivations — STRICT 3-PART FORMAT for every step:
   PART A: bold label — one sentence stating the mathematical action ('Start with energy conservation', 'Divide both sides by m', 'Substitute v=u+at into...')
   PART B: the equation for THIS step only in a formula-block. ONE equation per step only.
   PART C: plain English sentence starting with => explaining WHY this step is valid and what it physically means. Use an everyday analogy.
   Rule: NEVER dump multiple equations in one block without explanation.
4. Formulas — Every formula must have a variable legend table immediately below it:
   Each row shows: symbol | full name | unit | plain-English meaning.
   Example: x = displacement (metres, m) = how far the object moved from its starting position.
   Use the formula-block div for the equation, and a simple table below for the variables.
5. Tips: <div class="callout callout-info"><div class="callout-icon">💡</div><div>tip</div></div>
6. Warnings: <div class="callout callout-warning"><div class="callout-icon">⚠️</div><div>warning</div></div>
7. Code: <div class="code-block">code</div>
8. Paragraphs: <p>text</p>
9. Visuals: You MUST include 1-2 visuals per answer. Choose the best type:

   TYPE A — Technical Diagram (graphs, circuits, force diagrams, schematics):
   [WIKI_DIAGRAM: SHM displacement-time graph]

   TYPE B — Real-World Photo (for real machines, devices, instruments, phenomena):
   [REAL_PHOTO: grandfather clock pendulum]

   DECISION RULE: ABSTRACT concept (graph, derivation) → use [WIKI_DIAGRAM]. FAMILIAR REAL OBJECT → use [REAL_PHOTO].
   Do NOT write <img> tags or SVG directly.

MANDATORY CONTENT INCLUSION:
- Explain using simple, everyday language with a relatable analogy.
- Show clear visual diagrams using [WIKI_DIAGRAM] or [REAL_PHOTO] — placed right where they help most.
- Include all key formulas in <div class="formula-block">.
- Provide at least 1 solved numerical example using <div class="step"> format.
- End with a quick Key Points summary.

Cover: simple definition → real photo/diagram → formula → intuitive explanation → example sum → key points.`;

  let userMessage = `Student Doubt: ${query}`;

  if (match) {
    contextHeader = `
      <div class="syllabus-header" style="margin-bottom:16px;">
        <div class="sh-item"><span class="sh-label">Course:</span><span class="sh-value">${match.courseCode} – ${match.courseTitle}</span></div>
        <span class="sh-sep">|</span>
        <div class="sh-item"><span class="sh-label">Unit ${match.unitNum}:</span><span class="sh-value">${match.unitTitle}</span></div>
        <span class="sh-sep">|</span>
        <div class="sh-item"><span class="sh-label">Topic:</span><span class="sh-value">${match.topic}</span></div>
      </div>`;
    userMessage = `Topic context: "${match.topic}" — Unit ${match.unitNum} (${match.unitTitle}) of "${match.courseCode} – ${match.courseTitle}". Give a deep, exam-focused answer.\n\nStudent Doubt: ${query}`;
  }

  const messages = [
    { role: "system", content: systemPrompt }
  ];

  // If there's an image, construct a vision message format
  if (imageData) {
    const base64Data = imageData.split(',')[1];

    // For Puter/OpenAI format
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userMessage },
        { type: "image_url", image_url: { url: imageData } }
      ]
    });

    // For Gemini format (save to variables accessible later)
    var geminiUserParts = [
      { text: userMessage },
      { inlineData: { mimeType: "image/jpeg", data: base64Data } }
    ];
  } else {
    messages.push({ role: "user", content: userMessage });
    var geminiUserParts = [{ text: userMessage }];
  }

  function cleanHtml(text) {
    let clean = text
      .replace(/⚠️\s*\*\*IMPORTANT NOTICE\*\*[\s\S]*?will continue to work normally\./gi, '')
      .replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();

    // ── Strip LaTeX delimiters so they render as readable plain text ──────────
    // \( ... \)  →  just the inner expression
    clean = clean.replace(/\\\(([\s\S]*?)\\\)/g, '$1');
    // \[ ... \]  →  just the inner expression
    clean = clean.replace(/\\\[([\s\S]*?)\\\]/g, '$1');
    // $$ ... $$  →  just the inner expression
    clean = clean.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
    // $ ... $  →  just the inner expression (single dollar, guarded to avoid over-matching)
    clean = clean.replace(/\$([^\n$]{1,200})\$/g, '$1');
    // Common LaTeX commands → Unicode equivalents
    clean = clean
      .replace(/\\dagger/g, '†')
      .replace(/\\dag/g, '†')
      .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
      .replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
      .replace(/\\sqrt/g, '√')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\pm/g, '±')
      .replace(/\\approx/g, '≈')
      .replace(/\\neq/g, '≠')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\nu/g, 'ν')
      .replace(/\\pi/g, 'π')
      .replace(/\\rho/g, 'ρ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\tau/g, 'τ')
      .replace(/\\phi/g, 'φ')
      .replace(/\\omega/g, 'ω')
      .replace(/\\Omega/g, 'Ω')
      .replace(/\\partial/g, '∂')
      .replace(/\\nabla/g, '∇')
      .replace(/\\infty/g, '∞')
      .replace(/\\int/g, '∫')
      .replace(/\\sum/g, '∑')
      .replace(/\\prod/g, '∏')
      .replace(/\\in/g, '∈')
      .replace(/\\subset/g, '⊂')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\leftarrow/g, '←')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\hat\{([^}]*)\}/g, '$1̂')
      .replace(/\\vec\{([^}]*)\}/g, '$1⃗')
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\mathbf\{([^}]*)\}/g, '<strong>$1</strong>')
      .replace(/\\left[[(|)\]]/g, '').replace(/\\right[[(|)\]]/g, '')
      .replace(/\{/g, '').replace(/\}/g, '')  // remove remaining lone braces from LaTeX
      .replace(/\\_([a-zA-Z0-9]+)/g, '<sub>$1</sub>') // _ → subscript
      .replace(/\\\^([a-zA-Z0-9]+)/g, '<sup>$1</sup>'); // \^ → superscript

    // Fix markdown bold
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Auto-fix mathematical superscripts (e.g. x^2 -> x<sup>2</sup>)
    clean = clean.replace(/([a-zA-Z0-9)])\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>');

    // Convert [WIKI_DIAGRAM:] → diagram slot
    clean = clean.replace(/!?\[WIKI_DIAGRAM:\s*(.+?)\]/gi, (_, q) => {
      const safe = q.trim().replace(/[^a-zA-Z0-9\s]/g, '');
      const id = 'ds-diag-' + Math.floor(Math.random() * 9999999);
      return `<div id="${id}" class="ds-diagram-slot" data-query="${safe}" data-type="diagram" style="text-align:center;margin:16px 0;padding:12px;font-size:0.85rem;color:var(--text-secondary);">📐 Generating diagram for "${safe}"…</div>`;
    });

    // Convert [REAL_PHOTO:] → photo slot
    clean = clean.replace(/!?\[REAL_PHOTO:\s*(.+?)\]/gi, (_, q) => {
      const safe = q.trim().replace(/[^a-zA-Z0-9\s]/g, '');
      const id = 'ds-diag-' + Math.floor(Math.random() * 9999999);
      return `<div id="${id}" class="ds-diagram-slot" data-query="${safe}" data-type="photo" style="text-align:center;margin:16px 0;padding:12px;font-size:0.85rem;color:var(--text-secondary);">📷 Loading photo for "${safe}"…</div>`;
    });

    // Handle any leftover old [IMAGE:] tags (safety net)
    clean = clean.replace(/!?\[IMAGE:\s*(.+?)\]/gi, (_, q) => {
      const safe = q.trim().replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 80);
      const id = 'ds-diag-' + Math.floor(Math.random() * 9999999);
      return `<div id="${id}" class="ds-diagram-slot" data-query="${safe}" data-type="diagram" style="text-align:center;margin:16px 0;padding:12px;font-size:0.85rem;color:var(--text-secondary);">📐 Generating diagram for "${safe}"…</div>`;
    });

    return clean;
  }

  // ── 1. Puter.js — Claude 3.7 Sonnet (best, free) ────────────────────────
  const puterModels = ['claude-3-7-sonnet', 'gpt-4o', 'claude-3-5-sonnet', 'gpt-4o-mini'];
  for (const model of puterModels) {
    try {
      if (typeof puter !== 'undefined' && puter.ai) {
        const resp = await puter.ai.chat(messages, { model });
        const text = resp?.message?.content || resp?.content || (typeof resp === 'string' ? resp : '');
        if (text && text.length > 30) {
          console.log(`DoubtSolver - Success with puter model: ${model}`);
          return contextHeader + cleanHtml(text);
        }
      }
    } catch (e) {
      console.warn(`DoubtSolver - Puter ${model} failed:`, e.message);
    }
  }

  // ── 2. Gemini API ────────────────────────────────────────────────────────
  const GEMINI_KEY = "AIzaSyBxkr2pIizg7eLOo5GmWHLj329uJQPwtyw";
  const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"];
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: geminiUserParts }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.2, maxOutputTokens: 3000 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.length > 30) {
          console.log(`DoubtSolver - Success with Gemini: ${model}`);
          return contextHeader + cleanHtml(text);
        }
      }
    } catch (e) {
      console.warn(`DoubtSolver - Gemini ${model} error:`, e.message);
    }
  }

  // ── 3. Pollinations fallback ─────────────────────────────────────────────
  for (const model of ["openai", "openai-large"]) {
    try {
      // Ensure we only send text to Pollinations, as its endpoint may reject vision payload objects
      const fallbackMessages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ];
      const res = await fetch("https://text.pollinations.ai/openai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: fallbackMessages, temperature: 0.2 })
      });
      if (!res.ok) continue;
      const data = await res.json();
      const text = cleanHtml(data.choices?.[0]?.message?.content || '');
      if (text.length > 30) return contextHeader + text;
    } catch (e) {
      console.warn(`DoubtSolver - Pollinations ${model} error:`, e.message);
    }
  }

  throw new Error("All AI services are currently unavailable. Please try again in a moment.");
}
