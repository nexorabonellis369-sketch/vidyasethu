// Lab Helper Component
export function renderLabHelper(container, { getLabCourses, getCourseByCode }) {
  const labCourses = getLabCourses();

  container.innerHTML = `
    <div class="animate-fade">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-icon rose">🔬</div>
          <div>
            <div class="card-title">Lab Helper</div>
            <div class="card-desc">Complete experiment guides with aim, apparatus, theory, procedure, observations, calculations, result, and viva Q&amp;A.</div>
          </div>
        </div>
        <div class="form-group" style="margin-top:14px;">
          <label class="form-label">Laboratory Course</label>
          <select id="lh-course" class="form-select">
            <option value="">— Select Lab Course —</option>
            ${labCourses.map(c => `<option value="${c.code}">${c.code} – ${c.title}</option>`).join('')}
          </select>
        </div>
        <div id="lh-exp-group" style="display:none;" class="form-group">
          <label class="form-label">Experiment</label>
          <select id="lh-exp" class="form-select">
            <option value="">— Select Experiment —</option>
          </select>
        </div>
        <button id="lh-generate" class="btn btn-primary" disabled>🔬 Get Lab Guide</button>
      </div>
      <div id="lh-output"></div>
    </div>
  `;

  const courseSelect = document.getElementById('lh-course');
  const expGroup = document.getElementById('lh-exp-group');
  const expSelect = document.getElementById('lh-exp');
  const genBtn = document.getElementById('lh-generate');
  const output = document.getElementById('lh-output');

  courseSelect.addEventListener('change', () => {
    const code = courseSelect.value;
    const course = getCourseByCode(code);
    expSelect.innerHTML = '<option value="">— Select Experiment —</option>';
    if (!course || !course.units || !course.units[0]) { expGroup.style.display = 'none'; genBtn.disabled = true; return; }
    course.units[0].topics.forEach(t => {
      expSelect.innerHTML += `<option value="${t}">${t}</option>`;
    });
    expGroup.style.display = 'block';
    genBtn.disabled = true;
  });

  expSelect.addEventListener('change', () => { genBtn.disabled = !expSelect.value; });

  genBtn.addEventListener('click', () => {
    const code = courseSelect.value;
    const exp = expSelect.value;
    const course = getCourseByCode(code);
    if (course && exp) renderExperiment(output, course, exp);
  });
}

function renderExperiment(output, course, expName) {
  const data = getExpData(course.code, expName);
  output.innerHTML = `
    <div class="notes-content animate-slide">
      <div class="syllabus-header">
        <div class="sh-item"><span class="sh-label">Lab:</span><span class="sh-value">${course.code} – ${course.title}</span></div>
        <span class="sh-sep">|</span>
        <div class="sh-item"><span class="sh-label">Experiment:</span><span class="sh-value">${expName}</span></div>
      </div>

      <h2>🎯 Aim</h2>
      <p>${data.aim}</p>

      <h2>⚙️ Apparatus</h2>
      <div class="chip-list">
        ${data.apparatus.map(a => `<span class="chip">🔧 ${a}</span>`).join('')}
      </div>

      <h2>📐 Theory</h2>
      <p>${data.theory}</p>
      ${data.formula ? `<div class="formula-block">${data.formula}</div><p style="font-size:0.8rem;color:var(--text-tertiary);">${data.formulaNote}</p>` : ''}

      <h2>📋 Procedure</h2>
      ${data.procedure.map((step, i) => `
        <div class="step">
          <div class="step-num">${i + 1}</div>
          <div class="step-content">${step}</div>
        </div>
      `).join('')}

      <h2>📊 Observations & Tabulation</h2>
      <div class="code-block">${data.observations}</div>

      <h2>🧮 Calculations</h2>
      <p>${data.calculations}</p>
      ${data.calcFormula ? `<div class="formula-block">${data.calcFormula}</div>` : ''}

      <h2>✅ Result</h2>
      <div class="callout callout-success">
        <div class="callout-icon">✅</div>
        <div>${data.result}</div>
      </div>

      ${data.graph ? `<h2>📈 Graph</h2><div class="ascii-diagram">${data.graph}</div>` : ''}

      <h2>💬 Viva Questions & Answers</h2>
      ${data.viva.map((v, i) => `
        <div class="accordion">
          <button class="accordion-header" onclick="this.nextElementSibling.classList.toggle('open');">
            <span>Q${i + 1}: ${v.q}</span>
            <span>▶</span>
          </button>
          <div class="accordion-body">${v.a}</div>
        </div>
      `).join('')}

      <div class="callout callout-warning" style="margin-top:16px;">
        <div class="callout-icon">⚠️</div>
        <div><strong>Precautions:</strong> ${data.precautions.join(' | ')}</div>
      </div>
    </div>
  `;
}

