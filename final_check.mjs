// Final standalone test for Gemini and other free providers
async function runFinalTest() {
    console.log("--- Final AI Connectivity Check ---");
    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "openai-large"];

    for (const model of models) {
        console.log(`Checking ${model}...`);
        try {
            const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: "Say 'Ready' if you can hear me." }
                    ],
                    temperature: 0.1
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`[OK] ${model} responded: ${data.choices[0].message.content.trim()}`);
            } else {
                console.log(`[FAIL] ${model} returned status ${response.status}`);
            }
        } catch (e) {
            console.log(`[ERROR] ${model} failed: ${e.message}`);
        }
    }
}

runFinalTest();
