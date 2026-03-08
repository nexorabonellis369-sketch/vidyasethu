const fs = require('fs');
const path = require('path');

const rulesText = `
// 0. MUST USE UNICODE SYMBOLS:
// Always write the exact mathematical/Greek symbols, NEVER spell them out as words in formulas or derivations.
// Greek: π (not pi), ω (not omega), α β γ θ λ μ σ ρ φ τ δ ε Δ Ω
// Calculus: ∂ (not partial), ∇ (not del), ∫ ∬ ∭ ∮ ∑ √ ∞ ∝
// Operators: × · ÷ ± ≈ ≠ ≤ ≥ ⊥ ∠
// Special: ° ħ ε₀ μ₀
// Ex: "2πr" NOT "2 * pi * r". "ωt" NOT "omega * t". "∫F dx" NOT "integral of F dx". "Δx" NOT "delta x". "v₀" NOT "v0".
// Use HTML superscripts: x<sup>2</sup> not "x^2" or "x squared".
`;

// Update topicNotes.js
const topicNotesPath = path.join(__dirname, 'components', 'topicNotes.js');
let tn = fs.readFileSync(topicNotesPath, 'utf8');
if (tn.includes('CRITICAL FORMATTING RULES — Output ONLY raw HTML')) {
    tn = tn.replace('CRITICAL FORMATTING RULES — Output ONLY raw HTML (never markdown):', 'CRITICAL FORMATTING RULES — Output ONLY raw HTML (never markdown):' + rulesText);
    fs.writeFileSync(topicNotesPath, tn);
    console.log('topicNotes.js updated');
}

// Update doubtSolver.js
const doubtSolverPath = path.join(__dirname, 'components', 'doubtSolver.js');
let ds = fs.readFileSync(doubtSolverPath, 'utf8');
if (ds.includes('CRITICAL FORMATTING — Output ONLY raw HTML')) {
    ds = ds.replace('CRITICAL FORMATTING — Output ONLY raw HTML (never markdown):', 'CRITICAL FORMATTING — Output ONLY raw HTML (never markdown):' + rulesText);
    fs.writeFileSync(doubtSolverPath, ds);
    console.log('doubtSolver.js updated');
}
