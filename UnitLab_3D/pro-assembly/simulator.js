import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

const CATEGORY_ORDER = ['motherboard', 'cpu', 'memory', 'storage', 'psu', 'cooler', 'gpu', 'fans', 'cables'];
const REQUIRED_TO_POWER = ['motherboard', 'cpu', 'memory', 'storage', 'psu', 'cooler', 'gpu', 'fans', 'cables'];
const CATEGORY_LABELS = {
  motherboard: 'Motherboard',
  cpu: 'Processor',
  memory: 'Memory',
  storage: 'Storage',
  psu: 'Power Supply',
  cooler: 'Cooling',
  gpu: 'Graphics Card',
  fans: 'Case Airflow',
  cables: 'Cable Kit',
};

const CASE_SPEC = {
  maxGpuLength: 360,
  maxRadiator: 360,
  fanSize: 120,
  psuForm: 'ATX',
};

const PARTS = {
  motherboard: [
    { id: 'aurora-x670e', name: 'Aurum X670E Quantum', subtitle: 'AM5 • DDR5 • E-ATX armor', socket: 'AM5', memoryType: 'DDR5', storage: ['M.2', 'SATA'], price: 489, watts: 35, perf: 88, color: '#16263a', accent: '#00e5ff' },
    { id: 'z790-neon', name: 'Vector Z790 Neon', subtitle: 'LGA1700 • DDR5 • creator IO', socket: 'LGA1700', memoryType: 'DDR5', storage: ['M.2', 'SATA'], price: 439, watts: 32, perf: 84, color: '#211933', accent: '#c07cff' },
    { id: 'b650-studio', name: 'B650 Studio Carbon', subtitle: 'AM5 • DDR5 • compact ATX', socket: 'AM5', memoryType: 'DDR5', storage: ['M.2'], price: 249, watts: 24, perf: 70, color: '#111a17', accent: '#67f08a' },
  ],
  cpu: [
    { id: 'ryzen-9950x3d', name: 'Ryzen 9 9950X3D', subtitle: '16 cores • huge cache • AM5', socket: 'AM5', price: 699, watts: 170, perf: 99, color: '#f3b36b', accent: '#ff7a1a' },
    { id: 'core-ultra-9', name: 'Core Ultra 9 285K', subtitle: '24 threads • LGA1700 lab bin', socket: 'LGA1700', price: 619, watts: 185, perf: 95, color: '#a7e8ff', accent: '#4bb6ff' },
    { id: 'ryzen-7800x3d', name: 'Ryzen 7 7800X3D', subtitle: '8 cores • efficient gaming • AM5', socket: 'AM5', price: 349, watts: 120, perf: 87, color: '#e6a35f', accent: '#ffb000' },
  ],
  memory: [
    { id: 'ddr5-royal-64', name: '64GB DDR5 Royal RGB', subtitle: '2×32GB • 7200MT/s • mirror lightbar', memoryType: 'DDR5', sticks: 2, price: 249, watts: 18, perf: 84, color: '#e9eefc', accent: '#ff5eea' },
    { id: 'ddr5-stealth-32', name: '32GB DDR5 Stealth', subtitle: '2×16GB • 6400MT/s • low profile', memoryType: 'DDR5', sticks: 2, price: 139, watts: 12, perf: 70, color: '#161a22', accent: '#4dff88' },
    { id: 'ddr4-legacy-32', name: '32GB DDR4 Legacy', subtitle: '2×16GB • 3600MT/s • incompatible demo', memoryType: 'DDR4', sticks: 2, price: 89, watts: 10, perf: 52, color: '#2f3646', accent: '#ffd166' },
  ],
  storage: [
    { id: 'gen5-4tb', name: '4TB Gen5 NVMe Blade', subtitle: '14GB/s • M.2 heatshield', interface: 'M.2', price: 399, watts: 12, perf: 92, color: '#111827', accent: '#00ffa8' },
    { id: 'gen4-2tb', name: '2TB Gen4 NVMe', subtitle: '7GB/s • cool and quiet', interface: 'M.2', price: 149, watts: 7, perf: 74, color: '#1d2330', accent: '#61dafb' },
    { id: 'sata-8tb', name: '8TB SATA Archive SSD', subtitle: 'mass storage • cable managed', interface: 'SATA', price: 329, watts: 8, perf: 55, color: '#2d3342', accent: '#f6c85f' },
  ],
  psu: [
    { id: 'titanium-1200', name: '1200W Titanium Modular', subtitle: 'ATX 3.1 • native 12V-2×6', form: 'ATX', capacity: 1200, price: 299, watts: 0, perf: 90, color: '#22272f', accent: '#f2f4f8' },
    { id: 'platinum-850', name: '850W Platinum Modular', subtitle: 'quiet curve • braided leads', form: 'ATX', capacity: 850, price: 169, watts: 0, perf: 75, color: '#1d2228', accent: '#9bd3ff' },
    { id: 'bronze-550', name: '550W Bronze Compact', subtitle: 'budget unit • intentional warning', form: 'ATX', capacity: 550, price: 69, watts: 0, perf: 45, color: '#303030', accent: '#d1904f' },
  ],
  cooler: [
    { id: 'novaloop-360', name: 'NovaLoop 360 AIO', subtitle: '360mm radiator • magnetic LCD pump', type: 'aio', sockets: ['AM5', 'LGA1700'], radiator: 360, price: 249, watts: 18, perf: 94, color: '#10131a', accent: '#45f3ff' },
    { id: 'twin-tower-pro', name: 'Twin Tower Pro Air', subtitle: 'dual fin stack • 160mm height', type: 'air', sockets: ['AM5', 'LGA1700'], height: 160, price: 119, watts: 8, perf: 78, color: '#292f38', accent: '#a2fff2' },
    { id: 'micro-120', name: 'MicroLoop 120', subtitle: '120mm radiator • weaker for halo CPUs', type: 'aio', sockets: ['LGA1700'], radiator: 120, price: 79, watts: 9, perf: 48, color: '#161616', accent: '#ff8c42' },
  ],
  gpu: [
    { id: 'rtx-5090-prism', name: 'RTX 5090 Prism OC', subtitle: '32GB • triple fan • 336mm', length: 336, slots: 3.5, price: 1999, watts: 575, perf: 100, color: '#11151d', accent: '#63ffdd' },
    { id: 'rx-9900-xtx', name: 'Radeon RX 9900 XTX', subtitle: '24GB • vapor chamber • 322mm', length: 322, slots: 3, price: 1199, watts: 390, perf: 88, color: '#240d12', accent: '#ff3b62' },
    { id: 'mini-4070', name: 'RTX 4070 Mini Studio', subtitle: '12GB • compact • 244mm', length: 244, slots: 2, price: 549, watts: 210, perf: 68, color: '#1c2530', accent: '#8cf6ff' },
  ],
  fans: [
    { id: 'halo-120-pack', name: 'TriHalo 120mm Pack', subtitle: '3× magnetic levitation RGB', size: 120, count: 3, price: 89, watts: 10, perf: 76, color: '#0f172a', accent: '#8b5cf6' },
    { id: 'nocturne-silent', name: 'Nocturne Silent Pack', subtitle: '3× acoustic tuned airflow', size: 120, count: 3, price: 79, watts: 7, perf: 72, color: '#4a3223', accent: '#f5c17b' },
    { id: 'oversize-140', name: 'Storm 140mm Pair', subtitle: '2× oversize fans • case warning', size: 140, count: 2, price: 99, watts: 8, perf: 80, color: '#101010', accent: '#78e4ff' },
  ],
  cables: [
    { id: 'sleeved-arctic', name: 'Arctic Sleeved Kit', subtitle: 'white combs • GPU bridge • 24-pin', price: 79, watts: 0, perf: 48, color: '#e9eefc', accent: '#88f7ff' },
    { id: 'sleeved-obsidian', name: 'Obsidian Sleeved Kit', subtitle: 'black weave • stealth route', price: 69, watts: 0, perf: 44, color: '#101014', accent: '#a855f7' },
    { id: 'rgb-flow', name: 'LumaFlow RGB Cables', subtitle: 'addressable 24-pin and GPU leads', price: 129, watts: 6, perf: 55, color: '#f8fbff', accent: '#ff6bd6' },
  ],
};

const state = {
  selected: Object.fromEntries(CATEGORY_ORDER.map((category) => [category, PARTS[category][0]])),
  selectedCategory: 'motherboard',
  installed: {},
  powered: false,
  exploded: false,
  thermal: false,
  cinematic: false,
  hoverCategory: null,
  log: ['Workbench calibrated. Select a part, then click its glowing 3D slot.'],
  errors: [],
};

