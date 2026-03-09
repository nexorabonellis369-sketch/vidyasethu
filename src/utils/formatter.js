/**
 * Utility for parsing and cleaning AI-generated content.
 */

/**
 * Aggressively cleans AI responses to extract raw content from potential code wrappers.
 */
export function sanitizeAIResponse(text) {
    if (!text) return "";

    let result = text.trim();

    // 1. Remove obvious markdown code block wrappers (```markdown, ```html, etc)
    const codeBlockRegex = /```(?:markdown|html|text|json)?\n?([\s\S]*?)\n?```/gi;
    const match = codeBlockRegex.exec(result);
    if (match && match[1]) {
        result = match[1].trim();
    }

    // 2. Remove any remaining dangling backticks at start/end
    result = result.replace(/^`+|`+$/g, '');

    return result;
}

/**
 * Robustly parses markdown into HTML.
 * Uses window.marked if available, falls back to basic regex parser if missing.
 */
export function safeParseMarkdown(md) {
    if (!md) return "";

    // Try marked.js first via global window object
    const markedObj = window.marked || (typeof marked !== 'undefined' ? marked : null);
    if (markedObj && typeof markedObj.parse === 'function') {
        return markedObj.parse(md);
    }

    console.warn("[Vidyasetu] marked.js not available. Using basic fallback parser.");

    // Basic regex-based fallback for standard academic note patterns
    return md
        .replace(/^### (.*$)/gim, '<h3 style="color:var(--accent-cyan); margin-top:20px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">📖 $1</h3>')
        .replace(/^## (.*$)/gim, '<h2 style="color:var(--text-primary); margin-top:24px;">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 style="color:var(--text-primary);">$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^\- (.*$)/gim, '<li style="margin-left:20px; margin-bottom:4px;">$1</li>')
        .replace(/\n\s*\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>');
}
