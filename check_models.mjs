async function checkModels() {
    const key = "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";

    // 1. List free models available
    const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { "Authorization": `Bearer ${key}` }
    });
    const data = await res.json();
    const freeModels = data.data?.filter(m => m.pricing?.prompt === "0" || m.id.includes(":free"));
    console.log("\n=== FREE MODELS AVAILABLE ===");
    freeModels?.forEach(m => console.log(m.id));

    // 2. Check key info
    const keyRes = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: { "Authorization": `Bearer ${key}` }
    });
    const keyData = await keyRes.json();
    console.log("\n=== KEY INFO ===");
    console.log(JSON.stringify(keyData, null, 2));
}

checkModels().catch(console.error);
