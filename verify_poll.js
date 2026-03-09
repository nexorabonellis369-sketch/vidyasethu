
// Using built-in fetch (Node 18+)

const key = 'sk_NlAZJAsiy3chlWq1h5NOg5sFkFy5J5D1';

async function verifyPollinations() {
    console.log("Starting Pollinations AI Verification...");
    console.log("Endpoint: https://gen.pollinations.ai/v1/chat/completions");

    const messages = [
        { role: "system", content: "You are a university professor. Generate brief academic notes." },
        { role: "user", content: "Explain 'Quantum Superposition' in 3 bullet points." }
    ];

    try {
        const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                messages: messages,
                model: "openai",
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP Error: ${response.status}`);
            console.error(`Response Body: ${errorText}`);
            return;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
            console.log("--- SUCCESS: Pollinations AI Response Received ---");
            console.log(content);
            console.log("--------------------------------------------------");
        } else {
            console.warn("Response received but content is empty.");
            console.log("Full Data:", JSON.stringify(data, null, 2));
        }

    } catch (err) {
        console.error("Verification failed with an exception:");
        console.error(err);
    }
}

verifyPollinations();
