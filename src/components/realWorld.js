import { generateContent, generateImage, fetchImageAsBlob } from '../utils/aiClient.js';

export function renderRealWorld(container) {
    container.innerHTML = `
        <div class="animate-fade">
            <div class="card-premium" style="margin-bottom: 24px; padding: 28px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                    <div class="card-icon cyan" style="font-size: 1.6rem; width: 52px; height: 52px;">🌎</div>
                    <div>
                        <h1 style="font-size:1.5rem; font-weight: 800; margin: 0 0 4px;">Real-World Visuals</h1>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin: 0;">See how abstract concepts are applied in industry and the physical world.</p>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">🔍 Enter Topic or Concept</label>
                    <input type="text" id="topic-input" class="form-select" style="padding: 12px;" placeholder="e.g. Electromagnetic Induction, Calculus, Newton's Laws...">
                </div>
                
                <button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:12px; padding: 14px; font-size: 1rem; border-radius: var(--radius-md);" id="explore-btn">
                    🔭 Explore Applications
                </button>
            </div>
            
            <div id="real-world-output"></div>
        </div>
    `;

    const exploreBtn = container.querySelector('#explore-btn');
    const topicInput = container.querySelector('#topic-input');
    const output = container.querySelector('#real-world-output');

    exploreBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        if (!topic) return;

        exploreBtn.disabled = true;
        exploreBtn.innerHTML = '🛰️ Mapping Applications...';
        output.innerHTML = `
            <div class="card-premium animate-pulse" style="padding: 24px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="skeleton" style="width: 20px; height: 20px; border-radius: 50%;"></div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">Synthesizing Industrial Use-Cases...</div>
                </div>
            </div>
        `;

        try {
            const prompt = `Generate 3 specific, technical real-world industry applications for the topic: "${topic}".
            Output ONLY a valid JSON object with an "apps" array. Each item MUST have:
            - "field": Industry name
            - "icon": Relevant emoji
            - "topic_connection": How it connects to the topic
            - "description": 2 sentences explaining the application.
            - "image_prompt": A high-quality realistic image prompt (8-12 words) for this application.
            Output ONLY raw JSON.`;

            const responseText = await generateContent([
                { role: "system", content: "You are a technical consultant. Output ONLY valid JSON." },
                { role: "user", content: prompt }
            ], { jsonMode: true });

            const data = JSON.parse(responseText.match(/\{[\s\S]*\}/)[0]);

            output.innerHTML = `
                <div class="grid-2" style="gap: 20px;">
                    ${data.apps.map((app, idx) => `
                        <div class="card-premium animate-slide stagger-${idx}" style="padding: 0; overflow: hidden;">
                            <div id="img-slot-${idx}" style="height: 180px; background: var(--bg-tertiary); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                <div class="skeleton" style="width: 100%; height: 100%;"></div>
                            </div>
                            <div style="padding: 20px;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                    <div class="card-icon cyan" style="width: 32px; height: 32px; font-size: 1.1rem;">${app.icon}</div>
                                    <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700;">${app.field}</h4>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 8px; font-weight: 600;">🔗 ${app.topic_connection}</div>
                                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${app.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            // Load images asynchronously
            data.apps.forEach(async (app, idx) => {
                const imgSlot = output.querySelector(`#img-slot-${idx}`);
                try {
                    const rawUrl = await generateImage(app.image_prompt);
                    const blobUrl = await fetchImageAsBlob(rawUrl);
                    imgSlot.innerHTML = `<img src="${blobUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${app.field}">`;
                } catch (e) {
                    imgSlot.innerHTML = `<div style="color: var(--text-tertiary); font-size: 2rem;">🖼️</div>`;
                }
            });

        } catch (error) {
            output.innerHTML = `
                <div class="callout callout-error">
                    <div class="callout-icon">⚠️</div>
                    <div>
                        <strong>Discovery Error:</strong> ${error.message}
                    </div>
                </div>
            `;
        } finally {
            exploreBtn.disabled = false;
            exploreBtn.innerHTML = '🔭 Explore Applications';
        }
    });
}
