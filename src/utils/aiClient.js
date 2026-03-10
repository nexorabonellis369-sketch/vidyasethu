/**
 * AI Client Utility for Vidyasethu
 * Primary: Pollinations AI
 */

const getPollinationsKey = () => {
    const key = import.meta.env.VITE_POLLINATIONS_API_KEY;
    if (!key) console.warn('[AI Client] MISSING VITE_POLLINATIONS_API_KEY in environment.');
    return key || '';
};

const DIAGRAM_MODEL = 'openai/gpt-4o-mini';
const IMAGE_PROMPT_MODEL = 'openai/gpt-4o-mini';

/**
 * Converts Wikipedia Wikitext to rich academic HTML
 */
export function wikitextToAcademicHtml(text) {
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
 * Calls Pollinations AI free text endpoint.
 * Highly reliable keyless fallback.
 */
async function callPollinations(messages, options = {}) {
    const temperature = options.temperature ?? 0.7;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout for complex note generation

    try {
        const headers = { 'Content-Type': 'application/json' };
        const pollKey = getPollinationsKey().trim();
        if (pollKey) {
            headers['Authorization'] = `Bearer ${pollKey}`;
        }

        if (options.onProgress) options.onProgress("Connecting to AI cluster...");
        const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: headers,
            body: JSON.stringify({
                messages: messages,
                model: "openai",
                temperature: temperature,
                jsonMode: false
            })
        });

        if (options.onProgress) options.onProgress("Synthesizing response...");
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Pollinations HTTP ${response.status}`);
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (!text) throw new Error("Pollinations returned empty content");
        if (options.onProgress) options.onProgress("Finalizing academic content...");
        return text;
    } catch (e) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') {
            throw new Error("AI took too long to respond (90s timeout). Try a more specific topic.");
        }
        throw e;
    }
}

/**
 * Sends a chat completion request using exclusively Pollinations AI.
 */
export async function generateContent(messages, options = {}) {
    const routerMessages = [...messages];
    if (routerMessages.length > 0 && routerMessages[0].role !== "system") {
        routerMessages.unshift({
            role: "system",
            content: "Note: Use proper mathematical unicode symbols (like √, x², ÷) or format equations clearly using simple text (like a/b). Do NOT spell out symbol names like 'frac' or 'sqrt' as plain words. Do NOT use markdown LaTeX formatting (no $ or $$)."
        });
    } else if (routerMessages.length > 0 && routerMessages[0].role === "system") {
        routerMessages[0].content += " Note: Use proper mathematical unicode symbols (like √, x², ÷) or format equations clearly using simple text (like a/b). Do NOT spell out symbol names like 'frac' or 'sqrt' as plain words. Do NOT use markdown LaTeX formatting (no $ or $$).";
    }

    if (options.image) {
        const lastIdx = routerMessages.length - 1;
        const lastMsg = routerMessages[lastIdx];
        if (lastMsg.role === 'user') {
            routerMessages[lastIdx] = {
                role: 'user',
                content: [
                    { type: "text", text: typeof lastMsg.content === 'string' ? lastMsg.content : "" },
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

    if (options.onProgress) options.onProgress("Initializing AI researcher...");
    console.log(`[AI Client] Requesting Pollinations AI...`);

    try {
        const result = await callPollinations(routerMessages, options);
        if (result && result.trim().length > 0) {
            return result;
        }
        throw new Error("Pollinations returned empty content.");
    } catch (pollinationsErr) {
        console.error('[AI Client] Pollinations failed:', pollinationsErr.message);
        throw pollinationsErr;
    }
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