window.addEventListener('error', (event) => state.errors.push(event.message));
window.addEventListener('unhandledrejection', (event) => state.errors.push(String(event.reason)));

const app = document.querySelector('#app');
const catalogEl = document.querySelector('#catalog');
const compatibilityEl = document.querySelector('#compatibility');
const gradeEl = document.querySelector('#grade');
const perfEl = document.querySelector('#perfMetric');
const wattEl = document.querySelector('#wattMetric');
const budgetEl = document.querySelector('#budgetMetric');
const thermalEl = document.querySelector('#thermalMetric');
const stepListEl = document.querySelector('#stepList');
const progressTextEl = document.querySelector('#progressText');
const logEl = document.querySelector('#buildLog');
const toastEl = document.querySelector('#toast');

RectAreaLightUniformsLib.init();

const scene = new THREE.Scene();
scene.background = new THREE.Color('#08101c');
scene.fog = new THREE.FogExp2('#08101c', 0.035);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(5.25, 3.75, 7.25);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.85));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.target.set(0, -0.05, 0);
controls.minDistance = 4.1;
controls.maxDistance = 12;
controls.maxPolarAngle = Math.PI * 0.53;
controls.minPolarAngle = Math.PI * 0.18;
controls.enablePan = false;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.edgeStrength = 2.0;
outlinePass.edgeGlow = 0.22;
outlinePass.edgeThickness = 1.35;
outlinePass.visibleEdgeColor.set('#ffffff');
outlinePass.hiddenEdgeColor.set('#18f4ff');
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.24, 0.60, 0.70);
composer.addPass(renderPass);
composer.addPass(outlinePass);
bloomPass.enabled = false; // cleaner materials by default; optional cinematic mode
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

const clock = new THREE.Clock();
const root = new THREE.Group();
const installedRoot = new THREE.Group();
const slotRoot = new THREE.Group();
const thermalGroup = new THREE.Group();
const dustGroup = new THREE.Group();
scene.add(root, installedRoot, slotRoot, thermalGroup, dustGroup);
thermalGroup.visible = false;

const slotDefs = {
  motherboard: { label: 'Motherboard tray', pos: [-0.45, 0.42, -0.39], size: [2.62, 3.48, 0.16], color: '#00e5ff', explode: [-1.18, 0.12, 0.72] },
  cpu: { label: 'CPU socket', pos: [-0.84, 1.08, -0.2], size: [0.68, 0.68, 0.17], color: '#ffb000', explode: [-1.05, 0.62, 1.25] },
  memory: { label: 'DDR5 DIMMs', pos: [0.18, 0.94, -0.18], size: [0.72, 1.62, 0.17], color: '#ff5eea', explode: [0.25, 1.05, 1.15] },
  storage: { label: 'M.2 storage', pos: [-0.38, 0.02, -0.18], size: [1.08, 0.3, 0.14], color: '#00ffa8', explode: [-0.35, 0.28, 1.25] },
  psu: { label: 'PSU bay', pos: [0.62, -1.78, 0.09], size: [1.55, 0.78, 1.38], color: '#e9eefc', explode: [1.15, -0.12, 0.78] },
  cooler: { label: 'Cooling mount', pos: [-0.84, 1.08, 0.08], size: [1.05, 1.05, 0.45], color: '#45f3ff', explode: [-0.78, 1.02, 1.48] },
  gpu: { label: 'PCIe GPU slot', pos: [-0.05, -0.67, 0.15], size: [2.82, 0.78, 0.52], color: '#63ffdd', explode: [0.05, -0.05, 1.72] },
  fans: { label: 'Airflow rail', pos: [1.66, 0.28, 0.03], size: [0.58, 3.45, 0.2], color: '#8b5cf6', explode: [0.85, 0.3, 0.95] },
  cables: { label: 'Cable routing', pos: [-0.05, -0.16, 0.43], size: [3.18, 3.72, 0.32], color: '#ff6bd6', explode: [0.42, -0.02, 1.62] },
};

const slots = {};
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const slotHitboxes = [];
const animatedFans = [];
const rgbMaterials = [];
const tweens = [];
const reusableColor = new THREE.Color();

const textureCache = {
  brushed: makeBrushedTexture(),
  carbon: makeCarbonTexture(),
  bench: makeBenchTexture(),
};

const materials = createMaterialLibrary();

setupLighting();
createWorld();
createSlots();
createThermalViz();
createDust();
renderAllUI();
selectCategory('motherboard');

