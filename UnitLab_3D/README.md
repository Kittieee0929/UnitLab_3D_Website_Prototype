# UnitLab 3D — Educational Prototype

**Research title:** Developing and Evaluating UnitLab 3D: An Interactive Web-Based System Unit Simulation for Enhancing Learners’ Performance in Computer Hardware Servicing.

## How to run

1. Extract this ZIP archive.
2. Double-click `index.html` to open it in Chrome, Edge, or another modern browser.
3. Use **3D Hardware Lab** to rotate, inspect, and simulate removing/reinstalling parts.
4. Use **Learning Modules** and **Knowledge Check** for practice.
5. Use **Performance Rubric** to enter a learner code and supervised practical pretest/posttest scores, then export CSV.

No installation, login, network connection, third-party dependency, or web server is required. For a hosted website, upload `index.html`, `styles.css`, and `app.js` to a static host.

## Research alignment

- Part identification, safety, disassembly, and reassembly are the four core practical performance areas.
- The guided virtual simulation and knowledge check are *instructional practice*, not a valid substitute for observing real practical competencies.
- The default **0–4 performance rubric is an illustrative placeholder** and is **not claimed to be an adopted or validated instrument**. Replace it with the actual adopted rubric and approved research procedures before using scores for research.
- Pretest and posttest rows use a consistent anonymous learner code. Data are kept only in the current browser's `localStorage` until CSV export, which the user manually initiates.
- The overview shows descriptive statistics only. Significance analysis and assumption checks must be performed separately, and research findings should not be claimed by the website itself.
- The 3D objects are intentionally stylized and not accurate CAD or engineering models. The assembly sequence is simplified; follow model-specific instructions and teacher supervision for real hardware.

## Privacy and safety

Avoid identifiable student names in the scoring form. This prototype has no authentication, secure database, shared-device isolation, cloud sync, or formal research-data governance. Export records to an approved institution-controlled location before clearing browser data. Do not use the site as a substitute for laboratory safety procedures. Never open a power supply housing.

## Files

- `index.html` — all views and structure
- `styles.css` — responsive dark-teal theme
- `app.js` — interactive zero-dependency 3D canvas engine, teaching content, guided simulations, quizzes, local scoring/CSV export

© 2026 UnitLab 3D / CBAR instructional prototype.
