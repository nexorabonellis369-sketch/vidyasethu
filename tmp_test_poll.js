
import fetch from 'node-fetch';

const key = 'sk_NlAZJAsiy3chlWq1h5NOg5sFkFy5J5D1';

async function test() {
    console.log("Testing Pollinations AI...");
    try {
        const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: "Say hello" }],
                model: "openai"
            })
        });
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