function createMaterialLibrary() {
  textureCache.brushed.wrapS = textureCache.brushed.wrapT = THREE.RepeatWrapping;
  textureCache.brushed.repeat.set(2, 2);
  textureCache.carbon.wrapS = textureCache.carbon.wrapT = THREE.RepeatWrapping;
  textureCache.carbon.repeat.set(4, 4);
  textureCache.bench.wrapS = textureCache.bench.wrapT = THREE.RepeatWrapping;
  textureCache.bench.repeat.set(4, 2);

  return {
    darkMetal: new THREE.MeshStandardMaterial({ color: '#111721', roughness: 0.48, metalness: 0.72, map: textureCache.brushed }),
    blackRubber: new THREE.MeshStandardMaterial({ color: '#05070a', roughness: 0.85, metalness: 0.05 }),
    frame: new THREE.MeshStandardMaterial({ color: '#0d1320', roughness: 0.38, metalness: 0.86, envMapIntensity: 0.9 }),
    bench: new THREE.MeshStandardMaterial({ color: '#2f2533', roughness: 0.62, metalness: 0.2, map: textureCache.bench }),
    pcb: new THREE.MeshStandardMaterial({ color: '#101d2a', roughness: 0.52, metalness: 0.18, envMapIntensity: 0.4 }),
    copper: new THREE.MeshStandardMaterial({ color: '#ce7a3a', roughness: 0.28, metalness: 0.85 }),
    gold: new THREE.MeshStandardMaterial({ color: '#f7c96d', roughness: 0.24, metalness: 0.9 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#ccefff', roughness: 0.05, metalness: 0, transmission: 0.25, opacity: 0.12, transparent: true, thickness: 0.08, ior: 1.35, envMapIntensity: 1.4 }),
    smokedGlass: new THREE.MeshPhysicalMaterial({ color: '#6be8ff', roughness: 0.12, metalness: 0, transmission: 0.10, opacity: 0.10, transparent: true, thickness: 0.08, ior: 1.35 }),
    hologram: new THREE.MeshBasicMaterial({ color: '#18f4ff', transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false }),
    tableGlow: new THREE.MeshBasicMaterial({ color: '#2ceaff', transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false }),
    label: new THREE.SpriteMaterial({ color: '#ffffff', transparent: true, depthWrite: false }),
  };
}

function setupLighting() {
  const hemi = new THREE.HemisphereLight('#bfeaff', '#17111d', 1.2);
  scene.add(hemi);

  const key = new THREE.DirectionalLight('#eaf7ff', 3.2);
  key.position.set(3.4, 6.5, 4.3);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 18;
  key.shadow.bias = -0.00008;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const rim = new THREE.DirectionalLight('#a46cff', 2.2);
  rim.position.set(-4, 2.7, -3.5);
  scene.add(rim);

  const rect1 = new THREE.RectAreaLight('#57e9ff', 4.5, 4, 2.2);
  rect1.position.set(-2.6, 3.5, 2.8);
  rect1.lookAt(0, 0, 0);
  scene.add(rect1);

  const rect2 = new THREE.RectAreaLight('#ff6bd6', 2.8, 2.4, 2.8);
  rect2.position.set(3.2, 1.4, 2.2);
  rect2.lookAt(0.1, -0.1, 0);
  scene.add(rect2);

  const insideA = new THREE.PointLight('#38f8ff', 1.2, 4.6, 2);
  insideA.position.set(-0.9, 1.2, 0.6);
  const insideB = new THREE.PointLight('#ff62d8', 1.0, 4.8, 2);
  insideB.position.set(1.3, -0.8, 0.55);
  scene.add(insideA, insideB);
}

function createWorld() {
  const bench = mesh(new RoundedBoxGeometry(9.6, 0.32, 6.2, 8, 0.08), materials.bench, [0, -2.62, 0.15]);
  bench.receiveShadow = true;
  root.add(bench);

  const benchGlow = mesh(new THREE.PlaneGeometry(5.4, 3.8), materials.tableGlow, [0, -2.445, 0.08], [-Math.PI / 2, 0, 0]);
  root.add(benchGlow);

  const floor = mesh(new THREE.PlaneGeometry(24, 18), new THREE.MeshStandardMaterial({ color: '#070a10', roughness: 0.82, metalness: 0.05 }), [0, -2.82, 0], [-Math.PI / 2, 0, 0]);
  floor.receiveShadow = true;
  root.add(floor);

  createCase(root);
  createWorkbenchProps(root);
  createBackdrop(root);
}

function createCase(parent) {
  const caseGroup = new THREE.Group();
  parent.add(caseGroup);

  const back = mesh(new RoundedBoxGeometry(4.25, 5.35, 0.11, 8, 0.07), materials.frame, [0, -0.02, -0.72]);
  back.receiveShadow = true;
  caseGroup.add(back);

  const trayInset = mesh(new RoundedBoxGeometry(3.35, 4.35, 0.05, 8, 0.06), new THREE.MeshStandardMaterial({ color: '#0a1019', roughness: 0.54, metalness: 0.6 }), [-0.25, 0.12, -0.64]);
  trayInset.receiveShadow = true;
  caseGroup.add(trayInset);

  const beams = [
    [-2.18, -0.03, 0.05, 0.16, 5.55, 1.95],
    [2.18, -0.03, 0.05, 0.16, 5.55, 1.95],
    [0, 2.76, 0.05, 4.55, 0.18, 1.95],
    [0, -2.78, 0.05, 4.55, 0.18, 1.95],
  ];
  beams.forEach(([x, y, z, w, h, d]) => {
    const b = mesh(new RoundedBoxGeometry(w, h, d, 8, 0.08), materials.frame, [x, y, z]);
    b.castShadow = true;
    b.receiveShadow = true;
    caseGroup.add(b);
  });

  const psuShroud = mesh(new RoundedBoxGeometry(3.7, 0.75, 1.72, 8, 0.07), new THREE.MeshStandardMaterial({ color: '#0a0d13', roughness: 0.48, metalness: 0.8 }), [0.05, -1.94, 0.12]);
  psuShroud.castShadow = true;
  psuShroud.receiveShadow = true;
  caseGroup.add(psuShroud);

  const frontGlass = mesh(new RoundedBoxGeometry(0.1, 4.92, 1.64, 8, 0.08), materials.smokedGlass, [2.09, 0.05, 0.08]);
  frontGlass.castShadow = false;
  caseGroup.add(frontGlass);

  const sidePanel = mesh(new RoundedBoxGeometry(3.9, 5.05, 0.045, 8, 0.06), materials.glass, [2.95, -0.45, 1.55], [0.08, -0.76, -0.05]);
  sidePanel.castShadow = true;
  caseGroup.add(sidePanel);

  const topVent = new THREE.Group();
  for (let i = 0; i < 14; i += 1) {
    const line = mesh(new RoundedBoxGeometry(0.055, 0.035, 1.35, 4, 0.015), new THREE.MeshStandardMaterial({ color: '#05070a', roughness: 0.6, metalness: 0.6 }), [-1.55 + i * 0.24, 2.66, 0.07]);
    topVent.add(line);
  }
  caseGroup.add(topVent);

  const io = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const port = mesh(new RoundedBoxGeometry(0.12, 0.09, 0.025, 3, 0.012), materials.blackRubber, [-1.82, 1.95 - i * 0.18, -0.56]);
    io.add(port);
  }
  caseGroup.add(io);

  const feet = [[-1.55, -2.97, -0.54], [1.55, -2.97, -0.54], [-1.55, -2.97, 0.78], [1.55, -2.97, 0.78]];
  feet.forEach((p) => caseGroup.add(mesh(new RoundedBoxGeometry(0.58, 0.2, 0.42, 6, 0.08), materials.blackRubber, p)));

  const brand = makeLabelSprite('PRISM FORGE', '#8df7ff', 640, 130, 42);
  brand.position.set(1.86, 2.12, 0.72);
  brand.scale.set(1.35, 0.28, 1);
  brand.rotation.y = -Math.PI / 2;
  caseGroup.add(brand);
}

function createWorkbenchProps(parent) {
  const screwTray = new THREE.Group();
  const trayMat = new THREE.MeshStandardMaterial({ color: '#1b2431', roughness: 0.38, metalness: 0.72 });
  const tray = mesh(new RoundedBoxGeometry(1.3, 0.08, 0.78, 10, 0.08), trayMat, [-3.3, -2.37, 1.4]);
  screwTray.add(tray);
  for (let i = 0; i < 12; i += 1) {
    const screw = mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.035, 16), materials.darkMetal, [-3.78 + (i % 4) * 0.24, -2.28, 1.16 + Math.floor(i / 4) * 0.18], [Math.PI / 2, 0, 0]);
    screw.castShadow = true;
    screwTray.add(screw);
  }
  parent.add(screwTray);

  const driver = new THREE.Group();
  driver.position.set(-3.05, -2.34, -1.15);
  driver.rotation.z = -0.45;
  const handle = mesh(new RoundedBoxGeometry(0.28, 0.28, 1.25, 10, 0.13), new THREE.MeshStandardMaterial({ color: '#e23b61', roughness: 0.4, metalness: 0.18 }), [0, 0, 0]);
  handle.rotation.x = Math.PI / 2;
  const shaft = mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.25, 24), materials.darkMetal, [0, 0, 1.18], [Math.PI / 2, 0, 0]);
  const tip = mesh(new THREE.ConeGeometry(0.085, 0.28, 24), materials.darkMetal, [0, 0, 1.95], [Math.PI / 2, 0, 0]);
  driver.add(handle, shaft, tip);
  parent.add(driver);

  const mat = mesh(new RoundedBoxGeometry(2.15, 0.035, 1.35, 8, 0.04), new THREE.MeshStandardMaterial({ color: '#12203b', roughness: 0.74, metalness: 0.05, emissive: '#06172b', emissiveIntensity: 0.25 }), [3.15, -2.41, -1.35]);
  parent.add(mat);

  const boxes = new THREE.Group();
  boxes.position.set(-3.2, -2.2, -2.0);
  ['GPU', 'DDR5', 'AIO'].forEach((label, i) => {
    const box = mesh(new RoundedBoxGeometry(0.74, 0.48, 0.12, 6, 0.04), new THREE.MeshStandardMaterial({ color: i === 0 ? '#121b2b' : i === 1 ? '#211933' : '#10222a', roughness: 0.5, metalness: 0.18 }), [i * 0.82, i * 0.08, 0]);
    const sprite = makeLabelSprite(label, i === 0 ? '#63ffdd' : i === 1 ? '#ff5eea' : '#45f3ff', 320, 120, 58);
    sprite.position.set(i * 0.82, i * 0.08 + 0.02, 0.071);
    sprite.scale.set(0.52, 0.19, 1);
    boxes.add(box, sprite);
  });
  parent.add(boxes);
}

function createBackdrop(parent) {
  const wall = mesh(new THREE.PlaneGeometry(18, 10), new THREE.MeshStandardMaterial({ color: '#0b1220', roughness: 0.95, metalness: 0.05 }), [0, 1.4, -4.2]);
  wall.receiveShadow = true;
  parent.add(wall);

  const neonA = mesh(new RoundedBoxGeometry(0.04, 3.7, 0.04, 4, 0.02), emissiveMaterial('#38f8ff', 1.6), [-4.3, 0.8, -4.08], [0, 0, -0.55]);
  const neonB = mesh(new RoundedBoxGeometry(0.04, 2.8, 0.04, 4, 0.02), emissiveMaterial('#ff62d8', 1.4), [4.1, 1.2, -4.06], [0, 0, 0.48]);
  parent.add(neonA, neonB);
}

function createSlots() {
  Object.entries(slotDefs).forEach(([category, def]) => {
    const group = new THREE.Group();
    group.position.fromArray(def.pos);

    const glowMat = new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
    const wireMat = new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.48 });
    const ghost = mesh(new RoundedBoxGeometry(def.size[0], def.size[1], def.size[2], 6, 0.04), glowMat, [0, 0, 0]);
    ghost.userData.category = category;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(ghost.geometry), wireMat);
    edges.userData.category = category;
    group.add(ghost, edges);

    const hitbox = mesh(new THREE.BoxGeometry(def.size[0] + 0.08, def.size[1] + 0.08, Math.max(def.size[2], 0.42)), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), [0, 0, 0]);
    hitbox.userData.category = category;
    hitbox.userData.slotHitbox = true;
    group.add(hitbox);
    slotHitboxes.push(hitbox);

    const label = makeLabelSprite(def.label, def.color, 640, 130, 44);
    label.position.set(0, def.size[1] * 0.5 + 0.18, 0.08);
    label.scale.set(1.12, 0.23, 1);
    group.add(label);

    slotRoot.add(group);
    slots[category] = { group, ghost, edges, hitbox, label, glowMat, wireMat, def };
  });
}

