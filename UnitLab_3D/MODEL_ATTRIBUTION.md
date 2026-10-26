# 3D Model Attribution & Use

UnitLab 3D includes or references three-dimensional GLB assets from:

**PC Anatomy** — https://github.com/brickshow/pc-anatomy

Project code and assets are distributed under its MIT license (as declared by its repository), Copyright (c) 2026 brickshow.

The following copies are stored directly in this UnitLab GitHub repository:
- `models/ram.glb` — from `public/models/ram.glb`
- `models/m2-ssd.glb` — from `public/models/m.2.glb`
- `models/psu.glb` — from `public/models/psu.glb`

Other large models (e.g. GPU, motherboard, CPU, complete case, monitor, AVR, cooling assemblies) are loaded from the upstream GitHub repository on demand. The viewer library `@google/model-viewer` is by the Google model-viewer contributors and licensed Apache 2.0.

## MIT License from upstream

Copyright (c) 2026 brickshow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Classroom context

Models represent general computer hardware categories. They are *not* certified or exact 3D reproductions of every specific Ryzen, NVIDIA RTX, MSI, Gigabyte, ASUS, or Corsair SKU in the educational PC Builder. The pricing catalog is separate and subject to retailer verification. The drag-and-drop performance evaluation and safety training follow UnitLab's own instructional prototype.

## Additional assets used in the October 26, 2026 visual overhaul

The following **existing, real GLB assets from the same attributed PC Anatomy upstream repository** are linked directly (not copied into this repository):

- `public/models/case_fans.glb` — real modeled case-fan assembly installed as an eighth component in the 3D workbench.
- `public/models/system_unit.glb` — rotatable lightweight reference computer model.
- `public/models/system_unit_update.glb` — higher-detail rotatable system-unit reference, loaded only on request in the performance workbench and from the PC Builder's reference viewport.
- The interactive workbench already loads `motherboard.glb`, `cpu.glb`, `cpu_fan.glb`, and `gpu.glb` from the same upstream source, plus the locally copied RAM, M.2, and PSU meshes above.

### Technical limitations (important for research accuracy)

- The rotatable `system_unit` reference is **not an exact model of the currently selected retail SKU**. It is a representative computer chassis.
- The workbench models use actual GLB meshes, but the **3D table, anti-static mat, empty case frame, mounting zones, and rails are procedural educational approximations**. They are not certified CAD data from a case or motherboard manufacturer.
- The current guided simulator provides a motherboard-on-mat pre-assembly stage, an explicit mounting transition, and placement interaction for eight parts. Screw-thread physics, keyed 24-pin/EPS/PCIe/SATA connectors, torque verification, fan wiring and OS installation remain **future development**, not completed features.
- Real GLB models are downloaded at runtime and require an internet connection. A wireframe placeholder indicates asset loading/failure; it must not be described as a realistic representation.
- The source files' MIT license statement is inherited from the repository cited above. Models from unrelated Sketchfab links have not been copied because their individual reuse permissions were not verified.
