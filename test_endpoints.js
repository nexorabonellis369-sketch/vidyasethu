async function testEndpoints() {
    const endpoints = [
        "https://gen.pollinations.ai/v1/chat/completions",
        "https://text.pollinations.ai/openai"
    ];

    for (const ep of endpoints) {
        console.log(`Testing: ${ep}`);
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 10000);
            const res = await fetch(ep, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [{ role: "user", content: "hello" }],
                    model: "openai"
                }),
                signal: controller.signal
            });
            clearTimeout(id);
            console.log(`Status for ${ep}: ${res.status}`);
            if (res.ok) {
                const data = await res.json();
                console.log(`Response: `, data.choices ? data.choices[0].message.content : "No content");
            } else {
                console.log(`Error text: await res.text()`);
            }
        } catch (e) {
            console.error(`Failed ${ep}: ${e.message}`);
        }
    }
}
testEndpoints();