function createThermalViz() {
  const cpuHeat = makeHeatSprite('#ffb000', '#ff3348');
  cpuHeat.position.set(-0.84, 1.08, 0.78);
  cpuHeat.scale.set(1.25, 1.25, 1);
  thermalGroup.add(cpuHeat);

  const gpuHeat = makeHeatSprite('#ff375f', '#ff9a3d');
  gpuHeat.position.set(-0.1, -0.66, 0.95);
  gpuHeat.scale.set(2.25, 0.8, 1);
  thermalGroup.add(gpuHeat);

  const airflow = new THREE.Group();
  for (let i = 0; i < 22; i += 1) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.64, -1.35 + i * 0.13, 0.42),
      new THREE.Vector3(0.7, -1.15 + i * 0.11, 0.55 + Math.sin(i) * 0.12),
      new THREE.Vector3(-0.7, -0.92 + i * 0.1, 0.48),
      new THREE.Vector3(-1.8, -0.78 + i * 0.08, 0.35),
    ]);
    const tube = mesh(new THREE.TubeGeometry(curve, 28, 0.008, 6, false), emissiveMaterial(i % 2 ? '#38f8ff' : '#8b5cf6', 0.8));
    tube.material.transparent = true;
    tube.material.opacity = 0.34;
    airflow.add(tube);
  }
  thermalGroup.add(airflow);
}

function createDust() {
  const count = 550;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 1] = -2 + Math.random() * 6;
    positions[i * 3 + 2] = -2.2 + Math.random() * 5;
    reusableColor.set(i % 3 === 0 ? '#38f8ff' : i % 3 === 1 ? '#ff62d8' : '#f8fbff');
    reusableColor.multiplyScalar(0.7 + Math.random() * 0.3);
    colors[i * 3] = reusableColor.r;
    colors[i * 3 + 1] = reusableColor.g;
    colors[i * 3 + 2] = reusableColor.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.018, vertexColors: true, transparent: true, opacity: 0.58, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat);
  dustGroup.add(points);
}

function createInstalledPart(category, part) {
  switch (category) {
    case 'motherboard': return createMotherboard(part);
    case 'cpu': return createCpu(part);
    case 'memory': return createMemory(part);
    case 'storage': return createStorage(part);
    case 'psu': return createPsu(part);
    case 'cooler': return createCooler(part);
    case 'gpu': return createGpu(part);
    case 'fans': return createFans(part);
    case 'cables': return createCables(part);
    default: return new THREE.Group();
  }
}

function createMotherboard(part) {
  const group = new THREE.Group();
  const boardMat = new THREE.MeshStandardMaterial({ color: part.color, roughness: 0.48, metalness: 0.18, envMapIntensity: 0.5 });
  const board = mesh(new RoundedBoxGeometry(2.55, 3.38, 0.085, 8, 0.04), boardMat, [0, 0, 0]);
  board.castShadow = true;
  board.receiveShadow = true;
  group.add(board);

  for (let i = 0; i < 28; i += 1) {
    const x = -1.05 + Math.random() * 2.1;
    const y = -1.42 + Math.random() * 2.85;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, y, 0.064),
      new THREE.Vector3(x + (Math.random() - 0.5) * 0.3, y + 0.18 + Math.random() * 0.2, 0.066),
      new THREE.Vector3(x + (Math.random() - 0.5) * 0.55, y + 0.42 + Math.random() * 0.3, 0.066),
    ]);
    const trace = mesh(new THREE.TubeGeometry(curve, 12, 0.006, 4, false), emissiveMaterial(i % 4 === 0 ? part.accent : '#31516b', i % 4 === 0 ? 0.7 : 0.12));
    group.add(trace);
  }

  const socket = mesh(new RoundedBoxGeometry(0.72, 0.72, 0.06, 6, 0.035), new THREE.MeshStandardMaterial({ color: '#cfd7e6', roughness: 0.28, metalness: 0.65 }), [-0.39, 0.66, 0.07]);
  const socketInner = mesh(new RoundedBoxGeometry(0.52, 0.52, 0.035, 5, 0.025), materials.blackRubber, [-0.39, 0.66, 0.115]);
  group.add(socket, socketInner);

  for (let i = 0; i < 4; i += 1) {
    const slot = mesh(new RoundedBoxGeometry(0.09, 1.36, 0.07, 4, 0.025), new THREE.MeshStandardMaterial({ color: '#0a0f17', roughness: 0.5, metalness: 0.6 }), [0.58 + i * 0.16, 0.58, 0.075]);
    const rim = mesh(new RoundedBoxGeometry(0.035, 1.48, 0.035, 3, 0.012), emissiveMaterial(i % 2 ? '#18283a' : part.accent, i % 2 ? 0.08 : 0.35), [0.58 + i * 0.16, 0.58, 0.118]);
    group.add(slot, rim);
  }

  for (let i = 0; i < 3; i += 1) {
    const pcie = mesh(new RoundedBoxGeometry(1.65, 0.095, 0.07, 4, 0.025), new THREE.MeshStandardMaterial({ color: '#080b10', roughness: 0.52, metalness: 0.55 }), [-0.12, -0.58 - i * 0.32, 0.075]);
    group.add(pcie);
  }

  const m2 = mesh(new RoundedBoxGeometry(1.03, 0.22, 0.065, 4, 0.025), new THREE.MeshStandardMaterial({ color: '#283241', roughness: 0.35, metalness: 0.72 }), [-0.2, -0.04, 0.085]);
  group.add(m2);

  const heatsinks = [
    [-0.86, 1.34, 0.48, 0.38], [-0.12, 1.36, 0.68, 0.3], [-1.0, 0.52, 0.28, 0.92], [0.72, -1.18, 0.76, 0.28],
  ];
  heatsinks.forEach(([x, y, w, h], i) => {
    const sink = mesh(new RoundedBoxGeometry(w, h, 0.12, 5, 0.025), new THREE.MeshStandardMaterial({ color: i === 3 ? '#202b3d' : '#182231', roughness: 0.3, metalness: 0.9 }), [x, y, 0.11]);
    group.add(sink);
    for (let f = 0; f < 5; f += 1) {
      const fin = mesh(new RoundedBoxGeometry(w * 0.82, 0.012, 0.045, 2, 0.004), materials.darkMetal, [x, y - h * 0.34 + f * h * 0.17, 0.19]);
      group.add(fin);
    }
  });

  [[-1.1, 1.5], [1.08, 1.5], [-1.1, -1.5], [1.08, -1.5], [1.08, 0.02], [-1.1, -0.02]].forEach(([x, y]) => {
    const screw = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.035, 20), materials.gold, [x, y, 0.11], [Math.PI / 2, 0, 0]);
    group.add(screw);
  });

  const label = makeLabelSprite(part.name, part.accent, 900, 120, 38);
  label.position.set(0.05, -1.58, 0.22);
  label.scale.set(1.38, 0.19, 1);
  group.add(label);
  return group;
}

function createCpu(part) {
  const group = new THREE.Group();
  const chip = mesh(new RoundedBoxGeometry(0.48, 0.48, 0.052, 6, 0.03), new THREE.MeshStandardMaterial({ color: '#0a0d11', roughness: 0.5, metalness: 0.45 }), [0, 0, 0]);
  const lid = mesh(new RoundedBoxGeometry(0.37, 0.37, 0.035, 5, 0.025), new THREE.MeshStandardMaterial({ color: '#cfd7df', roughness: 0.22, metalness: 0.95 }), [0, 0, 0.048]);
  const mark = makeLabelSprite(part.name.replace('Ryzen ', '').replace('Core ', ''), part.accent, 540, 140, 42);
  mark.position.set(0, 0, 0.085);
  mark.scale.set(0.42, 0.11, 1);
  group.add(chip, lid, mark);
  for (let i = 0; i < 32; i += 1) {
    const pin = mesh(new RoundedBoxGeometry(0.018, 0.018, 0.012, 2, 0.003), materials.gold, [-0.23 + (i % 8) * 0.066, -0.23 + Math.floor(i / 8) * 0.066, -0.035]);
    group.add(pin);
  }
  return group;
}

function createMemory(part) {
  const group = new THREE.Group();
  const count = part.sticks;
  for (let i = 0; i < count; i += 1) {
    const x = -0.11 + i * 0.27;
    const stick = mesh(new RoundedBoxGeometry(0.11, 1.34, 0.12, 5, 0.025), new THREE.MeshStandardMaterial({ color: part.color, roughness: 0.32, metalness: 0.65 }), [x, 0, 0]);
    const lightbar = mesh(new RoundedBoxGeometry(0.035, 1.22, 0.055, 4, 0.018), emissiveMaterial(part.accent, 1.8), [x, 0, 0.09]);
    rgbMaterials.push(lightbar.material);
    group.add(stick, lightbar);
  }
  return group;
}

