# UnitLab 3D — CBAR Learning Studio (2026)

**Research:** Developing and Evaluating UnitLab 3D: An Interactive Web-Based System Unit Simulation for Enhancing Learners’ Performance in Computer Hardware Servicing.

## Upgraded RGB 3D Worklab (October 23, 2026)

The main learning studio's **3D Workbench** now loads `worklab-pro.html` and `worklab-pro.js`. These add a genuine browser-based Three.js WebGL scene (not a static image or fixed-angle canvas), orbit and zoom controls, geometry for a gaming-style system unit, motherboard, CPU, CPU cooler, RAM, NVMe SSD, graphics card, PSU, spinning RGB fans, optional tempered-glass panel and exploded view, plus selectable parts and guided assembly/disassembly.

Open directly: `UnitLab_3D/worklab-pro.html`.

The Three.js library is loaded from the pinned jsDelivr CDN, so **internet access is necessary** for this upgraded worklab. The original offline-friendly `index.html` remains separately available for its earlier teaching and assessment prototype functions. The 3D meshes are original teaching approximations, **not exact CAD scans or brand-accurate manufacturer models**. The 3D guided tasks are virtual practice, not direct observations of real hardware competencies.

## Open the website

On GitHub Pages, the repository-root `index.html` redirects to `UnitLab_3D/academy.html`, the updated landing page. The original `UnitLab_3D/index.html` remains available for the guided 3D laboratory and practical assessment screen.

Locally, open `academy.html` in a modern browser, or run VS Code Live Server. For all original and revised pages in one directory, retain the file structure.

## New learning-studio features

- **Official resources:** seven attributed links to the DepEd Learning Portal, DepEd Ligtas Aral activity sheets, and TESDA CSS NC II training regulations. Official documents are not silently republished or misrepresented as UnitLab material.
- **Curriculum map:** matches UnitLab activities to CSS concepts and competencies.
- **Six instructional modules:** classroom-authored material with learning targets, objectives, readings, formative tasks, reflection prompts, and official supporting-resource links.
- **Three teacher lesson plans:** actionable original adaptations with duration, objectives, materials, procedures, assessment and reflection; printable to PDF through browser printing. These are **not** claimed to be DepEd-published lesson plans. The resource library separately links a genuine DepEd-hosted example.
- **PC builder:** 25 sample component choices across CPU, motherboard, RAM, GPU, storage, PSU, case and cooler. Checks CPU socket, memory generation, integrated-graphics availability, estimated power headroom, case form factor, nominal graphics-card clearance and cooler socket. Visual tower is **stylized**, not an exact CAD or photorealistic model. The original rotatable system-unit model is available as a separate 3D lab.
- **Philippine price examples:** some named entries reflect retailer listings reviewed in October 2026. Other prices are explicitly tagged illustrative classroom estimates. Prices and availability may change without notice, and variant-specific compatibility must be confirmed with manufacturer specifications. The builder cannot purchase parts or retrieve live prices.
- **Tools and PPE:** safe uses of hand tools, ESD measures, hazard controls, and a supervised pre-work checklist.
- **Student demo sign-in/out:** anonymized classroom codes persist for the browser tab through sessionStorage. Demo module progress, quiz results, and saved builds use localStorage, not a secure database.

## Curriculum & primary references

- DepEd CSS NC II Curriculum Guide: https://lrmds.deped.gov.ph/detail/14540
- DepEd Grade 11 Computer Hardware Assembly self-learning module: https://lrmds.deped.gov.ph/detail/19129
- DepEd Ligtas Aral Grade 9 CSS LAS05–LAS40: https://www.deped.gov.ph/ligtas-aral/
- DepEd Use of Hand Tools learning exemplar: https://lrmds.deped.gov.ph/detail/25869
- DepEd The System Unit resource: https://lrmds.deped.gov.ph/detail/16475
- DepEd-hosted CSS lesson-plan example (software updates): https://lrmds.deped.gov.ph/detail/15756
- TESDA CSS NC II Training Regulations: https://tesda.gov.ph/Downloadables/TRs/TR%20Computer%20Systems%20Servicing%20NC%20II%20.pdf

## Price reference examples

