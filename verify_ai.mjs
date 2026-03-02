import { generateContent } from './src/utils/aiClient.js';

// Mock browser globals for Node environment
global.window = { location: { href: 'http://localhost' } };
global.import = { meta: { env: { DEV: true } } };
// node 18+ has fetch built-in
if (!global.fetch) {
    console.error("Node version too old for fetch. Please use Node 18+.");
}

async function testAI() {
    console.log("--- Testing Free AI Integration ---");
    const messages = [
        { role: "system", content: "You are a tutor. Use Cornell layout HTML." },
        { role: "user", content: "Explain Newton's first law in 2 sentences." }
    ];

    try {
        const result = await generateContent(messages);
        console.log("\n[SUCCESS] Received AI Response:");
        console.log("------------------------------");
        console.log(result);
        console.log("------------------------------");

        if (result && result.length > 50) {
            console.log("\n[VERIFIED] Free AI is working and returning substantial content.");
        } else {
            console.log("\n[FAILED] Response too short or empty.");
        }
    } catch (e) {
        console.error("\n[ERROR] AI Test Failed:", e.message);
    }
}

testAI();
