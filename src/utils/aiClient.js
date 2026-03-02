// src/utils/aiClient.js

/**
 * Retrieves the hardcoded OpenRouter API key.
 */
function getKey(provider) {
    // Return the hardcoded automated key for openrouter
    if (provider === 'openrouter') {
        return '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';
    }

    // Check localStorage as a temporary override if keys were previously saved
    return localStorage.getItem(`vidhyasethu_api_key_${provider}`) || '';
}

/**
 * Unified AI Client that attempts to use the best available provider based on saved API keys.
 * Hierarchy:
 * 1. Groq (Llama 3 / Mixtral) - Fastest
 * 2. GitHub Models (GPT-4o) - Smartest
 * 3. OpenRouter (DeepSeek V3 / Mistral) - Flexible
 * 4. Google AI Studio (Gemini 1.5 Pro) - Powerful
 * 5. Pollinations AI - Free Fallback
 * 
 * @param {Array} messages - Array of message objects {role: 'system'|'user', content: '...'}
 * @param {Object} options - Additional options (e.g., jsonMode: true)
 * @returns {Promise<string>} The generated text content
 */
export async function generateContent(messages, options = {}) {
    const providers = [
        { name: 'groq', fn: callGroq },
        { name: 'github', fn: callGitHub },
        { name: 'openrouter', fn: callOpenRouter },
        { name: 'gemini', fn: callGemini }
    ];

    // Try providers that have keys
    for (const provider of providers) {
        const key = getKey(provider.name);
        if (key) {
            try {
                console.log(`[AI Client] Attempting with ${provider.name}...`);
                const result = await provider.fn(key, messages, options);
                if (result) return result;
            } catch (e) {
                console.error(`[AI Client] ${provider.name} failed:`, e);
                // Continue to the next available provider if this one fails
            }
        }
    }

    // Fallback to Free Pollinations AI if no keys exist or all premium providers failed
    console.log(`[AI Client] Falling back to Free Pollinations AI...`);
    return await callPollinations(messages, options);
}

// --- Provider Implementations --- //

async function callGroq(key, messages, options) {
    const model = options.fast ? "mixtral-8x7b-32768" : "llama3-70b-8192";
    const body = { model, messages, temperature: 0.5 };
    if (options.jsonMode) body.response_format = { type: "json_object" };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

async function callGitHub(key, messages, options) {
    const model = "gpt-4o"; // Default to a powerful model available on GitHub
    const body = { model, messages, temperature: 0.5 };
    if (options.jsonMode) body.response_format = { type: "json_object" };

    const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`GitHub Models HTTP ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

async function callOpenRouter(key, messages, options) {
    const model = options.fast ? "mistralai/mistral-7b-instruct" : "deepseek/deepseek-chat";
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${key}`,
            "HTTP-Referer": window.location.href, // Required by OpenRouter
            "X-Title": "Vidhyasethu App", // Required by OpenRouter
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ model, messages, temperature: 0.5 })
    });
    if (!res.ok) throw new Error(`OpenRouter HTTP ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

async function callGemini(key, messages, options) {
    // Convert standard OpenAI messages format to Gemini format
    const systemInstruction = messages.find(m => m.role === 'system')?.content;
    const userMessages = messages.filter(m => m.role !== 'system');

    const contents = userMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
    }));

    const body = { contents, generationConfig: { temperature: 0.5 } };
    if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    if (options.jsonMode) {
        body.generationConfig.responseMimeType = "application/json";
    }

    const model = options.fast ? "gemini-1.5-flash" : "gemini-1.5-pro";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
}

async function callPollinations(messages, options) {
    const pollinationModels = ["openai-large", "claude-large", "deepseek", "grok", "mistral"];
    for (const model of pollinationModels) {
        try {
            const res = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: 0.5,
                    seed: Math.floor(Math.random() * 1000)
                })
            });
            if (res.ok) {
                const data = await res.json();
                const text = data?.choices?.[0]?.message?.content || '';
                if (text && text.length > 50 && !text.includes('deprecated') && !text.includes('Pollinations legacy')) {
                    return text;
                }
            }
        } catch (e) {
            console.warn(`[Pollinations] Failed with model ${model}`, e);
        }
    }

    // Last resort GET fallback
    if (!options.jsonMode) {
        try {
            const systemMessage = messages.find(m => m.role === 'system')?.content || '';
            const userMessage = messages.find(m => m.role === 'user')?.content || '';
            const usr = encodeURIComponent(userMessage);
            const res = await fetch(`https://gen.pollinations.ai/text/${usr}?model=openai&system=${encodeURIComponent(systemMessage.substring(0, 500))}`);
            if (res.ok) {
                const text = await res.text();
                if (text && text.length > 50 && !text.includes('deprecated')) return text;
            }
        } catch (e) {
            console.error("[Pollinations] Last resort GET failed", e);
        }
    }

    throw new Error("All AI providers and fallbacks failed.");
}