function createStorage(part) {
  const group = new THREE.Group();
  const board = mesh(new RoundedBoxGeometry(0.92, 0.16, 0.045, 4, 0.015), new THREE.MeshStandardMaterial({ color: part.color, roughness: 0.5, metalness: 0.25 }), [0, 0, 0]);
  group.add(board);
  for (let i = 0; i < 4; i += 1) {
    const nand = mesh(new RoundedBoxGeometry(0.13, 0.1, 0.035, 3, 0.01), materials.blackRubber, [-0.3 + i * 0.18, 0, 0.04]);
    group.add(nand);
  }
  const shield = mesh(new RoundedBoxGeometry(0.55, 0.19, 0.05, 4, 0.015), new THREE.MeshStandardMaterial({ color: '#273447', roughness: 0.24, metalness: 0.92 }), [0.15, 0, 0.072]);
  group.add(shield);
  return group;
}

function createPsu(part) {
  const group = new THREE.Group();
  const body = mesh(new RoundedBoxGeometry(1.46, 0.66, 1.28, 8, 0.06), new THREE.MeshStandardMaterial({ color: part.color, roughness: 0.38, metalness: 0.78 }), [0, 0, 0]);
  body.castShadow = true;
  group.add(body);
  const fan = makeFanAssembly(0.34, part.accent, true);
  fan.position.set(0, 0.36, 0.06);
  fan.rotation.x = -Math.PI / 2;
  group.add(fan);
  const badge = makeLabelSprite(`${part.capacity}W`, part.accent, 500, 180, 72);
  badge.position.set(0, 0.0, 0.665);
  badge.scale.set(0.6, 0.18, 1);
  group.add(badge);
  return group;
}

function createCooler(part) {
  const group = new THREE.Group();
  if (part.type === 'aio') {
    const pump = mesh(new THREE.CylinderGeometry(0.39, 0.43, 0.22, 48), new THREE.MeshStandardMaterial({ color: part.color, roughness: 0.28, metalness: 0.72 }), [0, 0, 0], [Math.PI / 2, 0, 0]);
    const lcd = mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.025, 48), emissiveMaterial(part.accent, 1.55), [0, 0, 0.125], [Math.PI / 2, 0, 0]);
    rgbMaterials.push(lcd.material);
    group.add(pump, lcd);

    const radiator = mesh(new RoundedBoxGeometry(1.78, 0.28, 0.42, 6, 0.035), new THREE.MeshStandardMaterial({ color: '#080b10', roughness: 0.44, metalness: 0.78 }), [1.08, 1.46, 0.02]);
    group.add(radiator);
    for (let i = 0; i < 3; i += 1) {
      const fan = makeFanAssembly(0.23, part.accent, true);
      fan.position.set(0.49 + i * 0.43, 1.46, 0.265);
      group.add(fan);
    }
    const tubeA = tube([new THREE.Vector3(0.22, 0.1, 0.08), new THREE.Vector3(0.62, 0.88, 0.35), new THREE.Vector3(1.06, 1.29, 0.24)], '#10151d', 0.036);
    const tubeB = tube([new THREE.Vector3(0.06, 0.22, 0.1), new THREE.Vector3(0.48, 1.0, 0.48), new THREE.Vector3(0.82, 1.29, 0.16)], '#151923', 0.032);
    group.add(tubeA, tubeB);
  } else {
    for (let i = 0; i < 13; i += 1) {
      const fin = mesh(new RoundedBoxGeometry(0.82, 0.035, 0.62, 3, 0.008), new THREE.MeshStandardMaterial({ color: '#bdc7d5', roughness: 0.22, metalness: 0.92 }), [0, -0.36 + i * 0.06, 0.18]);
      group.add(fin);
    }
    const fan = makeFanAssembly(0.36, part.accent, true);
    fan.position.set(0, 0.05, 0.55);
    group.add(fan);
    for (let i = 0; i < 5; i += 1) {
      const pipe = tube([new THREE.Vector3(-0.32 + i * 0.16, -0.33, 0.02), new THREE.Vector3(-0.32 + i * 0.16, 0.35, 0.24)], '#ce7a3a', 0.018);
      group.add(pipe);
    }
  }
  return group;
}

function createGpu(part) {
  const group = new THREE.Group();
  const body = mesh(new RoundedBoxGeometry(2.66, 0.62, 0.36, 8, 0.06), new THREE.MeshStandardMaterial({ color: part.color, roughness: 0.34, metalness: 0.72, map: textureCache.carbon }), [0, 0, 0]);
  body.castShadow = true;
  group.add(body);
  const backplate = mesh(new RoundedBoxGeometry(2.45, 0.48, 0.05, 5, 0.025), new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.24, metalness: 0.88 }), [0.05, 0, -0.22]);
  group.add(backplate);
  for (let i = 0; i < 3; i += 1) {
    const fan = makeFanAssembly(0.24, part.accent, true);
    fan.position.set(-0.82 + i * 0.82, 0.0, 0.23);
    group.add(fan);
  }
  const lightbar = mesh(new RoundedBoxGeometry(2.24, 0.055, 0.055, 5, 0.022), emissiveMaterial(part.accent, 1.8), [0, 0.35, 0.1]);
  rgbMaterials.push(lightbar.material);
  group.add(lightbar);
  const bracket = mesh(new RoundedBoxGeometry(0.08, 0.82, 0.22, 5, 0.02), materials.darkMetal, [-1.45, 0, 0.04]);
  group.add(bracket);
  const label = makeLabelSprite(part.name.replace('RTX ', '').replace('Radeon ', ''), part.accent, 800, 130, 48);
  label.position.set(0.2, -0.01, 0.43);
  label.scale.set(0.95, 0.16, 1);
  group.add(label);
  return group;
}

function createFans(part) {
  const group = new THREE.Group();
  const ys = part.count === 2 ? [-0.58, 0.58] : [-1.05, 0, 1.05];
  ys.forEach((y) => {
    const fan = makeFanAssembly(0.39, part.accent, true);
    fan.position.set(0, y, 0.0);
    group.add(fan);
  });
  const railA = mesh(new RoundedBoxGeometry(0.08, 3.18, 0.08, 4, 0.025), materials.darkMetal, [-0.36, 0, -0.03]);
  const railB = mesh(new RoundedBoxGeometry(0.08, 3.18, 0.08, 4, 0.025), materials.darkMetal, [0.36, 0, -0.03]);
  group.add(railA, railB);
  return group;
}

function createCables(part) {
  const group = new THREE.Group();
  const colors = part.id === 'rgb-flow' ? ['#ff6bd6', '#38f8ff', '#8b5cf6'] : [part.color, part.accent, '#cbd5e1'];
  const curves = [
    [new THREE.Vector3(0.73, -1.62, 0.0), new THREE.Vector3(0.05, -1.0, 0.52), new THREE.Vector3(0.78, 0.55, 0.36)],
    [new THREE.Vector3(0.55, -1.58, 0.12), new THREE.Vector3(-0.5, -1.23, 0.62), new THREE.Vector3(-1.15, 1.34, 0.32)],
    [new THREE.Vector3(0.72, -1.56, 0.22), new THREE.Vector3(0.15, -1.06, 0.78), new THREE.Vector3(0.75, -0.68, 0.48)],
    [new THREE.Vector3(0.5, -1.62, -0.03), new THREE.Vector3(-0.1, -0.3, 0.78), new THREE.Vector3(-0.88, 0.98, 0.42)],
  ];
  curves.forEach((points, i) => {
    for (let lane = 0; lane < 4; lane += 1) {
      const shifted = points.map((p) => p.clone().add(new THREE.Vector3(lane * 0.025, 0, lane * 0.018)));
      const cable = tube(shifted, colors[(i + lane) % colors.length], 0.014);
      if (part.id === 'rgb-flow') {
        cable.material.emissiveIntensity = 1.25;
        rgbMaterials.push(cable.material);
      }
      group.add(cable);
    }
  });

  for (let i = 0; i < 5; i += 1) {
    const comb = mesh(new RoundedBoxGeometry(0.34, 0.04, 0.08, 3, 0.01), new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.35, metalness: 0.15 }), [0.28 - i * 0.18, -0.78 + i * 0.25, 0.63]);
    comb.rotation.z = 0.75;
    group.add(comb);
  }
  return group;
}

