/**
 * AI Client Utility for Vidyasethu
 * Primary: Google Gemini API | Fallback: OpenRouter
 */

const GEMINI_MODEL = 'gemini-2.0-flash';
const getGeminiUrl = (modelOverride) => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    const model = modelOverride || GEMINI_MODEL;
    if (!key) console.warn('[AI Client] MISSING VITE_GEMINI_API_KEY in environment.');
    // Use local proxy in dev to avoid CORS issues
    const baseUrl = import.meta.env.DEV
        ? '/google-ai/v1/models'
        : 'https://generativelanguage.googleapis.com/v1/models';
    return `${baseUrl}/${model}:generateContent?key=${key}`;
};

const getOpenRouterKey = () => {
    const key = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!key) console.warn('[AI Client] MISSING VITE_OPENROUTER_API_KEY in environment.');
    return key || '';
};
// Models in priority order — Comprehensive Primary Tier
const FALLBACK_MODELS = [
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-pro'
];
const DIAGRAM_MODEL = 'openai/gpt-4o-mini';
const IMAGE_PROMPT_MODEL = 'openai/gpt-4o-mini';

/**
 * Strips Wikipedia markup for cleaner AI context
 */
function cleanWikitext(text) {
    if (!text) return "";
    return text
        .replace(/<math[^>]*>(.*?)<\/math>/g, ' $1 ') // Extract raw math content
        .replace(/<sub>(.*?)<\/sub>/g, '_$1') // Convert HTML sub to simple underscore
        .replace(/<sup>(.*?)<\/sup>/g, '^$1') // Convert HTML sup to simple caret
        .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1') // [[Link|Text]] -> Text
        .replace(/\{\{[^}]+\}\}/g, '') // {{Templates}}
        .replace(/&nbsp;/g, ' ')
        .replace(/'''/g, '')
        .replace(/''/g, '')
        .replace(/\n+/g, ' '); // Enforce horizontal block flow
}

/**
 * Helper for safe JSON fetching with HTML fallback protection.
 */
async function safeFetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("text/html")) {
        const text = await response.text();
        if (text.trim().toLowerCase().startsWith("<!doctype html") || text.includes("<html")) {
            throw new Error(`Proxy/Server returned HTML instead of JSON (Status: ${response.status}). URL: ${url}`);
        }
    }

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || errorData.message || response.statusText}`);
    }

    try {
        return await response.json();
    } catch (e) {
        throw new Error(`Failed to parse JSON response from ${url}`);
    }
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
    const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased from 15s to 30s

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
        const bodyPayload = {
            contents: [],
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: 4096,
            }
        };

        // 1. Set System Instruction explicitly
        if (systemMsg) {
            bodyPayload.system_instruction = { parts: [{ text: systemMsg.content }] };
        }

        // 2. Add User Content Part
        const userParts = [];
        if (userMsg?.content) {
            userParts.push({ text: userMsg.content });
        }

        if (options.image) {
            userParts.push({
                inline_data: {
                    mime_type: options.imageType || "image/jpeg",
                    data: options.image
                }
            });
        }

        if (userParts.length === 0) {
            // Fallback to fullPrompt if somehow userMsg is missing but fullPrompt exists
            userParts.push({ text: fullPrompt });
        }

        bodyPayload.contents.push({ role: 'user', parts: userParts });

        // Add safety settings to reduce blockage risk
        bodyPayload.safetySettings = [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ];

        if (options.useGoogleSearch) {
            bodyPayload.tools = [{ google_search: {} }];
        }

        const data = await safeFetchJson(getGeminiUrl(options.modelOverride), {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload)
        });
        clearTimeout(timeoutId);
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

    // 0. Handle Native Google Search explicit request
    if (options.useGoogleSearch) {
        if (options.onProgress) options.onProgress("Searching Google AI...");
        try {
            const result = await callGemini(messages, options);
            if (result && result.trim().length > 5) return result;
        } catch (e) {
            console.error('[AI Client] Google Search Fallback failed:', e.message);
        }
        return null; // Don't fall back to standard models if search was explicitly requested
    }

    // 2. Try via OpenRouter (handles CORS properly, Gemini Flash is #1 in list)
    let lastError = null;

    // 1. Try Gemini first (primary — fast & free)
    try {
        if (options.onProgress) options.onProgress("Consulting Gemini 2.0...");
        const result = await callGemini(messages, options);
        if (result && result.trim().length > 5) {
            return result;
        }
    } catch (geminiErr) {
        console.error('[AI Client] Gemini failed:', geminiErr.message);
        lastError = new Error(`Gemini: ${geminiErr.message}`);
    }

    const modelsToTry = options.model ? [options.model, ...FALLBACK_MODELS] : FALLBACK_MODELS;

    for (const model of modelsToTry) {
        // Skip models that don't support vision if an image is provided
        if (options.image && !model.includes('gpt-4o') && !model.includes('gemini') && !model.includes('claude') && !model.includes('pixtral')) {
            continue;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000);

        const endpoint = import.meta.env.DEV
            ? "/openrouter-ai/chat/completions"
            : "https://openrouter.ai/api/v1/chat/completions";

        try {
            if (options.onProgress) options.onProgress(`Connecting to ${model.split('/')[1] || model}...`);

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
                                image_url: {
                                    url: `data:${options.imageType || "image/jpeg"};base64,${options.image}`
                                }
                            }
                        ]
                    };
                }
            }

            const data = await safeFetchJson(endpoint, {
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
                    max_tokens: options.max_tokens || 3500,
                    system_prompt: "Output clean Markdown only. No HTML. No LaTeX. No code block wrappers."
                })
            });
            clearTimeout(timeoutId);

            if (!data.choices?.length) throw new Error("Empty response from OpenRouter");
            return data.choices[0].message.content;
        } catch (error) {
            console.error(`[AI Client] OpenRouter ${model} failed:`, error.message);
            lastError = new Error(`${model}: ${error.message}`);
        }
    }

    throw lastError || new Error("All AI models failed. Please check your API keys or internet connection.");
}

/**
 * Fetches raw technical sections from Wikipedia for AI grounding.
 */
export async function fetchWikipediaWikitext(topic) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
        const searchData = await safeFetchJson(searchUrl, { signal: controller.signal });
        if (!searchData.query?.search?.length) {
            clearTimeout(timeoutId);
            return "";
        }

        const pageTitle = searchData.query.search[0].title;
        const parseUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=sections|wikitext&format=json&origin=*`;
        const parseData = await safeFetchJson(parseUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

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
        const searchRes = await safeFetchJson(searchUrl);
        const searchData = searchRes;
        if (!searchData.query?.search?.length) return { diagrams: [], photos: [] };

        const pageTitle = searchData.query.search[0].title;

        // Fetch all image URLs in ONE call using generator
        const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&generator=images&gimlimit=${limit * 2}&prop=imageinfo&iiprop=url&format=json&origin=*`;
        const imagesData = await safeFetchJson(imagesUrl);

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
export async function fetchWikipediaContent(topic, unitTitle = "") {
    try {
        // 1. Find best matching page
        let searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
        let searchRes = await safeFetchJson(searchUrl);
        let searchData = searchRes;

        // 1b. Fallback broad search if specific topic fails
        if (!searchData.query?.search?.length && topic.includes(':')) {
            const broaderTopic = topic.split(':')[1].trim();
            searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(broaderTopic)}&format=json&origin=*`;
            searchData = await safeFetchJson(searchUrl);
        }

        // 1c. Deep Fallback: Search Unit Title if topics fail
        if (!searchData.query?.search?.length && unitTitle) {
            searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(unitTitle)}&format=json&origin=*`;
            searchData = await safeFetchJson(searchUrl);
        }

        if (!searchData.query?.search?.length) return null;
        const pageTitle = searchData.query.search[0].title;

        // 2. Fetch full extract + sections (not just intro)
        const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&exsectionformat=wiki&explaintext&format=json&origin=*`;
        const extractData = await safeFetchJson(extractUrl);

        const pages = extractData.query?.pages;
        if (!pages) return null;
        const pageId = Object.keys(pages)[0];
        if (pageId === "-1" || !pages[pageId]) return null;

        const rawText = pages[pageId].extract;
        if (!rawText) return null;

        // 3. Pre-process text to remove vertical LaTeX and merge floating math lines
        let cleanedText = rawText
            // Extract inner text of displaystyle, keep it inline
            .replace(/\{\s*\\displaystyle(.*?)\s*\}/g, ' $1 ')
            // Remove common remaining latex commands
            .replace(/\\[a-zA-Z]+/g, '')
            // Aggressively merge short lines that start/end with math characters or commas
            .replace(/\n\s*([A-Za-z0-9,\s~=+\-*/^_{}()\.]+[,\+\-=]?)\s*\n/gi, ' $1 ')
            .replace(/\n\s*([,\+\-=~^])/g, ' $1') // If line starts with a punctuation, bring it up
            .replace(/\n+/g, '\n'); // remove excessive blank lines

        // Parse sections from the cleaned text
        const lines = cleanedText.split('\n');
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
                currentSection.content.push(trimmed);
            }
        }
        if (currentSection.content.length > 0) sections.push(currentSection);

        // 4. Format as rich study notes HTML (limit to first 5 sections to avoid overflow)
        const importantSections = sections.slice(0, 5);
        const sectionsHTML = importantSections.map(section => {
            const paragraphs = section.content.slice(0, 6).map(p => {
                // Style inline math elements to flow horizontally and wrap predictably
                let styledP = p.replace(/<math[^>]*>(.*?)<\/math>/g, '<span style="white-space: nowrap; font-family: monospace; background: var(--bg-secondary); padding: 2px 4px; border-radius: 4px;"> $1 </span>');
                styledP = styledP.replace(/_{([^}]+)}/g, '<sub>$1</sub>').replace(/\^{([^}]+)}/g, '<sup>$1</sup>');
                return `<p style="margin-bottom:12px; line-height:1.8; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px;">${styledP}</p>`;
            }).join('');

            return `
                <div style="margin-bottom: 28px; padding: 20px; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <h3 style="color: var(--accent-cyan); display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-family: 'Inter', sans-serif;">
                        <span style="font-size: 1.2rem;">📖</span> ${section.title}
                    </h3>
                    <div style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
                        ${paragraphs}
                    </div>
                </div>`;
        }).join('');

        return `
            <div class="wiki-fallback-notes">
                <div class="callout callout-info" style="margin-bottom: 20px;">
                    <div class="callout-icon">📚</div>
                    <div>
                        <strong>Synthesizing from Wikipedia — ${pageTitle}</strong>
                        <p style="font-size: 0.82rem; margin-top: 4px; color: var(--text-secondary);">AI services are currently at peak capacity. Providing verified academic research from the Wikipedia database. Full article: <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}" target="_blank" style="color: var(--accent-cyan);">Wikipedia: ${pageTitle}</a></p>
                        <!-- DIAGNOSTICS -->
                    </div>
                    </div>
                </div>
                ${sectionsHTML}
                <div style="margin-top: 24px; padding: 16px; background: var(--bg-tertiary); border-radius: 8px; font-size: 0.82rem; color: var(--text-tertiary);">
                    💡 <strong>Tip:</strong> For AI-powered notes with diagrams and real-world examples, try again when the service is less busy.
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
        const searchRes = await safeFetchJson(searchUrl);
        const searchData = searchRes;

        if (!searchData.query.search.length) return null;

        const pageTitle = searchData.query.search[0].title;

        // 2. Fetch page details including images
        const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages|images&format=json&pithumbsize=1000&origin=*`;
        const detailsRes = await safeFetchJson(detailsUrl);
        const detailsData = detailsRes;

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
