import { generateContent } from '../utils/aiClient.js';
import { safeParseMarkdown, sanitizeAIResponse } from '../utils/formatter.js';

let selectedImageBase64 = null;
let selectedImageType = null;

export function renderDoubtSolver(container) {
    selectedImageBase64 = null;
    selectedImageType = null;

    container.innerHTML = `
        <div class="animate-fade">
            <div class="card-premium" style="margin-bottom: 24px; padding: 28px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                    <div class="card-icon purple" style="font-size: 1.6rem; width: 52px; height: 52px;">🤔</div>
                    <div>
                        <h1 style="font-size:1.5rem; font-weight: 800; margin: 0 0 4px;">AI Doubt Solver</h1>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin: 0;">Instant answers to your academic queries powered by GPT-4o.</p>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">❓ What is your doubt?</label>
                    <textarea id="doubt-input" class="form-select" style="min-height: 120px; padding: 12px; resize: vertical;" placeholder="Type your question here (e.g., Explain the physical significance of Green's theorem...)"></textarea>
                </div>

                <!-- Visual Input Area -->
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button id="camera-btn" class="btn btn-secondary" style="flex: 1; justify-content: center;">
                        <span style="font-size: 1.2rem; margin-right: 8px;">📷</span> Camera
                    </button>
                    <button id="gallery-btn" class="btn btn-secondary" style="flex: 1; justify-content: center;">
                        <span style="font-size: 1.2rem; margin-right: 8px;">📁</span> Gallery
                    </button>
                    <input type="file" id="gallery-input" accept="image/*" style="display: none;">
                </div>

                <!-- Image Preview -->
                <div id="image-preview-container" style="display: none; margin-bottom: 20px; position: relative;">
                    <div class="card-premium" style="padding: 8px; background: var(--bg-secondary);">
                        <img id="image-preview" style="width: 100%; border-radius: 8px; display: block;" />
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <button id="edit-image-btn" class="btn btn-ghost btn-sm" style="flex: 1;">✏️ Edit / Annotate</button>
                            <button id="remove-image-btn" class="btn btn-ghost btn-sm" style="flex: 1; color: var(--accent-rose);">🗑️ Remove</button>
                        </div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding: 10px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color);">
                    <input type="checkbox" id="math-mode-toggle" style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="math-mode-toggle" style="font-size: 0.85rem; color: var(--text-primary); cursor: pointer; font-weight: 600;">
                        🧮 Complex Math/Physics Mode (Meta Llama 3.1)
                    </label>
                </div>
                
                <button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:4px; padding: 14px; font-size: 1rem; border-radius: var(--radius-md);" id="solve-btn">
                    🚀 Solve Doubt
                </button>
            </div>
            
            <div id="solver-output"></div>
        </div>

        <!-- Image Editor Modal -->
        <div id="image-editor-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 2000; align-items: center; justify-content: center; padding: 20px;">
            <div class="card-premium" style="max-width: 900px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; background: var(--bg-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="margin: 0;">🎨 Annotate Your Query</h3>
                    <div style="display: flex; gap: 10px;">
                         <button id="editor-reset" class="btn btn-secondary btn-sm">🔄 Reset</button>
                         <button id="editor-close" class="btn btn-ghost btn-sm">✕ Close</button>
                    </div>
                </div>
                
                <div id="canvas-container" style="flex: 1; background: #000; position: relative; overflow: auto; min-height: 300px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <canvas id="editor-canvas"></canvas>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <span style="font-size: 0.85rem; color: var(--text-secondary);">Pen Tool:</span>
                        <input type="color" id="pen-color" value="#06b6d4" style="width: 30px; height: 30px; border: none; background: none; cursor: pointer;">
                        <input type="range" id="pen-width" min="1" max="10" value="3" style="width: 100px;">
                    </div>
                    <button id="save-edit-btn" class="btn btn-primary">💾 Save & Apply</button>
                </div>
            </div>
        </div>
    `;

    const solveBtn = container.querySelector('#solve-btn');
    const doubtInput = container.querySelector('#doubt-input');
    const mathToggle = container.querySelector('#math-mode-toggle');
    const output = container.querySelector('#solver-output');

    // UI Elements for images
    const cameraBtn = container.querySelector('#camera-btn');
    const galleryBtn = container.querySelector('#gallery-btn');
    const galleryInput = container.querySelector('#gallery-input');
    const previewContainer = container.querySelector('#image-preview-container');
    const previewImg = container.querySelector('#image-preview');
    const removeBtn = container.querySelector('#remove-image-btn');
    const editBtn = container.querySelector('#edit-image-btn');

    // Editor Modal Elements
    const editorModal = container.querySelector('#image-editor-modal');
    const editorCanvas = container.querySelector('#editor-canvas');
    const editorCtx = editorCanvas.getContext('2d');
    const saveEditBtn = container.querySelector('#save-edit-btn');
    const editorClose = container.querySelector('#editor-close');
    const editorReset = container.querySelector('#editor-reset');
    const penColorInput = container.querySelector('#pen-color');
    const penWidthInput = container.querySelector('#pen-width');

    let isDrawing = false;
    let originalImage = null;

    const showPreview = (src) => {
        previewImg.src = src;
        previewContainer.style.display = 'block';
        const [meta, data] = src.split(',');
        selectedImageBase64 = data;
        selectedImageType = meta.match(/:(.*?);/)[1];
    };

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            showPreview(e.target.result);
            const img = new Image();
            img.onload = () => { originalImage = img; };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    galleryBtn.addEventListener('click', () => galleryInput.click());
    galleryInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    cameraBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // Create a temporary video element
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            // Simple overlay UI for capture
            const captureOverlay = document.createElement('div');
            captureOverlay.style = "position:fixed; inset:0; z-index:5000; background:#000; display:flex; flex-direction:column; align-items:center; justify-content:center;";
            captureOverlay.innerHTML = `
                <video id="capture-video" style="max-width:100%; max-height:80vh; transform: scaleX(-1);"></video>
                <div style="display:flex; gap:20px; margin-top:20px;">
                    <button id="snap-btn" class="btn btn-primary btn-lg">📸 Capture</button>
                    <button id="cancel-snap-btn" class="btn btn-secondary btn-lg">✕ Cancel</button>
                </div>
            `;
            document.body.appendChild(captureOverlay);
            captureOverlay.querySelector('#capture-video').srcObject = stream;
            captureOverlay.querySelector('#capture-video').play();

            captureOverlay.querySelector('#snap-btn').onclick = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0);
                showPreview(canvas.toDataURL('image/jpeg'));

                const img = new Image();
                img.onload = () => { originalImage = img; };
                img.src = canvas.toDataURL('image/jpeg');

                stream.getTracks().forEach(track => track.stop());
                document.body.removeChild(captureOverlay);
            };

            captureOverlay.querySelector('#cancel-snap-btn').onclick = () => {
                stream.getTracks().forEach(track => track.stop());
                document.body.removeChild(captureOverlay);
            };

        } catch (err) {
            alert("Camera access denied or unavailable.");
        }
    });

    removeBtn.addEventListener('click', () => {
        selectedImageBase64 = null;
        selectedImageType = null;
        previewContainer.style.display = 'none';
        galleryInput.value = '';
    });

    // --- Image Editor Logic ---
    editBtn.addEventListener('click', () => {
        if (!originalImage) return;
        editorModal.style.display = 'flex';

        // Scale canvas to fit image while maintaining aspect ratio
        const maxWidth = 800;
        const maxHeight = 500;
        let width = originalImage.width;
        let height = originalImage.height;

        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }

        editorCanvas.width = width;
        editorCanvas.height = height;
        editorCtx.drawImage(originalImage, 0, 0, width, height);
    });

    const getMousePos = (e) => {
        const rect = editorCanvas.getBoundingClientRect();
        return {
            x: (e.clientX || e.touches?.[0].clientX) - rect.left,
            y: (e.clientY || e.touches?.[0].clientY) - rect.top
        };
    };

    const startDrawing = (e) => {
        isDrawing = true;
        const pos = getMousePos(e);
        editorCtx.beginPath();
        editorCtx.moveTo(pos.x, pos.y);
        e.preventDefault();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        editorCtx.lineTo(pos.x, pos.y);
        editorCtx.strokeStyle = penColorInput.value;
        editorCtx.lineWidth = penWidthInput.value;
        editorCtx.lineCap = 'round';
        editorCtx.stroke();
        e.preventDefault();
    };

    const stopDrawing = () => { isDrawing = false; };

    editorCanvas.addEventListener('mousedown', startDrawing);
    editorCanvas.addEventListener('mousemove', draw);
    editorCanvas.addEventListener('mouseup', stopDrawing);
    editorCanvas.addEventListener('touchstart', startDrawing);
    editorCanvas.addEventListener('touchmove', draw);
    editorCanvas.addEventListener('touchend', stopDrawing);

    editorReset.addEventListener('click', () => {
        editorCtx.drawImage(originalImage, 0, 0, editorCanvas.width, editorCanvas.height);
    });

    editorClose.addEventListener('click', () => {
        editorModal.style.display = 'none';
    });

    saveEditBtn.addEventListener('click', () => {
        const dataUrl = editorCanvas.toDataURL('image/jpeg');
        showPreview(dataUrl);
        const img = new Image();
        img.onload = () => { originalImage = img; };
        img.src = dataUrl;
        editorModal.style.display = 'none';
    });

    // --- Core Solve Logic ---
    solveBtn.addEventListener('click', async () => {
        const query = doubtInput.value.trim();
        if (!query && !selectedImageBase64) return;

        const isMathMode = mathToggle.checked;
        solveBtn.disabled = true;
        solveBtn.innerHTML = isMathMode ? '🧮 Computing Step-by-Step...' : '🧠 Thinking...';

        output.innerHTML = `
            <div class="card-premium animate-pulse" style="padding: 24px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="skeleton" style="width: 20px; height: 20px; border-radius: 50%;"></div>
                    <div id="solver-status-text" style="color: var(--text-secondary); font-size: 0.9rem;">
                        ${selectedImageBase64 ? 'Analyzing Visual Input...' : (isMathMode ? 'Initializing Reasoning Engine...' : 'Consulting AI Knowledge Base...')}
                    </div>
                </div>
            </div>
        `;

        try {
            let systemPrompt = "You are a PSG Tech professor. EXPLAIN DEEPLY. IMPORTANT: Write math horizontally on one line. Use ONLY simple symbols (√, ^, /, *). NO LaTeX. NO HTML. NO Code Blocks. Output RAW Markdown only.";
            let model = undefined;

            if (selectedImageBase64) {
                systemPrompt = "You are a Vision-Capable academic expert. Analyze this image with extreme precision. IMPORTANT: Write math horizontally on one line. Use ONLY simple symbols (√, ^, /, *). NO LaTeX. NO HTML. NO Code Blocks. Output RAW Markdown only.";
            } else if (isMathMode) {
                systemPrompt = "You are a Mathematical & Physics Expert. Provide detailed step-by-step logic. IMPORTANT: Write math horizontally on one line. Use ONLY simple symbols (√, ^, /, *). NO LaTeX. NO HTML. NO Code Blocks. Output RAW Markdown only.";
                model = 'openai/gpt-4o';
            }

            const response = await generateContent([
                { role: "system", content: systemPrompt },
                { role: "user", content: query || "Explain the core academic concept in this image in detail." }
            ], {
                model: model,
                image: selectedImageBase64,
                imageType: selectedImageType,
                onProgress: (status) => {
                    const statusText = container.querySelector('#solver-status-text');
                    if (statusText) statusText.innerText = status;
                }
            });

            // Sync with InsForge
            try {
                const { insforge, isConfigured } = await import('../lib/insforge.js');
                const user = JSON.parse(localStorage.getItem('vidyasetu_user') || 'null');
                if (isConfigured && user?.insforge_id) {
                    await insforge.from('doubts').insert({
                        user_id: user.insforge_id,
                        topic: 'General Doubt',
                        question: query || 'Image Query',
                        answer: response
                    });
                    console.log('✅ Doubt synced to InsForge cloud.');
                }
            } catch (err) {
                console.error('❌ Doubt Sync Error:', err);
            }

            output.innerHTML = `
                <div class="card-premium animate-slide" style="padding: 28px; line-height: 1.6;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
                        <div style="font-size: 1.2rem;">✨</div>
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--accent-purple);">AI Explanation</h3>
                    </div>
                    <div class="doubt-response" style="color: var(--text-secondary);">
                        ${safeParseMarkdown(sanitizeAIResponse(response))}
                    </div>
                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.75rem; color: var(--text-tertiary);">
                            ${selectedImageBase64 ? 'Analyzed via Gemini 2.0 Multimodal' : (isMathMode ? 'Powered by Meta Llama 3.1 405B Reasoning' : 'Powered by OpenRouter GPT-4o-mini')}
                        </span>
                        <button class="btn btn-ghost btn-sm" id="copy-response-btn">📋 Copy</button>
                    </div>
                </div>
            `;

            container.querySelector('#copy-response-btn')?.addEventListener('click', () => {
                navigator.clipboard.writeText(response);
                const btn = container.querySelector('#copy-response-btn');
                btn.innerHTML = '✅ Copied!';
                setTimeout(() => btn.innerHTML = '📋 Copy', 2000);
            });

        } catch (error) {
            output.innerHTML = `
                <div class="callout callout-error">
                    <div class="callout-icon">⚠️</div>
                    <div>
                        <strong>Solver Error:</strong> ${error.message}
                        <p style="margin-top: 4px; font-size: 0.85rem;">Please check your internet connection or try again later.</p>
                    </div>
                </div>
            `;
        } finally {
            solveBtn.disabled = false;
            solveBtn.innerHTML = '🚀 Solve Doubt';
        }
    });
}