function makeFanAssembly(radius = 0.35, accent = '#38f8ff', animate = false) {
  const group = new THREE.Group();
  const ring = mesh(new THREE.TorusGeometry(radius, radius * 0.055, 10, 64), new THREE.MeshStandardMaterial({ color: '#05080d', roughness: 0.35, metalness: 0.8 }), [0, 0, 0]);
  const glow = mesh(new THREE.TorusGeometry(radius * 0.86, radius * 0.018, 8, 64), emissiveMaterial(accent, 0.85), [0, 0, 0.018]);
  rgbMaterials.push(glow.material);
  group.add(ring, glow);

  const bladeGroup = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const blade = mesh(new RoundedBoxGeometry(radius * 0.17, radius * 0.72, radius * 0.035, 4, radius * 0.025), new THREE.MeshStandardMaterial({ color: '#151d29', roughness: 0.42, metalness: 0.55 }), [0, radius * 0.28, 0.03]);
    blade.rotation.z = (i / 7) * Math.PI * 2 + 0.35;
    bladeGroup.add(blade);
  }
  const hub = mesh(new THREE.CylinderGeometry(radius * 0.18, radius * 0.18, radius * 0.08, 32), new THREE.MeshStandardMaterial({ color: '#0b0f17', roughness: 0.35, metalness: 0.85 }), [0, 0, 0.04], [Math.PI / 2, 0, 0]);
  bladeGroup.add(hub);
  group.add(bladeGroup);
  if (animate) animatedFans.push(bladeGroup);
  return group;
}

function installPart(category, { silent = false } = {}) {
  const part = state.selected[category];
  const check = canInstall(category);
  if (!check.ok) {
    notify(check.reason, 'warn');
    addLog(`⚠ ${CATEGORY_LABELS[category]} blocked: ${check.reason}`);
    return false;
  }

  if (state.installed[category]?.id === part.id) {
    notify(`${part.name} is already installed.`, 'info');
    return true;
  }

  const previous = installedRoot.getObjectByName(`part-${category}`);
  if (previous) installedRoot.remove(previous);

  const group = createInstalledPart(category, part);
  group.name = `part-${category}`;
  group.userData.category = category;
  group.userData.home = new THREE.Vector3().fromArray(slotDefs[category].pos);
  group.userData.explode = new THREE.Vector3().fromArray(slotDefs[category].explode);
  group.userData.installing = true;
  group.position.copy(group.userData.home).add(new THREE.Vector3(0, 0.2, 1.15));
  group.scale.setScalar(0.22);
  group.traverse((obj) => {
    obj.userData.category = category;
    if (obj.isMesh) {
      obj.castShadow = obj.castShadow !== false;
      obj.receiveShadow = true;
    }
  });
  installedRoot.add(group);
  state.installed[category] = part;

  const home = group.userData.home.clone();
  const start = group.position.clone();
  tween(0.62, (t) => {
    const e = easeOutBack(t);
    group.position.lerpVectors(start, home, e);
    group.scale.setScalar(THREE.MathUtils.lerp(0.22, 1, e));
  }, () => { group.userData.installing = false; });

  addLog(`✓ Installed ${part.name} into the ${slotDefs[category].label}.`);
  if (!silent) notify(`${part.name} installed`, 'success');
  state.selectedCategory = nextOpenCategory() || category;
  updateAfterStateChange();
  if (REQUIRED_TO_POWER.every((cat) => state.installed[cat]) && !state.powered) {
    addLog('Assembly complete. Ready for first POST.');
    notify('All critical parts are installed. Power it on!', 'success');
  }
  return true;
}

function canInstall(category) {
  const part = state.selected[category];
  if (!part) return { ok: false, reason: 'No selected part.' };
  const prereq = prerequisites(category).filter((cat) => !state.installed[cat]);
  if (prereq.length) return { ok: false, reason: `Install ${prereq.map((c) => CATEGORY_LABELS[c]).join(', ')} first.` };

  // Validate the part being installed against the parts that are already in the build.
  // Do not block a motherboard install just because an uninstalled future CPU selection is incompatible.
  const compatibility = checkCompatibility({ source: { ...state.installed, [category]: part } });
  const categoryIssues = compatibility.byCategory[category] || [];
  if (categoryIssues.length) return { ok: false, reason: categoryIssues[0] };
  return { ok: true, reason: 'Ready to install.' };
}

function prerequisites(category) {
  return {
    motherboard: [],
    cpu: ['motherboard'],
    memory: ['motherboard'],
    storage: ['motherboard'],
    psu: [],
    cooler: ['motherboard', 'cpu'],
    gpu: ['motherboard', 'psu'],
    fans: [],
    cables: ['motherboard', 'psu', 'gpu'],
  }[category] || [];
}

function checkCompatibility({ includeSelected = true, source: explicitSource = null } = {}) {
  const source = explicitSource || (includeSelected ? { ...state.selected } : { ...state.installed });
  const warnings = [];
  const byCategory = {};
  const add = (cats, message) => {
    warnings.push(message);
    cats.forEach((cat) => {
      byCategory[cat] ||= [];
      byCategory[cat].push(message);
    });
  };
  const mb = source.motherboard;
  const cpu = source.cpu;
  const mem = source.memory;
  const storage = source.storage;
  const psu = source.psu;
  const cooler = source.cooler;
  const gpu = source.gpu;
  const fans = source.fans;

  if (mb && cpu && mb.socket !== cpu.socket) add(['motherboard', 'cpu'], `${cpu.name} uses ${cpu.socket}, but ${mb.name} is ${mb.socket}.`);
  if (mb && mem && mb.memoryType !== mem.memoryType) add(['motherboard', 'memory'], `${mem.name} is ${mem.memoryType}, but ${mb.name} requires ${mb.memoryType}.`);
  if (mb && storage && !mb.storage.includes(storage.interface)) add(['motherboard', 'storage'], `${storage.name} requires ${storage.interface}, not supported by ${mb.name}.`);
  if (mb && cooler && !cooler.sockets.includes(mb.socket)) add(['motherboard', 'cooler'], `${cooler.name} does not include a ${mb.socket} mounting kit.`);
  if (cooler?.radiator && cooler.radiator > CASE_SPEC.maxRadiator) add(['cooler'], `${cooler.name} has a ${cooler.radiator}mm radiator; case supports ${CASE_SPEC.maxRadiator}mm.`);
  if (gpu && gpu.length > CASE_SPEC.maxGpuLength) add(['gpu'], `${gpu.name} is ${gpu.length}mm; case clearance is ${CASE_SPEC.maxGpuLength}mm.`);
  if (fans && fans.size !== CASE_SPEC.fanSize) add(['fans'], `${fans.name} uses ${fans.size}mm fans; this case rail is tuned for ${CASE_SPEC.fanSize}mm.`);
  if (psu && psu.form !== CASE_SPEC.psuForm) add(['psu'], `${psu.name} form factor ${psu.form} will not mount in this bay.`);

  const demand = totalWatts(source);
  if (psu && demand > psu.capacity * 0.78) add(['psu', 'gpu', 'cpu'], `${psu.name} leaves too little headroom for a ${demand}W configuration.`);
  if (cpu && cooler && cpu.watts > 150 && cooler.perf < 70) add(['cpu', 'cooler'], `${cooler.name} cannot comfortably cool ${cpu.name}.`);
  return { warnings, byCategory };
}

function totalWatts(source = state.installed) {
  return Object.entries(source).reduce((sum, [category, part]) => sum + (category === 'psu' ? 0 : part?.watts || 0), 0);
}

function metrics() {
  const installed = Object.values(state.installed);
  const selectedAll = Object.values(state.selected);
  const perf = installed.reduce((sum, part) => sum + (part.perf || 0), 0);
  const watts = totalWatts(state.installed);
  const budget = installed.reduce((sum, part) => sum + (part.price || 0), 0);
  const selectedBudget = selectedAll.reduce((sum, part) => sum + (part.price || 0), 0);
  const cooler = state.installed.cooler;
  const fans = state.installed.fans;
  const cpu = state.installed.cpu;
  const gpu = state.installed.gpu;
  const heatLoad = (cpu?.watts || 0) + (gpu?.watts || 0) * 0.8;
  const cooling = (cooler?.perf || 0) * 2.1 + (fans?.perf || 0) * 0.9 + 80;
  const thermalScore = installed.length ? Math.round(THREE.MathUtils.clamp(100 - Math.max(0, heatLoad - cooling) * 0.17, 42, 99)) : 0;
  return { perf, watts, budget, selectedBudget, thermalScore };
}

