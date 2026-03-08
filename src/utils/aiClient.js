/**
 * AI Client Utility for Vidyasethu
 * Primary: Google Gemini API | Fallback: OpenRouter
 */

const GEMINI_MODEL = 'gemini-2.0-flash';
const getGeminiUrl = () => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) console.warn('[AI Client] MISSING VITE_GEMINI_API_KEY in environment.');
    return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
};

const getOpenRouterKey = () => {
    const key = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!key) console.warn('[AI Client] MISSING VITE_OPENROUTER_API_KEY in environment.');
    return key || '';
};
// Models in priority order — Comprehensive Primary Tier for maximum reliability
const FALLBACK_MODELS = [
    'google/gemini-2.0-flash-001',
    'google/gemini-2.0-flash-lite-preview-02-05:free',
    'openai/gpt-4o-mini',
    'deepseek/deepseek-chat',
    'anthropic/claude-3-haiku',
    'meta-llama/llama-3.3-70b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
];
const ONLINE_SEARCH_MODEL = 'google/gemini-2.0-flash-exp:online';
const DIAGRAM_MODEL = 'openai/gpt-4o-mini';
const IMAGE_PROMPT_MODEL = 'openai/gpt-4o-mini';

/**
 * Converts basic Markdown to HTML - DEPRECATED: Use marked.js instead
 */
function markdownToHtml(md) {
    if (typeof marked !== 'undefined') return marked.parse(md);
    return md;
}

/**
 * Calls Google Gemini API directly for primary AI responses.
 */
async function callGemini(messages, options = {}) {
    const temperature = options.temperature ?? 0.7;
    // Convert chat messages to Gemini format
    const systemMsg = messages.find(m => m.role === 'system');
    const userMsg = messages.find(m => m.role === 'user');
    const fullPrompt = systemMsg ? `${systemMsg.content}\n\n${userMsg?.content || ''}` : (userMsg?.content || '');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // reduced from 25s to 15s

    const parts = [{ text: fullPrompt }];
    if (options.image) {
        parts.push({
            inline_data: {
                mime_type: options.imageType || "image/jpeg",
                data: options.image
            }
        });
    }

    try {
        const response = await fetch(getGeminiUrl(), {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: parts }],
                generationConfig: {
                    temperature: temperature,
                    maxOutputTokens: 4096,
                }
            })
        });
        clearTimeout(timeoutId);

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || `Gemini HTTP ${response.status}`);
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Gemini returned empty content");
        return text;
    } catch (e) {
        clearTimeout(timeoutId);
        throw e;
    }
}

/**
 * Sends a chat completion request. Tries direct Gemini first, then loops through all fallback models sequentially.
 */
export async function generateContent(messages, options = {}) {
    const temperature = options.temperature ?? 0.7;
    const totalModels = 1 + (options.useOnlineSearch ? [ONLINE_SEARCH_MODEL] : FALLBACK_MODELS).length;
    let attemptCount = 0;

    // 1. Try Direct Google Gemini first
    try {
        attemptCount++;
        if (options.onProgress) options.onProgress(`[Attempt ${attemptCount}/${totalModels}] Consulting Gemini 2.0 (Primary)...`);
        const result = await callGemini(messages, options);
        if (result && result.trim().length > 5) return result;
    } catch (geminiErr) {
        console.warn('[AI Client] Direct Gemini failed:', geminiErr.message);
    }

    // 2. Loop through Fallback Models via OpenRouter
    const baseModels = options.useOnlineSearch ? [ONLINE_SEARCH_MODEL] : FALLBACK_MODELS;
    const modelsToTry = options.model ? [options.model, ...baseModels] : baseModels;
    let lastError = null;

    for (const model of modelsToTry) {
        attemptCount++;
        const modelName = model.split('/')[1] || model;

        // Skip vision-less models if image is provided
        if (options.image && !model.includes('gpt-4o') && !model.includes('gemini') && !model.includes('claude')) {
            console.log(`[AI Client] Skipping ${modelName} (No Vision support)`);
            continue;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            if (options.onProgress) options.onProgress(`[Attempt ${attemptCount}/${totalModels}] Trying ${modelName}...`);
            console.log(`[AI Client] Attempting ${model}...`);

            const routerMessages = [...messages];
            if (options.image) {
                const lastIdx = routerMessages.length - 1;
                const lastMsg = routerMessages[lastIdx];
                if (lastMsg.role === 'user') {
                    routerMessages[lastIdx] = {
                        role: 'user',
                        content: [
                            { type: "text", text: lastMsg.content },
                            {
                                type: "image_url",
                                image_url: { url: `data:${options.imageType || "image/jpeg"};base64,${options.image}` }
                            }
                        ]
                    };
                }
            }

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Authorization": `Bearer ${getOpenRouterKey().trim()}`,
                    "HTTP-Referer": "https://vidyasetu-official.pages.dev",
                    "X-Title": "Vidyasetu Academic Assistant",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: routerMessages,
                    temperature: temperature,
                    max_tokens: options.max_tokens || 2000,
                    system_prompt: "Note: Use only simple math symbols like √, /, ^, * in any text. No LaTeX."
                })
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
            if (!data.choices?.length) throw new Error("Empty response from OpenRouter");

            return data.choices[0].message.content;
        } catch (error) {
            console.warn(`[AI Client] ${modelName} failed:`, error.message);
            lastError = error;
            // Brief pause before next retry
            await new Promise(r => setTimeout(r, 500));
        }
    }

    throw lastError || new Error("All available AI models failed after sequential retries.");
}

