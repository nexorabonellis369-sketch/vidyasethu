
import fetch from 'node-fetch'; // assuming node-fetch or global fetch is available in the environment

const key = 'sk_NlAZJAsiy3chlWq1h5NOg5sFkFy5J5D1';

async function callPollinations(messages) {
    console.log("Calling Pollinations AI...");
    const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            messages: messages,
            model: "openai",
            temperature: 0.7,
            jsonMode: false
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Pollinations HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content;
}

const testMessages = [
    { role: "system", content: "You are a university professor. Use proper mathematical unicode symbols (like √, x², ÷). Do NOT use LaTeX." },
    { role: "user", content: "Explain the concept of Orthogonal coordinates in R3." }
];

callPollinations(testMessages)
    .then(result => {
        console.log("\n--- GENERATED NOTES ---\n");
        console.log(result);
        console.log("\n--- END OF NOTES ---\n");
    })
    .catch(err => {
        console.error("Test Failed:", err.message);
    });
