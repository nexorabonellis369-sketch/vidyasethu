async function testGemini() {
    const key = "AIzaSyBxkr2pIizg7eLOo5GmWHLj329uJQPwtyw";
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-pro"
    ];

    for (const model of models) {
        console.log(`\n--- Testing model: ${model} ---`);
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: "Say hello in one word" }] }] })
            });
            console.log(`Status: ${res.status} ${res.statusText}`);
            if (res.ok) {
                const data = await res.json();
                console.log(`SUCCESS! Response: ${data.candidates[0].content.parts[0].text.substring(0, 100)}`);
            } else {
                const err = await res.text();
                console.log(`Error: ${err.substring(0, 200)}`);
            }
        } catch (e) {
            console.log(`Network error: ${e.message}`);
        }
    }
}

testGemini();