/**
 * Specialized function for generating technical diagrams using Mermaid.js syntax.
 */
export async function generateMermaid(query) {
    try {
        const code = await generateContent([
            { role: "system", content: "You are a technical diagram expert. Generate ONLY the Mermaid.js code for the requested diagram. Do NOT include ```mermaid or ```markdown code blocks. Start immediately with the diagram definition." },
            { role: "user", content: `Technical diagram for: ${query}` }
        ], { temperature: 0.1, model: DIAGRAM_MODEL });

        return code.replace(/```mermaid\n?|```/g, '').trim();
    } catch (e) {
        console.warn("Mermaid fallback triggered");
        return `graph TD\nA["${query}"] --> B["Concept Analysis"]`;
    }
}

/**
 * Uses a reasoning model to generate a descriptive image prompt.
 */
export async function generateOptimizedImagePrompt(topic, category = "real-world application") {
    try {
        const isGraph = category.includes("graph") || category.includes("plot");
        const systemPrompt = isGraph
            ? "You are a scientific data visualization expert. Describe a clear, academic mathematical plot or graph for the topic. Define the X and Y axes, the curve shape, and use a white background style. Do NOT include any introductory text."
            : "You are an encyclopedic industrial illustrator. Describe the scene as a clean, labeled technical diagram for an engineering textbook. Use a professional, academic style with high contrast and labels. Do NOT include any introductory text.";

        const prompt = await generateContent([
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate a hyper - realistic, technical image prompt for a ${category} of ${topic}. Max 60 words.` }
        ], { temperature: 0.5, model: IMAGE_PROMPT_MODEL });
        return prompt.trim();
    } catch (e) {
        return `Scientific representation of ${topic}, high detail, photorealistic, 4k`;
    }
}

/**
 * Generates an image URL using Pollinations.
 */
export async function generateImage(prompt) {
    const seed = Math.floor(Math.random() * 1000000);
    // Ensure prompt is a clean string
    const cleanPrompt = String(prompt).substring(0, 400);
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
}

/**
 * Fetches categorized resources from Wikipedia (Diagrams vs Photos).
 */
export async function fetchWikipediaResources(topic, limit = 10) {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        if (!searchData.query?.search?.length) return { diagrams: [], photos: [] };

        const pageTitle = searchData.query.search[0].title;

        // Fetch all image URLs in ONE call using generator
        const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&generator=images&gimlimit=${limit * 2}&prop=imageinfo&iiprop=url&format=json&origin=*`;
        const imagesRes = await fetch(imagesUrl);
        const imagesData = await imagesRes.json();

        if (!imagesData.query?.pages) return { diagrams: [], photos: [] };

        const resources = Object.values(imagesData.query.pages).map(p => {
            const info = p.imageinfo?.[0];
            if (!info || !info.url) return null;
            const url = info.url;
            const title = (p.title || "").toLowerCase();

            // Ignore icons, logos, and very small files
            if (title.includes('icon') || title.includes('logo') || title.includes('symbol') || title.includes('button')) return null;

            const isDiagram = title.includes('diagram') || title.includes('graph') || title.includes('schematic') ||
                title.includes('chart') || title.includes('plot') || title.includes('structure') ||
                title.includes('mechanism') || title.includes('formula') || url.toLowerCase().endsWith('.svg');

            return { url, isDiagram, title: p.title };
        }).filter(r => r !== null);

        // Deduplicate and filter obvious junk
        const uniqueResources = Array.from(new Set(resources.map(r => r.url)))
            .map(url => resources.find(r => r.url === url));

        return {
            diagrams: uniqueResources.filter(r => r.isDiagram).map(r => r.url).slice(0, 4),
            photos: uniqueResources.filter(r => !r.isDiagram).map(r => r.url).slice(0, 4)
        };
    } catch (e) {
        console.warn("Wikipedia Resources Fetch failed:", e);
        return { diagrams: [], photos: [] };
    }
}

/**
 * Fetches a gallery of real-world images from Wikipedia for a given topic.
 * (Deprecated: use fetchWikipediaResources instead)
 */
export async function fetchWikipediaGallery(topic, limit = 2) {
    const res = await fetchWikipediaResources(topic, limit * 2);
    return [...res.diagrams, ...res.photos].slice(0, limit);
}

/**
 * Fetches full Wikipedia article content and formats it as structured study notes.
 * Acts as a primary fallback when AI services fail or reach their limit.
 */
export async function fetchWikipediaContent(topic) {
    try {
        // 1. Find best matching page
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
        const searchData = await fetch(searchUrl).then(r => r.json());
        if (!searchData.query?.search?.length) return null;

        const pageTitle = searchData.query.search[0].title;

        // 2. Fetch full extract + sections (not just intro)
        const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&exsectionformat=wiki&explaintext&format=json&origin=*`;
        const extractData = await fetch(extractUrl).then(r => r.json());

        const pages = extractData.query?.pages;
        if (!pages) return null;
        const pageId = Object.keys(pages)[0];
        if (pageId === "-1" || !pages[pageId]) return null;

        const rawText = pages[pageId].extract;
        if (!rawText) return null;

        // 3. Parse sections from the extracted text
        const lines = rawText.split('\n');
        const sections = [];
        let currentSection = { title: 'Overview', content: [] };

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            // Wikipedia section headers appear as == Title ==
            if (trimmed.startsWith('==') && trimmed.endsWith('==')) {
                if (currentSection.content.length > 0) sections.push(currentSection);
                currentSection = { title: trimmed.replace(/=/g, '').trim(), content: [] };
            } else {
                currentSection.content.push(trimmed.replace(/\[\d+\]/g, '').replace(/\[edit\]/g, '')); // Clean citations
            }
        }
        if (currentSection.content.length > 0) sections.push(currentSection);

        // 4. Map Sections to AI-Style Structure
        const overview = sections.find(s => s.title.toLowerCase().includes('overview') || s.title.toLowerCase() === 'introduction') || sections[0];
        const applications = sections.find(s => s.title.toLowerCase().includes('application') || s.title.toLowerCase().includes('use')) || sections.find(s => s.content.length > 5 && s.title !== overview.title);
        const historyOrTheory = sections.find(s => s.title.toLowerCase().includes('theory') || s.title.toLowerCase().includes('history') || s.title.toLowerCase().includes('principles')) || sections[1];

        const definitionText = overview.content.slice(0, 3).join(' ');
        const summaryText = overview.content.slice(0, 1).join(' ');

        return `
            <div class="wiki-fallback-notes">
                <div class="callout callout-info" style="margin-bottom: 24px;">
                    <div class="callout-icon">📚</div>
                    <div>
                        <strong>Wikipedia Resource: ${pageTitle}</strong>
                        <p style="font-size: 0.82rem; margin-top: 4px; color: var(--text-secondary);">AI services are currently busy. Synthesizing verified encyclopedic research into study format.</p>
                    </div>
                </div>

                <div class="aesthetic-header" style="margin-top:0;">
                    <h3>📘 ${pageTitle}</h3>
                </div>

                <!-- Cornell Layout: Core Definition -->
                <div class="cornell-layout">
                    <div class="cornell-cues">
                        <div style="margin-bottom:12px;"><strong>Definition</strong></div>
                        <div style="margin-bottom:12px;"><strong>Context</strong></div>
                        <div><strong>Source</strong></div>
                    </div>
                    <div class="cornell-notes">
                        <p class="key-idea">${definitionText}</p>
                        <p class="key-idea">As discussed in <em>${pageTitle}</em>, this concept is fundamental to understanding technical principles in this field.</p>
                    </div>
                </div>
                <div class="cornell-summary">💡 Summary: ${summaryText}</div>

                <!-- Exam Strategy -->
                <div class="aesthetic-header"><h3>📐 Study Strategy for ${pageTitle}</h3></div>
                <div class="flow-container">
                    <div class="flow-box">1️⃣ Read Definition</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-box">2️⃣ Explore Theories</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-box">3️⃣ Identify Use-Cases</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-box">4️⃣ Final Revision</div>
                </div>

                <!-- Bujo Key Points -->
                <div class="aesthetic-header"><h3>⭐ Important Concepts (from Wikipedia)</h3></div>
                <ul class="bujo-list">
                    ${sections.slice(0, 4).map(s => `
                        <li class="bujo-item">
                            <span class="bujo-symbol">★</span>
                            <div class="bujo-text"><strong>${s.title}:</strong> ${s.content[0]?.substring(0, 150) || 'Detailed principles and scientific overview.'}...</div>
                        </li>
                    `).join('')}
                </ul>

                ${applications ? `
                <div class="aesthetic-header"><h3>🌍 Industrial & Real-World Context</h3></div>
                <div class="card-premium" style="padding:20px; border:1px solid var(--accent-amber-dim); background:var(--bg-tertiary);">
                    <div style="color:var(--accent-amber); font-weight:700; margin-bottom:10px;">Industrial Application Notes:</div>
                    <p style="font-size:0.88rem; line-height:1.7; color:var(--text-secondary);">${applications.content.slice(0, 3).join(' ')}</p>
                </div>` : ''}

                <div style="margin-top: 24px; padding: 16px; background: var(--bg-tertiary); border-radius: 8px; font-size: 0.82rem; color: var(--text-tertiary); border:1px dashed var(--border-color);">
                    💡 <strong>Full Verification:</strong> For the full original article, visit <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}" target="_blank" style="color: var(--accent-cyan); font-weight:600;">Wikipedia: ${pageTitle}</a>
                </div>
            </div>`;
                    💡 <strong>Tip:</strong> For AI - powered notes with diagrams and real - world examples, try again when the service is less busy.
                </div >
            </div > `;
    } catch (e) {
        console.warn("Wikipedia Content Fetch failed:", e);
        return null;
    }
}

/**
 * Fetches the primary image/diagram from Wikipedia for a given topic.
 */
export async function fetchWikipediaImage(topic) {
    try {
        // 1. Search for the most relevant Wikipedia page
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.query.search.length) return null;

        const pageTitle = searchData.query.search[0].title;

        // 2. Fetch page details including images
        const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages|images&format=json&pithumbsize=1000&origin=*`;
        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();

        const pages = detailsData.query.pages;
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        // Return thumbnail if available, otherwise search within page images
        if (page.thumbnail) return page.thumbnail.source;

        return null;
    } catch (e) {
        console.warn("Wikipedia Fetch failed:", e);
        return null;
    }
}

/**
 * Helper to get a proxied URL for external images.
 */
export function getProxiedUrl(url) {
    if (!url || url.includes('pollinations.ai') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp&n=1`;
}

/**
 * Fetches an image URL and returns a local Blob URL.
 * This bypasses Opaque Response Blocking (ORB) and other browser security issues.
 */
export async function fetchImageAsBlob(url) {
    if (!url) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
        // Direct fetch for Pollinations as they support CORS
        if (url.includes('pollinations.ai')) {
            try {
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeout);
                if (!response.ok) throw new Error("Failed to fetch image");
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } catch (e) {
                console.warn("Pollinations blob fetch failed:", e);
                return url;
            }
        }

        // Use wsrv.nl proxy for Wikipedia and other external sources
        const proxyUrl = getProxiedUrl(url);

        console.log(`[AI Client] Fetching proxied blob: ${url}`);
        const response = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) throw new Error("Proxy fetch failed");
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (e) {
        clearTimeout(timeout);
        console.error("Image Proxying failed:", e);
        return url;
    }
}
