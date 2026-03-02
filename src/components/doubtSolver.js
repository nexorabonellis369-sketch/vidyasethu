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

    // After inserting the message, render any visual slots it contains
    setTimeout(async () => {
      renderVisuals(d);
      if (window.mermaid) {
        try {
          await window.mermaid.run({ nodes: d.querySelectorAll('.mermaid') });
        } catch (e) {
          console.error('Mermaid render error:', e);
        }
      }
    }, 400);
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

// ── Visual renderer for the doubt solver chat bubble ───────────────────────
export async function renderVisuals(container) {
  const slots = container.querySelectorAll('.visual-slot');
  if (!slots.length) return;

  slots.forEach(async (slot) => {
    const query = slot.dataset.query;
    const type = slot.dataset.type;
    if (!query) return;

    if (type === 'image') {
      const seed = Math.floor(Math.random() * 10000);
      const imageUrl = `/ai-img/${encodeURIComponent(query)}?width=1024&height=768&nologo=true&enhance=true&seed=${seed}`;

      // Show loading state
      slot.innerHTML = `
        <div class="ai-img-wrapper" style="position:relative; width:100%; max-width:560px; margin:0 auto; min-height:220px; background:var(--bg-tertiary); border-radius:12px; overflow:hidden; border:1px solid var(--border-color);">
          <div class="vis-loader" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; z-index:2;">
            <div style="font-size:2rem;">🎨</div>
            <div class="skeleton-text" style="font-size:0.85rem;">Generating image...</div>
            <div style="font-size:0.7rem; color:var(--text-tertiary); max-width:200px; text-align:center;">${query.substring(0, 40)}...</div>
          </div>
        </div>`;

      const wrapper = slot.querySelector('.ai-img-wrapper');

      // Fetch as blob via Vite proxy to bypass ORB/CORS
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        wrapper.innerHTML = `
          <img src="${blobUrl}"
               style="width:100%; display:block; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.4);"
               alt="${query}">
          <div style="background:rgba(0,0,0,0.7); color:#fff; font-size:0.7rem; padding:6px 10px; border-radius:0 0 12px 12px; text-align:left; backdrop-filter:blur(4px);">
            ✨ AI Generated: ${query.length > 50 ? query.substring(0, 47) + '...' : query}
          </div>`;
        setTimeout(() => URL.revokeObjectURL(blobUrl), 300000);
      } catch (err) {
        console.warn('Image fetch failed:', err);
        wrapper.innerHTML = `
          <div style="padding:20px; text-align:center;">
            <div style="font-size:2rem; margin-bottom:8px;">🖼️</div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">Visual for: <em>${query.substring(0, 60)}</em></div>
            <a href="https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=1024&height=768&nologo=true" target="_blank"
               style="font-size:0.75rem; color:var(--accent-cyan); text-decoration:underline;">🔗 Open image in new tab</a>
          </div>`;
      }
    } else if (type === 'video') {
      const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' educational')}`;
      slot.innerHTML = `
         <div style="border:1px solid var(--accent-purple); background:var(--bg-secondary); padding:10px; border-radius:10px; text-align:left;">
           <div style="font-weight:600; font-size:0.85rem; margin-bottom:4px;">🎥 Recommended Video</div>
           <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:8px;">Visual explanation for "${query}"</div>
           <a href="${ytSearch}" target="_blank" class="btn btn-primary btn-sm" style="background:#ff0000; border:none; font-size:0.7rem;">▶ Watch on YouTube</a>
         </div>`;
    }
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
2. Layout — Use premium note-taking structures:

   A. CORNELL METHOD (for definitions/concepts):
      <div class="cornell-layout">
        <div class="cornell-cues">Conceptual Cue</div>
        <div class="cornell-notes">Detailed Explanation</div>
      </div>

   B. FLOW NOTES (for step-by-step logic):
      <div class="flow-container">
        <div class="flow-box">Initial State</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-box">Result</div>
      </div>

   C. BULLET JOURNALING (for key takeaways):
      <ul class="bujo-list">
        <li class="bujo-item"><span class="bujo-symbol">★</span><div class="bujo-text">Important Rule</div></li>
        <li class="bujo-item"><span class="bujo-symbol">▲</span><div class="bujo-text">Example Application</div></li>
      </ul>

5. Visuals & Diagrams (Mandatory):
   - Use \` \` \`mermaid \` blocks for flowcharts and logic. IMPORTANT: Use double quotes for any node labels containing spaces or special characters (e.g., A["Start Process"] or B["Is it full?"]).
   - Use [AI_IMAGE: descriptive prompt] for technical graphs and photos. Keep the prompt as plain text (no HTML tags).
   - Use [VIDEO_SEARCH: topic name] for educational animations.

MANDATORY CONTENT INCLUSIONS:
- Include at least one Mermaid flow-chart (with quoted labels).
- Include 1-2 [AI_IMAGE: ...] tags for technical visualizations.
- Use Cornell Layout for the initial explanation.
- Use Flow Notes for derivations/processes.
- End with a Bujo-style Key Points summary.
- Always include at least one [VIDEO_SEARCH: ...] tag for complex queries.`;

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

    // For OpenAI format
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
      .trim();

    const placeholders = [];

    // 1. EXTRACTION - Pull out all technical tags into placeholders
    // This protects them from being "fixed" by math formatting rules.

    // A. AI Images
    clean = clean.replace(/!?\[AI_IMAGE:\s*(.+?)\]/gi, (_, q) => {
      const safe = q.trim().replace(/['"]/g, '');
      const id = 'ds-vis-' + Math.floor(Math.random() * 9999999);
      const slot = `<div id="${id}" class="visual-slot" data-query="${safe}" data-type="image" style="text-align:center;margin:16px 0;background:var(--bg-tertiary);border-radius:12px;overflow:hidden;min-height:180px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-color);">
        <div class="vis-loader" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:var(--bg-tertiary); border-radius:12px;">
           <div class="skeleton-text">🎨 Rendering Intelligence...</div>
        </div>
        <div class="skeleton-text">🎨 Generating visual for "${safe.substring(0, 20)}..."</div>
      </div>`;
      const p = `@@@VISUAL_SLOT_${placeholders.length}@@@`;
      placeholders.push(slot);
      return p;
    });

    // B. Video Search
    clean = clean.replace(/!?\[VIDEO_SEARCH:\s*(.+?)\]/gi, (_, q) => {
      const safe = q.trim().replace(/['"]/g, '');
      const id = 'ds-vis-' + Math.floor(Math.random() * 9999999);
      const slot = `<div id="${id}" class="visual-slot" data-query="${safe}" data-type="video" style="margin:16px 0;"></div>`;
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

    // E. Legacy Tags
    clean = clean.replace(/!?\[(WIKI_DIAGRAM|REAL_PHOTO|IMAGE):\s*(.+?)\]/gi, (_, type, q) => {
      const safe = q.trim().replace(/['"]/g, '');
      const id = 'ds-vis-' + Math.floor(Math.random() * 9999999);
      const slot = `<div id="${id}" class="visual-slot" data-query="${safe}" data-type="image" style="text-align:center;margin:16px 0;background:var(--bg-tertiary);border-radius:12px;overflow:hidden;min-height:180px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-color);">
         <div class="skeleton-text">🎨 Generating visual for "${safe.substring(0, 20)}..."</div>
       </div>`;
      const p = `@@@VISUAL_SLOT_${placeholders.length}@@@`;
      placeholders.push(slot);
      return p;
    });

    // 2. TRANSFORMATION - Format remaining neutral text

    // Strip remaining lone backticks
    clean = clean.replace(/```/g, '');

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

    // 3. RESTORATION - Put visuals back in
    placeholders.forEach((slot, i) => {
      clean = clean.replace(`@@@VISUAL_SLOT_${i}@@@`, slot);
    });

    return clean;
  }

  let errorDetails = [];

  try {
    const text = await generateContent(messages);
    if (text) return contextHeader + cleanHtml(text);
  } catch (e) {
    errorDetails.push(`AI Client Failed: ${e.message}`);
  }


  return `<div class="card" style="padding:16px; border: 1px solid var(--accent-rose); color: var(--accent-rose);">
    <div style="font-weight:bold;margin-bottom:8px;">⚠️ Connection to "Vidhyasethu" AI Failed</div>
    <div style="font-size:0.75rem; background:rgba(0,0,0,0.1); padding:8px; border-radius:4px; margin-bottom:10px; font-family:monospace;">
      <strong>Error Trace:</strong><br>
      ${errorDetails.slice(0, 3).join('<br>')}
    </div>
    <p style="font-size:0.85rem; color:var(--text-secondary);">The research servers are currently overloaded. Please try again in 30 seconds.</p>
  </div>`;
}