- AMD Ryzen 5 5600, Ryzen 5 7600, MSI B550M PRO-VDH WiFi, Gigabyte B650M Gaming WiFi, Gigabyte B650M D3HP, WD Blue SN580, and Corsair CX650: product listings at Bermor Techzone linked inside the app.
- ASUS Dual RX 7600 product listed by Bermor Techzone; specific partner card dimension is treated as approximate for teaching.
- Other prices or unverified variants: illustrative only, with EasyPC's pricelist provided as a shop browsing reference.

## Privacy, security and research limitations

**This site does not implement secure student account authentication.** GitHub Pages serves static HTML/CSS/JS. An anonymized learner code is merely a local demonstration profile; it is not secret, verifies no identity, has no password, and cannot prevent one student from entering another code on the same browser. Logging out clears the tab's active profile but leaves its local practice progress on the browser. Do **not** enter actual learner names, grades, identifiers, consent data, or sensitive research information. Real school-wide accounts require an authentication provider, backend, database, access rules, consent/data-retention review, and institutional approval.

The teacher's original practical rubric is still **an illustrative placeholder**, not an adopted or validated instrument. Observed real-hardware practical pretest/posttest must follow the approved rubric, supervision, and research protocol. The student knowledge check is formative only.

Product compatibility flags are simplified examples: not exhaustive for firmware revisions, socket specifications, electrical connectors, form factors, cooler dimensions, PCIe power, thermal design, memory QVL, or manufacturer requirements. Always verify before assembling or buying.

© 2026 UnitLab 3D / CBAR project.

## Configurable named PC builds and memory layouts — October 23, 2026

The `academy.html` PC Builder now loads `configurator-pro.js`. It adds:
- AMD Ryzen 5 5600X, Ryzen 7 5700X, Ryzen 7 5700X3D, Ryzen 7 7700 and other AM4/AM5 processors.
- RTX 4060, RTX 5070 and manufacturer-specific examples such as MSI Ventus 2X and ASUS Prime; GPU fan number and approximate size propagate to the WebGL model.
- DDR4/DDR5 configurations including 2×8GB, 2×16GB, 4×8GB, 4×16GB and 2×32GB. Four-stick configurations are checked against the motherboard's verified DIMM-slot count (some B650M Gaming WiFi revisions have only **two** slots).
- Presets for Ryzen 5 5600X + RTX 4060 and Ryzen 7 5700X3D + RTX 5070, including several four-DIMM examples.
- Automatic eight-category, component-only total in Philippine pesos and itemized CSV export.
- Core socket, memory generation, DIMM count, iGPU availability, GPU length, PSU recommendation, cooler support and case-form-factor checks with follow-up warnings for power cables, BIOS and memory training.

`academy.html` and `worklab-pro.html` synchronize configurations through same-origin browser localStorage and postMessage. On the model page, users can also select CPU, GPU and RAM, and see the selected fan count, RAM-stick count, SKU label and calculated parts total. These are **SKU-inspired geometry approximations**, not licensed 1:1 manufacturer 3D files or manufacturer-approved digital twins. Exact commercial CAD/GLB reproductions would require verified assets and usage rights for each specific SKU.

**Pricing:** The sample quotes represent time-stamped examples from EasyPC, PCHub or DynaQuest listings and marked educational estimates. They are **not live store prices**. RTX 5070 reference listings checked included a September 11, 2026 PCHub price snapshot, not a guaranteed current offer. Currency is PHP; totals omit shipping, assembly service, compatibility edge cases and retailer-stock confirmation.

Useful hardware references:
- AMD Ryzen 5 5600X: https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html
- AMD Ryzen 7 5700X3D: https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-7-5700x3d.html
- NVIDIA GeForce RTX 5070: https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/
- MSI RTX 5070 Ventus 2X OC: https://www.msi.com/Graphics-Card/GeForce-RTX-5070-12G-VENTUS-2X-OC/Specification
- MSI B550M PRO-VDH WiFi: https://www.msi.com/Motherboard/B550M-PRO-VDH-WIFI/Specification
- Gigabyte B650M Gaming WiFi (2 DIMMs): https://www.gigabyte.com/Motherboard/B650M-GAMING-WIFI-rev-10/sp