function powerOnToggle(force) {
  const desired = typeof force === 'boolean' ? force : !state.powered;
  if (desired) {
    const missing = REQUIRED_TO_POWER.filter((cat) => !state.installed[cat]);
    const compat = checkCompatibility({ includeSelected: false });
    if (missing.length) {
      notify(`Missing: ${missing.map((c) => CATEGORY_LABELS[c]).join(', ')}`, 'warn');
      addLog(`POST halted: missing ${missing.map((c) => CATEGORY_LABELS[c]).join(', ')}.`);
      return false;
    }
    if (compat.warnings.length) {
      notify('Compatibility warnings must be resolved before power-on.', 'warn');
      addLog(`POST halted: ${compat.warnings[0]}`);
      return false;
    }
    state.powered = true;
    addLog('⚡ First POST successful. RGB profile synchronized and fans ramped.');
    notify('First POST successful — system is alive.', 'success');
  } else {
    state.powered = false;
    addLog('System powered down safely.');
    notify('Power off', 'info');
  }
  updateAfterStateChange();
  return true;
}

function autoBuild(animated = true) {
  const defaults = {
    motherboard: 'aurora-x670e',
    cpu: 'ryzen-9950x3d',
    memory: 'ddr5-royal-64',
    storage: 'gen5-4tb',
    psu: 'titanium-1200',
    cooler: 'novaloop-360',
    gpu: 'rtx-5090-prism',
    fans: 'halo-120-pack',
    cables: 'rgb-flow',
  };
  Object.entries(defaults).forEach(([category, id]) => {
    state.selected[category] = PARTS[category].find((p) => p.id === id) || PARTS[category][0];
  });
  updateAfterStateChange();

  const queue = [...CATEGORY_ORDER];
  const step = () => {
    const category = queue.shift();
    if (!category) {
      powerOnToggle(true);
      return;
    }
    selectCategory(category, false);
    installPart(category, { silent: true });
    if (animated) window.setTimeout(step, 260);
    else step();
  };
  step();
}

function resetBuild() {
  Object.keys(state.installed).forEach((category) => {
    const group = installedRoot.getObjectByName(`part-${category}`);
    if (group) installedRoot.remove(group);
  });
  state.installed = {};
  state.powered = false;
  state.exploded = false;
  state.thermal = false;
  state.selectedCategory = 'motherboard';
  state.log = ['Workbench reset. Start with the motherboard tray.'];
  thermalGroup.visible = false;
  selectCategory('motherboard', false);
  updateAfterStateChange();
  notify('Build bench reset', 'info');
}

function guidedStep() {
  const category = nextOpenCategory();
  if (!category) {
    powerOnToggle(true);
    return;
  }
  selectCategory(category);
  notify(`Guided step: install ${CATEGORY_LABELS[category]}`, 'info');
}

function nextOpenCategory() {
  return CATEGORY_ORDER.find((category) => !state.installed[category]);
}

function updateAfterStateChange() {
  renderAllUI();
  updateSlotVisuals(0);
}

function renderAllUI() {
  renderCatalog();
  renderCompatibility();
  renderMetrics();
  renderSteps();
  renderLog();
  document.querySelector('#powerBtn').textContent = state.powered ? 'Power off' : 'Power on';
  document.querySelector('#explodeBtn').classList.toggle('active', state.exploded);
  document.querySelector('#thermalBtn').classList.toggle('active', state.thermal);
  document.querySelector('#qualityBtn').classList.toggle('active', state.cinematic);
}

function renderCatalog() {
  catalogEl.innerHTML = CATEGORY_ORDER.map((category) => {
    const selected = state.selected[category];
    const installed = state.installed[category];
    const prereq = prerequisites(category).filter((cat) => !state.installed[cat]);
    return `<section class="catalog-section ${state.selectedCategory === category ? 'selected-section' : ''}" data-category="${category}">
      <div class="catalog-heading">
        <span>${CATEGORY_LABELS[category]}</span>
        <strong>${installed ? 'Installed' : prereq.length ? 'Locked' : 'Ready'}</strong>
      </div>
      <div class="part-options">
        ${PARTS[category].map((part) => {
          const isSelected = selected?.id === part.id;
          const isInstalled = installed?.id === part.id;
          const oldSelection = state.selected[category];
          state.selected[category] = part;
          const issues = checkCompatibility({ includeSelected: true }).byCategory[category] || [];
          state.selected[category] = oldSelection;
          return `<button type="button" class="part-card ${isSelected ? 'selected' : ''} ${isInstalled ? 'installed' : ''} ${issues.length ? 'warning' : ''}" data-category="${category}" data-part="${part.id}" style="--accent:${part.accent}">
            <span class="part-topline"><span>${part.name}</span><b>$${part.price}</b></span>
            <small>${part.subtitle}</small>
            <span class="part-stats"><span>${part.perf || 0} perf</span><span>${part.watts || part.capacity || 0}${part.capacity ? 'W PSU' : 'W'}</span>${issues.length ? '<span>⚠ fit</span>' : ''}</span>
          </button>`;
        }).join('')}
      </div>
    </section>`;
  }).join('');

  catalogEl.querySelectorAll('.part-card').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      const part = PARTS[category].find((p) => p.id === button.dataset.part);
      state.selected[category] = part;
      selectCategory(category);
      addLog(`Selected ${part.name}. Click the glowing ${slotDefs[category].label}.`);
      updateAfterStateChange();
    });
  });
}

function renderCompatibility() {
  const check = checkCompatibility({ includeSelected: true });
  if (!check.warnings.length) {
    compatibilityEl.innerHTML = '<div class="compat-pass"><span>Compatibility clear</span><strong>All selected parts fit</strong></div>';
    return;
  }
  compatibilityEl.innerHTML = `<div class="compat-warn"><span>Compatibility warnings</span>${check.warnings.map((w) => `<p>${w}</p>`).join('')}</div>`;
}

function renderMetrics() {
  const m = metrics();
  perfEl.textContent = String(m.perf);
  wattEl.textContent = `${m.watts}W`;
  budgetEl.textContent = `$${m.budget.toLocaleString()}`;
  thermalEl.textContent = m.thermalScore ? `${m.thermalScore}%` : '—';
  const installedCount = Object.keys(state.installed).length;
  const compat = checkCompatibility({ includeSelected: false });
  const grade = !installedCount ? 'Bench Mode' : compat.warnings.length ? 'Needs Fit Check' : state.powered ? 'S-Tier POST' : installedCount === CATEGORY_ORDER.length ? 'Ready to POST' : 'In Progress';
  gradeEl.textContent = grade;
}

function renderSteps() {
  const installedCount = CATEGORY_ORDER.filter((cat) => state.installed[cat]).length;
  progressTextEl.textContent = `${installedCount}/${CATEGORY_ORDER.length}`;
  stepListEl.innerHTML = CATEGORY_ORDER.map((category) => {
    const installed = state.installed[category];
    const selected = state.selected[category];
    const ready = canInstall(category).ok;
    return `<li class="${installed ? 'done' : state.selectedCategory === category ? 'current' : ready ? 'ready' : 'locked'}">
      <span>${CATEGORY_LABELS[category]}</span>
      <small>${installed ? installed.name : ready ? `Install ${selected.name}` : 'Prerequisite locked'}</small>
    </li>`;
  }).join('');
}

function renderLog() {
  logEl.innerHTML = state.log.slice(-8).map((entry) => `<p>${entry}</p>`).join('');
  logEl.scrollTop = logEl.scrollHeight;
}

function addLog(entry) {
  state.log.push(entry);
  if (state.log.length > 30) state.log.shift();
  renderLog();
}

function notify(message, type = 'info') {
  toastEl.textContent = message;
  toastEl.className = `show ${type}`;
  window.clearTimeout(notify.timeout);
  notify.timeout = window.setTimeout(() => toastEl.className = '', 2400);
}

function selectCategory(category, announce = true) {
  state.selectedCategory = category;
  if (announce) notify(`Selected ${CATEGORY_LABELS[category]}`, 'info');
  updateAfterStateChange();
}

function updateSlotVisuals(elapsed) {
  const selected = state.selectedCategory;
  const pulse = 0.5 + Math.sin(elapsed * 4.2) * 0.5;
  outlinePass.selectedObjects = [];
  Object.entries(slots).forEach(([category, slot]) => {
    const installed = !!state.installed[category];
    const can = canInstall(category).ok;
    const active = selected === category;
    const hover = state.hoverCategory === category;
    const baseOpacity = installed ? 0.025 : can ? 0.11 : 0.045;
    slot.glowMat.opacity = active ? 0.25 + pulse * 0.22 : hover ? 0.22 : baseOpacity;
    slot.wireMat.opacity = active ? 0.86 : hover ? 0.72 : installed ? 0.08 : can ? 0.36 : 0.14;
    slot.label.material.opacity = installed ? 0.18 : active ? 0.95 : 0.5;
    slot.group.scale.setScalar(active ? 1 + pulse * 0.012 : 1);
    slot.glowMat.color.set(can ? slot.def.color : '#5b6472');
    slot.wireMat.color.set(can ? slot.def.color : '#5b6472');
    if (active || hover) outlinePass.selectedObjects.push(slot.ghost);
  });
}

