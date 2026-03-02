// Standalone test for Pollinations AI (no imports)
const systemPrompt = "You are a tutor. Use Cornell layout HTML.";
const userPrompt = "Explain Newton's first law in 2 sentences.";

async function runTest() {
    console.log("--- Standalone Pollinations AI Test ---");
    const models = ["openai-large", "claude-large", "mistral"];

    for (const model of models) {
        console.log(`Trying model: ${model}...`);
        try {
            const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.choices[0].message.content;
                console.log(`\n[SUCCESS] Response from ${model}:`);
                console.log(text.substring(0, 200) + "...");
                return;
            } else {
                console.log(`[FAILED] ${model} returned ${response.status}`);
            }
        } catch (e) {
            console.log(`[ERROR] ${model} error: ${e.message}`);
        }
    }
    console.log("\n[CRITICAL] All free models failed in standalone test.");
}

runTest();
