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
// Models in priority order — Comprehensive Primary Tier
const FALLBACK_MODELS = [
    'google/gemini-2.0-flash-lite-001',
    'google/gemini-2.0-flash-001',
    'google/gemini-2.0-pro-exp-02-05:free',
    'openai/gpt-4o-mini',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
];
const ONLINE_SEARCH_MODEL = 'google/gemini-2.0-flash-exp:online';
const DIAGRAM_MODEL = 'openai/gpt-4o-mini';
const IMAGE_PROMPT_MODEL = 'openai/gpt-4o-mini';

/**
 * Converts Wikipedia Wikitext to rich academic HTML
 */
function wikitextToAcademicHtml(text) {
    if (!text) return "";

    // 1. Basic cleaning
    let html = text
        .replace(/&nbsp;/g, ' ')
        .replace(/'''([^']+)'''/g, '<strong>$1</strong>')
        .replace(/''([^']+)''/g, '<em>$1</em>')
        .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1') // [[Link|Text]] -> Text
        .replace(/\{\{[^}]+\}\}/g, ''); // {{Templates}}

    // 2. Extract Formula/Math tags and format as Derivation Steps
    html = html.replace(/<math[^>]*>(.*?)<\/math>/g, (match, formula) => {
        // Simple LaTeX cleanup for readability without a full renderer
        const cleanFormula = formula
            .replace(/\\(?:text|quad|cdot|mathcal|vec|begin|end|left|right|frac|sqrt|partial)/g, ' ')
            .replace(/[{}]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return `<div class="formula-block" style="background: rgba(0, 188, 212, 0.05); padding: 12px 16px; border-radius: 12px; margin: 12px 0; border: 1px dashed var(--accent-cyan); font-family: 'Outfit', sans-serif; color: var(--accent-cyan); font-weight: 500; font-size: 1.1rem; text-align: center;">
            ${cleanFormula}
        </div>`;
    });

    // 3. Handle list items
    html = html.split('\n').map(line => {
        if (line.trim().startsWith('*')) {
            return `<li style="margin-left: 20px; margin-bottom: 8px;">${line.trim().substring(1).trim()}</li>`;
        }
        if (line.trim().length > 0) {
            return `<p style="margin-bottom: 12px; line-height: 1.7;">${line.trim()}</p>`;
        }
        return "";
    }).join('\n');

    return html;
}

/**
 * Strips Wikipedia markup for cleaner AI context
 */
function cleanWikitext(text) {
    if (!text) return "";
    return text
        .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1') // [[Link|Text]] -> Text
        .replace(/\{\{[^}]+\}\}/g, '') // {{Templates}}
        .replace(/&nbsp;/g, ' ')
        .replace(/'''/g, '')
        .replace(/''/g, '');
}

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
 * Sends a chat completion request. Tries Gemini first, then OpenRouter fallbacks.
 * Can be forced to use the "Online Search" tier.
 */
export async function generateContent(messages, options = {}) {
    const temperature = options.temperature ?? 0.7;

    // 1. Try Gemini first (primary — fast & free)
    try {
        if (options.onProgress) options.onProgress("Consulting Gemini 2.0...");
        const result = await callGemini(messages, options);
        if (result && result.trim().length > 5) { // reduced from 10 to 5
            return result; // Return RAW markdown
        }
    } catch (geminiErr) {
        console.error('[AI Client] Gemini failed:', geminiErr.message);
    }

    // 1. Try via OpenRouter (handles CORS properly, Gemini Flash is #1 in list)
    // If 'useOnlineSearch' is set, we skip to the online model
    const baseModels = options.useOnlineSearch ? [ONLINE_SEARCH_MODEL] : FALLBACK_MODELS;
    const modelsToTry = options.model ? [options.model, ...baseModels] : baseModels;
    let lastError = null;

    for (const model of modelsToTry) {
        // Skip models that don't support vision if an image is provided
        if (options.image && !model.includes('gpt-4o') && !model.includes('gemini') && !model.includes('claude')) {
            continue;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // reduced from 20s to 12s
        try {
            if (options.onProgress) options.onProgress(`Connecting to ${model.split('/')[1] || model}...`);

            console.log(`[AI Client] Fallback: ${model}...`);

            const routerMessages = [...messages];
            // OpenRouter/Standard OpenAI schema: system instructions should be in messages with role: "system"
            // We ensure any extra safety prompt is added to the system message or as a new one
            routerMessages.unshift({
                role: "system",
                content: "Note: Use only simple math symbols like √, /, ^, * in any text. No LaTeX."
            });

            if (options.image) {
                // OpenRouter/GPT-4o style multimodal message
                const lastIdx = routerMessages.length - 1;
                const lastMsg = routerMessages[lastIdx];
                if (lastMsg.role === 'user') {
                    routerMessages[lastIdx] = {
                        role: 'user',
                        content: [
                            { type: "text", text: lastMsg.content },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${options.imageType || "image/jpeg"};base64,${options.image}`
                                }
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
                    max_tokens: options.max_tokens || 2000
                })
            });
            clearTimeout(timeoutId);
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.error("[AI Client] Auth Error: Missing or Invalid API Key/Header.");
                }
                throw new Error(data.error?.message || `HTTP ${response.status}`);
            }
            if (!data.choices?.length) throw new Error("Empty response from OpenRouter");
            return data.choices[0].message.content; // Return RAW markdown
        } catch (error) {
            console.warn(`[AI Client] ${model} failed:`, error.message);
            lastError = error;
        }
    }

    throw lastError || new Error("All AI models failed.");
}

/**
 * Fetches raw technical sections from Wikipedia for AI grounding.
 */
export async function fetchWikipediaWikitext(topic) {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
        const searchData = await fetch(searchUrl).then(r => r.json());
        if (!searchData.query?.search?.length) return "";

        const pageTitle = searchData.query.search[0].title;
        const parseUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=sections|wikitext&format=json&origin=*`;
        const parseData = await fetch(parseUrl).then(r => r.json());

        if (!parseData.parse?.sections || !parseData.parse?.wikitext) return "";

        const sections = parseData.parse.sections;
        const fullWikitext = parseData.parse.wikitext['*'];

        // Target sections likely to contain formulas/derivations
        const targetKeywords = ['math', 'formula', 'derivation', 'theory', 'principle', 'law', 'mechanics', 'quantum', 'electro'];
        const relevantSectionIndices = sections
            .filter(s => targetKeywords.some(k => s.line.toLowerCase().includes(k)))
            .map(s => parseInt(s.index));

        if (relevantSectionIndices.length === 0) return cleanWikitext(fullWikitext.substring(0, 3000));

        // Extract relevant segments by section offsets if possible, or just return the titles + full text for AI to parse
        // For simplicity and robustness, we provide the section list and the first 5000 chars of wikitext
        let context = `Source: Wikipedia (${pageTitle})\nRelevant Sections: ${sections.map(s => s.line).join(', ')}\n\n`;
        context += cleanWikitext(fullWikitext.substring(0, 5000));

        return context;
    } catch (e) {
        console.warn("Wikipedia Wikitext fetch failed:", e);
        return "";
    }
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
 * Optimized to match AI-generated note aesthetic.
 */
export async function fetchWikipediaContent(topic) {
    try {
        // 1. Find best matching page
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
        const searchData = await fetch(searchUrl).then(r => r.json());
        if (!searchData.query?.search?.length) return null;

        const pageTitle = searchData.query.search[0].title;

        // 2. Fetch Structured Parse Data (Sections + Wikitext)
        const parseUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=sections|wikitext&format=json&origin=*`;
        const parseData = await fetch(parseUrl).then(r => r.json());

        if (!parseData.parse?.sections || !parseData.parse?.wikitext) return null;

        const sections = parseData.parse.sections;
        const fullWikitext = parseData.parse.wikitext['*'];

        // 3. Process and format relevant sections
        // We look for sections like "Mathematical formulation", "Principles", "Theory", "Derivation"
        const targetKeywords = ['math', 'formulation', 'theory', 'principle', 'law', 'mechanism', 'derivation', 'electromagnetic'];
        const relevantSections = sections.filter(s =>
            targetKeywords.some(k => s.line.toLowerCase().includes(k)) || parseInt(s.level) === 2
        ).slice(0, 6); // Top 6 most relevant/main sections

        const sectionContents = relevantSections.map(s => {
            // Find start and end indices for this section in the wikitext
            // (Note: Wikipedia API doesn't provide easy slicing, so we find the title)
            const titleMatch = `== ${s.line} ==`;
            const startIndex = fullWikitext.indexOf(titleMatch);
            if (startIndex === -1) return null;

            // Find start of NEXT section to calculate end
            const nextSecIndex = sections.findIndex(sec => sec.index === (parseInt(s.index) + 1).toString());
            let endIndex = fullWikitext.length;
            if (nextSecIndex !== -1) {
                const nextTitleMatch = `== ${sections[nextSecIndex].line} ==`;
                endIndex = fullWikitext.indexOf(nextTitleMatch);
                if (endIndex === -1) endIndex = fullWikitext.length;
            }

            const rawContent = fullWikitext.substring(startIndex + titleMatch.length, endIndex).trim();
            if (!rawContent || rawContent.length < 50) return null;

            const hasMath = rawContent.includes('<math>');
            const isDerivation = s.line.toLowerCase().includes('derivation') || s.line.toLowerCase().includes('math');

            return `
                <div class="note-section" style="margin-bottom: 32px; animation: slideIn 0.5s ease;">
                    <h3 style="color: var(--accent-cyan); display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 16px;">
                        <span>${isDerivation ? '📝' : '📘'}</span>
                        ${s.line}
                        ${isDerivation ? '<span class="badge badge-cyan" style="margin-left:auto; font-size:0.65rem;">Detailed Derivation</span>' : ''}
                    </h3>
                    <div class="academic-text" style="color: var(--text-primary); font-size: 0.95rem;">
                        ${wikitextToAcademicHtml(rawContent.substring(0, 2500))}
                    </div>
                </div>
            `;
        }).filter(c => c !== null).join('');

        return `
            <div class="wiki-fallback-notes">
                <div class="callout callout-info" style="margin-bottom: 24px; border-left: 4px solid var(--accent-cyan);">
                    <div class="callout-icon">🏛️</div>
                    <div style="flex:1;">
                        <strong style="color: var(--accent-cyan); font-size: 1.1rem;">Encyclopedic Archive: ${pageTitle}</strong>
                        <p style="font-size: 0.82rem; margin-top: 6px; color: var(--text-secondary); opacity: 0.8;">
                            Using high-accuracy Wikipedia references. 
                            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}" target="_blank" style="color: var(--accent-cyan); font-weight: bold; text-decoration: underline;">Open Source Library</a>
                        </p>
                    </div>
                </div>
                ${sectionContents}
                <div style="margin-top: 32px; padding: 20px; background: rgba(0, 188, 212, 0.05); border: 1px dashed var(--accent-cyan); border-radius: 12px; text-align: center; font-size: 0.88rem; color: var(--text-secondary);">
                    💡 <strong>Academic Insight:</strong> These notes are derived from verified technical documentation. 
                    For interactive AI models, attempt a refresh during low-traffic periods.
                </div>
            </div>`;
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