function updateInstalledTransforms(delta) {
  installedRoot.children.forEach((group) => {
    if (!group.userData.home || group.userData.installing) return;
    const target = group.userData.home.clone();
    if (state.exploded) target.add(group.userData.explode);
    group.position.lerp(target, 1 - Math.pow(0.0001, delta));
  });
}

function updateTweens(delta) {
  for (let i = tweens.length - 1; i >= 0; i -= 1) {
    const item = tweens[i];
    item.elapsed += delta;
    const t = Math.min(1, item.elapsed / item.duration);
    item.update(t);
    if (t >= 1) {
      tweens.splice(i, 1);
      item.complete?.();
    }
  }
}

function tween(duration, update, complete) {
  tweens.push({ duration, elapsed: 0, update, complete });
}

function onPointerMove(event) {
  setMouse(event);
  raycaster.setFromCamera(mouse, camera);
  const intersections = raycaster.intersectObjects(slotHitboxes, true);
  state.hoverCategory = intersections.length ? getCategoryFromObject(intersections[0].object) : null;
  renderer.domElement.style.cursor = state.hoverCategory ? 'pointer' : 'grab';
}

function onPointerDown(event) {
  setMouse(event);
  raycaster.setFromCamera(mouse, camera);
  const intersections = raycaster.intersectObjects(slotHitboxes, true);
  if (!intersections.length) return;
  const category = getCategoryFromObject(intersections[0].object);
  if (!category) return;
  selectCategory(category, false);
  installPart(category);
}

function setMouse(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function getCategoryFromObject(object) {
  let current = object;
  while (current) {
    if (current.userData?.category) return current.userData.category;
    current = current.parent;
  }
  return null;
}

function handleKey(event) {
  if (event.target?.tagName === 'BUTTON') return;
  const key = event.key.toLowerCase();
  if (key === 'a') autoBuild(true);
  if (key === 'p') powerOnToggle();
  if (key === 'x') toggleExploded();
  if (key === 't') toggleThermal();
  if (key === 'g') guidedStep();
  const idx = Number(key);
  if (idx >= 1 && idx <= CATEGORY_ORDER.length) selectCategory(CATEGORY_ORDER[idx - 1]);
}

function toggleExploded(force) {
  state.exploded = typeof force === 'boolean' ? force : !state.exploded;
  addLog(state.exploded ? 'Exploded view enabled: every part floats to its inspection offset.' : 'Exploded view collapsed back into the chassis.');
  updateAfterStateChange();
}

function toggleThermal(force) {
  state.thermal = typeof force === 'boolean' ? force : !state.thermal;
  thermalGroup.visible = state.thermal;
  addLog(state.thermal ? 'Thermal scan enabled: airflow and heat sources visualized.' : 'Thermal scan disabled.');
  updateAfterStateChange();
}

function toggleQuality() {
  state.cinematic = !state.cinematic;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, state.cinematic ? 1.85 : 1.15));
  bloomPass.enabled = state.cinematic;
  renderer.toneMappingExposure = state.cinematic ? 1.10 : 1.0;
  addLog(state.cinematic ? 'Cinematic quality enabled: bloom, high DPR, ACES exposure.' : 'Performance quality enabled: lighter render path.');
  updateAfterStateChange();
}

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.getElapsedTime();
  updateTweens(delta);
  updateInstalledTransforms(delta);
  controls.update();
  updateSlotVisuals(elapsed);

  animatedFans.forEach((fan, index) => {
    const speed = state.powered ? 11 + index * 0.22 : 0.9;
    fan.rotation.z += delta * speed;
  });
  rgbMaterials.forEach((mat, index) => {
    if (!mat.emissive) return;
    const pulse = state.powered ? 0.32 + Math.sin(elapsed * 2.7 + index) * 0.13 : 0.13 + Math.sin(elapsed * 1.2 + index) * 0.03;
    mat.emissiveIntensity = Math.max(0.08, pulse);
  });
  dustGroup.rotation.y = Math.sin(elapsed * 0.08) * 0.025;
  thermalGroup.children.forEach((child, index) => {
    child.position.y += Math.sin(elapsed * 2 + index) * 0.0007;
  });

  composer.render();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  outlinePass.setSize(window.innerWidth, window.innerHeight);
  bloomPass.setSize(window.innerWidth, window.innerHeight);
}

renderer.domElement.addEventListener('pointermove', onPointerMove);
renderer.domElement.addEventListener('pointerdown', onPointerDown);
window.addEventListener('keydown', handleKey);
window.addEventListener('resize', onResize);
document.querySelector('#guidedStepBtn').addEventListener('click', guidedStep);
document.querySelector('#autoBuildBtn').addEventListener('click', () => autoBuild(true));
document.querySelector('#resetBtn').addEventListener('click', resetBuild);
document.querySelector('#powerBtn').addEventListener('click', () => powerOnToggle());
document.querySelector('#explodeBtn').addEventListener('click', () => toggleExploded());
document.querySelector('#thermalBtn').addEventListener('click', () => toggleThermal());
document.querySelector('#qualityBtn').addEventListener('click', toggleQuality);

window.__PC_SIM__ = {
  getState: () => ({
    selectedCategory: state.selectedCategory,
    selected: Object.fromEntries(Object.entries(state.selected).map(([k, v]) => [k, v.id])),
    installed: Object.fromEntries(Object.entries(state.installed).map(([k, v]) => [k, v.id])),
    powered: state.powered,
    exploded: state.exploded,
    thermal: state.thermal,
    metrics: metrics(),
    compatibility: checkCompatibility({ includeSelected: false }).warnings,
    errors: [...state.errors],
  }),
  select: (category, id) => {
    const part = PARTS[category]?.find((p) => p.id === id);
    if (!part) return false;
    state.selected[category] = part;
    selectCategory(category, false);
    updateAfterStateChange();
    return true;
  },
  install: (category) => installPart(category, { silent: true }),
  autoBuild: (instant = true) => autoBuild(!instant),
  power: (force) => powerOnToggle(force),
  reset: resetBuild,
  toggleExploded,
  toggleThermal,
  nextOpenCategory,
};

animate();

function mesh(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.fromArray(position);
  object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function tube(points, color, radius = 0.02) {
  const curve = new THREE.CatmullRomCurve3(points);
  const mat = color.startsWith('#') ? new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.35, emissive: color, emissiveIntensity: 0.12 }) : materials.blackRubber;
  return mesh(new THREE.TubeGeometry(curve, 44, radius, 9, false), mat);
}

function emissiveMaterial(color, intensity = 1) {
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.25, metalness: 0.35 });
  return mat;
}

function makeLabelSprite(text, color = '#ffffff', width = 512, height = 128, fontSize = 48) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, 'rgba(5, 12, 24, 0)');
  gradient.addColorStop(0.18, 'rgba(5, 12, 24, 0.72)');
  gradient.addColorStop(0.82, 'rgba(5, 12, 24, 0.72)');
  gradient.addColorStop(1, 'rgba(5, 12, 24, 0)');
  ctx.fillStyle = gradient;
  roundRect(ctx, 10, 14, width - 20, height - 28, 24);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, width / 2, height / 2 + 2, width - 54);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  return new THREE.Sprite(material);
}

function makeHeatSprite(inner, outer) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 128);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.34, outer);
  gradient.addColorStop(1, 'rgba(255,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.68, blending: THREE.AdditiveBlending, depthWrite: false });
  return new THREE.Sprite(mat);
}

function makeBrushedTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#111721';
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 1) {
    const value = 18 + Math.random() * 35;
    ctx.fillStyle = `rgba(${value}, ${value + 8}, ${value + 16}, ${0.16 + Math.random() * 0.2})`;
    ctx.fillRect(0, y, 256, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeCarbonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) {
    for (let x = 0; x < 256; x += 16) {
      ctx.fillStyle = (x / 16 + y / 16) % 2 === 0 ? '#131a24' : '#080c12';
      ctx.fillRect(x, y, 16, 16);
      ctx.fillStyle = 'rgba(255,255,255,0.035)';
      ctx.fillRect(x, y, 16, 2);
      ctx.fillRect(x, y, 2, 16);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeBenchTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 512, 256);
  gradient.addColorStop(0, '#20182a');
  gradient.addColorStop(0.5, '#342845');
  gradient.addColorStop(1, '#151b2a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 450; i += 1) {
    const a = Math.random() * 0.13;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 256, 1 + Math.random() * 3, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