function getExpData(courseCode, expName) {
  const name = expName.toLowerCase();

  if (name.includes("cantilever") || name.includes("youngs") || name.includes("bending")) {
    return {
      aim: "To determine Young's modulus of a given beam material by the method of uniform bending.",
      apparatus: ["Wooden/steel beam (1m)", "Two knife edges", "Hanger + slotted weights", "Vernier calliper", "Screw gauge", "Microscope with micrometer"],
      theory: "When a beam is loaded symmetrically at two points, it bends uniformly between the loading points. The bending moment is constant and the transverse strain is zero. The Young's modulus E is related to the depression 'y' at the centre.",
      formula: "E = (Mgal²) / (2bd³y)",
      formulaNote: "M = mass on each hanger, g = 9.8 m/s², a = distance between hanger and support, l = distance between supports, b = breadth, d = thickness, y = elevation at centre",
      procedure: [
        "Place the beam symmetrically on two knife edges separated by distance l.",
        "Attach hangers at equal distances 'a' from each support. Level the microscope crosswire on the beam's midpoint.",
        "Add weights M in steps of 50g. Note the reading of the travelling microscope for each load.",
        "Unload in the same steps and record readings.",
        "Use a vernier calliper to measure l, a, b. Use a screw gauge to measure d (thickness) at five places.",
        "Calculate mean elevation y = (elevation with load – elevation without load) from the graph."
      ],
      observations: `Breadth b = ___ m   Thickness d = ___ m
Load     | Travelling Microscope Reading
(grams)  | Loading (mm)  | Unloading (mm) | Mean (mm)
---------+--------------+---------------+----------
 0       |              |               |
 50      |              |               |
100      |              |               |
150      |              |               |
200      |              |               |`,
      calculations: "Plot load (M) vs depression (y). Find slope dy/dM from the graph. Substitute in formula:",
      calcFormula: "E = (g × a × l²) / (2 × b × d³ × slope(y/M))",
      result: "Young's modulus of the given beam = _______ × 10¹⁰ N/m². Standard value (steel ≈ 2×10¹¹ Pa, wood ≈ 10⁹ Pa).",
      graph: `  y ↑
     │            ✦
     │        ✦
     │    ✦
     │✦
     └──────────────→ M (load)
  Slope = Δy/ΔM → Use to calculate E`,
      viva: [
        { q: "What are the conditions for a uniform bending experiment?", a: "The beam must be loaded symmetrically so the BM (bending moment) is constant between the loading points. No shear force should be present in this region." },
        { q: "Why is the microscope focused on the midpoint of the beam?", a: "The maximum elevation (depression) occurs at the centre of the span. The midpoint gives the most accurate measurement unaffected by shear deflection." },
        { q: "What is the significance of Young's modulus?", a: "Young's modulus (E = stress/strain) measures a material's stiffness or resistance to elastic deformation. Higher E means stiffer material (steel > aluminium > wood)." },
        { q: "How does the shape of the beam cross-section affect bending?", a: "The moment of inertia I = bd³/12 for rectangular cross-sections. I-section beams have high I with less material, making them efficient for structural applications." },
        { q: "State Hooke's law.", a: "Within the elastic limit, stress is directly proportional to strain. Stress = E × Strain, where E is Young's modulus." }
      ],
      precautions: [
        "Load and unload gradually — avoid jerks",
        "Measure thickness at at least 5 different points",
        "Ensure knife edges are parallel and at the same level",
        "Wait for the beam to settle before taking each reading"
      ]
    };
  }

  if (name.includes("torsion") || name.includes("rigidity")) {
    return {
      aim: "To determine the rigidity modulus of the wire using a torsion pendulum.",
      apparatus: ["Circular disc", "Suspension wire", "Damping plates", "Stopwatch", "Screw gauge", "Meter scale", "Vernier calliper"],
      theory: "A disc suspended by a wire oscillates about the vertical axis (torsional oscillations). The restoring couple is C = (πηr⁴)/(2l) where η = rigidity modulus, r = radius of wire, l = length.",
      formula: "η = (8πI₀l) / (r⁴T₀²)",
      formulaNote: "I₀ = moment of inertia of disc alone, T₀ = period without mass, l = length of wire, r = radius of wire",
      procedure: [
        "Measure length l of the suspension wire using a meter scale.",
        "Measure radius r of the wire at 5 places using a screw gauge.",
        "Set the disc into torsional oscillations (small angular displacement only).",
        "Measure time for 20 oscillations. Repeat 3 times. Calculate T₀.",
        "Place equal masses symmetrically at distance d₁ from centre. Measure new period T₁.",
        "Increase distance to d₂. Measure T₂.",
        "Calculate I₀ using I₀ = 2m(T₁²-T₀²)d₁² / (T₂²-T₁²) — doesn't require disc dimensions."
      ],
      observations: `Radius of wire r = _____ m   Length l = _____ m
Period T₀ (without mass): ___ s
Period T₁ (mass at d₁):   ___ s
Period T₂ (mass at d₂):   ___ s`,
      calculations: "From the periods and mass positions, calculate I₀, then η.",
      calcFormula: "I₀ = m × (T₁²-T₀²)(T₀²-T₁²) × [d₂²(T₁²-T₀²) - d₁²(T₂²-T₀²)]⁻¹ … then η = 8πI₀l / (r⁴T₀²)",
      result: "Rigidity modulus η of the given wire = ______ × 10¹⁰ N/m² (standard for steel ≈ 8×10¹⁰ Pa).",
      graph: null,
      viva: [
        { q: "What is rigidity modulus?", a: "Rigidity (shear) modulus η = shear stress / shear strain. It measures a material's resistance to shape change under shear forces, unlike Young's modulus which measures resistance to length change." },
        { q: "Why is the angular displacement kept small?", a: "For small angles, the restoring couple is proportional to angular displacement. Large oscillations introduce anharmonic terms, making SHM equations invalid." },
        { q: "What is the advantage of the method using two positions of masses?", a: "This method (two distance method) eliminates the need to measure the disc's moment of inertia directly, reducing systematic error from assuming uniform disc geometry." },
        { q: "What is the relation between η, E and Poisson's ratio σ?", a: "E = 2η(1 + σ). For steel, E ≈ 2×10¹¹, η ≈ 8×10¹⁰, giving σ ≈ 0.25." }
      ],
      precautions: [
        "Oscillations must be purely torsional — ensure no pendulum swing",
        "Masses must be equidistant from the centre",
        "Measure wire radius at multiple points — take minimum reading",
        "Angular amplitude should be ≤ 5°"
      ]
    };
  }

  // Generic fallback experiment
  return {
    aim: `To study ${expName} and verify the underlying theoretical principles.`,
    apparatus: ["As specified by the laboratory manual", "Measuring instruments appropriate to the experiment", "Data recording materials"],
    theory: `This experiment belongs to ${courseCode} lab. The underlying theory connects to the corresponding theory course unit. Consult the prescribed textbook for the detailed theoretical background.`,
    formula: "Refer to the prescribed formula in the laboratory manual",
    formulaNote: "Define all symbols clearly. Ensure consistent SI units throughout.",
    procedure: [
      "Read the complete experiment from the lab manual before starting.",
      "Set up the apparatus carefully as per the circuit/setup diagram.",
      "Verify all connections and measurements before collecting data.",
      "Record observations in tabular form with proper units.",
      "Take a minimum of 5–6 readings (loading and unloading if applicable).",
      "Plot a graph of the relevant quantities to extract the experimental value.",
      "Calculate the result and compare with the standard (textbook) value."
    ],
    observations: `Record your observations in tabular form:
S.No | Parameter 1 | Parameter 2 | Parameter 3 | Result
-----+-------------+-------------+-------------+-------
  1  |             |             |             |
  2  |             |             |             |`,
    calculations: "Apply the relevant formula. Substitute mean values from the observation table. Show all intermediate steps.",
    calcFormula: "Experimental value = (derived from your observations)",
    result: `The experimental value of the required quantity has been determined. Compare with the standard value and calculate percentage error = |Exp − Standard| / Standard × 100%.`,
    graph: null,
    viva: [
      { q: `What is the principle behind ${expName}?`, a: "Refer to the underlying physical law or mathematical relationship from the theory unit in your respective theory course syllabus." },
      { q: "What are the sources of error in this experiment?", a: "Common sources: least count error of instruments, parallax error, backlash error in screw gauges, temperature fluctuations, and systematic calibration errors." },
      { q: "How would you improve the accuracy of this experiment?", a: "Use instruments with smaller least counts, take more readings to average out random errors, control environmental conditions, and calibrate instruments before use." },
      { q: "State the relevant law/theorem governing this experiment.", a: "Refer to the prescribed theory course textbook for the exact statement applicable to this experiment." }
    ],
    precautions: [
      "Handle all instruments carefully — report damage immediately",
      "Take at least 5 readings and average them",
      "Verify connections / setup before starting data collection",
      "Record all raw data in the observation table — never calculate first"
    ]
  };
}
